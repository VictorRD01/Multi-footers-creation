# Inventory Studio

A WordPress-style inventory customization demo hosted on GitHub Pages. Built with HTML, CSS and JavaScript, with local jQuery and Font Awesome assets. No backend or installation is required for visitors.

- [Dashboard](https://victorrd01.github.io/Multi-footers-creation/)
- [Test scenarios](https://victorrd01.github.io/Multi-footers-creation/#scenarios)
- [Inventory Listing](https://victorrd01.github.io/Multi-footers-creation/inventory-listing.html)
- [Inventory Details](https://victorrd01.github.io/Multi-footers-creation/inventory-details.html)

## Editing and previewing

Listing supports versions 1–6; Details supports 1, 3 and 6. Both default to **V6**. An existing configuration receives a one-time selection migration to V6 without replacing custom code. Subsequent selections persist normally.

The Listing and Details editors appear side by side on desktop, with separate JavaScript and CSS tabs. They do not contain embedded inventory previews. **View Inventory Listing** and **View Inventory Details** open the selected version in another tab. Save in the editor, then use **Reload changes** on the inventory page.

Each view/version keeps its own scripts and styles in localStorage. Unselected versions retain their code. Standalone URLs accept `?version=6` to pin a version; without it, reloading follows the editor's saved selection. Export/Import transfers configurations between browsers. Edits are not committed to GitHub or shared with other visitors.

## Fixed inventory layouts

- Listing V4 follows the Craig Powersports grid reference.
- Listing V5 follows the Karl Malone row reference.
- Listing V6 follows the B&E Marine pricing and promotion reference.
- Details V6 follows the supplied Yamaha WaveRunner screenshot, with an image gallery, black pricing panel, green actions and a locally validated contact form. Images are local demonstration illustrations.
- Listing 1–3 and Details 1/3 retain generic fixtures.

The HTML belongs to the application. Users edit only JS and CSS for their chosen version. Preview execution remains isolated in a fresh sandboxed iframe on each inventory page. The demo does not send commercial requests, calls, payments or financing applications.

## Widgets and ordered test scenarios

**Widgets** offers one global HTML container restricted to inline JavaScript/jQuery script tags. It runs before the view-specific code when enabled. Local jQuery 3.7.1 uses `noConflict()`; use `jQuery` or a local `$` alias.

**Dealer Settings → Test Scenarios** contains seven ordered English checks, including five runnable comparisons and two manual acceptance tests. Each describes its setup, steps and expected result. Examples demonstrate incorrect prices, blocked actions, mismatched quote identity, a shared hotfix reaching unrelated views, and the Details V6 sale subtotal being mistaken for its final total.

The global architecture example includes six current routes and ten simulated historical modules. Historical functions are defined but never invoked. The code comparison shows actual file sizes and module ranges alongside the selected separate module.

See [the English presentation and test guide](examples/SCENARIOS.md) for instructions, limits and restoration. Loading an example asks before replacing its listed destinations and keeps a local pre-example backup.

## Deployment

In GitHub **Settings → Pages**, select **GitHub Actions**. The `Deploy Inventory Studio to GitHub Pages` workflow publishes pushes to `main` and supports manual execution. It uploads only the static site assets and examples.

## Optional development

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

After editing `examples/04-monolito/global.js`, regenerate the presentation copies and measurements:

```sh
python3 scripts/build-monolith.py
```

jQuery and Font Awesome license files are included with their local assets. Test data and audits are illustrative; production product identity, availability and transaction totals require server validation.
