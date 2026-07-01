# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI 교과서 (AI Textbook for Students)** — 발달장애 학생을 위한 AI 학습 온라인 교과서. 원본 AI Bridge(교사 연수용)에서 파생하여 학습자를 학생으로 전환. 6모듈 68차시 + 인터랙티브 게임 위주.

배포: GitHub Pages — base path `/AITEXTBOOKforSTUDENTS/`

설계 spec: `docs/superpowers/specs/2026-06-30-student-textbook-design.md`
현재 마일스톤: **M2 완료 → M3 준비** — 모듈 1 (AI가 뭐야?) 11차시 시뮬레이션 콘텐츠 작성 완료. 다음은 모듈 2 (실제 Gemini 호출 도입).

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

현재는 미사용. M3(모듈 2 — 실제 Gemini 호출 도입) 시점부터 필요.
교사 모드 비번은 `VITE_TEACHER_MODE_PASSWORD` (같은 `.env`에서 주입).

## Architecture (현재 — M1 완료)

```
src/
├── App.tsx                       — URL 기반 라우터 (home / lesson / teacher)
├── main.tsx                      — React 19 + Settings/Progress Provider 래핑
├── index.css                     — Pretendard, CSS 변수, 접근성 베이스
├── types.ts                      — Difficulty, FontSize, DictionaryEntry, DemoLesson 등
├── views/
│   ├── Home.tsx                  — 단일 CTA + 전역 진도 카운트
│   ├── LessonView.tsx            — 데모 차시 렌더 (미구현 차시는 "곧 열려요" placeholder)
│   └── TeacherView.tsx           — ?teacher=1 진입 + 비번 게이트 (관리 셸은 더미)
├── components/
│   ├── TopBar.tsx                — 브레드크럼 + TTS/Font/Difficulty/Dict 4토글
│   ├── SidebarTree.tsx           — 6모듈 68차시 진도 점 트리
│   ├── MicroLessonFrame.tsx      — 3단 PC 레이아웃 골격 + 사전 이벤트 위임
│   ├── DictionaryPanel.tsx       — 우측 사전 패널 + 검색 + TTS
│   ├── DictionaryTerm.tsx        — 점선 밑줄 표제어 (data-dict-term 위임)
│   ├── ProgressDots.tsx          — 차시 내 단계 인디케이터
│   ├── ErrorMessage.tsx          — 학생 1줄 + 교사 상세 2단
│   ├── controls/                 — TTS/FontSize/Difficulty/DictionaryTrigger
│   └── games/                    — OXGame, CardPick, Matching
├── context/
│   ├── SettingsContext.tsx       — difficulty · fontSize · ttsEnabled
│   └── ProgressContext.tsx       — completedLessons (localStorage 동기화)
├── data/
│   ├── modules.ts                — 6모듈 메타 + lessonIds/moduleIdFromLessonId 헬퍼
│   ├── lessons/m1.ts             — 모듈 1 정식 11차시 (M1_LESSONS + getLesson)
│   └── studentDictionary.ts      — 학생용 사전 항목 (m1 어휘 15개)
├── hooks/useSpeak.ts             — TTS 래퍼 (Settings 감안)
└── utils/
    ├── tts.ts                    — Web Speech API 브라우저 shim
    ├── stt.ts                    — STT 래퍼 (M3부터 사용)
    ├── moduleThemes.ts           — 모듈별 컬러 + 이모지
    ├── storage.ts                — ai-students-progress localStorage
    └── teacherMode.ts            — ?teacher=1 + 비번 검증 + localStorage
```

**저장 키:** `ai-students-progress` (완료 차시), `ai-students-settings` (토글 상태), `ai-teacher-mode` (교사 인증).

**Lesson 스키마:** `LessonContent { id, moduleId, number, title, kind, bodyEasy, bodyNormal, steps }`. Step kinds: `text | ox | card-pick | matching | sim-ai`. text step에 `dictionaryTerms: string[]`를 넣으면 본문에서 자동으로 점선 밑줄 처리.

## M3에서 손댈 예정 (참고)

- `src/data/lessons/m2.ts` 신설, 모듈 2 11차시 (프롬프트 입문)
- 실제 Gemini 호출 도입 — `src/utils/gemini.ts` + 안전 가드 (길이 제한, 금칙어 필터, 15s 타임아웃)
- STT 첫 실제 사용 (Web Speech API — 지금은 스텁만)
- 학생용 오류 메시지 2단 구조 (`ErrorMessage`) 실사용
- 모델 폴백 (3.5-flash → 3.1-flash-lite → 2.5-flash → 2.5-flash-lite)

## Key Constraints

- **UTF-8 필수** (한국어 콘텐츠) — `npm run check:encoding`
- **Strict TypeScript** — `tsc --noEmit` 통과 필수
- **No test framework** — 수동 검증
- **PC 우선** (1280px+), 모바일은 부차적
- **학생에게 API 키·기술 용어 노출 금지** — 교사 영역
