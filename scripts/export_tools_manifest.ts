import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { TOOLS } from '../src/tools/ToolRegistry';

const outPath = resolve(process.cwd(), 'AI_Bridge_AI_도구_목록.json');

const rows = TOOLS.map((tool, index) => ({
  no: index + 1,
  id: tool.id,
  category: tool.category,
  subCategory: tool.subCategory ?? '',
  title: tool.title,
  description: tool.description,
  kind: tool.kind ?? 'api',
  externalUrl: 'externalUrl' in tool ? tool.externalUrl : '',
  hostLabel: 'hostLabel' in tool ? tool.hostLabel ?? '' : '',
  tags: tool.tags.join(', '),
  usedInLessons: tool.usedInLessons?.join(', ') ?? '',
  requiredInputs: tool.inputs
    .filter(input => input.required)
    .map(input => input.label)
    .join(', '),
  inputs: tool.inputs.map(input => ({
    id: input.id,
    label: input.label,
    type: input.type,
    required: Boolean(input.required),
    placeholder: input.placeholder ?? '',
    hint: input.hint ?? '',
    options: input.options?.map(option => `${option.label}=${option.value}`).join('\n') ?? '',
  })),
  implementationPrompt: tool.systemPrompt,
}));

writeFileSync(outPath, JSON.stringify(rows, null, 2), 'utf8');
console.log(outPath);
