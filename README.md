# AI 교과서 — 발달장애 학생을 위한 AI 학습

발달장애 학생이 AI를 안전하게 이해하고 생활 속에서 판단하도록 돕는 온라인 교과서입니다.
6개 단원 68차시를 PC 중심의 짧은 이야기, 선택 카드, 게임, 결과물 활동으로 제공합니다.

## 현재 구성

- 경험 중심 스튜디오 62개, 단원 마무리 성장 포트폴리오 6개
- 스토리 WebP 266개, 스튜디오마다 놀이(미니게임) 하나 — 놀이는 태블릿·PC(768px 이상)에서만 열리고, 휴대전화에서는 정리 패널로 같은 학습을 마칩니다
- 지원 수준 3단계: **충분한 지원 / 중학 / 고등**. 중학과 고등은 지원 강도이자 학년군(9학년군·12학년군 성취기준)입니다
- 읽기 지원: 듣기 단추(TTS), 그림 카드로 고르기, 쉬운 사전
- 교사 도구: 운영 허브, 과정 기록, 성취기준, 암호화 백업, A4 학습지(하·중·상)
- 준비된 AI 예시를 기본으로 쓰므로 카메라·마이크 권한 없이 핵심 학습이 끝납니다. 교사가 직접 Gemini API 키를 넣으면 AI와 대화하는 단계와 사전의 AI 풀이가 열립니다

AI를 말하는 글은 `src/data/studentDictionary.ts`의 `AI_DEFINITION` 한 곳에서 정한 정의를 따릅니다.

## 로컬 실행

```bash
npm install
npm run dev
```

기본 주소는 `http://localhost:3000/AITEXTBOOKforSTUDENTS/`입니다. Node 24를 씁니다.

## 검증

```bash
npm run lint
npm run build
npm run check:encoding
npm run check:public-images
npm run check:studio-rollout
npm run check:modules-remodel
npm run check:dictionary
```

변경 범위에 맞는 계약 검사는 `package.json`의 `check:*`와 `test:*`에서 고릅니다. 현재 기준과 완료 전
검증 절차는 `CLAUDE.md`에 있습니다.

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

## 보안

학생 정보와 API 키를 어떻게 다루는지, 취약점을 어떻게 알리는지는 `SECURITY.md`에 적었습니다.

## 저작자와 제작 방식

저작자는 전창한입니다.

이 프로젝트는 Anthropic의 Claude Code, OpenAI의 Codex, Google Antigravity 등의 인공지능 바이브코딩 도구를 사용하여 제작하였습니다. 동영상 제작에는 Google Notebook(구 NotebookLM)을, 이미지 수정에는 Google Flow를, 표지 제작에는 Google Stitch를 보조 도구로 활용하였습니다.

같은 문구가 표지 바닥글과 교사 허브의 "이 교재에 대하여"에도 있습니다(`src/data/projectCredit.ts`).

## 라이선스

이 저장소의 교재 본문·그림·코드는 [CC BY-NC-SA 4.0](LICENSE)으로 공개합니다.

- 저작자를 밝혀야 합니다.
- 영리 목적으로 쓸 수 없습니다.
- 고쳐서 공유할 때는 같은 라이선스(CC BY-NC-SA 4.0)를 적용해야 합니다.

쉬운 설명은 https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ko 에 있습니다.
출처 표시 예: 「AI 교과서 — 발달장애 학생을 위한 AI 학습」, 전창한, https://github.com/jch4825/AITEXTBOOKforSTUDENTS, CC BY-NC-SA 4.0

### 이 라이선스에 포함되지 않는 것

- **`public/sounds/`의 효과음**: 저장소 소유자가 Humble Bundle로 구매한 자료입니다. 이 저장소의 라이선스가 아니라 구매 때 받은 라이선스를 따르며, 이 프로젝트 안에서만 쓰고 꺼내 쓰거나 다시 배포하거나 다른 곳에 쓸 수 없습니다.
- `docs/reference/`의 교육과정 원문: 교육부 자료입니다.
- 외부 라이브러리와 글꼴: 각각의 라이선스를 따릅니다.
