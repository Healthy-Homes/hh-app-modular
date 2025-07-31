// js/risk-model.js

import { RISK_WEIGHTS } from './risk-weights.js';

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

  return Math.min(total, 100); // normalize max
}
