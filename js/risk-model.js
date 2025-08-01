// js/risk-model.js

import { RISK_WEIGHTS } from './risk-weights.js';

export function calculateRisk(checklistResponses, sdohResponses) {
  let total = 0;
  let checklistPoints = 0;
  let sdohPoints = 0;

  for (const [key, value] of Object.entries(checklistResponses)) {
    if (value === true && RISK_WEIGHTS.checklist[key] !== undefined) {
      const points = RISK_WEIGHTS.checklist[key];
      checklistPoints += points;
      total += points;
    }
  }

  for (const [key, response] of Object.entries(sdohResponses)) {
    const mapping = RISK_WEIGHTS.sdoh[key];
    if (mapping && mapping[response] !== undefined) {
      const points = mapping[response];
      sdohPoints += points;
      total += points;
    }
  }

  return Math.min(total, 100); // Cap total score at 100
}

export function setupRiskScoring() {
  const toggle = document.getElementById('risk-toggle');
  const output = document.getElementById('risk-score-output');

  if (!toggle || !output) return;

  const cleanToggle = toggle.cloneNode(true);
  toggle.parentNode.replaceChild(cleanToggle, toggle);

  cleanToggle.addEventListener('change', () => {
    const isChecked = cleanToggle.checked;

    if (!isChecked) {
      output.classList.add('hidden');
      return;
    }

    const checklist = getChecklistResponses();
    const sdoh = getSDOHResponses();

    const homeScore = calculateRisk(checklist, {});
    const sdohScore = calculateRisk({}, sdoh);
    const totalScore = calculateRisk(checklist, sdoh);

    output.classList.remove('hidden');
    applyRiskBadge(homeScore, 'risk-home-score', 'risk-home-label');
    applyRiskBadge(sdohScore, 'risk-sdoh-score', 'risk-sdoh-label');
    applyRiskBadge(totalScore, 'risk-combined-score', 'risk-combined-label');
  });
}

<<<<<<< HEAD
<<<<<<< HEAD
function applyRiskBadge(score, scoreId, labelId) {
  const scoreEl = document.getElementById(scoreId);
  const labelEl = document.getElementById(labelId);
  if (!scoreEl || !labelEl) return;

  // Reset classes
  scoreEl.className = 'px-2 py-1 rounded text-white';

  if (score <= 33) {
    scoreEl.classList.add('bg-green-600');
    labelEl.textContent = 'Low';
  } else if (score <= 66) {
    scoreEl.classList.add('bg-yellow-500');
    labelEl.textContent = 'Moderate';
  } else {
    scoreEl.classList.add('bg-red-600');
    labelEl.textContent = 'High';
  }

  scoreEl.textContent = score.toFixed(0);
=======
=======
>>>>>>> parent of 68c3c67 (Enhance risk score output with labels and styling)
// ✅ Helper: apply risk color
function applyRiskBadge(score, el) {
  el.textContent = score;
  el.classList.remove('bg-green-600', 'bg-yellow-500', 'bg-red-600');
  if (score <= 33) el.classList.add('bg-green-600');
  else if (score <= 66) el.classList.add('bg-yellow-500');
  else el.classList.add('bg-red-600');
<<<<<<< HEAD
>>>>>>> parent of 68c3c67 (Enhance risk score output with labels and styling)
=======
>>>>>>> parent of 68c3c67 (Enhance risk score output with labels and styling)
}

function getChecklistResponses() {
  const result = {};
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(el => {
    result[el.id] = el.checked;
  });
  return result;
}

function getSDOHResponses() {
  const result = {};
  document.querySelectorAll('#sdoh-form select').forEach(el => {
    result[el.id] = el.value;
  });
  return result;
}
