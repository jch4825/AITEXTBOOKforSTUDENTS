# Single Learning Objective Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace three support-level learning objectives with one canonical objective per lesson, using each lesson's current weak-support (`normal`) objective for all 68 lessons.

**Architecture:** Move the 68 `hard.goal.normal` strings into the matching `LessonContent.objective` fields, then delete the three-variant `goal` objects and their type member. Both regular lessons and studio explanations render `lesson.objective`; support-level variation remains only in explanations, terms, methods, and hints.

**Tech Stack:** TypeScript 5.8, React 19, Node contract scripts, Vite 6.

## Global Constraints

- Exactly one learning objective exists per lesson.
- The canonical objective for every lesson is the pre-change `hard.goal.normal` string.
- All 68 lesson objectives are migrated; module counts remain 11, 11, 11, 11, 12, 12.
- `HardLessonContent` contains no learning-objective field after migration.
- Support levels still change explanation depth, not the objective.
- Standards, lesson activities, wrap-up variants, story content, and progress storage are unchanged.
- UTF-8 and strict TypeScript must pass.

---

### Task 1: Add the single-objective contract

**Files:**
- Create: `scripts/check-single-learning-objective-contract.mjs`
- Modify: `scripts/check-studio-expansion.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: six regular lesson files, six hard lesson files, `src/types.ts`, `LessonView.tsx`, `StudioExplanationPanel.tsx`, and `LegacyTeacherPanels.tsx`.
- Produces: `npm run check:single-objective` and a permanent aggregate release gate.

- [ ] **Step 1: Freeze the 68 weak-support objective strings**

Before changing production data, parse every `goal.normal` into an `EXPECTED_OBJECTIVES` object keyed by lesson ID. The contract must compare this exact table with every post-migration `objective` value.

```js
const MODULE_COUNTS = { m1: 11, m2: 11, m3: 11, m4: 11, m5: 12, m6: 12 };
const EXPECTED_OBJECTIVES = {
  'm1-l1': '우리 주변에서 AI를 찾아봐요.',
  'm1-l2': '기계와 AI가 어떻게 다른지 알아봐요.',
  'm1-l3': 'AI가 어떻게 답을 만드는지 알아봐요.',
  'm1-l4': 'AI가 사진 속 물건을 알아보는 모습을 알아봐요.',
  'm1-l5': 'AI가 우리 목소리를 어떻게 알아듣는지 알아봐요.',
  'm1-l6': 'AI가 자료를 보고 배우는 과정을 알아봐요.',
  'm1-l7': 'AI가 잘하는 일들을 찾아봐요.',
  'm1-l8': 'AI가 못하는 일들을 찾아봐요.',
  'm1-l9': '챗봇과 이미지 생성 AI가 무엇인지 알아봐요.',
  'm1-l10': 'AI에게 프롬프트로 물어보고 답을 확인해 봐요.',
  'm1-l11': '이번 단원에서 배운 낱말들을 다시 알아봐요.',
  'm2-l1': '프롬프트에 들어갈 세 가지 요소를 알아봐요.',
  'm2-l2': '여러 부탁을 한 문장씩 나누어 물어봐요.',
  'm2-l3': '"그거" 대신 정확한 이름으로 물어봐요.',
  'm2-l4': '원하는 답 모양을 예시로 보여주며 부탁해 봐요.',
  'm2-l5': 'AI에게 역할을 주고 원하는 말투로 답을 들어 봐요.',
  'm2-l6': '큰 질문을 작은 단계로 쪼개서 하나씩 물어봐요.',
  'm2-l7': 'AI의 답을 확인하고 부족한 부분을 다시 부탁해 봐요.',
  'm2-l8': '"세 줄로", "표로"처럼 형식을 정해 부탁해 봐요.',
  'm2-l9': 'AI 답이 이상하면 "진짜야?" 하고 되물어 봐요.',
  'm2-l10': '배운 방법대로 프롬프트를 만들어 AI와 대화해 봐요.',
  'm2-l11': '단원 2에서 배운 좋은 질문 방법들을 다시 알아봐요.',
  'm3-l1': '예나 아니오로 끝나지 않는 질문을 만들어 물어봐요.',
  'm3-l2': 'AI에게 단어 뜻을 물어보고 사전과 비교해 봐요.',
  'm3-l3': '이해하기 쉽게 예를 들어 설명해 달라고 부탁해 봐요.',
  'm3-l4': '배우고 싶은 낱말이 들어간 문장을 AI에게 만들어 달라고 해요.',
  'm3-l5': '내가 생각한 줄거리를 AI에게 말하고 이야기를 만들어 봐요.',
  'm3-l6': '계산은 계산기로 확인하고, 풀이 방법은 AI에게 물어봐요.',
  'm3-l7': '긴 글을 세 문장으로 짧게 요약해 달라고 해 봐요.',
  'm3-l8': 'AI에게 문제를 만들어 달라고 해서 스스로 풀어 봐요.',
  'm3-l9': 'AI에게 그림을 보여주고 무슨 그림인지 설명해 달라고 해요.',
  'm3-l10': 'AI에게 오늘 배운 것을 짧게 줄여 달라고 하고 읽어 봐요.',
  'm3-l11': '공부할 때 AI를 어떻게 쓸지 약속을 만들어 봐요.',
  'm4-l1': 'AI가 거짓말처럼 틀린 답을 자신 있게 할 수 있음을 알아요.',
  'm4-l2': '정보를 그대로 믿지 않고 사실인지 확인해 봐요.',
  'm4-l3': 'AI에게 이름이나 주소 같은 개인정보를 말하지 않기로 해요.',
  'm4-l4': '비밀번호를 묻는 말을 만나면 절대로 말하지 않아요.',
  'm4-l5': '사진을 보내기 전에 한번 더 생각하는 약속을 지켜요.',
  'm4-l6': '마음이 무서워지는 나쁜 내용을 만나면 화면을 끄고 알려요.',
  'm4-l7': 'AI에게 명령하는 대신 고운 말로 부탁해 봐요.',
  'm4-l8': '폰을 너무 오래 하지 않도록 미리 시간을 정해요.',
  'm4-l9': '무서운 일이 생기면 숨기지 않고 어른에게 도움을 요청해요.',
  'm4-l10': '화면에서 진짜 정보와 파는 광고를 다른 점을 찾아요.',
  'm4-l11': '그동안 배운 안전 약속을 다시 말해 봐요.',
  'm5-l1': '지금 상황과 내가 바라는 것이 다를 때 이것이 문제임을 알아요.',
  'm5-l2': '큰 일을 세 가지 작은 일들로 나누어 봐요.',
  'm5-l3': '나눈 작은 일들을 먼저 할 것부터 순서대로 나열해요.',
  'm5-l4': '여러 일 중 더 중요한 일을 먼저 하기로 정해요.',
  'm5-l5': '정답 대신 살짝 도와주는 힌트만 달라고 부탁해 봐요.',
  'm5-l6': 'AI가 내 말을 오해하면 더 구체적인 이름으로 다시 말해요.',
  'm5-l7': 'AI에게 한 번에 하나씩 순서대로 실행해 달라고 부탁해 봐요.',
  'm5-l8': '내가 얻은 결과가 처음에 원했던 목표와 같은지 확인해 봐요.',
  'm5-l9': '이 방법 말고 다른 방법도 있는지 AI에게 물어봐요.',
  'm5-l10': '틀린 부분을 찾아서 고치고 다시 도전해 봐요.',
  'm5-l11': '라면 끓이는 일의 순서를 세워 차례대로 해 봐요.',
  'm5-l12': '이전 시간에 공부한 문제 해결 4단계를 다시 알아봐요.',
  'm6-l1': 'AI에게 재료 목록을 짜 달라고 하고 확인해 봐요.',
  'm6-l2': '살 물건들의 값을 알아보고 계산기로 직접 확인해 봐요.',
  'm6-l3': '지도로 가는 길을 확인하고 내 위치 정보도 조심해요.',
  'm6-l4': '버스나 지하철이 언제 도착하는지 앱으로 알아봐요.',
  'm6-l5': '오늘 날씨 예보를 알아보고 어울리는 옷을 골라 봐요.',
  'm6-l6': '요리하는 순서를 AI에게 물어보고 하나씩 알아봐요.',
  'm6-l7': '오늘 할 일들의 알림을 맞추고 실천해 봐요.',
  'm6-l8': '아플 때 내 상태를 어른에게 먼저 말하고 도와달라고 해요.',
  'm6-l9': '고마운 상황에 어울리는 말을 소리 내어 연습해 봐요.',
  'm6-l10': '내가 되고 싶은 직업이 무슨 일을 하는지 AI에게 물어봐요.',
  'm6-l11': '내가 쓴 자기소개를 AI에게 보여주고 고쳐서 다시 써 봐요.',
  'm6-l12': '그동안 배운 생활 약속을 다시 모아 확인해 봐요.',
};
```

- [ ] **Step 2: Assert the final architecture**

The script must fail unless:

```js
objectiveCount === 68;
hardGoalCount === 0;
types.includes('goal:') === false;
lessonView.includes('const goalText = lesson.objective');
studioPanel.includes('const goal = lesson.objective');
teacherPanel.includes('lesson.objective');
```

It must parse each regular lesson object, compare its `objective` with `EXPECTED_OBJECTIVES[id]`, and report the first mismatched lesson ID.

- [ ] **Step 3: Add commands and verify RED**

```json
"check:single-objective": "node scripts/check-single-learning-objective-contract.mjs"
```

Add the script to `scripts/check-studio-expansion.mjs`. Run `npm run check:single-objective`.

Expected: FAIL because hard lesson files still contain 68 `goal` objects.

- [ ] **Step 4: Commit the failing contract**

```bash
git add scripts/check-single-learning-objective-contract.mjs scripts/check-studio-expansion.mjs package.json
git commit -m "test: require one objective per lesson"
```

---

### Task 2: Migrate all 68 objectives and remove hard goal variants

**Files:**
- Modify: `src/data/lessons/m1.ts` through `src/data/lessons/m6.ts`
- Modify: `src/data/lessons/hard/m1.ts` through `src/data/lessons/hard/m6.ts`

**Interfaces:**
- Consumes: the frozen `EXPECTED_OBJECTIVES` table.
- Produces: one `objective` per lesson and zero `goal` objects in hard content.

- [ ] **Step 1: Replace each regular objective**

For each lesson ID, replace only the `objective` string with `EXPECTED_OBJECTIVES[id]`. Do not alter titles, standards, bodies, steps, missions, or wrap-up text.

- [ ] **Step 2: Delete every hard goal object**

Remove this complete block from all 68 hard lesson entries:

```ts
goal: {
  easy: '...',
  normal: '...',
  hard: '...',
},
```

- [ ] **Step 3: Run the contract**

Run: `npm run check:single-objective`

Expected: it may still fail only on the type or renderer assertions; data assertions must report 68 objectives and zero hard goals.

---

### Task 3: Make all rendering paths use the canonical objective

**Files:**
- Modify: `src/types.ts`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/features/studio/components/StudioExplanationPanel.tsx`

**Interfaces:**
- Consumes: `LessonContent.objective`.
- Produces: identical goal text for easy/full, normal/light, and hard/challenge support states.

- [ ] **Step 1: Delete the hard-content goal type**

```ts
export interface HardLessonContent {
  concept: string[];
  terms: HardTerm[];
  method?: string[];
  limits: string;
  wrapUpHard: string;
}
```

- [ ] **Step 2: Replace both goal selections**

In `LessonView.tsx`:

```ts
const goalText = lesson.objective;
```

In `StudioExplanationPanel.tsx`:

```ts
const goal = lesson.objective;
```

Do not change paragraph, method, term, or limit selection.

- [ ] **Step 3: Verify GREEN and commit**

Run:

```bash
npm run check:single-objective
npm run check:studio-expansion-all
npm run lint
```

Expected: all commands exit 0 and the contract reports 68 canonical objectives, 0 hard goal variants.

```bash
git add src/types.ts src/views/LessonView.tsx src/features/studio/components/StudioExplanationPanel.tsx src/data/lessons scripts/check-single-learning-objective-contract.mjs scripts/check-studio-expansion.mjs package.json
git commit -m "fix: use one learning objective per lesson"
```

---

### Task 4: Full and browser verification

**Files:**
- Modify only if a new failing contract reproduces a discovered issue.

- [ ] **Step 1: Run full automated checks**

```bash
npm run check:studio-expansion-all
npm run check:ui-polish
npm run check:activity-icons
npm run check:encoding
npm run lint
npm run build
git diff --check
```

- [ ] **Step 2: Verify a regular lesson and a studio lesson**

Open one regular lesson and one experience studio. Record the goal at sufficient/full, weak/light, and challenge support levels. All three strings must be identical while the explanation paragraphs or tools still differ. Confirm objective TTS is user-triggered and not automatic.

- [ ] **Step 3: Verify teacher consistency**

Open the teacher learning-objectives panel and confirm its objective for the sampled lesson matches the student goal exactly.
