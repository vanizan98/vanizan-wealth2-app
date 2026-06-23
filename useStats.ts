import { useState, useEffect, useCallback } from 'react';

export interface SessionStats {
  date: string;
  sessions: number;
  repetitions: number;
  totalMinutes: number;
}

export function useStats() {
  const [stats, setStats] = useState<SessionStats[]>(() => {
    try {
      const saved = localStorage.getItem('vanizan-stats');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const todayKey = new Date().toISOString().split('T')[0];

  const todayStats = stats.find(s => s.date === todayKey) || { date: todayKey, sessions: 0, repetitions: 0, totalMinutes: 0 };

  const addSession = useCallback((minutes: number = 1) => {
    setStats(prev => {
      const idx = prev.findIndex(s => s.date === todayKey);
      const newStats = [...prev];
      if (idx >= 0) {
        newStats[idx] = {
          ...newStats[idx],
          sessions: newStats[idx].sessions + 1,
          totalMinutes: newStats[idx].totalMinutes + minutes,
        };
      } else {
        newStats.push({ date: todayKey, sessions: 1, repetitions: 0, totalMinutes: minutes });
      }
      return newStats.slice(-30);
    });
  }, [todayKey]);

  const addRepetitions = useCallback((count: number) => {
    setStats(prev => {
      const idx = prev.findIndex(s => s.date === todayKey);
      const newStats = [...prev];
      if (idx >= 0) {
        newStats[idx] = { ...newStats[idx], repetitions: newStats[idx].repetitions + count };
      } else {
        newStats.push({ date: todayKey, sessions: 0, repetitions: count, totalMinutes: 0 });
      }
      return newStats.slice(-30);
    });
  }, [todayKey]);

  useEffect(() => {
    localStorage.setItem('vanizan-stats', JSON.stringify(stats));
  }, [stats]);

  const totalReps = stats.reduce((sum, s) => sum + s.repetitions, 0);
  const totalSessions = stats.reduce((sum, s) => sum + s.sessions, 0);
  const totalMinutes = stats.reduce((sum, s) => sum + s.totalMinutes, 0);

  return {
    todayStats,
    totalReps,
    totalSessions,
    totalMinutes,
    addSession,
    addRepetitions,
    stats
  };
}
