import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { setupLanguage } from './i18n.js';
import { exportFHIRBundle } from './fhir-export.js';
import { exportPDF } from './pdf-export.js';
import { initializeMap } from './map.js';

console.log('✅ Main.js loaded');

// ✅ Load language immediately
setupLanguage();

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM fully loaded');

  // ✅ Consent setup
  setupConsent();

  try {
    await Promise.all([
      loadChecklist(),
      loadSDOH(),
      initializeMap()
    ]);
    console.log('✅ Checklist, SDOH, and Map loaded');
  } catch (err) {
    console.error('❌ Error loading components:', err);
    alert('Error loading app. Please refresh the page.');
  }

  // ✅ Export logic with pdfMake readiness check
  const exportBtn = document.getElementById('export-btn');
  if (!exportBtn) {
    console.warn('⚠️ Export button not found');
    return;
  }

  const waitForPdfMake = () => {
    return new Promise((resolve, reject) => {
      const maxAttempts = 20;
      let attempts = 0;

      const check = () => {
        if (window.pdfMake && typeof window.pdfMake.createPdf === 'function') {
          return resolve();
        }
        attempts++;
        if (attempts >= maxAttempts) {
          return reject(new Error('pdfMake failed to load'));
        }
        setTimeout(check, 200);
      };

      check();
    });
  };

  exportBtn.addEventListener('click', async () => {
    try {
      const bundle = await exportFHIRBundle();
      console.log('✅ FHIR Bundle ready:', bundle);

      await waitForPdfMake(); // ⬅️ Wait until pdfMake is safe to use
      exportPDF(bundle);      // ✅ Proceed to export
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Unable to generate PDF: pdfMake not loaded.');
    }
  });
});
