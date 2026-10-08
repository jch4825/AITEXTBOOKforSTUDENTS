import { formatTime } from '../utils/time';

const PRESETS = [1, 3, 5, 10, 15, 20];

interface Props {
  remainingSec: number | null;
  running: boolean;
  onStart: (minutes: number) => void;
  onToggle: () => void;
  onReset: () => void;
}

/**
 * 교실 타이머 — 교사 도구 시트 안의 패널.
 *
 * 예전에는 떠 있는 도크 안의 w-64(288px) 칸이라, 시트로 옮긴 뒤에도 숫자판과 단추가 그 좁은 칸에
 * 몰려 720px 시트의 오른쪽 절반이 비었다. 지금은 시트 폭을 다 쓰고 배치는 칸의 폭(@container)이 정한다.
 * 시간 고르기는 한 줄(좁으면 3×2)이고, 돌아가는 중에는 숫자판이 왼쪽·조작이 오른쪽이다
 * (좁으면 숫자 밑 전체 폭). 시간 고르기 단추의 글자는 "5분"처럼 숫자와 분이 한 덩어리로 읽혀야 한다
 * (scripts/check-mobile-learning-layout.mjs가 글자로 단추를 찾는다).
 * 끝났다는 것은 색만으로 알리지 않고 글로도 적는다. 남은 시간은 시트를 닫아도 상단 바 칩에 남는다.
 */
export default function ClassTimer({ remainingSec, running, onStart, onToggle, onReset }: Props) {
  const done = remainingSec === 0;
  const caption = done ? '시간이 끝났습니다' : running ? '남은 시간' : '잠시 멈춤';

  return (
    <div className="class-timer">
      <div className="tool-panel-head">
        <h3>타이머</h3>
        <p>고르면 바로 시작하며, 시트를 닫아도 남은 시간이 상단 바에 보입니다.</p>
      </div>

      {remainingSec === null ? (
        <div className="class-timer-presets">
          {PRESETS.map((minutes) => (
            <button key={minutes} type="button" onClick={() => onStart(minutes)}>
              <span><b>{minutes}</b>분</span>
            </button>
          ))}
        </div>
      ) : (
        <div className={`class-timer-run surface-paper${done ? ' is-done' : ''}`}>
          <div className="class-timer-face" role="timer">
            <p className="class-timer-caption">{caption}</p>
            <p className="class-timer-digits">{formatTime(remainingSec)}</p>
          </div>
          <div className="class-timer-actions">
            {!done && (
              <button type="button" className="btn btn-primary" onClick={onToggle}>
                {running ? '멈춤' : '계속'}
              </button>
            )}
            <button type="button" className={`btn ${done ? 'btn-primary' : 'btn-secondary'}`} onClick={onReset}>
              리셋
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
