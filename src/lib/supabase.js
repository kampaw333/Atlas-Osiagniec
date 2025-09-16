// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

// Próbujemy najpierw z env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xqmepegvqrmnaqsjaeld.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxbWVwZWd2cXJtbmFxc2phZWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3NTQzMDgsImV4cCI6MjA3MjMzMDMwOH0.ms9E5009_2dW37xnVRtEVXpluynDR3FJ5t4uP30R0Cw'

// Development warning
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('⚠️ Using hardcoded Supabase credentials. Set env variables for production!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function
export async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .single()
    
    if (error) throw error
    console.log('✅ Supabase connected successfully')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}