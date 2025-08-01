import { getTranslation } from './i18n.js';

export async function loadChecklist() {
  const response = await fetch('checklist.csv');
  const csv = await response.text();
  const rows = csv.trim().split('\n').map(r => r.split(','));
  const container = document.getElementById('checklist');
  if (!container) return;

  container.innerHTML = '';

  rows.slice(1).forEach(([id, code]) => {
    const labelKey = `label_${id}`;
    const labelText = getTranslation(labelKey);

    const label = document.createElement('label');
    label.classList.add('block', 'mb-2');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.name = id;
    checkbox.classList.add('mr-2');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(labelText));
    container.appendChild(label);
  });

  console.log('✅ Checklist rendered');
}
