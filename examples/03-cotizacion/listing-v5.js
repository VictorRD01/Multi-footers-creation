// Listing V5: resolve the unit from the activated button.
(function () {
  if (window.demoQuoteHandler) document.removeEventListener('click', window.demoQuoteHandler, true);
  window.demoQuoteHandler = function (event) {
    const button = event.target.closest('.vehicle-action');
    if (!button || !button.closest('.inventory-v5')) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const unit = button.closest('.vehicle-card');
    const cents = Number(unit?.dataset.unitPriceCents);
    if (!unit?.dataset.stock || !Number.isSafeInteger(cents) || cents <= 0) {
      InventoryLab.quoteUnavailable(unit, 'A verifiable SKU or price is missing.');
      return;
    }
    InventoryLab.showQuote(unit, {
      sku: unit.dataset.stock,
      name: unit.querySelector('h2, h1').textContent.trim(),
      cents
    }, 'Correct quote · Listing V5');
  };
  document.addEventListener('click', window.demoQuoteHandler, true);
})();
