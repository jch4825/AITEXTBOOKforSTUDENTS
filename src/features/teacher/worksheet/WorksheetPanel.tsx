import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type CSSProperties, type RefObject } from 'react';
import Icon from '../../../components/Icon';
import { buildLessonWorksheet, mergeWorksheetDraft, worksheetStorageKey } from './buildWorksheet';
import { downloadWorksheetHtml, printWorksheet } from './worksheetHtml';
import type { LessonId } from '../../../types';
import type { LessonWorksheet, WorksheetActivity, WorksheetLevel, WorksheetPair, WorksheetVariant } from './types';

interface Props {
  lessonId: LessonId;
  onClose: () => void;
}

const LEVEL_ORDER: WorksheetLevel[] = ['high', 'middle', 'low'];

const LEVEL_DESCRIPTIONS: Record<WorksheetLevel, string> = {
  high: '상 · 직접 써요',
  middle: '중 · 덧쓰고 붙여요',
  low: '하 · 오리고 찾아요',
};

function loadWorksheet(lessonId: LessonId): LessonWorksheet {
  const base = buildLessonWorksheet(lessonId);
  try {
    const saved = localStorage.getItem(worksheetStorageKey(lessonId));
    return saved ? mergeWorksheetDraft(base, JSON.parse(saved) as unknown) : base;
  } catch {
    return base;
  }
}

function setActivityField(
  worksheet: LessonWorksheet,
  level: WorksheetLevel,
  index: number,
  patch: Partial<WorksheetActivity>,
): LessonWorksheet {
  const variant = worksheet.variants[level];
  return {
    ...worksheet,
    variants: {
      ...worksheet.variants,
      [level]: {
        ...variant,
        activities: variant.activities.map((activity, activityIndex) => activityIndex === index ? { ...activity, ...patch } : activity),
      },
    },
  };
}

function updateItems(
  worksheet: LessonWorksheet,
  level: WorksheetLevel,
  activityIndex: number,
  itemIndex: number,
  value: string,
): LessonWorksheet {
  const activity = worksheet.variants[level].activities[activityIndex];
  const items = [...(activity.items ?? [])];
  items[itemIndex] = value;
  return setActivityField(worksheet, level, activityIndex, { items });
}

function updatePair(
  worksheet: LessonWorksheet,
  level: WorksheetLevel,
  activityIndex: number,
  pairIndex: number,
  side: keyof WorksheetPair,
  value: string,
): LessonWorksheet {
  const activity = worksheet.variants[level].activities[activityIndex];
  const pairs = (activity.pairs ?? []).map((pair, index) => index === pairIndex ? { ...pair, [side]: value } : pair);
  return setActivityField(worksheet, level, activityIndex, { pairs });
}

function InputField({ label, value, onChange, multiline = false }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value);
  return (
    <label className="teacher-worksheet-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} onChange={handleChange} rows={2} />
      ) : (
        <input value={value} onChange={handleChange} />
      )}
    </label>
  );
}

function ActivityEditor({
  worksheet,
  level,
  activity,
  activityIndex,
  onChange,
}: {
  key?: string;
  worksheet: LessonWorksheet;
  level: WorksheetLevel;
  activity: WorksheetActivity;
  activityIndex: number;
  onChange: (next: LessonWorksheet) => void;
}) {
  return (
    <article className="teacher-worksheet-editor-activity">
      <InputField label="활동 제목" value={activity.title} onChange={(value) => onChange(setActivityField(worksheet, level, activityIndex, { title: value }))} />
      <InputField label="안내 문구" value={activity.instruction} multiline onChange={(value) => onChange(setActivityField(worksheet, level, activityIndex, { instruction: value }))} />
      {(activity.kind === 'write' || activity.kind === 'cut-paste') && activity.prompt !== undefined && (
        <InputField label="문제 문구" value={activity.prompt} multiline onChange={(value) => onChange(setActivityField(worksheet, level, activityIndex, { prompt: value }))} />
      )}
      {activity.kind === 'trace' && (
        <InputField label="덧쓰기 문구" value={activity.traceText ?? ''} multiline onChange={(value) => onChange(setActivityField(worksheet, level, activityIndex, { traceText: value }))} />
      )}
      {activity.kind === 'write' && (
        <label className="teacher-worksheet-field teacher-worksheet-lines-field">
          <span>쓰기 줄 수</span>
          <input
            type="number"
            min={2}
            max={8}
            value={activity.lines ?? 4}
            onChange={(event) => onChange(setActivityField(worksheet, level, activityIndex, { lines: Math.max(2, Math.min(8, Number(event.target.value) || 4)) }))}
          />
        </label>
      )}
      {activity.items && (
        <div className="teacher-worksheet-list-editor">
          <span className="teacher-worksheet-list-label">카드·낱말</span>
          {activity.items.map((item, itemIndex) => (
            <input
              key={`${activity.id}-item-${itemIndex}`}
              aria-label={`카드 ${itemIndex + 1}`}
              value={item}
              onChange={(event) => onChange(updateItems(worksheet, level, activityIndex, itemIndex, event.target.value))}
            />
          ))}
        </div>
      )}
      {activity.pairs && (
        <div className="teacher-worksheet-pairs-editor">
          <span className="teacher-worksheet-list-label">연결할 내용</span>
          {activity.pairs.map((pair, pairIndex) => (
            <div className="teacher-worksheet-pair-editor" key={`${activity.id}-pair-${pairIndex}`}>
              <input aria-label={`왼쪽 ${pairIndex + 1}`} value={pair.left} onChange={(event) => onChange(updatePair(worksheet, level, activityIndex, pairIndex, 'left', event.target.value))} />
              <span aria-hidden="true">↔</span>
              <input aria-label={`오른쪽 ${pairIndex + 1}`} value={pair.right} onChange={(event) => onChange(updatePair(worksheet, level, activityIndex, pairIndex, 'right', event.target.value))} />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

function Shape({ index }: { index: number }) {
  return <span className={`teacher-worksheet-shape teacher-worksheet-shape-${index % 4}`} aria-hidden="true" />;
}

function WorksheetSheet({ worksheet, variant, sheetRef }: {
  worksheet: LessonWorksheet;
  variant: WorksheetVariant;
  sheetRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="teacher-worksheet-sheet" ref={sheetRef} style={{ '--worksheet-accent': worksheet.accent, '--worksheet-soft': worksheet.accentSoft } as CSSProperties}>
      <div className="teacher-worksheet-sheet-content">
        <header className="teacher-worksheet-sheet-header">
          <p className="teacher-worksheet-sheet-module">{worksheet.moduleTitle}</p>
          <h2>{worksheet.lessonTitle}</h2>
          <span className="teacher-worksheet-sheet-level">{variant.label} · {variant.subtitle}</span>
          <p className="teacher-worksheet-sheet-objective"><strong>학습 목표</strong> {worksheet.objective}</p>
        </header>
        <p className="teacher-worksheet-sheet-instruction">{variant.instruction}</p>
        <div className="teacher-worksheet-sheet-activities">
          {variant.activities.map((activity) => (
            <section className={`teacher-worksheet-sheet-activity teacher-worksheet-sheet-activity-${activity.kind}`} key={activity.id}>
              <h3>{activity.title}</h3>
              <p>{activity.instruction}</p>
              {activity.kind === 'write' && (
                <>
                  <div className="teacher-worksheet-sheet-prompt">{activity.prompt}</div>
                  <div className="teacher-worksheet-sheet-lines" aria-hidden="true">{Array.from({ length: activity.lines ?? 4 }, (_, index) => <i key={index} />)}</div>
                </>
              )}
              {activity.kind === 'trace' && (
                <>
                  <div className="teacher-worksheet-sheet-trace">{activity.traceText}</div>
                  <div className="teacher-worksheet-sheet-lines" aria-hidden="true"><i /><i /></div>
                </>
              )}
              {activity.kind === 'cut-paste' && (
                <>
                  {activity.prompt && <div className="teacher-worksheet-sheet-prompt">{activity.prompt}</div>}
                  <div className="teacher-worksheet-sheet-blanks"><span>붙이는 곳</span><span>붙이는 곳</span><span>붙이는 곳</span></div>
                  <div className="teacher-worksheet-sheet-card-bank">{(activity.items ?? []).map((item, index) => <span key={`${activity.id}-card-${index}`}>{item}</span>)}</div>
                </>
              )}
              {activity.kind === 'match' && (
                <div className="teacher-worksheet-sheet-match">{(activity.pairs ?? []).map((pair, index) => <div key={`${activity.id}-match-${index}`}><span>{pair.left}</span><b>↔</b><span>{pair.right}</span></div>)}</div>
              )}
              {activity.kind === 'connect' && (
                <div className="teacher-worksheet-sheet-shapes">{(activity.items ?? []).map((item, index) => <div key={`${activity.id}-shape-${index}`}><Shape index={index} /><span>{item}</span><Shape index={index + 2} /></div>)}</div>
              )}
            </section>
          ))}
        </div>
      </div>
      <div className="teacher-worksheet-page-guide">A4 한 장 기준선</div>
      <footer className="teacher-worksheet-sheet-footer"><span>이름: ____________________</span><span>{worksheet.lessonId}</span></footer>
    </div>
  );
}

export default function WorksheetPanel({ lessonId, onClose }: Props) {
  const [worksheet, setWorksheet] = useState<LessonWorksheet>(() => loadWorksheet(lessonId));
  const [level, setLevel] = useState<WorksheetLevel>('high');
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = useState(false);
  const variant = worksheet.variants[level];

  useEffect(() => {
    try { localStorage.setItem(worksheetStorageKey(lessonId), JSON.stringify(worksheet)); } catch { /* 저장소가 막힌 환경에서도 편집은 계속한다. */ }
  }, [lessonId, worksheet]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useLayoutEffect(() => {
    const measure = () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      setOverflow(sheet.scrollHeight > sheet.clientHeight + 4);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (sheetRef.current) observer?.observe(sheetRef.current);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [worksheet, level]);

  function updateVariant(patch: Partial<WorksheetVariant>) {
    setWorksheet((current) => ({
      ...current,
      variants: { ...current.variants, [level]: { ...current.variants[level], ...patch } },
    }));
  }

  return (
    <div className="teacher-worksheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="teacher-worksheet-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-worksheet-title">
        <header className="teacher-worksheet-modal-header">
          <div>
            <p className="teacher-worksheet-kicker">교사 도구 · 학습지</p>
            <h2 id="teacher-worksheet-title">{worksheet.lessonTitle} 학습지 만들기</h2>
            <p>파란 테두리 글상자는 클릭하여 문구를 수정할 수 있습니다.</p>
          </div>
          <button className="teacher-worksheet-close" onClick={onClose} aria-label="학습지 편집기 닫기"><Icon name="close" size={22} /></button>
        </header>

        <div className="teacher-worksheet-level-tabs" role="tablist" aria-label="학습지 수준">
          {LEVEL_ORDER.map((candidate) => (
            <button
              key={candidate}
              role="tab"
              aria-selected={level === candidate}
              className={level === candidate ? 'is-active' : ''}
              onClick={() => setLevel(candidate)}
            >{LEVEL_DESCRIPTIONS[candidate]}</button>
          ))}
        </div>

        <div className="teacher-worksheet-actions">
          <button className="teacher-worksheet-action teacher-worksheet-action-secondary" onClick={() => downloadWorksheetHtml(worksheet, variant)}><Icon name="link" size={18} /> HTML 저장</button>
          <button className="teacher-worksheet-action teacher-worksheet-action-primary" onClick={() => printWorksheet(worksheet, variant)}><Icon name="printer" size={18} /> 인쇄 미리보기 / 인쇄</button>
        </div>

        <div className="teacher-worksheet-workspace">
          <div className="teacher-worksheet-editor" aria-label="학습지 문구 편집">
            <div className="teacher-worksheet-editor-section">
              <h3>공통 문구</h3>
              <InputField label="학습지 제목" value={worksheet.lessonTitle} onChange={(value) => setWorksheet(current => ({ ...current, lessonTitle: value }))} />
              <InputField label="학습 목표" value={worksheet.objective} multiline onChange={(value) => setWorksheet(current => ({ ...current, objective: value }))} />
            </div>
            <div className="teacher-worksheet-editor-section">
              <h3>{LEVEL_DESCRIPTIONS[level]} 문구</h3>
              <InputField label="수준 이름" value={variant.label} onChange={(value) => updateVariant({ label: value })} />
              <InputField label="설명" value={variant.subtitle} onChange={(value) => updateVariant({ subtitle: value })} />
              <InputField label="첫 안내 문구" value={variant.instruction} multiline onChange={(value) => updateVariant({ instruction: value })} />
            </div>
            <div className="teacher-worksheet-editor-section">
              <h3>활동 문구</h3>
              {variant.activities.map((activity, index) => <ActivityEditor key={activity.id} worksheet={worksheet} level={level} activity={activity} activityIndex={index} onChange={setWorksheet} />)}
            </div>
          </div>
          <div className="teacher-worksheet-preview-panel">
            <div className="teacher-worksheet-preview-heading">
              <div><strong>A4 미리보기</strong><span>210 × 297 mm</span></div>
              {overflow && <span className="teacher-worksheet-overflow-warning" role="status"><Icon name="warning" size={16} /> 내용이 기준선을 넘습니다. 다음 A4로 나눌 수 있도록 줄여 보세요.</span>}
            </div>
            <div className="teacher-worksheet-preview-viewport">
              <WorksheetSheet worksheet={worksheet} variant={variant} sheetRef={sheetRef} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
