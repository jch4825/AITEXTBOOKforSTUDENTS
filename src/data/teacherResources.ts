import type { LessonId } from '../types';

/**
 * 차시별 교사 참고 자료 링크.
 *
 * 링크 자체는 저작물의 복제·전송이 아니므로 사용료 대상이 아니다. 다만 두 가지를 지킨다.
 *  1. 공식 채널·공식 사이트에만 건다. 불법 업로드물로의 링크는 침해 방조가 될 수 있다.
 *  2. 무엇을 여는지 교사가 알 수 있게 제공자와 확인 날짜를 함께 적는다.
 *     이 교재는 m4에서 출처와 날짜 확인을 가르치므로 교재 자신이 먼저 지킨다.
 *
 * 이 목록은 교사 모드에서만 보인다(ClassroomDock). 학생이 수업 도중 외부 사이트로
 * 나가거나 통제할 수 없는 광고를 만나지 않게 하기 위해서다.
 *
 * 도구 선정 기준: 무료·로그인 불필요, 한국어로 쓰거나 언어가 필요 없을 것.
 * 카메라나 마이크가 필요한 도구는 학생 화면이 권한 없이 완결되어야 한다는 제품 계약과
 * 충돌하므로 description에 「교사 시연용」이라고 밝힌다.
 *
 * 맞는 자료가 없는 차시는 비워 둔다. 억지로 채운 링크는 없는 것만 못하다.
 * 모든 URL은 작성 시점에 실제 응답을 확인했다(scripts/check-teacher-resources.mjs).
 */

export type TeacherLinkKind = 'tool' | 'video';

export interface TeacherLink {
  kind: TeacherLinkKind;
  label: string;
  url: string;
  /** 제공자. 영상은 채널명, 도구는 만든 곳. */
  source: string;
  description: string;
  /** 링크가 열리지 않을 때 대신 할 일. 학교망 차단과 영상 삭제에 대비한다. */
  fallback: string;
  /** 링크를 확인한 날짜(YYYY-MM-DD). */
  checkedAt: string;
}

const CHECKED = '2026-08-26';

/** 여러 차시에서 다시 쓰는 도구. 억지로 차시마다 다른 도구를 만들지 않는다. */
const TOOLS = {
  quickdraw: {
    label: '퀵 드로우',
    url: 'https://quickdraw.withgoogle.com/',
    source: '구글',
    fallback: '칠판에 그림을 그려 무엇으로 보이는지 서로 맞혀 봅니다.',
  },
  autodraw: {
    label: '오토드로우',
    url: 'https://www.autodraw.com/',
    source: '구글',
    fallback: '손그림을 그리고 무엇을 그린 것인지 짝에게 물어 봅니다.',
  },
  translate: {
    label: '구글 번역',
    url: 'https://translate.google.com/',
    source: '구글',
    fallback: '종이 사전이나 학생 사전으로 낱말을 찾아봅니다.',
  },
  papago: {
    label: '파파고',
    url: 'https://papago.naver.com/',
    source: '네이버',
    fallback: '같은 문장을 두 가지로 바꿔 적고 뜻이 달라지는지 살펴봅니다.',
  },
  semantris: {
    label: '세만트리스',
    url: 'https://research.google.com/semantris/',
    source: '구글',
    fallback: '낱말 하나를 말하면 이어질 낱말을 돌아가며 말해 봅니다.',
  },
  aiExperiments: {
    label: 'AI 실험 모음',
    url: 'https://experiments.withgoogle.com/collection/ai',
    source: '구글',
    fallback: '지금까지 써 본 AI 도구를 칠판에 적어 종류별로 나눠 봅니다.',
  },
  teachable: {
    label: '티처블 머신',
    url: 'https://teachablemachine.withgoogle.com/',
    source: '구글',
    fallback: '모양 카드를 직접 나눠 담아 자료가 치우쳤을 때를 흉내 내 봅니다.',
  },
  stdict: {
    label: '표준국어대사전',
    url: 'https://stdict.korean.go.kr/',
    source: '국립국어원',
    fallback: '교실의 종이 국어사전에서 같은 낱말을 찾아봅니다.',
  },
  opendict: {
    label: '우리말샘',
    url: 'https://opendict.korean.go.kr/',
    source: '국립국어원',
    fallback: '낱말이 쓰인 문장을 교과서에서 찾아 밑줄을 그어 봅니다.',
  },
  weather: {
    label: '기상청 날씨누리',
    url: 'https://www.weather.go.kr/w/index.do',
    source: '기상청',
    fallback: '교실 창밖을 보고 오늘 날씨를 함께 적어 봅니다.',
  },
  entry: {
    label: '엔트리',
    url: 'https://playentry.org/',
    source: '네이버 커넥트재단',
    fallback: '순서 카드를 종이에 적어 책상 위에서 차례를 맞춰 봅니다.',
  },
  privacy: {
    label: '개인정보보호포털',
    url: 'https://www.privacy.go.kr/',
    source: '개인정보보호위원회',
    fallback: '학교 개인정보 안내문에서 지켜야 할 항목을 함께 읽습니다.',
  },
  iapc: {
    label: '스마트쉼센터',
    url: 'https://www.iapc.or.kr/',
    source: '한국지능정보사회진흥원',
    fallback: '오늘 사용한 화면 시간을 각자 적어 서로 견주어 봅니다.',
  },
  cyber: {
    label: '경찰 사이버범죄 신고',
    url: 'https://ecrm.police.go.kr/minwon/main',
    source: '경찰청',
    fallback: '학교에서 도움을 요청할 어른의 이름과 순서를 카드에 적습니다.',
  },
  arts: {
    label: '구글 아트 앤 컬처',
    url: 'https://artsandculture.google.com/',
    source: '구글',
    fallback: '교과서 그림 하나를 골라 보이는 것과 짐작한 것을 나눠 적습니다.',
  },
  naverMap: {
    label: '네이버 지도',
    url: 'https://map.naver.com/',
    source: '네이버',
    fallback: '학교 주변 약도를 칠판에 그려 길을 짚어 봅니다.',
  },
  moe: {
    label: '교육부',
    url: 'https://www.moe.go.kr/',
    source: '교육부',
    fallback: '학교 가정통신문에서 쓴 사람과 날짜를 찾아봅니다.',
  },
  neis: {
    label: '나이스 교육정보 개방',
    url: 'https://open.neis.go.kr/',
    source: '한국교육학술정보원',
    fallback: '학교 게시판의 주간 식단표를 직접 확인합니다.',
  },
} as const;

type ToolKey = keyof typeof TOOLS;

/** 차시별 도구 배정. 맞는 도구가 없으면 넣지 않는다. */
const LESSON_TOOL: Partial<Record<LessonId, { tool: ToolKey; description: string }>> = {
  'm1-l1': { tool: 'translate', description: '번역이 AI가 돕는 일 가운데 하나임을 직접 넣어 보고 확인합니다.' },
  'm1-l2': { tool: 'quickdraw', description: '내 그림을 입력으로 받아 결과가 나오는 과정을 보고 버튼·센서와 무엇이 다른지 견줍니다.' },
  'm1-l3': { tool: 'semantris', description: '낱말을 이어 붙이는 방식으로 답이 만들어지는 것을 놀이로 겪어 봅니다.' },
  'm1-l4': { tool: 'quickdraw', description: '같은 사물을 다르게 그려 넣으면서 입력이 바뀌면 결과가 달라지는 것을 확인합니다.' },
  'm1-l5': { tool: 'translate', description: '음성 입력 단추로 말소리가 글자로 바뀌는 것을 봅니다. 마이크가 필요하므로 교사 시연용입니다.' },
  'm1-l6': { tool: 'teachable', description: '한쪽으로 치우친 자료로 학습시키면 결과가 치우치는 것을 보여 줍니다. 카메라가 필요하므로 교사 시연용입니다.' },
  'm1-l7': { tool: 'papago', description: '번역 결과를 원문과 나란히 놓고 빠지거나 달라진 곳을 찾습니다.' },
  'm1-l8': { tool: 'weather', description: '사실 확인에 쓰는 공식 자료가 어떤 모습인지 봅니다. 판단은 사람이 한다는 것과 견줍니다.' },
  'm1-l9': { tool: 'aiExperiments', description: '입력과 결과가 서로 다른 여러 AI 도구를 훑어보고 하려는 일에 맞는 것을 고릅니다.' },
  'm1-l10': { tool: 'autodraw', description: 'AI가 준 제안을 그대로 쓸지 고칠지 고르는 경험을 합니다.' },

  'm2-l1': { tool: 'papago', description: '빠진 정보가 있는 짧은 문장과 채운 문장의 결과를 견주어 봅니다.' },
  'm2-l3': { tool: 'quickdraw', description: '무엇을 그릴지 정확히 정하고 그릴 때와 대충 그릴 때의 결과를 견줍니다.' },
  'm2-l4': { tool: 'autodraw', description: '내가 그린 예시를 보여 주면 제안이 어떻게 달라지는지 확인합니다.' },
  'm2-l5': { tool: 'papago', description: '같은 뜻을 높임말과 예사말로 각각 넣어 결과가 달라지는 것을 봅니다.' },
  'm2-l6': { tool: 'entry', description: '큰 일을 블록 단위로 나누어 순서대로 잇는 것을 눈으로 봅니다.' },
  'm2-l8': { tool: 'translate', description: '같은 내용을 짧게와 길게 넣어 답의 모양이 달라지는 것을 확인합니다.' },
  'm2-l9': { tool: 'weather', description: '같은 것을 다시 묻는 것과 공식 자료로 확인하는 것의 차이를 봅니다.' },
  'm2-l10': { tool: 'aiExperiments', description: '한 번의 대화로 끝나는 도구와 주고받는 도구를 견주어 봅니다.' },

  'm3-l1': { tool: 'stdict', description: '같은 낱말을 여러 각도로 찾아보며 질문에 따라 얻는 정보가 달라지는 것을 봅니다.' },
  'm3-l2': { tool: 'stdict', description: '짐작한 뜻과 사전의 뜻을 나란히 놓고 겹치는 핵심을 찾습니다.' },
  'm3-l3': { tool: 'opendict', description: '어려운 말의 쉬운 풀이를 찾아 원래 뜻이 남았는지 확인합니다.' },
  'm3-l4': { tool: 'opendict', description: '낱말이 실제로 쓰인 예문을 찾아 쓰임의 범위를 정합니다.' },
  'm3-l5': { tool: 'autodraw', description: '이야기 장면을 그림으로 옮기며 제안을 받아들일지 고칠지 정합니다.' },
  'm3-l7': { tool: 'stdict', description: '요약에 남길 핵심 낱말의 뜻을 확인해 빠뜨리면 안 되는 것을 정합니다.' },
  'm3-l8': { tool: 'entry', description: '정답을 뒤에 두는 퀴즈의 순서를 블록으로 짜 봅니다.' },
  'm3-l9': { tool: 'arts', description: '그림을 크게 확대해 보이는 것과 짐작한 것을 나눕니다.' },
  'm3-l10': { tool: 'stdict', description: '오늘 배운 낱말을 다시 찾아 내 말로 정리한 것과 견줍니다.' },

  'm4-l1': { tool: 'weather', description: '자신 있어 보이는 답을 공식 자료의 날짜와 맞춰 봅니다.' },
  'm4-l2': { tool: 'moe', description: '쓴 사람과 게시 날짜가 분명한 공식 자료가 어떤 모습인지 확인합니다.' },
  'm4-l3': { tool: 'privacy', description: '무엇이 개인정보에 해당하는지 공식 안내에서 확인합니다.' },
  'm4-l4': { tool: 'privacy', description: '비밀번호와 인증 코드를 요구하는 수법의 공식 안내를 함께 읽습니다.' },
  'm4-l5': { tool: 'privacy', description: '사진에 남는 개인 단서에 무엇이 있는지 공식 안내로 확인합니다.' },
  'm4-l6': { tool: 'iapc', description: '불편한 내용을 만났을 때의 대처와 상담 창구를 확인합니다.' },
  'm4-l8': { tool: 'iapc', description: '스스로 사용 시간을 살펴보는 자가진단으로 멈출 기준을 정합니다.' },
  'm4-l9': { tool: 'cyber', description: '위험한 요청을 실제로 어디에 알리는지 공식 창구를 확인합니다. 신고 연습은 하지 않고 경로만 봅니다.' },
  'm4-l10': { tool: 'privacy', description: '맞춤 광고가 어떤 정보로 만들어지는지 공식 안내에서 확인합니다.' },

  'm5-l2': { tool: 'entry', description: '큰 과제를 작은 블록으로 나누어 배열해 봅니다.' },
  'm5-l3': { tool: 'entry', description: '순서를 바꾸면 결과가 달라지는 것을 블록으로 확인합니다.' },
  'm5-l5': { tool: 'entry', description: '막혔을 때 필요한 만큼만 힌트를 열어 보는 방식을 연습합니다.' },
  'm5-l7': { tool: 'entry', description: '한 단계를 실행하고 결과를 확인한 뒤 다음으로 넘어갑니다.' },
  'm5-l9': { tool: 'entry', description: '틀린 지점을 찾아 그 블록만 고쳐 다시 실행합니다.' },
  'm5-l10': { tool: 'entry', description: '완성한 절차를 다른 문제에 옮겨 적용해 봅니다.' },

  'm6-l3': { tool: 'naverMap', description: '출발지와 목적지를 넣어 길을 찾고 표지와 맞춰 봅니다.' },
  'm6-l4': { tool: 'naverMap', description: '버스 번호와 방향을 확인하고 오늘 운행 정보를 함께 봅니다.' },
  'm6-l5': { tool: 'weather', description: '공식 예보를 확인해 활동에 맞는 준비물을 정합니다.' },
  'm6-l6': { tool: 'neis', description: '학교 급식 정보가 어디에서 오는지 공식 자료로 확인합니다.' },
  'm6-l11': { tool: 'privacy', description: '자기소개에 넣어도 되는 정보와 아닌 정보를 공식 안내로 가릅니다.' },
};

/** 선생님이 직접 만들어 올린 차시 영상. 채널명은 유튜브 oEmbed로 확인한 값이다. */
const LESSON_VIDEO: Partial<Record<LessonId, { id: string; title: string }>> = {
  'm1-l1': { id: 'iQ8A8ruR26g', title: 'AI를 이해하는 가장 쉬운 안내서' },
  'm1-l2': { id: '4Xh7K4irvck', title: '기계와 AI는 어떻게 다를까' },
  'm1-l3': { id: 'whi2UuA9-0k', title: 'AI는 어떻게 답을 만들까' },
};

const OWN_CHANNEL = '00학번ㅏ';

export function getTeacherResources(lessonId: LessonId): TeacherLink[] {
  const links: TeacherLink[] = [];

  const video = LESSON_VIDEO[lessonId];
  if (video) {
    links.push({
      kind: 'video',
      label: video.title,
      url: `https://www.youtube.com/watch?v=${video.id}`,
      source: OWN_CHANNEL,
      description: '이 차시를 위해 만든 영상입니다. 도입이나 정리에 활용하세요.',
      fallback: '영상 없이 이야기 장면을 함께 읽고 핵심을 정리합니다.',
      checkedAt: CHECKED,
    });
  }

  const assignment = LESSON_TOOL[lessonId];
  if (assignment) {
    const tool = TOOLS[assignment.tool];
    links.push({
      kind: 'tool',
      label: tool.label,
      url: tool.url,
      source: tool.source,
      description: assignment.description,
      fallback: tool.fallback,
      checkedAt: CHECKED,
    });
  }

  return links;
}

export { TOOLS, LESSON_TOOL, LESSON_VIDEO };
