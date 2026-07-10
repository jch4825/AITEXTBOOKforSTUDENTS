import type { ReactNode } from 'react';
import DictionaryTerm from '../components/DictionaryTerm';

/**
 * Renders the body with each occurrence of a listed term wrapped in a
 * DictionaryTerm (dotted-underline, opens the right-hand panel on click).
 */
export function wrapDictionaryTerms(text: string, terms: string[]): ReactNode[] {
  if (terms.length === 0) return [text];
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'g');
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
