-- SIMPLE FIX: Disable RLS dan rely on API-level authorization
-- Ini lebih aman karena semua akses via API routes yang sudah ada NextAuth check

-- Disable RLS (API routes akan handle authorization)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE travel_dates DISABLE ROW LEVEL SECURITY;
ALTER TABLE participants DISABLE ROW LEVEL SECURITY;

-- Clean up old policies
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own data" ON users;
DROP POLICY IF EXISTS "Anyone can view travel dates" ON travel_dates;
DROP POLICY IF EXISTS "Only admins can manage travel dates" ON travel_dates;
DROP POLICY IF EXISTS "Anyone can create travel dates" ON travel_dates;
DROP POLICY IF EXISTS "Only admins can update/delete travel dates" ON travel_dates;
DROP POLICY IF EXISTS "Only admins can delete travel dates" ON travel_dates;
DROP POLICY IF EXISTS "Anyone can view participants" ON participants;
DROP POLICY IF EXISTS "Users can create their own registrations" ON participants;
DROP POLICY IF EXISTS "Anyone can create registrations" ON participants;
DROP POLICY IF EXISTS "Users can update their own registrations" ON participants;
DROP POLICY IF EXISTS "Users can delete their own registrations" ON participants;
DROP POLICY IF EXISTS "Admins can manage all participants" ON participants;
DROP POLICY IF EXISTS "Admins can update all participants" ON participants;
DROP POLICY IF EXISTS "Admins can delete all participants" ON participants;
