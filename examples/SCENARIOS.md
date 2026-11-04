# Inventory demo: English test and presentation guide

Open [Dealer Settings → Test Scenarios](https://victorrd01.github.io/Multi-footers-creation/#scenarios). The page contains seven numbered checks with steps, expected results, runnable examples and source links.

The inventory editors are side by side. Listing and Details default to Version 6. Existing configurations receive a one-time selection migration to V6; their custom scripts and styles are preserved. Later version choices continue to persist normally. A scenario may deliberately select V4 to establish the starting condition for a regression.

## 01 — Price integrity across versions

1. Run the global example and open Listing V4. Confirm the three reference prices match.
2. Change to V5 and reload. `$22,448` becomes `$22`, `$17,657` becomes `$17`, and `$46,947` becomes `$46`. The batch drops from `$87,052` to `$85` without an exception.
3. Inspect the under-$20,000 filter: it now includes all three incorrectly priced units.
4. Apply the version-specific solution and repeat V4/V5/V6. Structured integer cents and the correct destination selector restore prices and filters. A missing price blocks the inquiry instead of becoming zero.

## 02 — Layout and commercial action regression

1. Run the V4 global CSS and activate a commercial CTA in V4.
2. Switch to V5/V6. Positional selectors now reach image and action wrappers; images clip and all three CTA columns inherit `pointer-events: none`.
3. Apply the scoped solution. Semantic, version-specific selectors preserve images and actions.
4. Check pointer and keyboard access separately. A pointer-events rule does not necessarily block keyboard activation.

## 03 — Quote the selected unit

1. Run the global quote example. Activate the second unit in V4.
2. Switch to V5 and activate the second CFMOTO: the global fallback resolves the first Polaris at `$22,448` instead of the requested CFMOTO at `$17,657`.
3. Apply the solution. Test Listing 4/5/6 and Details 1/3/6. Each adapter resolves the unit from its button, validates SKU and structured cents, and preserves product identity.
4. Details V6 is stock `3229`, with a displayed total of `$17,126`.

## 04 — Global archive versus separate modules

1. Load the complete global example. Inspect the full source and the module map under Widgets.
2. The global contains six current contexts and ten simulated historical implementations. Only the selected route mounts; historical invocation count remains zero.
3. Simulate the shared V4 hotfix. Its ATV message also appears in V5/V6 and Details.
4. Apply the scoped solution. Only V4 gets the campaign; other contexts retain their own messages, prices and quote adapters.

The global example is functional and organized. A correctly scoped override could also solve the issue within a global architecture. The benefit demonstrated is a narrower editing and review context, especially for users editing code in a textarea. It is not a claim that all global modules are unreliable or that separate modules always contain fewer total lines.

Module sizes and ranges come from `04-monolito/manifest.json`. After editing the canonical `04-monolito/global.js`, run:

```sh
python3 scripts/build-monolith.py
```

This rebuilds the runnable widget copies, readable CSS, archive source and exact measurements.

## 05 — Details V6 sale subtotal versus final total

1. Run the global example and open Details V6.
2. Activate **Start My Deal**. Stock `3229` is correct, but the draft uses the sale subtotal `$16,184`, omitting `$475` destination and `$467` assembly.
3. The audit compares that subtotal against the displayed total `$17,126`.
4. Apply the Details V6 solution and reload. The quote uses `$17,126`; the separate sale-price panel still shows `$16,184`.

These are the fixture's displayed amounts. The reference disclaimer excludes the `$399` processing charge and applicable taxes, title and registration fees. `$17,126` is therefore not represented as an all-inclusive out-the-door transaction amount. Production pricing and identity must be validated by the server.

## 06 — Save, switch and return

1. Start on Listing V6 and Details V6. Disable the global widget for an isolated test.
2. Add a visible Listing V6 CSS customization and a JS marker, then save:

```js
document.querySelector('.inventory-page').dataset.testMarker = 'listing-six';
```

3. Open Listing and reload to see the customization. Switch to V5: the V6 code must not run there.
4. Return to V6 and reload: its saved customization returns. Details remains independent.

## 07 — Details V6 gallery and inquiry flow

The layout recreates the supplied WaveRunner reference with local SVG illustrations rather than the original photograph. Details 1 and 3 retain the generic fixture.

Check:

- Product: **2026 YAMAHA WAVERUNNER GP SVHO BLACK- 3229**.
- MSRP `$17,999`; sale subtotal `$16,184`; destination `$475`; assembly `$467`; displayed total `$17,126`; savings `$1,815`.
- Gallery arrows and eight thumbnails update the selected illustration.
- Incomplete inquiry fields show native validity feedback; completed fields show **Demo inquiry validated. Nothing was sent or stored.**
- Start My Deal, test drive, trade, questions and financing actions open demo dialogs. No request or application is sent.
- The reference `$329/mo` figure is sample copy, not a computed credit offer.
- The green back arrow opens Listing V6 through a fixed internal route.
- Check desktop and mobile widths; the editors remain side by side on desktop and stack on small screens.

## Storage, backups and safety of the demonstration

Code is stored in this browser and origin, not written back to GitHub. Standalone pages read it on reload. Use Export/Import to transfer it to another browser or profile.

Runnable scenarios ask before replacing the listed destinations and preserve a local backup before the first example. Restore replaces edits made after that backup. Existing user code is not silently translated or overwritten: load the updated English examples to use the new sample outputs.

JavaScript runs in a fresh sandboxed iframe with local jQuery. Widget HTML accepts classic inline script tags only. The price and quote audits use initial fixture snapshots captured before custom code; this is presentation instrumentation, not a trusted production pricing API. The inquiry form validates locally and performs no network submission.
