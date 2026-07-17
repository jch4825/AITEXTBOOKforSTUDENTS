# Image Bottom Scene Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 장면 번호 카드와 `대사 듣기` 버튼을 16:9 장면 그림 안쪽의 왼쪽 아래와 오른쪽 아래로 이동합니다.

**Architecture:** React 마크업과 TTS 이벤트는 그대로 유지하고 `src/index.css`의 두 절대 배치 규칙만 하단 기준으로 변경합니다. 기존 이미지 하단 그라데이션을 활용하며 모바일에서는 장면 카드의 폭을 제한해 듣기 버튼과 겹치지 않게 합니다.

**Tech Stack:** React 19, TypeScript, CSS, Node 기반 소스 계약 검사, Vite

## Global Constraints

- 장면 번호 카드는 그림 안쪽 왼쪽 아래, `대사 듣기` 버튼은 그림 안쪽 오른쪽 아래에 둡니다.
- 두 요소의 아래 간격은 데스크톱·태블릿에서 `0.8rem`, 모바일 `430px` 이하에서 `0.7rem`입니다.
- 모바일 장면 카드의 최대 폭은 `calc(100% - 8.25rem)`이며 긴 제목은 위쪽으로 줄바꿈합니다.
- 글자 크기 `125%`와 네 장면 제목에서 두 요소가 겹치거나 그림 밖으로 나가지 않아야 합니다.
- TTS는 학생이 `대사 듣기`를 눌렀을 때만 실행하며 자동 재생을 추가하지 않습니다.

---

### Task 1: 하단 배치 계약과 스타일

**Files:**
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`
- Modify: `src/index.css`
- Test: `scripts/check-visual-novel-social-story-contract.mjs`

**Interfaces:**
- Consumes: `.visual-novel-image-frame`, `.visual-novel-scene-label`, `.visual-novel-listen`
- Produces: 같은 하단 기준선에 정렬된 장면 카드와 수동 TTS 버튼

- [ ] **Step 1: Write the failing placement contract**

`scripts/check-visual-novel-social-story-contract.mjs`의 스타일 검사에 다음 계약을 추가합니다.

```js
for (const [selector, bottom] of [
  ['visual-novel-scene-label', '0.8rem'],
  ['visual-novel-listen', '0.8rem'],
]) {
  const rule = styles.match(new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  if (!rule.includes(`bottom: ${bottom};`) || rule.includes('top:')) {
    throw new Error(`${selector} must align to the image bottom without a top anchor`);
  }
}
if (!/@media \(max-width: 430px\)[\s\S]*?\.visual-novel-scene-label\s*\{[^}]*bottom:\s*0\.7rem;[^}]*max-width:\s*calc\(100%\s*-\s*8\.25rem\);/.test(styles)) {
  throw new Error('mobile scene label must wrap upward within the space left by the listen button');
}
if (!/@media \(max-width: 430px\)[\s\S]*?\.visual-novel-listen\s*\{[^}]*bottom:\s*0\.7rem;[^}]*right:\s*0\.7rem;/.test(styles)) {
  throw new Error('mobile listen button must stay at the image bottom-right');
}
```

- [ ] **Step 2: Run the contract to verify RED**

Run: `npm run check:visual-novel-story`

Expected: FAIL with `visual-novel-scene-label must align to the image bottom without a top anchor`.

- [ ] **Step 3: Change the base and mobile placement styles**

`src/index.css`의 기본 규칙을 다음과 같이 바꿉니다.

```css
.visual-novel-scene-label {
  position: absolute;
  z-index: 2;
  bottom: 0.8rem;
  left: 0.8rem;
  max-width: calc(100% - 8.5rem);
}

.visual-novel-listen {
  position: absolute;
  z-index: 3;
  right: 0.8rem;
  bottom: 0.8rem;
}
```

기존의 색상·테두리·글자 스타일은 유지하고 `top` 선언만 제거합니다. 모바일 미디어 쿼리는 다음과 같이 변경합니다.

```css
.visual-novel-scene-label {
  bottom: 0.7rem;
  max-width: calc(100% - 8.25rem);
}

.visual-novel-listen {
  bottom: 0.7rem;
  right: 0.7rem;
}
```

- [ ] **Step 4: Run targeted checks**

Run: `npm run check:visual-novel-story`

Expected: PASS with `visual novel social story assets: 4 scenes ready`.

Run: `npm run lint`

Expected: PASS with no TypeScript errors.

### Task 2: 반응형 실제 화면과 전체 회귀 검증

**Files:**
- Verify: `src/features/studio/components/VisualNovelExperience.tsx`
- Verify: `src/index.css`

**Interfaces:**
- Consumes: 완성된 하단 좌우 배치
- Produces: 데스크톱·태블릿·모바일 검증 증거

- [ ] **Step 1: Verify desktop at 1440px**

네 장면을 전환하며 장면 카드의 왼쪽·아래 간격과 듣기 버튼의 오른쪽·아래 간격이 일정하고, 두 요소가 같은 하단 기준선에 있는지 확인합니다.

- [ ] **Step 2: Verify tablet at 768px and 125% text**

네 장면 모두에서 장면 카드와 듣기 버튼이 그림 안에 있고 서로 겹치지 않으며, 듣기 버튼의 누르기 영역이 최소 `44px`인지 확인합니다.

- [ ] **Step 3: Verify mobile at 390px and 125% text**

가장 긴 네 번째 장면 제목이 왼쪽에서 위쪽으로 줄바꿈하고, 오른쪽 아래 듣기 버튼과 겹치지 않으며, 두 요소가 그림 경계 안에 있는지 확인합니다. 가로 넘침과 자동 TTS가 없어야 합니다.

- [ ] **Step 4: Run full verification**

Run: `npm run check:ui-polish; npm run check:visual-novel-story; npm run check:studio-expansion-all; npm run check:single-objective; npm run check:student-formal-style; npm run check:no-lesson-support-selector; npm run check:teacher-recording; npm run check:encoding; npm run lint; npm run build`

Expected: 모든 명령이 exit code `0`; Vite의 기존 500kB 청크 크기 경고만 허용합니다.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-07-17-image-bottom-scene-controls.md scripts/check-visual-novel-social-story-contract.mjs src/index.css
git commit -m "fix: align scene controls to image bottom"
```
