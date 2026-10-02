(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SECTIONS = ['hero', 'about', 'skills', 'experience', 'projects', 'contact'];
  var videos = {};
  var sectionEls = {};
  var activeId = 'hero';
  var rafId = 0;
  var targetTime = 0;

  SECTIONS.forEach(function (id) {
    var vid = document.querySelector('.page-video[data-section="' + id + '"]');
    var sec = document.getElementById(id);
    if (!vid || !sec) return;
    try { vid.muted = true; } catch (e) {}
    try { vid.playsInline = true; vid.setAttribute('playsinline', ''); } catch (e) {}
    vid.pause();
    videos[id] = { el: vid, ready: false, failed: false, duration: 0, lastT: 0 };
    sectionEls[id] = sec;

    vid.addEventListener('loadedmetadata', function () {
      videos[id].ready = true;
      videos[id].duration = vid.duration;
      kick();
    });
    vid.addEventListener('loadeddata', function () {
      videos[id].ready = true;
      kick();
    });
    vid.addEventListener('error', function () {
      videos[id].failed = true;
      vid.classList.add('failed');
    });
    // In case already cached when we attach
    if (vid.readyState >= 1) {
      videos[id].ready = true;
      videos[id].duration = vid.duration || 0;
    }
  });

  if (reduceMotion) return;

  function pickActive() {
    // The most-recently-crossed section wins. This correctly handles short
    // last sections (contact) that would otherwise never contain the viewport
    // midpoint since you can't scroll past them.
    var mid = window.scrollY + window.innerHeight * 0.5;
    var found = 'hero';
    var bestTop = -Infinity;
    for (var i = 0; i < SECTIONS.length; i++) {
      var id = SECTIONS[i];
      var sec = sectionEls[id];
      if (!sec) continue;
      if (sec.offsetTop <= mid && sec.offsetTop > bestTop) {
        bestTop = sec.offsetTop;
        found = id;
      }
    }
    if (videos[found] && videos[found].ready && !videos[found].failed) return found;
    return (videos.hero && videos.hero.ready && !videos.hero.failed) ? 'hero' : found;
  }

  function currentSectionId() {
    var mid = window.scrollY + window.innerHeight * 0.5;
    var found = 'hero';
    var bestTop = -Infinity;
    for (var i = 0; i < SECTIONS.length; i++) {
      var id = SECTIONS[i];
      var sec = sectionEls[id];
      if (!sec) continue;
      if (sec.offsetTop <= mid && sec.offsetTop > bestTop) {
        bestTop = sec.offsetTop;
        found = id;
      }
    }
    return found;
  }

  function sectionProgress(id) {
    var sec = sectionEls[id];
    if (!sec) return 0;
    var vh = window.innerHeight;
    var top = sec.offsetTop;
    var h = sec.offsetHeight;
    // Hero scrubs from the moment the page is at the top (progress 0 at scrollY 0).
    // Later sections scrub from the moment their top reaches the top of the viewport.
    var start = (id === 'hero') ? 0 : top;
    var end = top + h;
    var range = Math.max(1, end - start);
    var p = (window.scrollY - start) / range;
    if (p < 0) p = 0;
    if (p > 1) p = 1;
    return p;
  }

  function updateTarget() {
    var next = pickActive();
    activeId = next;

    // Cross-fade: only the active video has `is-active`
    for (var i = 0; i < SECTIONS.length; i++) {
      var id = SECTIONS[i];
      if (!videos[id]) continue;
      var shouldBeActive = (id === activeId);
      var hasClass = videos[id].el.classList.contains('is-active');
      if (shouldBeActive !== hasClass) {
        videos[id].el.classList.toggle('is-active', shouldBeActive);
      }
    }

    var v = videos[activeId];
    if (!v || !v.ready) return;

    // Which section drives the scrub?
    // If the active video is a section-specific one, use that section's local progress.
    // If we fell back to hero mid-page, scrub hero across the overall page progress
    // so the alpine still drifts forward through the whole site.
    var p;
    var currentSid = currentSectionId();
    if (activeId === 'hero' && currentSid !== 'hero') {
      // whole-page fallback for hero
      var full = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      p = Math.max(0, Math.min(1, window.scrollY / full));
    } else {
      p = sectionProgress(activeId);
    }
    var dur = v.duration;
    if (!isFinite(dur) || dur <= 0) return;
    targetTime = p * (dur - 0.05);
  }

  function tick() {
    rafId = 0;
    var v = videos[activeId];
    if (!v || !v.ready) return;
    v.lastT += (targetTime - v.lastT) * 0.2;
    if (v.el.readyState >= 2 && Math.abs(v.el.currentTime - v.lastT) > 0.03) {
      try { v.el.currentTime = v.lastT; } catch (e) {}
    }
    if (Math.abs(targetTime - v.lastT) > 0.001) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function kick() {
    updateTarget();
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick);
  requestAnimationFrame(kick);
})();
