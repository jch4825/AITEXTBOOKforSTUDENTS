import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_SAFETY_NOTE } from './shared';

export const M4_L2_STUDIO: StudioDefinition = {
    id: 'm4-source-trust-lab',
    lessonId: 'm4-l2',
    moduleId: 'm4',
    title: '더 믿을 만한 자료 고르기',
    subtitle: '누가 쓴지 모르는 글, 지난 공지, 최신 공식 공지를 같은 기준으로 비교해 봐요.',
    format: 'B',
    visualNovel: {
      title: '“체험회가 취소됐대” 소문',
      objective: '같은 소식을 말하는 세 자료의 출처와 날짜를 비교해, 더 믿을 만한 자료를 이유와 함께 골라요.',
      seasonTag: '[안전 지킴이 · 2화] 취소됐대 소문',
      nextEpisodeHook: '다음 시간 — 도움을 구하다 정보가 너무 많이!',
      scenes: [
        {
          id: 'm4-l2-rumor-arrives',
          label: '누가 쓴지 모르는 글',
          imageSrc: '/lessons/story/m4/m4-l2-scene-01.webp',
          alt: '진우가 취소 소문을 빨리 알리려 하고 윤아가 누가 쓴 건지부터 보자고 말리는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회가 취소됐다는 글이 돌았어요. 진우: "빨리 다 알려야…" 윤아: "잠깐!"',
            '체험회가 취소됐다는 글이 돌았습니다. 진우: "체험회 취소래! 빨리 다 알려야…" 윤아: "잠깐! 누가 쓴 건지부터 보자."',
            '체험회가 취소됐다는 글이 돌았습니다. 보낸 사람도 원래 게시 장소도 없었습니다. 진우: "빨리 알려야…" 윤아: "누가 쓴 건지부터 보자."',
            '윤아는 급한 소문을 보자 걱정됐지만 전달하기 전에 자료를 찾기로 했습니다.',
          ),
        },
        {
          id: 'm4-l2-three-sources',
          label: '세 자료',
          imageSrc: '/lessons/story/m4/m4-l2-scene-02.webp',
          alt: '누가 쓴지 모르는 캡처 지난달 공지 오늘 학교 공지가 나란히 놓인 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '누가 쓴지 모르는 글, 지난달 취소 공지, 오늘 학교 공지를 나란히 놓았어요.',
            '누가 쓴지 모르는 캡처, 지난달 우천 취소 공지, 오늘 학교 홈페이지의 정상 운영 공지가 함께 놓였습니다.',
            '누가 쓴지 모르는 캡처, 지난달 우천 취소 공지, 오늘 학교 홈페이지의 정상 운영 공지가 함께 놓였습니다. 셋 다 그럴듯해 보였습니다.',
            '윤아는 지난 공지도 학교 자료지만 이번 행사와 날짜가 다르다는 점을 발견했습니다.',
          ),
        },
        {
          id: 'm4-l2-source-grid',
          label: '출처 기준',
          imageSrc: '/lessons/story/m4/m4-l2-scene-03.webp',
          alt: '윤아가 누가 언제 원래 글은 어디에 있는지 물으며 기준표를 채우는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "누가? 언제? 원래 글은 어디에?" 세 자료에 하나씩 표시했어요.',
            '윤아: "누가? 언제? 원래 글은 어디에?" 세 자료에 쓴 사람, 날짜, 원래 글 링크를 표시했습니다.',
            '윤아: "누가? 언제? 원래 글은 어디에?" 세 자료에 쓴 사람, 날짜, 원래 글 링크를 표시했습니다. 표시까지만 마쳤을 뿐 아직 고르지 않았습니다.',
            '진우도 가장 큰 글씨보다 확인 가능한 자료를 고르기로 했습니다.',
          ),
        },
        {
          id: 'm4-l2-correction-share',
          label: '뭘 믿어야 해?',
          imageSrc: '/lessons/story/m4/m4-l2-scene-04.webp',
          alt: '진우가 기준표는 다 채웠으니 셋 중 뭘 믿어야 하는지 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '진우: "기준표는 다 채웠어. 셋 중 뭘 믿어야 해?"',
            '진우: "기준표는 다 채웠어. 그래서… 셋 중 뭘 믿어야 해?"',
            '진우: "기준표는 다 채웠어. 그래서… 셋 중 뭘 믿어야 해? 이유도 같이 말해 줘."',
            '윤아는 소문을 만든 사람을 비난하지 않고 확인한 사실만 전달하기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '처음 나온 곳을 찾을 수 있어야 해요',
          core: '누가 어디에 언제 게시했는지 확인합니다.',
          detail: {
            full: '보낸 사람과 원래 글이 보이는지 찾아요.',
            light: '쓴 사람, 올라온 곳, 날짜를 표시합니다.',
            challenge: '다시 보낸 캡처는 앞뒤 내용이 빠질 수 있습니다. 처음 나온 곳을 찾아봅니다.',
          },
        },
        {
          title: '날짜와 현재 상황을 연결해요',
          core: '공식 자료도 오래됐거나 다른 사건의 공지일 수 있습니다.',
          detail: {
            full: '오늘 행사와 같은 날짜인지 봐요.',
            light: '지난 공지와 최신 공지를 구분합니다.',
            challenge: '자료를 낸 곳이 믿을 만한지와 날짜가 지금 질문에 맞는지를 따로 확인합니다.',
          },
          flow: { input: '세 자료', process: '출처·날짜 비교', output: '선택 근거' },
        },
        {
          title: '확인한 근거와 함께 알려요',
          core: '결론과 출처를 함께 공유하면 다른 사람도 확인할 수 있습니다.',
          detail: {
            full: '어디에서 확인했는지 같이 말해요.',
            light: '출처와 날짜가 있는 수정 문장을 만듭니다.',
            challenge: '고쳐 알려 줄 때는 비난보다 확인한 사실과 다시 볼 방법을 말합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '취소 소문을 바로 친구에게 보내도 될까',
      description: '세 자료 중 오늘 체험회를 하는지 확인할 자료를 골라야 합니다.',
      facts: [
        '누가 쓴지 모르는 캡처에는 원래 글 주소와 쓴 사람이 없습니다.',
        '지난달 학교 공지는 다른 행사의 우천 취소 내용입니다.',
        '오늘 학교 홈페이지에는 정상 운영 공지가 있습니다.',
        '정상 운영 공지에는 학교 담당 부서와 게시 시간이 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '가장 먼저 믿을 자료를 골라 보세요.',
      choices: [
        { id: 'anonymous-capture', emoji: '📱', label: '친구가 보낸, 누가 쓴지 모르는 캡처를 골라요.', reaction: '처음 나온 곳을 아무리 찾아도 보이지 않았습니다.' },
        { id: 'latest-official', emoji: '🏫', label: '오늘 담당 부서가 게시한 공식 공지를 골라요.', reaction: '윤아: "오늘 날짜, 담당 부서, 원문 링크. 세 가지가 다 있네."' },
        { id: 'old-official', emoji: '📄', label: '학교 이름이 있는 지난달 공지를 골라요.', reaction: '학교 자료였지만 날짜를 보니 다른 행사의 공지였습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '그 자료를 고른 근거를 출처와 날짜로 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '각 자료의 원문, 작성 주체, 게시 날짜가 공개됩니다.',
      facts: [
        '누가 쓴지 모르는 캡처는 원래 글을 찾을 수 없습니다.',
        '지난달 공지는 날짜와 행사 이름이 다릅니다.',
        '오늘 공지는 현재 체험회 이름과 날짜가 같습니다.',
        '오늘 공지는 학교 공식 홈페이지 담당 부서가 게시했습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '세 자료를 같은 기준으로 정리하는 AI',
      text: '누가 쓴지 모르는 캡처는 처음 나온 곳을 찾을 수 없고, 지난달 공지는 다른 행사입니다. 오늘 학교 담당 부서의 공지가 현재 체험회와 날짜가 같습니다.',
      question: '공식 자료라는 이유만으로 지난달 공지도 현재 근거가 될 수 있을까요?',
    },
    artifact: {
      kind: 'comparison-table',
      title: '출처 비교 카드',
      prompt: '세 자료의 쓴 사람, 날짜, 원래 글, 지금 일과 맞는지, 마지막으로 고른 이유를 적어 보세요.',
    },
    transfer: {
      title: '준비물 변경 소식 확인하기',
      description: '친구 메시지와 어제 반 공지, 오늘 담당 선생님 공지가 서로 다릅니다. 무엇을 기준으로 고르겠어요?',
      choices: [
        { id: 'friend-message', emoji: '💬', label: '가장 먼저 받은 친구 메시지를 골라요.', reaction: '먼저 왔다고 해서 가장 정확한 것은 아니었습니다.' },
        { id: 'today-teacher', emoji: '✅', label: '오늘 담당 선생님 공지의 날짜와 내용을 확인해요.', reaction: '오늘 날짜와 담당자가 확실한 근거가 됐습니다.' },
        { id: 'yesterday-class', emoji: '📅', label: '어제 반 공지만 봐요.', reaction: '어제 공지는 오늘 바뀐 내용을 담지 못했습니다.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  };
