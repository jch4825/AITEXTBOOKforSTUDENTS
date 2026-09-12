import React, { useEffect, useRef, useState } from 'react';
import MiniGameFrame, { MiniGameButton } from '../MiniGameFrame';
import { useMiniGameStage } from '../useMiniGameStage';
import {
  BAUHAUS, GameCanvas, GameHud, STROKE, centerText, clamp, drawBar, drawShape, particleFor,
} from '../engine';
import type { MiniGameProps } from '../types';

/** 이 판이 쓰는 바우하우스 색. 판은 어두운 면이다. */
const B = BAUHAUS.board;

/**
 * m5-l5 · 필요한 만큼만 긁기 (장르 21 · 정돈 클리닝)
 *
 * 도움의 네 수준이 **긁어 내는 넓이**로 그대로 번역된다. 힌트 띠가 덮여 있고, 도움을
 * 고르면 그만큼 덮개가 문질러져 글이 드러난다. 긁은 넓이가 곧 받은 도움의 양이라
 * "가장 적은 도움을 고른다"가 점수 그 자체가 된다.
 *
 * 완성 답은 띠 전체를 드러내는 대신 게이지를 그 자리에서 바닥낸다. 통째로 받으면 남은
 * 문제에 쓸 도움이 없어지고, 판은 "내가 정한 것이 없는" 결말로 끝난다. 설명이 아니라
 * 손해로 나타나는 자리다 — 차시의 진우가 "완성 포스터 하나 만들어 줘"라고 말한 그 지점이다.
 *
 * 조작은 누르기 하나뿐이고 타이밍이 없다. 도움을 고르면 덮개가 바로 벗겨지고, 답을
 * 고르면 바로 판정된다. 무엇을 고른 상태인지 머리에 들고 있을 일이 없다.
 *
 * 덮개는 왼쪽부터 벗긴다. 아무 데나 벗기면 글자가 띄엄띄엄 드러나 읽히지 않는다. 읽히지
 * 않는 힌트는 도움이 아니다.
 *
 * 같은 장르를 쓰는 m4-l3(개인정보 지우기)과 조작이 다르다. m4-l3은 있는 것을 지워
 * 없애면서 남길 것을 스치지 않도록 손끝을 조절한다. 여기서는 없던 것을 드러내는 반대
 * 방향이고, 판정도 정확히 지웠는가가 아니라 **얼마나 적게 문질렀는가**다.
 */

const WORLD_W = 960;
const WORLD_H = 540;

/** 힌트 띠를 덮은 덮개 칸 수 */
const COVER_COUNT = 12;
const COVER_W = 68;
const COVER_H = 76;
const COVER_Y = 100;
const coverX = (index: number) => 48 + index * 72;

const HELP_Y = 196;
const HELP_H = 66;
const helpX = (index: number) => 48 + index * 216;
const HELP_W = 204;

const PICK_Y = 282;
const PICK_H = 78;
const pickX = (index: number) => 42 + index * 292;
const PICK_W = 280;

const GAUGE = { x: 48, y: 386, w: 864, h: 40 };

interface HelpSpec {
  label: string;
  /** 벗겨 내는 덮개 칸 수. -1이면 전체 */
  reveal: number;
  /** 드는 게이지. -1이면 남은 것을 모두 */
  cost: number;
}

/* 도움 넷은 이름만 다른 것이 아니라 실제로 드러나는 넓이가 다르다. 학생이 고르는 것은
   말이 아니라 넓이다. */
const HELPS: HelpSpec[] = [
  { label: '작은 단서', reveal: 2, cost: 1 },
  { label: '과정 질문', reveal: 4, cost: 3 },
  { label: '부분 예시', reveal: 7, cost: 6 },
  { label: '완성 답', reveal: -1, cost: -1 },
];

interface Problem {
  stuck: string;
  hint: string;
  choices: string[];
  answer: number;
}

interface StageConfig {
  id: string;
  label: string;
  spoken: string;
  scene: string;
  problems: Problem[];
}

/*
 * 판 셋은 조작이 같고 막힌 자리가 다르다. 포스터·순서표·안내 방송으로 옮겨 가면서
 * 같은 고르기(얼마나 받을까)를 세 번 해 보게 한다.
 */
const STAGES: StageConfig[] = [
  {
    id: 'poster',
    label: '기본',
    scene: '홍보 포스터 꾸미기',
    spoken: '필요한 만큼만 힌트를 받아 답을 골라요.',
    problems: [
      {
        stuck: '제목 아래가 허전해요. 무엇을 넣을까요?',
        hint: '보는 사람이 가장 알고 싶은 것은 무엇을 어떻게 하는지입니다',
        choices: ['체험 순서 그림', '큰 제목 하나 더', '그냥 비워 두기'],
        answer: 0,
      },
      {
        stuck: '글씨 색을 어떻게 고를까요?',
        hint: '멀리서도 읽히려면 바탕과 글씨가 또렷하게 달라야 합니다',
        choices: ['바탕과 비슷한 색', '바탕과 진하게 다른 색', '여러 색 섞어 쓰기'],
        answer: 1,
      },
      {
        stuck: '포스터를 어디에 걸까요?',
        hint: '지나가며 보는 사람의 눈높이에 걸어야 읽힙니다',
        choices: ['천장 가까이', '책상 아래쪽', '들어오는 문 옆 눈높이'],
        answer: 2,
      },
    ],
  },
  {
    id: 'steps',
    label: '1단계',
    scene: '체험 순서표 만들기',
    spoken: '필요한 만큼만 힌트를 받아 답을 골라요.',
    problems: [
      {
        stuck: '순서를 어떻게 보여 줄까요?',
        hint: '차례가 있는 일은 번호를 붙여 위에서 아래로 늘어놓습니다',
        choices: ['번호를 붙여 위에서 아래로', '동그랗게 둘러 놓기', '글로만 길게 쓰기'],
        answer: 0,
      },
      {
        stuck: '한 칸에 몇 가지를 적을까요?',
        hint: '한 칸에 하나만 적어야 읽는 사람이 따라 할 수 있습니다',
        choices: ['생각나는 대로 다 적기', '한 칸에 하나만', '세 가지씩 묶기'],
        answer: 1,
      },
      {
        stuck: '어려운 낱말은 어떻게 할까요?',
        hint: '처음 보는 사람도 아는 쉬운 말로 바꾸어 적습니다',
        choices: ['그대로 두기', '작게 적기', '쉬운 말로 바꾸기'],
        answer: 2,
      },
    ],
  },
  {
    id: 'notice',
    label: '2단계',
    scene: '안내 방송 문구 쓰기',
    spoken: '필요한 만큼만 힌트를 받아 답을 골라요.',
    problems: [
      {
        stuck: '방송을 무엇으로 시작할까요?',
        hint: '누구에게 하는 말인지 먼저 밝혀야 자기 일로 듣습니다',
        choices: ['누구에게 하는 말인지', '준비한 사람 이름', '오늘 날씨 이야기'],
        answer: 0,
      },
      {
        stuck: '문장을 얼마나 길게 쓸까요?',
        hint: '귀로 한 번에 듣는 말은 짧게 끊어야 남습니다',
        choices: ['한 문장에 다 넣기', '짧게 끊어서', '길게 이어서'],
        answer: 1,
      },
      {
        stuck: '끝맺음에 무엇을 넣을까요?',
        hint: '듣는 사람이 다음에 무엇을 할지 알려 주어야 합니다',
        choices: ['고맙다는 인사만', '아무 말 없이 끝내기', '다음에 할 일 한 줄'],
        answer: 2,
      },
    ],
  },
];

interface World {
  index: number;
  /** 벗겨진 덮개 칸 수 */
  scrubbed: number;
  gauge: number;
  lives: number;
  finished: boolean;
  /** 마지막으로 고른 도움. 잠깐 짚어 준다. */
  flash: number;
  flashHelp: number;
  flashPick: number;
}

export default function HintScratchGame({ supportLevel }: MiniGameProps) {
  const game = useMiniGameStage({ supportLevel, stageCount: STAGES.length });
  const stage = STAGES[game.stageIndex];
  const tuning = game.tuning;

  /* 지원 수준은 도움 게이지의 크기와 기회로만 나타난다. 막힌 문제는 셋 모두 같다. */
  const gaugeTotal = Math.round(14 * clamp(tuning.tolerance, 0.85, 1.5));
  const maxLives = tuning.lives;

  const worldRef = useRef<World>({
    index: 0, scrubbed: 0, gauge: gaugeTotal, lives: maxLives, finished: false,
    flash: 0, flashHelp: -1, flashPick: -1,
  });
  const [view, setView] = useState({ solved: 0, gauge: gaugeTotal, lives: maxLives });
  const [note, setNote] = useState('먼저 스스로 골라 보고, 막히면 가장 작은 도움부터 받으세요.');

  useEffect(() => {
    worldRef.current = {
      index: 0, scrubbed: 0, gauge: gaugeTotal, lives: maxLives, finished: false,
      flash: 0, flashHelp: -1, flashPick: -1,
    };
    setView({ solved: 0, gauge: gaugeTotal, lives: maxLives });
    setNote('먼저 스스로 골라 보고, 막히면 가장 작은 도움부터 받으세요.');
  }, [game.round, game.stageIndex, gaugeTotal, maxLives, stage]);

  const useHelp = (helpIndex: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    const help = HELPS[helpIndex];
    const cost = help.cost < 0 ? w.gauge : help.cost;
    if (w.gauge <= 0) return;
    if (cost > w.gauge) {
      setNote(`${help.label}${particleFor(help.label, '을', '를')} 받기에는 게이지가 모자라요. 더 작은 도움을 골라 보세요.`);
      return;
    }
    if (w.scrubbed >= COVER_COUNT) {
      setNote('이 힌트는 이미 다 드러났어요.');
      return;
    }
    w.gauge -= cost;
    w.scrubbed = help.reveal < 0 ? COVER_COUNT : Math.min(COVER_COUNT, w.scrubbed + help.reveal);
    w.flash = 0.6;
    w.flashHelp = helpIndex;
    setView({ solved: w.index, gauge: w.gauge, lives: w.lives });

    if (w.gauge <= 0) {
      // 완성 답을 받으면 게이지가 바닥난다. 답은 보이지만 내가 정한 것은 없어진다.
      w.finished = true;
      game.fail('완성 답을 통째로 받아 게이지가 바닥났어요. 내가 정한 곳이 없는 포스터가 되었어요.');
    } else {
      setNote(`${help.label}만큼 긁었어요. 드러난 만큼 읽고 골라 보세요.`);
    }
  };

  const pick = (choiceIndex: number) => {
    const w = worldRef.current;
    if (!game.playing || w.finished) return;
    const problem = stage.problems[w.index];
    w.flash = 0.6;
    w.flashPick = choiceIndex;
    if (choiceIndex === problem.answer) {
      w.index += 1;
      w.scrubbed = 0;
      setView({ solved: w.index, gauge: w.gauge, lives: w.lives });
      if (w.index >= stage.problems.length) {
        w.finished = true;
        game.succeed('필요한 만큼만 도움을 받고 스스로 골랐어요. 내가 정한 포스터가 되었어요!');
      } else {
        setNote('맞았어요. 다음 막힌 자리로 갑니다.');
      }
    } else {
      w.lives -= 1;
      setView({ solved: w.index, gauge: w.gauge, lives: w.lives });
      if (w.lives <= 0) {
        w.finished = true;
        game.fail('고른 것이 자꾸 어긋났어요. 막히면 작은 단서부터 받아 보세요.');
      } else {
        setNote('그건 아니에요. 힌트를 조금 더 받아 볼까요?');
      }
    }
  };

  const frame = (ctx: CanvasRenderingContext2D, dt: number) => {
    const w = worldRef.current;
    if (dt > 0 && w.flash > 0) w.flash = Math.max(0, w.flash - dt);
    const problem = stage.problems[Math.min(w.index, stage.problems.length - 1)];

    ctx.fillStyle = B.ground;
    ctx.fillRect(0, 0, WORLD_W, WORLD_H);

    // 막힌 자리
    drawBar(ctx, 48, 18, 864, 64, { fill: B.surface, stroke: B.yellow, width: STROKE.base });
    centerText(ctx, problem.stuck, WORLD_W / 2, 50, 26, B.ink);

    /* 힌트 띠 — 글을 먼저 그리고 그 위에 덮개를 덮는다. 반투명 덮개는 아래 글을 흐려
       정작 읽을 것을 가리므로, 덮개는 불투명하고 벗겨진 자리만 글이 보인다. */
    centerText(ctx, problem.hint, WORLD_W / 2, COVER_Y + COVER_H / 2, 22, B.ink);
    for (let i = 0; i < COVER_COUNT; i += 1) {
      if (i < w.scrubbed) continue;
      drawBar(ctx, coverX(i), COVER_Y, COVER_W, COVER_H, {
        fill: B.grey, stroke: B.keyline, width: STROKE.hair,
      });
    }
    /* 띠의 테두리만 긋는다. 면을 채우면 드러난 글을 도로 덮는다. */
    ctx.strokeStyle = B.grey;
    ctx.lineWidth = STROKE.base;
    ctx.strokeRect(48, COVER_Y, 864, COVER_H);

    // 도움 넷
    for (let i = 0; i < HELPS.length; i += 1) {
      const help = HELPS[i];
      const cost = help.cost < 0 ? w.gauge : help.cost;
      const afford = w.gauge > 0 && cost <= w.gauge;
      const lit = w.flash > 0 && w.flashHelp === i;
      drawBar(ctx, helpX(i), HELP_Y, HELP_W, HELP_H, {
        fill: lit ? B.yellow : B.ground,
        stroke: afford ? (lit ? B.keyline : B.grey) : B.grey,
        width: lit ? STROKE.heavy : STROKE.base,
      });
      centerText(ctx, help.label, helpX(i) + HELP_W / 2, HELP_Y + 24, 21,
        lit ? B.keyline : (afford ? B.ink : B.grey));
      centerText(ctx, help.cost < 0 ? '남은 도움 전부' : `도움 ${help.cost}칸`,
        helpX(i) + HELP_W / 2, HELP_Y + 48, 20, lit ? B.keyline : B.grey);
    }

    // 고를 답 셋
    for (let i = 0; i < problem.choices.length; i += 1) {
      const lit = w.flash > 0 && w.flashPick === i;
      drawBar(ctx, pickX(i), PICK_Y, PICK_W, PICK_H, {
        fill: B.surface, stroke: lit ? B.blue : B.keyline, width: lit ? STROKE.heavy : STROKE.base,
      });
      centerText(ctx, problem.choices[i], pickX(i) + PICK_W / 2, PICK_Y + PICK_H / 2, 21, B.ink);
    }

    // 도움 게이지 — 남은 것이 곧 내가 아낀 도움이다
    drawBar(ctx, GAUGE.x, GAUGE.y, GAUGE.w, GAUGE.h, {
      fill: B.ground, stroke: B.grey, width: STROKE.base,
    });
    const ratio = Math.max(0, w.gauge) / gaugeTotal;
    drawBar(ctx, GAUGE.x, GAUGE.y, Math.max(2, GAUGE.w * ratio), GAUGE.h, {
      fill: ratio < 0.25 ? B.red : B.blue, stroke: B.keyline, width: 1,
    });
    centerText(ctx, `남은 도움 ${Math.max(0, w.gauge)}칸`, WORLD_W / 2, GAUGE.y + GAUGE.h / 2, 22,
      ratio > 0.12 ? B.ground : B.ink);
    centerText(ctx, `막힌 자리 ${Math.min(w.index + 1, stage.problems.length)} / ${stage.problems.length}`,
      WORLD_W / 2, 466, 20, B.grey);
    drawShape(ctx, 'bar', 92, 466, 12, { fill: B.grey, stroke: B.grey, width: 1 });
  };

  const handleTap = (x: number, y: number) => {
    if (y >= HELP_Y && y <= HELP_Y + HELP_H) {
      for (let i = 0; i < HELPS.length; i += 1) {
        if (x >= helpX(i) && x <= helpX(i) + HELP_W) { useHelp(i); return; }
      }
      return;
    }
    if (y >= PICK_Y && y <= PICK_Y + PICK_H) {
      const problem = stage.problems[Math.min(worldRef.current.index, stage.problems.length - 1)];
      for (let i = 0; i < problem.choices.length; i += 1) {
        if (x >= pickX(i) && x <= pickX(i) + PICK_W) { pick(i); return; }
      }
    }
  };

  return (
    <MiniGameFrame
      badge="필요한 만큼만 긁기"
      instruction="막힌 자리에서 먼저 스스로 골라 보세요. 모르겠으면 아래 도움 가운데 가장 작은 것부터 받습니다. 도움을 받을수록 힌트가 더 드러나지만 남은 도움이 줄어듭니다."
      progress={{ label: '푼 자리', value: view.solved, max: stage.problems.length }}
      hud={<GameHud lives={view.lives} maxLives={maxLives} />}
      stages={STAGES.slice(0, game.visibleStageCount).map((s) => ({ id: s.id, label: s.label }))}
      activeStageIndex={game.stageIndex}
      onStageSelect={(index) => game.goToStage(index, STAGES[index].spoken)}
      status={game.status}
      message={game.message}
      footer={
        <p className="px-1 text-[15px] font-bold" style={{ color: 'var(--game-ink)' }}>
          {stage.scene} · {note}
        </p>
      }
      actions={<MiniGameButton onClick={game.retry} mark="retry" label="다시 하기" variant="primary" />}
    >
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="game-canvas-fit">
          <GameCanvas
            active={game.playing}
            width={WORLD_W}
            height={WORLD_H}
            onFrame={frame}
            onPointer={(pointer) => {
              if (pointer.phase === 'down') handleTap(pointer.x, pointer.y);
            }}
            ariaLabel={`필요한 만큼만 도움을 받는 놀이. 푼 자리 ${view.solved}개, 남은 도움 ${view.gauge}칸, 남은 기회 ${view.lives}개.`}
          />
        </div>
      </div>
    </MiniGameFrame>
  );
}
