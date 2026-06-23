import { Affirmation } from './affirmations';

// Real estate consultant affirmation categories
export type RealEstateCategory = 'هویتی' | 'ثروت' | 'مذاکره' | 'مشارکت' | 'استادی' | 'محوری';

export const realEstateCategories = ['همه', 'محوری', 'هویتی', 'ثروت', 'مذاکره', 'مشارکت', 'استادی'];

export const realEstateAffirmations: Affirmation[] = [
  // باور محوری - Core belief
  { id: 101, text: 'من منبع اعتماد، ارزش و راه‌حل هستم؛ بنابراین فرصت‌ها، افراد و ثروت به طور طبیعی به سمت من جذب می‌شوند', emoji: '🏆', category: 'محوری' as any, color: 'from-amber-500 to-yellow-700' },

  // باورهای هویتی - Identity
  { id: 102, text: 'من واسطه معامله نیستم؛ من حل‌کننده مسائل ملکی هستم', emoji: '🔑', category: 'هویتی' as any, color: 'from-blue-600 to-indigo-700' },
  { id: 103, text: 'مردم به من اعتماد می‌کنند چون منافع آنها را به منافع خودم ترجیح می‌دهم', emoji: '🤝', category: 'هویتی' as any, color: 'from-emerald-600 to-teal-700' },
  { id: 104, text: 'هر روز ارزش بیشتری به بازار اضافه می‌کنم', emoji: '📊', category: 'هویتی' as any, color: 'from-violet-600 to-purple-700' },
  { id: 105, text: 'من آهنربای فرصت‌های بزرگ ملکی هستم', emoji: '🧲', category: 'هویتی' as any, color: 'from-cyan-600 to-blue-700' },
  { id: 106, text: 'سرمایه، زمین و فرصت به سمت من جذب می‌شوند', emoji: '🏗️', category: 'هویتی' as any, color: 'from-orange-500 to-red-600' },
  { id: 107, text: 'من در هر مذاکره آرام، مسلط و قدرتمند هستم', emoji: '💼', category: 'هویتی' as any, color: 'from-indigo-600 to-violet-700' },
  { id: 108, text: 'من برای پول کار نمی‌کنم؛ پول برای ارزشی که خلق می‌کنم به سمت من می‌آید', emoji: '💵', category: 'هویتی' as any, color: 'from-green-600 to-emerald-700' },
  { id: 109, text: 'نام من مترادف با اعتبار، تخصص و نتایج عالی است', emoji: '⭐', category: 'هویتی' as any, color: 'from-yellow-500 to-amber-700' },

  // باورهای ثروت - Wealth
  { id: 110, text: 'در بازار همیشه معاملات عالی وجود دارد', emoji: '💎', category: 'ثروت' as any, color: 'from-teal-600 to-cyan-700' },
  { id: 111, text: 'هیچ محدودیتی برای میزان درآمد من وجود ندارد', emoji: '♾️', category: 'ثروت' as any, color: 'from-purple-600 to-fuchsia-700' },
  { id: 112, text: 'هر معامله موفق، راه را برای معاملات بزرگ‌تر باز می‌کند', emoji: '🚪', category: 'ثروت' as any, color: 'from-amber-600 to-orange-700' },
  { id: 113, text: 'ثروت از طریق خدمت‌رسانی صادقانه وارد زندگی من می‌شود', emoji: '🌟', category: 'ثروت' as any, color: 'from-lime-600 to-green-700' },
  { id: 114, text: 'هر روز کانال‌های جدید درآمدی برای من باز می‌شود', emoji: '🌊', category: 'ثروت' as any, color: 'from-blue-600 to-cyan-700' },
  { id: 115, text: 'من شایسته ثروت فراوان هستم', emoji: '👑', category: 'ثروت' as any, color: 'from-yellow-600 to-amber-700' },
  { id: 116, text: 'پول عاشق جریان داشتن به سمت افرادی است که ارزش خلق می‌کنند', emoji: '💰', category: 'ثروت' as any, color: 'from-emerald-500 to-teal-600' },
  { id: 117, text: 'فراوانی حالت طبیعی زندگی من است', emoji: '✨', category: 'ثروت' as any, color: 'from-rose-500 to-pink-600' },

  // باورهای مذاکره - Negotiation
  { id: 118, text: 'من در هر مذاکره آرامش خود را حفظ می‌کنم', emoji: '🧘', category: 'مذاکره' as any, color: 'from-sky-600 to-indigo-700' },
  { id: 119, text: 'هیچ معامله‌ای ارزش از دست دادن عزت نفس و آرامش مرا ندارد', emoji: '🛡️', category: 'مذاکره' as any, color: 'from-slate-600 to-gray-700' },
  { id: 120, text: 'من به راحتی توافق‌های برد-برد خلق می‌کنم', emoji: '🤲', category: 'مذاکره' as any, color: 'from-green-600 to-teal-700' },
  { id: 121, text: 'همیشه راه‌حلی وجود دارد که همه طرف‌ها از آن سود ببرند', emoji: '🔄', category: 'مذاکره' as any, color: 'from-cyan-600 to-blue-700' },
  { id: 122, text: 'سکوت، اعتماد به نفس و شنیدن از بزرگ‌ترین ابزارهای من هستند', emoji: '🤫', category: 'مذاکره' as any, color: 'from-indigo-600 to-purple-700' },

  // باورهای مشارکت در ساخت - Partnership
  { id: 123, text: 'بهترین پروژه‌های مشارکتی به راحتی مرا پیدا می‌کنند', emoji: '🏢', category: 'مشارکت' as any, color: 'from-amber-600 to-yellow-700' },
  { id: 124, text: 'مالکان به من اعتماد می‌کنند', emoji: '🏘️', category: 'مشارکت' as any, color: 'from-emerald-600 to-green-700' },
  { id: 125, text: 'من فرصت‌های ارزشمند را قبل از دیگران تشخیص می‌دهم', emoji: '🔍', category: 'مشارکت' as any, color: 'from-violet-600 to-indigo-700' },
  { id: 126, text: 'ذهن من مانند یک رادار قدرتمند، پروژه‌های سودآور را شناسایی می‌کند', emoji: '📡', category: 'مشارکت' as any, color: 'from-teal-600 to-cyan-700' },
  { id: 127, text: 'هر زمین مناسب، مالک مناسب و سازنده مناسب را به هم متصل می‌کنم', emoji: '🔗', category: 'مشارکت' as any, color: 'from-orange-500 to-amber-600' },

  // باورهای سطح استادان بازار - Master level
  { id: 128, text: 'من از شرایط بازار بزرگ‌تر هستم', emoji: '🦅', category: 'استادی' as any, color: 'from-purple-700 to-violet-800' },
  { id: 129, text: 'رکود و رونق، هر دو برای من فرصت می‌سازند', emoji: '⚖️', category: 'استادی' as any, color: 'from-blue-700 to-indigo-800' },
  { id: 130, text: 'موفقیت دیگران موفقیت مرا محدود نمی‌کند', emoji: '🌈', category: 'استادی' as any, color: 'from-fuchsia-600 to-pink-700' },
  { id: 131, text: 'بازار بی‌نهایت فرصت دارد', emoji: '🌍', category: 'استادی' as any, color: 'from-emerald-600 to-teal-700' },
  { id: 132, text: 'من همیشه در زمان مناسب در مکان مناسب قرار می‌گیرم', emoji: '🎯', category: 'استادی' as any, color: 'from-red-600 to-rose-700' },
  { id: 133, text: 'ثروت ابتدا در ذهن ساخته می‌شود و سپس در واقعیت ظاهر می‌گردد', emoji: '🧠', category: 'استادی' as any, color: 'from-indigo-600 to-purple-700' },
];
