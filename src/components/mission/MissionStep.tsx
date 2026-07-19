import React, { useEffect, useState } from 'react';
import type { MissionContent, MissionBlock } from '../../types';
import { useMissionState } from './useMissionState';
import { printMission } from './printMission';
import { useSpeak } from '../../hooks/useSpeak';
import Button from '../Button';
import Icon from '../Icon';
import CharacterAvatar from '../CharacterAvatar';
import { ACTIVITY_PALETTE } from '../../utils/activityPalette';
import LessonSpread from '../lesson/LessonSpread';

import MultiPick from './blocks/MultiPick';
import SinglePick from './blocks/SinglePick';
import DragSort from './blocks/DragSort';
import DragBuild from './blocks/DragBuild';
import BranchChat from './blocks/BranchChat';
import SceneHunt from './blocks/SceneHunt';
import DrawPad from './blocks/DrawPad';
import JudgmentPreview from './blocks/JudgmentPreview';
import JudgmentMain from './blocks/JudgmentMain';
import SummaryTable from './blocks/SummaryTable';
import Vow from './blocks/Vow';

interface Props {
  mission: MissionContent;
  lessonId: string;
  lessonTitle: string;
  moduleTitle: string;
  accent: string;
  accentSoft: string;
  accentText: string;
}

export default function MissionStep({
  mission,
  lessonId,
  lessonTitle,
  moduleTitle,
  accent,
  accentSoft,
  accentText,
}: Props) {
  const { speak, speakNow } = useSpeak();
  const {
    studentName,
    setStudentName,
    answers,
    setAnswer,
    currentChapter,
    setCurrentChapter,
    resetMission,
  } = useMissionState(lessonId);

  const [tempName, setTempName] = useState(studentName);
  const [showReward, setShowReward] = useState(false);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; color: string; delay: string; size: string }>>([]);

  // 종이 꽃가루(1회성) — 색은 액티비티 팔레트(앱 공용 6색)에서. 무한 반복 금지.
  useEffect(() => {
    if (showReward) {
      const list = Array.from({ length: 64 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: ACTIVITY_PALETTE[i % ACTIVITY_PALETTE.length].accent,
        delay: `${Math.random() * 1.5}s`,
        size: `${Math.random() * 10 + 6}px`,
      }));
      setConfetti(list);
    } else {
      setConfetti([]);
    }
  }, [showReward]);

  // Sync tempName when studentName loads from storage
  useEffect(() => {
    setTempName(studentName);
  }, [studentName]);

  const allBlocks = mission.chapters.flatMap((c) => c.blocks);

  // Play intro TTS on mount or when studentName is submitted
  useEffect(() => {
    if (studentName && mission.intro) {
      speak(mission.intro);
    }
  }, [studentName]);

  // Speak chapter goal on change
  useEffect(() => {
    if (studentName && !showReward) {
      const ch = mission.chapters[currentChapter];
      if (ch && ch.goal) {
        speak(ch.goal);
      }
    }
  }, [currentChapter, studentName, showReward]);

  // Handle start mission (name submit)
  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      setStudentName(tempName.trim());
    }
  };

  // Helper to check if a block is completed
  const isBlockCompleted = (block: MissionBlock) => {
    if (block.kind === 'summary') return true;
    const val = answers[block.id];
    if (val === undefined) return false;
    switch (block.kind) {
      case 'multi-pick':
        return Array.isArray(val) && val.length > 0;
      case 'single-pick':
        return typeof val === 'string' && val.trim() !== '';
      case 'drag-sort':
        return typeof val === 'object' && Object.keys(val).length === block.cards.length;
      case 'drag-build':
        return Array.isArray(val) && val.length === block.slots.length && val.every((v) => v !== null);
      case 'branch-chat':
        return Array.isArray(val) && val.length === block.turns.length;
      case 'scene-hunt':
        return Array.isArray(val) && val.length === block.targets.length;
      case 'draw':
        return typeof val === 'string' && val.trim() !== '';
      case 'vow':
        return typeof val === 'string' && val.trim() !== '';
      case 'judgment-preview':
        return Boolean(
          val?.firstThought && (
            (Array.isArray(val.firstThought.choiceIds) && val.firstThought.choiceIds.length > 0)
            || val.firstThought.text?.trim()
            || val.firstThought.drawing
          ),
        );
      case 'judgment-main':
        return Boolean(
          Array.isArray(val?.importantInfoIds) && val.importantInfoIds.length > 0
          && Array.isArray(val.exploredMethodIds) && val.exploredMethodIds.length >= 2
          && val.aiDecision
          && val.finalThought
          && val.transferChoiceId,
        );
      default:
        return false;
    }
  };

  // Check if active chapter is completed
  const activeChapter = mission.chapters[currentChapter];
  const isActiveChapterCompleted = activeChapter
    ? activeChapter.blocks.every(isBlockCompleted)
    : false;

  // Check if entire mission is completed
  const isMissionCompleted = allBlocks.every(isBlockCompleted);

  const handleNextTab = () => {
    if (currentChapter < mission.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1);
    } else if (isMissionCompleted) {
      setShowReward(true);
      speak(mission.reward.badgeLabel);
    }
  };

  const handlePrint = () => {
    printMission(
      mission.reward.printable,
      studentName,
      answers,
      lessonTitle,
      moduleTitle,
      allBlocks
    );
  };

  // 1. 표지 (이름 입력) — 이름 없이도 시작할 수 있어야 한다(타이핑이 어려운 학생 대응).
  if (mission.askName !== false && !studentName) {
    const coverLeft = (
      <div className="flex flex-col items-center justify-center text-center p-4">
        <span
          className="inline-flex items-center justify-center rounded-full h-[100px] w-[100px] mb-4"
          style={{ background: accentSoft, boxShadow: 'var(--e-1)' }}
          aria-hidden
        >
          <CharacterAvatar character="aimi" expression="curious" size={76} idle={false} />
        </span>
        <p className="t-label mb-1 font-bold text-sm" style={{ color: accentText }}>오늘의 미션</p>
        <h2 className="t-h2 text-2xl font-black" style={{ color: accent }}>{mission.title}</h2>
      </div>
    );

    const coverRight = (
      <div className="flex flex-col justify-center p-4 space-y-4">
        <p className="text-base text-[color:var(--ink-2)] text-center md:text-left">
          이름을 쓰면 결과물에 내 이름이 들어갑니다.
        </p>
        <form onSubmit={handleStart} className="w-full space-y-4">
          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="내 이름 쓰기"
            className="w-full p-3 rounded-[var(--r-sm)] border-2 text-center text-lg font-bold"
            style={{ borderColor: accent, background: 'var(--paper-0)' }}
            maxLength={10}
            aria-label="이름"
          />
          <Button
            type="submit"
            size="lg"
            accent={accent}
            disabled={!tempName.trim()}
            className="w-full text-lg justify-center py-3 font-bold cursor-pointer"
          >
            <Icon name="rocket" size={20} /> 시작하기
          </Button>
        </form>
        <button
          type="button"
          onClick={() => setStudentName('친구')}
          className="text-base underline underline-offset-4 cursor-pointer text-center md:text-left block w-full"
          style={{ color: 'var(--muted)' }}
        >
          이름 없이 시작하기
        </button>
      </div>
    );

    return (
      <div className="py-4 story-fade-in">
        <LessonSpread
          left={coverLeft}
          right={coverRight}
          reverse={false}
          accent={accent}
          label={`미션 표지: ${mission.title}`}
        />
      </div>
    );
  }

  // 2. 보상 화면 — 앱 공통 보상 문법(D4 도장 메달리온 + 1회성 모션)으로.
  if (showReward) {
    const rewardLeft = (
      <div className="flex flex-col items-center justify-center text-center p-6 bg-gradient-to-b from-white to-[color:var(--paper-1)] rounded-2xl border shadow-sm relative overflow-hidden space-y-4">
        {/* 반짝이는 배경 오라 링 */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)]" />
        
        <div className="relative mb-2" aria-hidden>
          {/* 황금빛 테두리 회전 효과링 */}
          <span
            className="stamp-in inline-flex items-center justify-center rounded-full h-[140px] w-[140px] border-4 border-[#ffd700] animate-[spin_20s_linear_infinite]"
            style={{
              background: 'radial-gradient(circle, #fffbeb 0%, #fef3c7 100%)',
              boxShadow: '0 0 25px rgba(255, 215, 0, 0.4), inset 0 2px 10px rgba(255,255,255,0.8)'
            }}
          >
            {/* 내부 회전 링 장식 */}
            <span className="absolute inset-2 rounded-full border-2 border-dashed border-[#f59e0b]/40" />
          </span>
          {/* 아이미 캐릭터 본체 - 회전하지 않도록 링 위에 absolute 배치 */}
          <span className="absolute inset-0 flex items-center justify-center">
            <CharacterAvatar character="aimi" expression="cheer" size={104} idle={false} />
          </span>
          {/* 정답 별표 뱃지 */}
          <span
            className="answer-pop absolute -top-1 -right-1 rounded-full h-11 w-11 flex items-center justify-center text-white shadow-lg border-2 border-white"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
          >
            <Icon name="star" size={24} filled strokeWidth={3} />
          </span>
        </div>

        <div className="space-y-1">
          <h2 className="t-h2 text-3xl font-extrabold tracking-tight flex items-center gap-1.5 justify-center" style={{ color: 'var(--brand-ink)' }}>
            🎉 미션 완료! 🎉
          </h2>
          <div className="inline-block bg-[color:var(--paper-2)] border px-4 py-1.5 rounded-full mt-2" style={{ borderColor: 'var(--border)' }}>
            <p className="text-lg text-[color:var(--brand-ink)] font-semibold">
              👑 <b className="text-xl" style={{ color: accent }}>{studentName}</b>님, 참 잘했습니다!
            </p>
          </div>
        </div>

        {/* 오른쪽에서 왼쪽 아래로 이사 온 기능용 버튼들 */}
        <div className="w-full pt-4 space-y-3 max-w-xs z-10">
          <button
            onClick={handlePrint}
            className="w-full nav-jelly-btn py-3.5 justify-center text-lg font-black flex items-center"
            style={{
              '--border-color': accent,
              '--shadow-color': accentSoft,
              background: `linear-gradient(135deg, #fff 0%, ${accentSoft} 100%)`,
              color: 'var(--brand-ink)',
            } as React.CSSProperties}
          >
            <Icon name="printer" size={22} className="mr-1.5 shrink-0" />
            {mission.reward.printable === 'certificate' ? '수료증 인쇄하기' : '활동지 인쇄하기'}
          </button>

          <Button
            variant="ghost"
            onClick={() => {
              resetMission();
              setShowReward(false);
              setTempName('');
            }}
            className="mx-auto cursor-pointer text-sm font-semibold hover:bg-black/[0.03]"
          >
            <Icon name="refresh" size={16} /> 처음부터 다시 하기
          </Button>
        </div>
      </div>
    );

    const rewardRight = (
      <div className="flex flex-col justify-center p-6 items-center relative h-full min-h-[220px]">
        <div className="absolute inset-x-0 top-0 h-0 pointer-events-none z-30" aria-hidden>
          {confetti.map((c) => (
            <span
              key={c.id}
              className="confetti-piece absolute"
              style={{
                left: c.left,
                top: '-12px',
                width: c.size,
                height: c.size,
                background: c.color,
                borderRadius: c.id % 2 === 0 ? '50%' : '2px',
                animationDelay: c.delay,
              }}
            />
          ))}
        </div>

        {/* 리본 장식 완료 배지 */}
        <span
          className="inline-flex items-center gap-2 rounded-full px-6 py-4 text-lg font-black border-2 shadow-md transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #fff 0%, var(--paper-1) 100%)',
            borderColor: accent,
            color: 'var(--brand-ink)',
            boxShadow: `0 8px 24px color-mix(in srgb, ${accent} 25%, transparent)`
          }}
        >
          <span className="text-2xl">✨</span> {mission.reward.badgeLabel}
        </span>
      </div>
    );

    return (
      <div className="py-4 story-fade-in relative">
        <LessonSpread
          left={rewardLeft}
          right={rewardRight}
          reverse={false}
          accent={accent}
          label="미션 보상 완료"
        />
      </div>
    );
  }

  // 3. Regular Chapters View using LessonSpread
  const chapterTabs = (
    <div className="flex flex-col space-y-4 h-full justify-center py-4 px-2 lg:px-6">
      <span
        className="text-xs font-black px-2 py-0.5 rounded-[var(--r-sm)] uppercase tracking-wider mb-2 self-start"
        style={{ background: 'color-mix(in srgb, var(--accent) 12%, var(--paper-2))', color: accent }}
      >
        오늘의 미션
      </span>
      <h2 className="t-h2 text-xl lg:text-2xl font-black text-[color:var(--brand-ink)] mb-4">{mission.title}</h2>

      <div className="flex flex-col space-y-2" role="tablist" aria-label="미션 장 목록">
        {mission.chapters.map((chapter, idx) => {
          const isActive = currentChapter === idx;
          const isChapDone = chapter.blocks.every(isBlockCompleted);
          return (
            <button
              key={idx}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentChapter(idx)}
              className="min-h-12 px-4 py-2.5 rounded-[var(--r-md)] font-bold text-base transition-all shrink-0 flex items-center justify-between border cursor-pointer"
              style={{
                borderColor: isActive ? accent : 'var(--line)',
                background: isActive ? 'var(--paper-0)' : 'var(--paper-1)',
                color: isActive ? accent : 'var(--muted)',
              }}
            >
              <span>{chapter.title}</span>
              {isChapDone && (
                <Icon name="check" size={16} strokeWidth={3} color="var(--ok)" className="shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {activeChapter?.goal && (
        <div
          className="p-3.5 mt-4 rounded-[var(--r-md)] text-sm font-semibold flex items-center gap-2.5"
          style={{ background: accentSoft, color: accentText }}
        >
          <Icon name="star" size={16} filled color="currentColor" className="shrink-0" />
          <span className="flex-1 text-xs lg:text-sm">{activeChapter.goal}</span>
          <button
            onClick={() => speakNow(activeChapter.goal!)}
            aria-label="장 목표 읽어주기"
            className="shrink-0 h-13 w-13 rounded-full flex items-center justify-center hover:bg-white/40 cursor-pointer"
            style={{ color: 'currentColor' }}
          ><Icon name="speaker" size={16} /></button>
        </div>
      )}
    </div>
  );

  const chapterBlocks = (
    <div className="flex flex-col justify-center h-full py-4 min-h-[300px] lg:min-h-[460px] space-y-6">
      <div className="space-y-6 lg:max-h-[50vh] lg:overflow-y-auto lg:pr-2">
        {activeChapter?.blocks.map((block) => {
          const val = answers[block.id];
          const updateVal = (newVal: any) => setAnswer(block.id, newVal);

          switch (block.kind) {
            case 'multi-pick':
              return (
                <MultiPick
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  accent={accent}
                />
              );
            case 'single-pick':
              return (
                <SinglePick
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  accent={accent}
                />
              );
            case 'drag-sort':
              return (
                <DragSort
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  accent={accent}
                />
              );
            case 'drag-build':
              return (
                <DragBuild
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  accent={accent}
                  accentSoft={accentSoft}
                />
              );
            case 'branch-chat':
              return (
                <BranchChat
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  accent={accent}
                  accentSoft={accentSoft}
                  accentText={accentText}
                />
              );
            case 'scene-hunt':
              return (
                <SceneHunt
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  accent={accent}
                />
              );
            case 'draw':
              return (
                <DrawPad
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  accent={accent}
                />
              );
            case 'judgment-preview':
              return (
                <JudgmentPreview
                  key={block.id}
                  block={block}
                  value={val}
                  studentName={studentName}
                  accent={accent}
                  onChange={updateVal}
                />
              );
            case 'judgment-main':
              return (
                <JudgmentMain
                  key={block.id}
                  block={block}
                  value={val}
                  studentName={studentName}
                  accent={accent}
                  onChange={updateVal}
                />
              );
            case 'summary':
              return (
                <SummaryTable
                  key={block.id}
                  block={block}
                  allBlocks={allBlocks}
                  answers={answers}
                  accent={accent}
                />
              );
            case 'vow':
              return (
                <Vow
                  key={block.id}
                  block={block}
                  value={val}
                  onChange={updateVal}
                  studentName={studentName}
                  accent={accent}
                />
              );
            default:
              return (
                <div key={(block as any).id} className="font-bold" style={{ color: 'var(--warn)' }}>
                  알 수 없는 블록 종류: {(block as any).kind}
                </div>
              );
          }
        })}
      </div>

      <div className="flex justify-between items-center gap-3 pt-4 border-t border-[color:var(--line)]">
        <Button
          variant="secondary"
          accent={accent}
          onClick={() => currentChapter > 0 && setCurrentChapter(currentChapter - 1)}
          disabled={currentChapter === 0}
          className="px-5 cursor-pointer"
        >
          <Icon name="chevron-left" size={18} /> 이전 장
        </Button>

        <Button
          size="lg"
          accent={accent}
          onClick={handleNextTab}
          disabled={!isActiveChapterCompleted}
          className="px-6 text-lg cursor-pointer"
          title={isActiveChapterCompleted ? undefined : '이 장의 활동을 끝내면 넘어갈 수 있습니다'}
        >
          {currentChapter < mission.chapters.length - 1 ? (
            <>다음 장으로 <Icon name="chevron-right" size={20} /></>
          ) : (
            <>보상 받기 <Icon name="sparkles" size={20} filled /></>
          )}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="py-4 story-fade-in">
      <LessonSpread
        left={chapterTabs}
        right={chapterBlocks}
        reverse={false}
        accent={accent}
        label={`미션 장: ${activeChapter?.title}`}
      />
    </div>
  );
}
