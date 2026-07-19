import type { DictionaryEntry } from '../types';

export const STUDENT_DICTIONARY: DictionaryEntry[] = [
  {
    term: '인공지능',
    aliases: ['AI', 'ai'],
    shortExplanation: '컴퓨터가 사람처럼 생각하고 답하게 만든 기술입니다.',
    example: '"오늘 날씨 어때?" 라고 물으면 답해주는 것입니다.',
    ttsVersion: '인공지능은 컴퓨터가 사람처럼 생각하게 만든 것입니다.',
  },
  {
    term: '컴퓨터',
    shortExplanation: '계산하고, 글이나 그림을 보여주는 기계입니다.',
    ttsVersion: '컴퓨터는 계산하고 화면을 보여주는 기계입니다.',
  },
  {
    term: '안전',
    shortExplanation: '다치지 않고, 나쁜 일이 안 생기는 것입니다.',
  },
  {
    term: '개인정보',
    shortExplanation: '내 이름, 나이, 집 주소처럼 나만의 정보입니다. 함부로 알려주면 안 됩니다.',
    ttsVersion: '개인정보는 내 이름과 집 주소처럼 나만의 정보입니다. 함부로 알려주면 안 됩니다.',
  },
  {
    term: '연습',
    shortExplanation: '여러 번 해보면서 잘 하게 되는 것입니다.',
  },
  {
    term: '도움',
    shortExplanation: '잘 못하는 걸 누가 같이 해주는 것입니다.',
  },
  {
    term: '기계',
    shortExplanation: '사람이 정해준 순서대로만 똑같이 움직이는 도구',
    example: '토스터, 선풍기, 세탁기 같은 것들입니다.',
    ttsVersion: '기계는 사람이 정해준 순서대로만 똑같이 움직이는 도구입니다.',
  },
  {
    term: '인식',
    shortExplanation: '보거나 듣고 "이게 뭔지" 알아보는 것입니다.',
    example: 'AI가 사진 속 강아지를 보고 "강아지"라고 알아보는 것입니다.',
  },
  {
    term: '음성',
    aliases: ['목소리'],
    shortExplanation: '사람이 말할 때 나는 소리입니다.',
  },
  {
    term: '학습',
    shortExplanation: '보고 들으면서 배우는 것입니다.',
    example: 'AI도 많은 예시를 보면서 학습합니다.',
  },
  {
    term: '번역',
    shortExplanation: '한 나라 말을 다른 나라 말로 바꿔주는 것입니다.',
    example: '"Hello"를 "안녕"으로 바꿔주는 것입니다.',
  },
  {
    term: '챗봇',
    shortExplanation: '글로 대화해주는 AI입니다.',
    example: '"오늘 날씨 어때?" 라고 글로 물으면 답해 주십시오.',
    ttsVersion: '챗봇은 글로 대화하는 AI입니다.',
  },
  {
    term: '프롬프트',
    aliases: ['질문하기'],
    shortExplanation: 'AI한테 던지는 질문이나 부탁입니다.',
    example: '"짧게 설명해 주십시오" 도 프롬프트입니다.',
    ttsVersion: '프롬프트는 AI한테 던지는 질문이나 부탁입니다.',
  },
  {
    term: '역할',
    shortExplanation: '"이렇게 대해 주십시오" 하고 정해주는 성격입니다.',
    example: '"친구처럼 말해 주십시오" 하면 AI가 친구처럼 답해 주십시오.',
  },
  {
    term: '예시',
    aliases: ['보기'],
    shortExplanation: '"이런 식으로 해 주십시오" 하고 보여주는 견본입니다.',
    example: '한 문장을 먼저 보여주면 AI가 비슷하게 만들어줍니다.',
  },
  {
    term: '단계',
    shortExplanation: '큰 일을 작게 나눈 한 조각입니다.',
    example: '"1단계, 2단계로 알려 주십시오" 라고 물어봅니다.',
  },
  {
    term: '부탁',
    shortExplanation: '"이렇게 해 주십시오" 하고 예의 있게 말하는 것입니다.',
  },
  // ─── 모듈 3 (AI랑 같이 배우기) 어휘 ───
  {
    term: '도우미',
    shortExplanation: '어려운 일을 옆에서 같이 해주는 사람이나 물건입니다.',
    example: 'AI는 공부를 도와주는 공부 도우미가 될 수 있습니다.',
  },
  {
    term: '단어',
    shortExplanation: '뜻을 가진 말의 조각입니다.',
    example: '"사과", "학교"가 다 단어입니다.',
  },
  {
    term: '낱말',
    shortExplanation: '단어와 같은 말입니다. 뜻을 가진 말 하나하나입니다.',
  },
  {
    term: '설명',
    shortExplanation: '알기 쉽게 풀어서 말해주는 것입니다.',
    example: '"쉽게 설명해 주십시오" 하고 부탁할 수 있습니다.',
  },
  {
    term: '계산',
    shortExplanation: '수를 더하거나 빼서 답을 구하는 것입니다.',
    example: '1000원 더하기 1000원은 2000원 — 이게 계산입니다.',
  },
  {
    term: '요약',
    shortExplanation: '긴 글을 중요한 것만 남겨 짧게 만드는 것입니다.',
    example: '"두 줄로 요약해 주십시오" 하고 부탁할 수 있습니다.',
    ttsVersion: '요약은 긴 글을 짧게 정리하는 것입니다.',
  },
  {
    term: '퀴즈',
    shortExplanation: '재미있게 풀어보는 문제입니다.',
    example: '"동물 퀴즈 내줘" 하면 AI가 문제를 내줍니다.',
  },
  {
    term: '복습',
    shortExplanation: '배운 것을 한 번 더 보는 것입니다. 복습하면 오래 기억납니다.',
  },
  // ─── 모듈 4 (AI 안전하게 쓰기) 어휘 ───
  {
    term: '확인',
    shortExplanation: '맞는지 한 번 더 살펴보는 것입니다.',
    example: 'AI의 답이 맞는지 선생님께 확인합니다.',
  },
  {
    term: '정보',
    shortExplanation: '무언가에 대해 알려주는 내용입니다.',
    example: '"내일 비가 옵니다"도 하나의 정보입니다.',
  },
  {
    term: '비밀번호',
    shortExplanation: '내 것을 지키는 비밀 숫자나 글자입니다. 아무한테도 알려주지 않습니다.',
    ttsVersion: '비밀번호는 내 것을 지키는 열쇠입니다. 아무한테도 알려주지 않습니다.',
  },
  {
    term: '예절',
    shortExplanation: '다른 사람을 기분 좋게 하는 바른 말과 행동입니다.',
    example: '"고맙습니다" 하고 인사하는 게 예절입니다.',
  },
  {
    term: '광고',
    shortExplanation: '물건을 팔려고 좋은 점을 크게 알리는 글이나 영상입니다.',
    example: '"100% 공짜!"라는 말은 광고일 수 있으니 조심합니다.',
    ttsVersion: '광고는 물건을 팔려고 만든 글입니다. 다 믿지 말고 조심합니다.',
  },
  // ─── 모듈 5 (AI로 문제해결하기) 어휘 ───
  {
    term: '문제',
    shortExplanation: '해결하고 싶은 일입니다.',
    example: '"길을 모릅니다"도 하나의 문제입니다.',
  },
  {
    term: '순서',
    shortExplanation: '먼저 하고 나중에 하는 차례입니다.',
    example: '양말 먼저, 신발은 나중 — 이게 순서입니다.',
  },
  {
    term: '힌트',
    shortExplanation: '답을 찾도록 살짝 도와주는 말입니다.',
    example: '"답 말고 힌트만 줘" 하고 부탁할 수 있습니다.',
  },
  // ─── 모듈 6 (AI랑 일상생활) 어휘 ───
  {
    term: '목록',
    shortExplanation: '살 것이나 할 일을 차례로 적은 종이입니다.',
    example: '마트 가기 전에 장보기 목록을 만듭니다.',
  },
  {
    term: '거스름돈',
    shortExplanation: '돈을 더 냈을 때 돌려받는 돈입니다.',
    example: '1,000원을 내고 700원짜리를 사면 300원을 돌려받습니다.',
    ttsVersion: '거스름돈은 돈을 더 냈을 때 돌려받는 돈입니다.',
  },
  {
    term: '계획',
    shortExplanation: '무엇을 언제 할지 미리 정하는 것입니다.',
    example: '"숙제 먼저, 놀이는 나중에"도 계획입니다.',
  },
  {
    term: '직업',
    shortExplanation: '어른이 되어 하는 일입니다.',
    example: '요리사, 운전기사, 농부가 다 직업입니다.',
  },
  {
    term: '소개',
    shortExplanation: '나나 다른 것을 알려주는 말입니다.',
    example: '"저는 그림 그리기를 좋아합니다"가 자기소개입니다.',
  },
  // ─── 생활 속 기기·활동 어휘 ───
  {
    term: '음성비서',
    aliases: ['시리', '빅스비', '음성 비서', '비서'],
    shortExplanation: '말로 부탁하면 도와주는 AI입니다.',
    example: '"시리야, 알람 맞춰줘" 하고 말하면 됩니다.',
  },
  {
    term: '스마트폰',
    aliases: ['핸드폰', '휴대폰'],
    shortExplanation: '전화도 하고 AI도 쓸 수 있는 작은 컴퓨터입니다.',
  },
  {
    term: '마이크',
    shortExplanation: '내 목소리를 컴퓨터에 들려주는 기계입니다.',
    example: '마이크 버튼을 누르고 말하면 AI가 들습니다.',
  },
  {
    term: '인터넷',
    shortExplanation: '전 세계 컴퓨터가 서로 연결된 길입니다.',
    example: '인터넷이 있어야 AI랑 이야기할 수 있습니다.',
  },
  {
    term: '검색',
    shortExplanation: '궁금한 것을 찾아보는 것입니다.',
    example: '"기린"을 검색하면 기린에 대한 글이 나옵니다.',
  },
  {
    term: '지도',
    aliases: ['지도 앱'],
    shortExplanation: '길과 장소를 보여주는 그림입니다.',
    example: '지도 앱에 물어보면 가는 길을 알려 주십시오.',
  },
  {
    term: '반대말',
    shortExplanation: '뜻이 서로 반대인 말입니다.',
    example: '"크다"의 반대말은 "작다"입니다.',
  },
  {
    term: '재료',
    shortExplanation: '무언가를 만들 때 필요한 것들입니다.',
    example: '샌드위치 재료는 식빵, 치즈, 햄입니다.',
  },
  {
    term: '영수증',
    shortExplanation: '무엇을 얼마에 샀는지 적힌 종이입니다.',
    example: '계산하고 나면 영수증을 받아서 확인합니다.',
  },
  {
    term: '정류장',
    shortExplanation: '버스를 타고 내리는 곳입니다.',
  },
  {
    term: '수수께끼',
    shortExplanation: '재치 있게 답을 맞히는 재미있는 문제입니다.',
    example: '"눈이 오면 나타나는 사람은? 눈사람!"',
  },
  {
    term: '습관',
    shortExplanation: '자꾸 해서 몸에 밴 행동입니다.',
    example: '자기 전에 이를 닦는 것도 습관입니다.',
  },
  // ─── 모듈 1 어려움(hard) 콘텐츠 신규 어휘 ───
  {
    term: '생성형 AI',
    shortExplanation: '배운 것을 바탕으로 새로운 글이나 그림을 만들어내는 AI입니다.',
    example: '이야기를 써 달라고 하면 새로운 이야기를 만들어 줍니다.',
  },
  {
    term: '학습 데이터',
    shortExplanation: 'AI가 배우려고 미리 모아 놓은 아주 많은 자료 묶음입니다.',
    example: '강아지 사진을 아주 많이 모으면 학습 데이터가 됩니다.',
  },
  {
    term: '음성 인식',
    shortExplanation: 'AI가 사람의 말소리를 듣고 글자로 바꾸는 것입니다.',
    example: '"알람 맞춰줘"라고 말하면 AI가 그 말을 알아듣습니다.',
  },
  {
    term: '이미지 인식',
    shortExplanation: 'AI가 사진이나 그림을 보고 무엇인지 알아내는 것입니다.',
    example: '사진을 보여주면 AI가 "이건 고양이입니다"라고 답합니다.',
  },
  {
    term: '환각',
    shortExplanation: 'AI가 그럴듯하지만 틀린 답을 자신 있게 말하는 것입니다.',
    example: 'AI가 없는 책 이름을 진짜처럼 말했습니다. 그래서 꼭 확인해야 합니다.',
  },
  {
    term: '자동화',
    shortExplanation: '사람이 정해준 순서대로만 똑같이 움직이는 것.',
    example: '세탁기는 버튼을 누르면 항상 같은 순서로 빨래를 합니다.',
  },
  {
    term: '예측',
    shortExplanation: 'AI가 다음에 올 말을 미리 짐작해서 고르는 것입니다.',
    example: '"오늘 날씨가" 다음에 "좋습니다" 같은 말을 골라습니다.',
  },
  {
    term: '훈련',
    shortExplanation: 'AI가 자료를 반복해서 보며 더 잘하게 되는 과정입니다.',
    example: '사진을 더 많이 훈련할수록 AI가 더 정확히 알아맞힙니다.',
  },
  {
    term: '패턴',
    shortExplanation: '여러 자료에서 자주 반복되는 모양이나 규칙입니다.',
    example: '고양이 사진마다 뾰족한 귀 모양이 자주 나오는 것도 패턴입니다.',
  },
  {
    term: '명령어',
    shortExplanation: 'AI한테 어떤 일을 하라고 시키는 정해진 말입니다.',
    example: '"타이머 시작"도 하나의 명령어입니다.',
  },
  {
    term: '감정',
    shortExplanation: '기쁨이나 슬픔처럼 마음으로 느끼는 것입니다. AI는 실제로 느끼지는 못합니다.',
    example: 'AI가 "슬퍼요"라고 답해도, 사람처럼 진짜 슬픔을 느끼는 건 아닙니다.',
  },
  {
    term: '최신 정보',
    shortExplanation: 'AI가 학습을 마친 뒤에 새로 생긴 정보입니다. AI는 이걸 모를 수 있습니다.',
    example: 'AI 학습이 끝난 다음에 일어난 일은 AI가 알지 못합니다.',
  },
  {
    term: '이미지 생성 AI',
    shortExplanation: '글로 설명하면 그 내용에 맞는 새로운 그림을 만들어주는 AI입니다.',
    example: '"파란 하늘 아래 강아지"라고 쓰면 그런 그림을 그려줍니다.',
  },
  // ─── 단원 1 기본 콘텐츠 개념어 확충 ───
  {
    term: '앱',
    aliases: ['어플', '애플리케이션'],
    shortExplanation: '스마트폰에서 한 가지 일을 하도록 만든 프로그램입니다.',
    example: '지도 앱, 번역 앱처럼 종류가 많습니다.',
  },
  {
    term: '프로그램',
    shortExplanation: '컴퓨터가 할 일을 미리 정해서 만든 것입니다.',
    example: 'AI도 사람이 만든 프로그램입니다.',
  },
  {
    term: '자료',
    shortExplanation: '배우거나 알아볼 때 쓰는 정보입니다.',
    example: 'AI는 아주 많은 자료를 보고 배웁니다.',
  },
  {
    term: '확률',
    shortExplanation: '어떤 일이 일어날 가능성을 나타낸 것입니다.',
    example: 'AI는 다음에 올 말을 확률로 골라습니다.',
  },
  {
    term: '특징',
    shortExplanation: '다른 것과 구별되는 그것만의 점입니다.',
    example: '기린의 특징은 목이 긴 것입니다.',
  },
  {
    term: '이미지',
    aliases: ['사진', '그림'],
    shortExplanation: '눈으로 보는 사진이나 그림입니다.',
    example: 'AI가 이미지를 보고 무엇인지 알아봅니다.',
  },
  {
    term: '원리',
    shortExplanation: '어떤 것이 그렇게 되는 기본 이치입니다.',
    example: 'AI가 답하는 원리를 알면 더 잘 쓸 수 있습니다.',
  },
  {
    term: '오인식',
    shortExplanation: 'AI가 잘못 알아보는 것입니다.',
    example: '고양이를 강아지로 잘못 아는 게 오인식입니다.',
  },
  {
    term: '가능성',
    shortExplanation: '어떤 일이 일어날 수 있는 정도입니다.',
    example: 'AI도 틀릴 가능성이 있습니다.',
  },
  {
    term: '판단',
    shortExplanation: '무엇이 맞는지 스스로 정하는 것입니다.',
    example: '마지막 판단은 내가 합니다.',
  },
  {
    term: '규칙',
    shortExplanation: '지켜야 할 정해진 약속입니다.',
    example: 'AI는 정해진 규칙대로 계산합니다.',
  },
  {
    term: '도구',
    shortExplanation: '어떤 일을 할 때 쓰는 물건입니다.',
    example: 'AI는 나를 도와주는 도구입니다.',
  },
  {
    term: '편향',
    shortExplanation: 'AI가 배운 자료가 한쪽으로 치우쳐서, 답도 치우치는 것입니다.',
    example: '한 종류 사진만 배우면 다른 것은 잘 못 알아봅니다.',
  },
  // ─── 모듈 2 어려움(hard) 콘텐츠 신규 어휘 ───
  {
    term: '지시',
    shortExplanation: '뭘 해달라고 정확하게 시키는 말입니다.',
    example: '"이름 세 개를 추천해 주십시오"가 지시입니다.',
  },
  {
    term: '간결',
    shortExplanation: '한 번에 하나만 부탁하는 것입니다.',
    example: '여러 개를 한꺼번에 시키지 않고 하나씩 물어봅니다.',
  },
  {
    term: '구체적',
    shortExplanation: '"그거" 대신 이름이나 숫자로 정확히 말하는 것입니다.',
    example: '"그 동물" 대신 "기린"이라고 말합니다.',
  },
  {
    term: '예시 제시',
    shortExplanation: '원하는 답 모양을 먼저 보여주는 것입니다.',
    example: '"이런 식으로 해 주십시오: 강아지가 뛰습니다"처럼입니다.',
  },
  {
    term: '역할 지정',
    shortExplanation: 'AI한테 "너는 ~라고 하자" 하고 역할을 정해주는 것입니다.',
    example: '"친절한 요리 선생님이라고 하자" 하면 그 말투로 답해 주십시오.',
  },
  {
    term: '단계 나누기',
    shortExplanation: '큰 질문을 작은 순서로 나눠 하나씩 물어보는 것입니다.',
    example: '"1단계로 재료 물어보고, 2단계로 순서 물어봅니다."',
  },
  {
    term: '반복 개선',
    shortExplanation: '답을 보고 다시 고쳐서 물어보는 것입니다.',
    example: '"너무 길어. 짧게 다시 해 주십시오" 하고 다시 부탁합니다.',
  },
  {
    term: '형식 지정',
    shortExplanation: '답을 어떤 길이나 모양으로 받을지 미리 정하는 것입니다.',
    example: '"세 줄로", "표로"처럼 정해서 부탁합니다.',
  },
  {
    term: '검증',
    shortExplanation: '답이 맞는지 확인하는 것입니다.',
    example: '이상한 답이 있으면 책이나 어른한테 확인합니다.',
  },
  // ─── 단원 2 기본 콘텐츠 개념어 확충 ───
  {
    term: '맥락',
    shortExplanation: '어떤 상황인지 알려주는 말입니다.',
    example: '"학교 발표회에서 쓸 것입니다"처럼 상황을 알려 주십시오.',
  },
  {
    term: '형식',
    shortExplanation: '답을 어떤 모양으로 받고 싶은지 정하는 것입니다.',
    example: '"표로 보여줘"라고 하면 형식을 정하는 것입니다.',
  },
  {
    term: '요소',
    shortExplanation: '무언가를 이루는 하나하나의 부분입니다.',
    example: '좋은 프롬프트에는 지시, 맥락, 형식이라는 세 요소가 들어갑니다.',
  },
  {
    term: '애매',
    shortExplanation: '무슨 뜻인지 정확히 알기 어려운 것입니다.',
    example: '"그거 좀 해 주십시오"는 애매해서 AI가 헷갈렸습니다.',
  },
  {
    term: '분위기',
    shortExplanation: '말이나 글에서 느껴지는 느낌입니다.',
    example: '"친절하게 말해 주십시오"라고 하면 부드러운 분위기가 됩니다.',
  },
  {
    term: '흐름',
    shortExplanation: '일이 이어지는 차례입니다.',
    example: '순서대로 물어보면 이야기의 흐름을 따라가기 쉽습니다.',
  },
  {
    term: '말투',
    shortExplanation: '말을 할 때 나오는 느낌이나 버릇입니다.',
    example: '"친구처럼 말해 주십시오" 하면 편안한 말투로 답해 주십시오.',
  },
  // ─── 모듈 3 어려움(hard) 콘텐츠 신규 어휘 ───
  {
    term: '정의',
    shortExplanation: '어떤 말의 뜻을 콕 집어 설명한 문장입니다.',
    example: '"친구"의 정의는 "가깝게 지내며 정을 나누는 사람"입니다.',
  },
  {
    term: '난이도 조절',
    shortExplanation: '내 수준에 맞게 설명을 쉽거나 어렵게 바꾸는 것입니다.',
    example: '"10살도 알아듣게 설명해 주십시오" 하면 더 쉬워져습니다.',
  },
  {
    term: '예문',
    shortExplanation: '낱말을 넣어서 만든 문장입니다.',
    example: '"행복"의 예문은 "나는 오늘 행복합니다"입니다.',
  },
  {
    term: '창작',
    shortExplanation: '새로운 이야기를 스스로 지어내는 것입니다.',
    example: '없던 이야기를 처음 만드는 것도 창작입니다.',
  },
  {
    term: '검산',
    shortExplanation: '계산을 다시 한번 해서 확인하는 것입니다.',
    example: '계산기로 검산하면 실수를 찾을 수 있습니다.',
  },
  {
    term: '핵심',
    shortExplanation: '가장 중요한 부분입니다.',
    example: '이야기의 핵심은 "주인공이 무엇을 배웠는가"입니다.',
  },
  {
    term: '문제 생성',
    shortExplanation: 'AI한테 문제를 만들어 달라고 부탁하는 것입니다.',
    example: '"동물 퀴즈 세 개 내줘" 하면 AI가 문제를 만들어줍니다.',
  },
  {
    term: '이미지 설명',
    shortExplanation: '그림을 보고 무엇인지 글로 설명하는 것입니다.',
    example: '강아지 사진을 보여주면 AI가 "갈색 강아지가 앉아 있습니다"라고 말해 주십시오.',
  },
  {
    term: '표절',
    shortExplanation: '다른 사람이나 AI가 쓴 글을 그대로 베껴서 내 것처럼 내는 것입니다. 하면 안 됩니다.',
    example: 'AI가 써준 글을 그대로 숙제로 내면 표절입니다. 내 말로 다시 써야 합니다.',
    ttsVersion: '표절은 남이 쓴 글을 그대로 베껴서 내 것처럼 내는 것입니다. 숙제는 내가 직접 써야 합니다.',
  },
  // ─── 단원 3 기본 콘텐츠 개념어 확충 ───
  {
    term: '열린 질문',
    shortExplanation: '"왜?"나 "어떻게?"로 시작해서 예/아니오로 끝나지 않는 질문입니다.',
    example: '"이게 맞아?" 대신 "왜 이게 맞습니까?"라고 물어봅니다.',
  },
  {
    term: '아이디어',
    shortExplanation: '새롭게 떠오른 생각입니다.',
    example: '"우주에 사는 고양이"도 하나의 아이디어입니다.',
  },
  {
    term: '계산기',
    shortExplanation: '정확한 계산을 해주는 도구입니다.',
    example: '358 더하기 247은 계산기로 확인합니다.',
  },
  {
    term: '비교',
    shortExplanation: '두 가지를 나란히 놓고 같은지 다른지 살펴보는 것입니다.',
    example: 'AI의 설명과 사전 뜻을 비교해서 확인합니다.',
  },
  {
    term: '정확도',
    shortExplanation: '얼마나 정확한지 나타내는 정도입니다.',
    example: '쉽게 설명해달라고 하면 정확도가 조금 낮아질 수 있습니다.',
  },
  // ─── 모듈 4 어려움(hard) 콘텐츠 신규 어휘 ───
  {
    term: '오답',
    shortExplanation: '사실과 다른, 틀린 답입니다.',
    example: '"세종대왕이 컴퓨터를 만들었다"는 오답입니다.',
  },
  {
    term: '사실 확인',
    shortExplanation: '정보가 진짜인지 여러 방법으로 알아보는 것입니다.',
    example: '같은 내용을 책에서도 찾아보는 게 사실 확인입니다.',
  },
  {
    term: '출처',
    shortExplanation: '정보가 어디서 나왔는지 알려주는 근것입니다.',
    example: '"학교 교과서에서 봤습니다"가 출처를 밝히는 것입니다.',
  },
  {
    term: '계정',
    shortExplanation: '이름과 비밀번호로 나만 들어갈 수 있는 인터넷 공간입니다.',
    example: '게임이나 앱에 로그인할 때 계정이 필요합니다.',
  },
  {
    term: '초상권',
    shortExplanation: '내 얼굴 사진이 함부로 쓰이지 않도록 지키는 권리입니다.',
    example: '허락 없이 내 사진을 퍼뜨리면 안 됩니다.',
    ttsVersion: '초상권은 내 얼굴 사진이 함부로 쓰이지 않도록 지키는 권리입니다.',
  },
  {
    term: '유해 콘텐츠',
    shortExplanation: '보면 마음이 불편해지거나 무서워지는 나쁜 내용입니다. 만나도 내 잘못이 아닙니다.',
    example: '무섭거나 나쁜 말이 나오면 유해 콘텐츠입니다.',
    ttsVersion: '유해 콘텐츠는 보면 마음이 불편해지는 나쁜 내용입니다. 만나도 내 잘못이 아니니 어른에게 알립니다.',
  },
  {
    term: '신고',
    shortExplanation: '나쁜 내용을 어른에게 알리는 것입니다.',
    example: '이상한 화면을 캡처해서 선생님께 보여주는 것도 신고입니다.',
    ttsVersion: '신고는 나쁜 내용을 어른에게 알리는 것입니다. 알리는 건 용감한 행동입니다.',
  },
  {
    term: '과의존',
    shortExplanation: '스마트폰이나 AI를 너무 자주, 너무 오래 의지하게 되는 것입니다.',
    example: '자기 전까지 계속 화면을 보는 것도 과의존의 신호입니다.',
  },
  {
    term: '도움 요청',
    shortExplanation: '혼자 해결하기 어려운 일을 어른에게 말하는 것입니다.',
    example: '"모르는 사람이 만나자고 합니다"라고 말하는 것도 도움 요청입니다.',
    ttsVersion: '도움 요청은 어른에게 말하는 것입니다. 도움을 요청하는 건 용감한 행동입니다.',
  },
  {
    term: '추천 알고리즘',
    shortExplanation: '내가 좋아할 만한 것을 골라 보여주는 AI 방식입니다.',
    example: '영상 하나를 오래 보면 비슷한 영상을 계속 추천해 주십시오.',
  },
  // ─── 단원 4 기본 콘텐츠 개념어 확충 ───
  {
    term: '설계',
    shortExplanation: '어떤 목적에 맞게 미리 짜 놓는 것입니다.',
    example: '추천 화면은 계속 보게 만들도록 설계되어 있습니다.',
  },
  {
    term: '권리',
    shortExplanation: '마땅히 누려야 할 나의 몫입니다.',
    example: '초상권은 내 사진을 지키는 권리입니다.',
  },
  {
    term: '서버',
    shortExplanation: '정보를 모아 두고 관리하는 큰 컴퓨터입니다.',
    example: '내가 보낸 정보는 AI 회사의 서버에 남을 수 있습니다.',
  },
  {
    term: '체크리스트',
    shortExplanation: '확인할 것들을 적어 놓은 목록입니다.',
    example: '개인정보가 들어 있는지 체크리스트로 확인합니다.',
  },
  {
    term: '캡처',
    shortExplanation: '화면에 보이는 것을 사진처럼 저장하는 것입니다.',
    example: '이상한 화면을 캡처해서 어른에게 보여줍니다.',
  },
  {
    term: '표시',
    shortExplanation: '무엇인지 알 수 있게 붙여 놓은 글자나 그림입니다.',
    example: '광고에는 작게 "광고"라는 표시가 붙어 있습니다.',
  },
  // ─── 모듈 5 어려움(hard) 콘텐츠 신규 어휘 ───
  {
    term: '목표',
    shortExplanation: '내가 이루고 싶은 것입니다.',
    example: '"방을 깨끗하게 만들고 싶다"가 목표입니다.',
  },
  {
    term: '분해',
    shortExplanation: '큰 문제를 작은 일들로 나누는 것입니다.',
    example: '"방 정리하기"를 "장난감 정리", "책 정리", "옷 정리"로 나눠습니다.',
  },
  {
    term: '절차',
    shortExplanation: '일을 하는 정해진 차례입니다.',
    example: '재료 준비 → 요리 → 정리, 이게 절차입니다.',
  },
  {
    term: '우선순위',
    shortExplanation: '더 중요한 것을 먼저 하는 것입니다.',
    example: '숙제와 놀이 중에 숙제를 먼저 하기로 정하는 것입니다.',
  },
  {
    term: '명확화',
    shortExplanation: '뜻을 더 분명하게 다시 말하는 것입니다.',
    example: '"그거 알려 주십시오" 대신 "라면 끓이는 순서를 알려 주십시오"라고 다시 말합니다.',
  },
  {
    term: '단계별 지시',
    shortExplanation: '한 번에 하나씩 순서대로 시키는 것입니다.',
    example: '"먼저 1단계만 알려 주십시오, 끝나면 다음 단계 알려 주십시오"라고 부탁합니다.',
  },
  {
    term: '평가',
    shortExplanation: '결과가 좋은지 따져보는 것입니다.',
    example: '방을 정리한 뒤 정말 깨끗해졌는지 따져보는 게 평가입니다.',
  },
  {
    term: '대안',
    shortExplanation: '문제를 푸는 또 다른 방법입니다.',
    example: '학교 갈 때 버스 말고 걸어가는 것도 대안입니다.',
  },
  {
    term: '오류',
    shortExplanation: '잘못되거나 틀린 부분입니다.',
    example: '순서를 거꾸로 적은 것도 오류입니다.',
  },
  {
    term: '수정',
    shortExplanation: '틀린 곳을 고치는 것입니다.',
    example: '거꾸로 적은 순서를 바로 고치는 게 수정입니다.',
  },
  // ─── 단원 5 기본 콘텐츠 개념어 확충 ───
  {
    term: '상태',
    shortExplanation: '지금 어떤 모습인지를 말합니다.',
    example: '"방이 어지러운 상태"처럼 지금 모습을 말합니다.',
  },
  {
    term: '결과',
    shortExplanation: '어떤 일을 하고 난 뒤에 나온 것입니다.',
    example: '방 정리를 한 결과 방이 깨끗해졌습니다.',
  },
  {
    term: '차이',
    shortExplanation: '서로 다른 정도입니다.',
    example: '바라는 것과 지금 상태의 차이가 바로 문제입니다.',
  },
  // ─── 모듈 6 어려움(hard) 콘텐츠 신규 어휘 ───
  {
    term: '예산',
    shortExplanation: '쓸 수 있는 돈의 한계입니다.',
    example: '"오늘 예산은 5,000원입니다"라고 정해두면 돈을 아껴 씁니다.',
  },
  {
    term: '위치 정보',
    shortExplanation: '내가 지금 어디 있는지 알려주는 정보입니다.',
    example: '지도 앱은 위치 정보로 길을 알려 주십시오. 아무에게나 알리지 않습니다.',
    ttsVersion: '위치 정보는 내가 지금 어디 있는지 알려주는 정보입니다. 아무에게나 알리지 않습니다.',
  },
  {
    term: '실시간 정보',
    shortExplanation: '지금 이 순간의 정보입니다.',
    example: '"버스가 5분 뒤에 옵니다"가 실시간 정보입니다.',
  },
  {
    term: '예보',
    shortExplanation: '날씨가 어떨지 미리 알려주는 것입니다.',
    example: '"내일은 비가 온대요"가 날씨 예보입니다.',
  },
  {
    term: '조리법',
    shortExplanation: '요리하는 방법과 차례입니다.',
    example: 'AI한테 조리법을 물어보고 순서대로 만듭니다.',
  },
  {
    term: '루틴',
    shortExplanation: '매일 반복하는 정해진 순서입니다.',
    example: '아침에 일어나서 씻고 밥 먹는 것도 루틴입니다.',
  },
  {
    term: '증상',
    shortExplanation: '아플 때 몸에 나타나는 것입니다.',
    example: '열이 나거나 배가 아픈 게 증상입니다.',
  },
  {
    term: '응급',
    shortExplanation: '빨리 도움이 필요한 급한 상황입니다.',
    example: '갑자기 많이 아프면 바로 어른에게 알립니다.',
    ttsVersion: '응급은 빨리 도움이 필요한 급한 상황입니다. 아프면 어른에게 먼저 알립니다.',
  },
  {
    term: '소통',
    shortExplanation: '서로 마음과 뜻을 주고받는 것입니다.',
    example: '고마운 마음을 말로 전하는 것도 소통입니다.',
  },
  {
    term: '자기소개',
    shortExplanation: '나를 남에게 알리는 말입니다.',
    example: '"저는 그림 그리기를 좋아합니다"가 자기소개입니다.',
  },
  {
    term: '퇴고',
    shortExplanation: '쓴 글을 다시 고치는 것입니다.',
    example: 'AI한테 고칠 점을 물어보고 내가 직접 고칩니다.',
  },
  // ─── 단원 6 기본 콘텐츠 개념어 확충 ───
  {
    term: '사정',
    shortExplanation: '어떤 일이 그렇게 된 형편이나 까닭입니다.',
    example: 'AI는 우리 집 냉장고 사정을 모릅니다.',
  },
  {
    term: '경로',
    shortExplanation: '목적지까지 가는 길입니다.',
    example: '지도 앱이 알려준 경로를 따라갑니다.',
  },
  {
    term: '목적지',
    shortExplanation: '내가 가려고 하는 곳입니다.',
    example: '지도 앱에 목적지를 말하면 가는 길을 알려 주십시오.',
  },
  {
    term: '안내판',
    shortExplanation: '정류장이나 역에서 정보를 알려주는 판입니다.',
    example: '버스 도착 시간은 정류장 안내판에서도 확인합니다.',
  },
  {
    term: '진찰',
    shortExplanation: '의사가 아픈 곳을 살펴보는 것입니다.',
    example: '진짜 진찰은 AI가 아니라 병원에서 받습니다.',
  },
  {
    term: '치료',
    shortExplanation: '아픈 곳을 낫게 하는 것입니다.',
    example: '병원에서 치료를 받아야 나을 수 있습니다.',
  },
  {
    term: '초안',
    shortExplanation: '처음으로 써 본 글입니다.',
    example: '자기소개 초안을 쓰고 나서 고칩니다.',
  },
  {
    term: '의견',
    shortExplanation: '어떤 것에 대한 생각입니다.',
    example: 'AI의 의견을 참고해서 내가 직접 고칩니다.',
  },
  {
    term: '방대하다',
    aliases: ['방대한'],
    shortExplanation: '아주 많고 넓은 것입니다.',
    example: '인공지능은 방대한 자료를 공부해서 똑똑해집니다.',
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
