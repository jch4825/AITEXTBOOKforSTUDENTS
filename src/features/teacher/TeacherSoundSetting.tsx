import { useSettings } from '../../context/SettingsContext';
import { playSound } from '../../utils/sound';

/**
 * 효과음 켜고 끄기 (05-ENGINE-SPEC §7).
 *
 * 읽어 주기(TTS)와 별개 토글이다. 한 교실에서 여러 대가 동시에 소리를 내면 시끄러워
 * 교사가 한 번에 끌 수 있어야 하고, 반대로 소리를 끄더라도 대사 읽어 주기는 남아야
 * 하는 학생이 있기 때문이다.
 */
export default function TeacherSoundSetting() {
  const { soundEnabled, setSoundEnabled } = useSettings();

  return (
    <section className="studio-editorial mb-6 p-6 md:p-8" aria-labelledby="sound-setting-title">
      <p className="studio-kicker text-[color:var(--accent)]">수업 환경</p>
      <h2 id="sound-setting-title" className="mt-1 text-2xl font-extrabold">효과음</h2>
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
    </section>
  );
}
