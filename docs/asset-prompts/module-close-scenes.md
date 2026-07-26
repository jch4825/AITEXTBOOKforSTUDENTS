# Module-close story scenes

- 생성 방식: built-in `imagegen`
- 참조 이미지: `docs/character-sheets/{jinwoo,yoona,minjun,aimi}-sheet.png`
- 원본: `docs/storyboards/generated/module-close/m1-close-storyboard.webp` ~ `m6-close-storyboard.webp`
- 서비스본: `public/lessons/story/module-close/m1/` ~ `m6/`
- 규격: 모듈별 2×2 스토리보드의 첫 3패널을 1200×900 WebP로 분리
- 공통 스타일: 따뜻하고 선명한 한국 교육용 웹툰, 자연스러운 인체, 텍스트·말풍선·워터마크 없음

## 장면 프롬프트 요약

| 모듈 | 장면 1 | 장면 2 | 장면 3 |
|---|---|---|---|
| M1 | 새 학생 하린이의 안전 사용 질문 | 열 번의 탐구 기록 펼치기 | 아이미 사용 설명서 전달 |
| M2 | 요청을 말하기 어려운 새 동아리원 | 열 가지 요청 기록 조립 | 프롬프트 노트로 수정·확인 |
| M3 | AI가 숙제를 모두 해도 되는지 질문 | 공부 도구를 기능별로 정리 | 공부 도우미 도구함 발표 |
| M4 | 열 가지 AI 안전 기록 최종 점검 | 위험 상황별 확인·보호·도움 경로 | 도움망과 안전 도장이 담긴 여권 |
| M5 | 새 문제 세 가지 중 하나 선택 | 기록을 문제 해결 지도로 연결 | 조건 변화에서 경로를 고쳐 검증 |
| M6 | 마을 행사 하루 계획 | 교통·날씨 변화에 공식 정보로 수정 | 생활 원칙과 여섯 단원 졸업 발표 |

세부 프롬프트는 각 스토리보드에서 장면 순서를 `top-left → top-right → bottom-left`로 고정하고, `bottom-right`는 비어 있는 장식 배경으로 지정했습니다.
