import maplibregl from 'https://cdn.skypack.dev/maplibre-gl';

export function initializeMap() {
  // Delay until DOM is ready
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => initializeMap(), { once: true });
    return;
  }

  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('🛑 Map container not found in DOM.');
    return;
  }

  const fallbackCoords = [121.5315, 25.0423]; // NTU

  const map = new maplibregl.Map({
    container: mapContainer,
    style: {
      version: 8,
      sources: {
        rasterTiles: {
          type: 'raster',
          tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm-tiles',
          type: 'raster',
          source: 'rasterTiles',
          minzoom: 0,
          maxzoom: 19
        }
      ]
    },
    center: fallbackCoords,
    zoom: 15
  });

  map.addControl(new maplibregl.NavigationControl());

  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.setCenter([coords.longitude, coords.latitude]);
        map.setZoom(16);
      },
      () => console.warn('⚠️ Geolocation failed'),
      { timeout: 8000 }
    );
  }

  map.on('load', async () => {
    try {
      const res = await fetch('data/mock-risk-area.geojson');
      const data = await res.json();

      map.addSource('risk-area', { type: 'geojson', data });

      map.addLayer({
        id: 'risk-polygon',
        type: 'fill',
        source: 'risk-area',
        paint: {
          'fill-color': '#f87171',
          'fill-opacity': 0.4
        }
      });

      map.addLayer({
        id: 'risk-outline',
        type: 'line',
        source: 'risk-area',
        paint: {
          'line-color': '#b91c1c',
          'line-width': 2
        }
      });

      // Remove and add new legend
      document.querySelectorAll('.custom-map-legend').forEach(el => el.remove());

      const legend = document.createElement('div');
      legend.className = 'custom-map-legend';
      legend.innerHTML = `
        <div class="bg-white p-2 text-sm shadow rounded flex items-center space-x-2 border border-gray-300">
          <span class="inline-block w-4 h-4 bg-red-500 opacity-50 border"></span>
          <span>High Risk Area</span>
        </div>`;
      Object.assign(legend.style, {
        position: 'absolute',
        bottom: '12px',
        left: '12px',
        zIndex: '999'
      });

      mapContainer.appendChild(legend);
      console.log('✅ Mock risk polygon and legend loaded');
    } catch (err) {
      console.error('🛑 Failed to load GeoJSON risk data:', err);
    }
  });

  map.on('error', e => {
    console.error('🧯 MapLibre runtime error:', e.error || e.message || e);
  });
}
