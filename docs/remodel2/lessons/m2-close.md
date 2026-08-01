# m2-l11 지시서 — 단원 마무리: 프롬프트 노트 [시즌 피날레]

먼저 읽기: `../04-HARNESS.md` → `../02-CHARACTERS.md` → 이 문서.
시즌 「부탁의 달인」 최종화 연출만 더한다. 작업 범위가 매우 작다.

## 1. 대상 파일 (이 밖은 수정 금지)
- `src/data/modulePortfolios/m2.ts` — `closingStory`의 `copy` 문자열 3개만

## 2. 학습목표
**변경 없음.** m2-l11 objective는 그대로 둔다. 계약 갱신 없음.

## 3. 각본 리라이트 (closingStory copy 3개)
id·label·imageSrc·alt 유지, copy만 최종화 톤으로 교체.

- 장면1: `[부탁의 달인 · 최종화]`로 열고, 이번 시즌의 과제(부탁하는 법 배우기)를
  대사로 환기한다.
- 장면2: 지난 화 콜백 2~3개를 인물 대사로 호명한다. 콜백 소재는 이 시즌의
  화별 제목만 사용: 지난달 음악회 소동(1화), 아무거나의 함정(3화), 구멍 난
  준비표(6화), 5시 종료 미스터리(9화).
- 장면3: 완성 선언 대신 학생에게 넘기며 끝낸다.
  예) `윤아: "우리가 찾은 부탁의 기술을 카드로 모으자. 너의 첫 카드는 무엇이야?"`

## 4. 하지 말 것
- closingStory의 copy 외 다른 필드(title·crumb·kicker·artifactChoices·
  guideSections·transferPrompt·nextChoices) 수정 금지.
- 이미지 3장 경로 수정 금지.
- 콜백에 없는 사건을 지어내지 않는다.

## 5. 완료 기준
- `npm run lint` · `npm run build` · `npm run check:encoding` ·
  `npm run check:module2-remodel` · `npm run check:portfolio-images`
- 육안: 세 장면이 최종화 톤으로 읽히는지.
