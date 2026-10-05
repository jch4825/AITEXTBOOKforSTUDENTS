import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let vite;
let balloons;
let stages;
let bauhaus;
let steps;

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true },
  });
  balloons = await vite.ssrLoadModule('/src/features/studio/minigames/m1/nextWordBalloons.ts');
  stages = await vite.ssrLoadModule('/src/features/studio/minigames/m1/nextWordStages.ts');
  bauhaus = await vite.ssrLoadModule('/src/features/studio/minigames/engine/bauhaus.ts');
  steps = stages.GAME_STAGES.flatMap((stage) => stage.steps.map((step, index) => ({
    name: `${stage.title} ${index + 1}번째 낱말`,
    specs: step.balloons,
  })));
});

after(async () => {
  await vite?.close();
});

/* 한글 한 글자를 0.9em으로 잰다. 실제 글꼴(Pretendard)은 0.865em이라 넉넉하게 잡은 값이다. */
function measure(text, px) {
  let em = 0;
  for (const ch of text) {
    em += /[가-힣]/.test(ch) ? 0.9 : /\d/.test(ch) ? 0.65 : ch === '%' ? 1 : ch === ' ' ? 0.35 : 0.55;
  }
  return em * px;
}

/* 게임이 하는 대로: 판 크기마다 모든 단계가 담기는 배율을 한 번 정해 모든 단계가 같이 쓴다. */
function layoutFor(specs, width, height) {
  const board = { width, height };
  const scale = balloons.commonScale(steps.map((step) => step.specs), board, measure);
  return balloons.layoutBalloons(specs, board, measure, scale);
}

/*
 * 수업 화면에서 실제로 재 본 판 크기. 놀이는 768px 이상 화면에서만 열리고, 가장 좁은 판은
 * 1024px 화면의 323×267이다(768·820·900·960·1024·1100·1180·1280·1366·1920px 화면에서 쟀다).
 * 아래쪽 네 개는 잰 적은 없지만 판의 최소 높이(240px)와 그 언저리다.
 */
const BOARDS = [
  [518, 259], [582, 291], [643, 322], [679, 340], [331, 267], [323, 267], [365, 263],
  [401, 294], [445, 289], [484, 341], [760, 380], [323, 419],
  [320, 240], [360, 240], [480, 240], [1000, 500],
];

test('풍선 안 글자는 어느 판 크기에서도 풍선 안에 다 들어온다', () => {
  for (const [width, height] of BOARDS) {
    for (const { name, specs } of steps) {
      const layout = layoutFor(specs, width, height);
      const where = `${width}x${height} ${name}`;
      assert.equal(layout.fits, true, `${where}: 풍선이 판에 담기지 않습니다`);
      layout.placements.forEach((p, i) => {
        /* 줄 상자의 네 모서리가 모두 원 안에 있으면 글자가 풍선 밖으로 나갈 수 없다. */
        const rows = balloons.labelRows(`${specs[i].probability}%`, p.lines, p.wordFont, p.pctFont);
        for (const row of rows) {
          const halfWidth = measure(row.text, row.font) / 2;
          const halfHeight = (row.font * balloons.LINE_HEIGHT) / 2;
          for (const dx of [-halfWidth, halfWidth]) {
            for (const dy of [-halfHeight, halfHeight]) {
              assert.ok(
                Math.hypot(dx, row.y + dy) <= p.radius,
                `${where}: "${specs[i].word}"의 "${row.text}" 줄이 풍선 밖으로 나갑니다`,
              );
            }
          }
        }
        assert.equal(p.lines.join(' '), specs[i].word, `${where}: 줄바꿈이 낱말을 바꿨습니다`);
        assert.ok(p.wordFont >= 14 && p.pctFont >= 14, `${where}: 글자가 14px보다 작습니다`);
      });
    }
  }
});

test('풍선은 판 밖으로 나가지 않고, 서로 겹치지 않고, 아이미를 가리지 않는다', () => {
  for (const [width, height] of BOARDS) {
    for (const { name, specs } of steps) {
      const { placements } = layoutFor(specs, width, height);
      const where = `${width}x${height} ${name}`;
      const sway = { x: balloons.SWAY_X, y: balloons.SWAY_Y };
      placements.forEach((p, i) => {
        /* 풍선은 제자리에서 흔들리므로 흔들린 끝에서도 판 안이어야 한다. */
        assert.ok(
          p.x - p.radius - sway.x >= balloons.heroX(width) + balloons.HERO_RADIUS,
          `${where}: 아이미를 가립니다`,
        );
        assert.ok(p.x + p.radius + sway.x <= width, `${where}: 오른쪽으로 나갑니다`);
        assert.ok(p.y - p.radius - sway.y >= 0, `${where}: 위로 나갑니다`);
        assert.ok(p.y + p.radius + sway.y + balloons.STRING_LENGTH <= height, `${where}: 아래로 나갑니다`);
        for (let j = i + 1; j < placements.length; j += 1) {
          const q = placements[j];
          const gap = Math.hypot(p.x - q.x, p.y - q.y) - p.radius - q.radius;
          assert.ok(
            gap >= balloons.BALLOON_GAP - 0.01,
            `${where}: ${i}번과 ${j}번 풍선이 겹칩니다(간격 ${gap.toFixed(1)})`,
          );
        }
      });
    }
  }
});

test('더 어울리는 낱말이 더 큰 풍선이다', () => {
  for (const [width, height] of BOARDS) {
    for (const { name, specs } of steps) {
      const { placements } = layoutFor(specs, width, height);
      for (let i = 0; i < specs.length; i += 1) {
        for (let j = 0; j < specs.length; j += 1) {
          if (specs[i].probability > specs[j].probability) {
            assert.ok(
              placements[i].radius > placements[j].radius,
              `${width}x${height} ${name}: ${specs[i].word}(${specs[i].probability}%)가 ${specs[j].word}(${specs[j].probability}%)보다 크지 않습니다`,
            );
          }
        }
      }
    }
  }
});

test('한 판에서는 모든 단계가 같은 배율을 쓴다 — 같은 어울림이 단계마다 다른 크기가 되지 않는다', () => {
  for (const [width, height] of BOARDS) {
    const scales = new Set(steps.map(({ specs }) => layoutFor(specs, width, height).scale));
    assert.equal(scales.size, 1, `${width}x${height}: 단계마다 배율이 다릅니다(${[...scales].join(', ')})`);
  }
  /* 가장 빡빡한 단계(세 풍선에 긴 낱말)가 배율을 정하므로, 그보다 느슨한 단계의 혼자 배율은 더 크다. */
  const loose = steps.find((step) => step.specs.length === 2);
  const alone = balloons.layoutBalloons(loose.specs, { width: 331, height: 253 }, measure).scale;
  const shared = layoutFor(loose.specs, 331, 253).scale;
  assert.ok(alone > shared, '느슨한 단계는 혼자일 때 더 큰 배율을 쓸 수 있어야 이 시험이 뜻이 있습니다');
});

test('큰 화면에서는 글자가 커지고, 좁은 판에서도 14px 밑으로 내려가지 않는다', () => {
  const longest = steps.find((step) => step.specs.some((s) => s.word.includes('아이스크림')));
  const wide = balloons.layoutBalloons(longest.specs, { width: 760, height: 380 }, measure);
  const narrow = balloons.layoutBalloons(longest.specs, { width: 323, height: 267 }, measure);
  assert.ok(wide.placements[0].wordFont > narrow.placements[0].wordFont, '큰 판의 글자가 더 커야 합니다');
  assert.ok(narrow.placements.every((p) => p.wordFont >= 14));
});

test('면 위의 글자는 대비 4.5 이상으로 읽힌다 — 파랑 위에는 밝은 글자를 얹는다', () => {
  const board = bauhaus.BAUHAUS.board;
  for (const face of balloons.BALLOON_FACES) {
    const ink = balloons.inkOnFace(face);
    assert.ok(balloons.contrastRatio(face, ink) >= 4.5, `${face} 위 ${ink}의 대비가 4.5보다 낮습니다`);
  }
  assert.equal(balloons.inkOnFace(board.blue), board.ink);
  assert.equal(balloons.inkOnFace(board.yellow), board.ground);
  assert.equal(balloons.inkOnFace(board.grey), board.ground);
});

test('담기지 않는 판은 담긴 척하지 않고 fits=false로 알린다', () => {
  const specs = steps[steps.length - 1].specs;
  const layout = balloons.layoutBalloons(specs, { width: 120, height: 120 }, measure);
  assert.equal(layout.fits, false);
});
