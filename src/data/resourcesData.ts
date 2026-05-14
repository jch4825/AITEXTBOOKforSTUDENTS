import type { LucideIcon } from 'lucide-react';
import { BookOpen, BriefcaseBusiness, MessageSquare, Layout, Shield, FileText } from 'lucide-react';

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
    id: 'school-admin-support',
    title: '핵심 도움 자료',
    subtitle: '학교 업무 전반에서 꼭 확인해야 할 핵심 도움 자료',
    icon: BriefcaseBusiness,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    subCategories: [
      {
        id: 'school-admin',
        label: '1. 학교 업무 도움 자료',
        iconEmoji: '🗂️',
        items: [
          { id: 'r-3-4', title: '경상남도교육청 학교업무 도움자료', url: 'https://hryoon0.github.io/helppage/', description: '경상남도교육청 학교업무 도움자료 사이트. 초등학교 업무 참고 자료를 확인할 수 있습니다.' },
        ],
      },
      {
        id: 'teaching-tools',
        label: '2. AI·소프트웨어 티칭툴 검색도구',
        iconEmoji: '🌱',
        items: [
          { id: 'teachle-tools', title: 'AI, 소프트웨어 티칭툴 검색도구', url: 'https://teachle.co.kr/teaching-tools/', description: '티끌 자료실에서 제공하는 AI·소프트웨어 티칭툴 검색도구. 수업에 활용할 수 있는 교육 도구를 빠르게 찾아볼 수 있습니다.' },
        ],
      },
    ],
  },
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
          { id: 'ai-2-7', title: 'Stitch', url: 'https://stitch.withgoogle.com/', description: 'Google의 AI UI 디자인 도구. 자연어 프롬프트로 앱·웹 UI 시안과 코드까지 생성' },
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
        id: 'claude-skill-mcp',
        label: '3. Claude Skill & MCP',
        iconEmoji: '🔌',
        items: [
          { id: 'r-3-5', title: 'Claude Education Skills', url: 'https://github.com/GarethManning/claude-education-skills', description: '111개 증거 기반 교수법 Skill과 MCP 원격 서버를 제공하는 Claude 교육용 Skill 모음' },
          { id: 'r-3-6', title: 'OpenEdu MCP', url: 'https://github.com/Cicatriiz/openedu-mcp', description: '학년별 필터와 커리큘럼 연동을 지원하는 Python 기반 교육 MCP 서버' },
          { id: 'r-3-7', title: 'Anki MCP Server', url: 'https://github.com/ankimcp/anki-mcp-server', description: '플래시카드 도구 Anki와 AI를 MCP로 연동하는 서버' },
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
          { id: 'l-1-6', title: '온한글', url: 'https://onhan.cne.go.kr/', description: '충청남도교육청 한글 해득 진단·보정 시스템. 미해득 학생 보정 자료와 성장 기록 지원' },
        ],
      },
      {
        id: 'creative-small-tools',
        label: '2. 창작·스몰 도구',
        iconEmoji: '🎨',
        items: [
          { id: 'small-1', title: 'Chrome Music Lab', url: 'https://musiclab.chromeexperiments.com/', description: '리듬, 멜로디, 소리의 파형을 놀이처럼 탐색하는 구글의 웹 기반 음악 실험실' },
          { id: 'small-2', title: 'AutoDraw', url: 'https://www.autodraw.com/', description: '간단한 스케치를 AI가 그림 아이콘으로 추천해 주는 구글 크리에이티브 랩의 드로잉 도구' },
          { id: 'small-3', title: 'Google Arts & Culture', url: 'https://artsandculture.google.com/?hl=ko', description: '세계 미술 작품, 박물관, 역사·문화 자료를 고화질 이미지와 인터랙티브 콘텐츠로 탐색할 수 있는 구글 문화예술 플랫폼' },
        ],
      },
      {
        id: 'programming-tools',
        label: '3. 프로그래밍 수업 도구',
        iconEmoji: '💻',
        items: [
          { id: 'programming-1', title: 'Delightex Edu', url: 'https://www.delightex.com/edu', description: '3D 공간, VR·AR 콘텐츠를 만들고 블록 코딩과 스크립트로 상호작용을 구현하는 교육용 제작 도구' },
          { id: 'programming-2', title: '엔트리', url: 'https://playentry.org/ko/', description: '네이버 커넥트재단에서 운영하는 비영리 블록 코딩 교육 플랫폼' },
          { id: 'programming-3', title: '스크래치', url: 'https://scratch.mit.edu/', description: '스토리, 게임, 애니메이션을 만들며 프로그래밍 기초를 배우는 블록 기반 창작 플랫폼' },
        ],
      },
      {
        id: 'simulation-tools',
        label: '4. 시뮬레이션 수업 도구',
        iconEmoji: '🧪',
        items: [
          { id: 'simulation-1', title: '자바실험실', url: 'https://javalab.org/ko/', description: '과학·수학 개념을 웹 시뮬레이션으로 탐구할 수 있는 한국어 실험 자료 사이트' },
          { id: 'simulation-2', title: '지오지브라', url: 'https://www.geogebra.org/?lang=ko', description: '함수, 기하, 통계, 3D 그래프 등을 조작하며 탐구하는 수학 시뮬레이션 플랫폼' },
          { id: 'simulation-3', title: '알지오매스', url: 'https://www.algeomath.kr/', description: '수학 개념을 그래프와 기하 모델로 시각화해 수업에 활용할 수 있는 국내 수학 탐구 도구' },
          { id: 'simulation-4', title: 'VlabON', url: 'https://www.vlabon.re.kr/', description: '가상 실험과 과학 탐구 활동을 지원하는 온라인 과학 실험 플랫폼' },
        ],
      },
      {
        id: 'edu-portal-public',
        label: '5. 공공·국가 AI 교육 포털',
        iconEmoji: '🏛️',
        items: [
          { id: 'l-3-1', title: '에듀넷 AI·SW 교육', url: 'https://ai.edunet.net', description: '교육부 공식 AI·SW 교육 포털. 교사·학생용 자료, 연수, 수업 지원 통합 제공' },
          { id: 'l-3-2', title: '에듀넷 티-클리어 AI 교수학습자료', url: 'https://ai.edunet.net/aiTchLrngData/list/408', description: '에듀넷의 AI 교수·학습 자료 목록. 수업에서 바로 활용 가능한 자료 모음' },
          { id: 'l-3-3', title: '에듀넷 AI·SW 연구·기타자료', url: 'https://ai.edunet.net/aiStdyEtcData/list/411', description: 'AI·SW 교육 관련 연구 보고서 및 기타 참고 자료' },
          { id: 'l-3-4', title: '한국과학창의재단 SAI', url: 'https://www.kosac.re.kr/menus/1124/contents/1124', description: '한국과학창의재단의 학교 AI 교육(SAI) 사업 안내 및 자료 제공 페이지' },
          { id: 'l-3-5', title: 'SAI 교육콘텐츠', url: 'https://sai.software.kr', description: '학교 AI 교육을 위한 교육콘텐츠·수업 자료 포털' },
          { id: 'l-3-6', title: 'AI·디지털 교육자료 수업지원센터', url: 'https://www.ai-dt.net', description: '교사가 AI·디지털 교육자료를 찾고 수업에 바로 적용할 수 있는 지원 센터' },
          { id: 'l-3-7', title: 'AI·디지털 교육자료(aidtbook)', url: 'https://www.aidtbook.kr/index.do', description: 'AI 디지털 교과서 관련 교육자료 통합 제공 포털' },
          { id: 'l-3-16', title: '소프트웨어야 놀자', url: 'https://www.playsw.or.kr/main', description: '네이버커넥트재단이 운영하는 SW·AI 교육 콘텐츠 플랫폼' },
        ],
      },
      {
        id: 'edu-portal-local',
        label: '6. 시도교육청 AI 교육 자료',
        iconEmoji: '🗺️',
        items: [
          { id: 'l-3-10', title: '빛고을 아이(AI) — 광주 AI 교육 프로그램', url: 'https://sw.gen.go.kr/bbs/board.php?bo_table=data&wr_id=15', description: '광주 AI 교육센터가 2024년에 공개한 초등용 AI 교육 프로그램 교재' },
          { id: 'l-3-11', title: '울산교육청 우리아이', url: 'https://wooriai.use.go.kr/', description: '울산광역시교육청에서 운영하는 학생용 AI 챗봇 서비스' },
          { id: 'l-3-12', title: '초·중등 AI 수학 융합교육 교수학습자료', url: 'https://sw.gen.go.kr/bbs/board.php?bo_table=data&wr_id=64', description: '광주 SW 교육지원센터가 2024년에 발간한 초·중등 인공지능-수학 융합 수업 자료' },
        ],
      },
      {
        id: 'edu-portal-publisher',
        label: '7. 출판사 AI 디지털 교육자료',
        iconEmoji: '📘',
        items: [
          { id: 'l-3-8', title: '미래엔 AI·디지털 교육자료', url: 'https://aidt.m-teacher.co.kr', description: '출판사 미래엔에서 제공하는 AI·디지털 교육자료 및 교사 지원 자료' },
          { id: 'l-3-9', title: '아이스크림 AI 디지털 교육자료', url: 'https://aidt.i-scream.co.kr', description: '아이스크림미디어의 AI 디지털 교육자료 플랫폼. 초등 특화 콘텐츠 다수' },
          { id: 'l-3-14', title: 'VIVASAM 초등 인공지능 자료', url: 'https://e.vivasam.com/creative/edu/sw/cia/list', description: '비상교육 비바샘에서 제공하는 초등 인공지능·창의 수업 자료 모음' },
          { id: 'l-3-17', title: '씨마스 AI 디지털 교육자료', url: 'https://viewer.cmass.kr/html/aidt/aidt_e/view_aidt_e.html', description: '씨마스가 제공하는 AI 디지털 교과서 미리보기·교육자료' },
          { id: 'l-3-18', title: '천재교육 AI 디지털 교육자료 지원센터', url: 'https://support.aitextbook.co.kr/', description: '천재교육의 AI 디지털 교과서 활용 안내 및 교사 지원 자료' },
        ],
      },
      {
        id: 'edu-portal-community',
        label: '8. 교사·커뮤니티 자료 모음',
        iconEmoji: '👩‍🏫',
        items: [
          { id: 'l-3-13', title: '초등인공지능교육.COM', url: 'https://www.xn--ob0bug89lftci99a2oa25k5pi.com/', description: '초등 교사가 직접 운영하는 인공지능 수업 자료 모음 사이트' },
          { id: 'l-3-15', title: '초등 인공지능 교육 모듈형 39강좌', url: 'https://sites.google.com/ptsaebit.es.kr/metaverse/%EC%B4%88%EB%93%B1swai-%EC%BD%98%ED%85%90%EC%B8%A0-%EB%AA%A8%EC%9D%8C/%EC%B4%88%EB%93%B1-%EC%9D%B8%EA%B3%B5%EC%A7%80%EB%8A%A5-%EA%B5%90%EC%9C%A1%EB%AA%A8%EB%93%88%ED%98%95-39%EA%B0%95%EC%A2%8C', description: '초등 단계의 인공지능 교육을 모듈형 39강좌로 구성한 교사용 콘텐츠 모음' },
          { id: 'l-3-19', title: 'MyAI Edu', url: 'https://myai.kr/', description: '교사·학생을 위한 인공지능 교육 통합 콘텐츠 사이트' },
          { id: 'l-3-20', title: '인공지능 교육자료 사이트 모음(노션)', url: 'https://ai4edu.notion.site/AI-92b8c8eca0294fc7a9a2538bca205bdf', description: '이준기·김귀훈 선생님이 정리한 국내외 AI 교육자료 링크 모음 노션 페이지' },
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
        label: '1. 국가 및 교육부 지침',
        iconEmoji: '🏛️',
        items: [
          { id: 'pol-1-1', title: '인공지능 행동계획', url: 'https://drive.google.com/file/d/1uVEhE63fvCxCf3eukHIHmMi7vZUvu1jS/view?usp=drive_link', description: '교육부의 인공지능 교육 추진 방향과 단계별 실행 계획을 담은 공식 문서' },
          { id: 'pol-1-3', title: '초중등 디지털 인프라 관리 가이드', url: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=316&boardSeq=104618&lev=0&searchType=null&statusYN=W&page=3&s=moe&m=0302&opType=N', description: '교육부가 발표한 초·중등학교 디지털 인프라 구축·운영·관리 표준 가이드' },
          { id: 'pol-1-4', title: '제7차 교육정보화 기본계획', url: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=351&boardSeq=103106&lev=0&searchType=null&statusYN=W&page=1&s=moe&m=0310&opType=N', description: '교육부가 수립한 제7차 교육정보화 기본계획. 교육정보화의 비전과 중점 추진 과제를 담은 공식 정책 문서' },
          { id: 'pol-1-6', title: '2025년 지능정보사회 실행계획', url: 'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=351&boardSeq=103108&lev=0&searchType=null&statusYN=W&page=1&s=moe&m=0310&opType=N', description: '교육부의 2025년 지능정보사회 실행계획. 교육 분야 AI·디지털 전환을 위한 연도별 추진 과제' },
        ],
      },
      {
        id: 'policy-local',
        label: '2. 시도교육청 자료',
        iconEmoji: '🗺️',
        items: [
          { id: 'pol-2-2', title: '서울시교육청 AIEDAP AI 융합수업 우수 사례집', url: 'https://www.sen.go.kr/user/bbs/BD_selectBbs.do?q_bbsSn=1462&q_bbsDocNo=20240601181736054', description: '서울시교육청 AIEDAP 사업의 AI 융합수업 우수 실천 사례를 모은 자료집' },
          { id: 'pol-2-1', title: '생성형 인공지능(AI) 개발·활용을 위한 개인정보 처리 안내서(2025.8.)', url: 'https://www.gne.go.kr/user/bbs/BD_selectBbs.do?q_rowPerPage=10&q_currPage=1&q_sortName=&q_sortOrder=&q_bbsSn=1464&q_bbsDocNo=20260424101701193&q_menu=&q_ctgryCd=&q_clsfNo=1&q_lwrkCdId=10&q_searchKeyTy=ttl___1002&q_searchVal=&', description: '생성형 AI 개발·활용 단계에서 지켜야 할 개인정보 처리 원칙과 실무 절차를 정리한 2025년 8월 안내서' },
          { id: 'pol-2-3', title: '경상남도교육청 AI·디지털 교육 종합 추진 계획', url: 'https://www.gne.go.kr/user/bbs/BD_selectBbs.do?q_rowPerPage=10&q_currPage=2&q_sortName=&q_sortOrder=&q_bbsSn=1464&q_bbsDocNo=20260418223116303&q_menu=&q_ctgryCd=&q_clsfNo=1&q_lwrkCdId=10&q_searchKeyTy=ttl___1002&q_searchVal=&', description: '경상남도교육청이 발표한 AI·디지털 교육의 비전과 단계별 실행 과제를 담은 종합 추진 계획' },
          { id: 'pol-2-4', title: '2026년 AI 중점학교 기본계획 및 AI 중점학교 명단', url: 'https://www.gne.go.kr/user/bbs/BD_selectBbs.do?q_rowPerPage=10&q_currPage=2&q_sortName=&q_sortOrder=&q_bbsSn=1464&q_bbsDocNo=20260309200422066&q_menu=&q_ctgryCd=&q_clsfNo=1&q_lwrkCdId=10&q_searchKeyTy=ttl___1002&q_searchVal=&', description: '경상남도교육청 2026년 AI 중점학교 운영 기본계획과 선정 학교 명단' },
          { id: 'pol-2-5', title: '2025년 정보통신윤리교육 강화 및 지능정보서비스 과의존 예방교육 기본계획', url: 'https://www.gne.go.kr/user/bbs/BD_selectBbs.do?q_rowPerPage=10&q_currPage=10&q_sortName=&q_sortOrder=&q_bbsSn=1464&q_bbsDocNo=20250326085906790&q_menu=&q_ctgryCd=&q_clsfNo=1&q_lwrkCdId=10&q_searchKeyTy=ttl___1002&q_searchVal=&', description: '경상남도교육청 2025년 정보통신윤리교육 강화와 지능정보서비스 과의존 예방교육 추진 기본계획' },
        ],
      },
    ],
  },
];
