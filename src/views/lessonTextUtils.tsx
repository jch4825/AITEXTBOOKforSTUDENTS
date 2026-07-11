import type { ReactNode } from 'react';
import DictionaryTerm from '../components/DictionaryTerm';

/**
 * Renders the body with each occurrence of a listed term wrapped in a
 * DictionaryTerm (dotted-underline, opens the right-hand panel on click).
 */
export function wrapDictionaryTerms(text: string, terms: string[]): ReactNode[] {
  if (terms.length === 0) return [text];
  // 긴 표제어를 먼저 매칭한다 — '이미지 인식'이 '이미지'보다 우선해 쪼개지지 않도록.
  // (정규식 교체는 배열 앞쪽 대안을 먼저 시도하므로, 길이 내림차순이면 최장 일치가 이긴다.)
  const ordered = [...terms].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${ordered.map(escapeRegExp).join('|')})`, 'g');
  const parts = text.split(pattern);
  return parts.map((part, i) =>
    terms.includes(part)
      ? <span key={i}><DictionaryTerm term={part}>{part}</DictionaryTerm></span>
      : <span key={i}>{part}</span>
  );
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
