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

console.log('studio expansion contract: TTS entry guard passed');
