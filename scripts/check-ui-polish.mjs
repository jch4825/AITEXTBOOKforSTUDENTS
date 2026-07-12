import { readFileSync } from 'node:fs';

const home = readFileSync(new URL('../src/views/Home.tsx', import.meta.url), 'utf8');
const sidebar = readFileSync(new URL('../src/components/SidebarTree.tsx', import.meta.url), 'utf8');
const matching = readFileSync(new URL('../src/components/games/Matching.tsx', import.meta.url), 'utf8');
const sequence = readFileSync(new URL('../src/components/games/Sequence.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
const document = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

if (home.includes('trailCanvasRef')) throw new Error('Mouse trail must be removed.');
if (!home.includes('prefers-reduced-motion')) throw new Error('Home must respect reduced motion.');
if (sidebar.includes('인공지능 API 활용 포함') || !sidebar.includes('h-11 w-11')) {
  throw new Error('Sidebar student wording or target size regressed.');
}
if (!matching.includes('sm:grid-cols-2') || !sequence.includes('sm:grid-cols-2')) {
  throw new Error('Game choices must stack below the small breakpoint.');
}

if (home.includes('href="#home"') || home.includes('href="#accessibility"') || home.includes('href="#privacy"') || home.includes('href="#support"')) {
  throw new Error('Home must not contain empty navigation anchors.');
}
if (!home.includes('내 속도로 배우는') || css.includes('@import url(') || !document.includes('theme-color" content="#2B3A55"')) {
  throw new Error('Student copy, font loading, or browser theme color regressed.');
}
