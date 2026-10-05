import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

let vite;
let korean;

before(async () => {
  vite = await createServer({
    configFile: false,
    appType: 'custom',
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true },
  });
  korean = await vite.ssrLoadModule('/src/features/studio/minigames/engine/korean.ts');
});

after(async () => {
  await vite?.close();
});

test('은/는, 을/를, 이/가, 과/와는 받침 유무로 고른다', () => {
  assert.equal(korean.topicOf('봄바람'), '봄바람은');
  assert.equal(korean.topicOf('도구'), '도구는');
  assert.equal(korean.objectOf('준비물 목록'), '준비물 목록을');
  assert.equal(korean.objectOf('작은 우유'), '작은 우유를');
  assert.equal(korean.subjectOf('땅콩'), '땅콩이');
  assert.equal(korean.subjectOf('우유'), '우유가');
  assert.equal(korean.withOf('땅콩'), '땅콩과');
  assert.equal(korean.withOf('우유'), '우유와');
});

test('(으)로는 받침이 없거나 ㄹ 받침이면 로, 그 밖의 받침이면 으로다', () => {
  assert.equal(korean.viaOf('그림 만들기 도구'), '그림 만들기 도구로');
  assert.equal(korean.viaOf('거실'), '거실로');
  assert.equal(korean.viaOf('숙제 부탁 글'), '숙제 부탁 글로');
  assert.equal(korean.viaOf('탁 트인 넓은 방'), '탁 트인 넓은 방으로');
  assert.equal(korean.viaOf('책'), '책으로');
});

test('한글이 아닌 끝 글자는 받침이 없는 것으로 본다', () => {
  assert.equal(korean.topicOf('AI'), 'AI는');
  assert.equal(korean.viaOf('AI'), 'AI로');
});
