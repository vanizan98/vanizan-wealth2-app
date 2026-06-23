export interface BuiltInTrack {
  id: string;
  name: string;
  type: 'wave' | 'noise' | 'ambient';
  description: string;
  emoji: string;
  baseFreq: number;
  color: string;
}

export const builtInTracks: BuiltInTrack[] = [
  { id: 'delta', name: 'دلتا ویوز', type: 'wave', description: 'خواب عمیق و ترمیم', emoji: '🌙', baseFreq: 2.5, color: 'from-indigo-900 to-black' },
  { id: 'theta', name: 'تتا ویوز', type: 'wave', description: 'مدیتیشن عمیق و جذب', emoji: '🌀', baseFreq: 6, color: 'from-blue-800 to-indigo-900' },
  { id: 'rain', name: 'باران آرام', type: 'noise', description: 'آرامش و پاکسازی ذهن', emoji: '🌧️', baseFreq: 0, color: 'from-slate-700 to-gray-800' },
  { id: 'cosmic', name: 'کاسموس آمبینت', type: 'ambient', description: 'ارتباط کیهانی و تجلی', emoji: '🌌', baseFreq: 8, color: 'from-purple-900 to-violet-950' },
  { id: 'bowls', name: 'کاسه‌های تبتی', type: 'ambient', description: 'شفا و تعادل چاکرا', emoji: '🪔', baseFreq: 4, color: 'from-amber-800 to-yellow-900' },
];
