import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import Icon from '../../../components/Icon';
import { useSpeak } from '../../../hooks/useSpeak';
import {
  LESSON_VIDEO_EMBED_ORIGIN,
  getLessonVideo,
  lessonVideoEmbedUrl,
  lessonVideoMinutes,
} from '../../../data/lessonVideos';
import type { LessonId } from '../../../types';

type PlayState = 'idle' | 'playing' | 'ended';

interface Props {
  lessonId: LessonId;
  accent: string;
}

/**
 * 유튜브 플레이어가 부모 창으로 보내는 메시지에서 "재생이 끝났다"는 신호만 읽는다.
 * 문서화된 공개 API는 아니지만 공식 IFrame API 스크립트가 쓰는 것과 같은 통로다.
 * 형식이 바뀌어 신호를 못 받더라도 영상은 그대로 재생된다(끝 화면의 추천만 남는다).
 */
function isEndedMessage(raw: unknown): boolean {
  let data: unknown = raw;
  if (typeof raw === 'string') {
    try {
      data = JSON.parse(raw);
    } catch {
      return false;
    }
  }
  if (typeof data !== 'object' || data === null) return false;
  const message = data as { event?: unknown; info?: unknown };
  if (message.event === 'onStateChange') return message.info === 0;
  if (message.event === 'infoDelivery' && typeof message.info === 'object' && message.info !== null) {
    return (message.info as { playerState?: unknown }).playerState === 0;
  }
  return false;
}

/**
 * 정리 노트의 도움 영상 카드.
 *
 * 영상은 보조 자료다. 못 봐도(학교망 차단·소리 없음) 다음 단계로 넘어갈 수 있고,
 * 이 카드는 다음 단추를 막지 않는다. 그래서 안내도 "안 봐도 괜찮아요"로 쓴다.
 *
 * 학생이 카드를 눌러야 비로소 플레이어(iframe)를 붙인다. 누르기 전에는 유튜브로 어떤 요청도
 * 가지 않고, 그림 대신 이 앱이 그린 재생 단추를 둔다. 끝나면 플레이어를 떼어 끝 화면의
 * 추천 영상이 학생 눈앞에 뜨지 않게 한다 — 교사 도구가 외부 링크를 교사 모드에만 두는
 * 이유(통제할 수 없는 추천)와 같은 이유다.
 */
export default function LessonVideoCard({ lessonId, accent }: Props) {
  const video = getLessonVideo(lessonId);
  const { speakNow, stop } = useSpeak();
  const [state, setState] = useState<PlayState>('idle');
  const [frameLoaded, setFrameLoaded] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // 플레이어가 "듣고 있어요" 신호를 받아야 상태 메시지를 보내 준다. 준비되기 전에는 응답이 없어
  // 반 초마다 다시 묻고, 한 번이라도 답이 오면 멈춘다. 프레임이 로드되기 전에 보내면
  // 브라우저가 대상 출처 불일치 오류를 콘솔에 남기므로 load 이후에만 묻는다.
  useEffect(() => {
    if (state !== 'playing' || !frameLoaded) return undefined;
    let answered = false;
    let tries = 0;
    function ask() {
      frameRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }),
        LESSON_VIDEO_EMBED_ORIGIN,
      );
    }
    function onMessage(event: MessageEvent) {
      if (event.origin !== LESSON_VIDEO_EMBED_ORIGIN) return;
      if (event.source !== frameRef.current?.contentWindow) return;
      answered = true;
      if (isEndedMessage(event.data)) setState('ended');
    }
    window.addEventListener('message', onMessage);
    ask();
    const timer = window.setInterval(() => {
      tries += 1;
      if (answered || tries > 20) {
        window.clearInterval(timer);
        return;
      }
      ask();
    }, 500);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('message', onMessage);
    };
  }, [state, frameLoaded]);

  // 누른 카드가 사라진 자리에 포커스가 남지 않게 플레이어로 옮긴다. 플레이어가 커지면 아래의
  // 닫기 단추가 푸터와 교사 도구 바 뒤로 밀려나므로, 카드를 지면 가운데로 끌어와 단추까지 보이게 한다.
  useEffect(() => {
    if (state !== 'playing') return;
    frameRef.current?.focus({ preventScroll: true });
    sectionRef.current?.scrollIntoView({ block: 'center' });
  }, [state]);

  if (!video) return null;

  const minutes = lessonVideoMinutes(video);
  const edge = { '--surface-edge': accent } as CSSProperties;
  // 지면 반쪽 폭의 플레이어는 영상 속 글자가 작다. 아이콘이 작은 플레이어 안의 전체 화면
  // 단추를 못 찾는 학생을 위해 카드가 직접 크게 보기를 준다. 지원하지 않는 기기에서는 감춘다.
  const canEnlarge = typeof document !== 'undefined' && document.fullscreenEnabled === true;

  function play() {
    // 읽어 주던 소리가 영상 소리와 겹치지 않게 끈다.
    stop();
    setFrameLoaded(false);
    setState('playing');
  }

  function enlarge() {
    const request = frameRef.current?.requestFullscreen?.();
    if (request) request.catch(() => undefined);
  }

  return (
    <section ref={sectionRef} aria-label="도움 영상">
      {state === 'idle' ? (
        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={play}
            aria-label={`도움 영상 보기. ${video.title}. 약 ${minutes}분`}
            className="surface-sticker flex min-h-[4.5rem] min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-2xl p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ ...edge, outlineColor: accent }}
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: accent }}
              aria-hidden="true"
            >
              <Icon name="play" size={24} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="studio-kicker block" style={{ color: accent }}>
                도움 영상 · 약 {minutes}분
              </span>
              <strong className="block break-keep text-base font-extrabold leading-snug text-[color:var(--brand-ink)]">
                {video.title}
              </strong>
              <span className="mt-0.5 block break-keep text-sm font-semibold leading-snug text-[color:var(--muted)]">
                보고 싶을 때 눌러요. 안 봐도 괜찮아요.
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => speakNow(`도움 영상. ${video.title}. 약 ${minutes}분. 보고 싶을 때 눌러요. 안 봐도 괜찮아요.`)}
            className="surface-choice flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center self-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ '--choice-edge': accent, color: accent, outlineColor: accent } as CSSProperties}
            aria-label="도움 영상 안내 듣기"
            title="안내 듣기"
          >
            <Icon name="speaker" size={18} />
          </button>
        </div>
      ) : null}

      {state === 'playing' ? (
        <div className="space-y-2">
          <div className="surface-paper relative aspect-video w-full overflow-hidden rounded-2xl">
            {/* 플레이어가 그려지기 전과 막혔을 때 이 글이 비친다. 학생에게 오류 문구를 보이지 않는다. */}
            <p className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm font-semibold text-[color:var(--muted)]">
              영상을 불러오고 있어요.
            </p>
            <iframe
              ref={frameRef}
              className="absolute inset-0 h-full w-full border-0"
              src={lessonVideoEmbedUrl(video, window.location.origin)}
              title={`도움 영상: ${video.title}`}
              allow="autoplay; fullscreen; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setFrameLoaded(true)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 flex-1 basis-40 break-keep text-sm font-semibold leading-snug text-[color:var(--muted)]">
              영상이 나오지 않아도 괜찮아요. 닫고 다음으로 넘어가요.
            </p>
            <div className="flex shrink-0 gap-2">
              {canEnlarge ? (
                <button
                  type="button"
                  onClick={enlarge}
                  className="surface-choice min-h-11 cursor-pointer rounded-xl px-4 text-sm font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                  style={{ '--choice-edge': accent, outlineColor: accent } as CSSProperties}
                >
                  크게 보기
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => setState('idle')}
                className="surface-choice min-h-11 cursor-pointer rounded-xl px-4 text-sm font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ '--choice-edge': accent, outlineColor: accent } as CSSProperties}
              >
                영상 닫기
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {state === 'ended' ? (
        <div className="surface-paper flex flex-wrap items-center justify-between gap-3 rounded-2xl p-4">
          <p role="status" className="flex items-center gap-2 text-base font-extrabold text-[color:var(--brand-ink)]">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: accent }}
              aria-hidden="true"
            >
              <Icon name="check" size={18} />
            </span>
            영상을 다 봤어요.
          </p>
          <button
            type="button"
            onClick={play}
            className="surface-choice min-h-11 shrink-0 cursor-pointer rounded-xl px-4 text-sm font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ '--choice-edge': accent, outlineColor: accent } as CSSProperties}
          >
            다시 보기
          </button>
        </div>
      ) : null}
    </section>
  );
}
