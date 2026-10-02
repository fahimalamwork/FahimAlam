# fahimalam.work

A 3D project constellation of 16 things I've built — scroll-free, fully interactive, Three.js on static hosting. GitHub Pages.

## Local preview

```bash
python3 -m http.server 4000
# open http://localhost:4000
```

## Structure

- `index.html` — minimal shell: canvas, top nav, info and index panels
- `styles.css` — layout and panel styling
- `scene.js` — Three.js scene + 16 bespoke project models + raycaster-driven hover/click (ESM, imports `three` from unpkg)
- `assets/` — headshot and résumé download
- `.nojekyll` — GitHub Pages serves files as-is

## Editing projects

The `PROJECTS` array at the top of `scene.js` holds all 16 entries. Each project has:

```js
{
  id: 'kebab-id',
  name: 'Display Name',
  tagline: 'One-line hook shown as the panel eyebrow',
  description: '2–3 sentence project description.',
  repo: 'GitHubRepoName',       // becomes github.com/fahimalamwork/<repo>
  position: [x, y, z],          // where in the constellation
  build: buildFunction,         // bespoke 3D model
}
```

To add a new project: write a new `buildWhatever()` returning a `THREE.Group`, add an entry to `PROJECTS`, pick an empty-ish spot in the 4×4 grid.

To change the GitHub user, edit `GITHUB_USER` at the top of `scene.js`.
