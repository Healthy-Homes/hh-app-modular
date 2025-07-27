// main.js
import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { setupLanguage } from './i18n.js';
import { exportFHIRBundle } from './fhir-export.js';
import { exportPDF } from './pdf-export.js';
import { initializeMap } from './map.js';

console.log('✅ Main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM fully loaded');

  setupLanguage();
  setupConsent();

  try {
    await Promise.all([
      loadChecklist(),
      loadSDOH(),
      initializeMap()
    ]);
    console.log('✅ Checklist, SDOH, and Map loaded');
  } catch (err) {
    console.error('❌ App load failed:', err);
    alert('App failed to load. Please refresh.');
    return;
  }

  const exportBtn = document.getElementById('export-btn');
  if (!exportBtn) {
    console.warn('⚠️ Export button missing');
    return;
  }

  // ✅ Wait for pdfMake to be ready before allowing export
  exportBtn.addEventListener('click', async () => {
    try {
      const bundle = await exportFHIRBundle();
      console.log('✅ FHIR Bundle ready:', bundle);

      await waitForPdfMake(); // ⏳ Ensures safe PDF export

      exportPDF(bundle); // 🔧 Currently EN-only
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Unable to generate report.');
    }
  });
});

// ✅ Wait for global pdfMake to load before accessing it
function waitForPdfMake() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const max = 30; // ~6 seconds
    const interval = setInterval(() => {
      if (window.pdfMake && typeof window.pdfMake.createPdf === 'function') {
        clearInterval(interval);
        console.log('✅ pdfMake loaded');
        resolve();
      } else if (++attempts >= max) {
        clearInterval(interval);
        reject(new Error('❌ pdfMake failed to load.'));
      }
    }, 200);
  });
}
