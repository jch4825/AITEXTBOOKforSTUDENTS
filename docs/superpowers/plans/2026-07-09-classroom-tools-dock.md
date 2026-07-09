# Classroom Tools Dock Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **No test framework in this repo** (see CLAUDE.md — "No test framework — 수동 검증"). Every task's verification step is `npm run lint` (tsc --noEmit) instead of a test run, plus a final manual browser check in the last task. Do not introduce a test framework to satisfy this plan.

**Goal:** Add a floating "Classroom Tools Dock" (판서·타이머·PECS·학습지·교사자료) to the lesson screen, per `docs/superpowers/specs/2026-07-09-classroom-tools-dock-design.md`.

**Architecture:** `ClassroomDock` renders inside `MicroLessonFrame` (lesson screens only), fixed bottom-left above the footer. It owns the countdown-timer state (so a mini chip can survive the panel being closed) and derives `moduleId`/theme from `lessonId`. Draw/Timer/PECS are real; Worksheet/Resources are stub panels backed by real (currently-empty) data files so content can be dropped in later with no code changes.

**Tech Stack:** React 19 + TypeScript (strict), Tailwind v4 utility classes + CSS custom-property design tokens already defined in `src/index.css`, Pointer Events for the canvas.

---

## File Structure

- Create `src/data/pecs.ts` — PECS symbol labels + per-module word lists (pure data).
- Create `src/data/teacherResources.ts` — per-module teacher link list (pure data, empty for now).
- Modify `src/components/Icon.tsx` — add 5 glyphs: `pen`, `timer`, `printer`, `cards`, `link`.
- Create `src/components/DrawBoard.tsx` — fullscreen canvas overlay (판서).
- Create `src/components/ClassTimer.tsx` — presentational countdown panel body (state lives in the dock).
- Create `src/components/PecsBoard.tsx` — PECS card grid + expand-on-tap.
- Create `src/components/ClassroomDock.tsx` — the dock itself: button row, panel switcher, timer state, worksheet/resources stub panels.
- Modify `src/components/MicroLessonFrame.tsx` — render `<ClassroomDock lessonId={lessonId} />`.

---

### Task 1: PECS data

**Files:**
- Create: `src/data/pecs.ts`

- [ ] **Step 1: Write the data file**

```ts
import type { ModuleId } from '../types';

// name = public/lessons/pecs/{name}.webp 의 basename
export const PECS_LABELS: Record<string, string> = {
  toilet: '화장실', faucet: '물', paper_cup: '컵', snack: '간식',
  smartphone: '스마트폰', ai_speaker: '음성비서', ai_aimi: '아이미', refrigerator: '냉장고',
  cat: '고양이', rabbit: '토끼', elephant: '코끼리', dinosaur: '공룡', turtle: '거북이',
  book: '책', pencil: '연필', eraser: '지우개', apple: '사과', bread: '빵', milk: '우유',
  cheese: '치즈', ham: '햄', chocolate: '초콜릿', ramen: '라면', pot: '냄비', toaster: '토스터',
  knife: '칼', lettuce: '상추', bus: '버스', umbrella: '우산', cloud: '구름', clothes: '옷',
  sunglasses: '선글라스', soccer_ball: '축구공', key: '열쇠', light_switch: '전등 스위치',
  cheetah: '치타', eagle: '독수리', fan: '선풍기', hand_fan: '부채', tube: '튜브',
};

// 기본 의사소통 욕구 — 모든 모듈에서 항상 노출
export const PECS_COMMON: string[] = ['toilet', 'faucet', 'paper_cup', 'snack'];

// 모듈별 관련 단어 (초안 — 교사 피드백으로 조정)
export const PECS_BY_MODULE: Record<ModuleId, string[]> = {
  m1: ['smartphone', 'ai_speaker', 'ai_aimi', 'refrigerator', 'cat', 'rabbit', 'elephant', 'dinosaur'],
  m2: ['ai_aimi', 'smartphone', 'book', 'pencil', 'sunglasses'],
  m3: ['book', 'pencil', 'eraser', 'apple', 'cat', 'dinosaur', 'ai_aimi'],
  m4: ['smartphone', 'key', 'light_switch', 'book'],
  m5: ['ramen', 'pot', 'toaster', 'bread', 'knife', 'lettuce', 'cheese', 'ham', 'soccer_ball'],
  m6: ['apple', 'bread', 'milk', 'cheese', 'ham', 'chocolate', 'bus', 'umbrella', 'cloud', 'clothes', 'sunglasses', 'refrigerator', 'pot', 'book'],
};
```

- [ ] **Step 2: Verify types**

Run: `npm run lint`
Expected: no errors (this file has no consumers yet, so it just needs to type-check standalone).

- [ ] **Step 3: Commit**

```bash
git add src/data/pecs.ts
git commit -m "feat(dock): add PECS symbol labels and per-module word lists"
```

---

### Task 2: Teacher resources stub data

**Files:**
- Create: `src/data/teacherResources.ts`

- [ ] **Step 1: Write the data file**

```ts
import type { ModuleId } from '../types';

export interface TeacherLink { label: string; url: string }

// 나중에 동영상 링크 등을 채우면 ClassroomDock의 "교사 자료" 패널에 자동 노출된다.
export const TEACHER_RESOURCES: Record<ModuleId, TeacherLink[]> = {
  m1: [], m2: [], m3: [], m4: [], m5: [], m6: [],
};
```

- [ ] **Step 2: Verify types**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/teacherResources.ts
git commit -m "feat(dock): add empty per-module teacher resources structure"
```

---

### Task 3: Icon glyphs (pen, timer, printer, cards, link)

**Files:**
- Modify: `src/components/Icon.tsx:13-17` (the `IconName` union)
- Modify: `src/components/Icon.tsx:58` onward (the `GLYPHS` record)

- [ ] **Step 1: Extend `IconName`**

In `src/components/Icon.tsx`, change:

```ts
export type IconName =
  | 'speaker' | 'book' | 'home' | 'settings' | 'mic' | 'mic-on'
  | 'menu' | 'close' | 'chevron-left' | 'chevron-right'
  | 'chat' | 'check' | 'bulb' | 'rocket' | 'sparkles' | 'refresh'
  | 'star' | 'circle' | 'cross' | 'warning' | 'think' | 'hourglass';
```

to:

```ts
export type IconName =
  | 'speaker' | 'book' | 'home' | 'settings' | 'mic' | 'mic-on'
  | 'menu' | 'close' | 'chevron-left' | 'chevron-right'
  | 'chat' | 'check' | 'bulb' | 'rocket' | 'sparkles' | 'refresh'
  | 'star' | 'circle' | 'cross' | 'warning' | 'think' | 'hourglass'
  | 'pen' | 'timer' | 'printer' | 'cards' | 'link';
```

- [ ] **Step 2: Add the 5 glyphs**

In `src/components/Icon.tsx`, add these entries to the `GLYPHS` object (order doesn't matter, e.g. right after `hourglass: ...,`):

```ts
  pen: () => (
    <>
      <path d="M4 20l1-4.2L15.8 5l3.2 3.2L8.2 19H4z" />
      <path d="M13.5 6.5l3.2 3.2" />
    </>
  ),
  timer: () => (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 13V9.5" />
      <path d="M9.5 2h5" />
      <path d="M18 6.5l1.2-1.2" />
    </>
  ),
  printer: () => (
    <>
      <path d="M6 9V4h12v5" />
      <rect x="3" y="9" width="18" height="8" rx="1.5" />
      <path d="M6 14h12v7H6z" />
    </>
  ),
  cards: () => (
    <>
      <path d="M7 7V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
      <rect x="3" y="7" width="14" height="14" rx="2" />
    </>
  ),
  link: () => (
    <>
      <path d="M9 15l6-6" />
      <path d="M10.5 6.5l1-1a4 4 0 0 1 5.7 5.7l-1.2 1.2" />
      <path d="M13.5 17.5l-1 1a4 4 0 0 1-5.7-5.7l1.2-1.2" />
    </>
  ),
```

Because `GLYPHS` is typed `Record<IconName, ...>`, TypeScript will error if any of the 5 new names are missing — that's the correctness check for this step.

- [ ] **Step 3: Verify types**

Run: `npm run lint`
Expected: no errors (specifically: no "Property 'pen' is missing" style errors on `GLYPHS`).

- [ ] **Step 4: Commit**

```bash
git add src/components/Icon.tsx
git commit -m "feat(dock): add pen/timer/printer/cards/link icons"
```

---

### Task 4: DrawBoard (판서 — 실기능)

**Files:**
- Create: `src/components/DrawBoard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import Icon from './Icon';

const PEN_COLORS = [
  { name: '남색', value: '#2B3A55' },
  { name: '파랑', value: '#5A7DA0' },
  { name: '초록', value: '#4F9E8B' },
  { name: '갈색', value: '#B07A4F' },
  { name: '보라', value: '#9A6CA0' },
];
const STROKE_WIDTHS = [4, 10];

interface Props {
  onClose: () => void;
}

/**
 * 전체화면 필기 오버레이 — 도크와 독립된 z-50 레이어 (§3.2). 휘발성: 저장 없음.
 */
export default function DrawBoard({ onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(PEN_COLORS[0].value);
  const [width, setWidth] = useState(STROKE_WIDTHS[0]);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    function resize() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  function getPoint(e: ReactPointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = true;
    lastPointRef.current = getPoint(e);
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    const last = lastPointRef.current;
    if (!ctx || !last) return;
    const point = getPoint(e);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = erasing ? width * 3 : width;
    ctx.strokeStyle = color;
    ctx.globalCompositeOperation = erasing ? 'destination-out' : 'source-over';
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function handlePointerUp() {
    drawingRef.current = false;
    lastPointRef.current = null;
  }

  function clearAll() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="판서">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-[var(--r-pill)] flex-wrap justify-center max-w-[95vw]"
        style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)' }}
      >
        {PEN_COLORS.map((p) => (
          <button
            key={p.value}
            onClick={() => { setColor(p.value); setErasing(false); }}
            aria-label={`펜 색 ${p.name}`}
            aria-pressed={!erasing && color === p.value}
            className="h-9 w-9 rounded-full shrink-0"
            style={{
              background: p.value,
              outline: !erasing && color === p.value ? '3px solid var(--accent)' : 'none',
              outlineOffset: 2,
            }}
          />
        ))}
        <div className="w-px h-8 mx-1" style={{ background: 'var(--border)' }} />
        {STROKE_WIDTHS.map((w) => (
          <button
            key={w}
            onClick={() => setWidth(w)}
            aria-label={w === STROKE_WIDTHS[0] ? '굵기 얇게' : '굵기 굵게'}
            aria-pressed={width === w}
            className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: width === w ? 'var(--paper-2)' : 'transparent' }}
          >
            <span className="rounded-full" style={{ width: w, height: w, background: 'var(--ink-1)' }} />
          </button>
        ))}
        <div className="w-px h-8 mx-1" style={{ background: 'var(--border)' }} />
        <button
          onClick={() => setErasing(true)}
          aria-label="지우개"
          aria-pressed={erasing}
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: erasing ? 'var(--paper-2)' : 'transparent' }}
        ><Icon name="cross" size={18} /></button>
        <button
          onClick={clearAll}
          aria-label="전체 지우기"
          className="h-9 px-3 rounded-[var(--r-pill)] shrink-0 text-sm font-semibold"
        >전체 지우기</button>
        <button
          onClick={onClose}
          aria-label="판서 닫기"
          className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--paper-2)' }}
        ><Icon name="close" size={18} /></button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/DrawBoard.tsx
git commit -m "feat(dock): add fullscreen DrawBoard for 판서"
```

---

### Task 5: ClassTimer (타이머 panel body — 실기능)

**Files:**
- Create: `src/components/ClassTimer.tsx`

- [ ] **Step 1: Write the component**

State is lifted to `ClassroomDock` (Task 7) so a mini chip can keep counting down when this panel is closed. This file is purely presentational.

```tsx
const PRESETS = [1, 3, 5, 10];

interface Props {
  remainingSec: number | null;
  running: boolean;
  onStart: (minutes: number) => void;
  onToggle: () => void;
  onReset: () => void;
}

export function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ClassTimer({ remainingSec, running, onStart, onToggle, onReset }: Props) {
  const done = remainingSec === 0;
  return (
    <div className="p-3 w-64">
      <h3 className="mb-3 text-lg font-bold" style={{ color: 'var(--accent)' }}>타이머</h3>
      {remainingSec === null ? (
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => onStart(m)}
              className="h-14 rounded-[var(--r-sm)] font-bold text-lg"
              style={{ background: 'var(--paper-2)', color: 'var(--accent)' }}
            >{m}분</button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p
            className="text-5xl font-bold mb-4 tabular-nums"
            style={{ color: done ? 'var(--warn)' : 'var(--ink-1)' }}
          >{formatTime(remainingSec)}</p>
          <div className="flex justify-center gap-2">
            {!done && (
              <button
                onClick={onToggle}
                className="h-11 px-4 rounded-[var(--r-pill)] font-semibold"
                style={{ background: 'var(--paper-2)' }}
              >{running ? '멈춤' : '계속'}</button>
            )}
            <button
              onClick={onReset}
              className="h-11 px-4 rounded-[var(--r-pill)] font-semibold"
              style={{ background: 'var(--paper-2)' }}
            >리셋</button>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ClassTimer.tsx
git commit -m "feat(dock): add ClassTimer countdown panel"
```

---

### Task 6: PecsBoard (PECS — 실기능)

**Files:**
- Create: `src/components/PecsBoard.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useState } from 'react';
import { PECS_COMMON, PECS_BY_MODULE, PECS_LABELS } from '../data/pecs';
import type { ModuleId } from '../types';

interface Props {
  moduleId: ModuleId;
}

export default function PecsBoard({ moduleId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const moduleWords = PECS_BY_MODULE[moduleId].filter((w) => !PECS_COMMON.includes(w));
  const words = [...PECS_COMMON, ...moduleWords];

  if (expanded) {
    const label = PECS_LABELS[expanded] ?? expanded;
    return (
      <div className="p-3 w-64 flex flex-col items-center">
        <button
          onClick={() => setExpanded(null)}
          className="w-full aspect-square rounded-[var(--r-md)] flex flex-col items-center justify-center gap-2"
          style={{ background: 'var(--paper-2)' }}
          aria-label={`${label} 카드 닫기`}
        >
          <img
            src={`${import.meta.env.BASE_URL}lessons/pecs/${expanded}.webp`}
            alt=""
            className="w-32 h-32 object-contain"
          />
          <span className="text-xl font-bold">{label}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 w-72">
      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--accent)' }}>PECS 카드</h3>
      <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
        {words.map((w) => (
          <button
            key={w}
            onClick={() => setExpanded(w)}
            className="aspect-square rounded-[var(--r-sm)] flex flex-col items-center justify-center gap-1 p-1"
            style={{ background: 'var(--paper-2)' }}
            aria-label={PECS_LABELS[w] ?? w}
          >
            <img
              src={`${import.meta.env.BASE_URL}lessons/pecs/${w}.webp`}
              alt=""
              className="w-9 h-9 object-contain"
            />
            <span className="text-[10px] font-semibold text-center leading-tight">{PECS_LABELS[w] ?? w}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/PecsBoard.tsx
git commit -m "feat(dock): add PecsBoard card grid with tap-to-enlarge"
```

---

### Task 7: ClassroomDock (container: button row + panel switcher + timer state)

**Files:**
- Create: `src/components/ClassroomDock.tsx`

- [ ] **Step 1: Write the component**

```tsx
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import type { IconName } from './Icon';
import DrawBoard from './DrawBoard';
import ClassTimer, { formatTime } from './ClassTimer';
import PecsBoard from './PecsBoard';
import { moduleIdFromLessonId } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { TEACHER_RESOURCES } from '../data/teacherResources';
import type { LessonId } from '../types';

type ToolId = 'draw' | 'timer' | 'pecs' | 'worksheet' | 'resources';
type PanelId = Exclude<ToolId, 'draw'>;

const TOOLS: { id: ToolId; label: string; icon: IconName }[] = [
  { id: 'draw', label: '판서', icon: 'pen' },
  { id: 'timer', label: '타이머', icon: 'timer' },
  { id: 'pecs', label: 'PECS', icon: 'cards' },
  { id: 'worksheet', label: '학습지', icon: 'printer' },
  { id: 'resources', label: '교사 자료', icon: 'link' },
];

interface Props {
  lessonId: LessonId;
}

/**
 * 교실 도구 도크 — 차시 화면 한정, 전부 공개(게이팅 없음). §2~3 설계 참고.
 */
export default function ClassroomDock({ lessonId }: Props) {
  const [open, setOpen] = useState<ToolId | null>(null);
  const [timerRemaining, setTimerRemaining] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const moduleId = moduleIdFromLessonId(lessonId) ?? 'm1';
  const theme = themeFor(moduleId);
  const resources = TEACHER_RESOURCES[moduleId];

  useEffect(() => {
    if (!timerRunning) return;
    intervalRef.current = window.setInterval(() => {
      setTimerRemaining((prev) => {
        if (prev === null || prev <= 1) {
          setTimerRunning(false);
          return prev === null ? null : 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  function startTimer(minutes: number) {
    setTimerRemaining(minutes * 60);
    setTimerRunning(true);
    setOpen('timer');
  }
  function toggleTimer() {
    setTimerRunning((r) => !r);
  }
  function resetTimer() {
    setTimerRemaining(null);
    setTimerRunning(false);
  }

  function toggle(id: ToolId) {
    setOpen((cur) => (cur === id ? null : id));
  }

  const panelTool = open && open !== 'draw' ? (open as PanelId) : null;

  return (
    <>
      <div className="fixed left-3 md:left-6 z-30 flex flex-col items-start gap-2" style={{ bottom: '6rem' }}>
        {panelTool && (
          <div
            className="rounded-[var(--r-md)] overflow-hidden"
            style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-end p-1">
              <button
                onClick={() => setOpen(null)}
                aria-label="패널 닫기"
                className="h-8 w-8 rounded-[var(--r-sm)] hover:bg-[color:var(--paper-2)] flex items-center justify-center"
              ><Icon name="close" size={16} /></button>
            </div>
            <div className="px-1 pb-2">
              {panelTool === 'timer' && (
                <ClassTimer
                  remainingSec={timerRemaining}
                  running={timerRunning}
                  onStart={startTimer}
                  onToggle={toggleTimer}
                  onReset={resetTimer}
                />
              )}
              {panelTool === 'pecs' && <PecsBoard moduleId={moduleId} />}
              {panelTool === 'worksheet' && (
                <div className="p-4 w-64 text-center">
                  <p className="text-[color:var(--muted)]">학습지는 준비 중이에요.</p>
                </div>
              )}
              {panelTool === 'resources' && (
                <div className="p-4 w-64">
                  <h3 className="text-lg font-bold mb-2" style={{ color: theme.accent }}>교사 자료</h3>
                  {resources.length === 0 ? (
                    <p className="text-[color:var(--muted)]">자료 준비 중이에요.</p>
                  ) : (
                    <ul className="space-y-2">
                      {resources.map((r) => (
                        <li key={r.url}>
                          <a
                            href={r.url}
                            target="_blank"
                            rel="noopener"
                            className="underline"
                            style={{ color: theme.accent }}
                          >{r.label}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className="flex items-center gap-1 p-1.5 rounded-[var(--r-pill)]"
          style={{ background: 'var(--paper-0)', boxShadow: 'var(--e-2)', border: '1px solid var(--border)' }}
        >
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              onClick={() => toggle(tool.id)}
              aria-label={tool.label}
              aria-pressed={open === tool.id}
              title={tool.label}
              className="h-11 w-11 rounded-full flex items-center justify-center"
              style={{
                background: open === tool.id ? theme.accentSoft : 'transparent',
                color: open === tool.id ? theme.accent : 'var(--ink-1)',
              }}
            ><Icon name={tool.icon} size={22} /></button>
          ))}
          {timerRemaining !== null && open !== 'timer' && (
            <span
              className="ml-1 h-8 px-2 rounded-[var(--r-pill)] text-sm font-bold tabular-nums flex items-center"
              style={{
                background: timerRemaining === 0 ? 'var(--warn-bg)' : 'var(--paper-2)',
                color: timerRemaining === 0 ? 'var(--warn)' : 'var(--ink-1)',
              }}
            >{formatTime(timerRemaining)}</span>
          )}
        </div>
      </div>
      {open === 'draw' && <DrawBoard onClose={() => setOpen(null)} />}
    </>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ClassroomDock.tsx
git commit -m "feat(dock): add ClassroomDock container with 5-tool button row"
```

---

### Task 8: Wire ClassroomDock into MicroLessonFrame

**Files:**
- Modify: `src/components/MicroLessonFrame.tsx:1-9` (imports)
- Modify: `src/components/MicroLessonFrame.tsx:134` (render, right before `<footer>`)

- [ ] **Step 1: Add the import**

In `src/components/MicroLessonFrame.tsx`, change:

```tsx
import { useState, type ReactNode } from 'react';
import SidebarTree from './SidebarTree';
import TopBar from './TopBar';
import DictionaryPanel from './DictionaryPanel';
import ProgressDots from './ProgressDots';
import Button from './Button';
import Icon from './Icon';
import type { LessonId } from '../types';
```

to:

```tsx
import { useState, type ReactNode } from 'react';
import SidebarTree from './SidebarTree';
import TopBar from './TopBar';
import DictionaryPanel from './DictionaryPanel';
import ProgressDots from './ProgressDots';
import Button from './Button';
import Icon from './Icon';
import ClassroomDock from './ClassroomDock';
import type { LessonId } from '../types';
```

- [ ] **Step 2: Render the dock**

In `src/components/MicroLessonFrame.tsx`, find this block (the end of the `<div className="flex flex-1 min-h-0">` section, right before `<footer`):

```tsx
        <DictionaryPanel
          open={dictOpen}
          query={dictQuery}
          onClose={() => setDictOpen(false)}
          onSearch={setDictQuery}
        />
      </div>
      <footer className="h-20 shrink-0 border-t border-[color:var(--border)] bg-[color:var(--paper-0)] px-3 md:px-6 flex items-center justify-between gap-2">
```

Replace with:

```tsx
        <DictionaryPanel
          open={dictOpen}
          query={dictQuery}
          onClose={() => setDictOpen(false)}
          onSearch={setDictQuery}
        />
      </div>
      <ClassroomDock lessonId={lessonId} />
      <footer className="h-20 shrink-0 border-t border-[color:var(--border)] bg-[color:var(--paper-0)] px-3 md:px-6 flex items-center justify-between gap-2">
```

(`ClassroomDock` renders as `fixed`, so its position in the JSX tree doesn't affect layout — placing it here keeps it visually grouped with the footer in the source.)

- [ ] **Step 3: Verify types**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/MicroLessonFrame.tsx
git commit -m "feat(dock): render ClassroomDock on the lesson frame"
```

---

### Task 9: Full verification (build + encoding + manual browser check)

**Files:** none (verification only)

- [ ] **Step 1: Run the full check suite**

Run: `npm run check:encoding && npm run lint && npm run build`
Expected: all three pass with no errors (build emits to `dist/`).

- [ ] **Step 2: Manual browser check**

Start the dev server (`npm run dev` or the project's preview tool), open any implemented lesson (e.g. `m1-l1`), and confirm:
1. A floating pill with 5 icon buttons appears bottom-left, above the footer, only on the lesson screen (not on Home/목차).
2. 판서: opens a fullscreen canvas; drawing with mouse/touch works; color swatches switch pen color; eraser removes strokes; "전체 지우기" clears; Esc and the close button both exit.
3. 타이머: presets (1/3/5/10분) start a countdown; 멈춤/계속 toggles; 리셋 returns to presets; closing the panel while running leaves a small mm:ss chip next to the dock buttons that keeps counting; at 0:00 the display turns to the warm/orange (`--warn`) color.
4. PECS: shows the 4 common-need cards plus the current module's words; tapping a card enlarges it; tapping again returns to the grid.
5. 학습지: shows "학습지는 준비 중이에요."
6. 교사 자료: shows "자료 준비 중이에요." (since `TEACHER_RESOURCES` is empty for every module).
7. Opening a second tool closes whichever panel was open (only one at a time), except the mini timer chip which persists independently.

- [ ] **Step 3: Fix any issues found, then re-run Step 1**

If anything fails, fix the specific file, re-run `npm run lint`, and re-check the affected behavior in the browser before proceeding.

- [ ] **Step 4: Final commit (only if Step 2 required fixes)**

```bash
git add -A
git commit -m "fix(dock): address manual QA findings"
```

(Skip this step if no fixes were needed — Task 8's commit is already the final state.)

---

## Out of scope (per design spec §7)

- Worksheet real content / print logic (stub panel only).
- Teacher resource real links (empty data structure only).
- Draw/timer persistence across reload (both are intentionally volatile).
