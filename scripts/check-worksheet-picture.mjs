/**
 * 그림 카드 학습지(하·중 수준) 계약.
 *
 * 교사 도구의 A4 학습지 가운데 하(오리고 찾아요)와 중(덧쓰고 붙여요)은 글을 많이 읽지 않아도 그림과 손으로
 * 끝낼 수 있어야 한다. 예전에는 선택지 문장(30~60자)을 그대로 보기로 싣고, 60자짜리 문장을 "낱말"이라며 따라 쓰게 하고,
 * 세 칸짜리 글자 카드(높이 11mm, 글자 13px)를 오려 붙이게 했다. 또 맞아요·아니에요 칸에 세 장을 가르게 했는데, 그림이
 * 추상적이고 물음에 정보가 적어 글을 읽어도 가르기 어려웠다. 그 모습으로 돌아가지 않게 지킨다.
 *
 * 두 수준이 함께 지키는 것
 *  1. 완전성: 62개 스튜디오와 6개 단원 마무리 모두에 구성이 있고, 구성이 가리키는 선택지가 실제로 있다.
 *  2. 두 장: 앞면(붙이기·고르기와 쓰기)과 뒷면(붙이기)이고, 카드는 모두 그림(그림 카드 파일 또는 이모지)이며
 *     그림 파일이 실제로 있다. 한 쪽에 보이는 글자는 정해 둔 양을 넘지 않는다.
 *  3. 크기: 오리는 카드는 한 변 48mm 이상이다(오려 붙이기가 작아서 어려웠다는 지적).
 *  4. 글자: 카드 글자는 열두 글자 이내이고, 그림 카드 판의 카드는 그림에 인쇄된 낱말과 같다.
 *  5. 붙이기: 오릴 카드는 붙일 카드뿐이다. 붙일 카드는 `pictureWorksheets.ts`가 알맞다고 정한 카드(`right`, 순서·분류 칸이
 *     정해진 카드)와 정확히 같고, 알맞지 않은 카드·맞아요/아니에요 칸·고르는 동그라미가 뒷면에 없다. 정해진 답이 없는
 *     열린 선택만 카드 세 장 가운데 마음에 드는 한 장을 빈 자리에 붙인다(어느 카드든 알맞다).
 *  6. 정답지: 카드마다 교사가 읽어 줄 문장이 있고, 정답지는 쪽을 하나 더 낸다(교사용 안내, 이 쪽도 A4 한 장 안).
 *  7. 인쇄: 인쇄본의 그림이 모두 사이트 안의 파일이다.
 *  8. 저장본: 옛 구성으로 저장해 둔 편집본은 그 수준만 새 구성으로 갈아 끼워지고, 새 구성의 편집본은 그대로 남는다.
 *
 * 하 — 무오류 학습이 바탕이다. 틀릴 수 있는 활동(여러 카드 중 고르기, 맞아요·아니에요 분류)이 없다.
 *  - 앞면 `1 붙여요`(알맞은 첫 생각 카드를 흐린 그림 위에 붙이기)와 `2 따라 써요`(핵심 낱말을 큰 글자 위에 덧쓰기, 둘째 줄도
 *    더 연한 글자 위에 덧쓰기), 뒷면 `3 붙여요`(알맞은 적용 카드를 흐린 그림 위에 붙이기).
 *  - 카드마다 똑같은 그림의 흐린 자리가 하나씩 있고, 오릴 카드는 그 바로 아래 같은 순서로 놓인다.
 * 중 — 하의 한 단계 위. 본보기가 그림에서 글자로 바뀌고 판단은 앞면에 있다.
 *  - 앞면 `1 골라요`(알맞은 카드에 ○)와 `2 덧써요`(핵심 문장을 덧쓰고 핵심 낱말만 빈칸에 직접 쓰기),
 *    뒷면 `3 붙여요`(자리마다 카드에 쓰인 낱말이 연한 글자로 있어 덧쓰고, 같은 낱말의 카드를 찾아 붙이기).
 *  - 오릴 카드는 순서가 섞여 있어 낱말을 읽어야 짝을 찾는다.
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
  export { choiceCardSize, pasteCardSize, pasteCutOrder, textUnits, traceFontSize } from './src/features/teacher/worksheet/pictureBlocks';
  export { PICTURE_TEMPLATES, situationNote } from './src/features/teacher/worksheet/pictureLevels';
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
/** 오릴 카드가 흐린 자리와 어긋나지 않게 놓이는 쪽(그림 단서)과 섞여 놓이는 쪽(낱말 단서)을 가르는 값. */
const CUES = { low: 'picture', middle: 'word' };

const nonSpace = (text) => [...String(text ?? '').replace(/\s/g, '')].length;
const publicFile = (src) => {
  const trimmed = src.replace(/^\/AITEXTBOOKforSTUDENTS\//, '');
  return path.join('public', trimmed);
};
const stripTags = (html) => html.replace(/<[^>]+>/g, '');
const stripStyle = (html) => html.replace(/<style>[\s\S]*?<\/style>/g, '');
const unescapeHtml = (text) => text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const traceRows = (html) => [...html.matchAll(/<div class="ws-trace-row">([\s\S]*?)<\/div>/g)].map((match) => match[1]);
const pageCount = (value) => (value.match(/<main class="worksheet-page"/g) ?? []).length;
const count = (html, pattern) => (html.match(pattern) ?? []).length;
/** 오릴 카드 띠의 카드 글자를 늘어놓은 순서대로 읽는다. */
const cutLabels = (html) => html.split('class="ws-cut-item"').slice(1).map((chunk) => {
  // 그림 카드 판의 카드는 그림의 alt에, 이모지 카드는 글자 띠에 글자가 있다. 이 카드 안에서 먼저 나오는 쪽을 읽는다.
  const alt = /alt="([^"]+)"/.exec(chunk);
  const label = /class="ws-label[^"]*">([^<]+)</.exec(chunk);
  const found = alt && label ? (alt.index < label.index ? alt : label) : alt ?? label;
  return unescapeHtml(found?.[1] ?? '');
});
const cueLabels = (html) => [...html.matchAll(/class="ws-cue">([^<]*)</g)].map((match) => unescapeHtml(match[1]));

/** 구성이 알맞다고 정한 첫 생각 카드의 id. */
function expectedFirst(spec) {
  const list = spec.first;
  if (list.cards) return list.cards.filter((card) => card.right).map((card) => card.id);
  return list.right ?? [];
}
/** 구성이 알맞다고 정한 적용 카드의 id. 칸이 정해진 목록(순서·분류)은 모든 카드가 제 자리에서 알맞다. */
function expectedSecond(spec) {
  const list = spec.transfer;
  if (list.zones) return list.cards ? list.cards.map((card) => card.id) : Object.keys(list.place ?? {});
  if (list.cards) return list.cards.filter((card) => card.zone === 'yes').map((card) => card.id);
  return list.right ?? [];
}

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
  low: { cards: 0, picture: 0, emoji: 0, maxVisible: 0, paste: { 1: 0, 2: 0, 3: 0 }, open: 0 },
  middle: { cards: 0, picture: 0, emoji: 0, maxVisible: 0, minTrace: Infinity, paste: { 1: 0, 2: 0, 3: 0 }, open: 0 },
};

/** 카드 한 장의 그림·글자·인쇄 글자 일치를 본다. */
function checkCard(tag, card, stat) {
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

/** 쪽마다 보이는 글자 양을 센다(중은 둘째 줄에 빈칸만 비운 같은 문장이, 낱말 단서는 카드 글자가 자리 위에 한 번 더 나온다). */
function checkVisible(tag, pages, stat) {
  pages.forEach((page, pageIndex) => {
    let visible = 0;
    for (const block of page.blocks) {
      visible += nonSpace(block.title) + nonSpace(block.text) + nonSpace(block.instruction) + nonSpace(block.traceText);
      if (block.kind === 'word-trace' && block.traceBlank) visible += nonSpace(block.traceText) - nonSpace(block.traceBlank);
      if (block.kind === 'word-trace' && block.traceRepeat) visible += nonSpace(block.traceText);
      for (const card of block.pictureCards ?? []) {
        if (!card.printed) visible += nonSpace(card.label);
        if (block.kind === 'picture-paste' && block.pasteCue === 'word' && !block.blankSlots) visible += nonSpace(card.label);
        visible += nonSpace(card.slotLabel);
      }
      for (const zone of block.zones ?? []) visible += nonSpace(zone.label);
    }
    stat.maxVisible = Math.max(stat.maxVisible, visible);
    assert(visible <= MAX_VISIBLE_CHARS_PER_PAGE, `${tag}: ${pageIndex + 1}쪽에 보이는 글자가 ${visible}자로 ${MAX_VISIBLE_CHARS_PER_PAGE}자를 넘는다`);
  });
}

/** 인쇄본의 그림 주소가 모두 사이트 안의 파일인지 본다. */
function checkPrintImages(tag, html) {
  const images = [...html.matchAll(/<img[^>]*?\ssrc="([^"]+)"/g)].map((match) => match[1]);
  for (const src of images) {
    assert(src.startsWith('/AITEXTBOOKforSTUDENTS/'), `${tag}: 인쇄본 그림 주소가 사이트 안의 경로가 아니다 — ${src}`);
    assert(fs.existsSync(publicFile(src)), `${tag}: 인쇄본 그림 파일이 없다 — ${src}`);
  }
}

/**
 * 붙이기 칸 하나(하의 앞·뒷면, 중의 뒷면)의 계약. 붙일 카드는 구성이 알맞다고 정한 카드와 정확히 같다.
 * `expectedIds`가 비어 있으면 정해진 답이 없는 열린 선택이라 빈 자리 하나에 카드 세 장을 둔다.
 */
function checkPasteBlock(tag, level, block, number, where, expectedIds, stat, compactWanted) {
  const cards = block.pictureCards ?? [];
  assert(block.kind === 'picture-paste', `${tag}: ${where}는 붙이기(picture-paste)여야 한다`);
  assert(block.title?.startsWith(`${number}.`), `${tag}: ${where} 붙이기 제목이 “${number}.”로 시작하지 않는다`);
  assert(Boolean(block.text) && HAEYO.test(block.text), `${tag}: ${where} 머리줄 안내는 해요체로 끝나야 한다 — ${block.text}`);
  cards.forEach((card) => checkCard(tag, card, stat));
  for (const card of cards) {
    assert(Boolean(card.say?.trim()), `${tag}: 카드 ${card.id}에 교사가 읽어 줄 문장이 없다`);
    assert(card.suitable === undefined && card.zone === undefined, `${tag}: 카드 ${card.id}에 알맞다·아니다 표시(suitable·zone)가 남아 있다`);
  }
  assert(!block.zones || block.zones.length === 0, `${tag}: ${where}에 분류 칸(zones)이 있다`);
  const cue = CUES[level];
  if (expectedIds.length > 0) assert((block.pasteCue === 'word' ? 'word' : 'picture') === cue, `${tag}: ${where} 자리 단서(pasteCue)가 ${cue}이어야 한다`);
  const size = mod.pasteCardSize(cards.length, block.cardSize, block.compact, block.pasteCue === 'word' ? 'word' : 'picture');
  assert(size >= MIN_CARD_MM, `${tag}: ${where} 붙이기 카드가 ${size}mm로 ${MIN_CARD_MM}mm보다 작다`);
  assert(Boolean(block.compact) === compactWanted, `${tag}: ${where} 붙이기의 compact 값이 ${compactWanted}이어야 한다(앞면은 쓰기 칸과 한 쪽을 나눈다)`);
  if (expectedIds.length === 0) {
    stat.open += 1;
    assert(block.blankSlots === 1 && cards.length === 3, `${tag}: ${where} 열린 붙이기는 빈 자리 하나와 카드 세 장이어야 한다 (자리 ${block.blankSlots}, 카드 ${cards.length}장)`);
    return;
  }
  stat.paste[cards.length] = (stat.paste[cards.length] ?? 0) + 1;
  assert(!block.blankSlots, `${tag}: ${where}에 알맞은 카드가 정해져 있는데 빈 자리가 있다`);
  assert(cards.length >= 1 && cards.length <= 3, `${tag}: ${where} 붙일 카드는 한~세 장이어야 한다 (지금 ${cards.length}장)`);
  // 붙일 카드는 모두 구성이 알맞다고 정한 카드이고, 정한 카드가 빠짐없이 올라 있다. 알맞지 않은 카드는 한 장도 올리지 않는다.
  const ids = cards.map((card) => card.id);
  assert(ids.length === expectedIds.length && expectedIds.every((expected) => ids.includes(expected)) && ids.every((cardId) => expectedIds.includes(cardId)),
    `${tag}: ${where} 붙일 카드(${ids.join(',')})가 구성이 알맞다고 정한 카드(${expectedIds.join(',')})와 다르다`);
  assert(!/\?/.test(block.instruction ?? ''), `${tag}: ${where} 상황 글에 물음이 남아 있다 — ${block.instruction}`);
  assert(cards.every((card) => !card.slotLabel) || cards.every((card) => card.slotLabel), `${tag}: ${where} 자리 이름이 일부 카드에만 있다`);
}

// ── 하 ─────────────────────────────────────────────────────────────────────────
function checkLow(id, worksheet, spec) {
  const L = LEVELS.low;
  const tag = `${id} ${L.name} 수준`;
  const stat = stats.low;
  const variant = worksheet.variants.low;
  assert(variant.template === mod.PICTURE_TEMPLATES.low, `${tag}: 구성에 판 표시(${mod.PICTURE_TEMPLATES.low})가 없다`);
  const pages = variant.pages ?? [];
  assert(pages.length === 2, `${tag}: 두 장(앞면·붙이기 면)이어야 한다 (지금 ${pages.length}장)`);
  assert(pages[0]?.id === 'low-page-1' && pages[1]?.id === 'low-page-2', `${tag}: 쪽 id가 low-page-1·low-page-2가 아니다`);
  assert(pages[0]?.blocks.map((block) => block.kind).join() === 'picture-paste,word-trace', `${tag}: 앞면은 붙이기와 따라 쓰기여야 한다`);
  assert(pages[1]?.blocks.map((block) => block.kind).join() === 'picture-paste', `${tag}: 뒷면은 붙이기여야 한다`);
  const blocks = pages.flatMap((page) => page.blocks);
  const [first, trace, second] = blocks;
  if (!first || !trace || !second) return;
  assert(first.id === 'low-first' && trace.id === 'low-trace' && second.id === 'low-second', `${tag}: 칸 id가 low-first·low-trace·low-second가 아니다`);

  // 틀릴 수 있는 활동이 없다: 고르기·분류 칸과 옛 글자 위주 칸이 하 수준에 남아 있지 않다.
  for (const block of blocks) {
    assert(!['picture-choice', 'picture-sort', 'multiple-choice', 'cut-paste', 'trace'].includes(block.kind), `${tag}: 틀릴 수 있는 활동이나 글자 위주 칸(${block.kind})이 남아 있다`);
  }
  checkPasteBlock(tag, 'low', first, '1', '앞면', expectedFirst(spec), stat, true);
  checkPasteBlock(tag, 'low', second, '3', '뒷면', expectedSecond(spec), stat, false);

  // 따라 쓰기(하): 낱말 하나를 큰 글자로, 둘째 줄도 더 연한 글자로 덧쓴다(비워 둔 줄이 없다).
  const wordCard = trace.pictureCards?.[0];
  assert(Boolean(wordCard), `${tag}: 따라 쓸 낱말에 그림이 없다`);
  if (wordCard) checkCard(tag, wordCard, stat);
  assert(nonSpace(trace.traceText) >= 1 && nonSpace(trace.traceText) <= MAX_WORD, `${tag}: 따라 쓸 낱말 “${trace.traceText}”는 1~${MAX_WORD}자여야 한다`);
  if (wordCard?.printed) assert(wordCard.label === trace.traceText, `${tag}: 따라 쓸 낱말 “${trace.traceText}”가 그림 카드 글자 “${wordCard.label}”와 다르다`);
  assert(!trace.traceBlank, `${tag}: 하 수준에는 빈칸이 없어야 한다`);
  assert(trace.traceRepeat === true, `${tag}: 하 수준은 따라 쓰기 둘째 줄도 연한 글자로 덧쓰게 해야 한다 (traceRepeat)`);

  checkVisible(tag, pages, stat);
  assert(mod.worksheetHasAnswers(variant), `${tag}: 정답지로 낼 내용이 없다`);

  // 인쇄본: 오릴 카드는 붙일 카드뿐이고 흐린 자리가 카드마다 하나씩 있다.
  const html = mod.buildWorksheetHtml(worksheet, variant);
  const answerHtml = mod.buildWorksheetHtml(worksheet, variant, { answers: true });
  assert(pageCount(html) === 2, `${tag}: 인쇄본이 두 쪽이 아니다 (${pageCount(html)}쪽)`);
  assert(pageCount(answerHtml) === 3, `${tag}: 정답지가 세 쪽(학생용 두 쪽 + 교사용 안내)이 아니다 (${pageCount(answerHtml)}쪽)`);
  const body = stripStyle(html);
  const expectedGhosts = [first, second].reduce((sum, block) => sum + (block.blankSlots ? 0 : block.pictureCards.length), 0);
  const expectedCut = [first, second].reduce((sum, block) => sum + block.pictureCards.length, 0);
  assert(count(body, /class="ws-slot is-ghost"/g) === expectedGhosts, `${tag}: 흐린 그림 자리가 ${count(body, /class="ws-slot is-ghost"/g)}개로 붙일 카드 수(${expectedGhosts})와 다르다`);
  assert(count(body, /class="ws-cut-item"/g) === expectedCut, `${tag}: 오릴 카드가 ${count(body, /class="ws-cut-item"/g)}장으로 붙일 카드 수(${expectedCut})와 다르다`);
  assert(count(body, /class="ws-cue"/g) === 0, `${tag}: 하 수준 인쇄본에 낱말 단서(ws-cue)가 섞여 있다`);
  // 무오류: 고르기·분류에 쓰는 모양과 글자가 학생용 인쇄본에 한 곳도 없다.
  assert(!/ws-circle|ws-choice|ws-mark|ws-zone"|ws-zone-head|맞아요|아니에요|알맞은 그림|✕/.test(body), `${tag}: 학생용 인쇄본에 고르기·맞아요/아니에요 분류의 흔적이 있다`);
  assert(count(body, /class="ws-slot-cap"/g) === [first, second].reduce((sum, block) => sum + (block.blankSlots ?? block.pictureCards.filter((card) => card.slotLabel).length), 0), `${tag}: 자리 이름이 카드의 slotLabel과 맞지 않는다`);
  // 오릴 카드는 흐린 자리와 같은 순서로 놓인다(그림 단서).
  const labels = [first, second].flatMap((block) => block.pictureCards).map((card) => card.label);
  assert(JSON.stringify(cutLabels(body)) === JSON.stringify(labels), `${tag}: 오릴 카드가 흐린 자리와 같은 순서로 놓여 있지 않다`);
  // 따라 쓰기 두 줄: 같은 글자이고 둘째 줄이 더 연하다.
  const rows = traceRows(body);
  assert(rows.length === 2 && unescapeHtml(stripTags(rows[0])) === trace.traceText && unescapeHtml(stripTags(rows[1])) === trace.traceText && /class="is-fade"/.test(rows[1]), `${tag}: 따라 쓰기 두 줄이 같은 낱말의 진한 글자와 연한 글자가 아니다`);
  const sceneCount = count(body, /<figure class="ws-scene">/g);
  assert(sceneCount === 2, `${tag}: 쪽마다 장면 그림이 하나씩 있어야 한다 (지금 ${sceneCount}장)`);
  checkPrintImages(tag, html);
  // 정답지: 흐린 자리에 진짜 카드가 붙은 모습이고 오릴 카드 띠가 없다. 교사용 안내에 카드마다 읽어 줄 문장이 있다.
  assert(!/class="ws-cut-item"/.test(answerHtml), `${tag}: 정답지에는 오릴 카드 띠가 없어야 한다`);
  assert(!/class="ws-slot is-ghost"/.test(stripStyle(answerHtml)), `${tag}: 정답지에는 흐린 자리가 없고 카드가 붙은 모습이어야 한다`);
  const notes = answerHtml.slice(answerHtml.indexOf('data-page="notes"'));
  assert(count(notes, /class="ws-note"/g) === expectedCut, `${tag}: 교사용 안내의 카드 줄이 ${count(notes, /class="ws-note"/g)}개로 카드 수(${expectedCut})와 다르다`);
}

// ── 중 ─────────────────────────────────────────────────────────────────────────
function checkMiddle(id, worksheet, spec) {
  const L = LEVELS.middle;
  const tag = `${id} ${L.name} 수준`;
  const stat = stats.middle;
  const variant = worksheet.variants.middle;
  assert(variant.template === mod.PICTURE_TEMPLATES.middle, `${tag}: 구성에 판 표시(${mod.PICTURE_TEMPLATES.middle})가 없다`);
  const pages = variant.pages ?? [];
  assert(pages.length === 2, `${tag}: 두 장(앞면·붙이기 면)이어야 한다 (지금 ${pages.length}장)`);
  assert(pages[0]?.id === `${L.prefix}-page-1` && pages[1]?.id === `${L.prefix}-page-2`, `${tag}: 쪽 id가 ${L.prefix}-page-1·${L.prefix}-page-2가 아니다`);
  const blocks = pages.flatMap((page) => page.blocks);
  const [choose, trace, second] = blocks;
  if (!choose || !trace || !second) return;
  assert(pages[0]?.blocks.map((block) => block.kind).join() === 'picture-choice,word-trace', `${tag}: 앞면은 고르기와 쓰기여야 한다`);
  assert(pages[1]?.blocks.map((block) => block.kind).join() === 'picture-paste', `${tag}: 뒷면은 붙이기여야 한다`);
  assert(choose.id === `${L.prefix}-choose` && trace.id === `${L.prefix}-trace` && second.id === `${L.prefix}-second`, `${tag}: 칸 id가 ${L.prefix}-choose·trace·second가 아니다`);

  // 옛 글자 위주 칸과 맞아요/아니에요 분류 칸이 남아 있지 않다.
  for (const block of blocks) {
    assert(!['multiple-choice', 'cut-paste', 'trace', 'picture-sort'].includes(block.kind), `${tag}: 글자 위주 칸이나 맞아요/아니에요 분류 칸(${block.kind})이 남아 있다`);
  }

  // 앞면: 고르기
  assert((choose.pictureCards ?? []).length === 3, `${tag}: 고르기 카드는 세 장이어야 한다 (지금 ${(choose.pictureCards ?? []).length}장)`);
  (choose.pictureCards ?? []).forEach((card) => checkCard(tag, card, stat));
  for (const card of choose.pictureCards ?? []) assert(Boolean(card.say?.trim()), `${tag}: 카드 ${card.id}에 교사가 읽어 줄 문장이 없다`);
  const rightFirst = (choose.pictureCards ?? []).filter((card) => card.suitable === true).map((card) => card.id);
  const wantFirst = expectedFirst(spec);
  assert(rightFirst.length === wantFirst.length && wantFirst.every((expected) => rightFirst.includes(expected)), `${tag}: 고르기의 알맞은 카드(${rightFirst.join(',')})가 구성(${wantFirst.join(',')})과 다르다`);
  if (rightFirst.length > 0) assert((choose.pictureCards ?? []).every((card) => typeof card.suitable === 'boolean'), `${tag}: 알맞은 카드를 정했으면 나머지는 알맞지 않다고 표시해야 한다`);
  const chooseSize = mod.choiceCardSize((choose.pictureCards ?? []).length, choose.cardSize);
  assert(chooseSize >= MIN_CARD_MM, `${tag}: 고르기 카드가 ${chooseSize}mm로 ${MIN_CARD_MM}mm보다 작다`);

  // 앞면: 덧쓰기와 빈칸
  const wordCard = trace.pictureCards?.[0];
  assert(Boolean(wordCard), `${tag}: 쓸 낱말에 그림이 없다`);
  if (wordCard) checkCard(tag, wordCard, stat);
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
  assert(!trace.traceRepeat, `${tag}: 빈칸이 있는 덧쓰기에는 연한 글자 반복(traceRepeat)이 없다`);
  const askText = choose.instruction;
  assert(Boolean(askText) && [...askText].length <= MAX_ASK && HAEYO.test(askText), `${tag}: 1. 물음은 해요체로 끝나는 ${MAX_ASK}자 이내여야 한다 — ${askText}`);

  // 뒷면: 낱말 단서 붙이기
  checkPasteBlock(tag, 'middle', second, '3', '뒷면', expectedSecond(spec), stat, false);

  checkVisible(tag, pages, stat);
  assert(mod.worksheetHasAnswers(variant), `${tag}: 정답지로 낼 내용이 없다`);

  // 인쇄
  const html = mod.buildWorksheetHtml(worksheet, variant);
  const answerHtml = mod.buildWorksheetHtml(worksheet, variant, { answers: true });
  assert(pageCount(html) === 2, `${tag}: 인쇄본이 두 쪽이 아니다 (${pageCount(html)}쪽)`);
  assert(pageCount(answerHtml) === 3, `${tag}: 정답지가 세 쪽(학생용 두 쪽 + 교사용 안내)이 아니다 (${pageCount(answerHtml)}쪽)`);
  const body = stripStyle(html);
  // 카드는 그림 파일(img)이거나 이모지다. 둘 다 .ws-card로 그려지므로 카드 수로 센다(고르기 3 + 쓰기 1 + 오릴 카드).
  const cutCount = second.pictureCards.length;
  assert(count(body, /class="ws-card[ "]/g) >= 4 + cutCount, `${tag}: 인쇄본의 그림 카드가 ${count(body, /class="ws-card[ "]/g)}장뿐이다`);
  const sceneCount = count(body, /<figure class="ws-scene">/g);
  assert(sceneCount === 2, `${tag}: 쪽마다 장면 그림이 하나씩 있어야 한다 (지금 ${sceneCount}장)`);
  checkPrintImages(tag, html);
  assert(!/class="ws-cut-item"/.test(answerHtml), `${tag}: 정답지에는 오릴 카드 띠가 없어야 한다`);

  // 빈칸은 학생용에서 비어 있고 정답지에서만 채워진다.
  const rows = traceRows(body);
  assert(rows.length === 2, `${tag}: 따라 쓰기 줄이 두 줄이 아니다 (${rows.length}줄)`);
  assert(unescapeHtml(stripTags(rows[0] ?? '')) === sentence, `${tag}: 첫 줄이 덧쓸 문장 그대로가 아니다`);
  assert(unescapeHtml(stripTags(rows[1] ?? '')) === sentence.replace(blank, ''), `${tag}: 둘째 줄은 문장에서 빈칸 낱말만 뺀 모습이어야 한다`);
  assert(count(body, /class="ws-gap"/g) === 1 && !/ws-gap is-answer/.test(body), `${tag}: 학생용 인쇄본에는 빈 칸 상자가 하나 있어야 하고 낱말이 적혀 있으면 안 된다`);
  const answerGap = answerHtml.match(/class="ws-gap is-answer"[^>]*>([^<]*)</);
  assert(answerGap && unescapeHtml(answerGap[1]) === blank, `${tag}: 정답지의 빈칸에 낱말 “${blank}”이(가) 적혀 있어야 한다`);
  assert(answerHtml.includes(`<mark>${blank}</mark>`), `${tag}: 교사용 안내에 빈칸 낱말 “${blank}”이(가) 표시되어 있어야 한다`);

  // 뒷면: 자리마다 카드 글자가 연한 글자로 있고(덧쓰기), 같은 낱말의 카드를 찾아 붙인다. 오릴 카드는 순서가 섞여 있다.
  const secondCards = second.pictureCards;
  if (second.blankSlots) {
    assert(count(body, /class="ws-cue"/g) === 0, `${tag}: 열린 선택에는 낱말 단서가 없어야 한다`);
    assert(count(body, /class="ws-cut-item"/g) === 3, `${tag}: 열린 선택의 오릴 카드는 세 장이어야 한다`);
  } else {
    const cues = cueLabels(body);
    assert(JSON.stringify(cues) === JSON.stringify(secondCards.map((card) => card.label)), `${tag}: 자리 위의 연한 낱말(${cues.join(',')})이 카드 글자(${secondCards.map((card) => card.label).join(',')})와 다르다`);
    const cuts = cutLabels(body).slice(-secondCards.length);
    assert(JSON.stringify([...cuts].sort()) === JSON.stringify([...cues].sort()), `${tag}: 오릴 카드(${cuts.join(',')})가 자리의 낱말(${cues.join(',')})과 짝이 맞지 않는다`);
    if (cues.length >= 2) assert(cuts.every((label, index) => label !== cues[index]), `${tag}: 낱말 단서에서 오릴 카드가 제 자리 아래에 그대로 놓여 있다(순서를 섞어야 한다)`);
    assert(count(body, /class="ws-slot is-ghost"/g) === 0, `${tag}: 중 수준 인쇄본에 하 수준의 흐린 그림 자리가 섞여 있다`);
  }
  // 맞아요/아니에요 분류의 흔적이 뒷면에 없다(앞면의 ○는 고르기라서 있다).
  const backPage = body.slice(body.lastIndexOf('<main class="worksheet-page"'));
  assert(!/ws-zone"|ws-zone-head|ws-mark|ws-circle|맞아요|아니에요|✕/.test(backPage), `${tag}: 뒷면에 맞아요/아니에요 분류의 흔적이 있다`);
  assert(!/class="is-trace"/.test(body), `${tag}: 칸 이름 덧쓰기(is-trace)는 분류 칸과 함께 없어졌다`);
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
  checkMiddle(id, worksheet, spec);
  checkLow(id, worksheet, spec);

  // 하와 중은 같은 답을 붙인다: 하의 앞면 카드는 중 고르기의 알맞은 카드이고, 뒷면 카드는 중과 같다.
  const lowBlocks = (worksheet.variants.low.pages ?? []).flatMap((page) => page.blocks);
  const middleBlocks = (worksheet.variants.middle.pages ?? []).flatMap((page) => page.blocks);
  const lowSecond = lowBlocks.find((block) => block.id === 'low-second');
  const middleSecond = middleBlocks.find((block) => block.id === 'mid-second');
  if (lowSecond && middleSecond) {
    assert(JSON.stringify(lowSecond.pictureCards.map((card) => card.id)) === JSON.stringify(middleSecond.pictureCards.map((card) => card.id)), `${id}: 하와 중의 뒷면 붙일 카드가 다르다`);
  }
}

// 8. 저장본 갈아 끼우기
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
    assert(merged.variants[L.key].template === mod.PICTURE_TEMPLATES[L.key], `옛 구성의 ${L.name} 수준 저장본이 새 구성으로 바뀌지 않았다`);
    assert(merged.variants[L.key].blocks.some((block) => block.kind === (L.key === 'low' ? 'picture-paste' : 'picture-choice')), `옛 ${L.name} 수준 저장본을 갈아 끼운 뒤에도 새 구성의 첫 칸이 없다`);
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
    assert(mixed.variants[L.key].template === mod.PICTURE_TEMPLATES[L.key], `${L.name} 수준 옛 저장본과 ${LEVELS[other].name} 수준 새 저장본이 함께 있을 때 ${L.name} 수준이 새 구성으로 바뀌지 않았다`);
    assert(JSON.stringify(mixed.variants[other].pages) === JSON.stringify(edited.variants[other].pages), `${L.name} 수준 저장본을 갈아 끼우다 ${LEVELS[other].name} 수준 저장본이 바뀌었다`);

    const highKept = mod.mergeWorksheetDraft(base, { variants: { high: { ...base.variants.high, subtitle: '내가 바꾼 부제' } } });
    assert(highKept.variants.high.subtitle === '내가 바꾼 부제', `상 수준 저장본이 ${L.name} 수준 갈아 끼우기에 휩쓸렸다`);
  } catch (error) {
    failures.push(`${L.name} 수준 저장본 갈아 끼우기 시험을 하지 못했다 — ${error.message}`);
  }
}

// 이전 판으로 저장된 편집본은 지금 판으로 바뀐다: 하 v1(고르기·분류)·v2(붙이기, 빈 둘째 줄), 중 v1(맞아요/아니에요 분류).
for (const [levelKey, oldTemplate, oldKinds] of [['low', 'picture-v1', ['picture-choice', 'picture-sort']], ['low', 'picture-v2', ['picture-paste']], ['middle', 'picture-v1', ['picture-choice', 'picture-sort']]]) {
  try {
    const base = mod.buildLessonWorksheet('m4-l9');
    const old = structuredClone(base.variants[levelKey]);
    old.template = oldTemplate;
    old.pages = [
      { id: `${levelKey}-page-1`, blocks: [{ id: 'old-1', kind: oldKinds[0], title: '1.', pictureCards: [] }, { id: 'old-trace', kind: 'word-trace', title: '2. 따라 써요', traceText: '낱말' }] },
      { id: `${levelKey}-page-2`, blocks: [{ id: 'old-2', kind: oldKinds[1] ?? oldKinds[0], title: '3.', zones: [{ id: 'yes', label: '맞아요', mark: 'o' }], pictureCards: [] }] },
    ];
    old.blocks = old.pages.flatMap((page) => page.blocks);
    const otherKey = levelKey === 'low' ? 'middle' : 'low';
    const merged = mod.mergeWorksheetDraft(base, JSON.parse(JSON.stringify({ variants: { [levelKey]: old, [otherKey]: base.variants[otherKey] } })));
    assert(merged.variants[levelKey].template === mod.PICTURE_TEMPLATES[levelKey], `이전 판(${oldTemplate})의 ${LEVELS[levelKey].name} 수준 저장본이 지금 판으로 바뀌지 않았다`);
    assert(!merged.variants[levelKey].blocks.some((block) => block.id.startsWith('old-')), `이전 판(${oldTemplate})의 ${LEVELS[levelKey].name} 수준 칸이 갈아 끼운 뒤에도 남아 있다`);
    assert(merged.variants[otherKey].template === mod.PICTURE_TEMPLATES[otherKey], `${LEVELS[levelKey].name} 수준의 이전 판을 갈아 끼우다 ${LEVELS[otherKey].name} 수준이 바뀌었다`);
  } catch (error) {
    failures.push(`이전 판(${levelKey} ${oldTemplate}) 저장본 시험을 하지 못했다 — ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error('Picture worksheet contract failed:');
  for (const failure of failures.slice(0, 80)) console.error(`- ${failure}`);
  if (failures.length > 80) console.error(`... 외 ${failures.length - 80}건`);
  process.exit(1);
}

const low = stats.low;
const middleStat = stats.middle;
console.log(
  `Picture worksheet contract passed: ${lessonIds.length} lessons × 2 levels — `
  + `하: ${low.cards} cards (${low.picture} picture files, ${low.emoji} emoji), paste blocks ${low.paste[1]}×1 card / ${low.paste[2]}×2 / ${low.paste[3]}×3, ${low.open} open, most text on one page ${low.maxVisible} chars | `
  + `중: ${middleStat.cards} cards (${middleStat.picture} picture files, ${middleStat.emoji} emoji), back-page paste blocks ${middleStat.paste[1]}×1 card / ${middleStat.paste[2]}×2 / ${middleStat.paste[3]}×3, ${middleStat.open} open, most text on one page ${middleStat.maxVisible} chars, smallest trace ${middleStat.minTrace}mm.`,
);
