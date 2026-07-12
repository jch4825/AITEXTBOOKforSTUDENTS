import React, { useState, useEffect } from 'react';
import type { BranchChatBlock } from '../../../types';
import PhoneFrame from '../../PhoneFrame';
import type { PhoneMessage } from '../../PhoneFrame';
import { useSpeak } from '../../../hooks/useSpeak';

interface Props {
  key?: any;
  block: BranchChatBlock;
  value: number[] | undefined; // maps turn index to chosen choice index
  onChange: (value: number[]) => void;
  accent: string;
  accentSoft: string;
  accentText: string;
}

export default function BranchChat({ block, value = [], onChange, accent, accentSoft, accentText }: Props) {
  const { speakNow } = useSpeak();
  const [typing, setTyping] = useState(false);
  const [pendingChoiceIdx, setPendingChoiceIdx] = useState<number | null>(null);

  // We determine the current turn from the length of chosen choices
  const currentTurnIdx = value.length;
  const isFinished = currentTurnIdx >= block.turns.length;

  // Build the list of messages based on choices made so far
  const messages: PhoneMessage[] = [];

  block.turns.forEach((turn, turnIdx) => {
    // Aimi's opening for this turn
    if (turnIdx <= currentTurnIdx) {
      messages.push({
        id: `aimi-intro-${turnIdx}`,
        sender: 'aimi',
        text: turn.aimi,
        expression: 'neutral',
      });
    }

    // User's choice and Aimi's reply for this turn (if chosen)
    if (turnIdx < currentTurnIdx) {
      const chosenChoiceIdx = value[turnIdx];
      const choice = turn.choices[chosenChoiceIdx];
      if (choice) {
        messages.push({
          id: `user-choice-${turnIdx}`,
          sender: 'user',
          text: choice.label,
        });
        messages.push({
          id: `aimi-reply-${turnIdx}`,
          sender: 'aimi',
          text: choice.reply,
          expression: choice.good ? 'cheer' : 'thinking',
        });
      }
    }
  });

  // If typing, show the pending user choice bubble
  if (typing && pendingChoiceIdx !== null && currentTurnIdx < block.turns.length) {
    const choice = block.turns[currentTurnIdx].choices[pendingChoiceIdx];
    if (choice) {
      messages.push({
        id: `user-choice-pending-${currentTurnIdx}`,
        sender: 'user',
        text: choice.label,
      });
    }
  }

  // Handle clicking a choice
  const handleChoice = (choiceIdx: number) => {
    if (typing) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const choice = block.turns[currentTurnIdx].choices[choiceIdx];
    const nextValue = [...value, choiceIdx];
    
    if (reducedMotion) {
      onChange(nextValue);
      speakNow(choice.reply);
    } else {
      setPendingChoiceIdx(choiceIdx);
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setPendingChoiceIdx(null);
        onChange(nextValue);
        speakNow(choice.reply);
      }, 1000);
    }
  };

  // Speak Aimi's current turn prompt automatically if we just loaded it
  useEffect(() => {
    if (!isFinished && !typing) {
      speakNow(block.turns[currentTurnIdx].aimi);
    }
  }, [currentTurnIdx, isFinished, typing]);

  // Choices footer
  const footer = !isFinished && !typing ? (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-bold text-center mb-1" style={{ color: 'var(--muted)' }}>
        대답을 하나 골라 보세요
      </p>
      {block.turns[currentTurnIdx].choices.map((choice, idx) => (
        <button
          key={idx}
          onClick={() => handleChoice(idx)}
          className="w-full text-left p-3 min-h-12 bg-[color:var(--paper-0)] border-2 rounded-[14px] text-base font-bold active:scale-[0.98] transition-all cursor-pointer leading-normal"
          style={{ borderColor: accent, color: 'var(--brand-ink)', boxShadow: 'var(--e-1)' }}
        >
          {choice.label}
        </button>
      ))}
    </div>
  ) : null;

  return (
    <div className="w-full flex flex-col items-center select-none story-fade-in">
      {block.intro && (
        <p className="text-xl font-semibold text-center mb-1 w-full">{block.intro}</p>
      )}

      <PhoneFrame
        messages={messages}
        typing={typing}
        accent={accent}
        accentSoft={accentSoft}
        accentText={accentText}
        footer={footer}
        onSpeak={speakNow}
      />
    </div>
  );
}
