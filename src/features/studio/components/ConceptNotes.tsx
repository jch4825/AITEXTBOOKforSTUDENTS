import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import { wrapDictionaryTerms } from '../../../views/lessonTextUtils';
import type { SupportLevel, VisualNovelKnowledge } from '../types';

interface Props {
  knowledge: readonly VisualNovelKnowledge[];
  supportLevel: SupportLevel;
  accent: string;
  dictionaryTerms: string[];
  /** 이야기 화면에서 지금 장면이 가리키는 카드. 정리 노트에서는 비운다(모두 같은 무게). */
  activeIndex?: number;
}

/**
 * 개념 카드 3장.
 *
 * 이야기 옆(포맷 미지정 차시)과 정리 노트 화면(포맷 A~E)이 같은 마크업을 쓴다.
 * TTS 버튼과 사전 밑줄은 두 자리 모두에서 그대로 동작한다(05-ENGINE-SPEC §5).
 */
export default function ConceptNotes({
  knowledge,
  supportLevel,
  accent,
  dictionaryTerms,
  activeIndex,
}: Props) {
  const { speakNow } = useSpeak();

  return (
    <div className="visual-novel-knowledge-list">
      {knowledge.map((item, index) => (
        <article
          key={item.title}
          className="visual-novel-knowledge flex justify-between items-start gap-3"
          data-active={activeIndex === undefined ? undefined : activeIndex === index}
        >
          <div className="flex gap-3">
            <span>{index + 1}</span>
            <div>
              <h4>{wrapDictionaryTerms(item.title, dictionaryTerms)}</h4>
              <p><strong>{wrapDictionaryTerms(item.core, dictionaryTerms)}</strong></p>
              {supportLevel !== 'full' && <p>{wrapDictionaryTerms(item.detail[supportLevel], dictionaryTerms)}</p>}
              {item.flow && (
                <div
                  className="visual-novel-flow"
                  aria-label={`${item.flow.input}, ${item.flow.process}, ${item.flow.output}`}
                >
                  <b>{wrapDictionaryTerms(item.flow.input, dictionaryTerms)}</b>
                  <i aria-hidden>→</i>
                  <b>{wrapDictionaryTerms(item.flow.process, dictionaryTerms)}</b>
                  <i aria-hidden>→</i>
                  <b>{wrapDictionaryTerms(item.flow.output, dictionaryTerms)}</b>
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              let text = `개념 ${index + 1}. ${item.title}. ${item.core}. ${supportLevel !== 'full' ? item.detail[supportLevel] : ''}`;
              if (item.flow) {
                text += `. 입력은 ${item.flow.input}, 과정은 ${item.flow.process}, 출력은 ${item.flow.output} 입니다.`;
              }
              speakNow(text);
            }}
            className="h-7 w-7 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-110 shrink-0 mt-1 shadow-xs bg-white"
            style={{ borderColor: accent, color: accent }}
            title="개념 카드 듣기"
          >
            <Icon name="speaker" size={14} />
          </button>
        </article>
      ))}
    </div>
  );
}
