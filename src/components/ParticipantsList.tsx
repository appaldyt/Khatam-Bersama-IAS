import type { Claim, Group } from '../lib/supabase';

interface ParticipantsListProps {
  claims: Claim[];
  groups: Group[];
  activeCampaignId?: string;
}

function maskNik(nik?: string) {
  if (!nik) return '-';
  if (nik.length <= 4) return nik;
  return `${nik.slice(0, 2)}****${nik.slice(-2)}`;
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ParticipantsList({
  claims,
  groups,
  activeCampaignId,
}: ParticipantsListProps) {
  const displayedClaims = activeCampaignId
    ? claims.filter((claim) => claim.campaign_id === activeCampaignId)
    : claims;

  return (
    <section className="py-16 px-4 bg-white" id="participants">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Daftar Peserta
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Peserta yang sudah mengikuti dan mengklaim juz
        </p>

        <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nama</th>
                  <th className="px-4 py-3 text-left font-semibold">Jabatan</th>
                  <th className="px-4 py-3 text-left font-semibold">NIK</th>
                  <th className="px-4 py-3 text-left font-semibold">Kelompok</th>
                  <th className="px-4 py-3 text-left font-semibold">Juz</th>
                  <th className="px-4 py-3 text-left font-semibold">Waktu Klaim</th>
                </tr>
              </thead>
              <tbody>
                {displayedClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                      Belum ada peserta yang klaim juz.
                    </td>
                  </tr>
                ) : (
                  displayedClaims.map((claim) => {
                    const groupName =
                      groups.find((group) => group.id === claim.group_id)?.name || '-';
                    return (
                      <tr key={claim.id} className="border-t border-gray-200">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {claim.participants?.name || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {claim.participants?.job_title || '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-700">
                          {maskNik(claim.participants?.nik)}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{groupName}</td>
                        <td className="px-4 py-3 text-gray-700">Juz {claim.juz_number}</td>
                        <td className="px-4 py-3 text-gray-700">
                          {formatTime(claim.claimed_at)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
