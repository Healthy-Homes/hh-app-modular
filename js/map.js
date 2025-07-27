import L from 'https://cdn.skypack.dev/leaflet';

export async function initializeMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) {
    console.error('Map element not found!');
    return;
  }

  const fallbackCoords = [25.0423, 121.5315];
  const map = L.map(mapElement, {
    center: fallbackCoords,
    zoom: 15,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    dragging: true
  });

  // Ensure layout settles before initializing fully
  setTimeout(() => {
    map.invalidateSize();
  }, 500);

  // Add tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Try to use real location
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      );
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 16);
    } catch {
      console.warn('Geolocation failed; using fallback.');
    }
  }

  // Load mock GeoJSON risk area
  try {
    const res = await fetch('data/mock-risk-area.geojson');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const geojson = await res.json();

    L.geoJSON(geojson, {
      style: () => ({
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
      const div = L.DomUtil.create('div', 'leaflet-control legend');
      div.style.background = 'white';
      div.style.padding = '6px';
      div.style.fontSize = '14px';
      div.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      div.style.borderRadius = '6px';
      div.innerHTML = `
        <div style="display: flex; align-items: center;">
          <div style="width: 16px; height: 16px; background-color: rgba(255, 0, 0, 0.5); border: 1px solid #000; margin-right: 6px;"></div>
          <span>High-Risk Area</span>
        </div>`;
      return div;
    };
    legend.addTo(map);
  } catch (err) {
    console.error('Failed to load mock risk data:', err);
  }
}
