# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI 교과서 (AI Textbook for Students)** — 발달장애 학생을 위한 AI 학습 온라인 교과서. 원본 AI Bridge(교사 연수용)에서 파생하여 학습자를 학생으로 전환. 6모듈 68차시 + 인터랙티브 게임 위주.

배포: GitHub Pages — base path `/AITEXTBOOKforSTUDENTS/`

설계 spec: `docs/superpowers/specs/2026-06-30-student-textbook-design.md`
현재 마일스톤: **M0 (정리 & 초기화)** 진행 중 — 코드베이스를 비우고 신규 레포에 첫 배포

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

M0 단계에서는 사용하지 않음. M3(모듈 2)부터 실제 AI 호출 시 필요.

## Architecture (현재 — M0 스텁)

```
src/
├── App.tsx       — "준비 중" 페이지 스텁
├── main.tsx      — React 19 bootstrap
├── index.css     — 최소 base CSS
└── types.ts      — Difficulty, FontSize
```

M1부터 spec 기반으로 새 아키텍처 구축:
- 3단 PC 레이아웃 (좌 트리 / 중앙 본문 / 우 사전)
- SidebarTree, DictionaryPanel, MicroLessonFrame 등 컴포넌트
- 학생 진도 저장 키: `ai-students-progress`

## Key Constraints

- **UTF-8 필수** (한국어 콘텐츠) — `npm run check:encoding`
- **Strict TypeScript** — `tsc --noEmit` 통과 필수
- **No test framework** — 수동 검증
- **PC 우선** (1280px+), 모바일은 부차적
- **학생에게 API 키·기술 용어 노출 금지** — 교사 영역
