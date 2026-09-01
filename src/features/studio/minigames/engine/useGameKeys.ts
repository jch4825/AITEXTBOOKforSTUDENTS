import { useEffect, useRef } from 'react';

/** 게임이 읽는 논리 키. 실제 자판 배열과 상관없이 이 이름으로만 다룬다. */
export type GameKey = 'left' | 'right' | 'up' | 'down' | 'action';

const KEY_MAP: Record<string, GameKey> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  a: 'left',
  d: 'right',
  w: 'up',
  s: 'down',
  A: 'left',
  D: 'right',
  W: 'up',
  S: 'down',
  ' ': 'action',
  Enter: 'action',
};

export interface GameKeyState {
  /** 지금 눌려 있는 키. 프레임 루프에서 읽는다. */
  held: { current: Record<GameKey, boolean> };
  /** 이번 프레임에 새로 눌린 키를 한 번만 꺼낸다. 점프처럼 한 번만 반응할 조작에 쓴다. */
  consumePress: (key: GameKey) => boolean;
}

/**
 * 키보드 조작.
 *
 * 이 교재는 PC 1280px을 먼저 본다. 마우스로만 되는 게임은 한 손으로 마우스를 쥐기
 * 어려운 학생에게 통째로 닫힌다. 그래서 움직임이 있는 게임은 모두 방향키와 스페이스로도
 * 조작되게 하고, 그 입력을 여기서 한 번만 만든다.
 *
 * active가 false면 키를 받지 않는다. 성공 배너가 떠 있는 동안 공이 계속 움직이면
 * 학생이 결과를 읽을 시간이 사라진다.
 *
 * 방향키는 페이지를 스크롤시키므로 게임이 켜져 있는 동안에만 기본 동작을 막는다.
 */
export function useGameKeys(active: boolean): GameKeyState {
  const held = useRef<Record<GameKey, boolean>>({
    left: false, right: false, up: false, down: false, action: false,
  });
  const pressed = useRef<Record<GameKey, boolean>>({
    left: false, right: false, up: false, down: false, action: false,
  });

  useEffect(() => {
    if (!active) {
      held.current = { left: false, right: false, up: false, down: false, action: false };
      return;
    }
    if (typeof window === 'undefined') return;

    const down = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.key];
      if (!key) return;
      event.preventDefault();
      if (!held.current[key]) pressed.current[key] = true;
      held.current[key] = true;
    };
    const up = (event: KeyboardEvent) => {
      const key = KEY_MAP[event.key];
      if (!key) return;
      event.preventDefault();
      held.current[key] = false;
    };
    const blur = () => {
      held.current = { left: false, right: false, up: false, down: false, action: false };
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, [active]);

  const consumePress = (key: GameKey) => {
    if (!pressed.current[key]) return false;
    pressed.current[key] = false;
    return true;
  };

  return { held, consumePress };
}
