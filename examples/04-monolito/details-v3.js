// Details V3: read the price from this product detail contract.
(function () {
  const page = document.querySelector('.inventory-page');
  const cents = Number(page.dataset.unitPriceCents);
  const price = page.querySelector('.detail-price');
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    price.textContent = 'Price unavailable';
    page.querySelector('.vehicle-action').disabled = true;
    return;
  }
  price.textContent = InventoryLab.usd(cents);
  InventoryLab.auditPrices('Fixed: Details V3');
})();

// Message specific to details V3. Other containers are unchanged.
jQuery(".inventory-page > .vehicle-action").text("Request specifications · D3");

// Details V3: resolve the unit from the activated button.
(function () {
  if (window.demoQuoteHandler) document.removeEventListener('click', window.demoQuoteHandler, true);
  window.demoQuoteHandler = function (event) {
    const button = event.target.closest('.vehicle-action');
    if (!button || !button.closest('.inventory-page')) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const unit = button.closest('.inventory-page');
    const cents = Number(unit?.dataset.unitPriceCents);
    if (!unit?.dataset.stock || !Number.isSafeInteger(cents) || cents <= 0) {
      InventoryLab.quoteUnavailable(unit, 'A verifiable SKU or price is missing.');
      return;
    }
    InventoryLab.showQuote(unit, {
      sku: unit.dataset.stock,
      name: unit.querySelector('.reference-description h2, .vehicle-body h2, .detail-heading h1, :scope > h1').textContent.trim(),
      cents
    }, 'Correct quote · Details V3');
  };
  document.addEventListener('click', window.demoQuoteHandler, true);
})();
