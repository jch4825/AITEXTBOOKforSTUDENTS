import fs from 'node:fs';

const CORE_EXPERIENCES = {
  m1: ['m1-l1', 'm1-l4', 'm1-l10'],
  m2: ['m2-l1', 'm2-l6', 'm2-l10'],
  m3: ['m3-l1', 'm3-l5', 'm3-l9'],
  m4: ['m4-l1', 'm4-l5', 'm4-l10'],
  m5: ['m5-l1', 'm5-l6', 'm5-l11'],
  m6: ['m6-l1', 'm6-l4', 'm6-l11'],
};

const requestedModule = process.argv
  .find((argument) => argument.startsWith('--module='))
  ?.slice('--module='.length);

if (requestedModule && !(requestedModule in CORE_EXPERIENCES)) {
  throw new Error(`unknown visual story module: ${requestedModule}`);
}

const selectedModules = requestedModule ? [requestedModule] : Object.keys(CORE_EXPERIENCES);

function storyConstantName(lessonId) {
  return `${lessonId.replaceAll('-', '_').toUpperCase()}_VISUAL_STORY`;
}

function readStorySource(moduleId) {
  const studioPath = `src/data/studios/${moduleId}.ts`;
  const storyPath = `src/data/studios/visualStories/${moduleId}.ts`;
  const studioSource = fs.readFileSync(studioPath, 'utf8');
  const storySource = fs.existsSync(storyPath) ? fs.readFileSync(storyPath, 'utf8') : '';
  return { studioSource, combinedSource: `${studioSource}\n${storySource}` };
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
  const { studioSource, combinedSource } = readStorySource(moduleId);

  for (const lessonId of CORE_EXPERIENCES[moduleId]) {
    const assetPrefix = `public/lessons/${lessonId}-vn-`;
    const publicPathPrefix = `/AITEXTBOOKforSTUDENTS/lessons/${lessonId}-vn-`;

    for (const number of [1, 2, 3, 4]) {
      const suffix = `${String(number).padStart(2, '0')}.webp`;
      const asset = `${assetPrefix}${suffix}`;
      const imageReference = `${publicPathPrefix}${suffix}`;
      if (!fs.existsSync(asset)) throw new Error(`missing visual novel scene: ${asset}`);
      if (fs.statSync(asset).size < 20_000) {
        throw new Error(`visual novel scene is unexpectedly small: ${asset}`);
      }
      if (!combinedSource.includes(imageReference)) {
        throw new Error(`visual novel scene is not referenced by ${lessonId}: ${imageReference}`);
      }
    }

    if (lessonId !== 'm1-l1') {
      const constantName = storyConstantName(lessonId);
      if (!combinedSource.includes(`export const ${constantName}`)) {
        throw new Error(`missing visual story data export: ${constantName}`);
      }
      if (!studioSource.includes(`visualNovel: ${constantName}`)) {
        throw new Error(`visual story is not connected to studio ${lessonId}: ${constantName}`);
      }
    }

    const firstImageIndex = combinedSource.indexOf(`${publicPathPrefix}01.webp`);
    const objectiveIndex = combinedSource.lastIndexOf('objective:', firstImageIndex);
    const nextObjectiveIndex = combinedSource.indexOf('objective:', objectiveIndex + 1);
    const storyWindow = combinedSource.slice(
      objectiveIndex,
      nextObjectiveIndex < 0 ? combinedSource.length : nextObjectiveIndex,
    );
    const storyObjective = storyWindow.match(/objective: '([^']+)'/)?.[1];
    const expectedObjective = lessonObjective(moduleId, lessonId);

    if (storyObjective !== expectedObjective) {
      throw new Error(
        `${lessonId} visual story objective must match the lesson objective: expected "${expectedObjective}", got "${storyObjective ?? ''}"`,
      );
    }
    for (const supportLevel of ['full', 'light', 'challenge']) {
      if (!storyWindow.includes(`${supportLevel}:`)) {
        throw new Error(`${lessonId} visual story is missing ${supportLevel} support copy`);
      }
    }
    const knowledgeWindow = arrayWindow(storyWindow, 'knowledge: [');
    const knowledgeTitles = knowledgeWindow.match(/title: '/g) ?? [];
    if (knowledgeTitles.length !== 3) {
      throw new Error(`${lessonId} visual story must have exactly three knowledge steps`);
    }
  }
}

const types = fs.readFileSync('src/features/studio/types.ts', 'utf8');
const m1Studio = fs.readFileSync('src/data/studios/m1.ts', 'utf8');
const m1Lesson = fs.readFileSync('src/data/lessons/m1.ts', 'utf8');

for (const token of ['VisualNovelStory', 'VisualNovelScene', 'VisualNovelKnowledge', 'visualNovel?: VisualNovelStory']) {
  if (!types.includes(token)) throw new Error(`missing visual novel type: ${token}`);
}
if (types.includes('speaker: string') || m1Studio.includes('speaker:')) {
  throw new Error('visual story must express speakers in the story text instead of a separate label field');
}
for (const token of [
  "title: '내 자리가 어디일까?'",
  "objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.'",
  "imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp'",
  "imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-04.webp'",
  '오늘은 진우가 처음으로 학교에 등교하는 날입니다.',
  '나는 너를 도와줄 AI(에이아이) 아이미라고 해.',
  '창가 쪽 자리가 좋겠어.',
  '내 자리가 아닌 것 같은데?',
  '아이미가 잘못 대답한 거야.',
  '아이미를 잘 사용하려면 사용법을 알고 있어야 해.',
]) {
  if (!m1Studio.includes(token)) throw new Error(`missing m1-l1 social story data: ${token}`);
}
for (const retiredToken of ['어제 자리표', '아이미가 본 것은 어제 자리표']) {
  if (m1Studio.includes(retiredToken)) throw new Error(`retired m1-l1 story remains: ${retiredToken}`);
}
if (!m1Lesson.includes("objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.'")) {
  throw new Error('m1-l1 must expose one shared learning objective');
}

const visualNovelPath = 'src/features/studio/components/VisualNovelExperience.tsx';
if (!fs.existsSync(visualNovelPath)) throw new Error('VisualNovelExperience is missing');
const visualNovel = fs.readFileSync(visualNovelPath, 'utf8');
const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
for (const token of [
  'aria-label="생활 장면 이야기"',
  'className="visual-novel-image-frame"',
  '학습목표',
  '이야기와 함께 알아봅니다',
  '대사 듣기',
  'aria-pressed',
]) {
  if (!visualNovel.includes(token)) throw new Error(`missing visual novel UI token: ${token}`);
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
if (!editorialFrame.includes('이야기로 경험하기') || editorialFrame.includes('핵심 경험 스튜디오')) {
  throw new Error('studio badge must describe the student experience, not the implementation format');
}

const studioView = fs.readFileSync('src/features/studio/StudioLessonView.tsx', 'utf8');
for (const token of ['completedEncounterId', 'onEncounterComplete', 'visualNovelLocked']) {
  if (!studioView.includes(token)) throw new Error(`missing encounter completion gate: ${token}`);
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
if (/\.visual-novel-stage\s*\{[^}]*min-height:/s.test(styles)) {
  throw new Error('visual story stage must grow from its content instead of a fixed minimum height');
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
console.log(`visual novel social stories: ${checkedLessons.length} experiences, ${checkedLessons.length * 4} scenes ready`);
