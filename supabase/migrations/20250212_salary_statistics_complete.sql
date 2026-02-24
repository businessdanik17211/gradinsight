-- ============================================
-- Comprehensive Salary Statistics by Industry and Region
-- Source: myfin.by, Beltalstat
-- ============================================

-- Drop existing table if needed
DROP TABLE IF EXISTS salary_statistics CASCADE;

-- Create comprehensive salary statistics table
CREATE TABLE salary_statistics (
  id SERIAL PRIMARY KEY,
  
  -- Time dimension
  year INTEGER NOT NULL,
  month INTEGER, -- NULL for annual average
  quarter INTEGER, -- NULL if monthly
  
  -- Geography
  region_type VARCHAR(20) NOT NULL, -- 'country', 'region', 'city'
  region_name VARCHAR(100) NOT NULL, -- 'Беларусь', 'Минск', 'Минская область', etc.
  
  -- Industry/Profession
  industry_code VARCHAR(20), -- ОКРБ code if available
  industry_name VARCHAR(200) NOT NULL, -- Название отрасли/вида деятельности
  industry_category VARCHAR(100), -- Broad category (IT, Medicine, Education, etc.)
  
  -- Salary data
  avg_salary DECIMAL(12, 2), -- Средняя заработная плата (BYN)
  median_salary DECIMAL(12, 2), -- Медианная заработная плата
  min_salary DECIMAL(12, 2), -- Минимальная
  max_salary DECIMAL(12, 2), -- Максимальная
  
  -- Additional metrics
  vacancies_count INTEGER, -- Количество вакансий в выборке
  employees_count INTEGER, -- Количество работников
  growth_rate DECIMAL(6, 2), -- Рост к предыдущему периоду (%)
  
  -- Source tracking
  source VARCHAR(200), -- Белстат, MyFin, etc.
  source_url VARCHAR(500), -- URL источника
  data_date DATE, -- Дата публикации данных
  notes TEXT, -- Дополнительные примечания
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Disable RLS for admin access
ALTER TABLE salary_statistics DISABLE ROW LEVEL SECURITY;

-- Create indexes for fast filtering
CREATE INDEX idx_salary_year ON salary_statistics(year);
CREATE INDEX idx_salary_region ON salary_statistics(region_name);
CREATE INDEX idx_salary_industry ON salary_statistics(industry_name);
CREATE INDEX idx_salary_industry_cat ON salary_statistics(industry_category);
CREATE INDEX idx_salary_composite ON salary_statistics(year, region_name, industry_name);

-- ============================================
-- INDUSTRY DATA (by occupation/specialty groups)
-- ============================================

INSERT INTO salary_statistics 
(year, month, region_type, region_name, industry_code, industry_name, industry_category, avg_salary, source, source_url, data_date) VALUES

-- IT & Technology (Информационные технологии)
(2024, NULL, 'country', 'Беларусь', '62', 'Информационные технологии', 'ИТ', 3500.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2024, NULL, 'city', 'Минск', '62', 'Информационные технологии', 'ИТ', 4200.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '62', 'Информационные технологии', 'ИТ', 2950.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '62', 'Информационные технологии', 'ИТ', 2450.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Finance & Banking (Финансовая деятельность)
(2024, NULL, 'country', 'Беларусь', '64', 'Финансовая деятельность', 'Финансы', 2800.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2024, NULL, 'city', 'Минск', '64', 'Финансовая деятельность', 'Финансы', 3400.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '64', 'Финансовая деятельность', 'Финансы', 2400.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '64', 'Финансовая деятельность', 'Финансы', 2100.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Education (Образование)
(2024, NULL, 'country', 'Беларусь', '85', 'Образование', 'Образование', 1450.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '85', 'Образование', 'Образование', 1280.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '85', 'Образование', 'Образование', 1100.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Healthcare (Здравоохранение)
(2024, NULL, 'country', 'Беларусь', '86', 'Здравоохранение', 'Медицина', 1650.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '86', 'Здравоохранение', 'Медицина', 1420.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '86', 'Здравоохранение', 'Медицина', 1200.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Manufacturing (Обрабатывающая промышленность)
(2024, NULL, 'country', 'Беларусь', '10-33', 'Обрабатывающая промышленность', 'Промышленность', 1750.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '10-33', 'Обрабатывающая промышленность', 'Промышленность', 1520.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '10-33', 'Обрабатывающая промышленность', 'Промышленность', 1280.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Public Administration (Государственное управление)
(2024, NULL, 'country', 'Беларусь', '84', 'Государственное управление', 'Госуправление', 1950.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '84', 'Государственное управление', 'Госуправление', 1720.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '84', 'Государственное управление', 'Госуправление', 1480.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Construction (Строительство)
(2024, NULL, 'country', 'Беларусь', '41-43', 'Строительство', 'Строительство', 1850.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '41-43', 'Строительство', 'Строительство', 1580.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '41-43', 'Строительство', 'Строительство', 1350.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Transportation & Logistics (Транспорт и логистика)
(2024, NULL, 'country', 'Беларусь', '49-53', 'Транспорт и складирование', 'Логистика', 1550.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '49-53', 'Транспорт и складирование', 'Логистика', 1350.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '49-53', 'Транспорт и складирование', 'Логистика', 1180.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Retail & Trade (Розничная торговля)
(2024, NULL, 'country', 'Беларусь', '47', 'Розничная торговля', 'Торговля', 1250.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '47', 'Розничная торговля', 'Торговля', 1080.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '47', 'Розничная торговля', 'Торговля', 920.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Agriculture (Сельское хозяйство)
(2024, NULL, 'country', 'Беларусь', '01-03', 'Сельское хозяйство', 'АПК', 1350.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '01-03', 'Сельское хозяйство', 'АПК', 1150.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '01-03', 'Сельское хозяйство', 'АПК', 980.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Law & Legal (Юридические услуги)
(2024, NULL, 'country', 'Беларусь', '69', 'Юридические и нотариальные услуги', 'Право', 1950.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '69', 'Юридические и нотариальные услуги', 'Право', 1680.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '69', 'Юридические и нотариальные услуги', 'Право', 1420.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Real Estate (Операции с недвижимостью)
(2024, NULL, 'country', 'Беларусь', '68', 'Операции с недвижимым имуществом', 'Недвижимость', 1450.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '68', 'Операции с недвижимым имуществом', 'Недвижимость', 1250.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '68', 'Операции с недвижимым имуществом', 'Недвижимость', 1080.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01'),

-- Science & Research (Научная деятельность)
(2024, NULL, 'country', 'Беларусь', '72', 'Научная деятельность', 'Наука', 1850.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2024-12-01'),
(2023, NULL, 'country', 'Беларусь', '72', 'Научная деятельность', 'Наука', 1580.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2023-12-01'),
(2022, NULL, 'country', 'Беларусь', '72', 'Научная деятельность', 'Наука', 1350.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', '2022-12-01');

-- ============================================
-- REGIONAL DATA (by oblast/city)
-- ============================================

INSERT INTO salary_statistics 
(year, month, region_type, region_name, industry_code, industry_name, industry_category, avg_salary, source, source_url) VALUES

-- Minsk City
(2024, NULL, 'city', 'Минск', NULL, 'Все отрасли', 'Все', 2678.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'city', 'Минск', NULL, 'Все отрасли', 'Все', 2389.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'city', 'Минск', NULL, 'Все отрасли', 'Все', 1998.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),

-- Minsk Oblast
(2024, NULL, 'region', 'Минская область', NULL, 'Все отрасли', 'Все', 1823.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'region', 'Минская область', NULL, 'Все отрасли', 'Все', 1621.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'region', 'Минская область', NULL, 'Все отрасли', 'Все', 1356.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),

-- Brest Oblast
(2024, NULL, 'region', 'Брестская область', NULL, 'Все отрасли', 'Все', 1654.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'region', 'Брестская область', NULL, 'Все отрасли', 'Все', 1476.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'region', 'Брестская область', NULL, 'Все отрасли', 'Все', 1234.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),

-- Gomel Oblast
(2024, NULL, 'region', 'Гомельская область', NULL, 'Все отрасли', 'Все', 1723.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'region', 'Гомельская область', NULL, 'Все отрасли', 'Все', 1532.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'region', 'Гомельская область', NULL, 'Все отрасли', 'Все', 1289.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),

-- Grodno Oblast
(2024, NULL, 'region', 'Гродненская область', NULL, 'Все отрасли', 'Все', 1698.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'region', 'Гродненская область', NULL, 'Все отрасли', 'Все', 1512.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'region', 'Гродненская область', NULL, 'Все отрасли', 'Все', 1267.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),

-- Vitebsk Oblast
(2024, NULL, 'region', 'Витебская область', NULL, 'Все отрасли', 'Все', 1567.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'region', 'Витебская область', NULL, 'Все отрасли', 'Все', 1398.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'region', 'Витебская область', NULL, 'Все отрасли', 'Все', 1167.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),

-- Mogilev Oblast
(2024, NULL, 'region', 'Могилевская область', NULL, 'Все отрасли', 'Все', 1634.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'region', 'Могилевская область', NULL, 'Все отрасли', 'Все', 1456.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'region', 'Могилевская область', NULL, 'Все отрасли', 'Все', 1212.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),

-- National Average
(2024, NULL, 'country', 'Беларусь', NULL, 'Все отрасли', 'Все', 1986.00, 'Белстат / MyFin', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2023, NULL, 'country', 'Беларусь', NULL, 'Все отрасли', 'Все', 1767.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi'),
(2022, NULL, 'country', 'Беларусь', NULL, 'Все отрасли', 'Все', 1476.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi');

-- Verify data
SELECT 'Salary statistics table created successfully' as status;
SELECT COUNT(*) as total_rows FROM salary_statistics;
SELECT DISTINCT year FROM salary_statistics ORDER BY year DESC;
SELECT DISTINCT region_name FROM salary_statistics WHERE region_type = 'region';
SELECT DISTINCT industry_category FROM salary_statistics WHERE industry_category IS NOT NULL;
