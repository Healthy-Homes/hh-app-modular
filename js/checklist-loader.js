import { getTranslation } from './i18n.js';

let checklistData = {};

export async function loadChecklist() {
  const res = await fetch('data/checklist.csv');
  const text = await res.text();
  const rows = text.trim().split('\n').slice(1);

  const container = document.getElementById('checklist');
  container.innerHTML = '';
  checklistData = {};

  for (const row of rows) {
    const [code] = row.split(',');
    const label = getTranslation(`label_${code}`) || code;

    const div = document.createElement('div');
    div.className = 'mb-2';
    div.innerHTML = `
      <label>
        <input type="checkbox" id="${code}" />
        ${label}
      </label>`;
    container.appendChild(div);

    document.getElementById(code).addEventListener('change', (e) => {
      checklistData[code] = e.target.checked;
    });
  }
}

export function getChecklistData() {
  return checklistData;
}
