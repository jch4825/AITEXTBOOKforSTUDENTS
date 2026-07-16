import { spawnSync } from 'node:child_process';

const checks = [
  'scripts/check-lesson-role-contract.mjs',
  'scripts/check-studio-pilot-contract.mjs',
  'scripts/check-teacher-recording-contract.mjs',
  'scripts/check-editorial-theme-contract.mjs',
];

for (const check of checks) {
  const result = spawnSync(process.execPath, [check], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('M5 pilot contract: all checks passed');
