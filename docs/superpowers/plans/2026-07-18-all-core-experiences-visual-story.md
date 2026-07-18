# All Core Experiences Visual Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep all 68 lessons while converting the remaining 17 core experiences into the same four-scene visual social-story spread used by `m1-l1`.

**Architecture:** The shared `VisualNovelExperience` component remains the single renderer. Each module receives a focused `visualStories/mN.ts` data file, while the existing studio definition imports the corresponding story. Every story has four 16:9 scene assets, one invariant learning objective, three support-level copies, and three scene-linked knowledge explanations. A source-level contract accepts an optional module filter so each module can complete a red-green cycle independently.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, CSS, Node contract scripts, built-in image generation.

## Global Constraints

- Apply to the 18 core experience IDs listed in `src/data/modulePortfolios/m1.ts` through `m6.ts`; `m1-l1` remains the approved baseline and 17 lessons are added.
- Preserve exactly one lesson objective across all support levels.
- Use four story scenes: person/place, concrete life problem, attempt and comparison, safe stable ending.
- Keep scene images separate from dialogue and preserve the existing left-story/right-knowledge spread.
- Use formal Korean student-facing endings except natural character dialogue.
- Use the labels `충분한 지원`, `약한 지원`, and `도전적` only.
- TTS remains manually triggered and never auto-starts.
- Every generated image is a separate 16:9 WebP project asset without text, speech bubbles, UI, logos, or watermarks.
- Verify desktop first, plus 390px viewport and 125% text size.
- Do not merge or push without a separate user request.

## Story Map

| Lesson | Student-facing story title | Four scene beats | Three knowledge steps |
|---|---|---|---|
| `m1-l4` | `아이미는 무엇을 보았을까?` | 윤아가 사진을 보여 줌 → 아이미가 고양이라고 말함 → 가려진 귀와 꼬리를 다시 봄 → 원본과 사람의 설명을 함께 확인함 | AI는 보고 들은 특징을 찾음 / 조건에 따라 다르게 인식함 / 결과를 실제 자료와 비교함 |
| `m1-l10` | `이 일도 아이미에게 맡겨도 될까?` | 진우가 여러 부탁을 모음 → 번역과 추천을 맡김 → 친구 마음과 약 판단도 물으려 함 → 중요한 판단은 사람과 전문가에게 확인함 | AI가 잘 돕는 일 / AI가 알기 어려운 일 / 사람이 책임지고 확인할 일 |
| `m2-l1` | `“그거”가 무엇일까?` | 진우가 급식을 궁금해함 → “그거 알려 줘”라고 말함 → 아이미가 날씨를 답함 → 대상과 날짜를 넣어 다시 요청함 | AI는 말에 든 정보를 사용함 / 빠진 정보가 있으면 다르게 이해함 / 대상·때·원하는 답을 말함 |
| `m2-l6` | `내일 준비를 어떻게 부탁할까?` | 윤아가 준비물을 정리하려 함 → 긴 부탁을 하다 멈춤 → 목적·예시·순서를 나누어 말함 → 짧은 목록으로 확인함 | 요청의 목적 / 필요한 조건과 예시 / 원하는 답의 모양 |
| `m2-l10` | `너무 긴 답을 받았다면?` | 진우가 준비물을 물음 → 아이미가 길고 불확실하게 답함 → 짧게·근거와 함께 다시 요청함 → 시간표와 비교해 쓸 답을 고름 | 첫 답을 그대로 쓰지 않음 / 고칠 점을 구체적으로 말함 / 수정된 답도 확인함 |
| `m3-l1` | `동물 중에서 무엇이 궁금할까?` | 윤아가 동물 과제를 시작함 → 넓게 물어 긴 답을 받음 → 동물·목적·길이를 정함 → 자신에게 맞는 질문으로 다시 물음 | 넓은 질문과 좁은 질문 / 목적과 조건을 단서로 넣음 / 받은 답이 질문에 맞는지 확인함 |
| `m3-l5` | `작은 로봇의 다음 이야기는?` | 진우가 첫 문장을 만듦 → 아이미가 무서운 결말을 제안함 → 진우가 즐거운 분위기로 수정함 → 둘의 생각을 합쳐 이야기 보드를 완성함 | AI는 아이디어를 제안함 / 내 생각으로 수용·수정·거절함 / 함께 만든 결과를 내가 결정함 |
| `m3-l9` | `그림에 정말 그렇게 보일까?` | 윤아가 두 학생 그림을 봄 → 아이미가 소풍이라 추측함 → 보이는 것과 추측을 색으로 나눔 → 사실 중심 설명으로 고침 | 그림에서 보이는 사실 / AI가 더한 추측 / 사실과 추측을 구분해 확인함 |
| `m4-l1` | `내일 체육복이 필요할까?` | 진우가 준비물을 물음 → 아이미가 체육복이라고 확신함 → 최신 시간표에는 미술이 보임 → 공식 시간표와 선생님에게 확인함 | AI도 확신하며 틀릴 수 있음 / 근거와 날짜를 찾음 / 최신 공식 정보로 검증함 |
| `m4-l5` | `이 사진을 보내도 될까?` | 윤아가 사진 요청을 받음 → 보내려는 사진을 고름 → 교복 이름표와 위치 단서를 발견함 → 가리고 믿을 수 있는 공간에만 공유함 | 사진도 개인정보를 담음 / 상대·목적·공유 범위를 봄 / 보내기 전 가리거나 도움을 요청함 |
| `m4-l10` | `“꼭 사야 해”라는 말을 보았다면?` | 진우가 추천 게시물을 봄 → 모두에게 좋다는 말을 믿으려 함 → 광고 표시와 빠진 정보를 찾음 → 다른 자료와 필요를 비교해 결정함 | 추천과 광고의 목적 / 광고 단서와 빠진 정보 / 여러 정보와 내 필요를 비교함 |
| `m5-l1` | `버스가 오지 않는다면?` | 윤아가 약속 장소로 가려 함 → 버스가 늦어 기다림 → 도착 정보와 약속 시간이 바뀜 → 안전한 대안과 연락 방법을 고름 | 변하는 정보를 찾음 / 여러 방법의 조건을 비교함 / 새 조건에 맞게 계획을 조정함 |
| `m5-l6` | `아이미가 다른 곳을 알려 주었다면?` | 진우가 도서관 길을 물음 → 아이미가 다른 지점을 안내함 → 건물 특징과 동네를 개인정보 없이 더함 → 표지판과 사람에게 목적지를 확인함 | 같은 이름의 장소가 있을 수 있음 / 안전한 단서를 더해 다시 말함 / 이동 전 공식 정보로 확인함 |
| `m5-l11` | `라면을 끓이려는데 냄비가 없다면?` | 진우가 조리 계획을 세움 → 냄비가 없음을 발견함 → 도구·시간·안전을 다시 확인함 → 가능한 음식으로 계획을 바꾸고 보호자와 확인함 | 계획에는 재료·도구·순서가 필요함 / 조건이 달라지면 대안을 찾음 / 뜨거운 조리는 안전을 먼저 확인함 |
| `m6-l1` | `무엇부터 사야 할까?` | 윤아가 마트에서 여러 물건을 봄 → 사고 싶은 간식을 먼저 고름 → 예산과 꼭 필요한 생활용품을 확인함 → 필요·가격·안전을 비교해 목록을 조정함 | 원하는 것과 필요한 것 / 예산과 제품 정보 / 근거를 비교해 최종 선택함 |
| `m6-l4` | `늦은 버스를 계속 기다려야 할까?` | 진우가 정류장에서 기다림 → 안내 앱만 보고 계속 기다림 → 정류장 공지와 주변 안전 조건이 바뀜 → 보호자·기사·공식 안내로 안전한 이동을 정함 | 교통 정보는 변함 / 앱·현장·사람 정보를 함께 확인함 / 안전을 우선해 이동 계획을 바꿈 |
| `m6-l11` | `처음 만난 사람에게 어디까지 말할까?` | 윤아가 새 동아리 친구를 만남 → 좋아하는 활동을 소개함 → 온라인 낯선 사람이 학교와 주소를 물음 → 상대와 장소에 맞게 정보 범위를 정함 | 자기소개 정보의 종류 / 상대와 장소에 따른 범위 / 개인정보는 거절하고 도움을 요청함 |

---

### Task 1: Expand the all-studio contract

**Files:**
- Modify: `scripts/check-visual-novel-social-story-contract.mjs`

**Interfaces:**
- Consumes: portfolio studio IDs and `VisualNovelStory` source files.
- Produces: `node scripts/check-visual-novel-social-story-contract.mjs --module=mN` module gate and the existing all-module gate.

- [ ] **Step 1: Add the expected 18 lesson IDs, optional `--module` filtering, four-asset checks, four-scene checks, three-knowledge-step checks, objective and support-copy checks.**
- [ ] **Step 2: Run `node scripts/check-visual-novel-social-story-contract.mjs --module=m1` and confirm it fails on the first missing `m1-l4` story or asset.**
- [ ] **Step 3: Preserve the approved `m1-l1` UI, TTS, and responsive assertions in the same contract.**
- [ ] **Step 4: Run `npm run check:visual-novel-story` and confirm the all-module gate remains red until Tasks 2–7 finish.**
- [ ] **Step 5: Commit `test: require visual stories for every core experience`.**

### Task 2: Complete module 1

**Files:**
- Create: `src/data/studios/visualStories/m1.ts`
- Create: `docs/asset-prompts/visual-novel/m1-l4.md`
- Create: `docs/asset-prompts/visual-novel/m1-l10.md`
- Create: `public/lessons/m1-l4-vn-01.webp` through `m1-l4-vn-04.webp`
- Create: `public/lessons/m1-l10-vn-01.webp` through `m1-l10-vn-04.webp`
- Modify: `src/data/studios/m1.ts`

**Interfaces:**
- Produces: `M1_L4_VISUAL_STORY` and `M1_L10_VISUAL_STORY`, each typed as `VisualNovelStory`.

- [ ] **Step 1: Write the two four-scene prompt sets from the Story Map, with character-sheet references and the global image constraints.**
- [ ] **Step 2: Add three support-level copies and three knowledge steps for each story; import them into `M1_STUDIOS`.**
- [ ] **Step 3: Generate and inspect eight independent 16:9 scene images, then save them at the exact paths above.**
- [ ] **Step 4: Run `node scripts/check-visual-novel-social-story-contract.mjs --module=m1`, `npm run lint`, and `npm run check:student-formal-style`.**
- [ ] **Step 5: Commit `feat: add module 1 visual social stories`.**

### Task 3: Complete module 2

**Files:**
- Create: `src/data/studios/visualStories/m2.ts`
- Create: `docs/asset-prompts/visual-novel/m2-l1.md`, `m2-l6.md`, `m2-l10.md`
- Create: `public/lessons/m2-l1-vn-01.webp` through `m2-l10-vn-04.webp` for the three lesson IDs
- Modify: `src/data/studios/m2.ts`

**Interfaces:**
- Produces: `M2_L1_VISUAL_STORY`, `M2_L6_VISUAL_STORY`, `M2_L10_VISUAL_STORY`.

- [ ] **Step 1: Write the three exact four-scene prompt sets and add typed story data with the invariant lesson objectives.**
- [ ] **Step 2: Generate and inspect 12 independent 16:9 scene images.**
- [ ] **Step 3: Run the contract with `--module=m2`, TypeScript, formal-style, and encoding checks.**
- [ ] **Step 4: Commit `feat: add module 2 visual social stories`.**

### Task 4: Complete module 3

**Files:**
- Create: `src/data/studios/visualStories/m3.ts`
- Create: `docs/asset-prompts/visual-novel/m3-l1.md`, `m3-l5.md`, `m3-l9.md`
- Create: four `-vn-` WebP assets for each of `m3-l1`, `m3-l5`, `m3-l9`
- Modify: `src/data/studios/m3.ts`

**Interfaces:**
- Produces: `M3_L1_VISUAL_STORY`, `M3_L5_VISUAL_STORY`, `M3_L9_VISUAL_STORY`.

- [ ] **Step 1: Write prompt sets and typed stories that distinguish open creation from factual image description.**
- [ ] **Step 2: Generate and inspect 12 independent 16:9 scene images.**
- [ ] **Step 3: Run the `--module=m3` contract and static checks.**
- [ ] **Step 4: Commit `feat: add module 3 visual social stories`.**

### Task 5: Complete module 4

**Files:**
- Create: `src/data/studios/visualStories/m4.ts`
- Create: `docs/asset-prompts/visual-novel/m4-l1.md`, `m4-l5.md`, `m4-l10.md`
- Create: four `-vn-` WebP assets for each of `m4-l1`, `m4-l5`, `m4-l10`
- Modify: `src/data/studios/m4.ts`

**Interfaces:**
- Produces: `M4_L1_VISUAL_STORY`, `M4_L5_VISUAL_STORY`, `M4_L10_VISUAL_STORY`.

- [ ] **Step 1: Write prompt sets and typed stories that make verification, privacy, and advertising cues visible without putting readable private data in images.**
- [ ] **Step 2: Generate and inspect 12 independent 16:9 scene images.**
- [ ] **Step 3: Run the `--module=m4` contract and static checks.**
- [ ] **Step 4: Commit `feat: add module 4 visual social stories`.**

### Task 6: Complete module 5

**Files:**
- Create: `src/data/studios/visualStories/m5.ts`
- Create: `docs/asset-prompts/visual-novel/m5-l1.md`, `m5-l6.md`, `m5-l11.md`
- Create: four `-vn-` WebP assets for each of `m5-l1`, `m5-l6`, `m5-l11`
- Modify: `src/data/studios/m5.ts`

**Interfaces:**
- Produces: `M5_L1_VISUAL_STORY`, `M5_L6_VISUAL_STORY`, `M5_L11_VISUAL_STORY`.

- [ ] **Step 1: Write prompt sets and typed stories that preserve ambiguity long enough for the student to compare and revise a first judgment.**
- [ ] **Step 2: Generate and inspect 12 independent 16:9 scene images.**
- [ ] **Step 3: Run the `--module=m5` contract and static checks.**
- [ ] **Step 4: Commit `feat: add module 5 visual social stories`.**

### Task 7: Complete module 6

**Files:**
- Create: `src/data/studios/visualStories/m6.ts`
- Create: `docs/asset-prompts/visual-novel/m6-l1.md`, `m6-l4.md`, `m6-l11.md`
- Create: four `-vn-` WebP assets for each of `m6-l1`, `m6-l4`, `m6-l11`
- Modify: `src/data/studios/m6.ts`

**Interfaces:**
- Produces: `M6_L1_VISUAL_STORY`, `M6_L4_VISUAL_STORY`, `M6_L11_VISUAL_STORY`.

- [ ] **Step 1: Write prompt sets and typed stories that make choice criteria and safety boundaries explicit without reducing them to one-answer quizzes.**
- [ ] **Step 2: Generate and inspect 12 independent 16:9 scene images.**
- [ ] **Step 3: Run the `--module=m6` contract and static checks.**
- [ ] **Step 4: Commit `feat: add module 6 visual social stories`.**

### Task 8: Full verification and editorial review

**Files:**
- Modify only files that fail the checks below.

**Interfaces:**
- Consumes: all 18 visual stories and 72 scene assets.
- Produces: verified desktop, tablet, and mobile textbook behavior.

- [ ] **Step 1: Run `npm run check:visual-novel-story`, `npm run check:studio-rollout`, `npm run check:single-objective`, `npm run check:student-formal-style`, `npm run check:no-lesson-support-selector`, `npm run lint`, `npm run check:encoding`, and `npm run build`.**
- [ ] **Step 2: Open representative lessons from all six modules and verify scene progression, right-page highlighting, manual TTS, and stable navigation at desktop width.**
- [ ] **Step 3: Verify all four scenes at 390px viewport and 125% text for representative short and long story copies.**
- [ ] **Step 4: Review the 17 stories for repeated plots, single-answer moralizing, missing perspective sentences, unsafe advice, and objective drift; correct every identified issue.**
- [ ] **Step 5: Run the full verification commands again and commit `test: verify complete visual story rollout`.**

