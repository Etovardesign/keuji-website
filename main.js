/* ============================================================
   KEUJI — main.js
   Handles: nav scroll, mouse glow, scroll reveals,
            parallax banner, count-up stats
   ============================================================ */

/* ── 1. NAV — add scrolled class ── */
(function initNav() {
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── 2. GLOW ORB — cursor-following ambient light ── */
(function initGlow() {
  const orb = document.getElementById('glow-cursor');
  if (!orb) return;

  // Start centered, fade in
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  orb.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  requestAnimationFrame(() => orb.classList.add('visible'));

  let rafId = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = null;
      orb.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });
  }, { passive: true });
})();


/* ── 2b. CARD GLOW — radial spotlight on feature cards + banner ── */
(function initCardGlow() {
  function attach(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(2) + '%';
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(2) + '%';
      card.style.setProperty('--gx', x);
      card.style.setProperty('--gy', y);
    });
  }

  document.querySelectorAll('.feature-card, .banner-card').forEach(attach);
})();


/* ── 3. SCROLL REVEALS — IntersectionObserver ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();


/* ── 4. PARALLAX — banner background ── */
(function initParallax() {
  const bannerCard = document.getElementById('banner-card');
  const bannerBg   = document.getElementById('banner-bg');

  if (!bannerCard || !bannerBg) return;

  let ticking = false;

  function updateParallax() {
    ticking = false;
    const rect = bannerCard.getBoundingClientRect();
    const viewH = window.innerHeight;

    if (rect.bottom < -200 || rect.top > viewH + 200) return;

    const progress = 1 - (rect.bottom / (viewH + rect.height));
    const bgShift = progress * rect.height * 0.3;
    bannerBg.style.transform = `translateY(${bgShift}px)`;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });

  updateParallax();
})();


/* ── 5. COUNT-UP STATS ── */
(function initCountUp() {
  const statNumbers = document.querySelectorAll('.stat-item__number[data-count-target]');
  if (!statNumbers.length) return;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCount(el) {
    const target   = parseFloat(el.dataset.countTarget);
    const prefix   = el.dataset.countPrefix   || '';
    const suffix   = el.dataset.countSuffix   || '';
    const duration = 1200;
    const start    = performance.now();
    const isInt    = Number.isInteger(target);

    function tick(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutExpo(progress);
      const value    = eased * target;
      const display  = isInt ? Math.round(value) : value.toFixed(1);

      // Rebuild inner — suffix smaller
      if (suffix === 'mins') {
        el.innerHTML = `${prefix}${display}<span style="font-size:0.5em">${suffix}</span>`;
      } else {
        el.innerHTML = `${prefix}${display}${suffix}`;
      }

      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  statNumbers.forEach(el => observer.observe(el));
})();


/* ── 6. HERO — ensure animations play on repeat visit ── */
(function initHero() {
  // Elements already have CSS animation set via animation: property
  // This ensures they reset if someone navigates back
  const heroEls = document.querySelectorAll('.hero__eyebrow, .hero__h1, .hero__body, .hero__cta');
  heroEls.forEach(el => {
    el.style.animationPlayState = 'running';
  });
})();


/* ── 7. HAMBURGER MENU ── */
(function initHamburger() {
  const btn  = document.getElementById('nav-hamburger');
  const menu = document.getElementById('nav-mobile-menu');
  if (!btn || !menu) return;

  function open() {
    menu.classList.add('is-open');
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
  }
  function close() {
    menu.classList.remove('is-open');
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.contains('is-open') ? close() : open();
  });

  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));

  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) close();
  });
})();


/* ── 8. BUTTON GLOW — rainbow trail circles ── */
(function initBtnGlow() {
  const THROTTLE_MS = 100;
  const FADE_OUT_MS = 1000;
  const REMOVE_MS   = 2200;
  const HUE_STEP    = 25;

  let hueCursor = Math.floor(Math.random() * 360);

  function attach(btn) {
    if (btn.dataset.glowBound) return;
    btn.dataset.glowBound = '1';

    let listening = false;
    let lastAdded = 0;

    btn.addEventListener('pointerenter', () => { listening = true; });
    btn.addEventListener('pointerleave', () => { listening = false; });

    btn.addEventListener('pointermove', (e) => {
      if (!listening) return;
      const now = performance.now();
      if (now - lastAdded < THROTTLE_MS) return;
      lastAdded = now;

      const rect = btn.getBoundingClientRect();
      spawnCircle(btn, e.clientX - rect.left, e.clientY - rect.top);
    });
  }

  function spawnCircle(btn, x, y) {
    const circle = document.createElement('span');
    circle.className = 'btn-glow-circle';

    const h1 = hueCursor % 360;
    const h2 = (hueCursor + 60) % 360;
    hueCursor = (hueCursor + HUE_STEP) % 360;

    const xPct = (x / btn.offsetWidth) * 100;
    circle.style.left       = `${x}px`;
    circle.style.top        = `${y}px`;
    circle.style.background =
      `linear-gradient(to right, hsl(${h1} 95% 70%) ${xPct}%, hsl(${h2} 95% 60%) ${xPct}%)`;

    btn.appendChild(circle);
    requestAnimationFrame(() => circle.classList.add('is-in'));
    setTimeout(() => circle.classList.replace('is-in', 'is-out'), FADE_OUT_MS);
    setTimeout(() => circle.remove(), REMOVE_MS);
  }

  document.querySelectorAll('.btn').forEach(attach);

  new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        if (n.matches?.('.btn')) attach(n);
        n.querySelectorAll?.('.btn').forEach(attach);
      });
    });
  }).observe(document.body, { childList: true, subtree: true });
})();
