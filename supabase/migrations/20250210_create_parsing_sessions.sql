-- Create parsing_sessions table for tracking parsing progress
-- Run this in Supabase SQL Editor before using the parser

CREATE TABLE IF NOT EXISTS parsing_sessions (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(20) DEFAULT 'running',
  total_pages INTEGER DEFAULT 0,
  current_page INTEGER DEFAULT 0,
  total_found INTEGER DEFAULT 0,
  new_vacancies INTEGER DEFAULT 0,
  duplicates_skipped INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for admin access
ALTER TABLE parsing_sessions DISABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_parsing_sessions_status ON parsing_sessions(status);
CREATE INDEX IF NOT EXISTS idx_parsing_sessions_started_at ON parsing_sessions(started_at DESC);

SELECT 'parsing_sessions table created successfully' as status;
