import { useEffect, useRef, useState } from 'react';
import { useSpeak } from '../hooks/useSpeak';
import type { DictionaryEntry } from '../types';
import { findDictionaryEntry } from '../data/studentDictionary';
import {
  DictionaryAiError,
  explainWordWithAi,
  isAiDictionaryAvailable,
  normalizeLookupWord,
  type AiWordExplanation,
  type DictionaryAiFailure,
} from '../utils/dictionaryAi';
import CharacterAvatar from './CharacterAvatar';
import Button from './Button';
import Icon from './Icon';

interface Props {
  open: boolean;
  query: string | null;
  onClose: () => void;
  onSearch: (q: string) => void;
}

/** 사전에 없는 낱말을 AI에게 물은 진행 상황. 낱말을 바꾸면 처음(idle)으로 돌아간다. */
type AiState =
  | { kind: 'idle' }
  | { kind: 'loading'; word: string }
  | { kind: 'done'; word: string; result: AiWordExplanation }
  | { kind: 'failed'; word: string; reason: DictionaryAiFailure };

/** 학생에게는 기술 오류 대신 다음에 할 일만 알려 준다. */
function failureMessage(reason: DictionaryAiFailure, word: string): string {
  switch (reason) {
    case 'invalid-word':
      return '낱말 하나만 써 보십시오.';
    case 'unknown-word':
      return `아이미도 "${word}"는 잘 모르겠습니다. 선생님께 물어봅니다!`;
    case 'unsafe':
      return '이 말은 사전으로 찾기 어렵습니다. 선생님께 물어봅니다!';
    default:
      return '지금은 아이미가 뜻을 찾지 못했습니다. 잠시 뒤에 다시 해 보거나 선생님께 물어봅니다!';
  }
}

export default function DictionaryPanel({ open, query, onClose, onSearch }: Props) {
  const { speak, speakNow } = useSpeak();
  const entry: DictionaryEntry | null = query ? findDictionaryEntry(query) : null;
  // 밑줄 낱말과 사전에 실린 낱말은 AI 없이도 풀이가 나온다. AI는 사전에 없는 낱말에만 쓴다.
  const aiReady = isAiDictionaryAvailable();
  const [ai, setAi] = useState<AiState>({ kind: 'idle' });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (open && entry) {
      speak(entry.ttsVersion ?? entry.shortExplanation);
    }
  }, [open, entry, speak]);

  // 쓰는 낱말이 바뀌거나 사전을 닫으면 기다리던 물음을 접고 처음으로 돌아간다.
  useEffect(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setAi({ kind: 'idle' });
    return () => {
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, [query, open]);

  async function askAi() {
    if (!aiReady || entry || !query?.trim()) return;
    const word = normalizeLookupWord(query);
    if (!word) {
      setAi({ kind: 'failed', word: query.trim(), reason: 'invalid-word' });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setAi({ kind: 'loading', word });
    try {
      const result = await explainWordWithAi(word, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setAi({ kind: 'done', word, result });
      speak(result.meaning);
    } catch (err) {
      if (controller.signal.aborted) return;
      const reason = err instanceof DictionaryAiError ? err.kind : 'unavailable';
      if (reason === 'cancelled') return;
      setAi({ kind: 'failed', word, reason });
    }
  }

  if (!open) return null;

  return (
    <aside className="w-80 max-w-[90vw] shrink-0 border-l border-[color:var(--border)] bg-[color:var(--paper-0)] p-6 overflow-y-auto fixed inset-y-0 right-0 z-40 depth-overlay md:static md:shadow-none">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold inline-flex items-center gap-2"><Icon name="book" size={22} style={{ color: 'var(--accent)' }} /> 쉬운 사전</h2>
        <button
          onClick={onClose}
          aria-label="사전 닫기"
          className="h-10 w-10 rounded-[var(--r-sm)] hover:bg-[color:var(--paper-2)] text-xl"
        >×</button>
      </div>

      <form
        role="search"
        className="flex items-stretch gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!entry) void askAi();
        }}
      >
        <input
          type="search"
          placeholder="단어를 검색해 보십시오"
          aria-label="찾을 단어"
          value={query ?? ''}
          onChange={(e) => onSearch(e.target.value)}
          className="min-w-0 flex-1 p-3 border-2 border-[color:var(--border)] rounded-[var(--r-sm)] text-base"
        />
        {aiReady && (
          <Button type="submit" variant="secondary" disabled={!query?.trim() || Boolean(entry)} aria-label="뜻 찾기">
            찾기
          </Button>
        )}
      </form>

      {!query && (
        <div className="text-center pt-6">
          <div className="flex justify-center mb-3" aria-hidden>
            <CharacterAvatar character="aimi" expression="curious" size={80} />
          </div>
          <p className="text-[color:var(--muted)]">
            궁금한 단어가 있습니까?
            <br />
            본문의 <span className="dict-term">밑줄 친 단어</span>를 누르면
            <br />
            아이미가 뜻을 알려 줍니다.
          </p>
          {aiReady && (
            <p className="text-[color:var(--muted)] mt-3">
              밑줄이 없는 말은 위 칸에 써서
              <br />
              아이미에게 물어볼 수도 있습니다.
            </p>
          )}
        </div>
      )}

      {query && !entry && ai.kind === 'idle' && (
        <div className="text-center pt-6">
          <div className="flex justify-center mb-3" aria-hidden>
            <CharacterAvatar character="aimi" expression="thinking" size={80} />
          </div>
          <p className="text-[color:var(--muted)]">"{query}"는 아직 사전에 없습니다.{aiReady ? '' : ' 선생님께 물어봅니다!'}</p>
          {aiReady && (
            <Button onClick={() => void askAi()} className="mt-4">
              <Icon name="chat" size={20} /> 아이미에게 물어보기
            </Button>
          )}
        </div>
      )}

      <div aria-live="polite">
        {query && !entry && ai.kind === 'loading' && (
          <div className="text-center pt-6">
            <div className="flex justify-center mb-3" aria-hidden>
              <CharacterAvatar character="aimi" expression="thinking" size={80} />
            </div>
            <p className="text-[color:var(--muted)]">아이미가 "{ai.word}"의 뜻을 찾고 있습니다…</p>
          </div>
        )}

        {query && !entry && ai.kind === 'failed' && (
          <div className="text-center pt-6">
            <div className="flex justify-center mb-3" aria-hidden>
              <CharacterAvatar character="aimi" expression="thinking" size={80} />
            </div>
            <p className="text-[color:var(--muted)]">{failureMessage(ai.reason, ai.word)}</p>
            {ai.reason === 'unavailable' && (
              <Button onClick={() => void askAi()} className="mt-4">
                <Icon name="refresh" size={20} /> 다시 해 보기
              </Button>
            )}
          </div>
        )}

        {query && !entry && ai.kind === 'done' && (
          <article>
            <p className="t-label mb-2 inline-flex items-center gap-1" style={{ color: 'var(--muted)' }}>
              <Icon name="sparkles" size={16} /> AI가 만든 설명
            </p>
            <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--accent)' }}>{ai.result.word}</h3>
            <p className="text-lg mb-3">{ai.result.meaning}</p>
            {ai.result.example && (
              <div className="mt-4 p-3 bg-[color:var(--bg)] rounded-[var(--r-sm)]">
                <p className="t-label mb-1">예시</p>
                <p>{ai.result.example}</p>
              </div>
            )}
            <p className="t-label mt-4" style={{ color: 'var(--muted)' }}>
              AI가 만든 설명이라 틀릴 수 있습니다. 선생님과 함께 확인해 봅니다.
            </p>
            <Button onClick={() => speakNow(ai.result.meaning)} className="mt-4">
              <Icon name="speaker" size={20} /> 다시 들려줘
            </Button>
          </article>
        )}
      </div>

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
          <Button onClick={() => speakNow(entry.ttsVersion ?? entry.shortExplanation)} className="mt-4">
            <Icon name="speaker" size={20} /> 다시 들려줘
          </Button>
        </article>
      )}
    </aside>
  );
}
