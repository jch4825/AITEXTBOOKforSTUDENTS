import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const TARGETS = ['src', 'scripts', 'README.md', 'NOTION_RESOURCES.md', '.env.example', 'index.html'];
const TEXT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.html', '.css', '.mjs']);
const MOJIBAKE_PATTERN = /(?:\u00EC|\u00EB|\u00EA|\u00E2|\u00F0|\u00C3|\u00C2|\u0153|\u017E|\u0178)/u;

function walk(targetPath, out = []) {
  if (!fs.existsSync(targetPath)) return out;
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(targetPath)) {
      walk(path.join(targetPath, name), out);
    }
    return out;
  }

  if (TEXT_EXTENSIONS.has(path.extname(targetPath)) || path.basename(targetPath).startsWith('.env')) {
    out.push(targetPath);
  }
  return out;
}

function hasUtf8Bom(buffer) {
  return buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
}

function summarizeLine(text, lineNumber) {
  const line = text.split(/\r?\n/)[lineNumber - 1] ?? '';
  return line.length > 140 ? `${line.slice(0, 137)}...` : line;
}

const issues = [];
const files = TARGETS.flatMap(target => walk(path.join(ROOT, target)));

for (const file of files) {
  const buffer = fs.readFileSync(file);
  const text = buffer.toString('utf8');
  const relative = path.relative(ROOT, file);

  if (hasUtf8Bom(buffer)) {
    issues.push({ file: relative, type: 'bom', detail: 'UTF-8 BOM detected' });
  }

  const replacementIndex = text.indexOf('\uFFFD');
  if (replacementIndex >= 0) {
    const lineNumber = text.slice(0, replacementIndex).split(/\r?\n/).length;
    issues.push({
      file: relative,
      type: 'replacement-char',
      detail: `U+FFFD at line ${lineNumber}: ${summarizeLine(text, lineNumber)}`,
    });
  }

  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (!MOJIBAKE_PATTERN.test(lines[index])) continue;
    issues.push({
      file: relative,
      type: 'suspicious-text',
      detail: `Suspicious mojibake-like text at line ${index + 1}: ${summarizeLine(text, index + 1)}`,
    });
  }
}

if (issues.length > 0) {
  console.error('Encoding check failed:\n');
  for (const issue of issues) {
    console.error(`- [${issue.type}] ${issue.file}: ${issue.detail}`);
  }
  process.exit(1);
}

console.log(`Encoding check passed for ${files.length} files.`);
