import React from 'react';
import type { CanonicalLessonDesign, SupportLevel } from '../../data/canonicalLessons/types';
import { useCanonicalLessonSession } from './useCanonicalLessonSession';
import { LessonStageRenderer } from './LessonStageRenderer';
import { LessonArtifactBuilder } from './LessonArtifactBuilder';
import { LessonEvidencePanel } from './LessonEvidencePanel';
import { LessonAsset } from './LessonAsset';
import { TransferPrompt } from '../../components/activities/TransferPrompt';

interface GuidedLessonViewProps {
  lesson: CanonicalLessonDesign;
  supportLevel: SupportLevel;
  onFinish?: () => void;
}

export const GuidedLessonView: React.FC<GuidedLessonViewProps> = ({
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
      session.completeSession();
      onFinish?.();
    }
  };

  return (
    <div className="w-full max-w-[min(96vw,110rem)] 2xl:max-w-[min(94vw,148rem)] 3xl:max-w-[min(92vw,175rem)] mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold uppercase">
              개념+안내 연습
            </span>
            <span className="text-xs text-slate-500 font-semibold">{lesson.moduleId.toUpperCase()} - 레슨 {lesson.number}</span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">{lesson.title}</h1>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 max-w-md">
          <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-0.5">오늘의 목표</div>
          <p className="text-xs font-semibold text-amber-950">{lesson.masterObjective}</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Asset & Evidence */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
              <span>개념 및 활동 자료</span>
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
                자료를 확인하고 오른쪽 활동을 진행하세요.
              </div>
            )}
          </div>

          <LessonEvidencePanel
            responses={session.responses}
            artifactFields={session.artifactFields}
          />
        </div>

        {/* Right Side: Stage Renderer & Artifact */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-6">
          <LessonStageRenderer
            stage={currentStage}
            supportLevel={supportLevel}
            onRecordResponse={session.recordResponse}
            savedResponse={session.responses[currentStage.id]}
          />

          {session.stageIndex === session.totalStages - 2 && (
            <LessonArtifactBuilder
              artifact={lesson.artifact}
              fieldsData={session.artifactFields}
              onRecordField={session.recordArtifactField}
            />
          )}

          {session.stageIndex === session.totalStages - 1 && (
            <TransferPrompt
              transfer={lesson.transfer}
              onCompleteTransfer={resp => session.setTransferResponse(resp)}
            />
          )}

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
              className="min-h-[44px] px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
            >
              {session.stageIndex < session.totalStages - 1 ? '다음 단계 →' : '차시 완료 🎉'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
