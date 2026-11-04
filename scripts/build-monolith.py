"""Regenerate presentation copies and exact measurements from global.js."""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1] / 'examples' / '04-monolito'
source = (root / 'global.js').read_text()
manifest = json.loads((root / 'manifest.json').read_text())
previous = {item['id']: item for item in manifest['modules']}
entries, archived = [], []
for match in re.finditer(r'// <module id="([^"]+)" status="([^"]+)">([\s\S]*?)// </module>', source):
    start = source[:match.start()].count('\n') + 1
    end = source[:match.end()].count('\n') + 1
    entries.append({**previous[match[1]], 'startLine': start, 'endLine': end,
                    'lineCount': end - start + 1, 'bytes': len(match[0].encode()), 'status': match[2]})
    if match[2] == 'archived':
        archived.append(match[0])
assert len(entries) == 16 and len(archived) == 12
manifest.update(lineCount=len(source.splitlines()), bytes=len(source.encode()), modules=entries, currentContexts=4, archivedModules=12)
(root / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
(root / 'global-widget.html').write_text('<script>\n' + source + '\n</script>\n')
old = "ctaText: 'Request information · demo'"
assert old in source
hotfix = source.replace(old, "ctaText: 'Quote ATV with accessories · V4 hotfix'").replace("accent: '#007f86'", "accent: '#bd1e2d'")
(root / 'global-hotfix-widget.html').write_text('<script>\n' + hotfix + '\n</script>\n')
css = source.split('  const css = `\n', 1)[1].split('`;\n', 1)[0]
(root / 'global.css').write_text(css)
(root / 'legacy-archive.js').write_text('// SIMULATED historical archive; source for presentation, not a standalone runtime.\n' + '\n'.join(archived) + '\n')
print(f"Built {manifest['lineCount']} lines, {manifest['bytes']} bytes, {len(entries)} module ranges")
