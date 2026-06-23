import { useState, useEffect } from 'react';

export default function Watermark() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.button === 2) {
        setShowWarning(true);
        setTimeout(() => setShowWarning(false), 2000);
      }
    };
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  return (
    <>
      {/* Repeating watermark */}
      <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden opacity-[0.03]">
        <div className="w-full h-full flex flex-wrap content-start" style={{ transform: 'rotate(-30deg) scale(1.5)' }}>
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="text-gold-500 text-sm font-bold whitespace-nowrap px-8 py-4">
              vanizan.com | ونیزان
            </div>
          ))}
        </div>
      </div>

      {/* Warning toast */}
      {showWarning && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999] glass rounded-full px-6 py-3 text-gold-400 text-sm font-bold fade-in-up border border-red-500/30">
          ⚠️ کپی محتوا مجاز نیست | vanizan.com
        </div>
      )}
    </>
  );
}
