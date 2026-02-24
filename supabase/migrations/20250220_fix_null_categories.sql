-- ============================================
-- QUICK FIX: Handle NULL categories and recategorize
-- ============================================

-- 1. First, set NULL/empty to 'Другое'
UPDATE vacancies 
SET category = 'Другое'
WHERE category IS NULL OR category = '';

-- 2. Show current state
SELECT 
  category,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vacancies), 1) as percent
FROM vacancies
GROUP BY category
ORDER BY count DESC;

-- 3. Total count
SELECT COUNT(*) as total_vacancies FROM vacancies;
