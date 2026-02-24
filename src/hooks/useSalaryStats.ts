import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CategorySalaryStats {
  category: string;
  avgSalaryMin: number;
  avgSalaryMax: number;
  avgSalary: number;
  vacancyCount: number;
}

export interface SalaryStats {
  categories: CategorySalaryStats[];
  totalVacancies: number;
  overallAvgSalary: number;
  lastUpdated: string | null;
}

export function useSalaryStats() {
  return useQuery({
    queryKey: ['salary-stats'],
    queryFn: async (): Promise<SalaryStats> => {
      // Получаем агрегированные данные из vacancies - ВСЕ вакансии (increased limit)
      const { data: vacancies, error } = await supabase
        .from('vacancies')
        .select('category, salary_min, salary_max, parsed_at')
        .limit(50000);

      if (error) throw error;

      // Группируем по категориям
      const categoryMap = new Map<string, { 
        salaryMins: number[]; 
        salaryMaxs: number[]; 
        count: number;
      }>();

      let lastParsed: string | null = null;

      vacancies?.forEach(v => {
        if (!categoryMap.has(v.category)) {
          categoryMap.set(v.category, { salaryMins: [], salaryMaxs: [], count: 0 });
        }
        const cat = categoryMap.get(v.category)!;
        if (v.salary_min) cat.salaryMins.push(v.salary_min);
        if (v.salary_max) cat.salaryMaxs.push(v.salary_max);
        cat.count++;
        
        if (!lastParsed || v.parsed_at > lastParsed) {
          lastParsed = v.parsed_at;
        }
      });

      const categories: CategorySalaryStats[] = [];
      let totalSalary = 0;
      let totalCount = 0;

      categoryMap.forEach((data, category) => {
        const avgMin = data.salaryMins.length > 0 
          ? Math.round(data.salaryMins.reduce((a, b) => a + b, 0) / data.salaryMins.length)
          : 0;
        const avgMax = data.salaryMaxs.length > 0 
          ? Math.round(data.salaryMaxs.reduce((a, b) => a + b, 0) / data.salaryMaxs.length)
          : avgMin;
        const avgSalary = Math.round((avgMin + avgMax) / 2);

        categories.push({
          category,
          avgSalaryMin: avgMin,
          avgSalaryMax: avgMax,
          avgSalary,
          vacancyCount: data.count,
        });

        totalSalary += avgSalary * data.count;
        totalCount += data.count;
      });

      // Сортируем по средней зарплате
      categories.sort((a, b) => b.avgSalary - a.avgSalary);

      return {
        categories,
        totalVacancies: vacancies?.length || 0,
        overallAvgSalary: totalCount > 0 ? Math.round(totalSalary / totalCount) : 0,
        lastUpdated: lastParsed,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 минут
  });
}
