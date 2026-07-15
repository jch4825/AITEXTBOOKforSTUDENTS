# 교차 차시 판단 순환 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 6단원에서 단원 중간의 첫 판단과 단원 마지막의 수정·전이 판단을 과정 증거로 연결한다.

**Architecture:** 기존 `MissionStep`을 유지하고 `judgment-preview`, `judgment-main` 전용 블록과 `cycleId` 기반 공통 localStorage 훅을 추가한다. 예고는 각 단원 6차시, 본 활동은 각 단원 마무리 차시에 둔다. 교사 관찰평가는 학생 완료 조건과 분리한다.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, 기존 Web Speech API 래퍼, localStorage, Playwright CLI.

## Global Constraints

- 이 브라우저에서 학생 1명이 사용하는 localStorage 기록만 지원한다.
- Gemini API 키나 네트워크 없이 전체 활동이 진행되어야 한다.
- 예고에서는 정답·점수·즉시 해설을 표시하지 않는다.
- 첫 선택 유지도 타당한 비교·이유가 있으면 성공 증거다.
- 기존 미션 블록·TTS·인쇄·UTF-8·strict TypeScript 규칙을 보존한다.
- 선택·AAC·말/글·그림 표현과 reduced-motion을 지원한다.
- 기존 미추적 파일은 건드리지 않는다.

---

### Task 1: 타입과 저장 계약

**Files:**
- Modify: `src/types.ts`
- Create: `src/utils/generalizationStorage.ts`
- Create: `src/components/mission/useGeneralizationCycle.ts`
- Create: `scripts/check-generalization-contract.mjs`
- Modify: `package.json`

**Interfaces:**
- `MissionBlock`에 `JudgmentPreviewBlock | JudgmentMainBlock`을 추가한다.
- `useGeneralizationCycle(cycleId)`는 `{ record, update, reset, storageError }`를 반환한다.
- 저장 유틸은 `readGeneralizationRecords`, `writeGeneralizationRecords`, `updateGeneralizationRecord`를 export한다.

- [ ] **Step 1: 실패하는 계약 검사를 작성한다.**

검사는 두 새 파일과 `JudgmentPreviewBlock`, `JudgmentMainBlock`, `GeneralizationCycleRecord` 표식을 요구한다.

Run: `node scripts/check-generalization-contract.mjs`

Expected: missing-file 오류로 FAIL.

- [ ] **Step 2: 최소 타입과 저장 유틸을 구현한다.**

`src/types.ts`에 `GeneralizationExpressionMode`, `GeneralizationAiDecision`, `GeneralizationHelpLevel`, `GeneralizationObservationStatus`, `GeneralizationExpression`, `GeneralizationObservation`, `GeneralizationCycleRecord`, 두 블록 타입을 추가한다. record에는 학생 이름, 예고 첫 생각, 중요 정보, 두 개 이상의 탐색 방법, AI 판단, 최종 생각, 전이 선택, 교사 관찰을 둔다.

`src/utils/generalizationStorage.ts`는 `STORAGE_KEY = 'ai-students-generalization-v1'`을 사용하고 storage 미지원·JSON 손상 시 빈 객체로 복구한다. 부분 갱신은 기존 필드를 보존한다.

- [ ] **Step 3: 검사 명령을 연결하고 통과시킨다.**

`package.json`에 `check:generalization` 명령을 추가한다.

Run: `npm run check:generalization && npm run lint`

Expected: 계약 통과, TypeScript 오류 0개.

- [ ] **Step 4: 커밋한다.**

```bash
git add src/types.ts src/utils/generalizationStorage.ts src/components/mission/useGeneralizationCycle.ts scripts/check-generalization-contract.mjs package.json
git commit -m "feat: add generalization cycle data contract"
```

### Task 2: 표현 입력과 예고 블록

**Files:**
- Create: `src/components/mission/blocks/ExpressionInput.tsx`
- Create: `src/components/mission/blocks/JudgmentPreview.tsx`
- Modify: `src/components/mission/MissionStep.tsx`
- Modify: `src/components/mission/printMission.ts`
- Modify: `scripts/check-generalization-contract.mjs`

**Interfaces:**
- `ExpressionInput`은 선택·AAC·말/글·그림 입력을 통합하고 `value`, `onChange`를 받는다.
- `JudgmentPreview`는 `block`, `value`, `studentName`, `accent`, `onChange`, `cycle`을 받는다.
- 예고 변경은 차시 미션 응답과 cycle record에 동시에 반영한다.

- [ ] **Step 1: RED 계약을 추가한다.**

`JudgmentPreview.tsx`가 없거나 `첫 생각을 저장했어요`가 없으면 실패하고 `정답이에요`가 포함되면 실패하도록 검사한다.

Run: `npm run check:generalization`

Expected: missing component 오류로 FAIL.

- [ ] **Step 2: `ExpressionInput`을 구현한다.**

선택·AAC를 기본으로 제공하고 block의 표현 모드가 허용할 때 텍스트/STT와 기존 `DrawPad`를 노출한다. 이유를 건너뛰어도 첫 생각만으로 완료된다. 기존 `MicButton`의 권한·오류 UI를 재사용한다.

- [ ] **Step 3: `JudgmentPreview`를 구현한다.**

첫 방법, 저장 시각, 학생 이름을 cycle record에 기록한다. 선택 직후 정오색·점수·선택별 해설을 렌더하지 않는다. 완료 문구는 “첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.”로 통일한다.

- [ ] **Step 4: 미션과 인쇄를 연결한다.**

`isBlockCompleted`에서 `firstThought`가 있을 때 완료로 판단하고 render switch에 새 블록을 추가한다. `printMission`에는 예고 응답을 “첫 생각” 행으로 포함한다.

- [ ] **Step 5: GREEN을 확인하고 커밋한다.**

Run: `npm run check:generalization && npm run build`

Expected: 통과, 브라우저 예고 화면에 즉시 해설·점수·정답표가 없음.

```bash
git add src/components/mission/blocks/ExpressionInput.tsx src/components/mission/blocks/JudgmentPreview.tsx src/components/mission/MissionStep.tsx src/components/mission/printMission.ts scripts/check-generalization-contract.mjs
git commit -m "feat: add unresolved judgment preview activity"
```

### Task 3: 단계형 본 활동과 과정평가

**Files:**
- Create: `src/components/mission/blocks/JudgmentMain.tsx`
- Create: `src/components/mission/blocks/TeacherObservation.tsx`
- Modify: `src/components/mission/MissionStep.tsx`
- Modify: `src/components/mission/printMission.ts`
- Modify: `scripts/check-generalization-contract.mjs`

**Interfaces:**
- `JudgmentMain`은 `block`, `value`, `cycle`, `studentName`, `accent`, `isTeacherSession`, `onChange`를 받는다.
- `TeacherObservation`은 `value`, `onChange`, `accent`를 받는다.
- 완료 조건은 중요 정보 1개 이상, 탐색 방법 2개 이상, AI 판단, 최종 생각, 전이 선택이다.

- [ ] **Step 1: RED 계약을 추가한다.**

본 활동에서 `중요한 정보를 찾아요`, `아이미의 다른 생각`, `받아들일래요`, `내 생각을 유지할래요`, `새 장면`을 검사한다.

Run: `npm run check:generalization`

Expected: missing component/phase 오류로 FAIL.

- [ ] **Step 2: 단계 상태를 구현한다.**

`preview | conditions | info | methods | ai | decision | final | transfer | record` 단계를 관리한다. 이전 단계 이동 시 선택을 보존하고 methods가 두 개 미만이면 다음을 비활성화한다.

- [ ] **Step 3: 회상과 fallback을 구현한다.**

cycle record가 있으면 “그때의 생각”으로 보여 준다. 없으면 AI 의견 전에 현재 첫 생각을 받고 `capturedAtMain: true`로 저장한다. 예고 미참여를 실패로 표시하지 않는다.

- [ ] **Step 4: AI 비교와 세 판단을 구현한다.**

저자 작성 `aiContribution`을 대안 또는 확인 질문으로 보여 준다. `accept | modify | keep` 세 버튼은 같은 무게로 만들고 모두 다음 단계로 진행시킨다.

- [ ] **Step 5: 전이 증거 카드를 구현한다.**

다른 장면을 보여 주고 `첫 생각 → AI와 비교 → 최종 생각 → 새 장면` 순으로 중립 문구를 렌더한다. 유지·변경 모두 실패 문구가 없어야 한다.

- [ ] **Step 6: 교사 관찰을 구현한다.**

`isTeacherSession`이 true일 때만 접을 수 있는 관찰 영역을 표시한다. 네 평가 항목은 `unobserved | prompted | independent`, 도움 수준은 `independent | cue | choice-support | co-perform`으로 저장한다. 평가 미입력은 학생 완료를 막지 않는다.

- [ ] **Step 7: 연결·검사·커밋한다.**

`MissionStep` switch와 완료 판정, 인쇄 비교 증거를 연결한다.

Run: `npm run check:generalization && npm run build`

Expected: 통과, 두 방법 전에는 AI 단계로 갈 수 없고 세 AI 판단 버튼 모두 작동.

```bash
git add src/components/mission/blocks/JudgmentMain.tsx src/components/mission/blocks/TeacherObservation.tsx src/components/mission/MissionStep.tsx src/components/mission/printMission.ts scripts/check-generalization-contract.mjs
git commit -m "feat: add judgment comparison and process observation"
```

### Task 4: 6단원 콘텐츠와 교사 기록 패널

**Files:**
- Create: `src/data/generalizationCycles.ts`
- Modify: `src/data/lessons/m1.ts`, `src/data/lessons/m2.ts`, `src/data/lessons/m3.ts`
- Modify: `src/data/lessons/m4.ts`, `src/data/lessons/m5.ts`, `src/data/lessons/m6.ts`
- Modify: `src/views/TeacherView.tsx`
- Modify: `scripts/check-generalization-contract.mjs`

**Interfaces:**
- `GENERALIZATION_CYCLES`는 `m1`~`m6`의 cycleId별 preview/main 블록을 export한다.
- 각 `m*-l6`에는 preview 하나, 각 `m1~m4-l11`, `m5-l12`, `m6-l12`에는 main 하나를 둔다.
- 교사 패널은 같은 저장 유틸로 record를 읽고 수정한다.

- [ ] **Step 1: 콘텐츠 RED 검사를 추가한다.**

각 모듈 파일에서 preview 차시와 main 차시의 블록 종류와 동일 cycleId를 검사한다.

Run: `npm run check:generalization`

Expected: six pairs를 연결하기 전 FAIL.

- [ ] **Step 2: 공통 콘텐츠를 작성한다.**

각 단원은 첫 선택 3개 이상, 조건 변경 태그 2개 이상, 대응 방법 3개 이상, AI 대안/확인 질문 1개, 최종 선택 3개 이상, 전이 선택 2개 이상을 가진다. m5는 버스 지연, m6는 품절 장면을 포함하고 m4는 확인·거절·어른 도움 흐름만 사용한다.

- [ ] **Step 3: 중간 차시에 preview를 배치한다.**

각 `m*-l6` 미션에 3~5분 preview 장을 추가하고 직접 중복되는 폐쇄형 퀴즈 하나만 줄인다.

- [ ] **Step 4: 마무리 차시에 main을 배치한다.**

기존 연속형 `studio_preview_*`, `studio_plan_*`, `studio_draw_*`를 삭제하고 main 하나로 교체한다. summary는 새 비교 증거를 참조하고 수료·보상은 보존한다.

- [ ] **Step 5: `TeacherView` 기록 패널을 연결한다.**

단원별 첫 생각, AI 판단, 최종 생각, 전이 선택, 네 평가 항목, 도움 수준을 확인·수정한다. 빈 record는 “아직 기록이 없어요”로 표시한다.

- [ ] **Step 6: 검사·빌드·커밋한다.**

Run: `npm run check:generalization && npm run lint && npm run check:encoding`

Expected: six pairs 통과, 오류 0개.

```bash
git add src/data/generalizationCycles.ts src/data/lessons/m1.ts src/data/lessons/m2.ts src/data/lessons/m3.ts src/data/lessons/m4.ts src/data/lessons/m5.ts src/data/lessons/m6.ts src/views/TeacherView.tsx scripts/check-generalization-contract.mjs
git commit -m "content: connect six module judgment cycles"
```

### Task 5: 브라우저와 정적 회귀 검증

**Files:**
- Modify: `scripts/check-generalization-contract.mjs` only for demonstrated missing contracts.
- Modify: `package.json` only for missing required commands.

- [ ] **Step 1: 대표 RED 시나리오를 재현한다.**

`?lesson=m5-l6`에서 예고 선택 후 `localStorage.getItem('ai-students-generalization-v1')`에 m5 record가 생기는지 확인한다. 구현 전에는 실패하고 구현 후에는 성공해야 한다.

- [ ] **Step 2: GREEN 예고→본 활동을 실행한다.**

m5-l6 선택 → 차시 이동 → m5-l12 회상 → 조건 태그 2개 → 방법 2개 → `조금 바꿀래요` → 최종 선택 → 전이 선택 → 일곱 단계 증거 카드를 확인한다.

- [ ] **Step 3: 중립성·접근성을 확인한다.**

예고에 해설·점수·정답표가 없는지, 유지·변경 모두 실패 문구가 없는지, TTS off에서 자동 음성 0회인지, AAC·STT·그림 중 하나로 완료되는지 확인한다.

- [ ] **Step 4: 교사 기록을 확인한다.**

학생 세션에서 관찰 영역이 숨겨지고 교사 세션에서 나타나며, 교사 화면 새로고침 후 네 항목과 도움 수준이 유지되는지 확인한다.

- [ ] **Step 5: 전체 검사를 실행한다.**

Run: `npm run check:generalization && npm run build && npm run check:encoding && npm run check:ui-polish && npm run check:activity-icons && git diff --check`

Expected: 모두 통과. 기존 Vite chunk-size warning은 실패가 아니다.

- [ ] **Step 6: 상태를 확인한다.**

```bash
git status --short --branch
git log -8 --oneline
```

Expected: 관련 커밋만 추가되고 기존 미추적 파일은 변경되지 않는다.

## 실행 순서

Task 1부터 5까지 순서대로 실행한다. 각 Task에서 RED를 확인한 뒤 GREEN을 확인하고 다음 Task로 넘어간다. 별도 테스트 프레임워크가 없으므로 계약 스크립트와 실제 브라우저 상호작용을 함께 사용한다.
