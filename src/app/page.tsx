'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './providers/AuthProvider'
import { getUserStats } from '@/lib/getUserStats'
import { supabase } from '@/lib/supabase'
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/achievements';

interface UserAchievement {
  id: string;
  peak_europe_id?: string;
  peak_poland_id?: string;
  category: string;
  completion_date?: string;
  notes?: string;
  date?: string;
  user_id?: string;
  name?: string;
  location?: string;
}

interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  aud?: string;
  role?: string;
}

export default function HomePage() {
  const { user, loading } = useAuth()
  const [userStats, setUserStats] = useState({
    korona_europy: 0,
    korona_polski: 0,
    kraje: 0,
    zawody: 0
  })
  const [statsLoading, setStatsLoading] = useState(false)
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([])
  const [achievementsLoading, setAchievementsLoading] = useState(false)

  // Fetch user data when logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        setUserStats({
          korona_europy: 0,
          korona_polski: 0,
          kraje: 0,
          zawody: 0
        })
        setRecentAchievements([])
        return
      }

      setStatsLoading(true)
      setAchievementsLoading(true)
      try {
        const userId = (user as User).id
        
        // Fetch user stats
        const stats = await getUserStats(userId)
        setUserStats(stats)

        // Fetch recent achievements
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userId)
          .order('date', { ascending: false })
          .limit(6)

        if (achievementsError) {
          console.error('Error fetching recent achievements:', achievementsError)
        } else {
          setRecentAchievements(achievementsData || [])
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error)
      } finally {
        setStatsLoading(false)
        setAchievementsLoading(false)
      }
    }

    fetchUserData()
  }, [user])

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden mb-[-100px]">
        {/* Background Image with Parallax */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: 'url(/mountain1.png)'
          }}
        />
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto pt-[20vh]">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-8 font-display">
            Atlas Osiągnięć
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed opacity-90 font-body">
            Śledź swoje sportowe osiągnięcia i odkrywaj nowe wyzwania.
            Od szczytów Europy po maratony świata - każdy cel jest w zasięgu ręki.
          </p>
        </div>
      </section>

      <main>
        {/* Stats Overview - Overlapping Bottom Edge */}
        <section className="relative -mt-56 mb-12">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Korona Europy */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 text-center border border-white/20 shadow-xl">
                <div className="text-3xl font-semibold text-gray-900 mb-4 font-display">
                  {user ? (
                    statsLoading ? '...' : `${userStats.korona_europy}/46`
                  ) : (
                    '0/46'
                  )}
                </div>
                <div className="text-sm text-gray-500 font-body">Korona Europy</div>
              </div>

              {/* Korona Polski */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 text-center border border-white/20 shadow-xl">
                <div className="text-3xl font-semibold text-gray-900 mb-4 font-display">
                  {user ? (
                    statsLoading ? '...' : `${userStats.korona_polski}/28`
                  ) : (
                    '0/28'
                  )}
                </div>
                <div className="text-sm text-gray-500 font-body">Korona Polski</div>
              </div>

              {/* Bieganie */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 text-center border border-white/20 shadow-xl">
                <div className="text-3xl font-semibold text-gray-900 mb-4 font-display">
                  {user ? (
                    statsLoading ? '...' : userStats.kraje
                  ) : (
                    '0'
                  )}
                </div>
                <div className="text-sm text-gray-500 font-body">Bieganie na świecie</div>
              </div>

              {/* Zawody */}
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-8 text-center border border-white/20 shadow-xl">
                <div className="text-3xl font-semibold text-gray-900 mb-4 font-display">
                  {user ? (
                    statsLoading ? '...' : userStats.zawody
                  ) : (
                    '0'
                  )}
                </div>
                <div className="text-sm text-gray-500 font-body">Zawody</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20" data-section="categories">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-semibold text-gray-900 mb-6 font-display">
                Wybierz swoją przygodę
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-body">
                Każda kategoria to nowa historia do napisania. Rozpocznij swoją podróż już dziś.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Korona Europy */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[280px]">
                <div className="relative h-[140px]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/europe.png)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">Korona Europy</h3>
                  {user ? (
                    <>
                      <div className="text-5xl font-bold text-gray-900 mb-2 font-display">
                        {statsLoading ? '...' : `${userStats.korona_europy}/46`}
                      </div>
                      <div className="text-sm text-gray-600 mb-6 font-body">szczytów</div>
                      <div className="h-1 bg-orange-500 w-full rounded-full"></div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 mb-6 font-body">46 szczytów do zdobycia</div>
                  )}
                </div>
              </div>

              {/* Korona Polski */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[280px]">
                <div className="relative h-[140px]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/poland.png)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">Korona Polski</h3>
                  {user ? (
                    <>
                      <div className="text-5xl font-bold text-gray-900 mb-2 font-display">
                        {statsLoading ? '...' : `${userStats.korona_polski}/28`}
                      </div>
                      <div className="text-sm text-gray-600 mb-6 font-body">szczytów</div>
                      <div className="h-1 bg-orange-500 w-full rounded-full"></div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 mb-6 font-body">28 szczytów</div>
                  )}
                </div>
              </div>

              {/* Bieganie na Świecie */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[280px]">
                <div className="relative h-[140px]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/running.png)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">Bieganie na Świecie</h3>
                  {user ? (
                    <>
                      <div className="text-5xl font-bold text-gray-900 mb-2 font-display">
                        {statsLoading ? '...' : userStats.kraje}
                      </div>
                      <div className="text-sm text-gray-600 mb-6 font-body">kraje</div>
                      <div className="h-1 bg-orange-500 w-full rounded-full"></div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 mb-6 font-body">Świat czeka na Twoje kroki</div>
                  )}
                </div>
              </div>

              {/* Zawody Biegowe */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 min-h-[280px]">
                <div className="relative h-[140px]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/marathons.png)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 font-display">Zawody Biegowe</h3>
                  {user ? (
                    <>
                      <div className="text-5xl font-bold text-gray-900 mb-2 font-display">
                        {statsLoading ? '...' : userStats.zawody}
                      </div>
                      <div className="text-sm text-gray-600 mb-6 font-body">ukończonych</div>
                      <div className="h-1 bg-orange-500 w-full rounded-full"></div>
                    </>
                  ) : (
                    <div className="text-sm text-gray-600 mb-6 font-body">Startuj w zawodach</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Recent Achievements Section - Only for logged-in users */}
        {user && (
          <section className="py-20 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-semibold text-gray-900 mb-6 title-outdoor">
                  Ostatnie Osiągnięcia
                </h2>
                <p className="text-xl text-gray-600 subtitle-outdoor">
                  Twoje najnowsze podboje i wspomnienia
                </p>
              </div>

              {achievementsLoading ? (
                <div className="text-center py-12">
                  <div className="text-gray-500">Ładowanie osiągnięć...</div>
                </div>
              ) : recentAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentAchievements.map((achievement) => {
                    const getBadgeForCategory = (category: string | undefined) => {
                      switch (category) {
                        case 'korona_europy':
                          return '/europecrown.png';
                        case 'korona_polski':
                          return '/polandcrown.png';
                        case 'bieganie':
                          return '/runningbadge.png';
                        case 'zawody':
                          return '/races.png';
                        default:
                          return '/defaultbadge.png';
                      }
                    };

                    const formatDate = (dateString: string) => {
                      return new Date(dateString).toLocaleDateString('pl-PL');
                    };

                    return (
                      <div key={achievement.id} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all">
                        <img 
                          src={getBadgeForCategory(achievement.category) || '/default-badge.png'}
                          className="w-14 h-14 mr-4 object-contain"
                          alt={`Badge for ${achievement.category}`}
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-lg">{achievement.name}</h3>
                          <p className="text-gray-600 text-sm">{achievement.location}</p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {achievement.date ? formatDate(achievement.date) : 'Brak daty'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">Brak osiągnięć do wyświetlenia</div>
                  <p className="text-gray-400">Dodaj swoje pierwsze osiągnięcie, aby zobaczyć je tutaj!</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="relative bg-gray-900 text-white">
          {/* Mountain Silhouette */}
          <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
            <svg 
              className="w-full h-full" 
              viewBox="0 0 1200 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M0 64L100 48L200 56L300 40L400 52L500 32L600 44L700 28L800 36L900 24L1000 32L1100 20L1200 28L1200 64H0Z" 
                fill="#374151"
              />
            </svg>
          </div>

          {/* Footer Content */}
          <div className="relative z-10 pt-20 pb-6 text-center">
            <h3 className="text-2xl font-bold mb-2 font-display">Atlas Osiągnięć</h3>
            <p className="text-gray-300 mb-6 font-body">Każdy szczyt to nowa historia</p>
            <div className="text-xs text-gray-400 font-body">
              © 2025 Atlas Osiągnięć. Wszystkie prawa zastrzeżone.
            </div>
          </div>
        </footer>

      </main>
    </div>
  );
}
