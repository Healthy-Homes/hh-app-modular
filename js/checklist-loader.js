import { getTranslation } from './i18n.js';
import { RISK_WEIGHTS } from './risk-weights.js';

export async function loadChecklist() {
  const res = await fetch('data/checklist.csv');
  const text = await res.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('checklist');
  container.innerHTML = ''; // clear on reload

  // Parse header
  const headers = lines[0].split(',');
  const idxMap = {};
  headers.forEach((h, i) => (idxMap[h] = i));

  lines.slice(1).forEach(line => {
    const cols = line.split(',');

    const itemKey = cols[idxMap['item_key']];
    const labelKey = cols[idxMap['label_key']];
    const descKey = cols[idxMap['description_key']];
    const code = cols[idxMap['code']];
    const codeSystem = cols[idxMap['code_system']];

    if (!(itemKey in RISK_WEIGHTS.checklist)) {
      console.warn(`⚠️ Checklist itemKey "${itemKey}" not found in RISK_WEIGHTS.checklist`);
    }

    const div = document.createElement('div');
    div.className = 'p-2 border rounded bg-white shadow flex items-start space-x-3';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = itemKey;
    checkbox.className = 'mt-1';
    checkbox.setAttribute('data-observation', '');
    checkbox.setAttribute('data-label', getTranslation(labelKey));
    checkbox.setAttribute('data-code', code);
    checkbox.setAttribute('data-code-system', codeSystem);

    const label = document.createElement('label');
    label.setAttribute('for', itemKey);
    label.innerHTML = `<strong>${getTranslation(labelKey)}</strong><br/><span>${getTranslation(descKey)}</span>`;

    div.appendChild(checkbox);
    div.appendChild(label);
    container.appendChild(div);
  });
}
