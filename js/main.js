// main.js
import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { setupLanguage } from './i18n.js';
import { exportFHIRBundle } from './fhir-export.js';
import { exportPDF } from './pdf-export.js';
import { initializeMap } from './map.js';

console.log('✅ Main.js loaded');

// ✅ Set up language toggle and default translations immediately
setupLanguage();

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM fully loaded');

  // ✅ Set up consent logic
  setupConsent();

  try {
    // ✅ Load checklist, SDOH form, and map in parallel
    await Promise.all([
      loadChecklist(),
      loadSDOH(),
      initializeMap()
    ]);
    console.log('✅ Checklist, SDOH, and Map loaded');
  } catch (err) {
    console.error('❌ Error loading modules:', err);
    alert('Error loading app components. Please refresh the page.');
    return;
  }

  // ✅ Wire up export button
  const exportBtn = document.getElementById('export-btn');
  if (!exportBtn) {
    console.warn('⚠️ Export button not found in DOM');
    return;
  }

  exportBtn.addEventListener('click', async () => {
    try {
      const bundle = await exportFHIRBundle(); // Generate FHIR bundle
      console.log('✅ FHIR Bundle ready:', bundle);

      if (!window.pdfMake || typeof window.pdfMake.createPdf !== 'function') {
        console.error('❌ pdfMake not available or broken');
        alert('Unable to generate PDF: pdfMake not loaded.');
        return;
      }

      exportPDF(bundle); // Trigger PDF export and preview
    } catch (err) {
      console.error('❌ Export process failed:', err);
      alert('Export failed. Please try again.');
    }
  });
});
