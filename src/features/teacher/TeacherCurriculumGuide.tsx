import React, { useState } from 'react';
import { AI_ACHIEVEMENT_STANDARDS } from '../../data/aiAchievementStandards';
import {
  ACHIEVEMENT_LEVEL_LABELS,
  ACHIEVEMENT_LEVEL_SUPPORT,
  getAchievementLevels,
  type AchievementLevelKey,
} from '../../data/aiAchievementLevels';
import { MODULES } from '../../data/modules';
import { MODULE_CORE_CONTENTS } from '../../data/moduleCoreContents';
import {
  ASSESSMENT_DIRECTIONS,
  ASSESSMENT_METHODS,
  KOREAN_ITEM_MARKERS,
  TEACHING_DIRECTIONS,
  TEACHING_METHODS,
} from '../../data/curriculumTeachingAssessment';

const LEVEL_ORDER: AchievementLevelKey[] = ['high', 'middle', 'low'];

const LEVEL_ROW_STYLE: Record<AchievementLevelKey, string> = {
  high: 'bg-emerald-50/60',
  middle: 'bg-sky-50/60',
  low: 'bg-amber-50/60',
};

/**
 * 기본 교육과정의 교수·학습·평가 항목 표기를 그대로 따른다. (가)(나)(다)… 로
 * 번호를 붙이고 한 항목을 한 문장으로 서술한다.
 */
function NumberedItems({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((text, index) => (
        <li key={text} className="flex gap-2 text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
          <span className="shrink-0 font-black text-indigo-900">
            ({KOREAN_ITEM_MARKERS[index] ?? index + 1})
          </span>
          <span>{text}</span>
        </li>
      ))}
    </ol>
  );
}

// Single, unified official narrative explanation for each of the 24 achievement standards
export const DETAILED_STANDARD_EXPLANATIONS: Record<string, string> = {
  // === 영역 1. 인공지능의 이해 ===
  '[9인지01-01]':
    '이 성취기준은 인공지능이 스스로 모든 것을 아는 만능 기계가 아니라 사람이 모아 준 자료에서 규칙을 찾아 대답을 만드는 도구임을 체득하도록 설정하였다. 1단원 2차시에서는 선풍기의 버튼, 자동문의 센서, 음악 추천 앱의 사용 기록을 담은 그림 카드를 나란히 놓고 각 기능이 무엇을 받아 무엇을 내놓는지 비교하게 하며, 6차시에서는 배움 상자를 열어 세모 카드만 가득한 학습 자료가 치우친 결과를 만든다는 사실을 확인하게 한다. 학생이 인공지능을 만능으로 오해할 때에는 3차시의 급식 발표 장면을 다시 제시하여, 인공지능이 식단표를 확인하지 않고도 당당하게 틀린 답을 만들어 낼 수 있음을 짚어 개념을 교정한다.',
  '[9인지01-02]':
    '이 성취기준은 인공지능이 언제나 정답만 말하는 것이 아니며 때로는 그럴듯한 거짓 정보를 만들어 낸다는 점을 알고, 주간 식단표나 안내문 원본과 대답을 견주어 틀린 부분을 찾아내는 확인 능력을 기르기 위해 설정하였다. 1단원 3차시에서는 「무지개 아이스크림 떡볶이」라는 대답을 학교 게시판의 주간 식단표와 대조하여 바른 메뉴로 고친 뒤 검토 기록표에 남기게 하고, 7차시에서는 열 쪽짜리 체험회 안내문과 1초 요약을 나란히 놓고 「준비물: 실로폰」처럼 빠진 항목을 찾아 요약·번역 검토지에 채우게 한다. 대답이 당당하고 매끄럽게 들릴수록 확인을 건너뛰기 쉬우므로, 날짜·장소·준비물·마감처럼 행동을 바꾸는 항목부터 원본과 하나씩 짚어 보도록 지도한다.',
  '[12인지01-01]':
    '이 성취기준은 인공지능의 개념과 함께 자료 입력, 규칙 찾기, 결과 생성으로 이어지는 흐름을 구조적으로 이해하고, 사람이 준 자료가 달라질 때 결과가 왜 달라지는지 설명하도록 설정하였다. 1단원 6차시에서는 세모 카드가 대부분인 배움 상자를 확인한 뒤 모양별 수와 색·크기를 고르게 채워 넣고 같은 시험 카드로 전후 결과를 비교하여 학습 자료 전후 결과표에 정리하게 하며, 4차시와 5차시에서는 사진의 가림·밝기와 소음·마이크 거리처럼 입력 조건을 한 번에 하나씩만 바꾸어 결과 변화를 확인하게 한다. 결과가 틀린 까닭을 기기의 고장이나 기분 탓으로 돌리지 않고 사람이 준비한 자료와 입력 조건에서 찾도록 하며, 자료를 보완한 뒤에도 남는 오류 조건은 따로 기록하게 한다.',
  '[12인지01-02]':
    '이 성취기준은 생성형 인공지능이 만들어 내는 그럴듯한 거짓 정보(환각)의 특성을 파악하고, 원문이나 학교 공식 공지와 대조하여 오류를 고치는 비판적 정보 처리 역량을 기르기 위해 설정하였다. 1단원 7차시에서는 요약문에서 빠진 신청 마감과 다르게 옮겨진 장소 이름을 원문과 대조해 고치고 확인한 원문 위치를 함께 남기게 하며, 10차시에서는 확인되지 않은 행사 시간이 들어간 안내 문구를 학교 공식 공지표와 견주어 수정본을 만들거나 사용을 거절하고 그 판단 근거를 기록하게 한다. 3차시의 전이 장면에서는 검색 도구를 연결한 인공지능도 실수할 수 있음을 다루어, 안전하게 요청하기, 근거와 견주기, 사용·수정·거절 정하기의 세 단계를 습관으로 지도한다.',

  // === 영역 2. 인공지능 상호작용 ===
  '[9인지02-01]':
    '이 성취기준은 인공지능에게 입력하는 낱말과 조건에 따라 결과가 달라짐을 직접 경험하기 위해 설정하였다. 교사는 2단원 1차시의 요청 말풍선 채우기 활동에서 정해진 칸 수 안에 꼭 필요한 정보 조각만 담을수록 결과가 또렷해지고 전화번호나 집 주소 같은 개인정보 조각은 담지 않아도 됨을 확인하게 하며, 3차시에서는 "아무거나 추천해 줘"라는 요청과 "초등학생 여섯 명이 비 오는 날 교실에서 20분 안에 할 수 있는 쉬운 협동 놀이 두 가지를 추천해 줘"라는 요청의 결과를 전후 요청-결과 체크표로 비교하도록 지도한다. 5차시의 읽을 사람과 말투 조건, 8차시의 표·번호 목록·한 문장 형식 선택을 이어서 다루어, 원하는 결과가 나오지 않을 때 인공지능을 탓하기보다 내가 준 낱말과 조건을 먼저 점검하는 태도를 형성한다.',
  '[9인지02-02]':
    '이 성취기준은 인공지능의 첫 답이 의도와 다르거나 정보를 빠뜨렸을 때 포기하지 않고, 빠진 이름과 조건을 구체적으로 보태어 다시 요청하는 피드백 소통 능력을 기르기 위해 설정하였다. 교사는 2단원 7차시에서 "더 쉽게 고쳐 줘"라는 요청만으로 시간과 장소가 통째로 사라진 안내문을 함께 살피고, 오후 2시·도서관·색연필처럼 지킬 사실을 먼저 정한 뒤 어려운 낱말만 바꾸어 달라고 다시 요청하여 수정 전후 차이를 기준표에 기록하게 한다. 4차시의 예시 넣어 다시 요청하기, 6차시의 앞 단계 결과를 다음 요청에 이어 쓰기, 10차시의 요청-결과-수정-근거-결정 대화 기록을 연결하여 한 번의 요청으로 끝내지 않고 결과를 확인한 뒤 조건을 보태어 주고받는 습관을 형성한다.',
  '[12인지02-01]':
    '이 성취기준은 명칭·조건·예시 등 입력 정보의 구체성이 결과를 어떻게 바꾸는지 분석하기 위해 설정하였다. 교사는 2단원 3차시에서 「그거」나 「아무거나」 대신 대상의 이름·종류·개수를 넣게 하고, 범위 좁히기 활동으로 찾으려는 대상만 남도록 요청 범위를 줄여 본 뒤 전후 요청-결과 체크표에 대상·인원·시간·공간의 충족 여부를 항목별로 표시하게 한다. 1차시의 요청 말풍선 칸 채우기에서는 담을 수 있는 칸이 정해져 있으므로 개인정보 조각을 빼고 결과를 바꾸는 정보 조각만 골라 담게 한다. 5차시에서는 읽을 사람과 말투를 지정해도 시간·장소·준비물 같은 사실은 따로 확인해야 함을, 8차시에서는 표·번호 목록·한 문장이라는 형식 규칙을 지정해도 내용 정확성은 따로 확인해야 함을 다룬다. 예시의 구체성을 다루는 활동은 4차시의 예시 표와 날짜가 틀린 예시의 결과 비교에 있으며, 이 차시는 [12인지02-02]로 등록되어 있으므로 두 성취기준을 함께 관찰한다.',
  '[12인지02-02]':
    '이 성취기준은 크고 복잡한 과제를 한 번에 요청하면 누락이 생기기 쉬움을 인지하고, 과제를 단계로 나누어 순서대로 요청하며 원하는 답의 예시와 형식을 포함하여 수정하는 전략적 소통 역량을 기르기 위해 설정하였다. 교사는 2단원 6차시의 체험회 준비표 과제를 장소와 일정 확인, 필요한 물건과 수량 정하기, 담당과 누락 검토의 세 요청으로 나누고 각 단계 뒤에 중간 확인 지점을 두어 앞 단계의 결과를 다음 요청의 입력으로 쓰게 하며, 2차시에서는 안내문·간식·음악이 한 문장에 섞인 요청을 마감과 앞뒤 관계에 따라 세 요청으로 분리하게 한다. 4차시에서는 「물건 | 수량 | 담당」과 같이 원하는 답의 예시를 요청에 넣게 하되 날짜가 틀린 예시는 결과의 오류로 이어짐을 함께 확인하게 하고, 결과가 길거나 엉뚱할 때에는 마감이 가장 빠른 한 단계만 먼저 요청하도록 안내한다.',

  // === 영역 3. 인공지능 활용 학습 ===
  '[9인지03-01]':
    '이 성취기준은 교과 학습이나 생활 자료에서 모르는 낱말과 어려운 설명을 만났을 때 인공지능에게 질문하여 설명을 얻고, 그 설명을 다른 자료와 대조한 뒤 자기 표현으로 정리하는 학습 보조 도구 활용 능력을 기르기 위해 설정하였다. 교사는 m3-l2 「모르는 낱말 확인하기」에서 전시 안내문의 「생태계」를 문맥으로 먼저 짐작하게 한 뒤 아이미의 설명과 학생 사전을 나란히 놓고 공통 핵심을 찾아 「뜻-근거-예문-그림 낱말 카드」로 정리하도록 지도하며, m3-l1 「궁금한 것을 깊게 묻기」에서는 같은 주제를 예·아니오 질문, 열린 질문, 구체화 질문으로 바꾸어 답의 정보 범위를 비교하게 한다. 설명을 그대로 옮겨 적지 않도록 m3-l3 「쉽지만 정확하게 다시 설명하기」에서 쉬운 비유에 빠진 사실을 교과서 그림과 대조해 찾게 하고, 정리 결과는 선택·글·말·그림 가운데 학생이 수행할 수 있는 방식으로 남기게 한다.',
  '[9인지03-02]':
    '이 성취기준은 인공지능이 답이나 제안을 먼저 내놓더라도 그대로 옮겨 쓰지 않고, 자신의 판단을 먼저 남긴 뒤 인공지능의 결과를 확인 자료로 사용하는 주도적 학습 태도를 함양하기 위해 설정하였다. 교사는 m3-l8 「정답을 나중에 보는 퀴즈」에서 문제와 정답이 한 화면에 함께 나온 아이미의 퀴즈를 회상·응답·피드백·다시 풀기 순서의 양면 카드로 고치게 하고, m3-l6 「계산은 다른 도구로 확인하기」에서는 합계를 먼저 어림한 뒤 계산기로 확인하여 아이미 풀이에서 처음 달라진 줄을 찾게 한다. m3-l5 「AI와 이야기를 함께 만들기」에서는 결말을 학생이 먼저 정한 다음 아이미의 세 제안을 수용·수정·거절하게 하여, 제안을 거절하는 것도 창작의 정당한 선택임을 확인하도록 지도한다.',
  '[12인지03-01]':
    '이 성취기준은 학습 자료의 내용과 낱말의 뜻을 인공지능에게 질문하여 설명을 얻고, 그 설명을 원문·사전·그림과 대조하여 빠지거나 달라진 부분을 보완한 뒤 자신의 언어로 재구성하는 학업 역량을 기르기 위해 설정하였다. 교사는 m3-l7 「긴 글의 핵심을 남기기」에서 여덟 문장짜리 전시 설명문의 핵심 세 가지를 학생이 먼저 고르게 한 뒤, 아이미의 세 문장 요약에서 빠진 「시작 10분 전 도착」을 원문 근거와 연결해 되살리도록 지도한다. m3-l10 「오늘 배운 것을 내 말로 복습하기」에서는 자료를 덮고 먼저 떠올린 내용을 남긴 다음 이전 결과물과 아이미의 요약을 비교하여 최종 설명을 자기 말로 완성하게 하며, m3-l4 「낱말을 문장에서 써 보기」에서는 아이미의 예문 두 개를 실제 장면과 대조해 어색한 예문을 고치고 자기 문장을 만들게 한다.',
  '[12인지03-02]':
    '이 성취기준은 인공지능의 편의성에 기대어 판단을 넘기지 않고, 자신의 생각을 먼저 남긴 뒤 인공지능의 결과와 비교하여 최종 결정을 스스로 내리는 성찰적 태도를 기르기 위해 설정하였다. 교사는 3단원 5차시 「AI와 이야기를 함께 만들기」에서 결말을 학생이 먼저 정한 다음 아이미의 제안을 수용·수정·거절하게 하고 그 까닭까지 3컷 이야기 보드에 남기도록 지도하며, 8차시 「정답을 나중에 보는 퀴즈」에서는 문제와 정답이 한 화면에 함께 나온 퀴즈를 회상·응답·피드백·다시 풀기 순서의 양면 카드로 고쳐 정답 공개 시점을 학생이 설계하게 한다. 단원 마무리 「나의 공부 도우미 도구함」에서는 AI가 도울 수 있는 일, 내가 직접 할 일, 결과를 확인하는 규칙을 나누어 적게 하여 탐구의 주체가 학생 자신임을 정리하도록 지도한다. 그림 설명의 사실과 추측 구분은 9차시가 담당하지만 해당 차시는 [9인지03-01]로 태깅되어 있으므로 이 성취기준의 대표 차시로는 인용하지 않는다.',

  // === 영역 4. 인공지능 안전과 윤리 ===
  '[9인지04-01]':
    '이 성취기준은 이름이나 연락처 같은 직접 단서뿐 아니라 학교 이름, 반복하는 하교 시간, 사진 배경의 이름표와 위치 표지처럼 여러 개가 모이면 개인을 알아볼 수 있는 간접 단서까지 찾아 가리고, 비밀번호와 인증 코드를 요구하는 메시지에는 답하지 않고 멈추어 알리는 실천 능력을 기르기 위해 설정하였다. 4단원 3차시 「개인정보 단서 가리기」에서는 포스터 도움을 구하는 채팅 초안에서 가릴 정보 묶음을 고르고 작업 조건만 남긴 요청으로 고쳐 「가리기 전후 안전 요청」을 작성하며, 화면 활동 「개인정보 스티커 붙이기」에서는 사진 속 내 얼굴, 이름표, 학교 로고, 집 번호를 눌러 가린 뒤 레이더 검사로 남은 단서를 확인한다. 4단원 4차시 「비밀번호와 인증 코드는 보내지 않기」에서는 인증 코드 요구에 거절과 화면 닫기와 알리기를 순서대로 수행하고 학교 공식 안내에서 복구 경로를 확인하며, 5차시의 사진 단서 점검과 9차시의 위험 요청 알리기로 같은 절차를 다른 상황에 넓혀 적용한다.',
  '[9인지04-02]':
    '이 성취기준은 불편한 화면을 만났을 때 멈추어 알리고 존중하는 표현으로 요청하며, 정해진 숫자를 지키기보다 자신의 몸 신호와 일정에 맞는 사용 계획을 세워 조절하려는 마음을 기르기 위해 설정하였다. 4단원 8차시 「멈출 시간을 함께 정하기」에서는 매일 30분처럼 모두에게 같은 숫자를 정하는 방법이 주말 가족 일정에서 곧바로 어긋나는 과정을 확인한 뒤, 알람이 울려도 다음 행동을 몰라 준비 시간을 놓쳤던 기록을 근거로 멈춤 신호와 종료 뒤 행동, 평일·주말 조정, 도움받을 사람을 담은 「개인 사용·휴식 계획」을 작성하며, 화면 활동 「멈춤 시계 쉼표」에서 화면 블록이 길게 이어지기 전에 쉼표를 끼운다. 4단원 6차시에서는 안전 덮개로 가려진 화면을 다시 읽지 않고 멈춤과 가리기와 거리두기와 알리기를 순서대로 연습하고, 7차시에서는 목적·행동·조건·존중 표현을 넣어 요청을 고치며, 10차시에서는 추천 게시물의 협찬 표시와 구매 링크와 과장을 찾아 자신의 필요·대안·예산과 비교하여 수용·보류·거절을 판단한다.',
  '[12인지04-01]':
    '이 성취기준은 글과 사진에 담긴 개인 식별 단서를 찾아 가리고, 자료를 쓴 사람과 게시 날짜를 지금 상황과 대조하여 근거로 쓸 자료를 가려내는 보안 역량을 기르기 위해 설정하였다. 4단원 2차시 「더 믿을 만한 자료 고르기」에서는 쓴 사람을 알 수 없는 캡처와 지난달 다른 행사의 우천 취소 공지와 오늘 담당 부서의 정상 운영 공지를 쓴 사람·날짜·원문 확인 가능성이라는 같은 기준으로 비교하여 출처 비교 카드를 작성하고, 1차시에서는 지난주 초안을 근거로 답한 인공지능의 시각과 오늘 게시된 최종 시간표를 대조하여 맞는 부분과 고칠 부분을 나눈다. 4차시에서는 인증 코드를 요구하는 메시지를 학교 홈페이지의 공식 도움 안내와 대조하여 진짜 도움 경로를 가려낸다. 3차시에서는 채팅 초안의 직접 단서와 간접 단서를 구분해 가리고 작업 조건만 남기며, 5차시 「사진을 보내기 전 살펴보기」에서는 이름표·교실 위치 표지·친구 얼굴·내일 일정표를 확인하고 유리창에 비친 얼굴과 교실 번호까지 살펴 그대로 보내기와 가리고 보내기와 보내지 않기 가운데 하나를 이유와 함께 결정한다.',
  '[12인지04-02]':
    '이 성취기준은 나의 정보와 함께 다른 사람의 정보와 동의를 존중하고, 디지털 공간에서 분명하고 존중하는 표현을 사용하며, 미디어 이용을 스스로 조절하려는 태도를 기르기 위해 설정하였다. 4단원 9차시 「이상한 요청을 어른에게 알리기」에서는 선물과 비밀과 만남을 요구하는 낯선 계정에 멈춤과 거절과 차단을 실행한 뒤 지금 알릴 사람과 그 사람이 안 될 때 알릴 다음 사람까지 적어 개인 도움망을 완성하고, 알리는 일이 고자질이 아니라 자기보호임을 확인한다. 8차시에서는 눈 피로와 놓친 포스터 정리 시간을 자기 멈춤 신호로 삼아 평일과 주말을 다르게 조정한 「개인 사용·휴식 계획」을 세우고, 7차시에서는 무례한 요청을 목적·행동·조건·존중 표현이 담긴 부탁으로 고쳐 친구에게 색종이를 빌리는 상황까지 넓히며, 6차시에서는 불편한 화면을 다시 열지 않고도 도움을 요청할 수 있음을 확인한다. 다른 사람의 얼굴과 동의를 다루는 5차시 활동은 이 성취기준이 아니라 [12인지04-01]로 태깅되어 있으므로 해설의 근거 차시로 인용하지 않는다.',

  // === 영역 5. 인공지능과 문제 해결 ===
  '[9인지05-01]':
    '이 성취기준은 「행사를 못 해」와 같은 막연한 표현을 지금 상태와 목표 상태로 갈라 놓고, 그 사이의 차이와 아직 모르는 정보를 찾아 해결 가능한 한 문장의 문제로 진술하도록 설정하였다. 교사는 5단원 1차시에서 부스 물품이 도착하지 않은 빈 설치 공간을 제시하고, 현재 상태·목표·아는 정보·모르는 정보·도움받을 사람·지금 할 행동의 여섯 칸으로 이루어진 「현재-목표-정보-행동 문제 정의 카드」를 기록 자료로 사용하며, 같은 차시의 격차에 다리 놓기 활동에서 현재와 목표 사이의 간격을 확인할 정보 조각으로 정확히 메우게 한다. 학생이 막막함만 표현할 때에는 지금 무엇이 있는지와 언제까지 무엇이 필요한지를 나누어 묻고, 8차시의 「목표-결과 검토표」에서 처음 조건표를 다시 펴 결과와 한 줄씩 대조하도록 하여 문제를 관찰 가능한 말로 다시 진술하게 한다.',
  '[9인지05-02]':
    '이 성취기준은 목표에 이르는 단계를 앞뒤 이유가 있는 순서로 배열하고, 필요한 만큼의 힌트를 받아 틀린 지점을 스스로 고쳐 보도록 설정하였다. 교사는 5단원 3차시의 모의 설치판에서 전원 위치 확인, 책상 고정, 장식 붙이기 카드를 다루게 하여 장식을 먼저 붙이면 전원선 통로가 막히는 장면을 확인시키고, 「이유 연결선이 있는 절차표」에 각 단계의 선행 조건과 안전 조건을 적게 한다. 틀린 순서를 곧바로 알려 주는 대신 5차시의 힌트 사다리에서 작은 단서, 과정 질문, 부분 예시, 완성 답 가운데 가장 작은 도움을 고르게 하고, 7차시에서는 한 단계를 실행한 뒤 완료 표시를 확인하고 다음 단계로 넘어가도록 지도한다.',
  '[12인지05-01]':
    '이 성취기준은 실생활 문제를 현재 상태와 목표 상태의 차이로 정의하고, 입력·처리·출력과 순차 실행으로 이어지는 절차의 개념을 이해하도록 설정하였다. 교사는 5단원 1차시에서 현재와 목표를 나눈 뒤 확인할 정보와 도움을 구분하여 문제 정의에 이르는 흐름을 짚어 주고, 8차시 「목표-결과 검토표」에서는 처음 조건표와 완성 결과를 나란히 놓아 같음·빠짐·다름을 표시하게 하며, 12차시 「문제 해결 지도」에서 현재·목표·정보와 작은 과제·순서·대안, 실행·확인·수정을 한 장으로 연결하게 한다. 문제와 해결 방법을 혼동하는 학생에게는 9차시의 사례처럼 프린터 사용은 방법이고 방문객에게 알리는 것이 목표임을 구분해 주어, 한 가지 방법이 막혀도 목표는 그대로 남는다는 점을 확인하게 한다.',
  '[12인지05-02]':
    '이 성취기준은 큰 과제를 따로 확인할 수 있는 작은 하위 과제로 나누고, 안전과 마감 같은 기준으로 먼저 할 일을 정하며, 힌트를 활용해 오류를 끝까지 고쳐 보도록 설정하였다. 교사는 5단원 2차시에서 「부스를 설치해」라는 한마디를 완성 구성도에 비추어 작은 과제로 나누게 하고 「과제 분해 보드」에 빠진 과제인 전원 안전 확인, 겹친 과제인 안내판 붙이기, 필요 없는 과제인 새 장식 구매를 표시하게 하며, 4차시에서는 전원선 정리·포스터 수정·간식 배치라는 동시 요청에 안전·마감·영향·도움 가능성 배지를 붙여 「먼저 할 일 판단표」를 작성하게 한다. 오류가 한꺼번에 나타나 당황하는 학생에게는 7차시처럼 한 단계만 실행하고 완료 표시를 확인한 뒤 다음으로 넘어가게 하며, 10차시 「오류 전후 테스트 기록」에 재현 조건, 오류 위치, 수정 내용, 다시 시험한 결과를 남기도록 지도한다.',

  // === 영역 6. 인공지능과 일상생활 ===
  '[9인지06-01]':
    '이 성취기준은 날씨, 이동, 금액처럼 오늘마다 달라지는 생활 정보를 인공지능의 한마디로 정하지 않고, 지역과 날짜가 적힌 공식 자료와 대조하여 확인하는 실생활 정보 활용 능력을 기르기 위해 설정하였다. 교사는 6단원 5차시(m6-l5)에서 지역과 날짜가 빠진 「따뜻해요」라는 답과 낮 14도·오후 비·강한 바람이 적힌 공식 예보 카드를 나란히 제시하여 준비물을 고르게 하고, 4차시(m6-l4)에서는 12번과 21번의 방향 표지·정류장·오늘 우회 공지를 한 줄씩 대조하게 하며, 3차시(m6-l3)에서는 고정 연습 지도의 횡단보도·공원 입구·파란 도서관 표지 순서로 경로를 확인하게 한다. 1차시(m6-l1)의 장보기 목록은 재고·가격·예산·알레르기와 항목별로 대조하고, 2차시(m6-l2)에서는 1,200×2+3,200 식을 계산기에 입력해 합계 5,600원과 거스름돈 4,400원을 검산하도록 지도하며, 화면의 가격·지도·교통·날씨 자료는 실제 서비스가 아닌 수업용 연습 예시임을 함께 안내한다.',
  '[9인지06-02]':
    '이 성취기준은 인공지능이 만들어 준 초안을 그대로 따르지 않고 자신의 몸 상태와 생활 조건에 맞게 고쳐 쓰려는 자주적인 태도를 기르기 위해 설정하였다. 교사는 6단원 7차시(m6-l7)에서 체험 여덟 개만 채운 아이미의 일정에 점심·휴식·도움 시간을 넣게 하고 비로 출발이 30분 늦어진 조건을 제시하여 학생이 스스로 계획을 다시 맞추게 하며, 6차시(m6-l6)에서는 학생이 칼을 쓰는 단계와 확인되지 않은 알레르기 재료를 직접 찾아 빼도록 지도한다. 9차시(m6-l9)의 도움 요청·거절·재설명 표현 만들기와 11차시(m6-l11)의 「내가 먼저 쓴 초안」 활동으로 마지막 결정이 학생 자신에게 있음을 반복 경험하게 하고, 지원 수준을 충분한 지원에서 중학, 고등으로 옮겨 가며 독립 수행의 비중을 점차 늘린다.',
  '[12인지06-01]':
    '이 성취기준은 금액, 이동, 일정, 음식 계획을 인공지능의 초안으로 시작하되 실제 조건과 대조하여 관리하고, 조건이 바뀌거나 오류가 드러났을 때 계획을 다시 세우는 대안 적용 역량을 기르기 위해 설정하였다. 교사는 6단원 2차시(m6-l2)에서 아이미가 말한 6,500원을 계산기 검산으로 5,600원과 거스름돈 4,400원으로 바로잡게 하고, 4차시(m6-l4)에서는 오늘 우회 공지를 근거로 12번 대신 21번을 고르되 헷갈리면 타기 전에 현장 직원 역할을 맡은 교사에게 확인하도록 지도한다. 대안 적용은 5차시(m6-l5)의 오후 비 시작 시간 변경, 7차시(m6-l7)의 출발 30분 지연과 도움 가능 시간 변경, 6차시(m6-l6)의 대체 과일마저 없는 상황에서 반복 연습하며, 학생이 무엇을 왜 고쳤는지 판단 기록에 남기게 한다.',
  '[12인지06-02]':
    '이 성취기준은 인공지능을 판단의 주인이 아니라 도구로 두고, 건강·소통·진로·자기소개처럼 자신을 드러내는 상황에서 제안을 수용·수정·거절하며 주체적인 생활 태도를 세우기 위해 설정하였다. 교사는 6단원 8차시(m6-l8)에서 아이미가 실제 진단을 단호히 거절하고 가까이 있는 믿을 만한 어른에게 먼저 알리도록 안내하는 장면을 다루고, 9차시(m6-l9)에서는 도움 요청·거절·재설명 표현을 말·글·그림 카드 중 학생이 편한 방식으로 만들게 하며, 10차시(m6-l10)에서는 사서를 책 정리로만 좁게 예상한 AI 답을 공식 자료 및 실제 직업인의 설명과 비교하게 한다. 11차시(m6-l11)에서는 학교명과 연락처를 넣자는 AI 제안을 거절하고 교실용과 온라인용 소개의 공개 범위를 다르게 정하게 한 뒤, 12차시(m6-l12) 「나의 AI 생활 포트폴리오」에서 마을 행사 하루 계획과 나의 생활 원칙 세 가지를 발표하도록 지도한다.',
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

      {/* 문서 차례 — 기본 교육과정 교과 문서가 갖추는 항목이 이 문서 어디에 있는지 먼저 밝힌다. */}
      <nav aria-label="교육과정 문서 차례" className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 depth-paper">
        <p className="text-sm font-extrabold text-slate-900">이 문서의 차례</p>
        <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs font-bold text-slate-800">
          {[
            { label: '1. 교육과정 제작 배경 및 개요', note: '학교 자율 교과로 만든 까닭' },
            { label: '2. 편제와 학년군 운영', note: '68차시 · 중학 9학년군 / 고등 12학년군' },
            { label: '3. 성격 및 목표', note: '가. 성격 · 나. 과목 목표' },
            { label: '4. 교육 내용', note: '가. 내용 체계 · 나. 단원별 핵심 내용' },
            { label: '5. 성취기준', note: '해설 · 성취수준 · 적용 시 고려 사항' },
            { label: '6. 교수·학습', note: '가. 방향 · 나. 방법' },
            { label: '7. 평가', note: '가. 방향 · 나. 방법' },
          ].map((entry) => (
            <li key={entry.label} className="rounded-xl bg-slate-50 border border-slate-200 p-3">
              <span className="block text-slate-900">{entry.label}</span>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-600">{entry.note}</span>
            </li>
          ))}
        </ol>
      </nav>

      {/* 1. 교육과정 제작 배경 및 개요 */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xl">📘</span>
          <h2 className="text-xl font-extrabold text-slate-900">1. 교육과정 제작 배경 및 개요</h2>
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
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-slate-900 leading-relaxed space-y-1.5">
            <p className="font-extrabold text-rose-950 flex items-center gap-1.5 text-sm">
              <span>⚠️</span> <span>성취기준 코드의 지위</span>
            </p>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
              본 과목의 <strong>[9인지00-00]·[12인지00-00]</strong> 코드는 거제애광학교가 자체 부여한 학교 자율 교과의 코드이며 <strong>국가 수준 성취기준이 아닙니다</strong>. 생활기록부·개별화교육계획에 기재할 때에는 학교 자율 교과의 성취기준임을 함께 밝히고, 국가 교육과정 코드와 혼동되지 않도록 표기합니다. 국가 기본 교육과정 교과와의 연계는 교사 모드의 <strong>연계 성취기준</strong> 탭에서 확인합니다.
            </p>
          </div>
        </div>
      </section>

      {/* 2. 편제와 학년군 운영 */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xl">🗂️</span>
          <h2 className="text-xl font-extrabold text-slate-900">2. 편제와 학년군 운영</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">총 차시</span>
            <p className="pt-2 font-bold text-slate-800 leading-relaxed">
              68차시 — 6개 영역 × 경험 중심 스튜디오 62차시 + 단원 마무리 포트폴리오 6차시
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-black text-sky-800 bg-sky-100 px-2 py-0.5 rounded">편성 방식</span>
            <p className="pt-2 font-bold text-slate-800 leading-relaxed">
              중학교와 고등학교가 같은 68차시를 공통으로 이수하되, 학년군별 성취기준으로 각각 평가합니다.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">운영 축</span>
            <p className="pt-2 font-bold text-slate-800 leading-relaxed">
              학생 화면의 지원 수준이 학년군 운영 축을 겸합니다. 중학은 9학년군, 고등은 12학년군 기준입니다.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                <th className="p-3 border-r border-slate-300 w-28 text-center">지원 수준</th>
                <th className="p-3 border-r border-slate-300 w-32">적용 학년군</th>
                <th className="p-3 border-r border-slate-300">평가 기준</th>
                <th className="p-3">운영 조건</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-medium">
              <tr className="bg-amber-50/40">
                <td className="p-3 border-r border-slate-300 text-center font-black text-amber-900">충분한 지원</td>
                <td className="p-3 border-r border-slate-300 text-slate-800">중·고 공통</td>
                <td className="p-3 border-r border-slate-300 text-slate-800">해당 학년군 성취수준의 <strong>하</strong>를 기준으로 봅니다.</td>
                <td className="p-3 text-slate-800">정보와 선택지를 줄이고 시각 단서와 직접 지원을 제공합니다.</td>
              </tr>
              <tr className="bg-sky-50/40">
                <td className="p-3 border-r border-slate-300 text-center font-black text-sky-900">중학</td>
                <td className="p-3 border-r border-slate-300 text-slate-800">중학교 1~3학년</td>
                <td className="p-3 border-r border-slate-300 text-slate-800"><strong>[9인지]</strong> 성취기준과 그 성취수준으로 평가합니다.</td>
                <td className="p-3 text-slate-800">준비된 AI 예시로 수업을 완결합니다. 실시간 AI 연결은 선택입니다.</td>
              </tr>
              <tr className="bg-emerald-50/40">
                <td className="p-3 border-r border-slate-300 text-center font-black text-emerald-900">고등</td>
                <td className="p-3 border-r border-slate-300 text-slate-800">고등학교 1~3학년</td>
                <td className="p-3 border-r border-slate-300 text-slate-800"><strong>[12인지]</strong> 성취기준과 그 성취수준으로 평가합니다.</td>
                <td className="p-3 text-slate-800">전이 단계에 <strong>고등 심화 과제</strong>가 추가로 나타납니다. 같은 이야기를 상황 복잡도·자료 수·독립성·전이 범위 중 하나 이상을 올려 다시 수행합니다.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1.5">
          <p className="font-extrabold text-slate-900">학교에서 확정할 사항</p>
          <ul className="list-inside list-disc space-y-1 font-medium leading-relaxed">
            <li>주당 배당 시간과 이수 학년 — 68차시를 몇 개 학년에 나누어 편성할지 학교교육과정위원회에서 정합니다.</li>
            <li>대체하거나 연계할 교과(군) — 선택 교과 시수 안에서 운영할지 학교자율시간으로 운영할지 정합니다.</li>
            <li>고등 심화 과제 중 교실 밖 수행이 지정된 차시의 인솔·안전 계획 — 단원마다 1~2차시에 지역사회 수행이 포함됩니다.</li>
          </ul>
          <p className="pt-1 text-slate-600">이 항목들은 학교 편성 권한에 속하므로 본 명세에서 값을 지정하지 않습니다.</p>
        </div>
      </section>

      {/* 3. 성격 및 목표 */}
      <section id="curriculum-goals" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xl">🎯</span>
          <h2 className="text-xl font-extrabold text-slate-900">3. 성격 및 목표</h2>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-extrabold text-indigo-900 text-base mb-1.5">가. 성격</h3>
            <p className="text-slate-700 leading-relaxed font-medium">
              <strong>'인공지능 활용'</strong> 과목은 일상에서 접하는 인공지능의 원리를 이해하고, 인공지능 기기와 소프트웨어의 활용법을 익혀 실생활 문제를 해결할 수 있는 능력을 기르는 선택 교과이다. 학생은 인공지능과의 상호작용 경험을 통해 정보의 가치와 사실 여부를 확인하고, 개인정보 보호 및 디지털 윤리를 실천하는 태도를 기른다.
            </p>
          </div>

          <div>
            <h3 className="font-extrabold text-indigo-900 text-base mb-2">나. 과목 목표</h3>
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

      {/* 4. 교육 내용 — 가. 내용 체계(영역별 핵심 아이디어와 내용 요소), 나. 단원별 핵심 내용 */}
      <section id="curriculum-contents" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-xl font-extrabold text-slate-900">4. 교육 내용</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">가. 내용 체계 · 나. 단원별 핵심 내용</span>
        </div>

        <div>
          <h3 className="font-extrabold text-indigo-900 text-base">가. 내용 체계</h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
            여섯 영역마다 핵심 아이디어를 두고, 지식·이해와 과정·기능, 가치·태도의 세 범주로 학년군별 내용 요소를 제시합니다.
          </p>
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

        {/* 나. 단원별 핵심 내용 — 한 단원이 어떤 내용을 어떤 차시 묶음으로 다루는지 밝힌다. */}
        <div className="space-y-4 border-t border-slate-200 pt-6">
          <div>
            <h3 className="font-extrabold text-indigo-900 text-base">나. 단원별 핵심 내용</h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              내용 체계의 요소가 실제로 어떤 차시 묶음에서 어떤 내용으로 다루어지는지 단원별로 밝힙니다. 차시 번호는 학생 화면의 차시와 같습니다.
            </p>
          </div>

          {MODULES.map((module) => {
            const core = MODULE_CORE_CONTENTS[module.id];
            const meta = AI_ACHIEVEMENT_STANDARDS[module.id];

            return (
              <div key={module.id} className="border-2 border-slate-200 rounded-2xl bg-slate-50/50 p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                  <h4 className="text-base font-black text-indigo-950 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-900 text-amber-300 text-xs font-black">
                      단원 {module.number}
                    </span>
                    <span>{module.title}</span>
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    영역 {meta.domainNumber}. {meta.domainName} · 전체 {module.lessonCount}차시
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {core.overview}
                </p>

                <ul className="divide-y divide-slate-200 border-t border-slate-200">
                  {core.items.map((item) => (
                    <li key={item.title} className="py-3">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <span className="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-black text-slate-900">
                          {item.lessonRange}
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-indigo-900">{item.title}</span>
                      </div>
                      <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                        {item.description}
                      </p>
                    </li>
                  ))}
                </ul>

                <p className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-slate-800 font-medium leading-relaxed">
                  <strong className="text-amber-950">단원 마무리 {module.lessonCount}차시 · </strong>
                  {core.closing}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. 성취기준 — 해설·성취수준·적용 시 고려 사항 (국가 교육과정 정식 해설 서술 구조) */}
      <section id="curriculum-standards" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-5">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📜</span>
            <h2 className="text-xl font-extrabold text-slate-900">
              5. 성취기준 (해설 · 성취수준 · 적용 시 고려 사항)
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
                    const levels = getAchievementLevels(s.code);

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

                        {/* (나) 성취수준 — 도달 정도 판정의 근거. 학습지 난이도와는 다른 축이다. */}
                        {levels ? (
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs sm:text-sm space-y-2">
                            <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                              <span>📏</span> <span>(나) 성취수준</span>
                            </p>
                            <div className="overflow-x-auto">
                              <table className="w-full min-w-[520px] border-collapse border border-slate-300 text-left text-xs">
                                <thead>
                                  <tr className="bg-slate-100 font-extrabold text-slate-900">
                                    <th className="w-16 border-r border-slate-300 p-2 text-center">수준</th>
                                    <th className="w-28 border-r border-slate-300 p-2">지원 정도</th>
                                    <th className="p-2">도달 기술</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-300 font-medium">
                                  {LEVEL_ORDER.map((key) => (
                                    <tr key={key} className={LEVEL_ROW_STYLE[key]}>
                                      <td className="border-r border-slate-300 p-2 text-center font-black text-slate-900">
                                        {ACHIEVEMENT_LEVEL_LABELS[key]}
                                      </td>
                                      <td className="border-r border-slate-300 p-2 font-bold text-slate-700">
                                        {ACHIEVEMENT_LEVEL_SUPPORT[key]}
                                      </td>
                                      <td className="p-2 leading-relaxed text-slate-800">{levels[key]}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <p className="font-bold text-slate-600">
                              관찰 차시: {levels.anchorLessons.join(', ')}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>

                {/* (나) 적용 시 고려 사항 (특수교육 맞춤 지원) */}
                <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200/80 text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <p className="font-extrabold text-sky-900 flex items-center gap-1.5">
                    <span>♿</span> <span>(다) 적용 시 고려 사항 (거제애광학교 맞춤 지원)</span>
                  </p>
                  <ul className="list-inside list-disc space-y-1 text-slate-800 font-medium pl-2 leading-relaxed text-xs">
                    <li>
                      장애 정도나 표현 능력에 따라 보완대체의사소통(AAC) 카드, 낱말 고르기 상자, 음성 입출력을 지원한다.
                    </li>
                    <li>
                      복잡한 과제는 한 번에 지시하지 않고 1~3단계의 작은 하위 단계로 나누어 시각적 힌트와 함께 제공한다.
                    </li>
                    <li>
                      기본 수업은 준비된 비실시간 예시 데이터로 진행하여 카메라·마이크 권한 없이 완결한다.
                    </li>
                    <li>
                      교사가 실시간 AI를 연결한 경우에는 학생이 보낸 질문·음성·사진이 외부 사업자 서버로 전송되므로, 보호자 동의를 받고 얼굴·이름·연락처 등 개인식별 정보를 제거한 것을 확인한 뒤에만 사용한다.
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. 교수·학습 — 방향과 방법을 (가)(나)(다)… 항목으로 나누어 서술한다. */}
      <section id="curriculum-teaching" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">👩‍🏫</span>
            <h2 className="text-xl font-extrabold text-slate-900">6. 교수·학습</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">가. 방향 · 나. 방법</span>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-indigo-900 text-base">가. 교수·학습의 방향</h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <NumberedItems items={TEACHING_DIRECTIONS} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-indigo-900 text-base">나. 교수·학습 방법</h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <NumberedItems items={TEACHING_METHODS} />
          </div>
        </div>
      </section>

      {/* 7. 평가 */}
      <section id="curriculum-assessment" className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 depth-paper space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h2 className="text-xl font-extrabold text-slate-900">7. 평가</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">가. 방향 · 나. 방법</span>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-indigo-900 text-base">가. 평가의 방향</h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <NumberedItems items={ASSESSMENT_DIRECTIONS} />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-indigo-900 text-base">나. 평가 방법</h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <NumberedItems items={ASSESSMENT_METHODS} />
          </div>
        </div>
      </section>

    </div>
  );
}
