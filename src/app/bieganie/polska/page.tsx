'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import dla mapy Polski (SSR compatibility)
const PolandMap = dynamic(() => import('@/components/PolandMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Ładowanie mapy Polski...</div>
    </div>
  )
});

export default function PolskaPage() {
  // Rzeczywiste dane dla biegów
  const mockRunnings = [
    // POLSKA
    {
      id: 'warszawa-2024',
      city: 'Warszawa',
      country: 'Polska',
      voivodeship: 'Mazowieckie',
      date: '2024-10-15',
      notes: 'Bieg przez Łazienki Królewskie i Park Ujazdowski. Jesienna atmosfera, kolorowe liście.'
    },
    {
      id: 'gdynia-2024',
      city: 'Gdynia',
      country: 'Polska',
      voivodeship: 'Pomorskie',
      date: '2024-09-22',
      notes: 'Bieg wzdłuż plaży w Gdyni. Morskie powietrze, widoki na Zatokę Gdańską.'
    },
    {
      id: 'zabrze-2024',
      city: 'Zabrze',
      country: 'Polska',
      voivodeship: 'Śląskie',
      date: '2024-08-08',
      notes: 'Bieg przez Park im. Poległych Bohaterów. Industrialny charakter miasta, zielone enklawy.'
    },
    {
      id: 'wigry-2024',
      city: 'Jezioro Wigry/Suwałki',
      country: 'Polska',
      voivodeship: 'Podlaskie',
      date: '2024-07-12',
      notes: 'Bieg wokół Jeziora Wigry. Dzika przyroda, lasy i jeziora. Suwalszczyzna w pełnej krasie.'
    },
    // ZAGRANICA
    {
      id: 'stavanger-2024',
      city: 'Stavanger',
      country: 'Norwegia',
      date: '2024-06-20',
      notes: 'Bieg przez centrum Stavanger i nadmorskie ścieżki. Fiordy, góry i norweska przyroda.'
    },
    {
      id: 'sofia-2024',
      city: 'Sofia',
      country: 'Bułgaria',
      date: '2024-05-05',
      notes: 'Bieg przez historyczne centrum Sofii. Góra Witosza w tle, bułgarska kultura i kuchnia.'
    }
  ];

  const polishRunnings = mockRunnings.filter(r => r.country === 'Polska');
  const voivodeships = [...new Set(polishRunnings.map(r => r.voivodeship))];

  return (
    <div className="min-h-screen bg-white">

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <section className="mb-16">
            <div className="flex items-center gap-6 mb-8">
              <Link 
                href="/bieganie" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Powrót do profilu
              </Link>
            </div>
            <div className="flex items-center gap-6 mb-8">
              <div className="text-4xl">🇵🇱</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3 title-outdoor">
                  Bieganie w Polsce
                </h1>
                <p className="text-lg text-gray-600 subtitle-outdoor">
                  Twoje polskie przygody biegowe na mapie województw
                </p>
              </div>
            </div>
          </section>

          {/* Poland Map Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 title-outdoor">Mapa Polski - Województwa</h2>
            <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
              <PolandMap runnings={mockRunnings} />
            </div>
          </section>

          {/* Stats Overview */}
          <section className="mb-16">
            <div className="card-subtle rounded-xl p-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2 title-outdoor">
                  {voivodeships.length} województwa przebiegnięte
                </div>
                <div className="text-gray-600 subtitle-outdoor">Twoje polskie podboje biegowe</div>
              </div>
            </div>
          </section>

          {/* Polish Runs Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 title-outdoor">Twoje polskie biegi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {polishRunnings.map((running) => (
                <div key={running.id} className="card-subtle rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 title-outdoor">
                      {running.city}
                    </h3>
                    <p className="text-sm text-gray-500 subtitle-outdoor">
                      {running.country}, {running.voivodeship}
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 mb-4 subtitle-outdoor">
                    {new Date(running.date).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>

                  {running.notes && (
                    <p className="text-sm text-gray-600 leading-relaxed subtitle-outdoor">
                      {running.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Add New Polish Run Section */}
          <section>
            <div className="card-subtle rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 title-outdoor">
                Dodaj nowy polski bieg
              </h3>
              <p className="text-gray-600 mb-8 subtitle-outdoor">
                Odkryłeś nowe miejsce do biegania w Polsce? Dodaj je do swojej kolekcji
              </p>
              <button className="bg-orange-500 text-white px-6 py-3 rounded font-semibold hover:bg-orange-600 transition">
                Dodaj bieg
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

