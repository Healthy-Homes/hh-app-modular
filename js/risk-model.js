// js/risk-model.js

import { RISK_WEIGHTS } from './risk-weights.js';

// ✅ Core scoring function
export function calculateRisk(checklistResponses, sdohResponses) {
  let total = 0;

  // ✅ Score checklist items
  for (let [key, value] of Object.entries(checklistResponses)) {
    if (value === true && RISK_WEIGHTS.checklist[key]) {
      total += RISK_WEIGHTS.checklist[key];
    }
  }

  // ✅ Score SDOH items
  for (let [key, response] of Object.entries(sdohResponses)) {
    const weight = RISK_WEIGHTS.sdoh[key];
    if (weight && weight[response] !== undefined) {
      total += weight[response];
    }
  }

  return Math.min(total, 100); // Cap score at 100
}

// ✅ UI integration: wire up toggle and scoring display
export function setupRiskScoring() {
  const riskToggle = document.getElementById('risk-toggle');
  const riskPanel = document.getElementById('risk-score-output');

  if (!riskToggle || !riskPanel) {
    console.warn('⚠️ Risk toggle or output panel not found in DOM');
    return;
  }

  // Wait until form fields are likely populated
  setTimeout(() => {
    riskToggle.addEventListener('change', () => {
      const showRisk = riskToggle.checked;

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
  }, 500);
}

// ✅ Display color-coded risk badge
function applyRiskBadge(score, el) {
  el.textContent = score;
  el.classList.remove('bg-green-600', 'bg-yellow-500', 'bg-red-600');
  if (score <= 33) {
    el.classList.add('bg-green-600');
  } else if (score <= 66) {
    el.classList.add('bg-yellow-500');
  } else {
    el.classList.add('bg-red-600');
  }
}

// ✅ Extract checklist values (boolean)
function getChecklistResponses() {
  const responses = {};
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(input => {
    responses[input.id] = input.checked;
  });
  return responses;
}

// ✅ Extract SDOH values (select dropdowns)
function getSDOHResponses() {
  const responses = {};
  document.querySelectorAll('#sdoh-form select').forEach(select => {
    responses[select.id] = select.value;
  });
  return responses;
}
