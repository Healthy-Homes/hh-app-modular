let currentLang = 'en';
let currentTranslations = {};

// ✅ Public method to initialize language toggle buttons
window.setupLanguage = function () {
  const toggle = document.getElementById('language-toggle');
  if (!toggle) {
    console.warn('⚠️ #language-toggle element not found in DOM');
    return;
  }

  toggle.innerHTML = `
    <button id="lang-en" class="bg-gray-200 px-3 py-1 rounded mr-2">English</button>
    <button id="lang-zh" class="bg-gray-200 px-3 py-1 rounded">中文</button>
  `;

  document.getElementById('lang-en').addEventListener('click', () => switchLanguage('en'));
  document.getElementById('lang-zh').addEventListener('click', () => switchLanguage('zh'));

  switchLanguage(currentLang); // Load default language
};

// ✅ Switch language and reload dynamic content
window.switchLanguage = async function (lang) {
  currentLang = lang;

  try {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error(`Could not load lang/${lang}.json`);
    currentTranslations = await res.json();
  } catch (err) {
    console.error(`⚠️ Failed to load ${lang} language file, falling back to English`, err);
    if (lang !== 'en') {
      currentLang = 'en';
      const res = await fetch('lang/en.json');
      currentTranslations = await res.json();
    }
  }

  // Apply translations to static UI
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (currentTranslations[key]) el.textContent = currentTranslations[key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (currentTranslations[key]) el.setAttribute('placeholder', currentTranslations[key]);
  });

  // Reload dynamic content
  if (typeof loadChecklist === 'function') await loadChecklist();
  if (typeof loadSDOH === 'function') await loadSDOH();
  if (typeof setupConsent === 'function') setupConsent();
};

// ✅ Translation lookup (UI use)
function getTranslation(key) {
  return currentTranslations[key] || key;
}

// ✅ Legacy global use
window.getTranslation = getTranslation;

function getCurrentLang() {
  return currentLang;
}
window.getCurrentLang = getCurrentLang;

// ✅ ES6 module export
export { getLang, getTranslation };

function getLang() {
  return currentLang;
}
