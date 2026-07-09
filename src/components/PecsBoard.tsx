import { useState } from 'react';
import Icon from './Icon';
import { PECS_COMMON, PECS_BY_MODULE, PECS_LABELS } from '../data/pecs';
import type { ModuleId } from '../types';

interface Props {
  moduleId: ModuleId;
}

/**
 * 그림 카드를 A4의 1/4(A6) 크기로 인쇄한다. 숨긴 iframe에 카드만 있는 문서를 만들어
 * 인쇄하므로 브라우저 인쇄 미리보기가 정상 동작한다(display:none 요소를 인쇄하면 이미지가
 * 디코딩되지 않아 미리보기가 비는 문제를 피한다). 카드 이미지에 단어가 인쇄돼 있어 이미지만 낸다.
 */
function printCard(name: string, label: string) {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}lessons/pecs/${name}.webp`;
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
  document.body.appendChild(iframe);
  const win = iframe.contentWindow;
  if (!win) { iframe.remove(); return; }
  const doc = win.document;
  doc.open();
  doc.write(
    '<!doctype html><html lang="ko"><head><meta charset="utf-8">' +
    `<title>${label} · AAC 카드</title><style>` +
    '@page{size:A6;margin:8mm;}' +
    'html,body{margin:0;height:100%;}' +
    'body{display:flex;align-items:center;justify-content:center;}' +
    'img{width:88mm;height:88mm;object-fit:contain;}' +
    '</style></head><body>' +
    `<img src="${url}" alt="${label}">` +
    '</body></html>',
  );
  doc.close();
  const cleanup = () => setTimeout(() => iframe.remove(), 1000);
  const doPrint = () => { win.focus(); win.print(); cleanup(); };
  const img = doc.querySelector('img');
  if (!img) { cleanup(); return; }
  if (img.complete) doPrint();
  else { img.onload = doPrint; img.onerror = cleanup; }
}

/**
 * AAC 카드 보드 — 교실 도구 도크의 의사소통 카드.
 * 카드 이미지 안에 단어가 인쇄되어 있고, 밖의 라벨(PECS_LABELS)은 그 글자와 싱크되어 있다.
 * 카드를 키우면 그 자리에서 인쇄(A6=A4의 1/4)할 수 있다.
 */
export default function PecsBoard({ moduleId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const moduleWords = PECS_BY_MODULE[moduleId].filter((w) => !PECS_COMMON.includes(w));
  const words = [...PECS_COMMON, ...moduleWords];
  const src = (w: string) => `${import.meta.env.BASE_URL}lessons/pecs/${w}.webp`;

  if (expanded) {
    const label = PECS_LABELS[expanded] ?? expanded;
    return (
      <div className="p-3 w-64 md:w-[480px]">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setExpanded(null)}
            className="btn btn-ghost h-9 px-2 text-sm md:h-12 md:px-4 md:text-base"
          ><Icon name="chevron-left" size={18} /> 목록</button>
          <button
            onClick={() => printCard(expanded, label)}
            className="btn btn-secondary h-9 px-3 text-sm md:h-12 md:px-4 md:text-base"
            aria-label={`${label} 카드 인쇄`}
          ><Icon name="printer" size={18} /> 인쇄</button>
        </div>
        <div
          className="rounded-[var(--r-md)] p-3 flex flex-col items-center gap-4 md:p-6"
          style={{ background: 'var(--paper-2)' }}
        >
          <img src={src(expanded)} alt="" className="w-40 h-40 md:w-80 md:h-80 object-contain" />
          <span className="text-xl font-bold md:text-3xl">{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 w-72 md:w-[500px]">
      <h3 className="text-lg font-bold mb-2 md:text-2xl md:mb-4" style={{ color: 'var(--accent)' }}>AAC 카드</h3>
      <div className="grid grid-cols-4 gap-2 md:gap-3 max-h-64 md:max-h-[500px] overflow-y-auto">
        {words.map((w) => (
          <button
            key={w}
            onClick={() => setExpanded(w)}
            className="aspect-square rounded-[var(--r-sm)] flex flex-col items-center justify-center gap-1 p-1 md:p-2"
            style={{ background: 'var(--paper-2)' }}
            aria-label={PECS_LABELS[w] ?? w}
          >
            <img src={src(w)} alt="" className="w-9 h-9 md:w-16 md:h-16 object-contain" />
            <span className="text-[10px] font-semibold text-center leading-tight md:text-sm md:mt-1">{PECS_LABELS[w] ?? w}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
