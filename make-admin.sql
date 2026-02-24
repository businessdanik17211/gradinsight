-- Add user as administrator
-- Run this SQL in Supabase to grant admin privileges

-- First, ensure user_roles table exists
CREATE TABLE IF NOT EXISTS user_roles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Disable RLS for user_roles (or set appropriate policies)
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;

-- Add the user as admin
INSERT INTO user_roles (user_id, role) VALUES
('e5948dcb-1ede-4399-8808-8b6e68a85fd7', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the user is now admin
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE u.id = 'e5948dcb-1ede-4399-8808-8b6e68a85fd7';

-- Show all admins
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
