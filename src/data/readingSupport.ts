import type { LessonId, ModuleId } from '../types';
import { moduleIdFromLessonId } from './modules';

/**
 * 읽기 지원이 켜진 단원.
 *
 * 읽기 지원은 글을 못 읽는 학생도 핵심 학습을 끝까지 마칠 수 있게 하는 길이다. 세 가지가 한 묶음이다.
 *  1. 선택지·반응·AI 의견마다 제 듣기 단추가 있고, 선택지는 "모두 듣기"로 차례대로 들을 수 있다.
 *     카드를 고르는 일은 소리 없이 한다(자동 읽기는 교사가 켜야 한다).
 *  2. 판단 단계의 세 단추가 그림 카드(그림 + 인쇄 글자)다.
 *  3. 상단 바에 학생이 직접 쓰는 소리 칩이 있다.
 *
 * 2026-10 시범으로 1단원만 켠다. 이 목록 한 줄이 위 세 가지를 함께 켜고 끈다.
 * 다른 단원을 켤 때는 이 목록에 더하고 `npm run check:reading-support`를 돌린다.
 * 그 단원 그림 카드 판에 판단 카드 셋이 있어야 검사가 통과한다.
 */
export const READING_SUPPORT_MODULES: readonly ModuleId[] = ['m1'];

export function moduleHasReadingSupport(moduleId: ModuleId | null | undefined): boolean {
  return moduleId != null && READING_SUPPORT_MODULES.includes(moduleId);
}

/** 차시가 읽기 지원 단원에 속하는가. 단원 마무리 차시도 단원에 속하므로 함께 켜진다. */
export function hasReadingSupport(lessonId: LessonId | null | undefined): boolean {
  if (!lessonId) return false;
  return moduleHasReadingSupport(moduleIdFromLessonId(lessonId));
}
