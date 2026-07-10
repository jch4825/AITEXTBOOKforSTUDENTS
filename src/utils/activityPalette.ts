// 종이 스티커 팔레트 — 흰 카드(paper-0) + 색 테두리·같은 색 립 (시안 B).
// 색은 테두리·립·연한 면(tint)으로만 쓰고 글자는 전 카드 공통 브랜드 잉크 —
// 6색 명도 통일이 세련미의 핵심. 카드 배경이 흰색이라 PECS 아이콘이 자연스럽게 녹아든다.
export const ACTIVITY_PALETTE = [
  { accent: '#E8825E', tint: '#FBEEE8' }, // 코랄
  { accent: '#E5A23C', tint: '#FAF0DC' }, // 앰버
  { accent: '#3FAE8C', tint: '#E3F4EE' }, // 틸
  { accent: '#4E93D9', tint: '#E8F1FA' }, // 블루
  { accent: '#9B7ED9', tint: '#F1ECFA' }, // 바이올렛
  { accent: '#E077A6', tint: '#FAEAF2' }, // 핑크
] as const;

// 콘텐츠 기반 결정론 배정 — 같은 key(=icon 또는 label)는 항상 같은 색.
export function activityColor(key: string) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) >>> 0; // djb2
  return ACTIVITY_PALETTE[h % ACTIVITY_PALETTE.length];
}
