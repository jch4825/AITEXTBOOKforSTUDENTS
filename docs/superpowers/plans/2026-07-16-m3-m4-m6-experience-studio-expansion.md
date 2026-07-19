# M3·M4·M6 Experience Studio Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the 68-lesson experience-centered structure by adding three core studios, all support bridges, and a module portfolio for M3, M4, and M6 while preserving the completed M1, M2, and M5 work.

**Architecture:** Add module-owned data files behind the existing studio, support-bridge, and portfolio registries. Reuse the current `StudioExperience`, `SupportLessonBridge`, `ModuleCloseLessonView`, evidence storage, prepared-stimulus rendering, and support profiles; no new runtime state or UI route is required.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Node contract scripts, browser localStorage, Web Speech API for explicit user-triggered playback only.

## Global Constraints

- Keep all 68 lessons and all existing lesson titles, objectives, standards, story data, and legacy steps.
- The completed system must contain exactly 18 studios, 44 support bridges, and 6 module portfolios.
- M3 studios are `m3-l1`, `m3-l5`, `m3-l9`; M4 studios are `m4-l1`, `m4-l5`, `m4-l10`; M6 studios are `m6-l1`, `m6-l4`, `m6-l11`.
- Every new AI contribution uses `source: 'prepared'` and must not imply a live AI call.
- Prepared speech never auto-plays. Camera and microphone permission are not required.
- Keep the support labels exactly `충분한 지원`, `보통`, `도전적`.
- Reuse existing lesson images under `/AITEXTBOOKforSTUDENTS/lessons/<lessonId>.webp` and supply Korean alt text and captions.
- Preserve UTF-8 Korean text and strict TypeScript.
- Do not modify the `StudioEvidenceV2` storage schema.

---

### Task 1: Add a rollout contract that can test one module at a time

**Files:**
- Create: `scripts/check-complete-studio-rollout-contract.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: module data files and the three existing registries.
- Produces: `npm run check:studio-rollout -- M3|M4|M6` for RED/GREEN cycles and `npm run check:studio-rollout` for the final six-module gate.

- [ ] **Step 1: Write the contract before any M3/M4/M6 production data**

Create a Node script whose configuration is exact:

```js
const MODULES = {
  M3: {
    studioFile: 'src/data/studios/m3.ts',
    studioIds: ['m3-question-detective', 'm3-story-coauthor', 'm3-image-description-review'],
    lessonIds: ['m3-l1', 'm3-l5', 'm3-l9'],
    bridgeFile: 'src/data/supportBridges/m3.ts',
    bridgeIds: ['m3-l2', 'm3-l3', 'm3-l4', 'm3-l6', 'm3-l7', 'm3-l8', 'm3-l10'],
    portfolioFile: 'src/data/modulePortfolios/m3.ts',
    portfolioLessonId: 'm3-l11',
    artifactTitles: ['나의 질문 설계 카드', 'AI와 나의 이야기 보드', '그림 설명 확인표'],
  },
  M4: {
    studioFile: 'src/data/studios/m4.ts',
    studioIds: ['m4-answer-verification', 'm4-photo-sharing-safety', 'm4-ad-clue-detective'],
    lessonIds: ['m4-l1', 'm4-l5', 'm4-l10'],
    bridgeFile: 'src/data/supportBridges/m4.ts',
    bridgeIds: ['m4-l2', 'm4-l3', 'm4-l4', 'm4-l6', 'm4-l7', 'm4-l8', 'm4-l9'],
    portfolioFile: 'src/data/modulePortfolios/m4.ts',
    portfolioLessonId: 'm4-l11',
    artifactTitles: ['AI 답 확인 기록', '사진 공유 전 확인 카드', '광고 단서 표시판'],
  },
  M6: {
    studioFile: 'src/data/studios/m6.ts',
    studioIds: ['m6-shopping-choice', 'm6-transit-change', 'm6-safe-self-introduction'],
    lessonIds: ['m6-l1', 'm6-l4', 'm6-l11'],
    bridgeFile: 'src/data/supportBridges/m6.ts',
    bridgeIds: ['m6-l2', 'm6-l3', 'm6-l5', 'm6-l6', 'm6-l7', 'm6-l8', 'm6-l9', 'm6-l10'],
    portfolioFile: 'src/data/modulePortfolios/m6.ts',
    portfolioLessonId: 'm6-l12',
    artifactTitles: ['나의 장보기 판단표', '안전 이동 계획 카드', '상대에 맞춘 자기소개 카드'],
  },
};
```

For each requested module, assert file existence, all IDs, exactly three `source: 'prepared'` tokens, all artifact titles, every bridge lesson, the portfolio lesson, all three studio lesson references, and registry imports/spreads/entries. With no argument, additionally assert 18 studio lesson occurrences across six studio files, 44 bridge lesson occurrences across six bridge files, 6 registered portfolios, teacher copy containing `1~6단원`, `18개`, `준비된 AI 예시`, and `카메라·마이크 권한 없이`.

- [ ] **Step 2: Add the package command**

```json
"check:studio-rollout": "node scripts/check-complete-studio-rollout-contract.mjs"
```

- [ ] **Step 3: Run the M3 contract and verify RED**

Run: `npm run check:studio-rollout -- M3`

Expected: FAIL with `src/data/studios/m3.ts is missing`.

- [ ] **Step 4: Commit the failing contract**

```bash
git add scripts/check-complete-studio-rollout-contract.mjs package.json
git commit -m "test: define complete studio rollout contract"
```

---

### Task 2: Implement the M3 learning studios, bridges, and portfolio

**Files:**
- Create: `src/data/studios/m3.ts`
- Create: `src/data/supportBridges/m3.ts`
- Create: `src/data/modulePortfolios/m3.ts`
- Modify: `src/data/studios/index.ts`
- Modify: `src/data/supportBridges/index.ts`
- Modify: `src/data/modulePortfolios/index.ts`

**Interfaces:**
- Consumes: `StudioDefinition`, `SupportBridgeDefinition`, `ModulePortfolioDefinition`, `STUDIO_EXPRESSION_MODES`, `STUDIO_SUPPORT_PROFILES`.
- Produces: `M3_STUDIOS`, `M3_SUPPORT_BRIDGES`, `M3_PORTFOLIO` registered for generic lookup.

- [ ] **Step 1: Add three complete `StudioDefinition` objects**

Use this exact object identity and content map; every object must also include encounter facts, 3 first choices, all expression modes, condition facts, prepared AI text and question, 3 transfer choices, and an artifact prompt:

```ts
export const M3_STUDIOS: StudioDefinition[] = [
  { id: 'm3-question-detective', lessonId: 'm3-l1', moduleId: 'm3', title: '질문 탐정 실험실', artifact: { kind: 'repair-card', title: '나의 질문 설계 카드', prompt: '처음 질문과 새로 더한 단서를 정리해 보세요.' } },
  { id: 'm3-story-coauthor', lessonId: 'm3-l5', moduleId: 'm3', title: '이야기 공동창작소', artifact: { kind: 'visual-plan', title: 'AI와 나의 이야기 보드', prompt: 'AI 제안과 내가 만든 결말을 말·글·그림으로 정리해 보세요.' } },
  { id: 'm3-image-description-review', lessonId: 'm3-l9', moduleId: 'm3', title: '이미지 설명 검토소', artifact: { kind: 'action-card', title: '그림 설명 확인표', prompt: '보이는 사실과 확인할 수 없는 추측을 나누어 적어 보세요.' } },
];
```

The third encounter must contain:

```ts
stimuli: [{
  id: 'm3-picture',
  kind: 'image',
  src: '/AITEXTBOOKforSTUDENTS/lessons/m3-l9.webp',
  alt: '학생들이 그림을 살펴보며 보이는 내용을 설명하는 교과서 장면',
  caption: '그림에서 직접 확인할 수 있는 것만 먼저 찾아보세요.',
}]
```

All three AI contributions use `source: 'prepared'`. Add a safety note to the image studio that the prepared description can contain mistakes and must be compared with the picture.

- [ ] **Step 2: Add seven support bridges**

```ts
export const M3_SUPPORT_BRIDGES: SupportBridgeDefinition[] = [
  // m3-l2, m3-l3, m3-l4 recall m3-l1 and preview m3-l5
  // m3-l6, m3-l7, m3-l8 recall m3-l5 and preview m3-l9
  // m3-l10 recalls m3-l9 and previews m3-l11
];
```

Each bridge must contain a lesson-specific `recallPrompt`, `practicePurpose`, and `nextPreview`; do not repeat one generic sentence across all lessons.

- [ ] **Step 3: Add and register the M3 portfolio**

```ts
export const M3_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm3-l11', moduleId: 'm3', crumb: '3단원 · AI와 공부하기',
  kicker: '3단원 성장 포트폴리오', title: 'AI와 함께 배우고 확인해요',
  description: '질문을 고치고, 이야기를 함께 만들고, 그림 설명을 사실과 비교한 과정을 돌아봐요.',
  studioLessonIds: ['m3-l1', 'm3-l5', 'm3-l9'],
  nextChoices: [
    { id: 'clarify-question', emoji: '❓', label: '질문에 필요한 단서를 더할 거예요.' },
    { id: 'shape-idea', emoji: '✏️', label: 'AI 제안을 내 생각에 맞게 고칠 거예요.' },
    { id: 'check-evidence', emoji: '🔎', label: '그림과 설명을 직접 비교할 거예요.' },
  ],
};
```

Import and spread/register the M3 exports in all three index files.

- [ ] **Step 4: Run the M3 contract and full prior regression**

Run: `npm run check:studio-rollout -- M3`

Expected: PASS with `M3 rollout contract passed`.

Run: `npm run check:studio-expansion-all && npm run lint`

Expected: all existing M1/M2/M5 checks and TypeScript pass.

- [ ] **Step 5: Commit**

```bash
git add src/data/studios/m3.ts src/data/supportBridges/m3.ts src/data/modulePortfolios/m3.ts src/data/studios/index.ts src/data/supportBridges/index.ts src/data/modulePortfolios/index.ts
git commit -m "feat: add M3 experience studios"
```

---

### Task 3: Implement the M4 safety studios, bridges, and portfolio

**Files:**
- Create: `src/data/studios/m4.ts`
- Create: `src/data/supportBridges/m4.ts`
- Create: `src/data/modulePortfolios/m4.ts`
- Modify: the three common index files.

**Interfaces:** Produces registered `M4_STUDIOS`, `M4_SUPPORT_BRIDGES`, and `M4_PORTFOLIO`.

- [ ] **Step 1: Verify M4 RED**

Run: `npm run check:studio-rollout -- M4`

Expected: FAIL with `src/data/studios/m4.ts is missing`.

- [ ] **Step 2: Add the exact M4 identities and prepared image stimuli**

```ts
const identities = [
  ['m4-answer-verification', 'm4-l1', 'AI 답 검증소', 'AI 답 확인 기록', 'repair-card'],
  ['m4-photo-sharing-safety', 'm4-l5', '사진 공유 안전실', '사진 공유 전 확인 카드', 'action-card'],
  ['m4-ad-clue-detective', 'm4-l10', '광고 단서 탐정실', '광고 단서 표시판', 'visual-plan'],
] as const;
```

Create full literal `StudioDefinition` objects rather than generating them at runtime. Use prepared image stimuli for `m4-l5.webp` and `m4-l10.webp`, each with factual Korean alt text and a caption. Every AI contribution is prepared. Photo sharing includes a safety note to stop, avoid sending, and ask a trusted adult when identity or purpose is unclear. Advertisement work states that one clue alone may not settle every case and encourages comparison.

- [ ] **Step 3: Add seven bridges and the portfolio**

Map `m4-l2~l4` from `m4-l1` toward `m4-l5`; map `m4-l6~l9` from `m4-l5` toward `m4-l10`. Define `M4_PORTFOLIO` for `m4-l11` with studio IDs `['m4-l1', 'm4-l5', 'm4-l10']` and next choices for checking information, protecting information, and asking a trusted adult.

- [ ] **Step 4: Register, verify GREEN, and commit**

Run: `npm run check:studio-rollout -- M4 && npm run check:studio-rollout -- M3 && npm run lint`

Expected: both module contracts and TypeScript pass.

```bash
git add src/data/studios/m4.ts src/data/supportBridges/m4.ts src/data/modulePortfolios/m4.ts src/data/studios/index.ts src/data/supportBridges/index.ts src/data/modulePortfolios/index.ts
git commit -m "feat: add M4 safety studios"
```

---

### Task 4: Implement the M6 daily-life studios, bridges, and portfolio

**Files:**
- Create: `src/data/studios/m6.ts`
- Create: `src/data/supportBridges/m6.ts`
- Create: `src/data/modulePortfolios/m6.ts`
- Modify: the three common index files.

**Interfaces:** Produces registered `M6_STUDIOS`, `M6_SUPPORT_BRIDGES`, and `M6_PORTFOLIO`.

- [ ] **Step 1: Verify M6 RED**

Run: `npm run check:studio-rollout -- M6`

Expected: FAIL with `src/data/studios/m6.ts is missing`.

- [ ] **Step 2: Add exact M6 identities and safety behavior**

```ts
const identities = [
  ['m6-shopping-choice', 'm6-l1', '장보기 선택 스튜디오', '나의 장보기 판단표', 'visual-plan'],
  ['m6-transit-change', 'm6-l4', '교통 변수 대응실', '안전 이동 계획 카드', 'action-card'],
  ['m6-safe-self-introduction', 'm6-l11', '안전한 자기소개 연구소', '상대에 맞춘 자기소개 카드', 'repair-card'],
] as const;
```

Create full literal objects. Shopping changes budget, need, stock, and allergy information. Transit changes route, battery, place familiarity, and available trusted help; its safety note states this is a prepared simulation and not live route guidance. Self-introduction changes audience and place and excludes address, phone number, password, and real-time location. All AI contributions are prepared.

- [ ] **Step 3: Add eight bridges and the portfolio**

Map `m6-l2~l3` from `m6-l1` toward `m6-l4`; map `m6-l5~l10` from `m6-l4` toward `m6-l11`. Define `M6_PORTFOLIO` for `m6-l12` with the three studio lesson IDs and choices for checking conditions, asking people, and limiting personal information.

- [ ] **Step 4: Register, verify GREEN, and commit**

Run: `npm run check:studio-rollout -- M6 && npm run check:studio-rollout -- M4 && npm run lint`

Expected: all requested module checks and TypeScript pass.

```bash
git add src/data/studios/m6.ts src/data/supportBridges/m6.ts src/data/modulePortfolios/m6.ts src/data/studios/index.ts src/data/supportBridges/index.ts src/data/modulePortfolios/index.ts
git commit -m "feat: add M6 daily life studios"
```

---

### Task 5: Complete teacher guidance and the six-module release gate

**Files:**
- Modify: `src/features/teacher/TeacherHub.tsx`
- Create: `docs/teacher-guide/m3-m4-m6-studio-expansion.md`
- Modify: `scripts/check-studio-expansion.mjs`

**Interfaces:** Teacher UI and guide expose scope, safety, modality, assessment, storage, and operation rules; the aggregate check includes the completed rollout contract.

- [ ] **Step 1: Update TeacherHub scope copy**

Replace the current-operation card with:

```tsx
<article className="studio-fact-card">
  <h3 className="font-bold">6단원 · 18개 핵심 경험 운영</h3>
  <p className="mt-1 text-sm leading-relaxed">1~6단원의 핵심 경험이 모두 완성되어 있습니다. 이미지·소리·AI 응답은 준비된 AI 예시이며 카메라·마이크 권한 없이 모든 활동을 진행할 수 있습니다.</p>
</article>
```

- [ ] **Step 2: Write the teacher guide**

The guide must list all nine new studios, explain how the existing three-step explanation becomes concept encounter/tool practice/next-experience bridge, state prepared-AI and image safety, describe support levels, list the four observation dimensions, and explain local-only evidence storage and optional export.

- [ ] **Step 3: Add the completed rollout gate to the aggregate runner**

Append `'scripts/check-complete-studio-rollout-contract.mjs'` to the `checks` array and change the final message to `six-module studio rollout: all contracts passed`.

- [ ] **Step 4: Verify all rollout checks and commit**

Run: `npm run check:studio-rollout`

Expected: `complete studio rollout: 18 studios, 44 bridges, 6 portfolios ready`.

Run: `npm run check:studio-expansion-all`

Expected: all component, content, recording, editorial, generalization, and complete-rollout contracts pass.

```bash
git add src/features/teacher/TeacherHub.tsx docs/teacher-guide/m3-m4-m6-studio-expansion.md scripts/check-studio-expansion.mjs
git commit -m "docs: complete six-module studio guidance"
```

---

### Task 6: Full automated and browser verification

**Files:**
- Modify only if a verification failure requires a targeted fix; add a failing contract assertion before any behavior fix.

**Interfaces:** Produces a clean, buildable branch and a verified local preview.

- [ ] **Step 1: Run the complete automated gate**

```bash
npm run check:studio-expansion-all
npm run check:ui-polish
npm run check:activity-icons
npm run check:encoding
npm run lint
npm run build
git diff --check
```

Expected: all commands exit 0. The existing Vite large-chunk advisory may remain non-blocking.

- [ ] **Step 2: Verify representative browser flows**

Start a worktree server on an unused port. Check:

- `m3-l9`: prepared image loads, alt/fallback exists, no automatic speech, prepared AI is labeled.
- `m4-l5`: photo safety conditions and trusted-adult wording appear.
- `m6-l4`: simulation disclaimer appears and no live route guidance is implied.
- `m3-l2`, `m4-l6`, `m6-l5`: previous experience recall, today practice purpose, next studio preview appear.
- `m3-l11`, `m4-l11`, `m6-l12`: correct module copy and three evidence references appear.
- A completed M5 studio still restores evidence after refresh.
- Browser console contains no errors.

- [ ] **Step 3: Inspect final status and log**

```bash
git status --short
git log --oneline --decorate -8
```

Expected: clean tracked worktree with only intentional commits.
