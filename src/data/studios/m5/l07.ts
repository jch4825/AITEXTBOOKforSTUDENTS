import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_PROBLEM_NOTE } from './shared';

export const M5_L7_STUDIO: StudioDefinition = {
    id: 'm5-step-checkpoints',
    lessonId: 'm5-l7',
    moduleId: 'm5',
    title: '한 단계 실행하고 확인하기',
    subtitle: '긴 설치 안내를 한 단계씩 실행하고 체크포인트에서 결과를 확인해요.',
    format: 'E',
    visualNovel: {
      title: '한꺼번에 들은 긴 설치 안내',
      objective: '아이미에게 한 단계씩 부탁하고, 끝났다는 표시를 확인한 다음에 다음 단계로 넘어가요.',
      seasonTag: '[체험회 D-3 · 7화] 긴 설치 안내',
      nextEpisodeHook: '다음 시간 — 완성처럼 보이는 안내문의 비밀.',
      scenes: [
        {
          id: 'm5-l7-long-guide',
          label: '긴 안내',
          imageSrc: '/lessons/story/m5/m5-l7-scene-01.webp',
          alt: '아이미가 연결 전원 화면 소리를 한꺼번에 안내하고 윤아가 중간을 놓치는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '부스 기기 설치 안내를 받았어요. 아이미: "연결, 전원, 화면, 소리 확인!" 윤아: "그다음이 뭐였지?"',
            '부스 기기 설치 안내를 받았습니다. 아이미: "연결하고, 전원 켜고, 화면 고르고, 소리 확인하세요!" 윤아: "잠깐, 그다음이 뭐였지?"',
            '부스 기기 설치 안내를 한꺼번에 받았습니다. 아이미: "연결하고, 전원 켜고, 화면 고르고, 소리 확인하세요!" 윤아: "두 번째까지는 기억나는데…"',
            '윤아는 놓친 단계가 있어도 실패한 것이 아니라 확인 지점이 필요하다는 것을 알았습니다.',
          ),
        },
        {
          id: 'm5-l7-missed-step',
          label: '놓친 단계',
          imageSrc: '/lessons/story/m5/m5-l7-scene-02.webp',
          alt: '모의 설치판에서 전원 표시가 안 켜졌는데 다음 단계로 넘어가 버린 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '모의 설치판에서 전원 표시가 안 켜졌는데 다음 단계로 넘어갔어요. 화면이 작동하지 않았어요.',
            '모의 설치판에서 전원 표시가 켜지지 않았는데도 다음 단계로 넘어가자 화면 확인 단계가 작동하지 않았습니다.',
            '모의 설치판에서 전원 표시가 켜지지 않았는데도 다음 단계로 넘어가자 화면 확인 단계가 작동하지 않았습니다. 확인 없이 넘어간 대가였습니다.',
            '윤아는 확인 지점이 왜 필요한지 몸으로 느꼈습니다.',
          ),
        },
        {
          id: 'm5-l7-checkpoint-board',
          label: '체크포인트',
          imageSrc: '/lessons/story/m5/m5-l7-scene-03.webp',
          alt: '윤아가 행동마다 짝을 붙이자며 전원 누르기의 짝은 초록 표시 확인이라고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "행동마다 짝을 붙이자. \'전원 누르기\'의 짝은 \'초록 표시 확인\'."',
            '윤아: "행동마다 짝을 붙이자. \'전원 누르기\'의 짝은 \'초록 표시 확인\'." 실제 기기 대신 모의 설치판을 사용했습니다.',
            '윤아: "행동마다 짝을 붙이자. \'전원 누르기\'의 짝은 \'초록 표시 확인\'." 행동과 확인의 짝을 찾은 순간이었습니다.',
            '윤아는 확인 방법이 있어야 다음 단계로 안전하게 갈 수 있다고 생각했습니다.',
          ),
        },
        {
          id: 'm5-l7-step-dialogue',
          label: '첫 번째 부탁은?',
          imageSrc: '/lessons/story/m5/m5-l7-scene-04.webp',
          alt: '아이미가 이제 한 단계씩 부탁해 달라며 첫 부탁과 확인 기준을 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "한 단계씩 부탁해 주세요. 첫 부탁과 확인 기준은 무엇인가요?"',
            '아이미: "이제 한 단계씩 부탁해 주세요. 첫 번째 부탁과 그 확인 기준은 무엇인가요?"',
            '아이미: "이제 한 단계씩 부탁해 주세요. 첫 번째 부탁과 그 확인 기준은 무엇인가요? 확인되면 다음 단계를 알려 드릴게요."',
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
        { id: 'do-all-at-once', emoji: '⏩', label: '안내 전체를 듣고 기억나는 대로 한꺼번에 해요.' , reaction: '중간 단계가 빠져 있어 처음으로 되돌아와야 했습니다.'},
        { id: 'check-each-step', emoji: '✅', label: '한 단계를 실행하고 표시를 확인한 뒤 다음 단계를 물어요.', reaction: '아이미: "초록 표시 확인! 그럼 다음 단계를 안내할게요."' },
        { id: 'skip-confusing-step', emoji: '↪️', label: '헷갈리는 단계는 건너뛰고 마지막 단계로 가요.', reaction: '마지막에 작동하지 않아 건너뛴 곳으로 되돌아가야 했습니다.' },
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
        { id: 'upload-all-fast', emoji: '📤', label: '여러 파일을 한꺼번에 고르고 바로 끝났다고 생각해요.', reaction: '일부 파일이 제대로 올라가지 않은 걸 나중에 알았습니다.' },
        { id: 'upload-checkpoints', emoji: '🔎', label: '파일 이름과 완료 표시를 단계마다 확인해요.', reaction: '단계마다 확인하니 빠진 파일 없이 끝났습니다.' },
        { id: 'skip-upload-check', emoji: '🙈', label: '완료 표시는 보지 않고 다음 활동으로 가요.', reaction: '나중에 다시 돌아와 확인해야 했습니다.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  };
