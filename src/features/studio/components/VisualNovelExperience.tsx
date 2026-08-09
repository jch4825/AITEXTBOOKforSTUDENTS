import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import type { StudioDefinition, SupportLevel, VisualNovelStory } from '../types';
import ConceptNotes from './ConceptNotes';
import EditorialStudioFrame from './EditorialStudioFrame';
import SpeakerDialogue from './SpeakerDialogue';
import { wrapDictionaryTerms } from '../../../views/lessonTextUtils';
import { STUDENT_DICTIONARY } from '../../../data/studentDictionary';
import { publicAssetUrl } from '../../../utils/publicAssetUrl';
import { playSound } from '../../../utils/sound';
import { cleanStudioIllustrationAlt } from '../studioIllustrations';
import FinalSceneSparkles from './FinalSceneSparkles';

interface Props {
  definition: StudioDefinition;
  story: VisualNovelStory;
  supportLevel: SupportLevel;
  accent: string;
  secondary: string;
  onSupportMode: (mode: string) => void;
  sceneIndex: number;
  onSceneIndexChange: (index: number) => void;
  /** 개념 카드를 이야기 옆에 함께 둘지. 포맷 A~E는 정리 노트 화면으로 미룬다. */
  showKnowledge?: boolean;
}

export default function VisualNovelExperience({
  definition,
  story,
  supportLevel,
  accent,
  secondary,
  onSupportMode,
  sceneIndex,
  onSceneIndexChange,
  showKnowledge = true,
}: Props) {
  const { speakNow, stop } = useSpeak();
  const scene = story.scenes[sceneIndex];
  const isFinalScene = sceneIndex === story.scenes.length - 1;
  const showFinalSceneSparkles = story.celebrateFinalScene === true && isFinalScene;
  const copy = scene.copy[supportLevel];
  const activeKnowledge = story.knowledge[scene.knowledgeStep];
  const spokenText = [
    copy.text,
    copy.perspective,
    activeKnowledge.core,
    supportLevel !== 'full' ? activeKnowledge.detail[supportLevel] : null,
  ].filter(Boolean).join(' ');

  const allDictTerms = STUDENT_DICTIONARY.flatMap((entry) => [
    entry.term,
    ...(entry.aliases ?? []),
  ]);

  function selectScene(index: number) {
    // 읽어 주기를 먼저 멈춰야 장면 넘김 소리가 말소리에 막히지 않는다.
    stop();
    playSound('scene-next');
    onSceneIndexChange(index);
  }

  function speakCurrentScene() {
    onSupportMode('visual-novel-tts');
    speakNow(spokenText);
  }

  const left = (
    <section className="visual-novel-story-page" aria-label="생활 속 이야기">
      <div className="visual-novel-page-heading">
        <h2>{story.title}</h2>
      </div>
      {/* 시즌 자막은 네 장면 내내 남는다. 05-ENGINE-SPEC §4는 첫 장면만 띄우도록
          했지만, 장면을 넘기면 지금이 무슨 이야기인지 화면에서 사라져 상황을 다시
          잡아야 했다. 자리는 원래도 비워 둔 채 숨기기만 했으므로 세로 공간은
          그대로다(99-TRACKER 기록). */}
      {story.seasonTag ? (
        <p className="visual-novel-season-tag" style={{ color: secondary, borderColor: secondary }}>
          {story.seasonTag}
        </p>
      ) : null}
      <div className="visual-novel-stage">
        <div className="visual-novel-image-frame">
          {scene.imageSrc ? (
            // key를 장면마다 갈아 끼워야 새 장면에서 미세 모션이 다시 흐른다.
            // 같은 노드에 src만 바꾸면 애니메이션이 재생되지 않고, 새 그림이 뜰 때까지
            // 앞 장면 그림이 남아 대사와 어긋나 보이기도 한다.
            <img
              key={scene.id}
              className="visual-novel-scene"
              src={publicAssetUrl(scene.imageSrc)}
              alt={cleanStudioIllustrationAlt(scene.alt)}
            />
          ) : (
            <div
              className="visual-novel-scene flex min-h-72 items-center justify-center bg-[color:var(--paper-1)]"
              role="img"
              aria-label={`${scene.alt}. 새 장면 이미지를 넣을 자리입니다.`}
              data-image-slot="pending"
            >
              <span className="rounded-full border border-dashed px-4 py-2 text-sm font-bold text-[color:var(--muted)]">
                장면 이미지 자리
              </span>
            </div>
          )}
          <span className="visual-novel-scene-label">{scene.label}</span>
          <button type="button" className="visual-novel-listen" onClick={speakCurrentScene}>
            <Icon name="speaker" size={18} /> 대사 듣기
          </button>
        </div>
        <div className="visual-novel-dialogue">
          <SpeakerDialogue text={copy.text} dictionaryTerms={allDictTerms} />
          {copy.perspective && (
            <p className="visual-novel-perspective">
              {wrapDictionaryTerms(copy.perspective, allDictTerms)}
            </p>
          )}
        </div>
      </div>
      <div className="visual-novel-controls" aria-label="이야기 장면 선택">
        <div className="visual-novel-scene-picker">
          {story.scenes.map((item, index) => (
            <button
              type="button"
              key={item.id}
              onClick={() => selectScene(index)}
              aria-label={`장면 ${index + 1} 보기`}
              aria-pressed={sceneIndex === index}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <span className="visual-novel-scene-count">{sceneIndex + 1} / {story.scenes.length}</span>
        <button
          type="button"
          className="visual-novel-next"
          style={{
            cursor: 'pointer',
            // all을 쓰면 outline·outline-offset까지 전환 대상이 되어 :focus-visible 링이
            // 목표값에 도달하지 못하고 사라진다. 실제로 바뀌는 속성만 전환한다.
            transition: 'background-color 0.2s, color 0.2s, border-color 0.2s',
            ...(isFinalScene ? {
              background: 'var(--paper-1)',
              color: 'var(--muted)',
              border: '2px solid var(--editorial-line)',
              boxShadow: 'none'
            } : {})
          }}
          onClick={() => selectScene(isFinalScene ? 0 : sceneIndex + 1)}
          aria-label={isFinalScene ? '이야기 처음부터 보기' : '다음 장면 보기'}
        >
          <span>{isFinalScene ? '처음부터' : '다음 장면'}</span>
          <Icon name={isFinalScene ? 'refresh' : 'chevron-right'} size={20} />
        </button>
      </div>
    </section>
  );

  const right = (
    <section className="visual-novel-knowledge-page" aria-label="학습목표와 지식 설명">
      <div className="visual-novel-page-heading">
        <p className="studio-kicker" style={{ color: accent }}>
          {definition.lessonId ? `${definition.lessonId.split('-l')[1]}차시` : '학습'}
        </p>
        <div className="flex items-center justify-between gap-3 w-full">
          <h2>{definition.title}</h2>
          <button
            type="button"
            onClick={() => speakNow(`${definition.title}. 학습 목표: ${story.objective}`)}
            className="h-8 w-8 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-110 shrink-0 depth-paper bg-white"
            style={{ borderColor: accent, color: accent }}
            title="학습목표 듣기"
          >
            <Icon name="speaker" size={16} />
          </button>
        </div>
      </div>
      <div className="visual-novel-goal">
        <strong>학습목표</strong>
        <p>{wrapDictionaryTerms(story.objective, allDictTerms)}</p>
      </div>
      <h3>오늘 배울 개념</h3>
      <ConceptNotes
        knowledge={story.knowledge}
        supportLevel={supportLevel}
        accent={accent}
        dictionaryTerms={allDictTerms}
        activeIndex={scene.knowledgeStep}
      />
    </section>
  );

  return (
    <>
      {showFinalSceneSparkles ? (
        <>
          <FinalSceneSparkles />
          <span className="sr-only" role="status">이야기를 모두 보았습니다.</span>
        </>
      ) : null}
      <EditorialStudioFrame
        definition={definition}
        stage="encounter"
        accent={accent}
        secondary={secondary}
        left={left}
        // 개념 카드를 이야기 옆에 늘 띄우면 이야기를 읽기 전에 답이 보인다.
        // 포맷 A~E는 오른쪽 면을 비워 이야기를 지면 전체로 펼친다.
        right={showKnowledge ? right : undefined}
        spreadClassName="studio-editorial-scenario"
        frameClassName={showKnowledge ? undefined : 'studio-editorial-scenario-frame'}
      />
    </>
  );
}
