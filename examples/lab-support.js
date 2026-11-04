// Presentation instrumentation, independent of the example under test.
// These are frozen browser-side DEMO snapshots, not authoritative server pricing.
(() => {
  const root = document.querySelector('.inventory-page');
  if (!root) return;
  const sourceNodes = [...root.querySelectorAll('.vehicle-card')];
  if (!sourceNodes.length) sourceNodes.push(root);
  const records = new Map(sourceNodes.map((node, index) => [node, Object.freeze({
    name: node.querySelector('.reference-description h2, .vehicle-body h2, h1')?.textContent.trim() || 'Demo unit',
    sku: node.dataset.stock || `DEMO-${index + 1}`,
    cents: Number(node.dataset.unitPriceCents || Number(node.dataset.price) * 100)
  })]));
  const usd = cents => (cents / 100).toLocaleString('en-US', {style:'currency',currency:'USD',maximumFractionDigits:2,minimumFractionDigits:0});
  function element(tag, text, className) {
    const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node;
  }
  function panel(id, title) {
    root.querySelector(`[data-lab-panel="${id}"]`)?.remove();
    const box = element('section', undefined, 'lab-audit'); box.dataset.labPanel = id; box.setAttribute('role', 'status');
    box.append(element('small','LABORATORY · SIMULATION ONLY, NO REAL TRANSACTIONS','lab-kicker'), element('h2',title));
    const anchor = root.querySelector('.result-summary');
    if (anchor) anchor.before(box); else root.prepend(box);
    return box;
  }
  function readDisplayed(node) {
    const label = node.querySelector('.vehicle-price, .detail-price');
    const match = label?.textContent.match(/-?\$[\d,]+(?:\.\d{1,2})?/);
    return match ? Math.round(Number(match[0].replace(/[^\d.-]/g,'')) * 100) : NaN;
  }
  function auditPrices(title) {
    const box = panel('prices',title); const table=element('table');
    const head=element('tr');['Unit','Reference','Displayed','Difference'].forEach(label=>head.append(element('th',label)));table.append(head);
    let expected=0, actual=0, failures=0;
    for (const [node, record] of records) {
      const shown=readDisplayed(node), mismatch=!Number.isSafeInteger(shown)||shown!==record.cents;
      expected+=record.cents;actual+=Number.isFinite(shown)?shown:0; if(mismatch)failures++;
      const row=element('tr');row.dataset.sku=record.sku;row.dataset.expectedCents=record.cents;row.dataset.actualCents=shown;row.dataset.mismatch=mismatch;
      [record.name,usd(record.cents),Number.isFinite(shown)?usd(shown):'Unavailable',Number.isFinite(shown)?usd(shown-record.cents):'No calculable'].forEach(text=>row.append(element('td',text)));table.append(row);
    }
    box.dataset.failures=failures;box.dataset.expectedCents=expected;box.dataset.actualCents=actual;
    const change=expected?((actual-expected)/expected*100):0;box.dataset.changePercent=change.toFixed(2);box.classList.add(failures?'lab-fail':'lab-pass');
    box.append(element('p',failures?`${failures} incorrect prices. Reference: ${usd(expected)} · displayed: ${usd(actual)} · difference: ${usd(actual-expected)} (${change.toFixed(2)}%).`:'All displayed amounts match the reference data in this simulation.'),table);
    box.append(element('p','The reference is a snapshot of initial demo data captured before the widget runs. Production prices must be validated on the server.','lab-footnote'));
    return box;
  }
  function auditLayout(title) {
    const box=panel('layout',title);
    const controls=[...root.querySelectorAll('.primary-action')];
    const disabled=controls.filter(button=>getComputedStyle(button).pointerEvents==='none'||button.disabled||getComputedStyle(button).display==='none');
    box.dataset.blocked=disabled.length;box.classList.add(disabled.length?'lab-fail':'lab-pass');
    box.append(element('p',disabled.length?`${disabled.length} of ${controls.length} commercial buttons do not receive pointer clicks. In this template, the third block contains actions rather than the price breakdown.`:`${controls.length} commercial buttons retain pointer interaction. Also check images, readability and keyboard access on the inventory page.`));
  }
  function showQuote(clickedNode, payload, title) {
    const expected=records.get(clickedNode);if(!expected)throw new Error('No reference is available for the selected unit.');
    const matches=payload.sku===expected.sku&&payload.cents===expected.cents;
    const box=panel('quote',title);box.dataset.matches=matches;box.dataset.requestedSku=expected.sku;box.dataset.quotedSku=payload.sku;box.classList.add(matches?'lab-pass':'lab-fail');
    const table=element('table');
    for(const [label,value] of [['Requested',`${expected.name} · ${expected.sku} · ${usd(expected.cents)}`],['Quoted',`${payload.name} · ${payload.sku} · ${usd(payload.cents)}`]]){
      const row=element('tr');row.append(element('th',label),element('td',value));table.append(row);
    }
    box.append(element('p',matches?'The demo quote matches the selected unit and final amount.':'REGRESSION: the demo quote contains a different unit or amount.'),table,element('p','No commercial quote was created or sent.','lab-footnote'));
    box.scrollIntoView({block:'nearest'});
  }
  function quoteUnavailable(clickedNode, reason) {
    const box=panel('quote','Quote blocked');box.classList.add('lab-fail');box.dataset.blocked='true';box.append(element('p',reason+' The price was not replaced with zero and no quote was generated.'));
  }
  window.InventoryLab=Object.freeze({reference: node=>records.get(node),auditPrices,auditLayout,showQuote,quoteUnavailable,usd});
})();
