import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { setupLanguage } from './i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
  setupLanguage();
  setupConsent();
  await loadChecklist();
  await loadSDOH();
});
