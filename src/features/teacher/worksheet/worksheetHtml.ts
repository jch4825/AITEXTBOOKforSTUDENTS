import { worksheetPagesForVariant, type LessonWorksheet, type WorksheetBlock, type WorksheetIllustration, type WorksheetVariant } from './types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function safeColor(value: string | undefined): string {
  return /^#[0-9a-f]{3,8}$/i.test(value ?? '') ? value as string : '#2f3341';
}

function safeFontSize(value: number | undefined): number {
  return Number.isFinite(value) ? Math.max(10, Math.min(44, value as number)) : 15;
}

const FONT_FAMILIES = {
  sans: '"Malgun Gothic", "Apple SD Gothic Neo", sans-serif',
  serif: '"Batang", "Noto Serif KR", serif',
  hand: '"Comic Sans MS", "Malgun Gothic", cursive',
} as const;

function blockStyle(block: WorksheetBlock): string {
  const fontFamily = FONT_FAMILIES[block.fontFamily ?? 'sans'];
  return `font-size:${safeFontSize(block.fontSize)}px;color:${safeColor(block.color)};font-family:${fontFamily};text-align:${block.align ?? 'left'};`;
}

function illustrationHtml(image: WorksheetIllustration | undefined, className = 'worksheet-image'): string {
  if (!image?.src) return '';
  return `<figure class="${className}"><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">${image.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ''}</figure>`;
}

function blockReferenceHtml(block: WorksheetBlock): string {
  return block.kind === 'image' ? '' : illustrationHtml(block.image, 'worksheet-reference-image');
}

function answerLines(count: number): string {
  return `<div class="worksheet-answer-lines" aria-hidden="true">${Array.from({ length: Math.max(1, Math.min(8, count)) }, () => '<i></i>').join('')}</div>`;
}

function blockHtml(block: WorksheetBlock): string {
  const style = blockStyle(block);
  const title = escapeHtml(block.title ?? '');
  const instruction = escapeHtml(block.instruction ?? '');
  if (block.kind === 'heading') return `<section class="worksheet-block worksheet-block-heading" style="${style}"><h1>${escapeHtml(block.text ?? '')}</h1></section>`;
  if (block.kind === 'text') return `<section class="worksheet-block worksheet-block-text" style="${style}"><p>${escapeHtml(block.text ?? '')}</p></section>`;
  if (block.kind === 'short-answer' || block.kind === 'sentence') return `<section class="worksheet-block worksheet-block-form" style="${style}"><h2>${title}</h2>${blockReferenceHtml(block)}<p>${instruction}</p>${answerLines(block.lineCount ?? (block.kind === 'sentence' ? 2 : 1))}</section>`;
  if (block.kind === 'multiple-choice') {
    const options = (block.options ?? []).map(option => `<li>□ ${escapeHtml(option)}</li>`).join('');
    return `<section class="worksheet-block worksheet-block-form" style="${style}"><h2>${title}</h2>${blockReferenceHtml(block)}<p>${instruction}</p><ul class="worksheet-options">${options}</ul></section>`;
  }
  if (block.kind === 'trace') return `<section class="worksheet-block worksheet-block-form" style="${style}"><h2>${title}</h2>${blockReferenceHtml(block)}<p>${instruction}</p><div class="worksheet-trace-text">${escapeHtml(block.traceText ?? '')}</div>${answerLines(block.lineCount ?? 1)}</section>`;
  if (block.kind === 'cut-paste') {
    const cards = (block.cards ?? []).map(card => `<span>${escapeHtml(card)}</span>`).join('');
    return `<section class="worksheet-block worksheet-block-form" style="${style}"><h2>${title}</h2>${blockReferenceHtml(block)}<p>${instruction}</p><div class="worksheet-paste-targets"><span>붙이는 곳</span><span>붙이는 곳</span><span>붙이는 곳</span></div><div class="worksheet-cut-cards">${cards}</div></section>`;
  }
  if (block.kind === 'draw') return `<section class="worksheet-block worksheet-block-form" style="${style}"><h2>${title}</h2>${blockReferenceHtml(block)}<p>${instruction}</p><div class="worksheet-draw-area">여기에 그려 보세요</div></section>`;
  if (block.kind === 'image') return `<section class="worksheet-block worksheet-block-image" style="${style}">${illustrationHtml(block.image)}</section>`;
  return '<div class="worksheet-block worksheet-block-divider"><hr></div>';
}

export function buildWorksheetHtml(worksheet: LessonWorksheet, variant: WorksheetVariant): string {
  const title = escapeHtml(worksheet.lessonTitle);
  const moduleTitle = escapeHtml(worksheet.moduleTitle);
  const variantLabel = escapeHtml(`${variant.label} · ${variant.subtitle}`);
  const pages = worksheetPagesForVariant(variant);
  const pageHtml = pages.map((page, pageIndex) => {
    const blocks = page.blocks.map(blockHtml).join('');
    const pageLabel = escapeHtml(`${variantLabel} · ${pageIndex + 1}/${pages.length}`);
    return `<main class="worksheet-page" data-page="${pageIndex + 1}"><header class="worksheet-meta"><strong>${moduleTitle}</strong><span>${title}</span><small>${pageLabel}</small></header>${blocks}<div class="worksheet-page-guide">A4 한 장 기준선 · 다음 장으로 넘어가면 다음 페이지로 나누세요.</div><footer class="worksheet-footer"><span>이름: ____________________</span><span>${escapeHtml(worksheet.lessonId)} · ${pageIndex + 1}/${pages.length}</span></footer></main>`;
  }).join('');
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · ${variantLabel}</title>
<style>
@page { size: A4 portrait; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: #eee; color: #2d2a26; font-family: "Malgun Gothic", "Apple SD Gothic Neo", sans-serif; }
body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
.worksheet-page { position: relative; width: 210mm; min-height: 297mm; margin: 12mm auto; padding: 12mm 15mm 24mm; background: #fffdf9; border: 1px solid #dedbe3; overflow: visible; }
.worksheet-page + .worksheet-page { break-before: page; }
.worksheet-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 5mm; padding-bottom: 4mm; margin-bottom: 5mm; border-bottom: 3px solid #66509a; color: #66509a; }
.worksheet-meta strong { font-size: 11pt; }
.worksheet-meta span { min-width: 0; color: #2d2a26; font-size: 20pt; font-weight: 800; overflow-wrap: anywhere; }
.worksheet-meta small { color: #777; font-size: 8pt; white-space: nowrap; }
.worksheet-block { break-inside: avoid; margin: 0 0 5mm; padding: 4mm; border: 1.5px solid #dedbe3; border-radius: 3mm; overflow-wrap: anywhere; }
.worksheet-block-heading { padding: 0 0 3mm; border-width: 0 0 1.5px; border-radius: 0; }
.worksheet-block-heading h1 { margin: 0; font-size: inherit; line-height: 1.25; }
.worksheet-block-text { padding: 3mm; background: #f7f4ee; }
.worksheet-block-text p, .worksheet-block-form p { margin: 0 0 3mm; font-size: inherit; line-height: 1.5; }
.worksheet-block-form h2 { margin: 0 0 2mm; color: #66509a; font-size: 1.12em; line-height: 1.3; }
.worksheet-answer-lines { display: grid; grid-auto-rows: 7mm; gap: 4mm; margin-top: 3mm; }
.worksheet-answer-lines i { display: block; border-bottom: 1px solid #96908a; }
.worksheet-options { display: grid; gap: 3mm; padding: 0; margin: 0; list-style: none; }
.worksheet-options li { padding: 2.5mm 3mm; border: 1px solid #dedbe3; border-radius: 2mm; line-height: 1.4; }
.worksheet-trace-text { padding: 3mm; margin: 2mm 0 0; border-bottom: 2px dashed #9d9690; color: #aaa; font-size: 1.35em; font-weight: 800; line-height: 1.4; }
.worksheet-paste-targets { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin: 3mm 0; }
.worksheet-paste-targets span { display: grid; min-height: 17mm; place-items: center; border: 2px dashed #c7c0b8; border-radius: 2mm; color: #9b948b; font-size: 9pt; }
.worksheet-cut-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 3mm; padding-top: 3mm; border-top: 1px dashed #bdb5ad; }
.worksheet-cut-cards span { display: inline-flex; min-width: 0; min-height: 14mm; max-width: 100%; align-items: center; justify-content: center; padding: 2mm; border: 1.5px dashed #66509a; border-radius: 2mm; text-align: center; overflow-wrap: anywhere; }
.worksheet-draw-area { display: grid; min-height: 65mm; place-items: center; border: 2px dashed #66509a; border-radius: 3mm; background: repeating-linear-gradient(0deg, #fffdf9, #fffdf9 8mm, #f0ece7 8.2mm, #fffdf9 8.4mm); color: #8d857d; }
.worksheet-block-image { padding: 0; border: 0; }
.worksheet-image { margin: 0; }
.worksheet-image img { display: block; width: 100%; max-height: 62mm; object-fit: contain; border: 1px solid #dedbe3; border-radius: 3mm; }
.worksheet-image figcaption { margin-top: 1.5mm; color: #777; font-size: 8pt; text-align: center; }
.worksheet-reference-image { width: min(55mm, 100%); margin: 0 auto 3mm; }
.worksheet-reference-image img { display: block; width: 100%; max-height: 30mm; object-fit: cover; border: 1px solid #dedbe3; border-radius: 3mm; }
.worksheet-reference-image figcaption { margin-top: 1.5mm; color: #777; font-size: 7pt; text-align: center; }
.worksheet-block-divider { padding: 0; border: 0; }
.worksheet-block-divider hr { border: 0; border-top: 1px dashed #aaa39b; }
.worksheet-page-guide { position: absolute; right: 15mm; bottom: 14mm; left: 15mm; border-top: 1px dashed #b86358; color: #b86358; padding-top: 1mm; font-size: 8pt; text-align: right; }
.worksheet-footer { position: absolute; right: 15mm; bottom: 7mm; left: 15mm; display: flex; justify-content: space-between; color: #777; font-size: 8pt; }
@media print { html, body { background: #fff; } .worksheet-page { width: 210mm; min-height: 297mm; margin: 0; border: 0; } .worksheet-page + .worksheet-page { break-before: page; } }
</style></head><body>${pageHtml}</body></html>`;
}

export function downloadWorksheetHtml(worksheet: LessonWorksheet, variant: WorksheetVariant): void {
  const html = buildWorksheetHtml(worksheet, variant);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${worksheet.lessonId}-${variant.level}-학습지.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function printWorksheet(worksheet: LessonWorksheet, variant: WorksheetVariant): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.alert('인쇄 창을 열 수 없습니다. 브라우저의 팝업 차단을 해제해 주세요.');
    return;
  }
  printWindow.document.open();
  printWindow.document.write(buildWorksheetHtml(worksheet, variant));
  printWindow.document.close();
  const print = () => { printWindow.focus(); printWindow.print(); };
  if (printWindow.document.readyState === 'complete') window.setTimeout(print, 160);
  else printWindow.addEventListener('load', () => window.setTimeout(print, 160), { once: true });
}
