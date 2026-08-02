import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_PROBLEM_NOTE } from './shared';

export const M5_L6_STUDIO: StudioDefinition = {
    id: 'm5-safe-clarification',
    lessonId: 'm5-l6',
    moduleId: 'm5',
    title: 'AI가 다르게 알아들었을 때',
    subtitle: 'AI 추정과 빠진 정보를 찾고 개인정보 없이 안전한 위치 단서를 더해 봐요.',
    format: 'B',
    visualNovel: {
      title: '“도서관 앞 부스”가 다른 장소였어요',
      objective: '아이미가 다르게 알아들은 까닭을 찾고, 개인정보 없이 필요한 단서만 더해 다시 요청해요.',
      seasonTag: '[체험회 D-4 · 6화] 엉뚱한 도서관',
      nextEpisodeHook: '다음 시간 — 긴 설치 안내, 다 기억할 수 있을까.',
      scenes: [
        {
          id: 'm5-l6-wrong-library',
          label: '다른 장소',
          imageSrc: '/lessons/story/m5/m5-l6-scene-01.webp',
          alt: '아이미가 마을 도서관을 안내하고 진우가 우리 학교 도서관인데 라고 당황하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '부스 위치를 안내받으려 했어요. 아이미: "마을 도서관까지 15분입니다!" 진우: "우리 학교 도서관인데?"',
            '부스 위치를 안내받으려 했습니다. 진우: "도서관 앞 부스 알려 줘!" 아이미: "마을 도서관까지 15분입니다!" 진우: "…우리 학교 도서관인데?"',
            '부스 위치를 안내받으려 했습니다. 아이미: "안내 완료! 마을 도서관까지 걸어서 15분입니다!" 진우: "…우리 학교 도서관인데?"',
            '진우는 자기 탓으로 돌리거나 포기하지 않고 AI가 무엇을 추정했는지 살펴보았습니다.',
          ),
        },
        {
          id: 'm5-l6-request-assumption',
          label: '요청과 추정',
          imageSrc: '/lessons/story/m5/m5-l6-scene-02.webp',
          alt: '윤아가 네 탓도 아이미 탓도 아니라며 요청에 어느 건물이 없었을 뿐이라고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "네 탓도 아이미 탓도 아니야. 요청에 \'어느 건물\'이 없었을 뿐이야."',
            '윤아: "네 탓도 아이미 탓도 아니야. 요청에 \'어느 건물\'이 없었을 뿐이야." 아이미는 가장 가까운 공공 도서관을 추정했습니다.',
            '윤아: "네 탓도 아이미 탓도 아니야. 요청에 \'어느 건물\'이 없었을 뿐이야." 아이미는 가장 가까운 공공 도서관을 추정했고, 진짜 목표는 학교 안 2층이었습니다.',
            '윤아는 학교 이름이나 주소 없이도 내부 위치를 설명할 수 있다고 보았습니다.',
          ),
        },
        {
          id: 'm5-l6-safe-clues',
          label: '안전한 단서',
          imageSrc: '/lessons/story/m5/m5-l6-scene-03.webp',
          alt: '아이미가 학교 이름을 알려 달라고 하고 윤아가 이름 없이도 된다며 안전한 단서를 제안하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "학교 이름을 알려 주시면…" 윤아: "이름 없이도 돼. \'2층 초록 표지 앞\' 정도면?"',
            '아이미: "학교 이름을 알려 주시면…" 윤아: "잠깐, 이름 없이도 돼. \'지금 건물 안, 2층, 초록 표지 앞\' — 이 정도면?"',
            '아이미: "학교 이름을 알려 주시면…" 윤아: "잠깐, 이름 없이도 돼. \'지금 건물 안, 2층, 초록 표지 앞\' — 이 정도면?" 필요한 단서만 남았습니다.',
            '진우는 안전한 단서로 요청을 고치고 공식 배치도와 다시 비교했습니다.',
          ),
        },
        {
          id: 'm5-l6-corrected-route',
          label: '어떤 단서를 넣을까?',
          imageSrc: '/lessons/story/m5/m5-l6-scene-04.webp',
          alt: '아이미가 다시 요청해 달라며 이번엔 어떤 단서를 넣을지 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "다시 요청해 주세요. 어떤 단서를 넣으시겠어요?"',
            '아이미: "다시 요청해 주세요. 이번엔 어떤 단서를 넣으시겠어요?"',
            '아이미: "다시 요청해 주세요. 이번엔 어떤 단서를 넣으시겠어요? 개인정보는 빼고요."',
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
        { id: 'add-school-address', emoji: '📍', label: '학교 이름과 자세한 주소를 모두 적어요.', reaction: '아이미: "그 정보까지는 필요 없어요. 안전을 위해 빼요."' },
        { id: 'safe-location-clues', emoji: '🟢', label: '현재 건물 안·2층·초록 표지처럼 필요한 단서만 더해요.', reaction: '아이미: "건물 안 2층 초록 표지! 이제 정확히 알겠어요."' },
        { id: 'blame-student', emoji: '🙍', label: '내가 애매하게 말한 탓이라고만 생각해요.', reaction: '원인을 찾지 않으면 다음에도 같은 일이 생길 수 있었습니다.' },
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
        { id: 'share-home-route', emoji: '🏠', label: '집에서 학교까지 오는 경로를 모두 알려요.', reaction: '필요하지 않은 개인 정보까지 담기게 됐습니다.' },
        { id: 'use-building-clues', emoji: '🏀', label: '현재 건물 안·입구 번호·부스 표지 색을 더해요.', reaction: '건물 안 단서만으로도 정확히 찾을 수 있었습니다.' },
        { id: 'repeat-same-request', emoji: '🔁', label: '같은 문장을 그대로 반복해요.', reaction: '같은 요청은 같은 추정만 반복했습니다.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  };
