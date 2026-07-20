import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import type { StudioDefinition, SupportLevel, VisualNovelStory } from '../types';
import EditorialStudioFrame from './EditorialStudioFrame';
import { wrapDictionaryTerms } from '../../../views/lessonTextUtils';
import { STUDENT_DICTIONARY } from '../../../data/studentDictionary';

interface Props {
  definition: StudioDefinition;
  story: VisualNovelStory;
  supportLevel: SupportLevel;
  accent: string;
  secondary: string;
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
  onSupportMode,
  sceneIndex,
  onSceneIndexChange,
}: Props) {
  const { speakNow, stop } = useSpeak();
  const scene = story.scenes[sceneIndex];
  const copy = scene.copy[supportLevel];
  const activeKnowledge = story.knowledge[scene.knowledgeStep];
  const spokenText = [
    copy.text,
    copy.perspective,
    activeKnowledge.core,
    activeKnowledge.detail[supportLevel],
  ].filter(Boolean).join(' ');

  const allDictTerms = STUDENT_DICTIONARY.flatMap((entry) => [
    entry.term,
    ...(entry.aliases ?? []),
  ]);

  function selectScene(index: number) {
    stop();
    onSceneIndexChange(index);
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
          <p>{wrapDictionaryTerms(copy.text, allDictTerms)}</p>
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
            transition: 'all 0.2s',
            ...(sceneIndex === story.scenes.length - 1 ? {
              background: 'var(--paper-1)',
              color: 'var(--muted)',
              border: '2px solid var(--editorial-line)',
              boxShadow: 'none'
            } : {})
          }}
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
        <div className="flex items-center justify-between gap-3 w-full">
          <h2>AI가 무엇인지 처음 배웁니다</h2>
          <button
            type="button"
            onClick={() => speakNow(`AI가 무엇인지 처음 배웁니다. 학습 목표: ${story.objective}`)}
            className="h-8 w-8 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-110 shrink-0 shadow-xs bg-white"
            style={{ borderColor: accent, color: accent }}
            title="학습목표 듣기"
          >
            <Icon name="speaker" size={16} />
          </button>
        </div>
      </div>
      <div className="visual-novel-goal">
        <strong>학습목표</strong>
        <p>{story.objective}</p>
      </div>
      <h3>오늘 배울 개념</h3>
      <div className="visual-novel-knowledge-list">
        {story.knowledge.map((knowledge, index) => (
          <article
            key={knowledge.title}
            className="visual-novel-knowledge flex justify-between items-start gap-3"
            data-active={scene.knowledgeStep === index}
          >
            <div className="flex gap-3">
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
            </div>
            <button
              type="button"
              onClick={() => {
                let text = `개념 ${index + 1}. ${knowledge.title}. ${knowledge.core}. ${knowledge.detail[supportLevel]}`;
                if (knowledge.flow) {
                  text += `. 입력은 ${knowledge.flow.input}, 과정은 ${knowledge.flow.process}, 출력은 ${knowledge.flow.output} 입니다.`;
                }
                speakNow(text);
              }}
              className="h-7 w-7 rounded-full border flex items-center justify-center cursor-pointer transition-all hover:scale-110 shrink-0 mt-1 shadow-xs bg-white"
              style={{ borderColor: accent, color: accent }}
              title="개념 카드 듣기"
            >
              <Icon name="speaker" size={14} />
            </button>
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
