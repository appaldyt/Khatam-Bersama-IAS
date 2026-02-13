import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import type { Campaign, Group, Claim, JuzPart } from './lib/supabase';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import ProgressCampaign from './components/ProgressCampaign';
import GroupProgress from './components/GroupProgress';
import JoinForm from './components/JoinForm';
import ParticipantsList from './components/ParticipantsList';
import RulesAndFAQ from './components/RulesAndFAQ';
import Footer from './components/Footer';

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [parts, setParts] = useState<JuzPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJuz, setSelectedJuz] = useState<number | undefined>();
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();
  const [selectedPartId, setSelectedPartId] = useState<string | undefined>();

  const activeCampaign = campaigns.find((c) => c.is_active);
  const totalJuz = 30;
  const activeGroupId = selectedGroupId || groups[0]?.id;
  const selectedGroupName = groups.find((group) => group.id === activeGroupId)?.name;
  const activeCampaignClaims = activeCampaign
    ? claims.filter((claim) => claim.campaign_id === activeCampaign.id)
    : claims;
  const claimsInActiveGroup = activeGroupId
    ? activeCampaignClaims.filter((claim) => claim.group_id === activeGroupId)
    : [];
  const uniqueClaimedJuz = new Set(claimsInActiveGroup.map((claim) => claim.juz_number)).size;

  useEffect(() => {
    fetchData();
    const channel = supabase
      .channel('claims-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'claims' },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [campaignsRes, groupsRes, claimsRes, partsRes] = await Promise.all([
        supabase.from('campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('groups').select('*').order('name'),
        supabase
          .from('claims')
          .select('*, participants(*), juz_parts(*)')
          .order('claimed_at', { ascending: false }),
        supabase
          .from('juz_parts')
          .select('*')
          .order('juz_number')
          .order('part_number'),
      ]);

      if (campaignsRes.data) setCampaigns(campaignsRes.data);
      if (groupsRes.data) setGroups(groupsRes.data);
      if (claimsRes.data) setClaims(claimsRes.data);
      if (partsRes.data) setParts(partsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handlePartClick = (juzNumber: number, groupId: string, partId: string) => {
    setSelectedJuz(juzNumber);
    setSelectedGroupId(groupId);
    setSelectedPartId(partId);
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClaimSubmit = async (
    nik: string,
    name: string,
    jobTitle: string,
    groupId: string,
    juzNumber: number,
    partId: string
  ) => {
    if (!activeCampaign) {
      throw new Error('Tidak ada kampanye aktif');
    }

    const selectedPart = parts.find((part) => part.id === partId);
    if (!selectedPart) {
      throw new Error('Part tidak ditemukan');
    }

    if (selectedPart.juz_number !== juzNumber) {
      throw new Error('Part tidak sesuai dengan juz yang dipilih');
    }

    const existingClaimInGroup = activeCampaignClaims.find(
      (c) =>
        c.campaign_id === activeCampaign.id &&
        c.group_id === groupId &&
        c.part_id === partId
    );

    if (existingClaimInGroup) {
      throw new Error('Part ini sudah diklaim di kelompok ini');
    }

    const participant = await supabase
      .from('participants')
      .select('*')
      .eq('nik', nik)
      .maybeSingle();

    if (participant.error && participant.error.code !== 'PGRST116') {
      throw new Error('Gagal memeriksa peserta');
    }

    let participantId: string;

    if (!participant.data) {
      const { data: newParticipant, error: insertError } = await supabase
        .from('participants')
        .insert({ nik, name, job_title: jobTitle })
        .select()
        .single();

      if (insertError) {
        throw new Error('Gagal mendaftarkan peserta: ' + insertError.message);
      }

      participantId = newParticipant.id;
    } else {
      participantId = participant.data.id;

      const existingUserClaim = activeCampaignClaims.find(
        (c) =>
          c.campaign_id === activeCampaign.id &&
          c.group_id === groupId &&
          c.participant_id === participantId &&
          c.juz_number === juzNumber
      );

      if (existingUserClaim) {
        throw new Error('Anda sudah mengklaim 1 part di juz ini untuk kelompok tersebut');
      }
    }

    const { error: claimError } = await supabase.from('claims').insert({
      campaign_id: activeCampaign.id,
      group_id: groupId,
      participant_id: participantId,
      juz_number: juzNumber,
      part_id: partId,
    });

    if (claimError) {
      if (claimError.code === '23505') {
        throw new Error('Part ini sudah diklaim atau Anda sudah mengambil part pada juz ini');
      }
      throw new Error('Gagal mengklaim part: ' + claimError.message);
    }

    await fetchData();
  };

  const scrollToProgress = () => {
    document.getElementById('progress')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToJoin = () => {
    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToParticipants = () => {
    document.getElementById('participants')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Hero
        onStartClick={scrollToJoin}
        onProgressClick={scrollToProgress}
        onParticipantsClick={scrollToParticipants}
      />
      <HowItWorks />
      <ProgressCampaign
        totalClaimed={uniqueClaimedJuz}
        totalJuz={totalJuz}
        groupName={selectedGroupName}
      />
      <GroupProgress
        groups={groups}
        claims={activeCampaignClaims}
        parts={parts}
        activeCampaignId={activeCampaign?.id}
        selectedGroup={activeGroupId}
        onSelectedGroupChange={setSelectedGroupId}
        onPartClick={handlePartClick}
      />
      <JoinForm
        groups={groups}
        parts={parts}
        onSubmit={handleClaimSubmit}
        preselectedJuz={selectedJuz}
        preselectedGroup={selectedGroupId}
        preselectedPartId={selectedPartId}
      />
      <ParticipantsList
        claims={activeCampaignClaims}
        groups={groups}
        activeCampaignId={activeCampaign?.id}
      />
      <RulesAndFAQ />
      <Footer />
    </div>
  );
}

export default App;
