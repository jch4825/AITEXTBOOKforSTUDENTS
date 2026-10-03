import React from 'react';
import { useSettings } from '../../context/SettingsContext';
import { stopSpeaking } from '../../utils/tts';
import Icon from '../Icon';

/**
 * 학생이 직접 쓰는 소리 칩. 저절로 나는 소리(효과음, 저절로 읽어 주기)를 한 번에 끄고 켠다.
 *
 * 한 교실에서 여러 대가 함께 소리를 내면 시끄럽고, 소리에 예민한 학생에게는 효과음이 부담이
 * 될 수 있다. 그래서 학생 화면에 끄는 길이 있어야 한다. 끄는 것은 저절로 나는 소리뿐이다.
 * 듣기 단추는 학생이 직접 누른 요청이라 꺼 둔 채로도 읽는다 — 소리를 끄고도 글은 들을 수 있다.
 * 좁은 태블릿 폭에서는 글자를 감추고 아이콘만 둬 상단 바가 비좁아지지 않게 한다.
 */
export default function SoundToggle() {
  const { soundEnabled, ttsEnabled, autoRead, setSoundEnabled, setTTSEnabled, setAutoRead } = useSettings();
  const on = soundEnabled || ttsEnabled || autoRead;
  const state = on ? '켬' : '끔';

  function toggle() {
    if (on) {
      setSoundEnabled(false);
      setTTSEnabled(false);
      setAutoRead(false);
      stopSpeaking();
    } else {
      // 저절로 읽기(autoRead)는 교사가 켜는 설정이라 학생이 다시 켜도 그대로 둔다.
      setSoundEnabled(true);
      setTTSEnabled(true);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      data-sound-toggle
      className="chrome-sticker"
      style={{ '--chrome-tint': 'var(--chrome-sound)' } as React.CSSProperties}
      title="저절로 나는 소리 켜기·끄기 (듣기 단추는 늘 읽어 줘요)"
      aria-label={`소리 (지금: ${state})`}
    >
      <span className="chrome-sticker-badge" aria-hidden>
        <Icon name={on ? 'speaker' : 'speaker-off'} size={16} />
      </span>
      <span className="hidden font-extrabold text-[color:var(--brand-ink)] lg:inline">
        소리 {state}
      </span>
    </button>
  );
}
