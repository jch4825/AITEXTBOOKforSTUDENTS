import type { LucideIcon } from 'lucide-react';
import { BookOpen, MessageSquare, Layout, ClipboardList, Shield, FileText } from 'lucide-react';

export interface ResourceItem {
  id: string;
  title: string;
  url?: string;
  description?: string;
}

export interface ResourceSubCategory {
  id: string;
  label: string;
  iconEmoji: string;
  items: ResourceItem[];
}

export interface ResourceCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  subCategories: ResourceSubCategory[];
}

export const resourceCategories: ResourceCategory[] = [
  {
    id: 'ai-basics',
    title: 'AI 기초 자료',
    subtitle: '주요 AI 서비스 바로가기 모음',
    icon: BookOpen,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    subCategories: [
      {
        id: 'ai-chat',
        label: '1. 대화형 AI',
        iconEmoji: '💬',
        items: [
          { id: 'ai-1-1', title: 'ChatGPT', url: 'https://chatgpt.com', description: 'OpenAI의 대화형 AI. GPT-4o 기반의 범용 AI 어시스턴트' },
          { id: 'ai-1-2', title: 'Gemini', url: 'https://gemini.google.com', description: 'Google의 대화형 AI. 구글 서비스·드라이브 연동에 강점' },
          { id: 'ai-1-3', title: 'Claude', url: 'https://claude.ai', description: 'Anthropic의 대화형 AI. 긴 문서 분석과 안전성·정확성에 강점' },
          { id: 'ai-1-4', title: 'Grok', url: 'https://grok.com', description: 'xAI(일론 머스크)의 AI. X(트위터) 실시간 데이터 연동' },
          { id: 'ai-1-5', title: 'Perplexity', url: 'https://www.perplexity.ai', description: '실시간 웹 검색 기반 AI 검색 엔진. 출처를 함께 제공' },
          { id: 'ai-1-6', title: '젠스파크 (Genspark)', url: 'https://www.genspark.ai', description: '멀티 AI 에이전트 기반 검색·정리 도구. 복잡한 주제를 자동 요약' },
        ],
      },
      {
        id: 'ai-google',
        label: '2. Google AI 도구',
        iconEmoji: '🔬',
        items: [
          { id: 'ai-2-1', title: 'Google AI Studio', url: 'https://aistudio.google.com', description: 'Gemini API를 무료로 테스트하고 키를 발급받는 구글 공식 개발자 도구' },
          { id: 'ai-2-2', title: 'Google Colab', url: 'https://colab.research.google.com', description: '브라우저에서 Python 코드를 실행하는 무료 클라우드 노트북. GPU 무료 제공' },
          { id: 'ai-2-3', title: 'Google Vids', url: 'https://workspace.google.com/products/vids/', description: 'Google Workspace의 AI 영상 제작 도구. 텍스트로 영상 슬라이드 자동 생성' },
          { id: 'ai-2-4', title: 'Google Flow', url: 'https://flow.google.com', description: 'Google의 AI 영화 제작 도구. Veo 2 기반으로 고품질 영상 생성' },
          { id: 'ai-2-5', title: 'Antigravity', url: 'https://antigravity.google/', description: 'Google의 전문가용 바이브코딩 도구' },
          { id: 'ai-2-6', title: 'NotebookLM', url: 'https://notebooklm.google.com', description: '문서·PDF를 업로드하면 AI가 요약·질의응답해 주는 구글의 AI 노트 도구' },
        ],
      },
      {
        id: 'ai-local',
        label: '3. 나만의 로컬 인공지능 스튜디오',
        iconEmoji: '🖥️',
        items: [
          { id: 'ai-4-1', title: 'Ollama', url: 'https://ollama.com', description: '인터넷 없이 로컬 PC에서 오픈소스 LLM을 명령어로 실행하는 도구' },
          { id: 'ai-4-2', title: 'LM Studio', url: 'https://lmstudio.ai', description: 'GUI로 로컬 AI 모델을 쉽게 내려받고 실행. 비개발자도 사용 가능' },
          { id: 'ai-4-3', title: 'GPT4ALL', url: 'https://gpt4all.io', description: '저사양 PC에서도 실행 가능한 로컬 AI 플랫폼. 다양한 모델 지원' },
          { id: 'ai-4-4', title: 'Jan', url: 'https://jan.ai', description: '오픈소스 로컬 AI 클라이언트. ChatGPT와 유사한 UI로 로컬 모델 실행' },
          { id: 'ai-4-5', title: 'Open WebUI', url: 'https://openwebui.com', description: 'Ollama 등 로컬 모델에 연결하는 웹 기반 인터페이스. 다중 모델 관리 가능' },
        ],
      },
      {
        id: 'ai-audio',
        label: '4. 음성 및 소리 제작',
        iconEmoji: '🎵',
        items: [
          { id: 'ai-5-1', title: 'ElevenLabs', url: 'https://elevenlabs.io', description: '텍스트를 자연스러운 목소리로 변환하는 AI TTS 서비스. 다국어 지원' },
          { id: 'ai-5-2', title: '클로바 더빙', url: 'https://clovadubbing.naver.com', description: '네이버의 한국어 특화 AI 더빙·TTS 서비스. 영상에 자동 더빙 적용 가능' },
          { id: 'ai-5-3', title: 'Suno AI', url: 'https://suno.com', description: '텍스트 프롬프트만으로 완성된 노래(가사+반주)를 생성하는 AI 작곡 도구' },
          { id: 'ai-5-4', title: 'Udio', url: 'https://www.udio.com', description: '고품질 AI 음악 생성 도구. 다양한 장르와 세밀한 스타일 조정 지원' },
        ],
      },
      {
        id: 'ai-nocode',
        label: '5. No Code AI 도구',
        iconEmoji: '🧩',
        items: [
          { id: 'ai-7-1', title: 'Teachable Machine', url: 'https://teachablemachine.withgoogle.com', description: 'Google의 코딩 없는 머신러닝 체험 도구. 이미지·소리·자세를 학습시켜 AI 모델 직접 제작' },
          { id: 'ai-7-2', title: 'orange3', url: 'https://orangedatamining.com', description: '드래그앤드롭 방식의 오픈소스 데이터 분석·머신러닝 도구. 시각적 워크플로우로 AI 학습 가능' },
          { id: 'ai-7-3', title: 'RunwayML', url: 'https://runwayml.com', description: '코드 없이 사용하는 AI 영상·이미지 생성 도구. 배경 제거, 모션 추적, AI 영상 편집 지원' },
          { id: 'ai-7-4', title: 'lobe', url: 'https://www.lobe.ai', description: 'Microsoft의 코드 없는 이미지 분류 AI 학습 도구. 사진만 모으면 분류 모델 생성 가능' },
          { id: 'ai-7-5', title: 'Brightics AI (삼성)', url: 'https://www.brightics.ai', description: '삼성SDS의 노코드 AI 분석 플랫폼. 제조·유통·금융 데이터 분석에 특화된 기업용 도구' },
        ],
      },
      {
        id: 'ai-design',
        label: '6. 제작·디자인 도구',
        iconEmoji: '🎨',
        items: [
          { id: 'ai-3-1', title: 'Gamma', url: 'https://gamma.app', description: 'AI로 프레젠테이션·문서·웹페이지를 빠르게 제작. 텍스트 입력만으로 슬라이드 자동 생성' },
          { id: 'ai-3-2', title: 'Canva', url: 'https://www.canva.com', description: '드래그앤드롭 방식의 범용 디자인 도구. Magic Write 등 AI 기능 내장' },
          { id: 'ai-3-3', title: '미리캔버스', url: 'https://www.miricanvas.com', description: '한국어 특화 무료 디자인 도구. 교육용 템플릿 다수 제공' },
          { id: 'ai-3-4', title: '망고보드', url: 'https://www.mangoboard.net', description: '한국형 인포그래픽·카드뉴스·PPT 제작 도구. 교육 현장에서 많이 활용' },
          { id: 'ai-3-5', title: '투닝', url: 'https://tooning.io', description: 'AI 기반 웹툰·만화 제작 도구. 캐릭터와 배경을 자동 생성해 학습 만화 제작 가능' },
          { id: 'ai-3-6', title: 'Figma', url: 'https://www.figma.com', description: 'UI/UX 디자인 협업 도구. AI 플러그인 다수 지원. 교육용 무료 플랜 제공' },
        ],
      },
    ],
  },
  {
    id: 'research-etc',
    title: '연구·연수·기타',
    subtitle: '학술 연구, 교사 연수, 기타 자료',
    icon: MessageSquare,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    subCategories: [
      {
        id: 'research',
        label: '1. 연구',
        iconEmoji: '🔬',
        items: [
          { id: 'r-1-1', title: 'AIEDAP AI융합교육 학술자료', url: 'https://aiedap.or.kr/ai융합수업-지원/ai융합교육-학술자료/', description: 'AI 융합교육 관련 학술 논문·연구 보고서를 모아둔 AIEDAP 공식 페이지' },
          { id: 'r-1-2', title: '한국과학창의재단 연구보고서', url: 'https://www.kosac.re.kr/menus/244/boards/457/posts', description: '한국과학창의재단이 발간한 과학·수학·정보·융합 교육 분야 연구보고서 모음' },
          { id: 'r-1-3', title: '한국인공지능교육학회', url: 'http://aied.or.kr/', description: '인공지능 교육 연구를 전문으로 하는 학술 단체. 학술지·학술대회 정보 제공' },
        ],
      },
      {
        id: 'training',
        label: '2. 연수',
        iconEmoji: '📖',
        items: [
          { id: 'r-2-1', title: 'KERIS 종합교육연수원 연수 자료집', url: 'https://www.cet.keris.or.kr/usr/reference/selectTrainingListPageVw.do?menuNo=23100', description: 'KERIS 종합교육연수원에서 제공하는 교원 연수 자료집 모음' },
        ],
      },
      {
        id: 'etc',
        label: '3. 기타',
        iconEmoji: '📦',
        items: [
          { id: 'r-3-1', title: '교과 학습발달상황 작성 GPT', url: 'https://chatgpt.com/g/g-6753f78947708191b221bbf659619dfd-seongcwigijun-giban-gyogwahagseubbaldalsanghwang-saengseong-caesbos-jeongwamog', description: 'ChatGPT 커스텀 GPT. 학생의 학습 활동·성과를 입력하면 교과 학습발달상황을 자동으로 생성' },
        ],
      },
    ],
  },
  {
    id: 'lesson',
    title: '수업 활용 자료',
    subtitle: '지도안·활동지·수업 자료',
    icon: Layout,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    subCategories: [
      {
        id: 'hangul-literacy',
        label: '1. 한글·문해 수업 자료',
        iconEmoji: '📚',
        items: [
          { id: 'l-1-1', title: '소중한글 공식 사이트', url: 'https://sojunghangeul.com/home/main', description: '한글 해득, 쓰기, 문해력 학습을 앱·교재·교구로 안내하는 소중한글 공식 사이트' },
          { id: 'l-1-2', title: '소중한글 무료 체험', url: 'https://form.h2k.co.kr', description: '학생 수준 확인과 수업 전 체험 활동에 활용할 수 있는 소중한글 체험 신청 페이지' },
          { id: 'l-1-3', title: '소중한글 공식 카페', url: 'https://cafe.naver.com/sojunghangeul', description: '복습 활동지, 그림책 추천, 가정 연계 활동 자료를 확인할 수 있는 공식 커뮤니티' },
          { id: 'l-1-4', title: '소중한글 Google Play', url: 'https://play.google.com/store/apps/details?id=com.h2kresearch.preciousHangul', description: '파닉스 기반 한글 교육 앱. 진단, 자모음, 받침, 쓰기 학습 흐름 확인용' },
          { id: 'l-1-5', title: '소중한글 동요 Google Play', url: 'https://play.google.com/store/apps/details?id=com.h2kresearch.ps', description: '한글 동요와 기초 게임으로 글자 호기심을 키우는 유아·초기 문해 활동용 앱' },
          { id: 'l-1-6', title: '온한글', url: 'https://onhan.cne.go.kr/', description: '충청남도교육청 한글 해득 진단·보정 시스템. 미해득 학생 보정 자료와 성장 기록 지원' },
          { id: 'l-1-7', title: '아이랑한글이랑', url: 'https://onsem.withrun.co.kr/', description: '한글 미해득 진단부터 보정 지원, 누가 관리까지 이어지는 한글 해득 지원 시스템' },
          { id: 'l-1-8', title: '한글 해득 진단 도구 개발 연구', url: 'https://www.kci.go.kr/kciportal/landing/article.kci?arti_id=ART002468811', description: '초등 1학년 한글 해득 수준 진단과 보충 교육 설계의 근거로 참고할 수 있는 연구 자료' },
        ],
      },
      {
        id: 'corn-theme',
        label: '2. 주제별 통합 수업: 옥수수',
        iconEmoji: '🌽',
        items: [
          { id: 'l-2-1', title: '텃밭에서 옥수수 키우기', url: 'https://www.rda.go.kr/webzine/2021/05/sub4-2.html', description: '농촌진흥청 자료를 바탕으로 옥수수 품종, 심기, 가꾸기 흐름을 설명하는 텃밭 수업 자료' },
          { id: 'l-2-2', title: '식물의 한살이 개념 정리', url: 'https://www.home-learn.co.kr/newsroom/news/A/1231', description: '씨 관찰, 발아 조건, 식물 성장 과정을 옥수수 관찰 활동과 연결해 활용할 수 있는 초등 과학 자료' },
          { id: 'l-2-3', title: '옥수수 온면', url: 'https://encykorea.aks.ac.kr/Article/E0080021', description: '한국민족문화대백과사전의 옥수수 음식문화 자료. 사회·국어 읽기 자료로 활용 가능' },
          { id: 'l-2-4', title: '옥수수 어휘 정보', url: 'https://en.wiktionary.org/wiki/%EC%98%A5%EC%88%98%EC%88%98', description: '옥수수의 어원, 발음, 뜻을 확인할 수 있는 어휘 탐구 참고 자료' },
          { id: 'l-2-5', title: '옥수수 농업기술길잡이', url: 'https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=290210143', description: '농촌진흥청이 집필한 옥수수 재배 전문 자료. 교사용 배경지식 확인용' },
        ],
      },
      {
        id: 'edu-portal',
        label: '3. AI 교육 포털',
        iconEmoji: '🌐',
        items: [
          { id: 'l-3-1', title: '에듀넷 AI·SW 교육', url: 'https://ai.edunet.net', description: '교육부 공식 AI·SW 교육 포털. 교사·학생용 자료, 연수, 수업 지원 통합 제공' },
          { id: 'l-3-2', title: '에듀넷 티-클리어 AI 교수학습자료', url: 'https://ai.edunet.net/aiTchLrngData/list/408', description: '에듀넷의 AI 교수·학습 자료 목록. 수업에서 바로 활용 가능한 자료 모음' },
          { id: 'l-3-3', title: '에듀넷 AI·SW 연구·기타자료', url: 'https://ai.edunet.net/aiStdyEtcData/list/411', description: 'AI·SW 교육 관련 연구 보고서 및 기타 참고 자료' },
          { id: 'l-3-4', title: '한국과학창의재단 SAI', url: 'https://www.kosac.re.kr/menus/1124/contents/1124', description: '한국과학창의재단의 학교 AI 교육(SAI) 사업 안내 및 자료 제공 페이지' },
          { id: 'l-3-5', title: 'SAI 교육콘텐츠', url: 'https://sai.software.kr', description: '학교 AI 교육을 위한 교육콘텐츠·수업 자료 포털' },
          { id: 'l-3-6', title: 'AI·디지털 교육자료 수업지원센터', url: 'https://www.ai-dt.net', description: '교사가 AI·디지털 교육자료를 찾고 수업에 바로 적용할 수 있는 지원 센터' },
          { id: 'l-3-7', title: 'AI·디지털 교육자료(aidtbook)', url: 'https://www.aidtbook.kr/index.do', description: 'AI 디지털 교과서 관련 교육자료 통합 제공 포털' },
          { id: 'l-3-8', title: '미래엔 AI·디지털 교육자료', url: 'https://aidt.m-teacher.co.kr', description: '출판사 미래엔에서 제공하는 AI·디지털 교육자료 및 교사 지원 자료' },
          { id: 'l-3-9', title: '아이스크림 AI 디지털 교육자료', url: 'https://aidt.i-scream.co.kr', description: '아이스크림미디어의 AI 디지털 교육자료 플랫폼. 초등 특화 콘텐츠 다수' },
        ],
      },
    ],
  },
  {
    id: 'assessment',
    title: '행정 업무 자료',
    subtitle: '학교 업무 전반의 실무 참고 자료',
    icon: ClipboardList,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    subCategories: [
      {
        id: 'school-work',
        label: '학교업무 도움자료',
        iconEmoji: '🗂️',
        items: [
          { id: 'a-2-3', title: '경상남도교육청 학교업무 도움자료', url: 'https://hryoon0.github.io/helppage/', description: '경상남도교육청 학교업무 도움자료 사이트. 초등학교 업무 참고 자료를 확인할 수 있습니다.' },
        ],
      },
    ],
  },
  {
    id: 'ethics',
    title: 'AI 윤리 자료',
    subtitle: 'AI 윤리 교육 및 정책 자료',
    icon: Shield,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-500',
    subCategories: [],
  },
  {
    id: 'policy',
    title: '정책·지침 자료',
    subtitle: '교육부·시도교육청 AI 정책 자료',
    icon: FileText,
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-500',
    subCategories: [
      {
        id: 'policy-gov',
        label: '1. 교육부 지침',
        iconEmoji: '🏛️',
        items: [
          { id: 'pol-1-1', title: '인공지능 행동계획', url: 'https://drive.google.com/file/d/1uVEhE63fvCxCf3eukHIHmMi7vZUvu1jS/view?usp=drive_link', description: '교육부의 인공지능 교육 추진 방향과 단계별 실행 계획을 담은 공식 문서' },
        ],
      },
      {
        id: 'policy-local',
        label: '2. 시도교육청 자료',
        iconEmoji: '🗺️',
        items: [
          { id: 'pol-2-2', title: '서울시교육청 AIEDAP AI 융합수업 우수 사례집', url: 'https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsSn=1462&q_bbsDocNo=20240601181736054', description: '서울시교육청 AIEDAP 사업의 AI 융합수업 우수 실천 사례를 모은 자료집' },
        ],
      },
    ],
  },
];
