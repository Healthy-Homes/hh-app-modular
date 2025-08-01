// Debug version with detailed logging
console.log('🚀 Starting app initialization...');

window.addEventListener('DOMContentLoaded', async () => {
  console.log('🎯 DOM loaded, starting modules...');

  try {
    // Test imports one by one
    console.log('📦 Loading i18n module...');
    const { setupLanguage } = await import('./i18n.js');
    console.log('✅ i18n loaded');

    console.log('📦 Loading consent module...');
    const { setupConsent } = await import('./consent.js');
    console.log('✅ consent loaded');

    console.log('📦 Loading checklist module...');
    const { loadChecklist, getChecklistData } = await import('./checklist-loader.js');
    console.log('✅ checklist module loaded');

    console.log('📦 Loading SDOH module...');
    const { loadSDOH, getSDOHData } = await import('./sdoh-loader.js');
    console.log('✅ SDOH module loaded');

    console.log('📦 Loading risk model...');
    const { calculateRiskScores, setupRiskScoring } = await import('./risk-model.js');
    console.log('✅ risk model loaded');

    console.log('📦 Loading export modules...');
    const { exportPDF } = await import('./pdf-export.js');
    const { generateFHIR } = await import('./fhir-export.js');
    console.log('✅ export modules loaded');

    console.log('📦 Loading map module...');
    const { initializeMap } = await import('./map.js');
    console.log('✅ map module loaded');

    // Initialize step by step
    console.log('🌐 Setting up language...');
    await setupLanguage();
    console.log('✅ Language setup complete');

    console.log('📝 Setting up consent...');
    setupConsent();
    console.log('✅ Consent setup complete');

    console.log('📋 Loading checklist data...');
    await loadChecklist();
    console.log('✅ Checklist data loaded');

    console.log('🏥 Loading SDOH data...');
    await loadSDOH();
    console.log('✅ SDOH data loaded');

    console.log('🗺️ Initializing map...');
    initializeMap().catch(err => {
      console.warn('⚠️ Map failed to load:', err);
    });

    console.log('🎲 Setting up risk scoring...');
    setupRiskScoring();
    console.log('✅ Risk scoring setup complete');

    console.log('📄 Setting up export functionality...');
    const exportBtn = document.getElementById('export-report');
    if (!exportBtn) {
      console.error('🛑 Export button not found!');
      return;
    }

    exportBtn.addEventListener('click', () => {
      console.log('📄 Export clicked');
      try {
        const checklistData = getChecklistData();
        const sdohData = getSDOHData();
        const includeRisk = document.getElementById('risk-toggle')?.checked ?? false;
        
        console.log('Export data check:', {
          checklistItems: Object.keys(checklistData).length,
          sdohItems: Object.keys(sdohData).length,
          includeRisk
        });
        
        let scores = null;
        if (includeRisk) {
          scores = calculateRiskScores(checklistData, sdohData);
          console.log('Risk scores calculated:', scores);
        }
        
        const bundle = generateFHIR(checklistData, sdohData, includeRisk, scores);
        console.log('FHIR bundle generated, calling PDF export...');
        exportPDF(bundle);
      } catch (exportError) {
        console.error('🛑 Export failed:', exportError);
        alert('Export failed: ' + exportError.message);
      }
    });

    console.log('🎉 App initialization complete!');
    
  } catch (error) {
    console.error('🛑 Initialization failed at step:', error);
    console.error('Stack trace:', error.stack);
    
    // Show user-friendly error
    const main = document.querySelector('main');
    if (main) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
      errorDiv.innerHTML = `
        <strong>App Failed to Load:</strong><br>
        ${error.message}<br>
        <small>Check console for details</small>
      `;
      main.insertBefore(errorDiv, main.firstChild);
    }
  }
});