import fs from 'node:fs';
import path from 'node:path';

const CANONICAL_DIR = path.resolve('src/data/canonicalLessons');
const PUBLIC_DIR = path.resolve('public');

if (!fs.existsSync(CANONICAL_DIR)) {
  console.log(`[PASS] No canonical lessons data yet. Asset check skipped.`);
  process.exit(0);
}

let errors = [];

function checkModuleAssets(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Match src: '/lessons/...'
  const srcMatches = content.match(/src:\s*['"]([^'"]+)['"]/g) || [];

  for (const match of srcMatches) {
    const src = match.match(/['"]([^'"]+)['"]/)[1];

    if (src.includes('..')) {
      errors.push(`File ${filePath}: src '${src}' contains '..' path traversal.`);
      continue;
    }
    if (src.startsWith('http://') || src.startsWith('https://')) {
      errors.push(`File ${filePath}: src '${src}' cannot be absolute URL.`);
      continue;
    }
    if (src.includes('-vn-')) {
      errors.push(`File ${filePath}: legacy '-vn-' pattern inferred src '${src}' is not allowed.`);
      continue;
    }

    const relativePath = src.startsWith('/') ? src.slice(1) : src;
    const fullPath = path.join(PUBLIC_DIR, relativePath);

    if (!fs.existsSync(fullPath)) {
      errors.push(`File ${filePath}: required image file not found at ${fullPath}`);
    }
  }
}

const entries = fs.readdirSync(CANONICAL_DIR);
for (const entry of entries) {
  if (entry.startsWith('m') && entry.endsWith('.ts')) {
    checkModuleAssets(path.join(CANONICAL_DIR, entry));
  }
}

if (errors.length > 0) {
  console.error(`[FAIL] Canonical asset check failed with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`[PASS] Canonical asset check passed for module data files.`);
process.exit(0);
