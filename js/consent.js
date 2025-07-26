import { getTranslation } from './i18n.js';

export function setupConsent() {
  const consentDiv = document.getElementById('consent-block');
  consentDiv.innerHTML = `
    <label>
      <input type="checkbox" class="mr-2">
      ${getTranslation('consent_text')}
    </label>
  `;
}
