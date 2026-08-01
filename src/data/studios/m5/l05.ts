import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_PROBLEM_NOTE } from './shared';

export const M5_L5_STUDIO: StudioDefinition = {
    id: 'm5-adjustable-help',
    lessonId: 'm5-l5',
    moduleId: 'm5',
    title: '답 대신 필요한 만큼 도움받기',
    subtitle: '첫 시도를 남기고 작은 단서·과정 질문·부분 예시 중 필요한 도움을 골라봐요.',
    format: 'D',
    visualNovel: {
      title: '포스터 배치 퍼즐에서 막혔어요',
      objective: '막힌 문제에서 완성 답 대신, 아이미에게 필요한 만큼의 힌트만 골라 받아 내 방법을 고쳐요.',
      seasonTag: '[체험회 D-4 · 5화] 막힌 포스터 퍼즐',
      nextEpisodeHook: '다음 시간 — 아이미가 다른 도서관으로?',
      scenes: [
        {
          id: 'm5-l5-first-layout',
          label: '첫 배치',
          imageSrc: '/lessons/story/m5/m5-l5-scene-01.webp',
          alt: '진우가 내 방법으로 먼저 놓아 봤지만 이 글자가 잘 안 보인다며 막힌 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "내 방법으로 먼저 놓아 봤어. …그런데 이 글자가 잘 안 보여. 막혔다."',
            '진우: "내 방법으로 먼저 놓아 봤어. …그런데 이 글자가 잘 안 보여. 막혔다." 제목과 그림은 자리를 잡았습니다.',
            '진우: "내 방법으로 먼저 놓아 봤어. …그런데 이 글자가 잘 안 보여. 막혔다." 제목과 그림은 자리를 잡았습니다. 안내 문장 한 부분만 걸렸습니다.',
            '진우는 완성 답을 보기 전에 자신의 생각을 더 이어 가고 싶었습니다.',
          ),
        },
        {
          id: 'm5-l5-help-levels',
          label: '도움 수준',
          imageSrc: '/lessons/story/m5/m5-l5-scene-02.webp',
          alt: '아이미가 작은 단서 질문 하나 부분 예시 완성 답 중 어느 것부터 보여 줄지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '아이미: "도움에는 크기가 있어요. 어느 것부터 보여 드릴까요?"',
            '아이미: "도움에는 크기가 있어요. 작은 단서, 질문 하나, 부분 예시, 완성 답 — 어느 것부터 보여 드릴까요?"',
            '아이미: "도움에는 크기가 있어요. 작은 단서, 질문 하나, 부분 예시, 완성 답 — 어느 것부터 보여 드릴까요?" 도움이 커질수록 결정할 몫은 줄었습니다.',
            '윤아는 필요한 만큼만 가림막을 열어도 된다고 말했습니다.',
          ),
        },
        {
          id: 'm5-l5-answer-vs-hint',
          label: '영향 비교',
          imageSrc: '/lessons/story/m5/m5-l5-scene-03.webp',
          alt: '윤아가 완성 답은 빠르지만 첫 생각이 어디서 바뀌었는지 모른다고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "완성 답을 보면 빨라. 대신 네 첫 생각이 어디서 바뀌었는지는 몰라."',
            '윤아: "완성 답을 보면 빨라. 대신 네 첫 생각이 어디서 바뀌었는지는 몰라." 진우는 아직 고르지 않았습니다.',
            '윤아: "완성 답을 보면 빨라. 대신 네 첫 생각이 어디서 바뀌었는지는 몰라." 진우는 아직 고르지 않았습니다. 도움의 크기마다 남는 몫이 달랐습니다.',
            '진우는 막힌 부분 하나에만 도움을 받으면 충분할지 고민했습니다.',
          ),
        },
        {
          id: 'm5-l5-revised-layout',
          label: '당신 차례예요',
          imageSrc: '/lessons/story/m5/m5-l5-scene-04.webp',
          alt: '아이미가 지금 막힌 곳에 어느 크기의 도움이 필요한지 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "그럼 당신 차례예요. 어느 크기의 도움이 필요한가요?"',
            '아이미: "그럼 당신 차례예요. 지금 막힌 곳에는 어느 크기의 도움이 필요한가요?"',
            '아이미: "그럼 당신 차례예요. 지금 막힌 곳에는 어느 크기의 도움이 필요한가요? 작은 것부터 골라도 좋아요."',
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
        { id: 'complete-answer', emoji: '📄', label: '완성된 포스터 답을 그대로 봐요.', reaction: '빨리 끝났지만 내가 정한 부분은 거의 없었습니다.' },
        { id: 'small-hint', emoji: '💡', label: '막힌 부분을 찾는 작은 단서나 과정 질문을 골라요.', reaction: '아이미: "\'가장 먼저 읽을 것은 무엇일까요?\' — 이 질문 하나면 될까요?"' },
        { id: 'start-over', emoji: '🗑️', label: '잘된 부분도 모두 지우고 처음부터 해요.', reaction: '이미 잘 됐던 제목과 그림 배치까지 다시 해야 했습니다.' },
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
        { id: 'show-full-order', emoji: '📋', label: '전체 순서 정답을 바로 보여 달라고 해요.', reaction: '순서는 맞았지만 왜 그런지는 알 수 없었습니다.' },
        { id: 'choose-process-question', emoji: '❔', label: '어떤 단계가 다음 단계에 필요한지 묻는 힌트를 골라요.', reaction: '질문 하나로 스스로 이유를 찾을 수 있었습니다.' },
        { id: 'quit-puzzle', emoji: '🚪', label: '막혔으니 퍼즐을 끝내요.', reaction: '작은 힌트 하나면 계속할 수 있었습니다.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  };
