// js/risk-model.js
import { RISK_WEIGHTS } from './risk-weights.js';

export function calculateRisk(checklistResponses, sdohResponses) {
  let total = 0;
  let checklistPoints = 0;
  let sdohPoints = 0;

  for (let [key, value] of Object.entries(checklistResponses)) {
    if (value === true) {
      const points = RISK_WEIGHTS.checklist[key];
      if (points !== undefined) {
        checklistPoints += points;
        total += points;
      }
    }
  }

  for (let [key, response] of Object.entries(sdohResponses)) {
    const weightMap = RISK_WEIGHTS.sdoh[key];
    if (weightMap && weightMap[response] !== undefined) {
      const points = weightMap[response];
      sdohPoints += points;
      total += points;
    }
  }

  return Math.min(total, 100);
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
    applyRiskBadge(homeScore, 'home-risk', 'home-risk-label');
    applyRiskBadge(sdohScore, 'sdoh-risk', 'sdoh-risk-label');
    applyRiskBadge(totalScore, 'total-risk', 'total-risk-label');
  });
}

function applyRiskBadge(score, scoreId, labelId) {
  const scoreEl = document.getElementById(scoreId);
  const labelEl = document.getElementById(labelId);

  if (!scoreEl || !labelEl) return;

  scoreEl.textContent = score;
  labelEl.textContent = getRiskLevelText(score);

  scoreEl.classList.remove('bg-green-600', 'bg-yellow-500', 'bg-red-600');
  if (score <= 33) scoreEl.classList.add('bg-green-600');
  else if (score <= 66) scoreEl.classList.add('bg-yellow-500');
  else scoreEl.classList.add('bg-red-600');
}

function getRiskLevelText(score) {
  if (score <= 33) return 'Low';
  if (score <= 66) return 'Moderate';
  return 'High';
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
