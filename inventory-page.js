// The wrapper reads the editor's same-origin storage; custom code stays in a sandbox.
const pageType = document.body.dataset.inventoryType;
const definition = definitions.find(item => item.id === pageType);
const parameters = new URLSearchParams(location.search);
const hasVersion = parameters.has('version');
const requestedVersion = Number(parameters.get('version'));
const versionSelect = document.querySelector('#page-version');
const status = document.querySelector('#page-status');
let pageState = defaults();
let storageWarning = '';
let hasSavedData = false;
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) { pageState = validate(JSON.parse(saved)); hasSavedData = true; }
} catch {
  storageWarning = 'Saved data unavailable. Showing default code.';
}
const invalidVersion = hasVersion && !definition.versions.includes(requestedVersion);
const selectedVersion = hasVersion && !invalidVersion ? requestedVersion : pageState[pageType].selected;
for (const version of definition.versions) {
  const option = document.createElement('option');
  option.value = version; option.textContent = `Version ${version}`; versionSelect.append(option);
}
versionSelect.value = selectedVersion;
document.title = `${definition.title} · Version ${selectedVersion}`;
status.textContent = storageWarning || (invalidVersion ? 'Invalid URL version. Showing the editor selection.' : !hasSavedData ? 'Default examples · no saved edits in this browser' : hasVersion ? 'Saved code · fixed version' : 'Saved code · follows editor version on reload');
document.querySelector('#inventory-frame').srcdoc = buildInventoryDocument(pageType, selectedVersion, pageState[pageType].versions[selectedVersion], pageState.widgets);
versionSelect.addEventListener('change', () => {
  const next = new URL(location.href); next.searchParams.set('version', versionSelect.value); location.assign(next.href);
});
document.querySelector('#follow-selection').hidden = !hasVersion;
document.querySelector('#follow-selection').addEventListener('click', () => {
  const next = new URL(location.href); next.searchParams.delete('version'); location.assign(next.href);
});
document.querySelector('#reload-page').addEventListener('click', () => location.reload());
window.addEventListener('storage', event => {
  if (event.storageArea === localStorage && (event.key === STORAGE_KEY || event.key === null)) {
    status.textContent = 'Editor changes available · reload to apply';
    document.querySelector('#reload-page').classList.add('changes-available');
  }
});

// Only accept the fixed internal route from this page's own isolated preview.
window.addEventListener('message', event => {
  if(event.source !== document.querySelector('#inventory-frame').contentWindow) return;
  if(event.data?.type === 'inventory-navigation' && event.data.view === 'listing' && event.data.version === 6) location.assign('inventory-listing.html?version=6');
});
