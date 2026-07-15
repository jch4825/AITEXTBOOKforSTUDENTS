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

console.log('generalization contract passed');
