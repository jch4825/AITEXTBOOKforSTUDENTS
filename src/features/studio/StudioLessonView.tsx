import { useCallback, useEffect, useState } from 'react';
import MicroLessonFrame from '../../components/MicroLessonFrame';
import ScreentoneBackdrop from '../../components/lesson/ScreentoneBackdrop';
import { useProgress } from '../../context/ProgressContext';
import { useSettings } from '../../context/SettingsContext';
import { getModule } from '../../data/modules';
import { themeFor } from '../../utils/moduleThemes';
import type { HardLessonContent, LessonContent, LessonId } from '../../types';
import { DIFFICULTY_TO_SUPPORT } from './supportLevel';
import { STUDIO_STAGES } from './studioReducer';
import StudioExperience from './components/StudioExperience';
import { useStudioSession } from './useStudioSession';
import type { StudioDefinition } from './types';

interface Props {
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
  const markStudioComplete = useCallback(() => {
    markCompleted(definition.lessonId);
  }, [definition.lessonId, markCompleted]);
  const session = useStudioSession(
    definition,
    DIFFICULTY_TO_SUPPORT[difficulty],
    markStudioComplete,
  );
  const currentStep = STUDIO_STAGES.indexOf(session.state.stage);
  useEffect(() => {
    setSceneIndex(0);
  }, [definition.id, session.state.stage]);
  const debugSubPage = session.state.stage === 'encounter' && definition.visualNovel
    ? { current: sceneIndex + 1, total: definition.visualNovel.scenes.length }
    : undefined;

  function handleNext() {
    if (session.state.stage === 'complete') onGoHome();
    else session.goNext();
  }

  return (
    <ScreentoneBackdrop moduleId={definition.moduleId}>
      <MicroLessonFrame
        lessonId={definition.lessonId}
        crumb={`${module?.number ?? 5}단원 · ${module?.title ?? 'AI로 문제해결하기'}`}
        totalSteps={STUDIO_STAGES.length}
        currentStep={currentStep}
        onPrev={session.goPrevious}
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
        />
      </MicroLessonFrame>
    </ScreentoneBackdrop>
  );
}
