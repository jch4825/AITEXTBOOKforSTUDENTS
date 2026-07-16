import type { LessonId } from '../../types';
import { M1_SUPPORT_BRIDGES } from './m1';
import { M2_SUPPORT_BRIDGES } from './m2';
import { M3_SUPPORT_BRIDGES } from './m3';
import { M4_SUPPORT_BRIDGES } from './m4';
import { M5_SUPPORT_BRIDGES } from './m5';
import { M6_SUPPORT_BRIDGES } from './m6';
import type { SupportBridgeDefinition } from './types';

const BRIDGE_BY_LESSON = new Map<LessonId, SupportBridgeDefinition>(
  [...M1_SUPPORT_BRIDGES, ...M2_SUPPORT_BRIDGES, ...M3_SUPPORT_BRIDGES, ...M4_SUPPORT_BRIDGES, ...M5_SUPPORT_BRIDGES, ...M6_SUPPORT_BRIDGES]
    .map((bridge) => [bridge.lessonId, bridge]),
);

export function getSupportBridge(lessonId: LessonId): SupportBridgeDefinition | undefined {
  return BRIDGE_BY_LESSON.get(lessonId);
}
