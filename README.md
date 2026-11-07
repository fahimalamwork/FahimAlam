# fahimalam.work

Personal site for Fahim Alam: Solutions Engineer, cloud data migration, QA automation and full-stack products. Static HTML/CSS/JS on GitHub Pages, no build step.

## Local preview

```bash
python3 -m http.server 4000
# open http://localhost:4000
```

## Structure

- `index.html` — homepage: bento hero, selected work, experience, skills, open-source QA tooling, about, contact
- `work/bandartrade.html`, `work/tenant-migration.html` — case studies
- `styles.css` — design tokens (light + dark), bento grid, case-study layout
- `main.js` — theme toggle (remembers choice), local clock, scroll reveals, hero video, screenshot swap-in
- `assets/covers/*.svg` — illustrated project covers
- `assets/shots/` — real screenshots of live projects + `manifest.json` (see below)
- `assets/video/hero.mp4` — hero background video (the other clips in that folder are no longer used)
- `lab/` — the interactive 3D project constellation
- `demo/dashboard.html` — live demo for test-report-dashboard

## Real project screenshots

Every project tile shows its illustrated cover until a screenshot exists. To capture screenshots of the live sites:

```bash
npm i -D playwright && npx playwright install chromium
node tools/capture-screenshots.mjs            # all sites
node tools/capture-screenshots.mjs dishcover  # one site
```

This writes `assets/shots/<id>.jpg` and updates `assets/shots/manifest.json`. The page picks them up automatically: the `<id>` matches the `data-shot="…"` attribute on the tile. Commit `assets/shots/` afterwards.

## Editing

- Theme colors: the `:root` tokens at the top of `styles.css` (dark values are repeated for the system preference and for the manual toggle).
- Fonts: Instrument Serif (display), Geist (body), Geist Mono (labels), loaded from Google Fonts in each page's `<head>`.
- Add a project: copy a `.work-sm` tile in `index.html`, add a cover SVG in `assets/covers/`, and optionally add it to `SITES` in `tools/capture-screenshots.mjs`.
