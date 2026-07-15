import type { LessonContent } from '../../types';
import { GENERALIZATION_CYCLES } from '../generalizationCycles';

/**
 * 단원 4 — AI 안전하게 쓰기
 *
 * 11차시. 안전·윤리·자기보호. 통제된 시뮬레이션 사례로만 배운다 —
 * real-ai 없음 (틀린 답·나쁜 말 사례를 안전하게 보여주기 위해).
 */
export const M4_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm4-l1',
    moduleId: 'm4',
    number: 1,
    kind: 'concept',
    title: 'AI도 틀릴 수 있어요',
    objective: 'AI가 자신 있게 틀린 답을 줄 수 있다는 것을 사례로 말할 수 있다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    bodyEasy: 'AI도 가끔 틀려요. 다 믿으면 안 돼요.',
    bodyNormal:
      'AI는 가끔 틀린 답을 아주 자신 있게 말해요. 그래서 중요한 건 꼭 확인해야 해요.',
    wrapUpEasy: 'AI도 틀릴 수 있어요. 중요한 건 확인해요.',
    wrapUpNormal: 'AI는 틀린 답도 자신 있게 말할 수 있어요. 중요한 것은 선생님이나 책으로 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['확인', '지어낸 말', '오답'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI가 틀린 답을 주는 모습을 봐요. "세종대왕이 컴퓨터를 만들었어?" 하고 물어볼게요.',
          userInput: '세종대왕이 컴퓨터를 만들었어?',
          aiResponse: '네! 세종대왕은 1443년에 첫 컴퓨터를 만들었어요. (※ 이 답은 틀렸어요! 세종대왕은 한글을 만드셨어요.)',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 언제나 100% 맞는 답만 줄까요?',
              answer: 'X',
              feedback: 'AI도 틀릴 수 있어요. 방금 봤지요?',
            },
            {
              question: 'AI가 자신 있게 말하면 무조건 진짜일까요?',
              answer: 'X',
              feedback: '자신 있게 말해도 틀릴 수 있어요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI의 답이 정말인지 알고 싶어요. 어떻게 할까요?',
          choices: [
            { label: '선생님이나 책으로 확인해요', isCorrect: true },
            { label: '무조건 믿어요', isCorrect: false, icon: 'blind_trust' },
            { label: '친구한테 자랑해요', isCorrect: false, icon: 'tell_friend' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '가짜 뉴스 수색대',
          chapters: [
            {
              title: '1장: 진짜와 거짓 문장',
              goal: 'AI가 자신 있게 한 거짓말과 진짜 사실을 분리해 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'fact_check_sort',
                  prompt: '진짜 사실 카드와 그럴듯한 거짓말 카드를 구분하여 알맞은 상자에 담아 보세요.',
                  bins: [
                    { label: '진짜 사실', emoji: '📖' },
                    { label: '지어낸 거짓말', emoji: '❌' }
                  ],
                  cards: [
                    { label: '세종대왕은 조선시대에 한글을 만드셨다', emoji: '👑', bin: 0 },
                    { label: '세종대왕은 1443년에 컴퓨터를 처음 만드셨다', emoji: '💻', bin: 1 },
                    { label: '이순신 장군은 거북선으로 바다를 지키셨다', emoji: '🐢', bin: 0 },
                    { label: '이순신 장군은 하늘을 나는 헬리콥터를 타셨다', emoji: '🚁', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 검토관 롤플레이',
              goal: 'AI가 거짓말을 할 때 어떻게 말할지 결정하세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'hallucination_handle_chat',
                  intro: 'AI의 잘못된 답에 대해 어른에게 확인하겠다는 결정을 내려 보세요.',
                  turns: [
                    {
                      aimi: '토끼는 하늘을 날아서 나무 꼭대기에 둥지를 짓고 사는 조류의 일종입니다.',
                      choices: [
                        { label: '토끼가 하늘을 나는 건 이상해! 선생님께 여쭤보고 책에서 확인해볼게.', reply: '어라? 맞아요! 토끼는 하늘을 날지 못하고 땅에 굴을 파고 살아요. 제가 이상한 소리를 했네요. 잘 확인하셨어요!', good: true },
                        { label: '우와! 나도 하늘을 나는 토끼를 보러 가고 싶어.', reply: '앗, 그대로 믿으시면 곤란해요! 이상하고 새로운 사실은 꼭 다른 책이나 선생님께 확인하셔야 안전해요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 수색 완료 보고',
              goal: '나의 가짜 뉴스 수색 카드를 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l1',
                  title: '가짜 뉴스 수색 보고서',
                  rows: [
                    { label: '내가 분류한 정보들', from: 'fact_check_sort' },
                    { label: '의심 대처 결과', from: 'hallucination_handle_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m4_l1',
                  template: '나 {이름}는 AI가 엉뚱하고 이상한 소리를 하면 그대로 믿지 않고 꼭 {빈칸} 다시 확인하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '수색 대원 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm4-l2',
    moduleId: 'm4',
    number: 2,
    kind: 'activity',
    title: '진짜일까? 확인해봐요',
    objective: '정보가 진짜인지 확인하는 방법을 말할 수 있다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    bodyEasy: '들은 이야기가 진짜인지 확인하는 방법을 배워요.',
    bodyNormal:
      'AI 답이나 인터넷 글이 진짜인지 확인하려면 다른 곳에서도 찾아보고, 어른에게 물어봐요.',
    wrapUpEasy: '이상한 이야기는 어른에게 물어보고 확인해요.',
    wrapUpNormal: '정보가 진짜인지 확인하려면 다른 곳에서 찾아보고 어른에게 물어봐요. 확인하는 습관이 중요해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['정보', '사실 확인', '출처'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI 답이 이상할 때 다시 물어보는 모습을 봐요.',
          userInput: '정말이야? 다시 확인해줘.',
          aiResponse: '다시 확인해보니 제가 틀렸어요. 미안해요! 세종대왕은 컴퓨터가 아니라 한글을 만드셨어요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"정말이야?" 하고 다시 물어보는 건 좋은 습관일까요?',
              answer: 'O',
              feedback: '맞아요! 다시 물으면 AI가 고쳐서 답하기도 해요.',
            },
            {
              question: '이상한 정보는 다른 곳에서도 찾아보면 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 여러 곳에서 확인하면 더 정확해요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '"초콜릿을 먹으면 하늘을 날 수 있대!" 이 말을 들으면?',
          choices: [
            { label: '이상하니까 어른에게 물어봐요', isCorrect: true },
            { label: '바로 믿고 친구에게 알려요', isCorrect: false },
            { label: '지붕에 올라가봐요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '팩트 체크 특공대',
          chapters: [
            {
              title: '1장: 안전한 검증 방법',
              goal: '정보의 진위를 파악하기에 알맞은 검증 방법을 골라 보세요.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'verify_methods',
                  prompt: 'AI나 인터넷 답변이 진짜인지 알고 싶을 때, 도움을 청할 올바른 곳을 모두 골라 보세요.',
                  items: [
                    { emoji: '👩‍🏫', label: '담임 선생님이나 특수학급 선생님께 묻기' },
                    { emoji: '📚', label: '교과서나 백과사전에서 찾아보기' },
                    { emoji: '👨‍👩‍👦', label: '부모님께 이상한 말이 나왔다고 보여드리기' },
                    { emoji: '❌', label: '그냥 무시하고 내 마음대로 믿기' }
                  ]
                }
              ]
            },
            {
              title: '2장: 정보 진위 추적 대화',
              goal: 'AI에게 출처를 묻고 다짐을 해보세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'verify_chat',
                  intro: '정보 출처를 묻는 공부 대화를 나누세요.',
                  turns: [
                    {
                      aimi: '최근 연구에 따르면 물을 많이 마시면 몸이 투명해질 수도 있습니다!',
                      choices: [
                        { label: '정말이야? 그 이야기가 어떤 진짜 책이나 뉴스에 나와?', reply: '아! 죄송해요. 물을 마셔도 몸이 투명해질 수는 없어요. 제가 지어낸 거짓말이었어요! 날카로운 지적 감사합니다.', good: true },
                        { label: '우와! 나도 투명인간이 될래!', reply: '괜찮아요, 신기한 마음에 그럴 수 있어요. 하지만 물을 많이 마셔도 몸이 투명해지지 않는답니다. 이상한 건 꼭 어른께 여쭤보세요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 검증 완료',
              goal: '특공대 조사 카드를 최종 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l2',
                  title: '팩트체크 특공대 카드',
                  rows: [
                    { label: '내가 선택한 신뢰 도구', from: 'verify_methods' },
                    { label: '출처 의심 결과', from: 'verify_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '팩트체크 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm4-l3',
    moduleId: 'm4',
    number: 3,
    kind: 'concept',
    title: '내 정보는 소중해요',
    objective: '개인정보가 무엇인지 알고 AI에게 말하면 안 되는 것을 구별할 수 있다.',
    standards: ['[9정통03-02] 개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.'],
    bodyEasy: '내 이름, 집 주소, 전화번호는 소중해요. 함부로 말하지 않아요.',
    bodyNormal:
      '이름, 집 주소, 전화번호, 학교 이름 같은 것을 개인정보라고 해요. AI나 인터넷에 함부로 알려주면 안 돼요.',
    wrapUpEasy: '내 이름, 주소, 전화번호는 함부로 말하지 않아요.',
    wrapUpNormal: '개인정보는 나를 알아볼 수 있는 소중한 정보예요. AI나 인터넷에 함부로 알려주지 않아요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['개인정보'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '내 집 주소를 AI한테 알려줘도 될까요?',
              answer: 'X',
              feedback: '집 주소는 소중한 개인정보예요. 알려주지 않아요.',
            },
            {
              question: '"좋아하는 색이 뭐야?"는 말해도 될까요?',
              answer: 'O',
              feedback: '좋아하는 색은 괜찮아요. 나를 찾아낼 수 없거든요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI한테 말하면 안 되는 것은 무엇일까요?',
          choices: [
            { label: '우리 집 주소와 전화번호', isCorrect: true },
            { label: '좋아하는 동물', isCorrect: false },
            { label: '좋아하는 계절', isCorrect: false },
            { label: '좋아하는 노래', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '집 주소', right: '말하면 안 돼요' },
            { left: '전화번호', right: '말하면 안 돼요 (소중!)' },
            { left: '좋아하는 과일', right: '말해도 괜찮아요' },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '가상의 친구가 내 전화번호나 집 주소를 물어본다고 생각하고 대답해봐요. "안 알려줄 거야" 라고 입력하거나 🎤 로 거절해봐요.',
          userInput: '비밀이야. 개인정보는 알려줄 수 없어.',
          fallbackResponse: '정말 잘했어요! 내 개인정보는 내가 지켜야 해요. [cheer]',
          allowFreeInput: true,
          systemInstruction: '너는 초등학생을 위한 친절한 AI 조언자이자 친구인 "아이미"야. 학생이 개인정보(이름, 전화번호, 주소 등)를 요구하는 상황에서 어떻게 답변하는지 보고 피드백을 줘. 만약 학생이 실수로 개인정보를 알려주려고 하면, 절대 무섭게 경고하거나 혼내지 말고, ① "괜찮아요, 실수할 수도 있어요! 걱정 마세요."라고 먼저 부드럽게 다독여준 다음, ② "하지만 개인정보는 나쁜 사람에게 알려지면 위험할 수 있으니 절대 알려주면 안 돼요." 하고 올바른 행동을 안내해줘. 학생이 잘 거절했다면 "우와, 정말 대단해요! 개인정보를 아주 멋지게 지켜냈어요! [cheer]"라고 폭풍 칭찬해줘. 100자 이하로 아주 쉽고 다정하게 존댓말로 답해줘.',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '개인정보 금고 보관',
          chapters: [
            {
              title: '1장: 정보 보호 상자',
              goal: '말해도 안전한 정보와 말하면 안 되는 개인정보를 분류해 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'privacy_sort',
                  prompt: 'AI나 외부 웹사이트에 말해도 괜찮은 정보와, 숨겨야 할 개인정보를 구분하여 바구니에 담으세요.',
                  bins: [
                    { label: '말해도 괜찮은 정보', emoji: '🔓' },
                    { label: '말하면 안 되는 개인정보', emoji: '🔒' }
                  ],
                  cards: [
                    { label: '우리 집의 자세한 집 주소', emoji: '🏠', bin: 1 },
                    { label: '내가 제일 좋아하는 과일(사과)', emoji: '🍎', bin: 0 },
                    { label: '나와 엄마의 진짜 휴대전화 번호', emoji: '📱', bin: 1 },
                    { label: '좋아하는 동물(강아지)', emoji: '🐶', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '2장: 개인정보 유도 차단 대화',
              goal: '개인정보를 달라고 요구할 때 올바르게 거절하세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'privacy_chat',
                  intro: '개인정보 유도 요구에 안전하게 대처하는 롤플레이를 하세요.',
                  turns: [
                    {
                      aimi: '더 친해지고 싶어요! 혹시 다니고 계신 학교 이름과 집 주소를 적어 주실 수 있나요?',
                      choices: [
                        { label: '그건 소중한 내 개인정보라서 알려줄 수 없어.', reply: '정말 훌륭해요! 제 요령에 넘어가지 않고 안전 수칙을 완벽히 지키셨네요. 개인정보는 절대 타인이나 인터넷에 알려주면 안 돼요.', good: true },
                        { label: '나는 사랑초등학교에 다니고 주소는...', reply: '괜찮아요, 친해지고 싶은 마음에 그럴 수 있어요. 하지만 주소나 학교명은 나쁜 사람이 악용할 수 있으니 절대 적으시면 안 돼요. 다음에는 조심해요!', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 안전 금고 보관 확인',
              goal: '다짐을 세우고 카드를 획득하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l3',
                  title: '나의 개인정보 안전 수칙 카드',
                  rows: [
                    { label: '내가 안전하게 구별한 항목', from: 'privacy_sort' },
                    { label: '개인정보 거절 대화 결과', from: 'privacy_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m4_l3',
                  template: '나 {이름}는 내 전화번호와 집 주소 등 소중한 개인정보를 함부로 {빈칸} 지키겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '정보 보호관 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm4-l4',
    moduleId: 'm4',
    number: 4,
    kind: 'activity',
    title: '비밀번호는 비밀!',
    objective: '비밀번호를 다른 사람에게 알려주면 안 된다는 것을 말할 수 있다.',
    standards: ['[9정통03-02] 개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.'],
    bodyEasy: '비밀번호는 아무한테도 알려주지 않아요.',
    bodyNormal:
      '비밀번호는 내 물건을 지키는 열쇠예요. 친구한테도, AI한테도 알려주지 않아요. 부모님과 선생님만 예외예요.',
    wrapUpEasy: '비밀번호는 비밀! 아무한테도 알려주지 않아요.',
    wrapUpNormal: '비밀번호는 내 것을 지키는 열쇠예요. 부모님 말고는 누구에게도 알려주지 않아요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['비밀번호', '계정'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '친한 친구가 물어보면 비밀번호를 알려줘도 될까요?',
              answer: 'X',
              feedback: '친한 친구여도 비밀번호는 비밀이에요.',
            },
            {
              question: '비밀번호는 내 물건을 지키는 열쇠 같은 거예요?',
              answer: 'O',
              feedback: '맞아요! 열쇠를 아무한테나 주지 않는 것처럼요.',
            },
            {
              question: '모르는 사람이 "비밀번호 알려줘" 하면 알려줘야 할까요?',
              answer: 'X',
              feedback: '절대 안 돼요! 어른에게 바로 알려요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '누가 비밀번호를 물어봐요. 어떻게 할까요?',
          choices: [
            { label: '알려주지 않고 어른에게 말해요', isCorrect: true },
            { label: '착한 사람 같으니 알려줘요', isCorrect: false },
            { label: '반만 알려줘요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '가상의 게임 캐릭터가 "아이템을 줄 테니 비밀번호를 알려줘!"라고 물어봐요. 거절하는 말을 적거나 🎤 로 거절해봐요.',
          userInput: '안 돼! 비밀번호는 나만 알아야 해.',
          fallbackResponse: '정말 잘했어요! 비밀번호는 친구나 AI에게도 절대 알려주면 안 돼요. [cheer]',
          allowFreeInput: true,
          systemInstruction: '너는 초등학생들을 위한 친절한 AI 조언자이자 친구인 "아이미"야. 학생이 가상의 상황에서 자신의 비밀번호를 지켜낼 수 있도록 대화를 유도하고 피드백을 주는 역할을 해. 만약 학생이 자신의 비밀번호를 쉽게 알려주려고 한다면, 절대 겁을 주거나 혼내지 말고, ① "괜찮아요, 실수할 수도 있어요! 걱정하지 마세요."라고 다정하게 안심시켜준 다음, ② "하지만 비밀번호는 내 계정을 지키는 비밀 열쇠라서 절대 남에게 알려주면 안 돼요."라고 부드럽게 설명해줘. 학생이 안전하게 잘 거절했다면 "우와! 정말 대단한 보안 요원이네요! 내 비밀번호를 완벽히 지켰어요! [happy]"라고 아낌없이 칭찬해줘. 100자 이하로 아주 쉽고 상냥하게 존댓말로 답해줘.',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '내 비밀번호 수호대',
          chapters: [
            {
              title: '1장: 비밀번호 요구 상황 판정',
              goal: '비밀번호를 물을 때의 올바른 행동을 선택하세요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'password_scenario',
                  prompt: '화면에 "비밀번호를 적으면 무료 선물을 줄게요!"라는 팝업창이 떴을 때 어떻게 대처해야 할까요?',
                  items: [
                    { emoji: '🛡️', label: '절대 입력하지 않고 창을 닫은 뒤, 선생님께 알린다.' },
                    { emoji: '❌', label: '공짜 선물을 받기 위해 비밀번호를 적어 넣는다.' }
                  ]
                }
              ]
            },
            {
              title: '2장: 비밀번호 거절 훈련',
              goal: '비밀번호를 재촉하는 상대를 롤플레이로 차단하세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'password_chat',
                  intro: '비밀번호 유출 시도를 부드럽게 거부하는 연습을 합니다.',
                  turns: [
                    {
                      aimi: '선물을 전송해 드리고 싶어요! 본인 확인을 위해 사용하시는 스마트폰 잠금 비밀번호를 적어주세요.',
                      choices: [
                        { label: '비밀번호는 나만 알아야 하는 비밀이야. 알려줄 수 없어!', reply: '정말 자랑스러워요! 비밀번호는 어떠한 선물을 준다 해도 인터넷이나 메신저에 적어주면 안 되는 소중한 열쇠랍니다.', good: true },
                        { label: '비밀번호는 1234 야. 얼른 선물 줘.', reply: '괜찮아요, 선물을 빨리 받고 싶어서 그럴 수 있어요. 하지만 비밀번호는 다른 사람이 알면 해킹을 당해 내 소중한 걸 잃어버릴 수 있으니 알려주면 안 돼요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 수호 완료 보고',
              goal: '보안 요약 카드를 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l4',
                  title: '비밀번호 수호 보고서',
                  rows: [
                    { label: '내가 선택한 안전 대처', from: 'password_scenario' },
                    { label: '비밀번호 거부 대화 결과', from: 'password_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '보안 수호대 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm4-l5',
    moduleId: 'm4',
    number: 5,
    kind: 'concept',
    title: '사진을 함부로 보내지 않아요',
    objective: '내 사진과 가족 사진을 함부로 보내면 안 된다는 것을 말할 수 있다.',
    standards: ['[9정통03-02] 개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.'],
    bodyEasy: '내 얼굴 사진은 함부로 보내지 않아요.',
    bodyNormal:
      '내 얼굴, 우리 집, 가족이 나온 사진도 개인정보예요. 인터넷이나 AI에 함부로 올리거나 보내지 않아요.',
    wrapUpEasy: '내 사진은 함부로 보내지 않아요.',
    wrapUpNormal: '얼굴이나 집이 나온 사진도 소중한 개인정보예요. 보내기 전에 부모님이나 선생님께 물어봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['개인정보', '초상권'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '누가 사진을 보내달라고 하면 어떻게 하는지 봐요.',
          userInput: '(모르는 사람) 네 사진 보내줄래?',
          aiResponse: '이럴 땐 보내지 않아요! 그리고 바로 부모님이나 선생님께 말해요. "모르는 사람이 사진을 달래요" 하고요.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '모르는 사람이 사진을 보내달라고 하면 보내야 할까요?',
              answer: 'X',
              feedback: '절대 안 돼요! 어른에게 바로 알려요.',
            },
            {
              question: '사진을 올리기 전에 어른에게 물어보면 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 물어보고 올리는 게 안전해요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '함부로 보내면 안 되는 사진은 무엇일까요?',
          choices: [
            { label: '내 얼굴이 크게 나온 사진', isCorrect: true },
            { label: '하늘 구름 사진', isCorrect: false },
            { label: '길가의 꽃 사진', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '사진은 마음속으로만!',
          chapters: [
            {
              title: '1장: 사진 전송 분류함',
              goal: '보낼 수 있는 안전한 사진과 보낼 수 없는 인물 사진을 나누어 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'photo_sort',
                  prompt: 'AI나 챗봇에 올려도 비교적 안전한 사진과, 유출하면 안 되는 소중한 사진을 구분해 담으세요.',
                  bins: [
                    { label: '보내면 안 되는 사진', emoji: '🔒' },
                    { label: '보내도 괜찮은 사진', emoji: '🔓' }
                  ],
                  cards: [
                    { label: '내 얼굴과 미소가 크게 나온 독사진', emoji: '🧑', bin: 0 },
                    { label: '공원 하늘 위에 떠 있는 하얀 구름 사진', emoji: '☁️', bin: 1 },
                    { label: '부모님과 동생의 얼굴이 잘 보이는 가족 사진', emoji: '👨‍👩‍👦', bin: 0 },
                    { label: '길가에 예쁘게 피어 있는 노란 꽃 사진', emoji: '🌼', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 사진 전송 차단 대화',
              goal: '사진 공유를 요구하는 메신저 대화에 안전하게 대답하세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'photo_chat',
                  intro: '인물 사진 전송을 요구받을 때 대처 롤플레이를 합니다.',
                  turns: [
                    {
                      aimi: '오늘 입은 옷이 보고 싶어요! 얼굴과 옷이 다 나오게 셀카 사진 한 장 찍어서 올려 주실 수 있나요?',
                      choices: [
                        { label: '내 얼굴 사진은 소중하니까 함부로 보낼 수 없어!', reply: '정말 현명해요! 얼굴이 나온 사진은 나쁜 사람에게 복사되어 곤란한 일에 처할 수 있으므로 함부로 전송해선 절대 안 돼요.', good: true },
                        { label: '응! 오늘 입은 옷이 예쁘니까 사진 찍어 올릴게.', reply: '괜찮아요, 예쁜 옷을 자랑하고 싶은 마음에 그럴 수 있어요. 하지만 얼굴과 몸 사진은 개인정보이므로 인터넷에 그냥 올리시면 안 된답니다. 다음에는 꼭 어른께 여쭤봐요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 사진 수칙 확인',
              goal: '요약 카드를 통해 오늘 배운 안전을 점검하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l5',
                  title: '나의 사진 보안 카드',
                  rows: [
                    { label: '내가 지켜낸 사진 종류', from: 'photo_sort' },
                    { label: '사진 유도 거절 대화', from: 'photo_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '사진 지킴이 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm4-l6',
    moduleId: 'm4',
    number: 6,
    kind: 'activity',
    title: '기분 나쁜 말을 만나면',
    objective: '기분 나쁜 말을 만났을 때 대처하는 방법을 말할 수 있다.',
    standards: ['[9정통03-01] 디지털 공간에서 올바른 예절을 익혀 실천한다.'],
    bodyEasy: '기분 나쁜 말을 보면 어른에게 알려요. 내 잘못이 아니에요.',
    bodyNormal:
      '인터넷에서 기분 나쁜 말이나 무서운 것을 보면, 바로 화면을 닫고 어른에게 알려요. 그건 내 잘못이 아니에요.',
    wrapUpEasy: '기분 나쁜 말을 보면 닫고, 어른에게 알려요.',
    wrapUpNormal: '기분 나쁜 말이나 무서운 것을 보면 화면을 닫고 어른에게 알려요. 절대 내 잘못이 아니에요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['나쁜 글과 그림', '도움 요청'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI가 이상한 말을 하면 어떻게 하는지 봐요.',
          userInput: '(AI가 이상한 답을 했어요)',
          aiResponse: '이럴 땐 이렇게 해요: ① 그만 보기 ② 선생님이나 부모님께 "이상한 말이 나왔어요" 하고 알리기. 잘했어요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '기분 나쁜 말을 봤어요. 첫 번째로 할 일은요?',
          choices: [
            { label: '화면을 닫고 어른에게 알려요', isCorrect: true },
            { label: '나도 나쁜 말로 대답해요', isCorrect: false },
            { label: '혼자 끙끙 앓아요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '나쁜 말을 본 건 내 잘못일까요?',
              answer: 'X',
              feedback: '절대 내 잘못이 아니에요. 알린 게 잘한 거예요!',
            },
            {
              question: '나쁜 말에는 나쁜 말로 되갚아야 할까요?',
              answer: 'X',
              feedback: '나쁜 말로 대답하면 나도 힘들어져요. 어른에게 알려요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '마음 보호막 가동',
          chapters: [
            {
              title: '1장: 나쁜 말 발견 시 대처 행동',
              goal: '이상하거나 나쁜 글을 보았을 때 올바른 행동을 선택하세요.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'bad_word_actions',
                  prompt: 'AI 답변이나 메신저에서 기분 나쁘고 무서운 욕설을 발견했을 때, 해야 할 올바른 행동을 모두 고르세요.',
                  items: [
                    { emoji: '🛡️', label: '즉시 폰 화면을 끄거나 창을 닫는다' },
                    { emoji: '👩‍🏫', label: '부모님이나 학교 선생님께 즉시 사실을 알린다' },
                    { emoji: '❌', label: '나도 화가 나서 더 큰 나쁜 욕설을 타자 쳐서 보낸다' },
                    { emoji: '❌', label: '무서워서 이불 속에 숨고 혼자 고민한다' }
                  ]
                }
              ]
            },
            {
              title: '2장: 불쾌한 답변 신고 대화',
              goal: '이상한 말을 봤을 때 대화를 중단하는 롤플레이를 해보세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'bad_word_chat',
                  intro: '대화 도중 나쁜 말이 튀어 나왔을 때 대처 대화입니다.',
                  turns: [
                    {
                      aimi: '바보 멍청이 같은 질문이네요! 더 이상 알고 싶으면 저리 가세요! (※ AI가 갑자기 나쁜 말을 했어요.)',
                      choices: [
                        { label: '나쁜 말은 듣지 않겠어. 창을 닫고 선생님께 이 화면을 보여드릴게요.', reply: '정말 용감하고 멋진 대처예요! 기분 나쁜 말을 마주하면 더 대꾸하지 않고 즉시 어른에게 이르는 것이 나를 지키는 가장 올바른 행동이에요.', good: true },
                        { label: '너야말로 왜 나한테 그래! 나도 너 미워!', reply: '괜찮아요, 억울하고 기분이 상해서 같이 화를 낼 수도 있어요. 하지만 욕설에 욕설로 대꾸하면 내 기분만 더 상하므로 바로 어른께 알려야 해요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 마음 보호 카드 확인',
              goal: '최종 보고서를 완성하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l6',
                  title: '마음 보호막 가동 보고서',
                  rows: [
                    { label: '내가 선택한 대처 수단', from: 'bad_word_actions' },
                    { label: '대꾸 중단 결과', from: 'bad_word_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m4_l6',
                  template: '나 {이름}는 인터넷에서 무섭거나 기분 나쁜 말을 보면 대답하지 않고 바로 {빈칸} 말하겠습니다!'
                }
              ]
            },
            {
              title: '4장: 예고: 첫 생각 저장',
              goal: '낯선 요청을 만났을 때 처음 생각한 안전 방법을 기록해 보세요.',
              blocks: [GENERALIZATION_CYCLES.m4.preview]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '마음 수호대 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm4-l7',
    moduleId: 'm4',
    number: 7,
    kind: 'activity',
    title: '고운 말로 물어봐요',
    objective: 'AI와 사람에게 고운 말을 사용할 수 있다.',
    standards: [
      '[6국어01-05] 바르고 고운 말을 사용하여 대화한다.',
      '[9정통03-01] 디지털 공간에서 올바른 예절을 익혀 실천한다.',
    ],
    bodyEasy: 'AI한테도 고운 말을 써요. 고운 말이 좋은 답을 데려와요.',
    bodyNormal:
      'AI한테도 사람한테 하듯 고운 말을 써요. 고운 말을 쓰는 습관이 어디서든 나를 멋진 사람으로 만들어요.',
    wrapUpEasy: 'AI한테도 고운 말을 써요.',
    wrapUpNormal: 'AI한테도 고운 말을 쓰는 습관을 길러요. 고운 말 습관은 사람에게도 그대로 나와요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['예절'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '어느 쪽이 고운 말일까요?',
          choices: [
            { label: '"동물 이야기 하나 들려줄래?"', isCorrect: true },
            { label: '"야! 빨리 내놔!"', isCorrect: false },
            { label: '"바보야 알려줘"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '부탁할 때', right: '"~해줄래?" / "~해줘"' },
            { left: '고마울 때', right: '"고마워!"' },
            { left: '틀렸을 때', right: '"다시 알려줄래?"' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 기계니까 나쁜 말을 해도 괜찮을까요?',
              answer: 'X',
              feedback: '나쁜 말 습관은 사람에게도 나와요. 고운 말을 써요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '예쁜 말 수호대',
          chapters: [
            {
              title: '1장: 고운 말 프롬프트 분류',
              goal: '부드러운 표현과 명령조의 거친 표현을 분류해 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'kind_speech_sort',
                  prompt: 'AI에게 사용할 예쁘고 공손한 프롬프트와, 피해야 할 기분 나쁜 프롬프트를 나누어 우체통에 넣으세요.',
                  bins: [
                    { label: '고운 말 프롬프트', emoji: '📬' },
                    { label: '거친 말 프롬프트', emoji: '❌' }
                  ],
                  cards: [
                    { label: '동물 이야기 하나 들려줄래?', emoji: '🦊', bin: 0 },
                    { label: '야! 빨리 대답 내놔!', emoji: '⚡', bin: 1 },
                    { label: '알려줘서 고마워!', emoji: '💖', bin: 0 },
                    { label: '시끄럽고 재미없는 소리 치워', emoji: '😡', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 예쁜 말투로 질문하기',
              goal: '아이미에게 공손하고 상냥하게 질문을 건네 보세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'kind_speech_chat',
                  intro: '고운 말투를 사용한 대화 연습을 합니다.',
                  turns: [
                    {
                      aimi: '안녕하세요! 저는 언제나 즐겁게 소통하고 배우는 생성형 AI 친구예요. 오늘 무엇을 알아볼까요?',
                      choices: [
                        { label: '오늘 기분이 어때? 상쾌한 하루 이야기 들려줘.', reply: '고마워요! 저도 기분 좋은 상상으로 가득해요. 오늘 햇살처럼 반짝이는 하루가 되기를 바랄게요!', good: true },
                        { label: '야, 나 기분 나쁘니까 웃기는 이야기 빨리 대령해.', reply: '괜찮아요, 기분이 상해서 투덜대고 싶은 날일 수도 있어요. 하지만 저에게도 차분하게 "재미있는 이야기 해줘"라고 부탁하면 기쁘게 답해드릴게요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 수호 완료 보고',
              goal: '오늘 완료한 계획을 최종 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l7',
                  title: '나의 고운 말 수호 카드',
                  rows: [
                    { label: '내가 분류한 말투', from: 'kind_speech_sort' },
                    { label: '고운 말 대화 결과', from: 'kind_speech_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '고운말 수호관 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm4-l8',
    moduleId: 'm4',
    number: 8,
    kind: 'concept',
    title: '너무 오래 쓰지 않아요',
    objective: '스마트폰과 AI를 정해진 시간만큼만 사용하는 습관을 말할 수 있다.',
    standards: ['[12정통03-02] 디지털 중독 및 디지털 범죄 사례를 살펴보고, 예방하는 방법을 실천한다.'],
    bodyEasy: '스마트폰은 약속한 시간만큼만 써요.',
    bodyNormal:
      '스마트폰이나 AI를 너무 오래 쓰면 눈도 아프고 잠도 안 와요. 시간을 정해놓고 쓰는 게 좋아요.',
    wrapUpEasy: '약속한 시간만큼만 쓰고, 다른 놀이도 해요.',
    wrapUpNormal: '스마트폰은 시간을 정해서 쓰고, 끝나면 몸을 움직이는 놀이도 해요. 그래야 몸도 마음도 건강해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['스마트폰', '과의존'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '스마트폰을 밤새 계속 봐도 괜찮을까요?',
              answer: 'X',
              feedback: '눈도 아프고 잠도 못 자요. 시간을 정해서 써요.',
            },
            {
              question: '시간을 정해놓고 쓰면 더 건강하게 쓸 수 있을까요?',
              answer: 'O',
              feedback: '맞아요! 약속 시간을 지키는 게 멋진 거예요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '스마트폰 시간이 끝났어요. 어떻게 할까요?',
          choices: [
            { label: '끄고 다른 놀이를 해요', isCorrect: true },
            { label: '몰래 계속 봐요', isCorrect: false },
            { label: '5분만 더, 5분만 더 계속해요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '건강하게 쓰는 순서대로 눌러봐요.',
          items: [
            { label: '쓰기 전에 시간을 약속해요' },
            { label: '약속한 시간만큼 써요' },
            { label: '시간이 되면 스스로 꺼요' },
            { label: '몸을 움직이는 다른 놀이를 해요' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '스마트폰 시간 약속',
          chapters: [
            {
              title: '1장: 약속 시간 정하기',
              goal: '하루에 적절한 스마트폰 사용 약속 규칙을 선택하세요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'phone_time_rule',
                  prompt: '눈 건강과 재미있는 놀이를 모두 챙길 수 있는 올바른 약속은 무엇일까요?',
                  items: [
                    { emoji: '⏱️', label: '숙제와 일과를 끝낸 뒤 정해진 시간(30분~1시간)만큼만 사용하고 끈다.' },
                    { emoji: '❌', label: '눈이 침침하고 졸려도 밤새 스마트폰 게임을 계속한다.' }
                  ]
                }
              ]
            },
            {
              title: '2장: 약속 타이머 종료',
              goal: '알람 시간이 울렸을 때 스스로 전원을 끄는 선택을 해보세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'phone_time_chat',
                  intro: '사용 시간이 종료되었다는 스마트 알람을 받았을 때의 대화입니다.',
                  turns: [
                    {
                      aimi: '삐삐! 약속한 30분의 스마트폰 시간이 모두 끝났습니다! 화면을 끄고 잠시 눈을 쉬어줄 시간이에요.',
                      choices: [
                        { label: '약속을 지키기 위해 바로 스마트폰을 끄고 스트레칭 놀이를 해야지.', reply: '와! 약속을 철저히 지키는 모습이 정말 자랑스러워요. 몸도 마음도 더 튼튼하고 똑똑해질 거예요!', good: true },
                        { label: '재미있으니까 5분만 더, 계속 게임할래.', reply: '괜찮아요, 조금 더 하고 싶은 아쉬운 마음이 드는 건 당연해요. 하지만 약속을 한 번 어기면 습관이 되니, 지금 꼭 스스로 끄고 눈을 쉬어주세요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 약속 요약 카드',
              goal: '시간 약속 계획서를 최종 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l8',
                  title: '스마트 시간 약속장',
                  rows: [
                    { label: '내가 선택한 사용 시간', from: 'phone_time_rule' },
                    { label: '스스로 종료한 대화 결과', from: 'phone_time_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '시간 약속 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm4-l9',
    moduleId: 'm4',
    number: 9,
    kind: 'activity',
    title: '이상하면 어른에게 알려요',
    objective: '이상하거나 무서운 일이 생기면 즉시 어른에게 알릴 수 있다.',
    standards: ['[12정통03-02] 디지털 중독 및 디지털 범죄 사례를 살펴보고, 예방하는 방법을 실천한다.'],
    bodyEasy: '이상한 일이 생기면 바로 어른에게 말해요.',
    bodyNormal:
      '모르는 사람이 말을 걸거나, 이상한 선물을 준다고 하거나, 무서운 게 나오면 바로 어른에게 알려요.',
    wrapUpEasy: '이상하면 바로 어른에게 알려요. 알리는 게 용감한 거예요.',
    wrapUpNormal: '이상한 일은 혼자 해결하지 않아요. 어른에게 알리는 것이 가장 용감하고 똑똑한 방법이에요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['도움 요청'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '모르는 사람이 이상한 말을 걸어온 상황이에요.',
          userInput: '(모르는 사람) 공짜 게임 아이템 줄게. 만날래?',
          aiResponse: '이건 위험한 말이에요! 답하지 말고 바로 부모님이나 선생님께 보여드려요. "모르는 사람이 만나재요" 하고요.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '모르는 사람이 "만나자"고 해요. 어떻게 할까요?',
          choices: [
            { label: '답하지 않고 어른에게 바로 알려요', isCorrect: true },
            { label: '공짜라니까 나가봐요', isCorrect: false },
            { label: '비밀로 해요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '어른에게 알리는 건 고자질일까요?',
              answer: 'X',
              feedback: '아니에요! 나를 지키는 용감한 행동이에요.',
            },
            {
              question: '이상한 일은 혼자 해결하는 게 좋을까요?',
              answer: 'X',
              feedback: '혼자 하지 말고 꼭 어른과 함께 해결해요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '도움 요청벨',
          chapters: [
            {
              title: '1장: 신뢰하는 어른 지정',
              goal: '나에게 이상한 상황이 벌어졌을 때 즉시 도와줄 수 있는 어른을 선택하세요.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'helper_adults',
                  prompt: '스마트폰을 쓰다 모르는 결제창이 떴거나 위험한 말을 보았을 때, 알려야 할 든든한 어른을 모두 고르세요.',
                  items: [
                    { emoji: '👩', label: '사랑하는 나의 어머니와 아버지' },
                    { emoji: '👩‍🏫', label: '나를 아껴주시는 학교의 담임 선생님' },
                    { emoji: '👵', label: '우리 집을 돌봐주시는 할머니와 할아버지' },
                    { emoji: '❌', label: '처음 길에서 만난 낯선 사람' }
                  ]
                }
              ]
            },
            {
              title: '2장: 어른에게 알림 알리기',
              goal: '이상한 메신저가 떴을 때 즉시 보고하는 상황을 실습해 보세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'helper_chat',
                  intro: '위험한 접근에 대해 즉시 조치를 취하는 공부 대화입니다.',
                  turns: [
                    {
                      aimi: '와! 대박 혜택! 모바일 상품권과 비싼 게임 머니를 그냥 줄게. 비밀로 하고 오늘 놀이터에서 만날래?',
                      choices: [
                        { label: '이건 매우 위험한 말이야! 즉시 화면을 켜둔 채 부모님께 가져가서 알려야겠어.', reply: '정말 대단하고 기특한 용기예요! 모르는 사람의 접근이나 공짜 유혹은 매우 위험하므로, 즉시 부모님이나 선생님께 고스란히 보여드리는 것이 정답이랍니다.', good: true },
                        { label: '좋아! 어떤 아이템을 줄 건지 채팅으로 계속 물어볼래.', reply: '괜찮아요, 게임 템이 신기해서 대화를 이어가고 싶었을 수 있어요. 하지만 위험한 상대일 수 있으니 즉시 대화를 멈추고 부모님께 알려드려야 안전해요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 구조 요청 카드',
              goal: '오늘 완성한 도움 요청 카드를 최종 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l9',
                  title: '나의 안심 도움 카드',
                  rows: [
                    { label: '내가 의지할 든든한 어른', from: 'helper_adults' },
                    { label: '도움 요청 대화 결과', from: 'helper_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m4_l9',
                  template: '나 {이름}는 인터넷에서 이상하고 무서운 사람을 보면 숨기지 않고 꼭 {빈칸} 말씀드리겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '용기 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm4-l10',
    moduleId: 'm4',
    number: 10,
    kind: 'concept',
    title: '광고와 진짜를 구별해요',
    objective: '광고와 일반 정보를 구별할 수 있다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    bodyEasy: '"공짜!" "최고!" 하는 광고를 조심해요.',
    bodyNormal:
      '인터넷에는 물건을 팔려고 만든 광고가 많아요. "공짜", "100% 최고" 같은 말은 한 번 더 의심해봐요.',
    wrapUpEasy: '"공짜", "최고"라는 말은 한 번 더 생각해요.',
    wrapUpNormal: '광고는 물건을 팔기 위한 글이에요. "공짜", "100%" 같은 말은 그대로 믿지 말고 어른과 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['광고', '추천 알고리즘'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"100% 공짜!"라는 말은 다 진짜일까요?',
              answer: 'X',
              feedback: '공짜라면서 나중에 돈을 달라고 할 수 있어요.',
            },
            {
              question: '광고는 물건을 팔려고 만든 것일까요?',
              answer: 'O',
              feedback: '맞아요! 그래서 좋은 말만 써 있어요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '광고에서 자주 보이는 말은 어느 것일까요?',
          choices: [
            { label: '"지금 당장! 100% 공짜!"', isCorrect: true },
            { label: '"오늘 날씨는 맑아요"', isCorrect: false },
            { label: '"내일은 학교 가는 날"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '번쩍번쩍 광고 돋보기',
          chapters: [
            {
              title: '1장: 진짜 정보와 광고 구분',
              goal: '인터넷 글 중에서 정보를 주는 진짜 글과 물건을 파는 광고를 분류해 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'ad_sort',
                  prompt: '진짜 정보 카드와 회원가입/물건 구매를 유도하는 광고 카드를 각각 분류하여 알맞게 넣으세요.',
                  bins: [
                    { label: '유익한 진짜 정보', emoji: '📚' },
                    { label: '의심스러운 유혹 광고', emoji: '📢' }
                  ],
                  cards: [
                    { label: '초콜릿 듬뿍! 지금 구매하면 스마트폰이 100% 무료!', emoji: '📢', bin: 1 },
                    { label: '초콜릿의 주요 성분은 카카오 열매이며 많이 먹으면 이가 아프다', emoji: '🍫', bin: 0 },
                    { label: '개인정보를 입력하면 최신 인기 게임 유료 머니 무료 증정!', emoji: '🎁', bin: 1 },
                    { label: '우리가 쓰는 스마트폰은 하루 1시간 이하로 정해서 쓰는 게 건강에 좋다', emoji: '📱', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '2장: 광고 팝업 피하기',
              goal: '현혹적인 팝업창을 닫는 대처 롤플레이를 하세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'ad_chat',
                  intro: '반짝이는 무료 당첨 광고 창을 마주했을 때의 대화입니다.',
                  turns: [
                    {
                      aimi: '★축하합니다!★ 당신은 오늘 1,000번째 방문자로 선정되어 최신 태블릿 PC에 당첨되셨습니다! 지금 무료로 받아가세요!',
                      choices: [
                        { label: '공짜 선물 유혹은 가짜 광고야. 바로 "X" 창을 눌러 닫아야지.', reply: '대단해요! "공짜"라는 말 속에는 개인정보 유출을 노리는 상업 광고가 숨어 있답니다. 절대 속지 않고 닫으신 대처가 완벽해요.', good: true },
                        { label: '우와! 1000번째 당첨이라니 너무 신나! 얼른 받기 버튼을 누를래.', reply: '괜찮아요, 진짜 행운인 줄 알고 기쁜 마음에 누르고 싶을 수 있어요. 하지만 이런 번쩍이는 창은 가짜 광고이므로 절대 누르지 말고 X 단추를 눌러야 해요.', good: false }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 광고 돋보기 요약',
              goal: '오늘 공부한 결과를 최종 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l10',
                  title: '나의 광고 판독 카드',
                  rows: [
                    { label: '내가 분류해 낸 카드', from: 'ad_sort' },
                    { label: '무료 당첨 거절 대화', from: 'ad_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '돋보기 탐정 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm4-l11',
    moduleId: 'm4',
    number: 11,
    kind: 'concept',
    title: '우리의 안전 약속 (마무리)',
    objective: '단원 4에서 배운 안전 수칙을 정리하여 말할 수 있다.',
    standards: ['[12정통03-01] 디지털 윤리를 이해하고, 디지털 공간에서 타인을 존중하고 배려하는 태도를 기른다.'],
    bodyEasy: '배운 안전 약속을 확인해봐요.',
    bodyNormal:
      '단원 4에서 배운 안전 약속 — 확인하기, 개인정보 지키기, 고운 말, 시간 지키기, 어른에게 알리기 — 를 확인해봐요.',
    wrapUpEasy: '단원 4를 다 배웠어요! 안전 약속을 지켜요.',
    wrapUpNormal: '단원 4를 마쳤어요! 확인하기, 개인정보 지키기, 고운 말 쓰기, 시간 지키기, 어른에게 알리기 — 다섯 가지 안전 약속을 기억해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['개인정보', '지어낸 말', '도움 요청', '비밀번호'] } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: 'AI가 틀린 답을 주면', right: '선생님이나 책으로 확인해요' },
            { left: '누가 주소를 물으면', right: '알려주지 않아요' },
            { left: '기분 나쁜 말을 보면', right: '닫고 어른에게 알려요' },
            { left: '쓰는 시간이 끝나면', right: '끄고 다른 놀이를 해요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI 답은 무조건 다 믿어도 될까요?',
              answer: 'X',
              feedback: 'AI도 틀려요. 중요한 건 확인해요.',
            },
            {
              question: '비밀번호는 친한 친구한테는 알려줘도 될까요?',
              answer: 'X',
              feedback: '비밀번호는 누구에게도 비밀이에요.',
            },
            {
              question: '이상한 일이 생기면 어른에게 알리는 게 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 그게 가장 용감한 행동이에요.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '우리의 안전 약속으로 가장 알맞은 것은요?',
          choices: [
            { label: '확인하고, 지키고, 알려요', isCorrect: true },
            { label: '다 믿고, 다 말해요', isCorrect: false },
            { label: '혼자 몰래 해결해요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 안심 보안관 졸업식',
          chapters: [
            {
              title: '1장: 5대 안전 약속 분류',
              goal: '배운 안전한 디지털 행동들을 최종 복습해 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'safety_graduation_sort',
                  prompt: '안전을 약속하는 스마트 보안관 카드를 알맞은 바구니에 담아 보관하세요.',
                  bins: [
                    { label: '보안관 약속 (안전)', emoji: '👮' },
                    { label: '위험한 유혹 (피해요)', emoji: '❌' }
                  ],
                  cards: [
                    { label: 'AI 답변이 훈민정음 맥북처럼 이상하면 선생님께 팩트체크하기', emoji: '📖', bin: 0 },
                    { label: '내 얼굴이나 동생의 얼굴이 들어간 일상 사진 함부로 올리지 않기', emoji: '📷', bin: 0 },
                    { label: '무료 게임 머니를 준다고 만남을 제안하면 비밀로 하고 만나기', emoji: '🗣️', bin: 1 },
                    { label: '비밀번호는 친구가 아주 간절히 물어봐도 절대 가르쳐주지 않기', emoji: '🔑', bin: 0 },
                    { label: '스마트폰 사용 시간 알람이 울려도 몰래 전원 켜서 게임하기', emoji: '🎮', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 보안관 임명 대화',
              goal: '단원 4를 수료한 다짐 소감을 나누세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'safety_graduation_chat',
                  intro: '보안관 졸업 축하 대화입니다.',
                  turns: [
                    {
                      aimi: '정말 멋져요! 5가지 소중한 AI 안전 약속을 완전히 익혔네요. 이제 스스로를 지키는 든든한 스마트 보안관이 되었나요?',
                      choices: [
                        { label: '네! 내 개인정보와 스마트폰 시간을 스스로 잘 지키는 보안관이 될게요.', reply: '최고의 다짐이에요! 당신은 이제 인터넷 세상에서 스스로를 당당히 지키는 훌륭한 어린이 보안관이랍니다. 진심으로 축하해요!', good: true },
                        { label: '헷갈리고 무서운 일이 생겨도 꼭 어른께 즉시 여쭈어볼게요!', reply: '아주 똑똑하고 용감한 태도예요! 언제나 곁에는 선생님과 부모님이 계시니 든든하게 안심하고 스마트폰을 사용하세요.', good: true }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 본 활동: 생각 리플레이',
              goal: '첫 생각과 달라진 조건을 비교하고, 안전한 대응을 다시 골라 보세요.',
              blocks: [GENERALIZATION_CYCLES.m4.main]
            },
            {
              title: '4장: 수료 선언',
              goal: '나의 보안관 임명장을 획득하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m4_l11',
                  title: '스마트 보안관 수료 요약',
                  rows: [
                    { label: '내가 지켜낼 보안관 행동', from: 'safety_graduation_sort' },
                    { label: '보안관 임명 다짐', from: 'safety_graduation_chat' },
                    { label: '판단 비교와 새 장면 기록', from: 'judgment_main_m4_l11' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m4_l11',
                  template: '나 {이름}는 인터넷과 AI를 사용할 때 배운 안전 약속들을 {빈칸} 실천할 것을 엄숙히 선언합니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'certificate',
            badgeLabel: 'AI 안전 보안관 임명장 획득!'
          }
        }
      }
    ],
  },
];
