import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { setupLanguage } from './i18n.js';
import { exportFHIRBundle } from './fhir-export.js';
import { initializeMap } from './map.js';

console.log('Main.js loaded');

// ✅ Initialize language toggle and load default translations
setupLanguage();

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded');
  setupConsent();
  await loadChecklist();
  await loadSDOH();
  await initializeMap();

  // ✅ Wire up export button
  const exportBtn = document.getElementById('export-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportFHIRBundle);
  }
});
