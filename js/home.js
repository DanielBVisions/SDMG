/* SDMG homepage — work filter, contact steps, lightbox (video or image slider),
   What we make hover, Osmo marquees */
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

/* ---------- What we make ----------
   Video Production starts active (image showing, intro copy on the left).
   Once someone hovers, focuses or taps a service, its image fades in and its
   description staggers in word by word behind the outgoing copy. */
(function () {
  'use strict';
  var wrap = document.querySelector('[data-make]');
  if (!wrap) return;
  var items = wrap.querySelectorAll('[data-make-item]');
  var imgs = wrap.querySelectorAll('[data-make-img]');
  var texts = document.querySelectorAll('[data-make-text]');
  var esc = function (w) { return w.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  texts.forEach(function (p) {
    p.innerHTML = p.textContent.trim().split(/\s+/).map(function (w, i) {
      return '<span class="make__word"><span class="make__word-i" style="--i:' + i + '">' + esc(w) + '</span></span>';
    }).join(' ');
  });

  var currentText = 'intro', currentItem = 'video';
  function show(key) {
    if (key !== currentItem) {
      currentItem = key;
      items.forEach(function (b) {
        var on = b.getAttribute('data-make-item') === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      imgs.forEach(function (img) { img.classList.toggle('is-active', img.getAttribute('data-make-img') === key); });
    }
    if (key === currentText) return;
    texts.forEach(function (p) {
      var k = p.getAttribute('data-make-text');
      if (k === currentText) {
        p.classList.remove('is-active');
        p.classList.add('is-out');
        clearTimeout(p._outTimer);
        p._outTimer = setTimeout(function () { p.classList.remove('is-out'); }, 1400);
      } else if (k === key) {
        clearTimeout(p._outTimer);
        p.classList.remove('is-out');
        p.classList.add('is-active');
      }
    });
    currentText = key;
  }

  items.forEach(function (b) {
    var key = b.getAttribute('data-make-item');
    ['mouseenter', 'focus', 'click'].forEach(function (ev) { b.addEventListener(ev, function () { show(key); }); });
  });
})();

/* ---------- Osmo Supply: Marquee with Scroll Direction (as supplied) ---------- */
function initMarqueeScrollDirection() {
  document.querySelectorAll('[data-marquee-scroll-direction-target]').forEach((marquee) => {
    // Query marquee elements
    const marqueeContent = marquee.querySelector('[data-marquee-collection-target]');
    const marqueeScroll = marquee.querySelector('[data-marquee-scroll-target]');
    if (!marqueeContent || !marqueeScroll) return;

    // Get data attributes
    const { marqueeSpeed: speed, marqueeDirection: direction, marqueeDuplicate: duplicate, marqueeScrollSpeed: scrollSpeed } = marquee.dataset;

    // Convert data attributes to usable types
    const marqueeSpeedAttr = parseFloat(speed);
    const marqueeDirectionAttr = direction === 'right' ? 1 : -1; // 1 for right, -1 for left
    const duplicateAmount = parseInt(duplicate || 0);
    const scrollSpeedAttr = parseFloat(scrollSpeed);
    const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;

    let marqueeSpeed = marqueeSpeedAttr * (marqueeContent.offsetWidth / window.innerWidth) * speedMultiplier;

    // Precompute styles for the scroll container
    marqueeScroll.style.marginLeft = `${scrollSpeedAttr * -1}%`;
    marqueeScroll.style.width = `${(scrollSpeedAttr * 2) + 100}%`;

    // Duplicate marquee content
    if (duplicateAmount > 0) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < duplicateAmount; i++) {
        fragment.appendChild(marqueeContent.cloneNode(true));
      }
      marqueeScroll.appendChild(fragment);
    }

    // GSAP animation for marquee content
    const marqueeItems = marquee.querySelectorAll('[data-marquee-collection-target]');
    const animation = gsap.to(marqueeItems, {
      xPercent: -100, // Move completely out of view
      repeat: -1,
      duration: marqueeSpeed,
      ease: 'linear'
    }).totalProgress(0.5);

    // Initialize marquee in the correct direction
    gsap.set(marqueeItems, { xPercent: marqueeDirectionAttr === 1 ? 100 : -100 });
    animation.timeScale(marqueeDirectionAttr); // Set correct direction
    animation.play(); // Start animation immediately

    // Set initial marquee status
    marquee.setAttribute('data-marquee-status', 'normal');

    // ScrollTrigger logic for direction inversion
    ScrollTrigger.create({
      trigger: marquee,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const isInverted = self.direction === 1; // Scrolling down
        const currentDirection = isInverted ? -marqueeDirectionAttr : marqueeDirectionAttr;

        // Update animation direction and marquee status
        animation.timeScale(currentDirection);
        marquee.setAttribute('data-marquee-status', isInverted ? 'normal' : 'inverted');
      }
    });

    // Extra speed effect on scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marquee,
        start: '0% 100%',
        end: '100% 0%',
        scrub: 0
      }
    });

    const scrollStart = marqueeDirectionAttr === -1 ? scrollSpeedAttr : -scrollSpeedAttr;
    const scrollEnd = -scrollStart;

    tl.fromTo(marqueeScroll, { x: `${scrollStart}vw` }, { x: `${scrollEnd}vw`, ease: 'none' });
  });
}

// Initialize Marquee with Scroll Direction
document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return; // CDN blocked: strips stay static
  gsap.registerPlugin(ScrollTrigger);
  initMarqueeScrollDirection();
  // Duplicated logo/text sets are decorative: hide them from screen readers
  document.querySelectorAll('[data-marquee-scroll-target]').forEach((scroll) => {
    Array.from(scroll.children).slice(1).forEach((copy) => copy.setAttribute('aria-hidden', 'true'));
  });
});
