# Validation results

Functional checks were executed with Chromium and Playwright against the HTTP-served application. Intentional regressions are expected outcomes of the global examples, not unexpected application failures.

## Current V6 release

| Check | Observed result |
| --- | --- |
| Fresh editor configuration | Listing and Details both select V6. No embedded inventory previews are present. |
| Older saved configuration | A one-time migration selects V6 while preserving custom code. Subsequent saved selections survive reloads. |
| Dealer Settings test plan | Seven sequential English scenarios, with described steps and expected outcomes. |
| Details V6 pricing | Sale subtotal $16,184; destination $475; assembly $467; displayed total $17,126; savings $1,815; stock 3229. |
| Gallery | Eight thumbnail controls, previous/next selection, and correctly updated illustration sources. |
| Inquiry validation | Missing required values fail native validity checks; completed values show a local confirmation without sending or storing a request. |
| Product actions | Demo dialogs open and close using their close controls. The back arrow opens Listing V6 through a fixed internal route. |
| New total regression | Correct stock 3229 is paired with the wrong $16,184 subtotal. The audit detects the mismatch against $17,126. |
| Details V6 solution | The quote uses the $17,126 displayed total while the separate sale-price panel remains $16,184. |
| Existing global archive | The new nested Details V6 action works; price audit passes; product name and SKU match the WaveRunner; historical mount count remains zero. |
| Separate architecture module | Details V6 retains its own CTA, correct total and correct product identity. |
| Older detail fixture | Details V1 continues to show the Toyota RAV4 fixture. |
| Responsive layout | No horizontal page overflow at 390 px for Details V6 or the scenario list. |
| Runtime | No unexpected page errors in this sequence. |

## Previously verified regression contracts

- Global V4 pricing works; the V5 fallback publishes $22/$17/$46 instead of $22,448/$17,657/$46,947. The total falls from $87,052 to $85 without an exception, and price filters inherit the incorrect values.
- Global V6 price reconstruction double-counts concepts; the first sample becomes $43,124 instead of $20,495. Version-specific price adapters restore structured amounts.
- Positional CSS preserves pointer interaction in V4 but gives V5/V6 action columns `pointer-events:none`; a real pointer click is rejected. Scoped CSS restores the interaction.
- The global V5 quote fallback pairs the second CFMOTO with the first Polaris SKU and price. Scoped adapters preserve the selected unit.
- A shared V4 campaign hotfix reaches unrelated global routes; separate modules keep the V4 campaign local.
- The global archive module ranges, line counts and bytes were checked against its actual source. Ten simulated historical modules remain defined but uninvoked.
- The pre-example backup restores the saved configuration; standalone inventory pages read updated code on reload.

These checks do not validate real financing, taxes, APIs, all browsers or a complete accessibility matrix. The $329/month copy is illustrative. Production prices and product identity require server validation; the browser snapshots used by this laboratory are presentation instrumentation.
