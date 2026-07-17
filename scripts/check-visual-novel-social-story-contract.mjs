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

console.log('visual novel social story assets: 4 scenes ready');
