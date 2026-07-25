import React, { useState } from 'react';
import Icon from './Icon';
import MicButton from './MicButton';
import { askGemini, GeminiError } from '../utils/gemini';
import { hasApiKey } from '../utils/apiKey';
import { getLessonSystemPrompt } from '../data/lessonSystemPrompts';
import { useSpeak } from '../hooks/useSpeak';

interface Props {
  lessonId: string;
  promptHint?: string;
  accent?: string;
  suggestedQuestions?: string[];
}

interface AttachedImage {
  name: string;
  mimeType: string;
  data: string; // base64 string without prefix
  previewUrl: string; // full data URL for UI preview
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  imagePreview?: string;
}

export default function LiveGeminiInteraction({
  lessonId,
  promptHint = '실시간 AI 아이미에게 질문하거나 함께 탐구해 보세요!',
  accent = 'var(--brand-accent)',
  suggestedQuestions,
}: Props) {
  const { speakNow } = useSpeak();
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);

  const isConnected = hasApiKey();
  const systemInstruction = getLessonSystemPrompt(lessonId);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text && !attachedImage) return;

    if (!isConnected) {
      setErrorMessage('인공지능이 연결되지 않아서 이 페이지 활동은 수행하기 어려우니 다음에 활용해보세요.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const imageToSend = attachedImage;
    const userText = text || (imageToSend ? '이 사진(이미지)에 대해 설명하거나 질문에 답해 줘.' : '');

    setChatHistory((prev) => [
      ...prev,
      {
        role: 'user',
        text: userText,
        imagePreview: imageToSend?.previewUrl,
      },
    ]);

    setInputText('');
    setAttachedImage(null);

    try {
      const res = await askGemini(
        userText,
        systemInstruction,
        imageToSend ? { mimeType: imageToSend.mimeType, data: imageToSend.data } : undefined
      );
      setChatHistory((prev) => [...prev, { role: 'ai', text: res.text }]);
      speakNow(res.text);
    } catch (err) {
      if (err instanceof GeminiError) {
        if (err.kind === 'no-key') {
          setErrorMessage('인공지능이 연결되지 않아서 이 페이지 활동은 수행하기 어려우니 다음에 활용해보세요.');
        } else {
          setErrorMessage(err.studentMessage);
        }
      } else {
        setErrorMessage('인공지능이 연결되지 않아서 이 페이지 활동은 수행하기 어려우니 다음에 활용해보세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('이미지 파일(PNG, JPG, WEBP, GIF 등)을 선택해 주세요.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const base64Data = result.split(',')[1] || '';
        setAttachedImage({
          name: file.name,
          mimeType: file.type || 'image/png',
          data: base64Data,
          previewUrl: result,
        });
        setErrorMessage(null);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset file input
  };

  if (!isConnected) {
    return (
      <div className="p-5 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 text-amber-900 shadow-xs space-y-3">
        <div className="flex items-center gap-3 font-bold text-base">
          <Icon name="warning" size={24} className="text-amber-600 shrink-0" />
          <span>실시간 인공지능(Gemini) 대화 안내</span>
        </div>
        <p className="text-sm font-semibold leading-relaxed">
          인공지능이 연결되지 않아서 이 페이지 활동은 수행하기 어려우니 다음에 활용해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 rounded-2xl border-2 bg-white shadow-xs" style={{ borderColor: 'var(--editorial-line)' }}>
      <div className="flex items-center justify-between gap-2 border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🤖</span>
          <div>
            <h4 className="font-extrabold text-base leading-tight">실시간 AI 아이미와 함께하기</h4>
            <p className="text-xs text-[color:var(--muted)] font-medium">{promptHint}</p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
          ● AI 연결됨 (사진 인식 지원)
        </span>
      </div>

      {chatHistory.length > 0 && (
        <div className="max-h-80 overflow-y-auto space-y-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && <span className="text-xl shrink-0">🤖</span>}
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm font-semibold leading-relaxed shadow-2xs space-y-2 ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                {msg.imagePreview && (
                  <div className="overflow-hidden rounded-lg border border-white/20">
                    <img
                      src={msg.imagePreview}
                      alt="학생 첨부 이미지"
                      className="max-h-48 w-full object-contain bg-black/10 rounded-lg"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <span>{msg.text}</span>
                  {msg.role === 'ai' && (
                    <button
                      type="button"
                      onClick={() => speakNow(msg.text)}
                      className="text-xs p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer shrink-0"
                      title="소리 듣기"
                    >
                      <Icon name="speaker" size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestedQuestions && suggestedQuestions.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-slate-500">💡 무엇을 물어볼까요?</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(q)}
                className="text-xs font-bold px-3 py-1.5 rounded-full border bg-slate-50 hover:bg-indigo-50 text-slate-700 transition cursor-pointer"
                style={{ borderColor: accent }}
              >
                "{q}"
              </button>
            ))}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
          <Icon name="warning" size={16} className="text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="space-y-2">
        {attachedImage && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-indigo-50 text-indigo-900 text-xs font-bold border border-indigo-200">
            <div className="flex items-center gap-2 overflow-hidden">
              <img src={attachedImage.previewUrl} alt="미리보기" className="w-8 h-8 rounded-md object-cover shrink-0 border border-indigo-300" />
              <span className="truncate">📷 첨부된 사진: {attachedImage.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setAttachedImage(null)}
              className="text-indigo-600 hover:text-rose-600 font-extrabold text-sm px-2 py-1 cursor-pointer shrink-0"
            >
              ✕ 삭제
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label
            title="사진/이미지 파일 첨부하기"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition shadow-2xs"
          >
            <Icon name="link" size={20} />
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>

          <MicButton accent={accent} onResult={(text) => setInputText(text)} />

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={attachedImage ? '사진에 대해 질문하거나 전송 버튼을 누르세요' : 'AI에게 질문이나 의견을 자유롭게 적어 보세요'}
            className="flex-1 min-w-0 h-11 px-4 rounded-xl border-2 text-sm font-semibold bg-white"
            style={{ borderColor: accent }}
          />

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={loading || (!inputText.trim() && !attachedImage)}
            className="h-11 px-4 rounded-xl font-bold text-white text-sm flex items-center gap-1 cursor-pointer transition disabled:opacity-50 shadow-2xs"
            style={{ background: accent }}
          >
            {loading ? '인식 중...' : '보내기'}
          </button>
        </div>
      </div>
    </div>
  );
}
