import type { ReactNode } from 'react';

interface Props {
  term: string;        // dictionary key (may differ from displayed text)
  children: ReactNode; // displayed text
  onOpen: (term: string) => void;
}

export default function DictionaryTerm({ term, children, onOpen }: Props) {
  return (
    <button
      type="button"
      className="dict-term inline-flex items-baseline bg-transparent border-0 p-0 m-0 text-inherit underline-offset-2"
      onClick={() => onOpen(term)}
      aria-label={`${term} 뜻 보기`}
    >{children}</button>
  );
}
