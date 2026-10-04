import { useState, type ChangeEvent } from 'react';
import { choiceCardImageSrc } from '../../../data/choiceCards';
import { GAME_ILLUSTRATIONS, gameIllustrationSrc } from '../../../data/gameIllustrations';
import { LEGACY_PECS_IDS, legacyPecsLabel } from '../../../data/legacyPecs';
import { MODULES } from '../../../data/modules';
import { PECS_BY_MODULE, PECS_LABELS } from '../../../data/pecs';
import type { LessonId, ModuleId } from '../../../types';
import { publicAssetUrl } from '../../../utils/publicAssetUrl';
import { lessonPictureOptions, type LessonPictureOption } from './lessonPictures';
import type { WorksheetBlock, WorksheetCard, WorksheetIllustration, WorksheetZone } from './types';

/** 그림 한 장을 고른 결과. 그림 카드 판의 카드는 글자가 그림에 인쇄돼 있다(printed). */
type PictureChoice = Pick<WorksheetCard, 'src' | 'emoji' | 'printed'> & { label?: string };

const EMOJI_CHOICES = [
  '⭐', '❤️', '👍', '👎', '✅', '❌', '⚠️', '❓', '💡', '🔍',
  '📖', '📚', '✏️', '📝', '🧰', '🤖', '💬', '📣', '🔒', '👥',
  '🧑‍🏫', '🏫', '🏠', '🚌', '🌧️', '☀️', '🍎', '🍞', '🎵', '📷',
  '🖥️', '📱', '🕒', '📅', '💰', '🧮', '🎯', '🔁', '⏰', '🧹',
];

const CARD_SIZE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: '', label: '자동(가장 크게)' },
  { value: '40', label: '작게 · 40mm' },
  { value: '48', label: '보통 · 48mm' },
  { value: '56', label: '크게 · 56mm' },
  { value: '66', label: '아주 크게 · 66mm' },
  { value: '78', label: '한 장씩 · 78mm' },
];

function newCardId(): string {
  const random = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.round(Math.random() * 100000)}`;
  return `card-${random}`;
}

function newZoneId(): string {
  return `zone-${newCardId().slice(5, 13)}`;
}

/** 그림 파일을 읽어 가로세로 640px 안으로 줄인 data 주소로 만든다(저장 공간을 아끼려는 것이다). */
async function readImageFile(file: File, maxSide = 640): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext('2d');
  if (!context) throw new Error('canvas');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  // 편집본은 브라우저 저장 공간(localStorage)에 들어간다. PNG로 두면 한 장이 수백 KB라 WebP(투명한 부분도 지킨다)로 줄이고,
  // WebP를 만들 수 없는 브라우저에서만 원래 형식으로 둔다.
  const webp = canvas.toDataURL('image/webp', 0.88);
  if (webp.startsWith('data:image/webp')) return webp;
  return canvas.toDataURL(file.type === 'image/jpeg' ? 'image/jpeg' : 'image/png', 0.88);
}

/** 알맞은 카드가 하나라도 있으면 나머지는 알맞지 않은 카드이고, 하나도 없으면 정해진 답이 없는 열린 선택이다. */
function normalizeSuitable(cards: WorksheetCard[]): WorksheetCard[] {
  const decided = cards.some(card => card.suitable === true);
  return cards.map(card => ({ ...card, suitable: decided ? card.suitable === true : undefined }));
}

/** "장면 2 · 어려운 설명" 같은 장면 이름에서 카드 글자로 쓸 뒷부분만 남긴다. */
function shortLabel(label: string): string {
  const tail = label.split('·').pop()?.trim() ?? label;
  return [...tail].length > 12 ? [...tail].slice(0, 12).join('') : tail;
}

/** 이 차시의 그림을 묶음 제목과 함께 보여 주는 격자. 카드 그림과 장면 그림 고르기가 함께 쓴다. */
function LessonPictureGrid({ options, onPick }: { options: LessonPictureOption[]; onPick: (option: LessonPictureOption) => void }) {
  const groups = [...new Set(options.map(option => option.group))];
  if (options.length === 0) return <p className="teacher-worksheet-divider-help">이 차시에 모아 둔 그림이 없어요.</p>;
  return (
    <div className="teacher-worksheet-pic-lesson">
      {groups.map(group => (
        <section key={group}>
          <h4>{group}</h4>
          <div className="teacher-worksheet-pic-grid teacher-worksheet-pic-grid-wide">
            {options.filter(option => option.group === group).map(option => (
              <button key={option.id} type="button" aria-label={option.label} onClick={() => onPick(option)}>
                <img src={option.src} alt="" loading="lazy" decoding="async" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function CardThumb({ card }: { card: WorksheetCard }) {
  if (card.src) return <img className="teacher-worksheet-pic-thumb" src={card.src} alt="" loading="lazy" />;
  return <span className="teacher-worksheet-pic-thumb teacher-worksheet-pic-thumb-emoji" aria-hidden="true">{card.emoji ?? '⭐'}</span>;
}

/**
 * 그림 고르기: 이 단원의 그림 카드, 다른 단원의 그림 카드, 옛 그림 카드, 이모지, 내 컴퓨터의 그림 파일.
 * 고른 그림은 카드에 바로 들어가고, 그림 카드를 고르면 카드 글자도 그림에 인쇄된 낱말로 바뀐다.
 */
function PicturePicker({ moduleId, lessonId, onPick, onClose }: { moduleId: ModuleId; lessonId: LessonId; onPick: (picture: PictureChoice) => void; onClose: () => void }) {
  const [source, setSource] = useState<string>(moduleId);
  const [emoji, setEmoji] = useState('');
  const [problem, setProblem] = useState('');
  const isModule = MODULES.some(module => module.id === source);
  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      onPick({ src: await readImageFile(file), emoji: undefined, printed: false });
    } catch {
      setProblem('그림을 읽지 못했어요. 다른 파일을 골라 주세요.');
    }
  };

  return (
    <div className="teacher-worksheet-pic-picker">
      <div className="teacher-worksheet-pic-picker-head">
        <label className="teacher-worksheet-block-field">
          <span>그림 고르기</span>
          <select aria-label="그림 모음" value={source} onChange={event => setSource(event.target.value)}>
            {MODULES.map(module => <option key={module.id} value={module.id}>{module.number}단원 그림 카드{module.id === moduleId ? ' (이 단원)' : ''}</option>)}
            <option value="legacy">옛 그림 카드 (사과·고양이·직업 …)</option>
            <option value="lesson">이 차시의 그림 (이야기 장면·상황 그림)</option>
            <option value="games">놀이 그림 (시계·계산기·선풍기 …)</option>
            <option value="emoji">이모지</option>
            <option value="file">내 컴퓨터의 그림 파일</option>
          </select>
        </label>
        <button type="button" onClick={onClose}>닫기</button>
      </div>
      {(isModule || source === 'legacy') && (
        <div className="teacher-worksheet-pic-grid" role="listbox" aria-label="그림 카드">
          {(isModule ? PECS_BY_MODULE[source as ModuleId] : LEGACY_PECS_IDS).map((id) => {
            const label = isModule ? (PECS_LABELS[id] ?? id) : legacyPecsLabel(id);
            const src = isModule ? choiceCardImageSrc(source as ModuleId, id) : publicAssetUrl(`/lessons/pecs/${id}.webp`);
            return (
              <button key={id} type="button" role="option" aria-selected="false" aria-label={label} onClick={() => onPick({ src, emoji: undefined, printed: true, label })}>
                <img src={src} alt="" loading="lazy" decoding="async" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      )}
      {source === 'lesson' && (
        <LessonPictureGrid
          options={lessonPictureOptions(lessonId)}
          onPick={option => onPick({ src: option.src, emoji: undefined, printed: false, label: shortLabel(option.label) })}
        />
      )}
      {source === 'games' && (
        <div className="teacher-worksheet-pic-grid" role="listbox" aria-label="놀이 그림">
          {GAME_ILLUSTRATIONS.map((item) => {
            const src = publicAssetUrl(gameIllustrationSrc(item.file));
            return (
              <button key={item.file} type="button" role="option" aria-selected="false" aria-label={item.label} onClick={() => onPick({ src, emoji: undefined, printed: false, label: item.label })}>
                <img src={src} alt="" loading="lazy" decoding="async" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
      {source === 'emoji' && (
        <div className="teacher-worksheet-pic-emoji">
          <div className="teacher-worksheet-pic-emoji-grid">
            {EMOJI_CHOICES.map(char => <button key={char} type="button" aria-label={`이모지 ${char}`} onClick={() => onPick({ emoji: char, src: undefined, printed: false })}>{char}</button>)}
          </div>
          <label className="teacher-worksheet-block-field">
            <span>다른 이모지 직접 넣기</span>
            <input value={emoji} placeholder="이모지를 붙여 넣고 Enter" onChange={event => setEmoji(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && emoji.trim()) onPick({ emoji: emoji.trim(), src: undefined, printed: false }); }} />
          </label>
        </div>
      )}
      {source === 'file' && (
        <label className="teacher-worksheet-block-field">
          <span>그림 파일 (카드 크기에 맞게 줄여서 넣어요)</span>
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>
      )}
      {problem && <p className="teacher-worksheet-pic-problem" role="alert">{problem}</p>}
    </div>
  );
}

function CardRow({ card, index, count, mode, zones, moduleId, lessonId, onChange, onMove, onRemove }: {
  key?: string;
  card: WorksheetCard;
  index: number;
  count: number;
  mode: 'choice' | 'sort' | 'single';
  zones: WorksheetZone[];
  moduleId: ModuleId;
  lessonId: LessonId;
  onChange: (patch: Partial<WorksheetCard>) => void;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  const [picking, setPicking] = useState(false);
  const name = card.label || `카드 ${index + 1}`;
  return (
    <li className="teacher-worksheet-pic-card">
      <CardThumb card={card} />
      <div className="teacher-worksheet-pic-card-fields">
        <input
          aria-label={`${name} 글자`}
          value={card.label}
          readOnly={card.printed}
          title={card.printed ? '그림에 인쇄된 글자라서 바꿀 수 없어요. 다른 그림 카드를 고르면 바뀌어요.' : undefined}
          onChange={event => onChange({ label: event.target.value })}
        />
        <input aria-label={`${name} 읽어 줄 말`} value={card.say ?? ''} placeholder="교사가 읽어 줄 문장 (정답지에 나와요)" onChange={event => onChange({ say: event.target.value || undefined })} />
        {mode === 'choice' && (
          <label className="teacher-worksheet-pic-check">
            <input type="checkbox" checked={card.suitable === true} onChange={event => onChange({ suitable: event.target.checked })} />
            알맞은 카드
          </label>
        )}
        {mode === 'sort' && (
          <label className="teacher-worksheet-pic-check">
            들어갈 칸
            <select aria-label={`${name} 들어갈 칸`} value={card.zone ?? ''} onChange={event => onChange({ zone: event.target.value || undefined })}>
              <option value="">정해지지 않음</option>
              {zones.map(zone => <option key={zone.id} value={zone.id}>{zone.label}</option>)}
            </select>
          </label>
        )}
      </div>
      <div className="teacher-worksheet-pic-card-actions">
        <button type="button" aria-label={`${name} 위로`} disabled={index === 0} onClick={() => onMove(-1)}>↑</button>
        <button type="button" aria-label={`${name} 아래로`} disabled={index === count - 1} onClick={() => onMove(1)}>↓</button>
        <button type="button" aria-label={`${name} 그림 바꾸기`} aria-expanded={picking} onClick={() => setPicking(open => !open)}>그림</button>
        <button type="button" aria-label={`${name} 삭제`} onClick={onRemove}>×</button>
      </div>
      {picking && (
        <PicturePicker
          moduleId={moduleId}
          lessonId={lessonId}
          onClose={() => setPicking(false)}
          onPick={(picture) => {
            onChange({ ...picture, label: picture.label ?? card.label });
            setPicking(false);
          }}
        />
      )}
    </li>
  );
}

function SceneField({ block, lessonId, onChange }: { block: WorksheetBlock; lessonId: LessonId; onChange: (patch: Partial<WorksheetBlock>) => void }) {
  const image = block.image;
  const [choosing, setChoosing] = useState(false);
  const pick = (option: LessonPictureOption) => {
    const next: WorksheetIllustration = { src: option.src, alt: option.alt };
    onChange({ image: next });
    setChoosing(false);
  };
  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      onChange({ image: { src: await readImageFile(file, 900), alt: file.name } });
    } catch {
      // 읽지 못한 파일은 그림을 바꾸지 않는다.
    }
  };
  return (
    <div className="teacher-worksheet-pic-scene">
      <span className="teacher-worksheet-pic-label">장면 그림</span>
      {image?.src ? <img className="teacher-worksheet-image-editor-preview" src={image.src} alt={image.alt} /> : <p className="teacher-worksheet-divider-help">장면 그림이 없어요.</p>}
      <div className="teacher-worksheet-pic-scene-actions">
        <button type="button" className="teacher-worksheet-array-add" aria-expanded={choosing} onClick={() => setChoosing(open => !open)}>이 차시의 그림에서 고르기</button>
        {image?.src && <button type="button" className="teacher-worksheet-array-add" onClick={() => onChange({ image: undefined })}>장면 그림 없애기</button>}
      </div>
      {choosing && <LessonPictureGrid options={lessonPictureOptions(lessonId)} onPick={pick} />}
      <label className="teacher-worksheet-block-field">
        <span>내 컴퓨터에서 그림 넣기</span>
        <input type="file" accept="image/*" onChange={handleFile} />
      </label>
    </div>
  );
}

function TextField({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return (
    <label className="teacher-worksheet-block-field">
      <span>{label}</span>
      {multiline
        ? <textarea rows={2} value={value} onChange={event => onChange(event.target.value)} />
        : <input value={value} onChange={event => onChange(event.target.value)} />}
    </label>
  );
}

/** 그림 고르기·낱말(문장) 따라 쓰기·그림 붙이기판의 편집 화면. */
export default function PictureBlockEditor({ block, moduleId, lessonId, onChange }: {
  block: WorksheetBlock;
  moduleId: ModuleId;
  lessonId: LessonId;
  onChange: (patch: Partial<WorksheetBlock>) => void;
}) {
  const [adding, setAdding] = useState(false);
  const cards = block.pictureCards ?? [];
  const zones = block.zones ?? [];
  const isTrace = block.kind === 'word-trace';
  const isSort = block.kind === 'picture-sort';
  const mode: 'choice' | 'sort' | 'single' = isSort ? 'sort' : 'choice';
  const blankMissing = isTrace && !!block.traceBlank && !(block.traceText ?? '').includes(block.traceBlank);

  const setCards = (next: WorksheetCard[]) => onChange({ pictureCards: block.kind === 'picture-choice' ? normalizeSuitable(next) : next });
  const patchCard = (index: number, patch: Partial<WorksheetCard>) => setCards(cards.map((card, at) => at === index ? { ...card, ...patch } : card));
  const moveCard = (index: number, direction: -1 | 1) => {
    const next = [...cards];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setCards(next);
  };
  const patchZone = (index: number, patch: Partial<WorksheetZone>) => onChange({ zones: zones.map((zone, at) => at === index ? { ...zone, ...patch } : zone) });
  const removeZone = (index: number) => {
    const gone = zones[index]?.id;
    onChange({ zones: zones.filter((_, at) => at !== index), pictureCards: cards.map(card => card.zone === gone ? { ...card, zone: undefined } : card) });
  };

  return (
    <div className="teacher-worksheet-pic-editor">
      <TextField label="제목" value={block.title ?? ''} onChange={value => onChange({ title: value })} />
      <TextField label="머리줄 안내 (제목 오른쪽의 짧은 말)" value={block.text ?? ''} onChange={value => onChange({ text: value })} />
      {!isTrace && <TextField label="물음 (학생에게 읽어 주는 한두 문장)" value={block.instruction ?? ''} multiline onChange={value => onChange({ instruction: value })} />}

      {isTrace && (
        <>
          <TextField label="따라 쓸 낱말 또는 문장" value={block.traceText ?? ''} onChange={value => onChange({ traceText: value })} />
          <TextField label="빈칸으로 둘 낱말 (문장 속 낱말, 비우면 따라 쓰기만 해요)" value={block.traceBlank ?? ''} onChange={value => onChange({ traceBlank: value || undefined })} />
          {blankMissing && <p className="teacher-worksheet-pic-note" role="status">따라 쓸 글에 “{block.traceBlank}”이(가) 없어서 빈칸이 만들어지지 않아요. 글에 있는 낱말을 그대로 적어 주세요.</p>}
          <label className="teacher-worksheet-block-field teacher-worksheet-line-count">
            <span>쓰는 줄 수</span>
            <input type="number" min={1} max={4} value={block.lineCount ?? 2} onChange={event => onChange({ lineCount: Math.max(1, Math.min(4, Number(event.target.value) || 2)) })} />
          </label>
        </>
      )}

      {!isTrace && (
        <label className="teacher-worksheet-block-field">
          <span>카드 크기</span>
          <select aria-label="카드 크기" value={block.cardSize ? String(block.cardSize) : ''} onChange={event => onChange({ cardSize: event.target.value ? Number(event.target.value) : undefined })}>
            {CARD_SIZE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
      )}

      {!isTrace && <SceneField block={block} lessonId={lessonId} onChange={onChange} />}

      {isSort && (
        <div className="teacher-worksheet-array-editor">
          <span>붙이는 칸</span>
          {zones.map((zone, index) => (
            <div className="teacher-worksheet-array-row teacher-worksheet-pic-zone-row" key={zone.id}>
              <input aria-label={`칸 ${index + 1} 이름`} value={zone.label} onChange={event => patchZone(index, { label: event.target.value })} />
              <select aria-label={`칸 ${index + 1} 표시`} value={zone.mark ?? ''} onChange={event => patchZone(index, { mark: (event.target.value || undefined) as WorksheetZone['mark'] })}>
                <option value="">표시 없음</option>
                <option value="o">○ 표시</option>
                <option value="x">✕ 표시</option>
              </select>
              <button type="button" aria-label={`칸 ${index + 1} 삭제`} disabled={zones.length <= 1} onClick={() => removeZone(index)}>×</button>
            </div>
          ))}
          <button type="button" className="teacher-worksheet-array-add" onClick={() => onChange({ zones: [...zones, { id: newZoneId(), label: '새 칸' }] })}>+ 칸 추가</button>
          <label className="teacher-worksheet-pic-check">
            <input type="checkbox" checked={block.traceZones === true} onChange={event => onChange({ traceZones: event.target.checked || undefined })} />
            칸 이름을 연한 글자로 보여 덧쓰게 해요
          </label>
        </div>
      )}

      <div className="teacher-worksheet-array-editor">
        <span>{isTrace ? '그림 카드' : '카드'}</span>
        <ul className="teacher-worksheet-pic-cards">
          {cards.map((card, index) => (
            <CardRow
              key={card.id}
              card={card}
              index={index}
              count={cards.length}
              mode={isTrace ? 'single' : mode}
              zones={zones}
              moduleId={moduleId}
              lessonId={lessonId}
              onChange={patch => patchCard(index, patch)}
              onMove={direction => moveCard(index, direction)}
              onRemove={() => setCards(cards.filter((_, at) => at !== index))}
            />
          ))}
        </ul>
        {!isTrace && (
          <>
            <button type="button" className="teacher-worksheet-array-add" aria-expanded={adding} onClick={() => setAdding(open => !open)}>+ 카드 추가</button>
            {adding && (
              <PicturePicker
                moduleId={moduleId}
                lessonId={lessonId}
                onClose={() => setAdding(false)}
                onPick={(picture) => {
                  setCards([...cards, { id: newCardId(), label: picture.label ?? '새 카드', ...picture }]);
                  setAdding(false);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
