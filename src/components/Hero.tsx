import { BookOpen } from 'lucide-react';

interface HeroProps {
  onStartClick: () => void;
  onProgressClick: () => void;
  onParticipantsClick: () => void;
}

export default function Hero({
  onStartClick,
  onProgressClick,
  onParticipantsClick,
}: HeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full">
            <BookOpen className="w-16 h-16" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Khatam Bersama IAS
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-emerald-50 max-w-2xl mx-auto">
          Mari bersama-sama mengkhatamkan Al-Quran 30 Juz dalam satu kampanye.
          Pilih juz Anda dan bergabunglah dalam kebaikan bersama.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onStartClick}
            className="bg-white text-teal-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105 shadow-lg"
          >
            Mulai Sekarang
          </button>
          <button
            onClick={onProgressClick}
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
          >
            Lihat Progress
          </button>
          <button
            onClick={onParticipantsClick}
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all"
          >
            Daftar Peserta
          </button>
        </div>
      </div>
    </section>
  );
}
