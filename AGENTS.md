# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript application. Main source code lives in `src/`, with the entry point in `src/main.tsx` and the root app in `src/App.tsx`. Reusable UI components are in `src/components/`, page-level views are in `src/views/`, shared utilities are in `src/utils/`, tool registration code is in `src/tools/`, and structured content is in `src/data/`. Static tutorial images and other public assets live under `public/`. Utility scripts are in `scripts/`; generated production output is written to `dist/` and should not be edited directly. Skill-related working files are kept in `skill-work/`.

## Build, Test, and Development Commands

- `npm install`: install project dependencies from `package-lock.json`.
- `npm run dev`: start the Vite dev server on port `3000` and host `0.0.0.0`.
- `npm run build`: create a production build in `dist/`.
- `npm run preview`: serve the production build locally for inspection.
- `npm run lint`: run TypeScript type checking with `tsc --noEmit`.
- `npm run check:encoding`: run the repository encoding check script.

Set `GEMINI_API_KEY` in `.env.local` before using Gemini-backed features. Use `.env.example` as the template.

## Coding Style & Naming Conventions

Follow `.editorconfig`: UTF-8, LF line endings, final newline, 2-space indentation for TS/TSX/JS/JSON/Markdown/CSS/HTML, and 4-space indentation for Python. Use PascalCase for React components and view files, such as `TopNav.tsx` or `Resources.tsx`. Use camelCase for functions, variables, hooks, and utility filenames where appropriate. Prefer the existing `@/` alias for imports from `src/`.

## Testing Guidelines

No dedicated test framework is currently configured. Before submitting changes, run `npm run lint` and `npm run build`; for UI work, also run `npm run dev` and manually verify the affected flows. If tests are added later, place them near the code they cover using a clear pattern such as `ComponentName.test.tsx` or `utilityName.test.ts`.

## Commit & Pull Request Guidelines

This repository currently has no commit history, so use concise, imperative commit messages such as `Add resource filtering` or `Fix Gemini error handling`. Pull requests should include a short description, validation steps performed, linked issues when applicable, and screenshots or screen recordings for visual UI changes.

## Security & Configuration Tips

Do not commit `.env.local`, API keys, or generated logs. Keep secrets in local environment files only. Review `SECURITY.md` before changing authentication, external API calls, or data-handling behavior.
