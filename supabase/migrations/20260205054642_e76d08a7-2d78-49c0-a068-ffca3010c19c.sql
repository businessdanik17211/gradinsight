-- Добавляем проходные баллы для БГЭУ, БГМУ, БГПУ за 2024-2025

-- БГЭУ 2025
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, applications_count, enrolled_count) VALUES
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Менеджмент'), 
 2025, 25, 50, 320.00, 328.00, 180, 75),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Финансы и кредит'), 
 2025, 30, 60, 345.00, 355.00, 220, 90),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Бухгалтерский учет'), 
 2025, 25, 45, 310.00, 318.00, 150, 70),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Маркетинг'), 
 2025, 20, 40, 325.00, 335.00, 130, 60),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Правоведение'), 
 2025, 35, 70, 365.00, 375.00, 280, 105),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Международные экономические отношения'), 
 2025, 20, 30, 378.00, 385.00, 160, 50);

-- БГМУ 2025
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, applications_count, enrolled_count) VALUES
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГМУ' AND s.name = 'Лечебное дело'), 
 2025, 350, 150, 365.00, 378.00, 1200, 500),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГМУ' AND s.name = 'Педиатрия'), 
 2025, 80, 30, 355.00, 365.00, 320, 110),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГМУ' AND s.name = 'Стоматология'), 
 2025, 60, 80, 385.00, 395.00, 450, 140),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГМУ' AND s.name = 'Фармация'), 
 2025, 100, 60, 340.00, 352.00, 380, 160),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГМУ' AND s.name = 'Медико-профилактическое дело'), 
 2025, 50, 20, 325.00, 338.00, 180, 70);

-- БГПУ 2025
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, applications_count, enrolled_count) VALUES
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГПУ' AND s.name = 'Начальное образование'), 
 2025, 100, 30, 285.00, 295.00, 280, 130),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГПУ' AND s.name = 'Дошкольное образование'), 
 2025, 80, 25, 270.00, 282.00, 200, 105),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГПУ' AND s.name = 'История и обществоведческие дисциплины'), 
 2025, 50, 20, 310.00, 322.00, 150, 70),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГПУ' AND s.name = 'Белорусский язык и литература'), 
 2025, 60, 15, 290.00, 302.00, 130, 75),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГПУ' AND s.name = 'Психология'), 
 2025, 40, 30, 335.00, 348.00, 180, 70),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГПУ' AND s.name = 'Математика и информатика'), 
 2025, 45, 20, 305.00, 318.00, 120, 65);

-- Добавляем исторические данные за 2023 год для БГУ
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, applications_count, enrolled_count) VALUES
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Информатика' LIMIT 1), 
 2023, 26, NULL, 382.00, 386.00, 195, 26),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Прикладная информатика' LIMIT 1), 
 2023, 22, NULL, 385.00, 390.00, 175, 22),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Прикладная математика' LIMIT 1), 
 2023, 22, NULL, 365.00, 370.00, 100, 22),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Экономика' LIMIT 1), 
 2023, 24, NULL, 380.00, 385.00, 160, 24);

-- Добавляем исторические данные за 2022 год для БГУ
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, applications_count, enrolled_count) VALUES
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Информатика' LIMIT 1), 
 2022, 24, NULL, 375.00, 380.00, 185, 24),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Прикладная информатика' LIMIT 1), 
 2022, 20, NULL, 378.00, 385.00, 165, 20),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Прикладная математика' LIMIT 1), 
 2022, 20, NULL, 360.00, 368.00, 95, 20),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУ' AND s.name = 'Экономика' LIMIT 1), 
 2022, 22, NULL, 372.00, 378.00, 150, 22);

-- Данные за 2023-2024 для БГУИР
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, applications_count, enrolled_count) VALUES
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУИР' AND s.name = 'Информатика и технологии программирования' LIMIT 1), 
 2023, 28, NULL, 382.00, 388.00, 245, 28),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУИР' AND s.name = 'Искусственный интеллект' LIMIT 1), 
 2023, 22, NULL, 375.00, 380.00, 180, 22),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГУИР' AND s.name = 'Информатика и технологии программирования' LIMIT 1), 
 2022, 26, NULL, 375.00, 382.00, 230, 26);

-- Данные за 2024 для БГЭУ  
INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, applications_count, enrolled_count) VALUES
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Финансы и кредит'), 
 2024, 28, 55, 338.00, 350.00, 200, 83),
((SELECT s.id FROM specialties s JOIN faculties f ON s.faculty_id = f.id JOIN universities u ON f.university_id = u.id WHERE u.short_name = 'БГЭУ' AND s.name = 'Правоведение'), 
 2024, 33, 65, 358.00, 370.00, 260, 98);