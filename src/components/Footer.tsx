import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-600 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                Khatam Bersama IAS
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Program khatam Al-Quran bersama untuk mempererat ukhuwah dan
              meningkatkan kecintaan kepada Al-Quran di lingkungan IAS.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Kontak</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-teal-500" />
                <span className="text-sm">admin@ias.co.id</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-teal-500" />
                <span className="text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-teal-500" />
                <span className="text-sm">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Link Cepat</h4>
            <div className="space-y-2">
              <a href="#progress" className="block text-sm hover:text-teal-400 transition-colors">
                Lihat Progress
              </a>
              <a href="#join" className="block text-sm hover:text-teal-400 transition-colors">
                Bergabung
              </a>
              <a href="#" className="block text-sm hover:text-teal-400 transition-colors">
                Tentang IAS
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {currentYear} IAS (PT Integrasi Aviasi Solusi). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
