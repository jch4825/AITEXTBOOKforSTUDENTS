import { build } from 'esbuild';

const failures = [];

function assert(condition, message) {
  if (!condition) failures.push(message);
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    failures.push(`${message}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`);
  }
}

async function loadBundled(entryPoint) {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    write: false,
    define: {
      'import.meta.env.BASE_URL': '"/AITEXTBOOKforSTUDENTS/"',
    },
  });
  const code = result.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

const alignmentModule = await loadBundled('src/features/teacher/lessonAlignment.ts');
const worksheetModule = await loadBundled('src/features/teacher/worksheet/buildWorksheet.ts');
const standardsModule = await loadBundled('src/data/linkedStandards.ts');
const teacherResourcesModule = await loadBundled('src/data/teacherResources.ts');

const rows = alignmentModule.getTeacherLessonAlignmentRows();
assertEqual(rows.length, 68, '교사용 차시 검토표는 실제 68차시를 빠짐없이 반환해야 한다');
assertEqual(rows.filter((row) => row.kind === 'studio').length, 62, '교사용 차시 검토표는 62개 스튜디오를 구분해야 한다');
assertEqual(rows.filter((row) => row.kind === 'portfolio').length, 6, '교사용 차시 검토표는 6개 성장 포트폴리오를 구분해야 한다');

const lessonM1L3 = rows.find((row) => row.lessonId === 'm1-l3');
assertEqual(lessonM1L3?.scenarioTitle, '아이미의 당당한 엉뚱 급식 발표!', 'm1-l3 교사용 시나리오는 현재 학생 스토리를 설명해야 한다');
assertEqual(lessonM1L3?.artifactTitle, 'AI 엉뚱 대답 검토 기록표', 'm1-l3 교사용 산출물은 현재 스튜디오 산출물과 같아야 한다');
assertEqual(
  lessonM1L3?.teacherObjective,
  'AI가 다음 말을 이어 그럴듯한 답을 만든다는 것을 말할 수 있고, 확인이 필요한 문장을 1개 이상 골라 근거 자료와 대조할 수 있다.',
  'm1-l3 교사용 관찰 목표는 학교 자체 목표 SSOT를 사용해야 한다',
);

const lessonM6L10 = rows.find((row) => row.lessonId === 'm6-l10');
assertEqual(lessonM6L10?.scenarioTitle, 'AI가 말한 직업 모습이 전부일까', 'm6-l10 교사용 시나리오는 실제 직업인 비교 수업을 설명해야 한다');
assertEqual(lessonM6L10?.artifactTitle, '나의 직업 탐색 카드', 'm6-l10 교사용 산출물은 현재 스튜디오 산출물과 같아야 한다');

const closeM1 = rows.find((row) => row.lessonId === 'm1-l11');
assertEqual(closeM1?.kind, 'portfolio', 'm1-l11은 일반 스튜디오가 아니라 성장 포트폴리오로 안내해야 한다');
assertEqual(closeM1?.scenarioTitle, '아이미 사용 설명서', 'm1-l11 교사용 설명은 현재 성장 포트폴리오 제목을 사용해야 한다');

const lessonM1L1Resources = teacherResourcesModule.getTeacherResources?.('m1-l1') ?? [];
assertEqual(lessonM1L1Resources.length, 1, 'm1-l1 교사 자료에는 요청한 영상 1개가 표시되어야 한다');
assertEqual(lessonM1L1Resources[0]?.url, 'https://youtu.be/iQ8A8ruR26g', 'm1-l1 교사 영상은 요청한 URL을 사용해야 한다');
assert(
  lessonM1L1Resources[0]?.description?.includes('도입 또는 정리'),
  'm1-l1 교사 영상에는 수업에서 언제 활용할지 알려 주는 짧은 설명이 필요하다',
);
assertEqual(
  (teacherResourcesModule.getTeacherResources?.('m1-l2') ?? []).length,
  0,
  'm1-l1 전용 영상이 다른 차시의 교사 자료에 노출되면 안 된다',
);

const worksheetM1L3 = worksheetModule.buildLessonWorksheet('m1-l3');
assertEqual(worksheetM1L3.lessonTitle, 'AI는 어떻게 답을 만들까?', 'm1-l3 활동지는 현재 스튜디오 제목을 사용해야 한다');
assertEqual(
  worksheetM1L3.objective,
  '다음 낱말 잇기 놀이로 아이미가 답을 만드는 방법을 겪어 보고, 아이미의 답에서 꼭 확인할 문장을 골라요.',
  'm1-l3 활동지는 현재 목표 SSOT를 사용해야 한다',
);
assert(
  worksheetM1L3.variants.high.blocks.some((block) => block.instruction?.includes('아이미의 엉뚱 대답, 진짜 식단표 정보')),
  'm1-l3 상 활동지는 현재 스튜디오 산출물 과제를 포함해야 한다',
);
assertEqual(
  worksheetM1L3.variants.high.blocks.find((block) => block.id === 'starter-high-transfer')?.instruction,
  '인터넷 검색 도구를 사용하는 AI의 답변을 접했을 때 어떻게 생각해야 할까요?',
  'm1-l3 상 활동지의 생활 전이 문장은 조사 붙이기로 훼손하지 말고 현재 스튜디오 질문을 그대로 사용해야 한다',
);

const allStandards = standardsModule.getFilteredLinkedStandards();
assertEqual(allStandards.length, 20, '공식 타 교과 성취기준 20개를 빠짐없이 검토표에 유지해야 한다');
assertEqual(allStandards.filter((item) => item.alignment === 'deferred').length, 2, '근거가 없는 수학·보건 연계 2개는 보류로 명시해야 한다');
const studioLessonIds = new Set(rows.filter((row) => row.kind === 'studio').map((row) => row.lessonId));

for (const standard of allStandards) {
  if (standard.alignment === 'deferred') {
    assertEqual(standard.lessonLinks.length, 0, `${standard.code}: 보류 기준을 현재 수업에 연계한 것처럼 표시하면 안 된다`);
    assert(Boolean(standard.deferredReason?.trim()), `${standard.code}: 보류 이유가 필요하다`);
    continue;
  }
  assert(standard.lessonLinks.length > 0, `${standard.code}: 직접·보조 연계에는 정확한 차시가 필요하다`);
  for (const link of standard.lessonLinks) {
    assert(/^m[1-6]-l\d+$/.test(link.lessonId), `${standard.code}: 잘못된 차시 ID ${link.lessonId}`);
    assert(studioLessonIds.has(link.lessonId), `${standard.code}: 현재 62개 스튜디오에 없는 ${link.lessonId}를 연계하면 안 된다`);
    assert(Boolean(link.evidence.trim()), `${standard.code} ${link.lessonId}: 실제 수업 근거가 비어 있다`);
  }
}

const module4Standards = standardsModule.getFilteredLinkedStandards({ moduleId: 'm4' });
assert(module4Standards.length > 0, '4단원 필터는 실제 연계 기준을 반환해야 한다');
assert(
  module4Standards.every((standard) => standard.lessonLinks.some((link) => link.lessonId.startsWith('m4-'))),
  '단원 필터 결과에는 해당 단원의 정확한 차시 근거가 있어야 한다',
);
assert(
  module4Standards.every((standard) => standard.alignment !== 'deferred'),
  '단원 필터에 아직 수업 근거가 없는 보류 기준이 섞이면 안 된다',
);

if (failures.length > 0) {
  for (const failure of failures) console.error(` - ${failure}`);
  throw new Error(`teacher mode alignment contract failed: ${failures.length} problem(s)`);
}

console.log('teacher mode alignment: 68 lessons, current worksheets, and exact cross-curricular links verified');
