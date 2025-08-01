// ✅ js/fhir-export.js (MODULAR)
export function exportFHIRBundle() {
  const bundle = generateFHIRBundle();
  downloadFHIRJson(bundle);
  return bundle; // ✅ Returned for PDF export
}

function generateFHIRBundle() {
  const name = document.getElementById('resident-name')?.value?.trim() || 'Unnamed';
  const consent = document.getElementById('consent-checkbox')?.checked || false;
  const timestamp = new Date().toISOString();

  const bundle = {
    resourceType: 'Bundle',
    type: 'collection',
    entry: []
  };

  bundle.entry.push({
    resource: {
      resourceType: 'Patient',
      id: 'resident',
      name: [{ text: name }],
      meta: { lastUpdated: timestamp }
    }
  });

  bundle.entry.push({
    resource: {
      resourceType: 'Consent',
      id: 'consent',
      status: consent ? 'active' : 'inactive',
      dateTime: timestamp,
      patient: { reference: 'Patient/resident' }
    }
  });

  document.querySelectorAll('#checklist input[type="checkbox"]').forEach((checkbox, idx) => {
    const label = checkbox.getAttribute('data-label') || `Item ${idx + 1}`;
    bundle.entry.push({
      resource: {
        resourceType: 'Observation',
        code: {
          coding: [{
            system: 'https://example.org/checklist',
            code: `chk-${idx + 1}`,
            display: label
          }],
          text: label
        },
        valueBoolean: checkbox.checked,
        effectiveDateTime: timestamp
      }
    });
  });

  document.querySelectorAll('#sdoh-form select, #sdoh-form input').forEach((el, idx) => {
    const label = el.getAttribute('data-label') || `SDOH ${idx + 1}`;
    let value = '';

    if (el.tagName === 'SELECT') {
      const selectedOption = el.options[el.selectedIndex];
      value = selectedOption?.text || '';
    } else {
      value = el.value?.trim();
    }

    if (value) {
      bundle.entry.push({
        resource: {
          resourceType: 'Observation',
          code: {
            coding: [{
              system: 'http://loinc.org',
              code: `sdoh-${idx + 1}`,
              display: label
            }],
            text: label
          },
          valueString: value,
          effectiveDateTime: timestamp
        }
      });
    }
  });

  return bundle;
}

function downloadFHIRJson(bundle) {
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'healthy-home-report.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
