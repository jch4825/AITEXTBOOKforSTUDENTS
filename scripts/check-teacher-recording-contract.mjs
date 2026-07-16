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

const hubPath = 'src/features/teacher/TeacherHub.tsx';
const onboardingPath = 'src/features/teacher/TeacherOnboarding.tsx';
const legacyPath = 'src/features/teacher/LegacyTeacherPanels.tsx';
const teacherViewPath = 'src/views/TeacherView.tsx';
for (const itemPath of [hubPath, onboardingPath, legacyPath]) {
  if (!fs.existsSync(itemPath)) throw new Error(`teacher hub component is missing: ${itemPath}`);
}
const hub = fs.readFileSync(hubPath, 'utf8');
const onboarding = fs.readFileSync(onboardingPath, 'utf8');
const teacherView = fs.readFileSync(teacherViewPath, 'utf8');
for (const tab of ['운영 안내', '학생 기록', '포트폴리오', 'AI 연결', '학습목표·성취기준', '데이터 관리']) {
  if (!hub.includes(tab)) throw new Error(`teacher hub tab is missing: ${tab}`);
}
if (!hub.includes('데이터 암호화 기능이 아닙니다')) throw new Error('teacher password boundary copy is missing');
for (const checkText of ['이 브라우저에만 기록', '음성·사진·그림 원본', '기록을 삭제하고 백업', '학생과 보호자']) {
  if (!onboarding.includes(checkText)) throw new Error(`teacher acknowledgement is missing: ${checkText}`);
}
if (!teacherView.includes('<TeacherHub')) throw new Error('TeacherView must route unlocked sessions to TeacherHub');

const evidencePanelPath = 'src/features/teacher/StudioEvidencePanel.tsx';
const dataPanelPath = 'src/features/teacher/TeacherDataManagement.tsx';
for (const itemPath of [evidencePanelPath, dataPanelPath]) {
  if (!fs.existsSync(itemPath)) throw new Error(`teacher evidence component is missing: ${itemPath}`);
}
const evidencePanel = fs.readFileSync(evidencePanelPath, 'utf8');
const dataPanel = fs.readFileSync(dataPanelPath, 'utf8');
for (const label of ['첫 생각', 'AI와 비교', '최종 판단', '새 상황에 적용', '중요한 정보 찾기', '스스로 시도하기', 'AI 의견 비교하기', '조건에 맞게 조정하기', '이 기록 삭제']) {
  if (!evidencePanel.includes(label)) throw new Error(`teacher evidence label is missing: ${label}`);
}
for (const label of ['모든 과정기록 삭제', '암호화 백업 만들기', '암호화 백업 복원하기']) {
  if (!dataPanel.includes(label)) throw new Error(`teacher data action is missing: ${label}`);
}
for (const token of ['<StudioEvidencePanel', '<TeacherDataManagement', '이전 일반화 기록']) {
  if (!hub.includes(token)) throw new Error(`teacher hub evidence integration is missing: ${token}`);
}

console.log('teacher recording contract: opt-in and sanitized evidence ready');
