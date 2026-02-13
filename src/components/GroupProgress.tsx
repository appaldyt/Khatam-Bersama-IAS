import { Check, Clock } from 'lucide-react';
import type { Group, Claim } from '../lib/supabase';

interface GroupProgressProps {
  groups: Group[];
  claims: Claim[];
  selectedGroup?: string;
  onSelectedGroupChange: (groupId: string) => void;
  onJuzClick: (juzNumber: number, groupId: string) => void;
}

export default function GroupProgress({
  groups,
  claims,
  selectedGroup,
  onSelectedGroupChange,
  onJuzClick,
}: GroupProgressProps) {
  const activeGroupId = selectedGroup || groups[0]?.id || '';

  const getJuzStatus = (juzNumber: number, groupId: string) => {
    return claims.find(
      (claim) => claim.juz_number === juzNumber && claim.group_id === groupId
    );
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const selectedGroupData = groups.find((g) => g.id === activeGroupId);
  const claimedInGroup = claims.filter((c) => c.group_id === activeGroupId).length;

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Progress Kelompok
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Pilih kelompok untuk melihat detail progress setiap juz
        </p>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectedGroupChange(group.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeGroupId === group.id
                  ? 'bg-teal-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {group.name}
            </button>
          ))}
        </div>

        {selectedGroupData && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-800">
                {selectedGroupData.name}
              </h3>
              <div className="text-right">
                <p className="text-3xl font-bold text-teal-600">
                  {claimedInGroup}/30
                </p>
                <p className="text-sm text-gray-600">Juz Diklaim</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((juzNumber) => {
            const claim = getJuzStatus(juzNumber, activeGroupId);
            const isClaimed = !!claim;

            return (
              <div
                key={juzNumber}
                onClick={() => !isClaimed && onJuzClick(juzNumber, activeGroupId)}
                className={`relative rounded-lg p-4 transition-all ${
                  isClaimed
                    ? 'bg-emerald-100 border-2 border-emerald-500 cursor-default'
                    : 'bg-white border-2 border-gray-200 hover:border-teal-500 hover:shadow-md cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-800">
                    Juz {juzNumber}
                  </span>
                  {isClaimed ? (
                    <Check className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                {isClaimed && claim ? (
                  <div className="text-xs">
                    <p className="font-semibold text-emerald-700 truncate">
                      {claim.participants?.name || 'Peserta'}
                    </p>
                    <p className="text-gray-600 mt-1">
                      {formatTime(claim.claimed_at)}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Tersedia</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
