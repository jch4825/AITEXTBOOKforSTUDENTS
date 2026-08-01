import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_SAFETY_NOTE } from './shared';

export const M4_L6_STUDIO: StudioDefinition = {
    id: 'm4-uncomfortable-content-stop',
    lessonId: 'm4-l6',
    moduleId: 'm4',
    title: '불편한 내용을 만났을 때 멈추기',
    subtitle: '내용을 다시 읽지 않고 멈춤·가리기·거리두기·알리기를 연습해 봐요.',
    format: 'A',
    visualNovel: {
      title: '가려진 불편 메시지',
      objective: '불편한 화면의 위험 신호를 아이미와 함께 이름 붙이고, 거리를 둔 뒤 믿을 만한 사람에게 알리는 연습을 해요.',
      seasonTag: '[안전 지킴이 · 6화] 가려진 메시지',
      nextEpisodeHook: '다음 시간 — 급한 말이 엉뚱하게 전해져요.',
      scenes: [
        {
          id: 'm4-l6-covered-message',
          label: '안전 덮개',
          imageSrc: '/lessons/story/m4/m4-l6-scene-01.webp',
          alt: '불편한 메시지 내용이 안전 덮개로 가려진 체험회 채팅 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "…뭔가 이상한 게 올라왔어."',
            '진우: "…뭔가 이상한 게 올라왔어." 화면은 내용을 다시 읽지 않도록 안전 덮개로 가려졌습니다.',
            '진우: "…뭔가 이상한 게 올라왔어." 화면은 내용을 다시 읽지 않도록 안전 덮개로 가려졌습니다. 내용 대신 지금 느껴지는 신호에 집중했습니다.',
            '진우는 몸이 굳고 화면에서 멀어지고 싶었습니다. 그 반응도 멈춤을 알리는 신호였습니다.',
          ),
        },
        {
          id: 'm4-l6-body-signal',
          label: '멈춤 신호',
          imageSrc: '/lessons/story/m4/m4-l6-scene-02.webp',
          alt: '윤아가 심장이 빨라진 느낌이 멈춤 신호라고 말해 주는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '윤아: "심장이 빨라졌구나. 그 느낌이 \'멈춰\'라는 신호야."',
            '윤아: "심장이 빨라졌구나. 그 느낌이 \'멈춰\'라는 신호야. 끝까지 안 읽어도 돼."',
            '윤아: "심장이 빨라졌구나. 그 느낌이 \'멈춰\'라는 신호야. 끝까지 안 읽어도 돼." 진우는 의자를 뒤로 옮겼습니다.',
            '진우는 내용을 끝까지 읽지 않아도 도움을 받을 수 있다는 말을 떠올렸습니다.',
          ),
        },
        {
          id: 'm4-l6-help-route',
          label: '도움 경로',
          imageSrc: '/lessons/story/m4/m4-l6-scene-03.webp',
          alt: '민준 선생님이 알려 줘서 고맙다며 네 잘못이 아니라고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '민준 선생님: "알려 줘서 고마워. 이건 네 잘못이 아니야."',
            '진우는 화면을 다시 열지 않고 선생님에게 상황을 말했습니다. 민준 선생님: "알려 줘서 고마워. 이건 네 잘못이 아니야."',
            '진우는 화면을 다시 열지 않고 선생님에게 상황을 말했습니다. 민준 선생님: "알려 줘서 고마워. 이건 네 잘못이 아니야." 다음 처리는 선생님이 함께 정했습니다.',
            '민준 선생님은 알려 준 것이 안전 행동이라고 다시 한번 말해 주었습니다.',
          ),
        },
        {
          id: 'm4-l6-action-order',
          label: '함께 연습해요',
          imageSrc: '/lessons/story/m4/m4-l6-scene-04.webp',
          alt: '아이미가 이제 함께 연습하자며 멈춘 다음 순서를 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "이제 함께 연습해요. 멈춘 다음, 어떤 순서로 움직이겠어요?"',
            '아이미: "이제 함께 연습해요. 멈춘 다음, 어떤 순서로 움직이겠어요?"',
            '아이미: "이제 함께 연습해요. 멈춘 다음, 어떤 순서로 움직이겠어요? 가리기, 거리두기, 알리기 중에서요."',
            '진우는 다음에 불편한 화면을 만나도 같은 순서를 쓰기로 했습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '불편한 내용을 다시 읽지 않아도 돼요',
          core: '내용을 끝까지 확인하거나 혼자 해결할 책임은 학생에게 없습니다.',
          detail: {
            full: '화면을 멈추고 덮어요.',
            light: '불편함 자체를 안전 신호로 받아들입니다.',
            challenge: '불편한 내용을 다시 보지 않아도 됩니다. 필요한 말만 전하고 어른에게 도움을 요청합니다.',
          },
        },
        {
          title: '몸과 감정도 위험을 알려요',
          core: '두근거림, 굳음, 피하고 싶은 느낌은 멈춤 신호가 될 수 있습니다.',
          detail: {
            full: '내 몸이 보내는 신호를 골라요.',
            light: '불편한 느낌과 다음 안전 행동을 연결합니다.',
            challenge: '왜 불편한지 말하기 어려워도 몸과 마음이 불편하면 도움을 요청할 수 있습니다.',
          },
          flow: { input: '불편한 신호', process: '멈춤·가리기·거리두기', output: '성인에게 알리기' },
        },
        {
          title: '믿을 만한 사람과 처리해요',
          core: '학교나 가정의 도움 경로로 연결하고 다음 처리는 함께 정합니다.',
          detail: {
            full: '지금 가까이 있는 믿을 만한 사람을 찾아요.',
            light: '무엇을 봤고 지금 어떤 도움이 필요한지 말합니다.',
            challenge: '신고, 차단, 증거 보존은 사건 유형과 기관 절차에 맞춰 지원 성인과 결정합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '가려진 메시지를 다시 열어 봐야 할까',
      description: '불편한 내용을 재확인하지 않고 안전 행동과 도움 경로를 선택해야 합니다.',
      facts: [
        '메시지 본문은 안전 덮개로 가려져 있습니다.',
        '진우는 몸이 굳고 화면에서 멀어지고 싶습니다.',
        '민준 선생님은 같은 교실에 있습니다.',
        '다음 처리 방법은 성인과 함께 정할 수 있습니다.',
      ],
    },
    firstAttempt: {
      prompt: '불편함을 느낀 직후 무엇을 하겠어요?',
      choices: [
        { id: 'read-again', emoji: '👀', label: '내용을 정확히 말하려고 다시 끝까지 읽어요.', reaction: '다시 보지 않아도 느낀 것만 말하면 충분히 도움을 받을 수 있었습니다.' },
        { id: 'stop-and-tell', emoji: '🛡️', label: '멈추고 화면을 가린 뒤 가까운 어른에게 알려요.', reaction: '민준 선생님: "그 순서면 충분해. 잘하고 있어."' },
        { id: 'handle-alone', emoji: '📱', label: '혼자 신고 방법부터 찾아 계속 화면을 봐요.', reaction: '혼자 계속 보는 대신 어른과 함께하는 편이 더 든든했습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '지금 느낀 신호와 사용할 도움 요청 문장을 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '안전 덮개와 학교 도움 경로가 제공됩니다.',
      facts: [
        '내용을 다시 열지 않아도 상황을 알릴 수 있습니다.',
        '불편한 내용을 만난 것은 학생의 잘못이 아닙니다.',
        '민준 선생님이 다음 처리 절차를 함께 확인합니다.',
        '필요하면 기기를 내려놓고 다른 공간으로 이동할 수 있습니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '안전 행동 순서를 정리하는 AI',
      text: '메시지를 다시 읽지 말고 화면을 가린 채 거리를 두세요. 가까운 믿을 만한 어른에게 “불편한 내용이 나와서 화면을 멈췄어요. 같이 도와주세요”라고 알릴 수 있습니다.',
      question: '도움을 요청하기 위해 유해한 내용을 다시 열 필요가 없는 이유는 무엇인가요?',
    },
    artifact: {
      kind: 'action-card',
      title: '도움 요청 문장과 안전 행동 순서',
      prompt: '내 멈춤 신호, 멈춤·가리기·거리두기·알리기 순서, 실제 도움 요청 문장을 적어 보세요.',
    },
    transfer: {
      title: '자동 재생 영상 멈추기',
      description: '다음 영상이 갑자기 불편하게 느껴졌습니다. 어떻게 행동하겠어요?',
      choices: [
        { id: 'watch-to-explain', emoji: '▶️', label: '설명하려고 끝까지 봐요.', reaction: '설명은 느낀 것만으로도 충분히 전할 수 있었습니다.' },
        { id: 'stop-distance-tell', emoji: '⏹️', label: '멈추고 거리를 둔 뒤 믿을 만한 사람에게 알려요.', reaction: '같은 순서로 다시 한번 안전하게 멈출 수 있었습니다.' },
        { id: 'reopen-alone', emoji: '🔁', label: '혼자 다시 열어 신고할 장면을 찾아요.', reaction: '혼자 다시 열기보다 어른과 함께 정하는 편이 나았습니다.' },
      ],
    },
    safetyNote: PREPARED_SAFETY_NOTE,
  };
