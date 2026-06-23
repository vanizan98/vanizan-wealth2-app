import { useState } from 'react';

interface Props {
  onSpeak: (text: string, speed: number) => void;
  isSpeaking: boolean;
  onStop: () => void;
  speechSpeed: number;
}

export default function CustomAffirmation({ onSpeak, isSpeaking, onStop, speechSpeed }: Props) {
  const [customText, setCustomText] = useState('');
  const [savedCustoms, setSavedCustoms] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('vanizan-custom-affirmations') || '[]'); } catch { return []; }
  });

  const saveCustom = () => {
    if (!customText.trim()) return;
    const updated = [customText.trim(), ...savedCustoms.filter(t => t !== customText.trim())].slice(0, 8);
    setSavedCustoms(updated);
    localStorage.setItem('vanizan-custom-affirmations', JSON.stringify(updated));
  };

  const speakCustom = (text?: string) => {
    const t = text || customText.trim();
    if (!t) return;
    onSpeak(t, speechSpeed);
  };

  return (
    <div className="glass rounded-3xl p-5">
      <div className="text-gold-400 font-bold mb-3 flex items-center gap-2">
        <span>✍️</span> <span>ساخت تأکید شخصی</span>
      </div>

      <textarea
        value={customText}
        onChange={(e) => setCustomText(e.target.value)}
        placeholder="متن تأکید خود را اینجا بنویسید... مثلاً: من ثروتمند و موفق هستم"
        className="w-full bg-black/30 text-white placeholder:text-white/40 rounded-2xl p-4 text-sm min-h-[90px] resize-y border border-gold-500/20 focus:border-gold-500 outline-none"
        dir="rtl"
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => speakCustom()}
          disabled={!customText.trim() || isSpeaking}
          className="flex-1 py-3 rounded-2xl bg-gold-500 text-deep-navy font-bold disabled:opacity-50 active:scale-[0.98]"
        >
          {isSpeaking ? '⏸ توقف' : '🔊 خواندن'}
        </button>
        <button onClick={saveCustom} disabled={!customText.trim()} className="px-6 py-3 rounded-2xl glass border border-gold-500/30 disabled:opacity-40">ذخیره</button>
        {isSpeaking && <button onClick={onStop} className="px-5 py-3 rounded-2xl bg-red-500/20 text-red-300">توقف</button>}
      </div>

      {savedCustoms.length > 0 && (
        <div className="mt-4">
          <div className="text-xs text-gold-400/60 mb-2">تأکیدهای ذخیره‌شده:</div>
          <div className="flex flex-wrap gap-2">
            {savedCustoms.map((t, i) => (
              <button
                key={i}
                onClick={() => speakCustom(t)}
                className="text-xs px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 hover:bg-gold-500/20 text-gold-300 max-w-[200px] truncate"
              >
                {t.length > 32 ? t.slice(0, 32) + '...' : t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
