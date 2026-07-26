import fs from 'node:fs';

const modules = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'];
let checked = 0;

for (const moduleId of modules) {
  const portfolioPath = `src/data/modulePortfolios/${moduleId}.ts`;
  const source = fs.readFileSync(portfolioPath, 'utf8');
  const references = [...source.matchAll(/imageSrc: '([^']+)'/g)].map((match) => match[1]);
  const expected = [1, 2, 3].map(
    (number) => `/lessons/story/module-close/${moduleId}/${moduleId}-close-scene-${String(number).padStart(2, '0')}.webp`,
  );

  if (source.includes("imageSrc: ''")) {
    throw new Error(`${portfolioPath} still contains an empty image slot`);
  }
  if (references.join('|') !== expected.join('|')) {
    throw new Error(`${portfolioPath} must connect the three ordered module-close scenes`);
  }

  for (const reference of expected) {
    const assetPath = `public${reference}`;
    if (!fs.existsSync(assetPath)) throw new Error(`missing module-close scene: ${assetPath}`);
    const buffer = fs.readFileSync(assetPath);
    if (buffer.length < 20_000) throw new Error(`module-close scene is unexpectedly small: ${assetPath}`);
    if (buffer.subarray(0, 4).toString('ascii') !== 'RIFF' || buffer.subarray(8, 12).toString('ascii') !== 'WEBP') {
      throw new Error(`module-close scene is not a WebP file: ${assetPath}`);
    }
    checked += 1;
  }
}

const renderer = fs.readFileSync('src/features/studio/ModuleCloseLessonView.tsx', 'utf8');
if (!renderer.includes('publicAssetUrl(scene.imageSrc)')) {
  throw new Error('module-close scenes must resolve through the Vite public base path');
}
if (renderer.includes('data-image-slot="pending"') && modules.some((moduleId) =>
  fs.readFileSync(`src/data/modulePortfolios/${moduleId}.ts`, 'utf8').includes("imageSrc: ''"))) {
  throw new Error('module-close pending image slot remains reachable');
}

console.log(`module-close story assets: ${checked}/18 WebP scenes connected`);
