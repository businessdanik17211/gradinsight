import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SalaryStat {
  id: number;
  year: number;
  month: number | null;
  region_type: string;
  region_name: string;
  industry_code: string | null;
  industry_name: string;
  industry_category: string | null;
  avg_salary: number | null;
  median_salary: number | null;
  min_salary: number | null;
  max_salary: number | null;
  source: string | null;
  source_url: string | null;
}

export interface SalaryFilters {
  year: number | null;
  region: string | null;
  industry: string | null;
  category: string | null;
}

export function useSalaryStatistics() {
  const [data, setData] = useState<SalaryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<SalaryFilters>({
    year: null,
    region: null,
    industry: null,
    category: null,
  });

  // Fetch all data on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const { data: stats, error: fetchError } = await supabase
          .from('salary_statistics' as any)
          .select('*')
          .order('year', { ascending: false })
          .order('region_name', { ascending: true })
          .order('industry_name', { ascending: true });
        
        if (fetchError) {
          throw fetchError;
        }
        
        setData((stats || []) as any);
      } catch (err) {
        console.error('Error fetching salary statistics:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Get unique values for filter dropdowns
  const years = useMemo(() => 
    [...new Set(data.map(d => d.year))].sort((a, b) => b - a),
    [data]
  );
  
  const regions = useMemo(() => 
    [...new Set(data.map(d => d.region_name))].sort(),
    [data]
  );
  
  const industries = useMemo(() => 
    [...new Set(data.filter(d => d.industry_name).map(d => d.industry_name))].sort(),
    [data]
  );
  
  const categories = useMemo(() => 
    [...new Set(data.filter(d => d.industry_category).map(d => d.industry_category))].sort(),
    [data]
  );

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      if (filters.year && item.year !== filters.year) return false;
      if (filters.region && item.region_name !== filters.region) return false;
      if (filters.industry && item.industry_name !== filters.industry) return false;
      if (filters.category && item.industry_category !== filters.category) return false;
      return true;
    });
  }, [data, filters]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const validData = filteredData.filter(d => d.avg_salary !== null);
    
    if (validData.length === 0) {
      return {
        count: 0,
        avgSalary: 0,
        maxSalary: 0,
        minSalary: 0,
      };
    }
    
    const salaries = validData.map(d => d.avg_salary as number);
    
    return {
      count: validData.length,
      avgSalary: Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length),
      maxSalary: Math.max(...salaries),
      minSalary: Math.min(...salaries),
    };
  }, [filteredData]);

  const setFilter = (key: keyof SalaryFilters, value: string | number | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '' ? null : value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      year: null,
      region: null,
      industry: null,
      category: null,
    });
  };

  return {
    data: filteredData,
    loading,
    error,
    filters,
    years,
    regions,
    industries,
    categories,
    summary,
    setFilter,
    clearFilters,
    totalCount: data.length,
  };
}
