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
  'm2-l1': { id: '3NSqDsrVKSM', title: '완벽한 AI 답변을 얻는 비결', seconds: 506 },
  'm2-l2': { id: 'SnuriBKKIRM', title: '싱글 태스킹 단계별 AI 대화법', seconds: 316 },
  'm2-l3': { id: 'IOmaTY9bh70', title: '정확하게 말하기 더 나은 AI 답변의 비밀', seconds: 373 },
  'm2-l4': { id: 'g-Jq9OnRe6E', title: '완벽한 예시 하나의 힘 퓨샷 프롬프팅', seconds: 379 },
  'm2-l5': { id: 'HvsOkbRQ9-E', title: 'AI 대화 완벽하게 마스터하기', seconds: 306 },
  'm2-l6': { id: '7wt6h814-FM', title: '프롬프트 조립 공장 완벽한 AI 답변 만들기', seconds: 459 },
  'm2-l7': { id: '7D_dIQvpnN4', title: '스마트 피드백의 기술', seconds: 341 },
  'm2-l8': { id: 'TnU8Uovh9A4', title: 'AI 길들이기 출력 형식의 마법', seconds: 392 },
  'm2-l9': { id: 'LIf122CsUCs', title: '다시 묻기와 진짜 팩트체크', seconds: 398 },
  'm2-l10': { id: '1Tty-mqxZYg', title: '협업의 여정 AI 완벽 대화 마스터', seconds: 350 },
  'm3-l1': { id: 'aHC6aCWSkIc', title: '궁금한 것을 깊게 묻기 슈퍼파워 깨우기', seconds: 466 },
  'm3-l2': { id: 'Q1vx34WwSjo', title: '복잡한 낱말, AI 비유로 풀기', seconds: 325 },
  'm3-l3': { id: 'AQfRmMGG32Y', title: 'AI와 함께하는 파인만 학습법', seconds: 358 },
  'm3-l4': { id: '1QXbVrq_jAk', title: '단어를 내 것으로 만드는 법', seconds: 474 },
  'm3-l5': { id: 'mhacNn7rW24', title: 'AI와 이야기 함께 만들기', seconds: 391 },
  'm3-l6': { id: 'iRbu0gZaqdw', title: '당당한 실수 AI가 수학을 어려워하는 이유', seconds: 303 },
  'm3-l7': { id: 'krpkGaxDP_c', title: '긴 글의 핵심을 남기기', seconds: 373 },
  'm3-l8': { id: 'PQ-Jic-QksA', title: 'AI 과외 생각의 근육 키우기', seconds: 337 },
  'm3-l9': { id: 'rbyzNJKhwR8', title: '사실 vs 추측 시각 탐정 가이드', seconds: 543 },
  'm3-l10': { id: 'ss-27z8VhC8', title: '마법의 3줄 복습 노트', seconds: 371 },
  'm4-l1': { id: 'J4jObt3bmks', title: '당당한 AI의 맨얼굴 진실 탐험가 가이드', seconds: 474 },
  'm4-l2': { id: 'e7B9cD7n1qI', title: '믿을 만한 자료 고르기 가이드', seconds: 436 },
  'm4-l3': { id: '2CkxJmON3K4', title: '디지털 비밀 보호하기', seconds: 370 },
  'm4-l4': { id: 'BCt7Of4JYQE', title: '디지털 세계의 황금 열쇠', seconds: 444 },
  'm4-l5': { id: 'PovVf0BSBFI', title: '디지털 탐정 AI 셀카 속 비밀 찾기', seconds: 273 },
  'm4-l6': { id: 'us1869uN9oo', title: 'AI 생존 가이드 예상치 못한 답변 대처법', seconds: 346 },
  'm4-l7': { id: 'TxUEgBAipVY', title: 'AI 치트키 왜 매너가 똑똑한 기계를 만드는가', seconds: 341 },
  'm4-l8': { id: 'JjIbwJjEPy4', title: '스마트한 AI 이용 시간 관리', seconds: 380 },
  'm4-l9': { id: 'XlSQFNPkAig', title: '디지털 위험 SOS 이상한 요청 대처법', seconds: 335 },
  'm4-l10': { id: '1_CvJ_1hJtg', title: '추천 속 숨겨진 단서 찾기', seconds: 364 },
  'm5-l1': { id: 'qy3nXeOJTYU', title: '탐정 가이드 일상의 미스터리 풀기', seconds: 420 },
  'm5-l2': { id: 'fG0Q4_x4UX0', title: '작업 분할 막막한 과제 해결법', seconds: 465 },
  'm5-l3': { id: 'tNMGg3BWbos', title: '이유가 있는 순서 만들기', seconds: 428 },
  'm5-l4': { id: 'zjaEYg-bjL0', title: '우선순위의 마법 무엇부터 할지 결정하기', seconds: 403 },
  'm5-l5': { id: 'EOWTVQ6Y87g', title: '든든한 힌트 조력자, AI 활용법', seconds: 464 },
  'm5-l6': { id: 'r30sxr8WEiI', title: 'AI와 오해 없이 소통하는 방법', seconds: 309 },
  'm5-l7': { id: '8xYLht05rsw', title: '단계별 실행과 중간 점검의 힘', seconds: 353 },
  'm5-l8': { id: 't4v8AMijGsc', title: '목표와 결과를 비교하기', seconds: 445 },
  'm5-l9': { id: '2NKSPYwMeo0', title: '합리적인 의사결정의 오래된 비밀', seconds: 448 },
  'm5-l10': { id: '-VTjrhpj88g', title: '디버깅 오류를 찾아 다시 시험하기', seconds: 442 },
  'm5-l11': { id: 'zFSmR_MdSnA', title: '계획이 바뀔 때 안전한 플랜 B', seconds: 473 },
  'm6-l1': { id: 'YCbUz1l8SGs', title: '조건에 맞는 장보기 AI 초안 완성', seconds: 475 },
  'm6-l2': { id: '7YHXIV6Fj2w', title: '완벽한 금융 계산 가이드', seconds: 361 },
  'm6-l3': { id: 'O7JJYnhF6UE', title: '지도 앱 안내 vs 실제 도로 안전', seconds: 408 },
  'm6-l4': { id: 'Cim8GbG39n4', title: '완벽한 버스 탑승 가이드', seconds: 390 },
  'm6-l5': { id: 'yN6OX0FLlDA', title: '날씨 생존 가이드 변덕스러운 날씨 이겨내기', seconds: 358 },
  'm6-l6': { id: 'CvAkKU7K45o', title: '안전한 레시피 탐험', seconds: 476 },
  'm6-l7': { id: 'Mc3mKBVlH4k', title: '나에게 맞는 하루 계획', seconds: 343 },
  'm6-l8': { id: 'Fpy3fxe350g', title: 'AI가 아닌 사람에게 의지하세요!', seconds: 410 },
  'm6-l9': { id: 'wsYSBJaRah0', title: '당당한 소통 내 방식으로 표현하기', seconds: 430 },
  'm6-l10': { id: 'T5RP28fQHCM', title: 'AI 엽서를 넘어 진짜 직업 탐험', seconds: 499 },
  'm6-l11': { id: '_EEVfXYTJzo', title: '완벽한 디지털 자기소개 만들기', seconds: 452 },
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
