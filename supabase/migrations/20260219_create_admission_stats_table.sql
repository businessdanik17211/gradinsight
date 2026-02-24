-- Таблица проходных баллов
CREATE TABLE IF NOT EXISTS public.admission_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specialty_id TEXT NOT NULL,
  year INTEGER NOT NULL,
  budget_places INTEGER,
  paid_places INTEGER,
  min_score NUMERIC(5,2),
  avg_score NUMERIC(5,2),
  applications_count INTEGER,
  enrolled_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_admission_stats_specialty ON public.admission_stats(specialty_id);
CREATE INDEX IF NOT EXISTS idx_admission_stats_year ON public.admission_stats(year);

-- RLS
ALTER TABLE public.admission_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read admission_stats" ON public.admission_stats FOR SELECT USING (true);
CREATE POLICY "Anyone can insert admission_stats" ON public.admission_stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update admission_stats" ON public.admission_stats FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete admission_stats" ON public.admission_stats FOR DELETE USING (true);
