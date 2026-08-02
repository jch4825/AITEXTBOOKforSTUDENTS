import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type CSSProperties, type RefObject } from 'react';
import Icon from '../../../components/Icon';
import { buildLessonWorksheet, mergeWorksheetDraft, worksheetStorageKey } from './buildWorksheet';
import { downloadWorksheetHtml, printWorksheet } from './worksheetHtml';
import type { LessonId } from '../../../types';
import type { LessonWorksheet, WorksheetBlock, WorksheetBlockKind, WorksheetIllustration, WorksheetLevel, WorksheetVariant } from './types';

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

const FORMAT_CATALOG: Array<{ kind: WorksheetBlockKind; label: string; description: string; glyph: string }> = [
  { kind: 'heading', label: '제목 상자', description: '큰 제목과 소제목', glyph: 'T' },
  { kind: 'text', label: '문구 상자', description: '설명·안내·짧은 글', glyph: '▤' },
  { kind: 'short-answer', label: '단답형', description: '짧은 낱말이나 답', glyph: '가' },
  { kind: 'sentence', label: '문장형', description: '두 줄 문장 답안', glyph: '문' },
  { kind: 'multiple-choice', label: '선다형', description: '보기와 선택 칸', glyph: '○' },
  { kind: 'trace', label: '덧쓰기형', description: '연한 글자 따라 쓰기', glyph: '〰' },
  { kind: 'cut-paste', label: '오려 붙이기형', description: '카드와 붙이는 칸', glyph: '✂' },
  { kind: 'draw', label: '그림 그리기형', description: '자유롭게 그리는 칸', glyph: '✎' },
  { kind: 'image', label: '이미지 상자', description: '파일·주소로 그림 넣기', glyph: '▧' },
  { kind: 'divider', label: '구분선', description: '내용을 나누는 선', glyph: '—' },
];

const FONT_SIZES = [12, 14, 16, 18, 22, 26, 32];
const DEFAULT_TEXT_COLOR = '#2f3341';
const FONT_FAMILIES = {
  sans: '"Malgun Gothic", "Apple SD Gothic Neo", sans-serif',
  serif: '"Batang", "Noto Serif KR", serif',
  hand: '"Comic Sans MS", "Malgun Gothic", cursive',
} as const;

function loadWorksheet(lessonId: LessonId): LessonWorksheet {
  const base = buildLessonWorksheet(lessonId);
  try {
    const saved = localStorage.getItem(worksheetStorageKey(lessonId));
    return saved ? mergeWorksheetDraft(base, JSON.parse(saved) as unknown) : base;
  } catch {
    return base;
  }
}

function newBlockId(kind: WorksheetBlockKind): string {
  const randomId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 100000)}`;
  return `${kind}-${randomId}`;
}

function defaultBlock(kind: WorksheetBlockKind, worksheet: LessonWorksheet): WorksheetBlock {
  const base = { id: newBlockId(kind), kind, color: DEFAULT_TEXT_COLOR, align: 'left' as const };
  switch (kind) {
    case 'heading': return { ...base, title: '제목 상자', text: '새 제목을 입력하세요.', fontSize: 26 };
    case 'text': return { ...base, title: '문구 상자', text: '설명이나 안내 문구를 입력하세요.', fontSize: 14 };
    case 'short-answer': return { ...base, title: '단답형', instruction: '짧은 낱말이나 답을 적어 보세요.', lineCount: 1, fontSize: 15 };
    case 'sentence': return { ...base, title: '문장형', instruction: '문장으로 답해 보세요.', lineCount: 2, fontSize: 15 };
    case 'multiple-choice': return { ...base, title: '선다형', instruction: '알맞은 답을 골라 보세요.', options: ['보기 1', '보기 2', '보기 3'], fontSize: 15 };
    case 'trace': return { ...base, title: '덧쓰기형', instruction: '연한 글자를 따라 천천히 써 보세요.', traceText: '따라 쓸 문장을 입력하세요.', fontSize: 21 };
    case 'cut-paste': return { ...base, title: '오려 붙이기형', instruction: '카드를 오려 알맞은 곳에 붙여 보세요.', cards: ['카드 1', '카드 2', '카드 3'], fontSize: 15 };
    case 'draw': return { ...base, title: '그림 그리기형', instruction: '떠오른 장면이나 생각을 그림으로 보여 주세요.', fontSize: 15 };
    case 'image': return { ...base, title: '이미지 상자', image: worksheet.illustration, fontSize: 14 };
    case 'divider': return { ...base, title: '구분선' };
  }
}

function updateBlock(worksheet: LessonWorksheet, level: WorksheetLevel, blockId: string, patch: Partial<WorksheetBlock>): LessonWorksheet {
  const variant = worksheet.variants[level];
  return {
    ...worksheet,
    variants: {
      ...worksheet.variants,
      [level]: {
        ...variant,
        blocks: variant.blocks.map(block => block.id === blockId ? { ...block, ...patch } : block),
      },
    },
  };
}

function replaceBlocks(worksheet: LessonWorksheet, level: WorksheetLevel, blocks: WorksheetBlock[]): LessonWorksheet {
  return {
    ...worksheet,
    variants: { ...worksheet.variants, [level]: { ...worksheet.variants[level], blocks } },
  };
}

function clampLineCount(value: string, fallback = 2): number {
  return Math.max(1, Math.min(8, Number(value) || fallback));
}

function safeColor(value: string | undefined): string {
  return /^#[0-9a-f]{3,8}$/i.test(value ?? '') ? value as string : DEFAULT_TEXT_COLOR;
}

function InputField({ label, value, onChange, multiline = false, placeholder }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value);
  return (
    <label className="teacher-worksheet-block-field">
      <span>{label}</span>
      {multiline ? (
        <textarea value={value} placeholder={placeholder} onChange={handleChange} rows={2} />
      ) : (
        <input value={value} placeholder={placeholder} onChange={handleChange} />
      )}
    </label>
  );
}

function ImageEditor({ block, onChange }: { block: WorksheetBlock; onChange: (patch: Partial<WorksheetBlock>) => void }) {
  const image = block.image;
  const updateImage = (patch: Partial<WorksheetIllustration>) => onChange({ image: { src: image?.src ?? '', alt: image?.alt ?? '학습지 이미지', caption: image?.caption, ...patch } });
  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') updateImage({ src: reader.result, alt: file.name });
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="teacher-worksheet-image-editor">
      <InputField label="이미지 주소" value={image?.src?.startsWith('data:') ? '' : image?.src ?? ''} placeholder="https://… 또는 파일 선택" onChange={(value) => updateImage({ src: value })} />
      <label className="teacher-worksheet-block-field">
        <span>내 컴퓨터에서 이미지 넣기</span>
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>
      <InputField label="이미지 설명" value={image?.alt ?? ''} onChange={(value) => updateImage({ alt: value })} />
    </div>
  );
}

function BlockStyleToolbar({ block, onChange }: { block: WorksheetBlock; onChange: (patch: Partial<WorksheetBlock>) => void }) {
  const label = block.title || '포맷';
  return (
    <div className="teacher-worksheet-block-toolbar">
      <label>
        <span>글꼴</span>
        <select aria-label={`${label} 글꼴`} value={block.fontFamily ?? 'sans'} onChange={(event) => onChange({ fontFamily: event.target.value as WorksheetBlock['fontFamily'] })}>
          <option value="sans">고딕</option>
          <option value="serif">명조</option>
          <option value="hand">손글씨</option>
        </select>
      </label>
      <label>
        <span>글자 크기</span>
        <select aria-label={`${label} 글자 크기`} value={block.fontSize ?? 15} onChange={(event) => onChange({ fontSize: Number(event.target.value) })}>
          {FONT_SIZES.map(size => <option key={size} value={size}>{size}px</option>)}
        </select>
      </label>
      <label>
        <span>글자 색</span>
        <input aria-label={`${label} 글자 색`} type="color" value={safeColor(block.color)} onChange={(event) => onChange({ color: event.target.value })} />
      </label>
      <label>
        <span>정렬</span>
        <select aria-label={`${label} 정렬`} value={block.align ?? 'left'} onChange={(event) => onChange({ align: event.target.value as WorksheetBlock['align'] })}>
          <option value="left">왼쪽</option>
          <option value="center">가운데</option>
          <option value="right">오른쪽</option>
        </select>
      </label>
    </div>
  );
}

function EditableBlock({
  block,
  index,
  count,
  worksheet,
  level,
  onChange,
  onMove,
  onDuplicate,
  onRemove,
}: {
  key?: string;
  block: WorksheetBlock;
  index: number;
  count: number;
  worksheet: LessonWorksheet;
  level: WorksheetLevel;
  onChange: (next: LessonWorksheet) => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}) {
  const patch = (next: Partial<WorksheetBlock>) => onChange(updateBlock(worksheet, level, block.id, next));
  const blockLabel = FORMAT_CATALOG.find(item => item.kind === block.kind)?.label ?? '포맷';
  const blockStyle = { '--block-font-size': `${block.fontSize ?? 15}px`, '--block-color': safeColor(block.color), fontFamily: FONT_FAMILIES[block.fontFamily ?? 'sans'], textAlign: block.align ?? 'left' } as CSSProperties;
  return (
    <article className={`teacher-worksheet-canvas-block teacher-worksheet-canvas-block-${block.kind}`} style={blockStyle}>
      <div className="teacher-worksheet-canvas-block-header">
        <span className="teacher-worksheet-canvas-block-kind">{blockLabel}</span>
        <div className="teacher-worksheet-canvas-block-actions">
          <button type="button" aria-label={`${blockLabel} 위로 이동`} disabled={index === 0} onClick={onMove.bind(null, -1)}>↑</button>
          <button type="button" aria-label={`${blockLabel} 아래로 이동`} disabled={index === count - 1} onClick={onMove.bind(null, 1)}>↓</button>
          <button type="button" aria-label={`${blockLabel} 복제`} onClick={onDuplicate}>⧉</button>
          <button type="button" aria-label={`${blockLabel} 삭제`} onClick={onRemove}>×</button>
        </div>
      </div>
      <BlockStyleToolbar block={block} onChange={patch} />
      <div className="teacher-worksheet-canvas-block-body">
        {(block.kind === 'heading' || block.kind === 'text') && (
          <InputField label={block.kind === 'heading' ? '제목' : '문구'} value={block.text ?? ''} multiline={block.kind === 'text'} onChange={(value) => patch({ text: value })} />
        )}
        {(block.kind === 'short-answer' || block.kind === 'sentence' || block.kind === 'multiple-choice' || block.kind === 'trace' || block.kind === 'cut-paste' || block.kind === 'draw') && (
          <InputField label="포맷 제목" value={block.title ?? ''} onChange={(value) => patch({ title: value })} />
        )}
        {(block.kind === 'short-answer' || block.kind === 'sentence' || block.kind === 'multiple-choice' || block.kind === 'trace' || block.kind === 'cut-paste' || block.kind === 'draw') && (
          <InputField label="안내 문구" value={block.instruction ?? ''} multiline onChange={(value) => patch({ instruction: value })} />
        )}
        {(block.kind === 'short-answer' || block.kind === 'sentence') && (
          <label className="teacher-worksheet-block-field teacher-worksheet-line-count">
            <span>답안 줄 수</span>
            <input type="number" min={1} max={8} value={block.lineCount ?? (block.kind === 'sentence' ? 2 : 1)} onChange={(event) => patch({ lineCount: clampLineCount(event.target.value, block.kind === 'sentence' ? 2 : 1) })} />
          </label>
        )}
        {block.kind === 'multiple-choice' && (
          <div className="teacher-worksheet-array-editor">
            <span>보기</span>
            {(block.options ?? []).map((option, optionIndex) => (
              <div className="teacher-worksheet-array-row" key={`${block.id}-option-${optionIndex}`}>
                <input aria-label={`보기 ${optionIndex + 1}`} value={option} onChange={(event) => patch({ options: (block.options ?? []).map((item, index) => index === optionIndex ? event.target.value : item) })} />
                <button type="button" aria-label={`보기 ${optionIndex + 1} 삭제`} onClick={() => patch({ options: (block.options ?? []).filter((_, index) => index !== optionIndex) })}>×</button>
              </div>
            ))}
            <button type="button" className="teacher-worksheet-array-add" onClick={() => patch({ options: [...(block.options ?? []), `보기 ${(block.options?.length ?? 0) + 1}`] })}>+ 보기 추가</button>
          </div>
        )}
        {block.kind === 'trace' && <InputField label="따라 쓸 문장" value={block.traceText ?? ''} multiline onChange={(value) => patch({ traceText: value })} />}
        {block.kind === 'cut-paste' && (
          <div className="teacher-worksheet-array-editor">
            <span>오릴 카드</span>
            {(block.cards ?? []).map((card, cardIndex) => (
              <div className="teacher-worksheet-array-row" key={`${block.id}-card-${cardIndex}`}>
                <input aria-label={`카드 ${cardIndex + 1}`} value={card} onChange={(event) => patch({ cards: (block.cards ?? []).map((item, index) => index === cardIndex ? event.target.value : item) })} />
                <button type="button" aria-label={`카드 ${cardIndex + 1} 삭제`} onClick={() => patch({ cards: (block.cards ?? []).filter((_, index) => index !== cardIndex) })}>×</button>
              </div>
            ))}
            <button type="button" className="teacher-worksheet-array-add" onClick={() => patch({ cards: [...(block.cards ?? []), `카드 ${(block.cards?.length ?? 0) + 1}`] })}>+ 카드 추가</button>
          </div>
        )}
        {block.kind === 'image' && <ImageEditor block={block} onChange={patch} />}
        {block.kind === 'divider' && <p className="teacher-worksheet-divider-help">학습지 내용을 나누는 선입니다. 별도 문구 없이 인쇄됩니다.</p>}
        <div className="teacher-worksheet-block-paper-preview" aria-hidden="true">
          {block.kind === 'heading' && <strong>{block.text || '제목을 입력하세요.'}</strong>}
          {block.kind === 'text' && <p>{block.text || '문구를 입력하세요.'}</p>}
          {(block.kind === 'short-answer' || block.kind === 'sentence') && <><strong>{block.title}</strong><p>{block.instruction}</p><div className="teacher-worksheet-answer-lines">{Array.from({ length: block.lineCount ?? (block.kind === 'sentence' ? 2 : 1) }, (_, lineIndex) => <i key={lineIndex} />)}</div></>}
          {block.kind === 'multiple-choice' && <><strong>{block.title}</strong><p>{block.instruction}</p><div className="teacher-worksheet-options-preview">{(block.options ?? []).map((option, optionIndex) => <span key={optionIndex}>□ {option}</span>)}</div></>}
          {block.kind === 'trace' && <><strong>{block.title}</strong><p>{block.instruction}</p><span className="teacher-worksheet-trace-preview">{block.traceText}</span></>}
          {block.kind === 'cut-paste' && <><strong>{block.title}</strong><p>{block.instruction}</p><div className="teacher-worksheet-cut-preview">{(block.cards ?? []).map((card, cardIndex) => <span key={cardIndex}>{card}</span>)}</div></>}
          {block.kind === 'draw' && <><strong>{block.title}</strong><p>{block.instruction}</p><div className="teacher-worksheet-draw-preview">여기에 그려 보세요</div></>}
          {block.kind === 'image' && block.image?.src && <img src={block.image.src} alt="" />}
          {block.kind === 'divider' && <hr />}
        </div>
      </div>
    </article>
  );
}

function WorksheetSheet({ worksheet, variant, sheetRef, onChange, onMove, onDuplicate, onRemove }: {
  worksheet: LessonWorksheet;
  variant: WorksheetVariant;
  sheetRef: RefObject<HTMLDivElement | null>;
  onChange: (next: LessonWorksheet) => void;
  onMove: (blockId: string, direction: -1 | 1) => void;
  onDuplicate: (blockId: string) => void;
  onRemove: (blockId: string) => void;
}) {
  return (
    <div className="teacher-worksheet-sheet" ref={sheetRef} style={{ '--worksheet-accent': worksheet.accent, '--worksheet-soft': worksheet.accentSoft } as CSSProperties}>
      <div className="teacher-worksheet-sheet-content">
        <header className="teacher-worksheet-sheet-meta">
          <span>{worksheet.moduleTitle}</span>
          <strong>{variant.label} · {variant.subtitle}</strong>
          <small>A4 학습지 · {worksheet.lessonId}</small>
        </header>
        <div className="teacher-worksheet-canvas-blocks">
          {variant.blocks.map((block, index) => (
            <EditableBlock
              key={block.id}
              block={block}
              index={index}
              count={variant.blocks.length}
              worksheet={worksheet}
              level={variant.level}
              onChange={onChange}
              onMove={(direction) => onMove(block.id, direction)}
              onDuplicate={() => onDuplicate(block.id)}
              onRemove={() => onRemove(block.id)}
            />
          ))}
          {variant.blocks.length === 0 && <div className="teacher-worksheet-empty-canvas">왼쪽의 포맷을 눌러 이 A4 페이지에 추가하세요.</div>}
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
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useLayoutEffect(() => {
    const measure = () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const guide = sheet.querySelector<HTMLElement>('.teacher-worksheet-page-guide');
      const canvas = sheet.querySelector<HTMLElement>('.teacher-worksheet-canvas-blocks');
      const printBlocks = sheet.querySelectorAll<HTMLElement>('.teacher-worksheet-block-paper-preview');
      const guideTop = guide?.getBoundingClientRect().top;
      const canvasTop = canvas?.getBoundingClientRect().top;
      const rowGap = canvas ? Number.parseFloat(getComputedStyle(canvas).rowGap || '0') : 0;
      let printableHeight = 0;
      printBlocks.forEach((block: HTMLElement) => {
        printableHeight += block.getBoundingClientRect().height + Number.parseFloat(getComputedStyle(block).marginTop || '0');
      });
      const estimatedPrintBottom = typeof canvasTop === 'number' ? canvasTop + printableHeight + Math.max(0, printBlocks.length - 1) * rowGap : undefined;
      setOverflow(typeof guideTop === 'number' && typeof estimatedPrintBottom === 'number' && estimatedPrintBottom > guideTop - 4);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (sheetRef.current) observer?.observe(sheetRef.current);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [worksheet, level]);

  function addBlock(kind: WorksheetBlockKind) {
    setWorksheet(current => replaceBlocks(current, level, [...current.variants[level].blocks, defaultBlock(kind, current)]));
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    setWorksheet(current => {
      const blocks = [...current.variants[level].blocks];
      const index = blocks.findIndex(block => block.id === blockId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) return current;
      [blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]];
      return replaceBlocks(current, level, blocks);
    });
  }

  function duplicateBlock(blockId: string) {
    setWorksheet(current => {
      const blocks = [...current.variants[level].blocks];
      const index = blocks.findIndex(block => block.id === blockId);
      if (index < 0) return current;
      const original = blocks[index];
      blocks.splice(index + 1, 0, { ...original, id: newBlockId(original.kind), image: original.image ? { ...original.image } : undefined, options: original.options ? [...original.options] : undefined, cards: original.cards ? [...original.cards] : undefined });
      return replaceBlocks(current, level, blocks);
    });
  }

  function removeBlock(blockId: string) {
    setWorksheet(current => replaceBlocks(current, level, current.variants[level].blocks.filter(block => block.id !== blockId)));
  }

  return (
    <div className="teacher-worksheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="teacher-worksheet-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-worksheet-title">
        <header className="teacher-worksheet-modal-header">
          <div>
            <p className="teacher-worksheet-kicker">교사 도구 · A4 학습지 편집기</p>
            <h2 id="teacher-worksheet-title">{worksheet.lessonTitle} 학습지 만들기</h2>
            <p>왼쪽 포맷을 누르면 오른쪽 A4 페이지에 추가됩니다. 추가한 블록은 직접 수정하거나 삭제할 수 있습니다.</p>
          </div>
          <button className="teacher-worksheet-close" onClick={onClose} aria-label="학습지 편집기 닫기"><Icon name="close" size={22} /></button>
        </header>

        <div className="teacher-worksheet-level-tabs" role="tablist" aria-label="학습지 수준">
          {LEVEL_ORDER.map(candidate => <button key={candidate} role="tab" aria-selected={level === candidate} className={level === candidate ? 'is-active' : ''} onClick={() => setLevel(candidate)}>{LEVEL_DESCRIPTIONS[candidate]}</button>)}
        </div>

        <div className="teacher-worksheet-actions">
          <button className="teacher-worksheet-action teacher-worksheet-action-secondary" onClick={() => downloadWorksheetHtml(worksheet, variant)}><Icon name="link" size={18} /> HTML 저장</button>
          <button className="teacher-worksheet-action teacher-worksheet-action-primary" onClick={() => printWorksheet(worksheet, variant)}><Icon name="printer" size={18} /> 인쇄 미리보기 / 인쇄</button>
        </div>

        <div className="teacher-worksheet-workspace">
          <aside className="teacher-worksheet-palette" aria-label="학습지 포맷 팔레트">
            <div className="teacher-worksheet-palette-heading">
              <h3>포맷 추가</h3>
              <p>문제 유형을 골라 A4에 넣으세요.</p>
            </div>
            <div className="teacher-worksheet-palette-list">
              {FORMAT_CATALOG.map(format => <button key={format.kind} type="button" className="teacher-worksheet-palette-item" onClick={() => addBlock(format.kind)}><span className="teacher-worksheet-palette-glyph" aria-hidden="true">{format.glyph}</span><span><strong>{format.label}</strong><small>{format.description}</small></span><b aria-hidden="true">+</b></button>)}
            </div>
            <p className="teacher-worksheet-palette-note">페이지 안의 블록에서 글자 크기·색·정렬을 바꾸고, 위·아래 이동·복제·삭제를 할 수 있습니다.</p>
          </aside>
          <div className="teacher-worksheet-preview-panel">
            <div className="teacher-worksheet-preview-heading">
              <div><strong>A4 편집 캔버스</strong><span>210 × 297 mm</span></div>
              {overflow && <span className="teacher-worksheet-overflow-warning" role="status"><Icon name="warning" size={16} /> 내용이 기준선을 넘습니다. 블록을 줄이거나 다음 장으로 나누세요.</span>}
            </div>
            <div className="teacher-worksheet-preview-viewport">
              <WorksheetSheet worksheet={worksheet} variant={variant} sheetRef={sheetRef} onChange={setWorksheet} onMove={moveBlock} onDuplicate={duplicateBlock} onRemove={removeBlock} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
