# Module 5 Remodel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remodel module 5 into eleven equal-quality eight-stage problem-solving experiences and one `문제 해결 지도` portfolio lesson.

**Architecture:** Keep the shared `StudioDefinition` and `ModulePortfolioDefinition` runtime used by modules 1 through 4. Replace module 5 lesson, studio, challenge, story, and portfolio data with the approved PRD, then update role registries, global contracts, and teacher guidance to recognize eleven new studios without changing the 68-lesson shell.

**Tech Stack:** React 19, TypeScript, Vite, Node contract scripts, Playwright browser verification.

## Global Constraints

- Preserve 68 lessons and six module-close lessons.
- Use the same eight stages for `m5-l1` through `m5-l11`.
- Reserve four blank story image slots per experience and three blank portfolio image slots.
- Use prepared AI examples and keep safe or productive choices visible in the first two full-support choices.
- Do not blame the student when AI misunderstands a request.
- Keep decomposition and sequencing as separate concepts and activities.
- Do not use homework-versus-play as a moral single-answer priority task.
- Do not use destructive exaggerated distractors.
- Do not require real cooking or celebrate food preparation without tool, allergy, time, and adult-safety checks.
- Run a fresh production build before committing.

---

### Task 1: Module 5 Contract

**Files:**
- Create: `scripts/check-module5-remodel.mjs`
- Read: `docs/superpowers/specs/2026-07-23-68-lesson-content-remodel-prd.md`

**Interfaces:**
- Consumes: approved lesson titles, objectives, artifacts, forbidden copy, and shared studio schema.
- Produces: a repeatable RED/GREEN contract for all module 5 data and support-choice visibility.

- [ ] **Step 1: Write the failing contract**

Assert twelve fixed lesson titles and objectives, eleven studio definitions, four blank scenes per studio, required eight-stage fields, prepared AI contributions, artifact titles, portfolio references, three closing scenes, and forbidden-copy removal.

- [ ] **Step 2: Verify RED**

Run: `node scripts/check-module5-remodel.mjs`

Expected: FAIL because `m5-l1` does not yet use the canonical title and module 5 has only three studio definitions.

### Task 2: Canonical Lessons and Challenge Knowledge

**Files:**
- Modify: `src/data/lessons/m5.ts`
- Modify: `src/data/lessons/hard/m5.ts`

**Interfaces:**
- Consumes: existing verified curriculum standards and twelve PRD objectives.
- Produces: concise student lesson shells and challenge-level concept, term, method, limit, and wrap-up content.

- [ ] **Step 1: Replace all twelve lesson records**

Use `kind: 'experience'` for `m5-l1` through `m5-l11`, `kind: 'activity'` for `m5-l12`, and one placeholder text step per lesson.

- [ ] **Step 2: Replace challenge support**

Explain current-goal gaps, decomposition, dependency-based order, criteria-based priority, adjustable help, non-blaming clarification, checkpoints, independent verification, alternatives, testing, condition changes, and iterative problem solving.

### Task 3: Eleven Studio Experiences

**Files:**
- Modify: `src/data/studios/m5.ts`

**Interfaces:**
- Consumes: `StudioDefinition`, `STUDIO_SUPPORT_PROFILES`, `STUDIO_EXPRESSION_MODES`.
- Produces: eleven full studio definitions with four scenes, three knowledge cards, first attempt, changed conditions, prepared AI comparison, artifact, transfer, and reflection.

- [ ] **Step 1: Implement `m5-l1` through `m5-l6`**

Cover problem definition, task decomposition, reasoned order, priority criteria, graduated help, and safe clarification.

- [ ] **Step 2: Implement `m5-l7` through `m5-l11`**

Cover checkpoints, goal-result verification, criteria-based alternatives, error retesting, and safe condition-driven plan changes.

- [ ] **Step 3: Verify studio contract**

Run: `node scripts/check-module5-remodel.mjs`

Expected: progress beyond lesson and studio assertions to remaining portfolio or registry assertions.

### Task 4: Story and Problem-Solving Map

**Files:**
- Modify: `src/data/story.ts`
- Modify: `src/data/modulePortfolios/m5.ts`

**Interfaces:**
- Consumes: eleven studio artifact titles.
- Produces: one continuous AI fair preparation story and an `m5-l12` portfolio that collects all eleven evidence records.

- [ ] **Step 1: Rewrite module 5 story entries**

Connect delivery delay, booth decomposition, installation order, competing priorities, help levels, place clarification, checkpoints, verification, alternatives, retesting, and changed food-safety conditions.

- [ ] **Step 2: Build the problem-solving map portfolio**

Provide three blank closing scenes, all eleven artifact choices, guide sections for current-goal-information, plan-execution-check, and change reason, plus a new-problem transfer prompt.

### Task 5: Global Registry and Guidance

**Files:**
- Modify: `src/data/lessonRoles.ts`
- Modify: `scripts/check-lesson-role-contract.mjs`
- Modify: `scripts/check-generalization-contract.mjs`
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`
- Modify: `scripts/check-single-learning-objective-contract.mjs`
- Modify: `scripts/check-studio-expansion-contract.mjs`
- Modify: `scripts/check-complete-studio-rollout-contract.mjs`
- Modify: `src/features/teacher/TeacherHub.tsx`
- Modify: `docs/teacher-guide/m1-m2-studio-expansion.md`
- Modify: `docs/teacher-guide/m3-m4-m6-studio-expansion.md`

**Interfaces:**
- Consumes: eleven module 5 studio lesson IDs and one close lesson ID.
- Produces: 54 studios, 8 support lessons, 6 module-close lessons, 216 story scenes, and teacher guidance for modules 1 through 5.

- [ ] **Step 1: Expand registries and contracts**

Make `m5-l1` through `m5-l11` studios, retain `m5-l12` as module-close, and enforce eleven transfers plus 44 blank scenes.

- [ ] **Step 2: Update teacher-facing counts and scope**

Describe modules 1 through 5 as fully remodeled and module 6 as retaining its existing studio range.

### Task 6: Verification and Commit

**Files:**
- Verify all files listed above.

**Interfaces:**
- Consumes: completed module 5 implementation.
- Produces: tested commit on `codex/module5-remodel`.

- [ ] **Step 1: Run contracts, encoding, and type checks**

Run module 1 through 5 remodel contracts, role, generalization, visual-story, objective, expansion, rollout, encoding, and `npm run lint`.

- [ ] **Step 2: Run browser verification**

Verify representative lessons at 1280px and `m5-l1`, `m5-l12` at 390x844 with 125 percent text size. Traverse one representative lesson through all eight stages.

- [ ] **Step 3: Run the final build**

Run: `npm run build`

Expected: exit code 0; the existing large-chunk warning may remain.

- [ ] **Step 4: Commit only module 5 work**

Commit message: `feat: remodel module 5 lesson experiences`
