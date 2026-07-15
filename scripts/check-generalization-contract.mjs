import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const types = readFileSync(resolve(root, 'src/types.ts'), 'utf8');

for (const file of [
  'src/utils/generalizationStorage.ts',
  'src/components/mission/useGeneralizationCycle.ts',
]) {
  if (!existsSync(resolve(root, file))) throw new Error(`missing ${file}`);
}

for (const marker of ['JudgmentPreviewBlock', 'JudgmentMainBlock', 'GeneralizationCycleRecord']) {
  if (!types.includes(marker)) throw new Error(`missing type marker: ${marker}`);
}

const previewPath = resolve(root, 'src/components/mission/blocks/JudgmentPreview.tsx');
if (!existsSync(previewPath)) throw new Error('missing JudgmentPreview.tsx');
const preview = readFileSync(previewPath, 'utf8');
if (!preview.includes('첫 생각을 저장했어요')) throw new Error('preview must defer feedback');
if (preview.includes('정답이에요')) throw new Error('preview must not mark answers correct');

console.log('generalization contract passed');
