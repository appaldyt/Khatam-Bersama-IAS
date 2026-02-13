-- Add job title field for participants
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS job_title text;
