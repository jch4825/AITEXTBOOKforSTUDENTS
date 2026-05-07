import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Lesson } from '../data/tutorialData';

export const CopyButton = ({ text, className = "" }: { text: string, className?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  
  return (
    <button 
      onClick={handleCopy}
      className={`absolute top-2 right-2 p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-[10px] ${className}`}
    >
      {copied ? <><Check size={12} /> 복사됨!</> : <><Copy size={12} /> 복사</>}
    </button>
  );
};

export const Lesson42Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string}) => void }) => {
  const [taskType, setTaskType] = useState('가정통신문');
  const [rules, setRules] = useState<Record<string, boolean>>({});

  const taskOptions: Record<string, string[]> = {
    '가정통신문': [
      '상단에 학교명·날짜 표시',
      '제목은 한 줄로 간결하게',
      '목적·내용·안내사항·문의처 순서 유지',
      '어조: 공식적이되 친근하게',
      '마지막에 담당 교사·연락 가능 시간 표시',
      '"검토 후 사용하세요" 안내 자동 포함'
    ],
    '공문 회신': [
      '수신·발신·제목·본문 형식 준수',
      '행정 어체(해요체 금지) 사용',
      '붙임 문서 목록 체계적 정리',
      '결재란 안내 포함'
    ],
    '학부모 안내 문자': [
      '100자 이내로 핵심 정보만',
      '정중하고 부드러운 어조',
      '마지막에 담당자 서명 포함'
    ],
    '교육청 보고서': [
      '목적·현황·추진계획·기대효과 구조',
      '수치 기반으로 객관적인 서술',
      '보고서 개조식(bullet point) 작성'
    ]
  };

  useEffect(() => {
    // Reset rules when task type changes
    const initialRules: Record<string, boolean> = {};
    if (taskOptions[taskType]) {
      taskOptions[taskType].forEach(rule => initialRules[rule] = true);
    }
    setRules(initialRules);
  }, [taskType]);

  const handleRuleToggle = (rule: string) => {
    setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
  };

  const [generated, setGenerated] = useState("");

  const handleGenerate = () => {
    const selectedRules = Object.entries(rules).filter(([_, checked]) => checked).map(([rule, _], idx) => `${idx + 1}. ${rule}`);
    
    const promptText = `[4-1에서 만든 학교 컨텍스트]를 여기에 붙여넣습니다.

[${taskType} 프롬프트 템플릿 규칙]
${taskType} 작성 시 아래 규칙을 반드시 따릅니다:
${selectedRules.join('\n')}

이 설정으로 ${taskType} 주제만 말하면 즉시 초안을 작성합니다.`;
    
    onExecute({
      title: '나만의 행정 업무 프롬프트 템플릿',
      content: promptText,
      point: '완성된 프롬프트 템플릿을 프롬프트 창에 넣으면, 매번 형식을 지정하지 않아도 "[입력 정보]"만 바꾸어 무한 재사용이 가능해집니다.'
    });
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">나의 행정 업무 프롬프트 템플릿 만들기</div>
      
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 block mb-2">1단계: 업무 유형 선택</label>
          <select 
            value={taskType} 
            onChange={e => setTaskType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-canva-purple"
          >
            {Object.keys(taskOptions).map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        
        <div>
          <label className="text-xs text-gray-400 block mb-2">2단계: 프롬프트 템플릿 구성 요소 선택</label>
          <div className="space-y-2 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
            {taskOptions[taskType]?.map(rule => (
              <label key={rule} className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={rules[rule] || false} 
                  onChange={() => handleRuleToggle(rule)} 
                  className="rounded border-gray-600 text-canva-purple focus:ring-canva-purple bg-gray-700 mt-1 flex-shrink-0" 
                />
                <span className="leading-tight">{rule}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={handleGenerate}
        className="w-full py-3 bg-canva-purple text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg mt-2"
      >
        프롬프트 템플릿 생성하기
      </button>
    </div>
  );
};

export const Lesson43Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string, hideDocsButton?: boolean}) => void }) => {
  const canvasPrompt = `학생 이름을 입력하면 다음 3가지를 자동 생성해 주는 간단한 웹 도구를 만들어줘:
1) 그 학생을 위한 칭찬 문구 3가지 (학습 태도/교우 관계/노력 측면)
2) 복사 버튼
3) "다른 문구 보기" 새로고침 버튼
색감은 부드러운 파스텔 톤으로, 초등학교 교사가 쓴다는 느낌으로 만들어줘.`;

  const handleTest = () => {
    onExecute({
      title: 'Gemini Canvas 체험 시뮬레이션 결과',
      content: `### 🎨 Gemini Canvas가 즉시 생성하는 화면 (예상)\n\n\`\`\`text\n[Canvas 미리보기]\n\n┌─────────────────────────────────────┐\n│  🌸 학생 칭찬 문구 생성기           │\n├─────────────────────────────────────┤\n│  학생 이름: [김하늘        ]        │\n│                                     │\n│  [ ✨ 칭찬 문구 생성하기 ]          │\n│                                     │\n│  💬 생성된 칭찬:                    │\n│  1. "김하늘 학생은 모둠 활동에서…"   │\n│  2. "꾸준히 숙제를 제출하는 모습…"   │\n│  3. "친구를 배려하는 태도가…"        │\n│                                     │\n│  [ 📋 복사 ]  [ 🔄 다른 문구 보기 ]  │\n└─────────────────────────────────────┘\n\n(대화창 안에서 바로 동작. 수정하고 싶으면 "버튼 색을 보라색으로 바꿔줘" 같이 말만 하면 됨.)\n\`\`\``,
      point: '단 한 번의 자연어 지시만으로 버튼·입력창·출력 영역이 모두 작동하는 미니 도구가 만들어집니다. 이것이 가장 낮은 진입 장벽의 바이브 코딩이며, 다음 4-4에서는 이를 영구 재사용 가능한 "앱"으로 확장합니다.',
      hideDocsButton: true
    });
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">Gemini Canvas 체험 가이드</div>

      <div className="text-sm text-gray-300 bg-gray-800/50 p-4 rounded-lg">
        <ul className="list-decimal pl-4 space-y-2">
          <li><a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="text-canva-teal hover:underline font-bold">Google Gemini</a> 에 접속해 로그인합니다.</li>
          <li>입력창 하단의 <strong>[Canvas]</strong> 옵션을 켭니다.</li>
          <li>아래 예시 프롬프트를 붙여 넣고 전송합니다. 오른쪽 Canvas 창에 즉시 작동하는 도구가 생성됩니다.</li>
          <li>추가 대화로 색상·기능을 조정해 봅니다. (예: "버튼 색을 보라색으로 바꿔줘")</li>
        </ul>
      </div>

      <div className="relative bg-[#1c232b] p-4 rounded-lg border border-gray-700">
        <div className="text-xs font-bold text-gray-400 mb-2">Canvas에 붙여넣을 예시 프롬프트</div>
        <CopyButton text={canvasPrompt} />
        <pre className="text-xs text-canva-gray whitespace-pre-wrap font-mono mt-2">{canvasPrompt}</pre>
      </div>

      <div className="mt-2 text-sm">
        <div className="text-xs text-gray-400 mb-2">Canvas가 만들어낼 결과 시뮬레이션</div>
        <div className="flex gap-2">
          <button onClick={handleTest} className="w-full py-3 bg-canva-teal text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg">Gemini Canvas 결과 미리보기</button>
        </div>
      </div>
    </div>
  );
};

export const Lesson44Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string, hideDocsButton?: boolean}) => void }) => {
  const promptText = `(여기에 4-1에서 만든 학교 시스템 프롬프트를 붙여넣으세요)

(여기에 4-2에서 만든 행정 업무 프롬프트 템플릿을 적절히 붙여넣으세요)

위 규칙을 바탕으로 사용자가 요구하는 문서를 작성하고, 사용자가 앱에서 문서를 편하게 만들어갈 수 있도록 만들어주세요.`;

  const handleTest = () => {
    onExecute({
      title: '바이브코딩으로 앱 제작 시뮬레이션 결과',
      content: `### 🚀 행정 자동화 앱 초안 생성 완료\n\n\`\`\`text\n[시스템] AI가 선생님의 프롬프트를 바탕으로 '가정통신문 자동 작성 앱'을 구성했습니다.\n\n사용자 인터페이스 (UI) 예상:\n1. '주제를 입력하세요' 텍스트 박스\n2. '문서 생성' 버튼\n3. '생성된 문서 출력' 창\n\nAI가 입력된 규칙(4-1, 4-2)을 시스템 백그라운드에 고정하고,\nUI를 통해 입력된 주제만 넘겨받아 완벽하게 포맷된 문서를 출력하는 앱이 만들어집니다.\n\`\`\``,
      point: '원래는 코드를 짜야 하지만, Google AI Studio Build에서는 이런 "지시문(Prompt)"만으로도 즉시 나만의 맞춤형 도구를 만들 수 있습니다. 이것이 바로 코딩 없이 대화만으로 프로그램을 만드는 "바이브코딩(Vibe Coding)"의 세계입니다.',
      hideDocsButton: true
    });
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">바이브 코딩으로 앱 맛보기 (Google AI Studio Build)</div>
      
      <div className="text-sm text-gray-300 bg-gray-800/50 p-4 rounded-lg">
        <ul className="list-decimal pl-4 space-y-2">
          <li><a href="https://aistudio.google.com/build" target="_blank" rel="noopener noreferrer" className="text-canva-teal hover:underline font-bold">Google AI Studio Build</a> 에 접속하여 새 창을 엽니다.</li>
          <li>기존에 작성해 두었던 <strong>[4-1 시스템 프롬프트]</strong>와 <strong>[4-2 프롬프트 템플릿]</strong> 내용을 조합합니다.</li>
          <li>AI에게 아래와 같이 지시하여 나만의 도구를 만듭니다.</li>
        </ul>
      </div>

      <div className="relative bg-[#1c232b] p-4 rounded-lg border border-gray-700">
        <div className="text-xs font-bold text-gray-400 mb-2">Build 화면에 붙여넣을 템플릿</div>
        <CopyButton text={promptText} />
        <pre className="text-xs text-canva-gray whitespace-pre-wrap font-mono mt-2">{promptText}</pre>
      </div>

      <div className="mt-2 text-sm">
        <div className="text-xs text-gray-400 mb-2">안내대로 앱을 만들었을 때의 결과 시뮬레이션</div>
        <div className="flex gap-2">
          <button onClick={handleTest} className="w-full py-3 bg-canva-teal text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg">바이브코딩 적용 결과 확인</button>
        </div>
      </div>
    </div>
  );
};

export const Lesson47Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string}) => void }) => {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatSent, setChatSent] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [createSubmenuOpen, setCreateSubmenuOpen] = useState(false);

  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      setStep(5);
    }, 1600);
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    setChatSent(true);
    setAiTyping(true);
    setTimeout(() => {
      setAiTyping(false);
      setShowResponse(true);
    }, 1800);
  };

  const handleComplete = () => {
    const resultJSX = (
      <div className="flex flex-col gap-3 w-full">
        <div className="border border-canva-teal/50 bg-canva-teal/10 rounded-lg p-4">
          <h4 className="text-canva-teal font-bold mb-2">✅ Skill 연결 후 AI 응답</h4>
          <pre className="text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">{`[HWPX 공문/기안문 자동 채우기 스킬 v2] 호출됨

✓ 기안문 서식 적용 완료
✓ 수신·참조·제목·본문·붙임 자동 구성
✓ 행정 어체 변환 완료

📎 현장체험학습_기안문.hwpx (생성 완료)
  → 한글 2020 이상에서 바로 열림`}</pre>
        </div>
        <div className="border border-gray-700 bg-gray-800 rounded-lg p-4">
          <h4 className="text-gray-300 font-bold mb-2">❌ Skill 미연결 상태의 일반 Claude</h4>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed">{`기안문 본문을 텍스트로 작성해 드립니다.
복사해서 한글에 붙여넣고 서식을 직접 맞추세요...
(hwpx 파일 직접 생성 불가)`}</pre>
        </div>
      </div>
    );
    onExecute({
      title: 'HWPX 공문 스킬 연결 결과',
      content: resultJSX,
      point: 'Skill을 한 번만 내 Claude 계정에 업로드해 두면, 이후에는 주제만 말해도 한글에서 바로 열리는 hwpx 파일이 자동 생성됩니다. 서식·어체·결재란까지 자동으로 맞춰주기 때문에 공문 작성 시간이 극적으로 줄어듭니다.'
    });
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-0 border border-gray-800 flex flex-col overflow-hidden">
      {/* Claude 시뮬레이션 헤더 */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1d24] border-b border-gray-800">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-[10px] font-bold text-white">C</div>
        <div className="text-xs text-gray-300 font-semibold">Claude.ai — Skill 업로드 시뮬레이터</div>
        <div className="ml-auto flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70"></div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 좌측 사이드바 (Claude 스타일) */}
        <div className="w-[180px] bg-[#141820] border-r border-gray-800 p-3 flex flex-col gap-1.5">
          <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">메뉴</div>
          <div className="text-xs text-gray-400 px-2 py-1.5 rounded hover:bg-gray-800/50">💬 새 대화</div>
          <div className="text-xs text-gray-400 px-2 py-1.5 rounded hover:bg-gray-800/50">📁 Projects</div>
          <button
            onClick={() => step === 1 && setStep(2)}
            className={`text-left text-xs px-2 py-1.5 rounded transition-all ${step >= 2 ? 'bg-canva-purple/20 text-canva-purple border border-canva-purple/40' : 'text-gray-300 hover:bg-gray-800/70 border border-transparent btn-highlight'}`}
          >
            {step >= 2 ? '✓' : '➕'} 커스터마이즈
          </button>
          <div className="text-xs text-gray-500 px-2 py-1.5">⚙️ 설정</div>
          <div className="mt-auto border-t border-gray-800 pt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setAddMenuOpen(false);
                setCreateSubmenuOpen(false);
                if (step === 5) {
                  // 업로드 완료 화면에서 되돌아가면 업로드/대화 상태도 초기화
                  setUploaded(false);
                  setChatSent(false);
                  setChatInput('');
                  setShowResponse(false);
                  setAiTyping(false);
                }
                setStep(s => Math.max(1, s - 1));
              }}
              disabled={step <= 1}
              className="text-[10px] px-2 py-1 rounded border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="직전 단계로 돌아가기"
            >
              ← 이전
            </button>
            <div className="text-[10px] text-gray-600">
              <span className="text-canva-teal font-bold">{Math.min(step, 5)}</span>
              <span className="text-gray-700">/5</span>
            </div>
          </div>
        </div>

        {/* 우측 메인 패널 */}
        <div className="flex-1 overflow-y-auto">
          {/* Step 1: 시작 */}
          {step === 1 && (
            <div className="p-5 flex flex-col gap-4">
              <div className="text-white font-bold text-sm">🎯 목표: HWPX 공문 스킬 연결하기</div>
              <div className="bg-[#1c232b] border border-gray-700 rounded-lg p-4 text-xs text-gray-300 leading-relaxed">
                이 스킬을 내 Claude에 올리면, 대화만으로 <span className="text-canva-teal font-bold">아래아한글(.hwpx) 공문·기안문 파일</span>이 자동으로 생성됩니다.
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-200">
                  📎 스킬 출처: <a href="https://blog.naver.com/metagwc/224253033223" target="_blank" rel="noopener noreferrer" className="text-amber-300 underline hover:text-amber-100">HWPX 공문/기안문 자동 채우기 스킬 v2 (메타교육 블로그)</a>
                </div>
              </div>
              <button onClick={() => setStep(2)} className="py-2.5 bg-canva-purple text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors">
                시작하기 → 좌측 [+ 커스터마이즈] 클릭
              </button>
            </div>
          )}

          {/* Step 2: Customize 첫 화면 — 좌측 [스킬] 탭 클릭 */}
          {step === 2 && (
            <div className="p-5 flex flex-col gap-4">
              <div className="text-white font-bold text-sm">Step 1/3 · Customize 화면 — 좌측 [스킬] 탭 선택</div>
              <div className="bg-[#1c232b] border border-gray-700 rounded-lg overflow-hidden">
                {/* Customize 상단 헤더 */}
                <div className="px-3 py-2 border-b border-gray-700 text-[11px] text-gray-400 flex items-center gap-1.5">
                  ← Customize
                </div>
                <div className="flex min-h-[260px]">
                  {/* 좌측 탭 컬럼 */}
                  <div className="w-[150px] border-r border-gray-700 p-2 flex flex-col gap-1">
                    <button
                      onClick={() => setStep(3)}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded text-canva-teal bg-canva-teal/10 border border-canva-teal/40 font-bold btn-highlight btn-highlight-teal"
                    >
                      📜 스킬
                    </button>
                    <div className="text-[11px] px-2.5 py-1.5 rounded text-gray-400">
                      🔌 커넥터
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700/60">
                      <div className="flex items-center justify-between px-1.5 py-1 text-[10px] text-gray-500">
                        <span>개인 플러그인</span>
                        <span className="text-gray-600">+</span>
                      </div>
                      <div className="text-[10px] text-gray-600 px-1.5 py-1 leading-snug">
                        플러그인으로 Claude에게 역할 수준의 전문성 부여
                      </div>
                      <button className="w-full mt-2 px-2 py-1.5 text-[10px] text-gray-400 border border-gray-700 rounded">
                        플러그인 탐색
                      </button>
                    </div>
                  </div>
                  {/* 우측 메인 — 빈 상태 */}
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                    <div className="text-3xl mb-2">💼</div>
                    <div className="text-sm text-gray-200 font-bold mb-1">Claude 맞춤설정</div>
                    <div className="text-[11px] text-gray-500 mb-4 max-w-[280px]">
                      스킬, 커넥터, 플러그인은 Claude가 사용자와 함께 작업하는 방식을 결정합니다.
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-[260px]">
                      <div className="flex items-center gap-2 px-3 py-2 border border-gray-700 rounded text-left">
                        <span className="text-base">🔌</span>
                        <div className="flex-1">
                          <div className="text-[11px] text-gray-200 font-semibold">앱 연결</div>
                          <div className="text-[9px] text-gray-500">Claude가 이미 사용 중인 도구를 읽고 쓸 수 있도록</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-2 border border-gray-700 rounded text-left">
                        <span className="text-base">📜</span>
                        <div className="flex-1">
                          <div className="text-[11px] text-gray-200 font-semibold">새 스킬 만들기</div>
                          <div className="text-[9px] text-gray-500">Claude에게 프로세스, 팀 규범, 전문 지식을 가르치세요</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-gray-500">
                👆 좌측의 <span className="text-canva-teal font-bold">[📜 스킬]</span> 탭을 클릭하세요.
              </div>
            </div>
          )}

          {/* Step 3: 스킬 탭 — [+] 버튼 → 스킬 업로드 */}
          {step === 3 && (
            <div className="p-5 flex flex-col gap-4">
              <div className="text-white font-bold text-sm">Step 2/3 · 스킬 탭에서 [+] → [스킬 업로드]</div>
              <div className="bg-[#1c232b] border border-gray-700 rounded-lg overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-700 text-[11px] text-gray-400 flex items-center gap-1.5">
                  ← Customize
                </div>
                <div className="flex min-h-[280px]">
                  {/* 좌측 탭 컬럼 (스킬 선택됨) */}
                  <div className="w-[130px] border-r border-gray-700 p-2 flex flex-col gap-1">
                    <div className="text-[11px] px-2.5 py-1.5 rounded text-canva-teal bg-canva-teal/15 border border-canva-teal/40 font-bold">
                      📜 스킬
                    </div>
                    <div className="text-[11px] px-2.5 py-1.5 rounded text-gray-400">
                      🔌 커넥터
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-700/60 flex items-center justify-between px-1.5 py-1 text-[10px] text-gray-500">
                      <span>개인 플러그인</span>
                      <span className="text-gray-600">+</span>
                    </div>
                  </div>
                  {/* 중간 컬럼 — 스킬 리스트 */}
                  <div className="flex-1 p-3 relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-xs text-gray-200 font-bold">스킬</div>
                      <div className="flex items-center gap-1.5">
                        <button className="w-6 h-6 rounded text-gray-500 hover:bg-gray-800 flex items-center justify-center text-xs">
                          🔍
                        </button>
                        <button
                          onClick={() => { setAddMenuOpen(v => !v); setCreateSubmenuOpen(false); }}
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all ${
                            addMenuOpen
                              ? 'bg-canva-purple text-white'
                              : 'text-canva-purple bg-canva-purple/10 border border-canva-purple/40 btn-highlight'
                          }`}
                          title="추가"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 mb-2">개인 스킬</div>
                    <div className="border border-dashed border-gray-700 rounded p-4 text-center text-[10px] text-gray-500">
                      아직 추가된 개인 스킬이 없습니다
                    </div>

                    {/* [+] 드롭다운 메뉴 */}
                    {addMenuOpen && (
                      <div className="absolute top-10 right-3 z-20 bg-[#0f1318] border border-gray-700 rounded-lg shadow-2xl py-1 min-w-[170px]">
                        <button
                          onClick={() => { setAddMenuOpen(false); }}
                          className="w-full text-left px-3 py-2 text-[11px] text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                        >
                          <span className="text-xs">🗂️</span> 스킬 둘러보기
                        </button>
                        <div
                          onMouseEnter={() => setCreateSubmenuOpen(true)}
                          onMouseLeave={() => setCreateSubmenuOpen(false)}
                          className="relative"
                        >
                          <button
                            onClick={() => setCreateSubmenuOpen(v => !v)}
                            className={`w-full text-left px-3 py-2 text-[11px] flex items-center justify-between gap-2 hover:bg-gray-800 ${createSubmenuOpen ? 'bg-gray-800 text-white' : 'text-gray-300'}`}
                          >
                            <span className="flex items-center gap-2"><span className="text-xs">➕</span> 스킬 만들기</span>
                            <span className="text-gray-500">▶</span>
                          </button>
                          {createSubmenuOpen && (
                            <div className="absolute right-full top-0 mr-1 bg-[#0f1318] border border-gray-700 rounded-lg shadow-2xl py-1 min-w-[180px]">
                              <button
                                onClick={() => { setAddMenuOpen(false); setCreateSubmenuOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[11px] text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                              >
                                <span className="text-xs">🤖</span> Claude와 함께 창작하기
                              </button>
                              <button
                                onClick={() => { setAddMenuOpen(false); setCreateSubmenuOpen(false); }}
                                className="w-full text-left px-3 py-2 text-[11px] text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                              >
                                <span className="text-xs">📝</span> 스킬 지침 작성
                              </button>
                              <button
                                onClick={() => { setAddMenuOpen(false); setCreateSubmenuOpen(false); setStep(4); }}
                                className="w-full text-left px-3 py-2 text-[11px] text-canva-purple bg-canva-purple/10 hover:bg-canva-purple/20 font-bold flex items-center gap-2 btn-highlight"
                              >
                                <span className="text-xs">⬆️</span> 스킬 업로드
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-[11px] text-gray-500">
                👆 우측 상단의 <span className="text-canva-purple font-bold">[+]</span> → <span className="text-gray-300">[스킬 만들기]</span> → <span className="text-canva-purple font-bold">[스킬 업로드]</span> 순서로 클릭하세요.
              </div>
            </div>
          )}

          {/* Step 4: 파일 업로드 */}
          {step === 4 && (
            <div className="p-5 flex flex-col gap-4">
              <div className="text-white font-bold text-sm">Step 3/3 · 스킬 파일 업로드</div>
              <div className="bg-[#1c232b] border border-gray-700 rounded-lg p-5">
                <div className="text-sm text-gray-200 font-semibold mb-2">스킬 업로드</div>
                <div className="text-[11px] text-gray-500 mb-4">
                  .zip 파일을 선택하거나 여기로 드래그하세요
                </div>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    uploading ? 'border-canva-teal bg-canva-teal/5' : uploaded ? 'border-green-500 bg-green-500/5' : 'border-gray-600 hover:border-canva-purple bg-gray-900/40'
                  }`}
                >
                  {!uploading && !uploaded && (
                    <>
                      <div className="text-3xl mb-2">📦</div>
                      <div className="text-xs text-gray-300 font-semibold mb-1">HWPX 공문/기안문 자동 채우기 스킬 v2.zip</div>
                      <div className="text-[10px] text-gray-500 mb-3">크기: 245 KB · 출처: 메타교육 블로그</div>
                      <button
                        onClick={handleUpload}
                        className="px-4 py-2 bg-canva-purple text-white rounded text-xs font-bold hover:bg-opacity-90 btn-highlight"
                      >
                        이 스킬 업로드
                      </button>
                    </>
                  )}
                  {uploading && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-canva-teal border-t-transparent rounded-full animate-spin"></div>
                      <div className="text-xs text-canva-teal font-bold">업로드 중...</div>
                      <div className="text-[10px] text-gray-500">스킬 검증 · 매니페스트 파싱 · 권한 등록</div>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-[10px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded p-2">
                  ⚠️ 신뢰할 수 있는 출처의 스킬만 업로드하세요. <a href="https://blog.naver.com/metagwc/224253033223" target="_blank" rel="noopener noreferrer" className="underline hover:text-amber-200">출처 확인하기</a>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: 업로드 완료 + 테스트 */}
          {step === 5 && (
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-green-500/10 border border-green-500/40 rounded-lg p-3 flex items-center gap-2">
                <Check size={16} className="text-green-400" />
                <div className="text-xs text-green-300 font-bold">스킬 설치 완료! 이제 대화창에서 바로 호출할 수 있습니다.</div>
              </div>

              <div className="bg-[#1c232b] border border-gray-700 rounded-lg p-3">
                <div className="text-[10px] text-gray-500 mb-2">설치된 스킬 (1개)</div>
                <div className="flex items-center gap-2 bg-gray-900/60 p-2 rounded border border-gray-700">
                  <div className="text-lg">📄</div>
                  <div className="flex-1">
                    <div className="text-xs text-white font-semibold">HWPX 공문/기안문 자동 채우기 스킬 v2</div>
                    <div className="text-[10px] text-gray-500">활성화됨 · 버전 2.0</div>
                  </div>
                  <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded font-bold">ON</div>
                </div>
              </div>

              {/* 대화 테스트 영역 */}
              <div className="bg-[#0a0d12] border border-gray-700 rounded-lg p-3 flex flex-col gap-3">
                <div className="text-[10px] text-gray-500">💬 Claude 대화창에서 테스트</div>

                {chatSent && (
                  <div className="flex justify-end">
                    <div className="bg-canva-purple/20 border border-canva-purple/40 rounded-lg px-3 py-2 max-w-[85%] text-xs text-gray-200">
                      {chatInput}
                    </div>
                  </div>
                )}

                {aiTyping && (
                  <div className="flex gap-1 text-canva-teal text-xs">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce" style={{animationDelay: '0.15s'}}>●</span>
                    <span className="animate-bounce" style={{animationDelay: '0.3s'}}>●</span>
                    <span className="ml-2 text-gray-500">Claude가 스킬을 불러오는 중...</span>
                  </div>
                )}

                {showResponse && (
                  <div className="bg-[#141820] border border-canva-teal/40 rounded-lg p-3 text-xs text-gray-200 leading-relaxed">
                    <div className="text-[10px] text-canva-teal font-bold mb-2">🔧 [HWPX 공문/기안문 자동 채우기 스킬 v2] 실행됨</div>
                    <div className="whitespace-pre-wrap">{`기안문을 작성했습니다.

✓ 수신: 교장
✓ 참조: 교감, 교무부장
✓ 제목: 4학년 현장체험학습 실시 계획
✓ 본문: 목적·일시·장소·예산·안전관리
✓ 붙임: 참가 동의서, 안전교육 자료

📎 생성 파일: 현장체험학습_기안문.hwpx
 (한글 2020 이상에서 바로 열림)`}</div>
                  </div>
                )}

                {!chatSent && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="예: 4학년 현장체험학습 기안문 작성해줘"
                      className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:border-canva-purple focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    />
                    <button
                      onClick={handleChatSend}
                      disabled={!chatInput.trim()}
                      className="px-3 py-2 bg-canva-purple text-white rounded text-xs font-bold hover:bg-opacity-90 disabled:opacity-30"
                    >
                      전송
                    </button>
                  </div>
                )}

                {!chatSent && (
                  <div className="flex flex-wrap gap-1.5">
                    {['4학년 현장체험학습 기안문 작성해줘', '학부모 총회 개최 공문 써줘', '교육청 보고용 예산 집행 기안문'].map((suggest, i) => (
                      <button
                        key={i}
                        onClick={() => setChatInput(suggest)}
                        className="text-[10px] px-2 py-1 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded border border-gray-700"
                      >
                        {suggest}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {showResponse && (
                <button
                  onClick={handleComplete}
                  className="py-2.5 bg-canva-teal text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors"
                >
                  ✓ Skill 연결 전/후 차이 확인하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Lesson45Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string}) => void }) => {
  const [showSafeHints, setShowSafeHints] = useState(false);
  const [classifications, setClassifications] = useState<Record<string, boolean | null>>({
    'Google Drive 문서': null,
    'NEIS 성적 데이터': null,
    '학부모 개인 연락처': null,
    '학교 공식 캘린더': null,
    '업무관리시스템 공문': null,
    '최신 교육부 보도자료 (웹)': null
  });

  const exactAnswers: Record<string, boolean> = {
    'Google Drive 문서': true,
    'NEIS 성적 데이터': false,
    '학부모 개인 연락처': false,
    '학교 공식 캘린더': true,
    '업무관리시스템 공문': false,
    '최신 교육부 보도자료 (웹)': true
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSafeHints(true), 120000);
    return () => window.clearTimeout(timer);
  }, []);

  const handleClassify = (item: string, isPossible: boolean) => {
    setClassifications(prev => ({ ...prev, [item]: isPossible }));
  };

  const handleScenarioTest = () => {
    const resultJSX = (
      <div className="flex flex-col gap-3 w-full">
        <div className="border border-red-900/40 bg-[#1c232b] rounded-lg p-4 relative shadow-inner">
          <h4 className="text-red-400 font-bold mb-2">MCP 연동 없음 (과거 데이터 기반)</h4>
          <pre className="text-xs text-gray-400 whitespace-pre-wrap">현장체험학습 시 일반적인 안전 수칙을 준수하시기 바랍니다.\n1. 질서 유지\n2. 교통 안전 ...\n(AI가 학습한 과거의 일반적인 내용, 현재 법률과 달라질 수 있음)</pre>
        </div>
        <div className="border border-green-900/40 bg-green-900/10 rounded-lg p-4 relative shadow-inner">
           <h4 className="text-green-400 font-bold mb-2">MCP 웹 검색 연동 적용</h4>
          <pre className="text-xs text-green-200 whitespace-pre-wrap">2024년 2월 발표된 교육부 최신 현장체험학습 안전 지침 가이드라인에 따라 아래 사항을 안내합니다.\n1. 응급구조사 동승 규정 최신 규정 반영\n2. 노란버스 이용 관련 예외 조항 등 ...\n(신뢰할 수 있는 최신 정보가 문서에 자동으로 반영됨!)</pre>
        </div>
      </div>
    );
    
    onExecute({
      title: 'MCP 연동 시뮬레이션: 정보의 정확성 점검',
      content: resultJSX,
      point: 'MCP로 최신 규정이나 공식 웹사이트를 연동하면 환각(거짓 정보) 없이 법적으로 안전한 공문과 안내본을 쓸 수 있습니다. 이는 AI의 신뢰성을 극적으로 높입니다.'
    });
  };

  const isAllAnswered = Object.values(classifications).every(v => v !== null);
  const correctCount = Object.keys(classifications).filter(k => classifications[k] === exactAnswers[k]).length;

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">체험: AI가 외부 자료를 직접 가져올 때</div>
      
      <div className="bg-gray-800/50 p-4 rounded-lg">
        <div className="text-sm text-gray-300 mb-2">체험 1: 웹 검색 연동 시뮬레이션</div>
        <div className="text-xs text-gray-400 mb-2 bg-gray-900 p-2 rounded">시나리오: "최신 교육부 현장체험학습 안전 지침을 반영해 가정통신문 써줘"</div>
        <button onClick={handleScenarioTest} className="px-4 py-2 bg-canva-teal text-white rounded font-bold text-xs hover:bg-opacity-90 w-full mb-1">
          연동 전/후 결과 비교해보기
        </button>
      </div>

      <div className="bg-[#1c232b] p-4 rounded-lg border border-gray-700 mt-2">
        <div className="text-sm font-bold text-white mb-2">체험 2: 연결 가능/불가 시스템 분류</div>
        <div className="text-xs text-gray-400 mb-4">현재 학교 환경에서 AI와 개인적으로 연결(MCP) 가능한 것과 절대 해선 안 되는(불가) 것을 분류해 보세요.</div>
        
        <div className="space-y-2">
          {Object.keys(classifications).map(item => {
            const shouldHighlightSafe = showSafeHints && exactAnswers[item] === true && classifications[item] !== true;

            return (
              <div key={item} className="flex items-center justify-between bg-gray-800 p-2.5 rounded border border-gray-700">
                <span className="text-[13px] text-gray-200">{item}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleClassify(item, true)}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${classifications[item] === true ? 'bg-canva-teal text-white border border-teal-500' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'} ${shouldHighlightSafe ? 'btn-highlight btn-highlight-teal' : ''}`}
                  >가능(안전)</button>
                  <button
                    onClick={() => handleClassify(item, false)}
                    className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${classifications[item] === false ? 'bg-red-900/50 text-red-300 border border-red-800' : 'bg-gray-700 text-gray-400 hover:bg-gray-600'}`}
                  >불가(위험)</button>
                </div>
              </div>
            );
          })}
        </div>
        
        {isAllAnswered && (
          <div className={`mt-4 flex flex-col gap-3 p-3 rounded text-xs font-bold ${correctCount === 6 ? 'bg-canva-teal/20 text-canva-teal' : 'bg-amber-500/20 text-amber-500'}`}>
            <div>
              {correctCount === 6 ? "완벽합니다! 교육청 승인 없는 교내 시스템/개인정보 연동은 절대 금물입니다." : "틀린 항목이 있습니다. NEIS, 업무관리시스템, 학생/학부모 개인정보는 임의 연동이 절대 불가합니다."}
            </div>
            {correctCount === 6 && (
              <button onClick={() => onExecute({
                  title: '데이터 판별 결과 (피드백)',
                  content: '모든 데이터를 안전하게 분류하셨습니다! \n개인/민감/공공 시스템 정보에 대한 이해도가 높습니다.',
                  point: '앞으로 AI가 스스로 시스템에 연결되는(MCP) 시대가 일상화될 것입니다. 이때 가장 중요한 교사의 역량은 "이 데이터를 AI에게 줘도 안전한가?"를 판별하고 지휘하는 능력입니다.'
              })} className="py-2 bg-canva-teal/20 hover:bg-canva-teal text-white rounded transition-colors text-center w-full">
                실습 피드백 및 결과 확인
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const Lesson46Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string}) => void }) => {
  const taskPresets: Record<string, { desc: string; suggestedTools: string[]; suggestedChecks: string[] }> = {
    '현장체험학습 가정통신문 + 홈페이지 게시': {
      desc: '현장체험학습 일정·장소·준비물을 담은 가정통신문을 작성하고 학교 홈페이지에 게시까지 완료',
      suggestedTools: ['웹 검색 (최신 안전 지침 확인)', 'hwpx 파일 생성 (공문 서식)', '홈페이지 게시'],
      suggestedChecks: ['개인정보(학생 이름·연락처) 포함 여부', '최신 교육청 안전 지침 반영 여부', '날짜·장소 사실 확인'],
    },
    '매주 학급 소식지 자동 발행': {
      desc: '이번 주 학급 행사·칭찬·안내를 모아 소식지를 만들고 알리미앱으로 학부모에게 발송',
      suggestedTools: ['구글 드라이브 읽기 (이번 주 메모 수집)', '카드뉴스 이미지 생성', '알리미앱 발송'],
      suggestedChecks: ['학생 개별 정보가 동의 없이 공개되지 않는지', '내용의 사실 확인', '발송 전 전체 미리보기'],
    },
    '교육청 공문 회신 및 보고서 제출': {
      desc: '수신된 공문을 분석하고 요청된 양식에 맞게 회신 공문·보고서 초안 작성 후 결재 준비',
      suggestedTools: ['웹 검색 (관련 법령·지침 확인)', 'hwpx 파일 생성 (공문 서식)', '구글 드라이브 저장'],
      suggestedChecks: ['행정 어체 사용 여부', '수신·발신·제목·붙임 형식 준수', '담당자·결재란 누락 없음'],
    },
    '학부모 행사 안내 + 알리미 일괄 발송': {
      desc: '학부모 총회·공개수업 등 행사를 안내하는 문자를 작성하고 전체 학부모에게 알리미로 발송',
      suggestedTools: ['프롬프트 템플릿 (4-2 안내 문자 양식)', '알리미앱 발송', '발송 결과 로그 저장'],
      suggestedChecks: ['100자 이내 핵심 정보만 포함 여부', '수신자 목록 정확성', '발송 전 내용 최종 확인'],
    },
  };

  const allTools = [
    '웹 검색 (최신 정책·지침 확인)',
    '구글 드라이브 읽기',
    'hwpx 파일 생성 (공문 서식)',
    'PDF 생성',
    '홈페이지 게시',
    '알리미앱 발송',
    '카드뉴스 이미지 생성',
    '구글 드라이브 저장',
    '발송 결과 로그 저장',
  ];

  const allChecks = [
    '개인정보(학생 이름·연락처) 포함 여부',
    '최신 교육청 지침 반영 여부',
    '날짜·장소·수치 사실 확인',
    '행정 어체 사용 여부',
    '수신자 목록 정확성',
    '발송 전 전체 미리보기',
    '담당자·결재란 누락 없음',
    '학생 개별 정보 동의 여부',
  ];

  const [selectedTask, setSelectedTask] = useState('');
  const [customTask, setCustomTask] = useState('');
  const [contextInput, setContextInput] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [customCheck, setCustomCheck] = useState('');
  const [step, setStep] = useState(1);

  const preset = selectedTask ? taskPresets[selectedTask] : null;

  const handleTaskSelect = (task: string) => {
    setSelectedTask(task);
    if (taskPresets[task]) {
      setSelectedTools(taskPresets[task].suggestedTools);
      setSelectedChecks(taskPresets[task].suggestedChecks);
    }
    setStep(2);
  };

  const toggleTool = (tool: string) => {
    setSelectedTools(prev => prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool]);
  };

  const toggleCheck = (check: string) => {
    setSelectedChecks(prev => prev.includes(check) ? prev.filter(c => c !== check) : [...prev, check]);
  };

  const taskLabel = selectedTask || customTask || '[업무 미선택]';
  const canGenerate = (selectedTask || customTask.trim()) && selectedTools.length > 0 && selectedChecks.length > 0;

  const handleGenerate = () => {
    const toolFlow = selectedTools.map((t, i) => `  ${i + 1}단계. ${t}`).join('\n');
    const checkList = selectedChecks.map(c => `  - ${c}`).join('\n');
    const extra = customCheck.trim() ? `\n  - ${customCheck.trim()} (직접 추가)` : '';
    const context = contextInput.trim() || '(학교 시스템 프롬프트 및 프롬프트 템플릿 활용)';

    const doc = `=== 나의 에이전트 업무 위임서 ===

[위임할 업무]
${taskLabel}
${preset ? `→ ${preset.desc}` : ''}

[에이전트에게 줄 컨텍스트]
${context}

[에이전트가 순서대로 사용할 도구]
${toolFlow}

[처리 흐름]
목표 이해 → 컨텍스트 확인 → 도구 순차 실행 → 결과물 생성 → 교사 승인 요청

[내가 반드시 최종 확인할 사항]
${checkList}${extra}

※ 에이전트는 실행을 대신하지만, 학교 업무의 최종 책임은 항상 교사에게 있습니다.`;

    onExecute({
      title: `나의 에이전트 위임서 — ${taskLabel}`,
      content: doc,
      point: `에이전트 위임서의 핵심은 세 가지입니다: ① 어떤 컨텍스트를 줄 것인가 (4-1·4-2에서 만든 것), ② 어떤 도구를 어떤 순서로 쓸 것인가, ③ 사람이 반드시 확인할 항목은 무엇인가. 이 세 가지를 미리 설계해 두면 실제 에이전트를 연결할 때 훨씬 빠르게 시작할 수 있습니다.`,
    });
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl border border-gray-800 flex flex-col overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-3 border-b border-gray-800 flex items-center justify-between shrink-0">
        <div className="text-white font-bold text-sm">에이전트 업무 위임서 만들기</div>
        <div className="flex gap-1">
          {[1, 2, 3].map(s => (
            <button key={s} onClick={() => step >= s && setStep(s)}
              className={`w-6 h-6 rounded-full text-[10px] font-bold transition-colors ${step === s ? 'bg-canva-purple text-white' : step > s ? 'bg-canva-purple/40 text-white cursor-pointer' : 'bg-gray-700 text-gray-500 cursor-default'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

        {/* Step 1: 업무 선택 */}
        {step === 1 && (
          <>
            <div className="text-xs text-gray-400">에이전트에게 맡기고 싶은 학교 업무를 선택하세요.</div>
            <div className="flex flex-col gap-2">
              {Object.keys(taskPresets).map(task => (
                <button key={task} onClick={() => handleTaskSelect(task)}
                  className="text-left px-4 py-3 rounded-lg border border-gray-700 bg-gray-800/40 hover:border-canva-purple hover:bg-canva-purple/10 transition-all">
                  <div className="text-xs font-bold text-gray-200">{task}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{taskPresets[task].desc}</div>
                </button>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-3">
              <div className="text-[10px] text-gray-500 mb-1.5">또는 직접 입력</div>
              <div className="flex gap-2">
                <input value={customTask} onChange={e => setCustomTask(e.target.value)}
                  placeholder="예: 월간 학교 뉴스레터 발행"
                  className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-canva-purple" />
                <button onClick={() => { setStep(2); setSelectedTools([]); setSelectedChecks([]); }}
                  disabled={!customTask.trim()}
                  className="px-4 py-2 bg-canva-purple text-white rounded text-xs font-bold disabled:opacity-30 hover:bg-opacity-90">
                  선택
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step 2: 도구 선택 */}
        {step === 2 && (
          <>
            <div>
              <div className="text-[10px] text-gray-500 mb-1">위임할 업무</div>
              <div className="text-xs font-bold text-canva-purple">{taskLabel}</div>
            </div>

            <div>
              <div className="text-xs text-gray-300 font-bold mb-1">컨텍스트 (에이전트에게 먼저 줄 정보)</div>
              <textarea value={contextInput} onChange={e => setContextInput(e.target.value)}
                placeholder="예: 4-1 학교 시스템 프롬프트 + 4-2 가정통신문 템플릿 사용 / 학교명: ○○초"
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-canva-purple resize-none" />
            </div>

            <div>
              <div className="text-xs text-gray-300 font-bold mb-2">에이전트가 사용할 도구 선택 <span className="text-gray-500 font-normal">(순서가 처리 흐름이 됩니다)</span></div>
              <div className="flex flex-col gap-1.5">
                {allTools.map(tool => {
                  const checked = selectedTools.includes(tool);
                  const idx = selectedTools.indexOf(tool);
                  return (
                    <label key={tool} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${checked ? 'border-canva-teal bg-canva-teal/10' : 'border-gray-700 bg-gray-800/40 hover:border-gray-500'}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleTool(tool)} className="hidden" />
                      <span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${checked ? 'bg-canva-teal text-white' : 'bg-gray-700 text-gray-500'}`}>
                        {checked ? idx + 1 : ''}
                      </span>
                      <span className="text-xs text-gray-200">{tool}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <button onClick={() => setStep(3)} disabled={selectedTools.length === 0}
              className="w-full py-2.5 bg-canva-purple text-white rounded-xl font-bold text-sm hover:bg-opacity-90 disabled:opacity-30 transition-all">
              다음: 검증 항목 설정 →
            </button>
          </>
        )}

        {/* Step 3: 검증 항목 + 생성 */}
        {step === 3 && (
          <>
            <div>
              <div className="text-[10px] text-gray-500 mb-0.5">위임할 업무</div>
              <div className="text-xs font-bold text-canva-purple mb-3">{taskLabel}</div>
              <div className="text-xs text-gray-300 font-bold mb-1">에이전트 결과물을 받은 후 내가 확인할 항목</div>
              <div className="text-[10px] text-gray-500 mb-2">에이전트가 아무리 잘해도 사람이 반드시 확인해야 할 것들을 선택하세요.</div>
              <div className="flex flex-col gap-1.5">
                {allChecks.map(check => {
                  const checked = selectedChecks.includes(check);
                  return (
                    <label key={check} className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${checked ? 'border-amber-500/60 bg-amber-500/10' : 'border-gray-700 bg-gray-800/40 hover:border-gray-500'}`}>
                      <input type="checkbox" checked={checked} onChange={() => toggleCheck(check)} className="hidden" />
                      <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] ${checked ? 'bg-amber-500 text-white' : 'bg-gray-700'}`}>
                        {checked ? '✓' : ''}
                      </span>
                      <span className="text-xs text-gray-200">{check}</span>
                    </label>
                  );
                })}
              </div>
              <input value={customCheck} onChange={e => setCustomCheck(e.target.value)}
                placeholder="직접 추가할 확인 항목 입력..."
                className="w-full mt-2 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500" />
            </div>

            <button onClick={handleGenerate} disabled={!canGenerate || selectedChecks.length === 0}
              className="w-full py-3 bg-canva-purple text-white rounded-xl font-bold text-sm hover:bg-opacity-90 disabled:opacity-30 transition-all shadow-lg">
              나의 에이전트 위임서 완성하기
            </button>
            <button onClick={() => setStep(2)} className="text-xs text-gray-500 hover:text-gray-300 text-center">← 도구 선택으로 돌아가기</button>
          </>
        )}
      </div>
    </div>
  );
};

export const Lesson41Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string}) => void }) => {
  const [inputs, setInputs] = useState({
    school: '',
    teacher: '',
    grade: '',
    tasks: [] as string[],
    customTask: '',
    special: ''
  });

  const handleTaskToggle = (task: string) => {
    setInputs(prev => ({
      ...prev,
      tasks: prev.tasks.includes(task) 
        ? prev.tasks.filter(t => t !== task)
        : [...prev.tasks, task]
    }));
  };

  const generatePrompt = () => {
    const allTasks = [...inputs.tasks];
    if (inputs.customTask) allTasks.push(inputs.customTask);
    
    const lines = [
      `당신은 ${inputs.school || '[학교명]'} 행정 업무 도우미입니다.`,
      ``,
      `학교 정보:`,
      `- 학교명: ${inputs.school || '[학교명]'}`,
      `- 담당 교사: ${inputs.teacher || '[이름]'}, ${inputs.grade || '[학년·학급]'}`,
      `- 주요 업무: ${allTasks.length > 0 ? allTasks.join(', ') : '[업무 목록]'}`,
      ...(inputs.special ? [`- 학교 특수 상황: ${inputs.special}`] : []),
      ``,
      `작성 원칙:`,
      `- 모든 문서는 초안으로 제공하며 "검토 후 사용"을 안내합니다`,
      `- 공식 문서는 행정 어체로 작성합니다`,
      `- 명확하고 핵심 위주로 작성합니다`
    ];

    onExecute({
      title: '나만의 학교 시스템 프롬프트',
      content: lines.join('\n'),
      point: '이 시스템 프롬프트를 모든 대화의 시작점(Context)으로 활용하세요. AI가 학교 행정 전문가 모드로 고정됩니다.'
    });
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">나의 학교 자동화 컨텍스트 설정</div>
      
      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">학교 이름</label>
          <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-canva-purple" placeholder="예: 한국초등학교" value={inputs.school} onChange={e => setInputs({...inputs, school: e.target.value})} />
        </div>
        
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">담당 교사</label>
            <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-canva-purple" placeholder="예: 홍길동" value={inputs.teacher} onChange={e => setInputs({...inputs, teacher: e.target.value})} />
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-400 block mb-1">학년·학급</label>
            <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-canva-purple" placeholder="예: 4학년 2반 담임" value={inputs.grade} onChange={e => setInputs({...inputs, grade: e.target.value})} />
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">주요 담당 업무 (다중 선택)</label>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            {['가정통신문 작성', '공문 회신', '학부모 안내 문자', '교육청 보고서', '학교폭력 사안 문서'].map(task => (
              <label key={task} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={inputs.tasks.includes(task)} onChange={() => handleTaskToggle(task)} className="rounded border-gray-600 text-canva-purple focus:ring-canva-purple bg-gray-700" />
                {task}
              </label>
            ))}
          </div>
          <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white mt-2 focus:outline-none focus:border-canva-purple" placeholder="기타 (직접 입력)" value={inputs.customTask} onChange={e => setInputs({...inputs, customTask: e.target.value})} />
        </div>

        <div>
          <label className="text-xs text-gray-400 block mb-1">학교 특수 상황 (선택)</label>
          <input type="text" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-canva-purple" placeholder="예: 혁신학교, AI 선도학교 등" value={inputs.special} onChange={e => setInputs({...inputs, special: e.target.value})} />
        </div>
      </div>

      <button 
        onClick={generatePrompt}
        className="w-full py-3 bg-canva-purple text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg mt-2 shrink-0 mb-4"
      >
        시스템 프롬프트 생성 (비교 결과 보기)
      </button>
    </div>
  );
};

type AgentRole = '총괄 에이전트' | '수집 에이전트' | '작성 에이전트' | '디자인 에이전트' | '업로드 에이전트';

const agentDefaults: Record<AgentRole, { emoji: string; description: string; inputLabel: string; outputLabel: string; template: string }> = {
  '총괄 에이전트': {
    emoji: '🎯',
    description: '전체 워크플로우를 지휘하고 각 에이전트에 작업을 분배합니다.',
    inputLabel: '달성할 최종 목표',
    outputLabel: '각 에이전트에 보낼 지시사항',
    template: `당신은 학교 소식 자동 발행 시스템의 총괄 책임자입니다.

[역할]
- 매일 오전 7시, 아래 순서로 에이전트들에게 작업을 지시합니다
- 각 에이전트의 완료 보고를 받아 이상 여부를 확인합니다
- 최종 결과를 담당 교사에게 요약 보고합니다

[작업 순서]
1. 수집 에이전트에게 "오늘 날짜의 학교 소식 수집" 지시
2. 작성 에이전트에게 수집 결과 전달 후 "가정통신문 초안 작성" 지시
3. 디자인 에이전트에게 초안 전달 후 "카드뉴스 이미지 생성" 지시
4. 업로드 에이전트에게 최종 파일 전달 후 "홈페이지·알리미 게시" 지시
5. 모든 단계 완료 시 담당 교사에게 알림 발송

[오류 처리]
- 어떤 단계에서든 오류 발생 시 작업을 멈추고 교사에게 즉시 보고합니다`,
  },
  '수집 에이전트': {
    emoji: '📡',
    description: '매일 학교 행사·급식·공지 등 필요한 정보를 수집합니다.',
    inputLabel: '수집할 정보 종류',
    outputLabel: '수집된 정보 목록 (다음 에이전트 입력용)',
    template: `당신은 학교 소식 수집 전문 에이전트입니다.

[역할]
매일 아침, 다음 정보를 수집하여 정리된 목록으로 출력합니다.

[수집 항목]
- 오늘의 학교 행사 및 일정
- 오늘의 급식 메뉴
- 새로 등록된 공지사항
- 날씨 정보 (체험학습·야외활동 관련 시)
- 교육청 최신 공문 중 학부모 안내 필요 사항

[출력 형식]
각 항목을 아래 형식으로 정리합니다:
{항목명}: {내용}
{항목명}: {내용}
...

[주의사항]
- 개인정보(학생 이름, 연락처 등)는 수집하지 않습니다
- 사실만 수집하고, 해석이나 요약은 작성 에이전트에게 맡깁니다`,
  },
  '작성 에이전트': {
    emoji: '✍️',
    description: '수집된 정보와 4-2 프롬프트 템플릿을 바탕으로 학교 소식을 작성합니다.',
    inputLabel: '수집 에이전트의 출력 + 프롬프트 템플릿',
    outputLabel: '완성된 학교 소식 초안 (텍스트)',
    template: `당신은 학교 소식 작성 전문 에이전트입니다.

[배경 지식 — 학교 프롬프트 템플릿]
(여기에 4-2에서 만든 가정통신문 프롬프트 템플릿을 붙여넣으세요)

[역할]
수집 에이전트가 전달한 정보를 받아, 위 템플릿 형식에 맞게 학교 소식을 작성합니다.

[작성 원칙]
- 학부모가 이해하기 쉬운 친근한 어조로 작성합니다
- 핵심 정보(언제·어디서·무엇을·어떻게)를 명확히 포함합니다
- 학교명·날짜는 반드시 상단에 표시합니다
- 500자 내외로 간결하게 작성합니다
- 마지막에 "검토 후 사용하세요" 안내를 포함합니다

[출력 형식]
완성된 소식문 전체를 그대로 출력합니다. 추가 설명 없이 본문만 출력합니다.`,
  },
  '디자인 에이전트': {
    emoji: '🎨',
    description: '작성된 학교 소식을 시각적인 카드뉴스·인포그래픽으로 변환합니다.',
    inputLabel: '작성 에이전트의 텍스트 초안',
    outputLabel: '카드뉴스 이미지 또는 디자인 지시사항',
    template: `당신은 학교 소식 디자인 전문 에이전트입니다.

[역할]
작성 에이전트가 만든 텍스트 소식을 받아, 학부모와 학생이 보기 좋은 카드뉴스 형태로 변환합니다.

[디자인 원칙]
- 배경색: 밝고 따뜻한 파스텔 톤 (연한 하늘색, 연한 노란색 등)
- 폰트: 명확하고 읽기 쉬운 고딕 계열
- 핵심 정보를 아이콘과 함께 강조 표시
- 초등학생·학부모 모두 쉽게 이해할 수 있는 레이아웃

[출력 요청]
이미지 생성 도구(DALL-E, Midjourney, Canva AI 등)에 전달할 상세 프롬프트를 작성합니다:
"[학교 소식 카드뉴스] [내용 요약] [디자인 스타일: 파스텔톤, 깔끔한 레이아웃] [텍스트 요소: ...]"

[주의사항]
- 학생 얼굴 사진이나 개인정보가 포함된 이미지는 생성하지 않습니다
- 모든 이미지는 학교 공식 채널 게시 가능한 형태여야 합니다`,
  },
  '업로드 에이전트': {
    emoji: '📤',
    description: '완성된 콘텐츠를 학교 홈페이지와 알리미앱에 자동으로 게시합니다.',
    inputLabel: '최종 텍스트 + 이미지 파일',
    outputLabel: '게시 완료 보고 (URL, 게시 시각)',
    template: `당신은 학교 소식 업로드 전문 에이전트입니다.

[역할]
작성·디자인 에이전트가 완성한 콘텐츠를 받아 지정된 채널에 게시하고 결과를 보고합니다.

[업로드 채널]
1. 학교 홈페이지 공지사항 게시판
2. 학교 알리미 앱 공지 발송
3. 학교 공식 SNS (설정된 경우)

[업로드 순서]
1. 콘텐츠 최종 검토 (욕설·민감 정보 자동 필터링)
2. 홈페이지 게시 (제목·본문·이미지 첨부)
3. 알리미앱 발송 (100자 이내 요약본 별도 작성)
4. 게시 완료 URL과 발송 시각 기록

[보안 원칙]
- 게시 전 반드시 개인정보 포함 여부를 자동 검사합니다
- 승인 없이 개인정보가 포함된 콘텐츠는 업로드를 중단하고 총괄 에이전트에 보고합니다
- 모든 게시 이력을 로그로 기록합니다

[출력 형식]
게시 완료: {채널명} | {URL} | {시각}
알리미 발송: 완료 | 수신자 {N}명
총 소요시간: {N}분`,
  },
};

export const Lesson48Interactive = ({ onExecute }: { onExecute: (data: {title: string, content: React.ReactNode, point: string}) => void }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentRole>('총괄 에이전트');
  const [customNote, setCustomNote] = useState('');
  const [generated, setGenerated] = useState(false);

  const agent = agentDefaults[selectedAgent];

  const handleGenerate = () => {
    const finalTemplate = customNote.trim()
      ? `${agent.template}\n\n[추가 지시사항]\n${customNote.trim()}`
      : agent.template;

    setGenerated(true);

    onExecute({
      title: `${agent.emoji} ${selectedAgent} 프롬프트 템플릿`,
      content: finalTemplate,
      point: `${selectedAgent}의 역할을 명확히 정의했습니다. 입력(${agent.inputLabel})과 출력(${agent.outputLabel})을 명시해야 에이전트들이 서로 부드럽게 연결됩니다. 나머지 에이전트 프롬프트도 만들어 5개를 모두 완성하면 학교 소식 자동 발행 시스템이 갖춰집니다.`,
    });
  };

  const agentRoles = Object.keys(agentDefaults) as AgentRole[];

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-1">에이전트 팀 프롬프트 템플릿 만들기</div>
      <div className="text-xs text-gray-400">각 에이전트의 역할을 정의하는 프롬프트 템플릿을 생성합니다.</div>

      {/* 에이전트 선택 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">1단계: 프롬프트를 만들 에이전트 선택</div>
        <div className="grid grid-cols-1 gap-1.5">
          {agentRoles.map((role) => {
            const a = agentDefaults[role];
            const isSelected = selectedAgent === role;
            return (
              <button
                key={role}
                onClick={() => { setSelectedAgent(role); setGenerated(false); setCustomNote(''); }}
                className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'border-canva-purple bg-canva-purple/10 text-white'
                    : 'border-gray-700 bg-gray-800/40 text-gray-400 hover:border-gray-500'
                }`}
              >
                <span className="text-lg leading-none mt-0.5">{a.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-bold ${isSelected ? 'text-canva-purple' : 'text-gray-300'}`}>{role}</div>
                  <div className="text-[10px] text-gray-500 leading-snug mt-0.5">{a.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 입력·출력 표시 */}
      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700 text-xs">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="text-gray-500 mb-1">입력 (받는 것)</div>
            <div className="text-gray-200 font-medium">{agent.inputLabel}</div>
          </div>
          <div className="text-gray-600 self-center text-lg">→</div>
          <div className="flex-1">
            <div className="text-gray-500 mb-1">출력 (만드는 것)</div>
            <div className="text-gray-200 font-medium">{agent.outputLabel}</div>
          </div>
        </div>
      </div>

      {/* 추가 지시사항 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">2단계: 우리 학교에 맞게 추가 지시사항 입력 (선택)</div>
        <textarea
          value={customNote}
          onChange={e => setCustomNote(e.target.value)}
          placeholder={`예) 학교명: 행복초등학교 / 담당: 홍길동 선생님 / 알리미앱 계정: ...`}
          rows={3}
          className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-canva-purple resize-none"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="w-full py-3 bg-canva-purple text-white rounded-xl font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg"
      >
        {agent.emoji} {selectedAgent} 프롬프트 템플릿 생성
      </button>

      {generated && (
        <div className="bg-canva-teal/10 border border-canva-teal/40 rounded-lg p-3 text-xs text-canva-teal font-bold text-center">
          ✓ 생성 완료! 오른쪽 결과창에서 확인하세요. 나머지 에이전트도 이어서 만들어보세요.
        </div>
      )}

      {/* 전체 구성 진행 현황 */}
      <div className="border-t border-gray-800 pt-3">
        <div className="text-[10px] text-gray-500 mb-2">전체 에이전트 팀 구성 현황</div>
        <div className="flex gap-1 flex-wrap">
          {agentRoles.map(role => {
            const a = agentDefaults[role];
            return (
              <span
                key={role}
                className={`text-[10px] px-2 py-0.5 rounded-full border ${
                  selectedAgent === role && generated
                    ? 'border-canva-teal text-canva-teal bg-canva-teal/10'
                    : 'border-gray-700 text-gray-500'
                }`}
              >
                {a.emoji} {role.replace(' 에이전트', '')}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
