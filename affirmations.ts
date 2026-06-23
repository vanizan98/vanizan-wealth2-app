export interface Affirmation {
  id: number;
  text: string;
  emoji: string;
  category: 'هویت' | 'شکرگزاری' | 'جذب' | 'قدرت' | 'ثروت';
  color: string;
}

export const affirmations: Affirmation[] = [
  { id: 1, text: 'من خود ثروت هستم', emoji: '💎', category: 'هویت', color: 'from-yellow-600 to-amber-700' },
  { id: 2, text: 'من ذاتا ثروتمند هستم', emoji: '👑', category: 'هویت', color: 'from-purple-600 to-indigo-700' },
  { id: 3, text: 'خدا شکرت بابت فراوانی بی‌پایان', emoji: '🤲', category: 'شکرگزاری', color: 'from-emerald-600 to-teal-700' },
  { id: 4, text: 'ثروتمند شدن حق طبیعی من است', emoji: '⚡', category: 'قدرت', color: 'from-red-600 to-orange-700' },
  { id: 5, text: 'من ثروتمند هستم', emoji: '💰', category: 'هویت', color: 'from-green-600 to-emerald-700' },
  { id: 6, text: 'پول با عشق به سمت من جاری است', emoji: '🌊', category: 'جذب', color: 'from-cyan-600 to-blue-700' },
  { id: 7, text: 'من آهنربای پول و ثروت هستم', emoji: '🧲', category: 'جذب', color: 'from-violet-600 to-purple-700' },
  { id: 8, text: 'هر روز ثروتمندتر از دیروز هستم', emoji: '📈', category: 'ثروت', color: 'from-lime-600 to-green-700' },
  { id: 9, text: 'من شایسته زندگی پر از فراوانی هستم', emoji: '🌟', category: 'قدرت', color: 'from-amber-500 to-yellow-700' },
  { id: 10, text: 'ثروت از هر راهی به سمت من سرازیر است', emoji: '💫', category: 'جذب', color: 'from-pink-600 to-rose-700' },
  { id: 11, text: 'من با اعتماد به نفس و قدرت ثروت می‌سازم', emoji: '🏛️', category: 'قدرت', color: 'from-sky-600 to-indigo-700' },
  { id: 12, text: 'خداوندا شکرت برای نعمت‌های بی‌شمارت', emoji: '🕌', category: 'شکرگزاری', color: 'from-teal-600 to-cyan-700' },
  { id: 13, text: 'من لایق بهترین‌ها هستم', emoji: '✨', category: 'هویت', color: 'from-fuchsia-600 to-pink-700' },
  { id: 14, text: 'درآمد من هر لحظه بیشتر و بیشتر می‌شود', emoji: '💵', category: 'ثروت', color: 'from-yellow-500 to-orange-600' },
  { id: 15, text: 'جهان هستی سرشار از ثروت برای من است', emoji: '🌍', category: 'جذب', color: 'from-emerald-500 to-teal-600' },
  { id: 16, text: 'من با کائنات در هماهنگی کامل ثروت هستم', emoji: '🔮', category: 'قدرت', color: 'from-indigo-600 to-violet-700' },
  { id: 17, text: 'هر نفسی که می‌کشم ثروت بیشتری جذب می‌کنم', emoji: '🌬️', category: 'جذب', color: 'from-rose-500 to-pink-600' },
  { id: 18, text: 'حساب بانکی من هر روز پرتر می‌شود', emoji: '🏦', category: 'ثروت', color: 'from-blue-600 to-indigo-700' },
  { id: 19, text: 'من خالق زندگی ثروتمند و باشکوه خود هستم', emoji: '🎨', category: 'هویت', color: 'from-orange-500 to-red-600' },
  { id: 20, text: 'سپاسگزارم که ثروت بی‌حد و مرز دارم', emoji: '🙏', category: 'شکرگزاری', color: 'from-amber-600 to-yellow-700' },
];

export const categories = ['همه', 'هویت', 'شکرگزاری', 'جذب', 'قدرت', 'ثروت'];
