'use client'

import { testConnection } from '@/lib/supabase'
import { useState } from 'react'

export default function TestDbPage() {
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTestConnection = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
      const success = await testConnection()
      setResult(success ? 'success' : 'fail')
      console.log('Test connection result:', success)
    } catch (error) {
      setResult('error')
      console.log('Test connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Test Supabase Connection</h1>
        
        <button
          onClick={handleTestConnection}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {isLoading ? 'Testing...' : 'Test Supabase Connection'}
        </button>

        {result && (
          <div className="mt-6 p-4 rounded-lg">
            {result === 'success' && (
              <div className="bg-green-800 border border-green-600 text-green-100 p-4 rounded-lg">
                <h3 className="font-semibold">✅ Connection Successful</h3>
                <p className="text-sm mt-1">Supabase is connected and working properly.</p>
              </div>
            )}
            {result === 'fail' && (
              <div className="bg-red-800 border border-red-600 text-red-100 p-4 rounded-lg">
                <h3 className="font-semibold">❌ Connection Failed</h3>
                <p className="text-sm mt-1">Unable to connect to Supabase. Check console for details.</p>
              </div>
            )}
            {result === 'error' && (
              <div className="bg-red-800 border border-red-600 text-red-100 p-4 rounded-lg">
                <h3 className="font-semibold">⚠️ Error Occurred</h3>
                <p className="text-sm mt-1">An error occurred during the test. Check console for details.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}




