# Maintainability Review — AI Bridge

Date: 2026-05-31
Scope: `C:\AI\AI_bridge_test_v0.1\src` (structure, not correctness)
Reviewer: Senior Code Reviewer (Claude)

---

## TL;DR

The codebase is **healthier than CLAUDE.md suggests**. CLAUDE.md states `Tutorial.tsx` is "~67k lines" and `ToolRegistry.ts` "~29k lines" — actual figures are **2,453** and **2,341** respectively. That outdated claim is currently being used to justify "don't refactor." On real numbers, the large files are **marginal, not problematic**.

The genuine maintainability debt is concentrated in **four areas**: (1) duplicated `systemPrompt` text between `tutorialData.ts` and `ToolRegistry.ts`, (2) duplicated `useFavorites` hook between two views, (3) `LessonViewer` has accreted real logic (1,455 lines, 18 useState/useRef, lesson-specific branches embedded) that is no longer "just embedded content", and (4) `src/types.ts` is documentation-honored but code-orphaned — the actually-used shared types live elsewhere.

**Verdict: showing strain.** Not refactor-blocked, but the LessonViewer hotspots and systemPrompt drift will cost real debugging time the next time a lesson behaves oddly.

---

## Line counts (corrected vs CLAUDE.md)

| File | CLAUDE.md says | Actual |
| --- | --- | --- |
| `src/views/Tutorial.tsx` | ~67,000 | **2,453** |
| `src/tools/ToolRegistry.ts` | ~29,000 | **2,341** |
| `src/data/tutorialData.ts` | (not specified) | 2,586 |
| `src/views/Module4Components.tsx` | (large, by design) | 1,416 |
| `src/views/Module5Components.tsx` | (large, by design) | 1,337 |
| `src/data/curriculumStandards.json` | "43k lines" | (JSON data — fine) |
| `src/index.css` | — | 1,317 |
| Total `src/` (excluding JSON) | | ~17,500 |

**Action item:** Update CLAUDE.md line-count claims. They overstate the problem by ~27× and may be steering future refactor decisions in the wrong direction.

---

## High-leverage refactoring opportunities

### 1. systemPrompt drift between `tutorialData.ts` and `ToolRegistry.ts`

CLAUDE.md memory (`feedback_systemprompt_sync.md`) already flags this. Verified — and the prompts have **already diverged**. Example:

- `tutorialData.ts:2384` — AI 윤리 수업 지도안 systemPrompt
- `ToolRegistry.ts:260`  — same tool's systemPrompt

Reading both side by side: the registry version has an extra `'학생 특성·포커스'` input, "성취기준 절대 출력하지 마세요" warning, and "위험 강조 대신 현명한 활용" stance. The tutorial copy is missing those refinements.

Confirmed duplicate pairs (each is the "same" prompt with subtle drift):

| Tool/lesson | tutorialData.ts | ToolRegistry.ts |
| --- | --- | --- |
| 프롬프트 설계 전문가 | L947 | L372 |
| 이미지/영상/음악 프롬프트 디자이너 | L1011 | L400 |
| 학습 자료 수준 조절 (지원/영재) | L1271 | L228 |
| 소크라테스식 발문 | L1313 | L133 |
| 생활기록부 작성 | L1398 | L93 |
| AI 윤리 수업 지도안 | L2384 | L260 |

**Recommendation:** Treat `ToolRegistry.ts` as the canonical home for tool systemPrompts. Have tutorial lessons that need the same prompt either (a) import it via `relatedToolId` lookup, or (b) inline a comment pointing to the registry as source-of-truth and prepend a CI-style assertion that they match. Today, a teacher fixing a tool prompt in the registry leaves the lesson version stale — same surface, different behavior.

**Leverage:** High. This is the kind of inconsistency that causes "I fixed that bug, why is it still there?" tickets.

### 2. `LessonViewer` (`Tutorial.tsx:506-1961`) is no longer purely embedded content

CLAUDE.md justifies Tutorial.tsx's size as "embedded lesson content." That used to be true, but `LessonViewer` now contains:

- **18 useState/useRef** declarations (L510-538), mixing dictionary state, image retry state, L11 tour state, M4 popup state, manual completion state, etc.
- A `handleRun` function (L773-896) that branches on `lesson.id === 'l1-4'`, `lesson.id === 'l1-5'`, `lesson.id === 'l2-6'` with embedded business logic.
- A `handleDictSearch` function (L695-736) with its own systemPrompt, Gemini call, request-id race tracking.
- An L11 onboarding tour state machine (L898-933, plus tour positioning effect L569-617) — bespoke logic that has nothing to do with rendering a lesson.
- A 10-deep nested ternary computing flex sizing (L1400-1416) keyed on lesson IDs `l5-1`/`l5-3`/`l5-4`/`isL55`/`hasBalancedInputResponse`/`hasCompactM5InputPanel`/`usesL26PanelHeight`/etc.
- An inline parchment modal `Module0WelcomePopup` (L133-243, ~110 lines of styled JSX) AND a second inline welcome popup at L942-1073 (~130 lines, different styling but same purpose).

**Concrete extractions that wouldn't lose the "embedded content" rationale:**

- Move `handleDictSearch` + DICT_SYSTEM_PROMPT into `src/utils/learningDictionary.ts` (which already exists for the static dictionary). A `useLearningDictionary()` hook returns `{ word, setWord, result, isLoading, search }`. Saves ~50 lines and a `useRef`.
- Move the L11 tour into `src/components/onboarding/L11Tour.tsx`. It's six-step state + positioning logic. ~80 lines off LessonViewer.
- Extract a `useTypingAnimation()` hook from the `startTyping` closure inside `handleRun` (L791-811) — the cancel-on-stale-run logic plus interval ref. Reusable; today it lives anonymous inside the same function as the Gemini call.
- Collapse the two welcome popups into one parameterized `<EditionalModal>` component. The L133-243 and L942-1073 popups share parchment styling, decoration patterns, animation, and click-to-close behavior, but differ in copy/dimensions.

**Leverage:** High. Each of these is independently extractable, each gives back ~50-130 lines, and each one isolates a chunk of state that's polluting the main component.

### 3. `useFavorites` is implemented twice

- `src/views/Resources.tsx:130-141` — `function useFavorites()` for resources
- `src/views/QuickTools.tsx:277-288` — `function useToolFavorites()` for tools

Structurally identical; only difference is which `getX` / `saveX` from `services/storage` they call. Replace with a single `useFavoritesList(key: 'resource' | 'tool')` in `src/hooks/`.

**Leverage:** Medium. Small per-instance win but it sets a precedent — there's no current home for "simple persisted list" hooks, and the storage layer already does the I/O.

---

## Other genuine duplication

### `CopyButton` duplicated in Module4Components and Module5Components

- `Module4Components.tsx:5-22` — `CopyButton` with `top-2 right-2` positioning and 10px font
- `Module5Components.tsx:9-26` — `CopyButton` with no positioning and 12px font

Identical logic (`navigator.clipboard.writeText` → `setCopied(true)` → 1500ms reset). Promote to `src/components/CopyButton.tsx` with a `variant` or `className` prop.

### Clipboard + docs.new pattern repeated 4 places

- `Module5Components.tsx:28-46` — `GoogleDocsButton`
- `ToolPage.tsx:312-320` — `handleExportDocs`
- `Tutorial.tsx:1820` and `Tutorial.tsx:1831` — inline `await navigator.clipboard.writeText(...)` then `window.open('https://docs.new')`

Same pattern (write to clipboard → open docs.new → fallback alert on permission failure). Should be a single `<CopyToDocsButton>` or `copyToDocs(text)` util.

### `doorPalette` colour data exists in two views

- `Resources.tsx:51-59` (`CATEGORY_DOOR_PALETTE`)
- `QuickTools.tsx:40-91` (`doorPalette` per `CategoryMeta`)

These don't share keys (one is resource-category-keyed, the other tool-category-keyed) so they aren't true duplicates of *data* — but the **type** `{ base; shade; accent }` is invented twice. Extract a shared type and possibly co-locate the palette dictionaries in `src/utils/categoryThemes.ts` paralleling `moduleThemes.ts`.

### Tutorial.tsx reinvents `useExternalStorageState`

`Tutorial.tsx:1980-1991` manually wires `addEventListener('storage', ...)` and `addEventListener('ai-bridge-persona-changed', ...)` to mirror persona/purpose state. The project already has `useExternalStorageState(read, eventName)` (`src/hooks/useExternalStorageState.ts`) — used correctly by `Sidebar.tsx:34-35`, `ToolPage.tsx:93`, `Module5Components.tsx:69`, `Tutorial.tsx:517` (the very same file!). Just replace the manual wiring.

---

## Coupling — generally good

- **localStorage is properly encapsulated.** `Grep "localStorage"` finds only `services/storage.ts` and `hooks/useExternalStorageState.ts`. No view bypasses the storage layer. This is genuinely well done.
- **Gemini calls are centralized.** `callGemini`/`streamGemini` (`src/utils/gemini.ts`) handle model fallback and API-key propagation retry. Three callers (`Tutorial.tsx`, `ToolPage.tsx`, `Module5Components.tsx`) all use these wrappers; no direct `new GoogleGenAI(...)` in views.
- **Color theming.** `MODULE_THEMES` is centralized. Module-color leakage is minimal.

The notable coupling smell: **state is heavily prop-drilled from `App.tsx` through `Tutorial.tsx` into `LessonViewer`.** CLAUDE.md acknowledges this as deliberate ("State is prop-drilled. No Context API is used."). It's defensible at this scale, but `LessonViewer` receives 9 props and then needs `loadPersona()`, `loadPurposeValue()`, `getMetaPromptL26()`, `hasGeminiApiKey()`, `getGeminiApiKey()`, `hasSeenL11Tour()` etc. via storage. The split between "via props" vs "via storage call" is inconsistent.

---

## Type system — drift

CLAUDE.md says: *"All shared interfaces are in `src/types.ts`: ViewType, Resource, Module, Lesson, ToolDefinition, ToolInput."*

Reality:

| Type | Where it actually lives | Status |
| --- | --- | --- |
| `ViewType` | `src/types.ts` | OK |
| `Persona`, `DiagnosticPurpose`, `ModuleVisibility`, `DiagnosticAnswers` | `src/types.ts` | OK (but not listed in CLAUDE.md) |
| `Module` | `src/types.ts` | OK |
| `Resource` | `src/types.ts:16-25` | **DEAD** — imported only by `tutorialData.ts:1` and never referenced. The resources system actually uses `ResourceItem`/`ResourceSubCategory`/`ResourceCategory` from `src/data/resourcesData.ts`. |
| `Lesson` | `src/data/tutorialData.ts:3-27` | Real location — types.ts no longer owns it. Imported across `Tutorial.tsx`, `Module4Components.tsx`, `Module5Components.tsx`. |
| `ToolDefinition`, `ToolInput` | `src/tools/ToolRegistry.ts:3-44` | Real location. |

Two cheap wins:

1. Delete the orphan `Resource` interface and the unused `import { Resource }` in `tutorialData.ts:1`.
2. Either move `Lesson`/`ToolDefinition`/`ToolInput` to `types.ts`, or update CLAUDE.md to reflect that types are co-located with the data files that define them. Current CLAUDE.md statement is just wrong.

Also: `Module4Components.tsx:3` and `Module5Components.tsx:3` import `Lesson` from tutorialData but **never use it** — pure dead imports.

---

## Misnamed files / discoverability

`src/hooks/useDiagnostic.ts` — contains only pure functions (`calculateDiagnosticResult`, `loadPersona`, `saveDiagnostic`, `skipDiagnostic`). No hooks. Should be `src/services/diagnostic.ts`. Three callers depend on the current name (`Sidebar.tsx`, `Tutorial.tsx`, `onboarding/DiagnosticModal.tsx`), so it's a one-rename refactor.

---

## Honest verdict on the "intentionally large files"

| File | Lines | Verdict |
| --- | --- | --- |
| `src/tools/ToolRegistry.ts` | 2,341 | **Fine.** It's almost entirely systemPrompt strings + ToolDefinition objects. Splitting would lose the "one file, all tools" discoverability. |
| `src/data/tutorialData.ts` | 2,586 | **Fine.** Same justification — lesson content + markdown. |
| `src/views/Module4Components.tsx` | 1,416 | **Marginal.** 8 lesson components, each ~100-300 lines of mostly interactive UI. Could split into `Module4/Lesson41.tsx` … `Module4/Lesson48.tsx` but the gain is small and the cross-lesson `CopyButton` (and any future shared bit) would just float to a `_shared.tsx`. Leave it, but extract `CopyButton` first (see above). |
| `src/views/Module5Components.tsx` | 1,337 | **Marginal,** same as M4. The simulation-answer/fallback data (L53-61) plus `GoogleDocsButton` could move to `src/data/curriculumSimulation.ts` and `src/components/`. |
| `src/views/Tutorial.tsx` | 2,453 | **Problematic.** Of those, ~1,455 lines are inside `LessonViewer` (L506-1961), and that's no longer pure-render JSX. It has eaten state, prompts, business logic, an onboarding tour, two welcome modals, dictionary search, etc. See item #2 above. |

---

## Stale / dead code candidates

| Item | Location | Action |
| --- | --- | --- |
| Unused `Resource` type | `src/types.ts:16-25` | Delete + remove unused import in `tutorialData.ts:1` |
| Unused `Lesson` import | `Module4Components.tsx:3`, `Module5Components.tsx:3` | Remove |
| `module4PrinciplesShown` module-level mutable flag | `Tutorial.tsx:97` | Lives at module scope, mutated as a side effect in `handleCloseOverlay` (L671-674) and read inside an effect. Works, but smells. Move to component state or sessionStorage. |
| `loadPersona` is a one-line wrapper around `loadPersonaValue` | `hooks/useDiagnostic.ts:41-43` | Inline-call `loadPersonaValue()` and delete |
| CLAUDE.md line-count claims | CLAUDE.md (project docs) | Update to reality |

No TODO/FIXME markers of substance — the only `XXX` is in test-phone-number copy (`Module5Components.tsx:1170`).

---

## CSS — quick observations

`src/index.css` is 1,317 lines with 146 selectors. Skimmed — most are scoped to the moholy/brand-scroll Home page motifs (used in `Home.tsx`, 22 references to `brand-scroll-*`). Doesn't look like dead CSS. The L11 tour highlight class (`.l1-tour-highlight`) and a11y rules are also live. No obvious bloat or extraction need at this size.

---

## Severity-tagged summary

**High leverage:**

1. Reconcile/dedupe systemPrompts between `tutorialData.ts` and `ToolRegistry.ts`.
2. Extract dictionary search, L11 tour, typing-animation, and welcome modal out of `LessonViewer`.
3. Delete dead `Resource` type + unused `Lesson` imports + update CLAUDE.md line counts.

**Medium:**

4. Consolidate `useFavorites` / `useToolFavorites` into one hook.
5. Replace Tutorial.tsx's manual storage-event wiring (L1980-1991) with `useExternalStorageState`.
6. Promote `CopyButton` and "copy-to-docs.new" into shared components.
7. Rename `hooks/useDiagnostic.ts` → `services/diagnostic.ts` (it has no hooks).

**Low:**

8. Collapse the 10-deep flex-sizing ternary in `LessonViewer` (Tutorial.tsx:1400-1416) into a lookup table keyed by `lesson.id`.
9. Move M5 simulation-answer data out of `Module5Components.tsx`.
10. Remove `loadPersona` indirection in `useDiagnostic.ts`.

---

## Note for next session

CLAUDE.md needs to be updated regardless of refactoring decisions — its line-count claims and "all shared types in types.ts" claim are both inaccurate and may be steering both humans and future Claude sessions away from useful cleanup.
