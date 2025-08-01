import { getLang } from './i18n.js';

export function exportPDF(bundle) {
  console.log('📄 Starting PDF export...');

  const docDefinition = {
    content: [
      { text: 'Healthy Homes Report', style: 'header' },
      { text: new Date().toLocaleString(), style: 'subheader' },
      { text: '\nResident Details:', style: 'section' }
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 12, italics: true, margin: [0, 0, 0, 10] },
      section: { fontSize: 14, bold: true, margin: [0, 10, 0, 4] },
      item: { margin: [0, 0, 0, 4] }
    }
  };

  // Add patient info
  const patient = bundle.entry.find(e => e.resource.resourceType === 'Patient');
  if (patient) {
    docDefinition.content.push({
      text: `Name: ${patient.resource.name?.[0]?.text || 'N/A'}`,
      style: 'item'
    });
  }

  // Add checklist items
  docDefinition.content.push({ text: '\nChecklist Observations:', style: 'section' });
  bundle.entry
    .filter(e => e.resource.resourceType === 'Observation' && e.resource.code.coding[0].code.startsWith('chk-'))
    .forEach(obs => {
      docDefinition.content.push({
        text: `• ${obs.resource.code.text}: ${obs.resource.valueBoolean ? 'Yes' : 'No'}`,
        style: 'item'
      });
    });

  // Add SDOH items
  docDefinition.content.push({ text: '\nSDOH Responses:', style: 'section' });
  bundle.entry
    .filter(e => e.resource.resourceType === 'Observation' && e.resource.code.coding[0].code.startsWith('sdoh-'))
    .forEach(obs => {
      docDefinition.content.push({
        text: `• ${obs.resource.code.text}: ${obs.resource.valueString}`,
        style: 'item'
      });
    });

  // Append QR of JSON payload
  const jsonStr = JSON.stringify(bundle, null, 2);
  const truncated = jsonStr.length > 3000 ? jsonStr.substring(0, 3000) + '\n...[truncated]' : jsonStr;

  docDefinition.content.push({ text: '\nFHIR Bundle (Preview):', style: 'section' });
  docDefinition.content.push({
    text: truncated,
    style: 'item',
    fontSize: 8
  });

  // ✅ Create PDF
  if (window.pdfMake) {
    pdfMake.createPdf(docDefinition).open();
    console.log('✅ PDF generated and opened');
  } else {
    console.error('❌ pdfMake is not loaded');
    alert('Unable to export PDF: pdfMake not loaded.');
  }
}
