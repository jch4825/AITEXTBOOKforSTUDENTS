import type { CSSProperties } from 'react';
import ModuleIcon from './ModuleIcon';
import Icon from './Icon';
import type { ModuleId } from '../types';
import { themeFor } from '../utils/moduleThemes';

interface Episode {
  id: ModuleId;
  number: number;
  title: string;
  synopsis: string;
  done: number;
  total: number;
  complete: boolean;
}

interface Props {
  episodes: Episode[];
  activeId: ModuleId;
  onPick: (id: ModuleId) => void;
}

/** 6개 모듈을 연재 에피소드 컷으로 보여 주는 시즌 지도. */
export default function SeasonMap({ episodes, activeId, onPick }: Props) {
  return (
    <ol className="season-map" aria-label="AI 동아리 시즌 지도">
      {episodes.map((episode) => {
        const theme = themeFor(episode.id);
        const active = episode.id === activeId;
        return (
          <li key={episode.id}>
            <button
              onClick={() => onPick(episode.id)}
              aria-current={active ? 'step' : undefined}
              className={`season-episode ${active ? 'season-episode-active' : ''}`}
              style={{ '--episode-accent': theme.accent, '--episode-soft': theme.accentSoft } as CSSProperties}
            >
              <span className="season-number">{String(episode.number).padStart(2, '0')}</span>
              <span className="season-icon"><ModuleIcon moduleId={episode.id} size={34} /></span>
              <span className="season-copy">
                <strong>{episode.title}</strong>
                <small>{episode.synopsis}</small>
              </span>
              <span className="season-progress">
                {episode.complete ? <Icon name="star" size={18} filled color={theme.accent} /> : `${episode.done}/${episode.total}`}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
