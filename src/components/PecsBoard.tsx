import { useState } from 'react';
import Icon from './Icon';
import { PECS_BY_MODULE, PECS_LABELS } from '../data/pecs';
import type { ModuleId } from '../types';

interface Props {
  moduleId: ModuleId;
}

/**
 * 그림 카드를 A4의 1/4(A6) 크기로 인쇄한다. 숨긴 iframe에 카드만 있는 문서를 만들어
 * 인쇄하므로 브라우저 인쇄 미리보기가 정상 동작한다(display:none 요소를 인쇄하면 이미지가
 * 디코딩되지 않아 미리보기가 비는 문제를 피한다). 카드 이미지에 단어가 인쇄돼 있어 이미지만 낸다.
 */
function printCard(moduleId: ModuleId, name: string, label: string) {
  const url = `${window.location.origin}${import.meta.env.BASE_URL}lessons/pecs/${moduleId}/${name}.webp`;
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
    `<title>${label} · 그림 카드</title><style>` +
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
 * AAC 카드 보드 — 교실 도구 시트의 의사소통 카드.
 * 카드 이미지 안에 단어가 인쇄되어 있고, 밖의 라벨(PECS_LABELS)은 그 글자와 싱크되어 있다.
 * 카드를 키우면 그 자리에서 인쇄(A6=A4의 1/4)할 수 있다.
 *
 * 예전에는 떠 있는 도크 안의 고정 폭(w-72, md:w-[500px])이라 시트가 아무리 넓어도 한 칸만 쓰고
 * 오른쪽이 비었다. 목록은 안쪽 스크롤 상자(max-h-[500px])까지 따로 있어 시트와 스크롤이 겹쳤고,
 * 휴대전화에서는 한 줄 네 장에 라벨이 10px이었다. 지금은 시트 폭을 다 쓰는 격자(넓으면 여섯 열,
 * 휴대전화는 세 열)이고 스크롤은 시트 하나뿐이다. 한 장이 400KB쯤이라 보이지 않는 카드는
 * 스크롤해서 가까워질 때 받는다.
 */
export default function PecsBoard({ moduleId }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const words = PECS_BY_MODULE[moduleId] ?? [];
  const src = (w: string) => `${import.meta.env.BASE_URL}lessons/pecs/${moduleId}/${w}.webp`;

  if (expanded) {
    const label = PECS_LABELS[expanded] ?? expanded;
    return (
      <div className="pecs-board">
        <div className="pecs-board-bar">
          <button type="button" onClick={() => setExpanded(null)} className="btn btn-secondary">
            <Icon name="chevron-left" size={18} /> 목록
          </button>
          <button
            type="button"
            onClick={() => printCard(moduleId, expanded, label)}
            className="btn btn-primary"
            aria-label={`${label} 카드 인쇄`}
          >
            <Icon name="printer" size={18} /> 인쇄
          </button>
        </div>
        <figure className="pecs-board-card surface-paper">
          <img src={src(expanded)} alt="" />
          <figcaption>{label}</figcaption>
        </figure>
      </div>
    );
  }

  return (
    <div className="pecs-board">
      <div className="tool-panel-head">
        <h3>그림 카드</h3>
        <p>카드를 누르면 크게 보고 인쇄할 수 있습니다.</p>
      </div>
      <ul className="pecs-board-grid">
        {words.map((w) => (
          <li key={w}>
            <button type="button" onClick={() => setExpanded(w)}>
              <img src={src(w)} alt="" loading="lazy" decoding="async" />
              <span>{PECS_LABELS[w] ?? w}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
