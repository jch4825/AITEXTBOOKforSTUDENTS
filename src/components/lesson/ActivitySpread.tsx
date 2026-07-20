import type { ReactNode } from 'react';
import type { CharacterId } from '../../data/characters';
import type { Expression } from '../CharacterAvatar';
import SpeechBubble from '../SpeechBubble';
import LessonSpread from './LessonSpread';

interface Props {
  kicker: string;
  title: ReactNode;
  accent: string;
  character?: {
    id: CharacterId;
    expression?: Expression;
    text: string;
  };
  questionNode?: ReactNode; // Extra elements on the left page (like progress dots, sound buttons)
  children: ReactNode; // Right page content (actual game controls / inputs)
}

export default function ActivitySpread({
  kicker,
  title,
  accent,
  character,
  questionNode,
  children,
}: Props) {
  // Left Page: Question Information and Character Reaction
  const leftPage = (
    <div className="flex flex-col justify-center h-full text-left py-4 px-2 lg:px-6 space-y-6">
      <div>
        <span
          className="text-xs font-black px-2 py-0.5 rounded-[var(--r-sm)] uppercase tracking-wider mb-2 inline-block"
          style={{ background: 'color-mix(in srgb, var(--accent) 12%, var(--paper-2))', color: accent }}
        >
          {kicker}
        </span>
        <h2 className="t-h2 text-xl lg:text-2xl font-black leading-snug mt-1 text-[color:var(--brand-ink)]">
          {title}
        </h2>
      </div>

      {questionNode && <div className="w-full">{questionNode}</div>}

      {character && (
        <div className="w-full max-w-md pt-2">
          <SpeechBubble
            speaker={character.id}
            expression={character.expression}
            text={character.text}
            accent={accent}
            accentSoft="color-mix(in srgb, var(--accent) 8%, var(--paper-1))"
          />
        </div>
      )}
    </div>
  );

  // Right Page: Game/Activity controls
  const rightPage = (
    <div className="flex flex-col justify-center h-full py-4 min-h-[300px] lg:min-h-[460px]">
      <div className="w-full">
        {children}
      </div>
    </div>
  );

  return (
    <LessonSpread
      left={leftPage}
      right={rightPage}
      reverse={false} // Questions left, game right
      accent={accent}
      label={`${kicker}: ${title}`}
    />
  );
}
