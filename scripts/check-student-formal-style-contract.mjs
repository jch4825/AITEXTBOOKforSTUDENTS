import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('src');
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'teacher') walk(full);
    } else if (/\.(ts|tsx)$/.test(entry.name) && entry.name !== 'TeacherView.tsx') files.push(full);
  }
}
walk(root);

const greetingOnly = new Set(['안녕하세요', '안녕하세요!', '안녕하세요.']);
const informal = /(?:[가-힣]+요(?:[.!?]|$)|[가-힣]+(?:나요|가요|죠|까요)\?|[가-힣]+(?:습니다|입니다)\?)/;
const findings = [];

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const withoutComments = source.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const literals = withoutComments.match(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g) ?? [];
  for (const literal of literals) {
    const value = literal.slice(1, -1).replaceAll('안녕하세요', '');
    if (greetingOnly.has(value)) continue;
    if (informal.test(value)) findings.push(`${path.relative(process.cwd(), file)}: ${value}`);
  }
}

if (findings.length) {
  console.error(`student formal-style contract failed: ${findings.length} candidate strings`);
  console.error(findings.slice(0, 80).join('\n'));
  if (findings.length > 80) console.error(`... and ${findings.length - 80} more`);
  process.exit(1);
}
console.log('student formal-style contract passed');
