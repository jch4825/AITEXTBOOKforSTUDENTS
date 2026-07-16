import fs from 'node:fs';

const settingsPath = 'src/features/teacher/recordingSettings.ts';
const evidencePath = 'src/features/studio/evidenceStorage.ts';
if (!fs.existsSync(settingsPath)) throw new Error('teacher recording settings are missing');
if (!fs.existsSync(evidencePath)) throw new Error('studio evidence storage is missing');

const settings = fs.readFileSync(settingsPath, 'utf8');
const evidence = fs.readFileSync(evidencePath, 'utf8');
if (!settings.includes('processRecording: false')) throw new Error('process recording must default to false');
if (!settings.includes("learnerAlias: '학생 1'")) throw new Error('safe learner alias default is missing');
if (!evidence.includes('ai-students-studio-evidence-v2')) throw new Error('v2 evidence key is missing');
if (!evidence.includes('sanitizeExpressionForEvidence')) throw new Error('expression sanitizer is missing');
if (!evidence.includes('drawing: undefined')) throw new Error('raw drawing must be removed');
if (!evidence.includes('processRecording')) throw new Error('opt-in gate is missing');

console.log('teacher recording contract: opt-in and sanitized evidence ready');
