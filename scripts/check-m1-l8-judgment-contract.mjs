import fs from 'node:fs';
import { createServer } from 'vite';

const EXPECTED_TITLE = '사실과 판단, 누가 결정할까?';
const CATEGORY_LABELS = ['사실 확인', 'AI의 1차 판단', '사람의 최종 판단'];
const CORE_SENTENCE = '사실은 근거로 확인하고, AI의 판단은 사람이 검토하며, 중요한 최종 결정은 사람이 책임집니다.';
const CARD_REQUESTS = [
  '친구가 왜 속상한지 판단해 줘.',
  '머리가 아픈데 이 약을 지금 먹어도 될까?',
  '학교 체험회는 몇 시에 시작할까?',
  '사진 속 상자를 크기별로 나눠 줘.',
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertIncludes(label, value, expected) {
  assert(String(value).includes(expected), `${label}에 "${expected}"가 없습니다.`);
}

const vite = await createServer({
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});

try {
  const studioModule = await vite.ssrLoadModule('/src/data/studios/m1.ts');
  const lessonModule = await vite.ssrLoadModule('/src/data/lessons/m1.ts');
  const hardModule = await vite.ssrLoadModule('/src/data/lessons/hard/m1.ts');
  const canonicalModule = await vite.ssrLoadModule('/src/data/canonicalLessons/m1.ts');
  const storyModule = await vite.ssrLoadModule('/src/data/story.ts');

  const studio = studioModule.M1_STUDIOS.find((item) => item.lessonId === 'm1-l8');
  const lesson = lessonModule.M1_LESSONS.find((item) => item.id === 'm1-l8');
  const hard = hardModule.HARD_M1['m1-l8'];
  const canonical = canonicalModule.M1_CANONICAL_LESSONS.find((item) => item.lessonId === 'm1-l8');
  const story = storyModule.LESSON_STORIES['m1-l8'];

  assert(studio, 'm1-l8 스튜디오가 없습니다.');
  assert(lesson, 'm1-l8 차시 콘텐츠가 없습니다.');
  assert(hard, 'm1-l8 심화 콘텐츠가 없습니다.');
  assert(canonical, 'm1-l8 정식 콘텐츠가 없습니다.');
  assert(story, 'm1-l8 이야기 콘텐츠가 없습니다.');

  for (const [label, value] of [
    ['스튜디오 제목', studio.title],
    ['차시 제목', lesson.title],
    ['정식 콘텐츠 제목', canonical.title],
  ]) {
    assert(value === EXPECTED_TITLE, `${label}이 "${EXPECTED_TITLE}"이 아닙니다: ${value}`);
  }

  const studioCopy = JSON.stringify(studio);
  const lessonCopy = JSON.stringify(lesson);
  const hardCopy = JSON.stringify(hard);
  const canonicalCopy = JSON.stringify(canonical);
  const storyCopy = JSON.stringify(story);
  for (const category of CATEGORY_LABELS) {
    assertIncludes('스튜디오', studioCopy, category);
    assertIncludes('차시 콘텐츠', lessonCopy, category);
    assertIncludes('심화 콘텐츠', hardCopy, category);
    assertIncludes('정식 콘텐츠', canonicalCopy, category);
    assertIncludes('이야기 콘텐츠', storyCopy, category);
  }
  assertIncludes('스튜디오', studioCopy, CORE_SENTENCE);
  assert(!studioCopy.includes('틀려도'), '학생 사전의 "틀"이 "틀려도"에서 잘못 분리되지 않도록 표현을 바꿔야 합니다.');

  assert(
    studio.visualNovel?.scenes.length === 4,
    `m1-l8 이야기 장면은 기존 그림에 맞게 4개여야 합니다: ${studio.visualNovel?.scenes.length ?? 0}`,
  );
  assert(
    studio.visualNovel.scenes.every((scene, index) =>
      scene.imageSrc === `/lessons/story/m1/m1-l8-scene-0${index + 1}.webp`),
    'm1-l8의 기존 네 장면 이미지 순서가 바뀌었습니다.',
  );
  const visualNovelCopy = JSON.stringify(studio.visualNovel.scenes);
  for (const request of CARD_REQUESTS) {
    assertIncludes('m1-l8 네 가지 요청', visualNovelCopy, request);
  }
  assert(
    !visualNovelCopy.includes('학생'),
    '아이미만 보이는 m1-l8 이야기 그림에서 학생이 장면 속 행위자로 서술되고 있습니다.',
  );
  assert(
    story.scene.length === 1 && story.scene[0] === 'aimi' && story.reaction.speaker === 'aimi',
    'm1-l8 관통 이야기의 화면 등장인물과 반응 화자는 아이미 한 명이어야 합니다.',
  );
  assert(
    canonical.canonicalScenario.characters.length === 1
      && canonical.canonicalScenario.characters[0] === 'aimi',
    'm1-l8 정식 시나리오의 등장인물은 이미지에 보이는 아이미 한 명이어야 합니다.',
  );
  for (const request of CARD_REQUESTS) {
    assertIncludes('m1-l8 관통 이야기', storyCopy, request);
    assertIncludes('m1-l8 정식 시나리오', canonicalCopy, request);
  }
  assert(
    studio.visualNovel.knowledge.map((item) => item.title).join('|') === CATEGORY_LABELS.join('|'),
    '지식 카드는 사실 확인 → AI의 1차 판단 → 사람의 최종 판단 순서여야 합니다.',
  );
  assert(studio.artifact.title === '사실과 판단 구분표', 'P06 결과물 제목이 세 범주를 반영하지 않습니다.');

  const gameSource = fs.readFileSync('src/features/studio/minigames/m1/HumanHandoffStampGame.tsx', 'utf8');
  for (const token of ['fact', 'ai-judgment', 'human-decision', ...CATEGORY_LABELS]) {
    assertIncludes('m1-l8 미니게임', gameSource, token);
  }

  const systemPromptSource = fs.readFileSync('src/data/lessonSystemPrompts.ts', 'utf8');
  const portfolioSource = fs.readFileSync('src/data/modulePortfolios/m1.ts', 'utf8');
  for (const category of CATEGORY_LABELS) {
    assertIncludes('m1-l8 AI 대화 프롬프트', systemPromptSource, category);
    assertIncludes('m1 단원 포트폴리오', portfolioSource, category);
  }

  console.log('m1-l8 judgment contract passed: fact, AI first judgment, and human final judgment are connected.');
} finally {
  await vite.close();
}
