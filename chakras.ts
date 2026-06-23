export interface Chakra {
  id: number;
  name: string;
  persianName: string;
  color: string;
  glow: string;
  hex: string;
}

// 7 Chakra colors - from root to crown
export const chakras: Chakra[] = [
  { id: 1, name: 'Root', persianName: 'ریشه', color: '#FF0000', glow: 'rgba(255,0,0,0.7)', hex: '#FF0000' },
  { id: 2, name: 'Sacral', persianName: 'خاجی', color: '#FF7F00', glow: 'rgba(255,127,0,0.7)', hex: '#FF7F00' },
  { id: 3, name: 'Solar', persianName: 'شبکه خورشیدی', color: '#FFD700', glow: 'rgba(255,215,0,0.7)', hex: '#FFD700' },
  { id: 4, name: 'Heart', persianName: 'قلب', color: '#00FF00', glow: 'rgba(0,255,0,0.7)', hex: '#00FF00' },
  { id: 5, name: 'Throat', persianName: 'گلو', color: '#00BFFF', glow: 'rgba(0,191,255,0.7)', hex: '#00BFFF' },
  { id: 6, name: 'ThirdEye', persianName: 'چشم سوم', color: '#4B0082', glow: 'rgba(75,0,130,0.8)', hex: '#4B0082' },
  { id: 7, name: 'Crown', persianName: 'تاج', color: '#9400D3', glow: 'rgba(148,0,211,0.7)', hex: '#9400D3' },
];

// CSS gradient string using all 7 chakra colors
export const chakraGradient = 'linear-gradient(90deg, #FF0000, #FF7F00, #FFD700, #00FF00, #00BFFF, #4B0082, #9400D3, #FF0000)';
