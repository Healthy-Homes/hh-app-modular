import { getTranslation } from './i18n.js';

let sdohData = {};

export async function loadSDOH() {
  const res = await fetch('data/sdoh.csv');
  const text = await res.text();
  const rows = text.trim().split('\n').slice(1);

  const container = document.getElementById('sdoh');
  container.innerHTML = '';
  sdohData = {};

  let currentLabel = null;

  for (const row of rows) {
    const [questionCode, label, value] = row.split(',');
    if (label) currentLabel = label;

    const translatedLabel = getTranslation(`${questionCode}_label`);
    const translatedOption = getTranslation(`${questionCode}_opt${value}`);

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = questionCode;
    radio.value = translatedOption;
    radio.id = `${questionCode}_${value}`;

    radio.addEventListener('change', () => {
      sdohData[questionCode] = translatedOption;
    });

    const labelEl = document.createElement('label');
    labelEl.htmlFor = radio.id;
    labelEl.textContent = translatedOption;

    const div = document.createElement('div');
    div.appendChild(radio);
    div.appendChild(labelEl);

    container.appendChild(div);
  }
}

export function getSDOHData() {
  return sdohData;
}
