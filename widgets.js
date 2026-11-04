let scenarioCatalog = [];
let demoMessage = '';
function showSection(section) {
  const titles={inventory:'Inventory experience',widgets:'Widgets',scenarios:'Test scenarios'};
  for(const name of Object.keys(titles))document.querySelector('#'+name+'-section').hidden=name!==section;
  document.querySelector('#widgets-nav').classList.toggle('selected',section==='widgets');
  document.querySelector('#widgets-nav').setAttribute('aria-current',section==='widgets'?'page':'false');
  document.querySelector('#dealer-toggle').classList.toggle('selected',section!=='widgets');
  document.querySelector('#inventory-nav').classList.toggle('active',section==='inventory');
  document.querySelector('#scenarios-nav').classList.toggle('active',section==='scenarios');
  document.querySelector('.page-heading h1').firstChild.nodeValue=titles[section]+' ';
  document.querySelector('.page-heading p').textContent=section==='widgets'?'Global JavaScript / jQuery and comparison laboratory.':section==='scenarios'?'An ordered test plan with steps, expected outcomes and runnable examples.':'One workspace. Every inventory variation.';
  document.querySelector('.breadcrumbs').textContent='Dealer settings / '+titles[section];
  history.replaceState(null,'','#'+section);document.querySelector('main').scrollIntoView({behavior:'auto'});
}
function persistConfiguration(candidate) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(candidate));
  state = candidate;
}
function showDemoNote(message) {
  demoMessage = message;
  const note = document.querySelector('#demo-run-note'); note.textContent = message; note.hidden = !message;
}
async function exampleText(path) {
  const response = await fetch('examples/' + path);
  if (!response.ok) throw new Error('Could not load ' + path);
  return response.text();
}
function protectExampleBackup() {
  if (!localStorage.getItem(DEMO_BACKUP_KEY)) localStorage.setItem(DEMO_BACKUP_KEY, JSON.stringify(state));
}
async function applyScenario(scenario, mode) {
  const targetNames = scenario.scoped.map(target => `${target.type} V${target.version}`).join(', ');
  if (!confirm(`This replaces the global widget and code for: ${targetNames}. A local copy of your configuration is kept before the first example. Load ${mode === 'scoped' ? 'the version-specific solution' : mode === 'hotfix' ? 'the global V4 hotfix' : 'the global example'}?`)) return;
  try {
    const candidate = validate(JSON.parse(JSON.stringify(state)));
    if (mode !== 'scoped') {
      const html = await exampleText(mode === 'hotfix' ? scenario.hotfix : scenario.global); parseWidgetHTML(html);
      const base = defaults();
      for (const target of scenario.scoped) candidate[target.type].versions[target.version] = base[target.type].versions[target.version];
      candidate.widgets = {enabled:true, html};
    } else {
      const changes = await Promise.all(scenario.scoped.map(async target => ({...target, code:{js:await exampleText(target.js),css:await exampleText(target.css)}})));
      for (const change of changes) candidate[change.type].versions[change.version] = change.code;
      // A versioned fix should not compete against the intentionally broken global example.
      candidate.widgets.enabled = false;
    }
    candidate.listing.selected = scenario.initial;
    if(scenario.detailsInitial)candidate.details.selected=scenario.detailsInitial;
    protectExampleBackup(); persistConfiguration(candidate); render(); renderWidgets();
    showDemoNote(`${scenario.title} · ${mode !== 'scoped' ? (mode === 'hotfix' ? 'GLOBAL V4 HOTFIX: ' : 'GLOBAL: ') + scenario.failure : 'VERSION-SPECIFIC: global widget disabled. Switch versions to load each solution. ' + scenario.solution}`);
    showSection('inventory'); toast(mode !== 'scoped' ? 'Global example loaded. Open the inventory page and reload to inspect the audits.' : 'Version-specific solutions saved.');
  } catch (error) { toast('Could not load the example: ' + error.message); }
}
async function applySharedExample(path) {
  if (!confirm('Only the global widget is replaced and enabled. Version-specific code is preserved. A local backup is retained before the first example. Continue?')) return;
  try {
    const html = await exampleText(path); parseWidgetHTML(html);
    const candidate = validate(JSON.parse(JSON.stringify(state))); candidate.widgets={enabled:true,html};
    protectExampleBackup(); persistConfiguration(candidate); render(); renderWidgets();
    showDemoNote('Shared widget enabled. Version-specific code is unchanged. You can disable it in Widgets.');
    toast('Shared widget saved. Reload the inventory pages.');
  } catch(error) { toast(error.message); }
}
function restoreBeforeExamples() {
  if (!confirm('Restore the configuration saved before the first example? This replaces edits made since that backup.')) return;
  try {
    const saved = localStorage.getItem(DEMO_BACKUP_KEY); if (!saved) throw new Error('No backup is available.');
    const candidate = validate(JSON.parse(saved)); persistConfiguration(candidate); localStorage.removeItem(DEMO_BACKUP_KEY);
    render(); renderWidgets(); showDemoNote(''); toast('Previous configuration restored.');
  } catch(error) { toast(error.message); }
}
function renderWidgets(keepDraft = false) {
  const previousDraft = keepDraft && document.querySelector('#widget-html') ? {html:document.querySelector('#widget-html').value, enabled:document.querySelector('#widget-enabled').checked} : null;
  const container = document.querySelector('#widgets-content');
  container.innerHTML = `<div class="widgets-intro"><strong>One global container versus version-specific containers</strong><p>The global widget runs before version-specific code on Listing 4, 5 and 6 and Details 6. Use it for shared utilities and to reproduce cross-version regressions.</p></div><div class="widgets-grid"><section class="global-widget-box"><h2>${faIcon('code')} Custom HTML · JavaScript / jQuery</h2><p>Inline &lt;script&gt; tags only. Inventory HTML stays fixed. JavaScript may change the DOM or inject styles, just like a real widget.</p><label class="widget-enable"><input type="checkbox" id="widget-enabled"> Enable on every inventory view and version</label><label class="screen-reader-label" for="widget-html">Global widget HTML code</label><textarea id="widget-html" spellcheck="false"></textarea><div class="widget-controls"><button class="button primary" id="save-widget">${faIcon('circle-check')} Save & apply widget</button><span id="widget-validation" role="status"></span></div><small>Local jQuery 3.7.1 · use <code>(function ($) { … })(jQuery)</code> · saved when you click Save</small></section><aside class="widget-explanation"><h2>Presentation workflow</h2><ol><li>Open Dealer Settings → Test Scenarios for the ordered test plan.</li><li>Run the global example in V4, then switch to V5 or V6.</li><li>Apply the version-specific solution and compare the result.</li><li>Finish with the complete global archive versus separate modules.</li></ol><p>Use <strong>Reload changes</strong> on standalone inventory pages. Configuration is stored in this browser and does not change other visitors’ settings.</p><p>Runtime errors identify the global widget or the relevant view/version. A failure does not stop the next container, but earlier DOM changes may remain.</p><a href="https://github.com/VictorRD01/Multi-footers-creation/blob/main/examples/SCENARIOS.md" target="_blank" rel="noopener">Open the English test and presentation guide ↗</a></aside></div><div class="examples-heading"><div><h2>Code examples and architecture comparison</h2><p>Load a controlled regression or its solution. A local backup is kept before the first example.</p></div><button class="button" id="restore-examples">Restore configuration before examples</button></div><div class="scenario-library" id="scenario-library"></div><div class="shared-examples"><div><h3>Global utilities still have a place</h3><p>A shared click counter can be appropriate. The final comparison shows a working global router and the maintenance cost of mixing current and archived implementations.</p></div><button class="button" id="shared-widget">Try shared counter</button><button class="button" id="compare-architecture">Compare global code / modules</button></div><div class="tradeoff-grid"><article><h3>Benefits of separation</h3><ul><li>Fewer cross-view and cross-version collisions.</li><li>Returning to a version restores its saved customization.</li><li>Smaller review and testing scope for local changes.</li><li>A clear editing context for users and developers.</li></ul></article><article><h3>Costs and limitations</h3><ul><li>Duplicated logic can diverge.</li><li>Shared fixes still need coordination.</li><li>A template update may invalidate selectors.</li><li>Separate containers still require tests and stable contracts.</li></ul></article><article><h3>Recommended approach</h3><p>Keep stable shared utilities in tested libraries. Store DOM adapters, presentation and view-specific behavior with their inventory version.</p><p>Separation preserves previous work; it does not automatically migrate a customization to a different template.</p></article></div>`;
  document.querySelector('#widget-html').value = previousDraft ? previousDraft.html : state.widgets.html;
  document.querySelector('#widget-enabled').checked = previousDraft ? previousDraft.enabled : state.widgets.enabled;
  const validation = document.querySelector('#widget-validation'); validation.textContent = state.widgets.enabled ? 'Global enabled' : 'Global disabled';
  document.querySelector('#save-widget').addEventListener('click', () => {
    const html = document.querySelector('#widget-html').value;
    try {
      const scripts = parseWidgetHTML(html);
      const candidate = validate(JSON.parse(JSON.stringify(state))); candidate.widgets = {enabled:document.querySelector('#widget-enabled').checked,html};
      persistConfiguration(candidate); render(); validation.textContent = `${scripts.length} script(s) saved · ${candidate.widgets.enabled ? 'enabled' : 'disabled'}`;
      validation.className = ''; toast('Widget saved. Reload the inventory pages to apply changes.');
    } catch(error) { validation.textContent = error.message; validation.className = 'widget-error'; }
  });
  let hasBackup = false; try { hasBackup=!!localStorage.getItem(DEMO_BACKUP_KEY); } catch {}
  document.querySelector('#restore-examples').disabled = !hasBackup;
  document.querySelector('#restore-examples').addEventListener('click',restoreBeforeExamples);
  document.querySelector('#shared-widget').addEventListener('click',()=>applySharedExample('shared-widget.html'));
  document.querySelector('#compare-architecture').addEventListener('click',()=>document.querySelector('#architecture-comparison')?.scrollIntoView({block:'start'}));
  const library = document.querySelector('#scenario-library');
  if (!scenarioCatalog.length) { library.textContent = 'Loading examples…'; return; }
  for (const scenario of scenarioCatalog) {
    const card = document.createElement('article'); card.className = 'scenario-card';
    card.innerHTML = `<h3></h3><p class="scenario-summary"></p><p class="scenario-failure"></p><p class="scenario-solution"></p><div class="scenario-actions"><button class="button" data-example-mode="global">Run global example</button><button class="button primary" data-example-mode="scoped">Apply version-specific solution</button></div><details class="example-source"><summary>View source and solutions</summary><label>File <select aria-label="Example source"></select></label><pre tabindex="0"></pre></details>`;
    card.querySelector('h3').textContent=scenario.title;
    card.querySelector('.scenario-summary').textContent=scenario.summary;
    card.querySelector('.scenario-failure').textContent='Expected regression: '+scenario.failure;
    card.querySelector('.scenario-solution').textContent='Solution: '+scenario.solution;
    if (scenario.hotfix) {
      card.classList.add('architecture-card');
      const hotfix=document.createElement('button'); hotfix.className='button'; hotfix.dataset.exampleMode='hotfix'; hotfix.textContent='Simulate global V4 hotfix';
      card.querySelector('.scenario-actions').insertBefore(hotfix,card.querySelector('[data-example-mode="scoped"]'));
      card.querySelector('[data-example-mode="global"]').textContent='Load complete global example';
    }
    card.querySelectorAll('[data-example-mode]').forEach(button=>button.addEventListener('click',()=>applyScenario(scenario,button.dataset.exampleMode)));
    const select=card.querySelector('select');
    const files=[scenario.global,...(scenario.hotfix?[scenario.hotfix]:[]),...(scenario.extraSources||[]),...scenario.scoped.flatMap(target=>[target.js,target.css])];
    for(const file of files){const option=document.createElement('option');option.value=file;option.textContent=file;select.append(option);}
    let request=0;
    async function loadSource(){const current=++request;try{const code=await exampleText(select.value);if(current===request)card.querySelector('pre').textContent=code;}catch(error){card.querySelector('pre').textContent=error.message;}}
    select.addEventListener('change',loadSource);card.querySelector('details').addEventListener('toggle',()=>{if(card.querySelector('details').open)loadSource();});
    if (scenario.hotfix) {
      const comparison=document.createElement('section');comparison.id='architecture-comparison';comparison.className='architecture-comparison';
      comparison.innerHTML=`<h3>The entire codebase versus the module you need to edit</h3><p>Both approaches can work. The left file combines four current contexts and twelve simulated historical revisions, with styles, filters, galleries, forms, pricing and events. The right file has one editing context. Compare the V4 campaign change, then review V5/V6 and Details.</p><div class="code-volume-stats" aria-live="polite"><div><strong class="global-line-count">…</strong><span>lines in the complete global file</span></div><div><strong>4 + 12</strong><span>current contexts + simulated historical modules</span></div><div><strong class="module-line-count">…</strong><span>lines in the selected separate file</span></div></div><div class="architecture-columns"><article><h4>One global widget: 16 blocks in the same field</h4><label>Complete file <select class="monolith-source" aria-label="Complete global source"></select></label><span class="source-metric"></span><pre tabindex="0"></pre></article><article><h4>One container per view and version</h4><label>Module <select class="module-source" aria-label="Separate module"></select></label><span class="source-metric"></span><pre tabindex="0"></pre></article></div><div class="module-navigation"><button class="button jump-to-equivalent">Locate equivalent module in the global source</button><span class="module-location" role="status"></span></div><details class="archive-map"><summary>Show current and historical module map</summary><p>Historical modules simulate retired revisions with different selectors. They remain defined in the file, but the current router never invokes them.</p><table><thead><tr><th>Module</th><th>Comparison status</th><th>Lines</th><th>Location</th></tr></thead><tbody></tbody></table></details><p class="architecture-limit">Separation does not guarantee fewer total lines or correct selectors. It narrows what you open, edit and recheck for a local customization. Common utilities can remain in shared libraries.</p>`;
      const globalSource=comparison.querySelector('.monolith-source');
      const moduleSource=comparison.querySelector('.module-source');
      let sourceManifest=null;
      const currentModuleId=()=>moduleSource.value.split('/').pop()?.replace(/\.(js|css)$/,'');
      function formatBytes(bytes){return (bytes/1024).toLocaleString('es-MX',{maximumFractionDigits:1})+' KiB';}
      async function jumpToModule(module){
        globalSource.value='04-monolito/global.js';
        await refreshGlobal();
        const pre=globalSource.closest('article').querySelector('pre');
        const lineHeight=parseFloat(getComputedStyle(pre).lineHeight)||18.7;
        pre.scrollTop=Math.max(0,(module.startLine-2)*lineHeight);pre.focus({preventScroll:true});
        comparison.querySelector('.module-location').textContent=module.label+' · lines '+module.startLine+'–'+module.endLine+' in the complete global source';
      }
      function updateModuleMap(){
        if(!sourceManifest)return;
        const selectedId=currentModuleId();
        const body=comparison.querySelector('.archive-map tbody');body.replaceChildren();
        for(const module of sourceManifest.modules){
          const row=document.createElement('tr');row.dataset.moduleId=module.id;
          row.classList.toggle('selected-module',module.id===selectedId);
          const values=[module.label,module.status==='archived'?'Simulated historical module · never invoked':module.id===selectedId?'Equivalent to selected file':'Another current view / version',module.startLine+'–'+module.endLine+' ('+module.lineCount+')'];
          for(const value of values){const td=document.createElement('td');td.textContent=value;row.append(td);}
          const td=document.createElement('td');const button=document.createElement('button');button.className='button';button.textContent='Show module';button.addEventListener('click',()=>jumpToModule(module));td.append(button);row.append(td);body.append(row);
        }
      }
      comparison.querySelector('.jump-to-equivalent').addEventListener('click',()=>{
        const module=sourceManifest?.modules.find(module=>module.id===currentModuleId());
        if(module)jumpToModule(module);
      });
      fetch('examples/'+scenario.manifest).then(response=>{if(!response.ok)throw new Error('HTTP '+response.status);return response.json();}).then(manifest=>{
        sourceManifest=manifest;comparison.querySelector('.global-line-count').textContent=manifest.lineCount;
        comparison.querySelector('.global-line-count').title=formatBytes(manifest.bytes);
        updateModuleMap();
      }).catch(error=>{comparison.querySelector('.module-location').textContent='Could not load module map: '+error.message;});
      const sides=[{select:globalSource,files:[...scenario.extraSources,scenario.global,scenario.hotfix],label:'Complete file, including inactive modules'},{select:moduleSource,files:scenario.scoped.flatMap(target=>[target.js,target.css]),label:'One view/version file'}];
      let refreshGlobal=async()=>{};
      for(const side of sides){
        for(const file of side.files){const option=document.createElement('option');option.value=file;option.textContent=file;side.select.append(option);}
        let token=0;
        const refresh=async()=>{const current=++token;try{
          const code=await exampleText(side.select.value);if(token!==current)return;
          const count=code.trimEnd().split('\n').length;
          side.select.closest('article').querySelector('pre').textContent=code;
          side.select.closest('article').querySelector('.source-metric').textContent=side.label+' · '+count+' lines · '+formatBytes(new TextEncoder().encode(code).length);
          if(side.select===moduleSource){comparison.querySelector('.module-line-count').textContent=count;updateModuleMap();}
        }catch(error){side.select.closest('article').querySelector('pre').textContent=error.message;}};
        if(side.select===globalSource)refreshGlobal=refresh;
        side.select.addEventListener('change',()=>{comparison.querySelector('.module-location').textContent='';refresh();});refresh();
      }
      card.append(comparison);
    }
    library.append(card);
  }
  if(typeof renderScenarios==='function')renderScenarios();
}
renderWidgets();
fetch('examples/catalog.json').then(response=>{if(!response.ok)throw new Error('HTTP '+response.status);return response.json();}).then(catalog=>{scenarioCatalog=catalog;renderWidgets(true);}).catch(error=>{document.querySelector('#scenario-library').textContent='Could not load examples: '+error.message;});
if(location.hash==='#widgets')showSection('widgets');
