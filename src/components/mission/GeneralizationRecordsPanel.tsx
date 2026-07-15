import { useEffect, useState } from 'react';
import type { GeneralizationAiDecision, GeneralizationCycleRecord, GeneralizationExpression, ModuleId } from '../../types';
import { MODULES } from '../../data/modules';
import { GENERALIZATION_CYCLES } from '../../data/generalizationCycles';
import {
  readGeneralizationRecords,
  updateGeneralizationRecord,
} from '../../utils/generalizationStorage';
import TeacherObservation from './blocks/TeacherObservation';
import Icon from '../Icon';

function expressionLabel(expression: GeneralizationExpression | undefined, moduleId: ModuleId, final = false): string {
  if (!expression) return '아직 기록이 없어요.';
  const choices = final
    ? GENERALIZATION_CYCLES[moduleId].main.finalChoices
    : GENERALIZATION_CYCLES[moduleId].preview.choices;
  if (expression.choiceIds?.length) {
    return expression.choiceIds.map((id) => choices.find((choice) => choice.id === id)?.label || id).join(', ');
  }
  if (expression.text?.trim()) return expression.text;
  if (expression.drawing) return '그림으로 표현했어요.';
  return '표현했어요.';
}

function decisionLabel(decision: GeneralizationAiDecision | undefined): string {
  if (decision === 'accept') return '아이미의 방법을 받아들였어요.';
  if (decision === 'modify') return '아이미의 방법을 조금 바꿨어요.';
  if (decision === 'keep') return '내 생각을 유지했어요.';
  return '아직 비교 기록이 없어요.';
}

export default function GeneralizationRecordsPanel() {
  const [records, setRecords] = useState(() => readGeneralizationRecords());

  useEffect(() => {
    const refresh = () => setRecords(readGeneralizationRecords());
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  function saveObservation(record: GeneralizationCycleRecord, observation: NonNullable<GeneralizationCycleRecord['observation']>) {
    const next = updateGeneralizationRecord(record.cycleId, {
      moduleId: record.moduleId,
      studentName: record.studentName,
      observation,
    });
    setRecords((current) => ({ ...current, [record.cycleId]: next }));
  }

  return (
    <section className="p-6 card border border-[color:var(--border)] mb-6">
      <div className="flex items-start gap-3 mb-2">
        <Icon name="think" size={24} color="var(--accent)" className="shrink-0 mt-0.5" />
        <div>
          <h2 className="text-xl font-bold">일반화 과정 기록</h2>
          <p className="text-sm text-[color:var(--muted)] mt-1">첫 생각과 마지막 판단을 비교하고, 정답률 대신 시도 과정을 기록해요. 이 기기의 학생 1명 기록입니다.</p>
        </div>
      </div>

      <div className="space-y-3 mt-5">
        {MODULES.map((module) => {
          const record = records[GENERALIZATION_CYCLES[module.id].cycleId];
          return (
            <details key={module.id} className="border rounded-[var(--r-sm)] overflow-hidden">
              <summary className="cursor-pointer px-4 py-3 font-semibold bg-[color:var(--paper-1)]">
                단원 {module.number}. {module.title}
                <span className="ml-2 text-xs font-normal text-[color:var(--muted)]">{record ? '기록 있음' : '아직 기록 없음'}</span>
              </summary>
              <div className="p-4 space-y-4">
                {!record ? (
                  <p className="text-sm text-[color:var(--muted)]">아직 기록이 없어요. 학생이 예고 또는 본 활동을 시작하면 여기에 나타나요.</p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="p-3 rounded-[var(--r-sm)]" style={{ background: 'var(--paper-1)' }}>
                        <b>학생</b><p>{record.studentName || '친구'}</p>
                      </div>
                      <div className="p-3 rounded-[var(--r-sm)]" style={{ background: 'var(--paper-1)' }}>
                        <b>예고 참여</b><p>{record.preview?.capturedAtMain ? '마지막 차시에서 대신 기록' : record.preview ? '단원 중간에 기록' : '아직 예고 기록 없음'}</p>
                      </div>
                      <div className="p-3 rounded-[var(--r-sm)]" style={{ background: 'var(--paper-1)' }}>
                        <b>첫 생각</b><p>{expressionLabel(record.preview?.firstThought, module.id)}</p>
                      </div>
                      <div className="p-3 rounded-[var(--r-sm)]" style={{ background: 'var(--paper-1)' }}>
                        <b>AI와 비교</b><p>{decisionLabel(record.main?.aiDecision)}</p>
                      </div>
                      <div className="p-3 rounded-[var(--r-sm)]" style={{ background: 'var(--paper-1)' }}>
                        <b>최종 생각</b><p>{expressionLabel(record.main?.finalThought, module.id, true)}</p>
                      </div>
                      <div className="p-3 rounded-[var(--r-sm)]" style={{ background: 'var(--paper-1)' }}>
                        <b>새 장면</b><p>{GENERALIZATION_CYCLES[module.id].main.transfer.choices.find((choice) => choice.id === record.main?.transferChoiceId)?.label || '아직 기록 없음'}</p>
                      </div>
                    </div>
                    <TeacherObservation
                      value={record.observation}
                      accent="var(--accent)"
                      onChange={(observation) => saveObservation(record, observation)}
                    />
                  </>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
