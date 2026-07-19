import fs from 'node:fs';

const required = [
  'src/components/controls/DifficultyToggle.tsx',
  'src/features/studio/supportLevel.ts',
  'src/utils/moduleThemes.ts',
  'src/utils/storage.ts',
  'src/index.css',
];
for (const file of required) {
  if (!fs.existsSync(file)) throw new Error(`editorial theme file is missing: ${file}`);
}

const toggle = fs.readFileSync(required[0], 'utf8');
const support = fs.readFileSync(required[1], 'utf8');
const themes = fs.readFileSync(required[2], 'utf8');
const storage = fs.readFileSync(required[3], 'utf8');
const css = fs.readFileSync(required[4], 'utf8');
for (const label of ['충분한 지원', '보통', '도전적']) {
  if (!toggle.includes(label) && !support.includes(label)) throw new Error(`missing support label: ${label}`);
}
for (const oldLabel of ['도움 충분히', '기본 도움', '도전하기', '약한 지원']) {
  if (toggle.includes(oldLabel) || support.includes(oldLabel)) throw new Error(`old support label remains: ${oldLabel}`);
}
if (!/const DEFAULT_SETTINGS:[\s\S]*?difficulty:\s*'normal'/.test(storage)) {
  throw new Error('새 사용자의 기본 지원 수준은 보통(normal)이어야 합니다.');
}
for (const color of ['#5D4C8A','#A44943','#416AA8','#93601E','#2F7773','#76516F','#E07A65','#526FA7','#D6A347','#46586C','#E58A6B','#6C9986']) {
  if (!themes.includes(color)) throw new Error(`missing approved module color: ${color}`);
}
for (const token of ['--editorial-paper: #FFFDF9', '--editorial-ink: #302C36', '--editorial-line: #DEDBE3', '--editorial-quiet: #F6F4F1']) {
  if (!css.includes(token)) throw new Error(`missing editorial token: ${token}`);
}
for (const className of ['.studio-editorial', '.studio-kicker', '.studio-fact-card', '.studio-margin-note', '.studio-artifact-sheet']) {
  if (!css.includes(className)) throw new Error(`missing editorial class: ${className}`);
}

console.log('editorial theme contract: support labels and six module palettes ready');
