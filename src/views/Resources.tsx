import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ExternalLink, Link2, Search, Star, X } from 'lucide-react';
import { resourceCategories, type ResourceCategory, type ResourceItem, type ResourceSubCategory } from '../data/resourcesData';
import { getResourceFavorites, saveResourceFavorites } from '../services/storage';

const CATEGORY_ORDER = [
  'school-admin-support',
  'policy',
  'ai-basics',
  'ethics',
  'lesson',
  'research-etc',
  'ai-industry-experts',
];

const CATEGORY_DISPLAY: Record<string, { title: string; subtitle: string }> = {
  'school-admin-support': {
    title: '핵심 도움 자료',
    subtitle: '학교 업무 전반에서 꼭 확인해야 할 핵심 도움 자료',
  },
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
  'research-etc': {
    title: '연구·연수·뉴스',
    subtitle: '학술 연구·교사 연수·AI 뉴스 동향',
  },
  'ai-industry-experts': {
    title: 'AI 산업·전문가 자료',
    subtitle: '한국 AI 기업·개발자 도구·의료 AI·공공기관 (전문가 참고용)',
  },
};

const PREVIEW_COUNT = 5;

const TAG_RULES: Array<{ tag: string; pattern: RegExp }> = [
  { tag: '초등', pattern: /초등/ },
  { tag: '한글·문해', pattern: /한글|문해/ },
  { tag: '정책', pattern: /정책|기본계획|행동계획|추진 계획|관리 가이드|안내서/ },
  { tag: '윤리·안전', pattern: /윤리|안전|개인정보|과의존|편향|저작권/ },
  { tag: '시뮬레이션', pattern: /시뮬레이션|실험실|가상 실험|VlabON/i },
  { tag: '코딩', pattern: /코딩|프로그래밍|스크래치|엔트리|블록 코딩/i },
  { tag: '디자인', pattern: /디자인|만화|드로잉|UI/i },
  { tag: '음성·소리', pattern: /음성|음악|TTS|더빙|노래|작곡/ },
  { tag: '로컬 AI', pattern: /로컬|Ollama|LM Studio|GPT4ALL|Open WebUI|Jan/i },
  { tag: '노코드', pattern: /노코드|코드 없는|No Code|Teachable Machine|Brightics/i },
  { tag: '출판사', pattern: /출판사|미래엔|아이스크림|비상교육|비바샘|씨마스|천재교육/ },
  { tag: '시도교육청', pattern: /시도교육청|광주|울산|경상남도교육청|서울시교육청|충청남도교육청/ },
  { tag: '연구', pattern: /학술|논문|학회|연구보고서/ },
  { tag: '연수', pattern: /연수/ },
  { tag: '행정', pattern: /행정|학교업무|학교 업무|생기부|학습발달|업무 도움/ },
  { tag: '수학', pattern: /수학/ },
  { tag: '과학', pattern: /과학/ },
  { tag: '영상', pattern: /영상|유튜브|동영상|영화/ },
  { tag: '해외', pattern: /\(해외\)/ },
  { tag: '뉴스', pattern: /뉴스|매체|미디어|보도|동향/ },
  { tag: '의료', pattern: /의료|병리|뇌질환|신약|바이오|헬스케어|진단/ },
  { tag: 'LLM', pattern: /LLM|초거대|챗봇|대화형 AI/ },
  { tag: '개발자', pattern: /개발자|프레임워크|API|RAG|MLOps|GPU|반도체|코딩 AI/ },
];

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

function getItemTags(catTitle: string, subLabel: string, item: ResourceItem): string[] {
  const text = `${catTitle} ${subLabel} ${item.title} ${item.description ?? ''}`;
  return TAG_RULES.filter(r => r.pattern.test(text)).map(r => r.tag);
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded bg-yellow-200/70 px-0.5 text-gray-900">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => getResourceFavorites());

  useEffect(() => {
    saveResourceFavorites(favorites);
  }, [favorites]);

  const toggle = (id: string) => {
    setFavorites(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  return { favorites, toggle };
}

function ItemRow({
  item,
  breadcrumb,
  query = '',
  isFav,
  onToggleFav,
}: {
  item: ResourceItem;
  breadcrumb?: string;
  query?: string;
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const isFeatured = item.id === 'r-3-4';
  const isStrongRecommended = item.id === 'teachle-tools';
  const rowClass =
    `group flex w-full items-start gap-3 px-4 py-3 pr-10 text-left transition focus:outline-none focus:ring-2 ${
      isFeatured
        ? 'bg-amber-50/80 hover:bg-amber-100/80 focus:ring-amber-300'
        : isStrongRecommended
          ? 'bg-emerald-50/80 hover:bg-emerald-100/80 focus:ring-emerald-300'
        : 'hover:bg-canva-purple/5 focus:ring-canva-purple/30'
    }`;

  const content = (
    <>
      <span
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1 ${
          isFeatured
            ? 'bg-amber-100 text-amber-700 ring-amber-200'
            : isStrongRecommended
              ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
            : 'bg-gray-50 text-gray-400 ring-gray-200 group-hover:text-canva-purple'
        }`}
      >
        {item.url ? <ExternalLink size={14} /> : <Link2 size={14} />}
      </span>
      <span className="min-w-0 flex-1">
        {breadcrumb && (
          <span className="mb-0.5 block text-[10px] font-bold uppercase tracking-wide text-gray-400">
            {breadcrumb}
          </span>
        )}
        {isFeatured && (
          <span className="mb-1 inline-flex rounded-full bg-amber-200/70 px-2 py-0.5 text-[10px] font-extrabold text-amber-800">
            필수 확인
          </span>
        )}
        {isStrongRecommended && (
          <span className="mb-1 inline-flex rounded-full bg-emerald-200/70 px-2 py-0.5 text-[10px] font-extrabold text-emerald-800">
            강력 추천
          </span>
        )}
        <span
          className={`block font-bold leading-snug ${
            isFeatured
              ? 'text-sm text-amber-950 group-hover:text-amber-800'
              : isStrongRecommended
                ? 'text-sm text-emerald-950 group-hover:text-emerald-800'
              : 'text-xs text-gray-900 group-hover:text-canva-purple'
          }`}
        >
          {highlight(item.title, query)}
        </span>
        {item.description && (
          <span className={`mt-1 block text-[11px] leading-relaxed ${
            isFeatured
              ? 'text-amber-900/80'
              : isStrongRecommended
                ? 'text-emerald-900/80'
                : 'text-gray-500'
          }`}>
            {highlight(item.description, query)}
          </span>
        )}
        <span className={`mt-1.5 block truncate text-[10px] font-mono ${
          isFeatured
            ? 'text-amber-700/80'
            : isStrongRecommended
              ? 'text-emerald-700/80'
              : 'text-gray-400'
        }`}>
          {getHostName(item.url)}
        </span>
      </span>
    </>
  );

  return (
    <div className="relative">
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
          {content}
        </a>
      ) : (
        <div className={`${rowClass} cursor-default opacity-65`}>{content}</div>
      )}
      <button
        type="button"
        onClick={onToggleFav}
        aria-label={isFav ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
        title={isFav ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
        className={`absolute right-2 top-2.5 z-10 rounded-full p-1.5 transition ${
          isFav
            ? 'text-amber-400 hover:bg-amber-50'
            : isFeatured
              ? 'text-amber-500/60 hover:bg-amber-200/60 hover:text-amber-700'
              : isStrongRecommended
                ? 'text-emerald-500/60 hover:bg-emerald-200/60 hover:text-emerald-700'
                : 'text-gray-300 hover:bg-gray-100 hover:text-amber-400'
        }`}
      >
        <Star size={14} fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}

function SubCategoryCard({
  subCategory,
  favorites,
  onToggleFav,
}: {
  subCategory: ResourceSubCategory;
  favorites: string[];
  onToggleFav: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const total = subCategory.items.length;
  const visibleItems = expanded ? subCategory.items : subCategory.items.slice(0, PREVIEW_COUNT);
  const hasMore = total > PREVIEW_COUNT;
  const isSchoolAdmin = subCategory.id === 'school-admin';
  const isTeachingTools = subCategory.id === 'teaching-tools';

  return (
    <section className={`rounded-2xl border shadow-sm ${
      isSchoolAdmin
        ? 'border-amber-200 bg-amber-50/45'
        : isTeachingTools
          ? 'border-emerald-200 bg-emerald-50/45'
          : 'border-gray-200 bg-white'
    }`}>
      <header className={`flex items-center gap-3 border-b px-4 py-3 ${
        isSchoolAdmin
          ? 'border-amber-100'
          : isTeachingTools
            ? 'border-emerald-100'
            : 'border-gray-100'
      }`}>
        <span className="text-lg leading-none">{subCategory.iconEmoji}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold text-gray-900">{subCategory.label}</span>
          <span className="mt-0.5 block text-[11px] text-gray-500">{total}개 자료</span>
        </span>
      </header>

      {total === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-gray-400">자료 준비 중</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {visibleItems.map(item => (
            <li key={item.id}>
              <ItemRow
                item={item}
                isFav={favorites.includes(item.id)}
                onToggleFav={() => onToggleFav(item.id)}
              />
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(v => !v)}
          className="flex w-full items-center justify-center gap-1.5 border-t border-gray-100 py-2.5 text-xs font-bold text-canva-purple hover:bg-canva-purple/5"
        >
          {expanded ? '접기' : `+${total - PREVIEW_COUNT}개 더 보기`}
          <ChevronDown
            size={14}
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </section>
  );
}

interface TaggedEntry {
  item: ResourceItem;
  categoryTitle: string;
  subCategoryLabel: string;
  tags: string[];
  key: string;
}

export default function Resources() {
  const [query, setQuery] = useState('');
  const [activeTags, setActiveTags] = useState<Set<string>>(() => new Set());
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const { favorites, toggle: toggleFav } = useFavorites();

  const orderedCategories = useMemo(
    () =>
      [...resourceCategories]
        .sort((a, b) => CATEGORY_ORDER.indexOf(a.id) - CATEGORY_ORDER.indexOf(b.id))
        .map(getDisplayCategory)
        .filter(category => getCategoryCount(category) > 0),
    []
  );

  const taggedItems: TaggedEntry[] = useMemo(() => {
    const out: TaggedEntry[] = [];
    for (const category of orderedCategories) {
      for (const sub of category.subCategories) {
        for (const item of sub.items) {
          out.push({
            item,
            categoryTitle: category.title,
            subCategoryLabel: sub.label,
            tags: getItemTags(category.title, sub.label, item),
            key: `${category.id}-${sub.id}-${item.id}`,
          });
        }
      }
    }
    return out;
  }, [orderedCategories]);

  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of taggedItems) {
      for (const tag of t.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [taggedItems]);

  const normalizedQuery = query.trim().toLowerCase();
  const isFiltering = normalizedQuery.length > 0 || activeTags.size > 0 || showFavOnly;
  const visibleTagCounts = showAllTags ? tagCounts : tagCounts.slice(0, 8);

  const filteredResults = useMemo(() => {
    if (!isFiltering) return [];
    return taggedItems.filter(({ item, categoryTitle, subCategoryLabel, tags }) => {
      if (showFavOnly && !favorites.includes(item.id)) return false;
      if (activeTags.size > 0 && !tags.some(t => activeTags.has(t))) return false;
      if (normalizedQuery) {
        const haystack = [
          categoryTitle,
          subCategoryLabel,
          item.title,
          item.description ?? '',
          item.url ?? '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [isFiltering, taggedItems, showFavOnly, favorites, activeTags, normalizedQuery]);

  const favoriteEntries = useMemo(
    () => taggedItems.filter(t => favorites.includes(t.item.id)),
    [taggedItems, favorites]
  );

  const toggleTag = (tag: string) => {
    setActiveTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const clearFilters = () => {
    setActiveTags(new Set());
    setShowFavOnly(false);
    setQuery('');
  };

  const handleAnchorClick = (id: string) => {
    document
      .getElementById(`resource-cat-${id}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="moholy-surface moholy-surface-resources min-h-screen">
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <header className="mb-6 text-center">
          <p className="mb-2 text-xs font-bold text-canva-purple">AI Bridge Link Library</p>
          <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-canva-ink">링크 도서관</h1>
          <p className="text-sm text-canva-gray">
            카테고리·태그·즐겨찾기·검색을 자유롭게 조합해 자료를 빠르게 찾을 수 있습니다.
          </p>
        </header>

        <div className="sticky top-2 z-20 mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="자료명, 설명, 링크 검색..."
              className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-10 text-sm shadow-sm outline-none transition focus:border-canva-purple/40 focus:ring-2 focus:ring-canva-purple/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="검색어 지우기"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowFavOnly(v => !v)}
            disabled={favorites.length === 0}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition disabled:cursor-not-allowed disabled:opacity-40 ${
              showFavOnly
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            <Star size={11} fill={showFavOnly ? 'currentColor' : 'none'} />
            즐겨찾기
            {favorites.length > 0 && <span className="opacity-60">{favorites.length}</span>}
          </button>
          {visibleTagCounts.map(([tag, count]) => {
            const isOn = activeTags.has(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-bold transition ${
                  isOn
                    ? 'border-canva-purple bg-canva-purple/10 text-canva-purple'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-canva-purple/40 hover:text-canva-purple'
                }`}
              >
                {tag} <span className="opacity-60">{count}</span>
              </button>
            );
          })}
          {tagCounts.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAllTags(v => !v)}
              className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-500 transition hover:border-canva-purple/40 hover:text-canva-purple"
            >
              {showAllTags ? '접기' : `+${tagCounts.length - 8}개 더보기`}
              <ChevronDown size={11} className={`transition-transform ${showAllTags ? 'rotate-180' : ''}`} />
            </button>
          )}
          {(activeTags.size > 0 || showFavOnly || query) && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-1 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold text-gray-500 hover:text-gray-800"
            >
              <X size={11} /> 필터 초기화
            </button>
          )}
        </div>

        {!isFiltering && (
          <>
            {favoriteEntries.length > 0 && (
              <section className="mb-8 scroll-mt-24">
                <header className="mb-3 flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <Star size={18} fill="currentColor" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <h2 className="text-lg font-extrabold text-canva-ink">
                      즐겨찾기
                      <span className="ml-2 text-xs font-bold text-amber-600">
                        {favoriteEntries.length}
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500">★ 표시한 자료를 한곳에 모아 봅니다</p>
                  </span>
                </header>
                <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
                  {favoriteEntries.map(entry => (
                    <li key={entry.key}>
                      <ItemRow
                        item={entry.item}
                        breadcrumb={`${entry.categoryTitle} › ${entry.subCategoryLabel}`}
                        isFav={true}
                        onToggleFav={() => toggleFav(entry.item.id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <nav className="mb-6 flex flex-wrap gap-2">
              {orderedCategories.map(category => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleAnchorClick(category.id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-sm transition hover:border-canva-purple/40 hover:text-canva-purple"
                >
                  <span>{category.title}</span>
                  <span className="text-[10px] text-gray-400">{getCategoryCount(category)}</span>
                </button>
              ))}
            </nav>

            <div className="space-y-10">
              {orderedCategories.map(category => {
                const Icon = category.icon;
                return (
                  <section
                    key={category.id}
                    id={`resource-cat-${category.id}`}
                    className="scroll-mt-24"
                  >
                    <header className="mb-3 flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-xl ${category.iconBg}`}
                      >
                        <Icon size={18} className={category.iconColor} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <h2 className="text-lg font-extrabold text-canva-ink">
                          {category.title}
                          <span className="ml-2 text-xs font-bold text-canva-purple">
                            {getCategoryCount(category)}
                          </span>
                        </h2>
                        <p className="text-xs text-gray-500">{category.subtitle}</p>
                      </span>
                    </header>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {category.subCategories.map(sub => (
                        <SubCategoryCard
                          key={sub.id}
                          subCategory={sub}
                          favorites={favorites}
                          onToggleFav={toggleFav}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}

        {isFiltering && (
          <section>
            <p className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-500">
              <span>
                필터 결과 <span className="text-canva-purple">{filteredResults.length}</span>건
              </span>
              {showFavOnly && <span className="text-amber-600">★ 즐겨찾기만</span>}
              {activeTags.size > 0 && (
                <span className="text-canva-purple">#{[...activeTags].join(' #')}</span>
              )}
              {normalizedQuery && <span className="text-gray-700">"{query}"</span>}
            </p>
            {filteredResults.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center text-sm text-gray-400">
                조건에 맞는 자료가 없습니다.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
                {filteredResults.map(({ item, categoryTitle, subCategoryLabel, key }) => (
                  <li key={key}>
                    <ItemRow
                      item={item}
                      breadcrumb={`${categoryTitle} › ${subCategoryLabel}`}
                      query={normalizedQuery}
                      isFav={favorites.includes(item.id)}
                      onToggleFav={() => toggleFav(item.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
