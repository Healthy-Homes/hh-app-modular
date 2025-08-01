import { setupLanguage } from './i18n.js';
import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { initializeMap } from './map.js';
import { setupPDFExport } from './pdf-export.js';
import './risk-model.js';

document.addEventListener('DOMContentLoaded', () => {
  setupLanguage();
  loadChecklist();
  loadSDOH();
  setupConsent();
  initializeMap();
  setupPDFExport();
});
