-- Create missing tables for labor market data
-- Run this FIRST before inserting data

-- =====================================================
-- TABLE: career_paths
-- =====================================================
CREATE TABLE IF NOT EXISTS career_paths (
  id TEXT PRIMARY KEY,
  specialty_category TEXT NOT NULL,
  level_name TEXT NOT NULL,
  level_order INTEGER NOT NULL,
  years_experience TEXT,
  typical_salary_min NUMERIC,
  typical_salary_max NUMERIC,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: salary_stats
-- =====================================================
CREATE TABLE IF NOT EXISTS salary_stats (
  id TEXT PRIMARY KEY,
  specialty_name TEXT,
  category TEXT NOT NULL,
  city TEXT,
  year INTEGER NOT NULL,
  month INTEGER,
  avg_salary NUMERIC,
  min_salary NUMERIC,
  max_salary NUMERIC,
  demand_level TEXT,
  career_growth_potential TEXT,
  vacancies_count INTEGER,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- TABLE: vacancies
-- =====================================================
CREATE TABLE IF NOT EXISTS vacancies (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT,
  company TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_currency TEXT,
  experience_required TEXT,
  employment_type TEXT,
  description TEXT,
  source_url TEXT,
  parsed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- Disable RLS for all tables
-- =====================================================
ALTER TABLE career_paths DISABLE ROW LEVEL SECURITY;
ALTER TABLE salary_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies DISABLE ROW LEVEL SECURITY;

-- Verify tables created
SELECT 'Tables created:' as status;
SELECT COUNT(*) as career_paths FROM career_paths;
SELECT COUNT(*) as salary_stats FROM salary_stats;
SELECT COUNT(*) as vacancies FROM vacancies;
