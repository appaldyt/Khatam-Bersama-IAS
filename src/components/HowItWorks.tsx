import { UserCheck, Users, BookMarked } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: UserCheck,
      title: 'Isi NIK & Nama',
      description: 'Masukkan NIK dan nama lengkap Anda untuk mendaftar sebagai peserta.',
    },
    {
      icon: Users,
      title: 'Pilih Kelompok',
      description: 'Pilih kelompok Anda: Kantor Pusat atau Regional 1-4.',
    },
    {
      icon: BookMarked,
      title: 'Klaim Juz 1-30',
      description: 'Pilih juz yang tersedia dan klaim untuk Anda baca hingga selesai.',
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Cara Mengikuti
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Ikuti 3 langkah mudah untuk bergabung dalam Khatam Bersama IAS
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm font-semibold text-teal-600 mb-2">
                Langkah {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
