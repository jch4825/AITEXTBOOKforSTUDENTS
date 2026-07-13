import ts from 'typescript';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const lessonDir = 'src/data/lessons';
const pecsDir = 'public/lessons/pecs';
const lessonFiles = ['m1.ts', 'm2.ts', 'm3.ts', 'm4.ts', 'm5.ts', 'm6.ts'];

const resolverSource = readFileSync('src/utils/activityIconResolver.ts', 'utf8');
const rules = [...resolverSource.matchAll(/\[(\/.*\/[gimsuy]*),\s*'([^']+)'\]/g)]
  .map((match) => [Function(`return ${match[1]}`)(), match[2]]);
const iconFiles = new Set(
  readdirSync(pecsDir)
    .filter((file) => file.endsWith('.webp'))
    .map((file) => file.replace(/\.webp$/, '')),
);

function resolveActivityIcon(explicitIcon, label) {
  if (explicitIcon) return explicitIcon;
  const normalized = label.replace(/[“”"]/g, '').trim();
  const rule = rules.find(([pattern]) => pattern.test(normalized));
  return rule?.[1];
}

function propName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function getProp(objectExpression, key) {
  if (!objectExpression || !ts.isObjectLiteralExpression(objectExpression)) return undefined;
  return objectExpression.properties
    .find((prop) => ts.isPropertyAssignment(prop) && propName(prop.name) === key)
    ?.initializer;
}

function asString(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return undefined;
}

function asObjectArray(node) {
  return node && ts.isArrayLiteralExpression(node)
    ? node.elements.filter(ts.isObjectLiteralExpression)
    : [];
}

function findLessonArray(sourceFile) {
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        return declaration.initializer;
      }
    }
  }
  return undefined;
}

function lineOf(sourceFile, node) {
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1;
}

const missing = [];
const missingFiles = [];
let total = 0;

for (const file of lessonFiles) {
  const path = join(lessonDir, file);
  const source = readFileSync(path, 'utf8');
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const lessonArray = findLessonArray(sourceFile);
  if (!lessonArray) continue;

  for (const lesson of asObjectArray(lessonArray)) {
    const lessonId = asString(getProp(lesson, 'id')) ?? '?';
    const title = asString(getProp(lesson, 'title')) ?? '';
    const steps = asObjectArray(getProp(lesson, 'steps'));

    const record = (activity, item, label, explicitIcon, side = '') => {
      total += 1;
      const icon = resolveActivityIcon(explicitIcon, label);
      const row = {
        lessonId,
        title,
        file: path.replaceAll('\\', '/'),
        line: lineOf(sourceFile, item),
        activity,
        side,
        label,
        icon: icon ?? '',
      };
      if (!icon) missing.push(row);
      else if (!iconFiles.has(icon) || !existsSync(join(pecsDir, `${icon}.webp`))) missingFiles.push(row);
    };

    steps.forEach((step) => {
      const kind = asString(getProp(step, 'kind'));
      const data = getProp(step, 'data');
      if (kind === 'card-pick') {
        for (const choice of asObjectArray(getProp(data, 'choices'))) {
          record('card-pick', choice, asString(getProp(choice, 'label')) ?? '', asString(getProp(choice, 'icon')));
        }
      } else if (kind === 'matching') {
        for (const pair of asObjectArray(getProp(data, 'pairs'))) {
          const explicitIcon = asString(getProp(pair, 'icon'));
          record('matching', pair, asString(getProp(pair, 'left')) ?? '', explicitIcon, 'left');
          record('matching', pair, asString(getProp(pair, 'right')) ?? '', explicitIcon, 'right');
        }
      } else if (kind === 'sequence') {
        for (const item of asObjectArray(getProp(data, 'items'))) {
          record('sequence', item, asString(getProp(item, 'label')) ?? '', asString(getProp(item, 'icon')));
        }
      }
    });
  }
}

if (missing.length || missingFiles.length) {
  const format = (row) => `${row.file}:${row.line} ${row.lessonId} ${row.activity}${row.side ? `/${row.side}` : ''} "${row.label}"${row.icon ? ` -> ${row.icon}.webp` : ''}`;
  const details = [
    `Activity AAC icon coverage failed.`,
    `Total activity labels: ${total}`,
    `No resolved icon: ${missing.length}`,
    `Missing webp files: ${missingFiles.length}`,
    '',
    ...missing.map(format),
    ...missingFiles.map(format),
  ].join('\n');
  throw new Error(details);
}

console.log(`Activity AAC icon coverage passed for ${total} labels.`);
