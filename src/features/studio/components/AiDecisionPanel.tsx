import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import DrawPad from '../../../components/mission/blocks/DrawPad';
import type { StudioExpression } from '../types';

interface Props {
  lessonId: string;
  role: string;
  text: string;
  question?: string;
  finalExpression?: StudioExpression;
  accent: string;
  onExpression: (value: StudioExpression) => void;
}

export default function AiDecisionPanel({
  role,
  text,
  question,
  finalExpression,
  accent,
  onExpression,
}: Props) {
  const { speakNow } = useSpeak();
  const spokenText = [role, text, question].filter(Boolean).join('. ');

  const drawBlock = {
    kind: 'draw' as const,
    id: 'ai-decision-draw',
    prompt: '그림으로 나만의 생각을 표현해 보세요',
  };

  return (
    <div className="space-y-5">
      <section className="studio-margin-note" aria-label="준비된 AI 의견">
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
        {question && <p className="mt-2 font-bold" style={{ color: accent }}>{question}</p>}
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
