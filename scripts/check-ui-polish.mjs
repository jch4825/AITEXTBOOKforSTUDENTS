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

// 스튜디오 62차시는 ScreentoneBackdrop이 micro-lesson-frame의 조상이다(StudioLessonView).
// min-h-screen(=100vh)은 주소창이 숨은 기준의 큰 뷰포트라서 측정된 프레임 높이보다 항상
// 크거나 같고, 그 차이가 푸터 아래 빈 공간으로 남는다. 백드롭은 부모를 채우기만 해야 한다.
// 안티패턴을 설명하는 주석은 위반이 아니므로 주석을 걷어낸 코드만 본다.
const screentoneBackdrop = readFileSync(new URL('../src/components/lesson/ScreentoneBackdrop.tsx', import.meta.url), 'utf8')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/[^\n]*/g, '');
if (screentoneBackdrop.includes('min-h-screen') || screentoneBackdrop.includes('100vh')) {
  throw new Error('Screentone backdrop must not floor its height to the large viewport (min-h-screen/100vh) — it leaves dead space under the lesson footer on mobile.');
}
if (!screentoneBackdrop.includes('min-h-full')) {
  throw new Error('Screentone backdrop must fill its parent with min-h-full.');
}

if (!existsSync(new URL('../src/components/lesson/EpisodeEnding.tsx', import.meta.url)) || !lessonView.includes('<EpisodeEnding')) {
  throw new Error('Wrap-up must use EpisodeEnding.');
}

const frame = readFileSync(new URL('../src/components/MicroLessonFrame.tsx', import.meta.url), 'utf8');
if (!frame.includes('comic-frame-footer')) {
  throw new Error('Lesson navigation must use the comic cut navigator.');
}
const classroomDock = readFileSync(new URL('../src/components/ClassroomDock.tsx', import.meta.url), 'utf8');
if (
  !frame.includes('micro-lesson-frame')
  || !frame.includes('visualViewport')
  || !frame.includes('--ai-lesson-viewport-height')
  || !frame.includes('--ai-lesson-footer-height')
  || !frame.includes('ResizeObserver')
  || !frame.includes('ref={footerRef}')
  || !css.includes('.micro-lesson-frame')
  || !css.includes('height: var(--ai-lesson-viewport-height, 100dvh)')
) {
  throw new Error('Lesson frame must follow the measured mobile viewport height.');
}
// 레슨 프레임 높이가 실측 visualViewport라서, 키보드가 떠도 레이아웃 뷰포트(100dvh)가
// 함께 줄어야 프레임 아래에 죽은 영역이 남지 않는다.
const indexHtml = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
if (!indexHtml.includes('interactive-widget=resizes-content')) {
  throw new Error('Viewport meta must set interactive-widget=resizes-content so the on-screen keyboard shrinks the layout viewport with the lesson frame.');
}

if (
  !classroomDock.includes('classroom-dock absolute')
  || classroomDock.includes('bottom-14')
  || !css.includes('.classroom-dock')
  || !css.includes('bottom: var(--ai-lesson-footer-height, 3.5rem)')
) {
  throw new Error('Classroom dock must be anchored to the measured footer height.');
}

const topBar = readFileSync(new URL('../src/components/TopBar.tsx', import.meta.url), 'utf8');
for (const marker of ['flex-wrap md:flex-nowrap', 'order-3 md:order-none', 'w-full md:w-auto']) {
  if (!topBar.includes(marker)) {
    throw new Error(`TopBar must keep every accessibility control visible at 390px and 125% text: ${marker}`);
  }
}
if (
  !/@media\s*\(max-width:\s*430px\)[\s\S]*?\.nav-jelly-btn\s*\{[^}]*white-space:\s*nowrap;/.test(css)
  || !/@media\s*\(max-width:\s*430px\)[\s\S]*?\.nav-jelly-badge\s*\{[^}]*width:\s*24px;[^}]*height:\s*24px;/.test(css)
) {
  throw new Error('TopBar control labels must stay on one line at 390px and 125% text.');
}

if (!document.includes('favicon.svg')) {
  throw new Error('The app must provide its own favicon.');
}

const seasonMap = readFileSync(new URL('../src/components/SeasonMap.tsx', import.meta.url), 'utf8');
if (!contents.includes('renderLessons=') || !seasonMap.includes('season-drawer-row') || !seasonMap.includes('aria-expanded')) {
  throw new Error('Active module lessons must render through the accessible season drawer.');
}
if (
  contents.includes('name="star"')
  || seasonMap.includes('name="star"')
  || !seasonMap.includes('season-progress-bar')
  || !contents.includes('comic-cut-done')
  || !css.includes('.season-map > .season-card')
  || !css.includes('border-bottom: 1px solid color-mix(in srgb, var(--comic-accent) 18%, var(--line))')
) {
  throw new Error('Contents must avoid star progress and nested card-like lesson cuts.');
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
