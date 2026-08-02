import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';

export const M3_L8_STUDIO: StudioDefinition = {
    id: 'm3-delayed-answer-quiz-studio',
    lessonId: 'm3-l8',
    moduleId: 'm3',
    title: '정답을 나중에 보는 퀴즈',
    subtitle: '먼저 떠올리고 답한 뒤 정답과 해설을 확인하는 퀴즈를 설계해요.',
    format: 'E',
    visualNovel: {
      title: '문제 옆에 정답이 먼저 보인다면',
      objective: '먼저 풀고 나중에 정답을 보는 양면 퀴즈 카드를, 아이미가 만든 문제를 고쳐서 완성해요.',
      seasonTag: '[공부 짝꿍 · 8화] 정답이 먼저 보이는 퀴즈',
      nextEpisodeHook: '다음 시간 — 가방을 들면 소풍일까?',
      scenes: [
        {
          id: 'm3-l8-answer-visible',
          label: '정답이 보이는 퀴즈',
          imageSrc: '/lessons/story/m3/m3-l8-scene-01.webp',
          alt: '아이미가 문제 바로 아래에 정답과 해설을 함께 넣은 퀴즈를 자랑하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미가 복습 퀴즈를 만들었어요. 진우: "정답이 먼저 보이면… 푸는 건가, 읽는 건가?"',
            '아이미가 복습 퀴즈를 만들었습니다. 아이미: "문제 바로 아래 정답과 해설까지 넣었어요!" 진우: "이거 푸는 건가, 읽는 건가?"',
            '아이미가 복습 퀴즈를 만들었습니다. 아이미: "문제 아래 정답과 해설까지 넣었어요!" 진우: "정답이 먼저 보이면 푸는 건가, 읽는 건가?"',
            '윤아는 많이 알려 주는 퀴즈가 항상 잘 가르치는 것은 아니라고 느꼈습니다.',
          ),
        },
        {
          id: 'm3-l8-first-order',
          label: '공부 순서 정하기',
          imageSrc: '/lessons/story/m3/m3-l8-scene-02.webp',
          alt: '윤아가 정답을 보고 맞힌 것도 내 실력일지 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "정답을 보고 맞힌 것도 내 실력일까?" 공부 순서를 떠올렸어요.',
            '윤아: "정답을 보고 맞힌 것도 내 실력일까?" 문제 보기, 먼저 답하기, 정답 확인하기, 다시 풀기 순서가 떠올랐습니다.',
            '윤아: "정답을 보고 맞힌 것도 내 실력일까?" 문제 보기, 먼저 답하기, 정답과 이유 확인하기, 다시 풀기 순서가 떠올랐습니다. 순서 카드를 발견한 순간이었습니다.',
            '윤아는 틀려도 다시 풀 수 있는 구조라면 안전하게 도전할 수 있다고 생각했습니다.',
          ),
        },
        {
          id: 'm3-l8-quiz-compare',
          label: '두 퀴즈 비교',
          imageSrc: '/lessons/story/m3/m3-l8-scene-03.webp',
          alt: '정답 공개 퀴즈와 정답 숨김 퀴즈를 나란히 놓고 체험을 비교하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '같은 문제를 두 방식으로 풀었어요. 정답을 숨긴 쪽은 이유를 먼저 말할 수 있었어요.',
            '정답을 숨긴 퀴즈에서는 먼저 이유를 말하고 틀린 부분을 고칠 수 있었습니다. 정답이 바로 보이는 쪽은 그냥 읽고 넘어갔습니다.',
            '정답을 숨긴 퀴즈에서는 먼저 이유를 말하고 틀린 부분을 고칠 수 있었습니다. 정답이 바로 보이는 쪽은 그냥 읽고 넘어갔습니다. 체험의 차이가 분명했습니다.',
            '윤아는 정답 공개 시점과 힌트의 양을 다시 조정했습니다.',
          ),
        },
        {
          id: 'm3-l8-two-sided-card',
          label: '앞면과 뒷면, 무엇을 넣을까?',
          imageSrc: '/lessons/story/m3/m3-l8-scene-04.webp',
          alt: '아이미가 앞면과 뒷면에 무엇을 어떤 순서로 넣을지 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "앞면과 뒷면에 무엇을 넣으시겠어요?"',
            '아이미: "재료는 다 드렸어요. 앞면과 뒷면에 무엇을 어떤 순서로 넣으시겠어요?"',
            '아이미: "재료는 다 드렸어요. 앞면과 뒷면에 무엇을 어떤 순서로 넣으시겠어요? 힌트와 다시 풀기도 생각해 주세요."',
            '윤아는 친구가 틀려도 부끄럽지 않게 다시 도전할 수 있는 문장을 넣기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '정답보다 회상이 먼저예요',
          core: '배운 내용을 보지 않고 먼저 떠올려 보는 과정이 학습을 확인하게 합니다.',
          detail: {
            full: '문제를 보고 내 답을 먼저 골라요.',
            light: '정답을 보기 전에 이유를 표현합니다.',
            challenge: '정답을 먼저 보면 맞힌 것처럼 보일 수 있습니다. 먼저 내 답을 골라야 기억한 것을 볼 수 있습니다.',
          },
        },
        {
          title: '퀴즈에는 학습 순서가 있어요',
          core: '회상, 응답, 피드백, 다시 풀기의 순서로 진행합니다.',
          detail: {
            full: '네 단계 카드를 차례로 놓아요.',
            light: '정답과 해설은 응답 뒤에 엽니다.',
            challenge: '힌트는 응답을 대신하지 않도록 단계적으로 제공하고 공개 시점을 설계합니다.',
          },
          flow: { input: '배운 내용', process: '회상→응답→피드백', output: '다시 풀기' },
        },
        {
          title: '해설은 다시 생각할 단서를 줘요',
          core: '피드백은 정답과 함께 이유와 다시 풀 방법을 알려 줍니다.',
          detail: {
            full: '맞고 틀린 까닭을 확인해요.',
            light: '첫 답과 다시 푼 답을 비교합니다.',
            challenge: '해설은 왜 틀렸는지 알려 주고 다음에는 어떻게 풀지 정하게 도와야 합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '정답을 보고 맞힌 것도 내 실력일까',
      description: '문제와 정답이 동시에 보이는 퀴즈를 학습 순서에 맞는 양면 카드로 고칩니다.',
      facts: [
        '첫 퀴즈에는 문제 아래 정답이 바로 보입니다.',
        '방문자는 답을 떠올리기 전에 정답을 읽게 됩니다.',
        '퀴즈는 배운 내용을 확인하고 다시 배우기 위한 활동입니다.',
        '틀린 응답도 피드백 뒤에 다시 풀 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '배움에 도움이 되는 퀴즈 순서를 먼저 골라 보세요.',
      choices: [
        { id: 'answer-first', emoji: '👀', label: '정답과 해설을 먼저 읽고 문제를 봐요.', reaction: '읽고 나니 아는 것 같았지만 기억엔 잘 남지 않았습니다.' },
        { id: 'respond-first', emoji: '✋', label: '문제에 먼저 답한 뒤 정답과 이유를 봐요.', reaction: '윤아: "맞아. 떠올리려고 애쓴 만큼 기억에 남아."' },
        { id: 'only-score', emoji: '🏁', label: '점수만 보고 퀴즈를 끝내요.', reaction: '어디를 틀렸는지 모른 채 그대로 지나갔습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '내가 고른 순서가 기억을 확인하는 데 어떻게 도움이 되는지 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '회상, 응답, 피드백, 다시 풀기 단계 카드를 배열합니다.',
      facts: [
        '정답을 보기 전에 내 응답을 남깁니다.',
        '피드백은 정답과 이유를 함께 보여 줍니다.',
        '힌트는 필요할 때 한 단계씩 엽니다.',
        '피드백 뒤에 같은 개념을 다시 풀어 봅니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '문제와 정답을 동시에 만든 AI',
      text: '문제: 생태계는 무엇일까요? 정답: 생물과 환경이 서로 영향을 주는 체계입니다. 해설: 연못의 생물과 물, 햇빛을 떠올려 보세요.',
      question: '이 내용을 어떤 순서와 앞·뒷면으로 나누면 먼저 생각할 수 있을까요?',
    },
    artifact: {
      kind: 'visual-plan',
      title: '문제-정답-해설 양면 카드',
      prompt: '앞면의 문제와 응답 칸, 뒷면의 정답·이유·다시 풀기 단서를 설계해 보세요.',
    },
    transfer: {
      title: '친구 퀴즈를 먼저 풀어 보기',
      description: '친구가 만든 낱말 퀴즈를 정답을 보지 않고 먼저 풀고 피드백을 사용해 보세요.',
      choices: [
        { id: 'hide-answer', emoji: '🙈', label: '정답 부분을 가리고 먼저 답해요.', reaction: '가리고 답하니 무엇을 아는지 스스로 알 수 있었습니다.' },
        { id: 'explain-reason', emoji: '💬', label: '답을 고른 이유를 표현해요.', reaction: '이유를 말하니 다음 힌트가 더 잘 이해됐습니다.' },
        { id: 'retry', emoji: '🔄', label: '해설을 본 뒤 한 번 더 풀어요.', reaction: '다시 풀어 보니 처음보다 훨씬 잘 풀렸습니다.' },
      ],
    },
    safetyNote: '퀴즈의 틀린 답은 혼낼 자료가 아니라 다음 설명과 도움을 정하는 기록입니다.',
  };
