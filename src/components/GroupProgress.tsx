import { useMemo, useState } from 'react';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { Claim, Group, JuzPart } from '../lib/supabase';

interface GroupProgressProps {
  groups: Group[];
  claims: Claim[];
  parts: JuzPart[];
  activeCampaignId?: string;
  selectedGroup?: string;
  onSelectedGroupChange: (groupId: string) => void;
  onPartClick: (juzNumber: number, groupId: string, partId: string) => void;
}

export default function GroupProgress({
  groups,
  claims,
  parts,
  activeCampaignId,
  selectedGroup,
  onSelectedGroupChange,
  onPartClick,
}: GroupProgressProps) {
  const activeGroupId = selectedGroup || groups[0]?.id || '';
  const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

  const activeClaims = useMemo(() => {
    if (!activeCampaignId) {
      return claims;
    }
    return claims.filter((claim) => claim.campaign_id === activeCampaignId);
  }, [claims, activeCampaignId]);

  const partMapByJuz = useMemo(() => {
    const map = new Map<number, JuzPart[]>();
    for (const part of parts) {
      const existing = map.get(part.juz_number) || [];
      existing.push(part);
      map.set(part.juz_number, existing);
    }

    for (const [juz, partList] of map.entries()) {
      map.set(
        juz,
        [...partList].sort((a, b) => a.part_number - b.part_number)
      );
    }

    return map;
  }, [parts]);

  const claimMapByPart = useMemo(() => {
    const map = new Map<string, Claim>();
    for (const claim of activeClaims) {
      if (claim.group_id === activeGroupId && claim.part_id) {
        map.set(claim.part_id, claim);
      }
    }
    return map;
  }, [activeClaims, activeGroupId]);

  const selectedGroupData = groups.find((group) => group.id === activeGroupId);

  const claimedJuzCount = useMemo(() => {
    const claimedJuz = new Set<number>();
    for (const claim of activeClaims) {
      if (claim.group_id === activeGroupId) {
        claimedJuz.add(claim.juz_number);
      }
    }
    return claimedJuz.size;
  }, [activeClaims, activeGroupId]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Progress Kelompok
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Pilih kelompok untuk melihat detail progress setiap juz dan part
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
                  {claimedJuzCount}/30
                </p>
                <p className="text-sm text-gray-600">Juz Sudah Terisi</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {Array.from({ length: 30 }, (_, index) => index + 1).map((juzNumber) => {
            const partOptions = partMapByJuz.get(juzNumber) || [];
            const claimedPartCount = partOptions.filter((part) =>
              claimMapByPart.has(part.id)
            ).length;
            const totalParts = partOptions.length;
            const isExpanded = expandedJuz === juzNumber;
            const latestClaim = activeClaims
              .filter(
                (claim) =>
                  claim.group_id === activeGroupId && claim.juz_number === juzNumber
              )
              .sort(
                (a, b) =>
                  new Date(b.claimed_at).getTime() - new Date(a.claimed_at).getTime()
              )[0];

            let statusText = 'Belum ada part';
            if (totalParts > 0 && claimedPartCount === 0) {
              statusText = 'Tersedia';
            } else if (totalParts > 0 && claimedPartCount === totalParts) {
              statusText = 'Penuh';
            } else if (totalParts > 0) {
              statusText = `${claimedPartCount}/${totalParts} Part`;
            }

            return (
              <div
                key={juzNumber}
                className={`relative rounded-lg p-4 transition-all border-2 ${
                  claimedPartCount > 0
                    ? 'bg-emerald-50 border-emerald-400'
                    : 'bg-white border-gray-200 hover:border-teal-500'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-800">
                    Juz {juzNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedJuz((prev) => (prev === juzNumber ? null : juzNumber))
                    }
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={`Toggle detail Juz ${juzNumber}`}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="mb-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      statusText === 'Penuh'
                        ? 'bg-emerald-200 text-emerald-800'
                        : statusText === 'Tersedia'
                        ? 'bg-gray-100 text-gray-600'
                        : statusText === 'Belum ada part'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-teal-100 text-teal-700'
                    }`}
                  >
                    {statusText}
                  </span>
                </div>

                {latestClaim ? (
                  <p className="text-xs text-gray-600">
                    Klaim terakhir: {formatTime(latestClaim.claimed_at)}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">Belum ada klaim</p>
                )}

                {isExpanded && (
                  <div className="mt-4 border-t border-gray-200 pt-3 space-y-2">
                    {partOptions.length === 0 ? (
                      <p className="text-xs text-red-600">
                        Data part untuk juz ini belum tersedia.
                      </p>
                    ) : (
                      partOptions.map((part) => {
                        const partClaim = claimMapByPart.get(part.id);
                        return (
                          <div
                            key={part.id}
                            className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-white px-3 py-2"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-gray-700 truncate">
                                Part {part.part_number} - {part.part_label}
                              </p>
                              {partClaim ? (
                                <p className="text-xs text-emerald-700 truncate">
                                  {partClaim.participants?.name || 'Peserta'} - {formatTime(partClaim.claimed_at)}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-500">Tersedia</p>
                              )}
                            </div>
                            {partClaim ? (
                              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            ) : (
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onPartClick(juzNumber, activeGroupId, part.id);
                                }}
                                className="text-xs px-2 py-1 rounded-md bg-teal-600 text-white hover:bg-teal-700 flex-shrink-0"
                              >
                                Klaim
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
