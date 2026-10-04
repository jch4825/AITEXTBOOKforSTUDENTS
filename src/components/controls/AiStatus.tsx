import { useSyncExternalStore } from 'react';
import { hasApiKey, subscribeApiKey } from '../../utils/apiKey';

/**
 * 상단 바의 인공지능 연결 표시. 교사가 AI를 연결했는지를 학생도 교사도 한눈에 본다.
 *
 * 누르는 단추가 아니라 상태 표시다. 학생 화면에는 키·모델 이름·기술 오류를 내지 않으므로
 * '연결됨'과 '연결 안됨'만 밝힌다. 교사가 키를 넣거나 빼면 새로 고치지 않아도 바로 바뀐다.
 * 좁은 폭에서는 'AI'로 줄여 상단 바가 비좁아지지 않게 한다.
 */
export default function AiStatus() {
  const connected = useSyncExternalStore(subscribeApiKey, hasApiKey, () => false);
  const state = connected ? '연결됨' : '연결 안됨';

  return (
    <span
      role="status"
      data-ai-status={connected ? 'connected' : 'disconnected'}
      className={`ai-status ${connected ? 'is-on' : 'is-off'}`}
      title={connected ? '인공지능이 연결되어 있어요.' : '인공지능이 연결되어 있지 않아요. 준비된 답으로 진행해요.'}
    >
      <span className="ai-status-dot" aria-hidden />
      <span className="hidden lg:inline">인공지능 {state}</span>
      <span className="lg:hidden">AI {state}</span>
    </span>
  );
}
