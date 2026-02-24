-- ============================================
-- DEBUG: Check current state before any changes
-- ============================================

-- 1. Show current distribution
SELECT 
  category,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vacancies), 1) as percent
FROM vacancies
GROUP BY category
ORDER BY count DESC;

-- 2. Show sample titles from "Другое" to understand what we're missing
SELECT DISTINCT title, category
FROM vacancies
WHERE category = 'Другое' OR category IS NULL OR category = ''
ORDER BY title
LIMIT 30;

-- 3. Count how many should be ИНЖЕНЕРИЯ based on keywords
SELECT 
  'ИНЖЕНЕРИЯ (should be)' as category_check,
  COUNT(*) as count
FROM vacancies
WHERE (
  title ILIKE '%инженер%' 
  OR title ILIKE '%engineer%'
  OR title ILIKE '%конструктор%'
  OR title ILIKE '%технолог%'
  OR title ILIKE '%механик%'
  OR title ILIKE '%сварщик%'
  OR title ILIKE '%электрик%'
  OR title ILIKE '%строитель%'
  OR title ILIKE '%архитектор%'
  OR title ILIKE '%прораб%'
  OR title ILIKE '%сантехник%'
  OR title ILIKE '%слесарь%'
  OR title ILIKE '%токарь%'
  OR title ILIKE '%фрезеровщик%'
  OR title ILIKE '%маляр%'
  OR title ILIKE '%штукатур%'
  OR title ILIKE '%плиточник%'
  OR title ILIKE '%монтажник%'
  OR title ILIKE '%электромонтер%'
  OR title ILIKE '%сборщик%'
  OR title ILIKE '%крановщик%'
  OR title ILIKE '%машинист%'
  OR title ILIKE '%оператор%станок%'
  OR title ILIKE '%чпу%'
  OR title ILIKE '%cnc%'
  OR title ILIKE '%наладчик%'
  OR title ILIKE '%комплектовщик%'
  OR title ILIKE '%грузчик%'
  OR title ILIKE '%кладовщик%'
);

-- 4. Count how many should be IT
SELECT 
  'ИТ (should be)' as category_check,
  COUNT(*) as count
FROM vacancies
WHERE (
  title ILIKE '%программист%'
  OR title ILIKE '%разработчик%'
  OR title ILIKE '%developer%'
  OR title ILIKE '%frontend%'
  OR title ILIKE '%backend%'
  OR title ILIKE '%fullstack%'
  OR title ILIKE '%devops%'
  OR title ILIKE '%qa%'
  OR title ILIKE '%тестировщик%'
  OR title ILIKE '%javascript%'
  OR title ILIKE '%java%'
  OR title ILIKE '%python%'
  OR title ILIKE '%php%'
  OR title ILIKE '%1с%'
  OR title ILIKE '%1c%'
  OR title ILIKE '%web%'
  OR title ILIKE '%веб%'
  OR title ILIKE '%mobile%'
  OR title ILIKE '%мобильн%'
  OR title ILIKE '%react%'
  OR title ILIKE '%angular%'
  OR title ILIKE '%vue%'
  OR title ILIKE '%node%'
  OR title ILIKE '%sql%'
  OR title ILIKE '%it %'
  OR title ILIKE '%системный администратор%'
  OR title ILIKE '%сисадмин%'
  OR title ILIKE '%data scientist%'
  OR title ILIKE '%android%'
  OR title ILIKE '%ios%'
);

-- 5. Check if there's a NOT NULL constraint issue
SELECT 
  column_name,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'vacancies' AND column_name = 'category';

-- 6. Show some specific examples that should be ИНЖЕНЕРИЯ
SELECT title, category
FROM vacancies
WHERE title ILIKE '%инженер%'
LIMIT 10;

-- 7. Check total
SELECT COUNT(*) as total FROM vacancies;
SELECT COUNT(*) as with_category FROM vacancies WHERE category IS NOT NULL AND category != '' AND category != 'Другое';
SELECT COUNT(*) as without_proper_category FROM vacancies WHERE category IS NULL OR category = '' OR category = 'Другое';
