import * as THREE from 'three';

const canvas = document.getElementById('hero-scene');
if (canvas) init(canvas);

function init(canvas) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const container = canvas.parentElement;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: window.devicePixelRatio < 2,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 5.4, 11);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, isDark ? 0.55 : 0.8));
  const key = new THREE.DirectionalLight(0xffffff, isDark ? 1.1 : 1.0);
  key.position.set(5, 8, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(isDark ? 0x93c5fd : 0x1e3a8a, 0.4);
  rim.position.set(-6, 4, -4);
  scene.add(rim);

  const COLORS = {
    pass:  new THREE.Color('#4ade80'),
    flake: new THREE.Color('#fbbf24'),
    fail:  new THREE.Color('#f87171'),
  };
  const EMISSIVE = {
    pass:  new THREE.Color('#0d3d1f'),
    flake: new THREE.Color('#4a2a04'),
    fail:  new THREE.Color('#5a0f10'),
  };

  const GRID = 11;
  const SPACING = 0.82;
  const geometry = new THREE.BoxGeometry(0.46, 0.46, 0.46);
  const group = new THREE.Group();
  const cubes = [];

  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const x = (i - (GRID - 1) / 2) * SPACING;
      const z = (j - (GRID - 1) / 2) * SPACING;
      // 6% flake, 94% pass at baseline. No permanent reds — failures are transient.
      const state = Math.random() < 0.06 ? 'flake' : 'pass';
      const mat = new THREE.MeshStandardMaterial({
        color: COLORS[state].clone(),
        emissive: EMISSIVE[state].clone(),
        emissiveIntensity: 0.6,
        roughness: 0.45,
        metalness: 0.15,
      });
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.set(x, 0, z);
      cubes.push({
        mesh: mesh,
        baseX: x,
        baseZ: z,
        phase: (i + j) * 0.35 + Math.random() * 0.5,
        state: state,
        failUntil: 0,
      });
      group.add(mesh);
    }
  }
  group.rotation.x = -0.15;
  scene.add(group);

  // Mouse parallax targets.
  let targetRotY = 0;
  let targetRotX = -0.15;
  const heroEl = container;

  heroEl.addEventListener('pointermove', function (e) {
    const rect = heroEl.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotY = nx * 0.35;
    targetRotX = -0.15 + ny * 0.18;
  }, { passive: true });

  heroEl.addEventListener('pointerleave', function () {
    targetRotY = 0;
    targetRotX = -0.15;
  });

  // Handle sizing off the container so the canvas fills the hero exactly.
  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  // Trigger a random cube to "fail" and recover on a loose cadence.
  let lastFailAt = 0;
  function scheduleFail(now) {
    if (now - lastFailAt < 1400 + Math.random() * 1600) return;
    lastFailAt = now;
    const cube = cubes[Math.floor(Math.random() * cubes.length)];
    if (cube.state === 'fail') return;
    setCubeState(cube, 'fail');
    cube.failUntil = now + 700 + Math.random() * 500;
  }

  function setCubeState(cube, state) {
    cube.state = state;
    cube.mesh.material.color.copy(COLORS[state]);
    cube.mesh.material.emissive.copy(EMISSIVE[state]);
    cube.mesh.material.emissiveIntensity = state === 'fail' ? 1.2 : 0.6;
  }

  // Auto-recover cubes that finished their fail window.
  function updateFailures(now) {
    for (let k = 0; k < cubes.length; k++) {
      const c = cubes[k];
      if (c.state === 'fail' && now >= c.failUntil) {
        setCubeState(c, Math.random() < 0.15 ? 'flake' : 'pass');
      }
    }
  }

  // Slowly heal flakes over time.
  let lastHealAt = 0;
  function healFlakes(now) {
    if (now - lastHealAt < 4000) return;
    lastHealAt = now;
    for (let k = 0; k < cubes.length; k++) {
      const c = cubes[k];
      if (c.state === 'flake' && Math.random() < 0.25) setCubeState(c, 'pass');
    }
  }

  const clock = new THREE.Clock();
  let running = true;

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();
    const now = performance.now();

    // Gentle wave.
    for (let k = 0; k < cubes.length; k++) {
      const c = cubes[k];
      const wave = Math.sin(t * 1.3 + c.phase) * 0.18;
      c.mesh.position.y = wave;
      c.mesh.rotation.x = wave * 0.4;
      c.mesh.rotation.y = t * 0.15 + c.phase;
    }

    // Ease group rotation toward mouse-driven target.
    group.rotation.y += (targetRotY + t * 0.05 - group.rotation.y) * 0.04;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.06;

    scheduleFail(now);
    updateFailures(now);
    healFlakes(now);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  // Reveal the canvas smoothly once ready.
  // Force a first paint synchronously so the fade-in starts even if rAF is throttled.
  renderer.render(scene, camera);
  canvas.classList.add('ready');

  if (reduceMotion) {
    // Single-frame render, no loop.
    for (let k = 0; k < cubes.length; k++) {
      cubes[k].mesh.position.y = 0;
    }
    renderer.render(scene, camera);
    return;
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      running = false;
    } else if (!running) {
      running = true;
      clock.getDelta();
      requestAnimationFrame(tick);
    }
  });

  requestAnimationFrame(tick);
}
