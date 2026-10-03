/**
 * 도움 영상 계약.
 *
 * 영상은 선생님이 직접 올린 보조 자료이고, 학생 화면(정리 노트)에 외부 플레이어로 끼운다.
 * 외부 플레이어를 학생 화면에 넣는 일이라 데이터와 소스 양쪽을 지킨다.
 *
 *  1. 목록: 정리 노트가 있는 스튜디오 차시에만 배정하고, 아이디 형식이 맞고,
 *     한 영상이 두 차시에 배정되지 않는다. 링크 열 개를 붙여 넣다가 같은 영상이 두 번 들어가고
 *     다른 차시 영상이 빠진 일이 실제로 있었다.
 *  2. 개인정보: 쿠키를 심지 않는 youtube-nocookie.com 만 쓴다. youtube.com/embed 는 쓰지 않는다.
 *  3. 누르기 전에는 유튜브로 어떤 요청도 가지 않는다: iframe 은 재생 상태의 가지에만 있다.
 *  4. 자리: 정리 노트(ConceptNoteView)가 카드를 그린다.
 *
 * 영상이 실제로 열리는지, 채널과 차시 표기가 맞는지는 네트워크가 필요하므로
 * `npm run check:teacher-resources -- --online` 이 본다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function loadBundled(entryPoint) {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    write: false,
    define: { 'import.meta.env.BASE_URL': '"/AITEXTBOOKforSTUDENTS/"' },
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

/** 줄 머리의 주석만 지운다. 문자열 속 `https://` 를 주석으로 오해하지 않게 줄 끝 주석은 건드리지 않는다. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const videos = await loadBundled('src/data/lessonVideos.ts');
const roles = await loadBundled('src/data/lessonRoles.ts');
const studioLessonIds = new Set(roles.STUDIO_LESSON_IDS);

// 1. 목록
const seen = new Map();
for (const [lessonId, video] of Object.entries(videos.LESSON_VIDEO)) {
  assert(
    studioLessonIds.has(lessonId),
    `${lessonId}: 정리 노트가 있는 스튜디오 차시가 아니라 학생 화면에 영상이 나오지 않는다`,
  );
  assert(/^[A-Za-z0-9_-]{11}$/.test(video.id), `${lessonId}: 영상 아이디 ${video.id} 는 11자 유튜브 아이디가 아니다`);
  assert(
    video.title.length > 0 && video.title.trim() === video.title && !/\s{2,}/.test(video.title),
    `${lessonId}: 영상 제목이 비었거나 앞뒤·겹친 공백이 있다`,
  );
  assert(!/m\d+[-\s]l\d+/i.test(video.title), `${lessonId}: 영상 제목에 차시 표기가 남았다 — 학생 카드에는 제목만 쓴다`);
  assert(
    Number.isInteger(video.seconds) && video.seconds >= 30 && video.seconds <= 3600,
    `${lessonId}: 영상 길이 ${video.seconds}초가 이상하다 — 영상 정보의 duration 을 초로 옮겨 적는다`,
  );
  if (seen.has(video.id)) {
    failures.push(`${lessonId}: 영상 ${video.id} 가 ${seen.get(video.id)} 에도 배정됐다 — 한 영상은 한 차시에만 쓴다`);
  }
  seen.set(video.id, lessonId);
}
assert(seen.size > 0, '배정된 영상이 하나도 없다');

// 2. 개인정보
assert(
  videos.LESSON_VIDEO_EMBED_ORIGIN === 'https://www.youtube-nocookie.com',
  `임베드 출처가 ${videos.LESSON_VIDEO_EMBED_ORIGIN} 이다 — 쿠키를 심지 않는 youtube-nocookie.com 이어야 한다`,
);
const sample = Object.values(videos.LESSON_VIDEO)[0];
if (sample) {
  const embed = new URL(videos.lessonVideoEmbedUrl(sample, 'https://example.org'));
  assert(embed.origin === 'https://www.youtube-nocookie.com', `임베드 주소의 출처가 ${embed.origin} 이다`);
  assert(embed.pathname === `/embed/${sample.id}`, `임베드 경로가 ${embed.pathname} 이다`);
  assert(embed.searchParams.get('rel') === '0', '임베드 주소에 rel=0 이 없다 — 끝난 뒤 추천이 다른 채널로 넓어진다');
  assert(embed.searchParams.get('enablejsapi') === '1', '임베드 주소에 enablejsapi=1 이 없다 — 끝났다는 신호를 받을 수 없다');
}
for (const file of walk('src')) {
  const source = stripComments(fs.readFileSync(file, 'utf8'));
  if (/youtube\.com\/embed/.test(source)) {
    failures.push(`${file.replaceAll('\\', '/')}: youtube.com/embed 는 쿠키를 심는다 — youtube-nocookie.com 을 쓴다`);
  }
}

// 3. 누르기 전에는 외부 요청이 없다
const card = stripComments(fs.readFileSync('src/features/studio/components/LessonVideoCard.tsx', 'utf8'));
const iframeCount = (card.match(/<iframe\b/g) ?? []).length;
assert(iframeCount === 1, `LessonVideoCard: iframe 이 ${iframeCount}개다 — 재생 상태에 하나만 있어야 한다`);
const playingBranch = card.indexOf("state === 'playing' ?");
assert(
  playingBranch > -1 && card.indexOf('<iframe') > playingBranch,
  'LessonVideoCard: iframe 이 재생 상태의 가지 밖에 있다 — 누르기 전에 유튜브로 요청이 간다',
);

// 4. 자리
const noteView = fs.readFileSync('src/features/studio/components/ConceptNoteView.tsx', 'utf8');
assert(/<LessonVideoCard\b/.test(noteView), 'ConceptNoteView: 도움 영상 카드가 정리 노트에 없다');

if (failures.length) {
  console.error(`lesson video contract failed: ${failures.length}건`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(
  `lesson videos: ${seen.size}개 영상 / ${seen.size}차시, 쿠키 없는 임베드, 누르기 전 외부 요청 없음`,
);
