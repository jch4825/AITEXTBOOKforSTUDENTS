import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M1_L9_STUDIO: StudioDefinition = {
    id: 'm1-tool-selection-studio',
    lessonId: 'm1-l9',
    moduleId: 'm1',
    title: 'AI 도구 선택 스튜디오',
    subtitle: '하려는 일의 입력과 결과를 먼저 정하고 알맞은 AI 도구를 골라봐요.',
    format: 'D',
    decisionTitle: '아이미에게 직접 물어봐요.',
    suggestedQuestions: [
      '글쓰기를 잘 하는 인공지능은?',
      '노래를 잘 만드는 인공지능은?',
      '영상을 잘 만드는 인공지능은?',
      '컴퓨터 프로그램을 잘하는 인공지능은?',
    ],
    visualNovel: {
      title: '한 도구로 모두 만들 수 있을까?',
      objective: '하려는 일과 넣을 수 있는 정보를 아이미에게 말하고, 일마다 알맞은 AI 도구를 이유와 함께 골라요.',
      seasonTag: '[아이미가 왔다 · 9화] 도구 고르기 대작전',
      nextEpisodeHook: '다음 시간 — 체험회 음악을 골라요.',
      scenes: [
        {
          id: 'three-event-tasks',
          label: '장면 1 · 서로 다른 세 가지 일',
          imageSrc: '/lessons/story/m1/m1-l9-scene-01.webp',
          alt: '윤아가 요약 포스터 자막 세 가지 일을 오늘 다 해야 한다고 말하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회 준비로 요약, 포스터, 자막 세 가지 일이 놓였어요. 윤아: "오늘 안에 셋 다 해야 해."',
            '체험회 준비로 세 가지 일이 한꺼번에 놓였습니다. 윤아: "요약이랑 포스터랑 자막… 오늘 안에 셋 다 해야 해."',
            '체험회 준비로 안내문 요약, 포스터 그림, 영상 자막이 한꺼번에 놓였습니다. 윤아: "오늘 안에 셋 다 해야 해." 세 가지 일은 서로 달랐습니다.',
            'AI 도구마다 받는 입력과 만드는 결과가 달라요.',
          ),
        },
        {
          id: 'one-tool-suggestion',
          label: '장면 2 · 한 도구만 쓰자는 제안',
          imageSrc: '/lessons/story/m1/m1-l9-scene-02.webp',
          alt: '진우가 글쓰기 AI 하나에 세 가지 일을 다 맡기자고 제안하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "글쓰기 AI가 익숙하니까 셋 다 맡기자!"',
            '진우: "글쓰기 AI가 제일 익숙하잖아. 셋 다 걔한테 맡기자!"',
            '진우: "글쓰기 AI가 제일 익숙하잖아. 셋 다 걔한테 맡기자!" 입력과 결과가 다르다는 것은 아직 살피지 않았습니다.',
            '유명하거나 익숙한 도구가 모든 일에 알맞은 것은 아니에요.',
          ),
        },
        {
          id: 'compare-tool-fit',
          label: '장면 3 · 입력과 결과 비교',
          imageSrc: '/lessons/story/m1/m1-l9-scene-03.webp',
          alt: '아이미가 상담원처럼 포스터에 필요한 입력과 결과를 되묻는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미: "포스터를 만들려면 무엇을 받아서 무엇을 만들어야 하나요?"',
            '아이미: "질문이 있어요. 포스터를 만들려면 저는 무엇을 받아서 무엇을 만들어야 하나요?"',
            '아이미: "질문이 있어요. 포스터를 만들려면 저는 무엇을 받아서 무엇을 만들어야 하나요? 자막은요? 요약은요?" 글, 그림, 소리가 서로 다른 입력임이 드러났습니다.',
            '도구를 고르기 전에 하려는 일과 필요한 결과를 먼저 정해요.',
          ),
        },
        {
          id: 'tool-workflow-plan',
          label: '장면 4 · 어떤 도구를 맡길까요?',
          imageSrc: '/lessons/story/m1/m1-l9-scene-04.webp',
          alt: '아이미가 세 가지 일에 어떤 도구를 맡길지 이유를 궁금해하는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "세 가지 일에 어떤 도구를 맡기실 건가요? 이유도 궁금해요!"',
            '아이미: "그럼 세 가지 일에 어떤 도구를 맡기실 건가요? 이유도 궁금해요!"',
            '아이미: "그럼 세 가지 일에 어떤 도구를 맡기실 건가요? 이유도 궁금해요! 입력과 결과, 확인 방법까지 함께 말씀해 주세요."',
            '좋은 선택은 도구 이름보다 목적과 확인 방법이 분명해요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '목적과 결과를 먼저 정해요',
          core: 'AI 도구를 고르기 전에 무엇을 만들고 누구에게 어떻게 사용할지 정합니다.',
          detail: {
            full: '먼저 할 일을 정해요.',
            light: '요약, 이미지, 자막처럼 필요한 결과의 형태를 구체적으로 말합니다.',
            challenge: '과제 목적, 쓸 사람, 결과 모양, 성공 기준을 먼저 정해야 어떤 도구가 알맞은지 비교할 수 있습니다.',
          },
        },
        {
          title: '입력과 출력이 맞는지 살펴요',
          core: '글, 그림, 소리처럼 넣을 수 있는 자료와 도구가 만드는 결과를 연결합니다.',
          detail: {
            full: '넣는 것과 나오는 것을 봐요.',
            light: '도구가 필요한 자료를 받을 수 있고 원하는 결과를 만들 수 있는지 확인합니다.',
            challenge: '입력 양식, 출력 유형, 접근성, 수정 가능성은 도구 선택의 핵심 조건입니다.',
          },
          flow: { input: '과제와 사용할 자료', process: '도구 기능과 조건 비교', output: '선택한 도구와 작업 흐름' },
        },
        {
          title: '확인 방법과 위험도 함께 골라요',
          core: '결과를 확인할 근거와 개인정보 위험을 살핀 뒤 도구를 선택합니다.',
          detail: {
            full: '안전하게 확인할 수 있는지 봐요.',
            light: '민감한 자료를 넣지 않고 원본이나 사람이 결과를 확인할 수 있어야 합니다.',
            challenge: '도구의 편리함뿐 아니라 검증 가능성, 데이터 노출 위험, 오류의 영향을 함께 비교해야 합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '한 도구로 모두 만들 수 있을까?',
      description: '행사 안내 요약, 포스터 이미지, 소개 영상 자막을 가장 익숙한 AI 도구 하나로 모두 만들자는 의견이 나왔습니다.',
      facts: [
        '세 과제는 글, 그림, 소리처럼 입력 자료가 다릅니다.',
        '필요한 결과도 요약문, 이미지, 자막으로 다릅니다.',
        '행사 자료에는 사람 얼굴과 목소리가 포함될 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '세 가지 일에 사용할 AI 도구를 어떻게 고르겠습니까?',
      choices: [
        { id: 'match-input-output', emoji: '🎯', label: '일마다 필요한 입력 자료와 결과를 먼저 비교하여 도구를 고릅니다.', isCorrect: true, reaction: '아이미: "좋은 순서예요! 일부터 정하면 도구는 따라와요."' },
        { id: 'check-privacy-fit', emoji: '🔒', label: '개인정보를 지킬 수 있는지, 사람이 확인할 수 있는지 살펴봅니다.', isCorrect: true, reaction: '윤아: "얼굴 사진은 함부로 안 올려."' },
        { id: 'choose-famous-tool', emoji: '⭐', label: '가장 유명한 도구 하나를 모든 종류의 일에 무조건 사용합니다.', isCorrect: false, reaction: '글쓰기 AI가 그림은 그릴 수 없어 작업이 멈췄습니다.' },
        { id: 'choose-fastest-tool', emoji: '⚡', label: '입력 조건이나 결과 확인 없이 가장 빠른 도구만 씁니다.', isCorrect: false, reaction: '확인하지 않은 결과가 그대로 쓰일 뻔했습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 선택이 과제의 목적에 맞는지 어떻게 확인할까요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '글쓰기 도구는 요약 초안을 만들었지만 직접 이미지를 만들거나 영상의 소리를 자막으로 바꾸지는 못했습니다.',
      facts: [
        '안내문 요약에는 원문과 핵심 정보 기준이 필요합니다.',
        '포스터에는 저작권과 초상권을 지키는 이미지 자료가 필요합니다.',
        '자막에는 소리 입력과 원래 영상의 확인이 필요합니다.',
        '학생 얼굴과 목소리를 외부 도구에 입력하지 않는 조건이 추가되었습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 도구 비교 의견',
      text: '익숙한 도구 하나보다 각 일의 입력과 결과에 맞는 도구를 나누는 편이 좋아요. 어떤 도구를 쓰든 원본 확인과 개인정보 보호 단계는 사람이 맡아야 해요.',
      question: '아이미의 제안에 어떤 선택 기준을 더 넣고 싶나요?',
    },
    artifact: {
      kind: 'workflow-plan',
      title: '도구 선택 계획서',
      prompt: '과제 목적, 입력, 필요한 결과, 도구 선택, 확인 근거, 사람의 역할을 연결해 봐요.',
    },
    transfer: {
      title: '여행 사진을 설명한다면',
      description: '친구가 볼 수 있도록 여행 사진의 장면 설명과 짧은 음성 안내를 만들려고 합니다.',
      prompt: '나만의 표현으로 목적에 맞는 AI 도구를 선택하는 방법을 설명해 봐요.',
      choices: [
        { id: 'plan-photo-tools', emoji: '🗺️', label: '사진 묘사 도구와 음성 변환 도구 각각의 입력과 결과를 구분해 선택합니다.', isCorrect: true, reaction: '두 도구를 나누어 쓰니 결과가 훨씬 정확했습니다.' },
        { id: 'verify-photo-description', emoji: '👁️', label: '얼굴 사진을 함부로 넣지 않고 생성된 설명이 실제 사진과 맞는지 확인합니다.', isCorrect: true, reaction: '설명과 사진을 비교하니 안심하고 쓸 수 있었습니다.' },
        { id: 'upload-private-photo', emoji: '📤', label: '친구 얼굴이 보이는 사진을 확인되지 않은 외부 도구에 올립니다.', isCorrect: false, reaction: '친구 얼굴이 확인 안 된 곳에 남게 됐습니다.' },
        { id: 'use-random-single-tool', emoji: '🎲', label: '도구 기능이나 개인정보 위험을 살피지 않고 아무 도구나 씁니다.', isCorrect: false, reaction: '엉뚱한 설명이 나와도 확인할 방법이 없었습니다.' },
      ],
    },
    safetyNote: '학생의 실제 얼굴과 목소리는 도구에 입력하지 않고 수업용 대체 자료를 사용합니다.',
  };
