import { useState } from 'react';
import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import type { PreparedStimulus } from '../types';

interface Props {
  stimuli: PreparedStimulus[];
  accent: string;
}

export default function PreparedStimulusPanel({ stimuli, accent }: Props) {
  const { speakNow } = useSpeak();
  const [failedImages, setFailedImages] = useState<string[]>([]);

  function markImageFailed(id: string) {
    setFailedImages((current) => current.includes(id) ? current : [...current, id]);
  }

  const isSingle = stimuli.length === 1;
  const isTriple = stimuli.length === 3;

  return (
    <div className={`${isSingle ? 'flex justify-center' : `grid gap-2.5 sm:gap-3 ${isTriple ? 'grid-cols-3' : 'sm:grid-cols-2'}`}`} aria-label="교과서에 준비된 이미지와 소리">
      {stimuli.map((stimulus) => {
        if (stimulus.kind === 'image') {
          const failed = failedImages.includes(stimulus.id);
          const isPecs = stimulus.id.includes('pecs');
          return (
            <figure
              key={stimulus.id}
              className={`flex flex-col justify-between overflow-hidden rounded-2xl border-2 p-3 shadow-xs transition-transform hover:scale-102 ${isPecs ? 'bg-white border-amber-400 shadow-md ring-1 ring-amber-300/50' : ''} ${isSingle ? 'w-72 sm:w-80 md:w-96 max-w-full mx-auto' : 'w-full'}`}
              style={!isPecs ? { borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' } : undefined}
            >
              {failed ? (
                <div
                  role="img"
                  aria-label={stimulus.alt}
                  className="studio-margin-note flex aspect-square flex-col justify-center text-center text-xs"
                >
                  <strong>이미지 불러오기 실패</strong>
                  <p className="mt-1 text-[10px] text-slate-500">{stimulus.caption}</p>
                </div>
              ) : (
                <div className={`relative w-full aspect-square overflow-hidden rounded-xl ${isPecs ? 'bg-amber-50/50' : ''}`}>
                  {isPecs && (
                    <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[10px] shadow-xs uppercase tracking-wider z-10 select-none">
                      PECS
                    </span>
                  )}
                  <img
                    src={stimulus.src}
                    alt={stimulus.alt}
                    onError={() => markImageFailed(stimulus.id)}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              )}
              <figcaption className={`mt-2 text-center text-xs sm:text-sm font-black leading-snug ${isPecs ? 'text-amber-950 bg-amber-100/90 py-1.5 px-2 rounded-lg border border-amber-300/80' : 'text-[color:var(--ink-1)]'}`}>
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
