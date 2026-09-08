import fs from 'node:fs';
import path from 'node:path';

/*
 * 놀이 파트 바우하우스 계약 검사.
 *
 * 게임 62개는 각자 색을 적고 각자 이모지를 골라 써 왔다. 검사를 걸기 전에 세어 보니
 * 임의 색상 83종이 487번, 이모지가 618번 흩어져 있었다. 한 번에 다 바꿀 수 없으므로
 * 이 검사는 두 가지로 나눠 일한다.
 *
 *  1. **래칫** — 아직 안 바꾼 파일에서도 색과 이모지가 지금보다 늘지 않게 막는다.
 *     오래 걸리는 전환 중에 다른 작업이 옛 문법을 다시 퍼뜨리는 것을 여기서 끊는다.
 *  2. **전환 완료 파일 검사** — MIGRATED에 올린 파일은 규칙을 온전히 지켜야 한다.
 *     파일을 하나 바꿀 때마다 여기에 이름을 올린다. 목록이 62개가 되면 래칫을 걷어낸다.
 */

const root = process.cwd();
const gameRoot = path.join(root, 'src', 'features', 'studio', 'minigames');

/* 경로는 언제나 슬래시로 맞춘다. 개발은 Windows에서 하고 배포 검사는 리눅스에서 도는데,
   구분자를 그대로 두면 목록이 한쪽에서만 맞아 검사가 조용히 아무 일도 하지 않는다. */
const slash = (p) => p.split(path.sep).join('/');

/** 바우하우스 어휘를 정의하는 곳. 여기서만 색을 적을 수 있다. */
const PALETTE_FILES = new Set([
  'engine/bauhaus.ts',
  'engine/BauhausMark.tsx',
]);

/**
 * 바우하우스 어휘로 전환을 마친 파일.
 *
 * 여기 올라온 파일은 임의 색상·이모지·둥근 모서리가 하나도 없어야 한다.
 * 전환할 때마다 한 줄씩 추가한다.
 */
const MIGRATED = new Set([
  'm1/DataBalanceSortGame.tsx',
  'm1/JudgmentCratePushGame.tsx',
  'm1/LensAngleTurnGame.tsx',
  'm1/NextWordRunnerGame.tsx',
  'm1/RobotVacuumPathGame.tsx',
  'm1/SongDrumCheckGame.tsx',
  'm1/SummaryDiffGame.tsx',
  'm1/ToolPipeConnectGame.tsx',
  'm1/VoiceRhythmGame.tsx',
  'm2/ConversationPinballGame.tsx',
  'm2/EvidenceLinkGame.tsx',
  'm2/ExampleGridGame.tsx',
  'm2/FormatPourPathGame.tsx',
  'm2/InfoBlockDropGame.tsx',
  'm2/OneCounterQueueGame.tsx',
  'm2/PreciseAimGame.tsx',
  'm2/StepHookSwingGame.tsx',
  'm2/ToneRoadDriveGame.tsx',
  'm2/VagueSliceGame.tsx',
  'm3/GuessMoleGame.tsx',
  'm3/HardWordBreakGame.tsx',
  'm3/MeaningShiftGame.tsx',
  'm3/QuestionClimbGame.tsx',
  'm3/RecallSnakeGame.tsx',
  'm3/SamePictureMemoryGame.tsx',
  'm3/StoryJumpMapGame.tsx',
  'm3/SumCannonGame.tsx',
  'm3/SummaryMatchGame.tsx',
  'm3/WordStrengthFlyGame.tsx',
  'm4/AdFenceGame.tsx',
  'm4/ChatMazeGame.tsx',
  'm4/ClaimShooterGame.tsx',
  'm4/CodeRequestPushGame.tsx',
  'm4/PhotoCheckDeskGame.tsx',
  'm4/PoliteWordCrossGame.tsx',
  'm4/PrivacyScrubGame.tsx',
  'm4/SourceTowerGame.tsx',
  'm4/StopTimingGame.tsx',
  'm4/UncomfortableDodgeGame.tsx',
  'm5/BoothStackBuildGame.tsx',
  'm5/ClueMergeGame.tsx',
  'm5/KnotUntieGame.tsx',
  'm5/LeakFixPipeGame.tsx',
  'm5/PlanChangeRunGame.tsx',
  'm5/PlanRaceSimGame.tsx',
  'm5/PriorityDispatchGame.tsx',
  'm5/ProblemRigBuildGame.tsx',
  'm5/ResultCheckDiffGame.tsx',
  'm5/StepFlipGame.tsx',
  'm5/TaskSplitFactoryGame.tsx',
]);

/*
 * 전환을 미루는 파일과 그 까닭.
 *
 * m1/AiSpotHuntGame — 물건 33개 가운데 18개의 그림이 아직 없다. 여기서 그림 문자는
 * 장식이 아니라 물건의 정체이고, 고등 학년군은 이름표 없이 그림만 보고 고르므로,
 * 그림이 들어오기 전에 걷어내면 물건 18개가 빈 동그라미가 된다. 색과 모서리는 이미
 * 바우하우스로 옮겼고 그림 문자만 남았다.
 */

/*
 * 래칫 기준선. 2026-09-08 전환 시작 시점의 실측값이다.
 * 전환이 진행되면 이 수치는 내려가기만 해야 한다. 내려가면 여기도 함께 낮춘다.
 */
const BASELINE = { hex: 101, emoji: 212 };

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

const files = walk(gameRoot).filter((f) => /\.(?:ts|tsx)$/.test(f));

const HEX = /#[0-9A-Fa-f]{6}\b/g;
/*
 * 그림으로 쓰는 문자만 잡는다.
 *
 * 한글·한자 영역을 빼고, 글에서 쓰이는 관용 기호도 뺀다. '○'는 한국어에서 빈칸을
 * 나타내는 표기라("○○하는 말로 부탁해요") 아이콘이 아니라 글의 일부다. 낫표 「」와
 * 전각 밑줄 ＿도 마찬가지로 문장부호다. 이것까지 막으면 힌트 문장을 쓸 수 없다.
 */
const TEXT_SYMBOLS = new Set(['○', '「', '」', '＿']);
const isPictograph = (ch) => {
  const c = ch.codePointAt(0);
  return c > 0x2500 && !(c >= 0x3131 && c < 0xd800) && !TEXT_SYMBOLS.has(ch);
};

function countEmoji(source) {
  let n = 0;
  for (const ch of source) if (isPictograph(ch)) n += 1;
  return n;
}

/**
 * 여는 태그의 속성 부분만 잘라 낸다.
 *
 * 정규식 하나로 `<Tag ...>`를 잡으면 `onClick={() => ...}` 안의 `>`에서 끊긴다.
 * 중괄호 깊이를 세어 진짜 태그 끝을 찾는다.
 */
function openingTags(source, tag) {
  const found = [];
  /* 템플릿 리터럴 안에서 `\b`는 백스페이스가 된다. 낱말 경계로 쓰려면 한 번 더 감싼다. */
  const re = new RegExp(`<${tag}\\b`, 'g');
  let match = re.exec(source);
  while (match) {
    let depth = 0;
    let attrs = '';
    for (let i = match.index + match[0].length; i < source.length; i += 1) {
      const ch = source[i];
      if (ch === '{') depth += 1;
      else if (ch === '}') depth -= 1;
      else if (ch === '>' && depth === 0) break;
      attrs += ch;
    }
    found.push(attrs);
    match = re.exec(source);
  }
  return found;
}

const errors = [];
let hexTotal = 0;
let emojiTotal = 0;
let migratedSeen = 0;

for (const file of files) {
  const rel = slash(path.relative(gameRoot, file));
  const source = fs.readFileSync(file, 'utf8');
  const hex = (source.match(HEX) ?? []).length;
  const emoji = countEmoji(source);

  if (PALETTE_FILES.has(rel)) continue;

  hexTotal += hex;
  emojiTotal += emoji;

  if (!MIGRATED.has(rel)) continue;
  migratedSeen += 1;

  /* 전환한 파일은 색을 직접 적지 않는다. engine의 BAUHAUS와 CSS의 --game-* 만 쓴다. */
  if (hex > 0) {
    const found = [...new Set(source.match(HEX))].slice(0, 6).join(', ');
    errors.push(`${rel}: 임의 색상 ${hex}개가 남아 있습니다 (${found}). BAUHAUS 토큰을 쓰세요.`);
  }
  if (emoji > 0) {
    errors.push(`${rel}: 이모지·기호 ${emoji}개가 남아 있습니다. drawMark나 BauhausMark로 바꾸세요.`);
  }
  /* 둥근 모서리를 쓰지 않는다. 원은 원으로 그리고, 사각형은 사각형으로 둔다. */
  if (/roundRect|fillRoundRect|roundRectPath|borderRadius/.test(source)) {
    errors.push(`${rel}: 둥근 모서리를 쓰고 있습니다. 바우하우스에서 모서리는 각지거나 완전한 원입니다.`);
  }
  const rounded = [...source.matchAll(/\brounded-(?!full\b)[a-z0-9[\]]+/g)].map((m) => m[0]);
  if (rounded.length > 0) {
    errors.push(`${rel}: 둥근 모서리 클래스 ${[...new Set(rounded)].join(', ')} — rounded-full만 허용합니다.`);
  }
  /* 옛 팔레트를 함께 쓰면 두 체계가 섞인다. */
  if (/\bPLAY\.|\bBOARD\./.test(source)) {
    errors.push(`${rel}: 옛 팔레트(PLAY/BOARD)를 아직 쓰고 있습니다. BAUHAUS로 옮기세요.`);
  }
  if (/backdrop-(?:blur|filter)|box-shadow|shadow-(?:sm|md|lg|xl)/.test(source)) {
    errors.push(`${rel}: 그림자와 블러는 쓰지 않습니다.`);
  }
  /*
   * 프레임·판·HUD는 두 어휘를 함께 안고 가는 동안 bauhaus 플래그로 갈래를 고른다.
   * 플래그를 빠뜨리면 게임 안은 바뀌었는데 남은 기회는 하트, 남은 시간은 모래시계로
   * 남는다. 실제로 m3-l8에서 그렇게 새 나갔다 — 여러 줄로 쓴 태그를 놓쳤기 때문이다.
   */
  for (const tag of ['MiniGameFrame', 'GameHud', 'GameStage']) {
    for (const attrs of openingTags(source, tag)) {
      if (!/\bbauhaus\b/.test(attrs)) {
        errors.push(`${rel}: <${tag}>에 bauhaus가 빠졌습니다. 옛 갈래로 그려집니다.`);
      }
    }
  }
}

/* 어휘를 정의하는 파일이 사라지거나 비면 나머지 검사가 통째로 무의미해진다. */
for (const rel of PALETTE_FILES) {
  if (!fs.existsSync(path.join(gameRoot, rel))) {
    errors.push(`바우하우스 어휘 파일이 없습니다: ${rel}`);
  }
}

if (hexTotal > BASELINE.hex) {
  errors.push(`임의 색상이 기준선보다 늘었습니다: ${hexTotal} > ${BASELINE.hex}. 새 색을 적지 말고 BAUHAUS 토큰을 쓰세요.`);
}
if (emojiTotal > BASELINE.emoji) {
  errors.push(`이모지가 기준선보다 늘었습니다: ${emojiTotal} > ${BASELINE.emoji}. drawMark나 BauhausMark를 쓰세요.`);
}

if (errors.length > 0) {
  console.error('Game visual contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

const total = files.filter((f) => /[/\\]m[1-6][/\\]/.test(f)).length;
console.log(
  `Game visual contract passed: 바우하우스 전환 ${migratedSeen}/${total}개, `
  + `남은 임의 색상 ${hexTotal}/${BASELINE.hex}, 남은 이모지 ${emojiTotal}/${BASELINE.emoji}.`,
);
