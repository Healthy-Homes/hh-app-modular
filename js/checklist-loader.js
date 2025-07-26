import { getTranslation } from './i18n.js';

export async function loadChecklist() {
  const res = await fetch('data/checklist.csv');
  const text = await res.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('checklist');
  container.innerHTML = ''; // clear on reload

  lines.forEach((line, idx) => {
    if (idx === 0) return; // skip header
    const [itemKey, labelKey, descKey] = line.split(',');

    const div = document.createElement('div');
    div.className = 'p-2 border rounded bg-white shadow flex items-start space-x-3';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = itemKey;
    checkbox.className = 'mt-1';

    const label = document.createElement('label');
    label.setAttribute('for', itemKey);
    label.innerHTML = `<strong>${getTranslation(labelKey)}</strong><br/><span>${getTranslation(descKey)}</span>`;

    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });
}
