import React from 'react';
import type { SummaryBlock, MissionBlock } from '../../../types';
import Icon from '../../Icon';

interface Props {
  key?: any;
  block: SummaryBlock;
  allBlocks: MissionBlock[];
  answers: Record<string, any>;
  accent: string;
}

export default function SummaryTable({ block, allBlocks, answers, accent }: Props) {
  return (
    <div className="w-full space-y-3 story-fade-in">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="star" size={20} filled color={accent} />
        <h3 className="text-lg font-bold text-neutral-800">{block.title}</h3>
      </div>

      <div className="border border-[color:var(--line)] rounded-[var(--r-md)] overflow-hidden shadow-sm bg-[color:var(--paper-0)]">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {block.rows.map((row, idx) => {
              const targetBlock = allBlocks.find((b) => b.id === row.from);
              const value = answers[row.from];

              let displayContent: React.ReactNode = (
                <span className="text-neutral-400 italic">아직 선택하지 않았어요</span>
              );

              if (value !== undefined && targetBlock) {
                if (targetBlock.kind === 'multi-pick') {
                  const arr = value as string[];
                  displayContent = arr.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {arr.map((item, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic">선택한 항목 없음</span>
                  );
                } else if (targetBlock.kind === 'single-pick') {
                  displayContent = (
                    <span className="inline-block px-2.5 py-1 bg-neutral-100 border border-neutral-200 rounded-full text-xs font-semibold text-neutral-700">
                      {value}
                    </span>
                  );
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
                        <div key={i} className="flex items-start gap-1 text-xs">
                          <span className="font-bold text-neutral-700 shrink-0 w-20">
                            {binLabel}:
                          </span>
                          <span className="text-neutral-600 leading-normal">
                            {cardLabels.length > 0 ? cardLabels.join(', ') : '-'}
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
                    <span className="font-bold text-neutral-800 italic bg-neutral-50 px-2 py-1 rounded border border-neutral-200">
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
                    <div className="flex flex-col gap-1 text-xs text-neutral-600 leading-relaxed list-decimal pl-4">
                      {chosenText.map((text, i) => (
                        <div key={i}>
                          {i + 1}. {text}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic">대화 진행 전</span>
                  );
                } else if (targetBlock.kind === 'scene-hunt') {
                  const foundLabels = value as string[];
                  displayContent = foundLabels.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {foundLabels.map((lbl, i) => (
                        <span key={i} className="px-2 py-0.5 bg-neutral-100 rounded text-xs text-neutral-600 font-medium border">
                          {lbl}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic">발견하지 못함</span>
                  );
                } else if (targetBlock.kind === 'vow') {
                  displayContent = (
                    <span className="font-semibold text-neutral-800">
                      {value}
                    </span>
                  );
                } else if (targetBlock.kind === 'draw') {
                  displayContent = value ? (
                    <div className="w-16 h-10 border rounded bg-white overflow-hidden flex items-center justify-center">
                      <img src={value} alt="그림" className="max-w-full max-h-full object-contain" />
                    </div>
                  ) : (
                    <span className="text-neutral-400 italic">그림 없음</span>
                  );
                }
              }

              return (
                <tr key={idx} className="border-b last:border-0 border-[color:var(--line)]">
                  <td className="w-1/3 px-4 py-3 bg-neutral-50/50 font-bold text-neutral-700 border-r border-[color:var(--line)] select-none">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 bg-[color:var(--paper-0)]">
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
