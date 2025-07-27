import maplibregl from 'https://cdn.skypack.dev/maplibre-gl';

export function initializeMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found!');
    return;
  }

  const fallbackCoords = [121.5315, 25.0423]; // [lng, lat] near NTU

  requestAnimationFrame(() => {
    const map = new maplibregl.Map({
      container: mapContainer,
      style: {
        version: 8,
        sources: {
          rasterTiles: {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
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

    // Navigation controls
    map.addControl(new maplibregl.NavigationControl());

    // Try geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          map.setCenter([longitude, latitude]);
          map.setZoom(16);
        },
        () => console.warn('Geolocation failed, using fallback'),
        { timeout: 8000 }
      );
    }

    // Add polygon layer after map loads
    map.on('load', async () => {
      try {
        const res = await fetch('data/mock-risk-area.geojson');
        const data = await res.json();

        map.addSource('risk-area', {
          type: 'geojson',
          data
        });

        map.addLayer({
          id: 'risk-polygon',
          type: 'fill',
          source: 'risk-area',
          paint: {
            'fill-color': '#f87171',       // red-400
            'fill-opacity': 0.4
          }
        });

        map.addLayer({
          id: 'risk-outline',
          type: 'line',
          source: 'risk-area',
          paint: {
            'line-color': '#b91c1c',        // red-800
            'line-width': 2
          }
        });

        // Add a simple custom legend
        const legend = document.createElement('div');
        legend.innerHTML = `
          <div class="bg-white p-2 text-sm shadow rounded flex items-center space-x-2 border border-gray-300">
            <span class="inline-block w-4 h-4 bg-red-500 opacity-50 border"></span>
            <span>High Risk Area</span>
          </div>`;
        legend.style.position = 'absolute';
        legend.style.bottom = '12px';
        legend.style.left = '12px';
        legend.style.zIndex = '999';
        mapContainer.appendChild(legend);

        console.log('Mock risk polygon loaded');
      } catch (err) {
        console.error('Failed to load GeoJSON risk data:', err);
      }
    });
  });
}
