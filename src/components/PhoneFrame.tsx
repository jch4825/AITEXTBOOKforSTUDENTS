import React, { useEffect, useRef } from 'react';
import CharacterAvatar from './CharacterAvatar';
import type { Expression } from './CharacterAvatar';
import Icon from './Icon';

export interface PhoneMessage {
  id: string;
  sender: 'user' | 'aimi';
  text: string;
  expression?: Expression;
  aiGlow?: boolean;
}

interface PhoneFrameProps {
  messages: PhoneMessage[];
  typing?: boolean;
  accent?: string;
  accentSoft?: string;
  accentText?: string;
  footer?: React.ReactNode;
  onSpeak?: (text: string) => void;
}

export default function PhoneFrame({
  messages,
  typing = false,
  accent = 'var(--brand-ink)',
  accentSoft = 'var(--brand-pink)',
  accentText = 'var(--brand-ink)',
  footer,
  onSpeak,
}: PhoneFrameProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages or typing status changes
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    chatEndRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [messages, typing]);

  return (
    <div className="w-full md:max-w-[440px] mx-auto my-4 story-fade-in">
      {/* 모바일: 폰 껍데기 없이 채팅 패널만(기기 자체가 폰 — '폰 속의 폰' 방지).
          데스크톱: 폰 목업(베젤·노치·상태바). */}
      <div
        className="relative mx-auto flex flex-col transition-all overflow-hidden
          w-full rounded-[var(--r-md)] border border-[color:var(--line)] bg-[color:var(--paper-1)]
          md:w-[380px] md:h-[600px] md:border md:border-[color:var(--line)] md:rounded-[24px]"
        style={{ boxShadow: '0 4px 20px rgba(43,58,85,0.08)' }}
      >

        {/* Status Bar (PC Only) */}
        <div className="hidden md:flex h-7 px-5 pt-1.5 justify-between items-center text-xs font-semibold select-none z-10 shrink-0" style={{ background: 'var(--paper-2)', color: 'var(--ink-2)' }}>
          <span>09:30</span>
          <span className="w-4 h-2.5 rounded-[2px]" style={{ background: 'var(--ink-2)' }} aria-hidden></span>
        </div>

        {/* Phone Header */}
        <div className="h-14 px-4 border-b border-[color:var(--line)] flex items-center gap-3 shrink-0 select-none" style={{ background: 'var(--paper-1)' }}>
          <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[color:var(--line)]" style={{ background: 'var(--paper-2)' }}>
            <CharacterAvatar character="aimi" expression="happy" size={32} idle={false} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base md:text-lg font-bold leading-tight" style={{ color: 'var(--brand-ink)' }}>아이미</p>
            <p className="text-[13px] md:text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--ok)' }}>
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'var(--ok)' }}></span>
              대화 가능
            </p>
          </div>
        </div>

        {/* Chat Area — 모바일: 유연한 높이(내부 스크롤) / 데스크톱: 폰 안을 채움 */}
        <div className="min-h-[120px] max-h-[48vh] overflow-y-auto p-4 flex flex-col gap-3 md:min-h-0 md:max-h-none md:flex-1" style={{ background: 'var(--paper-1)' }}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar for Aimi */}
                {!isUser && (
                  <div className={`w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[color:var(--line)] ${msg.aiGlow ? 'ai-glow-avatar' : ''}`} style={{ background: 'var(--paper-2)' }}>
                    <CharacterAvatar character="aimi" expression={msg.expression || 'neutral'} size={28} idle={false} />
                  </div>
                )}

                {/* Bubble Container */}
                <div className="flex flex-col gap-0.5">
                  {!isUser && (
                    <span className="text-[13px] md:text-sm font-semibold ml-1" style={{ color: 'var(--muted)' }}>아이미</span>
                  )}
                  <div 
                    className={`rounded-[20px] px-4 py-2.5 text-base md:text-lg leading-relaxed shadow-sm relative break-words ${msg.aiGlow ? 'ai-glow' : ''}`}
                    style={{
                      backgroundColor: isUser ? accent : 'var(--paper-0)',
                      color: isUser ? '#ffffff' : 'var(--ink-1)',
                      border: isUser ? 'none' : '1px solid var(--line)',
                      borderTopRightRadius: isUser ? '4px' : '18px',
                      borderTopLeftRadius: isUser ? '18px' : '4px',
                    }}
                  >
                    {msg.text}
                    {/* TTS Button on Aimi's bubbles */}
                    {!isUser && onSpeak && (
                      <button
                        onClick={() => onSpeak(msg.text)}
                        className="absolute -right-9 bottom-0 h-8 w-8 flex items-center justify-center rounded-full transition-colors hover:bg-[color:var(--paper-2)]"
                        style={{ color: 'var(--muted)' }}
                        title="읽어주기"
                        aria-label="읽어주기"
                      >
                        <Icon name="speaker" size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {typing && (
            <div className="flex gap-2 max-w-[85%] self-start">
              <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-[color:var(--line)]" style={{ background: 'var(--paper-2)' }}>
                <CharacterAvatar character="aimi" expression="thinking" size={28} idle={false} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] md:text-sm font-semibold ml-1" style={{ color: 'var(--muted)' }}>아이미</span>
                <div
                  className="rounded-[18px] rounded-tl-[4px] px-4 py-3 bg-[color:var(--paper-0)] border border-[color:var(--line)] shadow-sm flex items-center gap-1 h-[34px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full motion-safe:animate-bounce" style={{ background: 'var(--muted)', animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full motion-safe:animate-bounce" style={{ background: 'var(--muted)', animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full motion-safe:animate-bounce" style={{ background: 'var(--muted)', animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Footer Area (Slot for Input / Options) */}
        <div className="border-t border-[color:var(--line)] px-3 py-2 shrink-0" style={{ background: 'var(--paper-2)' }}>
          {footer}
        </div>

        {/* Bottom Home Indicator Bar (PC Only) */}
        <div className="hidden md:flex h-4 items-center justify-center shrink-0" style={{ background: 'var(--paper-2)' }}>
          <div className="w-24 h-1 rounded-full" style={{ background: 'var(--muted)' }}></div>
        </div>
      </div>
    </div>
  );
}
