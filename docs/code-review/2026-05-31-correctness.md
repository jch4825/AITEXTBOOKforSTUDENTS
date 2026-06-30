# Correctness Review — AI Bridge: Zero-Gap Toolkit

**Date:** 2026-05-31
**Reviewer:** Senior Code Reviewer (focus: bugs / logic / correctness — NOT maintainability)
**Scope:** `src/App.tsx`, all `src/hooks/**`, `src/services/**`, `src/utils/**`, `src/components/**`, all views (spot-checked), `src/tools/ToolRegistry.ts` (spot-checked).

---

## Summary

| Severity | Count |
|---|---|
| Critical (crash / data loss / secret leak) | 0 |
| Important (wrong behavior in real conditions) | 6 |
| Minor (edge cases, defensive coding, dead code) | 10 |

Overall the codebase is solid for an SPA with no test suite. Korean text encoding is correct everywhere. API key handling is reasonable (localStorage only, no logging, no URL leakage). LocalStorage access is well-centralized in `services/storage.ts` with try/catch on every operation. The Gemini call sites have a model-fallback ladder and a runId guard in the main lesson view.

The biggest real-world issues are (a) the global wheel-snap handler in `Home.tsx` that hijacks scrolling even inside other components rendered over Home (e.g., diagnostic modal), (b) automatic font-scale override every time the user enters a module 0 lesson, (c) a stream-without-cancellation in `ToolPage.tsx` that triggers post-unmount `setState` warnings and (theoretically) UI flicker, and (d) the URL `?lesson=` parameter never being cleared after navigation, so refresh on Home jumps unexpectedly back to Tutorial.

---

## Important findings (wrong behavior in real conditions)

### I-1. Global wheel-snap in `Home.tsx` blocks scrolling in modals over the home view
**File:** `src/views/Home.tsx:243-275`

`useEffect` attaches a non-passive `wheel` listener to `window` while Home is mounted. For any wheel event with `|deltaY| ≥ 18`, the handler calls `event.preventDefault()` and snap-scrolls the page. Because the listener is on `window`, it intercepts wheel events that originate inside *any* element rendered while Home is mounted — including the `DiagnosticModal` (App.tsx:203-228) which is rendered in the same root and can appear over Home for first-time visitors.

Result: when a user is on Home and the diagnostic modal is open (the most common path for new users), a single firm trackpad/wheel push inside the modal cannot scroll the modal's own overflow — the document snaps to the next section behind the modal instead.

Smaller wheel deltas (<18) still pass through, so the bug is intermittent rather than total, but anyone using a real mouse wheel will hit it.

Mitigation: scope the handler to a Home-specific container (capture wheel events whose target is inside `document.querySelector('.moholy-page')`), or only `preventDefault` when the event target's nearest scrollable ancestor is the document itself.

### I-2. Font scale silently reset to 'large' every time a Module 0 lesson is opened
**File:** `src/views/Tutorial.tsx:1993-1999`

```tsx
useEffect(() => {
  if (!currentLesson) return;
  if (currentLesson.moduleId === 'm0') {
    applyFontScale('large');
    dispatchFontScaleChanged('large');
  }
}, [currentLesson?.moduleId]);
```

If a user is a `novice` persona, font is auto-set to 'large' at diagnostic save (`storage.ts:225-229`) — fine. But this effect re-applies 'large' every time any m0 lesson becomes the current lesson, *regardless of persona*, *regardless of what the user has manually picked* via the AccessibilityWidget. Lead/expert users who size down to 'normal' and then open a Module 0 lesson to skim will silently have their preference overwritten.

Mitigation: only force 'large' on first entry to m0 (gate behind `hasSeenM0Welcome()` or a separate "m0 font applied" flag), or remove the override entirely and let the persona-default at diagnostic time handle it.

### I-3. `ToolPage.tsx` Gemini stream is not cancelled on unmount or re-run
**File:** `src/views/ToolPage.tsx:277-302`

`handleRun()` awaits `streamGemini(...)` and consumes the async iterator with `for await ... setResult(full)`. There is no cancellation:
- If the user clicks the back button mid-stream, ToolPage unmounts but the iterator keeps pulling chunks and calling `setResult` on an unmounted component → React warning and wasted bandwidth.
- The "생성하기" button is disabled while `isRunning`, so a true race against itself can't happen — but switching tools (back → choose a different tool) re-mounts ToolPage and the prior stream keeps running until it naturally ends.

Compare with `Tutorial.tsx:738-771` which uses `runIdRef`+`dictRequestIdRef` guards. ToolPage should adopt the same pattern (a runId ref checked in the for-await loop and in the catch/finally), or use `AbortController` via the @google/genai signal option.

### I-4. URL `?lesson=` parameter is never cleared, causing surprising re-routing on refresh
**File:** `src/App.tsx:51-54`, `src/views/Tutorial.tsx:2002-2020`

On mount, App reads `?lesson=...` and sets `currentView='tutorial'`. Tutorial then deep-links to that lesson. After this, no code anywhere clears the URL — not on `handleViewChange`, not on `onBack`. So:

1. User clicks a link to `?lesson=l1-4`.
2. User navigates away to Home via sidebar.
3. User refreshes (or copies the URL and shares it).
4. They land back on Tutorial → l1-4, not Home.

This is especially confusing because `QuickTools.tsx:242` mutates `window.location.search` to deep-link from a tool card — so users do end up with `?lesson=...` URLs without realizing.

Mitigation: in `handleViewChange` (or anywhere `setCurrentView` is called with a non-'tutorial' view) call `history.replaceState(null, '', window.location.pathname)`.

### I-5. `initCurriculum()` rejection is swallowed and cached forever
**File:** `src/utils/curriculumLookup.ts:30-41`, `src/views/ToolPage.tsx:88-91`, `src/views/Module5Components.tsx:74-76`

```ts
loadPromise = import('../data/curriculumStandards.json').then(mod => { ... });
return loadPromise;
```

There is no `.catch` and no reset of `loadPromise` on failure. If the dynamic import fails (CDN hiccup, offline, corrupt cache), every subsequent `initCurriculum()` returns the same rejected promise. `ToolPage.tsx:90` chains `.then(() => setCurriculumReady(true))` with no `.catch` → unhandled rejection. The curriculum preview UI silently never renders, even though the user can retry the page indefinitely.

Mitigation: in `initCurriculum`, add `.catch(err => { loadPromise = null; throw err; })` so the next call retries, and add `.catch` in the call sites.

### I-6. `aiResponse` completion effect re-fires on every parent render due to unstable `onMarkComplete`
**File:** `src/views/Tutorial.tsx:555-567`, `src/App.tsx:89-96`

```tsx
useEffect(() => {
  const hasCompletionSignal = (!!aiResponse && !isTyping && aiResponseLessonRef.current === lesson.id) || manualCompleteRequested;
  if (!isCompleted && hasCompletionSignal) {
    onMarkComplete(lesson.id);
  }
}, [aiResponse, isCompleted, isTyping, lesson.id, manualCompleteRequested, onMarkComplete]);
```

`onMarkComplete` (`markComplete` in App.tsx:89) is recreated on every App render because it isn't wrapped in `useCallback`. Result: this effect runs on every parent render. The inner `onMarkComplete` is itself idempotent (`if (prev.includes(lessonId)) return prev`), so this is not a correctness bug today — but it makes the effect's deps misleading and is a footgun if anyone later adds a non-idempotent side effect to `markComplete`. Same pattern applies to `onToggleComplete`. Borderline minor, listed here because it touches a hot path that fires on every keystroke in the textarea.

---

## Minor findings

### M-1. Module-level `module4PrinciplesShown` is mutated, not stateful
**File:** `src/views/Tutorial.tsx:97, 672`

A module-scope `let` is flipped to `true` in `handleCloseOverlay`. The principles overlay then never reappears for the rest of the session, even on full lesson re-entry. Intentional, but not React-y — a state value or session-storage flag would survive an HMR cycle better. Not a bug.

### M-2. `setUserInput` of API key in l1-4 leaves the key in plaintext React state and a non-password textarea
**File:** `src/views/Tutorial.tsx:1505-1532` (rendered as `<textarea>` with no masking), `src/views/Tutorial.tsx:820-822` (saved)

The lesson 1-4 input is a regular `<textarea>` (not `type="password"` like the Sidebar's input). So while a user types or pastes their API key, anyone over their shoulder can read it. Once they navigate away and back, the textarea is reset by the lesson-change useEffect, so it doesn't *persist* on screen — but it is visible during the session. The Sidebar's modal correctly uses `type="password"`. Not a strict bug because the lesson is intentionally a guided tutorial, but worth flagging given the surrounding security warnings the lesson itself displays.

### M-3. `useFavorites` hook writes localStorage on initial mount
**File:** `src/hooks` pattern duplicated in `src/views/QuickTools.tsx:277-289` and `src/views/Resources.tsx:130-142`

```tsx
const [favorites, setFavorites] = useState<string[]>(() => getToolFavorites());
useEffect(() => { saveToolFavorites(favorites); }, [favorites]);
```

On mount, the effect runs and re-writes the same value that was just read. Harmless today. But if the storage validator (`getJson` in `storage.ts:52-61`) were ever changed to migrate the shape (e.g., dedupe or filter invalid IDs), the migration would silently be persisted on every page load with no version bump.

### M-4. `SpeakButton` cleanup effect stops speech on every state toggle, not only on unmount
**File:** `src/components/SpeakButton.tsx:30-34`

```tsx
useEffect(() => {
  return () => { if (playing) stopSpeaking(); };
}, [playing]);
```

The cleanup runs whenever `playing` changes (cleanup of previous render, then new effect setup). When the user toggles from playing → not-playing, the cleanup fires with the *old* `playing=true` and calls `stopSpeaking()` — but `handleClick` already called `stopSpeaking()` immediately before `setPlaying(false)`. So it's a redundant call (idempotent), not a bug. The intent ("stop only on unmount") would be expressed by `useEffect(() => () => stopSpeaking(), [])` with a ref for the playing state.

### M-5. `DiagnosticModal.handleSkip` referenced from `useEffect` with empty deps creates a stale closure
**File:** `src/components/onboarding/DiagnosticModal.tsx:34-40`

The keydown handler captures the `handleSkip` defined at the mounting render. Since `handleSkip` only calls `skipDiagnostic()` + `onClose()` and `onClose` is read from props at the same render, it works — but if `onClose` ever changed identity *and* the parent expected the latest closure to run on Escape, this would silently use the old one. Defensive fix: include `onClose` in deps, or refactor `handleSkip` outside the component.

### M-6. `KNOWN_LEARNING_DICTIONARY_ALIASES` has an alias key `vibeCoding` that is unreachable
**File:** `src/utils/learningDictionary.ts:22-27`

`normalizeDictionaryTerm` lowercases input before the alias map is consulted (line 32-35), so the `vibeCoding` key (camelCase) can never match. The lowercase `vibecoding` key in the same map handles it. Dead key. Not a bug, just leftover.

### M-7. `Lesson` is imported but unused in two files
**File:** `src/views/Module4Components.tsx:3`, `src/views/Module5Components.tsx:3`

`import { Lesson } from '../data/tutorialData';` in both — never referenced in either file. TypeScript wouldn't flag without `noUnusedLocals`, which doesn't appear enabled here. Dead import.

### M-8. `Sidebar` variable shadowing of prop `isCollapsed`
**File:** `src/components/Sidebar.tsx:26, 137`

Line 26 destructures `isCollapsed` as a prop. Line 137 inside the `modules.map` declares `const isCollapsed = visibility === 'collapsed';`, shadowing the prop within the closure. The outer `isCollapsed` is not needed in the inner scope, so behavior is correct — but a renamed inner var (`isCollapsedView` or similar) would prevent future confusion.

### M-9. `dispatchFontScaleChanged(null)` constructs a `StorageEvent` with `newValue: null` typed as `string | null` — actually passes `null`
**File:** `src/services/storage.ts:75-80`

```ts
window.dispatchEvent(new StorageEvent('storage', {
  key: STORAGE_KEYS.diagnostic.fontScale,
  newValue: scale,   // FontScale | null
}));
```

`StorageEventInit.newValue` is typed `string | null`. When `scale` is `'normal' | 'large' | 'xlarge' | null`, this satisfies the type. The widget's handler distinguishes the null case correctly. Not a bug — just calling out that the same-tab fake storage event pattern relies on listeners checking `e.newValue` as a string. No issue today.

### M-10. `dispatchFontScaleChanged('large')` from Tutorial cascades: write → event → widget reads → re-applies via `applyFontScale` → another write
**File:** `src/views/Tutorial.tsx:1995-1998` → `src/components/AccessibilityWidget.tsx:60-75, 56-62`

Per M-2 in the I list: the m0 override fires `applyFontScale('large')` (which writes to localStorage) and then `dispatchFontScaleChanged('large')`. The widget's storage handler sees `newValue='large'`, calls `setScale('large')`, the `scale` effect calls `applyFontScale('large')` again → another write. So each m0 lesson load = 2 writes to localStorage and 2 DOM `style.fontSize` mutations. Wasteful but not broken. Mostly a side note while fixing I-2.

---

## What I did NOT find (worth saying out loud)

- **No API key leakage.** Key is only ever passed to `GoogleGenAI` constructor and (in Tutorial l1-4) echoed back to the user as part of their own input. It is never logged, never appended to a URL, never sent to any non-Google endpoint. The bug-report POST in `bugReport.ts:29-44` sends only the structured payload + UA/viewport/URL — no localStorage access.
- **No JSON.parse without try/catch.** All localStorage reads go through `getJson` in `storage.ts:52-61` which catches parse errors and returns the fallback.
- **No SSR-unsafe access.** The app is Vite SPA only; `window`/`document` access at module top-level (e.g. `App.tsx:52`) is fine.
- **No XSS risk via markdown.** All `<ReactMarkdown>` uses default sanitization. Custom `a` component handles `#lesson:` internal links safely; external `a` uses `target="_blank" rel="noopener noreferrer"`.
- **No bad UTF-8.** All Korean source content reads cleanly. The escaped strings in `ToolPage.tsx:59, 69, 327-329, 384` are deliberately written as `\uXXXX` sequences (probably a workaround for a previous encoding pipeline) — they decode correctly at runtime and `npm run check:encoding` would not flag them. Cosmetic, not broken.
- **The runId guard in `Tutorial.tsx` is complete.** Both `handleRun` (line 778) and `handleDictSearch` (line 699) capture an id and check it before every `setState`. Lesson-change increments the same ref (line 740), so cross-lesson races are handled.

---

## Verdict

**Fix Important+ before next release** — none of the issues will crash the app or expose secrets, but I-1 (wheel hijack) and I-2 (font scale override) will be visibly wrong to real users on the most common entry paths (first-time visitor opening the diagnostic modal; any user who customized their font scale and then opens a Module 0 lesson). I-3 (no stream cancellation) will spam React warnings in dev but isn't user-visible. I-4 (sticky `?lesson=` URL) will frustrate users who share or refresh URLs. I-5/I-6 are paper cuts.

Minor items are safe to defer or batch into a cleanup PR.
