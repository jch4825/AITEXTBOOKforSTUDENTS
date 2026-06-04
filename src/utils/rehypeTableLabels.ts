// Rehype plugin: inject a `data-label` attribute onto each table body cell,
// taken from that column's header text. This lets the mobile CSS in index.css
// render each table row as a self-labeled card (`td::before { content: attr(data-label) }`)
// instead of cramming a multi-column table into a phone-width screen.

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function getText(node: HastNode): string {
  if (node.type === 'text') return node.value ?? '';
  if (!node.children) return '';
  return node.children.map(getText).join('');
}

function firstElement(node: HastNode, tagName: string): HastNode | undefined {
  return (node.children ?? []).find(
    (c) => c.type === 'element' && c.tagName === tagName,
  );
}

function rowsOf(node: HastNode): HastNode[] {
  return (node.children ?? []).filter(
    (c) => c.type === 'element' && c.tagName === 'tr',
  );
}

function cellsOf(row: HastNode): HastNode[] {
  return (row.children ?? []).filter(
    (c) => c.type === 'element' && (c.tagName === 'td' || c.tagName === 'th'),
  );
}

function processTable(table: HastNode): void {
  const thead = firstElement(table, 'thead');
  const headerRow = thead ? firstElement(thead, 'tr') : undefined;
  if (!headerRow) return;

  const headers = cellsOf(headerRow).map((c) => getText(c).trim());

  const tbody = firstElement(table, 'tbody');
  if (!tbody) return;

  for (const row of rowsOf(tbody)) {
    cellsOf(row).forEach((cell, i) => {
      const label = headers[i];
      if (label) {
        cell.properties = cell.properties ?? {};
        // hast camelCase -> rendered `data-label` attribute
        (cell.properties as Record<string, unknown>).dataLabel = label;
      }
    });
  }
}

function walk(node: HastNode): void {
  if (node.type === 'element' && node.tagName === 'table') {
    processTable(node);
  }
  for (const child of node.children ?? []) walk(child);
}

export function rehypeTableLabels() {
  return (tree: HastNode) => {
    walk(tree);
  };
}
