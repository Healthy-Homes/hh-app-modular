import { getTranslation } from './i18n.js';

export function setupConsent() {
  const consentDiv = document.getElementById('consent-block');
  consentDiv.innerHTML = `
    <div class="mb-4">
      <label class="block mb-1 font-medium" for="resident-name" data-i18n="resident_name_label">
        Resident Name
      </label>
      <input 
        type="text" 
        id="resident-name" 
        class="border rounded p-2 w-full" 
        placeholder="${getTranslation('resident_name_placeholder')}"
        data-i18n-placeholder="resident_name_placeholder"
      />
    </div>
    <label class="inline-flex items-center">
      <input type="checkbox" id="consent-checkbox" class="mr-2" />
      <span data-i18n="consent_text">${getTranslation('consent_text')}</span>
    </label>
  `;
}
