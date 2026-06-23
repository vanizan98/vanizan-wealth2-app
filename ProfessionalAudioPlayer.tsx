import React, { useState } from 'react';
import { builtInTracks } from '../data/builtInMusic';
import { brainwaveFrequencies } from '../data/frequencies';
import { useAudioEngine } from '../hooks/useAudioEngine';

interface Props {
  onTrackChange?: (track: string) => void;
}

export default function ProfessionalAudioPlayer({ onTrackChange }: Props) {
  const { isPlaying, currentTrack, volume, playBuiltIn, stop, setVolume, error } = useAudioEngine();
  const [activeTab, setActiveTab] = useState<'brainwave' | 'ambient'>('brainwave');
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const timerRef = React.useRef<any>(null);

  const startSleepTimer = (minutes: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSleepTimer(minutes);
    timerRef.current = setTimeout(() => {
      stop();
      setSleepTimer(null);
    }, minutes * 60 * 1000);
  };

  const cancelTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSleepTimer(null);
  };

  const handlePlay = (id: string) => {
    if (currentTrack === id && isPlaying) {
      stop();
    } else {
      playBuiltIn(id);
      onTrackChange?.(id);
    }
  };

  return (
    <div className="glass rounded-3xl p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-gold-400 font-bold">🎵 پخش‌کننده حرفه‌ای</span>
          <div className="text-[10px] text-gold-400/50">موزیک‌های درمانی • فرکانس‌های مغز</div>
        </div>
        {error && <div className="text-red-400 text-xs">{error}</div>}
      </div>

      {/* Tabs */}
      <div className="flex mb-4 rounded-xl overflow-hidden bg-black/30">
        <button
          onClick={() => setActiveTab('brainwave')}
          className={`flex-1 py-2 text-sm font-bold transition-all ${activeTab === 'brainwave' ? 'bg-gold-500 text-deep-navy' : 'text-gold-400'}`}
        >
          🧠 فرکانس‌های مغز
        </button>
        <button
          onClick={() => setActiveTab('ambient')}
          className={`flex-1 py-2 text-sm font-bold transition-all ${activeTab === 'ambient' ? 'bg-gold-500 text-deep-navy' : 'text-gold-400'}`}
        >
          🌊 صداهای آرامش‌بخش
        </button>
      </div>

      {/* Brainwave Frequencies */}
      {activeTab === 'brainwave' && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {brainwaveFrequencies.map(freq => (
            <button
              key={freq.id}
              onClick={() => handlePlay(freq.name.toLowerCase().replace(' ', ''))}
              className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all text-center ${
                currentTrack === freq.name.toLowerCase().replace(' ', '') && isPlaying
                  ? 'bg-gold-500/20 border-gold-500 scale-[1.02]'
                  : 'glass border-gold-500/10 hover:border-gold-500/30'
              }`}
            >
              <div className="text-2xl">{freq.emoji}</div>
              <div className="font-bold text-sm">{freq.name}</div>
              <div className="text-[10px] text-gold-400/70">{freq.frequency}Hz • {freq.benefit}</div>
            </button>
          ))}
        </div>
      )}

      {/* Built-in Ambient Tracks */}
      {activeTab === 'ambient' && (
        <div className="space-y-2 mb-4">
          {builtInTracks.map(track => (
            <button
              key={track.id}
              onClick={() => handlePlay(track.id)}
              className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all ${
                currentTrack === track.id && isPlaying
                  ? 'bg-gradient-to-r from-gold-500/20 to-amber-500/10 border border-gold-500'
                  : 'glass border border-gold-500/10 hover:border-gold-500/30'
              }`}
            >
              <span className="text-3xl w-9">{track.emoji}</span>
              <div className="flex-1 text-right">
                <div className="font-bold">{track.name}</div>
                <div className="text-xs text-gold-400/70">{track.description}</div>
              </div>
              <div className={`text-sm font-mono px-2 py-0.5 rounded ${currentTrack === track.id && isPlaying ? 'text-gold-400' : 'text-gold-400/40'}`}>
                {currentTrack === track.id && isPlaying ? '▶' : '⏯'}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Volume */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-gold-400 text-xs">🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 accent-gold-500"
        />
        <span className="font-mono text-xs text-gold-400 w-8 text-left">{Math.round(volume * 100)}%</span>
      </div>

      {/* Sleep Timer */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2 text-gold-400/70">
          <span>⏱ تایمر خواب</span>
          {sleepTimer && <span className="text-emerald-400">در حال اجرا: {sleepTimer} دقیقه</span>}
        </div>
        <div className="flex gap-2">
          {[15, 30, 60].map(m => (
            <button
              key={m}
              onClick={() => startSleepTimer(m)}
              className="flex-1 py-2 text-xs rounded-xl glass border border-gold-500/20 hover:bg-gold-500/10 font-medium"
            >
              {m} دقیقه
            </button>
          ))}
          {sleepTimer && (
            <button onClick={cancelTimer} className="px-4 text-xs text-red-400 rounded-xl glass">لغو</button>
          )}
        </div>
      </div>

      {isPlaying && (
        <button onClick={stop} className="mt-4 w-full py-2 rounded-xl bg-red-500/20 text-red-300 text-sm font-bold border border-red-500/30">
          ⏹ توقف پخش
        </button>
      )}
    </div>
  );
}
