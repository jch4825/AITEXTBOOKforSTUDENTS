import { useState } from 'react';
import { useSpeak } from '../hooks/useSpeak';
import { askGemini, GeminiError } from '../utils/gemini';
import ErrorMessage from './ErrorMessage';
import MicButton from './MicButton';
import SpeechBubble from './SpeechBubble';
import Button from './Button';
import Icon from './Icon';

interface Props {
  prompt: string;              // shown to the student ("AI한테 __ 라고 물어봐요")
  userInput: string;           // default text sent to Gemini (also the pre-filled value when allowFreeInput)
  fallbackResponse: string;    // shown when there's no key or all models fail
  accent: string;
  accentText?: string;         // 소형 텍스트용 어두운 변형 (말풍선 이름표)
  accentSoft: string;
  allowFreeInput?: boolean;    // when true, student edits the text and/or dictates via mic before sending
  onDone: () => void;          // called after a response (real or fallback) so ProgressDots can advance manually
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'success'; text: string; modelUsed: string; sent: string }
  | { kind: 'fallback'; studentMessage: string; technicalDetail: string; sent: string };

export default function RealAIStep({ prompt, userInput, fallbackResponse, accent, accentText, accentSoft, allowFreeInput, onDone }: Props) {
  const { speak } = useSpeak();
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [draft, setDraft] = useState<string>(userInput);

  async function send() {
    const toSend = (allowFreeInput ? draft : userInput).trim();
    if (!toSend) return;
    setState({ kind: 'loading' });
    try {
      const r = await askGemini(toSend);
      speak(r.text);
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

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="t-h2 mb-4" style={{ color: accent }}>아이미랑 이야기해봐요</h2>
      <p className="text-lg mb-4">{prompt}</p>

      {state.kind === 'idle' && (
        allowFreeInput ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                aria-label="AI에게 보낼 말"
                className="flex-1 p-3 rounded-[var(--r-sm)] border-2 text-lg resize-none"
                style={{ borderColor: accent, background: 'var(--paper-0)' }}
              />
              <MicButton
                accent={accent}
                onResult={(text) => setDraft(text)}
              />
            </div>
            <p className="text-sm text-[color:var(--muted)]">
              🎤 를 누르고 말하거나, 위 글을 직접 고쳐도 돼요.
            </p>
            <Button
              variant="choice"
              accent={accent}
              onClick={send}
              disabled={!draft.trim()}
              className="px-6 text-xl font-bold"
              style={{ color: accent, background: accentSoft }}
            ><Icon name="chat" size={22} /> 보내기</Button>
          </div>
        ) : (
          <Button
            variant="choice"
            accent={accent}
            onClick={send}
            className="px-6 text-xl font-bold"
            style={{ color: accent, background: accentSoft }}
          ><Icon name="chat" size={22} /> "{userInput}" 보내기</Button>
        )
      )}

      {state.kind === 'loading' && (
        <SpeechBubble
          speaker="aimi"
          expression="thinking"
          text="음… 생각하고 있어요 ⏳"
          accent={accent}
          accentText={accentText}
          accentSoft={accentSoft}
        />
      )}

      {(state.kind === 'success' || state.kind === 'fallback') && (
        <div className="space-y-3">
          <div className="p-3 rounded-[var(--r-sm)] bg-[color:var(--paper-2)] text-right">내가: {state.sent}</div>

          {state.kind === 'success' ? (
            /* 진짜 AI가 답한 순간 — 시그니처 글로우 1회 (준비된 답변에는 없음) */
            <SpeechBubble
              speaker="aimi"
              expression="cheer"
              text={state.text}
              accent={accent}
              accentText={accentText}
              accentSoft={accentSoft}
              showSpeakButton
              aiGlow
            />
          ) : (
            <>
              <ErrorMessage
                studentMessage={state.studentMessage}
                technicalDetail={state.technicalDetail}
              />
              <p className="text-sm text-[color:var(--muted)] px-1">
                지금은 미리 준비된 답변을 보여드릴게요.
              </p>
              <SpeechBubble
                speaker="aimi"
                expression="happy"
                text={fallbackResponse}
                accent={accent}
                accentText={accentText}
                accentSoft={accentSoft}
                showSpeakButton
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
