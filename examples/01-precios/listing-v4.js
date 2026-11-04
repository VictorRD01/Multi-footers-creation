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
