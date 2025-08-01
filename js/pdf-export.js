window.exportPDF = function (bundle) {
  try {
    console.log('📦 Bundle received in exportPDF:', bundle);

    // Extract basic metadata
    const entryCount = Array.isArray(bundle.entry) ? bundle.entry.length : 0;

    // Build human-readable content summary from checklist Observations
    const items = (bundle.entry || [])
      .filter(e => e.resource?.resourceType === 'Observation')
      .map((e, idx) => {
        const display = e.resource?.code?.coding?.[0]?.display || 'Unknown item';
        const value = e.resource?.valueBoolean === true ? 'Yes' : 'No';
        return `${idx + 1}. ${display}: ${value}`;
      });

    const docDefinition = {
      content: [
        { text: 'Healthy Homes Report', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },

        { text: 'FHIR Bundle Summary', fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
        {
          ul: [
            `Resource Type: ${bundle.resourceType || 'N/A'}`,
            `Entries: ${entryCount}`
          ]
        },

        { text: 'Checklist Observations', fontSize: 14, bold: true, margin: [0, 15, 0, 5] },
        {
          ul: items.length > 0 ? items : ['No checklist items found']
        },

        { text: '---', margin: [0, 15, 0, 15] },

        { text: 'Full Bundle (JSON)', fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
        {
          text: JSON.stringify(bundle, null, 2),
          fontSize: 8
        }
      ],
      defaultStyle: {
        fontSize: 10
      }
    };

    if (!window.pdfMake || typeof window.pdfMake.createPdf !== 'function') {
      throw new Error('❌ pdfMake not available');
    }

    window.pdfMake.createPdf(docDefinition).open();
    console.log('✅ PDF opened');
  } catch (err) {
    console.error('❌ Error inside exportPDF():', err);
    alert('PDF export failed internally. Check console for details.');
  }
};
