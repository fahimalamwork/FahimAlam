import * as THREE from 'three';

const GITHUB_USER = 'fahimalamwork';

const PROJECTS = [
  {
    id: 'open-meteo', name: 'Open-Meteo', repo: 'Open-Meteo',
    tagline: 'A living 3D globe of real weather',
    description: "Earth's actual weather rendered as a living, animated low-poly world. Pulls open weather data and visualizes it as waves, cloud bands, and temperature gradients across a stylized globe.",
    position: [-6, 2.6, 0], build: buildGlobe,
  },
  {
    id: 'near-coffee', name: 'Near Coffee', repo: 'near-coffee-visual',
    tagline: 'A mountain coffee shop, open in a browser tab',
    description: "A converted homestead barn below the Tetons, rendered as an atmospheric visual front door for a mountain coffee shop dream.",
    position: [-2, 3, 1], build: buildCoffeeMug,
  },
  {
    id: 'livescanner', name: 'LiveScanner', repo: 'LiveScanner',
    tagline: 'Air-traffic + emergency feeds, in one place',
    description: "Stream live air-traffic control audio from LiveATC and emergency/scanner feeds, with quick-switch between frequencies and favorites you can save.",
    position: [2, 3, -1], build: buildRadarDish,
  },
  {
    id: 'quotex-ai', name: 'QuotexAI', repo: 'QuotexAi',
    tagline: 'AI quoting + docs for freight forwarders',
    description: "An AI-powered quoting and document automation platform for freight forwarders and customs brokers. Ingests inquiries, generates compliant quotes, drafts BLs and invoices.",
    position: [6, 2.6, 0.5], build: buildDocument,
    rotation: [0, -0.25, 0], spinY: 0,
  },
  {
    id: 'tether', name: 'Tether', repo: 'Maria',
    tagline: 'A private space for two',
    description: "A couples companion PWA — shared modules, private per-user vaults, and a readable couple profile. Built for keeping two people in each other's pocket, especially over distance.",
    position: [-6, 0.5, 0.5], build: buildLinkedRings,
    rotation: [-0.35, 0, 0], spinY: 0.0015,
  },
  {
    id: 'maria-closet', name: "Maria's Closet", repo: 'MariaCloset',
    tagline: 'Closet rental, muted jewel + gold',
    description: "A closet-rental concept with a restrained desi-luxe aesthetic — muted jewel tones, gold accents, and request-to-rent interactions on bespoke garments.",
    position: [-2, 0.5, -0.5], build: buildHanger,
    rotation: [0, 0, 0], spinY: 0,
  },
  {
    id: 'okdoc', name: 'OkDoc', repo: 'OkDoc',
    tagline: 'Doctors near you who actually take your insurance',
    description: "Answers the question other apps dodge: which doctors near me actually take my insurance? Cross-references provider directories and plan networks to surface real matches.",
    position: [2, 0.5, 1], build: buildMedicalCross,
  },
  {
    id: 'dishcover', name: 'Dishcover', repo: 'dishcover',
    tagline: 'For travelers standing hungry in a new city',
    description: "A mobile-first PWA for travelers: scan a menu or point at a storefront, get instant translations, allergy flags, and 'what to order here' from locals.",
    position: [6, 0.5, -1], build: buildPlateFork,
    rotation: [Math.PI / 3.4, 0, 0], spinY: 0,
  },
  {
    id: 'stoopcast', name: 'StoopCast', repo: 'StoopCast',
    tagline: 'Free-stuff stoop alerts with karma',
    description: "Real-time alerts for free stuff left on neighborhood stoops. Photo-first posts, karma for the person who dropped it off, map view for the person running to grab it.",
    position: [-6, -1.5, 0.5], build: buildCardboardBox,
    rotation: [-0.2, -0.25, 0], spinY: 0,
  },
  {
    id: 'geobinge', name: 'GeoBinge', repo: 'GeoBinge',
    tagline: 'Where in the world Netflix has your show',
    description: "Search any movie or TV show and instantly see every country where Netflix (or other services) have it. VPN hop planner included.",
    position: [-2, -1.5, -1], build: buildTV,
    rotation: [0, -0.2, 0], spinY: 0,
  },
  {
    id: 'echo', name: 'Echo', repo: 'Echo',
    tagline: 'Voice messages locked to GPS coordinates',
    description: "Drop a 60-second audio memo at a location on the map. The next person who walks past can hear it. A quieter, more intimate location-based network.",
    position: [2, -1.5, 0.5], build: buildSpeakerPin,
    rotation: [0, 0, 0], spinY: 0,
  },
  {
    id: 'bearing', name: 'Bearing', repo: 'Bearing',
    tagline: 'A personal decision engine',
    description: "Name a hard decision. Weigh it honestly against your own values. Watch the needle settle. Not a shortcut — a mirror.",
    position: [6, -1.5, -0.5], build: buildCompass,
    rotation: [Math.PI / 3.4, 0, 0], spinY: 0,
  },
  {
    id: 'autotest', name: 'AutoTest', repo: 'AutoTest',
    tagline: 'Jira issue → test cases, automatically',
    description: "A production-leaning MVP that reads a Jira issue and generates relevant test cases with the right templates, acceptance-criteria mapping, and Gherkin where it fits.",
    position: [-6, -3.5, -0.5], build: buildGear,
  },
  {
    id: 'vela', name: 'Vela', repo: 'Vela',
    tagline: 'SaaS for private logistics around Chittagong',
    description: "Workflow and visibility tooling for the private logistics ecosystem around Chittagong port. The wedge is operational; the roadmap is long.",
    position: [-2, -3.5, 1], build: buildContainer,
  },
  {
    id: 'seams-of-safa', name: 'Seams of Safa', repo: 'Seamsofsafa',
    tagline: "A storefront for my sister's label",
    description: "Replacing a Shopify storefront with a custom Next.js build tuned for how my sister actually operates her label day to day.",
    position: [2, -3.5, -1], build: buildSpool,
  },
  {
    id: 'mozumder', name: 'Mozumder', repo: 'Mozumder',
    tagline: 'A handcrafted site for a diversified business',
    description: "A static site for Mozumder — a modern, handcrafted presence for a diversified family business, written in the kind of HTML that opens in 300ms on any phone.",
    position: [6, -3.5, 0.5], build: buildPillar,
  },
];

init();

function init() {
  const canvas = document.getElementById('scene');
  if (!canvas) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 15);

  scene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const hemi = new THREE.HemisphereLight(0xcfd8ff, 0x3a1a4a, 0.95);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(6, 10, 10);
  scene.add(key);
  const front = new THREE.DirectionalLight(0xffffff, 0.9);
  front.position.set(0, 0, 15);
  scene.add(front);
  const rim = new THREE.DirectionalLight(0xffb86c, 0.6);
  rim.position.set(-8, -4, -6);
  scene.add(rim);

  addStars(scene);

  const objects = PROJECTS.map((p) => {
    const grp = p.build();
    grp.position.fromArray(p.position);
    if (p.rotation) grp.rotation.set(p.rotation[0] || 0, p.rotation[1] || 0, p.rotation[2] || 0);
    const spin = p.spinY !== undefined ? p.spinY : 0.004 + Math.random() * 0.006;
    grp.userData = {
      project: p,
      basePos: new THREE.Vector3(...p.position),
      baseRotX: grp.rotation.x,
      baseRotZ: grp.rotation.z,
      phase: Math.random() * Math.PI * 2,
      spinY: spin,
      bob: 0.08 + Math.random() * 0.14,
      selectable: true,
    };
    grp.traverse((n) => {
      if (n.isMesh) { n.userData.ownerGroup = grp; }
    });
    scene.add(grp);
    return grp;
  });

  // Build index list
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
    parallax.tx = x * 0.6;
    parallax.ty = y * 0.35;

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

  function onPointerDown() { /* no-op, click fires */ }

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
    const url = `https://github.com/${GITHUB_USER}/${p.repo}`;
    panel.querySelector('.panel-github').href = url;
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
  canvas.addEventListener('pointerdown', onPointerDown);
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
  const focusTarget = new THREE.Vector3(0, 0, 10);

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
      if (!reduceMotion) ty += Math.sin(t * 0.6 + u.phase) * u.bob;

      if (obj === selected) {
        tx = parallax.x * 1.0;
        ty = parallax.y * 1.0;
        tz = 10;
      } else if (selected) {
        tx = base.x * 1.5;
        ty = base.y * 1.5;
        tz = base.z - 6;
      }

      obj.position.x += (tx - obj.position.x) * 0.09;
      obj.position.y += (ty - obj.position.y) * 0.09;
      obj.position.z += (tz - obj.position.z) * 0.09;

      let targetScale = 1;
      if (obj === selected) targetScale = 2.0;
      else if (obj === hovered) targetScale = 1.25;
      else if (selected) targetScale = 0.5;

      const s = obj.scale.x + (targetScale - obj.scale.x) * 0.1;
      obj.scale.setScalar(s);

      if (!reduceMotion) obj.rotation.y += u.spinY;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  tick();
  requestAnimationFrame(() => {
    document.body.classList.add('scene-ready');
  });
}

/* ---------- helpers ---------- */

function addStars(scene) {
  const count = 500;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    const r = 35 + Math.random() * 30;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    sizes[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffffff, size: 0.08, sizeAttenuation: true,
    transparent: true, opacity: 0.6, depthWrite: false,
  });
  scene.add(new THREE.Points(geo, mat));
}

/* ---------- bespoke project models ---------- */

function buildGlobe() {
  const g = new THREE.Group();
  const earth = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.85, 2),
    new THREE.MeshStandardMaterial({ color: 0x2a5fa8, flatShading: true, roughness: 0.6, metalness: 0.05 }),
  );
  g.add(earth);
  for (let i = 0; i < 8; i++) {
    const continent = new THREE.Mesh(
      new THREE.SphereGeometry(0.28 + Math.random() * 0.18, 7, 5, 0, Math.PI * 2, 0, Math.PI * 0.42),
      new THREE.MeshStandardMaterial({ color: 0x4a9050, flatShading: true, roughness: 0.75 }),
    );
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 0.86;
    continent.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi));
    continent.lookAt(0, 0, 0);
    continent.rotateX(Math.PI);
    continent.scale.setScalar(0.5);
    g.add(continent);
  }
  // thin atmosphere halo
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 24, 16),
    new THREE.MeshBasicMaterial({ color: 0x6cb6ff, transparent: true, opacity: 0.08, side: THREE.BackSide }),
  );
  g.add(halo);
  return g;
}

function buildCoffeeMug() {
  const g = new THREE.Group();
  const cupMat = new THREE.MeshStandardMaterial({ color: 0xd4a574, roughness: 0.5 });
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.44, 0.9, 24), cupMat);
  const inside = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.4, 0.85, 24),
    new THREE.MeshStandardMaterial({ color: 0x3a1f12 }),
  );
  inside.position.y = 0.04;
  const handle = new THREE.Mesh(
    new THREE.TorusGeometry(0.28, 0.08, 10, 20, Math.PI),
    cupMat,
  );
  handle.position.set(0.5, 0, 0);
  handle.rotation.y = Math.PI / 2;
  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.72, 0.04, 24),
    cupMat,
  );
  saucer.position.y = -0.48;
  g.add(cup, inside, handle, saucer);
  // steam
  for (let i = 0; i < 4; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.09 + i * 0.03, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }),
    );
    s.position.set((i - 1.5) * 0.08, 0.55 + i * 0.22, 0);
    g.add(s);
  }
  return g;
}

function buildRadarDish() {
  const g = new THREE.Group();
  const dish = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2.6),
    new THREE.MeshStandardMaterial({ color: 0xa5adb6, side: THREE.DoubleSide, roughness: 0.4, metalness: 0.4 }),
  );
  dish.rotation.x = Math.PI;
  dish.position.y = 0.4;
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.7, 10),
    new THREE.MeshStandardMaterial({ color: 0x454c56, roughness: 0.6 }),
  );
  post.position.y = -0.1;
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.08, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x454c56 }),
  );
  base.position.y = -0.5;
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0x50ff80, emissive: 0x50ff80, emissiveIntensity: 1 }),
  );
  beacon.position.y = 0.5;
  g.add(dish, post, base, beacon);
  // concentric sweep arcs
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.6 + i * 0.3, 0.025, 6, 32),
      new THREE.MeshBasicMaterial({ color: 0x50ff80, transparent: true, opacity: 0.45 - i * 0.12 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.45;
    g.add(ring);
  }
  return g;
}

function buildDocument() {
  const g = new THREE.Group();
  const paper = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 1.4, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.8 }),
  );
  for (let i = 0; i < 6; i++) {
    const line = new THREE.Mesh(
      new THREE.PlaneGeometry(0.85 - (i % 2) * 0.25, 0.04),
      new THREE.MeshBasicMaterial({ color: 0x1e3a8a }),
    );
    line.position.set(-0.05 + (i % 2 === 0 ? 0 : 0.1), 0.5 - i * 0.17, 0.023);
    g.add(line);
  }
  // AI diamond sparkle
  const diamond = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.17, 0),
    new THREE.MeshStandardMaterial({ color: 0xffd54a, emissive: 0xffd54a, emissiveIntensity: 0.6, roughness: 0.1, metalness: 0.6 }),
  );
  diamond.position.set(0.42, 0.6, 0.14);
  const stamp = new THREE.Mesh(
    new THREE.CircleGeometry(0.14, 16),
    new THREE.MeshBasicMaterial({ color: 0xcc3344, transparent: true, opacity: 0.55 }),
  );
  stamp.position.set(-0.35, -0.5, 0.023);
  g.add(paper, diamond, stamp);
  return g;
}

function buildLinkedRings() {
  const g = new THREE.Group();
  const matA = new THREE.MeshStandardMaterial({ color: 0xe9b48a, roughness: 0.25, metalness: 0.9 });
  const matB = new THREE.MeshStandardMaterial({ color: 0xd4a0e0, roughness: 0.25, metalness: 0.9 });
  const geo = new THREE.TorusGeometry(0.42, 0.09, 14, 36);
  const r1 = new THREE.Mesh(geo, matA);
  const r2 = new THREE.Mesh(geo, matB);
  // Both rings face the camera (hole along +Z) with a slight outward tilt
  // and horizontal offset so they overlap in the middle.
  r1.position.set(-0.3, 0, 0);
  r1.rotation.y = -0.45;
  r2.position.set(0.3, 0, 0.05);
  r2.rotation.y = 0.45;
  g.add(r1, r2);
  return g;
}

function buildHanger() {
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0xc8a05a, metalness: 0.65, roughness: 0.3 });
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.0, 8), metal);
  bar.rotation.z = Math.PI / 2;
  const left = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.55, 8), metal);
  left.position.set(-0.42, 0.24, 0);
  left.rotation.z = Math.PI / 4.5;
  const right = left.clone();
  right.position.set(0.42, 0.24, 0);
  right.rotation.z = -Math.PI / 4.5;
  const hook = new THREE.Mesh(
    new THREE.TorusGeometry(0.1, 0.03, 8, 16, Math.PI),
    metal,
  );
  hook.position.y = 0.55;
  hook.rotation.x = Math.PI;
  // Cloth
  const cloth = new THREE.Mesh(
    new THREE.PlaneGeometry(0.9, 1.0, 4, 6),
    new THREE.MeshStandardMaterial({ color: 0x6b1736, side: THREE.DoubleSide, roughness: 0.95 }),
  );
  // slightly wave the cloth
  const pos = cloth.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, Math.sin(pos.getX(i) * 3) * 0.05);
  }
  cloth.geometry.computeVertexNormals();
  cloth.position.y = -0.45;
  g.add(bar, left, right, hook, cloth);
  return g;
}

function buildMedicalCross() {
  const g = new THREE.Group();
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const redMat = new THREE.MeshStandardMaterial({ color: 0xe03848, emissive: 0xe03848, emissiveIntensity: 0.25 });
  const v = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.3, 0.42), whiteMat);
  const h = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.42, 0.42), whiteMat);
  const vr = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.18, 0.44), redMat);
  const hr = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.3, 0.44), redMat);
  g.add(v, h, vr, hr);
  return g;
}

function buildPlateFork() {
  const g = new THREE.Group();
  const plate = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.68, 0.07, 28),
    new THREE.MeshStandardMaterial({ color: 0xf6f3ea, roughness: 0.5 }),
  );
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.03, 8, 28),
    new THREE.MeshStandardMaterial({ color: 0x245c82, metalness: 0.4 }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.04;
  const silverware = new THREE.MeshStandardMaterial({ color: 0xd0d4d8, metalness: 0.85, roughness: 0.2 });
  const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), silverware);
  fork.position.set(0.42, 0.15, 0.1);
  fork.rotation.z = -Math.PI / 7;
  const spoon = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.7, 8), silverware);
  spoon.position.set(-0.42, 0.15, 0.1);
  spoon.rotation.z = Math.PI / 7;
  const spoonBowl = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    silverware,
  );
  spoonBowl.position.set(-0.62, 0.4, 0.1);
  spoonBowl.rotation.x = Math.PI / 2;
  // fork tines
  for (let i = -1; i <= 1; i++) {
    const tine = new THREE.Mesh(
      new THREE.CylinderGeometry(0.014, 0.014, 0.18, 6),
      silverware,
    );
    tine.position.set(0.62 + i * 0.05, 0.4, 0.1);
    g.add(tine);
  }
  g.add(plate, rim, fork, spoon, spoonBowl);
  return g;
}

function buildCardboardBox() {
  const g = new THREE.Group();
  const cardboard = new THREE.MeshStandardMaterial({ color: 0xc89050, roughness: 0.92, flatShading: true });
  const box = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.8, 1.0), cardboard);
  // tape strip
  const tape = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.82, 1.02),
    new THREE.MeshStandardMaterial({ color: 0xe8dcc2, roughness: 0.6 }),
  );
  // open flaps
  const darker = new THREE.MeshStandardMaterial({ color: 0xa07434, roughness: 0.92 });
  const flap1 = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.04, 0.5), darker);
  flap1.position.set(0, 0.42, -0.25);
  flap1.rotation.x = -0.4;
  const flap2 = flap1.clone();
  flap2.rotation.x = 0.4;
  flap2.position.z = 0.25;
  // FREE sign (plane with canvas texture)
  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(0.7, 0.25),
    new THREE.MeshBasicMaterial({ map: makeTextTexture('FREE', '#111', '#ffe066'), transparent: true }),
  );
  sign.position.set(0, 0.65, 0.0);
  sign.rotation.x = -0.3;
  g.add(box, tape, flap1, flap2, sign);
  return g;
}

function buildTV() {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 1.0, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x16181d, roughness: 0.3, metalness: 0.3 }),
  );
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.28, 0.84),
    new THREE.MeshBasicMaterial({ color: 0x1b4a7e }),
  );
  screen.position.z = 0.095;
  // tiny continents on the screen
  for (let i = 0; i < 5; i++) {
    const land = new THREE.Mesh(
      new THREE.CircleGeometry(0.07 + Math.random() * 0.06, 8),
      new THREE.MeshBasicMaterial({ color: 0x4ea560 }),
    );
    land.position.set((Math.random() - 0.5) * 1.0, (Math.random() - 0.5) * 0.6, 0.1);
    g.add(land);
  }
  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.12, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x16181d }),
  );
  stand.position.y = -0.6;
  g.add(frame, screen, stand);
  return g;
}

function buildSpeakerPin() {
  const g = new THREE.Group();
  const yellow = new THREE.MeshStandardMaterial({ color: 0xffcf4a, roughness: 0.35 });
  const cone = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 0.9, 16, 1, true),
    yellow,
  );
  cone.rotation.z = -Math.PI / 2;
  cone.position.x = 0.22;
  const barrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.35, 12),
    yellow,
  );
  barrel.rotation.z = Math.PI / 2;
  barrel.position.x = -0.35;
  const grip = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.05, 0.4, 8),
    new THREE.MeshStandardMaterial({ color: 0x5a4426, roughness: 0.6 }),
  );
  grip.position.set(-0.3, -0.3, 0);
  // sound arcs
  for (let i = 0; i < 3; i++) {
    const arc = new THREE.Mesh(
      new THREE.TorusGeometry(0.35 + i * 0.22, 0.03, 6, 20, Math.PI / 2.5),
      new THREE.MeshBasicMaterial({ color: 0xffcf4a, transparent: true, opacity: 0.6 - i * 0.17 }),
    );
    arc.position.x = 0.75;
    arc.rotation.z = -Math.PI / 2;
    g.add(arc);
  }
  // Location pin pointing down
  const pin = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.3, 10),
    new THREE.MeshStandardMaterial({ color: 0xe03848 }),
  );
  pin.position.set(0, -0.55, 0);
  pin.rotation.x = Math.PI;
  const pinBall = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xe03848 }),
  );
  pinBall.position.set(0, -0.5, 0);
  g.add(cone, barrel, grip, pin, pinBall);
  return g;
}

function buildCompass() {
  const g = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: 0xd4a054, metalness: 0.8, roughness: 0.3 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.62, 0.14, 32), brass);
  const face = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32),
    new THREE.MeshStandardMaterial({ color: 0xf4e4c2, roughness: 0.5 }),
  );
  face.position.y = 0.08;
  // Compass markings as thin boxes at N/E/S/W
  for (let i = 0; i < 4; i++) {
    const mark = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.015, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x5a3b1a }),
    );
    const a = (i / 4) * Math.PI * 2;
    mark.position.set(Math.cos(a) * 0.45, 0.11, Math.sin(a) * 0.45);
    g.add(mark);
  }
  // Needle - red (N) + white (S)
  const red = new THREE.Mesh(
    new THREE.ConeGeometry(0.07, 0.4, 4),
    new THREE.MeshStandardMaterial({ color: 0xd13040 }),
  );
  red.position.y = 0.12;
  red.rotation.x = -Math.PI / 2;
  red.position.z = -0.2;
  const white = new THREE.Mesh(
    new THREE.ConeGeometry(0.07, 0.4, 4),
    new THREE.MeshStandardMaterial({ color: 0xeaeaea }),
  );
  white.position.y = 0.12;
  white.rotation.x = Math.PI / 2;
  white.position.z = 0.2;
  const cap = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 10, 8),
    brass,
  );
  cap.position.y = 0.13;
  g.add(base, face, red, white, cap);
  return g;
}

function buildGear() {
  const g = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: 0x6a7a8a, metalness: 0.6, roughness: 0.35 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.2, 24), steel);
  body.rotation.x = Math.PI / 2;
  const teeth = 12;
  for (let i = 0; i < teeth; i++) {
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.14, 0.22), steel);
    const a = (i / teeth) * Math.PI * 2;
    t.position.set(Math.cos(a) * 0.62, Math.sin(a) * 0.62, 0);
    t.rotation.z = a;
    g.add(t);
  }
  const hole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.25, 16),
    new THREE.MeshBasicMaterial({ color: 0x0a0a10 }),
  );
  hole.rotation.x = Math.PI / 2;
  // Green checkmark
  const check = new THREE.MeshStandardMaterial({ color: 0x55d070, emissive: 0x55d070, emissiveIntensity: 0.35 });
  const c1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.07), check);
  c1.position.set(-0.08, -0.02, 0.14);
  c1.rotation.z = Math.PI / 4;
  const c2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.38, 0.07), check);
  c2.position.set(0.08, 0.08, 0.14);
  c2.rotation.z = -Math.PI / 4;
  g.add(body, hole, c1, c2);
  return g;
}

function buildContainer() {
  const g = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: 0xc44a3a, roughness: 0.6, flatShading: true });
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.75, 0.65), red);
  g.add(body);
  // Vertical ridges
  const ridge = new THREE.MeshStandardMaterial({ color: 0x8a2a1f });
  for (let i = -6; i <= 6; i++) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.76, 0.66), ridge);
    r.position.x = i * 0.1;
    g.add(r);
  }
  // Top/bottom edges
  const edgeMat = new THREE.MeshStandardMaterial({ color: 0x6a1810 });
  const top = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.06, 0.67), edgeMat);
  top.position.y = 0.38;
  const bot = top.clone();
  bot.position.y = -0.38;
  g.add(top, bot);
  // Corner castings
  for (let xi of [-1, 1]) for (let yi of [-1, 1]) for (let zi of [-1, 1]) {
    const corner = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.08), edgeMat);
    corner.position.set(xi * 0.73, yi * 0.37, zi * 0.32);
    g.add(corner);
  }
  return g;
}

function buildSpool() {
  const g = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0xc89566, roughness: 0.75 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 24), wood);
  top.position.y = 0.42;
  const bottom = top.clone();
  bottom.position.y = -0.42;
  const thread = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.76, 24),
    new THREE.MeshStandardMaterial({ color: 0x5a1a60, roughness: 0.4 }),
  );
  // thread wrap suggestion
  for (let i = 0; i < 6; i++) {
    const wrap = new THREE.Mesh(
      new THREE.TorusGeometry(0.37, 0.012, 4, 24),
      new THREE.MeshStandardMaterial({ color: 0x7a2a80, roughness: 0.4 }),
    );
    wrap.position.y = -0.3 + i * 0.12;
    wrap.rotation.x = Math.PI / 2;
    g.add(wrap);
  }
  const needle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.95, 8),
    new THREE.MeshStandardMaterial({ color: 0xd8dce0, metalness: 0.9, roughness: 0.2 }),
  );
  needle.position.set(0.55, 0, 0);
  needle.rotation.z = Math.PI / 2;
  g.add(top, bottom, thread, needle);
  return g;
}

function buildPillar() {
  const g = new THREE.Group();
  const marble = new THREE.MeshStandardMaterial({ color: 0xeadcc2, roughness: 0.65 });
  const marbleDark = new THREE.MeshStandardMaterial({ color: 0xd8c8a4, roughness: 0.7 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.14, 20), marble);
  base.position.y = -0.55;
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.95, 20), marble);
  for (let i = 0; i < 10; i++) {
    const flute = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 0.93, 6),
      marbleDark,
    );
    const a = (i / 10) * Math.PI * 2;
    flute.position.set(Math.cos(a) * 0.4, 0, Math.sin(a) * 0.4);
    g.add(flute);
  }
  const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.4, 0.14, 20), marble);
  capital.position.y = 0.55;
  const abacus = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 1.1), marble);
  abacus.position.y = 0.66;
  g.add(base, shaft, capital, abacus);
  return g;
}

/* Canvas text texture for the FREE sign */
function makeTextTexture(text, color, bg) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 96;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = color;
  ctx.font = 'bold 68px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, c.width / 2, c.height / 2 + 4);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
