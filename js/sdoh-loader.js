import { getTranslation } from './i18n.js';

export async function loadSDOH() {
  const res = await fetch('data/sdoh.csv');
  const text = await res.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('sdoh-form');
  container.innerHTML = ''; // Clear old content on reload

  lines.forEach((line, idx) => {
    if (idx === 0) return;
    const [id, labelKey, ...optionKeys] = line.split(',');

    const div = document.createElement('div');
    div.className = 'p-2 border-b';

    const label = document.createElement('label');
    label.className = 'font-medium';
    label.textContent = getTranslation(labelKey);

    const select = document.createElement('select');
    select.className = 'border mt-1 w-full';

    // Remove empty keys and fetch translation live
    optionKeys
      .filter(k => k && k.trim().length > 0)
      .forEach(optKey => {
        const option = document.createElement('option');
        option.value = optKey;
        option.textContent = getTranslation(optKey); // 🟢 Re-resolved dynamically
        select.appendChild(option);
      });

    div.appendChild(label);
    div.appendChild(document.createElement('br'));
    div.appendChild(select);
    container.appendChild(div);
  });
}
