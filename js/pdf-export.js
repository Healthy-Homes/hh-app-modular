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

  // ✅ Resident Information
  docDefinition.content.push({
    text: `Name: ${bundle.subject?.display || 'N/A'}`,
    style: 'item'
  });
  docDefinition.content.push({
    text: `Consent: ${bundle.subject?.consented ? 'Yes' : 'No'}`,
    style: 'item'
  });

  // ✅ Checklist Observations
  const checklistObs = bundle.entry.filter(e => 
    e.resource.resourceType === 'Observation' && 
    e.resource.code?.coding?.[0]?.system === 'http://healthyhomes.local/checklist'
  );
  
  if (checklistObs.length > 0) {
    docDefinition.content.push({ text: '\nHome Inspection Checklist:', style: 'section' });
    checklistObs.forEach(obs => {
      const label = obs.resource.code.text || 'Unnamed';
      const value = obs.resource.valueBoolean === true ? 'Yes' : 'No';
      docDefinition.content.push({ text: `• ${label}: ${value}`, style: 'item' });
    });
  }

  // ✅ SDOH Responses
  const sdohObs = bundle.entry.filter(e => 
    e.resource.resourceType === 'Observation' && 
    e.resource.code?.coding?.[0]?.system === 'http://healthyhomes.local/sdoh'
  );
  
  if (sdohObs.length > 0) {
    docDefinition.content.push({ text: '\nSocial Determinants of Health:', style: 'section' });
    sdohObs.forEach(obs => {
      const label = obs.resource.code.text || 'Unnamed';
      const value = obs.resource.valueString || 'N/A';
      docDefinition.content.push({ text: `• ${label}: ${value}`, style: 'item' });
    });
  }

  // ✅ Risk Scores (if included)
  const riskObs = bundle.entry.filter(e => 
    e.resource.resourceType === 'Observation' && 
    e.resource.code?.coding?.[0]?.system === 'http://healthyhomes.local/risk'
  );
  
  if (riskObs.length > 0) {
    docDefinition.content.push({ text: '\nRisk Assessment Scores:', style: 'section' });
    riskObs.forEach(obs => {
      const label = obs.resource.code.text || 'Risk Score';
      const value = obs.resource.valueInteger || 0;
      const riskLevel = value <= 33 ? 'Low' : value <= 66 ? 'Moderate' : 'High';
      docDefinition.content.push({ 
        text: `• ${label}: ${value} (${riskLevel})`, 
        style: 'item' 
      });
    });
  }

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