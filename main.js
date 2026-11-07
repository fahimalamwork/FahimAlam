(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var base = document.body.getAttribute('data-root') || '';

  /* ---------- Theme toggle ---------- */
  function currentTheme() {
    var set = root.getAttribute('data-theme');
    if (set) return set;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemeMeta() {
    var dark = currentTheme() === 'dark';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
      m.setAttribute('content', dark ? '#0b0b0d' : '#f5f3ee');
    });
    document.querySelectorAll('.theme-toggle').forEach(function (b) {
      b.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
  document.querySelectorAll('.theme-toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      syncThemeMeta();
    });
  });
  if (root.getAttribute('data-theme')) syncThemeMeta();

  /* ---------- Header border on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Year + local clock ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  var clock = document.querySelector('[data-clock]');
  if (clock) {
    var fmt;
    try {
      fmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/New_York' });
    } catch (e) { fmt = null; }
    var tick = function () { if (fmt) clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 20000);
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll('.reveal, .tile-term');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Hero video: only when visible, never with reduced motion / data saver ---------- */
  var video = document.querySelector('.hero-video');
  var saveData = navigator.connection && navigator.connection.saveData;
  if (video && !reduceMotion && !saveData) {
    video.preload = 'auto';
    video.addEventListener('playing', function () {
      var poster = document.querySelector('.hero-poster');
      if (poster) poster.style.opacity = '0';
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = video.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            video.pause();
          }
        });
      }).observe(video);
    } else {
      video.play();
    }
  } else if (video) {
    video.remove();
  }

  /* ---------- Real screenshots, when captured (see tools/capture-screenshots.mjs) ---------- */
  var shotSlots = document.querySelectorAll('[data-shot]');
  if (shotSlots.length && window.fetch && location.protocol !== 'file:') {
    fetch(base + 'assets/shots/manifest.json', { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (manifest) {
        shotSlots.forEach(function (slot) {
          var file = manifest[slot.getAttribute('data-shot')];
          if (!file) return;
          var img = new Image();
          img.className = 'shot';
          img.alt = '';
          img.loading = 'lazy';
          img.decoding = 'async';
          img.onload = function () { slot.insertBefore(img, slot.firstChild.nextSibling); };
          img.src = base + 'assets/shots/' + file;
        });
      })
      .catch(function () {});
  }
})();
