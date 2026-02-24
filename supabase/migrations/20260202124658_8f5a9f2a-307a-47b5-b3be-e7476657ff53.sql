-- Allow service role to insert vacancies (from edge function)
-- Drop existing policy if exists and create new one for service role
CREATE POLICY "Service role can insert vacancies" 
ON public.vacancies 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can update vacancies" 
ON public.vacancies 
FOR UPDATE 
TO service_role
USING (true);

CREATE POLICY "Service role can delete vacancies" 
ON public.vacancies 
FOR DELETE 
TO service_role
USING (true);