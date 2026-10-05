import { existsSync, readFileSync } from 'node:fs';

const home = readFileSync(new URL('../src/views/Home.tsx', import.meta.url), 'utf8');
const sidebar = readFileSync(new URL('../src/components/SidebarTree.tsx', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8');
const document = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

if (home.includes('trailCanvasRef')) throw new Error('Mouse trail must be removed.');
if (!home.includes('prefers-reduced-motion')) throw new Error('Home must respect reduced motion.');
if (sidebar.includes('인공지능 API 활용 포함') || !sidebar.includes('h-11 w-11')) {
  throw new Error('Sidebar student wording or target size regressed.');
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

// 차시 화면은 스튜디오(62)와 단원 마무리(6)뿐이다. 예전 단계형 렌더러(EpisodeHeroSpread·ActivitySpread·
// EpisodeEnding·MissionStep·games/*)는 쓰는 차시가 없어 없앴으므로, 그 부품을 요구하던 검사도 함께 뺐다.
const lessonView = readFileSync(new URL('../src/views/LessonView.tsx', import.meta.url), 'utf8');
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

const studioView = readFileSync(new URL('../src/features/studio/StudioLessonView.tsx', import.meta.url), 'utf8');
if (!existsSync(new URL('../src/components/lesson/ScreentoneBackdrop.tsx', import.meta.url)) || !studioView.includes('<ScreentoneBackdrop')) {
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

// 교실 도구는 본문 위에 떠 있지 않는다.
// 예전에는 푸터 높이에 absolute로 붙인 도크였다. 스크롤하는 본문 위에 겹쳐 이야기 대사 한 줄과
// `그대로 쓰기` 단추를 가렸다(1366×657, 1024×768 실측). 그렇다고 본문 아래에 도크 몫의 여백을 잡으면
// 낮은 화면에서 본문 높이의 12%를 잃는다. 그래서 상단 바의 "도구" 단추가 여는 시트로 옮겼고,
// 시트는 모든 폭에서 같은 것을 쓴다(데스크톱은 상단 바 아래 팝오버, 모바일은 아래 시트).
const topBar = readFileSync(new URL('../src/components/TopBar.tsx', import.meta.url), 'utf8');
const toolsTrigger = readFileSync(new URL('../src/components/controls/ToolsTrigger.tsx', import.meta.url), 'utf8');
if (
  classroomDock.includes('classroom-dock')
  || css.includes('.classroom-dock')
  || /mobile-teacher-tools-backdrop[^>]*md:hidden/.test(classroomDock)
  || frame.includes('md:pb-16')
) {
  throw new Error('Classroom tools must not float over the lesson body or hide on desktop; use the top-bar trigger and the shared tools sheet.');
}
if (
  !topBar.includes('<ToolsTrigger')
  || !toolsTrigger.includes('data-teacher-tools-trigger')
  || !classroomDock.includes('mobile-teacher-tools-sheet')
  || !/@media \(min-width: 768px\)\s*\{\s*\.mobile-teacher-tools-backdrop\s*\{[^}]*align-items:\s*flex-start;/.test(css)
) {
  throw new Error('Desktop must open the classroom tools sheet from the top-bar trigger as a popover under the top bar.');
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

const micButton = readFileSync(new URL('../src/components/MicButton.tsx', import.meta.url), 'utf8');
if (!micButton.includes('h-13 w-13')) {
  throw new Error('Mic button must keep its 52px touch target.');
}

const screentone = readFileSync(new URL('../src/components/lesson/ScreentoneBackdrop.tsx', import.meta.url), 'utf8');
if (!screentone.includes("'--accent': accent")) {
  throw new Error('Lesson screentone must publish the current module accent to nested activities.');
}
