import type { LessonContent } from '../../types';

const AI_STANDARD = '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.';

/**
 * 1단원 - 아이미를 알아가는 탐구 기록
 *
 * AI 동아리 첫 주 동안 입력, 결과, 한계를 차례로 시험하고
 * 마지막에 "아이미 사용 설명서"를 완성한다.
 */
export const M1_LESSONS: LessonContent[] = [
  {
    id: 'm1-l1',
    moduleId: 'm1',
    number: 1,
    kind: 'experience',
    title: '아이미와 처음 만난 날',
    objective: 'AI(인공지능)의 뜻과 할 수 있는 일을 찾아요.',
    standards: [AI_STANDARD],
    bodyEasy: 'AI(인공지능)는 사람처럼 생각하고 배워서 여러 가지 일을 도와주는 프로그램이에요. 말, 글, 사진을 받아 번역, 추천, 분류처럼 필요한 결과를 만들어 줘요.',
    bodyNormal: 'AI(인공지능)는 많은 자료에서 비슷한 점을 찾아 여러 문제 해결을 돕는 기술입니다. 말, 글, 사진 같은 입력을 받아 번역, 음악 추천, 사진 속 동물 찾기처럼 할 수 있는 일을 처리해 결과를 만듭니다.',
    wrapUpEasy: 'AI(인공지능)는 사람처럼 생각하고 배워서 번역·추천·분류 같은 다양한 일을 도와줘요.',
    wrapUpNormal: 'AI(인공지능)는 컴퓨터가 사람처럼 학습하고 판단하는 기술로, 입력(말·글·사진)을 바탕으로 번역, 추천, 분류 등의 결과를 만듭니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['인공지능', '데이터', '프로그램', '의사결정', '정보', '입력', '번역', '수행', '범주', '신호', '구조'], imagePlaceholder: true } },
    ],
  },
  {
    id: 'm1-l2',
    moduleId: 'm1',
    number: 2,
    kind: 'concept',
    title: '기계와 AI는 어떻게 다를까?',
    objective: '오늘은 기계가 결과를 바꾸는 데 어떤 정보를 쓰는지 살펴보고 AI가 쓰인 기능을 찾아봐요.',
    standards: [AI_STANDARD],
    bodyEasy: '기계에 타자로 텍스트 넣기, 센서 감지, 사용 기록처럼 기기가 작동하는 기준을 살펴봐요.',
    bodyNormal: '자동으로 움직이는 기계가 모두 AI인 것은 아닙니다. 버튼이나 타자로 텍스트 넣기, 센서 감지, 사용 기록처럼 기기가 작동하는 정보와 판단 기준을 살펴봐야 합니다.',
    wrapUpEasy: '기계가 받는 정보와 바꾸는 결과를 살펴보면 AI 기능을 찾을 수 있어요.',
    wrapUpNormal: '기기 전체의 이름보다 입력과 결과를 살펴보면 자동 기능, 센서 기능, AI 기능을 더 정확하게 판단할 수 있습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['넣기', '감지', '기준', '센서', '타자', '텍스트', '작동', '기록', '입력', '결과'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '선풍기 버튼', right: '누른 세기로 바람이 바뀝니다', icon: 'fan' },
            { left: '자동문 센서', right: '사람을 감지하면 문이 열립니다', icon: 'enter_store' },
            { left: '음악 사용 기록', right: '들은 노래에 따라 추천이 바뀝니다', icon: 'music' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '기능 설계 카드',
          intro: '도구가 무엇을 받고, 어떤 도움을 주며, 사람이 무엇을 확인할지 설계해 봐요.',
          chapters: [
            {
              title: '1장 기능의 단서',
              goal: '기계의 기능을 입력, 도움, 사람에게 직접 확인하기로 나눠 봐요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'm1_l2_function_clues',
                  prompt: '음악 추천 기능의 단서를 알맞은 칸으로 옮겨 봐요.',
                  bins: [
                    { label: '받는 정보', emoji: '📥' },
                    { label: '도와주는 일', emoji: '🤖' },
                    { label: '사람이 확인', emoji: '✅' },
                  ],
                  cards: [
                    { label: '내가 전에 들은 노래', emoji: '1', bin: 0 },
                    { label: '비슷한 노래를 추천하기', emoji: '2', bin: 1 },
                    { label: '지금 듣고 싶은지 고르기', emoji: '3', bin: 2 },
                  ],
                },
              ],
            },
            {
              title: '2장 나의 설계',
              goal: '동아리방에 필요한 기능 하나를 설계해 봐요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'm1_l2_tool_purpose',
                  prompt: '어떤 도움을 주는 도구를 만들고 싶나요?',
                  items: [
                    { emoji: '📚', label: '필요한 책을 추천하는 도구' },
                    { emoji: '💡', label: '방이 어두우면 불을 켜는 도구' },
                    { emoji: '🔊', label: '큰 소리를 알려 주는 도구' },
                  ],
                },
                {
                  kind: 'summary',
                  id: 'm1_l2_artifact',
                  title: '나의 기능 설계 카드',
                  rows: [
                    { label: '입력·도움·확인 구분', from: 'm1_l2_function_clues' },
                    { label: '내가 고른 도구', from: 'm1_l2_tool_purpose' },
                  ],
                },
              ],
            },
          ],
          reward: { printable: 'worksheet', badgeLabel: '기능 탐정 도장' },
        },
      },
    ],
  },
  {
    id: 'm1-l3',
    moduleId: 'm1',
    number: 3,
    kind: 'concept',
    title: 'AI는 어떻게 답을 만들까?',
    objective: '오늘은 AI가 다음 말을 이어 답을 만드는 모습을 보고, 확인할 문장을 찾아봐요.',
    standards: [AI_STANDARD],
    bodyEasy: 'AI는 아는 것이 없어도 다음 단어를 하나씩 이어 붙여 당당히 대답해요. 엉뚱한 대답도 자신 있게 말할 수 있으니 사실인지 꼭 확인해요.',
    bodyNormal: '생성형 AI는 배운 글의 흐름을 바탕으로 다음에 올 말을 하나씩 이어 붙여 답을 만듭니다. 잘 모르는 정보도 엄청나게 자신감 넘치는 말투로 엉뚱하게 말할 수 있으니, 주간 식단표나 공식 공지에서 실제 사실인지 꼭 비교해야 합니다.',
    wrapUpEasy: 'AI가 당당하게 말해도 거짓말(환각)일 수 있어요. 원래 식단표나 공지에서 사실을 확인해요.',
    wrapUpNormal: '생성형 AI는 다음 단어를 이어 대답하므로, 자신감 있는 엉뚱한 대답(환각)을 진짜 사실과 구분해 확인해야 합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['생성형 AI', '예측', '자료'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '아이미가 오늘 급식으로 “무지개 아이스크림 떡볶이”가 나온다고 당당하게 말했습니다. 가장 먼저 해야 할 일은 무엇인가요?',
          choices: [
            { label: '학교 게시판의 진짜 주간 식단표 확인하기', isCorrect: true, icon: 'alarm_clock' },
            { label: '당당하게 말했으니 무조건 믿고 기다리기', isCorrect: false, icon: 'borrow_friend' },
            { label: '확인해 보지도 않고 무조건 불평하기', isCorrect: false, icon: 'chatbot' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 답 확인 기록표',
          intro: 'AI가 만든 동아리 소개와 학교 공지를 나란히 확인해 봐요.',
          chapters: [
            {
              title: '1장 답을 나누기',
              goal: '바로 써도 되는 부분과 원래 자료에서 확인할 부분을 나눠 봐요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'm1_l3_claim_check',
                  prompt: 'AI 답의 문장을 두 칸으로 나눠 봐요.',
                  bins: [
                    { label: '그대로 써도 돼요', emoji: '📄' },
                    { label: '자료를 확인해요', emoji: '🔍' },
                  ],
                  cards: [
                    { label: 'AI 동아리에서는 여러 도구를 시험합니다.', emoji: 'A', bin: 0 },
                    { label: '체험회는 금요일 오후 3시에 열립니다.', emoji: 'B', bin: 1 },
                    { label: '장소는 운동장입니다.', emoji: 'C', bin: 1 },
                  ],
                },
                {
                  kind: 'branch-chat',
                  id: 'm1_l3_check_method',
                  intro: '아이미가 “문장이 자연스러우니 맞을 거예요”라고 말했어요.',
                  turns: [
                    {
                      aimi: '제 답을 그대로 안내문에 넣을까요?',
                      choices: [
                        { label: '학교 공지에서 날짜와 장소를 다시 볼게.', reply: '좋아요. 날짜와 장소는 원래 공지에서 확인해야 해요.', good: true },
                        { label: '문장이 자연스러우니 그대로 넣을게.', reply: '자연스러운 문장에도 틀린 사실이 섞일 수 있어요.' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: '2장 기록 남기기',
              goal: '확인한 내용을 한 장에 남겨요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'm1_l3_artifact',
                  title: '그대로 쓸 부분·확인할 부분 기록표',
                  rows: [
                    { label: '문장 분류', from: 'm1_l3_claim_check' },
                    { label: '내가 고른 확인 방법', from: 'm1_l3_check_method' },
                  ],
                },
              ],
            },
          ],
          reward: { printable: 'worksheet', badgeLabel: '사실 확인 도장' },
        },
      },
    ],
  },
  {
    id: 'm1-l4',
    moduleId: 'm1',
    number: 4,
    kind: 'experience',
    title: 'AI의 눈 실험실',
    objective: '오늘은 사진 조건을 바꾸어 AI의 답이 달라지는지 살펴보고 원본과 다시 비교해 봐요.',
    standards: [AI_STANDARD],
    bodyEasy: 'AI는 사진에서 보이는 특징으로 무엇인지 짐작해요. 가림, 밝기, 각도가 달라지면 답도 달라질 수 있어요.',
    bodyNormal: '이미지 인식 AI는 사진에서 보이는 특징을 바탕으로 가능성이 높은 결과를 고릅니다. 가려진 부분, 밝기, 각도 같은 입력 조건이 바뀌면 결과도 달라질 수 있습니다.',
    wrapUpEasy: '사진 조건이 바뀌면 AI 답도 바뀔 수 있어요. 원본을 다시 확인해요.',
    wrapUpNormal: '이미지 인식 결과는 가림, 밝기, 각도의 영향을 받으므로 입력 조건과 원본을 함께 확인해야 합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['이미지 인식', '입력', '결과'], imagePlaceholder: true } },
    ],
  },
  {
    id: 'm1-l5',
    moduleId: 'm1',
    number: 5,
    kind: 'concept',
    title: 'AI의 귀는 어떻게 들을까?',
    objective: '오늘은 같은 말을 다른 조건에서 들려주고 인식된 글자를 비교해 봐요.',
    standards: [AI_STANDARD],
    bodyEasy: '음성 인식은 소리를 글자로 바꿔요. 주변이 시끄럽거나 마이크가 멀면 다른 글자로 바뀔 수 있어요.',
    bodyNormal: '음성 인식은 들어온 소리를 글자로 바꾸는 기능입니다. 주변 소음, 마이크와의 거리, 기기 상태에 따라 같은 말도 다르게 인식될 수 있습니다.',
    wrapUpEasy: '말이 잘 인식되지 않으면 다시 듣기, 글자, 그림 카드, 선생님께 물어보기를 사용할 수 있어요.',
    wrapUpNormal: '음성 인식이 다를 때는 말한 사람을 탓하지 않고 소음과 기기 상태를 살피며 다른 입력 방법을 함께 사용합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['음성 인식', '입력', '결과'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '조용한 교실에서 가까이 말하기', right: '“체험회는 두 시예요”', icon: 'ai_speaker' },
            { left: '시끄러운 복도에서 멀리 말하기', right: '“체험에는 도시예요”', icon: 'ai_speaker' },
            { left: '글자판으로 직접 입력하기', right: '쓴 문장이 그대로 들어갑니다', icon: 'chatbot' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '나에게 편한 입력 방법 카드',
          intro: '인식이 잘되지 않을 때 사용할 수 있는 방법을 찾아봐요.',
          chapters: [
            {
              title: '1장 다른 조건',
              goal: '소리 조건과 인식 결과를 비교해요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'm1_l5_strategy_sort',
                  prompt: '상황에 알맞은 해결 방법을 골라 봐요.',
                  bins: [
                    { label: '다시 들어 봐요', emoji: '🔁' },
                    { label: '다른 입력을 써요', emoji: '⌨️' },
                    { label: '사람과 확인해요', emoji: '👥' },
                  ],
                  cards: [
                    { label: '녹음된 안내를 한 번 더 재생하기', emoji: '1', bin: 0 },
                    { label: '글이나 그림 카드로 뜻을 전달하기', emoji: '2', bin: 1 },
                    { label: '행사 담당자에게 맞는 시간을 묻기', emoji: '3', bin: 2 },
                  ],
                },
              ],
            },
            {
              title: '2장 내 방법',
              goal: '내가 편하게 사용할 입력 방법을 골라요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'm1_l5_preferred_input',
                  prompt: '내가 먼저 사용하고 싶은 입력 방법은 무엇인가요?',
                  items: [
                    { emoji: '🎙️', label: '말로 입력하기' },
                    { emoji: '📝', label: '글자로 입력하기' },
                    { emoji: '🖼️', label: '그림·상징으로 입력하기' },
                  ],
                },
                {
                  kind: 'summary',
                  id: 'm1_l5_artifact',
                  title: '나에게 편한 입력 방법 카드',
                  rows: [
                    { label: '상황별 해결 방법', from: 'm1_l5_strategy_sort' },
                    { label: '내가 고른 입력 방법', from: 'm1_l5_preferred_input' },
                  ],
                },
              ],
            },
          ],
          reward: { printable: 'worksheet', badgeLabel: '입력 방법 도장' },
        },
      },
    ],
  },
  {
    id: 'm1-l6',
    moduleId: 'm1',
    number: 6,
    kind: 'concept',
    title: 'AI는 자료로 배워요',
    objective: '오늘은 학습 자료가 달라지면 AI 결과가 어떻게 달라지는지 시험해 봐요.',
    standards: [AI_STANDARD],
    bodyEasy: 'AI는 여러 예시를 보고 규칙을 찾아요. 비슷한 자료만 보면 처음 보는 모양을 자주 틀릴 수 있어요.',
    bodyNormal: 'AI는 학습 자료에서 반복되는 특징을 찾습니다. 자료의 수가 적거나 한 종류에 치우치면 새로운 사례에서 결과가 달라질 수 있습니다.',
    wrapUpEasy: '여러 종류의 자료를 보여 주면 새로운 모양을 더 잘 구분할 수 있어요.',
    wrapUpNormal: '학습 자료의 양과 다양성은 AI 결과에 영향을 주며, 사람에 관한 판단에는 더 세심한 검토가 필요합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['학습 데이터', '훈련', '결과'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '분류기가 세모를 자주 틀립니다. 학습 카드에는 동그라미와 네모만 많습니다. 무엇을 먼저 바꿔 볼까요?',
          choices: [
            { label: '여러 크기와 색의 세모 카드를 더 보여 줍니다', isCorrect: true, icon: 'random_choice' },
            { label: '동그라미 카드만 더 많이 보여 줍니다', isCorrect: false, icon: 'random_choice' },
            { label: '결과를 보지 않고 그대로 사용합니다', isCorrect: false, icon: 'notice_problem' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '학습 자료 전후 결과표',
          intro: '처음 자료와 보완한 자료가 어떤 결과를 만드는지 비교해요.',
          chapters: [
            {
              title: '1장 자료 살펴보기',
              goal: '처음 자료에서 빠진 모양을 찾아요.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'm1_l6_missing_data',
                  prompt: '새로운 카드를 구분하려면 어떤 자료를 더 넣어야 할까요?',
                  items: [
                    { emoji: '🔺', label: '여러 크기의 세모' },
                    { emoji: '🔺', label: '여러 색의 세모' },
                    { emoji: '🟢', label: '똑같은 동그라미만 20장' },
                  ],
                },
                {
                  kind: 'branch-chat',
                  id: 'm1_l6_result_compare',
                  intro: '자료를 보완하자 세모를 맞히는 횟수가 늘었어요.',
                  turns: [
                    {
                      aimi: '이제 모든 세모를 언제나 맞힐 수 있을까요?',
                      choices: [
                        { label: '새로운 자료에서도 다시 시험해야 해.', reply: '맞아요. 보완한 뒤에도 새로운 사례로 다시 시험해야 해요.', good: true },
                        { label: '한 번 좋아졌으니 언제나 맞을 거야.', reply: '처음 보는 모양에서는 또 다른 결과가 나올 수 있어요.' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: '2장 전후 기록',
              goal: '자료를 바꾸기 전과 뒤의 판단을 남겨요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'm1_l6_artifact',
                  title: '학습 자료 전후 결과표',
                  rows: [
                    { label: '추가한 자료', from: 'm1_l6_missing_data' },
                    { label: '다시 시험할 방법', from: 'm1_l6_result_compare' },
                  ],
                },
              ],
            },
          ],
          reward: { printable: 'worksheet', badgeLabel: '자료 연구원 도장' },
        },
      },
    ],
  },
  {
    id: 'm1-l7',
    moduleId: 'm1',
    number: 7,
    kind: 'concept',
    title: 'AI가 빠르게 도와주는 일',
    objective: '오늘은 AI가 만든 요약과 번역을 원문과 비교하고 빠진 부분을 찾아봐요.',
    standards: [AI_STANDARD],
    bodyEasy: 'AI는 긴 글을 짧게 만들거나 다른 언어로 빠르게 바꿀 수 있어요. 중요한 내용이 빠지지 않았는지 확인해요.',
    bodyNormal: 'AI는 요약과 번역처럼 많은 글을 빠르게 처리하는 일을 도울 수 있습니다. 빠르다는 것이 정확하다는 뜻은 아니므로 원문과 비교해 핵심 내용의 누락과 변화를 확인해야 합니다.',
    wrapUpEasy: 'AI가 빠르게 만든 결과도 원문과 나란히 놓고 확인해요.',
    wrapUpNormal: 'AI의 요약과 번역은 원문의 날짜, 시간, 장소, 준비물 같은 핵심 정보와 비교한 뒤 사용합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['요약', '번역', '결과'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '원문에는 “금요일 오후 2시, 도서관, 이름표 준비”가 있습니다. AI 요약은 “금요일 오후 2시에 만나요”입니다. 빠진 핵심은 무엇인가요?',
          choices: [
            { label: '도서관과 이름표', isCorrect: true, icon: 'map_app' },
            { label: '금요일과 오후 2시', isCorrect: false, icon: 'alarm_clock' },
            { label: '만나요라는 표현', isCorrect: false, icon: 'borrow_friend' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '요약·번역 검토지',
          intro: '원문과 AI 결과를 비교해 사용할 부분과 고칠 부분을 정해요.',
          chapters: [
            {
              title: '1장 핵심 찾기',
              goal: '원문에 꼭 남아야 할 정보를 골라요.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'm1_l7_key_points',
                  prompt: '체험회 안내에서 꼭 남아야 할 정보를 모두 골라 봐요.',
                  items: [
                    { emoji: '⏰', label: '금요일 오후 2시' },
                    { emoji: '📍', label: '도서관' },
                    { emoji: '🎒', label: '이름표 준비' },
                    { emoji: '🎨', label: '신나는 느낌의 꾸밈말' },
                  ],
                },
                {
                  kind: 'drag-sort',
                  id: 'm1_l7_review',
                  prompt: 'AI 결과를 사용할 부분과 고칠 부분으로 나눠요.',
                  bins: [
                    { label: '사용해요', emoji: '📄' },
                    { label: '고쳐요', emoji: '✏️' },
                  ],
                  cards: [
                    { label: '금요일 오후 2시', emoji: '1', bin: 0 },
                    { label: '빠진 장소: 도서관', emoji: '2', bin: 1 },
                    { label: '빠진 준비물: 이름표', emoji: '3', bin: 1 },
                  ],
                },
              ],
            },
            {
              title: '2장 검토 기록',
              goal: '비교한 결과를 남겨요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'm1_l7_artifact',
                  title: '검토 표시가 남은 비교지',
                  rows: [
                    { label: '원문의 핵심', from: 'm1_l7_key_points' },
                    { label: '사용·수정 결정', from: 'm1_l7_review' },
                  ],
                },
              ],
            },
          ],
          reward: { printable: 'worksheet', badgeLabel: '비교 편집자 도장' },
        },
      },
    ],
  },
  {
    id: 'm1-l8',
    moduleId: 'm1',
    number: 8,
    kind: 'concept',
    title: 'AI에게 맡기기 어려운 일',
    objective: '오늘은 AI가 혼자 결정하기 어려운 일을 찾고 누구와 함께 확인할지 골라봐요.',
    standards: [AI_STANDARD],
    bodyEasy: 'AI가 도울 수 있는 일도 있지만, 마음, 건강, 안전처럼 중요한 일은 믿을 수 있는 사람과 함께 확인해요.',
    bodyNormal: 'AI가 할 수 있는 일은 도구의 기능과 연결 상태에 따라 다릅니다. 감정, 건강, 안전, 책임에 관한 결정은 AI 답만 따르지 않고 믿을 수 있는 사람과 함께 확인합니다.',
    wrapUpEasy: '중요한 결정은 AI에게 혼자 맡기지 않고 믿을 수 있는 사람과 확인해요.',
    wrapUpNormal: 'AI만으로 시도할 일, 결과를 확인하고 사용할 일, 믿을 수 있는 사람에게 요청할 일을 위험과 책임에 따라 구분합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['도구', '결과'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '친구가 아파 보일 때 가장 알맞은 방법은 무엇인가요?',
          choices: [
            { label: '선생님이나 보호자에게 바로 알립니다', isCorrect: true, icon: 'ask_more' },
            { label: 'AI에게 병명을 정해 달라고 합니다', isCorrect: false, icon: 'chatbot' },
            { label: '친구 표정만 보고 괜찮다고 정합니다', isCorrect: false, icon: 'angry_face' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '도움 경계 지도',
          intro: '부탁의 위험과 책임을 살펴보고 알맞은 도움 경로를 정해요.',
          chapters: [
            {
              title: '1장 도움 경로',
              goal: '네 가지 부탁을 세 경로로 나눠요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'm1_l8_help_map',
                  prompt: '각 부탁을 어디로 보내면 좋을까요?',
                  bins: [
                    { label: 'AI로 시도', emoji: '🤖' },
                    { label: '확인하고 사용', emoji: '🔍' },
                    { label: '사람에게 요청', emoji: '👥' },
                  ],
                  cards: [
                    { label: '긴 안내문을 짧게 정리하기', emoji: '1', bin: 0 },
                    { label: '최신 행사 시간을 찾아보기', emoji: '2', bin: 1 },
                    { label: '약을 먹어도 되는지 결정하기', emoji: '3', bin: 2 },
                    { label: '친구가 왜 속상한지 단정하기', emoji: '4', bin: 2 },
                  ],
                },
                {
                  kind: 'branch-chat',
                  id: 'm1_l8_reason',
                  intro: '새 조건이 생겼어요. AI가 최신 행사 시간을 알려 줬지만 출처가 없어요.',
                  turns: [
                    {
                      aimi: '제가 알려 준 시간을 바로 안내해도 될까요?',
                      choices: [
                        { label: '학교 공지나 담당자에게 확인할게.', reply: '좋아요. 최신 정보는 공식 자료나 담당자에게 확인해요.', good: true },
                        { label: 'AI가 말했으니 바로 안내할게.', reply: '출처가 없으면 오래되거나 틀린 정보일 수 있어요.' },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              title: '2장 지도 완성',
              goal: '내가 정한 도움 경로를 남겨요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'm1_l8_artifact',
                  title: 'AI 도움 경계 지도',
                  rows: [
                    { label: '부탁별 도움 경로', from: 'm1_l8_help_map' },
                    { label: '확인할 사람과 자료', from: 'm1_l8_reason' },
                  ],
                },
              ],
            },
          ],
          reward: { printable: 'worksheet', badgeLabel: '안전 판단 도장' },
        },
      },
    ],
  },
  {
    id: 'm1-l9',
    moduleId: 'm1',
    number: 9,
    kind: 'concept',
    title: '일에 맞는 AI 도구 고르기',
    objective: '오늘은 원하는 결과와 필요한 입력을 보고 알맞은 AI 도구를 골라봐요.',
    standards: [AI_STANDARD],
    bodyEasy: '원하는 결과가 글, 그림, 자막 중 무엇인지 먼저 정해요. 필요한 입력과 사람이 확인할 점도 함께 살펴봐요.',
    bodyNormal: 'AI 도구는 이름보다 입력, 출력, 근거, 개인정보 조건을 보고 선택합니다. 하나의 서비스가 여러 기능을 가질 수 있으므로 작업 목적에 맞는 기능과 사람의 확인 방법을 함께 정합니다.',
    wrapUpEasy: '원하는 결과와 필요한 입력을 보고 도구를 고른 뒤 사람이 확인해요.',
    wrapUpNormal: '작업 목적에 맞춰 입력과 출력을 연결하고, 근거와 개인정보를 확인하는 도구 선택 설계가 필요합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['입력', '결과', '개인정보'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '체험회 안내문', right: '글을 정리하는 AI 기능', icon: 'book' },
            { left: '체험회 포스터 그림', right: '그림을 만드는 AI 기능', icon: 'drawing' },
            { left: '안내 영상 자막', right: '음성을 글로 바꾸는 AI 기능', icon: 'ai_speaker' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '도구 선택 계획서',
          intro: '체험회 작업 하나를 골라 입력, 결과, 확인 방법을 설계해요.',
          chapters: [
            {
              title: '1장 목적과 도구',
              goal: '작업 목적에 알맞은 기능을 골라요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'm1_l9_task',
                  prompt: '내가 맡고 싶은 체험회 작업은 무엇인가요?',
                  items: [
                    { emoji: '📝', label: '짧고 쉬운 안내문 만들기' },
                    { emoji: '🖼️', label: '체험회 포스터 그림 만들기' },
                    { emoji: '🎬', label: '안내 영상 자막 만들기' },
                  ],
                },
                {
                  kind: 'drag-sort',
                  id: 'm1_l9_conditions',
                  prompt: '도구를 고르기 전에 살펴볼 조건을 나눠요.',
                  bins: [
                    { label: '필요한 입력', emoji: '📥' },
                    { label: '원하는 결과', emoji: '📤' },
                    { label: '사람이 확인', emoji: '🔍' },
                  ],
                  cards: [
                    { label: '공개해도 되는 행사 정보', emoji: '1', bin: 0 },
                    { label: '안내문·그림·자막', emoji: '2', bin: 1 },
                    { label: '사실, 저작권, 개인정보', emoji: '3', bin: 2 },
                  ],
                },
              ],
            },
            {
              title: '2장 계획서 완성',
              goal: '내가 고른 작업과 확인 조건을 한 장에 남겨요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'm1_l9_artifact',
                  title: '도구 선택 계획서',
                  rows: [
                    { label: '내 작업 목적', from: 'm1_l9_task' },
                    { label: '입력·결과·확인 조건', from: 'm1_l9_conditions' },
                  ],
                },
              ],
            },
          ],
          reward: { printable: 'worksheet', badgeLabel: '도구 설계자 도장' },
        },
      },
    ],
  },
  {
    id: 'm1-l10',
    moduleId: 'm1',
    number: 10,
    kind: 'experience',
    title: 'AI 결과를 사용할까?',
    objective: '오늘은 AI에게 안전한 요청을 한 뒤 결과를 확인하고 사용·수정·거절을 골라봐요.',
    standards: [AI_STANDARD],
    bodyEasy: 'AI 결과를 바로 쓰지 않고 목적과 조건에 맞는지 확인해요. 마지막 결정은 사람이 해요.',
    bodyNormal: 'AI 결과는 작업 목적, 확인된 자료, 안전 조건과 비교한 뒤 사용하거나 수정하거나 거절합니다. AI가 제안해도 마지막 결정과 책임은 사람에게 있습니다.',
    wrapUpEasy: 'AI 결과는 확인한 뒤 사용, 수정, 거절을 사람이 결정해요.',
    wrapUpNormal: 'AI의 첫 결과와 수정 결과를 근거와 비교하고, 최종 사용 여부는 사람이 결정합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['결과', '자료'], imagePlaceholder: true } },
    ],
  },
  {
    id: 'm1-l11',
    moduleId: 'm1',
    number: 11,
    kind: 'activity',
    title: '아이미 사용 설명서',
    objective: '오늘은 새 AI 상황에서 입력·결과·확인할 점을 찾아 나만의 AI 사용 설명서를 완성해 봐요.',
    standards: [AI_STANDARD],
    bodyEasy: '동아리에서 남긴 기록을 모아 새 친구에게 줄 아이미 사용 설명서를 만들어요.',
    bodyNormal: '동아리 첫 주의 탐구 기록을 모아 AI가 잘 도와주는 일, 조건에 따라 달라지는 일, 사람이 확인할 일을 설명서로 정리합니다.',
    wrapUpEasy: 'AI가 도와주는 일과 사람이 확인할 일을 설명서에 담았어요.',
    wrapUpNormal: '입력, 결과, 확인할 점을 살펴보고 마지막 결정을 사람이 한다는 아이미 사용 설명서를 완성했습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['인공지능', '입력', '결과'], imagePlaceholder: true } },
    ],
  },
];
