export interface BrainwaveFrequency {
  id: number;
  name: string;
  frequency: number;
  description: string;
  benefit: string;
  color: string;
  emoji: string;
}

export const brainwaveFrequencies: BrainwaveFrequency[] = [
  { id: 1, name: 'دلتا', frequency: 2.5, description: 'خواب عمیق و ترمیم', benefit: 'ترمیم بدن و آرامش عمیق', color: 'from-indigo-800 to-purple-900', emoji: '🌙' },
  { id: 2, name: 'تتا', frequency: 6, description: 'خلاقیت و مدیتیشن', benefit: 'افزایش خلاقیت و جذب', color: 'from-blue-700 to-indigo-800', emoji: '🌀' },
  { id: 3, name: 'آلفا', frequency: 10, description: 'آرامش و تمرکز', benefit: 'تمرکز و جذب ثروت', color: 'from-emerald-700 to-teal-800', emoji: '🌿' },
  { id: 4, name: 'بتا', frequency: 20, description: 'هوشیاری و اقدام', benefit: 'انرژی و تصمیم‌گیری سریع', color: 'from-amber-600 to-orange-700', emoji: '⚡' },
  { id: 5, name: 'گاما', frequency: 40, description: 'آگاهی برتر', benefit: 'بینش و تجلی سریع', color: 'from-violet-700 to-fuchsia-800', emoji: '✨' },
];
