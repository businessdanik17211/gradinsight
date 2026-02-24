-- ============================================
-- FINAL SETUP: Enhanced Rabota.by Parser
-- ============================================
-- Run this SQL in Supabase to complete setup

-- 1. Create parsing_sessions table for progress tracking
CREATE TABLE IF NOT EXISTS parsing_sessions (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'running',
  total_pages INTEGER DEFAULT 0,
  current_page INTEGER DEFAULT 0,
  total_found INTEGER DEFAULT 0,
  new_vacancies INTEGER DEFAULT 0,
  duplicates_skipped INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create career_paths table
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

-- 3. Create salary_stats table
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

-- 4. Create vacancies table (if not exists)
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

-- 5. Disable RLS for all tables
ALTER TABLE parsing_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE career_paths DISABLE ROW LEVEL SECURITY;
ALTER TABLE salary_stats DISABLE ROW LEVEL SECURITY;
ALTER TABLE vacancies DISABLE ROW LEVEL SECURITY;

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_parsing_sessions_status ON parsing_sessions(status);
CREATE INDEX IF NOT EXISTS idx_parsing_sessions_started_at ON parsing_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_vacancies_parsed_at ON vacancies(parsed_at DESC);
CREATE INDEX IF NOT EXISTS idx_vacancies_category ON vacancies(category);
CREATE INDEX IF NOT EXISTS idx_salary_stats_category ON salary_stats(category);
CREATE INDEX IF NOT EXISTS idx_salary_stats_year ON salary_stats(year);

-- 7. Verify all tables created
SELECT 
  'parsing_sessions' as table_name, COUNT(*) as row_count FROM parsing_sessions
UNION ALL
SELECT 'career_paths', COUNT(*) FROM career_paths
UNION ALL
SELECT 'salary_stats', COUNT(*) FROM salary_stats
UNION ALL
SELECT 'vacancies', COUNT(*) FROM vacancies;

-- ============================================
-- WHAT'S NEW:
-- ============================================
-- 
-- 1. PAGINATION: Parser now goes through ALL pages (up to 100)
-- 2. DEDUPLICATION: Checks URL + (title+company+city) before saving
-- 3. PROGRESS TRACKING: Real-time progress bar in Admin UI
-- 4. RATE LIMITING: 3 second delay between requests + random jitter
-- 5. USER-AGENT ROTATION: 3 different browser agents
-- 6. BATCH INSERTS: Saves 50 records at a time for performance
-- 7. ERROR HANDLING: Continues on errors, logs issues
-- 8. ETA CALCULATION: Shows estimated time remaining
--
-- ============================================
-- NEXT STEPS:
-- ============================================
--
-- 1. Deploy Edge Function: supabase/functions/parse-rabota/index.ts
-- 2. Run Admin page: npm run dev
-- 3. Select category and click "Запустить парсинг"
-- 4. Watch progress in real-time!
--
-- ============================================

SELECT 'Setup complete! Parser is ready to use.' as status;
