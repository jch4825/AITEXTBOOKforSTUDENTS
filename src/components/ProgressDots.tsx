interface Props {
  total: number;
  current: number; // 0-indexed
}

export default function ProgressDots({ total, current }: Props) {
  return (
    <div className="flex justify-center gap-2.5" aria-label={`${total}단계 중 ${current + 1}단계`}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="h-4 w-4 rounded-full"
          style={{
            background: i <= current ? 'var(--accent)' : 'transparent',
            border: `2px solid var(--accent)`,
          }}
        />
      ))}
    </div>
  );
}
