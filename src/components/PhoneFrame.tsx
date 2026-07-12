import React, { useEffect, useRef } from 'react';
import CharacterAvatar from './CharacterAvatar';
import type { Expression } from './CharacterAvatar';
import Icon from './Icon';

export interface PhoneMessage {
  id: string;
  sender: 'user' | 'aimi';
  text: string;
  expression?: Expression;
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
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  return (
    <div className="w-full max-w-lg md:max-w-[440px] mx-auto my-4 story-fade-in">
      {/* Smartphone Outer Container */}
      <div 
        className="relative mx-auto flex flex-col transition-all overflow-hidden
          w-full h-[500px] border border-neutral-200 bg-neutral-50 rounded-2xl shadow-sm
          md:w-[420px] md:h-[680px] md:border-[10px] md:border-neutral-800 md:rounded-[40px] md:bg-neutral-900 md:shadow-xl"
      >
        {/* Notch / Speaker (PC Only) */}
        <div className="hidden md:flex absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[20px] bg-neutral-800 rounded-b-xl z-20 items-center justify-center">
          <div className="w-12 h-1 bg-neutral-900 rounded-full mb-1"></div>
        </div>

        {/* Status Bar (PC Only) */}
        <div className="hidden md:flex h-6 px-5 pt-1.5 justify-between items-center bg-neutral-100 text-xs font-semibold text-neutral-600 select-none z-10 shrink-0">
          <span>09:30</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-2.5 bg-neutral-600 rounded-[2px] relative before:content-[''] before:absolute before:-right-[2px] before:top-[3px] before:w-[2px] before:h-[4px] before:bg-neutral-600 before:rounded-r-[1px]"></span>
            <Icon name="star" size={10} filled color="currentColor" />
          </div>
        </div>

        {/* Phone Header */}
        <div className="h-14 px-4 border-b border-neutral-200 bg-neutral-50 flex items-center gap-3 shrink-0 select-none md:mt-0">
          <div className="w-9 h-9 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0 border border-neutral-300">
            <CharacterAvatar character="aimi" expression="happy" size={32} idle={false} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base md:text-lg font-bold text-neutral-800 leading-tight">아이미</p>
            <p className="text-[13px] md:text-sm text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              대화 가능
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 flex flex-col gap-3">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}
              >
                {/* Avatar for Aimi */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0 border border-neutral-300">
                    <CharacterAvatar character="aimi" expression={msg.expression || 'neutral'} size={28} idle={false} />
                  </div>
                )}
                
                {/* Bubble Container */}
                <div className="flex flex-col gap-0.5">
                  {!isUser && (
                    <span className="text-[13px] md:text-sm font-semibold text-neutral-500 ml-1">아이미</span>
                  )}
                  <div 
                    className={`rounded-[20px] px-4 py-2.5 text-base md:text-lg leading-relaxed shadow-sm relative break-words`}
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
                        className="absolute -right-7 bottom-1 p-1 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                        title="읽어주기"
                        aria-label="읽어주기"
                      >
                        <Icon name="speaker" size={14} />
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
              <div className="w-8 h-8 rounded-full bg-neutral-200 overflow-hidden flex items-center justify-center shrink-0 border border-neutral-300">
                <CharacterAvatar character="aimi" expression="thinking" size={28} idle={false} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] md:text-sm font-semibold text-neutral-500 ml-1">아이미</span>
                <div 
                  className="rounded-[18px] rounded-tl-[4px] px-4 py-3 bg-[color:var(--paper-0)] border border-[color:var(--line)] shadow-sm flex items-center gap-1 h-[34px]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={chatEndRef} />
        </div>

        {/* Footer Area (Slot for Input / Options) */}
        <div className="bg-neutral-100 border-t border-neutral-200 px-3 py-2 shrink-0">
          {footer}
        </div>

        {/* Bottom Home Indicator Bar (PC Only) */}
        <div className="hidden md:flex h-4 bg-neutral-100 items-center justify-center shrink-0">
          <div className="w-24 h-1 bg-neutral-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
