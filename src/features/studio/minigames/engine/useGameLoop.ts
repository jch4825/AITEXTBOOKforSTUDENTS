import { useEffect, useRef, useState } from 'react';

/**
 * 미니게임 공용 프레임 루프.
 *
 * setInterval로 게임을 돌리면 프레임마다 간격이 흔들려 같은 조작이 판마다 다르게
 * 느껴진다. requestAnimationFrame으로 돌리고 경과 시간(dt)을 넘겨, 화면이 60Hz든
 * 120Hz든 같은 속도로 움직이게 한다.
 *
 * dt는 0.05초(20fps)로 잘라 둔다. 탭을 잠깐 가렸다 돌아오면 한 프레임에 몇 초가
 * 밀려 들어와 공이 벽을 뚫고 지나가기 때문이다.
 *
 * step은 ref에 담아 두므로 호출부가 useCallback으로 감쌀 필요가 없다. 게임 코드가
 * 의존성 배열 때문에 복잡해지는 것을 막는다.
 */
export function useGameLoop(
  active: boolean,
  step: (dt: number, elapsed: number) => void,
): void {
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (!active) return;
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') return;

    let frame = 0;
    let last = 0;
    let elapsed = 0;
    let stopped = false;

    const tick = (now: number) => {
      if (stopped) return;
      if (last === 0) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      elapsed += dt;
      stepRef.current(dt, elapsed);
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => {
      stopped = true;
      window.cancelAnimationFrame(frame);
    };
  }, [active]);
}

/**
 * 움직임 줄이기 설정.
 *
 * 게임의 본체 움직임(공·발판·적)은 조작 그 자체라 끌 수 없다. 대신 흔들림·잔상·
 * 반짝임 같은 장식 효과만 이 값을 보고 끈다.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  return reduced;
}

/**
 * 남은 시간 타이머.
 *
 * 제한 시간이 있는 게임에서 초를 세는 일은 어디서나 같으므로 여기에 둔다.
 * running이 false면 멈추고, key가 바뀌면 처음부터 다시 센다.
 */
export function useCountdown(
  running: boolean,
  seconds: number,
  key: number,
  onTimeout: () => void,
): number {
  const [left, setLeft] = useState(seconds);
  const timeoutRef = useRef(onTimeout);
  timeoutRef.current = onTimeout;

  useEffect(() => {
    setLeft(seconds);
  }, [seconds, key]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) return;
    const timer = window.setTimeout(() => {
      setLeft((value) => {
        const next = Math.max(0, value - 0.1);
        if (next <= 0) timeoutRef.current();
        return next;
      });
    }, 100);
    return () => window.clearTimeout(timer);
  }, [running, left]);

  return left;
}
