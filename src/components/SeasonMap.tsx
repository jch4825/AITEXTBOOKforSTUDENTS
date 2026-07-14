import { Fragment, type CSSProperties, type ReactNode } from 'react';
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
  activeId: ModuleId | null;
  onPick: (id: ModuleId) => void;
  renderLessons: (id: ModuleId) => ReactNode;
}

/** 6개 모듈을 연재 에피소드 컷으로 보여 주는 시즌 지도. */
export default function SeasonMap({ episodes, activeId, onPick, renderLessons }: Props) {
  const activeEpisode = episodes.find((episode) => episode.id === activeId) ?? null;

  return (
    <ol className="season-map" aria-label="AI 동아리 시즌 지도">
      {episodes.map((episode, index) => {
        const theme = themeFor(episode.id);
        const active = episode.id === activeId;
        const drawerPanelId = `season-lessons-${episode.id}-drawer`;
        const inlinePanelId = `season-lessons-${episode.id}-inline`;
        const isRowEnd = index === 2 || index === episodes.length - 1;
        const rowStart = index < 3 ? 0 : 3;
        const rowEpisodeIds = episodes.slice(rowStart, rowStart + 3).map((item) => item.id);
        const rowActiveEpisode = activeEpisode && rowEpisodeIds.includes(activeEpisode.id) ? activeEpisode : null;
        const rowActiveTheme = rowActiveEpisode ? themeFor(rowActiveEpisode.id) : null;

        return (
          <Fragment key={episode.id}>
            <li
              className={`season-card ${active ? 'season-card-active' : ''}`}
              style={{ '--episode-accent': theme.accent, '--episode-soft': theme.accentSoft } as CSSProperties}
            >
              <button
                onClick={() => onPick(episode.id)}
                aria-current={active ? 'step' : undefined}
                aria-expanded={active}
                aria-controls={drawerPanelId}
                className={`season-episode ${active ? 'season-episode-active' : ''}`}
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
                <span className="season-toggle" aria-hidden>
                  <Icon name={active ? 'chevron-up' : 'chevron-down'} size={18} />
                </span>
              </button>
              {active && <div id={inlinePanelId} className="season-lessons season-lessons-inline">{renderLessons(episode.id)}</div>}
            </li>
            {isRowEnd && rowActiveEpisode && rowActiveTheme && (
              <li
                className="season-drawer-row"
                style={{ '--episode-accent': rowActiveTheme.accent, '--episode-soft': rowActiveTheme.accentSoft } as CSSProperties}
              >
                <div id={`season-lessons-${rowActiveEpisode.id}-drawer`} className="season-lessons season-lessons-drawer">
                  {renderLessons(rowActiveEpisode.id)}
                </div>
              </li>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
