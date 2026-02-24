-- ПОЛНЫЙ СКРИПТ: Создание таблиц + загрузка данных

-- 1. Удаляем старые таблицы (если есть)
DROP TABLE IF EXISTS admission_stats CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS faculties CASCADE;
DROP TABLE IF EXISTS universities CASCADE;

-- 2. Создаем таблицы
CREATE TABLE universities (
  id TEXT PRIMARY KEY,
  short_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE faculties (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE specialties (
  id TEXT PRIMARY KEY,
  faculty_id TEXT REFERENCES faculties(id) ON DELETE CASCADE,
  institute_id TEXT,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE admission_stats (
  id TEXT PRIMARY KEY,
  specialty_id TEXT NOT NULL REFERENCES specialties(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  min_score INTEGER,
  avg_score REAL,
  budget_places INTEGER,
  paid_places INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Отключаем RLS
ALTER TABLE universities DISABLE ROW LEVEL SECURITY;
ALTER TABLE faculties DISABLE ROW LEVEL SECURITY;
ALTER TABLE specialties DISABLE ROW LEVEL SECURITY;
ALTER TABLE admission_stats DISABLE ROW LEVEL SECURITY;

-- 4. Загружаем университеты
INSERT INTO universities (id, short_name, full_name, city, website) VALUES
('bsu', 'БГУ', 'Белорусский государственный университет', 'Минск', 'https://bsu.by'),
('bsuir', 'БГУИР', 'Белорусский государственный университет информатики и радиоэлектроники', 'Минск', 'https://bsuir.by'),
('bntu', 'БНТУ', 'Белорусский национальный технический университет', 'Минск', 'https://bntu.by'),
('bseu', 'БГЭУ', 'Белорусский государственный экономический университет', 'Минск', 'https://bseu.by'),
('bsmu', 'БГМУ', 'Белорусский государственный медицинский университет', 'Минск', 'https://bsmu.by'),
('bspu', 'БГПУ', 'Белорусский государственный педагогический университет', 'Минск', 'https://bspu.by'),
('grsu', 'ГрГУ', 'Гродненский государственный университет имени Янки Купалы', 'Гродно', 'https://grsu.by'),
('vsu', 'ВГУ', 'Витебский государственный университет имени П.М. Машерова', 'Витебск', 'https://vsu.by'),
('pgu', 'ПГУ', 'Полоцкий государственный университет', 'Новополоцк', 'https://psu.by'),
('gstu', 'ГГТУ', 'Гомельский государственный технический университет', 'Гомель', 'https://gstu.by'),
('bsufl', 'БГУИЯ', 'Минский государственный лингвистический университет', 'Минск', 'https://mslu.by'),
('academy_management', 'Академия управления', 'Академия управления при Президенте', 'Минск', 'https://academy.gov.by'),
('academy_mvd', 'Академия МВД', 'Академия Министерства внутренних дел', 'Минск', 'https://academy.mvd.gov.by'),
('brsu', 'БрГУ', 'Брестский государственный университет', 'Брест', 'https://brsu.by'),
('bsaa', 'БГАА', 'Белорусская государственная академия авиации', 'Минск', 'https://bsaa.by'),
('bsuca', 'БГУКИ', 'Белорусский государственный университет культуры', 'Минск', 'https://bsuca.by'),
('bsups', 'БГУФК', 'Белорусский государственный университет физической культуры', 'Минск', 'https://bsups.by');

-- 5. Загружаем факультеты БГУИЯ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsufl-1', 'bsufl', 'Факультет английского языка', 'ФАЯ'),
('bsufl-2', 'bsufl', 'Факультет немецкого языка', 'ФНЯ'),
('bsufl-3', 'bsufl', 'Факультет китайского языка и культуры', 'ФКЯК'),
('bsufl-4', 'bsufl', 'Факультет романских языков', 'ФРЯ'),
('bsufl-5', 'bsufl', 'Факультет межкультурных коммуникаций', 'ФМК'),
('bsufl-6', 'bsufl', 'Переводческий факультет', 'ПФ');

-- 6. Загружаем специальности БГУИЯ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsufl-s1', 'bsufl-1', 'Современные иностранные языки (Английский язык и второй иностранный)', '6-05-0232-03'),
('bsufl-s2', 'bsufl-1', 'Лингвистическое образование (Английский язык)', '6-05-0113-02'),
('bsufl-s3', 'bsufl-1', 'Цифровая лингвистика (Английский язык)', '6-05-0233-05'),
('bsufl-s4', 'bsufl-2', 'Современные иностранные языки (Немецкий язык и английский язык)', '6-05-0232-03'),
('bsufl-s5', 'bsufl-2', 'Лингвистическое образование (Немецкий язык)', '6-05-0113-02'),
('bsufl-s6', 'bsufl-2', 'Цифровая лингвистика (Немецкий язык)', '6-05-0233-05'),
('bsufl-s7', 'bsufl-3', 'Современные иностранные языки (Китайский язык и английский язык)', '6-05-0232-03'),
('bsufl-s8', 'bsufl-3', 'Лингвистическое образование (Китайский язык)', '6-05-0113-02'),
('bsufl-s9', 'bsufl-4', 'Современные иностранные языки (Французский язык и второй иностранный)', '6-05-0232-03'),
('bsufl-s10', 'bsufl-4', 'Современные иностранные языки (Испанский язык и второй иностранный)', '6-05-0232-03'),
('bsufl-s11', 'bsufl-4', 'Лингвистическое образование (Французский язык)', '6-05-0113-02'),
('bsufl-s12', 'bsufl-5', 'Лингвистическое обеспечение международных коммуникаций', '6-05-0234-01'),
('bsufl-s13', 'bsufl-5', 'Лингвистическое обеспечение межкультурных коммуникаций', '6-05-0234-02'),
('bsufl-s14', 'bsufl-6', 'Переводческое дело (Английский язык и второй иностранный язык)', '6-05-0233-01'),
('bsufl-s15', 'bsufl-6', 'Переводческое дело (Английский язык и итальянский язык)', '6-05-0233-01');

-- 7. Проверка
SELECT 'Universities: ' || COUNT(*) as result FROM universities;
SELECT 'Faculties: ' || COUNT(*) as result FROM faculties;
SELECT 'Specialties: ' || COUNT(*) as result FROM specialties;
