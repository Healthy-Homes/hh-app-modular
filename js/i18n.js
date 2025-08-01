let currentLang = 'en';
let currentTranslations = {};

export async function setupLanguage() {
  const toggle = document.getElementById('language-toggle');
  if (!toggle) {
    console.warn('⚠️ #language-toggle element not found in DOM');
    return;
  }

  toggle.innerHTML = `
    <div class="flex space-x-2">
      <button id="lang-en" class="px-3 py-1 rounded text-sm font-medium transition-colors">English</button>
      <button id="lang-zh" class="px-3 py-1 rounded text-sm font-medium transition-colors">中文</button>
    </div>
  `;

  const enBtn = document.getElementById('lang-en');
  const zhBtn = document.getElementById('lang-zh');

  if (enBtn && zhBtn) {
    enBtn.addEventListener('click', () => switchLanguage('en'));
    zhBtn.addEventListener('click', () => switchLanguage('zh'));
  }

  // Load initial language
  await switchLanguage(currentLang);
}

export async function switchLanguage(lang) {
  console.log(`🌐 Switching to language: ${lang}`);
  currentLang = lang;

  try {
    const res = await fetch(`lang/${lang}.json`);
    if (!res.ok) throw new Error(`Could not load lang/${lang}.json: ${res.status}`);
    currentTranslations = await res.json();
    
    console.log(`✅ Loaded ${Object.keys(currentTranslations).length} translations for ${lang}`);
  } catch (err) {
    console.error(`🛑 Failed to load ${lang} translations:`, err);
    if (lang !== 'en') {
      console.log('⚠️ Falling back to English');
      currentLang = 'en';
      try {
        const res = await fetch('lang/en.json');
        if (res.ok) {
          currentTranslations = await res.json();
        }
      } catch (fallbackErr) {
        console.error('🛑 Failed to load fallback English translations:', fallbackErr);
        currentTranslations = {};
      }
    }
  }

  // Update language toggle button states
  updateLanguageButtons();

  // Apply translations to elements with data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = currentTranslations[key];
    if (translation) {
      el.textContent = translation;
    }
  });

  // Apply translations to placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = currentTranslations[key];
    if (translation) {
      el.setAttribute('placeholder', translation);
    }
  });

  // Reload dynamic content if functions are available
  try {
    if (typeof window.loadChecklist === 'function') {
      await window.loadChecklist();
    }
    if (typeof window.loadSDOH === 'function') {
      await window.loadSDOH();
    }
    if (typeof window.setupConsent === 'function') {
      // Import and call setupConsent
      const { setupConsent } = await import('./consent.js');
      setupConsent();
    }
  } catch (err) {
    console.warn('⚠️ Error reloading dynamic content after language switch:', err);
  }

  console.log(`✅ Language switched to ${lang}`);
}

function updateLanguageButtons() {
  const enBtn = document.getElementById('lang-en');
  const zhBtn = document.getElementById('lang-zh');
  
  if (enBtn && zhBtn) {
    // Reset button styles
    enBtn.className = 'px-3 py-1 rounded text-sm font-medium transition-colors bg-gray-200 hover:bg-gray-300';
    zhBtn.className = 'px-3 py-1 rounded text-sm font-medium transition-colors bg-gray-200 hover:bg-gray-300';
    
    // Highlight current language
    if (currentLang === 'en') {
      enBtn.className = 'px-3 py-1 rounded text-sm font-medium transition-colors bg-blue-600 text-white';
    } else if (currentLang === 'zh') {
      zhBtn.className = 'px-3 py-1 rounded text-sm font-medium transition-colors bg-blue-600 text-white';
    }
  }
}

export function getTranslation(key) {
  return currentTranslations[key] || key;
}

export function getLang() {
  return currentLang;
}