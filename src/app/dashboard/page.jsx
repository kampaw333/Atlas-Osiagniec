'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getUserStats } from '@/lib/getUserStats'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [achievements, setAchievements] = useState([])
  const [stats, setStats] = useState({
    korona_europy: 0,
    korona_polski: 0,
    kraje: 0,
    zawody: 0
  })
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  // Test data for debugging - uncomment if needed
  // useEffect(() => {
  //   setAchievements([{
  //     id: 'test',
  //     name: 'Musala',
  //     location: 'Bułgaria',
  //     date: '2025-06-28'
  //   }])
  // }, [])

  const loadAchievements = async () => {
    console.log('Fetching achievements...')
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5)
    
    console.log('Fetched:', data)
    console.log('Error:', error)
    
    if (data) {
      setAchievements(data)
    }
  }

  const loadUserData = async (userId) => {
    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        console.error('Error fetching profile:', profileError)
      } else {
        setProfile(profileData)
      }

      // Fetch user statistics using the utility function
      const userStats = await getUserStats(userId)
      setStats(userStats)

      // Load recent achievements for display
      await loadAchievements()
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)
      await loadUserData(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }


  const getDaysSinceRegistration = () => {
    if (!profile?.created_at) return 0
    const created = new Date(profile.created_at)
    const now = new Date()
    return Math.floor((now - created) / (1000 * 60 * 60 * 24))
  }

  const handleSubmit = async (formData) => {
    try {
      let achievementData = {
        user_id: user.id,
        category: formData.category,
        date: formData.date,
        notes: formData.notes || null
      }

      // Handle different categories
      if (formData.category === 'korona_europy' || formData.category === 'korona_polski') {
        const selectedPeakId = formData.peak_id
        
        // For peaks, find the selected peak and get its data
        const tableName = formData.category === 'korona_europy' ? 'peaks_europe' : 'peaks_poland'
        const { data: peakData, error: peakError } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', selectedPeakId)
          .single()

        if (peakError) {
          console.error('Error fetching peak data:', peakError)
          throw peakError
        }

        achievementData = {
          ...achievementData,
          name: peakData.name,
          peak_europe_id: selectedPeakId,
          location: peakData.country
        }

        console.log('Attempting to save:', {
          user_id: user.id,
          category: formData.category,
          name: peakData.name,
          peak_europe_id: selectedPeakId,
          date: formData.date,
          notes: formData.notes
        })
      } else if (formData.category === 'bieganie') {
        achievementData = {
          ...achievementData,
          custom_name: `${formData.distance}km run`,
          location: formData.city ? `${formData.city}, ${formData.country}` : formData.country,
          distance: formData.distance ? parseFloat(formData.distance) : null,
          time: formData.time || null
        }
      } else if (formData.category === 'zawody') {
        achievementData = {
          ...achievementData,
          custom_name: formData.custom_name,
          location: formData.location,
          race_type: formData.race_type,
          time: formData.time || null,
          place: formData.place || null
        }
      }

      const { data, error } = await supabase
        .from('achievements')
        .insert(achievementData)

      if (error) {
        console.error('Error saving achievement:', error)
        throw error
      }

      // Close modal and refresh data
      setShowAddModal(false)
      await loadAchievements()
      await loadUserData(user.id)
      
      // Show success message
      setSuccessMessage('Osiągnięcie dodane!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50/30 to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50/10 to-stone-100 relative">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.02]"></div>
      

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-100/50 via-orange-50/30 to-stone-100/50">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Witaj z powrotem, {profile?.full_name || profile?.username || 'Użytkowniku'}!
          </h2>
          <p className="text-lg text-gray-600">
            Twoja przygoda trwa już {getDaysSinceRegistration()} dni
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Korona Europy */}
          <div className="bg-gradient-to-br from-amber-50 to-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 border-amber-500 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/5 via-transparent to-amber-100/5"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-2">Korona Europy</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">{stats.korona_europy}/46</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{width: `${(stats.korona_europy / 46) * 100}%`}}></div>
              </div>
            </div>
          </div>

          {/* Korona Polski */}
          <div className="bg-gradient-to-br from-red-50 to-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 border-red-500 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/5 via-transparent to-red-100/5"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-2">Korona Polski</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">{stats.korona_polski}/28</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: `${(stats.korona_polski / 28) * 100}%`}}></div>
              </div>
            </div>
          </div>

          {/* Kraje */}
          <div className="bg-gradient-to-br from-blue-50 to-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 border-blue-500 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/5 via-transparent to-blue-100/5"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-2">Kraje (bieganie)</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">{stats.kraje}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>

          {/* Zawody */}
          <div className="bg-gradient-to-br from-green-50 to-transparent rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 border-green-500 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/5 via-transparent to-green-100/5"></div>
            <div className="relative">
              <p className="text-sm font-medium text-gray-600 mb-2">Zawody</p>
              <p className="text-2xl font-bold text-gray-900 mb-3">{stats.zawody}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8 relative overflow-hidden">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Ostatnie zdobycze
          </h3>
          {console.log('Current achievements state:', achievements)}
          {achievements && achievements.length > 0 ? (
            <div className="grid gap-4">
              {achievements.map(achievement => (
                <div key={achievement.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{achievement.name || achievement.custom_name}</h3>
                      <p className="text-gray-600">{achievement.location}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(achievement.date).toLocaleDateString('pl-PL')}
                    </div>
                  </div>
                  {achievement.notes && (
                    <p className="text-gray-700 mt-2">{achievement.notes}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100/5 via-transparent to-orange-100/5"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 mb-2 text-lg">Twoja mapa osiągnięć czeka na pierwsze wpisy</p>
                <p className="text-sm text-gray-400">
                  Rozpocznij swoją przygodę i zacznij odkrywać świat
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Add Achievement Button */}
        <div className="text-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Zapisz nową przygodę
          </button>
        </div>
      </main>

      {/* Add Achievement Modal */}
      {showAddModal && (
        <AddAchievementModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmit}
          user={user}
        />
      )}
    </div>
  )
}

// Add Achievement Modal Component
function AddAchievementModal({ onClose, onSubmit, user }) {
  const [formData, setFormData] = useState({
    category: '',
    peak_id: '',
    custom_name: '',
    location: '',
    country: '',
    city: '',
    date: '',
    elevation: '',
    distance: '',
    time: '',
    race_type: '',
    place: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [peaks, setPeaks] = useState([])
  const [loadingPeaks, setLoadingPeaks] = useState(false)
  const [userAchievements, setUserAchievements] = useState([])

  // Fetch peaks when category changes
  useEffect(() => {
    const fetchPeaks = async () => {
      if (formData.category === 'korona_europy' || formData.category === 'korona_polski') {
        setLoadingPeaks(true)
        try {
          // Fetch user's already achieved peaks
          const { data: userAchievementsData } = await supabase
            .from('achievements')
            .select('peak_europe_id, peak_poland_id')
            .eq('user_id', user.id)

          setUserAchievements(userAchievementsData || [])

          const tableName = formData.category === 'korona_europy' ? 'peaks_europe' : 'peaks_poland'
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order('country', { ascending: true })
            .order('height_m', { ascending: false })

          if (error) {
            console.error('Error fetching peaks:', error)
          } else {
            setPeaks(data || [])
          }
        } catch (error) {
          console.error('Error fetching peaks:', error)
        } finally {
          setLoadingPeaks(false)
        }
      } else {
        setPeaks([])
        setUserAchievements([])
      }
    }

    fetchPeaks()
  }, [formData.category, user.id])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting achievement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Dodaj nowe osiągnięcie</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Kategoria *
              </label>
              <select
                id="category"
                name="category"
                required
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="">Wybierz kategorię</option>
                <option value="korona_europy">Korona Europy</option>
                <option value="korona_polski">Korona Polski</option>
                <option value="bieganie">Bieganie</option>
                <option value="zawody">Zawody</option>
              </select>
            </div>

            {/* Peak selection for mountain categories */}
            {(formData.category === 'korona_europy' || formData.category === 'korona_polski') && (
              <>
                <div>
                  <label htmlFor="peak_id" className="block text-sm font-medium text-gray-700 mb-2">
                    Szczyt *
                  </label>
                  {loadingPeaks ? (
                    <div className="w-full py-3 px-4 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                      Ładowanie szczytów...
                    </div>
                  ) : (
                    <select
                      id="peak_id"
                      name="peak_id"
                      required
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                      value={formData.peak_id}
                      onChange={handleInputChange}
                    >
                      <option value="">Wybierz szczyt</option>
                      {peaks
                        .filter(peak => {
                          const isAchieved = userAchievements.some(achievement => 
                            (formData.category === 'korona_europy' && achievement.peak_europe_id === peak.id) ||
                            (formData.category === 'korona_polski' && achievement.peak_poland_id === peak.id)
                          )
                          return !isAchieved
                        })
                        .map((peak) => (
                          <option key={peak.id} value={peak.id}>
                            {peak.country} - {peak.name} ({peak.height_m}m)
                          </option>
                        ))}
                      {peaks
                        .filter(peak => {
                          const isAchieved = userAchievements.some(achievement => 
                            (formData.category === 'korona_europy' && achievement.peak_europe_id === peak.id) ||
                            (formData.category === 'korona_polski' && achievement.peak_poland_id === peak.id)
                          )
                          return isAchieved
                        })
                        .map((peak) => (
                          <option key={peak.id} value={peak.id} disabled className="text-gray-400">
                            {peak.country} - {peak.name} ({peak.height_m}m) (✓ Zdobyty)
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              </>
            )}

            {/* Running category fields */}
            {formData.category === 'bieganie' && (
              <>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Kraj *
                  </label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    placeholder="np. Polska, Czechy"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Miasto
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    placeholder="np. Kraków, Praga"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
                      Dystans (km) *
                    </label>
                    <input
                      id="distance"
                      name="distance"
                      type="number"
                      step="0.1"
                      required
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                      placeholder="5.0"
                      value={formData.distance}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Czas
                    </label>
                    <input
                      id="time"
                      name="time"
                      type="text"
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                      placeholder="25:30"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Race category fields */}
            {formData.category === 'zawody' && (
              <>
                <div>
                  <label htmlFor="custom_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nazwa zawodów *
                  </label>
                  <input
                    id="custom_name"
                    name="custom_name"
                    type="text"
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    placeholder="np. Maraton Warszawski"
                    value={formData.custom_name}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Lokalizacja *
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    placeholder="np. Warszawa, Polska"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <label htmlFor="race_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Typ zawodów *
                  </label>
                  <select
                    id="race_type"
                    name="race_type"
                    required
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                    value={formData.race_type}
                    onChange={handleInputChange}
                  >
                    <option value="">Wybierz typ</option>
                    <option value="5km">5km</option>
                    <option value="10km">10km</option>
                    <option value="półmaraton">Półmaraton</option>
                    <option value="maraton">Maraton</option>
                    <option value="ultra">Ultra</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Czas *
                    </label>
                    <input
                      id="time"
                      name="time"
                      type="text"
                      required
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                      placeholder="3:45:30"
                      value={formData.time}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-2">
                      Miejsce
                    </label>
                    <input
                      id="place"
                      name="place"
                      type="text"
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                      placeholder="np. 1, 15, 150"
                      value={formData.place}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Date field - always shown */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Data *
              </label>
              <input
                id="date"
                name="date"
                type="date"
                required
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>

            {/* Notes field - always shown */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notatki
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                placeholder="Dodatkowe informacje o osiągnięciu..."
                value={formData.notes}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition duration-200 disabled:bg-orange-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
