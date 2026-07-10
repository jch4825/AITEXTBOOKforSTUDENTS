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
// 평평한 단색은 심심하고 원색이 튄다. HSL로 (1) 살짝 파스텔화(채도↓·명도↑)하고
// (2) 색상환을 조금 돌린 다색(iridescent) 그라데이션 + (3) 아래 짙은 립(--edge)으로
// 눌리는 입체 캔디 버튼을 만든다. 글자는 어두운 잉크라 파스텔일수록 대비가 좋아진다.
function hexToHsl(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255, g = parseInt(c.slice(2, 4), 16) / 255, b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [h, s * 100, l * 100];
}
const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
const hsl = (h: number, s: number, l: number) =>
  `hsl(${((h % 360) + 360) % 360} ${clamp(s, 0, 100)}% ${clamp(l, 0, 100)}%)`;

/** bg 원색에서 다색 광택 그라데이션 배경 + 입체 립(edge) 색을 파생 */
export function activitySurface(bg: string) {
  const [h, s, l] = hexToHsl(bg);
  // 파스텔 베이스 — 채도 낮추고 명도 올림
  const baseS = s * 0.78;
  const baseL = clamp(l + 8, 0, 90);
  // 다색: 하이라이트는 색상환 -22°(따뜻하게), 딥은 +22°(차갑게)로 살짝 무지갯빛
  const hiColor = hsl(h - 22, baseS * 0.85, clamp(baseL + 18, 0, 97));
  const midColor = hsl(h, baseS, baseL);
  const loColor = hsl(h + 22, clamp(baseS * 1.08, 0, 100), clamp(baseL - 14, 0, 100));
  return {
    gradient: `linear-gradient(150deg, ${hiColor} 0%, ${midColor} 50%, ${loColor} 100%)`,
    // 립: 원색 색상 유지, 더 어둡게 — 그림자 두께감의 색
    edge: hsl(h + 8, clamp(s * 0.92, 0, 100), clamp(l - 22, 0, 100)),
  };
}
