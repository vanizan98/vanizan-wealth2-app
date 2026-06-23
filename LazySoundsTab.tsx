import ProfessionalAudioPlayer from './ProfessionalAudioPlayer';

export default function LazySoundsTab() {
  return (
    <div className="fade-in-up">
      <ProfessionalAudioPlayer />
      <div className="glass rounded-3xl p-5 mt-4">
        <div className="text-gold-400 font-bold mb-2">📂 موسیقی دلخواه امن</div>
        <input type="file" accept="audio/*" className="text-sm" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            if (f.size > 15 * 1024 * 1024) return alert('حداکثر ۱۵ مگابایت');
            const url = URL.createObjectURL(f);
            const a = new Audio(url);
            a.play();
          }
        }} />
        <div className="text-[10px] text-gold-400/50 mt-1">MP3 • WAV • OGG • M4A</div>
      </div>
    </div>
  );
}
