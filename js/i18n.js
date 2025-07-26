import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js'; // ✅ Import added

let currentLang = 'en';
let currentTranslations = {};

export function setupLanguage() {
  const toggle = document.getElementById('language-toggle');
  toggle.innerHTML = `
    <button id="lang-en" class="bg-gray-200 px-3 py-1 rounded mr-2">English</button>
    <button id="lang-zh" class="bg-gray-200 px-3 py-1 rounded">中文</button>
  `;

  document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
  document.getElementById('lang-zh').addEventListener('click', () => switchLanguage('zh'));

  switchLanguage(currentLang); // Load default language
}

export async function switchLanguage(lang) {
  currentLang = lang;

  try {
    const res = await fetch(`lang/${lang}.json`);
    currentTranslations = await res.json();

    // Update static UI elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (currentTranslations[key]) el.textContent = currentTranslations[key];
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (currentTranslations[key]) el.setAttribute('placeholder', currentTranslations[key]);
    });

    // 🔁 Refresh dynamic content
    await loadChecklist();
    await loadSDOH();
    setupConsent(); // ✅ Re-render the consent block

  } catch (err) {
    console.error(`Language load failed for ${lang}`, err);
  }
}

export function getTranslation(key) {
  return currentTranslations[key] || key;
}
