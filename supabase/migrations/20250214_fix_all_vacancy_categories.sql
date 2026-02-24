-- ============================================
-- Check and fix vacancy categories distribution
-- ============================================

-- 1. Check current distribution
SELECT 
  CASE 
    WHEN category IS NULL OR category = '' OR category = 'ИТ' THEN COALESCE(NULLIF(category, ''), 'NULL/Empty')
    ELSE category 
  END as category,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vacancies), 2) as percentage
FROM vacancies
GROUP BY category
ORDER BY count DESC;

-- 2. Check how many have NULL/empty/IT category
SELECT 
  'ИТ' as category_check,
  COUNT(*) as count
FROM vacancies 
WHERE category = 'ИТ' OR category IS NULL OR category = ''

UNION ALL

SELECT 
  'Медицина' as category_check,
  COUNT(*) as count
FROM vacancies 
WHERE category = 'Медицина'

UNION ALL

SELECT 
  'Все остальные' as category_check,
  COUNT(*) as count
FROM vacancies 
WHERE category NOT IN ('ИТ', 'Медицина') AND category IS NOT NULL AND category != '';

-- 3. Sample of vacancies without category
SELECT title, category, company, city
FROM vacancies
WHERE category IS NULL OR category = ''
LIMIT 20;

-- 4. Update all remaining NULL/empty to proper categories based on keywords
UPDATE vacancies
SET category = 
  CASE
    -- IT keywords
    WHEN LOWER(title) ~ '(программист|разработчик|developer|it |инженер-программист|frontend|backend|fullstack|devops|qa|тестировщик|javascript|python|java|c\+\+|php|ruby|golang|go |swift|kotlin|react|vue|angular|node|sql|база данных|системн.*администратор|sysadmin|сетев|network|data|данных|ml |machine|ai |искусственн.*интеллект|1с|1c|битрикс|bitrix|веб-разработ|web|мобильн.*приложен|mobile|игр.*разработ|game)'
    THEN 'ИТ'
    
    -- Medicine keywords
    WHEN LOWER(title) ~ '(врач|доктор|медицинск|medic|фельдшер|медсестр|медбрат|стоматолог|dentist|хирург|surgeon|терапевт|терапия|педиатр|педиатрия|кардиолог|кардиология|офтальмолог|окулист|невролог|невралог|психиатр|психолог|фармацевт|провизор|лаборант|лаборатория|акушер|гинеколог|онколог|рентгенолог|ультразвук|узи|массажист|массаж|реабилитолог|реабилитац|диетолог|диет|вирусолог|инфекционист)'
    THEN 'Медицина'
    
    -- Engineering keywords  
    WHEN LOWER(title) ~ '(инженер|engineer|конструктор|проектировщик|технолог|технология|механик|механика|электрик|электроник|автомеханик|автоэлектрик|сварщик|сварка|токарь|фрезеровщик|слесарь|машинист|оператор.*станок|чпу|энергетик|энергетика|строитель|строительство|прораб|мастер.*участок|архитектор|архитектур|геодезист|геодезия|землеустроитель|кадастр|горный|шахт|нефт|газ|химик|химия|эколог|экологи)'
    THEN 'Инженерия'
    
    -- Education keywords
    WHEN LOWER(title) ~ '(учитель|преподавател|педагог|педагогика|воспитатель|детск.*сад|школ|лицей|гимнази|университе|академи|колледж|методист|методика|репетитор|репетиторств|тьютор|обучени|образовани|образовательн|директор.*школ|завуч|заведующ.*кафедр|декан|аспирант|докторант)'
    THEN 'Педагогика'
    
    -- Economics keywords
    WHEN LOWER(title) ~ '(бухгалтер|бухгалтерия|экономист|экономика|финансист|финансы|аудитор|аудит|кредит|кредитован|банк|банковск|инвестиц|инвестор|аналитик|анализ|маркетолог|маркетинг|менеджер.*продаж|продавец|кассир|касс|товаровед|товароведени|логист|логистика|склад|снабженец|закупк|закупщик|hr|кадровик|рекрутер|подбор.*персонал|офис-менеджер|администратор.*офис|секретарь|делопроизводитель|оператор.*пк|оператор.*компьютер|деловое.*общение|специалист.*документообороту)'
    THEN 'Экономика'
    
    -- Law keywords
    WHEN LOWER(title) ~ '(юрист|юридическ|адвокат|нотариус|судья|судопроизводств|прокурор|следователь|правовед|правов|договор|договорн|контракт|контрактн|корпоративн.*юрист|корпоративн.*прав|налогов.*юрист|налогов.*консультант|миграционн.*специалист|иммиграц|визов.*специалист|визов.*менеджер|регистрац|лицензирован|сертифик|сертификац|аккредитац|экспертиз|эксперт|оценщик|оценк.*имуществ|оценк.*недвижимости)'
    THEN 'Право'
    
    -- Default - check if it contains common words
    ELSE 
      CASE 
        WHEN LOWER(title) ~ '(manager|менеджер|специалист|specialist|консультант|consultant|директор|director|руководитель|начальник)'
        THEN 'Экономика'
        ELSE 'ИТ'
      END
  END
WHERE category IS NULL OR category = '' OR category = 'ИТ';

-- 5. Final check after update
SELECT 
  category,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM vacancies), 2) as percentage
FROM vacancies
GROUP BY category
ORDER BY count DESC;

-- 6. Check if all vacancies now have categories
SELECT 
  CASE 
    WHEN category IS NULL OR category = '' THEN 'Без категории'
    ELSE 'С категорией'
  END as status,
  COUNT(*) as count
FROM vacancies
GROUP BY status;
