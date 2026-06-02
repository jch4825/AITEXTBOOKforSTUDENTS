# l4-4 채점기 재설계 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 4-4 레슨의 가정통신문 예시를 짧은 논술문 채점기로 교체하고, `Lesson44Interactive`를 학년군/톤/항목/척도를 선택해 프롬프트를 라이브 조립하는 빌더 UI로 재구성한다.

**Architecture:** `tutorialData.ts`의 l4-4 `content`와 `interactive` 필드를 수정하고, `Module4Components.tsx`에서 동일한 export 이름(`Lesson44Interactive`)으로 컴포넌트 본문을 통째로 교체한다. `Tutorial.tsx`의 라우팅(`MODULE4_INTERACTIVES['l4-4'] = Lesson44Interactive`)은 변경 없이 그대로 사용된다.

**Tech Stack:** React 18 + TypeScript (strict), Tailwind, 기존 `CopyButton`(`src/components/CopyButton`), 기존 모듈 4 인터랙티브 영역 다크 테마(`#0e1318`/`#1c232b`/`canva-teal`).

**Verification policy:** 이 저장소는 테스트 프레임워크가 없으며 검증은 `npm run lint`(tsc --noEmit) + `npm run check:encoding`(UTF-8) + 수동 브라우저 확인(`npm run dev`)으로 한다. 각 Task의 verification step에서 정확한 명령과 기대 결과를 명시한다.

---

## File Structure

- **Modify**: `src/data/tutorialData.ts:1669-1724` — l4-4 레슨 객체의 `content` 본문과 `interactive` 필드 교체. `visuals`, `title`, `estimatedMinutes`, `order`, `tip`은 그대로 유지.
- **Modify**: `src/views/Module4Components.tsx:160-202` — `Lesson44Interactive` 컴포넌트 본문 전체 교체. export 이름과 prop 시그니처(`{ onExecute }: { onExecute: (...) => void }`)는 그대로 유지하여 `Tutorial.tsx`의 라우팅이 자동으로 새 구현을 쓰도록 한다.
- **No changes**: `src/views/Tutorial.tsx` — 매핑 `'l4-4': Lesson44Interactive`(line 79)가 그대로 새 구현을 가리키므로 손대지 않는다.

---

### Task 1: l4-4 레슨 본문 텍스트 교체

**Files:**
- Modify: `src/data/tutorialData.ts:1680-1723` (l4-4의 `content` 본문 + `interactive` 필드)

- [ ] **Step 1: `content` 본문 교체**

`src/data/tutorialData.ts`에서 `id: 'l4-4'`로 시작하는 객체(line 1669 시작)를 찾는다. `content: \`` 다음부터 닫는 백쿼트(`` ` ``) 직전까지의 본문(현재 line 1681~1714)을 아래 새 본문으로 통째로 교체한다.

기존 본문(line 1681에서 시작하는 단락들)을 다음으로 대체:

```typescript
    content: `
      ## 핵심 메시지
      4-3의 가벼운 Canvas를 넘어, **시스템 프롬프트 + 프롬프트 템플릿**을 결합해 React 기반 UI를 가진 나만의 도구를 만들 수 있습니다.

      4-3에서 Gemini Canvas로 바이브 코딩을 맛보았다면, 이번에는 **Google AI Studio Build**로 내가 만든 규칙(시스템 프롬프트와 프롬프트 템플릿)을 탑재한 본격적인 '앱(소프트웨어)'을 만듭니다. Project·Gems 같은 챗봇형 도구와 결정적으로 다른 점은, **Build는 React 기반 HTML 웹앱**을 만든다는 것입니다. 점수 카드, 시각적 막대, '잘된 점/보완할 점' 박스 같은 UI 요소가 도구의 가치를 본질적으로 끌어올립니다.

      ### 왜 매번 같은 채점 기준을 머릿속으로 다시 떠올리지 않아도 되는가?
      학생의 짧은 글을 채점할 때마다 교사는 같은 기준을 반복합니다. 학년군에 맞는 어휘 기대치, 평가 톤(격려/엄격), 항목 가중치, 맞춤법 점검 강도 같은 규칙은 거의 그대로 유지됩니다. 달라지는 것은 주로 학생 글의 내용과 주제뿐입니다.

      전통적인 방식에서는 이 반복 규칙을 교사가 매번 머릿속에서 다시 적용해야 합니다. 한 반 30명의 글을 같은 기준으로 채점하다 보면 어휘·표현·맞춤법 어디까지 봐줄지 일관성을 유지하는 것 자체에 에너지가 듭니다.

      Google AI Studio의 Build는 자연어 설명을 그대로 웹 앱으로 만들어 주는 기능입니다. "학년군·평가 톤·평가 항목을 받아 학생 글을 채점하는 React 앱을 만들어 줘"라고 적으면, 입력란과 결과 화면이 있는 앱이 만들어집니다.

      교사 업무에서 Build가 의미를 갖는 지점은 반복되는 규칙을 앱 안에 고정해 둘 수 있다는 것입니다. 채점, 알림장, 짧은 안내 문구처럼 양식이나 기준은 같고 내용만 바뀌는 일이 그렇습니다. 챗봇이라면 매번 양식과 말투를 다시 설명해야 하지만, Build로 만든 앱은 빈칸에 값만 채우면 됩니다.

      핵심은 AI에게 일을 더 빨리 시키는 것이 아니라, 자주 시키는 일을 버튼이 있는 도구로 만들어 두는 것입니다. 검토·수정 시간은 남지만, 백지에서 양식을 갖추는 단계가 사라진다는 것만으로도 체감 부담은 달라집니다.

      ### Google AI Studio의 Build 기능으로 채점기 앱 만들기
      1. [Google AI Studio Build](https://aistudio.google.com/build)에 접속합니다. (Google 계정 필요, 새 탭에서 열림)
      2. 오른쪽 **[프롬프트 빌더]**에서 학년군·평가 톤·평가 항목·점수 척도를 선택해 채점기용 시스템 프롬프트와 템플릿을 조립합니다. (4-1·4-2의 행정 중심 프롬프트는 채점기에는 부적합한 정보가 많아 이 레슨에서는 채점기 전용으로 다시 조립합니다.)
      3. 조립된 프롬프트를 **[전체 복사하기]** 버튼으로 복사해 AI Studio Build 입력창에 붙여넣고 지시합니다.


         **예시)**
         - **짧은 논술문 채점기:** "이 규칙으로 학생 글을 채점하는 React 앱을 만들어줘. 학생 글은 텍스트 입력 또는 사진 업로드(OCR)로 받고, 결과는 항목별 점수 카드와 '잘된 점/보완할 점' 박스로 보여줘."
         - **수업용 게임:** "이 규칙에 맞춰 초등 4학년 곱셈 문제를 5개 랜덤으로 출제하고 자동 채점하는 학습 게임 앱을 만들어줘"
      4. 입력 화면에 내가 만든 규칙이 백그라운드에 완전히 세팅되어, 버튼만 누르면 결과를 출력하는 나만의 도구가 곧바로 구동됩니다.

      💡 **주의:** 채점기에 학생 글을 입력할 때 이름이 포함되어 있다면 \`[학생A]\` 같은 자리표시자로 익명화한 뒤 입력하세요. 사진 업로드는 Gemini OCR로 글자를 읽지만, 손글씨나 흐릿한 사진은 잘못 인식될 수 있으니 채점 결과를 보기 전에 인식된 텍스트를 한 번 확인하세요.


      ---


      바이브코딩을 더 체계적으로 진행하려면 먼저 인공지능과 대화하며 자신의 아이디어를 구체화합니다. 그다음 그 아이디어를 바탕으로 **PRD(Product Requirements Document, 제품 요구사항 문서)**를 작성해 달라고 요청합니다. PRD는 "어떤 문제를 해결할 앱인지, 누가 쓰는지, 어떤 버튼과 입력칸이 필요한지, 결과물은 어떤 형식이어야 하는지"를 정리한 앱 설계 설명서입니다. 완성된 PRD를 개발 인공지능에게 제시해 개발 계획을 세우게 하고, 마지막으로 그 개발 계획을 단계별로 실행해 달라고 요구하면, 막연한 아이디어가 실제로 작동하는 앱으로 이어집니다.

      💡 **'앱'과 '에이전트'의 차이:** 여기서 만드는 것은 입력을 받아 정해진 양식으로 출력해 주는 **AI 앱(도구)**입니다. 반면 '에이전트'는 여기서 한 걸음 더 나아가, AI가 **스스로 도구를 호출하고 여러 단계를 거쳐 목표를 달성**하는 수준을 말합니다. 4-5(MCP)·4-6(Skill)에서 다룰 외부 연결이 결합되는 순간, 우리는 비로소 에이전트 단계에 들어서고, 그 전체 제어 층을 **'하네스'**라고 부릅니다.
    \`,
```

주의: 이 본문 안에 등장하는 백틱(\`) 문자는 모두 `\\\`` 가 아니라 raw 백쿼트 그대로 둔다. 단 본문 위쪽의 `\`[학생A]\`` 처럼 인라인 코드 표시를 위한 백틱은 `\\\``로 이스케이프해야 한다(전체가 백쿼트 템플릿 리터럴 안에 있기 때문). 위 코드 블록의 `\`[학생A]\`` 표기는 그대로 복사해 붙여넣으면 된다.

- [ ] **Step 2: `interactive` 필드 교체**

같은 객체의 `interactive` 필드(현재 line 1719~1723)를 다음으로 교체:

```typescript
    interactive: {
      prompt: "프롬프트 빌더로 채점기 앱용 시스템 프롬프트+템플릿 조립해 보기",
      initialInput: "",
      answer: "Build의 핵심 가치는 시스템 프롬프트와 템플릿을 결합해 React 기반 UI를 가진 진짜 웹앱을 만들 수 있다는 것입니다. Project·Gems가 챗봇 형태로 끝나는 것과 달리, 점수 카드 같은 UI 요소가 도구의 가치를 본질적으로 끌어올립니다."
    }
```

`title`, `estimatedMinutes`, `order`, `visuals`, `tip` 필드는 손대지 않는다.

- [ ] **Step 3: 타입체크 통과 확인**

Run: `npm run lint`
Expected: 출력 마지막에 `> tsc --noEmit`만 나오고 에러 없음.

- [ ] **Step 4: 인코딩 통과 확인**

Run: `npm run check:encoding`
Expected: `Encoding check passed for 45 files.`

- [ ] **Step 5: 다음 Task로 (아직 커밋하지 않음)**

본문 텍스트와 인터랙티브 빌더는 짝을 이루는 변경이므로 Task 2까지 끝낸 뒤 한 번에 커밋한다. 지금은 다음 Task로 진행.

---

### Task 2: `Lesson44Interactive`를 프롬프트 빌더로 교체

**Files:**
- Modify: `src/views/Module4Components.tsx:160-202` (`Lesson44Interactive` 함수 전체)

- [ ] **Step 1: 기존 `Lesson44Interactive` 본문 통째 교체**

`src/views/Module4Components.tsx`에서 `export const Lesson44Interactive = ...`로 시작하는 함수(line 160)를 찾는다. 닫는 `};`(line 202)까지 통째로 아래 새 본문으로 교체:

```typescript
export const Lesson44Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string, hideDocsButton?: boolean}) => void }) => {
  const [gradeBand, setGradeBand] = useState<'g12' | 'g34' | 'g56'>('g34');
  const [tone, setTone] = useState<'encourage' | 'balanced' | 'strict'>('balanced');
  const [items, setItems] = useState<Record<string, boolean>>({
    '주제 명확성': true,
    '근거·이유': true,
    '표현·문장': true,
    '맞춤법': true,
    '창의성': false,
  });
  const [scale, setScale] = useState<3 | 5>(5);

  const GRADE_BAND_LABEL: Record<typeof gradeBand, string> = {
    g12: '1-2학년군',
    g34: '3-4학년군',
    g56: '5-6학년군',
  };
  const TONE_LABEL: Record<typeof tone, string> = {
    encourage: '격려 중심',
    balanced: '균형',
    strict: '엄격',
  };
  const SYSTEM_PROMPT_BY_BAND: Record<typeof gradeBand, string> = {
    g12: '받침과 한두 문장 표현을 격려 중심으로 평가합니다. 자기 생각을 글로 옮긴 시도 자체를 인정하고, 맞춤법은 가장 기본적인 자모/받침 오류 위주로만 지적합니다.',
    g34: '두세 문장으로 이유 들기를 평가합니다. 맞춤법은 본격적으로 점검하되 학생이 위축되지 않도록 격려 톤을 유지합니다.',
    g56: '짧은 단락에서 근거와 표현을 평가합니다. 주장-근거 구조를 명확히 점검하고, 어휘·문장 다양성과 글의 흐름을 함께 봅니다.',
  };

  const selectedItems = Object.keys(items).filter(k => items[k]);
  const itemsBlock = selectedItems.length > 0
    ? selectedItems.map((it, i) => `${i + 1}. ${it}`).join('\n')
    : '(평가 항목을 1개 이상 선택하세요)';

  const fullPrompt = `[시스템 프롬프트]
당신은 초등 ${GRADE_BAND_LABEL[gradeBand]} 담임교사로, ${TONE_LABEL[tone]} 톤으로 학생의 짧은 글을 평가합니다. ${SYSTEM_PROMPT_BY_BAND[gradeBand]}

[프롬프트 템플릿 — 학생 글 채점]
다음 학생 글을 ${selectedItems.length}개 항목으로 ${scale}점 척도 채점:
${itemsBlock}

출력 형식:
- 항목별 점수 (${scale}점 척도)
- 각 항목별 한 줄 피드백
- "잘된 점" / "보완할 점" 두 박스
- 종합 한 단락 (학년군 톤에 맞춘 격려)

[입력 처리]
사진 입력의 경우, OCR로 읽은 텍스트를 사용자에게 먼저 보여주고 확인받은 뒤 채점하시오. 학생 이름이 포함되어 있으면 [학생A] 같은 자리표시자로 처리하시오.`;

  const toggleItem = (key: string) => setItems(prev => ({ ...prev, [key]: !prev[key] }));

  const handleTest = () => {
    onExecute({
      title: '프롬프트 빌더 — 조립된 채점기 프롬프트',
      content: fullPrompt,
      point: 'Build의 핵심 가치는 시스템 프롬프트(누구로 행동할지)와 템플릿(매번 채울 양식)을 결합해 React 기반 UI를 가진 진짜 웹앱을 만들 수 있다는 것입니다. Project나 Gems가 챗봇 형태로 끝나는 것과 달리, Build는 점수 카드·시각적 막대 같은 UI 요소가 본질적 가치를 더하는 도구를 만듭니다.',
      hideDocsButton: true,
    });
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">프롬프트 빌더 — 짧은 논술문 채점기</div>

      {/* 영역 ① 시스템 프롬프트 빌더 */}
      <div className="bg-[#13202d] p-4 rounded-lg border border-cyan-900/60">
        <div className="text-xs font-bold text-cyan-300 mb-3">① 시스템 프롬프트 빌더 (4-1 응용)</div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-400 mb-1.5">학년군</div>
            <div className="flex gap-2">
              {(['g12', 'g34', 'g56'] as const).map(g => (
                <button key={g} onClick={() => setGradeBand(g)} className={`flex-1 py-2 px-2 rounded text-xs font-bold border ${gradeBand === g ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  {GRADE_BAND_LABEL[g]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1.5">평가 톤</div>
            <div className="flex gap-2">
              {(['encourage', 'balanced', 'strict'] as const).map(t => (
                <button key={t} onClick={() => setTone(t)} className={`flex-1 py-2 px-2 rounded text-xs font-bold border ${tone === t ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  {TONE_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 영역 ② 프롬프트 템플릿 빌더 */}
      <div className="bg-[#1d1828] p-4 rounded-lg border border-purple-900/60">
        <div className="text-xs font-bold text-purple-300 mb-3">② 프롬프트 템플릿 빌더 (4-2 응용)</div>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-400 mb-1.5">평가 항목 (체크박스)</div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.keys(items).map(k => (
                <button key={k} onClick={() => toggleItem(k)} className={`text-left py-1.5 px-2 rounded text-xs border flex items-center gap-2 ${items[k] ? 'bg-purple-700/40 border-purple-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  <span className={`w-3 h-3 rounded border ${items[k] ? 'bg-purple-400 border-purple-300' : 'border-gray-600'} flex items-center justify-center`}>
                    {items[k] && <Check size={10} className="text-[#0e1318]" />}
                  </span>
                  {k}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1.5">점수 척도</div>
            <div className="flex gap-2">
              {([3, 5] as const).map(s => (
                <button key={s} onClick={() => setScale(s)} className={`flex-1 py-2 px-2 rounded text-xs font-bold border ${scale === s ? 'bg-purple-600 border-purple-500 text-white' : 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  {s}점 척도
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 결과 영역 */}
      <div className="relative bg-[#1c232b] p-4 rounded-lg border border-gray-700">
        <div className="text-xs font-bold text-gray-400 mb-2">조립된 프롬프트 (Build 입력창에 그대로 붙여넣기)</div>
        <CopyButton text={fullPrompt} className="absolute top-2 right-2" />
        <pre className="text-[11px] text-canva-gray whitespace-pre-wrap font-mono mt-2 max-h-64 overflow-y-auto">{fullPrompt}</pre>
      </div>

      <div className="text-[11px] text-amber-300/80 bg-amber-950/30 border border-amber-900/40 rounded-lg p-3 leading-relaxed">
        💡 OCR 인식 한계도 프롬프트에 명시되어 있어, 앱이 학생 글을 한 번 보여준 뒤 채점하도록 합니다. 학생 이름은 자리표시자로 익명화 후 입력하세요.
      </div>

      <div className="mt-2 text-sm">
        <div className="flex gap-2">
          <button onClick={handleTest} className="w-full py-3 bg-canva-teal text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg">조립된 프롬프트 미리보기</button>
        </div>
      </div>
    </div>
  );
};
```

`Check` 아이콘은 이미 line 2의 `import { Check } from 'lucide-react'`로 import되어 있으므로 추가 import 없음. `useState`, `CopyButton`도 이미 import되어 있음.

- [ ] **Step 2: 타입체크 통과 확인**

Run: `npm run lint`
Expected: 출력 마지막에 `> tsc --noEmit`만 나오고 에러 없음.

만약 `Cannot find name 'Check'` 또는 `'CopyButton'` 같은 에러가 나면 line 1~3의 import 문이 손상된 것이니 원상 복구.

만약 `Property 'g12' is missing` 같은 타입 에러가 나면 `Record<typeof gradeBand, string>` 객체 리터럴에 누락된 키가 있는지 확인.

- [ ] **Step 3: 인코딩 통과 확인**

Run: `npm run check:encoding`
Expected: `Encoding check passed for 45 files.`

- [ ] **Step 4: 수동 브라우저 검증**

Run (background): `npm run dev`

브라우저에서 `http://localhost:3000/?lesson=l4-4`로 접속하여 다음을 확인:

1. 좌측 본문에 "왜 매번 같은 채점 기준을..." 단락이 보이고, 가정통신문 관련 단락은 사라졌는지.
2. 좌측 본문 하단에 "💡 주의: 채점기에 학생 글을 입력할 때 이름이 포함되어 있다면 `[학생A]`..." 안내가 보이는지.
3. 우측 인터랙티브 영역에 "프롬프트 빌더 — 짧은 논술문 채점기" 제목이 있는지.
4. 학년군 버튼 3개(1-2/3-4/5-6학년군), 평가 톤 버튼 3개(격려/균형/엄격) 클릭 시 선택 표시(파란 배경)가 바뀌고, 하단 "조립된 프롬프트" 텍스트 영역의 시스템 프롬프트 단락이 라이브로 갱신되는지.
5. 평가 항목 체크박스(주제 명확성/근거·이유/표현·문장/맞춤법/창의성) 클릭 시 보라 배경 토글되고, 텍스트 영역의 항목 번호 매김이 갱신되는지.
6. 점수 척도 3점/5점 클릭 시 텍스트 영역의 척도 표기가 갱신되는지.
7. 평가 항목을 모두 해제하면 텍스트 영역에 `(평가 항목을 1개 이상 선택하세요)` 안내가 나오는지.
8. 결과 영역 우상단의 [복사] 버튼 클릭 시 클립보드에 전체 프롬프트가 복사되는지(다른 텍스트 에디터에 붙여넣어 확인).
9. 하단 "조립된 프롬프트 미리보기" 버튼 클릭 시 m4 팝업이 열리고, 팝업 안에 조립된 프롬프트와 학습 포인트("Build의 핵심 가치는...")가 보이는지.
10. 모바일 폭(개발자 도구로 375px 가정)에서 두 빌더 영역(시안색·보라색)이 세로로 자연스럽게 쌓이고 텍스트가 잘리지 않는지.

문제가 있으면 그 항목을 메모하고, 코드의 해당 부분을 수정한 뒤 다시 검증한다.

- [ ] **Step 5: 두 파일 한 번에 커밋**

Run:
```bash
git add src/data/tutorialData.ts src/views/Module4Components.tsx
git commit -m "$(cat <<'EOF'
Redesign l4-4 around essay grader with prompt builder

Replaces the unreliable AI Studio Build "household letter app" example
with a short essay grader, and rebuilds Lesson44Interactive as a live
prompt builder: grade-band + tone choose the system prompt, criteria +
scale choose the rubric template, and the assembled prompt updates
live for one-click copy into Build. Adds OCR + anonymization warnings
inline with module 4's honest-about-limits tone.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
EOF
)"
```

Expected: commit 성공 메시지. 푸쉬는 사용자 명시 요청이 있을 때만.

---

## Self-Review

**Spec coverage:**
- ✅ 가정통신문 예시 교체 → Task 1 본문 단락 교체
- ✅ 수업용 게임 예시 유지 → Task 1 본문 step 3 두 번째 bullet 유지
- ✅ PRD/바이브코딩 단락 유지 → Task 1 본문 끝 `---` 이후 단락 유지
- ✅ '앱과 에이전트' 박스 유지 → Task 1 본문 마지막 줄 유지
- ✅ tip 유지 → Task 1 step 2에서 명시적으로 손대지 않음
- ✅ 시스템 프롬프트 빌더 (학년군 1-2/3-4/5-6, 톤 격려/균형/엄격) → Task 2 영역 ①
- ✅ 프롬프트 템플릿 빌더 (항목 체크박스 5개, 척도 3/5) → Task 2 영역 ②
- ✅ 라이브 갱신 + 복사 버튼 → Task 2 결과 영역 + `CopyButton`
- ✅ Build 안내 박스 (OCR 한계 명시) → Task 2 amber 안내 박스
- ✅ 생성 프롬프트에 OCR 한계 + 익명화 한 줄 → Task 2 `fullPrompt` [입력 처리] 단락
- ✅ 본문 OCR 한계 한 문장 → Task 1 본문 "💡 주의" 단락
- ✅ 본문 익명화 한 문장 → Task 1 본문 "💡 주의" 단락
- ✅ 두 영역 시각적 분리 (border + 라벨 헤더 + 색상 차이) → Task 2 시안색 vs 보라색 카드

**Placeholder scan:** TBD/TODO 없음. 모든 단계가 실제 코드를 담고 있음. ✅

**Type consistency:**
- `gradeBand: 'g12' | 'g34' | 'g56'` — `GRADE_BAND_LABEL`, `SYSTEM_PROMPT_BY_BAND` 둘 다 같은 union을 키로 사용. ✅
- `tone: 'encourage' | 'balanced' | 'strict'` — `TONE_LABEL`이 같은 union 사용. ✅
- `scale: 3 | 5` — 점수 척도 라디오 `[3, 5] as const`와 일치. ✅
- `onExecute` prop 시그니처 — 기존(line 160)과 동일. ✅
- `interactive` 필드 — `Lesson` 타입(`tutorialData.ts` line 17~26)의 필수 필드 prompt/initialInput/answer 모두 채움. ✅

---

## Notes

- 이미지(`/tutorial-visuals/module4/l4-4-visual.webp`)와 alt/caption은 일반적인 "규칙 → 앱" 시각이라 그대로 둔다.
- 푸쉬는 사용자가 별도로 "푸쉬"라고 말할 때만 한다 (이 저장소 관행).
- l4-4가 m4의 `MODULE4_INTERACTIVES`에 `'l4-4': Lesson44Interactive`로 매핑되어 있으므로(`Tutorial.tsx:79`), 컴포넌트 이름과 prop 시그니처만 유지하면 라우팅은 자동으로 새 구현을 쓴다.
