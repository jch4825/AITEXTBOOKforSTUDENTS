# AI 교과서 — 발달장애 학생을 위한 AI 학습

발달장애 학생이 AI를 안전하게 이해하고 생활 속에서 판단하도록 돕는 온라인 교과서입니다.
6개 단원 68차시를 PC 중심의 짧은 이야기, 선택 카드, 게임, 결과물 활동으로 제공합니다.

## 현재 구성

- 경험 중심 스튜디오 62개
- 단원 마무리 성장 포트폴리오 6개
- 스토리 WebP 266개
- 충분한 지원 / 보통 / 도전적 3단계
- TTS, 쉬운 사전, 교사용 과정 기록과 암호화 백업
- 준비된 AI 예시를 기본으로 사용하므로 카메라·마이크 권한 없이 학습 가능

## 로컬 실행

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:3000/AITEXTBOOKforSTUDENTS/`입니다.

## 검증

```bash
npm run lint
npm run build
npm run check:encoding
npm run check:public-images
npm run check:studio-rollout
npm run check:modules-remodel
```

## 배포

`main`에 push하면 GitHub Actions가 GitHub Pages로 배포합니다.

- 서비스: https://jch4825.github.io/AITEXTBOOKforSTUDENTS/
- 교사 모드: 서비스 주소에 `?teacher=1`

## 문서

- 개발 기준: `CLAUDE.md`
- 교사 운영: `docs/teacher-guide.md`
- 이미지 자산: `docs/ASSETS.md`
- 교육과정 참고: `docs/reference/2022-special-education-curriculum.pdf`

과거 계획서와 생성 중간물은 저장소에 중복 보관하지 않으며 Git 기록에서 확인합니다.
