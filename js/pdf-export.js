export function exportPDF(bundle) {
  try {
    if (!bundle || !Array.isArray(bundle.entry)) {
      throw new Error('Invalid or missing FHIR bundle.');
    }

    console.log('📦 Bundle received in exportPDF:', bundle);

    const checklistItems = [];
    const sdohItems = [];
    let consentStatus = 'Unknown';
    let residentName = 'N/A';

    for (const entry of bundle.entry) {
      const resource = entry.resource;

      if (!resource) continue;

      // ✅ Consent status
      if (resource.resourceType === 'Consent') {
        consentStatus = resource.status || 'Unknown';
      }

      // ✅ Patient name
      if (resource.resourceType === 'Patient' && resource.name?.[0]?.text) {
        residentName = resource.name[0].text;
      }

      // ✅ Checklist (Boolean) vs SDOH (String)
      if (resource.resourceType === 'Observation') {
        const display = resource.code?.coding?.[0]?.display || resource.code?.text || 'Unnamed';
        if (typeof resource.valueBoolean === 'boolean') {
          checklistItems.push({ display, value: resource.valueBoolean ? 'Yes' : 'No' });
        } else if (resource.valueString) {
          sdohItems.push({ display, value: resource.valueString });
        }
      }
    }

    // ✅ Safe default tables
    const checklistTable = checklistItems.length
      ? {
          table: {
            widths: ['*', 60],
            body: [['Item', 'Present?'], ...checklistItems.map(i => [i.display, i.value])]
          },
          layout: 'lightHorizontalLines'
        }
      : { text: 'No checklist data recorded.', italics: true };

    const sdohTable = sdohItems.length
      ? {
          table: {
            widths: ['*', 60],
            body: [['Question', 'Answer'], ...sdohItems.map(i => [i.display, i.value])]
          },
          layout: 'lightHorizontalLines'
        }
      : { text: 'No SDOH responses recorded.', italics: true };

    const docDefinition = {
      content: [
        { text: '🏠 Healthy Homes Report', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },

        { text: `Resident: ${residentName}`, fontSize: 12 },
        { text: `Consent Status: ${consentStatus}`, fontSize: 12, margin: [0, 0, 0, 10] },

        { text: 'Checklist Results', style: 'subheader', fontSize: 14, margin: [0, 10, 0, 4] },
        checklistTable,

        { text: 'SDOH Responses', style: 'subheader', fontSize: 14, margin: [0, 20, 0, 4] },
        sdohTable,

        { text: 'Full FHIR Bundle (JSON)', style: 'subheader', fontSize: 12, margin: [0, 20, 0, 4] },
        {
          text: JSON.stringify(bundle, null, 2).substring(0, 6000), // avoid overload
          fontSize: 7,
          margin: [0, 0, 0, 10]
        }
      ],
      defaultStyle: { font: 'Helvetica' }
    };

    if (!window.pdfMake || typeof window.pdfMake.createPdf !== 'function') {
      console.error('❌ pdfMake not ready');
      alert('PDF library is not loaded.');
      return;
    }

    pdfMake.createPdf(docDefinition).open();
    console.log('✅ PDF opened');
  } catch (err) {
    console.error('❌ Error in exportPDF():', err);
    alert('PDF export failed. See console for details.');
  }
}
