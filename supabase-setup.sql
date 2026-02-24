-- Создание таблиц для GradPath Analytics

-- Таблица университетов
CREATE TABLE IF NOT EXISTS universities (
  id TEXT PRIMARY KEY,
  short_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Таблица факультетов
CREATE TABLE IF NOT EXISTS faculties (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Таблица специальностей
CREATE TABLE IF NOT EXISTS specialties (
  id TEXT PRIMARY KEY,
  faculty_id TEXT REFERENCES faculties(id) ON DELETE CASCADE,
  institute_id TEXT,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Таблица статистики поступления
CREATE TABLE IF NOT EXISTS admission_stats (
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

-- Отключаем RLS для упрощения (можно включить позже)
ALTER TABLE universities DISABLE ROW LEVEL SECURITY;
ALTER TABLE faculties DISABLE ROW LEVEL SECURITY;
ALTER TABLE specialties DISABLE ROW LEVEL SECURITY;
ALTER TABLE admission_stats DISABLE ROW LEVEL SECURITY;

-- Создаем индексы для ускорения запросов
CREATE INDEX IF NOT EXISTS idx_faculties_university ON faculties(university_id);
CREATE INDEX IF NOT EXISTS idx_specialties_faculty ON specialties(faculty_id);
CREATE INDEX IF NOT EXISTS idx_specialties_institute ON specialties(institute_id);
CREATE INDEX IF NOT EXISTS idx_admission_stats_specialty ON admission_stats(specialty_id);
CREATE INDEX IF NOT EXISTS idx_admission_stats_year ON admission_stats(year);
