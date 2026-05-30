const ENDPOINT = import.meta.env.VITE_BUG_REPORT_URL as string | undefined;

export interface BugReportPayload {
  title: string;
  description: string;
  contact?: string;
}

interface BugReportContext {
  userAgent: string;
  viewport: string;
  url: string;
  timestamp: string;
}

export function isBugReportEnabled(): boolean {
  return typeof ENDPOINT === 'string' && ENDPOINT.length > 0;
}

function getContext(): BugReportContext {
  return {
    userAgent: navigator.userAgent,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    url: window.location.href,
    timestamp: new Date().toISOString(),
  };
}

export async function submitBugReport(payload: BugReportPayload): Promise<void> {
  if (!ENDPOINT) {
    throw new Error('버그 신고 URL이 설정되지 않았습니다.');
  }
  const body = JSON.stringify({ ...payload, ...getContext() });
  // Content-Type을 생략하면 브라우저가 text/plain으로 보내 CORS preflight를 발생시키지 않음
  // (Apps Script Web App과 호환되는 표준 패턴)
  const res = await fetch(ENDPOINT, { method: 'POST', body });
  if (!res.ok) {
    throw new Error(`전송 실패 (HTTP ${res.status})`);
  }
  const data = await res.json().catch(() => null);
  if (data && data.ok === false) {
    throw new Error(data.error || '서버 응답 오류');
  }
}
