import fs from 'node:fs';

const experience = fs.readFileSync('src/features/studio/components/StudioExperience.tsx', 'utf8');
if (experience.includes('SupportSelector') || experience.includes('오늘 사용할 지원 수준') || experience.includes("type: 'set-support'")) {
  throw new Error('lesson must not provide a per-lesson support-level selector');
}
if (!experience.includes('definition.supportProfiles[state.supportLevel]')) {
  throw new Error('lesson must continue using the navigation-selected support level');
}
console.log('lesson support selector contract passed');
