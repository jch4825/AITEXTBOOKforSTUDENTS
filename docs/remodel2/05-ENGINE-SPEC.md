# Wave 2 엔진 스펙 (고성능 모델용)

Wave 1(레슨 텍스트)이 채워 둔 데이터 필드를 실제 화면 구조로 발화시키는 작업.
실행 난도가 높으므로 Sonnet 레슨 세션이 아니라 별도의 엔진 세션(고성능 모델 권장,
사람 검수 필수)에서 수행한다. 여기 적힌 것은 요구 사양이며 구현 세부는 재량이다.

## 0. 불변 조건 (전 항목 공통)

- `STUDIO_STAGES` 배열·리듀서·`StudioEvidenceV2` 스키마를 바꾸지 않는다.
  포맷은 **표시 순서와 화면 옷**만 바꾼다. 기록되는 단계 의미는 동일하다.
- `check:studio-pilot`이 리듀서의 단계 순서 문자열을 검사한다 — 통과 유지.
- 미지정 `format` 차시는 현행과 동일하게 렌더링된다 (점진 적용 가능해야 함).
- 모바일 390px·글자 125%·`prefers-reduced-motion` 존중.

## 1. 포맷 렌더링 (P3)

`StudioDefinition.format`('A'~'E', 01-FORMATS.md)에 따라 `StudioExperience`가
단계 표시 순서와 레이아웃을 바꾼다. 권장 구현:

- `src/features/studio/formats/` 아래 포맷별 표시 순서 정의
  (`FORMAT_STAGE_FLOW: Record<StudioFormat, StageView[]>` 수준의 선언 데이터 +
  얇은 스위처). 거대 분기 컴포넌트를 만들지 말 것.
- **A**: 이야기 전면화 — encounter 단계에서 knowledge 패널을 숨기고 이야기를
  풀블리드로. knowledge 3장은 first-attempt 다음의 '정리 노트' 뷰로 이동.
- **B**: encounter 진입 전에 게임 뷰(도입 프레임: "먼저 겪어 보기" + 관찰 안내
  1줄)를 삽입. complete 단계의 게임은 '재도전' 라벨로 유지. 게임 컴포넌트 자체는
  무수정 재사용(`MiniGameSlot` 재활용, supportLevel 전달 동일).
- **C**: transfer 데이터의 과제 유형을 콜드오픈 뷰로 복제 제시(기록은 하지 않는
  연습 시도 — evidence에 남기지 않는다). transfer 단계에서 "처음 골랐던 답" 1줄
  비교 표시(세션 메모리, 저장 금지).
- **D**: encounter 장면과 first-attempt를 대화창 프레임으로 합성. 선택 후
  `reaction` 대사를 아이미/인물 말풍선으로 출력하고 다음 장면으로 합류.
- **E**: artifact의 빈 틀을 첫 화면부터 우측 고정 표시하고 단계 통과마다
  해당 필드가 채워지는 진행 표시. artifact 데이터 스키마 무변경.

## 2. 화자 말풍선 (P1)

Wave 1 각본은 문자열 안에 `진우: "..."` 표기를 쓴다. 엔진은 이 표기를 파싱해
화자 라벨(이름 + 색 토큰)을 붙인 말풍선으로 렌더링한다.
- 파싱 실패 시(화자 표기 없음) 현행처럼 일반 문단으로 — 하위 호환 필수.
- 인물 초상은 2차 범위 밖(선택 과제). 넣는다면 기존 캐릭터 일관 스타일로
  표정 차분 시트를 별도 제작하되 저장소 자산 규칙(docs/ASSETS.md)을 따른다.

## 3. 선택 반응 (P4)

`StudioChoice.reaction`이 있으면 선택 직후 반응 줄을 표시한다.
- 오답 선택: 반응 표시 후 재선택 허용 (벌점·부정 효과음 금지).
- 정답 선택: 반응 표시 후 진행. `isCorrect` 미지정 선택지(열린 선택)는 반응만.
- evidence 기록은 현행 그대로 (최종 선택만 저장, 반응은 기록하지 않는다).

## 4. 시즌 연출 (P5)

- `visualNovel.seasonTag` → 이야기 첫 장면 상단 자막 1줄.
- `visualNovel.nextEpisodeHook` → artifact 단계 완료 뒤(또는 complete 진입 시)
  예고 카드 1줄.
- 목차(ContentsView)에 단원별 시즌 진행 게이지(완료 차시 수)를 추가하는 것은
  선택 과제. 진도 저장 스키마는 바꾸지 않는다.

## 5. 이야기·개념 분리 (P1)

포맷 A~E 공통: encounter 화면에서 knowledge 패널 상시 병렬 노출을 중단하고,
이야기 뒤 '정리 노트' 뷰로 순차 제시한다. TTS 버튼·사전 밑줄
(`wrapDictionaryTerms`) 동작은 유지.

## 6. 목표 SSOT + 검사 (P2)

- `src/data/lessonObjectives.ts` 신설: 차시당
  `{ lessonId, studentMission, teacherObjective, aiRole, standards: string[], status }`.
  내용은 각 레슨 지시서 §2의 확정본을 그대로 옮긴다.
- `studios`·`lessons`의 objective 문자열이 SSOT의 studentMission과 일치하는지
  검사하는 `scripts/check-objectives.mjs` + `npm run check:objectives` 추가.
  `status: 'applied'`인 차시만 강제한다(Wave 1 진행 중 부분 적용 허용).
- 금지 서술어(알아봐요·살펴봐요·시험해 봐요·느껴 봐요)가 studentMission에
  없는지도 검사한다.
- 교사 화면(TeacherCurriculumGuide)에 차시별 성취기준 코드 표시(선택 과제).

## 7. 감각 패스 (Wave 3 준비)

- 효과음 8~10종(장면 넘김·선택·도장·팡파르), 전역 음소거, 교사 설정 연동.
  놀라게 하는 소리 금지. `ttsEnabled`와 별개 토글.
- 장면 이미지 Ken Burns 미세 모션(`prefers-reduced-motion` 시 정지).
- 구현 순서는 포맷 엔진 안정화 이후.

## 8. 완료 기준

- 파일럿 5차시(m1-l1 A · m1-l3 B · m4-l4 C · m2-l3 D · m6-l11 E)가 각 포맷으로
  렌더링되고, 포맷 미지정 차시는 현행과 픽셀 수준으로 동일.
- `npm run lint · build · check:encoding · check:studio-rollout ·
  check:studio-pilot · check:teacher-recording · check:minigames` 전부 통과.
- 1280px / 390px·125% / reduced-motion 육안 확인.
