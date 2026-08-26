/**
 * 교사 자료 링크 계약.
 *
 * 외부 링크는 시간이 지나면 반드시 끊긴다. 서비스가 종료되기도 한다
 * (이 자료를 만들 때도 후보 하나가 이미 502로 죽어 있었다).
 * 죽은 링크를 수업 중에 발견하는 것보다 검사에서 먼저 잡는 편이 낫다.
 *
 * 기본 실행은 오프라인 검사만 한다. 실제 응답 확인은 네트워크가 필요하므로
 * `--online` 을 붙였을 때만 수행한다(CI에서 매번 외부를 두드리지 않기 위해).
 *
 *   npm run check:teacher-resources
 *   npm run check:teacher-resources -- --online
 */
import { build } from 'esbuild';

const online = process.argv.includes('--online');
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

const resources = await loadBundled('src/data/teacherResources.ts');
const roles = await loadBundled('src/data/lessonRoles.ts');

const { TOOLS, LESSON_TOOL, LESSON_VIDEO, getTeacherResources } = resources;
const allLessonIds = [...roles.STUDIO_LESSON_IDS, ...roles.MODULE_CLOSE_LESSON_IDS];

// 배정된 차시가 실제로 존재해야 한다.
for (const lessonId of [...Object.keys(LESSON_TOOL), ...Object.keys(LESSON_VIDEO)]) {
  assert(allLessonIds.includes(lessonId), `${lessonId}: 존재하지 않는 차시에 자료가 배정됐다`);
}

// 링크는 전체 URL이어야 한다. 단축 URL은 무엇을 여는지 교사가 알 수 없다.
const SHORTENERS = /(youtu\.be|bit\.ly|tinyurl|t\.co|han\.gl|url\.kr)/;
const seen = new Set();
for (const lessonId of allLessonIds) {
  for (const link of getTeacherResources(lessonId)) {
    seen.add(link.url);
    assert(/^https:\/\//.test(link.url), `${lessonId}: ${link.url} 는 https가 아니다`);
    assert(!SHORTENERS.test(link.url), `${lessonId}: ${link.url} 는 단축 URL이다 — 전체 주소를 쓴다`);
    assert(Boolean(link.source), `${lessonId}: ${link.label} 에 제공자가 없다`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(link.checkedAt), `${lessonId}: ${link.label} 의 확인 날짜 형식이 틀렸다`);
    assert(Boolean(link.fallback), `${lessonId}: ${link.label} 에 대체 활동이 없다`);
  }
}

// 카탈로그에 있으나 아무 차시도 쓰지 않는 도구는 죽은 항목이다.
const usedTools = new Set(Object.values(LESSON_TOOL).map((entry) => entry.tool));
for (const key of Object.keys(TOOLS)) {
  assert(usedTools.has(key), `TOOLS.${key}: 어느 차시에서도 쓰지 않는다`);
}

if (online) {
  for (const url of seen) {
    try {
      const response = await fetch(url, { redirect: 'follow', headers: { 'user-agent': 'Mozilla/5.0' } });
      assert(response.ok, `${url} -> HTTP ${response.status}`);
    } catch (error) {
      failures.push(`${url} -> ${String(error.message).slice(0, 60)}`);
    }
  }
  // 영상은 존재만이 아니라 채널이 바뀌지 않았는지도 본다.
  for (const [lessonId, video] of Object.entries(LESSON_VIDEO)) {
    const endpoint = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video.id}&format=json`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) { failures.push(`${lessonId}: 영상 ${video.id} 없음/비공개 (HTTP ${response.status})`); continue; }
      const data = await response.json();
      assert(
        data.author_name === '00학번ㅏ',
        `${lessonId}: 영상 ${video.id} 의 채널이 ${data.author_name} 로 바뀌었다 — 다른 영상일 수 있다`,
      );
    } catch (error) {
      failures.push(`${lessonId}: 영상 확인 실패 ${String(error.message).slice(0, 40)}`);
    }
  }
}

if (failures.length) {
  console.error(`teacher resource contract failed: ${failures.length}건`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

const lessonsWithLinks = allLessonIds.filter((id) => getTeacherResources(id).length > 0).length;
console.log(
  `teacher resources: 도구 ${Object.keys(TOOLS).length}종, 배정 ${Object.keys(LESSON_TOOL).length}차시, `
  + `영상 ${Object.keys(LESSON_VIDEO).length}개, 자료 있는 차시 ${lessonsWithLinks}/${allLessonIds.length}`
  + (online ? ' (온라인 확인 통과)' : ' (오프라인 검사만)'),
);
