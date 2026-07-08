# D5 에셋 명세 — 캐릭터 컷(SVG/PNG) + 영상(MP4)

> 이 문서 하나로 Antigravity(또는 이미지·영상 생성기)가 D5 에셋을 그대로 만들 수 있도록
> 작성한 실행 명세다. **파일명·경로·규격은 앱이 그대로 로드하므로 한 글자도 바꾸면 안 된다.**
> 캐릭터 시트 4장은 `docs/character-sheets/{jinwoo,yoona,minjun,aimi}-sheet.png` — 생성 시 첨부.

---

## 앱이 에셋을 읽는 방식 (파일명이 load-bearing인 이유)

- **캐릭터**: `src/components/CharacterAvatar.tsx`가
  `public/characters/{id}-{expression}.png` → `.svg` → 플레이스홀더 순으로 로드한다.
  → **PNG를 넣으면 기존 SVG를 자동으로 이긴다(코드 수정 0).** SVG로 갈 거면 같은 이름의 `.svg`를 덮어쓴다.
- **영상**: 현재 `Stage.tsx`는 `lessons/{id}.webp→png`만 로드한다. mp4는 **아직 코드 연결 안 됨** →
  영상 파일이 생기면 Stage에 ~10줄 추가하는 후속 작업 필요(아래 3번). 파일부터 만들어두면 된다.

---

## 1. 캐릭터 컷 — 28개 (4인 × 표정 7종)

### 규격 (불변)
- **경로/파일명**: `public/characters/{id}-{expression}.png` (권장) 또는 `.svg` (기존 덮어쓰기)
  - `{id}` = `aimi` · `jinwoo` · `yoona` · `minjun`
  - `{expression}` = `neutral` · `happy` · `surprised` · `thinking` · `cheer` · `curious` · `sleepy`
- **크기**: 512 × 512 px, 정사각
- **배경**: 완전 투명 (PNG alpha / SVG 배경 없음)
- **프레이밍**: **흉상(가슴 위)**, 인물이 프레임 중앙, 시선 정면. **4인 전부 같은 눈높이·같은 크롭**
  (말풍선·장면에서 나란히 놓이므로 프레임 통일이 핵심)
- **스타일**: 따뜻한 그림책풍 플랫 일러스트, 낮은 채도 파스텔, 부드러운 자연광, 깔끔한 외곽선.
  차시 장면 그림(`public/lessons/*.png`)과 같은 화풍.
- **금지**: 글자·숫자·로고·워터마크. 점멸·강한 그림자·고채도. 무서운/과장된 표정(저자극 원칙).

### 캐릭터 디자인 (캐릭터 시트를 그대로 유지)
- **aimi (아이미)**: 키 35cm 작고 귀여운 호버링 로봇. 연분홍빛 흰색 둥근 몸체, **남색 LED 얼굴 화면에
  하늘색으로 빛나는 눈과 미소**, 머리 위 안테나 끝 파란 구슬, 짧고 둥근 팔, 살짝 떠 있음.
- **jinwoo (강진우)**: 17세 한국 남학생. 짧고 부스스한 갈색 머리, 남색 블레이저 교복 + 빨간 넥타이, 밝고 활달.
- **yoona (서윤아)**: 17세 한국 여학생. 단정한 갈색 단발(일자 앞머리), 남색 블레이저 + 베이지 조끼 + 빨간 리본, 차분·섬세.
- **minjun (박민준쌤)**: 37세 한국 남교사. 안경, 정갈한 검은 머리, 남색 정장 + 갈색 넥타이, 온화·차분.

### 표정 7종 (사람 3인 + 아이미 공통, 아이미는 LED 얼굴로 표현)
| expression | 연출 |
|---|---|
| `neutral`   | 평온한 기본 표정, 입 다물고 옅은 미소 |
| `happy`     | 밝게 웃는, 눈 살짝 접힘 |
| `surprised` | 눈 커지고 입 벌린 놀란(무섭지 않게) |
| `thinking`  | 골똘히 생각, 손 턱에 / 아이미는 눈이 위로·안테나 갸웃 |
| `cheer`     | 신나서 응원, 두 손 들고 활기(아이미는 눈이 반짝) |
| `curious`   | 궁금해 고개 갸웃, 눈 동그랗게 |
| `sleepy`    | 졸린·나른한, 눈 반쯤 감김, 하품 느낌(편안하게) |

### 산출 체크리스트 (28)
```
aimi-neutral   jinwoo-neutral   yoona-neutral   minjun-neutral
aimi-happy     jinwoo-happy     yoona-happy     minjun-happy
aimi-surprised jinwoo-surprised yoona-surprised minjun-surprised
aimi-thinking  jinwoo-thinking  yoona-thinking  minjun-thinking
aimi-cheer     jinwoo-cheer     yoona-cheer     minjun-cheer
aimi-curious   jinwoo-curious   yoona-curious   minjun-curious
aimi-sleepy    jinwoo-sleepy    yoona-sleepy    minjun-sleepy
```
→ `public/characters/`에 저장. **PNG면 즉시 반영(기존 svg보다 우선), SVG면 같은 이름 덮어쓰기.**

---

## 2. 차시 영상 — 최대 68개 (차시당 1개, 선택 사항)

### 규격 (불변)
- **경로/파일명**: `public/lessons/{lessonId}.mp4`
  - `{lessonId}`: `m1-l1`…`m1-l11`, `m2-l1`…`m2-l11`, `m3-l1`…`m3-l11`,
    `m4-l1`…`m4-l11`, `m5-l1`…`m5-l12`, `m6-l1`…`m6-l12` (총 68)
  - **차시 이미지와 같은 장면**: 이미 있는 `public/lessons/{id}.png`가 그 차시의 도입 장면이다.
    영상은 그 장면을 8초짜리로 "살짝 움직이게" 한 것.
- **비율/길이**: 16:9, **8초 내외**, H.264 mp4, 소리 없음(또는 아주 잔잔한 BGM 없이)
- **모션**: 카메라 고정 또는 **아주 느린 줌 인만**. 점멸·빠른 컷·흔들림·급격한 움직임 금지(저자극).
- **금지**: 화면 내 글자·자막·로고. 말풍선이 나오면 **빈 말풍선**. 입모양(대사) 없음.
- **분위기**: 잔잔하고 따뜻하게.

> 우선순위: 영상은 **선택**이다. 그림(68/68)이 이미 완비돼 A 등급 목표엔 캐릭터 컷(1번)이 먼저다.
> 68개 다 만들 필요 없이 대표 차시 몇 개부터 시작해도 된다.

---

## 3. 영상 재생 코드 연결 (파일 생기면 할 후속 작업)

`Stage.tsx`에 mp4 우선 재생 추가 (있으면 `<video autoPlay muted loop playsInline>`, 없으면 현재 webp/png 폴백).
`prefers-reduced-motion` 시 영상 대신 정지 이미지 유지. **약 10줄**, 파일 확보 후 요청하면 바로 반영 가능.

---

## 완료 기준 (Acceptance)
1. `public/characters/`에 28개 파일(png 또는 svg) — 4인 프레임 통일, 512² 투명, 화풍 일관.
2. 라이브에서 말풍선·정리 화면·Home 아바타가 새 컷으로 뜬다(코드 수정 없이).
3. (선택) `public/lessons/{id}.mp4` — 16:9·8초·저자극, 해당 차시 이미지와 같은 장면.
4. 커밋 후 `npm run build` 통과.
