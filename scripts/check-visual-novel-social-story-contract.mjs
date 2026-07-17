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
for (const token of [
  "title: '처음 온 교실에서 자리를 찾습니다'",
  "objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.'",
  "imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp'",
  "imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-04.webp'",
  '어제 자리표',
  '오늘 자리표',
]) {
  if (!m1Studio.includes(token)) throw new Error(`missing m1-l1 social story data: ${token}`);
}
if (!m1Lesson.includes("objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.'")) {
  throw new Error('m1-l1 must expose one shared learning objective');
}

const visualNovelPath = 'src/features/studio/components/VisualNovelExperience.tsx';
if (!fs.existsSync(visualNovelPath)) throw new Error('VisualNovelExperience is missing');
const visualNovel = fs.readFileSync(visualNovelPath, 'utf8');
const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
for (const token of ['비주얼 노벨 이야기', '학습목표', '이야기와 함께 알아봅니다', '대사 듣기', 'aria-pressed']) {
  if (!visualNovel.includes(token)) throw new Error(`missing visual novel UI token: ${token}`);
}
if (!visualNovel.includes('speakNow(spokenText)')) throw new Error('TTS must be button-triggered');
if (visualNovel.includes('useEffect')) throw new Error('visual novel must not auto-speak or auto-advance');
if (!experience.includes('<VisualNovelExperience')) throw new Error('studio encounter does not render visual novel');

const studioView = fs.readFileSync('src/features/studio/StudioLessonView.tsx', 'utf8');
for (const token of ['encounterComplete', 'onEncounterComplete', 'visualNovelLocked']) {
  if (!studioView.includes(token)) throw new Error(`missing encounter completion gate: ${token}`);
}
if (studioView.includes('speakNow') || studioView.includes('speechSynthesis')) {
  throw new Error('studio route must not auto-start TTS');
}

console.log('visual novel social story assets: 4 scenes ready');
