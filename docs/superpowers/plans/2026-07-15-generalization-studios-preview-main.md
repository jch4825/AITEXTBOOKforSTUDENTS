# Generalization Studios Preview-Main Implementation Plan
> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans. Subagent execution is intentionally not used in this session because the active project instruction forbids spawning sub-agents unless explicitly requested by the user.

**Goal:** Add one generalization studio to each of the six module wrap-up missions using a "preview -> main activity -> record" flow. The studios should address the critique that the textbook overuses fixed-answer roleplay and gives too little practice with ambiguous, non-routine situations.

**Architecture:** Reuse the existing mission engine and block types. Each module wrap-up mission receives two new chapters before the final certificate/vow chapter:

- `예고`: a short ambiguous everyday scene using `branch-chat`, with multiple acceptable choices rather than a single correct answer.
- `본 활동`: a student production or transfer task using `multi-pick` and/or `draw`.
- The existing `summary` chapter records the studio result so teachers can see attempts, not only right/wrong outcomes.

**Tech Stack:** TypeScript lesson data, existing React mission renderer, existing `summary`, `branch-chat`, `multi-pick`, `draw`, and `vow` blocks.

## Global Constraints

- Do not create new block renderers unless the existing mission engine cannot support the pedagogy.
- Keep language accessible to 발달장애 학생 while avoiding childish tone.
- Avoid one-right-answer framing in the new studio chapters.
- Use concrete ambiguous situations: delayed bus, sold-out item, strange reply, unfamiliar request, unclear AI answer.
- Preserve existing final certificate and reward behavior.
- Do not stage unrelated untracked files.

---

## Task 1: Add Six Preview-Main Studios

**Files:**

- `src/data/lessons/m1.ts`
- `src/data/lessons/m2.ts`
- `src/data/lessons/m3.ts`
- `src/data/lessons/m4.ts`
- `src/data/lessons/m5.ts`
- `src/data/lessons/m6.ts`

**Steps:**

- In each module's wrap-up lesson mission, insert one `예고` chapter and one `본 활동` chapter before the final summary/vow chapter.
- Give each new block a unique id:
  - `studio_preview_m1_l11`, `studio_plan_m1_l11`, `studio_draw_m1_l11`
  - `studio_preview_m2_l11`, etc.
- Add each studio block to the final `summary.rows` so teacher review captures attempts.
- Keep existing self-check/quiz/certificate blocks intact.

**Expected Result:** Each module wrap-up mission now includes transfer practice beyond fixed-answer review.

---

## Task 2: Verify Data Shape

**Files:** changed lesson files

**Steps:**

- Run `npm run build`.
- Run `npm run check:encoding`.
- Run `npm run check:ui-polish`.
- Run `npm run check:activity-icons`.
- Run `git diff --check`.

**Expected Result:** TypeScript accepts the new mission content, Korean text remains UTF-8, and no icon coverage regression appears.

---

## Task 3: Browser Smoke Test

**Files:** none

**Steps:**

- Open a module wrap-up lesson with Playwright.
- Navigate to the mission step.
- Confirm the new `예고` and `본 활동` chapter tabs appear.
- Click through at least one preview branch choice and one main activity choice.

**Expected Result:** The existing mission renderer displays the new chapters without UI breakage.

---

## Task 4: Commit

**Files:** plan plus six lesson data files

**Steps:**

- Stage only the plan and changed lesson files.
- Commit with:

```bash
git commit -m "feat: add preview-main generalization studios"
```

**Expected Result:** Generalization studio work is committed separately from the TTS fix.
