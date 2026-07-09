# 게임 컴포넌트 재설계 — 구현 명세 (마티스 배경 + 카훗식 선택지)

- 작성일: 2026-07-09 (구현 명세 v2 — 대화 맥락 없이 그대로 구현 가능하도록 확정)
- 대상: `src/components/games/CardPick.tsx` · `Matching.tsx` · `OXGame.tsx` · `Sequence.tsx`
- 범위: **모듈 1(11차시)만 먼저** 구현·검증 → 통과하면 나머지 5모듈로 확장
- 아이콘 목록(신규 54종): 이미 `docs/asset-prompts/missing-activity-icons.md`(커밋 140649c). 안티그래비티가 제작해 `public/lessons/pecs/{concept}.webp`(정사각·투명·PECS 통일감)로 넣음. **이 스펙은 코드만 담당**; 아이콘 파일은 병렬로 채워진다.

---

## 0. 배경 (왜)

게임 선택지가 전부 **텍스트뿐**이라 글자 못 읽는 학생은 참여 불가(예: 짝맞추기 "시리·빅스비" ↔ "말로 대화하는 AI"). 저자극 원칙이 과해 흥미·변별력도 약함. → 선택지에 **색+아이콘**을 붙이고, 정답/오답 피드백을 오버레이+1회성 애니로 바꾼다. 저자극 원칙(반복·점멸 금지, `prefers-reduced-motion` 대응, 색+아이콘+TTS 3중)은 유지.

## 1. 확정 디자인 결정

- **스타일**: 배경·틀 = 지금 그대로(마티스: 종이톤·모듈색). 선택지 = 카훗식 **색+아이콘 묶음**. 카훗의 타이머·효과음·경쟁·팝아트 망점은 **도입 안 함**.
- **2단 색 체계**: 틀은 저채도 유지. **선택지 타일에만 "액티비티 팔레트"**(6색 고정, 68차시 재사용).
- **팔레트 배정 = 콘텐츠 기반**(위치 고정 아님): 색은 그 선택지의 `icon`(없으면 `label`)에서 결정론적으로 뽑는다 → 같은 개념은 어디서나 같은 색. 짝맞추기에서 좌/우 라벨이 각자 색을 가지므로 정답 쌍이 색으로 새지 않음.
  - (카훗의 "추상 도형"은 도입하지 않음 — 콘텐츠 기반이라 **아이콘이 곧 그 선택지의 형태** 역할. "파란 [우산] 답"으로 지시 가능.)
- **난이도 연동**(`useSettings().difficulty`, 'easy'|'normal'):
  - card-pick·sequence: **easy=아이콘 표시**, **normal=아이콘 숨김**(색+텍스트+스피커만).
  - matching: **easy=정답 쌍에 같은 아이콘 표시**(그림 짝짓기 가능), **normal=아이콘 숨김**(뜻을 듣고 판단).
  - OX: 아이콘 없음(O/X가 이미 형태). 피드백만 새 방식.
- **피드백**(전 게임 공통): 타일 배경 전체를 초록/빨강으로 덮는 기존 방식 **폐기**. 타일은 항상 자기 액티비티 색 유지. 정답/오답은 **오버레이 배지(체크/X)+테두리 강조**로 표시.
  - 정답 = **약한 폭죽**(점 6~10개가 퍼지며 사라짐, 1회성) + 체크 배지.
  - 오답 = **카드 흔들림**(1회) + X 배지.
  - `prefers-reduced-motion`이면 폭죽·흔들림 생략하고 **배지만**.

## 2. 현재 코드 기준선 (시작점)

- 타입은 각 게임 파일에 정의·export:
  - `CardPick.tsx`: `export interface CardChoice { label: string; isCorrect: boolean }`
  - `Matching.tsx`: `export interface MatchingPair { left: string; right: string }`
  - `Sequence.tsx`: `export interface SequenceItem { label: string }`
- **난이도 미배선**: `LessonView.tsx`에 `const { difficulty } = useSettings()`는 있으나, `renderCardPick/renderMatching/renderSequence`가 게임에 `difficulty`를 안 넘김. (넘기기만 하면 됨 — 클로저에 이미 있음.)
- 현재 피드백: 타일 `style.background`를 `var(--ok-bg)`/`var(--bad-bg)`로 교체(+일부 check/cross 아이콘 혼재). → 걷어낸다.
- 토큰(`index.css` `:root`): `--ok:#16a34a; --ok-bg:#86efac; --bad-bg:#fca5a5; --warn:#ea580c;`. 기존 keyframe: `story-fade-in, stamp-in, ai-glow, float`. **액티비티 팔레트·burst·shake 없음 → 추가.**
- 데이터: `src/data/lessons/m1.ts`에 인라인. card-pick=`{label,isCorrect}`, matching=`{left,right}`, sequence=`{label}`. 모듈1 분포: **card-pick 10 · matching 7 · ox 10 · sequence 0**.

---

## 3. 구현 단계 (순서대로)

### STEP 1 — 액티비티 팔레트 유틸 신규
`src/utils/activityPalette.ts`:
```ts
// 보석톤 6색 — 흰 글자 AA(4.5:1) 통과하도록 어둡고 채도 있는 색. 마티스풍(진하지만 서로 다투지 않음).
export const ACTIVITY_PALETTE = [
  { bg: '#2B4C7E', text: '#FFFFFF' }, // 진남
  { bg: '#B14D33', text: '#FFFFFF' }, // 벽돌/코랄
  { bg: '#7E5E10', text: '#FFFFFF' }, // 오커/머스터드 (흰 글자 AA 위해 어둡게)
  { bg: '#37704C', text: '#FFFFFF' }, // 포레스트
  { bg: '#6E4A8E', text: '#FFFFFF' }, // 자두/보라
  { bg: '#1F6E7C', text: '#FFFFFF' }, // 청록
] as const;

// 콘텐츠 기반 결정론 배정 — 같은 key(=icon 또는 label)는 항상 같은 색.
export function activityColor(key: string) {
  let h = 5381;
  for (let i = 0; i < key.length; i++) h = ((h << 5) + h + key.charCodeAt(i)) >>> 0; // djb2
  return ACTIVITY_PALETTE[h % ACTIVITY_PALETTE.length];
}
```

### STEP 2 — 활동 아이콘 렌더 컴포넌트 신규
`src/components/ActivityIcon.tsx` — `icon`(webp basename)을 `public/lessons/pecs/{icon}.webp`로 렌더, 실패 시 무해한 폴백.
```tsx
interface Props { icon: string; size?: number; className?: string }
export default function ActivityIcon({ icon, size = 40, className }: Props) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}lessons/pecs/${icon}.webp`}
      alt="" aria-hidden width={size} height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
      onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
    />
  );
}
```

### STEP 3 — 피드백 CSS (index.css)
`@layer base`의 모션 블록에 추가하고 `prefers-reduced-motion` 분기에도 등록:
```css
/* 게임 정답 폭죽(1회) / 오답 흔들림(1회) — 저자극: 반복·점멸 없음 */
@keyframes answer-shake {
  0%,100% { transform: translateX(0); }
  20%,60% { transform: translateX(-6px); }
  40%,80% { transform: translateX(6px); }
}
.answer-shake { animation: answer-shake 0.4s ease-in-out 1; }

/* 폭죽 파티클 — Burst.tsx가 각 점에 --dx/--dy(px) 인라인 지정 */
@keyframes answer-burst {
  0%   { transform: translate(0,0) scale(1); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0.3); opacity: 0; }
}
.answer-burst-dot { animation: answer-burst 0.6s ease-out 1 forwards; }

@media (prefers-reduced-motion: reduce) {
  .answer-shake, .answer-burst-dot { animation: none; }
}
```

### STEP 4 — 폭죽 컴포넌트 신규
`src/components/games/Burst.tsx` — 중앙에서 8개 점이 방사형으로 퍼지며 사라짐. `prefers-reduced-motion`이면 아무것도 렌더 안 함(호출부가 배지로 대체).
```tsx
const N = 8;
export default function Burst({ color = 'var(--ok)' }: { color?: string }) {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {Array.from({ length: N }).map((_, i) => {
        const a = (i / N) * Math.PI * 2;
        const style = { '--dx': `${Math.cos(a) * 34}px`, '--dy': `${Math.sin(a) * 34}px`, background: color } as React.CSSProperties;
        return <span key={i} className="answer-burst-dot absolute h-2 w-2 rounded-full" style={style} />;
      })}
    </span>
  );
}
```

### STEP 5 — 타입 확장 (아이콘 필드)
- `CardChoice`에 `icon?: string` (webp basename).
- `SequenceItem`에 `icon?: string`.
- `MatchingPair`에 `icon?: string` — **정답 쌍의 공유 개념 아이콘**. easy에서 좌·우 양쪽에 이 아이콘을 같이 표시(=짝짓기 힌트). normal에선 숨김. (좌/우 색은 각 label로 콘텐츠 배정 → 서로 다름 → 색으로 쌍이 새지 않음.)

### STEP 6 — 난이도 배선 (LessonView.tsx)
`renderCardPick/renderMatching/renderSequence`에서 게임에 `difficulty={difficulty}` 추가. 예:
```tsx
<CardPick question={data.question} choices={data.choices} difficulty={difficulty} onComplete={handleNext} />
```
각 게임 Props에 `difficulty: Difficulty`(`import type { Difficulty } from '../../types'`) 추가. OX는 아이콘 없으니 난이도 불필요(피드백만 바뀜).

### STEP 7 — 게임별 변경 (기준 패턴 = CardPick)

**CardPick.tsx** (레퍼런스 — 나머지도 같은 원리):
- import `activityColor`, `ActivityIcon`, `Burst`.
- Props에 `difficulty` 추가.
- 각 선택지 타일:
  - 배경 = 항상 `activityColor(c.icon ?? c.label).bg`, 글자색 = `.text` (정답/오답에 따라 배경 안 바꿈).
  - `difficulty==='easy' && c.icon` 이면 `<ActivityIcon icon={c.icon} size={40}/>`를 라벨 위/왼쪽에 표시.
  - 선택 후: 그 타일에 **테두리**(정답=`--ok`, 오답=`--bad`, 4px) + **코너 배지**(정답=`check` 원형/`--ok`, 오답=`cross` 원형/`--bad`) 오버레이. 정답 타일엔 `<Burst/>`도(부모 `relative`). 오답 타일엔 `answer-shake` 클래스 1회.
  - `btn-choice`의 기존 테두리색(accent)은 미선택 상태에만.
- 스피커 버튼(문제 다시 듣기)·하단 정답/오답 문구·다음 버튼은 유지.
- **삭제**: `bg = ... 'var(--ok-bg)'/'var(--bad-bg)'` 배경 교체 로직.

**Matching.tsx**:
- Props에 `difficulty`. 좌/우 타일 배경 = `activityColor(label).bg`(+글자색). 선택중(picked) 강조는 테두리/그림자로(배경 accent 교체 대신).
- `difficulty==='easy'`일 때만 각 타일에 그 쌍의 `pair.icon` 표시(좌=pairs[i].icon, 우=pairs[origIdx].icon → 정답 쌍끼리 같은 아이콘). normal은 아이콘 숨김.
- 맞춘 타일: 배경 `--ok-bg` 교체 대신 **테두리(--ok)+체크 배지** 오버레이 유지. 오답 시도: 두 타일에 `answer-shake` 1회.

**OXGame.tsx**:
- 아이콘/팔레트 없음. O·X 큰 버튼 유지. **피드백만**: 정답이면 선택 버튼에 `<Burst/>`+체크 배지, 오답이면 `answer-shake`+X 배지. 기존 `--ok-bg/--bad-bg` 배경 교체는 제거하고 테두리/배지 오버레이로.

**Sequence.tsx**:
- Props에 `difficulty`. 항목 타일 배경 = `activityColor(item.icon ?? item.label).bg`. `easy && item.icon`이면 아이콘 표시, normal 숨김. 순서 맞음/틀림 피드백은 위와 동일(맞으면 체크, 틀리면 shake+X). (모듈1엔 sequence 없음 — 확장 단계에서 검증.)

### STEP 8 — 모듈1 데이터에 아이콘 부여 (`src/data/lessons/m1.ts`)
- 모든 `card-pick` 선택지(`choices[].icon`)와 `matching` 쌍(`pairs[].icon`)에 `icon` 추가.
- 값 = `public/lessons/pecs/`에 있는 basename. **있는 것(PECS 40종·재사용)부터 먼저 채우고**, 없는 개념은 `missing-activity-icons.md`의 파일명 후보를 그대로 사용(아이콘 파일은 안티그래비티가 채움; 없으면 ActivityIcon이 조용히 숨김 → 텍스트로 폴백).
- OX는 아이콘 불필요.

---

## 4. 완료 기준 (모듈1)
1. card-pick·matching 선택지에 액티비티 색 상시 적용 + (easy) 아이콘 표시/(normal) 숨김, 스피커 유지.
2. 정답=폭죽+체크 배지+테두리, 오답=흔들림+X 배지+테두리. **배경 전체 색 교체 방식 완전 제거**.
3. `prefers-reduced-motion`에서 폭죽·흔들림 없이 배지만. 색+아이콘+TTS 3중 유지.
4. 난이도 토글(TopBar)로 easy↔normal 전환 시 아이콘 표시/숨김이 실제로 바뀜.
5. `npm run lint`(tsc) + `npm run check:encoding` + `npm run build` 통과.
6. 프리뷰로 모듈1의 card-pick·matching·ox 각 1개 이상에서 위 동작 육안 확인(정답·오답·난이도 전환).

## 5. 접근성·제약 (불변)
- 정답/오답은 **색+아이콘(배지)+TTS 3중** — 색만으로 판단하게 두지 않음.
- 액티비티 색 위 글자는 흰색으로 AA(4.5:1) 확보(팔레트가 그 전제로 선정됨). 아이콘 배지도 대비 확보.
- 애니는 1회성만, 반복·점멸·소리 금지. `prefers-reduced-motion` 완전 대응.
- 터치 타깃 64px(핵심 조작) 유지, 포커스 링 유지.

## 6. 확장 (모듈1 통과 후)
- 나머지 5모듈 데이터에 아이콘 부여(sequence 포함). 신규 아이콘 54종 도착분부터 순차 적용.
- 코드는 위 컴포넌트/유틸 재사용 — 데이터 작업만 남음.
