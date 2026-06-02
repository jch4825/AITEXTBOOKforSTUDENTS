# 모듈 4 시작 팝업 재구성 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 모듈 4 시작 팝업의 기존 "주의 사항 3종"을 제거하고, 무료 Gemini 한계 인정 + 외부 도구 안내·묘사 성격 명시 + 지식샘터 학습 경로 안내 + 지식샘터 검색 힌트용 해시태그로 교체한다.

**Architecture:** 단일 파일(`src/views/Tutorial.tsx`) 내 인라인 JSX 교체. 새 컴포넌트·새 데이터·새 의존성 없음. `SpeakButton` 텍스트와 라벨도 갱신. 더 이상 쓰이지 않게 되는 `School` 아이콘 import 제거.

**Tech Stack:** React + TypeScript, Tailwind CSS, lucide-react (이미 사용 중). 테스트 프레임워크는 프로젝트에 없음 — 검증은 `tsc --noEmit`(`npm run lint`), `npm run check:encoding`, 그리고 `npm run dev`로 수동 UI 확인.

**Spec:** `docs/superpowers/specs/2026-06-02-module4-intro-popup-redesign-design.md`

---

## File Structure

**수정:**
- `C:\AI\AI_bridge_test_v0.1\src\views\Tutorial.tsx`
  - 1행대(라인 3): `lucide-react` import에서 `School` 제거
  - 1074~1118행: `showOverlay` 팝업 본문 전체 교체 (제목 헤더 포함 SpeakButton 텍스트/라벨 갱신, 본문은 도입문 + 카드 2개 + 해시태그 섹션으로)

**신규/삭제 파일 없음.** 데이터 파일 변경 없음.

---

### Task 1: 팝업 헤더의 SpeakButton 텍스트·라벨 교체

**Files:**
- Modify: `C:\AI\AI_bridge_test_v0.1\src\views\Tutorial.tsx` (라인 1079~1082)

이 작업의 목적: 헤더 우측 음성 듣기 버튼이 새 본문 내용을 낭독하도록 갱신한다. 본문 JSX는 다음 Task에서 교체한다 — 두 Task로 나누는 이유는 각 변경의 commit을 작게 가져가기 위함.

- [ ] **Step 1: 현재 코드 위치 확인**

`Read` 도구로 `src\views\Tutorial.tsx` 1074~1120행을 읽어 현재 상태가 다음과 일치하는지 확인:

```tsx
{showOverlay && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 overflow-y-auto" style={{ minHeight: '100vh' }}>
    <div className="bg-white rounded-xl max-w-[480px] w-full p-8 shadow-2xl relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 text-center flex-1">모듈 4를 시작하기 전에</h3>
        <SpeakButton
          text="모듈 4를 시작하기 전에. 첫째, 개인정보는 AI에 넣지 않습니다. ..."
          label="원칙 전체 듣기"
        />
      </div>
```

기대: 라인 1079에 `<SpeakButton`, 라인 1080에 긴 `text="..."` 문자열, 라인 1081에 `label="원칙 전체 듣기"`. 라인 번호가 다르면 (사이에 다른 편집이 있었다면) 동일한 코드 블록을 검색해서 위치를 다시 잡는다.

- [ ] **Step 2: SpeakButton의 text와 label 교체**

`Edit` 도구로 다음 정확한 교체 수행:

old_string:
```tsx
        <SpeakButton
          text="모듈 4를 시작하기 전에. 첫째, 개인정보는 AI에 넣지 않습니다. 학생 이름, 주민번호, 연락처, 교사 인사 정보는 절대 AI에 입력하지 않고, 가명 혹은 익명화하여 사용합니다. 둘째, AI 결과물은 반드시 교사가 검토합니다. 공문, 가정통신문 등은 법적 효력이 발생할 수 있습니다. AI는 어디까지나 초안을 제시할 뿐 최종 책임은 작성자 본인에게 있습니다. 셋째, 학교 공식 시스템 연동은 승인이 필요합니다. 나이스나 업무관리시스템 등 학교 자체 공식망에 AI를 직접 연결하는 행위는 교육청 승인 없이 개인이 임의로 해선 안 됩니다."
          label="원칙 전체 듣기"
        />
```

new_string:
```tsx
        <SpeakButton
          text="모듈 4를 시작하기 전에. 솔직히 말씀드리면, 무료 Gemini만으로는 학교 업무 자동화를 온전히 구현하기 어렵습니다. 그래서 모듈 4는 직접 도구를 만들어 쓰는 다른 모듈과 달리, 외부 도구를 안내하고 묘사하는 방향으로 구성했습니다. 첫째, 모듈 4는 안내 중심입니다. 무료 Gemini로 처리할 수 있는 영역은 한정적이라, 본격적인 업무 자동화에는 다양한 외부 도구가 필요합니다. 둘째, 더 깊이 배우려면 지식샘터를 이용하세요. 지식샘터에는 다양한 AI·업무 자동화 프로그램에 대한 교사 대상 강좌가 개설됩니다. AI Bridge에서 기본 틀과 개념을 잡으신 뒤, 본격적인 공부는 지식샘터 강좌를 활용하시는 것도 좋은 대안입니다."
          label="안내 전체 듣기"
        />
```

- [ ] **Step 3: 타입 검사**

```bash
npm run lint
```

기대: 종료 코드 0. 출력에 에러 없음. `Tutorial.tsx` 관련 오류가 뜨면 Step 2의 교체가 JSX 구조를 깨뜨렸을 가능성 — 파일을 다시 읽고 해당 위치 들여쓰기·따옴표 확인.

- [ ] **Step 4: UTF-8 인코딩 검사**

```bash
npm run check:encoding
```

기대: 종료 코드 0, "All files are valid UTF-8" 류 메시지. 실패 시 파일이 BOM 포함 UTF-8 또는 다른 인코딩으로 저장된 것 — Editor/IDE 설정 확인.

- [ ] **Step 5: 커밋**

```bash
git add src/views/Tutorial.tsx
git commit -m "Update module 4 popup SpeakButton text and label

Narration now reflects the upcoming popup body redesign (free-tier
limits acknowledgment + 지식샘터 learning path). Body JSX changes in a
follow-up commit."
```

---

### Task 2: 팝업 본문(카드 영역) 교체 — 도입문 + 카드 2개 + 해시태그

**Files:**
- Modify: `C:\AI\AI_bridge_test_v0.1\src\views\Tutorial.tsx` (라인 1085~1109 부근, `<div className="space-y-4">` 블록)

이 작업의 목적: 기존 3개 카드(개인정보 / 교사 검토 / 시스템 연동)를 도입문 1문단 + 카드 2개(🗺️ 안내 중심, 🎓 지식샘터 추천) + 해시태그 섹션으로 교체.

- [ ] **Step 1: 교체 대상 블록 위치 확인**

`Read` 도구로 `src\views\Tutorial.tsx` 1083~1120행 읽기. 현재 형태는 다음과 같아야 함 (Task 1 이후):

```tsx
      </div>

      <div className="space-y-4">
        <div className="flex gap-4 items-start p-4 border-b border-gray-100">
          <div className="text-2xl mt-1">🔒</div>
          ...
        </div>

        <div className="flex gap-4 items-start p-4 border-b border-gray-100">
          <div className="text-2xl mt-1">✅</div>
          ...
        </div>

        <div className="flex gap-4 items-start p-4 border-b border-gray-100">
          <div className="text-2xl mt-1"><School size={24} className="text-canva-purple" /></div>
          ...
        </div>
      </div>

      <button 
        onClick={handleCloseOverlay}
        className="w-full mt-8 py-3 bg-canva-purple text-white font-bold rounded-lg hover:bg-opacity-90 transition-all text-sm"
      >
        확인했습니다
      </button>
```

- [ ] **Step 2: `space-y-4` 블록을 새 본문으로 교체**

`Edit` 도구로 정확한 교체 수행.

old_string (들여쓰기 12칸 = 공백 12개, 헤더 `</div>` 닫힘 다음 한 줄 빈 줄 포함):

```tsx
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 border-b border-gray-100">
                <div className="text-2xl mt-1">🔒</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">개인정보는 AI에 넣지 않습니다</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">학생 이름·주민번호·연락처, 교사 인사 정보는 절대 AI에 입력하지 않고, 가명 혹은 익명화하여 사용합니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 border-b border-gray-100">
                <div className="text-2xl mt-1">✅</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">AI 결과물은 반드시 교사가 검토합니다</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">공문, 가정통신문 등은 법적 효력이 발생할 수 있습니다. AI는 어디까지나 초안을 제시할 뿐 최종 책임은 작성자 본인에게 있습니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 border-b border-gray-100">
                <div className="text-2xl mt-1"><School size={24} className="text-canva-purple" /></div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">학교 공식 시스템 연동은 승인이 필요합니다</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">나이스(NEIS)나 업무관리시스템 등 학교 자체 공식망에 AI를 직접 연결하는 행위는 교육청 승인 없이 개인이 임의로 해선 안 됩니다.</p>
                </div>
              </div>
            </div>
```

new_string:

```tsx
            <p className="text-sm text-gray-700 leading-relaxed mb-5">
              솔직히 말씀드리면, 무료 Gemini만으로는 학교 업무 자동화를 온전히 구현하기 어렵습니다. 그래서 모듈 4는 &lsquo;직접 도구를 만들어 쓰는&rsquo; 다른 모듈과 달리, 외부 도구를 <strong className="font-semibold">안내하고 묘사하는</strong> 방향으로 구성했습니다.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4 items-start p-4 border-b border-gray-100">
                <div className="text-2xl mt-1">🗺️</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">모듈 4는 &lsquo;안내&rsquo; 중심입니다</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">무료 Gemini로 처리할 수 있는 영역은 한정적이라, 본격적인 업무 자동화에는 다양한 외부 도구(대부분 유료)가 필요합니다. 모듈 4의 레슨은 &ldquo;이런 도구가 있고, 이렇게 활용할 수 있다&rdquo;는 안내·묘사에 초점을 둡니다.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4">
                <div className="text-2xl mt-1">🎓</div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">더 깊이 배우려면 &lsquo;지식샘터&rsquo;를</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">지식샘터에는 다양한 AI·업무 자동화 프로그램에 대한 교사 대상 강좌가 개설됩니다. AI Bridge에서 기본 틀과 개념을 잡으신 뒤, 본격적인 공부는 지식샘터의 강좌를 활용하시는 것도 좋은 대안입니다.</p>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">📚 지식샘터에서 이 주제로 더 공부해 보세요</p>
              <div>
                {['업무자동화', '공문작성', '가정통신문', '프롬프트템플릿', 'AI에이전트'].map(tag => (
                  <span key={tag} className="inline-block px-2.5 py-1 mr-1.5 mb-1.5 rounded-full bg-gray-100 text-gray-600 text-[11px] font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
```

주의:
- 들여쓰기는 12칸 공백 (`            `) — 기존 코드와 동일.
- 마지막 카드 `🎓`는 `border-b` 클래스 **없음** (시각적 마무리).
- JSX 안의 따옴표는 HTML 엔티티(`&lsquo;`, `&rsquo;`, `&ldquo;`, `&rdquo;`)로 표기 — JSX 파서/린트의 `react/no-unescaped-entities` 경고 회피용.
- 해시태그는 단순 텍스트 라벨(클릭/링크 없음).

- [ ] **Step 3: 타입 검사**

```bash
npm run lint
```

기대: 종료 코드 0. 가장 흔한 실패:
- `'School' is declared but its value is never read` — Task 3에서 import를 제거할 예정. 만약 이 시점에 이 에러로 빌드 실패가 나면 Task 3를 먼저 수행하고 다시 돌아온다.
- JSX 구조 깨짐 — 들여쓰기/괄호 확인.

- [ ] **Step 4: UTF-8 인코딩 검사**

```bash
npm run check:encoding
```

기대: 종료 코드 0.

- [ ] **Step 5: 커밋**

```bash
git add src/views/Tutorial.tsx
git commit -m "Replace module 4 popup body with limits-honest framing

Removes the generic 3-card safety notice and replaces with intro
paragraph + 2 cards (안내 중심, 지식샘터 학습 경로) + 해시태그 section
serving as 지식샘터 search hints."
```

---

### Task 3: 미사용 `School` 아이콘 import 제거

**Files:**
- Modify: `C:\AI\AI_bridge_test_v0.1\src\views\Tutorial.tsx` (라인 3, `lucide-react` import 줄)

이 작업의 목적: Task 2에서 `<School />` 사용처가 사라졌으므로 import에서 제거.

- [ ] **Step 1: 현재 import 줄 확인**

`Read` 도구로 `src\views\Tutorial.tsx` 라인 1~5 읽기. 라인 3은 다음과 같아야 함:

```tsx
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, PlayCircle, Clock, ArrowRight, Copy, Info, FileText, Lock, Check, School, X } from 'lucide-react';
```

또한 `Grep`으로 파일 내 `\bSchool\b` 사용처를 다시 확인:

```
Grep pattern: \bSchool\b
path: src\views\Tutorial.tsx
output_mode: content
-n: true
```

기대: import 줄(라인 3) **하나만** 매치되어야 함. 다른 곳에서 매치되면 그 사용처를 먼저 해결해야 함 (Task 2가 제대로 수행되었는지 재검토).

- [ ] **Step 2: `School,` 제거**

`Edit` 도구로 교체:

old_string:
```tsx
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, PlayCircle, Clock, ArrowRight, Copy, Info, FileText, Lock, Check, School, X } from 'lucide-react';
```

new_string:
```tsx
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, PlayCircle, Clock, ArrowRight, Copy, Info, FileText, Lock, Check, X } from 'lucide-react';
```

- [ ] **Step 3: 타입 검사**

```bash
npm run lint
```

기대: 종료 코드 0, 에러 없음.

- [ ] **Step 4: 커밋**

```bash
git add src/views/Tutorial.tsx
git commit -m "Remove unused School icon import after popup redesign"
```

---

### Task 4: 수동 UI 검증 (`npm run dev`)

**Files:** 변경 없음. 사용자가 브라우저에서 직접 확인.

테스트 프레임워크가 없으므로 UI/UX 검증은 사람 눈으로 한다. 이 Task는 코드 변경 없이 다음 시나리오를 확인하는 체크리스트.

- [ ] **Step 1: 개발 서버 기동**

```bash
npm run dev
```

기대: `http://localhost:3000`에서 listening. 빌드 에러 없음.

- [ ] **Step 2: 모듈 4 진입 시 팝업 확인**

브라우저로 접속 → 튜토리얼 → 모듈 4 첫 레슨(`l4-1`) 진입 → 팝업이 자동으로 뜨는지 확인.

체크 포인트:
- [ ] 제목 "모듈 4를 시작하기 전에"가 보임
- [ ] 헤더 우측 음성 듣기 버튼 라벨이 "안내 전체 듣기"
- [ ] 도입문 한 문단이 카드 위에 보이고, "안내하고 묘사하는"이 굵게 강조됨
- [ ] 🗺️ 카드와 🎓 카드 2개만 보임 (3개 아님)
- [ ] 🎓 카드 아래 구분선(border)이 없음
- [ ] "📚 지식샘터에서 이 주제로 더 공부해 보세요" 라벨이 보임
- [ ] 해시태그 5개(#업무자동화 #공문작성 #가정통신문 #프롬프트템플릿 #AI에이전트)가 회색 pill 형태로 보임
- [ ] "확인했습니다" 버튼이 보이고 클릭 시 팝업 닫힘
- [ ] 닫은 뒤 같은 세션에서 다른 모듈 4 레슨으로 이동해도 팝업이 다시 뜨지 않음 (`module4PrinciplesShown` 게이트)

- [ ] **Step 3: 음성 듣기 동작 확인**

팝업을 다시 띄우려면 페이지 새로고침(또는 새 세션). 헤더의 음성 듣기 버튼을 클릭해 TTS가 새 본문을 낭독하는지 확인.

체크 포인트:
- [ ] 낭독이 "모듈 4를 시작하기 전에. 솔직히 말씀드리면..." 으로 시작
- [ ] "지식샘터" 부분이 정상 발음됨

- [ ] **Step 4: 다른 모듈 회귀 확인 (smoke test)**

- [ ] 모듈 1 첫 레슨 진입 → 팝업이 모듈 1 고유 형태로 정상 동작 (이번 작업이 영향 주지 않음)
- [ ] 모듈 2/3/5 첫 레슨에서도 평소처럼 진입

- [ ] **Step 5: 검증 완료 보고**

위 모든 체크박스가 통과하면 사용자에게 "팝업 재구성 작업 완료, 빌드/렌더/TTS 모두 정상" 보고. 이슈 발견 시 어느 Task로 돌아갈지 판단:
- 텍스트/배치 문제 → Task 2 재편집
- 음성 낭독 문제 → Task 1 재편집
- 빌드 에러 → 해당 Task의 Step 3 재검토

---

## Self-Review

**Spec coverage:**

| Spec 결정 사항 | 구현 Task |
|---|---|
| 기존 3개 카드 제거 | Task 2 (old_string에서 전부 삭제) |
| 도입문 1문단 + 카드 2개 + 해시태그 섹션 | Task 2 (new_string) |
| 해시태그는 지식샘터 검색 힌트 | Task 2 (#업무자동화…#AI에이전트 5개) |
| SpeakButton 텍스트/라벨 갱신 | Task 1 |
| 외부 링크 하드코딩 없음 | Task 2 (텍스트로만 "지식샘터") |
| 해시태그 비인터랙티브 | Task 2 (단순 `<span>`) |
| 제목 유지, 확인 버튼 유지 | Task 2 (해당 라인 건드리지 않음) |
| `School` import 정리 | Task 3 |
| `tsc --noEmit` 통과 | Task 1·2·3 Step "타입 검사" |
| UTF-8 인코딩 | Task 1·2 Step "UTF-8 검사" |
| 수동 UI 확인 | Task 4 |

누락 없음.

**Placeholder scan:** "TBD"/"TODO"/"적절히"/"필요시" 등 흐릿한 문구 없음. 모든 Step에 실제 코드/명령어/기대 결과 명시.

**Type consistency:** 새 import 없음, 새 함수/타입 없음, 모두 인라인 JSX. 일관성 이슈 없음.
