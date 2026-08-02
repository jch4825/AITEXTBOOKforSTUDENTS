import React, { useEffect, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import type { MiniGameProps } from '../types';
import { AacCardButton } from '../../../../components/AacCard';
import {
  BODY_FEELING_AAC_CARDS,
  BODY_ZONE_AAC_CARDS,
  TRUSTED_ADULT_AAC_CARDS,
} from '../../../../data/aacCards';

const STAGES = [
  { id: 'belly', label: '기본', situation: '배가 불편해요' },
  { id: 'head', label: '1단계', situation: '머리가 어지러워요' },
  { id: 'breath', label: '2단계', situation: '숨쉬기 불편해요' },
];
export default function SymptomMessengerGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const [zone, setZone] = useState('');
  const [feeling, setFeeling] = useState('');
  const [adult, setAdult] = useState('');
  useEffect(() => {
    setZone('');
    setFeeling('');
    setAdult('');
  }, [game.round, game.stageIndex]);
  const send = () => {
    if (!zone || !feeling || !adult) game.fail('몸 위치·느낌·알릴 사람 카드가 모두 필요해요.');
    else game.succeed(`${adult}에게 “${zone}가 ${feeling}”라고 관찰한 상태를 먼저 알렸어요!`);
  };

  return (
    <MiniGameFrame
      badge="몸 상태 구조 메시지"
      instruction="몸 그림에서 위치를 누르고 느낌과 믿을 만한 어른 카드를 골라 구조 메시지를 보내세요."
      stages={STAGES.slice(0, game.visibleStageCount)}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].situation)}
      status={game.status}
      message={game.message}
      actions={
        game.status === 'playing' ? (
          <MiniGameButton onClick={send} emoji="🛟" label="사람에게 알리기" variant="primary" />
        ) : (
          <MiniGameButton onClick={game.retry} emoji="🔁" label="다시 표현" />
        )
      }
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
        <section className="min-w-0">
          <h3 className="mb-1.5 text-[14px] font-black text-white">1. 몸 위치</h3>
          <div className="grid grid-cols-2 gap-1.5">
            {BODY_ZONE_AAC_CARDS.map((card) => (
              <AacCardButton
                key={card.id}
                card={card}
                selected={zone === card.label}
                onSelect={(selectedCard) => setZone(selectedCard.label)}
              />
            ))}
          </div>
        </section>
        <div className="min-w-0 space-y-2.5">
          <section>
            <h3 className="mb-1.5 text-[14px] font-black text-white">2. 느낌</h3>
            <div className="grid grid-cols-2 gap-1.5">
              {BODY_FEELING_AAC_CARDS.map((card) => (
                <AacCardButton
                  key={card.id}
                  card={card}
                  selected={feeling === card.label}
                  onSelect={(selectedCard) => setFeeling(selectedCard.label)}
                />
              ))}
            </div>
          </section>
          <section>
            <h3 className="mb-1.5 text-[14px] font-black text-white">3. 알릴 사람</h3>
            <div className="grid grid-cols-3 gap-1.5">
              {TRUSTED_ADULT_AAC_CARDS.map((card) => (
                <AacCardButton
                  key={card.id}
                  card={card}
                  selected={adult === card.label}
                  onSelect={(selectedCard) => setAdult(selectedCard.label)}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </MiniGameFrame>
  );
}
