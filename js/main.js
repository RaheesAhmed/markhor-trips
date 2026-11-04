/* Markhor Trips — home page interactions. Vanilla JS, no dependencies. */
(function () {
  'use strict';

  // Where search forms hand off to. On the live ASP site this can be "" (same origin).
  var BOOKING_BASE = document.documentElement.getAttribute('data-booking-base') || 'https://www.markhortrips.com';
  var PRODUCT_URL = {
    flight: '/Cms?type=flight',
    hotel: '/Cms?type=hotel',
    visa: '/Cms?type=visa',
    tour: '/Cms?type=tour'
  };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Sticky header state ---------- */
  var header = document.getElementById('header');
  var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile drawer ---------- */
  var drawer = document.getElementById('drawer');
  var openBtn = document.querySelector('[data-drawer-open]');
  function setDrawer(open) {
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector('[data-drawer-close].menu-toggle').focus();
    else openBtn.focus();
  }
  openBtn.addEventListener('click', function () { setDrawer(true); });
  drawer.querySelectorAll('[data-drawer-close]').forEach(function (el) {
    el.addEventListener('click', function () { setDrawer(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) setDrawer(false);
  });

  /* ---------- Hero slideshow ---------- */
  var hero = document.querySelector('[data-hero]');
  var slides = hero ? hero.querySelectorAll('.hero-slide') : [];
  var dots = document.querySelectorAll('.hero-dot');
  var capTitle = document.querySelector('[data-hero-title]');
  var capLabel = document.querySelector('[data-hero-label]');
  var current = 0, timer;

  function hydrate(slide) {
    var img = slide.querySelector('img[data-src]');
    if (!img) return;
    img.srcset = img.getAttribute('data-srcset');
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
    img.removeAttribute('data-srcset');
  }
  function show(i) {
    slides[current].classList.remove('is-active');
    dots[current] && dots[current].classList.remove('is-active');
    current = (i + slides.length) % slides.length;
    hydrate(slides[current]);
    slides[current].classList.add('is-active');
    if (dots[current]) { void dots[current].offsetWidth; dots[current].classList.add('is-active'); }
    if (capTitle) capTitle.textContent = slides[current].getAttribute('data-caption');
    if (capLabel) capLabel.textContent = slides[current].getAttribute('data-label');
    hydrate(slides[(current + 1) % slides.length]);
  }
  function start() { clearInterval(timer); timer = setInterval(function () { show(current + 1); }, 7000); }
  if (slides.length > 1 && !reduceMotion) {
    // Preload the next slide once the page is idle so the first swap is seamless.
    window.addEventListener('load', function () { hydrate(slides[1]); });
    start();
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); start(); }); });
    document.addEventListener('visibilitychange', function () { document.hidden ? clearInterval(timer) : start(); });
  }

  /* ---------- Search tabs (WAI-ARIA tabs pattern) ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.search-tab'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus(); selectTab(next);
    });
  });

  /* ---------- Dates: sensible defaults & constraints ---------- */
  function iso(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  var today = new Date();
  var plus = function (n) { var d = new Date(today); d.setDate(d.getDate() + n); return d; };
  document.querySelectorAll('input[type="date"]').forEach(function (el) { el.min = iso(today); });
  function linkDates(a, b, gap) {
    a = document.getElementById(a); b = document.getElementById(b);
    if (!a || !b) return;
    a.addEventListener('change', function () {
      if (!a.value) return;
      var min = new Date(a.value); min.setDate(min.getDate() + gap);
      b.min = iso(min);
      if (!b.value || b.value < b.min) b.value = b.min;
    });
  }
  linkDates('f-depart', 'f-return', 0);
  linkDates('h-in', 'h-out', 1);
  var dep = document.getElementById('f-depart');
  if (dep && !dep.value) { dep.value = iso(plus(14)); dep.dispatchEvent(new Event('change')); }
  var ret = document.getElementById('f-return');
  if (ret) ret.value = iso(plus(21));

  /* ---------- Trip type ---------- */
  document.querySelectorAll('input[name="trip"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var oneWay = r.value !== 'round' && r.checked;
      ret.disabled = oneWay;
      ret.closest('.field').classList.toggle('is-disabled', oneWay);
    });
  });

  /* ---------- Swap origin / destination ---------- */
  var swap = document.querySelector('[data-swap]');
  if (swap) swap.addEventListener('click', function () {
    var a = document.getElementById('f-from'), b = document.getElementById('f-to');
    var t = a.value; a.value = b.value; b.value = t;
  });

  /* ---------- Travellers popover ---------- */
  var paxToggle = document.querySelector('[data-pax-toggle]');
  var pax = document.getElementById('pax');
  var paxSummary = document.getElementById('pax-summary');
  var cabin = document.getElementById('f-cabin');
  function updatePax() {
    var v = {};
    pax.querySelectorAll('output').forEach(function (o) { v[o.name] = +o.value; });
    var total = v.adults + v.children + v.infants;
    var txt = total === 1 ? '1 Adult' : total + ' Travellers';
    paxSummary.textContent = txt + ' · ' + cabin.value;
    pax.querySelectorAll('.stepper').forEach(function (s) {
      var o = s.querySelector('output'), b = s.querySelectorAll('button');
      b[0].disabled = +o.value <= +s.dataset.min;
      b[1].disabled = total >= 9 || (o.name === 'infants' && +o.value >= v.adults);
    });
  }
  function setPax(open) {
    pax.hidden = !open;
    paxToggle.setAttribute('aria-expanded', String(open));
  }
  if (paxToggle) {
    paxToggle.addEventListener('click', function (e) { e.stopPropagation(); setPax(pax.hidden); });
    pax.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', function () { setPax(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !pax.hidden) { setPax(false); paxToggle.focus(); } });
    document.querySelector('[data-pax-done]').addEventListener('click', function () { setPax(false); paxToggle.focus(); });
    pax.querySelectorAll('.stepper').forEach(function (s) {
      var o = s.querySelector('output'), b = s.querySelectorAll('button');
      b[0].addEventListener('click', function () { o.value = Math.max(+s.dataset.min, +o.value - 1); clampInfants(); updatePax(); });
      b[1].addEventListener('click', function () { o.value = +o.value + 1; updatePax(); });
    });
    cabin.addEventListener('change', updatePax);
    updatePax();
  }
  function clampInfants() {
    var a = pax.querySelector('output[name="adults"]'), i = pax.querySelector('output[name="infants"]');
    if (+i.value > +a.value) i.value = a.value;
  }

  /* ---------- Search hand-off ----------
     The booking engine lives on the existing platform. Until this page is served
     from that domain and wired to its search handlers, we send people to the
     matching product search page there. */
  document.querySelectorAll('.search-panel').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var product = form.getAttribute('data-product');
      window.location.href = BOOKING_BASE + (PRODUCT_URL[product] || '/');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Footer year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
