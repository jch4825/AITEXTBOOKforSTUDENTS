import fs from 'node:fs';
import path from 'node:path';

function filesUnder(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(target) : [target];
  });
}

const sourceFiles = filesUnder('src').filter((file) => /\.(?:ts|tsx|css)$/.test(file));
const source = sourceFiles.map((file) => fs.readFileSync(file, 'utf8')).join('\n');
const staticReferences = new Set(
  [...source.matchAll(/['"`](\/[^'"`\s)]+?\.(?:webp|png|jpe?g|svg))['"`]/gi)]
    .map((match) => match[1])
    .filter((reference) => !reference.includes('${')),
);

for (const reference of staticReferences) {
  const normalized = reference.replace(/^\/AITEXTBOOKforSTUDENTS\//, '/');
  const assetPath = path.join('public', normalized.replace(/^\/+/, ''));
  if (!fs.existsSync(assetPath)) {
    throw new Error(`missing statically referenced public image: ${reference} -> ${assetPath}`);
  }
}

for (const retiredDirectory of [
  'public/lessons/png',
  'public/lessons/webtoon',
  'public/lessons/pecs/raw',
  'src/data/studios/visualStories',
  'src/assets/images',
  'docs/storyboards',
  'docs/character-sheets',
  'output',
]) {
  if (fs.existsSync(retiredDirectory)) throw new Error(`retired image directory remains: ${retiredDirectory}`);
}

for (const retiredRootFile of [
  'toon-sample.webp',
  'colorful-web-buttons-pack-different-purposes_1017-25889.avif',
]) {
  if (fs.existsSync(retiredRootFile)) throw new Error(`retired loose reference image remains: ${retiredRootFile}`);
}

const lessonRootFiles = fs.existsSync('public/lessons')
  ? fs.readdirSync('public/lessons', { withFileTypes: true }).filter((entry) => entry.isFile()).map((entry) => entry.name)
  : [];
const retiredLessonFiles = lessonRootFiles.filter((name) =>
  /-vn-\d{2}\.webp$/.test(name) || /^m\d-l\d+\.webp$/.test(name) || name === 'toaster.png',
);
if (retiredLessonFiles.length > 0) {
  throw new Error(`retired root lesson images remain: ${retiredLessonFiles.join(', ')}`);
}

/*
 * 경로를 통째로 적지 않고 `lens-${stage.kind}-0.jpg`처럼 조립하는 곳이 있다. 이름을 그대로
 * 찾는 방식만 쓰면 이런 그림이 전부 고아로 잡힌다. 그래서 조립식 경로는 ${...} 자리를
 * ${...} 자리에서 잘라 낸 조각들로 파일 이름을 맞춰 본다.
 */
const namePatterns = [...source.matchAll(/['"`]([^'"`\s)]*?\.(?:webp|png|jpe?g|svg))['"`]/gi)]
  .map((match) => path.basename(match[1]))
  .filter((name) => name.includes('${'))
  .map((name) => name.split(/\$\{[^}]*\}/));

/** 조립식 이름과 맞는지 본다. 정규식으로 옮기면 역슬래시가 겹쳐 읽기 어려워 조각으로 맞춘다. */
function matchesPattern(name, parts) {
  if (!name.startsWith(parts[0])) return false;
  let at = parts[0].length;
  for (let index = 1; index < parts.length; index += 1) {
    const part = parts[index];
    // ${...} 자리가 비면 다른 파일까지 통과하므로 최소 한 글자는 채워져야 한다.
    if (index === parts.length - 1) return name.endsWith(part) && name.length - part.length > at;
    const found = name.indexOf(part, at + 1);
    if (found < 0) return false;
    at = found + part.length;
  }
  return true;
}

const publicImageFiles = filesUnder('public/images');
for (const file of publicImageFiles) {
  const name = path.basename(file);
  if (source.includes(name)) continue;
  if (namePatterns.some((parts) => matchesPattern(name, parts))) continue;
  throw new Error(`unreferenced public/images asset remains: ${file}`);
}

const characterPngs = filesUnder('public/characters').filter((file) => file.endsWith('.png'));
if (characterPngs.length > 0) {
  throw new Error(`retired character PNG duplicates remain: ${characterPngs.join(', ')}`);
}

const storyFiles = filesUnder('public/lessons/story').filter((file) => file.endsWith('.webp'));
if (storyFiles.length !== 266) {
  throw new Error(`expected 266 active story WebPs, found ${storyFiles.length}`);
}

const dataFiles = [
  ...filesUnder('src/data/studios').filter((file) => /[\\/]m\d[\\/]l\d+\.ts$/.test(file) || /^m\d\.ts$/.test(path.basename(file))),
  ...filesUnder('src/data/modulePortfolios').filter((file) => /^m\d\.ts$/.test(path.basename(file))),
];
for (const file of dataFiles) {
  if (fs.readFileSync(file, 'utf8').includes("imageSrc: ''")) {
    throw new Error(`empty imageSrc remains: ${file}`);
  }
}

console.log(
  `public image inventory: ${staticReferences.size} static references valid, ${storyFiles.length} story WebPs, no retired deployment duplicates`,
);
