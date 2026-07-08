# 교실 도구 도크 (Classroom Tools Dock) — 설계

- 작성일: 2026-07-09
- 대상: 전자칠판·태블릿으로 특수교육 수업을 진행하는 교사
- 목표: 수업 화면에서 바로 쓰는 교실 도구 5종을 플로팅 도크로 제공

## 1. 개요

차시 화면(LessonView) 하단에 떠 있는 **플로팅 도크**를 추가한다. 버튼 5개: **판서·타이머·PECS·학습지 인쇄·교사 자료**. 전자칠판/태블릿에서 교사가 조작하는 전제로 **전부 공개**(비번 게이트 없음), **수업 화면에서만** 노출한다(Home·목차엔 없음). 저자극 원칙 유지: 반복 애니 금지, 차분한 패널, 44px+ 터치, 포커스 링.

판서·타이머·PECS는 실제로 동작한다. 학습지 인쇄와 교사 자료는 **구조만 스텁**(버튼+"준비 중" 안내, 데이터 구조 준비)이며 콘텐츠는 나중에 채운다.

## 2. 배치

- `ClassroomDock`을 `MicroLessonFrame` 안에 렌더(차시 프레임 한정). `lessonId`를 받아 `moduleIdFromLessonId`로 현재 모듈을 안다(PECS·교사자료가 모듈 인지).
- 위치: 화면 **하단 왼쪽 고정**(`fixed`), 푸터(이전/다음) 위에 뜬다. 레이아웃 높이를 먹지 않음.
- 도크는 항상 접근 가능한 아이콘 버튼 줄. 한 도구를 열면 오버레이/패널이 뜨고, 다른 도구를 열면 이전 것은 닫힌다(한 번에 하나).

## 3. 컴포넌트

### 3.1 `ClassroomDock.tsx`
- Props: `lessonId: LessonId`.
- 상태: `open: null | 'draw' | 'timer' | 'pecs' | 'worksheet' | 'resources'`.
- 렌더: 5개 아이콘 버튼 + 열린 도구의 패널/오버레이. 각 버튼 44px+ (전자칠판은 더 크게), `aria-pressed`.
- 판서(전체화면 오버레이)만 예외적으로 도크와 독립된 전체화면 레이어.

### 3.2 `DrawBoard.tsx` (판서 — 실기능)
- 전체화면 투명 `<canvas>` 오버레이(`fixed inset-0 z-50`). 차시 위에 필기.
- 도구: 펜 색 4~5종(브랜드 잉크·모듈 계열 저채도), 굵기 1~2단, 지우개, **전체 지우기**, 닫기.
- 입력: Pointer Events(터치·펜·마우스 공통). `touch-action: none`으로 스크롤 방지.
- 휘발성: 닫거나 차시 이동 시 내용 소멸(저장 없음).
- 접근성: 닫기/지우기 버튼 라벨, ESC로 닫기.

### 3.3 `ClassTimer.tsx` (타이머 — 실기능)
- 카운트다운. 프리셋 버튼 1·3·5·10분 + 시작/멈춤/리셋.
- 표시: 패널에 칠판용 큰 숫자(mm:ss). 실행 중 패널을 닫으면 도크 옆에 작은 카운트다운 칩을 남겨 시간을 계속 보여준다(다시 열면 패널 복귀). 0 도달 시 색 변화(빨강 계열)로 알림 — 소리·점멸 없음(저자극).
- 휘발성: 세션 한정, 저장 없음.

### 3.4 `PecsBoard.tsx` (PECS — 실기능)
- 패널에 카드 그리드. **PECS_COMMON(기본 욕구, 항상)** + **현재 모듈 관련 단어**.
- 카드 = `public/lessons/pecs/{name}.webp` + 한글 라벨. 누르면 **크게 확대**(포인팅·의사소통용), 다시 누르면 원복.
- 데이터: `src/data/pecs.ts`.

### 3.5 학습지 인쇄 (스텁)
- 버튼 → 작은 안내 패널 "학습지는 준비 중이에요." 지금은 인쇄 로직 없음.
- 나중에: 차시별 학습지 PDF/print 뷰 연결(별도 작업).

### 3.6 교사 자료 (스텁, 구조 준비)
- 패널에 현재 모듈의 링크 목록 표시. 데이터가 비면 "자료 준비 중이에요."
- 데이터: `src/data/teacherResources.ts` — 모듈별 `{label, url}[]`. 지금은 빈 배열. 나중에 동영상 링크 등을 채우면 자동 노출.
- 링크는 `target="_blank" rel="noopener"`.

## 4. 데이터

### 4.1 `src/data/pecs.ts`
심볼 basename 배열 + 라벨 맵(한 곳)으로 단순화한다. PecsBoard가 basename→라벨을 조회해 카드를 만든다.
```ts
// name = public/lessons/pecs/{name}.webp 의 basename
export const PECS_LABELS: Record<string, string> = {
  toilet: '화장실', faucet: '물', paper_cup: '컵', snack: '간식',
  smartphone: '스마트폰', ai_speaker: '음성비서', ai_aimi: '아이미', refrigerator: '냉장고',
  cat: '고양이', rabbit: '토끼', elephant: '코끼리', dinosaur: '공룡', turtle: '거북이',
  book: '책', pencil: '연필', eraser: '지우개', apple: '사과', bread: '빵', milk: '우유',
  cheese: '치즈', ham: '햄', chocolate: '초콜릿', ramen: '라면', pot: '냄비', toaster: '토스터',
  knife: '칼', lettuce: '상추', bus: '버스', umbrella: '우산', cloud: '구름', clothes: '옷',
  sunglasses: '선글라스', soccer_ball: '축구공', key: '열쇠', light_switch: '전등 스위치',
  // 라벨은 구현 시 나머지 심볼까지 채운다(40종). 미등록 시 basename 그대로 표시.
};

// 기본 의사소통 욕구 — 모든 모듈에서 항상 노출
export const PECS_COMMON: string[] = ['toilet', 'faucet', 'paper_cup', 'snack'];

// 모듈별 관련 단어 (초안 — 교사 피드백으로 조정). COMMON과 중복은 컴포넌트에서 제거.
export const PECS_BY_MODULE: Record<ModuleId, string[]> = {
  m1: ['smartphone', 'ai_speaker', 'ai_aimi', 'refrigerator', 'cat', 'rabbit', 'elephant', 'dinosaur'],
  m2: ['ai_aimi', 'smartphone', 'book', 'pencil', 'sunglasses'],
  m3: ['book', 'pencil', 'eraser', 'apple', 'cat', 'dinosaur', 'ai_aimi'],
  m4: ['smartphone', 'key', 'light_switch', 'book'],
  m5: ['ramen', 'pot', 'toaster', 'bread', 'knife', 'lettuce', 'cheese', 'ham', 'soccer_ball'],
  m6: ['apple', 'bread', 'milk', 'cheese', 'ham', 'chocolate', 'bus', 'umbrella', 'cloud', 'clothes', 'sunglasses', 'refrigerator', 'pot', 'book'],
};
```

### 4.2 `src/data/teacherResources.ts`
```ts
export interface TeacherLink { label: string; url: string }
export const TEACHER_RESOURCES: Record<ModuleId, TeacherLink[]> = {
  m1: [], m2: [], m3: [], m4: [], m5: [], m6: [],  // 나중에 동영상 링크 등 채움
};
```

## 5. 아이콘 (Icon.tsx에 추가)
- `pen`(판서), `timer`(시계), `printer`(인쇄), `cards`(PECS 카드), `link`(자료 링크). Lucide 스타일 자체 SVG, currentColor.

## 6. 원칙·제약
- **전부 공개**(게이팅 없음), **차시 화면 한정**.
- 저자극: 1회성 fade만, 점멸·소리·반복 애니 금지. 색은 저채도.
- 접근성: 모든 버튼 44px+, 포커스 링 유지, aria 라벨, ESC 닫기.
- 휘발성: 판서·타이머 상태는 저장하지 않음(차시 이동/닫기 시 리셋).
- UTF-8, tsc 통과, PC 우선.

## 7. 이번 스코프 밖
- 학습지 실제 콘텐츠·인쇄 로직(버튼 스텁만).
- 교사 자료 실제 링크 값(빈 구조만).
- 판서 내용 저장/불러오기, 타이머 소리 알림.

## 8. 완료 기준
1. 차시 화면 하단에 도크 5버튼 노출(Home·목차엔 없음).
2. 판서: 전체화면 필기·색/지우개/전체지우기/닫기 동작, 터치 OK.
3. 타이머: 프리셋·시작/멈춤/리셋·0 도달 표시 동작.
4. PECS: 현재 모듈 카드 + 기본욕구 표시, 카드 확대 동작.
5. 학습지·교사자료: 스텁 패널("준비 중") + 데이터 구조 존재.
6. `npm run lint`·`check:encoding`·`build` 통과, 저자극·접근성 원칙 유지.

## 9. 파일
- 신규: `ClassroomDock.tsx`, `DrawBoard.tsx`, `ClassTimer.tsx`, `PecsBoard.tsx`(+학습지·자료 패널은 Dock 내부 소형 컴포넌트로 시작), `data/pecs.ts`, `data/teacherResources.ts`.
- 수정: `MicroLessonFrame.tsx`(도크 렌더), `Icon.tsx`(아이콘 5종).
