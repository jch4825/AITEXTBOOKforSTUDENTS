export const GEMINI_MODEL_CANDIDATES = ['gemini-3-flash-preview', 'gemini-2.5-flash'] as const;

export const GEMINI_MODEL_GUIDE = 'Gemini 3 Flash Preview 또는 Gemini 2.5 Flash';

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
