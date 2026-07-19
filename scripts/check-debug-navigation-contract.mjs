import fs from 'node:fs';
import ts from 'typescript';

function parseSource(fileName, text, scriptKind = ts.ScriptKind.TS) {
  return ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, scriptKind);
}

function findNodes(root, predicate) {
  const matches = [];
  function visit(node) {
    if (predicate(node)) matches.push(node);
    ts.forEachChild(node, visit);
  }
  visit(root);
  return matches;
}

function unwrapExpression(expression) {
  let current = expression;
  while (
    ts.isParenthesizedExpression(current)
    || ts.isAsExpression(current)
    || ts.isNonNullExpression(current)
  ) {
    current = current.expression;
  }
  return current;
}

function propertyPath(expression) {
  const current = unwrapExpression(expression);
  if (ts.isIdentifier(current)) return current.text;
  if (ts.isPropertyAccessExpression(current)) {
    const parent = propertyPath(current.expression);
    return parent ? `${parent}.${current.name.text}` : current.name.text;
  }
  return '';
}

function isCallTo(node, path) {
  return ts.isCallExpression(node) && propertyPath(node.expression) === path;
}

function callsTo(root, path) {
  return findNodes(root, (node) => isCallTo(node, path));
}

function callsNamed(root, name) {
  return findNodes(root, (node) => (
    ts.isCallExpression(node) && propertyPath(node.expression).split('.').at(-1) === name
  ));
}

function directStatements(statement) {
  return ts.isBlock(statement) ? [...statement.statements] : [statement];
}

function isDirectCallStatement(statement, path) {
  return ts.isExpressionStatement(statement) && isCallTo(statement.expression, path);
}

function isCompleteStageCondition(expression) {
  const current = unwrapExpression(expression);
  if (!ts.isBinaryExpression(current)) return false;
  if (![ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken].includes(current.operatorToken.kind)) {
    return false;
  }
  const operands = [unwrapExpression(current.left), unwrapExpression(current.right)];
  return operands.some((operand) => propertyPath(operand) === 'session.state.stage')
    && operands.some((operand) => ts.isStringLiteral(operand) && operand.text === 'complete');
}

function assertStudioFinalAction(sourceText) {
  const sourceFile = parseSource('StudioLessonView.tsx', sourceText, ts.ScriptKind.TSX);
  const handleNext = findNodes(sourceFile, (node) => (
    ts.isFunctionDeclaration(node) && node.name?.text === 'handleNext'
  ))[0];
  if (!handleNext?.body) throw new Error('studio final action contract: handleNext is missing');

  const finalIf = handleNext.body.statements.find((statement) => (
    ts.isIfStatement(statement) && isCompleteStageCondition(statement.expression)
  ));
  if (!finalIf) throw new Error('studio final action contract: complete-stage branch is missing');

  const finishCalls = callsTo(handleNext, 'session.finish');
  const goNextCalls = callsTo(handleNext, 'session.goNext');
  if (finishCalls.length !== 1 || callsTo(finalIf.thenStatement, 'session.finish').length !== 1) {
    throw new Error('studio final action contract: final-stage branch must call session.finish exactly once');
  }
  if (callsTo(finalIf.thenStatement, 'session.goNext').length > 0) {
    throw new Error('studio final action contract: final-stage branch must not call session.goNext');
  }
  if (goNextCalls.length !== 1) {
    throw new Error('studio final action contract: non-final flow must call session.goNext exactly once');
  }

  if (finalIf.elseStatement) {
    if (callsTo(finalIf.elseStatement, 'session.goNext').length !== 1) {
      throw new Error('studio final action contract: only the non-final branch may call session.goNext');
    }
    return;
  }

  const finalIndex = handleNext.body.statements.indexOf(finalIf);
  const finalReturns = directStatements(finalIf.thenStatement).some(ts.isReturnStatement);
  const laterGoNext = handleNext.body.statements
    .slice(finalIndex + 1)
    .some((statement) => isDirectCallStatement(statement, 'session.goNext'));
  if (!finalReturns || !laterGoNext) {
    throw new Error('studio final action contract: final flow must return before non-final session.goNext');
  }
}

function isCompletedRefAssignment(statement) {
  if (!ts.isExpressionStatement(statement) || !ts.isBinaryExpression(statement.expression)) return false;
  const assignment = statement.expression;
  return assignment.operatorToken.kind === ts.SyntaxKind.EqualsToken
    && propertyPath(assignment.left) === 'completedRef.current'
    && assignment.right.kind === ts.SyntaxKind.TrueKeyword;
}

function hasCompletedRefGuard(statement) {
  return ts.isIfStatement(statement)
    && propertyPath(statement.expression) === 'completedRef.current'
    && directStatements(statement.thenStatement).some(ts.isReturnStatement);
}

function isEvidenceCondition(expression) {
  const current = unwrapExpression(expression);
  return isCallTo(current, 'hasStudentProcessEvidence')
    && current.arguments.length === 1
    && propertyPath(current.arguments[0]) === 'state';
}

function assertHookCompletionContract(sourceText) {
  const sourceFile = parseSource('useStudioSession.ts', sourceText);
  const useStudioSession = findNodes(sourceFile, (node) => (
    ts.isFunctionDeclaration(node) && node.name?.text === 'useStudioSession'
  ))[0];
  if (!useStudioSession?.body) throw new Error('studio completion contract: useStudioSession is missing');

  const finishDeclaration = findNodes(useStudioSession.body, (node) => (
    ts.isVariableDeclaration(node)
    && ts.isIdentifier(node.name)
    && node.name.text === 'finish'
  ))[0];
  const finishInitializer = finishDeclaration?.initializer;
  if (!finishInitializer || !isCallTo(finishInitializer, 'useCallback')) {
    throw new Error('studio completion contract: finish must be a useCallback');
  }
  const finishCallback = finishInitializer.arguments[0];
  if (
    (!ts.isArrowFunction(finishCallback) && !ts.isFunctionExpression(finishCallback))
    || !ts.isBlock(finishCallback.body)
  ) {
    throw new Error('studio completion contract: finish callback body is missing');
  }

  const statements = [...finishCallback.body.statements];
  const guardIndex = statements.findIndex(hasCompletedRefGuard);
  const assignmentIndex = statements.findIndex(isCompletedRefAssignment);
  if (guardIndex < 0 || assignmentIndex <= guardIndex) {
    throw new Error('studio completion contract: finish must retain completedRef idempotence');
  }

  const evidenceIndex = statements.findIndex((statement) => (
    ts.isIfStatement(statement) && isEvidenceCondition(statement.expression)
  ));
  if (evidenceIndex < 0) {
    throw new Error('studio completion contract: hasStudentProcessEvidence(state) guard is missing');
  }
  if (assignmentIndex >= evidenceIndex) {
    throw new Error('studio completion contract: completedRef must be set before completion side effects');
  }
  const evidenceIf = statements[evidenceIndex];
  const finishSaveCalls = callsTo(finishCallback.body, 'saveStudioEvidence');
  const guardedSaveCalls = callsTo(evidenceIf.thenStatement, 'saveStudioEvidence');
  if (finishSaveCalls.length < 1 || guardedSaveCalls.length !== finishSaveCalls.length) {
    throw new Error('studio completion contract: evidence save must remain inside the process-evidence guard');
  }
  for (const saveCall of finishSaveCalls) {
    if (
      saveCall.arguments.length !== 2
      || propertyPath(saveCall.arguments[1]) !== 'settings.processRecording'
    ) {
      throw new Error('studio completion contract: evidence save must preserve the processRecording opt-in argument');
    }
  }

  const onCompleteIndex = statements.findIndex((statement) => isDirectCallStatement(statement, 'onComplete'));
  if (
    onCompleteIndex <= evidenceIndex
    || callsTo(finishCallback.body, 'onComplete').length !== 1
    || callsTo(evidenceIf.thenStatement, 'onComplete').length > 0
  ) {
    throw new Error('studio completion contract: onComplete must be unconditional and outside the evidence guard');
  }

  const returnedFinish = useStudioSession.body.statements.some((statement) => (
    ts.isReturnStatement(statement)
    && statement.expression
    && ts.isObjectLiteralExpression(statement.expression)
    && statement.expression.properties.some((property) => (
      ts.isShorthandPropertyAssignment(property) && property.name.text === 'finish'
    ))
  ));
  if (!returnedFinish) throw new Error('studio completion contract: finish must be returned by the hook');

  for (const effectCall of findNodes(useStudioSession.body, (node) => isCallTo(node, 'useEffect'))) {
    const callback = effectCall.arguments[0];
    if (!callback || (!ts.isArrowFunction(callback) && !ts.isFunctionExpression(callback))) continue;
    for (const forbiddenCall of [
      'finish',
      'onComplete',
      'saveStudioEvidence',
      'hasStudentProcessEvidence',
      'loadTeacherRecordingSettings',
    ]) {
      if (callsNamed(callback, forbiddenCall).length > 0) {
        throw new Error(`studio completion contract: useEffect must not call ${forbiddenCall}`);
      }
    }
    const referencesCompleteStage = findNodes(callback, (node) => (
      ts.isStringLiteral(node) && node.text === 'complete'
    )).length > 0;
    const marksCompleted = findNodes(callback, isCompletedRefAssignment).length > 0;
    if (referencesCompleteStage || marksCompleted) {
      throw new Error('studio completion contract: useEffect must not drive complete-stage completion');
    }
  }
}

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

const fallback = debugModule.formatDebugPageId({ lessonId: 'm1-l999', current: 1, total: 1 });
if (fallback !== 'm1-l999 · P01/01') throw new Error(`unexpected fallback locator: ${fallback}`);

const frame = fs.readFileSync('src/components/MicroLessonFrame.tsx', 'utf8');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const progressDots = fs.readFileSync('src/components/ProgressDots.tsx', 'utf8');
const styles = fs.readFileSync('src/index.css', 'utf8').replace(/\s+/g, ' ');
const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
const studioView = fs.readFileSync('src/features/studio/StudioLessonView.tsx', 'utf8');
const moduleClose = fs.readFileSync('src/features/studio/ModuleCloseLessonView.tsx', 'utf8');
const studioExperience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
const evidencePanel = fs.readFileSync('src/features/teacher/StudioEvidencePanel.tsx', 'utf8');
const visualNovel = fs.readFileSync('src/features/studio/components/VisualNovelExperience.tsx', 'utf8');

if (!/<LessonView[\s\S]*?key=\{state\.lessonId\}[\s\S]*?\/>/.test(app)) {
  throw new Error('lesson routes must remount by lessonId before reading new lesson state');
}
if (!progressDots.includes('className="progress-dots ')) {
  throw new Error('ProgressDots must expose the progress-dots mobile styling hook');
}
for (const token of ['comic-footer-previous', 'comic-footer-next']) {
  if (!frame.includes(token)) throw new Error(`mobile footer grid hook is missing: ${token}`);
}
for (const rule of [
  'grid-template-areas: "progress progress" "previous next"',
  '.comic-footer-previous { grid-area: previous;',
  '.comic-cut-progress { grid-area: progress;',
  '.comic-footer-next { grid-area: next;',
  '.comic-cut-progress > code { width: 100%; max-width: 100%;',
]) {
  if (!styles.includes(rule)) throw new Error(`mobile footer reflow rule is missing: ${rule}`);
}

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

if (typeof completionModule.isMeaningfulStudioExpression !== 'function') {
  throw new Error('semantic studio expression validator is missing');
}

const semanticallyEmptyExpressions = [
  { mode: 'choice' },
  { mode: 'choice', choiceIds: [] },
  { mode: 'choice', choiceIds: ['', '   '] },
  { mode: 'aac' },
  { mode: 'aac', choiceIds: [] },
  { mode: 'text' },
  { mode: 'text', text: '   \t\n' },
  { mode: 'speech' },
  { mode: 'speech', text: '   \t\n' },
  { mode: 'draw' },
  { mode: 'draw', drawing: '' },
  { mode: 'draw', drawing: '   \t\n' },
];
for (const expression of semanticallyEmptyExpressions) {
  if (completionModule.isMeaningfulStudioExpression(expression)) {
    throw new Error(`empty expression was accepted: ${JSON.stringify(expression)}`);
  }
}
for (const expression of [
  { mode: 'choice', choiceIds: ['choice-a'] },
  { mode: 'aac', choiceIds: ['aac-a'] },
  { mode: 'text', text: ' 내 생각 ' },
  { mode: 'speech', text: ' 말한 생각 ' },
  { mode: 'draw', drawing: 'data:image/png;base64,abc' },
]) {
  if (!completionModule.isMeaningfulStudioExpression(expression)) {
    throw new Error(`real expression was ignored: ${JSON.stringify(expression)}`);
  }
}

const emptyState = {
  stage: 'complete', startedAt: '2026-07-19T00:00:00.000Z', supportLevel: 'light', supportModesUsed: [],
};
if (completionModule.hasStudentProcessEvidence(emptyState)) throw new Error('empty session must not create evidence');
if (completionModule.hasStudentProcessEvidence({ ...emptyState, supportModesUsed: ['hint'] })) {
  throw new Error('support-mode use alone must not create evidence');
}
if (completionModule.hasStudentProcessEvidence({ ...emptyState, artifactSummary: '   \t\n' })) {
  throw new Error('whitespace-only artifact summary must not create evidence');
}
for (const field of ['firstAttempt', 'finalExpression', 'transferExpression']) {
  for (const expression of semanticallyEmptyExpressions) {
    if (completionModule.hasStudentProcessEvidence({ ...emptyState, [field]: expression })) {
      throw new Error(`empty ${field} expression created evidence: ${JSON.stringify(expression)}`);
    }
  }
}
for (const partial of [
  { firstAttempt: { mode: 'choice', choiceIds: ['a'] } },
  { aiDecision: 'reject' },
  { finalExpression: { mode: 'text', text: '내 생각' } },
  { artifactSummary: '결과물' },
  { transferExpression: { mode: 'speech', text: '다음 방법' } },
  { transferExpression: { mode: 'draw', drawing: 'data:image/png;base64,abc' } },
]) {
  if (!completionModule.hasStudentProcessEvidence({ ...emptyState, ...partial })) {
    throw new Error(`partial process evidence was ignored: ${JSON.stringify(partial)}`);
  }
}

if (
  !studioExperience.includes('isMeaningfulStudioExpression(state.finalExpression)')
  || !studioExperience.includes('suggestion && (')
) {
  throw new Error('artifact fallback must only be offered for a meaningful final expression');
}
if (!studioExperience.includes('if (!isMeaningfulStudioExpression(expression))')) {
  throw new Error('studio summary must not present an empty expression shell as student evidence');
}
for (const [name, readerSource] of [
  ['StudioEvidencePanel', evidencePanel],
  ['ModuleCloseLessonView', moduleClose],
]) {
  if (!readerSource.includes('if (!isMeaningfulStudioExpression(')) {
    throw new Error(`${name} must not present an empty expression shell as student evidence`);
  }
  if (!/record\.artifactSummary\?\.trim\(\)[\s\S]*?>결과물<[\s\S]*?\{record\.artifactSummary\}/.test(readerSource)) {
    throw new Error(`${name} must conditionally show a sparse artifact summary`);
  }
}

const hook = fs.readFileSync('src/features/studio/useStudioSession.ts', 'utf8');
assertStudioFinalAction(studioView);
assertHookCompletionContract(hook);

console.log('debug navigation contract passed');
