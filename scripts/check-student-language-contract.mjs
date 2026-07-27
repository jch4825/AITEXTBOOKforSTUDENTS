import fs from 'node:fs';
import path from 'node:path';

const studentFacingRoots = [
  'src/components',
  'src/data',
  'src/features/canonicalLesson',
  'src/features/studio',
];

const dictionaryPath = path.resolve('src/data/studentDictionary.ts');
const dictionarySource = fs.readFileSync(dictionaryPath, 'utf8');

function normalize(value) {
  return value.trim().toLowerCase().normalize('NFKC');
}

function lineNumber(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function collectFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectFiles(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const dictionaryEntries = [];
const entryPattern = /\{[\s\S]*?term:\s*'([^']+)'[\s\S]*?\n\s*\}/g;
let entryMatch;
while ((entryMatch = entryPattern.exec(dictionarySource))) {
  const block = entryMatch[0];
  const aliases = [...block.matchAll(/aliases:\s*\[([^\]]*)\]/g)]
    .flatMap(([, aliasSource]) => [...aliasSource.matchAll(/'([^']+)'/g)].map(([, alias]) => alias));
  dictionaryEntries.push({
    term: entryMatch[1],
    aliases,
    line: lineNumber(dictionarySource, entryMatch.index),
  });
}

const seenDictionaryKeys = new Map();
const duplicateDictionaryKeys = [];
for (const entry of dictionaryEntries) {
  const keys = [{ kind: 'term', value: entry.term }, ...entry.aliases.map((value) => ({ kind: 'alias', value }))];
  for (const key of keys) {
    const normalized = normalize(key.value);
    const previous = seenDictionaryKeys.get(normalized);
    if (previous) {
      duplicateDictionaryKeys.push(
        `${key.value}: ${previous.term} ${previous.kind} @${previous.line}, ${entry.term} ${key.kind} @${entry.line}`,
      );
    } else {
      seenDictionaryKeys.set(normalized, { term: entry.term, kind: key.kind, line: entry.line });
    }
  }
}

const files = studentFacingRoots.flatMap((root) => collectFiles(path.resolve(root)));
const requestedTerms = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const requestedPattern = /dictionaryTerms:\s*\[([^\]]*)\]/g;
  let requestedMatch;
  while ((requestedMatch = requestedPattern.exec(source))) {
    const terms = [...requestedMatch[1].matchAll(/'([^']+)'/g)].map(([, term]) => term);
    const line = lineNumber(source, requestedMatch.index);
    for (const term of terms) requestedTerms.push({ term, file, line });
  }
}

const missingDictionaryTerms = requestedTerms.filter(({ term }) => !seenDictionaryKeys.has(normalize(term)));

const typoPatterns = [
  /같은습니까/g,
  /골라습니다/g,
  /나눠습니다/g,
  /쉬워져습니다/g,
  /근것/g,
];
const typoFindings = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of typoPatterns) {
    let match;
    while ((match = pattern.exec(source))) {
      typoFindings.push(`${path.relative(process.cwd(), file)}:${lineNumber(source, match.index)} ${match[0]}`);
    }
  }
}

const failures = [];
if (duplicateDictionaryKeys.length) {
  failures.push(`student dictionary duplicate keys: ${duplicateDictionaryKeys.length}`);
  failures.push(...duplicateDictionaryKeys.slice(0, 60));
}
if (missingDictionaryTerms.length) {
  failures.push(`missing student dictionary terms: ${missingDictionaryTerms.length}`);
  failures.push(
    ...missingDictionaryTerms
      .slice(0, 80)
      .map(({ file, line, term }) => `${path.relative(process.cwd(), file)}:${line} ${term}`),
  );
}
if (typoFindings.length) {
  failures.push(`student language typo findings: ${typoFindings.length}`);
  failures.push(...typoFindings.slice(0, 80));
}

if (failures.length) {
  console.error('student language contract failed');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`student language contract passed (${dictionaryEntries.length} dictionary entries)`);
