import MicroLessonFrame from '../components/MicroLessonFrame';
import Button from '../components/Button';
import Icon from '../components/Icon';
import ModuleIcon from '../components/ModuleIcon';
import { getLesson } from '../data/lessons';
import { getHardContent } from '../data/lessons/hard';
import { getStudioDefinition } from '../data/studios';
import StudioLessonView from '../features/studio/StudioLessonView';
import { getModulePortfolioDefinition } from '../data/modulePortfolios';
import ModuleCloseLessonView from '../features/studio/ModuleCloseLessonView';
import { getModule, moduleIdFromLessonId } from '../data/modules';
import { themeFor } from '../utils/moduleThemes';
import type { LessonId } from '../types';

interface Props {
  key?: any;
  lessonId: LessonId;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

export default function LessonView({ lessonId, onGoHome, onPickLesson }: Props) {
  const lesson = getLesson(lessonId);
  if (!lesson) {
    return <ComingSoonLesson lessonId={lessonId} onGoHome={onGoHome} onPickLesson={onPickLesson} />;
  }
  const studioDefinition = getStudioDefinition(lessonId);
  if (studioDefinition) {
    return (
      <StudioLessonView
        key={lessonId}
        definition={studioDefinition}
        lesson={lesson}
        hard={getHardContent(lesson.id)}
        onGoHome={onGoHome}
        onPickLesson={onPickLesson}
      />
    );
  }
  const portfolioDefinition = getModulePortfolioDefinition(lessonId);
  if (portfolioDefinition) {
    return (
      <ModuleCloseLessonView
        key={lessonId}
        definition={portfolioDefinition}
        onGoHome={onGoHome}
        onPickLesson={onPickLesson}
      />
    );
  }
  // 스튜디오도 단원 마무리도 아닌 차시는 열 수 있는 화면이 없다. 68차시는 모두 둘 중 하나이고
  // (check:lesson-roles), 예전 단계형 렌더러는 쓰는 차시가 없어 없앴다.
  return <ComingSoonLesson lessonId={lessonId} onGoHome={onGoHome} onPickLesson={onPickLesson} />;
}

interface ComingSoonProps {
  lessonId: LessonId;
  onGoHome: () => void;
  onPickLesson: (id: LessonId) => void;
}

function ComingSoonLesson({ lessonId, onGoHome, onPickLesson }: ComingSoonProps) {
  const modId = moduleIdFromLessonId(lessonId);
  const mod = modId ? getModule(modId) : undefined;
  const theme = themeFor(modId ?? 'm1');
  const crumb = mod ? `단원 ${mod.number} > ${mod.title}` : lessonId;

  return (
    <MicroLessonFrame
      lessonId={lessonId}
      pageKey={'coming-soon'}
      crumb={crumb}
      totalSteps={1}
      currentStep={0}
      onPrev={() => {}}
      onNext={onGoHome}
      onGoHome={onGoHome}
      onPickLesson={onPickLesson}
    >
      <div className="max-w-xl mx-auto text-center py-16">
        <div className="flex justify-center mb-4" aria-hidden>
          <ModuleIcon moduleId={modId ?? 'm1'} size={64} />
        </div>
        <h1 className="text-3xl font-bold mb-3" style={{ color: theme.accent }}>
          곧 열립니다!
        </h1>
        <p className="text-lg text-[color:var(--muted)] mb-8">
          이 차시는 아직 준비 중이에요. 첫 번째 차시부터 시작해 보세요.
        </p>
        <Button size="lg" accent={theme.accent} onClick={() => onPickLesson('m1-l1')}>
          <Icon name="rocket" size={24} /> 첫 차시로 가기
        </Button>
      </div>
    </MicroLessonFrame>
  );
}
