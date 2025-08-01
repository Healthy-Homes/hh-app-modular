window.loadChecklist = async function () {
  const res = await fetch('data/checklist.csv');
  const text = await res.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('checklist');
  container.innerHTML = ''; // Clear on reload

  const headers = lines[0].split(',').map(h => h.trim());
  const idxMap = {};
  headers.forEach((h, i) => (idxMap[h] = i));

  lines.slice(1).forEach((line, rowIdx) => {
    const cols = line.split(',').map(c => c.trim());

    const itemKey = cols[idxMap['item_key']];
    const labelKey = cols[idxMap['label_key']];
    const descKey = cols[idxMap['description_key']];
    const code = cols[idxMap['code']];
    const codeSystem = cols[idxMap['code_system']];

    if (!itemKey || !labelKey) {
      console.warn(`⚠️ Skipping row ${rowIdx + 2}: missing item_key or label_key`);
      return;
    }

    if (typeof RISK_WEIGHTS !== 'undefined' && !(itemKey in RISK_WEIGHTS.checklist)) {
      console.warn(`⚠️ itemKey "${itemKey}" not found in RISK_WEIGHTS.checklist`);
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

  console.log(`✅ Checklist loaded: ${lines.length - 1} items`);
};
