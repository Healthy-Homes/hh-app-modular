import { getTranslation } from './i18n.js';

let checklistData = {};

export async function loadChecklist() {
  try {
    const res = await fetch('data/checklist.csv');
    if (!res.ok) throw new Error(`Failed to load checklist.csv: ${res.status}`);
    
    const text = await res.text();
    const rows = text.trim().split('\n').slice(1); // Skip header

    const container = document.getElementById('checklist');
    if (!container) {
      console.error('🛑 #checklist container not found');
      return;
    }

    container.innerHTML = '';
    checklistData = {};

    for (const row of rows) {
      if (!row.trim()) continue; // Skip empty rows
      
      const parts = row.split(',');
      const itemKey = parts[0]?.trim();
      const labelKey = parts[1]?.trim();
      const code = parts[3]?.trim();
      
      if (!itemKey || !code) continue;

      const label = getTranslation(labelKey) || getTranslation(`label_${itemKey}`) || itemKey;

      const div = document.createElement('div');
      div.className = 'mb-2';
      div.innerHTML = `
        <label class="flex items-center space-x-2">
          <input type="checkbox" id="${code}" data-code="${itemKey}" class="form-checkbox" />
          <span>${label}</span>
        </label>`;
      
      container.appendChild(div);

      const checkbox = document.getElementById(code);
      if (checkbox) {
        checkbox.addEventListener('change', (e) => {
          checklistData[itemKey] = e.target.checked;
          console.log(`Checklist updated: ${itemKey} = ${e.target.checked}`);
        });
      }
    }
    
    console.log('✅ Checklist loaded successfully');
  } catch (error) {
    console.error('🛑 Error loading checklist:', error);
  }
}

export function getChecklistData() {
  return { ...checklistData };
}

// Make function globally available for i18n.js
window.loadChecklist = loadChecklist;