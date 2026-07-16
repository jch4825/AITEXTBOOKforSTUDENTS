import fs from 'node:fs';

const settingsPath = 'src/features/teacher/recordingSettings.ts';
const evidencePath = 'src/features/studio/evidenceStorage.ts';
const backupPath = 'src/features/teacher/backup.ts';
if (!fs.existsSync(settingsPath)) throw new Error('teacher recording settings are missing');
if (!fs.existsSync(evidencePath)) throw new Error('studio evidence storage is missing');
if (!fs.existsSync(backupPath)) throw new Error('backup module is missing');

const settings = fs.readFileSync(settingsPath, 'utf8');
const evidence = fs.readFileSync(evidencePath, 'utf8');
const backup = fs.readFileSync(backupPath, 'utf8');
if (!settings.includes('processRecording: false')) throw new Error('process recording must default to false');
if (!settings.includes("learnerAlias: '학생 1'")) throw new Error('safe learner alias default is missing');
if (!evidence.includes('ai-students-studio-evidence-v2')) throw new Error('v2 evidence key is missing');
if (!evidence.includes('sanitizeExpressionForEvidence')) throw new Error('expression sanitizer is missing');
if (!evidence.includes('drawing: undefined')) throw new Error('raw drawing must be removed');
if (!evidence.includes('processRecording')) throw new Error('opt-in gate is missing');
for (const token of ['AES-GCM', 'PBKDF2', 'SHA-256', '250_000', 'new Uint8Array(16)', 'new Uint8Array(12)']) {
  if (!backup.includes(token)) throw new Error(`backup security token is missing: ${token}`);
}
for (const key of ['ai-students-progress', 'ai-students-settings', 'ai-students-teacher-settings-v2', 'ai-students-studio-evidence-v2', 'ai-students-generalization-v1']) {
  if (!backup.includes(key)) throw new Error(`backup allowlist key is missing: ${key}`);
}
if (backup.includes('ai-students-gemini-key')) throw new Error('API key must not be included in backup');
if (!backup.includes('rollback')) throw new Error('atomic restore rollback is missing');

console.log('teacher recording contract: opt-in and sanitized evidence ready');
