import React, { useState } from 'react';
import { AI_ACHIEVEMENT_STANDARDS } from '../../data/aiAchievementStandards';
import { MODULES } from '../../data/modules';

export default function TeacherCurriculumGuide() {
  const [activeSchoolLevel, setActiveSchoolLevel] = useState<'middle' | 'high'>('middle');

  return (
    <div className="space-y-6 text-slate-800">
      {/* Subject Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 md:p-8 text-white shadow-xl border border-indigo-900/50">
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
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
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
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
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
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-xl font-extrabold text-slate-900">2. 영역별 내용 체계</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">6개 영역별 핵심 아이디어 & 범주별 내용 요소</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          '인공지능 활용' 과목의 6개 영역별로 <strong>핵심 아이디어(1~2개)</strong>를 제시하고, <strong>범주(지식·이해, 과정·기능, 가치·태도)</strong>에 따른 <strong>중학교(1~3학년) 및 고등학교(1~3학년) 내용 요소</strong>를 명세화한 내용 체계입니다.
        </p>

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

      {/* 4. 영역별 성취기준, 해설 및 적용 시 고려 사항 */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
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
                className="border-2 border-slate-200 rounded-2xl p-5 md:p-6 bg-slate-50/50 space-y-4"
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

                {/* Achievement Standard Box */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <p className="text-xs font-extrabold text-indigo-900">
                    📌 [{activeSchoolLevel === 'middle' ? '중학교 1~3학년' : '고등학교 1~3학년'}] 성취기준 명세
                  </p>
                  <ul className="space-y-2">
                    {standardsList.map((s) => (
                      <li key={s.code} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 flex items-start gap-2">
                        <span className="shrink-0 px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-xs font-black">
                          {s.code}
                        </span>
                        <span className="leading-relaxed">{s.statement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* (가) 성취기준 해설 */}
                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-slate-800 space-y-1">
                  <p className="font-extrabold text-amber-900 flex items-center gap-1.5">
                    <span>💡</span> <span>(가) 성취기준 해설</span>
                  </p>
                  <p className="text-slate-800 font-medium leading-relaxed pl-5">
                    {meta.domainNumber === 1 &&
                      '이 성취기준은 인공지능이 사람이 준 데이터를 기반으로 작동함을 이해하고, 생성된 답변의 그럴듯한 오류(환각)를 실제 식단표나 안내문 등 원본 정보와 대조하여 스스로 검증하고 수정하는 기초 소양을 기르기 위해 설정하였다.'}
                    {meta.domainNumber === 2 &&
                      '이 성취기준은 구체적인 명칭, 종류, 개수 및 조건과 예시를 포함하여 인공지능에게 요청할 때 원하는 대답의 품질이 향상됨을 경험하고, 오해가 생긴 답변에 필요한 정보를 더해 다시 요청하는 소통 능력을 기르기 위해 설정하였다.'}
                    {meta.domainNumber === 3 &&
                      '이 성취기준은 학습 과정에서 인공지능을 설명 보조 및 요약 도구로 활용하되, 인공지능에 무비판적으로 의존하지 않고 얻은 설명을 내 말로 다시 정리하며 주도적으로 공부하는 습관을 기르기 위해 설정하였다.'}
                    {meta.domainNumber === 4 &&
                      '이 성취기준은 사진이나 글을 인공지능에 입력하기 전 개인식별 단서를 찾아 가리고, 비밀번호 요구나 불편한 글 등 디지털 위험 신호 발생 시 올리기를 멈추고 도움을 요청하는 디지털 안전 행동을 실천하기 위해 설정하였다.'}
                    {meta.domainNumber === 5 &&
                      '이 성취기준은 인공지능으로 해결할 문제의 현재 상태와 목표 상태를 파악하고, 필요한 순서를 정해 힌트를 활용하며 오류를 포기하지 않고 차근차근 수정하는 컴퓨팅 사고 능력을 기르기 위해 설정하였다.'}
                    {meta.domainNumber === 6 &&
                      '이 성취기준은 일상생활 및 지역사회(날씨, 급식, 버스, 키오스크, 스마트홈)에서 인공지능 도구를 스스로 활용하여 필요한 정보를 확인하고, 자신의 자립 생활을 도모하는 태도를 기르기 위해 설정하였다.'}
                  </p>
                </div>

                {/* (나) 성취기준 적용 시 고려 사항 (특수교육 현장 맞춤) */}
                <div className="bg-sky-50/70 p-4 rounded-xl border border-sky-200/80 text-xs sm:text-sm text-slate-800 space-y-1.5">
                  <p className="font-extrabold text-sky-900 flex items-center gap-1.5">
                    <span>♿</span> <span>(나) 성취기준 적용 시 고려 사항 (거제애광학교 맞춤 지원)</span>
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
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
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
