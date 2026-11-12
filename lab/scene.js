import * as THREE from 'three';
import { createAmbient } from './audio.js';

const CARD_W = 2.4;
const CARD_H = 1.5;

/* Palette convention per project:
 * palette.bgA / bgB — gradient stops for the card background
 * palette.ink      — body/display text color (hex string)
 * palette.accent   — eyebrow + motif color (hex string)
 * palette.glow     — the color of the back-light behind the panel (hex int)
 * motif            — a short label letting the texture draw a signature shape
 */
const PROJECTS = [
  {
    id: 'bandartrade', name: 'BandarTrade', url: 'https://bandartrade.com',
    tagline: 'AI-assisted freight quoting for Bangladesh',
    description: "A live freight quoting and port trading platform built for Bangladesh. Its quoting engine turns unstructured rate requests like \"2x 40ft containers, Shanghai to Chittagong\" into priced quotes: an LLM extracts the route and container details, then carrier rates, trucking costs and client markups are applied. Built on .NET 8, SQL Server and React.",
    palette: { bgA: '#1a0a0a', bgB: '#5a1a1a', ink: '#f4e2d6', accent: '#ff8a5a', glow: 0xff5a3a },
    motif: 'route',
  },
  {
    id: 'uplift', name: 'Uplift Digital Partners', url: 'https://upliftdigitalpartners.com',
    tagline: 'A web agency for local small businesses',
    description: "A web agency I co-founded that builds and modernizes websites and apps for local small businesses. The company site runs on GitHub Pages with a custom domain, and includes a conversational booking assistant that sends confirmation emails and one-click Google Calendar invites.",
    palette: { bgA: '#06234a', bgB: '#1b5fa8', ink: '#ffffff', accent: '#ffd166', glow: 0x4a9bff },
    motif: 'orbit',
  },
  {
    id: 'dishcover', name: 'Dishcover', url: 'https://dishcover-two.vercel.app',
    tagline: 'A restaurant answer engine for travelers',
    description: "A mobile-first PWA that shows 3 to 5 nearby restaurants by mood and budget, each with its most-praised dishes and prices. An LLM extracts top dishes from review text, stored in Supabase by place to keep API costs near zero, with optional Halal, Kosher, vegetarian and vegan filters.",
    palette: { bgA: '#09263a', bgB: '#2d6a7f', ink: '#fff4df', accent: '#ffb552', glow: 0x3a9fb0 },
    motif: 'plate',
  },
  {
    id: 'okdoc', name: 'OkDoc', url: null, status: 'In development',
    tagline: 'Which doctors near me take my insurance?',
    description: "An in-network doctor finder, starting with Medicare Advantage plans in NYC. It syncs public CMS-mandated provider directory FHIR APIs and the NPI Registry into Postgres through payer adapters, labels every result with its source and freshness, and is built for 12 languages to WCAG 2.2 AA.",
    palette: { bgA: '#f3f6fa', bgB: '#cfe0ea', ink: '#0a1a2a', accent: '#e03848', glow: 0xff8080 },
    motif: 'cross',
  },
  {
    id: 'night-walker', name: 'Night Walker NYC', url: 'https://three-js-brainstorm.vercel.app',
    tagline: 'A cel-shaded browser game set in New York',
    description: "A comic-style game set in New York neighborhoods, playable on desktop and phone, with walking, biking and driving. Every street, building, crowd, traffic pattern and sound is generated in code, with a day-to-night cycle and subway travel between neighborhoods. Built with Three.js.",
    palette: { bgA: '#1f0a2a', bgB: '#3a1a4a', ink: '#fff2a0', accent: '#ffd54a', glow: 0xffe066 },
    motif: 'map',
  },
  {
    id: 'anima-fy', name: 'Anima-Fy', url: 'https://animafy-ai.vercel.app',
    tagline: 'Audit planning from free SEC EDGAR data',
    description: "An audit-planning workspace for any U.S. public company. It surfaces auditor's reports, critical audit matters, material weaknesses, restatements and late filings, benchmarks against industry XBRL percentiles, and generates Excel workpapers and an AI planning-memo draft.",
    palette: { bgA: '#0a0f24', bgB: '#2a2050', ink: '#f5f0e4', accent: '#ffd54a', glow: 0x6060ff },
    motif: 'check',
  },
  {
    id: 'livegrid', name: 'LiveGrid', url: 'https://livegrid.onrender.com',
    tagline: 'Real-time football stats and match analytics',
    description: "A sports analytics web app that tracks professional football statistics, historical scoring records, international player metrics and match analytics, including the data pipelines and interactive front end behind the stats views.",
    palette: { bgA: '#06182e', bgB: '#1b5a4a', ink: '#f4fff6', accent: '#5aff8a', glow: 0x55d070 },
    motif: 'grid',
  },
  {
    id: 'tether', name: 'Tether', url: 'https://tether-us.vercel.app',
    tagline: 'A web app for couples',
    description: "A web app for couples that I designed, built and launched, owning product, UI/UX, brand identity and front-end state management end to end. Responsive, and in production on Vercel.",
    palette: { bgA: '#2a0a2a', bgB: '#7a2a5a', ink: '#fff0e6', accent: '#ffb87c', glow: 0xe07aa0 },
    motif: 'rings',
  },
  {
    id: 'near-coffee', name: 'NearCoffee', url: 'https://www.nearcoffee.space',
    tagline: 'A barn cafe below the Tetons, in a browser tab',
    description: "A cafe concept you can walk into from a browser: a converted barn below the Tetons, with lighting that matches the visitor's local time. Built with Vite and deployed on Vercel.",
    palette: { bgA: '#2a1810', bgB: '#8c5a2f', ink: '#f5e8d6', accent: '#f0b86e', glow: 0xc07a3a },
    motif: 'ring',
  },
  {
    id: 'livescanner', name: 'LiveScanner', url: null, status: 'Android app, not on the web',
    tagline: 'Live ATC and scanner feeds for Android Auto',
    description: "A native Android app that streams 50+ live air-traffic control feeds and police, fire and EMS scanner feeds, sorted by distance. It supports background playback, lock-screen controls, favorites and Android Auto in the car. Built with Kotlin, Jetpack Compose and Media3.",
    palette: { bgA: '#021a2a', bgB: '#0e4a4a', ink: '#eafff2', accent: '#5aff9a', glow: 0x40ffa0 },
    motif: 'wave',
  },
  {
    id: 'hololand', name: 'Hololand', url: 'https://hololandbd.com',
    tagline: 'A clothing brand with a 3D lookbook and AI stylist',
    description: "The site for a clothing brand in Bangladesh: a GSAP hero, a Three.js 3D lookbook, a shop with WhatsApp checkout, and a bilingual English/Bangla AI stylist, size advisor and gift finder running on Groq through a Cloudflare Worker, with offline fallbacks.",
    palette: { bgA: '#0a0a0f', bgB: '#2a0a12', ink: '#ffe4e6', accent: '#e50914', glow: 0xff2040 },
    motif: 'tape',
  },
  {
    id: 'sharif-adornment', name: 'Sharif Adornment', url: 'https://sharifadornment.com',
    tagline: 'A jewelry boutique in Queens, NY',
    description: "The site for a jewelry boutique in Queens: searchable collections with filters, a page per piece for SEO and link previews, full-screen zoom, rental details and WhatsApp/Messenger enquiries. Dependency-free HTML, CSS and JavaScript on GitHub Pages.",
    palette: { bgA: '#20160a', bgB: '#6a4a1a', ink: '#f4e4c2', accent: '#f4b85a', glow: 0xd4a054 },
    motif: 'ring',
  },
  {
    id: 'maria-closet', name: "Maria's Closet", url: 'https://maria-closet.vercel.app',
    tagline: 'Rental storefront for South Asian outfits',
    description: "A rental storefront with a 3D garment carousel, availability checks, rental requests and an owner admin. Built with Next.js, React Three Fiber, Tailwind and Supabase.",
    palette: { bgA: '#1a0520', bgB: '#5a1a30', ink: '#f4e2b6', accent: '#d4a054', glow: 0xa4482c },
    motif: 'arch',
  },
  {
    id: 'seams-of-safa', name: 'Seams of Safa', url: 'https://seamsofsafa.vercel.app',
    tagline: 'Storefront for a clothing label',
    description: "A storefront for a clothing label, built on Next.js with Sanity CMS, next-intl translations, React Three Fiber, Groq AI and Resend email.",
    palette: { bgA: '#3a0a4a', bgB: '#8a2a90', ink: '#f4e4c2', accent: '#f4b85a', glow: 0xd4a054 },
    motif: 'thread',
  },
  {
    id: 'mozumder', name: 'Mozumder', url: 'https://mozumderbd.net',
    tagline: 'Logistics company site with a 3D network map',
    description: "A multi-page site for a logistics and transportation company in Chattogram, with a scroll-driven homepage film and a 3D network map.",
    palette: { bgA: '#ead4a8', bgB: '#8c6d3a', ink: '#1a1206', accent: '#5a3a1a', panelAccent: '#eadcc2', glow: 0xeadcc2 },
    motif: 'serifA',
  },
  {
    id: 'prime-cookie', name: 'Primé Cookie', url: 'https://fahimalamwork.github.io/primecookie/',
    tagline: 'A bakery site you can take a bite out of',
    description: "A bakery site built with Vite and Three.js, featuring an interactive \"take a bite\" hero with crumb particles and a waitlist.",
    palette: { bgA: '#2a1f04', bgB: '#6a4810', ink: '#ffe066', accent: '#ffd54a', glow: 0xffd54a },
    motif: 'plate',
  },
];

/* Deterministic 4x4 grid layout with slight jitter for life */
const COLS = [-7.3, -2.5, 2.5, 7.3];
const ROWS = [3.0, 1.0, -1.0, -3.0];
PROJECTS.forEach((p, i) => {
  const col = i % 4;
  const row = Math.floor(i / 4);
  const seed = i * 1.3;
  const jx = (Math.sin(seed) * 0.4);
  const jy = (Math.cos(seed * 1.7) * 0.3);
  const jz = (Math.sin(seed * 0.9) * 0.6);
  p.position = [COLS[col] + jx, ROWS[row] + jy, jz];
  p.index = String(i + 1).padStart(2, '0');
  p.rotation = [
    (Math.cos(seed * 2.1) * 0.08),
    (Math.sin(seed * 1.3) * 0.14),
    (Math.sin(seed * 0.7) * 0.03),
  ];
});

function init() {
  const canvas = document.getElementById('scene');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 19);

  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const hemi = new THREE.HemisphereLight(0xd0e0ff, 0x301830, 0.6);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 1.3);
  key.position.set(4, 6, 10);
  scene.add(key);

  addStars(scene);

  const objects = PROJECTS.map((p) => {
    const grp = buildCard(p);
    grp.position.fromArray(p.position);
    grp.rotation.set(p.rotation[0], p.rotation[1], p.rotation[2]);
    grp.userData = {
      project: p,
      basePos: new THREE.Vector3(...p.position),
      baseRot: { x: p.rotation[0], y: p.rotation[1], z: p.rotation[2] },
      phase: Math.random() * Math.PI * 2,
      bob: 0.08 + Math.random() * 0.1,
      selectable: true,
    };
    grp.traverse((n) => { if (n.isMesh) n.userData.ownerGroup = grp; });
    scene.add(grp);
    return grp;
  });

  // Index list
  const indexList = document.getElementById('index-list');
  PROJECTS.forEach((p) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <button class="index-item" data-id="${p.id}" type="button">
        <span class="index-name">${p.name}</span>
        <span class="index-tagline">${p.tagline}</span>
      </button>`;
    indexList.appendChild(li);
  });

  const panel = document.getElementById('info-panel');
  const indexPanel = document.getElementById('index-panel');

  const raycaster = new THREE.Raycaster();
  const mouseN = new THREE.Vector2();
  let hovered = null;
  let selected = null;
  const parallax = { x: 0, y: 0, tx: 0, ty: 0 };

  function hoverTest(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseN.set(x, y);
    parallax.tx = x * 0.9;
    parallax.ty = y * 0.5;

    if (selected) return;
    raycaster.setFromCamera(mouseN, camera);
    const hits = raycaster.intersectObjects(objects, true);
    let next = null;
    for (const h of hits) {
      const g = h.object.userData?.ownerGroup;
      if (g && g.userData.selectable) { next = g; break; }
    }
    if (hovered !== next) {
      hovered = next;
      canvas.style.cursor = hovered ? 'pointer' : '';
    }
  }

  function onClick() {
    if (selected || !hovered) return;
    openProject(hovered);
  }

  function openProject(grp) {
    selected = grp;
    hovered = null;
    canvas.style.cursor = '';
    const p = grp.userData.project;
    panel.querySelector('.panel-name').textContent = p.name;
    panel.querySelector('.panel-tagline').textContent = p.tagline;
    panel.querySelector('.panel-desc').textContent = p.description;
    const link = panel.querySelector('.panel-link');
    const status = panel.querySelector('.panel-status');
    if (p.url) {
      link.href = p.url;
      link.hidden = false;
      status.hidden = true;
    } else {
      link.hidden = true;
      status.textContent = p.status || 'Not public yet';
      status.hidden = false;
    }
    panel.style.setProperty('--accent', p.palette.panelAccent || p.palette.accent);
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-open');
  }

  function closeProject() {
    if (!selected) return;
    selected = null;
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-open');
  }

  function showIndex() {
    indexPanel.classList.add('open');
    indexPanel.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-open');
  }
  function hideIndex() {
    indexPanel.classList.remove('open');
    indexPanel.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-open');
  }

  canvas.addEventListener('pointermove', hoverTest);
  canvas.addEventListener('click', onClick);
  document.getElementById('panel-close').addEventListener('click', closeProject);
  document.getElementById('index-close').addEventListener('click', hideIndex);
  document.getElementById('index-btn').addEventListener('click', showIndex);

  // Ambient audio toggle (default off, remember preference)
  const ambient = createAmbient();
  const soundBtn = document.getElementById('sound-btn');
  const soundLabel = soundBtn.querySelector('.sound-state');
  soundBtn.addEventListener('click', async () => {
    const on = await ambient.toggle();
    soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    soundLabel.textContent = on ? 'On' : 'Off';
  });
  indexList.addEventListener('click', (e) => {
    const btn = e.target.closest('.index-item');
    if (!btn) return;
    const p = PROJECTS.find((x) => x.id === btn.dataset.id);
    if (!p) return;
    const obj = objects.find((o) => o.userData.project === p);
    hideIndex();
    if (obj) openProject(obj);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeProject(); hideIndex(); }
  });

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function tick() {
    const t = clock.getElapsedTime();

    if (!reduceMotion) {
      parallax.x += (parallax.tx - parallax.x) * 0.04;
      parallax.y += (parallax.ty - parallax.y) * 0.04;
      camera.position.x = parallax.x;
      camera.position.y = parallax.y;
      camera.lookAt(0, 0, 0);
    }

    for (const obj of objects) {
      const u = obj.userData;
      const base = u.basePos;

      let tx = base.x, ty = base.y, tz = base.z;
      if (!reduceMotion) ty += Math.sin(t * 0.5 + u.phase) * u.bob;

      if (obj === selected) {
        tx = parallax.x * 1.0;
        ty = parallax.y * 1.0;
        tz = 11;
      } else if (selected) {
        tx = base.x * 1.5;
        ty = base.y * 1.5;
        tz = base.z - 8;
      }

      obj.position.x += (tx - obj.position.x) * 0.09;
      obj.position.y += (ty - obj.position.y) * 0.09;
      obj.position.z += (tz - obj.position.z) * 0.09;

      let targetScale = 1;
      if (obj === selected) targetScale = 2.0;
      else if (obj === hovered) targetScale = 1.14;
      else if (selected) targetScale = 0.5;
      const s = obj.scale.x + (targetScale - obj.scale.x) * 0.12;
      obj.scale.setScalar(s);

      // subtle tilt reset + hover tilt-toward-camera
      const rotYTarget = (obj === hovered) ? u.baseRot.y * 0.3 : u.baseRot.y;
      const rotXTarget = (obj === hovered) ? u.baseRot.x * 0.3 : u.baseRot.x;
      obj.rotation.y += (rotYTarget - obj.rotation.y) * 0.07;
      obj.rotation.x += (rotXTarget - obj.rotation.x) * 0.07;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
  requestAnimationFrame(() => document.body.classList.add('scene-ready'));
}

/* ---------- helpers ---------- */

function addStars(scene) {
  const count = 600;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 40 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.08, sizeAttenuation: true,
    transparent: true, opacity: 0.6, depthWrite: false,
  });
  scene.add(new THREE.Points(geo, mat));
}

/* ---------- card builder ---------- */

const _glowTexCache = { tex: null };
function getGlowTexture() {
  if (_glowTexCache.tex) return _glowTexCache.tex;
  const S = 256;
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  const ctx = c.getContext('2d');
  const grad = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grad.addColorStop(0.0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
  grad.addColorStop(0.75, 'rgba(255,255,255,0.08)');
  grad.addColorStop(1.0, 'rgba(255,255,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, S, S);
  _glowTexCache.tex = new THREE.CanvasTexture(c);
  _glowTexCache.tex.colorSpace = THREE.SRGBColorSpace;
  return _glowTexCache.tex;
}


function buildCard(project) {
  const g = new THREE.Group();

  // Backlight glow — a radial fade so the halo is soft, not a rectangle
  const glowTex = getGlowTexture();
  const glowGeo = new THREE.PlaneGeometry(CARD_W * 2.2, CARD_H * 2.2);
  const glowMat = new THREE.MeshBasicMaterial({
    color: project.palette.glow,
    map: glowTex,
    transparent: true,
    opacity: 0.55,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.z = -0.15;
  g.add(glow);

  // Frame — a very thin dark slab behind the panel for depth
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(CARD_W + 0.1, CARD_H + 0.1, 0.06),
    new THREE.MeshStandardMaterial({ color: 0x0e0a1c, roughness: 0.35, metalness: 0.6 }),
  );
  frame.position.z = -0.02;
  g.add(frame);

  // Main panel — textured plane
  const tex = buildCardTexture(project);
  const panelMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.FrontSide });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(CARD_W, CARD_H), panelMat);
  panel.position.z = 0.02;
  g.add(panel);

  return g;
}

function buildCardTexture(project) {
  const W = 1200, H = 750;
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const ctx = c.getContext('2d');
  const pal = project.palette;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W * 0.6, H);
  grad.addColorStop(0, pal.bgA);
  grad.addColorStop(1, pal.bgB);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Soft radial accent in a corner to add depth
  const r = ctx.createRadialGradient(W * 0.88, H * 0.12, 20, W * 0.88, H * 0.12, W * 0.6);
  r.addColorStop(0, hexWithAlpha(pal.accent, 0.26));
  r.addColorStop(1, hexWithAlpha(pal.accent, 0));
  ctx.fillStyle = r;
  ctx.fillRect(0, 0, W, H);

  // Grain
  addGrain(ctx, W, H, 0.03);

  // Signature motif in the lower-right / around the card
  drawMotif(ctx, project.motif, W, H, pal);

  // Border inset — a thin line at the edge
  ctx.strokeStyle = hexWithAlpha(pal.ink, 0.1);
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, W - 32, H - 32);

  // Index number — top-left eyebrow
  ctx.fillStyle = pal.accent;
  ctx.font = '600 26px ui-monospace, "SF Mono", Menlo, monospace';
  ctx.textBaseline = 'top';
  ctx.fillText(`${project.index} / 16`, 56, 56);

  // Name — big display
  ctx.fillStyle = pal.ink;
  const nameSize = fitNameSize(ctx, project.name, W - 112, 110);
  ctx.font = `200 ${nameSize}px "Inter", system-ui, sans-serif`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(project.name, 56, H - 220);

  // Tagline — small, mono
  ctx.fillStyle = hexWithAlpha(pal.ink, 0.72);
  ctx.font = '400 24px "Inter", system-ui, sans-serif';
  ctx.fillText(project.tagline, 56, H - 140);

  // Bottom-right GitHub cue
  ctx.fillStyle = hexWithAlpha(pal.accent, 0.9);
  ctx.font = '600 20px ui-monospace, "SF Mono", Menlo, monospace';
  ctx.textAlign = 'right';
  ctx.fillText(`→  OPEN`, W - 56, H - 60);
  ctx.textAlign = 'left';

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

function fitNameSize(ctx, text, maxWidth, startSize) {
  let size = startSize;
  while (size > 30) {
    ctx.font = `200 ${size}px "Inter", system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size -= 4;
  }
  return size;
}

function hexWithAlpha(hex, alpha) {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function addGrain(ctx, W, H, intensity) {
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * intensity;
    d[i] = clamp255(d[i] + n);
    d[i + 1] = clamp255(d[i + 1] + n);
    d[i + 2] = clamp255(d[i + 2] + n);
  }
  ctx.putImageData(img, 0, 0);
}
function clamp255(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

/* motifs are drawn large on the right side of the card */
function drawMotif(ctx, motif, W, H, pal) {
  ctx.save();
  ctx.translate(W * 0.72, H * 0.42);
  const stroke = hexWithAlpha(pal.ink, 0.14);
  const strokeAccent = hexWithAlpha(pal.accent, 0.4);
  ctx.lineWidth = 2;

  switch (motif) {
    case 'orbit':
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(0, 0, 90 + i * 40, 50 + i * 24, (i * Math.PI) / 7, 0, Math.PI * 2);
        ctx.strokeStyle = i === 1 ? strokeAccent : stroke;
        ctx.stroke();
      }
      ctx.fillStyle = pal.accent;
      ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
      break;

    case 'ring':
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 60 + i * 30, 0, Math.PI * 2);
        ctx.strokeStyle = i === 2 ? strokeAccent : stroke;
        ctx.stroke();
      }
      break;

    case 'wave':
      ctx.strokeStyle = strokeAccent;
      ctx.lineWidth = 3;
      for (let line = 0; line < 3; line++) {
        ctx.beginPath();
        const amp = 30 + line * 12;
        for (let x = -180; x <= 180; x += 4) {
          const y = Math.sin((x / 42) + line) * amp;
          if (x === -180) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = 1 - line * 0.25;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;

    case 'grid':
      ctx.strokeStyle = stroke;
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 36, -140);
        ctx.lineTo(i * 36, 140);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-140, i * 36);
        ctx.lineTo(140, i * 36);
        ctx.stroke();
      }
      ctx.fillStyle = pal.accent;
      ctx.beginPath(); ctx.arc(0, 0, 14, 0, Math.PI * 2); ctx.fill();
      break;

    case 'rings':
      for (let s = -1; s <= 1; s += 2) {
        ctx.strokeStyle = s === -1 ? strokeAccent : stroke;
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(s * 50, 0, 90, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;

    case 'arch':
      ctx.strokeStyle = strokeAccent;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-120, 120); ctx.lineTo(-120, -20);
      ctx.quadraticCurveTo(-120, -140, 0, -140);
      ctx.quadraticCurveTo(120, -140, 120, -20);
      ctx.lineTo(120, 120);
      ctx.stroke();
      break;

    case 'cross':
      ctx.fillStyle = strokeAccent;
      ctx.fillRect(-20, -120, 40, 240);
      ctx.fillRect(-120, -20, 240, 40);
      break;

    case 'plate':
      ctx.strokeStyle = strokeAccent;
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.stroke();
      break;

    case 'tape':
      ctx.strokeStyle = strokeAccent;
      ctx.lineWidth = 50;
      ctx.strokeRect(-110, -70, 220, 140);
      ctx.lineWidth = 10;
      ctx.strokeStyle = stroke;
      ctx.beginPath();
      ctx.moveTo(-170, -40); ctx.lineTo(170, 40);
      ctx.stroke();
      break;

    case 'map':
      ctx.strokeStyle = stroke;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        const y = -100 + i * 50;
        ctx.moveTo(-150, y);
        ctx.bezierCurveTo(-80, y - 30, 20, y + 30, 150, y);
        ctx.stroke();
      }
      ctx.fillStyle = pal.accent;
      ctx.beginPath(); ctx.arc(-30, 10, 10, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(70, -40, 10, 0, Math.PI * 2); ctx.fill();
      break;

    case 'needle':
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(0, 0, 130, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.stroke();
      // Needle
      ctx.fillStyle = pal.accent;
      ctx.beginPath();
      ctx.moveTo(0, -120); ctx.lineTo(12, 0); ctx.lineTo(-12, 0);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = hexWithAlpha(pal.ink, 0.4);
      ctx.beginPath();
      ctx.moveTo(0, 120); ctx.lineTo(12, 0); ctx.lineTo(-12, 0);
      ctx.closePath(); ctx.fill();
      break;

    case 'check':
      ctx.strokeStyle = strokeAccent;
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-110, 0); ctx.lineTo(-30, 80); ctx.lineTo(130, -90);
      ctx.stroke();
      ctx.lineCap = 'butt';
      break;

    case 'route':
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(-170, 90);
      ctx.bezierCurveTo(-70, -80, 50, 120, 170, -70);
      ctx.stroke();
      ctx.setLineDash([]);
      // Nodes
      ctx.fillStyle = pal.accent;
      for (const [x, y] of [[-170, 90], [0, 20], [170, -70]]) {
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
      }
      break;

    case 'thread':
      ctx.strokeStyle = strokeAccent;
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        for (let x = -170; x <= 170; x += 4) {
          const y = Math.sin(x / 30 + i * 0.4) * (60 + i * 6);
          if (x === -170) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = 0.6 - i * 0.05;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;

    case 'serifA':
      ctx.fillStyle = hexWithAlpha(pal.ink, 0.08);
      ctx.font = '400 240px "Times New Roman", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('M', 0, 10);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'alphabetic';
      break;
  }
  ctx.restore();
}

init();
