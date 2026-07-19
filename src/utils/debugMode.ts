import type { LessonId } from '../types';

export interface DebugSubPage {
  current: number;
  total: number;
}

export interface DebugPageLocator {
  lessonId: LessonId;
  current: number;
  total: number;
  pageKey?: string;
  subPage?: DebugSubPage;
}

function twoDigits(value: number): string {
  return String(Math.max(1, Math.trunc(value))).padStart(2, '0');
}

export function isDebugMode(
  search = typeof window === 'undefined' ? '' : window.location.search,
): boolean {
  return new URLSearchParams(search).get('debug') === '1';
}

export function formatDebugPageId(locator: DebugPageLocator): string {
  const parts = [
    locator.lessonId,
    `P${twoDigits(locator.current)}/${twoDigits(locator.total)}`,
  ];
  if (locator.pageKey) parts.push(locator.pageKey);
  if (locator.subPage) {
    parts.push(`S${twoDigits(locator.subPage.current)}/${twoDigits(locator.subPage.total)}`);
  }
  return parts.join(' · ');
}
