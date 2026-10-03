import type { LessonId } from '../types';

/**
 * 차시별 도움 영상 — 선생님이 직접 만들어 올린 설명 영상.
 *
 * 학생 화면(정리 노트의 도움 영상 카드)과 교사 자료(ClassroomDock)가 이 목록 하나를 함께 쓴다.
 * 영상 아이디가 두 곳에 따로 있으면 영상을 바꿀 때 한쪽이 옛 영상을 가리킨다.
 * 실제로 교사 자료에 적어 둔 영상 세 개가 지워져 404인 채로 남아 있었다.
 *
 * 영상은 보조 자료일 뿐이다. 학교망이 막거나 소리를 못 켜는 교실에서도
 * 영상 없이 핵심 학습이 끝까지 완료되어야 하므로, 영상을 다음 단계의 조건으로 삼지 않는다.
 *
 * 학생 화면은 카드를 눌러야 비로소 영상을 불러온다. 누르기 전에는 유튜브로 어떤 요청도 가지 않는다.
 * 주소는 쿠키를 심지 않는 youtube-nocookie.com 만 쓴다(scripts/check-lesson-videos.mjs 가 강제한다).
 *
 * 차시를 늘릴 때는 이 표에 한 줄만 더한다. 길이는 영상 정보의 duration(초)을 옮겨 적는다.
 */
export interface LessonVideo {
  /** 유튜브 영상 아이디 11자. 단축 주소 youtu.be/ 뒤의 값과 같다. */
  id: string;
  /** 영상 제목에서 차시 표기(m1-l1)와 겹친 공백을 뺀 것. 학생 카드와 교사 자료에 그대로 나온다. */
  title: string;
  /** 영상 길이(초). 학생이 누르기 전에 얼마나 걸리는지 알 수 있게 카드에 분 단위로 적는다. */
  seconds: number;
}

export const LESSON_VIDEO: Partial<Record<LessonId, LessonVideo>> = {
  'm1-l1': { id: 'MI8HGNZe7ys', title: '인공지능 AI 파헤치기', seconds: 542 },
  'm1-l2': { id: 'pZYW1Ca6Wls', title: '기계, 센서, AI 명확한 차이 해독', seconds: 484 },
  'm1-l3': { id: 'hm36W4KuAoA', title: '단어 잇기의 마법 AI 답변 생성', seconds: 446 },
  'm1-l4': { id: 'cXfUVJpDyUY', title: 'AI의 눈 이미지 인식의 마법', seconds: 376 },
  'm1-l5': { id: '47CPpUy9jfk', title: 'AI 음성 인식과 합성의 원리', seconds: 374 },
  'm1-l6': { id: 'rmRsDodvscw', title: 'AI의 특별한 식사 데이터와 편향의 비밀', seconds: 523 },
  'm1-l7': { id: 'M17Kia7F0fA', title: '빠른 AI와 꼼꼼한 사람', seconds: 330 },
  'm1-l8': { id: 'nmJVEEGj-zE', title: '사실 vs 판단 AI와 인간의 경계', seconds: 389 },
  'm1-l9': { id: 'fONX8CGR8Vs', title: '내게 딱 맞는 도구 고르기', seconds: 501 },
  'm1-l10': { id: 'Df5fGdiCLrs', title: 'AI 결과 사용 전 3단계 체크리스트', seconds: 426 },
};

/** 쿠키를 심지 않는 임베드 주소. 학생이 재생을 눌렀을 때만 이 주소로 간다. */
export const LESSON_VIDEO_EMBED_ORIGIN = 'https://www.youtube-nocookie.com';

export function getLessonVideo(lessonId: LessonId): LessonVideo | undefined {
  return LESSON_VIDEO[lessonId];
}

/** 새 탭에서 여는 시청 주소(교사 자료용). 단축 주소는 무엇을 여는지 알 수 없어 쓰지 않는다. */
export function lessonVideoWatchUrl(video: LessonVideo): string {
  return `https://www.youtube.com/watch?v=${video.id}`;
}

/**
 * 학생 화면에 끼우는 플레이어 주소.
 *
 * - autoplay: 카드를 눌러 연 것이므로 유튜브의 재생 단추를 한 번 더 누르게 하지 않는다.
 * - rel=0: 영상이 끝난 뒤 추천을 같은 채널 영상으로 좁힌다. 끄지는 못하므로
 *   끝났다는 신호(enablejsapi)를 받아 플레이어를 닫는 것까지 카드가 맡는다.
 * - hl=ko: 플레이어 안의 단추와 안내를 한국어로 띄운다.
 */
export function lessonVideoEmbedUrl(video: LessonVideo, pageOrigin: string): string {
  const params = new URLSearchParams({
    autoplay: '1',
    rel: '0',
    playsinline: '1',
    hl: 'ko',
    enablejsapi: '1',
    origin: pageOrigin,
  });
  return `${LESSON_VIDEO_EMBED_ORIGIN}/embed/${video.id}?${params.toString()}`;
}

/** 카드에 적는 길이. 1분 미만으로 줄어드는 일이 없게 최소 1분으로 올린다. */
export function lessonVideoMinutes(video: LessonVideo): number {
  return Math.max(1, Math.round(video.seconds / 60));
}
