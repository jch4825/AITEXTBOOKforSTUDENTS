# Resources 페이지를 QuickTools 비주얼 언어로 재정비

작성일: 2026-05-27
대상 파일: `src/views/Resources.tsx` (+ 보조 컴포넌트)

## 목적

링크 도서관(Resources) 페이지의 실제 자료 부분을 도구 모음(QuickTools)과 동일한 "문(door)" 메타포 + 깔끔한 카드 언어로 재정비한다. 단, Resources가 가진 더 풍부한 정보(긴 설명, 필수확인/강력추천 강조, 즐겨찾기, breadcrumb)는 손실 없이 보존한다.

배경 디자인(`moholy-surface-tools`)은 이미 두 페이지가 공유한다(별도 작업으로 통일 완료).

## 결정 사항 요약

1. 문 메타포의 단위는 **SubCategory 레벨**. Category는 섹션 헤더로 유지.
2. **여러 도어 동시 열기 허용** (QuickTools는 1개만 열리지만, Resources는 자료가 더 많고 비교 탐색이 잦으므로 다르게).
3. 카드 내 설명은 **line-clamp 적용하지 않음**. 데이터 편집 없음, 추가 인터랙션 없음.
4. Resources의 정체성 요소(즐겨찾기, 필수확인/강력추천 강조, breadcrumb)는 보존.

## 범위 — 무엇이 그대로이고 무엇이 바뀌나

### 그대로 유지

- 페이지 헤더 (제목 "링크 도서관" + 부제)
- 스티키 검색 바
- 태그 필터 행 + 즐겨찾기 토글 칩
- **즐겨찾기 카드 섹션** (필터 비활성 상태에서 보이는 별 표시 자료 모음)
- **카테고리 색인 nav** (앵커 점프 칩들)
- 7개 Category 섹션 헤더 (아이콘 + 제목 + 카운트 + 부제)
- 필터 결과 모드 (검색·태그·즐겨찾기 활성 시 평면 리스트)
- "필수 확인"(`r-3-4`) / "강력 추천"(`teachle-tools`) 강조 처리
- `resourcesData.ts` 데이터 (편집 0)
- 즐겨찾기 storage 로직 (`storage.getResourceFavorites/saveResourceFavorites`)
- 배경 디자인 (`moholy-surface moholy-surface-tools`, 이미 통일됨)

### 바뀌는 것

- `SubCategoryCard` → `SubCategoryDoor`
  - 기본은 닫힌 상태
  - 클릭 토글 → 패널이 카드 아래로 펼침
  - **여러 도어 동시 열기 허용** (각 도어 독립 state)
- `ItemRow` (서브카테고리 내부) → `ResourceCard`
  - QuickTools `ToolCard` 비주얼 채택
  - 설명은 클램프 없음 (가변 높이 허용)

## 컴포넌트 상세

### SubCategoryDoor

**닫힘 상태**

QuickTools `resource-card` 스타일 차용:

- 컨테이너: `rounded-2xl border bg-white p-4 shadow-sm`
- Hover: `-translate-y-0.5 hover:shadow-md`
- 포커스 링: `focus:ring-2 focus:ring-canva-purple/30`
- 왼쪽: 서브카테고리의 기존 `iconEmoji`를 큼직하게 + 부모 카테고리 색조의 도어 팔레트 장식 박스
  - 도어 팔레트는 QuickTools의 `ToolPalettePreview` 톤만 재활용
  - 자료 아이템에는 개별 아이콘이 없으므로, 미니 슬롯 자리에는 abstract 색 스와치 3개 (카테고리 accent 색조)
- 중앙: 서브카테고리 라벨 (text-base font-bold) + `N개 자료` (text-[11px] canva-purple)
- 오른쪽: ChevronDown 18px (열림 시 rotate-180 + canva-purple 색)

**열림 상태**

`AnimatePresence` + `motion.section` 으로 카드 아래에 슬라이드 다운:

- 패널: `rounded-2xl border bg-white shadow-sm`
- 패널 헤더: 서브카테고리 라벨 재표시 (열림 후 컨텍스트 유지용)
- 패널 본문: `max-h-[70vh] overflow-y-auto` + `p-3` + `flex flex-col gap-2`
- 본문 안에 `ResourceCard`들이 나열

**상태 관리**

- 각 SubCategoryDoor 컴포넌트 내부 `useState<boolean>`로 독립 관리 (현재 `SubCategoryCard`의 `expanded` 패턴과 동일)
- 즉, 부모 Resources 컴포넌트가 다 추적하지 않음

**현행 PREVIEW_COUNT 로직 폐기**

현재 `SubCategoryCard`는 5개 미리보기 + "+N개 더보기" 토글이지만, `SubCategoryDoor`는 닫힘 = 0개 노출 / 열림 = 전체 노출 (스크롤 패널 안에서) 이분법으로 단순화. 상수 `PREVIEW_COUNT` 제거.

### ResourceCard

QuickTools `ToolCard` 레이아웃 거의 그대로:

- 컨테이너: `flex items-center gap-3 bg-white border rounded-xl px-3 py-3` (featured/강력추천일 경우 배경 틴트 추가)
- 왼쪽 아이콘 박스: `h-10 w-10 rounded-xl flex items-center justify-center`
  - URL 있음 → `<ExternalLink size={20} />`
  - URL 없음 → `<Link2 size={20} />`
  - 색: 기본 gray, featured amber, 강력추천 emerald
- 중앙 텍스트 블록 `min-w-0 flex-1`:
  - (옵셔널) breadcrumb (필터 모드일 때만, text-[10px] uppercase tracking-wide text-gray-400)
  - (옵셔널) 필수확인/강력추천 pill 뱃지 (`bg-amber-200/70` 등 현행 색)
  - 제목 (text-sm font-bold leading-tight)
  - 설명 (text-[11px] leading-snug, **클램프 없음**)
  - 호스트명 (text-[10px] font-mono truncate, `getHostName(item.url)` 결과)
- 오른쪽 액션: 즐겨찾기 Star 버튼
  - 별 채움 = 즐겨찾기 상태
  - `onClick`은 `e.stopPropagation()`으로 카드 클릭과 분리

**행동**

- 카드 전체가 클릭 영역
  - URL 있으면 `<a href target="_blank" rel="noopener noreferrer">`로 감싸기 (현 ItemRow와 동일 패턴)
  - URL 없으면 `<div className="opacity-65 cursor-default">`
- Star 버튼만 카드 클릭에서 빠짐

**프롭 시그니처**

```tsx
interface ResourceCardProps {
  item: ResourceItem;
  isFav: boolean;
  onToggleFav: () => void;
  breadcrumb?: string;  // 필터 모드에서만 전달
  query?: string;        // 검색어 하이라이트
}
```

### 필터 결과 모드

현재 평면 리스트 구조 유지. 단 항목 렌더링을 `ItemRow` → `ResourceCard`로 교체하고 `breadcrumb` prop을 전달해 카테고리 출처를 노출한다. 즐겨찾기 섹션도 마찬가지로 ResourceCard + breadcrumb 사용.

### Category 섹션 헤더

변경 없음. 단 그 아래의 서브카테고리 그리드(현재 `grid-cols-1 lg:grid-cols-2`)는 그대로 두되, 자식 컴포넌트만 `SubCategoryCard` → `SubCategoryDoor`로 교체.

## 행동 디테일

### 도어 다중 열림

각 SubCategoryDoor가 자체 `useState`. 한 도어를 열어도 다른 도어는 그대로. 다음 페이지 방문 시 모두 닫힘 상태로 시작 (state는 컴포넌트 마운트 시 false, 영속화 없음).

### 검색 하이라이트

`highlight()` 헬퍼는 현행 그대로 사용. ResourceCard의 title/description에 적용.

### 도어가 닫혀 있을 때의 검색 동작

현재 검색은 모든 항목을 평면 리스트로 표시(`isFiltering` 분기). 따라서 도어 닫힘 여부와 무관하게 검색 결과가 보임. 별도 처리 필요 없음.

### 카테고리 색인 클릭

현행 그대로 `scrollIntoView`. 도어 자동 열기는 v1에 포함하지 않음.

## 트레이드오프

1. **첫 화면 정보량 감소** — 도어가 닫혀 있으니 자료 제목들이 보이지 않음.
   - 상쇄: 다중 열림 허용. 필요한 도어들 한꺼번에 열어 두면 현행과 비슷한 밀도.
   - 검색·태그·즐겨찾기는 항상 평면 노출이므로 탐색 경로 보존.
2. **카드 높이 가변** — QuickTools처럼 균일하지 않음.
   - 상쇄: 도어 내부가 어차피 `max-h-[70vh] overflow-y-auto` 스크롤 패널. 시각 비용 미미.
3. **breadcrumb 위치 변경** — 도어 내부에서는 빠지고(맥락 자명), 필터 모드에서만 노출.
   - 상쇄: 필터 모드에서는 출처가 명확히 필요하니 그대로 유지.

## 명시적으로 하지 않는 것 (Non-goals)

- `resourcesData.ts` 데이터 수정 (설명 단축, 카테고리 재구성 등)
- 즐겨찾기 영속화 변경
- 태그 자동 부여 로직(`TAG_RULES`) 변경
- 카테고리 섹션 헤더 디자인 변경
- Resources 외 다른 페이지의 디자인 변경

## 영향 받는 파일

- `src/views/Resources.tsx` — 주 변경
- (필요 시) `src/index.css` — SubCategoryDoor용 팔레트 장식 CSS 토큰 추가 (QuickTools의 `tool-palette-scene` 패턴 재활용)
- `src/data/resourcesData.ts` — 변경 없음
- `src/services/storage.ts` — 변경 없음

## 검증

- 수동 QA:
  - 필터 비활성 상태에서 모든 서브카테고리 도어가 닫혀 있는지
  - 도어를 여러 개 열어도 각자 독립적으로 동작하는지
  - 필수확인/강력추천 자료가 정확한 강조 색으로 나오는지
  - 즐겨찾기 토글이 카드 클릭과 분리되어 동작하는지
  - 검색·태그·즐겨찾기 모드에서 ResourceCard + breadcrumb이 정상 표시되는지
  - 색인 nav 앵커 점프가 동작하는지
- `npm run lint` 통과
- `npm run build` 성공
