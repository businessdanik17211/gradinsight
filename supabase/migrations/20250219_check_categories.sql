-- ============================================
-- Check current categories and fix display issue
-- ============================================

-- 1. Show all categories with counts
SELECT 
  category,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vacancies), 1) as percent
FROM vacancies
WHERE category IS NOT NULL AND category != ''
GROUP BY category
ORDER BY count DESC;

-- 2. Check if Инженерия exists
SELECT 
  'Инженерия exists?' as check_title,
  COUNT(*) as count
FROM vacancies
WHERE category = 'Инженерия';

-- 3. Show Инженерия vacancies
SELECT title, company, city, category
FROM vacancies
WHERE category = 'Инженерия'
LIMIT 10;

-- 4. Check total counts
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN category = 'ИТ' THEN 1 END) as it_count,
  COUNT(CASE WHEN category = 'Медицина' THEN 1 END) as med_count,
  COUNT(CASE WHEN category = 'Инженерия' THEN 1 END) as eng_count,
  COUNT(CASE WHEN category = 'Экономика' THEN 1 END) as econ_count,
  COUNT(CASE WHEN category = 'Педагогика' THEN 1 END) as ped_count,
  COUNT(CASE WHEN category = 'Право' THEN 1 END) as law_count,
  COUNT(CASE WHEN category = 'Другое' THEN 1 END) as other_count,
  COUNT(CASE WHEN category IS NULL OR category = '' THEN 1 END) as null_count
FROM vacancies;

-- 5. Show top 10 categories for chart
SELECT 
  category,
  COUNT(*) as count
FROM vacancies
WHERE category IS NOT NULL AND category != ''
GROUP BY category
ORDER BY count DESC
LIMIT 10;
