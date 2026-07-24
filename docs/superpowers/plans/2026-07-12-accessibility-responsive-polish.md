# Accessibility and Responsive Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the animated home and public classroom tools while making the student experience motion-safe, responsive, and free of teacher-only technical language.

**Architecture:** Keep behavior local to existing React views and CSS breakpoints. A small Node verification script will assert the durable source-level requirements that lack a test framework; visual behavior is checked in the local Vite server.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite, Node.js.

## Global Constraints

- Keep the home WebGL background, hologram, hero layout, and public classroom-tool dock in normal motion mode.
- Do not run home animation loops when `prefers-reduced-motion: reduce` is active.
- Remove the mouse-trail neon effect entirely.
- Verify at 390px viewport width and 125% text scale.
- Do not expose the term `API` in student-facing sidebar labels or tooltips.
- Do not add a test framework or dependencies.

---

### Task 1: Add a repeatable source-level regression check

**Files:**
- Create: `scripts/check-ui-polish.mjs`
- Modify: `package.json:6-15`

**Interfaces:**
- Produces `npm run check:ui-polish`, which exits non-zero when required accessibility and responsive source markers are absent or removed behavior remains.

- [ ] **Step 1: Write the failing verification script**

```js
import { readFileSync } from 'node:fs';

const home = readFileSync(new URL('../src/views/Home.tsx', import.meta.url), 'utf8');
if (home.includes('trailCanvasRef')) throw new Error('Mouse trail must be removed.');
if (!home.includes('prefers-reduced-motion')) throw new Error('Home must respect reduced motion.');
```

- [ ] **Step 2: Add the script command and run it to verify failure**

```json
"check:ui-polish": "node scripts/check-ui-polish.mjs"
```

Run: `npm run check:ui-polish`

Expected: failure because the existing home still declares `trailCanvasRef` and does not check `prefers-reduced-motion`.

- [ ] **Step 3: Expand the check to cover all agreed regressions**

```js
const sidebar = readFileSync(new URL('../src/components/SidebarTree.tsx', import.meta.url), 'utf8');
const matching = readFileSync(new URL('../src/components/games/Matching.tsx', import.meta.url), 'utf8');
const sequence = readFileSync(new URL('../src/components/games/Sequence.tsx', import.meta.url), 'utf8');
if (sidebar.includes('API 활용 포함') || !sidebar.includes('h-11 w-11')) throw new Error('Sidebar student wording or target size regressed.');
if (!matching.includes('sm:grid-cols-2') || !sequence.includes('sm:grid-cols-2')) throw new Error('Game choices must stack below the small breakpoint.');
```

- [ ] **Step 4: Commit the verification hook**

```bash
git add package.json scripts/check-ui-polish.mjs
git commit -m "test: add UI polish regression check"
```

### Task 2: Make home motion-safe and remove the mouse trail

**Files:**
- Modify: `src/views/Home.tsx:1-377`

**Interfaces:**
- Consumes the browser `matchMedia('(prefers-reduced-motion: reduce)')` setting.
- Produces a static home background for motion-reduction users and keeps the existing shader, hologram, and click ripple for other users.

- [ ] **Step 1: Run the regression check and confirm the expected failure**

Run: `npm run check:ui-polish`

Expected: failure mentioning `Mouse trail must be removed.`

- [ ] **Step 2: Add a local reduced-motion hook**

```tsx
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}
```

- [ ] **Step 3: Gate each visual effect and remove the trail DOM/effect**

```tsx
const reducedMotion = useReducedMotion();

useEffect(() => {
  if (reducedMotion) return;
  // existing shader setup and cleanup
}, [reducedMotion]);

{!reducedMotion && <div ref={threejsContainerRef} className="fixed inset-0 w-full h-full pointer-events-none bg-transparent z-0" />}
```

Delete `trailCanvasRef`, its effect, and its `<canvas>` element. Apply the same `if (reducedMotion) return;` guard to the click-ripple effect.

- [ ] **Step 4: Run the regression check to verify it passes**

Run: `npm run check:ui-polish`

Expected: PASS.

- [ ] **Step 5: Commit the home motion change**

```bash
git add src/views/Home.tsx
git commit -m "fix: respect reduced motion on home"
```

### Task 3: Polish student copy, links, and home responsive chrome

**Files:**
- Modify: `src/views/Home.tsx:397-590`
- Modify: `src/components/SidebarTree.tsx:88-105`
- Modify: `src/index.css:1`
- Modify: `index.html:8`

**Interfaces:**
- Produces student-friendly navigation text and a home header that wraps safely at 390px and enlarged text.

- [ ] **Step 1: Update the home header layout and copy**

```tsx
<nav className="... h-auto min-h-20 py-3">
  <div className="flex flex-wrap justify-between items-center gap-3 ...">
    <div className="... text-lg sm:text-2xl ...">AI 교과서</div>
```

Keep the existing navigation destinations. Replace the home `#home` link and empty footer anchors with non-link explanatory text. Replace “느린 학습자들을 위한” with “내 속도로 배우는”, and replace the vibe-coding footer sentence with a neutral educational-product attribution.

- [ ] **Step 2: Remove student-facing technical wording and enlarge lesson stamps**

```tsx
(lessonHasAI ? ' (아이미와 대화 활동 포함)' : '')
className="relative h-11 w-11 rounded-full flex items-center justify-center ..."
```

- [ ] **Step 3: Remove unused font import and align browser theme color**

```css
@import "tailwindcss";
```

```html
<meta name="theme-color" content="#2B3A55" />
```

- [ ] **Step 4: Run the regression check and TypeScript validation**

Run: `npm run check:ui-polish && npm run lint`

Expected: both commands exit 0.

- [ ] **Step 5: Commit the copy and responsive chrome changes**

```bash
git add src/views/Home.tsx src/components/SidebarTree.tsx src/index.css index.html
git commit -m "fix: polish student-facing responsive UI"
```

### Task 4: Stack game choices on narrow screens

**Files:**
- Modify: `src/components/games/Matching.tsx:113`
- Modify: `src/components/games/Sequence.tsx:105`

**Interfaces:**
- Produces one-column choices below Tailwind's `sm` breakpoint and retains two columns from `sm` upward.

- [ ] **Step 1: Run the regression check and confirm the expected failure**

Run: `npm run check:ui-polish`

Expected: failure mentioning that game choices must stack below the small breakpoint.

- [ ] **Step 2: Apply the responsive grid classes**

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
```

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
```

- [ ] **Step 3: Run the regression and project checks**

Run: `npm run check:ui-polish && npm run lint && npm run check:encoding`

Expected: all commands exit 0.

- [ ] **Step 4: Commit the responsive game layouts**

```bash
git add src/components/games/Matching.tsx src/components/games/Sequence.tsx
git commit -m "fix: stack game choices on small screens"
```

### Task 5: Build and visually verify the finished flow

**Files:**
- Verify only: changed files above

**Interfaces:**
- Verifies the local Vite development server at `http://localhost:3000`.

- [ ] **Step 1: Build and inspect the working tree**

Run: `npm run build && git status --short`

Expected: Vite build exits 0; only intended uncommitted changes, if any, appear.

- [ ] **Step 2: Start the local server**

Run: `npm run dev`

Expected: Vite reports a local URL at `http://localhost:3000`.

- [ ] **Step 3: Manually verify the agreed views**

At 390px width with 125% text size, check that the home header wraps without clipping, sidebar lesson targets remain easy to tap, and matching/sequence games use a single column. With reduced motion enabled, reload home and verify that the shader, hologram, and click ripple do not animate. With normal motion enabled, verify the shader and hologram remain visible but no mouse trail follows the pointer.

- [ ] **Step 4: Report the local URL and verification evidence**

