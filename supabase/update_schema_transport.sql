-- Migration script untuk menambahkan fitur Bus dan Kota Asal/Tujuan

-- Tambah kolom baru (sementara nullable)
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS transportation_type TEXT DEFAULT 'flight' CHECK (transportation_type IN ('flight', 'bus')),
ADD COLUMN IF NOT EXISTS origin_city TEXT,
ADD COLUMN IF NOT EXISTS destination_city TEXT,
ADD COLUMN IF NOT EXISTS bus_company TEXT,
ADD COLUMN IF NOT EXISTS bus_ticket_type TEXT,
ADD COLUMN IF NOT EXISTS bus_departure_time TIME;

-- Rename kolom lama untuk pesawat (jika belum di-rename)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns 
             WHERE table_name = 'participants' AND column_name = 'departure_time') THEN
    ALTER TABLE participants RENAME COLUMN departure_time TO flight_departure_time;
  END IF;
END $$;

-- Set default values untuk semua data yang sudah ada
UPDATE participants
SET 
  transportation_type = COALESCE(transportation_type, 'flight'),
  origin_city = COALESCE(origin_city, 'Jakarta'),
  destination_city = COALESCE(destination_city, 'Bandung')
WHERE origin_city IS NULL OR destination_city IS NULL;

-- Setelah migration, buat kolom origin_city dan destination_city NOT NULL
ALTER TABLE participants
ALTER COLUMN origin_city SET NOT NULL,
ALTER COLUMN destination_city SET NOT NULL;

-- Update constraint agar flight fields tidak wajib diisi
ALTER TABLE participants
ALTER COLUMN flight DROP NOT NULL,
ALTER COLUMN flight_code DROP NOT NULL;
