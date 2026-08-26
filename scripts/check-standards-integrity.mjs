/**
 * 교육과정 무결성 계약.
 *
 * 기존 check:* 43종은 코드·자산·표기를 검사하지만 교육과정 자체를 보는 검사는
 * 없었다. 그 사이에 성취기준 해설이 저장소에 없는 교구를 약속하고, 성취수준이
 * 아예 없고, 관찰 차시가 실제 태깅과 어긋나는 상태가 오래 유지됐다.
 *
 * 이 검사는 다음을 강제한다.
 *  1. 24개 성취기준 모두에 해설과 성취수준 상/중/하가 있다.
 *  2. 성취수준의 관찰 차시는 실제로 그 성취기준을 태깅한 차시이거나 단원 마무리다.
 *  3. 성취수준 문장은 교사용 문어체이며 길이 상한을 지킨다.
 *  4. 같은 영역의 9학년군과 12학년군 기술이 서로 구별된다.
 *  5. 성취기준마다 최소 차시 수를 확보한다(가르치지 않는 기준 금지).
 */
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
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

const standardsModule = await loadBundled('src/data/aiAchievementStandards.ts');
const levelsModule = await loadBundled('src/data/aiAchievementLevels.ts');
const objectivesModule = await loadBundled('src/data/lessonObjectives.ts');
const rolesModule = await loadBundled('src/data/lessonRoles.ts');
const guideModule = await loadBundled('src/features/teacher/TeacherCurriculumGuide.tsx');

const STANDARDS = standardsModule.AI_ACHIEVEMENT_STANDARDS;
const LEVELS = levelsModule.AI_ACHIEVEMENT_LEVELS;
const OBJECTIVES = objectivesModule.LESSON_OBJECTIVES;
const EXPLANATIONS = guideModule.DETAILED_STANDARD_EXPLANATIONS;
const PORTFOLIOS = new Set(rolesModule.MODULE_CLOSE_LESSON_IDS);

/** 코드별로 그 성취기준을 태깅한 차시 목록 */
const taggedBy = new Map();
for (const objective of OBJECTIVES) {
  for (const code of objective.standards ?? []) {
    if (!taggedBy.has(code)) taggedBy.set(code, []);
    taggedBy.get(code).push(objective.lessonId);
  }
}

const allCodes = [];
for (const meta of Object.values(STANDARDS)) {
  for (const item of [...meta.middleSchool, ...meta.highSchool]) allCodes.push(item.code);
}
assert(allCodes.length === 24, `성취기준은 24개여야 한다 (현재 ${allCodes.length}개)`);

const MAX_LEVEL_LENGTH = 90;
/**
 * 학생용 종결어미. 교사용 기술에 섞이면 안 된다.
 * 문어체 성취수준은 항상 `~한다/~된다` 꼴로 끝나므로 `요`로 끝나는 것은 전부 학생체다.
 */
const STUDENT_VOICE = /[가-힣]요[.!?]?$/;

for (const bracketed of allCodes) {
  const code = bracketed.replace(/[[\]]/g, '');

  assert(
    typeof EXPLANATIONS[bracketed] === 'string' && EXPLANATIONS[bracketed].length > 40,
    `${bracketed}: 성취기준 해설이 없다`,
  );

  const levels = LEVELS[code];
  if (!levels) {
    failures.push(`${bracketed}: 성취수준(상/중/하)이 없다`);
    continue;
  }

  for (const [label, key] of [['상', 'high'], ['중', 'middle'], ['하', 'low']]) {
    const text = levels[key];
    assert(typeof text === 'string' && text.length > 10, `${bracketed} ${label}: 기술이 비어 있다`);
    if (typeof text !== 'string') continue;
    assert(text.length <= MAX_LEVEL_LENGTH, `${bracketed} ${label}: ${text.length}자로 ${MAX_LEVEL_LENGTH}자를 넘는다`);
    assert(!STUDENT_VOICE.test(text), `${bracketed} ${label}: 학생용 종결어미를 썼다 — 교사용 문어체여야 한다`);
  }

  const anchors = levels.anchorLessons ?? [];
  assert(anchors.length > 0, `${bracketed}: 관찰 차시가 비어 있다`);
  const tagged = taggedBy.get(code) ?? [];
  for (const anchor of anchors) {
    assert(
      tagged.includes(anchor) || PORTFOLIOS.has(anchor),
      `${bracketed}: 관찰 차시 ${anchor}가 이 성취기준을 태깅하지 않았다 (태깅된 차시: ${tagged.join(', ') || '없음'})`,
    );
  }

  // 가르치지 않는 성취기준을 금지한다.
  assert(tagged.length >= 2, `${bracketed}: 태깅된 차시가 ${tagged.length}개뿐이다 (최소 2개)`);
}

// 학년군 위계: 같은 영역·같은 번호의 9와 12가 같은 문장이면 학년군 구분이 무의미하다.
for (let domain = 1; domain <= 6; domain += 1) {
  for (const ordinal of ['01', '02']) {
    const middle = LEVELS[`9인지0${domain}-${ordinal}`];
    const high = LEVELS[`12인지0${domain}-${ordinal}`];
    if (!middle || !high) continue;
    for (const [label, key] of [['상', 'high'], ['중', 'middle'], ['하', 'low']]) {
      assert(
        middle[key] !== high[key],
        `영역 ${domain}-${ordinal} ${label}: 중학교와 고등학교 기술이 동일하다 — 학년군 위계가 사라진다`,
      );
    }
  }
}

if (failures.length) {
  console.error(`standards integrity contract failed: ${failures.length}건`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`standards integrity: 성취기준 ${allCodes.length}개, 성취수준 ${allCodes.length * 3}개, 관찰 차시 대조 통과`);
