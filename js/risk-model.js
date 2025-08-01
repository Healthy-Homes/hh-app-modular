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

    applyRiskBadge(homeScore, document.getElementById('home-risk'));
    applyRiskBadge(sdohScore, document.getElementById('sdoh-risk'));
    applyRiskBadge(totalScore, document.getElementById('total-risk'));

    document.getElementById('risk-home-label').textContent = getRiskLabel(homeScore);
    document.getElementById('risk-sdoh-label').textContent = getRiskLabel(sdohScore);
    document.getElementById('risk-combined-label').textContent = getRiskLabel(totalScore);
  });
}

function getRiskLabel(score) {
  if (score <= 33) return 'Low';
  if (score <= 66) return 'Moderate';
  return 'High';
}

function applyRiskBadge(score, el) {
  el.textContent = score.toFixed(0);
  el.classList.remove('bg-green-600', 'bg-yellow-500', 'bg-red-600');
  if (score <= 33) el.classList.add('bg-green-600');
  else if (score <= 66) el.classList.add('bg-yellow-500');
  else el.classList.add('bg-red-600');
}

function getChecklistResponses() {
  const result = {};
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(el => {
    const code = el.getAttribute('data-code');
    if (code) result[code] = el.checked;
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

// ✅ Missing export for use in main.js
export function calculateRiskScores(checklist, sdoh) {
  return {
    homeScore: calculateRisk(checklist, {}),
    sdohScore: calculateRisk({}, sdoh),
    totalScore: calculateRisk(checklist, sdoh)
  };
}
