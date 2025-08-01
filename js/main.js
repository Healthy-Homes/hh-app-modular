import { setupLanguage } from './i18n.js';
import { setupConsent } from './consent.js';
import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupRiskScoring } from './risk-model.js';
import { exportFHIRBundle } from './fhir-export.js';
import { exportPDF } from './pdf-export.js';

console.log('✅ Main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM fully loaded');

  try {
    setupLanguage();
    setupConsent();

    await Promise.all([
      loadChecklist(),
      loadSDOH(),
      initializeMap()
    ]);

    console.log('✅ Checklist, SDOH, and Map loaded');
    setupRiskScoring();

  } catch (err) {
    console.error('❌ App load failed:', err);
    alert('App failed to load. Please refresh.');
    return;
  }

  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      try {
        const bundle = await exportFHIRBundle();
        console.log('✅ FHIR Bundle ready:', bundle);

        await waitForPdfMake();
        exportPDF(bundle);
      } catch (err) {
        console.error('❌ Export failed:', err);
        alert('Unable to generate report.');
      }
    });
  }
});

function waitForPdfMake() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 30;
    const interval = setInterval(() => {
      if (window.pdfMake && typeof window.pdfMake.createPdf === 'function') {
        clearInterval(interval);
        console.log('✅ pdfMake loaded and ready');
        resolve();
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
        reject(new Error('❌ pdfMake failed to load after multiple attempts'));
      }
    }, 200);
  });
}

async function initializeMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Map container not found!');
    return;
  }

  const fallbackCoords = [121.5315, 25.0423];

  requestAnimationFrame(() => {
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
        layers: [{
          id: 'osm-tiles',
          type: 'raster',
          source: 'rasterTiles',
          minzoom: 0,
          maxzoom: 19
        }]
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

        const existingLegends = document.querySelectorAll('.custom-map-legend');
        existingLegends.forEach(el => el.remove());

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
        console.log('✅ Mock risk polygon loaded with clean legend');
      } catch (err) {
        console.error('❌ Failed to load GeoJSON risk data:', err);
      }
    });
  });
}
