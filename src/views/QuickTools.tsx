import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Globe,
  GraduationCap,
  Lightbulb,
  Search,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import SpeakButton from '../components/SpeakButton';
import { lessons as allLessons } from '../data/tutorialData';
import { TOOLS, ToolDefinition } from '../tools/ToolRegistry';
import { getTheme, moduleIdFromLesson } from '../utils/moduleThemes';
import ToolPage from './ToolPage';

const CATEGORY_ORDER: ToolDefinition['category'][] = [
  '지도안 제작',
  '수업도구',
  '행정도구',
  'AI 활용',
  'GPTs-학생용',
  'GPTs-교원용',
];

type CategoryMeta = {
  label?: string;
  description: string;
  badgeClass: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  doorPalette: { base: string; shade: string; accent: string };
};

const CATEGORY_META: Record<ToolDefinition['category'], CategoryMeta> = {
  '지도안 제작': {
    description: '차시안, 세안, 공개수업안처럼 수업 설계 중심 도구',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
    icon: BookOpen,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    doorPalette: { base: '#dbeafe', shade: '#bfdbfe', accent: '#2563eb' },
  },
  '수업도구': {
    description: '발문, 활동, 읽기자료, 문제 생성 등 수업 운영용 도구',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
    icon: Lightbulb,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    doorPalette: { base: '#fef3c7', shade: '#fde68a', accent: '#d97706' },
  },
  '행정도구': {
    description: '가정통신문, 보도자료, 생기부 문구 등 문서 작성 도구',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    icon: ClipboardList,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    doorPalette: { base: '#d1fae5', shade: '#bbf7d0', accent: '#059669' },
  },
  'AI 활용': {
    description: '프롬프트, 챗봇, 멀티미디어 활용을 돕는 AI 도구',
    badgeClass: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
    icon: Zap,
    iconBg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-500',
    doorPalette: { base: '#fae8ff', shade: '#f5d0fe', accent: '#c026d3' },
  },
  'GPTs-학생용': {
    label: 'GPTs-학생용(외부)',
    description: '학생이 직접 학습과 연습에 활용할 수 있는 GPT 모음',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: GraduationCap,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    doorPalette: { base: '#f1f5f9', shade: '#e2e8f0', accent: '#475569' },
  },
  'GPTs-교원용': {
    label: 'GPTs-교원용(외부)',
    description: '교사의 수업 준비, 기록, 업무를 돕는 GPT 모음',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Globe,
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    doorPalette: { base: '#f1f5f9', shade: '#e2e8f0', accent: '#475569' },
  },
};

function ToolPalettePreview({
  category,
  tools,
  isOpen,
}: {
  category: ToolDefinition['category'];
  tools: ToolDefinition[];
  isOpen: boolean;
}) {
  const meta = CATEGORY_META[category];
  const Icon = meta.icon;
  const { doorPalette } = meta;
  const previewTools = tools.slice(0, 3);
  const itemPositions = [
    { x: '1.9rem', y: '-0.95rem' },
    { x: '2.65rem', y: '0.05rem' },
    { x: '1.9rem', y: '1.05rem' },
  ];

  return (
    <span
      className="tool-palette-scene"
      aria-hidden="true"
      data-open={isOpen}
      style={{
        '--palette-base': doorPalette.base,
        '--palette-shade': doorPalette.shade,
        '--palette-accent': doorPalette.accent,
      } as React.CSSProperties}
    >
      <span className="tool-palette-wrap">
        <span className="tool-palette-base">
          <span className="tool-palette-shine" />
          <Icon size={18} className={`tool-palette-symbol ${meta.iconColor}`} />
        </span>
        {previewTools.map((tool, index) => {
          const ToolIcon = tool.icon;
          const position = itemPositions[index] ?? itemPositions[itemPositions.length - 1];
          return (
            <span
              key={tool.id}
              className="tool-palette-item"
              style={{
                '--palette-item-index': index,
                '--palette-item-x': position.x,
                '--palette-item-y': position.y,
              } as React.CSSProperties}
            >
              <ToolIcon size={10} className={meta.iconColor} />
            </span>
          );
        })}
      </span>
    </span>
  );
}

function lessonsToModuleLabels(lessonIds: string[]): { moduleId: string; label: string }[] {
  const byModule = new Map<string, string[]>();
  for (const id of lessonIds) {
    const moduleId = moduleIdFromLesson(id);
    if (!byModule.has(moduleId)) byModule.set(moduleId, []);
    byModule.get(moduleId)!.push(id);
  }

  return Array.from(byModule.entries()).map(([moduleId, ids]) => {
    const nums = ids
      .map(id => id.replace('l', '').replace('-', '.'))
      .sort();
    return { moduleId, label: `모듈 ${nums.join(', ')}` };
  });
}

function ToolCard({
  tool,
  index,
  onOpen,
}: {
  tool: ToolDefinition;
  index: number;
  onOpen: (tool: ToolDefinition) => void;
}) {
  const Icon = tool.icon;
  const isExternal = tool.kind === 'external';
  const moduleLabels = tool.usedInLessons && tool.usedInLessons.length > 0
    ? lessonsToModuleLabels(tool.usedInLessons)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.025 }}
      onClick={() => onOpen(tool)}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(tool);
        }
      }}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-3 py-3 text-left group cursor-pointer hover:shadow-sm hover:border-gray-300 transition-all focus:outline-none focus:ring-2 focus:ring-canva-purple/40"
    >
      {/* 아이콘 */}
      {isExternal ? (
        <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 border border-gray-200">
          <Icon size={20} className="text-gray-500" strokeWidth={1.5} />
        </div>
      ) : (
        <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} shadow-sm`}>
          <Icon size={20} className="text-white" />
        </div>
      )}

      {/* 텍스트 */}
      <div className="min-w-0 flex-1">
        <p className={`font-bold text-sm leading-tight mb-0.5 transition-colors ${isExternal ? 'text-gray-800 group-hover:text-gray-600' : 'text-gray-900 group-hover:text-canva-purple'}`}>
          {tool.title}
        </p>
        <p className="text-[11px] text-gray-500 leading-snug">{tool.description}</p>
        {isExternal && tool.hostLabel && (
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{tool.hostLabel}</p>
        )}
        <div className="flex flex-wrap items-center gap-1 mt-1.5" onClick={e => e.stopPropagation()}>
          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${isExternal ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-canva-purple/5 text-canva-purple border-canva-purple/20'}`}>
            {isExternal ? <><ExternalLink size={8} /> 외부</> : <><Zap size={8} /> API</>}
          </span>
          {moduleLabels.map(({ moduleId, label }) => {
            const theme = getTheme(moduleId);
            const firstLesson = tool.usedInLessons?.find(id => moduleIdFromLesson(id) === moduleId);
            return (
              <a
                key={moduleId}
                href={firstLesson && allLessons.find(l => l.id === firstLesson) ? `?lesson=${firstLesson}` : undefined}
                onClick={e => {
                  if (!firstLesson) return;
                  e.preventDefault();
                  window.location.search = `?lesson=${firstLesson}`;
                }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full border bg-white text-[9px] font-bold transition-colors hover:opacity-80"
                style={{ borderColor: `${theme.accent}66`, color: theme.accent }}
                title="배워보기에서 사용된 도구입니다. 클릭하면 해당 레슨으로 이동합니다."
              >
                <GraduationCap size={9} />
                {label}
              </a>
            );
          })}
        </div>
      </div>

      {/* 음성 버튼 */}
      <div className="shrink-0" onClick={e => e.stopPropagation()}>
        <SpeakButton
          text={`${tool.title}. ${tool.description}`}
          label="설명 듣기"
          stopPropagation
        />
      </div>
    </motion.div>
  );
}

function groupToolsBySubCategory(tools: ToolDefinition[]): { subCategory: string; tools: ToolDefinition[] }[] {
  const groups = new Map<string, ToolDefinition[]>();

  for (const tool of tools) {
    const subCategory = tool.subCategory ?? '기타';
    groups.set(subCategory, [...(groups.get(subCategory) ?? []), tool]);
  }

  return Array.from(groups.entries()).map(([subCategory, groupedTools]) => ({
    subCategory,
    tools: groupedTools,
  }));
}

export default function QuickTools() {
  const [query, setQuery] = useState('');
  const [openCategory, setOpenCategory] = useState<ToolDefinition['category'] | null>(null);
  const [activeTool, setActiveTool] = useState<ToolDefinition | null>(null);

  if (activeTool) {
    return <ToolPage tool={activeTool} onBack={() => setActiveTool(null)} />;
  }

  const filteredGroups = CATEGORY_ORDER
    .map(category => ({
      category,
      tools: TOOLS.filter(tool => {
        if (tool.category !== category) return false;
        if (query === '') return true;
        return (
          tool.title.includes(query) ||
          tool.description.includes(query) ||
          tool.tags.some(tag => tag.includes(query)) ||
          (tool.subCategory?.includes(query) ?? false) ||
          category.includes(query)
        );
      }),
    }))
    .filter(group => group.tools.length > 0);

  const handleOpen = (tool: ToolDefinition) => {
    if (tool.kind === 'external' && tool.externalUrl) {
      window.open(tool.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    setActiveTool(tool);
  };

  const totalCount = filteredGroups.reduce((sum, g) => sum + g.tools.length, 0);

  return (
    <div className="moholy-surface moholy-surface-tools min-h-screen">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold text-canva-purple">AI Bridge Tool Hub</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-canva-ink">AI 도구 모음</h1>
          <p className="text-sm text-canva-gray">
            카테고리를 선택하면 문이 열리고, 바로 사용할 수 있는 AI 도구 목록이 나타납니다.
          </p>
        </header>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setOpenCategory(null);
            }}
            placeholder="도구명, 설명, 태그 검색..."
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-canva-purple/40 focus:ring-2 focus:ring-canva-purple/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredGroups.map(({ category, tools }) => {
            const isOpen = openCategory === category;
            const meta = CATEGORY_META[category];
            const categoryLabel = meta.label ?? category;

            return (
              <div key={category} className="min-w-0">
                <button
                  type="button"
                  onClick={() => setOpenCategory(isOpen ? null : category)}
                  aria-expanded={isOpen}
                  className={`resource-card group flex min-h-28 w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-canva-purple/30 ${
                    isOpen ? 'border-canva-purple ring-2 ring-canva-purple/15' : 'border-gray-200'
                  }`}
                >
                  <ToolPalettePreview category={category} tools={tools} isOpen={isOpen} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-gray-900">{categoryLabel}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-500">{meta.description}</span>
                    <span className="mt-2 block text-[11px] font-bold text-canva-purple">{tools.length}개 도구</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-canva-purple' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.section
                      key={`${category}-panel`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-4 py-3">
                          <h2 className="text-sm font-extrabold text-gray-900">{categoryLabel}</h2>
                          <p className="mt-1 text-xs text-gray-500">{meta.description}</p>
                        </div>
                        <div className="p-3">
                          {category.startsWith('GPTs-') ? (
                            <div className="space-y-4">
                              {groupToolsBySubCategory(tools).map(({ subCategory, tools: subCategoryTools }) => (
                                <section key={subCategory}>
                                  <div className="mb-2 flex items-center justify-between gap-3 border-b border-gray-100 pb-2">
                                    <h3 className="text-xs font-extrabold text-gray-800">{subCategory}</h3>
                                    <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500">
                                      {subCategoryTools.length}개
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    {subCategoryTools.map((tool, index) => (
                                      <ToolCard key={tool.id} tool={tool} index={index} onOpen={handleOpen} />
                                    ))}
                                  </div>
                                </section>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {tools.map((tool, index) => (
                                <ToolCard key={tool.id} tool={tool} index={index} onOpen={handleOpen} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {totalCount === 0 && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
            "{query}"에 해당하는 도구가 없습니다.
          </div>
        )}

        {totalCount > 0 && !openCategory && (
          <div className="mx-auto mt-5 max-w-2xl rounded-2xl border border-dashed border-gray-300 bg-white/70 px-4 py-6 text-center text-sm text-gray-500">
            위의 카테고리를 누르면 문이 열리고 도구 목록이 나타납니다.
          </div>
        )}
      </div>
    </div>
  );
}
