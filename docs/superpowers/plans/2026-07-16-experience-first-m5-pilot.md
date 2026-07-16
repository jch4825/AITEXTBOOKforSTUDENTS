# Experience-First M5 Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 68차시와 진도 데이터를 보존하면서 5단원 1·6·11차시를 경험 우선 스튜디오로 전환하고, 지원 차시의 연결 문장, 선택형 로컬 과정기록, 교사 운영 안내, 암호화 백업까지 하나의 배포 가능한 파일럿으로 완성한다.

**Architecture:** 68차시의 행정 구조와 기존 `LessonView`는 유지하되, 차시 역할 레지스트리와 `src/features/studio/` 기능 경계를 새로 둔다. `LessonView`는 완성된 스튜디오 정의가 있는 5단원 3개 차시만 `StudioLessonView`로 보내고 나머지는 기존 렌더러로 폴백한다. 학생의 현재 세션 상태와 저장 가능한 과정증거를 분리하며, 교사가 명시적으로 기록을 켠 경우에만 정제된 구조화 데이터가 브라우저에 저장된다.

**Tech Stack:** React 19, TypeScript 5.8 strict mode, Vite 6, Tailwind CSS 4, Web Storage API, Web Crypto API(AES-GCM/PBKDF2), IndexedDB 제외, 기존 Node 정적 계약 검사, Playwright 기반 브라우저 점검.

## Global Constraints

- 기준 설계 문서는 `docs/superpowers/specs/2026-07-16-experience-first-multimodal-textbook-redesign-design.md`이다. 충돌 시 이 구현 계획보다 기준 설계를 우선한다.
- 이번 구현 범위는 **기반 + 5단원 파일럿**이다. 새 스튜디오는 `m5-l1`, `m5-l6`, `m5-l11` 세 개만 학생에게 노출한다.
- 68차시 역할표는 지금 모두 등록한다: 스튜디오 18개, 지원 차시 44개, 단원 마무리 6개. 단, M5 외 스튜디오는 이후 정의가 생길 때까지 기존 차시 화면으로 렌더링한다.
- 기존 차시 데이터, 기존 일반화 기록 `ai-students-generalization-v1`, 기존 진도와 설정을 삭제하거나 자동 변환하지 않는다.
- 지원 수준의 학생용 표기는 오직 `충분한 지원`, `약한 지원`, `도전적`을 사용한다. 내부 저장값 `easy | normal | hard`는 하위 호환을 위해 유지한다.
- 스튜디오 공통 단계는 `encounter → first-attempt → condition-change → ai-compare → decision → artifact → transfer → complete` 순서를 벗어나지 않는다.
- AI 의견 판단값은 `accept | modify | reject`, AI 출처는 `prepared | live`로 고정한다. 파일럿에서는 `prepared`만 사용한다.
- 학생 표현 통로는 `choice | aac | text | speech | draw`를 지원하되 모든 차시에서 모든 통로를 강제하지 않는다.
- 과정기록은 기본값이 꺼짐이다. 꺼진 상태에서도 스튜디오 수행과 진도 완료는 정상 작동해야 한다.
- 음성 원본, 사진 원본, 캔버스 이미지, 전체 AI 대화 로그, API 키는 과정증거와 백업 파일에 저장하지 않는다.
- 학생이 AI 의견을 거절하거나 첫 선택을 유지해도 이유가 타당하면 성공으로 표현한다. 정답·오답 점수 UI를 만들지 않는다.
- TTS는 학생이 직접 누른 읽기 버튼 외에 자동 시작하지 않는다. 단계 진입, 마지막 활동 진입, 복원 직후에 `speak()`를 호출하지 않는다.
- 실제 불·칼·뜨거운 물을 사용하는 수행은 만들지 않는다. `m5-l11`은 교사 감독 아래 시각적 계획 활동으로만 구성한다.
- 교사 비밀번호 게이트는 화면 분리 기능이지 보안 경계라고 설명하지 않는다.
- 새 테스트 프레임워크는 도입하지 않는다. 기존 방식과 같은 Node 계약 검사, `tsc --noEmit`, 브라우저 흐름 검증을 사용한다.
- 모든 파일은 UTF-8로 저장하고 `npm run check:encoding`을 통과시킨다.
- 사용자 소유 미추적 파일과 `output/`은 손대지 않는다. 각 커밋은 해당 작업의 명시된 경로만 스테이징한다.

## Definition of Done

- `m5-l1`, `m5-l6`, `m5-l11`이 같은 8단계 학습 문법으로 작동하고 각기 다른 생활 맥락·산출물·전이 장면을 제공한다.
- `m5-l2~l5`, `m5-l7~l10`에 이전 핵심 경험 회상과 다음 핵심 경험 예고가 보이며 기존 본문과 활동은 유지된다.
- `m5-l12`에서 세 스튜디오의 정제된 증거와 학생의 자기평가를 함께 볼 수 있다.
- 기록을 켜지 않은 브라우저에는 스튜디오 증거가 남지 않고, 기록을 켠 브라우저에는 첫 선택·조건 변경·AI 비교·최종 판단·전이·도움 수준이 남는다.
- 교사 화면에서 기록 원리, 저장 위치, 저장하지 않는 정보, 삭제·암호화 백업·복원을 안내하고 실제 조작할 수 있다.
- 기존 65개 차시, 기존 일반화 기록 패널, API 키 패널, 학습목표 패널, 진도 표시가 회귀 없이 작동한다.
- `npm run check:pilot`, `npm run check:generalization`, `npm run check:ui-polish`, `npm run check:encoding`, `npm run lint`, `npm run build`가 모두 성공한다.

---

## File Structure Map

### 새로 만들 파일

- `src/features/studio/types.ts` — 스튜디오 단계·지원 수준·표현·콘텐츠·세션·증거 타입의 단일 진실 원천.
- `src/features/studio/supportLevel.ts` — 기존 난이도 저장값과 새 지원 수준/표시어 간의 호환 매핑.
- `src/features/studio/studioReducer.ts` — 순수 상태 전이와 단계별 진행 가능 조건.
- `src/features/studio/evidenceStorage.ts` — v2 과정증거 정제·저장·조회·삭제.
- `src/features/studio/useStudioSession.ts` — 리듀서, 현재 세션, 선택적 저장, 차시 완료를 연결.
- `src/features/studio/components/EditorialStudioFrame.tsx` — 교과서형 2면 레이아웃과 단계 헤더.
- `src/features/studio/components/StudioExplanationPanel.tsx` — 기존 3수준 설명을 첫 시도 뒤에 재배치하는 생각 도구.
- `src/features/studio/components/StudioExpressionInput.tsx` — 선택·AAC·글·말·그림 표현 통로.
- `src/features/studio/components/SupportSelector.tsx` — 세 지원 수준의 명시적 선택 UI.
- `src/features/studio/components/AiDecisionPanel.tsx` — AI 의견 수용·수정·거절 UI.
- `src/features/studio/components/StudioExperience.tsx` — 8단계 화면 조합과 단계별 검증.
- `src/features/studio/StudioLessonView.tsx` — 기존 프레임·진도·스튜디오 세션의 어댑터.
- `src/features/studio/SupportLessonBridge.tsx` — 지원 차시의 회상/다음 경험 연결 카드.
- `src/features/studio/ModuleCloseLessonView.tsx` — 5단원 포트폴리오형 마무리.
- `src/data/lessonRoles.ts` — 68차시 역할 레지스트리.
- `src/data/studios/m5.ts` — 5단원 핵심 경험 3개의 완전한 콘텐츠 정의.
- `src/data/studios/index.ts` — 정의가 완성된 스튜디오만 조회하는 안전한 레지스트리.
- `src/data/supportBridges/m5.ts` — 5단원 지원 차시의 회상·예고 문장.
- `src/features/teacher/recordingSettings.ts` — 교사 기록 동의와 학생 별칭 설정 저장.
- `src/features/teacher/backup.ts` — 암호화 백업 생성·검증·복원.
- `src/features/teacher/TeacherHub.tsx` — 교사 허브 탭 셸.
- `src/features/teacher/TeacherOnboarding.tsx` — 첫 기록 활성화 안내와 확인.
- `src/features/teacher/StudioEvidencePanel.tsx` — v2 과정증거 열람과 관찰기록 보완.
- `src/features/teacher/TeacherDataManagement.tsx` — 삭제·백업·복원.
- `src/features/teacher/LegacyTeacherPanels.tsx` — 기존 API·진도·학습목표 패널을 보존해 이동.
- `scripts/check-lesson-role-contract.mjs` — 18/44/6 역할 수와 앵커 검증.
- `scripts/check-studio-pilot-contract.mjs` — 스튜디오 정의·단계·표현·안전선 검증.
- `scripts/check-teacher-recording-contract.mjs` — 옵트인·저장 금지·백업 제외 규칙 검증.
- `scripts/check-editorial-theme-contract.mjs` — 승인 색상과 지원 수준 문구 검증.
- `scripts/check-m5-pilot.mjs` — 파일럿 계약 검사 집계 실행기.
- `docs/teacher-guide/m5-studio-pilot.md` — 교사 대상 운영·평가·저장 로직 안내.

### 수정할 파일

- `package.json` — `check:pilot`과 세부 계약 검사 명령 추가.
- `src/utils/moduleThemes.ts` — 승인된 단원 주·보조·연한 색상 토큰 반영.
- `src/index.css` — 종이·잉크·선 토큰과 스튜디오 전용 에디토리얼 클래스 추가.
- `src/components/controls/DifficultyToggle.tsx` — 학생용 명칭을 세 지원 수준으로 교체.
- `src/components/MicroLessonFrame.tsx` — 단계 요건 미충족 시 다음 버튼을 비활성화할 수 있도록 확장.
- `src/views/LessonView.tsx` — 완성된 스튜디오, 5단원 마무리, 지원 브리지의 호환 라우팅.
- `src/views/TeacherView.tsx` — 기존 비밀번호 게이트 뒤에 `TeacherHub` 연결.

---

## Task 1: 68차시 역할 레지스트리와 계약 검사

**Files:**
- Create: `scripts/check-lesson-role-contract.mjs`
- Create: `src/features/studio/types.ts`
- Create: `src/data/lessonRoles.ts`
- Modify: `package.json`

- [ ] **Step 1: 실패하는 역할 계약 검사를 먼저 작성한다**

`scripts/check-lesson-role-contract.mjs`는 `src/data/lessonRoles.ts`를 읽고 다음을 검증한다.

```js
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rolePath = path.join(root, 'src/data/lessonRoles.ts');
if (!fs.existsSync(rolePath)) {
  throw new Error('lesson role registry is missing');
}
const source = fs.readFileSync(rolePath, 'utf8');
const studioIds = [...source.matchAll(/'m[1-6]-l\d+'/g)].map((match) => match[0].slice(1, -1));
const studioBlock = source.match(/STUDIO_LESSON_IDS[\s\S]*?as const;/)?.[0] ?? '';
const closeBlock = source.match(/MODULE_CLOSE_LESSON_IDS[\s\S]*?as const;/)?.[0] ?? '';
const countIds = (block) => [...block.matchAll(/'m[1-6]-l\d+'/g)].length;
const requiredStudios = ['m1-l1','m1-l4','m1-l10','m2-l1','m2-l6','m2-l10','m3-l1','m3-l5','m3-l9','m4-l1','m4-l5','m4-l10','m5-l1','m5-l6','m5-l11','m6-l1','m6-l4','m6-l11'];
const requiredCloses = ['m1-l11','m2-l11','m3-l11','m4-l11','m5-l12','m6-l12'];

if (countIds(studioBlock) !== 18) throw new Error('studio lesson count must be 18');
if (countIds(closeBlock) !== 6) throw new Error('module close lesson count must be 6');
for (const id of [...requiredStudios, ...requiredCloses]) {
  if (!source.includes(`'${id}'`)) throw new Error(`missing lesson role anchor: ${id}`);
}
if (!source.includes("return 'support'")) throw new Error('support fallback is missing');
if (!source.includes('68 - STUDIO_LESSON_IDS.length - MODULE_CLOSE_LESSON_IDS.length')) {
  throw new Error('derived support count is missing');
}
if (new Set(studioIds).size < 24) throw new Error('role registry contains duplicate anchors');
console.log('lesson role contract: 18 studio, 44 support, 6 module-close');
```

`package.json`에 다음 명령을 추가한다.

```json
"check:lesson-roles": "node scripts/check-lesson-role-contract.mjs"
```

- [ ] **Step 2: 검사가 의도대로 실패하는지 확인한다**

Run: `npm run check:lesson-roles`

Expected: `Error: lesson role registry is missing`

- [ ] **Step 3: 역할과 스튜디오 공통 타입의 최소 골격을 만든다**

`src/features/studio/types.ts`의 첫 구현은 이후 작업이 확장할 다음 타입을 포함한다.

```ts
import type { LessonId, ModuleId } from '../../types';

export type LessonRole = 'studio' | 'support' | 'module-close';
export type StudioStage = 'encounter' | 'first-attempt' | 'condition-change' | 'ai-compare' | 'decision' | 'artifact' | 'transfer' | 'complete';
export type SupportLevel = 'full' | 'light' | 'challenge';
export type ExpressionMode = 'choice' | 'aac' | 'text' | 'speech' | 'draw';
export type AiDecision = 'accept' | 'modify' | 'reject';
export type AiSource = 'prepared' | 'live';

export interface LessonRoleRecord {
  lessonId: LessonId;
  moduleId: ModuleId;
  role: LessonRole;
}
```

`src/data/lessonRoles.ts`는 계산형 폴백으로 44개 지원 차시를 만든다.

```ts
import type { LessonId, ModuleId } from '../types';
import type { LessonRole, LessonRoleRecord } from '../features/studio/types';
import { MODULES, lessonIdsForModule, moduleIdFromLessonId } from './modules';

export const STUDIO_LESSON_IDS = [
  'm1-l1', 'm1-l4', 'm1-l10',
  'm2-l1', 'm2-l6', 'm2-l10',
  'm3-l1', 'm3-l5', 'm3-l9',
  'm4-l1', 'm4-l5', 'm4-l10',
  'm5-l1', 'm5-l6', 'm5-l11',
  'm6-l1', 'm6-l4', 'm6-l11',
] as const;

export const MODULE_CLOSE_LESSON_IDS = [
  'm1-l11', 'm2-l11', 'm3-l11', 'm4-l11', 'm5-l12', 'm6-l12',
] as const;

const studioSet = new Set<string>(STUDIO_LESSON_IDS);
const closeSet = new Set<string>(MODULE_CLOSE_LESSON_IDS);

export const SUPPORT_LESSON_COUNT = 68 - STUDIO_LESSON_IDS.length - MODULE_CLOSE_LESSON_IDS.length;

export function getLessonRole(lessonId: LessonId): LessonRole {
  if (studioSet.has(lessonId)) return 'studio';
  if (closeSet.has(lessonId)) return 'module-close';
  return 'support';
}

export const LESSON_ROLE_RECORDS: LessonRoleRecord[] = MODULES.flatMap((module) =>
  lessonIdsForModule(module.id).map((lessonId) => ({
    lessonId,
    moduleId: moduleIdFromLessonId(lessonId) as ModuleId,
    role: getLessonRole(lessonId),
  })),
);
```

- [ ] **Step 4: 역할 수와 타입을 검증한다**

Run: `npm run check:lesson-roles && npm run lint`

Expected: `lesson role contract: 18 studio, 44 support, 6 module-close`, TypeScript 오류 없음.

- [ ] **Step 5: 역할 레지스트리만 커밋한다**

```powershell
git add package.json scripts/check-lesson-role-contract.mjs src/features/studio/types.ts src/data/lessonRoles.ts
git commit -m "feat: add 68-lesson experience role registry"
```

---

## Task 2: 스튜디오 스키마와 5단원 핵심 경험 3개 정의

**Files:**
- Modify: `src/features/studio/types.ts`
- Create: `src/data/studios/m5.ts`
- Create: `src/data/studios/index.ts`
- Create: `scripts/check-studio-pilot-contract.mjs`
- Modify: `package.json`

- [ ] **Step 1: 세 스튜디오의 내용·안전 계약 검사를 작성한다**

검사는 세 ID, `prepared` 출처, 다섯 표현 통로, 세 산출물 종류, 조리 안전 문구, 금지된 자동 정답 문구를 확인한다.

```js
import fs from 'node:fs';

const file = 'src/data/studios/m5.ts';
if (!fs.existsSync(file)) throw new Error('M5 studio definitions are missing');
const source = fs.readFileSync(file, 'utf8');
for (const id of ['m5-ambiguous-problem', 'm5-clarify-request', 'm5-changing-cooking-plan']) {
  if (!source.includes(`id: '${id}'`)) throw new Error(`missing studio: ${id}`);
}
for (const lessonId of ['m5-l1', 'm5-l6', 'm5-l11']) {
  if (!source.includes(`lessonId: '${lessonId}'`)) throw new Error(`missing lesson mapping: ${lessonId}`);
}
for (const mode of ['choice', 'aac', 'text', 'speech', 'draw']) {
  if (!source.includes(`'${mode}'`)) throw new Error(`missing expression mode: ${mode}`);
}
for (const artifact of ['action-card', 'repair-card', 'visual-plan']) {
  if (!source.includes(`kind: '${artifact}'`)) throw new Error(`missing artifact kind: ${artifact}`);
}
if ((source.match(/source: 'prepared'/g) ?? []).length !== 3) throw new Error('pilot AI must be prepared in all studios');
if (!source.includes('실제 불이나 뜨거운 물을 사용하지 않아요')) throw new Error('cooking safety copy is missing');
if (source.includes('정답입니다') || source.includes('틀렸습니다')) throw new Error('studio must not grade a single correct answer');
console.log('M5 studio content contract: 3 definitions ready');
```

`package.json`에 다음 명령을 추가한다.

```json
"check:studio-pilot": "node scripts/check-studio-pilot-contract.mjs"
```

- [ ] **Step 2: 실패 상태를 확인한다**

Run: `npm run check:studio-pilot`

Expected: `Error: M5 studio definitions are missing`

- [ ] **Step 3: 완전한 콘텐츠 스키마를 추가한다**

`src/features/studio/types.ts`에 다음 인터페이스를 추가한다.

```ts
export interface StudioChoice {
  id: string;
  emoji: string;
  label: string;
}

export interface StudioExpression {
  mode: ExpressionMode;
  choiceIds?: string[];
  text?: string;
  drawing?: string;
}

export interface SupportProfile {
  visibleFactCount: number;
  choiceLimit?: number;
  hint: string;
  aiRoleDepth: 'direct' | 'prompting' | 'counterpoint';
}

export interface StudioDefinition {
  id: string;
  lessonId: LessonId;
  moduleId: ModuleId;
  title: string;
  subtitle: string;
  encounter: { title: string; description: string; facts: string[] };
  firstAttempt: { prompt: string; choices: StudioChoice[]; modes: ExpressionMode[]; reasonPrompt: string };
  supportProfiles: Record<SupportLevel, SupportProfile>;
  conditionChange: { description: string; facts: string[] };
  aiContribution: { source: AiSource; role: string; text: string; question?: string };
  artifact: { kind: 'action-card' | 'repair-card' | 'visual-plan'; title: string; prompt: string };
  transfer: { title: string; description: string; choices: StudioChoice[] };
  safetyNote?: string;
}
```

- [ ] **Step 4: 5단원 세 정의를 작성한다**

`src/data/studios/m5.ts`의 콘텐츠는 아래 표를 그대로 데이터화한다. 각 선택지는 고유 ID·이모지·짧은 문장을 가지며, 첫 시도에는 이유가 필수가 아니다.

| lesson | 상황 | 바뀌는 조건 | 준비된 AI 기여 | 산출물 | 전이 |
|---|---|---|---|---|---|
| `m5-l1` | 약속이 있는데 버스가 늦음 | 배터리 8%, 남은 시간 20분, 연락할 사람 존재 | “누구에게 상황을 알려야 할까?” 확인 질문 | `action-card` 나의 행동 카드 | 지하철 운행 중단 |
| `m5-l6` | AI가 장소 요청을 다르게 이해함 | 정확한 장소명 모름, 개인정보는 말하지 않음 | 더 분명한 단서 한 가지를 묻기 | `repair-card` 다시 말하기 카드 | 가게에서 원하는 물건 설명 |
| `m5-l11` | 라면 계획 중 재료·도구가 없음 | 시간·재료·도구·안전 조건 변경 | 다른 계획과 확인할 조건 제시 | `visual-plan` 시각적 조리 계획 | 다른 간단한 음식 계획 |

공통 지원 프로필은 다음 값으로 시작한다.

```ts
const SUPPORT_PROFILES = {
  full: { visibleFactCount: 2, choiceLimit: 2, hint: '중요한 정보 두 가지부터 함께 찾아봐요.', aiRoleDepth: 'direct' },
  light: { visibleFactCount: 3, choiceLimit: 3, hint: '달라진 조건을 보고 내 방법을 다시 살펴봐요.', aiRoleDepth: 'prompting' },
  challenge: { visibleFactCount: 4, hint: 'AI 의견의 장점과 한계를 비교해 내 판단을 설명해 봐요.', aiRoleDepth: 'counterpoint' },
} satisfies StudioDefinition['supportProfiles'];
```

`m5-l11`에는 다음 문장을 정확히 넣는다.

```ts
safetyNote: '이 활동에서는 실제 불이나 뜨거운 물을 사용하지 않아요. 그림과 카드로 계획하고, 실제 조리는 반드시 교사와 함께해요.',
```

세 정의의 실제 내용은 다음과 같이 고정한다.

**`m5-l1`**

- 현재 사실: `친구와 만나기로 했어요`, `타려던 버스가 늦게 와요`.
- 첫 선택: `그냥 계속 기다려요`, `친구에게 늦는다고 알려요`, `다른 길을 찾아봐요`.
- 조건 변화: `휴대전화 배터리가 8%예요`, `약속까지 20분 남았어요`, `연락할 친구가 있어요`.
- 준비된 AI 의견: “다른 길을 찾기 전에 친구에게 늦는다고 알리고, 배터리를 아끼면서 정류장 안내를 확인하는 방법도 있어요.”
- AI 확인 질문: “지금 가장 먼저 상황을 알려야 할 사람은 누구인가요?”
- 전이: 지하철 운행이 멈췄고 중요한 일정이 있는 장면.

**`m5-l6`**

- 현재 사실: `AI에게 가는 길을 물었어요`, `AI가 다른 장소를 알려줬어요`.
- 첫 선택: `같은 말을 그대로 반복해요`, `알고 있는 단서를 더 말해요`, `AI 답을 그대로 따라가요`.
- 조건 변화: `정확한 장소 이름은 몰라요`, `주변 건물은 알아요`, `집 주소나 전화번호는 말하지 않아요`.
- 준비된 AI 의견: “개인정보 대신 주변에 보이는 건물이나 표지판을 한 가지 더 말해 주세요.”
- AI 확인 질문: “목적지 근처에서 볼 수 있는 건물이나 표지판이 있나요?”
- 전이: 가게에서 이름을 모르는 물건의 쓰임과 모양을 설명하는 장면.

**`m5-l11`**

- 현재 사실: `라면을 끓이려는 계획이 있어요`, `필요한 재료와 도구를 확인해야 해요`.
- 첫 선택: `있는 것부터 바로 시작해요`, `재료와 도구를 먼저 확인해요`, `교사에게 함께 계획해 달라고 해요`.
- 조건 변화: `계란이 없어요`, `냄비를 바로 쓸 수 없어요`, `시간이 10분뿐이에요`, `실제 조리는 교사와 함께해야 해요`.
- 준비된 AI 의견: “지금은 실제로 끓이지 말고, 가능한 재료와 안전한 순서를 카드로 먼저 정리해 보는 방법이 있어요.”
- AI 확인 질문: “바뀐 조건 때문에 빼거나 바꿔야 할 단계는 무엇인가요?”
- 전이: 다른 간단한 음식을 만들기 전에 재료·도구·시간·안전을 확인하는 장면.

- [ ] **Step 5: 완성된 정의만 반환하는 조회 함수를 만든다**

`src/data/studios/index.ts`:

```ts
import type { LessonId } from '../../types';
import type { StudioDefinition } from '../../features/studio/types';
import { M5_STUDIOS } from './m5';

const READY_STUDIOS = new Map<LessonId, StudioDefinition>(
  M5_STUDIOS.map((studio) => [studio.lessonId, studio]),
);

export function getStudioDefinition(lessonId: LessonId): StudioDefinition | undefined {
  return READY_STUDIOS.get(lessonId);
}
```

- [ ] **Step 6: 콘텐츠 계약과 빌드를 확인한다**

Run: `npm run check:studio-pilot && npm run lint`

Expected: `M5 studio content contract: 3 definitions ready`, TypeScript 오류 없음.

- [ ] **Step 7: 스키마와 콘텐츠를 커밋한다**

```powershell
git add package.json scripts/check-studio-pilot-contract.mjs src/features/studio/types.ts src/data/studios/m5.ts src/data/studios/index.ts
git commit -m "feat: define three M5 experience studios"
```

---

## Task 3: 지원 수준 호환 계층과 단원별 에디토리얼 토큰

**Files:**
- Create: `src/features/studio/supportLevel.ts`
- Modify: `src/components/controls/DifficultyToggle.tsx`
- Modify: `src/utils/moduleThemes.ts`
- Modify: `src/index.css`
- Create: `scripts/check-editorial-theme-contract.mjs`
- Modify: `package.json`

- [ ] **Step 1: 승인 문구와 색상에 대한 실패 검사를 작성한다**

검사는 학생 화면 소스에 이전 후보 문구가 없고 다음 값이 모두 존재하는지 확인한다.

```js
import fs from 'node:fs';

const toggle = fs.readFileSync('src/components/controls/DifficultyToggle.tsx', 'utf8');
const support = fs.readFileSync('src/features/studio/supportLevel.ts', 'utf8');
const themes = fs.readFileSync('src/utils/moduleThemes.ts', 'utf8');
const css = fs.readFileSync('src/index.css', 'utf8');
for (const label of ['충분한 지원', '약한 지원', '도전적']) {
  if (!toggle.includes(label) && !support.includes(label)) throw new Error(`missing support label: ${label}`);
}
for (const oldLabel of ['도움 충분히', '기본 도움', '도전하기']) {
  if (toggle.includes(oldLabel) || support.includes(oldLabel)) throw new Error(`old support label remains: ${oldLabel}`);
}
for (const color of ['#5D4C8A','#A44943','#416AA8','#93601E','#2F7773','#76516F','#E07A65','#526FA7','#D6A347','#46586C','#E58A6B','#6C9986']) {
  if (!themes.includes(color)) throw new Error(`missing approved module color: ${color}`);
}
for (const token of ['--editorial-paper: #FFFDF9', '--editorial-ink: #302C36', '--editorial-line: #DEDBE3', '--editorial-quiet: #F6F4F1']) {
  if (!css.includes(token)) throw new Error(`missing editorial token: ${token}`);
}
console.log('editorial theme contract: support labels and six module palettes ready');
```

`package.json`에 다음 명령을 추가한다.

```json
"check:editorial-theme": "node scripts/check-editorial-theme-contract.mjs"
```

- [ ] **Step 2: 검사 실패를 확인한다**

Run: `npm run check:editorial-theme`

Expected: 새 파일 또는 새 토큰 누락 오류.

- [ ] **Step 3: 기존 난이도 저장값을 새 지원 수준으로 매핑한다**

`src/features/studio/supportLevel.ts`:

```ts
import type { Difficulty } from '../../types';
import type { SupportLevel } from './types';

export const SUPPORT_LABELS: Record<SupportLevel, string> = {
  full: '충분한 지원',
  light: '약한 지원',
  challenge: '도전적',
};

export const DIFFICULTY_TO_SUPPORT: Record<Difficulty, SupportLevel> = {
  easy: 'full',
  normal: 'light',
  hard: 'challenge',
};

export const SUPPORT_TO_DIFFICULTY: Record<SupportLevel, Difficulty> = {
  full: 'easy',
  light: 'normal',
  challenge: 'hard',
};
```

`DifficultyToggle.tsx`는 저장값과 순환 순서를 유지하되 `LABEL`과 접근성 문구를 바꾼다.

```ts
const LABEL: Record<Difficulty, string> = {
  easy: '충분한 지원',
  normal: '약한 지원',
  hard: '도전적',
};
```

버튼 `title`은 `지원 수준 바꾸기`, `aria-label`은 `지원 수준 바꾸기 (지금: ${LABEL[difficulty]})`로 변경한다.

- [ ] **Step 4: 단원 주·보조·연한 색상 카드 값을 반영한다**

`ModuleTheme`에 `secondary`를 추가하고 다음 표를 정확히 사용한다. 기존 소비자를 위해 `accent`, `accentText`, `accentSoft`, `emoji` 이름은 유지한다.

| 단원 | accent | secondary | accentSoft |
|---|---|---|---|
| m1 | `#5D4C8A` | `#E07A65` | `#EEEAF6` |
| m2 | `#A44943` | `#526FA7` | `#F8E8E5` |
| m3 | `#416AA8` | `#D6A347` | `#E8EEF7` |
| m4 | `#93601E` | `#46586C` | `#F5EAD9` |
| m5 | `#2F7773` | `#E58A6B` | `#E3F0EE` |
| m6 | `#76516F` | `#6C9986` | `#EFE7ED` |

보조색은 장식·배지·도형에만 쓰고 작은 본문 글자색으로 사용하지 않는다.

- [ ] **Step 5: 전역을 뒤집지 않는 스튜디오 전용 토큰을 추가한다**

`src/index.css`의 루트 토큰 영역에 다음을 추가한다.

```css
--editorial-paper: #FFFDF9;
--editorial-ink: #302C36;
--editorial-line: #DEDBE3;
--editorial-quiet: #F6F4F1;
```

스튜디오에만 적용할 `.studio-editorial`, `.studio-kicker`, `.studio-fact-card`, `.studio-margin-note`, `.studio-artifact-sheet` 클래스를 추가한다. 둥근 모서리는 8~18px, 그림자는 1단계만 사용하고, 캐릭터 말풍선·과도한 그라디언트·통통 튀는 애니메이션을 넣지 않는다.

- [ ] **Step 6: 계약·타입·기존 UI 검사를 실행한다**

Run: `npm run check:editorial-theme && npm run check:ui-polish && npm run lint`

Expected: 모든 검사 성공.

- [ ] **Step 7: 용어와 테마를 커밋한다**

```powershell
git add package.json scripts/check-editorial-theme-contract.mjs src/features/studio/supportLevel.ts src/components/controls/DifficultyToggle.tsx src/utils/moduleThemes.ts src/index.css
git commit -m "feat: add editorial palettes and support labels"
```

---

## Task 4: 선택형 교사 설정과 v2 과정증거 저장소

**Files:**
- Modify: `src/features/studio/types.ts`
- Create: `src/features/teacher/recordingSettings.ts`
- Create: `src/features/studio/evidenceStorage.ts`
- Create: `scripts/check-teacher-recording-contract.mjs`
- Modify: `package.json`

- [ ] **Step 1: 옵트인·저장 금지 계약 검사를 작성한다**

검사는 `processRecording: false`, 키 이름, 정제 함수, 원본 미저장 문구, API 키 제외를 확인한다.

```js
import fs from 'node:fs';

const settings = fs.readFileSync('src/features/teacher/recordingSettings.ts', 'utf8');
const evidence = fs.readFileSync('src/features/studio/evidenceStorage.ts', 'utf8');
if (!settings.includes("processRecording: false")) throw new Error('process recording must default to false');
if (!settings.includes("learnerAlias: '학생 1'")) throw new Error('safe learner alias default is missing');
if (!evidence.includes("ai-students-studio-evidence-v2")) throw new Error('v2 evidence key is missing');
if (!evidence.includes('sanitizeExpressionForEvidence')) throw new Error('expression sanitizer is missing');
if (!evidence.includes("drawing: undefined")) throw new Error('raw drawing must be removed');
if (!evidence.includes('processRecording')) throw new Error('opt-in gate is missing');
console.log('teacher recording contract: opt-in and sanitized evidence ready');
```

`package.json`에 다음 명령을 추가한다.

```json
"check:teacher-recording": "node scripts/check-teacher-recording-contract.mjs"
```

- [ ] **Step 2: 실패 상태를 확인한다**

Run: `npm run check:teacher-recording`

Expected: 설정 파일 누락 오류.

- [ ] **Step 3: 설정과 증거 타입을 확정한다**

`src/features/studio/types.ts`에 다음 타입을 추가한다.

```ts
export interface TeacherRecordingSettings {
  learnerAlias: string;
  progressPersistence: boolean;
  processRecording: boolean;
  portfolioMedia: boolean;
  aiText: boolean;
  aiVision: boolean;
  aiImageGeneration: boolean;
  acknowledgedAt?: string;
}

export interface StudioObservation {
  importantInformation: 'not-observed' | 'with-support' | 'independent';
  firstAttempt: 'not-observed' | 'with-support' | 'independent';
  aiComparison: 'not-observed' | 'with-support' | 'independent';
  conditionAdjustment: 'not-observed' | 'with-support' | 'independent';
  note: string;
}

export interface StudioEvidenceV2 {
  version: 2;
  id: string;
  learnerAlias: string;
  studioId: string;
  lessonId: LessonId;
  firstAttempt?: StudioExpression;
  supportLevel: SupportLevel;
  supportModesUsed: string[];
  aiSource: AiSource;
  aiRole: string;
  aiDecision?: AiDecision;
  finalExpression?: StudioExpression;
  artifactSummary?: string;
  transferExpression?: StudioExpression;
  observation: StudioObservation;
  startedAt: string;
  completedAt: string;
  updatedAt: string;
}
```

- [ ] **Step 4: 교사 설정 저장소를 구현한다**

`src/features/teacher/recordingSettings.ts`의 공개 API를 다음으로 고정한다.

```ts
export const TEACHER_SETTINGS_KEY = 'ai-students-teacher-settings-v2';
export const TEACHER_SETTINGS_CHANGED = 'teacher-recording-settings-changed';

export const DEFAULT_TEACHER_RECORDING_SETTINGS: TeacherRecordingSettings = {
  learnerAlias: '학생 1',
  progressPersistence: true,
  processRecording: false,
  portfolioMedia: false,
  aiText: false,
  aiVision: false,
  aiImageGeneration: false,
};

export function loadTeacherRecordingSettings(): TeacherRecordingSettings;
export function saveTeacherRecordingSettings(settings: TeacherRecordingSettings): void;
export function clearTeacherRecordingSettings(): void;
```

파싱 실패 시 기본값으로 돌아가고 저장 성공 시 `window.dispatchEvent(new Event(TEACHER_SETTINGS_CHANGED))`를 보낸다. `learnerAlias`는 공백 제거 후 최대 24자로 제한한다. `progressPersistence`는 기존 진도 저장이 항상 켜져 있음을 설명하는 읽기 전용 불변값이므로 저장 시 항상 `true`로 정규화한다. `portfolioMedia`, `aiText`, `aiVision`, `aiImageGeneration`은 후속 단계용 능력 플래그이며 파일럿 UI에서 켜는 조작을 제공하지 않고 `false`를 유지한다.

- [ ] **Step 5: 정제된 증거 저장소를 구현한다**

`src/features/studio/evidenceStorage.ts`의 공개 API:

```ts
export const STUDIO_EVIDENCE_KEY = 'ai-students-studio-evidence-v2';
export const STUDIO_EVIDENCE_CHANGED = 'studio-evidence-changed';

export function sanitizeExpressionForEvidence(value?: StudioExpression): StudioExpression | undefined {
  if (!value) return undefined;
  return {
    mode: value.mode,
    choiceIds: value.choiceIds?.slice(0, 4),
    text: value.text?.trim().slice(0, 300),
    drawing: undefined,
  };
}

export function loadStudioEvidence(): StudioEvidenceV2[];
export function saveStudioEvidence(record: StudioEvidenceV2, processRecording: boolean): boolean;
export function updateStudioObservation(id: string, observation: StudioObservation): boolean;
export function deleteStudioEvidence(id: string): void;
export function clearStudioEvidence(): void;
```

`saveStudioEvidence`는 `processRecording === false`이면 localStorage를 읽거나 쓰지 않고 `false`를 반환한다. 같은 `id`는 교체하며 모든 표현은 정제 후 저장한다. 손상된 JSON은 빈 배열로 취급하되 기존 문자열을 자동 삭제하지 않는다.

- [ ] **Step 6: 저장 계약과 타입을 검증한다**

Run: `npm run check:teacher-recording && npm run lint`

Expected: 옵트인과 정제 계약 성공, TypeScript 오류 없음.

- [ ] **Step 7: 저장 계층을 커밋한다**

```powershell
git add package.json scripts/check-teacher-recording-contract.mjs src/features/studio/types.ts src/features/teacher/recordingSettings.ts src/features/studio/evidenceStorage.ts
git commit -m "feat: add opt-in studio evidence storage"
```

---

## Task 5: 암호화 백업과 원자적 복원

**Files:**
- Create: `src/features/teacher/backup.ts`
- Modify: `scripts/check-teacher-recording-contract.mjs`

- [ ] **Step 1: 백업 보안 계약을 실패 검사에 추가한다**

다음 항목을 검사한다: `AES-GCM`, `PBKDF2`, `SHA-256`, 250,000회, 16바이트 salt, 12바이트 IV, 허용 키 목록, API 키 미포함, 복원 전 검증.

- [ ] **Step 2: 검사가 백업 파일 누락으로 실패하는지 확인한다**

Run: `npm run check:teacher-recording`

Expected: `backup module is missing`

- [ ] **Step 3: 백업 포맷과 암복호화 함수를 구현한다**

`src/features/teacher/backup.ts`의 포맷과 공개 API를 고정한다.

```ts
interface BackupEnvelope {
  format: 'ai-textbook-backup';
  version: 1;
  salt: string;
  iv: string;
  ciphertext: string;
}

interface BackupPayload {
  version: 1;
  exportedAt: string;
  values: Record<string, string | null>;
}

const BACKUP_KEYS = [
  'ai-students-progress',
  'ai-students-settings',
  'ai-students-teacher-settings-v2',
  'ai-students-studio-evidence-v2',
  'ai-students-generalization-v1',
] as const;

export async function createEncryptedBackup(passphrase: string): Promise<Blob>;
export async function decryptBackup(text: string, passphrase: string): Promise<BackupPayload>;
export function applyBackup(payload: BackupPayload): void;
```

키 파생은 `PBKDF2 / SHA-256 / 250000 iterations`, 암호화는 `AES-GCM / 256bit`, salt는 16바이트, IV는 12바이트 난수를 사용한다. 실제 API 키 저장소인 `ai-students-gemini-key`를 비롯해 허용 목록에 없는 키를 읽지 않는다.

- [ ] **Step 4: 복원을 원자적으로 적용한다**

`applyBackup`은 다음 순서를 지킨다.

1. `payload.version === 1`과 모든 키가 `BACKUP_KEYS` 안에 있는지 검사한다.
2. 현재 허용 키 값을 메모리에 스냅숏으로 보관한다.
3. 새 값을 쓰되 `null`은 해당 키를 삭제한다.
4. 한 건이라도 실패하면 스냅숏을 되돌리고 오류를 다시 던진다.
5. 성공 후 `storage`에 의존하는 화면을 갱신할 수 있도록 사용자 정의 이벤트를 보낸다.

- [ ] **Step 5: 계약과 타입을 검증한다**

Run: `npm run check:teacher-recording && npm run lint`

Expected: 암호화 알고리즘·허용 키·롤백 계약 성공.

- [ ] **Step 6: 백업 계층을 커밋한다**

```powershell
git add scripts/check-teacher-recording-contract.mjs src/features/teacher/backup.ts
git commit -m "feat: add encrypted local backup and restore"
```

---

## Task 6: 스튜디오 세션 상태기계와 완료 증거 생성

**Files:**
- Modify: `src/features/studio/types.ts`
- Create: `src/features/studio/studioReducer.ts`
- Create: `src/features/studio/useStudioSession.ts`
- Modify: `scripts/check-studio-pilot-contract.mjs`

- [ ] **Step 1: 단계 순서와 진행 조건에 대한 계약 검사를 추가한다**

검사는 여덟 단계 배열이 정확한 순서인지, `NEXT_STAGE`가 건너뛰지 않는지, 첫 시도·AI 판단·전이가 각각 다음 단계 조건으로 사용되는지 확인한다.

- [ ] **Step 2: 검사 실패를 확인한다**

Run: `npm run check:studio-pilot`

Expected: `studio reducer is missing`

- [ ] **Step 3: 직렬화 가능한 세션 타입과 액션을 정의한다**

```ts
export interface StudioSessionState {
  stage: StudioStage;
  startedAt: string;
  supportLevel: SupportLevel;
  supportModesUsed: string[];
  firstAttempt?: StudioExpression;
  reason?: string;
  aiDecision?: AiDecision;
  finalExpression?: StudioExpression;
  artifactSummary?: string;
  transferExpression?: StudioExpression;
}

export type StudioAction =
  | { type: 'set-support'; value: SupportLevel }
  | { type: 'set-first-attempt'; value: StudioExpression }
  | { type: 'set-reason'; value: string }
  | { type: 'record-support-mode'; value: string }
  | { type: 'set-ai-decision'; value: AiDecision }
  | { type: 'set-final-expression'; value: StudioExpression }
  | { type: 'set-artifact'; value: string }
  | { type: 'set-transfer'; value: StudioExpression }
  | { type: 'next' }
  | { type: 'previous' }
  | { type: 'reset'; supportLevel: SupportLevel };
```

- [ ] **Step 4: 순수 리듀서와 단계 검증 함수를 구현한다**

```ts
export const STUDIO_STAGES: StudioStage[] = [
  'encounter', 'first-attempt', 'condition-change', 'ai-compare',
  'decision', 'artifact', 'transfer', 'complete',
];

export function canAdvance(state: StudioSessionState): boolean {
  if (state.stage === 'first-attempt') return Boolean(state.firstAttempt);
  if (state.stage === 'decision') return Boolean(state.aiDecision && state.finalExpression);
  if (state.stage === 'artifact') return Boolean(state.artifactSummary?.trim());
  if (state.stage === 'transfer') return Boolean(state.transferExpression);
  return true;
}
```

`next`는 `canAdvance`가 거짓이면 동일 객체를 반환하고, 참이면 배열의 다음 단계로만 이동한다. `previous`는 첫 단계 아래로 가지 않는다. `reason`은 선택 사항이므로 진행 조건에 넣지 않는다.

- [ ] **Step 5: 훅에서 증거 생성과 옵트인을 연결한다**

`useStudioSession(definition, supportLevel, onComplete)`는 다음을 반환한다.

```ts
{
  state,
  dispatch,
  canGoNext: canAdvance(state),
  goNext,
  goPrevious,
  reset,
}
```

`complete`에 처음 도달할 때만 `StudioEvidenceV2`를 만든다. 교사 설정의 `processRecording`을 `saveStudioEvidence`에 전달하고, 저장 여부와 무관하게 `onComplete()`를 호출한다. React Strict Mode에서 중복 저장·중복 완료가 생기지 않도록 `useRef` 완료 가드를 둔다.

- [ ] **Step 6: 자동 TTS 부재를 확인한다**

`useStudioSession.ts`와 `studioReducer.ts`는 `useSpeak`, `speechSynthesis`, `speak(`를 import하거나 호출하지 않아야 한다. 이 조건을 스튜디오 계약 검사에 추가한다.

- [ ] **Step 7: 계약·타입을 실행한다**

Run: `npm run check:studio-pilot && npm run lint`

Expected: 단계 순서·진행 조건·TTS 계약 성공.

- [ ] **Step 8: 상태 계층을 커밋한다**

```powershell
git add scripts/check-studio-pilot-contract.mjs src/features/studio/types.ts src/features/studio/studioReducer.ts src/features/studio/useStudioSession.ts
git commit -m "feat: add studio learning state machine"
```

---

## Task 7: 접근 가능한 표현 통로와 지원 조절 UI

**Files:**
- Create: `src/features/studio/components/StudioExpressionInput.tsx`
- Create: `src/features/studio/components/SupportSelector.tsx`
- Create: `src/features/studio/components/AiDecisionPanel.tsx`
- Modify: `scripts/check-studio-pilot-contract.mjs`

- [ ] **Step 1: 표현 통로 계약을 추가한다**

검사는 다섯 모드 라벨, 세 지원 수준 라벨, AI 판단 세 가지, 수동 읽기 버튼의 `speakNow`, 자동 `speak` 미사용을 확인한다.

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:studio-pilot`

Expected: 표현 컴포넌트 누락 오류.

- [ ] **Step 3: 기존 입력 컴포넌트를 복사하지 않고 어댑터로 재사용한다**

`StudioExpressionInput`은 기존 `src/components/mission/blocks/ExpressionInput.tsx`를 감싸되 새 타입을 변환한다. 공개 API는 다음과 같다.

```ts
interface Props {
  value?: StudioExpression;
  choices: StudioChoice[];
  modes: ExpressionMode[];
  prompt: string;
  accent: string;
  onChange: (value: StudioExpression) => void;
}
```

`ExpressionInput`의 기존 `GeneralizationExpression`과 구조가 같으므로 경계에서 명시적 변환 함수를 사용한다. AAC 모드는 현재 선택 카드 UI를 사용하고, 교실 도크의 전체 AAC 카드 보드도 계속 접근 가능하게 둔다. 음성은 STT 결과 텍스트만 세션에 남고 오디오를 녹음하지 않는다. 그림은 현재 세션에만 data URL이 존재하며 저장 직전 정제된다.

- [ ] **Step 4: 지원 수준 선택기를 구현한다**

`SupportSelector`는 `radiogroup`과 세 개의 `radio` 버튼을 사용한다. 설명 문구는 다음으로 고정한다.

- `충분한 지원`: “중요한 정보를 줄여서 보고, 선택지를 적게 받아요.”
- `약한 지원`: “핵심 힌트를 받고 내 방법을 정해요.”
- `도전적`: “여러 조건과 AI 의견의 한계까지 비교해요.”

선택 변경은 기존 전역 난이도 값을 바꾸지 않고 현재 스튜디오 세션에만 적용한다. 최초값만 전역 난이도에서 매핑한다.

- [ ] **Step 5: AI 판단 패널을 구현한다**

`AiDecisionPanel`은 준비된 AI 의견과 역할을 먼저 보여주고 다음 세 버튼을 제공한다.

```ts
const DECISION_LABELS: Record<AiDecision, string> = {
  accept: '이 의견을 받아들여요',
  modify: '내 생각에 맞게 고쳐요',
  reject: '이 의견은 사용하지 않아요',
};
```

선택 후 `StudioExpressionInput`으로 최종 방법을 다시 표현하게 한다. “거절”은 경고색이나 실패색을 사용하지 않는다.

- [ ] **Step 6: 접근성·타입 검사를 실행한다**

Run: `npm run check:studio-pilot && npm run check:activity-icons && npm run lint`

Expected: 모드·라벨·판단 계약 성공, 아이콘/타입 오류 없음.

- [ ] **Step 7: 표현 UI를 커밋한다**

```powershell
git add scripts/check-studio-pilot-contract.mjs src/features/studio/components/StudioExpressionInput.tsx src/features/studio/components/SupportSelector.tsx src/features/studio/components/AiDecisionPanel.tsx
git commit -m "feat: add multimodal studio response controls"
```

---

## Task 8: 청소년형 교과서 스튜디오 화면

**Files:**
- Create: `src/features/studio/components/EditorialStudioFrame.tsx`
- Create: `src/features/studio/components/StudioExplanationPanel.tsx`
- Create: `src/features/studio/components/StudioExperience.tsx`
- Modify: `src/components/MicroLessonFrame.tsx`
- Create: `src/features/studio/StudioLessonView.tsx`
- Modify: `scripts/check-studio-pilot-contract.mjs`

- [ ] **Step 1: 화면 구조와 다음 버튼 잠금 계약을 추가한다**

검사는 `MicroLessonFrame`의 `nextDisabled`, 8단계 라벨, 첫 시도 화면의 점수·해설 부재, 마지막 단계 자동 TTS 부재를 확인한다.

- [ ] **Step 2: 검사 실패를 확인한다**

Run: `npm run check:studio-pilot`

Expected: `nextDisabled` 또는 스튜디오 화면 누락 오류.

- [ ] **Step 3: 기존 프레임의 다음 버튼만 하위 호환 방식으로 확장한다**

`MicroLessonFrame`의 Props에 `nextDisabled?: boolean`을 추가하고 기본값을 `false`로 둔다. 마지막 다음 버튼에 `disabled={nextDisabled}`와 `aria-disabled={nextDisabled}`를 전달한다. 기존 호출부는 수정하지 않아도 동일하게 작동해야 한다.

- [ ] **Step 4: 에디토리얼 2면 프레임을 구현한다**

`EditorialStudioFrame`은 기존 `LessonSpread`를 사용해 왼쪽에 상황·조건·여백 메모, 오른쪽에 현재 학생 조작을 배치한다. 헤더에는 다음만 둔다.

```ts
const STAGE_LABELS: Record<StudioStage, string> = {
  encounter: '상황 만나기',
  'first-attempt': '첫 생각',
  'condition-change': '조건이 달라졌어요',
  'ai-compare': 'AI의 다른 관점',
  decision: '내가 판단하기',
  artifact: '생각을 결과물로',
  transfer: '다른 상황에 적용하기',
  complete: '과정 돌아보기',
};
```

스타일은 `themeFor(moduleId)`의 주색을 제목·진행선에, 보조색을 작은 번호·여백 표식에만 사용한다. 모든 본문은 `--editorial-ink`를 사용한다.

- [ ] **Step 5: 여덟 단계의 본문을 한 오케스트레이터에 구현한다**

`StudioExperience`의 단계별 핵심 동작:

1. `encounter`: 생활 장면과 현재 사실, 지원 수준 선택.
2. `first-attempt`: 표현 통로 선택, 첫 방법, 선택적인 이유. 정답·점수·즉각 해설 없음.
3. `condition-change`: 기존 사실과 새 사실을 시각적으로 구분, “무엇이 달라졌나요?” 확인.
4. `ai-compare`: 준비된 AI 역할·의견·질문을 제시. 출처 배지 `준비된 AI 예시` 표시.
5. `decision`: 수용·수정·거절 후 최종 방법 표현.
6. `artifact`: 행동 카드/다시 말하기 카드/시각 계획 중 정의된 종류를 미리보기로 구성하고 300자 이하 요약 저장.
7. `transfer`: 유사하지만 다른 상황에서 한 번 더 선택 또는 표현.
8. `complete`: 첫 생각→AI 의견→최종 판단→전이를 나란히 보여주고 “선택을 유지한 것도 이유가 있으면 좋은 판단”이라고 안내.

`SupportProfile.visibleFactCount`와 `choiceLimit`은 화면에 보이는 정보·선택지 수에 실제 적용한다. 힌트를 열었을 때 `record-support-mode`에 `hint`를 기록한다.

- [ ] **Step 6: 기존 3수준 설명을 첫 시도 뒤의 생각 도구로 통합한다**

`StudioExplanationPanel`은 `encounter`와 `first-attempt`에서는 절대 렌더링하지 않는다. 첫 선택이 끝난 뒤 `condition-change`부터 “생각 도구 열기”로 제공하며 현재 지원 수준에 따라 다음 자료를 보여준다.

| 지원 수준 | 기존 자료의 재배치 | 제시 방식 |
|---|---|---|
| 충분한 지원 | `lesson.bodyEasy`, `hard.goal.easy` | 한 문단, 핵심어 2개, 읽기 버튼 |
| 약한 지원 | `lesson.bodyNormal`, `hard.goal.normal`, `hard.method` 앞 2개 | 한 문단, 단계 힌트 2개 |
| 도전적 | `hard.goal.hard`, `hard.concept`, `hard.terms`, `hard.method`, `hard.limits` | 개념·용어·한계 접이식 카드 |

어려움 콘텐츠가 없으면 `lesson.bodyNormal`과 현재 차시 목표로 안전하게 폴백한다. 지원 수준을 바꾸면 같은 장면에서 설명의 양과 깊이가 바뀌지만 첫 선택 데이터는 지우지 않는다. 설명을 열었을 때 `supportModesUsed`에 `explanation-full`, `explanation-light`, `explanation-challenge` 중 하나를 기록한다.

이 배치로 기존 3수준 설명은 삭제되지 않지만, 학생이 설명을 암기한 뒤 답하는 구조도 피한다. 파일럿 3차시의 기존 `steps` 데이터는 소스에 보존해 롤백과 내용 대조에 사용하되 새 경로에서는 직접 렌더링하지 않는다. 기존 단계 중 새 경험과 일치하는 문장·선택지는 `StudioDefinition`에 재사용하고, 단일 정답만 확인하는 상호작용은 스튜디오에 옮기지 않는다.

- [ ] **Step 7: 기존 진도와 연결하는 `StudioLessonView`를 구현한다**

Props는 기존 `LessonView` 라우팅에 맞춘다.

```ts
interface Props {
  definition: StudioDefinition;
  lesson: LessonContent;
  hard?: HardLessonContent;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}
```

전역 `difficulty`를 `SupportLevel` 초기값으로 변환하고, `MicroLessonFrame`에 `totalSteps={8}`, 현재 단계 인덱스, 이전/다음, `nextDisabled={!canGoNext}`를 전달한다. `const { markCompleted } = useProgress()`를 사용해 완료 시 `markCompleted(definition.lessonId)`를 호출한다. 새 진도 저장소를 만들지 않는다.

- [ ] **Step 8: TTS 회귀 방지 계약을 실행한다**

`StudioExperience`에는 읽기 아이콘을 눌렀을 때만 `speakNow`를 호출할 수 있다. `useEffect`에서 읽기 함수를 호출하지 않는다. `complete` 진입 시 브라우저의 `speechSynthesis.speaking`이 `false`인 것이 브라우저 점검 항목이다.

- [ ] **Step 9: 타입과 UI 계약을 확인한다**

Run: `npm run check:studio-pilot && npm run check:ui-polish && npm run lint`

Expected: 모든 검사 성공.

- [ ] **Step 10: 학생 스튜디오 화면을 커밋한다**

```powershell
git add scripts/check-studio-pilot-contract.mjs src/components/MicroLessonFrame.tsx src/features/studio/components/EditorialStudioFrame.tsx src/features/studio/components/StudioExplanationPanel.tsx src/features/studio/components/StudioExperience.tsx src/features/studio/StudioLessonView.tsx
git commit -m "feat: build editorial studio lesson experience"
```

---

## Task 9: `LessonView` 안전 라우팅과 기존 65차시 폴백

**Files:**
- Modify: `src/views/LessonView.tsx`
- Modify: `scripts/check-studio-pilot-contract.mjs`

- [ ] **Step 1: 완성 정의 우선·기존 폴백 계약을 추가한다**

검사는 `getStudioDefinition`, `StudioLessonView`, 정의가 없을 때 기존 `ImplementedLesson` 반환, 단순히 `role === 'studio'`라는 이유만으로 새 화면을 열지 않는 것을 확인한다.

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:studio-pilot`

Expected: 라우팅 누락 오류.

- [ ] **Step 3: 최상위 라우팅에 최소 분기를 추가한다**

`LessonView`의 차시 존재 여부와 기존 렌더링 로직 앞에서 정의를 조회한다.

```tsx
const studioDefinition = getStudioDefinition(lessonId);
if (studioDefinition) {
  return (
    <StudioLessonView
      definition={studioDefinition}
      lesson={lesson}
      hard={getHardContent(lesson.id)}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    />
  );
}
```

`getLessonRole(lessonId) === 'studio'`이지만 정의가 없는 15개 앵커는 이 분기에 들어오지 않는다. 그 결과 기존 콘텐츠와 기존 3단계 설명이 그대로 유지된다.

- [ ] **Step 4: 세 파일럿과 두 폴백을 수동 확인한다**

Run: `npm run dev`

브라우저 확인:

- `m5-l1`, `m5-l6`, `m5-l11`: 새 에디토리얼 스튜디오.
- `m5-l2`: 기존 차시.
- `m1-l1`: 역할상 스튜디오지만 아직 기존 차시.
- 존재하지 않는 차시: 기존 오류/준비 화면 유지.

- [ ] **Step 5: 회귀 검사와 빌드를 실행한다**

Run: `npm run check:generalization && npm run check:studio-pilot && npm run build`

Expected: 기존 일반화 계약과 새 스튜디오 계약 모두 성공.

- [ ] **Step 6: 라우팅을 커밋한다**

```powershell
git add scripts/check-studio-pilot-contract.mjs src/views/LessonView.tsx
git commit -m "feat: route ready M5 lessons to studio experience"
```

---

## Task 10: 지원 차시 연결 브리지와 5단원 포트폴리오 마무리

**Files:**
- Create: `src/data/supportBridges/m5.ts`
- Create: `src/features/studio/SupportLessonBridge.tsx`
- Create: `src/features/studio/ModuleCloseLessonView.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `scripts/check-studio-pilot-contract.mjs`

- [ ] **Step 1: 지원 차시와 마무리 계약을 추가한다**

검사는 다음 매핑을 확인한다.

```ts
const M5_BRIDGE_GROUPS = {
  'm5-l2': ['m5-l1', 'm5-l6'],
  'm5-l3': ['m5-l1', 'm5-l6'],
  'm5-l4': ['m5-l1', 'm5-l6'],
  'm5-l5': ['m5-l1', 'm5-l6'],
  'm5-l7': ['m5-l6', 'm5-l11'],
  'm5-l8': ['m5-l6', 'm5-l11'],
  'm5-l9': ['m5-l6', 'm5-l11'],
  'm5-l10': ['m5-l6', 'm5-l11'],
} as const;
```

`m5-l12`는 `ModuleCloseLessonView`로 연결되고 다른 단원 마무리는 기존 화면을 유지해야 한다.

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:studio-pilot`

Expected: 브리지 데이터 누락 오류.

- [ ] **Step 3: 지원 차시별 회상·예고 문장을 작성한다**

각 데이터 항목은 다음 구조를 갖는다.

```ts
interface SupportBridgeDefinition {
  lessonId: LessonId;
  recallLessonId: LessonId;
  recallPrompt: string;
  practicePurpose: string;
  nextStudioLessonId: LessonId;
  nextPreview: string;
}
```

`l2~l5`는 버스 지연에서 시작한 “문제 찾기·작게 나누기·순서·우선순위”를 연습하고 `l6`의 다시 말하기를 예고한다. `l7~l10`은 `l6`의 명확화 경험을 회상해 “한 단계씩·확인·다른 방법·실수 수정”을 연습하고 `l11`의 조건이 바뀌는 계획을 예고한다. 기존 본문 설명은 삭제하지 않는다.

- [ ] **Step 4: 기존 본문의 첫 설명 단계에만 브리지를 삽입한다**

`SupportLessonBridge`는 두 칸짜리 낮은 카드로 만든다.

- 왼쪽 `지난 경험`: 이전 스튜디오에서 무엇을 했는지 회상.
- 오른쪽 `이번 연습과 다음 경험`: 현재 설명의 목적과 다음 스튜디오 예고.

`LessonView`의 첫 텍스트 스텝에서 M5 브리지 데이터가 있을 때만 본문 위에 렌더링한다. 게임·정리·AI 단계에는 반복 표시하지 않는다.

- [ ] **Step 5: 5단원 마무리를 정답 퀴즈가 아닌 포트폴리오로 만든다**

`ModuleCloseLessonView`는 다음 세 영역을 제공한다.

1. `나의 세 경험`: 저장된 증거가 있으면 세 스튜디오의 첫 생각·AI 판단·전이를 표시하고, 없으면 “이 기기에는 과정기록이 없어요. 활동을 하지 않았다는 뜻은 아니에요.” 표시.
2. `내가 잘한 과정`: 학생이 네 평가 기준 중 하나 이상을 자기 선택.
3. `다음에 써 볼 방법`: 선택·AAC·글·말 중 하나로 짧게 표현.

과정기록이 꺼져 있어도 마무리 차시는 수행 가능하며, 완료하면 기존 진도만 갱신한다.

- [ ] **Step 6: 라우팅 분기를 제한적으로 추가한다**

`lessonId === 'm5-l12' && getLessonRole(lessonId) === 'module-close'`일 때만 새 마무리 화면을 사용한다. M1~M4의 `l11`, M6의 `l12`는 기존 렌더링을 유지한다.

- [ ] **Step 7: 계약·빌드를 실행한다**

Run: `npm run check:studio-pilot && npm run check:generalization && npm run build`

Expected: 브리지 8개와 M5 마무리 계약 성공, 기존 일반화 계약 성공.

- [ ] **Step 8: 연결 구조를 커밋한다**

```powershell
git add scripts/check-studio-pilot-contract.mjs src/data/supportBridges/m5.ts src/features/studio/SupportLessonBridge.tsx src/features/studio/ModuleCloseLessonView.tsx src/views/LessonView.tsx
git commit -m "feat: connect M5 support lessons and portfolio close"
```

---

## Task 11: 교사 허브, 최초 안내, 기존 패널 보존

**Files:**
- Create: `src/features/teacher/TeacherHub.tsx`
- Create: `src/features/teacher/TeacherOnboarding.tsx`
- Create: `src/features/teacher/LegacyTeacherPanels.tsx`
- Modify: `src/views/TeacherView.tsx`
- Modify: `scripts/check-teacher-recording-contract.mjs`

- [ ] **Step 1: 교사 허브 정보 구조 계약을 추가한다**

다음 탭 문구가 모두 있어야 한다.

```ts
const TEACHER_TABS = [
  '운영 안내',
  '학생 기록',
  '포트폴리오',
  'AI 연결',
  '학습목표·성취기준',
  '데이터 관리',
] as const;
```

또한 “이 비밀번호는 학생 화면과 교사 화면을 나누기 위한 장치이며 데이터 암호화 기능이 아닙니다.”라는 안내를 포함한다.

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:teacher-recording`

Expected: 교사 허브 누락 오류.

- [ ] **Step 3: 기존 패널을 동작 변경 없이 분리한다**

`TeacherView.tsx`의 `ApiKeyPanel`, `ProgressPanel`, `ObjectivesPanel`을 `LegacyTeacherPanels.tsx`로 옮겨 named export한다. 내용·API 키 저장 방식·폴백 테스트·진도 계산·성취기준 표시를 바꾸지 않는다. 기존 `GeneralizationRecordsPanel`도 삭제하거나 변환하지 않는다.

- [ ] **Step 4: 최초 기록 활성화 안내를 구현한다**

`TeacherOnboarding`은 학생 별칭과 다음 네 확인 상자를 보여준다.

- 이 브라우저에만 기록된다는 점을 이해했다.
- 음성·사진·그림 원본과 전체 AI 대화는 저장하지 않는다는 점을 이해했다.
- 필요할 때 교사 화면에서 기록을 삭제하고 백업할 책임을 이해했다.
- 학생과 보호자에게 수업 목적의 과정기록임을 안내했다.

네 확인이 모두 선택되고 학생 별칭이 비어 있지 않을 때만 `과정기록 켜기` 버튼이 활성화된다. 저장 시 `processRecording: true`, `acknowledgedAt: new Date().toISOString()`을 기록한다. `기록 없이 사용하기`는 설정을 바꾸지 않고 허브를 계속 사용할 수 있게 한다.

- [ ] **Step 5: 교사 허브 탭 셸을 구현한다**

접근 직후에는 `운영 안내`가 기본 탭이다. 탭은 키보드 좌우 화살표 이동과 `aria-selected`를 지원한다. 운영 안내에는 다음 순서가 보인다.

1. 68차시는 유지되고 18개 핵심 경험을 중심으로 재편된다는 설명.
2. 5단원 파일럿의 세 핵심 경험.
3. `첫 생각 → 조건 변화 → AI 비교 → 내 판단 → 전이` 평가 로직.
4. 세 지원 수준과 지원을 줄이거나 늘리는 기준.
5. 저장되는 항목과 저장되지 않는 항목.
6. 수업 전 1분 점검.

- [ ] **Step 6: 기존 비밀번호 게이트 뒤에 허브를 연결한다**

`TeacherView`는 잠금 해제 전 화면과 로그아웃 로직을 유지한다. 잠금 해제 후 본문은 다음과 같이 교체한다.

```tsx
<TeacherHub
  onExit={onExit}
  onLogout={() => {
    logout();
    setActive(false);
  }}
/>
```

- [ ] **Step 7: 계약과 타입을 실행한다**

Run: `npm run check:teacher-recording && npm run lint`

Expected: 탭 6개, 온보딩 4개 확인, 보안 경계 설명 계약 성공.

- [ ] **Step 8: 교사 허브를 커밋한다**

```powershell
git add scripts/check-teacher-recording-contract.mjs src/features/teacher/TeacherHub.tsx src/features/teacher/TeacherOnboarding.tsx src/features/teacher/LegacyTeacherPanels.tsx src/views/TeacherView.tsx
git commit -m "feat: add teacher operations hub and recording consent"
```

---

## Task 12: 학생 기록·포트폴리오·데이터 관리 패널

**Files:**
- Create: `src/features/teacher/StudioEvidencePanel.tsx`
- Create: `src/features/teacher/TeacherDataManagement.tsx`
- Modify: `src/features/teacher/TeacherHub.tsx`
- Modify: `scripts/check-teacher-recording-contract.mjs`

- [ ] **Step 1: 기록 표시·삭제·백업 복원 계약을 추가한다**

검사는 다음 UI 문구와 연결을 확인한다.

- `첫 생각`, `AI와 비교`, `최종 판단`, `새 상황에 적용`
- `중요한 정보 찾기`, `스스로 시도하기`, `AI 의견 비교하기`, `조건에 맞게 조정하기`
- `이 기록 삭제`, `모든 과정기록 삭제`, `암호화 백업 만들기`, `암호화 백업 복원하기`
- `이전 일반화 기록`

- [ ] **Step 2: 계약 실패를 확인한다**

Run: `npm run check:teacher-recording`

Expected: 기록 패널 누락 오류.

- [ ] **Step 3: 과정증거 패널을 구현한다**

`StudioEvidencePanel`은 `STUDIO_EVIDENCE_CHANGED` 이벤트를 구독해 새로 읽는다. 학생 별칭과 날짜로 묶되 한 브라우저에 여러 학생 데이터가 섞일 수 있음을 상단에 경고한다. 각 증거 카드는 다음을 표시한다.

| 학습 증거 | 표시 내용 |
|---|---|
| 첫 선택 | 모드와 선택 라벨 또는 정제된 짧은 텍스트 |
| AI 비교 | 준비된/실제 출처, 역할, 수용·수정·거절 |
| 수정된 판단 | 최종 표현과 산출물 요약 |
| 전이 | 새 상황의 선택/표현 |
| 지원 | 시작 지원 수준과 사용한 힌트 |

교사는 네 관찰 기준을 `관찰하지 못함 / 지원을 받아 수행 / 스스로 수행`으로 갱신하고 300자 메모를 남길 수 있다. 학생 선택을 교사가 수정하는 기능은 만들지 않는다.

- [ ] **Step 4: 포트폴리오 탭을 같은 데이터의 학생 친화 보기로 구현한다**

포트폴리오에서는 점수와 독립 수행 비율을 숨기고 “처음에는”, “AI는”, “나는 이렇게 판단”, “다른 상황에서는” 네 문장과 산출물 제목을 보여준다. 저장 데이터가 없을 때는 빈 상태 설명만 표시한다.

- [ ] **Step 5: 데이터 관리 패널을 구현한다**

`TeacherDataManagement`의 동작:

- 기록 켜기/끄기: 끄더라도 기존 기록은 자동 삭제하지 않는다.
- 개별 삭제: 증거 ID 확인 후 삭제.
- 전체 과정기록 삭제: `전체 삭제`를 직접 입력해야 실행.
- 암호화 백업: 8자 이상 암호 두 번 일치 후 파일 다운로드.
- 복원: 파일 선택, 암호 입력, 복호화·구조 검증 후 현재 데이터를 대체할 것인지 한 번 더 확인.
- 성공 후 새로고침 안내, 실패 시 기술 세부 대신 “암호가 다르거나 백업 파일이 손상되었어요.” 표시.
- 백업 암호는 브라우저에 저장하지 않는다.

- [ ] **Step 6: 기존 일반화 기록을 읽기 전용으로 보존한다**

`학생 기록` 탭 하단에 `<details>` 제목 `이전 일반화 기록`으로 기존 `GeneralizationRecordsPanel`을 그대로 렌더링한다. v1을 v2로 자동 변환하거나 중복 저장하지 않는다.

- [ ] **Step 7: 계약·타입을 검증한다**

Run: `npm run check:teacher-recording && npm run lint`

Expected: 기록·관찰·포트폴리오·백업·레거시 계약 성공.

- [ ] **Step 8: 교사 데이터 UI를 커밋한다**

```powershell
git add scripts/check-teacher-recording-contract.mjs src/features/teacher/StudioEvidencePanel.tsx src/features/teacher/TeacherDataManagement.tsx src/features/teacher/TeacherHub.tsx
git commit -m "feat: add teacher evidence and data management panels"
```

---

## Task 13: 통합 검사, 브라우저 시나리오, 교사 안내 문서

**Files:**
- Create: `scripts/check-m5-pilot.mjs`
- Modify: `package.json`
- Create: `docs/teacher-guide/m5-studio-pilot.md`

- [ ] **Step 1: 파일럿 집계 검사를 작성한다**

`scripts/check-m5-pilot.mjs`는 하위 검사를 순서대로 실행하고 하나라도 실패하면 같은 종료 코드로 끝낸다.

```js
import { spawnSync } from 'node:child_process';

const checks = [
  'scripts/check-lesson-role-contract.mjs',
  'scripts/check-studio-pilot-contract.mjs',
  'scripts/check-teacher-recording-contract.mjs',
  'scripts/check-editorial-theme-contract.mjs',
];

for (const check of checks) {
  const result = spawnSync(process.execPath, [check], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('M5 pilot contract: all checks passed');
```

`package.json`:

```json
"check:pilot": "node scripts/check-m5-pilot.mjs"
```

- [ ] **Step 2: 교사 안내 문서를 완성한다**

`docs/teacher-guide/m5-studio-pilot.md`에 다음 내용을 실제 화면 용어와 동일하게 작성한다.

1. 파일럿 목적과 68차시/18개 핵심 경험 관계.
2. M5 핵심 경험 3개와 지원 차시 연결표.
3. 8단계 수업 흐름과 예상 시간 15~20분.
4. `충분한 지원 / 약한 지원 / 도전적` 사용 기준과 수업 중 변경 원칙.
5. 과정중심평가 네 기준과 “선택 유지도 타당하면 성공” 원칙.
6. 브라우저 저장 로직, 기본 꺼짐, 같은 브라우저·프로필에서만 보인다는 한계.
7. 저장 항목/미저장 항목/학생 별칭 운용.
8. 암호화 백업·복원·삭제 절차와 암호 분실 시 복구 불가.
9. 비밀번호 게이트가 보안 경계가 아니라는 설명.
10. TTS·STT·AAC·그림 입력 점검과 실제 조리 안전선.

- [ ] **Step 3: 기록 꺼짐 브라우저 시나리오를 검증한다**

1. 새 브라우저 컨텍스트에서 교사 설정 키와 v2 증거 키가 없는지 확인한다.
2. `m5-l1`을 완료한다.
3. 첫 시도에서 정답/오답 피드백이 없는지 확인한다.
4. `m5-l1` 완료 진도는 남지만 `ai-students-studio-evidence-v2`는 생기지 않는지 확인한다.
5. 마지막 단계 진입 시 TTS가 자동 재생되지 않는지 확인한다.

- [ ] **Step 4: 기록 켜짐 브라우저 시나리오를 검증한다**

1. 교사 화면에서 안내 네 항목을 확인하고 별칭 `학생 1`로 기록을 켠다.
2. `m5-l1`에서 첫 선택을 유지하고 AI 의견을 거절한 뒤 전이까지 완료한다.
3. 교사 기록에 거절이 실패로 표시되지 않고 첫 선택·최종 판단·전이가 보이는지 확인한다.
4. `m5-l6`에서 음성 입력을 사용하고 저장값에는 텍스트만 있는지 확인한다.
5. `m5-l11`에서 그림을 사용하고 저장값에는 캔버스 data URL이 없는지 확인한다.
6. `m5-l12` 포트폴리오에서 세 경험을 확인한다.

- [ ] **Step 5: 백업·복원 브라우저 시나리오를 검증한다**

1. 암호화 백업을 만들고 JSON 외피에 평문 학생 답변/API 키가 없는지 확인한다.
2. 과정기록을 삭제해 빈 상태를 확인한다.
3. 올바른 암호로 복원해 기록이 돌아오는지 확인한다.
4. 틀린 암호로 복원했을 때 기존 데이터가 바뀌지 않는지 확인한다.

- [ ] **Step 6: 기존 화면 회귀를 검증한다**

- `m1-l1`: 기존 3단계 설명과 활동.
- `m5-l2`: 지원 브리지 + 기존 3단계 설명/활동.
- `m6-l11`: 역할상 스튜디오지만 아직 기존 화면.
- 기존 교사 API 키 테스트, 진도, 학습목표, 이전 일반화 기록.
- TTS 토글이 꺼진 상태에서 어떤 단계도 자동 낭독하지 않음.

- [ ] **Step 7: 전체 자동 검사를 실행한다**

Run:

```powershell
npm run check:pilot
npm run check:generalization
npm run check:ui-polish
npm run check:activity-icons
npm run check:encoding
npm run lint
npm run build
```

Expected: 모든 명령 종료 코드 0, Vite 빌드 성공.

- [ ] **Step 8: 변경 범위와 금지 파일 미접촉을 확인한다**

Run: `git status --short`

Expected: 이 계획에서 명시한 파일만 수정·추가되어 있고, 기존 사용자 미추적 파일은 처음 상태 그대로 남아 있다.

- [ ] **Step 9: 통합 문서와 검사기를 커밋한다**

```powershell
git add package.json scripts/check-m5-pilot.mjs docs/teacher-guide/m5-studio-pilot.md
git commit -m "docs: add M5 studio pilot operations and QA"
```

---

## Post-Implementation Review Gate

구현 완료 후 다음 질문에 모두 “예”라고 답할 수 있어야 2단계인 나머지 15개 스튜디오 확장 계획을 작성한다.

- 학생이 설명을 다 읽기 전에 생활 장면과 첫 판단을 실제로 경험하는가?
- 첫 선택을 저장하되 곧바로 정답을 가르치지 않는가?
- 바뀐 조건이 장식이 아니라 학생의 판단을 수정할 실제 이유가 되는가?
- AI가 답안지가 아니라 질문자·대안 제시자·반론자로 기능하는가?
- 학생이 AI 의견을 수용·수정·거절할 수 있는가?
- 선택·말·글·AAC·그림 중 적절한 통로를 쓸 수 있는가?
- 세 지원 수준이 내용의 양·선택지·힌트·AI 역할 깊이를 실제로 바꾸는가?
- 교사는 정답률 대신 첫 시도·비교·조정·전이를 확인할 수 있는가?
- 기록 기능을 쓰지 않아도 교과서의 핵심 학습이 온전히 가능한가?
- 청소년 학생이 보기에 유치하지 않으면서도 인지적 부담이 낮은가?
- 기존 65개 차시와 과거 기록이 손상되지 않았는가?
- 마지막 활동 진입을 포함해 TTS가 사용자 조작 없이 켜지지 않는가?

이 게이트에서 발견된 문제는 18개 스튜디오로 복제하기 전에 파일럿에서 먼저 수정한다.
