# M1 and M2 Experience Studio Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 5단원에서 검증한 경험 중심 스튜디오를 1·2단원의 핵심 경험 6개, 지원 차시 14개, 단원 포트폴리오 2개로 확장하고 기존 차시의 마지막 화면 TTS 자동 재생을 제거한다.

**Architecture:** 기존 18/44/6 역할 레지스트리와 `StudioEvidenceV2`는 유지한다. 준비형 이미지·소리 자극, 공통 지원 브리지 레지스트리, 데이터 기반 단원 포트폴리오를 추가하고, 완성 정의가 있는 1·2·5단원만 새 화면으로 라우팅한다. 1단원을 완결·검증한 뒤 2단원을 공개한다.

**Tech Stack:** React 19, TypeScript 5.8 strict mode, Vite 6, Tailwind CSS 4, Web Speech API direct-action TTS, Web Storage API, 기존 Node 정적 계약 검사.

## Global Constraints

- 기준 설계 문서는 `docs/superpowers/specs/2026-07-16-m1-m2-experience-studio-expansion-design.md`이다.
- 기존 68차시, 차시 번호·제목, 진도, 3수준 설명, `ai-students-generalization-v1`, `ai-students-studio-evidence-v2`를 유지한다.
- 역할 수는 스튜디오 18개, 지원 44개, 단원 마무리 6개를 유지한다.
- 이번 단계에서 완성되는 스튜디오는 `m1-l1`, `m1-l4`, `m1-l10`, `m2-l1`, `m2-l6`, `m2-l10`, 기존 `m5-l1`, `m5-l6`, `m5-l11`의 9개다.
- 새 AI 기여의 출처는 모두 `prepared`다. 외부 AI, 카메라, 파일 업로드, 마이크 입력 권한을 추가하지 않는다.
- 준비형 소리는 학생이 버튼을 직접 눌렀을 때만 재생한다.
- 어떤 마지막 단계도 사용자 조작 없이 TTS를 시작하지 않는다.
- 지원 수준 학생용 표기는 `충분한 지원`, `보통`, `도전적`만 사용한다.
- 학생이 AI 의견을 거절하거나 선택을 유지해도 실패로 표시하지 않는다.
- 음성·이미지·그림 원본과 전체 AI 대화는 과정기록에 저장하지 않는다.
- 정의가 없는 스튜디오와 포트폴리오는 기존 `ImplementedLesson`으로 폴백한다.
- 사용자 소유 미추적 파일과 `output/`은 건드리지 않는다.
- 모든 파일은 UTF-8로 저장하고 기존 인코딩 검사를 통과한다.

---

## File Structure Map

### Create

- `scripts/check-studio-expansion-contract.mjs` — 1·2·5단원 완성 정의, 자극, 브리지, 포트폴리오, TTS 금지 계약.
- `scripts/check-studio-expansion.mjs` — 확장 검사 집계 실행기.
- `src/features/studio/components/PreparedStimulusPanel.tsx` — 이미지와 직접 조작 소리 자극 렌더러.
- `src/data/studios/shared.ts` — 세 지원 프로필과 공통 표현 통로.
- `src/data/studios/m1.ts` — 1단원 스튜디오 3개.
- `src/data/studios/m2.ts` — 2단원 스튜디오 3개.
- `src/data/supportBridges/types.ts` — 공통 `SupportBridgeDefinition`.
- `src/data/supportBridges/index.ts` — 완성 브리지 조회기.
- `src/data/supportBridges/m1.ts` — 1단원 지원 브리지 7개.
- `src/data/supportBridges/m2.ts` — 2단원 지원 브리지 7개.
- `src/data/modulePortfolios/types.ts` — `ModulePortfolioDefinition`.
- `src/data/modulePortfolios/index.ts` — 완성 포트폴리오 조회기.
- `src/data/modulePortfolios/m1.ts` — 1단원 마무리 데이터.
- `src/data/modulePortfolios/m2.ts` — 2단원 마무리 데이터.
- `src/data/modulePortfolios/m5.ts` — 기존 5단원 하드코딩을 옮긴 데이터.
- `docs/teacher-guide/m1-m2-studio-expansion.md` — 교사용 수업·준비형 AI·저장·TTS 안내.

### Modify

- `package.json` — `check:studio-expansion` 명령 추가.
- `src/features/studio/types.ts` — `PreparedStimulus`과 선택적 자극 필드 추가.
- `src/features/studio/components/StudioExperience.tsx` — 준비형 자극 표시.
- `src/data/studios/m5.ts` — 공통 지원 프로필과 표현 통로 사용.
- `src/data/studios/index.ts` — M1, M2, M5 정의 등록.
- `src/data/supportBridges/m5.ts` — 공통 타입 사용, 로컬 조회기 제거.
- `src/features/studio/SupportLessonBridge.tsx` — 공통 브리지 타입 사용.
- `src/features/studio/ModuleCloseLessonView.tsx` — 데이터 기반 공통 포트폴리오.
- `src/views/LessonView.tsx` — 공통 브리지·포트폴리오 조회와 TTS 자동 효과 제거.
- `src/features/teacher/TeacherHub.tsx` — 현재 운영 단원을 1·2·5단원으로 갱신.
- `scripts/check-studio-pilot-contract.mjs` — M5 파일럿 검사를 공통 레지스트리 구조에 맞춤.
- `scripts/check-m5-pilot.mjs` — 기존 파일럿 집계가 계속 성공하도록 유지.

---

### Task 1: Legacy wrap-up TTS regression guard

**Files:**
- Create: `scripts/check-studio-expansion-contract.mjs`
- Modify: `package.json`
- Modify: `src/views/LessonView.tsx`

**Interfaces:**
- Consumes: 기존 `useSpeak().speakNow` 직접 조작 API.
- Produces: `npm run check:studio-expansion`, 마지막 화면 자동 TTS가 없는 `ImplementedLesson`.

- [ ] **Step 1: 자동 TTS를 잡는 실패 계약을 작성한다**

```js
// scripts/check-studio-expansion-contract.mjs
import fs from 'node:fs';

const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const forbidden of [
  'if (isWrapUp) speak(wrapUpText)',
  'speak(wrapUpText)',
]) {
  if (lessonView.includes(forbidden)) {
    throw new Error(`legacy wrap-up must not auto-start TTS: ${forbidden}`);
  }
}

console.log('studio expansion contract: TTS entry guard passed');
```

`package.json`에 다음 명령을 추가한다.

```json
"check:studio-expansion": "node scripts/check-studio-expansion-contract.mjs"
```

- [ ] **Step 2: 계약이 현재 자동 호출 때문에 실패하는지 확인한다**

Run: `npm run check:studio-expansion`

Expected: `legacy wrap-up must not auto-start TTS` 오류로 종료 코드 1.

- [ ] **Step 3: 마지막 화면 자동 낭독 효과를 제거한다**

`LessonView.tsx`에서 `useSpeak` 구조 분해를 직접 조작 함수만 남긴다.

```tsx
const { speakNow } = useSpeak();
```

다음 효과 전체를 삭제한다.

```tsx
useEffect(() => {
  if (isWrapUp) speak(wrapUpText);
}, [isWrapUp, wrapUpText]);
```

본문·목표·정리의 기존 읽기 버튼은 `speakNow`를 계속 사용한다.

- [ ] **Step 4: TTS 계약과 타입을 확인한다**

Run: `npm run check:studio-expansion && npm run lint`

Expected: 두 명령 종료 코드 0.

- [ ] **Step 5: TTS 회귀 방지를 커밋한다**

```powershell
git add package.json scripts/check-studio-expansion-contract.mjs src/views/LessonView.tsx
git commit -m "fix: prevent automatic wrap-up narration"
```

---

### Task 2: Prepared image and speech stimulus component

**Files:**
- Modify: `src/features/studio/types.ts`
- Create: `src/features/studio/components/PreparedStimulusPanel.tsx`
- Modify: `src/features/studio/components/StudioExperience.tsx`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Consumes: `useSpeak().speakNow(text)`, `StudioDefinition.encounter`, `StudioDefinition.conditionChange`.
- Produces: `PreparedStimulus`, `PreparedStimulusPanel({ stimuli, accent })`.

- [ ] **Step 1: 준비형 자극 계약을 추가한다**

검사기에 다음 검증을 추가한다.

```js
const types = fs.readFileSync('src/features/studio/types.ts', 'utf8');
const panel = fs.readFileSync('src/features/studio/components/PreparedStimulusPanel.tsx', 'utf8');
const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');

for (const token of ['export type PreparedStimulus', "kind: 'image'", "kind: 'speech'", 'stimuli?: PreparedStimulus[]']) {
  if (!types.includes(token)) throw new Error(`prepared stimulus type missing: ${token}`);
}
for (const token of ['이미지를 불러오지 못했어요', '소리 듣기', 'speakNow(stimulus.text)']) {
  if (!panel.includes(token)) throw new Error(`prepared stimulus fallback missing: ${token}`);
}
if (!experience.includes('<PreparedStimulusPanel')) throw new Error('studio does not render prepared stimuli');
if (panel.includes('useEffect')) throw new Error('prepared speech must not auto-play');
```

- [ ] **Step 2: 새 계약이 타입과 컴포넌트 누락으로 실패하는지 확인한다**

Run: `npm run check:studio-expansion`

Expected: `prepared stimulus type missing` 오류.

- [ ] **Step 3: 자극 타입을 추가한다**

```ts
export type PreparedStimulus =
  | {
      id: string;
      kind: 'image';
      src: string;
      alt: string;
      caption: string;
    }
  | {
      id: string;
      kind: 'speech';
      text: string;
      label: string;
    };
```

`StudioDefinition`의 두 장면에 다음 선택 필드를 추가한다.

```ts
encounter: {
  title: string;
  description: string;
  facts: string[];
  stimuli?: PreparedStimulus[];
};
conditionChange: {
  description: string;
  facts: string[];
  stimuli?: PreparedStimulus[];
};
```

- [ ] **Step 4: 자극 패널을 구현한다**

`PreparedStimulusPanel.tsx`는 이미지 로드 실패 ID를 로컬 상태로 관리한다. 이미지에는 `alt`와 `caption`을 항상 제공한다. 소리는 아래 직접 조작 버튼만 사용한다.

```tsx
<button
  type="button"
  onClick={() => speakNow(stimulus.text)}
  aria-label={`${stimulus.label} 소리 듣기`}
>
  <Icon name="speaker" size={20} /> 소리 듣기
</button>
<p>{stimulus.text}</p>
```

이미지 실패 시 다음 텍스트 카드를 렌더링한다.

```tsx
<div role="img" aria-label={stimulus.alt}>
  <strong>이미지를 불러오지 못했어요.</strong>
  <p>{stimulus.caption}</p>
</div>
```

- [ ] **Step 5: 현재 장면의 자극만 스튜디오 왼쪽 면에 연결한다**

`StudioExperience`에서 자극을 선택한다.

```tsx
const contextStimuli = showingChangedContext
  ? definition.conditionChange.stimuli
  : definition.encounter.stimuli;
```

`contextDescription` 아래, 사실 카드 위에 렌더링한다.

```tsx
{contextStimuli?.length ? (
  <PreparedStimulusPanel stimuli={contextStimuli} accent={accent} />
) : null}
```

전이와 완료 단계에는 준비형 자극을 반복 표시하지 않는다.

- [ ] **Step 6: 계약·타입·기존 파일럿을 확인한다**

Run: `npm run check:studio-expansion && npm run check:pilot && npm run lint`

Expected: 모든 명령 종료 코드 0.

- [ ] **Step 7: 준비형 자극 기반을 커밋한다**

```powershell
git add scripts/check-studio-expansion-contract.mjs src/features/studio/types.ts src/features/studio/components/PreparedStimulusPanel.tsx src/features/studio/components/StudioExperience.tsx
git commit -m "feat: add prepared multimodal studio stimuli"
```

---

### Task 3: Shared studio constants and generic support bridge registry

**Files:**
- Create: `src/data/studios/shared.ts`
- Modify: `src/data/studios/m5.ts`
- Create: `src/data/supportBridges/types.ts`
- Create: `src/data/supportBridges/index.ts`
- Modify: `src/data/supportBridges/m5.ts`
- Modify: `src/features/studio/SupportLessonBridge.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `scripts/check-studio-pilot-contract.mjs`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Produces: `STUDIO_SUPPORT_PROFILES`, `STUDIO_EXPRESSION_MODES`, `SupportBridgeDefinition`, `getSupportBridge(lessonId)`.

- [ ] **Step 1: 공통 레지스트리 계약을 먼저 추가한다**

```js
const bridgeIndex = fs.readFileSync('src/data/supportBridges/index.ts', 'utf8');
const bridgeComponent = fs.readFileSync('src/features/studio/SupportLessonBridge.tsx', 'utf8');
const rootLesson = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const token of ['M5_SUPPORT_BRIDGES', 'getSupportBridge']) {
  if (!bridgeIndex.includes(token)) throw new Error(`generic bridge registry missing: ${token}`);
}
if (bridgeComponent.includes("supportBridges/m5")) throw new Error('bridge component must use the common type');
if (!rootLesson.includes("from '../data/supportBridges'")) throw new Error('LessonView must use the bridge registry');
```

- [ ] **Step 2: 검사 실패를 확인한다**

Run: `npm run check:studio-expansion`

Expected: `generic bridge registry missing` 오류.

- [ ] **Step 3: 공통 스튜디오 상수를 만든다**

`src/data/studios/shared.ts`에 M5와 동일한 세 프로필과 표현 통로를 옮긴다.

```ts
export const STUDIO_SUPPORT_PROFILES = {
  full: { visibleFactCount: 2, choiceLimit: 2, hint: '중요한 정보 두 가지부터 함께 찾아봐요.', aiRoleDepth: 'direct' },
  light: { visibleFactCount: 3, choiceLimit: 3, hint: '달라진 조건을 보고 내 방법을 다시 살펴봐요.', aiRoleDepth: 'prompting' },
  challenge: { visibleFactCount: 4, hint: 'AI 의견의 장점과 한계를 비교해 내 판단을 설명해 봐요.', aiRoleDepth: 'counterpoint' },
} satisfies StudioDefinition['supportProfiles'];

export const STUDIO_EXPRESSION_MODES = ['choice', 'aac', 'text', 'speech', 'draw'] as const;
```

M5의 로컬 상수를 제거하고 이 두 export를 사용한다.

- [ ] **Step 4: 공통 브리지 타입과 조회기를 만든다**

`types.ts`에는 현재 M5의 `SupportBridgeDefinition`을 그대로 옮긴다. `m5.ts`는 이 타입을 import하고 로컬 `Map`과 `getSupportBridge`를 제거한다.

```ts
const BRIDGE_BY_LESSON = new Map<LessonId, SupportBridgeDefinition>(
  M5_SUPPORT_BRIDGES.map((bridge) => [bridge.lessonId, bridge]),
);

export function getSupportBridge(lessonId: LessonId): SupportBridgeDefinition | undefined {
  return BRIDGE_BY_LESSON.get(lessonId);
}
```

`SupportLessonBridge`는 `../../data/supportBridges/types`, `LessonView`는 `../data/supportBridges`에서 import한다.

- [ ] **Step 5: M5 계약을 새 경로에 맞춘다**

M5 계약은 브리지 데이터 존재를 `m5.ts`에서 계속 확인하되, `getSupportBridge` 토큰은 `supportBridges/index.ts`, 컴포넌트 연결은 `LessonView.tsx`에서 확인한다.

- [ ] **Step 6: 모든 관련 검사를 실행한다**

Run: `npm run check:studio-expansion && npm run check:pilot && npm run lint`

Expected: 모든 명령 종료 코드 0.

- [ ] **Step 7: 공통 레지스트리 리팩터를 커밋한다**

```powershell
git add scripts/check-studio-pilot-contract.mjs scripts/check-studio-expansion-contract.mjs src/data/studios/shared.ts src/data/studios/m5.ts src/data/supportBridges/types.ts src/data/supportBridges/index.ts src/data/supportBridges/m5.ts src/features/studio/SupportLessonBridge.tsx src/views/LessonView.tsx
git commit -m "refactor: generalize studio and bridge registries"
```

---

### Task 4: Data-driven module portfolio

**Files:**
- Create: `src/data/modulePortfolios/types.ts`
- Create: `src/data/modulePortfolios/m5.ts`
- Create: `src/data/modulePortfolios/index.ts`
- Modify: `src/features/studio/ModuleCloseLessonView.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `scripts/check-studio-pilot-contract.mjs`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Produces: `ModulePortfolioDefinition`, `getModulePortfolioDefinition(lessonId)`.

- [ ] **Step 1: 5단원 하드코딩 제거 계약을 작성한다**

```js
const portfolioIndex = fs.readFileSync('src/data/modulePortfolios/index.ts', 'utf8');
const portfolioView = fs.readFileSync('src/features/studio/ModuleCloseLessonView.tsx', 'utf8');
for (const token of ['ModulePortfolioDefinition', 'getModulePortfolioDefinition']) {
  if (!portfolioIndex.includes(token) && !portfolioView.includes(token)) {
    throw new Error(`module portfolio interface missing: ${token}`);
  }
}
for (const forbidden of ["themeFor('m5')", "['m5-l1', 'm5-l6', 'm5-l11']", "lessonId === 'm5-l12'"]) {
  if (portfolioView.includes(forbidden) || rootLesson.includes(forbidden)) {
    throw new Error(`M5 portfolio hardcoding remains: ${forbidden}`);
  }
}
```

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:studio-expansion`

Expected: `module portfolio interface missing` 오류.

- [ ] **Step 3: 포트폴리오 타입과 5단원 데이터를 만든다**

```ts
export interface ModulePortfolioDefinition {
  lessonId: LessonId;
  moduleId: ModuleId;
  crumb: string;
  kicker: string;
  title: string;
  description: string;
  studioLessonIds: readonly LessonId[];
  nextChoices: StudioChoice[];
}
```

M5 데이터는 현재 화면 문구를 그대로 사용한다.

```ts
export const M5_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm5-l12',
  moduleId: 'm5',
  crumb: '5단원 · 나는 문제 해결사!',
  kicker: '5단원 마무리 포트폴리오',
  title: '나는 문제 해결사!',
  description: '세 장면에서 처음 생각하고, AI와 비교하고, 조건에 맞게 판단한 과정을 돌아봐요.',
  studioLessonIds: ['m5-l1', 'm5-l6', 'm5-l11'],
  nextChoices: [
    { id: 'find-info', emoji: '🔎', label: '중요한 정보를 먼저 찾아볼 거예요.' },
    { id: 'ask-ai', emoji: '💬', label: 'AI에게 다른 방법이나 확인 질문을 부탁할 거예요.' },
    { id: 'adjust', emoji: '🔄', label: '조건이 달라지면 계획을 다시 살펴볼 거예요.' },
  ],
};
```

- [ ] **Step 4: 포트폴리오 화면을 데이터 기반으로 바꾼다**

컴포넌트 props를 다음으로 바꾼다.

```ts
interface Props {
  definition: ModulePortfolioDefinition;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}
```

`lessonId`, `themeFor`, 기록 필터, 제목, 설명, 선택지는 모두 `definition`에서 가져온다.

- [ ] **Step 5: 라우팅을 정의 조회 방식으로 바꾼다**

```tsx
const portfolioDefinition = getModulePortfolioDefinition(lessonId);
if (portfolioDefinition) {
  return (
    <ModuleCloseLessonView
      definition={portfolioDefinition}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    />
  );
}
```

- [ ] **Step 6: M5 회귀와 타입을 확인한다**

Run: `npm run check:studio-expansion && npm run check:pilot && npm run lint && npm run build`

Expected: 모든 명령 종료 코드 0.

- [ ] **Step 7: 공통 포트폴리오를 커밋한다**

```powershell
git add scripts/check-studio-pilot-contract.mjs scripts/check-studio-expansion-contract.mjs src/data/modulePortfolios src/features/studio/ModuleCloseLessonView.tsx src/views/LessonView.tsx
git commit -m "refactor: make module portfolios data driven"
```

---

### Task 5: M1 studio definitions

**Files:**
- Create: `src/data/studios/m1.ts`
- Modify: `src/data/studios/index.ts`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Produces: `M1_STUDIOS: StudioDefinition[]` with lessons `m1-l1`, `m1-l4`, `m1-l10`.

- [ ] **Step 1: M1 콘텐츠 계약을 작성한다**

```js
const m1 = fs.readFileSync('src/data/studios/m1.ts', 'utf8');
for (const id of ['m1-daily-ai-finder', 'm1-eyes-ears-lab', 'm1-ability-test']) {
  if (!m1.includes(`id: '${id}'`)) throw new Error(`M1 studio missing: ${id}`);
}
for (const lessonId of ['m1-l1', 'm1-l4', 'm1-l10']) {
  if (!m1.includes(`lessonId: '${lessonId}'`)) throw new Error(`M1 lesson mapping missing: ${lessonId}`);
}
if ((m1.match(/source: 'prepared'/g) ?? []).length !== 3) throw new Error('M1 AI source must be prepared');
for (const text of ['나의 AI 발견 카드', 'AI 인식 실험 기록', 'AI 사용 판단 설명서']) {
  if (!m1.includes(text)) throw new Error(`M1 artifact missing: ${text}`);
}
if (!m1.includes("kind: 'image'") || !m1.includes("kind: 'speech'")) throw new Error('M1 recognition studio needs image and speech stimuli');
```

- [ ] **Step 2: 계약이 파일 누락으로 실패하는지 확인한다**

Run: `npm run check:studio-expansion`

Expected: `ENOENT` 또는 `M1 studio missing` 오류.

- [ ] **Step 3: 세 정의를 다음 콘텐츠 행렬로 구현한다**

모든 정의는 `STUDIO_SUPPORT_PROFILES`와 `[...STUDIO_EXPRESSION_MODES]`를 사용한다.

| lessonId | id | encounter | conditionChange | AI role | artifact | transfer |
|---|---|---|---|---|---|---|
| `m1-l1` | `m1-daily-ai-finder` | 아침과 등굣길의 휴대전화 추천, 알람, 자동문 | 인터넷 끊김, 사용자별 결과, 정해진 동작 | 근거를 묻는 AI | 나의 AI 발견 카드 | 교실과 도서관의 AI 찾기 |
| `m1-l4` | `m1-eyes-ears-lab` | 고양이 AAC 이미지와 `도서관으로 가요` 소리 문장 | 그림 일부 가림, 비슷한 모양, 주변 소음 | 다시 확인을 권하는 AI | AI 인식 실험 기록 | 흐린 표지판과 잘 안 들린 안내 |
| `m1-l10` | `m1-ability-test` | 번역, 추천, 마음 알아맞히기, 안전 판단 | 빠르지만 근거 없음, 개인정보 요구, 실제 안전 | 한계를 반론하는 AI | AI 사용 판단 설명서 | 처음 보는 AI 기능 판단 |

첫 선택 카드와 전이 카드는 다음 라벨을 포함한다.

```ts
const M1_REQUIRED_CHOICES = {
  finder: ['겉모습을 보고 AI라고 해요.', '결과가 달라지는지 살펴봐요.', '무조건 AI가 아니라고 해요.'],
  recognition: ['AI 말만 믿어요.', '실제 그림이나 소리를 다시 확인해요.', '조건을 바꾸어 다시 살펴봐요.'],
  ability: ['AI에게 맡겨요.', 'AI 답을 확인하고 사용해요.', '사람에게 부탁해요.'],
};
```

M1-l4 자극은 다음 자산과 문장을 사용한다.

```ts
stimuli: [
  { id: 'cat-card', kind: 'image', src: '/AITEXTBOOKforSTUDENTS/lessons/pecs/cat.webp', alt: '고양이 그림 카드', caption: '귀와 꼬리가 있는 고양이 그림이에요.' },
  { id: 'library-speech', kind: 'speech', text: '도서관으로 가요', label: '깨끗한 안내 문장' },
]
```

- [ ] **Step 4: 완성 레지스트리에 M1을 먼저 공개한다**

```ts
const READY_STUDIOS = new Map<LessonId, StudioDefinition>(
  [...M1_STUDIOS, ...M5_STUDIOS].map((studio) => [studio.lessonId, studio]),
);
```

- [ ] **Step 5: M1·M5 계약과 빌드를 실행한다**

Run: `npm run check:studio-expansion && npm run check:pilot && npm run lint && npm run build`

Expected: 완성 스튜디오가 M1 3개와 M5 3개로 확인되고 모든 명령 종료 코드 0.

- [ ] **Step 6: M1 스튜디오를 커밋한다**

```powershell
git add scripts/check-studio-expansion-contract.mjs src/data/studios/m1.ts src/data/studios/index.ts
git commit -m "feat: add M1 experience studios"
```

---

### Task 6: M1 support bridges and portfolio

**Files:**
- Create: `src/data/supportBridges/m1.ts`
- Create: `src/data/modulePortfolios/m1.ts`
- Modify: `src/data/supportBridges/index.ts`
- Modify: `src/data/modulePortfolios/index.ts`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Produces: M1 bridge 7개, `M1_PORTFOLIO`.

- [ ] **Step 1: M1 연결 계약을 추가한다**

```js
const m1Bridges = fs.readFileSync('src/data/supportBridges/m1.ts', 'utf8');
for (const lessonId of ['m1-l2', 'm1-l3', 'm1-l5', 'm1-l6', 'm1-l7', 'm1-l8', 'm1-l9']) {
  if (!m1Bridges.includes(`lessonId: '${lessonId}'`)) throw new Error(`M1 bridge missing: ${lessonId}`);
}
const m1Portfolio = fs.readFileSync('src/data/modulePortfolios/m1.ts', 'utf8');
for (const token of ["lessonId: 'm1-l11'", "'m1-l1', 'm1-l4', 'm1-l10'", '1단원 성장 포트폴리오']) {
  if (!m1Portfolio.includes(token)) throw new Error(`M1 portfolio missing: ${token}`);
}
```

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:studio-expansion`

Expected: `M1 bridge missing` 오류.

- [ ] **Step 3: M1 지원 브리지 7개를 작성한다**

정확한 연결은 다음과 같다.

```ts
const M1_BRIDGE_TARGETS = {
  'm1-l2': ['m1-l1', 'm1-l4'],
  'm1-l3': ['m1-l1', 'm1-l4'],
  'm1-l5': ['m1-l4', 'm1-l10'],
  'm1-l6': ['m1-l4', 'm1-l10'],
  'm1-l7': ['m1-l4', 'm1-l10'],
  'm1-l8': ['m1-l4', 'm1-l10'],
  'm1-l9': ['m1-l4', 'm1-l10'],
} as const;
```

각 `practicePurpose`는 차례대로 `기계와 AI 구분`, `AI가 답을 만드는 방법`, `음성 인식 조건`, `학습 자료의 다양성`, `AI가 잘하는 일`, `AI가 못하는 일`, `일에 맞는 AI 종류`를 명시한다. 각 `recallPrompt`는 이전 스튜디오에서 실제로 한 판단을 회상하고, `nextPreview`는 다음 스튜디오의 판단을 예고한다.

- [ ] **Step 4: M1 포트폴리오를 작성한다**

```ts
export const M1_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm1-l11',
  moduleId: 'm1',
  crumb: '1단원 · AI를 찾아보고 판단하기',
  kicker: '1단원 성장 포트폴리오',
  title: 'AI를 근거로 판단해요',
  description: '생활 속 AI를 찾고, AI가 보고 듣는 결과를 확인하고, 맡길 일을 판단한 과정을 돌아봐요.',
  studioLessonIds: ['m1-l1', 'm1-l4', 'm1-l10'],
  nextChoices: [
    { id: 'look-for-clue', emoji: '🔎', label: 'AI라고 생각한 근거를 찾아볼 거예요.' },
    { id: 'check-result', emoji: '✅', label: 'AI가 본 것과 실제 장면을 비교할 거예요.' },
    { id: 'ask-person', emoji: '🙋', label: '중요한 일은 사람과 함께 확인할 거예요.' },
  ],
};
```

- [ ] **Step 5: 두 공통 레지스트리에 M1을 등록한다**

`supportBridges/index.ts`는 `[...M1_SUPPORT_BRIDGES, ...M5_SUPPORT_BRIDGES]`, `modulePortfolios/index.ts`는 `[M1_PORTFOLIO, M5_PORTFOLIO]`를 등록한다.

- [ ] **Step 6: M1 완결 게이트를 실행한다**

Run: `npm run check:studio-expansion && npm run check:pilot && npm run check:generalization && npm run lint && npm run build`

Expected: 모든 명령 종료 코드 0.

- [ ] **Step 7: M1 연결과 마무리를 커밋한다**

```powershell
git add scripts/check-studio-expansion-contract.mjs src/data/supportBridges/m1.ts src/data/supportBridges/index.ts src/data/modulePortfolios/m1.ts src/data/modulePortfolios/index.ts
git commit -m "feat: connect M1 studios and portfolio"
```

---

### Task 7: M2 studio definitions

**Files:**
- Create: `src/data/studios/m2.ts`
- Modify: `src/data/studios/index.ts`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Produces: `M2_STUDIOS: StudioDefinition[]` with lessons `m2-l1`, `m2-l6`, `m2-l10`.

- [ ] **Step 1: M2 콘텐츠 계약을 작성한다**

```js
const m2 = fs.readFileSync('src/data/studios/m2.ts', 'utf8');
for (const id of ['m2-misunderstood-request', 'm2-request-workshop', 'm2-repair-dialogue']) {
  if (!m2.includes(`id: '${id}'`)) throw new Error(`M2 studio missing: ${id}`);
}
for (const lessonId of ['m2-l1', 'm2-l6', 'm2-l10']) {
  if (!m2.includes(`lessonId: '${lessonId}'`)) throw new Error(`M2 lesson mapping missing: ${lessonId}`);
}
if ((m2.match(/source: 'prepared'/g) ?? []).length !== 3) throw new Error('M2 AI source must be prepared');
for (const text of ['요청 고치기 카드', '나의 요청 제작 레시피', '고쳐 묻기 대화 기록']) {
  if (!m2.includes(text)) throw new Error(`M2 artifact missing: ${text}`);
}
for (const label of ['준비된 AI 예시', '안전한 연습 응답']) {
  if (!m2.includes(label)) throw new Error(`prepared AI disclosure missing: ${label}`);
}
```

- [ ] **Step 2: 계약이 파일 누락으로 실패하는지 확인한다**

Run: `npm run check:studio-expansion`

Expected: `ENOENT` 또는 `M2 studio missing` 오류.

- [ ] **Step 3: 세 정의를 다음 콘텐츠 행렬로 구현한다**

| lessonId | id | encounter | conditionChange | AI role | artifact | transfer |
|---|---|---|---|---|---|---|
| `m2-l1` | `m2-misunderstood-request` | `그거 알려 줘`를 AI가 다르게 이해함 | 대상, 시간, 답 형식이 필요함 | 뜻을 좁히는 AI | 요청 고치기 카드 | 이름 모르는 물건 부탁 |
| `m2-l6` | `m2-request-workshop` | 학교 준비 도움 요청 | 시간 감소, 표 형식, 한 단계씩 | 빠진 조건을 묻는 AI | 나의 요청 제작 레시피 | 다른 생활 부탁 제작 |
| `m2-l10` | `m2-repair-dialogue` | 너무 길고 확실하지 않은 첫 연습 응답 | 읽기 수준, 시간, 사실 확인 | 수정 뒤에도 확인을 요구하는 AI | 고쳐 묻기 대화 기록 | 새 AI 답 판단 |

첫 선택과 전이에는 다음 행동을 포함한다.

```ts
const M2_REQUIRED_CHOICES = {
  misunderstood: ['같은 말을 그대로 반복해요.', '필요한 정보를 한 가지 더 말해요.', 'AI 답을 그대로 사용해요.'],
  workshop: ['목적부터 말해요.', '예시와 순서를 함께 정해요.', '개인정보를 자세히 말해요.'],
  repair: ['답을 그대로 써요.', '더 짧고 쉬운 말로 고쳐 달라고 해요.', '근거를 확인하거나 사용하지 않아요.'],
};
```

M2-l10은 첫 번째 불완전한 응답을 `encounter.description`에 명시하고, 학생의 첫 표현을 수정 요청으로 사용한다. `aiContribution.text`는 수정 후 두 번째 준비형 응답이며, 학생은 decision 단계에서 수용·수정·거절한다. 전체 대화 원문은 저장하지 않고 결과물 요약만 저장한다.

- [ ] **Step 4: 레지스트리에 M2를 공개한다**

```ts
const READY_STUDIOS = new Map<LessonId, StudioDefinition>(
  [...M1_STUDIOS, ...M2_STUDIOS, ...M5_STUDIOS].map((studio) => [studio.lessonId, studio]),
);
```

- [ ] **Step 5: 9개 스튜디오 계약과 빌드를 실행한다**

Run: `npm run check:studio-expansion && npm run check:pilot && npm run lint && npm run build`

Expected: 완성 정의 9개, 새 AI 출처 prepared 6개, 종료 코드 0.

- [ ] **Step 6: M2 스튜디오를 커밋한다**

```powershell
git add scripts/check-studio-expansion-contract.mjs src/data/studios/m2.ts src/data/studios/index.ts
git commit -m "feat: add M2 experience studios"
```

---

### Task 8: M2 support bridges and portfolio

**Files:**
- Create: `src/data/supportBridges/m2.ts`
- Create: `src/data/modulePortfolios/m2.ts`
- Modify: `src/data/supportBridges/index.ts`
- Modify: `src/data/modulePortfolios/index.ts`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Produces: M2 bridge 7개, `M2_PORTFOLIO`.

- [ ] **Step 1: M2 연결 계약을 추가한다**

```js
const m2Bridges = fs.readFileSync('src/data/supportBridges/m2.ts', 'utf8');
for (const lessonId of ['m2-l2', 'm2-l3', 'm2-l4', 'm2-l5', 'm2-l7', 'm2-l8', 'm2-l9']) {
  if (!m2Bridges.includes(`lessonId: '${lessonId}'`)) throw new Error(`M2 bridge missing: ${lessonId}`);
}
const m2Portfolio = fs.readFileSync('src/data/modulePortfolios/m2.ts', 'utf8');
for (const token of ["lessonId: 'm2-l11'", "'m2-l1', 'm2-l6', 'm2-l10'", '2단원 성장 포트폴리오']) {
  if (!m2Portfolio.includes(token)) throw new Error(`M2 portfolio missing: ${token}`);
}
```

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:studio-expansion`

Expected: `M2 bridge missing` 오류.

- [ ] **Step 3: M2 지원 브리지 7개를 작성한다**

```ts
const M2_BRIDGE_TARGETS = {
  'm2-l2': ['m2-l1', 'm2-l6'],
  'm2-l3': ['m2-l1', 'm2-l6'],
  'm2-l4': ['m2-l1', 'm2-l6'],
  'm2-l5': ['m2-l1', 'm2-l6'],
  'm2-l7': ['m2-l6', 'm2-l10'],
  'm2-l8': ['m2-l6', 'm2-l10'],
  'm2-l9': ['m2-l6', 'm2-l10'],
} as const;
```

각 `practicePurpose`는 차례대로 `짧게 묻기`, `구체적으로 묻기`, `예시 넣기`, `역할 정하기`, `다시 묻기`, `답의 길이 정하기`, `이상한 답 확인하기`를 명시한다.

- [ ] **Step 4: M2 포트폴리오를 작성한다**

```ts
export const M2_PORTFOLIO: ModulePortfolioDefinition = {
  lessonId: 'm2-l11',
  moduleId: 'm2',
  crumb: '2단원 · 내 뜻을 전하고 고쳐 묻기',
  kicker: '2단원 성장 포트폴리오',
  title: 'AI와 요청을 함께 만들어요',
  description: '빠진 정보를 찾고, 요청을 조립하고, AI 답을 고쳐 물은 과정을 돌아봐요.',
  studioLessonIds: ['m2-l1', 'm2-l6', 'm2-l10'],
  nextChoices: [
    { id: 'add-information', emoji: '➕', label: '필요한 정보를 한 가지씩 더할 거예요.' },
    { id: 'show-example', emoji: '🧩', label: '원하는 답의 예시와 모양을 알려 줄 거예요.' },
    { id: 'repair-answer', emoji: '🔄', label: '답이 다르면 고쳐 묻거나 사용하지 않을 거예요.' },
  ],
};
```

- [ ] **Step 5: 브리지와 포트폴리오 레지스트리에 M2를 등록한다**

브리지 순서는 M1, M2, M5이며 포트폴리오 순서는 M1, M2, M5다. 레지스트리 생성 시 중복 lessonId가 있으면 개발 환경에서 오류를 던지도록 계약 검사에서 중복 수를 확인한다.

- [ ] **Step 6: 1·2·5단원 완결 계약과 빌드를 실행한다**

Run: `npm run check:studio-expansion && npm run check:pilot && npm run check:generalization && npm run lint && npm run build`

Expected: 22개 브리지, 3개 포트폴리오, 모든 명령 종료 코드 0.

- [ ] **Step 7: M2 연결과 마무리를 커밋한다**

```powershell
git add scripts/check-studio-expansion-contract.mjs src/data/supportBridges/m2.ts src/data/supportBridges/index.ts src/data/modulePortfolios/m2.ts src/data/modulePortfolios/index.ts
git commit -m "feat: connect M2 studios and portfolio"
```

---

### Task 9: Teacher operations copy and expansion guide

**Files:**
- Modify: `src/features/teacher/TeacherHub.tsx`
- Create: `docs/teacher-guide/m1-m2-studio-expansion.md`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Consumes: 기존 교사 기록·포트폴리오·백업 UI.
- Produces: 1·2·5단원 운영 범위와 준비형 AI 경계를 설명하는 안내.

- [ ] **Step 1: 교사 안내 계약을 작성한다**

```js
const hub = fs.readFileSync('src/features/teacher/TeacherHub.tsx', 'utf8');
const guide = fs.readFileSync('docs/teacher-guide/m1-m2-studio-expansion.md', 'utf8');
for (const text of ['1·2·5단원', '준비된 AI 예시', '카메라·마이크 권한 없이']) {
  if (!hub.includes(text) && !guide.includes(text)) throw new Error(`teacher expansion guidance missing: ${text}`);
}
for (const text of ['오늘 하루의 AI 찾기', 'AI의 눈과 귀 실험실', '요청 공동 제작소', 'AI 고쳐 묻기 실험실']) {
  if (!guide.includes(text)) throw new Error(`teacher studio guide missing: ${text}`);
}
```

- [ ] **Step 2: 문서 누락으로 검사 실패를 확인한다**

Run: `npm run check:studio-expansion`

Expected: `ENOENT` 또는 `teacher expansion guidance missing` 오류.

- [ ] **Step 3: 교사 허브 현재 범위를 갱신한다**

`5단원 파일럿` 카드를 `현재 운영 중인 핵심 경험`으로 바꾸고 다음 문장을 넣는다.

```text
1·2·5단원의 아홉 핵심 경험이 완성되어 있습니다. 이미지·소리·AI 응답은 준비된 예시이며 카메라·마이크 권한 없이 모든 활동을 진행할 수 있습니다.
```

기록 원리, 기본 꺼짐, 저장하지 않는 원본, 백업 안내는 변경하지 않는다.

- [ ] **Step 4: 확장 교사 안내 문서를 작성한다**

문서는 다음 제목을 모두 포함한다.

```markdown
## 1. 현재 완성된 1·2·5단원 핵심 경험
## 2. 1단원 경험·지원·포트폴리오 흐름
## 3. 2단원 경험·지원·포트폴리오 흐름
## 4. 준비된 이미지·소리·AI 응답 운영법
## 5. 과정중심평가 네 기준
## 6. 과정기록과 백업
## 7. TTS 직접 조작 원칙
## 8. 수업 전 점검
```

준비형 AI는 실제 AI처럼 표현하지 않으며, 소리 버튼은 학생 직접 조작이고 듣지 않아도 같은 문장을 읽을 수 있다는 점을 명시한다.

- [ ] **Step 5: 교사 계약과 타입을 확인한다**

Run: `npm run check:studio-expansion && npm run check:teacher-recording && npm run lint`

Expected: 모든 명령 종료 코드 0.

- [ ] **Step 6: 교사 안내를 커밋한다**

```powershell
git add scripts/check-studio-expansion-contract.mjs src/features/teacher/TeacherHub.tsx docs/teacher-guide/m1-m2-studio-expansion.md
git commit -m "docs: guide M1 and M2 studio operation"
```

---

### Task 10: Aggregate QA, browser flows, and release gate

**Files:**
- Create: `scripts/check-studio-expansion.mjs`
- Modify: `package.json`
- Modify: `scripts/check-studio-expansion-contract.mjs`

**Interfaces:**
- Produces: `npm run check:studio-expansion-all`.

- [ ] **Step 1: 확장 집계 검사기를 작성한다**

```js
import { spawnSync } from 'node:child_process';

const checks = [
  'scripts/check-lesson-role-contract.mjs',
  'scripts/check-studio-pilot-contract.mjs',
  'scripts/check-studio-expansion-contract.mjs',
  'scripts/check-teacher-recording-contract.mjs',
  'scripts/check-editorial-theme-contract.mjs',
  'scripts/check-generalization-contract.mjs',
];

for (const check of checks) {
  const result = spawnSync(process.execPath, [check], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('M1/M2 studio expansion: all contracts passed');
```

`package.json`에 다음 명령을 추가한다.

```json
"check:studio-expansion-all": "node scripts/check-studio-expansion.mjs"
```

- [ ] **Step 2: 최종 계약에 정확한 완성 수를 고정한다**

검사는 다음을 확인한다.

```js
const studioIndex = fs.readFileSync('src/data/studios/index.ts', 'utf8');
for (const spread of ['...M1_STUDIOS', '...M2_STUDIOS', '...M5_STUDIOS']) {
  if (!studioIndex.includes(spread)) throw new Error(`ready studio group missing: ${spread}`);
}

const bridgeIndex = fs.readFileSync('src/data/supportBridges/index.ts', 'utf8');
for (const spread of ['...M1_SUPPORT_BRIDGES', '...M2_SUPPORT_BRIDGES', '...M5_SUPPORT_BRIDGES']) {
  if (!bridgeIndex.includes(spread)) throw new Error(`ready bridge group missing: ${spread}`);
}

const portfolioIndex = fs.readFileSync('src/data/modulePortfolios/index.ts', 'utf8');
for (const item of ['M1_PORTFOLIO', 'M2_PORTFOLIO', 'M5_PORTFOLIO']) {
  if (!portfolioIndex.includes(item)) throw new Error(`ready portfolio missing: ${item}`);
}
```

- [ ] **Step 3: 기록 끔 브라우저 시나리오를 실행한다**

개발 서버에서 다음을 확인한다.

1. 과정기록을 끈 상태로 `m1-l1`을 완주한다.
2. 첫 생각 뒤 즉각 정답·오답 해설이 없는지 확인한다.
3. 진도는 남고 새 증거는 생기지 않는지 교사 기록에서 확인한다.
4. 마지막 단계 진입 전후 `speechSynthesis.speaking === false`인지 확인한다.

- [ ] **Step 4: M1 기록 켬 브라우저 시나리오를 실행한다**

1. 별칭 `학생 1`로 과정기록을 켠다.
2. `m1-l4`에서 이미지가 보이고 대체 텍스트가 있으며 `소리 듣기`가 직접 조작인지 확인한다.
3. AI 의견을 거절하고 전이를 완료한다.
4. `m1-l10`을 다른 지원 수준으로 완료한다.
5. `m1-l11`과 교사 기록에서 세 증거의 첫 생각·AI 판단·최종 판단·전이를 확인한다.

- [ ] **Step 5: M2 기록 켬 브라우저 시나리오를 실행한다**

1. `m2-l1`에서 첫 요청 실패와 조건 추가를 확인한다.
2. `m2-l6`에서 선택과 글 표현 통로를 바꾸어 요청을 만든다.
3. `m2-l10`에서 첫 연습 응답과 수정된 두 번째 응답을 비교하고 최종 판단한다.
4. `m2-l11`과 교사 기록에서 세 증거를 확인한다.
5. `m3-l1`, `m6-l1`이 기존 화면으로 폴백하는지 확인한다.
6. 브라우저 오류·경고 로그가 비어 있는지 확인한다.

- [ ] **Step 6: 전체 자동 검사를 새로 실행한다**

Run:

```powershell
npm run check:studio-expansion-all
npm run check:ui-polish
npm run check:activity-icons
npm run check:encoding
npm run lint
npm run build
```

Expected: 모든 명령 종료 코드 0. Vite의 기존 500 kB 초과 번들 경고는 오류로 세지 않는다.

- [ ] **Step 7: 변경 범위와 작업 상태를 확인한다**

Run: `git diff --check && git status --short`

Expected: 공백 오류가 없고 이 계획의 마지막 검사기 파일만 미커밋 상태다.

- [ ] **Step 8: 확장 집계 검사를 커밋한다**

```powershell
git add package.json scripts/check-studio-expansion.mjs scripts/check-studio-expansion-contract.mjs
git commit -m "test: add M1 and M2 expansion release gate"
```

- [ ] **Step 9: 최종 상태를 확인한다**

Run: `git status --short && git log --oneline -12`

Expected: 작업 폴더가 깨끗하고 Task 1~10 커밋이 현재 브랜치에 순서대로 존재한다.
