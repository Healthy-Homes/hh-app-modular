// main.js (EN/zh toggle with stable EN PDF export)
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

  setupLanguage(); // ✅ moved inside DOM ready
  setupConsent();
  
  // ... (rest of your logic follows)


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

  exportBtn.addEventListener('click', async () => {
    try {
      const bundle = await exportFHIRBundle();
      console.log('✅ FHIR Bundle ready:', bundle);

      if (!window.pdfMake || typeof window.pdfMake.createPdf !== 'function') {
        console.error('❌ pdfMake is not defined');
        alert('Unable to generate PDF: pdfMake not loaded.');
        return;
      }

      exportPDF(bundle); // 🔧 Currently EN-only for stability
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Unable to generate report.');
    }
  });
});
