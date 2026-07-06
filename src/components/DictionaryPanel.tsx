import { useEffect } from 'react';
import { useSpeak } from '../hooks/useSpeak';
import type { DictionaryEntry } from '../types';
import { findDictionaryEntry } from '../data/studentDictionary';

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
    <aside className="w-80 max-w-[90vw] shrink-0 border-l border-[color:var(--border)] bg-white p-6 overflow-y-auto fixed inset-y-0 right-0 z-40 shadow-xl md:static md:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">📖 쉬운 사전</h2>
        <button
          onClick={onClose}
          aria-label="사전 닫기"
          className="h-10 w-10 rounded hover:bg-gray-100 text-xl"
        >×</button>
      </div>

      <input
        type="search"
        placeholder="단어를 검색해보세요"
        value={query ?? ''}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full p-3 mb-4 border-2 border-[color:var(--border)] rounded text-base"
      />

      {!query && (
        <p className="text-[color:var(--muted)]">본문에서 밑줄 친 단어를 눌러보세요.</p>
      )}

      {query && !entry && (
        <p className="text-[color:var(--muted)]">"{query}" 단어는 아직 사전에 없어요.</p>
      )}

      {entry && (
        <article>
          <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--accent)' }}>{entry.term}</h3>
          <p className="text-lg mb-3">{entry.shortExplanation}</p>
          {entry.example && (
            <div className="mt-4 p-3 bg-[color:var(--bg)] rounded">
              <p className="text-sm font-semibold mb-1">예시</p>
              <p>{entry.example}</p>
            </div>
          )}
          <button
            onClick={() => speak(entry.ttsVersion ?? entry.shortExplanation)}
            className="mt-4 px-4 py-3 rounded font-semibold text-white"
            style={{ background: 'var(--accent)' }}
          >🔊 다시 들려줘</button>
        </article>
      )}
    </aside>
  );
}
