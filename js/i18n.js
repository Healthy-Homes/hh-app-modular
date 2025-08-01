let currentLang = 'en';
let currentTranslations = {};

function setupLanguage() {
  const toggle = document.getElementById('language-toggle');
  if (!toggle) return;

  toggle.innerHTML = `
    <button id="lang-en" class="bg-gray-200 px-3 py-1 rounded mr-2">English</button>
    <button id="lang-zh" class="bg-gray-200 px-3 py-1 rounded">中文</button>
  `;

  document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
  document.getElementById('lang-zh').addEventListener('click', () => switchLanguage('zh'));

  switchLanguage(currentLang);
}

async function switchLanguage(lang) {
  currentLang = lang;

  try {
    const res = await fetch(`lang/${lang}.json`);
    currentTranslations = await res.json();
  } catch {
    console.warn(`⚠️ Failed to load ${lang}.json`);
    if (lang !== 'en') {
      const fallback = await fetch('lang/en.json');
      currentTranslations = await fallback.json();
      currentLang = 'en';
    }
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (currentTranslations[key]) el.textContent = currentTranslations[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (currentTranslations[key]) el.setAttribute('placeholder', currentTranslations[key]);
  });

  if (typeof loadChecklist === 'function') await loadChecklist();
  if (typeof loadSDOH === 'function') await loadSDOH();
  if (typeof setupConsent === 'function') setupConsent();
}

function getTranslation(key) {
  return currentTranslations[key] || key;
}

function getLang() {
  return currentLang;
}

export { setupLanguage, switchLanguage, getTranslation, getLang };
