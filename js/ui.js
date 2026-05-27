// ── MOBILE NAV HAMBURGER ──────────────────────────────────
export function initMobileNav(lenis) {
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('navMobile');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    lenis[isOpen ? 'stop' : 'start']();
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lenis.start();
    });
  });
}

// ── TESTIMONIALS CAROUSEL ─────────────────────────────────
export function initTestimonialCarousel() {
  const track = document.getElementById('testimonialsTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const dots = document.querySelectorAll('.testimonials__dot');
  const btnPrev = document.getElementById('testimonialPrev');
  const btnNext = document.getElementById('testimonialNext');

  if (!cards.length || !dots.length || !btnPrev || !btnNext) return;

  let current = 0;
  let autoTimer;

  function getVisible() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function goTo(i) {
    const total = cards.length;
    const visible = getVisible();
    const max = total - visible;
    current = Math.max(0, Math.min(i, max));
    const cardW = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${current * cardW}px)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(+dot.dataset.index);
      resetAuto();
    });
  });

  btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      const nextIdx = current + 1 > cards.length - getVisible() ? 0 : current + 1;
      goTo(nextIdx);
    }, 5500);
  }

  resetAuto();

  const testimonialsSection = document.querySelector('.testimonials');
  if (testimonialsSection) {
    testimonialsSection.addEventListener('mouseenter', () => clearInterval(autoTimer));
    testimonialsSection.addEventListener('mouseleave', resetAuto);
  }

  window.addEventListener('resize', () => goTo(current));
}

// ── SHOW TOAST NOTIFICATION ───────────────────────────────
export function showToast(message, duration = 4000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
}
