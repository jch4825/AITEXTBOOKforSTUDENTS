import fs from 'node:fs';
import { readStudioSource } from './lib/studio-source.mjs';

const CORE_EXPERIENCES = {
  m1: ['m1-l1', 'm1-l2', 'm1-l3', 'm1-l4', 'm1-l5', 'm1-l6', 'm1-l7', 'm1-l8', 'm1-l9', 'm1-l10'],
  m2: ['m2-l1', 'm2-l2', 'm2-l3', 'm2-l4', 'm2-l5', 'm2-l6', 'm2-l7', 'm2-l8', 'm2-l9', 'm2-l10'],
  m3: ['m3-l1', 'm3-l2', 'm3-l3', 'm3-l4', 'm3-l5', 'm3-l6', 'm3-l7', 'm3-l8', 'm3-l9', 'm3-l10'],
  m4: ['m4-l1', 'm4-l2', 'm4-l3', 'm4-l4', 'm4-l5', 'm4-l6', 'm4-l7', 'm4-l8', 'm4-l9', 'm4-l10'],
  m5: ['m5-l1', 'm5-l2', 'm5-l3', 'm5-l4', 'm5-l5', 'm5-l6', 'm5-l7', 'm5-l8', 'm5-l9', 'm5-l10', 'm5-l11'],
  m6: ['m6-l1', 'm6-l2', 'm6-l3', 'm6-l4', 'm6-l5', 'm6-l6', 'm6-l7', 'm6-l8', 'm6-l9', 'm6-l10', 'm6-l11'],
};

const requestedModule = process.argv
  .find((argument) => argument.startsWith('--module='))
  ?.slice('--module='.length);

if (requestedModule && !(requestedModule in CORE_EXPERIENCES)) {
  throw new Error(`unknown visual story module: ${requestedModule}`);
}

const selectedModules = requestedModule ? [requestedModule] : Object.keys(CORE_EXPERIENCES);

function readStorySource(moduleId) {
  const studioPath = `src/data/studios/${moduleId}.ts`;
  return readStudioSource(studioPath);
}

function lessonObjective(moduleId, lessonId) {
  const lessonSource = fs.readFileSync(`src/data/lessons/${moduleId}.ts`, 'utf8');
  const lessonStart = lessonSource.indexOf(`id: '${lessonId}'`);
  if (lessonStart < 0) throw new Error(`missing lesson source: ${lessonId}`);
  const match = lessonSource.slice(lessonStart).match(/objective: '([^']+)'/);
  if (!match) throw new Error(`missing lesson objective: ${lessonId}`);
  return match[1];
}

function arrayWindow(source, marker) {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return '';
  const arrayStart = source.indexOf('[', markerIndex);
  let depth = 0;
  for (let index = arrayStart; index < source.length; index += 1) {
    if (source[index] === '[') depth += 1;
    if (source[index] === ']') depth -= 1;
    if (depth === 0) return source.slice(arrayStart, index + 1);
  }
  return '';
}

for (const moduleId of selectedModules) {
  const studioSource = readStorySource(moduleId);

  for (const lessonId of CORE_EXPERIENCES[moduleId]) {
    const lessonStart = studioSource.indexOf(`lessonId: '${lessonId}'`);
    const nextLessonStart = studioSource.indexOf(`lessonId: '${moduleId}-`, lessonStart + 1);
    const storyWindow = studioSource.slice(
      lessonStart,
      nextLessonStart < 0 ? studioSource.length : nextLessonStart,
    );
    const expectedObjective = lessonObjective(moduleId, lessonId);
    if (!storyWindow.includes(`objective: '${expectedObjective}'`)) {
      throw new Error(`${lessonId} visual story objective must match the lesson objective`);
    }
    const imageReferences = [...storyWindow.matchAll(/imageSrc: '([^']+)'/g)].map(
      (match) => match[1],
    );
    const expectedImageReferences = [1, 2, 3, 4].map(
      (number) => `/lessons/story/${moduleId}/${lessonId}-scene-${String(number).padStart(2, '0')}.webp`,
    );
    if (imageReferences.join('|') !== expectedImageReferences.join('|')) {
      throw new Error(`${lessonId} must connect four ordered story WebP scenes`);
    }
    for (const imageReference of expectedImageReferences) {
      const assetPath = `public${imageReference}`;
      if (!fs.existsSync(assetPath)) {
        throw new Error(`missing visual novel scene: ${assetPath}`);
      }
      if (fs.statSync(assetPath).size < 20_000) {
        throw new Error(`visual novel scene is unexpectedly small: ${assetPath}`);
      }
    }
    for (const supportLevel of ['full', 'light', 'challenge']) {
      if (!storyWindow.includes(`${supportLevel}:`)) {
        throw new Error(`${lessonId} visual story is missing ${supportLevel} support copy`);
      }
    }
    const knowledgeWindow = arrayWindow(storyWindow, 'knowledge: [');
    const knowledgeTitles = knowledgeWindow.match(/title: '/g) ?? [];
    if (knowledgeTitles.length !== 3) {
      throw new Error(`${lessonId} visual story must have exactly 3 knowledge steps`);
    }
  }
}

/**
 * 대사 칸으로 쓴 차시 (docs/remodel2/02-CHARACTERS.md §2). 지금은 62차시 전부다.
 *
 * 한 장면을 한 칸으로만 쓰면 그림 옆 대사창에 들어가는 분량이 곧 이야기 전체 분량이 되어
 * 한 차시가 200~300자로 끝난다. 배경과 이유가 들어갈 자리가 없어 "무슨 말인지 알기 어려운
 * 이야기"가 되었던 원인이다. 어떤 차시도 옛 한 칸 각본으로 되돌아가지 않게 막는다.
 */
const BEAT_REWRITTEN_LESSONS = Object.values(CORE_EXPERIENCES).flat();
const MIN_BEATS_PER_SCENE = 3;

for (const lessonId of BEAT_REWRITTEN_LESSONS) {
  const moduleId = lessonId.split('-')[0];
  const lessonNumber = lessonId.split('-l')[1].padStart(2, '0');
  const lessonPath = `src/data/studios/${moduleId}/l${lessonNumber}.ts`;
  const lessonSource = fs.readFileSync(lessonPath, 'utf8');

  if (lessonSource.includes('sceneCopy(')) {
    throw new Error(`${lessonId} must not fall back to the single-beat script helper`);
  }
  const sceneScripts = lessonSource.match(/copy: sceneBeats\(/g) ?? [];
  if (sceneScripts.length !== 4) {
    throw new Error(`${lessonId} must script all four scenes with beats, found ${sceneScripts.length}`);
  }
  // sceneBeats 인자 구간 안에서만 세 짝 배열을 센다. 파일 안의 다른 문자열 배열을
  // 각본으로 오인하지 않기 위해서다.
  let cursor = 0;
  let sceneIndex = 0;
  while (true) {
    const marker = lessonSource.indexOf('copy: sceneBeats(', cursor);
    if (marker < 0) break;
    const openIndex = lessonSource.indexOf('(', marker);
    let depth = 0;
    let endIndex = openIndex;
    for (let index = openIndex; index < lessonSource.length; index += 1) {
      if (lessonSource[index] === '(') depth += 1;
      if (lessonSource[index] === ')') {
        depth -= 1;
        if (depth === 0) {
          endIndex = index;
          break;
        }
      }
    }
    const window = lessonSource.slice(openIndex, endIndex + 1);
    const beats = window.match(/\[\s*'(?:[^'\\]|\\.)*'\s*,\s*'(?:[^'\\]|\\.)*'\s*,\s*'(?:[^'\\]|\\.)*'\s*,?\s*\]/g) ?? [];
    if (beats.length < MIN_BEATS_PER_SCENE) {
      throw new Error(
        `${lessonId} scene ${sceneIndex + 1} needs at least ${MIN_BEATS_PER_SCENE} beats, found ${beats.length}`,
      );
    }
    sceneIndex += 1;
    cursor = endIndex + 1;
  }
}

const types = fs.readFileSync('src/features/studio/types.ts', 'utf8');
const m1Studio = readStudioSource('src/data/studios/m1.ts');
const m1Lesson = fs.readFileSync('src/data/lessons/m1.ts', 'utf8');

for (const token of ['VisualNovelStory', 'VisualNovelScene', 'VisualNovelKnowledge', 'visualNovel?: VisualNovelStory']) {
  if (!types.includes(token)) throw new Error(`missing visual novel type: ${token}`);
}
if (types.includes('speaker: string') || m1Studio.includes('speaker:')) {
  throw new Error('visual story must express speakers in the story text instead of a separate label field');
}
for (const token of [
  "title: '아이미의 어려운 자기소개'",
  "objective: '어려운 말로 인사한 아이미 대신, AI(인공지능)의 뜻과 AI가 돕는 일 두 가지를 내 말로 소개해요.'",
  "imageSrc: '/lessons/story/m1/m1-l1-scene-01.webp'",
  '아이미의 설명에는 어려운 말이 많았습니다.',
  'AI(인공지능)는 사람처럼 학습하고 판단하여 여러 가지 문제 해결을 도와주는 기술이나 프로그램입니다.',
  // 3번 카드는 2번 카드와 내용이 겹쳐 있었다. AI를 사회적 존재로 오인하지 않도록
  // 「아이미는 마음이 없어요」로 교체했다(m4-l9의 낯선 계정 경계 학습과 충돌 방지).
  '아이미는 도와주는 도구입니다. 사람처럼 기뻐하거나 서운해하지 않습니다.',
 ]) {
  if (!m1Studio.includes(token)) throw new Error(`missing m1-l1 social story data: ${token}`);
}
for (const retiredToken of ['어제 자리표', '아이미가 본 것은 어제 자리표']) {
  if (m1Studio.includes(retiredToken)) throw new Error(`retired m1-l1 story remains: ${retiredToken}`);
}
if (!m1Lesson.includes("objective: '어려운 말로 인사한 아이미 대신, AI(인공지능)의 뜻과 AI가 돕는 일 두 가지를 내 말로 소개해요.'")) {
  throw new Error('m1-l1 must expose one shared learning objective');
}

const visualNovelPath = 'src/features/studio/components/VisualNovelExperience.tsx';
if (!fs.existsSync(visualNovelPath)) throw new Error('VisualNovelExperience is missing');
const visualNovel = fs.readFileSync(visualNovelPath, 'utf8');
const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
for (const token of [
  'aria-label="생활 속 이야기"',
  'className="visual-novel-image-frame"',
  '학습목표',
  '오늘 배울 개념',
  '대사 듣기',
  'aria-pressed',
  // 장면 안에서 대사 칸을 넘겨 읽는 장치. 이야기 분량이 여기에 달려 있다.
  'beatIndex: number',
  'onBeatIndexChange: (index: number) => void',
  'visual-novel-beat-dots',
]) {
  if (!visualNovel.includes(token)) throw new Error(`missing visual novel UI token: ${token}`);
}
for (const label of ["'다음'", "'다음 장면'", "'처음부터'"]) {
  if (!visualNovel.includes(label)) throw new Error(`missing scene advance label: ${label}`);
}
if (!/\.visual-novel-beat-dots i\s*\{[^}]*background:/s.test(fs.readFileSync('src/index.css', 'utf8'))) {
  throw new Error('beat progress dots must be styled as a display, not a bordered control');
}
if (!/className="visual-novel-dialogue"[\s\S]*?<\/div>\s*<\/div>\s*<div className="visual-novel-controls"[\s\S]*?className="visual-novel-next"/.test(visualNovel)) {
  throw new Error('next scene action must live in the navigation rail after the dialogue');
}
if (/className="visual-novel-dialogue"[\s\S]*?className="visual-novel-next"[\s\S]*?<\/div>\s*<\/div>\s*<div className="visual-novel-controls"/.test(visualNovel)) {
  throw new Error('next scene action must not float inside the variable-height dialogue');
}
for (const label of ["'다음 장면'", "'처음부터'"]) {
  if (!visualNovel.includes(label)) throw new Error(`missing stable scene action label: ${label}`);
}
if (!/className="visual-novel-image-frame"[\s\S]*?className="visual-novel-listen"[\s\S]*?<\/button>\s*<\/div>\s*<div className="visual-novel-dialogue">/.test(visualNovel)) {
  throw new Error('scene image and dialogue must render as separate sibling blocks');
}
if (visualNovel.includes('비주얼 노벨 이야기')) throw new Error('student UI must not name the visual-novel format');
if (visualNovel.includes('copy.speaker')) throw new Error('visual story must not render a separate speaker label box');
if (visualNovel.includes('지금 볼 것') || visualNovel.includes('visual-novel-current-note')) {
  throw new Error('visual story must not repeat the active knowledge in a separate current-note box');
}
if (!visualNovel.includes('speakNow(spokenText)')) throw new Error('TTS must be button-triggered');
if (visualNovel.includes('useEffect')) throw new Error('visual novel must not auto-speak or auto-advance');
if (!experience.includes('<VisualNovelExperience')) throw new Error('studio encounter does not render visual novel');

const editorialFrame = fs.readFileSync('src/features/studio/components/EditorialStudioFrame.tsx', 'utf8');
if (!editorialFrame.includes('생생한 이야기로 만나기') || editorialFrame.includes('핵심 경험 스튜디오')) {
  throw new Error('studio badge must describe the student experience, not the implementation format');
}

const studioView = fs.readFileSync('src/features/studio/StudioLessonView.tsx', 'utf8');
if (studioView.includes('completedEncounterId') || studioView.includes('visualNovelLocked')) {
  throw new Error('visual story viewing must not gate the shared next button');
}
if (!studioView.includes('sceneIndex') || !studioView.includes('setSceneIndex')) {
  throw new Error('studio route must retain controlled scene indexing for debug locators');
}
const useEffectCalls = studioView.match(/\buseEffect\s*\(/g) ?? [];
if (useEffectCalls.length !== 1) {
  throw new Error('studio route must contain exactly one scene-reset effect');
}
const sceneResetEffect = studioView.match(/useEffect\(\(\) => \{([\s\S]*?)\}, \[definition\.id, session\.state\.stage\]\);/);
if (!sceneResetEffect?.[1].includes('setSceneIndex(0)') || sceneResetEffect[1].includes('setCompletedEncounterId')) {
  throw new Error('scene reset must not change encounter completion');
}
if (studioView.includes('speakNow') || studioView.includes('speechSynthesis')) {
  throw new Error('studio route must not auto-start TTS');
}

const studioSession = fs.readFileSync('src/features/studio/useStudioSession.ts', 'utf8');
for (const token of [
  'const currentState = state.supportLevel === initialSupportLevel',
  'supportLevel: initialSupportLevel',
  'state: currentState',
]) {
  if (!studioSession.includes(token)) throw new Error(`global support level is not reflected in studio content: ${token}`);
}

const styles = fs.readFileSync('src/index.css', 'utf8');
if (styles.includes('.visual-novel-current-note')) {
  throw new Error('removed current-note box must not leave unused styles');
}
if (styles.includes('.visual-novel-dialogue > strong')) {
  throw new Error('removed speaker label box must not leave unused styles');
}
for (const [selector, bottom] of [
  ['visual-novel-scene-label', '0.8rem'],
  ['visual-novel-listen', '0.8rem'],
]) {
  const rule = styles.match(new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  if (!rule.includes(`bottom: ${bottom};`) || rule.includes('top:')) {
    throw new Error(`${selector} must align to the image bottom without a top anchor`);
  }
}
if (!/@media \(max-width: 430px\)[\s\S]*?\.visual-novel-scene-label\s*\{[^}]*bottom:\s*0\.7rem;[^}]*max-width:\s*calc\(100%\s*-\s*8\.25rem\);/.test(styles)) {
  throw new Error('mobile scene label must wrap upward within the space left by the listen button');
}
if (!/@media \(max-width: 430px\)[\s\S]*?\.visual-novel-listen\s*\{[^}]*bottom:\s*0\.7rem;[^}]*right:\s*0\.7rem;/.test(styles)) {
  throw new Error('mobile listen button must stay at the image bottom-right');
}
if (!/\.visual-novel-image-frame\s*\{[\s\S]*?aspect-ratio:\s*16\s*\/\s*9;[\s\S]*?overflow:\s*hidden;[\s\S]*?\}/.test(styles)) {
  throw new Error('visual story image must have its own 16:9 frame');
}
// 바탕 규칙(모바일·구형 레이아웃)은 그림과 대사 중 큰 쪽이 높이를 정해야 한다.
if (/(^|\n)\s*\.visual-novel-stage\s*\{[^}]*min-height:/s.test(styles)) {
  throw new Error('visual story stage must grow from its content instead of a fixed minimum height');
}
// 다만 그림 옆에 대사를 두는 넓은 화면에서는 무대가 자리를 미리 잡아야 한다. 그러지 않으면
// 대사 칸을 넘길 때마다 대사창이 자라 장면 버튼과 「다음」이 손가락 밑에서 내려간다.
if (!/\.studio-editorial-scenario-frame[^{]*\.visual-novel-stage\s*\{[^}]*min-height:\s*var\(--scenario-stage-max\);/s.test(styles)) {
  throw new Error('wide-screen story stage must reserve its height so the scene controls stay put between beats');
}
if (!/\.visual-novel-dialogue\s*\{[\s\S]*?position:\s*relative;[\s\S]*?\}/.test(styles)) {
  throw new Error('visual story dialogue must participate in document flow below the image');
}
if (/\.visual-novel-dialogue\s*\{[^}]*position:\s*absolute;/s.test(styles)) {
  throw new Error('visual story dialogue must not overlay the scene image');
}
if (/\.visual-novel-next\s*\{[^}]*position:\s*absolute;/s.test(styles)) {
  throw new Error('next scene action must participate in the independent navigation rail');
}
for (const pattern of [
  /@media \(min-width: 1024px\)[\s\S]*?\.studio-editorial \.lesson-spread-pages\s*\{[^}]*min-height:\s*46rem;/,
  /\.visual-novel-controls\s*\{[^}]*margin-top:\s*auto;/s,
  /\.visual-novel-scene-picker button\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s,
  /\.visual-novel-next\s*\{[^}]*min-height:\s*44px;[^}]*justify-self:\s*end;[^}]*white-space:\s*nowrap;/s,
  /@media \(max-width: 430px\)[\s\S]*?\.visual-novel-next\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;[^}]*width:\s*100%;/,
]) {
  if (!pattern.test(styles)) throw new Error(`missing responsive scene navigation rule: ${pattern}`);
}

const checkedLessons = selectedModules.flatMap((moduleId) => CORE_EXPERIENCES[moduleId]);
console.log(`visual novel social stories: ${checkedLessons.length} experiences, ${checkedLessons.length * 4} scene contracts ready`);
