import { useState, useEffect } from 'react';

export default function DailyReminder() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem('vanizan-reminder') === 'true');
  const [time, setTime] = useState(() => localStorage.getItem('vanizan-reminder-time') || '08:00');

  useEffect(() => {
    if (!('Notification' in window)) return;

    if (enabled) {
      Notification.requestPermission();
    }
  }, [enabled]);

  useEffect(() => {
    localStorage.setItem('vanizan-reminder', enabled.toString());
    localStorage.setItem('vanizan-reminder-time', time);
  }, [enabled, time]);

  const scheduleReminder = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      alert('لطفاً اجازه اعلان را بدهید');
      return;
    }

    // For demo we just show immediate confirmation
    const [h, m] = time.split(':').map(Number);
    const now = new Date();
    const reminder = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);

    if (reminder < now) reminder.setDate(reminder.getDate() + 1);

    const ms = reminder.getTime() - now.getTime();

    setTimeout(() => {
      new Notification('💎 گرداب ثروت ونیزان', {
        body: 'زمان تکرار باورهای ثروت فرا رسیده است.',
        icon: '/icon.svg',
        tag: 'vanizan-daily'
      });
    }, Math.min(ms, 86400000));

    alert(`✅ یادآوری روزانه برای ساعت ${time} تنظیم شد.`);
  };

  return (
    <div className="glass rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gold-400 font-bold flex items-center gap-2 text-sm">
          🔔 یادآوری روزانه
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-gold-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-gold-500"></div>
        </label>
      </div>

      {enabled && (
        <div className="flex items-center gap-2">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="bg-black/40 px-3 py-1.5 text-sm rounded-xl text-gold-300 border border-gold-500/20"
          />
          <button onClick={scheduleReminder} className="flex-1 py-1.5 text-sm rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300">
            تنظیم یادآوری
          </button>
        </div>
      )}
      <div className="text-[10px] text-gold-400/50 mt-2">هر روز در ساعت انتخاب‌شده به شما یادآوری می‌شود.</div>
    </div>
  );
}
