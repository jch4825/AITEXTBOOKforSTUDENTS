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

const expressionPath = 'src/features/studio/components/StudioExpressionInput.tsx';
const supportPath = 'src/features/studio/components/SupportSelector.tsx';
const decisionPath = 'src/features/studio/components/AiDecisionPanel.tsx';
for (const componentPath of [expressionPath, supportPath, decisionPath]) {
  if (!fs.existsSync(componentPath)) throw new Error(`studio response component is missing: ${componentPath}`);
}
const expressionSource = fs.readFileSync(expressionPath, 'utf8');
const supportSource = fs.readFileSync(supportPath, 'utf8');
const decisionSource = fs.readFileSync(decisionPath, 'utf8');
for (const label of ['충분한 지원', '약한 지원', '도전적']) {
  if (!supportSource.includes(label)) throw new Error(`support selector label is missing: ${label}`);
}
for (const label of ['이 의견을 받아들여요', '내 생각에 맞게 고쳐요', '이 의견은 사용하지 않아요']) {
  if (!decisionSource.includes(label)) throw new Error(`AI decision label is missing: ${label}`);
}
if (!expressionSource.includes('ExpressionInput')) throw new Error('existing multimodal input must be reused');
if (expressionSource.includes('useEffect')) throw new Error('expression adapter must not auto-trigger effects');

console.log('M5 studio content contract: 3 definitions ready');
