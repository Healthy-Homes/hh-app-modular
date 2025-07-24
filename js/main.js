import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { setupLanguage } from './i18n.js';

console.log('Main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('DOM fully loaded');
  setupLanguage();
  setupConsent();
  await loadChecklist();
  await loadSDOH();
});
