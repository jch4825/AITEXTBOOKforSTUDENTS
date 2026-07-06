import type { DictionaryEntry } from '../types';

export const STUDENT_DICTIONARY: DictionaryEntry[] = [
  {
    term: '인공지능',
    aliases: ['AI', 'ai'],
    shortExplanation: '컴퓨터가 사람처럼 생각하고 답하게 만든 기술이에요.',
    example: '"오늘 날씨 어때?" 라고 물으면 답해주는 거예요.',
    ttsVersion: '인공지능은 컴퓨터가 사람처럼 생각하게 만든 거예요.',
  },
  {
    term: '컴퓨터',
    shortExplanation: '계산하고, 글이나 그림을 보여주는 기계예요.',
    ttsVersion: '컴퓨터는 계산하고 화면을 보여주는 기계예요.',
  },
  {
    term: '질문',
    shortExplanation: '모르는 걸 물어보는 말이에요.',
    example: '"이게 뭐예요?" 가 질문이에요.',
  },
  {
    term: '답',
    aliases: ['답변'],
    shortExplanation: '질문에 대해 알려주는 말이에요.',
  },
  {
    term: '안전',
    shortExplanation: '다치지 않고, 나쁜 일이 안 생기는 거예요.',
  },
  {
    term: '개인정보',
    shortExplanation: '내 이름, 나이, 집 주소처럼 나만의 정보예요. 함부로 알려주면 안 돼요.',
    ttsVersion: '개인정보는 내 이름과 집 주소처럼 나만의 정보예요. 함부로 알려주면 안 돼요.',
  },
  {
    term: '연습',
    shortExplanation: '여러 번 해보면서 잘 하게 되는 거예요.',
  },
  {
    term: '도움',
    shortExplanation: '잘 못하는 걸 누가 같이 해주는 거예요.',
  },
  {
    term: '기계',
    shortExplanation: '정해진 일을 반복해서 하는 물건이에요.',
    example: '토스터, 선풍기, 세탁기 같은 것들이에요.',
    ttsVersion: '기계는 정해진 일을 반복해서 하는 물건이에요.',
  },
  {
    term: '인식',
    shortExplanation: '보거나 듣고 "이게 뭔지" 알아보는 거예요.',
    example: 'AI가 사진 속 강아지를 보고 "강아지"라고 알아보는 거예요.',
  },
  {
    term: '음성',
    aliases: ['목소리'],
    shortExplanation: '사람이 말할 때 나는 소리예요.',
  },
  {
    term: '학습',
    shortExplanation: '보고 들으면서 배우는 거예요.',
    example: 'AI도 많은 예시를 보면서 학습해요.',
  },
  {
    term: '번역',
    shortExplanation: '한 나라 말을 다른 나라 말로 바꿔주는 거예요.',
    example: '"Hello"를 "안녕"으로 바꿔주는 거예요.',
  },
  {
    term: '챗봇',
    shortExplanation: '글로 대화해주는 AI예요.',
    example: '"오늘 날씨 어때?" 라고 글로 물으면 답해줘요.',
    ttsVersion: '챗봇은 글로 대화하는 AI예요.',
  },
  {
    term: '프롬프트',
    aliases: ['질문하기'],
    shortExplanation: 'AI한테 던지는 질문이나 부탁이에요.',
    example: '"짧게 설명해줘" 도 프롬프트예요.',
    ttsVersion: '프롬프트는 AI한테 던지는 질문이나 부탁이에요.',
  },
  {
    term: '역할',
    shortExplanation: '"이렇게 대해줘" 하고 정해주는 성격이에요.',
    example: '"친구처럼 말해줘" 하면 AI가 친구처럼 답해줘요.',
  },
  {
    term: '예시',
    aliases: ['보기'],
    shortExplanation: '"이런 식으로 해줘" 하고 보여주는 견본이에요.',
    example: '한 문장을 먼저 보여주면 AI가 비슷하게 만들어줘요.',
  },
  {
    term: '단계',
    shortExplanation: '큰 일을 작게 나눈 한 조각이에요.',
    example: '"1단계, 2단계로 알려줘" 라고 물어봐요.',
  },
  {
    term: '부탁',
    shortExplanation: '"이렇게 해줘요" 하고 예의 있게 말하는 거예요.',
  },
  // ─── 모듈 3 (AI랑 같이 배우기) 어휘 ───
  {
    term: '도우미',
    shortExplanation: '어려운 일을 옆에서 같이 해주는 사람이나 물건이에요.',
    example: 'AI는 공부를 도와주는 공부 도우미가 될 수 있어요.',
  },
  {
    term: '단어',
    shortExplanation: '뜻을 가진 말의 조각이에요.',
    example: '"사과", "학교"가 다 단어예요.',
  },
  {
    term: '낱말',
    shortExplanation: '단어와 같은 말이에요. 뜻을 가진 말 하나하나예요.',
  },
  {
    term: '설명',
    shortExplanation: '알기 쉽게 풀어서 말해주는 거예요.',
    example: '"쉽게 설명해줘" 하고 부탁할 수 있어요.',
  },
  {
    term: '계산',
    shortExplanation: '수를 더하거나 빼서 답을 구하는 거예요.',
    example: '1000원 더하기 1000원은 2000원 — 이게 계산이에요.',
  },
  {
    term: '요약',
    shortExplanation: '긴 글을 중요한 것만 남겨 짧게 만드는 거예요.',
    example: '"두 줄로 요약해줘" 하고 부탁할 수 있어요.',
    ttsVersion: '요약은 긴 글을 짧게 정리하는 거예요.',
  },
  {
    term: '퀴즈',
    shortExplanation: '재미있게 풀어보는 문제예요.',
    example: '"동물 퀴즈 내줘" 하면 AI가 문제를 내줘요.',
  },
  {
    term: '복습',
    shortExplanation: '배운 것을 한 번 더 보는 거예요. 복습하면 오래 기억나요.',
  },
  // ─── 모듈 4 (AI 안전하게 쓰기) 어휘 ───
  {
    term: '확인',
    shortExplanation: '맞는지 한 번 더 살펴보는 거예요.',
    example: 'AI의 답이 맞는지 선생님께 확인해요.',
  },
  {
    term: '정보',
    shortExplanation: '무언가에 대해 알려주는 내용이에요.',
    example: '"내일 비가 와요"도 하나의 정보예요.',
  },
  {
    term: '비밀번호',
    shortExplanation: '내 것을 지키는 비밀 숫자나 글자예요. 아무한테도 알려주지 않아요.',
    ttsVersion: '비밀번호는 내 것을 지키는 열쇠예요. 아무한테도 알려주지 않아요.',
  },
  {
    term: '예절',
    shortExplanation: '다른 사람을 기분 좋게 하는 바른 말과 행동이에요.',
    example: '"고맙습니다" 하고 인사하는 게 예절이에요.',
  },
  {
    term: '광고',
    shortExplanation: '물건을 팔려고 좋은 점을 크게 알리는 글이나 영상이에요.',
    example: '"100% 공짜!"라는 말은 광고일 수 있으니 조심해요.',
    ttsVersion: '광고는 물건을 팔려고 만든 글이에요. 다 믿지 말고 조심해요.',
  },
  // ─── 모듈 5 (AI로 문제해결하기) 어휘 ───
  {
    term: '문제',
    shortExplanation: '해결하고 싶은 일이에요.',
    example: '"길을 몰라요"도 하나의 문제예요.',
  },
  {
    term: '순서',
    shortExplanation: '먼저 하고 나중에 하는 차례예요.',
    example: '양말 먼저, 신발은 나중 — 이게 순서예요.',
  },
  {
    term: '힌트',
    shortExplanation: '답을 찾도록 살짝 도와주는 말이에요.',
    example: '"답 말고 힌트만 줘" 하고 부탁할 수 있어요.',
  },
  // ─── 모듈 6 (AI랑 일상생활) 어휘 ───
  {
    term: '목록',
    shortExplanation: '살 것이나 할 일을 차례로 적은 종이예요.',
    example: '마트 가기 전에 장보기 목록을 만들어요.',
  },
  {
    term: '거스름돈',
    shortExplanation: '돈을 더 냈을 때 돌려받는 돈이에요.',
    example: '1,000원을 내고 700원짜리를 사면 300원을 돌려받아요.',
    ttsVersion: '거스름돈은 돈을 더 냈을 때 돌려받는 돈이에요.',
  },
  {
    term: '계획',
    shortExplanation: '무엇을 언제 할지 미리 정하는 거예요.',
    example: '"숙제 먼저, 놀이는 나중에"도 계획이에요.',
  },
  {
    term: '직업',
    shortExplanation: '어른이 되어 하는 일이에요.',
    example: '요리사, 운전기사, 농부가 다 직업이에요.',
  },
  {
    term: '소개',
    shortExplanation: '나나 다른 것을 알려주는 말이에요.',
    example: '"저는 그림 그리기를 좋아해요"가 자기소개예요.',
  },
  // ─── 생활 속 기기·활동 어휘 ───
  {
    term: '음성비서',
    aliases: ['시리', '빅스비'],
    shortExplanation: '말로 부탁하면 도와주는 AI예요.',
    example: '"시리야, 알람 맞춰줘" 하고 말하면 돼요.',
  },
  {
    term: '스마트폰',
    aliases: ['핸드폰', '휴대폰'],
    shortExplanation: '전화도 하고 AI도 쓸 수 있는 작은 컴퓨터예요.',
  },
  {
    term: '마이크',
    shortExplanation: '내 목소리를 컴퓨터에 들려주는 기계예요.',
    example: '마이크 버튼을 누르고 말하면 AI가 들어요.',
  },
  {
    term: '인터넷',
    shortExplanation: '전 세계 컴퓨터가 서로 연결된 길이에요.',
    example: '인터넷이 있어야 AI랑 이야기할 수 있어요.',
  },
  {
    term: '검색',
    shortExplanation: '궁금한 것을 찾아보는 거예요.',
    example: '"기린"을 검색하면 기린에 대한 글이 나와요.',
  },
  {
    term: '지도',
    aliases: ['지도 앱'],
    shortExplanation: '길과 장소를 보여주는 그림이에요.',
    example: '지도 앱에 물어보면 가는 길을 알려줘요.',
  },
  {
    term: '반대말',
    shortExplanation: '뜻이 서로 반대인 말이에요.',
    example: '"크다"의 반대말은 "작다"예요.',
  },
  {
    term: '재료',
    shortExplanation: '무언가를 만들 때 필요한 것들이에요.',
    example: '샌드위치 재료는 식빵, 치즈, 햄이에요.',
  },
  {
    term: '영수증',
    shortExplanation: '무엇을 얼마에 샀는지 적힌 종이예요.',
    example: '계산하고 나면 영수증을 받아서 확인해요.',
  },
  {
    term: '정류장',
    shortExplanation: '버스를 타고 내리는 곳이에요.',
  },
  {
    term: '수수께끼',
    shortExplanation: '재치 있게 답을 맞히는 재미있는 문제예요.',
    example: '"눈이 오면 나타나는 사람은? 눈사람!"',
  },
  {
    term: '습관',
    shortExplanation: '자꾸 해서 몸에 밴 행동이에요.',
    example: '자기 전에 이를 닦는 것도 습관이에요.',
  },
];

function normalize(term: string): string {
  return term.trim().toLowerCase().normalize('NFKC');
}

export function findDictionaryEntry(query: string): DictionaryEntry | null {
  const q = normalize(query);
  if (!q) return null;
  for (const entry of STUDENT_DICTIONARY) {
    if (normalize(entry.term) === q) return entry;
    if (entry.aliases?.some(a => normalize(a) === q)) return entry;
  }
  return null;
}
