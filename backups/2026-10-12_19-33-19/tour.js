// Sky deck walkthroughs: each hotspot opens a short clip of that amenity.
// Clips live in assets/amenities/<key>.mp4. Until a clip exists, the matching render is shown
// with a slow camera drift, so a clip only needs to be dropped into that folder.
(function () {
  var tour = document.getElementById('tour');
  if (!tour) return;

  var ITEMS = [
    { key: 'kids', title: "Kids' play", still: 'assets/project/amenity-kids.jpg' },
    { key: 'turf', title: 'Turf', still: 'assets/project/amenity-cricket.jpg' },
    { key: 'cafe', title: 'Open-air café', still: 'assets/project/amenity-lounge.jpg' },
    { key: 'jogging', title: 'Jogging track', still: 'assets/project/amenity-jogging.jpg' },
    { key: 'yoga', title: 'Yoga deck', still: 'assets/project/amenity-yoga.jpg' }
  ];

  var still = tour.querySelector('.tour__still');
  var video = tour.querySelector('.tour__video');
  var title = tour.querySelector('.tour__title');
  var current = -1;
  var opener = null;

  function show(i) {
    current = (i + ITEMS.length) % ITEMS.length;
    var item = ITEMS[current];
    tour.classList.remove('has-video');
    title.textContent = item.title;
    still.src = item.still;
    still.alt = item.title + ' on the RAJONE sky deck';
    video.pause();
    video.src = 'assets/amenities/' + item.key + '.mp4';
    video.load();
  }

  video.addEventListener('loadeddata', function () {
    tour.classList.add('has-video');
    video.currentTime = 0;
    var p = video.play();
    if (p && p.catch) p.catch(function () {});
  });
  video.addEventListener('error', function () { tour.classList.remove('has-video'); });

  function open(i, btn) {
    opener = btn || null;
    show(i);
    tour.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { tour.classList.add('is-open'); });
    });
    tour.querySelector('.tour__close').focus({ preventScroll: true });
  }

  function close() {
    if (tour.hidden) return;
    tour.classList.remove('is-open');
    video.pause();
    document.documentElement.style.overflow = '';
    setTimeout(function () {
      tour.hidden = true;
      video.removeAttribute('src');
      video.load();
    }, 450);
    if (opener) opener.focus({ preventScroll: true });
  }

  document.querySelectorAll('[data-amenity]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-amenity');
      for (var i = 0; i < ITEMS.length; i++) {
        if (ITEMS[i].key === key) { open(i, btn); return; }
      }
    });
  });

  tour.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', close); });
  tour.querySelectorAll('[data-step]').forEach(function (b) {
    b.addEventListener('click', function () { show(current + parseInt(b.getAttribute('data-step'), 10)); });
  });

  document.addEventListener('keydown', function (e) {
    if (tour.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(current + 1);
    else if (e.key === 'ArrowLeft') show(current - 1);
  });
})();
