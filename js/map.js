import L from 'https://cdn.skypack.dev/leaflet';

export async function initializeMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error('Map element not found!');
    return;
  }

  // Initialize map with fallback center
  const fallbackCoords = [25.0423, 121.5315]; // Near NTU
  const map = L.map('map').setView(fallbackCoords, 15);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Try to center on user's actual location
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 16);
    } catch (err) {
      console.warn('Geolocation error or denied, using fallback location.');
    }
  }

  // Load mock GeoJSON environmental risk data
  try {
    const res = await fetch('data/mock-risk-area.geojson');
    const geojson = await res.json();

    const riskLayer = L.geoJSON(geojson, {
      style: feature => ({
        color: 'red',
        weight: 2,
        fillOpacity: 0.4
      }),
      onEachFeature: (feature, layer) => {
        const desc = feature.properties?.description || 'Environmental risk area';
        layer.bindPopup(desc);
      }
    }).addTo(map);

    // Add legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'bg-white p-2 text-sm shadow rounded');
      div.innerHTML = `<div class="flex items-center">
        <div class="w-4 h-4 bg-red-500 opacity-50 mr-2 border"></div>
        <span>High-Risk Area</span>
      </div>`;
      return div;
    };
    legend.addTo(map);

  } catch (err) {
    console.error('Failed to load mock risk data:', err);
  }
}
