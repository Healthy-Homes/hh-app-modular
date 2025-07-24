export function setupLanguage() {
  const toggle = document.getElementById('language-toggle');
  toggle.innerHTML = `
    <button onclick="alert('Language toggle coming soon')" class="bg-gray-200 px-3 py-1 rounded">
      Toggle Language
    </button>
  `;
}
