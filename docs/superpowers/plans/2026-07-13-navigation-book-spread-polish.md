# Navigation Book Spread Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the contents accordion closable and visually stable, and make lesson introductions read as a symmetric, readable book spread across desktop, tablet, and mobile.

**Architecture:** Keep state ownership in `ContentsView`, keep `SeasonMap` presentational, and update `LessonSpread`/`EpisodeHeroSpread` so the page shell owns book geometry while the hero component owns art/text content. CSS in `src/index.css` provides the responsive drawer and book-surface language.

**Tech Stack:** React 19, TypeScript, Tailwind v4 utility classes, project CSS tokens in `src/index.css`, Vite build.

## Global Constraints

- UTF-8 Korean content must pass `npm run check:encoding`.
- Strict TypeScript must pass `npm run lint` and `npm run build`.
- No test framework is installed; use type checks, existing polish checks, and browser viewport verification.
- PC-first at 1280px+, with tablet and mobile responsiveness preserved.
- Do not alter lesson data, TTS, dictionary, progress, difficulty, or image fallback order.

---

### Task 1: Contents Accordion Drawer

**Files:**
- Modify: `src/views/ContentsView.tsx`
- Modify: `src/components/SeasonMap.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `ModuleId`, `lessonIdsForModule`, `renderLessons(id: ModuleId)`.
- Produces: `activeId: ModuleId | null`, `onPick(id: ModuleId): void`, drawer panel ids `season-lessons-${moduleId}`.

- [ ] Step 1: Update `ContentsView` so `activeId` can be `null`, add `handlePickModule`, and derive the active theme from either active module or resume module.
- [ ] Step 2: Update `SeasonMap` props to accept `ModuleId | null`, add `aria-expanded`, `aria-controls`, and a chevron state indicator.
- [ ] Step 3: Render the active lesson drawer as its own full-row `<li>` after module 3 or 6 on desktop while keeping mobile behavior inline through CSS ordering.
- [ ] Step 4: Update CSS so module cards stay 3×2 on desktop, the drawer spans all columns, and mobile uses a single-column inline accordion.
- [ ] Step 5: Run `npm run lint` and verify the TypeScript surface.

### Task 2: Symmetric Book Spread

**Files:**
- Modify: `src/components/lesson/LessonSpread.tsx`
- Modify: `src/components/lesson/EpisodeHeroSpread.tsx`
- Modify: `src/index.css`

**Interfaces:**
- Consumes: `left`, `right`, `accent`, `label`, `className`.
- Produces: equal desktop pages, fixed left-art/right-text order, stacked tablet/mobile order.

- [ ] Step 1: Remove the alternating wide-screen layout from hero introductions and stop passing `reverse`.
- [ ] Step 2: Change `LessonSpread` desktop grid to `1fr 1fr`, centralize the gutter at 50%, and top-align page content.
- [ ] Step 3: Increase the image plane so it fills the left page without cropping the foreground, replacing blurred duplicate backgrounds with quiet color fields.
- [ ] Step 4: Top-align text and soften the goal/story panels so they read as book typography, not floating app widgets.
- [ ] Step 5: Add tablet/mobile constraints for full available width, image height, and no horizontal overflow.

### Task 3: Verification and Finish

**Files:**
- Verify: `docs/superpowers/specs/2026-07-13-navigation-book-spread-polish-design.md`
- Verify: changed source files

- [ ] Step 1: Run `npm run check:ui-polish`, `npm run lint`, `npm run check:encoding`, `npm run build`, and `git diff --check`.
- [ ] Step 2: Open the local server and inspect contents/lesson views at 1280×900, 768×1024, and 390×844.
- [ ] Step 3: Confirm same-module click closes, another-module click switches, and one drawer only is visible.
- [ ] Step 4: Commit the scoped changes.
