import { useEffect } from 'react';

interface Props {
  enabled: boolean;
  onToggle: (v: boolean) => void;
}

export default function NightModeToggle({ enabled, onToggle }: Props) {
  useEffect(() => {
    if (enabled) {
      document.documentElement.style.setProperty('--bg-night', 'rgba(0,0,0,0.75)');
    } else {
      document.documentElement.style.removeProperty('--bg-night');
    }
  }, [enabled]);

  return (
    <button
      onClick={() => onToggle(!enabled)}
      className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${enabled ? 'bg-indigo-900 text-indigo-200' : 'glass text-gold-300'}`}
    >
      {enabled ? '🌙 حالت شب روشن' : '☀️ حالت شب خاموش'}
    </button>
  );
}
