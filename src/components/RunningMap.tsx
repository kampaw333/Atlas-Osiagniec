'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Running {
  id: string;
  city: string;
  country: string;
  voivodeship?: string;
  date: string;
  distance: number;
  lat: number;
  lng: number;
  notes: string;
}

interface RunningMapProps {
  runnings: Running[];
  view: 'europa' | 'polska';
}

export default function RunningMap({ runnings, view }: RunningMapProps) {
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

    // Ustawienia mapy w zależności od widoku
    const mapCenter = view === 'europa' ? [54.5260, 15.2551] : [52.2297, 19.1451];
    const mapZoom = view === 'europa' ? 4 : 6;

    // Inicjalizacja mapy
    const map = L.map(mapRef.current).setView(mapCenter as [number, number], mapZoom);

    // Dodanie warstwy OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Zabezpieczenie danych - sprawdzenie czy dane są załadowane i nie są puste
    if (runnings && runnings.length > 0) {
      // Dodanie pulsujących markerów dla każdego biegu
      runnings.forEach(running => {
        // Stworzenie niestandardowej ikony pulsującego markera
        const pulseIcon = L.divIcon({ 
          className: 'pulsing-marker', 
          iconSize: [16, 16] 
        });

        // Stworzenie markera w lokalizacji biegu
        const marker = L.marker([running.lat, running.lng], { icon: pulseIcon });
        
        // Dodanie popup z informacjami o biegu
        marker.bindPopup(`
          <div class="text-center">
            <h3 class="font-semibold text-gray-900 mb-2">${running.city}</h3>
            <p class="text-sm text-gray-600 mb-1"><strong>Dystans:</strong> ${running.distance} km</p>
            <p class="text-sm text-gray-600 mb-1"><strong>Data:</strong> ${new Date(running.date).toLocaleDateString('pl-PL')}</p>
            <p class="text-sm text-gray-600"><strong>Kraj:</strong> ${running.country}</p>
            ${running.voivodeship ? `<p class="text-sm text-gray-600"><strong>Województwo:</strong> ${running.voivodeship}</p>` : ''}
          </div>
        `);
        
        // Dodanie markera do mapy
        marker.addTo(map);
      });
    }

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [runnings, view]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
