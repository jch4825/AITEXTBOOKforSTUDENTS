/**
 * 이 교재의 저작자 표시와 제작 방식.
 *
 * 표지(Home)와 교사 허브(TeacherHub)가 `ProjectCredit`으로 같은 문구를 보인다. 문구는 이 파일 한 곳에서
 * 정하고, README의 "저작자와 제작 방식"·출처 표시 예와 같은 내용이다. 바꾸면 README도 함께 고친다.
 * `check:ui-polish`가 두 화면에 이 표시가 있는지 본다.
 */
export const PROJECT_CREDIT = {
  author: '전창한',
  year: 2026,
  title: 'AI 교과서 — 발달장애 학생을 위한 AI 학습',
  repoUrl: 'https://github.com/jch4825/AITEXTBOOKforSTUDENTS',
  license: {
    name: 'CC BY-NC-SA 4.0',
    deedUrl: 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ko',
    licenseUrl: 'https://github.com/jch4825/AITEXTBOOKforSTUDENTS/blob/main/LICENSE',
  },
  /** 이 프로젝트를 만드는 데 쓴 인공지능 바이브코딩 도구. */
  tools: ['Anthropic의 Claude Code', 'OpenAI의 Codex', 'Google Antigravity'],
  /** 맡은 일마다 보조로 쓴 도구. `particle`은 도구 이름 바로 뒤에 붙는 목적격 조사다(이름이 정해져 있어 고정한다). */
  auxiliaryTools: [
    { use: '동영상 제작', tool: 'Google Notebook(구 NotebookLM)', particle: '을' },
    { use: '이미지 수정', tool: 'Google Flow', particle: '를' },
    { use: '표지 제작', tool: 'Google Stitch', particle: '를' },
  ],
} as const;

/** 제작 방식을 밝히는 한 문장. 표지와 교사 허브가 그대로 쓴다. */
export const PROJECT_CREDIT_TOOLS_SENTENCE =
  `이 프로젝트는 ${PROJECT_CREDIT.tools.join(', ')} 등의 인공지능 바이브코딩 도구를 사용하여 제작하였습니다.`;

/** 일마다 쓴 보조 도구를 밝히는 한 문장. */
export const PROJECT_CREDIT_AUXILIARY_SENTENCE =
  `${PROJECT_CREDIT.auxiliaryTools.map(({ use, tool, particle }) => `${use}에는 ${tool}${particle}`).join(', ')} 보조 도구로 활용하였습니다.`;
