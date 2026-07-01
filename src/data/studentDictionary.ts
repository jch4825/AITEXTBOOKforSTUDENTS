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
