import type { CSSProperties } from 'react';

/** 이야기 마지막 장면에서 한 번 재생하는 완료 연출. 종이·공작 어휘 안에서만 고른다. */
export const FINAL_SCENE_CELEBRATIONS = ['sparkle', 'confetti', 'bubble', 'petal', 'stamp'] as const;

export type FinalSceneCelebrationKind = typeof FINAL_SCENE_CELEBRATIONS[number];

/**
 * 62차시가 같은 연출을 반복하면 "다 봤다"는 신호가 배경 소음이 된다. 차시 아이디로 풀에서
 * 하나를 고르되, 같은 차시는 언제 다시 열어도 같은 연출이 나오도록 결정적으로 계산한다.
 * 학생이 "이 차시는 색종이"라고 예상할 수 있어야 놀람이 불안이 되지 않는다.
 */
export function celebrationFor(lessonId?: string): FinalSceneCelebrationKind {
  if (!lessonId) return 'sparkle';
  let hash = 0;
  for (let index = 0; index < lessonId.length; index += 1) {
    hash = (hash * 31 + lessonId.charCodeAt(index)) % 1000003;
  }
  return FINAL_SCENE_CELEBRATIONS[hash % FINAL_SCENE_CELEBRATIONS.length];
}

/** 종이 톤에 맞춘 따뜻한 6색. 형광색은 쓰지 않는다. */
const CELEBRATION_COLORS = ['#f2c94c', '#f28b66', '#67c7b5', '#7b9fe8', '#de86b4', '#fff1ad'];

interface Particle {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  travel: number;
  drift: number;
  rotation: number;
  color: string;
}

interface Recipe {
  count: number;
  /** 떨어지는 연출은 화면 높이를 건너야 하므로 vh, 제자리에서 뜨는 연출은 px를 쓴다. */
  travelUnit: 'px' | 'vh';
  /** 값은 모두 인덱스 산술로 만든다. 재생할 때마다, StrictMode 이중 렌더에서도 같은 그림이어야 한다. */
  build: (index: number) => Omit<Particle, 'color'>;
}

const RECIPES: Record<FinalSceneCelebrationKind, Recipe> = {
  // 반짝이 — 화면 곳곳에서 작은 빛이 한 번 피었다 진다.
  sparkle: {
    travelUnit: 'px',
    count: 60,
    build: (i) => ({
      left: 4 + ((i * 37) % 93),
      top: 8 + ((i * 29) % 82),
      size: 10 + ((i * 7) % 15),
      delay: (i % 10) * 65,
      duration: 1050 + ((i * 83) % 550),
      travel: 24 + ((i * 11) % 42),
      drift: 0,
      rotation: (i * 31) % 90,
    }),
  },
  // 색종이 — 위에서 종잇조각이 돌면서 떨어진다. 종이 체계에 가장 가까운 연출.
  confetti: {
    travelUnit: 'vh',
    count: 48,
    build: (i) => ({
      left: 3 + ((i * 43) % 95),
      top: -12 - ((i * 17) % 26),
      size: 9 + ((i * 5) % 9),
      delay: (i % 12) * 70,
      duration: 1500 + ((i * 61) % 700),
      travel: 108 + ((i * 13) % 26),
      drift: -34 + ((i * 23) % 68),
      rotation: (i * 47) % 360,
    }),
  },
  // 비눗방울 — 테두리만 있는 동그라미가 천천히 떠오르다 톡 사라진다.
  bubble: {
    travelUnit: 'px',
    count: 30,
    build: (i) => ({
      left: 6 + ((i * 53) % 89),
      top: 74 + ((i * 19) % 24),
      size: 16 + ((i * 11) % 26),
      delay: (i % 8) * 95,
      duration: 1650 + ((i * 71) % 650),
      travel: 210 + ((i * 29) % 130),
      drift: -22 + ((i * 17) % 44),
      rotation: 0,
    }),
  },
  // 꽃잎 — 좌우로 흔들리며 내려앉는다. 가장 조용한 연출.
  petal: {
    travelUnit: 'vh',
    count: 36,
    build: (i) => ({
      left: 4 + ((i * 41) % 93),
      top: -10 - ((i * 13) % 22),
      size: 12 + ((i * 7) % 12),
      delay: (i % 9) * 105,
      duration: 1900 + ((i * 67) % 800),
      travel: 106 + ((i * 11) % 22),
      drift: -48 + ((i * 31) % 96),
      rotation: (i * 53) % 360,
    }),
  },
  // 도장 — 가운데에서 물결이 한 번 퍼진다. 배움 도장 은유를 그대로 쓴다.
  stamp: {
    travelUnit: 'px',
    count: 5,
    build: (i) => ({
      left: 50,
      top: 46,
      size: 96 + i * 58,
      delay: i * 110,
      duration: 1150 + i * 90,
      travel: 0,
      drift: 0,
      rotation: -8 + i * 4,
    }),
  },
};

type ParticleStyle = CSSProperties & Record<`--fs-${string}`, string>;

function particlesFor(kind: FinalSceneCelebrationKind): Particle[] {
  const recipe = RECIPES[kind];
  return Array.from({ length: recipe.count }, (_, index) => ({
    ...recipe.build(index),
    color: CELEBRATION_COLORS[index % CELEBRATION_COLORS.length],
  }));
}

/**
 * 마지막 장면 진입 때 한 번만 재생한다. 화면 전체를 덮지만 `pointer-events: none`이라
 * 조작을 막지 않고, `prefers-reduced-motion`에서는 CSS가 통째로 정지시킨다.
 */
export default function FinalSceneCelebration({ lessonId }: Props) {
  const kind = celebrationFor(lessonId);
  const { travelUnit } = RECIPES[kind];

  return (
    <div
      className="final-scene-celebration"
      data-final-scene-celebration={kind}
      aria-hidden="true"
    >
      {particlesFor(kind).map((particle, index) => (
        <span
          key={index}
          className="final-scene-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            color: particle.color,
            '--fs-size': `${particle.size}px`,
            '--fs-delay': `${particle.delay}ms`,
            '--fs-duration': `${particle.duration}ms`,
            '--fs-travel': `${particle.travel}${travelUnit}`,
            '--fs-drift': `${particle.drift}px`,
            '--fs-rotation': `${particle.rotation}deg`,
          } as ParticleStyle}
        />
      ))}
    </div>
  );
}

interface Props {
  /** 풀에서 연출을 고르는 기준. 없으면 반짝이로 떨어진다. */
  lessonId?: string;
}

