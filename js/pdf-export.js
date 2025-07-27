import { getTranslation, getCurrentLang } from './i18n.js';
import { exportFHIRBundle } from './fhir-export.js'; // ✅ Corrected import

export async function exportPDF() {
  const bundle = await exportFHIRBundle(); // ✅ Matches correct function

  if (!bundle || !bundle.entry) {
    console.error('FHIR Bundle is missing or malformed:', bundle);
    alert('Cannot generate PDF: No export data available.');
    return;
  }

  const now = new Date().toLocaleString();
  const patientEntry = bundle.entry.find(e => e.resource.resourceType === 'Patient');
  const consentEntry = bundle.entry.find(e => e.resource.resourceType === 'Consent');
  const observations = bundle.entry.filter(e => e.resource.resourceType === 'Observation');

  const residentName = patientEntry?.resource?.name?.[0]?.text || getTranslation('unnamed');
  const consentStatus = consentEntry?.resource?.status === 'active'
    ? getTranslation('consented')
    : getTranslation('not_consented');

  const checklistObs = observations.filter(o =>
    o.resource.code?.coding?.[0]?.system?.includes('checklist')
  );
  const sdohObs = observations.filter(o =>
    o.resource.code?.coding?.[0]?.system?.includes('loinc')
  );

  const tableSection = (titleKey, items) => ({
    style: 'section',
    table: {
      headerRows: 1,
      widths: ['*', '*'],
      body: [
        [getTranslation('item'), getTranslation('response')],
        ...items.map(obs => [
          obs.resource.code.text,
          obs.resource.valueBoolean !== undefined
            ? (obs.resource.valueBoolean ? getTranslation('yes') : getTranslation('no'))
            : obs.resource.valueString || ''
        ])
      ]
    },
    layout: 'lightHorizontalLines'
  });

  const docDefinition = {
    content: [
      { text: getTranslation('healthyHomesReport'), style: 'header' },
      { text: `${getTranslation('date')}: ${now}`, style: 'subheader' },
      { text: `${getTranslation('resident')}: ${residentName}`, style: 'subheader' },
      { text: `${getTranslation('consent')}: ${consentStatus}`, style: 'subheader' },
      '\n',
      tableSection('checklist', checklistObs),
      '\n',
      tableSection('sdoh', sdohObs)
    ],
    styles: {
      header: { fontSize: 18, bold: true },
      subheader: { fontSize: 12, margin: [0, 2] },
      section: { margin: [0, 8] }
    },
    defaultStyle: {
      font: getCurrentLang() === 'zh' ? 'NotoSansTC' : undefined,
      fontSize: 10
    }
  };

  // Optional future logic: embed base64 bundle or QR code here

  pdfMake.createPdf(docDefinition).open();
}
