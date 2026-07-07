import { useEffect } from 'react';
import { useSpeak } from '../hooks/useSpeak';
import type { DictionaryEntry } from '../types';
import { findDictionaryEntry } from '../data/studentDictionary';
import CharacterAvatar from './CharacterAvatar';
import Button from './Button';
import Icon from './Icon';

interface Props {
  open: boolean;
  query: string | null;
  onClose: () => void;
  onSearch: (q: string) => void;
}

export default function DictionaryPanel({ open, query, onClose, onSearch }: Props) {
  const { speak } = useSpeak();
  const entry: DictionaryEntry | null = query ? findDictionaryEntry(query) : null;

  useEffect(() => {
    if (open && entry) {
      speak(entry.ttsVersion ?? entry.shortExplanation);
    }
  }, [open, entry, speak]);

  if (!open) return null;

  return (
    <aside className="w-80 max-w-[90vw] shrink-0 border-l border-[color:var(--border)] bg-[color:var(--paper-0)] p-6 overflow-y-auto fixed inset-y-0 right-0 z-40 shadow-xl md:static md:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold inline-flex items-center gap-2"><Icon name="book" size={22} style={{ color: 'var(--accent)' }} /> 쉬운 사전</h2>
        <button
          onClick={onClose}
          aria-label="사전 닫기"
          className="h-10 w-10 rounded-[var(--r-sm)] hover:bg-[color:var(--paper-2)] text-xl"
        >×</button>
      </div>

      <input
        type="search"
        placeholder="단어를 검색해보세요"
        value={query ?? ''}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-3 mb-4 border-2 border-[color:var(--border)] rounded-[var(--r-sm)] text-base"
      />

      {!query && (
        <div className="text-center pt-6">
          <div className="flex justify-center mb-3" aria-hidden>
            <CharacterAvatar character="aimi" expression="curious" size={80} />
          </div>
          <p className="text-[color:var(--muted)]">
            궁금한 단어가 있어요?
            <br />
            본문의 <span className="dict-term">밑줄 친 단어</span>를 누르면
            <br />
            아이미가 뜻을 알려줘요.
          </p>
        </div>
      )}

      {query && !entry && (
        <div className="text-center pt-6">
          <div className="flex justify-center mb-3" aria-hidden>
            <CharacterAvatar character="aimi" expression="thinking" size={80} />
          </div>
          <p className="text-[color:var(--muted)]">"{query}"는 아직 사전에 없어요. 선생님께 물어봐요!</p>
        </div>
      )}

      {entry && (
        <article>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--accent)' }}>{entry.term}</h3>
          <p className="text-lg mb-3">{entry.shortExplanation}</p>
          {entry.example && (
            <div className="mt-4 p-3 bg-[color:var(--bg)] rounded-[var(--r-sm)]">
              <p className="t-label mb-1">예시</p>
              <p>{entry.example}</p>
            </div>
          )}
          <Button onClick={() => speak(entry.ttsVersion ?? entry.shortExplanation)} className="mt-4">
            <Icon name="speaker" size={20} /> 다시 들려줘
          </Button>
        </article>
      )}
    </aside>
  );
}
