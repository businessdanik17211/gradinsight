import { useState, useEffect, useCallback } from 'react';
import { ProfessionService } from '@/services/professionService';
import type { 
  ProfessionAnalytics, 
  ProfessionStats, 
  ProfessionFilters 
} from '@/types/professions';

export function useProfessions(initialFilters: ProfessionFilters = {}) {
  const [professions, setProfessions] = useState<ProfessionAnalytics[]>([]);
  const [stats, setStats] = useState<ProfessionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProfessionFilters>(initialFilters);

  const loadProfessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfessionService.getProfessions(filters);
      setProfessions(data);
    } catch (err) {
      setError('Не удалось загрузить данные о профессиях');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const data = await ProfessionService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  const refresh = useCallback(async () => {
    await Promise.all([loadProfessions(), loadStats()]);
  }, [loadProfessions, loadStats]);

  useEffect(() => {
    loadProfessions();
  }, [loadProfessions]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const updateFilters = useCallback((newFilters: Partial<ProfessionFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    professions,
    stats,
    loading,
    error,
    filters,
    updateFilters,
    refresh,
  };
}

export function useTopProfessions(limit: number = 10) {
  const [professions, setProfessions] = useState<ProfessionAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTop = async () => {
      try {
        setLoading(true);
        const data = await ProfessionService.getTopProfessions(limit);
        setProfessions(data);
      } catch (err) {
        setError('Не удалось загрузить топ профессий');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadTop();
  }, [limit]);

  return { professions, loading, error };
}

export function useProfessionByName(name: string | null) {
  const [profession, setProfession] = useState<ProfessionAnalytics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    const loadProfession = async () => {
      try {
        setLoading(true);
        const data = await ProfessionService.getProfessionByName(name);
        setProfession(data);
      } catch (err) {
        setError('Не удалось загрузить данные о профессии');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfession();
  }, [name]);

  return { profession, loading, error };
}
