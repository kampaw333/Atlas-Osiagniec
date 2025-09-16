'use client'

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'

interface Peak {
  id: number
  name: string
  country: string
  height_m: number
  latitude: number
  longitude: number
  isCompleted: boolean
  completionDate?: string | null
}

interface MapComponentProps {
  peaks: Peak[]
  onAddPeak?: (peak: Peak) => void
  category?: string
}

export default function MapComponent({ peaks, onAddPeak, category }: MapComponentProps) {
  // Debug: log peaks data
  console.log('MapComponent received peaks:', peaks.length)
  console.log('Completed peaks:', peaks.filter(p => p.isCompleted).length)
  console.log('Sample completed peak:', peaks.find(p => p.isCompleted))
  
  // Filter peaks with valid coordinates
  const validPeaks = peaks.filter(peak => 
    peak.latitude && 
    peak.longitude && 
    !isNaN(peak.latitude) && 
    !isNaN(peak.longitude)
  )
  
  console.log('Valid peaks with coordinates:', validPeaks.length)
  console.log('Valid completed peaks:', validPeaks.filter(p => p.isCompleted).length)

  // Set map center and zoom based on category
  const mapCenter: [number, number] = category === 'korona-polski' ? [52.0, 19.0] : [52.0, 20.0]
  const mapZoom = category === 'korona-polski' ? 6 : 4

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={mapZoom}
      style={{ height: '100%', width: '100%', zIndex: 1 }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {validPeaks.map(peak => {
        console.log(`Rendering peak ${peak.name}: isCompleted=${peak.isCompleted}, coords=[${peak.latitude}, ${peak.longitude}]`)
        return (
          <CircleMarker
            key={peak.id}
            center={[peak.latitude, peak.longitude]}
            radius={8}
            fillColor={peak.isCompleted ? '#22c55e' : '#9ca3af'}
            fillOpacity={0.8}
            color={peak.isCompleted ? '#16a34a' : '#6b7280'}
            weight={2}
          >
          <Popup>
            <div className="text-center">
              <strong className="text-lg">{peak.name}</strong><br/>
              <span className="text-gray-600">{category === 'korona-polski' ? (peak.mountain_range || '') : (peak.country || '')}</span><br/>
              <span className="text-gray-600">{peak.height_m}m n.p.m.</span><br/>
              {peak.isCompleted && (
                <span className="font-medium text-green-600">
                  ✅ Zdobyty
                </span>
              )}
              {peak.isCompleted && peak.completionDate && (
                <><br/><span className="text-sm text-green-600">
                  Zdobyty: {new Date(peak.completionDate).toLocaleDateString('pl-PL')}
                </span></>
              )}
              {!peak.isCompleted && onAddPeak && (
                <button 
                  onClick={() => onAddPeak(peak)}
                  className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Zdobyłeś? Dodaj szczyt →
                </button>
              )}
            </div>
          </Popup>
        </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
