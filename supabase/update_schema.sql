-- Update participants table schema: remove pickup_location, add flight_code and departure_time
ALTER TABLE participants DROP COLUMN IF EXISTS pickup_location;
ALTER TABLE participants ADD COLUMN IF NOT EXISTS flight_code TEXT NOT NULL DEFAULT '';
ALTER TABLE participants ADD COLUMN IF NOT EXISTS departure_time TIME NOT NULL DEFAULT '00:00';

-- Remove default values after adding columns
ALTER TABLE participants ALTER COLUMN flight_code DROP DEFAULT;
ALTER TABLE participants ALTER COLUMN departure_time DROP DEFAULT;
