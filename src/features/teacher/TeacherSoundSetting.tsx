import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import { READING_SUPPORT_MODULES } from '../../data/readingSupport';
import { playSound } from '../../utils/sound';
import { listKoreanVoices, speak, speechSynthesisSupported, stopSpeaking } from '../../utils/tts';

type VoiceCheck =
  | { status: 'idle' }
  | { status: 'checking' }
  | { status: 'done'; supported: boolean; voices: { name: string; local: boolean }[] };

const TEST_SENTENCE = '안녕하세요. 소리가 잘 들리나요? 이 목소리로 학생에게 글을 읽어 줍니다.';

/** 읽기 지원이 켜진 단원을 말로 옮긴다. 여섯 단원이 모두 켜져 있으면 "모든 단원". */
function readingSupportModuleNames(): string {
  if (READING_SUPPORT_MODULES.length >= 6) return '모든 단원';
  return READING_SUPPORT_MODULES.map((id) => `${Number(id.slice(1))}단원`).join(', ');
}

/**
 * 수업 환경의 소리 설정: 효과음, 자동 읽기, 읽어 주기 점검 (05-ENGINE-SPEC §7).
 *
 * 효과음과 읽어 주기(TTS)는 별개 토글이다. 한 교실에서 여러 대가 동시에 소리를 내면 시끄러워
 * 교사가 한 번에 끌 수 있어야 하고, 반대로 소리를 끄더라도 대사 읽어 주기는 남아야
 * 하는 학생이 있기 때문이다.
 */
export default function TeacherSoundSetting() {
  const { soundEnabled, setSoundEnabled, autoRead, setAutoRead } = useSettings();
  const [check, setCheck] = useState<VoiceCheck>({ status: 'idle' });

  async function runVoiceCheck() {
    stopSpeaking();
    setCheck({ status: 'checking' });
    const voices = await listKoreanVoices();
    setCheck({
      status: 'done',
      supported: speechSynthesisSupported(),
      voices: voices.map((voice) => ({ name: voice.name, local: voice.localService })),
    });
    if (voices.length > 0) speak(TEST_SENTENCE);
  }

  return (
    <section className="studio-editorial mb-6 p-6 md:p-8" aria-labelledby="sound-setting-title">
      <p className="studio-kicker text-[color:var(--accent)]">수업 환경</p>
      <h2 id="sound-setting-title" className="mt-1 text-2xl font-extrabold">소리</h2>
      <p className="mt-3 leading-relaxed">
        장면을 넘기거나 선택할 때 짧은 소리가 납니다. 놀라게 하는 소리와 틀렸을 때 나는
        소리는 넣지 않았습니다. 읽어 주기와는 별개라, 효과음을 꺼도 대사 듣기는 그대로
        쓸 수 있습니다.
      </p>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border p-3">
        <input
          type="checkbox"
          checked={soundEnabled}
          onChange={(event) => setSoundEnabled(event.target.checked)}
          className="mt-1 h-5 w-5 shrink-0"
        />
        <span className="leading-relaxed">
          <strong className="font-bold">효과음 켜기</strong>
          <span className="mt-1 block text-sm text-[color:var(--muted)]">
            여러 대를 함께 쓰는 교실에서는 꺼 두거나 헤드폰을 권합니다.
          </span>
        </span>
      </label>

      <div className="mt-4 flex flex-wrap gap-2">
        {([
          ['scene-next', '장면 넘김'],
          ['select', '선택'],
          ['stamp', '기록 도장'],
          ['lesson-complete', '차시 완료'],
        ] as const).map(([name, label]) => (
          <button
            key={name}
            type="button"
            onClick={() => playSound(name)}
            disabled={!soundEnabled}
            className="min-h-11 cursor-pointer rounded-full border-2 px-4 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            {label} 들어보기
          </button>
        ))}
      </div>

      <h3 className="mt-8 text-xl font-extrabold">읽어 주기</h3>
      <p className="mt-3 leading-relaxed">
        {readingSupportModuleNames()}에서 글을 못 읽는 학생도 들으며 답할 수 있습니다. 선택지, 선택한 뒤의
        반응, AI 의견마다 듣기 단추가 있고, 선택지는 &lsquo;모두 듣기&rsquo;로 차례대로 들을 수 있습니다.
        듣기 단추는 학생이 누를 때만 읽습니다. 학생 화면 상단의 소리 칩을 누르면 저절로 나는
        소리가 한 번에 꺼지지만 듣기 단추는 그대로 읽어 줍니다.
      </p>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border p-3">
        <input
          type="checkbox"
          checked={autoRead}
          onChange={(event) => setAutoRead(event.target.checked)}
          className="mt-1 h-5 w-5 shrink-0"
        />
        <span className="leading-relaxed">
          <strong className="font-bold">카드를 고를 때 저절로 읽어 주기</strong>
          <span className="mt-1 block text-sm text-[color:var(--muted)]">
            기본은 꺼짐입니다. 켜면 학생이 선택지 카드를 고르는 순간 그 글을 소리 내어 읽습니다.
            여러 대에서 동시에 소리가 나므로 헤드폰을 권합니다.
          </span>
        </span>
      </label>

      <div className="mt-5 rounded-xl border p-4">
        <p className="font-bold">읽어 주기 점검</p>
        <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">
          읽어 주는 소리는 브라우저에 들어 있는 목소리를 씁니다. 기기마다 다르므로 수업 전에 이 기기에서
          한국어 목소리가 나오는지 확인해 주십시오.
        </p>
        <button
          type="button"
          onClick={runVoiceCheck}
          disabled={check.status === 'checking'}
          className="mt-3 min-h-11 cursor-pointer rounded-full border-2 px-4 text-sm font-bold disabled:cursor-wait disabled:opacity-60"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          {check.status === 'checking' ? '점검하는 중…' : '한국어 목소리 확인하고 들어 보기'}
        </button>
        {check.status === 'done' ? (
          <p role="status" className="mt-3 text-sm leading-relaxed">
            {!check.supported
              ? '이 브라우저는 읽어 주기를 지원하지 않습니다. 크롬이나 엣지에서 여십시오.'
              : check.voices.length === 0
                ? '한국어 목소리를 찾지 못했습니다. 이 기기에서는 듣기 단추를 눌러도 소리가 나지 않거나 엉뚱하게 읽힐 수 있습니다. 기기의 언어 설정에서 한국어 음성을 추가하거나, 인터넷에 연결한 크롬에서 다시 점검해 보십시오.'
                : `한국어 목소리 ${check.voices.length}개를 찾았습니다(${check.voices.slice(0, 3).map((voice) => voice.name).join(', ')}${check.voices.length > 3 ? ' 외' : ''}). 방금 들려 드린 소리가 학생에게 읽어 줄 목소리입니다. 들리지 않으면 기기 음량과 헤드폰 연결을 확인해 주십시오.${check.voices.every((voice) => !voice.local) ? ' 찾은 목소리가 모두 인터넷 연결이 필요한 목소리라서, 수업 중 연결이 끊기면 소리가 멈출 수 있습니다.' : ''}`}
          </p>
        ) : null}
      </div>
    </section>
  );
}
