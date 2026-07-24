import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rolePath = path.join(root, 'src/data/lessonRoles.ts');
if (!fs.existsSync(rolePath)) {
  throw new Error('lesson role registry is missing');
}

const source = fs.readFileSync(rolePath, 'utf8');
const studioBlock = source.match(/STUDIO_LESSON_IDS[\s\S]*?as const;/)?.[0] ?? '';
const closeBlock = source.match(/MODULE_CLOSE_LESSON_IDS[\s\S]*?as const;/)?.[0] ?? '';
const idsIn = (block) => [...block.matchAll(/'m[1-6]-l\d+'/g)].map((match) => match[0].slice(1, -1));
const studioIds = idsIn(studioBlock);
const closeIds = idsIn(closeBlock);
const requiredStudios = [
  'm1-l1','m1-l2','m1-l3','m1-l4','m1-l5','m1-l6','m1-l7','m1-l8','m1-l9','m1-l10',
  'm2-l1','m2-l2','m2-l3','m2-l4','m2-l5','m2-l6','m2-l7','m2-l8','m2-l9','m2-l10',
  'm3-l1','m3-l2','m3-l3','m3-l4','m3-l5','m3-l6','m3-l7','m3-l8','m3-l9','m3-l10',
  'm4-l1','m4-l2','m4-l3','m4-l4','m4-l5','m4-l6','m4-l7','m4-l8','m4-l9','m4-l10',
  'm5-l1','m5-l6','m5-l11','m6-l1','m6-l4','m6-l11',
];
const requiredCloses = ['m1-l11','m2-l11','m3-l11','m4-l11','m5-l12','m6-l12'];

if (studioIds.length !== 46) throw new Error('studio lesson count must be 46 after the module 4 remodel');
if (closeIds.length !== 6) throw new Error('module close lesson count must be 6');
if (new Set(studioIds).size !== studioIds.length) throw new Error('studio anchors must be unique');
if (new Set(closeIds).size !== closeIds.length) throw new Error('module close anchors must be unique');
if (studioIds.some((id) => closeIds.includes(id))) throw new Error('studio and module-close anchors must not overlap');
for (const id of [...requiredStudios, ...requiredCloses]) {
  if (!source.includes(`'${id}'`)) throw new Error(`missing lesson role anchor: ${id}`);
}
if (!source.includes("return 'support'")) throw new Error('support fallback is missing');
if (!source.includes('68 - STUDIO_LESSON_IDS.length - MODULE_CLOSE_LESSON_IDS.length')) {
  throw new Error('derived support count is missing');
}

console.log('lesson role contract: 46 studio, 16 support, 6 module-close');
