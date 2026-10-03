import React, { useEffect, useId, useState } from 'react';
import type { DrawBlock, GeneralizationExpression, GeneralizationExpressionMode } from '../../../types';
import DrawPad from './DrawPad';
import MicButton from '../../MicButton';
import Icon from '../../Icon';
import Burst from '../../games/Burst';
import ListenButton, { ListenAllButton } from '../../controls/ListenButton';
import { useSpeak } from '../../../hooks/useSpeak';
import { useSpeakingState } from '../../../hooks/useSpeakingState';
import { useSettings } from '../../../context/SettingsContext';
import { wrapDictionaryTerms } from '../../../views/lessonTextUtils';
import { STUDENT_DICTIONARY } from '../../../data/studentDictionary';
import { playSound } from '../../../utils/sound';
import { toSpeechText } from '../../../utils/speechText';

interface ChoiceItem {
  id: string;
  emoji: string;
  label: string;
  isCorrect?: boolean;
}

interface Props {
  value?: GeneralizationExpression;
  choices: ChoiceItem[];
  expressionModes?: GeneralizationExpressionMode[];
  prompt: string;
  accent: string;
  onChange: (value: GeneralizationExpression) => void;
  /**
   * 읽기 지원 단원(data/readingSupport.ts)이면 글을 못 읽는 학생도 고를 수 있게 한다.
   * 선택지마다 듣기 단추를 달고 맨 위에 "모두 듣기"를 둔다. 카드를 고르는 일은 소리 없이
   * 하고, 교사가 자동 읽기를 켠 교실에서만 고를 때 읽는다. 듣다가 답이 정해지지 않게
   * 듣기와 고르기는 서로 다른 단추다.
   */
  readingSupport?: boolean;
}

const MODE_LABELS: Record<GeneralizationExpressionMode, string> = {
  choice: '문장 고르기',
  aac: '그림 카드',
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
  readingSupport = false,
}: Props) {
  const { speakNow, speak } = useSpeak();
  const { autoRead } = useSettings();
  const { key: speakingKey } = useSpeakingState();
  // 같은 화면에 선택지 목록이 둘 이상일 수 있어(첫 생각·적용) 소리의 이름이 겹치지 않게 한다.
  const listId = useId();
  const [selectedMode, setSelectedMode] = useState<GeneralizationExpressionMode>(value?.mode ?? expressionModes[0] ?? 'choice');
  const activeMode = selectedMode;
  // 선택지가 화면에 보이는 표현 방식인가. 글·말·그림 방식에서는 선택지를 읽어 주지 않는다.
  const choicesShown = activeMode === 'choice' || activeMode === 'aac';
  const drawBlock: DrawBlock = { kind: 'draw', id: 'generalization-expression', prompt: '내 생각을 그림으로 표현해 보십시오.' };

  useEffect(() => {
    if (value?.mode && expressionModes.includes(value.mode)) setSelectedMode(value.mode);
  }, [value?.mode, expressionModes]);

  function selectMode(mode: GeneralizationExpressionMode) {
    setSelectedMode(mode);
    onChange({ mode, choiceIds: mode === 'choice' || mode === 'aac' ? value?.choiceIds : undefined, text: mode === 'text' || mode === 'speech' ? value?.text : undefined, drawing: mode === 'draw' ? value?.drawing : undefined });
  }

  function selectChoice(id: string, label: string) {
    // 소리를 먼저 낸다. speak가 시작되면 말소리 보호 규칙에 걸려 선택음이 생략된다.
    playSound('select');
    if (readingSupport) {
      // 읽기 지원 단원은 고르는 일이 조용하다. 듣고 싶으면 듣기 단추를 누르고, 교사가
      // 자동 읽기를 켠 교실에서만 고를 때 그 글을 읽어 준다.
      if (autoRead) speakNow(toSpeechText(label), { key: `${listId}:${id}` });
    } else {
      speak(label);
    }
    onChange({ mode: activeMode, choiceIds: [id] });
  }

  return (
    <div className="w-full space-y-4 story-fade-in">
      <div className="flex items-start gap-2">
        <p className="text-xl font-semibold flex-1">
          {prompt}
        </p>
        {readingSupport ? (
          // 물음 옆 단추 하나가 물음과 보이는 선택지를 차례로 읽는다. 선택지 위에 "모두 듣기" 줄을 따로 두면
          // 그만큼 첫 카드가 밀려 낮은 창에서 접힌 아래로 내려간다(1366×657 실측). 읽는 동안 카드가 강조된다.
          <ListenAllButton
            compact
            group={`${listId}:all`}
            accent={accent}
            label={choicesShown ? '물음과 선택지 모두 듣기' : '물음 듣기'}
            items={[
              { key: `${listId}:prompt`, text: prompt },
              ...(choicesShown ? choices.map((choice) => ({ key: `${listId}:${choice.id}`, text: choice.label })) : []),
            ]}
          />
        ) : (
          <button
            type="button"
            onClick={() => speakNow(prompt)}
            aria-label="표현 방법 안내 다시 듣기"
            className="shrink-0 h-10 w-10 rounded-full border-2 flex items-center justify-center"
            style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
          ><Icon name="speaker" size={20} /></button>
        )}
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

      {choicesShown && (
        <div className={activeMode === 'choice' ? "grid grid-cols-1 gap-3" : "grid grid-cols-1 sm:grid-cols-2 gap-3"}>
          {choices.map((choice, index) => {
            const selected = value?.choiceIds?.includes(choice.id) ?? false;
            const isCorrect = choice.isCorrect !== undefined ? choice.isCorrect : (selected ? true : undefined);

            let borderStyle = selected ? `4px solid ${accent}` : '2.5px solid var(--line)';
            let bgStyle = selected ? 'var(--paper-1)' : 'var(--paper-0)';
            let animClass = '';

            if (selected) {
              if (isCorrect === true) {
                borderStyle = '4px solid #10b981';
                bgStyle = '#ecfdf5';
                animClass = 'answer-pop';
              } else if (isCorrect === false) {
                borderStyle = '4px solid #ef4444';
                bgStyle = '#fef2f2';
                animClass = 'answer-shake';
              }
            }

            const card = (
              <button
                type="button"
                key={choice.id}
                onClick={() => selectChoice(choice.id, choice.label)}
                aria-pressed={selected}
                // 지금 읽어 주는 카드를 눈으로도 따라가게 한다. 글을 못 읽는 학생은 소리와 카드를 이 표시로 잇는다.
                data-reading={readingSupport && speakingKey === `${listId}:${choice.id}` ? 'true' : undefined}
                className={`relative surface-choice flex items-center gap-3 p-4 rounded-[var(--r-md)] min-h-20 text-left font-bold cursor-pointer transition-all ${animClass}`}
                style={{
                  border: borderStyle,
                  background: bgStyle,
                  color: 'var(--brand-ink)',
                }}
              >
                {selected && isCorrect === true && <Burst />}
                <span className="text-3xl shrink-0 z-10" aria-hidden>{choice.emoji}</span>
                {readingSupport ? (
                  // 듣기 단추만큼 카드가 좁아진다. 오른쪽 끝의 표시가 글 폭을 더 깎지 않게 글 아래에 둔다.
                  <span className="min-w-0 flex-1 z-10">
                    <span className="block leading-tight">{choice.label}</span>
                    {selected && (
                      <span className="mt-1.5 inline-block text-xs font-extrabold px-2 py-1 rounded-full bg-white/80 depth-paper">
                        {isCorrect === true ? '🎉 정답!' : isCorrect === false ? '❌ 다시 생각해 보아요' : '✓ 선택됨'}
                      </span>
                    )}
                  </span>
                ) : (
                  <>
                    <span className="leading-tight flex-1 z-10">{choice.label}</span>
                    {selected && (
                      <span className="ml-auto shrink-0 z-10 text-xs font-extrabold px-2 py-1 rounded-full bg-white/80 depth-paper">
                        {isCorrect === true ? '🎉 정답!' : isCorrect === false ? '❌ 다시 생각해 보아요' : '✓ 선택됨'}
                      </span>
                    )}
                  </>
                )}
              </button>
            );

            if (!readingSupport) return card;
            return (
              <div key={choice.id} className="reading-choice-row">
                {card}
                <ListenButton
                  text={choice.label}
                  speakKey={`${listId}:${choice.id}`}
                  label={`${index + 1}번 카드 듣기`}
                  accent={accent}
                />
              </div>
            );
          })}
        </div>
      )}

      {(activeMode === 'text' || activeMode === 'speech') && (
        <div className="flex items-center gap-2">
          {activeMode === 'speech' && (
            <MicButton accent={accent} onResult={(text) => onChange({ mode: activeMode, text })} />
          )}
          <input
            value={value?.text ?? ''}
            onChange={(event) => onChange({ mode: activeMode, text: event.target.value })}
            placeholder="내 생각을 짧게 적어 보십시오"
            aria-label="내 생각"
            className="flex-1 min-w-0 min-h-13 px-4 rounded-[var(--r-md)] border-2 text-lg font-semibold"
            style={{ borderColor: accent, background: 'var(--paper-0)' }}
          />
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
