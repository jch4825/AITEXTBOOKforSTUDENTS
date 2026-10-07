import Icon from '../../components/Icon';
import type { TeacherLink } from '../../data/teacherResources';

interface Props {
  resources: TeacherLink[];
}

/**
 * 교사 자료 — 이 차시에 연결해 둔 외부 링크(영상·도구) 목록. 교사 모드의 교사 도구 시트에서만 열린다.
 *
 * 예전에는 떠 있는 도크 안의 w-64 좁은 칸이었다. 시트로 옮긴 뒤에도 그 폭이 남아 720px 시트의
 * 40%만 쓰고, 글은 한 줄 열두 글자쯤에서 꺾이며 링크가 세로로만 길게 쌓였다.
 * 지금은 시트 폭을 다 쓰는 카드이고, 카드 안의 배치는 칸의 폭(@container)이 정한다.
 * 넓으면 [그림 · 제목 · 열기]가 한 줄이고 설명이 그 아래로 넓게 깔리며,
 * 좁으면 제목 밑의 메타·설명·열기가 카드 폭을 다 쓴다.
 * 카드 안 요소는 읽는 순서(제목 → 종류·제공자·날짜 → 설명 → 안 열릴 때 → 열기)대로 늘어놓고
 * 배치만 CSS 격자가 바꾼다. 단원 색은 시트가 --tool-accent·--tool-soft·--btn-accent로 내려 준다.
 *
 * m4가 출처와 날짜 확인을 가르치므로 교재 자신의 링크도 제공자와 확인 날짜를 밝힌다.
 * 외부 사이트로 나간다는 것은 단추의 그림과 글(새 창에서 열기)로 알린다.
 */
export default function TeacherResourcesPanel({ resources }: Props) {
  return (
    <div className="teacher-resources">
      <div className="tool-panel-head">
        <h3>교사 자료</h3>
        <p>교사 모드에서만 보이며, 링크는 새 창에서 열립니다.</p>
      </div>

      {resources.length === 0 ? (
        <div className="teacher-resources-empty">
          <strong>자료 준비 중입니다.</strong>
          <span>이 차시에는 연결해 둔 외부 자료가 없습니다. 교과서 화면만으로 수업을 마칠 수 있습니다.</span>
        </div>
      ) : (
        <ul className="teacher-resource-list">
          {resources.map((resource) => {
            const isVideo = resource.kind === 'video';
            return (
              <li key={resource.url} className="teacher-resource surface-paper" data-kind={resource.kind}>
                <span className="teacher-resource-tile" aria-hidden="true">
                  <Icon name={isVideo ? 'play' : 'link'} size={26} />
                </span>
                <h4 className="teacher-resource-title">{resource.label}</h4>
                <p className="teacher-resource-meta">
                  <strong>{isVideo ? '영상' : '도구'}</strong>
                  {' '}
                  {/* 줄이 꺾여도 날짜가 하이픈에서 끊기거나 "확인"이 떨어져 나가지 않게 한 덩어리로 둔다. */}
                  {resource.source}{' ·'}
                  {' '}
                  <span className="teacher-resource-date">{resource.checkedAt} 확인</span>
                </p>
                <p className="teacher-resource-desc">{resource.description}</p>
                <p className="teacher-resource-fallback">
                  <b>안 열릴 때</b>
                  <span>{resource.fallback}</span>
                </p>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary teacher-resource-open"
                  aria-label={`새 창에서 열기: ${resource.label} (외부 사이트)`}
                >
                  새 창에서 열기
                  <Icon name="external" size={18} />
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
