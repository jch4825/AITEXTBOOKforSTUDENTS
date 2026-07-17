import fs from 'node:fs';

const obsoletePaths = [
  'src/features/studio/SupportLessonBridge.tsx',
  'src/data/supportBridges/index.ts',
  'src/data/supportBridges/types.ts',
  ...['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].map((moduleId) => `src/data/supportBridges/${moduleId}.ts`),
];

for (const path of obsoletePaths) {
  if (fs.existsSync(path)) {
    throw new Error(`obsolete experience bridge path still exists: ${path}`);
  }
}

const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const token of ['SupportLessonBridge', 'getSupportBridge', "from '../data/supportBridges'"]) {
  if (lessonView.includes(token)) {
    throw new Error(`LessonView still renders an experience bridge: ${token}`);
  }
}

const currentGuidance = [
  fs.readFileSync('src/features/teacher/TeacherOperationGuide.tsx', 'utf8'),
  fs.readFileSync('docs/teacher-guide/m1-m2-studio-expansion.md', 'utf8'),
  fs.readFileSync('docs/teacher-guide/m3-m4-m6-studio-expansion.md', 'utf8'),
].join('\n');

for (const token of [
  '핵심 경험과 이번 연습의 연결',
  '지난 경험 다시 보기',
  '다음 경험 미리 보기',
  '이번 연습과 다음 경험',
  '다음 경험 연결하기',
]) {
  if (lessonView.includes(token) || currentGuidance.includes(token)) {
    throw new Error(`obsolete experience bridge wording remains: ${token}`);
  }
}

console.log('experience bridge contract: 0 bridge cards and 0 bridge buttons');
