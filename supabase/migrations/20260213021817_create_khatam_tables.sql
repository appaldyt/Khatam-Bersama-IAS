/*
  # Khatam Bersama IAS Database Schema

  1. New Tables
    - `campaigns`
      - `id` (uuid, primary key)
      - `name` (text) - Campaign name
      - `start_date` (timestamptz) - Campaign start date
      - `end_date` (timestamptz) - Campaign end date
      - `is_active` (boolean) - Whether campaign is active
      - `created_at` (timestamptz)
    
    - `groups`
      - `id` (uuid, primary key)
      - `name` (text) - Group name (e.g., Kantor Pusat, Regional 1)
      - `created_at` (timestamptz)
    
    - `participants`
      - `id` (uuid, primary key)
      - `nik` (text) - National ID number
      - `name` (text) - Participant name
      - `created_at` (timestamptz)
    
    - `claims`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, foreign key to campaigns)
      - `group_id` (uuid, foreign key to groups)
      - `participant_id` (uuid, foreign key to participants)
      - `juz_number` (integer) - Juz number (1-30)
      - `claimed_at` (timestamptz)
      - Unique constraint on (campaign_id, group_id, juz_number)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated insert (for future admin features)
*/

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nik text UNIQUE NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  participant_id uuid NOT NULL REFERENCES participants(id) ON DELETE CASCADE,
  juz_number integer NOT NULL CHECK (juz_number >= 1 AND juz_number <= 30),
  claimed_at timestamptz DEFAULT now(),
  UNIQUE(campaign_id, group_id, juz_number)
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Campaigns policies (public read)
CREATE POLICY "Anyone can view campaigns"
  ON campaigns FOR SELECT
  USING (true);

-- Groups policies (public read)
CREATE POLICY "Anyone can view groups"
  ON groups FOR SELECT
  USING (true);

-- Participants policies (public read)
CREATE POLICY "Anyone can view participants"
  ON participants FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert participants"
  ON participants FOR INSERT
  WITH CHECK (true);

-- Claims policies (public read and insert)
CREATE POLICY "Anyone can view claims"
  ON claims FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert claims"
  ON claims FOR INSERT
  WITH CHECK (true);

-- Insert default groups
INSERT INTO groups (name) VALUES 
  ('Kantor Pusat'),
  ('Regional 1'),
  ('Regional 2'),
  ('Regional 3'),
  ('Regional 4')
ON CONFLICT DO NOTHING;

-- Insert default active campaign
INSERT INTO campaigns (name, is_active) VALUES 
  ('Khatam Ramadan 2026', true)
ON CONFLICT DO NOTHING;