# 교차 차시 일반화 활동 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 단원 중간의 첫 판단과 단원 마지막의 수정·전이 판단을 하나의 과정 증거로 연결하는 `judgment-preview`·`judgment-main` 미션 블록을 6단원에 적용한다.

**Architecture:** 기존 `MissionStep` 컨테이너와 차시별 미션 저장을 유지하되, 전용 블록 2종과 `cycleId` 기반 공통 localStorage 훅을 추가한다. 예고는 각 단원 6차시에, 본 활동은 각 단원 마무리 차시에 배치한다. 교사 관찰평가는 학생 완료 조건과 분리하고 인증된 교사 세션과 교사 화면에서만 편집한다.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, 기존 Web Speech API 래퍼, localStorage, Playwright CLI 수동 검증.

## Global Constraints

- 이 브라우저에서 학생 1명이 사용하는 localStorage 기록만 지원한다.
- 실제 Gemini 호출 없이도 전체 활동이 진행되어야 한다.
- 예고에서는 정답·점수·즉시 해설을 표시하지 않는다.
- 첫 선택을 바꾸지 않아도 타당한 비교·이유가 있으면 성공 증거로 인정한다.
- 기존 미션 블록·TTS 토글·인쇄·UTF-8·TypeScript strict 규칙을 보존한다.
- 한 문장 한 정보, 선택·AAC·말/글·그림 표현, reduced-motion을 유지한다.
- 관련 파일만 커밋하고 기존 미추적 파일은 건드리지 않는다.

---

### Task 1: 공통 타입과 저장 계약

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

검사 스크립트가 다음 파일과 타입 표식을 요구하도록 작성한다.

```js
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const types = readFileSync(resolve(root, 'src/types.ts'), 'utf8');
for (const file of ['src/utils/generalizationStorage.ts', 'src/components/mission/useGeneralizationCycle.ts']) {
  if (!existsSync(resolve(root, file))) throw new Error(`missing ${file}`);
}
for (const marker of ['JudgmentPreviewBlock', 'JudgmentMainBlock', 'GeneralizationCycleRecord']) {
  if (!types.includes(marker)) throw new Error(`missing type marker: ${marker}`);
}
console.log('generalization contract passed');
```

Run: `node scripts/check-generalization-contract.mjs`  
Expected: FAIL with a missing-file error.

- [ ] **Step 2: 최소 타입과 저장 유틸을 구현한다.**

`src/types.ts`에 `GeneralizationExpressionMode`, `GeneralizationAiDecision`, `GeneralizationHelpLevel`, `GeneralizationObservationStatus`, `GeneralizationExpression`, `GeneralizationObservation`, `GeneralizationCycleRecord`, `JudgmentPreviewBlock`, `JudgmentMainBlock`을 추가한다. 표현 응답은 `mode`, 선택 id, 선택적 text/drawing을 가진다. 본 활동 record는 중요 정보, 두 개 이상의 탐색 방법, AI 판단, 최종 생각, 전이 선택을 가진다.

`src/utils/generalizationStorage.ts`는 `STORAGE_KEY = 'ai-students-generalization-v1'`을 사용하고, storage 미지원·JSON 손상 시 빈 객체로 복구한다. `updateGeneralizationRecord(cycleId, patch)`는 기존 중첩 필드를 보존한다.

- [ ] **Step 3: 검사 명령을 연결하고 통과시킨다.**

`package.json`에 `"check:generalization": "node scripts/check-generalization-contract.mjs"`를 추가한다.

Run: `npm run check:generalization && npm run lint`  
Expected: 계약 통과와 TypeScript 오류 0개.

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
- `ExpressionInput`은 선택·AAC·말/글·그림 입력을 통합하고 `value`와 `onChange`를 받는다.
- `JudgmentPreview`는 `block`, `value`, `studentName`, `accent`, `onChange`, `cycle`을 받는다.
- 예고 변경은 차시 미션 응답과 cycle record에 동시에 반영한다.

- [ ] **Step 1: RED 계약을 추가한다.**

`JudgmentPreview.tsx`가 없거나 `첫 생각을 저장했어요` 문구가 없으면 실패하고, `정답이에요`가 포함되면 실패하도록 검사한다.

Run: `npm run check:generalization`  
Expected: FAIL with missing component.

- [ ] **Step 2: `ExpressionInput`을 구현한다.**

선택 카드와 AAC 이유 카드를 기본 제공하고, block의 `expressionModes`에 따라 텍스트/STT와 기존 `DrawPad`를 선택적으로 보여 준다. 이유는 건너뛸 수 있으며 첫 생각만으로 완료된다. 기존 `MicButton`의 권한·오류 UI를 재사용한다.

- [ ] **Step 3: `JudgmentPreview`를 구현한다.**

첫 방법을 저장하고 `capturedAt`과 학생 이름을 cycle record에 기록한다. 선택 직후 정오색, 점수, 선택별 해설을 렌더하지 않는다. 완료 문구는 “첫 생각을 저장했어요. 단원 마지막에 조건이 달라진 장면으로 다시 만나요.”로 통일한다.

- [ ] **Step 4: `MissionStep`과 인쇄를 연결한다.**

`isBlockCompleted`에서 예고는 `firstThought`가 있을 때 완료로 판단하고 render switch에 새 블록을 추가한다. `printMission`에는 예고 응답을 “첫 생각” 행으로 포함한다.

- [ ] **Step 5: GREEN을 확인하고 커밋한다.**

Run: `npm run check:generalization && npm run build`  
Expected: 통과. 브라우저 예고 화면에서 선택 후 즉시 해설·점수·정답표가 없어야 한다.

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

검사 스크립트가 본 활동 컴포넌트에서 `중요한 정보를 찾아요`, `아이미의 다른 생각`, `받아들일래요`, `내 생각을 유지할래요`, `새 장면`을 찾도록 한다.

Run: `npm run check:generalization`  
Expected: FAIL with missing component/phase.

- [ ] **Step 2: 단계 상태를 구현한다.**

`preview | conditions | info | methods | ai | decision | final | transfer | record` 단계를 관리한다. 이전 단계 이동 시 선택을 보존하며 methods가 두 개 미만이면 다음 단계 버튼을 비활성화한다.

- [ ] **Step 3: 회상과 fallback을 구현한다.**

기존 cycle record가 있으면 “그때의 생각”으로 보여 준다. 없으면 AI 의견 전에 현재 첫 생각을 받으며 `capturedAtMain: true`로 저장한다. 예고 미참여를 실패로 표시하지 않는다.

- [ ] **Step 4: AI 비교·수용·수정·거절을 구현한다.**

저자 작성 `aiContribution`을 대안 또는 확인 질문으로 보여 준다. `accept | modify | keep` 세 버튼은 동일한 시각적 무게로 만들고 모든 선택이 다음 단계로 진행되게 한다.

- [ ] **Step 5: 전이 증거 카드를 구현한다.**

유사하지만 다른 장면을 보여 주고, `첫 생각 → AI와 비교 → 최종 생각 → 새 장면` 순으로 중립적인 비교 문구를 렌더한다. 유지·변경 모두 실패 문구를 사용하지 않는다.

- [ ] **Step 6: 교사 관찰을 구현한다.**

`isTeacherSession`이 true일 때만 접을 수 있는 관찰 영역을 표시한다. 네 평가 항목은 `unobserved | prompted | independent`, 도움 수준은 `independent | cue | choice-support | co-perform`으로 저장한다. 평가 미입력 상태도 학생 완료를 막지 않는다.

- [ ] **Step 7: 연결·검사·커밋한다.**

`MissionStep` switch와 완료 판정, 인쇄 비교 증거를 연결한다.

Run: `npm run check:generalization && npm run build`  
Expected: 통과. 두 방법을 선택하지 않으면 AI 단계로 갈 수 없고 세 AI 판단 버튼 모두 작동한다.

```bash
git add src/components/mission/blocks/JudgmentMain.tsx src/components/mission/blocks/TeacherObservation.tsx src/components/mission/MissionStep.tsx src/components/mission/printMission.ts scripts/check-generalization-contract.mjs
git commit -m "feat: add judgment comparison and process observation"
```

### Task 4: 6단원 콘텐츠와 교사 기록 패널

**Files:**
- Create: `src/data/generalizationCycles.ts`
- Modify: `src/data/lessons/m1.ts`
- Modify: `src/data/lessons/m2.ts`
- Modify: `src/data/lessons/m3.ts`
- Modify: `src/data/lessons/m4.ts`
- Modify: `src/data/lessons/m5.ts`
- Modify: `src/data/lessons/m6.ts`
- Modify: `src/views/TeacherView.tsx`
- Modify: `scripts/check-generalization-contract.mjs`

**Interfaces:**
- `GENERALIZATION_CYCLES`는 `m1`~`m6`의 `cycleId`별 preview/main 블록을 export한다.
- 각 `m*-l6`에는 preview 하나, 각 `m1~m4-l11`, `m5-l12`, `m6-l12`에는 main 하나를 배치한다.
- 교사 패널은 저장 유틸을 통해 같은 record를 읽고 수정한다.

- [ ] **Step 1: 콘텐츠 RED 검사를 추가한다.**

각 모듈 파일에서 preview 차시와 main 차시의 `judgment-preview`·`judgment-main`·동일 cycleId를 검사한다.

Run: `npm run check:generalization`  
Expected: FAIL until six pairs are wired.

- [ ] **Step 2: 공통 콘텐츠를 작성한다.**

각 단원은 첫 선택 3개 이상, 조건 변경 태그 2개 이상, 대응 방법 3개 이상, AI 대안/확인 질문 1개, 최종 선택 3개 이상, 전이 선택 2개 이상을 가진다. m5는 버스 지연, m6는 품절 장면을 포함한다. m4 안전 장면은 확인·거절·어른 도움 흐름만 사용한다.

- [ ] **Step 3: 중간 차시 preview를 배치한다.**

각 `m*-l6` 미션에 3~5분 preview 장을 추가하고, 내용이 겹치는 폐쇄형 퀴즈 하나만 줄여 총량을 조정한다.

- [ ] **Step 4: 마무리 차시 main을 배치한다.**

기존 연속형 `studio_preview_*`, `studio_plan_*`, `studio_draw_*`를 삭제하고 main 하나로 교체한다. summary는 새 비교 증거를 참조하고 기존 수료·보상은 보존한다.

- [ ] **Step 5: `TeacherView` 기록 패널을 연결한다.**

단원별 첫 생각, AI 판단, 최종 생각, 전이 선택, 네 평가 항목, 도움 수준을 확인·수정한다. 빈 record는 “아직 기록이 없어요”로 표시한다.

- [ ] **Step 6: 검사·빌드·커밋한다.**

Run: `npm run check:generalization && npm run lint && npm run check:encoding`  
Expected: 여섯 쌍 통과, 오류 0개.

```bash
git add src/data/generalizationCycles.ts src/data/lessons/m1.ts src/data/lessons/m2.ts src/data/lessons/m3.ts src/data/lessons/m4.ts src/data/lessons/m5.ts src/data/lessons/m6.ts src/views/TeacherView.tsx scripts/check-generalization-contract.mjs
git commit -m "content: connect six module judgment cycles"
```

### Task 5: 브라우저·정적 회귀 검증

**Files:**
- Modify: `scripts/check-generalization-contract.mjs` only when a demonstrated contract is missing.
- Modify: `package.json` only when a required check command is missing.

- [ ] **Step 1: 대표 RED 시나리오를 재현한다.**

`?lesson=m5-l6`에서 예고 선택 후 `localStorage.getItem('ai-students-generalization-v1')`에 m5 record가 생기는지 확인한다. 구현 전에는 실패하고 구현 후에는 성공해야 한다.

- [ ] **Step 2: 예고→본 활동 GREEN 시나리오를 실행한다.**

m5-l6 선택 → 차시 이동 → m5-l12 회상 → 조건 태그 2개 → 방법 2개 → AI 판단 `조금 바꿀래요` → 최종 선택 → 전이 선택 → 일곱 단계 증거 카드 순으로 확인한다.

- [ ] **Step 3: 중립성·접근성을 확인한다.**

예고에 해설·점수·정답표가 없는지, 유지·변경 모두 실패 문구가 없는지, TTS off에서 자동 음성 0회인지, AAC·텍스트/STT·그림 중 하나로 완료되는지 확인한다.

- [ ] **Step 4: 교사 기록을 확인한다.**

학생 세션에서 관찰 영역이 숨겨지고, 교사 세션에서 나타나며, 교사 화면 새로고침 후 네 항목과 도움 수준이 유지되는지 확인한다.

- [ ] **Step 5: 전체 검사를 실행한다.**

Run: `npm run check:generalization && npm run build && npm run check:encoding && npm run check:ui-polish && npm run check:activity-icons && git diff --check`  
Expected: 모두 통과. 기존 Vite chunk-size warning은 실패로 처리하지 않는다.

- [ ] **Step 6: 상태를 확인한다.**

```bash
git status --short --branch
git log -8 --oneline
```

Expected: 관련 커밋만 추가되고 기존 미추적 파일은 변경되지 않는다.

## 실행 순서

Task 1부터 5까지 순서대로 실행한다. 각 Task의 RED를 확인한 뒤 GREEN을 확인하고 다음 Task로 넘어간다. 별도 테스트 프레임워크가 없으므로 계약 스크립트와 실제 브라우저 상호작용을 함께 사용한다.
