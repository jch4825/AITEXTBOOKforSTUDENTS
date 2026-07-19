import type { LessonContent } from '../../types';
import { GENERALIZATION_CYCLES } from '../generalizationCycles';

/**
 * 단원 1 — AI가 뭐야?
 *
 * 11차시 개념 도입. 학생이 "AI가 우리 곁에 있고, 뭘 잘하고 못하는지"를
 * 감으로 잡는 것이 목표. 실제 Gemini 호출 없음 — 전부 시뮬레이션.
 */
export const M1_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm1-l1',
    moduleId: 'm1',
    number: 1,
    kind: 'concept',
    title: 'AI는 우리 곁에 있습니다',
    objective: 'AI가 무엇인지 알고, AI가 하는 일을 생활 장면에서 찾습니다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 자료를 보고 답을 만드는 컴퓨터 기술입니다.',
    wrapUpNormal: 'AI는 자료를 보고 답이나 추천을 만듭니다. 중요한 내용은 사람이 다시 확인합니다.',
    bodyEasy: 'AI는 사람이 만든 컴퓨터 기술입니다.',
    bodyNormal: 'AI는 글을 읽거나, 말을 듣거나, 사진 또는 영상을 이해할 수 있습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['인공지능', '컴퓨터', '프로그램', '자료', '음성 비서', '번역', '앱', '도구'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '핸드폰의 음성비서(시리, 빅스비)는 AI입니까?',
              answer: 'O',
              feedback: '맞습니다! AI가 우리 말을 알아듣고 답해 주십시오.',
            },
            {
              question: '냉장고는 AI입니까?',
              answer: 'X',
              feedback: '대부분의 냉장고는 그냥 차갑게 만드는 기계입니다.',
            },
            {
              question: '챗봇은 AI입니까?',
              answer: 'O',
              feedback: '맞습니다! 챗봇은 글로 대화하는 AI입니다.',
            },
          ],
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI가 가장 잘하는 일은 무엇입니까?',
          choices: [
            { label: '사람이 묻는 말에 답해주기', isCorrect: true, icon: 'chatbot' },
            { label: '빨래를 개기', isCorrect: false, icon: 'clothes' },
            { label: '축구공 차기', isCorrect: false, icon: 'soccer_ball' },
            { label: '비 오게 하기', isCorrect: false, icon: 'rain' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "안녕!" 이라고 인사해 보십시오.',
          userInput: '안녕!',
          aiResponse: '안녕하세요! 만나서 반갑습니다. 오늘은 어떤 걸 배우고 싶습니까?',
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 찾기 탐험대',
          chapters: [
            {
              title: '1장: 우리 주변의 AI',
              goal: '집과 학교에서 본 AI를 모두 골라 보십시오.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'seen_ai',
                  prompt: '집이나 학교에서 본 인공지능(AI)을 모두 골라 보십시오.',
                  items: [
                    { emoji: '🗣️', label: '음성 비서 스피커' },
                    { emoji: '🌐', label: '글자 번역기' },
                    { emoji: '🤖', label: '대화하는 챗봇' },
                    { emoji: '🍞', label: '토스터' },
                    { emoji: '🌀', label: '선풍기' }
                  ]
                }
              ]
            },
            {
              title: '2장: 내가 써 보고 싶은 AI',
              goal: '가장 사용해 보고 싶은 AI를 하나만 골라 보십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'want_ai',
                  prompt: '가장 써 보고 싶은 인공지능(AI)을 하나만 골라 보십시오.',
                  items: [
                    { emoji: '🗣️', label: '날씨 알려주는 음성 비서' },
                    { emoji: '🌐', label: '외국어를 고쳐주는 번역기' },
                    { emoji: '🤖', label: '심심할 때 대화하는 챗봇' }
                  ]
                }
              ]
            },
            {
              title: '3장: 다짐하기',
              goal: '다짐을 완성하고 발견 카드를 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary1',
                  title: '나의 AI 발견 카드',
                  rows: [
                    { label: '내가 발견한 AI', from: 'seen_ai' },
                    { label: '내가 써 볼 AI', from: 'want_ai' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow1',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '나 {이름}는 우리 생활 속에서 인공지능을 {빈칸} 도우미로 바르게 사용하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: 'AI 탐험가 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm1-l2',
    moduleId: 'm1',
    number: 2,
    kind: 'concept',
    title: '기계랑 AI는 뭐가 달라?',
    objective: '기계와 AI가 어떻게 다른지 알아봅니다.',
    standards: [
      '[9정통01-02] 다양한 정보통신 기기의 종류를 알고, 기본 기능을 익힌다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: '그냥 기계는 정해진 일만 합니다. AI는 말을 알아듣고 대답합니다.',
    wrapUpNormal: '보통 기계는 정해진 일만 반복하지만, AI는 우리 질문을 알아듣고 스스로 답을 만듭니다.',
    bodyEasy: '그냥 기계는 정해진 일만 합니다. AI는 우리 말을 알아듣고 답해 주십시오.',
    bodyNormal:
      '보통 기계는 미리 정해진 일만 반복합니다. 하지만 AI는 우리가 하는 질문을 알아듣고 스스로 답을 만들어줍니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['기계', '자동화', '학습', '자료'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '토스터는 우리 말을 알아들을 수 있습니까?',
              answer: 'X',
              feedback: '토스터는 그냥 빵을 굽는 기계입니다. 말을 알아들을 수 없습니다.',
            },
            {
              question: 'AI 스피커는 "음악 틀어줘"를 알아들습니까?',
              answer: 'O',
              feedback: '맞습니다! AI 스피커는 우리 말을 듣고 이해할 수 있습니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '기계·AI 분류 공장',
          chapters: [
            {
              title: '1장: 기계일까, AI일까?',
              goal: '그냥 기계와 인공지능(AI)을 구분해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'sort_mach',
                  prompt: '그냥 기계와 인공지능(AI)을 알맞은 바구니에 나눠 담아 보십시오.',
                  bins: [
                    { label: '그냥 기계', emoji: '⚙️' },
                    { label: '인공지능', emoji: '🤖' }
                  ],
                  cards: [
                    { label: '선풍기', emoji: '🌀', bin: 0 },
                    { label: '음성 비서', emoji: '🗣️', bin: 1 },
                    { label: '전기 다리미', emoji: '🔌', bin: 0 },
                    { label: '번역 앱', emoji: '🌐', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 상상하기',
              goal: 'AI로 만들고 싶은 우리 집 물건을 골라 보십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'invent_choice',
                  prompt: '우리 집 물건 중에서 AI로 만들고 싶은 것을 하나만 골라 보십시오.',
                  items: [
                    { emoji: '🍎', label: '말하는 냉장고' },
                    { emoji: '🧹', label: '자동 정리 로봇' },
                    { emoji: '☔', label: '날씨 알려주는 우산' }
                  ]
                }
              ]
            },
            {
              title: '3장: 내 발명품 그리기',
              goal: '내가 고른 물건을 그리고 상상해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary2',
                  title: '나의 발명 카드',
                  rows: [
                    { label: '분류 완료한 기계', from: 'sort_mach' },
                    { label: '만들고 싶은 AI 물건', from: 'invent_choice' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_invent',
                  prompt: '내가 상상한 똑똑한 AI 기계를 그려 보십시오.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: 'AI 발명가 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm1-l3',
    moduleId: 'm1',
    number: 3,
    kind: 'concept',
    title: 'AI는 어떻게 답해줄까?',
    objective: 'AI가 어떻게 답을 만드는지 알아봅니다.',
    standards: [
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: '궁금한 게 있으면 AI한테 물어봅니다. 답을 해 주십시오.',
    wrapUpNormal: 'AI한테 글이나 말로 물어보면 답을 만들어줍니다. 궁금한 건 언제든 물어봐도 됩니다.',
    bodyEasy: 'AI한테 물으면 답을 해 주십시오. 짧게 물어도 되고, 길게 물어도 됩니다.',
    bodyNormal:
      'AI한테 궁금한 걸 글이나 말로 물어보면 답을 만들어줍니다. 짧게 물어도 되고 자세하게 물어도 됩니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['생성형 AI', '자료', '확률', '예측', '특징', '환각'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 "무지개는 몇 개 색이야?" 라고 물어봅니다.',
          userInput: '무지개는 몇 개 색이야?',
          aiResponse: '무지개는 보통 7개 색입니다. 빨강, 주황, 노랑, 초록, 파랑, 남색, 보라!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI한테 물어보기 좋은 것은 무엇입니까?',
          choices: [
            { label: '"고양이는 왜 울어?"', isCorrect: true, icon: 'cat' },
            { label: '아무 말 안 하기', isCorrect: false, icon: 'sleep' },
            { label: '눈만 감고 기다리기', isCorrect: false, icon: 'sleep' },
            { label: '화면 두드리기', isCorrect: false, icon: 'tap_screen' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '답 만들기 구경',
          chapters: [
            {
              title: '1장: 문장 이어 쓰기 대화',
              goal: '아이미와 함께 문장을 완성해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'aimi_sentence',
                  intro: '생성형 AI 아이미와 함께 어울리는 말을 골라 문장을 완성해 보십시오.',
                  turns: [
                    {
                      aimi: '안녕! 나는 배워서 답하는 생성형 AI야. 내 아침 이야기의 첫 문장을 골라 줘. "나는 아침마다 맛있는..."',
                      choices: [
                        { label: '우유를 마십니다.', reply: '좋습니다! "나는 아침마다 맛있는 우유를 마십니다."로 이어 볼겠습니다.', good: true },
                        { label: '돌을 먹습니다.', reply: '어라? 컴퓨터가 돌을 먹는다고습니까? 이상하지만 일단 "나는 아침마다 맛있는 돌을 먹습니다."로 해 볼겠습니다.' }
                      ]
                    },
                    {
                      aimi: '그다음은 어떤 말로 이어 보겠습니까? "우유를 마시면 키가 쑥쑥..."',
                      choices: [
                        { label: '자랍니다.', reply: '멋집니다! "우유를 마시면 키가 쑥쑥 자랍니다." 문장 완성!', good: true },
                        { label: '하늘을 날습니다.', reply: '앗! 우유를 마신다고 하늘을 날 수는 없습니다. AI가 자신 있게 말해도 틀린 답(환각)이 될 수 있습니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '2장: 그럴듯한 거짓말 찾기',
              goal: 'AI가 자신 있게 말했지만 틀린 대답을 골라 보십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'hallucination_check',
                  prompt: '문장 중에서 그럴듯해 보이지만 사실이 아닌 틀린 대답(환각)은 무엇입니까?',
                  items: [
                    { emoji: '🥛', label: '우유를 마시면 키가 자란다' },
                    { emoji: '🧚', label: '우유를 마시면 하늘을 난다' }
                  ]
                }
              ]
            },
            {
              title: '3장: 다짐하기',
              goal: '안전 다짐을 채워 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary3',
                  title: '오늘의 발견 카드',
                  rows: [
                    { label: '내가 선택한 대화', from: 'aimi_sentence' },
                    { label: '내가 찾은 틀린 대답', from: 'hallucination_check' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow3',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '나 {이름}는 AI가 자신 있게 대답해도 사실이 맞는지 {빈칸} 확인하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: 'AI 발견자 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm1-l4',
    moduleId: 'm1',
    number: 4,
    kind: 'concept',
    title: 'AI는 눈이 있어? (그림을 알아봅니다)',
    objective: 'AI가 사진 속 물건을 알아보는 모습을 알아봅니다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 사진을 보고 뭐가 있는지 알아볼 수 있습니다.',
    wrapUpNormal: 'AI는 사진을 보고 무엇이 있는지 알아볼 수 있습니다. 이것을 이미지 인식이라고 합니다.',
    bodyEasy: 'AI는 사진을 보고 "이게 뭐야"를 알 수 있습니다.',
    bodyNormal:
      'AI는 사진을 보여주면 "이건 강아지야, 저건 자동차야" 하고 알아볼 수 있습니다. 이걸 이미지 인식이라고 합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['이미지 인식', '학습', '패턴', '판단'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 사진을 보여주고 "이게 뭐야?" 하고 물어봅니다.',
          userInput: '(강아지 사진) 이게 뭐야?',
          aiResponse: '귀여운 강아지입니다! 갈색 털을 가진 작은 강아지입니다.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사진을 보고 "고양이야"라고 말해줄 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! AI는 사진 속 물건을 알아볼 수 있습니다.',
            },
            {
              question: 'AI는 눈을 감으면 아무것도 못 봅니다?',
              answer: 'X',
              feedback: 'AI는 사람 같은 눈이 아니라 카메라나 사진을 통해 보십시오.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 눈 실험실',
          chapters: [
            {
              title: '1장: 사진 분류하기',
              goal: 'AI가 알아보기 쉬운 사진과 헷갈리는 사진을 나눠 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'sort_images',
                  prompt: 'AI가 보기 편한 사진과 알아보기 힘든 헷갈리는 사진을 바구니에 나눠 담아 보십시오.',
                  bins: [
                    { label: '알아보기 쉽습니다', emoji: '☀️' },
                    { label: '헷갈렸습니다', emoji: '🌫️' }
                  ],
                  cards: [
                    { label: '정면에서 찍은 강아지 사진', emoji: '🐶', bin: 0 },
                    { label: '강아지 모양 인형 사진', emoji: '🧸', bin: 1 },
                    { label: '가까이서 잘 찍은 사과 사진', emoji: '🍎', bin: 0 },
                    { label: '사과 그림이 그려진 가방 사진', emoji: '🎒', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 잘못 보는 AI 고쳐주기',
              goal: '잘못 알아보는 아이미를 바르게 고쳐 줘 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'correct_aimi',
                  intro: '아이미가 사과 가방 사진을 보고 "맛있는 사과"라고 합니다. 아이미에게 알려 주십시오 보겠습니까?',
                  turns: [
                    {
                      aimi: '빨갛고 둥근 사과입니다! 참 맛있어 보입니다.',
                      choices: [
                        { label: '그건 사과가 아니라 사과 가방이야.', reply: '앗, 그렇습니다! 빨간 원형이라 사과인 줄 알았습니다. 알려 주셔서 감사합니다!', good: true },
                        { label: '와! 한 입 깨물어 먹어야지.', reply: '어라? 사과 가방을 먹으면 이가 아플 것 같습니다! AI가 틀릴 수 있습니다.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 다짐하기',
              goal: '내 눈으로 한 번 더 확인하기로 약속해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary4',
                  title: '실험 기록 카드',
                  rows: [
                    { label: '사진 분류 결과', from: 'sort_images' },
                    { label: '내가 가르쳐준 대답', from: 'correct_aimi' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow4',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '나 {이름}는 AI가 사진을 잘못 볼 수 있으니 {빈칸} 직접 확인하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: 'AI 분석가 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm1-l5',
    moduleId: 'm1',
    number: 5,
    kind: 'concept',
    title: 'AI는 귀가 있어? (말을 알아듣습니다)',
    objective: 'AI가 우리 목소리를 어떻게 알아듣는지 알아봅니다.',
    standards: [
      '[9정통01-02] 다양한 정보통신 기기의 종류를 알고, 기본 기능을 익힌다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: 'AI는 우리 목소리를 듣고 알아듣습니다.',
    wrapUpNormal: 'AI는 마이크로 우리 말을 듣고 알아듣습니다. 조용한 곳에서 또박또박 말하면 더 잘 알아듣습니다.',
    bodyEasy: 'AI는 우리가 하는 말을 듣고 알아들을 수 있습니다.',
    bodyNormal:
      'AI는 마이크로 우리 목소리를 듣고 무슨 말을 했는지 알아듣습니다. 이걸 음성 인식이라고 합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['음성 인식', '마이크', '명령어'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 말로 "지금 몇 시야?" 라고 물어봅니다.',
          userInput: '(마이크) 지금 몇 시야?',
          aiResponse: '지금은 오후 3시 30분입니다.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '말로 AI를 쓰는 예는 무엇입니까?',
          choices: [
            { label: '"시리야, 알람 맞춰줘"', isCorrect: true, icon: 'alarm_clock' },
            { label: '종이에 그림 그리기', isCorrect: false, icon: 'drawing' },
            { label: '창문 닫기', isCorrect: false, icon: 'window' },
            { label: '가만히 있기', isCorrect: false, icon: 'sleep' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '또박또박 말하기 도전',
          chapters: [
            {
              title: '1장: 소음 속의 대화',
              goal: '시끄러운 곳에서 AI와 대화하는 대처법을 골라 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'noise_chat',
                  prompt: '주변 소음 속에서 올바르게 대처해 보십시오.',
                  intro: '주변이 시끄러워 내 목소리를 알아듣지 못하는 아이미와 대화해 보십시오.',
                  turns: [
                    {
                      aimi: '(주변 소음: 와글와글) 소리가 웅웅대서 잘 들리지 않습니다. 뭐라고 하셨습니까?',
                      choices: [
                        { label: '조용한 곳으로 옮겨 또박또박 말합니다.', reply: '아! 이제 잘 들립니다. 음성 인식 성공!', good: true },
                        { label: '핸드폰에 대고 더 크게 소리를 지릅니다.', reply: '앗, 큰 소리가 마이크에 찢어지게 들려 오해하기 더 어려워졌습니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '2장: 어려운 상황 찾기',
              goal: 'AI가 말을 알아듣기 어려운 상황을 찾아 보십시오.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'hard_speech',
                  prompt: '인공지능(AI)이 내 목소리를 알아듣기 어려운 상황을 모두 골라 보십시오.',
                  items: [
                    { emoji: '🔊', label: '주변이 매우 시끄러울 때' },
                    { emoji: '🍬', label: '사탕을 물고 우물우물 말할 때' },
                    { emoji: '🤫', label: '조용한 곳에서 또박또박 말할 때' },
                    { emoji: '⚡', label: '숨차게 너무 빨리 다다다 말할 때' }
                  ]
                }
              ]
            },
            {
              title: '3장: 다짐하기',
              goal: '말하기 다짐을 완성해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary5',
                  title: '말하기 도전 카드',
                  rows: [
                    { label: '내가 선택한 대처법', from: 'noise_chat' },
                    { label: '잘 안 들리는 상황', from: 'hard_speech' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow5',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '나 {이름}는 AI가 내 목소리를 잘 듣도록 앞으로 {빈칸} 말하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '말하기 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm1-l6',
    moduleId: 'm1',
    number: 6,
    kind: 'concept',
    title: 'AI는 어떻게 배울까?',
    objective: 'AI가 자료를 보고 배우는 과정을 알아봅니다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 많은 예시를 보고 배웁니다. 우리가 연습하는 것과 같습니다.',
    wrapUpNormal: 'AI는 아주 많은 예시를 보면서 배웁니다. 우리가 연습을 많이 하면 잘하게 되는 것과 비슷합니다.',
    bodyEasy: 'AI는 아주 많은 예시를 보고 배웁니다. 우리가 연습하는 것과 같습니다.',
    bodyNormal:
      'AI는 사람이 만든 아주 많은 예시(사진, 글, 소리)를 보면서 배웁니다. 우리가 자꾸 연습하면 잘하게 되는 것과 비슷합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['학습 데이터', '자료', '훈련', '편향'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '고양이 사진 100장 보여주기', right: 'AI가 고양이를 알아봅니다', icon: 'cat' },
            { left: '노래 가사 많이 보여주기', right: 'AI가 노래를 만듭니다', icon: 'music' },
            { left: '대화 많이 보여주기', right: 'AI가 대화를 잘합니다', icon: 'chatbot' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 태어날 때부터 다 알겠습니까?',
              answer: 'X',
              feedback: 'AI도 사람처럼 많이 보고 배워야 알 수 있습니다.',
            },
            {
              question: 'AI에게 많은 예시를 보여주면 더 잘하게 될겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 우리가 연습을 많이 하면 잘하는 것과 같습니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 학교 급식소',
          chapters: [
            {
              title: '1장: 배움의 종류 분류',
              goal: '골고루 배운 자료와 한쪽만 치우치게 배운 자료를 구분해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'sort_data',
                  prompt: '인공지능(AI)이 똑똑해지려면 골고루 배워야 합니다. 자료의 균형을 나눠 보십시오.',
                  bins: [
                    { label: '골고루 배웁니다', emoji: '🌈' },
                    { label: '한쪽만 배웁니다', emoji: '🌓' }
                  ],
                  cards: [
                    { label: '다양한 강아지 사진 천 장', emoji: '🐶', bin: 0 },
                    { label: '하얀색 말티즈 사진만 천 장', emoji: '🐩', bin: 1 },
                    { label: '여러 가지 과일 사진 백 장', emoji: '🍍', bin: 0 },
                    { label: '빨간 사과 사진만 백 장', emoji: '🍎', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 치우친 학습의 결과',
              goal: '한쪽만 배운 AI가 겪을 일을 예측해 보십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'bias_predict',
                  prompt: '하얀 강아지만 공부한 AI에게 까만 강아지 사진을 보여주면 어떻게 될겠습니까?',
                  items: [
                    { emoji: '🐕', label: '까만 강아지도 잘 알아본다' },
                    { emoji: '❓', label: '강아지가 아니라고 오해한다' }
                  ]
                }
              ]
            },
            {
              title: '3장: AI 가르치기',
              goal: 'AI에게 골고루 보여주고 싶은 것을 그리십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary6',
                  title: '급식소 기록 카드',
                  rows: [
                    { label: '자료 분류 결과', from: 'sort_data' },
                    { label: '치우친 공부의 결과', from: 'bias_predict' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_teach',
                  prompt: '내가 AI에게 골고루 보여주고 가르치고 싶은 대상을 그려 보십시오.'
                }
              ]
            },
            {
              title: '4장: 예고: 첫 생각 저장',
              goal: '새로운 생활 장면에서 처음 생각한 방법을 기록해 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m1.preview]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '공평한 선생님 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm1-l7',
    moduleId: 'm1',
    number: 7,
    kind: 'concept',
    title: 'AI가 잘하는 것',
    objective: 'AI가 잘하는 일들을 찾아봅니다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 빠르게 답하고, 번역하고, 그림을 알아봅니다.',
    wrapUpNormal: 'AI는 빠르게 답하기, 번역하기, 사진 알아보기를 잘합니다. 우리를 여러 가지로 도와줄 수 있습니다.',
    bodyEasy: 'AI는 빠르게 답하기, 번역하기, 그림 알아보기를 잘합니다.',
    bodyNormal:
      'AI는 아주 빠르게 답을 만들고, 다른 나라 말로 바꿔주고, 사진 속 물건을 알아봅니다. 우리를 여러 가지로 도와줄 수 있습니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['요약', '번역'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사람보다 계산을 훨씬 빠르게 할 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! AI는 계산을 아주 빠르게 합니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 사용 설명서',
          chapters: [
            {
              title: '1장: 잘하는 것 고르기',
              goal: 'AI가 잘해서 우리를 도와주는 일을 모두 골라 보십시오.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'good_at',
                  prompt: '인공지능(AI)이 사람을 도와 아주 잘할 수 있는 일을 모두 골라 보십시오.',
                  items: [
                    { emoji: '🌐', label: '영어 대사를 한국어로 번역하기' },
                    { emoji: '📖', label: '긴 동화책을 짧게 줄이기' },
                    { emoji: '🍲', label: '부엌에서 직접 찌개 끓이기' },
                    { emoji: '🎨', label: '어울리는 일러스트 그려주기' }
                  ]
                }
              ]
            },
            {
              title: '2장: 잘함과 못함 분류',
              goal: 'AI가 잘하는 일과 할 수 없는 일을 나눠 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'sort_ability',
                  prompt: 'AI가 스스로 해결할 수 있는 일과 사람이 대신해 주십시오야 하는 일을 바구니에 담아 보십시오.',
                  bins: [
                    { label: 'AI가 잘합니다', emoji: '🌟' },
                    { label: 'AI가 못합니다', emoji: '❌' }
                  ],
                  cards: [
                    { label: '빠르게 계산하기', emoji: '🧮', bin: 0 },
                    { label: '글자 번역하기', emoji: '🌐', bin: 0 },
                    { label: '마음으로 슬퍼하기', emoji: '💧', bin: 1 },
                    { label: '밥을 씹어 먹기', emoji: '🍚', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '3장: 다짐하기',
              goal: '사용 설명서를 완성하고 약속해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary7',
                  title: '나의 AI 사용 설명서',
                  rows: [
                    { label: '도움을 받는 일', from: 'good_at' },
                    { label: '못하는 한계 분류', from: 'sort_ability' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow7',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '나 {이름}는 AI가 마음이 없는 {빈칸} 도구일 뿐임을 항상 기억하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '설명서 마스터 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm1-l8',
    moduleId: 'm1',
    number: 8,
    kind: 'concept',
    title: 'AI가 못하는 것',
    objective: 'AI가 못하는 일들을 찾아봅니다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: 'AI는 밥을 먹거나 진짜 마음을 느끼지 못합니다.',
    wrapUpNormal: 'AI는 몸과 마음이 없어서 밥을 먹거나 진짜로 슬퍼하지 못합니다. 사람만 할 수 있는 일이 있습니다.',
    bodyEasy: 'AI는 밥을 먹거나, 마음을 느끼지 못합니다. 사람만 하는 일이 있습니다.',
    bodyNormal:
      'AI는 사람처럼 배고픔이나 슬픔 같은 마음을 진짜로 느끼지 못합니다. 몸이 없어서 뛰거나 밥 먹는 것도 못 합니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['최신 정보', '감정'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 배가 고파서 밥을 먹겠습니까?',
              answer: 'X',
              feedback: 'AI는 몸이 없어서 밥을 못 먹습니다.',
            },
            {
              question: 'AI는 진짜로 슬퍼서 눈물을 흘릴겠습니까?',
              answer: 'X',
              feedback: 'AI는 마음이 없어서 진짜로 슬퍼하지 못합니다.',
            },
            {
              question: 'AI는 축구공을 발로 찰 수 있겠습니까?',
              answer: 'X',
              feedback: 'AI는 몸이 없어서 발로 찰 수가 없습니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '못하는 것 탐정',
          chapters: [
            {
              title: '1장: 가능과 불가능',
              goal: 'AI가 할 수 있는 것과 없는 것을 탐정처럼 밝혀내 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'sort_detect',
                  prompt: '인공지능(AI)이 해낼 수 있는 일과 절대 혼자선 못하는 일을 구분해 보십시오.',
                  bins: [
                    { label: '할 수 있습니다', emoji: '🙆' },
                    { label: '할 수 없습니다', emoji: '🙅' }
                  ],
                  cards: [
                    { label: '빠르게 번역하기', emoji: '🌐', bin: 0 },
                    { label: '스스로 배고파하기', emoji: '🍕', bin: 1 },
                    { label: '진짜로 슬퍼하기', emoji: '😢', bin: 1 },
                    { label: '새로운 퀴즈 만들기', emoji: '✏️', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '2장: 생각의 비밀 탐색',
              goal: 'AI와 마음을 주제로 대화해 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'mind_detect',
                  intro: '마음이 무엇인지 아이미와 깊이 대화해 보겠습니까?',
                  turns: [
                    {
                      aimi: '저는 몸과 마음이 없어서 진짜 배고픔이나 기쁨을 느끼지는 못한습니다.',
                      choices: [
                        { label: '맛있는 걸 먹는 기쁨은 모르는구나.', reply: '네, 맞습니다. 진짜로 음식을 먹고 행복을 느낄 수 있는 건 사람뿐입니다!', good: true },
                        { label: '전기가 없으면 배고파지는 거야?', reply: '충전선은 전기 전원일 뿐입니다. 배가 고픈 진짜 기분과는 다릅니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 다짐하기',
              goal: '탐정 다짐을 완성해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary8',
                  title: '탐정 수첩 카드',
                  rows: [
                    { label: '탐정 분류 기록', from: 'sort_detect' },
                    { label: '대화에서 찾은 한계', from: 'mind_detect' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow8',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '나 {이름}는 AI가 몸과 마음이 없는 {빈칸} 도구임을 항상 잊지 않겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '명탐정 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm1-l9',
    moduleId: 'm1',
    number: 9,
    kind: 'concept',
    title: '여러 가지 AI 친구들',
    objective: '챗봇과 이미지 생성 AI가 무엇인지 알아봅니다.',
    standards: [
      '[9정통01-02] 다양한 정보통신 기기의 종류를 알고, 기본 기능을 익힌다.',
      '[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
    ],
    wrapUpEasy: 'AI는 여러 가지입니다. 하는 일이 조금씩 다릅니다.',
    wrapUpNormal: '글로 대화하는 AI, 말로 대화하는 AI, 그림 그리는 AI처럼 AI는 종류마다 하는 일이 다릅니다.',
    bodyEasy: 'AI는 여러 가지가 있습니다. 이름도 하는 일도 조금씩 다릅니다.',
    bodyNormal:
      'AI는 종류가 여러 가지입니다. 어떤 AI는 글로 대화하고, 어떤 AI는 그림을 그립니다. 이름도 하는 일도 조금씩 다릅니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['이미지 생성 AI', '챗봇', '도구'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '"이 강아지 사진을 그려줘"는 어떤 AI에게 물어보겠습니까?',
          choices: [
            { label: '그림을 그려주는 AI', isCorrect: true, icon: 'drawing' },
            { label: '말로만 대답하는 AI', isCorrect: false, icon: 'chatbot' },
            { label: '번역만 하는 AI', isCorrect: false, icon: 'translate' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 친구 소개 카드',
          chapters: [
            {
              title: '1장: 일감 나눠주기',
              goal: '어떤 일을 어떤 AI에게 부탁해야 할지 나눠 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'sort_friend',
                  prompt: '하려는 대화에 따라 글로 답하는 챗봇과 그림을 그려주는 AI에게 알맞게 부탁을 나눠 보십시오.',
                  bins: [
                    { label: '챗봇 AI', emoji: '💬' },
                    { label: '이미지 생성 AI', emoji: '🎨' }
                  ],
                  cards: [
                    { label: '귀여운 강아지 그림 그려줘', emoji: '🎨', bin: 1 },
                    { label: '강아지는 뼈다귀를 왜 좋아해?', emoji: '💬', bin: 0 },
                    { label: '우주선 그림 그려줘', emoji: '🚀', bin: 1 },
                    { label: '재미있는 짧은 동화 써 주십시오', emoji: '📖', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '2장: 내 AI 친구 그리기',
              goal: '나에게 꼭 맞는 AI 친구를 상상하고 그려 보십시오.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'friend_choice',
                  prompt: '나와 가장 친하게 지내고 싶은 AI 친구를 하나만 골라 보십시오.',
                  items: [
                    { emoji: '💬', label: '고민을 들어주는 챗봇 친구' },
                    { emoji: '🎨', label: '상상을 그려주는 화가 친구' },
                    { emoji: '🎵', label: '어울리는 노래를 고르는 음악 친구' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_friend',
                  prompt: '내가 상상한 멋진 AI 친구의 생김새를 자유롭게 그려 보십시오.'
                }
              ]
            },
            {
              title: '3장: 카드 완성하기',
              goal: '내가 만든 AI 친구 카드를 최종 확인하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary9',
                  title: '나의 AI 친구 카드',
                  rows: [
                    { label: 'AI 역할 구분', from: 'sort_friend' },
                    { label: '나의 AI 친구 종류', from: 'friend_choice' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '친화력 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm1-l10',
    moduleId: 'm1',
    number: 10,
    kind: 'experience',
    title: 'AI랑 놀아본 사람?',
    objective: 'AI에게 프롬프트로 물어보고 답을 확인해 보십시오.',
    standards: [
      '[9정통01-04] 필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
      '[6국어01-04] 묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
    ],
    wrapUpEasy: '오늘 AI랑 이야기해봤습니다. 또박또박 물어보면 됩니다.',
    wrapUpNormal: '오늘 AI랑 진짜로 이야기해봤습니다. 궁금한 걸 또박또박 물어보면 AI가 대답해 주십시오.',
    bodyEasy: 'AI랑 이야기해본 적 있습니까? 오늘은 짧게 대화해 보십시오.',
    bodyNormal:
      'AI랑 이야기해본 적 있습니까? 오늘은 짧은 대화를 해보면서 AI가 어떻게 답하는지 느껴봅니다.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['프롬프트'] } },
      {
        kind: 'real-ai',
        data: {
          prompt: '이번엔 진짜 AI한테 "노래 하나 추천해 주십시오" 라고 부탁해 보십시오!',
          userInput: '노래 하나 추천해 주십시오',
          fallbackResponse:
            '기분이 좋아지는 신나는 동요는 어떻습니까? "곰 세 마리" 나 "숲속을 걸습니다" 같은 노래를 추천합니다!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: 'AI랑 이야기할 때 어떻게 하면 좋겠습니까?',
          choices: [
            { label: '궁금한 걸 또박또박 물어봅니다', isCorrect: true, icon: 'chatbot' },
            { label: '아무 말도 안 합니다', isCorrect: false, icon: 'sleep' },
            { label: '큰 소리로 화냅니다', isCorrect: false, icon: 'angry_face' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '첫 프롬프트 만들기',
          chapters: [
            {
              title: '1장: 프롬프트 조립소',
              goal: '조각을 맞춰 멋진 질문을 완성해 보십시오.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'first_prompt',
                  prompt: '원하는 답을 얻기 위해 "무엇을", "어떻게" 조각을 골라 프롬프트를 조립해 보십시오.',
                  slots: [
                    { label: '무엇을 하겠습니까?' },
                    { label: '어떤 모양으로 하겠습니까?' }
                  ],
                  pieces: [
                    { label: '동화 주인공 이름 추천해 줘', slot: 0, quality: 'good' },
                    { label: '재밌는 거 아무거나 추천해 봐', slot: 0, quality: 'weak' },
                    { label: '세 가지만 짧게 보여 줘', slot: 1, quality: 'good' },
                    { label: '대충 많이 보여 줘', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '좋습니다! 동화책 주인공으로 어울리는 이름 "솔이", "하늘이", "초록이" 세 개를 추천합니다.',
                    weak: '음... 어떤 재밌는 주인공을 원하시는지 조금 더 자세히 적어 보겠습니까?'
                  }
                }
              ]
            },
            {
              title: '2장: 구체적인 질문의 힘',
              goal: '대답을 확인한 후 아이미와 의견을 나눠 보십시오.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'feedback_prompt',
                  intro: '답을 확인한 다음, 더 깔끔한 대답을 얻으려면 어떻게 질문할지 대화해 보십시오.',
                  turns: [
                    {
                      aimi: '질문이 정확하면 저도 꼭 마음에 드는 답을 찾아드릴 수 있습니다.',
                      choices: [
                        { label: '구체적으로 형식을 말하니까 대답이 깔끔하네!', reply: '맞습니다! 구체적으로 목적과 개수를 적을수록 대답이 명확해져습니다.', good: true },
                        { label: '그냥 대충 짧게 대화하고 싶어.', reply: '그러면 저도 틀린 말을 하거나 이상한 답을 할 확률이 높아져습니다!' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 다짐하기',
              goal: '좋은 질문을 쓰기로 다짐해 보십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary10',
                  title: '나의 첫 프롬프트 카드',
                  rows: [
                    { label: '조립한 프롬프트', from: 'first_prompt' },
                    { label: '질문에 대한 평가', from: 'feedback_prompt' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow10',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '나 {이름}는 앞으로 원하는 답을 얻기 위해 {빈칸} 프롬프트를 적어서 질문하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '프롬프트 입문 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm1-l11',
    moduleId: 'm1',
    number: 11,
    kind: 'activity',
    title: '다 배웠습니다! (마무리 퀴즈)',
    objective: '이번 단원에서 배운 낱말들을 다시 알아봅니다.',
    standards: ['[9정통02-04] 인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.'],
    wrapUpEasy: '단원 1을 다 배웠습니다! AI가 뭔지 알게 됐습니다.',
    wrapUpNormal: '단원 1을 마쳤습니다! AI가 무엇이고, 뭘 잘하고 못하는지 알게 됐습니다. 다음 단원에서 AI랑 직접 말해 보십시오.',
    bodyEasy: '지금까지 배운 걸 확인해 보십시오.',
    bodyNormal:
      '단원 1에서 배운 내용을 짧은 퀴즈로 확인해 보십시오. 틀려도 괜찮습니다, 다시 보면서 배워봅니다!',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['학습 데이터', '생성형 AI', '인공지능', '예측', '훈련', '환각', '도구'] } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 사람 말을 알아듣고 답해줄 수 있습니까?',
              answer: 'O',
              feedback: '맞습니다! 그게 AI가 잘하는 일입니다.',
            },
            {
              question: 'AI는 진짜로 배가 고파서 밥을 먹겠습니까?',
              answer: 'X',
              feedback: 'AI는 몸이 없어서 밥을 못 먹습니다.',
            },
            {
              question: 'AI는 많은 예시를 보고 배울겠습니까?',
              answer: 'O',
              feedback: '맞습니다! 우리가 연습하는 것과 같습니다.',
            },
            {
              question: '냉장고는 모두 다 AI입니까?',
              answer: 'X',
              feedback: '대부분의 냉장고는 그냥 차갑게 만드는 기계입니다.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '단원 1 수료식',
          chapters: [
            {
              title: '1장: 배운 것 스스로 확인',
              goal: '단원 1에서 배운 것 중 할 수 있는 것을 골라 보십시오.',
              blocks: [
                {
                  kind: 'multi-pick',
                  id: 'self_check',
                  prompt: '단원 1을 마치면서 내 힘으로 할 수 있게 된 일들을 모두 골라 보십시오.',
                  items: [
                    { emoji: '🔍', label: '우리 생활 속 AI 찾기' },
                    { emoji: '⚙️', label: '그냥 기계와 AI 구분하기' },
                    { emoji: '🌟', label: 'AI가 잘하는 한계 이해하기' },
                    { emoji: '🗣️', label: 'AI에게 또박또박 질문하기' }
                  ]
                }
              ]
            },
            {
              title: '2장: 최종 확인 퀴즈',
              goal: '배운 개념들을 OX 퀴즈처럼 분류해 보십시오.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'final_quiz',
                  prompt: '단원 1의 참과 거짓을 탐정처럼 분류 바구니에 바르게 나눠 담아 보십시오.',
                  bins: [
                    { label: '맞습니다', emoji: '⭕' },
                    { label: '틀립니다', emoji: '❌' }
                  ],
                  cards: [
                    { label: '인공지능은 몸과 마음이 없다', emoji: '🤖', bin: 0 },
                    { label: '모든 냉장고는 무조건 인공지능이다', emoji: '❄️', bin: 1 },
                    { label: 'AI는 배우지 않아도 태어날 때부터 다 안다', emoji: '👶', bin: 1 },
                    { label: 'AI는 빠르게 요약하고 번역한다', emoji: '⚡', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '3장: 본 활동: 생각 리플레이',
              goal: '첫 생각과 달라진 조건을 비교하고, 나의 판단을 다시 만들어 보십시오.',
              blocks: [GENERALIZATION_CYCLES.m1.main]
            },
            {
              title: '4장: 수료 선서',
              goal: '수료증 문구를 다짐과 함께 채워 완성하십시오.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary11',
                  title: '나의 단원 1 기록 카드',
                  rows: [
                    { label: '내가 해낸 일들', from: 'self_check' },
                    { label: '최종 퀴즈 확인', from: 'final_quiz' },
                    { label: '판단 비교와 새 장면 기록', from: 'judgment_main_m1_l11' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow11',
                  prompt: '다짐 문장을 완성해 보십시오.',
                  template: '위 학생 {이름}는 단원 1 공부를 마쳤으므로 앞으로 인공지능을 {빈칸} 사용하는 똑똑한 어린이가 될 것을 다짐합니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'certificate',
            badgeLabel: '단원 1 정복 수료증 획득!'
          }
        }
      }
    ],
  },
];
