import { getTranslation } from './i18n.js';

export function setupConsent() {
  const consentLabel = document.getElementById('consent-label');
  const consentCheckbox = document.getElementById('consent-checkbox');
  const nameLabel = document.getElementById('resident-name-label');
  const nameInput = document.getElementById('resident-name');

  if (!consentLabel || !consentCheckbox || !nameLabel || !nameInput) {
    console.warn('⚠️ Consent form elements not found:', {
      consentLabel: !!consentLabel,
      consentCheckbox: !!consentCheckbox,
      nameLabel: !!nameLabel,
      nameInput: !!nameInput
    });
    return;
  }

  // Update text content with translations
  consentLabel.textContent = getTranslation('consent_text') || 'I consent to a home inspection to assess health and safety conditions, understand this is voluntary, and agree that photos may be taken for documentation purposes.';
  
  nameLabel.textContent = getTranslation('resident_name_label') || 'Resident Name';
  
  const placeholder = getTranslation('resident_name_placeholder') || 'Enter resident name';
  nameInput.setAttribute('placeholder', placeholder);

  console.log('✅ Consent form setup complete');
}