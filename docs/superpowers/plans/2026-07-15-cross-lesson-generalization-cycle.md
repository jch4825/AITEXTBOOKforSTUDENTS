# Cross-Lesson Generalization Cycle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build six cross-lesson judgment cycles that save a student's first thought in lesson 6 and revisit it with changed conditions, AI comparison, transfer practice, and teacher process assessment in each module's final lesson.

**Architecture:** Add two focused mission blocks, `judgment-preview` and `judgment-main`, backed by a versioned module-level localStorage record. Keep cross-lesson state and evaluation logic outside `MissionStep`; the mission container only renders the blocks and checks their completion. Build the full experience with module 1 as a browser-tested pilot, then migrate modules 2–6 using a structural validator.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, browser localStorage, Web Speech API through the existing `MicButton`, Node validation scripts, Playwright CLI for manual browser automation.

## Global Constraints

- One student per browser; no student profiles, server synchronization, class dashboard, or multi-device merge.
- The core activity must work without a Gemini API key or network response.
- Preview activities show no correctness, score, praise feedback, or recommended answer.
- Changing an answer is not inherently better than keeping it.
- Optional reason, drawing, and teacher assessment never block student completion.
- Automatic speech must respect the global TTS toggle; explicit replay buttons may use `speakNow`.
- Preserve all unrelated dirty and untracked workspace files.
- UTF-8 Korean content and strict TypeScript build must pass.

---

## File Map

### Create

- `src/components/mission/generalization/generalizationTypes.ts` — student evidence and teacher assessment types shared by storage and UI.
- `src/components/mission/generalization/generalizationStorage.ts` — versioned localStorage parsing, saving, partial update, and module reset.
- `src/components/mission/generalization/useGeneralizationCycle.ts` — React state hook that synchronizes a single cycle.
- `src/components/mission/generalization/ExpressionInput.tsx` — choice, AAC, text/STT, and optional drawing expression UI.
- `src/components/mission/generalization/JudgmentPreview.tsx` — unresolved first-thought activity.
- `src/components/mission/generalization/JudgmentMain.tsx` — ten-phase changed-condition activity and evidence comparison.
- `src/components/mission/generalization/TeacherObservation.tsx` — four rubric fields and one help-level field.
- `src/components/mission/generalization/GeneralizationRecordsPanel.tsx` — teacher-page viewer/editor for six cycles.
- `scripts/generalization-storage.test.ts` — storage contract tests executed with `tsx` and Node's test runner.
- `scripts/check-generalization-cycles.mjs` — source-data structural validator for six paired cycles.

### Modify

- `src/types.ts` — add the two mission block schemas and union members.
- `src/components/mission/MissionStep.tsx` — render new blocks and define their completion conditions.
- `src/components/mission/printMission.ts` — print a readable evidence summary for the new blocks.
- `src/views/TeacherView.tsx` — mount the generalization records panel.
- `src/data/lessons/m1.ts` through `src/data/lessons/m6.ts` — move previews to lesson 6 and replace final consecutive studios with main cycles.
- `package.json` — add `test:generalization-storage` and `check:generalization` commands.
- `docs/worker-guides/mission-authoring-guide.md` — document both new blocks and the no-feedback rule.

---

### Task 1: Storage contract and block types

**Files:**

- Create: `src/components/mission/generalization/generalizationTypes.ts`
- Create: `src/components/mission/generalization/generalizationStorage.ts`
- Create: `src/components/mission/generalization/useGeneralizationCycle.ts`
- Create: `scripts/generalization-storage.test.ts`
- Modify: `src/types.ts`
- Modify: `package.json`

**Interfaces:**

- Produces: `GeneralizationCycleRecord`, `ExpressionResponse`, `TeacherAssessment`, `loadGeneralizationRecords(storage)`, `saveGeneralizationRecords(storage, records)`, `updateGeneralizationCycle(storage, cycleId, moduleId, update)`, `clearGeneralizationCycle(storage, cycleId)`, and `useGeneralizationCycle(cycleId, moduleId)`.
- Consumes: browser `Storage`, React `useEffect`/`useState`, and `ModuleId` from `src/types.ts`.

- [ ] **Step 1: Write storage tests before implementation**

Create tests using a small in-memory `Storage` implementation. Cover empty storage, valid round-trip, corrupt JSON recovery, partial update preservation, and one-cycle reset preservation.

```ts
test('update preserves preview when main evidence is added', () => {
  const storage = memoryStorage();
  updateGeneralizationCycle(storage, 'generalization-m1', 'm1', {
    preview: { response: { mode: 'choice', choiceIds: ['check-first'] }, capturedAt: '2026-07-15T00:00:00.000Z', capturedAtMain: false },
  });
  updateGeneralizationCycle(storage, 'generalization-m1', 'm1', {
    main: { importantInfoIds: ['network'], exploredMethodIds: ['ask', 'observe'] },
  });
  assert.deepEqual(loadGeneralizationRecords(storage)['generalization-m1'].preview?.response.choiceIds, ['check-first']);
});

test('clearing one cycle preserves the other five records', () => {
  const storage = memoryStorage();
  updateGeneralizationCycle(storage, 'generalization-m1', 'm1', { studentName: '학생' });
  updateGeneralizationCycle(storage, 'generalization-m2', 'm2', { studentName: '학생' });
  clearGeneralizationCycle(storage, 'generalization-m1');
  assert.equal(loadGeneralizationRecords(storage)['generalization-m1'], undefined);
  assert.equal(loadGeneralizationRecords(storage)['generalization-m2'].studentName, '학생');
});
```

- [ ] **Step 2: Run the tests and verify RED**

Run: `npx --yes tsx --test scripts/generalization-storage.test.ts`

Expected: FAIL because `generalizationStorage.ts` and its exported functions do not exist.

- [ ] **Step 3: Add the evidence types**

Define the shared contracts without UI-specific state.

```ts
export type ExpressionMode = 'choice' | 'aac' | 'text' | 'speech' | 'draw';
export interface ExpressionResponse {
  mode: ExpressionMode;
  choiceIds?: string[];
  text?: string;
  drawing?: string;
}
export type RubricStatus = 'not-observed' | 'with-help' | 'independent';
export type HelpLevel = 'independent' | 'visual-verbal' | 'reduced-choices' | 'co-performed';
export interface TeacherAssessment {
  importantInformation: RubricStatus;
  selfAttempt: RubricStatus;
  aiComparison: RubricStatus;
  conditionAdjustment: RubricStatus;
  helpLevel?: HelpLevel;
  note?: string;
}
export interface PreviewEvidence {
  response: ExpressionResponse;
  reason?: ExpressionResponse;
  capturedAt: string;
  capturedAtMain: boolean;
}
export interface MainEvidence {
  importantInfoIds: string[];
  exploredMethodIds: string[];
  preferredMethodId?: string;
  aiDecision?: 'accept' | 'modify' | 'keep';
  finalResponse?: ExpressionResponse;
  reason?: ExpressionResponse;
  transferChoiceId?: string;
  completedAt?: string;
}
export interface GeneralizationCycleRecord {
  version: 1;
  cycleId: string;
  moduleId: ModuleId;
  studentName?: string;
  preview?: PreviewEvidence;
  main?: MainEvidence;
  assessment?: TeacherAssessment;
}
```

Add `JudgmentPreviewBlock` and `JudgmentMainBlock` to `MissionBlock` using these exact content shapes.

```ts
export interface JudgmentOption { id: string; emoji: string; label: string; }
export interface JudgmentPreviewBlock {
  kind: 'judgment-preview'; id: string; cycleId: string; moduleId: ModuleId;
  title: string; scenario: string; prompt: string; options: JudgmentOption[];
  aacReasons?: JudgmentOption[]; allowedModes: ExpressionMode[]; revisitLessonId: LessonId;
}
export interface JudgmentMainBlock {
  kind: 'judgment-main'; id: string; cycleId: string; moduleId: ModuleId;
  title: string; changedScenario: string;
  changedConditions: { id: string; label: string }[];
  importantInfo: JudgmentOption[]; methods: JudgmentOption[];
  aiContribution: { kind: 'alternative' | 'question'; text: string };
  finalOptions: JudgmentOption[]; aacReasons?: JudgmentOption[];
  allowedModes: ExpressionMode[]; transferScenario: string; transferOptions: JudgmentOption[];
}
```

- [ ] **Step 4: Implement versioned storage and hook**

Use the exact key `ai-students-generalization-v1`. Parse only records with `version === 1`, known module IDs, and matching string `cycleId`; return `{}` for corrupt data. `updateGeneralizationCycle` must merge nested `preview`, `main`, and `assessment` objects instead of replacing sibling evidence.

```ts
export const GENERALIZATION_STORAGE_KEY = 'ai-students-generalization-v1';

export function updateGeneralizationCycle(
  storage: Storage,
  cycleId: string,
  moduleId: ModuleId,
  update: GeneralizationCycleUpdate,
): GeneralizationCycleRecord {
  const records = loadGeneralizationRecords(storage);
  const previous = records[cycleId];
  const next = mergeCycleRecord(previous, cycleId, moduleId, update);
  saveGeneralizationRecords(storage, { ...records, [cycleId]: next });
  return next;
}
```

The hook returns `{ record, updatePreview, updateMain, updateAssessment, resetCycle, saveError, drawingDropped }`. Before saving, resize drawings to at most 640×360 and encode them as JPEG quality 0.72. If storage rejects a write, retry once after removing only the new drawing value; set `drawingDropped` when the retry succeeds. If the second write also fails, retain the React state and set `saveError` to the student-safe message from the spec.

Add the package script exactly as follows:

```json
"test:generalization-storage": "npx --yes tsx --test scripts/generalization-storage.test.ts"
```

- [ ] **Step 5: Run storage tests and build**

Run: `npx --yes tsx --test scripts/generalization-storage.test.ts`

Expected: all storage tests PASS.

Run: `npm run build`

Expected: TypeScript and Vite build PASS.

- [ ] **Step 6: Commit the storage foundation**

```powershell
git add package.json src/types.ts src/components/mission/generalization/generalizationTypes.ts src/components/mission/generalization/generalizationStorage.ts src/components/mission/generalization/useGeneralizationCycle.ts scripts/generalization-storage.test.ts
git commit -m "feat: add cross-lesson judgment storage"
```

---

### Task 2: Shared expression input and unresolved preview

**Files:**

- Create: `src/components/mission/generalization/ExpressionInput.tsx`
- Create: `src/components/mission/generalization/JudgmentPreview.tsx`
- Modify: `src/components/mission/MissionStep.tsx`
- Modify: `src/data/lessons/m1.ts`

**Interfaces:**

- Consumes: `JudgmentPreviewBlock`, `ExpressionResponse`, `useGeneralizationCycle`, existing `MicButton`, existing `DrawPad`, mission `studentName`, and mission colors.
- Produces: `JudgmentPreview` with `onChange(answerSummary)` so `MissionStep` can save ordinary per-lesson completion state.

- [ ] **Step 1: Record the failing browser behavior**

Start the dev server and open `?lesson=m1-l6`. Navigate to its mission and inspect the final chapter.

Expected RED: no chapter named `예고 활동 | 첫 생각 저장`, no `judgment-preview` renderer, and no `generalization-m1` record in localStorage.

- [ ] **Step 2: Build `ExpressionInput`**

Render picture-supported choice cards first. Add a disclosure labeled `다른 방법으로 남겨도 돼요` containing AAC chips, a short text input plus `MicButton`, and optional `DrawPad`. Only one primary response is required; changing mode preserves earlier text/drawing in local component state until save.

```tsx
<ExpressionInput
  prompt={block.prompt}
  options={block.options}
  aacReasons={block.aacReasons}
  allowedModes={block.allowedModes}
  value={draft}
  onChange={setDraft}
  accent={accent}
/>
```

- [ ] **Step 3: Build `JudgmentPreview` with no answer feedback**

The component shows the scene, optional reason prompt, and `첫 생각 저장하기`. After saving it shows only the neutral unresolved message and a `첫 생각 다시 보기` action. Do not render `good`, `correct`, score, green success language, or per-option replies.

```tsx
updatePreview({
  response: draft,
  reason: reasonIsPresent ? reason : undefined,
  capturedAt: new Date().toISOString(),
  capturedAtMain: false,
});
onChange({ cycleId: block.cycleId, saved: true, response: draft });
```

- [ ] **Step 4: Add the renderer and completion rule**

In `MissionStep`, render `JudgmentPreview` and consider it complete only when `answers[block.id]?.saved === true`. Pass `studentName` so the cycle record identifies the current learner.

- [ ] **Step 5: Add the module 1 preview to `m1-l6`**

Add a final mission chapter titled `예고 활동 | 첫 생각 저장` with `cycleId: 'generalization-m1'`. The scene asks whether a newly installed speaking device is AI, with neutral options `AI일 수 있어요`, `그냥 기계일 수 있어요`, and `아직 모르겠어요. 더 살펴볼래요`. No option contains a correct marker or feedback.

- [ ] **Step 6: Verify GREEN in the browser**

With TTS off, select a first thought, add one AAC reason, save, reload, and leave/re-enter the lesson.

Expected: no automatic speech, no correctness feedback, the unresolved closing appears, and `ai-students-generalization-v1.generalization-m1.preview` survives reload.

- [ ] **Step 7: Commit the preview pilot**

```powershell
git add src/components/mission/generalization/ExpressionInput.tsx src/components/mission/generalization/JudgmentPreview.tsx src/components/mission/MissionStep.tsx src/data/lessons/m1.ts
git commit -m "feat: add unresolved first-thought preview"
```

---

### Task 3: Main judgment flow and teacher observation

**Files:**

- Create: `src/components/mission/generalization/JudgmentMain.tsx`
- Create: `src/components/mission/generalization/TeacherObservation.tsx`
- Modify: `src/components/mission/MissionStep.tsx`
- Modify: `src/data/lessons/m1.ts`

**Interfaces:**

- Consumes: `JudgmentMainBlock`, `useGeneralizationCycle`, `isTeacherSessionActive`, and `ExpressionInput`.
- Produces: a combined answer summary with `importantInfoIds`, `exploredMethodIds`, `preferredMethodId`, `aiDecision`, `finalResponse`, `transferChoiceId`, and the copied preview response.

- [ ] **Step 1: Record the failing final-lesson behavior**

Open `?lesson=m1-l11`, enter the mission, and navigate past the review chapters.

Expected RED: the old consecutive `예고: 새 장면 만나기` and `본 활동: 나의 판단 만들기` chapters remain; the l6 first thought is not recalled and no AI accept/modify/reject control exists.

- [ ] **Step 2: Implement the ten-phase main activity**

Use internal phase navigation with a visible `1 / 7` style progress label. Combine the ten pedagogical actions into seven student screens: recall, changed conditions, information, methods, AI comparison, final choice, transfer/evidence.

Require at least two method IDs before leaving the methods phase. Require exactly one `accept | modify | keep` decision. Final reason remains optional.

```ts
const complete =
  importantInfoIds.length > 0 &&
  exploredMethodIds.length >= 2 &&
  Boolean(preferredMethodId) &&
  Boolean(aiDecision) &&
  hasExpression(finalResponse) &&
  Boolean(transferChoiceId);
```

If the preview is missing, show `저장된 첫 생각이 아직 없어요` and reuse the preview response control before revealing changed conditions. Save it with `capturedAtMain: true`.

- [ ] **Step 3: Implement neutral comparison language**

Compare stable choice IDs only when both preview and final responses use choices. If IDs match, show `같은 생각을 더 분명하게 했어요`. Otherwise show `새 정보를 보고 생각을 조정했어요`. Free-form or drawing comparisons use `첫 생각과 지금 생각을 나란히 살펴봤어요`.

- [ ] **Step 4: Implement `TeacherObservation`**

Render four three-state controls (`관찰 전`, `도움받아 시도`, `스스로 시도`), one help-level selector, and an optional note. Save every change immediately through `updateAssessment`. Do not include this state in student completion.

- [ ] **Step 5: Show teacher controls only in an authenticated session**

Call `isTeacherSessionActive()` when the main block renders. Authenticated sessions see a closed `<details>` labeled `교사 관찰 기록`; unauthenticated sessions do not receive the controls in the DOM.

- [ ] **Step 6: Replace module 1's old consecutive studio**

Delete `studio_preview_m1_l11`, `studio_plan_m1_l11`, and `studio_draw_m1_l11`. Add one `judgment-main` chapter using `generalization-m1`, at least two changed conditions, four possible methods, a scripted alternative from 아이미, and one transfer scene. Update the final summary row to reference the new main block.

- [ ] **Step 7: Verify RED-to-GREEN end to end**

Play `m1-l6` preview, navigate to `m1-l11`, explore two methods, choose `내 생각을 유지할래요`, add a reason, and complete the transfer scene.

Expected: the saved first thought appears; keeping the same decision is not marked wrong; the evidence card contains all four stages; main completion becomes true only after transfer.

Repeat after deleting the cycle record.

Expected: fallback first-thought capture appears and the teacher record shows `예고 미참여`.

- [ ] **Step 8: Commit the main pilot**

```powershell
git add src/components/mission/generalization/JudgmentMain.tsx src/components/mission/generalization/TeacherObservation.tsx src/components/mission/MissionStep.tsx src/data/lessons/m1.ts
git commit -m "feat: add judgment replay and process assessment"
```

---

### Task 4: Teacher dashboard and printing

**Files:**

- Create: `src/components/mission/generalization/GeneralizationRecordsPanel.tsx`
- Modify: `src/views/TeacherView.tsx`
- Modify: `src/components/mission/printMission.ts`

**Interfaces:**

- Consumes: all records from `loadGeneralizationRecords(window.localStorage)`, `TeacherObservation`, and mission answer summaries.
- Produces: six teacher-facing record cards and printable comparison rows.

- [ ] **Step 1: Record missing teacher evidence**

Open `?teacher=1`, authenticate, and inspect the page.

Expected RED: no `일반화 과정 기록` section and no first-thought evidence from module 1.

- [ ] **Step 2: Build the teacher records panel**

Display six module cards in order. Each card shows participation status, first thought, AI decision, final thought, transfer choice, four rubric statuses, and help level. Empty records show `아직 기록이 없어요`. Editing uses the same `TeacherObservation` component and persists immediately.

- [ ] **Step 3: Mount the panel in `TeacherView`**

Place it after `ProgressPanel` and before `ObjectivesPanel`. The existing password gate remains the only route into the page.

- [ ] **Step 4: Add printable evidence summaries**

For `judgment-preview`, print `첫 생각` and optional reason. For `judgment-main`, print `첫 생각`, `AI 의견에 대한 판단`, `최종 생각`, `새 장면 선택`, and teacher help level. Escape all free-form text before interpolating it into print HTML. Worksheets receive a normal evidence section; certificates receive a compact evidence strip under the certificate body so the final-lesson record is not discarded.

- [ ] **Step 5: Verify dashboard and print**

Expected: module 1 data appears after authentication, edits persist after reload, student mode does not expose the editor, and print preview contains readable text without a base64 drawing dump.

- [ ] **Step 6: Commit teacher evidence support**

```powershell
git add src/components/mission/generalization/GeneralizationRecordsPanel.tsx src/views/TeacherView.tsx src/components/mission/printMission.ts
git commit -m "feat: expose generalization evidence to teachers"
```

---

### Task 5: Migrate modules 2–6 and add structural validation

**Files:**

- Create: `scripts/check-generalization-cycles.mjs`
- Modify: `package.json`
- Modify: `src/data/lessons/m2.ts`
- Modify: `src/data/lessons/m3.ts`
- Modify: `src/data/lessons/m4.ts`
- Modify: `src/data/lessons/m5.ts`
- Modify: `src/data/lessons/m6.ts`
- Modify: `docs/worker-guides/mission-authoring-guide.md`

**Interfaces:**

- Consumes: the two block schemas proven by module 1.
- Produces: paired cycle IDs `generalization-m1` through `generalization-m6` and a deterministic validation command.

- [ ] **Step 1: Write the structural checker before migration**

The script reads all six lesson files and asserts:

```js
const pairs = [
  ['m1', 'm1-l6', 'm1-l11'],
  ['m2', 'm2-l6', 'm2-l11'],
  ['m3', 'm3-l6', 'm3-l11'],
  ['m4', 'm4-l6', 'm4-l11'],
  ['m5', 'm5-l6', 'm5-l12'],
  ['m6', 'm6-l6', 'm6-l12'],
];
```

For each module, require one `judgment-preview`, one `judgment-main`, two or more `changedConditions`, four or more main methods, two or more transfer options, matching cycle IDs, and no `studio_preview_`, `studio_plan_`, or `studio_draw_` identifiers.

Add the package script exactly as follows:

```json
"check:generalization": "node scripts/check-generalization-cycles.mjs"
```

- [ ] **Step 2: Run the checker and verify RED**

Run: `node scripts/check-generalization-cycles.mjs`

Expected: FAIL for modules 2–6 because their previews remain in final lessons and use old studio IDs.

- [ ] **Step 3: Migrate module 2**

Place the birthday-invitation first thought in `m2-l6`. In `m2-l11`, change recipient, length, and medium; provide methods for adding audience, desired length, example, and tone. AI asks which condition matters most. Transfer to a club recruitment message.

- [ ] **Step 4: Migrate module 3**

Place the stuck-math-problem first thought in `m3-l6`. In `m3-l11`, change deadline, available tool, and explanation requirement; methods include answer request, step hint, example problem, and teacher help. AI proposes asking for one hint without the final answer. Transfer to understanding a long passage.

- [ ] **Step 5: Migrate module 4**

Place the school-logo stranger-account first thought in `m4-l6`. In `m4-l11`, change claimed identity, contact time, and verification tool; methods include pausing, checking through another channel, asking a trusted adult, and blocking/reporting. AI asks how identity can be confirmed without sending information. Transfer to a delivery-style password request.

- [ ] **Step 6: Migrate module 5**

Place the late-bus first thought in `m5-l6`. In `m5-l12`, change appointment time, phone battery, and companion; methods include waiting with a time limit, checking another route, contacting the waiting person, and asking nearby staff. AI proposes preserving battery while confirming one safe alternative. Transfer to a blocked familiar route.

- [ ] **Step 7: Migrate module 6**

Place the out-of-stock item first thought in `m6-l6`. In `m6-l12`, change needed date, budget, and available helper; methods include choosing an alternative, checking another store, asking when stock returns, and changing the plan. AI asks which condition cannot change. Transfer to a sold-out kiosk menu.

- [ ] **Step 8: Update the authoring guide**

Document both new block schemas, cross-lesson `cycleId` rules, the preview no-feedback rule, minimum two methods, neutral comparison language, optional reasons, and teacher assessment independence.

- [ ] **Step 9: Run the checker and build**

Run: `npm run check:generalization`

Expected: PASS with six preview/main pairs.

Run: `npm run build`

Expected: PASS.

- [ ] **Step 10: Commit all six paired cycles**

```powershell
git add package.json scripts/check-generalization-cycles.mjs src/data/lessons/m2.ts src/data/lessons/m3.ts src/data/lessons/m4.ts src/data/lessons/m5.ts src/data/lessons/m6.ts docs/worker-guides/mission-authoring-guide.md
git commit -m "content: pair six first-thought judgment cycles"
```

---

### Task 6: Full verification and cleanup

**Files:**

- Modify only files changed by Tasks 1–5 when verification identifies an in-scope defect.

**Interfaces:**

- Consumes: complete six-cycle implementation.
- Produces: verified production build and evidence that the core student and teacher flows work.

- [ ] **Step 1: Run all static checks**

```powershell
npm run test:generalization-storage
npm run check:generalization
npm run build
npm run check:encoding
npm run check:ui-polish
npm run check:activity-icons
git diff --check
```

Expected: all commands PASS; only the existing Vite large-chunk warning may remain.

- [ ] **Step 2: Browser-test the complete module 1 flow**

At 1280×900, test choice+AAC preview, reload persistence, changed conditions, two-method gating, AI keep/modify/accept controls, optional reason, transfer, evidence card, authenticated teacher observation, teacher dashboard, and print preview.

Expected: all required stages work and no student-facing correctness judgment appears.

- [ ] **Step 3: Smoke-test modules 2–6**

For every preview lesson, save one first thought. For every final lesson, confirm the matching first thought is recalled, changed-condition tags render, at least four methods are available, and the module-specific transfer scene appears.

- [ ] **Step 4: Verify the TTS regression condition**

With `ai-students-settings.ttsEnabled` set to `false`, enter the final mission and navigate through both new block types.

Expected: zero automatic `speechSynthesis.speak` calls. Explicit speaker buttons still call speech once.

- [ ] **Step 5: Review the worktree scope**

Run: `git status --short` and `git diff --stat HEAD~4..HEAD`.

Expected: unrelated pre-existing untracked files remain untouched; implementation commits contain only plan-scoped files.

- [ ] **Step 6: Commit any verification-only corrections**

If verification required an in-scope correction, stage only that file and commit:

```powershell
git commit -m "fix: polish judgment cycle interactions"
```

If no correction was necessary, do not create an empty commit.
