# Resources QuickTools-Style Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resources(`링크 도서관`) 페이지의 자료 카드 영역을 QuickTools 비주얼 언어(닫힘-기본 도어 + 깔끔 카드)로 재정비하되 Resources 정체성(긴 설명, 즐겨찾기, 필수확인/강력추천, breadcrumb)은 보존한다.

**Architecture:** `SubCategoryCard`를 닫힘-기본 `SubCategoryDoor`로 교체(여러 개 동시 열림 허용, 각 도어 독립 state). `ItemRow`를 QuickTools `ToolCard` 비주얼의 `ResourceCard`로 교체(설명 클램프 없음). 도어 팔레트 장식은 QuickTools가 이미 갖고 있는 `tool-palette-scene` CSS와 `--palette-*` 커스텀 프로퍼티를 카테고리별로 재활용 — 새 CSS 추가 없음. 데이터(`resourcesData.ts`)는 건드리지 않는다.

**Tech Stack:** React 18, TypeScript (strict), Tailwind, `motion/react`(AnimatePresence/motion), Vite. 테스트 프레임워크 없음 — 검증은 `npm run lint`(tsc --noEmit), `npm run build`, `npm run dev`에서의 수동 QA로 한다.

**Spec reference:** `docs/superpowers/specs/2026-05-27-resources-quicktools-style-redesign.md`

---

### Task 1: ResourceCard 컴포넌트 추가

`ItemRow`와 같은 데이터를 받아 QuickTools `ToolCard` 비주얼로 렌더하는 새 컴포넌트. 이 태스크에서는 컴포넌트만 추가하고 사용처는 다음 태스크들에서 교체. 미사용 로컬 함수는 tsconfig에 `noUnusedLocals`가 없으므로 lint 통과한다.

**Files:**
- Modify: `src/views/Resources.tsx` (새 컴포넌트 추가)

- [ ] **Step 1: `ResourceCard` 함수형 컴포넌트 추가**

`ItemRow` 함수 정의 바로 위(현재 128행 위치)에 다음 컴포넌트를 추가한다.

```tsx
function ResourceCard({
  item,
  isFav,
  onToggleFav,
  breadcrumb,
  query = '',
}: {
  item: ResourceItem;
  isFav: boolean;
  onToggleFav: () => void;
  breadcrumb?: string;
  query?: string;
}) {
  const isFeatured = item.id === 'r-3-4';
  const isStrongRecommended = item.id === 'teachle-tools';
  const hasUrl = !!item.url;

  const containerBgClass = isFeatured
    ? 'bg-amber-50/80 border-amber-200'
    : isStrongRecommended
      ? 'bg-emerald-50/80 border-emerald-200'
      : 'bg-white border-gray-200';

  const iconWrapClass = isFeatured
    ? 'bg-amber-100 text-amber-700 ring-amber-200'
    : isStrongRecommended
      ? 'bg-emerald-100 text-emerald-700 ring-emerald-200'
      : 'bg-gray-50 text-gray-400 ring-gray-200';

  const titleClass = isFeatured
    ? 'text-amber-950 group-hover:text-amber-800'
    : isStrongRecommended
      ? 'text-emerald-950 group-hover:text-emerald-800'
      : 'text-gray-900 group-hover:text-canva-purple';

  const descClass = isFeatured
    ? 'text-amber-900/80'
    : isStrongRecommended
      ? 'text-emerald-900/80'
      : 'text-gray-500';

  const hostClass = isFeatured
    ? 'text-amber-700/80'
    : isStrongRecommended
      ? 'text-emerald-700/80'
      : 'text-gray-400';

  const cardClass =
    `group relative flex items-start gap-3 ${containerBgClass} border rounded-xl px-3 py-3 pr-12 text-left transition-all hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-canva-purple/30 ${hasUrl ? '' : 'opacity-65 cursor-default'}`;

  const inner = (
    <>
      <span
        className={`shrink-0 mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${iconWrapClass}`}
      >
        {hasUrl ? <ExternalLink size={18} /> : <Link2 size={18} />}
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
        <span className={`block text-sm font-bold leading-tight transition-colors ${titleClass}`}>
          {highlight(item.title, query)}
        </span>
        {item.description && (
          <span className={`mt-1 block text-[11px] leading-snug ${descClass}`}>
            {highlight(item.description, query)}
          </span>
        )}
        <span className={`mt-1.5 block truncate text-[10px] font-mono ${hostClass}`}>
          {getHostName(item.url)}
        </span>
      </span>
    </>
  );

  return (
    <div className="relative">
      {hasUrl ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClass}
        >
          {inner}
        </a>
      ) : (
        <div className={cardClass}>{inner}</div>
      )}
      <button
        type="button"
        onClick={onToggleFav}
        aria-label={isFav ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
        title={isFav ? '즐겨찾기 해제' : '즐겨찾기에 추가'}
        className={`absolute right-1.5 top-1.5 z-10 rounded-full p-2 transition ${
          isFav
            ? 'text-amber-400 hover:bg-amber-50'
            : isFeatured
              ? 'text-amber-600/80 hover:bg-amber-200/60 hover:text-amber-700'
              : isStrongRecommended
                ? 'text-emerald-600/80 hover:bg-emerald-200/60 hover:text-emerald-700'
                : 'text-gray-400 hover:bg-gray-100 hover:text-amber-500'
        }`}
      >
        <Star size={16} fill={isFav ? 'currentColor' : 'none'} />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: lint 통과 확인**

Run: `npm run lint`
Expected: 종료 코드 0, 출력은 빈 줄 또는 컴파일 경고 없음.

- [ ] **Step 3: 커밋**

```bash
git add src/views/Resources.tsx
git commit -m "Add ResourceCard component (not yet used)"
```

---

### Task 2: 즐겨찾기 섹션과 필터 모드를 ResourceCard로 교체

평면 리스트 두 곳(즐겨찾기 섹션, 필터 결과)에서 `ItemRow`를 `ResourceCard`로 바꾸고 breadcrumb prop을 전달한다. `ItemRow`는 아직 `SubCategoryCard`에서 쓰이므로 삭제하지 않는다.

**Files:**
- Modify: `src/views/Resources.tsx`

- [ ] **Step 1: 즐겨찾기 섹션의 ItemRow → ResourceCard 교체**

현재 코드(약 523–534행):

```tsx
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
```

다음으로 교체한다. `<ul>` → `<div>` + `flex flex-col gap-2`로 카드 사이 간격을 둔다.

```tsx
                <div className="flex flex-col gap-2">
                  {favoriteEntries.map(entry => (
                    <ResourceCard
                      key={entry.key}
                      item={entry.item}
                      breadcrumb={`${entry.categoryTitle} › ${entry.subCategoryLabel}`}
                      isFav={true}
                      onToggleFav={() => toggleFav(entry.item.id)}
                    />
                  ))}
                </div>
```

- [ ] **Step 2: 필터 모드의 ItemRow → ResourceCard 교체**

필터 활성 시 결과를 렌더하는 부분을 찾는다(`isFiltering && (...)` 블록 안의 결과 리스트). 현재 코드 패턴은 다음과 비슷할 것이다(Resources.tsx 600행 이후, 정확한 코드는 파일을 다시 읽어 확인할 것):

```tsx
              <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white shadow-sm">
                {filteredResults.map(entry => (
                  <li key={entry.key}>
                    <ItemRow
                      item={entry.item}
                      breadcrumb={`${entry.categoryTitle} › ${entry.subCategoryLabel}`}
                      query={normalizedQuery}
                      isFav={favorites.includes(entry.item.id)}
                      onToggleFav={() => toggleFav(entry.item.id)}
                    />
                  </li>
                ))}
              </ul>
```

다음으로 교체:

```tsx
              <div className="flex flex-col gap-2">
                {filteredResults.map(entry => (
                  <ResourceCard
                    key={entry.key}
                    item={entry.item}
                    breadcrumb={`${entry.categoryTitle} › ${entry.subCategoryLabel}`}
                    query={normalizedQuery}
                    isFav={favorites.includes(entry.item.id)}
                    onToggleFav={() => toggleFav(entry.item.id)}
                  />
                ))}
              </div>
```

(실제 파일을 읽고 정확한 위치/형식을 확인 후 Edit하라.)

- [ ] **Step 3: lint 통과 확인**

Run: `npm run lint`
Expected: 종료 코드 0.

- [ ] **Step 4: dev 서버에서 수동 검증**

Run: `npm run dev`
브라우저에서 `http://localhost:3000` 열고 Resources 페이지로 이동.
- 즐겨찾기 비어있다면 임의 항목 별표 클릭 → 즐겨찾기 섹션에 `ResourceCard` 모양으로 표시되는지
- 검색 바에 임의 키워드 입력 → 필터 결과가 `ResourceCard` 모양으로 표시되는지
- breadcrumb이 카드 상단에 회색 작은 글씨로 보이는지
- 즐겨찾기 별표 클릭이 카드 클릭(URL 열기)과 분리되는지

종료: Ctrl+C.

- [ ] **Step 5: 커밋**

```bash
git add src/views/Resources.tsx
git commit -m "Switch favorites and filter mode to ResourceCard"
```

---

### Task 3: SubCategoryDoor 컴포넌트 추가

QuickTools의 `tool-palette-scene` CSS를 재활용하는 닫힘-기본 도어 카드. 각 도어가 자체 `useState`로 열림 상태를 관리(여러 개 동시 열림 허용). 열림 시 `ResourceCard`들을 스크롤 패널에 렌더.

**Files:**
- Modify: `src/views/Resources.tsx`

- [ ] **Step 1: 카테고리별 도어 팔레트 매핑 추가**

파일 상단의 imports와 상수 영역에 추가. `ChevronDown`은 이미 import되어 있어야 한다. `AnimatePresence, motion`을 `motion/react`에서 import 추가.

`Resources.tsx` 상단 import 영역에 추가:

```tsx
import { AnimatePresence, motion } from 'motion/react';
```

상수 영역(`PREVIEW_COUNT` 근처)에 다음 매핑 추가:

```tsx
const CATEGORY_DOOR_PALETTE: Record<string, { base: string; shade: string; accent: string }> = {
  'school-admin-support': { base: '#fef3c7', shade: '#fde68a', accent: '#d97706' },
  'ai-basics': { base: '#dbeafe', shade: '#bfdbfe', accent: '#2563eb' },
  'ethics': { base: '#fee2e2', shade: '#fecaca', accent: '#ef4444' },
  'lesson': { base: '#ede9fe', shade: '#ddd6fe', accent: '#7c3aed' },
  'policy': { base: '#f1f5f9', shade: '#e2e8f0', accent: '#475569' },
  'research-etc': { base: '#dcfce7', shade: '#bbf7d0', accent: '#16a34a' },
  'ai-industry-experts': { base: '#e0e7ff', shade: '#c7d2fe', accent: '#4f46e5' },
};

const DEFAULT_DOOR_PALETTE = { base: '#f1f5f9', shade: '#e2e8f0', accent: '#475569' };
```

- [ ] **Step 2: SubCategoryDoor 컴포넌트 추가**

`SubCategoryCard` 함수 정의 바로 위에 다음을 추가:

```tsx
function SubCategoryDoor({
  subCategory,
  categoryId,
  favorites,
  onToggleFav,
}: {
  subCategory: ResourceSubCategory;
  categoryId: string;
  favorites: string[];
  onToggleFav: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const total = subCategory.items.length;
  const palette = CATEGORY_DOOR_PALETTE[categoryId] ?? DEFAULT_DOOR_PALETTE;

  const itemPositions = [
    { x: '1.9rem', y: '-0.95rem' },
    { x: '2.65rem', y: '0.05rem' },
    { x: '1.9rem', y: '1.05rem' },
  ];

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        className={`resource-card group flex min-h-24 w-full items-center gap-3 rounded-2xl border bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-canva-purple/30 ${
          isOpen ? 'border-canva-purple ring-2 ring-canva-purple/15' : 'border-gray-200'
        }`}
      >
        <span
          className="tool-palette-scene"
          aria-hidden="true"
          data-open={isOpen}
          style={{
            '--palette-base': palette.base,
            '--palette-shade': palette.shade,
            '--palette-accent': palette.accent,
          } as React.CSSProperties}
        >
          <span className="tool-palette-wrap">
            <span className="tool-palette-base">
              <span className="tool-palette-shine" />
              <span className="tool-palette-symbol text-base leading-none">
                {subCategory.iconEmoji}
              </span>
            </span>
            {itemPositions.map((pos, index) => (
              <span
                key={index}
                className="tool-palette-item"
                style={{
                  '--palette-item-index': index,
                  '--palette-item-x': pos.x,
                  '--palette-item-y': pos.y,
                } as React.CSSProperties}
              />
            ))}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-extrabold text-gray-900">{subCategory.label}</span>
          <span className="mt-1 block text-[11px] font-bold text-canva-purple">{total}개 자료</span>
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180 text-canva-purple' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.section
            key={`${subCategory.id}-panel`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-extrabold text-gray-900">{subCategory.label}</h3>
              </div>
              <div className="p-3">
                {total === 0 ? (
                  <p className="px-1 py-6 text-center text-xs text-gray-400">자료 준비 중</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {subCategory.items.map(item => (
                      <ResourceCard
                        key={item.id}
                        item={item}
                        isFav={favorites.includes(item.id)}
                        onToggleFav={() => onToggleFav(item.id)}
                      />
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
}
```

- [ ] **Step 3: lint 통과 확인**

Run: `npm run lint`
Expected: 종료 코드 0. `motion/react` import 누락 시 여기서 잡힘.

- [ ] **Step 4: 커밋**

```bash
git add src/views/Resources.tsx
git commit -m "Add SubCategoryDoor component with QuickTools palette decoration"
```

---

### Task 4: SubCategoryDoor 연결 + 데드 코드 제거

`SubCategoryCard`를 사용하던 카테고리 그리드에서 `SubCategoryDoor`로 교체하고, 더 이상 쓰이지 않는 `SubCategoryCard`, `ItemRow`, `PREVIEW_COUNT`를 삭제한다.

**Files:**
- Modify: `src/views/Resources.tsx`

- [ ] **Step 1: 카테고리 섹션 내 SubCategoryCard 호출을 SubCategoryDoor로 교체**

현재 코드(약 578–586행):

```tsx
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
```

다음으로 교체:

```tsx
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                      {category.subCategories.map(sub => (
                        <SubCategoryDoor
                          key={sub.id}
                          subCategory={sub}
                          categoryId={category.id}
                          favorites={favorites}
                          onToggleFav={toggleFav}
                        />
                      ))}
                    </div>
```

- [ ] **Step 2: `SubCategoryCard` 컴포넌트 삭제**

`function SubCategoryCard({...}) { ... }` 정의(약 246–315행) 전체 삭제.

- [ ] **Step 3: `ItemRow` 컴포넌트 삭제**

`function ItemRow({...}) { ... }` 정의(약 128–244행) 전체 삭제.

- [ ] **Step 4: `PREVIEW_COUNT` 상수 삭제**

`const PREVIEW_COUNT = 5;` 한 줄(약 47행) 삭제.

- [ ] **Step 5: import 정리**

`ItemRow`에서만 쓰던 `Link2`가 `ResourceCard`에서도 쓰이므로 유지. 사용하지 않게 된 import는 lint에서 잡으면 제거. 현재 imports를 검사하라:

```tsx
import { ChevronDown, ExternalLink, Link2, Search, Star, X } from 'lucide-react';
```

`ResourceCard`/`SubCategoryDoor` 모두에서 이 6개가 다 쓰이는지 확인:
- `ChevronDown`: SubCategoryDoor에서 사용 ✓
- `ExternalLink`: ResourceCard에서 사용 ✓
- `Link2`: ResourceCard에서 사용 ✓
- `Search`: 검색 바에서 사용 ✓
- `Star`: 즐겨찾기 버튼 + 즐겨찾기 토글 칩에서 사용 ✓
- `X`: 검색 클리어 + 필터 초기화에서 사용 ✓

전부 유지.

- [ ] **Step 6: lint 통과 확인**

Run: `npm run lint`
Expected: 종료 코드 0.

- [ ] **Step 7: dev 서버 수동 QA**

Run: `npm run dev`
브라우저에서 Resources 페이지를 열어 다음을 확인:

1. **기본 상태**: 카테고리별 SubCategoryDoor 그리드가 보이고, 모든 도어가 닫힌 상태. 도어 좌측에 이모지 + 카테고리 색의 팔레트 장식. 우측에 `N개 자료` + ChevronDown.
2. **도어 열기**: 도어 클릭 → 아래로 패널 슬라이드 다운, ResourceCard 리스트 표시. 설명 줄 안 잘림(긴 설명도 그대로).
3. **여러 도어 열기**: 다른 도어 클릭 → 이전 도어 그대로 열린 채로 새 도어도 열림.
4. **즐겨찾기 별표**: 카드 내 별표 클릭 → 즐겨찾기 토글되고 카드 클릭(링크 이동) 발동 안 됨.
5. **필수 확인/강력 추천**: `r-3-4`(경상남도교육청)와 `teachle-tools`(티끌)가 amber/emerald 톤으로 강조.
6. **즐겨찾기 섹션**: 페이지 상단에 즐겨찾기 카드들이 ResourceCard로 breadcrumb과 함께 표시.
7. **필터 모드**: 검색어 입력하거나 태그 클릭 → 평면 리스트가 ResourceCard로 표시되고 breadcrumb 보임.
8. **카테고리 색인 nav**: 상단의 카테고리 칩 클릭 → 해당 섹션으로 스크롤.
9. **URL 없는 자료**: 있다면 opacity-65로 비활성 표시(데이터에 URL 없는 항목 있을 때).

종료: Ctrl+C.

- [ ] **Step 8: 커밋**

```bash
git add src/views/Resources.tsx
git commit -m "Wire SubCategoryDoor + remove SubCategoryCard/ItemRow/PREVIEW_COUNT"
```

---

### Task 5: 최종 검증 — build + encoding

**Files:** 없음(검증만)

- [ ] **Step 1: 인코딩 검증**

Run: `npm run check:encoding`
Expected: 모든 소스 파일이 UTF-8.

- [ ] **Step 2: 프로덕션 빌드**

Run: `npm run build`
Expected: dist/ 생성, 에러 없음. 경고는 허용하되 모듈 누락이나 import 에러는 실패로 본다.

- [ ] **Step 3: 프리뷰 서버 스폿 체크**

Run: `npm run preview`
브라우저로 미리보기 URL 접속, Resources 페이지가 dev 서버와 동일하게 동작하는지 확인. (도어 열림, 카드 표시, 즐겨찾기, 필터)
종료: Ctrl+C.

- [ ] **Step 4: 빈 커밋이 필요하면 생략, 아니면 작업 종료**

이 태스크에서 추가 변경이 발생하지 않았다면 커밋 없음. dev/preview에서 잡힌 버그를 수정했다면 별도 커밋:

```bash
git add -p
git commit -m "<폴리시 메시지>"
```

---

## Self-Review

**Spec coverage check:**

| 스펙 요구 | 커버 태스크 |
|---|---|
| ResourceCard 컴포넌트 + 클램프 없는 설명 | Task 1 |
| 필수확인/강력추천 강조 보존 | Task 1 (`isFeatured`, `isStrongRecommended`) |
| breadcrumb optional prop | Task 1 |
| 즐겨찾기 별표 카드 클릭과 분리 | Task 1 (`<button>` 별도, stopPropagation 불필요 — `<a>` 외부 absolute 버튼) |
| 즐겨찾기 섹션 ResourceCard로 교체 | Task 2 |
| 필터 모드 ResourceCard로 교체 + breadcrumb | Task 2 |
| SubCategoryDoor (닫힘 기본) | Task 3 |
| 각 도어 독립 state + 다중 열림 | Task 3 (`useState` 내부) |
| 도어 팔레트 (QuickTools CSS 재활용) | Task 3 (`tool-palette-scene` 마크업 + 카테고리 매핑) |
| 열림 시 패널 스크롤(max-h-[70vh]) | Task 3 |
| Category 그리드에 SubCategoryDoor 연결 | Task 4 (Step 1) |
| PREVIEW_COUNT 폐기 | Task 4 (Step 4) |
| 데이터 편집 없음 | (해당 없음 — `resourcesData.ts` 손대지 않음) |
| 색인 nav 유지 | (해당 없음 — 코드 변경 없음) |
| 헤더/검색/태그 필터 행 유지 | (해당 없음 — 코드 변경 없음) |

빠진 항목 없음.

**Placeholder scan:** TBD/TODO 없음. 모든 코드 블록에 실제 코드 있음. "Similar to" 없음.

**Type consistency:**
- `ResourceCard` props: `item, isFav, onToggleFav, breadcrumb?, query?` — Task 1 정의, Task 2 사용 일치.
- `SubCategoryDoor` props: `subCategory, categoryId, favorites, onToggleFav` — Task 3 정의, Task 4 사용 일치.
- `CATEGORY_DOOR_PALETTE` 키: 모두 `CATEGORY_ORDER`의 카테고리 id와 일치 (school-admin-support, policy, ai-basics, ethics, lesson, research-etc, ai-industry-experts).
- `getHostName`, `highlight` 헬퍼: 기존에 있는 함수 그대로 재사용. 시그니처 호환.

일관성 OK.

**Risk note:**
- Task 4 Step 7의 수동 QA가 핵심 검증 게이트. 자동 테스트 없음으로 인해 회귀 위험은 이 단계에서만 잡힌다. 시간 들여 모든 9개 시나리오 확인 권장.
