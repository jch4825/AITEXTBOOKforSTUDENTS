import type { CSSProperties } from 'react';
import { choiceCardImageSrc, type ChoiceCardSet } from '../../../data/choiceCards';
import Icon from '../../Icon';
import ListenButton from '../../controls/ListenButton';

interface ChoiceItem {
  id: string;
  emoji: string;
  label: string;
  isCorrect?: boolean;
}

interface Props {
  choices: ChoiceItem[];
  cardSet: ChoiceCardSet;
  selectedIds: string[];
  accent: string;
  /** 읽는 소리의 이름 앞부분. 문장 고르기와 같은 이름을 써서 "모두 듣기"가 두 방식에서 같은 카드를 짚는다. */
  listId: string;
  /** 지금 읽는 소리의 이름. 읽는 카드를 윤곽으로 따라간다. */
  speakingKey: string | null;
  onSelect: (id: string, label: string) => void;
}

/**
 * 선택지를 그림 카드로 그린다(data/choiceCards/). 카드 한 장이 선택지 하나이고,
 * 카드를 고르는 일은 문장 고르기에서 선택지를 고르는 일과 같다(기록되는 것은 선택지 id다).
 *
 * 카드의 글자는 짧은 상징이고 뜻은 듣기 단추가 선택지 문장 전체를 읽어 준다. 듣기 단추는 카드 단추의
 * 곁에 있다 — 한 단추면 듣다가 답이 정해진다. 맞고 틀림은 색 하나로 알리지 않고 표시 그림으로 함께 알린다.
 */
export default function AacChoiceGrid({ choices, cardSet, selectedIds, accent, listId, speakingKey, onSelect }: Props) {
  return (
    // 카드 줄 수는 칸 폭(@container)과 선택지 수로 정한다. 좁은 칸에서 셋은 한 줄, 넷은 두 줄이다.
    <div className="aac-grid-box">
      <div className="aac-grid" data-count={Math.min(choices.length, 4)} role="group" aria-label="그림 카드로 고르기">
        {choices.map((choice, index) => {
          // 카드가 빠진 선택지도 감추지 않는다(check:choice-cards가 빠짐을 막는다).
          const card = cardSet.cards[choice.id] ?? { label: choice.label };
          const selected = selectedIds.includes(choice.id);
          const verdict = selected ? choice.isCorrect : undefined;
          return (
            <div key={choice.id} className="aac-card-wrap">
              <button
                type="button"
                onClick={() => onSelect(choice.id, choice.label)}
                aria-pressed={selected}
                data-reading={speakingKey === `${listId}:${choice.id}` ? 'true' : undefined}
                data-verdict={verdict === true ? 'right' : verdict === false ? 'wrong' : undefined}
                className="aac-card surface-choice"
                style={{ '--aac-accent': accent } as CSSProperties}
              >
                {card.cardId ? (
                  <img
                    className="aac-card-art"
                    src={choiceCardImageSrc(cardSet.moduleId, card.cardId)}
                    alt=""
                    draggable={false}
                  />
                ) : (
                  <span className="aac-card-emoji" aria-hidden>{card.emoji ?? choice.emoji}</span>
                )}
                <span className="aac-card-label">{card.label}</span>
                {/* 눈으로 보이는 글자는 짧은 상징이라, 화면 읽기 프로그램에는 선택지 문장 전체를 준다. */}
                <span className="sr-only">{choice.label}</span>
                {selected ? (
                  <span className="aac-card-mark" aria-hidden>
                    <Icon name={verdict === false ? 'refresh' : 'check'} size={18} strokeWidth={3} />
                  </span>
                ) : null}
              </button>
              <ListenButton
                text={choice.label}
                speakKey={`${listId}:${choice.id}`}
                label={`${index + 1}번 카드 듣기`}
                accent={accent}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
