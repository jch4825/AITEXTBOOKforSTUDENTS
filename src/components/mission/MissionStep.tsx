import React, { useEffect, useState } from 'react';
import type { MissionContent, MissionBlock } from '../../types';
import { useMissionState } from './useMissionState';
import { printMission } from './printMission';
import { useSpeak } from '../../hooks/useSpeak';
import Button from '../Button';
import Icon from '../Icon';
import CharacterAvatar from '../CharacterAvatar';

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
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; color: string; delay: string; size: string; rotate: string }>>([]);

  // Generate confetti particles on reward mount
  useEffect(() => {
    if (showReward) {
      const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];
      const list = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: `${Math.random() * 3.5}s`,
        size: `${Math.random() * 12 + 6}px`,
        rotate: `${Math.random() * 360}deg`,
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

  // 1. Cover Screen (Name Entry)
  if (mission.askName !== false && !studentName) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 text-center story-fade-in">
        <div className="card p-6 md:p-8 flex flex-col items-center">
          <span className="text-5xl mb-4" role="img" aria-label="책">📖</span>
          <h2 className="t-h2 mb-2" style={{ color: accent }}>{mission.title}</h2>
          <p className="text-sm text-neutral-500 mb-6">미션을 시작하기 전에 이름을 가르쳐주세요!</p>

          <form onSubmit={handleStart} className="w-full space-y-4">
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="내 이름 쓰기"
              className="w-full p-3 rounded-[var(--r-sm)] border-2 text-center text-lg font-bold focus:outline-none focus:border-neutral-800"
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
        </div>
      </div>
    );
  }

  // 2. Reward Screen
  if (showReward) {
    return (
      <div className="max-w-md mx-auto py-8 px-4 text-center story-fade-in relative">
        {/* Style block for local animations */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes confettiFall {
            0% { transform: translateY(-50px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
          }
          @keyframes confettiSway {
            0%, 100% { transform: translateX(0px); }
            50% { transform: translateX(60px); }
          }
          @keyframes badgePop {
            0% { transform: scale(0.3) rotate(-15deg); opacity: 0; }
            70% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          @keyframes raySpin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes sparkleFloat {
            0% { transform: translateY(30px) scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(-70px) scale(1.2); opacity: 0; }
          }
          .animate-confetti {
            animation: confettiFall 4s linear infinite;
          }
          .animate-badge-pop {
            animation: badgePop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .animate-ray-spin {
            animation: raySpin 12s linear infinite;
          }
          .animate-sparkle {
            animation: sparkleFloat 2.5s ease-out infinite;
          }
        `}} />

        {/* Confetti Container */}
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {confetti.map((c) => (
            <div
              key={c.id}
              className="absolute animate-confetti"
              style={{
                left: c.left,
                top: '-20px',
                width: c.size,
                height: c.size,
                backgroundColor: c.color,
                borderRadius: c.id % 2 === 0 ? '50%' : '3px',
                animationDelay: c.delay,
                transform: `rotate(${c.rotate})`,
              }}
            />
          ))}
        </div>

        {/* Reward Card */}
        <div className="card p-6 md:p-8 flex flex-col items-center shadow-2xl border-2 border-amber-200 relative overflow-hidden bg-white rounded-3xl">
          {/* Subtle gold shine top-right corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-full blur-3xl opacity-60 pointer-events-none" />

          {/* Top Emoji */}
          <span className="text-5xl mb-3 animate-bounce inline-block" role="img" aria-label="축하">🎉</span>
          <h2 className="text-2xl md:text-3xl font-black mb-1 bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
            미션 완료!
          </h2>
          <p className="text-base font-bold text-neutral-600 mb-6">
            <span className="text-neutral-800 font-extrabold underline decoration-amber-400 decoration-2">{studentName}</span>님, 참 잘했습니다!
          </p>

          {/* Premium Glowing Badge Container */}
          <div className="relative w-56 h-56 flex items-center justify-center mb-8 animate-badge-pop">
            
            {/* Background Sunburst Rays */}
            <div className="absolute inset-0 animate-ray-spin opacity-45 pointer-events-none scale-110">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#goldGlow)" />
                {Array.from({ length: 12 }).map((_, i) => (
                  <path
                    key={i}
                    d="M 50 50 L 35 0 L 65 0 Z"
                    fill="#fbbf24"
                    opacity="0.25"
                    transform={`rotate(${i * 30} 50 50)`}
                  />
                ))}
              </svg>
            </div>

            {/* Glowing Inner Circle (Pulsing background) */}
            <div className="absolute w-44 h-44 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 border-2 border-amber-300 shadow-inner animate-pulse" />

            {/* Sparkles Floating Upward */}
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-amber-500 text-xl animate-sparkle pointer-events-none"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  bottom: '20px',
                  animationDelay: `${i * 0.4}s`,
                }}
              >
                ✦
              </span>
            ))}

            {/* Large Golden Shield/Ring Border */}
            <div className="relative w-40 h-40 rounded-full border-[6px] border-amber-400 bg-white shadow-xl flex flex-col items-center justify-center overflow-hidden z-10">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50 to-white opacity-90" />
              
              {/* Character Cheering inside */}
              <div className="relative z-10 mt-2">
                <CharacterAvatar character="aimi" expression="cheer" size={105} idle={false} />
              </div>
            </div>

            {/* Float Emblem Badge Tag */}
            <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full border-2 border-white shadow-md flex items-center justify-center z-20 animate-bounce" style={{ animationDuration: '2s' }}>
              <span className="text-2xl">{mission.reward.printable === 'certificate' ? '🏆' : '🏅'}</span>
            </div>

            {/* Badge Text Ribbon Overlay */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30 w-[190px] bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-xs py-1.5 px-3 rounded-full shadow-lg border border-amber-300 transform scale-105">
              <span className="drop-shadow-sm tracking-wide">{mission.reward.badgeLabel}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-3 relative z-10">
            <Button
              size="lg"
              accent={accent}
              onClick={handlePrint}
              className="w-full text-lg justify-center font-bold shadow-md hover:shadow-lg hover:scale-[1.01] transition-all"
            >
              <Icon name="printer" size={20} />
              {mission.reward.printable === 'certificate' ? '🏆 수료증 인쇄하기' : '🖨️ 활동지 인쇄하기'}
            </Button>

            <button
              onClick={() => {
                resetMission();
                setShowReward(false);
                setTempName('');
              }}
              className="text-xs text-neutral-400 font-bold hover:text-neutral-600 hover:underline cursor-pointer py-2 block mx-auto transition-colors"
            >
              처음부터 다시 하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Regular Chapters View
  return (
    <div className="max-w-2xl mx-auto py-4 story-fade-in">
      {/* Chapter Tabs */}
      <div className="flex border-b border-[color:var(--line)] mb-5 overflow-x-auto">
        {mission.chapters.map((chapter, idx) => {
          const isActive = currentChapter === idx;
          const isChapDone = chapter.blocks.every(isBlockCompleted);
          return (
            <button
              key={idx}
              onClick={() => setCurrentChapter(idx)}
              className="px-4 py-2 border-b-4 font-bold text-sm sm:text-base transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
              style={{
                borderColor: isActive ? accent : 'transparent',
                color: isActive ? accent : 'var(--ink-2)',
              }}
            >
              <span>{chapter.title}</span>
              {isChapDone && (
                <Icon name="star" size={14} filled color="var(--ok)" className="shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Chapter Goal Card */}
      {activeChapter?.goal && (
        <div 
          className="p-3 mb-4 rounded-[var(--r-sm)] text-sm font-semibold flex items-center gap-2 border shadow-sm"
          style={{ 
            borderColor: accent,
            background: accentSoft,
            color: accentText,
          }}
        >
          <Icon name="star" size={16} filled color="currentColor" />
          <span>{activeChapter.goal}</span>
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

      {/* Navigation Inside Mission Container */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-[color:var(--line)]">
        <button
          onClick={() => currentChapter > 0 && setCurrentChapter(currentChapter - 1)}
          disabled={currentChapter === 0}
          className="btn btn-secondary px-4 py-2 text-sm font-bold flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ borderColor: accent, color: accent }}
        >
          <Icon name="chevron-left" size={14} /> 이전
        </button>

        <button
          onClick={handleNextTab}
          disabled={!isActiveChapterCompleted}
          className="btn px-6 py-2 text-sm font-bold flex items-center gap-1 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: isActiveChapterCompleted ? accent : 'var(--border)',
            color: isActiveChapterCompleted ? '#ffffff' : 'var(--ink-3)',
          }}
        >
          {currentChapter < mission.chapters.length - 1 ? (
            <>
              다음 장으로 <Icon name="chevron-right" size={14} />
            </>
          ) : (
            <>
              보상 받기 <Icon name="sparkles" size={14} filled />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
