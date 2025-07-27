// js/map.js
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
      style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json', // detailed basemap
      center: fallbackCoords,
      zoom: 15
    });

    // Navigation controls
    map.addControl(new maplibregl.NavigationControl());

    // Legend
    const legend = document.createElement('div');
    legend.className = 'map-legend';
    legend.innerHTML = `
      <div class="legend-box">
        <div class="color-box"></div>
        <span>Environmental Risk Area</span>
      </div>`;
    map.getContainer().appendChild(legend);

    // Add risk polygon layer
    map.on('load', () => {
      console.log('MapLibre map fully loaded.');

      map.addSource('risk-area', {
        type: 'geojson',
        data: 'data/mock-risk-area.geojson'
      });

      map.addLayer({
        id: 'risk-fill',
        type: 'fill',
        source: 'risk-area',
        layout: {},
        paint: {
          'fill-color': '#f87171',
          'fill-opacity': 0.4
        }
      });

      map.addLayer({
        id: 'risk-outline',
        type: 'line',
        source: 'risk-area',
        layout: {},
        paint: {
          'line-color': '#dc2626',
          'line-width': 2
        }
      });

      // Optional geolocation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
          const { latitude, longitude } = pos.coords;
          map.setCenter([longitude, latitude]);
          map.setZoom(16);
        }, () => console.warn('Geolocation failed, using fallback'), { timeout: 8000 });
      }
    });
  });
}
