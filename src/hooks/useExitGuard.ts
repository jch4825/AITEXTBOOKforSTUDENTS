import { useEffect, useState } from 'react';

/**
 * 모바일 뒤로 가기 오조작 방지.
 *
 * 마운트할 때 같은 URL로 히스토리 항목 하나를 더 쌓아 둔다(가드). 뒤로 가기가 그 가드를
 * 소모하면 앱을 나가는 대신 안내 문구만 띄우고, 안내가 떠 있는 동안 한 번 더 누르면
 * 가드가 없으므로 브라우저가 실제로 앱을 벗어난다. 다시 누르지 않으면 잠시 뒤 가드를
 * 새로 쌓아 다음 오조작도 같은 방식으로 막는다.
 *
 * 앱 안에서의 이동은 `pushAppHistory`가 깊이를 1씩 올리므로, 깊이 0인 항목에 도착했을
 * 때만 가드가 동작한다. 즉 차시 → 목차 같은 내부 뒤로 가기는 그대로 작동한다.
 */

export const EXIT_GUARD_WINDOW_MS = 2400;

const DEPTH_KEY = 'appDepth';

function readDepth(): number {
  const state = window.history.state as Record<string, unknown> | null;
  const depth = state?.[DEPTH_KEY];
  return typeof depth === 'number' ? depth : 0;
}

/** 앱 내부 이동 기록. 가드 항목(깊이 0)과 구분하려고 깊이를 1 올린다. */
export function pushAppHistory(url: string): void {
  window.history.pushState({ [DEPTH_KEY]: readDepth() + 1 }, '', url);
}

/** 터치로 조작하는 기기에서만 필요하다. PC의 뒤로 가기는 그대로 둔다. */
function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(pointer: coarse)').matches) return true;
  return navigator.maxTouchPoints > 0;
}

export default function useExitGuard(): boolean {
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    if (!isTouchDevice()) return;

    let timer: number | undefined;

    function arm() {
      window.history.pushState({ [DEPTH_KEY]: readDepth() + 1 }, '');
    }

    function handlePop() {
      // 깊이가 남아 있으면 앱 안에서의 이동이므로 건드리지 않는다.
      if (readDepth() > 0) return;
      setWarning(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        setWarning(false);
        // 안내가 떠 있는 동안 학생이 앱 안에서 다른 화면으로 갔다면 가드가 이미 생겼다.
        if (readDepth() === 0) arm();
      }, EXIT_GUARD_WINDOW_MS);
    }

    window.history.replaceState({ ...(window.history.state ?? {}), [DEPTH_KEY]: 0 }, '');
    arm();
    window.addEventListener('popstate', handlePop);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('popstate', handlePop);
    };
  }, []);

  return warning;
}
