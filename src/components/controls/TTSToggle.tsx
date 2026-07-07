import { useSettings } from '../../context/SettingsContext';
import { stopSpeaking } from '../../utils/tts';
import Icon from '../Icon';

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
      className={`btn px-3 md:px-4 ${ttsEnabled ? 'btn-primary' : 'btn-secondary'}`}
      style={ttsEnabled ? undefined : { color: 'var(--fg)' }}
      title="읽어주기 켜기/끄기"
      aria-label={`읽어주기 ${ttsEnabled ? '켜짐' : '꺼짐'}`}
    ><Icon name="speaker" size={20} /><span className="hidden sm:inline"> {ttsEnabled ? '켜짐' : '꺼짐'}</span></button>
  );
}
