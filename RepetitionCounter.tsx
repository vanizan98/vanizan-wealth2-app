import { useState } from 'react';

interface Props {
  onComplete: (count: number) => void;
  currentAffirmation: string;
  speechSpeed: number;
  speak: (text: string, speed: number) => void;
  isSpeaking: boolean;
  stop: () => void;
}

export default function RepetitionCounter({ onComplete, currentAffirmation, speechSpeed, speak, isSpeaking, stop }: Props) {
  const [target, setTarget] = useState(108);
  const [current, setCurrent] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const presets = [108, 333, 1000];

  const start = () => {
    setCurrent(0);
    setIsRunning(true);
  };

  const increment = () => {
    const next = current + 1;
    setCurrent(next);

    if (autoSpeak) {
      if (!isSpeaking) {
        speak(currentAffirmation, speechSpeed);
      }
    }

    if (next >= target) {
      setIsRunning(false);
      onComplete(next);
      setTimeout(() => {
        setCurrent(0);
      }, 1800);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setCurrent(0);
    stop();
  };

  return (
    <div className="glass rounded-3xl p-5 mb-4">
      <div className="flex justify-between mb-3">
        <span className="text-gold-400 font-bold">🔢 شمارنده تکرار تأکید</span>
        <div className="text-[10px] text-gold-400/60">هدف: {target}</div>
      </div>

      <div className="flex gap-2 mb-4">
        {presets.map(p => (
          <button key={p} onClick={() => { setTarget(p); setCurrent(0); }} className={`flex-1 py-1.5 rounded-2xl text-sm font-bold transition-all ${target === p ? 'bg-gold-500 text-deep-navy' : 'glass border border-gold-500/20'}`}>
            {p}
          </button>
        ))}
        <input type="number" value={target} onChange={e => setTarget(Math.max(1, Math.min(9999, parseInt(e.target.value) || 108)))} className="w-20 text-center bg-black/30 rounded-2xl text-sm border border-gold-500/20" />
      </div>

      <div className="flex flex-col items-center py-6">
        <div className="text-[72px] font-black tabular-nums text-gold-400 tracking-tighter leading-none">{current}</div>
        <div className="text-gold-400/50 text-sm -mt-2">از {target}</div>

        <div className="mt-4 flex gap-3">
          {!isRunning ? (
            <button onClick={start} className="px-8 py-3 rounded-2xl bg-gold-500 text-deep-navy font-bold active:scale-95">شروع تکرار</button>
          ) : (
            <>
              <button onClick={increment} className="px-7 py-3 rounded-2xl bg-emerald-500 text-white font-bold active:scale-95">+ تکرار</button>
              <button onClick={reset} className="px-5 py-3 rounded-2xl bg-red-500/20 text-red-300 font-bold">پایان</button>
            </>
          )}
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-gold-300/70">
          <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} className="accent-gold-500" /> خواندن خودکار
        </label>
      </div>
    </div>
  );
}
