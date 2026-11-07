// Captures screenshots of the live project sites and writes them to
// assets/shots/, plus a manifest.json the homepage reads. Any project with a
// screenshot shows it; projects without one keep their illustrated cover.
//
//   npm i -D playwright && npx playwright install chromium
//   node tools/capture-screenshots.mjs            # all sites
//   node tools/capture-screenshots.mjs dishcover  # just one
//
// Commit assets/shots/ afterwards.

import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'assets', 'shots');

// id must match the data-shot="…" attribute in index.html / work/*.html
const SITES = [
  { id: 'bandartrade', url: 'https://bandartrade.com' },
  { id: 'uplift', url: 'https://upliftdigitalpartners.com' },
  { id: 'animafy', url: 'https://animafy-ai.vercel.app' },
  { id: 'dishcover', url: 'https://dishcover-two.vercel.app' },
  { id: 'nightwalker', url: 'https://three-js-brainstorm.vercel.app', wait: 6000 },
  { id: 'nearcoffee', url: 'https://nearcoffee.space', wait: 6000 },
  { id: 'neverforget', url: 'https://neverforget-timesheet.netlify.app' },
  { id: 'tether', url: 'https://tether-us.vercel.app' },
  { id: 'livegrid', url: 'https://livegrid.onrender.com', wait: 8000 }, // Render free tier cold-starts
];

const only = process.argv.slice(2);
const targets = only.length ? SITES.filter((s) => only.includes(s.id)) : SITES;

await mkdir(OUT, { recursive: true });
let manifest = {};
try { manifest = JSON.parse(await readFile(join(OUT, 'manifest.json'), 'utf8')); } catch {}

const browser = await chromium.launch();
for (const site of targets) {
  const context = await browser.newContext({
    viewport: site.mobile ? { width: 430, height: 760 } : { width: 1440, height: 810 },
    deviceScaleFactor: site.mobile ? 2 : 1.5,
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  const file = `${site.id}.jpg`;
  try {
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(site.wait ?? 2500);
    await page.screenshot({ path: join(OUT, file), type: 'jpeg', quality: 80 });
    manifest[site.id] = file;
    console.log(`✓ ${site.id}`);
  } catch (err) {
    console.warn(`✗ ${site.id}: ${err.message.split('\n')[0]}`);
  }
  await context.close();
}
await browser.close();

await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`manifest: ${Object.keys(manifest).length} screenshots`);
