import { getTranslation } from './i18n.js';

export async function loadSDOH() {
  const res = await fetch('data/sdoh.csv');
  const text = await res.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('sdoh-form');
  container.innerHTML = ''; // Clear old content on reload

  // Header parser
  const headers = lines[0].split(',');
  const idxMap = {};
  headers.forEach((h, i) => (idxMap[h] = i));

  lines.slice(1).forEach(line => {
    const cols = line.split(',');

    const id = cols[idxMap['id']];
    const labelKey = cols[idxMap['label_key']];
    const code = cols[idxMap['code']];
    const codeSystem = cols[idxMap['code_system']];

    const optionKeys = headers
      .filter(h => h.startsWith('opt'))
      .map(h => cols[idxMap[h]])
      .filter(k => k && k.trim().length > 0);

    const div = document.createElement('div');
    div.className = 'p-2 border-b';

    const label = document.createElement('label');
    label.className = 'font-medium';
    label.setAttribute('for', id);
    label.textContent = getTranslation(labelKey);

    const select = document.createElement('select');
    select.id = id;
    select.className = 'border mt-1 w-full';
    select.setAttribute('data-observation', '');
    select.setAttribute('data-label', getTranslation(labelKey));
    select.setAttribute('data-code', code);
    select.setAttribute('data-code-system', codeSystem);

    optionKeys.forEach(optKey => {
      const option = document.createElement('option');
      option.value = optKey;
      option.textContent = getTranslation(optKey);
      select.appendChild(option);
    });

    div.appendChild(label);
    div.appendChild(document.createElement('br'));
    div.appendChild(select);
    container.appendChild(div);
  });
}
