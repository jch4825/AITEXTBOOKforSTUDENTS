import React from 'react';
import { ArrowRight, BookOpen, FolderOpen, Wrench } from 'lucide-react';
import { DiagnosticPurpose, Persona } from '../../types';

const personaCopy: Record<Persona, { title: string; body: string; bullets: string[]; primaryLabel: string; moduleId?: string; primaryAction: 'module' | 'tools' | 'resources' }> = {
  novice: {
    title: '천천히 시작하면 됩니다',
    body: 'AI를 처음 만나는 분을 위해 모듈 0부터 권해드립니다.',
    bullets: ['마우스로 따라 하는 5분 단위 흐름', '글자 크기를 크게 자동 설정', 'API 같은 어려운 단계는 천천히'],
    primaryLabel: '모듈 0부터 시작하기',
    moduleId: 'm0',
    primaryAction: 'module',
  },
  newbie: {
    title: '기초부터 차분하게',
    body: '모듈 1에서 LLM의 기본 개념을 잡고 바로 수업 적용으로 넘어가세요.',
    bullets: ['모듈 1 -> 2 -> 3 순서 추천', '학습 직후 수업 지원안에 적용 가능'],
    primaryLabel: '모듈 1 시작하기',
    moduleId: 'm1',
    primaryAction: 'module',
  },
  lead: {
    title: '적용과 확산을 목표로',
    body: '기초는 충분합니다. 모듈 2부터 모듈 5까지 실제 업무 흐름과 윤리 점검 중심으로 보세요.',
    bullets: ['프롬프트, 수업 적용, 행정 자동화 추천', 'AI 윤리와 현명한 사용(모듈 5) 함께 확인', '모듈 1은 사이드바를 통해 언제든 접근 가능'],
    primaryLabel: '모듈 2 시작하기',
    moduleId: 'm2',
    primaryAction: 'module',
  },
  expert: {
    title: '자료부터 바로 가져가세요',
    body: '이미 충분히 익숙하시다면 자료실에서 수업·행정 템플릿을 즉시 활용하세요. AI 윤리 모듈(모듈 5)도 함께 살펴보시길 권합니다.',
    bullets: ['수업·행정 템플릿 즉시 다운로드', '모듈은 필요한 부분만 골라 보기', 'AI 윤리와 현명한 사용(모듈 5) 추천'],
    primaryLabel: '자료실 바로 가기',
    primaryAction: 'resources',
  },
};

const purposeCopy: Partial<Record<DiagnosticPurpose, string>> = {
  class: '수업 적용 사례는 모듈 3에 모여 있습니다.',
  admin: '행정 자동화는 모듈 4에서 다룹니다.',
  share: '동료 연수 자료는 자료실에서 바로 확인할 수 있습니다.',
  ethics: '인공지능 윤리 및 안전 교육은 모듈 5에서 할루시네이션, 편향, 프라이버시, 저작권, 학생 지도 원칙까지 함께 다룹니다.',
};

interface PersonaRecommendCardProps {
  persona: Persona;
  purpose: DiagnosticPurpose;
  onStartModule: (moduleId: string) => void;
  onOpenTools: () => void;
  onOpenResources: () => void;
}

export default function PersonaRecommendCard({ persona, purpose, onStartModule, onOpenTools, onOpenResources }: PersonaRecommendCardProps) {
  const copy = personaCopy[persona];
  const Icon = persona === 'expert' ? FolderOpen : persona === 'lead' ? Wrench : BookOpen;

  const handlePrimary = () => {
    if (copy.primaryAction === 'module' && copy.moduleId) {
      onStartModule(copy.moduleId);
    } else if (copy.primaryAction === 'resources') {
      onOpenResources();
    } else {
      onOpenTools();
    }
  };

  return (
    <div className="rounded-xl border border-canva-border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-canva-purple/10 text-canva-purple">
          <Icon size={18} />
        </span>
        <h2 className="text-lg font-black text-canva-ink">{copy.title}</h2>
      </div>
      <p className="text-sm font-medium leading-6 text-canva-gray">{copy.body}</p>
      <ul className="mt-4 space-y-2 text-sm text-canva-ink">
        {copy.bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-canva-teal" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
      {purposeCopy[purpose] && (
        <p className="mt-4 rounded-lg bg-canva-bg px-3 py-2 text-xs font-bold text-canva-gray">
          {purposeCopy[purpose]}
        </p>
      )}
      <button
        type="button"
        onClick={handlePrimary}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-canva-purple px-4 py-3 text-sm font-extrabold text-white hover:bg-canva-purple/90"
      >
        {copy.primaryLabel}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
