import fs from 'node:fs';

const file = 'src/data/studios/m5.ts';
if (!fs.existsSync(file)) throw new Error('M5 studio definitions are missing');
const source = fs.readFileSync(file, 'utf8');

for (const id of ['m5-ambiguous-problem', 'm5-clarify-request', 'm5-changing-cooking-plan']) {
  if (!source.includes(`id: '${id}'`)) throw new Error(`missing studio: ${id}`);
}
for (const lessonId of ['m5-l1', 'm5-l6', 'm5-l11']) {
  if (!source.includes(`lessonId: '${lessonId}'`)) throw new Error(`missing lesson mapping: ${lessonId}`);
}
for (const mode of ['choice', 'aac', 'text', 'speech', 'draw']) {
  if (!source.includes(`'${mode}'`)) throw new Error(`missing expression mode: ${mode}`);
}
for (const artifact of ['action-card', 'repair-card', 'visual-plan']) {
  if (!source.includes(`kind: '${artifact}'`)) throw new Error(`missing artifact kind: ${artifact}`);
}
if ((source.match(/source: 'prepared'/g) ?? []).length !== 3) throw new Error('pilot AI must be prepared in all studios');
if (!source.includes('실제 불이나 뜨거운 물을 사용하지 않아요')) throw new Error('cooking safety copy is missing');
if (source.includes('정답입니다') || source.includes('틀렸습니다')) throw new Error('studio must not grade a single correct answer');

console.log('M5 studio content contract: 3 definitions ready');
