import type { LessonId } from '../types';

export interface TeacherLink {
  label: string;
  url: string;
  description: string;
}

const TEACHER_RESOURCES: Partial<Record<LessonId, TeacherLink[]>> = {
  'm1-l1': [
    {
      label: '수업과 함께 보는 영상',
      url: 'https://youtu.be/iQ8A8ruR26g',
      description: '우리 생활 속 AI를 떠올리는 m1-l1 도입 또는 정리 활동에 활용하세요.',
    },
  ],
};

export function getTeacherResources(lessonId: LessonId): TeacherLink[] {
  return TEACHER_RESOURCES[lessonId] ?? [];
}
