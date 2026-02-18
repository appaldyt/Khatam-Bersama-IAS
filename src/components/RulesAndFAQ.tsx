import { Shield, HelpCircle, MessageCircle } from 'lucide-react';

export default function RulesAndFAQ() {
  const rules = [
    'Setiap peserta boleh mengganti nama Hamba Allah, jika belum berkenan untuk menuliskan nama lengkap',
    'Surat/Ayat yang sudah diklaim tidak dapat diubah atau dibatalkan',
    'Pastikan Anda dapat menyelesaikan membaca Surat/Ayat yang diklaim',
    'Surat/Ayat yang sudah diklaim peserta lain tidak dapat diambil ulang',
    'Jika ada kesalahan, hubungi admin untuk bantuan',
  ];

  const faqs = [
    {
      question: 'Apakah saya bisa mengklaim lebih dari 1 Ayat/Surat/Juzz?',
      answer: 'Anda bisa mengikuti lebih dari satu Ayat/Surat/Juzz.',
    },
    {
      question: 'Bagaimana jika Ayat/Surat/Juzz yang saya inginkan sudah diklaim?',
      answer: 'Anda tetap bisa memilih Ayat/Surat/Juzz lain yang masih tersedia.',
    },
    {
      question: 'Berapa lama waktu untuk menyelesaikan Ayat/Surat/Juzz yang diklaim?',
      answer: 'Segera selama periode Ramadan.',
    },
    {
      question: 'Bagaimana cara melaporkan jika sudah selesai?',
      answer: 'Sistem akan mencatat klaim Anda. Pastikan Anda menyelesaikan membaca Ayat/Surat/Juzz yang telah diklaim sebagai amanah.',
    },
    {
      question: 'Apa yang dimaksud dengan progress Kelompok?',
      answer: 'Karyawan Kantor Pusat & SBU Pusat serta SDU Pusat memilih Kantor Pusat, Karyawan Regional & SBU Cabang sesuai regionalnya memilih Regionalnya masing-masing, dan untuk Gapusa, APS, IASS, IASH, & IASP yang ingin berpartisipasi memilih Entitas.',
    },
    {
      question: 'Jika seluruhnya Ayat/Surat/Juzz sudah selesai dan Saya ingin tetap ikut berpartisipasi bagaimana caranya?',
      answer: 'Bisa memilih kelompok lainya yang masih tersedia, jika tidak tersedia juga akan dibukakan Khatam Sesion 2.',
    },
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Peraturan Penting
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <ul className="space-y-4">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-red-100 rounded-full p-1 flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <p className="text-gray-700">{rule}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                Hubungi Admin
              </h2>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-gray-600 mb-4">
                Jika ada pertanyaan, kendala, atau perlu bantuan, silakan hubungi admin kami:
              </p>
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <p className="font-semibold text-blue-600">
                    culture@ias.id
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">WhatsApp</p>
                  <p className="font-semibold text-blue-600">
                    Novrizal Boer (085-375-135-394)
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Jam Operasional</p>
                  <p className="font-semibold text-gray-700">
                    Senin - Jumat: 08:00 - 17:00 WIB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-6 justify-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <HelpCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">
              Pertanyaan Umum (FAQ)
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="font-bold text-lg text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
