import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('dist/stats.json', 'utf8'));

const aggByFile = {};
for (const uid in data.nodeMetas) {
  const meta = data.nodeMetas[uid];
  const id = meta.id || '';
  for (const bundleFile in (meta.moduleParts || {})) {
    const partId = meta.moduleParts[bundleFile];
    const part = data.nodeParts[partId];
    if (!part) continue;
    aggByFile[bundleFile] = aggByFile[bundleFile] || [];
    aggByFile[bundleFile].push({
      id,
      rendered: part.renderedLength || 0,
      gzip: part.gzipLength || 0,
    });
  }
}

const targetFiles = Object.keys(aggByFile)
  .filter((f) => f.endsWith('.js'))
  .sort((a, b) => {
    const sa = aggByFile[a].reduce((s, e) => s + e.rendered, 0);
    const sb = aggByFile[b].reduce((s, e) => s + e.rendered, 0);
    return sb - sa;
  });

const groupKey = (id) => {
  const norm = id.replace(/\\/g, '/');
  if (norm.includes('node_modules')) {
    const m = norm.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
    return 'npm:' + (m ? m[1] : 'unknown');
  }
  if (norm.includes('/src/')) {
    const m = norm.match(/\/src\/([^/]+)/);
    return 'app:src/' + (m ? m[1] : '');
  }
  return 'other:' + norm.slice(0, 60);
};

const fmt = (n) => (n / 1024).toFixed(1).padStart(7) + 'K';

for (const file of targetFiles.slice(0, 4)) {
  const entries = aggByFile[file];
  const totalR = entries.reduce((s, e) => s + e.rendered, 0);
  const totalG = entries.reduce((s, e) => s + e.gzip, 0);
  console.log(`\n=== ${file}  (rendered ${fmt(totalR)}, gzip ${fmt(totalG)}, ${entries.length} modules) ===`);

  const byGroup = {};
  for (const e of entries) {
    const g = groupKey(e.id);
    byGroup[g] = byGroup[g] || { rendered: 0, gzip: 0, count: 0 };
    byGroup[g].rendered += e.rendered;
    byGroup[g].gzip += e.gzip;
    byGroup[g].count += 1;
  }
  const rows = Object.entries(byGroup)
    .map(([g, v]) => ({ g, ...v }))
    .sort((a, b) => b.rendered - a.rendered);
  console.log('  rendered     gzip   files  source');
  for (const r of rows.slice(0, 12)) {
    console.log('  ' + fmt(r.rendered) + '  ' + fmt(r.gzip) + '   ' + String(r.count).padStart(4) + '  ' + r.g);
  }
}
