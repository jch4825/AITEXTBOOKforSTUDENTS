/** Strip markdown-ish syntax so TTS doesn't read backticks/asterisks aloud. */
export function stripForSpeech(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

let activeUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  
  // Resolve Google Chrome Speech Synthesis lock-up state
  window.speechSynthesis.resume();
  window.speechSynthesis.cancel();
  
  const cleanText = stripForSpeech(text);
  const u = new SpeechSynthesisUtterance(cleanText);
  
  // Hold active reference to block Chrome's Garbage Collection bug from muting voice mid-speech
  activeUtterance = u;
  
  u.lang = 'ko-KR';
  u.rate = opts?.rate ?? 1.0;
  u.pitch = opts?.pitch ?? 1.0;
  
  u.onend = () => {
    if (activeUtterance === u) activeUtterance = null;
  };
  u.onerror = () => {
    if (activeUtterance === u) activeUtterance = null;
  };
  
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
