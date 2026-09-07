import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { SettingsProvider } from './context/SettingsContext';
import { ProgressProvider } from './context/ProgressContext';
import './index.css';

/*
 * 배포 직후 낡은 화면이 새 파일을 찾다 실패하는 것을 막는다.
 *
 * 미니게임 62개는 들어갈 때 하나씩 받아 온다. 새 판을 올리면 파일 이름이 바뀌는데,
 * 브라우저가 이전 화면을 캐시에서 그대로 들고 있으면 이미 받아 둔 단원의 놀이는 열리고
 * 아직 안 받은 단원의 놀이만 없는 파일을 찾다 열리지 않는다. 그때 한 번만 새로 고쳐
 * 최신 화면을 받는다. 한 번으로 제한해 두어야 실패가 이어질 때 무한 새로 고침이 되지 않는다.
 */
window.addEventListener('vite:preloadError', () => {
  try {
    if (sessionStorage.getItem('ai-students-reloaded-for-update') === '1') return;
    sessionStorage.setItem('ai-students-reloaded-for-update', '1');
  } catch {
    /* 저장소를 막아 둔 브라우저에서는 새로 고치지 않는다. 되풀이될 수 있기 때문이다. */
    return;
  }
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </SettingsProvider>
  </StrictMode>
);
