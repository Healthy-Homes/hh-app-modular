export function setupConsent() {
  const consentDiv = document.getElementById('consent-block');
  consentDiv.innerHTML = `
    <label>
      <input type="checkbox" class="mr-2">
      I consent to a home inspection to assess health and safety conditions, understand this is voluntary, and agree that photos may be taken for documentation purposes.
    </label>
  `;
}
