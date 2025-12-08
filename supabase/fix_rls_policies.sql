-- DROP existing policies
DROP POLICY IF EXISTS "Only admins can manage travel dates" ON travel_dates;
DROP POLICY IF EXISTS "Users can create their own registrations" ON participants;
DROP POLICY IF EXISTS "Users can update their own registrations" ON participants;
DROP POLICY IF EXISTS "Users can delete their own registrations" ON participants;
DROP POLICY IF EXISTS "Admins can manage all participants" ON participants;

-- NEW: Allow anyone to create travel dates (will be auto-created when first participant registers)
CREATE POLICY "Anyone can create travel dates"
  ON travel_dates FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Only admins can update/delete travel dates"
  ON travel_dates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = current_user 
      AND role = 'admin'
    )
  );

CREATE POLICY "Only admins can delete travel dates"
  ON travel_dates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = current_user 
      AND role = 'admin'
    )
  );

-- NEW: Participants policies - using auth.uid() instead of current_setting
CREATE POLICY "Anyone can create registrations"
  ON participants FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own registrations"
  ON participants FOR UPDATE
  USING (
    user_id IN (
      SELECT id FROM users WHERE email = current_user
    )
  );

CREATE POLICY "Users can delete their own registrations"
  ON participants FOR DELETE
  USING (
    user_id IN (
      SELECT id FROM users WHERE email = current_user
    )
  );

CREATE POLICY "Admins can update all participants"
  ON participants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = current_user 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete all participants"
  ON participants FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE email = current_user 
      AND role = 'admin'
    )
  );
