# D5 에셋 명세 — 캐릭터 컷 (SVG/PNG)

> 이 문서 하나로 Antigravity(또는 이미지 생성기)가 D5 캐릭터 에셋을 그대로 만들 수 있도록
> 작성한 실행 명세다. **파일명·경로·규격은 앱이 그대로 로드하므로 한 글자도 바꾸면 안 된다.**
> 캐릭터 시트 4장은 `docs/character-sheets/{jinwoo,yoona,minjun,aimi}-sheet.png` — 생성 시 첨부.
>
> 영상(mp4)은 이번 스코프에서 제외한다. 필요한 파트에만 나중에 추가할 예정.

---

## 앱이 에셋을 읽는 방식 (파일명이 load-bearing인 이유)

`src/components/CharacterAvatar.tsx`가
`public/characters/{id}-{expression}.png` → `.svg` → 플레이스홀더 순으로 로드한다.
→ **PNG를 넣으면 기존 SVG를 자동으로 이긴다(코드 수정 0).** SVG로 갈 거면 같은 이름의 `.svg`를 덮어쓴다.
현재 `public/characters/`의 28개 `.svg`는 코드 벡터 추출본(시각 동일) — **이걸 실제 그림책풍 컷으로 바꾸는 것이 목표.**

---

## 캐릭터 컷 — 28개 (4인 × 표정 7종)

### 규격 (불변)
- **경로/파일명**: `public/characters/{id}-{expression}.png` (권장) 또는 `.svg` (기존 덮어쓰기)
  - `{id}` = `aimi` · `jinwoo` · `yoona` · `minjun`
  - `{expression}` = `neutral` · `happy` · `surprised` · `thinking` · `cheer` · `curious` · `sleepy`
- **크기**: 512 × 512 px, 정사각
- **배경**: 완전 투명 (PNG alpha / SVG 배경 없음)
- **프레이밍**: **흉상(가슴 위)**, 인물이 프레임 중앙, 시선 정면. **4인 전부 같은 눈높이·같은 크롭**
  (말풍선·장면에서 나란히 놓이므로 프레임 통일이 핵심)
- **스타일**: 따뜻한 그림책풍 플랫 일러스트, 낮은 채도 파스텔, 부드러운 자연광, 깔끔한 외곽선.
  차시 장면 그림(`public/lessons/*.webp`)과 같은 화풍.
- **금지**: 글자·숫자·로고·워터마크. 점멸·강한 그림자·고채도. 무섭거나 과장된 표정(저자극 원칙).

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

## 완료 기준 (Acceptance)
1. `public/characters/`에 28개 파일(png 또는 svg) — 4인 프레임 통일, 512² 투명, 화풍 일관.
2. 라이브에서 말풍선·정리 화면·Home·목차 아바타가 새 컷으로 뜬다(코드 수정 없이).
3. 커밋 후 `npm run build` 통과.
