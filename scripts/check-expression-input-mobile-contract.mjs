import fs from 'node:fs';

const inputPath = 'src/components/mission/blocks/ExpressionInput.tsx';
const studioModesPath = 'src/data/studios/shared.ts';
const moduleClosePath = 'src/features/studio/ModuleCloseLessonView.tsx';

for (const file of [inputPath, studioModesPath, moduleClosePath]) {
  if (!fs.existsSync(file)) throw new Error(`expression input contract file is missing: ${file}`);
}

const input = fs.readFileSync(inputPath, 'utf8');
const studioModes = fs.readFileSync(studioModesPath, 'utf8');
const moduleClose = fs.readFileSync(moduleClosePath, 'utf8');

if (!input.includes("choice: '문장 고르기'")) {
  throw new Error('생활 장면의 선택 방식은 문장 고르기로 표시해야 합니다.');
}

const thoughtInputClass = input.match(/aria-label="내 생각"[\s\S]*?className="([^"]+)"/)?.[1] ?? '';
if (!thoughtInputClass.split(/\s+/).includes('min-w-0')) {
  throw new Error('모바일에서 글 입력칸이 줄어들 수 있도록 min-w-0가 필요합니다.');
}

const responseBlock = input.slice(
  input.indexOf("(activeMode === 'text' || activeMode === 'speech')"),
  input.indexOf("activeMode === 'draw'"),
);
const micIndex = responseBlock.indexOf('<MicButton');
const inputIndex = responseBlock.indexOf('<input');
if (micIndex === -1) {
  throw new Error('말로 말하기에 마이크 버튼이 필요합니다.');
}
if (micIndex > inputIndex) {
  throw new Error('말로 말하기의 마이크 버튼은 글 입력칸 왼쪽에 있어야 합니다.');
}

// 그림 카드('aac')는 선택지마다 전용 카드(data/choiceCards/)를 갖춘 뒤에 표현 목록에 들어왔다.
// 예전에는 전용 카드가 없어 '그림 카드' 탭이 문장 고르기와 같은 문장을 두 번 보여 줬기 때문에 목록에서 뺐다.
// 카드가 없는 차시에서는 어댑터가 'aac'를 걸러 내므로 그 빈 탭은 다시 생기지 않는다(check:choice-cards).
if (!studioModes.includes("['choice', 'aac', 'text', 'speech', 'draw']")) {
  throw new Error("생활 장면 표현 목록은 문장 고르기 다음에 그림 카드('aac')가 있어야 합니다.");
}
if (!moduleClose.includes("['choice', 'aac', 'text', 'speech']")) {
  throw new Error("단원 마무리 표현 목록은 문장 고르기 다음에 그림 카드('aac')가 있어야 합니다.");
}

console.log('mobile expression input contract passed');
