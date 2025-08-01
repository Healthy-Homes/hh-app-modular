// js/risk-model.js
import { RISK_WEIGHTS } from './risk-weights.js';

// ✅ Core scoring function with diagnostics
export function calculateRisk(checklistResponses, sdohResponses) {
  console.group('🧮 Risk Calculation');
  console.log('Checklist:', checklistResponses);
  console.log('SDOH:', sdohResponses);

  let total = 0;
  let checklistPoints = 0;
  let sdohPoints = 0;

  // ✅ Score checklist items
  for (let [key, value] of Object.entries(checklistResponses)) {
    if (value === true) {
      const points = RISK_WEIGHTS.checklist[key];
      if (points !== undefined) {
        checklistPoints += points;
        total += points;
        console.log(`✅ ${key} → +${points}`);
      } else {
        console.warn(`⚠️ ${key} has no weight defined`);
      }
    }
  }

  // ✅ Score SDOH items
  for (let [key, response] of Object.entries(sdohResponses)) {
    const weightMap = RISK_WEIGHTS.sdoh[key];
    if (weightMap && weightMap[response] !== undefined) {
      const points = weightMap[response];
      sdohPoints += points;
      total += points;
      console.log(`✅ ${key} (${response}) → +${points}`);
    } else {
      console.warn(`⚠️ ${key} has no match for response "${response}"`);
    }
  }

  const finalScore = Math.min(total, 100);
  console.log(`🎯 Total Score: ${finalScore} (checklist: ${checklistPoints}, sdoh: ${sdohPoints})`);
  console.groupEnd();

  return finalScore;
}

// ✅ Setup risk scoring UI toggle
export function setupRiskScoring() {
  console.group('🧩 setupRiskScoring');
  const toggle = document.getElementById('risk-toggle');
  const output = document.getElementById('risk-score-output');

  if (!toggle || !output) {
    console.warn('⚠️ Risk toggle or output element missing');
    return;
  }

  // Replace existing listener
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
  });

  console.groupEnd();
}

// ✅ Helper: apply risk color + text label
function applyRiskBadge(score, el) {
  el.textContent = score;
  el.classList.remove(
    'bg-green-600',
    'bg-yellow-500',
    'bg-red-600',
    'text-black',
    'text-white'
  );

  let levelText = '';
  let labelColor = '';

  if (score <= 33) {
    el.classList.add('bg-green-600', 'text-white');
    levelText = 'Low';
    labelColor = 'text-green-700';
  } else if (score <= 66) {
    el.classList.add('bg-yellow-500', 'text-white');
    levelText = 'Moderate';
    labelColor = 'text-yellow-700';
  } else {
    el.classList.add('bg-red-600', 'text-white');
    levelText = 'High';
    labelColor = 'text-red-700';
  }

  // Look for corresponding label element
  const labelEl = document.getElementById(`${el.id}-label`);
  if (labelEl) {
    labelEl.textContent = levelText;
    labelEl.className = `ml-2 text-sm font-semibold ${labelColor}`;
  }
}

// ✅ Helper: parse checklist checkboxes
function getChecklistResponses() {
  const result = {};
  document.querySelectorAll('#checklist input[type="checkbox"]').forEach(el => {
    result[el.id] = el.checked;
  });
  return result;
}

// ✅ Helper: parse sdoh selects
function getSDOHResponses() {
  const result = {};
  document.querySelectorAll('#sdoh-form select').forEach(el => {
    result[el.id] = el.value;
  });
  return result;
}

// ✅ Dev tool
window.debugRiskScoring = () => {
  console.group('🔍 debugRiskScoring()');
  const checklist = getChecklistResponses();
  const sdoh = getSDOHResponses();
  const total = calculateRisk(checklist, sdoh);
  console.log({ checklist, sdoh, total });
  console.groupEnd();
};
