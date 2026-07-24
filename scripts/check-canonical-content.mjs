import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const isRegistryOnly = args.includes('--registry');
const isMigratedOnly = args.includes('--migrated');
const isAll = args.includes('--all');
const moduleArg = args.find(a => a.startsWith('--module='))?.split('=')[1];
const roleArg = args.find(a => a.startsWith('--role='))?.split('=')[1];

const MODULE_ROLES = {
  m1: { flagship: 3, guided: 7, project: 1, total: 11 },
  m2: { flagship: 3, guided: 7, project: 1, total: 11 },
  m3: { flagship: 3, guided: 7, project: 1, total: 11 },
  m4: { flagship: 3, guided: 7, project: 1, total: 11 },
  m5: { flagship: 3, guided: 8, project: 1, total: 12 },
  m6: { flagship: 3, guided: 8, project: 1, total: 12 },
};

const CANONICAL_DIR = path.resolve('src/data/canonicalLessons');
const INDEX_FILE = path.join(CANONICAL_DIR, 'index.ts');

if (!fs.existsSync(CANONICAL_DIR) || !fs.existsSync(INDEX_FILE)) {
  console.error(`[ERROR] Canonical lessons directory or index.ts does not exist at ${CANONICAL_DIR}`);
  process.exit(1);
}

const indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');

// Parse MIGRATED_MODULE_IDS
const migratedMatch = indexContent.match(/export\s+const\s+MIGRATED_MODULE_IDS[^=]*=\s*\[(.*?)\]/s);
const MIGRATED_MODULE_IDS = migratedMatch
  ? migratedMatch[1].split(',').map(s => s.trim().replace(/['"]/g, '')).filter(Boolean)
  : [];

if (isRegistryOnly) {
  console.log(`[PASS] Registry check passed. Migrated modules: ${MIGRATED_MODULE_IDS.join(', ') || 'none'}`);
  process.exit(0);
}

const modulesToTest = moduleArg ? [moduleArg] : (isMigratedOnly ? MIGRATED_MODULE_IDS : (isAll ? ['m1', 'm2', 'm3', 'm4', 'm5', 'm6'] : MIGRATED_MODULE_IDS));

if (modulesToTest.length === 0) {
  if (isMigratedOnly) {
    console.log(`[PASS] No migrated modules registered yet.`);
    process.exit(0);
  }
  console.error(`[ERROR] No modules specified or migrated to test.`);
  process.exit(1);
}

let errors = [];

for (const modId of modulesToTest) {
  const modFilePath = path.join(CANONICAL_DIR, `${modId}.ts`);
  if (!fs.existsSync(modFilePath)) {
    errors.push(`Module data file ${modFilePath} does not exist.`);
    continue;
  }

  const modContent = fs.readFileSync(modFilePath, 'utf-8');
  const expectedCounts = MODULE_ROLES[modId];

  // Count lesson entries
  const lessonMatches = modContent.match(/lessonId:\s*['"]([^'"]+)['"]/g) || [];
  const lessonIds = lessonMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]);

  if (lessonIds.length !== expectedCounts.total) {
    errors.push(`Module ${modId} expected ${expectedCounts.total} lessons, found ${lessonIds.length}`);
  }

  // Count roles
  const roleMatches = modContent.match(/role:\s*['"]([^'"]+)['"]/g) || [];
  const roles = roleMatches.map(m => m.match(/['"]([^'"]+)['"]/)[1]);

  let roleCounts = { flagship: 0, guided: 0, project: 0 };
  for (const r of roles) {
    roleCounts[r] = (roleCounts[r] || 0) + 1;
  }

  if (!roleArg) {
    if (roleCounts.flagship !== expectedCounts.flagship) {
      errors.push(`Module ${modId}: expected ${expectedCounts.flagship} flagship, got ${roleCounts.flagship}`);
    }
    if (roleCounts.guided !== expectedCounts.guided) {
      errors.push(`Module ${modId}: expected ${expectedCounts.guided} guided, got ${roleCounts.guided}`);
    }
    if (roleCounts.project !== expectedCounts.project) {
      errors.push(`Module ${modId}: expected ${expectedCounts.project} project, got ${roleCounts.project}`);
    }
  }

  // Check masterObjectives count
  const objMatches = modContent.match(/masterObjective:\s*['"]([^'"]+)['"]/g) || [];
  if (objMatches.length !== expectedCounts.total) {
    errors.push(`Module ${modId}: expected ${expectedCounts.total} masterObjectives, found ${objMatches.length}`);
  }
}

if (errors.length > 0) {
  console.error(`[FAIL] Canonical content check failed with ${errors.length} error(s):`);
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log(`[PASS] Canonical content check passed for modules: ${modulesToTest.join(', ')}`);
process.exit(0);
