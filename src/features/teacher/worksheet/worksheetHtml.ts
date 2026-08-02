import type { LessonWorksheet, WorksheetActivity, WorksheetVariant } from './types';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function lines(count = 4): string {
  return `<div class="worksheet-lines" aria-hidden="true">${Array.from({ length: count }, () => '<i></i>').join('')}</div>`;
}

function activityHtml(activity: WorksheetActivity): string {
  const title = escapeHtml(activity.title);
  const instruction = escapeHtml(activity.instruction);
  if (activity.kind === 'write') {
    return `<section class="worksheet-activity worksheet-write"><h2>${title}</h2><p>${instruction}</p><div class="worksheet-prompt">${escapeHtml(activity.prompt ?? '')}</div>${lines(activity.lines)}</section>`;
  }
  if (activity.kind === 'trace') {
    return `<section class="worksheet-activity worksheet-trace"><h2>${title}</h2><p>${instruction}</p><div class="worksheet-trace-text">${escapeHtml(activity.traceText ?? '')}</div>${lines(2)}</section>`;
  }
  if (activity.kind === 'cut-paste') {
    const cards = (activity.items ?? []).map(item => `<span class="worksheet-cut-card">${escapeHtml(item)}</span>`).join('');
    return `<section class="worksheet-activity worksheet-cut-paste"><h2>${title}</h2><p>${instruction}</p>${activity.prompt ? `<div class="worksheet-prompt">${escapeHtml(activity.prompt)}</div>` : ''}<div class="worksheet-blank-row"><span>붙이는 곳</span><span>붙이는 곳</span><span>붙이는 곳</span></div><div class="worksheet-card-bank">${cards}</div></section>`;
  }
  if (activity.kind === 'match') {
    const pairs = (activity.pairs ?? []).map(pair => `<div class="worksheet-match-row"><span>${escapeHtml(pair.left)}</span><b>↔</b><span>${escapeHtml(pair.right)}</span></div>`).join('');
    return `<section class="worksheet-activity worksheet-match"><h2>${title}</h2><p>${instruction}</p><div class="worksheet-match-list">${pairs}</div></section>`;
  }
  const items = (activity.items ?? []).map((item, index) => `<div class="worksheet-shape-row"><span class="worksheet-shape worksheet-shape-${index % 4}"></span><span>${escapeHtml(item)}</span><span class="worksheet-shape worksheet-shape-${(index + 2) % 4}"></span></div>`).join('');
  return `<section class="worksheet-activity worksheet-connect"><h2>${title}</h2><p>${instruction}</p><div class="worksheet-shape-list">${items}</div></section>`;
}

export function buildWorksheetHtml(worksheet: LessonWorksheet, variant: WorksheetVariant): string {
  const title = escapeHtml(worksheet.lessonTitle);
  const objective = escapeHtml(worksheet.objective);
  const moduleTitle = escapeHtml(worksheet.moduleTitle);
  const variantLabel = escapeHtml(`${variant.label} · ${variant.subtitle}`);
  const instruction = escapeHtml(variant.instruction);
  const activities = variant.activities.map(activityHtml).join('');
  const accent = escapeHtml(worksheet.accent);
  const accentSoft = escapeHtml(worksheet.accentSoft);
  return `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · ${variantLabel}</title>
<style>
@page{size:A4 portrait;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#eee;color:#2d2a26;font-family:"Malgun Gothic","Apple SD Gothic Neo",sans-serif}body{print-color-adjust:exact;-webkit-print-color-adjust:exact}.worksheet-page{position:relative;width:210mm;height:297mm;margin:12mm auto;padding:14mm 15mm 18mm;background:#fffdf9;overflow:visible;border:1px solid #dedbe3}.worksheet-page-guide{position:absolute;left:15mm;right:15mm;bottom:10mm;border-top:1px dashed #b86358;color:#b86358;font-size:9pt;padding-top:1mm;text-align:right}.worksheet-header{border-bottom:3px solid ${accent};padding-bottom:5mm;margin-bottom:5mm}.worksheet-module{margin:0 0 2mm;color:${accent};font-size:11pt;font-weight:800}.worksheet-header h1{margin:0;font-size:23pt;line-height:1.25}.worksheet-level{display:inline-block;margin-top:3mm;padding:1mm 3mm;border-radius:999px;background:${accentSoft};color:${accent};font-weight:800}.worksheet-objective{margin:4mm 0 0;padding:3mm;background:#f7f4ee;border-radius:3mm;font-size:11pt;line-height:1.55}.worksheet-guide{margin:0 0 4mm;font-size:10.5pt;line-height:1.5}.worksheet-activity{break-inside:avoid;margin:0 0 5mm;padding:4mm;border:1.5px solid #dedbe3;border-radius:3mm}.worksheet-activity h2{margin:0 0 1.5mm;color:${accent};font-size:14pt;line-height:1.3}.worksheet-activity p{margin:0 0 2.5mm;font-size:10pt;line-height:1.45}.worksheet-prompt{padding:2.5mm 3mm;background:#f6f4f1;border-left:3px solid ${accent};font-size:11pt;font-weight:700;line-height:1.45}.worksheet-lines{display:grid;gap:6mm;margin-top:4mm}.worksheet-lines i{display:block;height:0;border-bottom:1px solid #96908a}.worksheet-trace-text{padding:4mm 3mm;margin-top:2mm;border-bottom:2px dashed #9d9690;color:#aaa;font-size:18pt;font-weight:800;letter-spacing:.04em;line-height:1.4}.worksheet-blank-row{display:grid;grid-template-columns:repeat(3,1fr);gap:3mm;margin:4mm 0}.worksheet-blank-row span{display:grid;place-items:center;min-height:16mm;border:2px dashed #c7c0b8;border-radius:2mm;color:#9b948b;font-size:9pt}.worksheet-card-bank{display:flex;flex-wrap:wrap;gap:3mm;padding-top:3mm;border-top:1px dashed #bdb5ad}.worksheet-cut-card{display:inline-flex;min-width:28mm;min-height:14mm;align-items:center;justify-content:center;padding:2mm;border:1.5px dashed ${accent};border-radius:2mm;background:#fff;color:#2d2a26;font-size:10pt;font-weight:700;text-align:center}.worksheet-match-list{display:grid;gap:2mm}.worksheet-match-row{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:3mm;min-height:13mm}.worksheet-match-row span{padding:2.5mm;border:1px solid #dedbe3;border-radius:2mm;font-size:10pt;line-height:1.4}.worksheet-match-row b{color:${accent};font-size:14pt}.worksheet-shape-list{display:grid;grid-template-columns:1fr;gap:3mm}.worksheet-shape-row{display:grid;grid-template-columns:10mm 1fr 10mm;gap:4mm;align-items:center;min-height:14mm}.worksheet-shape-row>span:nth-child(2){font-size:10pt}.worksheet-shape{display:block;width:8mm;height:8mm;border:2px solid ${accent};justify-self:center}.worksheet-shape-0{border-radius:50%}.worksheet-shape-1{transform:rotate(45deg);border-radius:1mm}.worksheet-shape-2{clip-path:polygon(50% 0,100% 100%,0 100%);border-radius:0}.worksheet-shape-3{transform:rotate(45deg);border-radius:2mm}.worksheet-footer{position:absolute;left:15mm;right:15mm;bottom:13mm;display:flex;justify-content:space-between;color:#777;font-size:9pt}.worksheet-page+.worksheet-page{page-break-before:always}@media print{html,body{background:#fff}.worksheet-page{margin:0;border:0;overflow:visible}.worksheet-page-guide{display:block}}
</style></head><body><main class="worksheet-page" style="--worksheet-accent:${accent};--worksheet-soft:${accentSoft}"><header class="worksheet-header"><p class="worksheet-module">${moduleTitle}</p><h1>${title}</h1><span class="worksheet-level">${variantLabel}</span><p class="worksheet-objective">학습 목표: ${objective}</p></header><p class="worksheet-guide">${instruction}</p>${activities}<div class="worksheet-page-guide">A4 한 장 기준선 · 다음 장으로 넘어가면 이 선 아래 내용을 확인하세요.</div><footer class="worksheet-footer"><span>이름: ____________________</span><span>${escapeHtml(worksheet.lessonId)}</span></footer></main></body></html>`;
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
  const print = () => {
    printWindow.focus();
    printWindow.print();
  };
  if (printWindow.document.readyState === 'complete') window.setTimeout(print, 160);
  else printWindow.addEventListener('load', () => window.setTimeout(print, 160), { once: true });
}
