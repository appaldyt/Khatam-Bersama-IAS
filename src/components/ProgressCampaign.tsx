import { TrendingUp } from 'lucide-react';

interface ProgressCampaignProps {
  totalClaimed: number;
  totalTarget: number;
  groupName?: string;
}

export default function ProgressCampaign({
  totalClaimed,
  totalTarget,
  groupName,
}: ProgressCampaignProps) {
  const percentage = totalTarget > 0 ? Math.round((totalClaimed / totalTarget) * 100) : 0;

  return (
    <section className="py-16 px-4 bg-white" id="progress">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Progress Kampanye Aktif
          </h2>
          <p className="text-gray-600">
            {groupName
              ? `Lihat progress klaim Surat/Ayat untuk lokasi kerja ${groupName}`
              : 'Lihat seberapa banyak Surat/Ayat yang telah diklaim dalam kampanye ini'}
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  Total Surat/Ayat Diklaim{groupName ? ` (${groupName})` : ''}
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {totalClaimed} / {totalTarget}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-teal-600">{percentage}%</p>
              <p className="text-sm text-gray-600">Selesai</p>
            </div>
          </div>

          <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <p className="text-center mt-4 text-gray-700 font-medium">
            {Math.max(totalTarget - totalClaimed, 0)} Surat/Ayat lagi untuk menyelesaikan khatam bersama!
          </p>
        </div>
      </div>
    </section>
  );
}
