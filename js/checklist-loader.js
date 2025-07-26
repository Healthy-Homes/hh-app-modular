import { getTranslation } from './i18n.js';

export async function loadChecklist() {
  const res = await fetch('data/checklist.csv');
  const text = await res.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('checklist');

  lines.forEach((line, idx) => {
    if (idx === 0) return; // skip header
    const [itemKey, labelKey, descKey] = line.split(',');

    const div = document.createElement('div');
    div.className = 'p-2 border rounded bg-white shadow';
    div.innerHTML = `
      <strong>${getTranslation(labelKey)}</strong><br/>
      <span>${getTranslation(descKey)}</span>
    `;
    container.appendChild(div);
  });
}
