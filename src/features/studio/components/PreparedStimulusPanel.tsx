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

  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label="교과서에 준비된 이미지와 소리">
      {stimuli.map((stimulus) => {
        if (stimulus.kind === 'image') {
          const failed = failedImages.includes(stimulus.id);
          return (
            <figure
              key={stimulus.id}
              className="overflow-hidden rounded-2xl border-2 p-3"
              style={{ borderColor: 'var(--editorial-line)', background: 'var(--editorial-paper)' }}
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
                <img
                  src={stimulus.src}
                  alt={stimulus.alt}
                  onError={() => markImageFailed(stimulus.id)}
                  className="mx-auto h-36 w-full object-contain"
                />
              )}
              <figcaption className="mt-2 text-sm font-semibold leading-relaxed">{stimulus.caption}</figcaption>
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
