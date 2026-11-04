let state = defaults();
try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) state = validate(JSON.parse(saved)); } catch { toast('Saved data could not be loaded. Default examples are shown.'); }
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.style.display = 'block'; clearTimeout(toast.timer); toast.timer = setTimeout(() => el.style.display = 'none', 4500); }
function save(panel) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); panel.querySelector('.save-status').textContent = '✓ All changes saved'; }
  catch { panel.querySelector('.save-status').textContent = 'Unsaved · export to keep your work'; toast('Browser storage unavailable or full. Export your configuration to keep your changes.'); }
}
function render() {
  document.querySelector('#workspace').replaceChildren();
  definitions.forEach((d, index) => {
    const panel = document.createElement('section'); panel.className = 'panel';
    panel.innerHTML = `<div class="panel-top"><span class="panel-icon">${d.icon}</span><div><h3>${d.title}</h3><p>${d.subtitle}</p></div><span class="panel-number">0${index+1}</span></div><div class="version-field"><label for="version-${d.id}">${d.title}</label><div class="select-wrapper"><select id="version-${d.id}">${d.versions.map(v => `<option value="${v}">Version ${v}</option>`).join('')}</select></div><p>Select a version to edit its independent code and styles.</p><p class="widget-indicator">Global widget: ${state.widgets.enabled ? 'enabled — affects every view' : 'disabled'}</p></div><div class="editor-widget"><div class="widget-heading"><span>${faIcon('code')}</span> Custom CSS & JavaScript </div><div class="tabs" role="tablist" aria-label="${d.title} code language"><button class="tab active" data-lang="js" role="tab">JavaScript</button><button class="tab" data-lang="css" role="tab">CSS</button><span class="language-label">.js</span></div><div class="code-container"><div class="line-numbers" aria-hidden="true"></div><textarea class="code-editor" spellcheck="false" aria-label="${d.title} JavaScript code"></textarea></div><div class="editor-status"><span class="version-status"></span><span>UTF-8 &nbsp; · &nbsp; Editable</span></div></div><div class="panel-actions"><span class="save-status">✓ All changes saved</span><button class="button save-code" type="button">${faIcon('circle-check')} Save changes</button><a class="open-inventory button primary" href="inventory-${d.id}.html" target="_blank" rel="noopener">${faIcon('expand')} View ${d.title}</a></div>`;
    document.querySelector('#workspace').append(panel);
    let language = 'js'; const editor = panel.querySelector('textarea'); const select = panel.querySelector('select');
    const current = () => state[d.id].versions[state[d.id].selected];
    function lines() { panel.querySelector('.line-numbers').textContent = Array.from({length: editor.value.split('\n').length}, (_,i) => i+1).join('\n'); panel.querySelector('.line-numbers').scrollTop = editor.scrollTop; }
    function loadEditor() { panel.querySelector('.open-inventory').href = `inventory-${d.id}.html?version=${state[d.id].selected}`; editor.value = current()[language]; editor.setAttribute('aria-label', `${d.title} ${language === 'js' ? 'JavaScript' : language.toUpperCase()} code`); panel.querySelector('.version-status').textContent = `Version ${state[d.id].selected} · ${d.title}`; lines(); }
    select.value = state[d.id].selected;
    select.addEventListener('change', () => { state[d.id].selected = Number(select.value); save(panel); loadEditor(); });
    panel.querySelectorAll('.tab').forEach(tab => {
      tab.setAttribute('aria-selected', String(tab.dataset.lang === language));
      tab.addEventListener('click', () => { language = tab.dataset.lang; panel.querySelectorAll('.tab').forEach(t => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); }); panel.querySelector('.language-label').textContent = '.'+language; loadEditor(); });
    });
    editor.addEventListener('input', () => { current()[language] = editor.value; save(panel); lines(); });
    editor.addEventListener('scroll', lines);
    editor.addEventListener('keydown', event => { if (event.key === 'Tab') { event.preventDefault(); const start = editor.selectionStart; editor.setRangeText('  ', start, editor.selectionEnd, 'end'); editor.dispatchEvent(new Event('input')); } });
    panel.querySelector('.save-code').addEventListener('click', () => { save(panel); });
    loadEditor();
  });
}
render();
document.querySelector('#export-button').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([JSON.stringify(state,null,2)], {type:'application/json'})); const a = document.createElement('a'); a.href = url; a.download = 'inventory-studio.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url),1000); toast('Configuration exported'); });
document.querySelector('#import-button').addEventListener('click', () => document.querySelector('#import-file').click());
document.querySelector('#import-file').addEventListener('change', async event => { const file = event.target.files[0]; if (!file) return; try { const incoming = validate(JSON.parse(await file.text())); if (!confirm('Replace all current versions with this configuration? Export first if you want to keep your current work.')) return; state = incoming; render(); if (typeof renderWidgets === 'function') renderWidgets(); save(document.querySelector('.panel')); toast('Configuration imported'); } catch { toast('Invalid configuration. Import an Inventory Studio JSON export.'); } finally { event.target.value = ''; } });
document.querySelector('#dealer-toggle').addEventListener('click', () => { const toggle = document.querySelector('#dealer-toggle'); const open = toggle.getAttribute('aria-expanded') !== 'true'; toggle.setAttribute('aria-expanded',String(open)); document.querySelector('#dealer-menu').style.display = open ? 'block' : 'none'; });
document.querySelector('#inventory-nav').addEventListener('click', () => showSection('inventory'));
document.querySelector('#widgets-nav').addEventListener('click', () => showSection('widgets'));
