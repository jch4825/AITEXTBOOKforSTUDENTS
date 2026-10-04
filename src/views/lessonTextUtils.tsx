import type { ReactNode } from 'react';
import DictionaryTerm from '../components/DictionaryTerm';
import { STUDENT_DICTIONARY_MATCHER } from '../data/studentDictionary';

/**
 * 본문에서 사전 낱말을 DictionaryTerm(점선 밑줄, 누르면 오른쪽 사전이 열린다)으로 감싼다.
 *
 * 밑줄을 어디에 칠지는 `utils/dictionaryMatch.ts`가 정한다. 낱말 하나(어절)를 통째로 맞추므로
 * 다른 낱말의 한 조각(계산대의 계산, 무조건의 조건)에는 치지 않고, 서술어(확인합니다)는 끝까지 친다.
 * 밑줄을 치지 않을 낱말(인공지능·기계 같은 것)도 사전 쪽에서 정한다.
 *
 * `terms`는 이 글에서 밑줄을 칠 수 있는 사전 낱말(term 또는 alias)의 목록이다.
 */
export function wrapDictionaryTerms(text: string, terms: string[]): ReactNode[] {
  if (terms.length === 0) return [text];

  const normalizedText = text.normalize('NFC');
  const allowed = new Set(terms.map((t) => t.normalize('NFC')));
  const spans = STUDENT_DICTIONARY_MATCHER.spans(normalizedText).filter((span) => allowed.has(span.key));
  if (spans.length === 0) return [<span key={0}>{normalizedText}</span>];

  const nodes: ReactNode[] = [];
  let cursor = 0;
  spans.forEach((span, i) => {
    if (span.start > cursor) nodes.push(<span key={`t${i}`}>{normalizedText.slice(cursor, span.start)}</span>);
    const shown = normalizedText.slice(span.start, span.end);
    nodes.push(
      <span key={`d${i}`}>
        <DictionaryTerm term={span.term} label={shown}>{shown}</DictionaryTerm>
      </span>,
    );
    cursor = span.end;
  });
  if (cursor < normalizedText.length) nodes.push(<span key="rest">{normalizedText.slice(cursor)}</span>);
  return nodes;
}
