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

// ── 입체(3D) 광택 버튼 표면 ─────────────────────────────────────────────
// 평평한 단색은 심심하고 원색이 튄다. 위쪽 하이라이트→아래쪽 짙은 립 그라데이션으로
// 광택 있는 캔디 버튼처럼 만들고, 아래 립(--edge)으로 눌리는 입체감을 준다.
function mix(hex: string, t: [number, number, number], amt: number): string {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16);
  const m = (a: number, bb: number) => Math.round(a + (bb - a) * amt);
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(m(r, t[0]))}${h(m(g, t[1]))}${h(m(b, t[2]))}`;
}
const lighten = (hex: string, amt: number) => mix(hex, [255, 255, 255], amt);
const darken = (hex: string, amt: number) => mix(hex, [0, 0, 0], amt);

/** bg 원색에서 광택 그라데이션 배경 + 입체 립(edge) 색을 파생 */
export function activitySurface(bg: string) {
  return {
    gradient: `linear-gradient(180deg, ${lighten(bg, 0.24)} 0%, ${bg} 52%, ${darken(bg, 0.1)} 100%)`,
    edge: darken(bg, 0.26),
  };
}
