const STORAGE_KEY = 'dealer-inventory-studio-v1';
const DEMO_BACKUP_KEY = STORAGE_KEY + '-before-examples';
function defaultWidgets() { return { enabled: false, html: `<script>
// JavaScript / jQuery shared by every version.
// jQuery is available; use (function ($) { ... })(jQuery).
</script>` }; }

const definitions = [{ id: 'listing', title: 'Inventory Listing', subtitle: 'Customize your vehicle listing experience', versions: [1,2,3,4,5,6], icon: faIcon('table-cells') }, { id: 'details', title: 'Inventory Details', subtitle: 'Customize your vehicle details experience', versions: [1,3,6], icon: faIcon('list') }];
// Inventory markup belongs to the application; version editors only own CSS and JS.
const inventoryStyles = `
*{box-sizing:border-box}body{margin:0;background:#fff;color:#202b33;font:13px/1.5 Arial,sans-serif}.inventory-page{padding:24px}.inventory-header{border-bottom:1px solid #dcdcde;padding-bottom:18px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}.dealer-brand{font-size:15px;font-weight:bold;letter-spacing:2px}.inventory-header span{font-size:10px;color:#667580}h1{font-size:24px;margin:0 0 6px}p{color:#687782}.inventory-toolbar{display:flex;gap:10px;margin:20px 0}.inventory-toolbar input,.inventory-toolbar select{padding:10px;border:1px solid #b7bec3;min-width:0;background:#fff;border-radius:2px}.inventory-toolbar input{flex:1}.vehicle-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.vehicle-card{border:1px solid #dcdcde;background:#fff}.vehicle-image{display:block;width:100%;height:140px;background:#edf1f3}.vehicle-body{padding:14px}.vehicle-condition{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#607580}.vehicle-card h2{font-size:15px;line-height:1.4;margin:6px 0}.vehicle-specs{font-size:10px;color:#687782;border-bottom:1px solid #e5e5e5;padding-bottom:12px}.vehicle-price{font-size:20px;font-weight:bold;margin:12px 0}.inventory-page button{background:#007f86;color:#fff;border:1px solid #007f86;border-radius:2px;padding:9px 12px;cursor:pointer;font-size:11px}.inventory-page button:hover{background:#005e64;border-color:#005e64}.vehicle-footer{display:flex;gap:8px;align-items:center;justify-content:space-between}.vehicle-footer small{color:#687782;font-size:9px}.vehicle-detail-image{width:100%;display:block;background:#edf1f3}.detail-facts{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:16px 0;border-block:1px solid #dcdcde;margin:15px 0}.detail-facts span{font-size:11px}.detail-price{font-size:27px;font-weight:bold}.inventory-empty{color:#687782}button,input,select{font:inherit}button:focus-visible,input:focus-visible,select:focus-visible{outline:2px solid #007f86;outline-offset:2px}@media(max-width:420px){.vehicle-grid{grid-template-columns:1fr}.inventory-toolbar{flex-wrap:wrap}.inventory-page{padding:16px}.inventory-header span{display:none}}
`;
const vehicles = [
  {name:'2024 Toyota RAV4 XLE',price:32995,miles:'12,450',fuel:'Gasoline',drive:'AWD',color:'#596f7c'},
  {name:'2023 BMW X5 xDrive40i',price:48750,miles:'24,810',fuel:'Gasoline',drive:'AWD',color:'#313c48'},
  {name:'2024 Honda Civic Sport',price:26900,miles:'8,320',fuel:'Gasoline',drive:'FWD',color:'#a6b0b7'},
  {name:'2023 Ford F-150 XLT',price:41995,miles:'19,650',fuel:'Gasoline',drive:'4WD',color:'#697f79'}
];
function carIllustration(color, className) {
  return `<svg class="${className}" viewBox="0 0 400 210" role="img" aria-label="Vehicle illustration"><rect width="400" height="210" fill="#edf1f3"/><ellipse cx="200" cy="166" rx="155" ry="12" fill="#d4dce0"/><path d="M55 128 L91 116 L133 68 Q140 61 158 61 L251 61 Q268 63 285 84 L313 115 L345 127 L353 153 L45 153 Z" fill="${color}"/><path d="M108 115 L143 74 L193 74 L193 115 Z M204 74 L250 74 L283 115 L204 115 Z" fill="#bdd5df"/><path d="M48 133 L81 133 L81 143 L47 143 M318 131 L348 135 L350 144 L318 144" fill="#fff5cb"/><path d="M199 119 L199 146 M110 121 L99 145 M286 121 L295 145" stroke="#ffffff44"/><circle cx="111" cy="151" r="25" fill="#26343e"/><circle cx="111" cy="151" r="13" fill="#bec9cf"/><circle cx="293" cy="151" r="25" fill="#26343e"/><circle cx="293" cy="151" r="13" fill="#bec9cf"/></svg>`;
}
function inventoryMarkup(type, version) {
  if (type === 'details' && version === 6) return detailsV6Markup();
  if (type === 'listing' && listingReferences[version]) return referenceListingMarkup(version);
  const header = '<header class="inventory-header"><strong class="dealer-brand">DEALER MOTORS</strong><span>Find your next vehicle</span></header>';
  if(type === 'details') return `<main class="inventory-page" data-unit-price-cents="3299500" data-stock="DM1042">${header}<p>Inventory / Toyota RAV4</p><h1>${vehicles[0].name}</h1><p>Pre-owned · Stock #DM1042</p>${carIllustration(vehicles[0].color,'vehicle-detail-image')}<h2>Ready for your next adventure.</h2><div class="detail-price">$32,995</div><div class="detail-facts"><span>Mileage: 12,450 mi</span><span>Drivetrain: AWD</span><span>Transmission: Automatic</span><span>Fuel: Gasoline</span></div><button class="vehicle-action">Check availability</button></main>`;
  return `<main class="inventory-page">${header}<h1>Pre-owned inventory</h1><p>Find the right vehicle for your next chapter.</p><div class="inventory-toolbar"><input id="vehicle-search" aria-label="Search inventory" placeholder="Search make or model…"><select id="vehicle-sort" aria-label="Sort inventory"><option value="default">Sort: Featured</option><option value="asc">Price: Low to high</option><option value="desc">Price: High to low</option></select></div><p id="vehicle-count">4 vehicles available</p><div class="vehicle-grid">${vehicles.map(v=>`<article class="vehicle-card" data-name="${v.name.toLowerCase()}" data-price="${v.price}">${carIllustration(v.color,'vehicle-image')}<div class="vehicle-body"><span class="vehicle-condition">Pre-owned · In stock</span><h2>${v.name}</h2><div class="vehicle-specs">${v.miles} mi · Automatic · ${v.drive}</div><div class="vehicle-price">$${v.price.toLocaleString('en-US')}</div><div class="vehicle-footer"><button class="vehicle-action">Check availability</button><small>${v.fuel}</small></div></div></article>`).join('')}</div><p class="inventory-empty" hidden>No vehicles match your search.</p></main>`;
}
function initializeInventory() {
  const search=document.querySelector('#vehicle-search'), sort=document.querySelector('#vehicle-sort');
  const cards=[...document.querySelectorAll('.vehicle-card')];
  const filters=[...document.querySelectorAll('[data-filter]')];
  function filter(){
    const groups={}; filters.filter(input=>input.checked).forEach(input=>(groups[input.dataset.filter]??=[]).push(input.value));
    const attributes={'Make':'make','Year':'year','Category':'category','Vehicle Type':'category','Condition':'condition','Location':'location'};
    let count=0;
    cards.forEach(card=>{
      const matches=Object.entries(groups).every(([group,values])=>values.some(value=>{
        if(group==='Featured')return card.dataset.featured==='true';
        if(group==='Price')return value==='Under $20,000'?Number(card.dataset.price)<20000:Number(card.dataset.price)>=20000;
        return card.dataset[attributes[group]]===value;
      }));
      card.hidden=!card.dataset.name.includes(search.value.toLowerCase())||!matches;if(!card.hidden)count++;
    });
    document.querySelector('#vehicle-count').textContent=document.querySelector('.reference-inventory')?`Showing ${count?1:0}-${count} of ${cards.length} results`:`${count} vehicles available`;
    document.querySelector('.inventory-empty').hidden=count>0;
  }
  search?.addEventListener('input',filter);filters.forEach(input=>input.addEventListener('change',filter));
  document.querySelector('.reset-filters')?.addEventListener('click',()=>{filters.forEach(input=>input.checked=false);search.value='';filter();});
  sort?.addEventListener('change',()=>{const ordered=sort.value==='default'?cards:[...cards].sort((a,b)=>sort.value==='asc'?a.dataset.price-b.dataset.price:b.dataset.price-a.dataset.price);ordered.forEach(card=>document.querySelector('.vehicle-grid').append(card));});
  document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{const grid=document.querySelector('.vehicle-grid');grid.classList.toggle('list-view',button.dataset.view==='list');grid.classList.toggle('grid-view',button.dataset.view==='grid');document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));}));
  document.querySelectorAll('.compare-models input').forEach(input=>input.addEventListener('change',()=>{document.querySelector('.compare-count').textContent=document.querySelectorAll('.compare-models input:checked').length+' models selected';}));
  const dialog=document.querySelector('.inventory-dialog');
  document.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>{
    const name=button.closest('.vehicle-card').querySelector('h2').textContent;
    dialog.querySelector('.dialog-title').textContent=button.dataset.action;
    dialog.querySelector('.dialog-description').textContent=name+' — Demonstration only. No request, call, reservation or payment has been sent.';
    if(button.dataset.action==='View Details')dialog.querySelector('.dialog-description').textContent=name+' · New · Stock # '+button.closest('.vehicle-card').querySelector('.stock-label, .product-meta, .grid-total small')?.textContent+' · Sample inventory details.';
    if(button.dataset.action==='Print')dialog.querySelector('.dialog-description').textContent=name+' — Print action demonstration. No document has been printed.';dialog.showModal();
  }));
  dialog?.querySelector('.dialog-dismiss').addEventListener('click',()=>dialog.close());
  dialog?.querySelector('.dialog-close').addEventListener('click',event=>{event.preventDefault();dialog.close();});
}
function defaults() {
  const configuration = Object.fromEntries(definitions.map(d => [d.id, { selected: 6, versions: Object.fromEntries(d.versions.map(v => [v, {
    js: d.id === 'listing' && listingReferences[v] ? `// Inventory Listing — Version ${v}\n// Runs after the fixed inventory is ready.\n// Built-in search, filters and actions are provided by the page.\n\ndocument.querySelector('.inventory-page').dataset.customVersion = '${v}';\n\n// Example: document.querySelectorAll('.vehicle-price')\n//   .forEach(price => price.style.fontWeight = '800');` : `// ${d.title} — Version ${v}\n// Applied to the fixed inventory page.\n\ndocument.querySelectorAll('.vehicle-action').forEach(button => {\n  button.addEventListener('click', () => {\n    button.textContent = 'Request received ✓';\n  });\n});`,
    css: d.id === 'listing' && listingReferences[v] ? `/* Inventory Listing — Version ${v} */\n/* Fixed layout based on the supplied reference. */\n\n.inventory-page { --inventory-accent: ${listingReferences[v].accent}; }\n/* Customize .reference-card, .vehicle-price or .reference-actions here. */` : `/* ${d.title} — Version ${v} */\n/* Style the existing inventory. HTML is managed by the site. */\n\n.inventory-page { --accent: #007f86; }\n.vehicle-price, .detail-price { color: var(--accent); }\n.vehicle-action { background: var(--accent); border-color: var(--accent); }`
  }])) } ]));
  configuration.widgets = defaultWidgets();
  configuration.uiRevision = 2;
  configuration.details.versions[6] = {js: `// Inventory Details — Version 6\n// The fixed product page provides its gallery, form and demo actions.\ndocument.querySelector('.details-v6').dataset.customVersion = '6';`, css: `/* Inventory Details — Version 6 */\n.details-v6 { --detail-accent: #4fd024; }\n/* Customize .detail-pricing, .detail-actions and .detail-contact here. */`};
  return configuration;
}
function validate(data) {
  for (const d of definitions) {
    const item = data?.[d.id];
    if (!item || !d.versions.includes(item.selected)) throw new Error('Invalid selected version');
    for (const v of d.versions) for (const field of ['js','css']) if (typeof item.versions?.[v]?.[field] !== 'string') throw new Error('Invalid version code');
  }
  for (const v of [4,5,6]) {
    if (data.listing.versions[v].css === `/* Inventory Listing — Version ${v} */\n/* Style the existing inventory. HTML is managed by the site. */\n\n.inventory-page { --accent: #007f86; }\n.vehicle-price, .detail-price { color: var(--accent); }\n.vehicle-action { background: var(--accent); border-color: var(--accent); }`) data.listing.versions[v].css=defaults().listing.versions[v].css;
    if (data.listing.versions[v].js === `// Inventory Listing — Version ${v}\n// Applied to the fixed inventory page.\n\ndocument.querySelectorAll('.vehicle-action').forEach(button => {\n  button.addEventListener('click', () => {\n    button.textContent = 'Request received ✓';\n  });\n});`) data.listing.versions[v].js=defaults().listing.versions[v].js;
  }
  const widgets = data.widgets === undefined ? defaultWidgets() : data.widgets;
  if (!widgets || typeof widgets.enabled !== 'boolean' || typeof widgets.html !== 'string') throw new Error('Invalid global widget');
  const configuration = Object.fromEntries(definitions.map(d => [d.id, {selected: data[d.id].selected, versions: Object.fromEntries(d.versions.map(v => [v, {js:data[d.id].versions[v].js, css:data[d.id].versions[v].css}]))}]));
  configuration.widgets = {enabled: widgets.enabled, html: widgets.html};
  configuration.uiRevision = 2;
  if (data.uiRevision !== 2) {
    configuration.listing.selected = 6;
    configuration.details.selected = 6;
    // Replace only the exact previous built-in sample, preserving custom code.
    if (configuration.details.versions[6].js.includes("// Inventory Details — Version 6") && configuration.details.versions[6].js === `// Inventory Details — Version 6\n// Applied to the fixed inventory page.\n\ndocument.querySelectorAll('.vehicle-action').forEach(button => {\n  button.addEventListener('click', () => {\n    button.textContent = 'Request received ✓';\n  });\n});`) configuration.details.versions[6].js=defaults().details.versions[6].js;
  }
  return configuration;
}

// An HTML widget accepts only inline classic JavaScript script tags, no inventory markup.
function parseWidgetHTML(html) {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  const scripts = [];
  function inspect(node) {
    if (node.nodeType === Node.COMMENT_NODE) return;
    if (node.nodeType === Node.TEXT_NODE) { if (node.textContent.trim()) throw new Error('Wrap JavaScript in <script> tags.'); return; }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    if (node.tagName !== 'SCRIPT') throw new Error('Only inline JavaScript <script> tags are allowed; direct HTML and CSS are not supported.');
    const type = (node.getAttribute('type') || '').toLowerCase();
    if (node.hasAttribute('src') || (type && !['text/javascript', 'application/javascript'].includes(type))) throw new Error('Use classic inline scripts. jQuery is already available; src and module scripts are not supported.');
    scripts.push(node.textContent);
  }
  [...parsed.head.childNodes, ...parsed.body.childNodes].forEach(inspect);
  return scripts;
}
// Runs inside the isolated frame. Each stage reports errors without stopping another container.
function executeInventoryScripts(type, version, scripts, widgetError, versionCode) {
  function report(stage, error) {
    const notice = document.createElement('div');
    notice.className = 'runtime-error'; notice.dataset.stage = stage; notice.setAttribute('role', 'alert');
    notice.style.cssText = 'border-left:4px solid #b32d2e;background:#fff0f0;color:#8a2020;padding:14px;font:12px/1.6 monospace;white-space:pre-wrap;';
    notice.textContent = stage + ': ' + (error.message || error);
    document.body.prepend(notice);
  }
  const root = document.querySelector('.inventory-page'); root.dataset.inventoryType = type; root.dataset.version = version;
  if (window.jQuery) window.jQuery.noConflict();
  else report('jQuery', 'The local library could not be loaded.');
  if (widgetError) report('Global widget', widgetError);
  scripts.forEach((code, index) => { try { (0,eval)(code); } catch (error) { report('Global widget · script ' + (index + 1), error); } });
  try { (0,eval)(versionCode); } catch (error) { report(type + ' · Version ' + version, error); }
  root.dataset.scriptsInitialized = 'true';
}
// Identical rendering and execution for embedded and standalone inventory pages.
function buildInventoryDocument(type, version, code, widgets = defaultWidgets()) {
  let scripts = [], widgetError = '';
  if (widgets.enabled) { try { scripts = parseWidgetHTML(widgets.html); } catch(error) { widgetError = error.message; } }
  const json = value => JSON.stringify(value).replaceAll('<', String.fromCharCode(92) + 'u003c');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${inventoryStyles}</style><link rel="stylesheet" href="inventory-layouts.css"><link rel="stylesheet" href="examples/lab-support.css"><link rel="stylesheet" href="details-v6.css"><style>${code.css}</style></head><body>${inventoryMarkup(type, version)}<script src="vendor/jquery-3.7.1.min.js"><\/script><script src="examples/lab-support.js"><\/script><script>(${initializeInventory.toString()})();(${initializeDetailsV6.toString()})();(${executeInventoryScripts.toString()})(${json(type)},${json(version)},${json(scripts)},${json(widgetError)},${json(code.js)});<\/script></body></html>`;
}
