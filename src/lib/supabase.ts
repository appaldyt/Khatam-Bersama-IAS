import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Campaign = {
  id: string;
  name: string;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
};

export type Group = {
  id: string;
  name: string;
  created_at: string;
};

export type Participant = {
  id: string;
  entity_name: string | null;
  nik: string;
  name: string;
  job_title: string | null;
  whatsapp_number: string | null;
  created_at: string;
};

export type JuzPart = {
  id: string;
  juz_number: number;
  part_number: number;
  part_label: string;
  created_at: string;
};

export type Claim = {
  id: string;
  campaign_id: string;
  group_id: string;
  participant_id: string;
  juz_number: number;
  part_id: string;
  claimed_at: string;
  participants?: Participant;
  juz_parts?: JuzPart;
};
