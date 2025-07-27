// pdf-export.js

// ✅ Make pdfMake accessible in module scope
const pdfMake = window.pdfMake;

export function exportPDF(bundle) {
  try {
    console.log('📦 Bundle received in exportPDF:', bundle);

    const docDefinition = {
      content: [
        {
          text: 'Healthy Homes Report (EN PDF Test)',
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        {
          text: 'FHIR Bundle Summary:',
          fontSize: 14,
          margin: [0, 10, 0, 5]
        },
        {
          ul: [
            `Resource Type: ${bundle.resourceType || 'Unknown'}`,
            `Entry Count: ${Array.isArray(bundle.entry) ? bundle.entry.length : 'N/A'}`
          ]
        },
        {
          text: '---',
          margin: [0, 10, 0, 10]
        },
        {
          text: 'Full Bundle (JSON)',
          style: 'subheader',
          fontSize: 12,
          margin: [0, 10, 0, 5]
        },
        {
          text: JSON.stringify(bundle, null, 2),
          fontSize: 8,
          style: 'code'
        }
      ]
    };

    // ✅ Validate access to pdfMake
    if (!pdfMake || typeof pdfMake.createPdf !== 'function') {
      throw new Error('❌ pdfMake not available (scoped import check)');
    }

    // ✅ Trigger PDF download
    pdfMake.createPdf(docDefinition).open();
    console.log('✅ PDF generation triggered');
  } catch (err) {
    console.error('❌ Error inside exportPDF():', err);
    alert('PDF export failed internally. Check console for details.');
  }
}
