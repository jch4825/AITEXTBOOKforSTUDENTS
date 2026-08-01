import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_SAFETY_NOTE } from './shared';

export const M4_L8_STUDIO: StudioDefinition = {
    id: 'm4-stop-time-plan',
    lessonId: 'm4-l8',
    moduleId: 'm4',
    title: '멈출 시간을 함께 정하기',
    subtitle: '사용 기록·몸 신호·일정·지원 조건으로 나에게 맞는 멈춤 계획을 세워 봐요.',
    format: 'E',
    visualNovel: {
      title: '추천 영상 때문에 놓친 준비 시간',
      objective: '나의 사용 기록을 보고 멈춤 신호와 다음 행동을 정해, 아이미와 함께 나만의 멈춤 계획을 만들어요.',
      seasonTag: '[안전 지킴이 · 8화] 멈추지 않는 추천 영상',
      nextEpisodeHook: '다음 시간 — 선물을 준다는 낯선 계정.',
      scenes: [
        {
          id: 'm4-l8-video-flow',
          label: '계속된 추천',
          imageSrc: '/lessons/story/m4/m4-l8-scene-01.webp',
          alt: '진우가 하나만 보려다 일곱 개째 영상을 보고 있는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "하나만 보려고 했는데… 어느새 일곱 개째야."',
            '진우: "하나만 보려고 했는데… 어느새 일곱 개째야. 포스터 정리 시간이 지났어!"',
            '진우: "하나만 보려고 했는데… 어느새 일곱 개째야. 포스터 정리 시간이 지났어!" 의지 부족이 아니라 구조의 문제였습니다.',
            '진우는 의지가 약해서가 아니라 멈출 단서와 다음 행동이 없었다고 기록했습니다.',
          ),
        },
        {
          id: 'm4-l8-usage-log',
          label: '기록 보기',
          imageSrc: '/lessons/story/m4/m4-l8-scene-02.webp',
          alt: '민준 선생님이 알람이 울렸을 때 무슨 일이 있었는지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '민준 선생님: "알람이 울렸을 때 무슨 일이 있었니?"',
            '민준 선생님: "알람이 울렸을 때 무슨 일이 있었니?" 진우: "들었는데… 그다음에 뭘 해야 할지 몰랐어요."',
            '민준 선생님: "알람이 울렸을 때 무슨 일이 있었니?" 진우: "들었는데… 그다음에 뭘 해야 할지 몰랐어요." 눈 피로와 일정도 함께 살펴보았습니다.',
            '진우는 혼자 지키는 약속보다 도움을 받을 수 있는 계획이 현실적이라고 느꼈습니다.',
          ),
        },
        {
          id: 'm4-l8-fixed-vs-personal',
          label: '두 계획 비교',
          imageSrc: '/lessons/story/m4/m4-l8-scene-03.webp',
          alt: '아이미가 매일 30분을 제안하고 진우가 주말 가족 일정이 다르다고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "매일 30분으로 정하면 어때요? 모두에게 공평해요!"',
            '아이미: "매일 30분으로 정하면 어때요? 모두에게 공평해요!" 진우: "그런데 주말엔 가족 일정이 다른데…"',
            '아이미: "매일 30분으로 정하면 어때요? 모두에게 공평해요!" 진우: "그런데 주말엔 가족 일정이 다른데…" 한 숫자로는 설명되지 않는 부분이 있었습니다.',
            '진우는 평일과 주말에 서로 다른 계획이 필요하다는 것을 발견했습니다.',
          ),
        },
        {
          id: 'm4-l8-stop-flag',
          label: '당신의 멈춤 신호는?',
          imageSrc: '/lessons/story/m4/m4-l8-scene-04.webp',
          alt: '아이미가 숫자 하나로는 부족하다며 학생의 멈춤 신호와 다음 행동을 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "숫자 하나로는 부족하군요. 당신의 멈춤 신호는 무엇으로 하겠어요?"',
            '아이미: "숫자 하나로는 부족하군요. 당신의 멈춤 신호와 그다음 행동은 무엇으로 하겠어요?"',
            '아이미: "숫자 하나로는 부족하군요. 당신의 멈춤 신호와 그다음 행동은 무엇으로 하겠어요? 도와줄 사람도 함께 정해요."',
            '진우는 주말 일정이 바뀌면 계획도 다시 맞추기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '내 사용 기록을 먼저 봐요',
          core: '언제, 왜, 얼마나 사용했고 무엇을 놓쳤는지 확인합니다.',
          detail: {
            full: '사용 전과 후에 한 일을 골라요.',
            light: '시간뿐 아니라 목적과 결과를 함께 적습니다.',
            challenge: '몇 분 썼는지만 보지 않습니다. 무엇을 놓쳤고 몸이 어땠는지도 기록합니다.',
          },
        },
        {
          title: '몸·일정·지원을 함께 살펴요',
          core: '쉬어야 하는 신호와 다음 일정, 필요한 도움을 연결합니다.',
          detail: {
            full: '눈, 몸, 마음의 신호를 찾아요.',
            light: '다음 행동으로 옮겨 갈 도움을 정합니다.',
            challenge: '자기조절 계획은 생리적 신호, 실행 기능, 환경 지원을 함께 고려합니다.',
          },
          flow: { input: '사용 기록', process: '신호·일정·지원 확인', output: '개인 멈춤 계획' },
        },
        {
          title: '한 숫자가 모두의 정답은 아니에요',
          core: '가정과 학교에서 상황에 맞는 계획을 함께 정하고 바뀌면 조정합니다.',
          detail: {
            full: '평일과 주말 계획이 달라도 괜찮아요.',
            light: '계획을 함께 확인할 사람을 적습니다.',
            challenge: '시간 제한은 목적이 아니라 수면, 학습, 참여, 건강을 보호하는 수단으로 평가합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '언제 멈췄으면 준비 시간을 지킬 수 있었을까',
      description: '진우의 사용 기록과 몸·일정 조건을 보고 실행 가능한 계획을 만들어야 합니다.',
      facts: [
        '진우는 준비 영상 뒤 추천 영상을 계속 봤습니다.',
        '눈이 뻐근했고 포스터 정리 시간을 놓쳤습니다.',
        '알람은 있었지만 다음 행동이 정해지지 않았습니다.',
        '평일과 주말 일정은 서로 다릅니다.',
      ],
    },
    firstAttempt: {
      prompt: '멈춤 계획에 가장 필요한 것을 먼저 골라 보세요.',
      choices: [
        { id: 'one-number', emoji: '1️⃣', label: '모두에게 같은 시간 숫자만 정해요.', reaction: '주말 가족 일정에서 바로 어긋났습니다.' },
        { id: 'signal-action', emoji: '🚩', label: '내 신호와 다음 행동, 도움받을 사람을 정해요.', reaction: '민준 선생님: "그게 지킬 수 있는 계획이야. 신호, 행동, 도움."' },
        { id: 'willpower-only', emoji: '💪', label: '다음에는 참겠다고만 약속해요.', reaction: '다음 날에도 같은 일이 반복됐습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내 기록에서 찾은 멈춤 신호와 다음 행동을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '평일·주말 일정과 사용 후 몸 신호가 공개됩니다.',
      facts: [
        '평일에는 오후 3시에 포스터 준비가 있습니다.',
        '주말에는 가족 일정이 매주 달라집니다.',
        '눈 피로와 다음 활동 지연이 쉬는 신호입니다.',
        '민준 선생님과 가족이 계획 조정을 도울 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '기록에서 멈춤 조건을 정리하는 AI',
      text: '모두에게 같은 숫자보다 진우의 일정과 몸 신호가 중요합니다. 알람 또는 눈 피로를 멈춤 신호로 하고, 종료 뒤 물 마시기와 포스터 자리 이동을 다음 행동으로 정할 수 있습니다.',
      question: '주말 일정이 달라지면 계획에서 무엇을 바꿔야 하나요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '개인 사용·휴식 계획',
      prompt: '사용 목적, 멈춤 신호, 종료 뒤 행동, 평일·주말 조정, 도움받을 사람을 적어 보세요.',
    },
    transfer: {
      title: '주말 계획 바꾸기',
      description: '주말 가족 일정이 늦게 시작하는 날에는 평일 계획을 어떻게 바꾸겠어요?',
      choices: [
        { id: 'ignore-change', emoji: '📌', label: '상황이 달라도 평일 시각만 그대로 써요.', reaction: '바뀐 일정과 자꾸 부딪혔습니다.' },
        { id: 'adjust-plan', emoji: '🔄', label: '몸 신호와 가족 일정을 보고 멈춤 시점과 다음 행동을 다시 정해요.', reaction: '바뀐 상황에 맞춰 계획도 자연스럽게 따라왔습니다.' },
        { id: 'no-plan', emoji: '♾️', label: '주말에는 계획 없이 계속 사용해요.', reaction: '계획이 없으니 다시 시간을 놓치기 쉬웠습니다.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  };
