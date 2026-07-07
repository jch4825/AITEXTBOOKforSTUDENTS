import { useSettings } from '../../context/SettingsContext';

export default function FontSizeToggle() {
  const { fontSize, setFontSize } = useSettings();
  return (
    <button
      onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
      className="btn btn-secondary px-3 md:px-4"
      style={{ color: 'var(--fg)' }}
      title="글자 크기"
      aria-label={`글자 크기 (지금: ${fontSize === 'normal' ? '보통' : '크게'})`}
    >Aa<span className="hidden sm:inline"> {fontSize === 'normal' ? '보통' : '크게'}</span></button>
  );
}
