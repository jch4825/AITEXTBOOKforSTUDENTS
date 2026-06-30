# M1 — 인프라 골격 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** spec(`docs/superpowers/specs/2026-06-30-student-textbook-design.md`)에 정의된 학생용 3단 PC 레이아웃, 공통 컴포넌트, 게임 위젯 3종, 토글, 사전, 진도 저장, 교사 모드 진입까지 — **단일 데모 차시 1개가 모든 인프라를 한 번에 검증**할 수 있는 골격을 구축한다. 실제 Gemini 호출은 M3에서 도입 — M1은 시뮬레이션 응답까지만.

**Architecture:**
- React 19 Context 두 개(`SettingsContext`, `ProgressContext`)로 글로벌 상태 관리 — prop drilling 회피
- URL 파라미터 기반 라우팅 (`?view=home|lesson|teacher`, `?lesson=<id>`)
- Tailwind 4 + CSS 변수로 모듈 테마 + 글자 크기 토글
- Web Speech API로 TTS/STT — 외부 라이브러리 없음
- 게임 위젯은 hand-roll (드래그 라이브러리 미도입)
- 데모 차시는 `src/data/demoLesson.ts` 1개 — M2에서 정식 콘텐츠 데이터 구조로 교체

**Tech Stack:** Vite 6, React 19, TypeScript 5.8, Tailwind 4, Web Speech API

**Gate (단계 완료 기준):**
M0 라이브 URL `https://jch4825.github.io/AITEXTBOOKforSTUDENTS/`에서:
1. 홈 → "공부 시작" 클릭 → 데모 차시 진입
2. 좌측 트리에 6 모듈 표시, 데모 차시 위치 강조
3. 본문 단어 "인공지능" 클릭 → 우측 사전 패널 열림 + TTS 자동 낭독
4. 상단 TTS 토글로 낭독 켜기/끄기
5. 글자 크기 토글로 보통↔크게 전환 (즉시 반영)
6. 난이도 토글로 쉬움↔보통 전환 (본문 텍스트 바뀜)
7. OX 게임 답하기 → 정답 피드백 (색 + 아이콘 + TTS)
8. "AI한테 물어봤어요" 카드 클릭 → 시뮬레이션 응답 표시
9. 차시 완료 → 진도 저장 → 새로고침해도 트리에서 완료 표시 유지
10. URL `?teacher=1`로 진입 → 비밀번호 입력 → 교사 화면 표시 (M3까지 더미)

---

## 파일 구조 (M1 종료 시점)

```
src/
├── App.tsx                          # URL-driven router
├── main.tsx                         # SettingsProvider + ProgressProvider 래핑
├── index.css                        # Tailwind 4 + base
├── types.ts                         # extended (Difficulty, FontSize, LessonId, ModuleId, DictionaryEntry, ScenarioResponse, DemoLesson)
│
├── components/
│   ├── TopBar.tsx
│   ├── SidebarTree.tsx
│   ├── DictionaryPanel.tsx
│   ├── DictionaryTerm.tsx
│   ├── MicroLessonFrame.tsx
│   ├── ProgressDots.tsx
│   ├── ErrorMessage.tsx
│   ├── controls/
│   │   ├── TTSToggle.tsx
│   │   ├── FontSizeToggle.tsx
│   │   ├── DifficultyToggle.tsx
│   │   └── DictionaryTrigger.tsx
│   └── games/
│       ├── OXGame.tsx
│       ├── CardPick.tsx
│       └── Matching.tsx
│
├── context/
│   ├── SettingsContext.tsx          # difficulty, fontSize, ttsEnabled
│   └── ProgressContext.tsx          # completedLessons
│
├── data/
│   ├── modules.ts                   # 6 모듈 메타 (id, title, lessonCount, theme key)
│   ├── studentDictionary.ts         # 초기 8 항목
│   └── demoLesson.ts                # M1 데모 차시 콘텐츠
│
├── views/
│   ├── Home.tsx
│   ├── LessonView.tsx
│   └── TeacherView.tsx
│
├── hooks/
│   └── useSpeak.ts                  # TTS helper hook
│
└── utils/
    ├── tts.ts                       # Web Speech API TTS (low-level)
    ├── stt.ts                       # Web Speech API STT
    ├── teacherMode.ts               # ?teacher=1 + 비밀번호 검증
    ├── moduleThemes.ts              # 6 모듈 색 (낮춘 채도)
    └── storage.ts                   # localStorage 헬퍼 (ai-students-progress, ai-students-settings)
```

---

## Conventions (모든 태스크 공통)

- 모든 파일 UTF-8
- 모든 컴포넌트 함수형, `export default function`
- 클래스명은 Tailwind 4 유틸리티 우선
- 색맹 대응: 색 + 아이콘 + TTS 3중 (정답/오답 피드백)
- 인터랙티브 영역 최소 64×64px
- 한국어 주석/UI 텍스트 그대로 사용
- 각 태스크 끝에서 `git add <files> && git commit -m "<exact-message>"`
- 끝까지 진행 후 마지막에 `npm run build` 통과 확인

---

## Task 1: Tailwind 4 + base CSS

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Tailwind 4 + base CSS로 전체 교체**

`src/index.css`:

```css
@import "tailwindcss";

@layer base {
  :root {
    --bg: #f7f6f3;
    --fg: #2d2d2d;
    --accent: #5a4fcf;
    --border: #e5e4e0;
    --muted: #6b6b6b;
    --font-base: 1.125rem;
    --font-large: 1.5rem;
    --leading: 1.8;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
    background: var(--bg);
    color: var(--fg);
    line-height: var(--leading);
  }

  /* font-size scale applied by SettingsContext via [data-font-size] on <html> */
  html[data-font-size="normal"] body { font-size: var(--font-base); }
  html[data-font-size="large"] body { font-size: var(--font-large); }

  button {
    font: inherit;
    cursor: pointer;
  }

  /* dictionary term — dotted underline */
  .dict-term {
    border-bottom: 2px dotted var(--accent);
    cursor: help;
  }
  .dict-term:hover { background: rgba(90, 79, 207, 0.08); }
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/index.css
git commit -m "feat(m1): reintroduce Tailwind 4 with base CSS, font-size scale, dictionary term style"
```

---

## Task 2: types.ts 확장

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: 전체 교체**

```ts
export type Difficulty = 'easy' | 'normal';
export type FontSize = 'normal' | 'large';

export type ModuleId = 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6';
export type LessonId = string; // 'm1-l1', 'm1-l2', ...

export type ViewName = 'home' | 'lesson' | 'teacher';

export interface DictionaryEntry {
  term: string;
  aliases?: string[];
  shortExplanation: string;
  example?: string;
  ttsVersion?: string;
}

export interface ScenarioResponse {
  userInput: string;
  aiResponse: string;
  teachingPoint?: string;
}

export interface ProgressState {
  completedLessons: LessonId[];
}

export interface SettingsState {
  difficulty: Difficulty;
  fontSize: FontSize;
  ttsEnabled: boolean;
}

/**
 * Demo lesson schema for M1. M2 will introduce the full LessonContent type.
 */
export interface DemoLessonStep {
  kind: 'text' | 'ox' | 'card-pick' | 'matching' | 'sim-ai';
  data: Record<string, unknown>;
}

export interface DemoLesson {
  id: LessonId;
  moduleId: ModuleId;
  title: string;
  bodyEasy: string;
  bodyNormal: string;
  steps: DemoLessonStep[];
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/types.ts
git commit -m "feat(m1): extend types — settings, progress, dictionary, scenario, demo-lesson"
```

---

## Task 3: localStorage 헬퍼 + 키

**Files:**
- Create: `src/utils/storage.ts`

- [ ] **Step 1: 작성**

```ts
import type { ProgressState, SettingsState, Difficulty, FontSize } from '../types';

export const STORAGE_KEYS = {
  progress: 'ai-students-progress',
  settings: 'ai-students-settings',
  teacherMode: 'ai-students-teacher-mode',
} as const;

const DEFAULT_PROGRESS: ProgressState = { completedLessons: [] };

const DEFAULT_SETTINGS: SettingsState = {
  difficulty: 'normal',
  fontSize: 'normal',
  ttsEnabled: true,
};

function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}

function safeSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* quota or denied */ }
}

export function loadProgress(): ProgressState {
  const raw = safeGet(STORAGE_KEYS.progress);
  if (!raw) return DEFAULT_PROGRESS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.completedLessons)) {
      return { completedLessons: parsed.completedLessons.filter((x: unknown) => typeof x === 'string') };
    }
  } catch { /* corrupt */ }
  return DEFAULT_PROGRESS;
}

export function saveProgress(state: ProgressState): void {
  safeSet(STORAGE_KEYS.progress, JSON.stringify(state));
}

export function loadSettings(): SettingsState {
  const raw = safeGet(STORAGE_KEYS.settings);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    const parsed = JSON.parse(raw);
    const difficulty: Difficulty = parsed?.difficulty === 'easy' ? 'easy' : 'normal';
    const fontSize: FontSize = parsed?.fontSize === 'large' ? 'large' : 'normal';
    const ttsEnabled = parsed?.ttsEnabled !== false;
    return { difficulty, fontSize, ttsEnabled };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(state: SettingsState): void {
  safeSet(STORAGE_KEYS.settings, JSON.stringify(state));
}

export function loadTeacherMode(): boolean {
  return safeGet(STORAGE_KEYS.teacherMode) === '1';
}

export function setTeacherMode(enabled: boolean): void {
  safeSet(STORAGE_KEYS.teacherMode, enabled ? '1' : '0');
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/utils/storage.ts
git commit -m "feat(m1): localStorage helpers for progress, settings, teacher mode"
```

---

## Task 4: SettingsContext + ProgressContext

**Files:**
- Create: `src/context/SettingsContext.tsx`
- Create: `src/context/ProgressContext.tsx`

- [ ] **Step 1: SettingsContext 작성**

```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { Difficulty, FontSize, SettingsState } from '../types';
import { loadSettings, saveSettings } from '../utils/storage';

interface SettingsContextValue extends SettingsState {
  setDifficulty: (d: Difficulty) => void;
  setFontSize: (f: FontSize) => void;
  setTTSEnabled: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SettingsState>(() => loadSettings());

  useEffect(() => { saveSettings(state); }, [state]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = state.fontSize;
    document.documentElement.dataset.difficulty = state.difficulty;
  }, [state.fontSize, state.difficulty]);

  const setDifficulty = useCallback((d: Difficulty) => setState(s => ({ ...s, difficulty: d })), []);
  const setFontSize = useCallback((f: FontSize) => setState(s => ({ ...s, fontSize: f })), []);
  const setTTSEnabled = useCallback((v: boolean) => setState(s => ({ ...s, ttsEnabled: v })), []);

  const value = useMemo<SettingsContextValue>(
    () => ({ ...state, setDifficulty, setFontSize, setTTSEnabled }),
    [state, setDifficulty, setFontSize, setTTSEnabled],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
```

- [ ] **Step 2: ProgressContext 작성**

```tsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { LessonId, ProgressState } from '../types';
import { loadProgress, saveProgress } from '../utils/storage';

interface ProgressContextValue extends ProgressState {
  isCompleted: (id: LessonId) => boolean;
  markCompleted: (id: LessonId) => void;
  reset: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  useEffect(() => { saveProgress(state); }, [state]);

  const isCompleted = useCallback(
    (id: LessonId) => state.completedLessons.includes(id),
    [state.completedLessons],
  );

  const markCompleted = useCallback((id: LessonId) => {
    setState(s => s.completedLessons.includes(id)
      ? s
      : { completedLessons: [...s.completedLessons, id] });
  }, []);

  const reset = useCallback(() => setState({ completedLessons: [] }), []);

  const value = useMemo<ProgressContextValue>(
    () => ({ ...state, isCompleted, markCompleted, reset }),
    [state, isCompleted, markCompleted, reset],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/context/
git commit -m "feat(m1): SettingsContext + ProgressContext with localStorage persistence"
```

---

## Task 5: 모듈 메타 + 모듈 테마

**Files:**
- Create: `src/data/modules.ts`
- Create: `src/utils/moduleThemes.ts`

- [ ] **Step 1: 모듈 테마 작성 (채도 낮춤)**

`src/utils/moduleThemes.ts`:

```ts
import type { ModuleId } from '../types';

export interface ModuleTheme {
  accent: string;        // 본문 강조색 (text/border)
  accentSoft: string;    // 배경 강조 (옅게)
  emoji: string;         // 차시 아이콘 fallback
}

export const MODULE_THEMES: Record<ModuleId, ModuleTheme> = {
  m1: { accent: '#5A7DA0', accentSoft: 'rgba(90,125,160,0.12)', emoji: '🌱' },
  m2: { accent: '#7560A0', accentSoft: 'rgba(117,96,160,0.12)', emoji: '💬' },
  m3: { accent: '#4F9E8B', accentSoft: 'rgba(79,158,139,0.12)', emoji: '📚' },
  m4: { accent: '#B07A4F', accentSoft: 'rgba(176,122,79,0.12)', emoji: '🛡️' },
  m5: { accent: '#9A6CA0', accentSoft: 'rgba(154,108,160,0.12)', emoji: '🧩' },
  m6: { accent: '#5A9A6E', accentSoft: 'rgba(90,154,110,0.12)', emoji: '🏠' },
};

export function themeFor(moduleId: ModuleId): ModuleTheme {
  return MODULE_THEMES[moduleId];
}
```

- [ ] **Step 2: 모듈 메타 작성**

`src/data/modules.ts`:

```ts
import type { ModuleId } from '../types';

export interface ModuleMeta {
  id: ModuleId;
  number: number;
  title: string;
  lessonCount: number;
}

export const MODULES: ModuleMeta[] = [
  { id: 'm1', number: 1, title: 'AI가 뭐야?', lessonCount: 11 },
  { id: 'm2', number: 2, title: 'AI랑 말해보기', lessonCount: 11 },
  { id: 'm3', number: 3, title: 'AI랑 같이 배우기', lessonCount: 11 },
  { id: 'm4', number: 4, title: 'AI 안전하게 쓰기', lessonCount: 11 },
  { id: 'm5', number: 5, title: 'AI로 문제해결하기', lessonCount: 12 },
  { id: 'm6', number: 6, title: 'AI랑 일상생활', lessonCount: 12 },
];

export function getModule(id: ModuleId): ModuleMeta | undefined {
  return MODULES.find(m => m.id === id);
}

/**
 * Lesson IDs follow the pattern `<moduleId>-l<n>` (1-indexed).
 * Returns the list of lesson IDs for a module — used by the sidebar tree
 * to render placeholder dots for lessons not yet implemented.
 */
export function lessonIdsForModule(id: ModuleId): string[] {
  const m = getModule(id);
  if (!m) return [];
  return Array.from({ length: m.lessonCount }, (_, i) => `${id}-l${i + 1}`);
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/data/modules.ts src/utils/moduleThemes.ts
git commit -m "feat(m1): 6-module metadata + desaturated module color themes"
```

---

## Task 6: Web Speech API — TTS 유틸 + useSpeak 훅

**Files:**
- Create: `src/utils/tts.ts`
- Create: `src/hooks/useSpeak.ts`

- [ ] **Step 1: tts.ts 작성**

`src/utils/tts.ts`:

```ts
/** Strip markdown-ish syntax so TTS doesn't read backticks/asterisks aloud. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(stripForSpeech(text));
  u.lang = 'ko-KR';
  u.rate = opts?.rate ?? 1.0;
  u.pitch = opts?.pitch ?? 1.0;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
```

- [ ] **Step 2: useSpeak 훅**

`src/hooks/useSpeak.ts`:

```ts
import { useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import { speak as rawSpeak, stopSpeaking } from '../utils/tts';

export function useSpeak() {
  const { ttsEnabled } = useSettings();

  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    rawSpeak(text);
  }, [ttsEnabled]);

  return { speak, stop: stopSpeaking, enabled: ttsEnabled };
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/utils/tts.ts src/hooks/useSpeak.ts
git commit -m "feat(m1): Web Speech API TTS helper + useSpeak hook (settings-aware)"
```

---

## Task 7: Web Speech API — STT 유틸

**Files:**
- Create: `src/utils/stt.ts`

- [ ] **Step 1: 작성**

```ts
/**
 * Lightweight wrapper around the (non-standard) Web Speech Recognition API.
 * Caller is responsible for UI / permission handling.
 */

interface MinimalSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function isSttSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export interface SttHandle {
  stop: () => void;
}

export function startListening(opts: {
  onResult: (text: string) => void;
  onError?: (msg: string) => void;
}): SttHandle | null {
  const Ctor = (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) as SpeechRecognitionCtor | undefined;
  if (!Ctor) {
    opts.onError?.('음성 인식이 지원되지 않아요');
    return null;
  }
  const rec = new Ctor();
  rec.lang = 'ko-KR';
  rec.continuous = false;
  rec.interimResults = false;
  rec.onresult = (ev) => {
    const text = ev.results?.[0]?.[0]?.transcript ?? '';
    opts.onResult(text);
  };
  rec.onerror = (ev) => opts.onError?.(ev.error);
  try { rec.start(); } catch (err) { opts.onError?.(String(err)); return null; }
  return { stop: () => rec.stop() };
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/utils/stt.ts
git commit -m "feat(m1): Web Speech API STT helper with browser-compat shim"
```

---

## Task 8: 교사 모드 유틸

**Files:**
- Create: `src/utils/teacherMode.ts`

- [ ] **Step 1: 작성**

`src/utils/teacherMode.ts`:

```ts
import { loadTeacherMode, setTeacherMode } from './storage';

/**
 * Teacher mode rules:
 * 1. URL `?teacher=1` shows the teacher login form
 * 2. If the entered password matches `VITE_TEACHER_MODE_PASSWORD`, persist `teacherMode=1` in localStorage
 * 3. Subsequent visits without the URL flag stay in student mode
 *    — `?teacher=1` is required each time to re-enter the teacher view
 * 4. `?teacher=logout` clears the flag
 */

const ENV_PASSWORD = (import.meta.env.VITE_TEACHER_MODE_PASSWORD as string | undefined) ?? '';

export function isTeacherUrlRequested(search: string = window.location.search): boolean {
  const params = new URLSearchParams(search);
  return params.get('teacher') === '1';
}

export function isLogoutRequested(search: string = window.location.search): boolean {
  const params = new URLSearchParams(search);
  return params.get('teacher') === 'logout';
}

export function isTeacherSessionActive(): boolean {
  return loadTeacherMode();
}

export function tryUnlock(password: string): boolean {
  if (!ENV_PASSWORD) {
    // Dev convenience: when no env password is set, accept literal "teacher"
    if (password === 'teacher') { setTeacherMode(true); return true; }
    return false;
  }
  if (password === ENV_PASSWORD) { setTeacherMode(true); return true; }
  return false;
}

export function logout(): void {
  setTeacherMode(false);
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/utils/teacherMode.ts
git commit -m "feat(m1): teacher mode entry — ?teacher=1 + VITE_TEACHER_MODE_PASSWORD"
```

---

## Task 9: 학생용 사전 데이터 (초기 8 항목)

**Files:**
- Create: `src/data/studentDictionary.ts`

- [ ] **Step 1: 작성**

```ts
import type { DictionaryEntry } from '../types';

export const STUDENT_DICTIONARY: DictionaryEntry[] = [
  {
    term: '인공지능',
    aliases: ['AI', 'ai'],
    shortExplanation: '컴퓨터가 사람처럼 생각하고 답하게 만든 기술이에요.',
    example: '"오늘 날씨 어때?" 라고 물으면 답해주는 거예요.',
    ttsVersion: '인공지능은 컴퓨터가 사람처럼 생각하게 만든 거예요.',
  },
  {
    term: '컴퓨터',
    shortExplanation: '계산하고, 글이나 그림을 보여주는 기계예요.',
    ttsVersion: '컴퓨터는 계산하고 화면을 보여주는 기계예요.',
  },
  {
    term: '질문',
    shortExplanation: '모르는 걸 물어보는 말이에요.',
    example: '"이게 뭐예요?" 가 질문이에요.',
  },
  {
    term: '답',
    aliases: ['답변'],
    shortExplanation: '질문에 대해 알려주는 말이에요.',
  },
  {
    term: '안전',
    shortExplanation: '다치지 않고, 나쁜 일이 안 생기는 거예요.',
  },
  {
    term: '개인정보',
    shortExplanation: '내 이름, 나이, 집 주소처럼 나만의 정보예요. 함부로 알려주면 안 돼요.',
    ttsVersion: '개인정보는 내 이름과 집 주소처럼 나만의 정보예요. 함부로 알려주면 안 돼요.',
  },
  {
    term: '연습',
    shortExplanation: '여러 번 해보면서 잘 하게 되는 거예요.',
  },
  {
    term: '도움',
    shortExplanation: '잘 못하는 걸 누가 같이 해주는 거예요.',
  },
];

function normalize(term: string): string {
  return term.trim().toLowerCase().normalize('NFKC');
}

export function findDictionaryEntry(query: string): DictionaryEntry | null {
  const q = normalize(query);
  if (!q) return null;
  for (const entry of STUDENT_DICTIONARY) {
    if (normalize(entry.term) === q) return entry;
    if (entry.aliases?.some(a => normalize(a) === q)) return entry;
  }
  return null;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/data/studentDictionary.ts
git commit -m "feat(m1): student dictionary — 8 starter entries for demo lesson"
```

---

## Task 10: DictionaryPanel + DictionaryTerm 컴포넌트

**Files:**
- Create: `src/components/DictionaryPanel.tsx`
- Create: `src/components/DictionaryTerm.tsx`

- [ ] **Step 1: DictionaryPanel 작성**

`src/components/DictionaryPanel.tsx`:

```tsx
import { useEffect } from 'react';
import { useSpeak } from '../hooks/useSpeak';
import type { DictionaryEntry } from '../types';
import { findDictionaryEntry } from '../data/studentDictionary';

interface Props {
  open: boolean;
  query: string | null;
  onClose: () => void;
  onSearch: (q: string) => void;
}

export default function DictionaryPanel({ open, query, onClose, onSearch }: Props) {
  const { speak } = useSpeak();
  const entry: DictionaryEntry | null = query ? findDictionaryEntry(query) : null;

  useEffect(() => {
    if (open && entry) {
      speak(entry.ttsVersion ?? entry.shortExplanation);
    }
  }, [open, entry, speak]);

  if (!open) return null;

  return (
    <aside className="w-80 shrink-0 border-l border-[color:var(--border)] bg-white p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">📖 쉬운 사전</h2>
        <button
          onClick={onClose}
          aria-label="사전 닫기"
          className="h-10 w-10 rounded hover:bg-gray-100 text-xl"
        >×</button>
      </div>

      <input
        type="search"
        placeholder="단어를 검색해보세요"
        value={query ?? ''}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-3 mb-4 border-2 border-[color:var(--border)] rounded text-base"
      />

      {!query && (
        <p className="text-[color:var(--muted)]">본문에서 밑줄 친 단어를 눌러보세요.</p>
      )}

      {query && !entry && (
        <p className="text-[color:var(--muted)]">"{query}" 단어는 아직 사전에 없어요.</p>
      )}

      {entry && (
        <article>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--accent)' }}>{entry.term}</h3>
          <p className="text-lg mb-3">{entry.shortExplanation}</p>
          {entry.example && (
            <div className="mt-4 p-3 bg-[color:var(--bg)] rounded">
              <p className="text-sm font-semibold mb-1">예시</p>
              <p>{entry.example}</p>
            </div>
          )}
          <button
            onClick={() => speak(entry.ttsVersion ?? entry.shortExplanation)}
            className="mt-4 px-4 py-3 rounded font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >🔊 다시 들려줘</button>
        </article>
      )}
    </aside>
  );
}
```

- [ ] **Step 2: DictionaryTerm 작성**

`src/components/DictionaryTerm.tsx`:

```tsx
import type { ReactNode } from 'react';

interface Props {
  term: string;        // dictionary key (may differ from displayed text)
  children: ReactNode; // displayed text
  onOpen: (term: string) => void;
}

export default function DictionaryTerm({ term, children, onOpen }: Props) {
  return (
    <button
      type="button"
      className="dict-term inline-flex items-baseline bg-transparent border-0 p-0 m-0 text-inherit underline-offset-2"
      onClick={() => onOpen(term)}
      aria-label={`${term} 뜻 보기`}
    >{children}</button>
  );
}
```

- [ ] **Step 3: 커밋**

```bash
git add src/components/DictionaryPanel.tsx src/components/DictionaryTerm.tsx
git commit -m "feat(m1): DictionaryPanel + DictionaryTerm (dotted-underline term opens panel with TTS)"
```

---

## Task 11: 토글 컴포넌트 4개 (TTS / FontSize / Difficulty / DictionaryTrigger)

**Files:**
- Create: `src/components/controls/TTSToggle.tsx`
- Create: `src/components/controls/FontSizeToggle.tsx`
- Create: `src/components/controls/DifficultyToggle.tsx`
- Create: `src/components/controls/DictionaryTrigger.tsx`

- [ ] **Step 1: TTSToggle**

`src/components/controls/TTSToggle.tsx`:

```tsx
import { useSettings } from '../../context/SettingsContext';
import { stopSpeaking } from '../../utils/tts';

export default function TTSToggle() {
  const { ttsEnabled, setTTSEnabled } = useSettings();
  return (
    <button
      onClick={() => {
        const next = !ttsEnabled;
        setTTSEnabled(next);
        if (!next) stopSpeaking();
      }}
      aria-pressed={ttsEnabled}
      className="h-12 px-4 rounded border-2 font-semibold"
      style={{
        background: ttsEnabled ? 'var(--accent)' : 'white',
        color: ttsEnabled ? 'white' : 'var(--fg)',
        borderColor: 'var(--accent)',
      }}
      title="읽어주기 켜기/끄기"
    >🔊 {ttsEnabled ? '켜짐' : '꺼짐'}</button>
  );
}
```

- [ ] **Step 2: FontSizeToggle**

`src/components/controls/FontSizeToggle.tsx`:

```tsx
import { useSettings } from '../../context/SettingsContext';

export default function FontSizeToggle() {
  const { fontSize, setFontSize } = useSettings();
  return (
    <button
      onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
      className="h-12 px-4 rounded border-2 font-semibold bg-white"
      style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
      title="글자 크기"
    >Aa {fontSize === 'normal' ? '보통' : '크게'}</button>
  );
}
```

- [ ] **Step 3: DifficultyToggle**

`src/components/controls/DifficultyToggle.tsx`:

```tsx
import { useSettings } from '../../context/SettingsContext';

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(difficulty === 'normal' ? 'easy' : 'normal')}
      className="h-12 px-4 rounded border-2 font-semibold bg-white"
      style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
      title="난이도"
    >{difficulty === 'easy' ? '쉬움' : '보통'}</button>
  );
}
```

- [ ] **Step 4: DictionaryTrigger**

`src/components/controls/DictionaryTrigger.tsx`:

```tsx
interface Props {
  onClick: () => void;
}

export default function DictionaryTrigger({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="h-12 px-4 rounded border-2 font-semibold bg-white"
      style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
      title="쉬운 사전 열기"
    >📖 사전</button>
  );
}
```

- [ ] **Step 5: 커밋**

```bash
git add src/components/controls/
git commit -m "feat(m1): control toggles — TTS, FontSize, Difficulty, DictionaryTrigger"
```

---

## Task 12: TopBar

**Files:**
- Create: `src/components/TopBar.tsx`

- [ ] **Step 1: 작성**

`src/components/TopBar.tsx`:

```tsx
import TTSToggle from './controls/TTSToggle';
import FontSizeToggle from './controls/FontSizeToggle';
import DifficultyToggle from './controls/DifficultyToggle';
import DictionaryTrigger from './controls/DictionaryTrigger';

interface Props {
  crumb: string;          // e.g. "모듈 1 > AI가 뭐야?"
  onOpenDictionary: () => void;
  onGoHome: () => void;
}

export default function TopBar({ crumb, onOpenDictionary, onGoHome }: Props) {
  return (
    <header className="h-16 shrink-0 border-b border-[color:var(--border)] bg-white px-6 flex items-center gap-4">
      <button
        onClick={onGoHome}
        className="text-lg font-bold hover:underline"
        style={{ color: 'var(--accent)' }}
      >🏠 AI 교과서</button>
      <span className="text-base text-[color:var(--muted)] truncate" aria-label="현재 위치">{crumb}</span>
      <div className="ml-auto flex gap-2">
        <TTSToggle />
        <FontSizeToggle />
        <DifficultyToggle />
        <DictionaryTrigger onClick={onOpenDictionary} />
      </div>
    </header>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/TopBar.tsx
git commit -m "feat(m1): TopBar with breadcrumb + all 4 controls"
```

---

## Task 13: SidebarTree

**Files:**
- Create: `src/components/SidebarTree.tsx`

- [ ] **Step 1: 작성**

`src/components/SidebarTree.tsx`:

```tsx
import { MODULES, lessonIdsForModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import { useProgress } from '../context/ProgressContext';
import type { LessonId } from '../types';

interface Props {
  currentLessonId: LessonId | null;
  onPickLesson: (id: LessonId) => void;
}

export default function SidebarTree({ currentLessonId, onPickLesson }: Props) {
  const { isCompleted } = useProgress();

  return (
    <nav className="w-64 shrink-0 border-r border-[color:var(--border)] bg-white p-4 overflow-y-auto">
      {MODULES.map(mod => {
        const theme = themeFor(mod.id);
        const lessons = lessonIdsForModule(mod.id);
        return (
          <section key={mod.id} className="mb-5">
            <h3 className="text-sm font-bold mb-2" style={{ color: theme.accent }}>
              <span className="mr-1">{theme.emoji}</span>
              모듈 {mod.number}. {mod.title}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {lessons.map(lid => {
                const done = isCompleted(lid);
                const current = lid === currentLessonId;
                return (
                  <li key={lid}>
                    <button
                      onClick={() => onPickLesson(lid)}
                      title={lid}
                      aria-current={current ? 'page' : undefined}
                      className="h-4 w-4 rounded-full border-2 transition"
                      style={{
                        background: done ? theme.accent : current ? theme.accentSoft : 'white',
                        borderColor: theme.accent,
                        outline: current ? `2px solid ${theme.accent}` : 'none',
                        outlineOffset: '2px',
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/SidebarTree.tsx
git commit -m "feat(m1): SidebarTree — 6 modules with per-lesson progress dots"
```

---

## Task 14: ProgressDots (차시 내부 단계 진도)

**Files:**
- Create: `src/components/ProgressDots.tsx`

- [ ] **Step 1: 작성**

`src/components/ProgressDots.tsx`:

```tsx
interface Props {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex justify-center gap-2" aria-label={`${total}단계 중 ${current + 1}단계`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-3 w-3 rounded-full"
          style={{
            background: i <= current ? 'var(--accent)' : 'transparent',
            border: `2px solid var(--accent)`,
          }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/ProgressDots.tsx
git commit -m "feat(m1): ProgressDots — in-lesson step indicator"
```

---

## Task 15: ErrorMessage (학생 1줄 + 교사 기술상세)

**Files:**
- Create: `src/components/ErrorMessage.tsx`

- [ ] **Step 1: 작성**

`src/components/ErrorMessage.tsx`:

```tsx
interface Props {
  studentMessage: string;
  technicalDetail?: string;
}

export default function ErrorMessage({ studentMessage, technicalDetail }: Props) {
  return (
    <div
      role="alert"
      className="my-4 p-4 rounded border-2 border-orange-300 bg-orange-50"
    >
      <p className="text-lg font-semibold text-orange-900">⚠️ {studentMessage}</p>
      {technicalDetail && (
        <details className="mt-2">
          <summary className="text-sm text-orange-700 cursor-pointer">선생님에게: 자세한 오류</summary>
          <pre className="mt-1 text-xs text-orange-800 whitespace-pre-wrap">{technicalDetail}</pre>
        </details>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/ErrorMessage.tsx
git commit -m "feat(m1): ErrorMessage — student-friendly headline + collapsible teacher detail"
```

---

## Task 16: OXGame

**Files:**
- Create: `src/components/games/OXGame.tsx`

- [ ] **Step 1: 작성**

`src/components/games/OXGame.tsx`:

```tsx
import { useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';

export interface OXQuestion {
  question: string;
  answer: 'O' | 'X';
  feedback?: string; // optional explanation shown after answer
}

interface Props {
  questions: OXQuestion[];
  onComplete: () => void;
}

export default function OXGame({ questions, onComplete }: Props) {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<'O' | 'X' | null>(null);
  const { speak } = useSpeak();
  const q = questions[idx];
  const correct = picked !== null && picked === q.answer;

  function pick(choice: 'O' | 'X') {
    if (picked) return;
    setPicked(choice);
    const isCorrect = choice === q.answer;
    speak(isCorrect ? '정답이에요!' : '아쉬워요, 다시 생각해봐요.');
  }

  function next() {
    if (idx + 1 < questions.length) {
      setIdx(i => i + 1);
      setPicked(null);
    } else {
      onComplete();
    }
  }

  return (
    <div className="my-6">
      <p className="text-xl font-semibold mb-4">{q.question}</p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => pick('O')}
          disabled={picked !== null}
          aria-label="맞아요"
          className="h-24 w-24 rounded-full text-5xl font-bold border-4 disabled:opacity-60"
          style={{
            background: picked === 'O' ? (correct ? '#86efac' : '#fca5a5') : 'white',
            borderColor: 'var(--accent)',
          }}
        >⭕</button>
        <button
          onClick={() => pick('X')}
          disabled={picked !== null}
          aria-label="아니에요"
          className="h-24 w-24 rounded-full text-5xl font-bold border-4 disabled:opacity-60"
          style={{
            background: picked === 'X' ? (correct ? '#86efac' : '#fca5a5') : 'white',
            borderColor: 'var(--accent)',
          }}
        >❌</button>
      </div>

      {picked !== null && (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold">
            {correct ? '🎉 정답!' : `💡 정답은 ${q.answer === 'O' ? '⭕' : '❌'} 였어요.`}
          </p>
          {q.feedback && <p className="text-base mt-2">{q.feedback}</p>}
          <button
            onClick={next}
            className="mt-4 px-6 py-3 rounded font-bold text-white"
            style={{ background: 'var(--accent)' }}
          >{idx + 1 < questions.length ? '다음 ▶' : '끝내기 ✓'}</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/games/OXGame.tsx
git commit -m "feat(m1): OXGame widget — multi-question O/X with color+TTS feedback"
```

---

## Task 17: CardPick (객관식 카드 선택)

**Files:**
- Create: `src/components/games/CardPick.tsx`

- [ ] **Step 1: 작성**

`src/components/games/CardPick.tsx`:

```tsx
import { useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';

export interface CardChoice {
  label: string;
  isCorrect: boolean;
}

interface Props {
  question: string;
  choices: CardChoice[];
  onComplete: () => void;
}

export default function CardPick({ question, choices, onComplete }: Props) {
  const [pickedIdx, setPickedIdx] = useState<number | null>(null);
  const { speak } = useSpeak();

  function pick(i: number) {
    if (pickedIdx !== null) return;
    setPickedIdx(i);
    speak(choices[i].isCorrect ? '잘했어요!' : '아쉬워요, 다른 답을 골라봐요.');
  }

  const picked = pickedIdx !== null ? choices[pickedIdx] : null;

  return (
    <div className="my-6">
      <p className="text-xl font-semibold mb-4">{question}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {choices.map((c, i) => {
          const selected = i === pickedIdx;
          const bg = selected ? (c.isCorrect ? '#86efac' : '#fca5a5') : 'white';
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={pickedIdx !== null}
              className="min-h-16 p-4 rounded-lg border-4 text-lg font-semibold text-left disabled:opacity-60"
              style={{ background: bg, borderColor: 'var(--accent)' }}
            >
              {selected ? (c.isCorrect ? '✅ ' : '❌ ') : ''}{c.label}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className="mt-6 text-center">
          <p className="text-lg font-bold">
            {picked.isCorrect ? '🎉 정답!' : '💡 다시 한번 생각해봐요.'}
          </p>
          <button
            onClick={onComplete}
            className="mt-4 px-6 py-3 rounded font-bold text-white"
            style={{ background: 'var(--accent)' }}
          >다음 ▶</button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/games/CardPick.tsx
git commit -m "feat(m1): CardPick widget — multiple choice with color+TTS feedback"
```

---

## Task 18: Matching (짝맞추기)

**Files:**
- Create: `src/components/games/Matching.tsx`

- [ ] **Step 1: 작성 — 클릭 방식 (드래그 X, M1 단순화)**

`src/components/games/Matching.tsx`:

```tsx
import { useState } from 'react';
import { useSpeak } from '../../hooks/useSpeak';

export interface MatchingPair {
  left: string;
  right: string; // correct pair
}

interface Props {
  pairs: MatchingPair[];
  onComplete: () => void;
}

interface PickedState {
  leftIdx: number | null;
  rightIdx: number | null;
}

export default function Matching({ pairs, onComplete }: Props) {
  const [matched, setMatched] = useState<boolean[]>(() => pairs.map(() => false));
  const [picked, setPicked] = useState<PickedState>({ leftIdx: null, rightIdx: null });
  // shuffle right column once per mount
  const [rightOrder] = useState<number[]>(() => {
    const order = pairs.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  });
  const { speak } = useSpeak();

  function tryMatch(left: number, rightShuffleIdx: number) {
    const right = rightOrder[rightShuffleIdx];
    if (left === right) {
      setMatched(m => { const next = [...m]; next[left] = true; return next; });
      setPicked({ leftIdx: null, rightIdx: null });
      speak('잘 맞췄어요!');
      const allDone = matched.filter((_, i) => i !== left).every(Boolean);
      if (allDone) setTimeout(onComplete, 800);
    } else {
      speak('다시 골라볼까요?');
      setTimeout(() => setPicked({ leftIdx: null, rightIdx: null }), 600);
    }
  }

  function clickLeft(i: number) {
    if (matched[i]) return;
    if (picked.rightIdx !== null) {
      tryMatch(i, picked.rightIdx);
    } else {
      setPicked({ leftIdx: i, rightIdx: null });
    }
  }

  function clickRight(i: number) {
    const right = rightOrder[i];
    if (matched[right]) return;
    if (picked.leftIdx !== null) {
      tryMatch(picked.leftIdx, i);
    } else {
      setPicked({ leftIdx: null, rightIdx: i });
    }
  }

  return (
    <div className="my-6 grid grid-cols-2 gap-6">
      <div className="space-y-2">
        {pairs.map((p, i) => (
          <button
            key={p.left}
            onClick={() => clickLeft(i)}
            disabled={matched[i]}
            className="block w-full p-4 rounded-lg border-4 text-lg font-semibold disabled:opacity-50"
            style={{
              borderColor: 'var(--accent)',
              background: matched[i] ? '#86efac' : picked.leftIdx === i ? 'var(--accent)' : 'white',
              color: picked.leftIdx === i ? 'white' : 'var(--fg)',
            }}
          >{matched[i] ? '✅ ' : ''}{p.left}</button>
        ))}
      </div>
      <div className="space-y-2">
        {rightOrder.map((origIdx, shuffleIdx) => (
          <button
            key={pairs[origIdx].right}
            onClick={() => clickRight(shuffleIdx)}
            disabled={matched[origIdx]}
            className="block w-full p-4 rounded-lg border-4 text-lg font-semibold disabled:opacity-50"
            style={{
              borderColor: 'var(--accent)',
              background: matched[origIdx] ? '#86efac' : picked.rightIdx === shuffleIdx ? 'var(--accent)' : 'white',
              color: picked.rightIdx === shuffleIdx ? 'white' : 'var(--fg)',
            }}
          >{matched[origIdx] ? '✅ ' : ''}{pairs[origIdx].right}</button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/components/games/Matching.tsx
git commit -m "feat(m1): Matching widget — click-pick pairing (no drag), shuffled right column"
```

---

## Task 19: MicroLessonFrame (3단 레이아웃 오케스트레이터)

**Files:**
- Create: `src/components/MicroLessonFrame.tsx`

- [ ] **Step 1: 작성**

`src/components/MicroLessonFrame.tsx`:

```tsx
import { useState, type ReactNode } from 'react';
import SidebarTree from './SidebarTree';
import TopBar from './TopBar';
import DictionaryPanel from './DictionaryPanel';
import ProgressDots from './ProgressDots';
import type { LessonId } from '../types';

interface Props {
  lessonId: LessonId;
  crumb: string;
  totalSteps: number;
  currentStep: number;
  onPrev: () => void;
  onNext: () => void;
  onPickLesson: (id: LessonId) => void;
  onGoHome: () => void;
  children: ReactNode;
}

export default function MicroLessonFrame({
  lessonId, crumb, totalSteps, currentStep,
  onPrev, onNext, onPickLesson, onGoHome, children,
}: Props) {
  const [dictOpen, setDictOpen] = useState(false);
  const [dictQuery, setDictQuery] = useState<string | null>(null);

  function openTerm(term: string) {
    setDictQuery(term);
    setDictOpen(true);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <TopBar
        crumb={crumb}
        onOpenDictionary={() => { setDictQuery(null); setDictOpen(true); }}
        onGoHome={onGoHome}
      />
      <div className="flex flex-1 min-h-0">
        <SidebarTree currentLessonId={lessonId} onPickLesson={onPickLesson} />
        <main className="flex-1 p-8 overflow-y-auto" data-open-term={undefined}>
          {/* expose openTerm to children via a custom event */}
          <div onClickCapture={(e) => {
            const target = e.target as HTMLElement;
            const termBtn = target.closest('[data-dict-term]') as HTMLElement | null;
            if (termBtn) {
              const term = termBtn.getAttribute('data-dict-term');
              if (term) openTerm(term);
            }
          }}>
            {children}
          </div>
        </main>
        <DictionaryPanel
          open={dictOpen}
          query={dictQuery}
          onClose={() => setDictOpen(false)}
          onSearch={setDictQuery}
        />
      </div>
      <footer className="h-20 shrink-0 border-t border-[color:var(--border)] bg-white px-6 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="h-12 px-6 rounded border-2 font-semibold disabled:opacity-40"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >◀ 이전</button>
        <ProgressDots total={totalSteps} current={currentStep} />
        <button
          onClick={onNext}
          className="h-12 px-6 rounded font-semibold text-white"
          style={{ background: 'var(--accent)' }}
        >{currentStep + 1 >= totalSteps ? '끝내기 ✓' : '다음 ▶'}</button>
      </footer>
    </div>
  );
}
```

Note: child `DictionaryTerm` components emit clicks bubbling up; the orchestrator detects them via `data-dict-term` attribute. Update `DictionaryTerm.tsx` to add this attribute:

- [ ] **Step 2: Update DictionaryTerm to emit `data-dict-term`**

Replace `src/components/DictionaryTerm.tsx` with:

```tsx
import type { ReactNode } from 'react';

interface Props {
  term: string;
  children: ReactNode;
}

export default function DictionaryTerm({ term, children }: Props) {
  return (
    <button
      type="button"
      className="dict-term inline-flex items-baseline bg-transparent border-0 p-0 m-0 text-inherit underline-offset-2"
      data-dict-term={term}
      aria-label={`${term} 뜻 보기`}
    >{children}</button>
  );
}
```

(The `onOpen` prop is no longer needed — MicroLessonFrame catches the click via delegation.)

- [ ] **Step 3: 커밋**

```bash
git add src/components/MicroLessonFrame.tsx src/components/DictionaryTerm.tsx
git commit -m "feat(m1): MicroLessonFrame 3-pane shell + DictionaryTerm event delegation"
```

---

## Task 20: 데모 차시 콘텐츠

**Files:**
- Create: `src/data/demoLesson.ts`

- [ ] **Step 1: 작성**

`src/data/demoLesson.ts`:

```ts
import type { DemoLesson } from '../types';

/**
 * M1 demo lesson — exercises every infrastructure feature in one place.
 * Replaced in M2 with the full 11-lesson Module 1 content.
 */
export const DEMO_LESSON: DemoLesson = {
  id: 'm1-l1',
  moduleId: 'm1',
  title: 'AI가 뭐야?',
  bodyEasy: '인공지능은 컴퓨터가 사람처럼 생각하는 거예요.',
  bodyNormal: '인공지능(AI)은 컴퓨터가 사람처럼 생각하고 답해주게 만든 기술이에요. 우리가 묻는 질문에 답을 해줘요.',
  steps: [
    { kind: 'text', data: { showDictionaryTerms: true } },
    {
      kind: 'ox',
      data: {
        questions: [
          { question: '핸드폰의 음성비서(시리, 빅스비)는 AI일까요?', answer: 'O', feedback: '맞아요! AI가 우리 말을 알아듣고 답해줘요.' },
          { question: '냉장고는 AI일까요?', answer: 'X', feedback: '대부분의 냉장고는 그냥 차갑게 만드는 기계예요.' },
          { question: '챗봇은 AI일까요?', answer: 'O', feedback: '맞아요! 챗봇은 글로 대화하는 AI예요.' },
        ],
      },
    },
    {
      kind: 'sim-ai',
      data: {
        prompt: 'AI한테 "안녕!" 이라고 인사해봐요.',
        userInput: '안녕!',
        aiResponse: '안녕하세요! 만나서 반가워요. 오늘은 어떤 걸 배우고 싶어요?',
      },
    },
  ],
};
```

- [ ] **Step 2: 커밋**

```bash
git add src/data/demoLesson.ts
git commit -m "feat(m1): demo lesson content — exercises text/dict/OX/sim-ai in one lesson"
```

---

## Task 21: LessonView (데모 차시 렌더링)

**Files:**
- Create: `src/views/LessonView.tsx`

- [ ] **Step 1: 작성**

`src/views/LessonView.tsx`:

```tsx
import { useState } from 'react';
import MicroLessonFrame from '../components/MicroLessonFrame';
import DictionaryTerm from '../components/DictionaryTerm';
import OXGame from '../components/games/OXGame';
import type { OXQuestion } from '../components/games/OXGame';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeak } from '../hooks/useSpeak';
import { DEMO_LESSON } from '../data/demoLesson';
import { getModule } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import type { LessonId } from '../types';

interface Props {
  lessonId: LessonId;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

export default function LessonView({ lessonId, onGoHome, onPickLesson }: Props) {
  const { difficulty } = useSettings();
  const { markCompleted } = useProgress();
  const { speak } = useSpeak();
  const [step, setStep] = useState(0);
  const [simRevealed, setSimRevealed] = useState(false);

  const lesson = DEMO_LESSON; // M1: only the demo lesson exists
  const mod = getModule(lesson.moduleId)!;
  const theme = themeFor(lesson.moduleId);
  const totalSteps = lesson.steps.length;
  const currentStep = lesson.steps[step];
  const body = difficulty === 'easy' ? lesson.bodyEasy : lesson.bodyNormal;

  function handleNext() {
    if (step + 1 >= totalSteps) {
      markCompleted(lesson.id);
      onGoHome();
    } else {
      setStep(s => s + 1);
      setSimRevealed(false);
    }
  }

  function handlePrev() {
    if (step > 0) {
      setStep(s => s - 1);
      setSimRevealed(false);
    }
  }

  function renderText() {
    return (
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4" style={{ color: theme.accent }}>{lesson.title}</h1>
        <p className="text-xl leading-relaxed">
          {/* split body so we can wrap key words in DictionaryTerm */}
          {body.split('인공지능').reduce<(string | JSX.Element)[]>((acc, part, i, arr) => {
            acc.push(part);
            if (i < arr.length - 1) {
              acc.push(<DictionaryTerm key={`d-${i}`} term="인공지능">인공지능</DictionaryTerm>);
            }
            return acc;
          }, [])}
        </p>
        <button
          onClick={() => speak(body)}
          className="mt-4 px-4 py-3 rounded font-semibold text-white"
          style={{ background: theme.accent }}
        >🔊 읽어줘</button>
      </div>
    );
  }

  function renderOX() {
    const data = currentStep.data as { questions: OXQuestion[] };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.accent }}>같이 풀어봐요!</h2>
        <OXGame questions={data.questions} onComplete={handleNext} />
      </div>
    );
  }

  function renderSimAI() {
    const data = currentStep.data as { prompt: string; userInput: string; aiResponse: string };
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4" style={{ color: theme.accent }}>AI한테 인사해봐요</h2>
        <p className="text-lg mb-4">{data.prompt}</p>
        {!simRevealed ? (
          <button
            onClick={() => { setSimRevealed(true); speak(data.aiResponse); }}
            className="px-6 py-4 rounded-lg border-4 text-xl font-bold"
            style={{ borderColor: theme.accent, color: theme.accent, background: theme.accentSoft }}
          >💬 "{data.userInput}" 보내기</button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded bg-gray-100 text-right">내가: {data.userInput}</div>
            <div className="p-4 rounded text-lg" style={{ background: theme.accentSoft }}>
              <strong style={{ color: theme.accent }}>AI:</strong> {data.aiResponse}
            </div>
          </div>
        )}
      </div>
    );
  }

  let body_el: JSX.Element;
  if (currentStep.kind === 'text') body_el = renderText();
  else if (currentStep.kind === 'ox') body_el = renderOX();
  else if (currentStep.kind === 'sim-ai') body_el = renderSimAI();
  else body_el = <p>(아직 만들지 않은 단계 종류: {currentStep.kind})</p>;

  return (
    <MicroLessonFrame
      lessonId={lesson.id}
      crumb={`모듈 ${mod.number} > ${lesson.title}`}
      totalSteps={totalSteps}
      currentStep={step}
      onPrev={handlePrev}
      onNext={handleNext}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    >
      {body_el}
    </MicroLessonFrame>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/views/LessonView.tsx
git commit -m "feat(m1): LessonView — renders demo lesson text/OX/sim-AI with difficulty toggle"
```

---

## Task 22: Home view

**Files:**
- Create: `src/views/Home.tsx`

- [ ] **Step 1: 작성**

`src/views/Home.tsx`:

```tsx
import { useProgress } from '../context/ProgressContext';
import { MODULES } from '../data/modules';

interface Props {
  onStart: () => void;
}

export default function Home({ onStart }: Props) {
  const { completedLessons } = useProgress();
  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessonCount, 0);
  const doneCount = completedLessons.length;

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-5xl font-bold mb-4" style={{ color: 'var(--accent)' }}>
          AI 교과서
        </h1>
        <p className="text-xl mb-2">발달장애 학생을 위한 AI 학습</p>
        <p className="text-base text-[color:var(--muted)] mb-8">
          지금까지 <strong>{doneCount}</strong> / {totalLessons} 차시 끝났어요
        </p>
        <button
          onClick={onStart}
          className="px-8 py-4 rounded-xl text-2xl font-bold text-white shadow-lg"
          style={{ background: 'var(--accent)' }}
        >
          🚀 공부 시작!
        </button>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/views/Home.tsx
git commit -m "feat(m1): Home view — single CTA + global progress count"
```

---

## Task 23: TeacherView (스켈레톤)

**Files:**
- Create: `src/views/TeacherView.tsx`

- [ ] **Step 1: 작성**

`src/views/TeacherView.tsx`:

```tsx
import { useState } from 'react';
import { isTeacherSessionActive, tryUnlock, logout } from '../utils/teacherMode';

interface Props {
  onExit: () => void;
}

export default function TeacherView({ onExit }: Props) {
  const [active, setActive] = useState<boolean>(isTeacherSessionActive());
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (tryUnlock(password)) {
      setActive(true);
      setError(null);
    } else {
      setError('비밀번호가 맞지 않아요.');
    }
  }

  if (!active) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <form onSubmit={handleUnlock} className="max-w-sm w-full bg-white p-8 rounded-lg shadow border">
          <h1 className="text-2xl font-bold mb-4">교사 모드</h1>
          <label className="block mb-2 font-semibold">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border-2 rounded mb-4"
            autoFocus
          />
          {error && <p className="text-red-700 mb-3">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 rounded font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >들어가기</button>
          <button
            type="button"
            onClick={onExit}
            className="w-full mt-2 px-4 py-2 text-[color:var(--muted)]"
          >학생 화면으로 돌아가기</button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">교사 화면</h1>
        <div className="flex gap-2">
          <button
            onClick={onExit}
            className="px-4 py-2 rounded border-2 font-semibold"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >학생 화면으로</button>
          <button
            onClick={() => { logout(); setActive(false); }}
            className="px-4 py-2 rounded border-2 font-semibold text-red-700 border-red-300"
          >로그아웃</button>
        </div>
      </header>
      <section className="p-6 bg-white rounded-lg border">
        <p className="text-lg">교사용 설정·통계·API 키 관리는 M3 단계에서 추가됩니다.</p>
        <p className="text-sm text-[color:var(--muted)] mt-2">M1에서는 진입 동작만 검증합니다.</p>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/views/TeacherView.tsx
git commit -m "feat(m1): TeacherView skeleton — password gate + dummy admin shell"
```

---

## Task 24: App.tsx 라우터 + Providers

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`

- [ ] **Step 1: App.tsx 라우터로 교체**

`src/App.tsx`:

```tsx
import { useCallback, useEffect, useState } from 'react';
import Home from './views/Home';
import LessonView from './views/LessonView';
import TeacherView from './views/TeacherView';
import type { LessonId, ViewName } from './types';
import { isTeacherUrlRequested, isLogoutRequested, logout } from './utils/teacherMode';

function readViewFromUrl(): { view: ViewName; lessonId: LessonId | null } {
  const params = new URLSearchParams(window.location.search);
  if (isLogoutRequested()) {
    logout();
    return { view: 'home', lessonId: null };
  }
  if (isTeacherUrlRequested()) return { view: 'teacher', lessonId: null };
  const lessonId = params.get('lesson');
  if (lessonId) return { view: 'lesson', lessonId };
  return { view: 'home', lessonId: null };
}

function updateUrl(view: ViewName, lessonId: LessonId | null) {
  const url = new URL(window.location.href);
  url.searchParams.delete('lesson');
  url.searchParams.delete('teacher');
  if (view === 'lesson' && lessonId) url.searchParams.set('lesson', lessonId);
  if (view === 'teacher') url.searchParams.set('teacher', '1');
  window.history.pushState({}, '', url.toString());
}

export default function App() {
  const [state, setState] = useState(() => readViewFromUrl());

  useEffect(() => {
    const handler = () => setState(readViewFromUrl());
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  const goHome = useCallback(() => {
    setState({ view: 'home', lessonId: null });
    updateUrl('home', null);
  }, []);

  const goLesson = useCallback((id: LessonId) => {
    setState({ view: 'lesson', lessonId: id });
    updateUrl('lesson', id);
  }, []);

  if (state.view === 'teacher') return <TeacherView onExit={goHome} />;
  if (state.view === 'lesson' && state.lessonId) {
    return <LessonView lessonId={state.lessonId} onGoHome={goHome} onPickLesson={goLesson} />;
  }
  return <Home onStart={() => goLesson('m1-l1')} />;
}
```

- [ ] **Step 2: main.tsx에 Providers 추가**

`src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { ProgressProvider } from './context/ProgressContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </SettingsProvider>
  </StrictMode>
);
```

- [ ] **Step 3: 빌드 검증**

```bash
npm run build
```
Expected: `✓ built in ...` — 에러 없이 완료.

만약 타입 에러가 뜨면(예: JSX.Element import 누락) 다음 한 줄을 `src/views/LessonView.tsx` 상단에 추가:

```ts
import type { JSX } from 'react';
```

다시 빌드.

- [ ] **Step 4: 커밋**

```bash
git add src/App.tsx src/main.tsx
git commit -m "feat(m1): App router (home/lesson/teacher) + wrap with Settings/Progress providers"
```

(만약 LessonView에 JSX import 추가했으면 그것도 함께 커밋)

---

## Task 25: 수동 스모크 테스트 + 게이트 검증

**Files:**
- 변경 없음 (검증만)

- [ ] **Step 1: 로컬 dev 서버 띄우기**

```bash
npm run dev
```
브라우저로 `http://localhost:3000/AITEXTBOOKforSTUDENTS/` 열기.

- [ ] **Step 2: 게이트 체크리스트 (모두 통과해야 M1 완료)**

각 항목 직접 확인:

1. **홈** — "AI 교과서" 큰 제목, 0/68 차시 표시, "🚀 공부 시작!" 버튼
2. **차시 진입** — 버튼 클릭 → 데모 차시 (URL: `?lesson=m1-l1`)
3. **좌측 트리** — 6 모듈 표시, 각 모듈에 진도점, 모듈 1 첫 점이 현재 차시로 강조
4. **사전(클릭)** — 본문의 "인공지능"이 점선 밑줄 → 클릭 → 우측 패널 열림 + TTS 자동 낭독
5. **사전(검색)** — 상단 [📖 사전] 버튼 → 패널 열림 → "안전" 입력 → 뜻 표시
6. **TTS 토글** — 우측 상단 [🔊 켜짐] → 누르면 [🔊 꺼짐]으로 바뀜, 진행 중 음성 멈춤
7. **글자 크기 토글** — [Aa 보통] → [Aa 크게] → 즉시 본문 글자 커짐
8. **난이도 토글** — [보통] → [쉬움] → 본문 텍스트 짧아짐 (단일 문장만 남음)
9. **OX 게임** — [다음 ▶] 클릭 → OX 화면 → ⭕/❌ 선택 → 색 + 아이콘 + 음성 피드백 → [다음]
10. **시뮬레이션 AI** — [다음 ▶] → "안녕!" 보내기 카드 → 클릭 → 미리 정해진 AI 답변 + TTS
11. **차시 완료** — [끝내기 ✓] → 홈으로 돌아감 → "1/68 차시 끝났어요" 표시
12. **새로고침 진도 유지** — F5 → 진도 1차시 유지됨
13. **사이드바 트리 진도 반영** — 다시 [공부 시작] → 모듈 1 첫 점이 채워진 상태 (color: accent)
14. **교사 모드 진입** — URL을 `http://localhost:3000/AITEXTBOOKforSTUDENTS/?teacher=1`로 → 비밀번호 입력 → `.env`에 키 없으면 "teacher" 입력 → "교사 화면" 표시
15. **교사 모드 로그아웃** — [로그아웃] → 비밀번호 화면 → [학생 화면으로] → 홈으로

- [ ] **Step 3: 결과 보고**

위 15개 항목을 표로 정리, 통과/실패 표시. 실패한 항목이 있으면 수정 후 재테스트.

전부 통과 시 다음 단계로.

---

## Task 26: 최종 빌드 + 푸시 + 라이브 확인

**Files:**
- 변경 없음

- [ ] **Step 1: 최종 빌드**

```bash
npm run build
```
Expected: 에러 없음, dist 생성.

- [ ] **Step 2: 푸시 (자동 배포 트리거)**

```bash
git push
```

워크플로우 자동 시작.

- [ ] **Step 3: 워크플로우 대기 + 라이브 확인**

```bash
gh run watch $(gh run list --repo jch4825/AITEXTBOOKforSTUDENTS --limit 1 --json databaseId --jq '.[0].databaseId') --repo jch4825/AITEXTBOOKforSTUDENTS --exit-status
```

성공 후 `https://jch4825.github.io/AITEXTBOOKforSTUDENTS/` 접속 → 홈 화면이 "AI 교과서 + 공부 시작 버튼"으로 떠야 함.

- [ ] **Step 4: 결과 보고**

라이브 URL에서 Task 25 게이트 체크리스트 항목 중 핵심 4개만 재확인:
- 홈 진입
- 차시 진입 후 OX 게임 동작
- TTS 동작
- 진도 저장 (새로고침 후 유지)

---

## ✅ M1 완료 게이트

다음이 모두 통과하면 M1 완료:

1. `npm run build` 로컬 에러 없음
2. Task 25 체크리스트 15개 항목 모두 로컬에서 통과
3. GitHub Actions 워크플로우 성공
4. 라이브 URL에서 핵심 4개 항목 통과

게이트 통과 후 → **M2 (모듈 1: AI가 뭐야? — 11차시 정식 콘텐츠)** 계획 작성으로 이동.

## 후속 결정 사항

- M2 시작 전: 교사 모드 비밀번호 정책(고정 / 학교별 / 매번 다르게) 확정 필요
- M2 시작 전: 데모 차시(`demoLesson.ts`)를 정식 11차시 데이터 구조로 마이그레이션할지, 별도 신규 `lessons.ts`로 시작할지 결정
- 게임 위젯이 더 필요해질 경우(M3: 드래그 등) `@dnd-kit/core` 도입 검토
