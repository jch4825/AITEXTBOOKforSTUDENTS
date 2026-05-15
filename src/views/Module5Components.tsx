import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText } from 'lucide-react';
import { Lesson } from '../data/tutorialData';
import { callGemini } from '../utils/gemini';
import { initCurriculum, lookupStandard, normalizeCode, CurriculumStandard } from '../utils/curriculumLookup';
import { getGeminiApiKey, hasGeminiApiKey } from '../services/storage';
import { useExternalStorageState } from '../hooks/useExternalStorageState';

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
      className={`p-1.5 bg-gray-700/50 hover:bg-gray-700 rounded-md text-gray-300 hover:text-white transition-colors flex items-center gap-1 text-xs ${className}`}
    >
      {copied ? <><Check size={14} /> 복사됨!</> : <><Copy size={14} /> 복사</>}
    </button>
  );
};

export const GoogleDocsButton = ({ text, className = "" }: { text: string, className?: string }) => {
  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      window.open('https://docs.new', '_blank');
    } catch (err) {
      alert('클립보드 자동 복사에 실패했습니다. 수동으로 텍스트를 복사해주세요.');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`text-xs text-white hover:bg-blue-600 transition-colors flex items-center gap-1 bg-blue-500 px-3 py-1.5 rounded-lg font-medium shadow-sm ${className}`}
    >
      <FileText size={14} /> 구글Docs에 ctrl+v 하세요.
    </button>
  );
};

// 5-1: 할루시네이션 직접 체험 (성취기준 코드 → Gemini vs 실제 DB 비교)
type CompletionProps = {
  onComplete?: () => void;
};

const SIMULATION_ANSWERS: Record<string, string> = {
  '[2국01-01]': '네, 2022 개정 교육과정 성취기준 [2국01-01]에 대해 설명드리겠습니다.\n\n학년군: 1~2학년군\n교과: 국어\n영역: 읽기\n\n성취기준 전문:\n"글자와 소리의 관계를 이해하고 낱말을 정확하게 소리 내어 읽는다."\n\n이 성취기준은 초등학교 1~2학년 학생들이 한글의 기본 원리인 자음과 모음의 결합 방식을 이해하고, 이를 바탕으로 낱말을 정확하게 발음하며 읽을 수 있는 능력을 기르는 것을 목표로 합니다.',
  '[4수01-03]': '2022 개정 교육과정 성취기준 [4수01-03]에 대해 알려드리겠습니다.\n\n학년군: 3~4학년군\n교과: 수학\n영역: 수와 연산\n\n성취기준 전문:\n"분수의 개념을 이해하고, 단위분수, 진분수, 가분수, 대분수의 관계를 알 수 있다."\n\n이 성취기준은 학생들이 분수의 기본 개념을 이해하고, 다양한 분수의 종류를 구별하며 상호 관계를 파악하는 역량을 기르는 데 초점을 맞추고 있습니다.',
  '[6사02-02]': '2022 개정 교육과정 성취기준 [6사02-02]에 대해 설명드리겠습니다.\n\n학년군: 5~6학년군\n교과: 사회\n영역: 역사\n\n성취기준 전문:\n"조선 시대 신분 제도의 특징을 파악하고, 양반·중인·상민·천민의 생활 모습을 비교하여 설명한다."\n\n이 성취기준은 조선 시대의 사회 구조를 이해하고, 각 신분 계층의 역할과 생활 방식의 차이를 탐구함으로써 역사적 사고력을 기르는 것을 목적으로 합니다.',
  '[3과02-01]': '2022 개정 교육과정 성취기준 [3과02-01]에 대해 안내드립니다.\n\n학년군: 3~4학년군\n교과: 과학\n영역: 생명과학\n\n성취기준 전문:\n"동물의 한살이 과정을 관찰하고, 완전변태와 불완전변태의 차이점을 설명한다."\n\n이 성취기준은 학생들이 다양한 동물의 성장 과정을 직접 관찰하고 기록하는 탐구 활동을 통해, 변태 방식의 차이를 과학적으로 이해하도록 구성되어 있습니다.',
};

const SIMULATION_FALLBACK = (code: string) =>
  `2022 개정 교육과정 성취기준 ${code}에 대해 설명드리겠습니다.\n\n학년군: 해당 학년군\n교과: 해당 교과\n영역: 해당 영역\n\n성취기준 전문:\n"관련 개념을 이해하고, 다양한 상황에서 이를 적용하여 문제를 해결하며, 학습한 내용을 바탕으로 창의적으로 표현할 수 있다."\n\n이 성취기준은 학생들이 핵심 개념을 탐구하고 실생활과 연계하여 사고력과 문제해결력을 기르는 것을 목표로 합니다.`;

export const Lesson51Interactive = ({ onComplete }: CompletionProps = {}) => {
  const [codeInput, setCodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiText, setAiText] = useState('');
  const [isSimulation, setIsSimulation] = useState(false);
  const [realStandard, setRealStandard] = useState<CurriculumStandard | 'not-found' | null>(null);
  const hasApiKey = useExternalStorageState(hasGeminiApiKey, 'api-key-changed');
  const [queried, setQueried] = useState(false);

  const EXAMPLES = ['[2국01-01]', '[4수01-03]', '[6사02-02]', '[3과02-01]'];

  useEffect(() => {
    initCurriculum();
  }, []);

  const handleQuery = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setAiText('');
    setRealStandard(null);
    setQueried(true);

    await initCurriculum();
    const found = lookupStandard(trimmed);
    setRealStandard(found ?? 'not-found');

    const key = getGeminiApiKey();
    if (!key || key.length < 10) {
      const norm = normalizeCode(trimmed);
      const simAnswer = SIMULATION_ANSWERS[norm] ?? SIMULATION_FALLBACK(norm);
      setIsSimulation(true);
      setAiText(simAnswer);
      setIsLoading(false);
      onComplete?.();
      return;
    }

    setIsSimulation(false);
    try {
      const norm = normalizeCode(trimmed);
      const prompt = `2022 개정 교육과정(2022년 12월 22일 교육부 고시 제2022-33호)의 성취기준 ${norm}에 대해 알려줘. 반드시 2022 개정 교육과정 기준으로만 답변하고, 2015 개정 교육과정의 내용은 사용하지 마. 학년군, 교과, 영역, 그리고 성취기준 전문(공식 문서에 기재된 그대로의 문장)을 정확하게 알려줘.`;
      const response = await callGemini({
        apiKey: key,
        contents: prompt,
        systemInstruction: '표(마크다운 테이블 포함)는 사용하지 마세요. 간결하게 답해주세요.',
      });
      setAiText(response.text ?? '응답이 비어 있습니다.');
      onComplete?.();
    } catch (e) {
      setAiText(`오류 발생: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-4 border border-gray-800 flex flex-col gap-3 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="text-white font-bold text-sm">할루시네이션 직접 체험</div>
        <div className={`text-[10px] px-2 py-1 rounded-full font-bold ${hasApiKey ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {hasApiKey ? '● API 연결됨' : '○ API 키 미등록'}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-gray-400">예시 코드:</span>
        {EXAMPLES.map(code => (
          <button
            key={code}
            onClick={() => setCodeInput(code)}
            className="px-2.5 py-1 bg-[#1c232b] border border-gray-700 hover:border-canva-purple text-gray-300 text-xs rounded font-mono transition-colors"
          >
            {code}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={codeInput}
          onChange={e => setCodeInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleQuery(codeInput); }}
          placeholder="위 예시 코드 버튼을 눌러보거나 직접 성취기준 코드를 적어보세요."
          className="flex-1 bg-[#1c232b] border border-gray-700 rounded-lg px-3 py-2 text-white font-mono text-sm outline-none focus:border-canva-purple transition-colors"
        />
        <button
          onClick={() => handleQuery(codeInput)}
          disabled={isLoading || !codeInput.trim()}
          className="px-4 py-2 bg-canva-purple hover:bg-canva-purple/80 disabled:opacity-40 text-white rounded-lg text-sm font-bold transition-colors whitespace-nowrap"
        >
          {isLoading ? '요청 중...' : 'AI에게 물어보기'}
        </button>
      </div>

      {queried && (
        <div className="flex flex-col gap-3">
          <div className="bg-red-950/20 border border-red-800/40 rounded-lg p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-red-300 font-bold text-xs flex items-center gap-2">
                <span>🤖 AI 답변 (Gemini) — RAG 없이 생성</span>
                {isSimulation && (
                  <span className="text-[10px] font-normal text-amber-400 bg-amber-900/30 border border-amber-700/50 px-1.5 py-0.5 rounded">
                    사전 입력된 시뮬레이션 답변입니다.
                  </span>
                )}
              </div>
              {!isLoading && aiText && <GoogleDocsButton text={aiText} className="shrink-0" />}
            </div>
            {isLoading ? (
              <div className="text-gray-400 text-xs animate-pulse">응답 생성 중...</div>
            ) : (
              <div className="text-gray-200 text-xs leading-relaxed whitespace-pre-wrap">{aiText}</div>
            )}
          </div>

          {realStandard !== null && (
            <div className="bg-green-950/20 border border-green-800/40 rounded-lg p-3">
              <div className="text-green-300 font-bold text-xs mb-2">📚 실제 성취기준 (2022 개정 교육과정 DB)</div>
              {realStandard === 'not-found' ? (
                <div className="text-gray-400 text-xs">DB에서 찾을 수 없습니다. 위 예시 코드를 사용해 보세요.</div>
              ) : (
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex gap-3 flex-wrap">
                    <span><span className="text-gray-400">코드 </span><span className="text-white font-mono">{realStandard.code}</span></span>
                    <span><span className="text-gray-400">학년군 </span><span className="text-white">{realStandard.gradeGroup}학년</span></span>
                    <span><span className="text-gray-400">교과 </span><span className="text-white">{realStandard.subject}</span></span>
                    <span><span className="text-gray-400">영역 </span><span className="text-white">{realStandard.domain}</span></span>
                  </div>
                  <div className="bg-green-900/20 rounded p-2 mt-0.5">
                    <span className="text-gray-400">성취기준: </span>
                    <span className="text-green-200 font-medium">{realStandard.title}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && aiText && realStandard && realStandard !== 'not-found' && (
            <div className="bg-amber-950/20 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-200 leading-relaxed">
              💡 두 답변을 비교해보세요. 위쪽은 인공지능이 생성한 답변이고, 아래쪽은 AI Bridge에 내장된 <strong>2022 개정 교육과정 초등학교 성취기준 데이터베이스</strong>의 실제 자료입니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 5-2: 편향 문장 탐정
export const Lesson52Interactive = ({ onComplete }: CompletionProps = {}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const cases = [
    {
      label: '역할 배정 안내',
      sentence: '남학생은 로봇 조립을 맡고, 여학생은 발표 자료 꾸미기를 맡기면 좋습니다.',
      correctType: '성별 편향',
      affected: '로봇 조립에 관심 있는 여학생, 디자인을 좋아하지 않는 여학생, 발표 자료보다 조립을 잘하는 학생이 배제될 수 있습니다.',
      reason: '성별을 기준으로 역할을 나누면 학생의 관심과 역량보다 고정관념이 먼저 작동합니다.',
      improvement: '학생의 성별이 아니라 희망, 관심, 경험에 따라 로봇 조립·자료 제작·발표 역할을 나눕니다.',
    },
    {
      label: '학급 대표 추천 기준',
      sentence: '학급 대표는 발표를 잘하고, 친구들 앞에서 자신 있게 말하며, 항상 적극적으로 손드는 학생이 좋습니다.',
      correctType: '성격·표현 방식 편향',
      affected: '조용하지만 책임감 있는 학생, 말은 느리지만 약속을 잘 지키는 학생, 공개 발표보다 조율을 잘하는 학생이 불리해질 수 있습니다.',
      reason: '좋은 리더를 외향성과 발표력으로만 좁히면 다양한 리더십이 보이지 않습니다.',
      improvement: '학급 대표는 책임감, 약속 이행, 친구 의견 경청, 갈등 조정 능력 등 여러 기준을 함께 보아 추천합니다.',
    },
    {
      label: '가족 그림 자료 설명',
      sentence: '행복한 가족은 엄마, 아빠, 그리고 두 명의 자녀로 구성됩니다.',
      correctType: '가족 형태 편향',
      affected: '한부모가정, 조손가정, 다문화가정, 형제자매가 없는 학생이 자신을 정상적인 가족 모습 밖에 있다고 느낄 수 있습니다.',
      reason: '가족을 한 가지 형태로만 설명하면 다양한 가족을 자연스럽게 인정하지 못합니다.',
      improvement: '행복한 가족은 구성 형태와 관계없이 서로를 아끼고 돌보는 사람들로 이루어질 수 있습니다.',
    },
  ];

  const biasTypes = ['성별 편향', '성격·표현 방식 편향', '가족 형태 편향', '문제 없음'];
  const current = cases[currentIndex];
  const isCorrect = selectedType === current.correctType;
  const lowScoreMessage = '잠깐만요. 손가락이 너무 열심히 일해서 눈보다 살짝 앞서갔습니다. 잠시만 시간을 두고 문제를 읽어봐 주세요.';

  const submitAnswer = () => {
    if (!selectedType) return;
    if (selectedType === current.correctType) setCorrectCount(prev => prev + 1);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < cases.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedType(null);
      setSubmitted(false);
    } else {
      setFinished(true);
      onComplete?.();
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedType(null);
    setSubmitted(false);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-5 items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">편향 문장 탐정 완료</div>
          <div className="text-3xl font-bold mb-3 text-canva-teal">{correctCount} / {cases.length}</div>
          {correctCount <= 1 && (
            <div className="mb-3 max-w-md rounded-xl border border-amber-600/50 bg-amber-950/30 px-6 py-4 text-sm font-semibold leading-relaxed text-amber-100">
              {lowScoreMessage}
            </div>
          )}
          <div className="max-w-md bg-gray-800 rounded-xl px-6 py-4 text-sm leading-relaxed text-gray-300">
            편향은 숫자로 맞히는 문제가 아니라, <span className="text-white font-bold">누가 빠졌는지</span>와 <span className="text-white font-bold">어떻게 고칠지</span>를 보는 습관입니다. AI 결과물을 수업에 쓰기 전 한 번 더 읽고 표현을 넓혀 주세요.
          </div>
        </div>
        <button onClick={handleReset} className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
          다시 시작
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="text-white font-bold text-sm">편향 문장 탐정</div>
        <div className="text-xs text-gray-500">{currentIndex + 1} / {cases.length}</div>
      </div>

      <div className="bg-gray-800/40 rounded-lg p-3 text-xs text-gray-400 leading-relaxed">
        아래 AI 생성 문장을 읽고 <span className="text-canva-purple font-semibold">어떤 편향이 숨어 있는지</span> 고르세요. 핵심은 점수가 아니라 “누가 불리해질 수 있는가?”를 찾는 것입니다.
      </div>

      <div className="bg-gray-900 rounded-lg p-4">
        <div className="text-gray-400 text-xs mb-2">상황: <span className="text-white font-semibold">{current.label}</span></div>
        <p className="text-gray-200 text-sm leading-relaxed">“{current.sentence}”</p>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {biasTypes.map(type => (
          <button
            key={type}
            disabled={submitted}
            onClick={() => setSelectedType(type)}
            className={`rounded-lg border px-3 py-2 text-left text-xs font-bold transition-colors disabled:cursor-default ${
              selectedType === type
                ? 'border-canva-purple bg-canva-purple/20 text-white'
                : 'border-gray-700 bg-gray-800/60 text-gray-300 hover:border-canva-purple/60'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {submitted && (
        <div className={`rounded-lg border p-4 text-sm ${isCorrect ? 'border-green-700/60 bg-green-950/20' : 'border-amber-700/60 bg-amber-950/20'}`}>
          <div className={`mb-2 font-bold ${isCorrect ? 'text-green-300' : 'text-amber-300'}`}>
            {isCorrect ? '잘 찾았습니다.' : `다시 보면 정답은 ${current.correctType}입니다.`}
          </div>
          <div className="mb-3 text-xs leading-relaxed text-gray-300">
            <div className="mb-1"><span className="font-bold text-white">왜 문제인가요?</span> {current.reason}</div>
            <div><span className="font-bold text-white">누가 불리해질 수 있나요?</span> {current.affected}</div>
          </div>
          <div className="rounded bg-gray-900/70 p-3 text-xs leading-relaxed">
            <div className="mb-1 font-bold text-canva-teal">더 나은 표현</div>
            <div className="text-gray-200">“{current.improvement}”</div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        {!submitted ? (
          <button
            onClick={submitAnswer}
            disabled={!selectedType}
            className="flex-1 bg-canva-purple hover:bg-canva-purple/80 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg py-2.5 text-sm font-bold transition-colors"
          >
            확인하기
          </button>
        ) : (
          <button onClick={handleNext}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2.5 text-sm font-bold transition-colors">
            {currentIndex < cases.length - 1 ? '다음 문장 →' : '마무리'}
          </button>
        )}
      </div>
    </div>
  );
};

// 5-3: 딜레마 시나리오
export const Lesson53Interactive = ({ onComplete }: CompletionProps = {}) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const scenarios = [
    {
      id: 1,
      situation: '학생 A가 최근 자해 위험 신호를 보이고 있습니다. 담임 교사가 AI에게 상담 방법을 물어보려 합니다. 어떻게 입력해야 할까요?',
      options: [
        '① "홍길동(4-2, 010-0000-0000)이 자해 위험이 있어요. 어떻게 상담해야 하나요?"',
        '② "자해 위험 신호를 보이는 초등 4학년 학생을 상담하는 방법을 알려주세요."',
        '③ AI에게 묻지 않고 학교 상담사에게 직접 연결한다.'
      ],
      correctAnswers: [1, 2],
      explanation: '②③ 모두 가능합니다. ①은 개인정보 입력으로 부적절합니다.'
    },
    {
      id: 2,
      situation: '학교폭력 사안 처리 문서를 작성해야 합니다. AI에게 초안을 요청하려 합니다.',
      options: [
        '① 피해 학생·가해 학생 이름과 구체적 상황을 모두 입력한다.',
        '② 이름을 A·B로 바꾸고 날짜·장소도 일반화해서 입력한다.',
        '③ AI에게 맡기지 않고 직접 작성한다.'
      ],
      correctAnswers: [1],
      explanation: '② 권장합니다. ①은 개인정보 위반입니다. ③도 가능하지만 비효율입니다.'
    },
    {
      id: 3,
      situation: '학급 학생 30명의 알레르기 정보를 AI에게 주고 급식 주의사항 안내문을 만들려 합니다.',
      options: [
        '① 학생 이름과 알레르기 항목을 표로 입력한다.',
        '② 알레르기 유형만 개수로 입력한다. ("달걀 알레르기 5명, 우유 3명")',
        '③ AI를 사용하지 않는다.'
      ],
      correctAnswers: [1],
      explanation: '② 권장합니다. ①은 개인정보 위반입니다.'
    },
    {
      id: 4,
      situation: '새 학기 학부모 상담 내용을 AI로 정리하려 합니다. 상담 내용에는 가정 내 어려움, 부모 연락처가 포함됩니다.',
      options: [
        '① 상담 내용 전체를 AI에게 붙여넣는다.',
        '② 가족 상황은 일반화하고 연락처는 제외해서 입력한다.',
        '③ AI를 사용하지 않고 수기로 정리한다.'
      ],
      correctAnswers: [1],
      explanation: '② 권장합니다. ①은 민감 개인정보 입력입니다. ③도 가능합니다.'
    }
  ];

  const isCorrect = selectedAnswer !== null && scenarios[currentScenario].correctAnswers.includes(selectedAnswer);

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">딜레마 시나리오</div>

      <div className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200">
        <p className="leading-relaxed">{scenarios[currentScenario].situation}</p>
      </div>

      <div className="space-y-2">
        {scenarios[currentScenario].options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedAnswer(idx);
              setShowExplanation(true);
              if (currentScenario === scenarios.length - 1) {
                onComplete?.();
              }
            }}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              selectedAnswer === idx
                ? isCorrect
                  ? 'bg-green-900/40 border border-green-700 text-green-100'
                  : 'bg-red-900/40 border border-red-700 text-red-100'
                : 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && selectedAnswer !== null && (
        <div className={`p-4 rounded-lg text-sm ${
          isCorrect
            ? 'bg-green-900/30 border border-green-700 text-green-100'
            : 'bg-blue-900/30 border border-blue-700 text-blue-100'
        }`}>
          <div className="font-bold mb-1">{isCorrect ? '✓ 맞습니다' : 'ℹ️ 설명'}</div>
          <p>{scenarios[currentScenario].explanation}</p>
        </div>
      )}

      {currentScenario < scenarios.length - 1 && selectedAnswer !== null && (
        <button
          onClick={handleNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-3 text-sm font-medium transition-colors"
        >
          다음 시나리오
        </button>
      )}

      <div className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-700">
        {currentScenario + 1} / {scenarios.length}
      </div>
    </div>
  );
};

// 5-4: 판단 퀴즈
export const Lesson54Interactive = ({ onComplete }: CompletionProps = {}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const quizzes = [
    {
      situation: '학생이 독서 감상문을 AI로 작성해서 제출했습니다.',
      options: ['표기 필요', '표기 불필요', '판단 어려움'],
      answer: '표기 필요',
      explanation: 'AI가 작성한 것을 학생 작품으로 제출하는 것은 학문적 정직성 위반입니다.'
    },
    {
      situation: '교사가 AI로 만든 학습지를 수업에 사용했습니다.',
      options: ['표기 필요', '표기 불필요', '판단 어려움'],
      answer: '표기 필요',
      explanation: '법적 의무는 아니나 투명성 측면에서 권장합니다.'
    },
    {
      situation: '학생이 AI에게 아이디어를 물어보고 자신의 언어로 다시 써서 제출했습니다.',
      options: ['표기 필요', '표기 불필요', '판단 어려움'],
      answer: '판단 어려움',
      explanation: '학교마다 기준이 다릅니다. 명확한 학급 규칙이 필요합니다.'
    },
    {
      situation: '교사가 AI로 만든 학급 안내 가정통신문을 학부모에게 발송했습니다.',
      options: ['표기 필요', '표기 불필요', '판단 어려움'],
      answer: '표기 불필요',
      explanation: '법적 기준에서는 표기 불필요합니다. 다만 검토 후 발송은 필수입니다.'
    },
    {
      situation: '교사가 AI 생성 이미지를 학교 행사 포스터에 사용했습니다.',
      options: ['표기 필요', '표기 불필요', '판단 어려움'],
      answer: '판단 어려움',
      explanation: 'AI 생성 이미지 저작권은 아직 불명확합니다. 공식 행사 자료에는 주의가 필요합니다.'
    }
  ];

  const isCorrect = selectedAnswer === quizzes[currentQuestion].answer;

  const handleAnswer = (option: string) => {
    setSelectedAnswer(option);
    setShowExplanation(true);
    if (currentQuestion === quizzes.length - 1) {
      onComplete?.();
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizzes.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="text-white font-bold mb-2">출처 표기 판단 퀴즈</div>

      <div className="bg-gray-900 p-4 rounded-lg text-sm text-gray-200">
        <p className="leading-relaxed">{quizzes[currentQuestion].situation}</p>
      </div>

      <div className="space-y-2">
        {quizzes[currentQuestion].options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
              selectedAnswer === option
                ? isCorrect
                  ? 'bg-green-900/40 border border-green-700 text-green-100'
                  : 'bg-red-900/40 border border-red-700 text-red-100'
                : 'bg-gray-800 border border-gray-700 text-gray-200 hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showExplanation && selectedAnswer && (
        <div className={`p-4 rounded-lg text-sm ${
          isCorrect
            ? 'bg-green-900/30 border border-green-700 text-green-100'
            : 'bg-blue-900/30 border border-blue-700 text-blue-100'
        }`}>
          <div className="font-bold mb-1">{isCorrect ? '✓ 맞습니다' : 'ℹ️ 해설'}</div>
          <p>{quizzes[currentQuestion].explanation}</p>
        </div>
      )}

      {currentQuestion < quizzes.length - 1 && selectedAnswer && (
        <button
          onClick={handleNext}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-3 text-sm font-medium transition-colors"
        >
          다음 문항
        </button>
      )}

      <div className="text-xs text-gray-400 mt-auto pt-4 border-t border-gray-700">
        {currentQuestion + 1} / {quizzes.length}
      </div>
    </div>
  );
};

// 5-5: 학년별 활동
interface Lesson55Props {
  onRun?: (input: string) => void;
  setUserInput?: (input: string) => void;
  onNavigateToLesson?: (id: string) => void;
}

export const Lesson55Interactive = ({ onRun, setUserInput, onNavigateToLesson }: Lesson55Props = {}) => {
  const [activeTab, setActiveTab] = useState<'lower' | 'middle' | 'upper'>('lower');
  const [schoolLevel, setSchoolLevel] = useState('초등학교 3-4학년군');
  const [studentCount, setStudentCount] = useState('24');
  const [studentTraits, setStudentTraits] = useState('');
  const [ethicsFocus, setEthicsFocus] = useState('종합');
  const hasApiKey = useExternalStorageState(hasGeminiApiKey, 'api-key-changed');
  const [showFallback, setShowFallback] = useState(false);

  const handleGenerate = () => {
    if (!onRun || !setUserInput) return;
    const focusDetail = {
      '종합': '모듈 5 전체 내용(할루시네이션, 편향, 프라이버시, 저작권)을 균형있게 포함',
      '할루시네이션': 'AI가 거짓 정보를 생성하는 현상과 검증 방법 중심',
      '편향': '알고리즘 편향의 사례와 다양성 확보 방법 중심',
      '프라이버시': '개인정보 보호와 안전한 AI 사용 방법 중심',
      '저작권': 'AI 생성물의 출처 표기와 학문적 정직성 중심'
    };

    const composed = `[학교급] ${schoolLevel}
[학생 수] ${studentCount}명
[학생 특성] ${studentTraits || '(특별한 기재 사항 없음 — 표준 학급으로 설계)'}
[윤리 수업 포커스] ${ethicsFocus} — ${focusDetail[ethicsFocus as keyof typeof focusDetail]}

위 정보를 바탕으로 우리 반에서 바로 사용할 수 있는 AI 윤리 수업 지도안 1차시를 작성해주세요.`;
    setUserInput(composed);
    onRun(composed);
  };

  const activities = {
    lower: [
      {
        title: '활동 1 — "로봇 친구 대화하기"',
        time: '20분',
        goal: 'AI가 사람과 다르다는 것을 이해한다',
        steps: [
          '교사가 AI와 대화하는 것을 보여줍니다',
          '"AI야, 배고파?"처럼 감정 관련 질문을 합니다',
          'AI의 답변을 보며 사람과 다른 점을 찾습니다',
          '"AI는 배고프지 않아요. 왜 그럴까요?" 토론'
        ]
      },
      {
        title: '활동 2 — "AI야, 틀려봐!"',
        time: '15분',
        goal: 'AI도 틀릴 수 있다는 것을 직접 경험한다',
        steps: [
          '학생들과 함께 말이 안 되는 질문 만들기',
          'AI의 답변 확인',
          '"AI가 이렇게 대답한 이유는 뭘까요?" 토론',
          '"AI가 틀렸을 때 우리는 어떻게 해야 할까요?" 토론'
        ]
      },
      {
        title: '활동 3 — "이건 누가 만들었을까?"',
        time: '20분',
        goal: 'AI 결과물과 사람 결과물을 구분하려는 태도를 기른다',
        steps: [
          'AI 그림 3장, 학생 그림 3장 섞어서 제시',
          '"이 중에 AI가 만든 그림은 어느 것일까요?" 맞히기',
          'AI 그림의 특징 토론',
          '"사람이 만든 것과 AI가 만든 것 중 더 좋은 것은?" 토론'
        ]
      }
    ],
    middle: [
      {
        title: '활동 4 — "사실 탐정단"',
        time: '30분',
        goal: 'AI 정보를 교차 검증하는 습관을 기른다',
        steps: [
          'AI에게 우리 지역 관련 정보 질문',
          'AI 답변을 기록',
          '모둠별로 책·검색으로 AI 답변 확인',
          '맞은 것, 틀린 것, 확인 불가 것 분류 및 발표'
        ]
      },
      {
        title: '활동 5 — "AI 글 vs. 내 글"',
        time: '30분',
        goal: 'AI 생성 글과 사람이 쓴 글을 비교 분석한다',
        steps: [
          'AI 글 2편, 학생 글 2편 제시 (같은 주제, 작성자 표시 없음)',
          '모둠별로 "AI가 쓴 것 같은 글" 고르기',
          'AI 글의 특징 분석 (어색한 표현, 지나친 완벽함 등)',
          'AI 글의 좋은 점과 부족한 점 토론'
        ]
      },
      {
        title: '활동 6 — "AI에게 좋은 질문 하기"',
        time: '25분',
        goal: '프롬프트에 따라 AI 답변이 달라짐을 이해한다',
        steps: [
          '같은 주제를 다르게 질문해보기',
          '두 답변 비교',
          '"어떤 질문이 더 유용한 답변을 줬는지" 토론',
          '더 좋은 질문 직접 만들어보기'
        ]
      }
    ],
    upper: [
      {
        title: '활동 7 — "AI와 나의 생각 비교"',
        time: '40분',
        goal: 'AI 결과와 자신의 생각을 비교하는 메타인지를 기른다',
        steps: [
          '주제 제시 (예: "환경 문제를 해결하는 방법")',
          '먼저 학생이 자신의 생각을 5분간 작성',
          '같은 주제로 AI에게 질문',
          '내 생각과 AI 답변 비교 분석 (공통점, 차이점, AI에게 없는 내 생각)'
        ]
      },
      {
        title: '활동 8 — "AI 사용 일지 쓰기"',
        time: '15분',
        goal: 'AI 사용 과정을 투명하게 기록하는 습관을 기른다',
        steps: [
          '프로젝트 수업 중 AI 사용 시 일지 작성',
          '일지: 날짜·과제명·질문 내용·수정 사항 등 기록',
          '일지를 바탕으로 "AI를 어떻게 활용했는지" 발표',
          '"AI를 사용했다는 것을 왜 밝혀야 할까요?" 토론'
        ]
      },
      {
        title: '활동 9 — "AI 편향 찾기"',
        time: '40분',
        goal: 'AI의 알고리즘 편향을 인식하고 비판적으로 바라본다',
        steps: [
          'AI에게 다양한 직업·역할을 묘사하도록 요청',
          '각 묘사에서 성별·인종·나이 편향 분석',
          '"AI가 편향된 이유" 추론',
          '편향을 줄이는 프롬프트를 직접 만들어 비교'
        ]
      }
    ]
  };

  const tabConfig = [
    { id: 'lower' as const, label: '초등 1-2학년군', emoji: '🌱' },
    { id: 'middle' as const, label: '초등 3-4학년군', emoji: '🌿' },
    { id: 'upper' as const, label: '초등 5-6학년군', emoji: '🌳' }
  ];

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      {/* AI 지도안 생성 폼 */}
      <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-canva-purple/40 rounded-xl p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="text-white font-bold flex items-center gap-2">
            <span className="text-lg">🎓</span> AI 윤리 수업 지도안 생성기
          </div>
        </div>

        <div className="text-[11px] text-gray-400 mb-2 leading-relaxed">
          우리 반 정보를 입력하면 Gemini AI가 바로 사용할 수 있는 <span className="text-canva-teal font-bold">맞춤 수업 지도안</span>을 작성합니다.
        </div>

        <div className="space-y-2">
          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">학교급 / 학년</label>
            <select
              value={schoolLevel}
              onChange={(e) => setSchoolLevel(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-canva-purple"
            >
              <option>초등학교 1-2학년군</option>
              <option>초등학교 3-4학년군</option>
              <option>초등학교 5-6학년군</option>
              <option>중학교 1학년</option>
              <option>중학교 2학년</option>
              <option>중학교 3학년</option>
              <option>고등학교 1학년</option>
              <option>고등학교 2학년</option>
              <option>고등학교 3학년</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">학생 수</label>
            <input
              type="number"
              value={studentCount}
              onChange={(e) => setStudentCount(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-canva-purple"
              placeholder="예: 24"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">학생 특성 (자유 기재)</label>
            <textarea
              value={studentTraits}
              onChange={(e) => setStudentTraits(e.target.value)}
              rows={2}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-canva-purple resize-none"
              placeholder={'예: 디지털 기기 사용 익숙, 비판적 분석 경험 적음, 다문화 학생 3명'}
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-300 mb-1">윤리 수업 주제 및 포커스</label>
            <select
              value={ethicsFocus}
              onChange={(e) => setEthicsFocus(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-canva-purple"
            >
              <option>종합</option>
              <option>할루시네이션</option>
              <option>편향</option>
              <option>프라이버시</option>
              <option>저작권</option>
            </select>
            <div className="mt-1 text-[10px] text-gray-500">
              {ethicsFocus === '종합' && '모듈 5 전체 내용을 균형있게 다룹니다.'}
              {ethicsFocus === '할루시네이션' && 'AI의 거짓 정보 생성과 검증 방법에 중점을 둡니다.'}
              {ethicsFocus === '편향' && '알고리즘 편향의 사례와 개선 방법에 중점을 둡니다.'}
              {ethicsFocus === '프라이버시' && '개인정보 보호와 안전한 AI 사용에 중점을 둡니다.'}
              {ethicsFocus === '저작권' && 'AI 생성물의 출처 표기와 학문적 정직성에 중점을 둡니다.'}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          {!hasApiKey && onNavigateToLesson && (
            <button
              onClick={() => onNavigateToLesson('l1-4')}
              className="px-4 py-2 bg-canva-purple text-white rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all shadow-lg"
            >
              API 키 입력
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={!onRun}
            className="flex-1 px-5 py-2 bg-canva-teal text-white rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all disabled:opacity-40 shadow-lg shadow-teal-900/20"
          >
            ✨ AI 지도안 생성 (Run)
          </button>
        </div>

        {!hasApiKey && (
          <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded text-[10px] text-amber-200 leading-relaxed">
            💡 API 키가 없어도 괜찮습니다. 아래 <span className="font-bold">&quot;기본 수업 활동 모음&quot;</span>에서 저·중·고학년별로 준비된 9가지 활동을 바로 구글 Docs로 내보내 수업에 쓸 수 있습니다.
          </div>
        )}
      </div>

      {/* Fallback: 기존 9개 시나리오 활동 */}
      <div className="mt-1">
        <button
          onClick={() => setShowFallback(!showFallback)}
          className="w-full flex items-center justify-between bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-left transition-colors"
        >
          <div>
            <div className="text-white font-bold text-sm">📚 기본 수업 활동 모음 (API 없이 즉시 사용)</div>
            <div className="text-[10px] text-gray-400 mt-0.5">저·중·고학년별로 준비된 9가지 검증 활동 · 구글 Docs 바로 내보내기 가능</div>
          </div>
          <span className={`text-gray-400 transition-transform ${showFallback ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {showFallback && (
          <div className="mt-3">
            <div className="flex gap-2 overflow-x-auto mb-3">
              {tabConfig.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg whitespace-nowrap text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {tab.emoji} {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {activities[activeTab].map((activity, idx) => (
                <div key={idx} className="bg-gray-900 rounded-lg p-4 border border-gray-800">
                  <div className="font-bold text-white mb-2">{activity.title}</div>
                  <div className="text-xs text-gray-400 mb-3">⏱️ {activity.time} | 목표: {activity.goal}</div>
                  <div className="space-y-2 text-sm text-gray-300">
                    {activity.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex gap-2">
                        <span className="text-gray-500 flex-shrink-0">{stepIdx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end">
                    <GoogleDocsButton
                      text={`${activity.title} (${activity.time})\n목표: ${activity.goal}\n\n진행 방법:\n${activity.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 5-6: 가이드라인 빌더
type GuidelineCategory = {
  key: string;
  label: string;
  emoji: string;
  options: string[];
};

const GUIDELINE_CATEGORIES: GuidelineCategory[] = [
  {
    key: 'hallucination',
    label: '할루시네이션 대응',
    emoji: '🔍',
    options: [
      'AI 결과물의 핵심 사실은 반드시 교차 검증한다',
      '수치·날짜·법령이 포함된 내용은 출처를 요청한다',
      '중요 문서는 RAG 방식(자료 먼저 제공)으로 요청한다',
      '인용·통계는 1차 출처를 직접 확인한 뒤 사용한다',
      '"확실하지 않으면 모른다고 답해"라는 지시를 프롬프트에 포함한다',
      '동일한 질문을 다르게 표현해 두 번 이상 확인한다',
      '학생에게 보여주기 전 모든 사실을 한 번 더 점검한다',
    ],
  },
  {
    key: 'privacy',
    label: '데이터 프라이버시',
    emoji: '🔒',
    options: [
      '학생 이름·학번·주민번호는 AI에 입력하지 않는다',
      '학부모 연락처·주소·계좌 정보는 AI에 입력하지 않는다',
      '교사 인사·호봉·평정 정보는 AI에 입력하지 않는다',
      '학생 진단·상담·심리 검사 결과는 AI에 입력하지 않는다',
      'AI 입력 전 익명화·일반화를 기본 절차로 삼는다',
      '학생 사례는 "초등 4학년 남학생" 식의 익명 표현으로 변환한다',
      '학교 내부 문서를 외부 AI에 그대로 붙여넣지 않는다',
      '의심스러우면 교육청 개인정보보호 담당자에게 먼저 문의한다',
    ],
  },
  {
    key: 'copyright',
    label: '저작권·출처',
    emoji: '©️',
    options: [
      '수업 자료에 AI 생성물을 사용할 때 출처를 명시한다 ("AI 생성물 / 검토: 본인")',
      '학생에게도 AI 사용 시 출처 표기를 요구한다',
      'AI 생성물을 상업적으로 판매·배포하지 않는다',
      'AI가 만든 이미지·음악도 동일한 출처 표기 원칙을 적용한다',
      '타인의 저작물을 AI에 학습용으로 그대로 입력하지 않는다',
      'AI 생성물의 저작권 귀속이 불분명할 때는 사용을 보류한다',
      '학교 공식 문서·홍보물에는 AI 생성물 비율을 별도 명시한다',
    ],
  },
  {
    key: 'aiSlop',
    label: 'AI Slop 방지 (검토·정리)',
    emoji: '✋',
    options: [
      '다른 사람에게 보내기 전 처음부터 끝까지 직접 읽는다',
      'AI 초안을 그대로 복사·전송하지 않는다 — 최소 한 번 다듬는다',
      'AI 특유의 일반론·미사여구를 의도적으로 덜어낸다',
      '받는 사람이 끝까지 읽을 분량으로 줄인다',
      '내 목소리·내 흔적이 남도록 표현을 손본다',
      '만드는 데 1분 걸렸으면 검토에 5분을 쓴다',
      '"이 글은 누가 썼다"는 흔적이 남는지 자문한다',
    ],
  },
  {
    key: 'studentEducation',
    label: '학생 교육',
    emoji: '🎓',
    options: [
      '학기 초 AI 사용 규칙을 학급 단위로 함께 정한다',
      'AI에게 의존하지 않고 스스로 사고하는 시간을 확보한다',
      'AI 결과물의 오류를 찾아 수정하는 활동을 정기적으로 진행한다',
      '학생이 AI에 입력해도 되는 정보·안 되는 정보를 명확히 구분해 안내한다',
      'AI 결과물 제출 시 본인이 검토·수정한 흔적을 함께 제출하게 한다',
      '평가 과제에서 AI 사용 허용 범위를 사전에 명시한다',
      'AI 윤리 사례를 수업 중 정기적으로 토론한다',
    ],
  },
  {
    key: 'classroomRules',
    label: '학급 운영 규칙',
    emoji: '📋',
    options: [
      'AI 사용 가능 과제와 사용 금지 과제를 명확히 구분한다',
      '제출물에는 "AI 사용 여부 / 검토자" 칸을 추가한다',
      'AI 결과물 검토 절차를 학생과 공유한다',
      '학급 단위 AI 사용 일지를 운영한다',
      '연 2회 이상 가이드라인을 함께 검토·수정한다',
      '의심 사례는 학급 회의에서 함께 다룬다',
    ],
  },
];

export const Lesson56Interactive = ({ onComplete }: CompletionProps = {}) => {
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState('');

  const toggleCheck = (catKey: string, item: string) => {
    setSelected(prev => {
      const arr = prev[catKey] || [];
      return {
        ...prev,
        [catKey]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item],
      };
    });
  };

  const totalSelected = Object.values(selected).reduce((sum, arr) => sum + arr.length, 0)
    + Object.values(customInputs).filter(v => v?.trim()).length;

  const handleGenerateGuideline = () => {
    const sections = GUIDELINE_CATEGORIES.map(cat => {
      const items = selected[cat.key] || [];
      const custom = customInputs[cat.key]?.trim();
      const lines = [`[${cat.label} 원칙]`];
      if (items.length === 0 && !custom) {
        lines.push('(선택된 항목 없음)');
      } else {
        items.forEach((item, i) => lines.push(`${i + 1}. ${item}`));
        if (custom) lines.push(`${items.length + 1}. ${custom}`);
      }
      return lines.join('\n');
    });

    const guideline = `○○초등학교 ○학년 ○반 AI 윤리 가이드라인

${sections.join('\n\n')}

작성일: _________ / 담임: _________`;

    setGenerated(guideline);
    onComplete?.();
  };

  return (
    <div className="flex-1 bg-[#0e1318] rounded-xl p-5 border border-gray-800 flex flex-col gap-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="text-white font-bold">나만의 AI 윤리 가이드라인 빌더</div>
        {!generated && (
          <div className="text-[10px] text-gray-400 font-mono">
            선택 <span className="text-canva-teal font-bold">{totalSelected}</span>개
          </div>
        )}
      </div>

      {!generated ? (
        <div className="space-y-3">
          {GUIDELINE_CATEGORIES.map(cat => {
            const catSelected = selected[cat.key] || [];
            return (
              <div key={cat.key} className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{cat.emoji}</span> {cat.label}
                  </div>
                  {catSelected.length > 0 && (
                    <span className="text-[10px] font-bold text-canva-teal bg-canva-teal/15 border border-canva-teal/40 px-2 py-0.5 rounded-full">
                      {catSelected.length}개 선택
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {cat.options.map((option, idx) => {
                    const checked = catSelected.includes(option);
                    return (
                      <label
                        key={idx}
                        className={`flex items-start gap-2 cursor-pointer p-1.5 rounded transition-colors ${
                          checked ? 'bg-canva-teal/10' : 'hover:bg-gray-800/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCheck(cat.key, option)}
                          className="mt-1 accent-canva-teal"
                        />
                        <span className={`text-[12px] leading-relaxed ${checked ? 'text-canva-teal' : 'text-gray-300'}`}>{option}</span>
                      </label>
                    );
                  })}
                  <input
                    type="text"
                    placeholder="직접 추가하고 싶은 원칙..."
                    value={customInputs[cat.key] || ''}
                    onChange={e => setCustomInputs({ ...customInputs, [cat.key]: e.target.value })}
                    className="w-full mt-2 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-[12px] text-white placeholder-gray-500 focus:outline-none focus:border-canva-teal/60"
                  />
                </div>
              </div>
            );
          })}

          <button
            onClick={handleGenerateGuideline}
            disabled={totalSelected === 0}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg py-3 px-3 text-sm font-bold transition-colors"
          >
            {totalSelected === 0 ? '항목을 1개 이상 선택해 주세요' : `가이드라인 문서 생성 (${totalSelected}개 항목)`}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-sm text-green-100">
            ✓ 나만의 AI 윤리 가이드라인이 완성되었습니다!
          </div>
          <pre className="bg-gray-900 p-4 rounded-lg text-xs text-gray-300 overflow-x-auto border border-gray-800 whitespace-pre-wrap">
            {generated}
          </pre>
          <div className="flex gap-2">
            <GoogleDocsButton text={generated} className="flex-1 justify-center" />
            <button
              onClick={() => setGenerated('')}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-2 px-3 text-sm font-medium transition-colors"
            >
              다시 작성
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 5-7: AI Slop vs 검토된 결과물 비교
type SlopCase = {
  scenario: string;
  context: string;
  slop: string;
  reviewed: string;
  changes: string[];
};

const SLOP_CASES: SlopCase[] = [
  {
    scenario: "가정통신문",
    context: "5월 가정의 달 행사 안내 — AI에게 '5월 행사 가정통신문 써줘'만 입력한 결과",
    slop: `존경하는 학부모님께,

따뜻한 햇살이 비추는 5월을 맞이하여 학부모님 가정에 평안과 행복이 가득하시기를 진심으로 기원합니다. 우리 학교에서는 5월을 맞이하여 다양한 행사를 준비하고 있으며, 이는 학생들에게 의미 있는 경험을 제공할 수 있는 소중한 기회가 될 것입니다.

먼저, 가정의 달을 기념하여 다양한 활동들이 진행될 예정이며, 학생들의 적극적인 참여와 학부모님의 따뜻한 관심을 부탁드립니다. 자세한 사항은 추후 안내드리도록 하겠습니다.

항상 우리 학교에 보내주시는 사랑과 관심에 깊이 감사드립니다.`,
    reviewed: `학부모님께,

5월 가정의 달을 맞아 우리 반에서는 두 가지 활동을 진행합니다.

1. **부모님께 편지 쓰기 (5월 8일, 1교시)** — 평소 표현하기 어려운 마음을 글로 정리해 봅니다. 완성된 편지는 가정에서 직접 전달하도록 안내합니다.
2. **가족 사진 전시회 (5월 15일까지 사진 제출)** — A4 한 장에 가족 사진과 짧은 소개글을 붙여 5월 16일~20일 교실 뒤편에 전시합니다.

사진은 학급 외부에 공개되지 않으며, 행사 종료 후 즉시 가정으로 돌려드립니다.

문의: 4학년 2반 담임 김OO (학교 대표번호 02-XXXX-XXXX)`,
    changes: [
      "❌ 미사여구만 가득한 인사말 → ✅ 무엇을 언제 어떻게 하는지 즉시 명시",
      "❌ '다양한 행사' 같은 모호한 표현 → ✅ 행사명·날짜·교시 구체화",
      "❌ '추후 안내' 회피 → ✅ 사진 처리·문의처까지 한 번에",
      "❌ 누가 보냈는지 알 수 없음 → ✅ 담임 이름·연락처 명기",
    ],
  },
  {
    scenario: "생기부 문구",
    context: "한 학생에 대해 AI에게 '활발한 학생 생기부 문구 써줘'만 입력한 결과",
    slop: `매사에 적극적이고 긍정적인 자세로 학교 생활에 임하며, 친구들과 원만한 관계를 형성하고 있음. 다양한 활동에 열정적으로 참여하며, 자신의 의견을 적극적으로 표현하는 모습을 보임. 학습에 있어서도 성실한 태도를 보이며, 꾸준한 노력으로 좋은 결과를 만들어 가고 있음. 앞으로의 성장이 더욱 기대되는 학생임.`,
    reviewed: `5월 과학 '식물의 한살이' 관찰 활동에서 강낭콩 발아 과정을 매일 자율적으로 기록하여 14일치 관찰 일지를 완성함. 본인의 관찰을 바탕으로 모둠 발표 시 "물 주는 시간이 늦으면 잎이 처지는 정도"를 직접 그래프로 정리해 발표하여 친구들의 후속 질문을 이끌어 냄. 모둠 활동에서 의견이 갈릴 때 상대 의견을 끝까지 듣고 자신의 근거를 차분히 제시하는 태도가 돋보임.`,
    changes: [
      "❌ 누구에게나 해당될 수 있는 일반론 → ✅ 구체적 활동·날짜·산출물 명기",
      "❌ '적극적', '성실', '원만' 같은 추상어 나열 → ✅ 관찰된 행동 한 가지를 자세히",
      "❌ 결과가 보이지 않음 → ✅ 관찰 일지 14일·그래프·발표 같은 결과물 제시",
      "❌ 학생을 구분할 수 없음 → ✅ 이 학생만의 장면이 보임",
    ],
  },
  {
    scenario: "학습지",
    context: "AI에게 '4학년 사회 학습지 만들어줘'만 입력한 결과",
    slop: `1. 우리나라의 수도는 어디인가?
2. 사회는 무엇인가?
3. 사람들은 왜 함께 살아가는가?
4. 우리 지역의 특징을 설명하시오.
5. 가족의 의미는 무엇인가?
6. 학교에서 지켜야 할 규칙은?
7. 환경 보호는 왜 중요한가?
8. 우리나라의 자랑스러운 점은?
9. 사회 구성원으로서의 역할은?
10. 미래 사회는 어떻게 변할까?`,
    reviewed: `**4학년 사회 — 우리 지역의 환경 (단원 2-1)**

지난 시간 배운 '지역의 자연환경 vs 인문환경' 분류를 떠올리며 풀어 보세요.

**1.** 다음 중 '자연환경'에 속하는 것을 모두 고르세요. ( )
   ① 한강   ② 시청   ③ 남산   ④ 지하철   ⑤ 평야

**2.** 우리 지역(서울 OO구)의 자연환경 한 가지를 떠올리고, 그것이 우리 생활에 어떤 영향을 주는지 한 문장으로 쓰세요.
   → ________________________________________________

**3.** 같은 지역이라도 100년 전과 지금의 인문환경은 어떻게 달라졌을까요? 한 가지만 예를 들어 설명해 보세요.
   → ________________________________________________`,
    changes: [
      "❌ 단원·차시 무관한 일반 질문 → ✅ '단원 2-1, 자연·인문환경 분류'로 학습 맥락 연결",
      "❌ 답이 없거나 모호한 질문 → ✅ 객관식·서술형 형식과 답 칸 명시",
      "❌ 우리 지역과 무관 → ✅ '서울 OO구' 같은 우리 학급 맥락 반영",
      "❌ 모든 학생이 같은 답 → ✅ 자기 경험으로 답하는 개방형 질문",
    ],
  },
];

export const Lesson57Interactive = ({ onComplete }: CompletionProps = {}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [showReviewed, setShowReviewed] = useState(false);
  const [selfChecked, setSelfChecked] = useState<string[]>([]);
  const current = SLOP_CASES[activeIdx];

  const checks = [
    "사실관계(이름·날짜·수치·인용)를 직접 확인했다",
    "이 학급·학생·상황에 맞는 표현인지 다듬었다",
    "받는 사람이 끝까지 읽을 만한 길이로 줄였다",
    "AI 특유의 일반론·미사여구를 덜어냈다",
    "내 목소리·내 흔적이 남도록 정리했다",
  ];

  const toggleCheck = (item: string) => {
    setSelfChecked(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  };

  return (
    <div className="space-y-4 text-gray-100">
      {/* 시나리오 선택 */}
      <div>
        <div className="text-xs text-gray-400 mb-2">사례 선택</div>
        <div className="flex flex-wrap gap-2">
          {SLOP_CASES.map((c, i) => (
            <button
              key={i}
              onClick={() => { setActiveIdx(i); setShowReviewed(false); }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                i === activeIdx
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                  : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200'
              }`}
            >
              {c.scenario}
            </button>
          ))}
        </div>
      </div>

      {/* 컨텍스트 */}
      <div className="text-[11px] text-gray-400 italic px-1">{current.context}</div>

      {/* AI Slop 결과물 */}
      <div className="bg-rose-500/5 border border-rose-500/30 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-rose-400 font-bold text-xs">⚠️ AI Slop — 검토 없는 그대로</span>
        </div>
        <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{current.slop}</pre>
      </div>

      {!showReviewed ? (
        <button
          onClick={() => {
            setShowReviewed(true);
            onComplete?.();
          }}
          className="w-full py-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 font-bold text-sm transition-colors"
        >
          ✋ 5분간 검토·정리한 결과 보기
        </button>
      ) : (
        <>
          {/* 검토된 결과물 */}
          <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-emerald-400 font-bold text-xs">✅ 5분 검토 후 — 다듬어 보낸 글</span>
            </div>
            <pre className="text-xs text-gray-200 whitespace-pre-wrap leading-relaxed font-sans">{current.reviewed}</pre>
          </div>

          {/* 무엇이 달라졌나 */}
          <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-4">
            <div className="text-xs font-bold text-gray-300 mb-2">달라진 점</div>
            <ul className="space-y-1.5">
              {current.changes.map((c, i) => (
                <li key={i} className="text-[11px] text-gray-300 leading-relaxed">{c}</li>
              ))}
            </ul>
          </div>

          {/* 자가 점검 체크리스트 */}
          <div className="bg-amber-500/5 border border-amber-500/30 rounded-xl p-4">
            <div className="text-xs font-bold text-amber-300 mb-3">📋 보내기 전 나의 자가 점검</div>
            <div className="space-y-2">
              {checks.map((c, i) => {
                const checked = selfChecked.includes(c);
                return (
                  <label
                    key={i}
                    onClick={() => toggleCheck(c)}
                    className={`flex items-start gap-2 cursor-pointer p-2 rounded-lg transition-colors ${
                      checked ? 'bg-amber-500/15' : 'hover:bg-gray-800/40'
                    }`}
                  >
                    <span className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] flex-shrink-0 ${
                      checked ? 'bg-amber-400 border-amber-400 text-gray-900' : 'border-gray-600 text-transparent'
                    }`}>✓</span>
                    <span className={`text-[11px] leading-relaxed ${checked ? 'text-amber-200' : 'text-gray-300'}`}>{c}</span>
                  </label>
                );
              })}
            </div>
            {selfChecked.length === checks.length && (
              <div className="mt-3 text-[11px] text-emerald-300 font-bold">
                ✓ 5가지 모두 통과 — 이제 보내도 됩니다.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
