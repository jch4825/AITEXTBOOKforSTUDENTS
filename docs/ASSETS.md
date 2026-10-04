# 이미지 자산 기준

## 서비스 자산

실제 앱에서 사용하는 이미지는 `public/` 아래에만 둡니다.

- `public/lessons/story/m1` ~ `m6`: 스튜디오 이야기 248장
- `public/lessons/story/module-close`: 단원 마무리 이야기 18장
- `public/lessons/remodel`: 현재 차시 활동에서 사용하는 장면·아이콘
- `public/lessons/extra`: remodel에서 옮긴 옛 이야기 컷. 22장은 교사 학습지 상 수준 셋째 칸의 보조 그림으로 쓰고(`src/features/teacher/worksheet/extraIllustrations.ts`), 차시마다 겹치지 않는 49장은 학습지 편집기의 그림 고르기에서 장면 그림이나 카드 그림으로 고를 수 있다(`src/data/lessonExtraCuts.ts`)
- `public/lessons/pecs/m1` ~ `m6`: 단원별 그림 카드 판 176장(낱말이 그림에 인쇄돼 있다). 선택지 그림 카드(`src/data/choiceCards/`)와 하·중 수준 학습지가 쓴다. 폴더 바로 아래의 127장은 옛 그림 카드로 `src/data/legacyPecs.ts`에 이름을 모아 두었다
- `public/characters`: 캐릭터 SVG
- `public/images`: 활동에서 직접 참조하는 보조 이미지
  - `public/images/games`: 놀이에서 쓰는 한 장짜리 그림. 학습지 편집기의 그림 고르기에서 카드 그림으로 고를 수 있다(`src/data/gameIllustrations.ts`)

스토리 이미지는 총 266개이며 데이터의 `imageSrc`와 일대일로 연결됩니다.

## 경로 규칙

GitHub Pages base path는 `/AITEXTBOOKforSTUDENTS/`입니다. 데이터에는 `/lessons/...`처럼
public 루트 경로를 쓰고, 컴포넌트에서는 `src/utils/publicAssetUrl.ts`로 실제 URL을 만듭니다.

## 저장하지 않는 파일

- 이미지 생성용 스토리보드와 캐릭터 참조 시트
- 생성 대기열과 일회성 변환 스크립트
- Playwright 스크린샷과 시각 검수용 contact sheet
- JPG/PNG 원본과 WebP 서비스본의 불필요한 중복
- 루트에 임시로 붙여 넣은 참고 이미지

필요한 중간물은 작업 중 임시 폴더에서 만들고 최종 WebP만 커밋합니다. 이전 원본이 필요하면
Git 기록에서 복구합니다.

## 검사

```bash
npm run check:public-images
npm run check:visual-novel-story
npm run check:portfolio-images
```

세 검사는 참조 파일 존재 여부, 스토리 이미지 수, 빈 이미지 슬롯, 제거된 레거시 경로의 재등장을
확인합니다.
