import Icon from '../Icon';

interface Props {
  onClick: () => void;
}

export default function DictionaryTrigger({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="btn btn-secondary px-3 md:px-4"
      style={{ color: 'var(--fg)' }}
      title="쉬운 사전 열기"
      aria-label="쉬운 사전 열기"
    ><Icon name="book" size={20} /><span className="hidden sm:inline"> 사전</span></button>
  );
}
