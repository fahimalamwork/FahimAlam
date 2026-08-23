import * as THREE from 'three';

const canvas = document.getElementById('scene');
if (canvas) init(canvas);

function init(canvas) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loadingEl = document.getElementById('loading');

  const PHOTOS = [
    { id: 1015, pos: [-4.5, 3.2, 16] },
    { id: 1018, pos: [-9.5, 6.5, 11] },
    { id: 1036, pos: [-6.5, 10.5, 5] },
    { id: 1043, pos: [1.5, 13.5, 4.5] },
    { id: 1019, pos: [7.5, 15.5, 1] },
    { id: 1049, pos: [9.5, 18.5, -3] },
    { id: 1069, pos: [4.5, 20.5, -3] },
  ];

  // 9 keyframes aligned to 9 chapters (each 100vh) at scroll t = i/8.
  const CAM_KEYFRAMES = [
    { t: 0/8, pos: [0, 4, 30],    look: [0, 8, 0] },      // Base camp
    { t: 1/8, pos: [-7, 5, 22],   look: [-4, 7, 0] },     // Photo 1
    { t: 2/8, pos: [-13, 8.5, 14], look: [-4, 10, 0] },   // Photo 2
    { t: 3/8, pos: [-9, 12.5, 8], look: [-1, 12, 0] },    // Photo 3
    { t: 4/8, pos: [0, 15.5, 8],  look: [0, 15, 0] },     // Photo 4
    { t: 5/8, pos: [10, 17.5, 5], look: [4, 17, 0] },     // Photo 5
    { t: 6/8, pos: [13, 20, -1],  look: [5, 20, 0] },     // Photo 6
    { t: 7/8, pos: [7, 22.5, -5], look: [0, 22, -2] },    // Photo 7
    { t: 8/8, pos: [0, 26, 4],    look: [0, 20, -10] },   // Summit
  ];

  const SUN_COLOR    = new THREE.Color(0xffd9a8);
  const SKY_TOP      = new THREE.Color(0x2c3e6b);
  const SKY_BOTTOM   = new THREE.Color(0xf5a578);
  const FOG_COLOR    = new THREE.Color(0xe8b48a);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: window.devicePixelRatio < 2,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(FOG_COLOR, 25, 90);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 250);
  camera.position.set(0, 4, 30);
  camera.lookAt(0, 8, 0);

  // Sky
  scene.add(buildSky(SKY_TOP, SKY_BOTTOM));

  // Lights
  scene.add(new THREE.HemisphereLight(0xe8f0ff, 0x3e2a1a, 0.55));
  const sun = new THREE.DirectionalLight(SUN_COLOR, 1.7);
  sun.position.set(-25, 30, -15);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0x9bb8ff, 0.4);
  rim.position.set(15, 6, 22);
  scene.add(rim);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240, 40, 40),
    new THREE.MeshStandardMaterial({ color: 0x3d5c3f, roughness: 1, flatShading: true }),
  );
  jitterPlane(ground.geometry, 0.35);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.5;
  scene.add(ground);

  // Main mountain — 6-sided low-poly peak
  scene.add(buildMainMountain());

  // Background mountains
  buildBackgroundMountains().forEach(m => scene.add(m));

  // Clouds
  const clouds = buildClouds();
  clouds.forEach(c => scene.add(c));

  const postcards = [];
  let texturesLoaded = 0;
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  PHOTOS.forEach((photo, i) => {
    const url = `https://picsum.photos/id/${photo.id}/800/600`;
    loader.load(
      url,
      tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const pc = buildPostcard(tex, photo.pos, i);
        pc.userData = { basePos: photo.pos.slice(), phase: i * 0.7, index: i };
        scene.add(pc.card);
        scene.add(pc.stake);
        postcards.push(pc.card);
        onTextureLoad();
      },
      undefined,
      () => onTextureLoad(),
    );
  });

  function onTextureLoad() {
    texturesLoaded++;
    if (loadingEl) {
      const pct = Math.round((texturesLoaded / PHOTOS.length) * 100);
      loadingEl.querySelector('.loading-bar')?.style.setProperty('--pct', pct + '%');
      loadingEl.querySelector('.loading-pct').textContent = pct + '%';
    }
    if (texturesLoaded >= PHOTOS.length) {
      requestAnimationFrame(() => {
        canvas.classList.add('ready');
        document.body.classList.add('scene-ready');
        if (loadingEl) loadingEl.classList.add('done');
      });
    }
  }

  // If images take too long, reveal anyway.
  setTimeout(() => {
    if (!canvas.classList.contains('ready')) {
      canvas.classList.add('ready');
      document.body.classList.add('scene-ready');
      if (loadingEl) loadingEl.classList.add('done');
    }
  }, 4000);

  function updateCamera() {
    const scrollY = window.scrollY || 0;
    const maxScroll = Math.max(1, document.body.scrollHeight - window.innerHeight);
    const t = clamp(scrollY / maxScroll, 0, 1);
    let a = CAM_KEYFRAMES[0], b = CAM_KEYFRAMES[CAM_KEYFRAMES.length - 1];
    for (let i = 0; i < CAM_KEYFRAMES.length - 1; i++) {
      if (t >= CAM_KEYFRAMES[i].t && t <= CAM_KEYFRAMES[i + 1].t) {
        a = CAM_KEYFRAMES[i];
        b = CAM_KEYFRAMES[i + 1];
        break;
      }
    }
    const local = (t - a.t) / Math.max(0.0001, b.t - a.t);
    const eased = smoothstep(local);
    camera.position.set(
      lerp(a.pos[0], b.pos[0], eased),
      lerp(a.pos[1], b.pos[1], eased),
      lerp(a.pos[2], b.pos[2], eased),
    );
    camera.lookAt(
      lerp(a.look[0], b.look[0], eased),
      lerp(a.look[1], b.look[1], eased),
      lerp(a.look[2], b.look[2], eased),
    );
  }

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('scroll', updateCamera, { passive: true });
  updateCamera();
  renderer.render(scene, camera);

  const clock = new THREE.Clock();
  let running = true;
  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      postcards.forEach(pc => {
        pc.position.y = pc.userData.basePos[1] + Math.sin(t + pc.userData.phase) * 0.08;
        pc.rotation.z = pc.userData.baseRotZ + Math.sin(t * 0.7 + pc.userData.phase) * 0.02;
      });
      clouds.forEach((c, i) => {
        c.position.x = c.userData.baseX + Math.sin(t * 0.06 + i) * 6;
        c.rotation.y = t * 0.02 + i;
      });
    }
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; }
    else if (!running) { running = true; clock.getDelta(); requestAnimationFrame(tick); }
  });
  if (reduceMotion) {
    renderer.render(scene, camera);
  } else {
    tick();
  }
}

function buildSky(top, bottom) {
  const geo = new THREE.SphereGeometry(180, 32, 15);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      topColor:    { value: top },
      bottomColor: { value: bottom },
      offset:      { value: 20 },
      exponent:    { value: 0.7 },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPosition;
      }`,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 bottomColor;
      uniform float offset;
      uniform float exponent;
      varying vec3 vWorldPosition;
      void main() {
        float h = normalize(vWorldPosition + vec3(0.0, offset, 0.0)).y;
        gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
      }`,
    side: THREE.BackSide,
    depthWrite: false,
  });
  return new THREE.Mesh(geo, mat);
}

function buildMainMountain() {
  const geo = new THREE.ConeGeometry(13, 26, 6, 3);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    if (y > 12) continue;
    pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 1.4);
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 1.4);
    pos.setY(i, y + (Math.random() - 0.5) * 0.8);
  }
  geo.computeVertexNormals();

  const low  = new THREE.Color(0x4a6b48);
  const mid  = new THREE.Color(0x6b5b47);
  const high = new THREE.Color(0xf7f9fc);
  const colors = [];
  for (let i = 0; i < pos.count; i++) {
    const worldY = pos.getY(i) + 10.5;
    let c;
    if (worldY > 16)        c = high.clone();
    else if (worldY > 8)    c = mid.clone().lerp(high, (worldY - 8) / 8);
    else                    c = low.clone().lerp(mid, Math.max(0, worldY) / 8);
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    flatShading: true,
    roughness: 0.85,
    metalness: 0.03,
  });
  const m = new THREE.Mesh(geo, mat);
  m.position.set(0, 10.5, 0);
  return m;
}

function buildBackgroundMountains() {
  const specs = [
    { x: -30, z: -22, r: 9,  h: 15, c: 0x5d6c7c },
    { x:  28, z: -28, r: 11, h: 20, c: 0x4b5867 },
    { x: -20, z: -40, r: 7,  h: 12, c: 0x6a7887 },
    { x:  42, z: -18, r: 8,  h: 13, c: 0x5a6674 },
    { x: -48, z: -12, r: 10, h: 16, c: 0x475262 },
    { x:  20, z: -50, r: 12, h: 22, c: 0x3d4655 },
  ];
  return specs.map(p => {
    const geo = new THREE.ConeGeometry(p.r, p.h, 6);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > p.h / 2 - 0.5) continue;
      pos.setX(i, pos.getX(i) + (Math.random() - 0.5) * 1.2);
      pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * 1.2);
    }
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ color: p.c, flatShading: true, roughness: 0.95 });
    const m = new THREE.Mesh(geo, mat);
    m.position.set(p.x, p.h / 2 - 0.5, p.z);
    return m;
  });
}

function buildClouds() {
  const clouds = [];
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, depthWrite: false });
  for (let i = 0; i < 6; i++) {
    const g = new THREE.Group();
    const puffs = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < puffs; j++) {
      const puff = new THREE.Mesh(
        new THREE.SphereGeometry(1.4 + Math.random() * 1.6, 8, 6),
        mat,
      );
      puff.position.set(j * 1.7 + (Math.random() - 0.5), (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6);
      g.add(puff);
    }
    const x = (Math.random() - 0.5) * 60;
    const y = 8 + Math.random() * 18;
    const z = -8 - Math.random() * 30;
    g.position.set(x, y, z);
    g.scale.setScalar(0.8 + Math.random() * 0.5);
    g.userData = { baseX: x };
    clouds.push(g);
  }
  return clouds;
}

function buildPostcard(tex, pos, index) {
  const cardGeo = new THREE.PlaneGeometry(3.2, 2.4);
  const cardMat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
  const card = new THREE.Mesh(cardGeo, cardMat);
  card.position.fromArray(pos);
  card.rotation.set(0, (index % 2 === 0 ? 1 : -1) * (0.15 + Math.random() * 0.2), (Math.random() - 0.5) * 0.15);
  card.userData = { basePos: pos.slice(), phase: index * 0.7, baseRotZ: card.rotation.z };

  const stakeGeo = new THREE.CylinderGeometry(0.06, 0.06, 2, 6);
  const stakeMat = new THREE.MeshStandardMaterial({ color: 0x5a3d20, roughness: 1 });
  const stake = new THREE.Mesh(stakeGeo, stakeMat);
  stake.position.set(pos[0], pos[1] - 1.6, pos[2]);

  return { card, stake };
}

function jitterPlane(geo, amount) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) + (Math.random() - 0.5) * amount);
  }
  geo.computeVertexNormals();
}

function lerp(a, b, t) { return a + (b - a) * t; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function smoothstep(t) { return t * t * (3 - 2 * t); }
