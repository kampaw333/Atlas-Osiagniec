'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(null)
  const [checkingUsername, setCheckingUsername] = useState(false)
  const router = useRouter()

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameAvailable(null)
        return
      }

      setCheckingUsername(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', formData.username)
          .single()

        if (error && error.code === 'PGRST116') {
          // No rows found - username is available
          setUsernameAvailable(true)
        } else if (data) {
          // Username exists
          setUsernameAvailable(false)
        }
      } catch (err) {
        console.error('Error checking username:', err)
        setUsernameAvailable(null)
      } finally {
        setCheckingUsername(false)
      }
    }

    const timeoutId = setTimeout(checkUsername, 500) // Debounce
    return () => clearTimeout(timeoutId)
  }, [formData.username])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    
    if (!usernameAvailable) {
      setError('Nazwa użytkownika nie jest dostępna')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Create profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            username: formData.username,
            full_name: formData.full_name,
            email: formData.email,
            created_at: new Date().toISOString()
          })

        if (profileError) {
          setError('Błąd podczas tworzenia profilu: ' + profileError.message)
          return
        }

        router.push('/dashboard')
      }
    } catch (err) {
      setError('Wystąpił nieoczekiwany błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-orange-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dołącz do Atlas Osiągnięć
            </h1>
            <p className="text-gray-600">
              Rozpocznij śledzenie swoich przygód
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Nazwa użytkownika
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Wprowadź nazwę użytkownika"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {formData.username.length >= 3 && (
                  <div className="mt-1 text-sm">
                    {checkingUsername ? (
                      <span className="text-gray-500">Sprawdzanie dostępności...</span>
                    ) : usernameAvailable === true ? (
                      <span className="text-green-600">✓ Nazwa dostępna</span>
                    ) : usernameAvailable === false ? (
                      <span className="text-red-600">✗ Nazwa zajęta</span>
                    ) : null}
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Imię i nazwisko
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Wprowadź swoje imię i nazwisko"
                  value={formData.full_name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Wprowadź swój email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Hasło
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
                  placeholder="Wprowadź swoje hasło"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !usernameAvailable || checkingUsername}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition duration-200 disabled:bg-orange-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
            </button>

            <div className="text-center">
              <Link 
                href="/login" 
                className="text-orange-600 hover:text-orange-700 font-medium transition duration-200"
              >
                Masz już konto? Zaloguj się
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}




