import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findChrome() {
  const playwrightRoot = process.env.PLAYWRIGHT_BROWSERS_PATH;
  const candidates = [
    process.env.CHROME_PATH,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    // 컨테이너 개발 환경에는 Playwright가 받아 둔 Chromium만 있는 경우가 많다.
    playwrightRoot ? join(playwrightRoot, 'chromium') : null,
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate));
}

/**
 * Chrome 실행 인자.
 *
 * --no-sandbox: Chrome은 root로 돌 때 샌드박스를 켜면 시작하자마자 죽는다
 * (「Running as root without --no-sandbox is not supported」). 컨테이너에서
 * 이 검사를 돌리면 여기에 걸린다. 권한을 낮출 수 없는 root 환경에서만 붙이고,
 * 일반 사용자 계정에서는 샌드박스를 그대로 둔다.
 *
 * --no-proxy-server: 이 검사는 127.0.0.1의 개발 서버만 연다. 그런데 환경 변수로
 * HTTP 프록시가 잡혀 있으면 Chrome이 그 주소까지 프록시로 보내 모듈 스크립트가
 * ERR_TUNNEL_CONNECTION_FAILED로 죽고, 화면이 빈 채로 남아 선택자를 기다리다
 * 시간이 초과된다. 프록시가 없는 곳에서는 아무 일도 하지 않는 인자다.
 */
function chromeLaunchArgs(userDataDir, url) {
  const runningAsRoot = typeof process.getuid === 'function' && process.getuid() === 0;
  return [
    '--headless=new',
    '--disable-gpu',
    ...(runningAsRoot ? ['--no-sandbox'] : []),
    '--no-proxy-server',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    url,
  ];
}

async function getFreePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : null;
  await new Promise((resolve) => server.close(resolve));
  if (!port) throw new Error('테스트용 포트를 확보하지 못했습니다.');
  return port;
}

async function waitForHttp(url, child, diagnostics) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`Vite가 조기 종료되었습니다.\n${diagnostics()}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // 서버가 포트를 열 때까지 기다린다.
    }
    await sleep(250);
  }
  throw new Error(`Vite 응답을 기다리는 시간이 초과되었습니다.\n${diagnostics()}`);
}

async function waitForDevToolsPort(userDataDir, chrome) {
  const activePortFile = join(userDataDir, 'DevToolsActivePort');
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (chrome.exitCode !== null) throw new Error('Chrome이 조기 종료되었습니다.');
    if (existsSync(activePortFile)) {
      const [portText] = readFileSync(activePortFile, 'utf8').trim().split(/\r?\n/);
      const port = Number(portText);
      if (Number.isInteger(port) && port > 0) return port;
    }
    await sleep(250);
  }
  throw new Error('Chrome DevTools 포트를 찾지 못했습니다.');
}

async function waitForTarget(port) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const target = targets.find((item) => item.type === 'page' && item.url.includes('lesson=m1-l1'));
      if (target) return target;
    } catch {
      // 페이지가 만들어질 때까지 기다린다.
    }
    await sleep(250);
  }
  throw new Error('학습 화면의 Chrome 대상 페이지를 찾지 못했습니다.');
}

function connectCdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  let sequence = 0;
  const pending = new Map();

  const opened = new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  });

  return {
    opened,
    close: () => socket.close(),
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++sequence;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
  };
}

async function evaluate(cdp, expression) {
  const response = await cdp.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
  return response.result.value;
}

async function captureScreenshot(cdp, name) {
  const artifactDir = process.env.MOBILE_LAYOUT_ARTIFACT_DIR;
  if (!artifactDir) return;
  mkdirSync(artifactDir, { recursive: true });
  const result = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: false,
    fromSurface: true,
  });
  writeFileSync(join(artifactDir, `${name}.png`), Buffer.from(result.data, 'base64'));
}

async function waitForSelector(cdp, selector) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (await evaluate(cdp, `Boolean(document.querySelector(${JSON.stringify(selector)}))`)) return;
    await sleep(250);
  }
  throw new Error(`선택자를 기다리는 시간이 초과되었습니다: ${selector}`);
}

async function reloadAndWait(cdp) {
  const marker = `layout-audit-${Date.now()}-${Math.random()}`;
  await evaluate(cdp, `window.__layoutAuditBeforeReload = ${JSON.stringify(marker)}`);
  await cdp.send('Page.reload', { ignoreCache: true });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const ready = await evaluate(cdp, `document.readyState === 'complete'
        && window.__layoutAuditBeforeReload !== ${JSON.stringify(marker)}
        && Boolean(document.querySelector('.micro-lesson-frame'))`);
      if (ready) {
        await sleep(250);
        return;
      }
    } catch {
      // 새 문서 컨텍스트로 전환되는 동안의 일시 오류는 다시 확인한다.
    }
    await sleep(100);
  }
  throw new Error('학습 화면을 다시 불러오는 시간이 초과되었습니다.');
}

async function navigateAndWait(cdp, url, readySelector = '.micro-lesson-frame') {
  const marker = `layout-navigation-${Date.now()}-${Math.random()}`;
  await evaluate(cdp, `window.__layoutAuditBeforeNavigation = ${JSON.stringify(marker)}`);
  await cdp.send('Page.navigate', { url });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const ready = await evaluate(cdp, `document.readyState === 'complete'
        && window.__layoutAuditBeforeNavigation !== ${JSON.stringify(marker)}
        && location.href === ${JSON.stringify(url)}
        && Boolean(document.querySelector(${JSON.stringify(readySelector)}))`);
      if (ready) {
        await sleep(250);
        return;
      }
    } catch {
      // 새 문서 컨텍스트로 전환되는 동안의 일시 오류는 다시 확인한다.
    }
    await sleep(100);
  }
  throw new Error(`화면 이동 시간이 초과되었습니다: ${url} (${readySelector})`);
}

async function setViewport(cdp, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    screenWidth: width,
    screenHeight: height,
    deviceScaleFactor: 1,
    mobile: width < 768,
  });
  await reloadAndWait(cdp);
}

async function measure(cdp) {
  return evaluate(cdp, `(() => {
    const box = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        top: Number(rect.top.toFixed(1)),
        bottom: Number(rect.bottom.toFixed(1)),
        left: Number(rect.left.toFixed(1)),
        right: Number(rect.right.toFixed(1)),
        width: Number(rect.width.toFixed(1)),
        height: Number(rect.height.toFixed(1)),
        display: style.display,
        visibility: style.visibility,
      };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      fontSize: getComputedStyle(document.documentElement).fontSize,
      header: box('.micro-lesson-frame > header'),
      mobileHeader: box('.mobile-lesson-topbar'),
      desktopHeader: box('.lesson-topbar-desktop'),
      main: box('.micro-lesson-frame main'),
      footer: box('.comic-frame-footer'),
      previous: box('.comic-footer-previous'),
      progress: box('.comic-cut-progress'),
      next: box('.comic-footer-next'),
      dock: box('.classroom-dock'),
      toolsTrigger: box('[data-teacher-tools-trigger]'),
      menuButton: box('.mobile-topbar-menu'),
      dictionaryButton: box('.mobile-topbar-dictionary'),
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    };
  })()`);
}

function assertMobileLayout(metrics, label) {
  assert.equal(metrics.viewport.width, 390, `${label}: 모바일 폭은 390px이어야 합니다.`);
  assert.ok(metrics.header && metrics.header.height <= 64, `${label}: 상단은 한 줄 64px 이하여야 합니다. 실제 ${metrics.header?.height}px`);
  assert.ok(metrics.main && metrics.main.height >= 700, `${label}: 학습 본문 높이는 700px 이상이어야 합니다. 실제 ${metrics.main?.height}px`);
  assert.ok(metrics.footer && metrics.footer.height <= 72, `${label}: 하단은 한 줄 72px 이하여야 합니다. 실제 ${metrics.footer?.height}px`);
  assert.ok(!metrics.dock || metrics.dock.display === 'none' || metrics.dock.height === 0, `${label}: 모바일에서 교사 도크가 학습 화면 위에 떠 있으면 안 됩니다.`);
  assert.ok(metrics.previous && metrics.next && Math.abs(metrics.previous.top - metrics.next.top) <= 1, `${label}: 이전과 다음 버튼은 같은 행이어야 합니다.`);
  assert.ok(metrics.previous && metrics.footer && metrics.previous.top >= metrics.footer.top && metrics.previous.bottom <= metrics.footer.bottom, `${label}: 이전 버튼이 하단 영역 밖으로 넘치면 안 됩니다.`);
  assert.ok(metrics.next && metrics.footer && metrics.next.top >= metrics.footer.top && metrics.next.bottom <= metrics.footer.bottom, `${label}: 다음 버튼이 하단 영역 밖으로 넘치면 안 됩니다.`);
  assert.ok(metrics.previous && metrics.next && metrics.previous.height >= 44 && metrics.next.height >= 44, `${label}: 이전과 다음 버튼 터치 영역은 44px 이상이어야 합니다.`);
  assert.ok(metrics.progress && metrics.previous && metrics.progress.top < metrics.previous.bottom && metrics.progress.bottom > metrics.previous.top, `${label}: 진행 표시는 이전·다음 버튼과 같은 행이어야 합니다.`);
  assert.ok(metrics.menuButton && metrics.menuButton.width >= 44 && metrics.menuButton.height >= 44, `${label}: 메뉴 버튼 터치 영역은 44px 이상이어야 합니다.`);
  assert.ok(metrics.dictionaryButton && metrics.dictionaryButton.width >= 44 && metrics.dictionaryButton.height >= 44, `${label}: 사전 버튼 터치 영역은 44px 이상이어야 합니다.`);
  assert.equal(metrics.horizontalOverflow, false, `${label}: 가로 스크롤이 생기면 안 됩니다.`);
}

function stopChild(child) {
  if (!child || child.exitCode !== null) return;
  child.kill();
}

const chromePath = findChrome();
if (!chromePath) throw new Error('Chrome을 찾지 못했습니다. CHROME_PATH를 지정해 주세요.');

const vitePort = await getFreePort();
const lessonUrl = `http://127.0.0.1:${vitePort}/AITEXTBOOKforSTUDENTS/?lesson=m1-l1`;
const homeUrl = `http://127.0.0.1:${vitePort}/AITEXTBOOKforSTUDENTS/`;
let viteOutput = '';
const vite = spawn(process.execPath, [
  'node_modules/vite/bin/vite.js',
  '--host', '127.0.0.1',
  '--port', String(vitePort),
  '--strictPort',
], { cwd: process.cwd(), windowsHide: true });
vite.stdout.on('data', (chunk) => { viteOutput = `${viteOutput}${chunk}`.slice(-6000); });
vite.stderr.on('data', (chunk) => { viteOutput = `${viteOutput}${chunk}`.slice(-6000); });

const userDataDir = mkdtempSync(join(tmpdir(), 'aitextbook-mobile-layout-'));
let chrome;
let cdp;

try {
  await waitForHttp(lessonUrl, vite, () => viteOutput);
  chrome = spawn(chromePath, chromeLaunchArgs(userDataDir, lessonUrl), { stdio: 'ignore', windowsHide: true });

  const devToolsPort = await waitForDevToolsPort(userDataDir, chrome);
  const target = await waitForTarget(devToolsPort);
  cdp = connectCdp(target.webSocketDebuggerUrl);
  await cdp.opened;

  // Page 도메인을 켜고, 앱이 한 번 그려질 때까지 기다린 다음에 화면을 조작한다.
  //
  // 이 두 줄이 없으면 첫 setViewport의 새로고침이 최초 탐색과 겹친다. 그러면 최초 탐색이
  // 끝나면서 표식이 지워지는 것을 새로고침이 끝난 것으로 잘못 읽고 넘어가고, 그때 흘려보낸
  // 새로고침 때문에 이후의 Page.reload는 아무 일도 하지 않는다. 실제로 두 번째 새로고침이
  // 조용히 무시되어 선택자를 기다리다 시간이 초과됐다.
  await cdp.send('Page.enable');
  await waitForSelector(cdp, '.micro-lesson-frame');

  await setViewport(cdp, 390, 844);
  const normal = await measure(cdp);
  assertMobileLayout(normal, '390px 보통 글자');
  await captureScreenshot(cdp, 'mobile-learning-normal');

  await evaluate(cdp, `localStorage.setItem('ai-students-settings', JSON.stringify({ difficulty: 'normal', fontSize: 'large', ttsEnabled: true, soundEnabled: true }))`);
  await reloadAndWait(cdp);
  const large = await measure(cdp);
  assertMobileLayout(large, '390px 글자 크게');

  await evaluate(cdp, `document.querySelector('.mobile-topbar-menu')?.click()`);
  await waitForSelector(cdp, '.mobile-lesson-menu');
  const menu = await evaluate(cdp, `(() => {
    const menu = document.querySelector('.mobile-lesson-menu');
    return {
      visible: Boolean(menu && getComputedStyle(menu).display !== 'none'),
      hasFontSize: Boolean(menu?.querySelector('[aria-label^="글자 크기"]')),
      hasDifficulty: Boolean(menu?.querySelector('[aria-label^="지원 수준"]')),
      hasTeacherTools: Boolean(menu?.querySelector('[data-mobile-teacher-tools]')),
    };
  })()`);
  assert.deepEqual(menu, { visible: true, hasFontSize: true, hasDifficulty: true, hasTeacherTools: true }, '모바일 메뉴에는 학습 설정과 교사 도구 진입점이 있어야 합니다.');
  await captureScreenshot(cdp, 'mobile-learning-menu');

  await evaluate(cdp, `document.querySelector('[data-mobile-teacher-tools]')?.click()`);
  await waitForSelector(cdp, '.mobile-teacher-tools-sheet');
  const toolLabels = await evaluate(cdp, `[...document.querySelectorAll('.mobile-teacher-tools-sheet [data-tool-id]')].map((element) => element.textContent.trim())`);
  // 교사 자료는 외부 사이트로 나가는 링크라 교사 모드에서만 열린다. 이 검사는 학생 모드로
  // 도니 네 도구만 보여야 하며, 교사 자료가 보이면 학생이 수업 도중 밖으로 나갈 수 있다.
  assert.deepEqual(toolLabels, ['판서', '타이머', '그림 카드', '학습지'], '모바일 교사 도구 시트는 학생 모드에서 네 도구를 제공해야 합니다.');
  assert.ok(!toolLabels.includes('교사 자료'), '학생 모드에서 교사 자료가 노출되면 안 됩니다.');
  await captureScreenshot(cdp, 'mobile-teacher-tools');

  await evaluate(cdp, `document.querySelector('[data-tool-id="timer"]')?.click()`);
  await waitForSelector(cdp, '.mobile-teacher-tools-panel');
  await evaluate(cdp, `[...document.querySelectorAll('.mobile-teacher-tools-panel button')].find((element) => element.textContent.trim() === '1분')?.click()`);
  await sleep(150);
  await evaluate(cdp, `document.querySelector('[aria-label="교사 도구 닫기"]')?.click()`);
  await waitForSelector(cdp, '.mobile-timer-chip');
  const timerLabel = await evaluate(cdp, `document.querySelector('.mobile-timer-chip')?.textContent.trim()`);
  assert.match(timerLabel ?? '', /^(1:00|0:59|0:58)$/, '실행 중인 타이머는 모바일 상단에 남아야 합니다.');
  await evaluate(cdp, `document.querySelector('.mobile-timer-chip')?.click()`);
  await waitForSelector(cdp, '.mobile-teacher-tools-sheet');

  // 표지의 교사용 페이지 링크는 좁은 화면에서도 보여야 한다. 예전에 이 묶음이 md 미만에서
  // 통째로 숨어 있어서, 휴대전화로 수업할 때 교사 모드로 들어갈 길이 아예 없었다.
  // 교사 모드에 못 들어가면 교실 도크의 교사 자료도 계속 잠긴 채로 남는다.
  await navigateAndWait(cdp, homeUrl, '[aria-label="학년군 고르기"]');
  const homeTeacherLink = await evaluate(cdp, `(() => {
    const link = [...document.querySelectorAll('a')].find((element) => element.textContent.trim() === '교사용 페이지');
    if (!link) return { found: false };
    const rect = link.getBoundingClientRect();
    return {
      found: true,
      href: link.getAttribute('href'),
      visible: getComputedStyle(link).display !== 'none' && rect.width > 0 && rect.height > 0,
      insideViewport: rect.right <= window.innerWidth + 1,
      tapHeight: Math.round(rect.height),
    };
  })()`);
  assert.ok(homeTeacherLink.found, '표지에 교사용 페이지 링크가 있어야 합니다.');
  assert.equal(homeTeacherLink.href, '?teacher=1', '교사용 페이지 링크는 ?teacher=1로 가야 합니다.');
  assert.ok(homeTeacherLink.visible, '390px에서 교사용 페이지 링크가 숨겨지면 교사 모드로 들어갈 길이 없습니다.');
  assert.ok(homeTeacherLink.insideViewport, '교사용 페이지 링크가 390px 화면 밖으로 나가면 안 됩니다.');
  assert.ok(homeTeacherLink.tapHeight >= 44, `교사용 페이지 링크 높이가 ${homeTeacherLink.tapHeight}px입니다. 손가락 조작에는 44px 이상이 필요합니다.`);

  const debugUrl = `${lessonUrl}&debug=1`;
  await navigateAndWait(cdp, debugUrl);
  const debug = await measure(cdp);
  assertMobileLayout(debug, '390px 디버그 위치 표시');

  await setViewport(cdp, 1280, 900);
  const desktop = await measure(cdp);
  console.log(JSON.stringify({ normal, large, debug, desktop }, null, 2));
  // 교실 도구는 본문 위에 떠 있는 도크가 아니라 상단 바의 단추가 여는 시트다.
  // 떠 있는 도크는 스크롤하는 본문 위에 겹쳐 이야기 대사와 판단 단추를 가렸다.
  assert.equal(desktop.dock, null, '데스크톱에서 본문 위에 떠 있는 교사 도크가 다시 생기면 안 됩니다.');
  assert.ok(
    desktop.toolsTrigger && desktop.toolsTrigger.display !== 'none' && desktop.toolsTrigger.height >= 44
      && desktop.header && desktop.toolsTrigger.bottom <= desktop.header.bottom,
    '데스크톱 상단 바에 교실 도구 단추가 있어야 합니다.',
  );
  assert.ok(desktop.mobileHeader && desktop.mobileHeader.display === 'none', '데스크톱에서는 모바일 상단을 숨겨야 합니다.');
  assert.equal(desktop.horizontalOverflow, false, '1280px에서 가로 스크롤이 생기면 안 됩니다.');

  await evaluate(cdp, `document.querySelector('[data-teacher-tools-trigger]')?.click()`);
  await waitForSelector(cdp, '.mobile-teacher-tools-sheet');
  const popover = await evaluate(cdp, `(() => {
    const sheet = document.querySelector('.mobile-teacher-tools-sheet').getBoundingClientRect();
    const header = document.querySelector('.micro-lesson-frame > header').getBoundingClientRect();
    return {
      top: sheet.top, right: sheet.right, bottom: sheet.bottom, headerBottom: header.bottom,
      viewportWidth: innerWidth, viewportHeight: innerHeight,
      labels: [...document.querySelectorAll('.mobile-teacher-tools-sheet [data-tool-id]')].map((element) => element.textContent.trim()),
    };
  })()`);
  assert.ok(popover.top >= popover.headerBottom, '데스크톱 교실 도구 팝오버는 상단 바 아래에 떠야 합니다.');
  assert.ok(popover.right <= popover.viewportWidth && popover.bottom <= popover.viewportHeight, '데스크톱 교실 도구 팝오버가 화면 밖으로 넘치면 안 됩니다.');
  assert.deepEqual(popover.labels, ['판서', '타이머', '그림 카드', '학습지'], '데스크톱 교실 도구 팝오버도 학생 모드에서 네 도구를 제공해야 합니다.');
  await evaluate(cdp, `document.querySelector('[aria-label="교사 도구 닫기"]')?.click()`);

  // 교사 모드의 교사 자료(외부 링크)는 시트 폭을 다 써야 한다. 옛 떠 있는 도크의 w-64(약 290px)가
  // 시트 안까지 남아 720px 시트의 40%만 쓰고 글이 한 줄 열두 글자쯤에서 꺾였는데, 폭을 재는 검사가
  // 없어 오래 눈에 띄지 않았다. 다섯째 단추(교사 자료)가 홀로 왼쪽 칸에 매달린 것도 같은 시트의 결함이다.
  await evaluate(cdp, `localStorage.setItem('ai-students-teacher-mode', '1')`);
  await reloadAndWait(cdp);
  await evaluate(cdp, `document.querySelector('[data-teacher-tools-trigger]')?.click()`);
  await waitForSelector(cdp, '.mobile-teacher-tools-sheet');
  await evaluate(cdp, `document.querySelector('[data-tool-id="resources"]')?.click()`);
  await waitForSelector(cdp, '.teacher-resource');
  const resources = await evaluate(cdp, `(() => {
    const sheet = document.querySelector('.mobile-teacher-tools-sheet');
    const style = getComputedStyle(sheet);
    return {
      inner: sheet.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      cards: [...sheet.querySelectorAll('.teacher-resource')].map((element) => Math.round(element.getBoundingClientRect().width)),
      tools: [...sheet.querySelectorAll('[data-tool-id]')].map((element) => {
        const rect = element.getBoundingClientRect();
        return { id: element.dataset.toolId, top: Math.round(rect.top), width: Math.round(rect.width) };
      }),
      horizontalOverflow: sheet.scrollWidth > sheet.clientWidth,
    };
  })()`);
  assert.ok(resources.cards.length > 0, '1차시(m1-l1)에는 교사 자료가 있어야 합니다(영상 1 + 도구 2).');
  for (const width of resources.cards) {
    assert.ok(
      width >= resources.inner * 0.95,
      `교사 자료 카드는 시트 폭을 다 써야 합니다. 카드 ${width}px, 시트 안쪽 ${Math.round(resources.inner)}px`,
    );
  }
  assert.equal(resources.tools.length, 5, '교사 모드의 교사 도구는 다섯 개여야 합니다.');
  const classroomTools = resources.tools.slice(0, 4);
  const resourcesTool = resources.tools[4];
  assert.ok(classroomTools.every((tool) => tool.top === classroomTools[0].top), '교실 도구 넷은 한 줄이어야 합니다.');
  assert.ok(
    resourcesTool.id === 'resources' && resourcesTool.top > classroomTools[0].top && resourcesTool.width >= resources.inner * 0.95,
    '교사 자료 단추는 교실 도구 아래 한 줄을 다 써야 합니다.',
  );
  assert.equal(resources.horizontalOverflow, false, '교사 도구 시트에 가로 넘침이 생기면 안 됩니다.');
  await captureScreenshot(cdp, 'desktop-teacher-resources');

  // 같은 시트의 타이머와 그림 카드도 옛 도크 시절의 고정 폭(w-64, w-72·md:w-[500px])이 남아 시트의 절반이
  // 비었다. 그림 카드 목록은 안쪽 스크롤 상자(max-h-[500px])까지 따로 있어 시트 스크롤과 겹쳤고,
  // 휴대전화에서는 라벨이 10px이었다. 시간 고르기는 한 줄을 다 쓰고, 그림 카드는 시트 폭을 다 쓰되
  // 스크롤은 시트 하나뿐이어야 한다.
  await evaluate(cdp, `document.querySelector('[data-tool-id="timer"]')?.click()`);
  await waitForSelector(cdp, '.class-timer-presets');
  const timer = await evaluate(cdp, `(() => {
    const sheet = document.querySelector('.mobile-teacher-tools-sheet');
    const style = getComputedStyle(sheet);
    const presets = [...document.querySelectorAll('.class-timer-presets button')].map((element) => element.getBoundingClientRect());
    return {
      inner: sheet.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      count: presets.length,
      rows: new Set(presets.map((rect) => Math.round(rect.top))).size,
      span: presets.length ? Math.max(...presets.map((rect) => rect.right)) - Math.min(...presets.map((rect) => rect.left)) : 0,
    };
  })()`);
  assert.equal(timer.count, 6, '타이머에는 시간 고르기 단추가 여섯 개여야 합니다.');
  assert.equal(timer.rows, 1, '넓은 시트에서 시간 고르기 단추는 한 줄이어야 합니다.');
  assert.ok(
    timer.span >= timer.inner * 0.95,
    `시간 고르기 단추는 시트 폭을 다 써야 합니다. ${Math.round(timer.span)}px / ${Math.round(timer.inner)}px`,
  );

  await evaluate(cdp, `document.querySelector('[data-tool-id="pecs"]')?.click()`);
  await waitForSelector(cdp, '.pecs-board-grid');
  const pecs = await evaluate(cdp, `(() => {
    const sheet = document.querySelector('.mobile-teacher-tools-sheet');
    const style = getComputedStyle(sheet);
    const grid = document.querySelector('.pecs-board-grid');
    const labels = [...grid.querySelectorAll('span')].map((element) => parseFloat(getComputedStyle(element).fontSize));
    return {
      inner: sheet.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
      width: grid.getBoundingClientRect().width,
      overflowY: getComputedStyle(grid).overflowY,
      count: labels.length,
      minLabel: labels.length ? Math.min(...labels) : 0,
    };
  })()`);
  assert.ok(pecs.count > 0, '그림 카드 목록에는 카드가 있어야 합니다.');
  assert.ok(
    pecs.width >= pecs.inner * 0.95,
    `그림 카드 목록은 시트 폭을 다 써야 합니다. ${Math.round(pecs.width)}px / ${Math.round(pecs.inner)}px`,
  );
  assert.equal(pecs.overflowY, 'visible', '그림 카드 목록 안에 따로 스크롤 상자를 두면 시트 스크롤과 겹칩니다.');
  assert.ok(pecs.minLabel >= 14, `그림 카드 라벨은 14px 이상이어야 합니다. 실제 ${pecs.minLabel}px`);

  await evaluate(cdp, `document.querySelector('.pecs-board-grid button')?.click()`);
  await waitForSelector(cdp, '.pecs-board-card');
  const cardWidth = await evaluate(cdp, `document.querySelector('.pecs-board-card').getBoundingClientRect().width`);
  assert.ok(
    cardWidth >= pecs.inner * 0.95,
    `확대한 그림 카드 면은 시트 폭을 다 써야 합니다. ${Math.round(cardWidth)}px / ${Math.round(pecs.inner)}px`,
  );
  await captureScreenshot(cdp, 'desktop-teacher-pecs-card');

  // 교사 허브(?teacher=1). 예전에는 max-w-6xl 한 줄기라 1920px에서 본문이 1224px뿐이고 양옆이 약 340px씩
  // 비었으며, 일곱 탭이 이름뿐인 필 한 줄이었다. 큰 화면에서는 왼쪽 메뉴 + 남은 폭을 다 쓰는 본문이어야 하고,
  // 어떤 탭도 어떤 폭에서도 가로로 넘치면 안 된다(격자 칸의 min-width: auto가 넓은 표·입력칸에 밀려 390px에서
  // 데이터 관리·AI 연결·학생 기록이 실제로 넘쳤다). 뷰포트는 새로 고치지 않고 장치 크기만 바꾼다.
  async function setHubViewport(width, height) {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      screenWidth: width,
      screenHeight: height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await sleep(450);
  }
  const hubUrl = `http://127.0.0.1:${vitePort}/AITEXTBOOKforSTUDENTS/?teacher=1`;
  await evaluate(cdp, `localStorage.setItem('ai-students-teacher-mode', '1')`);
  await navigateAndWait(cdp, hubUrl, '.hub-shell');

  await setHubViewport(1920, 1080);
  const hubWide = await evaluate(cdp, `(() => {
    const box = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { left: rect.left, right: rect.right, width: rect.width };
    };
    const tabs = [...document.querySelectorAll('[role="tab"]')];
    const panel = document.querySelector('[role="tabpanel"]');
    return {
      viewport: window.innerWidth,
      rail: box('.hub-rail'),
      main: box('.hub-main'),
      railPosition: getComputedStyle(document.querySelector('.hub-rail')).position,
      tabCount: tabs.length,
      selected: tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true').length,
      orientation: document.querySelector('[role="tablist"]').getAttribute('aria-orientation'),
      controlsMatch: tabs.every((tab) => document.getElementById(tab.getAttribute('aria-controls') ?? '__none__') !== null || tab.getAttribute('aria-selected') !== 'true'),
      panelLabelledBy: panel?.getAttribute('aria-labelledby') ?? null,
      selectedId: tabs.find((tab) => tab.getAttribute('aria-selected') === 'true')?.id ?? null,
    };
  })()`);
  assert.ok(hubWide.rail && hubWide.main && hubWide.rail.right <= hubWide.main.left, '큰 화면의 교사 허브는 왼쪽 메뉴와 본문이 나란해야 합니다.');
  assert.equal(hubWide.railPosition, 'sticky', '교사 허브 메뉴는 본문이 길어도 따라다녀야 합니다.');
  assert.ok(
    hubWide.main.width >= hubWide.viewport * 0.72,
    `교사 허브 본문이 큰 화면의 폭을 다 써야 합니다. 본문 ${Math.round(hubWide.main.width)}px / 화면 ${hubWide.viewport}px`,
  );
  assert.equal(hubWide.tabCount, 7, '교사 허브에는 탭이 일곱 개여야 합니다.');
  assert.equal(hubWide.selected, 1, '교사 허브는 탭 하나만 선택되어야 합니다.');
  assert.equal(hubWide.orientation, 'vertical', '큰 화면의 교사 허브 탭 목록은 세로여야 합니다.');
  assert.equal(hubWide.panelLabelledBy, hubWide.selectedId, '탭 패널은 선택된 탭이 이름이어야 합니다.');
  assert.ok(hubWide.controlsMatch, '선택된 탭이 가리키는 패널(aria-controls)이 있어야 합니다.');
  await captureScreenshot(cdp, 'desktop-teacher-hub');

  const hubTabNames = await evaluate(cdp, `[...document.querySelectorAll('[role="tab"]')].map((tab) => tab.textContent.trim())`);
  for (const [width, height] of [[1280, 900], [390, 844]]) {
    await setHubViewport(width, height);
    for (const name of hubTabNames) {
      await evaluate(cdp, `[...document.querySelectorAll('[role="tab"]')].find((tab) => tab.textContent.trim() === ${JSON.stringify(name)})?.click()`);
      await sleep(250);
      const overflow = await evaluate(cdp, `(() => {
        const root = document.documentElement;
        return { scroll: root.scrollWidth, client: root.clientWidth };
      })()`);
      assert.ok(
        overflow.scroll <= overflow.client + 1,
        `교사 허브 '${name}' 탭이 ${width}px에서 가로로 넘칩니다. ${overflow.scroll}px / ${overflow.client}px`,
      );
    }
  }
  await captureScreenshot(cdp, 'mobile-teacher-hub');
  await setHubViewport(1280, 900);

  // 포트폴리오 인쇄. 상장·수료증을 찍으려고 인쇄 매체에서 `#root { display: none }`을 늘 걸어 두었을 때는 허브의
  // "포트폴리오 인쇄·PDF"가 빈 쪽을 냈다(기록 카드가 모두 0×0). 그래서 인쇄 매체로 바꿔 놓고 다음을 잰다.
  // ① 상장 창이 없으면 본문이 찍히고 ② 상장 창(body 바로 아래로 포털되는 래퍼)이 있을 때만 본문이 감춰진다.
  // ③ 기록 카드는 쪽에서 갈라지지 않되 섹션은 쪽을 넘어 이어진다(제목만 1쪽에 남지 않게).
  // ④ 화면에서 길을 찾는 머리글·교사용 안내·교재 저작자 구역은 학생 포트폴리오에 찍히지 않는다.
  const evidenceSeed = ['m1-l1', 'm1-l2'].map((lessonId, index) => ({
    version: 2,
    id: `print-check-${index}`,
    learnerAlias: '인쇄 점검',
    studioId: 'print-check',
    lessonId,
    firstAttempt: { mode: 'text', text: '처음에는 이렇게 생각했어요.' },
    supportLevel: 'light',
    supportModesUsed: [],
    aiSource: 'prepared',
    aiRole: '준비된 AI 예시',
    aiDecision: 'modify',
    finalExpression: { mode: 'text', text: '고쳐서 썼어요.' },
    transferExpression: { mode: 'text', text: '다른 상황에서도 확인할게요.' },
    observation: { importantInformation: 'independent', firstAttempt: 'independent', aiComparison: 'independent', conditionAdjustment: 'independent', note: '' },
    startedAt: '2026-10-01T09:00:00.000Z',
    completedAt: `2026-10-01T10:0${index}:00.000Z`,
    updatedAt: `2026-10-01T10:0${index}:00.000Z`,
  }));
  await evaluate(cdp, `localStorage.setItem('ai-students-studio-evidence-v2', ${JSON.stringify(JSON.stringify(evidenceSeed))})`);
  await evaluate(cdp, `[...document.querySelectorAll('[role="tab"]')].find((tab) => tab.textContent.trim() === '포트폴리오')?.click()`);
  await waitForSelector(cdp, '.hub-grid--records article');
  await cdp.send('Emulation.setEmulatedMedia', { media: 'print' });
  await sleep(300);
  const printed = await evaluate(cdp, `(() => {
    const style = (selector, property) => {
      const element = document.querySelector(selector);
      return element ? getComputedStyle(element)[property] : null;
    };
    const cards = [...document.querySelectorAll('.hub-grid--records article')];
    return {
      rootDisplay: style('#root', 'display'),
      cardHeights: cards.map((card) => Math.round(card.getBoundingClientRect().height)),
      cardBreakInside: cards.map((card) => getComputedStyle(card).breakInside),
      sectionBreakInside: style('.hub-evidence', 'breakInside'),
      sectionBorder: style('.hub-evidence', 'borderTopWidth'),
      panelHead: style('.hub-panel-head', 'display'),
      credit: style('[data-project-credit="teacher"]', 'display'),
      visibleChrome: [...document.querySelectorAll('.teacher-hub-chrome')].filter((element) => getComputedStyle(element).display !== 'none').length,
    };
  })()`);
  assert.notEqual(printed.rootDisplay, 'none', '포트폴리오를 인쇄할 때 화면 본문(#root)이 감춰지면 빈 쪽이 나옵니다. 상장 창이 있을 때만 감추세요.');
  assert.equal(printed.cardHeights.length, 2, '인쇄 점검용 기록 두 건이 포트폴리오에 있어야 합니다.');
  assert.ok(printed.cardHeights.every((height) => height > 0), `인쇄할 때 기록 카드가 높이를 가져야 합니다. ${printed.cardHeights.join(', ')}px`);
  assert.deepEqual(printed.cardBreakInside, ['avoid', 'avoid'], '기록 카드는 쪽 사이에서 갈라지지 않아야 합니다.');
  assert.equal(printed.sectionBreakInside, 'auto', '포트폴리오 섹션 전체에 쪽 나눔 금지를 걸면 제목만 1쪽에 남고 본문이 다음 쪽에서 시작합니다.');
  assert.equal(printed.sectionBorder, '0px', '화면용 종이 테두리는 쪽이 넘어갈 때마다 세로줄로 남으므로 인쇄에서는 벗겨야 합니다.');
  assert.equal(printed.panelHead, 'none', '탭 이름과 안내 문장(허브 머리글)은 인쇄물에 찍히지 않아야 합니다.');
  assert.equal(printed.credit, 'none', '교재 저작자 구역이 학생 포트폴리오의 마지막 쪽을 따로 차지하면 안 됩니다.');
  assert.equal(printed.visibleChrome, 0, '화면용 허브 요소(메뉴·인쇄 단추·교사용 안내)는 인쇄할 때 숨겨야 합니다.');
  const rootWithAward = await evaluate(cdp, `(() => {
    const wrapper = document.createElement('div');
    wrapper.className = 'award-print-wrapper';
    document.body.appendChild(wrapper);
    const display = getComputedStyle(document.getElementById('root')).display;
    wrapper.remove();
    return display;
  })()`);
  assert.equal(rootWithAward, 'none', '상장 창이 열려 있을 때는 차시 화면(#root)이 함께 찍히지 않도록 감춰야 합니다.');
  await cdp.send('Emulation.setEmulatedMedia', { media: '' });
  // 두 창은 body 바로 아래로 포털되어야 #root를 감춰도 같이 사라지지 않는다. 래퍼 이름과 포털이 바뀌면 상장이 빈 쪽이 된다.
  for (const [file, wrapperClass] of [
    ['src/features/studio/components/CompletionAwardModal.tsx', 'award-print-wrapper'],
    ['src/features/studio/components/InquiryCertificateModal.tsx', 'certificate-print-wrapper'],
  ]) {
    const source = readFileSync(file, 'utf8');
    assert.ok(source.includes(wrapperClass), `${file}에 인쇄 래퍼 클래스(${wrapperClass})가 있어야 합니다.`);
    assert.ok(source.includes('createPortal(modalContent, document.body)'), `${file}은 body 바로 아래로 포털되어야 합니다(#root를 감춰도 인쇄되도록).`);
  }
  await evaluate(cdp, `localStorage.removeItem('ai-students-studio-evidence-v2')`);
  await evaluate(cdp, `localStorage.setItem('ai-students-teacher-mode', '0')`);

  // 단원 마무리 인쇄. 학습 화면 틀은 창 높이에 묶인 안쪽 스크롤 칸이라, 화면을 그대로 찍으면 첫 화면만 잘렸다
  // (그 전에는 상장용 전역 #root 숨김 때문에 빈 쪽이었다). 그래서 인쇄용 설명서 한 장을 body 바로 아래에 따로 두고,
  // 인쇄할 때만 그것을 보이며 #root를 감춘다. 화면에서는 그 종이가 보이면 안 된다. 단추 이름은 단원 제목을 따른다
  // (2~4단원이 1단원 이름 "아이미 사용 설명서"로 찍히던 것을 막는다).
  await navigateAndWait(cdp, `http://127.0.0.1:${vitePort}/AITEXTBOOKforSTUDENTS/?lesson=m1-l11`);
  const closeScreen = await evaluate(cdp, `(() => {
    const sheet = document.querySelector('.module-close-print-sheet');
    const button = [...document.querySelectorAll('button')].find((element) => element.textContent.includes('인쇄하기'));
    return {
      exists: Boolean(sheet),
      underBody: sheet ? sheet.parentElement === document.body : false,
      display: sheet ? getComputedStyle(sheet).display : null,
      label: button ? button.textContent.trim() : null,
    };
  })()`);
  assert.ok(closeScreen.exists && closeScreen.underBody, '단원 마무리의 인쇄용 설명서는 #root 밖(body 바로 아래)에 있어야 합니다.');
  assert.equal(closeScreen.display, 'none', '인쇄용 설명서가 화면에 보이면 안 됩니다.');
  assert.equal(closeScreen.label, '나만의 인공지능 사용 설명서 인쇄하기', '단원 마무리 인쇄 단추 이름은 단원 제목을 따라야 합니다.');
  await cdp.send('Emulation.setEmulatedMedia', { media: 'print' });
  await sleep(300);
  const closePrinted = await evaluate(cdp, `(() => {
    const sheet = document.querySelector('.module-close-print-sheet');
    return {
      rootDisplay: getComputedStyle(document.getElementById('root')).display,
      display: getComputedStyle(sheet).display,
      height: Math.round(sheet.getBoundingClientRect().height),
      title: sheet.querySelector('h1')?.textContent.trim() ?? null,
      sections: sheet.querySelectorAll('.module-close-print-guide > li').length,
      blankSections: sheet.querySelectorAll('.module-close-print-guide .module-close-print-lines').length,
    };
  })()`);
  await cdp.send('Emulation.setEmulatedMedia', { media: '' });
  assert.equal(closePrinted.rootDisplay, 'none', '단원 마무리를 인쇄할 때 학습 화면(#root)을 감춰야 첫 화면만 잘려 찍히지 않습니다.');
  assert.equal(closePrinted.display, 'block', '단원 마무리를 인쇄할 때 인쇄용 설명서가 나와야 합니다.');
  assert.ok(closePrinted.height > 0, '인쇄용 설명서가 높이를 가져야 합니다.');
  assert.equal(closePrinted.title, '나만의 인공지능 사용 설명서', '인쇄용 설명서 제목은 단원 제목이어야 합니다.');
  assert.equal(closePrinted.sections, 3, '인쇄용 설명서에는 설명서 세 칸이 있어야 합니다.');
  assert.equal(closePrinted.blankSections, 3, '아직 쓰지 않은 칸에는 손으로 쓸 줄이 남아야 합니다.');

  console.log('mobile learning layout contract passed');
} finally {
  try { cdp?.close(); } catch {
    // 종료 중인 소켓은 무시한다.
  }
  stopChild(chrome);
  stopChild(vite);
  await sleep(250);
  try { rmSync(userDataDir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch {
    // Chrome 자식 프로세스가 늦게 끝나는 환경에서는 OS 임시 정리에 맡긴다.
  }
}
