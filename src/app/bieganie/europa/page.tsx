'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

// Dynamic import dla mapy (SSR compatibility)
const EuropeMap = dynamic(() => import('@/components/EuropeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Ładowanie mapy...</div>
    </div>
  )
});

// Dynamic import dla heat mapy (SSR compatibility)
const EuropeHeatMap = dynamic(() => import('@/components/EuropeHeatMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Ładowanie heat mapy...</div>
    </div>
  )
});

export default function EuropaPage() {
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

  const foreignRunnings = mockRunnings.filter(r => r.country !== 'Polska');
  const countries = [...new Set(foreignRunnings.map(r => r.country))];

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
              <div className="text-4xl">🌍</div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-3 title-outdoor">
                  Bieganie w Europie
                </h1>
                <p className="text-lg text-gray-600 subtitle-outdoor">
                  Twoje zagraniczne przygody biegowe na mapie Europy
                </p>
              </div>
            </div>
          </section>

          {/* Europe Map Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 title-outdoor">Mapa Europy - Twoje biegi</h2>
            <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg">
              <EuropeMap runnings={mockRunnings} />
            </div>
          </section>

          {/* Heat Map Section */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 title-outdoor">Testowa Heat Mapa</h2>
            <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <EuropeHeatMap />
            </div>
            <div className="mt-4 text-sm text-gray-600 subtitle-outdoor">
              <p>Testowa heat mapa z kolorami:</p>
              <div className="flex gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(220, 38, 127, 0.6)' }}></div>
                  <span>Polska - ciemnoczerwony</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(251, 146, 60, 0.6)' }}></div>
                  <span>Niemcy - pomarańczowy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(254, 215, 170, 0.6)' }}></div>
                  <span>Czechy - żółty</span>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Overview */}
          <section className="mb-16">
            <div className="card-subtle rounded-xl p-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2 title-outdoor">
                  {countries.length} kraje przebiegnięte
                </div>
                <div className="text-gray-600 subtitle-outdoor">Twoje europejskie podboje biegowe</div>
              </div>
            </div>
          </section>

          {/* Foreign Runs Grid */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 title-outdoor">Twoje zagraniczne biegi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foreignRunnings.map((running) => (
                <div key={running.id} className="card-subtle rounded-xl p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 title-outdoor">
                      {running.city}
                    </h3>
                    <p className="text-sm text-gray-500 subtitle-outdoor">
                      {running.country}
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

          {/* Add New Foreign Run Section */}
          <section>
            <div className="card-subtle rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 title-outdoor">
                Dodaj nowy zagraniczny bieg
              </h3>
              <p className="text-gray-600 mb-8 subtitle-outdoor">
                Planujesz bieg w nowym kraju? Dodaj go do swojej kolekcji
              </p>
              <button className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 hover:-translate-y-1 transition-all duration-200">
                Dodaj bieg
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

