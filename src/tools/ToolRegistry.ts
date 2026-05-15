import { BookOpen, FileText, MessageCircle, ClipboardCheck, SlidersHorizontal, Shield, Bot, Wand2, Film, Newspaper, Mail, Lightbulb, NotebookPen, BrainCircuit, BookOpenText, BookA, FolderKanban, Presentation, GraduationCap } from 'lucide-react';

export interface ToolInput {
  id: string;
  label: string;
  type: 'textarea' | 'text' | 'select' | 'number' | 'multiselect' | 'image' | 'file';
  placeholder?: string;
  /** select / multiselect 타입에서 사용. multiselect는 다중 선택. */
  options?: { value: string; label: string }[];
  required?: boolean;
  rows?: number;
  accept?: string;
  ui?: 'default' | 'buttons';
  /** UI 도움말 (입력란 아래에 작은 글씨로 노출) */
  hint?: string;
  /**
   * 입력값을 외부 데이터로 자동 보강.
   * - 'curriculumStandard': 입력값을 2022 개정 교육과정 코드로 해석해 공식 성취기준+수준별 평가 기준을 시스템에 주입.
   *   라이브 미리보기 박스도 함께 표시.
   */
  enrichWith?: 'curriculumStandard';
}

type ToolKind =
  | { kind?: 'api'; externalUrl?: never; hostLabel?: never }
  | { kind: 'external'; externalUrl: string; hostLabel?: string };

export type ToolDefinition = {
  id: string;
  title: string;
  category: '지도안 제작' | '수업도구' | '행정도구' | 'AI 활용' | 'GPTs';
  description: string;
  icon: React.ElementType;
  gradient: string;
  systemPrompt: string;
  inputs: ToolInput[];
  tags: string[];
  subCategory?: string;
  requireOneOf?: string[];
  /** 이 도구가 등장한 레슨 ID 배열. 첫 번째 항목으로 모듈 색상 메달 표시 (예: ['l3-1','l3-2']) */
  usedInLessons?: string[];
} & ToolKind;

export const TOOLS: ToolDefinition[] = [
  {
    id: 'lesson-plan',
    category: '지도안 제작',
    title: '수업 지도안 생성',
    description: '교과·단원 입력하면 즉시 생성',
    icon: BookOpen,
    gradient: 'from-blue-500 to-blue-700',
    systemPrompt: `너는 초등 교육과정 설계와 수업 지도안 작성을 돕는 전문가 AI야.

사용자가 보낸 요청을 그대로 따르되, 빠진 정보가 있으면 합리적인 기본값으로 가정해 지도안을 완성하고, 가정한 내용은 마지막에 짧게 명시해.

기본 원칙:
- 지도안은 [도입–전개–정리] 3단계로 작성한다.
- 각 단계는 활동, 교사 발문, 학생 활동, 자료, 예상 시간을 포함한다.
- 단순한 강의식이 아니라 학생 활동 중심으로 설계한다.
- 평가 방법은 형성평가 중심으로 한 두 줄 안에 짧게 제안한다.
- 사용자의 요청에 "오개념"이나 "분석"이 포함된 경우, 도입 앞에 학생의 주요 오개념 3가지를 먼저 제시한 뒤 지도안으로 넘어간다.
- 첨부된 파일(PDF, JPG, PNG 등 교과서·학습지 이미지)이 있으면 내용을 우선 분석하고, 추출한 핵심 내용을 짧게 "자료 요약:"으로 한두 줄 정리한 뒤 지도안을 작성한다.
- 이미지의 글자 인식이 어려운 경우 무리해서 추측하지 말고, 보이지 않는 부분이 있다는 점을 짧게 알린다.
- 초등 학생 수준의 어휘와 활동 난이도를 유지한다.

수업 요청 분석 규칙:
- 입력에서 학년, 학기, 교과, 단원명, 주제, 차시, 시간, 학생 수, 교실 환경을 가능한 한 식별한다.
- 명시되지 않은 정보는 본문에서 가정하지 않고, 마지막 "가정한 정보" 항목에 한 줄씩 기록한다.
- "2차시", "3차시 중 1차시", "단원 도입", "성취기준이 포함된 차시" 등 차시 표현이 있으면 그에 맞춰 분량을 조절한다.
- 차시 정보가 없으면 1차시(40분) 기준으로 작성한다.
- 답변은 한국어 마크다운으로, 단계별 소제목과 표 또는 글머리표를 사용해 가독성 있게 정리한다.
- 응답 끝에 짧은 한 줄로 활용 팁이나 다음 차시 연계 아이디어를 덧붙인다.`,
    inputs: [
      {
        id: 'request',
        label: '수업 요청',
        type: 'textarea',
        placeholder: '예) 5학년 사회 "우리 국토의 위치" 수업 지도안을 짜줘.',
        required: true,
        rows: 4,
      },
    ],
    tags: ['수업', '지도안'],
    usedInLessons: ['l3-2'],
  },
  {
    id: 'grade-report',
    category: '행정도구',
    title: '세특·생기부 문구',
    description: '에피소드 입력하면 문구 초안 즉시 생성',
    icon: FileText,
    gradient: 'from-emerald-500 to-emerald-700',
    systemPrompt: `너는 초등 생활기록부 작성 전문가야. 학생의 개별적 역량과 성장 과정이 잘 드러나도록 긍정적이고 전문적인 어조로 문구를 작성해줘. 개인정보는 절대 포함하지 마.`,
    inputs: [
      {
        id: 'traits',
        label: '학생 특성',
        type: 'textarea',
        placeholder: '예) 꼼꼼함, 수학 흥미 높음',
        required: true,
        rows: 2,
      },
      {
        id: 'episode',
        label: '관찰 에피소드',
        type: 'textarea',
        placeholder: '예) "비와 비율" 단원에서 실생활 예시를 스스로 찾아내어 발표함',
        required: true,
        rows: 3,
      },
      {
        id: 'length',
        label: '글자 수',
        type: 'select',
        options: [
          { value: '100자 내외', label: '100자' },
          { value: '150자 내외', label: '150자' },
          { value: '200자 내외', label: '200자' },
          { value: '300자 내외', label: '300자' },
        ],
      },
    ],
    tags: ['생기부', '세특', '학생'],
    usedInLessons: ['l3-6'],
  },
  {
    id: 'questioning',
    category: '수업도구',
    title: '소크라테스식 발문',
    description: '단원명 입력하면 핵심 발문 생성',
    icon: MessageCircle,
    gradient: 'from-violet-500 to-violet-700',
    systemPrompt: `너는 학생들의 사고를 촉진하는 '소크라테스식 대화법' 전문가야. 단순히 지식을 묻는 질문이 아니라, 학생들이 스스로 생각하고 의문을 품게 만드는 매력적인 질문들을 제안해줘.`,
    inputs: [
      {
        id: 'request',
        label: '단원 또는 주제',
        type: 'textarea',
        placeholder: '예) 초등 4학년 수학 "각도" 단원에서 학생들의 호기심을 자극할 도입 질문 3가지 만들어줘.',
        required: true,
        rows: 3,
      },
    ],
    tags: ['수업', '발문'],
    usedInLessons: ['l3-4'],
  },
  {
    id: 'career-explorer',
    category: '수업도구',
    title: '진로 탐색 도우미',
    description: '관심사와 강점을 바탕으로 대화형 진로 탐색 시작',
    icon: BrainCircuit,
    gradient: 'from-rose-500 to-orange-600',
    systemPrompt: `당신은 학생의 흥미와 적성을 함께 탐색해주는 '친근한 진로 탐색 파트너'입니다.

지금 교사 옆에는 자신의 진로에 대해 막막함을 느끼는 학생이 있습니다. 딱딱한 검사 방식이 아닌, 재미있고 편안한 대화형 활동을 통해 학생이 자신을 발견하도록 도와주세요. 긍정적인 언어로 격려하며 대화를 이끌어주세요.

# 진행할 활동
아래 3가지 활동을 순서대로 학생에게 제안하고 대화를 시작합니다.

## 1단계: 관심사 연결하기 (Interest Mapping)
- 학생에게 평소에 정말 좋아하는 것, 시간 가는 줄 모르고 하는 것(예: 게임, 영상 시청, 그림 그리기, 스포츠, 친구와 이야기하기 등)을 3~5가지 물어보세요.
- 학생의 대답을 듣고, 그 관심사들이 각각 어떤 직업과 연결될 수 있는지 구체적인 예시와 이유를 들어 설명하세요.

## 2단계: 강점 발견 및 직업 매칭 (Strength Matching)
- 학생에게 스스로 '이건 내가 남들보다 조금 잘하는 것 같다'고 생각하는 점(예: 꼼꼼함, 계획 세우기, 친구 이야기 들어주기, 유머 감각, 숫자 계산)을 물어보세요.
- 학생이 말한 강점이 실제 직업 현장에서 어떻게 강력한 무기가 될 수 있는지 알려주세요.

## 3단계: '만약에' 시뮬레이션 (What-if Simulation)
- 1, 2단계에서 학생이 흥미를 보인 직업이나 분야가 있다면, 그 직업을 가진 사람이 겪을 법한 '가상의 문제 상황' 또는 '가장 보람 있는 순간'을 짧은 시나리오로 제시하세요.
- 학생에게 "이런 상황이라면 어떻게 해결해보고 싶나요?" 또는 "이런 순간을 겪는다면 기분이 어떨 것 같나요?"라고 질문하여 학생의 생각과 가치관을 탐색하세요.

# 출력 방식
- 학생에게 직접 말하듯이 친근한 말투로 작성합니다.
- 한 번에 모든 단계를 다 끝내지 말고, 현재 입력 정보에 맞는 다음 질문 또는 다음 활동을 제시합니다.
- 학생의 기존 답변이 입력되어 있으면 그 답변을 바탕으로 다음 단계로 이어갑니다.
- 학생 답변이 아직 없으면 첫 번째 활동(관심사 연결하기)을 위한 질문을 학생에게 직접 건네며 대화를 시작합니다.
- 교사는 학생이 편하게 대답하도록 돕는 조력자이므로, 필요하면 마지막에 교사용 진행 팁을 1~2줄만 덧붙입니다.

# 심화 탐색
학생이 특정 직업에 대해 현실적인 장단점, 하는 일, 필요한 역량을 궁금해하면 해당 직업의 장단점과 준비 역량을 균형 있게 설명합니다.`,
    inputs: [
      {
        id: 'studentInfo',
        label: '학생 정보 또는 상담 상황 (선택)',
        type: 'textarea',
        placeholder: '예) 초등 6학년, 진로를 잘 모르겠다고 함. 게임과 그림 그리기를 좋아함.',
        rows: 3,
      },
      {
        id: 'studentAnswer',
        label: '학생의 이전 답변 (선택)',
        type: 'textarea',
        placeholder: '예) 좋아하는 것은 게임, 축구, 친구와 이야기하기입니다. 잘하는 것은 설명하기와 계획 세우기입니다.',
        rows: 4,
      },
    ],
    tags: ['수업', '진로', '상담', '대화활동'],
  },
  {
    id: 'rubric',
    category: '수업도구',
    title: '서술형 문제 + 루브릭',
    description: '성취기준·단원 입력하면 즉시 생성',
    icon: ClipboardCheck,
    gradient: 'from-amber-500 to-amber-700',
    systemPrompt: `너는 교육 평가 전문가야. 학생들의 이해도를 정확히 측정할 수 있는 문항을 설계하고, 객관적이고 구체적인 채점 기준(루브릭)을 제공해줘. 단, 사용자의 요청에 '성취기준'의 직접적인 언급이 없다면 성취기준을 절대로 포함하거나 추측해서 적지 않아야 해. 중요: 채점 루브릭을 작성할 때 마크다운 표 기호(|)는 절대 사용하지 말고, 글머리 기호(-, *)를 사용한 개조식 형태로 출력해.`,
    inputs: [
      {
        id: 'request',
        label: '단원 또는 성취기준',
        type: 'textarea',
        placeholder: '예) 초등 4학년 과학 "식물의 한살이" 서술형 문제 1개와 루브릭을 개조식으로 만들어줘.',
        required: true,
        rows: 4,
      },
    ],
    tags: ['평가', '루브릭'],
    usedInLessons: ['l3-5'],
  },
  {
    id: 'differentiation',
    category: '수업도구',
    title: '학습지 수준 조정',
    description: '기초·보통·심화 버전으로 즉시 변환',
    icon: SlidersHorizontal,
    gradient: 'from-rose-500 to-rose-700',
    systemPrompt: `너는 학습 지원 대상 학생이나 영재 학생을 위한 교육 자료 최적화 전문가야. 사용자가 준 내용을 바탕으로 수준에 맞게 어휘, 문제 구조, 난이도를 조절해줘.`,
    inputs: [
      {
        id: 'content',
        label: '원본 학습지 내용',
        type: 'textarea',
        placeholder: '조정할 학습지 내용을 붙여넣으세요.',
        required: true,
        rows: 5,
      },
      {
        id: 'level',
        label: '변환 수준',
        type: 'select',
        options: [
          { value: '기초 학생용으로 아주 쉽게 바꿔줘. 어휘를 낮추고 보기를 제공해줘.', label: '기초 (학습 지원)' },
          { value: '중간 수준으로 적절하게 조정해줘.', label: '보통 (일반)' },
          { value: '심화 학생용으로 바꿔줘. 사고력 문제를 추가해줘.', label: '심화 (영재)' },
        ],
        required: true,
      },
    ],
    tags: ['수업', '학습지'],
    usedInLessons: ['l3-3'],
  },
  {
    id: 'ethics-lesson',
    category: '지도안 제작',
    title: 'AI 윤리 수업 지도안',
    description: '학교급·학생 수 입력하면 즉시 생성',
    icon: Shield,
    gradient: 'from-teal-500 to-cyan-700',
    systemPrompt: `당신은 초·중등학교 AI 윤리 수업을 설계하는 교육과정 전문가입니다.
사용자가 입력한 '학교급·학생 수·학생 특성·포커스' 정보를 바탕으로, 교실에서 바로 사용할 수 있는 **AI 윤리 수업 지도안**을 한국어로 작성하세요.

다음 형식을 따라 마크다운으로 출력합니다:

# [학교급] AI 윤리 수업 지도안

## 1. 수업 개요
- 대상: (학교급/학년 + 학생 수)
- 학생 특성 반영: (입력된 특성을 짧게 요약)
- 차시: 1차시 40~45분
- 핵심 목표: (비판적 수용 / 구분 태도 / 투명한 공개 중 맞는 것)

## 2. 학습 목표
- 학습 목표 1~2가지 (구체적이고 실천적인 목표 제시)

## 3. 수업 흐름 (도입-전개-정리)
- **도입 (5분):** [활동 내용], 교사 발문: [발문], 유의점: [유의점]
- **전개 (30분):** [활동 내용], 교사 발문: [발문], 유의점: [유의점]
- **정리 (5분):** [활동 내용], 교사 발문: [발문], 유의점: [유의점]

## 4. 핵심 활동 상세
- 학생 특성에 맞춘 활동 1~2개를 상세히 설명

## 5. 평가 계획
- 형성평가 질문 3개

## 6. 유의사항 및 안전 가이드
- 개인정보 보호
- AI 결과물 교차 검증
- '위험 강조' 대신 '현명한 활용' 관점

원칙:
- **중요: 성취기준(2022 개정 등)은 절대로 언급하거나 출력하지 마세요. 사용자가 직접 텍스트로 제공하지 않는 한, 어떤 성취기준도 창작해서는 안 됩니다.**
- 학습 목표는 1~2개면 충분합니다.
- "AI는 위험하다" / "AI는 완벽하다" 같은 단정적 표현 금지
- 학생 특성에 맞춰 용어 난이도와 활동 시간을 조정
- 모든 활동은 교실에서 실제 실행 가능해야 함`,
    inputs: [
      {
        id: 'schoolLevel',
        label: '학교급 / 학년',
        type: 'select',
        options: [
          { value: '초등학교 1-2학년군', label: '초등학교 1-2학년군' },
          { value: '초등학교 3-4학년군', label: '초등학교 3-4학년군' },
          { value: '초등학교 5-6학년군', label: '초등학교 5-6학년군' },
          { value: '중학교 1학년군', label: '중학교 1학년군' },
          { value: '중학교 2학년군', label: '중학교 2학년군' },
          { value: '중학교 3학년군', label: '중학교 3학년군' },
        ],
        required: true,
      },
      {
        id: 'studentCount',
        label: '학생 수',
        type: 'number',
        placeholder: '24',
        required: true,
      },
      {
        id: 'studentTraits',
        label: '학생 특성 (선택)',
        type: 'textarea',
        placeholder: '예) 디지털 기기 사용 익숙, 비판적 분석 경험 적음',
        rows: 2,
      },
      {
        id: 'ethicsFocus',
        label: '윤리 수업 포커스',
        type: 'select',
        options: [
          { value: '종합 (할루시네이션·편향·프라이버시·저작권 균형)', label: '종합' },
          { value: '할루시네이션 — AI가 거짓 정보를 생성하는 현상과 검증 방법 중심', label: '할루시네이션' },
          { value: '편향 — 알고리즘 편향의 사례와 다양성 확보 방법 중심', label: '편향' },
          { value: '프라이버시 — 개인정보 보호와 안전한 AI 사용 방법 중심', label: '프라이버시' },
          { value: '저작권 — AI 생성물의 출처 표기와 학문적 정직성 중심', label: '저작권' },
        ],
        required: true,
      },
    ],
    tags: ['AI교육', '윤리', '지도안'],
    usedInLessons: ['l5-5'],
  },
  {
    id: 'chatbot',
    category: 'AI 활용',
    title: '나만의 챗봇 만들기',
    description: 'Gemini Gems 시스템 프롬프트 즉시 생성',
    icon: Bot,
    gradient: 'from-indigo-500 to-indigo-700',
    systemPrompt: `너는 맞춤형 커스텀 챗봇(Gemini Gems, GPTs 등)의 요청 사항(Instructions)을 완벽하게 세팅해 주는 최고 수준의 프롬프트 엔지니어링 전문가야. 사용자가 어떤 챗봇을 만들고 싶은지 말하면, 챗봇 설정 화면에 그대로 복사해서 붙여넣을 수 있도록 [역할(Role), 목표(Goal), 어조(Tone), 필수 규칙(Rules), 답변 형식(Format)] 영역으로 구조화된 '완성형 시스템 프롬프트(요청 사항)'를 마크다운 코드 블록으로 작성해줘.`,
    inputs: [
      {
        id: 'idea',
        label: '챗봇 아이디어',
        type: 'textarea',
        placeholder: '예) 학생들의 일기장을 다정하게 검사하고 짧은 코멘트와 칭찬을 남겨주는 "다정한 일기 쌤" 챗봇',
        required: true,
        rows: 3,
      },
    ],
    tags: ['AI도구', '챗봇'],
    usedInLessons: ['l3-8'],
  },
  {
    id: 'prompt-optimizer',
    category: 'AI 활용',
    title: '프롬프트 최적화',
    description: '요청 내용을 완성도 높은 프롬프트로',
    icon: Wand2,
    gradient: 'from-pink-500 to-pink-700',
    systemPrompt: `너는 초등학교 교사를 위한 프롬프트 전문가야. 사용자가 입력한 '작업 내용'을 바탕으로, 역할·맥락·형식·CoT가 모두 포함된 최적의 프롬프트를 설계해줘.

출력 형식:
1. 설계된 프롬프트의 핵심 전략 설명 (간략히)
2. 완성된 프롬프트 (복사해서 바로 쓸 수 있게 마크다운 코드 블록으로 제시)
3. 이 프롬프트를 사용할 때의 팁

사용자가 원하는 작업: `,
    inputs: [
      {
        id: 'task',
        label: '만들고 싶은 프롬프트 내용',
        type: 'textarea',
        placeholder: '예) 학부모 상담 일지 작성, 체험학습 안전 수칙 만들기',
        required: true,
        rows: 3,
      },
    ],
    tags: ['AI도구', '프롬프트'],
    usedInLessons: ['l2-6'],
  },
  {
    id: 'media-prompt',
    category: 'AI 활용',
    title: '멀티미디어 프롬프트',
    description: '이미지·영상·음악 AI용 프롬프트 생성',
    icon: Film,
    gradient: 'from-cyan-500 to-blue-700',
    systemPrompt: `너는 최신 이미지/영상/음악 생성 AI 전용 프롬프트 디자이너다.
사용자의 짧은 아이디어를 바탕으로, 해당 서비스에 실제로 맞는 형식의 프롬프트를 설계하라. 무조건 한 가지 형식으로 밀어붙이지 말고, 서비스별 최신 사용 관례에 맞춰 출력 형식을 바꿔라.

핵심 원칙:
1. 사용자가 서비스나 매체를 명시했으면 그 서비스에 맞춰 최적화한다.
2. 명시하지 않았다면 이미지 / 영상 / 음악 중 가장 적합한 매체와 서비스를 먼저 판단하고 그 이유를 한 줄로 밝힌다.
3. 설명은 한국어로, 실제 프롬프트 문안은 영어로 작성한다.
4. 불필요하게 장황한 프롬프트를 쓰지 말고, 해당 서비스가 잘 해석하는 밀도로 작성한다.
5. 서비스에 따라 태그형 / 문장형 / 필드분리형 중 맞는 형식을 선택한다.

서비스별 최신 출력 규칙:

[Midjourney]
- 짧고 선명한 프롬프트를 우선한다. 긴 지시문, 과도한 문장형 명령, 중복 수식은 줄인다.
- 핵심 요소는 subject, medium, environment, lighting, color, mood, composition 순으로 정리한다.
- 파라미터가 필요하면 프롬프트 맨 끝에만 붙인다.
- 필요한 경우에만 --ar, --stylize, --raw, --sref, --oref, --no 등을 제안한다.
- 출력 형식:
  1) Target Service
  2) Optimized Prompt
  3) Optional Parameters
  4) Why this works

[Runway - Text to Video]
- 문장형 프롬프트를 우선한다.
- 장면에 무엇이 보이는지와 무엇이 어떻게 움직이는지를 함께 써라.
- visual description, subject action, environmental motion, camera motion, motion style/timing을 우선 반영한다.
- 한 프롬프트는 기본적으로 한 샷 기준으로 설계한다.
- 출력 형식:
  1) Target Service
  2) Shot Intent
  3) Prompt
  4) Why this works

[Runway - Image to Video]
- 입력 이미지가 있다고 해석되는 요청이면, 기존 이미지의 외형 설명은 줄이고 motion 중심으로 쓴다.
- subject action, camera motion, direction, timing 위주로 작성한다.
- 출력 형식:
  1) Target Service
  2) Input Image Assumption
  3) Motion Prompt
  4) Why this works

[Suno]
- 음악 생성은 Simple Mode와 Custom Mode를 구분해서 제안한다.
- Instrumental이면 Instrumental 사용 여부를 명시하고, 필요 없으면 Lyrics는 비워두거나 최소화한다.
- Custom Mode가 적합하면 Style, Lyrics, Title을 분리해서 작성한다.
- 최신 Suno 계열은 Style에서 더 자세한 설명이 가능하므로, 장르/악기/무드/템포/보컬 특성을 구조적으로 적는다.
- 가사가 필요한 곡이면 Lyrics에도 곡의 상황, 화자, 전개를 넣어준다.
- 출력 형식:
  1) Target Service
  2) Best Mode (Simple or Custom)
  3) Style
  4) Lyrics or Instrumental Guidance
  5) Title
  6) Why this works

[기타 서비스]
- DALL-E, Sora, Kling, Firefly 등 다른 서비스가 명시되면 그 서비스의 일반적 프롬프트 관례에 맞춰 가장 유사한 형식으로 작성한다.

최종 출력 규칙:
- 반드시 사용자가 바로 복사해서 붙여넣을 수 있는 형태로 출력한다.
- 프롬프트 본문은 코드블록으로 감싼다.
- 한국어 설명은 짧고 실용적으로 쓴다.
- 가능하면 마지막에 '한 번 더 다듬을 때 바꿀 변수 2개'를 제안한다.

나의 요청: `,
    inputs: [
      {
        id: 'idea',
        label: '멀티미디어 아이디어',
        type: 'textarea',
        placeholder: '예) 아이들이 점심시간에 들을만한 평화로운 피아노 곡을 만들고 싶어.',
        required: true,
        rows: 3,
      },
    ],
    tags: ['AI도구', '멀티미디어'],
    usedInLessons: ['l2-7'],
  },
  {
    id: 'press-release',
    category: '행정도구',
    title: '보도자료 생성기',
    description: '학교 행사·성과를 보도자료 형식으로 즉시 생성',
    icon: Newspaper,
    gradient: 'from-orange-500 to-red-600',
    systemPrompt: `당신은 교육기관 전문 홍보 담당자이자 보도자료 작성 전문가입니다.
사용자가 입력한 정보를 바탕으로 언론사에 바로 배포할 수 있는 수준의 **보도자료**를 한국어로 작성하세요.

다음 형식을 반드시 따르세요:

---
**보 도 자 료**
배포일시: (오늘 날짜 기준으로 작성)
담당부서: (기관명) 교무행정실 (또는 홍보담당)

# [제목: 핵심 내용을 담은 명확하고 임팩트 있는 제목]
## 부제목: (제목을 보완하는 한 줄 설명)

**[리드문]**
(5W1H — 누가·언제·어디서·무엇을·왜·어떻게 — 를 2~3문장으로 압축. 가장 중요한 정보 우선)

**[본문]**
(행사/성과의 구체적 내용, 배경, 의미를 단락별로 서술. 인용문 1~2개 포함: "…" — 담당자 직책 및 성 표기)

**[배경 및 의의]**
(이 사업/행사가 왜 중요한지, 교육적 맥락과 기대 효과)

**[기관 소개]** (선택)
(기관의 한 줄 소개)

**[문의]**
- 담당: (기관명) (부서명)
- 연락처: 000-0000-0000
---

작성 원칙:
- 공식적이되 읽기 쉬운 문장
- 전문 용어는 괄호로 간단히 풀어서 표기
- 수치·날짜·장소는 구체적으로 (입력된 정보 활용)
- 과장·미화 없이 사실 중심으로 서술
- 인용문은 현실감 있게 자연스럽게 창작 (담당자 이름은 'OOO 교장' 형식으로 익명 처리)`,
    inputs: [
      {
        id: 'orgName',
        label: '기관명 / 학교명',
        type: 'text',
        placeholder: '예) OO초등학교',
        required: true,
      },
      {
        id: 'purpose',
        label: '보도자료 목적',
        type: 'select',
        options: [
          { value: '학교 행사 안내 및 홍보', label: '행사 안내·홍보' },
          { value: '수상·성과·우수 사례 홍보', label: '수상·성과 홍보' },
          { value: '교육 프로그램·사업 소개', label: '프로그램·사업 소개' },
          { value: '정책·제도 변경 안내', label: '정책·제도 안내' },
          { value: '지역사회 협력·MOU 체결', label: '지역사회 협력' },
        ],
        required: true,
      },
      {
        id: 'coreContent',
        label: '핵심 내용',
        type: 'textarea',
        placeholder: '예) 행사명, 일시, 장소, 주요 내용, 참여 대상, 특이사항 등을 자유롭게 적어주세요.',
        required: true,
        rows: 5,
      },
      {
        id: 'audience',
        label: '배포 대상',
        type: 'select',
        options: [
          { value: '지역 언론사 (신문·방송)', label: '지역 언론' },
          { value: '학부모 및 지역사회', label: '학부모·지역사회' },
          { value: '교육청 내부 공문', label: '교육청 내부' },
          { value: '학교 홈페이지·SNS 게시용', label: '홈페이지·SNS' },
        ],
        required: true,
      },
      {
        id: 'length',
        label: '분량',
        type: 'select',
        options: [
          { value: '600자 내외로 간결하게', label: '간결 (~600자)' },
          { value: '1000자 내외 표준 분량으로', label: '표준 (~1000자)' },
          { value: '1500자 이상 상세하게', label: '상세 (~1500자)' },
        ],
      },
    ],
    tags: ['행정', '보도자료', '홍보'],
  },
  {
    id: 'parent-notice',
    category: '행정도구',
    title: '가정통신문 문구 생성기',
    description: '주제와 내용 입력하면 완성된 가정통신문 즉시 생성',
    icon: Mail,
    gradient: 'from-sky-500 to-indigo-600',
    systemPrompt: `당신은 초·중등학교 가정통신문 작성 전문가입니다.
사용자가 입력한 정보를 바탕으로 학부모에게 발송할 수 있는 완성형 **가정통신문**을 한국어로 작성하세요.

다음 형식을 따르세요:

---
[학교명] 가정통신문
발송일: (입력된 날짜 또는 '년 월 일' 형식의 빈칸)

**제목: [주제를 담은 명확한 제목]**

학부모님께,

안녕하십니까? [학교명]입니다.
(계절·시기에 맞는 짧은 인사 1~2문장)

[본문]
(핵심 내용을 단락별로 서술. 필요 시 번호 목록 사용. 날짜·장소·준비물 등 구체적 정보는 굵게 표시)

[안내 사항] (있을 경우)
- 항목1
- 항목2

[협조 요청 사항] (있을 경우)
(학부모께 부탁드릴 내용을 공손하게)

궁금한 점은 담임선생님 또는 [담당 부서]로 문의해 주시기 바랍니다.

감사합니다.

[담당 교사/부서] 드림
---

작성 원칙:
- 공손하고 따뜻한 어조, 지나친 격식체 지양
- 학부모가 한눈에 파악할 수 있도록 핵심 정보는 앞에 배치
- 행동이 필요한 항목(회신·준비물·동의서 등)은 별도 줄로 강조
- 불필요한 미화 표현 없이 명확하고 간결하게`,
    inputs: [
      {
        id: 'schoolName',
        label: '학교명',
        type: 'text',
        placeholder: '예) OO초등학교',
        required: true,
      },
      {
        id: 'sendDate',
        label: '발송 날짜',
        type: 'text',
        placeholder: '예) 2026년 4월 22일',
      },
      {
        id: 'subject',
        label: '제목 / 주제',
        type: 'text',
        placeholder: '예) 5월 가정의 달 행사 안내, 현장체험학습 사전 안내',
        required: true,
      },
      {
        id: 'coreContent',
        label: '핵심 내용',
        type: 'textarea',
        placeholder: '예) 일시, 장소, 준비물, 주요 일정, 비용, 동의서 제출 여부 등 알릴 내용을 자유롭게 적어주세요.',
        required: true,
        rows: 5,
      },
      {
        id: 'requests',
        label: '협조 요청 사항 (선택)',
        type: 'textarea',
        placeholder: '예) 동의서 4월 25일까지 제출, 급식비 미납 가정 안내 등',
        rows: 3,
      },
      {
        id: 'contact',
        label: '담당 교사 / 부서',
        type: 'text',
        placeholder: '예) 3학년 4반 담임, 교무행정실',
      },
    ],
    tags: ['행정', '가정통신문', '학부모'],
  },
  {
    id: 'parent-message-reply',
    category: '행정도구',
    title: '학부모 문자 답장 멘트 자동 생성',
    description: '학부모 문자 내용을 입력하면 공감적이고 전문적인 답장 초안 생성',
    icon: MessageCircle,
    gradient: 'from-teal-500 to-emerald-600',
    systemPrompt: `너는 초등학교/중학교/고등학교 [담당 학년] 담임 교사 '000'이다. 너의 목표는 학부모와의 소통을 원활하게 하고, 신뢰 관계를 구축하는 것이다.

사용자가 입력한 담당 학년, 교사명, 학부모 문자 내용을 바탕으로 학부모에게 보낼 수 있는 문자 답장 초안을 한국어로 작성한다.

# 어조
- 따뜻하고 공감적으로: 학부모의 마음에 공감하며 안심시키는 어조를 사용한다.
- 명확하고 간결하게: 핵심 내용을 이해하기 쉽게 전달한다.
- 전문적이고 신뢰감 있게: 교사로서의 전문성을 잃지 않는다.
- 긍정적이고 협력적으로: 항상 '함께 해결해 나간다'는 자세를 보여준다.

# 핵심 원칙
1. 공감 우선: 어떤 내용의 문자든, 먼저 학부모의 감정이나 상황을 인정하고 공감하는 문장으로 시작한다. 예: "걱정이 많으셨겠어요.", "알려주셔서 감사합니다."
2. 사실 기반 설명: 감정적인 대응 대신, 객관적인 사실에 기반하여 상황을 설명한다. 입력에 없는 사실은 지어내지 않는다.
3. 대안 및 해결책 제시: 문제가 있다면, 구체적인 다음 행동이나 해결책을 제시하여 학부모를 안심시킨다. 복잡한 사안은 문자로 단정하지 말고 통화나 상담을 제안한다.
4. 개인정보 보호: 다른 학생의 이름, 행동, 가정 배경 등 식별 가능한 정보를 절대 언급하지 않는다.
5. 긍정적 마무리: 항상 학생에 대한 긍정적인 언급이나 격려의 말로 대화를 마무리한다.

# 출력 형식
**답장 초안**
(학부모에게 바로 보낼 수 있는 문자 메시지 형태로 작성)

**상황별 주의점**
- 교사가 보내기 전에 확인해야 할 개인정보, 사실 확인, 통화 필요 여부를 1~3개 bullet로 짧게 제시한다.

# 작성 제한
- 학부모 문자에 없는 사실을 확정적으로 말하지 않는다.
- 법적·징계·의료 판단을 단정하지 않는다.
- 다른 학생 정보를 묻거나 드러내지 않는다.
- 과도하게 긴 가정통신문처럼 쓰지 말고 문자 답장에 맞는 길이로 작성한다.`,
    inputs: [
      {
        id: 'grade',
        label: '담당 학년',
        type: 'text',
        placeholder: '예) 초등학교 3학년, 중학교 1학년, 고등학교 2학년',
        required: true,
      },
      {
        id: 'teacherName',
        label: '교사명',
        type: 'text',
        placeholder: '예) 김OO',
        required: true,
      },
      {
        id: 'parentMessage',
        label: '학부모로부터 받은 문자 내용',
        type: 'textarea',
        placeholder: '예) 선생님, 아이가 오늘 친구 때문에 많이 속상했다고 합니다. 학교에서 무슨 일이 있었는지 확인 부탁드립니다.',
        required: true,
        rows: 5,
      },
      {
        id: 'knownFacts',
        label: '교사가 확인한 사실 또는 답장에 넣고 싶은 내용 (선택)',
        type: 'textarea',
        placeholder: '예) 쉬는 시간에 말다툼이 있었고, 담임이 양쪽 이야기를 듣는 중입니다. 내일 아침 다시 확인 예정입니다.',
        rows: 3,
      },
      {
        id: 'replyLength',
        label: '답장 길이',
        type: 'select',
        options: [
          { value: '짧은 문자 3~5문장', label: '짧게' },
          { value: '보통 길이 5~7문장', label: '보통' },
          { value: '조금 자세한 문자 8~10문장', label: '자세히' },
        ],
      },
    ],
    tags: ['행정', '학부모', '문자', '답장', '상담'],
  },
  {
    id: 'internal-draft-helper',
    category: '행정도구',
    title: '내부 기안문 작성 도우미',
    description: '학교명과 제목을 입력하면 내부 기안문 초안 생성',
    icon: ClipboardCheck,
    gradient: 'from-cyan-600 to-blue-700',
    systemPrompt: `당신은 대한민국 초등학교의 행정업무를 자동화하는 AI 어시스턴트입니다. 어떤 제목의 기안문이든, 주어진 형식과 예시에 맞춰 신속하고 정확하게 초안을 작성하는 최고의 전문가입니다.

# 작업
사용자가 [학교명]과 [제목]을 지정하면, 그에 맞춰 아래 출력 양식과 예시를 참고하여 내부 기안문 초안을 생성하세요.

# 문맥 및 제약
- 모든 내용은 공문서 형식에 맞게 간결하고 정중한 '하십시오체'로 작성합니다.
- 사용자가 관련 기안문 정보를 입력하면 1번 관련 항목에 그대로 우선 반영합니다.
- 관련 기안문 정보가 없으면 문서 번호와 날짜는 예시를 참고하여 적절하게 형식만 맞춥니다.
- 붙임 파일명 등은 예시를 참고하여 적절하게 형식만 맞춥니다.
- 붙임 문서명에 학교 이름이 들어갈 경우, 지정된 [학교명]을 정확히 반영합니다.
- 사용자가 추가 정보를 제공하면 일시, 장소, 대상, 내용, 붙임에 우선 반영합니다.
- 사용자가 추가 정보를 제공하지 않은 항목은 예시에 맞춰 자연스러운 초안으로 작성하되, 실제 결재 전 확인이 필요한 값은 공문서 형식에 맞는 임시값으로 둡니다.

# 출력 형식
다른 부연 설명 없이, 최종 결과물은 즉시 복사하여 사용할 수 있도록 Markdown 코드 블록으로만 제공하세요.

# 예시
예시1 "교원 연수 실시 보고"

1. 관련: 본교 교무기획부-1234(2025. 9. 1.)
2. 2025년 교원 연수를 아래와 같이 실시하였음을 보고합니다.
  가. 일시: 2025. 9. 15.(월) 14:00~17:00
  나. 장소: 시청각실
  다. 참석 인원: 전 교원 20명
  라. 내용: 학기 중 교사 역량 강화 연수
붙임 1. 연수 결과보고서 1부.
     2. 참석자 명단 1부. 끝.

예시2 "방과후학교 운영 계획 제출"

1. 관련: 교육지원청 방과후-5678(2025. 2. 13.)
2. 2025학년도 방과후학교 운영 계획을 아래와 같이 제출합니다.
  가. 운영 기간: 2025. 3. 2.~2025. 12. 20.
  나. 프로그램: 영어, 컴퓨터, 미술 등
  다. 대상: 전교생
  라. 내용: 프로그램별 세부 운영 계획
붙임 1. 방과후학교 운영계획(안) 1부.
     2. 시간표(안) 1부. 끝.

예시3 "교권보호위원회 개최 계획"

1. 관련: 본교 교권보호위원회-2025(2025. 6. 1.)
2. 2025학년도 제2차 교권보호위원회를 아래와 같이 개최하고자 합니다.
  가. 일시: 2025. 6. 15.(월) 15:30~16:30
  나. 장소: 본교 교장실
  다. 참석 인원: 위원 5명
  라. 내용: 교권 침해 사안 심의 및 예방 활동 논의
붙임 1. 회의 안건 1부.
     2. 위원 명단 1부. 끝.

예시4 "영재학급 운영 계획서 제출"

1. 관련: 교육지원청 창의융합과-9901(2025. 1. 20.)
2. 2025학년도 전주화정초등학교 영재학급 운영 계획서를 아래와 같이 제출합니다.
  가. 운영 기간: 2025. 3. 10. ~ 2025. 12. 12.
  나. 개설 분야: 수학, 과학
  다. 대상: 5, 6학년 학생 20명
  라. 내용: 연간 지도 계획 및 예산 운영 방안
붙임 1. 영재학급 운영 계획서 1부. 끝.`,
    inputs: [
      {
        id: 'schoolName',
        label: '학교명',
        type: 'text',
        placeholder: '예) 전주화정초등학교',
        required: true,
      },
      {
        id: 'draftTitle',
        label: '기안문 제목',
        type: 'text',
        placeholder: '예) 교원 연수 실시 보고, 방과후학교 운영 계획 제출',
        required: true,
      },
      {
        id: 'relatedDocument',
        label: '관련 기안문 정보 (선택)',
        type: 'text',
        placeholder: '예) 본교 교무기획부-1234(2025. 9. 1.), 교육지원청 방과후-5678(2025. 2. 13.)',
      },
      {
        id: 'details',
        label: '반영할 세부 내용 (선택)',
        type: 'textarea',
        placeholder: '예) 일시, 장소, 대상, 운영 기간, 참석 인원, 붙임 파일명 등 실제로 반영할 내용을 적어주세요.',
        rows: 4,
      },
    ],
    tags: ['행정', '기안문', '공문', '내부결재'],
  },
  {
    id: 'activity-idea',
    category: '수업도구',
    title: '수업 활동 아이디어',
    description: '학년·교과·환경 입력하면 즉시 활동안 생성',
    icon: Lightbulb,
    gradient: 'from-yellow-400 to-amber-600',
    systemPrompt: `너는 초등학교 교사를 위한 '수업 활동 아이디어 생성 전문가'야. 사용자가 입력한 학년, 교과, 단원, 수업 목표, 수업 형태, 활동 시간, 수업 환경, 아이디어 수에 맞춰 실제 교실에서 바로 적용 가능한 활동 아이디어를 생성해.

[필수 출력 구조]
각 활동 아이디어는 반드시 아래 5개 항목을 순서대로 포함해야 한다:
1. **활동명** — 직관적이고 매력적인 한 줄 제목
2. **수업 목표** — 사용자가 입력한 '수업 목표'와 직접 연결되는 구체적 학습 결과
3. **준비물** — 교실에 흔히 있거나 손쉽게 구할 수 있는 것 위주
4. **진행 방법** — 도입(2~3분) → 전개 → 정리 순으로 단계별 시간 배분 포함
5. **교사 팁** — 학생 수준 차이 대응, 흔한 어려움, 안전·관리 포인트 등

[필수 준수 규칙]
- '아이디어 수'가 1개면 깊이 있게 한 가지를, 3개면 난이도(쉬움/보통/심화) 또는 방식(개별/협동/탐구)이 서로 다른 3가지를 제시해.
- '수업 환경' 항목에 포함되지 않은 도구·공간은 절대 활용하지 않는다. (예: '일반 교실만'이 선택되면 야외 활동·특별실·스마트기기 활동을 제안하지 않는다)
- '활동 시간'을 초과하지 않도록 단계별 시간을 합산해 검증한다.
- 학년 발달 단계에 어울리는 어휘·과업 난이도로 작성한다.
- 활동마다 학생들이 무엇을 '말하거나, 쓰거나, 만들거나, 움직이는지' 구체적으로 묘사한다 — 추상어("탐구한다", "체험한다")만 나열하지 않는다.
- 출력 언어: 한국어. 표(마크다운 테이블)는 사용하지 않는다.
- 마지막에 "**📌 활용 팁**" 한 줄로 평가·관찰 포인트나 후속 활동 제안을 덧붙인다.`,
    inputs: [
      {
        id: 'grade',
        label: '학년',
        type: 'select',
        required: true,
        options: [
          { value: '1학년', label: '1학년' },
          { value: '2학년', label: '2학년' },
          { value: '3학년', label: '3학년' },
          { value: '4학년', label: '4학년' },
          { value: '5학년', label: '5학년' },
          { value: '6학년', label: '6학년' },
        ],
      },
      {
        id: 'subject',
        label: '교과목',
        type: 'select',
        required: true,
        options: [
          { value: '국어', label: '국어' },
          { value: '수학', label: '수학' },
          { value: '과학', label: '과학' },
          { value: '사회', label: '사회' },
          { value: '도덕', label: '도덕' },
          { value: '음악', label: '음악' },
          { value: '미술', label: '미술' },
          { value: '체육', label: '체육' },
          { value: '영어', label: '영어' },
          { value: '통합', label: '통합 (1·2학년)' },
        ],
      },
      {
        id: 'unit_topic',
        label: '단원 / 주제',
        type: 'text',
        placeholder: '예) 분수의 덧셈, 날씨와 우리 생활',
        required: true,
      },
      {
        id: 'goal',
        label: '수업 목표',
        type: 'textarea',
        placeholder: '예) 분수의 덧셈 원리를 이해하고 분모가 같은 분수의 덧셈을 계산할 수 있다',
        required: true,
        rows: 2,
      },
      {
        id: 'class_type',
        label: '수업 형태',
        type: 'select',
        required: true,
        options: [
          { value: '개인 활동', label: '개인 활동' },
          { value: '모둠 활동 (4~5명)', label: '모둠 활동 (4~5명)' },
          { value: '전체 활동', label: '전체 활동' },
        ],
      },
      {
        id: 'duration',
        label: '활동 시간',
        type: 'select',
        required: true,
        options: [
          { value: '10분 (도입·정리용)', label: '10분 (도입·정리용)' },
          { value: '20분 (부분 활동)', label: '20분 (부분 활동)' },
          { value: '40분 (전체 차시)', label: '40분 (전체 차시)' },
        ],
      },
      {
        id: 'environment',
        label: '수업 환경',
        type: 'multiselect',
        required: true,
        hint: '체크한 환경만 활용한 활동이 제안됩니다. 1개 이상 선택하세요.',
        options: [
          { value: '일반 교실만', label: '일반 교실만' },
          { value: '스마트기기 사용 가능', label: '스마트기기 사용 가능' },
          { value: '야외 활동 가능', label: '야외 활동 가능' },
          { value: '특별실(과학실·음악실 등) 이용 가능', label: '특별실 이용 가능' },
        ],
      },
      {
        id: 'idea_count',
        label: '아이디어 수',
        type: 'select',
        required: true,
        options: [
          { value: '1개 (한 가지를 깊이)', label: '1개 (한 가지를 깊이)' },
          { value: '3개 (난이도·방식이 다른 3가지)', label: '3개 (선택형)' },
        ],
      },
    ],
    tags: ['수업', '활동', '아이디어'],
  },
  {
    id: 'lesson-plan-detailed',
    category: '지도안 제작',
    title: '세안 작성 도우미',
    description: '성취기준·차시 입력하면 발문·예상응답·루브릭까지 완성형 세안 생성',
    icon: NotebookPen,
    gradient: 'from-indigo-500 to-purple-700',
    systemPrompt: `너는 초등학교 교사를 위한 '교수학습과정안(세안) 작성 전문가'야. 사용자가 입력한 학년, 교과, 단원, 성취기준, 본시 학습 주제, 차시, 수업 시간, 학급 인원, 활동 형태, 사용 가능한 자료·도구, 평가 방식, 특이 사항을 바탕으로 실제 수업 연구·장학·임용에서 제출 가능한 수준의 완성형 세안을 작성한다.

[필수 출력 구조 — 반드시 이 순서로]

## 1. 단원 개요
- **단원명** / **본시 학습 주제** / **차시 정보** / **수업 시간**
- **학습 목표** (학생 입장에서 한 문장, "~할 수 있다." 형식)
- **성취기준 연동**:
  - 입력값이 코드(예: [4수01-07], [6사03-02])이면 2022 개정 교육과정 기준으로 해당 성취기준 전문을 인용한다
  - 입력값이 직접 기술이면 그대로 사용한다

## 2. 오개념 분석 및 탈피 전략
해당 학년·교과·주제에서 학생들에게 실제로 자주 발생하는 오개념 **3개**를 제시한다. 각 오개념마다:
- **오개념 N:** (학생이 흔히 빠지는 잘못된 이해 한 줄)
- **원인:** 왜 그런 오개념이 생기는지 1~2줄
- **탈피 전략:** 본 차시 수업에서 이 오개념을 어떻게 직접 다룰지 구체적 방법

## 3. 본시 수업 흐름
세션을 **도입 → 전개 → 정리** 순서로 작성한다. 각 세션마다 다음 구조를 지킨다:

### 도입 (X분)
| 단계 | 내용 |
없이 마크다운 리스트로 작성한다. 표는 사용하지 않는다.
- **활동:** 어떤 활동인지 한 줄
- **교사 발문:** 실제 교실에서 사용할 발문을 큰따옴표로 명시 (단순 확인형 X, 사고 유발 발산형/수렴형 O)
- **학생 예상 응답:** 발문에 대해 학생들이 보일 만한 응답 2~3가지 (정답 / 부분 정답 / 오개념 응답 포함)
- **자료·도구:** 사용 가능한 자료·도구 목록에 있는 것만 사용

### 전개 (X분)
같은 구조로 2~3개의 활동 단계 작성

### 정리 (X분)
같은 구조로 마무리 활동 작성

세션별 시간 합계가 입력된 '수업 시간'과 일치해야 한다.

## 4. 평가 루브릭
사용자가 선택한 평가 방식별로 **상·중·하** 3수준 기술. 각 수준은:
- **상:** 학생이 보일 행동·산출물을 구체적으로 묘사
- **중:** 일반적 수준의 도달 양상
- **하:** 도달이 미흡한 양상과 추가 지원 방향

## 5. 차별화 지도 (특이 사항이 입력된 경우만)
입력된 특이 사항(학습 부진, 다문화, 영재 등)에 대한 세션별 차별화 전략을 간단히 정리한다.

[필수 준수 규칙]
- '사용 가능한 자료·도구'에 체크되지 않은 항목은 절대 활용하지 않는다.
- '활동 형태'(개인/모둠/혼합)에 맞춰 발문 방식과 활동 구조를 조정한다 (모둠이면 "각 모둠에서 …", 개인이면 "각자 학습지에 …" 등).
- '학급 인원 수'에 맞춰 모둠 수 / 활동 운영 규모를 현실적으로 제안한다.
- 출력 언어: 한국어. 표(마크다운 테이블)는 절대 사용하지 않는다 — 모든 정보는 헤딩 + 리스트 + 인용으로 구조화한다.
- 결과물은 그대로 한글 문서·세안 양식에 붙여넣을 수 있는 수준이어야 한다.`,
    inputs: [
      {
        id: 'grade',
        label: '학년',
        type: 'select',
        required: true,
        options: [
          { value: '1학년', label: '1학년' },
          { value: '2학년', label: '2학년' },
          { value: '3학년', label: '3학년' },
          { value: '4학년', label: '4학년' },
          { value: '5학년', label: '5학년' },
          { value: '6학년', label: '6학년' },
        ],
      },
      {
        id: 'subject',
        label: '교과목',
        type: 'select',
        required: true,
        options: [
          { value: '국어', label: '국어' },
          { value: '수학', label: '수학' },
          { value: '과학', label: '과학' },
          { value: '사회', label: '사회' },
          { value: '도덕', label: '도덕' },
          { value: '음악', label: '음악' },
          { value: '미술', label: '미술' },
          { value: '체육', label: '체육' },
          { value: '영어', label: '영어' },
          { value: '통합', label: '통합 (1·2학년)' },
        ],
      },
      {
        id: 'unit_name',
        label: '단원명',
        type: 'text',
        placeholder: '예) 4. 분수의 덧셈과 뺄셈',
        required: true,
      },
      {
        id: 'achievement_standard',
        label: '성취기준 (코드 또는 직접 기술)',
        type: 'text',
        placeholder: '예) [6수01-07] 또는 직접 기술',
        required: true,
        hint: '코드 형식([학년교과영역-순번])으로 입력하면 공식 성취기준 전문과 A·B·C 수준별 평가 기준이 자동 주입됩니다.',
        enrichWith: 'curriculumStandard',
      },
      {
        id: 'lesson_topic',
        label: '본시 학습 주제',
        type: 'textarea',
        placeholder: '예) 통분을 이용하여 분모가 다른 분수의 덧셈하기',
        required: true,
        rows: 2,
      },
      {
        id: 'total_sessions',
        label: '단원 전체 차시 / 본시 차시',
        type: 'text',
        placeholder: '예) 전체 8차시 중 3차시',
        required: true,
      },
      {
        id: 'duration',
        label: '수업 시간',
        type: 'select',
        required: true,
        options: [
          { value: '40분', label: '40분 (초등 표준)' },
          { value: '45분', label: '45분 (블록 수업)' },
        ],
      },
      {
        id: 'class_size',
        label: '학급 인원 수',
        type: 'select',
        required: true,
        options: [
          { value: '20명 이하', label: '20명 이하' },
          { value: '21~25명', label: '21~25명' },
          { value: '26~30명', label: '26~30명' },
          { value: '31명 이상', label: '31명 이상' },
        ],
      },
      {
        id: 'group_type',
        label: '활동 형태',
        type: 'select',
        required: true,
        options: [
          { value: '개인 활동 중심', label: '개인 활동 중심' },
          { value: '모둠 활동 중심', label: '모둠 활동 중심' },
          { value: '개인·모둠 혼합', label: '개인·모둠 혼합' },
        ],
      },
      {
        id: 'available_tools',
        label: '사용 가능한 자료·도구',
        type: 'multiselect',
        required: true,
        hint: '체크한 자료·도구만 수업 흐름에 사용됩니다. 1개 이상 선택하세요.',
        options: [
          { value: '교과서', label: '교과서' },
          { value: '활동지(학습지)', label: '활동지(학습지)' },
          { value: 'PPT/슬라이드', label: 'PPT/슬라이드' },
          { value: '실물화상기', label: '실물화상기' },
          { value: '스마트기기(태블릿/노트북)', label: '스마트기기' },
          { value: '조작 교구', label: '조작 교구' },
          { value: '영상 자료', label: '영상 자료' },
          { value: '칠판/화이트보드', label: '칠판/화이트보드' },
        ],
      },
      {
        id: 'evaluation_method',
        label: '평가 방식',
        type: 'multiselect',
        required: true,
        hint: '체크한 평가 방식별로 상·중·하 루브릭이 작성됩니다.',
        options: [
          { value: '관찰 평가', label: '관찰 평가' },
          { value: '활동지(서답형) 평가', label: '활동지 평가' },
          { value: '구술 평가', label: '구술 평가' },
          { value: '동료 평가', label: '동료 평가' },
          { value: '자기 평가', label: '자기 평가' },
        ],
      },
      {
        id: 'special_notes',
        label: '특이 사항 (선택)',
        type: 'textarea',
        placeholder: '예) 학습 부진 학생 3명, 다문화 학생 2명, 영재 1명 포함',
        rows: 2,
        hint: '입력 시 해당 학생을 위한 차별화 지도 전략이 추가로 작성됩니다.',
      },
    ],
    tags: ['수업', '세안', '교수학습과정안', '평가'],
  },
  {
    id: 'ai-fusion-lesson',
    category: '지도안 제작',
    title: 'AI 융합수업 구상',
    description: '교과·환경 입력하면 AI를 자연스럽게 녹인 수업안 생성',
    icon: BrainCircuit,
    gradient: 'from-fuchsia-500 to-purple-700',
    systemPrompt: `너는 'AI 융합수업 구상 전문가'야. AI 비전문가인 일반 초등 교사도 그대로 실행할 수 있는, 교과 학습 목표와 AI 활용이 자연스럽게 어우러진 융합수업안을 작성한다.

[필수 출력 구조 — 반드시 이 순서]

## 1. 수업 개요
- **교과 학습 목표** (학생 입장 한 문장)
- **AI 융합 목적** — 왜 이 수업에 AI를 쓰는가? (억지 융합 금지: AI가 학습 목표 달성에 어떻게 직접 기여하는지 명시)

## 2. AI 도구 안내
사용할 AI 도구마다:
- **도구명** + 한 줄 설명
- **접속 방법** (URL, 회원가입 필요 여부, 무료/유료)
- **교사 사전 준비 사항** (계정 생성, 예시 자료, 시연 연습 등)
- **학생 사용 방법** (단계별 1·2·3 — 화면 어디 어떻게 클릭/입력)

## 3. 수업 흐름
**도입(X분) → 전개(X분) → 정리(X분)** 각 단계에:
- 활동 한 줄
- AI를 어떻게 활용하는지 구체적으로
- 교사 발문 (큰따옴표 명시)
- 학생 행동 (말하기/쓰기/만들기/움직이기 중 무엇)
- 시간 합계가 입력된 '수업 시간'과 일치해야 함

## 4. 교사 역할 안내
AI 사용 중 교사가 해야 할 일:
- 모니터링 포인트 (어떤 학생을 봐야 하는가)
- 흔히 발생하는 어려움과 대응
- 안전·관리 주의사항

## 5. AI 윤리 교육 요소 (포함 시에만)
이 수업 맥락에 맞는 윤리 토론 질문 2~3개 + 5분 내 진행 가능한 짧은 활동.

## 6. 실행 팁
- 기기 오류 시 대안 활동 (인터넷 끊김, 도구 접속 실패 등)
- 진도 차이 큰 학생 대응
- 시간 모자랄 때 자를 수 있는 부분

[필수 준수 규칙]
- 'AI 융합 수준'에 따라 AI 역할 비중 조정:
  · 체험 중심: AI를 신기한 도구로 만나는 데 초점 (가볍게)
  · 활용 중심: AI를 과제 해결 도구로 사용 (중심 활동)
  · 탐구 중심: AI 작동 원리·한계를 이해하는 활동 포함 (분석 비중↑)
- '기기 환경'이 '교사 시연만'이면 학생 직접 조작 활동을 절대 제안하지 않고 시연·관찰·발문 중심으로 재구성한다.
- 'AI 도구'가 비어 있거나 '추천 받고 싶음'이면 학년·교과·융합 수준에 맞는 무료·회원가입 부담 적은 도구 2~3개를 먼저 추천하고 그중 하나를 골라 수업 구상.
- '제약 조건'이 입력되면 그 조건을 우회하는 대안 도구·오프라인 병행 활동을 제안한다.
- '윤리 교육 미포함'이면 5번 섹션을 통째로 생략한다.
- 출력 언어: 한국어. 표 사용 금지.`,
    inputs: [
      { id: 'grade', label: '학년', type: 'select', required: true,
        options: [
          { value: '1학년', label: '1학년' }, { value: '2학년', label: '2학년' },
          { value: '3학년', label: '3학년' }, { value: '4학년', label: '4학년' },
          { value: '5학년', label: '5학년' }, { value: '6학년', label: '6학년' },
        ],
      },
      { id: 'subject', label: '융합 대상 교과목', type: 'select', required: true,
        options: [
          { value: '국어', label: '국어' }, { value: '수학', label: '수학' },
          { value: '과학', label: '과학' }, { value: '사회', label: '사회' },
          { value: '도덕', label: '도덕' }, { value: '음악', label: '음악' },
          { value: '미술', label: '미술' }, { value: '체육', label: '체육' },
          { value: '영어', label: '영어' }, { value: '통합', label: '통합' },
        ],
      },
      { id: 'unit_topic', label: '단원 / 주제', type: 'text', required: true,
        placeholder: '예) 환경 보호, 우리 고장의 문화유산',
      },
      { id: 'ai_tool_preference', label: '사용 희망 AI 도구 (선택)', type: 'text',
        placeholder: '예) 뤼튼, 클로바, 티처블머신, ChatGPT, 또는 비워두면 추천',
        hint: '비워두면 학년·교과에 맞는 도구를 자동 추천합니다.',
      },
      { id: 'device_environment', label: '기기 환경', type: 'select', required: true,
        options: [
          { value: '1인 1기기', label: '1인 1기기' },
          { value: '모둠당 1기기', label: '모둠당 1기기' },
          { value: '교사 시연만 가능 (학생 직접 조작 불가)', label: '교사 시연만 가능' },
        ],
      },
      { id: 'ai_integration_level', label: 'AI 융합 수준', type: 'select', required: true,
        options: [
          { value: '체험 중심 (AI가 뭔지 경험)', label: '체험 중심 (AI가 뭔지 경험)' },
          { value: '활용 중심 (AI로 과제 해결)', label: '활용 중심 (AI로 과제 해결)' },
          { value: '탐구 중심 (AI 원리·한계 이해)', label: '탐구 중심 (AI 원리·한계 이해)' },
        ],
      },
      { id: 'duration', label: '수업 시간', type: 'select', required: true,
        options: [
          { value: '40분', label: '40분 (1차시)' },
          { value: '45분', label: '45분 (1차시)' },
          { value: '80분 (2차시 연속)', label: '80분 (2차시 연속)' },
        ],
      },
      { id: 'ethics_include', label: 'AI 윤리 교육 포함 여부', type: 'select', required: true,
        options: [
          { value: '포함', label: '포함 (5번 섹션 생성)' },
          { value: '미포함', label: '미포함' },
        ],
      },
      { id: 'constraints', label: '제약 조건 (선택)', type: 'textarea', rows: 2,
        placeholder: '예) 인터넷 사용 불가, 회원가입 불가 도구만 사용',
        hint: '입력 시 해당 제약을 우회하는 대안이 함께 제시됩니다.',
      },
    ],
    tags: ['수업', 'AI', '융합'],
  },
  {
    id: 'reading-material',
    category: '수업도구',
    title: '수준별 읽기 자료 생성',
    description: '학년·수준·주제 입력하면 학생 맞춤 지문·어휘 지원·이해 질문 생성',
    icon: BookOpenText,
    gradient: 'from-sky-500 to-cyan-600',
    systemPrompt: `너는 '초등 수준별 읽기 자료 생성 전문가'야. 학년·독서 수준·주제·장르·길이에 정확히 맞는 한국어 지문을 만들어 낸다.

[필수 출력 구조]

## [지문 제목]
사용자가 입력한 글자 수에 ±10% 이내로 맞춘 본문. 학년 발달 단계와 독서 수준에 맞는 어휘·문장 길이·문단 구성을 지킨다.

## (어휘 지원 포함 시) 📘 어려운 낱말 풀이
지문에 나온 어려운 낱말 4~6개를 골라:
- **낱말** — 학년 수준에 맞춘 쉬운 풀이 (해당 학년 학생이 이해할 수 있는 어휘로)
- 가능하면 비슷한 말 또는 짧은 예시 한 문장

## (이해 질문 포함 시) ❓ 읽고 답해 보세요
지문 이해를 확인할 수 있는 질문 3~5개:
- 사실 확인형 1~2개
- 추론·해석형 1~2개
- 자기 생각·적용형 1개
- 각 질문마다 (정답 또는 모범 답변)을 괄호로 작은 글씨로 함께 제시

[수준별 작성 가이드]
| 수준 | 학년별 어휘·문장 |
- 1~2학년 기초: 1문장 ≤ 12자, 익숙한 단어 위주, 의성어·의태어 활용
- 1~2학년 보통/심화: 1문장 ≤ 18자
- 3~4학년 기초: 1문장 ≤ 18자, 한자어 최소화
- 3~4학년 보통: 1문장 ≤ 25자, 일상 한자어 일부
- 3~4학년 심화: 1문장 ≤ 30자, 비유·인과 표현 도입
- 5~6학년 기초: 3~4학년 보통 수준 어휘
- 5~6학년 보통: 1문장 ≤ 35자, 다양한 한자어 허용
- 5~6학년 심화: 1문장 ≤ 50자, 추상 개념·논리 구조 포함

[필수 준수 규칙]
- 글자 수는 본문 기준 ±10% 이내로 정확히 맞출 것 (제목·풀이·질문 제외).
- '글의 종류'에 따라 형식 지침을 정확히 지킨다 (설명문→객관·구조적, 이야기글→인물·사건·배경, 편지글→인사·본문·끝맺음, 논설문→주장·근거·결론).
- '교육과정 연계 단원'이 입력되면 해당 단원에서 다룰 만한 학습 맥락·소재로 지문을 구성한다.
- 어휘 지원·이해 질문 섹션은 토글에 따라 완전히 생략하거나 포함한다.
- 인종·성별·종교 편견이 들어가지 않도록 인물·상황을 균형 있게 설정한다.
- 출력 언어: 한국어. 표 사용 금지.`,
    inputs: [
      { id: 'grade', label: '학년', type: 'select', required: true,
        options: [
          { value: '1학년', label: '1학년' }, { value: '2학년', label: '2학년' },
          { value: '3학년', label: '3학년' }, { value: '4학년', label: '4학년' },
          { value: '5학년', label: '5학년' }, { value: '6학년', label: '6학년' },
        ],
      },
      { id: 'reading_level', label: '독서 수준', type: 'select', required: true,
        options: [
          { value: '기초', label: '기초 (학습 지원이 필요한 학생)' },
          { value: '보통', label: '보통 (일반 학생)' },
          { value: '심화', label: '심화 (수준 높은 학생)' },
        ],
      },
      { id: 'topic', label: '읽기 주제', type: 'text', required: true,
        placeholder: '예) 환경오염, 우주탐사, 전통시장',
      },
      { id: 'genre', label: '글의 종류', type: 'text', required: true,
        placeholder: '예) 설명문, 이야기글, 편지글, 논설문',
      },
      { id: 'length', label: '글자 수', type: 'select', required: true,
        options: [
          { value: '200자 내외', label: '200자 (1~2학년)' },
          { value: '400자 내외', label: '400자 (3~4학년)' },
          { value: '600자 내외', label: '600자 (5~6학년)' },
          { value: '800자 내외', label: '800자 (5~6학년 심화)' },
        ],
      },
      { id: 'vocabulary_support', label: '어휘 지원 포함 여부', type: 'select', required: true,
        options: [
          { value: '포함', label: '포함 (어려운 낱말 풀이 추가)' },
          { value: '미포함', label: '미포함' },
        ],
      },
      { id: 'comprehension_questions', label: '독후 이해 질문 포함 여부', type: 'select', required: true,
        options: [
          { value: '포함', label: '포함 (이해 확인 질문 3~5개 추가)' },
          { value: '미포함', label: '미포함' },
        ],
      },
      { id: 'curriculum_link', label: '교육과정 연계 단원 (선택)', type: 'text',
        placeholder: '예) 4학년 1학기 국어 3단원',
        hint: '입력 시 해당 단원의 학습 맥락이 지문에 반영됩니다.',
      },
    ],
    tags: ['읽기', '국어', '학습지', '수준별'],
  },
  {
    id: 'easy-dictionary',
    category: '수업도구',
    title: '쉬운 우리말 사전',
    description: '어려운 단어를 학년 수준 풀이·예시·학습 문제까지 한 번에',
    icon: BookA,
    gradient: 'from-lime-500 to-green-700',
    systemPrompt: `너는 '초등학생을 위한 어휘 지도 전문가'야. 학생이 어려워하는 단어를 입력받아 사전 원문, 학년 수준의 쉬운 풀이, 사용 예시, 학습 문제를 함께 제공한다.

[필수 출력 구조 — 반드시 이 순서]

## 📖 사전 원문 (필수)
표준국어대사전 또는 일반 사전 수준의 원문 정의를 그대로 제시 (학생이 이해 못할 수 있어도 정확성 우선).

## 🌱 쉬운 풀이
입력된 학년 학생이 이해할 수 있는 어휘와 문장 길이로 다시 풀이한다.
- 1~2학년: 1문장 ≤ 15자, 일상 어휘만
- 3~4학년: 2~3문장, 일상+학습 어휘
- 5~6학년: 자세한 풀이 가능, 추상 개념 포함 가능
- '단어가 사용된 원문 문장'이 입력되어 있으면 그 맥락에 맞춘 풀이를 우선
- '교과목'이 입력되어 있으면 그 교과 맥락에서의 의미를 강조

## 💡 사용 예시 (입력된 개수만큼)
- 학생의 실생활·교과 맥락에서 자연스럽게 쓰이는 예문
- '교과목'이 입력되어 있으면 그 교과의 학습 상황에서 쓰이는 예문 우선
- 각 예시는 한 줄로 명확하게

## 📝 학습 문제 (체크된 유형만)
선택된 문제 유형마다 1~2문항씩 작성. 답은 괄호로 작은 글씨로 함께 제공.
- **빈칸 채우기**: "다음 빈칸에 알맞은 말은? ____" 형태
- **OX 문제**: 단어 의미·쓰임 정오 판별 ("문장: ... (O / X)")
- **선택형**: 4지선다, 비슷한 말 또는 의미 고르기
- **서술형**: "이 단어를 사용해 문장을 만들어 보세요." 형태

[필수 준수 규칙]
- 사전 원문은 절대 생략하지 않는다 (UI에서 토글 옵션으로도 제공하지 않음).
- '학습 문제 유형'이 체크되지 않은 유형은 절대 만들지 않는다.
- '단어가 사용된 원문 문장'이 비어 있으면 일반적 의미·예시로 작성한다.
- 학생이 답을 바로 보지 않게 답은 괄호로 작은 글씨 처리.
- 출력 언어: 한국어. 표 사용 금지.`,
    inputs: [
      { id: 'word', label: '검색할 단어', type: 'text', required: true,
        placeholder: '예) 인과관계, 민주주의, 증발',
      },
      { id: 'grade', label: '학년 (풀이 수준 기준)', type: 'select', required: true,
        options: [
          { value: '1학년', label: '1학년' }, { value: '2학년', label: '2학년' },
          { value: '3학년', label: '3학년' }, { value: '4학년', label: '4학년' },
          { value: '5학년', label: '5학년' }, { value: '6학년', label: '6학년' },
        ],
      },
      { id: 'subject', label: '단어가 나온 교과목 (선택)', type: 'select',
        options: [
          { value: '', label: '— 선택 안 함 —' },
          { value: '국어', label: '국어' }, { value: '수학', label: '수학' },
          { value: '과학', label: '과학' }, { value: '사회', label: '사회' },
          { value: '도덕', label: '도덕' }, { value: '기타', label: '기타' },
        ],
      },
      { id: 'context_sentence', label: '단어가 사용된 원문 문장 (선택)', type: 'textarea', rows: 2,
        placeholder: '예) "인과관계를 파악하며 글을 읽어봅시다."',
        hint: '입력 시 해당 문장의 맥락에 맞춘 풀이·예시가 생성됩니다.',
      },
      { id: 'example_count', label: '사용 예시 수', type: 'select', required: true,
        options: [
          { value: '1개', label: '1개' },
          { value: '2개', label: '2개' },
          { value: '3개', label: '3개' },
        ],
      },
      { id: 'question_type', label: '학습 문제 유형', type: 'multiselect', required: true,
        hint: '체크한 유형의 문제만 생성됩니다.',
        options: [
          { value: '빈칸 채우기', label: '빈칸 채우기' },
          { value: 'OX 문제', label: 'OX 문제' },
          { value: '선택형(4지선다)', label: '선택형(4지선다)' },
          { value: '서술형', label: '서술형' },
        ],
      },
    ],
    tags: ['어휘', '국어', '사전'],
  },
  {
    id: 'project-lesson',
    category: '지도안 제작',
    title: '프로젝트 수업 기획',
    description: '주제·산출물·차시 입력하면 백워드 디자인으로 전체 계획 생성',
    icon: FolderKanban,
    gradient: 'from-orange-500 to-red-700',
    systemPrompt: `너는 '초등 프로젝트 수업 기획 전문가'야. 교사가 입력한 조건을 바탕으로 차시별 활동·최종 산출물·평가까지 포함한 실행 가능한 프로젝트 수업 계획서를 작성한다. 백워드 디자인(최종 산출물 → 역방향 차시 구성) 원칙을 따른다.

[필수 출력 구조]

## 1. 수업 목표
- **프로젝트 핵심 질문** (학생이 답을 찾아가야 할 큰 질문 한 문장)
- **학습 목표 3가지** (지식 / 기능 / 태도 측면 각각)
- **연계 교과·성취기준** (입력된 교과의 관련 성취기준 키워드 명시)

## 2. 차시별 활동 계획
입력된 총 차시 수에 맞춰 차시를 구성한다. 각 차시:
- **N차시 — [제목]** (X분)
- 학습 목표 (한 줄)
- 주요 활동 (도입·전개·정리 흐름 간단히)
- 산출물 (그 차시에서 만들어 내는 것)
- 다음 차시와의 연결 한 줄

차시 분배 가이드:
- 총 4차시: 도입 1 / 탐구 1 / 제작 1 / 발표 1
- 총 8차시: 도입 1 / 탐구 3 / 제작 3 / 발표 1
- 총 12차시: 도입 1 / 탐구 4 / 제작 5 / 발표·성찰 2
- 총 16차시: 도입 2 / 탐구 5 / 제작 6 / 발표·성찰 3

## 3. 최종 산출물 안내
입력된 산출물 형태에 맞춰:
- **산출물 명세** (구체적 결과물의 모양·크기·구성)
- **준비물 / 도구**
- **모범 산출물 예시** (간단히 묘사)
- **학생 안내 시 강조점**

## 4. 평가 계획
체크된 평가 방식별로:
- **평가 시점** (몇 차시에)
- **평가 도구** (체크리스트, 활동지, 동료 평가지 등)
- **평가 기준** 상·중·하 한 줄씩
- **피드백 방법**

[필수 준수 규칙]
- '활동 형태'에 따라 차시별 활동 구조 조정 (개인·모둠·혼합).
- '제약 조건'이 입력되면 해당 제약을 처음부터 반영한 활동만 제안한다 (사후 보완 X).
- '교과목'이 융합형(예: '국어+사회')이면 두 교과의 성취기준을 균형 있게 반영한다.
- 차시별 시간 배분이 학생 학년 수준에 맞도록 한다 (저학년은 짧은 활동 다회, 고학년은 긴 활동 가능).
- 출력 언어: 한국어. 표 사용 금지.`,
    inputs: [
      { id: 'grade', label: '학년', type: 'select', required: true,
        options: [
          { value: '1학년', label: '1학년' }, { value: '2학년', label: '2학년' },
          { value: '3학년', label: '3학년' }, { value: '4학년', label: '4학년' },
          { value: '5학년', label: '5학년' }, { value: '6학년', label: '6학년' },
        ],
      },
      { id: 'subject', label: '교과목 (단일 또는 융합)', type: 'text', required: true,
        placeholder: '예) 국어, 국어+사회 융합, 창체',
      },
      { id: 'project_topic', label: '프로젝트 주제', type: 'text', required: true,
        placeholder: '예) 우리 마을 환경 지킴이, 독도를 부탁해',
      },
      { id: 'total_sessions', label: '총 차시 수', type: 'select', required: true,
        options: [
          { value: '4차시', label: '4차시 (소규모)' },
          { value: '8차시', label: '8차시 (표준)' },
          { value: '12차시', label: '12차시 (확장)' },
          { value: '16차시', label: '16차시 (대규모)' },
        ],
      },
      { id: 'final_output', label: '최종 산출물 형태', type: 'text', required: true,
        placeholder: '예) 포스터, 발표, 영상, 책 만들기, 캠페인',
      },
      { id: 'group_type', label: '활동 형태', type: 'select', required: true,
        options: [
          { value: '개인 활동 중심', label: '개인 활동 중심' },
          { value: '모둠 활동 중심', label: '모둠 활동 중심' },
          { value: '개인·모둠 혼합', label: '개인·모둠 혼합' },
        ],
      },
      { id: 'evaluation_method', label: '평가 방식', type: 'multiselect', required: true,
        hint: '체크한 평가 방식만 계획에 포함됩니다.',
        options: [
          { value: '과정 평가', label: '과정 평가' },
          { value: '산출물 평가', label: '산출물 평가' },
          { value: '동료 평가', label: '동료 평가' },
          { value: '자기 평가', label: '자기 평가' },
        ],
      },
      { id: 'constraints', label: '제약 조건 (선택)', type: 'textarea', rows: 2,
        placeholder: '예) 예산 없음, 스마트기기 미사용, 교외 활동 불가',
        hint: '입력 시 해당 제약을 처음부터 반영한 활동만 제안됩니다.',
      },
    ],
    tags: ['수업', '프로젝트', '백워드디자인'],
  },
  {
    id: 'open-class',
    category: '지도안 제작',
    title: '학부모 공개 수업 기획',
    description: '화려함과 통제력을 동시에 — 안정적 흐름의 공개 수업안 생성',
    icon: Presentation,
    gradient: 'from-pink-500 to-rose-700',
    systemPrompt: `너는 '학부모 공개 수업 기획 전문가'야. 학부모 참관 상황에 최적화된 수업 계획서를 작성한다.

[핵심 설계 원칙]
**겉으로는 화려하고 학생 주도적으로 보이되, 실제로는 교사가 흐름을 안정적으로 통제할 수 있는 구조**. 학생들의 활동 범위는 교사가 사전에 설계한 틀 안에서만 이루어지도록 구성한다 — "자유로워 보이는 통제"가 핵심.

[필수 출력 구조]

## 1. 수업 개요
- 학습 목표 (학생 입장 한 문장)
- **이 수업의 학부모 인상 포인트 한 줄** (이번 수업이 학부모에게 무엇을 보여주는가)

## 2. 도입 (X분)
- 학생 시선·관심을 즉시 사로잡는 hook (첫 1분이 결정적)
- 교사 발문 (큰따옴표로 명시) + 학생 예상 응답 2~3개
- 활동 구조 (학생이 무엇을 말·쓰기·움직이는지)
- 시각적 요소 어떻게 활용

## 3. 전개 (X분)
2~3개 핵심 활동:
- 각 활동마다: 활동명, 학생 행동, 교사 발문, 사용 자료, **학부모가 보게 될 장면**
- 활동 사이 전환 어떻게 (자연스럽게)

## 4. 정리 (X분)
- 학생이 자신의 학습을 보여줄 수 있는 마무리 활동
- 교사 발문 (학습 정리·다음 시간 예고)

## 5. 학부모 인상 포인트
입력된 강조 인상에 따라:
- **자기주도성 강조** → 학생이 스스로 선택·결정하는 장면 명시
- **교사 전문성** → 교사 발문의 깊이·구조화된 피드백 장면 명시
- **협력** → 모둠원 간 상호작용·경청 장면 명시
- **즐거운 분위기** → 자연스러운 웃음·반응 장면 명시
각 인상이 어느 차시·어느 활동에서 부각되는지 구체적으로.

## 6. 운영 팁
- **돌발 상황 대응** (발표 못하는 학생, 답이 안 나올 때, 시간 모자랄 때)
- **공개 수업 전 점검 체크리스트** (전날·당일 아침·수업 직전)
- **자주 오는 학부모 시선 대응** (질문할 때, 사진 찍을 때)
- '제약 조건'이 입력되면 그 조건에 맞춘 추가 대응 전략

[필수 준수 규칙]
- '통제 선호 방식'에 따라 흐름 주도권을 조정:
  · 발문 중심: 교사 질문이 모든 전환점을 만든다
  · 활동지 중심: 활동지 양식이 학생 행동을 미리 구조화한다
  · 모둠 역할 분담 중심: 역할(이끔이/기록이/발표자/지킴이)을 사전 지정해 이탈 최소화
- '학급 인원 수'에 맞춰 모둠 수·운영 규모를 현실적으로 제안한다.
- '시각적 요소'에 체크된 항목을 도입·전개·정리 단계에 자연스럽게 배치한다.
- '학부모에게 강조하고 싶은 인상'에 체크된 항목들을 우선순위로 활동·발문에 반영한다.
- 학생이 무엇을 말·쓰기·만들·움직이는지 동사로 명시한다 (추상어만 나열 금지).
- 출력 언어: 한국어. 표 사용 금지.`,
    inputs: [
      { id: 'grade', label: '학년', type: 'select', required: true,
        options: [
          { value: '1학년', label: '1학년' }, { value: '2학년', label: '2학년' },
          { value: '3학년', label: '3학년' }, { value: '4학년', label: '4학년' },
          { value: '5학년', label: '5학년' }, { value: '6학년', label: '6학년' },
        ],
      },
      { id: 'subject', label: '교과목', type: 'select', required: true,
        options: [
          { value: '국어', label: '국어' }, { value: '수학', label: '수학' },
          { value: '과학', label: '과학' }, { value: '사회', label: '사회' },
          { value: '도덕', label: '도덕' }, { value: '음악', label: '음악' },
          { value: '미술', label: '미술' }, { value: '체육', label: '체육' },
          { value: '통합', label: '통합' },
        ],
      },
      { id: 'unit_topic', label: '단원 / 주제', type: 'text', required: true,
        placeholder: '예) 마음을 전하는 글쓰기, 도형의 넓이',
      },
      { id: 'duration', label: '수업 시간', type: 'select', required: true,
        options: [
          { value: '40분', label: '40분 (초등 표준)' },
          { value: '45분', label: '45분 (블록 수업)' },
        ],
      },
      { id: 'class_size', label: '학급 인원 수', type: 'select', required: true,
        options: [
          { value: '20명 이하', label: '20명 이하' },
          { value: '21~25명', label: '21~25명' },
          { value: '26~30명', label: '26~30명' },
          { value: '31명 이상', label: '31명 이상' },
        ],
      },
      { id: 'visual_element', label: '시각적 요소 선호도', type: 'multiselect', required: true,
        hint: '체크한 시각 요소가 도입·전개·정리에 자연스럽게 배치됩니다.',
        options: [
          { value: '판서 판 구성', label: '판서 판 구성' },
          { value: 'PPT 활용', label: 'PPT 활용' },
          { value: '결과물 전시', label: '결과물 전시' },
          { value: '칠판 꾸미기', label: '칠판 꾸미기' },
        ],
      },
      { id: 'control_strategy', label: '통제 선호 방식', type: 'select', required: true,
        options: [
          { value: '발문 중심 (교사 질문이 흐름 주도)', label: '발문 중심' },
          { value: '활동지 중심 (활동지가 학생 행동 구조화)', label: '활동지 중심' },
          { value: '모둠 역할 분담 중심 (역할 고정으로 이탈 최소화)', label: '모둠 역할 분담 중심' },
        ],
      },
      { id: 'parent_impression', label: '학부모에게 강조하고 싶은 인상', type: 'multiselect', required: true,
        hint: '체크한 인상이 활동·발문에 우선 반영됩니다. 1~3개 권장.',
        options: [
          { value: '학생 자기주도성', label: '학생 자기주도성' },
          { value: '교사 전문성', label: '교사 전문성' },
          { value: '학생 간 협력', label: '학생 간 협력' },
          { value: '즐거운 학급 분위기', label: '즐거운 학급 분위기' },
        ],
      },
      { id: 'constraints', label: '제약 조건 (선택)', type: 'textarea', rows: 2,
        placeholder: '예) 발표 못하는 학생 있음, 교실 공간 협소',
        hint: '입력 시 돌발 상황 최소화 전략이 추가로 작성됩니다.',
      },
    ],
    tags: ['수업', '공개수업', '학부모', '운영'],
  },

  // ── 외부 도구 (API 불필요, 새 탭으로 이동) ──────────────────────────────
  {
    id: 'math-word-problem',
    category: '수업도구',
    title: '서술형 수학 문제 만들기',
    description: '수식이나 PDF/JPG/PNG를 문장제 문제로 변환',
    icon: NotebookPen,
    gradient: 'from-indigo-500 to-sky-600',
    systemPrompt: `너는 초등 수학 문장제 문제를 만드는 교사 지원 AI다.

사용자가 입력한 수식 또는 업로드한 자료 속 수식을 읽고, 각 수식에 대응하는 자연스러운 서술형 수학 문제로 바꿔라.

출력 규칙:
- 입력에 수식이 1개면 서술형 문제 1개를 만든다.
- 입력에 수식이 여러 개면 번호를 붙여 각각 별도의 서술형 문제로 만든다.
- 풀이 과정이나 정답은 쓰지 말고 문제만 제시한다.
- 수식의 수, 연산, 순서를 바꾸지 않는다.
- 학생이 이해하기 쉬운 일상 맥락을 사용하되, 과장된 설정은 피한다.
- OCR 결과가 다소 불분명하면 가장 가능성이 높은 수식으로 정리하되, 확신이 낮은 부분은 출력 마지막에 "확인 필요:" 한 줄로 짧게 덧붙인다.
- PDF, JPG, PNG 등 업로드 파일이 있으면 그 안의 수식을 먼저 읽고 문제로 바꾼다.
- 사용자가 직접 입력한 수식 텍스트가 함께 있으면 업로드 내용 보정에 활용한다.`,
    inputs: [
      {
        id: 'formulaText',
        label: '수식 입력',
        type: 'textarea',
        placeholder: '예: 24 ÷ 3 = 8\n또는\n(15 + 9) - 7 = 17',
        rows: 5,
      },
      {
        id: 'formulaFile',
        label: '수식 파일',
        type: 'file',
        accept: '.pdf,image/png,image/jpeg',
        hint: '수식이 들어 있는 PDF, JPG, PNG 파일을 올리면 OCR로 읽어 문장제 문제로 바꿉니다.',
      },
    ],
    requireOneOf: ['formulaText', 'formulaFile'],
    tags: ['수학', '서술형', '문장제', 'OCR', 'PDF'],
  },

  {
    id: 'essay-feedback-helper',
    category: '수업도구',
    title: '논술 평가 도우미',
    description: '학생 글 텍스트나 이미지/PDF를 분석해 점수와 피드백 제공',
    icon: FileText,
    gradient: 'from-purple-500 to-pink-600',
    systemPrompt: `당신은 초등·중등 학생의 글을 평가하고 성장 피드백을 제공하는 논술 평가 도우미입니다.

# 태도
- 아이들의 눈높이에 맞춰 다정하고 칭찬 중심의 피드백을 제공합니다.
- 개선점은 명확하고 이해하기 쉽게 설명합니다.
- 정중하면서도 친근한 존댓말을 사용합니다.

# 입력 처리
- 학생이 제출한 텍스트 또는 업로드한 이미지/PDF 속 글을 분석합니다.
- 이미지나 PDF가 있으면 먼저 OCR로 학생 글을 읽습니다.
- 텍스트와 파일이 함께 있으면 텍스트를 우선으로 하되, 파일로 누락된 부분을 보완합니다.
- OCR이 불분명한 부분은 무리하게 단정하지 말고 문맥상 가능한 범위에서만 평가합니다.

# 평가 항목
각 항목은 10점 만점입니다.
1. 표현력: 풍부한 어휘 사용, 참신한 비유, 자신의 감정을 생동감 있게 표현했는가?
2. 전달력: 문장이 매끄럽고 읽는 사람에게 생각이 정확히 전달되는가?
3. 이해력: 책의 핵심 줄거리와 주제를 정확히 파악하고 기술했는가?
4. 구성력: 처음-중간-끝 또는 기승전결의 짜임새가 논리적인가?
5. 맞춤법: 띄어쓰기, 맞춤법, 문장 부호 사용이 올바른가?

# 출력 포맷
모든 응답은 반드시 아래 순서를 따릅니다.

1. 다정한 첫인사
- 학생 가명이 입력되어 있으면 가명을 부릅니다.
- 학생 가명이 없으면 "학생"이라고 부릅니다.
- 글을 읽은 소감을 짧게 언급합니다.

2. 평가 점수표
- 마크다운 표 형식으로 항목별 점수와 총점을 제시합니다.
- 표 열은 "평가 항목", "점수", "짧은 근거"로 구성합니다.

3. 항목별 상세 피드백
- 각 항목마다 "잘한 점"과 "보완점"을 구분하여 설명합니다.
- 학생이 이해할 수 있는 쉬운 표현을 사용합니다.

4. 맞춤법 교정
- 틀린 부분과 올바른 표현을 목록 형태로 제시합니다.
- 명확한 오류가 없으면 "크게 고칠 맞춤법은 많지 않았습니다."라고 말하고, 더 자연스러운 표현 1~2개를 제안합니다.

5. 성장을 위한 한마디
- 다음 글쓰기에서 시도해 볼 만한 구체적인 팁을 1~3개 제안합니다.

# 주의
- 학생을 낙담시키는 표현을 쓰지 않습니다.
- 점수는 후하게만 주지 말고, 평가 기준에 맞춰 일관되게 부여합니다.
- 다른 학생과 비교하지 않습니다.
- 원문 전체를 길게 다시 베껴 쓰지 않습니다.`,
    inputs: [
      {
        id: 'studentName',
        label: '학생 가명 (선택)',
        type: 'text',
        placeholder: '예) 민준',
      },
      {
        id: 'essayText',
        label: '학생 글 텍스트',
        type: 'textarea',
        placeholder: '학생이 쓴 독서감상문이나 논술문을 붙여넣으세요. 사진/PDF만 올려도 됩니다.',
        rows: 6,
      },
      {
        id: 'essayFile',
        label: '학생 글 이미지/PDF',
        type: 'file',
        accept: '.pdf,image/png,image/jpeg',
        hint: '학생 글이 담긴 PDF, JPG, PNG 파일을 올리면 OCR로 읽어 평가합니다.',
      },
      {
        id: 'assignmentInfo',
        label: '과제 정보 또는 책 제목 (선택)',
        type: 'textarea',
        placeholder: '예) 「어린 왕자」를 읽고 주제와 느낀 점을 쓰는 독서논술 과제',
        rows: 2,
      },
    ],
    requireOneOf: ['essayText', 'essayFile'],
    tags: ['논술', '평가', '피드백', 'OCR', '독서감상문'],
  },

  {
    id: 'text-leveler-ocr',
    category: '수업도구',
    title: '글 수준 조절',
    description: '책 페이지 사진이나 텍스트를 바탕으로 글을 쉽게, 깊게, 설명형으로 바꿉니다',
    icon: BookOpenText,
    gradient: 'from-sky-400 to-indigo-500',
    systemPrompt: `당신은 초등 교사를 돕는 문해력 지원 도우미입니다.

입력에는 텍스트와/or 책 페이지 이미지가 들어올 수 있습니다.
- 이미지가 들어오면 먼저 OCR로 텍스트를 정확하게 추출합니다.
- 텍스트와 이미지가 함께 들어오면, 붙여넣은 텍스트를 우선으로 하고 이미지로 누락된 부분만 보완합니다.
- 불필요한 설명은 하지 말고, 결과로 바로 수업에 사용할 수 있는 변형 텍스트만 출력합니다.

변형 방식:
1. 심화: 원문 뜻은 유지하되 어휘와 문장 구조를 조금 더 깊고 정교하게 바꿉니다.
2. 기초: 원문 뜻은 유지하되 쉬운 낱말과 짧은 문장으로 다시 씁니다.
3. 설명: 원문을 유지하되 어려운 단어를 찾아 바로 뒤에 짧은 풀이를 덧붙입니다. 예: 민주주의(국민이 나라의 주인이 되는 제도)

출력 규칙:
- 제목이나 인사말 없이 변형된 본문만 출력합니다.
- 줄바꿈은 읽기 편하게 정리합니다.
- 설명 모드에서는 지나치게 많은 단어를 설명하지 말고, 이해에 꼭 필요한 단어 위주로 설명합니다.
- OCR이 불분명한 부분은 문맥상 자연스럽게 정리하되, 임의의 내용을 크게 추가하지 않습니다.`,
    inputs: [
      {
        id: 'pageImage',
        label: '책 페이지 사진',
        type: 'image',
        accept: 'image/*',
        hint: '휴대폰으로 찍은 책 페이지나 학습 자료 이미지를 올릴 수 있습니다.',
      },
      {
        id: 'sourceText',
        label: '원문 텍스트',
        type: 'textarea',
        placeholder: '사진 대신 텍스트를 붙여넣거나, 사진과 함께 원문을 보정할 때 사용하세요.',
        rows: 6,
      },
      {
        id: 'transformMode',
        label: '변형 방식',
        type: 'select',
        required: true,
        ui: 'buttons',
        options: [
          { value: '심화', label: '심화 (더 어려운 글)' },
          { value: '기초', label: '기초 (매우 쉬운 글)' },
          { value: '설명', label: '설명 (단어 설명 포함)' },
        ],
      },
    ],
    requireOneOf: ['pageImage', 'sourceText'],
    tags: ['OCR', '문해력', '글 수준', '책 페이지', '텍스트 변형'],
  },

  {
    id: 'gpt-haksbabaldal',
    category: 'GPTs',
    subCategory: '초등교사 수업 준비용 GPTs',
    title: '교과 학습발달상황 작성 GPT',
    description: '학생의 학습 활동·성과를 입력하면 교과 학습발달상황 문장을 자동 생성하는 ChatGPT 커스텀 GPT',
    icon: NotebookPen,
    gradient: 'from-amber-100 to-orange-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '생기부', '학습발달상황'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-6753f78947708191b221bbf659619dfd-seongcwigijun-giban-gyogwahagseubbaldalsanghwang-saengseong-caesbos-jeongwamog',
    hostLabel: 'chatgpt.com',
  },

  {
    id: 'gpt-edu-idea',
    category: 'GPTs',
    subCategory: '초등교사 수업 준비용 GPTs',
    title: '교육 아이디어 도우미 GPT',
    description: '수업 주제·상황을 입력하면 교육 활동 아이디어를 제안해 주는 ChatGPT 커스텀 GPT',
    icon: Lightbulb,
    gradient: 'from-yellow-100 to-amber-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '수업 아이디어'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-677cab3951bc8191adf633bd9e6b9fcb-gyoyug-aidieo-doumi',
    hostLabel: 'chatgpt.com',
  },

  {
    id: 'gpt-edu-youtube',
    category: 'GPTs',
    subCategory: '기타GPTs',
    title: '교육·다큐·어학·어린이 유튜브 영상 GPT',
    description: '교육·다큐멘터리·어학·어린이 분야 유튜브 영상을 추천하고 함께 시청·정리하도록 돕는 ChatGPT 커스텀 GPT',
    icon: Film,
    gradient: 'from-rose-100 to-red-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '유튜브', '영상 추천'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-f7aSrkPEP-gyoyug-dakyumenteori-eohag-eorini-yutyubeu-yeongsang-bogi-education',
    hostLabel: 'chatgpt.com',
  },

  {
    id: 'gpt-elementary-school',
    category: 'GPTs',
    subCategory: '초등학생 직접 학습용 GPTs',
    title: 'Elementary School',
    description: '영어, 수학, 사회, 과학, 예술, 건강·체육 등을 다루는 초등학생용 종합 교육 GPT',
    icon: GraduationCap,
    gradient: 'from-sky-100 to-blue-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '종합 학습'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-e4ypiSvGp-elementary-school',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-childrens-tutor-school-life',
    category: 'GPTs',
    subCategory: '초등학생 직접 학습용 GPTs',
    title: "Children's Tutor for School and Life",
    description: '어린이의 학교생활과 기초 학습을 돕는 적응형 튜터 GPT',
    icon: GraduationCap,
    gradient: 'from-sky-100 to-blue-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '튜터', '학교생활'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-ya79Db36J-children-s-tutor-for-school-and-life',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-tutor-elementary-phd',
    category: 'GPTs',
    subCategory: '초등학생 직접 학습용 GPTs',
    title: 'GPT Tutor, From Elementary To PhD Level',
    description: '초등 수준부터 고급 수준까지 설명 가능한 범용 튜터 GPT',
    icon: GraduationCap,
    gradient: 'from-sky-100 to-blue-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '튜터'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-x2i8jFzkB-gpt-tutor-from-elementary-to-phd-level',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-knowledge',
    category: 'GPTs',
    subCategory: '초등학생 직접 학습용 GPTs',
    title: '초등학생 지식인',
    description: '초등학생 수준의 다양한 질문에 답변하는 지식 Q&A형 GPT',
    icon: BrainCircuit,
    gradient: 'from-sky-100 to-blue-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '지식', 'Q&A'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-Vgjv62APM-codeunghagsaeng-jisigin',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-childrens-encyclopedia-tutor',
    category: 'GPTs',
    subCategory: '초등학생 직접 학습용 GPTs',
    title: "Children's Encyclopedia Tutor",
    description: '어린이 눈높이의 백과사전식 지식 학습을 지원하는 GPT',
    icon: BookA,
    gradient: 'from-sky-100 to-blue-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '백과사전', '지식'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-YfIZiarGv-children-s-encyclopedia-tutor-er-tong-bai-ke-fu-dao-lao-shi',
    hostLabel: 'chatgpt.com',
  },

  {
    id: 'gpt-elementary-math-tutor',
    category: 'GPTs',
    subCategory: '초등 수학 관련 GPTs',
    title: '초등수학 튜터',
    description: '아이들을 위한 친근한 초등 수학 튜터 GPT',
    icon: BrainCircuit,
    gradient: 'from-emerald-100 to-teal-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등수학', '튜터'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-t4oNzBgX4-codeungsuhag-tyuteo',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-school-math-wiz',
    category: 'GPTs',
    subCategory: '초등 수학 관련 GPTs',
    title: 'Elementary School Math Wiz',
    description: '초등학교 수학 개념 학습과 문제 풀이를 지원하는 GPT',
    icon: BrainCircuit,
    gradient: 'from-emerald-100 to-teal-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등수학', '문제 풀이'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-E0sT5M3Xq-elementary-school-math-wiz',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-math-kids',
    category: 'GPTs',
    subCategory: '초등 수학 관련 GPTs',
    title: 'Math Kids',
    description: '어린이 수학 학습을 단계적으로 설명해주는 GPT',
    icon: BrainCircuit,
    gradient: 'from-emerald-100 to-teal-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등수학', '어린이'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-RHsiZ0bLA-math-kids',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-kids-math-bot',
    category: 'GPTs',
    subCategory: '초등 수학 관련 GPTs',
    title: 'Kids Math Bot',
    description: '어린이를 대상으로 한 수학 문제 풀이 및 개념 설명 GPT',
    icon: BrainCircuit,
    gradient: 'from-emerald-100 to-teal-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등수학', '문제 풀이'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-WIIhip684',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-math-education-helper',
    category: 'GPTs',
    subCategory: '초등 수학 관련 GPTs',
    title: '초등 수학 교육 관련 질문 도우미 GPT',
    description: '예비교사, 현직교사, 학부모의 초등수학교육 질문을 돕는 GPT',
    icon: MessageCircle,
    gradient: 'from-emerald-100 to-teal-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등수학', '교사', '학부모'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-OQGux4jbQ-codeung-suhag-gyoyug-gwanryeon-jilmun-doumi-gpt',
    hostLabel: 'chatgpt.com',
  },

  {
    id: 'gpt-elementary-english-teacher',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: '초등영어선생님',
    description: '초등학생 수준의 영어 대화와 기초 단어 학습을 지원하는 GPT',
    icon: MessageCircle,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '영어회화', '단어'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-27MEzfe7R-codeungyeongeoseonsaengnim',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-speaking-english',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: '영어회화 초등학생용 눈높이 speaking English 영어 회화',
    description: '초등학생 눈높이에 맞춘 영어 회화 연습 GPT',
    icon: MessageCircle,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '영어회화'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-48BYAXZMp-yeongeohoehwa-codeunghagsaengyong-nunnopi-speaking-english-yeongeo-hoehwa',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-ai-elementary-english-conversation',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: 'AI 초등영어회화',
    description: '초급 영어회화 연습을 지원하는 초등학생용 GPT',
    icon: MessageCircle,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '영어회화'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-boHY8XtZy-ai-codeungyeongeohoehwa',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-english-word-extractor-2',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: '초등학생 영어 단어 추출기2',
    description: '주제에 맞는 초등학생 수준 영어 단어를 추출하는 GPT',
    icon: BookOpenText,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '단어'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-VIOEB3Rcu-codeunghagsaeng-yeongeo-daneo-cuculgi2',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-english-word-extractor',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: '초등학생을 위한 영어단어 추출기',
    description: '주제 기반으로 초등학생에게 적합한 영어 단어를 추천하는 GPT',
    icon: BookOpenText,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '단어'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-wQw1az3ZX-codeunghagsaengeul-wihan-yeongeodaneo-cuculgi',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-english-writing-feedback',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: '초등학생 영작문 첨삭',
    description: '초등학생의 영어 작문을 첨삭하고 개선 방향을 제시하는 GPT',
    icon: NotebookPen,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '영작문', '첨삭'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-tBgstLL68-codeunghagsaeng-yeongjagmun-ceomsag',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-english-quiz',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: '초등영어퀴즈',
    description: '초등 영어 학습을 위한 퀴즈 생성 및 연습용 GPT',
    icon: ClipboardCheck,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '퀴즈'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-K5KtPyNR6-codeungyeongeokwijeu',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-english-words',
    category: 'GPTs',
    subCategory: '초등 영어 관련 GPTs',
    title: '초등영어단어',
    description: '초등 영어 단어 수준에 맞추어 응답하거나 단어 학습을 지원하는 GPT',
    icon: BookOpenText,
    gradient: 'from-violet-100 to-indigo-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등영어', '단어'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-1OlxRkTYG-codeungyeongeodaneo',
    hostLabel: 'chatgpt.com',
  },

  {
    id: 'gpt-writing-prompt-elementary',
    category: 'GPTs',
    subCategory: '독서·글쓰기·창작 관련 GPTs',
    title: 'Writing Prompt Generator for Elementary Students',
    description: '초등학생용 글쓰기 주제, 이미지 프롬프트, 토론 질문을 생성하는 GPT',
    icon: NotebookPen,
    gradient: 'from-rose-100 to-pink-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '글쓰기', '창작'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-v3UNmRlJi-writing-prompt-generator-for-elementary-students',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-book-recommendation-children',
    category: 'GPTs',
    subCategory: '독서·글쓰기·창작 관련 GPTs',
    title: '챗GPT 도서 추천 - 유아 / 어린이 / 초등학생 / 청소년 / 권장도서 / 필수도서',
    description: '유아, 어린이, 초등학생, 청소년 대상 도서를 추천하는 GPT',
    icon: BookA,
    gradient: 'from-rose-100 to-pink-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '도서 추천', '초등학생', '어린이'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-67c9b4cfc4cc8191ac1bc0849b594024-caesgpt-doseo-cuceon-yua-eorini-codeunghagsaeng-ceongsonyeon-gweonjangdoseo-pilsudoseo',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-interactive-story-wizard',
    category: 'GPTs',
    subCategory: '독서·글쓰기·창작 관련 GPTs',
    title: 'Interactive Story Wizard',
    description: '초등학생과 함께 영어 인터랙티브 스토리를 만들 수 있는 창작형 GPT 사례',
    icon: Wand2,
    gradient: 'from-rose-100 to-pink-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'GPTs', '초등학생', '스토리', '창작'],
    kind: 'external',
    externalUrl: 'https://www.gpters.org/research/post/gpts-gaebal-sarye---interactive-storyro-codeunghaggyo-janyeowa-yeongeo-993BTYS5PX3xZn7',
    hostLabel: 'gpters.org',
  },

  {
    id: 'gpt-elementary-math-lesson-plan',
    category: 'GPTs',
    subCategory: '초등교사 수업 준비용 GPTs',
    title: '초등 수학 수업 지도안 작성도우미 GPT',
    description: '초등 수학 수업 지도안 작성을 지원하는 교사용 GPT',
    icon: Presentation,
    gradient: 'from-amber-100 to-yellow-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등교사', '지도안', '초등수학'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-foUjjrWQs-codeung-suhag-sueob-jidoan-jagseongdoumi-gpt',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-bluekit-elementary-teacher',
    category: 'GPTs',
    subCategory: '초등교사 수업 준비용 GPTs',
    title: '로그인도 필요 없는 블루킷(초등교사)',
    description: '블루킷 수업 활동에 활용할 객관식·단답형 퀴즈를 생성하는 GPT',
    icon: ClipboardCheck,
    gradient: 'from-amber-100 to-yellow-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등교사', '퀴즈', '블루킷'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-684aca6eb4648191895e45261bec54a8-rogeuindo-pilyo-eobsneun-beulrukis-codeunggyosa',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-teacher-play-script',
    category: 'GPTs',
    subCategory: '초등교사 수업 준비용 GPTs',
    title: '초등교사 맞춤형 연극 대본 작가',
    description: '초등학교 수업이나 행사에 활용할 연극 대본 작성을 지원하는 GPT',
    icon: FileText,
    gradient: 'from-amber-100 to-yellow-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등교사', '연극', '대본'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-696d7f9b96bc8191bd96a634f380883c-codeunggyosa-majcumhyeong-yeongeug-daebon-jagga',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-ai-digital-textbook-lesson-design',
    category: 'GPTs',
    subCategory: '초등교사 수업 준비용 GPTs',
    title: '(초등) AI디지털교과서 수업 설계 by 호남샘',
    description: '과목과 성취기준을 바탕으로 AI 디지털교과서 수업 설계를 돕는 GPT',
    icon: Presentation,
    gradient: 'from-amber-100 to-yellow-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등교사', 'AI디지털교과서', '수업 설계'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-wERwDhKnx-codeung-aidijiteolgyogwaseo-sueob-seolgye-by-honamsaem',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-elementary-haengbal-generator',
    category: 'GPTs',
    subCategory: '초등교사 수업 준비용 GPTs',
    title: '행발 생성기(초등)',
    description: '초등 생활기록부 행동특성 및 종합의견 작성을 지원하는 GPT',
    icon: NotebookPen,
    gradient: 'from-amber-100 to-yellow-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등교사', '생활기록부', '행발'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-673e06381ddc8191a9489253350bf8b5-haengbal-saengseonggi-codeung',
    hostLabel: 'chatgpt.com',
  },

  {
    id: 'gpt-student-record-writing',
    category: 'GPTs',
    subCategory: '기타GPTs',
    title: '학생부 생기부 작성해드려요',
    description: '초·중·고 학생부, 생기부, 행발, 세특 작성 등을 지원하는 GPT',
    icon: NotebookPen,
    gradient: 'from-slate-200 to-slate-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '학생부', '생기부', '행발', '세특'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-PeGH8Y8Mi-hagsaengbu-saenggibu-jagseonghaedeuryeoyo-haengbal-seteug-dongari-seupoceukeulreob-jayuhaggi-jayul-codeung-junghaggyo-godeunghaggyo',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-multiple-intelligence-elementary',
    category: 'GPTs',
    subCategory: '기타GPTs',
    title: '다중지능테스트 초등1',
    description: '초등학생 대상 다중지능 검사 또는 진단 활동을 지원하는 GPT',
    icon: SlidersHorizontal,
    gradient: 'from-slate-200 to-slate-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '다중지능', '진단'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-t6EG0ARBt-dajungjineungteseuteu-codeung1-paster-ohkyoungkeun',
    hostLabel: 'chatgpt.com',
  },
  {
    id: 'gpt-programming-explain-elementary',
    category: 'GPTs',
    subCategory: '기타GPTs',
    title: '프로그래밍 설명을 초등학생 수준으로 해설',
    description: '프로그래밍 관련 설명을 초등학생 눈높이로 쉽게 풀어주는 GPT',
    icon: Bot,
    gradient: 'from-slate-200 to-slate-100',
    systemPrompt: '',
    inputs: [],
    tags: ['외부', 'ChatGPT', '초등학생', '프로그래밍', '설명'],
    kind: 'external',
    externalUrl: 'https://chatgpt.com/g/g-67a1bddf9a748191a898c44d9ea18bf5-2-4-jaceong-peurogeuraeming-seolmyeonge-daehae-codeunghagsaeng-sujuneuro-haeseol',
    hostLabel: 'chatgpt.com',
  },
];
