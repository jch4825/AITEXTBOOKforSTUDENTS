import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let vite;
let ConceptNotes;
let SettingsProvider;

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true },
  });
  ({ default: ConceptNotes } = await vite.ssrLoadModule('/src/features/studio/components/ConceptNotes.tsx'));
  ({ SettingsProvider } = await vite.ssrLoadModule('/src/context/SettingsContext.tsx'));
});

after(async () => {
  await vite?.close();
});

const KNOWLEDGE = [{
  title: '카드 제목',
  core: '정리된 정의 문장',
  detail: { full: '가장 쉬운 풀이 문장', light: '중학 풀이 문장', challenge: '고등 풀이 문장' },
}];

function render(supportLevel) {
  const notes = createElement(ConceptNotes, {
    knowledge: KNOWLEDGE,
    supportLevel,
    accent: '#5d4c8a',
    dictionaryTerms: [],
  });
  /* 듣기 단추의 useSpeak이 설정 컨텍스트를 요구한다. */
  return renderToStaticMarkup(createElement(SettingsProvider, null, notes));
}

/* 충분한 지원에서 detail.full을 한 번도 그리지 않아, 가장 쉬운 글 186개가 화면에 나오지 않은 적이 있다. */
test('충분한 지원은 가장 쉬운 글을 중심 문장으로 그리고 core는 접어 둔다', () => {
  const html = render('full');
  const [beforeFold, fold = ''] = html.split('<details');

  assert.ok(beforeFold.includes('<strong>가장 쉬운 풀이 문장</strong>'), 'detail.full이 중심 문장이어야 한다');
  assert.ok(!beforeFold.includes('정리된 정의 문장'), 'core가 접히지 않고 바깥에 나와 있다');
  assert.ok(fold.includes('정리된 정의 문장'), 'core는 접힌 영역 안에 있어야 한다');
  assert.ok(fold.includes('자세한 설명 보기'));
  assert.ok(!html.includes('open=""'), '처음에는 접혀 있어야 한다');
});

test('중학과 고등은 core를 중심 문장으로, 그 수준의 풀이를 아래에 그린다', () => {
  for (const [level, detail] of [['light', '중학 풀이 문장'], ['challenge', '고등 풀이 문장']]) {
    const html = render(level);
    assert.ok(html.includes('<strong>정리된 정의 문장</strong>'), `${level}: core가 중심 문장이어야 한다`);
    assert.ok(html.includes(detail), `${level}: 풀이 문장이 보여야 한다`);
    assert.ok(!html.includes('가장 쉬운 풀이 문장'), `${level}: 충분한 지원 글이 섞이면 안 된다`);
    assert.ok(!html.includes('<details'), `${level}: 접는 영역이 없어야 한다`);
  }
});
