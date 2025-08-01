// ✅ main.js (ES6 module)

import { setupLanguage } from './i18n.js';
import { setupConsent } from './consent.js';
import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { initializeMap } from './map.js';
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
  if (!exportBtn) {
    console.warn('⚠️ Export button missing');
    return;
  }

  exportBtn.addEventListener('click', async () => {
    try {
      const bundle = exportFHIRBundle();
      console.log('✅ FHIR Bundle ready:', bundle);

      await waitForPdfMake();
      exportPDF(bundle);
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Unable to generate report.');
    }
  });
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
