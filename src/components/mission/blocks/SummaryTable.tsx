import React from 'react';
import type { SummaryBlock, MissionBlock } from '../../../types';
import Icon from '../../Icon';
import { activityColor } from '../../../utils/activityPalette';

interface Props {
  key?: any;
  block: SummaryBlock;
  allBlocks: MissionBlock[];
  answers: Record<string, any>;
  accent: string;
}

/** 앞 장에서 고른 라벨과 같은 색 칩 — "내가 고른 카드가 여기 모였다"를 색으로 잇는다. */
function LabelChip({ label }: { key?: any; label: string }) {
  const p = activityColor(label);
  return (
    <span
      className="px-3 py-1 rounded-[var(--r-pill)] text-sm font-bold inline-flex items-center"
      style={{ background: p.tint, border: `1.5px solid ${p.accent}`, color: 'var(--brand-ink)' }}
    >
      {label}
    </span>
  );
}

function EmptyHint({ text = '아직 고르지 않았습니다' }: { text?: string }) {
  return <span className="text-base" style={{ color: 'var(--muted)' }}>{text}</span>;
}

export default function SummaryTable({ block, allBlocks, answers, accent }: Props) {
  return (
    <div className="w-full space-y-3 story-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="star" size={22} filled color={accent} />
        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>{block.title}</h3>
      </div>

      <div className="border-2 rounded-[var(--r-md)] overflow-hidden bg-[color:var(--paper-0)]" style={{ borderColor: accent, boxShadow: 'var(--e-1)' }}>
        <table className="w-full border-collapse text-base">
          <tbody>
            {block.rows.map((row, idx) => {
              const targetBlock = allBlocks.find((b) => b.id === row.from);
              const value = answers[row.from];

              let displayContent: React.ReactNode = <EmptyHint />;

              if (value !== undefined && targetBlock) {
                if (targetBlock.kind === 'multi-pick') {
                  const arr = value as string[];
                  displayContent = arr.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {arr.map((item, i) => <LabelChip key={i} label={item} />)}
                    </div>
                  ) : (
                    <EmptyHint />
                  );
                } else if (targetBlock.kind === 'single-pick') {
                  displayContent = <LabelChip label={value as string} />;
                } else if (targetBlock.kind === 'drag-sort') {
                  const sortMap = value as Record<string, number>;
                  const binGroups: Record<string, string[]> = {};

                  targetBlock.bins.forEach((bin) => {
                    binGroups[bin.label] = [];
                  });

                  Object.entries(sortMap).forEach(([cardIdxStr, binIdx]) => {
                    const cardIdx = parseInt(cardIdxStr, 10);
                    const card = targetBlock.cards[cardIdx];
                    const bin = targetBlock.bins[binIdx];
                    if (card && bin) {
                      binGroups[bin.label].push(card.label);
                    }
                  });

                  displayContent = (
                    <div className="flex flex-col gap-2">
                      {Object.entries(binGroups).map(([binLabel, cardLabels], i) => (
                        <div key={i} className="flex items-start gap-2 text-base">
                          <span className="font-bold shrink-0" style={{ color: 'var(--brand-ink)' }}>
                            {binLabel}:
                          </span>
                          <span className="flex flex-wrap gap-1.5">
                            {cardLabels.length > 0
                              ? cardLabels.map((lbl, j) => <LabelChip key={j} label={lbl} />)
                              : <EmptyHint text="—" />}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                } else if (targetBlock.kind === 'drag-build') {
                  const slots = value as (number | null)[];
                  const words = slots.map((pieceIdx) => {
                    if (pieceIdx === null) return '____';
                    return targetBlock.pieces[pieceIdx]?.label || '____';
                  });
                  displayContent = (
                    <span
                      className="inline-block font-bold text-base px-3 py-1.5 rounded-[var(--r-sm)]"
                      style={{ background: 'var(--paper-2)', border: `1.5px solid ${accent}`, color: 'var(--brand-ink)' }}
                    >
                      "{words.join(' ')}"
                    </span>
                  );
                } else if (targetBlock.kind === 'branch-chat') {
                  const choicesIdx = value as number[];
                  const chosenText: string[] = [];

                  choicesIdx.forEach((choiceIdx, turnIdx) => {
                    const turn = targetBlock.turns[turnIdx];
                    const choice = turn?.choices[choiceIdx];
                    if (choice) {
                      chosenText.push(choice.label);
                    }
                  });

                  displayContent = chosenText.length > 0 ? (
                    <div className="flex flex-col gap-1 text-base leading-relaxed" style={{ color: 'var(--ink-1)' }}>
                      {chosenText.map((text, i) => (
                        <div key={i}>
                          {i + 1}. {text}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyHint text="대화를 아직 안 했습니다" />
                  );
                } else if (targetBlock.kind === 'scene-hunt') {
                  const foundLabels = value as string[];
                  displayContent = foundLabels.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {foundLabels.map((lbl, i) => <LabelChip key={i} label={lbl} />)}
                    </div>
                  ) : (
                    <EmptyHint text="아직 찾지 않았습니다" />
                  );
                } else if (targetBlock.kind === 'vow') {
                  displayContent = (
                    <span className="font-bold text-base" style={{ color: 'var(--brand-ink)' }}>
                      {value}
                    </span>
                  );
                } else if (targetBlock.kind === 'draw') {
                  displayContent = value ? (
                    <div
                      className="w-28 h-20 rounded-[var(--r-sm)] overflow-hidden flex items-center justify-center"
                      style={{ background: 'var(--paper-0)', border: '1.5px solid var(--line)' }}
                    >
                      <img src={value} alt="내가 그린 그림" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <EmptyHint text="그림이 없습니다" />
                  );
                }
              }

              return (
                <tr key={idx} className="border-b last:border-0 border-[color:var(--line)]">
                  <td
                    className="w-1/3 px-4 py-3.5 font-bold text-base border-r border-[color:var(--line)] select-none align-top"
                    style={{ background: 'var(--paper-1)', color: 'var(--brand-ink)' }}
                  >
                    {row.label}
                  </td>
                  <td className="px-4 py-3.5 bg-[color:var(--paper-0)]">
                    {displayContent}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
