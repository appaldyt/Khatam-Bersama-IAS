-- Add participant WhatsApp number field
ALTER TABLE participants
ADD COLUMN IF NOT EXISTS whatsapp_number text;
