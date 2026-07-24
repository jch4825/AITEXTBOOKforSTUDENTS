import React from 'react';
import type { CanonicalLessonDesign, SupportLevel } from '../../data/canonicalLessons/types';
import { useCanonicalLessonSession } from './useCanonicalLessonSession';
import { LessonStageRenderer } from './LessonStageRenderer';
import { LessonArtifactBuilder } from './LessonArtifactBuilder';
import { LessonEvidencePanel } from './LessonEvidencePanel';
import { LessonAsset } from './LessonAsset';

interface ProjectLessonViewProps {
  lesson: CanonicalLessonDesign;
  supportLevel: SupportLevel;
  onFinish?: () => void;
}

export const ProjectLessonView: React.FC<ProjectLessonViewProps> = ({
  lesson,
  supportLevel,
  onFinish,
}) => {
  const session = useCanonicalLessonSession({ lesson, supportLevel });

  const currentStage = session.currentStage;
  const currentAssets = lesson.assets.filter(a => currentStage.assetIds.includes(a.id));

  const handleNext = () => {
    if (session.stageIndex < session.totalStages - 1) {
      session.goToNextStage();
    } else {
      const ok = session.completeSession();
      if (!ok && !session.isCompleted()) {
        alert('프로젝트를 완수하려면 필수 필드와 새 통합 과제 응답이 필요합니다.');
        return;
      }
      onFinish?.();
    }
  };

  return (
    <div className="w-full max-w-[min(96vw,110rem)] 2xl:max-w-[min(94vw,148rem)] 3xl:max-w-[min(92vw,175rem)] mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-0.5 rounded-full bg-amber-400 text-amber-950 text-xs font-black uppercase">
              모듈 마무리 프로젝트
            </span>
            <span className="text-xs text-purple-200 font-semibold">{lesson.moduleId.toUpperCase()} - 프로젝트</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">{lesson.title}</h1>
        </div>

        <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 max-w-md">
          <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">프로젝트 목표</div>
          <p className="text-xs font-semibold text-white">{lesson.masterObjective}</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
              <span>프로젝트 참고 자료</span>
              <span>단계 {session.stageIndex + 1} / {session.totalStages}</span>
            </div>

            {currentAssets.length > 0 ? (
              <div className="space-y-3">
                {currentAssets.map(asset => (
                  <LessonAsset key={asset.id} asset={asset} />
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                프로젝트 시나리오를 참고하여 최종 통합 과제를 완성하세요.
              </div>
            )}
          </div>

          <LessonEvidencePanel
            responses={session.responses}
            artifactFields={session.artifactFields}
          />
        </div>

        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <LessonStageRenderer
            stage={currentStage}
            supportLevel={supportLevel}
            onRecordResponse={session.recordResponse}
            savedResponse={session.responses[currentStage.id]}
          />

          <LessonArtifactBuilder
            artifact={lesson.artifact}
            fieldsData={session.artifactFields}
            onRecordField={session.recordArtifactField}
          />

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={session.goToPrevStage}
              disabled={session.stageIndex === 0}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-100 disabled:opacity-40 text-slate-700 text-xs font-bold transition hover:bg-slate-200"
            >
              ← 이전 단계
            </button>
            <button
              onClick={handleNext}
              className="min-h-[44px] px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-sm"
            >
              {session.stageIndex < session.totalStages - 1 ? '다음 단계 →' : '프로젝트 완료 🎓'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
