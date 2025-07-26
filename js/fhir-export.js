// fhir-export.js
import { getTranslation } from './i18n.js';

export function exportFHIRBundle() {
  const bundle = {
    resourceType: "Bundle",
    type: "collection",
    entry: []
  };

  const residentName = document.getElementById('resident-name')?.value.trim();
  const consentChecked = document.getElementById('consent-checkbox')?.checked;

  const timestamp = new Date().toISOString();

  if (residentName || consentChecked) {
    bundle.entry.push({
      resource: {
        resourceType: "Observation",
        id: "consent-status",
        status: "final",
        code: {
          coding: [
            {
              system: "http://loinc.org",
              code: "64292-6", // Hypothetical consent code
              display: "Consent to inspection"
            }
          ]
        },
        subject: {
          display: residentName || "Unknown resident"
        },
        effectiveDateTime: timestamp,
        valueBoolean: !!consentChecked
      }
    });
  }

  // Checklist items (checkboxes)
  document.querySelectorAll('#checklist input[type="checkbox"]:checked').forEach(input => {
    const id = input.id;
    const label = getTranslation(`label_${id}`);

    bundle.entry.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        code: {
          coding: [
            {
              system: "https://gravityproject.net",
              code: `housing-${id}`,
              display: label
            }
          ]
        },
        effectiveDateTime: timestamp,
        valueBoolean: true
      }
    });
  });

  // SDOH questions
  document.querySelectorAll('#sdoh-form select').forEach(select => {
    const id = select.dataset.sdohId;
    const questionLabel = getTranslation(`${id}_label`);
    const answerValue = select.value;

    bundle.entry.push({
      resource: {
        resourceType: "Observation",
        status: "final",
        code: {
          coding: [
            {
              system: "https://gravityproject.net",
              code: `sdoh-${id}`,
              display: questionLabel
            }
          ]
        },
        effectiveDateTime: timestamp,
        valueString: answerValue
      }
    });
  });

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'HealthyHomesReport.json';
  a.click();

  URL.revokeObjectURL(url);
}
