> **Response style:** Answer in ASD-STE100 (Simplified Technical English).
> 사용자에게 하는 답변을 ASD-STE100(단순화된 기술 영어) 문체로 씁니다. 이 규칙은 답변에만 적용합니다. 아래의 학생 노출 한국어 문체 규칙은 그대로 지킵니다.

# CLAUDE.md

이 문서는 저장소를 수정할 때 사용하는 현재 기준입니다. 과거 작업 계획과 완료 보고서는 Git
기록에서 확인하고, 새 작업은 현재 코드와 이 문서를 기준으로 판단합니다.

## 프로젝트

발달장애 학생을 위한 PC 중심 AI 학습 교과서입니다.

- React 19 + TypeScript + Vite + Tailwind CSS
- 6개 단원, 68차시
- 62개 경험 중심 스튜디오 + 6개 단원 마무리 포트폴리오
- 배포: GitHub Pages, base path `/AITEXTBOOKforSTUDENTS/`
- 학생 화면은 짧은 읽기, 카드 선택, 게임, 이야기 장면을 중심으로 구성

## 반드시 지킬 제품 계약

- API 연결과 키 관리는 교사 영역입니다. 학생 화면에 API 키, 모델명, 기술 오류를 노출하지 않습니다.
- 현재 스튜디오의 AI 비교 자료는 `source: 'prepared'`인 준비된 예시입니다. 카메라나 마이크
  권한이 없어도 핵심 학습이 완료되어야 합니다.
- 미니게임은 태블릿·PC 크기(768px 이상)에서만 엽니다. 드래그·조준·타이밍 조작이 390px에서는
  손가락과 판이 겹쳐 성립하지 않기 때문입니다. 휴대전화에서는 게임을 그리지 않고(청크도 받지 않고)
  안내를 대신 보여 주되, 정리 패널을 그대로 이어 붙여 핵심 학습은 끝까지 완료되게 합니다.
  `npm run check:minigames`가 이를 강제합니다.
- 지원 수준의 내부 값은 `full | light | challenge`, 화면 표시는 `충분한 지원 | 중학 | 고등`입니다.
  `중학`과 `고등`은 지원 강도이자 학년군 운영 축입니다. 같은 68차시를 중·고가 공통으로
  쓰되 중학교는 9학년군, 고등학교는 12학년군 성취기준으로 평가합니다.
- 난이도의 내부 값 `easy | normal | hard`는 그대로 두고 화면 표시만 위 라벨을 따릅니다.
  글자 크기의 `보통`은 별개이므로 바꾸지 않습니다.
- 학년군은 표지에서 고르는 운영 결정입니다. 차시 화면의 지원 수준 스티커는 `중학`과 `고등`을
  직접 잇지 않습니다. 누르면 언제나 `충분한 지원`으로 내려가고, 거기서 한 번 더 눌러 확인 창에
  답해야 반대쪽 학년군으로 건너갑니다. 확인 창은 뼈대가 같고 성취기준과 표현의 난이도가
  달라진다는 점을 알립니다. `npm run check:grade-band-guard`가 이를 강제합니다.
- 학년군은 `SettingsState.gradeBand`에 difficulty와 따로 저장합니다. `충분한 지원`은 두 학년군
  모두에서 쓰는 하위 단계라 그 자체로 학년군이 될 수 없고, 그 상태에서도 어느 학년군으로
  평가할지 알아야 하기 때문입니다.
- PC 1280px 이상을 우선하되, 모바일 390px와 글자 크기 125%에서도 주요 조작이 가려지지 않아야 합니다.
- 차시 전환 시 상태가 섞이지 않도록 라우트 단위 상태는 `lessonId`로 격리합니다.
- `tests/e2e`가 생기더라도 테스트를 맞추기 위해 수정하지 말고 애플리케이션 코드를 고칩니다.
- 학생 노출 문체는 화자로 나뉩니다. 서술은 합니다체, 또래 인물끼리는 반말, 아이미와
  학생에게 건네는 말은 해요체입니다. 해요체도 존댓말이므로 금지 대상이 아닙니다.
  다만 앱이 학생에게 직접 건네는 말(UI·게임 피드백·지시문)에는 반말을 쓰지 않습니다.
  학생이 아이미에게 하는 질문은 반말이어도 됩니다. `npm run check:student-formal-style`이
  이를 검사합니다.
- 게임·화면 문구에서 판마다 바뀌는 낱말 뒤에 조사를 고정해 쓰지 않습니다("봄바람는", "도구으로", "우유은 품절").
  `src/features/studio/minigames/engine/korean.ts`의 `topicOf`·`objectOf`·`subjectOf`·`withOf`·`viaOf`(ㄹ 받침도 "로")·
  `particleFor`(따옴표로 감싼 낱말)를 씁니다. `npm run test:korean`.
- 이야기(visualNovel)는 **쉬운 글이 곧 짧은 글이 아니라는 원칙**을 따릅니다. 장면 하나를
  대사 칸 3~4개로 나눠 학생이 넘겨 읽고, 각 칸은 배경·이유·인물의 반응을 생략하지 않습니다.
  지원 수준 셋은 칸 수와 사건이 같고 문장 길이와 낱말만 다릅니다. 쉬운 수준이라고 정보를
  덜어 내지 않습니다. 작법은 `docs/remodel2/02-CHARACTERS.md` §2,
  검사는 `npm run check:visual-novel-story`와 `npm run check:support-gradient`입니다.
- PECS·AAC 라벨은 카드 이미지에 인쇄된 글자와 어체까지 일치시킵니다. 인쇄된 낱말과
  화면 낱말을 짝지어 읽는 것이 이 도구의 사용법이므로 한쪽만 바꾸지 않습니다.
- 차시 도움 영상(`src/data/lessonVideos.ts`)은 선택 자료입니다. 학생 화면에서는 정리 노트의 카드를
  눌러야 비로소 플레이어를 붙이고(누르기 전에는 외부 요청이 없습니다) 쿠키를 심지 않는
  `youtube-nocookie.com`만 씁니다. 못 봐도 다음 단계로 넘어가 핵심 학습이 끝까지 완료되어야 하고,
  영상이 끝나면 플레이어를 떼어 끝 화면의 추천 영상이 학생에게 뜨지 않게 합니다.
  `npm run check:lesson-videos`가 이를 강제합니다.
- 읽기 지원(`src/data/readingSupport.ts`)은 글을 못 읽는 학생도 핵심 학습을 끝까지 마치게 하는 길입니다.
  켜진 단원(지금은 여섯 단원 모두)에서는 ① 선택지·반응 대사·AI 의견마다 듣기 단추가 있고 물음 옆
  단추가 물음과 선택지를 차례로 읽으며, ② 카드를 고르는 일은 소리 없이 하고(고를 때 읽는 일은 교사가
  켠 교실만, 기본 꺼짐) 반응 대사가 곧 피드백이며, ③ 판단 단추 셋은 그림 카드(화면 글자는 PECS_LABELS
  하나에서 나옵니다), ④ 상단 바에 학생이 쓰는 소리 칩이 있습니다. 듣기와 고르기는 서로 다른 요소여야
  하고(듣다가 답이 정해지면 안 됩니다), 듣기 단추는 소리 설정과 상관없이 늘 읽습니다. 소리 칩은 저절로
  나는 소리만 끕니다. 읽는 글은 `toSpeechText`로 기호를 풀어 씁니다(화면 글은 그대로). 단원을 더할 때는
  목록에 더하고 `npm run check:reading-support`를 돌립니다. 모든 선택지에 반응 대사가 있어야 통과합니다.
- 그림 카드 방식(`src/data/choiceCards/`)은 읽기 지원의 둘째 길입니다. 선택지(스튜디오의 첫 생각·적용, 단원 마무리의
  다음 방법) 하나에 카드 하나를 두어 글을 못 읽는 학생이 그림과 듣기로 고릅니다. 카드를 고르는 일은 선택지를
  고르는 일과 같아 기록되는 것은 선택지 id뿐이고(방식은 `mode: 'aac'`와 사용한 지원 `aac-cards`로만 남습니다),
  카드의 짧은 글은 상징이며 듣기 단추는 선택지 문장 전체를 읽습니다. 같은 행동에는 단원이 달라도 같은 그림 카드를
  씁니다(`use_as_is`는 어디서나 AI 말을 확인 없이 받는 것). 그림 카드 판의 카드를 쓰면 화면 글자는 인쇄된 낱말
  (PECS_LABELS)과 같아야 하고, 그림 카드 판에 있는 낱말을 이모지 카드의 글자로 따로 쓰지 않습니다. 이모지 카드는
  알맞은 그림 카드가 생기면 바꿉니다. 처음 열리는 화면은 교사가 기기마다 `SettingsState.answerMode`(기본 문장 고르기)로
  정하고, 학생은 그림이 붙은 탭으로 언제든 바꿉니다. 먼저 해 보기의 답은 원래 기록하지 않으므로 카드를 썼다는
  사실도 남기지 않습니다. `npm run check:choice-cards`가 이를 강제합니다.
- 쉬운 사전(`src/data/studentDictionary.ts`)은 **AI 없이도 밑줄 낱말로 제 몫을 하고**, AI는 사전에 없는 낱말을 학생이 사전 칸에
  직접 써서 찾을 때만 보탭니다.
  - 밑줄은 어절 하나를 통째로 칩니다(엔진은 `src/utils/dictionaryMatch.ts`). 다른 낱말의 한 조각(계산대의 계산, 무조건의 조건,
    장보기의 보기, 틀렸다의 틀)에는 치지 않고, 서술어는 한가운데서 끊지 않고 어절 끝까지 칩니다(확인합니다). 조사는 떼고 낱말에만
    칩니다(확인을 → 확인). 하다·되다·받다를 붙여 서술어로 쓰는 낱말은 항목에 `verbal: true`로 밝히고, 서술어로 쓰면 뜻이 달라지는
    낱말(지도 → 지도하다)에는 켜지 않습니다. 학생에게 필요한 합성어는 별칭이나 새 항목으로 올리고(일기예보, 결과물, 도움망, 계산대),
    다른 뜻으로 쓰인 구절에는 `notIn`으로 밑줄을 거둡니다.
  - 뜻풀이는 그 낱말이 교재에서 쓰이는 모든 뜻을 덮어야 하고 한 단원의 용례에만 맞추지 않습니다(신호는 기계가 받는 신호와 몸이 보내는
    경고 신호, 문제는 풀어야 할 일과 퀴즈의 물음). 항목·별칭을 더하거나 고친 뒤에는 `npm run check:dictionary`로 교재 본문 전체를
    훑습니다(조각 밑줄·끊긴 서술어가 0건이어야 합니다).
  - **인공지능이 무엇인지는 사전의 `AI_DEFINITION` 한 곳에서 정합니다.** 사람이 만든 프로그램이고, 많은 자료에서 비슷한 점을 찾아
    번역·추천·분류 같은 결과를 만든다는 셋을 말하며, 사람처럼 생각하고 배우거나 느끼는 존재로 말하지 않습니다. 정의를 말하는 글(차시
    본문·정리·개념 카드·정식 콘텐츠·사전)은 이것을 가져다 쓰고(m1-l1은 import합니다) 지원 수준마다 길이와 낱말만 다릅니다.
    "스스로 보고 듣고 알아보는 기계"는 센서 자동문과 가려지지 않아 쓰지 않고, 놀이의 판단 기준은 "사진이나 소리, 말을 받아 알아내거나
    골라 주는가"입니다. `check:dictionary`가 정의의 일치와 사람처럼 말하는 정의의 재등장을 막습니다.
  - AI 풀이(`src/utils/dictionaryAi.ts`)는 이 앱의 기존 연결 하나, 곧 교사가 직접 넣은 Gemini 키(`utils/apiKey.ts`)와 `askGemini`만 씁니다.
    키가 없으면 열리지 않습니다. 학생이 사전 칸에 쓴 글이 사전에 없을 때 찾기 단추나 엔터를 눌러야 부르고, 낱말 하나(20자·세 마디 이내,
    4자리 이상 숫자·메일·주소는 거름)만 보내며, 학생 화면에 키·모델·기술 오류를 내지 않고 "AI가 만든 설명"임을 밝힙니다. 실패하면
    선생님께 물어보라고만 안내합니다. `npm run test:dictionary-ai`.
- 상단 바(차시 화면·표지·목차·교사 허브)에는 **인공지능 연결됨/연결 안됨** 표시(`AiStatus`)가 있습니다. 교사가 키를 넣거나 빼면 바로
  바뀌고, 키·모델·기술 오류는 보이지 않으며, 좁은 폭에서는 'AI 연결됨'으로 줄어듭니다.
- 개념 카드(`src/features/studio/components/ConceptNotes.tsx`)는 **충분한 지원에서 가장 쉬운 글(`detail.full`)을 중심 문장으로 보이고
  추상적인 `core`는 "자세한 설명 보기"로 접습니다.** 중학·고등은 `core`를 중심으로 두고 그 수준의 `detail`을 아래에 보입니다. 예전에는
  충분한 지원에서 `detail`을 그리지 않아 가장 쉬운 글 186개가 화면에 한 번도 나오지 않았습니다. `npm run test:concept-notes`.
- 교사 도구 A4 학습지(`src/features/teacher/worksheet/`)의 **하·중 수준은 글이 아니라 그림 카드가 중심**이고, **하 수준은
  무오류 학습이 바탕**입니다. 둘 다 두 장으로 앞장은 쓰기 칸이 있는 면, 뒷장은 오려 붙이는 면입니다. 카드는 `data/choiceCards/`의
  선택지 그림 카드를 그대로 쓰고(학생 화면에서 만난 그림과 낱말이 종이에서도 같아야 합니다), 오리는 카드는 한 변 48mm 이상,
  한 쪽에 보이는 글자는 170자 이내입니다. 예전에는 선택지 문장 30~60자를 보기로 싣고 60자 문장을 "낱말"로 따라 쓰게 했으며
  오릴 카드는 11mm 높이의 글자 띠였습니다. 그 뒤 세 장 가운데 고르기와 맞아요·아니에요 분류로 바꿨으나, 그림이 추상적이고
  물음에 정보가 적어 결국 글을 읽어야 풀 수 있었고(읽어도 가르기 어려웠고) 틀리면 실패를 겪게 해서 **두 수준 모두 맞아요·아니에요
  분류를 없앴습니다.** 붙이기는 두 수준 모두 **알맞은 카드만** 오립니다. 오릴 카드는 붙일 카드뿐이고 알맞지 않은 카드는 어디에도
  올리지 않으며, 붙일 카드는 `pictureWorksheets.ts`가 알맞다고 정한 카드(`right`, 순서·분류 칸이 정해진 카드)와 정확히 같습니다.
  순서·분류 차시는 자리마다 이름(① 먼저 …)이 붙습니다. 정해진 답이 없는 열린 선택만 카드 세 장 가운데 마음에 드는 한 장을 빈
  자리에 붙입니다(어느 카드든 알맞습니다). 상황 글은 읽어 주는 사람을 위해 물음을 뗀 서술로 작게만 둡니다.
  - **하**는 틀릴 수 있는 활동을 두지 않습니다(다른 카드 중 고르기도 없습니다). 앞장은 `1 붙여요`와 `2 따라 써요`, 뒷장은
    `3 붙여요`입니다. 붙이기는 **장면 옆의 똑같은 흐린 그림 위에 같은 카드를 겹쳐 붙입니다.** 카드마다 같은 그림의 흐린 자리가 하나씩
    있고 오릴 카드는 그 바로 아래 같은 순서로 놓입니다. 따라 쓰기는 핵심 낱말을 큰 연한 글자 위에 덧쓰고 둘째 줄도 더 연한 글자 위에
    덧씁니다(비워 둔 줄이 없습니다). 인쇄본에 고르는 동그라미·맞아요/아니에요 칸을 두지 않습니다.
  - **중**은 하의 한 단계 위로, 본보기가 그림에서 글자로 바뀌고 판단은 앞장에 있습니다. 앞장은 `1 골라요`(알맞은 카드에 ○)와
    `2 덧써요`(핵심 문장을 덧쓰고 둘째 줄에서 핵심 낱말만 빈칸으로 둔 채 직접 쓰기)이고, 뒷장 `3 붙여요`는 자리마다 카드에 쓰인
    낱말이 연한 글자로 있어 **덧쓰고, 같은 낱말의 카드를 찾아 붙입니다**(오릴 카드는 순서가 섞여 있어 낱말을 읽어야 짝을 찾습니다).
    빈칸은 학생용 인쇄본에서 비어 있고 정답지에서만 낱말이 보입니다. 덧쓰는 문장은 해요체 18자 이내이고 빈칸 낱말은 문장에 한 번만
    나오며 그림 카드의 낱말과 같습니다. 물음은 해요체 44자 이내입니다.
  - 인쇄본과 화면 미리보기는 `pictureBlocks.ts`의 같은 HTML·CSS 한 벌을 씁니다(크기는 실제 mm). 저장한 편집본은 수준마다
    `template` 표시(`PICTURE_TEMPLATES`)가 기본 구성과 다르면 그 수준만 새 구성으로 갈아 끼웁니다(한 수준의 판을 새로 짜면
    그 수준의 값만 올립니다). 정답지(붙인 모습과 카드마다 교사가 읽어 줄 문장)는 교사 모드에서만 단추가 보이고, 학생에게 나누어
    주지 않는 교사용 안내 쪽이 하나 더 붙으며 이 쪽도 A4 한 장에 들어가야 합니다. `npm run check:worksheet-picture`가 이를
    강제합니다. 쪽에 다 들어가는지는 브라우저에서만 잴 수 있습니다.
- 한국어 파일은 UTF-8, TypeScript는 strict 설정을 유지합니다.

## 현재 단일 진실 원천

- 전체 차시와 단원: `src/data/modules.ts`, `src/data/lessons/`
- 차시 역할: `src/data/lessonRoles.ts`
- 스튜디오 62개: `src/data/studios/m1/` ~ `m6/` (차시당 1파일 + `index.ts` 배럴)
- 단원 마무리 6개: `src/data/modulePortfolios/m1.ts` ~ `m6.ts`
- 고등 심화 과제: `src/data/highSchoolTasks.ts` — 62차시 각각의 고등 학년군 전용 수행.
  지원 수준이 `고등`일 때 전이 단계에 나타나며, 중학과 고등의 차이를 텍스트 밀도가
  아니라 수행 요구 수준으로 만든다. 실시간 AI나 새 이미지를 요구하지 않는다.
- 성취수준: `src/data/aiAchievementLevels.ts` — 24개 성취기준 × 상·중·하.
- 차시 학습목표: `src/data/lessonObjectives.ts` — studios·lessons의 objective가 여기를
  따라야 하며 `npm run check:objectives
npm run check:standards-integrity
npm run check:highschool-tasks`가 강제합니다.
- 정식 콘텐츠와 성취기준: `src/data/canonicalLessons/`, `src/data/aiAchievementStandards.ts`
- 학생 사전: `src/data/studentDictionary.ts` — 항목·별칭·`verbal`·`notIn`, 본문에서 밑줄을 치지 않는 낱말 목록, 그리고 인공지능 정의
  `AI_DEFINITION`(차시 글이 이것을 따른다). 밑줄 자리를 정하는 엔진은
  `src/utils/dictionaryMatch.ts`, 사전에 없는 낱말의 AI 풀이는 `src/utils/dictionaryAi.ts`. 항목을 더하거나 고치면 `check:dictionary`를 돌린다.
- 차시 도움 영상: `src/data/lessonVideos.ts` — 선생님이 올린 해설 영상. 학생 정리 노트
  (`LessonVideoCard`)와 교사 자료(`teacherResources.ts`)가 이 목록 하나를 함께 쓴다. 영상을 더할
  때는 이 표에 한 줄을 추가하고 `npm run check:teacher-resources -- --online`으로 열리는지 본다.
- 읽기 지원 단원: `src/data/readingSupport.ts` — 듣기 단추·판단 카드·소리 칩을 함께 켜고 끄는 단원
  목록 하나. 켜는 일은 이 목록에 단원을 더하는 한 줄이다. 판단 카드 그림은 `public/lessons/pecs/{단원}/`의
  `use_as_is`·`fix_and_use`·`dont_use`를 쓴다(`src/features/studio/decisionCards.ts`).
- 선택지 그림 카드: `src/data/choiceCards/` — 선택지 id → 카드(짧은 글 + 그림 카드 판의 카드 또는 이모지). 선택지를
  더하거나 id를 바꾸면 여기도 한 장 고친다. `npm run check:choice-cards`가 빠진 카드와 남은 카드를 막는다.
- 단원별 핵심 내용: `src/data/moduleCoreContents.ts` — 한 단원이 어떤 내용을 어떤 차시 묶음으로
  다루는지 밝힌다. 차시 범위는 실제 차시와 맞아야 하며 `npm run check:curriculum-document`가
  강제한다.
- 교수·학습 및 평가의 방향과 방법: `src/data/curriculumTeachingAssessment.ts` — 기본 교육과정의
  (가)(나)(다)… 항목 서술 형식을 따르되 내용은 이 저장소의 제품 계약에서 가져온다.
- 교사용 실제 운영 설명: `src/features/teacher/TeacherOperationGuide.tsx`
- 하·중 수준 학습지 구성: `src/data/pictureWorksheets.ts` — 68차시 각각의 물음·핵심 낱말·핵심 문장(중이 덧씀)·알맞은 카드.
  두 수준의 두 장을 짓는 곳은 `src/features/teacher/worksheet/pictureLevels.ts`(하는 `buildLowPages`, 중은 `buildPicturePages`)입니다.
  스튜디오 2~6단원의 선택지에는 `isCorrect`가 없어(반응 대사가 결과를 말해 줍니다) 알맞은 카드는 여기서 따로 정하고, 하 수준은 그
  알맞은 카드만 붙입니다. 학생 화면의 정답 판정에는 쓰이지 않습니다. 선택지를 더하거나 id를 바꾸면 여기도 고칩니다.
  핵심 문장의 낱말이 바뀌면 `word`(빈칸·그림 카드 낱말)와 `sentence`를 함께 고칩니다.
  옛 그림 카드 127장의 이름은 `src/data/legacyPecs.ts`에 있고 학습지 편집기의 그림 고르기에서 씁니다.
- 교육과정 원문 참고자료: `docs/reference/2022-special-education-curriculum.pdf`
- 저작자 표시와 제작 방식: `src/data/projectCredit.ts` — 저작자 전창한, 인공지능 바이브코딩 도구(Claude Code·Codex·Antigravity)와 일마다
  쓴 보조 도구(동영상 Google Notebook, 이미지 수정 Google Flow, 표지 Google Stitch)를 밝히는 문구 한 곳. 표지 바닥글(`Home`)과 교사 허브
  (`TeacherHub`)가 `ProjectCredit`으로 같은 문구를 보이고, 표지에는 학생이 누르면 밖으로 나가는 링크를 두지 않는다. README의
  "저작자와 제작 방식"과 같은 내용이라 바꾸면 함께 고치며, `check:ui-polish`가 두 화면에 있는지 본다.

없는 차시 ID는 임의 데모로 대체하지 않고 `ComingSoonLesson`을 표시합니다.

## 주요 구조

```text
src/
├─ App.tsx                         URL 쿼리 기반 home/contents/lesson/teacher 라우팅
├─ views/
│  ├─ Home.tsx
│  ├─ ContentsView.tsx
│  ├─ LessonView.tsx               역할에 따라 스튜디오/단원 마무리 렌더링
│  └─ TeacherView.tsx
├─ features/
│  ├─ studio/                      8단계 경험, 과정 기록, 지원 수준
│  │  ├─ formats/                  포맷 A~E별 화면 순서 선언(기록 단계는 불변)
│  │  └─ speakerLine.ts            각본 속 `진우: "..."` 표기 → 화자 말풍선 파서
│  └─ teacher/                     운영 허브(왼쪽 메뉴 + 본문 격자), 기록, 성취기준, 백업, AI 연결, 교사 자료 패널
│     └─ worksheet/                A4 학습지 상·중·하(하·중 수준은 pictureLevels.ts + pictureBlocks.ts)
├─ data/
│  ├─ studios/                     62개 스튜디오 데이터
│  ├─ modulePortfolios/            6개 단원 마무리 데이터
│  ├─ canonicalLessons/            정식 수업 콘텐츠
│  ├─ lessonObjectives.ts          62차시 학습목표 단일 진실 원천
│  └─ lessons/                     68차시 등록 데이터
└─ utils/
   ├─ publicAssetUrl.ts            GitHub Pages public 경로 보정
   ├─ storage.ts                   학생 진도/설정
   ├─ gemini.ts, apiKey.ts         교사 관리 AI 연결(Gemini). 상단 바의 연결 표시도 여기서 읽는다
   ├─ dictionaryMatch.ts           사전 낱말의 밑줄 자리(어절 단위)
   ├─ dictionaryAi.ts              사전에 없는 낱말의 AI 풀이
   └─ tts.ts, stt.ts               Web Speech API
```

차시 화면은 스튜디오(62)와 단원 마무리(6)뿐입니다. 예전 단계형 렌더러(`ImplementedLesson`·`MissionStep`·`games/*`·`RealAIStep` 등 약
5,000줄)는 쓰는 차시가 없어 지웠습니다. `data/lessons/*.ts`의 `steps`는 남아 있지만 사이드바의 AI 표시(`SidebarTree`)만 읽습니다.

## 이미지와 public 경로

- 실제 서비스 이미지는 `public/` 아래에만 둡니다.
- 스토리 이미지는 `public/lessons/story/`의 WebP 266개입니다.
  - 스튜디오: 62차시 × 4장 = 248장
  - 단원 마무리: 6개 × 3장 = 18장
- 루트(`/lessons/...`, `/images/...`)로 작성한 public 경로는 렌더링 시
  `src/utils/publicAssetUrl.ts`를 사용해 Pages base path를 붙입니다.
- 원본 스토리보드, 생성 대기열, 캐릭터 참조 시트, 검수 스크린샷은 저장소에 보관하지 않습니다.
  필요한 경우 Git 기록에서 꺼내거나 새 작업용 임시 폴더에서 생성합니다.
- 자세한 현재 자산 규칙은 `docs/ASSETS.md`를 참고합니다.

## 디자인 시스템 계약

학생·교사 화면은 따뜻한 종이와 명확한 잉크를 공통 기반으로 사용합니다. 글래스모피즘과
형광색은 사용하지 않습니다.

- 보이는 면은 `종이(surface-paper)`, `스티커(surface-sticker)`, `도장(surface-stamp)`,
  `선택 카드(surface-choice)`, `A4(surface-a4)` 중 하나로 분류합니다. 복합 컴포넌트는
  여러 면을 포함할 수 있지만, 하나의 면에 두 어포던스를 섞지 않습니다.
- 한 요소의 깊이 신호는 하나뿐입니다. 종이는 `--surface-paper-elevation`, A4·모달은
  `--surface-a4-elevation`, 스티커는 `--surface-sticker-lip`, 만화 컷은
  `--surface-comic-lip`만 사용합니다. Tailwind `shadow-*`, 임의 `box-shadow`,
  안쪽 그림자, 블러·반투명 유리 면을 추가하지 않습니다.
- 테두리는 "면"의 어휘입니다. 위 다섯 가지 면으로 분류한 요소만 2px 이상의 명시적
  테두리를 가집니다. `button`, `input`, `[role=...]` 같은 요소 선택자에 테두리를 일괄로
  걸지 않습니다. 둥근 색 스와치, 목록 행, 아이콘 토글은 면이 아니라 조작이므로 배경·밑줄·
  아웃라인으로 경계를 만듭니다. 여기에 사각 테두리를 강제하면 이미 둥근 면 위에 사각 상자가
  겹칩니다. 경계 하한이 필요하면 `.interactive-border-floor`를 해당 면에만 붙입니다.
- 핵심 텍스트는 종이 면에서 7:1 이상의 대비를 사용하며, 모듈 강조색은 테두리·립·큰 장식에만
  사용합니다. 상단 도구 스티커 색은 `--chrome-*` 토큰에서 고르고, 채도 높은 캔디 색을
  컴포넌트에 직접 적지 않습니다.
- 다크 면은 놀이 프레임(`[data-minigame-frame]`) 안에서만 허용합니다. 프레임 안에서도
  불투명한 `--game-board-*` 토큰과 2px 경계를 사용합니다.
- 변경 뒤 `npm run check:design-system`으로 계약을 검사합니다.
- **교사 허브(`?teacher=1`)와 교사 도구 시트(교사 자료·타이머·그림 카드)의 패널은 폭을 px·rem으로 고정하지 않고 칸의 폭으로 배치합니다**
  (`@container`, `auto-fit`·`auto-fill`). 옛 떠 있는 도크의 `w-64`(288px)가 시트 안까지 남아 패널이 시트의 40%만 쓰고 오른쪽이 빈 적이
  있고, 격자 칸의 기본 `min-width: auto`가 넓은 표·입력칸에 밀려 390px에서 가로로 넘친 적이 있습니다(`.hub-stack > *` 등에 `min-width: 0`).
  허브는 1024px 이상에서 왼쪽 고정 메뉴(`.hub-rail`) + 남은 폭을 다 쓰는 본문(`.hub-main`), 더 좁으면 머리글 아래 한 줄 탭입니다.
  시트 패널은 틀이 없고 같은 머리글(`.tool-panel-head`)과 단원 색(`--tool-accent`)을 씁니다. 폭은 `check:mobile-learning-layout`이 잽니다.
  Tailwind 유틸리티는 `@layer` 안이라 비계층 CSS의 `margin: 0` 같은 초기화가 `mt-6`을 덮어씁니다 — 간격 유틸리티를 쓰는 요소에는 초기화를 걸지 않습니다.
- **인쇄에서 화면 본문(`#root`)을 감추는 것은 상장·수료증 창이 열려 있을 때뿐입니다**(`body:has(.award-print-wrapper, .certificate-print-wrapper) #root`).
  두 창은 `createPortal(…, document.body)`로 `#root` 밖에 있어 그때만 본문을 감춰도 상장은 찍힙니다. 이 규칙을 전역으로 걸었을 때는 교사 허브
  "포트폴리오 인쇄·PDF"를 포함해 화면 자체를 인쇄하는 곳이 모두 빈 쪽을 냈습니다. 포트폴리오는 `.hub-evidence`(섹션은 쪽을 넘어 이어지고 카드
  `.studio-artifact-sheet`만 쪼개지지 않음), 허브 머리글과 교재 저작자 구역(`[data-project-credit="teacher"]`)·교사용 안내(`.teacher-hub-chrome`)는
  인쇄하지 않습니다. 쪽 모양은 `page.pdf()`로만 보이고, `check:mobile-learning-layout`이 인쇄 매체의 본문 표시·카드 쪼개짐 방지·상장 창일 때만 숨김을 잽니다.
  단원 마무리의 "○○ 인쇄하기"(`ModuleCloseLessonView`)는 학습 화면 틀이 안쪽 스크롤 칸이라 아직 첫 화면만 잘려 찍힙니다(무엇을 찍을지 정해야 하는 후속 작업).

## 놀이 파트의 디자인 계약 (바우하우스)

교과서 본문은 위의 종이 체계를 씁니다. **놀이는 다른 문법을 씁니다.** 어휘가 통째로
바뀌는 것이 "이제 놀이 시간"이라는 신호이고, 게임 62개가 각자 색과 이모지를 고르면서
임의 색상 83종·이모지 618개로 흩어졌던 것을 하나로 묶는 장치이기도 합니다.

- 단일 진실 원천은 `src/features/studio/minigames/engine/bauhaus.ts`(캔버스)와
  `BauhausMark.tsx`(DOM), 그리고 `--game-*` CSS 토큰입니다. **이 셋 밖에서 색을 적지
  않습니다.**
- 형태는 원·사각형·삼각형과 그 파생(고리·반원·사분원·마름모·십자) 여덟 가지입니다.
  **둥근 모서리를 쓰지 않습니다** — 모서리는 각지거나 완전한 원입니다.
- 뜻과 형태를 짝지어 둡니다. 학생이 조종하는 것은 노랑 원, 목표는 파랑 사각형,
  위험은 빨강 삼각형, 중립 구조물은 회색 막대입니다. **뜻은 언제나 모양이 함께 집니다** —
  판 위에서 빨강과 파랑의 대비는 1.22라, 색만으로 나누면 색을 구별 못 하는 학생에게는
  둘이 같은 회색입니다.
- **레퍼런스는 "FORM & COLOR: Bauhaus Arcade"(2026-09-13)입니다.** 놀이 프레임 전체가
  어두운 틀이고, 판은 제도지처럼 격자와 귀퉁이 꺾쇠를 가집니다(캔버스는 `paintBoard`,
  DOM 판은 `GameStage`). 세부는 `drawPanel`(머리띠 패널)·`drawTag`(꼬리표)·
  `drawSegments`(칸 막대)·`drawGhost`(점선 빈자리)·`drawPop`(칭찬 딱지)로 그립니다.
- **면에 칠하는 색과 글자에 쓰는 색을 나눕니다.** 판의 빨강(#D90429)·파랑(#2B5CF0)은
  대비 3.45·3.35라 면·테두리 전용이고, 판 위 글자는 `redInk`·`blueInk`
  (`--game-board-red-ink`·`-blue-ink`)가 맡습니다. 칸 색을 `color` 필드 하나로 들고
  다니는 게임은 글자 자리에서 `inkFor()`로 감쌉니다. 노랑 면 위 글자는 검정(ground)입니다.
- 깊이 신호는 **흐림 없는 딱딱한 어긋남 하나**입니다. DOM은 `.game-lift-1~4`
  (`--game-lift-*` 토큰), 캔버스는 `drawShape`·`drawBar`의 `lift` 옵션을 씁니다. 번지는
  그림자·빛은 쓰지 않습니다. 누르는 버튼은 `.game-press`로 받친 판 위에 내려앉습니다.
- 숫자와 로마자는 Space Grotesk(`--game-font-display`, 캔버스 `CANVAS_FONT`), 한글은
  Pretendard가 받습니다.
- 레퍼런스에서 **가져오지 않은 것**: 10~12px 로마자 설명 글(글자 바닥은 DOM 14px·캔버스
  20 단위이고 뜻 없는 로마자는 학생에게 소음), 번지는 빛, 반투명 면, 칸딘스키의 짝(노랑
  삼각·빨강 사각·파랑 원). 표식도 판의 짝(노랑 원·파랑 사각·빨강 삼각)을 그대로 씁니다.
- 머리글은 반드시 한 줄(44px)입니다. 머리글 높이가 곧 캔버스 크기를 깎고, 장식 글자
  때문에 게임 이름이 잘려서도 안 됩니다.
- 캔버스는 감싼 칸의 남은 높이에 맞춰 줄어듭니다(`div:has(> .game-canvas-fit)` 크기
  컨테이너, 바닥 270px). 이 규칙은 **반드시 `@layer` 밖**에 둡니다 — Tailwind v4에서는
  유틸리티(`min-h-0`)가 선택자 구체성과 무관하게 components 레이어를 이겨 바닥이 지워지고,
  태블릿 폭에서 캔버스가 0px로 사라집니다.
- 배치는 격자에 맞춥니다(960×540을 80단위 12칸). 바우하우스의 비대칭·사선 구성은
  쓰지 않습니다. HUD가 판마다 다른 자리에 있으면 학생은 매번 다시 찾습니다.
- 이모지를 쓰지 않습니다. `drawMark`(캔버스)와 `BauhausMark`(DOM)로 직접 그립니다.
  사물 이모지 옆에 이미 한글 이름이 있으면 이모지만 지웁니다 — 이름이 뜻을 다 지고 있고,
  이모지는 기기와 글꼴마다 달라지는 값만 치릅니다. 실제로 두꺼운 외투와 비옷이 같은 그림을
  물려받아 두 카드가 구별되지 않은 적이 있습니다.
- 방향은 화살표 하나를 돌려 씁니다(`markRotate`, `drawMark`의 rotate). 방향마다 다른 그림을
  두면 학생이 같은 뜻의 그림 넷을 따로 익혀야 합니다.
- 선 굵기는 세 단(캔버스 3·5·9, DOM `--game-hair/line/heavy`)만 씁니다.
- **반투명 겹침을 쓰지 않습니다.** 덮개는 그 아래 글자를 흐려 정작 판단할 것을 가립니다.
  강조는 테두리로 하거나 면을 통째로 뒤집습니다. 변하는 투명도가 곧 놀이의 신호인
  자리(돋보기 밖, 노출 과다, 맞았을 때의 번쩍임)만 `globalAlpha`에 팔레트 색을 얹어
  씁니다 — 효과는 남고 색은 한 곳에서만 옵니다.
- 성공을 알리려고 다섯째 색을 들이지 않습니다. 그 요소 자신의 색으로 면을 뒤집습니다.
- `npm run check:game-visual`이 이를 강제합니다. 검사는 **전환을 마친 파일**(스크립트의
  `MIGRATED`)에 규칙을 온전히 걸고, 나머지는 임의 색상·이모지 수가 기준선보다 늘지 않게
  막는 래칫으로 동작합니다. 지금 61/62가 올라와 있고, 남은 하나는 `m1/AiSpotHuntGame`
  입니다 — 물건 33개 가운데 18개의 그림이 아직 없어 그림 문자가 물건의 정체를 대신하고
  있습니다. 색과 모서리는 이미 옮겼습니다.
- 검사가 보는 것은 16진수만이 아닙니다. `rgba()`, Tailwind 색 클래스(`bg-slate-800`),
  그러데이션, `<MiniGameFrame>`·`<GameHud>`·`<GameStage>`의 `bauhaus` 플래그 누락도 잡습니다.
  앞의 셋은 16진수가 아니라서 한동안 조용히 새고 있었습니다.

## 교사·학생 데이터 경계

- 교사 모드: `?teacher=1`
- Gemini 키: `ai-students-gemini-key`, 브라우저 localStorage에 교사가 직접 저장
- 진도: `ai-students-progress`
- 설정: `ai-students-settings`
- 과정 기록: `ai-students-studio-evidence-v2`, 교사가 켠 경우에만 저장
- 백업에는 API 키와 원본 음성·사진·그림을 포함하지 않습니다.

## 명령

```bash
npm install
npm run dev
npm run lint
npm run build
npm run check:encoding
npm run check:public-images
npm run check:visual-novel-story
npm run check:portfolio-images
npm run check:studio-rollout
npm run check:modules-remodel
npm run check:objectives
npm run check:curriculum-document
npm run check:grade-band-guard
npm run check:game-visual
npm run check:lesson-videos
npm run check:reading-support
npm run check:choice-cards
npm run check:worksheet-picture
npm run check:dictionary
npm run test:dictionary-ai
npm run test:korean
npm run test:concept-notes
```

변경 범위에 맞는 계약 검사도 `package.json`의 `check:*` 명령에서 골라 실행합니다.

## 완료 전 검증

최소 기준:

1. `npm run lint`
2. `npm run build`
3. `npm run check:encoding`
4. 이미지 변경 시 `check:public-images`, `check:visual-novel-story`, `check:portfolio-images`
5. 차시 데이터 변경 시 `check:lesson-roles`, `check:studio-rollout`, `check:modules-remodel`
6. UI 변경 시 실제 브라우저에서 1280px 이상과 390px/125% 확인

`tests/e2e`는 수정하지 않습니다. 브라우저 검증 결과와 실행하지 못한 검사는 구분해서 보고합니다.

## 저장소 위생

- 완료된 날짜별 계획서·명세서·수락 보고서를 다시 추가하지 않습니다. 이력은 Git이 보관합니다.
- 현재 의사결정은 이 파일이나 해당 기능 가까이의 코드 주석에 짧게 반영합니다.
- `output/`, Playwright 임시 결과, 생성 중간 이미지, 로컬 도구 캐시는 커밋하지 않습니다.
- 루트에 참고 이미지나 임시 파일을 놓지 않습니다.
- 비밀키, `.env`, 학생 원본 미디어를 커밋하지 않습니다.
- 라이선스는 저장소 전체에 CC BY-NC-SA 4.0(`LICENSE`)이고, `public/sounds/`의 효과음은 Humble Bundle로 구매한 자료라 예외입니다
  (구매 때 받은 라이선스를 따르며 재사용·재배포 금지, `public/sounds/NOTICE.md`). 새 외부 자산(소리·그림·글꼴)을 저장소에 더하기 전에 재배포가 허락되는지 확인하고,
  안 되면 저장소에 두지 않거나 README 라이선스 절에 예외로 적습니다.
