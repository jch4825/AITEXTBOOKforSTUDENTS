import fs from 'node:fs';
import ts from 'typescript';

const debugPath = 'src/utils/debugMode.ts';
if (!fs.existsSync(debugPath)) throw new Error('debug mode utility is missing');

const source = fs.readFileSync(debugPath, 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const debugModule = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

if (!debugModule.isDebugMode('?debug=1&lesson=m1-l1')) throw new Error('debug=1 must enable debug mode');
for (const search of ['', '?debug=0', '?debug=true', '?lesson=m1-l1']) {
  if (debugModule.isDebugMode(search)) throw new Error(`unexpected debug mode: ${search}`);
}

const base = debugModule.formatDebugPageId({
  lessonId: 'm1-l2', current: 3, total: 5, pageKey: 'matching',
});
if (base !== 'm1-l2 · P03/05 · matching') throw new Error(`unexpected base locator: ${base}`);

const scene = debugModule.formatDebugPageId({
  lessonId: 'm1-l1', current: 1, total: 8, pageKey: 'encounter',
  subPage: { current: 3, total: 4 },
});
if (scene !== 'm1-l1 · P01/08 · encounter · S03/04') {
  throw new Error(`unexpected scene locator: ${scene}`);
}

const fallback = debugModule.formatDebugPageId({ lessonId: 'm1-l3', current: 1, total: 1 });
if (fallback !== 'm1-l3 · P01/01') throw new Error(`unexpected fallback locator: ${fallback}`);

console.log('debug navigation contract passed');
