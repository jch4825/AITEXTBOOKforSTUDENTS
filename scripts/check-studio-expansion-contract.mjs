import fs from 'node:fs';

const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const forbidden of [
  'if (isWrapUp) speak(wrapUpText)',
  'speak(wrapUpText)',
]) {
  if (lessonView.includes(forbidden)) {
    throw new Error(`legacy wrap-up must not auto-start TTS: ${forbidden}`);
  }
}

const stimulusPanelPath = 'src/features/studio/components/PreparedStimulusPanel.tsx';
if (!fs.existsSync(stimulusPanelPath)) {
  throw new Error('prepared stimulus component is missing');
}

const types = fs.readFileSync('src/features/studio/types.ts', 'utf8');
const panel = fs.readFileSync(stimulusPanelPath, 'utf8');
const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
for (const token of ['export type PreparedStimulus', "kind: 'image'", "kind: 'speech'", 'stimuli?: PreparedStimulus[]']) {
  if (!types.includes(token)) throw new Error(`prepared stimulus type missing: ${token}`);
}
for (const token of ['이미지를 불러오지 못했어요', '소리 듣기', 'speakNow(stimulus.text)']) {
  if (!panel.includes(token)) throw new Error(`prepared stimulus fallback missing: ${token}`);
}
if (!experience.includes('<PreparedStimulusPanel')) throw new Error('studio does not render prepared stimuli');
if (panel.includes('useEffect')) throw new Error('prepared speech must not auto-play');

const studioSharedPath = 'src/data/studios/shared.ts';
const bridgeIndexPath = 'src/data/supportBridges/index.ts';
const bridgeTypesPath = 'src/data/supportBridges/types.ts';
for (const required of [studioSharedPath, bridgeIndexPath, bridgeTypesPath]) {
  if (!fs.existsSync(required)) throw new Error(`shared studio registry file missing: ${required}`);
}
const studioShared = fs.readFileSync(studioSharedPath, 'utf8');
const bridgeIndex = fs.readFileSync(bridgeIndexPath, 'utf8');
const bridgeComponent = fs.readFileSync('src/features/studio/SupportLessonBridge.tsx', 'utf8');
const rootLesson = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
for (const token of ['STUDIO_SUPPORT_PROFILES', 'STUDIO_EXPRESSION_MODES']) {
  if (!studioShared.includes(token)) throw new Error(`shared studio constant missing: ${token}`);
}
for (const token of ['M5_SUPPORT_BRIDGES', 'getSupportBridge']) {
  if (!bridgeIndex.includes(token)) throw new Error(`generic bridge registry missing: ${token}`);
}
if (bridgeComponent.includes('supportBridges/m5')) throw new Error('bridge component must use the common type');
if (!rootLesson.includes("from '../data/supportBridges'")) throw new Error('LessonView must use the bridge registry');

console.log('studio expansion contract: TTS entry guard passed');
