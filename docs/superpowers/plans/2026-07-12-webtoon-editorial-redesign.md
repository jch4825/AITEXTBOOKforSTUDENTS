# Webtoon Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Home을 유지한 채 학생 학습 흐름을 반응형 웹툰 에디토리얼 UX로 전환한다.

**Architecture:** 공통 컷 프레임·시즌 지도·엔딩 패널을 컴포넌트로 분리하고, ContentsView와 LessonView가 이를 조합한다. 기존 lesson 데이터와 진행 저장소는 변경하지 않는다.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite.

## Global Constraints

- Home.tsx는 리디자인 범위에서 제외한다.
- 모바일은 단일 세로 컷 흐름, 모든 핵심 조작은 52px 이상이다.
- 원본은 `public/png/`, 서비스본은 `public/webp/`; WebP 우선·PNG 폴백이다.
- 접근성·TTS·키보드·reduced-motion을 유지한다.

### Task 1: 컷 기반 공통 UI와 에셋 로더

**Files:** Create `src/components/ComicPanel.tsx`, `src/components/StoryAsset.tsx`; modify `src/index.css`, `scripts/check-ui-polish.mjs`.

- [ ] 컷 테두리·꼬리 말풍선·엔딩 패널의 공통 클래스와 reduced-motion 규칙을 추가한다.
- [ ] `StoryAsset`에 `webpSrc`, `pngSrc`, `alt`를 전달하고 WebP 오류 때 PNG를 로드한다.
- [ ] 회귀 스크립트에 모바일 컷 클래스·WebP 폴백 표식을 추가한다.
- [ ] lint·encoding·build 후 커밋한다.

### Task 2: 목차와 모듈을 시즌 지도 UX로 전환

**Files:** Modify `src/views/ContentsView.tsx`; create `src/components/SeasonMap.tsx`.

- [ ] 이어하기 카드를 ‘현재 에피소드’ 컷으로 바꾼다.
- [ ] 6개 모듈을 연재 에피소드 카드로 렌더하고, 현재 모듈만 차시 컷 목록을 연다.
- [ ] 모바일에서 에피소드 카드와 차시 행이 단일 열로 쌓이는지 확인한다.
- [ ] lint·encoding·build 후 커밋한다.

### Task 3: 차시·게임·AI 활동을 학습 컷으로 전환

**Files:** Modify `src/views/LessonView.tsx`, `src/components/Stage.tsx`, `src/components/PhoneFrame.tsx`, game components.

- [ ] Stage를 스플래시 컷으로, 본문·활동을 ComicPanel로 렌더한다.
- [ ] 활동 제목·질문·선택지·피드백을 분리하고 모바일에서는 단일 열로 고정한다.
- [ ] PhoneFrame은 아이미 신호 컷으로만 강조한다.
- [ ] lint·encoding·build 후 대표 차시의 390/768/1280px 화면을 확인하고 커밋한다.

### Task 4: 정리·보상·모듈 에셋

**Files:** Modify `src/views/LessonView.tsx`; add `public/png/`, `public/webp/` assets and generation prompts.

- [ ] 정리 화면을 도장·반응·다음 예고를 담은 엔딩 컷으로 재구성한다.
- [ ] 대표 모듈 표지와 차시 스플래시 컷을 생성하고 PNG 원본·WebP 서비스본을 쌍으로 저장한다.
- [ ] alt·대체 UI·이미지 오류 폴백을 확인한다.
- [ ] 전체 검증 후 커밋한다.
