import React, { useState } from 'react';
import { useSpeak } from '../hooks/useSpeak';
import { askGemini, GeminiError } from '../utils/gemini';
import ErrorMessage from './ErrorMessage';
import MicButton from './MicButton';
import Button from './Button';
import Icon from './Icon';
import PhoneFrame from './PhoneFrame';
import type { PhoneMessage } from './PhoneFrame';
import type { Expression } from './CharacterAvatar';

interface Props {
  prompt: string;              // shown to the student ("AI한테 __ 라고 물어봐요")
  userInput: string;           // default text sent to Gemini (also the pre-filled value when allowFreeInput)
  fallbackResponse: string;    // shown when there's no key or all models fail
  accent: string;
  accentText?: string;         // 소형 텍스트용 어두운 변형 (말풍선 이름표)
  accentSoft: string;
  allowFreeInput?: boolean;    // when true, student edits the text and/or dictates via mic before sending
  onDone: () => void;          // called after a response (real or fallback) so ProgressDots can advance manually
  systemInstruction?: string;  // system instruction override
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading'; sent: string }
  | { kind: 'success'; text: string; modelUsed: string; sent: string }
  | { kind: 'fallback'; studentMessage: string; technicalDetail: string; sent: string };

function parseExpression(text: string): { cleanText: string; expression: Expression } {
  let expression: Expression = 'neutral';
  let cleanText = text;

  const engMap: Record<string, Expression> = {
    happy: 'happy',
    cheer: 'cheer',
    think: 'thinking',
    thinking: 'thinking',
    wink: 'wink',
    surprised: 'surprised',
    curious: 'curious',
    sleepy: 'sleepy'
  };

  const korMap: Record<string, Expression> = {
    기쁨: 'happy',
    웃음: 'happy',
    응원: 'cheer',
    화이팅: 'cheer',
    생각: 'thinking',
    고민: 'thinking',
    윙크: 'wink',
    놀람: 'surprised',
    궁금: 'curious',
    슬픔: 'sleepy'
  };

  const regex = /\[([a-zA-Z가-힣]+)\]/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    const flag = match[1].toLowerCase();
    if (engMap[flag]) {
      expression = engMap[flag];
    } else if (korMap[flag]) {
      expression = korMap[flag];
    }
  }

  cleanText = text.replace(regex, '').trim();
  return { cleanText, expression };
}

export default function RealAIStep({ prompt, userInput, fallbackResponse, accent, accentText, accentSoft, allowFreeInput, onDone, systemInstruction }: Props) {
  const { speak } = useSpeak();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [draft, setDraft] = useState<string>(userInput);

  async function send() {
    const toSend = (allowFreeInput ? draft : userInput).trim();
    if (!toSend) return;
    setState({ kind: 'loading', sent: toSend });
    try {
      const r = await askGemini(toSend, systemInstruction);
      const { cleanText } = parseExpression(r.text);
      speak(cleanText);
      setState({ kind: 'success', text: r.text, modelUsed: r.modelUsed, sent: toSend });
      onDone();
    } catch (err) {
      const e = err instanceof GeminiError
        ? { studentMessage: err.studentMessage, technicalDetail: err.technicalDetail }
        : { studentMessage: '무언가 잘못됐어요.', technicalDetail: String(err) };
      speak(fallbackResponse);
      setState({ kind: 'fallback', ...e, sent: toSend });
      onDone();
    }
  }

  const messages: PhoneMessage[] = [];
  if (state.kind !== 'idle') {
    messages.push({
      id: 'user-msg',
      sender: 'user',
      text: state.sent,
    });
  }
  if (state.kind === 'success') {
    const { cleanText, expression } = parseExpression(state.text);
    messages.push({
      id: 'aimi-success',
      sender: 'aimi',
      text: cleanText,
      expression: expression,
    });
  } else if (state.kind === 'fallback') {
    messages.push({
      id: 'aimi-fallback',
      sender: 'aimi',
      text: fallbackResponse,
      expression: 'happy',
    });
  }

  // Footer depending on input mode
  let footer: React.ReactNode = null;
  if (state.kind === 'idle') {
    if (allowFreeInput) {
      footer = (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5 w-full">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="AI에게 무엇이든 물어보세요..."
              className="flex-1 p-2 rounded-[18px] border border-neutral-300 text-base focus:outline-none"
              style={{ background: 'var(--paper-0)' }}
              aria-label="AI에게 보낼 말"
            />
            <MicButton
              accent={accent}
              onResult={(text) => setDraft(text)}
            />
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-white shrink-0 cursor-pointer"
              style={{ backgroundColor: accent, opacity: draft.trim() ? 1 : 0.5 }}
              aria-label="전송"
            >
              <Icon name="chat" size={16} />
            </button>
          </div>
          <p className="text-xs text-neutral-500 text-center">
            🎤 를 누르고 말하거나, 위 글을 직접 고쳐도 돼요.
          </p>
        </div>
      );
    } else {
      footer = (
        <Button
          variant="choice"
          accent={accent}
          onClick={send}
          className="w-full text-base font-bold justify-center"
          style={{ color: accent, background: accentSoft }}
        >
          <Icon name="chat" size={18} /> "{userInput}" 보내기
        </Button>
      );
    }
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="t-h2 mb-2 w-full text-center" style={{ color: accent }}>아이미랑 이야기해봐요</h2>
      <p className="text-lg mb-4 text-center">{prompt}</p>

      <PhoneFrame
        messages={messages}
        typing={state.kind === 'loading'}
        accent={accent}
        accentSoft={accentSoft}
        accentText={accentText}
        footer={footer}
        onSpeak={speak}
      />

      {state.kind === 'fallback' && (
        <div className="w-full max-w-[360px] mt-4 space-y-2 text-center">
          <ErrorMessage
            studentMessage={state.studentMessage}
            technicalDetail={state.technicalDetail}
          />
          <p className="text-xs text-[color:var(--muted)]">
            지금은 미리 준비된 답변을 보여드릴게요.
          </p>
        </div>
      )}
    </div>
  );
}
