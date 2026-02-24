-- Добавляем факультеты для БГЭУ, БГМУ, БГПУ

-- БГЭУ факультеты
INSERT INTO public.faculties (university_id, name, code) VALUES
((SELECT id FROM universities WHERE short_name = 'БГЭУ'), 'Факультет менеджмента', 'FM'),
((SELECT id FROM universities WHERE short_name = 'БГЭУ'), 'Факультет финансов и банковского дела', 'FFBD'),
((SELECT id FROM universities WHERE short_name = 'БГЭУ'), 'Учетно-экономический факультет', 'UEF'),
((SELECT id FROM universities WHERE short_name = 'БГЭУ'), 'Факультет маркетинга и логистики', 'FML'),
((SELECT id FROM universities WHERE short_name = 'БГЭУ'), 'Факультет права', 'FP'),
((SELECT id FROM universities WHERE short_name = 'БГЭУ'), 'Факультет международных бизнес-коммуникаций', 'FMBK');

-- БГМУ факультеты
INSERT INTO public.faculties (university_id, name, code) VALUES
((SELECT id FROM universities WHERE short_name = 'БГМУ'), 'Лечебный факультет', 'LF'),
((SELECT id FROM universities WHERE short_name = 'БГМУ'), 'Педиатрический факультет', 'PF'),
((SELECT id FROM universities WHERE short_name = 'БГМУ'), 'Медико-профилактический факультет', 'MPF'),
((SELECT id FROM universities WHERE short_name = 'БГМУ'), 'Стоматологический факультет', 'SF'),
((SELECT id FROM universities WHERE short_name = 'БГМУ'), 'Фармацевтический факультет', 'FF'),
((SELECT id FROM universities WHERE short_name = 'БГМУ'), 'Факультет иностранных студентов', 'FIS');

-- БГПУ факультеты
INSERT INTO public.faculties (university_id, name, code) VALUES
((SELECT id FROM universities WHERE short_name = 'БГПУ'), 'Факультет начального образования', 'FNO'),
((SELECT id FROM universities WHERE short_name = 'БГПУ'), 'Факультет дошкольного образования', 'FDO'),
((SELECT id FROM universities WHERE short_name = 'БГПУ'), 'Исторический факультет', 'IF'),
((SELECT id FROM universities WHERE short_name = 'БГПУ'), 'Филологический факультет', 'FF'),
((SELECT id FROM universities WHERE short_name = 'БГПУ'), 'Факультет психологии', 'FP'),
((SELECT id FROM universities WHERE short_name = 'БГПУ'), 'Физико-математический факультет', 'FMF');

-- Добавляем специальности для БГЭУ
INSERT INTO public.specialties (faculty_id, name, code, degree_type, duration_years, description) VALUES
((SELECT id FROM faculties WHERE name = 'Факультет менеджмента' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГЭУ')), 
 'Менеджмент', '1-26 02 01', 'bachelor', 4, 'Подготовка управленческих кадров'),
((SELECT id FROM faculties WHERE name = 'Факультет финансов и банковского дела' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГЭУ')), 
 'Финансы и кредит', '1-25 01 04', 'bachelor', 4, 'Специалисты банковской сферы'),
((SELECT id FROM faculties WHERE name = 'Учетно-экономический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГЭУ')), 
 'Бухгалтерский учет', '1-25 01 08', 'bachelor', 4, 'Подготовка бухгалтеров и аудиторов'),
((SELECT id FROM faculties WHERE name = 'Факультет маркетинга и логистики' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГЭУ')), 
 'Маркетинг', '1-26 02 03', 'bachelor', 4, 'Специалисты в области маркетинга'),
((SELECT id FROM faculties WHERE name = 'Факультет права' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГЭУ')), 
 'Правоведение', '1-24 01 02', 'bachelor', 4, 'Юридическое образование'),
((SELECT id FROM faculties WHERE name = 'Факультет международных бизнес-коммуникаций' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГЭУ')), 
 'Международные экономические отношения', '1-25 01 03', 'bachelor', 4, 'Внешнеэкономическая деятельность');

-- Добавляем специальности для БГМУ
INSERT INTO public.specialties (faculty_id, name, code, degree_type, duration_years, description) VALUES
((SELECT id FROM faculties WHERE name = 'Лечебный факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГМУ')), 
 'Лечебное дело', '1-79 01 01', 'specialist', 6, 'Подготовка врачей общей практики'),
((SELECT id FROM faculties WHERE name = 'Педиатрический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГМУ')), 
 'Педиатрия', '1-79 01 02', 'specialist', 6, 'Подготовка детских врачей'),
((SELECT id FROM faculties WHERE name = 'Стоматологический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГМУ')), 
 'Стоматология', '1-79 01 03', 'specialist', 5, 'Подготовка врачей-стоматологов'),
((SELECT id FROM faculties WHERE name = 'Фармацевтический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГМУ')), 
 'Фармация', '1-79 01 08', 'specialist', 5, 'Подготовка провизоров'),
((SELECT id FROM faculties WHERE name = 'Медико-профилактический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГМУ')), 
 'Медико-профилактическое дело', '1-79 01 04', 'specialist', 6, 'Санитарные врачи');

-- Добавляем специальности для БГПУ
INSERT INTO public.specialties (faculty_id, name, code, degree_type, duration_years, description) VALUES
((SELECT id FROM faculties WHERE name = 'Факультет начального образования' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГПУ')), 
 'Начальное образование', '1-01 02 01', 'bachelor', 4, 'Учителя начальных классов'),
((SELECT id FROM faculties WHERE name = 'Факультет дошкольного образования' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГПУ')), 
 'Дошкольное образование', '1-01 01 01', 'bachelor', 4, 'Воспитатели детских садов'),
((SELECT id FROM faculties WHERE name = 'Исторический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГПУ')), 
 'История и обществоведческие дисциплины', '1-02 01 01', 'bachelor', 4, 'Учителя истории'),
((SELECT id FROM faculties WHERE name = 'Филологический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГПУ')), 
 'Белорусский язык и литература', '1-02 03 01', 'bachelor', 4, 'Учителя белорусского языка'),
((SELECT id FROM faculties WHERE name = 'Факультет психологии' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГПУ')), 
 'Психология', '1-23 01 04', 'bachelor', 4, 'Психологи'),
((SELECT id FROM faculties WHERE name = 'Физико-математический факультет' AND university_id = (SELECT id FROM universities WHERE short_name = 'БГПУ')), 
 'Математика и информатика', '1-02 05 01', 'bachelor', 4, 'Учителя математики');