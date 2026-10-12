(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) return;

  var root = document.documentElement;
  var film = document.getElementById('film');
  var video = film && film.querySelector('.hero__film');
  if (!video) return;

  var fades = film.querySelectorAll('.hero__content, .scroll-cue');
  var chapters = Array.prototype.slice.call(film.querySelectorAll('.chapter'));
  var nav = document.querySelector('.main-nav');
  var navLinks = nav ? nav.querySelectorAll('a[data-chapter]') : [];

  var isSmall = window.matchMedia('(max-width: 768px)').matches;
  video.src = isSmall ? 'assets/film-mobile.mp4' : 'assets/film-desktop.mp4';
  video.poster = 'assets/film-poster.jpg';

  // Chapter windows as fractions of the scroll track; the last one holds to the end.
  var windows = [
    { start: 0.12, end: 0.32 },
    { start: 0.34, end: 0.54 },
    { start: 0.56, end: 0.76 },
    { start: 0.78, end: 1.01 }
  ];
  var EDGE = 0.035;      // fade length of each chapter
  var CROSSFADE = 0.04;  // static hero -> film over the first 4% of scroll
  var EASE = 0.12;       // fraction of the remaining distance covered per 60fps frame

  var duration = 0;
  var target = 0;
  var current = 0;
  var lastTs = 0;
  var activeId = null;
  var failed = false;

  function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function smooth(e0, e1, v) {
    var t = clamp((v - e0) / (e1 - e0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function progress() {
    var rect = film.getBoundingClientRect();
    var range = film.offsetHeight - window.innerHeight;
    return range > 0 ? clamp(-rect.top / range, 0, 1) : 0;
  }

  function render(p) {
    video.style.opacity = smooth(0, CROSSFADE, p).toFixed(3);

    var heroFade = 1 - smooth(0, 0.06, p);
    for (var i = 0; i < fades.length; i++) fades[i].style.opacity = heroFade.toFixed(3);

    var best = null, bestOpacity = 0;
    chapters.forEach(function (el, i) {
      var w = windows[i];
      var o = smooth(w.start, w.start + EDGE, p) * (1 - smooth(w.end - EDGE, w.end, p));
      el.style.opacity = o.toFixed(3);
      el.style.transform = 'translateY(' + ((1 - o) * 1.2).toFixed(2) + 'vh)';
      el.classList.toggle('is-active', o > 0.5);
      if (o > bestOpacity) { bestOpacity = o; best = el.getAttribute('data-chapter'); }
    });

    var next = bestOpacity > 0.5 ? best : null;
    if (next !== activeId) {
      activeId = next;
      for (var j = 0; j < navLinks.length; j++) {
        navLinks[j].classList.toggle('is-active', navLinks[j].getAttribute('data-chapter') === activeId);
      }
      if (nav) nav.classList.toggle('has-active', !!activeId);
    }
  }

  function tick(ts) {
    if (failed) return;
    var dt = lastTs ? Math.min(ts - lastTs, 100) : 16.7;
    lastTs = ts;
    var p = progress();
    render(p);

    if (duration) {
      target = p * (duration - 0.05);
      var k = 1 - Math.pow(1 - EASE, dt / 16.7);
      current += (target - current) * k;
      if (Math.abs(target - current) < 0.001) current = target;
      if (!video.seeking && Math.abs(video.currentTime - current) > 0.002) {
        video.currentTime = current;
      }
    }
    requestAnimationFrame(tick);
  }

  function fail() {
    failed = true;
    root.classList.remove('has-film');
    video.removeAttribute('src');
    video.load();
    for (var i = 0; i < fades.length; i++) fades[i].style.opacity = '';
    chapters.forEach(function (el) { el.style.opacity = ''; el.style.transform = ''; });
  }

  video.addEventListener('loadedmetadata', function () {
    duration = video.duration || 0;
    video.pause();
  });
  video.addEventListener('error', fail);

  root.classList.add('has-film');
  requestAnimationFrame(tick);
})();
