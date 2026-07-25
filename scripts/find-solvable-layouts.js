const GRID_SIZE = 4;

function findPath(r, c, obstacles, visited, path) {
  const totalFloor = 16 - obstacles.length;
  if (path.length === totalFloor) {
    return path;
  }

  const dirs = [
    { r: -1, c: 0 },
    { r: 1, c: 0 },
    { r: 0, c: -1 },
    { r: 0, c: 1 },
  ];

  for (const d of dirs) {
    const nr = r + d.r;
    const nc = c + d.c;

    if (
      nr >= 0 && nr < GRID_SIZE &&
      nc >= 0 && nc < GRID_SIZE &&
      !obstacles.some(o => o.r === nr && o.c === nc) &&
      !visited.some(v => v.r === nr && v.c === nc)
    ) {
      visited.push({ r: nr, c: nc });
      path.push({ r: nr, c: nc });

      const res = findPath(nr, nc, obstacles, visited, path);
      if (res) return res;

      path.pop();
      visited.pop();
    }
  }

  return null;
}

// Generate combinations of 2 obstacles from non-origin cells
const validCells = [];
for (let r = 0; r < 4; r++) {
  for (let c = 0; c < 4; c++) {
    if (r === 0 && c === 0) continue;
    validCells.push({ r, c });
  }
}

const solvableConfigs = [];

for (let i = 0; i < validCells.length; i++) {
  for (let j = i + 1; j < validCells.length; j++) {
    const obstacles = [validCells[i], validCells[j]];
    const visited = [{ r: 0, c: 0 }];
    const path = [{ r: 0, c: 0 }];
    const solution = findPath(0, 0, obstacles, visited, path);
    if (solution) {
      solvableConfigs.push({ obstacles, solution });
    }
  }
}

console.log(`Found ${solvableConfigs.length} solvable 2-obstacle configurations!`);

// Print 5 nice distinct examples
solvableConfigs.slice(0, 8).forEach((cfg, idx) => {
  console.log(`\nConfig ${idx + 1}:`);
  console.log('Obstacles:', cfg.obstacles);
  console.log('Solution Path Length:', cfg.solution.length);
  console.log('Path:', cfg.solution.map(p => `(${p.r},${p.c})`).join(' -> '));
});
