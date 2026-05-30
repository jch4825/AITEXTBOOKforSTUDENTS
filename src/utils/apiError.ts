type ErrorLike = {
  message?: unknown;
  status?: unknown;
  code?: unknown;
  statusText?: unknown;
  cause?: unknown;
};

function asErrorLike(value: unknown): ErrorLike {
  return typeof value === 'object' && value !== null ? (value as ErrorLike) : {};
}

function readString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function readMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  const obj = asErrorLike(error);
  const cause = asErrorLike(obj.cause);
  const parts = [readString(obj.message), readString(obj.statusText), readString(cause.message)];
  return parts.filter(Boolean).join(' ');
}

function readStatus(error: unknown): string {
  const obj = asErrorLike(error);
  if (typeof obj.status === 'string') return obj.status;
  if (typeof obj.status === 'number') return String(obj.status);
  return '';
}

function readCode(error: unknown): number | null {
  const obj = asErrorLike(error);
  return typeof obj.code === 'number' ? obj.code : null;
}

function isQuotaError(error: unknown, message: string): boolean {
  const status = readStatus(error);
  const code = readCode(error);
  if (status === 'RESOURCE_EXHAUSTED') return true;
  if (code === 429) return true;
  return /(\b429\b|RESOURCE_EXHAUSTED|\bquota\b)/i.test(message);
}

function isAuthError(error: unknown, message: string): boolean {
  const status = readStatus(error);
  const code = readCode(error);
  if (status === 'UNAUTHENTICATED' || status === 'PERMISSION_DENIED') return true;
  if (code === 401 || code === 403) return true;
  // 400 + key-specific signals → 키 문제로 분류. 일반 400(잘못된 입력)은 unknown으로 떨어지게 둠.
  if ((code === 400 || /\b400\b/.test(message)) && /API[_ ]?KEY|API key|UNAUTHENTICATED|PERMISSION_DENIED/i.test(message)) {
    return true;
  }
  return /(API_KEY_INVALID|API key not valid|API key expired|key expired|UNAUTHENTICATED|PERMISSION_DENIED)/i.test(message);
}

// 키 자체는 유효하지만 키가 속한 Google 계정/프로젝트가 차단된 경우.
// 초등 교사가 학교/교육청 Workspace 계정으로 키를 발급할 때 자주 발생.
function isProjectDeniedError(error: unknown, message: string): boolean {
  const status = readStatus(error);
  if (status !== 'PERMISSION_DENIED' && !/PERMISSION_DENIED/i.test(message)) return false;
  return /denied access|project.*(denied|blocked|disabled)/i.test(message);
}

function isNetworkError(error: unknown, message: string): boolean {
  if (error instanceof TypeError) return true;
  const cause = asErrorLike(asErrorLike(error).cause);
  if (cause instanceof TypeError) return true;
  // 메시지 시작/경계 매칭으로 "Failed to generate" 같은 일반 실패 메시지 오분류 차단.
  return /^Failed to fetch\b|^NetworkError\b|\b(ECONNRESET|ECONNREFUSED|ENOTFOUND|ETIMEDOUT)\b/i.test(message);
}

export function friendlyApiError(error: unknown, opts?: { markdown?: boolean }): string {
  const md = opts?.markdown ?? false;
  const message = readMessage(error);

  if (isQuotaError(error, message)) {
    return md
      ? '⏳ **API 무료 한도를 초과했습니다.**\n\n- 무료 티어는 분당/일일 요청 수 제한이 있습니다.\n- 잠시 후(보통 1분 이내) 다시 시도해 주세요.\n- 오늘 한도를 모두 사용한 경우 내일 자동으로 초기화됩니다.'
      : '⏳ API 무료 한도를 초과했습니다. 잠시 후(보통 1분 이내) 다시 시도하거나, 오늘 한도를 모두 사용한 경우 내일 다시 시도해 주세요.';
  }

  if (isAuthError(error, message)) {
    if (isProjectDeniedError(error, message)) {
      return md
        ? '🚫 **Google에서 이 프로젝트의 접근을 차단했습니다.**\n\n키 자체는 유효하지만 키가 속한 Google 계정/프로젝트가 차단된 상태입니다. 흔한 원인:\n\n1. **학교·교육청에서 발급한 Workspace 계정** — 관리자가 외부 AI 서비스 접근을 막아둔 경우가 많습니다. **개인 Gmail 계정**으로 [새 키를 발급](https://aistudio.google.com/app/apikey)받아 보세요.\n2. **이전 키가 공개 저장소(GitHub 등)에 노출**되어 Google이 프로젝트를 자동 차단한 경우 — 다른 Google 계정으로 새 키를 발급받아 주세요.\n3. 그 외 약관 위반·보안 검토 중인 경우 — [Google 지원](https://support.google.com/code/contact/aistudio_keys_help)에 문의해 주세요.'
        : '🚫 Google에서 이 프로젝트의 접근을 차단했습니다. 키는 유효하지만 계정/프로젝트가 차단된 상태입니다. 학교 Workspace 계정이라면 개인 Gmail 계정으로 새 키를 발급해 보세요.';
    }
    return md
      ? '🔑 **API 키가 인식되지 않습니다.**\n\n다음 세 가지를 차례로 확인해 주세요:\n\n1. **신규 발급한 키인가요?** — Google이 키를 활성화하는 데 보통 **30초~1분** 정도 걸립니다. 잠시 후 다시 시도해 보세요.\n2. **키가 정확히 입력되었나요?** — 사이드바의 "API 키 등록"에서 키 앞뒤 공백·따옴표가 섞이지 않았는지, "AIza" 또는 "AQ."로 시작하는지 확인해 주세요.\n3. **키가 폐기되지는 않았나요?** — 채팅이나 공개된 곳에 노출된 키는 Google이 자동으로 폐기합니다. [Google AI Studio](https://aistudio.google.com/app/apikey)에서 새 키를 발급받아 주세요.'
      : '🔑 API 키가 인식되지 않습니다. 신규 키라면 활성화에 30초~1분 걸릴 수 있으니 잠시 후 다시 시도하거나, 키가 정확히 입력되었는지(앞뒤 공백·따옴표 없이 "AIza" 또는 "AQ." 시작) 확인해 주세요. 그래도 안 되면 Google AI Studio에서 새 키를 발급받아 주세요.';
  }

  if (isNetworkError(error, message)) {
    return md
      ? '📡 **네트워크 연결을 확인해 주세요.**\n\n인터넷 연결 상태를 확인한 뒤 다시 시도해 주세요.'
      : '📡 네트워크 연결을 확인해 주세요. 인터넷이 연결되었는지 확인한 뒤 다시 시도해 주세요.';
  }

  return md
    ? '⚠️ **알 수 없는 오류가 발생했습니다.**\n\n잠시 후 다시 시도해 주세요.'
    : '⚠️ 알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
}
