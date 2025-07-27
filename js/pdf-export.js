// pdf-export.js

export function exportPDF(bundle) {
  try {
    console.log('📦 Bundle received in exportPDF:', bundle);

    // Minimal test to verify pdfMake is working
    const docDefinition = {
      content: [
        { text: 'Healthy Homes Report (EN PDF Test)', fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
        { text: 'FHIR Bundle Summary:', fontSize: 14, margin: [0, 10, 0, 5] },
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

    // 🔧 pdfMake must be global
    if (!window.pdfMake || typeof window.pdfMake.createPdf !== 'function') {
      throw new Error('❌ pdfMake not available');
    }

    window.pdfMake.createPdf(docDefinition).open();
    console.log('✅ PDF generation triggered');
  } catch (err) {
    console.error('❌ Error inside exportPDF():', err);
    alert('PDF export failed internally. Check console for details.');
  }
}
