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

이 프로젝트는 Anthropic의 Claude Code, OpenAI의 Codex, Google Antigravity 등의 인공지능 바이브코딩 도구를 사용하여 제작하였습니다. 동영상 제작에는 Google Notebook(구 NotebookLM)을, 이미지 생성에는 OpenAI의 이미지 생성 도구를, 이미지 수정에는 Google Flow를, 표지 제작에는 Google Stitch를 보조 도구로 활용하였습니다.

같은 문구가 표지 바닥글과 교사 허브의 "이 교재에 대하여"에도 있습니다(`src/data/projectCredit.ts`).

## 자료 출처와 참고문헌

교사 허브의 "이 교재에 대하여" 아래 "자료 출처와 참고문헌"에도 같은 내용이 있습니다(`src/data/projectSources.ts`). 주소는 2026-10-17에 확인했습니다.

### 자료 출처

| 자료 | 만든 곳 | 쓰는 조건 |
| --- | --- | --- |
| 이야기 그림(266장)과 그림 카드 | 저작자가 OpenAI의 이미지 생성 도구로 만들고 Google Flow로 다듬음 | CC BY-NC-SA 4.0(이 교재) |
| 표지 | 저작자가 Google Stitch로 만듦 | CC BY-NC-SA 4.0(이 교재) |
| 차시 도움 영상(1~4단원 40편) | 저작자가 Google Notebook(구 NotebookLM)으로 만들어 [유튜브 채널 "00학번ㅏ"](https://www.youtube.com/@00%ED%95%99%EB%B2%88)에 올림 | 학생 화면은 youtube-nocookie.com으로만 엶 |
| 효과음(9개) | 저작자가 Humble Bundle로 구매 | GameDev Market 표준 라이선스. 앱 안에서만 쓰고 재배포 금지(`public/sounds/NOTICE.md`) |
| 한글 글꼴 [Pretendard](https://github.com/orioncactus/pretendard) | 길형진(orioncactus) | SIL Open Font License 1.1 |
| 놀이판 글꼴 [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | Florian Karsten, Google Fonts | SIL Open Font License 1.1 |
| 아이콘 [Material Symbols](https://fonts.google.com/icons) | Google | Apache License 2.0 |
| 교육과정 원문(`docs/reference/`) | 교육부, 2022 개정 특수교육 교육과정(기본 교육과정) | 교육부 자료 |
| 교사 자료의 외부 도구 링크 | 각 기관·회사의 공식 사이트 | 각 사이트의 이용 약관 |
| 프로그램 라이브러리 | React, Vite, Tailwind CSS, TypeScript | MIT License 또는 Apache License 2.0 |

### 참고문헌

교재 문장을 옮겨 온 것이 아니라, 개념 설명과 지도 방법을 정하고 대조할 때 참고한 자료입니다.

**인공지능의 뜻과 원리**

- IBM. [What is artificial intelligence (AI)?](https://www.ibm.com/think/topics/artificial-intelligence) IBM Think. — 인공지능의 정의, 1단원
- IBM. [What is machine learning?](https://www.ibm.com/think/topics/machine-learning) IBM Think. — 1단원
- IBM. [What are large language models (LLMs)?](https://www.ibm.com/think/topics/large-language-models) IBM Think. — 1단원 3차시
- IBM. [What is computer vision?](https://www.ibm.com/think/topics/computer-vision) IBM Think. — 1단원 4차시
- IBM. [What is speech recognition?](https://www.ibm.com/think/topics/speech-recognition) IBM Think. — 1단원 5차시
- IBM. [What is AI bias?](https://www.ibm.com/think/topics/ai-bias) IBM Think. — 1단원 6차시
- IBM. [What are AI hallucinations?](https://www.ibm.com/think/topics/ai-hallucinations) IBM Think. — 3·4단원
- IBM. [What is a recommendation engine?](https://www.ibm.com/think/topics/recommendation-engine) IBM Think. — 4단원 10차시
- OECD (2019, 2024 개정). [Recommendation of the Council on Artificial Intelligence (OECD/LEGAL/0449).](https://legalinstruments.oecd.org/en/instruments/OECD-LEGAL-0449) — 인공지능 시스템의 정의
- OECD.AI (2024). [Updates to the OECD’s definition of an AI system explained.](https://oecd.ai/en/wonk/ai-system-definition-update) — 인공지능 시스템의 정의

**AI에게 묻고 대화하는 방법**

- IBM. [What is prompt engineering?](https://www.ibm.com/think/topics/prompt-engineering) IBM Think. — 2단원
- IBM. [What is few shot prompting?](https://www.ibm.com/think/topics/few-shot-prompting) IBM Think. — 2단원 4차시
- Brown, T. B., et al. (2020). [Language models are few-shot learners.](https://arxiv.org/abs/2005.14165) *Advances in Neural Information Processing Systems, 33.* — 2단원 4차시
- Wei, J., et al. (2022). [Chain-of-thought prompting elicits reasoning in large language models.](https://arxiv.org/abs/2201.11903) *Advances in Neural Information Processing Systems, 35.* — 2단원 2차시
- Google. [Prompt design strategies.](https://ai.google.dev/gemini-api/docs/prompting-strategies) Gemini API documentation. — 2단원

**AI 교육과 교육과정**

- Miao, F., & Shiohira, K. (2024). [AI competency framework for students.](https://www.unesco.org/en/articles/ai-competency-framework-students) UNESCO. ISBN 978-92-3-100709-5. — 단원 구성, 4단원
- 교육부 (2022). 2022 개정 특수교육 교육과정: 기본 교육과정. [국가교육과정정보센터](https://www.ncic.re.kr) — 성취기준과 성취수준, 교수·학습 및 평가의 방향

**발달장애 학생 지도 방법**

- Bondy, A. S., & Frost, L. A. (1994). The Picture Exchange Communication System. *Focus on Autistic Behavior, 9*(3), 1–19. [PECS 안내](https://pecsusa.com/pecs/) — 그림 카드(PECS·AAC)로 고르기
- Terrace, H. S. (1963). [Discrimination learning with and without “errors”.](https://doi.org/10.1901/jeab.1963.6-1) *Journal of the Experimental Analysis of Behavior, 6*(1), 1–27. — 하 수준 학습지의 무오류 학습
- Inclusion Europe (2009). [Information for all: European standards for making information easy to read and understand.](https://www.inclusion-europe.eu/easy-to-read-standards-guidelines/) — 쉬운 글 작성

## 라이선스

이 저장소의 교재 본문·그림·코드는 [CC BY-NC-SA 4.0](LICENSE)으로 공개합니다.

- 저작자를 밝혀야 합니다.
- 영리 목적으로 쓸 수 없습니다.
- 고쳐서 공유할 때는 같은 라이선스(CC BY-NC-SA 4.0)를 적용해야 합니다.

쉬운 설명은 https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ko 에 있습니다.
출처 표시 예: 「AI 교과서 — 발달장애 학생을 위한 AI 학습」, 전창한, https://github.com/jch4825/AITEXTBOOKforSTUDENTS, CC BY-NC-SA 4.0

### 이 라이선스에 포함되지 않는 것

- **효과음**: 저장소 소유자가 Humble Bundle로 구매한 자료입니다. 이 저장소의 라이선스가 아니라 구매 때 받은 라이선스를 따릅니다. 그 라이선스가 앱 밖 재배포를 허락하지 않아 파일은 이 저장소에 두지 않고, 배포 사이트를 만들 때만 앱 안에 넣습니다. 내려받아 실행하면 소리 없이 동작합니다(`public/sounds/NOTICE.md`).
- `docs/reference/`의 교육과정 원문: 교육부 자료입니다.
- 외부 라이브러리와 글꼴: 각각의 라이선스를 따릅니다.
