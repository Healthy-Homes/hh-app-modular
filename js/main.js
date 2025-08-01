import { setupLanguage } from './i18n.js';
import { setupConsent } from './consent.js';
import { initializeMap } from './map.js';
import { exportPDF } from './pdf-export.js';
import { generateFHIR } from './fhir-export.js';
import { calculateRisk } from './risk-model.js';
import { getChecklistData } from './checklist-loader.js';
import { getSDOHData } from './sdoh-loader.js';

window.addEventListener('DOMContentLoaded', () => {
  setupLanguage();
  setupConsent();
  initializeMap();

  document.getElementById('export-report').addEventListener('click', () => {
    const checklistData = getChecklistData();
    const sdohData = getSDOHData();
    const includeRisk = document.getElementById('include-risk')?.checked;

    let scores = null;
    if (includeRisk) {
      const home = calculateRisk(checklistData, {});
      const sdoh = calculateRisk({}, sdohData);
      const total = calculateRisk(checklistData, sdohData);
      scores = { home, sdoh, total };
    }

    const bundle = generateFHIR(checklistData, sdohData, includeRisk, scores);
    exportPDF(bundle);
  });
});
