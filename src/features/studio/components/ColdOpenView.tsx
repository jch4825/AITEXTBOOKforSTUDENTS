import { useId } from 'react';
import Icon from '../../../components/Icon';
import ListenButton, { ListenAllButton } from '../../../components/controls/ListenButton';
import { useSpeak } from '../../../hooks/useSpeak';
import { useSpeakingState } from '../../../hooks/useSpeakingState';
import ChoiceReactionPanel from './ChoiceReactionPanel';
import EditorialStudioFrame from './EditorialStudioFrame';
import PreparedStimulusPanel from './PreparedStimulusPanel';
import type { StudioDefinition } from '../types';

interface Props {
  definition: StudioDefinition;
  accent: string;
  secondary: string;
  dictionaryTerms: string[];
  /** 세션 메모리에만 남는 첫 판단. 저장하지 않는다. */
  picked: string | null;
  onPick: (choiceId: string) => void;
  /** 읽기 지원 단원이면 선택지마다 듣기 단추를 단다(data/readingSupport.ts). 고르는 일은 원래 조용하다. */
  readingSupport?: boolean;
}

/**
 * 포맷 C의 콜드오픈 미션 (05-ENGINE-SPEC §1-C).
 *
 * 배경 설명 없이 실전 판단을 먼저 겪게 한다. 여기서 고른 답은 **기록하지 않는다** —
 * 세션 메모리에만 두었다가 마지막 전이 단계에서 "처음 골랐던 답"으로 되비춰 성장을
 * 눈으로 보게 하는 용도다. 틀려도 벌점·타이머·부정 효과음이 없고 즉시 다시 고를 수 있다
 * (02-CHARACTERS §3 정서 안전).
 */
export default function ColdOpenView({
  definition,
  accent,
  secondary,
  dictionaryTerms,
  picked,
  onPick,
  readingSupport = false,
}: Props) {
  const { speakNow } = useSpeak();
  const { key: speakingKey } = useSpeakingState();
  // 소리의 이름이 다른 목록과 겹치지 않게 한다.
  const listId = useId();
  const { transfer } = definition;
  const prompt = transfer.prompt || `${transfer.title} 상황에서 어떻게 하겠어요?`;

  const left = (
    <div className="flex h-full flex-col justify-between rounded-2xl p-5 md:p-7">
      <div className="space-y-5">
        <div>
          <p className="studio-kicker" style={{ color: secondary }}>먼저 해 보기</p>
          <div className="flex items-center justify-between gap-3">
            <h2 className="mt-1 text-xl font-extrabold" style={{ color: 'var(--brand-ink)' }}>
              {transfer.title}
            </h2>
            <button
              type="button"
              onClick={() => speakNow(`${transfer.title}. ${transfer.description}`)}
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border bg-white depth-paper transition-all hover:scale-110"
              style={{ borderColor: accent, color: accent }}
              title="상황 듣기"
            >
              <Icon name="speaker" size={16} />
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold leading-relaxed text-[color:var(--brand-ink)]">
            {transfer.description}
          </p>
        </div>

        {transfer.stimuli?.length ? (
          <PreparedStimulusPanel stimuli={transfer.stimuli} accent={accent} />
        ) : null}
      </div>

      <div
        className="mt-5 rounded-lg border border-dashed bg-white p-3 text-sm font-semibold leading-relaxed"
        style={{ borderColor: 'var(--editorial-line)', color: 'var(--muted)' }}
      >
        아직 배우기 전입니다. 지금 떠오르는 대로 골라 보세요. 이 답은 기록되지 않습니다.
      </div>
    </div>
  );

  const right = (
    <div className="space-y-5 p-5 md:p-7">
      <div className={readingSupport ? 'flex items-start justify-between gap-3' : undefined}>
        <div>
          <p className="studio-kicker" style={{ color: accent }}>지금이라면 어떻게 할까요</p>
          <h2 className="mt-1 text-xl font-extrabold">{prompt}</h2>
        </div>
        {/* 물음 옆 단추 하나가 물음과 선택지를 차례로 읽는다. 읽는 카드는 윤곽으로 따라간다. */}
        {readingSupport ? (
          <ListenAllButton
            compact
            group={`${listId}:all`}
            accent={accent}
            label="물음과 선택지 모두 듣기"
            items={[
              { key: `${listId}:prompt`, text: prompt },
              ...transfer.choices.map((choice) => ({ key: `${listId}:${choice.id}`, text: choice.label })),
            ]}
          />
        ) : null}
      </div>

      <div role="group" aria-label="첫 판단 고르기" className="grid gap-2.5">
        {transfer.choices.map((choice, index) => {
          const selected = picked === choice.id;
          const card = (
            <button
              key={choice.id}
              type="button"
              onClick={() => onPick(choice.id)}
              aria-pressed={selected}
              data-reading={readingSupport && speakingKey === `${listId}:${choice.id}` ? 'true' : undefined}
              className="flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border-2 px-4 py-3 text-left text-base font-bold transition-all hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{
                borderColor: selected ? accent : 'var(--editorial-line)',
                background: selected ? 'var(--editorial-paper)' : 'white',
                color: 'var(--brand-ink)',
                outlineColor: accent,
                borderWidth: selected ? 4 : 2,
              }}
            >
              <span aria-hidden className="text-xl leading-none">{choice.emoji}</span>
              <span className="leading-snug">{choice.label}</span>
            </button>
          );
          if (!readingSupport) return card;
          // 듣기 단추는 카드 곁에 둔다. 카드 안에 넣으면 듣다가 답이 정해진다.
          return (
            <div key={choice.id} className="reading-choice-row">
              {card}
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

      <ChoiceReactionPanel
        choices={transfer.choices}
        expression={picked ? { mode: 'choice', choiceIds: [picked] } : undefined}
        accent={accent}
        dictionaryTerms={dictionaryTerms}
        readingSupport={readingSupport}
      />
    </div>
  );

  return (
    <EditorialStudioFrame
      definition={definition}
      stage="encounter"
      viewLabel="먼저 해 보기"
      accent={accent}
      secondary={secondary}
      left={left}
      right={right}
    />
  );
}
