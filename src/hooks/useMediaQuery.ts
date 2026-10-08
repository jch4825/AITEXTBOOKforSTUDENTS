import { useEffect, useState } from 'react';

/**
 * 미디어 쿼리가 지금 맞는지 따라가는 훅. 배치는 CSS가 바꾸고, 이 훅은 배치에 따라 달라져야 하는
 * 접근성 속성(예: 탭 목록의 aria-orientation)처럼 CSS로 못 바꾸는 것에만 쓴다.
 */
export default function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(query).matches,
  );

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
}
