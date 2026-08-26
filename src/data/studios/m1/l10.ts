import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L10_STUDIO: StudioDefinition = {
    id: 'm1-ai-result-decision',
    lessonId: 'm1-l10',
    moduleId: 'm1',
    title: 'AI 결과를 사용할까?',
    subtitle: '안전한 요청을 한 뒤 결과를 확인하고 사용·수정·거절을 골라봐요.',
    format: 'E',
    decisionTitle: '아이미에게 직접 상황에 맞는 노래를 추천해달라고 해봐요.',
    suggestedQuestions: [
      '비 오는 날 어울리는 신나는 노래 추천해줘',
      '공부할 때 집중 잘 되는 잔잔한 음악 알려줘',
      '기분이 우울할 때 힘이 나는 노래 추천해줘',
    ],
    visualNovel: {
      title: '체험회 배경음악 고르기',
      objective: '개인정보 없이 아이미에게 음악을 부탁하고, 받은 결과를 확인해 쓰기·고치기·안 쓰기 중에서 골라요.',
      seasonTag: '[아이미가 왔다 · 10화] 자장가 사건',
      nextEpisodeHook: '다음 시간 — 드디어, 우리 반 아이미 설명서를 완성해요.',
      scenes: [
        {
          id: 'music-request',
          label: '장면 1 · 안전한 요청',
          imageSrc: '/lessons/story/m1/m1-l10-scene-01.webp',
          alt: '진우가 개인정보 없이 체험회 배경음악을 요청하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회에 틀 음악을 골라야 해요. 진우: "배경음악 추천해 줘!" 이름은 넣지 않았어요.',
            '체험회에 틀 음악을 골라야 했습니다. 진우: "체험회에 어울리는 배경음악 추천해 줘!" 이름이나 연락처는 넣지 않았습니다.',
            '체험회에 틀 음악을 골라야 했습니다. 진우: "체험회에 어울리는 배경음악 추천해 줘!" 행사 목적과 분위기만 넣고 개인정보는 넣지 않았습니다.',
            '요청에는 필요한 조건만 넣고 개인정보는 넣지 않아요.',
          ),
        },
        {
          id: 'first-list',
          label: '장면 2 · 첫 번째 결과',
          imageSrc: '/lessons/story/m1/m1-l10-scene-02.webp',
          alt: '아이미가 댄스 타임에 조용한 아기 자장가를 추천해 진우가 당황하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미: "댄스 타임 추천곡 1번, \'조용한 아기 자장가\'!" 진우: "다 같이 잠들겠는데?"',
            '아이미: "댄스 타임 추천곡 1번! \'조용한 아기 자장가\'입니다!" 진우: "…댄스 타임에 다 같이 잠들겠는데?"',
            '아이미: "댄스 타임 추천곡 1번! \'조용한 아기 자장가\'입니다!" 진우: "…댄스 타임에 다 같이 잠들겠는데?" 목록에는 확인되지 않은 곡도 섞여 있었습니다.',
            'AI 결과는 목적과 확인된 자료에 맞는지 비교해요.',
          ),
        },
        {
          id: 'revise-request',
          label: '장면 3 · 조건을 넣어 수정',
          imageSrc: '/lessons/story/m1/m1-l10-scene-03.webp',
          alt: '윤아가 빠진 조건이 무엇이었는지 확인하며 새 목록을 받는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "무슨 조건이 빠졌던 걸까?" 신나는 곡, 공식 목록 조건을 더해 다시 부탁했어요.',
            '윤아: "무슨 조건이 빠졌던 걸까?" 신나는 곡, 공식 목록이라는 조건을 더해 다시 요청했습니다.',
            '윤아: "무슨 조건이 빠졌던 걸까?" 신나는 곡, 공식 목록이라는 조건을 더해 다시 요청하자 새 목록이 도착했습니다.',
            '조건과 근거를 더하면 목적에 맞게 결과를 고칠 수 있어요.',
          ),
        },
        {
          id: 'final-decision',
          label: '장면 4 · 쓸까, 고칠까, 뺄까?',
          imageSrc: '/lessons/story/m1/m1-l10-scene-04.webp',
          alt: '윤아가 새 목록의 곡을 하나씩 정하자고 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '새 목록이 왔어요. 윤아: "한 곡씩 정하자 — 쓸까, 고칠까, 뺄까?"',
            '윤아: "새 목록이 왔어. 이제 한 곡씩 정하자 — 쓸까, 고칠까, 뺄까?"',
            '윤아: "새 목록이 왔어. 이제 한 곡씩 정하자 — 쓸까, 고칠까, 뺄까? 확인한 근거도 함께 남기자."',
            'AI가 제안해도 마지막 결정과 책임은 사람에게 있어요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '안전하게 요청해요',
          core: '작업에 필요한 조건만 넣고 개인정보는 넣지 않습니다.',
          detail: {
            full: '이름이나 연락처는 쓰지 않아요.',
            light: '행사 목적과 원하는 결과는 쓰되 개인을 알아볼 정보는 넣지 않습니다.',
            challenge: '요청의 목적 달성에 필요하지 않은 개인정보와 민감한 정보는 입력에서 제외합니다.',
          },
        },
        {
          title: '근거와 비교해요',
          core: 'AI 결과를 목적, 조건, 확인된 자료와 비교합니다.',
          detail: {
            full: '처음 결과를 바로 쓰지 않아요.',
            light: '행사 조건표와 공식 곡 목록을 기준으로 결과를 살펴봅니다.',
            challenge: '결과가 알맞은지, 사실이 맞는지 다른 확인 자료를 보고 살펴봅니다.',
          },
          flow: { input: '안전한 요청', process: '조건·근거와 비교', output: '사용·수정·거절' },
        },
        {
          title: '사람이 결정해요',
          core: 'AI 결과의 마지막 사용 여부와 책임은 사람에게 있습니다.',
          detail: {
            full: '내가 확인하고 골라요.',
            light: 'AI 의견을 받아들이거나 고치거나 사용하지 않을 수 있습니다.',
            challenge: 'AI 제안은 판단 자료 중 하나이며, 최종 선택과 그 결과에 대한 책임은 사용자에게 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '신나는 댄스 타임에 아기 자장가가 나왔어요',
      description: '신나는 체험회 댄스 타임 음악을 요청했더니 아이미가 쿨쿨 잠이 오는 <조용한 아기 자장가>를 음악으로 추천했습니다!',
      facts: [
        '댄스 타임에는 신나고 빠른 템포의 음악이 필요합니다.',
        '아이미가 추천한 음악은 쿨쿨 잠이 오는 조용한 자장가입니다.',
        'AI의 추천 결과를 그대로 쓰지 않고 목적에 맞춰 사용, 수정, 거절 판단을 해야 합니다.',
      ],
    },
    firstAttempt: {
      prompt: '댄스 타임에 쿨쿨 잠이 오는 자장가가 추천되었을 때 어떻게 하겠습니까?',
      choices: [
        { id: 'review-items', emoji: '🔍', label: '자장가는 거절하고 신나는 댄스곡 조건으로 다시 요청해 결정합니다.', isCorrect: true, reaction: '아이미: "신나는 곡이 필요했군요! 조건을 알려 주시면 다시 골라 올게요."' },
        { id: 'modify-prompt-conditions', emoji: '⚙️', label: '댄스 타임 분위기와 공식 곡 목록에 맞춰 조건을 수정합니다.', isCorrect: true, reaction: '윤아가 조건표를 꺼내며 하나씩 표시했습니다.' },
        { id: 'use-all', emoji: '🎵', label: '아이미가 골랐으니 댄스 타임에 자장가를 그대로 틀어 줍니다.', isCorrect: false, reaction: '댄스 타임이 조용한 낮잠 시간이 될 뻔했습니다.' },
        { id: 'reject-all', emoji: '🛑', label: '확인해보지도 않고 무작정 모든 결과를 배척합니다.', isCorrect: false, reaction: '윤아: "쓸 만한 곡까지 다 잃어버리는 건데?"' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '결과를 판단할 때 사용할 근거는 무엇인가요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '행사 조건표와 공식 곡 목록이 추가되었습니다. 아이미의 첫 결과와 수정 결과를 비교할 수 있습니다.',
      facts: [
        '조용한 연주곡은 행사 조건과 맞습니다.',
        '큰 소리의 효과음이 많은 곡은 대화를 방해합니다.',
        '공식 목록에 없는 곡 정보는 사실 여부를 확인할 수 없습니다.',
        '조건을 넣어 다시 요청하자 목록의 일부가 바뀌었습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '수업용 AI 응답 · 실제 AI 연결 아님',
      text: '조용한 분위기와 공식 목록이라는 조건을 반영해 새 목록을 만들었습니다. 그래도 각 곡이 실제 조건에 맞는지는 사람이 확인해 주세요.',
      question: '첫 결과와 수정 결과 중 무엇을 사용하고, 무엇을 고치거나 거절하겠습니까?',
    },
    artifact: {
      kind: 'action-card',
      title: 'AI 결과 사용 판단 기록',
      prompt: '최초 요청, 수정한 조건, 확인 근거, 사용·수정·거절 결정을 한 장에 남겨 봐요.',
    },
    transfer: {
      title: '체험회 안내 문구를 만든다면',
      description: 'AI가 만든 안내 문구에 확인되지 않은 행사 시간이 들어 있습니다. 어떻게 처리하겠습니까?',
      prompt: '나만의 표현으로 AI 결과를 검토하여 사용, 수정, 거절을 판단하는 방법을 설명해 봐요.',
      choices: [
        { id: 'modify-time', emoji: '✏️', label: '학교 공식 공지표를 확인해 잘못된 행사 시간을 바르게 수정하여 사용합니다.', isCorrect: true, reaction: '공지표와 비교해 정확한 시간으로 고쳤습니다.' },
        { id: 'reject-unsafe', emoji: '🚫', label: '확인되지 않은 오정보가 너무 많거나 개인정보를 요구하면 사용을 거절합니다.', isCorrect: true, reaction: '위험한 요청은 거절하는 것이 안전했습니다.' },
        { id: 'publish-now', emoji: '📢', label: '문장이 매끄러우므로 잘못된 시간 정보를 확인하지 않고 즉시 게시합니다.', isCorrect: false, reaction: '잘못된 시간을 보고 헛걸음한 친구가 있었습니다.' },
        { id: 'auto-accept-ai', emoji: '🤖', label: 'AI가 작성해 준 결과물은 사람이 수정할 필요 없이 무조건 받아들입니다.', isCorrect: false, reaction: '틀린 정보가 그대로 퍼질 뻔했습니다.' },
      ],
    },
    safetyNote: '학생 개인정보를 입력하지 않으며, 화면의 AI 답은 수업용 응답임을 분명히 표시합니다.',
  };
