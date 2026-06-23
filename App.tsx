import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useCopyProtection } from './hooks/useCopyProtection';
import { usePersistedState } from './hooks/usePersistedState';
import { useStats } from './hooks/useStats';
import { affirmations, categories } from './data/affirmations';
import { realEstateAffirmations, realEstateCategories } from './data/realEstateAffirmations';
import GoldenParticles from './components/GoldenParticles';
import Header from './components/Header';
import AffirmationCard from './components/AffirmationCard';
import Watermark from './components/Watermark';
import InstallPrompt from './components/InstallPrompt';
import ShareButton from './components/ShareButton';
import ProfessionalAudioPlayer from './components/ProfessionalAudioPlayer';
import CustomAffirmation from './components/CustomAffirmation';
import RepetitionCounter from './components/RepetitionCounter';
import DailyReminder from './components/DailyReminder';
import NightModeToggle from './components/NightModeToggle';
import SubliminalPlayer from './components/SubliminalPlayer';
import InstallAppCard from './components/InstallAppCard';

type Tab = 'home' | 'sounds' | 'counter' | 'custom' | 'stats';

// Speech synthesis
function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string, rate: number = 0.8) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fa-IR';
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const faVoice = voices.find(v => v.lang.startsWith('fa'));
    if (faVoice) utterance.voice = faVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { isSpeaking, speak, stop };
}

// Daily Timer
function DailyTimer() {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="text-center">
      <p className="text-gold-400/50 text-[10px] mb-1">تا روز جدید</p>
      <p className="text-gold-300 font-mono text-lg font-bold tracking-widest text-glow">{timeLeft}</p>
    </div>
  );
}

export default function App() {
  useCopyProtection();

  // Persisted state
  const [speechSpeed, setSpeechSpeed] = usePersistedState<number>('vanizan-speech-speed', 0.8);
  const [collection, setCollection] = usePersistedState<'wealth' | 'realestate'>('vanizan-collection', 'wealth');
  const [selectedCategory, setSelectedCategory] = usePersistedState<string>('vanizan-category', 'همه');
  const [currentIndex, setCurrentIndex] = usePersistedState<number>('vanizan-last-affirmation', 0);
  const [nightMode, setNightMode] = usePersistedState<boolean>('vanizan-night-mode', false);
  const [activeTab, setActiveTab] = usePersistedState<Tab>('vanizan-tab', 'home');

  const { isSpeaking, speak, stop } = useSpeech();
  const { addRepetitions, todayStats, totalReps, totalSessions, totalMinutes } = useStats();

  // Active collection data
  const activeAffirmations = collection === 'wealth' ? affirmations : realEstateAffirmations;
  const activeCategories = collection === 'wealth' ? categories : realEstateCategories;

  // Memoized filtered affirmations
  const filteredAffirmations = useMemo(() =>
    selectedCategory === 'همه'
      ? activeAffirmations
      : activeAffirmations.filter(a => a.category === selectedCategory),
    [selectedCategory, activeAffirmations]
  );

  // Switch collection handler
  const handleCollectionChange = useCallback((col: 'wealth' | 'realestate') => {
    setCollection(col);
    setSelectedCategory('همه');
    setCurrentIndex(0);
    stop();
  }, [setCollection, setSelectedCategory, setCurrentIndex]);

  const currentAffirmation = useMemo(() =>
    filteredAffirmations[currentIndex % filteredAffirmations.length],
    [filteredAffirmations, currentIndex]
  );

  // Save last affirmation index
  useEffect(() => {
    localStorage.setItem('vanizan-last-affirmation', currentIndex.toString());
  }, [currentIndex]);

  // Load voices
  useEffect(() => {
    window.speechSynthesis.getVoices();
    const handler = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = handler;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // Handlers
  const handleNext = useCallback(() => {
    stop();
    setCurrentIndex(prev => (prev + 1) % filteredAffirmations.length);
  }, [filteredAffirmations.length, stop, setCurrentIndex]);

  const handlePrev = useCallback(() => {
    stop();
    setCurrentIndex(prev => (prev - 1 + filteredAffirmations.length) % filteredAffirmations.length);
  }, [filteredAffirmations.length, stop, setCurrentIndex]);

  const handleSpeak = useCallback(() => {
    if (isSpeaking) {
      stop();
    } else {
      speak(currentAffirmation.text, speechSpeed);
      addRepetitions(1);
    }
  }, [isSpeaking, stop, speak, currentAffirmation.text, speechSpeed, addRepetitions]);

  const handleSpeakAll = useCallback(() => {
    if (isSpeaking) { stop(); return; }
    let i = 0;
    const speakNext = () => {
      if (i >= filteredAffirmations.length) return;
      const u = new SpeechSynthesisUtterance(filteredAffirmations[i].text);
      u.lang = 'fa-IR';
      u.rate = speechSpeed;
      const voices = window.speechSynthesis.getVoices();
      const faVoice = voices.find(v => v.lang.startsWith('fa'));
      if (faVoice) u.voice = faVoice;
      u.onend = () => { i++; speakNext(); };
      window.speechSynthesis.speak(u);
    };
    speakNext();
  }, [isSpeaking, stop, filteredAffirmations, speechSpeed]);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
  }, [setSelectedCategory, setCurrentIndex]);

  const handleCustomSpeak = useCallback((text: string, speed: number) => {
    speak(text, speed);
    addRepetitions(1);
  }, [speak, addRepetitions]);

  const handleRepetitionComplete = useCallback((count: number) => {
    addRepetitions(count);
  }, [addRepetitions]);

  // Secure audio file upload validation
  const handleSecureUpload = useCallback((file: File, callback: (url: string, name: string) => void) => {
    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    const allowed = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/x-m4a'];

    if (!allowed.includes(file.type) && !file.name.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      alert('فرمت صوتی مجاز نیست. فقط MP3, WAV, OGG, M4A');
      return;
    }
    if (file.size > MAX_SIZE) {
      alert('حجم فایل نباید بیشتر از ۱۵ مگابایت باشد');
      return;
    }
    try {
      const url = URL.createObjectURL(file);
      callback(url, file.name);
    } catch (e) {
      alert('خطا در بارگذاری فایل صوتی');
    }
  }, []);

  return (
    <div className={`min-h-screen text-white no-select ${nightMode ? 'night-mode' : ''}`} dir="rtl"
      style={{
        backgroundImage: 'url(/images/wealth-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundColor: nightMode ? 'rgba(0,0,0,0.75)' : undefined,
      }}
    >
      <Watermark />
      <GoldenParticles />
      <div className="fixed top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 max-w-lg mx-auto pb-28 px-3">
        <Header />

        {/* Install + Share */}
        <InstallPrompt />
        <ShareButton />

        {/* Quick Stats */}
        <div className="flex items-center justify-between glass rounded-2xl px-4 py-3 mb-4">
          <div className="text-center">
            <p className="text-gold-500 text-xl font-black">{todayStats.repetitions + totalReps}</p>
            <p className="text-gold-400/50 text-[10px]">تکرارهای امروز</p>
          </div>
          <div className="w-px h-8 bg-gold-500/20"></div>
          <div className="text-center">
            <p className="text-gold-500 text-xl font-black">🔥 {todayStats.sessions}</p>
            <p className="text-gold-400/50 text-[10px]">جلسه امروز</p>
          </div>
          <div className="w-px h-8 bg-gold-500/20"></div>
          <DailyTimer />
        </div>

        {/* TAB NAV */}
        <div className="flex mb-3 rounded-2xl overflow-hidden glass p-1">
          {[
            { id: 'home', label: '🏠 خانه', icon: '🏠' },
            { id: 'sounds', label: '🎵 صداها', icon: '🎵' },
            { id: 'counter', label: '🔢 شمارنده', icon: '🔢' },
            { id: 'custom', label: '✍️ شخصی', icon: '✍️' },
            { id: 'stats', label: '📊 آمار', icon: '📊' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${activeTab === tab.id ? 'bg-gold-500 text-deep-navy shadow' : 'text-gold-300/70'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* HOME TAB */}
        {activeTab === 'home' && (
          <>
            {/* Collection Switcher */}
            <div className="flex gap-2 mb-4 p-1.5 glass rounded-2xl">
              <button
                onClick={() => handleCollectionChange('wealth')}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex flex-col items-center gap-0.5 ${
                  collection === 'wealth'
                    ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-deep-navy shadow-lg shadow-gold-500/30'
                    : 'text-gold-300/70 hover:bg-gold-500/10'
                }`}
              >
                <span className="text-lg">💎</span>
                <span>باورهای ثروت</span>
              </button>
              <button
                onClick={() => handleCollectionChange('realestate')}
                className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex flex-col items-center gap-0.5 ${
                  collection === 'realestate'
                    ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-deep-navy shadow-lg shadow-emerald-500/30'
                    : 'text-emerald-300/70 hover:bg-emerald-500/10'
                }`}
              >
                <span className="text-lg">🏛️</span>
                <span>مشاور املاک</span>
              </button>
            </div>

            <AffirmationCard
              affirmation={currentAffirmation}
              isActive={true}
              isSpeaking={isSpeaking}
              onSpeak={handleSpeak}
            />

            <div className="flex items-center justify-center gap-4 mt-6">
              <button onClick={handlePrev} className="w-12 h-12 rounded-full glass flex items-center justify-center text-gold-400 text-xl active:scale-95">◀</button>
              <button onClick={handleSpeak} className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${isSpeaking ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-deep-navy scale-110' : 'bg-gold-500/20 text-gold-400 border-2 border-gold-500/30'}`}>
                {isSpeaking ? '⏸' : '🎤'}
              </button>
              <button onClick={handleNext} className="w-12 h-12 rounded-full glass flex items-center justify-center text-gold-400 text-xl active:scale-95">▶</button>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setActiveTab('sounds')} className="flex-1 py-2.5 rounded-2xl glass text-sm font-bold text-gold-300 border border-gold-500/20">🎵 موزیک‌های درمانی</button>
              <button onClick={() => setActiveTab('counter')} className="flex-1 py-2.5 rounded-2xl glass text-sm font-bold text-gold-300 border border-gold-500/20">🔢 تکرار ۱۰۸</button>
            </div>

            <div className="mt-4">
              <button onClick={handleSpeakAll} className="w-full py-3 rounded-2xl glass text-gold-300 text-sm font-bold">📖 خواندن تمام باورها</button>
            </div>

            {/* Subliminal Player - 7 Chakra subconscious programming */}
            <div className="mt-4">
              <SubliminalPlayer
                affirmations={filteredAffirmations}
                speak={speak}
                stop={stop}
                speechSpeed={speechSpeed}
                onRepetition={addRepetitions}
              />
            </div>

            {/* Speech speed */}
            <div className="glass rounded-2xl p-4 mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gold-300 text-sm font-bold">⚡ سرعت صدا</span>
                <span className="text-gold-500 font-bold text-sm">{speechSpeed.toFixed(1)}x</span>
              </div>
              <input type="range" min="0.3" max="2" step="0.1" value={speechSpeed} onChange={e => setSpeechSpeed(parseFloat(e.target.value))} className="w-full accent-gold-500" />
            </div>

            {/* Category filter */}
            <div className="mt-4 flex flex-wrap gap-2">
              {activeCategories.map(cat => (
                <button key={cat} onClick={() => handleCategoryChange(cat)} className={`px-3.5 py-1 rounded-full text-xs font-bold ${selectedCategory === cat ? (collection === 'wealth' ? 'bg-gold-500 text-deep-navy' : 'bg-emerald-500 text-deep-navy') : 'glass text-gold-400/70'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </>
        )}

        {/* SOUNDS TAB - Professional Audio + Built-in Music */}
        {activeTab === 'sounds' && (
          <>
            <ProfessionalAudioPlayer onTrackChange={(id) => console.log('Playing', id)} />

            {/* Legacy secure upload for custom music */}
            <div className="glass rounded-3xl p-5">
              <div className="text-gold-400 font-bold mb-2">📂 آپلود موسیقی دلخواه (ایمن)</div>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleSecureUpload(file, (url, name) => {
                      // Simple playback fallback
                      const audio = new Audio(url);
                      audio.play();
                      alert(`در حال پخش: ${name}`);
                    });
                  }
                }}
                className="w-full text-sm text-gold-300 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold-500/20 file:text-gold-300"
              />
              <div className="text-[10px] text-gold-400/50 mt-2">حداکثر ۱۵ مگابایت • MP3 / WAV / OGG / M4A</div>
            </div>
          </>
        )}

        {/* REPETITION COUNTER */}
        {activeTab === 'counter' && (
          <RepetitionCounter
            onComplete={handleRepetitionComplete}
            currentAffirmation={currentAffirmation.text}
            speechSpeed={speechSpeed}
            speak={speak}
            isSpeaking={isSpeaking}
            stop={stop}
          />
        )}

        {/* CUSTOM AFFIRMATIONS */}
        {activeTab === 'custom' && (
          <CustomAffirmation
            onSpeak={handleCustomSpeak}
            isSpeaking={isSpeaking}
            onStop={stop}
            speechSpeed={speechSpeed}
          />
        )}

        {/* STATS + REMINDER */}
        {activeTab === 'stats' && (
          <div>
            <div className="glass rounded-3xl p-5 mb-4">
              <div className="text-gold-400 font-bold mb-4">📊 آمار کلی</div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><div className="text-3xl text-gold-400">{totalReps}</div><div className="text-xs text-gold-300/70">تکرار کل</div></div>
                <div><div className="text-3xl text-gold-400">{totalSessions}</div><div className="text-xs text-gold-300/70">جلسات</div></div>
                <div><div className="text-3xl text-gold-400">{Math.round(totalMinutes)}</div><div className="text-xs text-gold-300/70">دقیقه</div></div>
              </div>
            </div>

            <InstallAppCard />

            <DailyReminder />

            <NightModeToggle enabled={nightMode} onToggle={setNightMode} />
          </div>
        )}

        {/* Progress dots */}
        {activeTab === 'home' && (
          <div className="flex justify-center gap-1.5 mt-6">
            {filteredAffirmations.slice(0, 10).map((_, idx) => (
              <button key={idx} onClick={() => setCurrentIndex(idx)} className={`rounded-full transition-all ${idx === currentIndex % filteredAffirmations.length ? 'w-6 h-2 bg-gold-500' : 'w-2 h-2 bg-gold-500/20'}`} />
            ))}
          </div>
        )}

        {/* Branding */}
        <div className="mt-8 text-center pb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 text-sm">
            💎 <span className="font-bold text-gold-400">گرداب ثروت ونیزان</span> 💎
          </div>
          <p className="text-gold-400/30 text-[10px] mt-2">vanizan.com © 2025 — تمام حقوق محفوظ است</p>
          <a href="/publish-guide.html" target="_blank" className="block text-gold-400/40 mt-2 text-xs underline">راهنمای انتشار</a>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        <div className="glass mx-3 mb-3 rounded-2xl flex items-center justify-around py-2 max-w-lg mx-auto">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center px-2 py-1 text-xs ${activeTab === 'home' ? 'text-gold-400' : 'text-gold-400/50'}`}>
            <span className="text-lg">🏠</span><span>خانه</span>
          </button>
          <button onClick={() => setActiveTab('sounds')} className={`flex flex-col items-center px-2 py-1 text-xs ${activeTab === 'sounds' ? 'text-gold-400' : 'text-gold-400/50'}`}>
            <span className="text-lg">🎵</span><span>صدا</span>
          </button>
          <button onClick={handleSpeak} className="relative -top-5 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 text-deep-navy shadow-xl text-2xl active:scale-90">
            {isSpeaking ? '⏸' : '🔊'}
          </button>
          <button onClick={() => setActiveTab('counter')} className={`flex flex-col items-center px-2 py-1 text-xs ${activeTab === 'counter' ? 'text-gold-400' : 'text-gold-400/50'}`}>
            <span className="text-lg">🔢</span><span>تکرار</span>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center px-2 py-1 text-xs ${activeTab === 'stats' ? 'text-gold-400' : 'text-gold-400/50'}`}>
            <span className="text-lg">📊</span><span>آمار</span>
          </button>
        </div>
      </div>
    </div>
  );
}
