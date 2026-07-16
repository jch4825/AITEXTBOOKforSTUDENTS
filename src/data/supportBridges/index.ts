import type { LessonId } from '../../types';
import { M1_SUPPORT_BRIDGES } from './m1';
import { M5_SUPPORT_BRIDGES } from './m5';
import type { SupportBridgeDefinition } from './types';

const BRIDGE_BY_LESSON = new Map<LessonId, SupportBridgeDefinition>(
  [...M1_SUPPORT_BRIDGES, ...M5_SUPPORT_BRIDGES].map((bridge) => [bridge.lessonId, bridge]),
);

export function getSupportBridge(lessonId: LessonId): SupportBridgeDefinition | undefined {
  return BRIDGE_BY_LESSON.get(lessonId);
}
