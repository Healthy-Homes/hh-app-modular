import L from 'https://cdn.skypack.dev/leaflet';

export function initializeMap() {
  const mapContainer = document.getElementById('map');
  const sectionContainer = document.getElementById('map-section');

  if (!mapContainer || !sectionContainer) {
    console.error('Map or container not found!');
    return;
  }

  const fallbackCoords = [25.0423, 121.5315];

  const observer = new ResizeObserver(entries => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        observer.disconnect();

        // Ensure browser layout is committed before Leaflet mount
        requestAnimationFrame(() => {
          // Short delay ensures rendering pipeline has flushed
          setTimeout(() => {
            const map = L.map(mapContainer, {
              center: fallbackCoords,
              zoom: 15,
              zoomControl: true,
              attributionControl: true,
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);

            map.whenReady(() => {
              map.invalidateSize();
            });

            if ('geolocation' in navigator) {
              navigator.geolocation.getCurrentPosition(
                pos => {
                  map.setView([pos.coords.latitude, pos.coords.longitude], 16);
                },
                () => console.warn('Geolocation failed, using fallback'),
                { timeout: 8000 }
              );
            }

            // Load mock risk data
            fetch('data/mock-risk-area.geojson')
              .then(res => res.json())
              .then(geojson => {
                L.geoJSON(geojson, {
                  style: {
                    color: 'red',
                    weight: 2,
                    fillOpacity: 0.4
                  },
                  onEachFeature: (feature, layer) => {
                    const desc = feature.properties?.description || 'Environmental risk area';
                    layer.bindPopup(desc);
                  }
                }).addTo(map);

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
              })
              .catch(err => console.error('Failed to load GeoJSON:', err));
          }, 0); // Minimal delay to flush layout
        });
      }
    }
  });

  observer.observe(sectionContainer);
}
