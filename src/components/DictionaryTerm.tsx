import type { ReactNode } from 'react';

interface Props {
  /** 뜻을 찾을 사전 올림말. 본문에 보이는 글자(label)와 달라도 된다(확인합니다 → 확인). */
  term: string;
  /** 본문에 보이는 글자. 화면 낭독기가 이 글자로 읽는다. */
  label?: string;
  children: ReactNode;
}

export default function DictionaryTerm({ term, label, children }: Props) {
  return (
    <button
      type="button"
      className="dict-term inline-flex items-baseline bg-transparent p-0 m-0 text-inherit underline-offset-2"
      data-dict-term={term}
      aria-label={`${label ?? term} 뜻 보기`}
    >{children}</button>
  );
}
