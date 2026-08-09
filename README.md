# fahimalam.work

Personal site of Fahim Alam — Senior QA / SDET based in New York, NY.

Static HTML/CSS, hosted on GitHub Pages.

## Local preview

```bash
python3 -m http.server 4000
# then open http://localhost:4000
```

## Structure

- `index.html` — single-page site
- `styles.css` — all styles
- `interactive.js` — card tilt, scroll reveal, terminal typing animation
- `hero-scene.js` — Three.js CI test-grid backdrop in the hero (ESM, imports `three` from unpkg)
- `demo/` — self-contained sample dashboards embedded on project cards
- `assets/` — headshot, résumé download
- `.nojekyll` — disables Jekyll on GitHub Pages so all files are served as-is
