(function () {
  var root = document.documentElement;
  var header = document.querySelector('.site-header');
  var film = document.getElementById('film');

  function solidHeader() {
    if (!header || !film) return;
    header.classList.toggle('is-solid', window.scrollY > film.offsetTop + film.offsetHeight - window.innerHeight * 0.5);
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', solidHeader, { passive: true });
    solidHeader();
    return;
  }

  root.classList.add('js-motion');

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(function (el) { io.observe(el); });

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function smooth(e0, e1, v) { var t = clamp((v - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); }
  function mix(a, b, k) { return a + (b - a) * k; }

  // 0 when the element's top enters at the bottom of the viewport, 1 when its bottom leaves the top.
  function sceneProgress(el) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight;
    return clamp((vh - r.top) / (vh + r.height), 0, 1);
  }

  function rise(el, p) {
    var k = smooth(0.06, 0.46, p);
    el.style.transform = 'rotateX(' + mix(62, 10, k).toFixed(2) + 'deg) rotateZ(' + mix(-6, 0, k).toFixed(2) +
      'deg) translateY(' + mix(10, 0, k).toFixed(2) + 'vh) scale(' + mix(0.86, 1, k).toFixed(3) + ')';
  }

  var effects = {
    swing: function (el, p) {
      var k = smooth(0.04, 0.5, p);
      var dir = parseFloat(el.getAttribute('data-dir') || '1');
      el.style.transform = 'rotateY(' + mix(-34 * dir, 0, k).toFixed(2) + 'deg) rotateX(' + mix(8, 0, k).toFixed(2) +
        'deg) translateZ(' + mix(-140, 0, k).toFixed(1) + 'px) translateY(' + ((0.5 - p) * 8).toFixed(2) + 'vh)';
    },
    rise: rise,
    unfold: function (el, p) {
      var k = smooth(0.06, 0.48, p);
      el.style.transform = 'rotateX(' + mix(70, 0, k).toFixed(2) + 'deg) scale(' + mix(0.8, 1, k).toFixed(3) +
        ') translateY(' + mix(8, 0, k).toFixed(2) + 'vh)';
    },
    descend: function (el, p) {
      var k = smooth(0.04, 0.52, p);
      el.style.transform = 'rotateX(' + mix(40, 0, k).toFixed(2) + 'deg) scale(' + mix(0.82, 1, k).toFixed(3) + ')';
      el.firstElementChild.style.transform = 'scale(' + mix(1.18, 1, k).toFixed(3) + ')';
    },
    fan: function (el, p) {
      var cards = el.children;
      if (window.innerWidth <= 768) {
        for (var j = 0; j < cards.length; j++) rise(cards[j], sceneProgress(cards[j]));
        return;
      }
      var k = smooth(0.08, 0.5, p);
      for (var i = 0; i < cards.length; i++) {
        var d = i - 1;
        cards[i].style.transform = 'translateX(' + (d * -(1 - k) * 22).toFixed(2) + 'vw) rotateY(' + (d * -(1 - k) * 38).toFixed(2) +
          'deg) translateZ(' + ((1 - k) * (d ? -180 : 60)).toFixed(1) + 'px) rotateZ(' + (d * (1 - k) * 4).toFixed(2) + 'deg)';
        cards[i].style.zIndex = d === 0 ? 2 : 1;
      }
    }
  };

  var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-motion]'));

  var gallery = document.querySelector('.gallery');
  var track = gallery && gallery.querySelector('.gallery__track');
  var galleryCards = track ? Array.prototype.slice.call(track.children) : [];

  function updateGallery() {
    if (!track) return;
    var r = gallery.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var range = gallery.offsetHeight - window.innerHeight;
    var p = range > 0 ? clamp(-r.top / range, 0, 1) : 0;
    var cx = window.innerWidth / 2;
    var first = galleryCards[0], last = galleryCards[galleryCards.length - 1];
    var startX = Math.min(0, cx - (first.offsetLeft + first.offsetWidth / 2));
    var endX = cx - (last.offsetLeft + last.offsetWidth / 2);
    var x = mix(startX, endX, p);
    track.style.transform = 'translateX(' + x.toFixed(1) + 'px)';
    galleryCards.forEach(function (c) {
      var center = c.offsetLeft + c.offsetWidth / 2 + x;
      var d = clamp((center - cx) / window.innerWidth, -1, 1);
      c.style.transform = 'rotateY(' + (d * -38).toFixed(2) + 'deg) translateZ(' + (-Math.abs(d) * 260).toFixed(1) +
        'px) scale(' + (1 - Math.abs(d) * 0.08).toFixed(3) + ')';
      c.style.opacity = (1 - Math.abs(d) * 0.4).toFixed(3);
    });
  }

  function frame() {
    var vh = window.innerHeight;
    for (var i = 0; i < scenes.length; i++) {
      var el = scenes[i];
      var r = el.getBoundingClientRect();
      if (r.bottom < -vh * 0.25 || r.top > vh * 1.25) continue;
      var fx = effects[el.getAttribute('data-motion')];
      if (fx) fx(el, sceneProgress(el));
    }
    updateGallery();
    solidHeader();
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();
