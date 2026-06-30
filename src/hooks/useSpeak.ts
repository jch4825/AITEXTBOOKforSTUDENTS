import { useCallback } from 'react';
import { useSettings } from '../context/SettingsContext';
import { speak as rawSpeak, stopSpeaking } from '../utils/tts';

export function useSpeak() {
  const { ttsEnabled } = useSettings();

  const speak = useCallback((text: string) => {
    if (!ttsEnabled) return;
    rawSpeak(text);
  }, [ttsEnabled]);

  return { speak, stop: stopSpeaking, enabled: ttsEnabled };
}
