'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../providers/AuthProvider'
import { supabase } from '@/lib/supabase'
import { getUserStats } from '@/lib/getUserStats'
import dynamic from 'next/dynamic'

interface Peak {
  id: string;
  name: string;
  country?: string;
  mountain_range?: string;
  height_m: number;
  latitude?: number;
  longitude?: number;
  isCompleted?: boolean;
  completionDate?: string;
  peak_europe_id?: string;
  peak_poland_id?: string;
  category?: string;
  user_id?: string;
  notes?: string;
  date?: string;
  location?: string;
  elevation?: number;
}

interface UserAchievement {
  id: string;
  peak_europe_id?: string;
  peak_poland_id?: string;
  category: string;
  completion_date?: string;
  notes?: string;
}

interface AchievementFormData {
  peak_id: string;
  category: string;
  completion_date: string;
  notes?: string;
  custom_name?: string;
  location?: string;
  country?: string;
  city?: string;
  date?: string;
  elevation?: string;
  distance?: string;
  time?: string;
  race_type?: string;
  place?: string;
}

interface User {
  id: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
  aud?: string;
  role?: string;
}

interface DatabaseAchievement {
  id: string;
  peak_europe_id?: string;
  peak_poland_id?: string;
  category: string;
  completion_date?: string;
  notes?: string;
  user_id?: string;
}

interface AddAchievementModalProps {
  onClose: () => void;
  onSubmit: (formData: AchievementFormData) => void;
  user: User | null;
  initialCategory?: string;
  selectedPeak?: Peak | null;
}

// Plus icon component
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

// Dynamically import the entire map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent').then(mod => ({ default: mod.default })), { 
  ssr: false,
  loading: () => <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
      <p className="text-gray-600">Ładowanie mapy...</p>
    </div>
  </div>
})

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { user, loading } = useAuth()
  
  console.log('=== DEBUG START ===')
  console.log('URL category param:', params)
  console.log('Is user logged in?:', !!user)
  const [category, setCategory] = useState('')
  const [peaks, setPeaks] = useState<Peak[]>([])
  const [peaksWithStatus, setPeaksWithStatus] = useState<Peak[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [userStats, setUserStats] = useState({
    korona_europy: 0,
    korona_polski: 0,
    kraje: 0,
    zawody: 0
  })
  const [highestConqueredPeak, setHighestConqueredPeak] = useState<Peak | null>(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedPeak, setSelectedPeak] = useState<Peak | null>(null)
  const [sortBy, setSortBy] = useState<'country' | 'height' | 'mountain_range'>('country')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filter, setFilter] = useState<'all' | 'completed' | 'remaining'>('all')

  useEffect(() => {
    const initializePage = async () => {
      const resolvedParams = await params
      console.log('Resolved params:', resolvedParams)
      console.log('Category from params:', resolvedParams.category)
      setCategory(resolvedParams.category)
      
      if (resolvedParams.category === 'korona-europy' || resolvedParams.category === 'korona-polski') {
        // Fetch peaks directly with the resolved category
        await fetchPeaksWithCategory(resolvedParams.category)
      }
    }
    
    initializePage()
  }, [params])

  // Simple useEffect for fetching peaks (as requested)
  useEffect(() => {
    if (category === 'korona-europy' || category === 'korona-polski') {
      fetchPeaks()
    }
  }, [user, category]) // Add category as dependency

  const fetchPeaks = async () => {
    if (category) {
      await fetchPeaksWithCategory(category)
    }
  }

  const fetchPeaksWithCategory = async (categoryParam: string) => {
    console.log('=== FETCH PEAKS WITH CATEGORY START ===')
    console.log('fetchPeaksWithCategory called with category:', categoryParam)
    console.log('user:', user)
    console.log('user type:', typeof user)
    console.log('user id:', user ? (user as User).id : 'no user')
    
    // CRITICAL: Validate category parameter
    if (!categoryParam || (categoryParam !== 'korona-europy' && categoryParam !== 'korona-polski')) {
      console.error('CRITICAL ERROR: Invalid category parameter:', categoryParam)
      setDataLoading(false)
      return
    }
    
    setDataLoading(true)
    try {
      // Load all peaks from appropriate table
      const tableName = categoryParam === 'korona-europy' ? 'peaks_europe' : 'peaks_poland'
      console.log('Fetching peaks from table:', tableName)
      console.log('Category check - korona-europy:', categoryParam === 'korona-europy')
      console.log('Category check - korona-polski:', categoryParam === 'korona-polski')
      
      if (categoryParam === 'korona-europy') {
        console.log('Fetching from peaks_europe table')
      } else if (categoryParam === 'korona-polski') {
        console.log('Fetching from peaks_poland table')
      }
      const { data: peaksData, error: peaksError } = await supabase
        .from(tableName)
        .select('*')
        .order(categoryParam === 'korona-europy' ? 'country' : 'mountain_range')
        .order('height_m', { ascending: false })
      
      console.log('Peaks fetched:', peaksData?.length, 'peaks')
      console.log('Error:', peaksError)
      console.log('Sample peak data:', peaksData?.[0])
      console.log('Table name used:', tableName)
      console.log('Category:', category)
      if (peaksData && peaksData.length > 0) {
        console.log('First peak has country:', !!peaksData[0].country)
        console.log('First peak has mountain_range:', !!peaksData[0].mountain_range)
        console.log('First peak country value:', peaksData[0].country)
        console.log('First peak mountain_range value:', peaksData[0].mountain_range)
        console.log('First peak name:', peaksData[0].name)
        console.log('First 3 peaks:', peaksData.slice(0, 3).map(p => ({ name: p.name, country: p.country, mountain_range: p.mountain_range })))
      }

      if (peaksError) {
        console.error('Error fetching peaks:', peaksError)
        console.error('Table name that failed:', tableName)
        setPeaks([])
        setPeaksWithStatus([])
        return
      }

      // CRITICAL: Check if we got data for the wrong table
      if (categoryParam === 'korona-polski' && peaksData && peaksData.length > 0) {
        // If we're looking for Polish peaks but got data with 'country' field, it's European data
        if (peaksData[0].country) {
          console.error('CRITICAL ERROR: Got European peaks data for Polish category! Table peaks_poland might not exist.')
          console.error('First peak data:', peaksData[0])
          setPeaks([])
          setPeaksWithStatus([])
          return
        }
      }
      
      if (categoryParam === 'korona-europy' && peaksData && peaksData.length > 0) {
        // If we're looking for European peaks but got data with 'mountain_range' field and no 'country', it's Polish data
        if (peaksData[0].mountain_range && !peaksData[0].country) {
          console.error('CRITICAL ERROR: Got Polish peaks data for European category! Table peaks_europe might not exist.')
          console.error('First peak data:', peaksData[0])
          setPeaks([])
          setPeaksWithStatus([])
          return
        }
        
        // TEMPORARILY DISABLED: Additional check for Polish peak names in European data
        // TODO: Fix the peaks_europe table data - it contains Polish peaks!
        const polishPeakNames = ['Rysy', 'Śnieżka', 'Łysica', 'Babia Góra', 'Turbacz', 'Radziejowa', 'Skrzyczne', 'Mogielica']
        const hasPolishPeaks = peaksData.some(peak => polishPeakNames.includes(peak.name))
        if (hasPolishPeaks) {
          console.warn('WARNING: Found Polish peak names in European data! This should be fixed in the database.')
          console.warn('Polish peaks found:', peaksData.filter(peak => polishPeakNames.includes(peak.name)).map(p => p.name))
          console.warn('All peaks in peaks_europe table:', peaksData.map(p => ({ name: p.name, country: p.country, mountain_range: p.mountain_range })))
          // TEMPORARILY ALLOW DATA TO PASS THROUGH
          // setPeaks([])
          // setPeaksWithStatus([])
          // return
        }
      }

      setPeaks(peaksData || [])

      // Load user achievements if logged in
      if (user) {
        const userId = (user as User).id
        console.log('User is logged in, userId:', userId)
        
        // Get user stats
        const stats = await getUserStats(userId)
        console.log('User stats:', stats)
        setUserStats(stats)

        // Get user achievements for current category
        const categoryDb = categoryParam === 'korona-europy' ? 'korona_europy' : 'korona_polski'
        console.log('Fetching achievements for user:', userId, 'category:', categoryDb)
        const { data: achievementsData, error: achievementsError } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', userId)
          .eq('category', categoryDb)

        console.log('Achievements query result:', achievementsData)
        console.log('Achievements error:', achievementsError)

        if (achievementsError) {
          console.error('Error fetching achievements:', achievementsError)
          setUserAchievements([])
        } else {
          console.log('Setting user achievements:', achievementsData?.length, 'achievements')
          setUserAchievements(achievementsData || [])
        }

        // Create peaks with completion status and dates
        if (peaksData) {
          console.log('DEBUG: peaksData sample:', peaksData.slice(0, 2))
          console.log('DEBUG: achievementsData:', achievementsData)
          
          const peaksWithCompletionStatus = peaksData.map(peak => {
            const achievement = achievementsData?.find(a => {
              if (category === 'korona-europy') {
                return a.peak_europe_id === peak.id
              } else {
                return a.peak_poland_id === peak.id
              }
            })
            console.log(`DEBUG: Peak ${peak.name} (id: ${peak.id}) - looking for achievement with peak_${category === 'korona-europy' ? 'europe' : 'poland'}_id: ${peak.id}`)
            console.log(`DEBUG: Found achievement:`, achievement)
            return {
              ...peak,
              isCompleted: !!achievement,
              completionDate: achievement?.date || null
            }
          })
          console.log('Peaks with completion status:', peaksWithCompletionStatus.filter(p => p.isCompleted))
          console.log('User achievements:', achievementsData)
          console.log('Setting peaksWithStatus with', peaksWithCompletionStatus.length, 'peaks')
          setPeaksWithStatus(peaksWithCompletionStatus)
          
          // Find the highest conquered peak
          const conqueredPeaks = peaksWithCompletionStatus.filter(p => p.isCompleted)
          if (conqueredPeaks.length > 0) {
            const highest = conqueredPeaks.reduce((prev, current) => 
              (prev.height_m > current.height_m) ? prev : current
            )
            setHighestConqueredPeak(highest)
          } else {
            setHighestConqueredPeak(null)
          }
        }
      } else {
        // If not logged in, show all peaks as not completed
        if (peaksData) {
          // CRITICAL: Check if we got data for the wrong table (same validation as for logged users)
          if (categoryParam === 'korona-polski' && peaksData.length > 0) {
            // If we're looking for Polish peaks but got data with 'country' field, it's European data
            if (peaksData[0].country) {
              console.error('CRITICAL ERROR: Got European peaks data for Polish category (non-logged user)! Table peaks_poland might not exist.')
              console.error('First peak data:', peaksData[0])
              setPeaks([])
              setPeaksWithStatus([])
              return
            }
          }
          
          if (categoryParam === 'korona-europy' && peaksData.length > 0) {
            // If we're looking for European peaks but got data with 'mountain_range' field and no 'country', it's Polish data
            if (peaksData[0].mountain_range && !peaksData[0].country) {
              console.error('CRITICAL ERROR: Got Polish peaks data for European category (non-logged user)! Table peaks_europe might not exist.')
              console.error('First peak data:', peaksData[0])
              setPeaks([])
              setPeaksWithStatus([])
              return
            }
            
            // TEMPORARILY DISABLED: Additional check for Polish peak names in European data
            // TODO: Fix the peaks_europe table data - it contains Polish peaks!
            const polishPeakNames = ['Rysy', 'Śnieżka', 'Łysica', 'Babia Góra', 'Turbacz', 'Radziejowa', 'Skrzyczne', 'Mogielica']
            const hasPolishPeaks = peaksData.some(peak => polishPeakNames.includes(peak.name))
            if (hasPolishPeaks) {
              console.warn('WARNING: Found Polish peak names in European data (non-logged user)! This should be fixed in the database.')
              console.warn('Polish peaks found:', peaksData.filter(peak => polishPeakNames.includes(peak.name)).map(p => p.name))
              console.warn('All peaks in peaks_europe table:', peaksData.map(p => ({ name: p.name, country: p.country, mountain_range: p.mountain_range })))
              // TEMPORARILY ALLOW DATA TO PASS THROUGH
              // setPeaks([])
              // setPeaksWithStatus([])
              // return
            }
          }
          
          // If we get here, data is valid
          setPeaks(peaksData || [])
          const peaksWithCompletionStatus = peaksData.map(peak => ({
            ...peak,
            isCompleted: false,
            completionDate: null
          }))
          console.log('Setting peaksWithStatus for non-logged user with', peaksWithCompletionStatus.length, 'peaks')
          setPeaksWithStatus(peaksWithCompletionStatus)
        } else {
          setPeaks([])
          setPeaksWithStatus([])
        }
        setUserAchievements([])
        setHighestConqueredPeak(null)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setDataLoading(false)
    }
  }



  console.log('Current category:', category)
  console.log('Category type:', typeof category)
  
  // Show loading while category is being set
  if (!category) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
        <p className="text-gray-600">Ładowanie...</p>
      </div>
    </div>
  }
  
  if (category !== 'korona-europy' && category !== 'korona-polski') {
    return <div>Strona w trakcie budowy - category: {category}</div>
  }

  const completedCount = category === 'korona-europy' ? userStats.korona_europy : userStats.korona_polski
  const totalCount = category === 'korona-europy' ? 46 : 28  // Fixed total counts
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  
  console.log('Current URL category:', category)
  console.log('Completed count:', completedCount)
  console.log('Total count (fixed):', totalCount)
  console.log('Peaks loaded:', peaks.length)

  const handleSort = (column: 'country' | 'height' | 'mountain_range') => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Set new column and default to asc
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  // Filter and sort peaks based on current settings
  const filteredAndSortedPeaks = [...peaksWithStatus]
    .filter(peak => {
      if (filter === 'completed') return peak.isCompleted
      if (filter === 'remaining') return !peak.isCompleted
      return true // 'all' shows everything
    })
    .sort((a, b) => {
      if (sortBy === 'country') {
        const comparison = (a.country || '').localeCompare(b.country || '', 'pl')
        return sortOrder === 'asc' ? comparison : -comparison
      } else if (sortBy === 'mountain_range') {
        const comparison = (a.mountain_range || '').localeCompare(b.mountain_range || '', 'pl')
        return sortOrder === 'asc' ? comparison : -comparison
      } else {
        const comparison = a.height_m - b.height_m
        return sortOrder === 'asc' ? comparison : -comparison
      }
    })

  console.log('Current filter:', filter)
  console.log('Filtered peaks count:', filteredAndSortedPeaks.length)
  console.log('Completed peaks in filtered:', filteredAndSortedPeaks.filter(p => p.isCompleted).length)

  const actualCompletedCount = peaksWithStatus.filter(peak => peak.isCompleted).length
  const remainingCount = peaksWithStatus.filter(peak => !peak.isCompleted).length

  console.log('peaksWithStatus length:', peaksWithStatus.length)
  console.log('peaksWithStatus completed:', peaksWithStatus.filter(p => p.isCompleted))
  console.log('user:', user)
  console.log('userStats:', userStats)
  console.log('dataLoading:', dataLoading)
  console.log('filteredAndSortedPeaks length:', filteredAndSortedPeaks.length)
  console.log('filteredAndSortedPeaks completed:', filteredAndSortedPeaks.filter(p => p.isCompleted))
  console.log('filteredAndSortedPeaks sample:', filteredAndSortedPeaks.slice(0, 3))
  console.log('filteredAndSortedPeaks sample isCompleted:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted })))
  console.log('filteredAndSortedPeaks sample completionDate:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, completionDate: p.completionDate })))
  console.log('filteredAndSortedPeaks sample full:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id })))
  console.log('filteredAndSortedPeaks sample full with all props:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m })))
  console.log('filteredAndSortedPeaks sample full with all props and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id, category: p.category })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id, category: p.category, user_id: p.user_id })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more and more and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id, category: p.category, user_id: p.user_id, notes: p.notes })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more and more and more and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id, category: p.category, user_id: p.user_id, notes: p.notes, date: p.date })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more and more and more and more and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id, category: p.category, user_id: p.user_id, notes: p.notes, date: p.date, location: p.location })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more and more and more and more and more and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id, category: p.category, user_id: p.user_id, notes: p.notes, date: p.date, location: p.location })))
  console.log('filteredAndSortedPeaks sample full with all props and more and more and more and more and more and more and more and more and more:', filteredAndSortedPeaks.slice(0, 3).map(p => ({ name: p.name, isCompleted: p.isCompleted, completionDate: p.completionDate, id: p.id, country: p.country, height_m: p.height_m, peak_europe_id: p.peak_europe_id, peak_poland_id: p.peak_poland_id, category: p.category, user_id: p.user_id, notes: p.notes, date: p.date, location: p.location, elevation: p.elevation })))
  
  // Debug coordinates
  const peaksWithCoords = peaksWithStatus.filter(peak => peak.latitude && peak.longitude && !isNaN(peak.latitude) && !isNaN(peak.longitude))
  const peaksWithoutCoords = peaksWithStatus.filter(peak => !peak.latitude || !peak.longitude || isNaN(peak.latitude) || isNaN(peak.longitude))
  console.log('Peaks with valid coordinates:', peaksWithCoords.length)
  console.log('Peaks without valid coordinates:', peaksWithoutCoords.length)
  console.log('Peaks without coords sample:', peaksWithoutCoords.slice(0, 3).map(p => ({ name: p.name, latitude: p.latitude, longitude: p.longitude })))

  const openAddModal = (peak: Peak) => {
    setSelectedPeak(peak)
    setShowAddModal(true)
  }

  const handleAddAchievement = async (formData: AchievementFormData) => {
    if (!user) return

    try {
      const userId = (user as User).id
      
      // Find the selected peak
      const selectedPeak = peaks.find(p => p.id === formData.peak_id)
      
      // Prepare achievement data
      const achievementData = {
        user_id: userId,
        category: formData.category,
        ...(category === 'korona-europy' 
          ? { peak_europe_id: formData.peak_id }
          : { peak_poland_id: formData.peak_id }
        ),
        date: formData.date,
        notes: formData.notes || null,
        name: selectedPeak?.name || '',
        location: category === 'korona-europy' ? (selectedPeak?.country || '') : (selectedPeak?.mountain_range || '')
      }

      // Insert achievement
      const { error } = await supabase
        .from('achievements')
        .insert([achievementData])

      if (error) {
        console.error('Error adding achievement:', error)
        throw error
      }

      // Refresh data to update table and statistics
      await fetchPeaks()
    } catch (error) {
      console.error('Error in handleAddAchievement:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-orange-50/10 to-stone-100">

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: category === 'korona-europy' ? 'url(/europe.png)' : 'url(/poland.png)'
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            {category === 'korona-europy' ? 'Korona Europy' : 'Korona Polski'}
          </h1>
          <p className="text-xl font-medium opacity-90 leading-relaxed">
            {category === 'korona-europy' 
              ? '46 najwyższych szczytów Europy czeka na Twoje podboje'
              : '28 najwyższych szczytów każdego województwa w Polsce czeka na Twoje podboje'
            }
          </p>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="relative -mt-20 mb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Ukończone */}
            <div className="bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {dataLoading ? '...' : completedCount}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider">Ukończone</div>
              </div>
            </div>

            {/* Pozostało */}
            <div className="bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {dataLoading ? '...' : totalCount - completedCount}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider">Pozostało</div>
              </div>
            </div>

            {/* Postęp */}
            <div className="bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {dataLoading ? '...' : `${percentage}%`}
                </div>
                <div className="text-sm text-white/80 uppercase tracking-wider">Postęp</div>
              </div>
            </div>

            {/* Najwyższy zdobyty */}
            <div className="bg-black/20 backdrop-blur-md text-white border border-white/20 rounded-xl p-6 shadow-lg">
              {dataLoading ? (
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">...</div>
                  <div className="text-sm text-white/80 uppercase tracking-wider">Ładowanie...</div>
                </div>
              ) : highestConqueredPeak ? (
                <div className="text-center">
                  <div className="text-sm text-white/80 mb-1">Najwyższy zdobyty</div>
                  <div className="font-bold text-xl text-white">{highestConqueredPeak.name}</div>
                  <div className="text-sm text-white/70">{highestConqueredPeak.country} • {highestConqueredPeak.height_m}m</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-lg font-medium text-white">Rozpocznij przygodę!</div>
                  <div className="text-sm text-white/70 mt-1">Zdobyj swój pierwszy szczyt</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center text-stone-900">Mapa Twoich Zdobyczy</h2>
          <div className="flex justify-center gap-6 mb-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Zdobyte ({actualCompletedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span>Do zdobycia ({remainingCount})</span>
            </div>
          </div>
          <div className="h-[500px] rounded-xl overflow-hidden shadow-lg border border-stone-200/50">
            {dataLoading ? (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Ładowanie mapy...</p>
                </div>
              </div>
            ) : peaksWithStatus.length === 0 ? (
              <div className="h-full flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <p className="text-gray-600">
                    {category === 'korona-polski' 
                      ? 'Brak danych o szczytach Polski do wyświetlenia na mapie.'
                      : 'Brak danych o szczytach do wyświetlenia na mapie.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <DynamicMap peaks={filteredAndSortedPeaks} onAddPeak={openAddModal} category={category} />
            )}
          </div>
        </div>
      </div>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Peaks Table */}
          <section className="mb-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-stone-900 mb-3 text-center">
                Wszystkie szczyty {category === 'korona-europy' ? 'Korony Europy' : 'Korony Polski'}
                </h2>
              <p className="text-stone-600 text-center">
                Lista wszystkich {category === 'korona-europy' ? '46' : '28'} szczytów do zdobycia. Oznaczone na zielono zostały już ukończone.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 mb-4 justify-center">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 transition-all duration-200 ${
                  filter === 'all' 
                    ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Wszystkie ({totalCount})
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 transition-all duration-200 ${
                  filter === 'completed' 
                    ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Zdobyte ({actualCompletedCount})
              </button>
              <button 
                onClick={() => setFilter('remaining')}
                className={`px-4 py-2 transition-all duration-200 ${
                  filter === 'remaining' 
                    ? 'border-b-2 border-orange-600 text-orange-600 font-semibold' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pozostałe ({remainingCount})
              </button>
            </div>

            {dataLoading ? (
              <div className="text-center py-12">
                <div className="text-stone-500">Ładowanie szczytów...</div>
              </div>
            ) : peaks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-stone-500">
                  {category === 'korona-polski' 
                    ? 'Tabela peaks_poland nie została jeszcze utworzona w bazie danych. Skontaktuj się z administratorem.'
                    : 'Brak danych o szczytach.'
                  }
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-stone-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-stone-50/80 border-b border-stone-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-stone-700">Szczyt</th>
                        <th 
                          className="px-6 py-4 text-left text-sm font-semibold text-stone-700 cursor-pointer hover:text-orange-600 transition-colors duration-200 select-none"
                          onClick={() => handleSort(category === 'korona-europy' ? 'country' : 'mountain_range')}
                        >
                          <div className="flex items-center gap-2">
                            {category === 'korona-europy' ? 'Kraj' : 'Pasmo górskie'}
                            <div className="flex flex-col">
                              <svg 
                                className={`w-3 h-3 ${sortBy === (category === 'korona-europy' ? 'country' : 'mountain_range') && sortOrder === 'asc' ? 'text-orange-600' : 'text-stone-400'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                              <svg 
                                className={`w-3 h-3 -mt-1 ${sortBy === (category === 'korona-europy' ? 'country' : 'mountain_range') && sortOrder === 'desc' ? 'text-orange-600' : 'text-stone-400'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </th>
                        <th 
                          className="px-6 py-4 text-left text-sm font-semibold text-stone-700 cursor-pointer hover:text-orange-600 transition-colors duration-200 select-none"
                          onClick={() => handleSort('height')}
                        >
                          <div className="flex items-center gap-2">
                            Wysokość
                            <div className="flex flex-col">
                              <svg 
                                className={`w-3 h-3 ${sortBy === 'height' && sortOrder === 'asc' ? 'text-orange-600' : 'text-stone-400'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                              <svg 
                                className={`w-3 h-3 -mt-1 ${sortBy === 'height' && sortOrder === 'desc' ? 'text-orange-600' : 'text-stone-400'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-stone-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedPeaks.map((peak, index) => {
                        const formatDate = (dateString: string) => {
                          return new Date(dateString).toLocaleDateString('pl-PL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        }

                        return (
                          <tr 
                            key={peak.id} 
                            className={`hover:bg-stone-50/50 transition-all duration-200 border-b border-gray-100 ${
                              peak.isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500' : ''
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className={`font-medium flex items-center ${peak.isCompleted ? 'text-green-900' : 'text-stone-900'}`}>
                                {peak.isCompleted && <span className="text-green-600 mr-2">✓</span>}
                                {peak.name}
                              </div>
                            </td>
                            <td className={`px-6 py-4 ${peak.isCompleted ? 'text-green-700' : 'text-stone-600'}`}>
                              {category === 'korona-europy' ? (peak.country || '') : (peak.mountain_range || '')}
                            </td>
                            <td className={`px-6 py-4 ${peak.isCompleted ? 'text-green-700' : 'text-stone-600'}`}>
                              {peak.height_m}m n.p.m.
                            </td>
                            <td className="px-6 py-4 text-center">
                              {peak.isCompleted ? (
                                <div className="flex flex-col items-center space-y-1">
                                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-help">
                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Zdobyty
                                  </span>
                                  {peak.completionDate && (
                                    <span className="text-xs text-green-600 font-medium">
                                      {formatDate(peak.completionDate)}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-center gap-2">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-stone-100 text-stone-600">
                                    Do zdobycia
                                  </span>
                                  {user && (
                                    <button
                                      onClick={() => openAddModal(peak)}
                                      className="w-6 h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
                                      title="Dodaj osiągnięcie"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
                  </div>
      </main>

      {/* Floating Add Button */}
      {user && (
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105 z-40"
        >
          <span className="text-2xl">+</span>
          Dodaj szczyt
        </button>
      )}

      {/* Add Achievement Modal */}
      {showAddModal && (
        <AddAchievementModal
          onClose={() => {
            setShowAddModal(false)
            setSelectedPeak(null)
          }}
          onSubmit={handleAddAchievement}
          user={user}
          initialCategory={category === 'korona-europy' ? 'korona_europy' : 'korona_polski'}
          selectedPeak={selectedPeak}
        />
      )}
                </div>
  )
}

// AddAchievementModal Component - Same as dashboard
function AddAchievementModal({ onClose, onSubmit, user, initialCategory, selectedPeak }: AddAchievementModalProps) {
  const [formData, setFormData] = useState({
    category: initialCategory || '',
    peak_id: '',
    custom_name: '',
    location: '',
    country: '',
    city: '',
    date: new Date().toISOString().split('T')[0],
    elevation: '',
    distance: '',
    time: '',
    race_type: '',
    place: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [peaks, setPeaks] = useState<Peak[]>([])
  const [loadingPeaks, setLoadingPeaks] = useState(false)
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])

  // Set selected peak when provided
  useEffect(() => {
    if (selectedPeak) {
      setFormData(prev => ({
        ...prev,
        peak_id: selectedPeak.id
      }))
    }
  }, [selectedPeak])

  // Fetch peaks when category changes
  useEffect(() => {
    const fetchPeaks = async () => {
      if (formData.category === 'korona_europy' || formData.category === 'korona_polski') {
        setLoadingPeaks(true)
        try {
          // Fetch user's already achieved peaks
          const { data: userAchievementsData } = await supabase
            .from('achievements')
            .select('id, peak_europe_id, peak_poland_id, category, completion_date, notes, user_id')
            .eq('user_id', user?.id)

          setUserAchievements((userAchievementsData as DatabaseAchievement[] || []).map((item: DatabaseAchievement) => ({
            id: item.id,
            peak_europe_id: item.peak_europe_id,
            peak_poland_id: item.peak_poland_id,
            category: item.category,
            completion_date: item.completion_date,
            notes: item.notes
          })))

          const tableName = formData.category === 'korona_europy' ? 'peaks_europe' : 'peaks_poland'
          const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .order(formData.category === 'korona_europy' ? 'country' : 'mountain_range')
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
  }, [formData.category, user?.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSubmit({
        ...formData,
        completion_date: formData.date || new Date().toISOString().split('T')[0]
      })
      onClose()
    } catch (error) {
      console.error('Error submitting achievement:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
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
                <option value="korona_europy">Korona Europy</option>
                <option value="korona_polski">Korona Polski</option>
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
                            {formData.category === 'korona_europy' ? (peak.country || '') : (peak.mountain_range || '')} - {peak.name} ({peak.height_m}m)
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
                            {formData.category === 'korona_europy' ? (peak.country || '') : (peak.mountain_range || '')} - {peak.name} ({peak.height_m}m) (✓ Zdobyty)
                          </option>
                        ))}
                    </select>
                  )}
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
