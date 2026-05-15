import { useEffect, useState } from 'react';

// localStorage에 저장된 값을 미러링하는 React 상태를 만든다.
// 같은 탭(커스텀 이벤트) · 다른 탭(storage 이벤트) 양쪽에서 변경되어도
// 자동으로 다시 읽어 동기화한다.
//
// `read`는 안정적인 참조여야 한다(모듈 최상위 함수 또는 useCallback).
// `eventName`은 storage.ts의 dispatch*Changed가 발행하는 동일 탭 이벤트 이름.
export function useExternalStorageState<T>(read: () => T, eventName: string): T {
  const [value, setValue] = useState<T>(read);
  useEffect(() => {
    const refresh = () => setValue(read());
    window.addEventListener(eventName, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(eventName, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [read, eventName]);
  return value;
}
