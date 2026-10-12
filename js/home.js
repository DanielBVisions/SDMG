/* SDMG homepage — work filter, contact steps, lightbox (video or image slider) */
(function () {
  'use strict';

  /* ---------- Work filter ---------- */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var cards = document.querySelectorAll('.wcard');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      cards.forEach(function (c) { c.hidden = !(f === 'All' || c.getAttribute('data-type') === f); });
    });
  });

  /* ---------- Contact steps ---------- */
  var step = 1;
  var steps = document.querySelectorAll('.form__step');
  var dots = document.querySelectorAll('.form__dot path');
  var label = document.getElementById('step-label');
  function showStep() {
    steps.forEach(function (s) { s.hidden = +s.getAttribute('data-step') !== step; });
    dots.forEach(function (d, i) { d.setAttribute('fill', i < step ? '#111111' : '#CFCBC2'); });
    if (label) label.textContent = step < 4 ? 'Step ' + step + ' of 3' : 'Done';
  }
  document.querySelectorAll('[data-next]').forEach(function (b) { b.addEventListener('click', function () { step = Math.min(step + 1, 4); showStep(); }); });
  document.querySelectorAll('[data-back]').forEach(function (b) { b.addEventListener('click', function () { step = Math.max(step - 1, 1); showStep(); }); });
  document.querySelectorAll('[data-restart]').forEach(function (b) { b.addEventListener('click', function () { step = 1; showStep(); }); });
  document.querySelectorAll('.opt').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
  });

  /* ---------- Lightbox ---------- */
  var box = document.getElementById('lightbox');
  var frame = document.getElementById('lightbox-frame');
  var media = document.getElementById('lightbox-media');
  var playBtn = document.getElementById('lightbox-play');
  var prev = document.getElementById('lightbox-prev');
  var next = document.getElementById('lightbox-next');
  var count = document.getElementById('lightbox-count');
  var countText = document.getElementById('lightbox-count-text');
  var closeBtn = document.getElementById('lightbox-close');
  var lastTrigger = null, slides = [], index = 0, videoSrc = '';

  function embedUrl(src) {
    var yt = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (yt) return 'https://www.youtube.com/embed/' + yt[1] + '?autoplay=1&rel=0';
    var vm = src.match(/vimeo\.com\/(\d+)/);
    if (vm) return 'https://player.vimeo.com/video/' + vm[1] + '?autoplay=1';
    return null;
  }

  function open(trigger) {
    lastTrigger = trigger;
    media.innerHTML = '';
    frame.classList.remove('is-playing');
    var kind = trigger.getAttribute('data-lightbox');
    if (kind === 'gallery') {
      slides = (trigger.getAttribute('data-images') || '').split(',').filter(Boolean);
      index = 0;
      var wrap = document.createElement('div');
      wrap.className = 'lightbox__slides';
      slides.forEach(function (src, i) {
        var img = document.createElement('img');
        img.src = src; img.alt = 'Image ' + (i + 1) + ' of ' + slides.length;
        wrap.appendChild(img);
      });
      media.appendChild(wrap);
      playBtn.hidden = true;
      prev.hidden = next.hidden = count.hidden = slides.length < 2;
      showSlide();
    } else {
      slides = [];
      videoSrc = trigger.getAttribute('data-video') || '';
      var poster = document.createElement('img');
      poster.src = trigger.getAttribute('data-poster') || ''; poster.alt = '';
      media.appendChild(poster);
      playBtn.hidden = false;
      prev.hidden = next.hidden = count.hidden = true;
    }
    box.hidden = false;
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function showSlide() {
    var imgs = media.querySelectorAll('.lightbox__slides img');
    imgs.forEach(function (img, i) { img.classList.toggle('is-active', i === index); });
    countText.textContent = (index + 1) + ' / ' + slides.length;
  }

  function play() {
    if (!videoSrc) return; // no video added yet for this project
    media.innerHTML = '';
    var url = embedUrl(videoSrc);
    if (url) {
      var f = document.createElement('iframe');
      f.src = url; f.allow = 'autoplay; fullscreen; picture-in-picture'; f.allowFullscreen = true; f.title = 'Project video';
      media.appendChild(f);
    } else {
      var v = document.createElement('video');
      v.src = videoSrc; v.controls = true; v.autoplay = true; v.playsInline = true;
      media.appendChild(v);
    }
    frame.classList.add('is-playing');
  }

  function close() {
    box.hidden = true;
    media.innerHTML = '';
    document.body.classList.remove('no-scroll');
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll('[data-lightbox]').forEach(function (t) {
    t.addEventListener('click', function () { open(t); });
  });
  playBtn.addEventListener('click', play);
  closeBtn.addEventListener('click', close);
  prev.addEventListener('click', function () { index = (index - 1 + slides.length) % slides.length; showSlide(); });
  next.addEventListener('click', function () { index = (index + 1) % slides.length; showSlide(); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (slides.length > 1 && e.key === 'ArrowLeft') prev.click();
    if (slides.length > 1 && e.key === 'ArrowRight') next.click();
  });
})();
