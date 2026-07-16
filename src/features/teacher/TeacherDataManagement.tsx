import { useState } from 'react';
import Button from '../../components/Button';
import { clearStudioEvidence } from '../studio/evidenceStorage';
import type { TeacherRecordingSettings } from '../studio/types';
import { applyBackup, createEncryptedBackup, decryptBackup } from './backup';
import { loadTeacherRecordingSettings, saveTeacherRecordingSettings } from './recordingSettings';

interface Props {
  settings: TeacherRecordingSettings;
  onSettingsChanged: (settings: TeacherRecordingSettings) => void;
  onRequestEnable: () => void;
}

export default function TeacherDataManagement({ settings, onSettingsChanged, onRequestEnable }: Props) {
  const [deletePhrase, setDeletePhrase] = useState('');
  const [backupPassphrase, setBackupPassphrase] = useState('');
  const [backupConfirm, setBackupConfirm] = useState('');
  const [restoreFile, setRestoreFile] = useState<File | null>(null);
  const [restorePassphrase, setRestorePassphrase] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  function disableRecording() {
    const next = { ...settings, processRecording: false };
    saveTeacherRecordingSettings(next);
    onSettingsChanged(next);
    setMessage({ kind: 'ok', text: '새 과정기록을 끕니다. 기존 기록은 그대로 남아 있습니다.' });
  }

  function clearAllEvidence() {
    if (deletePhrase !== '전체 삭제') return;
    clearStudioEvidence();
    setDeletePhrase('');
    setMessage({ kind: 'ok', text: '저장된 새 과정기록을 모두 삭제했습니다.' });
  }

  async function exportBackup() {
    setMessage(null);
    if (backupPassphrase.length < 8 || backupPassphrase !== backupConfirm) {
      setMessage({ kind: 'error', text: '8자 이상의 같은 백업 암호를 두 번 입력해 주세요.' });
      return;
    }
    try {
      const blob = await createEncryptedBackup(backupPassphrase);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `ai-textbook-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      setBackupPassphrase('');
      setBackupConfirm('');
      setMessage({ kind: 'ok', text: '암호화 백업 파일을 만들었습니다. 암호는 따로 안전하게 보관하세요.' });
    } catch {
      setMessage({ kind: 'error', text: '백업 파일을 만들지 못했어요. 브라우저 저장 권한을 확인해 주세요.' });
    }
  }

  async function restoreBackup() {
    setMessage(null);
    if (!restoreFile || restorePassphrase.length < 8) {
      setMessage({ kind: 'error', text: '백업 파일과 8자 이상의 백업 암호를 입력해 주세요.' });
      return;
    }
    try {
      const payload = await decryptBackup(await restoreFile.text(), restorePassphrase);
      if (!window.confirm('현재 이 브라우저의 진도·설정·과정기록을 백업 내용으로 바꿀까요?')) return;
      applyBackup(payload);
      onSettingsChanged(loadTeacherRecordingSettings());
      setRestoreFile(null);
      setRestorePassphrase('');
      setMessage({ kind: 'ok', text: '백업을 복원했습니다. 화면을 새로 열면 모든 항목에 반영됩니다.' });
    } catch {
      setMessage({ kind: 'error', text: '암호가 다르거나 백업 파일이 손상되었어요.' });
    }
  }

  return (
    <div className="space-y-6">
      {message && (
        <p className={`rounded-xl border p-3 font-bold ${message.kind === 'ok' ? 'border-green-300 bg-green-50 text-green-800' : 'border-red-300 bg-red-50 text-red-800'}`} role="status">
          {message.text}
        </p>
      )}

      <section className="studio-editorial p-6">
        <h2 className="text-xl font-extrabold">기록 기능</h2>
        <p className="mt-2">학생 별칭: <strong>{settings.learnerAlias}</strong></p>
        <p className="mt-1">새 과정기록: <strong>{settings.processRecording ? '켜짐' : '꺼짐'}</strong></p>
        <p className="mt-3 text-sm text-[color:var(--muted)]">과정기록을 꺼도 이미 저장된 기록은 자동으로 삭제되지 않습니다. 진도 저장은 계속 작동합니다.</p>
        <div className="mt-4">
          {settings.processRecording
            ? <Button variant="secondary" onClick={disableRecording}>새 과정기록 끄기</Button>
            : <Button onClick={onRequestEnable}>과정기록 켜기 안내</Button>}
        </div>
      </section>

      <section className="studio-editorial p-6">
        <h2 className="text-xl font-extrabold">모든 과정기록 삭제</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">이 작업은 v2 핵심 경험 기록만 삭제합니다. 진도와 이전 일반화 기록은 삭제하지 않습니다.</p>
        <label className="mt-4 block font-bold" htmlFor="delete-confirmation">확인을 위해 ‘전체 삭제’를 입력하세요.</label>
        <div className="mt-2 flex flex-wrap gap-3">
          <input
            id="delete-confirmation"
            value={deletePhrase}
            onChange={(event) => setDeletePhrase(event.target.value)}
            className="min-h-12 flex-1 rounded-xl border-2 px-4"
          />
          <button
            type="button"
            disabled={deletePhrase !== '전체 삭제'}
            onClick={clearAllEvidence}
            className="btn border-red-300 bg-red-50 px-4 font-bold text-red-800 disabled:opacity-50"
          >
            모든 과정기록 삭제
          </button>
        </div>
      </section>

      <section className="studio-editorial p-6">
        <h2 className="text-xl font-extrabold">암호화 백업 만들기</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">진도·설정·과정기록·이전 일반화 기록을 AES-GCM으로 암호화합니다. API 키와 원본 미디어는 포함하지 않습니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="font-bold">백업 암호
            <input type="password" value={backupPassphrase} onChange={(event) => setBackupPassphrase(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border-2 px-4" />
          </label>
          <label className="font-bold">백업 암호 확인
            <input type="password" value={backupConfirm} onChange={(event) => setBackupConfirm(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border-2 px-4" />
          </label>
        </div>
        <Button onClick={exportBackup} className="mt-4">암호화 백업 만들기</Button>
      </section>

      <section className="studio-editorial p-6">
        <h2 className="text-xl font-extrabold">암호화 백업 복원하기</h2>
        <p className="mt-2 text-sm text-[color:var(--muted)]">복원 전 파일 구조와 암호를 확인하며, 실패하면 현재 데이터는 바뀌지 않습니다.</p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="font-bold">백업 파일
            <input type="file" accept="application/json,.json" onChange={(event) => setRestoreFile(event.target.files?.[0] ?? null)} className="mt-1 block min-h-12 w-full rounded-xl border p-2" />
          </label>
          <label className="font-bold">백업 암호
            <input type="password" value={restorePassphrase} onChange={(event) => setRestorePassphrase(event.target.value)} className="mt-1 min-h-12 w-full rounded-xl border-2 px-4" />
          </label>
        </div>
        <Button variant="secondary" onClick={restoreBackup} className="mt-4">암호화 백업 복원하기</Button>
      </section>
    </div>
  );
}
