import { createPortal } from 'react-dom';
import type { ModulePortfolioDefinition } from '../../../data/modulePortfolios/types';

interface Props {
  definition: ModulePortfolioDefinition;
  selectedArtifacts: readonly string[];
  guideCopy: Record<string, string>;
}

/** 빈 칸에 남기는 손글씨 줄 수. 설명서 칸은 네 줄, 탐구 기록은 고를 기록 수(3개 이상)만큼. */
const GUIDE_BLANK_LINES = 4;
const RECORD_BLANK_LINES = 3;

function BlankLines({ count }: { count: number }) {
  return (
    <div className="module-close-print-lines">
      {Array.from({ length: count }, (_, index) => <i key={index} />)}
    </div>
  );
}

/**
 * 단원 마무리의 인쇄용 설명서 한 장. 화면에는 보이지 않고 인쇄할 때만 나온다.
 *
 * 학습 화면 틀은 높이가 창에 묶인 안쪽 스크롤 칸이라, 화면을 그대로 인쇄하면 첫 화면만 잘려 찍혔다
 * (그 전에는 상장용 전역 `#root` 숨김 때문에 빈 쪽이었다). 그래서 상장 창처럼 body 바로 아래, 곧 #root 밖에
 * 종이 한 장을 따로 두고, 인쇄할 때는 #root를 감춘다(index.css의 `body:has(.module-close-print-sheet) #root`).
 *
 * 찍는 것은 1단계에서 고른 탐구 기록과 2단계 설명서 세 칸이다. 1단계 안내가 "설명서에 넣을 기록을 고르라"고
 * 하므로 이 둘이 곧 설명서다. 학생 글은 textarea가 아니라 문단으로 찍는다(textarea는 보이는 줄만 찍혀 긴 글이
 * 잘린다). 빈 칸에는 손으로 쓸 줄을 남긴다. 이 화면은 이름을 받지 않으므로 이름과 날짜도 손으로 쓴다.
 */
export default function ModuleClosePrintSheet({ definition, selectedArtifacts, guideCopy }: Props) {
  const choices = definition.artifactChoices ?? [];
  const records = choices.filter((choice) => selectedArtifacts.includes(choice.lessonId));
  const sections = definition.guideSections ?? [];

  return createPortal(
    <article className="module-close-print-sheet">
      <header className="module-close-print-head">
        <p className="module-close-print-kicker">{definition.crumb}</p>
        <h1>{definition.title}</h1>
        <p className="module-close-print-who">
          <span>이름</span><i />
          <span>날짜</span><i />
        </p>
      </header>

      {choices.length ? (
        <section className="module-close-print-block">
          <h2>넣은 탐구 기록</h2>
          {records.length ? (
            <ul className="module-close-print-records">
              {records.map((choice) => (
                <li key={choice.lessonId}>
                  <b>{choice.lessonId.split('-l')[1]}차시</b>
                  <span>{choice.artifact}</span>
                  <small>{choice.label}</small>
                </li>
              ))}
            </ul>
          ) : (
            <BlankLines count={RECORD_BLANK_LINES} />
          )}
        </section>
      ) : null}

      {sections.length ? (
        <section className="module-close-print-block">
          <h2>{definition.guideHeading ?? '아이미를 사용할 때 기억할 세 가지'}</h2>
          <ol className="module-close-print-guide">
            {sections.map((section, index) => {
              const text = guideCopy[section.id]?.trim();
              return (
                <li key={section.id}>
                  <h3><b>{index + 1}</b>{section.title}</h3>
                  <p className="module-close-print-prompt">{section.prompt}</p>
                  {text ? <p className="module-close-print-answer">{text}</p> : <BlankLines count={GUIDE_BLANK_LINES} />}
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </article>,
    document.body,
  );
}
