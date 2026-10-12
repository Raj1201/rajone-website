// Drag-to-rotate RAJONE tower: a 72-frame, 360° turnaround (one frame every 5°) drawn on a canvas.
// Frames load only when the tower section comes near. Scroll turns the tower until the visitor
// drags it; the zoom buttons scale it; reset hands control back to the scroll.
(function () {
  var frame = document.querySelector('[data-tower3d]');
  if (!frame || !('IntersectionObserver' in window)) return;

  var COUNT = 72;
  var MAX_ZOOM = 1.7;
  var images = [];
  var canvas, ctx;
  var index = 0, drawn = -1;
  var zoom = 1, zoomTarget = 1;
  var dragging = false, lastX = 0, velocity = 0;

  function path(i) { return 'assets/project/spin/t' + (i < 10 ? '0' : '') + i + '.webp'; }

  function wrap(i) { return ((i % COUNT) + COUNT) % COUNT; }

  function resize() {
    var r = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    drawn = -1;
  }

  function draw() {
    var i = wrap(Math.round(index));
    var img = images[i];
    if (!img || !img.complete || !img.naturalWidth) return;
    if (i === drawn && Math.abs(zoom - zoomTarget) < 0.001) return;
    drawn = i;
    var cw = canvas.width, ch = canvas.height;
    var base = Math.min(cw / img.naturalWidth, (ch * 0.62) / img.naturalHeight);
    var s = base * zoom;
    var w = img.naturalWidth * s, h = img.naturalHeight * s;
    var restH = img.naturalHeight * base;
    var bottom = ch * 0.81;
    var cy = bottom - restH / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, cy - h / 2 - (zoom - 1) * restH * 0.08, w, h);
  }

  function tick() {
    if (!dragging && Math.abs(velocity) > 0.01) {
      index += velocity;
      velocity *= 0.92;
      drawn = -1;
    }
    if (Math.abs(zoom - zoomTarget) > 0.001) {
      zoom += (zoomTarget - zoom) * 0.18;
      drawn = -1;
    }
    draw();
    requestAnimationFrame(tick);
  }

  // Called by motion.js while the section is pinned.
  frame.__spin = function (p) {
    if (frame.dataset.userMoved) return;
    index = p * COUNT;
  };

  function mount() {
    canvas = document.createElement('canvas');
    canvas.className = 'tower__spin';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'The RAJONE tower. Drag left or right to rotate it.');
    canvas.tabIndex = 0;
    frame.insertBefore(canvas, frame.querySelector('.tower__scan'));
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('pointerdown', function (e) {
      dragging = true;
      lastX = e.clientX;
      velocity = 0;
      frame.dataset.userMoved = '1';
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      lastX = e.clientX;
      var step = -dx * COUNT / (canvas.getBoundingClientRect().width * 1.6);
      index += step;
      velocity = step;
      drawn = -1;
    });
    function release() { dragging = false; }
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        frame.dataset.userMoved = '1';
        index += e.key === 'ArrowLeft' ? 2 : -2;
        drawn = -1;
        e.preventDefault();
      }
    });

    frame.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        var mode = b.getAttribute('data-zoom');
        if (mode === 'reset') {
          zoomTarget = 1;
          velocity = 0;
          frame.dataset.userMoved = '';
          return;
        }
        zoomTarget = Math.min(MAX_ZOOM, Math.max(1, zoomTarget * (mode === 'in' ? 1.3 : 1 / 1.3)));
      });
    });

    frame.classList.add('is-3d');
    frame.querySelector('.tower__controls').hidden = false;
    requestAnimationFrame(tick);
  }

  var io = new IntersectionObserver(function (entries) {
    if (!entries.some(function (e) { return e.isIntersecting; })) return;
    io.disconnect();
    var first = new Image();
    first.onload = function () {
      images[0] = first;
      for (var i = 1; i < COUNT; i++) {
        var im = new Image();
        im.src = path(i);
        images[i] = im;
      }
      mount();
    };
    first.src = path(0);
  }, { rootMargin: '120% 0px' });
  io.observe(frame);
})();
