import { useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import { speak as rawSpeak, stopSpeaking } from '../utils/tts';

export function useSpeak() {
  const { ttsEnabled } = useSettings();

  // 자동 내레이션용 — 전역 '읽어주기' 토글이 꺼져 있으면 침묵한다.
  // (정리 화면 자동 읽기, 게임 문제·피드백 자동 읽기 등 수동 조작이 아닌 소리.)
  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    rawSpeak(text);
  }, [ttsEnabled]);

  // 명시적 '읽어줘/들려줘' 버튼용 — 학생이 직접 누른 읽기 요청이므로
  // 전역 토글과 무관하게 항상 읽어준다. (토글은 자동 읽기만 제어)
  const speakNow = useCallback((text: string) => {
    rawSpeak(text);
  }, []);

  return { speak, speakNow, stop: stopSpeaking, enabled: ttsEnabled };
}
