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
- 지원 수준의 내부 값은 `full | light | challenge`, 화면 표시는 `충분한 지원 | 보통 | 도전적`입니다.
- 난이도의 내부 `normal`과 화면의 `보통`을 그대로 유지합니다.
- PC 1280px 이상을 우선하되, 모바일 390px와 글자 크기 125%에서도 주요 조작이 가려지지 않아야 합니다.
- 차시 전환 시 상태가 섞이지 않도록 라우트 단위 상태는 `lessonId`로 격리합니다.
- `tests/e2e`가 생기더라도 테스트를 맞추기 위해 수정하지 말고 애플리케이션 코드를 고칩니다.
- 한국어 파일은 UTF-8, TypeScript는 strict 설정을 유지합니다.

## 현재 단일 진실 원천

- 전체 차시와 단원: `src/data/modules.ts`, `src/data/lessons/`
- 차시 역할: `src/data/lessonRoles.ts`
- 스튜디오 62개: `src/data/studios/m1/` ~ `m6/` (차시당 1파일 + `index.ts` 배럴)
- 단원 마무리 6개: `src/data/modulePortfolios/m1.ts` ~ `m6.ts`
- 차시 학습목표: `src/data/lessonObjectives.ts` — studios·lessons의 objective가 여기를
  따라야 하며 `npm run check:objectives`가 강제합니다.
- 정식 콘텐츠와 성취기준: `src/data/canonicalLessons/`, `src/data/aiAchievementStandards.ts`
- 학생 사전: `src/data/studentDictionary.ts`
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
