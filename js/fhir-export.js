import { getTranslation } from './i18n.js';

export function exportFHIRBundle() {
  const now = new Date().toISOString();

  const consentCheckbox = document.querySelector('#consent-block input[type="checkbox"]');
  const nameInput = document.getElementById('resident-name');
  const checklistItems = document.querySelectorAll('#checklist input[type="checkbox"]');
  const sdohItems = document.querySelectorAll('#sdoh-form select');

  const residentName = nameInput?.value?.trim() || 'Unnamed Resident';
  const consentGiven = consentCheckbox?.checked || false;
  const patientId = 'resident-1';

  const bundle = {
    resourceType: 'Bundle',
    type: 'transaction',
    identifier: {
      use: 'official',
      system: 'https://example.org/healthy-homes',
      value: `bundle-${Date.now()}-${residentName.replace(/\s+/g, '_')}`
    },
    entry: []
  };

  // Patient resource
  bundle.entry.push({
    resource: {
      resourceType: 'Patient',
      id: patientId,
      name: [{ text: residentName }]
    },
    request: {
      method: 'POST',
      url: 'Patient'
    }
  });

  // Consent resource
  bundle.entry.push({
    resource: {
      resourceType: 'Consent',
      status: consentGiven ? 'active' : 'inactive',
      patient: { reference: `Patient/${patientId}` },
      dateTime: now,
      policyRule: { text: 'Healthy Homes Inspection Consent' },
      provision: {
        type: 'permit',
        actor: [{ role: { text: 'Inspector' }, reference: { display: 'Field Inspector' } }],
        action: [{ text: 'Observe' }]
      }
    },
    request: {
      method: 'POST',
      url: 'Consent'
    }
  });

  // Checklist items → Observations
  checklistItems.forEach(cb => {
    if (cb.checked) {
      const label = cb.dataset.label || cb.name || 'Checklist Item';
      const code = cb.dataset.code || `checklist-${label.replace(/\s+/g, '-').toLowerCase()}`;

      bundle.entry.push({
        resource: {
          resourceType: 'Observation',
          status: 'final',
          code: {
            coding: [{
              system: cb.dataset.codeSystem || 'https://example.org/checklist',
              code: code,
              display: label
            }],
            text: label
          },
          subject: { reference: `Patient/${patientId}` },
          effectiveDateTime: now,
          valueBoolean: true
        },
        request: {
          method: 'POST',
          url: 'Observation'
        }
      });
    }
  });

  // SDOH form items → Observations
  sdohItems.forEach(select => {
    const selectedOption = select.options[select.selectedIndex];
    const label = select.dataset.label || select.name || 'SDOH Item';
    const code = select.dataset.code || `sdoh-${label.replace(/\s+/g, '-').toLowerCase()}`;

    bundle.entry.push({
      resource: {
        resourceType: 'Observation',
        status: 'final',
        code: {
          coding: [{
            system: select.dataset.codeSystem || 'https://example.org/sdoh',
            code: code,
            display: label
          }],
          text: label
        },
        subject: { reference: `Patient/${patientId}` },
        effectiveDateTime: now,
        valueString: selectedOption.textContent
      },
      request: {
        method: 'POST',
        url: 'Observation'
      }
    });
  });

  // Download the bundle
  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `healthy-homes-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
