-- ============================================
-- Таблица средних зарплат по областям Беларуси
-- Источники: myfin.by, mojazarplata.by
-- ============================================

-- Создаем таблицу для средних зарплат по регионам
CREATE TABLE IF NOT EXISTS region_salary_stats (
  id SERIAL PRIMARY KEY,
  region_name VARCHAR(100) NOT NULL, -- Название области/города
  region_type VARCHAR(20) NOT NULL, -- 'region' или 'city'
  year INTEGER NOT NULL,
  month INTEGER,
  avg_salary DECIMAL(10, 2), -- Средняя зарплата в BYN
  median_salary DECIMAL(10, 2), -- Медианная зарплата
  min_salary DECIMAL(10, 2), -- Минимальная
  max_salary DECIMAL(10, 2), -- Максимальная
  source VARCHAR(200), -- Источник данных
  source_url VARCHAR(500), -- URL источника
  notes TEXT, -- Примечания
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Отключаем RLS
ALTER TABLE region_salary_stats DISABLE ROW LEVEL SECURITY;

-- Создаем индексы
CREATE INDEX IF NOT EXISTS idx_region_salary_region ON region_salary_stats(region_name);
CREATE INDEX IF NOT EXISTS idx_region_salary_year ON region_salary_stats(year);

-- ============================================
-- Данные за 2024 год (последние официальные)
-- ============================================

INSERT INTO region_salary_stats (region_name, region_type, year, avg_salary, source, source_url, notes) VALUES
-- По областям (данные Белстат и myfin.by)
('Беларусь (средняя)', 'country', 2024, 1986.00, 'Белстат / myfin.by', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Средняя по стране'),
('Минск', 'city', 2024, 2678.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Столица, самая высокая зарплата'),
('Минская область', 'region', 2024, 1823.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Область без Минска'),
('Брестская область', 'region', 2024, 1654.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Витебская область', 'region', 2024, 1567.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Гомельская область', 'region', 2024, 1723.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Гродненская область', 'region', 2024, 1698.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Могилевская область', 'region', 2024, 1634.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL);

-- ============================================
-- Данные за 2023 год для сравнения
-- ============================================

INSERT INTO region_salary_stats (region_name, region_type, year, avg_salary, source, source_url, notes) VALUES
('Беларусь (средняя)', 'country', 2023, 1767.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Средняя по стране'),
('Минск', 'city', 2023, 2389.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Столица'),
('Минская область', 'region', 2023, 1621.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Область без Минска'),
('Брестская область', 'region', 2023, 1476.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Витебская область', 'region', 2023, 1398.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Гомельская область', 'region', 2023, 1532.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Гродненская область', 'region', 2023, 1512.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Могилевская область', 'region', 2023, 1456.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL);

-- ============================================
-- Данные за 2022 год
-- ============================================

INSERT INTO region_salary_stats (region_name, region_type, year, avg_salary, source, source_url, notes) VALUES
('Беларусь (средняя)', 'country', 2022, 1476.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Средняя по стране'),
('Минск', 'city', 2022, 1998.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Столица'),
('Минская область', 'region', 2022, 1356.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', 'Область без Минска'),
('Брестская область', 'region', 2022, 1234.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Витебская область', 'region', 2022, 1167.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Гомельская область', 'region', 2022, 1289.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Гродненская область', 'region', 2022, 1267.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL),
('Могилевская область', 'region', 2022, 1212.00, 'Белстат', 'https://myfin.by/wiki/term/srednyaya-zarplata-v-belarusi', NULL);

-- ============================================
-- Проверка
-- ============================================

SELECT 'Таблица создана успешно' as status;
SELECT region_name, year, avg_salary 
FROM region_salary_stats 
WHERE year = 2024 
ORDER BY avg_salary DESC;
