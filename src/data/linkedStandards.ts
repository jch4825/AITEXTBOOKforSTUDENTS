import type { ModuleId } from '../types';

export type LinkedStandardAlignment = 'direct' | 'supporting' | 'deferred';

export interface LinkedLessonEvidence {
  lessonId: string;
  evidence: string;
}

export interface LinkedStandard {
  subject: string;
  subjectCode: string;
  badgeColor: string;
  subjectDescription: string;
  code: string;
  statement: string;
  alignment: LinkedStandardAlignment;
  lessonLinks: LinkedLessonEvidence[];
  guidanceNote: string;
  deferredReason?: string;
}

export interface LinkedStandardsFilter {
  subjectCode?: string;
  moduleId?: ModuleId;
  alignment?: LinkedStandardAlignment;
}

interface SubjectDefinition {
  subject: string;
  subjectCode: string;
  badgeColor: string;
  description: string;
  standards: Omit<LinkedStandard, 'subject' | 'subjectCode' | 'badgeColor' | 'subjectDescription'>[];
}

const SUBJECTS: SubjectDefinition[] = [
  {
    subject: '정보통신활용',
    subjectCode: '정통',
    badgeColor: 'bg-indigo-900 text-amber-300 border-indigo-700',
    description: '기기·정보·디지털 윤리·문제 해결 성취기준을 실제 수행이 확인되는 차시에만 연결합니다.',
    standards: [
      {
        code: '[9정통01-01]',
        statement: '정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.',
        alignment: 'supporting',
        lessonLinks: [
          { lessonId: 'm1-l9', evidence: '하려는 일의 입력과 결과를 기준으로 텍스트·이미지·음성 AI 도구를 구분합니다.' },
          { lessonId: 'm3-l9', evidence: '그림 입력과 AI의 글 설명을 함께 살펴보고, 문장마다 그림에서 확인할 수 있는 근거를 구분합니다.' },
        ],
        guidanceNote: '정보통신의 전체 개념을 가르치는 차시는 아니므로, 여러 정보 형태를 구분하는 보조 근거로 사용합니다.',
      },
      {
        code: '[9정통01-04]',
        statement: '필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
        alignment: 'supporting',
        lessonLinks: [
          { lessonId: 'm5-l6', evidence: 'AI가 다르게 알아들은 원인을 찾고, 개인정보를 뺀 필요한 단서를 모아 다시 요청합니다.' },
          { lessonId: 'm6-l9', evidence: '도움 요청·거절·재설명 요청을 말·글·그림 카드로 주고받습니다.' },
        ],
        guidanceNote: 'AI 사용 자체보다 필요한 정보를 골라 사람과 주고받는 수행을 관찰합니다.',
      },
      {
        code: '[9정통02-02]',
        statement: '인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.',
        alignment: 'supporting',
        lessonLinks: [
          { lessonId: 'm2-l9', evidence: 'AI의 주장 하나를 최신 학교 공지의 출처·날짜와 비교해 확인합니다.' },
          { lessonId: 'm4-l2', evidence: '준비된 출처 카드에서 작성자·날짜·근거를 찾아 신뢰도를 판단합니다.' },
        ],
        guidanceNote: '현재 앱은 자유 인터넷 검색을 시키지 않습니다. 교사가 공식 검색 결과를 준비하고 학생이 목적·출처·날짜를 확인할 때 보조 연계로 기록합니다.',
      },
      {
        code: '[9정통02-03]',
        statement: '순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm5-l3', evidence: '조건을 순서대로 점검하며 해결 절차를 구성합니다.' },
          { lessonId: 'm5-l7', evidence: '실패한 지점을 찾아 조건을 바꾸고 다시 실행하는 과정을 반복합니다.' },
          { lessonId: 'm5-l10', evidence: '해결 순서의 선택·반복 지점을 확인하고 다른 상황에 적용합니다.' },
        ],
        guidanceNote: '학생이 만든 해결 절차에서 순서, 갈림길, 다시 시도한 지점을 직접 표시합니다.',
      },
      {
        code: '[9정통02-04]',
        statement: '인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm1-l1', evidence: 'AI의 뜻과 생활에서 AI가 돕는 일을 자기 말로 소개합니다.' },
          { lessonId: 'm1-l2', evidence: '버튼 선풍기·센서 자동문·추천 앱의 입력을 비교해 AI 사례를 판별합니다.' },
          { lessonId: 'm1-l9', evidence: '하려는 일에 따라 서로 다른 AI 도구를 고르고 이유를 설명합니다.' },
        ],
        guidanceNote: '생활 사례를 단순 나열하지 않고, 각 도구가 받는 입력과 만드는 결과를 근거로 구분합니다.',
      },
      {
        code: '[9정통03-01]',
        statement: '디지털 공간에서 올바른 예절을 익혀 실천한다.',
        alignment: 'supporting',
        lessonLinks: [
          { lessonId: 'm4-l7', evidence: 'AI에게 목적·행동·조건·존중 표현을 담아 부탁하고, 같은 구조를 사람에게 하는 부탁으로 옮겨 연습합니다.' },
        ],
        guidanceNote: '디지털 공간 전체의 예절을 다루는 차시는 아니므로, 존중하는 요청을 실제로 고쳐 쓴 보조 근거로 사용합니다.',
      },
      {
        code: '[9정통03-02]',
        statement: '개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm4-l3', evidence: '이름·학교·연락처 등 개인 정보를 찾아 입력 전 가립니다.' },
          { lessonId: 'm4-l4', evidence: '비밀번호·인증 코드 요구를 알아차리고 거절·닫기·알리기를 수행합니다.' },
          { lessonId: 'm4-l5', evidence: '사진의 얼굴·이름표·위치 같은 배경 단서와 공유 대상·목적을 확인해 공유 방법을 정합니다.' },
          { lessonId: 'm4-l9', evidence: '사진·암호·선물·비밀·만남 요구의 위험 단서를 찾아 멈춤·거절·차단·알리기를 수행합니다.' },
          { lessonId: 'm6-l11', evidence: '교실용·온라인용 자기소개에서 공개 범위를 다르게 정합니다.' },
        ],
        guidanceNote: '최종 산출물에 개인 정보가 남지 않았는지와 학생이 선택한 보호 행동을 함께 확인합니다.',
      },
      {
        code: '[12정통02-03]',
        statement: '생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm5-l1', evidence: '생활 문제에서 목표와 현재 상태를 나누어 문제를 정의합니다.' },
          { lessonId: 'm5-l2', evidence: '큰 문제를 작은 단계로 나누어 해결 순서를 만듭니다.' },
          { lessonId: 'm5-l3', evidence: '조건과 제약을 확인해 실행 가능한 절차로 바꿉니다.' },
          { lessonId: 'm5-l4', evidence: '여러 해결 방법을 기준에 따라 비교하고 하나를 선택합니다.' },
          { lessonId: 'm5-l7', evidence: '오류 원인을 찾고 한 조건씩 바꾸어 다시 시도합니다.' },
          { lessonId: 'm5-l10', evidence: '전체 해결 절차를 조립하고 새 문제에 옮겨 적용합니다.' },
          { lessonId: 'm5-l11', evidence: '계획의 전제 조건이 바뀌면 실행을 멈추고 어른 확인과 대체 활동을 넣어 새 계획을 만듭니다.' },
        ],
        guidanceNote: '문제 정의, 단계 구성, 실행, 오류 수정, 전이 기록을 한 흐름으로 봅니다.',
      },
      {
        code: '[12정통02-04]',
        statement: '일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.',
        alignment: 'supporting',
        lessonLinks: [
          { lessonId: 'm6-l1', evidence: '필요한 물건과 예산 조건을 주고 AI 제안을 확인해 장보기 선택을 합니다.' },
          { lessonId: 'm6-l5', evidence: '공식 날씨 정보와 AI 제안을 비교해 활동에 맞는 준비물을 고릅니다.' },
          { lessonId: 'm6-l7', evidence: 'AI 일정 초안에 휴식과 도움 시간을 넣어 생활 계획을 조정합니다.' },
        ],
        guidanceNote: '기본 수업은 준비된 AI 예시를 사용하므로 실제 AI 기기 독립 수행의 달성 근거가 아니라, 입력 조건·결과 확인·사람의 최종 선택을 익히는 사전 연습으로 봅니다.',
      },
      {
        code: '[12정통03-01]',
        statement: '디지털 윤리를 이해하고, 디지털 공간에서 타인을 존중하고 배려하는 태도를 기른다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm4-l7', evidence: 'AI가 만든 공격적 표현을 찾아 상대를 존중하는 문장으로 고쳐 대화를 이어 갑니다.' },
        ],
        guidanceNote: '정의 암기보다 디지털 대화에서 고쳐 쓴 문장과 선택 이유를 근거로 삼습니다.',
      },
      {
        code: '[12정통03-02]',
        statement: '디지털 중독 및 디지털 범죄 사례를 살펴보고, 예방하는 방법을 실천한다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm4-l4', evidence: '비밀번호·인증 코드 요구를 식별해 거절·닫기·알리기를 수행하고 공식 복구 경로를 확인합니다.' },
          { lessonId: 'm4-l6', evidence: '불편한 콘텐츠를 만났을 때 몸·감정의 신호를 알아차리고 멈춤·가리기·거리두기·알리기를 수행합니다.' },
          { lessonId: 'm4-l8', evidence: '디지털 이용 시간을 조절하고 멈춤·휴식 계획을 만듭니다.' },
          { lessonId: 'm4-l9', evidence: '사진·암호·선물·비밀·만남 요구의 위험 단서를 찾아 멈춤·거절·차단·알리기를 수행합니다.' },
        ],
        guidanceNote: '범죄 사례와 사용 조절을 한데 묶지 말고, 차시별로 관찰한 예방 행동을 따로 기록합니다.',
      },
      {
        code: '[12정통03-04]',
        statement: '디지털 사회에서의 다양한 직업을 탐색하고 체험한다.',
        alignment: 'supporting',
        lessonLinks: [
          { lessonId: 'm6-l10', evidence: 'AI의 직업 예상, 공식 자료, 실제 직업인 설명을 비교하고 자신의 흥미·강점·필요한 도움을 연결합니다.' },
        ],
        guidanceNote: '한 차시에서 사서와 전이 상황의 제빵사를 살펴보는 범위이므로 다양한 디지털 직업 체험의 완전한 달성 근거가 아니라 실제 사람·공식 자료 비교의 보조 근거로 사용합니다.',
      },
    ],
  },
  {
    subject: '국어',
    subjectCode: '국어',
    badgeColor: 'bg-emerald-900 text-emerald-200 border-emerald-700',
    description: '질문·대답·대화 이어가기 수행이 중심인 차시에만 연결합니다.',
    standards: [
      {
        code: '[6국어01-04]',
        statement: '묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm2-l1', evidence: '엉뚱한 답의 원인이 된 빠진 정보를 찾아 다시 질문합니다.' },
          { lessonId: 'm2-l3', evidence: '그거·아무거나 같은 모호한 말을 대상·종류·개수로 바꾸어 질문합니다.' },
          { lessonId: 'm3-l1', evidence: '같은 주제를 서로 다른 질문으로 바꾸고 목적에 맞는 질문을 고릅니다.' },
        ],
        guidanceNote: '질문의 문법보다 상대가 이해할 정보가 들어갔는지와 답을 이어 갔는지를 봅니다.',
      },
      {
        code: '[9국어01-04]',
        statement: '대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm4-l7', evidence: '상대를 존중하는 표현으로 문장을 고치고 대화를 이어 갑니다.' },
          { lessonId: 'm6-l9', evidence: '도움 요청·거절·다시 말해 달라는 표현으로 실제 대화를 연습합니다.' },
        ],
        guidanceNote: 'AI와 말한 횟수가 아니라 상대에 맞춘 질문·대답과 대화 지속 행동을 평가합니다.',
      },
    ],
  },
  {
    subject: '수학',
    subjectCode: '수학',
    badgeColor: 'bg-amber-900 text-amber-200 border-amber-700',
    description: '실제 화폐 수행이 있는 차시만 연결하며, 앱에 없는 대용 화폐 활동은 보류합니다.',
    standards: [
      {
        code: '[9수학01-14]',
        statement: '대용 화폐를 활용하여 상품을 교환한다.',
        alignment: 'deferred',
        lessonLinks: [],
        guidanceNote: '현재 차시를 이 기준의 달성 근거로 사용하지 않습니다.',
        deferredReason: '현재 장보기·계산 활동은 실제 금액을 다루며 쿠폰, 토큰, 선불카드 같은 대용 화폐로 상품을 교환하는 수행이 없습니다.',
      },
      {
        code: '[12수학01-14]',
        statement: '실생활의 다양한 상황에서 필요한 화폐를 활용한다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm6-l1', evidence: '예산 안에서 필요한 물건을 고르고 금액을 비교합니다.' },
          { lessonId: 'm6-l2', evidence: '물건값을 더하고 계산기로 검산한 뒤 영수증과 거스름돈을 확인합니다.' },
        ],
        guidanceNote: 'AI 추천 여부와 별개로 학생이 실제 금액을 읽고 계산·검산·선택한 수행을 기록합니다.',
      },
    ],
  },
  {
    subject: '사회',
    subjectCode: '사회',
    badgeColor: 'bg-sky-900 text-sky-200 border-sky-700',
    description: '학생 자신의 선택과 그 선택을 존중하는 수행이 분명한 차시에 연결합니다.',
    standards: [
      {
        code: '[6사회01-02]',
        statement: '일상생활에서 활동이나 물건을 선택하고 나의 선택을 중요하게 여기는 태도를 기른다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm1-l10', evidence: 'AI 음악 결과를 쓰기·고치기·안 쓰기 중에서 스스로 고릅니다.' },
          { lessonId: 'm6-l1', evidence: '예산과 필요를 근거로 장볼 물건을 직접 선택합니다.' },
          { lessonId: 'm6-l7', evidence: 'AI 일정에서 자신의 휴식과 도움 필요를 반영해 하루 계획을 고칩니다.' },
        ],
        guidanceNote: 'AI가 추천한 선택이 아니라 학생이 최종 결정하고 그 결정을 존중받았는지를 봅니다.',
      },
    ],
  },
  {
    subject: '진로와 직업',
    subjectCode: '진로',
    badgeColor: 'bg-purple-900 text-purple-200 border-purple-700',
    description: '실제 직업 자료·직업인 탐색과 이동 계획 수행을 구분해 연결합니다.',
    standards: [
      {
        code: '[9진로02-02]',
        statement: '직업의 세계에 관심을 가지고 가족, 이웃 등 주변 사람들의 직업에 대하여 탐색한다.',
        alignment: 'direct',
        lessonLinks: [
          { lessonId: 'm6-l10', evidence: '마을 사서의 실제 설명과 공식 자료를 AI 예상과 비교하며 주변 직업을 탐색합니다.' },
        ],
        guidanceNote: 'AI가 만든 직업 소개만으로 끝내지 않고 실제 사람 또는 공식 자료와 비교합니다.',
      },
      {
        code: '[12진로04-03]',
        statement: '집에서 직장까지 교통 수단을 활용하여 이동한다.',
        alignment: 'supporting',
        lessonLinks: [
          { lessonId: 'm6-l3', evidence: '연습 지도에서 출발점·목적지와 표지를 대조해 안전한 경로를 고릅니다.' },
          { lessonId: 'm6-l4', evidence: '버스 번호·방향·정류장·오늘 공지를 확인하고 탑승 전 도움을 요청합니다.' },
        ],
        guidanceNote: '앱 안의 지도·버스 연습은 실제 집에서 직장까지 이동한 수행이 아니므로 사전 연습 근거로만 사용합니다.',
      },
    ],
  },
  {
    subject: '보건',
    subjectCode: '보건',
    badgeColor: 'bg-rose-900 text-rose-200 border-rose-700',
    description: '현재 수업에 명시적으로 들어 있는 안전 행동만 연결합니다.',
    standards: [
      {
        code: '[9보건04-03]',
        statement: '교통사고의 위험 요인을 알고 사고 예방을 위한 안전 수칙을 실천한다.',
        alignment: 'deferred',
        lessonLinks: [],
        guidanceNote: '교통 위험 요인과 예방 수칙 수행을 별도 활동으로 추가하기 전에는 연계 실적으로 기록하지 않습니다.',
        deferredReason: '현재 길 찾기와 버스 차시는 지도·노선 정보 확인이 중심이며, 횡단보도·신호·보행 중 스마트폰 같은 교통사고 위험 요인과 예방 행동을 직접 가르치지 않습니다.',
      },
    ],
  },
];

export const LINKED_STANDARDS_DATA: LinkedStandard[] = SUBJECTS.flatMap((subject) =>
  subject.standards.map((standard) => ({
    ...standard,
    subject: subject.subject,
    subjectCode: subject.subjectCode,
    badgeColor: subject.badgeColor,
    subjectDescription: subject.description,
  })),
);

export const LINKED_STANDARD_SUBJECTS = SUBJECTS.map(({ subject, subjectCode }) => ({ subject, subjectCode }));

export function getFilteredLinkedStandards(filter: LinkedStandardsFilter = {}): LinkedStandard[] {
  return LINKED_STANDARDS_DATA
    .filter((standard) => !filter.subjectCode || standard.subjectCode === filter.subjectCode)
    .filter((standard) => !filter.alignment || standard.alignment === filter.alignment)
    .map((standard) => {
      if (!filter.moduleId) return standard;
      return {
        ...standard,
        lessonLinks: standard.lessonLinks.filter((link) => link.lessonId.startsWith(`${filter.moduleId}-`)),
      };
    })
    .filter((standard) => !filter.moduleId || standard.lessonLinks.length > 0);
}
