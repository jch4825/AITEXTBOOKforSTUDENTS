# M0 — 정리 & 초기화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 원본 AI Bridge(교사용) 코드베이스를 깨끗이 비우고, 학생용 신규 GitHub 레포(`AITEXTBOOKforSTUDENTS`)에 빈 껍데기 형태로 첫 배포까지 완료한다.

**Architecture:** "초토화 후 빌드 통과" 전략. `src/`에서 `main.tsx`, `App.tsx`(스텁), `index.css`(최소), `types.ts`(최소)만 남기고 나머지 전부 삭제. 모든 교사용 콘텐츠·도구·링크도서관·진단·교육과정·모니터링·일러스트 제거. M1에서 새 아키텍처로 재구축할 때 git history에서 재활용 가능.

**Tech Stack:** Vite 6, React 19, TypeScript 5.8, Tailwind 4, GitHub Pages, GitHub Actions

**Gate (단계 완료 기준):** `npm run build` 통과 + 신규 레포에 푸시 + GitHub Pages에 "준비 중" 페이지 배포 성공.

---

## 파일 구조 (M0 종료 시점)

```
AITEXTBOOKforSTUDENTS/
├── .env.example                      # GEMINI_API_KEY 한 줄만
├── .github/workflows/deploy.yml      # 신규: Pages 배포 워크플로우
├── .gitignore                        # 유지 + 정리
├── AGENTS.md                         # 유지 (있다면 학생용으로 간소화)
├── CLAUDE.md                         # 신규 재작성 (학생용)
├── README.md                         # 신규 재작성 (학생용)
├── SECURITY.md                       # 유지
├── docs/
│   └── superpowers/
│       ├── plans/2026-06-30-m0-cleanup-and-init.md  # 이 문서
│       └── specs/2026-06-30-student-textbook-design.md  # 기존 spec
├── index.html                        # 학생용 최소 메타로 교체
├── package.json                      # name + scripts 정리
├── package-lock.json
├── public/
│   └── robots.txt                    # 유지 (나머지 전부 삭제)
├── scripts/
│   └── check-encoding.mjs            # 유지 (나머지 전부 삭제)
├── src/
│   ├── App.tsx                       # "준비 중" 스텁
│   ├── index.css                     # 최소 base (Tailwind import + 폰트)
│   ├── main.tsx                      # 유지
│   └── types.ts                      # 최소 (Difficulty, FontSize)
├── tsconfig.json                     # 유지
└── vite.config.ts                    # base: '/AITEXTBOOKforSTUDENTS/'
```

**삭제 대상 요약:** `src/views/`, `src/data/`, `src/tools/`, `src/services/`, `src/components/`, `src/hooks/`, `src/utils/`, `monitor-state.json`, `monitor-prompts/`, `health-reports/`, `pending-resources/`, `public/tutorial-visuals/`, `public/{Bing,google,naver,rss,sitemap}.*`, `dist/`, 로그 파일, `fix-request-2026-06-10.md`, `diagnostis.md`, `docs/code-review/`, `docs/presentation-scenario.md`, `docs/superpowers/plans/` 중 spec 외 모든 기존 plan/spec.

---

## Task 1: 작업 안전망 — 현재 상태 확인 + git 백업 브랜치

**Files:**
- 변경 없음 (git만 조작)

- [ ] **Step 1: 작업 트리 상태 확인**

```bash
cd C:/AI/AITEXTBOOKforSTUDENTS
git status --short
git log -1 --oneline
git branch --show-current
```
Expected: 현재 브랜치 `main`, 최신 커밋이 spec 추가 커밋(`df649df`)임을 확인.

- [ ] **Step 2: 안전망 브랜치 생성 (M0 작업 전 원본 보존)**

```bash
git branch backup-pre-m0
git branch --list
```
Expected: `backup-pre-m0`, `main` 둘 다 보임. 이후 만일에 대비.

- [ ] **Step 3: 커밋되지 않은 변경사항 처리**

`git status`에 나오는 추적되지 않은 파일들(`docs/code-review/`, `docs/presentation-scenario.md`, `docs/superpowers/plans/*`, `fix-request-2026-06-10.md`)은 다음 Task들에서 삭제 대상이므로 그대로 두고 진행. 단, 우리가 방금 만든 spec과 M0 계획은 커밋되어 있어야 함:

```bash
git log --oneline -3
```
Expected: 최근 커밋에 spec 파일이 들어가 있음. 들어가 있지 않다면 먼저 spec/plan 커밋.

---

## Task 2: git remote 변경 + 신규 레포 연결 확인

**Files:**
- 변경 없음 (git remote만 조작)

- [ ] **Step 1: 기존 remote 확인**

```bash
git remote -v
```
Expected: `origin  https://github.com/jch4825/AI_Bridge.git`

- [ ] **Step 2: remote URL 변경**

```bash
git remote set-url origin https://github.com/jch4825/AITEXTBOOKforSTUDENTS.git
git remote -v
```
Expected: 두 줄 모두 `AITEXTBOOKforSTUDENTS.git`로 바뀜.

- [ ] **Step 3: 신규 레포 접근성 확인**

```bash
git ls-remote --heads origin
```
Expected: 빈 출력 (레포가 비어 있으므로 브랜치 없음). 에러 나면 GitHub 권한 점검.

- [ ] **Step 4: 커밋 (이 단계는 commit 변경이 없으므로 스킵)**

`git remote set-url`은 `.git/config`만 바꿈 → 커밋 없음. 다음 Task로.

---

## Task 3: 로그·잡파일 정리 (루트)

**Files:**
- Delete: `dev-server.err`, `dev-server.log`, `dev-server.out`
- Delete: `vite-dev-dict.err.log`, `vite-dev-dict.out.log`
- Delete: `vite-dev.err.log`, `vite-dev.log`
- Delete: `vite.stderr.log`, `vite.stdout.log`
- Delete: `dist/`
- Delete: `diagnostis.md`
- Delete: `fix-request-2026-06-10.md`
- Delete: `google4628e68146be65b9.html`, `naver2e604a482b87d00a949d4d0b6730782f.html`
- Delete: `metadata.json` (Vite 분석용, 학생 빌드에 불필요)

- [ ] **Step 1: 루트 로그·잡파일 일괄 삭제**

```bash
cd C:/AI/AITEXTBOOKforSTUDENTS
rm -f dev-server.err dev-server.log dev-server.out
rm -f vite-dev-dict.err.log vite-dev-dict.out.log
rm -f vite-dev.err.log vite-dev.log
rm -f vite.stderr.log vite.stdout.log
rm -rf dist/
rm -f diagnostis.md fix-request-2026-06-10.md
rm -f google4628e68146be65b9.html naver2e604a482b87d00a949d4d0b6730782f.html
rm -f metadata.json
ls *.log *.err *.out 2>&1 | head
```
Expected: `No such file or directory` 또는 빈 출력.

- [ ] **Step 2: 커밋**

```bash
git add -A
git commit -m "chore(m0): remove root-level logs, dist, stale verification files"
```

---

## Task 4: 도구(Tools) 관련 전체 삭제

**Files:**
- Delete: `src/views/QuickTools.tsx`
- Delete: `src/views/ToolPage.tsx`
- Delete: `src/tools/` (디렉토리 전체)
- Delete: `src/hooks/useFavoritesList.ts` (도구 즐겨찾기 전용)

- [ ] **Step 1: 도구 관련 파일·디렉토리 삭제**

```bash
rm -f src/views/QuickTools.tsx src/views/ToolPage.tsx
rm -rf src/tools/
rm -f src/hooks/useFavoritesList.ts
ls src/views/ src/tools/ 2>&1 | head
```
Expected: `QuickTools.tsx`, `ToolPage.tsx` 없음. `src/tools/`는 `No such file or directory`.

- [ ] **Step 2: 커밋**

```bash
git add -A
git commit -m "chore(m0): delete tools (QuickTools, ToolPage, ToolRegistry, favorites)"
```

---

## Task 5: 링크도서관(Resources) 전체 삭제

**Files:**
- Delete: `src/views/Resources.tsx`
- Delete: `src/data/resourcesData.ts`

- [ ] **Step 1: 파일 삭제**

```bash
rm -f src/views/Resources.tsx src/data/resourcesData.ts
ls src/views/ | grep -i resource
ls src/data/ | grep -i resource
```
Expected: 둘 다 빈 출력.

- [ ] **Step 2: 커밋**

```bash
git add -A
git commit -m "chore(m0): delete Resources view and resourcesData"
```

---

## Task 6: 진단 플로우 전체 삭제

**Files:**
- Delete: `src/components/onboarding/` (DiagnosticModal, PersonaRecommendCard)
- Delete: `src/data/diagnosticQuestions.ts`
- Delete: `src/data/moduleVisibility.ts`
- Delete: `src/services/diagnostic.ts`

- [ ] **Step 1: 진단 관련 파일·디렉토리 삭제**

```bash
rm -rf src/components/onboarding/
rm -f src/data/diagnosticQuestions.ts src/data/moduleVisibility.ts
rm -f src/services/diagnostic.ts
ls src/components/onboarding/ 2>&1 | head
ls src/data/ | grep -Ei 'diagnostic|visibility'
ls src/services/ | grep -i diagnostic
```
Expected: 모두 빈 출력 또는 `No such file or directory`.

- [ ] **Step 2: 커밋**

```bash
git add -A
git commit -m "chore(m0): delete diagnostic flow (onboarding, questions, persona, visibility)"
```

---

## Task 7: 교육과정 데이터 + 룩업 삭제

**Files:**
- Delete: `src/data/curriculumStandards.json` (43k 줄)
- Delete: `src/utils/curriculumLookup.ts`

- [ ] **Step 1: 삭제**

```bash
rm -f src/data/curriculumStandards.json src/utils/curriculumLookup.ts
ls src/data/ | grep -i curriculum
ls src/utils/ | grep -i curriculum
```
Expected: 둘 다 빈 출력.

- [ ] **Step 2: 커밋**

```bash
git add -A
git commit -m "chore(m0): delete curriculum standards data and lookup"
```

---

## Task 8: 모니터링 시스템 삭제

**Files:**
- Delete: `monitor-state.json`
- Delete: `monitor-prompts/` (디렉토리)
- Delete: `health-reports/` (디렉토리, 있다면)
- Delete: `pending-resources/` (디렉토리, 있다면)

- [ ] **Step 1: 모니터링 산출물 삭제**

```bash
rm -f monitor-state.json
rm -rf monitor-prompts/ health-reports/ pending-resources/
ls monitor-* health-* pending-* 2>&1 | head
```
Expected: `No such file or directory`.

- [ ] **Step 2: 커밋**

```bash
git add -A
git commit -m "chore(m0): remove monitoring system (monitor-state, prompts, reports, pending)"
```

---

## Task 9: 일러스트 + 교사용 public 파일 + scripts 정리

**Files:**
- Delete: `public/tutorial-visuals/` (module0~5 일러스트)
- Delete: `public/BingSiteAuth.xml`, `public/google4628e68146be65b9.html`, `public/naver2e604a482b87d00a949d4d0b6730782f.html`
- Delete: `public/rss.xml`, `public/sitemap.xml`
- Delete: `scripts/analyze-bundle.mjs`, `scripts/csv_to_json.py`, `scripts/expand_curriculum_xlsx.py`, `scripts/export_resources_xlsx.py`, `scripts/export_tools_manifest.ts`, `scripts/export_tools_xlsx.py`, `scripts/test-a11y-normalization.ts`, `scripts/test-learning-dictionary.ts`
- Keep: `public/robots.txt`, `scripts/check-encoding.mjs`

- [ ] **Step 1: public 정리**

```bash
rm -rf public/tutorial-visuals/
rm -f public/BingSiteAuth.xml public/google4628e68146be65b9.html public/naver2e604a482b87d00a949d4d0b6730782f.html
rm -f public/rss.xml public/sitemap.xml
ls public/
```
Expected: `robots.txt`만 남음.

- [ ] **Step 2: scripts 정리**

```bash
rm -f scripts/analyze-bundle.mjs scripts/csv_to_json.py scripts/expand_curriculum_xlsx.py
rm -f scripts/export_resources_xlsx.py scripts/export_tools_manifest.ts scripts/export_tools_xlsx.py
rm -f scripts/test-a11y-normalization.ts scripts/test-learning-dictionary.ts
ls scripts/
```
Expected: `check-encoding.mjs`만 남음.

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "chore(m0): delete tutorial-visuals, teacher-only public files, obsolete scripts"
```

---

## Task 10: docs 정리

**Files:**
- Delete: `docs/code-review/` (디렉토리 전체)
- Delete: `docs/presentation-scenario.md`
- Delete: `docs/superpowers/plans/` 안에서 spec 외 기존 plan 전부 (`2026-05-22-link-library-recommendation-agent.md`, `2026-05-31-code-review-fixes.md`, `2026-06-11-robustness-hardening.md`)
- Delete: `docs/superpowers/specs/` 안에서 우리 spec 외 전부 (`2026-05-22-link-library-recommendation-agent-design.md`, `2026-05-23-jch4825-landing-design.md`, `2026-05-27-resources-quicktools-style-redesign.md`, `2026-06-02-module4-intro-popup-redesign-design.md`, `2026-06-03-l4-4-essay-grader-redesign-design.md`)
- Keep: `docs/superpowers/specs/2026-06-30-student-textbook-design.md`
- Keep: `docs/superpowers/plans/2026-06-30-m0-cleanup-and-init.md` (이 문서)

- [ ] **Step 1: 교사용 문서 삭제**

```bash
rm -rf docs/code-review/
rm -f docs/presentation-scenario.md
```

- [ ] **Step 2: 기존 plan/spec 중 학생용 외 전부 삭제**

```bash
rm -f docs/superpowers/plans/2026-05-22-link-library-recommendation-agent.md
rm -f docs/superpowers/plans/2026-05-31-code-review-fixes.md
rm -f docs/superpowers/plans/2026-06-11-robustness-hardening.md
rm -f docs/superpowers/specs/2026-05-22-link-library-recommendation-agent-design.md
rm -f docs/superpowers/specs/2026-05-23-jch4825-landing-design.md
rm -f docs/superpowers/specs/2026-05-27-resources-quicktools-style-redesign.md
rm -f docs/superpowers/specs/2026-06-02-module4-intro-popup-redesign-design.md
rm -f docs/superpowers/specs/2026-06-03-l4-4-essay-grader-redesign-design.md
ls docs/superpowers/plans/ docs/superpowers/specs/
```
Expected: plans/에는 `2026-06-30-m0-cleanup-and-init.md`만. specs/에는 `2026-06-30-student-textbook-design.md`만.

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "chore(m0): purge teacher-era docs, plans, specs (keep student-textbook artifacts)"
```

---

## Task 11: src/views, src/components, src/hooks, src/services 잔여 삭제

이전 Task에서 일부만 지웠으므로 나머지를 한번에 처리.

**Files:**
- Delete: `src/views/Home.tsx`, `src/views/Tutorial.tsx`, `src/views/Module0Components.tsx`, `src/views/Module4Components.tsx`, `src/views/Module5Components.tsx`
- Delete: `src/components/Sidebar.tsx`, `src/components/AccessibilityWidget.tsx`, `src/components/BugReportModal.tsx`, `src/components/CopyButton.tsx`, `src/components/SpeakButton.tsx`
- Delete: `src/hooks/useExternalStorageState.ts` (마지막 hook 잔여 → 디렉토리도 삭제)
- Delete: `src/services/storage.ts`, `src/services/bugReport.ts`
- Delete: `src/data/tutorialData.ts`
- Delete: `src/utils/a11y.ts`, `src/utils/apiError.ts`, `src/utils/gemini.ts`, `src/utils/geminiConstants.ts`, `src/utils/learningDictionary.ts`, `src/utils/moduleThemes.ts`, `src/utils/rehypeTableLabels.ts`

→ M1에서 git history에서 필요한 부분만 골라 재도입.

- [ ] **Step 1: views 비우기**

```bash
rm -rf src/views/
ls src/views/ 2>&1 | head
```
Expected: `No such file or directory`.

- [ ] **Step 2: components 비우기**

```bash
rm -rf src/components/
ls src/components/ 2>&1 | head
```
Expected: `No such file or directory`.

- [ ] **Step 3: hooks · services · 잔여 data 비우기**

```bash
rm -rf src/hooks/ src/services/
rm -rf src/data/
ls src/hooks/ src/services/ src/data/ 2>&1 | head
```
Expected: 모두 `No such file or directory`.

- [ ] **Step 4: utils 비우기**

```bash
rm -rf src/utils/
ls src/utils/ 2>&1 | head
```
Expected: `No such file or directory`.

- [ ] **Step 5: 남은 src 확인**

```bash
ls src/
```
Expected: `App.tsx`, `index.css`, `main.tsx`, `types.ts` 4개만 (현재 시점에서는 이 파일들도 깨진 상태일 수 있음).

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "chore(m0): scorched earth — remove all views/components/hooks/services/utils/data

M1 will rebuild from spec with student-first architecture."
```

---

## Task 12: types.ts를 최소 스텁으로 교체

**Files:**
- Modify: `src/types.ts`

- [ ] **Step 1: 기존 내용 확인 (참고용)**

```bash
head -20 src/types.ts
```
Expected: `Persona`, `DiagnosticPurpose`, `ViewType`, `Module` 같은 교사용 타입들.

- [ ] **Step 2: 전체 교체 — 학생용 최소 타입만 정의**

`src/types.ts`를 다음 내용으로 완전 교체:

```ts
export type Difficulty = 'easy' | 'normal';
export type FontSize = 'normal' | 'large';
```

- [ ] **Step 3: 커밋**

```bash
git add src/types.ts
git commit -m "chore(m0): replace types.ts with minimal student-side types (Difficulty, FontSize)"
```

---

## Task 13: App.tsx를 "준비 중" 스텁으로 교체

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: 전체 교체**

`src/App.tsx`를 다음 내용으로 완전 교체:

```tsx
export default function App() {
  return (
    <div className="app-stub">
      <main>
        <h1>AI 교과서</h1>
        <p className="lead">곧 만나요. 지금은 준비 중이에요.</p>
        <p className="sub">발달장애 학생을 위한 AI 학습 교과서</p>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/App.tsx
git commit -m "chore(m0): replace App.tsx with placeholder landing"
```

---

## Task 14: index.css를 최소 base로 교체

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: 전체 교체 — Tailwind import 제거(M1에서 다시 도입), 기본 폰트·색상만**

`src/index.css`를 다음 내용으로 완전 교체:

```css
:root {
  --bg: #f7f6f3;
  --fg: #2d2d2d;
  --accent: #5a4fcf;
}

html, body, #root {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif;
  background: var(--bg);
  color: var(--fg);
  line-height: 1.6;
}

.app-stub {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.app-stub main {
  text-align: center;
  max-width: 28rem;
}

.app-stub h1 {
  font-size: 2.5rem;
  margin: 0 0 1rem;
  color: var(--accent);
}

.app-stub .lead {
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
}

.app-stub .sub {
  font-size: 1rem;
  margin: 0;
  opacity: 0.7;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/index.css
git commit -m "chore(m0): minimal stub CSS — Tailwind reintroduced in M1"
```

---

## Task 15: main.tsx 확인 + 필요시 정리

**Files:**
- Modify (필요시): `src/main.tsx`

- [ ] **Step 1: 현재 main.tsx 확인**

```bash
cat src/main.tsx
```
Expected: `createRoot`로 `App`을 렌더하는 표준 Vite + React 19 부트스트랩. 외부 import가 있다면(예: `motion`, 폰트 import) 정리 필요.

- [ ] **Step 2: 필요시 다음 내용으로 교체**

`src/main.tsx`가 다음과 다르면 교체:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: 변경했다면 커밋**

```bash
git add src/main.tsx
git commit -m "chore(m0): simplify main.tsx to standard React 19 bootstrap"
```

변경 없었다면 스킵.

---

## Task 16: vite.config.ts base path 변경 + 의존성 정리

**Files:**
- Modify: `vite.config.ts`

- [ ] **Step 1: 새 base path 적용 + visualizer 제거 (의존성 줄이기)**

`vite.config.ts`를 다음 내용으로 교체:

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/AITEXTBOOKforSTUDENTS/',

  plugins: [
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    host: true,
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
```

- [ ] **Step 2: 커밋**

```bash
git add vite.config.ts
git commit -m "chore(m0): set base path to /AITEXTBOOKforSTUDENTS/ and drop visualizer plugin"
```

---

## Task 17: package.json 정리 (이름·의존성)

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 전체 교체**

`package.json`을 다음 내용으로 교체:

```json
{
  "name": "ai-textbook-for-students",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "clean": "rm -rf dist",
    "lint": "tsc --noEmit",
    "check:encoding": "node scripts/check-encoding.mjs"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@types/node": "^22.14.0",
    "@vitejs/plugin-react": "^5.0.4",
    "autoprefixer": "^10.4.21",
    "dotenv": "^17.2.3",
    "tailwindcss": "^4.1.14",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

제거된 의존성 (M1·M3에서 필요 시 재추가):
- `@google/genai` — M3에서 실제 AI 호출 도입 시 재추가
- `lucide-react`, `motion` — M1 UI 작업 시 재평가
- `react-markdown`, `remark-gfm` — M2 콘텐츠 렌더 시 재추가
- `rollup-plugin-visualizer` — 분석 시 일회성으로
- `@types/express`, `express`, `tsx` — 기존 스크립트 용도, 불필요

- [ ] **Step 2: node_modules 갱신**

```bash
rm -rf node_modules package-lock.json
npm install
```
Expected: 새 lock 생성, 의존성 트리 크게 축소.

- [ ] **Step 3: 커밋**

```bash
git add package.json package-lock.json
git commit -m "chore(m0): rename to ai-textbook-for-students, prune deps to React+Vite+Tailwind"
```

---

## Task 18: index.html 학생용 최소 메타로 교체

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 전체 교체 — 모든 교사용 SEO/og/jsonld 제거**

`index.html`을 다음 내용으로 완전 교체:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AI 교과서 — 발달장애 학생을 위한 AI 학습</title>
    <meta name="description" content="발달장애 학생을 위한 AI 학습 온라인 교과서입니다." />
    <meta name="theme-color" content="#5a4fcf" />
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <p>이 사이트는 자바스크립트가 필요합니다.</p>
    </noscript>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: 커밋**

```bash
git add index.html
git commit -m "chore(m0): strip teacher SEO from index.html, minimal student-facing meta"
```

---

## Task 19: CLAUDE.md를 학생용으로 재작성

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: 전체 교체**

`CLAUDE.md`를 다음 내용으로 완전 교체:

````markdown
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
````

- [ ] **Step 2: 커밋**

```bash
git add CLAUDE.md
git commit -m "docs(m0): rewrite CLAUDE.md for student textbook project"
```

---

## Task 20: README.md를 학생용으로 재작성

**Files:**
- Modify: `README.md`

- [ ] **Step 1: 전체 교체**

`README.md`를 다음 내용으로 완전 교체:

````markdown
# AI 교과서 — 발달장애 학생을 위한 AI 학습

발달장애 학생이 인공지능을 안전하고 즐겁게 배울 수 있도록 만든 온라인 교과서입니다.

## 모듈

1. **AI가 뭐야?** — 개념 이해
2. **AI랑 말해보기** — 대화와 프롬프트
3. **AI랑 같이 배우기** — 학습 활용
4. **AI 안전하게 쓰기** — 안전·윤리·자기보호
5. **AI로 문제해결하기** — 논리·사고력
6. **AI랑 일상생활** — 직업·생활 실전

## 시작

```bash
npm install
npm run dev
```

`http://localhost:3000` 에서 확인.

## 배포

- GitHub Pages — `https://jch4825.github.io/AITEXTBOOKforSTUDENTS/`
- `main` 브랜치 push 시 자동 빌드·배포 (GitHub Actions)

## 설계 문서

- 전체 설계: `docs/superpowers/specs/2026-06-30-student-textbook-design.md`
- M0 계획: `docs/superpowers/plans/2026-06-30-m0-cleanup-and-init.md`

## 라이선스

(추후 결정)
````

- [ ] **Step 2: 커밋**

```bash
git add README.md
git commit -m "docs(m0): rewrite README for student textbook"
```

---

## Task 21: AGENTS.md 정리

**Files:**
- Modify (또는 Delete): `AGENTS.md`

- [ ] **Step 1: 현재 내용 확인**

```bash
head -20 AGENTS.md
```

- [ ] **Step 2: 결정**

- 만약 AGENTS.md가 원본 AI Bridge 전용 내용이면 → 다음 한 줄로 교체:

```markdown
# Agents

이 프로젝트의 코딩 가이드는 `CLAUDE.md`를 참조하세요.
```

- 이미 일반적인 내용이면 그대로 둠.

- [ ] **Step 3: 변경했다면 커밋**

```bash
git add AGENTS.md
git commit -m "docs(m0): simplify AGENTS.md to point at CLAUDE.md"
```

---

## Task 22: .env.example 정리

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: 현재 내용 확인**

```bash
cat .env.example
```

- [ ] **Step 2: 다음 내용으로 교체**

```env
# Gemini API key — used from M3 onward. Leave blank for M0/M1/M2.
GEMINI_API_KEY=

# Teacher mode password — used from M1 onward (?teacher=1).
VITE_TEACHER_MODE_PASSWORD=
```

- [ ] **Step 3: 커밋**

```bash
git add .env.example
git commit -m "chore(m0): trim .env.example to student-stage keys (Gemini + teacher mode)"
```

---

## Task 23: .gitignore 정리

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: 현재 내용 확인**

```bash
cat .gitignore
```

- [ ] **Step 2: 다음 내용으로 교체 (모니터링 항목 제거)**

`.gitignore`를 다음 내용으로 교체:

```gitignore
# Dependencies
node_modules/

# Build output
dist/
*.local

# Editor
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Env
.env
.env.local
.env.*.local

# Logs
*.log
dev-server.*
vite-dev*.log
vite.std*.log
```

- [ ] **Step 3: 커밋**

```bash
git add .gitignore
git commit -m "chore(m0): clean .gitignore — drop monitoring entries, keep build/env/logs"
```

---

## Task 24: 빌드 검증

**Files:**
- 변경 없음 (검증만)

- [ ] **Step 1: 타입 체크 + 빌드**

```bash
cd C:/AI/AITEXTBOOKforSTUDENTS
npm run build
```
Expected: 에러 없이 `dist/`에 빌드 산출물 생성. 마지막 줄에 `✓ built in ...`.

- [ ] **Step 2: 빌드 산출물 확인**

```bash
ls dist/
```
Expected: `index.html`, `assets/`.

- [ ] **Step 3: 프리뷰로 실제 동작 확인**

```bash
npm run preview &
sleep 3
curl -s http://localhost:4173/AITEXTBOOKforSTUDENTS/ | head -20
```
Expected: `<title>AI 교과서` 가 포함된 HTML 응답.

종료:
```bash
pkill -f "vite preview" || true
```

- [ ] **Step 4: 검증 통과 — 커밋 없음 (코드 변경 없음)**

---

## Task 25: GitHub Pages 배포 워크플로우 추가

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 디렉토리 생성**

```bash
mkdir -p .github/workflows
ls -la .github/workflows/
```

- [ ] **Step 2: 워크플로우 파일 작성**

`.github/workflows/deploy.yml` 생성:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - uses: actions/configure-pages@v5

      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 3: 커밋**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci(m0): add GitHub Pages deploy workflow"
```

---

## Task 26: 신규 레포에 첫 푸시

**Files:**
- 변경 없음 (git push만)

- [ ] **Step 1: 최종 상태 점검**

```bash
git status
git log --oneline | head -20
ls
ls src/
```
Expected: `git status`는 clean. 커밋 로그에 M0 작업들이 시간순으로 보임. 루트와 src/는 위 "파일 구조" 섹션과 일치.

- [ ] **Step 2: 푸시**

```bash
git push -u origin main
```
Expected: 첫 푸시 성공 메시지. (원격이 비어 있으므로 강제 푸시 불필요.)

- [ ] **Step 3: GitHub에서 확인**

브라우저로 https://github.com/jch4825/AITEXTBOOKforSTUDENTS 열어 파일 트리가 올라갔는지 확인.

GitHub Actions 탭에서 "Deploy to GitHub Pages" 워크플로우가 도는지 확인.

---

## Task 27: GitHub Pages 활성화 + 배포 확인

**Files:**
- 변경 없음 (GitHub 설정만)

- [ ] **Step 1: GitHub Pages 설정**

브라우저로 다음 페이지 열기:

```
https://github.com/jch4825/AITEXTBOOKforSTUDENTS/settings/pages
```

- **Source**: `GitHub Actions` 선택 (Branch가 아님 — Actions 빌드 산출물을 직접 배포)
- 저장

- [ ] **Step 2: 워크플로우 재실행 (필요 시)**

설정 후 처음에는 첫 푸시의 워크플로우가 권한 부족으로 실패했을 수 있음.

```
https://github.com/jch4825/AITEXTBOOKforSTUDENTS/actions
```

가장 최근 실행을 열어 `Re-run all jobs` 클릭.

- [ ] **Step 3: 배포 URL 접속 확인**

워크플로우 성공 후 (1~2분):

```
https://jch4825.github.io/AITEXTBOOKforSTUDENTS/
```

Expected: 화면 가운데 "AI 교과서 — 곧 만나요. 지금은 준비 중이에요. — 발달장애 학생을 위한 AI 학습 교과서" 표시.

---

## ✅ M0 완료 게이트

다음이 모두 통과하면 M0 완료:

1. `npm run build` 로컬에서 에러 없이 통과
2. `git remote -v` 가 `AITEXTBOOKforSTUDENTS.git`을 가리킴
3. GitHub 레포에 `main` 브랜치 푸시 완료
4. GitHub Actions 배포 워크플로우 성공
5. `https://jch4825.github.io/AITEXTBOOKforSTUDENTS/` 에서 "준비 중" 페이지 정상 표시
6. `src/` 디렉토리에 `App.tsx`, `index.css`, `main.tsx`, `types.ts` 4개만 존재
7. 도구·링크도서관·진단·교육과정·모니터링·교사용 일러스트·교사 SEO 모두 제거됨

게이트 통과 후 → **M1 (인프라 골격)** 계획 작성으로 이동.
