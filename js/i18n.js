let currentLang = 'en';
let currentTranslations = {};

function setupLanguage() {
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

  switchLanguage(currentLang); // Load default
}

async function switchLanguage(lang) {
  currentLang = lang;

  try {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error(`Could not load lang/${lang}.json`);
    currentTranslations = await res.json();
  } catch (err) {
    console.error(`⚠️ Failed to load ${lang} file, falling back to English`, err);
    if (lang !== 'en') {
      currentLang = 'en';
      const res = await fetch('lang/en.json');
      currentTranslations = await res.json();
    }
  }

  document.documentElement.setAttribute('lang', currentLang); // ✅ Bonus: useful for debugging and accessibility

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

export { setupLanguage, getTranslation, getLang };
