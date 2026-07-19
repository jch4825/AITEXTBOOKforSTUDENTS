# Debug Page Locators and Free Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every lesson page freely navigable while preserving explicit completion semantics, and expose stable hybrid page locators only when `debug=1` is present.

**Architecture:** A small pure utility owns debug-mode detection and locator formatting. `MicroLessonFrame` renders the locator from metadata supplied by each lesson view, while studio scene state is lifted just far enough to add the `Sxx/yy` suffix. Studio navigation becomes unconditional, and completion/evidence persistence moves from stage-entry effects to the explicit final button.

**Tech Stack:** React 19, TypeScript 5.8 strict mode, Vite 6, Tailwind CSS utility classes, Node.js source-contract scripts.

## Global Constraints

- The footer `다음` action must advance in normal and debug modes without requiring interaction data.
- Only `debug=1` enables internal page identifiers; all other values are normal mode.
- Locator format is `{lessonId} · P{current}/{total} · {pageKey} [· S{subCurrent}/{subTotal}]`.
- Entering the final page must not complete a lesson; only clicking `다 했습니다!` completes it.
- Skipped activities must not synthesize choices, text, drawings, or AI decisions.
- A studio session with no student process fields must not create an empty `StudioEvidenceV2` record.
- Preserve the in-progress mobile expression fixes already present in `package.json`, `scripts/check-expression-input-mobile-contract.mjs`, `scripts/check-studio-pilot-contract.mjs`, `src/components/mission/blocks/ExpressionInput.tsx`, `src/data/studios/shared.ts`, and `src/features/studio/ModuleCloseLessonView.tsx`.
- No new runtime dependency or test framework.
- UTF-8 Korean text and `tsc --noEmit` must remain clean.

---

### Task 0: Checkpoint the Existing Mobile Expression Fixes

**Files:**
- Modify: `package.json`
- Create: `scripts/check-expression-input-mobile-contract.mjs`
- Modify: `scripts/check-studio-pilot-contract.mjs`
- Modify: `src/components/mission/blocks/ExpressionInput.tsx`
- Modify: `src/data/studios/shared.ts`
- Modify: `src/features/studio/ModuleCloseLessonView.tsx`

**Interfaces:**
- Consumes: Existing uncommitted mobile fixes verified in the preceding session.
- Produces: A clean committed baseline in which studio expression modes are `choice | text | speech | draw` and mobile text/speech inputs fit a 390px viewport.

- [ ] **Step 1: Re-run the focused regression checks**

Run:

```powershell
npm run check:expression-input-mobile
npm run check:studio-pilot
npm run lint
```

Expected: all three commands exit 0; the focused contract prints `mobile expression input contract passed`.

- [ ] **Step 2: Confirm only the known mobile files are included**

Run:

```powershell
git diff --check
git diff --name-only
git status --short
```

Expected: no whitespace errors. The six known mobile files are the only paths selected for the checkpoint commit. Do not stage unrelated untracked assets, `output/`, or the older untracked accessibility plan.

- [ ] **Step 3: Commit the mobile baseline**

```powershell
git add -- package.json scripts/check-expression-input-mobile-contract.mjs scripts/check-studio-pilot-contract.mjs src/components/mission/blocks/ExpressionInput.tsx src/data/studios/shared.ts src/features/studio/ModuleCloseLessonView.tsx
git commit -m "fix: improve mobile studio expression controls"
```

Expected: one commit containing only the six listed files.

---

### Task 1: Add the Pure Debug Locator Contract

**Files:**
- Create: `src/utils/debugMode.ts`
- Create: `scripts/check-debug-navigation-contract.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `LessonId` from `src/types.ts`.
- Produces:
  - `DebugSubPage { current: number; total: number }`
  - `DebugPageLocator { lessonId: LessonId; current: number; total: number; pageKey?: string; subPage?: DebugSubPage }`
  - `isDebugMode(search?: string): boolean`
  - `formatDebugPageId(locator: DebugPageLocator): string`

- [ ] **Step 1: Write the failing utility contract**

Create `scripts/check-debug-navigation-contract.mjs`:

```js
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
```

Add to `package.json`:

```json
"check:debug-navigation": "node scripts/check-debug-navigation-contract.mjs"
```

- [ ] **Step 2: Run the contract to verify it fails**

Run:

```powershell
npm run check:debug-navigation
```

Expected: FAIL with `debug mode utility is missing`.

- [ ] **Step 3: Implement the pure utility**

Create `src/utils/debugMode.ts`:

```ts
import type { LessonId } from '../types';

export interface DebugSubPage {
  current: number;
  total: number;
}

export interface DebugPageLocator {
  lessonId: LessonId;
  current: number;
  total: number;
  pageKey?: string;
  subPage?: DebugSubPage;
}

function twoDigits(value: number): string {
  return String(Math.max(1, Math.trunc(value))).padStart(2, '0');
}

export function isDebugMode(
  search = typeof window === 'undefined' ? '' : window.location.search,
): boolean {
  return new URLSearchParams(search).get('debug') === '1';
}

export function formatDebugPageId(locator: DebugPageLocator): string {
  const parts = [
    locator.lessonId,
    `P${twoDigits(locator.current)}/${twoDigits(locator.total)}`,
  ];
  if (locator.pageKey) parts.push(locator.pageKey);
  if (locator.subPage) {
    parts.push(`S${twoDigits(locator.subPage.current)}/${twoDigits(locator.subPage.total)}`);
  }
  return parts.join(' · ');
}
```

- [ ] **Step 4: Run the contract and type checker**

Run:

```powershell
npm run check:debug-navigation
npm run lint
```

Expected: contract prints `debug navigation contract passed`; TypeScript exits 0.

- [ ] **Step 5: Commit the utility**

```powershell
git add -- package.json scripts/check-debug-navigation-contract.mjs src/utils/debugMode.ts
git commit -m "feat: add debug page locator utility"
```

---

### Task 2: Render Locators and Wire Every Page Kind

**Files:**
- Modify: `scripts/check-debug-navigation-contract.mjs`
- Modify: `src/components/MicroLessonFrame.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/features/studio/StudioLessonView.tsx`
- Modify: `src/features/studio/components/StudioExperience.tsx`
- Modify: `src/features/studio/components/VisualNovelExperience.tsx`
- Modify: `src/features/studio/ModuleCloseLessonView.tsx`

**Interfaces:**
- Consumes: `DebugSubPage`, `formatDebugPageId`, and `isDebugMode` from Task 1.
- Produces:
  - `MicroLessonFrame.pageKey?: string`
  - `MicroLessonFrame.subPage?: DebugSubPage`
  - Controlled `VisualNovelExperience.sceneIndex: number`
  - Controlled `VisualNovelExperience.onSceneIndexChange(index: number): void`

- [ ] **Step 1: Extend the contract with failing view assertions**

Append to `scripts/check-debug-navigation-contract.mjs` before the final `console.log`:

```js
const frame = fs.readFileSync('src/components/MicroLessonFrame.tsx', 'utf8');
const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
const studioView = fs.readFileSync('src/features/studio/StudioLessonView.tsx', 'utf8');
const moduleClose = fs.readFileSync('src/features/studio/ModuleCloseLessonView.tsx', 'utf8');
const visualNovel = fs.readFileSync('src/features/studio/components/VisualNovelExperience.tsx', 'utf8');

for (const token of ['pageKey?: string', 'subPage?: DebugSubPage', 'data-debug-page-id', 'formatDebugPageId', 'isDebugMode']) {
  if (!frame.includes(token)) throw new Error(`frame debug locator missing: ${token}`);
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
```

- [ ] **Step 2: Run the contract to verify it fails**

Run `npm run check:debug-navigation`.

Expected: FAIL with `frame debug locator missing: pageKey?: string`.

- [ ] **Step 3: Extend `MicroLessonFrame`**

Add imports and props in `src/components/MicroLessonFrame.tsx`:

```ts
import { formatDebugPageId, isDebugMode, type DebugSubPage } from '../utils/debugMode';

interface Props {
  lessonId: LessonId;
  crumb: string;
  totalSteps: number;
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onPickLesson: (id: LessonId) => void;
  onGoHome: () => void;
  nextDisabled?: boolean;
  pageKey?: string;
  subPage?: DebugSubPage;
  children: ReactNode;
}
```

Destructure the props and compute the optional label:

```ts
const debugPageId = isDebugMode()
  ? formatDebugPageId({
      lessonId,
      current: currentStep + 1,
      total: totalSteps,
      pageKey,
      subPage,
    })
  : null;
```

Replace the center footer progress markup with:

```tsx
<div
  className="comic-cut-progress min-w-0"
  aria-label={debugPageId
    ? `디버그 페이지 ${debugPageId}`
    : `전체 ${totalSteps}컷 중 ${currentStep + 1}번째 컷`}
  data-debug-page-id={debugPageId ?? undefined}
>
  {debugPageId ? (
    <code className="block max-w-[48vw] overflow-x-auto whitespace-nowrap font-mono text-[10px] leading-tight select-text md:max-w-none md:text-xs">
      {debugPageId}
    </code>
  ) : (
    <span>{String(currentStep + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}</span>
  )}
  <ProgressDots total={totalSteps} current={currentStep} />
</div>
```

Because `data-debug-page-id` receives `undefined` outside debug mode, React omits the attribute from the normal student DOM.

- [ ] **Step 4: Supply page keys from general and one-page views**

In `ImplementedLesson`:

```ts
const pageKey = isWrapUp ? 'wrap-up' : currentStep.kind;
```

Pass `pageKey={pageKey}` to its `MicroLessonFrame`. Pass the following literal keys to other calls:

```tsx
pageKey="coming-soon"
pageKey="module-close"
```

- [ ] **Step 5: Lift visual-story scene state and supply studio metadata**

In `VisualNovelExperience`, remove local scene state and add controlled props:

```ts
interface Props {
  definition: StudioDefinition;
  story: VisualNovelStory;
  supportLevel: SupportLevel;
  accent: string;
  secondary: string;
  onCompleted: () => void;
  onSupportMode: (mode: string) => void;
  sceneIndex: number;
  onSceneIndexChange: (index: number) => void;
}

function selectScene(index: number) {
  onSceneIndexChange(index);
  if (index === story.scenes.length - 1) onCompleted();
}
```

Add the following fields to `StudioExperience`'s `Props` and pass them unchanged to `VisualNovelExperience`:

```ts
interface Props {
  definition: StudioDefinition;
  lesson: LessonContent;
  hard?: HardLessonContent;
  state: StudioSessionState;
  dispatch: (action: StudioAction) => void;
  accent: string;
  secondary: string;
  onEncounterComplete?: () => void;
  sceneIndex: number;
  onSceneIndexChange: (index: number) => void;
}
```

```tsx
<VisualNovelExperience
  definition={definition}
  story={definition.visualNovel}
  supportLevel={state.supportLevel}
  accent={accent}
  secondary={secondary}
  onCompleted={() => onEncounterComplete?.()}
  onSupportMode={(value) => dispatch({ type: 'record-support-mode', value })}
  sceneIndex={sceneIndex}
  onSceneIndexChange={onSceneIndexChange}
/>
```

In `StudioLessonView`:

```ts
import { useCallback, useEffect, useState } from 'react';

const [sceneIndex, setSceneIndex] = useState(0);

useEffect(() => {
  setSceneIndex(0);
}, [definition.id, session.state.stage]);

const debugSubPage = session.state.stage === 'encounter' && definition.visualNovel
  ? { current: sceneIndex + 1, total: definition.visualNovel.scenes.length }
  : undefined;
```

In `VisualNovelExperience`, remove `useState` from the React import because scene state is now owned by `StudioLessonView`.

Pass these props:

```tsx
<MicroLessonFrame
  lessonId={definition.lessonId}
  crumb={`${module?.number ?? 5}단원 · ${module?.title ?? 'AI로 문제해결하기'}`}
  totalSteps={STUDIO_STAGES.length}
  currentStep={currentStep}
  onPrev={session.goPrevious}
  onNext={handleNext}
  onPickLesson={onPickLesson}
  onGoHome={onGoHome}
  nextDisabled={visualNovelLocked || (session.state.stage !== 'complete' && !session.canGoNext)}
  pageKey={session.state.stage}
  subPage={debugSubPage}
>
  <StudioExperience
    definition={definition}
    lesson={lesson}
    hard={hard}
    state={session.state}
    dispatch={session.dispatch}
    accent={theme.accent}
    secondary={theme.secondary}
    onEncounterComplete={() => setCompletedEncounterId(definition.id)}
    sceneIndex={sceneIndex}
    onSceneIndexChange={setSceneIndex}
  />
</MicroLessonFrame>
```

- [ ] **Step 6: Run focused and existing contracts**

Run:

```powershell
npm run check:debug-navigation
npm run check:visual-novel-story
npm run lint
```

Expected: all commands exit 0. The existing visual-story contract still retains its current encounter-completion assertions at this task boundary.

- [ ] **Step 7: Commit locator rendering**

```powershell
git add -- scripts/check-debug-navigation-contract.mjs src/components/MicroLessonFrame.tsx src/views/LessonView.tsx src/features/studio/StudioLessonView.tsx src/features/studio/components/StudioExperience.tsx src/features/studio/components/VisualNovelExperience.tsx src/features/studio/ModuleCloseLessonView.tsx
git commit -m "feat: show stable debug page locators"
```

---

### Task 3: Remove All Forward-Navigation Gates

**Files:**
- Modify: `scripts/check-debug-navigation-contract.mjs`
- Modify: `scripts/check-studio-pilot-contract.mjs`
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`
- Modify: `src/components/MicroLessonFrame.tsx`
- Modify: `src/features/studio/studioReducer.ts`
- Modify: `src/features/studio/useStudioSession.ts`
- Modify: `src/features/studio/StudioLessonView.tsx`
- Modify: `src/features/studio/components/StudioExperience.tsx`
- Modify: `src/features/studio/components/VisualNovelExperience.tsx`
- Modify: `src/features/studio/ModuleCloseLessonView.tsx`

**Interfaces:**
- Consumes: Page metadata wiring from Task 2.
- Produces: Unconditional `studioReducer(..., { type: 'next' })` advancement and a `MicroLessonFrame` API with no `nextDisabled` prop.

- [ ] **Step 1: Change the reducer contract to require free movement**

Replace the blocked-stage assertions in `scripts/check-studio-pilot-contract.mjs` with:

```js
let state = reducerModule.createInitialStudioSession('light', '2026-07-16T00:00:00.000Z');
for (const expected of [
  'first-attempt',
  'condition-change',
  'ai-compare',
  'decision',
  'artifact',
  'transfer',
  'complete',
]) {
  state = reducerModule.studioReducer(state, { type: 'next' });
  if (state.stage !== expected) throw new Error(`free navigation must reach ${expected}, got ${state.stage}`);
}
state = reducerModule.studioReducer(state, { type: 'next' });
if (state.stage !== 'complete') throw new Error('next must stay on the final stage');
```

Delete the two old pilot-contract assertions that require `nextDisabled?: boolean` and `disabled={nextDisabled}` in `MicroLessonFrame`; the new debug-navigation contract below requires the opposite API.

Extend `scripts/check-debug-navigation-contract.mjs`:

```js
if (frame.includes('nextDisabled')) throw new Error('shared footer must not expose a next-page lock');
if (studioView.includes('visualNovelLocked') || studioView.includes('canGoNext')) {
  throw new Error('studio view still gates forward navigation');
}
```

- [ ] **Step 2: Run the contracts to verify they fail**

Run:

```powershell
npm run check:studio-pilot
npm run check:debug-navigation
```

Expected: the pilot contract fails because `first-attempt` remains blocked without an expression; the debug contract fails because `nextDisabled` remains.

- [ ] **Step 3: Make reducer advancement unconditional**

In `src/features/studio/studioReducer.ts`, remove `canAdvance` and implement the next branch as:

```ts
if (action.type === 'next') {
  return index >= STUDIO_STAGES.length - 1
    ? state
    : { ...state, stage: STUDIO_STAGES[index + 1] };
}
```

In `useStudioSession`, remove the `canAdvance` import and `canGoNext` return field.

- [ ] **Step 4: Remove shared and view-level locks**

From `MicroLessonFrame`:

- remove `nextDisabled?: boolean` from `Props`;
- remove its default and destructuring;
- remove `disabled={nextDisabled}` and the locked `aria-label` from the next button.

From `StudioLessonView`:

- remove `completedEncounterId` and `visualNovelLocked`;
- remove `nextDisabled` from `MicroLessonFrame`;
- remove `onEncounterComplete` from `StudioExperience`.

From `StudioExperience` and `VisualNovelExperience`, remove the `onEncounterComplete` / `onCompleted` prop chain and the last-scene completion callback. Keep controlled scene selection:

```ts
function selectScene(index: number) {
  onSceneIndexChange(index);
}
```

From `ModuleCloseLessonView`, remove `expressionComplete` and its `nextDisabled` prop. Keep the already-correct mobile mode list:

```ts
const NEXT_MODES: ExpressionMode[] = ['choice', 'text', 'speech'];
```

- [ ] **Step 5: Update the visual-story contract**

In `scripts/check-visual-novel-social-story-contract.mjs`, replace the old completion-gate token checks with assertions that:

```js
if (studioView.includes('completedEncounterId') || studioView.includes('visualNovelLocked')) {
  throw new Error('visual story viewing must not gate the shared next button');
}
if (!studioView.includes('sceneIndex') || !studioView.includes('setSceneIndex')) {
  throw new Error('studio route must retain controlled scene indexing for debug locators');
}
```

- [ ] **Step 6: Run free-navigation verification**

Run:

```powershell
npm run check:studio-pilot
npm run check:debug-navigation
npm run check:visual-novel-story
npm run lint
```

Expected: all commands exit 0 and the reducer reaches every studio stage with no response data.

- [ ] **Step 7: Commit free navigation**

```powershell
git add -- scripts/check-debug-navigation-contract.mjs scripts/check-studio-pilot-contract.mjs scripts/check-visual-novel-social-story-contract.mjs src/components/MicroLessonFrame.tsx src/features/studio/studioReducer.ts src/features/studio/useStudioSession.ts src/features/studio/StudioLessonView.tsx src/features/studio/components/StudioExperience.tsx src/features/studio/components/VisualNovelExperience.tsx src/features/studio/ModuleCloseLessonView.tsx
git commit -m "feat: allow free lesson page navigation"
```

---

### Task 4: Make Completion Explicit and Skip Empty Evidence

**Files:**
- Create: `src/features/studio/studioCompletion.ts`
- Modify: `scripts/check-debug-navigation-contract.mjs`
- Modify: `src/features/studio/useStudioSession.ts`
- Modify: `src/features/studio/StudioLessonView.tsx`

**Interfaces:**
- Consumes: `StudioSessionState` from `src/features/studio/types.ts` and `saveStudioEvidence` from `evidenceStorage.ts`.
- Produces:
  - `hasStudentProcessEvidence(state: StudioSessionState): boolean`
  - `useStudioSession.finish(): void`

- [ ] **Step 1: Add failing completion assertions**

Append to `scripts/check-debug-navigation-contract.mjs`:

```js
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
```

- [ ] **Step 2: Run the contract to verify it fails**

Run `npm run check:debug-navigation`.

Expected: FAIL with `studio completion helper is missing`.

- [ ] **Step 3: Implement the pure evidence predicate**

Create `src/features/studio/studioCompletion.ts`:

```ts
import type { StudioSessionState } from './types';

export function hasStudentProcessEvidence(state: StudioSessionState): boolean {
  return Boolean(
    state.firstAttempt
    || state.aiDecision
    || state.finalExpression
    || state.artifactSummary?.trim()
    || state.transferExpression,
  );
}
```

- [ ] **Step 4: Replace automatic completion with `finish`**

In `useStudioSession.ts`, delete the effect that watches `state.stage === 'complete'`. Keep the definition-reset effect. Add:

```ts
import { hasStudentProcessEvidence } from './studioCompletion';

const finish = useCallback(() => {
  if (completedRef.current) return;
  completedRef.current = true;
  const completedAt = new Date().toISOString();

  if (hasStudentProcessEvidence(state)) {
    const settings = loadTeacherRecordingSettings();
    const evidence: StudioEvidenceV2 = {
      version: 2,
      id: evidenceIdRef.current,
      learnerAlias: settings.learnerAlias,
      studioId: definition.id,
      lessonId: definition.lessonId,
      firstAttempt: state.firstAttempt,
      supportLevel: initialSupportLevel,
      supportModesUsed: state.supportModesUsed,
      aiSource: definition.aiContribution.source,
      aiRole: definition.aiContribution.role,
      aiDecision: state.aiDecision,
      finalExpression: state.finalExpression,
      artifactSummary: state.artifactSummary,
      transferExpression: state.transferExpression,
      observation: EMPTY_OBSERVATION,
      startedAt: state.startedAt,
      completedAt,
      updatedAt: completedAt,
    };
    saveStudioEvidence(evidence, settings.processRecording);
  }

  onComplete();
}, [definition, initialSupportLevel, onComplete, state]);
```

Return `finish` from the hook.

- [ ] **Step 5: Call `finish` only from the final button**

In `StudioLessonView.handleNext`:

```ts
function handleNext() {
  if (session.state.stage === 'complete') {
    session.finish();
    onGoHome();
    return;
  }
  session.goNext();
}
```

This preserves explicit progress completion through the existing `markStudioComplete` callback while allowing final-page entry without side effects.

- [ ] **Step 6: Run completion and regression checks**

Run:

```powershell
npm run check:debug-navigation
npm run check:studio-pilot
npm run check:teacher-recording
npm run lint
```

Expected: all commands exit 0; empty and partial evidence cases pass the pure helper assertions.

- [ ] **Step 7: Commit explicit completion**

```powershell
git add -- scripts/check-debug-navigation-contract.mjs src/features/studio/studioCompletion.ts src/features/studio/useStudioSession.ts src/features/studio/StudioLessonView.tsx
git commit -m "fix: complete studios only from the final action"
```

---

### Task 5: Full Verification and Browser Acceptance

**Files:**
- Verify only; no production file should change.

**Interfaces:**
- Consumes: All implementation tasks.
- Produces: Fresh evidence that normal navigation, debug locators, explicit completion, and compatibility checks pass.

- [ ] **Step 1: Run the complete relevant command suite**

Run:

```powershell
npm run check:expression-input-mobile
npm run check:debug-navigation
npm run check:studio-pilot
npm run check:visual-novel-story
npm run check:teacher-recording
npm run lint
npm run check:encoding
npm run build
```

Expected: every command exits 0. Vite may print the existing advisory about chunks larger than 500 kB; no compilation or build error is allowed.

- [ ] **Step 2: Verify debug mode on a fresh localhost origin**

Open:

```text
http://127.0.0.3:3000/AITEXTBOOKforSTUDENTS/?debug=1&lesson=m1-l1
```

At a 390px viewport and 125% text size, verify:

- encounter scene 1 shows `m1-l1 · P01/08 · encounter · S01/04`;
- selecting scene 3 changes only the suffix to `S03/04`;
- clicking the footer `다음` without completing all scenes reaches `m1-l1 · P02/08 · first-attempt`;
- clicking `이전` to return to the encounter resets the locator to `S01/04`;
- repeated footer clicks reach every stage with no generated response values;
- entering `P08/08 · complete` does not mark the lesson complete before the final button is clicked.

- [ ] **Step 3: Verify normal mode and query persistence**

Open the same lesson without `debug=1` and verify no `data-debug-page-id` attribute or internal locator text is present. Then return to the debug URL, choose another lesson from the sidebar, and confirm `debug=1` remains in the URL.

Also open representative non-studio routes in debug mode and verify their visible locators:

- `?debug=1&lesson=m1-l2`: a regular activity uses its `LessonStep.kind`, and its final page uses `wrap-up`;
- `?debug=1&lesson=m1-l3`: the placeholder page shows `m1-l3 · P01/01 · coming-soon`;
- `?debug=1&lesson=m1-l11`: the module close shows `m1-l11 · P01/01 · module-close`.

- [ ] **Step 4: Verify explicit completion without empty evidence**

Before the run, open `?teacher=1&debug=1`, unlock with the configured teacher password (the local-development fallback is `teacher` when no password is configured), enable process recording in the onboarding UI if it is off, choose `학생 기록`, and note the number of visible evidence cards for `m1-l1`. Then return to the fresh debug lesson, skip every studio activity, click `다 했습니다!`, reopen the same `학생 기록` panel through the app UI, and verify:

- the lesson progress is marked complete;
- the `m1-l1` evidence count is unchanged and no blank record was added;
- no console error is emitted.

Do not inspect or mutate browser storage directly; the acceptance check must use the product UI, while `hasStudentProcessEvidence` is covered independently by the Task 4 contract.

- [ ] **Step 5: Inspect the final worktree**

Run:

```powershell
git diff --check
git status --short
git log -5 --oneline
```

Expected: no unstaged implementation changes and no whitespace errors. Unrelated pre-existing untracked assets remain untouched.
