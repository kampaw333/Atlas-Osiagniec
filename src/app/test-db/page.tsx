'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TestDB() {
  const [status, setStatus] = useState('Sprawdzam połączenie...')

  useEffect(() => {
    async function checkConnection() {
      try {
        // Sprawdzamy czy możemy połączyć się z Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1)
          
        if (error) {
          setStatus(`Błąd: ${error.message}`)
        } else {
          setStatus('Połączenie z Supabase działa! ✅')
        }
      } catch (err) {
        setStatus('Nie mogę połączyć się z bazą danych')
      }
    }
    checkConnection()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Test Połączenia z Supabase</h1>
      <p className="text-lg">{status}</p>
    </div>
  )
}