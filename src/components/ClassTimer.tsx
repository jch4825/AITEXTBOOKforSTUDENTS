const PRESETS = [1, 3, 5, 10];

interface Props {
  remainingSec: number | null;
  running: boolean;
  onStart: (minutes: number) => void;
  onToggle: () => void;
  onReset: () => void;
}

export function formatTime(totalSec: number): string {
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ClassTimer({ remainingSec, running, onStart, onToggle, onReset }: Props) {
  const done = remainingSec === 0;
  return (
    <div className="p-3 w-64">
      <h3 className="mb-3 text-lg font-bold" style={{ color: 'var(--accent)' }}>타이머</h3>
      {remainingSec === null ? (
        <div className="grid grid-cols-4 gap-2">
          {PRESETS.map((m) => (
            <button
              key={m}
              onClick={() => onStart(m)}
              className="h-14 rounded-[var(--r-sm)] font-bold text-lg"
              style={{ background: 'var(--paper-2)', color: 'var(--accent)' }}
            >{m}분</button>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p
            className="text-5xl font-bold mb-4 tabular-nums"
            style={{ color: done ? 'var(--warn)' : 'var(--ink-1)' }}
          >{formatTime(remainingSec)}</p>
          <div className="flex justify-center gap-2">
            {!done && (
              <button
                onClick={onToggle}
                className="h-11 px-4 rounded-[var(--r-pill)] font-semibold"
                style={{ background: 'var(--paper-2)' }}
              >{running ? '멈춤' : '계속'}</button>
            )}
            <button
              onClick={onReset}
              className="h-11 px-4 rounded-[var(--r-pill)] font-semibold"
              style={{ background: 'var(--paper-2)' }}
            >리셋</button>
          </div>
        </div>
      )}
    </div>
  );
}
