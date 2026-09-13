/**
 * 놀이 파트의 바우하우스 어휘.
 *
 * 게임 62개가 각자 색을 적고 각자 이모지를 골라 쓰면서 임의 색상 83종이 487번,
 * 이모지가 618번 흩어져 있었다. 투박함의 원인은 취향이 아니라 공통 어휘가 없다는
 * 것이었다. 그래서 놀이 파트만 하나의 문법으로 묶는다 — 원·사각형·삼각형과 그 파생,
 * 평면 채색, 검정 윤곽선, 그림자 없음, 격자 배치.
 *
 * 교과서 본문은 지금의 따뜻한 종이 체계를 그대로 쓴다. 놀이로 넘어가는 순간 어휘가
 * 통째로 바뀌는 것이 "이제 놀이 시간"이라는 신호가 된다.
 *
 * `npm run check:game-visual`이 이 파일 밖에서 색을 적거나 이모지를 쓰는 것을 막는다.
 */

/*
 * 색.
 *
 * 바우하우스의 빨강·파랑·노랑을 쓰되 색상만 가져오고 명도는 이 저장소의 대비 계약에
 * 맞춰 낮췄다. 아래 숫자는 실제로 계산한 대비비다.
 *
 * 종이(#F4F1EA) 위 — ink 15.43 · red 7.33 · blue 7.04 · grey 7.10 : 모두 글자로 쓸 수 있다.
 * 판(#16181C) 위 — ink 15.89 · blue 7.15 · yellow 10.90 · red 5.85 · grey 5.47.
 *   red와 grey는 7:1에 못 미치므로 **면과 테두리 전용**이고 글자는 ink로만 쓴다.
 *
 * 노랑은 종이 위에서 1.70이다. 도형의 최소 대비 3:1에도 못 미치므로 종이 위의 노랑은
 * **반드시 검정 윤곽선과 함께** 써야 한다. 윤곽선이 경계를 대신 만든다. 이것은 취향이
 * 아니라 노랑을 쓰기 위한 조건이고, 마침 바우하우스 원판의 문법이기도 하다.
 *
 * 그리고 판 위에서 빨강과 파랑의 대비는 1.22다. 색상만 다르고 밝기가 거의 같다는 뜻이라,
 * 색을 구별하지 못하면 둘은 같은 회색이 된다. **뜻은 언제나 모양이 함께 진다.**
 */
export const BAUHAUS = {
  /** 프레임 — 이름표·난이도 탭·지시문·버튼·배너가 놓이는 면 */
  paper: {
    ground: '#F4F1EA',
    ink: '#1A1A1A',
    red: '#96221B',
    blue: '#1B4F9C',
    /** 면 전용. 검정 윤곽선 없이 쓰지 않는다. */
    yellow: '#E8B400',
    grey: '#4C5157',
    /** 도형을 두르는 선. 종이 위에서는 검정이다. */
    keyline: '#1A1A1A',
  },
  /**
   * 놀이판 — 어두운 면.
   *
   * 2026-09-13 레퍼런스("FORM & COLOR: Bauhaus Arcade")를 따라 다시 잡았다. 앞의 값은 대비를
   * 맞추느라 명도를 끌어올려 원색이 물 빠진 파스텔이 됐다. 이번에는 **면에 칠하는 색과
   * 글자에 쓰는 색을 나눈다.** red·blue는 면 전용이고, 판 위 글자는 redInk·blueInk가 맡는다.
   * 괄호 안은 ground(#161616) 위 대비비다. 같은 값이 index.css의 --game-board-*에 있다.
   */
  board: {
    ground: '#161616',
    /** 바탕보다 한 겹 뜬 구조물 면(길·띠·패널) */
    surface: '#1F1F1F',
    high: '#242424',
    /** 패널 테두리·칸 나눔 줄. 장식선이라 대비를 요구하지 않는다. */
    line: '#404040',
    /** 제도 격자 줄과 교차점 */
    grid: '#242424',
    gridDot: '#3A3A3A',
    ink: '#F5F3F0', // 16.34
    /** 보조 글자. 앞의 회색(5.47)은 면 전용이었는데 글자에 예순 곳 넘게 쓰였다. */
    grey: '#A8A29E', // 7.18
    red: '#D90429', // 3.45 — 면 전용, 흰 글자 5.25
    blue: '#2B5CF0', // 3.35 — 면 전용, 흰 글자 5.40
    yellow: '#FFD000', // 12.30 — 검정 글자 12.73
    /** 판 위에 글자로 쓰는 빨강·파랑 */
    redInk: '#FF8A80', // 7.93
    blueInk: '#8FB0FF', // 8.46
    /** 어두운 판에서는 검정 선이 보이지 않으므로 밝은 선으로 두른다. */
    keyline: '#F5F3F0',
    /** 떠 있는 판을 받치는 검정. lift가 쓴다. */
    shadow: '#000000',
  },
} as const;

/**
 * 뜻과 형태의 짝.
 *
 * 칸딘스키가 원·사각형·삼각형에 파랑·빨강·노랑을 짝지은 것을 이 교과서의 의미 축에
 * 얹었다. 색이 아니라 이 짝 자체가 규칙이다. 학생은 색을 못 가려도 모양으로 읽는다.
 *
 * 앞서 쓰던 초록(목표)은 바우하우스 팔레트에 없어 파랑 사각형으로 옮겼다. 대신 얻은
 * 것이 있다 — 빨강 삼각형이 위험이라는 것은 도로 표지판과 같은 관습이다.
 */
export const ROLE = {
  /** 학생이 조종하는 것 */
  hero: { shape: 'circle', tone: 'yellow' },
  /** 목표·성공·안전 */
  goal: { shape: 'square', tone: 'blue' },
  /** 위험·장애물·피할 것 */
  hazard: { shape: 'triangle', tone: 'red' },
  /** 중립 구조물·바닥·틀 */
  frame: { shape: 'bar', tone: 'grey' },
} as const;

/** 선 굵기 세 단(캔버스 가상 단위). 이 셋 밖의 값을 쓰지 않는다. */
export const STROKE = { hair: 3, base: 5, heavy: 9 } as const;

/**
 * 격자.
 *
 * 960×540을 12칸으로 나눈 80 단위. 판 위의 모든 것은 이 격자에 맞춘다. 바우하우스에서
 * 비대칭과 대각선은 매력이지만, HUD가 판마다 다른 자리에 있으면 학생은 매번 다시
 * 찾는다. **형태는 바우하우스, 배치는 격자 고정**이 이 교재의 규칙이다.
 */
export const GRID = 80;
export const snap = (v: number): number => Math.round(v / GRID) * GRID;

export type ShapeKind =
  | 'circle' | 'ring' | 'square' | 'bar'
  | 'triangle' | 'semicircle' | 'quarter' | 'diamond' | 'cross';

interface ShapeOptions {
  /**
   * 떠 있는 높이(가상 단위). 같은 모양을 검정으로 이만큼 비스듬히 밀어 먼저 깐다.
   *
   * 레퍼런스의 촉감은 흐림 없는 딱딱한 어긋남에서 나온다. 그림자처럼 번지지 않아
   * 평면을 해치지 않는다. 한 요소에 하나만 쓴다. 3~6이면 충분하다.
   */
  lift?: number;
  /** 채울 색. 없으면 칠하지 않는다. */
  fill?: string;
  /** 두를 색. 종이 위 노랑에는 반드시 있어야 한다. */
  stroke?: string;
  width?: number;
  /** 라디안. 삼각형을 돌려 화살표로 쓸 때 등에 쓴다. */
  rotate?: number;
  /** ring과 cross의 굵기 비율(지름 대비). */
  thickness?: number;
}

/** 도형의 경로만 만든다. 칠하거나 두르는 것은 부르는 쪽이 정한다. */
export function shapePath(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  cx: number,
  cy: number,
  size: number,
  rotate = 0,
): void {
  const r = size / 2;
  const pt = (a: number, rad: number): [number, number] => {
    const x = Math.cos(a) * rad;
    const y = Math.sin(a) * rad;
    const c = Math.cos(rotate);
    const s = Math.sin(rotate);
    return [cx + x * c - y * s, cy + x * s + y * c];
  };
  const poly = (points: Array<[number, number]>) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
  };

  switch (kind) {
    case 'circle':
    case 'ring':
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      break;
    case 'square':
      poly([pt(-Math.PI * 0.75, r * Math.SQRT2), pt(-Math.PI * 0.25, r * Math.SQRT2),
        pt(Math.PI * 0.25, r * Math.SQRT2), pt(Math.PI * 0.75, r * Math.SQRT2)]);
      break;
    case 'diamond':
      poly([pt(-Math.PI / 2, r), pt(0, r), pt(Math.PI / 2, r), pt(Math.PI, r)]);
      break;
    case 'triangle':
      /* 꼭짓점이 위를 본다. rotate로 돌려 화살표로도 쓴다. */
      poly([pt(-Math.PI / 2, r), pt(Math.PI / 6, r), pt((Math.PI * 5) / 6, r)]);
      break;
    case 'semicircle':
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI + rotate, Math.PI * 2 + rotate);
      ctx.closePath();
      break;
    case 'quarter':
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, Math.PI + rotate, Math.PI * 1.5 + rotate);
      ctx.closePath();
      break;
    case 'bar': {
      /* 가로가 세로의 두 배인 막대. 사각형과 한눈에 갈려야 한다.
         비율이 자유로운 막대가 필요하면 drawBar를 쓴다. */
      const hw = r;
      const hh = r / 2;
      poly([
        pt(Math.atan2(-hh, -hw), Math.hypot(hw, hh)), pt(Math.atan2(-hh, hw), Math.hypot(hw, hh)),
        pt(Math.atan2(hh, hw), Math.hypot(hw, hh)), pt(Math.atan2(hh, -hw), Math.hypot(hw, hh)),
      ]);
      break;
    }
    case 'cross': {
      const t = r * 0.34;
      poly([
        pt(Math.atan2(-t, -r), Math.hypot(r, t)), pt(Math.atan2(-t, r), Math.hypot(r, t)),
        pt(Math.atan2(t, r), Math.hypot(r, t)), pt(Math.atan2(t, -r), Math.hypot(r, t)),
      ]);
      break;
    }
    default:
      ctx.beginPath();
  }
}

/** 도형 하나를 그린다. 칠과 선을 함께 다룬다. */
export function drawShape(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  cx: number,
  cy: number,
  size: number,
  options: ShapeOptions = {},
): void {
  const { fill, stroke, width = STROKE.base, rotate = 0, thickness = 0.24, lift = 0 } = options;

  if (lift > 0 && kind !== 'ring' && kind !== 'cross') {
    shapePath(ctx, kind, cx + lift, cy + lift, size, rotate);
    ctx.fillStyle = BAUHAUS.board.shadow;
    ctx.fill();
  }

  if (kind === 'ring') {
    ctx.beginPath();
    ctx.arc(cx, cy, (size / 2) * (1 - thickness / 2), 0, Math.PI * 2);
    ctx.lineWidth = size * thickness;
    ctx.strokeStyle = fill ?? stroke ?? BAUHAUS.board.ink;
    ctx.stroke();
    return;
  }

  if (kind === 'cross') {
    /* 십자는 가로 막대와 세로 막대 둘로 그린다. 한 경로로 만들면 안쪽 모서리가 어긋난다. */
    const t = size * thickness;
    for (const angle of [rotate, rotate + Math.PI / 2]) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.rect(-size / 2, -t / 2, size, t);
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
      ctx.restore();
    }
    return;
  }

  shapePath(ctx, kind, cx, cy, size, rotate);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) {
    ctx.lineWidth = width;
    ctx.strokeStyle = stroke;
    ctx.lineJoin = 'miter';
    ctx.stroke();
  }
}

/** 가로세로 비율이 다른 막대. 바닥·틀·진행 막대에 쓴다. 모서리를 둥글리지 않는다. */
export function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  options: ShapeOptions = {},
): void {
  const { fill, stroke, width = STROKE.base, lift = 0 } = options;
  if (lift > 0) {
    ctx.fillStyle = BAUHAUS.board.shadow;
    ctx.fillRect(x + lift, y + lift, w, h);
  }
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = width; ctx.strokeStyle = stroke; ctx.stroke(); }
}

export type MarkKind = 'arrow' | 'check' | 'cross' | 'retry' | 'sound' | 'dot' | 'bang';

/**
 * 이모지를 대신하는 기하 마크.
 *
 * 앞서는 🔄·❤️·➡·💡 같은 이모지를 618번 썼다. 이모지는 기기와 글꼴마다 모양이 달라
 * 같은 뜻이 화면마다 다르게 보이고, 크기와 색을 다룰 수도 없으며, 손으로 그린 그림들과
 * 결이 맞지 않았다. 같은 뜻을 도형으로 직접 그린다.
 */
export function drawMark(
  ctx: CanvasRenderingContext2D,
  mark: MarkKind,
  cx: number,
  cy: number,
  size: number,
  color: string,
  rotate = 0,
): void {
  const r = size / 2;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotate);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  switch (mark) {
    case 'arrow': {
      /* 막대 하나와 삼각형 하나. 기본은 오른쪽을 본다. */
      ctx.fillRect(-r, -size * 0.11, r * 1.1, size * 0.22);
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(r * 0.1, -r * 0.62);
      ctx.lineTo(r * 0.1, r * 0.62);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'check': {
      ctx.lineWidth = size * 0.2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.78, 0);
      ctx.lineTo(-r * 0.16, r * 0.62);
      ctx.lineTo(r * 0.82, -r * 0.66);
      ctx.stroke();
      break;
    }
    case 'cross': {
      ctx.lineWidth = size * 0.2;
      ctx.beginPath();
      ctx.moveTo(-r * 0.68, -r * 0.68);
      ctx.lineTo(r * 0.68, r * 0.68);
      ctx.moveTo(r * 0.68, -r * 0.68);
      ctx.lineTo(-r * 0.68, r * 0.68);
      ctx.stroke();
      break;
    }
    case 'retry': {
      /* 한 바퀴에서 한 조각을 비운 고리와, 그 끝에 붙는 삼각형. */
      ctx.lineWidth = size * 0.18;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.74, Math.PI * 0.32, Math.PI * 1.9);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r * 0.74, -r * 0.52);
      ctx.lineTo(r * 0.22, -r * 0.52);
      ctx.lineTo(r * 0.62, r * 0.02);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'sound': {
      /* 사각형 몸통 하나와 호 두 개. 나팔 모양을 기하로 줄인 것이다. */
      ctx.fillRect(-r * 0.9, -r * 0.34, r * 0.7, r * 0.68);
      ctx.beginPath();
      ctx.moveTo(-r * 0.2, -r * 0.34);
      ctx.lineTo(r * 0.16, -r * 0.82);
      ctx.lineTo(r * 0.16, r * 0.82);
      ctx.lineTo(-r * 0.2, r * 0.34);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = size * 0.11;
      for (const rad of [r * 0.52, r * 0.82]) {
        ctx.beginPath();
        ctx.arc(r * 0.16, 0, rad, -Math.PI * 0.34, Math.PI * 0.34);
        ctx.stroke();
      }
      break;
    }
    case 'dot': {
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'bang': {
      /* 세로 막대와 점. 놀람·주의를 글자 없이 나타낸다. */
      ctx.fillRect(-size * 0.11, -r * 0.9, size * 0.22, r * 1.1);
      ctx.beginPath();
      ctx.arc(0, r * 0.66, size * 0.13, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

/**
 * 남은 기회를 사각형 칩으로 그린다.
 *
 * 하트 이모지를 늘어놓던 자리다. 여덟 개를 넘으면 칩 하나와 숫자로 바꾸는 규칙은
 * GameHud와 같다 — 서른 개가 넘는 게임에서 칩이 줄을 가득 채웠다.
 */
export function drawLives(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, chip: number,
  lives: number, maxLives: number, tone: string, dim: string,
): void {
  const gap = chip * 0.45;
  for (let i = 0; i < Math.min(maxLives, 8); i += 1) {
    drawBar(ctx, x + i * (chip + gap), y, chip, chip, { fill: i < lives ? tone : dim });
  }
}

/**
 * 가운데 정렬 글자.
 *
 * 옛 팔레트 파일에 있던 것을 여기로 옮겼다. 색이 한 곳에서만 오게 되면서 그 파일에
 * 남을 것이 이 함수뿐이었다.
 *
 * 캔버스 글자는 최소 20 가상 단위(화면에서 대략 14px)를 지킨다. 그보다 작으면
 * 읽히지 않고, 읽히지 않는 글은 견줄 거리가 되지 못한다.
 */
export function centerText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  size = 24,
  color: string = BAUHAUS.board.ink,
  weight = '800',
): void {
  /* 숫자·로마자는 Space Grotesk, 한글은 Pretendard가 받는다. 글꼴이 늦게 들어와도
     판은 매 프레임 다시 그리므로 곧 제 모양으로 바뀐다. */
  ctx.font = `${weight} ${size}px ${CANVAS_FONT}`;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

/* ── 레퍼런스에서 가져온 판의 세부 ─────────────────────────────────────── */

/** 캔버스 글꼴. 숫자·로마자는 Space Grotesk, 한글은 Pretendard가 받는다. */
export const CANVAS_FONT = '"Space Grotesk", "Pretendard Variable", "Pretendard", system-ui, sans-serif';

/**
 * 판 바탕을 칠한다 — 바탕색, 제도 격자, 네 귀퉁이 꺾쇠.
 *
 * 게임마다 `ctx.fillRect(0, 0, W, H)`로 검정만 칠하던 자리를 대신한다. 레퍼런스의 판은
 * 빈 검정이 아니라 제도지다. 40 단위마다 가는 줄, 80 단위(격자 한 칸) 교차점마다 점을
 * 찍어, 판이 이 교재의 12칸 격자 위에 있다는 것을 드러낸다.
 *
 * 줄은 반투명으로 흐리게 하지 않고 바탕보다 한 단 밝은 불투명한 색으로 긋는다.
 * 놀이 조각보다 먼저 그려지므로 조각을 가리지 않는다.
 */
export function paintBoard(
  ctx: CanvasRenderingContext2D,
  w = 960,
  h = 540,
): void {
  const B = BAUHAUS.board;
  ctx.fillStyle = B.ground;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = B.grid;
  for (let x = 40; x < w; x += 40) ctx.fillRect(x, 0, 1, h);
  for (let y = 40; y < h; y += 40) ctx.fillRect(0, y, w, 1);
  ctx.fillStyle = B.gridDot;
  for (let x = GRID; x < w; x += GRID) {
    for (let y = GRID; y < h; y += GRID) ctx.fillRect(x - 2, y - 2, 4, 4);
  }

  /* 귀퉁이 꺾쇠. 판의 끝이 어디인지 알려 주는 제도 표시다. */
  const arm = 18;
  const inset = 8;
  ctx.fillStyle = B.grey;
  const corners: Array<[number, number, number, number]> = [
    [inset, inset, 1, 1], [w - inset, inset, -1, 1],
    [inset, h - inset, 1, -1], [w - inset, h - inset, -1, -1],
  ];
  for (const [cx, cy, dx, dy] of corners) {
    ctx.fillRect(dx > 0 ? cx : cx - arm, dy > 0 ? cy : cy - 2, arm, 2);
    ctx.fillRect(dx > 0 ? cx : cx - 2, dy > 0 ? cy : cy - arm, 2, arm);
  }
}

/**
 * 떠 있는 패널. 머리띠가 있으면 위쪽에 사각 표식과 이름을 적고 줄로 가른다.
 *
 * 레퍼런스의 카드는 모두 이 모양이다 — 면, 테두리, 딱딱한 어긋남 하나, 그리고 머리띠.
 * 머리띠 글자는 캔버스 바닥인 20 단위를 지킨다.
 */
export function drawPanel(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  options: { fill?: string; stroke?: string; lift?: number; header?: string; accent?: string } = {},
): void {
  const B = BAUHAUS.board;
  const { fill = B.surface, stroke = B.line, lift = 4, header, accent = B.yellow } = options;
  drawBar(ctx, x, y, w, h, { fill, stroke, width: STROKE.hair, lift });
  if (header) {
    ctx.fillStyle = accent;
    ctx.fillRect(x + 14, y + 15, 10, 10);
    ctx.font = `700 20px ${CANVAS_FONT}`;
    ctx.fillStyle = B.grey;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(header, x + 32, y + 20);
    ctx.fillStyle = B.line;
    ctx.fillRect(x + 1, y + 38, w - 2, 2);
  }
}

/**
 * 꼬리표. 한 가지 색으로 칠한 작은 사각 딱지에 짧은 글을 얹는다.
 *
 * 레퍼런스의 "FEVER ACTIVE", "NEW RECORD!" 자리다. 검정 테두리와 어긋남을 함께 줘서 판
 * 위에 붙인 딱지처럼 보이게 한다. 글자는 20 단위 바닥을 지킨다.
 */
export function drawTag(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number, y: number,
  options: { fill?: string; ink?: string; size?: number; align?: 'left' | 'center' | 'right' } = {},
): { w: number; h: number } {
  const B = BAUHAUS.board;
  const { fill = B.yellow, ink = B.ground, size = 20, align = 'left' } = options;
  ctx.font = `700 ${size}px ${CANVAS_FONT}`;
  const w = Math.ceil(ctx.measureText(text).width) + 20;
  const h = size + 12;
  const left = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  drawBar(ctx, left, y - h / 2, w, h, { fill, stroke: B.shadow, width: 2, lift: 2 });
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, left + w / 2, y + 1);
  return { w, h };
}

/**
 * 칸으로 나뉜 막대. 진행·게이지를 이어진 띠가 아니라 셀 수 있는 칸으로 보여 준다.
 *
 * 숫자를 못 읽는 학생도 칸은 센다. 레퍼런스의 박자 막대와 조화도 막대가 이 모양이다.
 */
export function drawSegments(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  value: number, total: number,
  options: { fill?: string; empty?: string; gap?: number } = {},
): void {
  const B = BAUHAUS.board;
  const { fill = B.yellow, empty = B.high, gap = 4 } = options;
  const count = Math.max(1, Math.round(total));
  const cell = (w - gap * (count - 1)) / count;
  const filled = Math.min(count, Math.max(0, value));
  for (let i = 0; i < count; i += 1) {
    const left = x + i * (cell + gap);
    drawBar(ctx, left, y, cell, h, { fill: empty });
    if (i < Math.floor(filled)) {
      drawBar(ctx, left, y, cell, h, { fill });
    } else if (i < filled) {
      /* 칸 하나가 차오르는 중이면 그 칸만 부분을 칠한다. */
      drawBar(ctx, left, y, cell * (filled - i), h, { fill });
    }
  }
}

/**
 * 비어 있는 자리의 윤곽. 무엇이 들어올 자리인지 점선으로 그린다.
 *
 * 레퍼런스의 판정 띠에 놓인 점선 도형 자리다. 반투명 면을 깔지 않고 선만 긋는다.
 */
export function drawGhost(
  ctx: CanvasRenderingContext2D,
  kind: ShapeKind,
  cx: number, cy: number, size: number,
  color: string,
): void {
  ctx.save();
  ctx.setLineDash([8, 6]);
  drawShape(ctx, kind, cx, cy, size, { stroke: color, width: STROKE.hair });
  ctx.restore();
}

/**
 * 튀어나오는 칭찬 딱지. 조금 기울인 큰 딱지로 "잘했다"를 순간에 알린다.
 *
 * 레퍼런스의 "PERFECT!" 자리다. 기울기는 3도 안팎으로만 준다 — 판의 배치는 격자에
 * 맞추지만, 순간의 신호는 격자에서 살짝 벗어나야 눈에 띈다.
 */
export function drawPop(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number, cy: number,
  options: { fill?: string; ink?: string; size?: number; rotate?: number; scale?: number } = {},
): void {
  const B = BAUHAUS.board;
  const { fill = B.yellow, ink = B.ground, size = 30, rotate = -0.05, scale = 1 } = options;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotate);
  ctx.scale(scale, scale);
  ctx.font = `800 ${size}px ${CANVAS_FONT}`;
  const w = Math.ceil(ctx.measureText(text).width) + 36;
  const h = size + 22;
  drawBar(ctx, -w / 2, -h / 2, w, h, { fill, stroke: B.keyline, width: STROKE.hair, lift: 4 });
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 2);
  ctx.restore();
}
