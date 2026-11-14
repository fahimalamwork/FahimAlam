# ganjaam.com

Personal site of Fahim Alam — Solutions Engineer based in Charlotte, NC.

Static HTML/CSS/JS on GitHub Pages, served at [ganjaam.com](https://ganjaam.com). No build step.

## Local preview

```bash
python3 -m http.server 4000
# open http://localhost:4000
```

## Design

"Ledger": chalk ground (`#f3f3ef`), graphite ink (`#111111`), one signal-orange accent (`#e5481b`, `#b83a12` for text).
Space Grotesk for display, Inter for body, JetBrains Mono for labels. Motion is limited to a one-time count-up on the
hero manifest, section rules drawing in on first view, and small hover lifts — all disabled under `prefers-reduced-motion`.

## Structure

- `index.html` — main page: hero + migration manifest, about + skills, experience, projects, contact
- `styles.css` — styles for the main page (tokens at the top)
- `main.js` — mobile menu, experience expand/collapse all, section-rule reveal, manifest count-up
- `lab/` — the Lab: all 16 projects as a contact sheet with filters and a detail loupe
  - `lab/lab.js` — the `PROJECTS` array at the top holds every frame; rendering, filters, arrow-key stepping, `#id` deep links
  - `lab/styles.css` — Lab styles
- `assets/shots/` — one 1200×750 screenshot per live project, named by its Lab `id`; used on the project cards and Lab frames
- `assets/` — headshot and résumé PDF
- `CNAME` — custom domain for GitHub Pages
- `.nojekyll` — GitHub Pages serves files as-is

## Editing Lab projects

Each entry in `PROJECTS` (`lab/lab.js`) looks like:

```js
{
  id: 'kebab-id',
  name: 'Display Name',
  kind: 'product',              // product | client | play | dev — drives the filters
  url: 'https://example.com',   // live site; use null plus `status: '…'` when there is no public link
  shot: true,                   // shows assets/shots/<id>.jpg; omit to show the status placeholder
  tagline: 'One-line hook',
  description: '2–3 sentence project description.',
}
```
