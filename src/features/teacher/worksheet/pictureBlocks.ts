import type { WorksheetBlock, WorksheetBlockKind, WorksheetCard, WorksheetZone } from './types';

/**
 * 그림 위주 블록 — 하·중 수준 학습지의 고르기·따라 쓰기(하는 낱말, 중은 문장과 빈칸)·붙이기.
 *
 * 인쇄본(worksheetHtml.ts)과 화면 미리보기(WorksheetPanel.tsx)가 이 파일의 HTML과 CSS 한 벌을 함께 쓴다.
 * 미리보기와 인쇄본이 다르게 보이는 일을 막으려는 것이다. 크기는 모두 실제 mm로 적는다.
 * 미리보기는 이 조각을 `zoom`으로 줄여 보여 줄 뿐, 크기를 다시 계산하지 않는다.
 *
 * 카드 안쪽 글자는 카드 너비를 기준(cqw)으로 잡는다. 같은 카드가 고르기에서는 54mm, 따라 쓰기에서는 38mm로
 * 쓰이므로 글자 크기를 mm로 박아 두면 한쪽이 깨진다.
 */

export const PICTURE_BLOCK_KINDS: readonly WorksheetBlockKind[] = ['picture-choice', 'word-trace', 'picture-sort', 'picture-paste'];

export function isPictureBlock(block: Pick<WorksheetBlock, 'kind'>): boolean {
  return PICTURE_BLOCK_KINDS.includes(block.kind);
}

export interface PictureHtmlOptions {
  /** 정답지: 알맞은 카드를 채워 보여 준다. */
  answers?: boolean;
}

/**
 * 블록 안쪽 가로 길이(mm). A4 가로 210에서 좌우 여백 15씩, 블록 안쪽 여백(3.5)과 테두리(0.5)를 뺀 172에서
 * 1mm를 더 덜어 둔다. 카드를 한 줄에 꼭 맞게 채우면 소수점 오차로 마지막 한 장이 다음 줄로 넘어가
 * 쪽 높이가 두 배가 된다.
 */
const INNER_WIDTH = 171;
const ZONE_GAP = 4;
const ZONE_PAD = 2.5;
/** 칸 테두리(0.6mm)가 양쪽에 붙는 만큼. */
const ZONE_BORDER = 1.2;
const SLOT_GAP = 3;
const CUT_PAD = 1.9;
const MIN_CARD = 30;
const MAX_CARD = 80;

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function fmt(value: number): string {
  return String(Math.round(value * 10) / 10);
}

/**
 * 고르기 카드 한 변(mm). 한 줄에 n장이 들어가는 가장 큰 정사각형이되, 너무 커지지 않게 막는다.
 * 하·중 수준은 손가락으로 짚거나 동그라미를 치는 일이 많아 작아지면 안 된다.
 */
export function choiceCardSize(count: number, override?: number): number {
  if (override) return clampCardSize(override);
  const n = Math.max(1, count);
  const size = (INNER_WIDTH - 5 * (n - 1)) / n;
  return Math.max(MIN_CARD, Math.min(62, Math.floor(size)));
}

/**
 * 흐린 그림에 붙이기 카드 한 변(mm). 오리고 붙이는 손이 편하게 한 장이면 아주 크게, 둘·셋이면 한 줄에 들어가는 크기로 한다.
 * 쪽에 따라 쓰기 칸이 함께 놓이는 경우(`compact`)에는 쪽 높이를 지키는 선에서 줄인다. 어느 쪽이든 48mm 아래로는 내려가지 않는다.
 */
export function pasteCardSize(count: number, override?: number, compact = false, cue: 'picture' | 'word' = 'picture'): number {
  if (override) return clampCardSize(override);
  const n = Math.max(1, count);
  // 낱말 단서는 자리 위에 따라 쓸 낱말 줄(약 20mm)이 더 들어가므로 쪽 높이를 지키려고 카드를 조금 줄인다.
  const cap = compact
    ? (n === 1 ? 58 : n === 2 ? 50 : 48)
    : cue === 'word' ? (n === 1 ? 62 : n === 2 ? 56 : 52) : (n === 1 ? 68 : n === 2 ? 62 : 54);
  const bound = (INNER_WIDTH - SLOT_GAP * (n - 1)) / n;
  return Math.max(MIN_CARD, Math.min(cap, Math.floor(bound)));
}

/** 교사가 정한 카드 한 변(mm)은 너무 작거나 한 줄보다 커지지 않게 막는다. */
export function clampCardSize(value: number): number {
  return Math.max(MIN_CARD, Math.min(MAX_CARD, Math.round(value)));
}

/**
 * 붙이기 카드 한 변(mm). 칸이 나란히 놓이는 폭과 오려 둔 카드가 한 줄에 놓이는 폭을 모두 지킨다.
 * 칸 안의 빈자리와 오릴 카드는 같은 크기여야 붙였을 때 맞는다.
 */
export function sortCardSize(slotsPerZone: readonly number[], cardCount: number, override?: number): number {
  if (override) return clampCardSize(override);
  const zoneCount = Math.max(1, slotsPerZone.length);
  const slotTotal = slotsPerZone.reduce((sum, slots) => sum + slots, 0) || cardCount;
  const innerGaps = slotsPerZone.reduce((sum, slots) => sum + Math.max(0, slots - 1), 0);
  const zoneBound = (INNER_WIDTH - ZONE_GAP * (zoneCount - 1) - (ZONE_PAD * 2 + ZONE_BORDER) * zoneCount - SLOT_GAP * innerGaps) / Math.max(1, slotTotal);
  const stripBound = (INNER_WIDTH - SLOT_GAP * (cardCount - 1)) / Math.max(1, cardCount);
  return Math.max(MIN_CARD, Math.min(60, Math.floor(Math.min(zoneBound, stripBound))));
}

/** 카드 글자 길이에 따른 글자 크기 등급: 0 보통, 1 조금 작게, 2 작게. */
function labelGrade(label: string): number {
  const length = [...label.replace(/\s/g, '')].length;
  return length > 9 ? 2 : length > 7 ? 1 : 0;
}

/** 한 줄에 놓이는 카드들은 글자 크기를 가장 긴 글자에 맞춰 같게 한다. 한 줄 안에서 글자 크기가 들쭉날쭉하면 눈에 거슬린다. */
function rowGrade(cards: readonly WorksheetCard[]): number {
  return cards.reduce((grade, card) => (card.src && card.printed ? grade : Math.max(grade, labelGrade(card.label))), 0);
}

function cardHtml(card: WorksheetCard, grade = labelGrade(card.label)): string {
  const label = escapeHtml(card.label);
  if (card.src && card.printed) {
    return `<div class="ws-card"><img src="${escapeHtml(card.src)}" alt="${label}"></div>`;
  }
  const art = card.src
    ? `<img src="${escapeHtml(card.src)}" alt="">`
    : `<span aria-hidden="true">${escapeHtml(card.emoji ?? '⭐')}</span>`;
  const sizeClass = grade >= 2 ? ' is-longer' : grade === 1 ? ' is-long' : '';
  return `<div class="ws-card ws-card-art"><div class="ws-art">${art}</div><div class="ws-label${sizeClass}">${label}</div></div>`;
}

function headHtml(title: string | undefined, fallback: string, hint?: string): string {
  const text = (title ?? fallback).trim();
  const matched = /^(\d+)\s*[.．)]\s*(.+)$/.exec(text);
  const badge = matched ? `<span class="ws-badge">${escapeHtml(matched[1])}</span>` : '';
  const note = hint?.trim() ? `<span class="ws-hint">${escapeHtml(hint.trim())}</span>` : '';
  return `<div class="ws-head">${badge}<h2>${escapeHtml(matched ? matched[2] : text)}</h2>${note}</div>`;
}

function situationHtml(block: WorksheetBlock): string {
  const ask = block.instruction ? `<p class="ws-ask">${escapeHtml(block.instruction)}</p>` : '';
  const image = block.image?.src
    ? `<figure class="ws-scene"><img src="${escapeHtml(block.image.src)}" alt="${escapeHtml(block.image.alt)}">${block.image.caption ? `<figcaption>${escapeHtml(block.image.caption)}</figcaption>` : ''}</figure>`
    : '';
  if (!image && !ask) return '';
  return `<div class="ws-situation${image ? ' has-scene' : ''}">${image}${ask}</div>`;
}

function choiceHtml(block: WorksheetBlock, options: PictureHtmlOptions): string {
  const cards = block.pictureCards ?? [];
  const size = choiceCardSize(cards.length, block.cardSize);
  const grade = rowGrade(cards);
  const items = cards.map((card) => {
    const marked = options.answers && card.suitable;
    return `<div class="ws-choice">${cardHtml(card, grade)}<span class="ws-circle${marked ? ' is-answer' : ''}" aria-hidden="true"></span></div>`;
  }).join('');
  return `<div class="ws-box" style="--s:${fmt(size)}mm">${headHtml(block.title, '1. 골라요', block.text)}${situationHtml(block)}<div class="ws-choices">${items}</div></div>`;
}

/** 글자 수(공백은 0.35자)로 센 길이. */
export function textUnits(text: string): number {
  return [...text].reduce((sum, ch) => sum + (/\s/.test(ch) ? 0.35 : 1), 0);
}

/** 빈칸 상자의 가로(mm). 그 낱말을 손글씨로 쓸 만큼 넉넉히 잡는다. */
function gapWidth(blank: string, size: number): number {
  return Math.max(18, Math.min(110, textUnits(blank) * size * 1.08 + 4));
}

/**
 * 글꼴 크기(em)로 잰 글 길이. 한글은 한 칸(1em), 띄어쓰기와 마침표는 좁다. 글자마다 0.05em씩 벌려 쓰므로(letter-spacing)
 * 그 몫을 함께 센다. 어림값이라 실제보다 조금 길게 잡힌다.
 */
export function textEm(text: string): number {
  return [...text].reduce((sum, ch) => {
    if (/\s/.test(ch)) return sum + 0.33;
    if (/[.,!?·:;'"()]/.test(ch)) return sum + 0.4;
    if (/[0-9A-Za-z]/.test(ch)) return sum + 0.7;
    return sum + 1.05;
  }, 0);
}

/** 그림 카드 옆 따라 쓰기 줄 안쪽(약 125.5mm)에서 글꼴마다 다른 낱말 너비를 받을 4mm 남짓을 뺀 가로 길이(mm). */
const TRACE_ROW_MM = 121;

/**
 * 따라 쓸 글의 글자 크기(mm). 한 줄에 들어가게 줄이되 낱말은 크게(최대 20mm) 한다.
 *
 * 빈칸 줄(`blank`)은 빈칸 상자와 양옆 여백(3mm)까지 한 줄에 들어가야 하고 글 줄보다 길어지기 쉬워 그쪽을 기준으로 삼는다.
 * 모자라면 글자를 0.1mm씩 줄인다(그래도 6.6mm 밑으로는 내리지 않는다).
 */
export function traceFontSize(text: string, blank?: string): number {
  let size = Math.min(20, Math.floor((TRACE_ROW_MM / Math.max(2, textEm(text))) * 10) / 10);
  if (blank && text.includes(blank)) {
    const at = text.indexOf(blank);
    const rest = textEm(text.slice(0, at)) + textEm(text.slice(at + blank.length));
    while (size > 6.6 && rest * size + gapWidth(blank, size) + 3 > TRACE_ROW_MM) size = Math.round((size - 0.1) * 10) / 10;
  }
  return size;
}

/**
 * 문장 속 빈칸 줄: 낱말(`blank`)만 비우고 나머지는 연하게 보여 준다. 빈칸 상자 폭은 그 낱말을 손글씨로 쓸 만큼 넉넉히 잡는다.
 * 정답지에서는 상자 안에 낱말을 적어 보여 준다.
 */
function blankRowHtml(sentence: string, blank: string, size: number, answers: boolean | undefined): string {
  const at = sentence.indexOf(blank);
  const before = sentence.slice(0, at);
  const after = sentence.slice(at + blank.length);
  const width = gapWidth(blank, size);
  const part = (text: string) => (text ? `<span style="font-size:${fmt(size)}mm">${escapeHtml(text)}</span>` : '');
  const gap = `<span class="ws-gap${answers ? ' is-answer' : ''}" style="width:${fmt(width)}mm;font-size:${fmt(size)}mm">${answers ? escapeHtml(blank) : ''}</span>`;
  return `<div class="ws-trace-row">${part(before)}${gap}${part(after)}</div>`;
}

function traceHtml(block: WorksheetBlock, options: PictureHtmlOptions): string {
  const word = block.traceText ?? '';
  const card = block.pictureCards?.[0];
  const rows = Math.max(1, Math.min(4, block.lineCount ?? 2));
  const blank = block.traceBlank && word.includes(block.traceBlank) ? block.traceBlank : undefined;
  const size = traceFontSize(word, blank);
  const rowHtml = Array.from({ length: rows }, (_, index) => {
    if (index === 0) return `<div class="ws-trace-row"><span style="font-size:${fmt(size)}mm">${escapeHtml(word)}</span></div>`;
    if (index === 1 && blank) return blankRowHtml(word, blank, size, options.answers);
    // 같은 글자를 더 연하게 이어 보여 준다(본보기를 서서히 거두는 덧쓰기). 비워 둔 줄이 없어 쓰다 틀릴 일이 없다.
    if (block.traceRepeat && !blank) return `<div class="ws-trace-row"><span class="is-fade" style="font-size:${fmt(size)}mm">${escapeHtml(word)}</span></div>`;
    return '<div class="ws-trace-row"></div>';
  }).join('');
  const instruction = block.instruction ? `<p class="ws-ask ws-ask-small">${escapeHtml(block.instruction)}</p>` : '';
  return `<div class="ws-box">${headHtml(block.title, '2. 따라 써요', block.text)}${instruction}<div class="ws-trace">${card ? `<div class="ws-trace-pic">${cardHtml(card)}</div>` : ''}<div class="ws-trace-rows${blank ? ' is-sentence' : ''}">${rowHtml}</div></div></div>`;
}

function markHtml(zone: WorksheetZone): string {
  if (zone.card) return `<span class="ws-zone-card">${cardHtml(zone.card)}</span>`;
  if (zone.mark === 'o') return '<span class="ws-mark ws-mark-o" aria-hidden="true"></span>';
  if (zone.mark === 'x') return '<span class="ws-mark ws-mark-x" aria-hidden="true"></span>';
  return '';
}

/**
 * 칸마다 놓을 빈자리 수. 카드에 정해 둔 칸(zone)을 세고, 정해 둔 것이 하나도 없으면(정해진 답이 없는 열린 선택)
 * 칸마다 한 자리씩 둔다.
 */
export function slotCounts(zones: readonly WorksheetZone[], cards: readonly WorksheetCard[]): number[] {
  const counts = zones.map((zone) => cards.filter((card) => card.zone === zone.id).length);
  if (counts.some((count) => count > 0)) return counts.map((count) => Math.max(1, count));
  return zones.map(() => 1);
}

function sortHtml(block: WorksheetBlock, options: PictureHtmlOptions): string {
  const cards = block.pictureCards ?? [];
  const zones = block.zones ?? [];
  const counts = slotCounts(zones, cards);
  const size = sortCardSize(counts, cards.length, block.cardSize);
  const grade = rowGrade(cards);
  const zoneHtml = zones.map((zone, zoneIndex) => {
    const inZone = cards.filter((card) => card.zone === zone.id);
    const slots = Array.from({ length: counts[zoneIndex] }, (_, slotIndex) => {
      const filled = options.answers ? inZone[slotIndex] : undefined;
      return filled
        ? `<div class="ws-slot is-filled">${cardHtml(filled, grade)}</div>`
        : '<div class="ws-slot"><span>붙여요</span></div>';
    }).join('');
    const caption = `<b${block.traceZones ? ' class="is-trace"' : ''}>${escapeHtml(zone.label)}</b>`;
    return `<div class="ws-zone"><div class="ws-zone-head${zone.card ? ' has-card' : ''}">${markHtml(zone)}${caption}</div><div class="ws-slots">${slots}</div></div>`;
  }).join('');
  const cut = options.answers ? '' : cutStripHtml(cards, grade);
  const tag = options.answers ? '<span class="ws-answer-tag">정답지</span>' : '';
  return `<div class="ws-box" style="--s:${fmt(size)}mm">${headHtml(block.title, '3. 붙여요', block.text)}${tag}${situationHtml(block)}<div class="ws-zones">${zoneHtml}</div>${cut}</div>`;
}

/** 오릴 카드 띠. `alignEnd`면 오른쪽 끝에 붙여, 위의 오른쪽 흐린 자리 바로 아래에 오게 한다. */
function cutStripHtml(cards: readonly WorksheetCard[], grade: number, alignEnd = false): string {
  const items = cards.map((card) => `<div class="ws-cut-item">${cardHtml(card, grade)}</div>`).join('');
  return `<div class="ws-cut"><span class="ws-cut-head">✂ 점선을 따라 오려요</span><div class="ws-cut-cards${alignEnd ? ' is-end' : ''}">${items}</div></div>`;
}

/**
 * 오릴 카드를 늘어놓는 순서. 그림 단서는 카드를 자리와 같은 순서로 두어 흐린 그림 바로 아래 카드가 짝이 되게 한다(무오류).
 * 낱말 단서는 한 칸씩 돌려 어느 카드도 제 자리 바로 아래에 오지 않게 한다 — 낱말을 읽어야 짝을 찾는다.
 */
export function pasteCutOrder<T>(items: readonly T[], cue: 'picture' | 'word' = 'picture'): T[] {
  if (cue !== 'word' || items.length < 2) return [...items];
  return [...items.slice(1), items[0]];
}

/**
 * 붙이기(하·중 수준). 오릴 카드는 붙일 카드뿐이다 — 알맞지 않은 카드를 올리지 않고 맞다·아니다를 가르는 칸도 없다.
 * 붙일 자리가 보여 주는 단서가 수준마다 다르다.
 *  - 하(`pasteCue: 'picture'`) 틀릴 수 없는 활동: 카드가 붙을 자리에 그 카드와 똑같은 그림이 흐리게 그려져 있어
 *    같은 그림을 찾아 겹쳐 붙이기만 하면 된다. 오릴 카드는 자리와 같은 순서·같은 위치에 둔다.
 *  - 중(`pasteCue: 'word'`) 덧쓰고 붙이기: 자리 위에 카드에 쓰인 낱말이 연한 글자로 있어 덧쓰고, 같은 낱말의 카드를 찾아
 *    붙인다. 오릴 카드는 순서를 섞어 낱말을 읽고 짝을 찾게 한다.
 * 카드가 한 장이면 장면 옆에 큰 자리를 두고(상황 → 해야 할 일), 둘 이상이면 장면 아래에 자리를 한 줄로 놓는다.
 * 정답지에서는 자리에 진짜 카드가 붙은 모습을 보여 준다.
 */
function pasteHtml(block: WorksheetBlock, options: PictureHtmlOptions): string {
  const cards = block.pictureCards ?? [];
  const compact = Boolean(block.compact);
  const cue = block.pasteCue === 'word' ? 'word' : 'picture';
  const size = pasteCardSize(cards.length, block.cardSize, compact, cue);
  const grade = rowGrade(cards);
  const blankCount = Math.max(0, Math.min(2, Math.round(block.blankSlots ?? 0)));
  const slotCount = blankCount > 0 ? blankCount : cards.length;
  const blankCell = '<div class="ws-paste-cell"><b class="ws-slot-cap">내가 고른 카드</b><div class="ws-slot"><span>붙여요</span></div></div>';
  const cell = (card: WorksheetCard): string => {
    const caption = card.slotLabel ? `<b class="ws-slot-cap">${escapeHtml(card.slotLabel)}</b>` : '';
    if (cue === 'word') {
      const frame = options.answers
        ? `<div class="ws-slot is-filled">${cardHtml(card, grade)}</div>`
        : '<div class="ws-slot"><span>붙여요</span></div>';
      return `<div class="ws-paste-cell">${caption}<div class="ws-cue">${escapeHtml(card.label)}</div>${frame}</div>`;
    }
    const slot = options.answers
      ? `<div class="ws-slot is-filled">${cardHtml(card, grade)}</div>`
      : `<div class="ws-slot is-ghost">${cardHtml(card, grade)}</div>`;
    return `<div class="ws-paste-cell">${caption}${slot}</div>`;
  };
  const note = block.instruction ? `<p class="ws-paste-note">${escapeHtml(block.instruction)}</p>` : '';
  const scene = block.image?.src
    ? `<figure class="ws-scene"><img src="${escapeHtml(block.image.src)}" alt="${escapeHtml(block.image.alt)}"></figure>`
    : '';
  const tag = options.answers ? '<span class="ws-answer-tag">정답지</span>' : '';
  // 자리마다 짝이 정해진 그림 단서는 위의 자리 바로 아래에 놓고, 낱말 단서와 빈 자리에는 어느 위치든 둘 수 있으므로 가운데에 모은다.
  const aligned = blankCount === 0 && cue === 'picture' && (slotCount === 1 || (slotCount === 2 && compact));
  const cut = options.answers || cards.length === 0 ? '' : cutStripHtml(blankCount > 0 ? cards : pasteCutOrder(cards, cue), grade, aligned);
  const slotCells = blankCount > 0 ? Array.from({ length: blankCount }, () => blankCell).join('') : cards.map(cell).join('');
  let body: string;
  if (slotCount === 1 || (slotCount === 2 && compact)) {
    // 한 자리면 장면 옆에 큰 자리를 두고 화살표로 상황 → 해야 할 일을 잇는다. 쪽이 좁으면(`compact`) 두 자리도 한 줄에 모은다.
    const arrow = slotCount === 1 ? '<span class="ws-arrow" aria-hidden="true"></span>' : '';
    body = `<div class="ws-paste-side is-${slotCount}${compact ? ' is-compact' : ''}"><div class="ws-paste-scene">${scene}${note}</div>${arrow}${slotCells}</div>`;
  } else {
    const situation = scene || note ? `<div class="ws-situation is-paste${scene ? ' has-scene' : ''}${compact ? '' : ' is-wide'}">${scene}${note}</div>` : '';
    body = `${situation}<div class="ws-paste-row">${slotCells}</div>`;
  }
  return `<div class="ws-box" style="--s:${fmt(size)}mm">${headHtml(block.title, '1. 붙여요', block.text)}${tag}${body}${cut}</div>`;
}

function noteVerdict(card: WorksheetCard, block: WorksheetBlock): string {
  if (block.kind === 'picture-paste') {
    return card.slotLabel ? `<span class="ws-verdict is-yes">${escapeHtml(card.slotLabel)} 자리</span>` : '';
  }
  if (block.kind === 'picture-choice') {
    if (card.suitable === true) return '<span class="ws-verdict is-yes">○ 알맞아요</span>';
    if (card.suitable === false) return '<span class="ws-verdict is-no">✕ 알맞지 않아요</span>';
    return '';
  }
  const zone = (block.zones ?? []).find((item) => item.id === card.zone);
  if (!zone) return '';
  const symbol = zone.mark === 'o' ? '○ ' : zone.mark === 'x' ? '✕ ' : '';
  return `<span class="ws-verdict ${zone.mark === 'x' ? 'is-no' : 'is-yes'}">${escapeHtml(symbol + zone.label)} 칸</span>`;
}

/**
 * 교사용 안내: 카드마다 교사가 읽어 줄 문장과 정답을 적는다.
 * 카드 글자는 선택지를 줄인 말이라 종이만 봐서는 뜻이 다 드러나지 않는다(학생 화면에서는 듣기 단추가 읽어 준다).
 * 학생용 인쇄본에는 넣지 않고 정답지의 마지막 장으로만 낸다.
 */
export function teacherNotesHtml(blocks: readonly WorksheetBlock[]): string {
  const traceNotes = blocks.filter((block) => block.kind === 'word-trace' && block.traceBlank && block.traceText?.includes(block.traceBlank)).map((block) => {
    const text = block.traceText ?? '';
    const blank = block.traceBlank ?? '';
    const at = text.indexOf(blank);
    const answered = `${escapeHtml(text.slice(0, at))}<mark>${escapeHtml(blank)}</mark>${escapeHtml(text.slice(at + blank.length))}`;
    // 한두 줄짜리 얇은 상자로 둔다. 교사용 안내 쪽은 카드 여섯 장의 읽어 줄 문장만으로도 쪽이 거의 차므로 머리줄을 따로 달지 않는다.
    return `<div class="ws-box ws-notes ws-notes-trace"><p class="ws-note-line"><b>${escapeHtml(block.title)}</b>따라 쓸 문장: ${answered} 표시한 낱말이 빈칸의 정답이에요.</p></div>`;
  });
  let pasteGuideShown = false;
  const sections = blocks.filter((block) => block.kind === 'picture-choice' || block.kind === 'picture-sort' || block.kind === 'picture-paste').map((block) => {
    const cards = block.pictureCards ?? [];
    const isPaste = block.kind === 'picture-paste';
    const openPaste = isPaste && Boolean(block.blankSlots);
    const decided = (isPaste && !openPaste) || cards.some((card) => card.suitable !== undefined || card.zone);
    // 흐린 그림에 붙이기는 활동 방법을 처음 한 번만 적는다.
    const pasteGuide = isPaste && !openPaste && !pasteGuideShown
      ? (pasteGuideShown = true, block.pasteCue === 'word'
        ? '<p class="ws-open-note">자리 위의 연한 낱말을 덧쓰게 하고, 같은 낱말이 쓰인 카드를 찾아 오려 붙이게 해요. 오릴 카드는 모두 알맞은 카드이고 순서만 섞여 있어요. 붙이면서 낱말을 함께 읽어 주세요.</p>'
        : '<p class="ws-open-note">흐린 그림과 같은 카드를 찾아 오려 붙이게 해요. 오릴 카드는 모두 알맞은 카드라서 틀릴 수 없어요. 붙이면서 카드 이름을 함께 말해 주세요.</p>')
      : '';
    const items = cards.map((card) => `<li class="ws-note"><div class="ws-note-pic">${cardHtml(card)}</div><div class="ws-note-text"><b>${escapeHtml(card.label)}</b>${noteVerdict(card, block)}${card.say ? `<p>${escapeHtml(card.say)}</p>` : ''}</div></li>`).join('');
    const open = decided ? '' : '<p class="ws-open-note">정해진 답이 없는 열린 선택이에요. 고른 까닭을 말해 보게 해요.</p>';
    return `<div class="ws-box ws-notes">${headHtml(block.title, '교사용 안내')}${block.instruction ? `<p class="ws-ask ws-ask-small">${escapeHtml(block.instruction)}</p>` : ''}${pasteGuide}${open}<ul class="ws-note-list">${items}</ul></div>`;
  });
  return [...traceNotes, ...sections].map((section) => `<section class="worksheet-block worksheet-block-picture">${section}</section>`).join('');
}

/** 그림 블록 한 개의 안쪽 HTML. 인쇄본과 미리보기가 같은 조각을 쓴다. */
export function pictureBlockHtml(block: WorksheetBlock, options: PictureHtmlOptions = {}): string {
  switch (block.kind) {
    case 'picture-choice': return choiceHtml(block, options);
    case 'word-trace': return traceHtml(block, options);
    case 'picture-sort': return sortHtml(block, options);
    case 'picture-paste': return pasteHtml(block, options);
    default: return '';
  }
}

/**
 * 그림 블록의 CSS. 인쇄 문서의 <style>과 미리보기의 <style>이 같은 문자열을 쓴다.
 * 모든 선택자를 `.ws-box` 아래에 둔 것은 미리보기 쪽 일반 규칙(`.teacher-worksheet-preview-block h2` 같은)에
 * 구체성에서 지지 않으려는 것이다. 색은 인쇄용 중립색이고, 흑백으로 뽑아도 ○와 ✕, 칸의 점선이 구별된다.
 */
export const WORKSHEET_PICTURE_CSS = `
.ws-box { box-sizing: border-box; padding: 3.5mm; border: 0.5mm solid #cfc7bd; border-radius: 4mm; background: #fffdf9; color: #2d2a26; font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; line-height: 1.3; text-align: left; break-inside: avoid; }
.ws-box *, .ws-box *::before, .ws-box *::after { box-sizing: border-box; }
.ws-box .ws-head { display: flex; align-items: center; gap: 3mm; margin: 0 0 2.5mm; }
.ws-box .ws-badge { display: grid; flex: none; width: 9.5mm; height: 9.5mm; place-items: center; border-radius: 50%; background: #26396b; color: #fff; font-size: 6mm; font-weight: 900; line-height: 1; }
.ws-box .ws-head h2 { margin: 0; color: #26396b; font-size: 6.8mm; font-weight: 900; line-height: 1.2; }
.ws-box .ws-hint { margin-left: auto; color: #6a645d; font-size: 4.4mm; font-weight: 700; text-align: right; }
.ws-box .ws-answer-tag { display: inline-block; margin: 0 0 2mm; padding: 0.6mm 3mm; border: 0.5mm solid #2e7d4f; border-radius: 4mm; color: #2e7d4f; font-size: 4mm; font-weight: 900; }
.ws-box .ws-situation { display: grid; gap: 3mm; align-items: center; margin: 0 0 3mm; }
.ws-box .ws-situation.has-scene { grid-template-columns: 100mm minmax(0, 1fr); gap: 4.5mm; }
.ws-box .ws-scene { margin: 0; }
.ws-box .ws-scene img { display: block; width: 100%; height: auto; aspect-ratio: 16 / 9; object-fit: cover; border: 0.4mm solid #cfc7bd; border-radius: 3mm; }
.ws-box .ws-scene figcaption { margin-top: 1mm; color: #7a736b; font-size: 3.2mm; text-align: center; }
.ws-box p.ws-ask { margin: 0; font-size: 6.2mm; font-weight: 800; line-height: 1.5; word-break: keep-all; overflow-wrap: anywhere; }
.ws-box p.ws-ask-small { margin: 0 0 2mm; font-size: 4.8mm; font-weight: 700; color: #4a4540; }
.ws-box .ws-card { container-type: inline-size; position: relative; width: var(--cs, var(--s, 54mm)); aspect-ratio: 1 / 1; flex: none; }
.ws-box .ws-card > img { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: contain; }
.ws-box .ws-card-art { display: flex; flex-direction: column; overflow: hidden; border: 0.4mm solid #26396b; border-radius: 1.8mm; background: #fff; }
.ws-box .ws-art { display: grid; flex: 1 1 0; min-height: 0; place-items: center; overflow: hidden; background: #ead9b0; font-size: 40cqw; line-height: 1; }
.ws-box .ws-art span { font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif; }
.ws-box .ws-art img { width: 100%; height: 100%; object-fit: cover; }
.ws-box .ws-label { display: grid; flex: none; place-items: center; min-height: 20cqw; padding: 1cqw 3cqw; border-top: 0.3mm solid #26396b; color: #26396b; font-size: 10.5cqw; font-weight: 900; line-height: 1.2; text-align: center; word-break: keep-all; overflow-wrap: anywhere; }
.ws-box .ws-label.is-long { font-size: 9.2cqw; }
.ws-box .ws-label.is-longer { font-size: 8cqw; }
.ws-box .ws-choices { display: flex; flex-wrap: wrap; justify-content: center; gap: 4mm 5mm; }
.ws-box .ws-choice { display: flex; flex-direction: column; align-items: center; gap: 3mm; }
.ws-box .ws-circle { display: block; width: 14mm; height: 14mm; border: 1mm solid #2d2a26; border-radius: 50%; background: #fff; }
.ws-box .ws-circle.is-answer { border-color: #2e7d4f; background: #2e7d4f; }
.ws-box .ws-trace { display: flex; align-items: center; gap: 5mm; }
.ws-box .ws-trace-pic { flex: none; --cs: 38mm; }
.ws-box .ws-trace-rows { display: grid; min-width: 0; flex: 1; gap: 2mm; }
.ws-box .ws-trace-row { display: flex; align-items: flex-end; height: 24mm; padding: 0 2mm; border-bottom: 0.6mm solid #8d867d; background: linear-gradient(to bottom, transparent calc(50% - 0.15mm), #e4ded5 calc(50% - 0.15mm), #e4ded5 calc(50% + 0.15mm), transparent calc(50% + 0.15mm)); }
.ws-box .ws-trace-rows.is-sentence .ws-trace-row { height: 22mm; }
.ws-box .ws-trace-row span.is-fade { color: #d9d3ca; }
.ws-box .ws-trace-row span { color: #b5aea4; font-weight: 900; line-height: 1.1; letter-spacing: 0.05em; white-space: nowrap; }
.ws-box .ws-gap { display: inline-flex; flex: none; align-items: center; justify-content: center; height: 15mm; margin: 0 1.5mm 2mm; border: 0.6mm dashed #6a645d; border-radius: 2.5mm; background: #fffefb; color: #2d2a26; font-weight: 900; line-height: 1; }
.ws-box .ws-gap.is-answer { border-style: solid; border-color: #2e7d4f; color: #2e7d4f; }
.ws-box.ws-notes mark { padding: 0 1mm; border-radius: 1mm; background: #d9efe0; color: #1f6b3d; font-weight: 900; }
.ws-box .ws-zones { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start; gap: ${ZONE_GAP}mm; }
.ws-box .ws-zone { padding: ${ZONE_PAD}mm; border: 0.6mm solid #b9b1a8; border-radius: 4mm; background: #f8f4ec; }
.ws-box .ws-zone-head { display: flex; align-items: center; justify-content: center; gap: 2.5mm; min-height: 11mm; margin-bottom: 2mm; }
.ws-box .ws-zone-head b { color: #2d2a26; font-size: 6.2mm; font-weight: 900; }
.ws-box .ws-zone-head b.is-trace { padding: 0 2mm 0.6mm; border-bottom: 0.6mm solid #8d867d; color: #b5aea4; }
.ws-box .ws-zone-head.has-card { flex-direction: column; gap: 1mm; }
.ws-box .ws-zone-head.has-card b { font-size: 5.4mm; line-height: 1.2; text-align: center; word-break: keep-all; }
.ws-box .ws-zone-card { --cs: 24mm; display: block; }
.ws-box .ws-mark { position: relative; display: block; flex: none; width: 9.5mm; height: 9.5mm; }
.ws-box .ws-mark-o { border: 1.4mm solid #2e7d4f; border-radius: 50%; }
.ws-box .ws-mark-x::before, .ws-box .ws-mark-x::after { content: ""; position: absolute; top: 50%; left: 50%; width: 11.5mm; height: 1.5mm; border-radius: 1mm; background: #b3382a; }
.ws-box .ws-mark-x::before { transform: translate(-50%, -50%) rotate(45deg); }
.ws-box .ws-mark-x::after { transform: translate(-50%, -50%) rotate(-45deg); }
.ws-box .ws-slots { display: flex; flex-wrap: wrap; justify-content: center; gap: ${SLOT_GAP}mm; }
.ws-box .ws-slot { display: grid; flex: none; width: var(--s); height: var(--s); place-items: center; border: 0.5mm dashed #8a8178; border-radius: 4mm; background: #fffefb; color: #c2bbb2; font-size: 4.4mm; font-weight: 700; }
.ws-box .ws-slot.is-filled { border-style: solid; border-color: #2e7d4f; --cs: calc(var(--s) - ${fmt(CUT_PAD * 2 + 1)}mm); }
.ws-box .ws-cut { position: relative; margin-top: 6mm; padding-top: 4mm; border-top: 0.5mm dashed #6a645d; }
.ws-box .ws-cut-head { position: absolute; top: -2.9mm; left: 4mm; padding: 0 2mm; background: #fffdf9; color: #4a4540; font-size: 4.2mm; font-weight: 800; }
.ws-box .ws-cut-cards { display: flex; flex-wrap: wrap; justify-content: center; gap: ${SLOT_GAP}mm; }
.ws-box .ws-cut-item { flex: none; width: var(--s); height: var(--s); padding: ${CUT_PAD}mm; border: 0.55mm dashed #3b3631; border-radius: 4mm; background: #fff; }
.ws-box .ws-cut-item .ws-card { width: 100%; }
.ws-box .ws-paste-side { display: grid; align-items: center; gap: 3mm; }
.ws-box .ws-paste-side.is-0 { grid-template-columns: minmax(0, 1fr); }
.ws-box .ws-paste-side.is-1 { grid-template-columns: minmax(0, 1fr) 9mm var(--s); }
.ws-box .ws-paste-side.is-1.is-compact { grid-template-columns: 80mm minmax(0, 1fr) var(--s); }
.ws-box .ws-paste-side.is-2 { grid-template-columns: minmax(0, 1fr) var(--s) var(--s); }
.ws-box .ws-paste-scene { min-width: 0; }
.ws-box .ws-paste-note { margin: 2mm 0 0; color: #4a4540; font-size: 4.8mm; font-weight: 700; line-height: 1.45; word-break: keep-all; overflow-wrap: anywhere; }
.ws-box .ws-situation.is-paste { grid-template-columns: minmax(0, 1fr); }
.ws-box .ws-situation.is-paste.has-scene { grid-template-columns: 84mm minmax(0, 1fr); }
.ws-box .ws-situation.is-paste.has-scene.is-wide { grid-template-columns: 100mm minmax(0, 1fr); }
.ws-box .ws-situation.is-paste .ws-paste-note { margin: 0; font-size: 5.2mm; }
.ws-box .ws-arrow { justify-self: center; width: 0; height: 0; border-top: 6mm solid transparent; border-bottom: 6mm solid transparent; border-left: 8mm solid #8d867d; }
.ws-box .ws-paste-row { display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end; gap: 0 ${SLOT_GAP}mm; }
.ws-box .ws-paste-cell { display: flex; flex-direction: column; align-items: center; gap: 1.5mm; }
.ws-box .ws-cue { display: flex; width: var(--s); height: 19mm; align-items: flex-end; justify-content: center; padding: 0 1mm 1mm; border-bottom: 0.6mm solid #8d867d; color: #b5aea4; font-size: 7.5mm; font-weight: 900; line-height: 1.15; letter-spacing: 0.05em; text-align: center; word-break: keep-all; overflow-wrap: anywhere; }
.ws-box .ws-slot-cap { color: #26396b; font-size: 5.2mm; font-weight: 900; line-height: 1.2; text-align: center; word-break: keep-all; }
.ws-box .ws-slot.is-ghost { border-color: #b9b1a8; --cs: calc(var(--s) - ${fmt(CUT_PAD * 2 + 1)}mm); }
.ws-box .ws-slot.is-ghost .ws-card { opacity: 0.34; }
.ws-box .ws-cut-cards.is-end { justify-content: flex-end; }
.ws-box .ws-note-list { display: grid; gap: 2mm; margin: 0; padding: 0; list-style: none; }
.ws-box .ws-note { display: flex; align-items: center; gap: 4mm; }
.ws-box .ws-note-pic { flex: none; --cs: 18mm; }
.ws-box .ws-note-text { min-width: 0; }
.ws-box .ws-note-text b { margin-right: 2mm; font-size: 4.6mm; }
.ws-box .ws-note-text p { margin: 0.5mm 0 0; color: #4a4540; font-size: 3.9mm; line-height: 1.45; }
.ws-box .ws-verdict { display: inline-block; padding: 0.3mm 2mm; border-radius: 3mm; font-size: 3.6mm; font-weight: 900; }
.ws-box .ws-verdict.is-yes { border: 0.4mm solid #2e7d4f; color: #2e7d4f; }
.ws-box .ws-verdict.is-no { border: 0.4mm solid #b3382a; color: #b3382a; }
.ws-box .ws-open-note { margin: 0 0 2mm; color: #6a645d; font-size: 4mm; font-weight: 700; }
.ws-box.ws-notes-trace { padding: 2.5mm 3.5mm; }
.ws-box .ws-note-line { margin: 0; color: #4a4540; font-size: 4.4mm; font-weight: 700; line-height: 1.5; word-break: keep-all; overflow-wrap: anywhere; }
.ws-box .ws-note-line b { margin-right: 2.5mm; color: #26396b; font-size: 5.2mm; font-weight: 900; }
.worksheet-block-picture { margin: 0 0 3mm; padding: 0; border: 0; border-radius: 0; background: none; break-inside: avoid; }
`;

/** 미리보기 쪽 CSS: 인쇄 크기 그대로 그린 조각을 시트 너비에 맞춰 줄인다. */
export const WORKSHEET_PICTURE_PREVIEW_CSS = `
.ws-zoom { width: 180mm; max-width: none; zoom: var(--worksheet-scale, 1); }
`;
