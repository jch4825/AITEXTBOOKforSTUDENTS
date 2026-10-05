import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { readStudioSource } from './lib/studio-source.mjs';

const root = resolve(import.meta.dirname, '..');
const types = readFileSync(resolve(root, 'src/types.ts'), 'utf8');

for (const file of [
  'src/utils/generalizationStorage.ts',
]) {
  if (!existsSync(resolve(root, file))) throw new Error(`missing ${file}`);
}

for (const marker of ['JudgmentPreviewBlock', 'JudgmentMainBlock', 'GeneralizationCycleRecord']) {
  if (!types.includes(marker)) throw new Error(`missing type marker: ${marker}`);
}

// 예전 단계형 렌더러의 판단 블록(JudgmentPreview·JudgmentMain)과 useGeneralizationCycle은 쓰는 차시가 없어
// 없앴다. 일반화 과제는 스튜디오의 전이 단계와 단원 마무리가 맡는다.

const lessonPairs = [
  ['m1', 'm1-l6', 'm1-l11'],
  ['m2', 'm2-l6', 'm2-l11'],
  ['m3', 'm3-l6', 'm3-l11'],
  ['m4', 'm4-l6', 'm4-l11'],
  ['m5', 'm5-l6', 'm5-l12'],
  ['m6', 'm6-l6', 'm6-l12'],
];
for (const [moduleId, previewLesson, mainLesson] of lessonPairs) {
  const source = readFileSync(resolve(root, 'src/data/lessons', `${moduleId}.ts`), 'utf8');
  if (!source.includes(`id: '${previewLesson}'`) || !source.includes(`id: '${mainLesson}'`)) {
    throw new Error(`missing lesson pair for ${moduleId}`);
  }
  if (['m1', 'm2', 'm3', 'm4', 'm5', 'm6'].includes(moduleId)) {
    const portfolio = readFileSync(resolve(root, `src/data/modulePortfolios/${moduleId}.ts`), 'utf8');
    for (const marker of ['guideSections:', 'transferPrompt:', 'nextChoices:']) {
      if (!portfolio.includes(marker)) throw new Error(`missing project transfer marker for ${moduleId}: ${marker}`);
    }
    if (moduleId !== 'm1') {
      const studios = readStudioSource(resolve(root, `src/data/studios/${moduleId}.ts`));
      const expectedTransferCount = moduleId === 'm5' || moduleId === 'm6' ? 11 : 10;
      if ((studios.match(/\btransfer:\s*\{/g) ?? []).length !== expectedTransferCount) {
        throw new Error(`${moduleId} must provide a transfer task in all ${expectedTransferCount} studios`);
      }
    }
    continue;
  }
  if (!source.includes(`GENERALIZATION_CYCLES.${moduleId}.preview`) || !source.includes(`GENERALIZATION_CYCLES.${moduleId}.main`)) {
    throw new Error(`missing judgment blocks for ${moduleId}`);
  }
}

console.log('generalization contract passed');
