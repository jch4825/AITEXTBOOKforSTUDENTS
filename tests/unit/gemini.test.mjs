import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { createServer } from 'vite';

const originalFetch = globalThis.fetch;
const originalLocalStorage = globalThis.localStorage;

let vite;
let askGemini;
let getLessonSystemPrompt;

function geminiResponse(text, finishReason = 'STOP') {
  return new Response(JSON.stringify({
    candidates: [{
      content: { parts: [{ text }] },
      finishReason,
    }],
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

before(async () => {
  globalThis.localStorage = {
    getItem: (key) => key === 'ai-students-gemini-key' ? 'test-only-key' : null,
    setItem: () => {},
    removeItem: () => {},
  };

  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true },
  });
  ({ askGemini } = await vite.ssrLoadModule('/src/utils/gemini.ts'));
  ({ getLessonSystemPrompt } = await vite.ssrLoadModule('/src/data/lessonSystemPrompts.ts'));
});

beforeEach(() => {
  globalThis.fetch = originalFetch;
});

after(async () => {
  globalThis.fetch = originalFetch;
  if (originalLocalStorage === undefined) {
    delete globalThis.localStorage;
  } else {
    globalThis.localStorage = originalLocalStorage;
  }
  await vite?.close();
});

test('차시별 지침이 있어도 모든 요청에 한국어 완결 응답 계약을 함께 보낸다', async () => {
  let sentBody;
  globalThis.fetch = async (_url, init) => {
    sentBody = JSON.parse(init.body);
    return geminiResponse('학생에게 보여 줄 답변입니다.');
  };

  await askGemini('무엇을 배웠나요?', '이 차시에서는 입력과 결과의 관계를 설명합니다.');

  const systemText = sentBody.systemInstruction.parts[0].text;
  assert.match(systemText, /이 차시에서는 입력과 결과의 관계/);
  assert.match(systemText, /기본 응답 언어는 한국어/);
  assert.match(systemText, /2~3문장/);
  assert.match(systemText, /완결/);
});

test('개별 지침이 없는 차시도 제목과 학습목표를 시스템 입력에 포함한다', () => {
  const systemText = getLessonSystemPrompt('m2-l1', {
    title: '빠진 정보를 찾아요',
    objective: '요청에서 빠진 정보를 찾아 안전하게 더해 봐요.',
  });

  assert.match(systemText, /빠진 정보를 찾아요/);
  assert.match(systemText, /요청에서 빠진 정보를 찾아 안전하게 더해 봐요/);
});

test('이야기 속 등장인물 이름을 현재 학생의 이름으로 사용하지 않는다', async () => {
  let sentBody;
  globalThis.fetch = async (_url, init) => {
    sentBody = JSON.parse(init.body);
    return geminiResponse('이름을 정하지 않고 학생의 질문에 답합니다.');
  };

  const lessonInstruction = getLessonSystemPrompt('m1-l1', {
    title: '아이미와 처음 만난 날',
    objective: 'AI가 할 수 있는 일을 알아봅니다.',
    situation: '윤아와 진우가 민준 선생님과 아이미를 만났습니다.',
  });
  await askGemini('내가 누구야?', lessonInstruction);

  const systemText = sentBody.systemInstruction.parts[0].text;
  assert.doesNotMatch(systemText, /윤아|진우|민준/);
  assert.match(systemText, /이름을 직접 알려 주지 않는 한/);
  assert.match(systemText, /이름을 추측/);
});

test('자연 종료된 응답은 마지막 문장부호가 없어도 내용을 임의로 자르지 않는다', async () => {
  globalThis.fetch = async () => geminiResponse(
    '첫 문장입니다. 둘째 문장도 온전히 남습니다',
    'STOP',
  );

  const result = await askGemini('전체 답을 보여 주세요.');

  assert.equal(result.text, '첫 문장입니다. 둘째 문장도 온전히 남습니다');
});

test('MAX_TOKENS로 끊긴 응답은 학생에게 내보내지 않고 다음 모델의 완결 응답을 사용한다', async () => {
  let callCount = 0;
  globalThis.fetch = async () => {
    callCount += 1;
    return callCount === 1
      ? geminiResponse('첫 모델의 끝나지 않은 응답', 'MAX_TOKENS')
      : geminiResponse('두 번째 모델의 완결된 응답입니다.', 'STOP');
  };

  const result = await askGemini('완결된 답을 주세요.');

  assert.equal(result.text, '두 번째 모델의 완결된 응답입니다.');
  assert.equal(callCount, 2);
});

test('영어로만 온 응답은 학생에게 내보내지 않고 한국어 응답 모델로 넘긴다', async () => {
  let callCount = 0;
  globalThis.fetch = async () => {
    callCount += 1;
    return callCount === 1
      ? geminiResponse('Here is a simple answer for the student.', 'STOP')
      : geminiResponse('학생에게 보여 줄 쉬운 한국어 답변입니다.', 'STOP');
  };

  const result = await askGemini('한국어로 알려 주세요.');

  assert.equal(result.text, '학생에게 보여 줄 쉬운 한국어 답변입니다.');
  assert.equal(callCount, 2);
});

test('화면을 떠나 취소한 요청은 응답이나 음성을 만들 수 있도록 완료되지 않는다', async () => {
  globalThis.fetch = async (_url, init) => new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => resolve(geminiResponse('늦게 도착한 예전 응답입니다.')),
      40,
    );
    init.signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    }, { once: true });
  });

  const controller = new AbortController();
  const pending = askGemini(
    '이 요청은 곧 취소됩니다.',
    undefined,
    undefined,
    { signal: controller.signal },
  );
  controller.abort();

  await assert.rejects(pending, (error) => error?.kind === 'cancelled');
});
