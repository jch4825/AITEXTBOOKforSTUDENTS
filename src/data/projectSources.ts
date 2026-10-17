/**
 * 이 교재의 자료 출처와 참고문헌.
 *
 * 교사 허브의 "이 교재에 대하여"(ProjectCredit) 아래와 README의 "자료 출처와 참고문헌"이 같은 내용을 쓴다.
 * 이 파일을 고치면 README도 함께 고친다. 학생 화면에는 밖으로 나가는 링크를 두지 않으므로 교사 허브에만 보인다.
 *
 * 참고문헌은 주소가 실제로 열리는지 확인한 것만 둔다(확인 날짜는 SOURCES_CHECKED).
 * 교재 문장을 옮겨 온 것이 아니라 개념 설명과 지도 방법을 정하고 대조할 때 참고한 자료다.
 */
export const SOURCES_CHECKED = '2026-10-17';

export interface MaterialSource {
  /** 무엇의 출처인지. */
  item: string;
  /** 누가·무엇으로 만들었는지. */
  origin: string;
  /** 어떤 조건으로 쓰는지. */
  terms: string;
  url?: string;
}

export const MATERIAL_SOURCES: MaterialSource[] = [
  {
    item: '이야기 그림(266장)과 그림 카드',
    origin: '저작자가 OpenAI의 이미지 생성 도구로 만들고 Google Flow로 다듬었습니다.',
    terms: '이 교재의 라이선스(CC BY-NC-SA 4.0)를 따릅니다.',
  },
  {
    item: '표지',
    origin: '저작자가 Google Stitch로 만들었습니다.',
    terms: '이 교재의 라이선스(CC BY-NC-SA 4.0)를 따릅니다.',
  },
  {
    item: '차시 도움 영상(1~4단원 40편)',
    origin: '저작자가 Google Notebook(구 NotebookLM)으로 만들어 유튜브 채널 "00학번ㅏ"에 올렸습니다.',
    terms: '학생 화면은 쿠키를 심지 않는 youtube-nocookie.com으로만 엽니다.',
    url: 'https://www.youtube.com/@00%ED%95%99%EB%B2%88',
  },
  {
    item: '효과음(9개)',
    origin: '저작자가 Humble Bundle로 구매했습니다.',
    terms: 'GameDev Market 표준 라이선스를 따릅니다. 앱 안에서만 쓰며 공개 저장소에 두지 않고, 꺼내 쓰거나 다시 배포할 수 없습니다.',
  },
  {
    item: '한글 글꼴 Pretendard',
    origin: '길형진(orioncactus)',
    terms: 'SIL Open Font License 1.1',
    url: 'https://github.com/orioncactus/pretendard',
  },
  {
    item: '놀이판 숫자·로마자 글꼴 Space Grotesk',
    origin: 'Florian Karsten, Google Fonts',
    terms: 'SIL Open Font License 1.1',
    url: 'https://fonts.google.com/specimen/Space+Grotesk',
  },
  {
    item: '아이콘 Material Symbols',
    origin: 'Google',
    terms: 'Apache License 2.0',
    url: 'https://fonts.google.com/icons',
  },
  {
    item: '교육과정 원문',
    origin: '교육부, 2022 개정 특수교육 교육과정(기본 교육과정). 저장소의 docs/reference/에 참고자료로 둡니다.',
    terms: '교육부 자료입니다. 이 교재의 라이선스에 포함되지 않습니다.',
  },
  {
    item: '교사 자료의 외부 도구 링크',
    origin: '각 기관·회사의 공식 사이트입니다. 차시마다 교사 자료 패널에 확인한 날짜와 함께 적었습니다.',
    terms: '각 사이트의 이용 약관을 따릅니다.',
  },
  {
    item: '프로그램 라이브러리',
    origin: 'React, Vite, Tailwind CSS, TypeScript',
    terms: '각각 MIT License 또는 Apache License 2.0을 따릅니다.',
  },
];

export interface Reference {
  /** 참고문헌 표기(저자, 연도, 제목, 실린 곳). */
  citation: string;
  url: string;
  /** 교재의 어느 부분에서 참고했는지. */
  usedFor: string;
}

export interface ReferenceGroup {
  title: string;
  items: Reference[];
}

export const REFERENCE_GROUPS: ReferenceGroup[] = [
  {
    title: '인공지능의 뜻과 원리',
    items: [
      {
        citation: 'IBM. What is artificial intelligence (AI)? IBM Think.',
        url: 'https://www.ibm.com/think/topics/artificial-intelligence',
        usedFor: '인공지능의 정의(사전의 AI_DEFINITION), 1단원',
      },
      {
        citation: 'IBM. What is machine learning? IBM Think.',
        url: 'https://www.ibm.com/think/topics/machine-learning',
        usedFor: '자료에서 비슷한 점을 찾는 원리, 1단원',
      },
      {
        citation: 'IBM. What are large language models (LLMs)? IBM Think.',
        url: 'https://www.ibm.com/think/topics/large-language-models',
        usedFor: '다음 낱말을 이어 답을 만드는 원리, 1단원 3차시',
      },
      {
        citation: 'IBM. What is computer vision? IBM Think.',
        url: 'https://www.ibm.com/think/topics/computer-vision',
        usedFor: '이미지 인식, 1단원 4차시',
      },
      {
        citation: 'IBM. What is speech recognition? IBM Think.',
        url: 'https://www.ibm.com/think/topics/speech-recognition',
        usedFor: '음성 인식과 합성, 1단원 5차시',
      },
      {
        citation: 'IBM. What is AI bias? IBM Think.',
        url: 'https://www.ibm.com/think/topics/ai-bias',
        usedFor: '데이터와 편향, 1단원 6차시',
      },
      {
        citation: 'IBM. What are AI hallucinations? IBM Think.',
        url: 'https://www.ibm.com/think/topics/ai-hallucinations',
        usedFor: 'AI가 틀린 말을 자신 있게 하는 일, 3·4단원',
      },
      {
        citation: 'IBM. What is a recommendation engine? IBM Think.',
        url: 'https://www.ibm.com/think/topics/recommendation-engine',
        usedFor: '추천의 원리, 4단원 10차시',
      },
      {
        citation: 'OECD (2019, 2024 개정). Recommendation of the Council on Artificial Intelligence (OECD/LEGAL/0449).',
        url: 'https://legalinstruments.oecd.org/en/instruments/OECD-LEGAL-0449',
        usedFor: '인공지능 시스템의 정의',
      },
      {
        citation: 'OECD.AI (2024). Updates to the OECD’s definition of an AI system explained.',
        url: 'https://oecd.ai/en/wonk/ai-system-definition-update',
        usedFor: '인공지능 시스템의 정의',
      },
    ],
  },
  {
    title: 'AI에게 묻고 대화하는 방법',
    items: [
      {
        citation: 'IBM. What is prompt engineering? IBM Think.',
        url: 'https://www.ibm.com/think/topics/prompt-engineering',
        usedFor: '정확하게 묻기와 프롬프트 조립, 2단원',
      },
      {
        citation: 'IBM. What is few shot prompting? IBM Think.',
        url: 'https://www.ibm.com/think/topics/few-shot-prompting',
        usedFor: '예시를 보여 주고 묻기, 2단원 4차시',
      },
      {
        citation: 'Brown, T. B., et al. (2020). Language models are few-shot learners. Advances in Neural Information Processing Systems, 33.',
        url: 'https://arxiv.org/abs/2005.14165',
        usedFor: '예시를 보여 주고 묻기, 2단원 4차시',
      },
      {
        citation: 'Wei, J., et al. (2022). Chain-of-thought prompting elicits reasoning in large language models. Advances in Neural Information Processing Systems, 35.',
        url: 'https://arxiv.org/abs/2201.11903',
        usedFor: '한 단계씩 나누어 묻기, 2단원 2차시',
      },
      {
        citation: 'Google. Prompt design strategies. Gemini API documentation.',
        url: 'https://ai.google.dev/gemini-api/docs/prompting-strategies',
        usedFor: '형식을 정해 묻기와 다시 묻기, 2단원',
      },
    ],
  },
  {
    title: 'AI 교육과 교육과정',
    items: [
      {
        citation: 'Miao, F., & Shiohira, K. (2024). AI competency framework for students. UNESCO. ISBN 978-92-3-100709-5.',
        url: 'https://www.unesco.org/en/articles/ai-competency-framework-students',
        usedFor: '단원 구성(사람 중심, 윤리, 기술과 활용), 4단원',
      },
      {
        citation: '교육부 (2022). 2022 개정 특수교육 교육과정: 기본 교육과정.',
        url: 'https://www.ncic.re.kr',
        usedFor: '성취기준과 성취수준, 교수·학습 및 평가의 방향',
      },
    ],
  },
  {
    title: '발달장애 학생 지도 방법',
    items: [
      {
        citation: 'Bondy, A. S., & Frost, L. A. (1994). The Picture Exchange Communication System. Focus on Autistic Behavior, 9(3), 1–19.',
        url: 'https://pecsusa.com/pecs/',
        usedFor: '그림 카드(PECS·AAC)로 고르기, 카드에 인쇄된 낱말과 화면 낱말의 일치',
      },
      {
        citation: 'Terrace, H. S. (1963). Discrimination learning with and without “errors”. Journal of the Experimental Analysis of Behavior, 6(1), 1–27.',
        url: 'https://doi.org/10.1901/jeab.1963.6-1',
        usedFor: '하 수준 학습지의 무오류 학습(흐린 자리에 겹쳐 붙이기)',
      },
      {
        citation: 'Inclusion Europe (2009). Information for all: European standards for making information easy to read and understand.',
        url: 'https://www.inclusion-europe.eu/easy-to-read-standards-guidelines/',
        usedFor: '쉬운 글 작성(짧은 문장, 한 문장에 한 생각, 이야기 대사 칸)',
      },
    ],
  },
];
