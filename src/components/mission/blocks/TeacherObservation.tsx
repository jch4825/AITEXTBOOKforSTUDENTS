import React from 'react';
import type { GeneralizationHelpLevel, GeneralizationObservation, GeneralizationObservationStatus } from '../../../types';

interface Props {
  value?: GeneralizationObservation;
  onChange: (value: GeneralizationObservation) => void;
  accent: string;
}

const STATUS_OPTIONS: { value: GeneralizationObservationStatus; label: string }[] = [
  { value: 'unobserved', label: '관찰 전' },
  { value: 'prompted', label: '도움받아 시도' },
  { value: 'independent', label: '스스로 시도' },
];

const HELP_OPTIONS: { value: GeneralizationHelpLevel; label: string }[] = [
  { value: 'independent', label: '혼자 수행' },
  { value: 'cue', label: '말·그림 단서' },
  { value: 'choice-support', label: '선택지 조정' },
  { value: 'co-perform', label: '함께 수행' },
];

const CRITERIA: { key: keyof Pick<GeneralizationObservation, 'importantInfo' | 'attemptedMethod' | 'comparedAi' | 'adjustedToCondition'>; label: string }[] = [
  { key: 'importantInfo', label: '상황의 중요한 정보를 찾았는가' },
  { key: 'attemptedMethod', label: '스스로 방법을 시도했는가' },
  { key: 'comparedAi', label: 'AI 의견을 비교하고 판단했는가' },
  { key: 'adjustedToCondition', label: '조건이 달라졌을 때 방법을 조정했는가' },
];

const EMPTY: GeneralizationObservation = {
  importantInfo: 'unobserved',
  attemptedMethod: 'unobserved',
  comparedAi: 'unobserved',
  adjustedToCondition: 'unobserved',
  helpLevel: 'independent',
  note: '',
};

export default function TeacherObservation({ value = EMPTY, onChange, accent }: Props) {
  function setField<K extends keyof GeneralizationObservation>(key: K, next: GeneralizationObservation[K]) {
    onChange({ ...EMPTY, ...value, [key]: next });
  }

  return (
    <details className="mt-5 rounded-[var(--r-md)] border-2" style={{ borderColor: 'var(--line)', background: 'var(--paper-1)' }}>
      <summary className="cursor-pointer px-4 py-3 font-bold" style={{ color: accent }}>교사 관찰 기록</summary>
      <div className="p-4 space-y-4">
        <div className="space-y-3">
          {CRITERIA.map((criterion) => (
            <div key={criterion.key} className="space-y-2">
              <p className="font-semibold text-sm" style={{ color: 'var(--brand-ink)' }}>{criterion.label}</p>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => setField(criterion.key, option.value)}
                    className="px-3 py-2 rounded-[var(--r-sm)] border text-sm font-semibold cursor-pointer"
                    style={{
                      borderColor: value[criterion.key] === option.value ? accent : 'var(--line)',
                      background: value[criterion.key] === option.value ? 'var(--paper-0)' : 'transparent',
                      color: value[criterion.key] === option.value ? accent : 'var(--muted)',
                    }}
                  >{option.label}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <p className="font-semibold text-sm mb-2" style={{ color: 'var(--brand-ink)' }}>전체 도움 수준</p>
          <div className="flex flex-wrap gap-2">
            {HELP_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setField('helpLevel', option.value)}
                className="px-3 py-2 rounded-[var(--r-sm)] border text-sm font-semibold cursor-pointer"
                style={{
                  borderColor: value.helpLevel === option.value ? accent : 'var(--line)',
                  background: value.helpLevel === option.value ? 'var(--paper-0)' : 'transparent',
                  color: value.helpLevel === option.value ? accent : 'var(--muted)',
                }}
              >{option.label}</button>
            ))}
          </div>
        </div>

        <label className="block text-sm font-semibold" style={{ color: 'var(--brand-ink)' }}>
          메모(선택)
          <textarea
            value={value.note ?? ''}
            onChange={(event) => setField('note', event.target.value)}
            className="mt-1 w-full min-h-20 p-3 rounded-[var(--r-sm)] border-2 font-normal"
            style={{ borderColor: 'var(--line)', background: 'var(--paper-0)' }}
            placeholder="학생의 시도나 도움을 짧게 기록해 주십시오."
          />
        </label>
      </div>
    </details>
  );
}
