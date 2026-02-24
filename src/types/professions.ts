// Types for profession forecasts and salaries

export type ProfessionCategory = 'worker' | 'employee' | 'specialist';
export type DemandLevel = 'high' | 'medium' | 'low';
export type OverallRating = 'excellent' | 'good' | 'average' | 'below_average';

export interface ProfessionForecast {
  id: string;
  profession_name: string;
  category: ProfessionCategory;
  demand_level: DemandLevel;
  forecast_year: number;
  source: string;
  city: string;
  description?: string;
  related_specialties?: string[];
  created_at: string;
  updated_at: string;
}

export interface ProfessionSalary {
  id: string;
  profession_name: string;
  search_query?: string;
  avg_salary?: number;
  min_salary?: number;
  max_salary?: number;
  vacancies_count?: number;
  city: string;
  year: number;
  month: number;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionAnalytics {
  id: string;
  profession_name: string;
  category: ProfessionCategory;
  demand_level: DemandLevel;
  forecast_year: number;
  forecast_source: string;
  forecast_city: string;
  description?: string;
  related_specialties?: string[];
  avg_salary?: number;
  min_salary?: number;
  max_salary?: number;
  vacancies_count?: number;
  salary_year?: number;
  salary_month?: number;
  salary_source?: string;
  overall_rating: OverallRating;
}

export interface ProfessionFilters {
  demandLevel?: DemandLevel | 'all';
  category?: ProfessionCategory | 'all';
  city?: string | 'all';
  year?: number;
  searchQuery?: string;
}

export interface ProfessionStats {
  total: number;
  byDemand: {
    high: number;
    medium: number;
    low: number;
  };
  byCategory: {
    worker: number;
    employee: number;
    specialist: number;
  };
  avgSalary: number;
  topProfessions: ProfessionAnalytics[];
}

export interface CareerLevel {
  level_name: string;
  level_order: number;
  typical_salary_min?: number;
  typical_salary_max?: number;
  years_experience?: string;
  description?: string;
}

export interface CareerPath {
  specialty_category: string;
  levels: CareerLevel[];
}

export const categoryLabels: Record<ProfessionCategory, string> = {
  worker: 'Рабочие',
  employee: 'Служащие',
  specialist: 'Специалисты',
};

export const demandLabels: Record<DemandLevel, string> = {
  high: 'Высокий спрос',
  medium: 'Средний спрос',
  low: 'Низкий спрос',
};

export const ratingLabels: Record<OverallRating, string> = {
  excellent: 'Отлично',
  good: 'Хорошо',
  average: 'Средне',
  below_average: 'Ниже среднего',
};
