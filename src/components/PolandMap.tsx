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

interface PolandMapProps {
  runnings: Running[];
}

export default function PolandMap({ runnings }: PolandMapProps) {
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

    // Inicjalizacja mapy Polski z lepszym centrowaniem
    const map = L.map(mapRef.current).setView([52.0, 19.2], 6);

    // Dodanie warstwy OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Dodanie markerów dla konkretnych miast gdzie biegałeś
    runnings.filter(r => r.country === 'Polska' && r.voivodeship).forEach((running) => {
      let cityLat = 0;
      let cityLng = 0;
      
      // Dokładne pozycje dla miast
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
        default:
          // Domyślna pozycja w centrum Polski
          cityLat = 52.0; cityLng = 19.2;
      }

      const cityMarker = L.marker([cityLat, cityLng], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg"></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })
      }).addTo(map);

      cityMarker.bindTooltip(`
        <div class="text-center">
          <strong>${running.city}</strong><br>
          <span class="text-sm text-gray-600">${running.voivodeship}</span><br>
          <span class="text-xs text-gray-500">${new Date(running.date).toLocaleDateString('pl-PL')}</span>
        </div>
      `, { permanent: false, direction: 'top' });
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
    <div className="w-[90vw] h-[400px] md:w-full md:h-[500px] md:max-w-[600px] mx-auto">
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg shadow-md"
      />
    </div>
  );
}
