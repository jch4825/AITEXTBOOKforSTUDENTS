import fs from 'node:fs';

const assets = [1, 2, 3, 4].map(
  (number) => `public/lessons/m1-l1-vn-${String(number).padStart(2, '0')}.webp`,
);

for (const asset of assets) {
  if (!fs.existsSync(asset)) throw new Error(`missing visual novel scene: ${asset}`);
  if (fs.statSync(asset).size < 20_000) throw new Error(`visual novel scene is unexpectedly small: ${asset}`);
}

console.log('visual novel social story assets: 4 scenes ready');
