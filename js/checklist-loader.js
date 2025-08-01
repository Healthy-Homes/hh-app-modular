import { getTranslation } from './i18n.js';

export async function loadChecklist() {
  const container = document.getElementById('checklist');
  if (!container) {
    console.warn('⚠️ #checklist element not found in DOM');
    return;
  }

  try {
    const res = await fetch('data/checklist.csv');
    const csvText = await res.text();
    const rows = csvText.trim().split('\n').map(line => line.split(','));
    const [header, ...items] = rows;

    container.innerHTML = '<h2 class="text-lg font-bold mb-2">' + getTranslation('checklistTitle') + '</h2>';

    const checklistEl = document.createElement('div');
    checklistEl.className = 'grid grid-cols-1 gap-2';

    items.forEach(([code, label]) => {
      const translatedLabel = getTranslation(code) || label;

      const wrapper = document.createElement('label');
      wrapper.className = 'flex items-center space-x-2';
      wrapper.innerHTML = `
        <input type="checkbox" data-code="${code}" class="check-item accent-green-600" />
        <span>${translatedLabel}</span>
      `;
      checklistEl.appendChild(wrapper);
    });

    container.appendChild(checklistEl);
    console.log('✅ Checklist rendered');
  } catch (err) {
    console.error('❌ Failed to load checklist:', err);
  }
}
