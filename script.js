/* ═══════════════════════════════════════════════════════════
   REVERSE MORTGAGE LANDING PAGE – Mike Brouse
   Main JavaScript
═══════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════
   TESTIMONIAL CAROUSEL
════════════════════════════════════ */
(function initCarousel() {
  const track       = document.getElementById('carouselTrack');
  const dotsWrap    = document.getElementById('carouselDots');
  const progressBar = document.getElementById('carouselProgressBar');
  const prevBtn     = document.getElementById('carouselPrev');
  const nextBtn     = document.getElementById('carouselNext');
  const wrapper     = document.getElementById('testimonialCarousel');

  if (!track) return;

  const cards       = Array.from(track.querySelectorAll('.tc-card'));
  const TOTAL       = cards.length;
  const INTERVAL_MS = 2500; // auto-advance every 2.5 s
  let   current     = 0;
  let   timer       = null;
  let   progress    = 0;
  let   rafId       = null;
  let   lastTime    = null;
  let   paused      = false;

  /* ── Determine visible cards based on viewport ── */
  function getVisible() {
    const w = window.innerWidth;
    if (w <= 580) return 1;
    if (w <= 900) return 2;
    return 3;
  }

  /* ── Total "page" positions = total cards minus visible cards ── */
  function maxIndex() { return Math.max(0, TOTAL - getVisible()); }

  /* ── Build dot buttons ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    const pages = maxIndex() + 1;
    for (let i = 0; i < pages; i++) {
      const btn = document.createElement('button');
      btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      btn.setAttribute('aria-label', 'Go to review ' + (i + 1));
      btn.addEventListener('click', () => goTo(i, true));
      dotsWrap.appendChild(btn);
    }
  }

  /* ── Update dot active state ── */
  function syncDots() {
    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  /* ── Slide to index ── */
  function goTo(index, resetTimer = false) {
    current = Math.max(0, Math.min(index, maxIndex()));
    // Card width + gap
    const cardEl   = cards[0];
    const gap      = 24;
    const cardW    = cardEl.offsetWidth + gap;
    track.style.transform = `translateX(-${current * cardW}px)`;
    syncDots();
    if (resetTimer) resetProgress();
  }

  /* ── Arrow handlers ── */
  prevBtn.addEventListener('click', () => {
    goTo(current > 0 ? current - 1 : maxIndex(), true);
  });
  nextBtn.addEventListener('click', () => {
    goTo(current < maxIndex() ? current + 1 : 0, true);
  });

  /* ── RAF-driven progress bar & auto-advance ── */
  function resetProgress() {
    progress  = 0;
    lastTime  = null;
    if (rafId) cancelAnimationFrame(rafId);
    if (!paused) startRaf();
  }

  function startRaf() {
    rafId = requestAnimationFrame(function tick(now) {
      if (paused) return;
      if (!lastTime) lastTime = now;
      progress += (now - lastTime) / INTERVAL_MS;
      lastTime  = now;
      progressBar.style.width = Math.min(progress * 100, 100) + '%';
      if (progress >= 1) {
        goTo(current < maxIndex() ? current + 1 : 0);
        progress = 0;
        lastTime = null;
      }
      rafId = requestAnimationFrame(tick);
    });
  }

  /* ── Pause on hover/focus ── */
  wrapper.addEventListener('mouseenter', () => { paused = true; });
  wrapper.addEventListener('mouseleave', () => { paused = false; lastTime = null; startRaf(); });
  wrapper.addEventListener('focusin',    () => { paused = true; });
  wrapper.addEventListener('focusout',   () => { paused = false; lastTime = null; startRaf(); });

  /* ── Touch / swipe support ── */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1, true) : goTo(current - 1, true);
  }, { passive: true });

  /* ── Keyboard ── */
  wrapper.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1, true);
    if (e.key === 'ArrowRight') goTo(current + 1, true);
  });

  /* ── Resize recalculation ── */
  window.addEventListener('resize', () => {
    buildDots();
    if (current > maxIndex()) current = maxIndex();
    goTo(current);
  }, { passive: true });

  /* ── Bootstrap ── */
  buildDots();
  goTo(0);
  startRaf();
})();


const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── MOBILE MENU ── */
const menuToggle = document.getElementById('menuToggle');
const navLinks   = document.getElementById('navLinks');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── SMOOTH SCROLL OFFSET (fixed navbar) ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 12;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ── SCROLL-IN ANIMATIONS ── */
const animateTargets = [
  '.about-card',
  '.benefit-card',
  '.calc-form',
  '.tc-card',
  '.trust-bar-inner',
];
animateTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('observe-animate');
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in-view'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.observe-animate').forEach(el => observer.observe(el));

/* ── COUNTER ANIMATION ── */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
const trustBar = document.querySelector('.trust-bar');
if (trustBar) counterObserver.observe(trustBar);

/* ── AGE SPINNER ── */
function spinAge(delta) {
  const input = document.getElementById('borrowerAge');
  if (!input) return;
  let val = parseInt(input.value, 10) || 62;
  val = Math.min(120, Math.max(62, val + delta));
  input.value = val;
}
window.spinAge = spinAge; // expose globally for onclick

/* ── FORMAT CURRENCY INPUTS ── */
['homeValue', 'mortgageBalance'].forEach(id => {
  const input = document.getElementById(id);
  if (!input) return;
  input.addEventListener('blur', () => {
    const raw = input.value.replace(/[^\d]/g, '');
    if (raw) input.value = parseInt(raw, 10).toLocaleString();
  });
  input.addEventListener('focus', () => {
    input.value = input.value.replace(/,/g, '');
  });
});

/* ── CALCULATOR LOGIC ── */
function calculateEstimate() {
  const homeValueRaw   = document.getElementById('homeValue').value.replace(/,/g, '');
  const ageVal         = parseInt(document.getElementById('borrowerAge').value, 10);
  const mortgageRaw    = document.getElementById('mortgageBalance').value.replace(/,/g, '') || '0';

  const homeValue      = parseFloat(homeValueRaw);
  const mortgageBalance = parseFloat(mortgageRaw);
  const resultEl       = document.getElementById('calcResult');
  const amountEl       = document.getElementById('resultAmount');

  if (isNaN(homeValue) || homeValue <= 0) {
    shakeField('homeValue');
    return;
  }
  if (isNaN(ageVal) || ageVal < 62) {
    shakeField('borrowerAge');
    return;
  }

  // HECM approximation: PLF based on age (simplified)
  // PLF table rough approximation: 62 → 0.40, 70 → 0.47, 80 → 0.55, 90+ → 0.63
  const ageFactor = Math.min(0.63, 0.40 + ((ageVal - 62) / 30) * 0.23);
  // HUD lending limit 2024: $1,149,825
  const lendingLimit = 1_149_825;
  const effectiveValue = Math.min(homeValue, lendingLimit);
  const grossProceeds  = effectiveValue * ageFactor;
  const netProceeds    = Math.max(0, grossProceeds - mortgageBalance);

  amountEl.textContent = '$—';
  resultEl.classList.add('visible');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Animate the number
  const duration = 1200;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    amountEl.textContent = '$' + Math.floor(eased * netProceeds).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else amountEl.textContent = '$' + Math.round(netProceeds).toLocaleString();
  };
  requestAnimationFrame(step);
}
window.calculateEstimate = calculateEstimate;

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.borderColor = '#e53e3e';
  el.style.animation = 'shake .4s ease';
  setTimeout(() => {
    el.style.animation = '';
    el.style.borderColor = '';
  }, 600);
}

// Add shake keyframes dynamically
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ── NEWSLETTER ── */
function subscribeNewsletter(e) {
  e.preventDefault();
  const btn   = document.getElementById('newsletterBtn');
  const input = document.getElementById('newsletterEmail');
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
  btn.style.background = '#4CAF50';
  input.value = '';
  input.placeholder = 'You\'re subscribed!';
  setTimeout(() => {
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>';
    btn.style.background = '';
    input.placeholder = 'Email address';
  }, 3500);
  return false;
}
window.subscribeNewsletter = subscribeNewsletter;

/* ════════════════════════════════════
   WIZARD MODAL
════════════════════════════════════ */
(function initWizard() {
  const backdrop   = document.getElementById('wizBackdrop');
  const closeBtn   = document.getElementById('wizClose');
  const progressBar = document.getElementById('wizProgressBar');
  const TOTAL_STEPS = 7;
  let currentStep = 1;

  /* ── Open / Close ── */
  function openWizard() {
    currentStep = 1;
    showStep(1);
    backdrop.classList.add('open');
    backdrop.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeWizard() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  /* Attach opener to every CTA button */
  const ctaIds = [
    'heroEstimateBtn', 'heroCallBtn', 'aboutEstimateBtn',
    'calcSubmitBtn', 'resultContactBtn'
  ];
  ctaIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    // override href/onclick
    el.removeAttribute('href');
    el.setAttribute('type', 'button');
    el.addEventListener('click', e => { e.preventDefault(); openWizard(); });
  });
  // Also catch any remaining .btn-primary or .btn-xl that link to #calculator / #about
  document.querySelectorAll('a.btn[href="#calculator"], a.btn[href="#about"]').forEach(a => {
    a.addEventListener('click', e => { e.preventDefault(); openWizard(); });
  });

  closeBtn.addEventListener('click', closeWizard);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closeWizard(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWizard(); });

  /* ── Show step ── */
  function showStep(n) {
    document.querySelectorAll('.wiz-step').forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.wiz-step[data-step="${n}"]`);
    if (target) target.classList.add('active');
    // update progress bar
    const pct = n === 'success' ? 100 : Math.round((n / TOTAL_STEPS) * 100);
    progressBar.style.width = pct + '%';
    // scroll modal to top
    backdrop.querySelector('.wiz-modal').scrollTop = 0;
  }

  function next() { currentStep = Math.min(TOTAL_STEPS, currentStep + 1); showStep(currentStep); }
  function back() { currentStep = Math.max(1, currentStep - 1); showStep(currentStep); }

  /* ── Step 1–3: option clicks auto-advance ── */
  [1, 2, 3].forEach(stepNum => {
    const stepEl = document.querySelector(`.wiz-step[data-step="${stepNum}"]`);
    if (!stepEl) return;
    stepEl.querySelectorAll('.wiz-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        stepEl.querySelectorAll('.wiz-opt').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        setTimeout(() => next(), 220);
      });
    });
  });

  /* ── Step 2 back ── */
  document.getElementById('wizBack2')?.addEventListener('click', back);
  document.getElementById('wizBack3')?.addEventListener('click', back);

  /* ── Step 4: slider ── */
  const homeSlider = document.getElementById('homeValSlider');
  const homeDisplay = document.getElementById('homeValDisplay');
  function updateSlider() {
    const min = +homeSlider.min, max = +homeSlider.max, val = +homeSlider.value;
    const pct = ((val - min) / (max - min)) * 100;
    homeSlider.style.setProperty('--slider-pct', pct + '%');
    homeDisplay.textContent = '$ ' + val.toLocaleString();
  }
  homeSlider?.addEventListener('input', updateSlider);
  updateSlider();
  document.getElementById('wizCont4')?.addEventListener('click', next);
  document.getElementById('wizBack4')?.addEventListener('click', back);

  /* ── Step 5: mortgage yes/no ── */
  const mortRow = document.getElementById('mortgageInputRow');
  const step5 = document.querySelector('.wiz-step[data-step="5"]');
  step5?.querySelectorAll('.wiz-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      step5.querySelectorAll('.wiz-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (btn.dataset.val === 'yes_mort') {
        mortRow.style.display = 'block';
      } else {
        mortRow.style.display = 'none';
        setTimeout(() => next(), 220);
      }
    });
  });
  document.getElementById('wizCont5')?.addEventListener('click', next);
  document.getElementById('wizBack5')?.addEventListener('click', back);

  /* ── Step 6: ZIP validation ── */
  const zipInput  = document.getElementById('zipWiz');
  const zipCont   = document.getElementById('wizCont6');
  zipInput?.addEventListener('input', () => {
    const ok = /^\d{4,10}$/.test(zipInput.value.trim());
    zipCont.disabled = !ok;
    zipCont.classList.toggle('wiz-continue--disabled', !ok);
  });
  zipCont?.addEventListener('click', () => { if (!zipCont.disabled) next(); });
  document.getElementById('wizBack6')?.addEventListener('click', back);

  /* ── Step 7: submit ── */
  document.getElementById('wizSubmit')?.addEventListener('click', async () => {
    const name  = document.getElementById('wizName').value.trim();
    const email = document.getElementById('wizEmail').value.trim();
    if (!name || !email) {
      ['wizName','wizEmail'].forEach(id => {
        const el = document.getElementById(id);
        if (!el.value.trim()) { el.style.borderColor='#e53e3e'; setTimeout(()=>el.style.borderColor='',1500); }
      });
      return;
    }

    // Collect all wizard data
    const payload = {
      name,
      email,
      phone:           document.getElementById('wizPhone').value.trim(),
      goal:            document.querySelector('.wiz-step[data-step="1"] .wiz-opt.selected')?.dataset.val || '',
      propertyType:    document.querySelector('.wiz-step[data-step="2"] .wiz-opt.selected')?.dataset.val || '',
      timeline:        document.querySelector('.wiz-step[data-step="3"] .wiz-opt.selected')?.dataset.val || '',
      homeValue:       Number(document.getElementById('homeValSlider')?.value || 0),
      hasMortgage:     document.querySelector('.wiz-step[data-step="5"] .wiz-opt.selected')?.dataset.val || '',
      mortgageBalance: Number((document.getElementById('mortBalanceWiz')?.value || '0').replace(/,/g, '')),
      zipCode:         document.getElementById('zipWiz')?.value.trim() || '',
    };

    // Show loading state on submit button
    const submitBtn = document.getElementById('wizSubmit');
    const origText  = submitBtn.textContent;
    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled    = true;

    try {
      const res = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Server error');
    } catch (err) {
      // If API is unreachable (static dev), still show success
      console.warn('Lead API unavailable, continuing offline:', err.message);
    } finally {
      submitBtn.textContent = origText;
      submitBtn.disabled    = false;
    }

    showStep('success');
    progressBar.style.width = '100%';
  });
  document.getElementById('wizBack7')?.addEventListener('click', back);

  /* ── Success close ── */
  document.getElementById('wizDone')?.addEventListener('click', closeWizard);
})();
