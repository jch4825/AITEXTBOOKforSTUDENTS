# 교육 프로젝트 업그레이드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 차시 스키마에 교육 설계 요소(학습목표·성취기준·정리)를 도입하고 모듈 3~6 콘텐츠 46차시를 작성하여 68차시 교과서를 완성한다.

**Architecture:** 콘텐츠는 `src/data/lessons/m{n}.ts` 데이터 파일, 렌더링은 기존 `LessonView` 단일 경로. 스키마 확장(필수 필드)으로 모든 차시가 목표·정리를 갖추도록 컴파일 타임에 강제. 신규 UI는 정리 화면(가상 최종 step), Sequence 게임 위젯, TeacherView 패널 2개.

**Tech Stack:** React 19 + TypeScript strict + Vite. 테스트 프레임워크 없음(프로젝트 정책) — 검증은 `npm run lint`(tsc), `npm run check:encoding`, `npm run build`, dev 서버 스모크 테스트.

**Spec:** `docs/superpowers/specs/2026-07-06-education-upgrade-design.md`

---

## 검증된 성취기준 풀 (special-edu-curriculum-finder 스킬로 조회, 원문 그대로)

- `[9정통01-01]` 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.
- `[9정통01-02]` 다양한 정보통신 기기의 종류를 알고, 기본 기능을 익힌다.
- `[9정통01-04]` 필요한 정보를 수집하고, 타인과 정보를 주고받는다.
- `[9정통02-02]` 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.
- `[9정통02-03]` 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.
- `[9정통02-04]` 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.
- `[9정통03-01]` 디지털 공간에서 올바른 예절을 익혀 실천한다.
- `[9정통03-02]` 개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.
- `[9정통03-03]` 가정생활에서 디지털 기술이 적용된 사례를 살펴보고 경험한다.
- `[12정통02-03]` 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.
- `[12정통02-04]` 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.
- `[12정통03-01]` 디지털 윤리를 이해하고, 디지털 공간에서 타인을 존중하고 배려하는 태도를 기른다.
- `[12정통03-02]` 디지털 중독 및 디지털 범죄 사례를 살펴보고, 예방하는 방법을 실천한다.
- `[12정통03-04]` 디지털 사회에서의 다양한 직업을 탐색하고 체험한다.
- `[4국어01-03]` 자신과 관련된 간단한 질문에 대답한다.
- `[6국어01-04]` 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.
- `[6국어01-05]` 바르고 고운 말을 사용하여 대화한다.
- `[9국어01-04]` 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.
- `[9진로01-02]` 흥미, 적성, 장점과 단점, 성격 등 자신의 특성을 파악하여 자신을 소개한다.
- `[9진로02-02]` 직업의 세계에 관심을 가지고 가족, 이웃 등 주변 사람들의 직업에 대하여 탐색한다.
- `[9진로03-01]` 직군별 작업 과정의 순서를 익힌다.
- `[12진로04-03]` 집에서 직장까지 교통 수단을 활용하여 이동한다.
- `[9수학01-14]` 대용 화폐를 활용하여 상품을 교환한다.
- `[12수학01-14]` 실생활의 다양한 상황에서 필요한 화폐를 활용한다.
- `[6사회01-02]` 일상생활에서 활동이나 물건을 선택하고 나의 선택을 중요하게 여기는 태도를 기른다.
- `[9보건04-03]` 교통사고의 위험 요인을 알고 사고 예방을 위한 안전 수칙을 실천한다.

**규칙:** `standards` 필드에는 위 풀에 있는 코드만, `"[코드] 원문"` 형식으로 넣는다. 임의 창작 금지.

---

## 콘텐츠 공통 스타일 규칙 (모든 콘텐츠 태스크에 적용)

- 문체: 기존 m1/m2와 동일 — 해요체, 짧은 문장, 초등 저학년 어휘 (bodyEasy), 초등 고학년~중학생 어휘 (bodyNormal).
- bodyEasy 1문장, bodyNormal 1~2문장.
- `objective`: "~할 수 있다" 형식 1문장 (교사용, 학생 비노출).
- `wrapUpEasy`/`wrapUpNormal`: "오늘 배운 것" 정리 1문장, TTS로 자연스럽게 읽히는 문장.
- 각 차시 steps: `text` 1개(도입, dictionaryTerms + imagePlaceholder) → 게임 2~3개 → sim-ai 또는 real-ai 0~1개. 총 4~6 steps.
- OX 질문 2~3개, CardPick 선택지 4개(정답 1), Matching 3쌍, Sequence 3~4장.
- 오답 피드백은 절대 비난하지 않음 ("괜찮아요", "다시 생각해봐요").
- real-ai step은 반드시 `fallbackResponse` 포함 (키 없는 교실 대응).
- 신출 어휘는 `dictionaryTerms`에 넣고 Task 9에서 사전에 등록.

---

### Task 1: 스키마 확장 + 정리 화면 + m1/m2 소급 (원자적 1커밋)

**Files:**
- Modify: `src/types.ts`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/data/lessons/m1.ts` (11차시 소급)
- Modify: `src/data/lessons/m2.ts` (11차시 소급)

- [ ] **Step 1.1: types.ts 확장**

```ts
// LessonStepKind에 'sequence' 추가
export type LessonStepKind = 'text' | 'ox' | 'card-pick' | 'matching' | 'sequence' | 'sim-ai' | 'real-ai';

// LessonContent에 필수/선택 필드 추가
export interface LessonContent {
  id: LessonId;
  moduleId: ModuleId;
  number: number;
  title: string;
  kind: LessonKind;
  /** 교사용 학습목표 — "~할 수 있다" 형식. 학생 화면 비노출. */
  objective: string;
  /** 2022 개정 특수교육 기본교육과정 성취기준 — "[코드] 원문" 형식. */
  standards?: string[];
  bodyEasy: string;
  bodyNormal: string;
  /** 차시 정리 한 줄 — 마지막 정리 화면에 표시 + TTS. */
  wrapUpEasy: string;
  wrapUpNormal: string;
  steps: LessonStep[];
}
```

- [ ] **Step 1.2: LessonView에 정리(wrap-up) 가상 최종 단계**

`ImplementedLesson`에서:
- `totalSteps = lesson.steps.length + 1`
- `const isWrapUp = step === lesson.steps.length;`
- `handleNext`: `if (step + 1 > lesson.steps.length) { markCompleted(lesson.id); onGoHome(); } else { setStep(...); }`
- 정리 화면 렌더 (isWrapUp일 때):

```tsx
function renderWrapUp() {
  const text = difficulty === 'easy' ? lesson.wrapUpEasy : lesson.wrapUpNormal;
  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <div className="text-5xl mb-4" aria-hidden>🌟</div>
      <h2 className="text-2xl font-bold mb-4" style={{ color: theme.accent }}>오늘 배운 것</h2>
      <p className="text-xl leading-relaxed mb-6">{text}</p>
      <button onClick={() => speak(text)} /* 🔊 읽어줘 — 기존 renderText와 동일 스타일 */ />
      <button onClick={handleNext} /* 🎉 다 했어요! — theme.accent 배경, 큰 버튼 */ />
    </div>
  );
}
```

- 정리 화면 진입 시 자동 TTS 1회 (`useEffect`, `isWrapUp` 의존).

- [ ] **Step 1.3: m1.ts 11차시에 objective/standards/wrapUp 소급**

각 차시에 3필드 추가. 예 (m1-l1):

```ts
objective: '생활 속에서 AI가 쓰이는 물건을 찾아 말할 수 있다.',
standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
wrapUpEasy: 'AI는 우리 곁에 있어요. 말을 알아듣고 대답해줘요.',
wrapUpNormal: '오늘은 AI가 우리 곁 어디에 있는지 배웠어요. AI는 우리 말을 알아듣고 대답해주는 기술이에요.',
```

m1 전 차시 주 연계: `[9정통02-04]`(사례 탐색), `[9정통01-02]`(기기), `[9정통01-01]`(정보) 중 차시 내용에 맞게 1~2개.

- [ ] **Step 1.4: m2.ts 11차시 소급** — 주 연계: `[6국어01-04]`, `[9국어01-04]`(질문·대화), `[9정통01-04]`(정보 주고받기), `[6국어01-05]`(고운 말).

- [ ] **Step 1.5: 검증** — Run: `npm run lint` → PASS, `npm run check:encoding` → PASS

- [ ] **Step 1.6: Commit** — `feat(edu): lesson schema gains objective/standards/wrapUp + wrap-up screen + m1/m2 retrofit`

---

### Task 2: Sequence 게임 위젯

**Files:**
- Create: `src/components/games/Sequence.tsx`
- Modify: `src/views/LessonView.tsx` (렌더 분기 추가)

- [ ] **Step 2.1: Sequence.tsx 작성** — 인터페이스:

```ts
export interface SequenceItem { label: string; }
interface Props {
  instruction: string;          // 예: "라면 끓이는 순서대로 눌러봐요"
  items: SequenceItem[];        // 정답 순서대로 전달, 컴포넌트가 셔플해 표시
  onComplete: () => void;
}
```

동작: 카드를 셔플해 버튼 그리드로 표시. 학생이 "다음이라고 생각하는 카드"를 클릭 → 맞으면 카드가 위쪽 번호 슬롯(1., 2., …)으로 이동 + 초록 + TTS("맞아요!") / 틀리면 카드 흔들림 + 주황 + TTS("다시 생각해봐요"). 전부 맞추면 축하 문구 + [다음] 활성화(onComplete). 클릭 전용(드래그 없음), 최소 터치 영역 64px, 색+아이콘+TTS 3중 피드백 — OXGame/Matching과 동일 관례. 셔플이 우연히 정답 순서와 같으면 1회 재셔플.

- [ ] **Step 2.2: LessonView 분기** — `renderSequence()` 추가, `data as { instruction: string; items: { label: string }[] }`.

- [ ] **Step 2.3: 검증** — `npm run lint` → PASS

- [ ] **Step 2.4: Commit** — `feat(edu): Sequence game widget (click-to-order, no drag)`

---

### Task 3: 모듈 3 — AI랑 같이 배우기 (11차시)

**Files:**
- Create: `src/data/lessons/m3.ts` (`M3_LESSONS` export)
- Modify: `src/data/lessons/index.ts` (`...M3_LESSONS` 추가)

차시 블루프린트 (id | 제목 | kind | 핵심 step | 주 성취기준):

| id | 제목 | kind | 핵심 step | standards |
|---|---|---|---|---|
| m3-l1 | AI에게 궁금한 것 물어보기 | experience | text, ox, card-pick, **real-ai**(자유입력) | 9정통02-02 |
| m3-l2 | 모르는 단어는 AI에게 | activity | text, card-pick, matching, sim-ai | 6국어01-04 |
| m3-l3 | "쉽게 설명해줘"라고 말해요 | activity | text, ox, card-pick, sim-ai | 6국어01-04 |
| m3-l4 | AI랑 낱말 공부 | activity | text, matching, ox, sim-ai | 6국어01-04 |
| m3-l5 | AI랑 이야기 만들기 | experience | text, card-pick, **real-ai** | 9정통01-04 |
| m3-l6 | 계산이 어려울 때 | activity | text, ox, card-pick, sim-ai | 12수학01-14 |
| m3-l7 | 긴 글을 짧게 줄여줘요 | concept | text, ox, card-pick, sim-ai | 9정통02-02 |
| m3-l8 | AI랑 퀴즈 놀이 | activity | text, ox, matching, sim-ai | 9정통01-04 |
| m3-l9 | 그림을 설명해줘요 | concept | text, card-pick, ox, sim-ai | 9정통01-01 |
| m3-l10 | 오늘 배운 것을 AI랑 복습해요 | experience | text, ox, **real-ai**(자유입력) | 9정통02-02 |
| m3-l11 | 나만의 공부 도우미 | concept | text, matching, card-pick, sim-ai | 12정통02-04 |

- [ ] **Step 3.1: m3.ts 작성** — 공통 스타일 규칙 준수, 각 차시 objective/standards/wrapUp 포함
- [ ] **Step 3.2: index.ts에 M3_LESSONS 등록**
- [ ] **Step 3.3: 검증** — `npm run lint` && `npm run check:encoding` → PASS
- [ ] **Step 3.4: Commit** — `feat(m4-milestone): module 3 (AI랑 같이 배우기) — 11 lessons`

---

### Task 4: 모듈 4 — AI 안전하게 쓰기 (11차시)

**Files:**
- Create: `src/data/lessons/m4.ts` / Modify: `src/data/lessons/index.ts`

전부 시뮬레이션·게임 (real-ai 0 — 안전 주제는 통제된 사례로만).

| id | 제목 | kind | 핵심 step | standards |
|---|---|---|---|---|
| m4-l1 | AI도 틀릴 수 있어요 | concept | text, sim-ai(틀린 답 사례), ox, card-pick | 9정통02-04 |
| m4-l2 | 진짜일까? 확인해봐요 | activity | text, sim-ai, ox, card-pick | 9정통01-01 |
| m4-l3 | 내 정보는 소중해요 | concept | text, ox, card-pick, matching | 9정통03-02 |
| m4-l4 | 비밀번호는 비밀! | activity | text, ox, card-pick | 9정통03-02 |
| m4-l5 | 사진을 함부로 보내지 않아요 | concept | text, sim-ai, ox, card-pick | 9정통03-02 |
| m4-l6 | 기분 나쁜 말을 만나면 | activity | text, sim-ai, card-pick, ox | 9정통03-01 |
| m4-l7 | 고운 말로 물어봐요 | activity | text, card-pick, matching | 6국어01-05, 9정통03-01 |
| m4-l8 | 너무 오래 쓰지 않아요 | concept | text, ox, card-pick, sequence(사용 순서: 하기 전 약속→쓰기→끄기→다른 놀이) | 12정통03-02 |
| m4-l9 | 이상하면 어른에게 알려요 | activity | text, sim-ai, card-pick, ox | 12정통03-02 |
| m4-l10 | 광고와 진짜를 구별해요 | concept | text, ox, card-pick | 9정통01-01 |
| m4-l11 | 우리의 안전 약속 | concept | text, matching, ox, card-pick | 12정통03-01 |

- [ ] Step 4.1~4.4: Task 3과 동일 절차. Commit — `feat(m5-milestone): module 4 (AI 안전하게 쓰기) — 11 lessons`

---

### Task 5: 모듈 5 — AI로 문제해결하기 (12차시)

**Files:**
- Create: `src/data/lessons/m5.ts` / Modify: `src/data/lessons/index.ts`

주 연계 `[9정통02-03]`(순차·선택·반복), `[12정통02-03]`(문제 해결 절차). Sequence 위젯 적극 사용.

| id | 제목 | kind | 핵심 step | standards |
|---|---|---|---|---|
| m5-l1 | 문제가 뭐예요? | concept | text, ox, card-pick | 12정통02-03 |
| m5-l2 | 문제를 작게 나눠요 | concept | text, card-pick, sequence | 12정통02-03 |
| m5-l3 | 순서대로 생각해요 | activity | text, sequence(아침 준비), ox | 9정통02-03 |
| m5-l4 | 무엇부터 할까요? | activity | text, card-pick, sequence | 9정통02-03 |
| m5-l5 | AI에게 힌트를 달라고 해요 | activity | text, sim-ai, card-pick | 9정통02-02 |
| m5-l6 | 못 알아들으면 다시 물어봐요 | experience | text, sim-ai, **real-ai**(자유입력) | 9국어01-04 |
| m5-l7 | 한 단계씩 부탁해요 | activity | text, sim-ai, sequence | 9정통02-03 |
| m5-l8 | 답이 맞는지 확인해요 | concept | text, ox, sim-ai, card-pick | 12정통02-03 |
| m5-l9 | 다른 방법도 있어요 | concept | text, card-pick, matching | 12정통02-03 |
| m5-l10 | 실수해도 괜찮아요 | concept | text, ox, sim-ai | 12정통02-03 |
| m5-l11 | 라면 끓이기 대작전 | experience | text, sequence(조리 순서), sim-ai, ox | 9정통02-03, 9진로03-01 |
| m5-l12 | 나는 문제 해결사! | concept | text, matching, sequence, card-pick | 12정통02-03 |

- [ ] Step 5.1~5.4: 동일 절차. Commit — `feat(m6-milestone): module 5 (AI로 문제해결하기) — 12 lessons`

---

### Task 6: 모듈 6 — AI랑 일상생활 (12차시)

**Files:**
- Create: `src/data/lessons/m6.ts` / Modify: `src/data/lessons/index.ts`

| id | 제목 | kind | 핵심 step | standards |
|---|---|---|---|---|
| m6-l1 | 마트에서 장보기 | activity | text, card-pick, sim-ai, sequence(장보기 순서) | 6사회01-02 |
| m6-l2 | 얼마예요? 돈 계산 | activity | text, ox, sim-ai, card-pick | 9수학01-14, 12수학01-14 |
| m6-l3 | 길을 찾아요 | activity | text, sim-ai, card-pick | 12진로04-03 |
| m6-l4 | 버스와 지하철 타기 | activity | text, sequence(버스 타는 순서), sim-ai, ox | 12진로04-03, 9보건04-03 |
| m6-l5 | 오늘 날씨와 옷차림 | experience | text, card-pick, **real-ai** | 12정통02-04 |
| m6-l6 | 요리 도우미 AI | activity | text, sequence(샌드위치 만들기), sim-ai | 9정통03-03 |
| m6-l7 | 하루 계획 세우기 | activity | text, sequence(하루 일과), sim-ai, ox | 12정통02-04 |
| m6-l8 | 아플 때는 어떻게? | concept | text, ox, sim-ai, card-pick | 12정통02-04 |
| m6-l9 | 인사와 부탁의 말 | activity | text, matching, sim-ai, card-pick | 9국어01-04 |
| m6-l10 | 여러 가지 직업 구경 | concept | text, matching, card-pick, sim-ai | 9진로02-02, 12정통03-04 |
| m6-l11 | 나를 소개해요 | experience | text, card-pick, **real-ai**(자유입력) | 9진로01-02 |
| m6-l12 | AI와 함께하는 나의 생활 | concept | text, ox, matching, sim-ai | 12정통02-04 |

- [ ] Step 6.1~6.4: 동일 절차. Commit — `feat(m7-milestone): module 6 (AI랑 일상생활) — 12 lessons`

---

### Task 7: 쉬운 사전 확충 (15 → 50+)

**Files:**
- Modify: `src/data/studentDictionary.ts`

- [ ] **Step 7.1:** 모듈 3~6에서 `dictionaryTerms`로 지정한 어휘 전수 조사 (`grep -o "dictionaryTerms: \[[^]]*\]" src/data/lessons/*.ts`) 후 누락 어휘 전부 등록. 후보: 검색, 요약, 힌트, 단계, 순서, 확인, 개인정보, 비밀번호, 광고, 영수증, 거스름돈, 환승, 예절, 면접, 직업, 계획, 복습, 퀴즈 등. 각 항목: shortExplanation(1문장) + example + ttsVersion.
- [ ] **Step 7.2:** `npm run lint` && dictionaryTerms에 있는데 사전에 없는 어휘 0개 확인.
- [ ] **Step 7.3:** Commit — `feat(edu): student dictionary 15 → 50+ entries`

---

### Task 8: TeacherView 실사용화 (목표 열람 + 진도 패널)

**Files:**
- Modify: `src/views/TeacherView.tsx`

- [ ] **Step 8.1: 학습목표 패널** — `ALL_LESSONS`·`MODULES` import. 모듈별 `<details>` 아코디언 → 차시 표 (번호·제목·objective·standards). 구현 완료 차시 수 표시 (예: "모듈 3 — 11/11차시").
- [ ] **Step 8.2: 진도 패널** — `loadProgress()`(storage util)로 이 기기의 완료 차시 조회 → 모듈별 `완료/전체` + 전체 %. "이 브라우저 기준" 안내 문구.
- [ ] **Step 8.3:** `npm run lint` → PASS
- [ ] **Step 8.4:** Commit — `feat(edu): teacher panels — objectives/standards browser + device progress`

---

### Task 9: 교사 가이드 문서

**Files:**
- Create: `docs/teacher-guide.md`

- [ ] **Step 9.1:** 작성 — ① 교과서 소개(대상·구성 6모듈 68차시) ② 수업 활용법(난이도·TTS·글자 크기·쉬운 사전·진도) ③ 차시 구조(도입-활동-정리) ④ AI 차시 안내(시뮬레이션 vs 실제, 키 없이도 전 차시 완결) ⑤ Gemini API 키 발급·등록(교사 모드 `?teacher=1`) ⑥ 모듈별 학습목표 요약표 ⑦ 자주 묻는 문제(소리가 안 나요, AI가 대답을 안 해요 등 — ErrorMessage 2단 구조 설명).
- [ ] **Step 9.2:** Commit — `docs: teacher guide`

---

### Task 10: CLAUDE.md 동기화 + 최종 검증

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 10.1:** CLAUDE.md 갱신 — 마일스톤 상태(M4~M7 콘텐츠 완료), 스키마 신필드, lessons/m3~m6, Sequence 위젯, teacher-guide 반영.
- [ ] **Step 10.2:** 최종 검증 — `npm run lint` && `npm run check:encoding` && `npm run build` → 모두 PASS.
- [ ] **Step 10.3:** dev 서버 스모크 테스트 — 모듈 3~6 각 1차시를 처음~정리 화면까지 플레이(preview 도구), 진도 저장·TeacherView 패널 렌더 확인.
- [ ] **Step 10.4:** Commit — `docs: sync CLAUDE.md with education upgrade state`
