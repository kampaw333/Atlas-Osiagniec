'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '../providers/AuthProvider'
import { supabase } from '@/lib/supabase'

export default function Header() {
  const { user, loading, signOut } = useAuth()
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  // Fetch profile data when user changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null)
        return
      }

      setProfileLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
        } else {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error in fetchProfile:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition duration-200">
              Atlas Osiągnięć
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Strona główna
            </Link>
            <Link 
              href="/korona-europy" 
              className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Korona Europy
            </Link>
            <Link 
              href="/korona-polski" 
              className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Korona Polski
            </Link>
            <Link 
              href="/maratony" 
              className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Zawody Biegowe
            </Link>
            <Link 
              href="/bieganie" 
              className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Bieganie
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
              >
                Mój Profil
              </Link>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading || profileLoading ? (
              <div className="text-gray-500">Ładowanie...</div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">
                  {profile?.username || 'Użytkownik'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                >
                  Wyloguj
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-orange-600 font-medium transition duration-200"
                >
                  Zaloguj
                </Link>
                <Link
                  href="/register"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition duration-200"
                >
                  Zarejestruj
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <Link 
              href="/" 
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Strona główna
            </Link>
            <Link 
              href="/korona-europy" 
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Korona Europy
            </Link>
            <Link 
              href="/korona-polski" 
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Korona Polski
            </Link>
            <Link 
              href="/maratony" 
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Zawody Biegowe
            </Link>
            <Link 
              href="/bieganie" 
              className="block px-3 py-2 text-gray-700 hover:text-orange-600 font-medium transition duration-200"
            >
              Bieganie
            </Link>
            {user && (
              <Link 
                href="/dashboard" 
                className="block px-3 py-2 text-gray-700 hover:text-orange-600 font-medium transition duration-200"
              >
                Mój Profil
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
