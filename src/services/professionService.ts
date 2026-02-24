import { supabase } from '@/integrations/supabase/client';
import type { 
  ProfessionAnalytics, 
  ProfessionFilters, 
  ProfessionStats,
  CareerPath,
  DemandLevel,
  ProfessionCategory 
} from '@/types/professions';

// Type casting to bypass Supabase type checking for new tables
const from = (table: string) => supabase.from(table as any);

export class ProfessionService {
  /**
   * Get all professions with analytics (forecasts + salaries)
   */
  static async getProfessions(filters: ProfessionFilters = {}): Promise<ProfessionAnalytics[]> {
    let query = from('profession_analytics')
      .select('*');

    // Apply filters
    if (filters.demandLevel && filters.demandLevel !== 'all') {
      query = query.eq('demand_level', filters.demandLevel);
    }

    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }

    if (filters.city && filters.city !== 'all') {
      query = query.eq('forecast_city', filters.city);
    }

    if (filters.year) {
      query = query.eq('forecast_year', filters.year);
    }

    if (filters.searchQuery) {
      query = query.ilike('profession_name', `%${filters.searchQuery}%`);
    }

    const { data, error } = await query.order('overall_rating', { ascending: false });

    if (error) {
      console.error('Error fetching professions:', error);
      throw error;
    }

    return (data as ProfessionAnalytics[]) || [];
  }

  /**
   * Get top professions by overall rating
   */
  static async getTopProfessions(limit: number = 10): Promise<ProfessionAnalytics[]> {
    const { data, error } = await from('profession_analytics')
      .select('*')
      .order('overall_rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top professions:', error);
      throw error;
    }

    return (data as ProfessionAnalytics[]) || [];
  }

  /**
   * Get profession by name
   */
  static async getProfessionByName(name: string): Promise<ProfessionAnalytics | null> {
    const { data, error } = await from('profession_analytics')
      .select('*')
      .eq('profession_name', name)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Error fetching profession:', error);
      throw error;
    }

    return data as ProfessionAnalytics;
  }

  /**
   * Get professions by demand level
   */
  static async getProfessionsByDemand(demandLevel: DemandLevel): Promise<ProfessionAnalytics[]> {
    const { data, error } = await from('profession_analytics')
      .select('*')
      .eq('demand_level', demandLevel)
      .order('avg_salary', { ascending: false });

    if (error) {
      console.error('Error fetching professions by demand:', error);
      throw error;
    }

    return (data as ProfessionAnalytics[]) || [];
  }

  /**
   * Get professions by category
   */
  static async getProfessionsByCategory(category: ProfessionCategory): Promise<ProfessionAnalytics[]> {
    const { data, error } = await from('profession_analytics')
      .select('*')
      .eq('category', category)
      .order('overall_rating', { ascending: false });

    if (error) {
      console.error('Error fetching professions by category:', error);
      throw error;
    }

    return (data as ProfessionAnalytics[]) || [];
  }

  /**
   * Get available cities
   */
  static async getCities(): Promise<string[]> {
    const { data, error } = await from('profession_analytics')
      .select('forecast_city')
      .order('forecast_city');

    if (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }

    const cities = [...new Set((data as any[])?.map(d => d.forecast_city))];
    return cities;
  }

  /**
   * Get profession statistics
   */
  static async getStats(): Promise<ProfessionStats> {
    const [allProfessions, highDemand, mediumDemand, lowDemand, workers, employees, specialists] = await Promise.all([
      this.getProfessions(),
      this.getProfessionsByDemand('high'),
      this.getProfessionsByDemand('medium'),
      this.getProfessionsByDemand('low'),
      this.getProfessionsByCategory('worker'),
      this.getProfessionsByCategory('employee'),
      this.getProfessionsByCategory('specialist'),
    ]);

    const totalSalary = allProfessions.reduce((sum, p) => sum + (p.avg_salary || 0), 0);
    const avgSalary = allProfessions.length > 0 ? totalSalary / allProfessions.length : 0;

    return {
      total: allProfessions.length,
      byDemand: {
        high: highDemand.length,
        medium: mediumDemand.length,
        low: lowDemand.length,
      },
      byCategory: {
        worker: workers.length,
        employee: employees.length,
        specialist: specialists.length,
      },
      avgSalary: Math.round(avgSalary),
      topProfessions: allProfessions.slice(0, 5),
    };
  }

  /**
   * Get career path for a profession category
   */
  static async getCareerPath(category: string): Promise<CareerPath | null> {
    const { data, error } = await from('career_paths')
      .select('*')
      .eq('specialty_category', category)
      .order('level_order', { ascending: true });

    if (error) {
      console.error('Error fetching career path:', error);
      throw error;
    }

    if (!data || data.length === 0) return null;

    return {
      specialty_category: category,
      levels: (data as any[]).map(d => ({
        level_name: d.level_name,
        level_order: d.level_order,
        typical_salary_min: d.typical_salary_min,
        typical_salary_max: d.typical_salary_max,
        years_experience: d.years_experience,
        description: d.description,
      })),
    };
  }

  /**
   * Search professions by specialty
   */
  static async searchBySpecialty(specialty: string): Promise<ProfessionAnalytics[]> {
    const { data, error } = await from('profession_analytics')
      .select('*')
      .contains('related_specialties', [specialty]);

    if (error) {
      console.error('Error searching by specialty:', error);
      throw error;
    }

    return (data as ProfessionAnalytics[]) || [];
  }

  /**
   * Get salary history for a profession
   */
  static async getSalaryHistory(professionName: string): Promise<{ month: number; avg_salary: number; vacancies_count: number }[]> {
    const { data, error } = await from('profession_salaries')
      .select('month, avg_salary, vacancies_count')
      .eq('profession_name', professionName)
      .order('month', { ascending: true });

    if (error) {
      console.error('Error fetching salary history:', error);
      throw error;
    }

    return (data as any[]) || [];
  }
}
