-- Add participant entity field
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS entity_name text;
