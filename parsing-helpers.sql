-- =====================================================
-- AUTOMATIC PARSING QUERIES FOR ADMIN
-- =====================================================

-- Query 1: Get all categories for parsing
SELECT DISTINCT category, COUNT(*) as vacancy_count 
FROM salary_stats 
GROUP BY category 
ORDER BY vacancy_count DESC;

-- Query 2: Get cities with job data
SELECT DISTINCT city, COUNT(*) as vacancy_count 
FROM salary_stats 
WHERE city IS NOT NULL 
GROUP BY city 
ORDER BY vacancy_count DESC;

-- Query 3: Get demand levels distribution
SELECT demand_level, COUNT(*) as count 
FROM salary_stats 
WHERE demand_level IS NOT NULL 
GROUP BY demand_level;

-- Query 4: Get career growth potential distribution
SELECT career_growth_potential, COUNT(*) as count 
FROM salary_stats 
WHERE career_growth_potential IS NOT NULL 
GROUP BY career_growth_potential;

-- Query 5: Salary ranges by category (for parsing targets)
SELECT 
  category,
  AVG(avg_salary) as avg_salary,
  MIN(min_salary) as min_salary,
  MAX(max_salary) as max_salary,
  AVG(vacancies_count) as avg_vacancies
FROM salary_stats 
WHERE year = 2025 
GROUP BY category 
ORDER BY avg_salary DESC;

-- =====================================================
-- ADMIN PARSING HELPERS
-- =====================================================

-- Enable table for parsing results
CREATE TABLE IF NOT EXISTS parsing_log (
  id SERIAL PRIMARY KEY,
  source VARCHAR(100),
  category VARCHAR(100),
  records_parsed INTEGER,
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Template for inserting parsed salary data
INSERT INTO salary_stats (
  id, specialty_name, category, city, year, month,
  avg_salary, min_salary, max_salary,
  demand_level, career_growth_potential,
  vacancies_count, source, created_at
) VALUES (
  'ss-' || LOWER(REPLACE(category, ' ', '-')) || '-' || LOWER(REPLACE(specialty_name, ' ', '-')) || '-' || NOW()::TEXT,
  :specialty_name, :category, :city, 2025, 1,
  :avg_salary, :min_salary, :max_salary,
  :demand_level, :career_growth_potential,
  :vacancies_count, :source, NOW()
);

-- Check current data coverage
SELECT 
  'Universities' as data_type, COUNT(*) as count FROM universities
UNION ALL
SELECT 'Faculties', COUNT(*) FROM faculties
UNION ALL
SELECT 'Institutes', COUNT(*) FROM institutes
UNION ALL
SELECT 'Specialties', COUNT(*) FROM specialties
UNION ALL
SELECT 'Salary Stats', COUNT(*) FROM salary_stats
UNION ALL
SELECT 'Career Paths', COUNT(*) FROM career_paths
UNION ALL
SELECT 'Vacancies', COUNT(*) FROM vacancies;
