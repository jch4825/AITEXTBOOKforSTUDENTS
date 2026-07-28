import fs from 'node:fs';
import path from 'node:path';

/**
 * 지원 수준 프로필 소비 검사.
 *
 * SupportProfile은 지원 수준별 개별화의 유일한 정의 지점이다. 그런데 값이 정의되어 있어도
 * 화면이 읽지 않으면 교사에게는 개별화가 되는 것처럼 보이고 학생은 같은 화면을 본다.
 * 타입 검사도 계약 검사도 이 상태를 통과시키므로 여기서 따로 막는다.
 *
 * 규약: 스튜디오 화면은 `const profile = definition.supportProfiles[state.supportLevel]`로
 * 프로필을 받은 뒤 `profile.<필드>`로 읽는다. 이 접근이 한 번도 없는 필드는 실패다.
 * 지역 변수 이름을 바꾸려면 이 스크립트의 ACCESS_PATTERN도 함께 고쳐야 한다.
 */

const root = process.cwd();
const typesPath = path.join(root, 'src', 'features', 'studio', 'types.ts');
const valuesPath = path.join(root, 'src', 'data', 'studios', 'shared.ts');
const searchRoot = path.join(root, 'src');

const ACCESS_PATTERN = (field) => new RegExp(`\\bprofile\\.${field}\\b`);

const typesSource = fs.readFileSync(typesPath, 'utf8');
const block = typesSource.match(/export interface SupportProfile\s*\{([\s\S]*?)\n\}/);
if (!block) {
  console.error('SupportProfile 인터페이스를 읽지 못했습니다.');
  process.exit(1);
}

const fields = [...block[1].matchAll(/^\s*(\w+)\??:/gm)].map((match) => match[1]);
if (fields.length === 0) {
  console.error('SupportProfile에서 필드를 하나도 찾지 못했습니다.');
  process.exit(1);
}

function walk(dir) {
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(full));
    else if (/\.tsx?$/.test(entry.name)) found.push(full);
  }
  return found;
}

// 정의 파일에서의 등장은 선언이지 소비가 아니다.
const definitionFiles = new Set([typesPath, valuesPath].map((file) => path.resolve(file)));
const files = walk(searchRoot).filter((file) => !definitionFiles.has(path.resolve(file)));
const sources = new Map(files.map((file) => [file, fs.readFileSync(file, 'utf8')]));

const errors = [];
const summary = [];

for (const field of fields) {
  const pattern = ACCESS_PATTERN(field);
  const users = files.filter((file) => pattern.test(sources.get(file)));
  if (users.length === 0) {
    errors.push(
      `SupportProfile.${field}가 정의만 되어 있고 화면에서 읽히지 않습니다. `
      + `shared.ts에 값이 있어도 학생 화면은 달라지지 않습니다.`,
    );
    continue;
  }
  summary.push(
    `${field}: ${users.length}곳 (${users.map((file) => path.basename(file)).join(', ')})`,
  );
}

// 값 정의 쪽도 함께 본다. 필드가 늘었는데 shared.ts가 따라오지 않으면 지원 수준 하나가 빈다.
const valuesSource = fs.readFileSync(valuesPath, 'utf8');
for (const level of ['full', 'light', 'challenge']) {
  const levelBlock = valuesSource.match(new RegExp(`${level}:\\s*\\{([\\s\\S]*?)\\}`));
  if (!levelBlock) {
    errors.push(`STUDIO_SUPPORT_PROFILES에 ${level} 수준이 없습니다.`);
    continue;
  }
  const missing = fields.filter((field) => !new RegExp(`\\b${field}\\s*:`).test(levelBlock[1]));
  // choiceLimit처럼 선택적 필드는 빠져도 된다.
  const required = missing.filter((field) => !new RegExp(`\\b${field}\\?:`).test(block[1]));
  if (required.length > 0) {
    errors.push(`STUDIO_SUPPORT_PROFILES.${level}에 ${required.join(', ')} 값이 없습니다.`);
  }
}

if (errors.length > 0) {
  console.error('Support consumption contract failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Support consumption contract passed: ${fields.length} fields wired.`);
for (const line of summary) console.log(`  ${line}`);
