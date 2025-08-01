import { getLang, getTranslation } from './i18n.js';

export function generateFHIR(checklistData, sdohData, includeRisk, scores) {
  const consent = document.getElementById('consent-checkbox').checked;
  const name = document.getElementById('resident-name').value.trim() || getTranslation('unnamed');

  const bundle = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: []
  };

  Object.entries(checklistData).forEach(([key, value]) => {
    if (value === true) {
      bundle.entry.push({
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: { text: key },
          valueBoolean: true
        }
      });
    }
  });

  Object.entries(sdohData).forEach(([key, value]) => {
    if (value) {
      bundle.entry.push({
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: { text: key },
          valueCodeableConcept: { text: value }
        }
      });
    }
  });

  if (includeRisk && scores) {
    ['checklist', 'sdoh', 'total'].forEach(type => {
      if (scores[type] != null) {
        bundle.entry.push({
          resource: {
            resourceType: 'Observation',
            status: 'final',
            code: { text: `${type} risk score` },
            valueInteger: scores[type]
          }
        });
      }
    });
  }

  bundle.subject = {
    display: name,
    consented: consent
  };

  return bundle;
}
