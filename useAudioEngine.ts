import { useState, useRef, useCallback } from 'react';

interface AudioEngine {
  isPlaying: boolean;
  currentTrack: string | null;
  volume: number;
  playBuiltIn: (trackId: string) => void;
  stop: () => void;
  setVolume: (v: number) => void;
  error: string | null;
}

export function useAudioEngine(): AudioEngine {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [volume, setVolumeState] = useState(0.65);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);

  const getAudioContext = (): AudioContext => {
    if (!audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioContextClass();
      } catch (e) {
        setError('دستگاه شما از Web Audio پشتیبانی نمی‌کند');
        throw e;
      }
    }
    return audioContextRef.current;
  };

  const stop = useCallback(() => {
    try {
      oscillatorsRef.current.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      oscillatorsRef.current = [];

      if (noiseRef.current) {
        try { noiseRef.current.stop(); } catch {}
        noiseRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        // keep context alive for reuse
      }
      setIsPlaying(false);
      setCurrentTrack(null);
      setError(null);
    } catch (e) {
      console.error('Audio stop error:', e);
    }
  }, []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (gainRef.current) {
      gainRef.current.gain.value = v;
    }
  }, []);

  const playBuiltIn = useCallback((trackId: string) => {
    try {
      stop();
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const masterGain = ctx.createGain();
      masterGain.gain.value = volume;
      gainRef.current = masterGain;

      const destination = ctx.destination;

      if (trackId === 'delta' || trackId === 'theta' || trackId === 'alpha') {
        // Binaural + low freq
        const freq = trackId === 'delta' ? 2.5 : trackId === 'theta' ? 6 : 10;
        
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.value = freq;
        osc2.frequency.value = freq + 4;

        const pan1 = ctx.createStereoPanner();
        const pan2 = ctx.createStereoPanner();
        pan1.pan.value = -0.8;
        pan2.pan.value = 0.8;

        const lowpass = ctx.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.value = 120;

        const g1 = ctx.createGain();
        const g2 = ctx.createGain();
        g1.gain.value = 0.8;
        g2.gain.value = 0.8;

        osc1.connect(g1).connect(pan1).connect(lowpass).connect(masterGain);
        osc2.connect(g2).connect(pan2).connect(lowpass).connect(masterGain);

        osc1.start();
        osc2.start();
        oscillatorsRef.current = [osc1, osc2];
      } 
      else if (trackId === 'rain') {
        // Pink noise
        const bufferSize = 2 * ctx.sampleRate;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.7;

        const noiseGain = ctx.createGain();
        noiseGain.gain.value = 0.35;

        noise.connect(filter).connect(noiseGain).connect(masterGain);
        noise.start();
        noiseRef.current = noise;
        filterRef.current = filter;
      } 
      else if (trackId === 'cosmic' || trackId === 'bowls') {
        // Ambient pads + harmonic tones
        const base = trackId === 'cosmic' ? 8 : 4;
        const harmonics = [1, 1.5, 2, 2.5, 3.5];

        harmonics.forEach((h, i) => {
          const osc = ctx.createOscillator();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.value = base * h;

          const g = ctx.createGain();
          g.gain.value = 0.12 / (i + 1);

          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.03 + i * 0.01;

          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 0.4;

          lfo.connect(lfoGain).connect(osc.frequency);

          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 650;

          osc.connect(g).connect(filter).connect(masterGain);
          osc.start();
          lfo.start();
          oscillatorsRef.current.push(osc, lfo);
        });
      }

      masterGain.connect(destination);
      setIsPlaying(true);
      setCurrentTrack(trackId);
      setError(null);
    } catch (e: any) {
      console.error('Audio engine error:', e);
      setError('خطا در پخش صدا. لطفاً صفحه را رفرش کنید.');
      setIsPlaying(false);
    }
  }, [stop, volume]);

  return { isPlaying, currentTrack, volume, playBuiltIn, stop, setVolume, error };
}
