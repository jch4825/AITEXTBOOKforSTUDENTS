import { useSettings } from '../../context/SettingsContext';
import { READING_SUPPORT_MODULES } from '../../data/readingSupport';

const OPTIONS = [
  {
    value: 'choice',
    title: '문장 고르기',
    body: '선택지를 문장으로 보여 줍니다. 글을 읽을 수 있는 학생에게 맞습니다. 기본값입니다.',
  },
  {
    value: 'aac',
    title: '그림 카드',
    body: '선택지를 그림 카드 한 장씩으로 보여 줍니다. 카드마다 듣기 단추가 있어, 글을 못 읽는 학생도 그림을 보고 소리를 들으며 고를 수 있습니다.',
  },
] as const;

/** 읽기 지원이 켜진 단원을 말로 옮긴다. 여섯 단원이 모두 켜져 있으면 "모든 단원". */
function supportedModuleNames(): string {
  if (READING_SUPPORT_MODULES.length >= 6) return '모든 단원';
  return READING_SUPPORT_MODULES.map((id) => `${Number(id.slice(1))}단원`).join(', ');
}

/**
 * 이 기기에서 학생이 선택지에 답할 때 처음 보이는 화면.
 *
 * 글을 못 읽는 학생은 선택지 위 탭의 글자를 찾을 수 없으므로, 그 학생이 쓰는 기기는 교사가 미리
 * 그림 카드로 열어 둔다. 학생은 탭으로 언제든 바꿀 수 있다(탭에도 그림이 있다).
 */
export default function TeacherAnswerModeSetting() {
  const { answerMode, setAnswerMode } = useSettings();

  return (
    <section className="studio-editorial p-6 md:p-8" aria-labelledby="answer-mode-title">
      <p className="studio-kicker text-[color:var(--accent)]">수업 환경</p>
      <h3 id="answer-mode-title" className="mt-1 text-2xl font-extrabold">답하는 방식</h3>
      <p className="mt-3 leading-relaxed">
        {supportedModuleNames()}의 스튜디오와 단원 마무리에서 학생이 선택지에 답할 때 처음 보이는 화면을
        이 기기에서 정합니다. 글을 못 읽는 학생은 선택지 위 탭의 글자를 찾지 못하므로, 그 학생이 쓰는 기기는
        그림 카드로 열어 두십시오. 학생은 선택지 위의 탭으로 언제든 바꿀 수 있고, 어느 방식으로 답했는지는
        과정 기록의 &lsquo;사용한 지원&rsquo;에 남습니다.
      </p>

      <div role="radiogroup" aria-label="학생이 선택지에 답하는 기본 화면" className="mt-5 grid gap-3">
        {OPTIONS.map((option) => (
          <label key={option.value} className="hub-choice">
            <input
              type="radio"
              name="answer-mode"
              value={option.value}
              checked={answerMode === option.value}
              onChange={() => setAnswerMode(option.value)}
              className="mt-1 h-5 w-5 shrink-0"
            />
            <span className="leading-relaxed">
              <strong className="font-bold">{option.title}</strong>
              <span className="mt-1 block text-sm text-[color:var(--muted)]">{option.body}</span>
            </span>
          </label>
        ))}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
        이 설정은 이 기기(브라우저)에만 저장됩니다. 카드 그림은 한 장에 300KB 안팎이라, 그림 카드로 연
        기기는 차시를 열 때 그 차시의 카드를 미리 받아 둡니다.
      </p>
    </section>
  );
}
