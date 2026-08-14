import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L7_STUDIO: StudioDefinition = {
    id: 'm1-fast-help-review',
    lessonId: 'm1-l7',
    moduleId: 'm1',
    title: '빠른 도움 검토실',
    subtitle: 'AI의 요약과 번역을 원문과 비교하여 빠르면서도 안전하게 사용해 봐요.',
    format: 'C',
    decisionTitle: '아이미에게 직접 자료를 주고 요약을 시켜봐요.',
    suggestedQuestions: [
      '긴 안내문을 짧게 핵심만 요약해줄래?',
      '급식표나 소식지 내용을 세 줄로 요약해줘',
      '어려운 글을 쉬운 말로 요약하는 방법 보여줘',
    ],
    visualNovel: {
      title: '체험회 안내가 너무 길어요',
      objective: '아이미가 1초 만에 만든 요약·번역을 원문과 나란히 놓고, 빠지거나 달라진 부분을 찾아 고쳐요.',
      seasonTag: '[아이미가 왔다 · 7화] 1초 요약의 함정',
      nextEpisodeHook: '다음 시간 — 아이미에게 네 가지 부탁이 한꺼번에!',
      scenes: [
        {
          id: 'long-event-notice',
          label: '장면 1 · 긴 안내문',
          imageSrc: '/lessons/story/m1/m1-l7-scene-01.webp',
          alt: '진우가 10페이지짜리 안내문을 보고 아이미에게 줄여 달라 부탁하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회 안내문이 10페이지였어요. 진우: "아이미야, 짧게 좀 줄여 줘!"',
            '체험회 안내문이 10페이지나 되었습니다. 진우: "안내문이 10페이지야?! 아이미야, 짧게 좀 줄여 줘!"',
            '체험회 안내문이 10페이지나 되었습니다. 진우: "이걸 다 읽으라고? 아이미야, 짧게 좀 줄여 줘!" 서준도 날짜와 장소를 빨리 찾고 싶어 했습니다.',
            'AI는 긴 글을 짧게 요약하거나 다른 언어로 빠르게 바꿀 수 있어요.',
          ),
        },
        {
          id: 'missing-summary-detail',
          label: '장면 2 · 빠르지만 빠진 정보',
          imageSrc: '/lessons/story/m1/m1-l7-scene-02.webp',
          alt: '아이미가 1초 만에 완성했다고 자신 있게 말하고 서준이 허전함을 느끼는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "1초 만에 완성! 날짜, 장소, 다 들어 있어요!" 서준은 왠지 허전했어요.',
            '아이미: "1초 만에 완성! 날짜, 장소, 다 들어 있어요!" 서준은 왠지 허전한 느낌이 들었습니다.',
            '아이미: "1초 만에 완성! 날짜, 장소, 다 들어 있어요!" 서준은 왠지 허전한 느낌이 들었습니다. 신청 마감 시간이 안 보였습니다.',
            '빠르게 만든 결과에도 빠진 내용이나 달라진 뜻이 있을 수 있어요.',
          ),
        },
        {
          id: 'compare-source-notice',
          label: '장면 3 · 원문과 나란히 보기',
          imageSrc: '/lessons/story/m1/m1-l7-scene-03.webp',
          alt: '서준이 원문과 요약을 나란히 놓고 준비물 칸이 빈 것을 발견하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '서준: "원문이랑 나란히 놓고 보자. …어? 준비물 칸이 비었는데?"',
            '서준: "원문이랑 나란히 놓고 보자. …어? 준비물 칸이 비었는데?"',
            '서준: "원문이랑 나란히 놓고 보자. …어? 준비물 칸이 비었는데?" 원문에는 분명 "준비물: 실로폰"이 적혀 있었습니다.',
            '요약과 번역은 원문과 핵심 정보 기준으로 검토해야 해요.',
          ),
        },
        {
          id: 'share-checked-version',
          label: '장면 4 · 또 빠진 게 있을까?',
          imageSrc: '/lessons/story/m1/m1-l7-scene-04.webp',
          alt: '진우가 실로폰 말고 또 빠진 것이 있을지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '진우: "실로폰 말고 또 빠진 게 있을까? 어디부터 대조하지?"',
            '진우: "실로폰 말고 또 빠진 게 있을까? 어디부터 어떻게 대조하지?"',
            '진우: "실로폰 말고 또 빠진 게 있을까? 어디부터 어떻게 대조하지?" 날짜, 장소, 마감… 확인할 항목이 여럿이었습니다.',
            'AI의 빠른 도움은 사람이 확인하고 고칠 때 더 안전해져요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '빠르게 줄이고 바꿀 수 있어요',
          core: '생성형 AI는 긴 글의 핵심을 요약하거나 다른 언어의 표현으로 바꿀 수 있습니다.',
          detail: {
            full: '긴 글을 짧게 만들 수 있어요.',
            light: 'AI는 글의 단어와 문장 관계를 바탕으로 요약이나 번역 결과를 만듭니다.',
            challenge: '생성형 AI는 입력 문맥에 이어질 가능성이 높은 표현을 구성해 요약과 번역 초안을 빠르게 제시합니다.',
          },
          flow: { input: '원문과 요청 조건', process: '핵심과 표현 구성', output: '요약 또는 번역 초안' },
        },
        {
          title: '빠진 내용과 달라진 뜻을 찾아요',
          core: '짧아진 글에는 중요한 조건이 빠지거나 번역 과정에서 뜻이 달라질 수 있습니다.',
          detail: {
            full: '중요한 말이 남았는지 봐요.',
            light: '날짜, 장소, 대상, 마감처럼 행동을 바꾸는 정보를 먼저 확인합니다.',
            challenge: '요약의 누락과 번역의 의미 변화는 사용자의 행동에 영향을 줄 수 있으므로 핵심 항목별 검토가 필요합니다.',
          },
        },
        {
          title: '원문과 확인 근거를 남겨요',
          core: 'AI 결과를 공유할 때는 원문과 비교하고 수정한 내용을 표시합니다.',
          detail: {
            full: '처음 글과 다시 비교해요.',
            light: '공식 안내의 위치와 사람이 확인한 표시를 함께 남깁니다.',
            challenge: '출처와 수정 이력을 남기면 다른 사람도 결과의 근거를 추적하고 다시 확인할 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '1초 요약에서 준비물 실로폰이 빠졌어요',
      description: '아이미가 10페이지짜리 안내문을 1초 만에 멋지게 요약해 주었지만, 가장 중요한 "준비물: 실로폰" 내용이 싹 날아갔습니다!',
      facts: [
        '아이미의 요약 및 번역 속도는 1초 만에 완성되어 매우 빠릅니다.',
        '원문 문서에는 필수 항목인 "준비물: 실로폰"이 명확히 적혀 있습니다.',
        '아이미의 요약글에는 필수 준비물인 실로폰 정보가 누락되었습니다.',
      ],
    },
    firstAttempt: {
      prompt: '1초 만에 빠르게 만들어졌지만 준비물 실로폰이 빠진 요약글을 보고 어떻게 하겠습니까?',
      choices: [
        { id: 'compare-key-facts', emoji: '📋', label: '중요한 내용을 원문과 나란히 놓고 빠진 점을 찾습니다.', isCorrect: true, reaction: '윤아: "항목을 하나씩 짚어 보자. 날짜, 장소, 준비물, 마감…"' },
        { id: 'add-missing-items', emoji: '✏️', label: '빠진 준비물 실로폰 내용을 사람이 직접 고쳐 보완합니다.', isCorrect: true, reaction: '아이미: "고쳐 주셔서 고마워요. 저는 빠뜨린 걸 몰랐어요."' },
        { id: 'share-fast-result', emoji: '📤', label: '빠르게 만들어졌으니 실로폰이 빠졌어도 그대로 공유합니다.', isCorrect: false, reaction: '실로폰을 안 가져온 친구가 생겼습니다.' },
        { id: 'ignore-ai-help', emoji: '🛑', label: '원문과 비교하지 않고 AI 결과를 모두 버립니다.', isCorrect: false, reaction: '윤아: "빠른 요약의 장점까지 버리는 건 아까운데?"' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '빠름과 정확함을 함께 지키려면 무엇이 필요할까요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '원문과 나란히 놓고 대조하자 "준비물: 실로폰"이 빠졌음을 확인하고 요약글을 바르게 고쳤습니다.',
      facts: [
        'AI 요약은 빠르고 편리하지만 중요한 내용이 누락될 수 있습니다.',
        '원문과 나란히 대조하면 빠진 핵심 항목을 즉시 발견할 수 있습니다.',
        '빠진 지침을 보완하고 원문 출처를 함께 남기면 안전하게 공유할 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 검토 제안',
      text: '날짜와 준비물은 원문과 같지만 신청 마감이 빠졌고 장소 이름도 다르게 옮겨졌어요. 확인한 내용을 넣어 고친 뒤 원문 위치를 함께 남기는 편이 좋아요.',
      question: '아이미의 제안을 그대로 따를까요, 기준표를 이용해 한 번 더 확인할까요?',
    },
    artifact: {
      kind: 'review-sheet',
      title: '요약·번역 검토지',
      prompt: '핵심 항목, AI 결과, 원문에서 확인한 내용, 내가 고친 내용을 표로 정리해 봐요.',
    },
    transfer: {
      title: '준비물 안내를 짧게 보낸다면',
      description: 'AI가 학급 준비물 안내를 한 문장으로 줄였는데 가져오는 날짜가 빠졌습니다.',
      prompt: '나만의 표현으로 AI 요약문에서 중요한 내용이 빠졌을 때 어떻게 할지 설명해 봐요.',
      choices: [
        { id: 'check-supply-source', emoji: '📰', label: '원문 안내판과 비교해 날짜와 준비물이 남았는지 확인합니다.', isCorrect: true, reaction: '비교해 보니 날짜가 빠진 것을 바로 찾을 수 있었습니다.' },
        { id: 'repair-supply-summary', emoji: '✏️', label: '빠진 날짜를 직접 넣어 맞는 완성본을 만듭니다.', isCorrect: true, reaction: '날짜를 채워 넣자 완성된 안내문이 되었습니다.' },
        { id: 'send-short-supply', emoji: '📨', label: '날짜가 빠졌지만 글이 짧고 읽기 쉬우므로 그대로 전송합니다.', isCorrect: false, reaction: '날짜를 몰라 준비물을 늦게 가져온 친구가 있었습니다.' },
        { id: 'trust-summary-only', emoji: '⚡', label: 'AI 요약은 빨라야 하므로 원문 확인을 생략하고 공유합니다.', isCorrect: false, reaction: '빠르게 보낸 안내에 정작 중요한 날짜가 없었습니다.' },
      ],
    },
  };
