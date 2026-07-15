# Mission TTS Toggle Fix Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Subagent execution is intentionally not used in this session because the active project instruction forbids spawning sub-agents unless explicitly requested by the user.

**Goal:** Mission screens must respect the global TTS toggle for automatic narration while preserving explicit "read aloud" buttons.

**Architecture:** `useSpeak()` exposes two paths: `speak()` respects `ttsEnabled`, and `speakNow()` bypasses the toggle for explicit user requests. `MissionStep` currently uses `speakNow()` for both automatic narration and manual narration. The fix is to route automatic mission intro, chapter goal, and reward narration through `speak()`, leaving manual buttons on `speakNow()`.

**Tech Stack:** React 19, TypeScript, Vite, Web Speech API wrapper, Playwright CLI manual regression.

## Global Constraints

- Keep the fix surgical in `src/components/mission/MissionStep.tsx`.
- Do not change `useSpeak.ts`; its two-function contract is correct.
- Preserve manual "장 목표 읽어주기" behavior even when TTS is globally off.
- Do not touch unrelated dirty worktree files.
- Verify with a real browser because the bug depends on localStorage settings and speech synthesis side effects.

---

## Task 1: RED Regression Check

**Files:** none

**Steps:**

- Start or reuse the Vite dev server at `http://localhost:3000`.
- Use Playwright CLI session `ttsbug` with a `speechSynthesis.speak` stub that records calls in `window.__speechCalls`.
- Set `ai-students-settings` to `{"ttsEnabled":false,"fontSize":"normal","difficulty":"normal"}`.
- Set mission state so a mission starts with a saved student name.
- Navigate to a lesson mission and enter the final activity.
- Assert `window.__speechCalls.length === 0`.
- Confirm this assertion fails before implementation.

**Expected RED:** The assertion fails because automatic intro/chapter narration calls `speakNow()` while TTS is off.

---

## Task 2: Route Automatic Mission Narration Through `speak()`

**Files:** `src/components/mission/MissionStep.tsx`

**Steps:**

- Change `const { speakNow } = useSpeak();` to `const { speak, speakNow } = useSpeak();`.
- Replace automatic intro narration:

```ts
speakNow(mission.intro);
```

with:

```ts
speak(mission.intro);
```

- Replace automatic chapter goal narration:

```ts
speakNow(ch.goal);
```

with:

```ts
speak(ch.goal);
```

- Replace automatic reward narration:

```ts
speakNow(mission.reward.badgeLabel);
```

with:

```ts
speak(mission.reward.badgeLabel);
```

- Keep the manual goal read button as:

```ts
onClick={() => speakNow(activeChapter.goal!)}
```

**Expected Result:** Automatic narration obeys global TTS settings; explicit button clicks still speak immediately.

---

## Task 3: GREEN Browser Regression

**Files:** none

**Steps:**

- Reload the Playwright session with TTS off and the same speech stub.
- Navigate to the mission final activity again.
- Assert `window.__speechCalls.length === 0`.
- Click the manual "장 목표 읽어주기" button.
- Assert `window.__speechCalls.length === 1`.
- Set TTS on in localStorage, reload, navigate to the mission final activity, and assert automatic narration records at least one call.

**Expected GREEN:** Off blocks automatic narration, manual button still works, on allows automatic narration.

---

## Task 4: Project Verification

**Files:** none

**Steps:**

- Run `npm run build`.
- Run `npm run check:encoding`.
- Run `npm run check:ui-polish`.
- Run `npm run check:activity-icons`.
- Run `git diff --check`.
- Review `git diff` and `git status --short`.

**Expected Result:** All checks pass, and only the plan plus `MissionStep.tsx` are changed.

---

## Task 5: Commit

**Files:** plan and source change

**Steps:**

- Stage only:
  - `docs/superpowers/plans/2026-07-15-mission-tts-toggle-fix.md`
  - `src/components/mission/MissionStep.tsx`
- Commit with:

```bash
git commit -m "fix: respect TTS toggle in missions"
```

**Expected Result:** The bug fix is committed without staging unrelated user files.
