# 학생 화면 격식 높임말 통일 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 인사말을 제외한 모든 학생 노출 문장을 격식 있는 존칭 문체로 변환하고, 학생 화면과 TTS에서 같은 문체가 유지되도록 한다.

**Architecture:** 원본 데이터와 학생 UI 문구를 직접 수정한다. 런타임 변환기는 만들지 않으며, 정적 문체 계약 검사로 학생 소스의 비격식 종결 후보를 차단한다. 교사 전용 소스, 개발 문서, 식별자와 인사말은 변환 대상에서 제외한다.

**Tech Stack:** React 19, TypeScript 5.8, Vite 6, Node.js ESM 계약 검사, PowerShell, UTF-8 한국어 소스.

## Global Constraints

- 인사 기능을 하는 `안녕하세요` 등의 표현은 유지한다.
- 학생이 실행 화면에서 읽거나 TTS로 듣는 문구만 변환한다.
- 교사 전용 화면, 개발 문서, 과거 설계 문서, 코드 주석, 식별자와 경로는 수정하지 않는다.
- 질문은 문맥에 따라 `입니까?`, `합니까?`, `습니까?`로 교정한다.
- 요청과 지시는 `해 주십시오`, `하십시오`를 사용하고 공동 수행 권유는 `합시다`를 우선한다.
- 문장 내용, 활동 정답, 난이도와 UI 구조는 변경하지 않는다.
- UTF-8, strict TypeScript, 기존 콘텐츠 계약을 유지한다.

---

### Task 1: 학생 문체 계약을 실패 상태로 추가

**Files:**
- Create: `scripts/check-student-formal-style-contract.mjs`
- Modify: `package.json`
- Modify: `scripts/check-studio-expansion.mjs`

**Interfaces:**
- Produces `npm run check:student-formal-style` and aggregate validation output.
- Student source scan excludes `src/features/teacher`, docs, comments, identifiers, and exact greeting allowlist entries.

- [ ] **Step 1: Write the failing contract**

계약 검사는 다음을 먼저 확인한다.

```js
const GREETINGS = new Set(['안녕하세요', '안녕하십니까']);
const STUDENT_FORBIDDEN = /(?:해요|어요|아요|죠|까요|나요|가요|세요|줘요|돼요|이에요|예요)(?:[.!?…]|['"`}]|$)/;
const REQUIRED = ['합니다', '습니다', '입니까?', '합니까?', '주십시오'];
```

학생 노출 문자열을 검사해 인사말을 제외한 비격식 종결 후보를 보고하고, 대표 문구가 `학생 화면` 소스에 남아 있으면 실패시킨다. 계약에는 파일별 위반 수와 전체 위반 수를 출력한다.

- [ ] **Step 2: Run the contract and 확인 RED**

Run: `npm run check:student-formal-style`

Expected: 현재 `~요`와 `~까요?` 문구가 남아 있어 실패한다.

- [ ] **Step 3: Commit the failing contract**

```bash
git add package.json scripts/check-studio-expansion.mjs scripts/check-student-formal-style-contract.mjs
git commit -m "test: require formal student honorific style"
```

### Task 2: 격식체 후보 변환 도구와 문장 검수 목록 생성

**Files:**
- Create: `scripts/transform-student-formal-style.mjs`
- Create: `scripts/report-student-formal-style-candidates.mjs`

**Interfaces:**
- `node scripts/transform-student-formal-style.mjs`는 지정된 학생 소스 파일만 UTF-8로 갱신한다.
- `node scripts/report-student-formal-style-candidates.mjs`는 변환되지 않은 후보를 파일·줄·문장별로 출력한다.

- [ ] **Step 1: Add context-aware candidate rules**

도구는 다음 순서로 적용한다.

```js
replace('안녕하세요', '안녕하세요');
replace(/무엇일까요\?/g, '무엇입니까?');
replace(/([^가-힣])일까요\?/g, '$1입니까?');
replace(/([^가-힣])나요\?/g, '$1습니까?');
replace(/([^가-힣])가요\?/g, '$1습니까?');
replace(/([^가-힣])죠\?/g, '$1습니까?');
replace(/해볼까요\?/g, '해 보겠습니까?');
replace(/볼까요\?/g, '보겠습니까?');
replace(/할까요\?/g, '하겠습니까?');
replace(/주세요/g, '주십시오');
replace(/([가-힣]+)세요/g, '$1십시오');
replace(/해봐요/g, '해 보십시오');
replace(/([가-힣]+)해요/g, '$1합니다');
replace(/([가-힣]+)어요/g, '$1습니다');
replace(/([가-힣]+)아요/g, '$1습니다');
replace(/이에요|예요/g, '입니다');
```

불규칙 활용(`있어요→있습니다`, `봐요→봅니다`, `가요→갑니다`, `돼요→됩니다`, `좋아요→좋습니다`, `알아요→압니다`)과 `~까요?` 질문은 별도 사전으로 처리한다. 자동 후보는 최종 문장으로 간주하지 않는다.

- [ ] **Step 2: Run the candidate transform on student sources**

대상은 `src/data`, `src/components`, `src/views/Home.tsx`, `src/views/ContentsView.tsx`, `src/views/LessonView.tsx`, `src/features/studio`, 학생용 `src/utils`로 제한한다. `src/features/teacher`와 코드 주석·식별자는 제외한다.

- [ ] **Step 3: Generate the remaining-candidate report**

Run: `node scripts/report-student-formal-style-candidates.mjs`

Expected: 남은 문장을 유형별로 출력하고, 인사말 예외만 허용한다.

### Task 3: 학생 콘텐츠와 공용 UI 문장별 검수

**Files:**
- Modify: `src/data/lessons/m1.ts` through `src/data/lessons/m6.ts`
- Modify: `src/data/lessons/hard/m1.ts` through `src/data/lessons/hard/m6.ts`
- Modify: `src/data/story.ts`, `src/data/generalizationCycles.ts`, `src/data/studentDictionary.ts`, `src/data/pecs.ts`
- Modify: `src/data/studios/*.ts`, `src/data/modulePortfolios/*.ts`
- Modify: student-facing files under `src/components`, `src/views`, `src/features/studio`, and selected `src/utils`

**Interfaces:**
- All lesson and studio data remains structurally identical; only visible copy changes.
- TTS receives the same formalized strings that are rendered on screen.

- [ ] **Step 1: Review every remaining candidate by context**

Classify each candidate as declarative, question, request, instruction, feedback, quoted prompt, greeting, noun/label, or technical identifier. Apply the rules from the design spec and preserve exact greetings.

- [ ] **Step 2: Verify representative transformations**

Required examples:

```text
AI가 있어요.             → AI가 있습니다.
무엇일까요?              → 무엇입니까?
확인했나요?              → 확인했습니까?
골라 보세요.             → 골라 보십시오.
말해 주세요.             → 말해 주십시오.
함께 해볼까요?           → 함께 해 봅시다.
안녕하세요.              → 안녕하세요.
```

- [ ] **Step 3: Run content contracts**

Run: `npm run check:student-formal-style` and `npm run check:studio-expansion-all`

Expected: 0 non-greeting informal sentence endings; existing lesson, studio, support, portfolio and safety contracts remain green.

### Task 4: Full verification and browser review

**Files:**
- Test: `scripts/check-student-formal-style-contract.mjs`
- Test: student runtime screens at representative lesson, game, dictionary, studio, and error states.

- [ ] **Step 1: Run static checks**

```bash
npm run check:student-formal-style
npm run check:studio-expansion-all
npm run check:ui-polish
npm run check:activity-icons
npm run check:encoding
npm run lint
npm run build
git diff --check
```

- [ ] **Step 2: Verify browser samples**

Check `m1-l1`, one game lesson, one studio lesson, dictionary feedback, and one error/empty state. Confirm visible text and TTS labels use formal endings, greetings remain unchanged, and no console errors appear.

- [ ] **Step 3: Commit and integrate**

```bash
git add src scripts package.json
git commit -m "fix: use formal honorifics in student screens"
```

After all checks pass, merge the feature branch into `main`, rerun the full verification on `main`, and reconnect the local preview server.
