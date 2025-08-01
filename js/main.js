import { setupLanguage } from './i18n.js';
import { setupConsent } from './consent.js';
import { initializeMap } from './map.js';
import { exportPDF } from './pdf-export.js';
import { generateFHIR } from './fhir-export.js';
import { calculateRiskScores } from './risk-model.js';
import { getChecklistData } from './checklist-loader.js';
import { getSDOHData } from './sdoh-loader.js';

window.addEventListener('DOMContentLoaded', () => {
  setupLanguage();
  setupConsent();
  initializeMap();

  document.getElementById('export-report').addEventListener('click', () => {
    const checklistData = getChecklistData();
    const sdohData = getSDOHData();
    const includeRisk = document.getElementById('include-risk').checked;
    const scores = includeRisk ? calculateRiskScores(checklistData, sdohData) : null;
    const bundle = generateFHIR(checklistData, sdohData, includeRisk, scores);
    exportPDF(bundle);
  });
});
