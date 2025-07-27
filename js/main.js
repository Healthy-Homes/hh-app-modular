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

  // ✅ Initialize language toggle and load default translations
  setupLanguage();

  // ✅ Set up resident consent form
  setupConsent();

  // ✅ Load data + map in parallel
  await Promise.all([
    loadChecklist(),
    loadSDOH(),
    initializeMap()
  ]);
  console.log('✅ Core data and map loaded');

  // ✅ Wire up export button
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', async () => {
      const bundle = await exportFHIRBundle(); // Await JSON creation
      console.log('✅ FHIR Bundle ready:', bundle);

      if (!window.pdfMake || typeof window.pdfMake.createPdf !== 'function') {
        console.error('❌ pdfMake is not loaded correctly');
        alert('PDF generation library failed to load.');
        return;
      }

      exportPDF(bundle); // Trigger PDF preview
    });
  } else {
    console.warn('⚠️ Export button not found in DOM');
  }
});
