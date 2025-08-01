import { getTranslation } from './i18n.js';

export function setupConsent() {
  const label = document.getElementById('consent-label');
  const checkbox = document.getElementById('consent-checkbox');
  const nameLabel = document.getElementById('resident-name-label');
  const nameInput = document.getElementById('resident-name');

  if (!label || !checkbox || !nameLabel || !nameInput) {
    console.warn('⚠️ Consent form elements not found');
    return;
  }

  label.textContent = getTranslation('consent_text');
  nameLabel.textContent = getTranslation('resident_name_label');
  nameInput.setAttribute('placeholder', getTranslation('resident_name_placeholder'));
}
