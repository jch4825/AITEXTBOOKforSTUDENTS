import fs from 'node:fs';

const lessonView = fs.readFileSync('src/views/LessonView.tsx', 'utf8');
const sidebar = fs.readFileSync('src/components/SidebarTree.tsx', 'utf8');

if (lessonView.includes('<CanonicalLessonView')) {
  throw new Error('Canonical lessons must not bypass the established MicroLessonFrame.');
}

if (sidebar.includes('getCanonicalLessonSummary')) {
  throw new Error('Sidebar labels must stay aligned with the active legacy lesson renderer.');
}

console.log('lesson shell preservation: PASS');
