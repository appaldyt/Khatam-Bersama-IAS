import { useEffect, useMemo, useState } from 'react';
import { UserPlus, AlertCircle } from 'lucide-react';
import type { Group, JuzPart } from '../lib/supabase';

interface JoinFormProps {
  groups: Group[];
  parts: JuzPart[];
  onSubmit: (
    entityName: string,
    nik: string,
    name: string,
    jobTitle: string,
    whatsappNumber: string,
    groupId: string,
    juzNumber: number,
    partId: string,
  ) => Promise<void>;
  preselectedJuz?: number;
  preselectedGroup?: string;
  preselectedPartId?: string;
}

export default function JoinForm({
  groups,
  parts,
  onSubmit,
  preselectedJuz,
  preselectedGroup,
  preselectedPartId,
}: JoinFormProps) {
  const entityOptions = [
    'PT Integrasi Aviasi Solusi',
    'PT Gapura Angkasa',
    'PT IAS Hospitality',
    'PT IAS Support',
    'PT IAS Property',
    'PT Angkasa Pura Suport',
  ];
  const iasEntityName = 'PT Integrasi Aviasi Solusi';

  const [entityName, setEntityName] = useState(entityOptions[0]);
  const [nik, setNik] = useState('');
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [groupId, setGroupId] = useState(preselectedGroup || groups[0]?.id || '');
  const [juzNumber, setJuzNumber] = useState(preselectedJuz || 1);
  const [partId, setPartId] = useState(preselectedPartId || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const isIasEntity = entityName === iasEntityName;
  const entitasGroupId = groups.find((group) => group.name === 'Entitas')?.id;

  const partsByJuz = useMemo(() => {
    return parts
      .filter((part) => part.juz_number === juzNumber)
      .sort((a, b) => a.part_number - b.part_number);
  }, [parts, juzNumber]);

  useEffect(() => {
    if (!groupId && groups[0]?.id) {
      setGroupId(groups[0].id);
    }
  }, [groupId, groups]);

  useEffect(() => {
    if (preselectedJuz) {
      setJuzNumber(preselectedJuz);
    }
  }, [preselectedJuz]);

  useEffect(() => {
    if (preselectedGroup) {
      setGroupId(preselectedGroup);
    }
  }, [preselectedGroup]);

  useEffect(() => {
    if (preselectedPartId) {
      setPartId(preselectedPartId);
    }
  }, [preselectedPartId]);

  useEffect(() => {
    if (isIasEntity) {
      setNik((prevNik) => prevNik.replace(/\D/g, '').slice(0, 9));
    }
  }, [isIasEntity]);

  useEffect(() => {
    if (!isIasEntity && entitasGroupId) {
      setGroupId(entitasGroupId);
    }
  }, [isIasEntity, entitasGroupId]);

  useEffect(() => {
    if (partsByJuz.length === 0) {
      setPartId('');
      return;
    }

    const isCurrentPartValid = partsByJuz.some((part) => part.id === partId);
    if (!isCurrentPartValid) {
      setPartId(partsByJuz[0].id);
    }
  }, [partsByJuz, partId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!entityName || !nik || !name || !jobTitle || !whatsappNumber || !groupId || !partId) {
      setError('Harap isi semua field');
      return;
    }

    if (isIasEntity) {
      if (!/^\d+$/.test(nik)) {
        setError('NIK untuk PT Integrasi Aviasi Solusi harus berupa angka');
        return;
      }

      if (nik.length > 9) {
        setError('NIK untuk PT Integrasi Aviasi Solusi maksimal 9 digit');
        return;
      }
    }

    if (whatsappNumber.length < 10) {
      setError('Nomor WhatsApp minimal 10 digit');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(
        entityName,
        nik,
        name,
        jobTitle,
        whatsappNumber,
        groupId,
        juzNumber,
        partId
      );
      setSuccess(true);
      setEntityName(entityOptions[0]);
      setNik('');
      setName('');
      setJobTitle('');
      setWhatsappNumber('');
      setJuzNumber(1);
      const firstPartInFirstJuz = parts
        .filter((part) => part.juz_number === 1)
        .sort((a, b) => a.part_number - b.part_number)[0];
      setPartId(firstPartInFirstJuz?.id || '');
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
            Bergabung & Klaim Part Juz
          </h2>
          <p className="text-gray-600">
            Isi form di bawah untuk mendaftar dan klaim juz Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-8 shadow-lg">
          <div className="space-y-6">
            <div>
              <label htmlFor="entity" className="block text-sm font-semibold text-gray-700 mb-2">
                Entitas
              </label>
              <select
                id="entity"
                value={entityName}
                onChange={(e) => setEntityName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                {entityOptions.map((entity) => (
                  <option key={entity} value={entity}>
                    {entity}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="nik" className="block text-sm font-semibold text-gray-700 mb-2">
                NIK Karyawan
              </label>
              <input
                type="text"
                id="nik"
                value={nik}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (isIasEntity) {
                    setNik(nextValue.replace(/\D/g, '').slice(0, 9));
                    return;
                  }
                  setNik(nextValue.slice(0, 50));
                }}
                placeholder={isIasEntity ? 'Contoh: 123456789' : 'Contoh: IAS-EMP-00123'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength={isIasEntity ? 9 : 50}
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
              <label htmlFor="whatsappNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                Nomor WhatsApp
              </label>
              <input
                type="text"
                id="whatsappNumber"
                value={whatsappNumber}
                onChange={(e) =>
                  setWhatsappNumber(e.target.value.replace(/\D/g, '').slice(0, 15))
                }
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                maxLength={15}
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
                disabled={!isIasEntity}
              >
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              {!isIasEntity && (
                <p className="text-xs text-gray-500 mt-2">
                  Untuk entitas selain PT Integrasi Aviasi Solusi, kelompok otomatis ke Entitas.
                </p>
              )}
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

            <div>
              <label htmlFor="part" className="block text-sm font-semibold text-gray-700 mb-2">
                Pilih Part
              </label>
              <select
                id="part"
                value={partId}
                onChange={(e) => setPartId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                disabled={partsByJuz.length === 0}
              >
                {partsByJuz.map((part) => (
                  <option key={part.id} value={part.id}>
                    Part {part.part_number} - {part.part_label}
                  </option>
                ))}
              </select>
              {partsByJuz.length === 0 && (
                <p className="text-xs text-red-600 mt-2">
                  Part untuk juz ini belum tersedia di database.
                </p>
              )}
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
