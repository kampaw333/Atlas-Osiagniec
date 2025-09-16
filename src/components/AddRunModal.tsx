'use client';

import { useState } from 'react';

interface AddRunModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRun: (runData: any) => void;
}

// Hardcoded coordinates for major cities
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  // Poland
  'Warszawa': { lat: 52.2297, lng: 21.0122 },
  'Kraków': { lat: 50.0647, lng: 19.9450 },
  'Gdańsk': { lat: 54.3520, lng: 18.6466 },
  'Gdynia': { lat: 54.5189, lng: 18.5305 },
  'Wrocław': { lat: 51.1079, lng: 17.0385 },
  'Poznań': { lat: 52.4064, lng: 16.9252 },
  'Łódź': { lat: 51.7592, lng: 19.4560 },
  'Katowice': { lat: 50.2649, lng: 19.0238 },
  'Zabrze': { lat: 50.3249, lng: 18.7857 },
  'Suwałki': { lat: 54.0484, lng: 22.9289 },
  
  // Europe
  'Berlin': { lat: 52.5200, lng: 13.4050 },
  'Praga': { lat: 50.0755, lng: 14.4378 },
  'Wiedeń': { lat: 48.2082, lng: 16.3738 },
  'Paryż': { lat: 48.8566, lng: 2.3522 },
  'Londyn': { lat: 51.5074, lng: -0.1278 },
  'Rzym': { lat: 41.9028, lng: 12.4964 },
  'Madryt': { lat: 40.4168, lng: -3.7038 },
  'Amsterdam': { lat: 52.3676, lng: 4.9041 },
  'Bruksela': { lat: 50.8503, lng: 4.3517 },
  'Zurych': { lat: 47.3769, lng: 8.5417 },
  'Stavanger': { lat: 58.9700, lng: 5.7331 },
  'Sofia': { lat: 42.6977, lng: 23.3219 },
  'Budapeszt': { lat: 47.4979, lng: 19.0402 },
  'Sztokholm': { lat: 59.3293, lng: 18.0686 },
  'Kopenhaga': { lat: 55.6761, lng: 12.5683 },
  'Helsinki': { lat: 60.1699, lng: 24.9384 },
  'Dublin': { lat: 53.3498, lng: -6.2603 },
  'Lizbona': { lat: 38.7223, lng: -9.1393 },
  'Ateny': { lat: 37.9838, lng: 23.7275 },
  'Zagrzeb': { lat: 45.8150, lng: 15.9819 },
  'Lublana': { lat: 46.0569, lng: 14.5058 },
  'Tallinn': { lat: 59.4370, lng: 24.7536 },
  'Ryga': { lat: 56.9496, lng: 24.1052 },
  'Wilno': { lat: 54.6872, lng: 25.2797 }
};

const countries = [
  'Polska', 'Niemcy', 'Czechy', 'Austria', 'Francja', 'Wielka Brytania', 
  'Włochy', 'Hiszpania', 'Holandia', 'Belgia', 'Szwajcaria', 'Norwegia', 
  'Bułgaria', 'Węgry', 'Szwecja', 'Dania', 'Finlandia', 'Irlandia', 
  'Portugalia', 'Grecja', 'Chorwacja', 'Słowenia', 'Estonia', 'Łotwa', 'Litwa'
];

const voivodeships = [
  'Dolnośląskie', 'Kujawsko-pomorskie', 'Lubelskie', 'Lubuskie', 'Łódzkie',
  'Małopolskie', 'Mazowieckie', 'Opolskie', 'Podkarpackie', 'Podlaskie',
  'Pomorskie', 'Śląskie', 'Świętokrzyskie', 'Warmińsko-mazurskie', 'Wielkopolskie', 'Zachodniopomorskie'
];

export default function AddRunModal({ isOpen, onClose, onAddRun }: AddRunModalProps) {
  const [formData, setFormData] = useState({
    country: 'Polska',
    city: '',
    voivodeship: '',
    distance: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get coordinates for the city
      const coordinates = cityCoordinates[formData.city] || { lat: 0, lng: 0 };
      
      const runData = {
        id: `${formData.city.toLowerCase()}-${Date.now()}`,
        city: formData.city,
        country: formData.country,
        voivodeship: formData.country === 'Polska' ? formData.voivodeship : undefined,
        date: formData.date,
        distance: parseFloat(formData.distance),
        lat: coordinates.lat,
        lng: coordinates.lng,
        notes: ''
      };

      await onAddRun(runData);
      
      // Reset form
      setFormData({
        country: 'Polska',
        city: '',
        voivodeship: '',
        distance: '',
        date: new Date().toISOString().split('T')[0]
      });
      
      onClose();
    } catch (error) {
      console.error('Error adding run:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 title-outdoor">
              Dodaj nowy bieg
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kraj
              </label>
              <select
                value={formData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Miasto
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Wpisz nazwę miasta"
                required
              />
            </div>

            {/* Voivodeship (only for Poland) */}
            {formData.country === 'Polska' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Województwo
                </label>
                <select
                  value={formData.voivodeship}
                  onChange={(e) => handleInputChange('voivodeship', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="">Wybierz województwo</option>
                  {voivodeships.map(voivodeship => (
                    <option key={voivodeship} value={voivodeship}>{voivodeship}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dystans (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="np. 10.5"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Dodawanie...' : 'Dodaj bieg'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

