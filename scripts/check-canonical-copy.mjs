import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_DIR = path.resolve('src/data/canonicalLessons');

if (!fs.existsSync(CANONICAL_DIR)) {
  console.log(`[PASS] No canonical lessons data yet. Copy check skipped.`);
  process.exit(0);
}

// Banned grammar error patterns (mechanical replacements)
const GRAMMAR_ERROR_PATTERNS = [
  /나눠습니다/g,
  /알려\s*주십시오도/g,
  /배웠입니다/g,
  /자랑스러워습니다/g,
  /다\s*배웠입니다/g,
  /습니다도/g,
  /하십시오도/g,
];

// Banned technical jargon in student content
const BANNED_JARGON = [
  'NLG',
  'NMT',
  'SNR',
  '가우시안 개연성',
  '가우시안',
  '피드포워드',
  '오차 역전파',
  '오차역전파',
  '백프로파게이션',
  '하이퍼파라미터',
];

let errors = [];

function checkFileContent(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  for (const pattern of GRAMMAR_ERROR_PATTERNS) {
    if (pattern.test(content)) {
      errors.push(`File ${filePath}: matches banned grammar error pattern ${pattern}`);
    }
  }

  for (const jargon of BANNED_JARGON) {
    if (content.includes(jargon)) {
      errors.push(`File ${filePath}: contains banned technical jargon '${jargon}'`);
    }
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
  console.error(`[FAIL] Canonical copy check failed with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`[PASS] Canonical copy check passed.`);
process.exit(0);
