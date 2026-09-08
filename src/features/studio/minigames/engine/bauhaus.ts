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
  /** 놀이판 — 유일한 어두운 면 */
  board: {
    ground: '#16181C',
    /** 바탕보다 한 겹 뜬 구조물 면(길·띠·판). 글자를 얹지 않으므로 대비를 요구하지 않는다. */
    surface: '#1F2328',
    ink: '#F5F2EA',
    red: '#F2685E',
    blue: '#6FA8E8',
    yellow: '#F5C518',
    grey: '#8A8F98',
    /** 어두운 판에서는 검정 선이 보이지 않으므로 밝은 선으로 두른다. */
    keyline: '#F5F2EA',
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
  const { fill, stroke, width = STROKE.base, rotate = 0, thickness = 0.24 } = options;

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
  const { fill, stroke, width = STROKE.base } = options;
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
