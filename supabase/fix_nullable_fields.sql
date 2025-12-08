-- Fix nullable fields for transportation type flexibility
-- Run this in Supabase SQL Editor

-- Make flight-related fields nullable (for when user selects bus)
ALTER TABLE participants 
ALTER COLUMN flight DROP NOT NULL,
ALTER COLUMN flight_code DROP NOT NULL,
ALTER COLUMN flight_departure_time DROP NOT NULL;

-- Make bus-related fields nullable (for when user selects flight)
ALTER TABLE participants 
ALTER COLUMN bus_company DROP NOT NULL,
ALTER COLUMN bus_ticket_type DROP NOT NULL,
ALTER COLUMN bus_departure_time DROP NOT NULL;

-- Verify the changes
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'participants' 
AND column_name IN ('flight', 'flight_code', 'flight_departure_time', 'bus_company', 'bus_ticket_type', 'bus_departure_time');
