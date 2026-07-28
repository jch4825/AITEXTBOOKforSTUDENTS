import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import DrawPad from '../../../components/mission/blocks/DrawPad';
import type { StudioExpression } from '../types';

interface Props {
  lessonId: string;
  role: string;
  text: string;
  question?: string;
  /**
   * 지원 수준별 AI 역할 깊이.
   * direct는 AI 의견을 읽고 확인하는 데까지, prompting은 되묻는 질문까지,
   * counterpoint는 좋은 점과 조심할 점을 함께 따지는 데까지 요구한다.
   */
  depth?: 'direct' | 'prompting' | 'counterpoint';
  finalExpression?: StudioExpression;
  accent: string;
  onExpression: (value: StudioExpression) => void;
}

const COUNTERPOINT_PROMPT = '아이미의 의견에서 좋은 점 한 가지와 조심할 점 한 가지를 함께 찾아보세요.';

export default function AiDecisionPanel({
  role,
  text,
  question,
  depth = 'prompting',
  finalExpression,
  accent,
  onExpression,
}: Props) {
  const { speakNow } = useSpeak();
  // direct 수준에서는 되묻는 질문을 얹지 않는다. 읽고 확인하는 데까지가 과제다.
  const shownQuestion = depth === 'direct' ? undefined : question;
  const extraPrompt = depth === 'counterpoint' ? COUNTERPOINT_PROMPT : '';
  const spokenText = [role, text, shownQuestion, extraPrompt].filter(Boolean).join('. ');

  const drawBlock = {
    kind: 'draw' as const,
    id: 'ai-decision-draw',
    prompt: '나만의 생각을 표현해 보세요',
  };

  return (
    <div className="space-y-5">
      <section className="studio-margin-note" aria-label="수업용 AI 의견">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <span className="studio-kicker" style={{ color: accent }}>AI의 안내 사례</span>
            <h3 className="text-lg font-bold">{role}</h3>
          </div>
          <button
            type="button"
            onClick={() => speakNow(spokenText)}
            aria-label="AI 의견 읽어주기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 cursor-pointer"
            style={{ borderColor: accent, color: accent, background: 'var(--editorial-paper)' }}
          >
            <Icon name="speaker" size={20} />
          </button>
        </div>
        <p className="text-lg font-semibold leading-relaxed">{text}</p>
        {shownQuestion && <p className="mt-2 font-bold" style={{ color: accent }}>{shownQuestion}</p>}
        {extraPrompt && (
          <p
            className="mt-2 rounded-xl border border-dashed p-3 text-sm font-bold leading-relaxed"
            style={{ borderColor: accent, color: accent }}
          >
            {extraPrompt}
          </p>
        )}
      </section>

      <div className="space-y-2">
        <DrawPad
          block={drawBlock}
          value={finalExpression?.drawing}
          onChange={(drawing) => onExpression({ mode: 'draw', drawing })}
          accent={accent}
        />
      </div>
    </div>
  );
}
