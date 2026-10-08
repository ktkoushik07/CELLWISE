-- CELLWISE EV Battery Circularity & Second-Life Decision Platform Schema

CREATE TYPE user_role AS ENUM ('refurbisher', 'second_life', 'recycler', 'admin');
CREATE TYPE chemistry_type AS ENUM ('LFP', 'NMC');
CREATE TYPE pathway_recommendation AS ENUM ('REUSE', 'SECOND-LIFE', 'FURTHER TESTING', 'RECYCLING');
CREATE TYPE thermal_condition AS ENUM ('Normal', 'Elevated', 'Critical');
CREATE TYPE recycling_status AS ENUM ('Identified', 'Collection', 'Received', 'Processing', 'Completed');
CREATE TYPE request_status AS ENUM ('Pending', 'Under Review', 'Approved', 'Rejected', 'Completed');

-- 1. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  organization TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Batteries Table
CREATE TABLE batteries (
  id TEXT PRIMARY KEY, -- e.g. EVB-2048
  serial_number TEXT UNIQUE NOT NULL,
  manufacturer TEXT NOT NULL,
  ev_model TEXT NOT NULL,
  chemistry chemistry_type NOT NULL,
  manufacturing_year INT NOT NULL,
  rated_capacity_ah NUMERIC NOT NULL,
  current_capacity_ah NUMERIC NOT NULL,
  nominal_voltage_v NUMERIC NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Assessment',
  latest_score INT NOT NULL,
  latest_recommendation pathway_recommendation NOT NULL,
  recycling_status recycling_status,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Assessments Table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_id TEXT REFERENCES batteries(id) ON DELETE CASCADE,
  assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  technician_name TEXT NOT NULL,
  
  -- Electrical Data
  rated_capacity_ah NUMERIC NOT NULL,
  measured_capacity_ah NUMERIC NOT NULL,
  voltage_v NUMERIC NOT NULL,
  current_a NUMERIC NOT NULL,
  internal_resistance_momega NUMERIC NOT NULL,
  voltage_drop_v NUMERIC NOT NULL,
  recovery_time_sec NUMERIC NOT NULL,
  
  -- Thermal Data
  operating_temp_c NUMERIC NOT NULL,
  temp_rise_c NUMERIC NOT NULL,
  thermal_condition thermal_condition NOT NULL,
  
  -- Usage Data
  age_years INT NOT NULL,
  cycle_count INT NOT NULL,
  previous_application TEXT,
  known_damage BOOLEAN DEFAULT FALSE,
  damage_description TEXT,

  -- Calculated Metrics
  capacity_retention_percent NUMERIC NOT NULL,
  electrical_score INT NOT NULL,
  thermal_score INT NOT NULL,
  usage_score INT NOT NULL,
  circularity_score INT NOT NULL,
  recommendation pathway_recommendation NOT NULL,
  
  -- Application Suitability JSON
  application_compatibility JSONB,
  reasoning JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Lifecycle History Table
CREATE TABLE lifecycle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_id TEXT REFERENCES batteries(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  stage TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  location TEXT
);

-- 5. Second-Life Requests Table
CREATE TABLE second_life_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battery_id TEXT REFERENCES batteries(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES users(id),
  provider_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  target_application TEXT NOT NULL,
  delivery_location TEXT NOT NULL,
  notes TEXT,
  status request_status DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target_role user_role,
  read BOOLEAN DEFAULT FALSE,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & Security Rules
ALTER TABLE batteries ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE second_life_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read for all batteries" ON batteries FOR SELECT USING (true);
