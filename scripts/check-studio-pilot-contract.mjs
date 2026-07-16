import fs from 'node:fs';
import ts from 'typescript';

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

const reducerPath = 'src/features/studio/studioReducer.ts';
const hookPath = 'src/features/studio/useStudioSession.ts';
if (!fs.existsSync(reducerPath)) throw new Error('studio reducer is missing');
if (!fs.existsSync(hookPath)) throw new Error('studio session hook is missing');
const reducerSource = fs.readFileSync(reducerPath, 'utf8');
const hookSource = fs.readFileSync(hookPath, 'utf8');
const stageOrder = "'encounter', 'first-attempt', 'condition-change', 'ai-compare', 'decision', 'artifact', 'transfer', 'complete'";
if (!reducerSource.includes(stageOrder)) throw new Error('studio stage order is incorrect');
for (const forbidden of ['useSpeak', 'speechSynthesis', 'speak(']) {
  if (reducerSource.includes(forbidden) || hookSource.includes(forbidden)) throw new Error(`automatic TTS dependency found: ${forbidden}`);
}

const compiled = ts.transpileModule(reducerSource, {
  compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
}).outputText;
const reducerModule = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
let state = reducerModule.createInitialStudioSession('light', '2026-07-16T00:00:00.000Z');
state = reducerModule.studioReducer(state, { type: 'next' });
if (state.stage !== 'first-attempt') throw new Error('encounter must advance to first-attempt');
state = reducerModule.studioReducer(state, { type: 'next' });
if (state.stage !== 'first-attempt') throw new Error('first-attempt must block without an expression');
state = reducerModule.studioReducer(state, { type: 'set-first-attempt', value: { mode: 'choice', choiceIds: ['a'] } });
state = reducerModule.studioReducer(state, { type: 'next' });
if (state.stage !== 'condition-change') throw new Error('first-attempt must advance after an expression');
state = reducerModule.studioReducer(state, { type: 'next' });
state = reducerModule.studioReducer(state, { type: 'next' });
if (state.stage !== 'decision') throw new Error('AI comparison must lead to decision');
state = reducerModule.studioReducer(state, { type: 'next' });
if (state.stage !== 'decision') throw new Error('decision must block without AI judgment and final expression');
state = reducerModule.studioReducer(state, { type: 'set-ai-decision', value: 'reject' });
state = reducerModule.studioReducer(state, { type: 'set-final-expression', value: { mode: 'text', text: '내 방법' } });
state = reducerModule.studioReducer(state, { type: 'next' });
if (state.stage !== 'artifact') throw new Error('decision must advance after judgment and expression');

console.log('M5 studio content contract: 3 definitions ready');
