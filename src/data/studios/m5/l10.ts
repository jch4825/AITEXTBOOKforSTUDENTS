import type { StudioDefinition } from '../../../features/studio/types';
import { STUDIO_EXPRESSION_MODES, STUDIO_SUPPORT_PROFILES, sceneCopy } from '../shared';
import { PREPARED_PROBLEM_NOTE } from './shared';

export const M5_L10_STUDIO: StudioDefinition = {
    id: 'm5-error-retest',
    lessonId: 'm5-l10',
    moduleId: 'm5',
    title: '오류를 찾아 다시 시험하기',
    subtitle: '안내 화면의 잘못된 단추 순서를 재현하고 고친 뒤 같은 조건에서 다시 시험해요.',
    format: 'B',
    visualNovel: {
      title: '방문객을 되돌려 보낸 잘못된 단추 순서',
      objective: '안내 순서를 같은 조건으로 다시 시험해 오류 지점을 찾고, 고친 뒤 처음부터 확인해요.',
      seasonTag: '[체험회 D-1 · 10화] 말썽쟁이 안내 화면',
      nextEpisodeHook: '다음 시간 — 마지막 날, 조건이 바뀌었다.',
      scenes: [
        {
          id: 'm5-l10-wrong-route',
          label: '다른 화면으로 간 방문객',
          imageSrc: '/lessons/story/m5/m5-l10-scene-01.webp',
          alt: '진우가 안내 카드대로 눌렀는데 처음 메뉴로 돌아왔다며 당황하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '진우: "안내 카드대로 눌렀는데 처음 메뉴로 돌아왔대. 내일이 행사인데!"',
            '진우: "안내 카드대로 눌렀는데 처음 메뉴로 돌아왔대. 내일이 행사인데!" 예상과 다른 결과가 나왔습니다.',
            '진우: "안내 카드대로 눌렀는데 처음 메뉴로 돌아왔대. 내일이 행사인데!" 예상과 다른 결과가 나왔습니다. 방문객 탓으로 돌리지 않기로 했습니다.',
            '진우는 같은 조건을 다시 시험해 봐야겠다고 생각했습니다.',
          ),
        },
        {
          id: 'm5-l10-reproduce',
          label: '같은 조건으로 재현',
          imageSrc: '/lessons/story/m5/m5-l10-scene-02.webp',
          alt: '윤아가 침착하게 처음 상태로 돌려 카드 순서 그대로 다시 눌러 보자고 말하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 0,
          copy: sceneCopy(
            '윤아: "당황하지 말고, 처음 상태로 돌려서 카드 순서 그대로 다시 눌러 보자."',
            '윤아: "당황하지 말고, 처음 상태로 돌려서 카드 순서 그대로 다시 눌러 보자. 어디서 이상해지는지 보게."',
            '윤아: "당황하지 말고, 처음 상태로 돌려서 카드 순서 그대로 다시 눌러 보자. 어디서 이상해지는지 보게." 세 번째 단추에서 같은 문제가 다시 나타났습니다.',
            '윤아는 우연이 아니라 반복되는 문제라는 것을 확인했습니다.',
          ),
        },
        {
          id: 'm5-l10-locate-fix',
          label: '오류 위치',
          imageSrc: '/lessons/story/m5/m5-l10-scene-03.webp',
          alt: '정상 경로 카드와 비교해 세 번째와 네 번째 단계가 뒤바뀐 것을 발견하는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 1,
          copy: sceneCopy(
            '정상 경로 카드와 비교하니 두 단계가 뒤바뀌어 있었어요.',
            '정상 경로 카드와 비교하자 세 번째와 네 번째 단추 순서가 바뀌어 있었습니다.',
            '정상 경로 카드와 비교하자 세 번째와 네 번째 단추 순서가 바뀌어 있었습니다. 발견까지였고 아직 고치지 않았습니다.',
            '진우는 문제의 정확한 위치를 알게 되어 안심했습니다.',
          ),
        },
        {
          id: 'm5-l10-retest',
          label: '어떻게 고치고 확인할까요?',
          imageSrc: '/lessons/story/m5/m5-l10-scene-04.webp',
          alt: '아이미가 오류 위치를 찾았다며 어떻게 고치고 무엇으로 확인할지 학생에게 묻는 장면을 위한 빈 이미지 자리',
          knowledgeStep: 2,
          copy: sceneCopy(
            '아이미: "오류 위치를 찾았어요. 어떻게 고치시겠어요?"',
            '아이미: "오류 위치를 찾았어요. 이제 어떻게 고치고, 무엇으로 확인하시겠어요?"',
            '아이미: "오류 위치를 찾았어요. 이제 어떻게 고치고, 무엇으로 확인하시겠어요? 다른 친구도 시험해 볼까요?"',
            '윤아는 오류를 찾는 일이 사람을 탓하는 것이 아니라 더 나은 안내를 만드는 과정이라고 느꼈습니다.',
          ),
        },
      ],
      knowledge: [
        {
          title: '예상과 실제 결과를 적어요',
          core: '어디까지는 같고 어디서부터 달라졌는지 표시합니다.',
          detail: {
            full: '원한 화면과 나온 화면을 비교해요.',
            light: '달라진 첫 지점을 찾아요.',
            challenge: '실패한 장면을 언제, 무엇을 했고, 무엇이 나와야 했는지로 나누어 적습니다.',
          },
        },
        {
          title: '같은 조건으로 다시 시험해요',
          core: '처음 상태에서 같은 순서를 따라 오류가 반복되는지 봅니다.',
          detail: {
            full: '한 단계씩 다시 따라가요.',
            light: '문제가 나온 단계를 표시해요.',
            challenge: '입력과 초기 상태를 통제해 결함의 재현 가능성을 확인합니다.',
          },
          flow: { input: '예상·실제 결과', process: '재현·오류 위치 수정', output: '재시험 기록' },
        },
        {
          title: '고친 뒤 처음부터 확인해요',
          core: '수정한 부분과 전체 흐름을 다시 시험하고 다른 사용자도 확인합니다.',
          detail: {
            full: '수정 전과 수정 후 결과를 적어요.',
            light: '한 번 성공했다고 바로 끝내지 않아요.',
            challenge: '고친 뒤에는 같은 조건으로 한 번, 다른 사람이 쓰는 조건으로 한 번 더 시험합니다.',
          },
        },
      ],
    },
    encounter: {
      title: '어느 단계에서 안내가 달라졌을까',
      description: '모의 화면에서 안내 순서를 재현하고 오류 위치를 찾아 수정한 뒤 다시 시험해야 합니다.',
      facts: [
        '방문객은 안내 카드의 순서를 그대로 따랐습니다.',
        '세 번째 단추 뒤에 예상과 다른 화면이 나왔습니다.',
        '정상 경로 카드에는 세 번째와 네 번째 순서가 반대입니다.',
        '실제 서비스가 아닌 안전한 모의 화면에서 시험합니다.',
      ],
    },
    firstAttempt: {
      prompt: '오류를 가장 정확하게 찾는 방법을 골라 보세요.',
      choices: [
        { id: 'rewrite-everything', emoji: '🧹', label: '어디가 문제인지 보기 전에 안내 전체를 새로 써요.', reaction: '멀쩡했던 앞 단계까지 다시 만드느라 시간이 더 걸렸습니다.' },
        { id: 'reproduce-error', emoji: '🔬', label: '같은 조건으로 한 단계씩 다시 해 보고 달라지는 지점을 찾아요.', reaction: '윤아: "세 번째에서 또 멈췄어. 범인은 이 근처야."' },
        { id: 'assume-user-mistake', emoji: '👤', label: '방문객이 잘못 눌렀다고 생각하고 안내는 그대로 둬요.', reaction: '다음 방문객도 같은 자리에서 되돌아갔습니다.' },
      ],
      modes: [...STUDIO_EXPRESSION_MODES],
      reasonPrompt: '예상한 결과, 실제 결과, 처음 달라진 단계를 표현해 보세요.',
    },
    supportProfiles: STUDIO_SUPPORT_PROFILES,
    conditionChange: {
      description: '정상 경로 카드와 문제를 재현한 단계 기록이 함께 공개됩니다.',
      facts: [
        '첫 번째와 두 번째 단계는 정상입니다.',
        '세 번째 단계 뒤에 다른 화면이 나옵니다.',
        '정상 경로는 세 번째와 네 번째 단추의 순서가 반대입니다.',
        '수정 뒤에는 처음 상태부터 전체를 다시 시험해야 합니다.',
      ],
    },
    aiContribution: {
      source: 'prepared',
      role: '오류 재현과 기록을 돕는 AI',
      text: '첫 두 단계는 예상과 같고 세 번째 뒤부터 달라집니다. 정상 경로와 비교해 뒤바뀐 두 단계를 고친 뒤, 처음 상태에서 전체 안내를 다시 시험해 보세요.',
      question: '수정이 실제로 해결되었다는 증거를 어떻게 남길 수 있나요?',
    },
    artifact: {
      kind: 'review-sheet',
      title: '오류 전후 테스트 기록',
      prompt: '예상 결과, 실제 결과, 재현 조건, 오류 위치, 수정 내용, 다시 시험한 결과를 적어 보세요.',
    },
    transfer: {
      title: '다른 친구에게도 통하는 안내',
      description: '수정한 사람은 성공했습니다. 다음 확인은 무엇이 좋을까요?',
      choices: [
        { id: 'declare-fixed-once', emoji: '1️⃣', label: '내가 한 번 성공했으니 모두에게 된다고 정해요.', reaction: '한 번 성공이 모두의 성공을 보장하지는 않았습니다.' },
        { id: 'test-other-user', emoji: '👥', label: '처음 보는 친구가 같은 안내로 성공하는지 확인해요.', reaction: '다른 친구도 무사히 도착해 더 믿을 수 있었습니다.' },
        { id: 'remove-result-record', emoji: '🗑️', label: '수정 전후 기록을 지우고 성공만 적어요.', reaction: '기록이 없으니 다음에 같은 문제가 생기면 다시 헤매야 했습니다.' },
      ],
    },
    safetyNote: PREPARED_PROBLEM_NOTE,
  };
