import { getLang, getTranslation } from './i18n.js';

export async function loadSDOH() {
  const response = await fetch('sdoh.csv');
  const csv = await response.text();
  const rows = csv.trim().split('\n').map(r => r.split(','));

  const container = document.getElementById('sdoh-form');
  if (!container) return;

  container.innerHTML = '';

  rows.slice(1).forEach(([id, type, value]) => {
    const labelKey = `${id}_label`;
    const labelText = getTranslation(labelKey);

    if (!container.querySelector(`#${id}`)) {
      const label = document.createElement('label');
      label.textContent = labelText;
      label.setAttribute('for', id);
      label.classList.add('block', 'mt-4', 'font-semibold');
      container.appendChild(label);

      const select = document.createElement('select');
      select.id = id;
      select.name = id;
      select.classList.add('w-full', 'border', 'p-2', 'rounded');
      container.appendChild(select);
    }

    const opt = document.createElement('option');
    const optKey = `${id}_opt${value}`;
    opt.value = optKey;
    opt.textContent = getTranslation(optKey);
    container.querySelector(`#${id}`).appendChild(opt);
  });

  console.log('✅ SDOH form loaded and translated');
}
