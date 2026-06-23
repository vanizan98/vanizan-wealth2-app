import React from 'react';
import { Affirmation } from '../data/affirmations';

interface AffirmationCardProps {
  affirmation: Affirmation;
  isActive: boolean;
  isSpeaking: boolean;
  onSpeak: () => void;
  style?: React.CSSProperties;
}

export default function AffirmationCard({ affirmation, isActive, isSpeaking, onSpeak, style }: AffirmationCardProps) {
  return (
    <div
      style={style}
      className={`relative rounded-3xl overflow-hidden transition-all duration-700 ${
        isActive ? 'scale-100 opacity-100' : 'scale-95 opacity-0 absolute'
      }`}
    >
      {/* Outer glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${affirmation.color} opacity-30 blur-xl`}></div>

      {/* Background image overlay */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'url(/images/abundance-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.15,
        borderRadius: '1.5rem',
      }}></div>

      {/* Card body */}
      <div className="relative glass rounded-3xl p-6 md:p-8 min-h-[280px] flex flex-col items-center justify-center gap-4" style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85))`,
      }}>
        {/* Core belief crown */}
        {(affirmation.category as string) === 'محوری' && (
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-deep-navy text-[10px] font-black shadow-lg shimmer-text-dark">
            👑 باور محوری و کلیدی 👑
          </div>
        )}

        {/* Category badge */}
        <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r ${affirmation.color} text-white text-xs font-bold shadow-lg`}>
          <span>{affirmation.emoji}</span>
          <span>{affirmation.category}</span>
        </div>

        {/* Main text */}
        <div className={`text-center ${isSpeaking ? 'text-glow' : ''}`}>
          <h2
            className="text-2xl md:text-3xl font-black text-white leading-relaxed"
            style={{ fontFamily: 'Vazirmatn' }}
          >
            {affirmation.text}
          </h2>
        </div>

        {/* Emoji decoration */}
        <div className="text-5xl breathe">{affirmation.emoji}</div>

        {/* Speak button */}
        <button
          onClick={onSpeak}
          className={`mt-2 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
            isSpeaking
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
              : 'bg-gold-500/20 text-gold-300 border border-gold-500/30 hover:bg-gold-500/30'
          }`}
        >
          {isSpeaking ? (
            <>
              <span className="inline-flex">
                <span className="w-1.5 h-4 bg-white rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-4 bg-white rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-4 bg-white rounded-full mx-0.5 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
              <span>در حال خواندن...</span>
            </>
          ) : (
            <>
              <span>🔊</span>
              <span>گوش دادن به باور</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
