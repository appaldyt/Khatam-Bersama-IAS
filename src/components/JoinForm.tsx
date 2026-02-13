import { useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import type { Group } from '../lib/supabase';

interface JoinFormProps {
  groups: Group[];
  onSubmit: (
    nik: string,
    name: string,
    jobTitle: string,
    groupId: string,
    juzNumber: number
  ) => Promise<void>;
  preselectedJuz?: number;
  preselectedGroup?: string;
}

export default function JoinForm({
  groups,
  onSubmit,
  preselectedJuz,
  preselectedGroup,
}: JoinFormProps) {
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [groupId, setGroupId] = useState(preselectedGroup || groups[0]?.id || '');
  const [juzNumber, setJuzNumber] = useState(preselectedJuz || 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!nik || !name || !jobTitle || !groupId) {
      setError('Harap isi semua field');
      return;
    }

    if (nik.length !== 8) {
      setError('NIK harus 8 digit');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(nik, name, jobTitle, groupId, juzNumber);
      setSuccess(true);
      setNik('');
      setName('');
      setJobTitle('');
      setJuzNumber(1);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-white" id="join">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-4 rounded-full">
              <UserPlus className="w-8 h-8 text-teal-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">
            Bergabung & Klaim Juz
          </h2>
          <p className="text-gray-600">
            Isi form di bawah untuk mendaftar dan klaim juz Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-8 shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="nik" className="block text-sm font-semibold text-gray-700 mb-2">
                NIK (8 digit)
              </label>
              <input
                type="text"
                id="nik"
                value={nik}
                onChange={(e) => setNik(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="Contoh: 12345678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength={8}
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-700 mb-2">
                Nama Jabatan
              </label>
              <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Masukkan nama jabatan"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="group" className="block text-sm font-semibold text-gray-700 mb-2">
                Kelompok
              </label>
              <select
                id="group"
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="juz" className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Juz (1-30)
              </label>
              <select
                id="juz"
                value={juzNumber}
                onChange={(e) => setJuzNumber(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    Juz {num}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-emerald-700 text-sm font-medium">
                  Berhasil! Juz Anda telah diklaim. Selamat membaca!
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Memproses...' : 'Lanjut Klaim Juz'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
