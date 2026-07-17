import React from 'react';
import type { GeneralizationCycleRecord, GeneralizationExpression, JudgmentPreviewBlock } from '../../../types';
import { useGeneralizationCycle } from '../useGeneralizationCycle';
import ExpressionInput from './ExpressionInput';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';

interface Props {
  key?: any;
  block: JudgmentPreviewBlock;
  value: { firstThought?: GeneralizationExpression; reason?: GeneralizationExpression } | undefined;
  studentName: string;
  accent: string;
  onChange: (value: { firstThought?: GeneralizationExpression; reason?: GeneralizationExpression }) => void;
}

export default function JudgmentPreview({ block, value = {}, studentName, accent, onChange }: Props) {
  const { speakNow } = useSpeak();
  const cycle = useGeneralizationCycle(block.cycleId, block.moduleId, studentName);
  const savedThought = value.firstThought ?? cycle.record?.preview?.firstThought;
  const reasonCards = block.reasonCards ?? [];

  function saveThought(firstThought: GeneralizationExpression) {
    const hasExpression = Boolean(
      firstThought.choiceIds?.length || firstThought.text?.trim() || firstThought.drawing,
    );
    if (!hasExpression) return;
    const next = { ...value, firstThought };
    onChange(next);
    cycle.update({
      preview: {
        firstThought,
        reason: next.reason,
        capturedAt: new Date().toISOString(),
      },
    });
  }

  function saveReason(reason: GeneralizationExpression) {
    const next = { ...value, reason };
    onChange(next);
    const thought = next.firstThought ?? savedThought;
    if (thought) {
      cycle.update({
        preview: {
          firstThought: thought,
          reason,
          capturedAt: cycle.record?.preview?.capturedAt ?? new Date().toISOString(),
        },
      });
    }
  }

  const cycleRecord: GeneralizationCycleRecord | null = cycle.record;

  return (
    <div className="w-full space-y-5 story-fade-in">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-full" style={{ background: 'var(--paper-1)', color: accent }} aria-hidden>
          <Icon name="think" size={22} />
        </span>
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <h3 className="text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>{block.scenario.title}</h3>
            <button
              type="button"
              onClick={() => speakNow(block.scenario.description)}
              aria-label="장면 다시 듣기"
              className="shrink-0 h-9 w-9 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
            ><Icon name="speaker" size={18} /></button>
          </div>
          <p className="mt-2 text-lg leading-relaxed" style={{ color: 'var(--ink-1)' }}>{block.scenario.description}</p>
        </div>
      </div>

      {!savedThought ? (
        <ExpressionInput
          value={value.firstThought}
          choices={block.choices}
          expressionModes={block.expressionModes}
          prompt="처음 생각한 방법을 하나 골라 보십시오."
          accent={accent}
          onChange={saveThought}
        />
      ) : (
        <div className="p-4 rounded-[var(--r-md)] border-2" style={{ borderColor: accent, background: 'var(--paper-1)' }}>
          <p className="text-sm font-bold mb-1" style={{ color: accent }}>첫 생각을 저장했습니다</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--brand-ink)' }}>
            {savedThought.text || savedThought.choiceIds?.map((id) => block.choices.find((choice) => choice.id === id)?.label).filter(Boolean).join(', ') || (savedThought.drawing ? '그림으로 표현했습니다.' : '내 생각을 남겼습니다.')}
          </p>
        </div>
      )}

      {savedThought && reasonCards.length > 0 && (
        <div className="space-y-3">
          <p className="text-lg font-semibold">왜 그렇게 생각했는지는 말하지 않아도 괜찮습니다. 말하고 싶다면 골라 보십시오.</p>
          <ExpressionInput
            value={value.reason}
            choices={reasonCards}
            expressionModes={['aac']}
            prompt="내가 중요하게 본 것은 무엇입니까?"
            accent={accent}
            onChange={saveReason}
          />
        </div>
      )}

      {savedThought && (
        <div className="p-4 rounded-[var(--r-md)] flex items-start gap-3" style={{ background: 'var(--paper-2)', color: 'var(--ink-1)' }}>
          <Icon name="bulb" size={20} color={accent} className="shrink-0 mt-0.5" />
          <p className="font-semibold">{block.closing}</p>
        </div>
      )}

      {cycleRecord?.preview?.capturedAtMain && (
        <p className="text-sm" style={{ color: 'var(--muted)' }}>이번 차시에서 첫 생각을 대신 기록했습니다.</p>
      )}
    </div>
  );
}
