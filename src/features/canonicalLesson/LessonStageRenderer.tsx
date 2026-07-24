import React from 'react';
import type { CanonicalStage, SupportLevel } from '../../data/canonicalLessons/types';
import { SingleChoiceActivityView } from '../../components/activities/SingleChoiceActivityView';
import { MultiChoiceActivityView } from '../../components/activities/MultiChoiceActivityView';
import { DataSort } from '../../components/activities/DataSort';
import { EvidenceCompare } from '../../components/activities/EvidenceCompare';
import { EvidenceAnnotate } from '../../components/activities/EvidenceAnnotate';
import { ConditionAdjuster } from '../../components/activities/ConditionAdjuster';
import { SimpleCalculator } from '../../components/activities/SimpleCalculator';
import { PlanBuilder } from '../../components/activities/PlanBuilder';
import { ExpressionActivityView } from '../../components/activities/ExpressionActivityView';

interface LessonStageRendererProps {
  stage: CanonicalStage;
  supportLevel: SupportLevel;
  onRecordResponse: (stageId: string, resp: any) => void;
  savedResponse?: any;
}

export const LessonStageRenderer: React.FC<LessonStageRendererProps> = ({
  stage,
  supportLevel,
  onRecordResponse,
  savedResponse,
}) => {
  const supportConfig = stage.support?.[supportLevel] || stage.support?.normal || stage.support?.light;

  const handleData = (val: any) => {
    onRecordResponse(stage.id, {
      mode: 'choice',
      value: val,
      choiceIds: Array.isArray(val) ? val : typeof val === 'string' ? [val] : undefined,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-900">{stage.title}</h3>
        <p className="text-sm text-slate-700 leading-relaxed">{stage.instruction}</p>
      </div>

      {supportConfig?.hint && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-2">
          <span className="text-sm">💡</span>
          <div>
            <span className="font-semibold">도움 힌트: </span>
            <span>{supportConfig.hint}</span>
          </div>
        </div>
      )}

      <div className="pt-2">
        {stage.activity.kind === 'single-choice' && (
          <SingleChoiceActivityView
            activity={stage.activity}
            onSelect={id => handleData(id)}
            selectedId={savedResponse?.value}
          />
        )}
        {stage.activity.kind === 'multi-choice' && (
          <MultiChoiceActivityView
            activity={stage.activity}
            onSelect={ids => handleData(ids)}
            selectedIds={savedResponse?.choiceIds}
          />
        )}
        {(stage.activity.kind === 'sort' || stage.activity.kind === 'sequence') && (
          <DataSort activity={stage.activity} onSort={data => handleData(data)} />
        )}
        {(stage.activity.kind === 'compare' || stage.activity.kind === 'ai-compare') && (
          <EvidenceCompare
            activity={stage.activity}
            onDecision={d => handleData(d)}
            selectedDecision={savedResponse?.value}
          />
        )}
        {stage.activity.kind === 'annotate' && (
          <EvidenceAnnotate
            activity={stage.activity}
            onAnnotate={ids => handleData(ids)}
            selectedMarkerIds={savedResponse?.value}
          />
        )}
        {stage.activity.kind === 'adjust' && (
          <ConditionAdjuster activity={stage.activity} onAdjust={st => handleData(st)} />
        )}
        {stage.activity.kind === 'calculate' && (
          <SimpleCalculator activity={stage.activity} onCalculate={res => handleData(res)} />
        )}
        {stage.activity.kind === 'build' && (
          <PlanBuilder activity={stage.activity} onBuild={m => handleData(m)} />
        )}
        {stage.activity.kind === 'expression' && (
          <ExpressionActivityView activity={stage.activity} onExpress={resp => onRecordResponse(stage.id, resp)} />
        )}
      </div>
    </div>
  );
};
