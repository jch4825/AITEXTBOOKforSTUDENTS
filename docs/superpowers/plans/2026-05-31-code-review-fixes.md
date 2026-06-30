# 2026-05-31 Code Review Fixes — Tier 1 + Tier 4

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Source reviews (read first if you need full context):**
- `docs/code-review/2026-05-31-correctness.md` — bug/logic audit (6 Important, 10 Minor)
- `docs/code-review/2026-05-31-maintainability.md` — structure audit (showing strain)

**Scope of this plan:**
The user picked **Tier 1 (2 user-visible bugs) + Tier 4 (7 easy cleanups)** from the consolidated priority list. Tier 2 (UX paper cuts), Tier 3 (LessonViewer extraction + systemPrompt drift), and Tier 5 (defensive nits) are deferred — do NOT touch them here.

**Goal:** Land two visible bug fixes and seven low-risk cleanups, organized so each commit is independently shippable.

**Approach:** Four commits, smallest-blast-radius first. Each task ends with `npm run lint` (which runs `tsc --noEmit`). After Tier 1 fixes, also `npm run dev` and spot-check the affected flow before committing.

**Out of scope (per user's choice — do NOT do these in this plan):**
- LessonViewer extraction (Tier 3 #7)
- systemPrompt drift reconciliation (Tier 3 #6) — needs design discussion first
- ToolPage stream cancellation (Tier 2)
- `?lesson=` URL clearing (Tier 2)
- curriculumLookup retry logic (Tier 2)
- API key textarea masking (Tier 5)

---

## Commit 1 — Fix global wheel hijack blocking modal scroll

**Issue:** I-1 from correctness review. `Home.tsx:243-275` attaches a `wheel` listener to `window` that calls `preventDefault()` on any wheel delta ≥18. Because the listener is on `window`, it intercepts wheel events originating inside `DiagnosticModal` (which is rendered over Home for first-time visitors). Result: a single firm trackpad/wheel push inside the modal cannot scroll the modal's overflow — the document snaps to the next section behind the modal.

### Task 1: Scope the wheel handler so it ignores events inside modals

**Files:**
- Modify: `src/views/Home.tsx`

- [ ] **Step 1: Read the current handler**

Read `src/views/Home.tsx:230-290` to understand the snap-scroll logic. The handler currently does `event.preventDefault()` unconditionally when `Math.abs(event.deltaY) >= 18`.

- [ ] **Step 2: Skip handling when wheel event originated in a fixed/modal overlay**

Replace the handler so it returns early when the event target is inside any `[role="dialog"]` ancestor (DiagnosticModal already has this), OR inside any element whose nearest scrollable ancestor is not `document.documentElement`. Simplest correct version: walk up from `event.target`, and if any ancestor up to `document.documentElement` has its own `overflow: auto`/`scroll`/`hidden` AND has `scrollHeight > clientHeight`, return without preventing.

Sketch:
```ts
const target = event.target as Element | null;
let node: Element | null = target;
while (node && node !== document.documentElement) {
  if (node.closest('[role="dialog"]')) return;
  const style = window.getComputedStyle(node);
  const overflowY = style.overflowY;
  if ((overflowY === 'auto' || overflowY === 'scroll') && node.scrollHeight > node.clientHeight) {
    return; // Let the inner element scroll naturally
  }
  node = node.parentElement;
}
// ...existing snap logic unchanged
```

- [ ] **Step 3: Verify**

```bash
npm run lint
npm run dev
```

Open `http://localhost:3000/AI_Bridge/`, ensure DiagnosticModal appears on first load (or clear localStorage). Spin the wheel inside the modal — modal content should scroll, page beneath should not snap.

- [ ] **Step 4: Commit**

```
Stop Home wheel-snap from hijacking scroll inside modals

The window-level wheel listener was preventDefault-ing every event
with |deltaY|>=18, even when the event originated inside the
DiagnosticModal that overlays Home for first-time visitors. Scope
the handler to ignore events whose target lives inside a dialog or
an inner scrollable ancestor.
```

---

## Commit 2 — Stop overwriting user font scale on every Module 0 lesson entry

**Issue:** I-2 from correctness review. `Tutorial.tsx:1993-1999` runs `applyFontScale('large')` every time the current lesson's `moduleId === 'm0'`, regardless of persona, regardless of what the user has manually picked via the AccessibilityWidget. A lead/expert user who sizes down to 'normal' and then opens any Module 0 lesson silently has their preference overwritten.

### Task 2: Only force 'large' on first ever m0 entry

**Files:**
- Modify: `src/views/Tutorial.tsx`
- Possibly add: a single-flag helper in `src/services/storage.ts` (e.g. `hasAppliedM0FontScale()` / `markM0FontScaleApplied()`)

- [ ] **Step 1: Read the current effect**

Read `src/views/Tutorial.tsx:1985-2005` to see the existing effect and its dependency. Read `src/services/storage.ts` to confirm the existing pattern for boolean flags (e.g. `hasSeenL11Tour`, `markL11TourSeen`).

- [ ] **Step 2: Add a one-shot guard**

Two options — pick whichever fits the existing pattern best:

**Option A (recommended):** add `hasAppliedM0FontScale()` / `markM0FontScaleApplied()` to `src/services/storage.ts` mirroring the `L11Tour` flag, and gate the effect on `!hasAppliedM0FontScale()`.

**Option B:** drop the effect entirely. The persona-default at diagnostic save (`storage.ts:225-229`) already gives novices 'large'; lead/expert users have already chosen otherwise. m0 doesn't need a re-application.

Pick A if there's evidence the team wants m0 to set a default for users who skipped diagnostics; pick B if not. Lean B unless you find a reason.

- [ ] **Step 3: Verify**

```bash
npm run lint
npm run dev
```

Open in browser, set font scale to "보통" via the AccessibilityWidget, then click into any Module 0 lesson. The widget should still show "보통" and the font should not enlarge.

- [ ] **Step 4: Commit**

```
Stop forcing 'large' font scale on every Module 0 lesson entry

The m0 effect previously re-applied applyFontScale('large') on every
lesson change, silently overwriting users who had chosen a smaller
size via the AccessibilityWidget. Gate it behind a one-shot flag
(or drop entirely — see PR discussion).
```

---

## Commit 3 — Dead code removal + Tutorial storage-event cleanup + CLAUDE.md correction

**Issues:** Tier 4 items #8, #9, #10, #14 from the consolidated priority list. Pure cleanup, very low risk, all in one commit because they're small and all "remove or fix doc lie."

### Task 3: Delete dead `Resource` type and unused imports

**Files:**
- Modify: `src/types.ts` — delete the orphan `Resource` interface (lines ~16-25)
- Modify: `src/data/tutorialData.ts` — remove the unused `import { Resource }` on line 1
- Modify: `src/views/Module4Components.tsx` — remove the unused `import { Lesson } from '../data/tutorialData'` on line 3
- Modify: `src/views/Module5Components.tsx` — remove the unused `import { Lesson } from '../data/tutorialData'` on line 3

- [ ] **Step 1: Verify the imports are truly unused**

```bash
grep -n "Resource" src/types.ts src/data/tutorialData.ts
grep -n "\bResource\b" src/data/tutorialData.ts  # except in 'ResourceItem' etc — should be zero matches
grep -n "\bLesson\b" src/views/Module4Components.tsx src/views/Module5Components.tsx
```

Confirm no usages.

- [ ] **Step 2: Make the deletions**

Edit each file. Be careful that `Resource` and `Lesson` aren't substrings of something used (e.g. `ResourceItem`, `LessonViewer`).

### Task 4: Replace Tutorial.tsx manual storage event wiring with the project's own hook

**Files:**
- Modify: `src/views/Tutorial.tsx`

The same file already uses `useExternalStorageState` at L517, but L1980-1991 hand-wires `addEventListener('storage', ...)` and `addEventListener('ai-bridge-persona-changed', ...)` to mirror persona/purpose state.

- [ ] **Step 1: Read both call sites**

Read `src/views/Tutorial.tsx:515-525` (working `useExternalStorageState` usage) and `src/views/Tutorial.tsx:1975-2000` (manual wiring). Also read `src/hooks/useExternalStorageState.ts` to confirm the hook signature.

- [ ] **Step 2: Replace the manual wiring**

Convert the manual addEventListener block into two `useExternalStorageState` calls mirroring the L517 pattern. Drop the manual `useEffect`.

### Task 5: Update CLAUDE.md line-count claims and type-location claim

**Files:**
- Modify: `CLAUDE.md`

CLAUDE.md says `Tutorial.tsx` is "~67k lines" and `ToolRegistry.ts` "~29k lines" — actual: 2,453 and 2,341. It also says "All shared interfaces are in `src/types.ts`: ViewType, Resource, Module, Lesson, ToolDefinition, ToolInput" — actual: `Lesson` lives in `tutorialData.ts`, `ToolDefinition`/`ToolInput` live in `ToolRegistry.ts`.

- [ ] **Step 1: Edit the two false claims**

Find the section listing file sizes and the section listing type locations. Replace with current truth. Don't editorialize about the magnitude of the error — just fix the facts. Keep the "don't refactor without understanding" guidance if you preserve it, but it should not lean on the inflated numbers.

- [ ] **Step 2: Verify**

```bash
npm run lint
npm run check:encoding
```

- [ ] **Step 3: Commit**

```
Remove dead types/imports, replace manual storage wiring, fix CLAUDE.md

- Delete unused Resource type and its import; resources use
  ResourceItem from resourcesData.ts
- Drop unused Lesson imports from Module4/5Components
- Tutorial.tsx now uses the project's existing useExternalStorageState
  for persona/purpose mirroring, matching the same file's L517
- Correct CLAUDE.md line-count claims (Tutorial.tsx: 67k→2,453,
  ToolRegistry.ts: 29k→2,341) and the inaccurate "all shared types in
  types.ts" statement (Lesson lives in tutorialData.ts, ToolDefinition
  in ToolRegistry.ts).
```

---

## Commit 4 — Extract shared hooks/components, rename misnamed file

**Issues:** Tier 4 items #11, #12, #13 from the consolidated priority list. Three small refactors, all "DRY without adding speculation."

### Task 6: Consolidate `useFavorites` and `useToolFavorites` into one hook

**Files:**
- Create: `src/hooks/useFavoritesList.ts`
- Modify: `src/views/Resources.tsx` (remove local `useFavorites`, import from new hook)
- Modify: `src/views/QuickTools.tsx` (remove local `useToolFavorites`, import from new hook)

- [ ] **Step 1: Read both implementations**

Read `src/views/Resources.tsx:130-141` and `src/views/QuickTools.tsx:277-288`. Confirm they're structurally identical apart from which `services/storage` reader/writer they call.

- [ ] **Step 2: Create the generic hook**

```ts
// src/hooks/useFavoritesList.ts
import { useEffect, useState } from 'react';
import {
  getResourceFavorites, saveResourceFavorites,
  getToolFavorites, saveToolFavorites,
} from '../services/storage';

const READERS = { resource: getResourceFavorites, tool: getToolFavorites } as const;
const WRITERS = { resource: saveResourceFavorites, tool: saveToolFavorites } as const;

export function useFavoritesList(kind: 'resource' | 'tool') {
  const [favorites, setFavorites] = useState<string[]>(() => READERS[kind]());
  useEffect(() => { WRITERS[kind](favorites); }, [kind, favorites]);
  const toggle = (id: string) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return { favorites, toggle } as const;
}
```

Match the **exact** return shape of the existing local hooks so the call sites don't need other changes.

- [ ] **Step 3: Swap call sites and delete local hooks**

### Task 7: Extract shared `CopyButton`

**Files:**
- Create: `src/components/CopyButton.tsx`
- Modify: `src/views/Module4Components.tsx` (remove local `CopyButton`, import shared one)
- Modify: `src/views/Module5Components.tsx` (remove local `CopyButton`, import shared one)

- [ ] **Step 1: Read both implementations**

Module4's version has `top-2 right-2` positioning and 10px font; Module5's has no positioning and 12px font. Identical logic otherwise.

- [ ] **Step 2: Create shared component with overridable className**

```tsx
// src/components/CopyButton.tsx
import { useState } from 'react';

interface Props {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = '' }: Props) {
  const [copied, setCopied] = useState(false);
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };
  return (
    <button onClick={handleClick} className={className}>
      {copied ? '✓ 복사됨' : '복사'}
    </button>
  );
}
```

Match the existing labels/animation so Module4/5 don't visually change.

- [ ] **Step 3: Update both Module*Components files to import + pass the appropriate className**

Module4's call sites should pass `className="absolute top-2 right-2 text-[10px] ..."` (whatever the original classes were); Module5's pass its own classes.

### Task 8: Rename `hooks/useDiagnostic.ts` → `services/diagnostic.ts`

**Files:**
- Move: `src/hooks/useDiagnostic.ts` → `src/services/diagnostic.ts`
- Update imports in: `src/components/Sidebar.tsx`, `src/views/Tutorial.tsx`, `src/components/onboarding/DiagnosticModal.tsx` (any other callers — grep first)

- [ ] **Step 1: Confirm there are no hooks in the file**

```bash
grep -n "^export function use\|^export const use" src/hooks/useDiagnostic.ts
```

Should be empty (only pure functions like `calculateDiagnosticResult`, `saveDiagnostic`, etc.).

- [ ] **Step 2: Find all callers**

```bash
grep -rn "from.*hooks/useDiagnostic" src/
```

- [ ] **Step 3: Move the file and update imports**

```bash
git mv src/hooks/useDiagnostic.ts src/services/diagnostic.ts
```

Then update each import path in the callers from `'../hooks/useDiagnostic'` to `'../services/diagnostic'` (or correct relative path per file location).

While there, consider also inlining the one-liner `loadPersona` (Tier 4 item — `useDiagnostic.ts:41-43` is just a wrapper around `loadPersonaValue`). If the grep shows it's only called in 1-2 places, inline and delete.

- [ ] **Step 4: Verify**

```bash
npm run lint
npm run dev
```

Confirm diagnostic modal still opens via the sidebar "학습 경로 다시 추천" button and that the persona pill still updates after saving.

- [ ] **Step 5: Commit**

```
Extract shared favorites hook + CopyButton, move diagnostic to services

- New useFavoritesList(kind) hook collapses Resources/QuickTools
  per-view duplication
- Shared CopyButton replaces the same component declared in both
  Module4Components and Module5Components
- src/hooks/useDiagnostic.ts → src/services/diagnostic.ts; the file
  has no hooks, only pure functions. Update call sites.
```

---

## Final verification

After all four commits:

```bash
npm run lint
npm run check:encoding
npm run build      # confirm bundle sizes unchanged
```

Then push:

```bash
git push origin main
```

Spot-check the live deploy on the actual production URL after GitHub Pages finishes — especially the diagnostic modal flow (Commit 1), Module 0 entry with custom font scale (Commit 2), favoriting a resource and a tool (Commit 4).

---

## What this plan deliberately did NOT do

- **Tier 2 fixes** (?lesson= URL, ToolPage cancellation, curriculumLookup retry): each one is independently valuable but needs its own focused commit and a bit of behavior decision-making. Save for a follow-up plan.
- **Tier 3 systemPrompt drift**: needs a design decision (canonical source: `ToolRegistry` vs `tutorialData`? how to link?). Don't paper over.
- **LessonViewer extraction**: 4 sub-extractions (useLearningDictionary, L11Tour, useTypingAnimation, EditionalModal). Sizeable, deserves its own plan — write one when ready.
