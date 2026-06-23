import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const shareText = '💎 گرداب ثروت ونیزان\nباورهای قدرتمند ثروتمند شدن در کوتاه‌مدت\n🔗 https://vanizan.com';
  const shareUrl = 'https://vanizan.com';

  const handleShare = async () => {
    const shareData = {
      title: 'گرداب ثروت ونیزان 💎',
      text: 'باورهای قدرتمند ثروتمند شدن در کوتاه‌مدت | گرداب موفقیت ونیزان',
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled
      }
    } else {
      await copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareText;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        prompt('لینک را کپی کنید:', shareUrl);
      }
      document.body.removeChild(textarea);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('💎 گرداب ثروت ونیزان - باورهای قدرتمند ثروتمند شدن')}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent('💎 گرداب ثروت ونیزان - باورهای قدرتمند ثروتمند شدن')}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="glass rounded-2xl p-4 mb-4">
      <h3 className="text-gold-400 font-bold text-sm mb-3 flex items-center gap-2">
        <span className="text-lg">📢</span>
        <span>اشتراک‌گذاری با دوستان</span>
        {copied && <span className="mr-auto text-emerald-400 text-xs">✅ کپی شد!</span>}
      </h3>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white text-xs font-bold shadow-lg active:scale-95 transition-transform"
        >
          <span className="text-2xl">💚</span>
          <span>واتساپ</span>
        </a>
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs font-bold shadow-lg active:scale-95 transition-transform"
        >
          <span className="text-2xl">✈️</span>
          <span>تلگرام</span>
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white text-xs font-bold shadow-lg active:scale-95 transition-transform"
        >
          <span className="text-2xl">𝕏</span>
          <span>توییتر</span>
        </a>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleShare}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-gold-500/20 to-amber-500/20 text-gold-300 font-bold text-sm border border-gold-500/30 hover:bg-gold-500/30 transition-all active:scale-95"
        >
          <span className="text-base">🔗</span>
          <span>اشتراک</span>
        </button>
        <button
          onClick={copyLink}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-gold-500/20 to-amber-500/20 text-gold-300 font-bold text-sm border border-gold-500/30 hover:bg-gold-500/30 transition-all active:scale-95"
        >
          <span className="text-base">{copied ? '✅' : '📋'}</span>
          <span>{copied ? 'کپی شد' : 'کپی لینک'}</span>
        </button>
      </div>
    </div>
  );
}
