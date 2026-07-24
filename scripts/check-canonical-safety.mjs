import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_DIR = path.resolve('src/data/canonicalLessons');

if (!fs.existsSync(CANONICAL_DIR)) {
  console.log(`[PASS] No canonical lessons data yet. Safety check skipped.`);
  process.exit(0);
}

const SAFETY_BANNED_PATTERNS = [
  'AI에게 다시 물어보면 확인',
  'AI가 알려준 병원',
  '비밀번호를 친구',
  '인증 코드를 알려줘요',
  '인증 코드를 친구',
  '사진은 절대',
  'AI가 감정을',
];

let errors = [];

function checkFileContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  for (const pattern of SAFETY_BANNED_PATTERNS) {
    if (content.includes(pattern)) {
      errors.push(`File ${filePath}: contains safety violation pattern '${pattern}'`);
    }
  }

  // Check for labeling prepared responses as live or real AI
  if ((content.includes('prepared') || content.includes('PREPARED')) && (content.includes('실제 AI') || content.includes('진짜 AI'))) {
    errors.push(`File ${filePath}: mislabels prepared AI responses as live/real AI ('실제 AI' or '진짜 AI')`);
  }
}

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx') || entry.name.endsWith('.js'))) {
      checkFileContent(fullPath);
    }
  }
}

scanDir(CANONICAL_DIR);

if (errors.length > 0) {
  console.error(`[FAIL] Canonical safety check failed with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`[PASS] Canonical safety check passed.`);
process.exit(0);
