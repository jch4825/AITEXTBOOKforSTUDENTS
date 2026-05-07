import React, { useState } from 'react';
import { ChevronDown, ExternalLink, Link2, Search } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { resourceCategories, type ResourceCategory } from '../data/resourcesData';

const CATEGORY_ORDER = ['policy', 'ai-basics', 'ethics', 'lesson', 'assessment', 'research-etc'];

const CATEGORY_DISPLAY: Record<string, { title: string; subtitle: string }> = {
  policy: {
    title: '정책·지침',
    subtitle: '교육부·시도교육청 AI 정책 자료',
  },
  'ai-basics': {
    title: 'AI 기초 이해',
    subtitle: '주요 AI 서비스와 기초 이해 자료',
  },
  ethics: {
    title: 'AI 윤리·안전',
    subtitle: 'AI 윤리, 저작권, 편향, 안전 자료',
  },
  lesson: {
    title: '수업 지원',
    subtitle: '지도안·활동지·수업 자료',
  },
  assessment: {
    title: '행정 업무',
    subtitle: '평가·기록·생기부 업무 자료',
  },
  prompts: {
    title: '연구·연수·기타',
    subtitle: '프롬프트 예시와 기타 참고 자료',
  },
};

function getDisplayCategory(category: ResourceCategory): ResourceCategory {
  const display = CATEGORY_DISPLAY[category.id];
  return display ? { ...category, ...display } : category;
}

function getHostName(url?: string) {
  if (!url) return '링크 준비 중';

  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function getCategoryCount(category: ResourceCategory) {
  return category.subCategories.reduce((sum, sub) => sum + sub.items.length, 0);
}

const doorPalettes = [
  { base: '#f3e8ff', shade: '#e9d5ff', accent: '#8b3dff' },
  { base: '#cffafe', shade: '#bae6fd', accent: '#00a9b4' },
  { base: '#fef3c7', shade: '#fde68a', accent: '#d97706' },
  { base: '#fce7f3', shade: '#fbcfe8', accent: '#db2777' },
  { base: '#d1fae5', shade: '#bbf7d0', accent: '#059669' },
  { base: '#e0e7ff', shade: '#c7d2fe', accent: '#4f46e5' },
];

function getDoorPalette(categoryId: string) {
  const index = Math.abs([...categoryId].reduce((sum, char) => sum + char.charCodeAt(0), 0));
  return doorPalettes[index % doorPalettes.length];
}

function DoorPreview({ category, isOpen }: { category: ResourceCategory; isOpen: boolean }) {
  const Icon = category.icon;
  const previewItems = category.subCategories.slice(0, 3);
  const palette = getDoorPalette(category.id);

  return (
    <span
      className="resource-door-scene"
      aria-hidden="true"
      data-open={isOpen}
      style={{
        '--door-base': palette.base,
        '--door-shade': palette.shade,
        '--door-accent': palette.accent,
      } as React.CSSProperties}
    >
      <span className={`resource-door-frame ${category.iconBg}`}>
        <span className="resource-door-glow" />
        <Icon size={20} className={`resource-door-symbol ${category.iconColor}`} />
        {previewItems.map((subCategory, index) => (
          <span
            key={subCategory.id}
            className="resource-door-item"
            style={{ '--door-item-index': index } as React.CSSProperties}
          >
            <span>{subCategory.iconEmoji}</span>
          </span>
        ))}
        <span className="resource-door-panel">
          <span className="resource-door-knob" />
        </span>
      </span>
    </span>
  );
}

export default function Resources() {
  const [query, setQuery] = useState('');
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null);
  const [openSubCategoryId, setOpenSubCategoryId] = useState<string | null>(null);
  const orderedCategories = [...resourceCategories]
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.id) - CATEGORY_ORDER.indexOf(b.id))
    .map(getDisplayCategory);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleCategories = orderedCategories
    .map(category => ({
      ...category,
      subCategories: category.subCategories
        .map(subCategory => ({
          ...subCategory,
          items: subCategory.items.filter(item => {
            if (!normalizedQuery) return true;

            return (
              category.title.toLowerCase().includes(normalizedQuery) ||
              category.subtitle.toLowerCase().includes(normalizedQuery) ||
              subCategory.label.toLowerCase().includes(normalizedQuery) ||
              item.title.toLowerCase().includes(normalizedQuery) ||
              item.description?.toLowerCase().includes(normalizedQuery) ||
              item.url?.toLowerCase().includes(normalizedQuery)
            );
          }),
        }))
        .filter(subCategory => !normalizedQuery || subCategory.items.length > 0),
    }))
    .filter(category => !normalizedQuery || category.subCategories.length > 0);

  const activeCategory = visibleCategories.find(category => category.id === openCategoryId) ?? null;
  const totalVisibleCount = visibleCategories.reduce(
    (sum, category) => sum + category.subCategories.reduce((subSum, sub) => subSum + sub.items.length, 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold text-canva-purple">AI Bridge Resource Hub</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-canva-ink">자료실</h1>
          <p className="text-sm text-canva-gray">
            문을 열듯 분류를 선택하면 관련 자료가 펼쳐지고, 아래에서 전체 목록을 빠르게 확인할 수 있습니다.
          </p>
        </header>

        <div className="relative mb-6">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setOpenCategoryId(null);
              setOpenSubCategoryId(null);
            }}
            placeholder="자료명, 설명, 링크 검색..."
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-canva-purple/40 focus:ring-2 focus:ring-canva-purple/20"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCategories.map(category => {
            const isOpen = openCategoryId === category.id;
            const categoryCount = getCategoryCount(category);

            return (
              <div key={category.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    setOpenCategoryId(isOpen ? null : category.id);
                    setOpenSubCategoryId(null);
                  }}
                  aria-expanded={isOpen}
                  className={`resource-card group flex min-h-28 w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-canva-purple/30 ${
                    isOpen ? 'border-canva-purple ring-2 ring-canva-purple/15' : 'border-gray-200'
                  }`}
                >
                  <DoorPreview category={category} isOpen={isOpen} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-bold text-gray-900">{category.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-500">{category.subtitle}</span>
                    <span className="mt-2 block text-[11px] font-bold text-canva-purple">{categoryCount}개 자료</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-canva-purple' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.section
                      key={`${category.id}-panel`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 max-h-[58vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 px-4 py-3">
                          <h2 className="text-sm font-extrabold text-gray-900">{category.title}</h2>
                          <p className="mt-1 text-xs text-gray-500">{category.subtitle}</p>
                        </div>

                        <div className="space-y-2 p-3">
                          {category.subCategories.length === 0 && (
                            <p className="py-6 text-center text-sm text-gray-400">자료를 준비 중입니다.</p>
                          )}
                          {category.subCategories.map(subCategory => (
                            <section key={subCategory.id} className="rounded-xl border border-gray-200 bg-gray-50">
                              <button
                                type="button"
                                onClick={() => setOpenSubCategoryId(
                                  openSubCategoryId === subCategory.id ? null : subCategory.id
                                )}
                                aria-expanded={openSubCategoryId === subCategory.id}
                                className="flex w-full items-center gap-3 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-canva-purple/30"
                              >
                                <span className="text-base leading-none">{subCategory.iconEmoji}</span>
                                <span className="min-w-0 flex-1">
                                  <span className="block text-xs font-extrabold text-gray-800">{subCategory.label}</span>
                                  <span className="mt-0.5 block text-[10px] font-bold text-canva-purple">{subCategory.items.length}개 자료</span>
                                </span>
                                <ChevronDown
                                  size={16}
                                  className={`shrink-0 text-gray-400 transition-transform ${
                                    openSubCategoryId === subCategory.id ? 'rotate-180 text-canva-purple' : ''
                                  }`}
                                />
                              </button>

                              <AnimatePresence>
                                {openSubCategoryId === subCategory.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.16 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="space-y-2 border-t border-gray-200 bg-white p-3">
                                      {subCategory.items.map(item => {
                                        const rowClass = 'group flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-left transition hover:border-canva-purple/30 hover:bg-white focus:outline-none focus:ring-2 focus:ring-canva-purple/30';
                                        const content = (
                                          <>
                                            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 ring-1 ring-gray-200 group-hover:text-canva-purple">
                                              {item.url ? <ExternalLink size={14} /> : <Link2 size={14} />}
                                            </span>
                                            <span className="min-w-0 flex-1">
                                              <span className="block text-xs font-bold leading-snug text-gray-900 group-hover:text-canva-purple">
                                                {item.title}
                                              </span>
                                              {item.description && (
                                                <span className="mt-1 block text-[11px] leading-relaxed text-gray-500">{item.description}</span>
                                              )}
                                              <span className="mt-2 block truncate text-[10px] font-mono text-gray-400">
                                                {getHostName(item.url)}
                                              </span>
                                            </span>
                                          </>
                                        );

                                        if (!item.url) {
                                          return (
                                            <div key={item.id} className={`${rowClass} opacity-65`}>
                                              {content}
                                            </div>
                                          );
                                        }

                                        return (
                                          <a
                                            key={item.id}
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={rowClass}
                                          >
                                            {content}
                                          </a>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </section>
                          ))}
                        </div>
                      </div>
                    </motion.section>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {totalVisibleCount === 0 && (
          <div className="mt-5 rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
            "{query}"에 해당하는 자료가 없습니다.
          </div>
        )}

        {totalVisibleCount > 0 && !activeCategory && (
          <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white/70 py-12 text-center text-sm text-gray-500">
            위의 분류 버튼을 누르면 문이 열리고 자료 목록이 아래에 표시됩니다.
          </div>
        )}
      </div>
    </div>
  );
}
