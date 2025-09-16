import { supabase } from './supabase'

export async function getUserStats(userId) {
  if (!userId) {
    return {
      korona_europy: 0,
      korona_polski: 0,
      kraje: 0,
      zawody: 0
    }
  }

  try {
    // Fetch achievements for korona_europy (count distinct peak_europe_id)
    const { data: europyData, error: europyError } = await supabase
      .from('achievements')
      .select('peak_europe_id')
      .eq('user_id', userId)
      .eq('category', 'korona_europy')
      .not('peak_europe_id', 'is', null)

    // Fetch achievements for korona_polski (count distinct peak_poland_id)
    const { data: polskiData, error: polskiError } = await supabase
      .from('achievements')
      .select('peak_poland_id')
      .eq('user_id', userId)
      .eq('category', 'korona_polski')
      .not('peak_poland_id', 'is', null)

    // Fetch unique countries from bieganie
    const { data: bieganieData, error: bieganieError } = await supabase
      .from('achievements')
      .select('location')
      .eq('user_id', userId)
      .eq('category', 'bieganie')

    // Fetch zawody count
    const { data: zawodyData, error: zawodyError } = await supabase
      .from('achievements')
      .select('id')
      .eq('user_id', userId)
      .eq('category', 'zawody')

    if (europyError || polskiError || bieganieError || zawodyError) {
      console.error('Error fetching user stats:', { europyError, polskiError, bieganieError, zawodyError })
      return {
        korona_europy: 0,
        korona_polski: 0,
        kraje: 0,
        zawody: 0
      }
    }

    // Count distinct peak_europe_id for korona_europy
    const uniqueEuropyPeaks = new Set(europyData?.map(item => item.peak_europe_id) || [])
    
    // Count distinct peak_poland_id for korona_polski
    const uniquePolskiPeaks = new Set(polskiData?.map(item => item.peak_poland_id) || [])
    
    // Count unique countries from bieganie
    const uniqueCountries = new Set(bieganieData?.map(item => item.location) || [])

    return {
      korona_europy: uniqueEuropyPeaks.size,
      korona_polski: uniquePolskiPeaks.size,
      kraje: uniqueCountries.size,
      zawody: zawodyData?.length || 0
    }
  } catch (error) {
    console.error('Error in getUserStats:', error)
    return {
      korona_europy: 0,
      korona_polski: 0,
      kraje: 0,
      zawody: 0
    }
  }
}



