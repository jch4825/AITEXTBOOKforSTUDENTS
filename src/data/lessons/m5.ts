import type { LessonContent } from '../../types';
import { GENERALIZATION_CYCLES } from '../generalizationCycles';

/**
 * 단원 5 — AI로 문제해결하기
 *
 * 12차시. 문제를 알아차리고, 작게 나누고, 순서를 세우고, AI의 도움을 받아
 * 한 단계씩 해결하는 사고력 훈련. Sequence 위젯을 적극 사용.
 * real-ai 1회 (l6).
 */
export const M5_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm5-l1',
    moduleId: 'm5',
    number: 1,
    kind: 'concept',
    title: '문제가 뭐입니까?',
    objective: '지금 상황과 내가 바라는 것이 다를 때 이것이 문제임을 압니다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '문제는 "해결하고 싶은 일"입니다. 배고픈 것도 문제입니다!',
    bodyNormal:
      '문제란 해결하고 싶은 일입니다. "배가 고파요", "길을 모릅니다" — 이런 게 다 문제입니다. 문제를 알아차리는 게 첫걸음입니다.',
    wrapUpEasy: '문제는 해결하고 싶은 일입니다. 먼저 알아차렸습니다.',
    wrapUpNormal: '문제는 해결하고 싶은 일입니다. "지금 뭐가 어렵지?" 하고 알아차리는 것이 해결의 첫걸음입니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['문제', '목표'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '"배가 고픈데 뭘 먹을지 모르겠습니다"도 문제입니까?',
              answer: 'O',
              feedback: '맞습니다! 해결하고 싶은 일은 다 문제입니다.',
            },
            {
              question: '문제는 나쁜 것이니까 모른 척해야 하겠습니까?',
              answer: 'X',
              feedback: '문제는 나쁜 게 아닙니다. 알아차리면 해결할 수 있습니다!',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '다음 중 "문제"는 어느 것입니까?',
          choices: [
            { label: '숙제를 어떻게 시작할지 모르겠습니다', isCorrect: true },
            { label: '밥을 맛있게 먹었습니다', isCorrect: false },
            { label: '친구랑 재미있게 놀았습니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '문제 탐정단',
          chapters: [
            {
              title: '1장: 진짜 문제 알아차리기',
              goal: '생활 속 불편한 상황에서 해결해야 할 문제를 짚어내십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'find_problem',
                  prompt: '내 방바닥에 장난감이 어질러져 있어서 밟아 아플 때, 해결해야 할 핵심 문제는 무엇입니까?',
                  items: [
                    { emoji: '🧸', label: '장난감을 장난감 상자에 정리해야 한다.' },
                    { emoji: '😢', label: '장난감을 밟고 계속 울기만 한다.' },
                    { emoji: '❌', label: '장난감을 다 쓰레기통에 내버린다.' }
                  ]
                }
              ]
            },
            {
              title: '2장: 문제 정의 대화',
              goal: '아이미와 함께 문제를 명확하게 한 줄로 정리하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'problem_chat',
                  intro: '문제 알아차리기 대화를 나눕니다.',
                  turns: [
                    {
                      aimi: '불편한 상황을 마주했습니까? 우리가 오늘 해결할 수 있는 문제가 무엇인지 말해 보겠습니까?',
                      choices: [
                        { label: '방바닥의 물건을 정리정돈하는 문제를 풀고 싶어.', reply: '네! 문제를 아주 잘 찾으셨습니다. 해결할 대상을 명확히 정하는 것이 문제 해결의 훌륭한 시작입니다!', good: true },
                        { label: '그냥 기분이 너무 안 좋아.', reply: '속상한 마음에 그럴 수 있습니다! 하지만 우리 기분을 바꾸기 위해 지금 당장 해결할 수 있는 작은 일(문제)을 같이 찾아 보겠습니까?' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 탐정 수첩 보고',
              goal: '오늘 기록한 문제를 최종 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l1',
                  title: '나의 문제 발견 수첩',
                  rows: [
                    { label: '내가 짚어낸 진짜 문제', from: 'find_problem' },
                    { label: '문제 정의 결과', from: 'problem_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '문제 탐정 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm5-l2',
    moduleId: 'm5',
    number: 2,
    kind: 'concept',
    title: '문제를 작게 나눠습니다',
    objective: '큰 일을 세 가지 작은 일들로 나누어 봅니다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '큰 문제는 작게 나누면 쉬워져습니다.',
    bodyNormal:
      '"방 청소"는 커 보여도, "책 정리 → 옷 정리 → 바닥 쓸기"로 나누면 하나씩 할 수 있습니다.',
    wrapUpEasy: '큰 문제는 작게 나눠습니다. 그러면 쉬워져습니다.',
    wrapUpNormal: '큰 문제는 작은 조각으로 나눠습니다. 작은 것부터 하나씩 하면 큰 문제도 해결할 수 있습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['나누기'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '"방 청소"를 작게 나누면 어떻게 될겠습니까?',
          choices: [
            { label: '책 정리, 옷 정리, 바닥 쓸기', isCorrect: true },
            { label: '한 번에 다 하기', isCorrect: false },
            { label: '안 하고 자기', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '방 청소를 작게 나눴습니다. 순서대로 눌러봅니다.',
          items: [
            { label: '책을 책꽂이에 꽂습니다' },
            { label: '옷을 옷장에 넣습니다' },
            { label: '바닥을 쓸습니다' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '생각 조각 쪼개기 작전',
          chapters: [
            {
              title: '1장: 준비 조각 분류',
              goal: '등교 준비라는 큰 미션을 달성할 작은 행동들을 분류해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'deconstruct_sort',
                  prompt: '등교 준비에 포함되는 작은 문제 조각들을 알맞은 바구니에 나누어 담아 보십시오.',
                  bins: [
                    { label: '등교 준비 조각', emoji: '🎒' },
                    { label: '다른 엉뚱한 행동', emoji: '❌' }
                  ],
                  cards: [
                    { label: '학교 책가방 싸기', emoji: '📚', bin: 0 },
                    { label: '이 닦고 얼굴 씻기', emoji: '🧼', bin: 0 },
                    { label: '컴퓨터 게임 밤새 하기', emoji: '🎮', bin: 1 },
                    { label: '옷장에서 외출복 꺼내 입기', emoji: '👕', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약 및 계획 그리기',
              goal: '내가 쪼개어 완성한 계획을 상상하여 그려 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l2',
                  title: '나의 쪼개기 분석 카드',
                  rows: [
                    { label: '내가 분류한 아침 조각', from: 'deconstruct_sort' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m5_l2',
                  prompt: '내가 아침에 등교하기 전 씩씩하게 준비하는 멋진 내 모습을 그려 보십시오.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '나누기 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm5-l3',
    moduleId: 'm5',
    number: 3,
    kind: 'activity',
    title: '순서대로 생각합니다',
    objective: '나눈 작은 일들을 먼저 할 것부터 순서대로 나열합니다.',
    standards: ['[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.'],
    bodyEasy: '일에는 순서가 있습니다. 순서대로 하면 잘 됩니다.',
    bodyNormal:
      '많은 일에는 순서가 있습니다. 세수를 하고 수건으로 닦지, 수건으로 닦고 세수하지 않습니까? 순서대로 생각하는 연습을 해 보십시오.',
    wrapUpEasy: '일은 순서대로 합니다. 순서를 생각하면 잘 됩니다.',
    wrapUpNormal: '일의 순서를 먼저 생각하면 실수가 줄어듭니다. "먼저 뭐, 그 다음 뭐" 하고 차례를 세워봅니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['순서', '절차'], imagePlaceholder: true } },
      {
        kind: 'sequence',
        data: {
          instruction: '아침에 학교 갈 준비! 순서대로 눌러봅니다.',
          items: [
            { label: '일어나서 세수합니다' },
            { label: '아침밥을 먹습니다' },
            { label: '가방을 챙겨습니다' },
            { label: '신발을 신고 나갑니다' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '신발을 신고 나서 양말을 신는 게 맞겠습니까?',
              answer: 'X',
              feedback: '양말 먼저, 신발은 나중! 순서가 중요합니다.',
            },
            {
              question: '순서를 생각하고 하면 실수가 줄어들겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 순서대로 하면 잘 됩니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '차례차례 타임라인',
          chapters: [
            {
              title: '1장: 양치질 순서 정렬',
              goal: '양치질의 자연스러운 순서를 조립하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'wash_teeth_sort',
                  prompt: '양치질 단계를 순서대로 바구니에 분배하십시오. (1단계부터 4단계까지)',
                  bins: [
                    { label: '1~2단계 (시작)', emoji: '🦷' },
                    { label: '3~4단계 (마무리)', emoji: '💦' }
                  ],
                  cards: [
                    { label: '칫솔에 치약 묻히기', emoji: '🪥', bin: 0 },
                    { label: '치아와 혓바닥 구석구석 닦기', emoji: '🦷', bin: 0 },
                    { label: '물로 입안 깨끗이 헹구기', emoji: '🥤', bin: 1 },
                    { label: '칫솔을 씻어서 보관하기', emoji: '🧼', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약 카드',
              goal: '차례대로 생각한 결과를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l3',
                  title: '나의 순차 양치 계획표',
                  rows: [
                    { label: '내가 분류한 순서', from: 'wash_teeth_sort' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '순서 마스터 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm5-l4',
    moduleId: 'm5',
    number: 4,
    kind: 'activity',
    title: '무엇부터 하겠습니까?',
    objective: '여러 일 중 더 중요한 일을 먼저 하기로 정합니다.',
    standards: ['[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.'],
    bodyEasy: '할 일이 많으면 중요한 것부터 합니다.',
    bodyNormal:
      '할 일이 여러 개면 "급하고 중요한 것"부터 합니다. 숙제가 내일까지라면 게임보다 숙제 먼저!',
    wrapUpEasy: '중요한 일부터 먼저 합니다.',
    wrapUpNormal: '할 일이 많을 때는 급하고 중요한 일부터 합니다. 순서를 정하면 마음도 편해져습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['급한 일 먼저'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '숙제는 내일까지입니다. 지금 무엇부터 하겠습니까?',
          choices: [
            { label: '숙제를 먼저 합니다', isCorrect: true },
            { label: '게임을 밤까지 합니다', isCorrect: false },
            { label: '아무것도 안 합니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '오늘 할 일입니다. 좋은 순서대로 눌러봅니다.',
          items: [
            { label: '내일까지인 숙제를 합니다' },
            { label: '내 방을 정리합니다' },
            { label: '남는 시간에 놀습니다' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '급한 일 먼저 하기 작전',
          chapters: [
            {
              title: '1장: 급한 일 사물함',
              goal: '당장 해야 할 급한 일과 나중에 해도 좋은 일을 분리하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'priority_sort',
                  prompt: '할 일 카드를 먼저 해야 할 급한 일과 나중에 해도 좋은 일로 나누어 담으십시오.',
                  bins: [
                    { label: '먼저 할 일 (급함)', emoji: '🚨' },
                    { label: '나중에 할 일 (여유)', emoji: '💤' }
                  ],
                  cards: [
                    { label: '오늘 밤 제출해야 하는 학교 숙제', emoji: '📝', bin: 0 },
                    { label: '친구들과 이따 저녁에 할 스마트폰 게임', emoji: '🎮', bin: 1 },
                    { label: '불이 났을 때 대피하기', emoji: '🔥', bin: 0 },
                    { label: '방에 굴러다니는 낙서 종이 치우기', emoji: '🧹', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약 보고',
              goal: '정리한 일의 순서를 한눈에 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l4',
                  title: '나의 급한 일 계획표',
                  rows: [
                    { label: '분류한 일감 목록', from: 'priority_sort' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '계획 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm5-l5',
    moduleId: 'm5',
    number: 5,
    kind: 'activity',
    title: 'AI에게 힌트를 달라고 합니다',
    objective: '정답 대신 살짝 도와주는 힌트만 달라고 부탁해 보십시오.',
    standards: ['[9정통02-02] 인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.'],
    bodyEasy: '어려우면 답 말고 "힌트"를 달라고 합니다.',
    bodyNormal:
      '문제가 어려울 때 바로 답을 묻지 말고 "힌트만 줘"라고 해 보십시오. 힌트로 스스로 풀면 진짜 실력이 됩니다.',
    wrapUpEasy: '어려우면 "힌트 줘" 하고 부탁합니다.',
    wrapUpNormal: '답을 바로 묻는 것보다 힌트를 받아 스스로 풀면 실력이 늘습니다. "힌트만 줘"라고 부탁해 보십시오.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['힌트'], imagePlaceholder: true } },
      {
        kind: 'real-ai',
        data: {
          prompt: '수수께끼가 어렵습니다. AI한테 힌트를 달라고 해 보십시오. 아래 문장 그대로 보내거나 🎤 를 눌러 말해 보십시오.',
          userInput: '답은 말하지 말고 힌트만 줘',
          fallbackResponse: '좋습니다, 힌트! 이 동물은 아주 천천히 걷고, 등에 딱딱한 집을 지고 다녀습니다. [thinking]',
          allowFreeInput: true,
          systemInstruction: '너는 초등학생들을 위한 친절한 힌트 도우미 AI "아이미"야. 학생이 거북이에 대한 힌트를 구하고 있어. 학생이 질문하면 절대 정답인 "거북이"라는 단어는 말하지 말고, "이 동물은 아주 천천히 걷고, 등에 딱딱하고 무거운 집을 평생 지고 다녀요"처럼 정답을 유추할 수 있는 재미있는 힌트만 100자 이하의 쉽고 다정한 한국어로 대답해 주십시오. 마지막에 [thinking] 또는 [wink] 태그를 꼭 붙여줘.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '힌트를 듣고 스스로 맞혀봅니다. 등에 집을 지고 다니는 동물은?',
          choices: [
            { label: '거북이', isCorrect: true },
            { label: '치타', isCorrect: false },
            { label: '독수리', isCorrect: false },
            { label: '토끼', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '지혜로운 힌트 구하기',
          chapters: [
            {
              title: '1장: 힌트 프롬프트 선택',
              goal: '단순 답 복사 대신 내 생각 능력을 도울 힌트 낱말 질문을 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'hint_query_type',
                  prompt: 'AI에게 수학 문제를 공부할 때 물어볼 가장 훌륭한 힌트 질문은 무엇입니까?',
                  items: [
                    { emoji: '💡', label: '"답은 말하지 말고, 어떻게 풀기 시작하는지 첫 단계 힌트만 줘."' },
                    { emoji: '❌', label: '"그냥 정답 알려 주십시오. 바로 공책에 베끼게."' }
                  ]
                }
              ]
            },
            {
              title: '2장: 힌트 우체통 대화',
              goal: '아이미와 함께 수수께끼의 힌트만 요청하는 훈련을 하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'hint_chat',
                  intro: '힌트 대화를 진행합니다.',
                  turns: [
                    {
                      aimi: '문제! 아침에는 네 발, 점심에는 두 발, 저녁에는 세 발로 걷는 것은 무엇입니까?',
                      choices: [
                        { label: '너무 어려워! 정답은 비밀로 하고, 힌트 글을 하나만 알려 주십시오.', reply: '좋습니다! 이 수수께끼의 답은 동물이나 물건이 아니라 우리 주변에서 아주 가까이 성장하는 "사람"과 관련이 있습니다. 한 번 더 생각해 보십시오!', good: true },
                        { label: '그냥 재미없으니까 바로 답 내놔.', reply: '어라? 답을 바로 알면 시시하잖습니다! 힌트를 줄 테니 스스로 풀면 훨씬 뿌듯할 것입니다.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 요약판',
              goal: '완성된 수첩을 최종 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l5',
                  title: '나의 힌트 요청 카드',
                  rows: [
                    { label: '내가 선택한 질문법', from: 'hint_query_type' },
                    { label: '힌트 대화 결과', from: 'hint_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '지혜 주머니 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm5-l6',
    moduleId: 'm5',
    number: 6,
    kind: 'experience',
    title: '못 알아들으면 다시 물어봅니다',
    objective: 'AI가 내 말을 오해하면 더 구체적인 이름으로 다시 말합니다.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    bodyEasy: 'AI가 못 알아들으면 다르게 다시 물어봅니다.',
    bodyNormal:
      'AI가 엉뚱한 답을 하면 내 질문이 어려웠을 수 있습니다. 짧게, 다른 말로 바꿔서 다시 물어봅니다.',
    wrapUpEasy: '못 알아들으면 다른 말로 다시 물어봅니다.',
    wrapUpNormal: 'AI가 엉뚱한 답을 하면 포기하지 말고 짧고 쉬운 말로 바꿔 다시 물어봅니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['정확히 말하기'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '질문을 바꿔서 다시 물어보는 모습을 봅니다.',
          userInput: '(처음) 그거 있잖아 그거 뭐지 → (다시) 목이 긴 동물 이름이 뭐야?',
          aiResponse: '아, 목이 긴 동물입니까? 기린입니다! 질문을 바꿔주니 바로 알았습니다.',
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 물어봅니다. 답이 이상하면 말을 바꿔서 한 번 더 보내봅니다!',
          userInput: '다리가 여덟 개인 바다 동물이 뭐야?',
          fallbackResponse: '다리가 여덟 개인 바다 동물은 문어입니다! 문어는 다리로 맛도 볼 수 있대습니다.',
          allowFreeInput: true,
        },
      },
      {
        kind: 'mission',
        data: {
          title: '다시 말하기 챌린지',
          chapters: [
            {
              title: '1장: 명확한 대체 프롬프트 조립',
              goal: 'AI가 이해하기 어려운 모호한 질문을 훌륭한 문장으로 조립해 보십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'reask_build',
                  prompt: 'AI가 찰떡같이 알아들을 수 있도록 단어 조각을 조립하여 다시 묻는 질문을 만드십시오.',
                  slots: [
                    { label: '구체적 질문 대상' },
                    { label: '부탁하는 꼬리표' }
                  ],
                  pieces: [
                    { label: '목이 아주 긴 육지 동물 이름을', slot: 0, quality: 'good' },
                    { label: '아무 동물이나 대충 아무거나', slot: 0, quality: 'weak' },
                    { label: '하나만 알려 주십시오', slot: 1, quality: 'good' },
                    { label: '많이 써 주십시오', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '네! 목이 가장 긴 육지 동물은 "기린"입니다!',
                    weak: '음... 동물 종류가 너무 많아서 어떤 것을 원하는지 잘 모르겠습니다.'
                  }
                }
              ]
            },
            {
              title: '2장: 바꾸어 질문하기 대화',
              goal: '잘못된 인식 상황을 대화 속에서 바꾸어 해결하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'reask_chat',
                  intro: '오인식 상황에 대처하여 다른 말로 바꾸어 전송합니다.',
                  turns: [
                    {
                      aimi: '어라? "그거 파란 거"라고만 말씀하시면 제가 어떤 컴퓨터 부품이나 물건을 원하는지 도통 알 수 없습니다.',
                      choices: [
                        { label: '질문을 바꿀게! "하늘을 나는 탈것 중에서 제일 빠른 비행기" 알려 주십시오.', reply: '아! 질문을 바꾸어 주셔서 바로 이해했습니다. 제일 빠른 비행기는 음속보다 훨씬 빠르게 날아가는 초음속 전투기나 제트기입니다!', good: true },
                        { label: '파란 거 있잖아 파란 거! 왜 몰라!', reply: '죄송합니다! 파란 물건은 세상에 너무 많아서 제가 콕 집어 설명해 드리기 어렵습니다. 더 구체적인 이름을 말해 주십시오.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 결과 보고',
              goal: '계획 카드를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l6',
                  title: '나의 유의어 대체 카드',
                  rows: [
                    { label: '내가 빌드한 재질문', from: 'reask_build' },
                    { label: '질문 교정 대화 결과', from: 'reask_chat' }
                  ]
                }
              ]
            },
            {
              title: '4장: 예고: 첫 생각 저장',
              goal: '버스가 늦은 장면에서 처음 생각한 방법을 기록해 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m5.preview]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '설명 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm5-l7',
    moduleId: 'm5',
    number: 7,
    kind: 'activity',
    title: '한 단계씩 부탁합니다',
    objective: 'AI에게 한 번에 하나씩 순서대로 실행해 달라고 부탁해 보십시오.',
    standards: ['[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.'],
    bodyEasy: '한 번에 하나씩 부탁하면 잘 됩니다.',
    bodyNormal:
      '복잡한 일은 AI한테도 한 단계씩 부탁합니다. "먼저 재료 알려 주십시오" → "이제 순서 알려 주십시오" 이렇겠습니다.',
    wrapUpEasy: 'AI한테도 한 번에 하나씩 부탁합니다.',
    wrapUpNormal: '복잡한 부탁은 한 단계씩 나눠서 합니다. 하나가 끝나면 다음 것을 부탁하면 됩니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['단계', '단계별 지시'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '샌드위치 만들기를 한 단계씩 부탁해 보십시오.',
          userInput: '샌드위치 재료부터 알려 주십시오',
          aiResponse: '좋습니다! 재료는 식빵 2장, 치즈, 햄, 상추입니다. 다 준비되면 "이제 순서 알려 주십시오" 하고 말해주십시오.',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: 'AI한테 한 단계씩 부탁하는 순서입니다. 차례대로 눌러봅니다.',
          items: [
            { label: '"재료부터 알려 주십시오"' },
            { label: '"이제 만드는 순서 알려 주십시오"' },
            { label: '"마지막으로 조심할 것 알려 주십시오"' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '한 번에 하나씩만',
          chapters: [
            {
              title: '1장: 단계별 질문 구별함',
              goal: '한 번에 다 묻는 과부하 질문과, 단계를 쪼갠 지혜로운 질문을 구분하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'one_by_one_sort',
                  prompt: '차례대로 하나씩 나누어 묻는 스마트한 방법과, 뭉뚱그려 묻는 질문을 바구니에 분류하십시오.',
                  bins: [
                    { label: '차례대로 쪼개기', emoji: '📶' },
                    { label: '한번에 몰아치기', emoji: '📦' }
                  ],
                  cards: [
                    { label: '먼저 카레 재료를 묻고, 다 준비되면 끓이는 순서를 묻는다', emoji: '🍛', bin: 0 },
                    { label: '카레 재료와 역사와 야채 터는 법과 가격까지 다 지금 한꺼번에 말해 주십시오', emoji: '📦', bin: 1 },
                    { label: '1단계로 학교 가는 버스 번호를 묻고, 2단계로 타는 법을 묻는다', emoji: '🚌', bin: 0 },
                    { label: '버스 타는 법과 버스 회장님 이름과 고장 났을 때 대처법 전부 다 바로 써 주십시오', emoji: '🌀', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 단계적 요리 레시피 대화',
              goal: '김밥 만들기를 AI와 1단계부터 차근차근 대화해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'one_by_one_chat',
                  intro: '한 번에 하나씩 질문하는 롤플레이를 합니다.',
                  turns: [
                    {
                      aimi: '맛있는 김밥 요리를 도와드리겠습니다! 1단계로 어떤 재료가 필요한지 알려드리겠습니까?',
                      choices: [
                        { label: '응! 필수 재료 4가지만 먼저 리스트로 뽑아줘.', reply: '좋습니다! 김밥용 김, 밥, 단무지, 햄이 필수 재료입니다! 다 준비하셨다면 다음 2단계로 넘어갈겠습니까?', good: true },
                        { label: '재료랑 써는 법이랑 맛있게 마는 팁이랑 다 바로 한꺼번에 적어줘.', reply: '우와! 한 번에 다 말씀드리면 보기도 어렵고 헷갈리기 쉽습니다. 우리 1단계 재료부터 차례차례 알아보기로 합니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 요약판',
              goal: '단계 질문 요약 계획을 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l7',
                  title: '나의 순차 대화 카드',
                  rows: [
                    { label: '내가 분류한 질문 기법', from: 'one_by_one_sort' },
                    { label: '김밥 단계 대화 결과', from: 'one_by_one_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '순차 지시관 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm5-l8',
    moduleId: 'm5',
    number: 8,
    kind: 'concept',
    title: '답이 맞는지 확인합니다',
    objective: '내가 얻은 결과가 처음에 원했던 목표와 같은지 확인해 보십시오.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '다 하고 나면 맞는지 한 번 더 봅니다.',
    bodyNormal:
      '문제를 풀고 나면 "정말 맞나?" 하고 한 번 더 확인합니다. AI의 답도, 내 답도 확인하면 더 좋아져습니다.',
    wrapUpEasy: '다 한 다음에는 맞는지 확인합니다.',
    wrapUpNormal: '풀고 나서 확인하는 습관이 실수를 줄입니다. 내 답도, AI의 답도 한 번 더 확인합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['확인', '평가', '검증'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '문제를 다 풀면 확인 없이 바로 내는 게 좋겠습니까?',
              answer: 'X',
              feedback: '한 번 더 확인하면 실수를 찾을 수 있습니다.',
            },
            {
              question: 'AI가 알려준 답도 확인하면 더 좋겠습니까?',
              answer: 'O',
              feedback: '맞습니다! AI도 틀릴 수 있으니까습니다.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 내 답을 확인해달라고 해 보십시오.',
          userInput: '3 더하기 4는 7이 맞아?',
          aiResponse: '네, 맞습니다! 3 더하기 4는 7입니다. 확인하는 습관, 아주 훌륭합니다!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '확인을 잘하는 방법은 어느 것입니까?',
          choices: [
            { label: '처음부터 천천히 다시 봅니다', isCorrect: true },
            { label: '눈을 감고 넘겨습니다', isCorrect: false },
            { label: '빨리 끝내고 놀습니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '스스로 최종 검토관',
          chapters: [
            {
              title: '1장: 검토 검증 수단 선택',
              goal: '답을 다 적은 후에 확인하는 최상의 수단을 고르십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'review_check_type',
                  prompt: 'AI가 써 준 숙제나 받아쓰기 문제의 글씨가 틀리지 않았는지 검토할 때 할 가장 좋은 행동은 무엇입니까?',
                  items: [
                    { emoji: '🔎', label: '첫 줄부터 손가락으로 짚어가며 꼼꼼히 소리 내어 다시 읽어본다.' },
                    { emoji: '❌', label: '확인하지 않고 맞겠거니 하며 바로 덮어 둔다.' }
                  ]
                }
              ]
            },
            {
              title: '2장: 검토관의 수정 요청 대화',
              goal: 'AI의 잘못된 수학 답에 팩트체크 피드백을 전달해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'review_check_chat',
                  intro: '답변을 검증하여 수정해 주는 롤플레이 대화입니다.',
                  turns: [
                    {
                      aimi: '계산 완료! "5 더하기 3은 9" 입니다! 다른 수학 문제도 도와드리겠습니까?',
                      choices: [
                        { label: '내가 손가락으로 세어 보니까 8이 맞아! 답을 다시 확인해봐.', reply: '어라! 정말 죄송합니다. 제가 덧셈 실수를 했입니다. 5 더하기 3은 8이 맞습니다! 꼼꼼하게 검토해 주셔서 정말 대단합니다.', good: true },
                        { label: '우와, 9가 맞구나. 역시 컴퓨터는 천재야!', reply: '앗, 그대로 믿으시면 오답 숙제를 내게 됩니다! AI도 계산 실수를 자주 하니 꼭 한 번 더 직접 더해 보십시오.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 검토 완료 보고',
              goal: '나의 검토 계획 카드를 확인하고 다짐하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l8',
                  title: '나의 스스로 검토 카드',
                  rows: [
                    { label: '내가 선택한 검토 수단', from: 'review_check_type' },
                    { label: '계산 검증 대화 결과', from: 'review_check_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m5_l8',
                  template: '나 {이름}는 문제를 다 푼 뒤에는 귀찮아도 꼭 {빈칸} 다시 검토하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '팩트 검토관 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm5-l9',
    moduleId: 'm5',
    number: 9,
    kind: 'concept',
    title: '다른 방법도 있습니다',
    objective: '이 방법 말고 다른 방법도 있는지 AI에게 물어봅니다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '한 방법이 안 되면 다른 방법을 찾아봅니다.',
    bodyNormal:
      '문을 밀어서 안 열리면? 당겨보면 됩니다! 한 가지 방법이 안 될 때 다른 방법을 생각하는 게 문제 해결의 힘입니다.',
    wrapUpEasy: '안 되면 다른 방법을 생각해 보십시오.',
    wrapUpNormal: '방법은 하나가 아닙니다. 안 되면 "다른 방법은 없을까?" 하고 생각해보는 힘을 기릅니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['다른 방법'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '문을 밀었는데 안 열립니다. 어떻게 하겠습니까?',
          choices: [
            { label: '당겨봅니다', isCorrect: true },
            { label: '더 세게 미십시오', isCorrect: false },
            { label: '포기하고 돌아갑니다', isCorrect: false },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '풀로 안 붙습니다', right: '테이프로 붙여봅니다' },
            { left: '지우개가 없습니다', right: '친구에게 빌려봅니다' },
            { left: 'AI가 못 알아듣습니다', right: '다른 말로 물어봅니다' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '우회로 우체통: 플랜 B',
          chapters: [
            {
              title: '1장: 다른 방법 찾기 판정',
              goal: '한 가지 도구를 쓸 수 없을 때 다른 대안(대체재)을 선택해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'alternative_sort',
                  prompt: '원래 방법이 막혔을 때 차선으로 선택할 수 있는 다른 방법(플랜 B)을 알맞게 나누어 담으십시오.',
                  bins: [
                    { label: '다른 방법 (플랜 B)', emoji: '💡' },
                    { label: '포기하거나 나쁜 행동', emoji: '❌' }
                  ],
                  cards: [
                    { label: '가려던 버스 정류장이 공사 중이면 옆 정류장으로 걸어가기', emoji: '🚌', bin: 0 },
                    { label: '지우개가 없어서 내 공책을 찢어버리기', emoji: '📝', bin: 1 },
                    { label: 'AI 답변이 계속 안 나오면 새로고침하고 다시 묻기', emoji: '🔄', bin: 0 },
                    { label: '가게 문이 닫혀 있어서 울면서 주저앉기', emoji: '😭', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약 및 다짐',
              goal: '내가 고른 우회 계획을 최종 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l9',
                  title: '나의 플랜 B 우회 수첩',
                  rows: [
                    { label: '선택한 다른 방법들', from: 'alternative_sort' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m5_l9',
                  template: '나 {이름}는 계획대로 일이 풀리지 않아도 당황하지 않고 {빈칸} 방법을 생각하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '우회 해결사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm5-l10',
    moduleId: 'm5',
    number: 10,
    kind: 'concept',
    title: '실수해도 괜찮습니다',
    objective: '틀린 부분을 찾아서 고치고 다시 도전해 보십시오.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '실수해도 괜찮습니다. 다시 하면 됩니다.',
    bodyNormal:
      '실수는 배우는 과정입니다. 틀렸다고 끝이 아닙니다. "다시 해보자!" 하는 마음이 문제를 해결합니다.',
    wrapUpEasy: '실수해도 괜찮습니다. 다시 해보면 됩니다.',
    wrapUpNormal: '실수는 배우는 과정입니다. 틀려도 "다시 해보자!" 하고 일어나는 사람이 진짜 문제 해결사입니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['오류', '수정'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '한 번 실수하면 다시는 못 하겠습니까?',
              answer: 'X',
              feedback: '아닙니다! 다시 하면 더 잘할 수 있습니다.',
            },
            {
              question: '실수는 배우는 과정입니까?',
              answer: 'O',
              feedback: '맞습니다! 실수하면서 배우는 것입니다.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '실수해서 속상할 때 AI가 하는 말을 들어봅니다.',
          userInput: '아까 퀴즈에서 틀려서 속상해',
          aiResponse: '괜찮습니다! 틀린 건 배우고 있다는 뜻입니다. 다시 해보면 이번엔 더 잘할 수 있습니다. 응원하겠습니다!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: '일곱 번 넘어져도 다시!',
          chapters: [
            {
              title: '1장: 용기를 내는 대사 분류',
              goal: '실수했을 때 기가 죽는 혼잣말 대신 용기를 내는 격려 말을 고르십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'courage_speech_sort',
                  prompt: '실수로 속상할 때 마음에 힘을 주는 고운 대사와 피해야 할 좌절 대사를 구분하십시오.',
                  bins: [
                    { label: '용기를 주는 예쁜 말', emoji: '💖' },
                    { label: '좌절하는 속상한 말', emoji: '❌' }
                  ],
                  cards: [
                    { label: '괜찮아! 실수해도 다시 도전하면 돼!', emoji: '🔥', bin: 0 },
                    { label: '나는 바보인가 봐. 다시는 안 할래.', emoji: '😭', bin: 1 },
                    { label: '틀린 건 내가 배우고 있다는 뜻이야!', emoji: '💡', bin: 0 },
                    { label: '컴퓨터 다 부숴버릴래!', emoji: '⚡', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 실수 위로 격려 대화',
              goal: '에러를 마주했을 때 씩씩하게 새로고침하고 이어 가십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'courage_chat',
                  intro: '퀴즈를 틀렸을 때 나를 다독이며 다시 시작하는 대화입니다.',
                  turns: [
                    {
                      aimi: '삐익! 아쉽게도 퀴즈 정답이 아닙니다. 점수가 깎여서 속상하지만 우리 한 번 더 복습해서 풀어보겠습니까?',
                      choices: [
                        { label: '괜찮아, 배우다 보면 실수할 수 있지! 다시 시작해서 맞혀볼게.', reply: '우와! 정말 놀라운 용기와 끈기입니다. 그런 마음가짐이라면 세상 어떤 어려운 문제도 거뜬히 해결할 수 있습니다!', good: true },
                        { label: '나 이제 기분 나빠서 공부 그만할래.', reply: '속상한 마음에 그럴 수 있습니다! 잠시 숨을 고르고, 힘을 내서 저와 함께 다시 1단계부터 차근차근 시작해 보십시오. 할 수 있습니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 나의 마스코트 디자인',
              goal: '용기 카드를 요약하고 나를 격려할 그림을 그리십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l10',
                  title: '나의 오뚝이 용기 카드',
                  rows: [
                    { label: '내가 선택한 용기 말', from: 'courage_speech_sort' },
                    { label: '재도전 대화 결과', from: 'courage_chat' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m5_l10',
                  prompt: '쓰러져도 다시 일어나는 귀여운 오뚝이나 나의 용기 캐릭터를 그려 보십시오.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '오뚝이 용기 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm5-l11',
    moduleId: 'm5',
    number: 11,
    kind: 'experience',
    title: '라면 끓이기 대작전',
    objective: '라면 끓이는 일의 순서를 세워 차례대로 해 보십시오.',
    standards: [
      '[9정통02-03] 순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.',
      '[9진로03-01] 직군별 작업 과정의 순서를 익힌다.',
    ],
    bodyEasy: '배운 걸로 라면 끓이는 순서를 세워봅니다.',
    bodyNormal:
      '오늘은 배운 것을 다 써봅니다! 라면 끓이기를 작게 나누고, 순서를 세우고, 확인까지 해 보십시오.',
    wrapUpEasy: '작게 나누고, 순서대로 하고, 확인했습니다. 최고!',
    wrapUpNormal: '라면 끓이기도 작게 나누고 순서대로 하면 어렵지 않습니다. 배운 방법은 다른 일에도 쓸 수 있습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['나누기', '순서', '확인', '검토'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: '먼저 AI한테 라면 끓이는 순서를 물어봅니다.',
          userInput: '라면 끓이는 순서를 짧게 알려 주십시오',
          aiResponse: '물 끓이기 → 면과 수프 넣기 → 3분 더 끓이기 → 불 끄고 그릇에 담기! 뜨거우니까 꼭 어른과 함께 합니다.',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '라면 끓이는 순서대로 눌러봅니다!',
          items: [
            { label: '냄비에 물을 넣고 끓입니다' },
            { label: '면과 수프를 넣습니다' },
            { label: '3분 더 끓입니다' },
            { label: '불을 끄고 그릇에 담습니다' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '뜨거운 라면은 어른과 함께 만드는 게 안전하겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 뜨거운 것은 꼭 어른과 함께 합니다.',
            },
            {
              question: '면을 넣고 나서 물을 끓이는 게 맞겠습니까?',
              answer: 'X',
              feedback: '물을 먼저 끓이고 면을 넣습니다. 순서 기억하습니까?',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '나만의 맛있는 요리 작전',
          chapters: [
            {
              title: '1장: 라면 조리 타임라인 정렬',
              goal: '라면 끓이기에 필요한 4가지 조각을 올바른 순서대로 분배하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'ramen_sort',
                  prompt: '라면을 끓이는 앞 단계와 뒷 단계를 구분하여 바구니에 담으십시오.',
                  bins: [
                    { label: '앞 순서 (조리 시작)', emoji: '🔥' },
                    { label: '뒤 순서 (조리 마킹)', emoji: '🍜' }
                  ],
                  cards: [
                    { label: '냄비에 물을 정량 붓고 팔팔 끓이기', emoji: '💧', bin: 0 },
                    { label: '물이 끓으면 면과 분말수프 조심히 넣기', emoji: '🍜', bin: 0 },
                    { label: '수프가 잘 배도록 3분 동안 더 끓이기', emoji: '⏱️', bin: 1 },
                    { label: '불을 안전하게 끄고 그릇에 라면 옮겨 담기', emoji: '🥣', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 요리 계획 의논 대화',
              goal: 'AI 셰프와 함께 뜨거운 불 조작의 안전을 의논하십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'ramen_chat',
                  intro: '요리 순서를 확인하며 대화합니다.',
                  turns: [
                    {
                      aimi: '꼬마 셰프님! 이제 순서대로 라면 끓이기 계획을 마쳤습니까? 불을 켤 때는 뜨거우니 반드시 옆의 어른께 도움을 청해야 한습니다!',
                      choices: [
                        { label: '응! 가스레인지 불을 켤 때는 꼭 부모님이나 선생님과 함께 할게.', reply: '정말 대단합니다! 안전까지 완벽히 챙기는 당신은 진짜 멋진 일류 셰프랍니다. 맛있게 끓여 봅니다!', good: true },
                        { label: '내가 혼자 불을 켜서 빨리 끓여 먹을래.', reply: '앗, 위험합니다! 가스레인지나 뜨거운 냄비는 소중한 내 몸에 큰 화상을 입힐 수 있으니 반드시 어른과 함께 불을 다루어야 한습니다.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 요리 카드 확인',
              goal: '계획 수첩 보고서를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l11',
                  title: '나의 요리 계획 요약서',
                  rows: [
                    { label: '조리 단계 순서', from: 'ramen_sort' },
                    { label: '안전 요리 대화 결과', from: 'ramen_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m5_l11',
                  template: '나 {이름}는 요리를 계획하고 안전하게 실천할 수 있는 문제 해결 {빈칸} 되겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '꼬마 요리사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l12 ───────────────────────────
  {
    id: 'm5-l12',
    moduleId: 'm5',
    number: 12,
    kind: 'concept',
    title: '나는 문제 해결사! (마무리)',
    objective: '이전 시간에 공부한 문제 해결 4단계를 다시 알아봅니다.',
    standards: ['[12정통02-03] 생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.'],
    bodyEasy: '배운 문제 해결 방법을 확인해 보십시오.',
    bodyNormal:
      '단원 5에서 배운 것 — 알아차리기, 작게 나누기, 순서 세우기, 힌트 받기, 확인하기 — 를 정리해 보십시오.',
    wrapUpEasy: '단원 5를 다 배웠습니다! 나는 문제 해결사입니다.',
    wrapUpNormal: '단원 5를 마쳤습니다! 문제를 알아차리고, 작게 나누고, 순서대로 하고, 확인하는 힘이 생겼습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['순서', '급한 일 먼저', '힌트', '확인', '검토', '평가'] } },
      {
        kind: 'sequence',
        data: {
          instruction: '문제 해결 순서를 차례대로 눌러봅니다!',
          items: [
            { label: '문제를 알아차렸습니다' },
            { label: '작게 나눠습니다' },
            { label: '순서대로 합니다' },
            { label: '맞는지 확인합니다' },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '어려운 문제', right: '작게 나눠습니다' },
            { left: '막힐 때', right: '"힌트만 줘" 부탁합니다' },
            { left: '다 풀었을 때', right: '맞는지 확인합니다' },
            { left: '실수했을 때', right: '괜찮습니다, 다시 합니다' },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '문제 해결사의 마음가짐으로 가장 알맞은 것은습니까?',
          choices: [
            { label: '"어려워도 작게 나눠서 해보자!"', isCorrect: true },
            { label: '"어려우면 바로 포기하자"', isCorrect: false },
            { label: '"남이 다 해줄 거야"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '문제 해결 특공대 졸업식',
          chapters: [
            {
              title: '1장: 4대 해결 비법 매칭',
              goal: '배운 핵심 문제 해결 4단계 카드를 정리 보관하십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'solving_graduation_sort',
                  prompt: '문제 해결사의 4원칙 비법 열쇠 카드를 알맞은 보관함에 넣으십시오.',
                  bins: [
                    { label: '똑똑한 해결 행동', emoji: '👮' },
                    { label: '피해야 할 피곤한 행동', emoji: '❌' }
                  ],
                  cards: [
                    { label: '어려운 숙제는 작은 공부 조각으로 쪼개서 하기', emoji: '📖', bin: 0 },
                    { label: '어떻게 할지 순서 타임라인 먼저 계획하기', emoji: '⏱️', bin: 0 },
                    { label: '안 풀리면 짜증 내고 포기하고 공책 찢기', emoji: '😭', bin: 1 },
                    { label: '다 해결한 뒤에 답이 맞는지 꼼꼼히 확인하기', emoji: '🔎', bin: 0 },
                    { label: '막히면 AI에게 답을 그냥 베껴 달라고 조르기', emoji: '📋', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 해결사 임명 대화',
              goal: '단원 5를 무사히 수료한 소감을 나누십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'solving_graduation_chat',
                  intro: '해결사 임명 축하 대화입니다.',
                  turns: [
                    {
                      aimi: '축하합니다! 이제 어떤 복잡하고 큰 일감을 마주해도 스스로 나누고 정렬해서 풀 수 있는 멋진 문제 해결사가 되었습니다!',
                      choices: [
                        { label: '네! 문제를 쪼개고 차례대로 끈기 있게 풀어낼겠습니다.', reply: '정말 든든하입니다. 당신은 이제 어떤 난관도 스스로 극복할 수 있는 튼튼한 사고의 힘을 가졌습니다. 졸업을 축하합니다!', good: true },
                        { label: '어려울 땐 힌트도 구하고 다른 방법도 세워볼겠습니다!', reply: '완벽한 백점짜리 소감입니다! 지혜롭게 대처하고 유연하게 다른 방법을 찾는 모습이 참 자랑스럽습니다.', good: true }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 본 활동: 생각 리플레이',
              goal: '첫 생각과 달라진 조건을 비교하고, 나만의 다음 행동을 만들어 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m5.main]
            },
            {
              title: '4장: 수료 선언',
              goal: '나의 문제 해결사 임명장 수료증을 받으십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m5_l12',
                  title: '문제 해결사 졸업 카드',
                  rows: [
                    { label: '내가 정립한 해결 원칙', from: 'solving_graduation_sort' },
                    { label: '최종 졸업 다짐', from: 'solving_graduation_chat' },
                    { label: '판단 비교와 새 장면 기록', from: 'judgment_main_m5_l12' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m5_l12',
                  template: '나 {이름}는 마주한 문제를 지혜롭고 씩씩하게 {빈칸} 마스터가 될 것을 다짐합니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'certificate',
            badgeLabel: 'AI 문제 해결 마스터 수료증 획득!'
          }
        }
      }
    ],
  },
];
