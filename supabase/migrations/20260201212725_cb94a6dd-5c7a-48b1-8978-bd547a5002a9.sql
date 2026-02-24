-- Universities table
CREATE TABLE public.universities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Faculties table
CREATE TABLE public.faculties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Specialties table
CREATE TABLE public.specialties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  degree_type TEXT NOT NULL DEFAULT 'bachelor',
  duration_years INTEGER NOT NULL DEFAULT 4,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Admission statistics table
CREATE TABLE public.admission_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  budget_places INTEGER,
  paid_places INTEGER,
  applications_count INTEGER,
  enrolled_count INTEGER,
  min_score DECIMAL(5,2),
  avg_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Job vacancies table (parsed from rabota.by)
CREATE TABLE public.vacancies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT,
  city TEXT,
  category TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'BYN',
  experience_required TEXT,
  employment_type TEXT,
  description TEXT,
  source_url TEXT,
  parsed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Salary statistics by specialty
CREATE TABLE public.salary_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  specialty_name TEXT,
  city TEXT,
  avg_salary INTEGER NOT NULL,
  min_salary INTEGER,
  max_salary INTEGER,
  vacancies_count INTEGER,
  demand_level TEXT DEFAULT 'medium',
  career_growth_potential TEXT DEFAULT 'medium',
  year INTEGER NOT NULL,
  month INTEGER,
  source TEXT DEFAULT 'rabota.by',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Career paths table
CREATE TABLE public.career_paths (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  specialty_category TEXT NOT NULL,
  level_name TEXT NOT NULL,
  level_order INTEGER NOT NULL,
  typical_salary_min INTEGER,
  typical_salary_max INTEGER,
  years_experience TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admission_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_paths ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (educational reference data)
CREATE POLICY "Public read access" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.specialties FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.admission_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.vacancies FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.salary_stats FOR SELECT USING (true);
CREATE POLICY "Public read access" ON public.career_paths FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX idx_faculties_university ON public.faculties(university_id);
CREATE INDEX idx_specialties_faculty ON public.specialties(faculty_id);
CREATE INDEX idx_admission_stats_specialty ON public.admission_stats(specialty_id);
CREATE INDEX idx_admission_stats_year ON public.admission_stats(year);
CREATE INDEX idx_vacancies_category ON public.vacancies(category);
CREATE INDEX idx_vacancies_city ON public.vacancies(city);
CREATE INDEX idx_salary_stats_category ON public.salary_stats(category);
CREATE INDEX idx_salary_stats_year ON public.salary_stats(year);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON public.universities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON public.faculties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_specialties_updated_at BEFORE UPDATE ON public.specialties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();