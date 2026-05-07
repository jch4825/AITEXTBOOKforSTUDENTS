import React, { useEffect, useState } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speak, stopSpeaking } from '../utils/a11y';

interface SpeakButtonProps {
  text: string;
  label?: string;
  className?: string;
  size?: number;
  stopPropagation?: boolean;
}

export default function SpeakButton({
  text,
  label = '읽어주기',
  className = '',
  size = 14,
  stopPropagation = false,
}: SpeakButtonProps) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (!window.speechSynthesis?.speaking) setPlaying(false);
    }, 300);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    return () => {
      if (playing) stopSpeaking();
    };
  }, [playing]);

  const handleClick = (e: React.MouseEvent) => {
    if (stopPropagation) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (playing) {
      stopSpeaking();
      setPlaying(false);
    } else {
      speak(text);
      setPlaying(true);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={playing ? '읽기 중지' : label}
      title={playing ? '읽기 중지' : label}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
        playing
          ? 'border-red-200 bg-red-50 text-red-600'
          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
      } ${className}`}
    >
      {playing ? <Square size={size} /> : <Volume2 size={size} />}
      <span className="hidden sm:inline">{playing ? '중지' : '듣기'}</span>
    </button>
  );
}
