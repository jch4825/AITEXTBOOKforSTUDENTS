import React, { useEffect, useState } from 'react';
import type { DrawBlock, GeneralizationExpression, GeneralizationExpressionMode } from '../../../types';
import DrawPad from './DrawPad';
import MicButton from '../../MicButton';
import Icon from '../../Icon';
import { useSpeak } from '../../../hooks/useSpeak';

interface ChoiceItem {
  id: string;
  emoji: string;
  label: string;
}

interface Props {
  value?: GeneralizationExpression;
  choices: ChoiceItem[];
  expressionModes?: GeneralizationExpressionMode[];
  prompt: string;
  accent: string;
  onChange: (value: GeneralizationExpression) => void;
}

const MODE_LABELS: Record<GeneralizationExpressionMode, string> = {
  choice: '카드로 고르기',
  aac: 'AAC 카드',
  text: '글로 쓰기',
  speech: '말로 말하기',
  draw: '그림으로 표현',
};

export default function ExpressionInput({
  value,
  choices,
  expressionModes = ['choice'],
  prompt,
  accent,
  onChange,
}: Props) {
  const { speakNow, speak } = useSpeak();
  const [selectedMode, setSelectedMode] = useState<GeneralizationExpressionMode>(value?.mode ?? expressionModes[0] ?? 'choice');
  const activeMode = selectedMode;
  const drawBlock: DrawBlock = { kind: 'draw', id: 'generalization-expression', prompt: '내 생각을 그림으로 표현해 보세요.' };

  useEffect(() => {
    if (value?.mode && expressionModes.includes(value.mode)) setSelectedMode(value.mode);
  }, [value?.mode, expressionModes]);

  function selectMode(mode: GeneralizationExpressionMode) {
    setSelectedMode(mode);
    onChange({ mode, choiceIds: mode === 'choice' || mode === 'aac' ? value?.choiceIds : undefined, text: mode === 'text' || mode === 'speech' ? value?.text : undefined, drawing: mode === 'draw' ? value?.drawing : undefined });
  }

  function selectChoice(id: string, label: string) {
    speak(label);
    onChange({ mode: activeMode, choiceIds: [id] });
  }

  return (
    <div className="w-full space-y-4 story-fade-in">
      <div className="flex items-start gap-2">
        <p className="text-xl font-semibold flex-1">{prompt}</p>
        <button
          type="button"
          onClick={() => speakNow(prompt)}
          aria-label="표현 방법 안내 다시 듣기"
          className="shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center"
          style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
        ><Icon name="speaker" size={20} /></button>
      </div>

      {expressionModes.length > 1 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="생각을 표현하는 방법">
          {expressionModes.map((mode) => (
            <button
              type="button"
              key={mode}
              role="tab"
              aria-selected={activeMode === mode}
              onClick={() => selectMode(mode)}
              className="px-3 py-2 rounded-[var(--r-pill)] border-2 text-sm font-bold cursor-pointer"
              style={{
                borderColor: activeMode === mode ? accent : 'var(--line)',
                background: activeMode === mode ? 'var(--paper-1)' : 'var(--paper-0)',
                color: activeMode === mode ? accent : 'var(--muted)',
              }}
            >{MODE_LABELS[mode]}</button>
          ))}
        </div>
      )}

      {(activeMode === 'choice' || activeMode === 'aac') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {choices.map((choice) => {
            const selected = value?.choiceIds?.includes(choice.id) ?? false;
            return (
              <button
                type="button"
                key={choice.id}
                onClick={() => selectChoice(choice.id, choice.label)}
                aria-pressed={selected}
                className="card3d flex items-center gap-3 p-4 rounded-[var(--r-md)] min-h-20 text-left font-bold cursor-pointer"
                style={{
                  border: selected ? `4px solid ${accent}` : '2.5px solid var(--line)',
                  background: selected ? 'var(--paper-1)' : 'var(--paper-0)',
                  color: 'var(--brand-ink)',
                }}
              >
                <span className="text-3xl shrink-0" aria-hidden>{choice.emoji}</span>
                <span className="leading-tight">{choice.label}</span>
                {selected && <Icon name="check" size={20} color={accent} strokeWidth={3} className="ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      )}

      {(activeMode === 'text' || activeMode === 'speech') && (
        <div className="flex items-center gap-2">
          <input
            value={value?.text ?? ''}
            onChange={(event) => onChange({ mode: activeMode, text: event.target.value })}
            placeholder="내 생각을 짧게 적어 보세요"
            aria-label="내 생각"
            className="flex-1 min-h-13 px-4 rounded-[var(--r-md)] border-2 text-lg font-semibold"
            style={{ borderColor: accent, background: 'var(--paper-0)' }}
          />
          {activeMode === 'speech' && (
            <MicButton accent={accent} onResult={(text) => onChange({ mode: activeMode, text })} />
          )}
        </div>
      )}

      {activeMode === 'draw' && (
        <DrawPad
          block={drawBlock}
          value={value?.drawing ?? ''}
          onChange={(drawing) => onChange({ mode: 'draw', drawing })}
          accent={accent}
        />
      )}
    </div>
  );
}
