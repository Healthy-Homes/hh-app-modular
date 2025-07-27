// js/map.js
import L from 'https://cdn.skypack.dev/leaflet';

export async function initializeMap() {
  const mapSection = document.getElementById('map-section');

  // Add map container div
  mapSection.innerHTML = `<div id="map" class="w-full h-[400px] rounded shadow"></div>`;

  // Initialize map
  const map = L.map('map').setView([25.0423, 121.5315], 15); // Default center near NTU

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Try to center map on user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 16);
      },
      () => console.warn('Geolocation permission denied or failed.')
    );
  }

  // Load mock GeoJSON environmental risk data
  try {
    const res = await fetch('data/mock-risk-area.geojson');
    const geojson = await res.json();

    // Add colored polygon layer
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
