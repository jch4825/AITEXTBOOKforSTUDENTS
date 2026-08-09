import React, { useState } from 'react';
import { AI_ACHIEVEMENT_STANDARDS } from '../../data/aiAchievementStandards';
import { MODULES } from '../../data/modules';

// Single, unified official narrative explanation for each of the 24 achievement standards
export const DETAILED_STANDARD_EXPLANATIONS: Record<string, string> = {
  // === 영역 1. 인공지능의 이해 ===
  '[9인지01-01]':
    '이 성취기준은 인공지능이 사람처럼 스스로 생각하여 모든 답을 알아내는 만능 로봇이 아니라, 사람이 수집하여 제공한 대용량 데이터(글·사진·음성)의 패턴을 학습하여 대답을 생성하는 프로그램임을 체득하기 위해 설정하였다. 교사는 선풍기 버튼(기계적 동작), 자동문 센서(단순 감지), AI 음악 추천(학습 기반 대답)의 차이를 비교하는 시각 카드를 제시하고, "AI도 사람이 준 데이터가 없으면 대답할 수 없다"는 핵심 원리를 O/X 카드 및 낱말 고르기 활동으로 지도한다. 학생이 AI를 무조건적인 만능으로 오해할 때에는 학습 데이터를 제공하지 않은 새로운 낱말을 질문하여 AI가 대답하지 못하는 상황을 보여줌으로써 개념을 바르게 교정한다.',
  '[9인지01-02]':
    '이 성취기준은 인공지능이 항상 정답만 말하는 것이 아니며 때로는 그럴듯한 거짓말(환각)을 만들어낼 수 있음을 인지하고, 주간 급식 식단표, 학교 공지사항, 날씨 앱 등 실제 원본 안내 자료와 AI 대답을 1:1로 비교하여 틀린 부분을 찾아내는 사실 검증 능력을 기르기 위해 설정하였다. 교사는 요일이나 메뉴가 일부러 틀리게 작성된 AI 대답 출력지를 인쇄하여 제공하고, 학생이 식단표 원본과 대조하며 빨간 펜으로 틀린 단어나 숫자를 찾아 동그라미 치고 올바른 단어로 고쳐 쓰는 검수 활동을 진행한다. AI 대답의 정중한 말투나 깔끔한 글꼴에 속지 않도록 원본 안내 자료와의 1:1 단어 대조 체크리스트를 필수 활용하도록 지도한다.',
  '[12인지01-01]':
    '이 성취기준은 인공지능의 개념과 함께 데이터 입력 - 모델 학습 - 결과 생성으로 이어지는 작동 메커니즘을 구조적으로 이해하고, 사람이 제공한 데이터가 변함에 따라 생성 결과가 어떻게 달리 나타나는지 그 원인을 설명할 수 있도록 설정하였다. 교사는 강아지와 고양이 사진 10장을 분류하는 데이터 입력 판을 제작하고, 일부 사진에 잘못된 라벨(오류 데이터)을 섞었을 때 AI 분류 결과가 어떻게 왜곡되는지 실습하는 탐구 학습지를 제공한다. 결과 오작동의 원인이 AI 기기 자체의 고장이 아니라 사람이 제공한 학습 데이터의 편향이나 오류 때문임을 연결하여 이해하도록 지도한다.',
  '[12인지01-02]':
    '이 성취기준은 생성형 AI의 대표적 한계인 환각(Hallucination) 현상의 특성을 파악하고, 출처가 확실한 공식 기관 문서나 뉴스 기사와 대조·검증하여 오류를 정정하는 비판적 정보 처리 역량을 기르기 위해 설정하였다. 교사는 존재하지 않는 역사적 인물이나 잘못된 날씨 정보가 포함된 AI 요약문 텍스트를 제공하고, 학생이 도서관 백과사전이나 공식 홈페이지를 직접 검색하여 사실 관계를 확인한 뒤 올바른 문장으로 고쳐 쓰는 정보 검수 교재를 제작한다. AI 대답 속 전문용어나 정중한 문체에 맹목적으로 속지 않고, 출처(URL, 발행 기관, 작성 날짜)가 명시되어 있는지 필수 확인하는 3단계 검증 루틴을 지도한다.',

  // === 영역 2. 인공지능 상호작용 ===
  '[9인지02-01]':
    '이 성취기준은 인공지능에게 입력하는 낱말의 종류, 길이, 조건(이름·색상·개수 등)에 따라 출력 대답이 크게 달라짐을 직관적으로 경험하기 위해 설정하였다. 교사는 "사과 그려줘"라고 요청할 때와 "빨간색 큰 사과 3개 그려줘"라고 요청할 때 AI 결과의 차이를 비교하는 카드 자료를 구성한다. 단어 카드를 하나씩 더 붙일 때마다 AI 응답 결과가 정교하게 변화하는 시각적 판넬을 활용하며, 원하는 대답이 나오지 않을 때 AI를 탓하기보다 "내가 준 낱말과 조건이 부족했구나"를 인지하고 입력 낱말을 더해가는 언어적 상호작용 습관을 형성한다.',
  '[9인지02-02]':
    '이 성취기준은 인공지능이 내 의도와 다르게 대답하거나 정보를 빠뜨렸을 때 포기하지 않고, 빠진 이름이나 조건(장소·시각·대상)을 구체적으로 보완하여 다시 프롬프트를 전달하는 피드백 소통 능력을 기르기 위해 설정하였다. 교사는 "점심 메뉴 추천해줘"라는 막연한 요청에 AI가 어울리지 않는 음식을 추천한 상황을 제시하고, "매운 음식 빼고 밥 종류로 다시 추천해줘"와 같이 구체적 힌트 카드를 더해 다시 요청하는 재입력 활동을 진행한다. 한 번의 요청으로 포기하지 않고 AI 대답을 확인한 후 빠진 정보를 덧붙여 2~3회 주고받는 연속 대화 카드를 활용한다.',
  '[12인지02-01]':
    '이 성취기준은 프롬프트의 구체성이 생성 대답의 정확도와 품질을 결정하는 핵심 변수임을 구조적으로 이해하고, 명칭(역할), 조건(제약), 예시(Few-shot)의 3요소가 입력될 때 대답이 정교해짐을 분석하기 위해 설정하였다. 교사는 [역할 부여 + 목적 지정 + 제약 조건 + 답변 예시]로 구성된 4단 프롬프트 템플릿 카드를 만들어, 학생들이 빈칸을 채워 AI에게 요청해보는 프롬프트 설계 워크시트를 제공한다. 단순한 한 줄 질문과 4단 템플릿 질문의 결과를 좌우로 비교 배치하여 구체적 프롬프트의 효과를 시각적으로 직접 확인하도록 지도한다.',
  '[12인지02-02]':
    '이 성취기준은 복잡하고 큰 과제를 한 번에 요청하면 AI가 오답을 내기 쉽다는 점을 인지하고, 과제를 1단계-2단계-3단계로 잘게 나누어 순서대로 요청하며 원하는 답변 모양(표·목록) 예시를 포함하여 수정하는 전략적 소통 역량을 기르기 위해 설정하였다. 교사는 "학교 행사 안내문 만들기" 과제를 [1. 날짜와 장소 정리 -> 2. 초대의 글 작성 -> 3. 존댓말 표 형태로 변환]으로 나누어 순차 입력하는 다단계 활동지를 제작한다. AI 대답이 너무 길거나 엉뚱할 경우, 한 번에 다 시키지 않고 첫 번째 단계만 먼저 시키는 하위 과제 분할 입력 전략을 안내한다.',

  // === 영역 3. 인공지능 활용 학습 ===
  '[9인지03-01]':
    '이 성취기준은 교과 공부나 일상 대화 중 모르는 단어, 어려운 문장, 수학 풀이 과정이 나올 때 인공지능에게 "쉽게 설명해줘"라고 질문하고, 나온 대답을 읽어 자신의 낱말장에 기록하는 학습 보조 도구 활용법을 익히기 위해 설정하였다. 교사는 모르는 단어 카드(인플레이션, 분리배출, 컴퓨팅 등)를 준비하고, AI의 쉬운 대답에서 핵심 단어를 찾아 자신의 공책에 옮겨 적는 낱말 정리장 교재를 제작한다. AI의 대답을 그냥 눈으로 읽고 지나치지 않고, 반드시 자신의 손으로 낱말장에 써보는 신체적·언어적 재정리 과정을 거치도록 조력한다.',
  '[9인지03-02]':
    '이 성취기준은 인공지능이 정답을 다 알려주더라도 전부 복사하여 베끼지 않고, AI는 힌트나 풀이 과정만 참고한 뒤 최종 정답은 학생 자신이 직접 생각하여 풀고 정리하는 주도적 학습 태도를 함양하기 위해 설정하였다. 교사는 AI 대답에 일부 가림막 힌트 카드를 덮어 두고, 힌트만 확인한 뒤 빈칸 정답은 학생이 직접 연필로 써보는 \'스스로 풀기 힌트 카드\'를 제작한다. AI 대답을 그대로 답안지에 베껴 적으려 할 때 "AI는 힌트 도우미일 뿐, 정답표를 작성하는 주인은 나"임을 상기시키며 스스로 문제 해결에 참여하도록 유도한다.',
  '[12인지03-01]':
    '이 성취기준은 학습 과제 수행 시 인공지능에게 다양한 각도로 질문하여 다채로운 설명을 수집하고, 내용을 이해한 후 자신만의 언어와 표현으로 재구성하여 요약·발표하는 고급 학업 역량을 기르기 위해 설정하였다. 교사는 AI가 출력한 길고 복잡한 글을 읽고 핵심 문장 3개로 간추려 자기 말로 다시 써보는 \'나만의 요약 및 발표 노트\' 활동지를 활용한다. AI의 전문 용어를 그대로 읽는 학생에게 "이 단어를 친구에게 쉽게 설명한다면 어떻게 말할 수 있을까?"라고 질문하여 자기 언어화를 촉진한다.',
  '[12인지03-02]':
    '이 성취기준은 인공지능 도구의 편의성에 과도하게 의존하여 사고력이 저하되는 현상을 예방하고, AI의 대답과 나의 생각을 비교·분석하며 탐구의 주체는 항상 자신임을 인지하는 성찰적 태도를 기르기 위해 설정하였다. 교사는 [AI의 제안 내용] 대 [나의 독자적 생각]을 좌우에 비교하여 작성하고 최종 결론은 자신이 내리는 \'주도적 생각 탐구지\'를 수업 교재로 활용한다. AI가 내놓은 의견과 다른 학생 자신의 생각에 더 높은 가치를 부여하고 칭찬하여, 주도적 탐구에 대한 자긍심을 고취한다.',

  // === 영역 4. 인공지능 안전과 윤리 ===
  '[9인지04-01]':
    '이 성취기준은 사진 속 얼굴, 이름, 전화번호, 집 주소, 비밀번호 등 개인을 식별할 수 있는 정보를 AI 입력창에 넣지 않도록 사전에 찾아 가리고, 이상한 개인정보 요구 및 낯선 링크 발생 시 즉시 멈추고 알리는 안전 실천 능력을 기르기 위해 설정하였다. 교사는 개인정보(얼굴, 주민번호, 주소)가 노출된 예시 사진과 글 카드를 제공하고, 스티커나 마스킹 테이프로 위험 정보를 가리는 \'개인정보 블라인드 스티커 활동\'을 진행한다. 학생이 실제 자기 얼굴이나 가족 전화번호를 AI 입력창에 치려고 할 때 "STOP 카드"를 제시하고 개인정보 가림막 수칙을 상기시킨다.',
  '[9인지04-02]':
    '이 성취기준은 디지털 기기와 인공지능을 사용할 때 개인정보 보호 약속을 지키고, 스스로 하루 미디어 사용 시간(예: 30분)을 정하여 과몰입이나 중독 없이 건전하게 이용하는 윤리적 마음가짐을 기르기 위해 설정하였다. 교사는 학생별 \'오늘의 AI 및 미디어 약속 시계\' 판을 제공하고, 사용 시간이 지나면 알람이 울리고 스스로 기기를 끄는 실천 체크리스트를 활용한다. 기기 사용 중단 시 칭찬 스티커를 제공하여 스스로 사용 시간을 조절한 경험에 대해 정적 강화를 제공한다.',
  '[12인지04-01]':
    '이 성취기준은 텍스트, 이미지, 파일에 포함된 민감한 정보(위치 데이터, 연락처, 개인 식별 코드)를 검출하여 가림 처리하고, 정보의 생산 출처와 게시 날짜를 확인하여 신뢰할 수 있는 안전한 정보만 선별·사용하는 보안 역량을 강화하기 위해 설정하였다. 교사는 SNS 게시물 모의 텍스트에서 위치 정보 및 개인 단서를 찾아 형광펜으로 가리고, 공식 뉴스 날짜와 비교하여 최신 유효 정보인지 판별하는 \'디지털 보안 검수 시트\'를 제작한다. 사진 메타데이터(EXIF 위치 정보)나 문서 속 숨은 개인정보 위험성을 시각화하여 정보 보안의 중요성을 실감하게 한다.',
  '[12인지04-02]':
    '이 성취기준은 타인의 초상권과 개인정보 및 저작권을 존중하고, 디지털 공간에서 올바른 언어를 사용하며, 스스로 사용 시간을 계획하고 조절하는 민주시민으로서의 디지털 윤리 의식을 함양하기 위해 설정하였다. 교사는 타인의 사진이나 글을 함부로 쓰지 않는 저작권 및 초상권 수칙 판넬과 스스로 일주일 미디어 다이어리를 기록하는 \'디지털 웰빙 타임 매니저\'를 제공한다. 인체 건강(수면, 시력)과 사회적 관계에 미치는 디지털 미디어 과몰입의 영향표를 함께 살피며 자율적 조절 태도를 도모한다.',

  // === 영역 5. 인공지능과 문제 해결 ===
  '[9인지05-01]':
    '이 성취기준은 문제가 무엇인지 명확히 알기 위해 \'현재 상태(예: 방이 어질러짐)\'와 \'목표 상태(예: 방이 깨끗이 정돈됨)\'를 비교하고, 그 사이에 필요한 변화를 찾아내는 컴퓨팅 사고의 기초 문제 정의 역량을 기르기 위해 설정하였다. 교사는 [지금 모습 그림]과 [완성된 모습 그림] 두 장을 대비하여 보여주고, 차이점 3가지를 찾아내는 문제 정의 카드를 수업 교재로 활용한다. 학생이 막연히 어렵다고 표현할 때, "지금 상태는 어떠니?", "나중에 완성되면 어떤 모습이어야 하니?"로 이분화하여 질문함으로써 문제를 명확히 인식하도록 돕는다.',
  '[9인지05-02]':
    '이 성취기준은 목표를 이루기 위해 일을 첫째, 둘째, 셋째 순서(알고리즘 순차)로 차례차례 나열하고, 순서가 틀리거나 오류가 생겼을 때 AI가 주는 힌트를 받아 틀린 순서 카드를 다시 알맞게 바꿔 끼우는 수정(디버깅) 경험을 위해 설정하였다. 교사는 라면 끓이기나 옷 입기 순서 카드가 섞여 있는 카드를 제공하고, 순서를 올바르게 재배치하고 오류를 고치는 \'순서 징검다리 판\'을 활용한다. 틀린 순서를 바로 답으로 지적해주지 않고, "이 순서대로 실행하면 어떤 어색한 일이 벌어질까?"를 시뮬레이션해 보게 한다.',
  '[12인지05-01]':
    '이 성취기준은 실생활의 복잡한 문제를 현재 상태와 목표 상태의 차이로 체계적으로 정의하고, 입력-처리-출력 및 순차·선택·반복의 컴퓨팅 문제 해결 절차(Algorithm)를 설계하는 고도화된 사고력을 함양하기 위해 설정하였다. 교사는 [문제 상황 분석표]를 제공하여 현재 문제점, 도달 목표, 필요 입력 자료, 처리 순서를 4단계 표 형태로 직접 설계해보는 문제 해결 설계지를 제공한다. 문제 정의 단계에서 원인과 결과를 혼동하지 않도록 "무엇이 진짜 방해 요소인가?"를 계통도로 시각화해 준다.',
  '[12인지05-02]':
    '이 성취기준은 규모가 큰 과제를 한 번에 해결하려 하지 않고 독립적인 작은 하위 과제(Decomposition)로 분할한 뒤, 마감 시간과 중요도에 따른 우선순위(Priority)를 정하고, AI의 오류 힌트를 분석하여 오답을 끈기 있게 교정하는 능력을 기르기 위해 설정하였다. 교사는 "학급 축제 준비하기"라는 큰 과제를 [1. 홍보지 만들기, 2. 물품 구매, 3. 자리 배치]로 나누고 1-2-3 순위를 정해 디버깅하는 \'과제 분할 및 디버깅 시트\'를 활용한다. 한꺼번에 많은 오류가 터져 당황할 때 "가장 먼저 해결해야 할 1번 과제 하나만 잘라내서 해결하자"고 조각 과제 접근을 지도한다.',

  // === 영역 6. 인공지능과 일상생활 ===
  '[9인지06-01]':
    '이 성취기준은 오늘 날씨에 맞는 옷차림을 고르거나 급식 메뉴, 버스 도착 시간, 학급 일정을 AI 스피커나 화면 기기를 통해 음성이나 터치로 직접 확인하는 실생활 정보 활용 능력을 기르기 위해 설정하였다. 교사는 날씨·급식 아이콘 버튼을 터치하거나 "오늘 날씨 어때?"라고 말하여 정보를 확인하고 오늘의 옷차림 스티커를 붙이는 \'생활 정보 모니터링 카드\'를 제공한다. 기기 음성 인식이 잘 안 될 때 음성 속도나 단어를 정제하여 말해보도록 안내하고, 실패 시 터치 버튼 대안을 사용할 수 있게 돕는다.',
  '[9인지06-02]':
    '이 성취기준은 인공지능 도구가 교실이나 집에서 나의 일상을 더 편리하게 돕는 유용한 도구임을 인지하고, 타인의 도움 없이도 스스로 AI 기기를 이용하여 생활 습관을 관리하려는 자주적인 태도를 기르기 위해 설정하였다. 교사는 \'나의 하루 AI 도우미 체크리스트\'를 만들어 아침 날씨 확인, 일정 확인, 건강 관리를 스스로 완료했을 때 도장을 받는 자주생활 매뉴얼을 활용한다. 처음에는 교사의 힌트를 받아 수행하더라도 점차 힌트 양을 줄여(fading) 최종적으로 독립 수행이 이루어지도록 유도한다.',
  '[12인지06-01]':
    '이 성취기준은 키오스크 주문, 대중교통 경로 검색, 건강 식단 관리, 스마트홈 제어 등 다양한 AI 도구를 통합적으로 활용하여 개인의 일상을 관리하고, 화면 멈춤이나 오류가 발생했을 때 당황하지 않고 다른 기기를 쓰거나 직원에게 문의하는 대안 적용 역량을 키우기 위해 설정하였다. 교사는 키오스크 품절 시 다른 메뉴 선택하기, 버스 미운행 시 지하철 경로 재검색하기 등 대안 선택 시나리오 카드를 활용한 \'디지털 자립 시뮬레이션 매뉴얼\'을 제작한다. 돌발 상황(오류, 멈춤) 발생 시 당황하지 않고 사용할 수 있는 "대안 3단계 수칙 카드"를 기기 옆에 부착해 둔다.',
  '[12인지06-02]':
    '이 성취기준은 인공지능 기술을 기반으로 타인에게 과도하게 의존하지 않고 지역사회(도서관, 관공서, 마트, 대중교통)에서 독립적으로 이동하고 생활하며, 미래의 예비 직업인이자 민주시민으로서 주체적인 자립을 이루려는 적극적인 삶의 태도를 기르기 위해 설정하였다. 교사는 \'나의 지역사회 자립 마스터 플랜\'을 제공하여 혼자서 AI 앱으로 버스 타고 마트 가서 키오스크로 장보고 오기 미션을 구성하고 스스로 평가하는 \'지역사회 자립 포트폴리오\'를 제공한다. 지역사회 현장 체험 시 학생이 직접 AI 앱을 활용하도록 측면에서 관찰·지원하고, 성공적인 자립 경험을 축하해 준다.',
};

export default function TeacherCurriculumGuide() {
  const [activeSchoolLevel, setActiveSchoolLevel] = useState<'middle' | 'high'>('middle');

  return (
    <div className="space-y-6 text-slate-800">
      {/* Subject Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white depth-overlay border border-indigo-900/50">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950">
                거제애광학교 자체 제작 학교 자율 교과
              </span>
              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-800 text-indigo-100">
                2022 개정 특수교육 기본 교육과정 기반
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
              '인공지능 활용' 과목 해설 및 교육과정 명세
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              2022 개정 특수교육 기본 교육과정에 제시된 3개 선택 교과의 한계를 넘어 특수교육 대상 학생의 디지털 기초소양 및 자립 역량을 다각도로 확장하기 위해 거제애광학교에서 자체 제작한 선택 교과 명세서입니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSchoolLevel('middle')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSchoolLevel === 'middle'
                  ? 'bg-amber-400 text-slate-950 font-black shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏫 중학교 (9학년군)
            </button>
            <button
              type="button"
              onClick={() => setActiveSchoolLevel('high')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                activeSchoolLevel === 'high'
                  ? 'bg-emerald-400 text-slate-950 font-black shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              🏫 고등학교 (12학년군)
            </button>
          </div>
        </div>
      </div>

      {/* 1. 교육과정 제작 배경 및 개요 */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xl">📘</span>
          <h2 className="text-xl font-extrabold text-slate-900">교육과정 제작 배경 및 개요</h2>
        </div>
        <div className="text-sm text-slate-700 leading-relaxed space-y-3 font-medium">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-slate-900 leading-relaxed space-y-2">
            <p className="font-extrabold text-amber-950 flex items-center gap-1.5 text-sm sm:text-base">
              <span>🏫</span> <span>학교 자율 선택 교과 제작 취지 (거제애광학교)</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              2022 개정 특수교육 기본 교육과정 선택 교과는 국가 수준에서 3개 과목으로 제한적으로 제시되어 있습니다. <strong>거제애광학교</strong>에서는 디지털 전환 시대에 발맞추어 특수교육 대상 학생들에게 보다 다양하고 실질적인 인공지능 교육 기회를 제공하고자 <strong>'인공지능 활용'</strong> 과목을 학교 자율 교과로 자체 제작하였습니다.
            </p>
          </div>
          <p>
            <strong>'인공지능 활용'</strong> 과목은 특수교육 대상 학생이 인공지능 기기, 소프트웨어, 디지털 문화에 대한 경험과 활용을 통해 디지털 전환에 따른 사회 변화에 유연하게 적응할 수 있도록 지원하는 실생활 중심 과목입니다.
          </p>
          <p>
            본 교육과정 명세는 국가 기본 교육과정의 삼차원 내용 체계(지식·이해, 과정·기능, 가치·태도)를 준용하여 <strong>'성격 및 목표'</strong>, <strong>'내용 체계'</strong>, <strong>'성취기준'</strong>, <strong>'교수·학습 및 평가'</strong>의 4개 핵심 구조로 정교하게 설계되었습니다.
          </p>
        </div>
      </section>

      {/* 2. 성격 및 목표 */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xl">🎯</span>
          <h2 className="text-xl font-extrabold text-slate-900">1. 성격 및 목표</h2>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-extrabold text-indigo-900 text-base mb-1.5">가. 성격</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              <strong>'인공지능 활용'</strong> 과목은 일상에서 접하는 인공지능의 원리를 이해하고, 인공지능 기기와 소프트웨어의 활용법을 익혀 실생활 문제를 해결할 수 있는 능력을 기르는 선택 교과이다. 학생은 인공지능과의 상호작용 경험을 통해 정보의 가치와 사실 여부를 확인하고, 개인정보 보호 및 디지털 윤리를 실천하는 태도를 기른다.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-indigo-900 text-base mb-2">나. 목표</h3>
            <p className="text-slate-900 font-extrabold mb-3 leading-relaxed bg-amber-50/80 p-3.5 rounded-xl border border-amber-200/90 text-sm sm:text-base">
              인공지능의 기초 지식과 기본 기능을 익혀 올바르게 활용하고, 컴퓨팅 사고력 함양을 통해 생활 속 문제를 해결하며, 정보 보안과 윤리적 활용을 실천하여 디지털 사회에 필요한 인공지능 활용 능력을 기른다.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded">지식 · 이해</span>
                <p className="text-xs font-bold text-slate-800 pt-1">
                  (1) 인공지능의 의미와 원리를 알고, 입력과 결과의 관계를 경험함으로써 인공지능의 올바른 사용 방법과 활용 특성을 이해한다.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded">과정 · 기능</span>
                <p className="text-xs font-bold text-slate-800 pt-1">
                  (2) 인공지능 기기와 소프트웨어 활용을 통해 정보를 탐색·검증하고 정보 보안을 지키며, 실생활 문제 해결 능력을 기른다.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">가치 · 태도</span>
                <p className="text-xs font-bold text-slate-800 pt-1">
                  (3) 디지털 사회에서 지켜야 할 윤리 의식을 함양하고, 인공지능을 주체적이고 윤리적으로 활용하는 안전한 태도를 기른다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 영역별 6개 내용 체계 (정통 해설서 6개 영역별 구분 표준 양식) */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-xl font-extrabold text-slate-900">2. 영역별 내용 체계</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">6개 영역별 핵심 아이디어 & 범주별 내용 요소</span>
        </div>

        {/* 6개 영역별 내용 체계 표 반복 */}
        <div className="space-y-8 divide-y divide-slate-200 pt-2">

          {/* (1) 인공지능의 이해 */}
          <div className="space-y-3 pt-4 first:pt-0">
            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                (1) 영역
              </span>
              <span>인공지능의 이해</span>
            </h3>

            {/* 영역 핵심 아이디어 */}
            <div className="p-3.5 rounded-xl bg-indigo-950 text-white space-y-1.5 border border-indigo-800">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <span>💡</span> <span>핵심 아이디어</span>
              </span>
              <ul className="list-inside list-disc text-xs text-slate-200 space-y-1 leading-relaxed pl-1">
                <li>인공지능은 사람이 제공한 데이터를 바탕으로 결과를 생성하며, 작동 원리와 한계를 이해하는 것이 중요하다.</li>
                <li>인공지능이 생성한 대답은 원본 자료와 비교하여 그럴듯한 거짓 정보(환각)가 없는지 스스로 검증하여 사용해야 한다.</li>
              </ul>
            </div>

            {/* 내용 체계 표 */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                    <th className="p-3 border-r border-slate-300 w-28 text-center">범주</th>
                    <th className="p-3 border-r border-slate-300">중학교 1~3학년 내용 요소</th>
                    <th className="p-3">고등학교 1~3학년 내용 요소</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  <tr className="bg-amber-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-amber-900 text-center bg-amber-100/60">지식 · 이해</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 인공지능의 대답 생성 방식<br />• 사람이 제공한 정보 바탕의 작동 원리</td>
                    <td className="p-2.5 text-slate-800">• 인공지능의 개념 및 원리<br />• 데이터 학습과 결과 생성 원리<br />• 환각(거짓 정보) 현상의 특성</td>
                  </tr>
                  <tr className="bg-sky-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-sky-900 text-center bg-sky-100/60">과정 · 기능</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 인공지능 대답과 실제 안내 자료 비교하기<br />• 원본 정보와 다른 틀린 부분 찾기</td>
                    <td className="p-2.5 text-slate-800">• 인공지능 대답을 원본 자료와 대조하기<br />• 그럴듯한 거짓 정보(환각) 찾아 수정하기</td>
                  </tr>
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-emerald-900 text-center bg-emerald-100/60">가치 · 태도</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 인공지능 대답을 그대로 믿지 않는 마음<br />• 진짜 사실인지 확인하려는 자세</td>
                    <td className="p-2.5 text-slate-800">• 인공지능 대답을 맹신하지 않는 성찰적 태도<br />• 사람이 직접 검증하여 사용하려는 의지</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* (2) 인공지능 상호작용 */}
          <div className="space-y-3 pt-6">
            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                (2) 영역
              </span>
              <span>인공지능 상호작용</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-indigo-950 text-white space-y-1.5 border border-indigo-800">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <span>💡</span> <span>핵심 아이디어</span>
              </span>
              <ul className="list-inside list-disc text-xs text-slate-200 space-y-1 leading-relaxed pl-1">
                <li>인공지능에게 제공하는 명칭, 조건, 예시 등 입력 정보의 구체성에 따라 출력 결과 대답의 품질이 달라진다.</li>
                <li>원하는 결과를 얻기 위해 과제를 단계별로 나누고 예시를 포함하여 프롬프트를 올바르게 작성하고 수정한다.</li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                    <th className="p-3 border-r border-slate-300 w-28 text-center">범주</th>
                    <th className="p-3 border-r border-slate-300">중학교 1~3학년 내용 요소</th>
                    <th className="p-3">고등학교 1~3학년 내용 요소</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  <tr className="bg-amber-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-amber-900 text-center bg-amber-100/60">지식 · 이해</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 인공지능에게 주는 낱말과 조건의 의미<br />• 입력 조건 변화에 따른 대답 결과의 다름</td>
                    <td className="p-2.5 text-slate-800">• 입력 정보 구체성(명칭·조건·예시)의 이해<br />• 입력 구체성과 생성 대답 품질 간의 관계</td>
                  </tr>
                  <tr className="bg-sky-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-sky-900 text-center bg-sky-100/60">과정 · 기능</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 구체적인 이름과 조건을 더해 다시 요청하기<br />• 원하는 대답을 얻기 위해 입력 낱말 수정하기</td>
                    <td className="p-2.5 text-slate-800">• 과제를 단계별로 세분화하여 요청하기<br />• 예시를 포함한 프롬프트 작성 및 수정하기</td>
                  </tr>
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-emerald-900 text-center bg-emerald-100/60">가치 · 태도</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 내 생각을 분명하게 전달하려는 태도<br />• 인공지능에게 예의 바르게 요청하는 자세</td>
                    <td className="p-2.5 text-slate-800">• 올바르고 명확하게 의사를 표현하려는 태도<br />• 인공지능과 주체적이고 적극적으로 소통하는 자세</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* (3) 인공지능 활용 학습 */}
          <div className="space-y-3 pt-6">
            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                (3) 영역
              </span>
              <span>인공지능 활용 학습</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-indigo-950 text-white space-y-1.5 border border-indigo-800">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <span>💡</span> <span>핵심 아이디어</span>
              </span>
              <ul className="list-inside list-disc text-xs text-slate-200 space-y-1 leading-relaxed pl-1">
                <li>인공지능은 모르는 개념이나 낱말을 탐구하도록 돕는 학습 보조 도구이며, 인간의 주도적 생각이 중심이 되어야 한다.</li>
                <li>인공지능의 설명을 참고하되 자신의 언어로 다시 정리하여 주도적인 학습 태도를 기른다.</li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                    <th className="p-3 border-r border-slate-300 w-28 text-center">범주</th>
                    <th className="p-3 border-r border-slate-300">중학교 1~3학년 내용 요소</th>
                    <th className="p-3">고등학교 1~3학년 내용 요소</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  <tr className="bg-amber-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-amber-900 text-center bg-amber-100/60">지식 · 이해</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 공부할 때 인공지능에게 물어볼 수 있는 질문<br />• 공부에서 인공지능과 나의 역할 차이</td>
                    <td className="p-2.5 text-slate-800">• 학습 과정에서 인공지능이 도울 수 있는 영역<br />• 자신이 직접 수행해야 할 탐구 역할의 이해</td>
                  </tr>
                  <tr className="bg-sky-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-sky-900 text-center bg-sky-100/60">과정 · 기능</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 모르는 낱말이나 풀이 인공지능에게 물어보기<br />• 나온 설명을 확인하여 이해하고 정리하기</td>
                    <td className="p-2.5 text-slate-800">• 학습 내용 및 낱말 뜻을 질문하여 설명 얻기<br />• 인공지능 설명을 자신의 언어로 재정리하기</td>
                  </tr>
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-emerald-900 text-center bg-emerald-100/60">가치 · 태도</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 인공지능 도움을 받으면서도 스스로 풀어보기<br />• 공부에 적극적으로 참여하려는 의지</td>
                    <td className="p-2.5 text-slate-800">• 인공지능에 과도하게 의존하지 않는 태도<br />• 주도적으로 탐구하며 공부하려는 성찰적 자세</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* (4) 인공지능 안전과 윤리 */}
          <div className="space-y-3 pt-6">
            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                (4) 영역
              </span>
              <span>인공지능 안전과 윤리</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-indigo-950 text-white space-y-1.5 border border-indigo-800">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <span>💡</span> <span>핵심 아이디어</span>
              </span>
              <ul className="list-inside list-disc text-xs text-slate-200 space-y-1 leading-relaxed pl-1">
                <li>인공지능 이용 시 나를 식별할 수 있는 개인정보를 보호하고, 정보 보안 규칙을 엄격히 준수한다.</li>
                <li>디지털 위험 신호에 올바르게 대응하고, 미디어 이용 시간을 스스로 조절하여 윤리적으로 사용한다.</li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                    <th className="p-3 border-r border-slate-300 w-28 text-center">범주</th>
                    <th className="p-3 border-r border-slate-300">중학교 1~3학년 내용 요소</th>
                    <th className="p-3">고등학교 1~3학년 내용 요소</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  <tr className="bg-amber-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-amber-900 text-center bg-amber-100/60">지식 · 이해</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 알려주면 안 되는 개인정보(얼굴·이름·비밀번호)<br />• 낯선 디지털 위험 신호와 안전 수칙</td>
                    <td className="p-2.5 text-slate-800">• 보호해야 할 개인식별 단서 및 정보 보안<br />• 디지털 안전 위험 요소(피싱·광고)의 특성</td>
                  </tr>
                  <tr className="bg-sky-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-sky-900 text-center bg-sky-100/60">과정 · 기능</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 사진이나 글에서 개인정보 찾아 가리기<br />• 위험한 요청 발생 시 올리기 멈추고 알리기</td>
                    <td className="p-2.5 text-slate-800">• 개인식별 단서 가리기 및 정보 보안 실천<br />• 정보의 출처와 날짜 대조하여 안전하게 쓰기</td>
                  </tr>
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-emerald-900 text-center bg-emerald-100/60">가치 · 태도</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 개인정보를 안전하게 보호하려는 마음<br />• 정해진 이용 시간을 지키려는 올바른 자세</td>
                    <td className="p-2.5 text-slate-800">• 타인과 나의 정보 보호 및 정보 보안 준수<br />• 미디어 이용 시간 조절 및 윤리적 사용 태도</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* (5) 인공지능과 문제 해결 */}
          <div className="space-y-3 pt-6">
            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                (5) 영역
              </span>
              <span>인공지능과 문제 해결</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-indigo-950 text-white space-y-1.5 border border-indigo-800">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <span>💡</span> <span>핵심 아이디어</span>
              </span>
              <ul className="list-inside list-disc text-xs text-slate-200 space-y-1 leading-relaxed pl-1">
                <li>문제의 현재 상태와 목표 상태의 차이를 파악하고 절차에 따라 순서를 정하여 문제를 정의한다.</li>
                <li>과제를 작은 단위로 나누어 우선순위를 정하고, 인공지능의 힌트를 활용해 오류를 끈기 있게 수정한다.</li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                    <th className="p-3 border-r border-slate-300 w-28 text-center">범주</th>
                    <th className="p-3 border-r border-slate-300">중학교 1~3학년 내용 요소</th>
                    <th className="p-3">고등학교 1~3학년 내용 요소</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  <tr className="bg-amber-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-amber-900 text-center bg-amber-100/60">지식 · 이해</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 지금 상황과 이루고 싶은 목표 상태의 차이<br />• 문제 해결에 필요한 순서와 차례</td>
                    <td className="p-2.5 text-slate-800">• 현재와 목표 상태 비교를 통한 문제 정의<br />• 문제 해결 절차(컴퓨팅 사고)의 개념 이해</td>
                  </tr>
                  <tr className="bg-sky-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-sky-900 text-center bg-sky-100/60">과정 · 기능</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 목표를 위해 필요한 순서 차례대로 정하기<br />• 힌트를 받아 틀린 부분 찾아 고쳐 보기</td>
                    <td className="p-2.5 text-slate-800">• 큰 문제를 작은 하위 과제로 나누어 순서 정하기<br />• 힌트 활용 및 오답·오류 수정(디버깅)하기</td>
                  </tr>
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-emerald-900 text-center bg-emerald-100/60">가치 · 태도</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 틀려도 포기하지 않고 다시 해보는 자세<br />• 순서대로 차근차근 문제를 해결하려는 마음</td>
                    <td className="p-2.5 text-slate-800">• 오류를 두려워하지 않고 끈기 있게 수정하기<br />• 실패를 거쳐 해결 방법을 도출하려는 도전 태도</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* (6) 인공지능과 일상생활 */}
          <div className="space-y-3 pt-6">
            <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                (6) 영역
              </span>
              <span>인공지능과 일상생활</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-indigo-950 text-white space-y-1.5 border border-indigo-800">
              <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
                <span>💡</span> <span>핵심 아이디어</span>
              </span>
              <ul className="list-inside list-disc text-xs text-slate-200 space-y-1 leading-relaxed pl-1">
                <li>일상생활 및 지역사회에서 활용되는 인공지능 서비스의 편리함을 인식하고 필요한 정보를 활용한다.</li>
                <li>일정, 이동, 식단, 건강 등 생활 속 인공지능 도구를 스스로 활용하여 독립적인 일상생활 자립을 이룬다.</li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                    <th className="p-3 border-r border-slate-300 w-28 text-center">범주</th>
                    <th className="p-3 border-r border-slate-300">중학교 1~3학년 내용 요소</th>
                    <th className="p-3">고등학교 1~3학년 내용 요소</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 font-medium">
                  <tr className="bg-amber-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-amber-900 text-center bg-amber-100/60">지식 · 이해</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 일상생활(날씨·식단·버스) 인공지능의 편리함<br />• 화면이나 기기에서 쓰이는 생활 인공지능</td>
                    <td className="p-2.5 text-slate-800">• 일상 및 지역사회(키오스크·스마트홈·교통) 서비스<br />• 다양한 생활 속 인공지능 도구의 종류와 특성</td>
                  </tr>
                  <tr className="bg-sky-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-sky-900 text-center bg-sky-100/60">과정 · 기능</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 인공지능 기기로 필요한 정보(날씨·일정) 찾아 확인<br />• 힌트 및 도움 받아 화면에서 원하는 정보 고르기</td>
                    <td className="p-2.5 text-slate-800">• 일정·이동·식단 관리 도구 활용 및 대안 적용<br />• 오류나 멈춤 발생 시 다른 해결 방법 찾아 쓰기</td>
                  </tr>
                  <tr className="bg-emerald-50/30">
                    <td className="p-3 border-r border-slate-300 font-black text-emerald-900 text-center bg-emerald-100/60">가치 · 태도</td>
                    <td className="p-2.5 border-r border-slate-300 text-slate-800">• 일상에서 인공지능을 스스로 활용하여 생활하기<br />• 인공지능 도구를 기분 좋게 활용하려는 자세</td>
                    <td className="p-2.5 text-slate-800">• 인공지능을 주체적으로 활용하려는 자주적 자세<br />• 독립적인 일상생활과 지역사회 자립을 이루는 태도</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      {/* 4. 영역별 24개 성취기준 해설 및 적용 시 고려 사항 (국가 교육과정 정식 해설 서술 구조) */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-5">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-xl font-extrabold text-slate-900">
              3. 성취기준 해설 및 적용 시 고려 사항 ('인공지능 활용')
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">선택한 학교급:</span>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-900 text-amber-300">
              {activeSchoolLevel === 'middle' ? '중학교 (9학년군)' : '고등학교 (12학년군)'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          {Object.values(AI_ACHIEVEMENT_STANDARDS).map((meta) => {
            const standardsList = activeSchoolLevel === 'middle' ? meta.middleSchool : meta.highSchool;

            return (
              <div
                key={meta.moduleId}
                className="border-2 border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50 space-y-5"
              >
                {/* Domain Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                  <h3 className="text-lg font-black text-indigo-950 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                      영역 {meta.domainNumber}
                    </span>
                    <span>{meta.domainName}</span>
                  </h3>
                  <span className="text-xs font-bold text-slate-500">
                    단원 연동: {MODULES.find((m) => m.id === meta.moduleId)?.title}
                  </span>
                </div>

                {/* Individual Standards Official Narrative Explanation */}
                <div className="space-y-4">
                  {standardsList.map((s) => {
                    const narrativeExplanation = DETAILED_STANDARD_EXPLANATIONS[s.code] || '이 성취기준은 인공지능 활용 능력을 기르고 실생활 문제를 주도적으로 해결하도록 돕기 위해 설정하였다.';

                    return (
                      <div key={s.code} className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 depth-paper space-y-3">
                        {/* Standard Code & Title */}
                        <div className="flex items-start gap-2 border-b border-slate-100 pb-2.5">
                          <span className="shrink-0 px-2.5 py-1 rounded bg-slate-900 text-amber-300 font-mono text-xs font-black">
                            {s.code}
                          </span>
                          <strong className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                            {s.statement}
                          </strong>
                        </div>

                        {/* (가) 성취기준 해설 - 정식 교육과정 통합 서술문 */}
                        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-slate-900 space-y-1.5">
                          <p className="font-extrabold text-amber-950 flex items-center gap-1.5">
                            <span>💡</span> <span>(가) 성취기준 해설</span>
                          </p>
                          <p className="text-slate-800 font-medium leading-relaxed pl-5">
                            {narrativeExplanation}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* (나) 적용 시 고려 사항 (특수교육 맞춤 지원) */}
                <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200/80 text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <p className="font-extrabold text-sky-900 flex items-center gap-1.5">
                    <span>♿</span> <span>(나) 적용 시 고려 사항 (거제애광학교 맞춤 지원)</span>
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-slate-800 font-medium pl-2 leading-relaxed text-xs">
                    <li>
                      장애 정도나 표현 능력에 따라 보완대체의사소통(AAC) 카드, 낱말 고르기 상자, 음성 입출력을 지원한다.
                    </li>
                    <li>
                      복잡한 과제는 한 번에 지시하지 않고 1~3단계의 작은 하위 단계로 나누어 시각적 힌트와 함께 제공한다.
                    </li>
                    <li>
                      학생의 개인정보(얼굴, 이름, 전화번호)가 실제 외부 AI 서비스로 유출되지 않도록 준비된 비실시간 예시 데이터를 활용한다.
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. 교수·학습 및 평가 */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xl">👩‍🏫</span>
          <h2 className="text-xl font-extrabold text-slate-900">3. 교수·학습 및 평가</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-indigo-900 text-sm">가. 교수·학습의 방향 및 방법</h3>
            <ul className="list-inside list-disc space-y-1.5 text-slate-700 font-medium leading-relaxed">
              <li>'인공지능 활용' 과목의 특성을 살려 실생활 문제 중심 체험 학습으로 구성하여 흥미와 몰입도를 제고한다.</li>
              <li>직접 교수 및 시각적 모델링 기법을 통해 힌트를 단계적으로 제공한다.</li>
              <li>쉬운 지원, 보통 지원, 도전적 지원 수준을 고려한 맞춤형 과제를 제공한다.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-indigo-900 text-sm">나. 평가의 방향 및 방법</h3>
            <ul className="list-inside list-disc space-y-1.5 text-slate-700 font-medium leading-relaxed">
              <li>단순 지식 암기보다 실제 대조·수정·선택 과정을 관찰하는 과정 중심 평가를 실시한다.</li>
              <li>학생의 수행 결과물을 포트폴리오 형태로 누적 기록하여 성장을 평가한다.</li>
              <li>음성, 사진, 그림 원본을 남기지 않고 정제된 과정 증거만을 안전하게 기록한다.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
