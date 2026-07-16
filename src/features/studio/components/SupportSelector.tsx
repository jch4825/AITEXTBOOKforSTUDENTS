import type { SupportLevel } from '../types';

interface Props {
  value: SupportLevel;
  accent: string;
  onChange: (value: SupportLevel) => void;
}

const OPTIONS: Array<{ value: SupportLevel; label: string; description: string }> = [
  {
    value: 'full',
    label: '충분한 지원',
    description: '중요한 정보를 줄여서 보고, 선택지를 적게 받아요.',
  },
  {
    value: 'light',
    label: '약한 지원',
    description: '핵심 힌트를 받고 내 방법을 정해요.',
  },
  {
    value: 'challenge',
    label: '도전적',
    description: '여러 조건과 AI 의견의 한계까지 비교해요.',
  },
];

export default function SupportSelector({ value, accent, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="font-bold">오늘 사용할 지원 수준</p>
      <div className="grid gap-2 lg:grid-cols-3" role="radiogroup" aria-label="지원 수준 선택">
        {OPTIONS.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option.value)}
              className="min-h-24 rounded-xl border-2 p-3 text-left transition-colors"
              style={{
                borderColor: selected ? accent : 'var(--editorial-line)',
                background: selected ? 'var(--editorial-quiet)' : 'var(--editorial-paper)',
              }}
            >
              <strong className="block" style={{ color: selected ? accent : 'var(--editorial-ink)' }}>
                {option.label}
              </strong>
              <span className="mt-1 block text-sm leading-relaxed text-[color:var(--muted)]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
