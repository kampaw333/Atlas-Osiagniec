'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface GeoJSONFeature {
  properties: {
    name_pl: string;
    [key: string]: any;
  };
  geometry: any;
  type: string;
}

// GeoJSON data for European countries (simplified)
const europeGeoJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Poland",
        "name_pl": "Polska"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [14.1229, 53.9122], [14.8029, 54.0507], [16.3634, 54.5132], [17.6228, 54.8515], 
          [18.6201, 54.6826], [19.8880, 54.8661], [20.8922, 54.3125], [22.7311, 54.3275], 
          [23.4841, 54.1429], [24.4506, 53.9057], [25.5363, 53.5574], [26.5882, 53.1275], 
          [27.1024, 52.3511], [27.4540, 51.5923], [28.2416, 50.8660], [29.1497, 50.4019], 
          [30.1571, 50.0759], [31.7859, 50.4070], [32.7157, 50.1770], [33.7527, 50.3259], 
          [34.3917, 51.1242], [34.1419, 51.5664], [34.2248, 52.3783], [34.8160, 52.3709], 
          [35.3779, 52.3440], [35.5339, 52.6925], [35.1419, 53.3386], [35.0938, 53.5574], 
          [34.3527, 54.2583], [33.7527, 54.0813], [32.4127, 54.1444], [31.7859, 54.0813], 
          [30.1571, 54.2583], [29.1497, 54.0813], [28.2416, 54.2583], [27.4540, 54.0813], 
          [26.5882, 54.2583], [25.5363, 54.0813], [24.4506, 54.2583], [23.4841, 54.0813], 
          [22.7311, 54.2583], [21.0122, 54.2583], [19.8880, 54.2583], [18.6201, 54.2583], 
          [17.6228, 54.2583], [16.3634, 54.2583], [14.8029, 54.2583], [14.1229, 54.2583]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Germany",
        "name_pl": "Niemcy"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [5.9886, 51.1272], [6.1566, 50.8037], [6.0431, 50.1281], [5.6740, 49.5295], 
          [6.1863, 49.4638], [6.6582, 49.2019], [8.0992, 49.0178], [8.5311, 48.7104], 
          [9.4799, 47.1028], [9.8969, 47.5802], [10.4021, 47.3024], [10.5445, 47.5924], 
          [11.4264, 47.5234], [12.1413, 47.7031], [12.9326, 47.4676], [13.0258, 47.6376], 
          [12.8841, 48.2891], [13.2433, 48.4161], [13.5959, 48.8771], [13.0313, 49.3074], 
          [12.5210, 49.5474], [12.4151, 49.9691], [11.8881, 50.2903], [11.5202, 50.3168], 
          [11.4264, 50.5619], [11.1113, 50.8436], [10.4541, 50.8783], [9.8969, 50.8436], 
          [9.4130, 50.8783], [8.7150, 50.8436], [8.0992, 50.8783], [7.6041, 50.8436], 
          [7.0921, 50.8783], [6.6582, 50.8436], [6.1863, 50.8783], [5.9886, 51.1272]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "name": "Czech Republic",
        "name_pl": "Czechy"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [12.2401, 50.8777], [12.9668, 50.4849], [13.3381, 50.7332], [14.3389, 50.7332], 
          [14.9014, 50.4849], [15.0169, 50.1069], [15.4909, 49.8051], [16.4992, 49.8051], 
          [16.9602, 49.5282], [17.6494, 49.5282], [18.1704, 49.2718], [18.8531, 49.2718], 
          [18.8531, 48.8819], [18.1704, 48.8819], [17.6494, 48.6255], [16.9602, 48.6255], 
          [16.4992, 48.3486], [15.4909, 48.3486], [15.0169, 48.0468], [14.9014, 47.6688], 
          [14.3389, 47.4205], [13.3381, 47.4205], [12.9668, 47.6688], [12.2401, 47.4205], 
          [12.2401, 50.8777]
        ]]
      }
    }
  ]
};

// Heat map data with colors
const heatMapData = {
  'Polska': {
    color: 'rgba(220, 38, 127, 0.6)',
    strokeColor: 'rgba(220, 38, 127, 1)',
    strokeWidth: 2
  },
  'Niemcy': {
    color: 'rgba(251, 146, 60, 0.6)',
    strokeColor: 'rgba(251, 146, 60, 1)',
    strokeWidth: 2
  },
  'Czechy': {
    color: 'rgba(254, 215, 170, 0.6)',
    strokeColor: 'rgba(254, 215, 170, 1)',
    strokeWidth: 2
  }
};

export default function EuropeHeatMap() {
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
    const map = L.map(mapRef.current).setView([54.5260, 15.2551], 5); // Centrum Europy

    // Dodanie warstwy OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Funkcja do stylowania krajów
    const styleCountry = (feature: GeoJSONFeature) => {
      const countryName = feature.properties.name_pl;
      const heatData = heatMapData[countryName as keyof typeof heatMapData];
      
      if (heatData) {
        return {
          fillColor: heatData.color,
          weight: heatData.strokeWidth,
          opacity: 1,
          color: heatData.strokeColor,
          fillOpacity: 0.6
        };
      }
      
      // Domyślny styl dla krajów bez danych
      return {
        fillColor: '#e5e7eb',
        weight: 1,
        opacity: 0.8,
        color: '#9ca3af',
        fillOpacity: 0.3
      };
    };

    // Funkcja do obsługi kliknięć
    const onEachFeature = (feature: GeoJSONFeature, layer: L.Layer) => {
      const countryName = feature.properties.name_pl;
      const heatData = heatMapData[countryName as keyof typeof heatMapData];
      
      if (heatData) {
        layer.bindTooltip(`
          <div class="text-center">
            <strong>${countryName}</strong><br>
            <span class="text-sm">Testowa heat mapa</span>
          </div>
        `, { permanent: false, direction: 'top' });
      } else {
        layer.bindTooltip(countryName, { permanent: false, direction: 'top' });
      }
    };

    // Dodanie GeoJSON warstwy
    L.geoJSON(europeGeoJSON as any, {
      style: styleCountry,
      onEachFeature: onEachFeature
    }).addTo(map);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ minHeight: '400px' }}
    />
  );
}
