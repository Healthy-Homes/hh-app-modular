import { getTranslation } from './i18n.js';

let sdohData = {};

export async function loadSDOH() {
  try {
    const res = await fetch('data/sdoh.csv');
    if (!res.ok) throw new Error(`Failed to load sdoh.csv: ${res.status}`);
    
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1); // Skip header

    const container = document.getElementById('sdoh');
    if (!container) {
      console.error('🛑 #sdoh container not found');
      return;
    }

    container.innerHTML = '';
    sdohData = {};

    for (const row of rows) {
      if (!row.trim()) continue;
      
      const parts = row.split(',');
      const questionId = parts[0]?.trim();
      const labelKey = parts[1]?.trim();
      const opt1Key = parts[2]?.trim();
      const opt2Key = parts[3]?.trim();
      const opt3Key = parts[4]?.trim();
      const code = parts[5]?.trim();
      
      if (!questionId || !labelKey) continue;
      
      const questionLabel = getTranslation(labelKey) || questionId;
      
      const questionDiv = document.createElement('div');
      questionDiv.className = 'mb-4 p-4 border rounded bg-white';
      
      const labelEl = document.createElement('h4');
      labelEl.className = 'font-semibold mb-3 text-gray-800';
      labelEl.textContent = questionLabel;
      questionDiv.appendChild(labelEl);

      const optionsDiv = document.createElement('div');
      optionsDiv.className = 'space-y-2';

      // Create options for each available option key
      const optionKeys = [
        { key: opt1Key, value: 'opt1' },
        { key: opt2Key, value: 'opt2' },
        { key: opt3Key, value: 'opt3' }
      ].filter(opt => opt.key && opt.key.trim());

      for (const { key, value } of optionKeys) {
        const translatedOption = getTranslation(key) || key;
        
        const optionDiv = document.createElement('div');
        optionDiv.className = 'flex items-center space-x-2';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = questionId;
        radio.value = value;
        radio.id = `${questionId}_${value}`;
        radio.className = 'text-blue-600';
        
        const label = document.createElement('label');
        label.htmlFor = radio.id;
        label.textContent = translatedOption;
        label.className = 'cursor-pointer text-gray-700';
        
        radio.addEventListener('change', () => {
          if (radio.checked) {
            sdohData[questionId] = value;
            console.log(`SDOH updated: ${questionId} = ${value}`);
          }
        });
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(label);
        optionsDiv.appendChild(optionDiv);
      }
      
      questionDiv.appendChild(optionsDiv);
      container.appendChild(questionDiv);
    }
    
    console.log('✅ SDOH loaded successfully');
  } catch (error) {
    console.error('🛑 Error loading SDOH:', error);
  }
}

export function getSDOHData() {
  return { ...sdohData };
}

// Make function globally available for i18n.js
window.loadSDOH = loadSDOH;