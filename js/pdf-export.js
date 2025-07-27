export function exportPDF(bundle) {
  try {
    console.log('📦 Bundle received in exportPDF:', bundle);

    const checklistItems = [];
    const sdohItems = [];
    let consentStatus = 'Unknown';
    let residentName = 'N/A';

    for (const entry of bundle.entry || []) {
      const resource = entry.resource;

      // Extract consent status
      if (resource.resourceType === 'Consent') {
        consentStatus = resource.status || 'unknown';
      }

      // Extract resident name (if included as Patient resource)
      if (resource.resourceType === 'Patient' && resource.name?.[0]?.text) {
        residentName = resource.name[0].text;
      }

      // Extract checklist and SDOH items from Observations
      if (resource.resourceType === 'Observation') {
        const display = resource.code?.coding?.[0]?.display || resource.code?.text || 'Unknown';
        let value = '—';

        if (typeof resource.valueBoolean === 'boolean') {
          value = resource.valueBoolean ? 'Yes' : 'No';
          checklistItems.push({ display, value });
        } else if (resource.valueString) {
          value = resource.valueString;
          sdohItems.push({ display, value });
        }
      }
    }

    // 📄 Construct the PDF document
    const docDefinition = {
      content: [
        { text: 'Healthy Homes Report', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },

        { text: `Resident Name: ${residentName}`, fontSize: 12 },
        { text: `Consent Status: ${consentStatus}`, fontSize: 12, margin: [0, 0, 0, 10] },

        { text: '🏠 Checklist Findings', style: 'subheader', fontSize: 14, margin: [0, 10, 0, 4] },
        checklistItems.length > 0
          ? {
              table: {
                widths: ['70%', '30%'],
                body: [
                  ['Item', 'Present?'],
                  ...checklistItems.map(item => [item.display, item.value])
                ]
              },
              layout: 'lightHorizontalLines'
            }
          : { text: 'No checklist items recorded.', fontSize: 10 },

        { text: '🧠 Social Determinants of Health (SDOH)', style: 'subheader', fontSize: 14, margin: [0, 20, 0, 4] },
        sdohItems.length > 0
          ? {
              table: {
                widths: ['70%', '30%'],
                body: [
                  ['Question', 'Answer'],
                  ...sdohItems.map(item => [item.display, item.value])
                ]
              },
              layout: 'lightHorizontalLines'
            }
          : { text: 'No SDOH responses recorded.', fontSize: 10 },

        { text: '📦 Full FHIR Bundle (JSON)', style: 'subheader', fontSize: 12, margin: [0, 20, 0, 4] },
        {
          text: JSON.stringify(bundle, null, 2),
          fontSize: 7,
          margin: [0, 0, 0, 10]
        }
      ],
      defaultStyle: {
        font: 'Helvetica'
      }
    };

    pdfMake.createPdf(docDefinition).open();
    console.log('✅ Human-readable PDF generated');
  } catch (err) {
    console.error('❌ Error inside exportPDF():', err);
    alert('PDF export failed internally. Check console for details.');
  }
}
