# CLAUDE.md

이 문서는 저장소를 수정할 때 사용하는 현재 기준입니다. 과거 작업 계획과 완료 보고서는 Git
기록에서 확인하고, 새 작업은 현재 코드와 이 문서를 기준으로 판단합니다.

## 프로젝트

발달장애 학생을 위한 PC 중심 AI 학습 교과서입니다.

- React 19 + TypeScript + Vite + Tailwind CSS
- 6개 단원, 68차시
- 62개 경험 중심 스튜디오 + 6개 단원 마무리 포트폴리오
- 배포: GitHub Pages, base path `/AITEXTBOOKforSTUDENTS/`
- 학생 화면은 짧은 읽기, 카드 선택, 게임, 이야기 장면을 중심으로 구성

## 반드시 지킬 제품 계약

- API 연결과 키 관리는 교사 영역입니다. 학생 화면에 API 키, 모델명, 기술 오류를 노출하지 않습니다.
- 현재 스튜디오의 AI 비교 자료는 `source: 'prepared'`인 준비된 예시입니다. 카메라나 마이크
  권한이 없어도 핵심 학습이 완료되어야 합니다.
- 미니게임은 태블릿·PC 크기(768px 이상)에서만 엽니다. 드래그·조준·타이밍 조작이 390px에서는
  손가락과 판이 겹쳐 성립하지 않기 때문입니다. 휴대전화에서는 게임을 그리지 않고(청크도 받지 않고)
  안내를 대신 보여 주되, 정리 패널을 그대로 이어 붙여 핵심 학습은 끝까지 완료되게 합니다.
  `npm run check:minigames`가 이를 강제합니다.
- 지원 수준의 내부 값은 `full | light | challenge`, 화면 표시는 `충분한 지원 | 중학 | 고등`입니다.
  `중학`과 `고등`은 지원 강도이자 학년군 운영 축입니다. 같은 68차시를 중·고가 공통으로
  쓰되 중학교는 9학년군, 고등학교는 12학년군 성취기준으로 평가합니다.
- 난이도의 내부 값 `easy | normal | hard`는 그대로 두고 화면 표시만 위 라벨을 따릅니다.
  글자 크기의 `보통`은 별개이므로 바꾸지 않습니다.
- 학년군은 표지에서 고르는 운영 결정입니다. 차시 화면의 지원 수준 스티커는 `중학`과 `고등`을
  직접 잇지 않습니다. 누르면 언제나 `충분한 지원`으로 내려가고, 거기서 한 번 더 눌러 확인 창에
  답해야 반대쪽 학년군으로 건너갑니다. 확인 창은 뼈대가 같고 성취기준과 표현의 난이도가
  달라진다는 점을 알립니다. `npm run check:grade-band-guard`가 이를 강제합니다.
- 학년군은 `SettingsState.gradeBand`에 difficulty와 따로 저장합니다. `충분한 지원`은 두 학년군
  모두에서 쓰는 하위 단계라 그 자체로 학년군이 될 수 없고, 그 상태에서도 어느 학년군으로
  평가할지 알아야 하기 때문입니다.
- PC 1280px 이상을 우선하되, 모바일 390px와 글자 크기 125%에서도 주요 조작이 가려지지 않아야 합니다.
- 차시 전환 시 상태가 섞이지 않도록 라우트 단위 상태는 `lessonId`로 격리합니다.
- `tests/e2e`가 생기더라도 테스트를 맞추기 위해 수정하지 말고 애플리케이션 코드를 고칩니다.
- 학생 노출 문체는 화자로 나뉩니다. 서술은 합니다체, 또래 인물끼리는 반말, 아이미와
  학생에게 건네는 말은 해요체입니다. 해요체도 존댓말이므로 금지 대상이 아닙니다.
  다만 앱이 학생에게 직접 건네는 말(UI·게임 피드백·지시문)에는 반말을 쓰지 않습니다.
  학생이 아이미에게 하는 질문은 반말이어도 됩니다. `npm run check:student-formal-style`이
  이를 검사합니다.
- 이야기(visualNovel)는 **쉬운 글이 곧 짧은 글이 아니라는 원칙**을 따릅니다. 장면 하나를
  대사 칸 3~4개로 나눠 학생이 넘겨 읽고, 각 칸은 배경·이유·인물의 반응을 생략하지 않습니다.
  지원 수준 셋은 칸 수와 사건이 같고 문장 길이와 낱말만 다릅니다. 쉬운 수준이라고 정보를
  덜어 내지 않습니다. 작법은 `docs/remodel2/02-CHARACTERS.md` §2,
  검사는 `npm run check:visual-novel-story`와 `npm run check:support-gradient`입니다.
- PECS·AAC 라벨은 카드 이미지에 인쇄된 글자와 어체까지 일치시킵니다. 인쇄된 낱말과
  화면 낱말을 짝지어 읽는 것이 이 도구의 사용법이므로 한쪽만 바꾸지 않습니다.
- 한국어 파일은 UTF-8, TypeScript는 strict 설정을 유지합니다.

## 현재 단일 진실 원천

- 전체 차시와 단원: `src/data/modules.ts`, `src/data/lessons/`
- 차시 역할: `src/data/lessonRoles.ts`
- 스튜디오 62개: `src/data/studios/m1/` ~ `m6/` (차시당 1파일 + `index.ts` 배럴)
- 단원 마무리 6개: `src/data/modulePortfolios/m1.ts` ~ `m6.ts`
- 고등 심화 과제: `src/data/highSchoolTasks.ts` — 62차시 각각의 고등 학년군 전용 수행.
  지원 수준이 `고등`일 때 전이 단계에 나타나며, 중학과 고등의 차이를 텍스트 밀도가
  아니라 수행 요구 수준으로 만든다. 실시간 AI나 새 이미지를 요구하지 않는다.
- 성취수준: `src/data/aiAchievementLevels.ts` — 24개 성취기준 × 상·중·하.
- 차시 학습목표: `src/data/lessonObjectives.ts` — studios·lessons의 objective가 여기를
  따라야 하며 `npm run check:objectives
npm run check:standards-integrity
npm run check:highschool-tasks`가 강제합니다.
- 정식 콘텐츠와 성취기준: `src/data/canonicalLessons/`, `src/data/aiAchievementStandards.ts`
- 학생 사전: `src/data/studentDictionary.ts`
- 단원별 핵심 내용: `src/data/moduleCoreContents.ts` — 한 단원이 어떤 내용을 어떤 차시 묶음으로
  다루는지 밝힌다. 차시 범위는 실제 차시와 맞아야 하며 `npm run check:curriculum-document`가
  강제한다.
- 교수·학습 및 평가의 방향과 방법: `src/data/curriculumTeachingAssessment.ts` — 기본 교육과정의
  (가)(나)(다)… 항목 서술 형식을 따르되 내용은 이 저장소의 제품 계약에서 가져온다.
- 교사용 실제 운영 설명: `src/features/teacher/TeacherOperationGuide.tsx`
- 교육과정 원문 참고자료: `docs/reference/2022-special-education-curriculum.pdf`

없는 차시 ID는 임의 데모로 대체하지 않고 `ComingSoonLesson`을 표시합니다.

## 주요 구조

```text
src/
├─ App.tsx                         URL 쿼리 기반 home/contents/lesson/teacher 라우팅
├─ views/
│  ├─ Home.tsx
│  ├─ ContentsView.tsx
│  ├─ LessonView.tsx               역할에 따라 스튜디오/단원 마무리 렌더링
│  └─ TeacherView.tsx
├─ features/
│  ├─ studio/                      8단계 경험, 과정 기록, 지원 수준
│  │  ├─ formats/                  포맷 A~E별 화면 순서 선언(기록 단계는 불변)
│  │  └─ speakerLine.ts            각본 속 `진우: "..."` 표기 → 화자 말풍선 파서
│  └─ teacher/                     운영 허브, 기록, 성취기준, 백업, AI 연결
├─ data/
│  ├─ studios/                     62개 스튜디오 데이터
│  ├─ modulePortfolios/            6개 단원 마무리 데이터
│  ├─ canonicalLessons/            정식 수업 콘텐츠
│  ├─ lessonObjectives.ts          62차시 학습목표 단일 진실 원천
│  └─ lessons/                     68차시 등록 데이터
└─ utils/
   ├─ publicAssetUrl.ts            GitHub Pages public 경로 보정
   ├─ storage.ts                   학생 진도/설정
   ├─ gemini.ts, apiKey.ts         교사 관리 AI 연결
   └─ tts.ts, stt.ts               Web Speech API
```

## 이미지와 public 경로

- 실제 서비스 이미지는 `public/` 아래에만 둡니다.
- 스토리 이미지는 `public/lessons/story/`의 WebP 266개입니다.
  - 스튜디오: 62차시 × 4장 = 248장
  - 단원 마무리: 6개 × 3장 = 18장
- 루트(`/lessons/...`, `/images/...`)로 작성한 public 경로는 렌더링 시
  `src/utils/publicAssetUrl.ts`를 사용해 Pages base path를 붙입니다.
- 원본 스토리보드, 생성 대기열, 캐릭터 참조 시트, 검수 스크린샷은 저장소에 보관하지 않습니다.
  필요한 경우 Git 기록에서 꺼내거나 새 작업용 임시 폴더에서 생성합니다.
- 자세한 현재 자산 규칙은 `docs/ASSETS.md`를 참고합니다.

## 디자인 시스템 계약

학생·교사 화면은 따뜻한 종이와 명확한 잉크를 공통 기반으로 사용합니다. 글래스모피즘과
형광색은 사용하지 않습니다.

- 보이는 면은 `종이(surface-paper)`, `스티커(surface-sticker)`, `도장(surface-stamp)`,
  `선택 카드(surface-choice)`, `A4(surface-a4)` 중 하나로 분류합니다. 복합 컴포넌트는
  여러 면을 포함할 수 있지만, 하나의 면에 두 어포던스를 섞지 않습니다.
- 한 요소의 깊이 신호는 하나뿐입니다. 종이는 `--surface-paper-elevation`, A4·모달은
  `--surface-a4-elevation`, 스티커는 `--surface-sticker-lip`, 만화 컷은
  `--surface-comic-lip`만 사용합니다. Tailwind `shadow-*`, 임의 `box-shadow`,
  안쪽 그림자, 블러·반투명 유리 면을 추가하지 않습니다.
- 테두리는 "면"의 어휘입니다. 위 다섯 가지 면으로 분류한 요소만 2px 이상의 명시적
  테두리를 가집니다. `button`, `input`, `[role=...]` 같은 요소 선택자에 테두리를 일괄로
  걸지 않습니다. 둥근 색 스와치, 목록 행, 아이콘 토글은 면이 아니라 조작이므로 배경·밑줄·
  아웃라인으로 경계를 만듭니다. 여기에 사각 테두리를 강제하면 이미 둥근 면 위에 사각 상자가
  겹칩니다. 경계 하한이 필요하면 `.interactive-border-floor`를 해당 면에만 붙입니다.
- 핵심 텍스트는 종이 면에서 7:1 이상의 대비를 사용하며, 모듈 강조색은 테두리·립·큰 장식에만
  사용합니다. 상단 도구 스티커 색은 `--chrome-*` 토큰에서 고르고, 채도 높은 캔디 색을
  컴포넌트에 직접 적지 않습니다.
- 다크 면은 놀이 프레임(`[data-minigame-frame]`) 안에서만 허용합니다. 프레임 안에서도
  불투명한 `--game-board-*` 토큰과 2px 경계를 사용합니다.
- 변경 뒤 `npm run check:design-system`으로 계약을 검사합니다.

## 놀이 파트의 디자인 계약 (바우하우스)

교과서 본문은 위의 종이 체계를 씁니다. **놀이는 다른 문법을 씁니다.** 어휘가 통째로
바뀌는 것이 "이제 놀이 시간"이라는 신호이고, 게임 62개가 각자 색과 이모지를 고르면서
임의 색상 83종·이모지 618개로 흩어졌던 것을 하나로 묶는 장치이기도 합니다.

- 단일 진실 원천은 `src/features/studio/minigames/engine/bauhaus.ts`(캔버스)와
  `BauhausMark.tsx`(DOM), 그리고 `--game-*` CSS 토큰입니다. **이 셋 밖에서 색을 적지
  않습니다.**
- 형태는 원·사각형·삼각형과 그 파생(고리·반원·사분원·마름모·십자) 여덟 가지입니다.
  **둥근 모서리를 쓰지 않습니다** — 모서리는 각지거나 완전한 원입니다.
- 뜻과 형태를 짝지어 둡니다. 학생이 조종하는 것은 노랑 원, 목표는 파랑 사각형,
  위험은 빨강 삼각형, 중립 구조물은 회색 막대입니다. **뜻은 언제나 모양이 함께 집니다** —
  판 위에서 빨강과 파랑의 대비는 1.22라, 색만으로 나누면 색을 구별 못 하는 학생에게는
  둘이 같은 회색입니다.
- **레퍼런스는 "FORM & COLOR: Bauhaus Arcade"(2026-09-13)입니다.** 놀이 프레임 전체가
  어두운 틀이고, 판은 제도지처럼 격자와 귀퉁이 꺾쇠를 가집니다(캔버스는 `paintBoard`,
  DOM 판은 `GameStage`). 세부는 `drawPanel`(머리띠 패널)·`drawTag`(꼬리표)·
  `drawSegments`(칸 막대)·`drawGhost`(점선 빈자리)·`drawPop`(칭찬 딱지)로 그립니다.
- **면에 칠하는 색과 글자에 쓰는 색을 나눕니다.** 판의 빨강(#D90429)·파랑(#2B5CF0)은
  대비 3.45·3.35라 면·테두리 전용이고, 판 위 글자는 `redInk`·`blueInk`
  (`--game-board-red-ink`·`-blue-ink`)가 맡습니다. 칸 색을 `color` 필드 하나로 들고
  다니는 게임은 글자 자리에서 `inkFor()`로 감쌉니다. 노랑 면 위 글자는 검정(ground)입니다.
- 깊이 신호는 **흐림 없는 딱딱한 어긋남 하나**입니다. DOM은 `.game-lift-1~4`
  (`--game-lift-*` 토큰), 캔버스는 `drawShape`·`drawBar`의 `lift` 옵션을 씁니다. 번지는
  그림자·빛은 쓰지 않습니다. 누르는 버튼은 `.game-press`로 받친 판 위에 내려앉습니다.
- 숫자와 로마자는 Space Grotesk(`--game-font-display`, 캔버스 `CANVAS_FONT`), 한글은
  Pretendard가 받습니다.
- 레퍼런스에서 **가져오지 않은 것**: 10~12px 로마자 설명 글(글자 바닥은 DOM 14px·캔버스
  20 단위이고 뜻 없는 로마자는 학생에게 소음), 번지는 빛, 반투명 면, 칸딘스키의 짝(노랑
  삼각·빨강 사각·파랑 원). 표식도 판의 짝(노랑 원·파랑 사각·빨강 삼각)을 그대로 씁니다.
- 머리글은 반드시 한 줄(44px)입니다. 머리글 높이가 곧 캔버스 크기를 깎고, 장식 글자
  때문에 게임 이름이 잘려서도 안 됩니다.
- 캔버스는 감싼 칸의 남은 높이에 맞춰 줄어듭니다(`div:has(> .game-canvas-fit)` 크기
  컨테이너, 바닥 270px). 이 규칙은 **반드시 `@layer` 밖**에 둡니다 — Tailwind v4에서는
  유틸리티(`min-h-0`)가 선택자 구체성과 무관하게 components 레이어를 이겨 바닥이 지워지고,
  태블릿 폭에서 캔버스가 0px로 사라집니다.
- 배치는 격자에 맞춥니다(960×540을 80단위 12칸). 바우하우스의 비대칭·사선 구성은
  쓰지 않습니다. HUD가 판마다 다른 자리에 있으면 학생은 매번 다시 찾습니다.
- 이모지를 쓰지 않습니다. `drawMark`(캔버스)와 `BauhausMark`(DOM)로 직접 그립니다.
  사물 이모지 옆에 이미 한글 이름이 있으면 이모지만 지웁니다 — 이름이 뜻을 다 지고 있고,
  이모지는 기기와 글꼴마다 달라지는 값만 치릅니다. 실제로 두꺼운 외투와 비옷이 같은 그림을
  물려받아 두 카드가 구별되지 않은 적이 있습니다.
- 방향은 화살표 하나를 돌려 씁니다(`markRotate`, `drawMark`의 rotate). 방향마다 다른 그림을
  두면 학생이 같은 뜻의 그림 넷을 따로 익혀야 합니다.
- 선 굵기는 세 단(캔버스 3·5·9, DOM `--game-hair/line/heavy`)만 씁니다.
- **반투명 겹침을 쓰지 않습니다.** 덮개는 그 아래 글자를 흐려 정작 판단할 것을 가립니다.
  강조는 테두리로 하거나 면을 통째로 뒤집습니다. 변하는 투명도가 곧 놀이의 신호인
  자리(돋보기 밖, 노출 과다, 맞았을 때의 번쩍임)만 `globalAlpha`에 팔레트 색을 얹어
  씁니다 — 효과는 남고 색은 한 곳에서만 옵니다.
- 성공을 알리려고 다섯째 색을 들이지 않습니다. 그 요소 자신의 색으로 면을 뒤집습니다.
- `npm run check:game-visual`이 이를 강제합니다. 검사는 **전환을 마친 파일**(스크립트의
  `MIGRATED`)에 규칙을 온전히 걸고, 나머지는 임의 색상·이모지 수가 기준선보다 늘지 않게
  막는 래칫으로 동작합니다. 지금 61/62가 올라와 있고, 남은 하나는 `m1/AiSpotHuntGame`
  입니다 — 물건 33개 가운데 18개의 그림이 아직 없어 그림 문자가 물건의 정체를 대신하고
  있습니다. 색과 모서리는 이미 옮겼습니다.
- 검사가 보는 것은 16진수만이 아닙니다. `rgba()`, Tailwind 색 클래스(`bg-slate-800`),
  그러데이션, `<MiniGameFrame>`·`<GameHud>`·`<GameStage>`의 `bauhaus` 플래그 누락도 잡습니다.
  앞의 셋은 16진수가 아니라서 한동안 조용히 새고 있었습니다.

## 교사·학생 데이터 경계

- 교사 모드: `?teacher=1`
- Gemini 키: `ai-students-gemini-key`, 브라우저 localStorage에 교사가 직접 저장
- 진도: `ai-students-progress`
- 설정: `ai-students-settings`
- 과정 기록: `ai-students-studio-evidence-v2`, 교사가 켠 경우에만 저장
- 백업에는 API 키와 원본 음성·사진·그림을 포함하지 않습니다.

## 명령

```bash
npm install
npm run dev
npm run lint
npm run build
npm run check:encoding
npm run check:public-images
npm run check:visual-novel-story
npm run check:portfolio-images
npm run check:studio-rollout
npm run check:modules-remodel
npm run check:objectives
npm run check:curriculum-document
npm run check:grade-band-guard
npm run check:game-visual
```

변경 범위에 맞는 계약 검사도 `package.json`의 `check:*` 명령에서 골라 실행합니다.

## 완료 전 검증

최소 기준:

1. `npm run lint`
2. `npm run build`
3. `npm run check:encoding`
4. 이미지 변경 시 `check:public-images`, `check:visual-novel-story`, `check:portfolio-images`
5. 차시 데이터 변경 시 `check:lesson-roles`, `check:studio-rollout`, `check:modules-remodel`
6. UI 변경 시 실제 브라우저에서 1280px 이상과 390px/125% 확인

`tests/e2e`는 수정하지 않습니다. 브라우저 검증 결과와 실행하지 못한 검사는 구분해서 보고합니다.

## 저장소 위생

- 완료된 날짜별 계획서·명세서·수락 보고서를 다시 추가하지 않습니다. 이력은 Git이 보관합니다.
- 현재 의사결정은 이 파일이나 해당 기능 가까이의 코드 주석에 짧게 반영합니다.
- `output/`, Playwright 임시 결과, 생성 중간 이미지, 로컬 도구 캐시는 커밋하지 않습니다.
- 루트에 참고 이미지나 임시 파일을 놓지 않습니다.
- 비밀키, `.env`, 학생 원본 미디어를 커밋하지 않습니다.
