(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;

  document.getElementById('year').textContent = new Date().getFullYear();

  initReveal();
  if (isFinePointer && !reduceMotion) initCardTilt();
  initTerminalTyping();

  function initReveal() {
    var targets = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) return;

    targets.forEach(function (el) { el.classList.add('reveal-pre'); });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pre');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
    targets.forEach(function (el) { io.observe(el); });

    // Safety net: no matter what, all sections are visible within 2.5s.
    setTimeout(function () {
      document.querySelectorAll('.reveal.reveal-pre').forEach(function (el) {
        el.classList.remove('reveal-pre');
      });
    }, 2500);
  }

  function initCardTilt() {
    var cards = document.querySelectorAll('.project-card:not(.project-card-wide)');
    cards.forEach(function (card) {
      var rafId = 0;
      var pendingX = 0, pendingY = 0;

      card.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        if (card.querySelector('details[open]')) {
          resetTilt();
          return;
        }
        var rect = card.getBoundingClientRect();
        pendingX = (e.clientX - rect.left) / rect.width - 0.5;
        pendingY = (e.clientY - rect.top) / rect.height - 0.5;
        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('pointerleave', resetTilt);

      function applyTilt() {
        rafId = 0;
        var rx = (-pendingY * 5).toFixed(2);
        var ry = (pendingX * 7).toFixed(2);
        card.style.transform =
          'perspective(900px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateY(-3px)';
      }

      function resetTilt() {
        if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
        card.style.transform = '';
      }
    });
  }

  function initTerminalTyping() {
    document.querySelectorAll('.project-sample').forEach(function (details) {
      var terminals = details.querySelectorAll('.code-block.terminal pre');
      if (!terminals.length) return;

      terminals.forEach(prepareTerminal);

      details.addEventListener('toggle', function () {
        if (!details.open) return;
        terminals.forEach(function (pre) {
          if (pre.dataset.typed === 'true') return;
          if (reduceMotion) {
            restoreTerminal(pre);
            pre.dataset.typed = 'true';
            return;
          }
          typeTerminal(pre);
        });
      });

      if (details.open) {
        terminals.forEach(function (pre) {
          if (pre.dataset.typed === 'true') return;
          if (reduceMotion) {
            restoreTerminal(pre);
            pre.dataset.typed = 'true';
          } else {
            typeTerminal(pre);
          }
        });
      }
    });
  }

  function collectTextNodes(root) {
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      nodes.push({ node: node, text: node.nodeValue });
    }
    return nodes;
  }

  function prepareTerminal(pre) {
    if (pre.dataset.prepared === 'true') return;
    var nodes = collectTextNodes(pre);
    pre.__originalNodes = nodes;
    pre.dataset.prepared = 'true';
    // Blank the content so it doesn't flash before typing kicks in.
    nodes.forEach(function (entry) { entry.node.nodeValue = ''; });
    // A blinking caret while empty gives the terminal life before opening.
    ensureCaret(pre);
  }

  function restoreTerminal(pre) {
    if (!pre.__originalNodes) return;
    pre.__originalNodes.forEach(function (entry) { entry.node.nodeValue = entry.text; });
    removeCaret(pre);
  }

  function ensureCaret(pre) {
    if (pre.querySelector('.term-caret')) return;
    var caret = document.createElement('span');
    caret.className = 'term-caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.textContent = '█';
    pre.appendChild(caret);
  }

  function removeCaret(pre) {
    var caret = pre.querySelector('.term-caret');
    if (caret) caret.remove();
  }

  function typeTerminal(pre) {
    var entries = pre.__originalNodes;
    if (!entries || !entries.length) return;
    var totalChars = entries.reduce(function (s, e) { return s + e.text.length; }, 0);
    var start = performance.now();
    var charsPerSecond = 320;
    var minDurationMs = 900;
    var maxDurationMs = 2600;
    var durationMs = Math.min(maxDurationMs, Math.max(minDurationMs, (totalChars / charsPerSecond) * 1000));

    var nodeIdx = 0;
    var posInNode = 0;
    var done = false;

    ensureCaret(pre);

    function finish() {
      if (done) return;
      done = true;
      entries.forEach(function (entry) { entry.node.nodeValue = entry.text; });
      pre.dataset.typed = 'true';
      setTimeout(function () { removeCaret(pre); }, 900);
    }

    function tick(now) {
      if (done) return;
      var elapsed = now - start;
      var progress = Math.min(1, elapsed / durationMs);
      var eased = 1 - (1 - progress) * (1 - progress);
      var target = Math.floor(eased * totalChars);
      var written = 0;
      for (var i = 0; i < nodeIdx; i++) written += entries[i].text.length;
      written += posInNode;
      while (written < target && nodeIdx < entries.length) {
        var cur = entries[nodeIdx];
        var need = target - written;
        var remaining = cur.text.length - posInNode;
        var take = Math.min(need, remaining);
        posInNode += take;
        written += take;
        cur.node.nodeValue = cur.text.slice(0, posInNode);
        if (posInNode >= cur.text.length) {
          nodeIdx++;
          posInNode = 0;
        }
      }
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        finish();
      }
    }
    requestAnimationFrame(tick);
    // Safety net: if rAF is throttled (background tab, hidden window),
    // dump the rest of the text so the reader never sees a stuck terminal.
    setTimeout(finish, durationMs + 800);
  }
})();
