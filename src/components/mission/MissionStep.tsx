import React, { useEffect, useState } from 'react';
import type { MissionContent, MissionBlock } from '../../types';
import { useMissionState } from './useMissionState';
import { printMission } from './printMission';
import { useSpeak } from '../../hooks/useSpeak';
import Button from '../Button';
import Icon from '../Icon';
import CharacterAvatar from '../CharacterAvatar';
import { ACTIVITY_PALETTE } from '../../utils/activityPalette';

import MultiPick from './blocks/MultiPick';
import SinglePick from './blocks/SinglePick';
import DragSort from './blocks/DragSort';
import DragBuild from './blocks/DragBuild';
import BranchChat from './blocks/BranchChat';
import SceneHunt from './blocks/SceneHunt';
import DrawPad from './blocks/DrawPad';
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
  const { speakNow } = useSpeak();
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
      const list = Array.from({ length: 24 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: ACTIVITY_PALETTE[i % ACTIVITY_PALETTE.length].accent,
        delay: `${Math.random() * 0.6}s`,
        size: `${Math.random() * 8 + 6}px`,
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
      speakNow(mission.intro);
    }
  }, [studentName]);

  // Speak chapter goal on change
  useEffect(() => {
    if (studentName && !showReward) {
      const ch = mission.chapters[currentChapter];
      if (ch && ch.goal) {
        speakNow(ch.goal);
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
      speakNow(mission.reward.badgeLabel);
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
    return (
      <div className="max-w-md mx-auto py-8 px-4 text-center story-fade-in">
        <div className="card p-6 md:p-8 flex flex-col items-center">
          <span
            className="inline-flex items-center justify-center rounded-full h-[88px] w-[88px] mb-4"
            style={{ background: accentSoft, boxShadow: 'var(--e-1)' }}
            aria-hidden
          >
            <CharacterAvatar character="aimi" expression="curious" size={68} idle={false} />
          </span>
          <p className="t-label mb-1" style={{ color: accentText }}>오늘의 미션</p>
          <h2 className="t-h2 mb-2" style={{ color: accent }}>{mission.title}</h2>
          <p className="text-base text-[color:var(--muted)] mb-6">이름을 쓰면 결과물에 내 이름이 들어가요.</p>

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
              className="w-full text-lg justify-center py-3 font-bold"
            >
              <Icon name="rocket" size={20} /> 시작하기
            </Button>
          </form>
          <button
            type="button"
            onClick={() => setStudentName('친구')}
            className="mt-4 text-base underline underline-offset-4"
            style={{ color: 'var(--muted)' }}
          >
            이름 없이 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 2. 보상 화면 — 앱 공통 보상 문법(D4 도장 메달리온 + 1회성 모션)으로.
  //    무한 반복 애니·그라데이션·이모지 크롬 금지, prefers-reduced-motion 대응.
  if (showReward) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 text-center story-fade-in relative">
        {/* 종이 꽃가루 — 1회 떨어지고 끝 (reduced-motion이면 CSS가 감춤) */}
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

        <div className="card p-6 md:p-8 flex flex-col items-center">
          {/* 배움 도장 메달리온 — 정리 화면과 같은 문법, 미션용으로 조금 크게 */}
          <div className="relative mb-4" aria-hidden>
            <span
              className="stamp-in inline-flex items-center justify-center rounded-full h-[120px] w-[120px]"
              style={{ background: accentSoft, boxShadow: 'var(--e-1)' }}
            >
              <CharacterAvatar character="aimi" expression="cheer" size={92} idle={false} />
            </span>
            <span
              className="answer-pop absolute -top-1 -right-1 rounded-full h-10 w-10 flex items-center justify-center text-white shadow-md"
              style={{ background: accent }}
            >
              <Icon name={mission.reward.printable === 'certificate' ? 'star' : 'check'} size={22} filled strokeWidth={3} />
            </span>
          </div>

          <h2 className="t-h2 mb-1" style={{ color: accent }}>미션 완료!</h2>
          <p className="text-lg mb-4">
            <b>{studentName}</b>님, 참 잘했어요!
          </p>

          {/* 배지 리본 — 모듈색 솔리드 파스텔 */}
          <span
            className="inline-flex items-center gap-1.5 rounded-[var(--r-pill)] px-4 py-2 mb-6 text-base font-bold"
            style={{ background: accentSoft, color: accentText }}
          >
            <Icon name="star" size={18} filled /> {mission.reward.badgeLabel}
          </span>

          <div className="w-full space-y-2">
            <Button
              size="lg"
              accent={accent}
              onClick={handlePrint}
              className="w-full text-lg justify-center font-bold"
            >
              <Icon name="printer" size={20} />
              {mission.reward.printable === 'certificate' ? '수료증 인쇄하기' : '활동지 인쇄하기'}
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                resetMission();
                setShowReward(false);
                setTempName('');
              }}
              className="mx-auto"
            >
              <Icon name="refresh" size={16} /> 처음부터 다시 하기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Regular Chapters View
  return (
    <div className="max-w-2xl mx-auto py-4 story-fade-in">
      {/* 장(챕터) 탭 — 학습지의 "1장·2장·3장" 종이 탭 느낌, 터치 타깃 크게 */}
      <div className="flex gap-1.5 mb-5 overflow-x-auto pb-0.5" role="tablist" aria-label="미션 장 목록">
        {mission.chapters.map((chapter, idx) => {
          const isActive = currentChapter === idx;
          const isChapDone = chapter.blocks.every(isBlockCompleted);
          return (
            <button
              key={idx}
              role="tab"
              aria-selected={isActive}
              onClick={() => setCurrentChapter(idx)}
              className="min-h-12 px-4 py-2.5 rounded-t-[var(--r-md)] font-bold text-base transition-all shrink-0 flex items-center gap-1.5 border-2 border-b-0"
              style={{
                borderColor: isActive ? accent : 'var(--line)',
                background: isActive ? 'var(--paper-0)' : 'var(--paper-2)',
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

      {/* 장 목표 카드 */}
      {activeChapter?.goal && (
        <div
          className="p-3.5 mb-4 rounded-[var(--r-md)] text-base font-semibold flex items-center gap-2.5"
          style={{ background: accentSoft, color: accentText }}
        >
          <Icon name="star" size={18} filled color="currentColor" className="shrink-0" />
          <span>{activeChapter.goal}</span>
          <button
            onClick={() => speakNow(activeChapter.goal!)}
            aria-label="장 목표 읽어주기"
            className="ml-auto shrink-0 h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/40"
            style={{ color: 'currentColor' }}
          ><Icon name="speaker" size={18} /></button>
        </div>
      )}

      {/* Render Blocks in current chapter */}
      <div className="space-y-6 my-4">
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
                <div key={(block as any).id} className="text-rose-500 font-bold">
                  알 수 없는 블록 종류: {(block as any).kind}
                </div>
              );
          }
        })}
      </div>

      {/* 미션 내부 이동 — 핵심 조작이므로 큰 버튼(64px) */}
      <div className="flex justify-between items-center gap-3 mt-6 pt-4 border-t border-[color:var(--line)]">
        <Button
          variant="secondary"
          accent={accent}
          onClick={() => currentChapter > 0 && setCurrentChapter(currentChapter - 1)}
          disabled={currentChapter === 0}
          className="px-5"
        >
          <Icon name="chevron-left" size={18} /> 이전 장
        </Button>

        <Button
          size="lg"
          accent={accent}
          onClick={handleNextTab}
          disabled={!isActiveChapterCompleted}
          className="px-6 text-lg"
          title={isActiveChapterCompleted ? undefined : '이 장의 활동을 끝내면 넘어갈 수 있어요'}
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
}
