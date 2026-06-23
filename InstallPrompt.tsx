import { useState, useEffect } from 'react';

type Platform = 'ios' | 'android' | 'desktop' | 'unknown';

function detectPlatform(): Platform {
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'ios';
  if (/android/i.test(ua)) return 'android';
  if (/windows|macintosh|linux/i.test(ua)) return 'desktop';
  return 'unknown';
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [nativeInstallable, setNativeInstallable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<Platform>('unknown');

  useEffect(() => {
    // Detect platform
    setPlatform(detectPlatform());

    // Check if already installed (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);
    if (isStandalone) return;

    // Listen for native install prompt (Chrome, Edge, Android)
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setNativeInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for app installed
    const installedHandler = () => {
      setIsInstalled(true);
      setNativeInstallable(false);
      setDeferredPrompt(null);
      setShowModal(false);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleNativeInstall = async () => {
    if (!deferredPrompt) {
      // Show manual guide
      setShowModal(true);
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch (e) {
      setShowModal(true);
    }
    setDeferredPrompt(null);
    setNativeInstallable(false);
  };

  const handleInstallClick = () => {
    if (nativeInstallable && deferredPrompt) {
      handleNativeInstall();
    } else {
      setShowModal(true);
    }
  };

  // Don't show install button if already installed
  if (isInstalled) return null;

  return (
    <>
      {/* Floating Install Button */}
      <button
        onClick={handleInstallClick}
        className="fixed top-4 left-4 z-[100] flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-deep-navy font-black text-xs shadow-xl pulse-gold active:scale-95 transition-transform"
      >
        <span className="text-sm">📲</span>
        <span>نصب اپ</span>
      </button>

      {/* Install Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in-up">
          <div className="relative max-w-md w-full bg-gradient-to-b from-rich-green via-emerald-950 to-rich-green border-2 border-gold-500/40 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/30 text-gold-300 flex items-center justify-center hover:bg-black/50"
            >
              ✕
            </button>

            <div className="text-center mb-4">
              <div className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-gold-400 to-gold-700 items-center justify-center text-5xl shadow-xl mb-3">
                💎
              </div>
              <h2 className="text-gold-400 font-black text-xl mb-1">نصب گرداب ثروت</h2>
              <p className="text-white/70 text-xs">روی دستگاه خود نصب کنید تا آفلاین کار کند</p>
            </div>

            <div className="space-y-3 text-sm">
              {/* Android / Chrome */}
              {(platform === 'android' || platform === 'desktop') && (
                <div className="glass rounded-2xl p-4 border border-gold-500/20">
                  <div className="font-bold text-gold-400 mb-2 flex items-center gap-2">
                    <span>🤖</span>
                    <span>اندروید / کروم</span>
                  </div>
                  <ol className="text-white/80 text-xs space-y-1 pr-4 list-decimal">
                    <li>روی منوی ⋮ (سه نقطه) بالای مرورگر بزنید</li>
                    <li>گزینه <b className="text-gold-400">«افزودن به صفحه اصلی»</b> یا <b className="text-gold-400">«نصب برنامه»</b> را انتخاب کنید</li>
                    <li>روی <b>نصب</b> بزنید</li>
                  </ol>
                  {nativeInstallable && (
                    <button
                      onClick={handleNativeInstall}
                      className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-amber-600 text-deep-navy font-black"
                    >
                      ⚡ نصب خودکار
                    </button>
                  )}
                </div>
              )}

              {/* iOS */}
              {(platform === 'ios' || platform === 'unknown') && (
                <div className="glass rounded-2xl p-4 border border-gold-500/20">
                  <div className="font-bold text-gold-400 mb-2 flex items-center gap-2">
                    <span>🍎</span>
                    <span>آیفون / آیپد (Safari)</span>
                  </div>
                  <ol className="text-white/80 text-xs space-y-1 pr-4 list-decimal">
                    <li>دکمه <b className="text-gold-400">اشتراک‌گذاری</b> (مربع با فلش ↑) را در پایین سافاری بزنید</li>
                    <li>پایین بروید و <b className="text-gold-400">«افزودن به صفحه اصلی»</b> را انتخاب کنید</li>
                    <li>روی <b>افزودن</b> در بالا سمت راست بزنید</li>
                  </ol>
                </div>
              )}

              {/* Desktop */}
              <div className="glass rounded-2xl p-4 border border-gold-500/20">
                <div className="font-bold text-gold-400 mb-2 flex items-center gap-2">
                  <span>💻</span>
                  <span>کامپیوتر</span>
                </div>
                <p className="text-white/80 text-xs">
                  در نوار آدرس مرورگر، آیکون <b className="text-gold-400">💻 نصب</b> را می‌بینید. روی آن کلیک کنید.
                </p>
              </div>

              {/* Direct Download */}
              <div className="glass rounded-2xl p-4 border border-gold-500/20">
                <div className="font-bold text-gold-400 mb-2 flex items-center gap-2">
                  <span>📦</span>
                  <span>دانلود APK (اندروید)</span>
                </div>
                <p className="text-white/80 text-xs mb-2">
                  برای دانلود مستقیم فایل نصب اندروید:
                </p>
                <a
                  href="https://www.pwabuilder.com/?url=https%3A%2F%2Fvanizan.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2.5 rounded-xl bg-gold-500/20 border border-gold-500/40 text-gold-300 text-xs font-bold hover:bg-gold-500/30"
                >
                  🔗 دریافت APK از PWABuilder
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full py-2.5 rounded-xl text-gold-400/60 text-sm hover:text-gold-400"
            >
              بستن
            </button>
          </div>
        </div>
      )}
    </>
  );
}
