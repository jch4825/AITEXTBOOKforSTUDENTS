import type { ReactNode } from 'react';

interface Props {
  term: string;
  children: ReactNode;
}

export default function DictionaryTerm({ term, children }: Props) {
  return (
    <button
      type="button"
      className="dict-term inline-flex items-baseline bg-transparent p-0 m-0 text-inherit cursor-help border-b-2 border-dotted border-[color:var(--accent,currentColor)] hover:bg-black/8 rounded-xs transition-colors"
      data-dict-term={term}
      aria-label={`${term} 뜻 보기`}
    >{children}</button>
  );
}
