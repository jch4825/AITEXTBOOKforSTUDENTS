import { useRef, useState } from 'react';
import { isSttSupported, startListening, type SttHandle } from '../utils/stt';
import Icon from './Icon';

interface Props {
  onResult: (text: string) => void;
  accent: string;
  disabled?: boolean;
  onStart?: () => void;
}

export default function MicButton({ onResult, accent, disabled, onStart }: Props) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleRef = useRef<SttHandle | null>(null);

  if (!isSttSupported()) {
    return (
      <button
        type="button"
        disabled
        aria-label="음성 입력을 쓸 수 없어요. 글로 써 주세요"
        title="이 브라우저에서는 음성 입력을 쓸 수 없어요. 글로 써 주세요."
        className="shrink-0 h-13 w-13 rounded-full border-2 cursor-not-allowed flex items-center justify-center"
        style={{ borderColor: 'var(--line)', color: 'var(--ink-3)', background: 'var(--paper-2)' }}
      ><Icon name="mic" size={22} /></button>
    );
  }

  function toggle() {
    if (listening) {
      handleRef.current?.stop();
      return;
    }
    onStart?.();
    setError(null);
    const handle = startListening({
      onResult: (text) => {
        if (text) onResult(text);
      },
      onError: (msg) => {
        const humanMsg =
          msg === 'not-allowed' ? '마이크 사용을 허용해 주세요.'
          : msg === 'no-speech' ? '소리가 들리지 않았어요. 다시 눌러서 말해 보세요.'
          : '음성 인식이 잘 안 됐어요. 한 번 더 말하거나 글로 써 주세요.';
        setError(humanMsg);
        setListening(false);
      },
      onEnd: () => {
        handleRef.current = null;
        setListening(false);
      },
    });
    if (handle) {
      handleRef.current = handle;
      setListening(true);
    }
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={toggle}
        disabled={disabled}
        aria-label={listening ? '녹음 중지' : '말로 입력하기'}
        title={listening ? '듣는 중… 눌러서 멈추기' : '눌러서 말하기'}
        className={`h-13 w-13 rounded-full border-2 flex items-center justify-center transition ${listening ? 'motion-safe:animate-pulse' : ''}`}
        style={{
          borderColor: accent,
          color: listening ? 'white' : accent,
          background: listening ? accent : 'var(--paper-0)',
        }}
      ><Icon name={listening ? 'mic-on' : 'mic'} size={22} /></button>
      {error && (
        <span
          className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-xs px-2 py-0.5 rounded z-10"
          style={{ background: 'var(--warn-bg)', color: 'var(--warn)' }}
        >{error}</span>
      )}
    </div>
  );
}
