import { spawnSync } from 'node:child_process';

const checks = [
  'scripts/check-lesson-role-contract.mjs',
  'scripts/check-studio-pilot-contract.mjs',
  'scripts/check-studio-expansion-contract.mjs',
  'scripts/check-teacher-recording-contract.mjs',
  'scripts/check-editorial-theme-contract.mjs',
  'scripts/check-generalization-contract.mjs',
  'scripts/check-complete-studio-rollout-contract.mjs',
  'scripts/check-single-learning-objective-contract.mjs',
  'scripts/check-no-experience-bridge-contract.mjs',
  'scripts/check-student-formal-style-contract.mjs',
];

for (const check of checks) {
  const result = spawnSync(process.execPath, [check], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('six-module studio rollout: all contracts passed');
