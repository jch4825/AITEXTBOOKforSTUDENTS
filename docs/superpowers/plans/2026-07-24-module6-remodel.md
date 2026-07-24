# Module 6 Remodel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remodel module 6 into eleven equal-quality eight-stage life-practice experiences and one `나의 AI 생활 포트폴리오` graduation lesson.

**Architecture:** Keep the shared `StudioDefinition` and `ModulePortfolioDefinition` runtime used by modules 1 through 5. Replace module 6 lesson, studio, challenge, story, and portfolio data with the approved module 6 PRD, then update role registries, global contracts, and teacher guidance without changing the 68-lesson shell.

**Tech Stack:** React 19, TypeScript, Vite, Node contract scripts, in-app browser verification.

## Global Constraints

- Preserve 68 lessons and six module-close lessons.
- Use the same eight stages for `m6-l1` through `m6-l11`.
- Reserve four blank story image slots per experience and three blank portfolio image slots.
- Use prepared AI examples and keep safe or productive choices visible in the first two full-support choices.
- Use fixed practice maps, official transport and weather cards, and trusted people instead of invented live information.
- Treat money calculations as calculator-and-receipt verification tasks.
- Do not ask AI to diagnose symptoms, select a hospital, or replace urgent human help.
- Keep food work as a planning simulation unless a teacher separately authorizes a supervised activity.
- Include help requests, refusal, and requests for repetition as equal communication goals.
- Do not present occupations as fixed tool matches or make deterministic claims about automation and job loss.
- Keep classroom and online self-introductions separate and minimize personal information.
- Run a fresh production build before committing.

---

### Task 1: Module 6 Contract

**Files:**
- Create: `scripts/check-module6-remodel.mjs`
- Read: `docs/superpowers/specs/2026-07-23-68-lesson-content-remodel-prd.md`

**Interfaces:**
- Consumes: approved titles, objectives, artifacts, safety exclusions, and the shared studio schema.
- Produces: a repeatable RED/GREEN contract for all module 6 data and support-choice visibility.

- [ ] **Step 1: Write the failing contract**

Assert twelve fixed titles and objectives, eleven studio definitions, four blank scenes per studio, all eight-stage fields, prepared AI contributions, artifact titles, portfolio references, three closing scenes, and forbidden-copy removal.

- [ ] **Step 2: Verify RED**

Run: `node scripts/check-module6-remodel.mjs`

Expected: FAIL because `m6-l1` does not use the canonical title and module 6 has only three studio definitions.

### Task 2: Canonical Lessons and Challenge Knowledge

**Files:**
- Modify: `src/data/lessons/m6.ts`
- Modify: `src/data/lessons/hard/m6.ts`

**Interfaces:**
- Consumes: existing verified curriculum standards and twelve PRD objectives.
- Produces: concise student lesson shells and challenge-level concept, term, method, limit, and wrap-up content.

- [ ] **Step 1: Replace all twelve lesson records**

Use `kind: 'experience'` for `m6-l1` through `m6-l11`, `kind: 'activity'` for `m6-l12`, and one placeholder text step per lesson.

- [ ] **Step 2: Replace challenge support**

Explain conditional shopping, calculator verification, fixed-map reading, official transport and weather checks, safe food planning, adjustable schedules, human-first health help, self-advocacy communication, evidence-based occupation exploration, and audience-aware self-introduction.

### Task 3: Eleven Studio Experiences

**Files:**
- Modify: `src/data/studios/m6.ts`

**Interfaces:**
- Consumes: `StudioDefinition`, `STUDIO_SUPPORT_PROFILES`, `STUDIO_EXPRESSION_MODES`.
- Produces: eleven full studio definitions with four scenes, three knowledge cards, first attempt, changed conditions, prepared AI comparison, artifact, transfer, and reflection.

- [ ] **Step 1: Implement `m6-l1` through `m6-l6`**

Cover conditional shopping, calculator verification, fixed maps, direction-aware transport, official forecasts, and safe food planning.

- [ ] **Step 2: Implement `m6-l7` through `m6-l11`**

Cover personal schedules, human-first health communication, self-advocacy expressions, real-worker occupation exploration, and audience-aware self-introduction.

- [ ] **Step 3: Verify studio contract**

Run: `node scripts/check-module6-remodel.mjs`

Expected: progress beyond lesson and studio assertions to remaining portfolio or registry assertions.

### Task 4: Story and Life Portfolio

**Files:**
- Modify: `src/data/story.ts`
- Modify: `src/data/modulePortfolios/m6.ts`

**Interfaces:**
- Consumes: eleven studio artifact titles.
- Produces: one continuous town-life mission and an `m6-l12` portfolio that collects all eleven evidence records.

- [ ] **Step 1: Rewrite module 6 story entries**

Connect the club snack mission, checkout, fixed-map route, transit direction, official forecast, safe food plan, changed schedule, health communication, self-advocacy, worker interview, and graduation self-introduction.

- [ ] **Step 2: Build the life portfolio**

Provide three blank closing scenes, all eleven artifact choices, guide sections for plan and budget, movement and conditions, health and communication, plus a town-event transfer prompt and graduation principles.

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
- Consumes: eleven module 6 studio lesson IDs and one close lesson ID.
- Produces: 62 studios, zero support lessons, six module-close lessons, 248 story scenes, and teacher guidance for all six modules.

- [ ] **Step 1: Expand registries and contracts**

Make `m6-l1` through `m6-l11` studios, retain `m6-l12` as module-close, and enforce eleven transfers plus 44 blank scenes.

- [ ] **Step 2: Update teacher-facing counts and scope**

Describe modules 1 through 6 as fully remodeled while preserving the six module-close lessons.

### Task 6: Verification and Commit

**Files:**
- Verify all files listed above.

**Interfaces:**
- Consumes: completed module 6 implementation.
- Produces: tested commit on `codex/module6-remodel`.

- [ ] **Step 1: Run contracts, encoding, and type checks**

Run module 5 and 6 remodel contracts, role, generalization, visual-story, objective, expansion, rollout, mobile-expression, encoding, and `npm run lint`.

- [ ] **Step 2: Run browser verification**

Verify representative lessons at 1280px and `m6-l1`, `m6-l12` at 390x844 with 125 percent text size. Traverse one safety-critical lesson through all eight stages.

- [ ] **Step 3: Run the final build**

Run: `npm run build`

Expected: exit code 0; the existing large-chunk warning may remain.

- [ ] **Step 4: Commit only module 6 work**

Commit message: `feat: remodel module 6 lesson experiences`
