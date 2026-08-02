import type { CSSProperties } from 'react';

interface SparkleParticle {
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  rise: number;
  color: string;
  rotation: number;
}

const SPARKLE_COLORS = ['#f2c94c', '#f28b66', '#67c7b5', '#7b9fe8', '#de86b4', '#fff1ad'];

// 마지막 장면이 뜨는 즉시 화면 곳곳에서 시작하되, 내용과 조작을 가리지 않도록
// 작은 빛만 한 번 반짝이고 사라진다. 값은 재생할 때마다 같은 위치를 써서 화면이
// 흔들리거나 Strict Mode에서 서로 다른 모습으로 그려지지 않게 한다.
const SPARKLES: SparkleParticle[] = Array.from({ length: 60 }, (_, index) => ({
  left: 4 + ((index * 37) % 93),
  top: 8 + ((index * 29) % 82),
  size: 10 + ((index * 7) % 15),
  delay: (index % 10) * 65,
  duration: 1050 + ((index * 83) % 550),
  rise: 24 + ((index * 11) % 42),
  color: SPARKLE_COLORS[index % SPARKLE_COLORS.length],
  rotation: (index * 31) % 90,
}));

type SparkleStyle = CSSProperties & Record<`--sparkle-${string}`, string>;

export default function FinalSceneSparkles() {
  return (
    <div
      className="final-scene-sparkles"
      data-final-scene-sparkles="true"
      aria-hidden="true"
    >
      {SPARKLES.map((sparkle, index) => (
        <span
          key={index}
          className="final-scene-sparkle"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            color: sparkle.color,
            '--sparkle-size': `${sparkle.size}px`,
            '--sparkle-delay': `${sparkle.delay}ms`,
            '--sparkle-duration': `${sparkle.duration}ms`,
            '--sparkle-rise': `${sparkle.rise}px`,
            '--sparkle-rotation': `${sparkle.rotation}deg`,
          } as SparkleStyle}
        />
      ))}
    </div>
  );
}
