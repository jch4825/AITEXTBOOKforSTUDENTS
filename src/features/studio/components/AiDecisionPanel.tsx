import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import StudioExpressionInput from './StudioExpressionInput';
import type { AiDecision, ExpressionMode, StudioChoice, StudioExpression } from '../types';

interface Props {
  role: string;
  text: string;
  question?: string;
  decision?: AiDecision;
  finalExpression?: StudioExpression;
  choices: StudioChoice[];
  modes: ExpressionMode[];
  accent: string;
  onDecision: (value: AiDecision) => void;
  onExpression: (value: StudioExpression) => void;
}

const DECISION_LABELS: Record<AiDecision, string> = {
  accept: '이 의견을 받아들입니다',
  modify: '내 생각에 맞게 고칩니다',
  reject: '이 의견은 사용하지 않습니다',
};

export default function AiDecisionPanel({
  role,
  text,
  question,
  decision,
  finalExpression,
  choices,
  modes,
  accent,
  onDecision,
  onExpression,
}: Props) {
  const { speakNow } = useSpeak();
  const spokenText = [role, text, question].filter(Boolean).join('. ');

  return (
    <div className="space-y-5">
      <section className="studio-margin-note" aria-label="준비된 AI 의견">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div>
            <span className="studio-kicker" style={{ color: accent }}>준비된 AI 예시</span>
            <h3 className="text-lg font-bold">{role}</h3>
          </div>
          <button
            type="button"
            onClick={() => speakNow(spokenText)}
            aria-label="AI 의견 읽어주기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2"
            style={{ borderColor: accent, color: accent, background: 'var(--editorial-paper)' }}
          >
            <Icon name="speaker" size={20} />
          </button>
        </div>
        <p className="text-lg font-semibold leading-relaxed">{text}</p>
        {question && <p className="mt-2 font-bold" style={{ color: accent }}>{question}</p>}
      </section>

      <div>
        <p className="mb-2 font-bold">AI 의견을 어떻게 사용하겠습니까?</p>
        <div className="grid gap-2 md:grid-cols-3">
          {(Object.keys(DECISION_LABELS) as AiDecision[]).map((value) => {
            const selected = decision === value;
            return (
              <button
                type="button"
                key={value}
                aria-pressed={selected}
                onClick={() => onDecision(value)}
                className="min-h-16 rounded-xl border-2 px-3 py-2 font-bold"
                style={{
                  borderColor: selected ? accent : 'var(--editorial-line)',
                  background: selected ? 'var(--editorial-quiet)' : 'var(--editorial-paper)',
                  color: selected ? accent : 'var(--editorial-ink)',
                }}
              >
                {DECISION_LABELS[value]}
              </button>
            );
          })}
        </div>
      </div>

      {decision && (
        <StudioExpressionInput
          value={finalExpression}
          choices={choices}
          modes={modes}
          prompt="AI 의견을 살펴본 뒤, 내가 실제로 할 방법을 다시 표현해 보십시오."
          accent={accent}
          onChange={onExpression}
        />
      )}
    </div>
  );
}
