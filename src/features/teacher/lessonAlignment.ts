import { LESSON_OBJECTIVES, getLessonObjective } from '../../data/lessonObjectives';
import { ALL_LESSONS } from '../../data/lessons';
import { getModulePortfolioDefinition } from '../../data/modulePortfolios';
import { getStudioDefinition } from '../../data/studios';
import type { LessonId, ModuleId } from '../../types';

export interface TeacherLessonAlignmentRow {
  lessonId: LessonId;
  moduleId: ModuleId;
  lessonNumber: number;
  lessonTitle: string;
  kind: 'studio' | 'portfolio';
  studentMission: string;
  teacherObjective: string;
  scenarioTitle: string;
  scenarioDescription: string;
  aiRole: string;
  aiContribution: string;
  artifactTitle: string;
  artifactPrompt: string;
  transferTitle: string;
  transferDescription: string;
  standards: string[];
}

/**
 * 교사 화면에서 학생 수업과 같은 현재 데이터를 읽기 위한 어댑터입니다.
 * 옛 canonicalLessons 설명을 복사하지 않고, 62개 스튜디오와 6개 포트폴리오를
 * 실제 학생 런타임과 동일한 레지스트리에서 조합합니다.
 */
export function getTeacherLessonAlignmentRows(): TeacherLessonAlignmentRow[] {
  return ALL_LESSONS.map((lesson) => {
    const studio = getStudioDefinition(lesson.id);
    const objective = getLessonObjective(lesson.id);

    if (studio) {
      return {
        lessonId: lesson.id,
        moduleId: lesson.moduleId,
        lessonNumber: lesson.number,
        lessonTitle: studio.title,
        kind: 'studio',
        studentMission: objective?.studentMission ?? lesson.objective,
        teacherObjective: objective?.teacherObjective ?? lesson.objective,
        scenarioTitle: studio.encounter.title,
        scenarioDescription: studio.encounter.description,
        aiRole: objective?.aiRole ?? studio.aiContribution.role,
        aiContribution: `${studio.aiContribution.role}: ${studio.aiContribution.text}`,
        artifactTitle: studio.artifact.title,
        artifactPrompt: studio.artifact.prompt,
        transferTitle: studio.transfer.title,
        transferDescription: studio.transfer.description,
        standards: objective?.standards ?? lesson.standards ?? [],
      } satisfies TeacherLessonAlignmentRow;
    }

    const portfolio = getModulePortfolioDefinition(lesson.id);
    if (portfolio) {
      return {
        lessonId: lesson.id,
        moduleId: lesson.moduleId,
        lessonNumber: lesson.number,
        lessonTitle: portfolio.title,
        kind: 'portfolio',
        studentMission: lesson.objective,
        teacherObjective: portfolio.completionRequirement ?? portfolio.description,
        scenarioTitle: portfolio.title,
        scenarioDescription: portfolio.description,
        aiRole: '앞 차시의 AI 결과를 다시 생성하지 않고 학생의 판단과 산출물을 돌아보게 합니다.',
        aiContribution: '실시간 AI 응답 대신 앞 차시의 기록과 학생이 고른 근거를 사용합니다.',
        artifactTitle: portfolio.artifactHeading ?? portfolio.title,
        artifactPrompt: portfolio.artifactDescription ?? portfolio.description,
        transferTitle: '새 상황에 이어 쓰기',
        transferDescription: portfolio.transferPrompt ?? '단원에서 배운 판단 절차를 새로운 생활 상황에 적용합니다.',
        standards: lesson.standards ?? [],
      } satisfies TeacherLessonAlignmentRow;
    }

    throw new Error(`${lesson.id}: 학생 런타임에 스튜디오 또는 성장 포트폴리오 정의가 없습니다.`);
  });
}

export function countAlignedStudioObjectives(): number {
  return LESSON_OBJECTIVES.filter((objective) => objective.status === 'applied').length;
}
