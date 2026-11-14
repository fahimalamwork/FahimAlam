// ganjaam.com — mobile menu, experience expand/collapse, and the small amount of motion.
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('nav');
  if (menuBtn && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  }

  // Experience: expand / collapse all
  const toggle = document.querySelector('.expand-all');
  const groups = [...document.querySelectorAll('#experience details.group')];
  if (toggle && groups.length) {
    const sync = () => {
      const allOpen = groups.every((g) => g.open);
      toggle.textContent = allOpen ? 'Collapse all −' : 'Expand all +';
      toggle.setAttribute('aria-pressed', String(allOpen));
    };
    toggle.addEventListener('click', () => {
      const open = !groups.every((g) => g.open);
      groups.forEach((g) => { g.open = open; });
      sync();
    });
    groups.forEach((g) => g.addEventListener('toggle', sync));
    sync();
  }

  // Section rules draw in on first view
  const sections = document.querySelectorAll('.section');
  if (reduce || !('IntersectionObserver' in window)) {
    sections.forEach((s) => s.classList.add('is-seen'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-seen'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // Manifest counts up once
  const manifest = document.querySelector('.manifest');
  if (manifest) {
    const counters = [...manifest.querySelectorAll('[data-count]')];
    const fmt = (el, v) => {
      const d = Number(el.dataset.decimals || 0);
      el.textContent = v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    };
    if (reduce) {
      manifest.classList.add('is-run');
    } else {
      counters.forEach((el) => fmt(el, 0));
      requestAnimationFrame(() => {
        manifest.classList.add('is-run');
        const start = performance.now();
        const dur = 900;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const k = 1 - Math.pow(1 - t, 3);
          counters.forEach((el) => fmt(el, Number(el.dataset.count) * k));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  }
})();
