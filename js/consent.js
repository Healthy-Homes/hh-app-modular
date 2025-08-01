// ✅ consent.js (ES6 module)

import { getTranslation } from './i18n.js';

function setupConsent() {
  const checkbox = document.getElementById('consent-checkbox');
  const nameInput = document.getElementById('resident-name');
  const container = document.getElementById('consent-section');

  if (!checkbox || !nameInput || !container) {
    console.warn('⚠️ Consent UI elements not found in DOM');
    return;
  }

  // Apply translated placeholder and label if available
  const label = container.querySelector('label[for="consent-checkbox"]');
  if (label) {
    label.textContent = getTranslation('consentLabel') || 'Consent to inspection';
  }

  nameInput.setAttribute(
    'placeholder',
    getTranslation('residentNamePlaceholder') || 'Full name of resident'
  );

  checkbox.addEventListener('change', () => {
    console.log('📝 Consent checkbox changed:', checkbox.checked);
  });
}

export { setupConsent };
