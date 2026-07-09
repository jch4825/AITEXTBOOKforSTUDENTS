// 보석톤 6색 — 흰 글자 AA(4.5:1) 통과하도록 어둡고 채도 있는 색. 마티스풍(진하지만 서로 다투지 않음).
export const ACTIVITY_PALETTE = [
  { bg: '#2B4C7E', text: '#FFFFFF' }, // 진남
  { bg: '#B14D33', text: '#FFFFFF' }, // 벽돌/코랄
  { bg: '#7E5E10', text: '#FFFFFF' }, // 오커/머스터드 (흰 글자 AA 위해 어둡게)
  { bg: '#37704C', text: '#FFFFFF' }, // 포레스트
  { bg: '#6E4A8E', text: '#FFFFFF' }, // 자두/보라
  { bg: '#1F6E7C', text: '#FFFFFF' }, // 청록
] as const;

// 콘텐츠 기반 결정론 배정 — 같은 key(=icon 또는 label)는 항상 같은 색.
export function activityColor(key: string) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) >>> 0; // djb2
  return ACTIVITY_PALETTE[h % ACTIVITY_PALETTE.length];
}
