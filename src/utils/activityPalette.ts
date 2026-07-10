// 원색·고채도 8색 — 밝은 배경 + 어두운 잉크(#1c1b1b) 글자로 AA(4.5:1) 통과.
// 가독성 위험 계열(진남·자두 등 어두운 색, 순수 빨강/파랑처럼 여유 얇은 색)은 제외했다.
// 모든 조합 대비 ≥5.9:1 (노랑 11.9 · 라임 11.3 · 스카이 8.9 …). 라벨·아이콘 모두 palette.text를 따른다.
export const ACTIVITY_PALETTE = [
  { bg: '#FFD23F', text: '#1c1b1b' }, // 노랑
  { bg: '#FF9F1C', text: '#1c1b1b' }, // 주황
  { bg: '#FF7A45', text: '#1c1b1b' }, // 코랄 (빨강 계열, 가독성 안전)
  { bg: '#FF5D8F', text: '#1c1b1b' }, // 핑크
  { bg: '#C77DFF', text: '#1c1b1b' }, // 바이올렛
  { bg: '#48CAE4', text: '#1c1b1b' }, // 스카이
  { bg: '#2DD4BF', text: '#1c1b1b' }, // 틸
  { bg: '#9BE564', text: '#1c1b1b' }, // 라임
] as const;

// 콘텐츠 기반 결정론 배정 — 같은 key(=icon 또는 label)는 항상 같은 색.
export function activityColor(key: string) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) >>> 0; // djb2
  return ACTIVITY_PALETTE[h % ACTIVITY_PALETTE.length];
}
