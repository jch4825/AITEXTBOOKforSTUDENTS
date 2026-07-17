import fs from 'node:fs';

const assets = [1, 2, 3, 4].map(
  (number) => `public/lessons/m1-l1-vn-${String(number).padStart(2, '0')}.webp`,
);

for (const asset of assets) {
  if (!fs.existsSync(asset)) throw new Error(`missing visual novel scene: ${asset}`);
  if (fs.statSync(asset).size < 20_000) throw new Error(`visual novel scene is unexpectedly small: ${asset}`);
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
for (const token of ['aria-label="생활 장면 이야기"', '학습목표', '이야기와 함께 알아봅니다', '대사 듣기', 'aria-pressed']) {
  if (!visualNovel.includes(token)) throw new Error(`missing visual novel UI token: ${token}`);
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
if (studioView.includes('useEffect')) {
  throw new Error('encounter completion must be derived from the current lesson id');
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
if (!/@media \(max-width: 430px\)[\s\S]*?\.visual-novel-stage\s*\{\s*min-height:\s*36rem;/.test(styles)) {
  throw new Error('mobile visual story must fit the longest supported dialogue at 390px and 125% text');
}

console.log('visual novel social story assets: 4 scenes ready');
