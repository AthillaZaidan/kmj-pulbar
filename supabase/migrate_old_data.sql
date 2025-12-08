-- Migrate old participant data to new schema
-- This script updates old records to have the new required fields

-- Update old records that have flight info but no transportation_type
UPDATE participants
SET 
  transportation_type = 'flight',
  origin_city = 'Jakarta',  -- Default value, update as needed
  destination_city = 'Bandung',  -- Default value, update as needed
  flight_code = COALESCE(flight_code, 'N/A'),
  flight_departure_time = COALESCE(flight_departure_time, '00:00')
WHERE transportation_type IS NULL 
  AND flight IS NOT NULL;

-- Check the results
SELECT id, name, transportation_type, flight, bus_company, origin_city, destination_city 
FROM participants 
ORDER BY created_at DESC 
LIMIT 10;
