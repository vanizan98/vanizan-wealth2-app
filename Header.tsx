export default function Header() {
  return (
    <header className="relative w-full py-4 px-4 z-50">
      <div className="max-w-lg mx-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center text-xl shadow-lg pulse-gold">
                💎
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-deep-navy flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <h1 className="text-gold-500 font-black text-lg leading-tight shimmer-text">ونیزان</h1>
              <p className="text-gold-300/60 text-[9px] tracking-[0.2em]">VANIZAN.COM</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-gradient-to-r from-gold-500/20 to-amber-500/20 border border-gold-500/30 rounded-full px-3 py-1.5 text-gold-400 text-[10px] font-bold flex items-center gap-1.5">
              <span className="text-yellow-400">⭐</span>
              <span>نسخه طلایی</span>
            </div>
          </div>
        </div>
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden border border-gold-500/20">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-rich-green via-emerald-950 to-rich-green"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-gold-500/10 via-transparent to-gold-500/5"></div>

          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-gold-500/40 rounded-tl"></div>
          <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-gold-500/40 rounded-tr"></div>
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-gold-500/40 rounded-bl"></div>
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-gold-500/40 rounded-br"></div>

          <div className="relative text-center py-3.5 px-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-gold-500/40 text-xs">✦</span>
              <span className="text-gold-500 text-xs">✦</span>
              <span className="text-gold-500/40 text-xs">✦</span>
            </div>
            <h2 className="text-gold-300 font-bold text-base">گرداب موفقیت</h2>
            <p className="text-gold-100/70 text-xs mt-0.5">باورهای قدرتمند ثروتمند شدن در کوتاه‌مدت</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="w-4 h-px bg-gold-500/30"></span>
              <span className="text-gold-400/60 text-[10px] font-medium tracking-wider">vanizan.com</span>
              <span className="w-4 h-px bg-gold-500/30"></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
