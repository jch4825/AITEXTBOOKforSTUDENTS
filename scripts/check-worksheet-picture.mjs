/**
 * 그림 카드 학습지(하·중 수준) 계약.
 *
 * 교사 도구의 A4 학습지 가운데 하(오리고 찾아요)와 중(덧쓰고 붙여요)은 글을 많이 읽지 않아도 그림과 손으로
 * 끝낼 수 있어야 한다. 예전에는 선택지 문장(30~60자)을 그대로 보기로 싣고, 60자짜리 문장을 "낱말"이라며 따라 쓰게 하고,
 * 세 칸짜리 글자 카드(높이 11mm, 글자 13px)를 오려 붙이게 했다. 그 모습으로 돌아가지 않게 지킨다.
 *
 * 두 수준이 함께 지키는 것
 *  1. 완전성: 62개 스튜디오와 6개 단원 마무리 모두에 구성이 있고, 구성이 가리키는 선택지가 실제로 있다.
 *  2. 그림 위주: 두 장(앞: 고르기·쓰기, 뒤: 붙이기)이고, 카드는 모두 그림(그림 카드 파일 또는 이모지)이며
 *     그림 파일이 실제로 있다. 한 쪽에 보이는 글자는 정해 둔 양을 넘지 않는다.
 *  3. 크기: 고르기·붙이기 카드는 한 변 48mm 이상이다(오려 붙이기가 작아서 어려웠다는 지적).
 *  4. 글자: 카드 글자는 열두 글자 이내이고, 그림 카드 판의 카드는 그림에 인쇄된 낱말과 같다. 물음은 해요체로 끝나고
 *     마흔네 글자 이내다.
 *  5. 정답: 알맞은 카드나 칸을 정한 목록은 정답이 하나 이상이고, 붙이기의 칸 id가 모두 있다. 카드마다 교사가 읽어 줄 문장이 있다.
 *  6. 인쇄: 인쇄본의 그림이 모두 사이트 안의 파일이고, 쪽마다 그림 카드가 들어 있다. 정답지는 쪽을 하나 더 낸다.
 *  7. 저장본: 옛 구성(글자 위주)으로 저장해 둔 편집본은 새 구성으로 갈아 끼워지고, 새 구성의 편집본은 그대로 남는다.
 *     한 수준을 갈아 끼워도 다른 수준의 저장본은 건드리지 않는다.
 *  8. 같은 답: 하와 중은 같은 카드·같은 물음·같은 정답을 쓴다. 쓰기 칸과 칸 이름 덧쓰기만 다르다.
 *
 * 수준마다 다른 것
 *  - 하: 둘째 칸 “따라 써요” — 핵심 낱말(열 글자 이내)을 큰 글자로 따라 쓴다. 그림 카드의 글자와 같다.
 *  - 중: 둘째 칸 “덧써요” — 핵심 문장(열여덟 글자 이내, 해요체)을 덧쓰고, 둘째 줄에서는 핵심 낱말만 빈칸으로 둔 채
 *        직접 쓴다. 학생용 인쇄본의 빈칸은 비어 있고 정답지에서만 낱말이 보인다. 붙이기의 칸 이름도 연한 글자로 덧쓴다.
 *
 * 쪽 안에 다 들어가는지(A4 한 장 기준선)는 브라우저에서만 잴 수 있다. 쪽마다 높이를 재는 방법은
 * 학습지를 인쇄 미디어로 열어 `.worksheet-page`의 `data-overflow`·`is-compact` 표시를 보는 것이다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

async function loadBundled(contents) {
  const result = await build({
    stdin: { contents, resolveDir: process.cwd(), sourcefile: 'entry.ts', loader: 'ts' },
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node22',
    write: false,
    define: { 'import.meta.env.BASE_URL': '"/AITEXTBOOKforSTUDENTS/"' },
  });
  return import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
}

const mod = await loadBundled(`
  export { buildLessonWorksheet, mergeWorksheetDraft } from './src/features/teacher/worksheet/buildWorksheet';
  export { buildWorksheetHtml, worksheetHasAnswers } from './src/features/teacher/worksheet/worksheetHtml';
  export { choiceCardSize, sortCardSize, slotCounts, textUnits, traceFontSize } from './src/features/teacher/worksheet/pictureBlocks';
  export { PICTURE_TEMPLATE } from './src/features/teacher/worksheet/pictureLevels';
  export { PICTURE_WORKSHEET_SPECS } from './src/data/pictureWorksheets';
  export { PECS_LABELS, PECS_BY_MODULE } from './src/data/pecs';
  export { LEGACY_PECS_IDS, legacyPecsLabel } from './src/data/legacyPecs';
  export { STUDIO_LESSON_IDS, MODULE_CLOSE_LESSON_IDS } from './src/data/lessonRoles';
`);

const lessonIds = [...mod.STUDIO_LESSON_IDS, ...mod.MODULE_CLOSE_LESSON_IDS];
const LEVELS = {
  low: { key: 'low', name: '하', prefix: 'low' },
  middle: { key: 'middle', name: '중', prefix: 'mid' },
};
const MIN_CARD_MM = 48;
const MAX_CARD_TEXT = 12;
const MAX_WORD = 10;
const MAX_SENTENCE = 18;
const MAX_SENTENCE_UNITS = 15.5;
const MIN_TRACE_MM = 7.2;
const MAX_ASK = 44;
const MAX_VISIBLE_CHARS_PER_PAGE = 170;
const HAEYO = /(요|까요)[.?!]?$/;

const nonSpace = (text) => [...String(text ?? '').replace(/\s/g, '')].length;
const publicFile = (src) => {
  const trimmed = src.replace(/^\/AITEXTBOOKforSTUDENTS\//, '');
  return path.join('public', trimmed);
};
const stripTags = (html) => html.replace(/<[^>]+>/g, '');
const unescapeHtml = (text) => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const traceRows = (html) => [...html.matchAll(/<div class="ws-trace-row">([\s\S]*?)<\/div>/g)].map((match) => match[1]);
const pageCount = (value) => (value.match(/<main class="worksheet-page"/g) ?? []).length;

// 1. 완전성
for (const id of Object.keys(mod.PICTURE_WORKSHEET_SPECS)) {
  assert(lessonIds.includes(id), `pictureWorksheets.ts: ${id}는 68차시에 없는 차시다`);
}
for (const id of lessonIds) {
  const spec = mod.PICTURE_WORKSHEET_SPECS[id];
  assert(Boolean(spec), `pictureWorksheets.ts: ${id}의 그림 카드 구성이 없다`);
  if (!spec) continue;
  assert(typeof spec.sentence === 'string' && spec.sentence.trim().length > 0, `pictureWorksheets.ts: ${id}에 중 수준이 덧쓸 문장(sentence)이 없다`);
}

const stats = {
  low: { cards: 0, picture: 0, emoji: 0, maxVisible: 0, minTrace: Infinity },
  middle: { cards: 0, picture: 0, emoji: 0, maxVisible: 0, minTrace: Infinity },
};

/** 같은 답을 쓰는지 비교하려고 고르기·붙이기 칸의 카드·정답을 한 줄로 요약한다. */
function answerSignature(variant) {
  const blocks = (variant.pages ?? []).flatMap((page) => page.blocks);
  const choose = blocks.find((block) => block.kind === 'picture-choice');
  const sort = blocks.find((block) => block.kind === 'picture-sort');
  const cards = (block) => (block?.pictureCards ?? []).map((card) => [card.id, card.label, card.src ?? card.emoji ?? '', card.suitable ? 1 : 0, card.zone ?? '', card.say ?? ''].join('|')).join(';');
  const zones = (block) => (block?.zones ?? []).map((zone) => [zone.id, zone.label, zone.mark ?? ''].join('|')).join(';');
  return [choose?.instruction, cards(choose), sort?.instruction, zones(sort), cards(sort)].join('\n');
}

for (const id of lessonIds) {
  let worksheet;
  try {
    worksheet = mod.buildLessonWorksheet(id);
  } catch (error) {
    failures.push(`${id}: 학습지를 만들지 못했다 — ${error.message}`);
    continue;
  }
  const spec = mod.PICTURE_WORKSHEET_SPECS[id];

  for (const L of Object.values(LEVELS)) {
    const variant = worksheet.variants[L.key];
    const tag = `${id} ${L.name} 수준`;
    const stat = stats[L.key];
    assert(variant.template === mod.PICTURE_TEMPLATE, `${tag}: 구성에 판 표시(${mod.PICTURE_TEMPLATE})가 없다`);
    const pages = variant.pages ?? [];
    assert(pages.length === 2, `${tag}: 두 장(앞면·붙이기 면)이어야 한다 (지금 ${pages.length}장)`);
    assert(pages[0]?.id === `${L.prefix}-page-1` && pages[1]?.id === `${L.prefix}-page-2`, `${tag}: 쪽 id가 ${L.prefix}-page-1·${L.prefix}-page-2가 아니다`);
    const blocks = pages.flatMap((page) => page.blocks);
    const choose = blocks.find((block) => block.kind === 'picture-choice');
    const trace = blocks.find((block) => block.kind === 'word-trace');
    const sort = blocks.find((block) => block.kind === 'picture-sort');
    assert(choose && trace && sort, `${tag}: 고르기·쓰기·붙이기 세 칸이 모두 있어야 한다`);
    if (!choose || !trace || !sort) continue;
    assert(pages[0]?.blocks.map((block) => block.kind).join() === 'picture-choice,word-trace', `${tag}: 앞면은 고르기와 쓰기여야 한다`);
    assert(pages[1]?.blocks.map((block) => block.kind).join() === 'picture-sort', `${tag}: 뒷면은 붙이기여야 한다`);
    assert(choose.id === `${L.prefix}-choose` && trace.id === `${L.prefix}-trace` && sort.id === `${L.prefix}-sort`, `${tag}: 칸 id가 ${L.prefix}-choose·trace·sort가 아니다`);

    // 옛 글자 위주 칸(선다형·오려 붙이기형·덧쓰기형)이 남아 있지 않다.
    for (const block of blocks) {
      assert(!['multiple-choice', 'cut-paste', 'trace'].includes(block.kind), `${tag}: 글자 위주 칸(${block.kind})이 남아 있다`);
    }

    // 2~4. 카드와 글자
    const allCards = [...(choose.pictureCards ?? []), ...(trace.pictureCards ?? []), ...(sort.pictureCards ?? []), ...(sort.zones ?? []).flatMap((zone) => (zone.card ? [zone.card] : []))];
    for (const card of allCards) {
      stat.cards += 1;
      assert(Boolean(card.src || card.emoji), `${tag}: 카드 ${card.id}에 그림이 없다`);
      assert(nonSpace(card.label) <= MAX_CARD_TEXT, `${tag}: 카드 글자 “${card.label}”가 ${MAX_CARD_TEXT}자를 넘는다`);
      if (card.src) {
        stat.picture += 1;
        const file = publicFile(card.src);
        assert(fs.existsSync(file), `${tag}: 카드 그림 파일이 없다 — ${file}`);
        const printed = card.src.match(/\/lessons\/pecs\/(?:(m[1-6])\/)?([a-z_0-9]+)\.webp$/);
        if (printed && card.printed) {
          const [, moduleId, cardId] = printed;
          const expected = moduleId ? mod.PECS_LABELS[cardId] : mod.legacyPecsLabel(cardId);
          assert(card.label === expected, `${tag}: 카드 ${cardId}의 글자 “${card.label}”가 그림에 인쇄된 낱말 “${expected}”와 다르다`);
          if (moduleId) assert((mod.PECS_BY_MODULE[moduleId] ?? []).includes(cardId), `${tag}: ${cardId}는 ${moduleId} 그림 카드 판에 없다`);
          else assert(mod.LEGACY_PECS_IDS.includes(cardId), `${tag}: ${cardId}는 옛 그림 카드 목록에 없다`);
        }
      } else {
        stat.emoji += 1;
      }
    }
    assert((choose.pictureCards ?? []).length === 3, `${tag}: 고르기 카드는 세 장이어야 한다 (지금 ${(choose.pictureCards ?? []).length}장)`);
    assert((sort.pictureCards ?? []).length === 3, `${tag}: 붙이기 카드는 세 장이어야 한다 (지금 ${(sort.pictureCards ?? []).length}장)`);
    const wordCard = trace.pictureCards?.[0];
    assert(Boolean(wordCard), `${tag}: 쓸 낱말에 그림이 없다`);

    if (L.key === 'low') {
      assert(nonSpace(trace.traceText) >= 1 && nonSpace(trace.traceText) <= MAX_WORD, `${tag}: 따라 쓸 낱말 “${trace.traceText}”는 1~${MAX_WORD}자여야 한다`);
      if (wordCard?.printed) assert(wordCard.label === trace.traceText, `${tag}: 따라 쓸 낱말 “${trace.traceText}”가 그림 카드 글자 “${wordCard.label}”와 다르다`);
      assert(!trace.traceBlank, `${tag}: 하 수준에는 빈칸이 없어야 한다`);
      assert(!sort.traceZones, `${tag}: 하 수준은 칸 이름을 덧쓰지 않는다`);
    } else {
      const sentence = trace.traceText ?? '';
      const blank = trace.traceBlank ?? '';
      assert(sentence === spec?.sentence, `${tag}: 덧쓸 문장이 구성의 sentence와 다르다`);
      assert(nonSpace(sentence) >= 4 && nonSpace(sentence) <= MAX_SENTENCE, `${tag}: 덧쓸 문장 “${sentence}”는 4~${MAX_SENTENCE}자여야 한다 (${nonSpace(sentence)}자)`);
      assert(mod.textUnits(sentence) <= MAX_SENTENCE_UNITS, `${tag}: 덧쓸 문장 “${sentence}”가 너무 길다 (${mod.textUnits(sentence).toFixed(2)} > ${MAX_SENTENCE_UNITS})`);
      assert(HAEYO.test(sentence), `${tag}: 덧쓸 문장 “${sentence}”는 해요체로 끝나야 한다`);
      assert(blank.length > 0 && sentence.includes(blank), `${tag}: 빈칸 낱말 “${blank}”가 문장 “${sentence}” 안에 없다`);
      assert(sentence.split(blank).length === 2, `${tag}: 빈칸 낱말 “${blank}”가 문장 “${sentence}”에 한 번만 나와야 한다`);
      assert(nonSpace(blank) >= 1 && nonSpace(blank) < nonSpace(sentence), `${tag}: 빈칸 낱말 “${blank}”는 문장의 일부여야 한다`);
      assert(blank === spec?.word, `${tag}: 빈칸 낱말 “${blank}”가 핵심 낱말 “${spec?.word}”와 다르다`);
      if (wordCard?.printed) assert(wordCard.label === blank, `${tag}: 빈칸 낱말 “${blank}”가 그림 카드 글자 “${wordCard.label}”와 다르다`);
      const size = mod.traceFontSize(sentence, blank);
      stat.minTrace = Math.min(stat.minTrace, size);
      assert(size >= MIN_TRACE_MM, `${tag}: 덧쓰는 글자가 ${size}mm로 ${MIN_TRACE_MM}mm보다 작다`);
      assert(sort.traceZones === true, `${tag}: 중 수준은 칸 이름을 덧쓰게 해야 한다 (traceZones)`);
    }

    for (const [label, text] of [['1. 물음', choose.instruction], ['3. 물음', sort.instruction]]) {
      assert(Boolean(text) && [...text].length <= MAX_ASK, `${tag}: ${label}은 ${MAX_ASK}자 이내여야 한다 (${[...(text ?? '')].length}자)`);
      assert(HAEYO.test(text ?? ''), `${tag}: ${label}은 해요체로 끝나야 한다 — ${text}`);
    }

    // 3. 크기
    const chooseSize = mod.choiceCardSize(choose.pictureCards.length, choose.cardSize);
    const sortSize = mod.sortCardSize(mod.slotCounts(sort.zones, sort.pictureCards), sort.pictureCards.length, sort.cardSize);
    assert(chooseSize >= MIN_CARD_MM, `${tag}: 고르기 카드가 ${chooseSize}mm로 ${MIN_CARD_MM}mm보다 작다`);
    assert(sortSize >= MIN_CARD_MM, `${tag}: 붙이기 카드가 ${sortSize}mm로 ${MIN_CARD_MM}mm보다 작다`);

    // 5. 정답
    const decidedChoose = choose.pictureCards.some((card) => card.suitable === true);
    if (decidedChoose) assert(choose.pictureCards.every((card) => typeof card.suitable === 'boolean'), `${tag}: 알맞은 카드를 정했으면 나머지는 알맞지 않다고 표시해야 한다`);
    const zoneIds = new Set((sort.zones ?? []).map((zone) => zone.id));
    assert(zoneIds.size >= 1, `${tag}: 붙이기에 칸이 없다`);
    for (const card of sort.pictureCards) {
      if (card.zone) assert(zoneIds.has(card.zone), `${tag}: 카드 ${card.id}가 없는 칸(${card.zone})을 가리킨다`);
    }
    const placed = sort.pictureCards.filter((card) => card.zone).length;
    assert(placed === 0 || placed === sort.pictureCards.length, `${tag}: 붙이기 카드의 일부만 칸이 정해져 있다`);
    if (placed > 0) {
      const usedZones = new Set(sort.pictureCards.map((card) => card.zone));
      assert(usedZones.size >= 2 || sort.zones.length === 1, `${tag}: 붙이기 카드가 모두 한 칸에만 들어간다`);
    }
    for (const card of [...choose.pictureCards, ...sort.pictureCards]) {
      assert(Boolean(card.say?.trim()), `${tag}: 카드 ${card.id}에 교사가 읽어 줄 문장이 없다`);
    }
    assert(mod.worksheetHasAnswers(variant), `${tag}: 정답지로 낼 내용이 없다`);

    // 쪽마다 보이는 글자 양(중은 둘째 줄에 빈칸만 비운 같은 문장이 한 번 더 나온다)
    pages.forEach((page, pageIndex) => {
      let visible = 0;
      for (const block of page.blocks) {
        visible += nonSpace(block.title) + nonSpace(block.text) + nonSpace(block.instruction) + nonSpace(block.traceText);
        if (block.kind === 'word-trace' && block.traceBlank) visible += nonSpace(block.traceText) - nonSpace(block.traceBlank);
        for (const card of block.pictureCards ?? []) if (!card.printed) visible += nonSpace(card.label);
        for (const zone of block.zones ?? []) visible += nonSpace(zone.label);
      }
      stat.maxVisible = Math.max(stat.maxVisible, visible);
      assert(visible <= MAX_VISIBLE_CHARS_PER_PAGE, `${tag}: ${pageIndex + 1}쪽에 보이는 글자가 ${visible}자로 ${MAX_VISIBLE_CHARS_PER_PAGE}자를 넘는다`);
    });

    // 6. 인쇄
    const html = mod.buildWorksheetHtml(worksheet, variant);
    const answerHtml = mod.buildWorksheetHtml(worksheet, variant, { answers: true });
    assert(pageCount(html) === 2, `${tag}: 인쇄본이 두 쪽이 아니다 (${pageCount(html)}쪽)`);
    assert(pageCount(answerHtml) === 3, `${tag}: 정답지가 세 쪽(학생용 두 쪽 + 교사용 안내)이 아니다 (${pageCount(answerHtml)}쪽)`);
    const images = [...html.matchAll(/<img[^>]*?\ssrc="([^"]+)"/g)].map((match) => match[1]);
    // 카드는 그림 파일(img)이거나 이모지다. 둘 다 .ws-card로 그려지므로 카드 수로 센다(고르기 3 + 쓰기 1 + 오릴 카드 3).
    const cardCount = (html.match(/class="ws-card[ "]/g) ?? []).length;
    assert(cardCount >= 7, `${tag}: 인쇄본의 그림 카드가 ${cardCount}장뿐이다 (7장 이상)`);
    const sceneCount = (html.match(/<figure class="ws-scene">/g) ?? []).length;
    assert(sceneCount === 2, `${tag}: 쪽마다 장면 그림이 하나씩 있어야 한다 (지금 ${sceneCount}장)`);
    for (const src of images) {
      assert(src.startsWith('/AITEXTBOOKforSTUDENTS/'), `${tag}: 인쇄본 그림 주소가 사이트 안의 경로가 아니다 — ${src}`);
      assert(fs.existsSync(publicFile(src)), `${tag}: 인쇄본 그림 파일이 없다 — ${src}`);
    }
    assert(!/class="ws-cut-item"/.test(answerHtml), `${tag}: 정답지에는 오릴 카드 띠가 없어야 한다`);

    // 중: 빈칸은 학생용에서 비어 있고 정답지에서만 채워지며, 칸 이름은 연한 글자로 덧쓰게 그려진다.
    if (L.key === 'middle') {
      const sentence = trace.traceText ?? '';
      const blank = trace.traceBlank ?? '';
      const rows = traceRows(html);
      assert(rows.length === 2, `${tag}: 따라 쓰기 줄이 두 줄이 아니다 (${rows.length}줄)`);
      assert(unescapeHtml(stripTags(rows[0] ?? '')) === sentence, `${tag}: 첫 줄이 덧쓸 문장 그대로가 아니다`);
      assert(unescapeHtml(stripTags(rows[1] ?? '')) === sentence.replace(blank, ''), `${tag}: 둘째 줄은 문장에서 빈칸 낱말만 뺀 모습이어야 한다`);
      assert((html.match(/class="ws-gap"/g) ?? []).length === 1 && !/ws-gap is-answer/.test(html), `${tag}: 학생용 인쇄본에는 빈 칸 상자가 하나 있어야 하고 낱말이 적혀 있으면 안 된다`);
      const answerGap = answerHtml.match(/class="ws-gap is-answer"[^>]*>([^<]*)</);
      assert(answerGap && unescapeHtml(answerGap[1]) === blank, `${tag}: 정답지의 빈칸에 낱말 “${blank}”이(가) 적혀 있어야 한다`);
      assert(answerHtml.includes(`<mark>${blank}</mark>`), `${tag}: 교사용 안내에 빈칸 낱말 “${blank}”이(가) 표시되어 있어야 한다`);
      const tracedZones = (html.match(/<b class="is-trace">/g) ?? []).length;
      assert(tracedZones === sort.zones.length, `${tag}: 덧쓰는 칸 이름이 ${tracedZones}개로 칸 수(${sort.zones.length})와 다르다`);
    } else {
      assert(!/class="ws-gap|class="is-trace"/.test(html), `${tag}: 하 수준 인쇄본에 중 수준의 빈칸·덧쓰기 모양이 섞여 있다`);
    }
  }

  // 8. 하와 중은 같은 카드·물음·정답을 쓴다
  assert(answerSignature(worksheet.variants.low) === answerSignature(worksheet.variants.middle), `${id}: 하와 중의 카드·물음·정답이 서로 다르다`);
}

// 7. 저장본 갈아 끼우기
for (const L of Object.values(LEVELS)) {
  try {
    const base = mod.buildLessonWorksheet('m1-l1');
    const other = L.key === 'low' ? 'middle' : 'low';
    const oldDraft = {
      lessonTitle: '옛 제목',
      variants: {
        [L.key]: {
          level: L.key, label: L.name, subtitle: base.variants[L.key].subtitle,
          blocks: [{ id: `starter-${L.key}-choice`, kind: 'multiple-choice', title: '1. 알맞은 답 찾기', options: ['가', '나'] }],
        },
      },
    };
    const merged = mod.mergeWorksheetDraft(base, oldDraft);
    assert(merged.variants[L.key].template === mod.PICTURE_TEMPLATE, `옛 구성의 ${L.name} 수준 저장본이 새 구성으로 바뀌지 않았다`);
    assert(merged.variants[L.key].blocks.some((block) => block.kind === 'picture-choice'), `옛 ${L.name} 수준 저장본을 갈아 끼운 뒤에도 그림 고르기가 없다`);
    assert(merged.lessonTitle === '옛 제목', '교사가 고친 제목은 저장본에서 이어져야 한다');

    const edited = structuredClone(base);
    edited.variants[L.key].blocks[0].instruction = '선생님이 고친 물음';
    edited.variants[L.key].pages = [{ id: `${L.prefix}-page-1`, blocks: edited.variants[L.key].blocks }];
    const kept = mod.mergeWorksheetDraft(mod.buildLessonWorksheet('m1-l1'), JSON.parse(JSON.stringify(edited)));
    assert(kept.variants[L.key].blocks[0].instruction === '선생님이 고친 물음', `새 구성에서 교사가 고친 ${L.name} 수준 편집본이 갈아 끼워져 버렸다`);

    // 한 수준의 옛 저장본이 다른 수준의 새 편집본을 휩쓸지 않는다.
    const mixed = mod.mergeWorksheetDraft(mod.buildLessonWorksheet('m1-l1'), JSON.parse(JSON.stringify({
      variants: { ...oldDraft.variants, [other]: edited.variants[other] },
    })));
    assert(mixed.variants[L.key].template === mod.PICTURE_TEMPLATE, `${L.name} 수준 옛 저장본과 ${LEVELS[other].name} 수준 새 저장본이 함께 있을 때 ${L.name} 수준이 새 구성으로 바뀌지 않았다`);
    assert(JSON.stringify(mixed.variants[other].pages) === JSON.stringify(edited.variants[other].pages), `${L.name} 수준 저장본을 갈아 끼우다 ${LEVELS[other].name} 수준 저장본이 바뀌었다`);

    const highKept = mod.mergeWorksheetDraft(base, { variants: { high: { ...base.variants.high, subtitle: '내가 바꾼 부제' } } });
    assert(highKept.variants.high.subtitle === '내가 바꾼 부제', `상 수준 저장본이 ${L.name} 수준 갈아 끼우기에 휩쓸렸다`);
  } catch (error) {
    failures.push(`${L.name} 수준 저장본 갈아 끼우기 시험을 하지 못했다 — ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error('Picture worksheet contract failed:');
  for (const failure of failures.slice(0, 80)) console.error(`- ${failure}`);
  if (failures.length > 80) console.error(`... 외 ${failures.length - 80}건`);
  process.exit(1);
}

const summary = Object.values(LEVELS).map((L) => {
  const stat = stats[L.key];
  const trace = L.key === 'middle' ? `, smallest trace ${stat.minTrace}mm` : '';
  return `${L.name}: ${stat.cards} cards (${stat.picture} picture files, ${stat.emoji} emoji), most text on one page ${stat.maxVisible} chars${trace}`;
}).join(' | ');
console.log(`Picture worksheet contract passed: ${lessonIds.length} lessons × 2 levels — ${summary}.`);
