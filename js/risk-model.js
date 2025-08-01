import { RISK_WEIGHTS } from './risk-weights.js';

export function calculateRisk(checklistResponses, sdohResponses) {
  let total = 0;
  let checklistPoints = 0;
  let sdohPoints = 0;

  // Calculate checklist points
  for (const [key, value] of Object.entries(checklistResponses)) {
    if (value === true && RISK_WEIGHTS.checklist[key] !== undefined) {
      const points = RISK_WEIGHTS.checklist[key];
      checklistPoints += points;
      total += points;
    }
  }

  // Calculate SDOH points
  for (const [key, response] of Object.entries(sdohResponses)) {
    const mapping = RISK_WEIGHTS.sdoh[key];
    if (mapping && mapping[response] !== undefined) {
      const points = mapping[response];
      sdohPoints += points;
      total += points;
    }
  }

  return {
    checklist: checklistPoints,
    sdoh: sdohPoints,
    total: Math.min(total, 100) // Cap total score at 100
  };
}

export function calculateRiskScores(checklistData, sdohData) {
  const checklistScore = calculateRisk(checklistData, {});
  const sdohScore = calculateRisk({}, sdohData);
  const totalScore = calculateRisk(checklistData, sdohData);
  
  return {
    checklist: checklistScore.checklist,
    sdoh: sdohScore.sdoh,
    total: totalScore.total
  };
}

export function setupRiskScoring() {
  const toggle = document.getElementById('risk-toggle');
  const output = document.getElementById('risk-score-output');

  if (!toggle || !output) {
    console.warn('⚠️ Risk scoring elements not found');
    return;
  }

  toggle.addEventListener('change', () => {
    const isChecked = toggle.checked;

    if (!isChecked) {
      output.classList.add('hidden');
      return;
    }

    const checklist = getChecklistResponses();
    const sdoh = getSDOHResponses();

    const scores = calculateRiskScores(checklist, sdoh);

    output.classList.remove('hidden');

    // Update score displays
    updateRiskDisplay('home-risk', 'risk-home-label', scores.checklist);
    updateRiskDisplay('sdoh-risk', 'risk-sdoh-label', scores.sdoh);
    updateRiskDisplay('total-risk', 'risk-combined-label', scores.total);
  });
}
}

function updateRiskDisplay(scoreId, labelId, score) {
  const scoreEl = document.getElementById(scoreId);
  const labelEl = document.getElementById(labelId);
  
  if (scoreEl) {
    scoreEl.textContent = score.toFixed(0);
    applyRiskBadge(score, scoreEl);
  }
  
  if (labelEl) {
    labelEl.textContent = getRiskLabel(score);
  }
}

function getRiskLabel(score) {
  if (score <= 33) return 'Low';
  if (score <= 66) return 'Moderate';
  return 'High';
}

function applyRiskBadge(score, el) {
  el.classList.remove('bg-green-600', 'bg-yellow-500', 'bg-red-600');
  if (score <= 33) el.classList.add('bg-green-600');
  else if (score <= 66) el.classList.add('bg-yellow-500');
  else el.classList.add('bg-red-600');
}

function getChecklistResponses() {
  const result = {};
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(el => {
    const code = el.getAttribute('data-code') || el.id;
    if (code) {
      result[code] = el.checked;
    }
  });
  console.log('Checklist responses:', result);
  return result;
}

function getSDOHResponses() {
  const result = {};
  document.querySelectorAll('#sdoh input[type="radio"]:checked').forEach(el => {
    result[el.name] = el.value;
  });
  console.log('SDOH responses:', result);
  return result;
}