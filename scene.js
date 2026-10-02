import * as THREE from 'three';

const GITHUB_USER = 'fahimalamwork';

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
    id: 'open-meteo', name: 'Open-Meteo', repo: 'Open-Meteo',
    tagline: 'A living 3D globe of real weather',
    description: "Earth's actual weather rendered as a living, animated low-poly world. Pulls open weather data and visualizes it as waves, cloud bands, and temperature gradients across a stylized globe.",
    palette: { bgA: '#06234a', bgB: '#1b5fa8', ink: '#ffffff', accent: '#ffd166', glow: 0x4a9bff },
    motif: 'orbit',
  },
  {
    id: 'near-coffee', name: 'Near Coffee', repo: 'near-coffee-visual',
    tagline: 'A mountain coffee shop, open in a browser tab',
    description: "A converted homestead barn below the Tetons, rendered as an atmospheric visual front door for a mountain coffee shop dream.",
    palette: { bgA: '#2a1810', bgB: '#8c5a2f', ink: '#f5e8d6', accent: '#f0b86e', glow: 0xc07a3a },
    motif: 'ring',
  },
  {
    id: 'livescanner', name: 'LiveScanner', repo: 'LiveScanner',
    tagline: 'Air-traffic + emergency feeds, in one place',
    description: "Stream live air-traffic control audio from LiveATC and emergency/scanner feeds, with quick-switch between frequencies and favorites you can save.",
    palette: { bgA: '#021a2a', bgB: '#0e4a4a', ink: '#eafff2', accent: '#5aff9a', glow: 0x40ffa0 },
    motif: 'wave',
  },
  {
    id: 'quotex-ai', name: 'QuotexAI', repo: 'QuotexAi',
    tagline: 'AI quoting + docs for freight forwarders',
    description: "An AI-powered quoting and document automation platform for freight forwarders and customs brokers. Ingests inquiries, generates compliant quotes, drafts BLs and invoices.",
    palette: { bgA: '#0a0f24', bgB: '#2a2050', ink: '#f5f0e4', accent: '#ffd54a', glow: 0x6060ff },
    motif: 'grid',
  },
  {
    id: 'tether', name: 'Tether', repo: 'Maria',
    tagline: 'A private space for two',
    description: "A couples companion PWA — shared modules, private per-user vaults, and a readable couple profile. Built for keeping two people in each other's pocket, especially over distance.",
    palette: { bgA: '#2a0a2a', bgB: '#7a2a5a', ink: '#fff0e6', accent: '#ffb87c', glow: 0xe07aa0 },
    motif: 'rings',
  },
  {
    id: 'maria-closet', name: "Maria's Closet", repo: 'MariaCloset',
    tagline: 'Closet rental, muted jewel + gold',
    description: "A closet-rental concept with a restrained desi-luxe aesthetic — muted jewel tones, gold accents, and request-to-rent interactions on bespoke garments.",
    palette: { bgA: '#1a0520', bgB: '#5a1a30', ink: '#f4e2b6', accent: '#d4a054', glow: 0xa4482c },
    motif: 'arch',
  },
  {
    id: 'okdoc', name: 'OkDoc', repo: 'OkDoc',
    tagline: 'Doctors near you who actually take your insurance',
    description: "Answers the question other apps dodge: which doctors near me actually take my insurance? Cross-references provider directories and plan networks to surface real matches.",
    palette: { bgA: '#f3f6fa', bgB: '#cfe0ea', ink: '#0a1a2a', accent: '#e03848', glow: 0xff8080 },
    motif: 'cross',
  },
  {
    id: 'dishcover', name: 'Dishcover', repo: 'dishcover',
    tagline: 'For travelers standing hungry in a new city',
    description: "A mobile-first PWA for travelers: scan a menu or point at a storefront, get instant translations, allergy flags, and 'what to order here' from locals.",
    palette: { bgA: '#09263a', bgB: '#2d6a7f', ink: '#fff4df', accent: '#ffb552', glow: 0x3a9fb0 },
    motif: 'plate',
  },
  {
    id: 'stoopcast', name: 'StoopCast', repo: 'StoopCast',
    tagline: 'Free-stuff stoop alerts with karma',
    description: "Real-time alerts for free stuff left on neighborhood stoops. Photo-first posts, karma for the person who dropped it off, map view for the person running to grab it.",
    palette: { bgA: '#2a2004', bgB: '#8a6418', ink: '#1a1a1a', accent: '#2a2004', glow: 0xffd54a },
    motif: 'tape',
  },
  {
    id: 'geobinge', name: 'GeoBinge', repo: 'GeoBinge',
    tagline: 'Where in the world Netflix has your show',
    description: "Search any movie or TV show and instantly see every country where Netflix (or other services) have it. VPN hop planner included.",
    palette: { bgA: '#0a0a0f', bgB: '#2a0a12', ink: '#ffe4e6', accent: '#e50914', glow: 0xff2040 },
    motif: 'map',
  },
  {
    id: 'echo', name: 'Echo', repo: 'Echo',
    tagline: 'Voice messages locked to GPS coordinates',
    description: "Drop a 60-second audio memo at a location on the map. The next person who walks past can hear it. A quieter, more intimate location-based network.",
    palette: { bgA: '#1f0a2a', bgB: '#3a1a4a', ink: '#fff2a0', accent: '#ffd54a', glow: 0xffe066 },
    motif: 'wave',
  },
  {
    id: 'bearing', name: 'Bearing', repo: 'Bearing',
    tagline: 'A personal decision engine',
    description: "Name a hard decision. Weigh it honestly against your own values. Watch the needle settle. Not a shortcut — a mirror.",
    palette: { bgA: '#20160a', bgB: '#6a4a1a', ink: '#f4e4c2', accent: '#f4b85a', glow: 0xd4a054 },
    motif: 'needle',
  },
  {
    id: 'autotest', name: 'AutoTest', repo: 'AutoTest',
    tagline: 'Jira issue → test cases, automatically',
    description: "A production-leaning MVP that reads a Jira issue and generates relevant test cases with the right templates, acceptance-criteria mapping, and Gherkin where it fits.",
    palette: { bgA: '#0a1a2a', bgB: '#1a3a4a', ink: '#eaffea', accent: '#55d070', glow: 0x55d070 },
    motif: 'check',
  },
  {
    id: 'vela', name: 'Vela', repo: 'Vela',
    tagline: 'SaaS for private logistics around Chittagong',
    description: "Workflow and visibility tooling for the private logistics ecosystem around Chittagong port. The wedge is operational; the roadmap is long.",
    palette: { bgA: '#1a0a0a', bgB: '#5a1a1a', ink: '#f4e2d6', accent: '#ff8a5a', glow: 0xff5a3a },
    motif: 'route',
  },
  {
    id: 'seams-of-safa', name: 'Seams of Safa', repo: 'Seamsofsafa',
    tagline: "A storefront for my sister's label",
    description: "Replacing a Shopify storefront with a custom Next.js build tuned for how my sister actually operates her label day to day.",
    palette: { bgA: '#3a0a4a', bgB: '#8a2a90', ink: '#f4e4c2', accent: '#f4b85a', glow: 0xd4a054 },
    motif: 'thread',
  },
  {
    id: 'mozumder', name: 'Mozumder', repo: 'Mozumder',
    tagline: 'A handcrafted site for a diversified business',
    description: "A static site for Mozumder — a modern, handcrafted presence for a diversified family business, written in the kind of HTML that opens in 300ms on any phone.",
    palette: { bgA: '#e8d7b4', bgB: '#b8a075', ink: '#1a1a1a', accent: '#1a1a1a', glow: 0xeadcc2 },
    motif: 'serifA',
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
    panel.querySelector('.panel-github').href = `https://github.com/${GITHUB_USER}/${p.repo}`;
    panel.style.setProperty('--accent', p.palette.accent);
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
      ctx.fillStyle = hexWithAlpha(pal.ink, 0.14);
      ctx.font = '900 320px "Times New Roman", Georgia, serif';
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
