(function () {
  'use strict';

  var video = document.getElementById('hero-video');
  if (!video) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    // Reduced motion gets the poster image via CSS fallback; nothing to drive.
    return;
  }

  // Needed for scrubbing to work smoothly across browsers.
  video.muted = true;
  video.playsInline = true;
  try { video.setAttribute('playsinline', ''); } catch (e) {}
  try { video.setAttribute('webkit-playsinline', ''); } catch (e) {}
  video.pause();

  var scrollableRange = 0;
  var targetTime = 0;
  var currentTime = 0;
  var revealed = false;
  var rafId = 0;

  function measure() {
    scrollableRange = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function updateTarget() {
    var progress = window.scrollY / scrollableRange;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    var dur = video.duration;
    if (!isFinite(dur) || dur <= 0) return;
    // Hold back a tiny bit from the exact end so the frame doesn't go blank.
    targetTime = progress * (dur - 0.05);
  }

  function tick() {
    rafId = 0;
    // Ease toward the scroll target for buttery scrubbing even over janky scroll.
    currentTime += (targetTime - currentTime) * 0.18;
    if (video.readyState >= 2 && Math.abs(video.currentTime - currentTime) > 0.03) {
      try { video.currentTime = currentTime; } catch (e) {}
    }
    if (Math.abs(targetTime - currentTime) > 0.001) {
      rafId = requestAnimationFrame(tick);
    }
  }

  function kickTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    updateTarget();
    kickTick();
  }

  function reveal() {
    if (revealed) return;
    revealed = true;
    video.classList.add('ready');
  }

  function onMeta() {
    measure();
    updateTarget();
    currentTime = targetTime;
    try { video.currentTime = targetTime; } catch (e) {}
    reveal();
    kickTick();
  }

  video.addEventListener('loadedmetadata', onMeta);
  video.addEventListener('loadeddata', reveal);
  // In case the metadata fired before this script attached (cached).
  if (video.readyState >= 1) onMeta();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measure(); updateTarget(); kickTick(); });
  // Safety: if the video truly can't load (CORS, 404), fall back to the poster via CSS.
  video.addEventListener('error', function () { video.style.display = 'none'; });

  // Nudge once in case we're already partway down the page on reload.
  requestAnimationFrame(function () { onScroll(); });
})();
