// ── LENIS SMOOTH SCROLL ────────────────────────────────────
export let lenis = null;

export function initLenis() {
  // Create Lenis only when DOM is ready
  if (!lenis) {
    lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      mouseMultiplier: 1,
      touchMultiplier: 1.5,
    });
  }

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect GSAP ScrollTrigger to Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => { lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
}

// ── FADEIN OBSERVER ────────────────────────────────────────
export function initFadein() {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('inView');
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fadein').forEach(el => fadeObserver.observe(el));
}

// ── STAT COUNTERS ─────────────────────────────────────────
export function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.to({ v: 0 }, {
          v: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].v) + suffix; }
        });
      }
    });
  });
}

// ── SCROLL NAV CLASS ──────────────────────────────────────
export function initNavScroll() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;

  lenis.on('scroll', ({ scroll }) => {
    nav.classList.toggle('scrolled', scroll > 80);
  });
}

// ── HERO ENTRANCE ──────────────────────────────────────────
export function initHeroEntrance() {
  // Support both ID-based (mockup/index) and class-based (custom pages) hero elements
  const heroBg = document.getElementById('heroBg');
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 60);

  gsap.registerPlugin(ScrollTrigger);

  const heroEyebrow = document.getElementById('heroEyebrow') || document.querySelector('.hero__eyebrow');
  const heroSub = document.getElementById('heroSub') || document.querySelector('.hero__sub');
  const heroActions = document.getElementById('heroActions') || document.querySelector('.hero__actions, .hero__cta');

  if (heroEyebrow) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from(heroEyebrow, { opacity: 0, y: 18, duration: 0.8, delay: 0.3 });
    const words = document.querySelectorAll('.hero__word, .hero__h1-line');
    if (words.length) tl.from(words, { opacity: 0, y: 36, stagger: 0.07, duration: 0.95 }, '-=0.4');
    if (heroSub) tl.from(heroSub, { opacity: 0, y: 18, duration: 0.8 }, '-=0.5');
    if (heroActions) tl.from(heroActions, { opacity: 0, y: 18, duration: 0.75 }, '-=0.4');
  }
}

// ── FIX PARALLAX ON iOS ───────────────────────────────────
export function fixIOSParallax() {
  if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    const bg = document.querySelector('.locally-made__bg');
    if (bg) bg.style.backgroundAttachment = 'scroll';
  }
}
