import { useState } from 'react';
import Button from '../../components/Button';
import type { TeacherRecordingSettings } from '../studio/types';
import {
  loadTeacherRecordingSettings,
  saveTeacherRecordingSettings,
} from './recordingSettings';

interface Props {
  onEnabled: (settings: TeacherRecordingSettings) => void;
  onSkip: () => void;
}

const ACKNOWLEDGEMENTS = [
  '이 브라우저에만 기록되며 다른 기기에서는 자동으로 보이지 않는다는 점을 이해했습니다.',
  '음성·사진·그림 원본과 전체 AI 대화는 저장하지 않는다는 점을 이해했습니다.',
  '필요할 때 교사 화면에서 기록을 삭제하고 백업할 책임을 이해했습니다.',
  '학생과 보호자에게 수업 목적의 과정기록임을 안내했습니다.',
] as const;

export default function TeacherOnboarding({ onEnabled, onSkip }: Props) {
  const current = loadTeacherRecordingSettings();
  const [learnerAlias, setLearnerAlias] = useState(current.learnerAlias);
  const [checked, setChecked] = useState<boolean[]>(ACKNOWLEDGEMENTS.map(() => false));
  const canEnable = learnerAlias.trim().length > 0 && checked.every(Boolean);

  function toggle(index: number) {
    setChecked((values) => values.map((value, itemIndex) => itemIndex === index ? !value : value));
  }

  function enableRecording() {
    if (!canEnable) return;
    const settings: TeacherRecordingSettings = {
      ...current,
      learnerAlias: learnerAlias.trim().slice(0, 24),
      processRecording: true,
      acknowledgedAt: new Date().toISOString(),
    };
    saveTeacherRecordingSettings(settings);
    onEnabled(settings);
  }

  return (
    <section className="studio-editorial mb-6 p-6" aria-labelledby="recording-onboarding-title">
      <p className="studio-kicker text-[color:var(--accent)]">첫 기록 활성화 확인</p>
      <h2 id="recording-onboarding-title" className="mt-1 text-2xl font-extrabold">과정기록을 켜기 전에 확인해 주세요</h2>
      <p className="mt-3 leading-relaxed">기록 기능을 켜지 않아도 모든 학생 활동과 진도 기능을 사용할 수 있습니다.</p>

      <label className="mt-5 block font-bold" htmlFor="learner-alias">학생 별칭</label>
      <input
        id="learner-alias"
        value={learnerAlias}
        onChange={(event) => setLearnerAlias(event.target.value.slice(0, 24))}
        maxLength={24}
        className="mt-2 min-h-12 w-full max-w-sm rounded-xl border-2 px-4"
        placeholder="예: 학생 1"
      />
      <p className="mt-1 text-sm text-[color:var(--muted)]">실명 대신 수업에서 구분할 수 있는 별칭을 권장합니다.</p>

      <div className="mt-5 space-y-3">
        {ACKNOWLEDGEMENTS.map((label, index) => (
          <label key={label} className="flex cursor-pointer items-start gap-3 rounded-xl border p-3">
            <input
              type="checkbox"
              checked={checked[index]}
              onChange={() => toggle(index)}
              className="mt-1 h-5 w-5 shrink-0"
            />
            <span className="leading-relaxed">{label}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={enableRecording} disabled={!canEnable}>과정기록 켜기</Button>
        <Button variant="ghost" onClick={onSkip}>기록 없이 사용하기</Button>
      </div>
    </section>
  );
}
