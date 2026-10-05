import { useState } from 'react';
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
 *
 * 카드 글은 두 겹이다. `core`는 정리된 정의라 추상적이고, `detail`은 지원 수준별로 풀어 쓴 글이다.
 * 중학·고등은 `core`를 중심 문장으로 두고 그 아래에 `detail`을 보인다. 충분한 지원은 거꾸로,
 * 가장 쉬운 글(`detail.full`)을 중심 문장으로 올리고 추상적인 `core`는 접어 둔다. 예전에는
 * 충분한 지원에서 `detail`을 아예 그리지 않아, 가장 쉬운 글 186개가 한 번도 화면에 나오지 않고
 * 가장 도움이 필요한 학생이 가장 추상적인 문장만 읽었다.
 */
export default function ConceptNotes({
  knowledge,
  supportLevel,
  accent,
  dictionaryTerms,
  activeIndex,
}: Props) {
  const { speakNow } = useSpeak();
  const foldCore = supportLevel === 'full';
  /* 펼친 카드의 core는 그 카드의 듣기 단추도 함께 읽는다. 접힌 글을 소리로만 들려주지 않는다. */
  const [openedCore, setOpenedCore] = useState<ReadonlySet<number>>(() => new Set());

  const toggleCore = (index: number, open: boolean) => {
    setOpenedCore((prev) => {
      const next = new Set(prev);
      if (open) next.add(index);
      else next.delete(index);
      return next;
    });
  };

  return (
    <div className="visual-novel-knowledge-list">
      {knowledge.map((item, index) => {
        const lead = foldCore ? item.detail.full : item.core;
        const rest = foldCore ? item.core : item.detail[supportLevel];
        const restSpoken = !foldCore || openedCore.has(index);

        return (
          <article
            key={item.title}
            className="visual-novel-knowledge flex justify-between items-start gap-3"
            data-active={activeIndex === undefined ? undefined : activeIndex === index}
          >
            <div className="flex gap-3">
              <span>{index + 1}</span>
              <div>
                <h4>{wrapDictionaryTerms(item.title, dictionaryTerms)}</h4>
                <p><strong>{wrapDictionaryTerms(lead, dictionaryTerms)}</strong></p>
                {foldCore ? (
                  <details
                    className="visual-novel-knowledge-more"
                    onToggle={(event) => toggleCore(index, event.currentTarget.open)}
                  >
                    <summary>자세한 설명 보기</summary>
                    <p>{wrapDictionaryTerms(rest, dictionaryTerms)}</p>
                  </details>
                ) : (
                  <p>{wrapDictionaryTerms(rest, dictionaryTerms)}</p>
                )}
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
                let text = `개념 ${index + 1}. ${item.title}. ${lead}`;
                if (restSpoken) text += `. ${rest}`;
                if (item.flow) {
                  text += `. 입력은 ${item.flow.input}, 과정은 ${item.flow.process}, 출력은 ${item.flow.output}입니다.`;
                }
                speakNow(text);
              }}
              className="h-7 w-7 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-110 shrink-0 mt-1 depth-paper bg-white"
              style={{ borderColor: accent, color: accent }}
              title="개념 카드 듣기"
            >
              <Icon name="speaker" size={14} />
            </button>
          </article>
        );
      })}
    </div>
  );
}
