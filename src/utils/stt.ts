/**
 * Lightweight wrapper around the (non-standard) Web Speech Recognition API.
 * Caller is responsible for UI / permission handling.
 */

interface MinimalSpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

export function isSttSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

export interface SttHandle {
  stop: () => void;
}

export function startListening(opts: {
  onResult: (text: string) => void;
  onError?: (msg: string) => void;
  onEnd?: () => void;
}): SttHandle | null {
  const Ctor = (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) as SpeechRecognitionCtor | undefined;
  if (!Ctor) {
    opts.onError?.('음성 인식이 지원되지 않습니다');
    return null;
  }
  const rec = new Ctor();
  rec.lang = 'ko-KR';
  rec.continuous = false;
  rec.interimResults = false;
  rec.onresult = (ev) => {
    const text = ev.results?.[0]?.[0]?.transcript ?? '';
    opts.onResult(text);
  };
  rec.onerror = (ev) => opts.onError?.(ev.error);
  rec.onend = () => opts.onEnd?.();
  try { rec.start(); } catch (err) { opts.onError?.(String(err)); return null; }
  return { stop: () => rec.stop() };
}
