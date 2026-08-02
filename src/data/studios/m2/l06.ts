import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_AI_NOTE } from './shared';

export const M2_L6_STUDIO: StudioDefinition = {
    id: 'm2-stepwise-request-workshop',
    lessonId: 'm2-l6',
    moduleId: 'm2',
    title: '요청 공동 제작소',
    subtitle: '큰 과제를 작은 단계로 나누고 앞 단계 결과를 다음 요청에 이어 써 봐요.',
    format: 'E',
    visualNovel: {
      title: '체험회 준비표에 빠진 것이 많아요',
      objective: '큰 부탁을 작은 단계로 나누고, 앞 단계에서 받은 아이미의 답을 다음 부탁에 이어 써요.',
      seasonTag: '[부탁의 달인 · 6화] 구멍 난 준비표',
      nextEpisodeHook: '다음 시간 — 쉬워졌는데 뭔가 사라졌어요.',
      scenes: [
        {
          id: 'one-big-event-request',
          label: '장면 1 · 막연한 요청',
          imageSrc: '/lessons/story/m2/m2-l6-scene-01.webp',
          alt: '진우가 체험회 준비를 전부 아이미에게 맡기자고 말하는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '체험회 준비표를 만들 차례예요. 진우: "체험회 준비, 전부 아이미한테 맡기자!"',
            '체험회 준비표를 만들 차례였습니다. 진우: "체험회 준비, 전부 아이미한테 맡기자! 아이미야, 준비표 완성!"',
            '체험회 준비표를 만들 차례였습니다. 진우: "전부 아이미한테 맡기자! 아이미야, 준비표 완성!" 장소와 일정 자료는 아직 주지 않았습니다.',
            '큰 과제는 필요한 자료와 순서를 놓치기 쉬워요.',
          ),
        },
        {
          id: 'incomplete-event-plan',
          label: '장면 2 · 빠진 준비표',
          imageSrc: '/lessons/story/m2/m2-l6-scene-02.webp',
          alt: '아이미가 장소와 시간 칸을 비워 둔 이유를 스스로 밝히는 장면',
          knowledgeStep: 0,
          copy: sceneCopy(
            '아이미: "완성했어요! 그런데 장소와 시간 칸은 비워 두었어요. 저는 모르거든요."',
            '아이미: "완성했어요! …그런데 장소와 시간 칸은 비워 두었어요. 저는 그걸 모르거든요."',
            '아이미: "완성했어요! …그런데 장소와 시간 칸은 비워 두었어요. 저는 그걸 모르거든요." 물건 칸만 채워져 있었습니다.',
            '결과가 빠졌다면 과제를 단계로 다시 나눠요.',
          ),
        },
        {
          id: 'collect-event-materials',
          label: '장면 3 · 자료와 단계 모으기',
          imageSrc: '/lessons/story/m2/m2-l6-scene-03.webp',
          alt: '윤아가 아이미가 모르는 것을 누가 먼저 알려 줘야 할지 확인하는 장면',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "아이미가 모르는 걸 누가 먼저 알려 줘야 하지? 무엇부터?"',
            '윤아: "아이미가 모르는 걸 누가 먼저 알려 줘야 하지? 무엇부터?"',
            '윤아: "아이미가 모르는 걸 누가 먼저 알려 줘야 하지? 무엇부터?" 장소, 일정, 준비물 순서를 하나씩 짚어 보았습니다.',
            '앞 단계 결과가 다음 단계의 입력이 돼요.',
          ),
        },
        {
          id: 'stepwise-event-plan',
          label: '장면 4 · 첫 번째 부탁은?',
          imageSrc: '/lessons/story/m2/m2-l6-scene-04.webp',
          alt: '윤아가 첫 번째 부탁을 무엇으로 할지 학생에게 묻는 장면',
          knowledgeStep: 2,
          copy: sceneCopy(
            '윤아: "좋아, 단계를 나누자. 첫 번째 부탁은 무엇으로 하겠어?"',
            '윤아: "좋아, 단계를 나누자. 첫 번째 부탁은 무엇으로 하겠어?"',
            '윤아: "좋아, 단계를 나누자. 첫 번째 부탁은 무엇으로 하겠어? 그다음은 그 결과를 보고 정하자."',
            '중간 확인은 오류가 다음 단계로 이어지는 것을 막아요.',
          ),
        },
      ],
      knowledge: [
        {
          title: '큰 과제를 작은 단계로 나눠요',
          core: '복잡한 요청을 목적 확인, 자료 수집, 초안, 검토 단계로 나눕니다.',
          detail: {
            full: '큰 부탁을 작은 부탁으로 나눠요.',
            light: '각 단계가 한 가지 분명한 결과를 만들도록 정합니다.',
            challenge: '복잡한 과제를 검토 가능한 하위 과제로 분해하면 누락 원인과 수정 지점을 찾기 쉬워집니다.',
          },
        },
        {
          title: '앞 결과를 다음 입력으로 써요',
          core: '확인한 장소와 일정 같은 중간 결과를 다음 요청에 이어 사용합니다.',
          detail: {
            full: '앞에서 찾은 내용을 다음에 넣어요.',
            light: '앞 단계 결과를 그대로 넘기기 전에 맞는지 확인합니다.',
            challenge: '확인한 중간 결과만 다음 단계에 넣으면 대화의 앞뒤 흐름과 작업이 잘 이어집니다.',
          },
          flow: { input: '목적과 기능 자료', process: '단계별 요청·중간 확인', output: '완성된 준비표' },
        },
        {
          title: '중간 확인 지점을 정해요',
          core: '각 단계 뒤에 누락과 사실을 확인하고 다음으로 넘어갑니다.',
          detail: {
            full: '한 단계씩 확인해요.',
            light: '문제가 생기면 마지막이 아니라 그 단계에서 바로 고칩니다.',
            challenge: '검토 지점을 미리 두면 오류가 누적되는 것을 줄이고 수정 비용을 낮출 수 있습니다.',
          },
        },
      ],
    },
    encounter: {
      title: '체험회 준비표에 빠진 것이 많아요',
      description: '체험회 준비를 한 번에 부탁하자 아이미가 장소, 시간, 담당이 빠진 준비표를 만들었습니다.',
      facts: [
        '준비표를 만들려면 장소도, 일정, 참가 인원 자료가 필요합니다.',
        '장소에 따라 필요한 물건이 달라집니다.',
        '완성 전에 누락과 담당을 확인해야 합니다.',
      ],
    },
    firstAttempt: {
      prompt: '준비표를 다시 만들 때 어떤 단계를 먼저 시작하겠습니까?',
      choices: [
        { id: 'ask-whole-plan-again', emoji: '📦', label: '같은 큰 요청을 다시 보냅니다.', reaction: '아이미: "저는 여전히 장소를 몰라요…"' },
        { id: 'confirm-purpose-place', emoji: '1️⃣', label: '목적과 사용할 장소부터 확인합니다.', reaction: '아이미: "장소부터요? 좋아요, 그걸 알려 주시면 표가 훨씬 정확해져요!"' },
        { id: 'decorate-table-first', emoji: '🎨', label: '자료보다 표 색깔부터 정합니다.', reaction: '예쁘지만 텅 빈 표가 되었습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '첫 단계의 결과가 다음 단계에 어떻게 쓰일까요?',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '장소는 도서관과 복도 두 곳이고, 설치 시간은 30분이며, 참가 인원은 열두 명으로 확인되었습니다.',
      facts: [
        '장소도에서 책상과 전원 위치를 확인해야 합니다.',
        '일정표에는 설치, 체험, 정리 시간이 나뉘어 있습니다.',
        '준비물 수량은 참가 인원 열두 명을 기준으로 정합니다.',
        '각 단계 뒤에 장소·시간·수량을 검토해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '아이미의 단계 설계 제안',
      text: '먼저 장소도와 일정을 확인하고, 그 결과로 필요한 물건과 수량을 정한 뒤, 마지막에 담당과 누락을 검토하는 세 요청으로 나누면 좋아요.',
      question: '아이미의 단계 사이에 어떤 중간 확인을 넣겠습니까?',
    },
    artifact: {
      kind: 'workflow-plan',
      title: '단계별 요청 제작 기록',
      prompt: '단계 목적, 사용할 자료, 요청, 중간 결과, 확인, 다음 입력을 작업 흐름으로 연결해 봐요.',
    },
    transfer: {
      title: '주말 나들이를 준비한다면',
      description: '날씨, 이동, 준비물을 한 번에 부탁하지 않고 단계별로 계획하려고 합니다.',
      choices: [
        { id: 'outing-all-at-once', emoji: '📦', label: '모든 계획을 한 요청에 맡깁니다.', reaction: '날씨와 이동, 준비물이 뒤섞여 나왔습니다.' },
        { id: 'outing-stepwise', emoji: '🪜', label: '날짜와 날씨를 확인한 뒤 이동과 준비물을 이어 요청합니다.', reaction: '단계마다 결과가 다음 단계에 정확히 이어졌습니다.' },
        { id: 'outing-skip-check', emoji: '⏭️', label: '앞 결과를 확인하지 않고 그대로 다음 입력으로 씁니다.', reaction: '앞 단계의 오류가 다음 단계로 그대로 흘러갔습니다.' },
      ],
    },
    safetyNote: PREPARED_AI_NOTE,
  };
