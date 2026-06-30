import type { ReactNode } from 'react';

interface Props {
  term: string;
  children: ReactNode;
}

export default function DictionaryTerm({ term, children }: Props) {
  return (
    <button
      type="button"
      className="dict-term inline-flex items-baseline bg-transparent border-0 p-0 m-0 text-inherit underline-offset-2"
      data-dict-term={term}
      aria-label={`${term} 뜻 보기`}
    >{children}</button>
  );
}
