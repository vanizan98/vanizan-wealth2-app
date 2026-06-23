import { useState, useRef } from 'react';

export default function AudioPlayer() {
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicFile, setMusicFile] = useState<string | null>(null);
  const [musicName, setMusicName] = useState('');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(0.7);
  const [currentSeek, setCurrentSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleMusicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMusicFile(url);
      setMusicName(file.name);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
      }
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current || !musicFile) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const changeSpeed = () => {
    const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const idx = speeds.indexOf(playbackSpeed);
    const newSpeed = speeds[(idx + 1) % speeds.length];
    setPlaybackSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = parseFloat(e.target.value);
    setCurrentSeek(s);
    if (audioRef.current) {
      audioRef.current.currentTime = s;
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = playbackSpeed;
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentSeek(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsMusicPlaying(false);
    setCurrentSeek(0);
  };

  const formatTime = (t: number) => {
    if (isNaN(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      {/* Toggle button */}
      <button
        onClick={() => setShowPlayer(!showPlayer)}
        className="w-full flex items-center justify-between px-5 py-3 glass rounded-2xl text-gold-300 text-sm font-bold mb-3 hover:bg-gold-500/10 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">🎵</span>
          <span>پخش‌کننده موسیقی</span>
        </span>
        <span className={`transition-transform duration-300 ${showPlayer ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {showPlayer && (
        <div className="glass rounded-2xl p-4 mb-4 fade-in-up">
          {/* Upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleMusicUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gold-500/30 text-gold-400 text-sm font-medium hover:border-gold-500/60 hover:bg-gold-500/5 transition-all mb-4"
          >
            <span className="text-2xl">📂</span>
            <span>انتخاب موسیقی دلخواه</span>
          </button>

          {musicName && (
            <div className="text-center text-gold-300/70 text-xs mb-3 truncate">
              🎶 {musicName}
            </div>
          )}

          <audio
            ref={audioRef}
            src={musicFile || ''}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
          />

          {/* Progress */}
          {musicFile && (
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gold-400/60 text-[10px] w-8 text-left">{formatTime(currentSeek)}</span>
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentSeek}
                onChange={handleSeek}
                className="flex-1 h-1.5 appearance-none rounded-full bg-gold-500/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 cursor-pointer"
              />
              <span className="text-gold-400/60 text-[10px] w-8 text-right">{formatTime(duration)}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Speed */}
            <button
              onClick={changeSpeed}
              className="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-400 text-xs font-bold border border-gold-500/20 hover:bg-gold-500/20 transition-colors"
            >
              ⚡ {playbackSpeed}x
            </button>

            {/* Play/Pause */}
            <button
              onClick={toggleMusic}
              disabled={!musicFile}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                musicFile
                  ? isMusicPlaying
                    ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/30'
                    : 'bg-gold-500 text-deep-navy shadow-lg shadow-gold-500/30'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isMusicPlaying ? '⏸' : '▶'}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5">
              <span className="text-gold-400 text-sm">🔊</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={changeVolume}
                className="w-16 h-1.5 appearance-none rounded-full bg-gold-500/20 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gold-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
