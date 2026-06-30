import { useSettings } from '../../context/SettingsContext';

export default function FontSizeToggle() {
  const { fontSize, setFontSize } = useSettings();
  return (
    <button
      onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
      className="h-12 px-4 rounded border-2 font-semibold bg-white"
      style={{ borderColor: 'var(--accent)', color: 'var(--fg)' }}
      title="글자 크기"
    >Aa {fontSize === 'normal' ? '보통' : '크게'}</button>
  );
}
