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

export function speak(text: string, opts?: { rate?: number; pitch?: number }) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(stripForSpeech(text));
  u.lang = 'ko-KR';
  u.rate = opts?.rate ?? 1.0;
  u.pitch = opts?.pitch ?? 1.0;
  window.speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
