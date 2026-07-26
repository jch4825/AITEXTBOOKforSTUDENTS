import type { ModuleId } from '../types';

export interface AchievementStandardItem {
  code: string;
  statement: string;
}

export interface ModuleStandardsMeta {
  moduleId: ModuleId;
  domainNumber: number;
  domainName: string;
  middleSchool: AchievementStandardItem[];
  highSchool: AchievementStandardItem[];
}

export const AI_ACHIEVEMENT_STANDARDS: Record<ModuleId, ModuleStandardsMeta> = {
  m1: {
    moduleId: 'm1',
    domainNumber: 1,
    domainName: '인공지능의 이해',
    middleSchool: [
      { code: '[9인지01-01]', statement: '인공지능이 사람이 준 정보를 바탕으로 대답을 만든다는 것을 안다.' },
      { code: '[9인지01-02]', statement: '인공지능의 대답을 실제 정보나 안내 자료와 비교하여 틀린 부분을 찾는다.' },
    ],
    highSchool: [
      { code: '[12인지01-01]', statement: '인공지능의 개념과 사람이 제공한 데이터를 바탕으로 결과를 생성하는 원리를 이해한다.' },
      { code: '[12인지01-02]', statement: '인공지능이 생성한 대답을 원본 자료와 대조하여 그럴듯한 거짓 정보(환각)를 찾아 수정한다.' },
    ],
  },
  m2: {
    moduleId: 'm2',
    domainNumber: 2,
    domainName: '인공지능 상호작용',
    middleSchool: [
      { code: '[9인지02-01]', statement: '인공지능에게 주는 낱말과 조건에 따라 대답이 달라짐을 안다.' },
      { code: '[9인지02-02]', statement: '원하는 대답을 얻기 위해 구체적인 이름과 조건을 더해 인공지능에게 다시 요청한다.' },
    ],
    highSchool: [
      { code: '[12인지02-01]', statement: '인공지능에게 제공하는 명칭·조건·예시 등 입력 정보의 구체성에 따라 결과가 달라짐을 이해한다.' },
      { code: '[12인지02-02]', statement: '인공지능으로부터 원하는 결과를 얻기 위해 과제를 단계별로 나누고 예시를 포함하여 프롬프트(요청)를 작성하고 수정한다.' },
    ],
  },
  m3: {
    moduleId: 'm3',
    domainNumber: 3,
    domainName: '인공지능 활용 학습',
    middleSchool: [
      { code: '[9인지03-01]', statement: '모르는 낱말이나 풀이를 인공지능에게 물어보고 나온 설명을 확인하여 정리한다.' },
      { code: '[9인지03-02]', statement: '인공지능의 도움을 받으면서도 스스로 문제를 풀어보려는 자세를 가진다.' },
    ],
    highSchool: [
      { code: '[12인지03-01]', statement: '학습 내용이나 낱말의 뜻을 인공지능에게 질문하여 설명을 얻고 이를 자신의 언어로 정리한다.' },
      { code: '[12인지03-02]', statement: '인공지능에 과도하게 의존하지 않고 주도적으로 탐구하며 공부하려는 태도를 가진다.' },
    ],
  },
  m4: {
    moduleId: 'm4',
    domainNumber: 4,
    domainName: '인공지능 안전과 윤리',
    middleSchool: [
      { code: '[9인지04-01]', statement: '사진이나 글을 인공지능에 이용할 때 개인정보를 찾아 가리고 위험한 요청이 오면 멈춘 뒤 알린다.' },
      { code: '[9인지04-02]', statement: '인공지능을 활용할 때 개인정보를 보호하고 정해진 시간 동안 바르게 사용하려는 마음을 가진다.' },
    ],
    highSchool: [
      { code: '[12인지04-01]', statement: '인공지능 활용 사진이나 글에서 개인식별 단서를 찾아 가리고 출처와 날짜를 대조하여 안전하게 사용한다.' },
      { code: '[12인지04-02]', statement: '인공지능 활용 시 타인과 나의 정보를 보호하고 미디어 이용 시간을 스스로 조절하며 윤리적으로 사용하려는 태도를 가진다.' },
    ],
  },
  m5: {
    moduleId: 'm5',
    domainNumber: 5,
    domainName: '인공지능과 문제 해결',
    middleSchool: [
      { code: '[9인지05-01]', statement: '인공지능 문제 해결에서 지금 상황과 이루고 싶은 목표의 차이를 파악한다.' },
      { code: '[9인지05-02]', statement: '인공지능 문제 해결 목표를 위해 필요한 순서를 정하고 힌트를 받아 틀린 부분을 고쳐 본다.' },
    ],
    highSchool: [
      { code: '[12인지05-01]', statement: '인공지능 기반 문제 해결을 위해 현재 상태와 목표 상태를 비교하여 문제를 정의하고 절차의 개념을 이해한다.' },
      { code: '[12인지05-02]', statement: '인공지능 과제를 작은 하위 단위로 나누어 우선순위를 정하고 힌트를 활용해 오답과 오류를 수정한다.' },
    ],
  },
  m6: {
    moduleId: 'm6',
    domainNumber: 6,
    domainName: '인공지능과 일상생활',
    middleSchool: [
      { code: '[9인지06-01]', statement: '인공지능이나 기기를 이용하여 필요한 정보(날씨·일정)를 찾아 확인한다.' },
      { code: '[9인지06-02]', statement: '일상생활에서 인공지능을 스스로 활용하여 생활하려는 마음을 가진다.' },
    ],
    highSchool: [
      { code: '[12인지06-01]', statement: '생활 속 인공지능 도구를 활용하여 일정·이동·식단을 관리하고 오류 발생 시 대안을 적용한다.' },
      { code: '[12인지06-02]', statement: '인공지능을 주체적으로 활용하여 독립적인 일상생활과 지역사회 자립을 이루려는 태도를 가진다.' },
    ],
  },
};
