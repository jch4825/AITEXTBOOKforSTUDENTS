import { parseSpeakerLines, speakerColor, type SpeakerTone } from '../speakerLine';
import { wrapDictionaryTerms } from '../../../views/lessonTextUtils';

interface Props {
  /** 각본 한 줄. 화자 표기가 없으면 지금까지와 같은 서술 문단으로 그린다. */
  text: string;
  dictionaryTerms: string[];
  /** 말풍선이 놓이는 바탕. 이야기 대사창은 dark, 밝은 지면 위 반응 대사는 light. */
  tone?: SpeakerTone;
}

/**
 * 각본 문자열을 화자 말풍선으로 그린다(05-ENGINE-SPEC §2).
 *
 * 화자를 못 찾은 조각은 서술로 남겨 기존 화면과 같은 모양을 유지한다.
 * 사전 밑줄(wrapDictionaryTerms)은 두 경우 모두 그대로 적용한다.
 */
export default function SpeakerDialogue({ text, dictionaryTerms, tone = 'dark' }: Props) {
  const segments = parseSpeakerLines(text);

  return (
    <div className={`speaker-dialogue speaker-dialogue--${tone}`}>
      {segments.map((segment, index) => {
        if (!segment.speaker) {
          return (
            <p key={`narration-${index}`} className="speaker-narration">
              {wrapDictionaryTerms(segment.text, dictionaryTerms)}
            </p>
          );
        }
        const color = speakerColor(segment.speaker, tone);
        return (
          <p key={`line-${index}`} className="speaker-line">
            <span className="speaker-name" style={{ color, borderColor: color }}>
              {segment.speaker}
            </span>
            <span className="speaker-quote">
              {wrapDictionaryTerms(segment.text, dictionaryTerms)}
            </span>
          </p>
        );
      })}
    </div>
  );
}
