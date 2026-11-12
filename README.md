# ganjaam.com

Personal site of Fahim Alam — Solutions Engineer based in Charlotte, NC.

Static HTML/CSS/JS on GitHub Pages, served at [ganjaam.com](https://ganjaam.com). No build step.

## Local preview

The page backdrop scrubs video on scroll, which needs a server that supports byte-range requests (Python's `http.server` does not):

```bash
npx http-server -p 4000
# open http://localhost:4000
```

## Structure

- `index.html` — main page: hero, about, skills, experience, projects, contact
- `styles.css` — styles for the main page
- `hero-video.js` — scrubs each section's backdrop video from scroll position; clips after the hero load only as their section approaches
- `interactive.js` — mobile menu, section title screens, experience expand/collapse, project card tilt and scroll reveal
- `lab/` — the Lab: 16 projects as floating cards in a Three.js scene
  - `lab/scene.js` — scene, cards, grid and ring layouts, and interaction; the `PROJECTS` array at the top holds every card
  - `lab/audio.js` — optional ambient sound
- `assets/video/` — one backdrop clip per section (`hero`, `about`, `skills`, `experience`, `projects`, `contact`)
- `assets/shots/` — one 1200×750 screenshot per live project, named by its Lab `id`; used on the project cards and the Lab card faces
- `assets/` — headshot and résumé PDF
- `CNAME` — custom domain for GitHub Pages
- `.nojekyll` — GitHub Pages serves files as-is

## Editing Lab projects

Each entry in `PROJECTS` (`lab/scene.js`) looks like:

```js
{
  id: 'kebab-id',
  name: 'Display Name',
  url: 'https://example.com',   // live site; use null plus `status: '…'` when there is no public link
  tagline: 'One-line hook shown on the card',
  description: '2–3 sentence project description.',
  palette: { bgA, bgB, ink, accent, glow },
  motif: 'orbit',               // shape drawn on the card texture
}
```

A project with a `url` shows `assets/shots/<id>.jpg` on its card; one without keeps the drawn motif.

The grid is 4×4, so the Lab holds 16 cards.
