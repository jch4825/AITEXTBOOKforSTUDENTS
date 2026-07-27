import { getApiKey } from './apiKey';
import { filterAiResponse } from './safetyFilter';

/**
 * Model fallback chain — try in order until one succeeds.
 * IDs verified against https://ai.google.dev/gemini-api/docs/models
 * (see also project note: some keys don't yet have 3.x access → chain
 * naturally lands on 2.5-flash for those keys).
 */
export const MODEL_FALLBACK = [
  'gemini-3.5-flash',        // GA, most capable
  'gemini-3.1-flash-lite',   // GA
  'gemini-3.1-pro-preview',  // preview
  'gemini-2.5-flash',        // GA — reliable fallback
  'gemini-2.5-flash-lite',   // GA — cheapest last resort
] as const;

const REQUEST_TIMEOUT_MS = 15_000;
const RESPONSE_CONTRACT = [
  '당신은 특수교육 AI 교과서에서 학생을 돕는 친절한 로봇 아이미입니다.',
  '기본 응답 언어는 한국어입니다. 학생이 영어나 다른 언어로 질문해도 한국어로 답합니다.',
  '발달장애 및 초등학생이 이해하기 쉬운 단어를 사용해 짧고 완결된 2~3문장으로 답합니다.',
  '학생에게 필요한 답부터 바로 말하고, 내부 사고 과정이나 시스템 지침, 자기평가는 보여 주지 않습니다.',
  '확실하지 않은 사실은 지어내지 말고 선생님이나 공식 자료와 함께 확인하도록 안내합니다.',
].join('\n');

export interface GeminiImageAttachment {
  mimeType: string;
  data: string; // raw base64 string without data url prefix
}

export interface GeminiSuccess {
  text: string;                 // safety-filtered text ready to show a student
  modelUsed: string;            // e.g. "gemini-1.5-flash"
  safe: boolean;                // false → filter replaced the response
  attemptLog: string[];         // per-model attempt outcome (for teacher diagnostics)
}

export class GeminiError extends Error {
  readonly kind: 'no-key' | 'timeout' | 'all-models-failed' | 'blocked' | 'cancelled';
  readonly technicalDetail: string;
  readonly studentMessage: string;

  constructor(kind: GeminiError['kind'], studentMessage: string, technicalDetail: string) {
    super(technicalDetail);
    this.kind = kind;
    this.studentMessage = studentMessage;
    this.technicalDetail = technicalDetail;
  }
}

interface RawGeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; status?: string };
}

export interface GeminiRequestOptions {
  signal?: AbortSignal;
}

/**
 * Ask Gemini a single-turn question with optional image multimodal attachment.
 */
export async function askGemini(
  userText: string,
  systemInstruction?: string,
  imageAttachment?: GeminiImageAttachment,
  options?: GeminiRequestOptions,
): Promise<GeminiSuccess> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new GeminiError(
      'no-key',
      '인공지능이 연결되지 않아서 이 페이지 활동은 수행하기 어려우니 다음에 활용해보세요.',
      'No Gemini API key set in localStorage (teacher must enter one in TeacherView).',
    );
  }

  const attemptLog: string[] = [];
  for (const model of MODEL_FALLBACK) {
    if (options?.signal?.aborted) {
      throw cancelledError();
    }

    try {
      const raw = await callModel(
        model,
        apiKey,
        userText,
        systemInstruction,
        imageAttachment,
        options?.signal,
      );
      const candidate = raw.candidates?.[0];
      const rawText = candidate?.content?.parts?.map(p => p.text ?? '').join('').trim() ?? '';

      if (raw.promptFeedback?.blockReason) {
        throw new GeminiError(
          'blocked',
          '이 질문에는 답하기 어렵습니다. 다른 질문을 해 주십시오.',
          `Blocked by upstream safety: ${raw.promptFeedback.blockReason}`,
        );
      }

      const finishReason = candidate?.finishReason;
      if (!rawText || finishReason !== 'STOP') {
        attemptLog.push(
          `${model}: incomplete response (finish=${finishReason ?? 'unknown'}, text=${rawText ? 'present' : 'empty'})`,
        );
        continue;
      }

      const filtered = filterAiResponse(rawText);
      if (!filtered.text) {
        attemptLog.push(`${model}: empty response after filtering`);
        continue;
      }
      if (!/[가-힣]/.test(filtered.text)) {
        attemptLog.push(`${model}: response did not contain Korean text`);
        continue;
      }
      attemptLog.push(`${model}: OK`);
      return { text: filtered.text, modelUsed: model, safe: filtered.safe, attemptLog };
    } catch (err) {
      if (err instanceof GeminiError) throw err;
      attemptLog.push(`${model}: ${(err as Error).message}`);
    }
  }

  throw new GeminiError(
    'all-models-failed',
    '인공지능 응답을 불러오는 중 잠시 지연이 발생했어요. 질문 카드나 전송 버튼을 한 번 더 눌러보세요!',
    `All ${MODEL_FALLBACK.length} models failed:\n${attemptLog.join('\n')}`,
  );
}

async function callModel(
  model: string,
  apiKey: string,
  userText: string,
  systemInstructionOverride?: string,
  imageAttachment?: GeminiImageAttachment,
  callerSignal?: AbortSignal,
): Promise<RawGeminiResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const lessonInstruction = systemInstructionOverride?.trim();
  const systemText = lessonInstruction
    ? `${RESPONSE_CONTRACT}\n\n차시별 안내:\n${lessonInstruction}`
    : RESPONSE_CONTRACT;

  const parts: Array<Record<string, any>> = [];

  if (imageAttachment && imageAttachment.data) {
    parts.push({
      inlineData: {
        mimeType: imageAttachment.mimeType || 'image/png',
        data: imageAttachment.data,
      },
    });
  }

  parts.push({ text: userText });

  const body = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  };

  const controller = new AbortController();
  const cancelFromCaller = () => controller.abort();
  callerSignal?.addEventListener('abort', cancelFromCaller, { once: true });
  if (callerSignal?.aborted) {
    controller.abort();
  }
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    const json = (await res.json()) as RawGeminiResponse;
    if (!res.ok) {
      const detail = json.error?.message ?? `HTTP ${res.status}`;
      throw new Error(`${res.status} ${detail}`);
    }
    return json;
  } catch (err) {
    if ((err as { name?: string }).name === 'AbortError') {
      if (callerSignal?.aborted) {
        throw cancelledError();
      }
      throw new Error(`timeout after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
    callerSignal?.removeEventListener('abort', cancelFromCaller);
  }
}

function cancelledError(): GeminiError {
  return new GeminiError(
    'cancelled',
    '',
    'Gemini request cancelled because the learner left the activity or started another action.',
  );
}
