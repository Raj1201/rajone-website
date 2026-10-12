(function () {
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var film = document.getElementById('film');
  var bar = document.querySelector('.progress');
  var glow = document.querySelector('.atmos__glow');
  var grid = document.querySelector('.atmos__grid');
  var small = window.matchMedia('(max-width: 768px)');

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function smooth(e0, e1, v) { var t = clamp((v - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function mix(a, b, k) { return a + (b - a) * k; }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  // 0 when the element's top enters at the bottom of the viewport, 1 when its bottom leaves the top.
  function sceneProgress(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    return clamp((vh - r.top) / (vh + r.height), 0, 1);
  }

  // 0..1 while a tall section is pinned; falls back to enter/leave progress when it isn't.
  function pinProgress(el) {
    var range = el.offsetHeight - window.innerHeight;
    if (range < window.innerHeight * 0.2) return sceneProgress(el);
    return clamp(-el.getBoundingClientRect().top / range, 0, 1);
  }

  function chrome() {
    if (header && film) {
      header.classList.toggle('is-solid', window.scrollY > film.offsetTop + film.offsetHeight - window.innerHeight * 0.5);
    }
    if (bar) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0).toFixed(4) + ')';
    }
  }

  // Atmosphere: each section names a tone; glows blend as you scroll between them.
  var TONES = {
    amber: [[150, 82, 30, 0.59], [12, 40, 96, 0.53]],
    gold: [[160, 118, 48, 0.50], [70, 24, 44, 0.59]],
    umber: [[120, 72, 40, 0.56], [16, 52, 78, 0.50]],
    navy: [[14, 48, 110, 0.64], [140, 84, 34, 0.42]],
    rose: [[120, 58, 46, 0.59], [86, 30, 60, 0.56]],
    dusk: [[16, 60, 140, 0.67], [150, 66, 44, 0.53]],
    teal: [[8, 84, 104, 0.62], [140, 90, 40, 0.42]],
    ember: [[170, 96, 40, 0.68], [60, 22, 40, 0.59]]
  };
  var toned = $$('[data-tone]');

  function rgba(c) { return 'rgba(' + Math.round(c[0]) + ',' + Math.round(c[1]) + ',' + Math.round(c[2]) + ',' + c[3].toFixed(3) + ')'; }
  function mixColor(a, b, k) { return [mix(a[0], b[0], k), mix(a[1], b[1], k), mix(a[2], b[2], k), mix(a[3], b[3], k)]; }

  function atmosphere() {
    if (!glow) return;
    var mid = window.innerHeight / 2;
    var cur = null, next = null, k = 0;
    for (var i = 0; i < toned.length; i++) {
      var r = toned[i].getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) {
        cur = toned[i];
        next = toned[i + 1] || null;
        k = smooth(0.7, 1, (mid - r.top) / r.height);
        break;
      }
    }
    var a = TONES[(cur && cur.getAttribute('data-tone')) || 'amber'];
    var b = next ? TONES[next.getAttribute('data-tone')] : a;
    glow.style.setProperty('--g1', rgba(mixColor(a[0], b[0], k)));
    glow.style.setProperty('--g2', rgba(mixColor(a[1], b[1], k)));
    var t = window.scrollY / window.innerHeight;
    glow.style.setProperty('--gx1', (18 + Math.sin(t * 0.7) * 10).toFixed(1) + '%');
    glow.style.setProperty('--gy1', (30 + Math.cos(t * 0.5) * 12).toFixed(1) + '%');
    glow.style.setProperty('--gx2', (82 + Math.cos(t * 0.6) * 10).toFixed(1) + '%');
    glow.style.setProperty('--gy2', (72 + Math.sin(t * 0.45) * 12).toFixed(1) + '%');
    if (grid) grid.style.backgroundPosition = '0 ' + (-window.scrollY * 0.06).toFixed(1) + 'px';
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var still = function () { chrome(); atmosphere(); };
    window.addEventListener('scroll', still, { passive: true });
    still();
    return;
  }

  root.classList.add('js-motion');

  // Split headlines into words (the wordmark into letters) so they can rise in sequence.
  $$('[data-split]').forEach(function (el) {
    var text = el.textContent.trim();
    var parts = el.classList.contains('wordmark') ? text.split('') : text.split(/\s+/);
    el.setAttribute('aria-label', text);
    el.innerHTML = parts.map(function (w, i) {
      var safe = w.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + safe + '</span></span>';
    }).join(el.classList.contains('wordmark') ? '' : ' ');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  $$('[data-reveal], [data-split]').forEach(function (el) { io.observe(el); });

  // Pointer tilt for framed images (fine pointers only).
  var tilts = [];
  if (window.matchMedia('(pointer: fine)').matches) {
    $$('[data-tilt]').forEach(function (el) {
      var t = { el: el, x: 0, y: 0, tx: 0, ty: 0 };
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        t.ty = ((e.clientX - r.left) / r.width - 0.5) * 12;
        t.tx = -((e.clientY - r.top) / r.height - 0.5) * 9;
      });
      el.addEventListener('pointerleave', function () { t.tx = 0; t.ty = 0; });
      tilts.push(t);
    });
  }
  var TILT = ' rotateX(var(--tx, 0deg)) rotateY(var(--ty, 0deg))';

  function countTo(el, target) {
    var from = Math.round(target * 0.72), start = performance.now();
    (function step(now) {
      var k = clamp((now - start) / 700, 0, 1);
      var v = mix(from, target, 1 - Math.pow(1 - k, 3));
      el.textContent = Math.round(v).toLocaleString('en-US');
      if (k < 1) requestAnimationFrame(step);
    })(start);
  }

  // ---- Scenes ----
  var tower = $('#rajone');
  var towerFrame = $('.tower__frame');
  var levelNum = $('[data-level]');
  var facts = $$('.facts [data-step]');

  function updateTower() {
    var p = small.matches ? sceneProgress(tower) : pinProgress(tower);
    var k = small.matches ? smooth(0.12, 0.5, p) : smooth(0.04, 0.62, p);
    towerFrame.style.setProperty('--reveal', ((1 - k) * 100).toFixed(2) + '%');
    towerFrame.style.setProperty('--scan', (smooth(0, 0.04, k) * (1 - smooth(0.96, 1, k))).toFixed(3));
    towerFrame.style.transform = 'rotateY(' + mix(-22, -7, k).toFixed(2) + 'deg) rotateX(4deg) translateZ(' + mix(-80, 0, k).toFixed(1) + 'px)' + TILT;
    var level = Math.round(mix(1, 22, k));
    levelNum.textContent = (level < 10 ? '0' : '') + level;
    facts.forEach(function (f) { f.classList.toggle('on', k >= parseFloat(f.getAttribute('data-step'))); });
  }

  var portal = $('#arrival');
  var portalFrame = $('.portal__frame');
  var portalImg = portalFrame && portalFrame.firstElementChild;
  var portalArch = $('.portal__arch');
  var portalCopy = $('.portal__copy');

  function updatePortal() {
    if (small.matches) {
      portalFrame.style.transform = portalImg.style.transform = portalArch.style.transform = '';
      portalCopy.style.opacity = '';
      return;
    }
    var p = pinProgress(portal);
    var k = smooth(0.02, 0.55, p);
    var dx = window.innerWidth / 2 - (portalFrame.offsetLeft + portalFrame.offsetWidth / 2);
    var t = 'translateX(' + (dx * (1 - k)).toFixed(1) + 'px) scale(' + mix(0.4, 1, k).toFixed(3) + ')';
    portalFrame.style.transform = t;
    portalArch.style.transform = t;
    portalArch.style.opacity = smooth(0.35, 0.65, p).toFixed(3);
    portalImg.style.transform = 'scale(' + mix(1.55, 1, k).toFixed(3) + ') translateY(' + ((p - 0.5) * -4).toFixed(2) + '%)';
    var c = smooth(0.42, 0.66, p);
    portalCopy.style.opacity = c.toFixed(3);
    portalCopy.style.transform = 'translateY(calc(-50% + ' + ((1 - c) * 4).toFixed(2) + 'vh))';
    if (c > 0.3) $$('[data-split], [data-reveal]', portalCopy).forEach(function (el) { el.classList.add('is-in'); });
  }

  var deck = $('#residences');
  var deckCards = $$('.deck__card');
  var deckSlides = $$('.deck__slide');
  var deckDots = $$('.deck__dots span');
  var deckActive = -1;

  function updateDeck() {
    var n = deckCards.length;
    var p = pinProgress(deck);
    var t = clamp((p - 0.06) / 0.86, 0, 1) * (n - 1);
    deckCards.forEach(function (card, i) {
      var d = i - t, ty, tz, rx, sc, op;
      if (d >= 0) {
        ty = -d * 3.4; tz = -d * 120; rx = 16; sc = 1 - d * 0.05; op = clamp(1 - d * 0.22, 0, 1);
      } else {
        var a = -d;
        ty = -a * 62; tz = a * 60; rx = 16 + a * 38; sc = 1; op = 1 - smooth(0.12, 0.6, a);
      }
      card.style.transform = 'translate(-50%, -50%) translateY(' + ty.toFixed(2) + 'vh) translateZ(' + tz.toFixed(1) + 'px) rotateX(' + rx.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      card.style.opacity = op.toFixed(3);
      card.style.zIndex = String(100 - Math.round(d * 10));
    });
    var active = clamp(Math.round(t), 0, n - 1);
    if (active !== deckActive) {
      deckActive = active;
      deckSlides.forEach(function (s, i) { s.classList.toggle('is-active', i === active); });
      deckDots.forEach(function (s, i) { s.classList.toggle('is-on', i === active); });
      $$('[data-count]', deckSlides[active]).forEach(function (el) { countTo(el, parseInt(el.getAttribute('data-count'), 10)); });
    }
  }

  var floorCard = $('[data-motion="blueprint"]');

  function updateFloor() {
    var p = sceneProgress(floorCard);
    var k = smooth(0.06, 0.42, p);
    floorCard.style.transform = 'rotateX(' + mix(56, 0, k).toFixed(2) + 'deg) scale(' + mix(0.84, 1, k).toFixed(3) + ')';
    var wipe = (1 - smooth(0.16, 0.5, p)) * 100;
    floorCard.style.setProperty('--wipe', wipe.toFixed(2) + '%');
    floorCard.style.setProperty('--sweep', (wipe > 0.5 && wipe < 99.5 ? 1 : 0).toString());
  }

  var spread = $('#interiors');
  var spreadCards = $$('.spread__card');

  function updateSpread() {
    if (small.matches) {
      spreadCards.forEach(function (c) {
        var k = smooth(0.05, 0.4, sceneProgress(c));
        c.style.transform = 'rotateX(' + mix(40, 0, k).toFixed(2) + 'deg) translateY(' + mix(8, 0, k).toFixed(2) + 'vh)';
      });
      return;
    }
    var p = pinProgress(spread);
    var k = smooth(0.04, 0.55, p);
    spreadCards.forEach(function (c, i) {
      var d = i - 1;
      var x = d * mix(1.5, 29, k);
      var y = mix(Math.abs(d) * 2 + (d === 0 ? -1 : 0), 0, k);
      var rz = d * mix(-8, 0, k) + (d === 0 ? mix(3, 0, k) : 0);
      var ry = d * (mix(0, -14, k) - (p - 0.55) * 12);
      var tz = -Math.abs(d) * mix(40, 110, k) + (d === 0 ? mix(0, 40, k) : 0);
      c.style.transform = 'translate(-50%, -50%) translateX(' + x.toFixed(2) + 'vw) translateY(' + y.toFixed(2) + 'vh) translateZ(' + tz.toFixed(1) + 'px) rotateY(' + ry.toFixed(2) + 'deg) rotateZ(' + rz.toFixed(2) + 'deg)' + TILT;
      c.style.zIndex = d === 0 ? '3' : '1';
      var cap = c.querySelector('figcaption');
      if (cap) cap.style.opacity = smooth(0.4, 0.6, k).toFixed(3);
    });
  }

  var sky = $('#skydeck');
  var aerial = $('.sky__aerial');
  var skyLevel = $('.sky__level');
  var hotspots = $$('.hotspots li');

  function updateSky() {
    var p = small.matches ? sceneProgress(sky) : pinProgress(sky);
    var k = small.matches ? smooth(0.1, 0.45, p) : smooth(0.02, 0.5, p);
    aerial.style.transform = 'translateY(' + mix(12, 0, k).toFixed(2) + 'vh) rotateX(' + mix(62, 0, k).toFixed(2) + 'deg) scale(' + mix(0.7, 1, k).toFixed(3) + ')';
    skyLevel.style.transform = 'translate(-50%, -50%) scale(' + mix(1.3, 1, k).toFixed(3) + ') translateY(' + ((p - 0.5) * -8).toFixed(2) + 'vh)';
    skyLevel.style.opacity = smooth(0, 0.35, p).toFixed(3);
    var shift = small.matches ? -0.25 : 0;
    hotspots.forEach(function (h) { h.classList.toggle('on', p >= parseFloat(h.getAttribute('data-at')) + shift); });
  }

  var gallery = $('.gallery');
  var track = gallery && $('.gallery__track', gallery);
  var galleryCards = track ? $$('.gallery__card', track) : [];
  var marquee = gallery && $('.marquee', gallery);

  function updateGallery() {
    var r = gallery.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var p = pinProgress(gallery);
    var cx = window.innerWidth / 2;
    var first = galleryCards[0], last = galleryCards[galleryCards.length - 1];
    var startX = Math.min(0, cx - (first.offsetLeft + first.offsetWidth / 2));
    var endX = cx - (last.offsetLeft + last.offsetWidth / 2);
    var x = mix(startX, endX, p);
    track.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
    if (marquee) marquee.style.transform = 'translateX(' + (-p * 45).toFixed(2) + '%)';
    galleryCards.forEach(function (c) {
      var center = c.offsetLeft + c.offsetWidth / 2 + x;
      var d = clamp((center - cx) / window.innerWidth, -1, 1);
      c.style.transform = 'rotateY(' + (d * -38).toFixed(2) + 'deg) translateZ(' + (-Math.abs(d) * 260).toFixed(1) + 'px) scale(' + (1 - Math.abs(d) * 0.08).toFixed(3) + ')';
      c.style.opacity = (1 - Math.abs(d) * 0.4).toFixed(3);
    });
  }

  var mapCard = $('[data-motion="unfold"]');

  function updateMap() {
    var k = smooth(0.06, 0.45, sceneProgress(mapCard));
    mapCard.style.transform = 'rotateX(' + mix(66, 0, k).toFixed(2) + 'deg) scale(' + mix(0.82, 1, k).toFixed(3) + ') translateY(' + mix(8, 0, k).toFixed(2) + 'vh)' + TILT;
  }

  var ghosts = $$('.ghost[data-drift]').map(function (g) { return { el: g, host: g.closest('section'), drift: parseFloat(g.getAttribute('data-drift')) }; });

  function updateGhosts() {
    ghosts.forEach(function (g) {
      var p = sceneProgress(g.host);
      if (p <= 0 || p >= 1) return;
      var base = g.el.parentElement.classList.contains('scene__pin') ? 'translateY(-50%) ' : '';
      g.el.style.transform = base + 'translateX(' + ((0.5 - p) * g.drift * 30).toFixed(2) + 'vw)';
    });
  }

  function near(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > -window.innerHeight * 0.5 && r.top < window.innerHeight * 1.5;
  }

  function frame() {
    tilts.forEach(function (t) {
      t.x += (t.tx - t.x) * 0.12;
      t.y += (t.ty - t.y) * 0.12;
      t.el.style.setProperty('--tx', t.x.toFixed(2) + 'deg');
      t.el.style.setProperty('--ty', t.y.toFixed(2) + 'deg');
    });
    if (near(tower)) updateTower();
    if (near(portal)) updatePortal();
    if (near(deck)) updateDeck();
    if (near(floorCard)) updateFloor();
    if (near(spread)) updateSpread();
    if (near(sky)) updateSky();
    if (gallery) updateGallery();
    if (near(mapCard)) updateMap();
    updateGhosts();
    atmosphere();
    chrome();
    requestAnimationFrame(frame);
  }

  updateDeck();
  requestAnimationFrame(frame);
})();
