# 차시당 단일 학습목표 설계

## 1. 문제

현재 68차시는 `LessonContent.objective`와 `HardLessonContent.goal.easy / normal / hard`를 함께 가지고 있다. 학생 화면은 지원 수준에 따라 세 목표 중 하나를 선택하고, 스튜디오의 설명 패널도 충분한 지원·보통·도전적에 따라 서로 다른 목표를 보여 준다.

학습목표의 서술과 깊이를 지원 정도에 따라 달리하는 것은 학생에게 기대하는 교육적 도달점을 지원 수준과 결부시키는 문제가 있다. 지원은 목표를 낮추거나 높이는 장치가 아니라 같은 목표에 도달하는 정보량, 힌트, 표현 방법을 조절하는 장치여야 한다.

## 2. 확정 원칙

- 한 차시에는 학습목표가 하나만 존재한다.
- 기존 보통의 목표인 `hard.goal.normal` 68문장을 각 차시의 유일한 `lesson.objective`로 사용한다.
- 충분한 지원·보통·도전적은 모두 같은 `lesson.objective`를 표시하고 읽는다.
- 지원 수준에 따라 설명 문단 수, 용어, 방법 힌트, AI 관점의 깊이가 달라지는 기존 기능은 유지한다.
- 학습목표와 성취기준은 별개다. 성취기준 데이터는 수정하지 않는다.

## 3. 데이터 구조

`HardLessonContent`에서 `goal` 필드를 삭제한다.

변경 전:

```ts
interface HardLessonContent {
  goal: { easy: string; normal: string; hard: string };
  concept: string[];
  terms: HardTerm[];
  method?: string[];
  limits: string;
  wrapUpHard: string;
}
```

변경 후:

```ts
interface HardLessonContent {
  concept: string[];
  terms: HardTerm[];
  method?: string[];
  limits: string;
  wrapUpHard: string;
}
```

`src/data/lessons/hard/m1.ts`부터 `m6.ts`까지 있는 68개의 `goal` 객체를 제거한다. 각 객체의 기존 `normal` 문장은 대응하는 `src/data/lessons/m1.ts`부터 `m6.ts`의 `objective`로 이동한다. 이관 뒤 목표 문장은 차시 데이터 한 곳에만 남는다.

## 4. 화면 동작

### 일반 차시

`LessonView`의 목표 카드는 지원 수준이나 어려움 콘텐츠 존재 여부를 보지 않고 항상 `lesson.objective`를 사용한다. 첫 단계에 목표 카드가 나타나는 기존 위치와 TTS 버튼은 유지한다.

### 핵심 경험 스튜디오

`StudioExplanationPanel`은 모든 지원 수준에서 `lesson.objective`를 표시하고 읽는다. 설명 본문은 계속 다음과 같이 달라진다.

- 충분한 지원: `lesson.bodyEasy`
- 보통: `lesson.bodyNormal`과 방법 앞부분
- 도전적: `hard.concept`, 전체 방법, 용어와 주의점

### 교사 화면

교사 허브의 학습목표·성취기준 목록은 이미 `lesson.objective`를 사용한다. 68문장을 이관하면 학생 화면과 교사 화면이 자동으로 같은 목표를 공유한다.

## 5. 계약 검사

새 자동 검사는 다음을 보장한다.

1. 일반 차시 파일에 `objective`가 정확히 68개 존재한다.
2. 어려움 콘텐츠 파일에는 `goal:`과 `goal.easy / goal.normal / goal.hard`가 존재하지 않는다.
3. `HardLessonContent` 타입에 `goal` 필드가 존재하지 않는다.
4. `LessonView`와 `StudioExplanationPanel`은 목표로 `lesson.objective`만 사용한다.
5. 68개의 `lesson.objective`가 이관 전 보통 목표 문장과 정확히 일치한다.
6. 교사 목표 목록은 계속 `lesson.objective`를 사용한다.

5번을 지속적으로 검증하기 위해 이관 전 68개 보통 문장의 차시 ID별 기준표를 검사 스크립트 안에 고정한다. 이후 목표 문장을 교육적으로 수정하려면 단일 `lesson.objective`와 기준표를 함께 의도적으로 갱신한다.

## 6. 브라우저 검증

일반 차시와 스튜디오 차시를 각각 열고 충분한 지원·보통·도전적으로 바꾼다. 세 수준에서 목표 문장이 동일하고, 설명 본문과 힌트의 양만 달라지는지 확인한다. 목표 TTS가 같은 문장을 읽으며 자동 재생되지 않는지도 확인한다.

## 7. 범위 밖

- 설명 본문 `bodyEasy / bodyNormal / hard.concept` 통합
- 게임의 선택지 수와 시각 지원 변경
- 정리 문장 `wrapUpEasy / wrapUpNormal / wrapUpHard` 통합
- 성취기준 변경
- 학습목표 문장의 추가 재작성
