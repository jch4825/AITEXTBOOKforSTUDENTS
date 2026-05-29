const KNOWN_LEARNING_DICTIONARY_ENTRIES: Record<string, string> = {
  mcp: `## 한 줄 설명
MCP(Model Context Protocol)는 AI가 외부 자료나 도구와 정해진 방식으로 연결되게 하는 약속입니다. 이 앱에서는 마이크로소프트 시험이나 자격증이 아니라 AI 도구 연결 규격을 뜻합니다.

## 학교에서 비유하면?
AI에게 학교 서류함이나 도구를 아무렇게나 열어 주는 것이 아닙니다. 허락된 열쇠와 사용 규칙을 주는 것과 비슷합니다.

## 실제 예시
- AI가 Google Drive의 수업 자료를 읽고 학습지를 만드는 연결
- AI가 웹 검색 도구로 최신 교육부 자료를 확인한 뒤 안내문 초안을 쓰는 연결`,
  바이브코딩: `## 한 줄 설명
바이브코딩은 사람이 자연어로 "이런 앱을 만들어 줘", "이 부분을 고쳐 줘"처럼 설명하면 AI가 코드를 만들거나 수정하게 하는 방식입니다. 코딩 교육 플랫폼 이름이 아니라, AI와 대화하며 프로그램을 만드는 작업 방식을 뜻합니다.

## 학교에서 비유하면?
교사가 수업 아이디어를 말하면 보조 교사가 초안을 만들고, 교사가 다시 고쳐 달라고 지시하는 과정과 비슷합니다. 개발자는 방향과 기준을 정하고, AI는 초안 작성과 수정 작업을 돕습니다.

## 실제 예시
- "가정통신문을 자동으로 작성하는 간단한 화면을 만들어 줘"라고 AI에게 요청해 앱 초안을 만들기
- "버튼 글자를 더 크게 하고, 모바일에서도 깨지지 않게 고쳐 줘"라고 말해 코드를 수정하기`,
};

const KNOWN_LEARNING_DICTIONARY_ALIASES: Record<string, keyof typeof KNOWN_LEARNING_DICTIONARY_ENTRIES> = {
  modelcontextprotocol: 'mcp',
  vibeCoding: '바이브코딩',
  vibecoding: '바이브코딩',
  바이브코딩: '바이브코딩',
};

function normalizeDictionaryTerm(term: string) {
  return term
    .trim()
    .toLowerCase()
    .normalize('NFKC')
    .replace(/^[\s"'“”‘’([{<]+|[\s"'“”‘’)\]}>?.!,:;]+$/g, '')
    .replace(/[^a-z0-9가-힣+#.]/g, '');
}

export function getKnownLearningDictionaryEntry(term: string) {
  const normalized = normalizeDictionaryTerm(term);
  const key = KNOWN_LEARNING_DICTIONARY_ALIASES[normalized] ?? normalized;
  return KNOWN_LEARNING_DICTIONARY_ENTRIES[key] ?? null;
}
