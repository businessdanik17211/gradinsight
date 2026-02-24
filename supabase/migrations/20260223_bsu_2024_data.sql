-- Проходные баллы БГУ 2024 (исправленные данные из BSU2024.txt)
-- Важно: в файле реальный порядок - Платная, Бюджет (колонки перепутаны в заголовке!)
-- Институт бизнеса - только платное

DELETE FROM public.admission_stats WHERE specialty_id LIKE 'bsu-s%' AND year = 2024;

INSERT INTO public.admission_stats (specialty_id, year, budget_places, paid_places, min_score, avg_score, paid_min_score) VALUES
-- Биологический факультет (bsu-9)
-- биология: в файле "Бюджет=333, Платная=294" → min_score=294, paid=333
('bsu-s39', 2024, NULL, NULL, 294, NULL, 333),
('bsu-s41', 2024, NULL, NULL, 316, NULL, 347),
('bsu-s40', 2024, NULL, NULL, 324, NULL, 367),
('bsu-s42', 2024, NULL, NULL, 327, NULL, 364),
('bsu-s44', 2024, NULL, NULL, 318, NULL, 349),
('bsu-s43', 2024, NULL, NULL, 287, NULL, 329),
-- Факультет географии и геоинформатики (bsu-13)
('bsu-s62', 2024, NULL, NULL, NULL, NULL, 234),
('bsu-s64', 2024, NULL, NULL, 244, NULL, 236),
('bsu-s65', 2024, NULL, NULL, 215, NULL, 298),
('bsu-s66', 2024, NULL, NULL, 258, NULL, 252),
('bsu-s68', 2024, NULL, NULL, 217, NULL, 330),
('bsu-s63', 2024, NULL, NULL, 263, NULL, 300),
('bsu-s69', 2024, NULL, NULL, 143, NULL, 272),
('bsu-s67', 2024, NULL, NULL, 227, NULL, 273),
-- Факультет социокультурных коммуникаций (bsu-11)
('bsu-s53', 2024, NULL, NULL, 211, NULL, 247),
('bsu-s55', 2024, NULL, NULL, 217, NULL, 245),
('bsu-s56', 2024, NULL, NULL, 214, NULL, 256),
('bsu-s57', 2024, NULL, NULL, NULL, NULL, 246),
('bsu-s52', 2024, NULL, NULL, 283, NULL, 365),
('bsu-s54', 2024, NULL, NULL, 325, NULL, 358),
('bsu-s50', 2024, NULL, NULL, 267, NULL, 349),
('bsu-s51', 2024, NULL, NULL, 268, NULL, 357),
-- Институт теологии БГУ (bsu-i2)
('bsu-s87', 2024, NULL, NULL, 307, NULL, 275),
('bsu-s28', 2024, NULL, NULL, 232, NULL, 295),
-- Исторический факультет (bsu-6)
('bsu-s27', 2024, NULL, NULL, NULL, NULL, 305),
-- Факультет журналистики (bsu-12)
('bsu-s26', 2024, NULL, NULL, 229, NULL, 359),
('bsu-s25', 2024, NULL, NULL, NULL, NULL, 335),
('bsu-s58', 2024, NULL, NULL, NULL, NULL, 289),
('bsu-s59', 2024, NULL, NULL, NULL, NULL, 372),
-- Факультет международных отношений (bsu-10)
('bsu-s18', 2024, NULL, NULL, 335, NULL, 381),
('bsu-s47', 2024, NULL, NULL, 343, NULL, 390),
('bsu-s46', 2024, NULL, NULL, 323, NULL, 390),
('bsu-s10', 2024, NULL, NULL, 270, NULL, 382),
('bsu-s11', 2024, NULL, NULL, 310, NULL, 395),
('bsu-s14', 2024, NULL, NULL, 333, NULL, 386),
('bsu-s48', 2024, NULL, NULL, 313, NULL, 369),
('bsu-s49', 2024, NULL, NULL, 284, NULL, 350),
-- Механико-математический факультет (bsu-16)
('bsu-s81', 2024, NULL, NULL, 291, NULL, 359),
('bsu-s79', 2024, NULL, NULL, NULL, NULL, 329),
('bsu-s82', 2024, NULL, NULL, 324, NULL, 364),
('bsu-s80', 2024, NULL, NULL, NULL, NULL, 349),
-- Факультет прикладной математики и информатики (bsu-1)
('bsu-s3', 2024, NULL, NULL, 348, NULL, 384),
('bsu-s4', 2024, NULL, NULL, 330, NULL, 378),
('bsu-s1', 2024, NULL, NULL, 346, NULL, 372),
('bsu-s2', 2024, NULL, NULL, 346, NULL, 391),
-- Совместный институт БГУ и ДПУ (bsu-i4)
('bsu-s97', 2024, NULL, NULL, 295, NULL, 356),
-- Факультет радиофизики и компьютерных технологий (bsu-2)
('bsu-s6', 2024, NULL, NULL, 310, NULL, 344),
('bsu-s7', 2024, NULL, NULL, 321, NULL, 353),
('bsu-s5', 2024, NULL, NULL, 295, NULL, 336),
-- Физический факультет (bsu-8)
('bsu-s35', 2024, NULL, NULL, NULL, NULL, 321),
('bsu-s34', 2024, NULL, NULL, 293, NULL, 339),
('bsu-s36', 2024, NULL, NULL, NULL, NULL, 335),
('bsu-s38', 2024, NULL, NULL, NULL, NULL, 288),
('bsu-s37', 2024, NULL, NULL, NULL, NULL, 339),
-- Совместный институт БГУ и ДПУ
('bsu-s95', 2024, NULL, NULL, 287, NULL, 343),
-- МГЭИ (bsu-i3)
('bsu-s90', 2024, NULL, NULL, NULL, NULL, 245),
('bsu-s93', 2024, NULL, NULL, NULL, NULL, 228),
('bsu-s94', 2024, NULL, NULL, NULL, NULL, 204),
('bsu-s92', 2024, NULL, NULL, NULL, NULL, 147),
('bsu-s89', 2024, NULL, NULL, NULL, NULL, 278),
('bsu-s88', 2024, NULL, NULL, 274, NULL, 285),
('bsu-s91', 2024, NULL, NULL, 189, NULL, 302),
-- Факультет философии и социальных наук (bsu-14)
('bsu-s72', 2024, NULL, NULL, 296, NULL, 364),
('bsu-s73', 2024, NULL, NULL, 336, NULL, 383),
('bsu-s71', 2024, NULL, NULL, 324, NULL, 360),
('bsu-s70', 2024, NULL, NULL, 328, NULL, 349),
-- Филологический факультет (bsu-5)
('bsu-s22', 2024, NULL, NULL, NULL, NULL, 229),
('bsu-s21', 2024, NULL, NULL, NULL, NULL, 329),
('bsu-s18', 2024, NULL, NULL, 330, NULL, 361),
('bsu-s19', 2024, NULL, NULL, 296, NULL, 349),
-- Химический факультет (bsu-7)
('bsu-s33', 2024, NULL, NULL, NULL, NULL, 333),
('bsu-s29', 2024, NULL, NULL, 318, NULL, 343),
('bsu-s31', 2024, NULL, NULL, NULL, NULL, 331),
('bsu-s32', 2024, NULL, NULL, NULL, NULL, 333),
('bsu-s30', 2024, NULL, NULL, 342, NULL, 372),
-- Экономический факультет (bsu-3)
('bsu-s10', 2024, NULL, NULL, 296, NULL, 389),
('bsu-s11', 2024, NULL, NULL, 288, NULL, 377),
('bsu-s12', 2024, NULL, NULL, 276, NULL, 381),
('bsu-s14', 2024, NULL, NULL, 322, NULL, 394),
('bsu-s13', 2024, NULL, NULL, 321, NULL, 383),
('bsu-s9', 2024, NULL, NULL, NULL, NULL, 372),
-- Юридический факультет (bsu-4)
('bsu-s17', 2024, NULL, NULL, NULL, NULL, 355),
('bsu-s15', 2024, NULL, NULL, NULL, NULL, 230),
('bsu-s16', 2024, NULL, NULL, NULL, NULL, 351),
-- Военный факультет (bsu-15)
('bsu-s75', 2024, NULL, NULL, NULL, NULL, 293),
('bsu-s77', 2024, NULL, NULL, NULL, NULL, 356),
('bsu-s78', 2024, NULL, NULL, NULL, NULL, 319),
('bsu-s76', 2024, NULL, NULL, NULL, NULL, 214),
('bsu-s74', 2024, NULL, NULL, NULL, NULL, 250),
-- Институт бизнеса БГУ (bsu-i1) - только платное
-- В файле: ;;288 - значит бюджет=пусто, платная=288
('bsu-s86', 2024, NULL, NULL, NULL, NULL, 288),
('bsu-s85', 2024, NULL, NULL, NULL, NULL, 307),
('bsu-s83', 2024, NULL, NULL, NULL, NULL, 318),
('bsu-s84', 2024, NULL, NULL, NULL, NULL, 278);
