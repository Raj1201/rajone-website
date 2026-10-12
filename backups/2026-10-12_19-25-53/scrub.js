// Loads a video for scroll-scrubbing so it also works on phones.
// iOS Safari ignores preload and won't decode frames for a video that has never played, so
// setting currentTime on scroll shows nothing. Fetching the whole file into a blob URL and then
// briefly playing it (allowed for muted inline video) makes every frame seekable.
window.loadScrubVideo = function (video, url) {
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.preload = 'auto';

  function wake() {
    var p = video.play();
    if (p && p.then) {
      p.then(function () { video.pause(); }).catch(function () {});
    } else {
      video.pause();
    }
  }

  function useSrc(src) {
    video.src = src;
    video.load();
    video.addEventListener('loadeddata', wake, { once: true });
  }

  // A tap or first scroll also counts as permission to decode on stricter browsers.
  var unlock = function () {
    if (video.readyState < 2) wake();
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('scroll', unlock);
  };
  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('scroll', unlock, { passive: true });

  if (/^https?:$/.test(location.protocol) && window.fetch && window.URL && URL.createObjectURL) {
    fetch(url)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.blob(); })
      .then(function (b) { useSrc(URL.createObjectURL(b)); })
      .catch(function () { useSrc(url); });
  } else {
    useSrc(url);
  }
};
