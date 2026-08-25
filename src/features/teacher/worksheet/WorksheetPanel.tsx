import { useEffect, useLayoutEffect, useRef, useState, type ChangeEvent, type CSSProperties, type RefObject } from 'react';
import Icon from '../../../components/Icon';
import { buildLessonWorksheet, mergeWorksheetDraft, worksheetStorageKey } from './buildWorksheet';
import { downloadWorksheetHtml, printWorksheet } from './worksheetHtml';
import type { LessonId } from '../../../types';
import { worksheetPagesForVariant, worksheetVariantWithPages, type LessonWorksheet, type WorksheetBlock, type WorksheetBlockKind, type WorksheetIllustration, type WorksheetLevel, type WorksheetPage, type WorksheetVariant } from './types';

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

function newPageId(level: WorksheetLevel): string {
  const randomId = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 100000)}`;
  return `${level}-page-${randomId}`;
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
  const pages = worksheetPagesForVariant(variant).map(page => ({
    ...page,
    blocks: page.blocks.map(block => block.id === blockId ? { ...block, ...patch } : block),
  }));
  return {
    ...worksheet,
    variants: { ...worksheet.variants, [level]: worksheetVariantWithPages(variant, pages) },
  };
}

function replacePages(worksheet: LessonWorksheet, level: WorksheetLevel, pages: WorksheetPage[]): LessonWorksheet {
  const variant = worksheet.variants[level];
  return {
    ...worksheet,
    variants: { ...worksheet.variants, [level]: worksheetVariantWithPages(variant, pages) },
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

function PreviewReferenceImage({ image }: { image?: WorksheetIllustration }) {
  if (!image?.src) return null;
  return (
    <figure className="teacher-worksheet-preview-reference">
      <img src={image.src} alt={image.alt} />
      {image.caption && <figcaption>{image.caption}</figcaption>}
    </figure>
  );
}

function PreviewAnswerLines({ count }: { count: number }) {
  return <div className="teacher-worksheet-preview-answer-lines" aria-hidden="true">{Array.from({ length: Math.max(1, Math.min(8, count)) }, (_, index) => <i key={index} />)}</div>;
}

function WorksheetBlockPreview({
  block,
  onEdit,
}: {
  key?: string;
  block: WorksheetBlock;
  onEdit: () => void;
}) {
  const blockLabel = FORMAT_CATALOG.find(item => item.kind === block.kind)?.label ?? '포맷';
  const blockStyle = { '--block-font-size': `${block.fontSize ?? 15}px`, '--block-color': safeColor(block.color), fontFamily: FONT_FAMILIES[block.fontFamily ?? 'sans'], textAlign: block.align ?? 'left' } as CSSProperties;
  return (
    <article className={`teacher-worksheet-preview-block teacher-worksheet-preview-block-${block.kind}`} style={blockStyle}>
      <div className="teacher-worksheet-preview-block-actions" aria-label={`${blockLabel} 조작`}>
        <span className="teacher-worksheet-preview-kind">{blockLabel}</span>
        <div>
          <button type="button" className="teacher-worksheet-preview-edit" aria-label={`${blockLabel} 수정`} onClick={onEdit}>수정</button>
        </div>
      </div>
      <div className="teacher-worksheet-preview-block-content">
        {block.kind === 'heading' && <h1>{block.text || '제목을 입력하세요.'}</h1>}
        {block.kind === 'text' && <p className="teacher-worksheet-preview-text">{block.text || '문구를 입력하세요.'}</p>}
        {(block.kind === 'short-answer' || block.kind === 'sentence') && <>
          <h2>{block.title}</h2>
          <PreviewReferenceImage image={block.image} />
          <p>{block.instruction}</p>
          <PreviewAnswerLines count={block.lineCount ?? (block.kind === 'sentence' ? 2 : 1)} />
        </>}
        {block.kind === 'multiple-choice' && <>
          <h2>{block.title}</h2>
          <PreviewReferenceImage image={block.image} />
          <p>{block.instruction}</p>
          <div className="teacher-worksheet-preview-options">{(block.options ?? []).map((option, optionIndex) => <span key={optionIndex}>□ {option}</span>)}</div>
        </>}
        {block.kind === 'trace' && <>
          <h2>{block.title}</h2>
          <PreviewReferenceImage image={block.image} />
          <p>{block.instruction}</p>
          <span className="teacher-worksheet-preview-trace">{block.traceText}</span>
          <PreviewAnswerLines count={block.lineCount ?? 1} />
        </>}
        {block.kind === 'cut-paste' && <>
          <h2>{block.title}</h2>
          <PreviewReferenceImage image={block.image} />
          <p>{block.instruction}</p>
          <div className="teacher-worksheet-preview-paste-targets"><span>붙이는 곳</span><span>붙이는 곳</span><span>붙이는 곳</span></div>
          <div className="teacher-worksheet-preview-cards">{(block.cards ?? []).map((card, cardIndex) => <span key={cardIndex}>{card}</span>)}</div>
        </>}
        {block.kind === 'draw' && <>
          <h2>{block.title}</h2>
          <PreviewReferenceImage image={block.image} />
          <p>{block.instruction}</p>
          <div className="teacher-worksheet-preview-draw">여기에 그려 보세요</div>
        </>}
        {block.kind === 'image' && <PreviewReferenceImage image={block.image} />}
        {block.kind === 'divider' && <hr />}
      </div>
    </article>
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
  onDone,
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
  onDone: () => void;
}) {
  const patch = (next: Partial<WorksheetBlock>) => onChange(updateBlock(worksheet, level, block.id, next));
  const blockLabel = FORMAT_CATALOG.find(item => item.kind === block.kind)?.label ?? '포맷';
  const blockStyle = { '--block-font-size': `${block.fontSize ?? 15}px`, '--block-color': safeColor(block.color), fontFamily: FONT_FAMILIES[block.fontFamily ?? 'sans'], textAlign: block.align ?? 'left' } as CSSProperties;
  return (
    <article className={`teacher-worksheet-canvas-block teacher-worksheet-canvas-block-${block.kind}`} style={blockStyle}>
      <div className="teacher-worksheet-canvas-block-header">
        <span className="teacher-worksheet-canvas-block-kind">{blockLabel}</span>
        <div className="teacher-worksheet-canvas-block-actions">
          <button type="button" className="teacher-worksheet-editor-done" onClick={onDone}>수정 완료</button>
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
        {(block.kind === 'image' || block.image) && <ImageEditor block={block} onChange={patch} />}
        {block.kind === 'divider' && <p className="teacher-worksheet-divider-help">학습지 내용을 나누는 선입니다. 별도 문구 없이 인쇄됩니다.</p>}
      </div>
    </article>
  );
}

function WorksheetSheet({ worksheet, variant, page, pageIndex, pageCount, sheetRef, onEdit }: {
  worksheet: LessonWorksheet;
  variant: WorksheetVariant;
  page: WorksheetPage;
  pageIndex: number;
  pageCount: number;
  sheetRef: RefObject<HTMLDivElement | null>;
  onEdit: (blockId: string) => void;
}) {
  return (
    <div className="teacher-worksheet-sheet" ref={sheetRef} style={{ '--worksheet-accent': worksheet.accent, '--worksheet-soft': worksheet.accentSoft } as CSSProperties}>
      <div className="teacher-worksheet-sheet-content">
        <header className="teacher-worksheet-sheet-meta">
          <span>{worksheet.moduleTitle}</span>
          <strong>{variant.label} · {variant.subtitle}</strong>
          <small>A4 학습지 · {pageIndex + 1}/{pageCount}</small>
        </header>
        <div className="teacher-worksheet-canvas-blocks">
          {page.blocks.map(block => (
            <WorksheetBlockPreview
              key={block.id}
              block={block}
              onEdit={() => onEdit(block.id)}
            />
          ))}
          {page.blocks.length === 0 && <div className="teacher-worksheet-empty-canvas">포맷 추가 버튼으로 이 페이지를 채우세요.</div>}
        </div>
      </div>
      <div className="teacher-worksheet-page-guide">A4 한 장 기준선</div>
      <footer className="teacher-worksheet-sheet-footer"><span>이름: ____________________</span><span>{worksheet.lessonId}</span></footer>
    </div>
  );
}

export default function WorksheetPanel({ lessonId, onClose }: Props) {
  const [worksheet, setWorksheet] = useState<LessonWorksheet>(() => loadWorksheet(lessonId));

  /**
   * 저장한 편집본을 버리고 현재 수업 데이터로 다시 만든다.
   * 학습지는 스튜디오·포트폴리오에서 자동으로 조립되지만, 교사가 한 번 편집해 저장하면
   * 그 편집본이 고정된다. 이후 차시 내용이 바뀌면 학습지만 옛 내용에 머무르게 되므로
   * 되돌릴 길을 남겨 둔다.
   */
  function rebuildFromLesson() {
    if (!window.confirm('이 차시에 저장한 학습지 편집 내용을 버리고 현재 수업 내용으로 다시 만듭니다. 계속할까요?')) return;
    try {
      localStorage.removeItem(worksheetStorageKey(lessonId));
    } catch {
      // 저장소를 못 쓰는 환경에서도 화면은 다시 만든다.
    }
    setWorksheet(buildLessonWorksheet(lessonId));
    setActivePageId(null);
    setEditingBlockId(null);
  }
  const [level, setLevel] = useState<WorksheetLevel>('high');
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showPalette, setShowPalette] = useState(false);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const [overflow, setOverflow] = useState(false);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const variant = worksheet.variants[level];
  const pages = worksheetPagesForVariant(variant);
  const activePageIndex = Math.max(0, pages.findIndex(page => page.id === activePageId));
  const activePage = pages[activePageIndex] ?? pages[0];
  const editingBlock = activePage.blocks.find(block => block.id === editingBlockId);

  useEffect(() => {
    try { localStorage.setItem(worksheetStorageKey(lessonId), JSON.stringify(worksheet)); } catch { /* 저장소가 막힌 환경에서도 편집은 계속한다. */ }
  }, [lessonId, worksheet]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    setActivePageId(current => current && pages.some(page => page.id === current) ? current : pages[0]?.id ?? null);
  }, [level, worksheet]);

  useLayoutEffect(() => {
    const measure = () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      const guide = sheet.querySelector<HTMLElement>('.teacher-worksheet-page-guide');
      const printBlocks = sheet.querySelectorAll<HTMLElement>('.teacher-worksheet-preview-block');
      const guideTop = guide?.getBoundingClientRect().top;
      const lastBlock = printBlocks.item(printBlocks.length - 1);
      const estimatedPrintBottom = lastBlock?.getBoundingClientRect().bottom;
      setOverflow(typeof guideTop === 'number' && typeof estimatedPrintBottom === 'number' && estimatedPrintBottom > guideTop);
    };
    measure();
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    if (sheetRef.current) observer?.observe(sheetRef.current);
    window.addEventListener('resize', measure);
    return () => { observer?.disconnect(); window.removeEventListener('resize', measure); };
  }, [worksheet, level]);

  useLayoutEffect(() => {
    previewViewportRef.current?.scrollTo({ top: 0, left: 0 });
  }, [level, activePageId]);

  function addBlock(kind: WorksheetBlockKind) {
    setWorksheet(current => {
      const currentVariant = current.variants[level];
      const currentPages = worksheetPagesForVariant(currentVariant);
      const pageIndex = Math.max(0, currentPages.findIndex(page => page.id === activePageId));
      const nextPages = currentPages.map((page, index) => index === pageIndex
        ? { ...page, blocks: [...page.blocks, defaultBlock(kind, current)] }
        : page);
      return replacePages(current, level, nextPages);
    });
  }

  function addPage() {
    const pageId = newPageId(level);
    setWorksheet(current => replacePages(current, level, [...worksheetPagesForVariant(current.variants[level]), { id: pageId, blocks: [] }]));
    setActivePageId(pageId);
    setEditingBlockId(null);
  }

  function removePage() {
    if (pages.length <= 1) return;
    const pageIndex = Math.max(0, pages.findIndex(page => page.id === activePageId));
    const nextPages = pages.filter((_, index) => index !== pageIndex);
    setWorksheet(current => replacePages(current, level, nextPages));
    setActivePageId(nextPages[Math.max(0, pageIndex - 1)]?.id ?? nextPages[0]?.id ?? null);
    setEditingBlockId(null);
  }

  function moveBlock(blockId: string, direction: -1 | 1) {
    setWorksheet(current => {
      const currentPages = worksheetPagesForVariant(current.variants[level]);
      const pageIndex = Math.max(0, currentPages.findIndex(page => page.id === activePageId));
      const blocks = [...currentPages[pageIndex].blocks];
      const index = blocks.findIndex(block => block.id === blockId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) return current;
      [blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]];
      return replacePages(current, level, currentPages.map((page, index) => index === pageIndex ? { ...page, blocks } : page));
    });
  }

  function duplicateBlock(blockId: string) {
    setWorksheet(current => {
      const currentPages = worksheetPagesForVariant(current.variants[level]);
      const pageIndex = Math.max(0, currentPages.findIndex(page => page.id === activePageId));
      const blocks = [...currentPages[pageIndex].blocks];
      const index = blocks.findIndex(block => block.id === blockId);
      if (index < 0) return current;
      const original = blocks[index];
      blocks.splice(index + 1, 0, { ...original, id: newBlockId(original.kind), image: original.image ? { ...original.image } : undefined, options: original.options ? [...original.options] : undefined, cards: original.cards ? [...original.cards] : undefined });
      return replacePages(current, level, currentPages.map((page, index) => index === pageIndex ? { ...page, blocks } : page));
    });
  }

  function removeBlock(blockId: string) {
    setWorksheet(current => {
      const currentPages = worksheetPagesForVariant(current.variants[level]);
      const pageIndex = Math.max(0, currentPages.findIndex(page => page.id === activePageId));
      return replacePages(current, level, currentPages.map((page, index) => index === pageIndex
        ? { ...page, blocks: page.blocks.filter(block => block.id !== blockId) }
        : page));
    });
  }

  return (
    <div className="teacher-worksheet-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="teacher-worksheet-modal" role="dialog" aria-modal="true" aria-labelledby="teacher-worksheet-title">
        <header className="teacher-worksheet-modal-header">
          <div>
            <p className="teacher-worksheet-kicker">교사 도구 · A4 학습지 편집기</p>
            <h2 id="teacher-worksheet-title">{worksheet.lessonTitle} 학습지 만들기</h2>
            <p>완성된 A4 미리보기로 시작합니다. 각 문항의 수정 버튼을 눌러 글꼴·문구·그림을 바꿀 수 있습니다.</p>
          </div>
          <button className="teacher-worksheet-close" onClick={onClose} aria-label="학습지 편집기 닫기"><Icon name="close" size={22} /></button>
        </header>

        <div className="teacher-worksheet-level-tabs" role="tablist" aria-label="학습지 수준">
          {LEVEL_ORDER.map(candidate => <button key={candidate} role="tab" aria-selected={level === candidate} className={level === candidate ? 'is-active' : ''} onClick={() => { setLevel(candidate); setActivePageId(null); setEditingBlockId(null); }}>{LEVEL_DESCRIPTIONS[candidate]}</button>)}
        </div>

        <div className="teacher-worksheet-actions">
          <button className="teacher-worksheet-action teacher-worksheet-action-secondary" aria-expanded={showPalette} onClick={() => setShowPalette(current => !current)}><Icon name="pen" size={18} /> {showPalette ? '포맷 닫기' : '포맷 추가'}</button>
          <button className="teacher-worksheet-action teacher-worksheet-action-secondary" onClick={rebuildFromLesson}><Icon name="refresh" size={18} /> 수업 내용으로 다시 만들기</button>
          <button className="teacher-worksheet-action teacher-worksheet-action-secondary" onClick={() => downloadWorksheetHtml(worksheet, variant)}><Icon name="link" size={18} /> HTML 저장</button>
          <button className="teacher-worksheet-action teacher-worksheet-action-primary" onClick={() => printWorksheet(worksheet, variant)}><Icon name="printer" size={18} /> 인쇄 미리보기 / 인쇄</button>
        </div>

        <div className="teacher-worksheet-page-controls" role="group" aria-label="학습지 페이지">
          <span className="teacher-worksheet-page-controls-label">페이지</span>
          {pages.map((page, pageIndex) => <button key={page.id} type="button" aria-pressed={page.id === activePage.id} className={page.id === activePage.id ? 'is-active' : ''} onClick={() => { setActivePageId(page.id); setEditingBlockId(null); }}>{pageIndex + 1}</button>)}
          <button type="button" className="teacher-worksheet-page-add" onClick={addPage}>+ 페이지 추가</button>
          <button type="button" className="teacher-worksheet-page-remove" onClick={removePage} disabled={pages.length <= 1}>페이지 삭제</button>
        </div>

        <div className={`teacher-worksheet-workspace${showPalette ? ' has-palette' : ''}`}>
          {showPalette && <aside className="teacher-worksheet-palette" aria-label="학습지 포맷 팔레트">
            <div className="teacher-worksheet-palette-heading">
              <h3>포맷 추가</h3>
              <p>필요한 문제 유형을 골라 현재 페이지의 다음 위치에 추가하세요. 새 페이지를 만든 뒤에는 그 페이지 첫 부분에 들어갑니다.</p>
            </div>
            <div className="teacher-worksheet-palette-list">
              {FORMAT_CATALOG.map(format => <button key={format.kind} type="button" className="teacher-worksheet-palette-item" onClick={() => addBlock(format.kind)}><span className="teacher-worksheet-palette-glyph" aria-hidden="true">{format.glyph}</span><span><strong>{format.label}</strong><small>{format.description}</small></span><b aria-hidden="true">+</b></button>)}
            </div>
            <p className="teacher-worksheet-palette-note">기본 학습지는 이미 완성되어 있습니다. 필요한 포맷만 추가하세요.</p>
          </aside>}
          <div className="teacher-worksheet-preview-panel">
            <div className="teacher-worksheet-preview-heading">
              <div><strong>A4 미리보기 · 페이지 {activePageIndex + 1}/{pages.length}</strong><span>210 × 297 mm · 인쇄본과 같은 내용</span></div>
              {overflow && <span className="teacher-worksheet-overflow-warning" role="status"><Icon name="warning" size={16} /> 내용이 기준선을 넘습니다. 블록을 줄이거나 다음 장으로 나누세요.</span>}
            </div>
            <div className="teacher-worksheet-preview-viewport" ref={previewViewportRef}>
              <WorksheetSheet worksheet={worksheet} variant={variant} page={activePage} pageIndex={activePageIndex} pageCount={pages.length} sheetRef={sheetRef} onEdit={setEditingBlockId} />
            </div>
            {editingBlock && <div className="teacher-worksheet-editor-dock">
              <div className="teacher-worksheet-editor-dock-heading">
                <div><strong>{editingBlock.title || FORMAT_CATALOG.find(item => item.kind === editingBlock.kind)?.label || '문항'} 수정</strong><span>수정한 내용은 미리보기와 인쇄본에 바로 반영됩니다.</span></div>
                <button type="button" onClick={() => setEditingBlockId(null)}>닫기</button>
              </div>
              <EditableBlock
                block={editingBlock}
                index={activePage.blocks.findIndex(block => block.id === editingBlock.id)}
                count={activePage.blocks.length}
                worksheet={worksheet}
                level={variant.level}
                onChange={setWorksheet}
                onMove={(direction) => moveBlock(editingBlock.id, direction)}
                onDuplicate={() => duplicateBlock(editingBlock.id)}
                onRemove={() => { removeBlock(editingBlock.id); setEditingBlockId(null); }}
                onDone={() => setEditingBlockId(null)}
              />
            </div>}
          </div>
        </div>
      </section>
    </div>
  );
}
