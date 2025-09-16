'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useAuth } from '../providers/AuthProvider';
import AddRunModal from '@/components/AddRunModal';

interface RunData {
  id: string;
  city: string;
  country: string;
  voivodeship?: string;
  date: string;
  distance: number;
  lat: number;
  lng: number;
  notes?: string;
}

// Dynamic import dla mapy (SSR compatibility)
const RunningMap = dynamic(() => import('@/components/RunningMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
      <div className="text-gray-500">Ładowanie mapy...</div>
    </div>
  )
});

export default function BieganiePage() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'europa' | 'polska'>('europa');
  const [showAddModal, setShowAddModal] = useState(false);
  const [runnings, setRunnings] = useState([
    // Rzeczywiste dane dla biegów z dystansami
    // POLSKA
    {
      id: 'warszawa-2024',
      city: 'Warszawa',
      country: 'Polska',
      voivodeship: 'Mazowieckie',
      date: '2024-10-15',
      distance: 10.5,
      lat: 52.2297,
      lng: 21.0122,
      notes: 'Bieg przez Łazienki Królewskie i Park Ujazdowski. Jesienna atmosfera, kolorowe liście.'
    },
    {
      id: 'gdynia-2024',
      city: 'Gdynia',
      country: 'Polska',
      voivodeship: 'Pomorskie',
      date: '2024-09-22',
      distance: 15.2,
      lat: 54.5189,
      lng: 18.5305,
      notes: 'Bieg wzdłuż plaży w Gdyni. Morskie powietrze, widoki na Zatokę Gdańską.'
    },
    {
      id: 'zabrze-2024',
      city: 'Zabrze',
      country: 'Polska',
      voivodeship: 'Śląskie',
      date: '2024-08-08',
      distance: 8.7,
      lat: 50.3249,
      lng: 18.7857,
      notes: 'Bieg przez Park im. Poległych Bohaterów. Industrialny charakter miasta, zielone enklawy.'
    },
    {
      id: 'wigry-2024',
      city: 'Jezioro Wigry/Suwałki',
      country: 'Polska',
      voivodeship: 'Podlaskie',
      date: '2024-07-12',
      distance: 21.0,
      lat: 54.0484,
      lng: 22.9289,
      notes: 'Bieg wokół Jeziora Wigry. Dzika przyroda, lasy i jeziora. Suwalszczyzna w pełnej krasie.'
    },
    // ZAGRANICA
    {
      id: 'stavanger-2024',
      city: 'Stavanger',
      country: 'Norwegia',
      date: '2024-06-20',
      distance: 12.3,
      lat: 58.9700,
      lng: 5.7331,
      notes: 'Bieg przez centrum Stavanger i nadmorskie ścieżki. Fiordy, góry i norweska przyroda.'
    },
    {
      id: 'sofia-2024',
      city: 'Sofia',
      country: 'Bułgaria',
      date: '2024-05-05',
      distance: 7.8,
      lat: 42.6977,
      lng: 23.3219,
      notes: 'Bieg przez historyczne centrum Sofii. Góra Witosza w tle, bułgarska kultura i kuchnia.'
    }
  ]);

  // Function to handle adding new runs
  const handleAddRun = async (runData: RunData) => {
    setRunnings(prev => [...prev, runData]);
  };

  const countries = [...new Set(runnings.map(r => r.country))];
  const voivodeships = [...new Set(runnings.filter(r => r.voivodeship).map(r => r.voivodeship))];
  const totalDistance = runnings.reduce((sum, run) => sum + run.distance, 0);
  
  // Statystyki dla "ten rok" (2024)
  const currentYear = 2024;
  const thisYearRuns = runnings.filter(r => new Date(r.date).getFullYear() === currentYear);
  const thisYearDistance = thisYearRuns.reduce((sum, run) => sum + run.distance, 0);
  const thisYearCountries = [...new Set(thisYearRuns.map(r => r.country))];
  const thisYearVoivodeships = [...new Set(thisYearRuns.filter(r => r.voivodeship).map(r => r.voivodeship))];

  // Filtrowanie biegów według widoku
  const filteredRunnings = view === 'europa' 
    ? runnings 
    : runnings.filter(r => r.country === 'Polska');

  // Dane dla tabeli
  const tableData = view === 'europa' 
    ? countries.map(country => {
        const countryRuns = runnings.filter(r => r.country === country);
        const totalDist = countryRuns.reduce((sum, run) => sum + run.distance, 0);
        const longestRun = Math.max(...countryRuns.map(r => r.distance));
        return {
          name: country,
          runs: countryRuns.length,
          distance: totalDist,
          longestRun: longestRun,
          type: 'country'
        };
      })
    : voivodeships.map(voivodeship => {
        const voivodeshipRuns = runnings.filter(r => r.voivodeship === voivodeship);
        const totalDist = voivodeshipRuns.reduce((sum, run) => sum + run.distance, 0);
        const longestRun = Math.max(...voivodeshipRuns.map(r => r.distance));
        return {
          name: voivodeship,
          runs: voivodeshipRuns.length,
          distance: totalDist,
          longestRun: longestRun,
          type: 'voivodeship'
        };
      });

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50/10 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-logged users
  if (!user) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50/10 to-stone-100">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(/running.png)'
            }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
          
          {/* Hero Content */}
          <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              Twoja Biegowa Mapa Świata
                </h1>
            <p className="text-xl font-medium opacity-90 leading-relaxed mb-8">
                  Śledź swoje biegi po świecie i Polsce. Kraje, województwa, miasta - każdy bieg to nowa historia.
                </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/login" 
                className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Zaloguj się
              </Link>
              <Link 
                href="/register" 
                className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
              >
                Zarejestruj się
              </Link>
              </div>
            </div>
          </section>

        {/* Features Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12 title-outdoor">
              Co możesz śledzić?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Map Feature */}
                <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 title-outdoor">Interaktywna mapa</h3>
                <p className="text-gray-600 subtitle-outdoor">
                  Zobacz swoje biegi na mapie Europy i Polski z kolorowymi markerami pokazującymi dystans
                </p>
              </div>

              {/* Stats Feature */}
                <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 title-outdoor">Szczegółowe statystyki</h3>
                <p className="text-gray-600 subtitle-outdoor">
                  Kraje, województwa, łączne kilometry, najdłuższe biegi - wszystko w przejrzystych tabelach
                </p>
              </div>

              {/* Progress Feature */}
                <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 title-outdoor">Śledzenie postępów</h3>
                <p className="text-gray-600 subtitle-outdoor">
                  Porównuj swoje wyniki rok do roku i śledź rozwój swojej biegowej przygody
                </p>
                </div>
              </div>
            </div>
          </section>

        {/* CTA Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 title-outdoor">
              Rozpocznij swoją biegową przygodę
            </h2>
            <p className="text-lg text-gray-600 mb-8 subtitle-outdoor">
              Dołącz do społeczności biegaczy i śledź swoje osiągnięcia na mapie świata
            </p>
            <Link 
              href="/register" 
              className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-orange-600 hover:-translate-y-1 transition-all duration-200 inline-block"
            >
              Zacznij już dziś
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Show main app for logged-in users
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50/10 to-stone-100">

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/running.png)'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Twoja Biegowa Mapa Świata
          </h1>
          <p className="text-xl font-medium opacity-90 leading-relaxed">
            Śledź swoje biegi po świecie i Polsce. Kraje, województwa, miasta - każdy bieg to nowa historia.
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="relative -mt-20 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Countries */}
            <div className="relative bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {countries.length}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider mb-1">Krajów łącznie</div>
                <div className="text-xs text-white font-bold bg-white/20 px-2 py-1 rounded-full border border-white/30">
                  {thisYearCountries.length} w {currentYear}
                </div>
              </div>
              {/* Gradient overlay for better text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl"></div>
            </div>

            {/* Total Voivodeships */}
            <div className="relative bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {voivodeships.length}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider mb-1">Województw łącznie</div>
                <div className="text-xs text-white font-bold bg-white/20 px-2 py-1 rounded-full border border-white/30">
                  {thisYearVoivodeships.length} w {currentYear}
                </div>
              </div>
              {/* Gradient overlay for better text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl"></div>
            </div>

            {/* Total Distance */}
            <div className="relative bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {totalDistance.toFixed(1)}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider mb-1">km łącznie</div>
                <div className="text-xs text-white font-bold bg-white/20 px-2 py-1 rounded-full border border-white/30">
                  {thisYearDistance.toFixed(1)} km w {currentYear}
                </div>
              </div>
              {/* Gradient overlay for better text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl"></div>
              </div>

            {/* Total Runs */}
            <div className="relative bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {runnings.length}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider mb-1">Biegów łącznie</div>
                <div className="text-xs text-white font-bold bg-white/20 px-2 py-1 rounded-full border border-white/30">
                  {thisYearRuns.length} w {currentYear}
                </div>
              </div>
              {/* Gradient overlay for better text readability */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent rounded-b-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* View Control - Segmented Control */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button 
                onClick={() => setView('europa')} 
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center justify-center ${
                  view === 'europa' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Europa
              </button>
              <button 
                onClick={() => setView('polska')} 
                className={`px-6 py-2 rounded-full font-medium transition-colors duration-200 flex items-center justify-center ${
                  view === 'polska' 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Polska
              </button>
            </div>
          </div>
          
          <div className="h-[500px] rounded-xl overflow-hidden shadow-lg border border-stone-200/50">
            <RunningMap runnings={filteredRunnings} view={view} />
          </div>
        </div>
      </div>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          {/* Countries Table */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 title-outdoor">
              Kraje Europy
            </h2>
            <div className="card-subtle rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Kraj
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Liczba biegów
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Łączny dystans
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Najdłuższy bieg
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {runnings
                      .filter(running => running.country !== 'Polska')
                      .reduce((acc, running) => {
                        const existing = acc.find(item => item.name === running.country);
                        if (existing) {
                          existing.runs += 1;
                          existing.distance += running.distance;
                          existing.longestRun = Math.max(existing.longestRun, running.distance);
                        } else {
                          acc.push({
                            name: running.country,
                            runs: 1,
                            distance: running.distance,
                            longestRun: running.distance
                          });
                        }
                        return acc;
                      }, [])
                      .sort((a, b) => b.distance - a.distance)
                      .map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.runs}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.distance.toFixed(1)} km
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.longestRun.toFixed(1)} km
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Voivodeships Table */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 title-outdoor">
              Województwa Polski
            </h2>
            <div className="card-subtle rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Województwo
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Liczba biegów
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Łączny dystans
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                        Najdłuższy bieg
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {runnings
                      .filter(running => running.country === 'Polska' && running.voivodeship)
                      .reduce((acc, running) => {
                        const existing = acc.find(item => item.name === running.voivodeship);
                        if (existing) {
                          existing.runs += 1;
                          existing.distance += running.distance;
                          existing.longestRun = Math.max(existing.longestRun, running.distance);
                        } else {
                          acc.push({
                            name: running.voivodeship,
                            runs: 1,
                            distance: running.distance,
                            longestRun: running.distance
                          });
                        }
                        return acc;
                      }, [])
                      .sort((a, b) => b.distance - a.distance)
                      .map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.runs}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.distance.toFixed(1)} km
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {item.longestRun.toFixed(1)} km
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Add New Run Section */}
          <section>
            <div className="card-subtle rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 title-outdoor">
                Dodaj nowy bieg
              </h3>
              <p className="text-gray-600 mb-8 subtitle-outdoor">
                Śledź swoje postępy i dodawaj nowe doświadczenia biegowe
              </p>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 hover:-translate-y-1 transition-all duration-200"
              >
                Dodaj bieg
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Add Run Modal */}
      <AddRunModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddRun={handleAddRun}
      />
    </div>
  );
}
