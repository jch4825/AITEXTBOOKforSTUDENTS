# 68차시 콘텐츠 리모델링 Antigravity 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `docs/superpowers/specs/2026-07-23-68-lesson-content-remodel-prd.md`를 제품 정본으로 삼아 68차시 전체를 하나의 학습목표, 사건, 활동, 이미지, 수행 증거로 다시 구현한다.

**Architecture:** 차시별 `CanonicalLessonDesign`을 유일한 콘텐츠 원본으로 두고, 역할별 플래그십·안내 연습·프로젝트 렌더러가 같은 데이터를 읽는다. 모듈 단위 점진 이관 중에는 새 정본을 우선 렌더하고 기존 경로를 폴백으로 유지하며, 6개 모듈 승인 뒤 기존 `lessons`·`story`·`studios`·`modulePortfolios`의 경쟁 정본을 제거한다.

**Tech Stack:** React 19, TypeScript strict, Tailwind CSS v4, Vite, Node.js 계약 검사, 브라우저 수동 검증, localStorage.

**Product Spec:** `docs/superpowers/specs/2026-07-23-68-lesson-content-remodel-prd.md`

## Global Constraints

- PRD의 차시별 목표·핵심 개념·정본 스토리·활동·이미지·이펙트를 임의로 축약하거나 다른 소재로 교체하지 않는다.
- `masterObjective`는 UI 수준과 관계없이 하나만 사용한다. `easy`·`normal`·`hard`는 지원량과 증거 깊이만 바꾼다.
- 기존 성취기준은 보존하되 새 코드를 추측해 만들지 않는다.
- 차시별 고유 사건은 `CanonicalLessonDesign` 한 곳에서만 소유한다. 별도 스토리·비주얼노벨·미션 파일에 문안을 복제하지 않는다.
- 학생이 첫 판단을 하기 전에 정답·권장 선택·AI 결론을 노출하지 않는다.
- AI 응답은 `prepared`와 `live`를 화면에서 구분한다. 키 없음·호출 실패 때도 준비된 응답으로 차시가 끝까지 진행되어야 한다.
- 자유 텍스트·음성·그림 원본은 교사 설정과 동의 없이 영구 저장하거나 AI로 전송하지 않는다.
- 기존 화려한 홈과 교사 도구는 유지한다. 레슨 화면은 PC 우선 디지털 만화책 스프레드로 만들되 두꺼운 검은 만화 테두리를 쓰지 않는다.
- 각 모듈은 구현·브라우저 검증·사용자 승인 후에만 다음 모듈로 넘어간다.
- 사용자 소유의 관련 없는 변경을 수정하거나 커밋하지 않는다.

---

## 1. 이관 단위와 승인 순서

| 모듈 | 플래그십 | 안내 연습 | 프로젝트 | PRD 원본 |
|---|---|---|---|---|
| M1 | `m1-l1`, `m1-l4`, `m1-l10` | `m1-l2`, `m1-l3`, `m1-l5`~`m1-l9` | `m1-l11` | §9 |
| M2 | `m2-l1`, `m2-l6`, `m2-l10` | `m2-l2`~`m2-l5`, `m2-l7`~`m2-l9` | `m2-l11` | §10 |
| M3 | `m3-l1`, `m3-l5`, `m3-l9` | `m3-l2`~`m3-l4`, `m3-l6`~`m3-l8`, `m3-l10` | `m3-l11` | §11 |
| M4 | `m4-l1`, `m4-l5`, `m4-l10` | `m4-l2`~`m4-l4`, `m4-l6`~`m4-l9` | `m4-l11` | §12 |
| M5 | `m5-l1`, `m5-l6`, `m5-l11` | `m5-l2`~`m5-l5`, `m5-l7`~`m5-l10` | `m5-l12` | §13 |
| M6 | `m6-l1`, `m6-l4`, `m6-l11` | `m6-l2`, `m6-l3`, `m6-l5`~`m6-l10` | `m6-l12` | §14 |

최종 역할 수는 반드시 플래그십 18, 안내 연습 44, 프로젝트 6이다.

## 2. 목표 파일 구조

```text
src/
├── data/
│   └── canonicalLessons/
│       ├── types.ts
│       ├── shared.ts
│       ├── index.ts
│       ├── m1.ts
│       ├── m2.ts
│       ├── m3.ts
│       ├── m4.ts
│       ├── m5.ts
│       └── m6.ts
├── features/
│   └── canonicalLesson/
│       ├── CanonicalLessonView.tsx
│       ├── GuidedLessonView.tsx
│       ├── FlagshipLessonView.tsx
│       ├── ProjectLessonView.tsx
│       ├── LessonStageRenderer.tsx
│       ├── LessonEvidencePanel.tsx
│       ├── LessonArtifactBuilder.tsx
│       ├── LessonAsset.tsx
│       ├── useCanonicalLessonSession.ts
│       ├── evidenceStorage.ts
│       ├── evidenceSanitizer.ts
│       └── types.ts
├── components/
│   └── activities/
│       ├── EvidenceCompare.tsx
│       ├── EvidenceAnnotate.tsx
│       ├── ConditionAdjuster.tsx
│       ├── DataSort.tsx
│       ├── PlanBuilder.tsx
│       ├── SimpleCalculator.tsx
│       └── TransferPrompt.tsx
└── views/
    └── LessonView.tsx

scripts/
├── check-canonical-content.mjs
├── check-canonical-assets.mjs
├── check-canonical-copy.mjs
├── check-canonical-safety.mjs
└── check-canonical-dead-content.mjs

docs/
├── asset-prompts/
│   └── remodel/
│       ├── m1.md
│       ├── m2.md
│       ├── m3.md
│       ├── m4.md
│       ├── m5.md
│       └── m6.md
└── content-remodel/
    ├── m1-acceptance.md
    ├── m2-acceptance.md
    ├── m3-acceptance.md
    ├── m4-acceptance.md
    ├── m5-acceptance.md
    ├── m6-acceptance.md
    └── final-acceptance.md

public/
└── lessons/
    └── remodel/
        ├── m1/
        ├── m2/
        ├── m3/
        ├── m4/
        ├── m5/
        └── m6/
```

## 3. 정본 데이터 계약

`src/data/canonicalLessons/types.ts`에 다음 의미를 정확히 구현한다. `any`를 사용하지 않는다.

```ts
export type CanonicalLessonRole = 'flagship' | 'guided' | 'project';
export type CanonicalPhase =
  | 'encounter'
  | 'first-attempt'
  | 'concept'
  | 'condition-change'
  | 'compare'
  | 'decision'
  | 'artifact'
  | 'transfer'
  | 'complete';

export type CanonicalActivityKind =
  | 'single-choice'
  | 'multi-choice'
  | 'sort'
  | 'sequence'
  | 'compare'
  | 'annotate'
  | 'adjust'
  | 'calculate'
  | 'build'
  | 'expression'
  | 'ai-compare';

export interface CanonicalScenario {
  characters: CharacterId[];
  location: string;
  purpose: string;
  mismatch: string;
  evidence: string[];
  conditionChange?: string;
  resolution: string;
}

export interface CanonicalAssetSpec {
  id: string;
  kind: 'story' | 'evidence' | 'concept' | 'artifact';
  renderAs: 'image' | 'html' | 'audio';
  src?: string;
  alt: string;
  purpose: string;
  required: boolean;
}

export interface SupportAdjustment {
  hint?: string;
  visibleEvidenceIds?: string[];
  choiceLimit?: number;
  reasonCards?: { id: string; label: string }[];
  extraEvidenceIds?: string[];
}

export interface CanonicalStage {
  id: string;
  phase: CanonicalPhase;
  title: string;
  instruction: string;
  activity: CanonicalActivity;
  assetIds: string[];
  support: Record<SupportLevel, SupportAdjustment>;
}

export interface LessonArtifact {
  id: string;
  title: string;
  portfolioLabel: string;
  fields: {
    id: string;
    label: string;
    input: 'choice' | 'text' | 'speech' | 'draw' | 'computed';
    sourceStageId?: string;
    required: boolean;
  }[];
}

export interface TransferTask {
  title: string;
  scenario: string;
  activity: CanonicalActivity;
}

export interface CanonicalLessonDesign {
  lessonId: LessonId;
  moduleId: ModuleId;
  number: number;
  role: CanonicalLessonRole;
  title: string;
  masterObjective: string;
  standards: string[];
  coreConcepts: [string, ...string[]];
  canonicalScenario: CanonicalScenario;
  stages: CanonicalStage[];
  artifact: LessonArtifact;
  transfer: TransferTask;
  assets: CanonicalAssetSpec[];
  wrapUp: string;
}
```

`CanonicalActivity`는 위 11개 `kind`를 판별자로 쓰는 discriminated union으로 만든다. 모든 활동은 `id`, `prompt`, `evidenceIds`를 갖고, 종류별 필수 데이터는 다음과 같다.

- `single-choice`, `multi-choice`: `choices`
- `sort`: `bins`, `cards`
- `sequence`: `items`
- `compare`: `left`, `right`, `criteria`
- `annotate`: `targetId`, `markers`
- `adjust`: `controls`, `states`
- `calculate`: `values`, `operation`, `unit`
- `build`: `slots`, `pieces`
- `expression`: `modes`, `choiceCards`
- `ai-compare`: `source`, `response`, `criteria`, `decisions`

`support.full`, `support.light`, `support.challenge`은 문안·사건·정답을 새로 소유하지 않는다. `challenge`는 `extraEvidenceIds`와 이유 표현을 늘릴 수 있지만 전문어를 추가할 수 없다.

---

### Task 1: 현재 동작을 고정하는 리모델링 계약 검사 추가

**Files:**
- Create: `scripts/check-canonical-content.mjs`
- Create: `scripts/check-canonical-assets.mjs`
- Create: `scripts/check-canonical-copy.mjs`
- Create: `scripts/check-canonical-safety.mjs`
- Modify: `package.json`

**Interfaces:**
- `node scripts/check-canonical-content.mjs --registry`
- `node scripts/check-canonical-content.mjs --migrated`
- `node scripts/check-canonical-content.mjs --module=m1`
- `node scripts/check-canonical-content.mjs --module=m1 --role=flagship`
- `node scripts/check-canonical-content.mjs --all`
- `npm run check:canonical-assets`
- `npm run check:canonical-copy`
- `npm run check:canonical-safety`

- [ ] **Step 1: 콘텐츠 검사기를 먼저 작성하고 실패를 확인한다**

검사기는 모듈별 전체 ID, 역할 수, 목표 1개, 핵심 개념 1개 이상, 사건 필드, 단계 ID 중복, 활동 증거, 결과물, 전이, 정리 문장을 검사한다.

Run: `node scripts/check-canonical-content.mjs --module=m1`

Expected: `src/data/canonicalLessons`가 없어서 non-zero 종료.

- [ ] **Step 2: 에셋 검사기를 작성한다**

`renderAs: 'image'`이며 `required: true`인 모든 `src`가 `public` 아래에 실제로 존재하는지 확인한다. 절대 URL, `..`, 기존 누락 패턴 `-vn-`의 암묵적 추론을 금지한다.

- [ ] **Step 3: 한국어 문안 검사기를 작성한다**

학생 문안에서 `나눠습니다`, `알려 주십시오도`, `배웠입니다`, `자랑스러워습니다`와 PRD §4.2의 금지 전문어를 탐지한다. 기계적 종결어미 횟수만으로 통과시키지 말고 금지 목록과 빈 문장·과도한 문장 길이를 검사한다.

- [ ] **Step 4: 안전 정본 검사기를 작성한다**

다음 패턴을 최소 금지 목록으로 둔다.

```text
AI에게 다시 물어보면 확인
AI가 알려준 병원
AI가 알려준 실시간 날씨
비밀번호를 친구
인증 코드를
사진은 절대
AI가 감정을
```

`prepared` 응답을 `실제 AI`로 표시하는 데이터도 실패시킨다.

- [ ] **Step 5: package script를 등록한다**

```json
"check:canonical-content": "node scripts/check-canonical-content.mjs --migrated",
"check:canonical-assets": "node scripts/check-canonical-assets.mjs",
"check:canonical-copy": "node scripts/check-canonical-copy.mjs",
"check:canonical-safety": "node scripts/check-canonical-safety.mjs"
```

- [ ] **Step 6: 검사기만 따로 커밋하지 않는다**

Task 2의 최소 정본 데이터와 함께 통과 상태로 커밋한다.

### Task 2: 정본 타입·레지스트리와 점진 이관 경로 구현

**Files:**
- Create: `src/data/canonicalLessons/types.ts`
- Create: `src/data/canonicalLessons/shared.ts`
- Create: `src/data/canonicalLessons/index.ts`
- Modify: `package.json`

**Interfaces:**

```ts
export const MIGRATED_MODULE_IDS = [] as const;
export const ALL_CANONICAL_LESSONS: CanonicalLessonDesign[];
export function getCanonicalLesson(lessonId: LessonId): CanonicalLessonDesign | undefined;
export function getCanonicalLessonSummary(lessonId: LessonId): {
  id: LessonId;
  title: string;
  objective: string;
  usesLiveAi: boolean;
} | undefined;
```

- [ ] **Step 1: Task 1의 실패하는 검사기 위에 타입과 레지스트리를 구현한다**

`shared.ts`에는 지원 프로필, 공통 표현 모드, 성취기준 문자열만 둔다. 이야기나 차시별 활동 문안을 넣지 않는다.

- [ ] **Step 2: 비어 있는 점진 이관 레지스트리를 만든다**

`MIGRATED_MODULE_IDS`와 `ALL_CANONICAL_LESSONS`는 비어 있는 상태로 시작한다. 부분 작성된 모듈은 앱에 등록하지 않는다. `--registry`는 빈 레지스트리의 타입·중복·지원 수준 계약만 검사하고, `--migrated`는 등록된 모듈만 완전성을 검사한다.

- [ ] **Step 3: 레지스트리 계약을 통과시킨다**

Run: `node scripts/check-canonical-content.mjs --registry`

Expected: exit 0, migrated modules 0.

- [ ] **Step 4: 타입·인코딩을 검증하고 커밋한다**

Run: `npm run lint`

Expected: exit 0.

Run: `npm run check:encoding`

Expected: exit 0.

Commit: `feat(content): add canonical lesson contract and migration path`

### Task 3: 모든 차시용 수행 증거 v3 구현

**Files:**
- Create: `src/features/canonicalLesson/types.ts`
- Create: `src/features/canonicalLesson/evidenceSanitizer.ts`
- Create: `src/features/canonicalLesson/evidenceStorage.ts`
- Create: `src/features/canonicalLesson/useCanonicalLessonSession.ts`
- Modify: `src/features/teacher/StudioEvidencePanel.tsx`
- Modify: `src/features/studio/evidenceStorage.ts`
- Create: `scripts/check-canonical-evidence.mjs`
- Modify: `package.json`

**Interfaces:**

```ts
export interface CanonicalLessonEvidenceV3 {
  version: 3;
  id: string;
  learnerAlias: string;
  lessonId: LessonId;
  moduleId: ModuleId;
  role: CanonicalLessonRole;
  supportLevel: SupportLevel;
  supportModesUsed: string[];
  responses: Record<string, PersistedLessonResponse>;
  artifact: { artifactId: string; fields: Record<string, PersistedLessonResponse> };
  changedReason?: PersistedLessonResponse;
  transfer?: PersistedLessonResponse;
  startedAt: string;
  completedAt: string;
  updatedAt: string;
}
```

저장 키는 `ai-students-lesson-evidence-v3`로 한다. 기존 `ai-students-studio-evidence-v2`는 읽기 전용 호환 소스로 유지한다.

- [ ] **Step 1: sanitizer 단위 계약을 실패 상태로 작성한다**

텍스트·음성은 trim 후 300자, 선택 ID는 8개, 지원 방식은 20개로 제한한다. 그림은 원본 data URL 대신 `{ mode: 'draw', hasDrawing: true }`만 저장한다.

- [ ] **Step 2: 세션 상태를 `lessonId`로 완전히 초기화한다**

높은 단계의 차시에서 짧은 차시로 이동해도 단계·응답·에셋 인덱스가 남지 않아야 한다.

- [ ] **Step 3: 완료 조건을 구현한다**

일반 차시는 건너뛰기를 허용하되 빈 응답을 성공 기록으로 저장하지 않는다. 프로젝트는 필수 artifact 필드와 새 통합 과제 응답이 있어야 완료된다.

- [ ] **Step 4: 교사 패널에서 v2와 v3를 함께 읽는다**

v2 기록을 변경하거나 재저장하지 않는다. v3에는 첫 판단, 최종 표현, 바뀐 이유, 결과물, 전이를 구분해 보여 준다.

- [ ] **Step 5: 검증하고 커밋한다**

Run: `node scripts/check-canonical-evidence.mjs`

Expected: sanitizer-to-reader round trip, 빈 기록 거부, 그림 원본 비저장, v2 읽기 호환 PASS.

`package.json`에 다음 명령을 등록한다.

```json
"check:canonical-evidence": "node scripts/check-canonical-evidence.mjs"
```

Commit: `feat(content): add privacy-safe evidence for every lesson`

### Task 4: 역할별 공통 렌더러와 활동 부품 구현

**Files:**
- Create: `src/features/canonicalLesson/CanonicalLessonView.tsx`
- Create: `src/features/canonicalLesson/GuidedLessonView.tsx`
- Create: `src/features/canonicalLesson/FlagshipLessonView.tsx`
- Create: `src/features/canonicalLesson/ProjectLessonView.tsx`
- Create: `src/features/canonicalLesson/LessonStageRenderer.tsx`
- Create: `src/features/canonicalLesson/LessonEvidencePanel.tsx`
- Create: `src/features/canonicalLesson/LessonArtifactBuilder.tsx`
- Create: `src/components/activities/EvidenceCompare.tsx`
- Create: `src/components/activities/EvidenceAnnotate.tsx`
- Create: `src/components/activities/ConditionAdjuster.tsx`
- Create: `src/components/activities/DataSort.tsx`
- Create: `src/components/activities/PlanBuilder.tsx`
- Create: `src/components/activities/SimpleCalculator.tsx`
- Create: `src/components/activities/TransferPrompt.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/ContentsView.tsx`
- Modify: `src/components/SidebarTree.tsx`
- Modify: `src/utils/lessonResume.ts`
- Modify: `src/index.css`

**Interfaces:**
- 플래그십: 8개 의미 단계 전부 사용.
- 안내 연습: `encounter → concept → activity → artifact → transfer → complete`.
- 프로젝트: `encounter → evidence-pick → plan → build → review → present → complete`.

- [ ] **Step 1: `CanonicalLessonView`에서 역할만 분기한다**

차시별 `if (lessonId === ...)` 분기를 금지한다. 모든 차시 고유 차이는 데이터에서 온다.

- [ ] **Step 2: 새 정본 우선 라우팅과 요약 폴백을 추가한다**

`LessonView`의 분기 순서를 다음과 같이 바꾼다.

```text
getCanonicalLesson
→ CanonicalLessonView
→ 기존 getStudioDefinition
→ 기존 getModulePortfolioDefinition
→ 기존 ImplementedLesson
```

목차, 사이드바, 이어하기는 `getCanonicalLessonSummary`를 먼저 읽고, 이관하지 않은 모듈만 기존 `getLesson`로 폴백한다.

- [ ] **Step 3: 공통 스프레드 골격을 만든다**

1280px 이상은 이야기와 활동이 좌우 페이지로 읽히고, 태블릿·모바일은 논리 순서대로 한 열이 된다. 두꺼운 검은 테두리 대신 종이 면, 여백, 얇은 구분선, 모듈 색, 이미지 비율로 위계를 만든다.

- [ ] **Step 4: 11개 활동 종류를 키보드·터치로 구현한다**

버튼 최소 높이 44px, 선택 상태는 색 외 아이콘·텍스트를 함께 사용한다. 드래그 활동은 반드시 클릭 대체 조작을 제공한다.

- [ ] **Step 5: 지원 수준을 활동 안에서 적용한다**

`full`은 선택 수·증거 수를 줄이고 AAC·힌트를 먼저 보인다. `light`는 PRD 기준값을 쓴다. `challenge`는 추가 증거·예외·이유를 보이되 목표와 결론은 바꾸지 않는다.

- [ ] **Step 6: 모션 대체를 구현한다**

가림 해제, diff, 연결선, 조립 효과는 `prefers-reduced-motion: reduce`에서 중간 애니메이션 없이 최종 상태로 바뀐다.

- [ ] **Step 7: 타입·기존 계약을 검증하고 커밋한다**

Run: `npm run lint`

Run: `npm run check:expression-input-mobile`

Run: `npm run check:debug-navigation`

Expected: 모두 exit 0.

Commit: `feat(content): add canonical lesson experiences`

### Task 5: 에셋 매니페스트·생성 프롬프트·실패 UI 구현

**Files:**
- Create: `docs/asset-prompts/remodel/m1.md`
- Create: `src/features/canonicalLesson/LessonAsset.tsx`
- Modify: `scripts/check-canonical-assets.mjs`
- Add generated/reused files under: `public/lessons/remodel/m1/`

- [ ] **Step 1: M1의 모든 에셋을 PRD §9.3에서 매니페스트로 옮긴다**

명명 규칙:

```text
public/lessons/remodel/m1/{lessonId}-story-01.webp
public/lessons/remodel/m1/{lessonId}-evidence-01.webp
public/lessons/remodel/m1/{lessonId}-concept-01.webp
public/lessons/remodel/m1/{lessonId}-artifact-01.webp
```

플래그십은 story 4컷, 안내 연습은 story 2컷, 프로젝트는 story 3컷을 갖는다. 기능 자료를 HTML로 정확히 만들 수 있으면 `renderAs: 'html'`을 사용하고 가짜 이미지 파일을 만들지 않는다.

- [ ] **Step 2: 생성 프롬프트를 작성한다**

각 프롬프트에 차시 ID, 컷 번호, 등장인물, 장소, 목적, 행동, 표정, 소품, 시간대, 카메라 구도, 앞뒤 컷 연속성, 빈 말풍선, 이미지 내 글자 금지를 명시한다.

- [ ] **Step 3: 기존 에셋은 사건 일치 검사를 통과할 때만 복사한다**

`m1-l4` 여우 실험처럼 PRD와 인물·사건·근거가 같은 경우만 새 경로로 복사한다. 기존 파일 경로를 정본 데이터에서 직접 참조하지 않는다.

- [ ] **Step 4: 로딩 실패를 학습 실패로 만들지 않는다**

누락 시 캐릭터 장면 폴백과 정확한 alt를 보여 주되, 증거 이미지가 없으면 판단 활동을 완료된 것으로 처리하지 않는다.

- [ ] **Step 5: 에셋 검사를 통과시키고 커밋한다**

Run: `npm run check:canonical-assets`

Expected: M1 필수 이미지 참조 누락 0.

Commit: `feat(content): add M1 canonical asset pipeline`

### Task 6: M1 플래그십 3개 구현

**Files:**
- Create: `src/data/canonicalLessons/m1.ts`
- Modify: `docs/asset-prompts/remodel/m1.md`
- Add/replace: `public/lessons/remodel/m1/m1-l1-*`
- Add/replace: `public/lessons/remodel/m1/m1-l4-*`
- Add/replace: `public/lessons/remodel/m1/m1-l10-*`

- [ ] **Step 1: `m1-l1`을 PRD §9.3 그대로 구현한다**

토스터·생성 원리 과적재를 제거한다. 생활 속 AI 기능 찾기, 어려운 설명 정리, AI 정의 카드, 학생 표현을 하나의 첫 만남 사건으로 연결한다.

- [ ] **Step 2: `m1-l4`를 여우 사진 실험 하나로 통일한다**

음성 인식 소재를 제거하고 가림·밝기·각도 변화, AI 첫 답, 원본 확인, 흐린 분리배출 표지판 전이를 구현한다.

- [ ] **Step 3: `m1-l10`의 실제 AI와 준비된 응답을 분리한다**

행사 배경음악 사건에서 최초 요청, 조건표, 수정 요청, 사용·수정·거절, 확인 근거를 모두 기록한다.

- [ ] **Step 4: 플래그십 증거가 v3에 남는지 확인한다**

첫 판단, AI 판단, 최종 판단, 변화 이유, 결과물, 전이가 각각 다른 키로 저장되어야 한다.

- [ ] **Step 5: 플래그십 범위 계약을 통과시키고 커밋한다**

Run: `node scripts/check-canonical-content.mjs --module=m1 --role=flagship`

Expected: `m1-l1`, `m1-l4`, `m1-l10`만 검사해 플래그십 3개 PASS. 이 단계에서는 M1을 레지스트리에 등록하지 않는다.

Run: `npm run check:canonical-copy`

Run: `npm run check:canonical-safety`

Commit: `feat(content): remodel M1 flagship lessons`

### Task 7: M1 안내 연습 7개와 프로젝트 구현

**Files:**
- Modify: `src/data/canonicalLessons/m1.ts`
- Modify: `src/data/canonicalLessons/index.ts`
- Modify: `docs/asset-prompts/remodel/m1.md`
- Add/replace: `public/lessons/remodel/m1/m1-l2-*`
- Add/replace: `public/lessons/remodel/m1/m1-l3-*`
- Add/replace: `public/lessons/remodel/m1/m1-l5-*` through `m1-l9-*`
- Add/replace: `public/lessons/remodel/m1/m1-l11-*`

- [ ] **Step 1: 안내 연습을 PRD §9.3의 고유 활동으로 각각 구현한다**

```text
m1-l2 기능 설계 카드
m1-l3 그대로 사용/확인할 부분 표시지
m1-l5 편한 입력 방법 카드
m1-l6 학습 자료 전후 결과표
m1-l7 원문-요약-번역 비교지
m1-l8 도움 경계 지도
m1-l9 도구 선택 설계서
```

- [ ] **Step 2: `m1-l11`을 모듈 전체 프로젝트로 구현한다**

M1의 10개 차시 기록을 모두 목록에 보이고 최소 3개를 고르게 한다. 기록이 없어도 새 통합 장면을 해결하고 `아이미 사용 설명서` 필수 필드를 채워야 완료된다.

- [ ] **Step 3: M1 누적 서사를 확인한다**

앞 차시 결과물이 다음 차시 도입 또는 프로젝트에서 실제로 다시 보이게 한다. 단순 문장 언급은 회수로 인정하지 않는다.

- [ ] **Step 4: M1 전체가 완성된 뒤 레지스트리에 등록한다**

`MIGRATED_MODULE_IDS`를 `['m1']`로 바꾸고 `M1_CANONICAL_LESSONS`를 `ALL_CANONICAL_LESSONS`에 포함한다. 이 커밋부터 M1 라우팅이 새 렌더러로 전환된다.

- [ ] **Step 5: 전체 검사를 통과시키고 커밋한다**

Run: `node scripts/check-canonical-content.mjs --module=m1`

Run: `npm run check:canonical-assets`

Run: `npm run lint`

Run: `npm run build`

Commit: `feat(content): complete M1 canonical remodel`

### Task 8: M1 브라우저 검증과 사용자 승인

**Files:**
- Create: `docs/content-remodel/m1-acceptance.md`

- [ ] **Step 1: PC·모바일·확대 상태를 검증한다**

검증 차시: `m1-l1`, `m1-l2`, `m1-l4`, `m1-l10`, `m1-l11`.

```text
1280x800, 보통
390x844, 보통
390x844, 125% 글자
1280x800, 도전적
prefers-reduced-motion: reduce
```

- [ ] **Step 2: 라우팅과 저장을 검증한다**

`m1-l10`의 높은 단계에서 `m1-l2`로 이동해 첫 단계로 초기화되는지, 새로고침 뒤 M1 증거가 복구되는지, 그림 원본이 저장되지 않는지 확인한다.

- [ ] **Step 3: 접근성·문안 점검 결과를 기록한다**

각 차시별 목표, 사건, 활동, 에셋, 결과물, 전이, TTS, 키보드, 모바일, 문제와 수정 내용을 `m1-acceptance.md`에 기록한다.

- [ ] **Step 4: 사용자에게 M1을 보여 주고 승인을 기다린다**

승인 전에는 `MIGRATED_MODULE_IDS`에 `m2`를 추가하지 않는다.

### Task 9: M2 리모델링

**Files:**
- Create: `src/data/canonicalLessons/m2.ts`
- Create: `docs/asset-prompts/remodel/m2.md`
- Add: `public/lessons/remodel/m2/`
- Create: `docs/content-remodel/m2-acceptance.md`
- Modify: `src/data/canonicalLessons/index.ts`

- [ ] **Step 1: PRD §10.3의 11개 차시를 정본 데이터로 옮긴다**

플래그십은 `m2-l1`, `m2-l6`, `m2-l10`; 프로젝트는 `m2-l11`; 나머지는 안내 연습으로 고정한다.

- [ ] **Step 2: 하나의 체험회 안내 요청이 차시마다 개선되게 한다**

각 차시 산출물은 목적·핵심·대상·예시·역할·단계·수정·형식·독립 확인을 누적한 `나의 프롬프트 노트`의 실제 항목이어야 한다.

- [ ] **Step 3: 독립 검증 행동을 구현한다**

같은 AI에게 재질문하는 것을 검증으로 표시하지 않는다. 학교 공지, 교사, 공식 자료처럼 AI와 독립된 근거를 화면에서 비교한다.

- [ ] **Step 4: 에셋·증거·프로젝트를 연결한다**

M2 전체 차시 기록을 `m2-l11`에서 선택하고 새 요청을 실제로 완성해야 한다.

- [ ] **Step 5: 검사·브라우저 검증·승인 문서를 완료한다**

Run: `node scripts/check-canonical-content.mjs --module=m2`

Run: `npm run check:canonical-assets`

Run: `npm run check:canonical-copy`

Run: `npm run check:canonical-safety`

브라우저 검증: `m2-l1`, `m2-l2`, `m2-l6`, `m2-l10`, `m2-l11`을 Task 8의 다섯 환경에서 확인한다.

- [ ] **Step 6: 커밋하고 사용자 승인을 기다린다**

Commit: `feat(content): remodel module 2 prompt notebook`

승인 전에는 M3를 시작하지 않는다.

### Task 10: M3 리모델링

**Files:**
- Create: `src/data/canonicalLessons/m3.ts`
- Create: `docs/asset-prompts/remodel/m3.md`
- Add: `public/lessons/remodel/m3/`
- Create: `docs/content-remodel/m3-acceptance.md`
- Modify: `src/data/canonicalLessons/index.ts`

- [ ] **Step 1: PRD §11.3의 11개 차시를 구현한다**

플래그십은 `m3-l1`, `m3-l5`, `m3-l9`; 프로젝트는 `m3-l11`이다.

- [ ] **Step 2: 학습 결과보다 공부 과정을 증거로 남긴다**

질문, 쉬운 설명, 예시, 번역, 요약, 퀴즈, 계획, 복습, 이미지 관찰, 발표 준비의 결과물을 `나의 공부 도우미 도구함`에 누적한다.

- [ ] **Step 3: 사실·추측·AI 제안을 명확히 구분한다**

사진을 보고 감정·의도·진단을 단정하지 않는다. 이미지에서 실제로 보이는 것과 추측을 서로 다른 응답 필드로 저장한다.

- [ ] **Step 4: 검사·대표 차시 브라우저 검증을 완료한다**

Run: `node scripts/check-canonical-content.mjs --module=m3`

Run: `npm run check:canonical-assets`

Run: `npm run lint`

브라우저 검증: `m3-l1`, `m3-l2`, `m3-l5`, `m3-l9`, `m3-l11`.

- [ ] **Step 5: 커밋하고 사용자 승인을 기다린다**

Commit: `feat(content): remodel module 3 learning toolkit`

승인 전에는 M4를 시작하지 않는다.

### Task 11: M4 리모델링

**Files:**
- Create: `src/data/canonicalLessons/m4.ts`
- Create: `docs/asset-prompts/remodel/m4.md`
- Add: `public/lessons/remodel/m4/`
- Create: `docs/content-remodel/m4-acceptance.md`
- Modify: `src/data/canonicalLessons/index.ts`

- [ ] **Step 1: PRD §12.3 안전 정본을 먼저 상수와 검사 규칙으로 고정한다**

개인정보, 비밀번호·인증 코드, 사진 공유, 낯선 링크, 도움 요청, 건강 정보 규칙이 차시마다 다른 표현으로 충돌하지 않게 한다.

- [ ] **Step 2: PRD §12.4의 11개 차시를 구현한다**

플래그십은 `m4-l1`, `m4-l5`, `m4-l10`; 프로젝트는 `m4-l11`이다.

- [ ] **Step 3: 위험을 재현하지 않고 판단 자료를 제공한다**

개인정보·유해 표현·가짜 링크는 학습에 필요한 최소한만 보여 준다. 실제 클릭 가능한 위험 링크나 실제 학생 정보는 사용하지 않는다.

- [ ] **Step 4: `AI 안전 여권`에 전 차시 기록을 회수한다**

세 플래그십만이 아니라 M4의 10개 차시 산출물 전체를 선택할 수 있어야 한다.

- [ ] **Step 5: 검사·대표 차시 브라우저 검증을 완료한다**

Run: `node scripts/check-canonical-content.mjs --module=m4`

Run: `npm run check:canonical-safety`

Run: `npm run check:canonical-copy`

Run: `npm run build`

브라우저 검증: `m4-l1`, `m4-l2`, `m4-l5`, `m4-l10`, `m4-l11`.

- [ ] **Step 6: 커밋하고 사용자 승인을 기다린다**

Commit: `feat(content): remodel module 4 safety passport`

승인 전에는 M5를 시작하지 않는다.

### Task 12: M5 리모델링

**Files:**
- Create: `src/data/canonicalLessons/m5.ts`
- Create: `docs/asset-prompts/remodel/m5.md`
- Add: `public/lessons/remodel/m5/`
- Create: `docs/content-remodel/m5-acceptance.md`
- Modify: `src/data/canonicalLessons/index.ts`

- [ ] **Step 1: PRD §13.3의 12개 차시를 구현한다**

플래그십은 `m5-l1`, `m5-l6`, `m5-l11`; 프로젝트는 `m5-l12`이다.

- [ ] **Step 2: 모든 활동을 실제 문제 해결 흔적으로 만든다**

문제 정의, 정보 선택, 원인·결과, 해결안 비교, 단계 계획, 안전한 단서 추가, 실행 점검, 오류 수정, 협력, 도구 선택, 조건 변화 대응을 `문제 해결 지도`에 누적한다.

- [ ] **Step 3: 조건 변화에서 기존 계획을 실제로 수정한다**

처음 선택을 무조건 틀렸다고 만들지 않는다. 새 증거로 유지·부분 수정·교체가 모두 가능한 활동을 구성한다.

- [ ] **Step 4: 검사·대표 차시 브라우저 검증을 완료한다**

Run: `node scripts/check-canonical-content.mjs --module=m5`

Run: `npm run check:canonical-assets`

Run: `npm run lint`

브라우저 검증: `m5-l1`, `m5-l2`, `m5-l6`, `m5-l11`, `m5-l12`.

- [ ] **Step 5: 커밋하고 사용자 승인을 기다린다**

Commit: `feat(content): remodel module 5 problem-solving map`

승인 전에는 M6를 시작하지 않는다.

### Task 13: M6 리모델링

**Files:**
- Create: `src/data/canonicalLessons/m6.ts`
- Create: `docs/asset-prompts/remodel/m6.md`
- Add: `public/lessons/remodel/m6/`
- Create: `docs/content-remodel/m6-acceptance.md`
- Modify: `src/data/canonicalLessons/index.ts`

- [ ] **Step 1: PRD §14.3의 생활 판단 루프를 공통 단계로 사용한다**

`목적과 현재 조건 확인 → 공식 자료·도구 사용 → AI 제안과 비교 → 사람 확인 필요성 판단 → 최종 행동 선택`.

- [ ] **Step 2: PRD §14.4의 12개 차시를 구현한다**

플래그십은 `m6-l1`, `m6-l4`, `m6-l11`; 프로젝트는 `m6-l12`이다.

- [ ] **Step 3: 돈·길·날씨·건강 판단에 실제 기능 자료를 사용한다**

돈은 계산기와 가격표, 길·교통·날씨는 공식 최신 자료 표시, 건강은 보호자·교사·의료기관 우선 경로를 사용한다. AI가 임의로 만든 수치·병원·노선을 사실처럼 쓰지 않는다.

- [ ] **Step 4: 졸업 프로젝트에서 M1~M6 기록을 회수한다**

각 모듈 결과물 하나 이상을 선택해 `나의 AI 생활 포트폴리오`를 완성하고 새 통합 생활 문제를 해결해야 완료된다.

- [ ] **Step 5: 검사·대표 차시 브라우저 검증을 완료한다**

Run: `node scripts/check-canonical-content.mjs --module=m6`

Run: `npm run check:canonical-assets`

Run: `npm run check:canonical-safety`

Run: `npm run build`

브라우저 검증: `m6-l1`, `m6-l2`, `m6-l4`, `m6-l11`, `m6-l12`.

- [ ] **Step 6: 커밋하고 사용자 승인을 기다린다**

Commit: `feat(content): remodel module 6 life portfolio`

### Task 14: 기존 경쟁 정본과 도달 불가능 콘텐츠 제거

**Files:**
- Modify: `src/views/LessonView.tsx`
- Modify: `src/views/ContentsView.tsx`
- Modify: `src/components/SidebarTree.tsx`
- Modify: `src/components/lesson/EpisodeHeroSpread.tsx`
- Modify: `src/features/teacher/LegacyTeacherPanels.tsx`
- Delete after import audit: `src/data/story.ts`
- Delete after import audit: `src/data/lessons/m1.ts` through `src/data/lessons/m6.ts`
- Delete after import audit: `src/data/lessons/hard/`
- Delete after import audit: `src/data/studios/m1.ts` through `src/data/studios/m6.ts`
- Delete after import audit: `src/data/studios/visualStories/`
- Delete after import audit: `src/data/modulePortfolios/`
- Delete or reduce to v2 compatibility only: `src/features/studio/`
- Create: `scripts/check-canonical-dead-content.mjs`
- Modify: `package.json`

- [ ] **Step 1: 68개 정본 커버리지를 확인한다**

Run: `node scripts/check-canonical-content.mjs --all`

Expected: 68 lessons, 18 flagship, 44 guided, 6 project.

- [ ] **Step 2: `LessonView`의 폴백 분기를 제거한다**

모든 실제 차시는 `getCanonicalLesson`로만 렌더한다. 없는 ID만 `ComingSoonLesson`로 간다.

- [ ] **Step 3: 소비자를 새 레지스트리로 전환한다**

목차, 사이드바, 이어하기, 교사 목표·성취기준 패널, 에피소드 헤더가 모두 정본 데이터를 읽게 한다.

- [ ] **Step 4: 기존 데이터 import가 0인지 확인한 뒤 삭제한다**

삭제 전에 다음 검색 결과가 호환 리더 외에는 0이어야 한다.

```text
LESSON_STORIES
getLessonStory
getStudioDefinition
getModulePortfolioDefinition
M1_L2_VISUAL_STORY
LessonContent.steps
```

- [ ] **Step 5: v2 기록 호환 코드는 분리해 남긴다**

기존 학생 기록을 읽기 위해 필요한 `StudioEvidenceV2` 타입과 reader는 `src/features/canonicalLesson/legacyStudioEvidence.ts`로 옮긴다. 기존 스튜디오 렌더러와 차시 문안은 보존 이유가 없다.

- [ ] **Step 6: dead-content 검사를 등록하고 통과시킨다**

Run: `node scripts/check-canonical-dead-content.mjs`

Expected: 경쟁 정본 import와 누락 에셋 추론 0.

- [ ] **Step 7: 기본 콘텐츠 검사 명령을 전체 검사로 전환한다**

`package.json`의 `check:canonical-content`를 `node scripts/check-canonical-content.mjs --all`로 바꾼다.

- [ ] **Step 8: 검증하고 커밋한다**

Run: `npm run lint`

Run: `npm run check:encoding`

Run: `npm run build`

Commit: `refactor(content): remove legacy competing lesson sources`

### Task 15: 68차시 최종 통합 검증

**Files:**
- Create: `docs/content-remodel/final-acceptance.md`
- Modify if needed: `docs/teacher-guide.md`
- Modify if needed: `CLAUDE.md`

- [ ] **Step 1: 모든 자동 검사를 실행한다**

```text
npm run lint
npm run check:encoding
npm run check:canonical-content
npm run check:canonical-assets
npm run check:canonical-copy
npm run check:canonical-safety
node scripts/check-canonical-evidence.mjs
node scripts/check-canonical-dead-content.mjs
npm run check:expression-input-mobile
npm run check:debug-navigation
npm run build
```

Expected: 모두 exit 0.

- [ ] **Step 2: 68차시 전체 라우팅 스모크를 실행한다**

각 차시의 첫 화면, 마지막 화면, 목표, 필수 에셋, 결과물 제목이 렌더되는지 자동 또는 브라우저 스크립트로 확인한다. 콘솔 오류, 깨진 이미지, 빈 본문은 0이어야 한다.

- [ ] **Step 3: 모듈별 대표 완주를 다시 검증한다**

각 모듈에서 플래그십 1개, 안내 연습 1개, 프로젝트 1개를 처음부터 완료한다. M1의 `m1-l10 → m1-l2` 상태 초기화와 M6의 전 모듈 기록 회수를 포함한다.

- [ ] **Step 4: 문안 낭독 검토를 완료한다**

68개 목표와 정리 문장을 TTS로 듣고 비문, 너무 긴 문장, 정의되지 않은 전문어, 부자연스러운 캐릭터 대사를 수정한다.

- [ ] **Step 5: 최종 안전 감사를 기록한다**

PRD §20.2의 돈·길·날씨·건강·개인정보·인증·사진·유해 콘텐츠 항목마다 확인한 차시 ID와 근거를 `final-acceptance.md`에 적는다.

- [ ] **Step 6: 최종 시각 감사를 기록한다**

1280px, 390px, 390px+125%, reduced-motion에서 잘림, 가로 스크롤, 증거 가독성, 포커스 순서, 버튼 크기, 이미지-대본 일치를 기록한다.

- [ ] **Step 7: 교사 문서를 현재 구조로 갱신한다**

교사에게 세 역할, 고정 학습목표, 지원 수준, 준비된 AI/실제 AI 구분, 로컬 증거, 프로젝트 완료 조건을 설명한다. 삭제된 스튜디오·미션 구조를 현재 기능처럼 문서에 남기지 않는다.

- [ ] **Step 8: 최종 커밋 전 변경 범위를 확인한다**

관련 없는 사용자 파일이 staged 상태에 포함되지 않아야 한다.

Commit: `docs(content): finalize 68-lesson remodel verification`

---

## 4. 모듈별 승인 문서 필수 표

각 `docs/content-remodel/m{n}-acceptance.md`에는 다음 표를 차시 수만큼 작성한다.

| ID | 목표 1개 | 정본 사건 | 고유 증거 활동 | 저장 결과물 | 전이 | 필수 에셋 존재 | 1280px | 390px | 125% | TTS | 수정 사항 |
|---|---|---|---|---|---|---|---|---|---|---|---|

승인 문서 마지막에는 다음 수치를 적는다.

```text
전체 차시:
플래그십:
안내 연습:
프로젝트:
이미지 참조:
누락 이미지:
문안 검사 오류:
안전 검사 오류:
브라우저 콘솔 오류:
사용자 승인:
```

## 5. Antigravity 시작 명령

아래 문장을 PRD와 이 계획 문서와 함께 전달한다.

> `docs/superpowers/specs/2026-07-23-68-lesson-content-remodel-prd.md`를 제품 내용 정본으로, `docs/superpowers/plans/2026-07-23-68-lesson-content-remodel-antigravity.md`를 실행 순서 정본으로 사용하라. Task 1부터 체크박스 순서대로 진행하고 각 Task의 검사와 커밋을 완료하라. 모듈 승인 게이트에서는 반드시 멈추고 사용자 확인을 받아라. 기존 콘텐츠를 자동 보정하거나 도전적 문안만 늘리지 말고, 같은 차시의 목표·사건·지식·활동·이미지·결과물을 `CanonicalLessonDesign` 하나로 통합하라. 관련 없는 사용자 변경은 건드리지 마라.
