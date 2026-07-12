# PC Comic Spread Lessons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 1280px 이상 차시 화면을 디지털 만화책 스프레드로 재구성하고 검은 만화 테두리를 제거한다.

**Architecture:** `LessonSpread`가 페이지 면과 반응형 스프레드를 담당하고, 도입·활동·정리 전용 컴포넌트가 이를 조합한다. 기존 차시 데이터와 게임 로직은 유지하며 `LessonView`의 렌더 계층만 교체한다.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite, CSS gradients.

## Global Constraints

- Home과 목차의 정보 구조는 변경하지 않는다.
- 기본 검증 폭은 1280px이며 390px 폴백도 통과해야 한다.
- 기존 lesson 데이터, TTS, 사전, 진도 저장, 교사 도구를 유지한다.
- 새 에셋은 PNG 원본과 WebP 서비스본을 쌍으로 보관한다.
- 새 의존성을 추가하지 않는다.

---

### Task 1: 스프레드 회귀 검사와 공통 페이지 셸

**Files:**
- Create: `src/components/lesson/LessonSpread.tsx`
- Create: `src/components/lesson/ScreentoneBackdrop.tsx`
- Modify: `src/index.css`
- Modify: `scripts/check-ui-polish.mjs`

**Interfaces:**
- `LessonSpread({ left, right, reverse?, label?, accent, className? })`
- `ScreentoneBackdrop({ moduleId, children })`

- [ ] `check-ui-polish.mjs`에 `LessonSpread` 존재, `lg:grid-cols-[7fr_5fr]`, `comic-stage > div:first-child` 제거 조건을 추가한다.
- [ ] `npm run check:ui-polish`를 실행해 공통 셸 부재로 실패하는지 확인한다.
- [ ] `LessonSpread`에 페이지 면, 중앙 거터, `reverse` 배치, 모바일 한 열 구조를 구현한다.
- [ ] `ScreentoneBackdrop`에 6개 모듈별 저대비 CSS gradient 패턴을 구현한다.
- [ ] 기존 `.comic-panel`, `.comic-stage`, 블록 그림자 규칙 중 차시 전용 규칙을 제거한다.
- [ ] `npm run check:ui-polish && npm run lint && npm run check:encoding`을 실행한다.
- [ ] `git commit -m "feat: add lesson comic spread shell"`로 커밋한다.

### Task 2: 도입을 에피소드 히어로 스프레드로 전환

**Files:**
- Create: `src/components/lesson/EpisodeHeroSpread.tsx`
- Modify: `src/components/Stage.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/index.css`

**Interfaces:**
- `EpisodeHeroSpread`는 기존 Stage props인 `lessonId`, `title`, `scene`, `text`, `episodeTitle`, `accent`, `accentText`, `accentSoft`를 소비한다.
- `Stage`는 호환 래퍼로 남아 기존 호출부를 깨뜨리지 않는다.

- [ ] 회귀 검사에 `EpisodeHeroSpread`와 `spread-hero-image` 표식을 추가하고 실패를 확인한다.
- [ ] 기존 WebP→PNG→아바타 후보 체인을 별도 훅 없이 `EpisodeHeroSpread`로 이동한다.
- [ ] PC에서 이미지 7, 텍스트 5 비율의 스프레드를 구현하고 차시 번호에 따라 `reverse`를 교대한다.
- [ ] 곡선 SVG와 굵은 외곽선을 제거하고 회차 라벨·제목·내레이션·TTS를 오른쪽 면에 배치한다.
- [ ] `npm run check:ui-polish && npm run lint`를 실행한다.
- [ ] `git commit -m "feat: redesign lesson hero as comic spread"`로 커밋한다.

### Task 3: 게임 활동을 질문·조작 스프레드로 전환

**Files:**
- Create: `src/components/lesson/ActivitySpread.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/components/games/OXGame.tsx`
- Modify: `src/components/games/CardPick.tsx`
- Modify: `src/components/games/Matching.tsx`
- Modify: `src/components/games/Sequence.tsx`
- Modify: `src/index.css`

**Interfaces:**
- `ActivitySpread({ kicker, title, accent, character?, children })`
- 게임 컴포넌트의 데이터·콜백 props는 변경하지 않는다.

- [ ] 회귀 검사에 네 게임 렌더가 `ActivitySpread`를 사용하는 조건을 추가하고 실패를 확인한다.
- [ ] `ActivitySpread`의 왼쪽 면에 질문·캐릭터 반응, 오른쪽 면에 조작을 배치한다.
- [ ] 네 게임에서 `card3d`, 2.5~4px 상시 테두리, 블록 그림자를 제거하고 색면·간격·상태 아이콘으로 구분한다.
- [ ] 정답·오답의 색+아이콘+TTS 피드백을 유지한다.
- [ ] 390px에서 선택지가 한 열이고 1280px에서 양면 스프레드인지 브라우저로 확인한다.
- [ ] `npm run check:ui-polish && npm run lint && npm run check:encoding`을 실행한다.
- [ ] `git commit -m "feat: redesign lesson games as activity spreads"`로 커밋한다.

### Task 4: AI·미션 활동과 엔딩 페이지

**Files:**
- Create: `src/components/lesson/EpisodeEnding.tsx`
- Modify: `src/views/LessonView.tsx`
- Modify: `src/components/RealAIStep.tsx`
- Modify: `src/components/PhoneFrame.tsx`
- Modify: `src/components/mission/MissionStep.tsx`
- Modify: `src/index.css`

**Interfaces:**
- `EpisodeEnding({ wrapUpText, goalText, reaction, next, theme, onSpeak, onFinish })`
- Real AI·sim AI·mission의 기존 props와 완료 흐름을 유지한다.

- [ ] 회귀 검사에 real-ai, sim-ai, mission, wrap-up의 스프레드 표식을 추가하고 실패를 확인한다.
- [ ] AI 활동을 왼쪽 아이미 안내 면과 오른쪽 대화 조작 면으로 배치한다.
- [ ] 미션은 탭·인쇄·저장 로직을 유지한 채 페이지 면 안에 배치한다.
- [ ] 정리를 이미지·오늘의 배움·다음 화 예고로 구성한 `EpisodeEnding`으로 교체한다.
- [ ] 고정 하단의 굵은 `.comic-frame-footer`를 저대비 페이지 네비게이션으로 바꾼다.
- [ ] `npm run check:ui-polish && npm run lint && npm run check:encoding`을 실행한다.
- [ ] `git commit -m "feat: finish comic spread lesson experience"`로 커밋한다.

### Task 5: 에셋·실브라우저·완료 감사

**Files:**
- Verify: `public/lessons/`, `public/lessons/png/`, `public/lessons/webtoon/`, `public/lessons/png/webtoon/`
- Modify only if needed: relevant assets and `docs/superpowers/specs/2026-07-12-pc-comic-spread-lessons-design.md`

**Interfaces:**
- WebP 우선, PNG 폴백, 캐릭터 아바타 최종 폴백.

- [ ] 대표 도입, OX, matching, real-ai, mission, wrap-up을 1280×900에서 확인한다.
- [ ] 같은 화면을 768×1024와 390×844에서 확인하고 가로 스크롤·잘림·52px 미만 조작이 없는지 확인한다.
- [ ] 기존 에셋을 우선 사용하고 부족한 핵심 장면만 생성해 PNG·WebP 쌍으로 저장한다.
- [ ] 콘솔 오류가 0인지 확인한다.
- [ ] `npm run check:ui-polish && npm run lint && npm run check:encoding && npm run build`를 실행한다.
- [ ] `git diff --check`와 `git status --short`로 의도한 변경만 남았는지 확인한다.
- [ ] `git commit -m "chore: verify comic spread lesson redesign"`로 필요한 최종 조정만 커밋한다.

