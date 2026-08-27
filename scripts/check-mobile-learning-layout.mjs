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
  assert.ok(desktop.dock && desktop.dock.display !== 'none' && desktop.dock.height > 0, '데스크톱에서는 교사 도크가 유지되어야 합니다.');
  assert.ok(desktop.mobileHeader && desktop.mobileHeader.display === 'none', '데스크톱에서는 모바일 상단을 숨겨야 합니다.');
  assert.equal(desktop.horizontalOverflow, false, '1280px에서 가로 스크롤이 생기면 안 됩니다.');

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
