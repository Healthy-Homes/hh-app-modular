export async function loadChecklist() {
  try {
    const response = await fetch('data/checklist.csv');
    if (!response.ok) throw new Error('Checklist CSV not found');
    const text = await response.text();
  const response = await fetch('data/checklist.csv');
  const text = await response.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('checklist');

  lines.forEach((line, idx) => {
    if (idx === 0) return; // Skip header
    const [item, description] = line.split(',');

    const div = document.createElement('div');
    div.className = 'p-2 border rounded bg-white shadow';
    div.innerHTML = `<strong>${item}</strong>: ${description}`;
    container.appendChild(div);
  });
}
