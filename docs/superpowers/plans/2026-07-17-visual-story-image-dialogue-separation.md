# Visual Story Image and Dialogue Separation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** `m1-l1` 이야기 페이지에서 장면 그림과 대사 상자를 분리하여 그림을 충분히 보여 주고, 대사 길이와 글자 크기에 따라 화면이 자연스럽게 늘어나게 합니다.

**Architecture:** 기존 좌우 교과서 펼침면과 장면 상태 관리는 유지합니다. 왼쪽 페이지 안에서 `visual-novel-image-frame`이 16:9 그림·장면표시·수동 TTS 버튼만 담당하고, 그 아래 `visual-novel-dialogue`가 대사·관점·다음 장면 버튼을 담당합니다. 고정 무대 높이와 그림 위 대사 오버레이는 제거합니다.

**Tech Stack:** React 19, TypeScript, CSS, Node 기반 소스 계약 검사, Vite

---

### Task 1: 분리된 화면 구조를 계약으로 고정합니다

**Files:**
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`
- Test: `scripts/check-visual-novel-social-story-contract.mjs`

**Step 1: Write the failing test**

컴포넌트에 `visual-novel-image-frame`이 있어야 하고, CSS가 16:9 그림 프레임과 자동 높이 대사 카드를 제공하는지 검사합니다. 기존 모바일 `min-height: 36rem` 보정과 대사 카드의 절대 배치를 금지합니다.

**Step 2: Run test to verify it fails**

Run: `npm run check:visual-novel-story`
Expected: FAIL because the image frame does not exist and the old fixed-height contract remains.

### Task 2: 그림과 대사를 독립 블록으로 구현합니다

**Files:**
- Modify: `src/features/studio/components/VisualNovelExperience.tsx`
- Modify: `src/index.css`
- Test: `scripts/check-visual-novel-social-story-contract.mjs`

**Step 1: Write minimal implementation**

그림·장면표시·수동 TTS 버튼을 `visual-novel-image-frame`으로 묶습니다. 대사 카드는 형제 블록으로 아래에 두고, 기존 장면 진행 동작과 TTS의 수동 실행 원칙은 그대로 유지합니다.

**Step 2: Replace overlay styling**

그림 프레임은 `aspect-ratio: 16 / 9`, `overflow: hidden`을 사용합니다. 대사 카드는 `position: relative`와 내용 기반 높이를 사용합니다. 데스크톱과 모바일의 `.visual-novel-stage` 고정 최소 높이를 제거합니다.

**Step 3: Run targeted tests**

Run: `npm run check:visual-novel-story`
Expected: PASS.

Run: `npm run lint`
Expected: PASS.

### Task 3: 반응형 화면과 전체 회귀를 검증합니다

**Files:**
- Verify: `src/features/studio/components/VisualNovelExperience.tsx`
- Verify: `src/index.css`

**Step 1: Verify desktop spread**

`http://127.0.0.1:4176/AITEXTBOOKforSTUDENTS/?lesson=m1-l1`에서 그림 비율, 그림과 대사 사이의 분리, 오른쪽 지식 페이지 정렬, 모든 장면의 진행을 확인합니다.

**Step 2: Verify mobile accessibility target**

390px 너비와 글자 125%에서 가로 넘침이 없고, 네 번째 장면의 긴 대사가 잘리지 않으며, `그림 → 대사 → 장면 선택` 순서가 유지되는지 확인합니다. 페이지 로드 때 TTS가 자동 실행되지 않는지도 확인합니다.

**Step 3: Run full verification**

Run: `npm run check:ui-polish && npm run check:visual-novel-story && npm run check:studio-expansion-all && npm run check:single-objective && npm run check:student-formal-style && npm run check:no-lesson-support-selector && npm run check:teacher-recording && npm run check:encoding && npm run lint && npm run build`
Expected: all checks pass; Vite may retain the existing chunk-size warning.

**Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-07-17-visual-novel-social-situation-design.md docs/superpowers/plans/2026-07-17-visual-story-image-dialogue-separation.md scripts/check-visual-novel-social-story-contract.mjs src/features/studio/components/VisualNovelExperience.tsx src/index.css
git commit -m "refactor: separate visual story image and dialogue"
```
