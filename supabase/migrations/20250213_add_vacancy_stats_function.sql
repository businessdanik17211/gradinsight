-- Function to get vacancy statistics by category
-- This runs on the server side and avoids the 1000 row limit
CREATE OR REPLACE FUNCTION get_vacancy_stats()
RETURNS TABLE (
  category TEXT,
  count BIGINT,
  avg_salary_min NUMERIC,
  avg_salary_max NUMERIC,
  avg_salary NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(v.category, 'Другое') as category,
    COUNT(*)::BIGINT as count,
    ROUND(AVG(v.salary_min) FILTER (WHERE v.salary_min IS NOT NULL))::NUMERIC as avg_salary_min,
    ROUND(AVG(v.salary_max) FILTER (WHERE v.salary_max IS NOT NULL))::NUMERIC as avg_salary_max,
    ROUND(AVG((v.salary_min + v.salary_max) / 2) FILTER (WHERE v.salary_min IS NOT NULL OR v.salary_max IS NOT NULL))::NUMERIC as avg_salary
  FROM vacancies v
  GROUP BY COALESCE(v.category, 'Другое')
  ORDER BY COUNT(*) DESC;
END;
$$ LANGUAGE plpgsql;
