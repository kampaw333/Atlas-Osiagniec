'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Running {
  id: string;
  city: string;
  country: string;
  date: string;
  notes: string;
  voivodeship?: string;
}

interface EuropeMapProps {
  runnings: Running[];
}

export default function EuropeMap({ runnings }: EuropeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Fix dla ikon Leaflet w Next.js
    delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Inicjalizacja mapy
    const map = L.map(mapRef.current).setView([54.5260, 15.2551], 4); // Centrum Europy

    // Dodanie warstwy OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Kraje gdzie biegałeś (zielone)
    const visitedCountries = new Set(runnings.map(r => r.country));
    
    // Koordynaty krajów Europy (uproszczone)
    const europeCountries = {
      'Polska': { lat: 51.9194, lng: 19.1451, color: visitedCountries.has('Polska') ? '#22c55e' : '#9ca3af' },
      'Norwegia': { lat: 60.4720, lng: 8.4689, color: visitedCountries.has('Norwegia') ? '#22c55e' : '#9ca3af' },
      'Bułgaria': { lat: 42.7339, lng: 25.4858, color: visitedCountries.has('Bułgaria') ? '#22c55e' : '#9ca3af' },
      'Niemcy': { lat: 51.1657, lng: 10.4515, color: visitedCountries.has('Niemcy') ? '#22c55e' : '#9ca3af' },
      'Czechy': { lat: 49.8175, lng: 15.4730, color: visitedCountries.has('Czechy') ? '#22c55e' : '#9ca3af' },
      'Francja': { lat: 46.2276, lng: 2.2137, color: visitedCountries.has('Francja') ? '#22c55e' : '#9ca3af' },
      'Włochy': { lat: 41.8719, lng: 12.5674, color: visitedCountries.has('Włochy') ? '#22c55e' : '#9ca3af' },
      'Hiszpania': { lat: 40.4637, lng: -3.7492, color: visitedCountries.has('Hiszpania') ? '#22c55e' : '#9ca3af' },
      'Wielka Brytania': { lat: 55.3781, lng: -3.4360, color: visitedCountries.has('Wielka Brytania') ? '#22c55e' : '#9ca3af' },
      'Holandia': { lat: 52.1326, lng: 5.2913, color: visitedCountries.has('Holandia') ? '#22c55e' : '#9ca3af' },
      'Belgia': { lat: 50.8503, lng: 4.3517, color: visitedCountries.has('Belgia') ? '#22c55e' : '#9ca3af' },
      'Austria': { lat: 47.5162, lng: 14.5501, color: visitedCountries.has('Austria') ? '#22c55e' : '#9ca3af' },
      'Szwajcaria': { lat: 46.8182, lng: 8.2275, color: visitedCountries.has('Szwajcaria') ? '#22c55e' : '#9ca3af' },
      'Słowacja': { lat: 48.6690, lng: 19.6990, color: visitedCountries.has('Słowacja') ? '#22c55e' : '#9ca3af' },
      'Węgry': { lat: 47.1625, lng: 19.5033, color: visitedCountries.has('Węgry') ? '#22c55e' : '#9ca3af' },
      'Rumunia': { lat: 45.9432, lng: 24.9668, color: visitedCountries.has('Rumunia') ? '#22c55e' : '#9ca3af' },
      'Grecja': { lat: 39.0742, lng: 21.8243, color: visitedCountries.has('Grecja') ? '#22c55e' : '#9ca3af' },
      'Chorwacja': { lat: 45.1000, lng: 15.2000, color: visitedCountries.has('Chorwacja') ? '#22c55e' : '#9ca3af' },
      'Słowenia': { lat: 46.0569, lng: 14.5058, color: visitedCountries.has('Słowenia') ? '#22c55e' : '#9ca3af' },
      'Estonia': { lat: 58.5953, lng: 25.0136, color: visitedCountries.has('Estonia') ? '#22c55e' : '#9ca3af' },
      'Łotwa': { lat: 56.8796, lng: 24.6032, color: visitedCountries.has('Łotwa') ? '#22c55e' : '#9ca3af' },
      'Litwa': { lat: 55.1694, lng: 23.8813, color: visitedCountries.has('Litwa') ? '#22c55e' : '#9ca3af' },
      'Finlandia': { lat: 61.9241, lng: 25.7482, color: visitedCountries.has('Finlandia') ? '#22c55e' : '#9ca3af' },
      'Szwecja': { lat: 60.1282, lng: 18.6435, color: visitedCountries.has('Szwecja') ? '#22c55e' : '#9ca3af' },
      'Dania': { lat: 56.2639, lng: 9.5018, color: visitedCountries.has('Dania') ? '#22c55e' : '#9ca3af' },
      'Irlandia': { lat: 53.4129, lng: -8.2439, color: visitedCountries.has('Irlandia') ? '#22c55e' : '#9ca3af' },
      'Portugalia': { lat: 39.3999, lng: -8.2245, color: visitedCountries.has('Portugalia') ? '#22c55e' : '#9ca3af' }
    };

    // Dodanie markerów dla każdego kraju
    Object.entries(europeCountries).forEach(([country, coords]) => {
      const countryRunnings = runnings.filter(r => r.country === country);
      const runCount = countryRunnings.length;
      
      const marker = L.circleMarker([coords.lat, coords.lng], {
        radius: runCount > 0 ? 12 : 8,
        fillColor: coords.color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);

      // Tooltip z liczbą biegów
      if (runCount > 0) {
        marker.bindTooltip(`
          <div class="text-center">
            <strong>${country}</strong><br>
            <span class="text-orange-600">${runCount} bieg${runCount > 1 ? 'ów' : ''}</span>
          </div>
        `, { permanent: false, direction: 'top' });
      } else {
        marker.bindTooltip(country, { permanent: false, direction: 'top' });
      }
    });

    // Dodanie markerów dla konkretnych miast gdzie biegałeś
    runnings.forEach((running) => {
      const countryCoords = europeCountries[running.country as keyof typeof europeCountries];
      if (countryCoords) {
        // Dostosuj pozycję markera miasta względem kraju
        let cityLat = countryCoords.lat;
        let cityLng = countryCoords.lng;
        
        // Specjalne pozycje dla miast w Polsce
        if (running.country === 'Polska') {
          switch (running.city) {
            case 'Warszawa':
              cityLat = 52.2297; cityLng = 21.0122;
              break;
            case 'Gdynia':
              cityLat = 54.5189; cityLng = 18.5305;
              break;
            case 'Zabrze':
              cityLat = 50.3249; cityLng = 18.7857;
              break;
            case 'Jezioro Wigry/Suwałki':
              cityLat = 54.0484; cityLng = 22.9289;
              break;
          }
        } else if (running.country === 'Norwegia' && running.city === 'Stavanger') {
          cityLat = 58.9700; cityLng = 5.7331;
        } else if (running.country === 'Bułgaria' && running.city === 'Sofia') {
          cityLat = 42.6977; cityLng = 23.3219;
        }

        const cityMarker = L.marker([cityLat, cityLng], {
          icon: L.divIcon({
            className: 'custom-div-icon',
            html: `<div class="w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow-lg"></div>`,
            iconSize: [12, 12],
            iconAnchor: [6, 6]
          })
        }).addTo(map);

        cityMarker.bindTooltip(`
          <div class="text-center">
            <strong>${running.city}</strong><br>
            <span class="text-sm text-gray-600">${running.country}</span><br>
            <span class="text-xs text-gray-500">${new Date(running.date).toLocaleDateString('pl-PL')}</span>
          </div>
        `, { permanent: false, direction: 'top' });
      }
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [runnings]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '250px' }}
    />
  );
}
