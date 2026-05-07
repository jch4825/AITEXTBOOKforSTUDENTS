# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**AI Bridge: Zero-Gap Toolkit** — An educational web platform for Korean elementary school teachers to learn AI literacy. Covers LLM fundamentals, prompt engineering, classroom integration, school admin automation, and AI ethics through 5 modules (34 lessons) and 19 pre-built AI tools.

Deployed to GitHub Pages: base path is `/AI_bridge_test_v0.1/`

## Commands

```bash
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production bundle → dist/
npm run preview      # Preview built app
npm run lint         # TypeScript type check only (no ESLint)
npm run check:encoding  # Validate UTF-8 encoding across source files
npm run clean        # Remove dist/
```

No test framework is configured.

## Environment Setup

Copy `.env.example` → `.env` and set:

```
GEMINI_API_KEY=<your key from Google AI Studio>
```

The app tries `gemini-3-flash-preview` first, then falls back to `gemini-2.5-flash` — see `src/utils/gemini.ts`.

## Architecture

### Routing & State

`src/App.tsx` is the app shell. Routing is manual — no React Router. `currentView` state drives which view renders (`home | resources | tools | tutorial`). Lesson progress is persisted to `localStorage` key `ai-teachers-progress`. URL params (`?lesson=...`) are used for deep-linking into lessons.

### Views (`src/views/`)

- `Home.tsx` — Landing page with 3 CTA sections
- `Tutorial.tsx` — Lesson viewer; largest file (~67k lines). Handles all 5 modules, AI interactive exercises, text-to-speech
- `QuickTools.tsx` / `ToolPage.tsx` — Tool launcher/detail; reads from `ToolRegistry`
- `Module4Components.tsx` / `Module5Components.tsx` — Self-contained interactive lesson components for modules 4 and 5 (these are deliberately large; don't refactor without understanding the lesson structure)
- `Resources.tsx` — Curated resource directory

### Data Layer

- `src/data/tutorialData.ts` — All 5 modules and 34 lessons defined as TypeScript objects (Markdown content inline)
- `src/tools/ToolRegistry.ts` — 19 tool definitions with system prompts, input schemas, categories (~29k lines)
- `src/data/curriculumStandards.json` — 611 Korean 2022 curriculum standards (43k lines); queried by `src/utils/curriculumLookup.ts`

### Gemini Integration

All API calls go through `@google/genai`. The `ToolDefinition.kind` field determines behavior:
- `'api'` — submits user inputs + `systemPrompt` to Gemini
- `'external'` — opens an external URL

Tool inputs support `enrichWith: 'curriculumStandard'` to inject curriculum context into prompts automatically.

### Types

All shared interfaces are in `src/types.ts`: `ViewType`, `Resource`, `Module`, `Lesson`, `ToolDefinition`, `ToolInput`.

### Theming

Module colors are centralized in `src/utils/moduleThemes.ts` (5 modules → accent color, gradient, emoji). Global CSS custom properties (`--canva-teal`, `--canva-purple`, etc.) are defined in `src/index.css`.

## Key Constraints

- **Encoding**: All source files must be UTF-8 (Korean content). Run `npm run check:encoding` after adding files.
- **Strict TypeScript**: `tsc --noEmit` must pass. No ESLint is configured.
- **No test suite**: Verification is manual via `npm run dev`.
- **Large files are intentional**: `Tutorial.tsx`, `Module4Components.tsx`, `Module5Components.tsx`, and `ToolRegistry.ts` are large by design — they embed lesson content and system prompts directly. Avoid splitting unless there's a clear need.
- **State is prop-drilled**: No Context API is used. `App.tsx` owns top-level state and passes handlers down.

## Pending Fixes

안정성 분석(2026-05-01)에서 발견된 미수정 항목. 수정 완료 시 해당 항목 삭제.

### 높음 — 런타임 크래시 위험

_모두 수정 완료 (2026-05-01)_

### 중간 — 사용자 오작동

_모두 수정 완료 (2026-05-01)_

### 낮음 — 코드 품질

_모두 수정 완료 (2026-05-01)_
