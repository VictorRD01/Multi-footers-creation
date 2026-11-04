// Listing V4: read the structured amount, never presentation text.
(function ($) {
  $('.inventory-v4 .vehicle-card').each(function () {
    const price = this.querySelector('.grid-total .vehicle-price');
    if (!price) return;
    const cents = Number(this.dataset.unitPriceCents);
    if (!Number.isSafeInteger(cents) || cents <= 0) {
      price.textContent = 'Price unavailable';
      this.querySelectorAll('.vehicle-action').forEach(button => button.disabled = true);
      return; // Do not substitute zero or a subtotal.
    }
    price.textContent = InventoryLab.usd(cents);
    this.dataset.price = String(cents / 100);
  });
  InventoryLab.auditPrices('Fixed: structured price contract for Listing V4');
})(jQuery);

// Message specific to listing V4. Other containers are unchanged.
jQuery(".inventory-v4 .reference-actions .primary-action").text("Quote ATV with accessories · V4");

// Listing V4: resolve the unit from the activated button.
(function () {
  if (window.demoQuoteHandler) document.removeEventListener('click', window.demoQuoteHandler, true);
  window.demoQuoteHandler = function (event) {
    const button = event.target.closest('.vehicle-action');
    if (!button || !button.closest('.inventory-v4')) return;
    event.preventDefault(); event.stopImmediatePropagation();
    const unit = button.closest('.vehicle-card');
    const cents = Number(unit?.dataset.unitPriceCents);
    if (!unit?.dataset.stock || !Number.isSafeInteger(cents) || cents <= 0) {
      InventoryLab.quoteUnavailable(unit, 'A verifiable SKU or price is missing.');
      return;
    }
    InventoryLab.showQuote(unit, {
      sku: unit.dataset.stock,
      name: unit.querySelector('.reference-description h2, .vehicle-body h2, .detail-heading h1, :scope > h1').textContent.trim(),
      cents
    }, 'Correct quote · Listing V4');
  };
  document.addEventListener('click', window.demoQuoteHandler, true);
})();
