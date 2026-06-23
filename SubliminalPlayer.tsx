import { useState, useEffect, useRef, useCallback } from 'react';
import { Affirmation } from '../data/affirmations';

interface Props {
  affirmations: Affirmation[];
  speak: (text: string, speed: number) => void;
  stop: () => void;
  speechSpeed: number;
  onRepetition: (count: number) => void;
}

export default function SubliminalPlayer({ affirmations, speak, stop, speechSpeed, onRepetition }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Two independent professional controls:
  const [duration, setDuration] = useState(100);   // how long each message stays visible (ms)
  const [frequency, setFrequency] = useState(2);    // how often a flash appears (seconds)

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isVisible, setIsVisible] = useState(false); // current flash visible or hidden
  const [flashKey, setFlashKey] = useState(0);
  const [withSound, setWithSound] = useState(false);
  const [withSubliminalMusic, setWithSubliminalMusic] = useState(true);
  const [flashCount, setFlashCount] = useState(0);
  const [showSymbol, setShowSymbol] = useState(true);

  const cycleRef = useRef<any>(null);
  const hideRef = useRef<any>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode[]>([]);

  // ===== Theta wave background tone for subconscious access =====
  const startSubliminalTone = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') ctx.resume();

      const gain = ctx.createGain();
      gain.gain.value = 0.04;
      gain.connect(ctx.destination);

      const o1 = ctx.createOscillator();
      const o2 = ctx.createOscillator();
      o1.frequency.value = 200;
      o2.frequency.value = 206; // 6Hz theta binaural beat
      o1.type = 'sine';
      o2.type = 'sine';

      const p1 = ctx.createStereoPanner();
      const p2 = ctx.createStereoPanner();
      p1.pan.value = -1;
      p2.pan.value = 1;

      o1.connect(p1).connect(gain);
      o2.connect(p2).connect(gain);
      o1.start();
      o2.start();
      oscRef.current = [o1, o2];
    } catch (e) {
      console.warn('Subliminal tone unavailable', e);
    }
  }, []);

  const stopSubliminalTone = useCallback(() => {
    oscRef.current.forEach(o => { try { o.stop(); } catch {} });
    oscRef.current = [];
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  }, []);

  // ===== Main flash cycle: Duration controls visibility, Frequency controls interval =====
  useEffect(() => {
    if (!isRunning) return;

    const cycleMs = Math.max(frequency * 1000, duration + 50);
    const visibleMs = Math.min(duration, cycleMs - 30);

    const flash = () => {
      // Move to next affirmation & show it
      setCurrentIdx(prev => (prev + 1) % affirmations.length);
      setFlashKey(k => k + 1);
      setIsVisible(true);
      setFlashCount(c => {
        const next = c + 1;
        if (next % 10 === 0) onRepetition(10);
        return next;
      });

      // Hide after the duration
      clearTimeout(hideRef.current);
      hideRef.current = setTimeout(() => {
        setIsVisible(false);
      }, visibleMs);
    };

    // First flash immediately, then on each cycle
    flash();
    cycleRef.current = setInterval(flash, cycleMs);

    return () => {
      clearInterval(cycleRef.current);
      clearTimeout(hideRef.current);
    };
  }, [isRunning, duration, frequency, affirmations.length, onRepetition]);

  // Speak current affirmation if sound enabled and cycle slow enough
  useEffect(() => {
    if (isRunning && withSound && frequency >= 2 && isVisible) {
      speak(affirmations[currentIdx].text, speechSpeed);
    }
  }, [currentIdx, isRunning, withSound, frequency, isVisible]);

  const handleStart = () => {
    setIsRunning(true);
    setFlashCount(0);
    if (withSubliminalMusic) startSubliminalTone();
  };

  const handleStop = () => {
    setIsRunning(false);
    clearInterval(cycleRef.current);
    clearTimeout(hideRef.current);
    setIsVisible(false);
    stopSubliminalTone();
    stop();
  };

  const handleClose = () => {
    handleStop();
    setIsOpen(false);
    if (onRepetition && flashCount > 0) {
      const remaining = flashCount % 10;
      if (remaining > 0) onRepetition(remaining);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(cycleRef.current);
      clearTimeout(hideRef.current);
      stopSubliminalTone();
    };
  }, [stopSubliminalTone]);

  const current = affirmations[currentIdx];

  // Duration label
  const getDurationLabel = (ms: number) => {
    if (ms <= 30) return 'ناخودآگاه خالص 🧬';
    if (ms <= 100) return 'فوق سریع ⚡⚡⚡';
    if (ms <= 300) return 'سریع ⚡⚡';
    if (ms <= 800) return 'قابل خواندن ⚡';
    return 'آرام 🌊';
  };

  return (
    <>
      {/* Launch Card */}
      <div className="glass rounded-3xl p-5 mb-4 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-28 h-28 rounded-full chakra-ring opacity-20 blur-md"></div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">🧬</span>
            <div>
              <h3 className="text-white font-black">پیام‌های پنهان بصری</h3>
              <p className="text-[10px] text-white/50">Visual Subliminal Messages • رنگ ۷ چاکرا</p>
            </div>
          </div>
          <p className="text-xs text-white/60 leading-6 mb-4">
            باورها و نمادهای آنها با سرعت بالا فلش می‌شوند و مستقیماً وارد ذهن ناخودآگاه شما می‌شوند تا به باور غالب تبدیل شوند. ✨
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="w-full py-3.5 rounded-2xl font-black text-deep-navy active:scale-[0.98] transition-transform shadow-xl"
            style={{ background: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFD700, #00FF00, #00BFFF, #4B0082, #9400D3)' }}
          >
            🧬 شروع برنامه‌ریزی ناخودآگاه
          </button>
        </div>
      </div>

      {/* Fullscreen Subliminal Experience */}
      {isOpen && (
        <div className="fixed inset-0 z-[99999] bg-black">
          {/* Animated chakra background orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full chakra-ring opacity-[0.08] blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full chakra-ring opacity-[0.08] blur-3xl"></div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 left-5 z-[30] w-11 h-11 rounded-full bg-white/10 backdrop-blur text-white flex items-center justify-center text-xl hover:bg-white/20"
          >
            ✕
          </button>

          {/* Flash counter */}
          {isRunning && (
            <div className="absolute top-6 right-6 z-[30] text-center">
              <div className="text-white/40 text-[10px]">تکرار</div>
              <div className="chakra-text text-3xl font-black tabular-nums">{flashCount}</div>
            </div>
          )}

          {/* ====== RUNNING MODE: immersive flash ====== */}
          {isRunning && (
            <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
              {isVisible && (
                <div
                  key={flashKey}
                  className="text-center"
                  style={{ animation: `subliminal-flash ${Math.max(duration, 60)}ms ease-in-out` }}
                >
                  <h1 className="chakra-text font-black leading-tight"
                    style={{ fontSize: 'clamp(1.8rem, 7vw, 3.5rem)' }}
                  >
                    {current.text}
                  </h1>
                  {/* SYMBOL under the affirmation - registers in subconscious */}
                  {showSymbol && (
                    <div className="text-7xl mt-5 chakra-pulse">{current.emoji}</div>
                  )}
                </div>
              )}

              {/* Floating Stop button */}
              <button
                onClick={handleStop}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[40] px-10 py-4 rounded-full font-black text-white text-lg bg-red-600 active:scale-95 shadow-2xl shadow-red-600/40 flex items-center gap-2"
              >
                ⏸ توقف
              </button>
            </div>
          )}

          {/* ====== SETUP MODE: scrollable pro controls ====== */}
          {!isRunning && (
            <div className="absolute inset-0 z-20 overflow-y-auto">
              <div className="min-h-full flex flex-col items-center justify-center px-5 py-20">
                {/* Ready visual */}
                <div className="text-center mb-7">
                  <div className="w-24 h-24 mx-auto rounded-full chakra-ring opacity-60 mb-5"></div>
                  <h2 className="chakra-text text-2xl font-black mb-1">پیام‌های پنهان بصری</h2>
                  <p className="text-white/50 text-xs">Visual Subliminal Messages</p>
                </div>

                <div className="w-full max-w-md">
                  {/* ===== TWO PRO CONTROLS: Duration + Frequency ===== */}
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    {/* Duration */}
                    <div className="glass rounded-2xl p-4 border border-white/10">
                      <div className="text-white/70 text-xs font-bold mb-1">مدت نمایش</div>
                      <div className="text-white/40 text-[9px] mb-2">Duration (ms)</div>
                      <input
                        type="number"
                        min="1"
                        max="5000"
                        value={duration}
                        onChange={(e) => setDuration(Math.max(1, Math.min(5000, parseInt(e.target.value) || 1)))}
                        className="w-full bg-black/40 text-center chakra-text text-2xl font-black rounded-xl py-2 border border-white/10 outline-none"
                      />
                      <input
                        type="range"
                        min="1"
                        max="2000"
                        step="1"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full mt-2 h-1.5 appearance-none rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        style={{ background: 'linear-gradient(90deg, #FF0000, #FFD700, #00FF00, #00BFFF, #9400D3)' }}
                      />
                      <div className="text-center text-[9px] text-white/50 mt-1.5">{getDurationLabel(duration)}</div>
                    </div>

                    {/* Frequency */}
                    <div className="glass rounded-2xl p-4 border border-white/10">
                      <div className="text-white/70 text-xs font-bold mb-1">فاصله فلش</div>
                      <div className="text-white/40 text-[9px] mb-2">Frequency (s)</div>
                      <input
                        type="number"
                        min="0.1"
                        max="60"
                        step="0.1"
                        value={frequency}
                        onChange={(e) => setFrequency(Math.max(0.1, Math.min(60, parseFloat(e.target.value) || 0.1)))}
                        className="w-full bg-black/40 text-center chakra-text text-2xl font-black rounded-xl py-2 border border-white/10 outline-none"
                      />
                      <input
                        type="range"
                        min="0.1"
                        max="20"
                        step="0.1"
                        value={frequency}
                        onChange={(e) => setFrequency(parseFloat(e.target.value))}
                        className="w-full mt-2 h-1.5 appearance-none rounded-full cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        style={{ background: 'linear-gradient(90deg, #9400D3, #00BFFF, #00FF00, #FFD700, #FF0000)' }}
                      />
                      <div className="text-center text-[9px] text-white/50 mt-1.5">هر {frequency} ثانیه</div>
                    </div>
                  </div>

                  {/* Quick presets */}
                  <div className="mb-5">
                    <div className="text-white/40 text-[10px] mb-2 text-center">حالت‌های آماده</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => { setDuration(30); setFrequency(0.3); }}
                        className="py-2.5 rounded-xl text-[11px] font-bold bg-white/5 border border-white/10 text-white/80"
                      >
                        🧬 ناخودآگاه عمیق
                      </button>
                      <button
                        onClick={() => { setDuration(100); setFrequency(1); }}
                        className="py-2.5 rounded-xl text-[11px] font-bold bg-white/5 border border-white/10 text-white/80"
                      >
                        ⚡ استاندارد
                      </button>
                      <button
                        onClick={() => { setDuration(2000); setFrequency(3); }}
                        className="py-2.5 rounded-xl text-[11px] font-bold bg-white/5 border border-white/10 text-white/80"
                      >
                        🌊 آرام + خواندن
                      </button>
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="flex gap-2 mb-6">
                    <button
                      onClick={() => setWithSubliminalMusic(!withSubliminalMusic)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        withSubliminalMusic ? 'bg-purple-500/20 border-purple-400 text-purple-200' : 'border-white/10 text-white/50'
                      }`}
                    >
                      🎵 موج تتا
                    </button>
                    <button
                      onClick={() => setWithSound(!withSound)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        withSound ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'border-white/10 text-white/50'
                      }`}
                    >
                      🔊 صوت
                    </button>
                    <button
                      onClick={() => setShowSymbol(!showSymbol)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                        showSymbol ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'border-white/10 text-white/50'
                      }`}
                    >
                      🔮 نماد
                    </button>
                  </div>

                  {/* Start button */}
                  <button
                    onClick={handleStart}
                    className="w-full py-5 rounded-2xl font-black text-black text-xl active:scale-[0.98] shadow-2xl"
                    style={{ background: 'linear-gradient(90deg, #FF0000, #FF7F00, #FFD700, #00FF00, #00BFFF, #4B0082, #9400D3)' }}
                  >
                    ▶ شروع برنامه‌ریزی
                  </button>

                  <p className="text-center text-white/30 text-[10px] mt-4 leading-5">
                    💡 «مدت نمایش» = چند میلی‌ثانیه هر باور دیده شود<br />
                    «فاصله فلش» = هر چند ثانیه یک‌بار فلش شود<br />
                    🎧 برای بهترین نتیجه از هدفون استفاده کنید
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
