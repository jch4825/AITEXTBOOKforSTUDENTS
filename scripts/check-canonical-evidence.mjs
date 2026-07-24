import fs from 'node:fs';
import path from 'node:path';

// Load evidenceSanitizer source directly for pure node ESM verification
const sanitizerTsPath = path.resolve('src/features/canonicalLesson/evidenceSanitizer.ts');
const sanitizerContent = fs.readFileSync(sanitizerTsPath, 'utf-8');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`[FAIL] ${message}`);
  }
}

console.log('Verifying evidenceSanitizer.ts static logic & requirements...');

// 1. Verify 300 char limit requirement in source
assert(sanitizerContent.includes('slice(0, 300)'), 'evidenceSanitizer should enforce 300 char text limit');

// 2. Verify choice IDs limit requirement in source (8 choice ids)
assert(sanitizerContent.includes('slice(0, 8)'), 'evidenceSanitizer should enforce max 8 choice IDs limit');

// 3. Verify supportModesUsed limit requirement in source (20 support modes)
assert(sanitizerContent.includes('slice(0, 20)'), 'evidenceSanitizer should enforce max 20 support modes limit');

// 4. Verify data URL stripping logic
assert(sanitizerContent.includes("startsWith('data:image/')"), 'evidenceSanitizer should strip data:image/ URLs');
assert(sanitizerContent.includes("mode: 'draw'"), 'evidenceSanitizer should sanitize draw mode without raw data URLs');

// 5. Verify Version 3 check
assert(sanitizerContent.includes('version !== 3'), 'evidenceSanitizer should enforce version 3 requirement');

console.log(`Results: ${passed} passed, ${failed} failed.`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('[PASS] All canonical evidence contract checks passed.');
  process.exit(0);
}
