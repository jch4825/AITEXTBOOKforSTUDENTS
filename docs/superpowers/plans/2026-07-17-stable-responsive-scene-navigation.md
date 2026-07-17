# Stable Responsive Scene Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 대사 길이가 달라져도 장면 전환 조작이 예측 가능한 위치와 형태를 유지하도록 다음 버튼을 독립 탐색줄에 통합합니다.

**Architecture:** `VisualNovelExperience`의 장면 상태와 전환 함수는 유지하고, 대사 카드 안의 원형 버튼만 기존 `visual-novel-controls`로 이동합니다. 데스크톱은 왼쪽 페이지 하단 탐색줄, 태블릿은 한 줄 탐색줄, 모바일은 장면 번호 줄과 폭이 넓은 다음 버튼의 두 줄 구조를 CSS로 제공합니다.

**Tech Stack:** React 19, TypeScript, CSS, Node 기반 소스 계약 검사, Vite

## Global Constraints

- 지원 수준과 관계없이 학습목표는 하나로 유지합니다.
- 장면 탐색줄의 문서 순서는 대사 다음에 장면 번호, 현재 장면 수, 다음 장면 버튼입니다.
- 데스크톱 기준은 `1024px` 이상, 태블릿 기준은 `431px`~`1023px`, 모바일 기준은 `430px` 이하입니다.
- 데스크톱 스튜디오 펼침면은 글자 크기에 비례하는 `46rem` 최소 높이를 사용하며 콘텐츠가 더 길면 계속 늘어납니다.
- 태블릿 조작 영역은 최소 `44px`이며 모바일 `390px`·글자 크기 `125%`에서 가로 넘침과 버튼 문구 줄바꿈이 없어야 합니다.
- 내부 스크롤, 화면 고정 버튼, 콘텐츠를 가리는 `sticky` 배치를 사용하지 않습니다.
- TTS는 학생이 `대사 듣기`를 누를 때만 실행합니다.

---

### Task 1: 장면 탐색 구조 계약과 컴포넌트

**Files:**
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`
- Modify: `src/features/studio/components/VisualNovelExperience.tsx`
- Test: `scripts/check-visual-novel-social-story-contract.mjs`

**Interfaces:**
- Consumes: `selectScene(index: number)`, `sceneIndex`, `story.scenes`
- Produces: 대사 카드 뒤에 오는 `.visual-novel-controls`와 그 안의 `.visual-novel-next`

- [ ] **Step 1: Write the failing contract**

`scripts/check-visual-novel-social-story-contract.mjs`에 다음 구조 검사를 추가합니다.

```js
if (!/className="visual-novel-dialogue"[\s\S]*?<\/div>\s*<\/div>\s*<div className="visual-novel-controls"[\s\S]*?className="visual-novel-next"/.test(visualNovel)) {
  throw new Error('next scene action must live in the navigation rail after the dialogue');
}
if (/className="visual-novel-dialogue"[\s\S]*?className="visual-novel-next"[\s\S]*?<\/div>\s*<\/div>\s*<div className="visual-novel-controls"/.test(visualNovel)) {
  throw new Error('next scene action must not float inside the variable-height dialogue');
}
for (const label of ["'다음 장면'", "'처음부터'"]) {
  if (!visualNovel.includes(label)) throw new Error(`missing stable scene action label: ${label}`);
}
```

- [ ] **Step 2: Run the contract to verify RED**

Run: `npm run check:visual-novel-story`

Expected: FAIL with `next scene action must live in the navigation rail after the dialogue`.

- [ ] **Step 3: Move the action into the navigation rail**

`VisualNovelExperience.tsx`에서 대사 카드 안의 `.visual-novel-next`를 삭제하고, 기존 `.visual-novel-controls`의 현재 장면 수 뒤에 다음 버튼을 추가합니다.

```tsx
<div className="visual-novel-controls" aria-label="이야기 장면 선택">
  <div className="visual-novel-scene-picker">
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
  </div>
  <span className="visual-novel-scene-count">{sceneIndex + 1} / {story.scenes.length}</span>
  <button
    type="button"
    className="visual-novel-next"
    onClick={() => selectScene(sceneIndex === story.scenes.length - 1 ? 0 : sceneIndex + 1)}
    aria-label={sceneIndex === story.scenes.length - 1 ? '이야기 처음부터 보기' : '다음 장면 보기'}
  >
    <span>{sceneIndex === story.scenes.length - 1 ? '처음부터' : '다음 장면'}</span>
    <Icon name={sceneIndex === story.scenes.length - 1 ? 'refresh' : 'chevron-right'} size={20} />
  </button>
</div>
```

- [ ] **Step 4: Run the contract and type check**

Run: `npm run check:visual-novel-story`

Expected: PASS with `visual novel social story assets: 4 scenes ready`.

Run: `npm run lint`

Expected: PASS with no TypeScript errors.

### Task 2: 데스크톱·태블릿·모바일 탐색줄 스타일

**Files:**
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`
- Modify: `src/index.css`
- Test: `scripts/check-visual-novel-social-story-contract.mjs`

**Interfaces:**
- Consumes: `.visual-novel-controls`, `.visual-novel-scene-picker`, `.visual-novel-scene-count`, `.visual-novel-next`
- Produces: 데스크톱 한 줄 하단 탐색, 태블릿 44px 조작 영역, 모바일 두 줄 탐색

- [ ] **Step 1: Extend the failing responsive contract**

다음 CSS 계약을 `check-visual-novel-social-story-contract.mjs`에 추가합니다.

```js
for (const pattern of [
  /@media \(min-width: 1024px\)[\s\S]*?\.studio-editorial \.lesson-spread-pages\s*\{[^}]*min-height:\s*46rem;/,
  /\.visual-novel-controls\s*\{[^}]*margin-top:\s*auto;/s,
  /\.visual-novel-scene-picker button\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/s,
  /\.visual-novel-next\s*\{[^}]*min-height:\s*44px;[^}]*justify-self:\s*end;[^}]*white-space:\s*nowrap;/s,
  /@media \(max-width: 430px\)[\s\S]*?\.visual-novel-next\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;[^}]*width:\s*100%;/,
]) {
  if (!pattern.test(styles)) throw new Error(`missing responsive scene navigation rule: ${pattern}`);
}
```

- [ ] **Step 2: Run the contract to verify RED**

Run: `npm run check:visual-novel-story`

Expected: FAIL with `missing responsive scene navigation rule`.

- [ ] **Step 3: Implement the responsive navigation rail**

`src/index.css`에서 원형 오버레이 버튼 규칙을 다음 탐색줄 규칙으로 교체합니다.

```css
@media (min-width: 1024px) {
  .studio-editorial .lesson-spread-pages {
    min-height: 46rem;
  }
}

.visual-novel-controls {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.75rem;
  color: var(--muted);
  font-size: 0.88rem;
  font-weight: 800;
}

.visual-novel-scene-picker {
  display: flex;
  gap: 0.4rem;
}

.visual-novel-scene-count {
  justify-self: center;
  white-space: nowrap;
}

.visual-novel-scene-picker button {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 1px solid var(--editorial-line);
  border-radius: 999px;
  background: var(--editorial-paper);
  color: var(--muted);
  font-weight: 850;
}

.visual-novel-next {
  display: inline-flex;
  min-width: 7.75rem;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  justify-self: end;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  border: 0;
  border-radius: 999px;
  background: #f0d77f;
  color: #173f46;
  font-weight: 900;
  white-space: nowrap;
}
```

모바일 미디어 쿼리에 다음 규칙을 추가합니다.

```css
.visual-novel-controls {
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 0.5rem;
  row-gap: 0.65rem;
}

.visual-novel-scene-picker {
  gap: 0.3rem;
}

.visual-novel-scene-count {
  justify-self: end;
}

.visual-novel-next {
  grid-column: 1 / -1;
  width: 100%;
  min-height: 3rem;
}
```

- [ ] **Step 4: Run targeted checks**

Run: `npm run check:visual-novel-story`

Expected: PASS.

Run: `npm run lint`

Expected: PASS.

### Task 3: 실제 화면과 전체 회귀 검증

**Files:**
- Verify: `src/features/studio/components/VisualNovelExperience.tsx`
- Verify: `src/index.css`

**Interfaces:**
- Consumes: 완성된 장면 탐색줄
- Produces: 데스크톱·태블릿·모바일 검증 증거

- [ ] **Step 1: Verify desktop at 1440px**

`http://127.0.0.1:4176/AITEXTBOOKforSTUDENTS/?lesson=m1-l1`에서 네 장면을 전환하며 `.visual-novel-next`의 너비·높이·오른쪽 위치가 일정하고 대사 카드와 겹치지 않는지 확인합니다.

- [ ] **Step 2: Verify tablet at 768px and 125% text**

장면 번호와 다음 버튼이 한 줄에 있고, 모든 버튼의 누르기 영역이 최소 `44px`, 가로 넘침이 없는지 확인합니다.

- [ ] **Step 3: Verify mobile at 390px and 125% text**

장면 번호·현재 장면 수가 첫째 줄, 폭이 넓은 다음 버튼이 둘째 줄에 있고 문구가 줄바꿈되지 않으며 가로 넘침이 없는지 확인합니다. 네 번째 장면의 긴 대사도 버튼이나 탐색줄과 겹치지 않아야 합니다.

- [ ] **Step 4: Run full verification**

Run: `npm run check:ui-polish; npm run check:visual-novel-story; npm run check:studio-expansion-all; npm run check:single-objective; npm run check:student-formal-style; npm run check:no-lesson-support-selector; npm run check:teacher-recording; npm run check:encoding; npm run lint; npm run build`

Expected: 모든 명령이 exit code `0`; Vite의 기존 500kB 청크 크기 경고만 허용합니다.

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/plans/2026-07-17-stable-responsive-scene-navigation.md scripts/check-visual-novel-social-story-contract.mjs src/features/studio/components/VisualNovelExperience.tsx src/index.css
git commit -m "fix: stabilize responsive scene navigation"
```
