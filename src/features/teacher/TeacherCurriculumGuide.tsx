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

      {/* 3. 내용 체계 */}
      <section className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h2 className="text-xl font-extrabold text-slate-900">2. 내용 체계</h2>
          </div>
          <span className="text-xs font-bold text-slate-500">6개 핵심 영역 체계 ('인공지능 활용')</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                <th className="p-3 border-r border-slate-300 w-24">영역</th>
                <th className="p-3 border-r border-slate-300">핵심 아이디어</th>
                <th className="p-3 border-r border-slate-300 w-28">범주</th>
                <th className="p-3 border-r border-slate-300">중학교 (1~3학년) 내용 요소</th>
                <th className="p-3">고등학교 (1~3학년) 내용 요소</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 font-medium">
              {Object.values(AI_ACHIEVEMENT_STANDARDS).map((meta) => (
                <tr key={meta.moduleId} className="hover:bg-slate-50">
                  <td className="p-3 border-r border-slate-300 font-extrabold text-indigo-900 bg-slate-50/50">
                    {meta.domainNumber}. {meta.domainName}
                  </td>
                  <td className="p-3 border-r border-slate-300 text-slate-700 leading-relaxed">
                    {meta.domainNumber === 1 && '인공지능은 사람이 제공한 데이터를 바탕으로 결과를 생성하며, 생성된 정보는 사실 검증이 필요하다.'}
                    {meta.domainNumber === 2 && '구체적인 명칭, 조건, 예시를 포함하여 인공지능과 대화할 때 원하는 결과를 효과적으로 얻을 수 있다.'}
                    {meta.domainNumber === 3 && '인공지능은 모르는 개념이나 학습 내용을 탐구하는 도구이며, 인간의 주도적 생각이 중심이 되어야 한다.'}
                    {meta.domainNumber === 4 && '개인정보를 보호하고 위험 신호를 차단하며 타인을 존중하는 안전한 디지털 윤리를 실천한다.'}
                    {meta.domainNumber === 5 && '문제의 현재와 목표 상태를 파악하고 절차에 따라 순서를 정하여 힌트를 활용해 문제 해결 능력을 기른다.'}
                    {meta.domainNumber === 6 && '일상생활 및 지역사회에서 인공지능 서비스를 활용하여 주체적이고 독립적인 자립 생활을 이룬다.'}
                  </td>
                  <td className="p-3 border-r border-slate-300 font-bold bg-slate-50/30">
                    <div className="space-y-3 py-1">
                      <span className="block text-amber-800">지식·이해</span>
                      <span className="block text-sky-800">과정·기능</span>
                      <span className="block text-emerald-800">가치·태도</span>
                    </div>
                  </td>
                  <td className="p-3 border-r border-slate-300 leading-relaxed">
                    <div className="space-y-1.5">
                      <p>• 인공지능의 대답 생성 방식 알아보기</p>
                      <p>• 인공지능 대답과 실제 자료 비교하기</p>
                      <p>• 사실 확인하는 마음 가지기</p>
                    </div>
                  </td>
                  <td className="p-3 leading-relaxed">
                    <div className="space-y-1.5">
                      <p>• 인공지능 데이터 생성 원리 이해하기</p>
                      <p>• 환각 오류 탐색 및 대조 수정하기</p>
                      <p>• 직접 검증하고 사용 지침 만들기</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
