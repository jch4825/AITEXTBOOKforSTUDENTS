import type { LessonContent } from '../../types';
import { GENERALIZATION_CYCLES } from '../generalizationCycles';

/**
 * 단원 2 — AI랑 말해보기 (프롬프트 잘 쓰는 법)
 *
 * 11차시. 학생이 "AI한테 어떻게 물어봐야 원하는 답이 나오는지"를
 * 실전 감각으로 익히는 것이 목표. real-ai 스텝 4회 (l3/l5/l8/l10).
 */
export const M2_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm2-l1',
    moduleId: 'm2',
    number: 1,
    kind: 'concept',
    title: '잘 물어봐야 잘 답해 주십시오',
    objective: '프롬프트에 들어갈 세 가지 요소를 알아봅니다.',
    standards: [
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
      '[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
    ],
    wrapUpEasy: 'AI한테 하는 질문을 프롬프트라고 합니다. 잘 물으면 좋은 답이 옵니다.',
    wrapUpNormal: 'AI한테 던지는 질문이나 부탁을 프롬프트라고 합니다. 어떻게 묻느냐에 따라 답이 달라져습니다.',
    bodyEasy: 'AI한테 잘 물어보면 좋은 답이 옵니다. 이걸 프롬프트라고 합니다.',
    bodyNormal:
      'AI한테 어떻게 물어보는지에 따라 답이 달라져습니다. AI한테 던지는 질문이나 부탁을 프롬프트라고 합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트', '지시', '맥락', '형식'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '어느 게 더 잘 물어본 걸겠습니까?',
          choices: [
            { label: '"강아지 이름 세 개 추천해 주십시오"', isCorrect: true },
            { label: '"음..."', isCorrect: false },
            { label: '"어"', isCorrect: false },
            { label: '"뭐"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"뭘 해 주십시오"만 말하면 AI가 뭘 해야 할지 알겠습니까?',
              answer: 'X',
              feedback: '무엇을 원하는지 구체적으로 말해 주십시오야 합니다.',
            },
            {
              question: '프롬프트는 AI한테 하는 질문이나 부탁입니까?',
              answer: 'O',
              feedback: '맞습니다! 잘 만든 프롬프트가 좋은 답을 데려옵니다.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"강아지 이름 추천해 주십시오"', right: '이름들을 알려 주십시오' },
            { left: '"..."', right: 'AI가 뭘 원하는지 모릅니다' },
            { left: '"영어로 안녕이 뭐야?"', right: '"Hello" 라고 답해 주십시오' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '프롬프트 요리 준비 완료!',
          chapters: [
            {
              title: '1장: AI 질문의 이름',
              goal: 'AI에게 질문하는 올바른 이름을 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'prompt_name',
                  prompt: 'AI에게 건네는 질문이나 부탁을 뜻하는 낱말은 무엇입니까?',
                  items: [
                    { emoji: '🧑‍🍳', label: '프롬프트' },
                    { emoji: '⚙️', label: '모니터' },
                    { emoji: '🔌', label: '콘센트' }
                  ]
                }
              ]
            },
            {
              title: '2장: 좋은 질문 분류함',
              goal: '좋은 프롬프트와 나쁜 프롬프트를 구분해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'prompt_sort',
                  prompt: '좋은 질문(명확한 프롬프트)과 나쁜 질문(기호나 무의미한 낱말)을 알맞은 바구니에 담아 보십시오.',
                  bins: [
                    { label: '좋은 질문', emoji: '🟢' },
                    { label: '나쁜 질문', emoji: '❌' }
                  ],
                  cards: [
                    { label: '강아지 이름 추천해 주십시오', emoji: '🐶', bin: 0 },
                    { label: '어... 음...', emoji: '💬', bin: 1 },
                    { label: '오늘 날씨 알려 주십시오', emoji: '☀️', bin: 0 },
                    { label: 'ㅠㅠ', emoji: '💧', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '3장: 요리사 선서',
              goal: '다짐을 완성하고 카드를 획득하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l1',
                  title: '프롬프트 요리사 선서 카드',
                  rows: [
                    { label: 'AI 질문의 뜻', from: 'prompt_name' },
                    { label: '분류한 질문들', from: 'prompt_sort' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m2_l1',
                  template: '나 {이름}는 AI에게 정확하게 묻는 멋진 프롬프트 요리사가 {빈칸} 다짐합니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '프롬프트 초보 요리사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm2-l2',
    moduleId: 'm2',
    number: 2,
    kind: 'concept',
    title: '짧게 물어보기',
    objective: '여러 부탁을 한 문장씩 나누어 물어봅니다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '한 문장으로 짧게 물어봅니다.',
    wrapUpNormal: '프롬프트는 짧고 분명할수록 좋습니다. 한 번에 하나씩 물어봅니다.',
    bodyEasy: '너무 길게 말하지 않아도 됩니다. 한 문장으로 짧게 물어봅니다.',
    bodyNormal:
      '프롬프트는 짧고 명확할수록 좋습니다. 한 문장으로 원하는 걸 콕 집어 말하면 AI가 더 잘 답해 주십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트', '간결'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '짧게 콕 집어 물어보면 답이 더 정확합니다?',
              answer: 'O',
              feedback: '맞습니다! 짧고 분명하게 물어봅니다.',
            },
            {
              question: '한 문장에 여러 질문을 다 넣어도 괜찮습니까?',
              answer: 'X',
              feedback: '한 번에 하나씩 물어보는 게 답이 잘 나옵니다.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"기린 소개해 주십시오" 라고 짧게 물어봅니다.',
          userInput: '기린 소개해 주십시오',
          aiResponse: '기린은 목이 아주 긴 동물입니다! 나뭇잎을 먹고, 아프리카에 살습니다.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '어느 쪽이 더 짧고 분명한 프롬프트입니까?',
          choices: [
            { label: '"코끼리 사진 그려줘"', isCorrect: true },
            { label: '"음 그러니까 뭐랄까 그림을 좀 그리는데 코끼리를…"', isCorrect: false },
            { label: '"안녕"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '짧고 명확한 한 문장',
          chapters: [
            {
              title: '1장: 간결한 질문 고르기',
              goal: '길고 꼬여있는 문장 대신 간결한 질문을 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'short_prompt_select',
                  prompt: 'AI가 가장 답하기 쉬운 가장 짧고 분명한 질문은 무엇입니까?',
                  items: [
                    { emoji: '🐘', label: '코끼리가 뭐 먹는지 설명해 주십시오' },
                    { emoji: '💬', label: '어... 저기 있잖아 코끼리라는 동물 있잖아 걔가 밥을 먹는데...' }
                  ]
                }
              ]
            },
            {
              title: '2장: 짧은 프롬프트 조립',
              goal: '핵심 단어 조각을 조립해 보십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'short_prompt_build',
                  prompt: '조각을 끼워 짧고 분명한 프롬프트를 완성하십시오.',
                  slots: [
                    { label: '무엇을' },
                    { label: '부탁하는 말' }
                  ],
                  pieces: [
                    { label: '사자 그려줘', slot: 0, quality: 'good' },
                    { label: '어... 동물 그림 좀', slot: 0, quality: 'weak' },
                    { label: '예쁘게', slot: 1, quality: 'good' },
                    { label: '아무렇게나', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '멋진 사자 그림을 예쁘게 완성해 드리겠습니다!',
                    weak: '음... 어떤 동물을 어떻게 그려줄겠습니까? 자세히 말해 주십시오.'
                  }
                }
              ]
            },
            {
              title: '3장: 완성 카드',
              goal: '요약 카드를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l2',
                  title: '나의 간결 프롬프트 카드',
                  rows: [
                    { label: '내가 고른 짧은 프롬프트', from: 'short_prompt_select' },
                    { label: '조립한 프롬프트 결과', from: 'short_prompt_build' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '간결 요리사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm2-l3',
    moduleId: 'm2',
    number: 3,
    kind: 'concept',
    title: '궁금한 걸 콕 집어서',
    objective: '"그거" 대신 정확한 이름으로 물어봅니다.',
    standards: [
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
      '[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.',
    ],
    wrapUpEasy: '궁금한 걸 콕 집어서 물어봅니다.',
    wrapUpNormal: '"아무거나" 대신 원하는 걸 콕 집어 물으면 AI가 정확하게 답해 주십시오.',
    bodyEasy: '"이거 알려 주십시오" 처럼 콕 집어서 물으면 AI가 알아듣기 쉽습니다.',
    bodyNormal:
      '"뭐든지 좋아" 대신 "떡볶이 만드는 법 알려 주십시오" 처럼 궁금한 걸 콕 집으면 AI가 정확히 답해 주십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트', '구체적'] } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"아무거나"', right: 'AI가 뭘 골라야 할지 모릅니다' },
            { left: '"떡볶이 만드는 법"', right: '순서를 알려 주십시오' },
            { left: '"영어 자기소개"', right: '문장을 만들어줍니다' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '어느 쪽이 더 콕 집은 질문입니까?',
          choices: [
            { label: '"바다 동물 하나 알려 주십시오"', isCorrect: true },
            { label: '"뭐 하나 알려 주십시오"', isCorrect: false },
            { label: '"몰라"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 콕 집어 물어봅니다. 아래 글을 그대로 보내도 되고, 🎤 로 내 목소리로 바꿔서 보내도 됩니다.',
          userInput: '친구한테 소개할 만한 재미있는 놀이 하나 알려 주십시오',
          fallbackResponse:
            '"제기차기" 어떻습니까? 콩주머니나 둥근 물건을 발로 차서 몇 번 오래 차는지 세는 놀이입니다!',
          allowFreeInput: true,
          systemInstruction: '너의 이름은 "아이미"야. 너는 초등학생들의 친절한 AI 로봇 친구야. 학생이 친구들과 놀 수 있는 재미있고 간단한 놀이(예: 제기차기, 수건돌리기 등)를 추천해 주십시오. 설명은 아주 쉽고 친근하게 하고, 마지막에 [happy] 또는 [cheer] 태그를 붙여줘.',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '콕 집어 요리법',
          chapters: [
            {
              title: '1장: 구체적 조건 조립',
              goal: '구체적인 질문 조각을 조립해 보십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'specific_build',
                  prompt: '조건을 조립해 무엇을 원하는지 콕 집은 프롬프트를 만드십시오.',
                  slots: [
                    { label: '원하는 종류' },
                    { label: '원하는 개수' }
                  ],
                  pieces: [
                    { label: '재미있는 동화책 제목', slot: 0, quality: 'good' },
                    { label: '책 이름 아무거나', slot: 0, quality: 'weak' },
                    { label: '3개만 알려 주십시오', slot: 1, quality: 'good' },
                    { label: '많이 알려 주십시오', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '추천 동화책 3개: 1.아기돼지 삼형제 2.신데렐라 3.피터팬 입니다!',
                    weak: '책이 너무 많습니다. 어떤 종류의 책을 몇 개 알고 싶습니까?'
                  }
                }
              ]
            },
            {
              title: '2장: 대화로 콕 집어 묻기',
              goal: '아이미와 이야기하며 콕 집어 묻는 연습을 하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'specific_chat',
                  intro: '아이미의 답변을 콕 집어 유도해 보십시오.',
                  turns: [
                    {
                      aimi: '안녕하세요! 저는 무엇이든 알려주는 AI입니다. 오늘 어떤 걸 도와드리겠습니까?',
                      choices: [
                        { label: '맛있는 떡볶이 만드는 법을 알려 주십시오.', reply: '네! 떡볶이를 만들기 위해서는 떡, 고추장, 어묵이 필요합니다. 자세한 순서를 알려드리겠습니까?', good: true },
                        { label: '음... 맛있는 거 아무거나 레시피 알려 주십시오.', reply: '음... 세상에는 너무 많은 요리가 있습니다. 어떤 요리를 드시고 싶으신지 콕 집어 주시겠습니까?' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 요약 카드',
              goal: '나의 발견 카드를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l3',
                  title: '콕 집어 질문 카드',
                  rows: [
                    { label: '내가 조립한 질문', from: 'specific_build' },
                    { label: '대화 선택 결과', from: 'specific_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '콕집기 마스터 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm2-l4',
    moduleId: 'm2',
    number: 4,
    kind: 'concept',
    title: '예시를 하나 보여줍니다',
    objective: '원하는 답 모양을 예시로 보여주며 부탁해 보십시오.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '예시를 보여주면 AI가 더 잘 만듭니다.',
    wrapUpNormal: '원하는 모양을 예시로 하나 보여주면 AI가 그 모양대로 만들어줍니다.',
    bodyEasy: '"이런 식으로 해 주십시오" 하고 예시를 보여주면 AI가 더 잘 만듭니다.',
    bodyNormal:
      '원하는 답 모양을 하나 예시로 먼저 보여주면 AI가 그 모양대로 만들어줍니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['예시', '예시 제시'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '예시가 들어간 프롬프트는 어느 것입니까?',
          choices: [
            { label: '"이런 식으로 세 개 만들어줘: 사과는 빨개요"', isCorrect: true },
            { label: '"뭐 좀 만들어줘"', isCorrect: false },
            { label: '"음..."', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"동물 이름으로 짧은 문장을 만들어줘. 예: 강아지가 뛰습니다"',
          userInput: '동물 이름으로 짧은 문장을 만들어줘. 예: 강아지가 뛰습니다',
          aiResponse: '고양이가 잡니다. 토끼가 뛰습니다. 사자가 웃습니다.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '예시를 보여주면 AI가 모양을 따라 만들 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! 예시 하나가 큰 힌트가 됩니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '예시 레시피 굽기',
          chapters: [
            {
              title: '1장: 예시 질문 찾기',
              goal: '예시가 포함된 질문을 분류해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'example_sort',
                  prompt: '예시가 포함된 질문과 단순 질문을 알맞은 상자에 분류하십시오.',
                  bins: [
                    { label: '예시 포함', emoji: '💡' },
                    { label: '단순 질문', emoji: '✏️' }
                  ],
                  cards: [
                    { label: '동물 단어로 짧은 문장 만들어줘. 예: 강아지가 짖는다', emoji: '🐶', bin: 0 },
                    { label: '동물 단어로 문장 만들어줘', emoji: '🦁', bin: 1 },
                    { label: '과일 문장 알려 주십시오. 예: 사과는 맛있다', emoji: '🍎', bin: 0 },
                    { label: '과일 문장 추천해 주십시오', emoji: '🍇', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 예시 질문 조립',
              goal: '예시 조각을 끼워 질문을 완성하십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'example_build',
                  prompt: '예시 조각을 끼워 AI가 따라 할 힌트를 제공하십시오.',
                  slots: [
                    { label: '원하는 일' },
                    { label: '따라 할 예시' }
                  ],
                  pieces: [
                    { label: '짧은 영어 인사말 알려 주십시오', slot: 0, quality: 'good' },
                    { label: '영어 알려 주십시오', slot: 0, quality: 'weak' },
                    { label: '예: 안녕은 Hello 야', slot: 1, quality: 'good' },
                    { label: '아무거나 써 주십시오', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '예시를 잘 보고 똑같이 만들어 드려요: 고마워는 Thank you 야!',
                    weak: '예시가 없으면 제가 원하는 형식대로 답하기가 어렵습니다.'
                  }
                }
              ]
            },
            {
              title: '3장: 예시 요약',
              goal: '완성 카드를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l4',
                  title: '예시 활용 카드',
                  rows: [
                    { label: '분류한 예시들', from: 'example_sort' },
                    { label: '내가 만든 예시 질문', from: 'example_build' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '예시 마법사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm2-l5',
    moduleId: 'm2',
    number: 5,
    kind: 'concept',
    title: '역할을 정해 주십시오',
    objective: 'AI에게 역할을 주고 원하는 말투로 답을 들어 봅니다.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    wrapUpEasy: '"친구처럼 말해 주십시오" 하면 말투가 바뀌습니다.',
    wrapUpNormal: 'AI한테 역할을 정해주면 그 역할의 말투로 답해 주십시오.',
    bodyEasy: '"친구처럼 말해 주십시오" 하면 AI가 친구처럼 답해 주십시오.',
    bodyNormal:
      'AI한테 "이렇게 말해 주십시오" 하고 역할을 정해주면 그 성격으로 답해 주십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['역할', '역할 지정', '말투', '분위기'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '"친구처럼 말해 주십시오"', right: '반말로 친근하게 답합니다' },
            { left: '"선생님처럼 말해 주십시오"', right: '차분히 설명해 주십시오' },
            { left: '"동화 작가처럼 말해 주십시오"', right: '이야기 느낌으로 답합니다' },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '"동화 작가처럼 말해 주십시오. 강아지가 산책 가는 이야기를 한 줄로."',
          userInput: '동화 작가처럼 말해 주십시오. 강아지가 산책 가는 이야기를 한 줄로.',
          fallbackResponse:
            '해가 반짝 웃던 어느 날, 뽀삐는 꼬리를 살랑살랑 흔들며 마을 골목길을 산책했습니다.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"친구처럼 말해 주십시오"라고 하면 AI가 다르게 답하겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 역할에 따라 말투가 달라져습니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 직업 놀이',
          chapters: [
            {
              title: '1장: 알맞은 역할 찾기',
              goal: '상황에 맞는 AI의 역할을 골라 보십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'role_choice',
                  prompt: '재미있는 동화 이야기를 들려주기 위해 지정할 AI의 가장 어울리는 역할은 무엇입니까?',
                  items: [
                    { emoji: '🧚', label: '상냥한 동화 작가' },
                    { emoji: '🩺', label: '친절한 의사 선생님' },
                    { emoji: '⚙️', label: '바쁜 기계 요리사' }
                  ]
                }
              ]
            },
            {
              title: '2장: 역할 프롬프트 조립',
              goal: '역할 지정 프롬프트를 완성하십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'role_build',
                  prompt: '역할과 질문을 함께 끼워 대화 프롬프트를 만드십시오.',
                  slots: [
                    { label: '역할 정하기' },
                    { label: '질문하기' }
                  ],
                  pieces: [
                    { label: '너는 훌륭한 역사 선생님이야', slot: 0, quality: 'good' },
                    { label: '너는 그냥 로봇이야', slot: 0, quality: 'weak' },
                    { label: '세종대왕에 대해 한 줄로 알려 주십시오', slot: 1, quality: 'good' },
                    { label: '아무 말이나 해봐', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '역사 선생님 역할 접수! 세종대왕은 한글을 만드신 훌륭한 조선의 왕이랍니다.',
                    weak: '역할이 명확하지 않아 보통 로봇처럼 딱딱하게 답변해 드립니다.'
                  }
                }
              ]
            },
            {
              title: '3장: 역할 요약',
              goal: '결과 카드를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l5',
                  title: '역할 지정 작전판',
                  rows: [
                    { label: '선택한 AI 직업', from: 'role_choice' },
                    { label: '역할 지정 결과', from: 'role_build' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '역할 지정자 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm2-l6',
    moduleId: 'm2',
    number: 6,
    kind: 'concept',
    title: '단계를 나눠 물어보기',
    objective: '큰 질문을 작은 단계로 쪼개서 하나씩 물어봅니다.',
    standards: [
      '[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.',
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
    ],
    wrapUpEasy: '큰 질문은 작게 나눠서 하나씩 물어봅니다.',
    wrapUpNormal: '큰 질문을 작은 단계로 나눠 하나씩 물으면 답이 훨씬 분명해집니다.',
    bodyEasy: '큰 질문은 작게 나눠 물어봅니다. 한 걸음씩 물으면 답이 잘 나옵니다.',
    bodyNormal:
      '한 번에 다 물어보면 답이 흐릿할 수 있습니다. 큰 질문을 작은 단계로 나눠 하나씩 물어봅니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['단계', '단계 나누기', '흐름'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '큰 질문: "여행 계획 다 짜줘"', right: '너무 넓습니다' },
            { left: '작게: "제주도 놀 만한 곳 3개"', right: 'AI가 딱 답합니다' },
            { left: '작게: "그 중 하나 자세히 알려 주십시오"', right: '이어서 답합니다' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '한 걸음씩 물어보는 예는 어느 것입니까?',
          choices: [
            { label: '"먼저 재료 알려 주십시오 → 그 다음 순서 알려 주십시오"', isCorrect: true },
            { label: '"모든 걸 다 한 번에 알려 주십시오"', isCorrect: false },
            { label: '"음.."', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '큰 질문을 작게 나누면 답이 더 분명하겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 한 걸음씩이 더 정확합니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '차근차근 단계 나누기',
          chapters: [
            {
              title: '1장: 질문 쪼개기 분류',
              goal: '한 번에 묻는 질문과 나눈 질문을 구별하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'step_sort',
                  prompt: '한 번에 모두 묻는 복잡한 질문과, 단계를 나누어 묻는 똑똑한 질문을 구분하여 넣으십시오.',
                  bins: [
                    { label: '나눠 묻기', emoji: '📶' },
                    { label: '뭉쳐 묻기', emoji: '📦' }
                  ],
                  cards: [
                    { label: '1단계:재료를 물어본 뒤, 2단계:순서를 물어본다', emoji: '🧑‍🍳', bin: 0 },
                    { label: '라면 끓이는 법과 맛있게 먹는 법과 가격까지 다 말해 주십시오', emoji: '🍜', bin: 1 },
                    { label: '1단계:단어 뜻을 묻고, 2단계:예문을 물어본다', emoji: '📖', bin: 0 },
                    { label: '세상에 대한 모든 것을 한 줄로 다 요약해 주십시오', emoji: '🌍', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 단계별 대화',
              goal: '아이미와 단계를 나누어 차례차례 대화해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'step_chat',
                  intro: '한 단계씩 순차적으로 물어보십시오.',
                  turns: [
                    {
                      aimi: '안녕! 그림 그리기 공부를 도와줄게. 1단계로 무엇을 먼저 그릴까?',
                      choices: [
                        { label: '귀여운 아기 고양이 얼굴을 그릴래.', reply: '좋아! 그럼 아기 고양이 얼굴부터 차근차근 그려보자. 이제 2단계로 어떤 눈을 그릴까?', good: true },
                        { label: '고양이랑 강아지랑 집이랑 바다랑 다 그릴래.', reply: '우와, 너무 많아! 한 번에 다 그리기는 힘들단다. 우리 한 단계씩 나눠서 하나만 먼저 골라볼까?' }
                      ]
                    },
                    {
                      aimi: '고양이 눈을 동그랗고 귀엽게 그려보자! 그다음 고양이 수염은 어떻게 그릴까?',
                      choices: [
                        { label: '양볼에 세 줄씩 쓱쓱 그릴래.', reply: '멋져! 수염까지 다 그렸어. 멋진 아기 고양이 그림이 단계별로 예쁘게 완성됐어!', good: true }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 단계별 요약',
              goal: '결과 카드를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l6',
                  title: '단계 나누기 계획표',
                  rows: [
                    { label: '분류한 질문 방식', from: 'step_sort' },
                    { label: '단계 대화 완성', from: 'step_chat' }
                  ]
                }
              ]
            },
            {
              title: '4장: 예고: 첫 생각 저장',
              goal: 'AI 답이 마음과 다를 때 처음 생각한 방법을 기록해 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m2.preview]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '단계 정복자 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm2-l7',
    moduleId: 'm2',
    number: 7,
    kind: 'concept',
    title: '다시 물어봐도 됩니다',
    objective: 'AI의 답을 확인하고 부족한 부분을 다시 부탁해 보십시오.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    wrapUpEasy: '답이 마음에 안 들면 다시 부탁해도 됩니다.',
    wrapUpNormal: '"다르게 해 주십시오", "더 쉽게 해 주십시오"처럼 다시 부탁하면 AI가 고쳐서 답해 주십시오.',
    bodyEasy: '답이 마음에 안 들면 다시 물어봐도 됩니다.',
    bodyNormal:
      'AI 답이 원하는 게 아니면 "다르게 해 주십시오", "좀 더 짧게 해 주십시오" 하고 다시 부탁해도 괜찮습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['부탁', '반복 개선'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '"이 답을 좀 더 짧게 해 주십시오" 라고 부탁해 보십시오.',
          userInput: '좀 더 짧게 해 주십시오',
          aiResponse: '알겠습니다! 한 줄로 줄여볼겠습니다.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '한 번 물으면 다시 물어보면 안 될겠습니까?',
              answer: 'X',
              feedback: '여러 번 물어봐도 됩니다! 다시 부탁해도 괜찮습니다.',
            },
            {
              question: '"조금 다른 답을 줘" 라고 부탁할 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! 마음에 안 들면 다시 부탁해 보십시오.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '답이 어려우면 뭐라고 부탁하면 좋겠습니까?',
          choices: [
            { label: '"더 쉽게 설명해 주십시오"', isCorrect: true },
            { label: '가만히 있습니다', isCorrect: false },
            { label: '"화나!"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '마음에 안 들면 다시!',
          chapters: [
            {
              title: '1장: 피드백 대화',
              goal: 'AI의 답변이 어려울 때 다시 고쳐 말해달라고 요청하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'retry_chat',
                  intro: '답변을 수정하는 추가 요청 대화를 진행하십시오.',
                  turns: [
                    {
                      aimi: '우주의 블랙홀은 중력이 매우 강해서 모든 물질 and 빛조차 빠져나갈 수 없는 시공간의 영역입니다.',
                      choices: [
                        { label: '너무 어려워! 초등학생도 알기 쉽게 다시 설명해 주십시오.', reply: '어려웠습니다! 블랙홀은 우주에 있는 아주 강력한 우주 청소기라고 생각하면 됩니다. 근처에 오면 뭐든 쏙 빨아들입니다!', good: true },
                        { label: '우와 신기하네. 블랙홀을 더 길고 어렵게 설명해 주십시오.', reply: '중력 붕괴와 일반 상대성 이론에 따르면... 앗, 이러면 더 복잡해지겠습니까?' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '2장: 고침 프롬프트 조립',
              goal: '더 쉬운 표현을 요구하는 조각을 조립해 보십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'retry_build',
                  prompt: '다시 고쳐달라고 요청하는 프롬프트를 완성해 보십시오.',
                  slots: [
                    { label: '어떤 말투로' },
                    { label: '원하는 부탁' }
                  ],
                  pieces: [
                    { label: '더 쉬운 말투로', slot: 0, quality: 'good' },
                    { label: '어려운 단어 듬뿍 써서', slot: 0, quality: 'weak' },
                    { label: '다시 알려 주십시오', slot: 1, quality: 'good' },
                    { label: '대충 설명해봐', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '알겠습니다! 더욱 쉬운 예시와 단어로 다시 설명해 드리겠습니다.',
                    weak: '부탁이 불분명하면 답을 고치기가 어렵습니다.'
                  }
                }
              ]
            },
            {
              title: '3장: 요약 및 다짐',
              goal: '다짐 문장을 확인하고 완성하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l7',
                  title: '다시 묻기 카드',
                  rows: [
                    { label: '대화 요청 선택', from: 'retry_chat' },
                    { label: '조립한 수정 프롬프트', from: 'retry_build' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m2_l7',
                  template: '나 {이름}는 AI가 준 답이 마음에 안 들면 주저하지 않고 {빈칸} 요청하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '끈기 요리사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm2-l8',
    moduleId: 'm2',
    number: 8,
    kind: 'concept',
    title: '답을 짧게 해달라고 부탁',
    objective: '"세 줄로", "표로"처럼 형식을 정해 부탁해 보십시오.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '"세 줄로 알려 주십시오" 하면 짧게 답해 주십시오.',
    wrapUpNormal: '"한 문장으로", "세 줄로"처럼 답의 길이를 정해서 부탁할 수 있습니다.',
    bodyEasy: '"세 줄로 알려 주십시오" 하면 짧게 답해 주십시오.',
    bodyNormal:
      '답이 길면 "짧게 세 줄로", "한 문장으로" 처럼 길이를 정해서 부탁해 보십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['형식', '형식 지정'] } },
      {
        kind: 'card-pick',
        data: {
          question: '짧게 부탁하는 말은 어느 것입니까?',
          choices: [
            { label: '"세 줄로 알려 주십시오"', isCorrect: true },
            { label: '"아주 길게 다 알려 주십시오"', isCorrect: false },
            { label: '"음"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 "고양이 특징을 세 줄로 알려 주십시오" 라고 부탁해 보십시오.',
          userInput: '고양이 특징을 세 줄로 알려 주십시오',
          fallbackResponse:
            '고양이는 소리 없이 잘 걸습니다. 어둠 속에서도 눈이 잘 보입니다. 혼자 있는 걸 좋아합니다.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"짧게" 라고 부탁하면 AI가 답을 줄여줄겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 길이도 부탁할 수 있습니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '원하는 길이만큼만',
          chapters: [
            {
              title: '1장: 알맞은 조건 고르기',
              goal: '원하는 길이를 요구하는 가장 알맞은 표현을 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'length_choice',
                  prompt: 'AI에게 답을 간략히 받고 싶을 때 프롬프트 끝에 덧붙이기 좋은 말은 무엇입니까?',
                  items: [
                    { emoji: '📏', label: '한 문장으로 짧게 요약해 주십시오' },
                    { emoji: '📚', label: '세상의 모든 세세한 정보까지 다 적어줘' },
                    { emoji: '❌', label: '아무렇게나 대답해 주십시오' }
                  ]
                }
              ]
            },
            {
              title: '2장: 길이 제약 조립',
              goal: '길이 제한 조건 조각을 조립해 보십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'length_build',
                  prompt: '답변 길이를 구체적으로 정해 질문을 조립해 보십시오.',
                  slots: [
                    { label: '원하는 주제' },
                    { label: '길이 조건' }
                  ],
                  pieces: [
                    { label: '바다 동물 종류를', slot: 0, quality: 'good' },
                    { label: '아무 이야기나', slot: 0, quality: 'weak' },
                    { label: '딱 세 줄로만 알려 주십시오', slot: 1, quality: 'good' },
                    { label: '알아서 대충 해 주십시오', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '세 줄 답변: 1. 고래 2. 상어 3. 문어 입니다!',
                    weak: '길이 조건이 없으면 답이 지나치게 길어질 수 있습니다.'
                  }
                }
              ]
            },
            {
              title: '3장: 요약판',
              goal: '결과 요약을 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l8',
                  title: '답변 길이 조절판',
                  rows: [
                    { label: '선택한 요약 조건', from: 'length_choice' },
                    { label: '조립한 프롬프트 결과', from: 'length_build' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '길이 요술사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm2-l9',
    moduleId: 'm2',
    number: 9,
    kind: 'concept',
    title: '답이 이상하면?',
    objective: 'AI 답이 이상하면 "진짜야?" 하고 되물어 봅니다.',
    standards: ['[9정통01-01] 정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.'],
    wrapUpEasy: '답이 이상하면 다시 물어보고, 선생님께 확인합니다.',
    wrapUpNormal: 'AI도 틀릴 수 있습니다. 이상하면 "정말이야?" 하고 다시 묻거나 선생님께 확인합니다.',
    bodyEasy: '답이 이상하면 선생님께 물어보고, 다시 부탁합니다.',
    bodyNormal:
      'AI가 가끔 틀린 답을 줄 수 있습니다. 답이 이상하면 "정말이야?" 하고 다시 물어보거나 선생님께 확인해 보십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['확인', '검토', '지어낸 말'] } },
      {
        kind: 'card-pick',
        data: {
          question: 'AI 답이 이상할 때 뭘 하면 좋겠습니까?',
          choices: [
            { label: '"정말이야?" 하고 다시 물어봅니다', isCorrect: true },
            { label: '그냥 다 믿습니다', isCorrect: false },
            { label: '화면을 끕니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 가끔 틀린 답을 줄 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! 그래서 확인이 필요합니다.',
            },
            {
              question: '답이 이상해도 무조건 다 믿어야 하겠습니까?',
              answer: 'X',
              feedback: '이상하면 선생님께 물어봅니다.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '답이 이상함', right: '"정말이야?" 다시 물어봅니다' },
            { left: '답이 어려움', right: '"쉽게 알려 주십시오" 부탁합니다' },
            { left: '답이 너무 김', right: '"짧게 해 주십시오" 부탁합니다' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '이상한 답 탐정 카드',
          chapters: [
            {
              title: '1장: 진짜와 거짓 구별',
              goal: 'AI가 지어낸 거짓말과 진짜 사실을 분리해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'hallucination_sort',
                  prompt: '진짜 일어난 역사적 사실과, AI가 꾸며낸 그럴듯한 거짓말을 분류하여 바구니에 담으십시오.',
                  bins: [
                    { label: '진짜 사실', emoji: '📖' },
                    { label: '지어낸 거짓말', emoji: '❌' }
                  ],
                  cards: [
                    { label: '세종대왕이 한글을 창제하셨다', emoji: '👑', bin: 0 },
                    { label: '조선시대 세종대왕이 맥북을 사용하셨다', emoji: '💻', bin: 1 },
                    { label: '이순신 장군이 거북선을 만드셨다', emoji: '🐢', bin: 0 },
                    { label: '이순신 장군이 전투기를 타고 싸우셨다', emoji: '✈️', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 탐정의 확인 대화',
              goal: '이상한 답을 받았을 때 대처법을 실습해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'hallucination_chat',
                  intro: '정보를 그대로 믿지 않고 확인하는 의사소통을 해 보십시오.',
                  turns: [
                    {
                      aimi: '조선시대 세종대왕은 훈민정음을 맥북 프로로 작성하셨다는 기록이 있습니다.',
                      choices: [
                        { label: '세종대왕님 시절엔 컴퓨터가 없었어! 정말 사실이 맞아?', reply: '앗, 제 실수를 바로잡아 주셔서 감사합니다! 조선시대에는 맥북이 없었습니다. 제가 잘못된 정보를 드렸습니다.', good: true },
                        { label: '우와, 세종대왕님은 정말 기계를 잘 다루셨구나!', reply: '어라? 역사를 오해하고 계시입니다. 컴퓨터는 현대에 개발되었습니다. 그대로 믿으시면 안 됩니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 탐정 수첩 완성',
              goal: '다짐을 세우고 완료하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l9',
                  title: '탐정 팩트체크 카드',
                  rows: [
                    { label: '분류한 역사 정보', from: 'hallucination_sort' },
                    { label: '탐정 대화 결과', from: 'hallucination_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m2_l9',
                  template: '나 {이름}는 AI가 엉뚱하고 이상한 소리를 하면 무조건 믿지 않고 꼭 {빈칸} 확인하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '안전 탐정 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm2-l10',
    moduleId: 'm2',
    number: 10,
    kind: 'experience',
    title: '진짜 AI랑 놀아보기',
    objective: '배운 방법대로 프롬프트를 만들어 AI와 대화해 보십시오.',
    standards: [
      '[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
      '[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.',
    ],
    wrapUpEasy: '진짜 AI랑 이야기해봤습니다. 짧게, 콕 집어 물어봅니다.',
    wrapUpNormal: '오늘은 배운 대로 진짜 AI랑 이야기했습니다. 짧게, 콕 집어, 필요하면 다시 부탁합니다.',
    bodyEasy: '오늘은 진짜 AI랑 여러 번 이야기해 보십시오.',
    bodyNormal:
      '오늘은 배운 대로 진짜 AI랑 여러 번 이야기해 보십시오. 짧게, 콕 집어, 필요하면 다시 부탁해 보십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트', '역할 지정', '검증', '개인정보'] } },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 내가 좋아하는 색에 어울리는 이름을 지어달라고 해 보십시오. 좋아하는 색으로 글을 고쳐 보내거나, 🎤 를 눌러 말해 보십시오.',
          userInput: '내가 좋아하는 색이 파랑이야. 파랑 강아지 이름 하나 지어줘.',
          fallbackResponse:
            '"바다" 어떻습니까? 파란 바다처럼 시원하고 예쁜 이름입니다!',
          allowFreeInput: true,
          systemInstruction: '너의 이름은 "아이미"야. 너는 초등학생들의 친절한 AI 친구야. 학생이 말한 색상에 어울리는 귀엽고 예쁜 이름을 1~2개 짓고 이유를 짧게 설명해 주십시오. 꼭 마지막에 [happy] 또는 [wink] 태그를 붙여줘.',
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 짧은 수수께끼를 하나 내달라고 해 보십시오.',
          userInput: '아주 짧은 수수께끼 하나 내줘',
          fallbackResponse:
            '"눈이 오면 나타났다가 봄이면 사라지는 건? 정답은 눈사람!"',
          systemInstruction: '너의 이름은 "아이미"야. 너는 초등학생들을 위한 AI 친구야. 초등학생 수준에 맞는 아주 쉽고 재미있는 수수께끼 1개와 정답을 100자 이내로 말해 주십시오. 마지막에 [curious] 또는 [happy] 태그를 붙여줘.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '진짜 AI랑 이야기할 때 가장 좋은 태도는습니까?',
          choices: [
            { label: '짧고 콕 집어 물어봅니다', isCorrect: true },
            { label: '아무 말이나 마구 칩니다', isCorrect: false },
            { label: '화를 내습니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '프롬프트 요리 실전!',
          chapters: [
            {
              title: '1장: 질문 프롬프트 조립',
              goal: '원하는 질문 조각을 직접 조립하십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'real_m2_build',
                  prompt: 'AI에게 할 재미있는 질문과 형식을 지정하여 조립하십시오.',
                  slots: [
                    { label: '질문할 주제' },
                    { label: '원하는 형식' }
                  ],
                  pieces: [
                    { label: '공룡에 관한 신기한 이야기를', slot: 0, quality: 'good' },
                    { label: '아무 정보나 대충', slot: 0, quality: 'weak' },
                    { label: '아주 쉽게 두 줄로 말해 주십시오', slot: 1, quality: 'good' },
                    { label: '어렵게 길게 말해봐', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '공룡 정보: 옛날 지구에는 거대한 티라노사우루스가 살았고, 이들은 조류(새)의 조상이 되었습니다!',
                    weak: '질문이 애매하면 대답을 간결하게 해드리기 어렵습니다.'
                  }
                }
              ]
            },
            {
              title: '2장: 실전 대화 나누기',
              goal: '아이미와 실전 프롬프트로 대화를 나눠 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'real_m2_chat',
                  intro: '내가 만든 프롬프트로 대화를 시작해 보십시오.',
                  turns: [
                    {
                      aimi: '우와! 프롬프트 레시피대로 잘 만들어진 질문이입니다. 공룡에 대해 또 어떤 점이 알고 싶으신습니까?',
                      choices: [
                        { label: '가장 덩치가 큰 공룡은 누구인지 알려 주십시오.', reply: '가장 몸집이 컸던 공룡 중 하나는 "티타노사우루스류"입니다! 몸무게가 버스 여러 대를 합친 것만큼 무거웠습니다.', good: true },
                        { label: '아무거나 다른 이야기 아무 이야기나 또 해 주십시오.', reply: '어떤 다른 동화나 공룡, 혹은 다른 것이 궁금하신습니까? 콕 집어주시면 재미있게 알려드리겠습니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 신기한 발견 기록',
              goal: '오늘 발견한 멋진 이야기를 그리고 기록하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l10',
                  title: '실전 프롬프트 기록장',
                  rows: [
                    { label: '내가 빌드한 프롬프트', from: 'real_m2_build' },
                    { label: '실전 대화 결과', from: 'real_m2_chat' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m2_l10',
                  prompt: 'AI가 들려준 공룡이나 상상 속의 재미있는 장면을 그려 보십시오.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '프롬프트 전문가 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm2-l11',
    moduleId: 'm2',
    number: 11,
    kind: 'activity',
    title: '다 배웠습니다! (마무리 퀴즈)',
    objective: '단원 2에서 배운 좋은 질문 방법들을 다시 알아봅니다.',
    standards: ['[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.'],
    wrapUpEasy: '단원 2를 다 배웠습니다! 물어보는 방법을 알게 됐습니다.',
    wrapUpNormal: '단원 2를 마쳤습니다! 짧게, 콕 집어, 예시 주기, 역할 정하기 — 네 가지 방법을 배웠습니다.',
    bodyEasy: '지금까지 배운 프롬프트 잘 쓰는 법을 확인해 보십시오.',
    bodyNormal:
      '단원 2에서 배운 것들 — 짧게, 콕 집어, 예시 주기, 역할 정하기 — 을 짧은 퀴즈로 확인해 보십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트', '역할 지정', '반복 개선'] } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '프롬프트는 AI한테 던지는 질문이나 부탁입니까?',
              answer: 'O',
              feedback: '맞습니다! 잘 만든 프롬프트가 좋은 답을 데려옵니다.',
            },
            {
              question: '짧고 콕 집어 물어보는 게 좋겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 명확한 게 최고입니다.',
            },
            {
              question: 'AI 답이 이상하면 무조건 다 믿어야 하겠습니까?',
              answer: 'X',
              feedback: '이상하면 다시 물어보거나 선생님께 확인합니다.',
            },
            {
              question: '"동화 작가처럼 말해 주십시오" 같은 역할 정하기가 가능합니다?',
              answer: 'O',
              feedback: '맞습니다! 역할에 따라 말투가 달라져습니다.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '가장 잘 만든 프롬프트는 어느 것입니까?',
          choices: [
            { label: '"강아지 이름 세 개를 짧게 알려 주십시오"', isCorrect: true },
            { label: '"음 뭐 좀"', isCorrect: false },
            { label: '"뭐든지 아무거나 다 알려 주십시오 지금 바로 다"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '짧게 물어보기', right: '한 문장으로 콕 집어' },
            { left: '예시 보여주기', right: '"이런 식으로 해 주십시오"' },
            { left: '역할 정하기', right: '"친구처럼 말해 주십시오"' },
            { left: '다시 부탁하기', right: '"좀 더 짧게 해 주십시오"' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '프롬프트 요리사 졸업식',
          chapters: [
            {
              title: '1장: 비법 열쇠 짝짓기',
              goal: '배운 프롬프트 비법들을 알맞게 매칭하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'graduation_sort',
                  prompt: '네 가지 프롬프트 비법 카드를 알맞은 상자에 담아 보관하십시오.',
                  bins: [
                    { label: '좋은 질문법', emoji: '🧑‍🍳' },
                    { label: '피해야 할 질문법', emoji: '❌' }
                  ],
                  cards: [
                    { label: '한 문장으로 콕 집어 질문하기', emoji: '📍', bin: 0 },
                    { label: '예시를 들어 "이런 식으로 해 주십시오" 말하기', emoji: '💡', bin: 0 },
                    { label: '길고 꼬아서 애매하게 질문 던지기', emoji: '🌀', bin: 1 },
                    { label: '마음에 안 들면 "더 쉽게 다시 해 주십시오" 부탁하기', emoji: '🔄', bin: 0 },
                    { label: '의미 없는 물음표(?)만 무한 반복해서 치기', emoji: '❓', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 최종 졸업 의식',
              goal: '아이미와 마지막 인사를 나누십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'graduation_chat',
                  intro: '요리사 졸업 축하 대화가 진행됩니다.',
                  turns: [
                    {
                      aimi: '와! 대단합니다! 4가지 맛있는 프롬프트 비법을 모두 완수했입니다. 이제 스스로 훌륭한 프롬프트 요리사가 되었다고 생각하습니까?',
                      choices: [
                        { label: '네! 이제 AI와 똑똑하게 대화할 수 있습니다.', reply: '축하합니다! 당신은 훌륭한 프롬프트 요리사입니다. 언제든 맛있는 질문을 만들어 보십시오!', good: true },
                        { label: '아직은 조금 헷갈리지만 열심히 연습하겠습니다!', reply: '멋진 태도입니다! 계속 대화하다 보면 질문 요리 실력이 쑥쑥 늘어날 거랍니다. 응원하겠습니다!', good: true }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 본 활동: 생각 리플레이',
              goal: '첫 생각과 달라진 조건을 비교하고, 다시 부탁하는 방법을 만들어 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m2.main]
            },
            {
              title: '4장: 수료 선언',
              goal: '나의 요리사 졸업장을 받으십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m2_l11',
                  title: '프롬프트 요리사 졸업 계획서',
                  rows: [
                    { label: '내가 마스터한 질문법', from: 'graduation_sort' },
                    { label: '졸업 소감', from: 'graduation_chat' },
                    { label: '판단 비교와 새 장면 기록', from: 'judgment_main_m2_l11' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m2_l11',
                  template: '나 {이름}는 배운 네 가지 프롬프트 비법을 사용해 AI와 {빈칸} 소통할 것을 선언합니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'certificate',
            badgeLabel: '프롬프트 마스터 요리사 수료증 획득!'
          }
        }
      }
    ],
  },
];
