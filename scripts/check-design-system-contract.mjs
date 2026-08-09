import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function walk(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (/\.(css|tsx)$/.test(entry.name)) files.push(absolute);
  }
  return files;
}

function relative(file) {
  return path.relative(root, file).replaceAll('\\', '/');
}

function luminance(hex) {
  const channels = hex
    .replace('#', '')
    .match(/../g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4);
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrast(foreground, background) {
  const light = Math.max(luminance(foreground), luminance(background));
  const dark = Math.min(luminance(foreground), luminance(background));
  return (light + 0.05) / (dark + 0.05);
}

const errors = [];
const css = read('src/index.css');
const home = read('src/views/Home.tsx');
const themes = read('src/utils/moduleThemes.ts');
const studioExperience = read('src/features/studio/components/StudioExperience.tsx');
const sourceFiles = walk(path.join(root, 'src'));

for (const marker of [
  '--surface-paper-elevation:',
  '--surface-a4-elevation:',
  '--surface-sticker-lip:',
  '--interactive-border-width: 2px',
  '--board-bg:',
  '--board-surface:',
  '--board-overlay:',
  '.surface-paper',
  '.surface-sticker',
  '.surface-stamp',
  '.surface-choice',
  '.surface-a4',
  '.mini-game-board',
  '--surface-comic-lip:',
]) {
  if (!css.includes(marker)) errors.push(`src/index.css: missing design-system marker ${marker}`);
}

if (!css.includes('.interactive-border-floor')) {
  errors.push('src/index.css: the 2px border floor must stay available as an opt-in utility');
}

/* 경계 하한은 "면"에만 옵트인으로 적용한다. 요소 선택자에 일괄로 걸면 둥근 색 스와치·
   목록 행·아이콘 토글처럼 테두리가 어포던스가 아닌 컨트롤 위에 사각 상자가 겹친다.
   2026-08-09에 실제로 목차·그림판·중첩 카드를 한꺼번에 망가뜨린 회귀라 계약으로 막는다. */
const floorSelectors = css
  .slice(css.indexOf('.interactive-border-floor'))
  .split('{')[0]
  .split(',')
  .map((selector) => selector.trim())
  .filter(Boolean);
if (floorSelectors.length !== 1 || floorSelectors[0] !== '.interactive-border-floor') {
  errors.push(
    `src/index.css: the border floor must stay opt-in; it currently also targets ${floorSelectors.slice(1).join(', ')}`,
  );
}
if (/\bbutton\s*\{[^}]*border\s*:[^;}]*currentColor/.test(css)) {
  errors.push('src/index.css: bare button elements must not inherit a currentColor border');
}
if (/\[aria-pressed='true'\]\s*\{[^}]*border-width[^}]*!important/.test(css)) {
  errors.push('src/index.css: a pressed state must not be expressed by forcing a border width on every button');
}

for (const [label, source, forbidden] of [
  ['src/views/Home.tsx', home, ['glass-panel', 'btn-glow', 'backdrop-blur', '#caef00', '#ccf200', '#D6FD00']],
  ['src/index.css', css, ['상업용 디자인 업그레이드', '.glass-panel', '.btn-glow', 'backdrop-filter']],
  ['src/features/studio/components/StudioExperience.tsx', studioExperience, ['backdrop-blur', 'bg-slate-900/60', 'shadow-inner']],
]) {
  for (const token of forbidden) {
    if (source.includes(token)) errors.push(`${label}: forbidden legacy design token ${token}`);
  }
}

for (const file of sourceFiles) {
  const source = fs.readFileSync(file, 'utf8');
  const rel = relative(file);
  if (/(?:#caef00|#ccf200|#D6FD00)/i.test(source)) {
    errors.push(`${rel}: fluorescent lime is not part of the paper design system`);
  }
  if (rel.startsWith('src/features/studio/components/') && /bg-slate-(?:800|900|950)/.test(source)) {
    errors.push(`${rel}: studio reading and print surfaces must use paper tokens, not dark board colors`);
  }
  const legacyDepthUses = source
    .split(/\r?\n/)
    .filter((line) => /var\(--e-[12]\)/.test(line) && !/--surface-(?:paper|a4)-elevation:/.test(line));
  if (legacyDepthUses.length > 0) {
    errors.push(`${rel}: components must consume semantic surface depth tokens instead of --e-1/--e-2 directly`);
  }
  if (/backdrop-(?:blur|filter)/.test(source)) {
    errors.push(`${rel}: glass blur is not part of the paper design system`);
  }
  if (file.endsWith('.tsx') && /\bshadow-(?:(?:2xs|xs|sm|md|lg|xl|2xl|inner)\b|\[)/.test(source)) {
    errors.push(`${rel}: Tailwind shadow utility bypasses semantic depth tokens`);
  }
  source.split(/\r?\n/).forEach((line, index) => {
    if (/box-shadow\s*:/.test(line) && !/box-shadow\s*:\s*(?:var\(--|none)/.test(line)) {
      errors.push(`${rel}:${index + 1}: CSS box-shadow must use a semantic token or none`);
    }
    if (/boxShadow\s*:/.test(line) && !line.includes('var(--') && !line.includes("'none'") && !line.includes('"none"')) {
      errors.push(`${rel}:${index + 1}: inline boxShadow must use a semantic token or none`);
    }
  });
}

const paperMatch = css.match(/--paper-0:\s*(#[0-9A-Fa-f]{6})/);
if (!paperMatch) {
  errors.push('src/index.css: --paper-0 must be a six-digit hex color for contrast checks');
} else {
  const paper = paperMatch[1];
  const themeEntries = [...themes.matchAll(/accentText:\s*'(#[0-9A-Fa-f]{6})'/g)];
  if (themeEntries.length !== 6) {
    errors.push('src/utils/moduleThemes.ts: every module must declare an accentText color');
  }
  themeEntries.forEach((match, index) => {
    const ratio = contrast(match[1], paper);
    if (ratio < 7) {
      errors.push(`src/utils/moduleThemes.ts: module ${index + 1} accentText contrast is ${ratio.toFixed(2)}:1; expected at least 7:1`);
    }
  });
}

if (!home.includes('surface-paper') || !home.includes('surface-a4')) {
  errors.push('src/views/Home.tsx: Home must express its reading and cover surfaces semantically');
}

if (errors.length > 0) {
  console.error('Design system contract failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Design system contract passed: ${sourceFiles.length} source files checked, AAA text accents verified.`);
