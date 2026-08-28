import { useCallback, useEffect, useState } from 'react';
import MicroLessonFrame from '../../components/MicroLessonFrame';
import ScreentoneBackdrop from '../../components/lesson/ScreentoneBackdrop';
import { useProgress } from '../../context/ProgressContext';
import { useSettings } from '../../context/SettingsContext';
import { getModule } from '../../data/modules';
import { themeFor } from '../../utils/moduleThemes';
import { playSound, type SoundName } from '../../utils/sound';
import type { HardLessonContent, LessonContent, LessonId } from '../../types';
import { DIFFICULTY_TO_SUPPORT } from './supportLevel';
import StudioExperience from './components/StudioExperience';
import { crossesStage, getFormatBehavior } from './formats';
import { useStudioSession } from './useStudioSession';
import type { StudioDefinition, StudioStage } from './types';

/**
 * 기록 단계를 넘을 때 울릴 소리. 결과물을 마친 순간과 차시를 마친 순간은
 * 다른 사건이므로 같은 전진음으로 뭉뚱그리지 않는다.
 */
function stageChangeSound(from: StudioStage, to: StudioStage | undefined): SoundName {
  if (to === 'complete') return 'lesson-complete';
  if (from === 'artifact') return 'artifact-done';
  return 'stage-advance';
}

interface Props {
  key?: string;
  definition: StudioDefinition;
  lesson: LessonContent;
  hard?: HardLessonContent;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

export default function StudioLessonView({
  definition,
  lesson,
  hard,
  onGoHome,
  onPickLesson,
}: Props) {
  const { difficulty } = useSettings();
  const { markCompleted } = useProgress();
  const theme = themeFor(definition.moduleId);
  const module = getModule(definition.moduleId);
  const [sceneIndex, setSceneIndex] = useState(0);
  // 장면 안에서 읽는 대사 칸. 장면과 함께 초기화되어야 새 장면이 첫 칸부터 열린다.
  const [beatIndex, setBeatIndex] = useState(0);
  const markStudioComplete = useCallback(() => {
    markCompleted(definition.lessonId);
  }, [definition.lessonId, markCompleted]);
  const session = useStudioSession(
    definition,
    DIFFICULTY_TO_SUPPORT[difficulty],
    markStudioComplete,
  );

  // 화면 순서는 포맷이 정하고, 기록 단계는 리듀서가 그대로 쥔다.
  // 한 단계에 화면이 여럿일 수 있어 진행 표시는 뷰 기준으로 센다.
  // 차시가 바뀌면 이 컴포넌트가 key={lessonId}로 통째로 다시 마운트되므로
  // viewIndex는 초기값으로 되돌아간다 — 리셋 효과를 따로 두지 않는다.
  const behavior = getFormatBehavior(definition.format);
  const views = behavior.views;
  const [viewIndex, setViewIndex] = useState(0);
  const view = views[Math.min(viewIndex, views.length - 1)];

  useEffect(() => {
    setSceneIndex(0);
    setBeatIndex(0);
  }, [definition.id, session.state.stage]);

  const debugSubPage = view.id === 'story' && definition.visualNovel
    ? { current: sceneIndex + 1, total: definition.visualNovel.scenes.length }
    : undefined;

  function handleNext() {
    if (session.state.stage === 'complete') {
      session.finish();
      onGoHome();
      return;
    }
    setViewIndex(viewIndex + 1);
    const nextView = views[viewIndex + 1];
    // 같은 기록 단계 안에서 화면만 넘어가는 경우에는 리듀서를 건드리지 않는다.
    if (!crossesStage(view, nextView)) {
      playSound('scene-next');
      return;
    }
    playSound(stageChangeSound(view.stage, nextView?.stage));
    session.goNext();
  }

  function handlePrevious() {
    const previous = views[viewIndex - 1];
    if (!previous) return;
    const crosses = crossesStage(previous, view);
    playSound(crosses ? 'stage-back' : 'scene-next');
    if (crosses) session.goPrevious();
    setViewIndex(viewIndex - 1);
  }

  return (
    <ScreentoneBackdrop moduleId={definition.moduleId}>
      <MicroLessonFrame
        lessonId={definition.lessonId}
        crumb={`${module?.number ?? 5}단원 · ${module?.title ?? 'AI로 문제해결하기'}`}
        totalSteps={views.length}
        currentStep={viewIndex}
        onPrev={handlePrevious}
        onNext={handleNext}
        onPickLesson={onPickLesson}
        onGoHome={onGoHome}
        pageKey={session.state.stage}
        subPage={debugSubPage}
      >
        <StudioExperience
          definition={definition}
          lesson={lesson}
          hard={hard}
          state={session.state}
          dispatch={session.dispatch}
          accent={theme.accent}
          secondary={theme.secondary}
          sceneIndex={sceneIndex}
          onSceneIndexChange={setSceneIndex}
          beatIndex={beatIndex}
          onBeatIndexChange={setBeatIndex}
          view={view}
          behavior={behavior}
        />
      </MicroLessonFrame>
    </ScreentoneBackdrop>
  );
}
