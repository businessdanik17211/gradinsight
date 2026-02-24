-- Migration: Create profession forecasts and salary tables
-- This migration adds tables for storing profession demand forecasts and salary data

-- Table: profession_forecasts
-- Stores forecasts about profession demand from various sources
CREATE TABLE IF NOT EXISTS public.profession_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profession_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('worker', 'employee', 'specialist')),
  demand_level TEXT NOT NULL CHECK (demand_level IN ('high', 'medium', 'low')),
  forecast_year INTEGER NOT NULL,
  source TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  related_specialties JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profession_name, forecast_year)
);

-- Table: profession_salaries
-- Stores salary statistics for professions
CREATE TABLE IF NOT EXISTS public.profession_salaries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profession_name TEXT NOT NULL,
  search_query TEXT,
  avg_salary INTEGER,
  min_salary INTEGER,
  max_salary INTEGER,
  vacancies_count INTEGER,
  city TEXT NOT NULL DEFAULT 'Минск',
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'rabota.by',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(profession_name, city, year, month)
);

-- Enable RLS on new tables
ALTER TABLE public.profession_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profession_salaries ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read access" ON public.profession_forecasts FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.profession_salaries FOR SELECT USING (true);

-- Admin write access policies
CREATE POLICY "Admin write access" ON public.profession_forecasts 
  FOR ALL 
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

CREATE POLICY "Admin write access" ON public.profession_salaries 
  FOR ALL 
  USING (auth.role() = 'admin')
  WITH CHECK (auth.role() = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profession_forecasts_year ON public.profession_forecasts(forecast_year);
CREATE INDEX IF NOT EXISTS idx_profession_forecasts_demand ON public.profession_forecasts(demand_level);
CREATE INDEX IF NOT EXISTS idx_profession_forecasts_category ON public.profession_forecasts(category);
CREATE INDEX IF NOT EXISTS idx_profession_forecasts_city ON public.profession_forecasts(city);

CREATE INDEX IF NOT EXISTS idx_profession_salaries_year_month ON public.profession_salaries(year, month);
CREATE INDEX IF NOT EXISTS idx_profession_salaries_city ON public.profession_salaries(city);
CREATE INDEX IF NOT EXISTS idx_profession_salaries_profession ON public.profession_salaries(profession_name);

-- Update timestamp trigger for new tables
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER IF NOT EXISTS update_profession_forecasts_updated_at 
  BEFORE UPDATE ON public.profession_forecasts 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_profession_salaries_updated_at 
  BEFORE UPDATE ON public.profession_salaries 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

-- View: Combined profession data with forecasts and salaries
CREATE OR REPLACE VIEW public.profession_analytics AS
SELECT 
  pf.id,
  pf.profession_name,
  pf.category,
  pf.demand_level,
  pf.forecast_year,
  pf.source as forecast_source,
  pf.city as forecast_city,
  pf.description,
  pf.related_specialties,
  ps.avg_salary,
  ps.min_salary,
  ps.max_salary,
  ps.vacancies_count,
  ps.year as salary_year,
  ps.month as salary_month,
  ps.source as salary_source,
  CASE 
    WHEN pf.demand_level = 'high' AND (ps.avg_salary > 3000 OR ps.vacancies_count > 500) THEN 'excellent'
    WHEN pf.demand_level = 'high' OR ps.avg_salary > 2500 THEN 'good'
    WHEN pf.demand_level = 'medium' THEN 'average'
    ELSE 'below_average'
  END as overall_rating
FROM public.profession_forecasts pf
LEFT JOIN public.profession_salaries ps 
  ON pf.profession_name = ps.profession_name 
  AND ps.year = pf.forecast_year
WHERE pf.forecast_year >= 2026;

-- Comment on tables
COMMENT ON TABLE public.profession_forecasts IS 'Forecasts of profession demand from official sources';
COMMENT ON TABLE public.profession_salaries IS 'Salary statistics for professions from job sites';
COMMENT ON VIEW public.profession_analytics IS 'Combined view of profession forecasts and salary data';
