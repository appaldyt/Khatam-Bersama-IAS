import { useState } from 'react';
import type { Claim, Group } from '../lib/supabase';

interface ParticipantsListProps {
  claims: Claim[];
  groups: Group[];
  activeCampaignId?: string;
}

const FALLBACK_ADMIN_USER = 'admin';
const FALLBACK_ADMIN_PASS = 'masadi123';

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

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const adminUser =
    (import.meta.env.VITE_ADMIN_DOWNLOAD_USER || FALLBACK_ADMIN_USER).trim();
  const adminPassword =
    (import.meta.env.VITE_ADMIN_DOWNLOAD_PASS || FALLBACK_ADMIN_PASS).trim();

  const toCsvCell = (value: string) => {
    const escaped = value.replace(/"/g, '""');
    return `"${escaped}"`;
  };

  const buildCsv = () => {
    const header = [
      'Nama',
      'Jabatan',
      'NIK',
      'Kelompok',
      'Juz',
      'Part',
      'Waktu Klaim',
    ];

    const rows = displayedClaims.map((claim) => {
      const groupName = groups.find((group) => group.id === claim.group_id)?.name || '-';
      const partText = claim.juz_parts
        ? `Part ${claim.juz_parts.part_number} - ${claim.juz_parts.part_label}`
        : '-';

      return [
        claim.participants?.name || '-',
        claim.participants?.job_title || '-',
        claim.participants?.nik || '-',
        groupName,
        `Juz ${claim.juz_number}`,
        partText,
        formatTime(claim.claimed_at),
      ];
    });

    return [header, ...rows]
      .map((row) => row.map((cell) => toCsvCell(String(cell))).join(','))
      .join('\n');
  };

  const handleAdminLogin = () => {
    const username = window.prompt('Username admin:');
    if (!username) {
      return;
    }

    const password = window.prompt('Password admin:');
    if (!password) {
      return;
    }

    if (username !== adminUser || password !== adminPassword) {
      window.alert('Username atau password admin salah.');
      return;
    }

    setIsAdminLoggedIn(true);
    window.alert('Login admin berhasil.');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const downloadCsv = () => {
    if (!isAdminLoggedIn) {
      window.alert('Silakan login admin terlebih dahulu untuk download CSV.');
      return;
    }

    if (displayedClaims.length === 0) {
      window.alert('Belum ada data peserta untuk diunduh.');
      return;
    }

    const csv = buildCsv();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const fileDate = new Date().toISOString().slice(0, 10);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `daftar-peserta-${fileDate}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="py-16 px-4 bg-white" id="participants">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-4xl font-bold text-gray-800">
            Daftar Peserta
          </h2>
          <div className="flex flex-wrap gap-2">
            {isAdminLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={downloadCsv}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
                >
                  Download CSV
                </button>
                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Logout Admin
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleAdminLogin}
                className="bg-slate-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
              >
                Login Admin
              </button>
            )}
          </div>
        </div>
        <p className="text-center text-gray-600 mb-8">
          Peserta yang sudah mengikuti dan mengklaim part bacaan
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
                  <th className="px-4 py-3 text-left font-semibold">Part</th>
                  <th className="px-4 py-3 text-left font-semibold">Waktu Klaim</th>
                </tr>
              </thead>
              <tbody>
                {displayedClaims.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                      Belum ada peserta yang klaim part.
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
                          {claim.juz_parts
                            ? `Part ${claim.juz_parts.part_number} - ${claim.juz_parts.part_label}`
                            : '-'}
                        </td>
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
