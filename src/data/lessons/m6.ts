import type { LessonContent } from '../../types';

/**
 * 단원 6 — AI랑 일상생활
 *
 * 12차시. 마트·길찾기·교통·요리·날씨·병원·직업 준비까지,
 * 생활 시나리오 속에서 AI를 도우미로 쓰는 실전 연습.
 * real-ai 2회 (l5/l11).
 */
export const M6_LESSONS: LessonContent[] = [
  // ─────────────────────────── l1 ───────────────────────────
  {
    id: 'm6-l1',
    moduleId: 'm6',
    number: 1,
    kind: 'activity',
    title: '마트에서 장보기',
    objective: 'AI의 도움을 받아 장보기 목록을 만들 수 있다.',
    standards: ['[6사회01-02] 일상생활에서 활동이나 물건을 선택하고 나의 선택을 중요하게 여기는 태도를 기른다.'],
    bodyEasy: '마트 가기 전에 살 것을 정해요. AI가 도와줘요.',
    bodyNormal:
      '마트에 가기 전에 살 물건 목록을 만들면 잊지 않아요. AI한테 "카레 재료 알려줘" 하고 물어볼 수도 있어요.',
    wrapUpEasy: '마트 가기 전에 살 것을 적어요. AI가 도와줘요.',
    wrapUpNormal: '장보기 전에 목록을 만들면 잊지 않고 살 수 있어요. 뭘 사야 할지 모르면 AI한테 물어봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['목록'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 카레 만들 때 필요한 재료를 물어봐요.',
          userInput: '카레 만들려면 뭘 사야 해?',
          aiResponse: '카레 가루, 감자, 당근, 양파, 그리고 고기가 필요해요. 다섯 가지를 적어 가면 돼요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '장보기 목록에 있는 것만 사면 좋은 점은요?',
          choices: [
            { label: '필요한 것을 잊지 않고 살 수 있어요', isCorrect: true },
            { label: '아무거나 다 사게 돼요', isCorrect: false },
            { label: '더 오래 걸려요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '장보기 순서대로 눌러봐요!',
          items: [
            { label: '살 물건 목록을 만들어요' },
            { label: '마트에서 물건을 찾아 담아요' },
            { label: '계산대에서 계산해요' },
            { label: '영수증 and 물건을 확인해요' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '스마트 장보기 작전',
          chapters: [
            {
              title: '1장: 카레 장보기 조립',
              goal: '카레 요리에 꼭 필요한 재료들만 분류하여 장바구니에 담으세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'grocery_sort',
                  prompt: '카레 요리 재료와 관련 없는 학용품을 구별해 장바구니에 넣으세요.',
                  bins: [
                    { label: '카레 재료 장바구니', emoji: '🛒' },
                    { label: '포함 안 되는 물건', emoji: '❌' }
                  ],
                  cards: [
                    { label: '맛있는 카레 가루', emoji: '🍛', bin: 0 },
                    { label: '흙 묻은 둥근 감자', emoji: '🥔', bin: 0 },
                    { label: '새 연필과 지우개 세트', emoji: '✏️', bin: 1 },
                    { label: '신선한 소고기나 돼지고기', emoji: '🥩', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '2장: 장보기 목록 요약',
              goal: '작성한 장보기 요약 목록 카드를 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l1',
                  title: '나의 마트 장보기 메모',
                  rows: [
                    { label: '내가 카트온 재료들', from: 'grocery_sort' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '알뜰 장꾼 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l2 ───────────────────────────
  {
    id: 'm6-l2',
    moduleId: 'm6',
    number: 2,
    kind: 'activity',
    title: '얼마예요? 돈 계산',
    objective: '물건값을 계산할 때 AI의 도움을 받을 수 있다.',
    standards: [
      '[9수학01-14] 대용 화폐를 활용하여 상품을 교환한다.',
      '[12수학01-14] 실생활의 다양한 상황에서 필요한 화폐를 활용한다.',
    ],
    bodyEasy: '물건값이 얼마인지 계산해봐요.',
    bodyNormal:
      '물건을 살 때 얼마가 필요한지, 거스름돈은 얼마인지 계산해요. 어려우면 AI한테 물어볼 수 있어요.',
    wrapUpEasy: '물건값을 계산하고, 거스름돈도 확인해요.',
    wrapUpNormal: '물건값과 거스름돈은 계산으로 알 수 있어요. 어려우면 AI에게 묻고, 받은 돈은 꼭 확인해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['거스름돈', '예산', '검산'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '1,000원짜리 우유를 사는데 500원만 내면 될까요?',
              answer: 'X',
              feedback: '1,000원짜리는 1,000원이 있어야 살 수 있어요.',
            },
            {
              question: '거스름돈을 받으면 맞는지 확인하면 좋을까요?',
              answer: 'O',
              feedback: '맞아요! 받은 돈은 그 자리에서 확인해요.',
            },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '거스름돈 계산을 AI한테 물어봐요. 아래 질문을 보내거나 🎤 를 눌러 말해보세요.',
          userInput: '1500원짜리 우유를 사고 2000원을 냈어. 거스름돈은 얼마야?',
          fallbackResponse: '2000 빼기 1500은 500! 거스름돈은 500원이에요. [happy]',
          allowFreeInput: true,
          systemInstruction: '너는 초등학생들을 위한 친절한 마트 점원 AI "아이미"야. 학생이 물건을 사고 낸 돈에 대해 거스름돈이 얼마인지 물어보고 있어. "00원 빼기 00원은 00원!"처럼 뺄셈 계산 과정을 설명해 주면서 거스름돈 금액을 100자 이하의 쉽고 다정한 한국어로 알려줘. 마지막에 꼭 [happy] 또는 [wink] 태그를 붙여줘.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '700원짜리 과자를 사고 1,000원을 냈어요. 거스름돈은요?',
          choices: [
            { label: '300원', isCorrect: true },
            { label: '700원', isCorrect: false },
            { label: '100원', isCorrect: false },
            { label: '1,000원', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '거스름돈 수호대',
          chapters: [
            {
              title: '1장: 거스름돈 수학 계산',
              goal: '거스름돈을 바르게 계산하여 우체통에 분류해 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'money_calc_sort',
                  prompt: '1000원짜리 과자를 사고 2000원을 냈을 때의 올바른 거스름돈 값을 구분하세요.',
                  bins: [
                    { label: '맞는 계산 결과', emoji: '🪙' },
                    { label: '틀린 계산 결과', emoji: '❌' }
                  ],
                  cards: [
                    { label: '남는 돈은 1,000원이다', emoji: '💵', bin: 0 },
                    { label: '남는 돈은 500원이다', emoji: '🪙', bin: 1 },
                    { label: '남는 돈은 1,500원이다', emoji: '❌', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 가게 거스름돈 대화',
              goal: '가게 점원에게 돈을 내고 거스름돈을 꼼꼼히 챙겨 대화하세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'money_calc_chat',
                  intro: '물건을 구매하며 거스름돈을 확인하는 가상 놀이 대화입니다.',
                  turns: [
                    {
                      aimi: '여깄습니다! 1,200원짜리 초콜릿을 사시면서 2,000원을 내주셨네요. 거스름돈 800원 여기 있습니다.',
                      choices: [
                        { label: '네, 감사합니다! 800원이 맞는지 그 자리에서 직접 세어 볼게요.', reply: '어머나! 정말 똑 부러지는군요. 돈을 지불하고 잔돈을 확인하는 습관은 경제생활에서 정말 중요해요!', good: true },
                        { label: '대충 주머니에 마구 쑤셔 넣을게요.', reply: '안 돼요! 나중에 손해를 볼 수 있으니 잔돈이 맞는지 꼭 자리를 떠나기 전에 눈으로 더해 보세요.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 계산서 확인',
              goal: '오늘 기록한 지불 카드를 검토하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l2',
                  title: '나의 지불 계산 영수증',
                  rows: [
                    { label: '내가 분류해 낸 잔돈', from: 'money_calc_sort' },
                    { label: '잔돈 확인 대화 결과', from: 'money_calc_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '경제박사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l3 ───────────────────────────
  {
    id: 'm6-l3',
    moduleId: 'm6',
    number: 3,
    kind: 'activity',
    title: '길을 찾아요',
    objective: '길을 모를 때 AI 지도의 도움을 받는 방법을 말할 수 있다.',
    standards: ['[12진로04-03] 집에서 직장까지 교통 수단을 활용하여 이동한다.'],
    bodyEasy: '길을 모르면 지도 앱이 알려줘요.',
    bodyNormal:
      '길을 모를 때 지도 앱에 가고 싶은 곳을 말하면 가는 길을 알려줘요. 지도 앱에도 AI가 들어 있어요.',
    wrapUpEasy: '길을 모르면 지도 앱한테 물어봐요.',
    wrapUpNormal: '가고 싶은 곳을 지도 앱에 말하면 길을 알려줘요. 그래도 모르겠으면 어른에게 도움을 청해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['지도', '위치 정보'], imagePlaceholder: true } },
      {
        kind: 'real-ai',
        data: {
          prompt: '지도 앱에 도서관 가는 길을 물어봐요. 아래 질문을 그대로 보내거나 🎤 를 눌러 말해봐요.',
          userInput: '여기서 도서관까지 어떻게 가?',
          fallbackResponse: '앞으로 쭉 걸어가다가 편의점에서 오른쪽으로 도세요. 걸어서 5분이면 도착해요! [happy]',
          allowFreeInput: true,
          systemInstruction: '너는 초등학생들을 위한 친절한 가상 지도 앱 AI "아이미"야. 학생이 특정 장소(예: 도서관, 공원 등)로 가는 길을 물어보고 있어. "앞으로 쭉 걸어가다가 편의점(혹은 큰 건물)에서 오른쪽으로 도세요"와 같이 100자 이하의 쉽고 다정한 한국어로 가상의 안전한 경로를 안내해줘. 꼭 마지막에 [happy] 또는 [cheer] 태그를 붙여줘.',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '길을 잃었어요. 가장 좋은 방법은요?',
          choices: [
            { label: '지도 앱을 보거나 가게 어른에게 물어봐요', isCorrect: true },
            { label: '아무 길로나 막 뛰어가요', isCorrect: false },
            { label: '모르는 사람 차를 타요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '지도 앱은 가는 길을 알려줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 시간이 얼마나 걸리는지도 알려줘요.',
            },
            {
              question: '길을 잃으면 모르는 사람을 무조건 따라가야 할까요?',
              answer: 'X',
              feedback: '안 돼요! 가게처럼 안전한 곳의 어른에게 물어봐요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '스마트 인간 네비게이션',
          chapters: [
            {
              title: '1장: 가고 싶은 경로 확인',
              goal: '지도 앱에 올바른 검색 목적지를 선택하세요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'map_destination',
                  prompt: '학교 앞 문방구에 갈 때, 지도 앱 검색창에 어떻게 치는 것이 검색이 가장 잘 될까요?',
                  items: [
                    { emoji: '🏫', label: '"우리 학교 정문 앞 사랑문방구"' },
                    { emoji: '❌', label: '"그냥 거기 장난감 많이 파는 삼촌네 가게"' }
                  ]
                }
              ]
            },
            {
              title: '2장: 길 잃었을 때 대처 대화',
              goal: '길을 잃어 낯선 길에 섰을 때의 대화 롤플레이를 합니다.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'map_lost_chat',
                  intro: '낯선 곳에서 길을 잃었을 때의 대처 대화입니다.',
                  turns: [
                    {
                      aimi: '어머나 꼬마야, 길을 잃어서 울고 있니? 아저씨가 맛있는 사탕 줄 테니까 아저씨 차 타고 같이 찾으러 갈래?',
                      choices: [
                        { label: '아니요, 모르는 분 차는 탈 수 없어요! 안전한 인근 가게에 들어가서 선생님께 전화할게요.', reply: '정말 대단하고 지혜로운 선택이에요! 낯선 사람의 호의는 정중히 거절하고, 큰 편의점이나 파출소에 들어가 도움을 청해야 안전하답니다.', good: true },
                        { label: '응! 사탕 고마워요. 태워주세요.', reply: '절대 안 돼요! 모르는 사람의 차는 타고 가면 위험에 처할 수 있으니 즉시 자리를 피해 근처 어른(경찰관, 점원)에게 알려야 해요.' }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 구출 계획서',
              goal: '도착 계획서를 최종 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l3',
                  title: '나의 길찾기 안심 일기',
                  rows: [
                    { label: '내가 입력할 목적지', from: 'map_destination' },
                    { label: '길 잃은 대화 대처', from: 'map_lost_chat' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '도착 대장 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l4 ───────────────────────────
  {
    id: 'm6-l4',
    moduleId: 'm6',
    number: 4,
    kind: 'activity',
    title: '버스와 지하철 타기',
    objective: '버스 타는 순서를 차례대로 말할 수 있다.',
    standards: [
      '[12진로04-03] 집에서 직장까지 교통 수단을 활용하여 이동한다.',
      '[9보건04-03] 교통사고의 위험 요인을 알고 사고 예방을 위한 안전 수칙을 실천한다.',
    ],
    bodyEasy: '버스 타는 순서를 배워요.',
    bodyNormal:
      '버스와 지하철을 타면 멀리까지 갈 수 있어요. 몇 번 버스를 타는지 AI 지도에 물어보고, 안전하게 타는 순서를 익혀요.',
    wrapUpEasy: '버스는 순서대로, 안전하게 타요.',
    wrapUpNormal: '몇 번 버스를 탈지 미리 확인하고, 줄 서서 타고, 자리에 앉거나 손잡이를 잡아요. 안전이 최고예요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['실시간 정보'], imagePlaceholder: true } },
      {
        kind: 'sequence',
        data: {
          instruction: '버스 타는 순서대로 눌러봐요!',
          items: [
            { label: '몇 번 버스인지 확인해요' },
            { label: '정류장에서 줄을 서서 기다려요' },
            { label: '카드를 찍고 타요' },
            { label: '손잡이를 잡거나 자리에 앉아요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI 지도한테 몇 번 버스를 타는지 물어봐요.',
          userInput: '시장에 가려면 몇 번 버스를 타야 해?',
          aiResponse: '3번 버스를 타면 돼요. 10분 뒤에 정류장에 도착한대요!',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '버스가 완전히 멈춘 다음에 타는 게 안전할까요?',
              answer: 'O',
              feedback: '맞아요! 버스가 멈춘 다음 차례대로 타요.',
            },
            {
              question: '버스 안에서 뛰어다녀도 될까요?',
              answer: 'X',
              feedback: '넘어질 수 있어요. 손잡이를 꼭 잡아요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '교통안전 보이스카우트',
          chapters: [
            {
              title: '1장: 교통 정거장 질서 정렬',
              goal: '안전한 승차와 위험한 승차 행동 카드를 분류하세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'traffic_safety_sort',
                  prompt: '버스를 이용할 때 지켜야 할 질서와 위반 행동을 알맞게 담아 보관하세요.',
                  bins: [
                    { label: '안전 질서 행동', emoji: '🛡️' },
                    { label: '피해 행동 (위험)', emoji: '❌' }
                  ],
                  cards: [
                    { label: '버스가 완전히 정차하고 문이 열리면 타기', emoji: '🚌', bin: 0 },
                    { label: '달려오는 버스 앞으로 무단 횡단하여 차 세우기', emoji: '⚡', bin: 1 },
                    { label: '버스 안에서 흔들릴 때 손잡이를 꽉 잡기', emoji: '✊', bin: 0 },
                    { label: '버스 창문 밖으로 내 양손과 머리 내밀기', emoji: '🖐️', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 승차 보고 수첩',
              goal: '정리된 승차 규칙 보고서를 최종 검사하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l4',
                  title: '대중교통 이용 계획표',
                  rows: [
                    { label: '내가 분류한 탑승 행위', from: 'traffic_safety_sort' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m6_l4',
                  template: '나 {이름}는 버스나 지하철을 탈 때 밀지 않고 차례를 {빈칸} 안전을 실천하겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '교통안전 지킴이 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l5 ───────────────────────────
  {
    id: 'm6-l5',
    moduleId: 'm6',
    number: 5,
    kind: 'experience',
    title: '오늘 날씨와 옷차림',
    objective: 'AI에게 날씨를 물어보고 알맞은 옷차림을 고를 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: 'AI한테 날씨를 물어보고 옷을 골라요.',
    bodyNormal:
      '나가기 전에 AI한테 날씨를 물어보면 우산이 필요한지, 두꺼운 옷이 필요한지 알 수 있어요.',
    wrapUpEasy: '나가기 전에 날씨를 물어보고 옷을 골라요.',
    wrapUpNormal: '나가기 전에 AI한테 날씨를 물어보는 습관을 길러요. 비가 오면 우산, 추우면 두꺼운 옷!',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['예보'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '비가 온대요. 무엇을 챙길까요?',
          choices: [
            { label: '우산', isCorrect: true },
            { label: '선글라스', isCorrect: false },
            { label: '부채', isCorrect: false },
            { label: '튜브', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 날씨에 맞는 옷차림을 물어봐요. 계절을 바꿔서 물어봐도 돼요!',
          userInput: '겨울에 밖에 나갈 때 뭘 입으면 좋아?',
          fallbackResponse: '겨울엔 두꺼운 외투와 목도리, 장갑이 좋아요. 손과 목을 따뜻하게 하면 덜 추워요!',
          allowFreeInput: true,
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '비 오는 날', right: '우산을 챙겨요' },
            { left: '추운 날', right: '두꺼운 옷을 입어요' },
            { left: '더운 날', right: '시원한 옷과 물을 챙겨요' },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '스마트 날씨 캐스터',
          chapters: [
            {
              title: '1장: 기후별 알맞은 착용 선택',
              goal: '날씨에 맞춘 소품과 옷을 구별해 우체통에 보관하세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'weather_gear_sort',
                  prompt: '비가 올 때 쓸 물건과, 한여름 쨍쨍한 무더운 날씨에 유용한 물건을 알맞은 보관함에 넣으세요.',
                  bins: [
                    { label: '비 오는 장마 날씨', emoji: '☔' },
                    { label: '한여름 쨍쨍 햇살', emoji: '☀️' }
                  ],
                  cards: [
                    { label: '비를 막아 주는 예쁜 우산과 장화', emoji: '👢', bin: 0 },
                    { label: '눈을 부시지 않게 돕는 선글라스', emoji: '🕶️', bin: 1 },
                    { label: '얼굴을 그늘지게 만드는 밀짚모자', emoji: '👒', bin: 1 },
                    { label: '몸이 젖지 않게 입는 투명 우비', emoji: '🧥', bin: 0 }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약 및 코디 드로잉',
              goal: '나의 패션 날씨 코디를 완성하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l5',
                  title: '나의 날씨 코디 계획표',
                  rows: [
                    { label: '내가 정리한 기상 패션', from: 'weather_gear_sort' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m6_l5',
                  prompt: '오늘 날씨 예보를 듣고, 밖에 외출할 때 입고 나갈 어울리는 내 옷차림을 그려 보세요.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '날씨 요정 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l6 ───────────────────────────
  {
    id: 'm6-l6',
    moduleId: 'm6',
    number: 6,
    kind: 'activity',
    title: '요리 도우미 AI',
    objective: 'AI의 도움을 받아 간단한 음식 만드는 순서를 익힐 수 있다.',
    standards: ['[9정통03-03] 가정생활에서 디지털 기술이 적용된 사례를 살펴보고 경험한다.'],
    bodyEasy: 'AI한테 만드는 법을 물어보고 샌드위치를 만들어요.',
    bodyNormal:
      '요리할 때 AI한테 만드는 순서를 물어보면 차례대로 알려줘요. 오늘은 샌드위치 만들기!',
    wrapUpEasy: 'AI한테 물어보고 순서대로 만들었어요.',
    wrapUpNormal: '요리도 순서예요. AI한테 만드는 법을 물어보고, 한 단계씩 따라 하면 돼요. 칼은 꼭 어른과 함께!',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['조리법', '순서'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 샌드위치 만드는 법을 물어봐요.',
          userInput: '샌드위치 만드는 법을 순서대로 알려줘',
          aiResponse: '① 식빵을 놓아요 ② 상추와 치즈, 햄을 올려요 ③ 식빵을 덮어요 ④ 반으로 잘라요. 자를 땐 어른과 함께!',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '샌드위치 만드는 순서대로 눌러봐요!',
          items: [
            { label: '식빵 한 장을 놓아요' },
            { label: '상추, 치즈, 햄을 올려요' },
            { label: '식빵으로 덮어요' },
            { label: '어른과 함께 반으로 잘라요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '칼을 쓸 때는 어른과 함께하는 게 안전할까요?',
              answer: 'O',
              feedback: '맞아요! 위험한 도구는 꼭 어른과 함께 써요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '안전 주방 요리사',
          chapters: [
            {
              title: '1장: 조리 도구 사용 판단',
              goal: '주방 도구를 쓸 때의 안전 기준을 판단하세요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'cook_safety_type',
                  prompt: '샌드위치를 만들고 빵을 자르기 위해 주방용 칼을 사용할 때 가장 올바른 행동은 무엇일까요?',
                  items: [
                    { emoji: '👩‍🍳', label: '반드시 곁의 부모님이나 학교 선생님께 칼을 써 달라고 도움을 청한다.' },
                    { emoji: '❌', label: '장난을 치며 내가 눈을 감고 칼을 마구 휘두른다.' }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약판',
              goal: '요리 안전 카드를 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l6',
                  title: '나의 주방 요리 안전장',
                  rows: [
                    { label: '내가 선택한 도구 수칙', from: 'cook_safety_type' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '꼬마 조리사 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l7 ───────────────────────────
  {
    id: 'm6-l7',
    moduleId: 'm6',
    number: 7,
    kind: 'activity',
    title: '하루 계획 세우기',
    objective: 'AI의 도움을 받아 하루 일과 계획을 세울 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: '오늘 할 일을 순서대로 계획해봐요.',
    bodyNormal:
      '하루를 계획하면 할 일을 잊지 않아요. AI한테 "오늘 계획 짜는 것 좀 도와줘" 하고 부탁할 수도 있어요.',
    wrapUpEasy: '하루 계획을 세우면 할 일을 잊지 않아요.',
    wrapUpNormal: '아침에 하루 계획을 세워봐요. 해야 할 일을 먼저, 놀이는 그 다음에 넣으면 하루가 잘 흘러가요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['계획', '루틴'], imagePlaceholder: true } },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI한테 하루 계획을 도와달라고 해봐요.',
          userInput: '학교 다녀와서 할 일 계획 좀 도와줘. 숙제가 있어.',
          aiResponse: '이런 순서는 어때요? ① 간식 먹고 쉬기 ② 숙제 하기 ③ 놀기 ④ 저녁 먹고 일찍 자기!',
        },
      },
      {
        kind: 'sequence',
        data: {
          instruction: '학교 다녀온 후! 좋은 순서대로 눌러봐요.',
          items: [
            { label: '간식을 먹고 잠깐 쉬어요' },
            { label: '숙제를 해요' },
            { label: '신나게 놀아요' },
            { label: '저녁 먹고 일찍 자요' },
          ],
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '계획을 세우면 할 일을 잊지 않을 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 계획은 하루의 지도예요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '스마트 계획 빌더',
          chapters: [
            {
              title: '1장: 일과 블록 조립',
              goal: '방과 후의 균형 잡힌 타임라인 블록을 조립하세요.',
              blocks: [
                {
                  kind: 'drag-build',
                  id: 'schedule_build',
                  prompt: '방과 후 시간을 유익하게 보낼 계획 조각을 알맞은 칸에 맞춰 끼우세요.',
                  slots: [
                    { label: '1단계 (필수 일과)' },
                    { label: '2단계 (자유 활동)' }
                  ],
                  pieces: [
                    { label: '학교 숙제와 알림장 먼저 확인하고 적기', slot: 0, quality: 'good' },
                    { label: '일단 끄고 무조건 잠자기', slot: 0, quality: 'weak' },
                    { label: '약속한 시간만큼 신나게 컴퓨터 하기', slot: 1, quality: 'good' },
                    { label: '학용품을 방바닥에 대충 어지르기', slot: 1, quality: 'weak' }
                  ],
                  response: {
                    good: '멋진 계획이에요! 오늘 숙제도 미리 끝내고 재밌게 놀 수도 있겠어요.',
                    weak: '계획을 보완해 봐요. 먼저 할 일을 해 놓으면 마음이 훨씬 홀가분해져요.'
                  }
                }
              ]
            },
            {
              title: '2장: 요약 확인',
              goal: '오늘 완성된 타임 테이블을 한눈에 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l7',
                  title: '나의 스마트 일일 계획장',
                  rows: [
                    { label: '내가 빌드한 일과 조각', from: 'schedule_build' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '계획왕 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l8 ───────────────────────────
  {
    id: 'm6-l8',
    moduleId: 'm6',
    number: 8,
    kind: 'concept',
    title: '아플 때는 어떻게?',
    objective: '아플 때 어른에게 알리고 도움을 받는 방법을 말할 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: '아프면 제일 먼저 어른에게 말해요.',
    bodyNormal:
      '아플 때 제일 중요한 건 어른에게 알리는 거예요. AI는 병원이 어디 있는지 찾는 걸 도와줄 수 있지만, 치료는 의사 선생님이 해요.',
    wrapUpEasy: '아프면 바로 어른에게 말해요.',
    wrapUpNormal: '아플 때는 먼저 어른에게 알려요. AI는 병원 위치를 찾아줄 수 있지만, 아픈 건 의사 선생님께 보여야 해요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['증상', '응급', '치료'], imagePlaceholder: true } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '많이 아프면 제일 먼저 어른에게 말해야 할까요?',
              answer: 'O',
              feedback: '맞아요! 어른에게 알리는 게 첫 번째예요.',
            },
            {
              question: 'AI가 의사 선생님 대신 치료해줄 수 있을까요?',
              answer: 'X',
              feedback: '치료는 의사 선생님만 할 수 있어요.',
            },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '가까운 병원을 AI한테 물어보는 모습을 봐요.',
          userInput: '여기서 가까운 병원이 어디야?',
          aiResponse: '걸어서 10분 거리에 튼튼소아과가 있어요. 아플 땐 꼭 어른과 함께 가세요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '배가 많이 아파요. 제일 먼저 뭘 할까요?',
          choices: [
            { label: '부모님이나 선생님께 말해요', isCorrect: true },
            { label: '혼자 꾹 참아요', isCorrect: false },
            { label: '아무 약이나 먹어요', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '병원 탐험과 의사 선생님',
          chapters: [
            {
              title: '1장: 병원 증상 분류함',
              goal: '내 몸이 아플 때 찾아갈 알맞은 전문 병원을 분류해 짝지어 보세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'hospital_sort',
                  prompt: '나타나는 몸의 증상 카드를 읽고 알맞은 병원 상자에 쏙쏙 넣어 보세요.',
                  bins: [
                    { label: '치과 병원 (이빨)', emoji: '🦷' },
                    { label: '안과 병원 (눈)', emoji: '👁️' }
                  ],
                  cards: [
                    { label: '사탕을 많이 먹어서 어금니가 쑤시고 아프다', emoji: '🦷', bin: 0 },
                    { label: '스마트폰을 너무 오래 봐서 눈이 빨갛고 눈물이 난다', emoji: '👁️', bin: 1 },
                    { label: '앞니가 흔들거려서 새로 뽑아야 한다', emoji: '🦷', bin: 0 },
                    { label: '멀리 있는 칠판 글씨가 흐릿하게 잘 안 보인다', emoji: '👓', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약판 및 다짐',
              goal: '나의 자가 수첩을 확인하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l8',
                  title: '나의 안심 건강 수첩',
                  rows: [
                    { label: '내가 분류한 아픈 증상', from: 'hospital_sort' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m6_l8',
                  template: '나 {이름}는 몸이 열이 나거나 아플 때는 숨기지 않고 즉시 {빈칸} 여쭈어보겠습니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '튼튼 어린이 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l9 ───────────────────────────
  {
    id: 'm6-l9',
    moduleId: 'm6',
    number: 9,
    kind: 'activity',
    title: '인사와 부탁의 말',
    objective: '상황에 맞는 인사말과 부탁하는 말을 사용할 수 있다.',
    standards: ['[9국어01-04] 대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.'],
    bodyEasy: '상황에 맞는 인사말을 연습해요.',
    bodyNormal:
      '가게에서, 버스에서, 병원에서 쓰는 인사말과 부탁의 말을 연습해요. AI랑 연습하면 실전에서 잘할 수 있어요.',
    wrapUpEasy: '"안녕하세요", "감사합니다"를 잘 쓰면 멋져요.',
    wrapUpNormal: '상황에 맞는 인사와 부탁의 말을 쓰면 어디서든 환영받아요. AI랑 미리 연습해두면 실전에서 술술 나와요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['소통'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '가게에 들어갈 때', right: '"안녕하세요"' },
            { left: '물건을 받을 때', right: '"감사합니다"' },
            { left: '부탁할 때', right: '"~해 주세요"' },
            { left: '실수했을 때', right: '"죄송합니다"' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: 'AI랑 가게 놀이를 해봐요. 물건을 달라고 부탁해볼게요.',
          userInput: '안녕하세요, 우유 하나 주세요.',
          aiResponse: '(가게 주인 역할) 네, 우유 여기 있어요. 1,500원입니다. 인사를 참 예쁘게 하시네요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '버스에서 내려야 하는데 문 앞에 사람이 있어요. 뭐라고 말할까요?',
          choices: [
            { label: '"잠시만요, 내릴게요"', isCorrect: true },
            { label: '(말없이 밀어요)', isCorrect: false },
            { label: '"비켜!"', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '멋쟁이 인사 예절단',
          chapters: [
            {
              title: '1장: 장소별 상황 매칭',
              goal: '상황에 맞춰 건네야 할 가장 알맞은 따뜻한 인사 대사를 고르세요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'greet_type',
                  prompt: '학교 교문에서 지키고 계시는 배움터 지킴이 아저씨나 교장 선생님을 마주했을 때 어떻게 인사해야 할까요?',
                  items: [
                    { emoji: '🙇', label: '허리를 바르게 숙이며 큰소리로 "안녕하세요!" 하고 웃으며 인사한다.' },
                    { emoji: '❌', label: '눈을 피하고 모른 척하며 다른 곳으로 뛰어간다.' }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약 보고',
              goal: '예절 카드를 최종 검증하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l9',
                  title: '나의 바른 생활 예절 카드',
                  rows: [
                    { label: '내가 선택한 인사 행동', from: 'greet_type' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '예절 지킴이 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l10 ───────────────────────────
  {
    id: 'm6-l10',
    moduleId: 'm6',
    number: 10,
    kind: 'concept',
    title: '여러 가지 직업 구경',
    objective: '여러 가지 직업과 하는 일을 짝지을 수 있다.',
    standards: [
      '[9진로02-02] 직업의 세계에 관심을 가지고 가족, 이웃 등 주변 사람들의 직업에 대하여 탐색한다.',
      '[12정통03-04] 디지털 사회에서의 다양한 직업을 탐색하고 체험한다.',
    ],
    bodyEasy: '세상에는 여러 가지 직업이 있어요. 구경해봐요.',
    bodyNormal:
      '세상에는 많은 직업이 있어요. 궁금한 직업이 있으면 AI한테 "그 직업은 무슨 일을 해?" 하고 물어봐요.',
    wrapUpEasy: '여러 직업을 구경했어요. 궁금하면 AI한테 물어봐요.',
    wrapUpNormal: '세상에는 다양한 직업이 있고, 저마다 하는 일이 달라요. 궁금한 직업은 AI한테 물어보며 탐색해봐요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['직업', '자동화'], imagePlaceholder: true } },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '요리사', right: '맛있는 음식을 만들어요' },
            { left: '운전기사', right: '버스나 트럭을 운전해요' },
            { left: '사서', right: '도서관에서 책을 관리해요' },
            { left: '농부', right: '채소와 과일을 길러요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '궁금한 직업을 AI한테 물어봐요.',
          userInput: '제빵사는 무슨 일을 해?',
          aiResponse: '제빵사는 빵과 케이크를 만드는 사람이에요. 새벽부터 반죽을 만들고, 오븐에 구워서 맛있는 빵을 완성해요!',
        },
      },
      {
        kind: 'card-pick',
        data: {
          question: '빵 만드는 일을 하는 사람은 누구일까요?',
          choices: [
            { label: '제빵사', isCorrect: true },
            { label: '소방관', isCorrect: false },
            { label: '수의사', isCorrect: false },
            { label: '화가', isCorrect: false },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '미래 직업 여행단',
          chapters: [
            {
              title: '1장: 직무와 도구 매칭',
              goal: '여러 직업과 그들이 일터에서 쓰는 도구 카드를 바르게 분류하세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'job_tool_sort',
                  prompt: '각 직업이 일을 완수하기 위해 꼭 다루어야 할 대표 도구 카드를 구분해서 넣어 보세요.',
                  bins: [
                    { label: '제빵사 (오븐)', emoji: '🍞' },
                    { label: '소방관 (소방호스)', emoji: '🚒' }
                  ],
                  cards: [
                    { label: '밀가루 반죽을 구워내는 뜨거운 전기 오븐', emoji: '🍞', bin: 0 },
                    { label: '불을 끄기 위해 강한 수압의 물을 뿜는 소방호스', emoji: '🚒', bin: 1 },
                    { label: '반죽을 밀어 모양을 둥글게 만드는 밀대', emoji: '🥖', bin: 0 },
                    { label: '머리와 몸을 안전하게 감싸는 방화 헬멧과 옷', emoji: '👨‍🚒', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 미래 직업 드로잉',
              goal: '나의 직업 소감을 요약하고 직접 그려 보세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l10',
                  title: '나의 관심 직업 분석서',
                  rows: [
                    { label: '내가 분류해 낸 직업 도구', from: 'job_tool_sort' }
                  ]
                },
                {
                  kind: 'draw',
                  id: 'draw_m6_l10',
                  prompt: '내가 어른이 되어 멋지게 활약하고 일하는 꿈속의 미래 직업 모습을 멋지게 그려 보세요.'
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '미래 인재 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l11 ───────────────────────────
  {
    id: 'm6-l11',
    moduleId: 'm6',
    number: 11,
    kind: 'experience',
    title: '나를 소개해요',
    objective: '자신의 이름(별명)과 좋아하는 것으로 자기소개를 할 수 있다.',
    standards: ['[9진로01-02] 흥미, 적성, 장점과 단점, 성격 등 자신의 특성을 파악하여 자신을 소개한다.'],
    bodyEasy: '내가 좋아하는 것으로 나를 소개해봐요.',
    bodyNormal:
      '"저는 그림 그리기를 좋아해요"처럼 나를 소개하는 연습을 해요. AI랑 연습하면 떨리지 않아요. 진짜 이름 대신 별명을 써요!',
    wrapUpEasy: '좋아하는 것으로 나를 소개할 수 있어요.',
    wrapUpNormal: '내가 좋아하는 것, 잘하는 것으로 나를 소개해봤어요. 연습할수록 자신 있게 말할 수 있어요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['소개', '자기소개', '고쳐 쓰기', '처음 쓴 글'], imagePlaceholder: true } },
      {
        kind: 'card-pick',
        data: {
          question: '자기소개에서 말하면 좋은 것은요? (개인정보는 빼고!)',
          choices: [
            { label: '좋아하는 것과 잘하는 것', isCorrect: true },
            { label: '우리 집 주소', isCorrect: false },
            { label: '부모님 전화번호', isCorrect: false },
          ],
        },
      },
      {
        kind: 'real-ai',
        data: {
          prompt: '진짜 AI한테 나를 소개해봐요. 진짜 이름 말고 별명으로! 좋아하는 걸로 바꿔 써도 돼요.',
          userInput: '나는 그림 그리기를 좋아해. 내 소개를 멋지게 한 문장으로 만들어줘.',
          fallbackResponse: '"안녕하세요! 저는 색연필만 있으면 세상을 그려내는 꼬마 화가입니다!" 어때요, 멋지죠? [cheer]',
          allowFreeInput: true,
          systemInstruction: '너의 이름은 "아이미"야. 너는 초등학생들을 위한 다정한 AI 친구야. 학생이 좋아하는 활동(예: 그림 그리기, 노래 부르기, 게임 등)을 말하면, 이를 바탕으로 자존감을 높여주는 멋진 한 문장 자기소개(예: "저는 색연필로 세상을 꾸미는 멋진 화가입니다!")를 작성해주고 칭찬을 건네줘. 100자 이하의 매우 다정하고 쉬운 한국어로 대답하고, 마지막에 [cheer] 또는 [happy] 태그를 붙여줘.',
        },
      },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: '자기소개를 연습하면 실전에서 덜 떨릴까요?',
              answer: 'O',
              feedback: '맞아요! 연습이 자신감을 만들어요.',
            },
            {
              question: 'AI한테 소개할 때 집 주소도 말해야 할까요?',
              answer: 'X',
              feedback: '개인정보는 빼고! 좋아하는 것만 말해요.',
            },
          ],
        },
      },
      {
        kind: 'mission',
        data: {
          title: '자신감 뿜뿜 자기소개',
          chapters: [
            {
              title: '1장: 자기소개 글감 선택',
              goal: '소개서에 말해도 유익하고 안전한 자랑거리를 고르세요.',
              blocks: [
                {
                  kind: 'single-pick',
                  id: 'self_intro_content',
                  prompt: '처음 만난 짝꿍이나 선생님께 나를 표현하기 위해 말할 가장 알맞고 안전한 글감은 무엇일까요?',
                  items: [
                    { emoji: '🎨', label: '"저는 팽이치기 게임을 잘하고, 도화지에 공룡 그림 그리는 걸 좋아해요!"' },
                    { emoji: '❌', label: '"우리 집의 신용카드 번호는 1234-5678 이고 비밀번호는..."' }
                  ]
                }
              ]
            },
            {
              title: '2장: 요약판',
              goal: '나의 자기소개 요소를 최종 검증하세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l11',
                  title: '나의 자신감 자기소개 카드',
                  rows: [
                    { label: '내가 선택한 자기소개 내용', from: 'self_intro_content' }
                  ]
                }
              ]
            }
          ],
          reward: {
            printable: 'worksheet',
            badgeLabel: '스피치 리더 배지 획득!'
          }
        }
      }
    ],
  },

  // ─────────────────────────── l12 ───────────────────────────
  {
    id: 'm6-l12',
    moduleId: 'm6',
    number: 12,
    kind: 'concept',
    title: 'AI와 함께하는 나의 생활 (마무리)',
    objective: '전체 과정에서 배운 AI 활용법을 생활 장면과 연결하여 말할 수 있다.',
    standards: ['[12정통02-04] 일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.'],
    bodyEasy: '지금까지 배운 것을 다 확인해봐요. 정말 잘했어요!',
    bodyNormal:
      '여섯 단원을 모두 배웠어요! AI가 뭔지, 어떻게 말 걸고, 안전하게 쓰고, 생활에서 활용하는지 — 마지막으로 확인해봐요.',
    wrapUpEasy: '전부 다 배웠어요! 이제 AI랑 똑똑하고 안전하게 지낼 수 있어요. 축하해요!',
    wrapUpNormal: '축하해요! AI 교과서를 끝까지 마쳤어요. AI를 알고, 잘 묻고, 안전하게 쓰고, 생활에 활용하는 힘 — 모두 여러분의 것이에요.',
    steps: [
      { kind: 'text', data: { dictionaryTerms: ['검산', '위치 정보', '계획', '도우미'] } },
      {
        kind: 'ox',
        data: {
          questions: [
            {
              question: 'AI는 우리 말을 알아듣고 대답해줄 수 있어요?',
              answer: 'O',
              feedback: '맞아요! 단원 1에서 배웠어요.',
            },
            {
              question: '개인정보는 AI한테 다 말해도 될까요?',
              answer: 'X',
              feedback: '개인정보는 지켜요! 단원 4에서 배웠어요.',
            },
            {
              question: '어려운 문제는 작게 나누면 풀기 쉬워질까요?',
              answer: 'O',
              feedback: '맞아요! 단원 5에서 배웠어요.',
            },
          ],
        },
      },
      {
        kind: 'matching',
        data: {
          pairs: [
            { left: '마트 갈 때', right: 'AI랑 장보기 목록을 만들어요' },
            { left: '길 모를 때', right: '지도 앱에 물어봐요' },
            { left: '나가기 전에', right: '날씨를 물어봐요' },
            { left: '요리할 때', right: '만드는 순서를 물어봐요' },
          ],
        },
      },
      {
        kind: 'sim-ai',
        data: {
          prompt: '끝까지 해낸 나에게 AI가 하고 싶은 말이 있대요!',
          userInput: '나 오늘 다 배웠어!',
          aiResponse: '정말 축하해요! 처음부터 끝까지 해낸 여러분이 자랑스러워요. 이제 AI를 똑똑하고 안전하게 쓸 수 있는 멋진 사람이 됐어요. 앞으로도 궁금한 게 있으면 언제든 물어봐 주세요!',
        },
      },
      {
        kind: 'mission',
        data: {
          title: 'AI 교과서 수료 졸업식',
          chapters: [
            {
              title: '1장: 6대 단원 명칭 분류',
              goal: '우리가 배운 6가지 인공지능 마법 열쇠를 바구니에 담으세요.',
              blocks: [
                {
                  kind: 'drag-sort',
                  id: 'entire_graduation_sort',
                  prompt: 'AI 교과서에서 공부한 핵심 가치 카드를 졸업 명예의 전당 바구니에 넣으세요.',
                  bins: [
                    { label: '우리가 지킨 소중한 가치', emoji: '🎓' },
                    { label: '버려야 할 나쁜 습관', emoji: '❌' }
                  ],
                  cards: [
                    { label: 'AI를 사용해 일상에서 길을 찾고 계획 세우기', emoji: '🚌', bin: 0 },
                    { label: '비밀번호와 집 주소 등 내 소중한 개인정보 지키기', emoji: '🔒', bin: 0 },
                    { label: '어려운 일감은 작게 쪼개어 하나씩 순차 해결하기', emoji: '📶', bin: 0 },
                    { label: '컴퓨터에 짜증 내고 욕설 마구 타자 쳐 보내기', emoji: '😡', bin: 1 },
                    { label: '스마트폰 사용 시간 끝나도 끄지 않고 떼쓰기', emoji: '🎮', bin: 1 }
                  ]
                }
              ]
            },
            {
              title: '2장: 졸업 임명 대화',
              goal: '이 책을 완전히 마친 꼬마 해결사의 우렁찬 졸업 선언을 들어보세요.',
              blocks: [
                {
                  kind: 'branch-chat',
                  id: 'entire_graduation_chat',
                  intro: '모든 과정을 졸업하는 축하 인사를 나눕니다.',
                  turns: [
                    {
                      aimi: '정말 대단해요! 6개 대단원의 AI 지식과 안전 수칙을 마침내 모두 배웠군요. 이제 똑똑하고 바른 디지털 어린이가 될 준비가 마쳤나요?',
                      choices: [
                        { label: '응! 배운 것을 잊지 않고 착하고 지혜로운 AI 친구가 될게.', reply: '감동이에요! 당신의 지혜로운 눈망울과 따뜻한 심성이 AI와 함께 더 큰 행복을 만들기를 응원할게요. 안녕!', good: true },
                        { label: '언제나 곁에서 안전과 시간 약속을 철저히 지킬게!', reply: '약속해 주어서 정말 든든해요. 당신은 이제 완전하고 멋진 디지털 세상의 당당한 주인공이랍니다. 축하해요!', good: true }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              title: '3장: 수료 수여식',
              goal: '이 책의 최종 학업 수료증 템플릿을 받으세요.',
              blocks: [
                {
                  kind: 'summary',
                  id: 'summary_m6_l12',
                  title: 'AI 교과서 최종 졸업장',
                  rows: [
                    { label: '내가 새겨 넣은 명예 행동', from: 'entire_graduation_sort' },
                    { label: '졸업 다짐 소감', from: 'entire_graduation_chat' }
                  ]
                },
                {
                  kind: 'vow',
                  id: 'vow_m6_l12',
                  template: '나 {이름}는 AI 교과서 전 과정을 훌륭히 마쳤으므로 {빈칸} 임명장을 드립니다!'
                }
              ]
            }
          ],
          reward: {
            printable: 'certificate',
            badgeLabel: 'AI 교과서 전과정 명예 수료증 획득!'
          }
        }
      }
    ],
  },
];
