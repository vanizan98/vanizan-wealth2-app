import { useState, useEffect } from 'react';

export default function InstallAppCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setCanInstall(false);
    }
  };

  return (
    <div className="glass rounded-3xl p-5 mb-4 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"></div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-3xl shadow-lg shrink-0">
            📱
          </div>
          <div>
            <h3 className="text-gold-400 font-black">نصب اپلیکیشن اندروید</h3>
            <p className="text-[10px] text-white/50">نسخه APK مخصوص گوشی شما</p>
          </div>
        </div>

        {isInstalled ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
            <span className="text-emerald-400 text-sm font-bold">✅ اپلیکیشن نصب شده است</span>
          </div>
        ) : (
          <>
            {/* Direct install button (PWA) */}
            {canInstall && (
              <button
                onClick={handleInstall}
                className="w-full mb-3 py-3.5 rounded-2xl bg-gradient-to-r from-gold-500 to-amber-600 text-deep-navy font-black active:scale-[0.98] transition-transform shadow-lg"
              >
                ⚡ نصب سریع روی این گوشی
              </button>
            )}

            {/* Download APK from PWABuilder */}
            <a
              href="https://www.pwabuilder.com/?url=https%3A%2F%2Fvanizan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full mb-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-center text-sm active:scale-[0.98] transition-transform"
            >
              📦 دریافت فایل APK
            </a>

            {/* Build guide */}
            <a
              href="/build-apk-guide.html"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-2.5 rounded-2xl glass border border-gold-500/20 text-gold-300 font-bold text-center text-xs hover:bg-gold-500/10"
            >
              📖 راهنمای کامل ساخت APK
            </a>

            <div className="mt-3 text-[10px] text-white/40 leading-5 text-center">
              💡 برای ساخت APK، ابتدا اپ را روی vanizan.com آپلود کنید سپس از طریق
              <span className="text-gold-400"> PWABuilder </span>
              فایل نصبی بسازید
            </div>
          </>
        )}
      </div>
    </div>
  );
}
