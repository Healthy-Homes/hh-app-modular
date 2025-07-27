import { exportFHIRBundle } from './fhir-export.js';

export function exportPDF(bundle) {
  const pdfMake = window.pdfMake;
  if (!bundle?.entry) return;

  const now = new Date().toLocaleString();
  const patient = bundle.entry.find(e => e.resource?.resourceType === 'Patient');
  const consent = bundle.entry.find(e => e.resource?.resourceType === 'Consent');
  const observations = bundle.entry.filter(e => e.resource?.resourceType === 'Observation');

  const residentName = patient?.resource?.name?.[0]?.text || 'Unnamed Resident';
  const consentStatus = consent?.resource?.status === 'active' ? 'Yes' : 'No';

  const tableSection = (title, items) => ({
    style: 'section',
    table: {
      headerRows: 1,
      widths: ['*', '*'],
      body: [
        ['Item', 'Response'],
        ...items.map(obs => [
          obs.resource.code?.text || '',
          obs.resource.valueBoolean !== undefined
            ? (obs.resource.valueBoolean ? 'Yes' : 'No')
            : obs.resource.valueString || ''
        ])
      ]
    },
    layout: 'lightHorizontalLines'
  });

  const checklist = observations.filter(o => o.resource.code?.coding?.[0]?.system?.includes('checklist'));
  const sdoh = observations.filter(o => o.resource.code?.coding?.[0]?.system?.includes('loinc'));

  const docDefinition = {
    content: [
      { text: 'Healthy Homes Inspection Report', style: 'header' },
      { text: `Date: ${now}`, style: 'subheader' },
      { text: `Resident: ${residentName}`, style: 'subheader' },
      { text: `Consent Given: ${consentStatus}`, style: 'subheader' },
      '\n',
      tableSection('Checklist Observations', checklist),
      '\n',
      tableSection('Social Needs (SDOH)', sdoh)
    ],
    styles: {
      header: { fontSize: 18, bold: true },
      subheader: { fontSize: 12, margin: [0, 2] },
      section: { margin: [0, 8] }
    },
    defaultStyle: {
      fontSize: 10,
      font: 'Helvetica'
    }
  };

  pdfMake.createPdf(docDefinition).open();
}
