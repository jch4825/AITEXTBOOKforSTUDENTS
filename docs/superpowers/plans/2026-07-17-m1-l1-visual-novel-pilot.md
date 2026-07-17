# M1-L1 Visual Novel Social Story Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `m1-l1`을 좌측 비주얼 노벨 사회적 상황이야기와 우측 공통 학습목표·3단계 지식 설명이 연동되는 재사용 가능한 핵심 경험 기준형으로 구현합니다.

**Architecture:** 기존 8단계 스튜디오와 과정기록 저장은 유지하고, `StudioDefinition`에 선택적 `visualNovel` 데이터를 추가합니다. `encounter` 단계에서만 재사용 가능한 `VisualNovelExperience`가 좌우 펼침면을 렌더하며, 마지막 장면을 학생이 직접 열어야 하단 다음 버튼이 활성화됩니다. 이후 단계는 같은 생활 사건과 연결된 적용·비교·판단 활동으로 재작성합니다.

**Tech Stack:** React 19, TypeScript 5.8 strict mode, Tailwind CSS 4 + `src/index.css`, Vite 6, Web Speech API wrapper `useSpeak`, Node contract scripts, browser localStorage process evidence.

## Global Constraints

- 학습목표는 지원 수준과 무관하게 `AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.` 한 개만 사용합니다.
- 표현 형식은 비주얼 노벨이고, 서사 문법은 사회적 상황이야기입니다.
- 왼쪽과 오른쪽 페이지의 폭과 높이는 같은 좌우 대칭 펼침면을 유지합니다.
- 충분한 지원에서도 핵심 지식을 삭제하지 않습니다. 문장량·시각 단서·관점 설명·응답 방식만 조절합니다.
- 학생이 버튼을 눌렀을 때만 TTS를 실행합니다. 장면 진입·마지막 장면·단계 전환 시 자동 TTS를 실행하지 않습니다.
- 한 이미지에 글자·말풍선·UI를 굽지 않습니다. 모든 글과 접근성 이름은 HTML로 제공합니다.
- 학생 문장은 인사를 제외하고 `~습니다`, `~입니까` 형식의 존중어를 사용합니다.
- 현재 지원 수준은 상단 네비게이션의 전역 설정을 사용하며 차시 내부 선택기를 만들지 않습니다.
- UTF-8, strict TypeScript, GitHub Pages base path `/AITEXTBOOKforSTUDENTS/`를 유지합니다.
- PC 1280px 이상을 기준으로 완성하고 390px·글자 125%에서도 정보 손실 없이 세로로 재배치합니다.

---

### Task 1: 승인된 스토리보드를 네 장면 자산으로 준비

**Files:**
- Create: `docs/storyboards/m1-l1-seat-check-storyboard.png`
- Create: `public/lessons/m1-l1-vn-01.webp`
- Create: `public/lessons/m1-l1-vn-02.webp`
- Create: `public/lessons/m1-l1-vn-03.webp`
- Create: `public/lessons/m1-l1-vn-04.webp`
- Create: `scripts/check-visual-novel-social-story-contract.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: 승인된 생성 원본 `C:\Users\jch48\.codex\generated_images\019f658f-25e3-78e0-b0b8-ed3cbd790542\exec-8619c031-e337-4812-a4f2-6cdea631b9dd.png`.
- Produces: `/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp`부터 `04.webp`까지의 16:9 장면 URL과 `npm run check:visual-novel-story` 검증 명령.

- [ ] **Step 1: 자산 존재 계약을 작성합니다**

```js
// scripts/check-visual-novel-social-story-contract.mjs
import fs from 'node:fs';

const assets = [1, 2, 3, 4].map(
  (number) => `public/lessons/m1-l1-vn-${String(number).padStart(2, '0')}.webp`,
);

for (const asset of assets) {
  if (!fs.existsSync(asset)) throw new Error(`missing visual novel scene: ${asset}`);
  if (fs.statSync(asset).size < 20_000) throw new Error(`visual novel scene is unexpectedly small: ${asset}`);
}

console.log('visual novel social story assets: 4 scenes ready');
```

`package.json` scripts에 다음을 추가합니다.

```json
"check:visual-novel-story": "node scripts/check-visual-novel-social-story-contract.mjs"
```

- [ ] **Step 2: 계약이 실패하는지 확인합니다**

Run: `npm run check:visual-novel-story`

Expected: FAIL with `missing visual novel scene: public/lessons/m1-l1-vn-01.webp`.

- [ ] **Step 3: 승인된 원본을 보존하고 4개 패널을 자릅니다**

Run with the bundled Python runtime:

```powershell
$python='C:\Users\jch48\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
$source='C:\Users\jch48\.codex\generated_images\019f658f-25e3-78e0-b0b8-ed3cbd790542\exec-8619c031-e337-4812-a4f2-6cdea631b9dd.png'
Copy-Item -LiteralPath $source -Destination 'docs\storyboards\m1-l1-seat-check-storyboard.png'
@'
from PIL import Image
from pathlib import Path

source = Image.open('docs/storyboards/m1-l1-seat-check-storyboard.png').convert('RGB')
w, h = source.size
x_gap, y_gap = 7, 7
left_w = (w - x_gap) // 2
top_h = (h - y_gap) // 2
boxes = [
    (0, 0, left_w, top_h),
    (left_w + x_gap, 0, w, top_h),
    (0, top_h + y_gap, left_w, h),
    (left_w + x_gap, top_h + y_gap, w, h),
]
Path('public/lessons').mkdir(parents=True, exist_ok=True)
for index, box in enumerate(boxes, 1):
    panel = source.crop(box)
    panel.save(f'public/lessons/m1-l1-vn-{index:02d}.webp', 'WEBP', quality=90, method=6)
'@ | & $python -
```

- [ ] **Step 4: 자산 계약을 다시 실행합니다**

Run: `npm run check:visual-novel-story`

Expected: PASS with `visual novel social story assets: 4 scenes ready`.

- [ ] **Step 5: 자산 작업을 커밋합니다**

```powershell
git add package.json scripts/check-visual-novel-social-story-contract.mjs docs/storyboards/m1-l1-seat-check-storyboard.png public/lessons/m1-l1-vn-*.webp
git commit -m "assets: add m1-l1 visual novel scenes"
```

### Task 2: 비주얼 노벨 데이터 계약과 `m1-l1` 사회적 상황이야기 정의

**Files:**
- Modify: `src/features/studio/types.ts`
- Modify: `src/data/studios/m1.ts`
- Modify: `src/data/lessons/m1.ts`
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Consumes: Task 1의 네 장면 URL, 기존 `SupportLevel`, `StudioDefinition`, `STUDIO_SUPPORT_PROFILES`.
- Produces: `VisualNovelStory`, `VisualNovelScene`, `VisualNovelKnowledge` 타입과 `StudioDefinition.visualNovel?: VisualNovelStory`.

- [ ] **Step 1: 데이터 계약을 먼저 확장합니다**

`scripts/check-visual-novel-social-story-contract.mjs`에 다음 검사를 추가합니다.

```js
const types = fs.readFileSync('src/features/studio/types.ts', 'utf8');
const m1Studio = fs.readFileSync('src/data/studios/m1.ts', 'utf8');
const m1Lesson = fs.readFileSync('src/data/lessons/m1.ts', 'utf8');

for (const token of ['VisualNovelStory', 'VisualNovelScene', 'VisualNovelKnowledge', 'visualNovel?: VisualNovelStory']) {
  if (!types.includes(token)) throw new Error(`missing visual novel type: ${token}`);
}
for (const token of [
  "title: '처음 온 교실에서 자리를 찾습니다'",
  "objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.'",
  "imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp'",
  "imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-04.webp'",
  '어제 자리표',
  '오늘 자리표',
]) {
  if (!m1Studio.includes(token)) throw new Error(`missing m1-l1 social story data: ${token}`);
}
if (!m1Lesson.includes("objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.'")) {
  throw new Error('m1-l1 must expose one shared learning objective');
}
```

- [ ] **Step 2: 새 데이터 계약이 실패하는지 확인합니다**

Run: `npm run check:visual-novel-story`

Expected: FAIL with `missing visual novel type: VisualNovelStory`.

- [ ] **Step 3: 타입을 추가합니다**

`src/features/studio/types.ts`에 다음 타입을 추가하고 `StudioDefinition`에 선택 필드를 연결합니다.

```ts
export interface VisualNovelCopy {
  speaker: string;
  text: string;
  perspective?: string;
}

export interface VisualNovelScene {
  id: string;
  label: string;
  imageSrc: string;
  alt: string;
  knowledgeStep: 0 | 1 | 2;
  copy: Record<SupportLevel, VisualNovelCopy>;
}

export interface VisualNovelKnowledge {
  title: string;
  core: string;
  detail: Record<SupportLevel, string>;
  flow?: { input: string; process: string; output: string };
}

export interface VisualNovelStory {
  title: string;
  objective: string;
  scenes: VisualNovelScene[];
  knowledge: [VisualNovelKnowledge, VisualNovelKnowledge, VisualNovelKnowledge];
}

export interface StudioDefinition {
  id: string;
  lessonId: LessonId;
  moduleId: ModuleId;
  title: string;
  subtitle: string;
  visualNovel?: VisualNovelStory;
  encounter: {
    title: string;
    description: string;
    facts: string[];
    stimuli?: PreparedStimulus[];
  };
  firstAttempt: {
    prompt: string;
    choices: StudioChoice[];
    modes: ExpressionMode[];
    reasonPrompt: string;
  };
  supportProfiles: Record<SupportLevel, SupportProfile>;
  conditionChange: {
    description: string;
    facts: string[];
    stimuli?: PreparedStimulus[];
  };
  aiContribution: {
    source: AiSource;
    role: string;
    text: string;
    question?: string;
  };
  artifact: {
    kind: 'action-card' | 'repair-card' | 'visual-plan';
    title: string;
    prompt: string;
  };
  transfer: {
    title: string;
    description: string;
    choices: StudioChoice[];
  };
  safetyNote?: string;
}
```

- [ ] **Step 4: `m1-l1`의 공통 목표와 네 장면 지원 수준 문안을 작성합니다**

`src/data/studios/m1.ts`의 첫 정의에 다음 구조를 추가합니다. 모든 `copy`에는 `full`, `light`, `challenge`가 존재해야 합니다.

```ts
visualNovel: {
  title: '처음 온 교실에서 자리를 찾습니다',
  objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.',
  scenes: [
    {
      id: 'arrive',
      label: '장면 1 · 처음 온 교실',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-01.webp',
      alt: '진우가 처음 온 AI 동아리 교실에서 자신의 자리를 찾는 장면',
      knowledgeStep: 0,
      copy: {
        full: { speaker: '이야기', text: '진우는 처음 온 교실에서 자리를 찾습니다.' },
        light: { speaker: '이야기', text: '진우는 오늘 AI 동아리에 처음 왔습니다. 자리가 여러 개라서 어디에 앉아야 할지 모르겠습니다.', perspective: '처음 온 곳에서 자리를 모를 수 있습니다.' },
        challenge: { speaker: '진우', text: '책상마다 다른 표시가 있습니다. 어느 정보가 오늘 자리표인지 먼저 확인해야 합니다.', perspective: '비슷한 표시가 여러 개이면 기준과 날짜를 함께 살펴볼 수 있습니다.' },
      },
    },
    {
      id: 'ask-aimi',
      label: '장면 2 · 아이미에게 묻기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-02.webp',
      alt: '진우가 아이미에게 자신의 자리를 묻고 아이미가 자리표 자료를 확인하는 장면',
      knowledgeStep: 1,
      copy: {
        full: { speaker: '진우와 아이미', text: '진우는 아이미에게 자리를 묻습니다. 아이미는 창가 쪽이라고 말합니다.' },
        light: { speaker: '진우와 아이미', text: '진우가 묻습니다. “아이미, 제 자리는 어디입니까?” 아이미는 저장된 자리표를 보고 창가 쪽이라고 안내합니다.' },
        challenge: { speaker: '진우와 아이미', text: '아이미는 진우의 말과 저장된 자리표를 이용해 창가 쪽이라는 답을 만듭니다.', perspective: 'AI의 답을 이해하려면 어떤 말과 자료가 들어갔는지 살펴볼 수 있습니다.' },
      },
    },
    {
      id: 'compare-information',
      label: '장면 3 · 다른 정보를 발견하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-03.webp',
      alt: '진우가 창가 책상의 표시와 아이미의 안내가 다르다는 것을 발견하고 비교하는 장면',
      knowledgeStep: 2,
      copy: {
        full: { speaker: '이야기', text: '아이미의 답과 오늘 책상 표시가 다릅니다.' },
        light: { speaker: '이야기', text: '진우가 창가로 가 보니 책상 표시가 다릅니다.', perspective: '정보가 다르면 바로 앉지 않고 다시 확인할 수 있습니다.' },
        challenge: { speaker: '진우', text: '아이미가 본 것은 어제 자리표이고 책상에는 오늘 표시가 있습니다.', perspective: '날짜와 현재 상황이 다르면 최신 정보를 기준으로 다시 판단할 수 있습니다.' },
      },
    },
    {
      id: 'confirm-today',
      label: '장면 4 · 오늘 정보를 확인하기',
      imageSrc: '/AITEXTBOOKforSTUDENTS/lessons/m1-l1-vn-04.webp',
      alt: '진우와 민준 선생님과 아이미가 오늘 자리표를 함께 확인하는 장면',
      knowledgeStep: 2,
      copy: {
        full: { speaker: '이야기', text: '진우는 선생님과 오늘 자리를 확인합니다.' },
        light: { speaker: '민준 선생님', text: '“오늘은 자리가 바뀌었습니다. 새 자리표를 함께 봅시다.” 진우는 알맞은 자리에 앉습니다.' },
        challenge: { speaker: '이야기', text: '진우는 오늘 자리표와 선생님의 안내를 비교해 현재 자리를 확인합니다.', perspective: 'AI의 도움을 사용하더라도 중요한 내용은 최신 정보나 사람에게 다시 확인할 수 있습니다.' },
      },
    },
  ],
  knowledge: [
    {
      title: 'AI는 무엇입니까?',
      core: 'AI는 사람이 만든 컴퓨터 기술입니다.',
      detail: {
        full: 'AI는 로봇의 이름이 아니라 컴퓨터 기술입니다.',
        light: 'AI는 글·말·사진 같은 자료를 이용하는 컴퓨터 기술입니다.',
        challenge: '로봇의 겉모습과 AI 기능은 같지 않습니다. AI는 기계 안에서 자료를 처리하는 기술입니다.',
      },
    },
    {
      title: 'AI는 어떻게 일합니까?',
      core: 'AI는 자료를 보고 답이나 추천을 만듭니다.',
      detail: {
        full: '진우의 말과 자리표를 보고 자리를 안내합니다.',
        light: '진우의 말과 저장된 자리표가 AI에 들어가 자리 안내가 나옵니다.',
        challenge: 'AI의 결과는 입력과 저장된 자료에 따라 달라집니다.',
      },
      flow: { input: '말·자리표', process: 'AI', output: '자리 안내' },
    },
    {
      title: 'AI의 답은 언제나 맞습니까?',
      core: 'AI도 틀릴 수 있으므로 사람이 다시 확인합니다.',
      detail: {
        full: '오늘 정보인지 다시 봅니다.',
        light: '자료가 오래되면 AI의 답이 지금 상황과 다를 수 있습니다.',
        challenge: 'AI가 사용한 자료의 날짜와 현재 정보를 비교해 답의 신뢰성을 판단합니다.',
      },
    },
  ],
},
```

첫 스튜디오의 제목과 후속 적용 활동은 다음 문안으로 교체합니다.

```ts
title: '처음 온 교실에서 AI의 도움을 받습니다',
subtitle: 'AI가 자료로 답을 만드는 과정과 다시 확인하는 방법을 배웁니다',
encounter: {
  title: '처음 온 AI 동아리 교실',
  description: '진우가 아이미에게 자리를 묻고 오늘 자리표와 다시 확인합니다.',
  facts: [
    '처음 온 곳에서 자리를 모를 수 있습니다.',
    '아이미는 진우의 말과 저장된 자리표를 보고 답을 만듭니다.',
    '진우는 현재 책상 표시와 선생님의 안내를 다시 확인합니다.',
  ],
},
firstAttempt: {
  prompt: '다른 날, AI는 동아리가 3시에 시작한다고 말하고 오늘 안내문에는 3시 30분이라고 적혀 있습니다. 먼저 무엇을 해 보겠습니까?',
  choices: [
    { id: 'check-today', emoji: '📅', label: '오늘 안내문과 날짜를 확인합니다.' },
    { id: 'ask-person', emoji: '🙋', label: '선생님에게 오늘 시간을 확인합니다.' },
    { id: 'follow-ai-only', emoji: '🤖', label: 'AI가 말한 시간만 보고 바로 결정합니다.' },
  ],
  modes: [...STUDIO_EXPRESSION_MODES],
  reasonPrompt: '먼저 확인하고 싶은 정보나 도움을 표현해 보십시오.',
},
conditionChange: {
  description: 'AI가 확인한 자료와 오늘 상황이 서로 다릅니다.',
  facts: [
    'AI는 어제 저장된 동아리 시간표를 확인했습니다.',
    '오늘 안내문에는 날짜와 3시 30분이 표시되어 있습니다.',
    '선생님은 오늘만 시작 시간이 바뀌었다고 설명합니다.',
    'AI의 답은 사용한 자료가 오래되면 현재 상황과 다를 수 있습니다.',
  ],
},
aiContribution: {
  source: 'prepared',
  role: '아이미의 설명',
  text: '저는 저장된 어제 시간표를 보고 3시라고 답했습니다. 오늘 안내문과 선생님의 설명을 함께 확인하면 현재 시간을 알 수 있습니다.',
  question: '지금 상황을 알려 주는 가장 최근 정보는 무엇입니까?',
},
artifact: {
  kind: 'action-card',
  title: 'AI 답 확인 카드',
  prompt: 'AI가 사용한 자료, 오늘 정보, 다시 확인할 사람이나 장소를 한 장에 정리해 보십시오.',
},
transfer: {
  title: '도서관 좌석 안내가 다르다면',
  description: 'AI는 빈자리라고 안내했지만 책상에는 사용 중 표시가 있습니다. 어떤 방법을 써 보겠습니까?',
  choices: [
    { id: 'check-seat-sign', emoji: '👀', label: '현재 책상의 사용 중 표시를 확인합니다.' },
    { id: 'ask-librarian', emoji: '🙋', label: '도서관 담당자에게 자리를 확인합니다.' },
    { id: 'sit-immediately', emoji: '🪑', label: 'AI의 안내만 보고 바로 앉습니다.' },
  ],
},
```

`scripts/check-studio-expansion-contract.mjs`의 기존 `나의 AI 발견 카드` 기대값은 `AI 답 확인 카드`로 갱신합니다.

- [ ] **Step 5: `m1-l1` 기본 본문을 명시적 정의로 정정합니다**

`src/data/lessons/m1.ts`의 첫 차시를 다음 문안으로 바꿉니다.

```ts
objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.',
bodyEasy: 'AI는 사람이 만든 컴퓨터 기술입니다.',
bodyNormal: 'AI는 글·말·사진 같은 자료를 보고 답이나 추천을 만드는 컴퓨터 기술입니다.',
wrapUpEasy: 'AI는 자료를 보고 답을 만드는 컴퓨터 기술입니다.',
wrapUpNormal: 'AI는 자료를 보고 답이나 추천을 만듭니다. 중요한 내용은 사람이 다시 확인합니다.',
```

- [ ] **Step 6: 데이터 계약과 기존 스튜디오 계약을 실행합니다**

Run: `npm run check:visual-novel-story && npm run check:studio-expansion && npm run check:single-objective && npm run check:student-formal-style`

Expected: all commands PASS.

- [ ] **Step 7: 데이터 작업을 커밋합니다**

```powershell
git add src/features/studio/types.ts src/data/studios/m1.ts src/data/lessons/m1.ts scripts/check-visual-novel-social-story-contract.mjs scripts/check-studio-expansion-contract.mjs
git commit -m "feat: define m1-l1 social story data"
```

### Task 3: 좌우 펼침면 비주얼 노벨 컴포넌트 구현

**Files:**
- Create: `src/features/studio/components/VisualNovelExperience.tsx`
- Modify: `src/features/studio/components/StudioExperience.tsx`
- Modify: `src/index.css`
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`

**Interfaces:**
- Consumes: `StudioDefinition.visualNovel`, `SupportLevel`, `useSpeak`, `EditorialStudioFrame`.
- Produces: `VisualNovelExperience({ definition, story, supportLevel, accent, secondary, onCompleted, onSupportMode })`.

- [ ] **Step 1: UI 계약을 먼저 추가합니다**

```js
const visualNovelPath = 'src/features/studio/components/VisualNovelExperience.tsx';
if (!fs.existsSync(visualNovelPath)) throw new Error('VisualNovelExperience is missing');
const visualNovel = fs.readFileSync(visualNovelPath, 'utf8');
const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
for (const token of ['비주얼 노벨 이야기', '학습목표', '이야기와 함께 알아봅니다', '대사 듣기', 'aria-pressed']) {
  if (!visualNovel.includes(token)) throw new Error(`missing visual novel UI token: ${token}`);
}
if (!visualNovel.includes('speakNow(spokenText)')) throw new Error('TTS must be button-triggered');
if (visualNovel.includes('useEffect')) throw new Error('visual novel must not auto-speak or auto-advance');
if (!experience.includes('<VisualNovelExperience')) throw new Error('studio encounter does not render visual novel');
```

- [ ] **Step 2: UI 계약이 실패하는지 확인합니다**

Run: `npm run check:visual-novel-story`

Expected: FAIL with `VisualNovelExperience is missing`.

- [ ] **Step 3: 비주얼 노벨 컴포넌트를 구현합니다**

`src/features/studio/components/VisualNovelExperience.tsx`를 다음과 같이 작성합니다.

```tsx
import { useState } from 'react';
import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import type { StudioDefinition, SupportLevel, VisualNovelStory } from '../types';
import EditorialStudioFrame from './EditorialStudioFrame';

interface Props {
  definition: StudioDefinition;
  story: VisualNovelStory;
  supportLevel: SupportLevel;
  accent: string;
  secondary: string;
  onCompleted: () => void;
  onSupportMode: (mode: string) => void;
}

export default function VisualNovelExperience({
  definition,
  story,
  supportLevel,
  accent,
  secondary,
  onCompleted,
  onSupportMode,
}: Props) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const { speakNow } = useSpeak();
  const scene = story.scenes[sceneIndex];
  const copy = scene.copy[supportLevel];
  const activeKnowledge = story.knowledge[scene.knowledgeStep];
  const spokenText = [copy.text, copy.perspective, activeKnowledge.core, activeKnowledge.detail[supportLevel]]
    .filter(Boolean)
    .join(' ');

  function selectScene(index: number) {
    setSceneIndex(index);
    if (index === story.scenes.length - 1) onCompleted();
  }

  function speakCurrentScene() {
    onSupportMode('visual-novel-tts');
    speakNow(spokenText);
  }

  const left = (
    <section className="visual-novel-story-page" aria-label="비주얼 노벨 이야기">
      <div className="visual-novel-page-heading">
        <p className="studio-kicker" style={{ color: secondary }}>비주얼 노벨 이야기</p>
        <h2>{story.title}</h2>
      </div>
      <div className="visual-novel-stage">
        <img className="visual-novel-scene" src={scene.imageSrc} alt={scene.alt} />
        <span className="visual-novel-scene-label">{scene.label}</span>
        <button type="button" className="visual-novel-listen" onClick={speakCurrentScene}>
          <Icon name="speaker" size={18} /> 대사 듣기
        </button>
        <div className="visual-novel-dialogue">
          <strong>{copy.speaker}</strong>
          <p>{copy.text}</p>
          {copy.perspective && <p className="visual-novel-perspective">{copy.perspective}</p>}
          <button
            type="button"
            className="visual-novel-next"
            onClick={() => selectScene(sceneIndex === story.scenes.length - 1 ? 0 : sceneIndex + 1)}
            aria-label={sceneIndex === story.scenes.length - 1 ? '이야기 처음부터 보기' : '다음 장면 보기'}
          >
            <Icon name={sceneIndex === story.scenes.length - 1 ? 'refresh' : 'chevron-right'} size={20} />
          </button>
        </div>
      </div>
      <div className="visual-novel-controls" aria-label="이야기 장면 선택">
        {story.scenes.map((item, index) => (
          <button
            type="button"
            key={item.id}
            onClick={() => selectScene(index)}
            aria-label={`장면 ${index + 1} 보기`}
            aria-pressed={sceneIndex === index}
          >
            {index + 1}
          </button>
        ))}
        <span>{sceneIndex + 1} / {story.scenes.length}</span>
      </div>
    </section>
  );

  const right = (
    <section className="visual-novel-knowledge-page" aria-label="학습목표와 지식 설명">
      <div className="visual-novel-page-heading">
        <p className="studio-kicker" style={{ color: accent }}>1차시</p>
        <h2>AI가 무엇인지 처음 배웁니다</h2>
      </div>
      <div className="visual-novel-goal">
        <strong>학습목표</strong>
        <p>{story.objective}</p>
      </div>
      <h3>이야기와 함께 알아봅니다</h3>
      <div className="visual-novel-knowledge-list">
        {story.knowledge.map((knowledge, index) => (
          <article
            key={knowledge.title}
            className="visual-novel-knowledge"
            data-active={scene.knowledgeStep === index}
          >
            <span>{index + 1}</span>
            <div>
              <h4>{knowledge.title}</h4>
              <p><strong>{knowledge.core}</strong></p>
              <p>{knowledge.detail[supportLevel]}</p>
              {knowledge.flow && (
                <div className="visual-novel-flow" aria-label={`${knowledge.flow.input}, ${knowledge.flow.process}, ${knowledge.flow.output}`}>
                  <b>{knowledge.flow.input}</b><i aria-hidden>→</i><b>{knowledge.flow.process}</b><i aria-hidden>→</i><b>{knowledge.flow.output}</b>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
      <aside className="studio-margin-note">
        <strong>지금 볼 것</strong>
        <p>{activeKnowledge.detail[supportLevel]}</p>
      </aside>
    </section>
  );

  return (
    <EditorialStudioFrame
      definition={definition}
      stage="encounter"
      accent={accent}
      secondary={secondary}
      left={left}
      right={right}
    />
  );
}
```

내부 장면 버튼은 `1~4` 숫자와 `aria-label="장면 N 보기"`를 함께 제공하고, 현재 장면에는 `aria-pressed="true"`를 설정합니다. 마지막 장면에서 내부 버튼은 `이야기 처음부터 보기`가 되지만 자동으로 첫 장면으로 돌아가지 않습니다.

- [ ] **Step 4: `StudioExperience`의 encounter 분기를 연결합니다**

Props에 다음을 추가합니다.

```ts
onEncounterComplete?: () => void;
```

기존 일반 스튜디오 렌더보다 앞에서 다음을 반환합니다.

```tsx
if (state.stage === 'encounter' && definition.visualNovel) {
  return (
    <VisualNovelExperience
      definition={definition}
      story={definition.visualNovel}
      supportLevel={state.supportLevel}
      accent={accent}
      secondary={secondary}
      onCompleted={() => onEncounterComplete?.()}
      onSupportMode={(value) => dispatch({ type: 'record-support-mode', value })}
    />
  );
}
```

- [ ] **Step 5: 펼침면 스타일을 추가합니다**

`src/index.css`에 `visual-novel-*` 이름의 컴포넌트 클래스를 추가합니다. 핵심 규칙은 다음과 같습니다.

```css
.visual-novel-stage { position: relative; min-height: 31rem; overflow: hidden; border-radius: 1rem; background: var(--ink-1); }
.visual-novel-scene { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.visual-novel-dialogue { position: absolute; z-index: 3; left: .8rem; right: .8rem; bottom: .8rem; min-height: 7.5rem; padding: 1.4rem 1rem 1rem; color: #fff; background: color-mix(in srgb, var(--ink-1) 94%, transparent); }
.visual-novel-knowledge[data-active='true'] { border: 2px solid var(--accent); background: color-mix(in srgb, var(--accent) 7%, var(--paper-0)); }
@media (max-width: 1023px) { .visual-novel-stage { min-height: min(34rem, 76vw); } }
@media (max-width: 430px) { .visual-novel-stage { min-height: 30rem; } .visual-novel-dialogue { font-size: .95rem; } }
```

두 페이지의 실제 동일 높이는 기존 `LessonSpread`의 `.lesson-spread-pages`와 `.lesson-page`를 재사용합니다. 굵은 검은 만화 테두리는 추가하지 않습니다.

- [ ] **Step 6: UI 계약과 타입 검사를 실행합니다**

Run: `npm run check:visual-novel-story && npm run lint`

Expected: both PASS.

- [ ] **Step 7: UI 작업을 커밋합니다**

```powershell
git add src/features/studio/components/VisualNovelExperience.tsx src/features/studio/components/StudioExperience.tsx src/index.css scripts/check-visual-novel-social-story-contract.mjs
git commit -m "feat: render visual novel social story spread"
```

### Task 4: 마지막 장면 완료 게이트와 과정기록 연동

**Files:**
- Modify: `src/features/studio/StudioLessonView.tsx`
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`

**Interfaces:**
- Consumes: `definition.visualNovel`, `StudioExperience.onEncounterComplete`, 기존 `session.canGoNext`.
- Produces: 마지막 장면을 직접 확인하기 전에는 `MicroLessonFrame`의 다음 버튼을 비활성화하는 게이트.

- [ ] **Step 1: 완료 게이트 계약을 추가합니다**

```js
const studioView = fs.readFileSync('src/features/studio/StudioLessonView.tsx', 'utf8');
for (const token of ['encounterComplete', 'onEncounterComplete', 'visualNovelLocked']) {
  if (!studioView.includes(token)) throw new Error(`missing encounter completion gate: ${token}`);
}
if (studioView.includes('speakNow') || studioView.includes('speechSynthesis')) {
  throw new Error('studio route must not auto-start TTS');
}
```

- [ ] **Step 2: 완료 게이트 계약이 실패하는지 확인합니다**

Run: `npm run check:visual-novel-story`

Expected: FAIL with `missing encounter completion gate: encounterComplete`.

- [ ] **Step 3: `StudioLessonView`에 게이트를 구현합니다**

React import를 다음과 같이 확장합니다.

```tsx
import { useCallback, useEffect, useState } from 'react';
```

```tsx
const [encounterComplete, setEncounterComplete] = useState(!definition.visualNovel);

useEffect(() => {
  setEncounterComplete(!definition.visualNovel);
}, [definition.id, definition.visualNovel]);

const visualNovelLocked = session.state.stage === 'encounter'
  && Boolean(definition.visualNovel)
  && !encounterComplete;

<MicroLessonFrame
  lessonId={definition.lessonId}
  crumb={`${module?.number ?? 5}단원 · ${module?.title ?? 'AI로 문제해결하기'}`}
  totalSteps={STUDIO_STAGES.length}
  currentStep={currentStep}
  onPrev={session.goPrevious}
  onNext={handleNext}
  onPickLesson={onPickLesson}
  onGoHome={onGoHome}
  nextDisabled={visualNovelLocked || (session.state.stage !== 'complete' && !session.canGoNext)}
>
  <StudioExperience
    definition={definition}
    lesson={lesson}
    hard={hard}
    state={session.state}
    dispatch={session.dispatch}
    accent={theme.accent}
    secondary={theme.secondary}
    onEncounterComplete={() => setEncounterComplete(true)}
  />
</MicroLessonFrame>
```

이 `useEffect`는 상태 초기화만 수행하며 음성·장면 이동·버튼 클릭을 실행하지 않습니다.

- [ ] **Step 4: 완료 게이트와 TTS 회귀 계약을 실행합니다**

Run: `npm run check:visual-novel-story && npm run check:studio-pilot && npm run check:studio-expansion`

Expected: all commands PASS.

- [ ] **Step 5: 게이트 작업을 커밋합니다**

```powershell
git add src/features/studio/StudioLessonView.tsx scripts/check-visual-novel-social-story-contract.mjs
git commit -m "feat: gate studio progress on visual story completion"
```

### Task 5: 전체 회귀 검증과 실제 화면 확인

**Files:**
- Modify only if verification exposes a defect in files from Tasks 1-4.

**Interfaces:**
- Consumes: 완성된 `m1-l1` 비주얼 노벨 기준형.
- Produces: 전체 계약·빌드 통과 증거와 데스크톱·390px 접근성 확인 결과.

- [ ] **Step 1: 모든 정적 계약을 실행합니다**

Run:

```powershell
npm run check:visual-novel-story
npm run check:studio-pilot
npm run check:studio-expansion
npm run check:studio-expansion-all
npm run check:studio-rollout
npm run check:single-objective
npm run check:no-experience-bridge
npm run check:student-formal-style
npm run check:no-lesson-support-selector
npm run check:teacher-recording
npm run check:encoding
npm run lint
npm run build
```

Expected: every command exits 0; Vite emits the production bundle.

- [ ] **Step 2: 로컬 서버에서 데스크톱을 검증합니다**

Run: `npm run dev -- --port 4175`

Open: `http://127.0.0.1:4175/AITEXTBOOKforSTUDENTS/?lesson=m1-l1`

Verify:

- 왼쪽과 오른쪽 페이지가 같은 폭·높이입니다.
- 장면 1~4가 승인된 이미지 순서로 바뀝니다.
- 오른쪽 목표는 모든 장면과 지원 수준에서 동일합니다.
- 장면 1·2·3·4에 따라 지식 카드 1·2·3·3이 강조됩니다.
- 장면 4를 보기 전에는 하단 다음 버튼이 비활성화됩니다.
- `대사 듣기`를 누르기 전에는 음성이 나오지 않습니다.
- 장면 4 이후의 적용 활동도 자리·현재 정보 확인 이야기와 연결됩니다.

- [ ] **Step 3: 390px·글자 125%에서 검증합니다**

Set viewport width to `390px` and use the app font-size control at `125%`.

Verify:

- 책 펼침면이 왼쪽 이야기 다음 오른쪽 설명 순서로 세로 배치됩니다.
- 대화창이 인물 얼굴과 핵심 단서를 가리지 않습니다.
- 장면 버튼과 TTS 버튼이 가로 스크롤 없이 눌립니다.
- 지식 카드의 글자가 잘리거나 겹치지 않습니다.

- [ ] **Step 4: localStorage 과정기록을 확인합니다**

Complete the studio once and inspect `ai-students-studio-evidence-v2`.

Expected:

- `lessonId` is `m1-l1`.
- `supportLevel` matches the navigation setting.
- TTS를 눌렀다면 `supportModesUsed`에 `visual-novel-tts`가 있습니다.
- `firstAttempt`, `aiDecision`, `finalExpression`, `transferExpression`이 기존 형식으로 저장됩니다.

- [ ] **Step 5: 최종 상태를 확인하고 필요한 검증 수정만 커밋합니다**

```powershell
git status --short
git log -5 --oneline
```

검증에서 수정이 발생한 경우에만 다음 커밋을 만듭니다.

```powershell
git add src/features/studio/components/VisualNovelExperience.tsx src/features/studio/components/StudioExperience.tsx src/features/studio/StudioLessonView.tsx src/data/studios/m1.ts src/data/lessons/m1.ts src/features/studio/types.ts src/index.css scripts/check-visual-novel-social-story-contract.mjs scripts/check-studio-expansion-contract.mjs package.json
git commit -m "fix: polish m1-l1 visual novel pilot"
```
