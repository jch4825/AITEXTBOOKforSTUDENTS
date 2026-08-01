import fs from 'node:fs';
import path from 'node:path';

/**
 * 스튜디오 모듈 원문 읽기.
 *
 * 2차 리모델링 정돈에서 src/data/studios/mN.ts 가 mN/l01.ts…lNN.ts + index.ts 로
 * 분할되었다. 검사 스크립트들은 여전히 "모듈 전체 원문"에 대한 포함 검사를 하므로,
 * 옛 경로(mN.ts)를 받으면 폴더의 파일들을 레슨 순서대로 이어 붙여 돌려준다.
 * 분할되지 않은 일반 파일 경로는 그대로 읽는다.
 */
export function readStudioSource(requestedPath) {
  if (fs.existsSync(requestedPath)) {
    return fs.readFileSync(requestedPath, 'utf8');
  }
  const base = path.basename(requestedPath);
  const match = base.match(/^(m\d)\.ts$/);
  const moduleDir = match ? path.join(path.dirname(requestedPath), match[1]) : null;
  if (moduleDir && fs.existsSync(moduleDir)) {
    const entries = fs.readdirSync(moduleDir).filter((name) => name.endsWith('.ts'));
    const ordered = [
      ...entries.filter((name) => name === 'shared.ts'),
      ...entries.filter((name) => /^l\d+\.ts$/.test(name)).sort(),
      ...entries.filter((name) => name === 'index.ts'),
    ];
    return ordered.map((name) => fs.readFileSync(path.join(moduleDir, name), 'utf8')).join('\n');
  }
  throw new Error(`${requestedPath} is missing`);
}
