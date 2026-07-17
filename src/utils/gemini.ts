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
const RESPONSE_HINT =
  '너의 이름은 "아이미"야. 너는 학생들의 친절한 AI 로봇 친구야. 한국어로 100자 이내, 초등학생이 이해하기 쉬운 짧고 부드러운 문장으로만 답해줘. 어려운 개념은 예시로 풀어서 설명해줘.';

export interface GeminiSuccess {
  text: string;                 // safety-filtered text ready to show a student
  modelUsed: string;            // e.g. "gemini-2.5-flash"
  safe: boolean;                // false → filter replaced the response
  attemptLog: string[];         // per-model attempt outcome (for teacher diagnostics)
}

export class GeminiError extends Error {
  readonly kind: 'no-key' | 'timeout' | 'all-models-failed' | 'blocked';
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

/**
 * Ask Gemini a single-turn question. Iterates the model fallback list on
 * transient errors (network / rate-limit / unknown model). Returns a
 * safety-filtered text or throws GeminiError with student- and teacher-
 * facing messages already populated.
 */
export async function askGemini(userText: string, systemInstruction?: string): Promise<GeminiSuccess> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new GeminiError(
      'no-key',
      '아직 AI가 준비되지 않았습니다. 선생님께 알려 주십시오.',
      'No Gemini API key set in localStorage (teacher must enter one in TeacherView).',
    );
  }

  const attemptLog: string[] = [];
  for (const model of MODEL_FALLBACK) {
    try {
      const raw = await callModel(model, apiKey, userText, systemInstruction);
      const candidate = raw.candidates?.[0];
      const rawText = candidate?.content?.parts?.map(p => p.text ?? '').join('').trim() ?? '';

      if (raw.promptFeedback?.blockReason) {
        throw new GeminiError(
          'blocked',
      '이 질문에는 답하기 어렵습니다. 다른 질문을 해 주십시오.',
          `Blocked by upstream safety: ${raw.promptFeedback.blockReason}`,
        );
      }
      if (!rawText) {
        attemptLog.push(`${model}: empty response (finish=${candidate?.finishReason ?? 'unknown'})`);
        continue;
      }

      const filtered = filterAiResponse(rawText);
      attemptLog.push(`${model}: OK`);
      return { text: filtered.text, modelUsed: model, safe: filtered.safe, attemptLog };
    } catch (err) {
      if (err instanceof GeminiError) throw err;   // e.g. blocked — don't retry
      attemptLog.push(`${model}: ${(err as Error).message}`);
    }
  }

  throw new GeminiError(
    'all-models-failed',
    'AI가 졸려서 못 들었나봐. 다시 해보자!',
    `All ${MODEL_FALLBACK.length} models failed:\n${attemptLog.join('\n')}`,
  );
}

async function callModel(model: string, apiKey: string, userText: string, systemInstructionOverride?: string): Promise<RawGeminiResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;
  const systemText = systemInstructionOverride || RESPONSE_HINT;
  const body = {
    systemInstruction: { parts: [{ text: systemText }] },
    contents: [{ role: 'user', parts: [{ text: userText }] }],
    generationConfig: {
      temperature: 0.3,
      // 3.x reasoning burns tokens on hidden thinking; give room for both
      // thinking + a short user-facing response. Safety filter still caps
      // the displayed length to ~100 Korean chars.
      maxOutputTokens: 1024,
    },
  };

  const controller = new AbortController();
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
      throw new Error(`timeout after ${REQUEST_TIMEOUT_MS}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
