import { setupLanguage } from './i18n.js';
import { setupConsent } from './consent.js';
import { initializeMap } from './map.js';
import { exportPDF } from './pdf-export.js';
import { generateFHIR } from './fhir-export.js';
import { calculateRiskScores, setupRiskScoring } from './risk-model.js';
import { loadChecklist, getChecklistData } from './checklist-loader.js';
import { loadSDOH, getSDOHData } from './sdoh-loader.js';

window.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Initializing Healthy Homes App...');

  try {
    // Initialize language and load translations first
    await setupLanguage();
    
    // Setup other components
    setupConsent();
    
    // Load data
    await loadChecklist();
    await loadSDOH();
    
    // Initialize map (async, non-blocking)
    initializeMap().catch(err => {
      console.warn('⚠️ Map initialization failed:', err);
    });
    
    // Setup risk scoring
    setupRiskScoring();

    // Setup export functionality
    const exportBtn = document.getElementById('export-report');
    if (!exportBtn) {
      console.error('🛑 #export-report button not found');
      return;
    }

    exportBtn.addEventListener('click', () => {
      console.log('📄 Export button clicked');
      
      const checklistData = getChecklistData();
      const sdohData = getSDOHData();
      const includeRisk = document.getElementById('risk-toggle')?.checked ?? false;
      
      console.log('Export data:', {
        checklistItems: Object.keys(checklistData).length,
        sdohItems: Object.keys(sdohData).length,
        includeRisk
      });
      
      let scores = null;
      if (includeRisk) {
        scores = calculateRiskScores(checklistData, sdohData);
        console.log('Risk scores:', scores);
      }
      
      const bundle = generateFHIR(checklistData, sdohData, includeRisk, scores);
      exportPDF(bundle);
    });

    console.log('✅ App initialization complete');
    
  } catch (error) {
    console.error('🛑 App initialization failed:', error);
    
    // Show user-friendly error message
    const main = document.querySelector('main');
    if (main) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
      errorDiv.innerHTML = `
        <strong>Initialization Error:</strong> 
        The application failed to load properly. Please refresh the page or check your internet connection.
        <details class="mt-2">
          <summary class="cursor-pointer">Technical Details</summary>
          <pre class="text-xs mt-2">${error.message}</pre>
        </details>
      `;
      main.insertBefore(errorDiv, main.firstChild);
    }
  }
});