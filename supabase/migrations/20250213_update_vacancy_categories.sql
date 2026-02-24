-- ============================================
-- Update vacancies without category based on keywords
-- ============================================

-- First, check how many vacancies have NULL category
SELECT 
  CASE 
    WHEN category IS NULL OR category = '' THEN 'NULL/Empty'
    ELSE 'Has Category'
  END as category_status,
  COUNT(*) as count
FROM vacancies
GROUP BY category_status;

-- Create a mapping of keywords to categories
UPDATE vacancies
SET 
  category = 
    CASE
      -- IT and Programming
      WHEN LOWER(title) LIKE '%программист%' OR LOWER(title) LIKE '%developer%' OR LOWER(title) LIKE '%developer%' 
           OR LOWER(title) LIKE '%it%' OR LOWER(title) LIKE '%инженер-программист%' 
           OR LOWER(title) LIKE '%frontend%' OR LOWER(title) LIKE '%backend%' 
           OR LOWER(title) LIKE '%fullstack%' OR LOWER(title) LIKE '%devops%'
           OR LOWER(title) LIKE '%qa%' OR LOWER(title) LIKE '%тестировщик%'
           OR LOWER(title) LIKE '%javascript%' OR LOWER(title) LIKE '%python%' 
           OR LOWER(title) LIKE '%java%' OR LOWER(title) LIKE '%c++%'
           OR LOWER(title) LIKE '%php%' OR LOWER(title) LIKE '%ruby%'
           OR LOWER(title) LIKE '%golang%' OR LOWER(title) LIKE '%go %'
           OR LOWER(title) LIKE '%swift%' OR LOWER(title) LIKE '%kotlin%'
           OR LOWER(title) LIKE '%react%' OR LOWER(title) LIKE '%vue%'
           OR LOWER(title) LIKE '%angular%' OR LOWER(title) LIKE '%node%'
           OR LOWER(title) LIKE '%sql%' OR LOWER(title) LIKE '%база данных%'
           OR LOWER(title) LIKE '%системн% администратор%' OR LOWER(title) LIKE '%sysadmin%'
           OR LOWER(title) LIKE '%сетев%' OR LOWER(title) LIKE '%network%'
           OR LOWER(title) LIKE '%data%' OR LOWER(title) LIKE '%данных%'
           OR LOWER(title) LIKE '%ml%' OR LOWER(title) LIKE '%machine%'
           OR LOWER(title) LIKE '%ai%' OR LOWER(title) LIKE '%искусственн% интеллект%'
           OR LOWER(title) LIKE '%1с%' OR LOWER(title) LIKE '%1c%'
           OR LOWER(title) LIKE '%битрикс%' OR LOWER(title) LIKE '%bitrix%'
           OR LOWER(title) LIKE '%веб-разработ%' OR LOWER(title) LIKE '%web%'
           OR LOWER(title) LIKE '%мобильн% приложен%' OR LOWER(title) LIKE '%mobile%'
           OR LOWER(title) LIKE '%игр% разработ%' OR LOWER(title) LIKE '%game%'
      THEN 'ИТ'
      
      -- Medicine and Healthcare
      WHEN LOWER(title) LIKE '%врач%' OR LOWER(title) LIKE '%доктор%'
           OR LOWER(title) LIKE '%медицинск%' OR LOWER(title) LIKE '%medic%'
           OR LOWER(title) LIKE '%фельдшер%' OR LOWER(title) LIKE '%медсестр%' OR LOWER(title) LIKE '%медбрат%'
           OR LOWER(title) LIKE '%стоматолог%' OR LOWER(title) LIKE '%dentist%'
           OR LOWER(title) LIKE '%хирург%' OR LOWER(title) LIKE '%surgeon%'
           OR LOWER(title) LIKE '%терапевт%' OR LOWER(title) LIKE '%терапия%'
           OR LOWER(title) LIKE '%педиатр%' OR LOWER(title) LIKE '%педиатрия%'
           OR LOWER(title) LIKE '%кардиолог%' OR LOWER(title) LIKE '%кардиология%'
           OR LOWER(title) LIKE '%офтальмолог%' OR LOWER(title) LIKE '%окулист%'
           OR LOWER(title) LIKE '%невролог%' OR LOWER(title) LIKE '%невралог%'
           OR LOWER(title) LIKE '%психиатр%' OR LOWER(title) LIKE '%психолог%'
           OR LOWER(title) LIKE '%фармацевт%' OR LOWER(title) LIKE '%провизор%'
           OR LOWER(title) LIKE '%лаборант%' OR LOWER(title) LIKE '%лаборатория%'
           OR LOWER(title) LIKE '%акушер%' OR LOWER(title) LIKE '%гинеколог%'
           OR LOWER(title) LIKE '%онколог%' OR LOWER(title) LIKE '%рентгенолог%'
           OR LOWER(title) LIKE '%ультразвук%' OR LOWER(title) LIKE '%узи%'
           OR LOWER(title) LIKE '%массажист%' OR LOWER(title) LIKE '%массаж%'
           OR LOWER(title) LIKE '%реабилитолог%' OR LOWER(title) LIKE '%реабилитац%'
           OR LOWER(title) LIKE '%диетолог%' OR LOWER(title) LIKE '%диет%'
           OR LOWER(title) LIKE '%вирусолог%' OR LOWER(title) LIKE '%инфекционист%'
      THEN 'Медицина'
      
      -- Engineering
      WHEN LOWER(title) LIKE '%инженер%' OR LOWER(title) LIKE '%engineer%'
           OR LOWER(title) LIKE '%конструктор%' OR LOWER(title) LIKE '%проектировщик%'
           OR LOWER(title) LIKE '%технолог%' OR LOWER(title) LIKE '%технология%'
           OR LOWER(title) LIKE '%механик%' OR LOWER(title) LIKE '%механика%'
           OR LOWER(title) LIKE '%электрик%' OR LOWER(title) LIKE '%электроник%'
           OR LOWER(title) LIKE '%автомеханик%' OR LOWER(title) LIKE '%автоэлектрик%'
           OR LOWER(title) LIKE '%сварщик%' OR LOWER(title) LIKE '%сварка%'
           OR LOWER(title) LIKE '%токарь%' OR LOWER(title) LIKE '%фрезеровщик%'
           OR LOWER(title) LIKE '%слесарь%' OR LOWER(title) LIKE '%машинист%'
           OR LOWER(title) LIKE '%оператор станок%' OR LOWER(title) LIKE '%чпу%'
           OR LOWER(title) LIKE '%энергетик%' OR LOWER(title) LIKE '%энергетика%'
           OR LOWER(title) LIKE '%строитель%' OR LOWER(title) LIKE '%строительство%'
           OR LOWER(title) LIKE '%прораб%' OR LOWER(title) LIKE '%мастер участка%'
           OR LOWER(title) LIKE '%архитектор%' OR LOWER(title) LIKE '%архитектур%'
           OR LOWER(title) LIKE '%геодезист%' OR LOWER(title) LIKE '%геодезия%'
           OR LOWER(title) LIKE '%землеустроитель%' OR LOWER(title) LIKE '%кадастр%'
           OR LOWER(title) LIKE '%горный%' OR LOWER(title) LIKE '%шахт%'
           OR LOWER(title) LIKE '%нефт%' OR LOWER(title) LIKE '%газ%'
           OR LOWER(title) LIKE '%химик%' OR LOWER(title) LIKE '%химия%'
           OR LOWER(title) LIKE '%эколог%' OR LOWER(title) LIKE '%экологи%'
      THEN 'Инженерия'
      
      -- Education
      WHEN LOWER(title) LIKE '%учитель%' OR LOWER(title) LIKE '%преподавател%'
           OR LOWER(title) LIKE '%педагог%' OR LOWER(title) LIKE '%педагогика%'
           OR LOWER(title) LIKE '%воспитатель%' OR LOWER(title) LIKE '%детск% сад%'
           OR LOWER(title) LIKE '%школ%' OR LOWER(title) LIKE '%лицей%'
           OR LOWER(title) LIKE '%гимнази%' OR LOWER(title) LIKE '%университе%'
           OR LOWER(title) LIKE '%академи%' OR LOWER(title) LIKE '%колледж%'
           OR LOWER(title) LIKE '%методист%' OR LOWER(title) LIKE '%методика%'
           OR LOWER(title) LIKE '%репетитор%' OR LOWER(title) LIKE '%репетиторств%'
           OR LOWER(title) LIKE '%тьютор%' OR LOWER(title) LIKE '%обучени%'
           OR LOWER(title) LIKE '%образовани%' OR LOWER(title) LIKE '%образовательн%'
           OR LOWER(title) LIKE '%директор школ%' OR LOWER(title) LIKE '%завуч%'
           OR LOWER(title) LIKE '%заведующ% кафедр%' OR LOWER(title) LIKE '%декан%'
           OR LOWER(title) LIKE '%аспирант%' OR LOWER(title) LIKE '%докторант%'
      THEN 'Педагогика'
      
      -- Economics and Finance
      WHEN LOWER(title) LIKE '%бухгалтер%' OR LOWER(title) LIKE '%бухгалтерия%'
           OR LOWER(title) LIKE '%экономист%' OR LOWER(title) LIKE '%экономика%'
           OR LOWER(title) LIKE '%финансист%' OR LOWER(title) LIKE '%финансы%'
           OR LOWER(title) LIKE '%аудитор%' OR LOWER(title) LIKE '%аудит%'
           OR LOWER(title) LIKE '%кредит%' OR LOWER(title) LIKE '%кредитован%'
           OR LOWER(title) LIKE '%банк%' OR LOWER(title) LIKE '%банковск%'
           OR LOWER(title) LIKE '%инвестиц%' OR LOWER(title) LIKE '%инвестор%'
           OR LOWER(title) LIKE '%аналитик%' OR LOWER(title) LIKE '%анализ%'
           OR LOWER(title) LIKE '%маркетолог%' OR LOWER(title) LIKE '%маркетинг%'
           OR LOWER(title) LIKE '%менеджер по продаж%' OR LOWER(title) LIKE '%продавец%'
           OR LOWER(title) LIKE '%кассир%' OR LOWER(title) LIKE '%касс%'
           OR LOWER(title) LIKE '%товаровед%' OR LOWER(title) LIKE '%товароведени%'
           OR LOWER(title) LIKE '%логист%' OR LOWER(title) LIKE '%логистика%'
           OR LOWER(title) LIKE '%склад%' OR LOWER(title) LIKE '%снабженец%'
           OR LOWER(title) LIKE '%закупк%' OR LOWER(title) LIKE '%закупщик%'
           OR LOWER(title) LIKE '%HR%' OR LOWER(title) LIKE '%кадровик%'
           OR LOWER(title) LIKE '%рекрутер%' OR LOWER(title) LIKE '%подбор персонал%'
           OR LOWER(title) LIKE '%офис-менеджер%' OR LOWER(title) LIKE '%администратор офис%'
           OR LOWER(title) LIKE '%секретарь%' OR LOWER(title) LIKE '%делопроизводитель%'
           OR LOWER(title) LIKE '%оператор пк%' OR LOWER(title) LIKE '%оператор компьютер%'
           OR LOWER(title) LIKE '%деловое общение%' OR LOWER(title) LIKE '%специалист по документообороту%'
      THEN 'Экономика'
      
      -- Law
      WHEN LOWER(title) LIKE '%юрист%' OR LOWER(title) LIKE '%юридическ%'
           OR LOWER(title) LIKE '%адвокат%' OR LOWER(title) LIKE '%нотариус%'
           OR LOWER(title) LIKE '%судья%' OR LOWER(title) LIKE '%судопроизводств%'
           OR LOWER(title) LIKE '%прокурор%' OR LOWER(title) LIKE '%следователь%'
           OR LOWER(title) LIKE '%правовед%' OR LOWER(title) LIKE '%правов%'
           OR LOWER(title) LIKE '%договор%' OR LOWER(title) LIKE '%договорн%'
           OR LOWER(title) LIKE '%контракт%' OR LOWER(title) LIKE '%контрактн%'
           OR LOWER(title) LIKE '%корпоративн% юрист%' OR LOWER(title) LIKE '%корпоративн% прав%'
           OR LOWER(title) LIKE '%налогов% юрист%' OR LOWER(title) LIKE '%налогов% консультант%'
           OR LOWER(title) LIKE '%миграционн% специалист%' OR LOWER(title) LIKE '%иммиграц%'
           OR LOWER(title) LIKE '%визов% специалист%' OR LOWER(title) LIKE '%визов% менеджер%'
           OR LOWER(title) LIKE '%регистрац%' OR LOWER(title) LIKE '%лицензирован%'
           OR LOWER(title) LIKE '%сертифик%' OR LOWER(title) LIKE '%сертификац%'
           OR LOWER(title) LIKE '%аккредитац%' OR LOWER(title) LIKE '%экспертиз%'
           OR LOWER(title) LIKE '%эксперт%' OR LOWER(title) LIKE '%оценщик%'
           OR LOWER(title) LIKE '%оценк% имуществ%' OR LOWER(title) LIKE '%оценк% недвижимости%'
      THEN 'Право'
      
      ELSE 'ИТ' -- Default to IT as most in-demand
    END
WHERE category IS NULL OR category = '';

-- Check updated results
SELECT category, COUNT(*) as count
FROM vacancies
GROUP BY category
ORDER BY count DESC;

-- Show summary
SELECT 
  COUNT(*) as total_vacancies,
  COUNT(CASE WHEN category IS NOT NULL AND category != '' THEN 1 END) as with_category,
  COUNT(CASE WHEN category IS NULL OR category = '' THEN 1 END) as without_category
FROM vacancies;
