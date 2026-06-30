# 발달장애 학생용 AI 온라인 교과서 — 설계 명세

- 작성일: 2026-06-30
- 원본 프로젝트: AI Bridge: Zero-Gap Toolkit (교사 연수용)
- 신규 프로젝트: 발달장애 학생용 AI 교과서
- 배포: 별도 GitHub Pages 신규 레포 (사용자가 사전 생성, 현재 비어 있음)

## 1. 프로젝트 개요

원본 AI Bridge 프로젝트(교사 대상, 6모듈 42차시 + 19개 도구 + 링크도서관)를 발달장애 학생용 학습 교과서로 전면 리모델링한다. 가르치는 핵심 개념(AI/LLM, 프롬프트, 안전·윤리)은 유지하되, 학습자가 바뀌므로 모든 서술·활동·UI를 재설계한다.

### 1.1 학습자 정의

- **혼합 교실** 대응: 여러 인지 수준이 함께 사용. 난이도 토글(쉬움/보통) 2단계.
- 장애 유형 범위: 지적장애, 자폐 스펙트럼, 학습장애 등 폭넓게 수용.
- 인지 수준 가정 범위: 초등 저학년 수준 ~ 중학생 수준.

### 1.2 설계 원칙

1. **한 화면 = 한 정보 덩어리**. 압도하지 않는다.
2. **학생은 길을 잃지 않는다**. 좌측 모듈 트리가 항상 보임.
3. **API 키·기술 용어는 학생에게 노출하지 않는다**. 교사 영역.
4. **실패는 부드럽게**. 오류는 학생 1줄 + 교사 기술 상세 2단으로.
5. **시간을 압박하지 않는다**. 분 표시 없음.
6. **이미지/영상 자리는 비워둔다**. 사용자가 후속으로 채움.

## 2. 콘텐츠 구조

### 2.1 모듈 구성 (6 모듈 × 평균 11~12차시 = 68차시)

| # | 모듈명 | 성격 | 차시 |
|---|---|---|---|
| 1 | AI가 뭐야? | 개념 이해 | 11 |
| 2 | AI랑 말해보기 | 대화·프롬프트 입문 | 11 |
| 3 | AI랑 같이 배우기 | 학습 활용 | 11 |
| 4 | AI 안전하게 쓰기 | 안전·윤리·자기보호 | 11 |
| 5 | AI로 문제해결하기 | 논리·사고력 강화 | 12 |
| 6 | AI랑 일상생활 | 직업·생활 실전 (마트, 길찾기, 직업 준비 등) | 12 |
| | | **합계** | **68** |

원본 모듈 매핑:
- 원 M1(LLM 기초) → 신 M1
- 원 M2(프롬프트) → 신 M2
- 원 M3(교실 통합) + 원 M4(도구 활용) → 신 M3 (학생 학습 활용으로 변환)
- 원 M5(학교 행정 자동화) → **폐기**, 신 M5(문제해결)로 리모델링
- 원 M6(AI 윤리) → 신 M4(안전·윤리) + 신 M6(일상생활) 일부에 흡수

### 2.2 차시 단위 (마이크로러닝 혼합)

| 유형 | 길이(내부 기준) | 구성 |
|---|---|---|
| 개념 차시 | 3~5분 | 핵심 1문장 + 그림 + 확인 게임 1개 |
| 활동 차시 | 5~10분 | 도입 + 인터랙티브 게임/실습 + 한 줄 정리 |
| 체험 차시 | 10~15분 | 실제 AI 또는 시뮬레이션 대화 + 확장 활동 |

**시간은 학생 화면에 표시하지 않는다.** 내부 설계 기준일 뿐.

### 2.3 난이도 토글

- 2단계: **쉬움 / 보통**
- 학생이 상단바에서 직접 전환
- 같은 차시 안에서 텍스트 길이·어휘·게임 단계 수가 달라짐
- 진도 저장은 난이도와 무관 (차시 완료 단위)

### 2.4 제외 항목 (확정)

- 도구(QuickTools / ToolPage / ToolRegistry) **완전 삭제**
- 링크도서관(Resources) **완전 삭제**
- "심화" 표시된 모든 차시·섹션 **제거**
- 진단 플로우(Persona / DiagnosticPurpose) **완전 제거** — 학생은 진단 없이 모듈 1부터 시작
- 모니터링·리소스 자동화(monitor-state, health-reports 등) **제거**
- 교육과정 룩업(curriculumStandards.json, curriculumLookup) **제거**

## 3. UX 표준

### 3.1 화면 레이아웃 — PC 우선 (1280px+)

```
┌────────────────────────────────────────────────────────────────────────┐
│ 상단바  [모듈명 > 차시명]   [🔊 TTS] [Aa 글자] [난이도] [📖 쉬운 사전]   │
├────────────┬─────────────────────────────────────────┬─────────────────┤
│ 좌측       │                                         │ 우측 패널       │
│ 모듈/차시  │     (큰 이미지 자리 — 추후 추가)          │ (쉬운 사전)     │
│ 트리       │                                         │                 │
│            │     큰 글자 한 줄 (핵심)                  │ 단어 클릭하면   │
│ 모듈 1     │     짧은 설명 1~2줄                       │ 여기 뜻이 뜸    │
│  ●●○○○     │                                         │ + 자동 낭독     │
│ 모듈 2     │     [버튼/카드/게임 인터랙션]             │                 │
│ ...        │                                         │                 │
├────────────┴─────────────────────────────────────────┴─────────────────┤
│ 하단        [← 이전]            [● ● ○ ○]             [다음 →]          │
└────────────────────────────────────────────────────────────────────────┘
```

- 모바일은 부차적 — 좌·우 패널이 접히고 햄버거 메뉴화. 기능 동일.
- 좌측 트리 항상 노출. 학생이 "어디까지 했는지" 늘 보임.
- 우측 사전 패널 기본 닫힘, 단어 클릭 또는 [📖 쉬운 사전] 클릭 시 열림.
- 한 화면당 정보 덩어리는 1개만.

### 3.2 쉬운 사전

- 본문에서 어려운 단어는 **점선 밑줄**로 표시
- 클릭 시 우측 패널 자동 열림 + 단어 뜻 + 자동 TTS 낭독
- 상단바 [📖 쉬운 사전] 버튼으로 직접 검색도 가능
- 항목 구조: `한 줄 설명 / 그림 자리 / 짧은 예시 / TTS용 짧은 버전`
- 데이터 위치: `src/data/studentDictionary.ts` (신규 분리)
- 초기 50~100개 항목, 학생용으로 전면 신규 작성

### 3.3 TTS · 글자 크기 · 난이도

| 항목 | 기본값 | 학생 조작 |
|---|---|---|
| TTS 읽어주기 | 켜짐 | 상단바 토글 |
| 글자 크기 | 보통 (= 원본 "매우 크게" 수준) | 보통 ↔ 크게 (2단계) |
| 난이도 | 보통 | 쉬움 ↔ 보통 |
| 줄 간격 | 1.8 (고정) | — |
| 폰트 | Pretendard | — |

### 3.4 입력 방식 (차시별 가변)

| 방식 | 사용 비중(추정) | 활동 예 |
|---|---|---|
| 🖱️ 클릭/카드 | ~65% | "어떤 게 AI일까?", "맞으면 ⭕" |
| ⌨️ 짧은 자판 | ~20% | "한 단어로 물어봐: ___" (최대 한 문장) |
| 🎤 음성 입력 (STT) | ~15% | "마이크 누르고 말해보기" (Web Speech API) |

자판 입력은 **최대 한 문장**까지. 긴 프롬프트는 항상 카드 선택으로 조립.

### 3.5 색상 · 시각 톤

- 모듈별 컬러 시스템 **유지**, 채도만 낮춤 (자폐 스펙트럼 자극 최소화)
- 인터랙티브 요소 최소 터치 영역: **64×64px**
- 정답/오답 피드백: **색 + 아이콘 + TTS 3중** (색맹 대응)

### 3.6 이미지 · 영상

- 원본 설명용 이미지·이모지 그림 **전부 삭제**
- 회색 박스 placeholder + "(여기에 그림)" 안내만 남김
- 사양: 화면 가로 100%, 16:9 또는 1:1
- 사용자가 추후 Gemini/GPT로 생성해 채움

## 4. AI 호출 구조

### 4.1 권한 분리

| 항목 | 학생 | 교사 |
|---|---|---|
| API 키 입력 UI | 절대 안 보임 | 별도 진입점에서만 |
| 모델 선택 | 안 보임 | 안 보임 |
| 실패/오류 메시지 | 부드러운 1줄 안내 | + 그 아래 기술 상세 |
| 사용량 한도 | 안 보임 | 추후 추가 가능 |

### 4.2 교사 키 등록 — 2가지 방식 병행

- **A. 빌드타임 키**: 학교·교실 단위 사전 배포. `.env`의 `GEMINI_API_KEY`를 Vite 빌드 시 주입.
- **B. 교사 모드 진입**: URL 파라미터 `?teacher=1` + 비밀번호 → localStorage 저장.

학생 빌드는 보통 A로 충분. B는 자체 키를 빌드에 박지 못할 때.

### 4.3 차시별 AI 사용 분류

| 유형 | 사용 비중(목표) | AI 동작 |
|---|---|---|
| 🟢 시뮬레이션 (대본 응답) | ~60% | 미리 준비한 정해진 답변 재생. 통제된 학습 사례. |
| 🟡 실제 AI (Gemini 호출) | ~30% | "직접 말해보기" 등 핵심 체험. 응답 제한 적용. |
| ⚪ AI 없음 | ~10% | 게임·드래그·짝맞추기 등 콘텐츠로 완결 |

### 4.4 시뮬레이션 응답 데이터 구조 (예시)

```ts
{
  lessonId: 'm4-3',
  title: 'AI가 틀린 답을 줄 때',
  scenarioResponses: [
    {
      userInput: '세종대왕이 컴퓨터를 만들었어?',
      aiResponse: '네! 세종대왕은 1443년에 첫 컴퓨터를 만들었어요. (← 이거 거짓말!)',
      teachingPoint: 'AI는 가끔 자신 있게 거짓말을 해요',
    },
  ]
}
```

데이터 위치: `src/data/scenarioResponses.ts` (신규).

### 4.5 실제 AI 호출 안전 가드

- **응답 길이 제한** — 시스템 프롬프트에 100자 이내 명시
- **온도 0.3** — 예측 가능성 ↑
- **금칙어 사후 필터** — 폭력·자해·성적 표현 감지 시 "다시 말해줄게요" 대체
- **타임아웃 15초** — 응답 안 오면 "잠깐 쉬자!" 안내
- **응답 후 자동 TTS 낭독** (기본 켜짐)
- **모델 폴백 유지** — 3.5-flash → 3.1-flash-lite → 2.5-flash → 2.5-flash-lite

### 4.6 학생용 오류 메시지 (2단 구조)

학생용 1줄 안내 + 그 아래 교사용 기술 상세를 **함께** 표시.

| 원본 오류 | 학생용 (상단) | 교사용 (하단) |
|---|---|---|
| API 키 무효 | 잠깐 쉬자! 선생님께 알려줘. | `API key invalid: <원문>` |
| 모델 응답 실패 | AI가 졸려서 못 들었나봐. 다시 해보자! | `Model <X> failed after <N>s: <원문>` |
| 일일 한도 초과 | 오늘은 AI가 충전 중! 내일 다시 만나자. | `Quota exceeded for model <X>` |

## 5. 파일 단위 변경 계획

### 5.1 완전 삭제

- `src/views/QuickTools.tsx`, `src/views/ToolPage.tsx`
- `src/tools/**` (ToolRegistry 등 전체)
- `src/views/Resources.tsx`, `src/data/resourcesData.ts`
- `src/data/curriculumStandards.json`, `src/utils/curriculumLookup.ts`
- `monitor-state.json`, `monitor-prompts/`, `health-reports/`, `pending-resources/`
- 진단 플로우 관련 컴포넌트·타입·라우팅
- `public/`의 모든 일러스트·아이콘 이미지
- `docs/code-review/`, `docs/superpowers/plans/2026-05-22-link-library-*`, `docs/presentation-scenario.md`
- `fix-request-2026-06-10.md`

### 5.2 전면 재작성

- `src/data/tutorialData.ts` — 68차시 학생용 신규
- `src/views/Tutorial.tsx` — 3단 PC 레이아웃, 마이크로러닝 단위
- `src/views/Home.tsx` — 학생용 단일 CTA + 진도 요약
- `src/views/Module4Components.tsx` — 신 모듈 4 (안전·윤리)
- `src/views/Module5Components.tsx` — 신 모듈 5 (문제해결·논리)
- `src/utils/learningDictionary.ts` 또는 신규 `src/data/studentDictionary.ts` — 50~100항목 신규
- `src/App.tsx` — 라우팅 단순화, 진단·도구·링크 제거, 글자 크기 2단계
- `src/types.ts` — `ToolDefinition`, `Persona`, `DiagnosticPurpose` 폐기, `Difficulty`, `DictionaryEntry` 추가
- `CLAUDE.md`, `README.md` — 학생용 안내로 재작성

### 5.3 신규 추가

- `src/components/SidebarTree.tsx` — 좌측 모듈/차시 트리 + 진도 점
- `src/components/DictionaryPanel.tsx` — 우측 쉬운 사전
- `src/components/DifficultyToggle.tsx`
- `src/components/FontSizeToggle.tsx`
- `src/components/MicroLessonFrame.tsx` — 차시 표준 골격
- `src/components/ErrorMessage.tsx` — 학생/교사 2단 메시지
- `src/games/` — 게임 위젯 라이브러리 (OXGame, CardPick, Matching, DragDrop, Sequence 등 8~12개)
- `src/data/scenarioResponses.ts`
- `src/data/studentDictionary.ts`
- `src/utils/teacherMode.ts` — `?teacher=1` + 비밀번호
- `src/utils/safetyFilter.ts` — 응답 금칙어 사후 필터
- `src/utils/sttHelper.ts` — Web Speech API 래퍼

### 5.4 유지·소폭 수정

- `src/utils/gemini.ts` — 안전 가드 추가, 오류 2단 구조
- `src/utils/geminiConstants.ts` — 모델 폴백 유지
- `src/utils/storage.ts` — 진도 키 `ai-students-progress`로 변경, 진단 코드 제거
- `src/utils/moduleThemes.ts` — 컬러 유지, 채도 낮춤
- `src/index.css` — 글자 크기 베이스 상향
- `package.json` — 의존성 정리
- `vite.config.ts` — base path 신규 레포명으로 변경
- `tsconfig.json` — 그대로

## 6. 개발 마일스톤

8단계, 각 단계에 검증 게이트 ✅.

| 단계 | 내용 | 기간 | 누적 |
|---|---|---|---|
| M0 | 정리 & 초기화 (삭제, 신규 레포 연결, base path, CLAUDE 재작성) | 1주 | 1주 |
| M1 | 인프라 골격 (3단 레이아웃, 공통 컴포넌트, 안전 가드, 데모 차시 1개) | 2주 | 3주 |
| M2 | 모듈 1 (AI가 뭐야?) — 11차시 | 1.5주 | 4.5주 |
| M3 | 모듈 2 (AI랑 말해보기) — 11차시, 실제 AI 첫 도입, STT | 2주 | 6.5주 |
| M4 | 모듈 3 (AI랑 같이 배우기) — 11차시 | 1.5주 | 8주 |
| M5 | 모듈 4 (AI 안전하게 쓰기) — 11차시, 시뮬레이션 ~30개 | 2주 | 10주 |
| M6 | 모듈 5 (AI로 문제해결하기) — 12차시, 논리 게임 신규 | 2주 | 12주 |
| M7 | 모듈 6 (AI랑 일상생활) — 12차시, 시나리오 ~20개 | 2주 | 14주 |
| M8 | 통합 QA & 배포, 교사 가이드 | 1.5주 | **15.5주 (~4개월)** |

### 6.1 게이트 기준 요약

- M0: `npm run build` 통과 + GitHub Pages 빈 껍데기 배포 성공
- M1: 데모 차시에서 TTS·사전·난이도·게임·시뮬레이션·진도 저장 모두 동작
- M2: 모듈 1 처음~끝 연속 플레이 시 이상 흐름·오류 없음
- M3: 실제 Gemini 호출이 길이 제한·필터·타임아웃 모두 정상. 안전망 작동 검증
- M4: 모듈 1~3 연속 플레이 시 일관된 UX
- M5: 시뮬레이션 사례가 학습 목표와 명확히 연결됨, 교사 검토 1회 권장
- M6: 사고력 게임이 학생이 직접 단계를 짚을 수 있는 난이도
- M7: 전체 모듈 끝까지 통과 가능, 진도 처음~끝 정상 저장·복원
- M8: 실사용 교사 1~2명 베타 검토 통과

### 6.2 병렬화 옵션

M2~M7은 콘텐츠 작성이 핵심이라 인프라 변경 적음. 2~3개 모듈 병렬 작성 시 ~2개월로 단축 가능 (일관성 검토 비용 추가).

### 6.3 위험 요소

1. **콘텐츠 분량 폭발** — 68차시 × 평균 5화면 ≈ 340 화면
2. **시뮬레이션 응답 작성 비용** — 학습 목표에 정확히 맞는 짧고 명확한 사례 작성 난이도
3. **이미지 후추가 의존성** — placeholder만으로는 학생 경험 빈약, 이미지 생성 일정 별도 필요
4. **실제 학생 테스트 부재** — 베타 사용자 확보가 M8 게이트의 핵심

## 7. 데이터 모델 변경 요약

### 7.1 신규 타입 (개념)

```ts
type Difficulty = 'easy' | 'normal';

interface DictionaryEntry {
  term: string;           // 표제어
  aliases?: string[];     // 별칭/이형
  shortExplanation: string;  // 한 줄 설명
  example?: string;       // 짧은 예시
  ttsVersion?: string;    // TTS용 더 짧은 버전 (없으면 shortExplanation 사용)
  imagePlaceholder?: boolean;
}

interface ScenarioResponse {
  userInput: string;      // 학생이 누르는 카드 텍스트 또는 입력 예시
  aiResponse: string;     // 미리 정해진 AI 답변
  teachingPoint: string;  // 이 사례로 가르치려는 것
}

interface LessonContent {
  id: string;             // 예: 'm1-l1'
  moduleId: number;
  title: string;
  kind: 'concept' | 'activity' | 'experience';
  bodyEasy: string;       // 쉬움 난이도용 본문 (마크다운)
  bodyNormal: string;     // 보통 난이도용 본문 (마크다운)
  games?: GameSpec[];     // 인터랙티브 게임 위젯 명세
  scenarioResponses?: ScenarioResponse[];
  useRealAI?: boolean;    // true면 실제 Gemini 호출, false면 시뮬레이션만
}
```

### 7.2 폐기 타입

- `ToolDefinition`, `ToolInput`, `ToolKind` (전체)
- `Persona`, `DiagnosticPurpose`, `DiagnosticAnswers`, `ModuleVisibility`
- `ViewType`에서 `'resources' | 'tools'` 제거 → `'home' | 'tutorial' | 'teacher'`

### 7.3 진도 저장 키

- 변경: `ai-teachers-progress` → `ai-students-progress`
- 구조: `{ completedLessons: string[], difficulty: Difficulty, ttsEnabled: boolean, fontSize: 'normal' | 'large' }`

## 8. 향후 결정 보류 항목

- 교사 모드 비밀번호 정책 (고정? 학교별 설정?) — M1 구현 시 결정
- 게임 위젯 라이브러리에 외부 라이브러리(예: dnd-kit) 도입 여부 — M1에서 결정
- 모바일 패널 접힘 UX 세부 — M1에서 시안 후 결정
- 이미지 생성 가이드(스타일·크기·톤) 별도 문서 — M8 전에 작성

---

**다음 단계**: 이 spec을 바탕으로 `superpowers:writing-plans` 스킬을 사용해 M0~M1 우선 구현 계획을 상세화한다.
