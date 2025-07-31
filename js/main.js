// main.js
import { loadChecklist } from './checklist-loader.js';
import { loadSDOH } from './sdoh-loader.js';
import { setupConsent } from './consent.js';
import { setupLanguage } from './i18n.js';
import { exportFHIRBundle } from './fhir-export.js';
import { exportPDF } from './pdf-export.js';
import { initializeMap } from './map.js';
import { calculateRisk } from './risk-model.js';

console.log('✅ Main.js loaded');

document.addEventListener('DOMContentLoaded', async () => {
  console.log('✅ DOM fully loaded');

  try {
    setupLanguage();     // ✅ Sets up language toggle and default
    setupConsent();      // ✅ Loads consent fields

    await Promise.all([
      loadChecklist(),
      loadSDOH(),
      initializeMap()
    ]);

    console.log('✅ Checklist, SDOH, and Map loaded');
  } catch (err) {
    console.error('❌ App load failed:', err);
    alert('App failed to load. Please refresh.');
    return;
  }

  // ✅ Risk scoring logic
  const riskToggle = document.getElementById('risk-toggle');
  const riskPanel = document.getElementById('risk-score-output');

  if (riskToggle) {
    riskToggle.addEventListener('change', (e) => {
      const showRisk = e.target.checked;
      if (!showRisk) {
        riskPanel.classList.add('hidden');
        return;
      }

      const checklistResponses = getChecklistResponses();
      const sdohResponses = getSDOHResponses();

      const homeScore = calculateRisk(checklistResponses, {});
      const sdohScore = calculateRisk({}, sdohResponses);
      const totalScore = calculateRisk(checklistResponses, sdohResponses);

      riskPanel.classList.remove('hidden');
      applyRiskBadge(homeScore, document.getElementById('home-risk'));
      applyRiskBadge(sdohScore, document.getElementById('sdoh-risk'));
      applyRiskBadge(totalScore, document.getElementById('total-risk'));
    });
  }

  const exportBtn = document.getElementById('export-btn');
  if (!exportBtn) {
    console.warn('⚠️ Export button missing');
    return;
  }

  exportBtn.addEventListener('click', async () => {
    try {
      const bundle = await exportFHIRBundle();
      console.log('✅ FHIR Bundle ready:', bundle);

      await waitForPdfMake(); // ⏳ Confirm library is available

      exportPDF(bundle);      // 🧾 Generate English-only PDF
    } catch (err) {
      console.error('❌ Export failed:', err);
      alert('Unable to generate report.');
    }
  });
});

// ✅ Wait for pdfMake to become available in global scope
function waitForPdfMake() {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const maxAttempts = 30; // ~6 seconds
    const interval = setInterval(() => {
      if (window.pdfMake && typeof window.pdfMake.createPdf === 'function') {
        clearInterval(interval);
        console.log('✅ pdfMake loaded and ready');
        resolve();
      } else if (++attempts >= maxAttempts) {
        clearInterval(interval);
        reject(new Error('❌ pdfMake failed to load after multiple attempts'));
      }
    }, 200);
  });
}

// 🔍 Helpers for risk scoring logic
function applyRiskBadge(score, el) {
  el.textContent = score;
  el.classList.remove('bg-green-600', 'bg-yellow-500', 'bg-red-600');
  if (score <= 33) el.classList.add('bg-green-600');
  else if (score <= 66) el.classList.add('bg-yellow-500');
  else el.classList.add('bg-red-600');
}

function getChecklistResponses() {
  const responses = {};
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(input => {
    responses[input.id] = input.checked;
  });
  return responses;
}

function getSDOHResponses() {
  const responses = {};
  document.querySelectorAll('#sdoh select').forEach(select => {
    responses[select.id] = select.value;
  });
  return responses;
}
