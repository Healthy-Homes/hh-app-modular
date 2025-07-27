import maplibregl from 'https://cdn.skypack.dev/maplibre-gl';

export function initializeMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found!');
    return;
  }

  const fallbackCoords = [121.5315, 25.0423]; // [lng, lat] near NTU

  // Defer map setup until after layout is ready
  requestAnimationFrame(() => {
    const map = new maplibregl.Map({
      container: mapContainer,
      style: 'https://demotiles.maplibre.org/style.json', // Basic MapLibre demo tiles
      center: fallbackCoords,
      zoom: 15
    });

    // Add navigation (zoom/rotation) controls
    map.addControl(new maplibregl.NavigationControl());

    // Optional geolocation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          map.setCenter([longitude, latitude]);
          map.setZoom(16);
        },
        () => {
          console.warn('Geolocation failed, using fallback');
        },
        { timeout: 8000 }
      );
    }

    // Handle map load event
    map.on('load', () => {
      console.log('MapLibre map fully loaded.');

      // Example: Add a static red polygon overlay (placeholder)
      // Uncomment and adapt when ready to load real data
      /*
      map.addSource('risk-area', {
        type: 'geojson',
        data: 'data/mock-risk-area.geojson'
      });

      map.addLayer({
        id: 'risk-fill',
        type: 'fill',
        source: 'risk-area',
        paint: {
          'fill-color': '#f03b20',
          'fill-opacity': 0.4
        }
      });

      map.addLayer({
        id: 'risk-outline',
        type: 'line',
        source: 'risk-area',
        paint: {
          'line-color': '#f03b20',
          'line-width': 2
        }
      });
      */
    });
  });
}
