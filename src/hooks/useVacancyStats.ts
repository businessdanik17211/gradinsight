import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface VacancyStats {
  category: string;
  count: number;
  avgSalaryMin: number;
  avgSalaryMax: number;
  avgSalary: number;
}

export function useVacancyStats() {
  const [stats, setStats] = useState<VacancyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Get total count first (this is fast)
        const { count, error: countError } = await supabase
          .from('vacancies')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        setTotalCount(count || 0);
        
        // Use RPC function to get aggregated stats from server
        // This avoids the 1000 row limit
        const { data: rpcData, error: rpcError } = await supabase
          .rpc('get_vacancy_stats');
        
        if (rpcError) {
          console.log('RPC failed, falling back to client-side aggregation');
          
          // Fallback: get all data in chunks if RPC not available
          const allVacancies: any[] = [];
          const pageSize = 1000;
          let page = 0;
          let hasMore = true;
          
          while (hasMore && page < 50) { // Max 50k records
            const { data, error: fetchError } = await supabase
              .from('vacancies')
              .select('category, salary_min, salary_max')
              .range(page * pageSize, (page + 1) * pageSize - 1);
            
            if (fetchError) throw fetchError;
            
            if (data && data.length > 0) {
              allVacancies.push(...data);
              page++;
              hasMore = data.length === pageSize;
            } else {
              hasMore = false;
            }
          }
          
          if (allVacancies.length === 0) {
            setStats([]);
            setLoading(false);
            return;
          }
          
          // Aggregate client-side
          const categoryMap = new Map<string, {
            count: number;
            totalMin: number;
            totalMax: number;
            validSalaryCount: number;
          }>();

          allVacancies.forEach((vacancy) => {
            const category = vacancy.category || 'Другое';
            
            if (!categoryMap.has(category)) {
              categoryMap.set(category, {
                count: 0,
                totalMin: 0,
                totalMax: 0,
                validSalaryCount: 0,
              });
            }

            const stats = categoryMap.get(category)!;
            stats.count++;

            if (vacancy.salary_min || vacancy.salary_max) {
              stats.totalMin += vacancy.salary_min || 0;
              stats.totalMax += vacancy.salary_max || 0;
              stats.validSalaryCount++;
            }
          });

          const aggregatedStats: VacancyStats[] = Array.from(categoryMap.entries())
            .map(([category, data]) => ({
              category,
              count: data.count,
              avgSalaryMin: data.validSalaryCount > 0 
                ? Math.round(data.totalMin / data.validSalaryCount) 
                : 0,
              avgSalaryMax: data.validSalaryCount > 0 
                ? Math.round(data.totalMax / data.validSalaryCount) 
                : 0,
              avgSalary: data.validSalaryCount > 0 
                ? Math.round((data.totalMin + data.totalMax) / (2 * data.validSalaryCount)) 
                : 0,
            }))
            .sort((a, b) => b.count - a.count);

          setStats(aggregatedStats);
          console.log(`[useVacancyStats] Client-side: Loaded ${allVacancies.length} vacancies, ${aggregatedStats.length} categories`);
        } else {
          // RPC succeeded
          const formattedStats: VacancyStats[] = (rpcData || []).map((row: any) => ({
            category: row.category,
            count: Number(row.count),
            avgSalaryMin: Number(row.avg_salary_min) || 0,
            avgSalaryMax: Number(row.avg_salary_max) || 0,
            avgSalary: Number(row.avg_salary) || 0,
          }));
          
          setStats(formattedStats);
          console.log(`[useVacancyStats] RPC: Loaded ${formattedStats.length} categories, total count: ${count}`);
        }
      } catch (err) {
        console.error('Error fetching vacancy stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, loading, error, totalCount };
}
