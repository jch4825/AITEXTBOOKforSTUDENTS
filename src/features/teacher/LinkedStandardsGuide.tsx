import React, { useState } from 'react';
import { ALL_LESSONS } from '../../data/lessons';
import { MODULES } from '../../data/modules';

export interface LinkedStandardCategory {
  subject: string;
  subjectCode: string;
  badgeColor: string;
  description: string;
  standards: {
    code: string;
    statement: string;
    targetModules: string[];
    guidanceNote: string;
  }[];
}

export const LINKED_STANDARDS_DATA: LinkedStandardCategory[] = [
  {
    subject: '정보통신활용 (정통)',
    subjectCode: '정통',
    badgeColor: 'bg-indigo-900 text-amber-300 border-indigo-700',
    description: '2022 개정 특수교육 기본 교육과정 정보통신활용 과목의 기기 조작, 정보 검색, 디지털 윤리, 소프트웨어 및 인공지능 탐색 성취기준과의 직결 연계입니다.',
    standards: [
      {
        code: '[9정통01-01]',
        statement: '정보통신의 의미를 이해하고, 다양한 형태와 방법으로 제공되는 정보를 살펴본다.',
        targetModules: ['m1', 'm3', 'm4'],
        guidanceNote: 'AI가 제공하는 문자·음악·그림 등 다양한 형태의 응답 정보를 살펴보고 원본 자료와 대조하는 활동으로 연계 지도합니다.',
      },
      {
        code: '[9정통01-04]',
        statement: '필요한 정보를 수집하고, 타인과 정보를 주고받는다.',
        targetModules: ['m2', 'm3', 'm4'],
        guidanceNote: '원하는 결과를 위해 인공지능에게 필요한 정보를 전달하고, 학급 친구들과 프롬프트 결과를 공유하는 활동으로 연계됩니다.',
      },
      {
        code: '[9정통02-02]',
        statement: '인터넷 검색을 통해 목적에 따라 필요한 정보를 찾는다.',
        targetModules: ['m3', 'm5'],
        guidanceNote: '인공지능의 대답 중 불확실한 낱말이나 공지사항을 인터넷 검색을 통해 확인하고 검증하는 문해력 지도와 연계됩니다.',
      },
      {
        code: '[9정통02-03]',
        statement: '순차, 선택, 반복 구조를 통해 문제 해결 과정을 탐색한다.',
        targetModules: ['m5'],
        guidanceNote: '문제 해결 단원(Module 5)에서 힌트 카드 받아보기, 조건 변경에 따른 결과 확인 등 소프트웨어 컴퓨팅 사고 절차와 연계합니다.',
      },
      {
        code: '[9정통02-04]',
        statement: '인공지능에 대해 관심을 기울이고, 생활 속 인공지능의 다양한 사례를 탐색한다.',
        targetModules: ['m1', 'm6'],
        guidanceNote: '1단원(아이미 탐구) 및 6단원(일상 생활 자립) 전반에서 스피커, 번역기, 로봇청소기 등 생활 속 AI 기기 탐색 활동으로 직결됩니다.',
      },
      {
        code: '[9정통03-01]',
        statement: '디지털 공간에서 올바른 예절을 익혀 실천한다.',
        targetModules: ['m4'],
        guidanceNote: '4단원(안전과 윤리)에서 AI 및 온라인 대화 시 고운 말 사용하기, 타인 존중하기 등의 디지털 예절 지도와 연계됩니다.',
      },
      {
        code: '[9정통03-02]',
        statement: '개인 정보 보호의 중요성을 알고, 안전하게 관리하는 습관을 기른다.',
        targetModules: ['m4'],
        guidanceNote: '사진이나 글을 입력할 때 얼굴·이름·비밀번호 등 개인식별 단서를 찾아 가리는 실천 활동으로 연계됩니다.',
      },
      {
        code: '[12정통02-03]',
        statement: '생활 속 다양한 문제 해결 상황을 인식하고, 문제 해결 절차를 구성한다.',
        targetModules: ['m5'],
        guidanceNote: '고등학교 단계의 문제 해결 절차 설계 및 오류 수정(디버깅) 경험 스튜디오와 연계 지도합니다.',
      },
      {
        code: '[12정통02-04]',
        statement: '일상생활에서 인공지능 기기를 활용하여 생활의 편리함을 경험한다.',
        targetModules: ['m1', 'm6'],
        guidanceNote: '키오스크, 버스 일정, 날씨 및 스마트홈 기능을 활용하여 자립 생활을 계획하고 실행하는 활동으로 연계됩니다.',
      },
      {
        code: '[12정통03-01]',
        statement: '디지털 윤리를 이해하고, 디지털 공간에서 타인을 존중하고 배려하는 태도를 기른다.',
        targetModules: ['m4'],
        guidanceNote: '디지털 공간에서의 책임감 있는 정보 이용 및 상호 존중 태도를 함양하는 4단원 안전 윤리 활동과 연계됩니다.',
      },
      {
        code: '[12정통03-02]',
        statement: '디지털 중독 및 디지털 범죄 사례를 살펴보고, 예방하는 방법을 실천한다.',
        targetModules: ['m4'],
        guidanceNote: '위험한 피싱·광고 요청 발생 시 행동 멈춤, 어른에게 도움 알림, 미디어 사용 시간 조절 실천으로 연계됩니다.',
      },
      {
        code: '[12정통03-04]',
        statement: '디지털 사회에서의 다양한 직업을 탐색하고 체험한다.',
        targetModules: ['m6'],
        guidanceNote: 'AI 안내원, 스마트 농부, 데이터 관리자 등 인공지능 전환에 따른 미래 직업 탐색 스튜디오와 연계됩니다.',
      },
    ],
  },
  {
    subject: '국어',
    subjectCode: '국어',
    badgeColor: 'bg-emerald-900 text-emerald-200 border-emerald-700',
    description: '질문하기, 대답하기, 대화 예절 준수, 핵심 낱말 정리 등 국어과 의사소통 및 언어 생활 성취기준과의 연계입니다.',
    standards: [
      {
        code: '[6국어01-04]',
        statement: '묻는 말의 의미를 이해하여 적절한 질문과 대답을 한다.',
        targetModules: ['m2', 'm3'],
        guidanceNote: '인공지능에게 질문을 건네고 AI의 대답에 포함된 핵심 내용을 파악하는 기초 대화 언어 활동으로 연계됩니다.',
      },
      {
        code: '[9국어01-04]',
        statement: '대화 예절을 지키며 상대방의 말에 적절한 질문과 대답으로 대화를 이어 간다.',
        targetModules: ['m2', 'm5', 'm6'],
        guidanceNote: '상대방의 오해를 줄이기 위해 명확한 조건과 예시를 더해 대화를 재구성하는 의사소통 기능 지도와 연계됩니다.',
      },
    ],
  },
  {
    subject: '수학',
    subjectCode: '수학',
    badgeColor: 'bg-amber-900 text-amber-200 border-amber-700',
    description: '화폐 교환, 수량 계산, 비교 판단 등 실생활 수학 교과 성취기준과의 연계입니다.',
    standards: [
      {
        code: '[9수학01-14]',
        statement: '대용 화폐를 활용하여 상품을 교환한다.',
        targetModules: ['m3', 'm6'],
        guidanceNote: '키오스크 주문 및 장보기 스튜디오에서 화폐 수량 교환 및 계산 힌트를 활용하는 수학 활동과 연계됩니다.',
      },
      {
        code: '[12수학01-14]',
        statement: '실생활의 다양한 상황에서 필요한 화폐를 활용한다.',
        targetModules: ['m3', 'm6'],
        guidanceNote: '고등학교 생활 수학 과정에서 AI 추천 예산에 따라 실제 금액을 계산하고 합리적으로 선택하는 활동과 연계됩니다.',
      },
    ],
  },
  {
    subject: '사회',
    subjectCode: '사회',
    badgeColor: 'bg-sky-900 text-sky-200 border-sky-700',
    description: '의사결정, 물건 선택, 자기 결정권 존중 등 사회과 기본 자립 생활 성취기준과의 연계입니다.',
    standards: [
      {
        code: '[6사회01-02]',
        statement: '일상생활에서 활동이나 물건을 선택하고 나의 선택을 중요하게 여기는 태도를 기른다.',
        targetModules: ['m6'],
        guidanceNote: 'AI가 제시한 여러 식단/교통 선택지 중 자신이 좋아하는 항목을 주체적으로 선택하는 자기 결정성 지도와 연계됩니다.',
      },
    ],
  },
  {
    subject: '진로와 직업',
    subjectCode: '진로',
    badgeColor: 'bg-purple-900 text-purple-200 border-purple-700',
    description: '지역사회 이동, 직업 탐색, 일상생활 자립 등 진로와 직업 교과 성취기준과의 연계입니다.',
    standards: [
      {
        code: '[9진로02-02]',
        statement: '직업의 세계에 관심을 가지고 가족, 이웃 등 주변 사람들의 직업에 대하여 탐색한다.',
        targetModules: ['m6'],
        guidanceNote: '마을 일터 및 주변 사회에서 인공지능 기기가 도입된 직업 현장을 알아보고 탐색하는 진로 교육과 연계됩니다.',
      },
      {
        code: '[12진로04-03]',
        statement: '집에서 직장까지 교통 수단을 활용하여 이동한다.',
        targetModules: ['m6'],
        guidanceNote: '버스 도착 시간 확인, 이동 경로 검색 AI 도구를 활용하여 스스로 이동 계획을 세우는 진로 자립과 연계됩니다.',
      },
    ],
  },
  {
    subject: '보건',
    subjectCode: '보건',
    badgeColor: 'bg-rose-900 text-rose-200 border-rose-700',
    description: '교통 안전, 디지털 기기 사용 시간 조절, 안전 수칙 준수 등 보건 교과 성취기준과의 연계입니다.',
    standards: [
      {
        code: '[9보건04-03]',
        statement: '교통사고의 위험 요인을 알고 사고 예방을 위한 안전 수칙을 실천한다.',
        targetModules: ['m6'],
        guidanceNote: '이동 중 스마트폰 화면만 보지 않기, 길건널 때 신호 지키기 등 보건 안전 수칙 실천 활동과 연계됩니다.',
      },
    ],
  },
];

export default function LinkedStandardsGuide() {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');

  const filteredCategories = LINKED_STANDARDS_DATA.filter((cat) => {
    if (selectedSubject !== 'all' && cat.subjectCode !== selectedSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 p-6 md:p-8 text-white shadow-xl border border-indigo-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-sky-400 text-slate-950 mb-2">
              거제애광학교 '인공지능 활용' 과목 융합
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-300 tracking-tight">
              타 교과 연계 성취기준 지도 가이드
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              거제애광학교 제작 '인공지능 활용' 선택 교과와 기본 교육과정 타 교과(정보통신활용, 국어, 수학, 사회, 진로와 직업, 보건) 성취기준 간의 차시별 융합 수업 연계 지도 안내입니다.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-6 pt-5 border-t border-indigo-800/80 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs font-extrabold text-indigo-300 shrink-0 mr-1">교과 필터:</span>
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedSubject === 'all'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800'
              }`}
            >
              전체 교과 (6개)
            </button>
            {LINKED_STANDARDS_DATA.map((cat) => (
              <button
                key={cat.subjectCode}
                type="button"
                onClick={() => setSelectedSubject(cat.subjectCode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedSubject === cat.subjectCode
                    ? 'bg-amber-400 text-slate-950 font-black'
                    : 'bg-indigo-900/80 text-indigo-200 hover:bg-indigo-800'
                }`}
              >
                {cat.subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Linked Standards Cards per Subject */}
      <div className="space-y-6">
        {filteredCategories.map((cat) => (
          <section key={cat.subjectCode} className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-black border ${cat.badgeColor}`}>
                  {cat.subject}
                </span>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {cat.subject} 연계 성취기준
                </h2>
              </div>
              <span className="text-xs font-extrabold text-slate-500">
                총 {cat.standards.length}개 성취기준 연계
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              💡 <strong>교과 연계 개요:</strong> {cat.description}
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {cat.standards.map((s) => {
                const targetModuleTitles = s.targetModules
                  .map((mId) => MODULES.find((m) => m.id === mId)?.title)
                  .filter(Boolean);

                return (
                  <div key={s.code} className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded bg-slate-900 text-amber-300 font-mono text-xs font-black">
                          {s.code}
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-900">
                          {cat.subject}
                        </span>
                      </div>
                      <p className="font-extrabold text-sm text-slate-900 leading-snug">
                        {s.statement}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-indigo-900">🔗 연동 AI 단원: </span>
                        <span className="font-semibold text-slate-700">
                          {targetModuleTitles.join(', ')}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200/70 text-slate-800 leading-relaxed font-medium">
                        <span className="font-bold text-amber-900">👨‍🏫 융합 수업 팁: </span>
                        {s.guidanceNote}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
