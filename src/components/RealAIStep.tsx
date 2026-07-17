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
import ActivitySpread from './lesson/ActivitySpread';

interface Props {
  prompt: string;              // shown to the student ("AI한테 __ 라고 물어봅니다")
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
        : { studentMessage: '무언가 잘못되었습니다.', technicalDetail: String(err) };
      // fallbackResponse에도 [happy] 같은 감정 태그가 들어있으니 반드시 제거 후 읽는다.
      speak(parseExpression(fallbackResponse).cleanText);
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
      aiGlow: true,
    });
  } else if (state.kind === 'fallback') {
    const fb = parseExpression(fallbackResponse);
    messages.push({
      id: 'aimi-fallback',
      sender: 'aimi',
      text: fb.cleanText,
      expression: fb.expression === 'neutral' ? 'happy' : fb.expression,
    });
  }

  // Footer depending on input mode
  let footer: React.ReactNode = null;
  if (state.kind === 'idle') {
    if (allowFreeInput) {
      footer = (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="AI에게 물어볼 말"
              className="flex-1 min-w-0 h-13 px-3 rounded-[var(--r-md)] border-2 text-base"
              style={{ background: 'var(--paper-0)', borderColor: 'var(--line)', color: 'var(--brand-ink)' }}
              aria-label="AI에게 보낼 말"
            />
            <div className="shrink-0">
              <MicButton
                accent={accent}
                onResult={(text) => setDraft(text)}
              />
            </div>
            <button
              onClick={send}
              disabled={!draft.trim()}
              className="shrink-0 h-13 w-13 rounded-full flex items-center justify-center transition-colors text-white cursor-pointer"
              style={{ backgroundColor: accent, opacity: draft.trim() ? 1 : 0.5 }}
              aria-label="전송"
            >
              <Icon name="chat" size={20} />
            </button>
          </div>
          <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
            🎤 를 누르고 말하거나, 위 글을 직접 고쳐도 됩니다.
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

  const characterReaction = {
    id: 'aimi' as const,
    expression: state.kind === 'loading' ? 'thinking' as const : (state.kind === 'success' ? 'happy' as const : 'curious' as const),
    text: state.kind === 'idle'
      ? '나에게 하고 싶은 말을 입력하고 전송 버튼을 눌러줘!'
      : (state.kind === 'loading' ? '어떤 말인지 열심히 생각하고 있어. 잠시만 기다려줘!' : '너와 대화하니까 정말 기뻐!')
  };

  return (
    <ActivitySpread
      kicker="아이미랑 이야기해 보십시오"
      title={prompt}
      accent={accent}
      character={characterReaction}
    >
      <div className="flex flex-col items-center w-full">
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
              지금은 미리 준비된 답변을 보여드리겠습니다.
            </p>
          </div>
        )}
      </div>
    </ActivitySpread>
  );
}
