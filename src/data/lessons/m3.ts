import type { LessonContent } from '../../types';
import { GENERALIZATION_CYCLES } from '../generalizationCycles';

/**
 * 단원 3 — AI랑 같이 배우기
 *
 * 11차시. 학생이 AI를 "공부 도우미"로 쓰는 감각을 익히는 것이 목표.
 * 모르는 것 묻기, 쉽게 설명 부탁하기, 요약·퀴즈·복습까지.
 * real-ai 스텝 3회 (l1/l5/l10).
 */
export const M3_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm3-l1',
    moduleId: 'm3',
    number: 1,
    kind: 'experience',
    title: 'AI에게 궁금한 것 물어보기',
    objective: '예나 아니오로 끝나지 않는 질문을 만들어 물어봅니다.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '공부하다 궁금한 게 있으면 AI한테 물어봅니다.',
    bodyNormal:
      '공부하다가 궁금한 게 생기면 AI한테 물어볼 수 있습니다. AI는 우리의 공부 도우미가 될 수 있습니다.',
    wrapUpEasy: '궁금한 건 AI한테 물어봅니다. 공부 도우미가 됩니다.',
    wrapUpNormal: '공부하다 궁금한 게 생기면 AI한테 물어봅니다. AI는 언제든 대답해주는 공부 도우미입니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['도우미', '열린 질문'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '공부하다 모르는 게 나오면 AI한테 물어봐도 될겠습니까?',
              answer: 'O',
              feedback: '맞습니다! AI는 공부 도우미입니다.',
            },
            {
              question: '모르는 건 그냥 넘어가는 게 제일 좋겠습니까?',
              answer: 'X',
              feedback: '모르는 건 물어보면 됩니다. AI도 선생님도 도와 주십시오.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '공부 중에 AI한테 물어보기 좋은 것은 무엇입니까?',
          choices: [
            { label: '"공룡은 언제 살았어?"', isCorrect: true },
            { label: '아무 말 안 하기', isCorrect: false },
            { label: '"몰라 몰라"', isCorrect: false },
            { label: '화면 세게 누르기', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 궁금한 걸 물어봅니다. 아래 글을 그대로 보내도 되고, 내가 궁금한 걸로 바꿔도 됩니다.',
          userInput: '바다에서 제일 큰 동물이 뭐야?',
          fallbackResponse: '바다에서 제일 큰 동물은 흰긴수염고래입니다! 버스 세 대를 이은 것보다 길습니다.',
          allowFreeInput: true,
        },
      },
      {
        kind: 'mission',
        data: {
          title: '궁금증 사냥꾼',
          chapters: [
            {
              title: '1장: 질문하기 좋은 주제',
              goal: 'AI 공부 도우미에게 질문하기 알맞은 주제를 골라 보십시오.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'study_topics',
                  prompt: 'AI에게 물어보고 함께 공부하기에 좋은 주제를 모두 골라 보십시오.',
                  items: [
                    { emoji: '🦖', label: '공룡의 역사와 종류' },
                    { emoji: '🚀', label: '태양계 행성의 크기' },
                    { emoji: '🦁', label: '사자가 사는 곳과 특징' },
                    { emoji: '🧼', label: '비누로 손 씻기 순서' }
                  ]
                }
              ]
            },
            {
              title: '2장: 궁금한 과학 질문',
              goal: 'AI 도우미와 함께 우주에 대한 질문을 해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'science_chat',
                  intro: '아이미와 과학 공부 대화를 해 보십시오.',
                  turns: [
                    {
                      aimi: '공부 도우미 등장! 오늘 어떤 우주 이야기가 궁금한습니까?',
                      choices: [
                        { label: '우주에서 가장 뜨거운 별은 뭐야?', reply: '우주에서 관측된 가장 뜨거운 별 중 하나는 표면 온도가 섭씨 20만 도가 넘는 백색왜성입니다! 엄청나게 뜨겁습니다.', good: true },
                        { label: '우주선 그리는 낙서 좀 해 주십시오.', reply: '어라? 글자로 낙서를 표현하긴 어렵습니다. 제가 대신 신기한 우주선 이야기를 한 문장으로 들려드리겠습니까?' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 배움 다짐',
              goal: '오늘 배운 것을 정리해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l1',
                  title: '나의 배움 조사표',
                  rows: [
                    { label: '내가 고른 공부 주제', from: 'study_topics' },
                    { label: '과학 대화 결과', from: 'science_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m3_l1',
                  template: '나 {이름}는 공부하다 막히거나 모르는 게 나오면 AI 공부 도우미에게 {빈칸} 질문하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '배움 사냥꾼 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm3-l2',
    moduleId: 'm3',
    number: 2,
    kind: 'activity',
    title: '모르는 단어는 AI에게',
    objective: 'AI에게 단어 뜻을 물어보고 사전과 비교해 보십시오.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    bodyEasy: '모르는 단어가 나오면 "이게 무슨 뜻이야?" 하고 물어봅니다.',
    bodyNormal:
      '책이나 문제에서 모르는 단어가 나오면 AI한테 "이 단어가 무슨 뜻이야?" 하고 물어보면 됩니다.',
    wrapUpEasy: '모르는 단어는 "무슨 뜻이야?" 하고 물어봅니다.',
    wrapUpNormal: '모르는 단어가 나오면 AI한테 뜻을 물어봅니다. 물어보는 건 부끄러운 게 아닙니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['단어', '정의', '비교'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '모르는 단어가 나왔습니다. 뭐라고 물어보겠습니까?',
          choices: [
            { label: '"약속이 무슨 뜻이야?"', isCorrect: true },
            { label: '"음..."', isCorrect: false },
            { label: '그냥 책을 덮습니다', isCorrect: false },
            { label: '"싫어"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '모르는 단어', right: '"무슨 뜻이야?" 물어봅니다' },
            { left: '어려운 설명', right: '"쉽게 말해 주십시오" 부탁합니다' },
            { left: '더 알고 싶을 때', right: '"예를 들어줘" 부탁합니다' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "용기가 무슨 뜻이야?" 하고 물어봅니다.',
          userInput: '용기가 무슨 뜻이야?',
          aiResponse: '용기는 무섭거나 어려워도 씩씩하게 해보는 마음입니다. 발표할 때 손을 드는 것도 용기입니다!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '나만의 낱말 돋보기',
          chapters: [
            {
              title: '1장: 질문 방식 고르기',
              goal: '어려운 단어 뜻을 물어볼 가장 올바른 질문을 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'word_query',
                  prompt: '모르는 낱말을 공부할 때 AI 공부 도우미에게 건넬 가장 좋은 질문은 무엇입니까?',
                  items: [
                    { emoji: '📖', label: '"배려가 무슨 뜻이고 어떻게 사용해?"' },
                    { emoji: '❌', label: '"야 배려"' },
                    { emoji: '💬', label: '"배려인가 뭔가 하는 게 있었던 것 같은데..."' }
                  ]
                }
              ]
            },
            {
              title: '2장: 낱말 뜻 돋보기 대화',
              goal: 'AI 도우미와 함께 모르는 단어를 탐색해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'word_chat',
                  intro: '낱말 공부 대화를 진행하십시오.',
                  turns: [
                    {
                      aimi: '모르는 단어 공부를 도와드리겠습니다! 어떤 단어가 알고 싶으신습니까?',
                      choices: [
                        { label: '"정직"이 무슨 뜻인지 예시와 함께 알려 주십시오.', reply: '"정직"은 거짓말을 하지 않고 바르고 솔직한 마음입니다! 예를 들어, 길에서 주운 돈을 주인에게 돌려주는 행동이 정직한 행동입니다.', good: true },
                        { label: '"정직"은 좋은 말이지?', reply: '맞습니다! 정직은 아주 멋진 말입니다. 더 자세한 뜻과 재미있는 사용법이 궁금하시다면 다시 물어보십시오!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 나의 단어 카드',
              goal: '나만의 단어 카드를 그리며 마무리하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l2',
                  title: '새 단어 발견 계획서',
                  rows: [
                    { label: '내가 선택한 질문', from: 'word_query' },
                    { label: '낱말 공부 결과', from: 'word_chat' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m3_l2',
                  prompt: '오늘 배운 "정직"이나 상상 속의 아름다운 단어의 이미지를 그려 보십시오.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '어휘 요정 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm3-l3',
    moduleId: 'm3',
    number: 3,
    kind: 'activity',
    title: '"쉽게 설명해 주십시오"라고 말합니다',
    objective: '이해하기 쉽게 예를 들어 설명해 달라고 부탁해 보십시오.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    bodyEasy: '어려우면 "쉽게 설명해 주십시오" 하고 부탁합니다.',
    bodyNormal:
      'AI의 답이 어려울 때가 있습니다. 그럴 땐 "더 쉽게 설명해 주십시오" 하고 부탁하면 쉬운 말로 다시 알려 주십시오.',
    wrapUpEasy: '어려우면 "쉽게 설명해 주십시오" 하고 말합니다.',
    wrapUpNormal: '어려운 설명을 만나면 "더 쉽게 설명해 주십시오"라고 부탁합니다. AI가 쉬운 말로 바꿔 주십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['설명', '난이도 조절'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '답이 어려우면 "쉽게 설명해 주십시오" 하고 부탁해도 될겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 몇 번이든 부탁해도 됩니다.',
            },
            {
              question: '어려운 말을 모르면 공부를 그만해야 하겠습니까?',
              answer: 'X',
              feedback: '아닙니다! 쉽게 바꿔달라고 하면 됩니다.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '설명이 너무 어렵습니다. 뭐라고 부탁하겠습니까?',
          choices: [
            { label: '"일곱 살도 알게 쉽게 설명해 주십시오"', isCorrect: true },
            { label: '"더 어렵게 해 주십시오"', isCorrect: false },
            { label: '아무 말 안 합니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"광합성을 쉽게 설명해 주십시오" 하고 부탁해 보십시오.',
          userInput: '광합성을 쉽게 설명해 주십시오',
          aiResponse: '식물이 햇빛을 먹고 밥을 만드는 것입니다. 그래서 식물은 해를 좋아합니다!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '쉽게 말해 주십시오 실험실',
          chapters: [
            {
              title: '1장: 쉬운 설명 판독함',
              goal: '어려운 설명과 쉬운 설명을 구분해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'explanation_sort',
                  prompt: '어려운 과학 용어의 나쁜(지나치게 어려운) 설명과 좋은(이해하기 쉬운) 설명을 구분하십시오.',
                  bins: [
                    { label: '이해하기 쉬운 설명', emoji: '🟢' },
                    { label: '지나치게 어려운 설명', emoji: '❌' }
                  ],
                  cards: [
                    { label: '식물이 햇빛으로 스스로 영양분을 만드는 일', emoji: '🌱', bin: 0 },
                    { label: '광합성은 엽록체에서 발생하는 화학 반응 공정', emoji: '🔬', bin: 1 },
                    { label: '물과 햇빛을 마시며 초록 잎이 밥을 먹는 현상', emoji: '☀️', bin: 0 },
                    { label: '광합성 반응 속도 및 탄소 동화 비율의 측정치', emoji: '📊', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 쉬운 설명 번역 대화',
              goal: '아이미에게 더욱 직관적인 설명을 요구해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'explanation_chat',
                  intro: '쉽게 요청하는 공부 대화를 해 보십시오.',
                  turns: [
                    {
                      aimi: '컴퓨터의 메모리(RAM)는 일하는 책상과 같아서, 컴퓨터가 켜져 있는 동안 실행 정보를 임시로 보관하는 곳입니다.',
                      choices: [
                        { label: '너무 어려운 단어야! 초등학생이 이해하게 쉽게 말해 주십시오.', reply: '좋습니다! 컴퓨터의 머릿속에 있는 조그마한 기억 서랍입니다. 컴퓨터가 일할 때 바로 꺼내 쓸 수 있도록 돕는 역할을 한습니다.', good: true },
                        { label: '메모리가 뭔지 계속 길게 다 설명해 주십시오.', reply: '데이터 전송 속도와 주소 버스 개념에 대해... 이러면 이해하기 더 어려우니, 원하시면 쉬운 예시를 드리겠습니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 나의 쉬운 공부 카드',
              goal: '실험 기록을 최종 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l3',
                  title: '쉬운 설명 정리장',
                  rows: [
                    { label: '내가 선별한 설명들', from: 'explanation_sort' },
                    { label: '쉽게 말하기 대화 결과', from: 'explanation_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '이해 쏙쏙 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm3-l4',
    moduleId: 'm3',
    number: 4,
    kind: 'activity',
    title: 'AI랑 낱말 공부',
    objective: '배우고 싶은 낱말이 들어간 문장을 AI에게 만들어 달라고 합니다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    bodyEasy: 'AI랑 같이 새 낱말을 배워봅니다.',
    bodyNormal:
      'AI한테 "과일 이름 알려 주십시오", "반대말 알려 주십시오" 하고 부탁하면 재미있게 낱말을 배울 수 있습니다.',
    wrapUpEasy: 'AI랑 같이 낱말을 배웠습니다.',
    wrapUpNormal: 'AI한테 낱말 뜻, 반대말, 비슷한 말을 물어보면서 재미있게 낱말 공부를 할 수 있습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['낱말', '반대말', '예문'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"크다"의 반대말', right: '작다' },
            { left: '"기쁘다"와 비슷한 말', right: '즐겁다' },
            { left: '"아침"의 반대말', right: '저녁' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI한테 "반대말 알려 주십시오" 하고 물어볼 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! 낱말 공부도 AI가 도와 주십시오.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"무겁다의 반대말이 뭐야?" 하고 물어봅니다.',
          userInput: '무겁다의 반대말이 뭐야?',
          aiResponse: '"무겁다"의 반대말은 "가볍다"입니다. 돌은 무겁고, 깃털 is 가벼워습니다!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '새 단어 퍼즐왕',
          chapters: [
            {
              title: '1장: 반대말 우체통',
              goal: '낱말들의 정확한 반대말을 분류하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'antonym_sort',
                  prompt: '낱말 카드를 알맞은 뜻(반대말) 바구니에 담으십시오.',
                  bins: [
                    { label: '뜨겁다의 반대말', emoji: '❄️' },
                    { label: '빠르다의 반대말', emoji: '🐢' }
                  ],
                  cards: [
                    { label: '차갑다', emoji: '🍦', bin: 0 },
                    { label: '느리다', emoji: '🐌', bin: 1 },
                    { label: '시원하다', emoji: '🍃', bin: 0 },
                    { label: '거북이', emoji: '🐢', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 스피드 단어 퀴즈',
              goal: '아이미와 함께 낱말 맞히기 대화를 하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'antonym_chat',
                  intro: '아이미의 문제에 정답을 고르십시오.',
                  turns: [
                    {
                      aimi: '신나는 단어 공부 시간! "기쁘다"의 반대 뜻을 가진 낱말은 무엇입니까?',
                      choices: [
                        { label: '슬프다', reply: '딩동댕! 기쁜 표정과 반대로 눈물을 흘리는 슬픈 마음이 반대 뜻입니다! 정말 똑똑합니다.', good: true },
                        { label: '즐겁다', reply: '어라? 즐겁다는 기쁘다와 아주 비슷한 느낌을 가진 단어입니다! 다시 한 번 생각해 보십시오.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 낱말 카드 정리',
              goal: '학습 상태를 체크하고 다짐하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l4',
                  title: '낱말 공부 계획서',
                  rows: [
                    { label: '내가 분류한 단어들', from: 'antonym_sort' },
                    { label: '퀴즈 정답 여부', from: 'antonym_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m3_l4',
                  template: '나 {이름}는 공부하며 새로운 단어를 만나면 하루에 {빈칸} 꼭 복습하고 연습하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '낱말 박사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm3-l5',
    moduleId: 'm3',
    number: 5,
    kind: 'experience',
    title: 'AI랑 이야기 만들기',
    objective: '내가 생각한 줄거리를 AI에게 말하고 이야기를 만들어 봅니다.',
    standards: ['[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.'],
    bodyEasy: 'AI랑 같이 재미있는 이야기를 만들어봅니다.',
    bodyNormal:
      'AI한테 "토끼가 나오는 이야기를 만들어줘" 하고 부탁하면 함께 이야기를 만들 수 있습니다.',
    wrapUpEasy: 'AI랑 같이 이야기를 만들어봤습니다.',
    wrapUpNormal: '주인공과 장소를 정해서 부탁하면 AI가 재미있는 이야기를 만들어줍니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['창작', '아이디어'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '이야기를 만들어달라고 할 때 더 좋은 부탁은습니까?',
          choices: [
            { label: '"토끼가 숲에서 모험하는 이야기 만들어줘"', isCorrect: true },
            { label: '"뭐든"', isCorrect: false },
            { label: '"이야기"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 이야기를 부탁해 보십시오. 주인공을 내가 좋아하는 동물로 바꿔도 됩니다!',
          userInput: '강아지가 공원에서 친구를 만나는 이야기를 세 문장으로 만들어줘',
          fallbackResponse:
            '콩이는 공원에서 낯선 고양이를 만났습니다. 처음엔 서로 멀뚱멀뚱 쳐다봤습니다. 하지만 공을 같이 쫓다 보니 둘은 금세 친구가 되었습니다!',
          allowFreeInput: true,
        },
      },
      {
        kind: 'mission',
        data: {
          title: '이야기 공장 작가 도전!',
          chapters: [
            {
              title: '1장: 이야기 무대 정하기',
              goal: '원하는 이야기의 배경과 시작 조건을 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'story_theme',
                  prompt: '어떤 신기한 배경의 이야기를 AI 도우미와 함께 만들고 싶습니까?',
                  items: [
                    { emoji: '🛸', label: '우주선 속 외계인과의 친구 되기' },
                    { emoji: '🧚', label: '비밀의 숲 속 말하는 다람쥐' },
                    { emoji: '🏰', label: '구름 위의 마법 성 탐험' }
                  ]
                }
              ]
            },
            {
              title: '2장: 한 줄 릴레이 소설',
              goal: '아이미와 대화를 나누며 스토리를 이어가십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'story_chat',
                  intro: '이야기 창작 협력 대화를 진행하십시오.',
                  turns: [
                    {
                      aimi: '멋진 테마입니다! 그럼 첫 번째 문장으로 어떤 모험이 시작될겠습니까? "주인공이 길을 걷다가..."',
                      choices: [
                        { label: '반짝이는 요술 지팡이를 주웠습니다.', reply: '좋습니다! "주인공이 길을 걷다가 반짝이는 요술 지팡이를 주웠습니다." 그다음엔 지팡이를 흔들었겠습니까? 엄청난 요술이 일어났습니다!', good: true },
                        { label: '그대로 집에 가서 잠들었습니다.', reply: '앗, 모험이 시작되기도 전에 잠들었입니다! 하지만 푹 자는 것도 평화로운 이야기습니다. 꿈속에서 신기한 꿈을 꿔 보겠습니까?' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 책 표지 디자인',
              goal: '작성 결과를 확인하고 이야기의 일러스트를 그리십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l5',
                  title: '나의 창작 스토리 보드',
                  rows: [
                    { label: '이야기 배경', from: 'story_theme' },
                    { label: '모험의 첫 시작', from: 'story_chat' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m3_l5',
                  prompt: '내가 완성한 모험 이야기 속 주인공이나 신기한 요술 도구를 상상하여 그리십시오.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '꼬마 작가 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm3-l6',
    moduleId: 'm3',
    number: 6,
    kind: 'activity',
    title: '계산이 어려울 때',
    objective: '계산은 계산기로 확인하고, 풀이 방법은 AI에게 물어봅니다.',
    standards: ['[12수학01-14] 실생활의 다양한 상황에서 필요한 화폐를 활용한다.'],
    bodyEasy: '계산이 어려우면 AI한테 도와달라고 합니다.',
    bodyNormal:
      '계산이 어려울 때 AI한테 물어보면 답과 함께 어떻게 계산했는지도 알려 주십시오.',
    wrapUpEasy: '계산이 어려우면 AI한테 물어봅니다.',
    wrapUpNormal: '계산이 어려울 때 AI한테 물어보면 계산 방법까지 알려 주십시오. 그래도 내가 한 번 더 확인합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['계산', '계산기', '검산'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '계산이 어려울 때 AI한테 물어봐도 될겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 어떻게 푸는지도 알려달라고 합니다.',
            },
            {
              question: 'AI가 알려준 답은 확인 안 해도 될겠습니까?',
              answer: 'X',
              feedback: 'AI도 가끔 틀립니다. 한 번 더 확인하면 최고입니다!',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '1,000원짜리 과자 2개를 사려면 얼마가 필요하겠습니까?',
          choices: [
            { label: '2,000원', isCorrect: true },
            { label: '1,000원', isCorrect: false },
            { label: '500원', isCorrect: false },
            { label: '10,000원', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "1000원짜리 과자 2개면 얼마야?" 하고 물어봅니다.',
          userInput: '1000원짜리 과자 2개면 얼마야?',
          aiResponse: '1000원이 2개니까 1000 더하기 1000, 모두 2000원입니다!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '수학 놀이터 도우미',
          chapters: [
            {
              title: '1장: 계산 매칭 보관소',
              goal: '거스름돈과 계산식의 올바른 매칭을 해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'math_sort',
                  prompt: '상황에 맞는 수학 계산과 정답 카드를 분류하여 담으십시오.',
                  bins: [
                    { label: '합계 계산', emoji: '➕' },
                    { label: '거스름돈 계산', emoji: '🪙' }
                  ],
                  cards: [
                    { label: '500원짜리 젤리 2개의 값은 1000원', emoji: '🍬', bin: 0 },
                    { label: '2000원을 내고 1500원짜리 빵을 사면 거스름돈 500원', emoji: '🍞', bin: 1 },
                    { label: '1000원 음료수와 500원 과자의 합은 1500원', emoji: '🥤', bin: 0 },
                    { label: '1000원을 내고 800원짜리 껌을 사면 남는 돈 200원', emoji: '🧼', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 계산 의뢰 대화',
              goal: 'AI 도우미에게 문제 해결 식을 구하는 의논을 하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'math_chat',
                  intro: 'AI에게 똑똑하게 힌트나 풀이과정을 구해 보십시오.',
                  turns: [
                    {
                      aimi: '수학 숙제나 마트 계산이 필요한습니까? 무엇이든 물어보십시오!',
                      choices: [
                        { label: '1500원짜리 우유와 1000원짜리 빵을 같이 사면 다 해서 얼마고 왜 그런지 알려 주십시오.', reply: '우유값 1500원에 빵값 1000원을 더하면 1500 + 1000 = 2500원입니다! 두 값을 함께 더하는 계산이랍니다.', good: true },
                        { label: '답이 2500원이야? 아니야?', reply: '네! 2500원이 맞습니다. 궁금하시다면 어떻게 계산하는지 덧셈 과정을 보여드릴 수 있습니다.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 거스름돈 확인',
              goal: '요약 카드를 통해 식을 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l6',
                  title: '수학 도우미 작전판',
                  rows: [
                    { label: '내가 해결한 문제들', from: 'math_sort' },
                    { label: '풀이 계산 결과', from: 'math_chat' }
                  ]
                }
              ]
            },
            {
              title: '4장: 예고: 첫 생각 저장',
              goal: '공부가 막힌 장면에서 처음 생각한 도움 방법을 기록해 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m3.preview]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '연산 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm3-l7',
    moduleId: 'm3',
    number: 7,
    kind: 'concept',
    title: '긴 글을 짧게 줄여줍니다',
    objective: '긴 글을 세 문장으로 짧게 요약해 달라고 해 보십시오.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '긴 글이 힘들면 "짧게 줄여줘" 하고 부탁합니다.',
    bodyNormal:
      '글이 너무 길어서 읽기 힘들면 AI한테 "짧게 요약해 주십시오" 하고 부탁합니다. 중요한 것만 남겨줍니다.',
    wrapUpEasy: '긴 글은 "짧게 줄여줘" 하고 부탁합니다.',
    wrapUpNormal: '긴 글은 AI한테 요약을 부탁합니다. 중요한 내용만 짧게 정리해 주십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['요약', '핵심', '비교'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '요약은 긴 글을 짧게 정리하는 거입니까?',
              answer: 'O',
              feedback: '맞습니다! 중요한 것만 남기는 것입니다.',
            },
            {
              question: '요약하면 글이 더 길어질겠습니까?',
              answer: 'X',
              feedback: '요약은 글을 짧게 만듭니다.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '긴 글을 짧게 만들고 싶습니다. 뭐라고 부탁하겠습니까?',
          choices: [
            { label: '"이 글을 두 줄로 요약해 주십시오"', isCorrect: true },
            { label: '"더 길게 써 주십시오"', isCorrect: false },
            { label: '"글자 크게 해 주십시오"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '긴 동화를 "한 줄로 요약해 주십시오" 하고 부탁해 보십시오.',
          userInput: '토끼와 거북이 이야기를 한 줄로 요약해 주십시오',
          aiResponse: '빠른 토끼가 낮잠을 자는 동안, 느려도 끝까지 걸은 거북이가 이겼다는 이야기입니다.',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '핵심 한 줄 요약소',
          chapters: [
            {
              title: '1장: 최고의 요약 문장',
              goal: '긴 글에서 핵심 내용만 쏙 골라낸 한 문장을 선택하십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'summary_select',
                  prompt: '흥부와 놀부 이야기의 핵심을 가장 잘 요약한 짧은 글은 무엇입니까?',
                  items: [
                    { emoji: '🕊️', label: '제비 다리를 고쳐준 착한 흥부는 복을 받고 욕심쟁이 놀부는 벌을 받았다.' },
                    { emoji: '🍉', label: '흥부가 어느 날 박을 켰더니 금은보화가 쏟아져 나와서 신났다는 이야기다.' },
                    { emoji: '❌', label: '놀부가 맛있는 밥을 많이 먹고 뚱뚱해져서 밭을 갈았다는 슬픈 이야기다.' }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약 요청 대화',
              goal: '글을 줄여달라는 제약 조건 대화를 해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'summary_chat',
                  intro: '아이미에게 "두 줄로 요약"을 명확히 부탁하십시오.',
                  turns: [
                    {
                      aimi: '심청이는 눈먼 아버지를 위해 공양미 삼백 석에 몸을 던져 인당수에 빠졌지만 용왕님의 도움으로 살아나 아버지를 뵙고 아버지의 눈을 뜨게 했습니다.',
                      choices: [
                        { label: '이 긴 이야기를 딱 한 줄로 요약해 주십시오.', reply: '심청이가 효심으로 인당수에 몸을 던졌다가 되살아나 아버지를 돕고 눈을 뜨게 만든 이야기입니다!', good: true },
                        { label: '글쎄, 심청이가 누구인지 전부 다 알려줄래?', reply: '심청이는 고대 소설 속 주인공으로 부모님을 돕는 착한 효녀 캐릭터입니다. 아주 많은 분량이 있지만 한 문장으로도 이해할 수 있죠.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 요약 결과판',
              goal: '나만의 요약 계획 카드를 최종 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l7',
                  title: '한 줄 요약 보고서',
                  rows: [
                    { label: '선택한 흥부 놀부 요약', from: 'summary_select' },
                    { label: '심청전 요약 결과', from: 'summary_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '요약 요술사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm3-l8',
    moduleId: 'm3',
    number: 8,
    kind: 'activity',
    title: 'AI랑 퀴즈 놀이',
    objective: 'AI에게 문제를 만들어 달라고 해서 스스로 풀어 봅니다.',
    standards: ['[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.'],
    bodyEasy: 'AI한테 퀴즈를 내달라고 해 보십시오. 재미있습니다!',
    bodyNormal:
      'AI한테 "동물 퀴즈 내줘" 하고 부탁하면 퀴즈 놀이를 할 수 있습니다. 놀면서 공부가 됩니다.',
    wrapUpEasy: 'AI랑 퀴즈 놀이를 하면 공부가 재미있습니다.',
    wrapUpNormal: 'AI한테 퀴즈를 내달라고 하면 놀면서 공부할 수 있습니다. 배운 것도 퀴즈로 연습해 보십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['퀴즈', '문제 생성'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI한테 "퀴즈 내줘" 하고 부탁할 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! AI는 퀴즈도 잘 내줍니다.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"동물 퀴즈 내줘"', right: '동물 문제를 내줍니다' },
            { left: '"정답 알려 주십시오"', right: '답을 알려 주십시오' },
            { left: '"한 문제 더!"', right: '새 문제를 내줍니다' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "쉬운 동물 퀴즈 하나 내줘" 하고 부탁해 보십시오.',
          userInput: '쉬운 동물 퀴즈 하나 내줘',
          aiResponse: '문제! 목이 아주 길어서 높은 나뭇잎을 먹을 수 있는 동물은 무엇입니까? 정답은... 기린!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 퀴즈 스테이지',
          chapters: [
            {
              title: '1장: 배운 내용 복습 퀴즈',
              goal: '아이미가 내는 퀴즈를 풀고 실력을 다져 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'quiz_chat',
                  intro: '재미있는 단어 맞히기 퀴즈 대화입니다.',
                  turns: [
                    {
                      aimi: '퀴즈 스타트! "물어보는 말, 질문"을 나타내는 AI 비법 용어는 무엇입니까?',
                      choices: [
                        { label: '프롬프트', reply: '우와! 대단합니다. 정답입니다! 질문이나 부탁을 프롬프트라고 부른습니다.', good: true },
                        { label: '키보드', reply: '어라? 키보드는 글자를 입력할 때 쓰는 기계 도구입니다. 다시 생각해 보십시오!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '2장: 퀴즈 배지 뱃지 선택',
              goal: '내 퀴즈 성과에 어울리는 축하 스티커를 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'quiz_sticker',
                  prompt: '퀴즈를 풀고 획득하고 싶은 멋진 마크를 하나만 골라 보십시오.',
                  items: [
                    { emoji: '👑', label: '퀴즈 챔피언 마크' },
                    { emoji: '⭐', label: '노력하는 성실 마크' },
                    { emoji: '🔥', label: '정렬의 백점 마크' }
                  ]
                }
              ]
            },
            {
              title: '3장: 퀴즈 요약표',
              goal: '오늘 푼 퀴즈 카드를 확인해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l8',
                  title: '나의 퀴즈 스테이지 점수판',
                  rows: [
                    { label: '퀴즈 성공 여부', from: 'quiz_chat' },
                    { label: '내가 선택한 축하 배지', from: 'quiz_sticker' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '퀴즈왕 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm3-l9',
    moduleId: 'm3',
    number: 9,
    kind: 'concept',
    title: '그림을 설명해 주십시오',
    objective: 'AI에게 그림을 보여주고 무슨 그림인지 설명해 달라고 합니다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    bodyEasy: 'AI는 그림을 보고 설명해줄 수 있습니다.',
    bodyNormal:
      'AI한테 사진이나 그림을 보여주면 "무엇이 있는지" 설명해 주십시오. 그림 공부에도 도움이 됩니다.',
    wrapUpEasy: 'AI는 그림을 보고 설명해 주십시오.',
    wrapUpNormal: 'AI한테 그림을 보여주고 설명을 부탁하면 그림 속 내용을 말로 알려 주십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['설명', '이미지 설명'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '그림 설명을 부탁하는 말은 어느 것입니까?',
          choices: [
            { label: '"이 그림에 뭐가 있는지 설명해 주십시오"', isCorrect: true },
            { label: '"그림 지워줘"', isCorrect: false },
            { label: '"음..."', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사진 속에 뭐가 있는지 말해줄 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! 단원 1에서 배운 이미지 인식입니다.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 그림 설명을 부탁해 보십시오.',
          userInput: '(그림) 이 그림을 설명해 주십시오',
          aiResponse: '파란 하늘 아래 노란 해바라기가 세 송이 피어 있습니다. 나비 한 마리가 날아다니고 있습니다!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 눈 돋보기 탐사',
          chapters: [
            {
              title: '1장: 설명하기 좋은 사진',
              goal: 'AI가 쉽게 설명할 수 있는 사진 형태를 구분하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'image_sort',
                  prompt: 'AI가 정확히 알아보고 묘사하기 쉬운 사진과, 인식하기 힘든 나쁜 사진을 분류하십시오.',
                  bins: [
                    { label: '알아보기 쉬운 사진', emoji: '📷' },
                    { label: '이해하기 힘든 사진', emoji: '🌫️' }
                  ],
                  cards: [
                    { label: '빛이 밝고 선명한 과일 바구니 사진', emoji: '🍎', bin: 0 },
                    { label: '어둡고 초점이 맞지 않아 흐릿한 사진', emoji: '🌫️', bin: 1 },
                    { label: '배경이 깨끗하고 물체가 하나인 컵 사진', emoji: '🥛', bin: 0 },
                    { label: '손가락으로 렌즈를 반쯤 가린 어두운 사진', emoji: '🖐️', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 이미지 분석 대화',
              goal: '사진을 보낸 상황의 묘사를 들어 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'image_chat',
                  intro: '그림 속 사물을 묻는 대화를 나누십시오.',
                  turns: [
                    {
                      aimi: '귀여운 강아지가 초록색 잔디밭 위에서 빨간 공을 물고 달리는 사진을 보았습니다!',
                      choices: [
                        { label: '사진 속 강아지가 물고 있는 물건의 색깔은 뭐야?', reply: '강아지가 물고 있는 공의 색깔은 예쁜 "빨간색"입니다! 잔디는 초록색이고습니다.', good: true },
                        { label: '강아지의 이름이 무엇이고 나이는 몇 살이야?', reply: '사진 한 장만으로는 강아지의 이름과 나이를 알 수 없습니다. 그림 속에 보이는 것들만 제가 설명해 드릴 수 있습니다.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 그림 보드 작성',
              goal: '오늘 탐험한 사진 이야기를 직접 그리고 완료하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l9',
                  title: '나의 그림 탐사 카드',
                  rows: [
                    { label: '인식한 사진 특징', from: 'image_sort' },
                    { label: '이미지 질의 결과', from: 'image_chat' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m3_l9',
                  prompt: 'AI가 설명해 준 "초록 잔디밭과 빨간 공을 쫓는 귀여운 강아지"를 상상하여 그려 보십시오.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '눈사람 탐험가 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm3-l10',
    moduleId: 'm3',
    number: 10,
    kind: 'experience',
    title: '오늘 배운 것을 AI랑 복습합니다',
    objective: 'AI에게 오늘 배운 것을 짧게 줄여 달라고 하고 읽어 봅니다.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '배운 걸 AI랑 한 번 더 이야기하면 오래 기억납니다.',
    bodyNormal:
      '오늘 배운 것을 AI한테 물어보거나 설명해보면 복습이 됩니다. 한 번 더 보면 오래 기억납니다.',
    wrapUpEasy: '배운 건 AI랑 한 번 더 복습합니다.',
    wrapUpNormal: '배운 것을 AI랑 다시 이야기하면 복습이 됩니다. 복습하면 오래 기억할 수 있습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['복습', '요약', '검증', '정의'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '복습하면 배운 게 더 오래 기억날겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 한 번 더 보면 기억이 튼튼해져습니다.',
            },
            {
              question: '복습은 한 번 배운 걸 다시 보는 거입니까?',
              answer: 'O',
              feedback: '맞습니다! 다시 보고, 다시 말해보는 것입니다.',
            },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 배운 것에 대해 물어봅니다. 우리가 배운 "AI가 뭐야?"를 물어봐도 좋습니다!',
          userInput: 'AI가 뭔지 한 문장으로 알려 주십시오',
          fallbackResponse: 'AI는 컴퓨터가 사람처럼 생각하고 대답할 수 있게 만든 기술입니다!',
          allowFreeInput: true,
        },
      },
      {
        kind: 'mission',
        data: {
          title: '오늘의 복습 챔피언',
          chapters: [
            {
              title: '1장: 복습 주제 고르기',
              goal: '오늘 함께 나눈 공부 도우미의 활용 비법 주제를 고르십시오.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'review_check',
                  prompt: '오늘 복습할 핵심 용어와 기능들을 모두 선택해 보십시오.',
                  items: [
                    { emoji: '📖', label: '단어 뜻 물어보기' },
                    { emoji: '📶', label: '단계를 나눠 쪼개 묻기' },
                    { emoji: '📏', label: '짧게 핵심만 요약 받기' },
                    { emoji: '🛡️', label: '이상하면 어른에게 확인하기' }
                  ]
                }
              ]
            },
            {
              title: '2장: 최종 복습 다짐 대화',
              goal: '아이미와 복습 퀴즈 대화를 완성해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'review_chat',
                  intro: '마지막 복습 확인 대화를 나누십시오.',
                  turns: [
                    {
                      aimi: '오늘 공부 도우미 활용법을 완벽히 소화했습니까? 복습하면 공부한 것이 머릿속에 더 오래 머문습니다!',
                      choices: [
                        { label: '응! 이제 모르는 단어가 나와도 무섭지 않아.', reply: '와! 정말 든든하입니다. 모르는 낱말은 언제든 제게 물어보고, 이해하기 어려운 설명은 "쉽게 고쳐줘" 요청하십시오!', good: true },
                        { label: 'AI가 숙제를 알아서 다 해주면 참 편리하겠어.', reply: '어라? AI에게 숙제를 그냥 복사해서 붙여넣게 시키면 내 머리가 공부할 기회를 잃게 됩니다. 공부는 스스로 하고, AI는 도우미로만 써야 한습니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 복습 수첩 다짐',
              goal: '오늘 공부의 최종 약속을 완성하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l10',
                  title: '나의 공부 복습장',
                  rows: [
                    { label: '내가 복습한 핵심 내용', from: 'review_check' },
                    { label: '최종 복습 대화', from: 'review_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m3_l10',
                  template: '나 {이름}는 공부가 어렵고 지칠 때 AI 공부 도우미와 함께 {빈칸} 복습하며 이겨내겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '복습 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm3-l11',
    moduleId: 'm3',
    number: 11,
    kind: 'concept',
    title: '나만의 공부 도우미 (마무리)',
    objective: '공부할 때 AI를 어떻게 쓸지 약속을 만들어 봅니다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: 'AI는 나의 공부 도우미입니다. 배운 걸 확인해 보십시오.',
    bodyNormal:
      '단원 3에서 AI로 공부하는 방법을 배웠습니다. 물어보기, 쉽게 부탁하기, 요약, 퀴즈, 복습까지 확인해 보십시오!',
    wrapUpEasy: '단원 3을 다 배웠습니다! AI는 나의 공부 도우미입니다.',
    wrapUpNormal: '단원 3을 마쳤습니다! 물어보기, 쉽게 설명 부탁하기, 요약, 퀴즈, 복습 — AI 공부 활용법을 배웠습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['도우미', '요약', '퀴즈', '복습', '정의', '표절'] } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '모르는 단어', right: '"무슨 뜻이야?" 물어봅니다' },
            { left: '어려운 설명', right: '"쉽게 설명해 주십시오" 부탁합니다' },
            { left: '긴 글', right: '"짧게 요약해 주십시오" 부탁합니다' },
            { left: '심심한 공부', right: '"퀴즈 내줘" 부탁합니다' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI 답이 이상할 때는 어떻게 합니다?',
          choices: [
            { label: '다시 물어보고 선생님께 확인합니다', isCorrect: true },
            { label: '무조건 다 믿습니다', isCorrect: false },
            { label: '공부를 그만둬습니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 마지막으로 인사해 보십시오. "오늘 공부 도와 주십시오서 고마워!"',
          userInput: '오늘 공부 도와 주십시오서 고마워!',
          aiResponse: '괜찮습니다! 궁금한 게 생기면 언제든 또 물어봐 주십시오. 같이 공부해서 즐거웠습니다!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '공부 짝꿍 졸업장',
          chapters: [
            {
              title: '1장: 올바른 공부 태도 분류',
              goal: '공부할 때 AI를 바르게 쓰는 방법과 오용하는 사례를 분류해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'study_behavior_sort',
                  prompt: 'AI 공부 도우미의 올바른 활용 카드를 짝꿍 상자에 담으십시오.',
                  bins: [
                    { label: '똑똑한 활용법', emoji: '🧑‍🎓' },
                    { label: '잘못된 활용법', emoji: '❌' }
                  ],
                  cards: [
                    { label: '모르는 단어 뜻 물어보기', emoji: '📖', bin: 0 },
                    { label: 'AI에게 수학 숙제를 대신 풀게 하고 베끼기', emoji: '✍️', bin: 1 },
                    { label: '어려운 단락을 "쉽게 설명해달라" 부탁하기', emoji: '💡', bin: 0 },
                    { label: '대화 나누며 단어 뜻 퀴즈 풀기', emoji: '❓', bin: 0 },
                    { label: '인터넷 검색 대신 전부 지어낸 답 복사하기', emoji: '📋', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 공부 도우미와 작별 인사',
              goal: '단원 3을 완주한 소감을 나누십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'study_graduation_chat',
                  intro: '마지막 완주 축하 대화입니다.',
                  turns: [
                    {
                      aimi: '정말 수고 많았습니다! 이제 공부 도우미 활용법을 모두 터득했입니다. 든든한 AI 짝꿍과 함께라면 어떤 공부도 문제없겠습니까?',
                      choices: [
                        { label: '응! AI와 함께 더 즐겁게 공부할 수 있게 되었어.', reply: '최고의 답변입니다! 당신은 이제 스스로 지식을 찾아 나설 준비가 되었습니다. 항상 성실히 나아가길 응원합니다!', good: true },
                        { label: '앞으로도 모르는 게 생기면 많이 도와 주십시오!', reply: '언제든 준비되어 있습니다! 배움의 길에서 언제나 든든한 도우미가 되어 드리겠습니다.', good: true }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 본 활동: 생각 리플레이',
              goal: '첫 생각과 달라진 조건을 비교하고, 나에게 맞는 공부 도움을 골라 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m3.main]
            },
            {
              title: '4장: 최종 공부짱 선언',
              goal: '수료 다짐 카드를 완성하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m3_l11',
                  title: '공부짱 졸업 요약서',
                  rows: [
                    { label: '나의 바른 공부 습관', from: 'study_behavior_sort' },
                    { label: '졸업 소감 대화', from: 'study_graduation_chat' },
                    { label: '판단 비교와 새 장면 기록', from: 'judgment_main_m3_l11' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m3_l11',
                  template: '나 {이름}는 AI를 스스로의 실력을 키우는 {빈칸} 공부 도우미로 안전하게 활용할 것을 약속합니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'certificate',
            badgeLabel: '공부 마스터 짝꿍 수료증 획득!'
          }
        }
      }
    ],
  },
];
