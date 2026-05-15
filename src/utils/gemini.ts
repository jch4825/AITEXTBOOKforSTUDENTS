import { GoogleGenAI } from '@google/genai';

export const GEMINI_MODEL_CANDIDATES = ['gemini-3-flash-preview', 'gemini-2.5-flash'] as const;

export const GEMINI_MODEL_GUIDE = 'Gemini 3 Flash Preview 또는 Gemini 2.5 Flash';

const API_KEY_PROPAGATION_RETRY_DELAY_MS = 1800;

export function shouldTryNextGeminiModel(error: unknown): boolean {
  const message = typeof error === 'string' ? error : error instanceof Error ? error.message : '';
  return /429|RESOURCE_EXHAUSTED|quota|model|not found|unsupported|PERMISSION_DENIED|INVALID_ARGUMENT/i.test(
    String(message),
  );
}

export async function runWithGeminiModelFallback<T>(
  runner: (model: string) => Promise<T>,
): Promise<T> {
  let lastError: unknown;

  for (let index = 0; index < GEMINI_MODEL_CANDIDATES.length; index += 1) {
    const model = GEMINI_MODEL_CANDIDATES[index];
    try {
      return await runner(model);
    } catch (error) {
      lastError = error;
      const hasNext = index < GEMINI_MODEL_CANDIDATES.length - 1;
      if (!hasNext || !shouldTryNextGeminiModel(error)) {
        throw error;
      }
    }
  }

  throw lastError;
}

export function isApiKeyPropagationError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : typeof error === 'string' ? error : '';
  return /API_KEY_INVALID|API key expired|API key not valid|key expired/i.test(message);
}

// 신규 키 전파 지연(Google 인증 서버) 대응: API_KEY_INVALID 류 오류만 1회 자동 재시도.
async function withApiKeyPropagationRetry<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (firstError) {
    if (!isApiKeyPropagationError(firstError)) throw firstError;
    await new Promise(resolve => setTimeout(resolve, API_KEY_PROPAGATION_RETRY_DELAY_MS));
    return fn();
  }
}

type GenerateContentArgs = Parameters<InstanceType<typeof GoogleGenAI>['models']['generateContent']>[0];
export type GeminiContents = GenerateContentArgs['contents'];

export interface GeminiCallParams {
  apiKey: string;
  contents: GeminiContents;
  systemInstruction?: string;
}

function buildConfig(systemInstruction?: string) {
  return systemInstruction ? { systemInstruction } : undefined;
}

export async function callGemini({ apiKey, contents, systemInstruction }: GeminiCallParams) {
  return withApiKeyPropagationRetry(() =>
    runWithGeminiModelFallback(model => {
      const ai = new GoogleGenAI({ apiKey });
      return ai.models.generateContent({
        model,
        contents,
        config: buildConfig(systemInstruction),
      });
    }),
  );
}

export async function streamGemini({ apiKey, contents, systemInstruction }: GeminiCallParams) {
  return withApiKeyPropagationRetry(() =>
    runWithGeminiModelFallback(model => {
      const ai = new GoogleGenAI({ apiKey });
      return ai.models.generateContentStream({
        model,
        contents,
        config: buildConfig(systemInstruction),
      });
    }),
  );
}
