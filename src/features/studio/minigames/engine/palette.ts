/**
 * 캔버스 게임 색.
 *
 * 캔버스에는 CSS 변수를 그대로 넣을 수 없어 게임마다 색을 직접 적게 되고, 그러면
 * 40개 게임의 파랑이 조금씩 달라진다. `--board-*` 토큰과 같은 값을 여기 한 번 적어 두고
 * 모두가 이것만 쓴다.
 *
 * 형광색은 쓰지 않는다. 어두운 판 위에서도 글자는 ink로만 쓰고, 강조색은 도형과
 * 테두리에만 쓴다(디자인 시스템 계약).
 */
export const BOARD = {
  bg: '#0F172A',
  surface: '#1E293B',
  overlay: '#020617',
  line: '#64748B',
  ink: '#F8FAFC',
  inkDim: '#CBD5E1',
} as const;

export const PLAY = {
  /** 학생이 조종하는 것 */
  hero: '#FBBF24',
  heroEdge: '#B45309',
  /** 목표·성공 */
  goal: '#34D399',
  goalEdge: '#047857',
  /** 장애물·위험 */
  hazard: '#FB7185',
  hazardEdge: '#9F1239',
  /** 정보·중립 구조물 */
  info: '#38BDF8',
  infoEdge: '#0369A1',
  /** 보조 강조 */
  extra: '#C4B5FD',
  extraEdge: '#6D28D9',
} as const;

/**
 * 둥근 사각형의 경로만 만든다. 칠하지 않는다.
 *
 * 테두리만 그리려고 fillRoundRect를 부르면 속까지 칠해져 그 안에 그려 둔 것이 덮인다.
 * 실제로 m1-l4에서 액자 테두리가 사진을 통째로 덮은 적이 있어 함수를 갈라 두었다.
 */
export function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/** 둥근 사각형을 지금 fillStyle로 채운다. */
export function fillRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  roundRectPath(ctx, x, y, w, h, r);
  ctx.fill();
}

/**
 * 테두리가 있는 판. 게임의 모든 면은 2px 이상 경계를 가진다는 계약을 캔버스에서도 지킨다.
 * 캔버스는 960x540 가상 단위라 3을 쓰면 화면에서 대략 2px로 보인다.
 */
export function panel(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  fill: string, edge: string, r = 12,
): void {
  ctx.fillStyle = fill;
  fillRoundRect(ctx, x, y, w, h, r);
  ctx.strokeStyle = edge;
  ctx.lineWidth = 3;
  ctx.stroke();
}

/** 가운데 정렬 글자. 캔버스 글자는 최소 20 가상 단위(화면 약 14px)를 지킨다. */
export function centerText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  size = 24,
  color: string = BOARD.ink,
  weight = '800',
): void {
  ctx.font = `${weight} ${size}px "Pretendard", system-ui, sans-serif`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}
