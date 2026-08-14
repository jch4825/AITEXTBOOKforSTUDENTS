/**
 * 학생 노출 문체 계약.
 *
 * 옛 계약은 학생 문장이 `~요`로 끝나면 실패시켰다. 그러나 해요체도 존댓말(두루높임)이며,
 * 이 교재는 화자별로 어체를 나눠 쓴다 — 서술은 합니다체, 또래 인물끼리는 반말,
 * 아이미와 학생에게 건네는 말은 해요체. 68차시 전면 재집필이 그 방향으로 이뤄졌다.
 * 그 결과 3천 건 넘게 실패해 검사가 사실상 꺼져 있었고, 정작 앱이 학생에게 반말로
 * 말하는 자리는 통과시키고 있었다.
 *
 * 그리고 옛 계약을 기계로 강제한 커밋이 PECS 카드 라벨을 합니다체로 바꾸면서
 * 「애매하게 물습니다」(묻다가 물다로 바뀜), 「가방 챙겨습니다」 같은 비문을 만들고,
 * 카드 이미지에 인쇄된 글자(「세게 밀어요」)와 화면 라벨(「세게 미십시오」)을 어긋나게 했다.
 * 인쇄된 낱말과 화면 낱말을 짝지어 읽는 것이 이 도구의 사용법이므로 그대로 둘 수 없다.
 *
 * 그래서 계약을 다시 쓴다.
 *  1. 앱이 학생에게 직접 건네는 말(UI·게임 피드백)에 반말을 쓰지 않는다.
 *  2. PECS 라벨은 카드 이미지에 인쇄된 해요체와 어체를 맞춘다.
 * 인물 간 대사와 인용문은 서사의 일부이므로 검사 대상이 아니다(src/data 제외).
 */
import fs from 'node:fs';
import path from 'node:path';

const findings = [];

/**
 * 앱이 학생에게 직접 말하는 영역.
 * src/data는 이야기·대사·인용이 사는 곳이라 제외한다.
 */
const SYSTEM_VOICE_ROOTS = ['src/components', 'src/features', 'src/views'];

/** 해체·해라체 종결. 문어체 `~한다/~이다`는 교사용 서술이므로 넣지 않는다. */
const BANMAL = /[가-힣](?:했어|하자|해라|이야|거야|하니|하냐|맞지|봐봐|보자|줄게|할래|아냐|어때)(?:[.!?]|$)/;

function collect(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // 교사 화면은 교사용 문어체를 쓴다.
      if (entry.name !== 'teacher') collect(full, out);
    } else if (/\.(ts|tsx)$/.test(entry.name) && entry.name !== 'TeacherView.tsx') {
      out.push(full);
    }
  }
  return out;
}

for (const root of SYSTEM_VOICE_ROOTS) {
  for (const file of collect(root)) {
    const source = fs.readFileSync(file, 'utf8')
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '');
    const literalRe = /(['"`])(?:\\.|(?!\1)[^\\])*\1/g;
    let match;
    while ((match = literalRe.exec(source))) {
      const value = match[0].slice(1, -1);
      if (!/[가-힣]/.test(value)) continue;
      // 인용부호 안은 인물이나 학생이 한 말을 옮긴 것이므로 제외한다.
      if (/["“”]/.test(value)) continue;
      // 학생이 아이미에게 건네는 질문과 게임 속 아이미 출력 낱말은 앱의 목소리가 아니다.
      // 학생은 도구인 아이미에게 편하게 말하고, 게임 말풍선은 아이미가 만든 답을 흉내낸다.
      const lead = source.slice(Math.max(0, match.index - 400), match.index);
      const afterQuestions = lead.split('suggestedQuestions').slice(1).pop();
      if (afterQuestions !== undefined && !afterQuestions.includes(';')) continue;
      if (/\bword\s*:\s*$/.test(lead.trimEnd().slice(-30))) continue;
      if (BANMAL.test(value)) {
        findings.push(`${path.relative(process.cwd(), file)}: ${value}`);
      }
    }
  }
}

// PECS 라벨은 카드 이미지에 인쇄된 해요체와 어체를 맞춘다(src/data/pecs.ts 머리말 규칙).
const pecs = fs.readFileSync('src/data/pecs.ts', 'utf8');
const labelBlock = pecs.slice(pecs.indexOf('PECS_LABELS'), pecs.indexOf('};', pecs.indexOf('PECS_LABELS')));
for (const [, key, label] of labelBlock.matchAll(/(\w+):\s*'([^']*)'/g)) {
  if (/(습니다|십시오)$/.test(label)) {
    findings.push(`src/data/pecs.ts: ${key} = ${label} — 카드 이미지의 해요체와 어긋난다`);
  }
}

if (findings.length) {
  console.error(`student style contract failed: ${findings.length}건`);
  console.error(findings.slice(0, 40).join('\n'));
  if (findings.length > 40) console.error(`... 외 ${findings.length - 40}건`);
  process.exit(1);
}

console.log('student style contract: 학생에게 건네는 말에 반말 없음, PECS 라벨 어체 일치');
