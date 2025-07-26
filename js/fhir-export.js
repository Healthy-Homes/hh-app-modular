import { getTranslation } from './i18n.js';

export function exportFHIRBundle() {
  const consentCheckbox = document.querySelector('#consent-block input[type="checkbox"]');
  const nameInput = document.getElementById('resident-name');
  const checklistItems = document.querySelectorAll('#checklist input[type="checkbox"]');
  const sdohItems = document.querySelectorAll('#sdoh-form select');

  const residentName = nameInput?.value || 'Unnamed Resident';
  const consentGiven = consentCheckbox?.checked || false;

  const bundle = {
    resourceType: 'Bundle',
    type: 'collection',
    identifier: {
      use: 'official',
      system: 'https://example.org/healthy-homes',
      value: `bundle-${Date.now()}-${residentName.replace(/\s+/g, '_')}`
    },
    entry: []
  };

  // Include consent status as a basic Observation
  bundle.entry.push({
    resource: {
      resourceType: 'Observation',
      code: {
        text: 'Resident consented to inspection'
      },
      status: 'final',
      valueBoolean: consentGiven
    }
  });

  // Include resident name as a basic Observation
  bundle.entry.push({
    resource: {
      resourceType: 'Observation',
      code: {
        text: 'Resident Name'
      },
      status: 'final',
      valueString: residentName
    }
  });

  // Checklist items
  checklistItems.forEach(cb => {
    if (cb.checked) {
      bundle.entry.push({
        resource: {
          resourceType: 'Observation',
          code: {
            text: cb.dataset.label || cb.name
          },
          status: 'final',
          valueBoolean: true
        }
      });
    }
  });

  // SDOH form responses
  sdohItems.forEach(select => {
    const selectedOption = select.options[select.selectedIndex];
    bundle.entry.push({
      resource: {
        resourceType: 'Observation',
        code: {
          text: select.dataset.label || select.name
        },
        status: 'final',
        valueString: selectedOption.textContent
      }
    });
  });

  const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `healthy-homes-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
