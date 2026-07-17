import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('src');
const files = [];
function walk(dir) { for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const f=path.join(dir,e.name); if(e.isDirectory()){if(e.name!=='teacher')walk(f)} else if(/\.(ts|tsx)$/.test(e.name) && e.name !== 'TeacherView.tsx') files.push(f); } }
walk(root);
const informal = /(?:[가-힣]+요(?:[.!?]|$)|[가-힣]+(?:나요|가요|죠|까요)\?)/;
for (const file of files) {
  const source = fs.readFileSync(file,'utf8').replace(/\/\/.*$/gm,'').replace(/\/\*[\s\S]*?\*\//g,'');
  for (const literal of source.match(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g) ?? []) {
    const value=literal.slice(1,-1); if (value !== '안녕하세요' && informal.test(value)) console.log(`${path.relative(process.cwd(),file)}: ${value}`);
  }
}
