import { getLang, getTranslation } from './i18n.js';

export async function loadChecklist() {
  const response = await fetch('checklist.csv');
  const csv = await response.text();
  const rows = csv.trim().split('\n').map(r => r.split(','));

  const container = document.getElementById('checklist-items');
  if (!container) return;
  container.innerHTML = '';

  rows.slice(1).forEach(([id, label, description]) => {
    const labelText = getTranslation(`label_${id}`) || label;
    const descText = getTranslation(`desc_${id}`) || description;

    const div = document.createElement('div');
    div.className = 'mb-4';

    const labelEl = document.createElement('label');
    labelEl.className = 'block font-semibold';
    labelEl.textContent = labelText;

    const descEl = document.createElement('p');
    descEl.className = 'text-sm text-gray-600';
    descEl.textContent = descText;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    input.name = id;
    input.className = 'mr-2';

    div.appendChild(input);
    div.appendChild(labelEl);
    div.appendChild(descEl);
    container.appendChild(div);
  });

  console.log('✅ Checklist loaded and translated');
}
