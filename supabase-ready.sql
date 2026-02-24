-- Complete SQL Script for GradPath Analytics Database
-- Run this entire script in Supabase SQL Editor
-- All tables will be created or updated automatically

-- =====================================================
-- STEP 1: Drop existing tables (in reverse order due to foreign keys)
-- =====================================================
DROP TABLE IF EXISTS admission_stats CASCADE;
DROP TABLE IF EXISTS specialties CASCADE;
DROP TABLE IF EXISTS institutes CASCADE;
DROP TABLE IF EXISTS faculties CASCADE;
DROP TABLE IF EXISTS universities CASCADE;

-- =====================================================
-- STEP 2: Create universities table
-- =====================================================
CREATE TABLE universities (
  id TEXT PRIMARY KEY,
  short_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  city TEXT NOT NULL,
  website TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: Create faculties table
-- =====================================================
CREATE TABLE faculties (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 4: Create institutes table
-- =====================================================
CREATE TABLE institutes (
  id TEXT PRIMARY KEY,
  university_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 5: Create specialties table
-- =====================================================
CREATE TABLE specialties (
  id TEXT PRIMARY KEY,
  faculty_id TEXT REFERENCES faculties(id) ON DELETE CASCADE,
  institute_id TEXT REFERENCES institutes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 6: Disable RLS for all tables
-- =====================================================
ALTER TABLE universities DISABLE ROW LEVEL SECURITY;
ALTER TABLE faculties DISABLE ROW LEVEL SECURITY;
ALTER TABLE institutes DISABLE ROW LEVEL SECURITY;
ALTER TABLE specialties DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 7: Insert universities
-- =====================================================
INSERT INTO universities (id, short_name, full_name, city, website, created_at, updated_at) VALUES
('bsu', 'БГУ', 'Белорусский государственный университет', 'Минск', 'https://bsu.by', NOW(), NOW()),
('bsuir', 'БГУИР', 'Белорусский государственный университет информатики и радиоэлектроники', 'Минск', 'https://bsuir.by', NOW(), NOW()),
('bntu', 'БНТУ', 'Белорусский национальный технический университет', 'Минск', 'https://bntu.by', NOW(), NOW()),
('bseu', 'БГЭУ', 'Белорусский государственный экономический университет', 'Минск', 'https://bseu.by', NOW(), NOW()),
('bsmu', 'БГМУ', 'Белорусский государственный медицинский университет', 'Минск', 'https://bsmu.by', NOW(), NOW()),
('bspu', 'БГПУ', 'Белорусский государственный педагогический университет', 'Минск', 'https://bspu.by', NOW(), NOW()),
('grsu', 'ГрГУ', 'Гродненский государственный университет имени Янки Купалы', 'Гродно', 'https://grsu.by', NOW(), NOW()),
('vsu', 'ВГУ', 'Витебский государственный университет имени П.М. Машерова', 'Витебск', 'https://vsu.by', NOW(), NOW()),
('pgu', 'ПГУ', 'Полоцкий государственный университет', 'Новополоцк', 'https://psu.by', NOW(), NOW()),
('gstu', 'ГГТУ', 'Гомельский государственный технический университет', 'Гомель', 'https://gstu.by', NOW(), NOW()),
('bsufl', 'БГУИЯ', 'Минский государственный лингвистический университет', 'Минск', 'https://mslu.by', NOW(), NOW()),
('au', 'Академия управления', 'Академия управления при Президенте Республики Беларусь', 'Минск', 'https://pac.by', NOW(), NOW()),
('amvd', 'Академия МВД', 'Академия Министерства внутренних дел Республики Беларусь', 'Минск', 'https://amia.by', NOW(), NOW()),
('brsu', 'БрГУ', 'Брестский государственный университет имени А.С. Пушкина', 'Брест', 'https://brsu.by', NOW(), NOW()),
('bsaa', 'БГАА', 'Белорусская государственная академия авиации', 'Минск', 'https://bgaa.by', NOW(), NOW()),
('bsuca', 'БГУКИ', 'Белорусский государственный университет культуры и искусств', 'Минск', 'https://buk.by', NOW(), NOW()),
('bsups', 'БГУФК', 'Белорусский государственный университет физической культуры', 'Минск', 'https://sportedu.by', NOW(), NOW());

-- =====================================================
-- STEP 8: Insert faculties
-- =====================================================

-- БГУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsu-1', 'bsu', 'Факультет прикладной математики и информатики', 'ФПМИ'),
('bsu-2', 'bsu', 'Факультет радиофизики и компьютерных технологий', 'ФРКТ'),
('bsu-3', 'bsu', 'Экономический факультет', 'ЭФ'),
('bsu-4', 'bsu', 'Юридический факультет', 'ЮФ'),
('bsu-5', 'bsu', 'Филологический факультет', 'ФилФ'),
('bsu-6', 'bsu', 'Исторический факультет', 'ИстФ'),
('bsu-7', 'bsu', 'Химический факультет', 'ХимФ'),
('bsu-8', 'bsu', 'Физический факультет', 'ФизФ'),
('bsu-9', 'bsu', 'Биологический факультет', 'БиоФ'),
('bsu-10', 'bsu', 'Факультет международных отношений', 'ФМО'),
('bsu-11', 'bsu', 'Факультет социокультурных коммуникаций', 'ФСК'),
('bsu-12', 'bsu', 'Факультет журналистики', 'ФЖ'),
('bsu-13', 'bsu', 'Факультет географии и геоинформатики', 'ФГиГ'),
('bsu-14', 'bsu', 'Факультет философии и социальных наук', 'ФФиСН');

-- Институты БГУ
INSERT INTO institutes (id, university_id, name, code) VALUES
('bsu-i1', 'bsu', 'Институт бизнеса БГУ', 'ИБ'),
('bsu-i2', 'bsu', 'Институт теологии', 'ИТ'),
('bsu-i3', 'bsu', 'Международный государственный экологический институт', 'МГЭИ'),
('bsu-i4', 'bsu', 'Совместный институт БГУ и ДПУ', 'СИ');

-- БГУИР
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsuir-1', 'bsuir', 'Факультет информационных технологий и управления', 'ФИТУ'),
('bsuir-2', 'bsuir', 'Факультет компьютерного проектирования', 'ФКП'),
('bsuir-3', 'bsuir', 'Факультет радиотехники и электроники', 'ФРиЭ'),
('bsuir-4', 'bsuir', 'Факультет телекоммуникаций', 'ФТ'),
('bsuir-5', 'bsuir', 'Факультет экономики и бизнеса', 'ФЭиБ');

-- Институты БГУИР
INSERT INTO institutes (id, university_id, name, code) VALUES
('bsuir-i1', 'bsuir', 'Институт информационных технологий', 'ИИТ');

-- БНТУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bntu-1', 'bntu', 'Машиностроительный факультет', 'МСФ'),
('bntu-2', 'bntu', 'Энергетический факультет', 'ЭФ'),
('bntu-3', 'bntu', 'Факультет транспортных коммуникаций', 'ФТК'),
('bntu-4', 'bntu', 'Строительный факультет', 'СФ'),
('bntu-5', 'bntu', 'Факультет информационных технологий и робототехники', 'ФИТР'),
('bntu-6', 'bntu', 'Приборостроительный факультет', 'ПСФ');

-- Институты БНТУ
INSERT INTO institutes (id, university_id, name, code) VALUES
('bntu-i1', 'bntu', 'Институт интегрированных форм обучения', 'ИИФО'),
('bntu-i2', 'bntu', 'Международный институт дистанционного образования', 'МИДО');

-- БГЭУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bseu-1', 'bseu', 'Факультет коммерции и менеджмента', 'ФКиМ'),
('bseu-2', 'bseu', 'Факультет учетно-финансовый', 'ФУФ'),
('bseu-3', 'bseu', 'Факультет экономики и права', 'ФЭиП'),
('bseu-4', 'bseu', 'Факультет маркетинга', 'ФМ'),
('bseu-5', 'bseu', 'Факультет международных экономических отношений', 'ФМЭО'),
('bseu-6', 'bseu', 'Факультет высшей школы туризма', 'ФВШТ');

-- БГМУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsmu-1', 'bsmu', 'Лечебный факультет', 'ЛФ'),
('bsmu-2', 'bsmu', 'Педиатрический факультет', 'ПФ'),
('bsmu-3', 'bsmu', 'Медико-профилактический факультет', 'МПФ'),
('bsmu-4', 'bsmu', 'Стоматологический факультет', 'СФ'),
('bsmu-5', 'bsmu', 'Фармацевтический факультет', 'ФФ'),
('bsmu-6', 'bsmu', 'Медицинский факультет иностранных учащихся', 'МФИУ');

-- БГПУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bspu-1', 'bspu', 'Факультет дошкольного образования', 'ФДО'),
('bspu-2', 'bspu', 'Факультет начального образования', 'ФНО'),
('bspu-3', 'bspu', 'Факультет белорусской и русской филологии', 'ФБиРФ'),
('bspu-4', 'bspu', 'Исторический факультет', 'ИФ'),
('bspu-5', 'bspu', 'Факультет социально-педагогических технологий', 'ФСПТ'),
('bspu-6', 'bspu', 'Физико-математический факультет', 'ФМФ'),
('bspu-7', 'bspu', 'Факультет естественных наук', 'ФЕН'),
('bspu-8', 'bspu', 'Факультет физической культуры', 'ФФК');

-- Институты БГПУ
INSERT INTO institutes (id, university_id, name, code) VALUES
('bspu-i1', 'bspu', 'Институт психологии', 'ИП'),
('bspu-i2', 'bspu', 'Институт инклюзивного образования', 'ИИО'),
('bspu-i3', 'bspu', 'Институт повышения квалификации', 'ИПК');

-- ГрГУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('grsu-1', 'grsu', 'Биологический факультет', 'БиоФ'),
('grsu-2', 'grsu', 'Исторический факультет', 'ИстФ'),
('grsu-3', 'grsu', 'Математический факультет', 'МатФ'),
('grsu-4', 'grsu', 'Факультет иностранных языков', 'ФИЯ'),
('grsu-5', 'grsu', 'Педагогический факультет', 'ПедФ'),
('grsu-6', 'grsu', 'Психологический факультет', 'ПсФ'),
('grsu-7', 'grsu', 'Физико-технический факультет', 'ФТФ'),
('grsu-8', 'grsu', 'Филологический факультет', 'ФилФ'),
('grsu-9', 'grsu', 'Юридический факультет', 'ЮФ'),
('grsu-10', 'grsu', 'Экономический факультет', 'ЭФ'),
('grsu-11', 'grsu', 'Факультет искусств и дизайна', 'ФКиД'),
('grsu-12', 'grsu', 'Факультет туризма и гостеприимства', 'ФТиГ'),
('grsu-13', 'grsu', 'Медицинский факультет', 'МФ');

-- ВГУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('vsu-1', 'vsu', 'Исторический факультет', 'ИФ'),
('vsu-2', 'vsu', 'Филологический факультет', 'ФилФ'),
('vsu-3', 'vsu', 'Факультет иностранных языков', 'ФИЯ'),
('vsu-4', 'vsu', 'Факультет физической культуры', 'ФФК'),
('vsu-5', 'vsu', 'Педагогический факультет', 'ПедФ'),
('vsu-6', 'vsu', 'Психологический факультет', 'ПсФ'),
('vsu-7', 'vsu', 'Физико-математический факультет', 'ФМФ'),
('vsu-8', 'vsu', 'Юридический факультет', 'ЮФ');

-- ПГУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('pgu-1', 'pgu', 'Инженерно-строительный факультет', 'ИСФ'),
('pgu-2', 'pgu', 'Гуманитарный факультет', 'ГФ'),
('pgu-3', 'pgu', 'Механико-технологический факультет', 'МТФ'),
('pgu-4', 'pgu', 'Факультет компьютерных наук и электроники', 'ФКНиЭ'),
('pgu-5', 'pgu', 'Факультет информационных технологий', 'ФИТ'),
('pgu-6', 'pgu', 'Финансово-экономический факультет', 'ФЭФ'),
('pgu-7', 'pgu', 'Юридический факультет', 'ЮФ');

-- ГГТУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('gstu-1', 'gstu', 'Энергетический факультет', 'ЭФ'),
('gstu-2', 'gstu', 'Механико-технологический факультет', 'МТФ'),
('gstu-3', 'gstu', 'Факультет автоматизированных и информационных систем', 'ФАИС'),
('gstu-4', 'gstu', 'Машиностроительный факультет', 'МСФ'),
('gstu-5', 'gstu', 'Гуманитарно-экономический факультет', 'ГЭФ');

-- БГУИЯ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsufl-1', 'bsufl', 'Факультет английского языка', 'ФАЯ'),
('bsufl-2', 'bsufl', 'Факультет немецкого языка', 'ФНЯ'),
('bsufl-3', 'bsufl', 'Факультет китайского языка и культуры', 'ФКЯК'),
('bsufl-4', 'bsufl', 'Факультет романских языков', 'ФРЯ'),
('bsufl-5', 'bsufl', 'Факультет межкультурных коммуникаций', 'ФМК'),
('bsufl-6', 'bsufl', 'Переводческий факультет', 'ПФ');

-- Академия управления
INSERT INTO institutes (id, university_id, name, code) VALUES
('au-i1', 'au', 'Институт управленческих кадров', 'ИУК');

-- Академия МВД
INSERT INTO faculties (id, university_id, name, code) VALUES
('amvd-1', 'amvd', 'Следственно-экспертный факультет', 'СЭФ'),
('amvd-2', 'amvd', 'Уголовно-исполнительный факультет', 'УИФ'),
('amvd-3', 'amvd', 'Факультет повышения квалификации', 'ФПК'),
('amvd-4', 'amvd', 'Факультет криминальной милиции', 'ФКМ'),
('amvd-5', 'amvd', 'Факультет права', 'ФП'),
('amvd-6', 'amvd', 'Факультет милиции общественной безопасности', 'ФМОБ'),
('amvd-7', 'amvd', 'Институт психологии служебной деятельности', 'ИПСД');

-- БрГУ
INSERT INTO faculties (id, university_id, name, code) VALUES
('brsu-1', 'brsu', 'Факультет естествознания', 'ФЕ'),
('brsu-2', 'brsu', 'Филологический факультет', 'ФилФ'),
('brsu-3', 'brsu', 'Юридический факультет', 'ЮФ'),
('brsu-4', 'brsu', 'Исторический факультет', 'ИФ'),
('brsu-5', 'brsu', 'Физико-математический факультет', 'ФМФ'),
('brsu-6', 'brsu', 'Факультет иностранных языков', 'ФИЯ'),
('brsu-7', 'brsu', 'Факультет физического воспитания и спорта', 'ФФВиС'),
('brsu-8', 'brsu', 'Факультет педагогики и психологии', 'ФПиП');

-- БГАА
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsaa-1', 'bsaa', 'Факультет гражданской авиации', 'ФГА'),
('bsaa-2', 'bsaa', 'Военный факультет', 'ВФ');

-- БГУКИ
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsuca-1', 'bsuca', 'Факультет культурологии и социально-культурной деятельности', 'ФКиСКД'),
('bsuca-2', 'bsuca', 'Факультет художественной культуры', 'ФХК'),
('bsuca-3', 'bsuca', 'Факультет музыкального и хореографического искусства', 'ФМХИ'),
('bsuca-4', 'bsuca', 'Факультет информационно-документных коммуникаций', 'ФИДК');

-- БГУФК
INSERT INTO faculties (id, university_id, name, code) VALUES
('bsups-1', 'bsups', 'Спортивно-педагогический факультет спортивных игр и единоборств', 'СПФ СИиЕ'),
('bsups-2', 'bsups', 'Спортивно-педагогический факультет массовых видов спорта', 'СПФ МВС'),
('bsups-3', 'bsups', 'Факультет оздоровительной физической культуры', 'ФОФК'),
('bsups-4', 'bsups', 'Факультет менеджмента спорта, туризма и гостеприимства', 'ФМСТГ');

-- Институт БГУФК
INSERT INTO institutes (id, university_id, name, code) VALUES
('bsups-i1', 'bsups', 'Институт менеджмента спорта и туризма', 'ИМСТ');

-- =====================================================
-- STEP 9: Insert specialties (simplified - main ones)
-- =====================================================

-- БГУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsu-s1', 'bsu-1', 'Прикладная математика', '6-05-0311-01'),
('bsu-s2', 'bsu-1', 'Информатика', '6-05-0612-02'),
('bsu-s3', 'bsu-2', 'Радиофизика', '6-05-0711-01'),
('bsu-s4', 'bsu-3', 'Экономика', '6-05-0311-01'),
('bsu-s5', 'bsu-4', 'Правоведение', '6-05-0421-01'),
('bsu-s6', 'bsu-5', 'Русская филология', '6-05-0232-02'),
('bsu-s7', 'bsu-6', 'История', '6-05-0231-01'),
('bsu-s8', 'bsu-7', 'Химия', '6-05-0211-04'),
('bsu-s9', 'bsu-8', 'Физика', '6-05-0211-03'),
('bsu-s10', 'bsu-9', 'Биология', '6-05-0211-01');

-- БГУИР
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsuir-s1', 'bsuir-1', 'Программная инженерия', '6-05-0612-01'),
('bsuir-s2', 'bsuir-1', 'Информационные системы и технологии', '6-05-0611-01'),
('bsuir-s3', 'bsuir-3', 'Электроника', '6-05-0713-01'),
('bsuir-s4', 'bsuir-4', 'Связь', '6-05-0715-05');

-- БНТУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bntu-s1', 'bntu-1', 'Машиностроение', '6-05-0714-02'),
('bntu-s2', 'bntu-2', 'Электроэнергетика', '7-07-0712-01'),
('bntu-s3', 'bntu-4', 'Строительство', '7-07-0732-01');

-- БГЭУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bseu-s1', 'bseu-1', 'Менеджмент', '6-05-0412-01'),
('bseu-s2', 'bseu-2', 'Бухгалтерский учет', '6-05-0411-01'),
('bseu-s3', 'bseu-4', 'Маркетинг', '6-05-0412-02');

-- БГМУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsmu-s1', 'bsmu-1', 'Лечебное дело', '6-05-0912-01'),
('bsmu-s2', 'bsmu-4', 'Стоматология', '6-05-0913-01'),
('bsmu-s3', 'bsmu-5', 'Фармация', '6-05-0914-01');

-- БГПУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bspu-s1', 'bspu-1', 'Дошкольное образование', '6-05-0112-01'),
('bspu-s2', 'bspu-2', 'Начальное образование', '6-05-0111-02'),
('bspu-s3', 'bspu-7', 'Педагогика', '6-05-0113-01');

-- ГрГУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('grsu-s1', 'grsu-3', 'Математика', '6-05-0211-01'),
('grsu-s2', 'grsu-4', 'Английский язык', '6-05-0232-03'),
('grsu-s3', 'grsu-8', 'Белорусская филология', '6-05-0232-01');

-- ВГУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('vsu-s1', 'vsu-1', 'История', '6-05-0231-01'),
('vsu-s2', 'vsu-2', 'Русская филология', '6-05-0232-02'),
('vsu-s3', 'vsu-5', 'Психология', '6-05-0115-01');

-- ПГУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('pgu-s1', 'pgu-3', 'Машиностроение', '6-05-0714-02'),
('pgu-s2', 'pgu-5', 'Программная инженерия', '6-05-0612-01'),
('pgu-s3', 'pgu-6', 'Экономика', '6-05-0311-01');

-- ГГТУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('gstu-s1', 'gstu-1', 'Электроэнергетика', '7-07-0712-01'),
('gstu-s2', 'gstu-3', 'Информационные системы', '6-05-0611-01'),
('gstu-s3', 'gstu-4', 'Технология машиностроения', '6-05-0714-02');

-- БГУИЯ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsufl-s1', 'bsufl-1', 'Английский язык', '6-05-0232-03'),
('bsufl-s2', 'bsufl-2', 'Немецкий язык', '6-05-0232-03'),
('bsufl-s3', 'bsufl-3', 'Китайский язык', '6-05-0232-03'),
('bsufl-s4', 'bsufl-5', 'Межкультурные коммуникации', '6-05-0234-02');

-- Академия управления
INSERT INTO specialties (id, institute_id, name, code) VALUES
('au-s1', 'au-i1', 'Государственное управление и право', '6-05-0414-02'),
('au-s2', 'au-i1', 'Государственное управление и экономика', '6-05-0414-03'),
('au-s3', 'au-i1', 'Управление информационными ресурсами', '6-05-0611-01');

-- Академия МВД
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('amvd-s1', 'amvd-1', 'Правоведение', '6-05-0421-01'),
('amvd-s2', 'amvd-1', 'Судебные криминалистические экспертизы', '6-05-0421-03'),
('amvd-s3', 'amvd-5', 'Правоведение', '6-05-0421-01');

-- БрГУ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('brsu-s1', 'brsu-1', 'Биология', '6-05-0211-01'),
('brsu-s2', 'brsu-2', 'Русская филология', '6-05-0232-02'),
('brsu-s3', 'brsu-5', 'Физика', '6-05-0211-03'),
('brsu-s4', 'brsu-7', 'Физическая культура', '6-05-1011-01');

-- БГАА
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsaa-s1', 'bsaa-1', 'Летная эксплуатация', '6-05-1041-03'),
('bsaa-s2', 'bsaa-1', 'Техническая эксплуатация ВС', '6-05-0715-01'),
('bsaa-s3', 'bsaa-1', 'Организация воздушного движения', '6-05-1041-02');

-- БГУКИ
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsuca-s1', 'bsuca-1', 'Культурология', '6-05-0236-01'),
('bsuca-s2', 'bsuca-2', 'Актерское искусство', '6-05-0236-04'),
('bsuca-s3', 'bsuca-3', 'Музыкальное искусство', '6-05-0236-08'),
('bsuca-s4', 'bsuca-4', 'Библиотечно-информационная деятельность', '6-05-0236-10');

-- БГУФК
INSERT INTO specialties (id, faculty_id, name, code) VALUES
('bsups-s1', 'bsups-1', 'Физическая культура и спорт', '6-05-1011-01'),
('bsups-s2', 'bsups-2', 'Спортивная подготовка', '6-05-1011-04'),
('bsups-s3', 'bsups-3', 'Адаптивная физическая культура', '6-05-1011-05'),
('bsups-s4', 'bsups-4', 'Менеджмент спорта', '6-05-1011-07');

-- Институт БГУФК
INSERT INTO specialties (id, institute_id, name, code) VALUES
('bsups-s5', 'bsups-i1', 'Менеджмент спорта', '6-05-1011-07'),
('bsups-s6', 'bsups-i1', 'Туризм и гостеприимство', '6-05-1011-08');

-- =====================================================
-- STEP 10: Verify data
-- =====================================================
SELECT 'Universities: ' || COUNT(*) as result FROM universities;
SELECT 'Faculties: ' || COUNT(*) as result FROM faculties;
SELECT 'Institutes: ' || COUNT(*) as result FROM institutes;
SELECT 'Specialties: ' || COUNT(*) as result FROM specialties;

SELECT 'Done!' as status;
