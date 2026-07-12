import type { CharacterId } from '../data/characters';
import type { LessonId } from '../types';
import EpisodeHeroSpread from './lesson/EpisodeHeroSpread';

interface Props {
  lessonId: LessonId;
  title: string;
  scene: CharacterId[];
  text: string;
  episodeTitle?: string;
  accent: string;
  accentText?: string;
  accentSoft: string;
  className?: string;
}

/**
 * Stage component left as a backward-compatible wrapper to prevent breaking other pages.
 * Delegating execution to the new EpisodeHeroSpread.
 */
export default function Stage(props: Props) {
  return <EpisodeHeroSpread {...props} />;
}
