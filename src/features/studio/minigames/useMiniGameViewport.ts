import { useEffect, useState } from 'react';

/**
 * 놀이를 열 수 없는 화면 크기.
 *
 * 미니게임의 조작은 드래그·조준·타이밍처럼 공간을 쓰는 손동작이다. 390px 휴대전화에서는
 * 판과 손가락이 겹쳐 조작 자체가 성립하지 않으므로, 태블릿(768px)부터 연다.
 *
 * 두 번째 조건은 가로로 눕힌 휴대전화를 걸러낸다. 폭만 보면 844px이라 태블릿처럼 보이지만
 * 세로가 390px밖에 안 되어 판이 잘린다. 손가락 입력(coarse)이면서 세로가 짧을 때만 걸리므로
 * 창을 낮게 줄인 PC는 그대로 통과한다.
 *
 * 쉼표는 OR이고 and가 먼저 묶이므로 "좁거나, (손가락 입력이면서 낮거나)"로 읽는다.
 */
export const MINI_GAME_BLOCKED_QUERY = '(max-width: 767px), (pointer: coarse) and (max-height: 599px)';

function matchesBlocked() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia(MINI_GAME_BLOCKED_QUERY).matches;
}

/**
 * 지금 화면에서 놀이를 열 수 있는지.
 *
 * 화면을 돌리거나 창 크기를 바꾸면 바로 따라간다. 막힌 동안에는 게임 컴포넌트를 아예
 * 그리지 않으므로 lazy 청크도 내려받지 않는다.
 */
export function useMiniGamePlayable(): boolean {
  const [playable, setPlayable] = useState(() => !matchesBlocked());

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const query = window.matchMedia(MINI_GAME_BLOCKED_QUERY);
    const sync = () => setPlayable(!query.matches);
    sync();
    query.addEventListener?.('change', sync);
    // 미디어 질의 이벤트를 흘리는 브라우저 창(미리보기 패널 등)이 있어 크기 변화도 함께 듣는다.
    window.addEventListener('resize', sync);
    return () => {
      query.removeEventListener?.('change', sync);
      window.removeEventListener('resize', sync);
    };
  }, []);

  return playable;
}
