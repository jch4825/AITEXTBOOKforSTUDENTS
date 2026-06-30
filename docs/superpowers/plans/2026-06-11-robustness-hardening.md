# Robustness Hardening (최소 수정 전략) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 2026-06-11 전수 디버깅에서 확인된 실제 버그 6건 + 방어선 2건을 핀셋 수정으로 제거하여, 알려진 결함 0건 상태로 만든다.

**Architecture:** 기존 구조(수동 라우팅, prop-drilled state, 대형 파일)는 일절 건드리지 않는다. 각 커밋은 독립적으로 배포 가능해야 하며, blast radius가 작은 것부터 순서대로 진행한다. 리팩토링·포맷팅·의존성 변경 금지.

**Tech Stack:** React 19 + Vite + Tailwind CSS 4 + @google/genai. 테스트 프레임워크 없음 — 검증은 `npm run lint`(tsc), `npm run build`, dev 서버 수동 확인으로 한다.

**기준 커밋:** `ad41ece` (Cap lesson button sizes when font scale is enlarged). 줄 번호가 어긋나면 각 Task의 **검색용 코드 문자열**로 위치를 찾을 것.

---

## 버그 카탈로그 (2026-06-11 감사 결과)

현재 상태: `tsc --noEmit` 통과, `npm run build` 통과, `check:encoding` 통과. 2026-05-31 리뷰의 Tier 1+4와 2026-06-10 발표 핫픽스 3건은 모두 반영 확인됨.

| # | 심각도 | 증상 | 위치 | 이 계획의 Task |
|---|---|---|---|---|
| B1 | 높음 | l5-1에서 로딩 중 Enter 연타·한글 IME 조합 중 Enter로 Gemini 요청이 중복 발사, 응답 경합 | `Module5Components.tsx` `onKeyDown` | Task 1 |
| B2 | 높음 | 교육과정 JSON(1.3MB) 동적 로드가 1번 실패하면 영구 실패로 캐시됨. l5-1은 로딩 스피너에 영구 고착, ToolPage는 unhandled rejection | `curriculumLookup.ts:30-41`, `Module5Components.tsx` `handleQuery`, `ToolPage.tsx:88-91` | Task 2 |
| B3 | 중간 | 빈 입력 안내문("입력창에 내용을 작성해 주세요."), API 오류 메시지, 키 미등록 안내문이 출력 완료되면 **레슨이 완료 처리됨** | `Tutorial.tsx` 완료 시그널 effect + `handleRun` | Task 3 |
| B4 | 중간 | ToolPage에서 스트리밍 중 뒤로가기/도구 전환 시 스트림이 취소되지 않음 — 언마운트 후 setState, 도구를 바꿔도 이전 스트림이 계속 소모됨 (2026-05-31 리뷰 I-3) | `ToolPage.tsx` `handleRun` | Task 4 |
| B5 | 중간 | `?lesson=` URL 파라미터가 영구 잔존 — Home으로 이동 후 새로고침하면 Tutorial로 튕김, URL 공유 시 의도치 않은 딥링크 (리뷰 I-4) | `App.tsx` | Task 5 |
| B6 | 중간 | Home의 CTA에는 `handleViewChange` 대신 raw `setCurrentView`가 전달됨 — TTS 재생 중 Home에서 이동하면 음성이 계속 재생되고 `selectedModule`이 리셋 안 됨 | `App.tsx:103,133` | Task 5 |
| B7 | 낮음 | 파일/이미지 업로드에 크기 제한 없음 — 대용량 파일이면 긴 대기 후 불친절한 API 오류 | `ToolPage.tsx` 파일 input `onChange` | Task 6 |
| B8 | 낮음 | `markComplete`/`toggleComplete`가 매 렌더 재생성 → 완료 시그널 effect가 키 입력마다 재실행 (오늘은 멱등이라 무해, 미래 footgun — 리뷰 I-6) | `App.tsx:79-96` | Task 6 |
| B9 | 낮음 | CLAUDE.md가 "5 modules (34 lessons)"라고 기술 — 실제는 6모듈(m0~m5) 42레슨 | `CLAUDE.md` | Task 7 |

### 알고도 수정하지 않는 것 (근거 포함 — 이 계획에서 절대 손대지 말 것)

- **`streamGemini` 스트림 도중 에러는 모델 폴백을 타지 않음** (`gemini.ts:77-88`): 폴백 사다리는 스트림 생성 시점 에러만 잡는다. 수정하려면 호출부 3곳의 for-await 구조를 바꿔야 해서 핀셋 수정 범위를 벗어남. 실사용에서 429/404는 생성 시점에 발생하므로 실위험 낮음. 알려진 한계로 문서화만.
- **`shouldTryNextGeminiModel`이 `INVALID_ARGUMENT`에도 4개 모델을 전부 재시도** (`gemini.ts:8-13`): 잘못된 요청이면 4배 지연 후 동일 오류. 그러나 regex를 좁히면 실제 폴백이 필요한 케이스(모델별 미지원 인자)를 깨뜨릴 위험이 있어 보류.
- **l1-4 API 키 입력란이 일반 textarea(마스킹 없음)** (`Tutorial.tsx`): 2026-05-31 리뷰 때 사용자가 보류 결정(Tier 5). 레슨 자체가 키를 보면서 따라하는 튜토리얼이라는 설계 의도 존중.
- **TTS 첫 호출 시 `getVoices()`가 빈 배열일 수 있음** (`a11y.ts:99`): `utter.lang='ko-KR'`이 이미 설정돼 있어 기본 음성도 한국어로 발화됨. 실증된 사용자 피해 없음.
- **응답 패널 삼항식의 `lesson.moduleId === 'm0'` 분기는 죽은 코드** (`Tutorial.tsx:1618-1625`): 패널 자체가 m0에서 렌더되지 않음(1613행 조건). 동작 영향 0, 정리는 리팩토링이므로 금지.
- **`skipDiagnosticStorage`가 수동 설정한 글꼴 크기를 초기화** (`storage.ts:234-242`): 의도된 UX인지 사용자 결정 필요. 메모만.
- **번들 경고** (index 504KB): 성능 항목이지 버그 아님. 별도 계획으로.
- **LessonViewer 추출, systemPrompt 이중화 해소**: 2026-05-31 리뷰 Tier 3 — 별도 설계 논의 필요.

---

## 작업 규칙 (재강조)

1. 모든 Task는 명시된 지점 외 코드 변경 금지. 다른 버그를 발견해도 메모만 남기고 수정하지 말 것.
2. `package.json`/lockfile 변경 금지. 자동 포맷터 전체 적용 금지 — 수정 줄만 변경.
3. 각 Task 끝마다 `npm run lint` 필수. UI 동작이 바뀌는 Task(1,2,3,4,5)는 `npm run dev`로 수동 확인 후 커밋.
4. 새 파일 추가 시 `npm run check:encoding` 실행 (이 계획은 새 파일 없음 — CLAUDE.md만 수정).

---

### Task 1: l5-1 Enter 키 중복 실행 가드 (B1)

**Files:**
- Modify: `src/views/Module5Components.tsx` (~60행 `handleQuery` 선두, ~126행 `onKeyDown`)

- [ ] **Step 1: 위치 확인**

파일에서 `if (e.key === 'Enter') handleQuery(codeInput)` 검색 — 1곳뿐임. 같은 컴포넌트(`Lesson51Interactive`)의 `handleQuery` 함수 선두(`if (!trimmed) return;` 직후 줄)도 확인.

- [ ] **Step 2: onKeyDown에 로딩·IME 가드 추가**

```
변경 전: onKeyDown={e => { if (e.key === 'Enter') handleQuery(codeInput); }}
변경 후: onKeyDown={e => { if (e.key === 'Enter' && !isLoading && !e.nativeEvent.isComposing) handleQuery(codeInput); }}
```

`isComposing` 가드가 핵심: 한글 IME로 "6수01-07" 같은 코드를 입력하다 조합 중 Enter를 치면 keydown이 조합 확정용과 실제 입력용으로 2번 발사되어 요청이 중복된다.

- [ ] **Step 3: handleQuery 선두에 재진입 가드 추가**

`const trimmed = ...` / `if (!trimmed) return;` 바로 아래에 1줄 추가:

```ts
    if (isLoading) return;
```

(버튼은 `disabled={isLoading}`로 이미 막혀 있지만, 함수 차원에서도 막아 둔다.)

- [ ] **Step 4: 검증**

```bash
npm run lint
npm run dev
```

브라우저에서 l5-1 진입 → 예시 코드 클릭 → "AI에게 물어보기" 직후 입력창에서 Enter 연타 → 네트워크 탭에 Gemini 요청이 1건만 가는지 확인. 한글 입력 조합 중 Enter도 1회만 실행되는지 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/views/Module5Components.tsx
git commit -m "Guard l5-1 Enter key against double-fire during loading and IME composition"
```

---

### Task 2: 교육과정 DB 로드 실패 복구 (B2)

**Files:**
- Modify: `src/utils/curriculumLookup.ts:30-41` (`initCurriculum`)
- Modify: `src/views/Module5Components.tsx` (`handleQuery` 내 `await initCurriculum();`)
- Modify: `src/views/ToolPage.tsx:88-91` (curriculum 로딩 effect)

- [ ] **Step 1: initCurriculum이 실패 시 캐시를 비우도록 수정**

`src/utils/curriculumLookup.ts`에서 `loadPromise = import(` 검색. 현재:

```ts
  loadPromise = import('../data/curriculumStandards.json').then(mod => {
    const standards = (mod.default as { standards: CurriculumStandard[] }).standards;
    INDEX = new Map<string, CurriculumStandard>();
    for (const s of standards) {
      INDEX.set(normalizeCode(s.code), s);
    }
  });
  return loadPromise;
```

변경 후:

```ts
  loadPromise = import('../data/curriculumStandards.json')
    .then(mod => {
      const standards = (mod.default as { standards: CurriculumStandard[] }).standards;
      INDEX = new Map<string, CurriculumStandard>();
      for (const s of standards) {
        INDEX.set(normalizeCode(s.code), s);
      }
    })
    .catch(err => {
      // 로드 실패한 promise를 캐시에 남기면 영구 실패가 된다. 비워서 다음 호출이 재시도하게 한다.
      loadPromise = null;
      throw err;
    });
  return loadPromise;
```

- [ ] **Step 2: l5-1 handleQuery의 await를 try/catch로 감싸기**

`src/views/Module5Components.tsx`에서 `await initCurriculum();` 검색 (Lesson51Interactive 내부 1곳). 현재:

```ts
    await initCurriculum();
    const found = lookupStandard(trimmed);
```

변경 후:

```ts
    try {
      await initCurriculum();
    } catch {
      // DB 로드 실패 — lookupStandard가 null을 반환하므로 실제 성취기준 비교만 빠진 채 진행된다.
    }
    const found = lookupStandard(trimmed);
```

(`lookupStandard`는 `curriculumLookup.ts:62-65`에서 `INDEX`가 null이면 null을 반환하므로 추가 방어 불필요. 실패 시 `isLoading`이 `finally`까지 정상 도달해 영구 스피너가 사라진다.)

- [ ] **Step 3: ToolPage effect에 catch 추가**

`src/views/ToolPage.tsx`에서 `initCurriculum().then` 검색. 현재:

```ts
  useEffect(() => {
    if (!hasCurriculumInput) return;
    initCurriculum().then(() => setCurriculumReady(true));
  }, [hasCurriculumInput]);
```

변경 후:

```ts
  useEffect(() => {
    if (!hasCurriculumInput) return;
    let cancelled = false;
    initCurriculum()
      .then(() => { if (!cancelled) setCurriculumReady(true); })
      .catch(() => { /* 실패 시 미리보기 없이 동작. initCurriculum이 캐시를 비워 다음 진입에서 재시도된다. */ });
    return () => { cancelled = true; };
  }, [hasCurriculumInput]);
```

- [ ] **Step 4: 검증**

```bash
npm run lint
npm run dev
```

정상 경로: l5-1에서 예시 코드 질의 → 초록 패널(실제 성취기준)이 뜨는지. 루브릭 생성기(curriculum 입력이 있는 도구)에서 코드 입력 시 미리보기가 뜨는지.

실패 경로: DevTools Network 탭에서 "Offline" 설정 후 시크릿 창으로 l5-1 질의(시뮬레이션 답변 경로) → 버튼이 "요청 중..."에 고착되지 않고 결과가 표시되는지. 콘솔에 unhandled rejection이 없는지.

- [ ] **Step 5: 커밋**

```bash
git add src/utils/curriculumLookup.ts src/views/Module5Components.tsx src/views/ToolPage.tsx
git commit -m "Recover from curriculum DB load failure instead of caching it forever"
```

---

### Task 3: 안내·오류 메시지가 레슨을 완료 처리하는 버그 수정 (B3)

**Files:**
- Modify: `src/views/Tutorial.tsx` — `LessonViewer` 내부 4개 지점 (ref 선언, 완료 effect, 레슨 전환 effect, `handleRun`)

**원리:** 완료 시그널 effect는 "aiResponse 출력이 끝났다"만 보고 완료 처리한다. 실습을 실제로 수행한 응답인지 구분하는 ref(`completionEligibleRef`)를 추가하고, 안내문·오류 경로에서만 false로 내린다. 기본값을 true로 두어 기존 정상 경로의 동작은 그대로 유지한다.

- [ ] **Step 1: ref 선언 추가**

`Tutorial.tsx`에서 `const aiResponseLessonRef = useRef<string>('');` 검색 (LessonViewer 선두, ~512행). 바로 아래에 추가:

```ts
  const completionEligibleRef = useRef(false);
```

- [ ] **Step 2: 완료 시그널 effect에 조건 추가**

`const hasCompletionSignal =` 검색. 현재:

```ts
    const hasCompletionSignal = (!!aiResponse && !isTyping && aiResponseLessonRef.current === lesson.id) || manualCompleteRequested;
```

변경 후:

```ts
    const hasCompletionSignal = (!!aiResponse && !isTyping && aiResponseLessonRef.current === lesson.id && completionEligibleRef.current) || manualCompleteRequested;
```

(deps 배열은 변경하지 않는다 — ref는 deps에 넣지 않는다.)

- [ ] **Step 3: 레슨 전환 시 ref 리셋**

레슨 전환 effect에서 `aiResponseLessonRef.current = '';` 검색 (~753행). 바로 아래에 추가:

```ts
    completionEligibleRef.current = false;
```

- [ ] **Step 4: handleRun에서 경로별로 eligible 설정**

`handleRun` 안에서 `aiResponseLessonRef.current = lesson.id;` 검색 (~787행). 바로 아래에 추가:

```ts
    completionEligibleRef.current = true;
```

그다음 같은 함수 안에서 **3개의 비정상 경로**에 false를 설정한다.

(a) 빈 입력 안내 — `startTyping('입력창에 내용을 작성해 주세요.');` 검색:

```ts
    if (inputToUse.trim() === '') {
      completionEligibleRef.current = false;
      startTyping('입력창에 내용을 작성해 주세요.');
      return;
    }
```

(b) API 키 미등록 + 시뮬레이션 답변도 없는 경우 — `(API키가 제대로 작동하지 않아` 검색:

```ts
        if (lesson.interactive.simulationAnswer) {
          fullText = lesson.interactive.simulationAnswer;
        } else {
          completionEligibleRef.current = false;
          fullText = "(API키가 제대로 작동하지 않아, default 답변을 생성합니다.) API키를 입력한 후 실습을 진행해 보세요.";
        }
```

(시뮬레이션 답변은 설계된 학습 경험이므로 완료 처리를 **유지**한다.)

(c) Gemini API 오류 — `fullText = friendlyApiError(error);` 검색:

```ts
        } catch (error: any) {
          console.error("Gemini API Error:", error);
          completionEligibleRef.current = false;
          fullText = friendlyApiError(error);
        }
```

(d) answers 사전에 매칭 실패한 fallback — `fullText = "정확한 값을 입력하거나 버튼을 클릭해주세요.";` 검색:

```ts
      } else {
        completionEligibleRef.current = false;
        fullText = "정확한 값을 입력하거나 버튼을 클릭해주세요.";
      }
```

(`answers["default"]` 경로는 설계된 응답이므로 완료 처리 유지. l1-4에서 잘못된 키를 넣어도 default 안내가 나오며 완료 처리되는 기존 동작은 바꾸지 않는다 — 바꾸려면 사용자 결정 필요, 메모만.)

- [ ] **Step 5: 검증**

```bash
npm run lint
npm run dev
```

1. 진행 상태를 초기화(사이드바 "학습 경로 다시 추천" 또는 localStorage `ai-teachers-progress` 삭제).
2. l1-1에서 입력창을 비우고 실행 → "입력창에 내용을 작성해 주세요." 출력 완료 후 사이드바에 완료 체크가 **생기지 않는지**.
3. l1-2에서 엉뚱한 값 입력 후 실행 → 매칭 실패 안내 후 완료 체크가 생기지 않는지. (l1-2가 `answers["default"]`를 가지면 default 응답이 나오고 완료되는 것이 정상.)
4. 정상 경로 회귀 확인: l1-1에서 문장을 따라 쓰고 실행 → 응답 완료 후 완료 체크가 **생기는지**. API 키 등록 상태에서 l1-5 질문 → 완료되는지. 시크릿 창(키 없음)에서 simulationAnswer가 있는 레슨(예: l2-6) 실행 → 시뮬레이션 답변 후 완료되는지.

- [ ] **Step 6: 커밋**

```bash
git add src/views/Tutorial.tsx
git commit -m "Stop marking lessons complete on guidance and error messages"
```

---

### Task 4: ToolPage 스트림 취소 가드 (B4)

**Files:**
- Modify: `src/views/ToolPage.tsx` — import, ref 선언, 언마운트 effect, `handleRun`

**원리:** `Tutorial.tsx`가 이미 쓰는 runId 패턴을 그대로 이식한다. AbortController는 SDK 시그니처 확인이 필요해 핀셋 범위를 벗어남.

- [ ] **Step 1: useRef import 추가**

1행 `import React, { useEffect, useMemo, useState } from 'react';` →

```ts
import React, { useEffect, useMemo, useRef, useState } from 'react';
```

- [ ] **Step 2: ref 선언 + 언마운트 무효화 effect 추가**

`const [copied, setCopied] = useState(false);` (~80행) 아래에 추가:

```ts
  const runIdRef = useRef(0);

  // 언마운트 시 진행 중인 스트림 소비를 무효화한다 (스트림 자체는 GC가 회수).
  useEffect(() => () => { runIdRef.current += 1; }, []);
```

- [ ] **Step 3: handleRun에 runId 가드 삽입**

`setIsRunning(true);` / `setResult('');` (~258행) 직후에 추가:

```ts
    const myRunId = ++runIdRef.current;
```

스트림 소비 루프(`for await (const chunk of response)`)를 다음과 같이 변경:

```ts
      let full = '';
      for await (const chunk of response) {
        if (myRunId !== runIdRef.current) return;
        full += chunk.text ?? '';
        setResult(full);
      }
      if (myRunId !== runIdRef.current) return;
      if (!full.trim()) setResult('답변을 생성할 수 없습니다.');
```

catch 블록 선두에 가드 추가:

```ts
    } catch (error: any) {
      if (myRunId !== runIdRef.current) return;
      const friendly = friendlyApiError(error, { markdown: true });
```

finally 블록 변경:

```ts
    } finally {
      if (myRunId === runIdRef.current) setIsRunning(false);
    }
```

(try 안의 `return`도 finally를 거치므로 가드가 필수다.)

- [ ] **Step 4: 검증**

```bash
npm run lint
npm run dev
```

도구 하나에서 "생성하기" 실행 → 스트리밍 중 뒤로가기 → 콘솔에 "setState on unmounted component" 경고가 없는지. 곧바로 다른 도구에 들어가 실행해도 이전 응답이 섞여 나오지 않는지.

- [ ] **Step 5: 커밋**

```bash
git add src/views/ToolPage.tsx
git commit -m "Invalidate ToolPage Gemini stream on unmount with runId guard"
```

---

### Task 5: `?lesson=` URL 정리 + Home 내비게이션 일원화 (B5, B6)

**Files:**
- Modify: `src/App.tsx` — effect 1개 추가, Home의 `onViewChange` prop 2곳 교체

- [ ] **Step 1: URL 정리 effect 추가**

`App.tsx`의 `App` 컴포넌트 내부, `const refreshLearningPathStatus = ...` 위에 추가 (`useEffect`를 react import에 추가해야 함: `import React, { Suspense, lazy, useEffect, useState } from 'react';`):

```ts
  // ?lesson= 딥링크는 최초 로드에서만 의미가 있다. tutorial 밖으로 나가면 지워서
  // 새로고침·URL 복사 시 의도치 않게 레슨으로 튕기는 것을 막는다.
  useEffect(() => {
    if (currentView === 'tutorial') return;
    if (new URLSearchParams(window.location.search).has('lesson')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [currentView]);
```

(`pathname`만 남기므로 GitHub Pages base path `/AI_bridge_test_v0.1/`는 보존된다. 해시 라우팅은 사용하지 않음.)

- [ ] **Step 2: Home에 handleViewChange 전달**

`renderView()`의 `case 'home':`과 `default:` 두 곳에서:

```
변경 전: onViewChange={setCurrentView}
변경 후: onViewChange={handleViewChange}
```

이로써 Home CTA로 이동할 때도 `stopSpeaking()`과 `setSelectedModule(null)`이 일관되게 실행된다.

- [ ] **Step 3: 검증**

```bash
npm run lint
npm run dev
```

1. `http://localhost:3000/AI_Bridge/?lesson=l1-2` 접속 → 레슨이 열리는지(딥링크 회귀 확인).
2. 사이드바로 Home 이동 → 주소창에서 `?lesson=`이 사라졌는지 → 새로고침 → Home에 머무는지.
3. Home에서 모듈 설명 "듣기" 재생 중 CTA로 다른 화면 이동 → 음성이 멈추는지.
4. QuickTools에서 레슨 딥링크 카드 클릭(`?lesson=` 이동) → 정상 진입하는지.

- [ ] **Step 4: 커밋**

```bash
git add src/App.tsx
git commit -m "Clear stale ?lesson= param outside tutorial and route Home through handleViewChange"
```

---

### Task 6: 소형 방어선 2건 — 업로드 크기 제한, 콜백 안정화 (B7, B8)

**Files:**
- Modify: `src/views/ToolPage.tsx` — 파일 input `onChange` (~377행)
- Modify: `src/App.tsx` — `toggleComplete`/`markComplete`

- [ ] **Step 1: 업로드 크기 제한**

`ToolPage.tsx`에서 `const file = event.target.files?.[0];` 검색 (파일 input의 onChange, 1곳). 현재:

```ts
                onChange={async event => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
```

변경 후:

```ts
                onChange={async event => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  // Gemini inlineData 요청 한도(~20MB) 초과를 사전 차단
                  if (file.size > 15 * 1024 * 1024) {
                    alert('파일이 너무 큽니다. 15MB 이하의 파일을 사용해 주세요.');
                    event.target.value = '';
                    return;
                  }
                  try {
```

- [ ] **Step 2: App.tsx 콜백 useCallback 래핑**

import에 `useCallback` 추가:

```ts
import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
```

`toggleComplete`와 `markComplete`를 래핑 (함수 본문은 글자 하나도 바꾸지 않는다 — functional updater만 쓰므로 deps는 빈 배열):

```ts
  const toggleComplete = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      const next = prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId];
      saveLessonProgress(next);
      return next;
    });
  }, []);

  const markComplete = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
      if (prev.includes(lessonId)) return prev;
      const next = [...prev, lessonId];
      saveLessonProgress(next);
      return next;
    });
  }, []);
```

(updater 내부의 `saveLessonProgress` 호출은 기존 코드의 알려진 비순수성 — 이번에 고치지 않는다. 메모만.)

- [ ] **Step 3: 검증**

```bash
npm run lint
npm run dev
```

이미지 입력이 있는 도구에서 16MB 이상 파일 선택 → 즉시 안내 alert가 뜨고 업로드가 거부되는지. 작은 이미지는 기존대로 동작하는지. 레슨 완료 토글이 기존대로 동작하는지.

- [ ] **Step 4: 커밋**

```bash
git add src/views/ToolPage.tsx src/App.tsx
git commit -m "Cap tool uploads at 15MB and stabilize completion callbacks with useCallback"
```

---

### Task 7: CLAUDE.md 정합성 수정 (B9)

**Files:**
- Modify: `CLAUDE.md` — 모듈/레슨 수 표기 3곳

- [ ] **Step 1: 수치 교정**

다음 3곳을 수정한다 (실측: 모듈 6개 m0~m5, 레슨 42개 = 6+5+8+8+8+7. `lessonsCount` 필드와 일치 확인됨):

1. Project Overview의 `through 5 modules (34 lessons) and 19 pre-built AI tools` → `through 6 modules (42 lessons) and 19 pre-built AI tools`
2. Data Layer의 `All 5 modules and 34 lessons defined` → `All 6 modules and 42 lessons defined`
3. Views의 `Handles all 5 modules` → `Handles all 6 modules`

- [ ] **Step 2: Pending Fixes 섹션 갱신**

CLAUDE.md 하단 "Pending Fixes" 섹션의 날짜 문구를 갱신하고, 이 계획에서 의도적으로 보류한 항목을 기록한다:

```markdown
## Pending Fixes

안정성 분석(2026-05-01)과 전수 디버깅(2026-06-11)에서 발견된 미수정 항목. 수정 완료 시 해당 항목 삭제.

### 보류 (2026-06-11 결정 — 수정 시 별도 계획 필요)

- `gemini.ts` streamGemini: 스트림 도중 에러는 모델 폴백 사다리를 타지 않음 (호출부 구조 변경 필요)
- `gemini.ts` shouldTryNextGeminiModel: INVALID_ARGUMENT에도 전체 모델 재시도 (regex 좁히면 실폴백 깨질 위험)
- l1-4 API 키 입력란 마스킹 없음 (튜토리얼 설계 의도 — 사용자 보류 결정 유지)
- `storage.ts` skipDiagnosticStorage가 수동 글꼴 설정을 초기화 (의도 여부 사용자 결정 필요)
- `App.tsx` 진행도 저장이 setState updater 내부에서 실행됨 (비순수 — 동작 문제 없음)
```

- [ ] **Step 3: 검증 + 커밋**

```bash
npm run check:encoding
git add CLAUDE.md
git commit -m "Sync CLAUDE.md module/lesson counts and record deferred fixes"
```

---

## 최종 검증 (전체 커밋 후)

```bash
npm run lint
npm run check:encoding
npm run build
```

수동 통합 확인 (dev 서버, 시크릿 창 1회 포함):

1. 첫 방문 플로우: 진단 모달 → 모듈 추천 → l1-1 투어 → 실행/완료.
2. API 키 등록(l1-4) → l1-5 질의 → 응답 + 완료 체크.
3. 도구 1개 실행 → 스트리밍 → 결과 복사.
4. l5-1 시뮬레이션/실키 양쪽 경로.
5. `?lesson=` 딥링크 진입 → Home 이동 → 새로고침 → Home 유지.

배포는 사용자 승인 후 `git push origin main` (GitHub Actions 자동 배포). 배포 후 프로덕션 URL에서 1·2·5번 재확인.

## 이 계획이 의도적으로 하지 않는 것

- 위 "알고도 수정하지 않는 것" 목록 전체 — 각각 별도 결정/계획 필요.
- 테스트 프레임워크 도입: 가치는 있으나 "최소 수정" 범위 밖. 도입하려면 별도 브레인스토밍부터.
- 모든 리팩토링 (LessonViewer 추출, 죽은 분기 정리, 파일 분할).
