import { useState } from 'react';
import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import { publicAssetUrl } from '../../../utils/publicAssetUrl';
import type { PreparedStimulus } from '../types';

interface Props {
  stimuli: PreparedStimulus[];
  accent: string;
  compact?: boolean;
}

export default function PreparedStimulusPanel({ stimuli, accent, compact = false }: Props) {
  const { speakNow } = useSpeak();
  const [failedImages, setFailedImages] = useState<string[]>([]);

  function markImageFailed(id: string) {
    setFailedImages((current) => current.includes(id) ? current : [...current, id]);
  }

  const isSingle = stimuli.length === 1;
  const isTriple = stimuli.length === 3;

  return (
    <div
      className={`${isSingle ? 'flex justify-center' : `grid gap-2.5 sm:gap-3 ${isTriple ? 'grid-cols-3' : 'sm:grid-cols-2'}`}`}
      aria-label="수업용 이미지와 소리"
      data-context-illustration-source={compact ? 'story-reuse' : 'prepared'}
    >
      {stimuli.map((stimulus) => {
        if (stimulus.kind === 'image') {
          const failed = failedImages.includes(stimulus.id);
          const isPecs = stimulus.id.includes('pecs');
          const isRobotVacuum = stimulus.id.includes('robot-vacuum');
          const isLandscape = !isPecs;

          const widthClass = isSingle
            ? isRobotVacuum
              ? 'w-48 sm:w-56 md:w-64 max-w-full mx-auto'
              : isLandscape
                ? 'w-full sm:w-[480px] md:w-[560px] max-w-full mx-auto'
                : 'w-full sm:w-[480px] md:w-[560px] max-w-full mx-auto'
            : 'w-full';

          const aspectClass = isPecs
            ? 'aspect-square'
            : compact
              ? 'aspect-[16/9] max-h-44 sm:max-h-48 md:max-h-52'
              : 'aspect-[16/9] max-h-72 sm:max-h-80 md:max-h-96';

          return (
            <figure
              key={stimulus.id}
              className={`flex flex-col justify-between overflow-hidden rounded-2xl border-2 ${compact ? 'p-2.5' : 'p-3'} shadow-xs transition-transform hover:scale-102 ${isPecs ? 'bg-white border-amber-400 shadow-md ring-1 ring-amber-300/50' : ''} ${widthClass}`}
              style={!isPecs ? { borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' } : undefined}
            >
              {failed ? (
                <div
                  role="img"
                  aria-label={stimulus.alt}
                  className={`studio-margin-note flex ${aspectClass} flex-col justify-center text-center text-xs`}
                >
                  <strong>이미지 불러오기 실패</strong>
                  <p className="mt-1 text-[10px] text-slate-500">{stimulus.caption}</p>
                </div>
              ) : (
                <div className={`relative w-full ${aspectClass} overflow-hidden rounded-xl ${isPecs ? 'bg-amber-50/50' : 'bg-slate-100'}`}>
                  {isPecs && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-xs uppercase tracking-wider z-10 select-none">
                      PECS
                    </span>
                  )}
                  <img
                    src={publicAssetUrl(stimulus.src)}
                    alt={stimulus.alt}
                    onError={() => markImageFailed(stimulus.id)}
                    className="w-full h-full object-cover rounded-xl"
                    decoding="async"
                  />
                </div>
              )}
              <figcaption className={`${compact ? 'mt-1.5' : 'mt-2'} text-center text-xs sm:text-sm font-black leading-snug ${isPecs ? 'text-amber-950 bg-amber-100/90 py-1.5 px-2 rounded-lg border border-amber-300/80' : 'text-[color:var(--ink-1)]'}`}>
                {stimulus.caption}
              </figcaption>
            </figure>
          );
        }

        return (
          <section
            key={stimulus.id}
            className="rounded-2xl border-2 p-4"
            style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-quiet)' }}
            aria-label={stimulus.label}
          >
            <p className="studio-kicker" style={{ color: accent }}>{stimulus.label}</p>
            <p className="mt-2 font-bold leading-relaxed">“{stimulus.text}”</p>
            <button
              type="button"
              onClick={() => speakNow(stimulus.text)}
              aria-label={`${stimulus.label} 소리 듣기`}
              className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border-2 px-4 py-2 font-bold"
              style={{ borderColor: accent, color: accent, background: 'var(--editorial-paper)' }}
            >
              <Icon name="speaker" size={20} /> 소리 듣기
            </button>
          </section>
        );
      })}
    </div>
  );
}
