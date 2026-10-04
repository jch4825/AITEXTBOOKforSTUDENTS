import { lessonExtraCutSrc, LESSON_EXTRA_CUTS } from '../../../data/lessonExtraCuts';
import { getModulePortfolioDefinition } from '../../../data/modulePortfolios';
import { getStudioDefinition } from '../../../data/studios';
import type { LessonId } from '../../../types';
import { publicAssetUrl } from '../../../utils/publicAssetUrl';

/** 학습지 편집기의 "이 차시의 그림 고르기"에 나오는 그림 한 장. */
export interface LessonPictureOption {
  id: string;
  group: string;
  label: string;
  src: string;
  alt: string;
}

/**
 * 한 차시에서 만든 그림을 모은다: 이야기 장면, 적용·관찰 상황 그림, 예전 이야기 컷.
 * 하·중 수준 학습지는 이야기의 둘째 장면과 적용 상황 그림을 기본으로 쓰는데, 교사가 다른 장면이 더 낫다고 보면
 * 여기서 바꿀 수 있다. 예전 이야기 컷은 지금 이야기와 그림체가 달라 학생 화면에는 쓰지 않지만 종이에서는 방해되지 않는다.
 */
export function lessonPictureOptions(lessonId: LessonId): LessonPictureOption[] {
  const options: LessonPictureOption[] = [];
  const seen = new Set<string>();
  const add = (group: string, label: string, src: string, alt: string) => {
    if (!src || seen.has(src)) return;
    seen.add(src);
    options.push({ id: `${group}-${options.length}`, group, label, src: publicAssetUrl(src), alt });
  };

  const studio = getStudioDefinition(lessonId);
  for (const scene of studio?.visualNovel?.scenes ?? []) add('이야기 장면', scene.label, scene.imageSrc, scene.alt);
  const stimuli = [
    ...(studio?.transfer.stimuli ?? []),
    ...(studio?.encounter.stimuli ?? []),
    ...(studio?.conditionChange.stimuli ?? []),
  ];
  for (const stimulus of stimuli) {
    if (stimulus.kind === 'image') add('상황 그림', stimulus.caption, stimulus.src, stimulus.alt);
  }
  for (const scene of getModulePortfolioDefinition(lessonId)?.closingStory ?? []) add('이야기 장면', scene.label, scene.imageSrc, scene.alt);
  for (const number of LESSON_EXTRA_CUTS[lessonId] ?? []) {
    add('예전 이야기 컷', `컷 ${Number(number)}`, lessonExtraCutSrc(lessonId, number), `${lessonId} 예전 이야기 컷 ${Number(number)}`);
  }
  return options;
}
