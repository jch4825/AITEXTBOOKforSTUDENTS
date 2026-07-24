import React from 'react';
import type { CanonicalLessonDesign, SupportLevel } from '../../data/canonicalLessons/types';
import { FlagshipLessonView } from './FlagshipLessonView';
import { GuidedLessonView } from './GuidedLessonView';
import { ProjectLessonView } from './ProjectLessonView';

interface CanonicalLessonViewProps {
  lesson: CanonicalLessonDesign;
  supportLevel: SupportLevel;
  onFinish?: () => void;
}

export const CanonicalLessonView: React.FC<CanonicalLessonViewProps> = ({
  lesson,
  supportLevel,
  onFinish,
}) => {
  if (lesson.role === 'flagship') {
    return <FlagshipLessonView lesson={lesson} supportLevel={supportLevel} onFinish={onFinish} />;
  }

  if (lesson.role === 'project') {
    return <ProjectLessonView lesson={lesson} supportLevel={supportLevel} onFinish={onFinish} />;
  }

  return <GuidedLessonView lesson={lesson} supportLevel={supportLevel} onFinish={onFinish} />;
};
