import { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  shape: 'circle' | 'diamond' | 'star';
}

export default function GoldenParticles() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    const colors = ['#FFD700', '#DAA520', '#FFA500', '#FFEC8B', '#F0E68C'];
    const shapes: Array<'circle' | 'diamond' | 'star'> = ['circle', 'diamond', 'circle', 'circle', 'star'];

    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        size: Math.random() * 6 + 2,
        delay: Math.random() * 15,
        duration: Math.random() * 10 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            borderRadius: p.shape === 'diamond' ? '0' : p.shape === 'circle' ? '50%' : '0',
            transform: p.shape === 'diamond' ? 'rotate(45deg)' : p.shape === 'star' ? 'rotate(45deg)' : undefined,
            animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}
