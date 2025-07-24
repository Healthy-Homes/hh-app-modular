export async function loadSDOH() {
  const response = await fetch('data/sdoh.csv');
  const text = await response.text();

  const lines = text.trim().split('\n');
  const container = document.getElementById('sdoh-form');

  lines.forEach((line, idx) => {
    if (idx === 0) return;
    const [question] = line.split(',');

    const div = document.createElement('div');
    div.className = 'p-2 border-b';
    div.innerHTML = `
      <label>${question}</label><br/>
      <select class="border mt-1">
        <option>Always</option>
        <option>Sometimes</option>
        <option>Never</option>
      </select>
    `;
    container.appendChild(div);
  });
}
