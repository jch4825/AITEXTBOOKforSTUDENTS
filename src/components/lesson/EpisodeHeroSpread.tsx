import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import type { LessonId } from '../../types';
import type { CharacterId } from '../../data/characters';
import CharacterAvatar from '../CharacterAvatar';
import Icon from '../Icon';
import LessonSpread from './LessonSpread';
import { getLesson } from '../../data/lessons';

interface Props {
  lessonId: LessonId;
  title: string;
  scene: CharacterId[];
  text: string; // storyIntro
  bodyText?: ReactNode; // main body / hard content
  goalText?: ReactNode; // lesson goal
  episodeTitle?: string;
  accent: string;
  accentText?: string;
  accentSoft: string;
  className?: string;
  isHardMode?: boolean;
}

export default function EpisodeHeroSpread({
  lessonId,
  title,
  scene,
  text,
  bodyText,
  goalText,
  episodeTitle,
  accent,
  accentText,
  accentSoft,
  className = '',
  isHardMode = false,
}: Props) {
  const lesson = getLesson(lessonId);
  const lessonNumber = lesson?.number ?? 1;

  // Image candidates chain matching Stage.tsx logic
  const candidates = [
    `${import.meta.env.BASE_URL}lessons/webtoon/${lessonId}.webp`,
    `${import.meta.env.BASE_URL}lessons/png/webtoon/${lessonId}.png`,
    `${import.meta.env.BASE_URL}lessons/${lessonId}.webp`,
    `${import.meta.env.BASE_URL}lessons/png/${lessonId}.png`,
  ];
  const [srcIdx, setSrcIdx] = useState(0);
  const imgMissing = srcIdx >= candidates.length;

  useEffect(() => {
    setSrcIdx(0);
  }, [lessonId]);

  if (isHardMode) {
    return (
      <div className={`story-fade-in ${className}`}>
        <section
          className="w-full max-w-[960px] mx-auto rounded-[var(--r-lg)] bg-[color:var(--paper-0)] shadow-[0_8px_32px_rgba(43,58,85,0.12)] border border-[color:var(--line)] p-6 md:p-8 lg:p-10 overflow-hidden relative"
          style={{ borderColor: `color-mix(in srgb, ${accent} 20%, var(--line))` }}
          aria-label={`차시 도입 (어려움): ${title}`}
        >
          {/* 옅은 종이 질감 효과 */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(var(--ink-1) 0.5px, transparent 0.5px)`,
              backgroundSize: '4px 4px',
            }}
          />

          <div className="relative z-10 space-y-6">
            {/* Header Info */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dashed border-[color:var(--line)] pb-4">
              <div>
                {episodeTitle && (
                  <div
                    className="t-label inline-flex items-center gap-1.5 font-black text-sm uppercase tracking-wider"
                    style={{ color: accentText ?? accent }}
                  >
                    <Icon name="book" size={16} /> {episodeTitle}
                  </div>
                )}
              </div>
              <div
                className="text-xs font-black px-2 py-0.5 rounded-[var(--r-sm)] uppercase tracking-wider"
                style={{ background: accentSoft, color: accentText ?? accent }}
              >
                화 {lessonNumber}
              </div>
            </div>

            {/* Title */}
            <h1 className="t-h1 leading-tight font-black text-2xl lg:text-3xl" style={{ color: accentText ?? accent }}>
              {title}
            </h1>

            {goalText && <div className="w-full">{goalText}</div>}

            {/* Image (Centered and Large) */}
            <div className="flex justify-center py-2">
              {!imgMissing ? (
                <div
                  className="spread-hero-image relative w-full max-w-[480px] aspect-[4/3] md:aspect-[16/9] rounded-[var(--r-lg)] overflow-hidden shadow-md"
                >
                  <img
                    src={candidates[srcIdx]}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: 'blur(20px)', transform: 'scale(1.1)' }}
                  />
                  <img
                    src={candidates[srcIdx]}
                    alt={title}
                    onError={() => setSrcIdx((i) => i + 1)}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="spread-hero-image flex justify-center items-end -space-x-4 py-4" aria-hidden>
                  {scene.map((id) => (
                    <span key={id}>
                      <CharacterAvatar character={id} expression="happy" size={120} />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Story Text and Body Text */}
            <div className="space-y-6 max-w-3xl mx-auto pt-2">
              {text && (
                <p className="t-body-lg text-lg leading-relaxed text-[color:var(--ink-2)] border-l-4 pl-4" style={{ borderColor: accent }}>
                  {text}
                </p>
              )}
              {bodyText && <div className="mt-4">{bodyText}</div>}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Left Page: large artwork field / character fallback. The artwork remains crisp;
  // the abstract field only organizes the surrounding page space.
  const leftPage = (
    <div className="spread-art-page" style={{ '--hero-accent': accent, '--hero-soft': accentSoft } as CSSProperties}>
      <div className="spread-art-field">
        <span className="spread-art-mark spread-art-mark-one" aria-hidden />
        <span className="spread-art-mark spread-art-mark-two" aria-hidden />
        {!imgMissing ? (
          <div className="spread-hero-image spread-hero-image-large">
            <img
              src={candidates[srcIdx]}
              alt={title}
              onError={() => setSrcIdx((i) => i + 1)}
              className="w-full h-full object-contain"
            />
          </div>
        ) : (
          <div className="spread-hero-image spread-hero-characters" aria-hidden>
            {scene.map((id) => (
              <span key={id}>
                <CharacterAvatar character={id} expression="happy" size={136} />
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Right Page: Episode Info, Title, Story Text, Body Text, Goal Text
  const rightPage = (
    <div className="spread-copy-page" style={{ '--hero-accent': accent, '--hero-soft': accentSoft } as CSSProperties}>
      <div className="spread-copy-meta">
        {episodeTitle && (
          <div
            className="t-label inline-flex items-center gap-1.5 font-black text-sm uppercase"
            style={{ color: accentText ?? accent }}
          >
            <Icon name="book" size={16} /> {episodeTitle}
          </div>
        )}
        <div
          className="spread-episode-chip"
          style={{ background: accentSoft, color: accentText ?? accent }}
        >
          화 {lessonNumber}
        </div>
      </div>
      <h1 className="spread-copy-title t-h1" style={{ color: accentText ?? accent }}>
        {title}
      </h1>

      {goalText && <div className="spread-goal-slot">{goalText}</div>}

      <div className="spread-copy-body">
        {text && (
          <p className="spread-story-intro t-body-lg" style={{ borderColor: accent }}>
            {text}
          </p>
        )}
        {bodyText && <div className="spread-body-slot">{bodyText}</div>}
      </div>
    </div>
  );

  // Keep every introduction in the same reading order: artwork first, text second.
  return (
    <div className={`story-fade-in ${className}`}>
      <LessonSpread
        left={leftPage}
        right={rightPage}
        accent={accent}
        label={`차시 도입: ${title}`}
      />
    </div>
  );
}
