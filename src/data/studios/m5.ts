import type { StudioDefinition, SupportLevel, VisualNovelCopy } from '../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES } from './shared';

const PREPARED_PROBLEM_NOTE =
  '화면의 AI 의견과 실행 결과는 실제 연결이나 실제 기기 조작이 아니라 수업용 연습 예시입니다. 중요한 정보는 원래 자료·체크리스트·사람과 확인하고, 안전 조건이 바뀌면 실행을 멈춘 뒤 믿을 만한 어른과 계획을 다시 정합니다.';

function sceneCopy(
  full: string,
  light: string,
  challenge: string,
  perspective?: string,
): Record<SupportLevel, VisualNovelCopy> {
  return {
    full: { text: full, perspective },
    light: { text: light, perspective },
    challenge: { text: challenge, perspective },
  };
}

export const M5_STUDIOS: StudioDefinition[] = [
  {
    id: 'm5-problem-definition-map',
    lessonId: 'm5-l1',
    moduleId: 'm5',
    title: '문제를 정확히 찾기',
    subtitle: '배송 지연 상황에서 현재·목표·모르는 정보·도움을 나누어 봐요.',
    visualNovel: {
      title: '물품이 오지 않은 빈 설치 공간',
      objective: '오늘은 현재 상황과 원하는 모습을 비교하고 문제·모르는 정보·도움을 나누어 적어 봐요.',
      scenes: [
        {
          id: 'm5-l1-empty-space',
          label: '빈 설치 공간',
          imageSrc: '/lessons/story/m5/m5-l1-scene-01.webp',
          alt: '체험회 부스 설치 공간에 필요한 물품이 도착하지 않은 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회 전날, 부스 책상과 안내판이 도착하지 않아 설치 공간이 비어 있었습니다. 진우는 “행사를 못 해”라고 말했습니다.',
            '필요한 물품이 오지 않아 부스를 설치하지 못했어요.',
            '막막한 감정과 해결할 문제를 구분하면 현재 상태를 관찰 가능한 사실로 바꿀 수 있습니다.',
            '진우는 답답했지만 무엇을 알고 무엇을 모르는지부터 살펴보기로 했습니다.',
          ),
        },
        {
          id: 'm5-l1-current-goal',
          label: '현재와 목표',
          imageSrc: '/lessons/story/m5/m5-l1-scene-02.webp',
          alt: '빈 공간인 현재와 오후까지 기본 설치를 마친 목표가 나란히 놓인 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '현재는 물품이 없고, 목표는 오후 3시까지 기본 부스 설치를 마치는 것이었습니다.',
            '지금 모습과 원하는 모습을 한 문장씩 적었어요.',
            '문제 정의는 현재와 목표의 차이를 구체적인 상태와 시점으로 표현하는 일입니다.',
            '진우는 “행사를 못 한다”보다 “설치 물품 도착 시각을 몰라 시작 순서를 정하지 못한다”가 더 정확하다고 느꼈습니다.',
          ),
        },
        {
          id: 'm5-l1-information',
          label: '정보 확인',
          imageSrc: '/lessons/story/m5/m5-l1-scene-03.webp',
          alt: '배송 공지 행사 시간표 먼저 할 수 있는 작업 카드가 펼쳐진 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '배송 공지에는 새 도착 예정 시간이 있었고, 행사 시간표에는 지금 할 수 있는 안내문 점검 작업이 있었습니다.',
            '배송 시간과 먼저 할 수 있는 일을 확인했어요.',
            '해결책을 선택하기 전 확인 가능한 정보와 아직 모르는 정보, 다른 사람의 도움이 필요한 판단을 구분합니다.',
            '윤아는 바로 새 물건을 사자는 제안보다 배송 담당자와 시간을 확인하는 편이 먼저라고 보았습니다.',
          ),
        },
        {
          id: 'm5-l1-definition-card',
          label: '문제 정의',
          imageSrc: '/lessons/story/m5/m5-l1-scene-04.webp',
          alt: '현재 목표 정보 행동이 연결된 문제 정의 카드 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '두 학생은 현재, 목표, 확인할 정보, 지금 가능한 행동을 카드에 연결하고 배송 확인 뒤 설치 순서를 정하기로 했습니다.',
            '문제와 모르는 정보, 필요한 도움, 다음 행동을 나눴어요.',
            '좋은 문제 정의는 특정 해결책을 미리 정하지 않고 여러 실행 가능한 방법을 비교할 여지를 남깁니다.',
            '진우는 문제를 정확히 말하니 막막함이 다음 행동으로 바뀌는 것을 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '문제는 현재와 목표의 차이예요',
          core: '지금 상태와 원하는 상태를 관찰 가능한 말로 나눕니다.',
          detail: {
            full: '지금과 원하는 모습을 한 장씩 골라요.',
            light: '누가 언제 무엇을 원하는지 더합니다.',
            challenge: '느낌과 지금 모습을 나누어 적으면 무엇을 해결할지 더 분명해집니다.',
          },
        },
        {
          title: '아는 것과 모르는 것을 나눠요',
          core: '해결 전에 확인해야 할 정보를 따로 표시합니다.',
          detail: {
            full: '이미 아는 시간과 아직 모르는 시간을 찾아요.',
            light: '공지와 시간표에서 확인 가능한 내용을 골라요.',
            challenge: '정보 격차를 명시하면 성급한 해결책 선택과 불필요한 비용을 줄일 수 있습니다.',
          },
          flow: { input: '현재·목표', process: '정보·도움 구분', output: '문제 정의' },
        },
        {
          title: '지금 할 행동을 정해요',
          core: '확인, 대체 작업, 도움 요청 중 다음 행동을 고릅니다.',
          detail: {
            full: '지금 바로 할 수 있는 일을 골라요.',
            light: '정보 확인 뒤 가능한 해결 방법을 비교합니다.',
            challenge: '문제 정의와 해결책 생성을 분리해야 새로운 정보에 따라 방법을 바꿀 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '“행사를 못 해”가 정확한 문제일까',
      description: '배송 지연 상황의 현재와 목표, 모르는 정보, 지금 가능한 행동을 구분해야 합니다.',
      facts: [
        '부스 책상과 안내판이 아직 도착하지 않았습니다.',
        '기본 설치 목표 시각은 오후 3시입니다.',
        '새 배송 예정 시각은 아직 확인하지 않았습니다.',
        '안내문 점검은 물품 없이 먼저 할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '문제를 더 정확히 정의하는 행동을 골라 보세요.',
      choices: [
        { id: 'buy-immediately', emoji: '🛒', label: '배송을 확인하지 않고 같은 물품을 바로 다시 사요.' },
        { id: 'define-gap', emoji: '🗺️', label: '현재·목표·모르는 정보·지금 할 일을 나눠요.' },
        { id: 'cancel-event', emoji: '✋', label: '물품이 늦으니 행사를 모두 취소해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '현재와 목표의 차이, 아직 확인할 정보를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '배송 공지와 체험회 시간표, 먼저 할 수 있는 작업이 공개됩니다.',
      facts: [
        '배송은 오후 1시 30분 도착 예정입니다.',
        '기본 설치 목표는 오후 3시입니다.',
        '안내문과 이름표 점검은 지금 할 수 있습니다.',
        '도착이 다시 늦어지면 담당자에게 대체 방법을 물을 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '문제와 해결책을 분리하는 AI',
      text: '바로 다시 사기 전에 배송 예정 시각을 확인할 수 있습니다. 현재는 물품이 없고 목표는 오후 3시 설치 완료이므로, 지금은 안내문을 점검하고 도착 뒤 설치 순서를 정하는 방법이 있습니다.',
      question: '문제, 모르는 정보, 필요한 도움은 각각 무엇인가요?',
    },
    artifact: {
      kind: 'review-sheet',
      title: '현재-목표-정보-행동 문제 정의 카드',
      prompt: '현재 상태, 목표, 아는 정보, 모르는 정보, 도움받을 사람, 지금 할 행동을 적어 보세요.',
    },
    transfer: {
      title: '준비물 한 개가 부족해요',
      description: '활동 시작 전 색종이 한 묶음이 부족합니다. 문제를 어떻게 정의하겠어요?',
      choices: [
        { id: 'blame-preparer', emoji: '📣', label: '누가 준비를 잘못했는지 먼저 찾아요.' },
        { id: 'check-missing-item', emoji: '🔎', label: '필요한 수량, 지금 수량, 다른 물건으로 바꿀 수 있는지 확인해요.' },
        { id: 'stop-all-work', emoji: '⛔', label: '준비물이 하나 부족하니 모든 활동을 멈춰요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-task-decomposition-board',
    lessonId: 'm5-l2',
    moduleId: 'm5',
    title: '큰 일을 작은 과제로 나누기',
    subtitle: '순서를 정하기 전에 부스에 필요한 과제를 빠짐없이 찾아봐요.',
    visualNovel: {
      title: '“부스를 설치해”라는 너무 큰 일',
      objective: '오늘은 큰 일에 필요한 작은 과제를 만들고 빠진 과제와 불필요한 과제를 찾아봐요.',
      scenes: [
        {
          id: 'm5-l2-large-task',
          label: '큰 부스',
          imageSrc: '/lessons/story/m5/m5-l2-scene-01.webp',
          alt: '진우가 빈 체험회 부스 앞에서 큰 설치 과제를 바라보는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우는 “체험회 부스를 설치해”라는 큰 일 앞에서 어디서 시작할지 몰랐습니다.',
            '부스 설치가 너무 큰 일처럼 보였어요.',
            '큰 목표를 실행 단위로 나누기 전에는 작업 범위와 누락을 파악하기 어렵습니다.',
            '진우는 순서를 서두르기보다 어떤 과제가 필요한지 먼저 찾기로 했습니다.',
          ),
        },
        {
          id: 'm5-l2-booth-plan',
          label: '완성 모습 보기',
          imageSrc: '/lessons/story/m5/m5-l2-scene-02.webp',
          alt: '안내판 책상 전원 자료 배치가 표시된 부스 구성도 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '부스 구성도에는 안내판, 책상, 전원 안전 확인, 체험 자료 배치가 보였습니다.',
            '완성 그림을 보고 필요한 작은 일을 찾았어요.',
            '분해는 완성 상태의 구성 요소와 역할을 기준으로 필요한 과제를 찾는 과정입니다.',
            '윤아는 아직 이 단계에서는 먼저 할 순서를 정하지 않는다고 설명했습니다.',
          ),
        },
        {
          id: 'm5-l2-gap-overlap',
          label: '누락과 중복',
          imageSrc: '/lessons/story/m5/m5-l2-scene-03.webp',
          alt: '과제 카드에서 빠진 전원 확인과 겹친 안내판 작업을 찾는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미 목록에는 전원 안전 확인이 빠졌고 안내판 붙이기는 두 번 들어 있었습니다. 행사와 관계없는 장식 구매도 섞여 있었습니다.',
            '빠진 일, 겹친 일, 필요 없는 일을 찾았어요.',
            '과제 목록은 누락, 중복, 범위 밖 활동을 검토해야 실제 목표를 빠짐없이 설명합니다.',
            '진우는 과제가 많아지는 것보다 필요한 일이 정확히 있는지가 중요하다고 보았습니다.',
          ),
        },
        {
          id: 'm5-l2-task-board',
          label: '분해 보드',
          imageSrc: '/lessons/story/m5/m5-l2-scene-04.webp',
          alt: '개인 역할과 공동 역할이 구분된 과제 분해 보드 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '두 학생은 안내판, 책상, 안전 확인, 자료 배치를 개인·공동 역할로 나눈 과제 보드를 완성했습니다.',
            '필요한 과제를 빠짐없이 보드에 놓았어요.',
            '과제 분해 결과는 순서표가 아니라 이후 순서와 역할을 정할 재료입니다.',
            '진우는 다음 차시에 이 과제들 사이의 앞뒤 관계를 찾기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '분해는 필요한 일을 찾는 단계예요',
          core: '큰 목표를 실행 가능한 작은 과제로 나눕니다.',
          detail: {
            full: '완성 그림에서 필요한 일을 골라요.',
            light: '한 사람이 할 일과 함께 할 일을 나눕니다.',
            challenge: '작은 일은 끝났는지 따로 확인할 수 있게 나눕니다.',
          },
        },
        {
          title: '순서는 아직 정하지 않아요',
          core: '무엇이 필요한지 찾은 뒤에 앞뒤 관계를 정합니다.',
          detail: {
            full: '과제 카드를 먼저 모두 모아요.',
            light: '분해와 순서 정하기를 다른 단계로 표시합니다.',
            challenge: '필요한 일을 찾는 단계와 순서를 정하는 단계를 나누면 빠진 일을 더 잘 볼 수 있습니다.',
          },
          flow: { input: '큰 목표', process: '과제 분해·검토', output: '과제 보드' },
        },
        {
          title: '빠짐·겹침·불필요를 확인해요',
          core: '목표와 구성도를 기준으로 목록을 검토합니다.',
          detail: {
            full: '같은 일과 빠진 일에 표시해요.',
            light: '목표와 관계없는 카드도 빼요.',
            challenge: '빠진 일, 겹친 일, 필요 없는 일을 함께 살펴봅니다.',
          },
        },
      ],
    },
    encounter: {
      title: '부스 설치에 어떤 과제가 필요할까',
      description: '순서를 정하기 전 완성 구성도에서 필요한 작은 과제를 찾아야 합니다.',
      facts: [
        '완성 부스에는 안내판, 책상, 전원, 체험 자료가 있습니다.',
        '진우의 첫 목록에는 안내판과 책상만 있습니다.',
        '전원은 성인과 안전 확인이 필요합니다.',
        '개인 역할과 함께 할 역할을 나눌 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '큰 일을 나누는 첫 행동을 골라 보세요.',
      choices: [
        { id: 'pick-random-order', emoji: '🔢', label: '과제가 무엇인지 보기 전에 순서부터 정해요.' },
        { id: 'list-needed-tasks', emoji: '🧩', label: '완성 모습을 보고 필요한 작은 과제를 모두 찾아요.' },
        { id: 'one-person-all', emoji: '🙋', label: '진우 혼자 부스 전체를 맡아요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '큰 목표에서 찾은 작은 과제를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '부스 구성도와 첫 과제 목록, 역할 조건이 공개됩니다.',
      facts: [
        '전원 안전 확인 과제가 빠져 있습니다.',
        '안내판 붙이기가 두 번 적혀 있습니다.',
        '새 장식 구매는 현재 목표에 필요하지 않습니다.',
        '전원 확인은 성인과 함께 해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '누락과 중복을 보여 주는 AI',
      text: '첫 목록에는 전원 안전 확인과 체험 자료 배치가 빠졌고 안내판 작업은 겹칩니다. 순서를 정하기 전에 필요한 과제를 한 번씩 모두 넣어야 합니다.',
      question: '과제 분해 보드에서 추가·합치기·삭제할 카드는 무엇인가요?',
    },
    artifact: {
      kind: 'workflow-plan',
      title: '과제 분해 보드',
      prompt: '큰 목표, 필요한 작은 과제, 빠진 과제, 겹친 과제, 불필요한 과제, 역할을 정리해 보세요.',
    },
    transfer: {
      title: '학급 발표 준비 나누기',
      description: '학급 발표라는 큰 일을 준비해야 합니다. 먼저 무엇을 하겠어요?',
      choices: [
        { id: 'start-slides-only', emoji: '🖥️', label: '필요한 일을 보지 않고 화면 자료부터 만들어요.' },
        { id: 'separate-presentation-tasks', emoji: '🧩', label: '내용·말하기·자료·장소 과제를 먼저 나눠요.' },
        { id: 'set-order-first', emoji: '🔢', label: '과제 목록 없이 1번부터 번호를 붙여요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-reasoned-sequence',
    lessonId: 'm5-l3',
    moduleId: 'm5',
    title: '이유가 있는 순서 만들기',
    subtitle: '선행 조건·안전·도구를 연결하고 모의 실행으로 막히는 지점을 고쳐 봐요.',
    visualNovel: {
      title: '장식을 먼저 붙이자 전원선이 막혔어요',
      objective: '오늘은 어떤 단계가 먼저 필요한지 살펴보고 이유가 있는 순서를 만들어 봐요.',
      scenes: [
        {
          id: 'm5-l3-blocked-install',
          label: '막힌 설치',
          imageSrc: '/lessons/story/m5/m5-l3-scene-01.webp',
          alt: '장식을 먼저 붙여 전원선을 안전하게 놓기 어려워진 모의 설치 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '부스 장식을 먼저 붙이자 전원선을 놓을 공간이 가려졌습니다. 실제 전기는 다루지 않고 모의 설치판에서 문제를 보았습니다.',
            '장식을 먼저 붙여 전원선 자리가 막혔어요.',
            '순서 오류는 뒤 단계가 필요로 하는 공간, 도구, 안전 조건을 앞 단계가 방해할 때 나타납니다.',
            '윤아는 외운 순서가 아니라 단계 사이의 이유를 찾으려 했습니다.',
          ),
        },
        {
          id: 'm5-l3-dependencies',
          label: '앞 단계 이유',
          imageSrc: '/lessons/story/m5/m5-l3-scene-02.webp',
          alt: '전원 안전 확인 책상 배치 장식 자료 배치 카드 사이에 이유 선을 잇는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '전원 안전 확인 뒤 책상을 놓고, 책상이 고정된 뒤 장식과 자료를 배치해야 하는 이유가 보였습니다.',
            '어떤 단계가 먼저 필요한지 이유를 찾았어요.',
            '선행 조건은 뒤 단계를 시작하기 전에 완료되어야 하는 상태이며 안전 조건은 편의보다 우선합니다.',
            '윤아는 장식과 자료 배치는 상황에 따라 순서를 바꿀 수도 있다고 보았습니다.',
          ),
        },
        {
          id: 'm5-l3-simulation',
          label: '모의 실행',
          imageSrc: '/lessons/story/m5/m5-l3-scene-03.webp',
          alt: '단계 카드를 모의 실행하며 막히는 지점에 표시하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미 추천 순서를 모의 실행하자 책상을 너무 일찍 고정해 안전 확인이 어려운 지점이 발견되었습니다.',
            '순서를 따라 해 보며 막히는 곳을 찾았어요.',
            '절차는 머릿속으로만 생각하지 않고, 안전한 연습으로 실제로 가능한지 확인합니다.',
            '윤아는 추천 순서를 그대로 따르지 않고 확인 결과로 고쳤습니다.',
          ),
        },
        {
          id: 'm5-l3-reason-lines',
          label: '절차표 완성',
          imageSrc: '/lessons/story/m5/m5-l3-scene-04.webp',
          alt: '단계 사이에 선행 조건과 안전 이유 연결선이 그려진 절차표 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '최종 절차표에는 각 단계와 “왜 먼저인가”가 연결되고 안전 확인 뒤에만 다음 문이 열렸습니다.',
            '순서와 그 이유를 함께 적었어요.',
            '이유 연결선이 있으면 도구나 공간 조건이 바뀔 때 고정된 순서를 재검토할 수 있습니다.',
            '윤아는 새 설치에서도 이유를 보고 순서를 판단하기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '순서는 앞 단계의 필요를 봐요',
          core: '뒤 단계가 시작되려면 먼저 끝나야 하는 일을 찾습니다.',
          detail: {
            full: '먼저 필요한 카드를 골라요.',
            light: '각 단계에 필요한 공간과 도구를 연결합니다.',
            challenge: '먼저 끝나야 다음으로 갈 수 있는 일을 찾으면 아무 순서와 이유 있는 순서를 구분할 수 있습니다.',
          },
        },
        {
          title: '안전 조건을 먼저 확인해요',
          core: '위험이 있는 단계는 성인 확인과 모의 자료를 사용합니다.',
          detail: {
            full: '안전 확인 카드를 맨 앞에 놓아요.',
            light: '실제 전기 대신 설치판으로 연습합니다.',
            challenge: '안전 게이트가 충족되지 않으면 효율과 장식 완성도보다 실행 중지가 우선입니다.',
          },
          flow: { input: '과제 카드', process: '선행·안전·도구 연결', output: '이유 있는 절차' },
        },
        {
          title: '모의 실행으로 순서를 고쳐요',
          core: '막히는 지점을 찾아 앞뒤 단계를 다시 배치합니다.',
          detail: {
            full: '단계 카드를 차례로 움직여 봐요.',
            light: '멈춘 지점의 원인을 찾아 순서를 바꿉니다.',
            challenge: '미리 해 보면 순서가 가능한지, 먼저 해야 할 일이 빠졌는지 알 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '장식부터 붙이는 순서는 왜 막혔을까',
      description: '선행 조건과 안전을 찾아 모의 설치판의 순서를 고쳐야 합니다.',
      facts: [
        '장식이 전원선 통로를 가렸습니다.',
        '실제 전기 작업은 하지 않습니다.',
        '전원 위치는 성인과 먼저 확인해야 합니다.',
        '책상 위치가 정해져야 장식 길이를 알 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '설치 순서를 정할 기준을 골라 보세요.',
      choices: [
        { id: 'prettiest-first', emoji: '✨', label: '가장 예쁜 장식을 먼저 놓아요.' },
        { id: 'dependencies-first', emoji: '🔗', label: '선행 조건과 안전 확인이 필요한 단계를 먼저 놓아요.' },
        { id: 'alphabetical', emoji: '🔤', label: '과제 이름의 가나다순으로 놓아요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '먼저 해야 할 단계와 그 이유를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '각 단계의 선행 조건, 안전 조건, 필요한 도구가 공개됩니다.',
      facts: [
        '전원 위치는 책상을 고정하기 전에 확인합니다.',
        '전원 확인은 성인과 모의 설치판에서 합니다.',
        '장식 길이는 책상 위치 뒤에 정할 수 있습니다.',
        '자료와 장식은 서로 방해하지 않으면 순서를 바꿀 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '절차를 모의 실행하는 AI',
      text: '제가 처음 추천한 책상 고정은 너무 빨랐습니다. 전원 위치 안전 확인 뒤 책상을 놓아야 통로를 막지 않습니다. 장식과 자료 배치는 조건에 따라 바꿀 수 있습니다.',
      question: '고정된 순서와 조건에 따라 바꿀 수 있는 순서를 어떻게 구분하나요?',
    },
    artifact: {
      kind: 'workflow-plan',
      title: '이유 연결선이 있는 절차표',
      prompt: '단계, 먼저 필요한 조건, 안전 확인, 도구, 모의 실행에서 고친 지점을 연결해 보세요.',
    },
    transfer: {
      title: '프로젝터 모의 설치 순서',
      description: '프로젝터를 실제로 조작하지 않고 설치 카드의 순서를 정합니다. 무엇을 먼저 확인하겠어요?',
      choices: [
        { id: 'turn-on-first', emoji: '🔌', label: '위치와 도움 없이 전원부터 켜요.' },
        { id: 'safe-projector-order', emoji: '🧑‍🏫', label: '성인 도움·안전한 위치·모의 순서를 먼저 확인해요.' },
        { id: 'decorate-projector', emoji: '🎀', label: '장식부터 붙이고 다음을 생각해요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-priority-criteria',
    lessonId: 'm5-l4',
    moduleId: 'm5',
    title: '무엇부터 할지 기준으로 정하기',
    subtitle: '안전·마감·영향·도움 가능성을 보고 먼저 할 일을 비교해 봐요.',
    visualNovel: {
      title: '세 가지 요청이 동시에 왔어요',
      objective: '오늘은 안전·마감·필요·도움 가능성을 보고 먼저 할 일을 정해 봐요.',
      scenes: [
        {
          id: 'm5-l4-three-jobs',
          label: '세 요청',
          imageSrc: '/lessons/story/m5/m5-l4-scene-01.webp',
          alt: '전원선 정리 포스터 수정 간식 배치 요청 카드가 동시에 도착한 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '전원선 통로 정리, 포스터 글자 수정, 간식 배치 요청이 동시에 들어왔습니다.',
            '세 가지 일이 한꺼번에 왔어요.',
            '먼저 할 일은 일의 이름이나 좋아하는 마음만으로 정하지 않습니다. 늦어질 때 생기는 문제와 위험을 비교합니다.',
            '진우는 무엇이든 하나를 고르기 전에 판단 기준이 필요하다고 느꼈습니다.',
          ),
        },
        {
          id: 'm5-l4-first-choice',
          label: '첫 선택',
          imageSrc: '/lessons/story/m5/m5-l4-scene-02.webp',
          alt: '진우가 하고 싶은 포스터 수정 카드를 먼저 고르는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '진우는 자신이 잘하는 포스터 수정부터 고르려 했습니다. 그러나 통로의 전원선은 사람이 걸릴 수 있었습니다.',
            '하고 싶은 일과 안전이 급한 일이 달랐어요.',
            '개인 선호는 기준 중 하나일 수 있지만 즉시 위험과 마감 영향보다 항상 앞서지는 않습니다.',
            '진우는 숙제나 놀이처럼 이름만 보고 정하는 활동과 다르다는 것을 알았습니다.',
          ),
        },
        {
          id: 'm5-l4-criteria-badges',
          label: '기준 배지',
          imageSrc: '/lessons/story/m5/m5-l4-scene-03.webp',
          alt: '세 작업 카드에 안전 마감 영향 도움 가능성 배지가 나타난 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '전원선에는 안전 배지, 포스터에는 가까운 마감, 간식에는 다른 친구의 도움 가능성이 표시되었습니다.',
            '안전, 시간, 영향, 도움 기준을 붙였어요.',
            '기준을 공개하면 서로 다른 타당한 순서가 어떤 조건에서 가능한지 설명할 수 있습니다.',
            '윤아는 통로를 안전하게 만들고 포스터를 수정하는 동안 친구가 간식을 배치하는 방법도 제안했습니다.',
          ),
        },
        {
          id: 'm5-l4-priority-table',
          label: '먼저 할 일 완성',
          imageSrc: '/lessons/story/m5/m5-l4-scene-04.webp',
          alt: '기준과 이유가 적힌 먼저 할 일 판단표 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '학생들은 전원선 안전 확인을 먼저 하고 역할을 나눠 나머지 일을 진행하는 순서와 이유를 기록했습니다.',
            '먼저 할 일과 함께 할 일을 기준으로 정했어요.',
            '먼저 할 일 표에는 한 사람이 차례로 할 일뿐 아니라 함께 도울 일과 먼저 끝나야 할 일도 들어갈 수 있습니다.',
            '진우는 조건이 바뀌면 같은 기준으로 순서를 다시 정하기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '일 이름보다 상황 기준을 봐요',
          core: '안전, 마감, 영향, 도움 가능성을 비교합니다.',
          detail: {
            full: '각 일에 맞는 기준 그림을 붙여요.',
            light: '미루면 생기는 결과를 비교합니다.',
            challenge: '먼저 할 일은 중요함, 시간, 위험, 먼저 필요한 일을 함께 보고 정합니다.',
          },
        },
        {
          title: '복수의 타당한 순서가 있어요',
          core: '조건과 역할에 따라 한 가지 이상 좋은 순서가 가능합니다.',
          detail: {
            full: '왜 먼저인지 말할 수 있는 순서를 골라요.',
            light: '친구 도움으로 함께 진행할 일도 찾습니다.',
            challenge: '동일한 기준에서도 지원 자원과 마감 관계에 따라 여러 최적해가 존재할 수 있습니다.',
          },
          flow: { input: '동시 요청', process: '기준·영향 비교', output: '이유 있는 순서' },
        },
        {
          title: '조건이 바뀌면 다시 정해요',
          core: '새 마감이나 도움 가능성이 생기면 먼저 할 일을 다시 정합니다.',
          detail: {
            full: '바뀐 카드에 새 기준을 붙여요.',
            light: '처음 순서를 고집하지 않고 이유를 다시 봅니다.',
            challenge: '먼저 할 일은 고정된 목록이 아닙니다. 새 조건이 생기면 다시 바꿀 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '세 일 중 무엇을 먼저 해야 할까',
      description: '안전, 마감, 영향, 도움 가능성을 확인해 먼저 할 일을 정해야 합니다.',
      facts: [
        '통로의 전원선은 사람이 걸릴 수 있습니다.',
        '포스터 수정 마감은 30분 뒤입니다.',
        '간식 배치는 다른 친구가 도울 수 있습니다.',
        '실제 전원 조작은 성인에게 알립니다.',
      ],
    },
    firstAttempt: {
      prompt: '첫 번째 우선 행동을 골라 보세요.',
      choices: [
        { id: 'favorite-first', emoji: '🎨', label: '내가 가장 좋아하는 포스터부터 해요.' },
        { id: 'safety-first', emoji: '🛡️', label: '통로 위험을 알리고 안전하게 정리하도록 도움을 받아요.' },
        { id: 'random-first', emoji: '🎲', label: '아무 카드나 뽑아 먼저 해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내가 사용한 안전·마감·영향·도움 기준을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '각 일의 위험, 마감, 다른 일에 미치는 영향, 도움 가능성이 공개됩니다.',
      facts: [
        '전원선 통로는 즉시 안전 조치가 필요합니다.',
        '포스터 수정은 30분 안에 마쳐야 합니다.',
        '간식 배치는 친구와 함께 할 수 있습니다.',
        '성인이 전원선 안전 조치를 지원합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '여러 타당한 순서를 비교하는 AI',
      text: '통로 위험을 먼저 알리고 성인과 안전 조치를 시작하는 동안 다른 친구가 간식을 배치할 수 있습니다. 진우는 마감이 가까운 포스터를 수정할 수 있습니다.',
      question: '한 사람이 모두 차례로 하는 방법과 역할을 나누는 방법은 어떻게 다른가요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '먼저 할 일 판단표',
      prompt: '일 세 가지, 안전·마감·영향·도움 기준, 먼저 할 일, 함께 할 일, 이유를 적어 보세요.',
    },
    transfer: {
      title: '학급 준비 일정이 바뀌었어요',
      description: '발표 마감이 앞당겨지고 친구 한 명이 도움을 줄 수 있게 됐습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'keep-old-order', emoji: '📌', label: '조건이 달라도 처음 순서를 그대로 지켜요.' },
        { id: 'recheck-criteria', emoji: '🔄', label: '새 마감과 도움 가능성으로 먼저 할 일을 다시 정해요.' },
        { id: 'only-easy-task', emoji: '🙂', label: '가장 쉬운 일만 계속해요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-adjustable-help',
    lessonId: 'm5-l5',
    moduleId: 'm5',
    title: '답 대신 필요한 만큼 도움받기',
    subtitle: '첫 시도를 남기고 작은 단서·과정 질문·부분 예시 중 필요한 도움을 골라봐요.',
    visualNovel: {
      title: '포스터 배치 퍼즐에서 막혔어요',
      objective: '오늘은 먼저 내 방법을 시도하고 필요한 힌트의 정도를 골라 답을 고쳐 봐요.',
      scenes: [
        {
          id: 'm5-l5-first-layout',
          label: '첫 배치',
          imageSrc: '/lessons/story/m5/m5-l5-scene-01.webp',
          alt: '진우가 포스터 제목 그림 안내 문장을 처음 배치한 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우는 제목, 그림, 안내 문장을 포스터에 먼저 배치했지만 글 한 부분이 잘 보이지 않았습니다.',
            '진우가 자기 방법으로 먼저 배치해 봤어요.',
            '첫 시도는 정답 전 단계가 아니라 이미 사용한 전략과 막힌 지점을 보여 주는 과정 증거입니다.',
            '진우는 완성 답을 보기 전에 자신의 생각을 더 이어 가고 싶었습니다.',
          ),
        },
        {
          id: 'm5-l5-help-levels',
          label: '도움 수준',
          imageSrc: '/lessons/story/m5/m5-l5-scene-02.webp',
          alt: '작은 단서 과정 질문 부분 예시 완성 답 도움 카드가 가림막 뒤에 놓인 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '작은 단서, 과정 질문, 부분 예시, 완성 답 카드가 나타났습니다. 도움의 양이 커질수록 학생이 결정할 부분은 줄었습니다.',
            '조금 돕기부터 완성 답까지 도움 크기가 달랐어요.',
            '도움 수준은 과제 난이도보다 현재 막힌 지점과 독립적 사고를 이어 갈 가능성에 맞춰 조절합니다.',
            '윤아는 필요한 만큼만 가림막을 열어도 된다고 말했습니다.',
          ),
        },
        {
          id: 'm5-l5-answer-vs-hint',
          label: '영향 비교',
          imageSrc: '/lessons/story/m5/m5-l5-scene-03.webp',
          alt: '완성 답을 본 뒤와 작은 힌트 뒤의 학생 수정 과정이 비교되는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '완성 답은 빠르게 끝났지만 첫 생각이 어디서 바뀌었는지 알기 어려웠습니다. 작은 단서는 진우가 여백 문제를 스스로 찾게 했습니다.',
            '완성 답과 작은 힌트가 내 생각에 주는 영향을 비교했어요.',
            '효율만이 아니라 전략 생성과 자기 수정의 기회를 기준으로 도움 수준을 선택합니다.',
            '진우는 막힌 부분 하나에만 도움을 받기로 했습니다.',
          ),
        },
        {
          id: 'm5-l5-revised-layout',
          label: '수정 결과',
          imageSrc: '/lessons/story/m5/m5-l5-scene-04.webp',
          alt: '첫 시도 힌트 수정 결과가 연결된 포스터 기록 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '진우는 “가장 먼저 읽어야 할 것은 무엇일까?”라는 과정 질문을 받고 제목과 안내문 간격을 스스로 고쳤습니다.',
            '힌트를 받고 내 방법으로 배치를 고쳤어요.',
            '도움 기록에는 첫 시도, 선택한 도움 수준, 도움 뒤 수정한 부분이 함께 남아야 합니다.',
            '진우는 다음 퍼즐에서도 필요한 도움의 크기를 직접 고르기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '첫 시도를 먼저 남겨요',
          core: '도움을 받기 전 내 방법과 막힌 지점을 기록합니다.',
          detail: {
            full: '내가 먼저 놓은 카드를 사진처럼 기억해요.',
            light: '잘된 부분과 막힌 부분을 나눕니다.',
            challenge: '첫 시도가 있어야 도움받은 뒤 내가 무엇을 고쳤는지 알 수 있습니다.',
          },
        },
        {
          title: '도움은 크기를 조절할 수 있어요',
          core: '작은 단서, 과정 질문, 부분 예시, 완성 답의 차이를 봅니다.',
          detail: {
            full: '지금 필요한 도움 카드를 골라요.',
            light: '더 생각할 수 있는 가장 작은 도움부터 시도합니다.',
            challenge: '최소 충분 지원은 과제 접근성을 확보하면서 의사결정 기회를 최대한 유지합니다.',
          },
          flow: { input: '첫 시도·막힌 지점', process: '도움 수준 선택', output: '자기 수정' },
        },
        {
          title: '도움 뒤 다시 시도해요',
          core: '힌트를 받은 뒤 결과를 직접 고치고 차이를 설명합니다.',
          detail: {
            full: '힌트로 바꾼 카드를 찾아요.',
            light: '답을 복사하지 않고 내 이유를 말합니다.',
            challenge: '도움은 정답을 받는 데서 끝나지 않습니다. 방법을 고치고 내 말로 설명해야 배움이 남습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '막혔을 때 완성 답부터 볼까',
      description: '포스터 첫 배치를 남기고 현재 막힌 부분에 맞는 도움 수준을 골라야 합니다.',
      facts: [
        '진우는 제목, 그림, 안내 문장을 먼저 배치했습니다.',
        '안내 문장의 한 부분이 잘 보이지 않습니다.',
        '제목과 그림 배치는 목적에 맞습니다.',
        '도움은 작은 단서부터 완성 답까지 고를 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '첫 시도 뒤 어떤 도움을 먼저 받겠어요?',
      choices: [
        { id: 'complete-answer', emoji: '📄', label: '완성된 포스터 답을 그대로 봐요.' },
        { id: 'small-hint', emoji: '💡', label: '막힌 부분을 찾는 작은 단서나 과정 질문을 골라요.' },
        { id: 'start-over', emoji: '🗑️', label: '잘된 부분도 모두 지우고 처음부터 해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '첫 시도에서 잘된 점, 막힌 점, 필요한 도움을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '네 가지 도움 수준과 각 도움 뒤 남는 학생 선택의 범위가 공개됩니다.',
      facts: [
        '작은 단서는 여백을 보라는 표시만 줍니다.',
        '과정 질문은 가장 먼저 읽을 부분을 묻습니다.',
        '부분 예시는 제목 한 칸만 보여 줍니다.',
        '완성 답은 모든 배치를 대신 결정합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '도움 수준별 영향을 보여 주는 AI',
      text: '완성 답은 빠르지만 진우가 바꿀 부분이 거의 없습니다. “가장 먼저 읽을 것은 무엇일까?”라는 과정 질문은 첫 배치를 유지하면서 간격을 다시 보게 합니다.',
      question: '지금 더 생각할 수 있게 하는 가장 작은 도움은 무엇인가요?',
    },
    artifact: {
      kind: 'review-sheet',
      title: '첫 시도-힌트-수정 결과 기록',
      prompt: '첫 시도, 막힌 지점, 고른 도움 수준, 힌트 내용, 수정한 결과와 이유를 적어 보세요.',
    },
    transfer: {
      title: '순서 퍼즐에서 도움받기',
      description: '단계 두 개의 앞뒤 관계에서 막혔습니다. 어떤 도움을 고르겠어요?',
      choices: [
        { id: 'show-full-order', emoji: '📋', label: '전체 순서 정답을 바로 보여 달라고 해요.' },
        { id: 'choose-process-question', emoji: '❔', label: '어떤 단계가 다음 단계에 필요한지 묻는 힌트를 골라요.' },
        { id: 'quit-puzzle', emoji: '🚪', label: '막혔으니 퍼즐을 끝내요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-safe-clarification',
    lessonId: 'm5-l6',
    moduleId: 'm5',
    title: 'AI가 다르게 알아들었을 때',
    subtitle: 'AI 추정과 빠진 정보를 찾고 개인정보 없이 안전한 위치 단서를 더해 봐요.',
    visualNovel: {
      title: '“도서관 앞 부스”가 다른 장소였어요',
      objective: '오늘은 AI가 추정한 내용과 내가 준 정보를 비교하고 개인정보 없이 필요한 단서를 더해 다시 요청해 봐요.',
      scenes: [
        {
          id: 'm5-l6-wrong-library',
          label: '다른 장소',
          imageSrc: '/lessons/story/m5/m5-l6-scene-01.webp',
          alt: '아이미가 학교 안 부스 대신 다른 도서관을 안내한 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우가 “도서관 앞 부스 알려 줘”라고 하자 아이미는 학교 밖 다른 도서관을 안내했습니다.',
            '아이미가 다른 도서관으로 안내했어요.',
            '짧은 요청에는 여러 가능한 해석이 있고 AI는 그중 하나를 추정할 수 있습니다.',
            '진우는 자기 탓으로 돌리거나 포기하지 않고 AI가 무엇을 추정했는지 살펴보았습니다.',
          ),
        },
        {
          id: 'm5-l6-request-assumption',
          label: '요청과 추정',
          imageSrc: '/lessons/story/m5/m5-l6-scene-02.webp',
          alt: '첫 요청과 아이미 추정 공식 배치도가 세 갈래로 비교되는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '첫 요청에는 어느 건물인지 없었고 아이미는 가장 가까운 공공 도서관을 추정했습니다. 학교 내부 배치도에는 2층 초록 표지 앞 부스가 있었습니다.',
            '요청에 빠진 정보와 AI가 짐작한 내용을 나눴어요.',
            '오해 분석은 학생 표현의 결함만 찾는 일이 아니라 모델의 가정과 자료의 한계를 함께 비교하는 과정입니다.',
            '윤아는 학교 이름이나 주소 없이도 내부 위치를 설명할 수 있다고 보았습니다.',
          ),
        },
        {
          id: 'm5-l6-safe-clues',
          label: '안전한 단서',
          imageSrc: '/lessons/story/m5/m5-l6-scene-03.webp',
          alt: '건물 안 2층 초록 표지 같은 안전한 위치 단서와 개인정보 제안이 비교되는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미는 학교명을 더하자고 했지만 학생들은 “현재 건물 안 2층, 초록 표지 앞”이라는 필요한 단서만 골랐습니다.',
            '개인정보 대신 건물 안 위치와 표지 색을 더했어요.',
            '명확화는 더 많은 정보를 주는 일이 아니라 목적에 필요한 비식별 단서를 선택하는 일입니다.',
            '진우는 안전한 단서로 요청을 고치고 공식 배치도와 다시 비교했습니다.',
          ),
        },
        {
          id: 'm5-l6-corrected-route',
          label: '수정 경로',
          imageSrc: '/lessons/story/m5/m5-l6-scene-04.webp',
          alt: '수정 요청과 공식 배치도 경로가 일치해 확인 표시가 생기는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '수정 요청은 학교 내부 2층 부스를 가리켰고, 학생들은 AI 경로를 그대로 따르지 않고 배치도와 안내판으로 확인했습니다.',
            '요청을 고치고 다른 자료로 경로를 확인했어요.',
            '명확한 요청과 결과 검증은 별도 단계입니다. 요청을 고쳐도 외부 자료 확인은 남습니다.',
            '진우는 오해를 함께 분석하면 더 안전하고 정확하게 고칠 수 있다고 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: 'AI의 추정과 내 정보를 비교해요',
          core: '요청에 없는 내용과 AI가 덧붙여 해석한 내용을 나눕니다.',
          detail: {
            full: '내가 말한 것과 AI가 짐작한 것을 골라요.',
            light: '여러 뜻이 가능한 말을 찾아요.',
            challenge: '오해를 입력 결함 하나로 환원하지 않고 모델 가정과 정보 부족의 상호작용으로 분석합니다.',
          },
        },
        {
          title: '안전한 단서만 더해요',
          core: '학교명·주소 대신 건물 안 위치, 층, 표지 같은 단서를 씁니다.',
          detail: {
            full: '필요한 위치 그림을 골라요.',
            light: '목적에 필요 없는 개인정보는 빼요.',
            challenge: '분명하게 말하되, 누군지 알 수 있는 정보는 빼고 안전한 단서만 고릅니다.',
          },
          flow: { input: '첫 요청·AI 추정', process: '안전한 단서 추가', output: '수정 요청·외부 확인' },
        },
        {
          title: '고친 결과도 밖에서 확인해요',
          core: '공식 배치도와 현장 안내판을 보고 최종 경로를 판단합니다.',
          detail: {
            full: '수정 답과 배치도를 나란히 봐요.',
            light: 'AI에게 다시 묻는 것만으로 끝내지 않습니다.',
            challenge: '요청을 분명히 고쳐도 답이 꼭 맞는 것은 아닙니다. 다른 자료로 다시 확인합니다.',
          },
        },
      ],
    },
    encounter: {
      title: 'AI가 다른 도서관을 고른 것은 누구 탓일까',
      description: '첫 요청, AI 추정, 공식 배치도를 비교해 필요한 안전 단서를 찾아야 합니다.',
      facts: [
        '첫 요청은 “도서관 앞 부스”입니다.',
        'AI는 학교 밖 공공 도서관을 추정했습니다.',
        '목표 장소는 현재 건물 안 2층입니다.',
        '초록 표지와 공식 배치도로 위치를 확인할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '요청을 안전하게 고치는 방법을 골라 보세요.',
      choices: [
        { id: 'add-school-address', emoji: '📍', label: '학교 이름과 자세한 주소를 모두 적어요.' },
        { id: 'safe-location-clues', emoji: '🟢', label: '현재 건물 안·2층·초록 표지처럼 필요한 단서만 더해요.' },
        { id: 'blame-student', emoji: '🙍', label: '내가 애매하게 말한 탓이라고만 생각해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: 'AI가 추정한 내용과 새로 더할 안전한 단서를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '첫 요청, AI 추정, 학교 내부 배치도가 함께 공개됩니다.',
      facts: [
        '도서관은 여러 장소를 뜻할 수 있습니다.',
        'AI는 가까운 공공 도서관을 임의로 골랐습니다.',
        '목표 부스는 현재 건물 2층 초록 표지 앞입니다.',
        '학교 이름과 주소는 내부 길 찾기에 필요하지 않습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '추정과 정보 부족을 나누는 AI',
      text: '첫 요청에는 건물과 층 정보가 없어 제가 공공 도서관을 추정했습니다. 학교명 대신 “현재 건물 안 2층 초록 표지 앞 부스”라고 고치고 공식 배치도로 확인할 수 있습니다.',
      question: '요청을 더 분명하게 하면서 개인정보를 줄이는 단서는 무엇인가요?',
    },
    artifact: {
      kind: 'repair-card',
      title: '요청 수정과 외부 확인 기록',
      prompt: '첫 요청, AI 추정, 빠진 정보, 안전하게 더한 단서, 수정 요청, 확인한 공식 자료를 적어 보세요.',
    },
    transfer: {
      title: '체육관 안 부스 찾기',
      description: '“체육관 부스”가 여러 곳을 뜻합니다. 어떻게 안전하게 고치겠어요?',
      choices: [
        { id: 'share-home-route', emoji: '🏠', label: '집에서 학교까지 오는 경로를 모두 알려요.' },
        { id: 'use-building-clues', emoji: '🏀', label: '현재 건물 안·입구 번호·부스 표지 색을 더해요.' },
        { id: 'repeat-same-request', emoji: '🔁', label: '같은 문장을 그대로 반복해요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-step-checkpoints',
    lessonId: 'm5-l7',
    moduleId: 'm5',
    title: '한 단계 실행하고 확인하기',
    subtitle: '긴 설치 안내를 한 단계씩 실행하고 체크포인트에서 결과를 확인해요.',
    visualNovel: {
      title: '한꺼번에 들은 긴 설치 안내',
      objective: '오늘은 한 단계를 부탁하고 끝났는지 확인한 뒤 다음 단계로 넘어가 봐요.',
      scenes: [
        {
          id: 'm5-l7-long-guide',
          label: '긴 안내',
          imageSrc: '/lessons/story/m5/m5-l7-scene-01.webp',
          alt: '체험회 기기 설치 순서가 한 화면에 길게 나타난 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미가 연결, 전원, 화면 선택, 소리 확인을 한꺼번에 안내했습니다. 윤아는 처음 두 단계는 기억했지만 중간 단계를 놓쳤습니다.',
            '긴 안내를 한꺼번에 들으니 중간 단계가 헷갈렸어요.',
            '긴 절차는 작업 기억에 부담을 주므로 실행 단위를 작게 자르고 단계마다 상태를 확인해야 합니다.',
            '윤아는 놓친 단계가 있어도 실패한 것이 아니라 확인 지점이 필요하다는 것을 알았습니다.',
          ),
        },
        {
          id: 'm5-l7-missed-step',
          label: '놓친 단계',
          imageSrc: '/lessons/story/m5/m5-l7-scene-02.webp',
          alt: '모의 설치판에서 가운데 단계가 비어 다음 단계가 진행되지 않는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '모의 설치판에서 전원 표시가 켜지지 않았는데도 다음 단계로 넘어가자 화면 확인 단계가 작동하지 않았습니다.',
            '앞 단계가 끝나지 않았는데 다음 단계로 갔어요.',
            '후속 단계가 선행 단계의 결과에 의존할 때 체크포인트는 오류가 퍼지는 것을 막습니다.',
          ),
        },
        {
          id: 'm5-l7-checkpoint-board',
          label: '체크포인트',
          imageSrc: '/lessons/story/m5/m5-l7-scene-03.webp',
          alt: '한 단계 실행과 확인 기준이 짝을 이룬 안전한 모의 설치판 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '학생들은 실제 기기 대신 모의 설치판을 사용했습니다. “전원 단추 누르기-초록 표시 확인”처럼 행동과 확인 기준을 한 쌍으로 만들었습니다.',
            '한 단계와 확인 방법을 한 쌍으로 만들었어요.',
            '체크포인트는 단순 완료 표시가 아니라 관찰 가능한 성공 기준을 포함해야 합니다.',
          ),
        },
        {
          id: 'm5-l7-step-dialogue',
          label: '단계별 대화',
          imageSrc: '/lessons/story/m5/m5-l7-scene-04.webp',
          alt: '학생이 한 단계씩 요청하고 확인 결과를 말한 뒤 다음 안내를 받는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아는 “첫 단계만 알려 줘”라고 요청하고, 끝난 뒤 “초록 표시를 확인했어”라고 말했습니다. 아이미는 확인된 결과를 바탕으로 다음 단계만 안내했습니다.',
            '한 단계씩 부탁하고 끝났는지 확인했어요.',
            '요청-실행-관찰-보고-다음 요청의 짧은 주기는 긴 절차의 오류 위치를 추적 가능하게 만듭니다.',
            '윤아는 천천히 확인하는 것이 뒤처지는 일이 아니라 정확하게 해결하는 방법이라고 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '한 번에 한 단계만 실행해요',
          core: '긴 안내를 작은 실행 단위로 나누고 현재 단계에 집중합니다.',
          detail: {
            full: '지금 할 한 단계만 골라요.',
            light: '여러 단계를 한꺼번에 하지 않아요.',
            challenge: '앞 단계가 필요한 일은 더 작은 단계로 나누어 어디서 틀렸는지 찾기 쉽게 합니다.',
          },
        },
        {
          title: '끝났다는 증거를 확인해요',
          core: '단추를 눌렀다는 행동뿐 아니라 표시, 화면, 체크 카드 같은 결과를 봅니다.',
          detail: {
            full: '행동 뒤에 무엇이 보여야 하는지 찾아요.',
            light: '완료 표시를 눈으로 확인해요.',
            challenge: '각 단계마다 끝났는지 눈으로 확인할 기준을 붙입니다.',
          },
          flow: { input: '현재 단계', process: '실행·결과 확인', output: '다음 단계 요청' },
        },
        {
          title: '확인한 뒤 다음으로 가요',
          core: '결과가 다르면 멈추고 그 단계부터 다시 살핍니다.',
          detail: {
            full: '확인 결과를 말한 뒤 다음 안내를 받아요.',
            light: '다르면 다음으로 넘어가지 않아요.',
            challenge: '확인에 실패하면 다음으로 가지 않습니다. 마지막으로 맞았던 단계로 돌아갑니다.',
          },
        },
      ],
    },
    encounter: {
      title: '긴 설치 안내를 놓치지 않으려면',
      description: '실제 기기를 조작하지 않는 모의 설치판에서 한 단계와 확인 기준을 짝지어야 합니다.',
      facts: [
        '설치 안내는 네 단계로 이루어져 있습니다.',
        '두 번째 단계의 전원 표시가 아직 켜지지 않았습니다.',
        '세 번째 단계는 전원 표시가 켜져야 확인할 수 있습니다.',
        '모의 설치판의 표시 카드로 결과를 안전하게 확인할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '가장 정확하게 진행하는 방법을 골라 보세요.',
      choices: [
        { id: 'do-all-at-once', emoji: '⏩', label: '안내 전체를 듣고 기억나는 대로 한꺼번에 해요.' },
        { id: 'check-each-step', emoji: '✅', label: '한 단계를 실행하고 표시를 확인한 뒤 다음 단계를 물어요.' },
        { id: 'skip-confusing-step', emoji: '↪️', label: '헷갈리는 단계는 건너뛰고 마지막 단계로 가요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '첫 단계의 행동과 완료됐다는 증거를 함께 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '두 번째 단계의 완료 표시가 예상과 다르게 나타납니다.',
      facts: [
        '첫 번째 연결 표시는 확인되었습니다.',
        '두 번째 전원 표시는 아직 회색입니다.',
        '다음 단계는 초록 전원 표시가 있어야 시작할 수 있습니다.',
        '모의 설치판이므로 실제 전기 기기를 만질 필요가 없습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '단계별 확인을 돕는 AI',
      text: '지금은 두 번째 단계만 다시 살펴봐요. 모의 전원 카드를 올린 뒤 초록 표시가 보이는지 확인하고, 보이면 그 결과를 말해 주세요.',
      question: '다음 단계로 가기 전에 무엇을 보고 완료라고 판단할 수 있나요?',
    },
    artifact: {
      kind: 'workflow-plan',
      title: '체크포인트가 있는 단계별 대화',
      prompt: '각 단계의 요청, 실행, 확인 기준, 실제 결과, 다음 행동을 순서대로 기록해 보세요.',
    },
    transfer: {
      title: '작품 파일 올리기',
      description: '파일 선택, 이름 확인, 올리기, 완료 확인이 필요한 상황입니다. 어떻게 진행하겠어요?',
      choices: [
        { id: 'upload-all-fast', emoji: '📤', label: '여러 파일을 한꺼번에 고르고 바로 끝났다고 생각해요.' },
        { id: 'upload-checkpoints', emoji: '🔎', label: '파일 이름과 완료 표시를 단계마다 확인해요.' },
        { id: 'skip-upload-check', emoji: '🙈', label: '완료 표시는 보지 않고 다음 활동으로 가요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-goal-result-verification',
    lessonId: 'm5-l8',
    moduleId: 'm5',
    title: '목표와 결과를 비교하기',
    subtitle: '처음 정한 조건과 완성 결과를 나란히 놓고 독립된 방법으로 확인해요.',
    visualNovel: {
      title: '한 가지가 빠진 완성 안내문',
      objective: '오늘은 처음 원한 조건과 결과를 나란히 보고 독립된 방법으로 확인해 봐요.',
      scenes: [
        {
          id: 'm5-l8-finished-guide',
          label: '완성처럼 보이는 안내문',
          imageSrc: '/lessons/story/m5/m5-l8-scene-01.webp',
          alt: '제목과 장소가 잘 보이지만 시작 시간이 빠진 체험회 안내문 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미가 만든 안내문에는 제목과 장소가 또렷하게 보였습니다. 모두 완성된 것처럼 느꼈지만 시작 시간은 적혀 있지 않았습니다.',
            '안내문은 멋져 보였지만 시작 시간이 빠졌어요.',
            '표면적 완성도는 요구 조건 충족과 다릅니다. 결과를 평가하려면 최초 기준을 다시 불러와야 합니다.',
          ),
        },
        {
          id: 'm5-l8-original-conditions',
          label: '처음 정한 조건',
          imageSrc: '/lessons/story/m5/m5-l8-scene-02.webp',
          alt: '제목 장소 시작 시간 세 가지 조건이 적힌 원래 요청 카드 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '처음 요청 카드에는 “AI 체험회, 도서관 앞, 오전 10시 시작”이라는 세 조건이 있었습니다.',
            '처음 조건은 제목, 장소, 시작 시간이었어요.',
            '검토 기준은 결과를 본 뒤 새로 만드는 것이 아니라 과제 시작 전에 합의한 조건에서 가져옵니다.',
          ),
        },
        {
          id: 'm5-l8-independent-check',
          label: '독립 확인',
          imageSrc: '/lessons/story/m5/m5-l8-scene-03.webp',
          alt: 'AI의 완성 의견 옆에서 학생이 원래 조건 체크리스트로 결과를 확인하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미는 “완성했어요”라고 말했지만, 학생들은 같은 말을 다시 묻지 않고 원래 조건 체크리스트에 직접 표시했습니다.',
            'AI의 말 대신 처음 조건표로 직접 확인했어요.',
            '답을 만든 쪽의 “맞다”는 말만으로는 충분하지 않습니다. 원래 자료나 다른 도구로 한 번 더 확인해야 합니다.',
          ),
        },
        {
          id: 'm5-l8-corrected-result',
          label: '조건을 채운 결과',
          imageSrc: '/lessons/story/m5/m5-l8-scene-04.webp',
          alt: '시작 시간이 추가되고 세 조건 모두 확인 표시가 된 안내문 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '빠진 시작 시간을 추가한 뒤 학생들은 제목, 장소, 시간을 다시 비교했습니다. 세 조건이 모두 맞아야 비로소 완료 표시를 했습니다.',
            '빠진 시간을 고치고 세 조건을 다시 확인했어요.',
            '고친 뒤에는 고친 부분만 보지 않고 전체 조건을 다시 확인해야 새로 빠진 점을 찾을 수 있습니다.',
            '민준쌤은 결과를 의심하는 것이 아니라 약속한 목표를 지키는 확인이라고 설명했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '처음 목표를 다시 펼쳐요',
          core: '완성 결과를 보기 전에 정한 조건을 검토 기준으로 사용합니다.',
          detail: {
            full: '처음 필요하다고 적은 것을 찾아요.',
            light: '결과와 목표를 나란히 놓아요.',
            challenge: '끝난 뒤 느낌만 보지 않습니다. 처음 정한 조건을 다시 꺼내 봅니다.',
          },
        },
        {
          title: '같음·빠짐·다름을 표시해요',
          core: '조건마다 결과가 맞는지 하나씩 확인합니다.',
          detail: {
            full: '맞는 것과 빠진 것을 표시해요.',
            light: '조건을 한 줄씩 확인해요.',
            challenge: '조건마다 결과에서 확인한 부분을 표에 적습니다.',
          },
          flow: { input: '처음 목표·완성 결과', process: '조건별 독립 확인', output: '수정·완료 판단' },
        },
        {
          title: '다른 방법으로 확인해요',
          core: '원래 카드, 계산기, 체크리스트, 사람의 확인처럼 결과 생성과 다른 근거를 씁니다.',
          detail: {
            full: '확인에 쓸 다른 자료를 골라요.',
            light: 'AI에게 같은 질문만 반복하지 않아요.',
            challenge: '같은 실수가 또 맞다고 넘어가지 않게 다른 자료로 확인합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '보기 좋은 안내문은 정말 완성일까',
      description: '원래 요청 카드와 결과를 조건별로 비교하고 빠진 정보를 찾아야 합니다.',
      facts: [
        '원래 조건은 제목, 장소, 시작 시간입니다.',
        '결과에는 제목과 장소가 있습니다.',
        '결과에는 시작 시간이 없습니다.',
        'AI의 “완성” 의견과 별도로 원래 조건표를 확인할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '완료 여부를 가장 잘 확인하는 방법을 골라 보세요.',
      choices: [
        { id: 'trust-finished-message', emoji: '💬', label: 'AI가 완성했다고 했으니 바로 사용해요.' },
        { id: 'use-checklist', emoji: '📋', label: '처음 조건표와 결과를 한 줄씩 나란히 확인해요.' },
        { id: 'judge-by-look', emoji: '✨', label: '보기 좋으면 필요한 내용도 모두 있다고 생각해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '처음 조건 중 결과에 있는 것과 빠진 것을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '시작 시간이 빠졌다는 사실과 원래 요청 카드가 공개됩니다.',
      facts: [
        '제목 “AI 체험회”는 결과와 같습니다.',
        '장소 “도서관 앞”은 결과와 같습니다.',
        '시작 시간 “오전 10시”는 결과에 없습니다.',
        '수정 뒤 세 조건 전체를 다시 확인해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '목표와 결과 비교를 돕는 AI',
      text: '제가 완성했다고 말했지만 원래 조건표와 비교하면 시작 시간이 빠졌습니다. 시간을 추가한 뒤 제목, 장소, 시간 세 항목을 모두 다시 확인해 주세요.',
      question: '결과를 만든 AI의 말과 별도로 어떤 자료를 확인 근거로 사용할 수 있나요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '목표-결과 검토표',
      prompt: '처음 조건, 결과에서 찾은 증거, 맞음·빠짐·다름, 수정 내용, 다시 확인한 방법을 적어 보세요.',
    },
    transfer: {
      title: '체험 인원 합계 확인',
      description: 'AI가 여러 모둠의 인원을 더해 합계를 제시했습니다. 어떻게 확인하겠어요?',
      choices: [
        { id: 'ask-ai-same-total', emoji: '🔁', label: '같은 AI에게 합계가 맞는지 다시 물어요.' },
        { id: 'calculator-check', emoji: '🧮', label: '원래 인원표를 보고 계산기나 직접 계산으로 확인해요.' },
        { id: 'choose-neat-number', emoji: '🎯', label: '보기 좋은 숫자를 맞는 답으로 골라요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-alternative-comparison',
    lessonId: 'm5-l9',
    moduleId: 'm5',
    title: '대안을 기준으로 비교하기',
    subtitle: '프린터를 쓸 수 없을 때 여러 방법을 만들고 같은 기준으로 비교해요.',
    visualNovel: {
      title: '멈춘 프린터와 세 가지 다른 길',
      objective: '오늘은 가능한 방법을 두 가지 이상 만들고 시간·안전·비용·도움 필요를 비교해 골라봐요.',
      scenes: [
        {
          id: 'm5-l9-printer-stopped',
          label: '멈춘 방법',
          imageSrc: '/lessons/story/m5/m5-l9-scene-01.webp',
          alt: '체험회 직전 프린터를 사용할 수 없어 안내문 출력이 멈춘 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회 안내문을 출력하려는 순간 프린터를 사용할 수 없다는 표시가 나타났습니다. 처음 방법만 붙잡으면 안내를 제때 준비하기 어려웠습니다.',
            '프린터를 쓸 수 없어 처음 방법이 멈췄어요.',
            '수단이 실패해도 목표는 남습니다. 목표와 방법을 분리하면 다른 실행 경로를 만들 수 있습니다.',
          ),
        },
        {
          id: 'm5-l9-three-options',
          label: '세 가지 대안',
          imageSrc: '/lessons/story/m5/m5-l9-scene-02.webp',
          alt: '손글씨 안내 다른 교실 프린터 화면 안내 세 가지 대안 카드 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '학생들은 굵은 펜으로 직접 쓰기, 허락받아 다른 교실 프린터 쓰기, 입구 화면에 띄우기라는 세 방법을 만들었습니다.',
            '손글씨, 다른 프린터, 화면 안내 방법을 만들었어요.',
            '대안 생성 단계에서는 평가를 잠시 미루고 목표를 달성할 수 있는 서로 다른 경로를 두 가지 이상 확보합니다.',
          ),
        },
        {
          id: 'm5-l9-criteria-table',
          label: '같은 기준',
          imageSrc: '/lessons/story/m5/m5-l9-scene-03.webp',
          alt: '시간 안전 비용 도움 필요 기준으로 세 대안을 비교하는 표 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '세 방법을 시간, 안전, 비용, 도움 필요 네 기준으로 같은 표에 놓자 각 방법의 장점과 어려움이 보였습니다.',
            '세 방법을 같은 네 기준으로 비교했어요.',
            '공통 기준을 적용하면 익숙함이나 첫인상 대신 상황에 맞는 근거로 선택할 수 있습니다.',
          ),
        },
        {
          id: 'm5-l9-context-choice',
          label: '상황에 맞는 선택',
          imageSrc: '/lessons/story/m5/m5-l9-scene-04.webp',
          alt: '남은 시간과 도움 가능성을 보고 화면 안내와 손글씨 안내를 고르는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '입구 화면을 바로 쓸 수 있고 손글씨 표지도 함께 만들 수 있어 두 방법을 조합했습니다. 다른 조건이라면 다른 선택도 맞을 수 있습니다.',
            '지금 조건에 맞는 방법을 골랐어요.',
            '대안 선택은 영구적인 정답이 아니라 현재 제약과 우선 기준에 따른 결정입니다. 필요하면 방법을 조합할 수도 있습니다.',
            '진우는 한 가지 방법이 막혀도 목표까지 가는 다른 길이 있다는 사실에 안심했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '목표와 처음 방법을 나눠요',
          core: '프린터 사용은 방법이고, 방문객에게 알리는 것이 목표입니다.',
          detail: {
            full: '꼭 이루어야 할 목표를 찾아요.',
            light: '막힌 방법 말고 목표를 봐요.',
            challenge: '해결 수단을 목적과 분리해 탐색 공간을 다시 엽니다.',
          },
        },
        {
          title: '대안을 두 가지 이상 만들어요',
          core: '서로 다른 도구와 도움 수준을 쓰는 방법을 만듭니다.',
          detail: {
            full: '할 수 있는 다른 방법을 찾아요.',
            light: '바로 평가하지 말고 먼저 여러 방법을 만들어요.',
            challenge: '표면만 다른 변형이 아니라 자원과 실행 경로가 구별되는 대안을 생성합니다.',
          },
          flow: { input: '목표·현재 조건', process: '대안 생성·공통 기준 비교', output: '근거 있는 선택' },
        },
        {
          title: '같은 기준으로 비교해요',
          core: '시간, 안전, 비용, 도움 필요를 대안마다 살펴봅니다.',
          detail: {
            full: '방법마다 네 기준에 표시해요.',
            light: '좋아 보이는 것 하나만 고르지 않아요.',
            challenge: '의사결정 행렬로 기준별 장단점과 현재 상황의 가중치를 명시합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '프린터가 멈춰도 안내 목표는 남아요',
      description: '세 대안을 만들고 시간·안전·비용·도움 필요 기준으로 비교해야 합니다.',
      facts: [
        '체험회 시작까지 20분이 남았습니다.',
        '굵은 펜과 큰 종이를 사용할 수 있습니다.',
        '입구 화면은 교사의 도움을 받아 바로 사용할 수 있습니다.',
        '다른 교실 프린터는 허락과 이동 시간이 필요합니다.',
      ],
    },
    firstAttempt: {
      prompt: '상황에 맞는 방법을 고르는 과정을 선택해 보세요.',
      choices: [
        { id: 'wait-for-printer', emoji: '🖨️', label: '처음 프린터가 다시 될 때까지 다른 방법 없이 기다려요.' },
        { id: 'compare-options', emoji: '⚖️', label: '여러 방법을 만들고 같은 기준으로 비교한 뒤 골라요.' },
        { id: 'pick-favorite-tool', emoji: '⭐', label: '평소 가장 좋아하는 도구만 보고 정해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '가능한 대안 두 가지와 비교할 기준을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '남은 시간, 사용할 수 있는 도구, 도움 가능성이 공개됩니다.',
      facts: [
        '체험회 시작까지 20분입니다.',
        '손글씨 재료는 바로 사용할 수 있습니다.',
        '입구 화면은 교사의 짧은 도움이 필요합니다.',
        '다른 교실 프린터는 이동과 허락에 시간이 듭니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '대안 비교를 돕는 AI',
      text: '손글씨 안내는 빠르고 비용이 적지만 읽기 쉽게 크게 써야 합니다. 입구 화면은 잘 보이지만 교사의 도움이 필요합니다. 다른 프린터는 깔끔하지만 시간이 더 걸립니다.',
      question: '지금 가장 중요한 기준은 무엇이며, 두 방법을 함께 쓰는 편이 더 나을까요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '대안 비교표',
      prompt: '목표, 가능한 대안, 시간·안전·비용·도움 필요 비교, 선택한 방법과 이유를 적어 보세요.',
    },
    transfer: {
      title: '입구 화면도 쓸 수 없을 때',
      description: '고른 화면 안내 방법을 갑자기 사용할 수 없습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'stop-all-guidance', emoji: '🛑', label: '화면을 못 쓰니 안내 자체를 포기해요.' },
        { id: 'switch-non-screen', emoji: '🪧', label: '손글씨 표지와 사람 안내처럼 화면이 필요 없는 대안을 다시 비교해요.' },
        { id: 'hide-screen-problem', emoji: '🙊', label: '화면이 안 된다는 사실을 알리지 않고 기다려요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-error-retest',
    lessonId: 'm5-l10',
    moduleId: 'm5',
    title: '오류를 찾아 다시 시험하기',
    subtitle: '안내 화면의 잘못된 단추 순서를 재현하고 고친 뒤 같은 조건에서 다시 시험해요.',
    visualNovel: {
      title: '방문객을 되돌려 보낸 잘못된 단추 순서',
      objective: '오늘은 잘못된 순서·요청·결과에서 오류를 찾아 고치고 다시 시험해 봐요.',
      scenes: [
        {
          id: 'm5-l10-wrong-route',
          label: '다른 화면으로 간 방문객',
          imageSrc: '/lessons/story/m5/m5-l10-scene-01.webp',
          alt: '안내 화면의 단추 순서를 따라간 방문객이 다른 메뉴에 도착한 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '방문객이 안내 카드대로 단추를 눌렀지만 체험 신청 화면이 아니라 처음 메뉴로 돌아왔습니다.',
            '안내대로 했는데 다른 화면이 나왔어요.',
            '예상과 실제 결과의 차이는 오류의 증거입니다. 사용자 탓으로 돌리기 전에 같은 조건을 재현해야 합니다.',
          ),
        },
        {
          id: 'm5-l10-reproduce',
          label: '같은 조건으로 재현',
          imageSrc: '/lessons/story/m5/m5-l10-scene-02.webp',
          alt: '학생들이 모의 화면에서 안내 카드와 같은 단추 순서를 천천히 다시 시험하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '학생들은 모의 화면을 처음 상태로 돌리고 안내 카드의 순서를 한 단계씩 다시 눌렀습니다. 세 번째 단추에서 같은 문제가 나타났습니다.',
            '같은 순서를 다시 시험하니 같은 곳에서 문제가 생겼어요.',
            '재현은 우연한 실패와 반복 가능한 오류를 구분하고 조사 범위를 좁힙니다.',
          ),
        },
        {
          id: 'm5-l10-locate-fix',
          label: '오류 위치와 수정',
          imageSrc: '/lessons/story/m5/m5-l10-scene-03.webp',
          alt: '실제 화면 순서와 안내 카드 순서를 비교해 뒤바뀐 두 단계를 고치는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '정상 경로 카드와 비교하자 세 번째와 네 번째 단추 순서가 바뀌어 있었습니다. 학생들은 그 부분만 고치고 수정 이유를 적었습니다.',
            '바뀐 두 단계를 찾아 순서를 고쳤어요.',
            '오류 위치를 특정한 뒤 최소한으로 수정하면 무엇이 결과를 바꾸었는지 설명하기 쉽습니다.',
          ),
        },
        {
          id: 'm5-l10-retest',
          label: '다시 시험',
          imageSrc: '/lessons/story/m5/m5-l10-scene-04.webp',
          alt: '수정된 안내를 처음부터 다른 학생이 시험해 목표 화면에 도착하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '수정한 사람뿐 아니라 처음 보는 친구도 안내를 처음부터 따라 했습니다. 두 번 모두 목표 화면에 도착한 뒤 안내 카드를 사용하기로 했습니다.',
            '고친 뒤 처음부터 다시 시험하고 다른 친구도 확인했어요.',
            '수정 후 재시험과 다른 사용자의 확인은 국소 수정이 전체 흐름에서 실제로 작동하는지 검증합니다.',
            '윤아는 오류를 찾는 일이 사람을 탓하는 것이 아니라 더 나은 안내를 만드는 과정이라고 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '예상과 실제 결과를 적어요',
          core: '어디까지는 같고 어디서부터 달라졌는지 표시합니다.',
          detail: {
            full: '원한 화면과 나온 화면을 비교해요.',
            light: '달라진 첫 지점을 찾아요.',
            challenge: '실패한 장면을 언제, 무엇을 했고, 무엇이 나와야 했는지로 나누어 적습니다.',
          },
        },
        {
          title: '같은 조건으로 다시 시험해요',
          core: '처음 상태에서 같은 순서를 따라 오류가 반복되는지 봅니다.',
          detail: {
            full: '한 단계씩 다시 따라가요.',
            light: '문제가 나온 단계를 표시해요.',
            challenge: '입력과 초기 상태를 통제해 결함의 재현 가능성을 확인합니다.',
          },
          flow: { input: '예상·실제 결과', process: '재현·오류 위치 수정', output: '재시험 기록' },
        },
        {
          title: '고친 뒤 처음부터 확인해요',
          core: '수정한 부분과 전체 흐름을 다시 시험하고 다른 사용자도 확인합니다.',
          detail: {
            full: '수정 전과 수정 후 결과를 적어요.',
            light: '한 번 성공했다고 바로 끝내지 않아요.',
            challenge: '고친 뒤에는 같은 조건으로 한 번, 다른 사람이 쓰는 조건으로 한 번 더 시험합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '어느 단계에서 안내가 달라졌을까',
      description: '모의 화면에서 안내 순서를 재현하고 오류 위치를 찾아 수정한 뒤 다시 시험해야 합니다.',
      facts: [
        '방문객은 안내 카드의 순서를 그대로 따랐습니다.',
        '세 번째 단추 뒤에 예상과 다른 화면이 나왔습니다.',
        '정상 경로 카드에는 세 번째와 네 번째 순서가 반대입니다.',
        '실제 서비스가 아닌 안전한 모의 화면에서 시험합니다.',
      ],
    },
    firstAttempt: {
      prompt: '오류를 가장 정확하게 찾는 방법을 골라 보세요.',
      choices: [
        { id: 'rewrite-everything', emoji: '🧹', label: '어디가 문제인지 보기 전에 안내 전체를 새로 써요.' },
        { id: 'reproduce-error', emoji: '🔬', label: '같은 조건으로 한 단계씩 다시 해 보고 달라지는 지점을 찾아요.' },
        { id: 'assume-user-mistake', emoji: '👤', label: '방문객이 잘못 눌렀다고 생각하고 안내는 그대로 둬요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '예상한 결과, 실제 결과, 처음 달라진 단계를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '정상 경로 카드와 문제를 재현한 단계 기록이 함께 공개됩니다.',
      facts: [
        '첫 번째와 두 번째 단계는 정상입니다.',
        '세 번째 단계 뒤에 다른 화면이 나옵니다.',
        '정상 경로는 세 번째와 네 번째 단추의 순서가 반대입니다.',
        '수정 뒤에는 처음 상태부터 전체를 다시 시험해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '오류 재현과 기록을 돕는 AI',
      text: '첫 두 단계는 예상과 같고 세 번째 뒤부터 달라집니다. 정상 경로와 비교해 뒤바뀐 두 단계를 고친 뒤, 처음 상태에서 전체 안내를 다시 시험해 보세요.',
      question: '수정이 실제로 해결되었다는 증거를 어떻게 남길 수 있나요?',
    },
    artifact: {
      kind: 'review-sheet',
      title: '오류 전후 테스트 기록',
      prompt: '예상 결과, 실제 결과, 재현 조건, 오류 위치, 수정 내용, 다시 시험한 결과를 적어 보세요.',
    },
    transfer: {
      title: '다른 친구에게도 통하는 안내',
      description: '수정한 사람은 성공했습니다. 다음 확인은 무엇이 좋을까요?',
      choices: [
        { id: 'declare-fixed-once', emoji: '1️⃣', label: '내가 한 번 성공했으니 모두에게 된다고 정해요.' },
        { id: 'test-other-user', emoji: '👥', label: '처음 보는 친구가 같은 안내로 성공하는지 확인해요.' },
        { id: 'remove-result-record', emoji: '🗑️', label: '수정 전후 기록을 지우고 성공만 적어요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
  {
    id: 'm5-condition-change-plan',
    lessonId: 'm5-l11',
    moduleId: 'm5',
    title: '조건이 바뀌면 계획도 바꾸기',
    subtitle: '준비물·도구·시간·안전 정보가 달라지면 멈추고 계획을 다시 세워요.',
    visualNovel: {
      title: '빠진 도구와 새로 확인된 알레르기 정보',
      objective: '오늘은 준비물·도구·시간·안전 조건이 바뀌었을 때 처음 계획을 멈추고 안전한 새 계획으로 고쳐 봐요.',
      scenes: [
        {
          id: 'm5-l11-original-plan',
          label: '처음 간식 계획',
          imageSrc: '/lessons/story/m5/m5-l11-scene-01.webp',
          alt: '실제 조리가 아닌 카드 활동으로 간식 준비 순서를 계획하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '학생들은 실제로 요리하지 않고 그림 카드로 체험회 간식 준비 순서를 계획했습니다. 처음 계획에는 필요한 도구와 안전 확인이 있다고 가정했습니다.',
            '그림 카드로 간식 준비 계획을 세웠어요.',
            '계획은 특정 자원과 안전 조건을 전제로 합니다. 실행 전에 전제가 현재도 맞는지 확인해야 합니다.',
          ),
        },
        {
          id: 'm5-l11-new-conditions',
          label: '바뀐 조건',
          imageSrc: '/lessons/story/m5/m5-l11-scene-02.webp',
          alt: '도구 없음 카드와 알레르기 정보 확인 필요 카드가 새로 놓이는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '준비 직전 필요한 도구 하나가 없고, 먹는 사람의 알레르기 정보를 아직 확인하지 않았다는 새 카드가 나타났습니다.',
            '도구가 없고 알레르기 정보도 확인되지 않았어요.',
            '자원 부족과 안전 정보 부재는 모두 계획을 중단하고 재평가해야 하는 조건 변화입니다.',
            '진우는 계획을 바꾸는 것이 실패가 아니라 모두를 안전하게 지키는 선택이라고 생각했습니다.',
          ),
        },
        {
          id: 'm5-l11-stop-compare',
          label: '멈추고 다시 비교',
          imageSrc: '/lessons/story/m5/m5-l11-scene-03.webp',
          alt: '처음 계획의 전제와 현재 조건을 나란히 비교하며 멈춤 표시를 놓는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '학생들은 계획 카드에 멈춤 표시를 놓고 “필요한 도구 있음-없음”, “안전 정보 확인-미확인”을 나란히 비교했습니다.',
            '계획을 멈추고 처음 조건과 지금 조건을 비교했어요.',
            '중단 기준을 명시하면 이미 시작했다는 이유로 위험한 계획을 계속하는 매몰 비용 오류를 줄일 수 있습니다.',
          ),
        },
        {
          id: 'm5-l11-revised-plan',
          label: '안전하게 고친 계획',
          imageSrc: '/lessons/story/m5/m5-l11-scene-04.webp',
          alt: '교사와 보호된 안전 정보를 확인한 뒤 조리 없는 대체 간식 안내 계획으로 고친 카드 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '학생들은 믿을 만한 어른에게 알레르기 정보를 확인하도록 요청하고, 확인 전에는 음식을 준비하지 않기로 했습니다. 조리 없는 대체 활동과 안내 카드 계획도 함께 만들었습니다.',
            '어른에게 안전 정보를 확인하고 조리 없는 다른 계획을 만들었어요.',
            '수정 계획은 대체 자원, 보류 조건, 책임 있는 확인 주체를 포함해야 합니다. 미확인 상태를 AI 추정으로 채우지 않습니다.',
            '민준쌤은 안전 정보가 확인될 때까지 실제 음식은 다루지 않는다고 다시 알려 주었습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '계획의 전제를 찾아요',
          core: '준비물, 도구, 시간, 안전 정보가 있어야 가능한 단계를 표시합니다.',
          detail: {
            full: '계획에 꼭 필요한 조건을 찾아요.',
            light: '시작 전에 조건 카드를 확인해요.',
            challenge: '각 단계가 의존하는 자원과 안전 전제를 명시해 변경 영향을 추적합니다.',
          },
        },
        {
          title: '중요한 조건이 바뀌면 멈춰요',
          core: '도구가 없거나 안전 정보가 확인되지 않으면 처음 계획을 계속하지 않습니다.',
          detail: {
            full: '멈춤이 필요한 조건을 골라요.',
            light: '안전이 불확실하면 어른에게 알려요.',
            challenge: '실행 중단 기준과 재계획 트리거를 사전에 정의합니다.',
          },
          flow: { input: '처음 계획·새 조건', process: '멈춤·영향 비교·도움 요청', output: '안전한 수정 계획' },
        },
        {
          title: '대체·도움·확인을 넣어 고쳐요',
          core: '할 수 있는 다른 방법과 믿을 만한 사람의 확인을 새 계획에 넣습니다.',
          detail: {
            full: '바꿀 단계와 도움받을 사람을 적어요.',
            light: '확인 전에는 실제 음식을 다루지 않아요.',
            challenge: '다른 방법과 확인할 사람을 정합니다. 위험이 확인되기 전에는 실행을 멈춥니다.',
          },
        },
      ],
    },
    encounter: {
      title: '처음 계획을 그대로 계속해도 될까',
      description: '카드 활동에서 빠진 도구와 미확인 안전 정보를 발견하고 새 계획을 만들어야 합니다.',
      facts: [
        '활동은 실제 조리가 아닌 그림 카드 계획입니다.',
        '처음 계획에 필요한 도구 하나가 없습니다.',
        '먹는 사람의 알레르기 정보가 확인되지 않았습니다.',
        '안전 정보는 AI가 추정하지 않고 믿을 만한 어른이 확인해야 합니다.',
      ],
    },
    firstAttempt: {
      prompt: '새 조건을 알게 되었을 때 가장 안전한 방법을 골라 보세요.',
      choices: [
        { id: 'continue-original-plan', emoji: '▶️', label: '이미 만든 계획이니 새 정보를 빼고 그대로 계속해요.' },
        { id: 'stop-and-replan', emoji: '🛑', label: '멈추고 안전 정보를 어른과 확인하며 대체 계획을 만들어요.' },
        { id: 'ask-ai-to-guess-allergy', emoji: '🎲', label: 'AI에게 알레르기가 없을 것이라고 추정해 달라고 해요.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '바뀐 조건, 멈춰야 하는 이유, 도움받을 사람을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '준비물 목록과 안전 확인표에 새로운 조건 두 가지가 표시됩니다.',
      facts: [
        '필요한 도구 하나를 지금 사용할 수 없습니다.',
        '알레르기 정보는 아직 확인되지 않았습니다.',
        '확인 전에는 실제 음식을 준비하지 않습니다.',
        '조리 없는 안내 활동 같은 대체 계획을 만들 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '조건 변화를 정리하는 AI',
      text: '도구가 없고 알레르기 정보가 확인되지 않았으므로 처음 계획을 멈춰야 합니다. 믿을 만한 어른이 안전 정보를 확인할 때까지 실제 음식은 다루지 말고, 조리 없는 대체 활동을 계획해 보세요.',
      question: '처음 계획에서 무엇을 빼거나 바꾸고, 누구의 확인을 받아야 하나요?',
    },
    artifact: {
      kind: 'workflow-plan',
      title: '처음 계획-바뀐 계획-수정 이유',
      prompt: '처음 계획, 바뀐 조건, 멈춘 이유, 도움받을 사람, 대체 방법, 확인 뒤 새 계획을 적어 보세요.',
    },
    transfer: {
      title: '체험회 장소와 시간이 바뀌었을 때',
      description: '설치 장소가 좁아지고 준비 시간이 10분 줄었습니다. 어떻게 하겠어요?',
      choices: [
        { id: 'keep-plan-secretly', emoji: '📦', label: '처음 계획을 바꾸지 않고 준비물을 모두 가져가요.' },
        { id: 'check-new-conditions', emoji: '🔄', label: '공간·시간·안전 조건을 다시 확인하고 단계와 준비물을 줄여요.' },
        { id: 'ignore-time-change', emoji: '⏰', label: '시간 변화는 계획과 관계없다고 생각해요.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  },
];
