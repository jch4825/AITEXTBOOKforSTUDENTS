import type { CharacterId } from '../../data/characters';
import type { ModuleTheme } from '../../utils/moduleThemes';
import CharacterAvatar from '../CharacterAvatar';
import Icon from '../Icon';
import Button from '../Button';
import SpeechBubble from '../SpeechBubble';
import LessonSpread from './LessonSpread';

interface Props {
  wrapUpText: string;
  goalText?: string | null;
  reaction?: { speaker: CharacterId; text: string } | null;
  next?: { title: string } | null;
  theme: ModuleTheme;
  onSpeak: (text: string) => void;
  onFinish: () => void;
}

export default function EpisodeEnding({
  wrapUpText,
  goalText,
  reaction,
  next,
  theme,
  onSpeak,
  onFinish,
}: Props) {
  // Left Page: Ending reward image & Stamp medallion
  const leftPage = (
    <div className="flex flex-col items-center justify-center text-center p-4 space-y-6">
      {/* 배움 도장 메달리온 (1회성 스탬프 모션) */}
      <div className="flex justify-center" aria-hidden>
        <span
          className="stamp-in inline-flex items-center justify-center rounded-full h-[120px] w-[120px] relative"
          style={{ background: theme.accentSoft, boxShadow: '0 4px 14px rgba(43,58,85,0.06)' }}
        >
          <Icon name="star" size={54} filled color={theme.accent} />
          <span
            className="absolute inset-0 rounded-full border-4 border-dashed motion-safe:animate-[spin_60s_linear_infinite]"
            style={{ borderColor: `color-mix(in srgb, ${theme.accent} 25%, transparent)` }}
          />
        </span>
      </div>

      <div className="space-y-2">
        <h2 className="t-h2 text-2xl font-black" style={{ color: theme.accent }}>오늘 배운 것</h2>
        <p className="text-sm font-bold text-[color:var(--ink-2)]">미션 도장을 받았어요!</p>
      </div>

      {reaction && (
        <div className="w-full max-w-sm text-left mt-2">
          <SpeechBubble
            speaker={reaction.speaker}
            text={reaction.text}
            expression="happy"
            accent={theme.accent}
            accentText={theme.accentText}
            accentSoft="color-mix(in srgb, var(--accent) 8%, var(--paper-1))"
          />
        </div>
      )}
    </div>
  );

  // Right Page: What we learned text, Next episode teaser, and Finish Action
  const rightPage = (
    <div className="flex flex-col justify-center h-full text-left py-4 px-2 lg:px-6 space-y-6">
      <div className="space-y-4">
        <div
          className="rounded-[var(--r-md)] p-5 border border-l-4 leading-relaxed text-lg font-bold"
          style={{
            borderColor: `color-mix(in srgb, ${theme.accent} 15%, var(--line))`,
            borderLeftColor: theme.accent,
            background: 'var(--paper-1)'
          }}
        >
          {wrapUpText}
        </div>

        {goalText && (
          <div className="text-sm text-[color:var(--ink-2)] bg-[color:var(--paper-0)] p-3 border border-dashed rounded-[var(--r-md)] border-[color:var(--line)]">
            <span className="font-bold block mb-1">🎯 학습 목표 확인:</span>
            {goalText}
          </div>
        )}
      </div>

      {next && (
        <div
          className="text-xs font-bold px-3 py-2 rounded-[var(--r-sm)] inline-flex items-center gap-1.5 self-start"
          style={{ background: theme.accentSoft, color: theme.accentText ?? theme.accent }}
        >
          <Icon name="book" size={14} /> 다음 이야기: {next.title}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <Button
          variant="secondary"
          accent={theme.accent}
          onClick={() => onSpeak(wrapUpText)}
          className="cursor-pointer"
        >
          <Icon name="speaker" size={18} /> 전체 읽어줘
        </Button>
        <Button
          size="lg"
          accent={theme.accent}
          onClick={onFinish}
          className="text-lg font-bold flex-1 justify-center cursor-pointer"
        >
          <Icon name="sparkles" size={20} filled /> 다 했어요!
        </Button>
      </div>
    </div>
  );

  return (
    <div className="story-fade-in py-4">
      <LessonSpread
        left={leftPage}
        right={rightPage}
        reverse={false}
        accent={theme.accent}
        label="오늘의 배움 정리"
      />
    </div>
  );
}
