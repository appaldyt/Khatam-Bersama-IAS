-- Allow one participant to claim multiple parts in the same juz and group.
ALTER TABLE claims
DROP CONSTRAINT IF EXISTS claims_campaign_group_participant_juz_unique;
