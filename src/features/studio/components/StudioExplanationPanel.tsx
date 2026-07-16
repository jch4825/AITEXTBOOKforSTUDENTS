import { useState } from 'react';
import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import type { HardLessonContent, LessonContent } from '../../../types';
import { SUPPORT_LABELS } from '../supportLevel';
import type { SupportLevel } from '../types';

interface Props {
  lesson: LessonContent;
  hard?: HardLessonContent;
  supportLevel: SupportLevel;
  accent: string;
  onOpened: (mode: string) => void;
}

export default function StudioExplanationPanel({ lesson, hard, supportLevel, accent, onOpened }: Props) {
  const [open, setOpen] = useState(false);
  const { speakNow } = useSpeak();
  const challengeConcept = hard ? hard.concept : [lesson.bodyNormal];
  const goal = supportLevel === 'full'
    ? hard?.goal.easy ?? lesson.objective
    : supportLevel === 'light'
      ? hard?.goal.normal ?? lesson.objective
      : hard?.goal.hard ?? lesson.objective;
  const paragraphs = supportLevel === 'full'
    ? [lesson.bodyEasy]
    : supportLevel === 'light'
      ? [lesson.bodyNormal]
      : challengeConcept;
  const methods = supportLevel === 'full'
    ? []
    : supportLevel === 'light'
      ? hard?.method?.slice(0, 2) ?? []
      : hard?.method ?? [];
  const terms = supportLevel === 'challenge' ? hard?.terms ?? [] : [];
  const limits = supportLevel === 'challenge' ? hard?.limits : undefined;
  const spokenText = [goal, ...paragraphs, ...methods, limits].filter(Boolean).join('. ');

  function toggleOpen() {
    if (!open) onOpened(`explanation-${supportLevel}`);
    setOpen((value) => !value);
  }

  return (
    <section className="mt-5 rounded-xl border border-[color:var(--editorial-line)] bg-[color:var(--editorial-quiet)] p-4">
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left font-bold"
        style={{ color: accent }}
      >
        <span>{open ? '생각 도구 닫기' : '생각 도구 열기'} · {SUPPORT_LABELS[supportLevel]}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={20} />
      </button>

      {open && (
        <div className="mt-4 space-y-4 border-t border-[color:var(--editorial-line)] pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="studio-kicker" style={{ color: accent }}>지금 필요한 설명</p>
              <p className="font-bold">{goal}</p>
            </div>
            <button
              type="button"
              onClick={() => speakNow(spokenText)}
              aria-label="생각 도구 읽어주기"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2"
              style={{ borderColor: accent, color: accent, background: 'var(--editorial-paper)' }}
            >
              <Icon name="speaker" size={19} />
            </button>
          </div>
          {paragraphs.map((paragraph) => <p key={paragraph} className="leading-relaxed">{paragraph}</p>)}
          {terms.length > 0 && (
            <dl className="grid gap-2 sm:grid-cols-2">
              {terms.map((term) => (
                <div key={term.term} className="rounded-lg bg-[color:var(--editorial-paper)] p-3">
                  <dt className="font-bold" style={{ color: accent }}>{term.term}</dt>
                  <dd className="text-sm leading-relaxed">{term.definition}</dd>
                </div>
              ))}
            </dl>
          )}
          {methods.length > 0 && (
            <ol className="list-decimal space-y-1 pl-6">
              {methods.map((method) => <li key={method}>{method}</li>)}
            </ol>
          )}
          {limits && <p className="studio-margin-note text-sm"><strong>한계도 살펴보기:</strong> {limits}</p>}
        </div>
      )}
    </section>
  );
}
