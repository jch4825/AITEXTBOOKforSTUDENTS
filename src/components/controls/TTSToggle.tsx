import { useSettings } from '../../context/SettingsContext';
import { stopSpeaking } from '../../utils/tts';

export default function TTSToggle() {
  const { ttsEnabled, setTTSEnabled } = useSettings();
  return (
    <button
      onClick={() => {
        const next = !ttsEnabled;
        setTTSEnabled(next);
        if (!next) stopSpeaking();
      }}
      aria-pressed={ttsEnabled}
      className="h-12 px-4 rounded border-2 font-semibold"
      style={{
        background: ttsEnabled ? 'var(--accent)' : 'white',
        color: ttsEnabled ? 'white' : 'var(--fg)',
        borderColor: 'var(--accent)',
      }}
      title="읽어주기 켜기/끄기"
      aria-label={`읽어주기 ${ttsEnabled ? '켜짐' : '꺼짐'}`}
    >🔊<span className="hidden sm:inline"> {ttsEnabled ? '켜짐' : '꺼짐'}</span></button>
  );
}
