# '어려움' 난이도 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 실제 AI 리터러시(용어·방법·정확한 한계)를 가르치는 '어려움' 난이도를 신설하고, 학습목표를 전 난이도 학생 화면에 노출한다.

**Architecture:** `Difficulty`에 `'hard'` 추가. 어려움 콘텐츠는 기존 차시 파일 무수정 원칙으로 `src/data/lessons/hard/m1~m6.ts`에 `Record<LessonId, HardLessonContent>`로 분리, `getHardContent()`로 조회하고 없으면 보통으로 폴백. LessonView가 hard일 때 4섹션 구조(개념/용어/방법/한계)를 렌더하고, 첫 text 스텝과 정리 화면에 '오늘의 목표' 카드를 표시한다.

**Tech Stack:** React 19 + TypeScript strict + Tailwind v4. 테스트 프레임워크 없음(CLAUDE.md) — 검증은 `npm run lint`(tsc), `npm run check:encoding`, 프리뷰 수동 확인.

**Spec:** `docs/superpowers/specs/2026-07-10-hard-difficulty-design.md`

**공통 규칙 (전 태스크):**
- 모든 파일 UTF-8. 커밋 전 `npm run lint && npm run check:encoding` 필수.
- 콘텐츠 집필 톤: 한 문장 한 정보, 짧고 명료, 존댓말, "~해봐요" 유아체 최소화. 용어는 정확한 실제 명칭(생성형 AI, 프롬프트, 학습 데이터…), 첫 등장 시 풀어 설명. AI 만능 묘사 금지 — limits에 환각·편향·최신성·개인정보·검증 중 해당 축 반드시 포함.
- 커밋 메시지 끝: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

---

## Task 1: 타입 확장 (Difficulty 3단 + Hard 콘텐츠 타입)

**Files:**
- Modify: `src/types.ts:1` (Difficulty) + 파일 끝에 Hard 타입 추가

- [ ] **Step 1: Difficulty에 'hard' 추가**

`src/types.ts` 1행을 다음으로 교체:

```ts
export type Difficulty = 'easy' | 'normal' | 'hard';
```

- [ ] **Step 2: 파일 끝(LessonContent 아래)에 Hard 콘텐츠 타입 추가**

```ts
/** '어려움' 레벨 — 오늘의 용어 항목. definition은 정확한 정의, example은 짧은 사용 예. */
export interface HardTerm {
  term: string;
  definition: string;
  example?: string;
}

/**
 * '어려움' 레벨 차시 콘텐츠 (spec: 2026-07-10-hard-difficulty-design.md §4).
 * 기존 LessonContent와 분리 — src/data/lessons/hard/ 모듈에 lessonId로 매핑.
 * goal은 전 난이도에서 '오늘의 목표' 카드에 쓴다 (난이도별 문장).
 */
export interface HardLessonContent {
  goal: { easy: string; normal: string; hard: string };
  concept: string[];        // 개념 문단 (2~4개)
  terms: HardTerm[];        // 오늘의 용어 (2~4개)
  method?: string[];        // 어떻게 할까요 — 수행 절차 (해당 차시만)
  limits: string;           // 꼭 기억해요 — 한계·주의
  wrapUpHard: string;       // 어려움용 정리 한 줄 (정리 화면 자동 TTS)
}
```

- [ ] **Step 3: 검증**

Run: `npm run lint`
Expected: 통과 (아직 사용처 없음 — 오류 0)

- [ ] **Step 4: 커밋**

```bash
git add src/types.ts
git commit -m "feat(types): add 'hard' difficulty + HardLessonContent schema"
```

---

## Task 2: storage — hard 파싱 + 신규 기본값 hard

**Files:**
- Modify: `src/utils/storage.ts:11-15` (DEFAULT_SETTINGS), `:46` (파싱)

- [ ] **Step 1: 기본 난이도를 hard로**

`src/utils/storage.ts` 11~15행:

```ts
const DEFAULT_SETTINGS: SettingsState = {
  difficulty: 'hard',   // 하향식 교수 흐름: 어려움에서 시작해 보통→쉬움으로 내린다 (spec §2)
  fontSize: 'normal',
  ttsEnabled: true,
};
```

- [ ] **Step 2: 파싱에 hard 허용 (기존 저장값 존중 — easy/normal 저장자는 그대로)**

46행을 다음으로 교체:

```ts
    const difficulty: Difficulty =
      parsed?.difficulty === 'easy' ? 'easy'
      : parsed?.difficulty === 'hard' ? 'hard'
      : 'normal';
```

주의: 저장값이 있는 기존 사용자는 `normal`/`easy` 그대로 유지된다. `raw`가 없을 때만 DEFAULT(hard)가 적용된다 — 스펙 §2 "기존 저장 설정은 존중".

- [ ] **Step 3: 검증**

Run: `npm run lint`
Expected: 통과

- [ ] **Step 4: 커밋**

```bash
git add src/utils/storage.ts
git commit -m "feat(settings): default difficulty 'hard' for new devices, parse 3 levels"
```

---

## Task 3: 난이도 토글 3단 순환

**Files:**
- Modify: `src/components/controls/DifficultyToggle.tsx` (전체 교체)

- [ ] **Step 1: 파일 전체를 다음으로 교체**

```tsx
import { useSettings } from '../../context/SettingsContext';
import type { Difficulty } from '../../types';

// 하향식 교수 흐름 — 어려움에서 시작, 학생 반응 보며 한 단계씩 내린다 (spec §2).
const NEXT: Record<Difficulty, Difficulty> = { hard: 'normal', normal: 'easy', easy: 'hard' };
const LABEL: Record<Difficulty, string> = { hard: '어려움', normal: '보통', easy: '쉬움' };

export default function DifficultyToggle() {
  const { difficulty, setDifficulty } = useSettings();
  return (
    <button
      onClick={() => setDifficulty(NEXT[difficulty])}
      className="btn btn-secondary px-3 flex-col gap-0"
      style={{ color: 'var(--fg)' }}
      title="난이도 바꾸기 (어려움 → 보통 → 쉬움)"
      aria-label={`난이도 바꾸기 (지금: ${LABEL[difficulty]})`}
    >
      <span className="block text-[11px] leading-none font-normal text-[color:var(--muted)]">난이도</span>
      <span className="block leading-none">{LABEL[difficulty]}</span>
    </button>
  );
}
```

- [ ] **Step 2: 검증**

Run: `npm run lint`
Expected: 통과

- [ ] **Step 3: 커밋**

```bash
git add src/components/controls/DifficultyToggle.tsx
git commit -m "feat(toggle): 3-level difficulty cycle 어려움→보통→쉬움"
```

---

## Task 4: hard 콘텐츠 모듈 스캐폴드 + 조회 함수

**Files:**
- Create: `src/data/lessons/hard/m1.ts` ~ `m6.ts` (빈 레코드), `src/data/lessons/hard/index.ts`

- [ ] **Step 1: 모듈 파일 6개 생성 (동일 패턴, m2~m6은 M1→M2… 치환)**

`src/data/lessons/hard/m1.ts`:

```ts
import type { HardLessonContent, LessonId } from '../../../types';

/** M1 어려움 콘텐츠 — 콘텐츠 집필 태스크에서 채운다 (spec §3.2 M1 용어 맵). */
export const HARD_M1: Partial<Record<LessonId, HardLessonContent>> = {};
```

m2.ts~m6.ts 동일 (`HARD_M2` … `HARD_M6`).

- [ ] **Step 2: index.ts 생성**

`src/data/lessons/hard/index.ts`:

```ts
import type { HardLessonContent, LessonId } from '../../../types';
import { HARD_M1 } from './m1';
import { HARD_M2 } from './m2';
import { HARD_M3 } from './m3';
import { HARD_M4 } from './m4';
import { HARD_M5 } from './m5';
import { HARD_M6 } from './m6';

const ALL: Partial<Record<LessonId, HardLessonContent>> = {
  ...HARD_M1, ...HARD_M2, ...HARD_M3, ...HARD_M4, ...HARD_M5, ...HARD_M6,
};

/** 어려움 콘텐츠 조회 — 없으면 undefined (호출부는 보통으로 폴백, spec §4). */
export function getHardContent(id: LessonId): HardLessonContent | undefined {
  return ALL[id];
}
```

- [ ] **Step 3: 검증**

Run: `npm run lint`
Expected: 통과

- [ ] **Step 4: 커밋**

```bash
git add src/data/lessons/hard/
git commit -m "feat(data): hard content module scaffold + getHardContent lookup"
```

---

## Task 5: 목표 카드 + 어려움 본문 컴포넌트

**Files:**
- Create: `src/components/LessonGoal.tsx`, `src/components/HardLessonBody.tsx`

- [ ] **Step 1: LessonGoal.tsx 생성 — '오늘의 목표' 카드 (종이 스티커 문법: 흰 카드 + 모듈색 테두리·립)**

```tsx
import Button from './Button';
import Icon from './Icon';
import { useSpeak } from '../hooks/useSpeak';

interface Props {
  text: string;
  accent: string;       // 모듈 테마색
  compact?: boolean;    // 정리 화면 재확인용 (체크 아이콘 + 작게)
}

/** 오늘의 목표 — 도입(제시)과 정리(재확인)에 쓰는 학습목표 카드. 전 난이도 노출 (spec §5). */
export default function LessonGoal({ text, accent, compact }: Props) {
  const { speak } = useSpeak();
  return (
    <div
      className={`card3d rounded-[var(--r-md)] flex items-center gap-3 ${compact ? 'p-3 max-w-md mx-auto' : 'p-4 my-5'}`}
      style={{
        background: 'var(--paper-0)',
        border: `2.5px solid ${accent}`,
        ['--edge' as string]: accent,
      }}
    >
      <Icon name={compact ? 'check' : 'star'} size={compact ? 20 : 24} filled={!compact} color={accent} />
      <div className="flex-1 min-w-0">
        <p className="t-label" style={{ color: accent }}>{compact ? '오늘의 목표 확인' : '오늘의 목표'}</p>
        <p className={compact ? 'text-base' : 'text-lg font-semibold'}>{text}</p>
      </div>
      <button
        onClick={() => speak(`오늘의 목표. ${text}`)}
        aria-label="목표 읽어주기"
        className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center hover:bg-[color:var(--paper-2)]"
        style={{ color: accent }}
      ><Icon name="speaker" size={20} /></button>
    </div>
  );
}
```

- [ ] **Step 2: HardLessonBody.tsx 생성 — 4섹션 렌더 (개념/용어/방법/한계)**

```tsx
import type { HardLessonContent } from '../types';
import Button from './Button';
import Icon from './Icon';
import { useSpeak } from '../hooks/useSpeak';
import { wrapDictionaryTerms } from '../views/lessonTextUtils';

interface Props {
  content: HardLessonContent;
  accent: string;
  dictionaryTerms?: string[]; // 기존 text step의 사전 점선 연동 유지
}

/** '어려움' 본문 — 개념 문단 → 오늘의 용어 카드 → 어떻게 할까요 → 꼭 기억해요 (spec §3.1). */
export default function HardLessonBody({ content, accent, dictionaryTerms = [] }: Props) {
  const { speak } = useSpeak();
  const conceptAll = content.concept.join(' ');
  return (
    <div className="space-y-6">
      {/* 개념 */}
      <section>
        {content.concept.map((para, i) => (
          <p key={i} className="t-body-lg mb-3">{wrapDictionaryTerms(para, dictionaryTerms)}</p>
        ))}
        <Button variant="secondary" accent={accent} onClick={() => speak(conceptAll)}>
          <Icon name="speaker" size={20} /> 읽어줘
        </Button>
      </section>

      {/* 오늘의 용어 */}
      <section>
        <h2 className="t-h2 mb-3" style={{ color: accent }}>오늘의 용어</h2>
        <ul className="space-y-3">
          {content.terms.map((t) => (
            <li
              key={t.term}
              className="rounded-[var(--r-md)] p-4"
              style={{ background: 'var(--paper-0)', border: '1px solid var(--line)', boxShadow: 'var(--e-1)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accent }}>{t.term}</span>
                <button
                  onClick={() => speak(`${t.term}. ${t.definition}${t.example ? ` 예를 들면, ${t.example}` : ''}`)}
                  aria-label={`${t.term} 읽어주기`}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[color:var(--paper-2)]"
                  style={{ color: accent }}
                ><Icon name="speaker" size={16} /></button>
              </div>
              <p className="mt-1">{t.definition}</p>
              {t.example && (
                <p className="mt-1 text-[color:var(--muted)]">예: {t.example}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 어떻게 할까요 */}
      {content.method && content.method.length > 0 && (
        <section>
          <h2 className="t-h2 mb-3" style={{ color: accent }}>어떻게 할까요</h2>
          <ol className="space-y-2">
            {content.method.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: accent }}
                >{i + 1}</span>
                <span className="t-body-lg">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 꼭 기억해요 — 한계·주의 (경고 톤) */}
      <section
        className="rounded-[var(--r-md)] p-4 flex items-start gap-3"
        style={{ background: 'var(--warn-bg)', border: '2px solid var(--warn)' }}
      >
        <Icon name="bulb" size={24} color="var(--warn)" />
        <div>
          <p className="t-label" style={{ color: 'var(--warn)' }}>꼭 기억해요</p>
          <p className="t-body-lg">{content.limits}</p>
        </div>
      </section>
    </div>
  );
}
```

주의: `wrapDictionaryTerms`는 현재 `LessonView.tsx` 파일 내부 함수다. Step 3에서 공용 유틸로 추출한다.

- [ ] **Step 3: wrapDictionaryTerms를 공용 유틸로 추출**

`src/views/LessonView.tsx`에서 `wrapDictionaryTerms` 함수(그리고 그것만)를 찾아 `src/views/lessonTextUtils.tsx`로 이동:

```tsx
import type { ReactNode } from 'react';
import DictionaryTerm from '../components/DictionaryTerm';

/** 본문 문자열에서 사전 등재 용어를 점선 밑줄 버튼으로 감싼다 (기존 LessonView 내부 함수 추출). */
export function wrapDictionaryTerms(text: string, terms: string[]): ReactNode {
  if (terms.length === 0) return text;
  // (기존 LessonView 구현을 그대로 옮긴다 — 로직 변경 금지)
  ...
}
```

LessonView.tsx에는 `import { wrapDictionaryTerms } from './lessonTextUtils';` 추가하고 기존 내부 정의 삭제. 기존 사용처는 그대로 동작해야 한다.

- [ ] **Step 4: 검증**

Run: `npm run lint`
Expected: 통과 (컴포넌트 미사용 경고는 TS에서 없음)

- [ ] **Step 5: 커밋**

```bash
git add src/components/LessonGoal.tsx src/components/HardLessonBody.tsx src/views/lessonTextUtils.tsx src/views/LessonView.tsx
git commit -m "feat(ui): LessonGoal card + HardLessonBody 4-section renderer"
```

---

## Task 6: LessonView 통합 — hard 분기 + 목표 카드 + 정리 재확인

**Files:**
- Modify: `src/views/LessonView.tsx:74-77` (본문 선택), `renderText()`, `renderWrapUp()`

- [ ] **Step 1: hard 콘텐츠 조회 + 본문/정리 선택 로직 교체**

`ImplementedLesson` 안 74~77행 부근을 다음으로 교체:

```tsx
  const hard = getHardContent(lesson.id);
  // 어려움인데 hard 콘텐츠가 없으면 보통으로 폴백 (spec §4 — 절대 깨지지 않음)
  const effectiveHard = difficulty === 'hard' && hard ? hard : null;
  const body =
    difficulty === 'easy' ? lesson.bodyEasy : lesson.bodyNormal;
  const wrapUpText = effectiveHard
    ? effectiveHard.wrapUpHard
    : difficulty === 'easy' ? lesson.wrapUpEasy : lesson.wrapUpNormal;
  const goalText = hard ? hard.goal[difficulty] : null; // 전 난이도 노출 (hard 데이터에서)
  const story = getLessonStory(lesson.id);
  // 스토리는 난이도와 직교 — 어려움은 introNormal 사용 (spec §5)
  const storyIntro = story ? (difficulty === 'easy' ? story.introEasy : story.introNormal) : null;
```

import 추가: `import { getHardContent } from '../data/lessons/hard';`, `import LessonGoal from '../components/LessonGoal';`, `import HardLessonBody from '../components/HardLessonBody';`

- [ ] **Step 2: renderText()에 목표 카드 + hard 본문 분기**

스토리 있는 분기의 `<div className="max-w-2xl mx-auto">` 내부를 다음으로 교체:

```tsx
          <div className="max-w-2xl mx-auto">
            {step === 0 && goalText && <LessonGoal text={goalText} accent={theme.accent} />}
            {effectiveHard ? (
              <HardLessonBody content={effectiveHard} accent={theme.accent} dictionaryTerms={terms} />
            ) : (
              <>
                <p className="t-body-lg">{wrapDictionaryTerms(body, terms)}</p>
                <Button accent={theme.accent} onClick={() => speak(body)} className="mt-4">
                  <Icon name="speaker" size={20} /> 읽어줘
                </Button>
              </>
            )}
          </div>
```

스토리 없는 예외 분기(단일 칼럼)에도 동일 패턴 적용: `<h1>` 아래에 `{step === 0 && goalText && <LessonGoal ... />}` + 본문을 `effectiveHard ? <HardLessonBody .../> : (기존)`으로.

- [ ] **Step 3: renderWrapUp()에 목표 재확인 추가**

`<p className="text-xl leading-relaxed mb-6">{wrapUpText}</p>` 바로 아래에:

```tsx
        {goalText && (
          <div className="mb-6">
            <LessonGoal text={goalText} accent={theme.accent} compact />
          </div>
        )}
```

- [ ] **Step 4: 검증 — 타입 + 폴백 수동 확인**

Run: `npm run lint && npm run check:encoding`
Expected: 통과

프리뷰(preview_start)에서:
1. `?lesson=m1-l1` 접속, 토글이 "어려움" 표시(신규 기기) — hard 콘텐츠가 아직 없으므로 **보통 본문 폴백** + 목표 카드 미표시 확인
2. 토글 3순환(어려움→보통→쉬움→어려움) 확인
3. 콘솔 에러 0

- [ ] **Step 5: 커밋**

```bash
git add src/views/LessonView.tsx
git commit -m "feat(lesson): hard-body branch, goal card at intro+wrap-up, safe fallback"
```

---

## Task 7: M1 콘텐츠 집필 (11차시) — 골드 스탠더드 포함

**Files:**
- Modify: `src/data/lessons/hard/m1.ts`
- Modify: `src/data/studentDictionary.ts` (신규 용어 등록)

- [ ] **Step 1: m1-l1 골드 스탠더드 — 아래 내용을 그대로 사용 (이후 모든 차시의 기준 톤·분량)**

```ts
export const HARD_M1: Partial<Record<LessonId, HardLessonContent>> = {
  'm1-l1': {
    goal: {
      easy: 'AI가 어디에 있는지 찾아봐요.',
      normal: '우리 생활 속에서 AI가 쓰이는 곳을 세 군데 찾아 말해요.',
      hard: '생활 속에서 인공지능이 쓰이는 예를 세 가지 이상 찾고, 인공지능이 무엇인지 한 문장으로 설명할 수 있다.',
    },
    concept: [
      '인공지능(AI)은 사람이 만든 컴퓨터 프로그램입니다. 아주 많은 자료를 배워서, 사람의 말을 알아듣고 답을 만듭니다.',
      'AI는 이미 우리 가까이에 있습니다. 휴대폰의 음성 비서, 번역 앱, 영상 추천이 모두 AI입니다.',
      '중요한 것이 있습니다. AI는 스스로 움직이지 않습니다. 사람이 시켜야 일을 합니다. AI는 도구입니다.',
    ],
    terms: [
      {
        term: '인공지능(AI)',
        definition: '사람처럼 배우고 답할 수 있게 만든 컴퓨터 프로그램.',
        example: '휴대폰에게 "내일 날씨 알려줘"라고 말하면 AI가 답해요.',
      },
      {
        term: '음성 비서',
        definition: '사람의 말소리를 알아듣고 일을 도와주는 AI. 시리, 빅스비가 있어요.',
        example: '"시리야, 알람 맞춰줘"',
      },
    ],
    method: [
      '오늘 하루 동안 내가 쓰는 물건을 떠올립니다.',
      '그중에서 말을 알아듣거나, 골라서 보여주는 것을 찾습니다.',
      '찾은 것을 "이것은 AI입니다"라고 말해 봅니다.',
    ],
    limits:
      'AI는 만능이 아닙니다. 사람이 시켜야 움직이고, 배우지 않은 것은 모릅니다. 그리고 틀린 답을 말할 때도 있습니다.',
    wrapUpHard:
      '인공지능은 많은 자료를 배워서 답을 만드는 컴퓨터 프로그램입니다. 우리 곁의 음성 비서, 번역, 추천이 모두 AI입니다.',
  },
  // ... l2~l11
};
```

- [ ] **Step 2: m1-l2 ~ m1-l11 집필 — 차시별 개요 (골드 스탠더드와 같은 구조·분량으로)**

| 차시 | 용어(terms) | method | limits 축 |
|---|---|---|---|
| l2 기계랑 AI는 뭐가 달라? | 자동화(정해진 대로만 함), 학습(배워서 새 답을 만듦) | 주변 기계를 "정해진 일만 / 배워서 답함"으로 나눠보기 | AI도 결국 프로그램 — 마법이 아님 |
| l3 AI는 어떻게 답해줄까? | 생성형 AI(새 글·그림을 만들어내는 AI), 예측(다음에 올 말을 확률로 고름) | 질문→AI가 다음 말을 이어 붙여 답을 만드는 과정 따라가기 | **환각 첫 도입** — 그럴듯하지만 틀린 답을 만들 수 있다 |
| l4 AI는 눈이 있어? | 이미지 인식(사진에서 무엇인지 알아냄), 패턴(자주 나오는 모양) | 사진 보여주기→AI가 무엇이라 답하는지 확인하기 | 잘못 알아볼 수 있다(오인식) — 확인은 사람 몫 |
| l5 AI는 귀가 있어? | 음성 인식(말소리를 글자로 바꿈), 명령어 | 또박또박 말하기→알아들었는지 화면으로 확인하기 | 시끄럽거나 발음이 뭉개지면 못 알아듣는다 |
| l6 AI는 어떻게 배울까? | 학습 데이터(AI가 배우는 자료 묶음), 훈련(데이터로 반복해 배우는 일) | 예시 많이 주기→더 잘하게 되는 흐름 살펴보기 | **편향 씨앗** — 배운 자료가 나쁘거나 치우치면 답도 치우친다 |
| l7 AI가 잘하는 것 | 요약(길게→짧게), 번역, 반복 작업 | 잘하는 일 세 가지를 골라 말하기 | 잘하는 일에도 실수는 있다 — 결과 확인 습관 |
| l8 AI가 못하는 것 | 감정(AI는 느끼지 못함), 최신 정보(배운 뒤의 일은 모름) | 못하는 일 목록 만들기 (몸으로 하는 일, 마음 느끼기, 방금 생긴 일) | **환각·최신성 강화** — 모르는 것도 아는 척 답할 수 있다. 중요한 일은 꼭 확인 |
| l9 여러 가지 AI 친구들 | 챗봇(글로 대화), 이미지 생성 AI(그림을 만듦), 추천(내가 좋아할 것을 고름) | 도구별로 "무엇을 시킬 수 있나" 짝짓기 | 도구마다 잘하는 일이 다르다 — 골라 쓰는 것도 실력 |
| l10 AI랑 놀아본 사람? | 프롬프트(AI에게 하는 부탁·질문) — M2 예고 | 인사하기→하나 물어보기→답 확인하기 | 답이 이상하면 "다시 말해줘"라고 해도 된다 |
| l11 마무리 퀴즈 | (신규 없음 — l1~l10 용어 복습: 인공지능·학습 데이터·생성형 AI·환각) | 배운 용어를 내 말로 설명해 보기 | 총정리: AI는 도구, 틀릴 수 있다, 확인은 내가 |

각 차시 goal 3버전: hard는 성취기준식("~할 수 있다"), normal은 행동 중심 한 문장, easy는 한 줄 쉬운 문장. wrapUpHard는 concept 핵심 요약 1~2문장.

- [ ] **Step 3: 신규 용어 studentDictionary.ts 등록**

M1에서 사전에 없는 용어 확인 후 추가 (예상 신규: 생성형 AI, 학습 데이터, 음성 인식, 이미지 인식, 환각, 자동화, 예측, 훈련, 패턴 — 기존 52개 목록과 대조해 중복 제외). 형식:

```ts
{
  term: '환각',
  aliases: ['할루시네이션'],
  shortExplanation: 'AI가 그럴듯하지만 틀린 답을 자신 있게 말하는 것.',
  example: 'AI가 없는 책 이름을 진짜처럼 말했어요. 그래서 꼭 확인해야 해요.',
},
```

- [ ] **Step 4: 검증**

Run: `npm run lint && npm run check:encoding`
Expected: 통과

프리뷰에서 `?lesson=m1-l1` 어려움 모드: 목표 카드(전 난이도), 4섹션(개념/용어 2개/방법 3단계/꼭 기억해요), 정리 화면 wrapUpHard + 목표 재확인, TTS 버튼 동작, 콘솔 에러 0.

- [ ] **Step 5: 커밋**

```bash
git add src/data/lessons/hard/m1.ts src/data/studentDictionary.ts
git commit -m "content(hard): M1 11차시 어려움 콘텐츠 — AI 원리·용어·한계 (환각 도입)"
```

---

## Task 8: M2 콘텐츠 집필 (11차시) — 프롬프트 엔지니어링 코어

**Files:**
- Modify: `src/data/lessons/hard/m2.ts`, `src/data/studentDictionary.ts`

- [ ] **Step 1: 차시별 집필 (Task 7 골드 스탠더드 구조·톤)**

| 차시 | 용어 | method | limits 축 |
|---|---|---|---|
| l1 잘 물어봐야 잘 답해줘 | 프롬프트(AI에게 주는 지시·질문), 지시 | 프롬프트 3요소: ①무엇을(지시) ②어떤 상황에서(맥락) ③어떤 모양으로(형식) | 프롬프트가 애매하면 답도 애매하다 — AI는 내 마음을 모른다 |
| l2 짧게 물어보기 | 간결(한 번에 하나만) | 긴 부탁을 한 문장씩 끊어 말하기 | 한 번에 여러 개를 시키면 빠뜨린다 |
| l3 궁금한 걸 콕 집어서 | 구체적(정확히 무엇인지 밝힘) | "그거" 대신 이름을 말하기, 숫자·날짜를 넣기 | 두루뭉술한 질문 → 두루뭉술한 답 |
| l4 예시를 하나 보여줘요 | 예시 제시(원하는 모양의 본보기를 먼저 줌) | "이런 식으로: (예시)" 붙여 부탁하기 | 예시가 이상하면 답도 이상해진다 |
| l5 역할을 정해줘요 | 역할 지정("너는 ~라고 하자") | "친절한 요리 선생님이라고 하자. 라면 끓이기 알려줘" | 역할을 줘도 AI는 진짜 그 사람이 아니다 |
| l6 단계를 나눠 물어보기 | 단계 나누기(큰 일→작은 순서) | 큰 질문을 1단계→2단계로 쪼개 차례로 묻기 | 순서를 건너뛰면 중간이 빈다 |
| l7 다시 물어봐도 돼요 | 반복 개선(답을 보고 고쳐 묻기) | 답 확인→모자란 점 말하기→"~는 빼고 다시" | 첫 답이 최선이 아닐 때가 많다 — 고치는 게 정상 |
| l8 답을 짧게 해달라고 | 형식 지정(길이·모양 정하기) | "세 줄로", "표로", "쉬운 말로" 붙이기 | 형식을 안 정하면 AI 마음대로 나온다 |
| l9 답이 이상하면? | 검증(맞는지 확인), 환각(복습) | 이상한 답 발견→"진짜야?"→책·어른에게 확인 | **AI는 자신 있게 틀린다** — 확인 없이 믿지 않기 |
| l10 진짜 AI랑 놀아보기 | (l1~l9 용어 실전 적용) | 3요소 프롬프트 만들기→보내기→답 평가→고쳐 묻기 | 개인정보는 프롬프트에 넣지 않는다 (M4 예고) |
| l11 마무리 퀴즈 | 프롬프트·역할 지정·반복 개선 복습 | 내가 만든 최고의 프롬프트 발표 | 총정리: 좋은 질문이 좋은 답을 만든다 |

- [ ] **Step 2: 신규 용어 사전 등록** (예상: 프롬프트(기존 여부 확인), 역할 지정, 반복 개선, 형식 지정, 검증)

- [ ] **Step 3: 검증** — `npm run lint && npm run check:encoding`, 프리뷰 m2-l1 어려움 확인

- [ ] **Step 4: 커밋**

```bash
git add src/data/lessons/hard/m2.ts src/data/studentDictionary.ts
git commit -m "content(hard): M2 11차시 — 프롬프트 3요소·역할·이터레이션·검증"
```

---

## Task 9: M3 콘텐츠 집필 (11차시) — AI와 배우기

**Files:**
- Modify: `src/data/lessons/hard/m3.ts`, `src/data/studentDictionary.ts`

- [ ] **Step 1: 차시별 집필**

| 차시 | 용어 | method | limits 축 |
|---|---|---|---|
| l1 궁금한 것 물어보기 | 열린 질문(예/아니오로 끝나지 않는 질문) | "왜?", "어떻게?"로 묻기 | 답을 그대로 외우지 말고 이해했는지 스스로 확인 |
| l2 모르는 단어는 AI에게 | 정의(뜻을 밝힌 문장) | "OO가 무슨 뜻이야? 쉬운 말로" | 사전과 AI 답을 비교해 보기 |
| l3 "쉽게 설명해줘" | 난이도 조절 지시 | "10살에게 설명하듯", "예를 들어서" | 쉬운 설명이 틀린 설명일 수도 있다 |
| l4 AI랑 낱말 공부 | 예문(단어를 넣어 만든 문장) | "OO로 예문 3개 만들어줘" | 이상한 예문은 버려도 된다 — 고르는 건 나 |
| l5 AI랑 이야기 만들기 | 창작(새로 지어내기), 아이디어 | 줄거리는 내가, 살 붙이기는 AI와 함께 | **내 생각이 먼저** — AI가 다 지어주면 내 이야기가 아니다 |
| l6 계산이 어려울 때 | 계산기, 검산(다시 확인) | 계산은 계산기, 설명은 AI — 도구 구분 | **AI는 계산 실수를 한다** — 숫자는 꼭 검산 |
| l7 긴 글을 짧게 | 요약(중요한 것만 남기기), 핵심 | "세 문장으로 요약해줘"→원문과 비교 | 요약에서 중요한 게 빠질 수 있다 |
| l8 AI랑 퀴즈 놀이 | 문제 생성 | "OO 퀴즈 3개 내줘"→풀기→답 확인 | AI가 낸 문제의 답이 틀릴 수도 있다 |
| l9 그림을 설명해줘요 | 이미지 설명(그림→글) | 그림 보여주고 "무엇이 보여?" 묻기 | 그림을 잘못 읽을 수 있다 |
| l10 복습해요 | 정리 요청 | "오늘 배운 것 3가지로 정리해줘" | 정리도 내 말로 다시 말해 봐야 내 것 |
| l11 마무리 | 요약·검증·출처 복습 | 나의 공부 도우미 사용 규칙 만들기 | **표절 금지** — AI 글을 그대로 내면 안 된다. 숙제는 내가, AI는 도우미 |

- [ ] **Step 2: 신규 용어 사전 등록** (예상: 요약, 검산, 출처, 표절, 예문)
- [ ] **Step 3: 검증** — lint·encoding·프리뷰 m3-l1
- [ ] **Step 4: 커밋** — `content(hard): M3 11차시 — 학습 도우미 활용·검증·표절 경계`

---

## Task 10: M4 콘텐츠 집필 (11차시) — 안전·윤리

**Files:**
- Modify: `src/data/lessons/hard/m4.ts`, `src/data/studentDictionary.ts`

- [ ] **Step 1: 차시별 집필**

| 차시 | 용어 | method | limits 축 |
|---|---|---|---|
| l1 AI도 틀릴 수 있어요 | **환각(정식 정의)**, 오답 | 틀린 답 발견 연습: 이상한 점 찾기 | AI는 틀려도 사과하며 또 그럴듯하게 말한다 |
| l2 진짜일까? 확인해봐요 | 사실 확인(팩트체크), 출처(어디서 온 정보인지) | ①다른 곳과 비교 ②출처 묻기 ③어른께 확인 | 인터넷·AI 답 모두 출처 없이 믿지 않기 |
| l3 내 정보는 소중해요 | 개인정보(이름·주소·전화·학교…) | 프롬프트에 넣으면 안 되는 것 체크리스트 | 한 번 보낸 정보는 지우기 어렵다 |
| l4 비밀번호는 비밀! | 비밀번호, 계정 | 비밀번호를 묻는 것에는 답하지 않기 | AI·사람 누구에게도 비밀번호는 말하지 않는다 |
| l5 사진을 함부로 보내지 않아요 | 초상권(내 얼굴에 대한 권리) | 사진 보내기 전 3초 멈춤: 누가 볼 수 있나? | 사진에는 생각보다 많은 정보가 있다(장소·얼굴) |
| l6 기분 나쁜 말을 만나면 | 유해 콘텐츠, 신고 | ①보지 않기 ②캡처 ③어른·신고 버튼 | AI도 가끔 나쁜 말을 만들 수 있다 — 내 잘못이 아니다 |
| l7 고운 말로 물어봐요 | 예절 | 부탁하는 말투 연습 | **AI는 감정이 없다** — 그래도 고운 말은 나를 위한 연습 |
| l8 너무 오래 쓰지 않아요 | 과의존, 사용 시간 | 시간 정하기→알람→끝나면 끄기 | 추천은 계속 보게 만들도록 설계되어 있다 |
| l9 이상하면 어른에게 | 도움 요청 | ①멈춘다 ②화면을 남긴다 ③어른에게 보여준다 | 혼자 해결하지 않아도 된다 |
| l10 광고와 진짜를 구별해요 | 광고, **추천 알고리즘**(내가 좋아할 것을 골라 보여주는 AI) | "이건 광고인가?" 표시 찾기 | 추천이 항상 나에게 좋은 것은 아니다 |
| l11 안전 약속 (마무리) | 개인정보·환각·신고 복습 | 우리 반 AI 안전 약속 5개 만들기 | 총정리: 확인하고, 지키고, 알린다 |

- [ ] **Step 2: 신규 용어 사전 등록** (예상: 환각(중복 확인), 개인정보, 초상권, 추천 알고리즘, 출처, 신고)
- [ ] **Step 3: 검증** — lint·encoding·프리뷰 m4-l1
- [ ] **Step 4: 커밋** — `content(hard): M4 11차시 — 환각·개인정보·딥페이크류 안전 축`

---

## Task 11: M5 콘텐츠 집필 (12차시) — 문제해결

**Files:**
- Modify: `src/data/lessons/hard/m5.ts`, `src/data/studentDictionary.ts`

- [ ] **Step 1: 차시별 집필**

| 차시 | 용어 | method | limits 축 |
|---|---|---|---|
| l1 문제가 뭐예요? | 문제(바라는 것과 지금이 다른 것), 목표 | "지금은 ~. 바라는 건 ~"로 말하기 | **목표는 내가 정한다** — AI는 대신 정해주지 않는다 |
| l2 문제를 작게 나눠요 | 분해(큰 것→작은 것들) | 큰 문제를 3개의 작은 일로 나누기 | 나누지 않으면 어디서 막혔는지 모른다 |
| l3 순서대로 생각해요 | 순서(차례), 절차 | 작은 일들을 먼저→나중으로 줄 세우기 | 순서가 틀리면 결과도 틀린다 |
| l4 무엇부터 할까요? | 우선순위(더 중요한 것 먼저) | "지금 꼭 필요한 것 하나" 고르기 | 다 중요하면 아무것도 못 한다 |
| l5 힌트를 달라고 해요 | 힌트(살짝 도와주는 정보) | "답 말고 힌트만 줘"라고 부탁하기 | 답을 통째로 받으면 배우지 못한다 |
| l6 못 알아들으면 다시 | 명확화(더 분명하게 다시 말함) | AI가 딴소리하면: 내 말을 더 구체적으로 | 못 알아듣는 건 보통 질문이 애매해서다 |
| l7 한 단계씩 부탁해요 | 단계별 지시 | "1단계만 알려줘. 끝나면 다음" | 한꺼번에 받으면 따라가기 어렵다 |
| l8 답이 맞는지 확인해요 | 평가(좋은지 따져보기), 검증 | 결과를 목표와 비교하기: 바라던 것이 됐나? | AI의 "다 됐어요"를 그대로 믿지 않기 |
| l9 다른 방법도 있어요 | 대안(다른 길) | "다른 방법 두 가지 더 알려줘" | 첫 방법이 최선이 아닐 수 있다 |
| l10 실수해도 괜찮아요 | 오류(잘못된 부분), 수정 | 틀린 곳 찾기→고치기→다시 해보기 | 실수는 정보다 — AI도 사람도 고치며 배운다 |
| l11 라면 끓이기 대작전 | (l1~l10 종합) | 분해→순서→단계별 부탁→검증 전 과정 실습 | 위험한 일(불·칼)은 어른과 함께 |
| l12 마무리 | 분해·우선순위·검증 복습 | 나의 문제해결 4단계 카드 만들기 | 총정리: 나누고, 줄 세우고, 확인한다 |

- [ ] **Step 2: 신규 용어 사전 등록** (예상: 분해, 우선순위, 대안, 오류, 절차)
- [ ] **Step 3: 검증** — lint·encoding·프리뷰 m5-l1
- [ ] **Step 4: 커밋** — `content(hard): M5 12차시 — 분해·순서·검증의 문제해결 사고`

---

## Task 12: M6 콘텐츠 집필 (12차시) — 일상생활

**Files:**
- Modify: `src/data/lessons/hard/m6.ts`, `src/data/studentDictionary.ts`

- [ ] **Step 1: 차시별 집필**

| 차시 | 용어 | method | limits 축 |
|---|---|---|---|
| l1 마트에서 장보기 | 목록(리스트) | "카레 재료 목록 만들어줘"→빠진 것 내가 확인 | 우리 집 냉장고 사정은 AI가 모른다 |
| l2 얼마예요? 돈 계산 | 예산(쓸 수 있는 돈), 검산 | 계산 부탁→계산기로 검산 | **돈 계산은 반드시 검산** — AI는 계산 실수를 한다 |
| l3 길을 찾아요 | 지도 앱, 위치 정보 | 목적지 말하기→경로 확인→출발 | **위치 정보 주의** — 내 위치를 아무에게나 알리지 않는다 |
| l4 버스와 지하철 타기 | 실시간 정보(지금 이 순간의 정보) | 도착 시간 확인→여유 있게 이동 | 실시간 정보도 틀릴 수 있다 — 안내판도 함께 보기 |
| l5 오늘 날씨와 옷차림 | 예보(미리 알려주는 예측) | 날씨 확인→옷차림 추천 받기→내가 결정 | 예보는 예측이다 — 100% 맞지 않는다 |
| l6 요리 도우미 AI | 조리법(레시피), 절차 | 단계별로 받기→한 단계씩 완료 | 불·칼은 어른과 함께. AI는 옆에서 못 도와준다 |
| l7 하루 계획 세우기 | 루틴(매일 반복하는 순서), 알림 | 할 일 목록→순서 정하기→알림 맞추기 | 계획을 지키는 건 나 — 알림은 도구일 뿐 |
| l8 아플 때는 어떻게? | 증상, 응급 | 증상을 말로 정리→**어른·병원이 먼저**, AI는 참고만 | **AI는 의사가 아니다** — 아프면 사람에게 먼저 |
| l9 인사와 부탁의 말 | 소통, 상황에 맞는 말 | 상황별 인사·부탁 연습 문장 만들어 연습 | 진짜 마음은 내가 담는다 |
| l10 여러 가지 직업 구경 | 직업, 자동화와 일 | 궁금한 직업 묻기→하는 일·필요한 준비 알아보기 | AI가 바꾸는 직업도, 새로 생기는 직업도 있다 |
| l11 나를 소개해요 | 자기소개, 퇴고(고쳐 쓰기) | 내가 초안→AI에게 고칠 점 묻기→내가 고침 | 소개 글에 개인정보(집 주소·전화)는 넣지 않는다 |
| l12 마무리 | 검산·위치 정보·응급 복습 | 나의 AI 생활 수칙 만들기 | 총정리: AI는 생활 도우미, 마지막 결정은 나 |

- [ ] **Step 2: 신규 용어 사전 등록** (예상: 실시간 정보, 예보, 루틴, 위치 정보, 검산(중복 확인))
- [ ] **Step 3: 검증** — lint·encoding·프리뷰 m6-l1
- [ ] **Step 4: 커밋** — `content(hard): M6 12차시 — 생활 도구 활용과 최종 결정권`

---

## Task 13: 최종 검증 + 문서 갱신

**Files:**
- Modify: `CLAUDE.md` (Lesson 스키마 설명 + 마일스톤)

- [ ] **Step 1: 전체 검증**

```bash
npm run lint && npm run check:encoding && npm run build
```
Expected: 모두 통과

프리뷰 최종 확인 체크리스트:
1. 신규 기기(localStorage 클리어) → 기본 난이도 "어려움"
2. 어려움: m1~m6 각 첫 차시에서 4섹션 + 목표 카드 렌더
3. 보통·쉬움: 기존 본문 + 목표 카드(hard 데이터의 goal.normal/easy)
4. 정리 화면: wrapUpHard(어려움) / 기존(보통·쉬움) + 목표 재확인 카드
5. 사전 점선: 어려움 본문에서도 동작
6. 콘솔 에러 0

- [ ] **Step 2: CLAUDE.md 갱신**

- Lesson 스키마 절에 추가: "어려움 레벨은 `src/data/lessons/hard/`의 `HardLessonContent`(goal 3버전·concept·terms·method·limits·wrapUpHard). 새 차시 추가 시 hard 콘텐츠도 함께 집필. 신규 용어는 studentDictionary 등록."
- 난이도 설명 갱신: "Difficulty 3단(hard 기본, 어려움→보통→쉬움 하향 순환)"
- 마일스톤에 한 줄: "어려움 난이도(실전 AI 리터러시 레벨) 68차시 + 학습목표 전 난이도 노출 (2026-07-10)"

- [ ] **Step 3: 커밋·푸시**

```bash
git add CLAUDE.md
git commit -m "docs: hard difficulty milestone + schema guide"
git push origin main
```

---

## Self-Review 결과

- **스펙 커버리지**: §2 결정 5건 → Task 1~6(인프라)·7~12(전량 집필); §3 교육 프레임 → Task 5 렌더 + 7~12 개요 표; §5 UI 6항목 → Task 3(토글)·5(카드·본문)·6(통합·폴백·정리); §7 검증 → 각 태스크 Step + Task 13. 게임/스토리 introHard 제외(§8) 반영 — 누락 없음.
- **Placeholder 스캔**: 코드 태스크는 전량 실코드. 콘텐츠 태스크(8~12)는 차시별 용어·method·limits 개요 표가 실제 집필 결정을 담음 — 집필 자체가 산출물이므로 개요+골드 스탠더드(Task 7 m1-l1 전문) 방식. "TBD" 없음.
- **타입 일관성**: `HardLessonContent`/`HardTerm`/`getHardContent`/`goal[difficulty]` 명칭 Task 1·4·5·6 간 일치 확인. `wrapDictionaryTerms` 추출(Task 5 Step 3)과 Task 6 사용처 일치.
