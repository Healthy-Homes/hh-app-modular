import { getLang } from './i18n.js';

export function exportPDF(bundle) {
  console.log('📄 Starting PDF export...');

  const lang = getLang(); // ✅ Future-proofing for multilingual headers

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

  // ✅ Resident Name
  const patient = bundle.entry.find(e => e.resource.resourceType === 'Patient');
  docDefinition.content.push({
    text: `Name: ${patient?.resource?.name?.[0]?.text || 'N/A'}`,
    style: 'item'
  });

  // ✅ Checklist Observations
  docDefinition.content.push({ text: '\nChecklist Observations:', style: 'section' });
  bundle.entry
    .filter(e => e.resource.resourceType === 'Observation' && e.resource.code?.coding?.[0]?.code?.startsWith('chk-'))
    .forEach(obs => {
      const label = obs.resource.code.text || 'Unnamed';
      const value = obs.resource.valueBoolean === true ? 'Yes' : 'No';
      docDefinition.content.push({ text: `• ${label}: ${value}`, style: 'item' });
    });

  // ✅ SDOH Responses
  docDefinition.content.push({ text: '\nSDOH Responses:', style: 'section' });
  bundle.entry
    .filter(e => e.resource.resourceType === 'Observation' && e.resource.code?.coding?.[0]?.code?.startsWith('sdoh-'))
    .forEach(obs => {
      const label = obs.resource.code.text || 'Unnamed';
      const value = obs.resource.valueString || 'N/A';
      docDefinition.content.push({ text: `• ${label}: ${value}`, style: 'item' });
    });

  // ✅ JSON Preview
  const jsonStr = JSON.stringify(bundle, null, 2);
  const preview = jsonStr.length > 3000 ? jsonStr.substring(0, 3000) + '\n...[truncated]' : jsonStr;
  docDefinition.content.push({ text: '\nFHIR Bundle (Preview):', style: 'section' });
  docDefinition.content.push({ text: preview, style: 'item', fontSize: 8 });

  // ✅ Render
  if (window.pdfMake?.createPdf) {
    pdfMake.createPdf(docDefinition).open();
    console.log('✅ PDF generated and opened');
  } else {
    console.error('❌ pdfMake is not loaded');
    alert('Unable to export PDF: pdfMake not loaded.');
  }
}
