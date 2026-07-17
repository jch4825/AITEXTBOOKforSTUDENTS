import type { HardLessonContent } from '../types';
import Button from './Button';
import Icon from './Icon';
import { useSpeak } from '../hooks/useSpeak';
import { wrapDictionaryTerms } from '../views/lessonTextUtils';

interface Props {
  content: HardLessonContent;
  accent: string;
  dictionaryTerms?: string[]; // 기존 text step의 사전 점선 연동 유지
}

/** '어려움' 본문 — 개념 문단 → 오늘의 용어 카드 → 어떻게 할까요 → 꼭 기억합니다 (spec §3.1). */
export default function HardLessonBody({ content, accent, dictionaryTerms = [] }: Props) {
  const { speakNow } = useSpeak();
  const conceptAll = content.concept.join(' ');
  return (
    <div className="space-y-6">
      {/* 개념 */}
      <section>
        {content.concept.map((para, i) => (
          <p key={i} className="t-body-lg mb-3">{wrapDictionaryTerms(para, dictionaryTerms)}</p>
        ))}
        <Button variant="secondary" accent={accent} onClick={() => speakNow(conceptAll)}>
          <Icon name="speaker" size={20} /> 읽어줘
        </Button>
      </section>

      {/* 오늘의 용어 */}
      <section>
        <h2 className="t-h2 mb-3" style={{ color: accent }}>오늘의 용어</h2>
        <ul className="space-y-3">
          {content.terms.map((t) => (
            <li
              key={t.term}
              className="rounded-[var(--r-md)] p-4"
              style={{ background: 'var(--paper-0)', border: '1px solid var(--line)', boxShadow: 'var(--e-1)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accent }}>{t.term}</span>
                <button
                  onClick={() => speakNow(`${t.term}. ${t.definition}${t.example ? ` 예를 들면, ${t.example}` : ''}`)}
                  aria-label={`${t.term} 읽어주기`}
                  className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[color:var(--paper-2)]"
                  style={{ color: accent }}
                ><Icon name="speaker" size={16} /></button>
              </div>
              <p className="mt-1">{t.definition}</p>
              {t.example && (
                <p className="mt-1 text-[color:var(--muted)]">예: {t.example}</p>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 어떻게 할까요 */}
      {content.method && content.method.length > 0 && (
        <section>
          <h2 className="t-h2 mb-3" style={{ color: accent }}>어떻게 할까요</h2>
          <ol className="space-y-2">
            {content.method.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span
                  className="shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: accent }}
                >{i + 1}</span>
                <span className="t-body-lg">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 꼭 기억합니다 — 한계·주의 (경고 톤) */}
      <section
        className="rounded-[var(--r-md)] p-4 flex items-start gap-3"
        style={{ background: 'var(--warn-bg)', border: '2px solid var(--warn)' }}
      >
        <Icon name="bulb" size={24} color="var(--warn)" />
        <div>
          <p className="t-label" style={{ color: 'var(--warn)' }}>꼭 기억합니다</p>
          <p className="t-body-lg">{content.limits}</p>
        </div>
      </section>
    </div>
  );
}
