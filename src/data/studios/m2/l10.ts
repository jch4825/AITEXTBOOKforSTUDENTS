import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L10_STUDIO: StudioDefinition = {
    id: 'm2-complete-dialogue-studio',
    lessonId: 'm2-l10',
    moduleId: 'm2',
    title: '한 번의 진짜 대화 완성하기',
    subtitle: '요청·결과·수정·근거·결정을 하나의 대화 기록으로 연결해 봐요.',
    format: 'E',
    visualNovel: {
      title: '체험회에 필요한 결과를 직접 완성해요',
      objective: '내가 정한 목적으로 아이미에게 부탁하고, 답을 고쳐 묻고, 근거를 확인해 마지막 사용을 결정해요.',
      seasonTag: '[부탁의 달인 · 10화] 진짜 대화 완성전',
      nextEpisodeHook: '다음 시간 — 나만의 부탁 카드집을 만들어요.',
      scenes: [
        {
          id: 'choose-authentic-task',
          label: '장면 1 · 과제 선택',
          imageSrc: '/lessons/story/m2/m2-l10-scene-01.webp',
          alt: '윤아가 시즌을 돌아보며 이제 학생의 차례라고 말하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "우리 많이 배웠어. 이제 네 차례야."',
            '윤아: "음악회 소동부터 5시 미스터리까지… 우리 많이 배웠어. 이제 네 차례야."',
            '윤아: "음악회 소동부터 5시 미스터리까지… 우리 많이 배웠어. 이제 네 차례야." 홍보 문구, 준비 목록, 소개 대본 중 하나를 고를 차례였습니다.',
            '좋은 대화는 내가 정한 분명한 목적에서 시작해요.',
          ),
        },
        {
          id: 'first-dialogue-result',
          label: '장면 2 · 첫 대화',
          imageSrc: '/lessons/story/m2/m2-l10-scene-02.webp',
          alt: '아이미가 결과에 오류가 있을 수 있다며 찾아보겠냐고 묻는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "결과 나왔어요! 한 곳이 다를 수도 있어요."',
            '아이미: "결과 나왔어요! …어딘가 한 곳이 사실 카드와 다를 수도 있어요. 찾아보시겠어요?"',
            '아이미: "결과 나왔어요! …어딘가 한 곳이 사실 카드와 다를 수도 있어요. 찾아보시겠어요?" 길이와 말투는 좋아 보였습니다.',
            '실제 AI 답인지 수업용 연습 답인지 화면 표시로 구분해요.',
          ),
        },
        {
          id: 'repair-and-verify-dialogue',
          label: '장면 3 · 수정과 근거 확인',
          imageSrc: '/lessons/story/m2/m2-l10-scene-03.webp',
          alt: '윤아가 지킬 것 정하기 고쳐 묻기 근거 대조의 순서를 응원하며 짚는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "지킬 것 정하고, 고쳐 묻고, 근거 대조! 할 수 있어."',
            '윤아: "지킬 것 정하기, 고쳐 묻기, 근거 대조하기. 순서대로 하면 돼!"',
            '윤아: "지킬 것 정하기, 고쳐 묻기, 근거 대조하기. 순서대로 하면 돼!" 시즌 내내 해 온 방법 그대로였습니다.',
            '수정된 답도 독립된 근거로 검증해요.',
          ),
        },
        {
          id: 'present-final-decision',
          label: '장면 4 · 당신의 첫 부탁을 들려주세요',
          imageSrc: '/lessons/story/m2/m2-l10-scene-04.webp',
          alt: '아이미가 준비됐다며 첫 부탁을 청하는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "준비됐어요. 첫 부탁을 들려주세요!"',
            '아이미: "준비됐어요. 당신의 첫 부탁을 들려주세요!"',
            '아이미: "준비됐어요. 당신의 첫 부탁을 들려주세요! 목적부터 말씀해 주시면 좋아요."',
            '대화 전체가 내가 어떻게 판단했는지 보여 주는 기록이에요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '실제 목적에서 시작해요',
          core: '내가 사용할 결과와 성공 기준, 확인할 자료가 있는 과제를 고릅니다.',
          detail: {
            full: '내가 정말 필요한 일을 골라요.',
            light: '홍보 문구, 준비 목록, 소개 대본 중 목적을 분명히 말합니다.',
            challenge: '어디에 쓸지와 성공 기준을 먼저 정하면 답이 알맞은지 판단할 수 있습니다.',
          },
        },
        {
          title: '요청부터 결정까지 연결해요',
          core: '최초 요청, 결과, 수정 요청, 근거 확인, 최종 결정을 순서대로 남깁니다.',
          detail: {
            full: '대화의 모든 단계를 기록해요.',
            light: '결과만 저장하지 않고 어떻게 고치고 확인했는지 함께 남깁니다.',
            challenge: '과정 기록을 남기면 어디에서 나온 답인지, 왜 고쳤는지, 내 생각이 어떻게 바뀌었는지 볼 수 있습니다.',
          },
          flow: { input: '실제 목적과 첫 요청', process: '결과·수정·근거 확인', output: '최종 결정과 대화 기록' },
        },
        {
          title: '실제 답과 연습 답을 구분해요',
          core: '실제 AI 답인지 수업용 연습 답인지 화면의 안내를 확인합니다.',
          detail: {
            full: '어떤 답인지 표시를 봐요.',
            light: '어느 경로든 결과를 바로 믿지 않고 독립된 자료와 비교합니다.',
            challenge: '답이 실제 AI에서 왔는지 연습용 답인지 표시하고, 둘 다 같은 방법으로 확인해야 합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '체험회에 필요한 결과를 직접 완성해요',
      description: '홍보 문구, 체험 준비 목록, 소개 대본 중 하나를 골라 요청부터 최종 결정까지 한 번의 대화를 완성합니다.',
      facts: [
        '각 과제에는 확인할 공식 사실 카드가 있습니다.',
        '화면의 답은 수업용 연습 결과라고 표시됩니다.',
        '최종 결과는 사용, 수정, 거절 중 하나로 판단합니다.',
      ],
    },
    firstAttempt: {
      prompt: '어떤 과제와 최초 요청으로 대화를 시작하겠습니까?',
      choices: [
        { id: 'choose-promo-copy', emoji: '📢', label: '행사 시간과 장소가 있는 홍보 문구를 만듭니다.', reaction: '아이미: "홍보 문구군요! 행사 시간과 장소부터 알려 주시면 시작할게요."' },
        { id: 'choose-activity-list', emoji: '📋', label: '체험 활동의 준비 목록을 만듭니다.', reaction: '아이미: "준비 목록이군요! 참가 인원부터 알려 주시면 시작할게요."' },
        { id: 'choose-intro-script', emoji: '📜', label: '1분 안의 체험 소개 대본을 만듭니다.', reaction: '아이미: "소개 대본이군요! 듣는 분이 누구인지 알려 주시면 시작할게요."' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 결과를 어디에 쓰고 무엇으로 확인할까요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '과제별 사실 카드가 공개되고, 첫 결과에는 날짜·수량·대상 중 한 가지 오류가 있다는 사실을 알게 되었습니다.',
      facts: [
        '홍보 문구의 공식 시간은 오후 2시입니다.',
        '준비 목록의 참가 인원은 열두 명입니다.',
        '소개 대본의 대상은 처음 체험하는 초등학생입니다.',
        '수정 결과도 과제별 사실 카드와 비교해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 대화 기록 제안',
      text: '첫 결과에서 목적에 맞는 부분은 유지하고 사실 카드와 다른 부분을 구체적으로 고쳐 요청해 주세요. 두 번째 결과도 근거와 비교한 뒤 최종 사용을 결정해요.',
      question: '최초 판단과 최종 판단이 같거나 달라진 근거는 무엇인가요?',
    },
    artifact: {
      kind: 'repair-card',
      title: '전체 대화·검증 기록',
      prompt: '목적, 최초 요청, 첫 결과 판단, 수정 요청, 근거 확인, 최종 결과와 결정을 타임라인으로 남겨 봐요.',
    },
    transfer: {
      title: '다른 목적의 짧은 대화를 만든다면',
      description: '동아리 모집 문구를 새로 만들며 요청, 수정, 확인, 결정을 짧게 반복합니다.',
      choices: [
        { id: 'transfer-one-shot', emoji: '📄', label: '첫 결과를 확인하지 않고 바로 게시합니다.', reaction: '오류가 있는 문구가 그대로 게시되고 말았습니다.' },
        { id: 'transfer-full-cycle', emoji: '🔄', label: '대상과 형식을 넣고 결과를 고친 뒤 공식 정보와 확인합니다.', reaction: '확인까지 마친 문구가 완성됐습니다.' },
        { id: 'transfer-repeat-only', emoji: '🔁', label: '같은 요청만 반복하고 다른 자료는 보지 않습니다.', reaction: '같은 결과만 반복될 뿐 제자리였습니다.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
