/**
 * 놀이·활동에서 쓰는 그림 — `public/images/games/*.jpg`.
 * 낱말이 인쇄돼 있지 않은 한 장짜리 그림이라, 학습지 편집기의 그림 고르기에서 카드 그림(글자 띠가 붙는다)으로 고를 수 있다.
 * 같은 사물을 각도만 바꿔 찍은 사진(lens-*)은 한 장씩만 둔다.
 */
export const GAME_ILLUSTRATIONS: ReadonlyArray<{ file: string; label: string }> = [
  { file: 'ai-facelock', label: '얼굴 인식 잠금' },
  { file: 'ai-music', label: '음악 추천 앱' },
  { file: 'ai-speaker', label: 'AI 스피커' },
  { file: 'ai-translate', label: '번역 앱' },
  { file: 'ai-vacuum', label: '로봇청소기' },
  { file: 'car-top', label: '자동차' },
  { file: 'card-adult', label: '어른' },
  { file: 'card-calculator', label: '계산기' },
  { file: 'card-data', label: '학습 자료' },
  { file: 'card-facecover', label: '얼굴 가리기' },
  { file: 'card-official', label: '공식 공지' },
  { file: 'card-password', label: '비밀번호' },
  { file: 'card-stoptime', label: '멈출 시간' },
  { file: 'card-when', label: '날짜' },
  { file: 'lens-book-0', label: '책' },
  { file: 'lens-cup-0', label: '컵' },
  { file: 'lens-scissors-0', label: '가위' },
  { file: 'photo-field', label: '운동장' },
  { file: 'photo-gate', label: '교문' },
  { file: 'photo-picnic', label: '소풍' },
  { file: 'plain-clock', label: '시계' },
  { file: 'plain-fan', label: '선풍기' },
  { file: 'plain-handle', label: '손잡이' },
  { file: 'plain-kettle', label: '주전자' },
  { file: 'plain-switch', label: '스위치' },
];

export function gameIllustrationSrc(file: string): string {
  return `/images/games/${file}.jpg`;
}
