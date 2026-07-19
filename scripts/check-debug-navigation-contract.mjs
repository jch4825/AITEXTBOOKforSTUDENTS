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

const frame = fs.readFileSync('src/components/MicroLessonFrame.tsx', 'utf8');
const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
const studioView = fs.readFileSync('src/features/studio/StudioLessonView.tsx', 'utf8');
const moduleClose = fs.readFileSync('src/features/studio/ModuleCloseLessonView.tsx', 'utf8');
const visualNovel = fs.readFileSync('src/features/studio/components/VisualNovelExperience.tsx', 'utf8');

for (const token of ['pageKey?: string', 'subPage?: DebugSubPage', 'data-debug-page-id', 'formatDebugPageId', 'isDebugMode']) {
  if (!frame.includes(token)) throw new Error(`frame debug locator missing: ${token}`);
}
if (frame.includes('nextDisabled')) throw new Error('shared footer must not expose a next-page lock');
if (studioView.includes('visualNovelLocked') || studioView.includes('canGoNext')) {
  throw new Error('studio view still gates forward navigation');
}
for (const key of ["'wrap-up'", "'coming-soon'", 'currentStep.kind']) {
  if (!lessonView.includes(key)) throw new Error(`lesson page key missing: ${key}`);
}
if (!studioView.includes('pageKey={session.state.stage}')) throw new Error('studio stage page key is missing');
if (!moduleClose.includes('pageKey="module-close"')) throw new Error('module close page key is missing');
for (const token of ['sceneIndex: number', 'onSceneIndexChange: (index: number) => void']) {
  if (!visualNovel.includes(token)) throw new Error(`controlled visual story scene missing: ${token}`);
}
for (const [name, source] of [
  ['LessonView', lessonView],
  ['StudioLessonView', studioView],
  ['ModuleCloseLessonView', moduleClose],
]) {
  const calls = source.match(/<MicroLessonFrame[\s\S]*?>/g) ?? [];
  if (calls.length === 0 || calls.some((call) => !call.includes('pageKey='))) {
    throw new Error(`${name} has a MicroLessonFrame call without pageKey`);
  }
}

const completionPath = 'src/features/studio/studioCompletion.ts';
if (!fs.existsSync(completionPath)) throw new Error('studio completion helper is missing');
const completionSource = fs.readFileSync(completionPath, 'utf8');
const completionCompiled = ts.transpileModule(completionSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const completionModule = await import(`data:text/javascript;base64,${Buffer.from(completionCompiled).toString('base64')}`);

const emptyState = {
  stage: 'complete', startedAt: '2026-07-19T00:00:00.000Z', supportLevel: 'light', supportModesUsed: [],
};
if (completionModule.hasStudentProcessEvidence(emptyState)) throw new Error('empty session must not create evidence');
if (completionModule.hasStudentProcessEvidence({ ...emptyState, supportModesUsed: ['hint'] })) {
  throw new Error('support-mode use alone must not create evidence');
}
for (const partial of [
  { firstAttempt: { mode: 'choice', choiceIds: ['a'] } },
  { aiDecision: 'reject' },
  { finalExpression: { mode: 'text', text: '내 생각' } },
  { artifactSummary: '결과물' },
  { transferExpression: { mode: 'speech', text: '다음 방법' } },
]) {
  if (!completionModule.hasStudentProcessEvidence({ ...emptyState, ...partial })) {
    throw new Error(`partial process evidence was ignored: ${JSON.stringify(partial)}`);
  }
}

const hook = fs.readFileSync('src/features/studio/useStudioSession.ts', 'utf8');
if (/state\.stage\s*!==\s*'complete'/.test(hook)) {
  throw new Error('studio completion must not run automatically on final-stage entry');
}
for (const token of ['const finish = useCallback', 'hasStudentProcessEvidence(state)', 'finish,']) {
  if (!hook.includes(token)) throw new Error(`explicit studio finish missing: ${token}`);
}

console.log('debug navigation contract passed');
