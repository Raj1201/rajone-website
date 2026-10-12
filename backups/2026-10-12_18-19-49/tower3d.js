// Interactive 3D RAJONE tower. The model ships as a base64 data URI in assets/tower-model.js
// so it loads from file:// (a plain .glb fetch is blocked there). Both the viewer library and
// the 8 MB model load only when the tower section comes near.
(function () {
  var frame = document.querySelector('[data-tower3d]');
  if (!frame || !('IntersectionObserver' in window)) return;

  var VIEWER = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@3.5.0/dist/model-viewer.min.js';
  var START = { theta: -30, phi: 78 };

  function load(src, module) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      if (module) s.type = 'module';
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  function mount() {
    var mv = document.createElement('model-viewer');
    mv.setAttribute('src', window.RAJONE_TOWER_GLB);
    mv.setAttribute('alt', '3D model of the RAJONE tower. Drag to rotate.');
    mv.setAttribute('camera-controls', '');
    mv.setAttribute('disable-zoom', '');
    mv.setAttribute('disable-pan', '');
    mv.setAttribute('touch-action', 'pan-y');
    mv.setAttribute('interaction-prompt', 'none');
    mv.setAttribute('camera-orbit', START.theta + 'deg ' + START.phi + 'deg auto');
    mv.setAttribute('min-camera-orbit', 'auto 35deg auto');
    mv.setAttribute('max-camera-orbit', 'auto 100deg auto');
    mv.setAttribute('field-of-view', '30deg');
    mv.setAttribute('exposure', '0.82');
    mv.setAttribute('tone-mapping', 'aces');
    mv.setAttribute('shadow-intensity', '1.1');
    mv.setAttribute('shadow-softness', '0.8');
    mv.setAttribute('environment-image', 'neutral');
    frame.insertBefore(mv, frame.querySelector('.tower__scan'));

    mv.addEventListener('load', function () {
      frame.classList.add('is-3d');
      frame.querySelector('.tower__controls').hidden = false;
    });
    mv.addEventListener('camera-change', function (e) {
      if (e.detail && e.detail.source === 'user-interaction') frame.dataset.userMoved = '1';
    });

    var base = null;
    frame.querySelectorAll('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        var orbit = mv.getCameraOrbit();
        if (base === null) base = orbit.radius;
        var mode = b.getAttribute('data-zoom');
        if (mode === 'reset') {
          frame.dataset.userMoved = '';
          mv.cameraOrbit = START.theta + 'deg ' + START.phi + 'deg auto';
          return;
        }
        var r = orbit.radius * (mode === 'in' ? 0.78 : 1.28);
        r = Math.min(Math.max(r, base * 0.35), base * 1.8);
        frame.dataset.userMoved = '1';
        mv.cameraOrbit = orbit.theta + 'rad ' + orbit.phi + 'rad ' + r.toFixed(3) + 'm';
      });
    });
    frame.__mv = mv;
  }

  var io = new IntersectionObserver(function (entries) {
    if (!entries.some(function (e) { return e.isIntersecting; })) return;
    io.disconnect();
    Promise.all([load(VIEWER, true), load('assets/tower-model.js')])
      .then(function () { return customElements.whenDefined('model-viewer'); })
      .then(mount)
      .catch(function () { /* the still image stays in place */ });
  }, { rootMargin: '120% 0px' });
  io.observe(frame);
})();
