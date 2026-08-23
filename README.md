# fahimalam.work

Personal site of Fahim Alam — a scroll-driven 3D mountain climb through photos from the trail.

Static HTML/CSS/JS, hosted on GitHub Pages. No build step.

## Local preview

```bash
python3 -m http.server 4000
# then open http://localhost:4000
```

## Structure

- `index.html` — chapter-based single-page layout
- `styles.css` — layout and typography
- `mountain.js` — Three.js scene (mountain, sky, photo postcards) driven by scroll
- `assets/` — headshot, résumé download
- `.nojekyll` — disables Jekyll on GitHub Pages so all files are served as-is

## Notes

- Postcard photos are placeholders from [Lorem Picsum](https://picsum.photos). To use real photos, replace the `PHOTOS` array in `mountain.js` — either point `id` at other Picsum IDs, or swap `loader.load('https://picsum.photos/id/...')` for `loader.load('assets/photos/your-file.jpg')`.
- Chapter text lives in `index.html` under each `<section class="chapter">`. Each chapter's scroll position lines up with one camera keyframe in `mountain.js` (`CAM_KEYFRAMES`).
- `three` is loaded via importmap from `unpkg.com/three@0.163.0`.
