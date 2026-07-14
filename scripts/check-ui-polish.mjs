import { existsSync, readFileSync } from 'node:fs';

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

if (!existsSync(new URL('../src/components/ComicPanel.tsx', import.meta.url)) || !existsSync(new URL('../src/components/StoryAsset.tsx', import.meta.url))) {
  throw new Error('Webtoon panel and WebP asset fallback components must exist.');
}

const contents = readFileSync(new URL('../src/views/ContentsView.tsx', import.meta.url), 'utf8');
if (!existsSync(new URL('../src/components/SeasonMap.tsx', import.meta.url)) || !contents.includes('SeasonMap')) {
  throw new Error('Contents must use the season map navigation.');
}

const lessonView = readFileSync(new URL('../src/views/LessonView.tsx', import.meta.url), 'utf8');
for (const marker of ['EpisodeHeroSpread', 'ActivitySpread', 'EpisodeEnding', 'ScreentoneBackdrop']) {
  if (!lessonView.includes(marker)) {
    throw new Error(`LessonView must use ${marker}.`);
  }
}
if (lessonView.includes('ComicPanel')) {
  throw new Error('LessonView must not use ComicPanel.');
}

if (css.includes('.comic-stage > div:first-child')) {
  throw new Error('Old comic-stage > div:first-child style must be removed.');
}

if (!existsSync(new URL('../src/components/lesson/LessonSpread.tsx', import.meta.url))) {
  throw new Error('LessonSpread component must exist.');
}
const lessonSpread = readFileSync(new URL('../src/components/lesson/LessonSpread.tsx', import.meta.url), 'utf8');
if (!lessonSpread.includes('lg:grid-cols-2') || !lessonSpread.includes('lesson-gutter')) {
  throw new Error('LessonSpread must use a symmetric 1:1 column grid with a centered gutter.');
}
if (lessonSpread.includes('lg:grid-cols-[7fr_5fr]') || lessonSpread.includes('lg:grid-cols-[5fr_7fr]')) {
  throw new Error('LessonSpread must not use the old asymmetric 7:5 / 5:7 column grid.');
}

if (!existsSync(new URL('../src/components/lesson/EpisodeHeroSpread.tsx', import.meta.url))) {
  throw new Error('EpisodeHeroSpread component must exist.');
}
const heroSpread = readFileSync(new URL('../src/components/lesson/EpisodeHeroSpread.tsx', import.meta.url), 'utf8');
if (!heroSpread.includes('spread-hero-image')) {
  throw new Error('EpisodeHeroSpread must contain the spread-hero-image identifier.');
}

if (!existsSync(new URL('../src/components/lesson/ActivitySpread.tsx', import.meta.url))) {
  throw new Error('ActivitySpread component must exist.');
}

const activityFiles = [
  '../src/components/games/OXGame.tsx',
  '../src/components/games/CardPick.tsx',
  '../src/components/games/Matching.tsx',
  '../src/components/games/Sequence.tsx',
];
for (const activityFile of activityFiles) {
  const source = readFileSync(new URL(activityFile, import.meta.url), 'utf8');
  if (!source.includes('<ActivitySpread') || source.includes('card3d')) {
    throw new Error(`${activityFile} must use ActivitySpread without legacy card3d styling.`);
  }
}

const realAi = readFileSync(new URL('../src/components/RealAIStep.tsx', import.meta.url), 'utf8');
const mission = readFileSync(new URL('../src/components/mission/MissionStep.tsx', import.meta.url), 'utf8');
if (!realAi.includes('<ActivitySpread') || !mission.includes('<LessonSpread')) {
  throw new Error('AI and mission activities must use the spread hierarchy.');
}

if (!existsSync(new URL('../src/components/lesson/ScreentoneBackdrop.tsx', import.meta.url)) || !lessonView.includes('<ScreentoneBackdrop')) {
  throw new Error('Lesson screens must use the module screentone backdrop.');
}

if (!existsSync(new URL('../src/components/lesson/EpisodeEnding.tsx', import.meta.url)) || !lessonView.includes('<EpisodeEnding')) {
  throw new Error('Wrap-up must use EpisodeEnding.');
}

const frame = readFileSync(new URL('../src/components/MicroLessonFrame.tsx', import.meta.url), 'utf8');
if (!frame.includes('comic-frame-footer')) {
  throw new Error('Lesson navigation must use the comic cut navigator.');
}

if (!document.includes('favicon.svg')) {
  throw new Error('The app must provide its own favicon.');
}

const seasonMap = readFileSync(new URL('../src/components/SeasonMap.tsx', import.meta.url), 'utf8');
if (!contents.includes('renderLessons=') || !seasonMap.includes('season-drawer-row') || !seasonMap.includes('aria-expanded')) {
  throw new Error('Active module lessons must render through the accessible season drawer.');
}


const ox = readFileSync(new URL('../src/components/games/OXGame.tsx', import.meta.url), 'utf8');
if (!ox.includes('grid-cols-1 sm:grid-cols-2')) {
  throw new Error('OX choices must stack below the small breakpoint.');
}

const phoneFrame = readFileSync(new URL('../src/components/PhoneFrame.tsx', import.meta.url), 'utf8');
const micButton = readFileSync(new URL('../src/components/MicButton.tsx', import.meta.url), 'utf8');
if (!realAi.includes('aiGlow: true') || !phoneFrame.includes('msg.aiGlow')) {
  throw new Error('Only a successful real-AI reply must carry the Aimi signature glow.');
}
if (
  !phoneFrame.includes('prefers-reduced-motion: reduce')
  || !phoneFrame.includes('motion-safe:animate-bounce')
) {
  throw new Error('Phone chat motion must respect reduced-motion preferences.');
}
if (
  !realAi.includes('h-13 px-3')
  || !realAi.includes('h-13 w-13')
  || !micButton.includes('h-13 w-13')
) {
  throw new Error('Core real-AI input controls must keep 52px touch targets.');
}

if (!mission.includes('lg:max-h-[50vh] lg:overflow-y-auto')) {
  throw new Error('Mission content must use the page scroll instead of a nested mobile scroller.');
}

if (!heroSpread.includes('lessons/png/webtoon/')) {
  throw new Error('EpisodeHeroSpread must fall back from WebP to the webtoon PNG original.');
}

const screentone = readFileSync(new URL('../src/components/lesson/ScreentoneBackdrop.tsx', import.meta.url), 'utf8');
if (!screentone.includes("'--accent': accent")) {
  throw new Error('Lesson screentone must publish the current module accent to nested activities.');
}

const ending = readFileSync(new URL('../src/components/lesson/EpisodeEnding.tsx', import.meta.url), 'utf8');
if (!ending.includes('motion-safe:animate-[spin_60s_linear_infinite]')) {
  throw new Error('Episode ending decoration must stop when reduced motion is requested.');
}


if (
  heroSpread.includes('reverseLayout')
  || heroSpread.includes('reverse={')
  || !heroSpread.includes('left={leftPage}')
  || !heroSpread.includes('right={rightPage}')
) {
  throw new Error('Hero page order must stay fixed as image-left and text-right.');
}
