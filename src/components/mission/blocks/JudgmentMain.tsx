import React, { useMemo, useState } from 'react';
import type {
  GeneralizationAiDecision,
  GeneralizationExpression,
  JudgmentMainBlock,
} from '../../../types';
import { useGeneralizationCycle } from '../useGeneralizationCycle';
import ExpressionInput from './ExpressionInput';
import TeacherObservation from './TeacherObservation';
import Icon from '../../Icon';
import { isTeacherSessionActive } from '../../../utils/teacherMode';
import { useSpeak } from '../../../hooks/useSpeak';

interface MainValue {
  importantInfoIds: string[];
  exploredMethodIds: string[];
  aiDecision?: GeneralizationAiDecision;
  finalThought?: GeneralizationExpression;
  transferChoiceId?: string;
}

interface Props {
  key?: any;
  block: JudgmentMainBlock;
  value: MainValue | undefined;
  studentName: string;
  accent: string;
  onChange: (value: MainValue) => void;
}

type Phase = 'preview' | 'conditions' | 'info' | 'methods' | 'ai' | 'decision' | 'final' | 'transfer' | 'record';

const EMPTY_VALUE: MainValue = { importantInfoIds: [], exploredMethodIds: [] };

export default function JudgmentMain({ block, value = EMPTY_VALUE, studentName, accent, onChange }: Props) {
  const { speakNow } = useSpeak();
  const cycle = useGeneralizationCycle(block.cycleId, block.moduleId, studentName);
  const [phase, setPhase] = useState<Phase>(() => cycle.record?.main ? 'record' : 'preview');
  const [local, setLocal] = useState<MainValue>({ ...EMPTY_VALUE, ...value });
  const [observation, setObservation] = useState(cycle.record?.observation);
  const firstThought = cycle.record?.preview?.firstThought;
  const teacherSession = useMemo(() => isTeacherSessionActive(), []);

  function updateValue(next: MainValue) {
    setLocal(next);
    onChange(next);
  }

  function captureFallback(first: GeneralizationExpression) {
    cycle.update({
      preview: {
        firstThought: first,
        capturedAt: new Date().toISOString(),
        capturedAtMain: true,
      },
    });
    setPhase('conditions');
  }

  function toggle(id: string, key: 'importantInfoIds' | 'exploredMethodIds') {
    const current = local[key];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    updateValue({ ...local, [key]: next });
  }

  function chooseDecision(aiDecision: GeneralizationAiDecision) {
    const next = { ...local, aiDecision };
    updateValue(next);
    setPhase('final');
  }

  function chooseFinal(finalThought: GeneralizationExpression) {
    const hasExpression = Boolean(
      finalThought.choiceIds?.length || finalThought.text?.trim() || finalThought.drawing,
    );
    if (!hasExpression) return;
    updateValue({ ...local, finalThought });
    setPhase('transfer');
  }

  function chooseTransfer(transferChoiceId: string) {
    const next = { ...local, transferChoiceId };
    updateValue(next);
    if (next.aiDecision && next.finalThought) {
      cycle.update({
        main: {
          importantInfoIds: next.importantInfoIds,
          exploredMethodIds: next.exploredMethodIds,
          aiDecision: next.aiDecision,
          finalThought: next.finalThought,
          transferChoiceId,
          capturedAt: new Date().toISOString(),
        },
      });
    }
    setPhase('record');
  }

  function saveObservation(next: typeof observation) {
    setObservation(next);
    if (next) cycle.update({ observation: next });
  }

  const previewLabel = firstThought?.choiceIds
    ?.map((id) => block.finalChoices.find((choice) => choice.id === id)?.label || id)
    .filter(Boolean)
    .join(', ');

  function nextButton(label: string, disabled = false, next?: Phase) {
    return (
      <button
        type="button"
        className="px-5 py-3 rounded-[var(--r-md)] font-bold border-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: accent, color: accent, background: 'var(--paper-0)' }}
        disabled={disabled}
        onClick={() => next && setPhase(next)}
      >{label}</button>
    );
  }

  function choiceCards(items: { id: string; emoji: string; label: string }[], selected: string[], key: 'importantInfoIds' | 'exploredMethodIds', multi = true, onPick?: (id: string) => void) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => {
          const isSelected = selected.includes(item.id);
          return (
            <button
              type="button"
              key={item.id}
              aria-pressed={isSelected}
              onClick={() => {
                if (onPick) onPick(item.id);
                else if (!multi) updateValue({ ...local, [key]: [item.id] });
                else toggle(item.id, key);
              }}
              className="card3d flex items-center gap-3 p-4 rounded-[var(--r-md)] min-h-20 text-left font-bold cursor-pointer"
              style={{
                border: isSelected ? `4px solid ${accent}` : '2.5px solid var(--line)',
                background: isSelected ? 'var(--paper-1)' : 'var(--paper-0)',
                color: 'var(--brand-ink)',
              }}
            >
              <span className="text-3xl shrink-0" aria-hidden>{item.emoji}</span>
              <span className="leading-tight">{item.label}</span>
              {isSelected && <Icon name="check" size={20} color={accent} strokeWidth={3} className="ml-auto shrink-0" />}
            </button>
          );
        })}
      </div>
    );
  }

  if (phase === 'preview') {
    return (
      <div className="w-full space-y-5 story-fade-in">
        <div className="flex items-start gap-3 p-4 rounded-[var(--r-md)]" style={{ background: 'var(--paper-1)' }}>
          <Icon name="think" size={22} color={accent} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold" style={{ color: accent }}>그때의 첫 생각을 다시 만나요</p>
            {firstThought ? (
              <p className="mt-1 text-lg font-semibold" style={{ color: 'var(--brand-ink)' }}>{previewLabel || '내 방식으로 표현했어요.'}</p>
            ) : (
              <p className="mt-1" style={{ color: 'var(--ink-1)' }}>예고 기록이 아직 없어요. 지금의 첫 생각을 남기고 시작해요.</p>
            )}
          </div>
        </div>
        {!firstThought && (
          <ExpressionInput
            choices={block.finalChoices}
            expressionModes={block.expressionModes}
            prompt="지금 처음 생각한 방법을 하나 골라 보세요."
            accent={accent}
            onChange={captureFallback}
          />
        )}
        {(firstThought || cycle.record?.preview?.capturedAtMain) && (
          <div className="flex justify-end">{nextButton('달라진 장면 보기', false, 'conditions')}</div>
        )}
      </div>
    );
  }

  if (phase === 'conditions') {
    return (
      <div className="w-full space-y-5 story-fade-in">
        <div className="flex items-start gap-2">
          <h3 className="text-xl font-bold flex-1" style={{ color: 'var(--brand-ink)' }}>{block.changedScenario.title}</h3>
          <button type="button" onClick={() => speakNow(block.changedScenario.description)} aria-label="달라진 장면 다시 듣기" className="h-10 w-10 rounded-full border-2 flex items-center justify-center" style={{ borderColor: accent, color: accent }}><Icon name="speaker" size={20} /></button>
        </div>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-1)' }}>{block.changedScenario.description}</p>
        <div className="flex flex-wrap gap-2">
          {block.changedScenario.changedConditions.map((condition) => <span key={condition} className="px-3 py-2 rounded-[var(--r-pill)] text-sm font-bold" style={{ background: 'var(--paper-1)', color: accent }}>{condition}</span>)}
        </div>
        <div className="flex justify-end">{nextButton('중요한 정보 찾기', false, 'info')}</div>
      </div>
    );
  }

  if (phase === 'info') {
    return (
      <div className="w-full space-y-5 story-fade-in">
        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>중요한 정보를 찾아요</h3>
        <p className="text-lg" style={{ color: 'var(--ink-1)' }}>이 장면에서 먼저 살펴볼 정보를 골라 보세요.</p>
        {choiceCards(block.importantInfo, local.importantInfoIds, 'importantInfoIds')}
        <div className="flex justify-end">{nextButton('방법 두 가지 살펴보기', local.importantInfoIds.length === 0, 'methods')}</div>
      </div>
    );
  }

  if (phase === 'methods') {
    return (
      <div className="w-full space-y-5 story-fade-in">
        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>가능한 방법을 두 가지 이상 살펴봐요</h3>
        <p className="text-lg" style={{ color: 'var(--ink-1)' }}>지금 할 수 있는 방법을 두 가지 이상 골라 비교해 보세요.</p>
        {choiceCards(block.methods, local.exploredMethodIds, 'exploredMethodIds')}
        <div className="flex justify-end">{nextButton('아이미의 다른 생각 보기', local.exploredMethodIds.length < 2, 'ai')}</div>
      </div>
    );
  }

  if (phase === 'ai') {
    return (
      <div className="w-full space-y-5 story-fade-in">
        <div className="p-5 rounded-[var(--r-md)] border-2" style={{ borderColor: accent, background: 'var(--paper-1)' }}>
          <p className="font-bold mb-2" style={{ color: accent }}>{block.aiContribution.title}</p>
          <p className="text-lg leading-relaxed" style={{ color: 'var(--brand-ink)' }}>{block.aiContribution.text}</p>
          {block.aiContribution.question && <p className="mt-3 font-semibold" style={{ color: 'var(--ink-1)' }}>{block.aiContribution.question}</p>}
        </div>
        <div className="flex justify-end">{nextButton('아이미의 생각과 비교하기', false, 'decision')}</div>
      </div>
    );
  }

  if (phase === 'decision') {
    const decisions: { id: GeneralizationAiDecision; label: string; emoji: string }[] = [
      { id: 'accept', label: '받아들일래요', emoji: '👍' },
      { id: 'modify', label: '조금 바꿀래요', emoji: '🛠️' },
      { id: 'keep', label: '내 생각을 유지할래요', emoji: '🧭' },
    ];
    return (
      <div className="w-full space-y-5 story-fade-in">
        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>아이미의 생각을 보고 내가 판단해요</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {decisions.map((decision) => (
            <button type="button" key={decision.id} onClick={() => chooseDecision(decision.id)} className="card3d p-4 rounded-[var(--r-md)] min-h-28 flex flex-col items-center justify-center gap-2 font-bold cursor-pointer" style={{ border: `2.5px solid ${accent}`, background: 'var(--paper-0)', color: 'var(--brand-ink)' }}>
              <span className="text-3xl" aria-hidden>{decision.emoji}</span>
              <span>{decision.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (phase === 'final') {
    return (
      <div className="w-full space-y-5 story-fade-in">
        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>내가 실제로 할 방법을 정해요</h3>
        <ExpressionInput
          value={local.finalThought}
          choices={block.finalChoices}
          expressionModes={block.expressionModes}
          prompt="이 상황에서 내가 사용할 방법을 골라 보세요."
          accent={accent}
          onChange={chooseFinal}
        />
      </div>
    );
  }

  if (phase === 'transfer') {
    return (
      <div className="w-full space-y-5 story-fade-in">
        <h3 className="text-xl font-bold" style={{ color: 'var(--brand-ink)' }}>새 장면에 한 번 더 적용해요</h3>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-1)' }}>{block.transfer.title}: {block.transfer.description}</p>
        {choiceCards(block.transfer.choices, local.transferChoiceId ? [local.transferChoiceId] : [], 'importantInfoIds', false, (id) => updateValue({ ...local, transferChoiceId: id }))}
        <div className="flex justify-end">
          <button type="button" className="px-5 py-3 rounded-[var(--r-md)] font-bold border-2 cursor-pointer disabled:opacity-40" style={{ borderColor: accent, color: accent }} disabled={!local.transferChoiceId} onClick={() => chooseTransfer(local.transferChoiceId!)}>기록 카드 보기</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5 story-fade-in">
      <div className="p-5 rounded-[var(--r-md)] border-2" style={{ borderColor: accent, background: 'var(--paper-1)' }}>
        <h3 className="text-xl font-bold" style={{ color: accent }}>생각 증거 카드</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-base" style={{ color: 'var(--brand-ink)' }}>
          <div><b>첫 생각</b><p>{previewLabel || '내 방식으로 표현했어요.'}</p></div>
          <div><b>AI와 비교</b><p>{local.aiDecision === 'accept' ? '아이미의 방법을 받아들였어요.' : local.aiDecision === 'modify' ? '아이미의 방법을 조금 바꿨어요.' : '내 생각을 유지했어요.'}</p></div>
          <div><b>최종 생각</b><p>{local.finalThought?.text || local.finalThought?.choiceIds?.map((id) => block.finalChoices.find((choice) => choice.id === id)?.label || id).join(', ') || '내 방식으로 표현했어요.'}</p></div>
          <div><b>새 장면</b><p>{block.transfer.choices.find((choice) => choice.id === local.transferChoiceId)?.label || '선택을 기록했어요.'}</p></div>
        </div>
      </div>
      {teacherSession && <TeacherObservation value={observation} onChange={saveObservation} accent={accent} />}
    </div>
  );
}
