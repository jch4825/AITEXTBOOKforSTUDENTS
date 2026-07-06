# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI 교과서 (AI Textbook for Students)** — 발달장애 학생을 위한 AI 학습 온라인 교과서. 원본 AI Bridge(교사 연수용)에서 파생하여 학습자를 학생으로 전환. 6모듈 68차시 + 인터랙티브 게임 위주.

배포: GitHub Pages — base path `/AITEXTBOOKforSTUDENTS/`

설계 spec: `docs/superpowers/specs/2026-06-30-student-textbook-design.md`
교육 업그레이드 spec: `docs/superpowers/specs/2026-07-06-education-upgrade-design.md`
교사 가이드: `docs/teacher-guide.md`

캐릭터·스토리 spec: `docs/superpowers/specs/2026-07-07-character-story-design.md`

현재 마일스톤: **콘텐츠 전량 완료 (68/68차시) + 관통 캐릭터·스토리 레이어 적용** — "AI 동아리"
4인 캐스트(강진우·서윤아·박민준쌤·아이미)가 사회상황이야기 방식으로 전 차시를 관통.
남은 것: 캐릭터 실제 일러스트 교체(현재 SVG), 실사용 교사 베타 검토.

## Commands

```bash
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production bundle → dist/
npm run preview      # Preview built app
npm run lint         # TypeScript type check only
npm run check:encoding  # Validate UTF-8 encoding
```

## Environment Setup

복사: `.env.example` → `.env`

```
GEMINI_API_KEY=<your key>
```

real-ai 차시(10차시)에서 사용. 키가 없으면 각 차시의 `fallbackResponse`로 우아하게 강등된다.
교사 모드 비번은 `VITE_TEACHER_MODE_PASSWORD` (같은 `.env`에서 주입).
런타임 키는 교사 모드(`?teacher=1`)에서 localStorage로도 등록 가능.

## Architecture (현재 — 콘텐츠 전량 완료)

```
src/
├── App.tsx                       — URL 기반 라우터 (home / lesson / teacher)
├── main.tsx                      — React 19 + Settings/Progress Provider 래핑
├── index.css                     — Pretendard, CSS 변수, 접근성 베이스
├── types.ts                      — Difficulty, FontSize, DictionaryEntry, LessonContent 등
├── views/
│   ├── Home.tsx                  — 단일 CTA + 전역 진도 카운트
│   ├── LessonView.tsx            — 차시 렌더 + 정리(wrap-up) 가상 최종 단계
│   └── TeacherView.tsx           — ?teacher=1 + 비번 게이트 — API 키·진도·학습목표 패널
├── components/
│   ├── TopBar.tsx                — 브레드크럼 + TTS/Font/Difficulty/Dict 4토글
│   ├── SidebarTree.tsx           — 6모듈 68차시 진도 점 트리
│   ├── MicroLessonFrame.tsx      — 3단 PC 레이아웃 골격 + 사전 이벤트 위임
│   ├── DictionaryPanel.tsx       — 우측 사전 패널 + 검색 + TTS
│   ├── DictionaryTerm.tsx        — 점선 밑줄 표제어 (data-dict-term 위임)
│   ├── ProgressDots.tsx          — 차시 내 단계 인디케이터
│   ├── ErrorMessage.tsx          — 학생 1줄 + 교사 상세 2단
│   ├── RealAIStep.tsx            — real-ai step 렌더 (아이미 말풍선 + fallback)
│   ├── MicButton.tsx             — STT 마이크 버튼 (real-ai 자유입력용)
│   ├── CharacterAvatar.tsx       — 4인 SVG 아바타 (표정 variant) — 캐릭터 비주얼 단일 지점
│   ├── SpeechBubble.tsx          — 캐릭터 말풍선 (이름표 + TTS)
│   ├── StoryIntroCard.tsx        — 차시 도입 장면 카드 (사회상황이야기)
│   ├── controls/                 — TTS/FontSize/Difficulty/DictionaryTrigger
│   └── games/                    — OXGame, CardPick, Matching, Sequence
├── context/
│   ├── SettingsContext.tsx       — difficulty · fontSize · ttsEnabled
│   └── ProgressContext.tsx       — completedLessons (localStorage 동기화)
├── data/
│   ├── modules.ts                — 6모듈 메타 + lessonIds/moduleIdFromLessonId 헬퍼
│   ├── lessons/m1.ts ~ m6.ts     — 정식 68차시 (모듈별 파일, index.ts에서 집계)
│   ├── characters.ts             — AI 동아리 캐릭터 메타 (jinwoo·yoona·minjun·aimi)
│   ├── story.ts                  — 사회상황이야기 레이어: MODULE_EPISODES + LESSON_STORIES (68차시 전량)
│   └── studentDictionary.ts      — 학생용 사전 52개 항목 (차시 dictionaryTerms 전량 커버)
├── hooks/useSpeak.ts             — TTS 래퍼 (Settings 감안)
└── utils/
    ├── tts.ts / stt.ts           — Web Speech API 래퍼 (TTS / STT)
    ├── gemini.ts                 — Gemini 호출 + 5-모델 폴백 + 안전 가드
    ├── apiKey.ts                 — 키 저장 (빌드타임 env + localStorage)
    ├── safetyFilter.ts           — 응답 금칙어 사후 필터
    ├── moduleThemes.ts           — 모듈별 컬러 + 이모지
    ├── storage.ts                — ai-students-progress localStorage
    └── teacherMode.ts            — ?teacher=1 + 비번 검증 + localStorage
```

**저장 키:** `ai-students-progress` (완료 차시), `ai-students-settings` (토글 상태), `ai-teacher-mode` (교사 인증).

**Lesson 스키마:** `LessonContent { id, moduleId, number, title, kind, objective, standards?, bodyEasy, bodyNormal, wrapUpEasy, wrapUpNormal, steps }`.
Step kinds: `text | ox | card-pick | matching | sequence | sim-ai | real-ai`.
- `objective`: 교사용 학습목표 ("~할 수 있다"), `standards`: 2022 개정 특수교육 기본교육과정 성취기준 `"[코드] 원문"` — 둘 다 학생 화면 비노출, TeacherView에서만 표시.
- `wrapUp*`: 차시 마지막 정리 화면("오늘 배운 것")에 표시 + 자동 TTS. 완료 마킹은 정리 화면에서.
- text step에 `dictionaryTerms: string[]`를 넣으면 본문 자동 점선 밑줄. **새 어휘는 반드시 studentDictionary.ts에도 등록.**
- real-ai step은 반드시 `fallbackResponse` 포함 (키 없는 교실 대응).
- 성취기준 코드는 임의 창작 금지 — special-edu-curriculum-finder 스킬로 검증된 것만 사용 (검증된 풀: `docs/superpowers/plans/2026-07-06-education-upgrade.md`).

**스토리 레이어 규칙:** 차시를 추가하면 `story.ts`의 `LESSON_STORIES`에도 반드시 항목 추가
(scene 1~2명, introEasy/introNormal, reaction). 사회상황이야기 작법: 서술+관점 문장, 지시는
부드럽게("~하면 좋아요"). AI 응답은 전부 아이미 화자 — Gemini 시스템 프롬프트에 페르소나 포함.
캐릭터 비주얼 변경은 CharacterAvatar.tsx 한 곳에서만. 애니메이션은 1회성 fade-in만 허용
(반복·점멸 금지 — 저자극 원칙).

## Key Constraints

- **UTF-8 필수** (한국어 콘텐츠) — `npm run check:encoding`
- **Strict TypeScript** — `tsc --noEmit` 통과 필수
- **No test framework** — 수동 검증
- **PC 우선** (1280px+), 모바일은 부차적
- **학생에게 API 키·기술 용어 노출 금지** — 교사 영역
