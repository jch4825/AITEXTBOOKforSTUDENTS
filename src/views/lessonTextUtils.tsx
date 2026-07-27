import type { ReactNode } from 'react';
import DictionaryTerm from '../components/DictionaryTerm';

/**
 * Renders the body with each occurrence of a listed term wrapped in a
 * DictionaryTerm (dotted-underline, opens the right-hand panel on click).
 */
export function wrapDictionaryTerms(text: string, terms: string[]): ReactNode[] {
  if (terms.length === 0) return [text];
  
  // Normalize and filter out terms that should not have automatic substring underlines
  const EXCLUDED_TERMS = ['인공지능', '인지', '표', '기계', '추천', '기능', '표현', '도서관', '그림'];
  const normalizedTerms = terms
    .map(t => t.normalize('NFC'))
    .filter(t => !EXCLUDED_TERMS.includes(t));
  
  if (normalizedTerms.length === 0) return [text];
  
  const normalizedText = text.normalize('NFC');

  const ordered = [...normalizedTerms].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`(${ordered.map(escapeRegExp).join('|')})`, 'g');
  const parts = normalizedText.split(pattern);

  return parts.map((part, i) => {
    const normPart = part.normalize('NFC');
    return normalizedTerms.includes(normPart)
      ? <span key={i}><DictionaryTerm term={normPart}>{part}</DictionaryTerm></span>
      : <span key={i}>{part}</span>;
  });
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
