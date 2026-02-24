-- Добавляем колонку для проходного балла на платное обучение
ALTER TABLE public.admission_stats ADD COLUMN IF NOT EXISTS paid_min_score NUMERIC(5,2);
