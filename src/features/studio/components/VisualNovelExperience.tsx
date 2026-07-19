import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import type { StudioDefinition, SupportLevel, VisualNovelStory } from '../types';
import EditorialStudioFrame from './EditorialStudioFrame';

interface Props {
  definition: StudioDefinition;
  story: VisualNovelStory;
  supportLevel: SupportLevel;
  accent: string;
  secondary: string;
  onCompleted: () => void;
  onSupportMode: (mode: string) => void;
  sceneIndex: number;
  onSceneIndexChange: (index: number) => void;
}

export default function VisualNovelExperience({
  definition,
  story,
  supportLevel,
  accent,
  secondary,
  onCompleted,
  onSupportMode,
  sceneIndex,
  onSceneIndexChange,
}: Props) {
  const { speakNow } = useSpeak();
  const scene = story.scenes[sceneIndex];
  const copy = scene.copy[supportLevel];
  const activeKnowledge = story.knowledge[scene.knowledgeStep];
  const spokenText = [
    copy.text,
    copy.perspective,
    activeKnowledge.core,
    activeKnowledge.detail[supportLevel],
  ].filter(Boolean).join(' ');

  function selectScene(index: number) {
    onSceneIndexChange(index);
    if (index === story.scenes.length - 1) onCompleted();
  }

  function speakCurrentScene() {
    onSupportMode('visual-novel-tts');
    speakNow(spokenText);
  }

  const left = (
    <section className="visual-novel-story-page" aria-label="생활 장면 이야기">
      <div className="visual-novel-page-heading">
        <h2>{story.title}</h2>
      </div>
      <div className="visual-novel-stage">
        <div className="visual-novel-image-frame">
          <img className="visual-novel-scene" src={scene.imageSrc} alt={scene.alt} />
          <span className="visual-novel-scene-label">{scene.label}</span>
          <button type="button" className="visual-novel-listen" onClick={speakCurrentScene}>
            <Icon name="speaker" size={18} /> 대사 듣기
          </button>
        </div>
        <div className="visual-novel-dialogue">
          <p>{copy.text}</p>
          {copy.perspective && <p className="visual-novel-perspective">{copy.perspective}</p>}
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
          onClick={() => selectScene(sceneIndex === story.scenes.length - 1 ? 0 : sceneIndex + 1)}
          aria-label={sceneIndex === story.scenes.length - 1 ? '이야기 처음부터 보기' : '다음 장면 보기'}
        >
          <span>{sceneIndex === story.scenes.length - 1 ? '처음부터' : '다음 장면'}</span>
          <Icon name={sceneIndex === story.scenes.length - 1 ? 'refresh' : 'chevron-right'} size={20} />
        </button>
      </div>
    </section>
  );

  const right = (
    <section className="visual-novel-knowledge-page" aria-label="학습목표와 지식 설명">
      <div className="visual-novel-page-heading">
        <p className="studio-kicker" style={{ color: accent }}>1차시</p>
        <h2>AI가 무엇인지 처음 배웁니다</h2>
      </div>
      <div className="visual-novel-goal">
        <strong>학습목표</strong>
        <p>{story.objective}</p>
      </div>
      <h3>이야기와 함께 알아봅니다</h3>
      <div className="visual-novel-knowledge-list">
        {story.knowledge.map((knowledge, index) => (
          <article
            key={knowledge.title}
            className="visual-novel-knowledge"
            data-active={scene.knowledgeStep === index}
          >
            <span>{index + 1}</span>
            <div>
              <h4>{knowledge.title}</h4>
              <p><strong>{knowledge.core}</strong></p>
              <p>{knowledge.detail[supportLevel]}</p>
              {knowledge.flow && (
                <div
                  className="visual-novel-flow"
                  aria-label={`${knowledge.flow.input}, ${knowledge.flow.process}, ${knowledge.flow.output}`}
                >
                  <b>{knowledge.flow.input}</b>
                  <i aria-hidden>→</i>
                  <b>{knowledge.flow.process}</b>
                  <i aria-hidden>→</i>
                  <b>{knowledge.flow.output}</b>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  return (
    <EditorialStudioFrame
      definition={definition}
      stage="encounter"
      accent={accent}
      secondary={secondary}
      left={left}
      right={right}
    />
  );
}
