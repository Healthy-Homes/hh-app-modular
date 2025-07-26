import { getTranslation } from './i18n.js';

export function setupConsent() {
  const consentDiv = document.getElementById('consent-block');
  consentDiv.innerHTML = `
    <div class="mb-2">
      <label>
        <input type="checkbox" class="mr-2">
        <span data-i18n="consent_text">${getTranslation('consent_text')}</span>
      </label>
    </div>
    <div>
      <label>
        <span data-i18n="resident_name_label">${getTranslation('resident_name_label')}</span>:
        <input id="resident-name" type="text" class="ml-2 p-1 border rounded w-64" />
      </label>
    </div>
  `;
}
