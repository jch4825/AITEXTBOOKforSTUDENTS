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
    <div className={`grid gap-3 ${isSingle ? 'grid-cols-1' : isTriple ? 'grid-cols-1 xs:grid-cols-3' : 'sm:grid-cols-2'}`} aria-label="교과서에 준비된 이미지와 소리">
      {stimuli.map((stimulus) => {
        if (stimulus.kind === 'image') {
          const failed = failedImages.includes(stimulus.id);
          const isPecs = stimulus.id.includes('pecs');
          return (
            <figure
              key={stimulus.id}
              className={`overflow-hidden rounded-2xl border-2 p-2 shadow-2xs transition-transform hover:scale-102 ${isPecs ? 'bg-white border-amber-400 shadow-md' : ''}`}
              style={!isPecs ? { borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' } : undefined}
            >
              {failed ? (
                <div
                  role="img"
                  aria-label={stimulus.alt}
                  className="studio-margin-note flex min-h-32 flex-col justify-center text-sm"
                >
                  <strong>이미지를 불러오지 못했습니다.</strong>
                  <p className="mt-1">{stimulus.caption}</p>
                </div>
              ) : (
                <div className="relative">
                  {isPecs && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] shadow-xs uppercase tracking-wider z-10">
                      PECS
                    </span>
                  )}
                  <img
                    src={stimulus.src}
                    alt={stimulus.alt}
                    onError={() => markImageFailed(stimulus.id)}
                    className={`mx-auto w-full rounded-xl object-cover ${isSingle ? 'h-48 sm:h-56' : isTriple ? 'h-24 sm:h-28 object-contain' : 'h-36 object-contain'}`}
                  />
                </div>
              )}
              <figcaption className={`mt-1.5 text-center text-xs font-black leading-tight ${isPecs ? 'text-amber-950 bg-amber-100/90 p-1.5 rounded-lg border border-amber-300' : 'text-[color:var(--ink-1)]'}`}>
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
