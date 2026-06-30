interface Props {
  onClick: () => void;
}

export default function DictionaryTrigger({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="h-12 px-4 rounded border-2 font-semibold bg-white"
      style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
      title="쉬운 사전 열기"
    >📖 사전</button>
  );
}
